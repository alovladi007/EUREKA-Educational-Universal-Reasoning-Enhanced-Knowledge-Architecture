// FE EE course content — Signal Processing (5 topics).
// Split byte-identically from fe-ee-course-data.ts so section waves
// can be authored in parallel; spread back into FE_EE_COURSE there.
import type { TopicLesson } from '../fe-ee-course-data';

export const FE_EE_SIGNAL_PROCESSING: Record<string, TopicLesson> = {
  fee_fourier: {
    topicId: 'fee_fourier',
    title: 'Fourier Series and Fourier Transform',
    domainWeight: 'Signal Processing · 4–6%',
    overview: 'Fourier analysis decomposes signals into frequency components. Fourier Series handles periodic signals (discrete spectrum), while the Fourier Transform handles aperiodic signals (continuous spectrum). Both are essential for filtering, modulation, and spectral analysis on the FE exam.',
    sections: [
      {
        id: 'fs-series',
        title: '1. Fourier Series for Periodic Signals',
        content: `## 1.1 Trigonometric and Complex Forms

For a periodic signal with period **$T_{0}$** and fundamental frequency **$f_{0} = 1/T_{0}$**:

**Trigonometric form:**
**$x(t) = a_{0} + \\sum _{n=1}^{\\infty} a_{n}\\cos (n\\omega _{0}t) + \\sum _{n=1}^{\\infty} b_{n}\\sin (n\\omega _{0}t)$**

where ω₀ = 2πf₀ and:
- **$a_{0} = (1/T_{0}) \\int x(t) dt$** (DC component / average value)
- **$a_{n} = (2/T_{0}) \\int x(t)\\cdot \\cos (n\\omega _{0}t) dt$**
- **$b_{n} = (2/T_{0}) \\int x(t)\\cdot \\sin (n\\omega _{0}t) dt$**

**Complex exponential form** (more compact):
**$x(t) = \\sum _{n=-\\infty}^{\\infty} c_{n} e^{j2\\pi nf_{0}t}$**

where **$c_{n} = (1/T_{0}) \\int x(t) \\cdot e^{-j2\\pi nf_{0}t} dt$**

## 1.2 Amplitude and Phase Spectra

The **two-sided amplitude spectrum** plots $\\lvert c_{n}\\rvert$ at every harmonic frequency $nf_{0}$, positive and negative. The **one-sided** spectrum keeps only $n \\ge 1$ and doubles the heights, plotting $A_{n} = 2\\lvert c_{n}\\rvert$ so that each line reads as the amplitude of a real sinusoid; the dc line is not doubled. Section 5.2 derives that factor of two. Either spectrum reveals:

| Signal Shape | Spectral Characteristics |
|---|---|
| **Smooth** (e.g., sinusoid) | Energy concentrated at low harmonics; rapid roll-off |
| **Sharp edges** (e.g., square wave) | Energy in many harmonics; slow 1/n roll-off |
| **Impulse train** | Flat spectrum — all harmonics equal |
| **Symmetric about zero** | Only cosine terms (bₙ = 0); aₙ nonzero |
| **Antisymmetric (odd)** | Only sine terms (aₙ = 0); bₙ nonzero |

### Gibbs Phenomenon

Truncating a Fourier Series near a discontinuity produces **overshoot of approximately 9%** regardless of the number of terms — this is the Gibbs phenomenon. It does not vanish as more terms are added; only the region of overshoot narrows.

![Partial sums of the square-wave Fourier series with harmonics up to n equal to 1, 7, and 49, drawn over the ideal square wave. Each added harmonic steepens the edge, but the overshoot beside the jump stays near nine percent of the step: it narrows without shrinking.](/courses/fe-ee/figures/sig-square-partial-sums.svg)

The figure is worth a minute of study because it makes two separate exam facts
visible at once. First, the single-harmonic curve is already a respectable
rough copy of the square wave — the fundamental carries most of the energy,
which is why the 1/n coefficient decay matters. Second, the ringing beside the
jump in the 49-harmonic curve is *taller than* the 7-harmonic curve's plateau
error but *narrower*: convergence near a discontinuity is in area, not in peak
value. When a question asks what happens to the reconstruction error as terms
are added, the correct answer is that it concentrates near the jump, not that
it disappears.`,
        examTip: 'For FE exam problems, exploit signal symmetry to eliminate half the computation: even signals have only cosine terms (bₙ = 0), odd signals have only sine terms (aₙ = 0), and half-wave symmetric signals have only odd harmonics.',
      },
      {
        id: 'fs-transform',
        title: '2. Fourier Transform and Energy Spectra',
        content: `## 2.1 Fourier Transform for Aperiodic Signals

The **Fourier Transform** extends spectral analysis to non-periodic signals, producing a **continuous** frequency spectrum:

**$X(f) = \\int x(t) \\cdot e^{-j2\\pi ft} dt$**

**Inverse: x(t) = ∫ X(f) · e^(j2πft) df**

### Common Transform Pairs

| Time Domain | Frequency Domain |
|---|---|
| Rectangular pulse rect(t/τ) | τ · sinc(fτ) |
| Gaussian e^(−πt²) | e^(−πf²) (Gaussian in both domains) |
| Exponential e^(−at)·u(t) | $1/(a + j2\\pi f)$ |
| Impulse δ(t) | 1 (flat — all frequencies present) |
| Constant 1 | δ(f) (single frequency at DC) |

## 2.2 Parseval's Theorem and Energy

**Parseval's theorem** states energy is conserved across domains:

**$\\int |x(t)|^{2} dt = \\int |X(f)|^{2} df$**

The **Energy Spectral Density (ESD)** is |X(f)|² — it shows how signal energy is distributed across frequency.

### Bandwidth

The **bandwidth** of a signal is the range of significant frequency content. Definitions vary:

- **3-dB bandwidth**: frequencies where |X(f)| drops to 1/√2 of peak
- **Null-to-null bandwidth**: distance between first zeros of |X(f)|
- **99% energy bandwidth**: range containing 99% of signal energy

### Duality Property

Fourier analysis has a **duality** property: if x(t) ↔ X(f), then X(t) ↔ x(−f). This means a wide pulse in time produces a narrow spectrum, and vice versa — the **time-bandwidth uncertainty principle**: Δt · Δf ≥ 1/(4π).`,
        examTip: 'On the FE exam, remember the sinc function relationship: a rectangular pulse of width τ has a sinc spectrum with first null at f = 1/τ. Wider pulses have narrower spectra (better frequency localization) and vice versa. This tradeoff appears in both signal processing and communications problems.',
        importantNote: 'Differentiation in time corresponds to multiplication by j2πf in frequency. This means sharp signal transitions (large derivatives) require high-frequency content — the fundamental reason why bandwidth-limited channels distort signals with sharp edges.',
      },
      {
        id: 'fs-exam-walkthrough',
        title: '3. Exam Problem Walkthrough: Fourier Analysis',
        content: `## 3.1 Problem: Fourier Series of a Square Wave

**Given**: A square wave with amplitude A = 5 V, period $T_{0}$ = 4 ms, and 50% duty cycle (symmetric about zero).

**Find**: Fundamental frequency, first three nonzero Fourier coefficients, and sketch the amplitude spectrum.

## 3.2 Step-by-Step Solution

**Step 1 — Fundamental frequency:**

**$f_{0} = 1/T_{0} = 1/(4 \\times 10^{-3}) = 250\\ \\mathrm{Hz}$**; ω₀ = 2πf₀ = 500π rad/s

**Step 2 — Identify symmetry:**

A symmetric square wave (odd function) has **only sine terms** (aₙ = 0 for all n, including $a_{0}$ = 0).

**Step 3 — Compute Fourier coefficients:**

For an odd-symmetric square wave of amplitude A:

**$b_{n} = (4A)/(n\\pi)$** for n = 1, 3, 5, ... (odd harmonics only)

**$b_{n} = 0$** for n = 2, 4, 6, ... (even harmonics vanish due to half-wave symmetry)

| Harmonic | Frequency | Coefficient bₙ | Amplitude |
|---|---|---|---|
| n = 1 (fundamental) | 250 Hz | $4(5)/(1\\cdot \\pi) = 6.37\\ \\mathrm{V}$ | 6.37 V |
| n = 3 (3rd harmonic) | 750 Hz | $4(5)/(3\\cdot \\pi) = 2.12\\ \\mathrm{V}$ | 2.12 V |
| n = 5 (5th harmonic) | 1250 Hz | $4(5)/(5\\cdot \\pi) = 1.27\\ \\mathrm{V}$ | 1.27 V |

**Step 4 — Reconstruct the signal:**

$$x(t) \\approx 6.37\\cdot \\sin (500\\pi t) + 2.12\\cdot \\sin (1500\\pi t) + 1.27\\cdot \\sin (2500\\pi t) +$$...

The amplitude spectrum shows spikes at odd multiples of 250 Hz, decreasing as 1/n.

## 3.3 Critical Exam Trap: Fourier Series vs. Fourier Transform

| Feature | Fourier Series | Fourier Transform |
|---|---|---|
| **Applies to** | **Periodic** signals | **Aperiodic** signals |
| **Spectrum type** | **Discrete** (spikes at nf₀) | **Continuous** (smooth curve) |
| **Coefficients** | cₙ (dimensionless or V) | $X(f)$ (V/Hz or V\u00b7s) |
| **Energy** | Infinite (signal extends forever) | Finite (Parseval applies) |

**Common mistake**: Using the Fourier Transform on a periodic signal or Fourier Series on a one-time pulse. The Series is for periodic signals that repeat forever; the Transform is for finite-energy aperiodic signals.

## 3.4 Symmetry Shortcuts for Fast Solutions

- **Even function** (symmetric about t = 0): bₙ = 0 → only cosine terms
- **Odd function** (antisymmetric): aₙ = 0 → only sine terms
- **Half-wave symmetry** (x(t) = −x(t + $T_{0}$/2)): only odd harmonics (n = 1, 3, 5, ...)
- **Quarter-wave even**: only odd cosine harmonics
- **Quarter-wave odd**: only odd sine harmonics

Exploiting symmetry can eliminate 50–75% of the computation on an exam problem.`,
        examTip: 'If the FE exam gives a symmetric square wave or triangle wave, immediately recognize: odd function → sine terms only, half-wave symmetry → odd harmonics only. The coefficients decrease as 1/n for square waves and 1/n² for triangle waves. These facts alone can answer many problems without any integration.',
        importantNote: 'The 1/n roll-off of the square wave spectrum means you need many harmonics to reconstruct the signal accurately. This is why square waves have high bandwidth requirements and why the Gibbs phenomenon (9% overshoot at discontinuities) persists regardless of how many terms you include.',
      },
      {
        id: 'fs-properties-convolution',
        title: '4. Transform Properties and Continuous-Time Convolution',
        content: `## 4.1 The property table that replaces integration

Most transform questions do not ask you to evaluate the defining integral.
They hand you a signal that is a shifted, scaled, or modulated version of one
whose transform you already know, and the property table turns that
recognition into a one-line answer. Learn the table as a set of moves, not as
eight isolated facts.

| Property | Time domain | Frequency domain |
|---|---|---|
| Linearity | $a\\cdot x(t) + b\\cdot y(t)$ | $a\\cdot X(f) + b\\cdot Y(f)$ |
| Time shift | $x(t - t_{0})$ | $X(f)\\cdot e^{-j2\\pi f t_{0}}$ |
| Modulation (freq. shift) | $x(t)\\cdot e^{j2\\pi f_{0}t}$ | $X(f - f_{0})$ |
| Time scaling (a > 0) | $x(at)$ | $(1/a)\\cdot X(f/a)$ |
| Duality | $X(t)$ | $x(-f)$ |
| Differentiation | $dx/dt$ | $j2\\pi f\\cdot X(f)$ |
| Convolution | $x(t) * h(t)$ | $X(f)\\cdot H(f)$ |
| Multiplication | $x(t)\\cdot y(t)$ | $X(f) * Y(f)$ |

Three of these carry nearly all the exam weight:

- **Time shift changes phase only.** Delaying a signal multiplies its spectrum
  by a complex exponential of unit magnitude, so the *magnitude* spectrum is
  untouched. A question showing two signals with identical magnitude spectra
  and different phase is almost always a delay question.
- **Scaling trades the two domains against each other.** Compressing a signal
  in time (a > 1) stretches its spectrum wider and reduces its height. This is
  the time-bandwidth trade of Section 2 restated as an operation you can apply.
- **Modulation splits the spectrum.** Multiplying by $\\cos (2\\pi f_{0}t)$ — half the
  sum of two complex exponentials — copies half the spectrum up to $+f_{0}$ and
  half down to $-f_{0}$. Every AM communications question is this row of the
  table. **Worked**: a baseband signal occupying 0 to 4 kHz multiplied by a
  100 kHz carrier occupies 96 kHz to 104 kHz — the one-sided width doubles
  from 4 kHz to 8 kHz because the negative-frequency half of the spectrum is
  dragged up into view.

## 4.2 Convolution: the operation that defines LTI systems

For a linear time-invariant system with impulse response h(t), the output for
any input x(t) is the **convolution integral**:

**$y(t) = x(t) * h(t) = \\int x(\\tau )\\cdot h(t - \\tau ) d\\tau$**

The integral is over all τ, and t plays the role of a parameter: for each
output instant t you evaluate one complete integral. Convolution is
commutative — $x * h = h * x$ — so you may flip whichever signal makes the
algebra easier.

### The graphical recipe

1. **Rewrite both signals in τ.** One of them stays as it is: x(τ).
2. **Flip** the other about the vertical axis: h(−τ).
3. **Shift** the flipped signal by t: h(t − τ). Positive t slides it right.
4. **Multiply and integrate** the overlapping part. The overlap's shape
   changes only when an edge of one signal crosses an edge of the other, so
   the time axis splits into a few **regions**, each with its own integral.
5. Work region by region and check continuity where regions meet.

The regions are the whole method. Identify where the overlap pattern changes
before integrating anything, and each individual integral becomes short.

## 4.3 Worked example: a pulse through a first-order system

**Given**: a rectangular pulse $x(t) = u(t) - u(t-2)$ (amplitude 1 V, lasting
2 s) drives a system with impulse response $h(t) = e^{-t}u(t)$ — a first-order
lag with a 1 s time constant.

**Handbook relation**: $y(t) = \\int x(\\tau ) h(t-\\tau ) d\\tau$.

**Region 1, t < 0**: the flipped-and-shifted exponential has not yet reached
the pulse; no overlap, so **y = 0**. Two causal signals always convolve to a
causal result — if your answer is nonzero before both inputs start, the setup
is wrong.

**Region 2, 0 ≤ t < 2**: the overlap runs from τ = 0 to τ = t:

$$y(t) = \\int_{0}^{t} e^{-(t-\\tau )} d\\tau = 1 - e^{-t}$$

Substituting: y(1) = 1 − e^{−1} = **0.632 V**; approaching the pulse's end,
y(2) = 1 − e^{−2} = **0.865 V**. This is exactly an RC charging curve, which
is the physical read: while the pulse is present, the system charges toward
1 V.

**Region 3, t ≥ 2**: the pulse is entirely in the past; the overlap is fixed
at τ from 0 to 2:

$$y(t) = \\int_{0}^{2} e^{-(t-\\tau )} d\\tau = (1 - e^{-2})\\cdot e^{-(t-2)}$$

At t = 2 this gives 0.865 V — matching Region 2 at the boundary, which is the
continuity check — and at t = 3, y = 0.865 × e^{−1} = **0.318 V**. After the
pulse ends, the stored response simply decays.

## 4.4 Fast checks that catch most convolution errors

**Widths add.** The duration of $x * h$ is the duration of x plus the duration
of h. Convolving the 2 s pulse above with a copy of itself gives a **triangle**
lasting 4 s, peaking at value 2 at t = 2 s. If your result's support has the
wrong width, a region boundary was misplaced.

**Areas multiply.** The area under $x * h$ equals (area of x) × (area of h).
For the pulse-with-itself example: 2 × 2 = 4, and the triangle's area is
(1/2)(4)(2) = 4. Agrees. This one-line check costs nothing and catches
dropped factors.

**The convolution theorem is the cross-check.** In frequency,
$Y(f) = X(f)\\cdot H(f)$. The rectangular pulse transforms to a sinc, so the
triangle must transform to sinc² — which it does. When time-domain convolution
turns ugly, transforming both signals, multiplying, and inverting is not a
different theory; it is the same computation routed through the other domain.

**Duality closes the loop.** Because rect in time gives sinc in frequency,
duality says a sinc-shaped *pulse* has a perfectly rectangular, band-limited
spectrum — which is why the ideal low-pass filter's impulse response is a
sinc, and why that ideal filter is unrealizable: the sinc extends infinitely
in both directions of time.

Discrete-time convolution — the sum version of this operation, with its own
tabular shortcut — is covered with the DFT material, where it pairs naturally
with the FFT's fast-convolution use.`,
        examTip: 'Flip the SIMPLER of the two signals — convolution is commutative, and flipping a rectangle is free while flipping an exponential invites sign errors. Then find the region boundaries (where edges cross) before integrating anything: on the FE exam, most convolution credit is earned by setting the limits correctly.',
        importantNote: 'Convolution in time is multiplication in frequency, and vice versa. This single sentence links filtering (multiplying a spectrum by H(f)) to the time-domain smearing a filter causes, and it is the reason windowing a signal (multiplication in time) spreads its spectrum (convolution in frequency).',
      },
      {
        id: 'fs-orthogonality-forms',
        title: '5. Orthogonality, the Three Forms, and the Symmetry Proofs',
        content: `## 5.1 The integral that does the selecting

Sections 1 through 3 handed you coefficient formulas to memorise. They are not
arbitrary. Every one of them falls out of a single property of sinusoids, and
seeing that property once removes the need to trust the formulas on faith.

Begin by assuming the expansion exists — that some periodic x(t) of period
$T_{0}$ can be written as a constant plus a pile of harmonics:

$$x(t) = a_{0} + \\sum_{n=1}^{\\infty}\\left[\\,a_{n}\\cos (n\\omega _{0}t) + b_{n}\\sin (n\\omega _{0}t)\\,\\right],\\qquad \\omega _{0} = \\frac{2\\pi }{T_{0}}$$

Now ask how to reach into that pile and pull out one particular $a_{m}$. Multiply
the whole equation by $\\cos (m\\omega _{0}t)$ and integrate over exactly one period.
Every term on the right becomes an integral of a product of two sinusoids, and
those integrals obey three rules:

$$\\int_{0}^{T_{0}}\\cos (m\\omega _{0}t)\\cos (n\\omega _{0}t)\\,dt = \\frac{T_{0}}{2}\\,\\delta _{mn}\\qquad (m,n \\ge 1)$$

$$\\int_{0}^{T_{0}}\\sin (m\\omega _{0}t)\\sin (n\\omega _{0}t)\\,dt = \\frac{T_{0}}{2}\\,\\delta _{mn}\\qquad (m,n \\ge 1)$$

$$\\int_{0}^{T_{0}}\\cos (m\\omega _{0}t)\\sin (n\\omega _{0}t)\\,dt = 0\\qquad \\text{for every } m \\text{ and } n$$

The Kronecker symbol $\\delta _{mn}$ is 1 when the indices match and 0 otherwise, so
the whole infinite sum collapses to one surviving term. Nothing about this is
mysterious; it follows from the product-to-sum identity and the fact that a
sinusoid completes a whole number of cycles in a period. Write the product as a
sum of two sinusoids:

$$\\cos \\alpha \\,\\cos \\beta = \\tfrac{1}{2}\\cos (\\alpha - \\beta ) + \\tfrac{1}{2}\\cos (\\alpha + \\beta )$$

Then note that any harmonic of $\\omega _{0}$ integrates to zero over a period,
because it starts and finishes at the same point on its own cycle:

$$\\int_{0}^{T_{0}}\\cos (k\\omega _{0}t)\\,dt = \\left[\\frac{\\sin (k\\omega _{0}t)}{k\\omega _{0}}\\right]_{0}^{T_{0}} = 0\\qquad (k \\ne 0,\\ k \\text{ an integer})$$

Applying both facts:

$$\\int_{0}^{T_{0}}\\cos (m\\omega _{0}t)\\cos (n\\omega _{0}t)\\,dt = \\tfrac{1}{2}\\int_{0}^{T_{0}}\\cos ((m-n)\\omega _{0}t)\\,dt + \\tfrac{1}{2}\\int_{0}^{T_{0}}\\cos ((m+n)\\omega _{0}t)\\,dt$$

The second integral is always zero, since $m+n \\ge 2$. The first is zero too —
unless $m = n$, in which case its integrand is the constant 1 and the integral
is $T_{0}$, leaving $T_{0}/2$ after the one-half. That single exception is the
entire mechanism.

![Two running integrals accumulated across one period. The product of a harmonic with itself accumulates steadily and finishes at one; the product of two different harmonics wanders up and down and finishes exactly at zero. Only the matched pair survives, which is why the coefficient formula extracts one term and discards all the rest.](/courses/fe-ee/figures/sig2-orthogonality.svg)

Read the figure as an experiment rather than an illustration. Both curves are
built by accumulating the product of two cosines from the start of the period
onward. The orange curve wanders — at some moments it is genuinely positive —
but by the closing instant of the period it has returned to zero to twelve
decimal places. If you stopped the integration anywhere short of a full period
you would extract garbage, which is exactly why the limits in a Fourier
coefficient integral must span one complete period and why any period will do.

With the orthogonality rules in hand, the integrated equation reads
$\\int x\\cos (m\\omega _{0}t)dt = a_{m}(T_{0}/2)$, so

$$a_{m} = \\frac{2}{T_{0}}\\int_{0}^{T_{0}}x(t)\\cos (m\\omega _{0}t)\\,dt,\\qquad b_{m} = \\frac{2}{T_{0}}\\int_{0}^{T_{0}}x(t)\\sin (m\\omega _{0}t)\\,dt$$

Repeating the argument with the constant function 1 in place of a cosine gives
the average value, and here the factor is $1/T_{0}$ rather than $2/T_{0}$ because
$\\int_{0}^{T_{0}}1\\cdot 1\\,dt = T_{0}$, not $T_{0}/2$:

$$a_{0} = \\frac{1}{T_{0}}\\int_{0}^{T_{0}}x(t)\\,dt$$

That asymmetric factor is a favourite exam trap. If you apply $2/T_{0}$ to the dc
term you double it, and every reconstruction you attempt afterward sits at the
wrong level.

## 5.2 Worked example: moving between the three forms

**Given**: a periodic signal whose third-harmonic coefficients are
$a_{3} = -3.00\\ \\mathrm{V}$ and $b_{3} = 4.00\\ \\mathrm{V}$.

**Find**: the amplitude-phase pair $(A_{3}, \\phi _{3})$ and the complex coefficient
$c_{3}$.

**Handbook relation**: the amplitude-phase form is
$x(t) = A_{0} + \\sum _{n=1}^{\\infty} A_{n}\\cos (n\\omega _{0}t + \\phi _{n})$. Expand one term with
the cosine addition rule:

$$A_{n}\\cos (n\\omega _{0}t + \\phi _{n}) = A_{n}\\cos \\phi _{n}\\cos (n\\omega _{0}t) - A_{n}\\sin \\phi _{n}\\sin (n\\omega _{0}t)$$

Matching this against the trigonometric form term by term gives
$a_{n} = A_{n}\\cos \\phi _{n}$ and $b_{n} = -A_{n}\\sin \\phi _{n}$, hence

$$A_{n} = \\sqrt{a_{n}^{2} + b_{n}^{2}},\\qquad \\tan \\phi _{n} = \\frac{-b_{n}}{a_{n}}$$

**Substitution**: $A_{3} = \\sqrt{a_{3}^{2} + b_{3}^{2}}$ with the given values is
$\\sqrt{9.00 + 16.00}$, and $9.00 + 16.00 = 25.00$, so $A_{3} = 5.00\\ \\mathrm{V}$.
For the phase, $-b_{3} = -4.00$ and $a_{3} = -3.00$ place the pair in the third
quadrant, so the two-argument arctangent is required:

$$\\phi _{3} = \\operatorname{atan2}(-4.00,\\,-3.00) = -180^{\\circ } + 53.13^{\\circ } = -126.87^{\\circ }$$

**Answer**: $A_{3} = 5.00\\ \\mathrm{V}$ at $\\phi _{3} = -126.87^{\\circ }$.

For the complex form, Euler's identities turn each real sinusoid into a pair of
counter-rotating exponentials:

$$\\cos (n\\omega _{0}t) = \\tfrac{1}{2}\\left(e^{jn\\omega _{0}t} + e^{-jn\\omega _{0}t}\\right),\\qquad \\sin (n\\omega _{0}t) = \\tfrac{1}{2j}\\left(e^{jn\\omega _{0}t} - e^{-jn\\omega _{0}t}\\right)$$

Substituting and collecting the coefficient of $e^{jn\\omega _{0}t}$ gives the bridge
between the real and complex descriptions:

$$c_{n} = \\tfrac{1}{2}\\left(a_{n} - j\\,b_{n}\\right),\\qquad c_{-n} = c_{n}^{*},\\qquad c_{0} = a_{0}$$

$$\\lvert c_{n}\\rvert = \\tfrac{1}{2}A_{n},\\qquad \\angle c_{n} = \\phi _{n}$$

**Substitution**: $c_{3} = \\tfrac{1}{2}(-3.00 - j\\,4.00) = -1.50 - j\\,2.00\\ \\mathrm{V}$.
Its magnitude is $\\sqrt{2.25 + 4.00}$, and $2.25 + 4.00 = 6.25$, whose square
root is $2.50\\ \\mathrm{V}$ — exactly half of $A_{3}$, as the bridge promises.

**Check**: the negative-index partner is $c_{-3} = -1.50 + j\\,2.00\\ \\mathrm{V}$, and
the two together carry $\\lvert c_{3}\\rvert ^{2} + \\lvert c_{-3}\\rvert ^{2} = 6.25 + 6.25 = 12.50\\ \\mathrm{V}^{2}$
of mean power, which matches $A_{3}^{2}/2 = 12.50\\ \\mathrm{V}^{2}$ computed from the
one-sided amplitude. Any conversion that fails this power check has dropped a
factor of two somewhere.

| Form | Written as | Spectrum runs over | Best for |
|---|---|---|---|
| Trigonometric | $a_{0} + \\sum [a_{n}\\cos + b_{n}\\sin ]$ | $n \\ge 1$, one-sided | hand integration, symmetry arguments |
| Amplitude-phase | $A_{0} + \\sum A_{n}\\cos (n\\omega _{0}t + \\phi _{n})$ | $n \\ge 1$, one-sided | reading a measured spectrum analyser trace |
| Complex exponential | $\\sum c_{n}e^{jn\\omega _{0}t}$ | all integers $n$, two-sided | algebra, filtering, and the leap to the transform |

The row that catches people out is the third. A two-sided spectrum splits each
real harmonic into two half-height lines at $\\pm nf_{0}$, so a plot of
$\\lvert c_{n}\\rvert$ shows half the amplitude a spectrum analyser would report.
Ask which convention a question uses before comparing a computed number against
a plotted one; a factor-of-two disagreement here is almost never an arithmetic
slip.

## 5.3 Symmetry proved, not asserted

Symmetry arguments are the cheapest points on this topic, and they are cheap
because each one is a two-line proof rather than a fact to memorise.

**Even signals.** If $x(-t) = x(t)$, then the product $x(t)\\sin (n\\omega _{0}t)$ is
odd, since it is even times odd. Integrating an odd function over an interval
symmetric about the origin gives zero:

$$b_{n} = \\frac{2}{T_{0}}\\int_{-T_{0}/2}^{T_{0}/2}x(t)\\sin (n\\omega _{0}t)\\,dt = 0\\qquad \\text{for every } n$$

So an even signal is built from cosines and a constant. Nothing else can appear.

**Odd signals.** If $x(-t) = -x(t)$, the same argument runs with the roles
swapped: $x(t)\\cos (n\\omega _{0}t)$ is odd, so every $a_{n}$ vanishes, and taking
$n = 0$ shows the average value is zero too:

$$a_{n} = \\frac{2}{T_{0}}\\int_{-T_{0}/2}^{T_{0}/2}x(t)\\cos (n\\omega _{0}t)\\,dt = 0,\\qquad a_{0} = 0$$

**Half-wave symmetry.** This is the one worth deriving in full, because it is
the one that halves the number of terms. The defining property is that shifting
by half a period inverts the waveform:

$$x\\left(t + \\tfrac{T_{0}}{2}\\right) = -x(t)$$

Split the coefficient integral at the half period and substitute
$t = u + T_{0}/2$ in the second piece. The waveform contributes a factor of
$-1$ by the defining property, and the cosine contributes
$\\cos (n\\omega _{0}u + n\\pi ) = (-1)^{n}\\cos (n\\omega _{0}u)$. The second piece
therefore becomes $-(-1)^{n}$ times the first, and

$$a_{n} = \\frac{2}{T_{0}}\\left[1 - (-1)^{n}\\right]\\int_{0}^{T_{0}/2}x(u)\\cos (n\\omega _{0}u)\\,du$$

The bracket is 0 for even $n$ and 2 for odd $n$. Every even harmonic dies,
including the dc term, and every odd harmonic is computed from half a period
with the factor doubled. The identical argument applied to the sine integral
gives the same bracket, so the rule covers $b_{n}$ as well.

**Quarter-wave symmetry** is half-wave symmetry plus even or odd symmetry, so
it kills twice: only odd harmonics survive, and of those only the cosines (if
also even) or only the sines (if also odd). A quarter-wave symmetric waveform
can be reconstructed from a quarter of one period, which is where the name
comes from.

| Symmetry | Test | What dies | What survives |
|---|---|---|---|
| Even | $x(-t) = x(t)$ | all $b_{n}$ | dc and cosines |
| Odd | $x(-t) = -x(t)$ | all $a_{n}$ including dc | sines only |
| Half-wave | $x(t + T_{0}/2) = -x(t)$ | dc and every even harmonic | odd harmonics, both kinds |
| Quarter-wave even | half-wave and even | dc, evens, all sines | odd cosines only |
| Quarter-wave odd | half-wave and odd | dc, evens, all cosines | odd sines only |

Two cautions. First, evenness and oddness depend on where you put $t = 0$;
sliding the time origin can convert a sine series into a cosine series and back,
so a question that specifies a time reference is specifying which of the two you
will get. Second, half-wave symmetry does **not** depend on the time origin at
all — it is a property of the shape itself, which makes it the more robust test
and the one to apply first.

## 5.4 Worked example: what a quarter-period shift does to a square wave

**Given**: the odd square wave of Section 3, amplitude $A = 5\\ \\mathrm{V}$ and
period $T_{0} = 4\\ \\mathrm{ms}$, is advanced by a quarter period — equivalently,
the time origin is moved to the centre of a positive half — so that it now
sits symmetrically about $t = 0$ as a pulse of $+A$ from $-T_{0}/4$ to $+T_{0}/4$.

**Find**: the new coefficients, and whether the magnitude spectrum changed.

**Handbook relation**: the shift is $t_{0} = -T_{0}/4$ (negative, because an
advance is a shift toward earlier times), and a time shift multiplies each
complex coefficient by a unit-magnitude exponential:

$$x(t - t_{0}) \\;\\longleftrightarrow \\; c_{n}\\,e^{-jn\\omega _{0}t_{0}}$$

**Substitution**: with $t_{0} = -T_{0}/4$ the exponent is
$+jn\\omega _{0}T_{0}/4 = +jn\\pi /2$, a rotation of $+90^{\\circ }$ per harmonic
number. Applied to the original sine series this turns each $\\sin (n\\omega _{0}t)$
into $\\cos (n\\omega _{0}t)$ with an alternating sign, giving

$$x_{\\text{shifted}}(t) = \\sum_{n\\ \\text{odd}}\\frac{4A}{n\\pi }\\,(-1)^{(n-1)/2}\\cos (n\\omega _{0}t)$$

**Answer**: the shifted waveform is a pure cosine series with signs
$+,-,+,-$ on $n = 1,3,5,7$, and the amplitudes are unchanged at
$4A/(n\\pi )$ — for $A = 5\\ \\mathrm{V}$ that is 6.37 V, 2.12 V, 1.27 V and 0.909 V.

**Check**: the shifted waveform is even (the pulse straddles the origin), so
sines must be absent, and it retains half-wave symmetry, so even harmonics must
still be missing. Both predictions hold. The magnitude spectrum is untouched
because the shift multiplied every coefficient by something of magnitude one —
which is Section 4's time-shift property doing exactly what it claims.

The exam-relevant reading is that "sine series" and "cosine series" are not
properties of the waveform; they are properties of where the clock was started.
Only the magnitudes, and the symmetries that survive a shift such as the
half-wave rule, describe the signal itself.`,
        examTip: 'When a Fourier question gives you a waveform and asks only which harmonics are present, do not integrate anything. Apply the half-wave test first — it is origin-independent, so it is the one test that cannot be sabotaged by where the problem chose to put t = 0. Then check even or odd for the given origin to decide between cosines and sines.',
        importantNote: 'The dc coefficient carries a 1/T0 factor while every other coefficient carries 2/T0. The difference is not a convention; it is the orthogonality integral of the constant function with itself, which gives T0 rather than T0/2. Using 2/T0 on the dc term doubles the average value of every reconstruction you build.',
      },
      {
        id: 'fs-waveform-catalogue',
        title: '6. Four Worked Spectra and the Decay Rate Behind Them',
        content: `## 6.1 One reference waveform set

The next four subsections work the same four shapes every FE question draws
from, all at the same size so their spectra can be compared directly: peak
value $A = 10\\ \\mathrm{V}$ and period $T_{0} = 1\\ \\mathrm{ms}$, so
$f_{0} = 1\\ \\mathrm{kHz}$ and $\\omega _{0} = 2000\\pi \\ \\mathrm{rad/s}$.

Every coefficient below was also obtained a second way, by synthesizing one
exact period of the waveform numerically and taking its discrete Fourier
transform. The closed forms and the transform agree to nine decimal places, so
a slip in the integration would have shown up rather than propagating quietly
into the tables.

## 6.2 Worked example: the square wave and its 1/n tail

**Given**: an odd square wave alternating between $+10\\ \\mathrm{V}$ and
$-10\\ \\mathrm{V}$, half a period at each level, $T_{0} = 1\\ \\mathrm{ms}$.

**Find**: the coefficients and the amplitude of the first four nonzero terms.

**Symmetry first**: the waveform is odd, so every $a_{n}$ including dc is zero.
It also has half-wave symmetry, so every even harmonic is zero. Only odd sine
terms can survive, and the half-wave rule lets the integral run over half a
period with the factor doubled.

**Handbook relation**:

$$b_{n} = \\frac{4}{T_{0}}\\int_{0}^{T_{0}/2}A\\,\\sin (n\\omega _{0}t)\\,dt = \\frac{4A}{T_{0}}\\left[\\frac{-\\cos (n\\omega _{0}t)}{n\\omega _{0}}\\right]_{0}^{T_{0}/2}$$

Evaluating with $\\omega _{0}T_{0} = 2\\pi $ leaves
$b_{n} = (2A/n\\pi )\\left[1 - \\cos (n\\pi )\\right]$, and since $\\cos (n\\pi ) = (-1)^{n}$
the bracket is 2 for odd $n$ and 0 for even $n$:

$$b_{n} = \\frac{4A}{n\\pi }\\ \\ (n \\text{ odd}),\\qquad b_{n} = 0\\ \\ (n \\text{ even})$$

**Substitution**: with $4A = 40\\ \\mathrm{V}$,

$$b_{1} = \\frac{40}{\\pi } = \\frac{40}{3.14159} = 12.7324\\ \\mathrm{V},\\qquad b_{3} = \\frac{40}{3\\pi } = \\frac{40}{9.42478} = 4.2441\\ \\mathrm{V}$$

$$b_{5} = \\frac{40}{5\\pi } = \\frac{40}{15.70796} = 2.5465\\ \\mathrm{V},\\qquad b_{7} = \\frac{40}{7\\pi } = \\frac{40}{21.99115} = 1.8189\\ \\mathrm{V}$$

**Answer**: 12.7324 V at 1 kHz, 4.2441 V at 3 kHz, 2.5465 V at 5 kHz and
1.8189 V at 7 kHz, with nothing at 2, 4 or 6 kHz.

**Check**: the fundamental amplitude exceeds the square wave's own peak of 10 V,
which surprises people the first time. It must: the higher harmonics enter with
signs that pull the corners back down, so the fundamental has to overshoot for
the sum to sit flat. The numerical transform of the synthesized waveform
returned 12.732395 V for this term, against $40/\\pi = 12.732395$ from the
closed form.

## 6.3 Worked example: the triangle wave and its 1/n squared tail

**Given**: a triangle wave that starts at $+10\\ \\mathrm{V}$ at $t = 0$, falls
linearly to $-10\\ \\mathrm{V}$ at $t = T_{0}/2$, and returns.

**Find**: the coefficients, and the ratio of the third harmonic to the first.

**Symmetry first**: this waveform is even about $t = 0$, so all $b_{n} = 0$, and
it is half-wave symmetric, so all even harmonics vanish. Odd cosines only — the
quarter-wave even case.

**Handbook relation**: writing the falling edge as
$x(t) = A(1 - 4t/T_{0})$ on $0 \\le t \\le T_{0}/2$ and integrating by parts,

$$a_{n} = \\frac{4}{T_{0}}\\int_{0}^{T_{0}/2}A\\left(1 - \\frac{4t}{T_{0}}\\right)\\cos (n\\omega _{0}t)\\,dt = \\frac{8A}{n^{2}\\pi ^{2}}\\ \\ (n\\ \\text{odd})$$

**Substitution**: with $8A = 80\\ \\mathrm{V}$ and $\\pi ^{2} = 9.8696$,

$$a_{1} = \\frac{80}{9.8696} = 8.1057\\ \\mathrm{V},\\qquad a_{3} = \\frac{80}{88.8264} = 0.9006\\ \\mathrm{V},\\qquad a_{5} = \\frac{80}{246.740} = 0.3242\\ \\mathrm{V}$$

**Answer**: 8.1057 V at 1 kHz, 0.9006 V at 3 kHz, 0.3242 V at 5 kHz.

**Check**: the third-harmonic ratio should be $1/9$ exactly, and
$0.9006/8.1057$ is $0.1111$ — one ninth. Compare the square wave, whose ratio
was one third. The triangle's harmonics collapse nine times faster, which is
the whole point of the next subsection.

## 6.4 Worked example: the sawtooth, where even harmonics survive

**Given**: a sawtooth ramping linearly from $-10\\ \\mathrm{V}$ to $+10\\ \\mathrm{V}$
across one period and snapping back, written $x(t) = 2At/T_{0}$ on
$-T_{0}/2 < t < T_{0}/2$.

**Find**: the coefficients through $n = 4$.

**Symmetry first**: odd, so cosines and dc are gone. But test the half-wave
property and it fails — at $t = 0.1T_{0}$ the waveform reads $0.2A$, while half a
period later it reads $-0.8A$, not $-0.2A$. Even harmonics therefore survive,
and this is the one shape in the reference set where they do.

**Handbook relation**: integrating by parts over the full period,

$$b_{n} = \\frac{2}{T_{0}}\\int_{-T_{0}/2}^{T_{0}/2}\\frac{2At}{T_{0}}\\sin (n\\omega _{0}t)\\,dt = \\frac{2A}{n\\pi }(-1)^{n+1}$$

**Substitution**: with $2A = 20\\ \\mathrm{V}$,

$$b_{1} = \\frac{20}{3.14159} = 6.3662\\ \\mathrm{V},\\qquad b_{2} = -\\frac{20}{6.28319} = -3.1831\\ \\mathrm{V},\\qquad b_{3} = \\frac{20}{9.42478} = 2.1221\\ \\mathrm{V}$$

and $b_{4} = -20/12.56637 = -1.5915\\ \\mathrm{V}$.

**Answer**: 6.3662 V, 3.1831 V, 2.1221 V and 1.5915 V in magnitude at 1, 2, 3
and 4 kHz, with alternating sign.

**Check**: at the same peak value the sawtooth's fundamental is exactly half the
square wave's, because $2A/\\pi$ is half of $4A/\\pi$. It is also exactly the same
size as the dc term of the rectified sine in the next subsection, for the same
arithmetic reason — a coincidence worth noticing so it does not read as an
error later.

## 6.5 Worked example: the full-wave rectified sine

**Given**: a 60 Hz sine of 10 V amplitude passed through a full-wave rectifier,
so the output is $10\\lvert \\sin (2\\pi \\cdot 60t)\\rvert$ volts.

**Find**: the ripple fundamental frequency, the dc level, and the first three
ripple harmonics.

**Period first**: rectification folds the negative half up, so the output
repeats every half cycle of the input. Its period is
$T_{0} = 1/120\\ \\mathrm{s}$ and its fundamental is 120 Hz, not 60 Hz. Getting
this wrong is the single most common error on rectifier questions.

**Handbook relation**: the expansion of a rectified sine is

$$A\\lvert \\sin (\\omega t)\\rvert = \\frac{2A}{\\pi } - \\frac{4A}{\\pi }\\sum_{n=1}^{\\infty }\\frac{\\cos (2n\\omega t)}{4n^{2} - 1}$$

so, in terms of the output fundamental $\\omega _{0} = 2\\omega $,

$$c_{0} = \\frac{2A}{\\pi },\\qquad a_{n} = \\frac{-4A}{\\pi (4n^{2} - 1)}$$

**Substitution**: with $A = 10\\ \\mathrm{V}$,

$$c_{0} = \\frac{20}{3.14159} = 6.3662\\ \\mathrm{V},\\qquad \\lvert a_{1}\\rvert = \\frac{40}{9.42478} = 4.2441\\ \\mathrm{V}$$

$$\\lvert a_{2}\\rvert = \\frac{40}{47.12389} = 0.8488\\ \\mathrm{V},\\qquad \\lvert a_{3}\\rvert = \\frac{40}{109.95574} = 0.3638\\ \\mathrm{V}$$

**Answer**: 6.3662 V of dc, then ripple at 120 Hz (4.2441 V), 240 Hz (0.8488 V)
and 360 Hz (0.3638 V).

![Line spectrum of a full-wave rectified sine of ten volt peak. A dc line of 6.3662 volts, then ripple lines at 120, 240, 360, 480 and 600 hertz whose heights fall as one over the quantity four n squared minus one. The first ripple line is exactly two thirds of the dc line.](/courses/fe-ee/figures/sig2-rectified-spectrum.svg)

**Check**: the ratio of the first ripple term to the dc term should be
$[4A/(3\\pi )]/[2A/\\pi ] = 2/3$ exactly, independent of $A$. It is. That exact
two-thirds is a useful sanity check on any rectifier filter calculation: if a
computed ripple-to-dc ratio at the fundamental is not 0.667 before filtering,
something upstream is wrong.

The ripple factor, defined as the rms of everything except dc divided by the dc
level, follows from the same numbers. The total mean square of a rectified sine
is $A^{2}/2 = 50\\ \\mathrm{V}^{2}$, and the dc term alone carries
$(2A/\\pi )^{2} = 40.5285\\ \\mathrm{V}^{2}$, so the ripple carries
$50 - 40.5285 = 9.4715\\ \\mathrm{V}^{2}$ and

$$\\text{ripple factor} = \\frac{\\sqrt{9.4715}}{6.3662} = \\frac{3.0776}{6.3662} = 0.4834$$

That 0.483 is the textbook full-wave figure, and it comes out of Fourier
bookkeeping rather than being memorised separately. In closed form it is
$\\sqrt{\\pi ^{2}/8 - 1}$.

## 6.6 Smoothness sets the decay rate

Collecting the four results exposes the pattern that examiners actually test.

| Waveform | Continuity | Harmonics present | Coefficient law | Decay |
|---|---|---|---|---|
| Square | jumps | odd only | $4A/(n\\pi )$ | $1/n$ |
| Sawtooth | jumps | all $n$ | $2A/(n\\pi )$ | $1/n$ |
| Full-wave rectified | continuous, corner | all $n$ plus dc | $4A/[\\pi (4n^{2}-1)]$ | $1/n^{2}$ |
| Triangle | continuous, corner | odd only | $8A/(n^{2}\\pi ^{2})$ | $1/n^{2}$ |

The rule behind the table: if the lowest-order derivative that contains a jump
is the $k$-th — with $k = 0$ meaning the waveform itself jumps — the
coefficients fall off as $1/n^{k+1}$. A square wave jumps in the signal itself, so $k = 0$ and the decay
is $1/n$. A triangle is continuous but its slope jumps at each corner, so
$k = 1$ and the decay is $1/n^{2}$. A signal with no discontinuity in any
derivative — a pure sinusoid, a Gaussian pulse train — has coefficients that
fall faster than any power of $n$.

![Harmonic amplitude against harmonic number on logarithmic axes for square, sawtooth and triangle waves of the same ten volt peak. Square and sawtooth lie on a straight line of slope minus one; the triangle lies on a steeper line of slope minus two. Smoothness in the time domain buys steepness in the spectrum.](/courses/fe-ee/figures/sig2-decay-compare.svg)

Log-log axes turn each decay law into a straight line whose slope you can read
off, which is why spectrum plots in this field are almost always logarithmic.
The practical consequence is a bandwidth statement, and the power ledger of
Section 7 puts numbers on it: a square wave still has 4.04% of its power above
the ninth harmonic, while a triangle of the same peak has under 0.08% above its
fifth. That is why a 1 MHz square clock stresses a channel far harder than a
1 MHz sine, and why rise-time and bandwidth are two names for one quantity.

## 6.7 Worked example: the pulse train, duty cycle, and spectral nulls

**Given**: a rectangular pulse train of amplitude $A = 5\\ \\mathrm{V}$, pulse width
$\\tau = 0.2\\ \\mathrm{ms}$, period $T_{0} = 1\\ \\mathrm{ms}$, pulses centred on
$t = 0$. The duty cycle is $d = \\tau /T_{0} = 0.2$.

**Find**: the complex coefficients, and where the spectrum has nulls.

**Handbook relation**: integrate the complex coefficient over the pulse only,
since the waveform is zero elsewhere:

$$c_{n} = \\frac{1}{T_{0}}\\int_{-\\tau /2}^{\\tau /2}A\\,e^{-jn\\omega _{0}t}\\,dt = \\frac{A}{T_{0}}\\cdot \\frac{2\\sin (n\\omega _{0}\\tau /2)}{n\\omega _{0}}$$

Writing $\\omega _{0} = 2\\pi /T_{0}$ and collecting the result into the normalised
sinc function $\\operatorname{sinc}(u) = \\sin (\\pi u)/(\\pi u)$,

$$c_{n} = A\\,d\\,\\operatorname{sinc}(n d)$$

**Substitution**: $A d = 5 \\times 0.2 = 1.0000\\ \\mathrm{V}$, so

$$c_{0} = 1.0000\\ \\mathrm{V},\\qquad c_{1} = \\operatorname{sinc}(0.2) = 0.9355\\ \\mathrm{V},\\qquad c_{2} = \\operatorname{sinc}(0.4) = 0.7568\\ \\mathrm{V}$$

$$c_{3} = \\operatorname{sinc}(0.6) = 0.5046\\ \\mathrm{V},\\qquad c_{4} = \\operatorname{sinc}(0.8) = 0.2339\\ \\mathrm{V},\\qquad c_{5} = \\operatorname{sinc}(1.0) = 0$$

**Answer**: the dc level is 1.0000 V, matching the obvious average
$A \\times d$, and the coefficients follow a sinc envelope that first crosses zero
at $n = 5$, which is $5\\ \\mathrm{kHz} = 1/\\tau $.

**Check**: nulls sit at every multiple of $1/\\tau$, never at multiples of
$1/T_{0}$ — the nulls are set by the pulse width alone. Narrow the pulse and the
nulls move outward, which is the time-bandwidth trade appearing in yet another
costume. Note also that the one-sided amplitude of the first harmonic is
$2\\lvert c_{1}\\rvert = 1.8710\\ \\mathrm{V}$, twice the two-sided line height; this
is the factor-of-two convention warned about in Section 5.2, and pulse-train
questions are where it bites hardest.`,
        examTip: 'Identify the waveform class before you integrate anything. Square and sawtooth decay as 1/n, triangle and rectified sine as 1/n squared, and only the sawtooth in that set keeps its even harmonics. Two of the four numbers a typical FE question asks for can be written down from those two facts alone, and the third harmonic of a square wave is always one third of the fundamental while a triangle wave is always one ninth.',
        importantNote: 'A full-wave rectifier doubles the repetition rate: rectifying 60 Hz produces ripple whose fundamental is 120 Hz. Half-wave rectification does not — its output still repeats at 60 Hz, and it keeps a fundamental at that frequency. Reading the wrong ripple frequency off a rectifier question makes every downstream filter number wrong.',
      },
      {
        id: 'fs-gibbs-parseval',
        title: '7. Gibbs Overshoot and the Power Ledger',
        content: `## 7.1 Truncation is a filter, and it rings

A partial sum keeps harmonics up to some index $N$ and throws the rest away.
That is not a neutral act: discarding everything above $N f_{0}$ is exactly what
an ideal brick-wall low-pass filter does, and an ideal brick wall in frequency
is a sinc in time, which rings. The overshoot beside a jump is that ringing.

The size of the ringing can be computed rather than described. Write the
partial sum of the odd square wave of unit amplitude:

$$S_{N}(t) = \\sum_{n\\ \\text{odd}}^{N}\\frac{4}{n\\pi }\\sin (n\\omega _{0}t)$$

Differentiate, use the identity that turns the resulting cosine sum into a
closed form, and the derivative vanishes first at

$$t_{\\text{peak}} = \\frac{T_{0}}{2(N+1)}$$

Evaluating $S_{N}$ there and letting $N$ grow gives a limit written with the
sine integral $\\operatorname{Si}$:

$$\\lim_{N\\to \\infty }S_{N}(t_{\\text{peak}}) = \\frac{2}{\\pi }\\operatorname{Si}(\\pi ) = \\frac{2}{\\pi }(1.8519370) = 1.178980$$

## 7.2 Worked example: how many terms kill the overshoot

**Given**: the square wave partial sums above.

**Find**: the peak value of the reconstruction for $N = 9$, $N = 49$ and
$N = 199$, and the number of terms that would reduce the overshoot below 1%.

**Substitution**: evaluating the partial sums numerically at their own peaks
gives 1.182328 for $N = 9$, 1.179113 for $N = 49$ and 1.178988 for $N = 199$.
Meanwhile the location of that peak marches inward: with $N = 9$ it sits at
$T_{0}/20$ of the way past the jump, and with $N = 199$ at $T_{0}/400$.

**Answer**: the overshoot converges to 17.898% of the step height $A$ — which is
8.949% of the full $2A$ jump — and **no** number of terms brings it below 1%.
The correct answer to "how many terms" is that the question has no answer.

![Two stacked panels against the number of harmonics kept. The upper panel shows the peak of the partial sum settling onto a horizontal limit of 1.178980 instead of falling toward one. The lower panel shows the instant of that peak falling as one over twice the quantity N plus one, so the ripple narrows without ever shrinking.](/courses/fe-ee/figures/sig2-gibbs-peak.svg)

**Check**: the two panels say different things and both matter. The upper panel
is flat, so the peak error does not improve. The lower panel is a straight line
of slope $-1$ on log axes, so the width of the offending region collapses in
proportion to $1/N$. Convergence of a Fourier series at a jump is convergence in
area, not in worst-case height. Any exam option claiming the overshoot "becomes
negligible with enough terms" is wrong; the option claiming it "confines itself
to an ever narrower band around the discontinuity" is right.

There is one practical escape. The overshoot comes from the abruptness of the
truncation, not from the harmonics themselves, so tapering the coefficients
instead of cutting them off removes it. Multiplying the $n$-th coefficient by a
smoothly decaying window trades the ringing for a slightly slower edge — the
same bargain that windowing strikes in spectral analysis, and the reason
practical reconstruction filters are never brick walls.

## 7.3 Parseval for periodic signals: power, not energy

A periodic signal runs forever, so its energy is infinite and only its average
power is finite. Parseval's theorem for the series is therefore a power
statement, and it is the single most useful identity in this chapter:

$$P = \\frac{1}{T_{0}}\\int_{0}^{T_{0}}\\lvert x(t)\\rvert ^{2}dt = \\sum_{n=-\\infty }^{\\infty }\\lvert c_{n}\\rvert ^{2} = a_{0}^{2} + \\frac{1}{2}\\sum_{n=1}^{\\infty }\\left(a_{n}^{2} + b_{n}^{2}\\right)$$

The one-half comes from the mean square of a sinusoid: a term of amplitude
$A_{n}$ contributes $A_{n}^{2}/2$, its rms squared. The dc term has no such
factor because a constant's mean square is the constant squared. In one-sided
amplitude language,

$$P = A_{0}^{2} + \\sum_{n=1}^{\\infty }\\frac{A_{n}^{2}}{2},\\qquad x_{\\text{rms}} = \\sqrt{P}$$

The identity is powerful because harmonics do not interfere in the power
ledger. Orthogonality guarantees that the cross terms integrate to zero, so
powers simply add. That is why rms values of unrelated harmonics combine in
quadrature and never linearly.

## 7.4 Worked example: how much of a square wave lives in its fundamental

**Given**: the 10 V square wave of Section 6.2.

**Find**: the fraction of total power carried by the fundamental, and by the
partial sums through the third, fifth, seventh and ninth harmonics.

**Handbook relation**: total power for a $\\pm A$ square wave is $A^{2}$, because
the waveform's magnitude is $A$ at every instant.

$$P = A^{2} = 100\\ \\mathrm{V}^{2},\\qquad P_{1} = \\frac{b_{1}^{2}}{2} = \\frac{1}{2}\\left(\\frac{4A}{\\pi }\\right)^{2} = \\frac{8A^{2}}{\\pi ^{2}}$$

**Substitution**: the fraction is therefore $8/\\pi ^{2}$, independent of
amplitude:

$$\\frac{P_{1}}{P} = \\frac{8}{\\pi ^{2}} = \\frac{8}{9.8696} = 0.8106$$

Adding the later terms multiplies this by the partial sums of $1/n^{2}$ over odd
$n$:

$$\\frac{P_{1..N}}{P} = \\frac{8}{\\pi ^{2}}\\left(1 + \\frac{1}{9} + \\frac{1}{25} + \\cdots \\right)$$

**Answer**: 81.06% in the fundamental alone; 90.06% through the third; 93.31%
through the fifth; 94.96% through the seventh; 95.96% through the ninth.

**Check**: the series must converge to 1, and it does, because the odd-index
sum of $1/n^{2}$ equals $\\pi ^{2}/8$, cancelling the prefactor exactly. If your
partial sums ever exceed 100%, a coefficient is too large — most often because
a one-sided amplitude was squared where a two-sided one belonged.

![Cumulative share of total mean power against the number of harmonics kept, for square, triangle and sawtooth waves. The triangle reaches 98.55 percent with the fundamental alone; the square needs three harmonics to pass 90 percent; the sawtooth is still climbing at fifteen harmonics.](/courses/fe-ee/figures/sig2-power-fraction.svg)

The three curves rank exactly as the decay rates predict. The triangle's
$1/n^{2}$ amplitudes give $1/n^{4}$ powers, so its ledger is closed almost
entirely by the first term. The sawtooth, with $1/n$ amplitudes and every
harmonic present, is the slowest of the three: it needs eight harmonics to pass
92%, against three for the square.

## 7.5 Worked example: total harmonic distortion from the power ledger

**Given**: the same three waveforms, each treated as a distorted version of its
own fundamental.

**Find**: the total harmonic distortion, defined as the rms of everything above
the fundamental divided by the rms of the fundamental.

**Handbook relation**: with $F$ standing for the fraction of power in the
fundamental,

$$\\mathrm{THD} = \\sqrt{\\frac{P - P_{1}}{P_{1}}} = \\sqrt{\\frac{1}{F} - 1}$$

**Substitution**: for the square wave $F = 8/\\pi ^{2} = 0.810569$, so
$1/F = 1.233701$ and $1.233701 - 1 = 0.233701$, whose square root is 0.483426.
For the triangle $F = 96/\\pi ^{4} = 0.985534$ and for the sawtooth
$F = 6/\\pi ^{2} = 0.607927$.

**Answer**: 48.34% for the square wave, 12.12% for the triangle, 80.31% for the
sawtooth.

**Check**: the square wave's 48.34% is numerically identical to the full-wave
rectifier's ripple factor of Section 6.5, and that is not a coincidence — both
quantities are $\\sqrt{\\pi ^{2}/8 - 1}$, because in each case the wanted component
carries $8/\\pi ^{2}$ of the power and the unwanted remainder carries the rest.
Recognising the shared algebra is faster than remembering two numbers.

| Waveform | Power in fundamental | THD | Harmonics for 95% of power |
|---|---|---|---|
| Triangle | 98.55% | 12.12% | 1 |
| Square | 81.06% | 48.34% | 7 |
| Sawtooth | 60.79% | 80.31% | more than 15 |

A last caution on definitions. Some sources normalise total harmonic distortion
to the total rms rather than to the fundamental, which for the square wave gives
$\\sqrt{1 - 0.810569} = 0.435$ instead of 0.483. Both are in use; the ratio
between them is $\\sqrt{F}$. An exam question that supplies a numeric answer
choice near 43% alongside one near 48% is testing precisely this, so read which
denominator the question names.`,
        examTip: 'Parseval turns a hard integral into an easy sum and back. If a question asks for the rms of a distorted waveform and gives you harmonic amplitudes, do not integrate: square the amplitudes, halve each one, add the dc squared, and take the root. If it asks how many harmonics are needed to capture some fraction of the power, run the same sum until it crosses the threshold.',
        importantNote: 'Gibbs overshoot is a property of the truncation, not of the signal, and it does not shrink. Roughly nine percent of the jump height survives no matter how many terms are summed; only the width of the ringing collapses. The escape is to taper the coefficients rather than to add more of them.',
      },
      {
        id: 'fs-transform-limit',
        title: '8. Letting the Period Go to Infinity',
        content: `## 8.1 The series becomes the transform

Section 2 introduced the Fourier transform by decree. It is worth deriving,
because the derivation explains the units, the disappearance of the discrete
lines, and why the transform of a periodic signal turns out to be a row of
impulses.

Start from the pulse train of Section 6.7 and hold the pulse fixed while the
period grows. The coefficients are $c_{n} = A d\\operatorname{sinc}(nd)$ with
$d = \\tau /T_{0}$, so as $T_{0}$ grows every coefficient shrinks toward zero — the
average of a fixed pulse spread over a longer and longer period must. Nothing
useful survives unless the shrinkage is undone, so multiply through by $T_{0}$:

$$T_{0}\\,c_{n} = A\\tau \\operatorname{sinc}(n f_{0}\\tau ),\\qquad f_{0} = \\frac{1}{T_{0}}$$

The right-hand side no longer depends on $T_{0}$ except through where the samples
land. Stretching the period packs the harmonics closer together along a fixed
curve; it does not change the curve.

![Two stacked panels of the same rectangular pulse repeated at two different periods. Both sets of spectral lines lie exactly on one dashed sinc envelope; the longer period simply places four times as many lines under it. The envelope is the Fourier transform of a single pulse.](/courses/fe-ee/figures/sig2-pulse-train-envelope.svg)

In the limit the spacing $f_{0}$ becomes an infinitesimal $df$, the index $n f_{0}$
becomes a continuous variable $f$, and the sum becomes an integral. Writing
$X(f)$ for the limiting envelope,

$$X(f) = \\lim_{T_{0}\\to \\infty }T_{0}c_{n} = \\int_{-\\infty }^{\\infty }x(t)e^{-j2\\pi ft}\\,dt$$

$$x(t) = \\int_{-\\infty }^{\\infty }X(f)e^{j2\\pi ft}\\,df$$

Three consequences follow directly and each is examinable. The spectrum is now
**continuous**, because the lines have merged. Its units are volt-seconds, or
equivalently volts per hertz, because a coefficient in volts was multiplied by a
period in seconds. And an aperiodic signal has finite **energy** rather than
finite power, so Parseval's identity changes shape accordingly:

$$E = \\int_{-\\infty }^{\\infty }\\lvert x(t)\\rvert ^{2}dt = \\int_{-\\infty }^{\\infty }\\lvert X(f)\\rvert ^{2}df$$

The quantity $\\lvert X(f)\\rvert ^{2}$ is the energy spectral density, in joules per
hertz when $x$ is a voltage across one ohm.

## 8.2 Worked example: the single rectangular pulse, end to end

**Given**: one rectangular pulse, amplitude $A = 1\\ \\mathrm{V}$, duration
$\\tau = 2\\ \\mathrm{ms}$, centred on $t = 0$.

**Find**: the transform, its first null, its 3 dB width, the total energy, and
the share of that energy inside the main lobe.

**Handbook relation**: integrating the defining integral over the pulse only,

$$X(f) = \\int_{-\\tau /2}^{\\tau /2}A e^{-j2\\pi ft}dt = A\\tau \\operatorname{sinc}(f\\tau ),\\qquad \\operatorname{sinc}(u) = \\frac{\\sin (\\pi u)}{\\pi u}$$

**Substitution**: the peak is at $f = 0$, where the sinc equals one:

$$X(0) = A\\tau = 1 \\times 0.002 = 0.002\\ \\mathrm{V\\cdot s} = 2\\ \\mathrm{mV\\cdot s}$$

Nulls occur wherever $f\\tau$ is a nonzero integer, so the first is at

$$f_{\\text{null}} = \\frac{1}{\\tau } = \\frac{1}{0.002} = 500\\ \\mathrm{Hz}$$

The magnitude falls to $1/\\sqrt{2}$ of its peak at $f\\tau = 0.4430$, so the 3 dB
frequency is $0.4430/0.002 = 221.5\\ \\mathrm{Hz}$ and the two-sided 3 dB width is
443.0 Hz.

**Answer**: a sinc of peak 2 mV·s, first null at 500 Hz, 3 dB half-width
221.5 Hz.

**Energy**: in the time domain the calculation is trivial, since the pulse is
flat:

$$E = A^{2}\\tau = 1 \\times 0.002 = 0.002\\ \\mathrm{J}\\ \\text{(into 1 ohm)}$$

Integrating $\\lvert X(f)\\rvert ^{2}$ numerically over frequency returns
0.0019999 J, confirming Parseval to five figures without needing the analytic
value of the sinc-squared integral.

![Energy spectral density of a two millisecond pulse together with the running share of its total energy. The density has its first null at five hundred hertz, by which point ninety point two eight percent of the energy has already accumulated; the first sidelobe peaks thirteen point two six decibels below the main lobe.](/courses/fe-ee/figures/sig2-sinc-energy.svg)

**Check**: the running-energy curve crosses 0.902823 exactly at the first null
and 0.9496 at the second, so the main lobe holds a little over 90% of the
energy and the first sidelobe pair adds under 5%. The first sidelobe peaks
13.26 dB below the main lobe — the number quoted whenever an unwindowed
rectangular record is criticised for leakage.

The pair also runs the other way. Because the transform of a rectangle is a
sinc, duality says the transform of a sinc is a rectangle: a sinc-shaped pulse
in time has a perfectly flat, strictly band-limited spectrum. That is the ideal
interpolation kernel of the sampling chapter, and its infinite extent in time is
the reason ideal reconstruction is unrealisable.

## 8.3 The pairs worth carrying into the exam

| Signal $x(t)$ | Transform $X(f)$ | Where it earns its keep |
|---|---|---|
| $A\\,\\mathrm{rect}(t/\\tau )$ | $A\\tau \\operatorname{sinc}(f\\tau )$ | pulses, gating, ideal filters |
| $A\\operatorname{sinc}(2Wt)$ | $(A/2W)\\,\\mathrm{rect}(f/2W)$ | reconstruction, band-limited design |
| $e^{-at}u(t),\\ a>0$ | $1/(a + j2\\pi f)$ | first-order circuits, RC decay |
| $e^{-a\\lvert t\\rvert }$ | $2a/(a^{2} + 4\\pi ^{2}f^{2})$ | two-sided decay, autocorrelations |
| $\\delta (t)$ | $1$ | impulse response, flat excitation |
| $1$ | $\\delta (f)$ | dc offset |
| $\\cos (2\\pi f_{c}t)$ | $\\tfrac{1}{2}\\delta (f-f_{c}) + \\tfrac{1}{2}\\delta (f+f_{c})$ | carriers, tones |
| $\\sum _{k=-\\infty}^{\\infty} \\delta (t - kT)$ | $(1/T)\\sum _{k=-\\infty}^{\\infty} \\delta (f - k/T)$ | sampling itself |

Two entries deserve a second look. The exponential decay $e^{-at}u(t)$ has
$X(0) = 1/a$ and falls to $1/\\sqrt{2}$ of that at $f = a/(2\\pi )$; for
$a = 1000\\ \\mathrm{s^{-1}}$ that is $1000/6.283185 = 159.155\\ \\mathrm{Hz}$, which
is the familiar $1/(2\\pi \\tau )$ corner of a first-order circuit with a 1 ms time
constant. And the impulse train transforms into an impulse train — the only
entry in the table that keeps its own form in both domains, a property it shares
outside the table with the Gaussian. That self-similarity is what makes sampling
analysable at all.

## 8.4 Worked example: the transform of a periodic signal

**Given**: a periodic signal with known Fourier coefficients $c_{n}$ and
fundamental $f_{0}$.

**Find**: its Fourier transform.

**Handbook relation**: write the signal as its complex series and transform term
by term. Each term is a constant times a complex exponential, and the transform
of $e^{j2\\pi nf_{0}t}$ is a shifted impulse:

$$e^{j2\\pi nf_{0}t}\\ \\longleftrightarrow \\ \\delta (f - nf_{0})$$

$$X(f) = \\sum_{n=-\\infty }^{\\infty }c_{n}\\,\\delta (f - nf_{0})$$

**Answer**: the transform of a periodic signal is a train of impulses at the
harmonic frequencies, each weighted by the corresponding series coefficient.

**Substitution**: for a 2 V amplitude cosine at 1 kHz, the coefficients are
$c_{1} = c_{-1} = 1\\ \\mathrm{V}$ and all others zero, so
$X(f) = \\delta (f - 1000) + \\delta (f + 1000)$ scaled by 1 V.

**Check**: this closes the loop opened in Section 3.3. The Fourier series and
the Fourier transform are not rival tools for rival signals; the transform
covers both, and applying it to a periodic signal simply produces impulses
whose weights are the series coefficients. The series is the more convenient
bookkeeping for periodic signals, not a different theory.

The practical reading matters for laboratory work. A periodic signal has
infinite energy, so its energy spectral density is not defined and the impulses
in $X(f)$ have infinite height and finite area. What an instrument displays is
power in each analysis bin, which is why a spectrum analyser reports a fixed
height for a steady tone regardless of how long it observes, while the same
instrument's reading for a transient depends entirely on the record length.

## 8.5 Time and bandwidth cannot both be small

The scaling property $x(at) \\leftrightarrow (1/\\lvert a\\rvert )X(f/a)$ says
compressing a signal in time stretches its spectrum. Quantifying that trade
requires a definition of duration and bandwidth, and the usual choice is the
root-mean-square spread of $\\lvert x(t)\\rvert ^{2}$ and of
$\\lvert X(f)\\rvert ^{2}$ about their centres. With those definitions,

$$\\Delta t\\cdot \\Delta f \\ge \\frac{1}{4\\pi }$$

with equality only for the Gaussian, which is why the Gaussian pulse is the
optimally localised waveform and why it transforms into another Gaussian. Every
other shape pays a penalty. The rectangular pulse pays the largest one of the
common shapes, because its jumps put energy in sidelobes that stretch its
spectral spread without doing anything useful.

The engineering statement of the same inequality is that a pulse of duration
$\\tau$ needs roughly $1/\\tau$ of bandwidth to survive a channel. Halving the
pulse width doubles the required bandwidth. A 1 ns edge needs on the order of
1 GHz. No filter, equaliser or coding scheme can dodge this; it is a property of
the transform pair, not of any technology.`,
        examTip: 'Learn the rectangle-and-sinc pair in both directions and most transform questions collapse to bookkeeping. Rectangle in time gives sinc in frequency with the first null at one over the pulse width; sinc in time gives rectangle in frequency with the band edge at half the sinc rate. Then apply the shift, scale and modulation rows of the Section 4 table rather than integrating.',
        importantNote: 'The transform of a periodic signal exists, and it is a train of impulses weighted by the Fourier series coefficients. Series and transform are not alternatives for different signal classes; the series is the compact bookkeeping for the periodic case. What changes is the units — coefficients in volts, transforms in volt-seconds — and mixing the two is the usual source of a factor-of-T0 error.',
      },
      {
        id: 'fs-problem-sets',
        title: '9. Problem Sets',
        content: `## 9.1 Problem Set A: coefficients and symmetry

**A1.** A periodic waveform satisfies $x(t + T_{0}/2) = -x(t)$ and is also even.
Which coefficients can be nonzero?

*Answer.* Only $a_{n}$ for odd $n$. Half-wave symmetry kills dc and every even
harmonic; evenness kills every sine. This is the quarter-wave even case. **The
trap** is the answer "all odd harmonics, both sine and cosine", which forgets
that evenness was also given and reports twice as many surviving terms as
actually exist.

**A2.** A square wave of amplitude 4 V peak-to-peak, symmetric about zero, has
period 2 ms. Find the fundamental frequency and the amplitude of the third
harmonic.

*Answer.* Peak-to-peak 4 V means $A = 2\\ \\mathrm{V}$, and
$f_{0} = 1/0.002 = 500\\ \\mathrm{Hz}$. The third harmonic amplitude is
$4A/(3\\pi ) = 8/9.42478 = 0.8488\\ \\mathrm{V}$ at 1500 Hz. **The trap** is using
$A = 4\\ \\mathrm{V}$, which doubles the answer to 1.6977 V; the phrase
"peak-to-peak" is doing real work in the question.

**A3.** A signal has $a_{5} = 0$ and $b_{5} = -6\\ \\mathrm{V}$. Write the fifth
harmonic in amplitude-phase form.

*Answer.* $A_{5} = \\sqrt{0 + 36} = 6\\ \\mathrm{V}$ and
$\\phi _{5} = \\operatorname{atan2}(6,\\,0) = +90^{\\circ }$, so the term is
$6\\cos (5\\omega _{0}t + 90^{\\circ })$. **The trap** is reporting
$-90^{\\circ }$ by using $\\arctan (b_{n}/a_{n})$ instead of
$\\arctan (-b_{n}/a_{n})$; the sign convention is fixed by the expansion
$A_{n}\\cos (\\theta + \\phi ) = A_{n}\\cos \\phi \\cos \\theta - A_{n}\\sin \\phi \\sin \\theta$,
and getting it backwards inverts the waveform.

**A4.** The complex coefficient $c_{2}$ of a real signal equals
$3 - j4\\ \\mathrm{V}$. What is $c_{-2}$, and what is the one-sided amplitude at
$2f_{0}$?

*Answer.* For a real signal $c_{-n} = c_{n}^{*}$, so
$c_{-2} = 3 + j4\\ \\mathrm{V}$. The one-sided amplitude is
$A_{2} = 2\\lvert c_{2}\\rvert$, and $\\lvert c_{2}\\rvert = \\sqrt{9 + 16}$ with
$9 + 16 = 25$, giving 5 V, so $A_{2} = 10\\ \\mathrm{V}$. **The trap** is answering
5 V, the two-sided line height, when the question asked what a one-sided
spectrum would display.

**A5.** Does shifting a waveform in time change which harmonics are present?

*Answer.* No. A shift multiplies each $c_{n}$ by a unit-magnitude exponential,
so a coefficient that was zero stays zero and one that was nonzero keeps its
magnitude. **The trap** is the plausible-sounding claim that a shift can convert
an odd waveform into an even one and therefore "create" cosine terms. It does
convert sines into cosines, but that is a redistribution between $a_{n}$ and
$b_{n}$ at the same $n$, not a change in which harmonics exist.

## 9.2 Problem Set B: power, distortion and Gibbs

**B1.** A signal consists of 10 V dc plus a 6 V amplitude fundamental plus a 4 V
amplitude third harmonic. Find its rms value.

*Answer.* Parseval gives
$P = 10^{2} + 6^{2}/2 + 4^{2}/2 = 100 + 18 + 8 = 126\\ \\mathrm{V}^{2}$, so
$x_{\\text{rms}} = \\sqrt{126} = 11.225\\ \\mathrm{V}$. **The trap** is halving the dc
term as well, giving $50 + 18 + 8 = 76$ and an answer of 8.718 V. Only the
sinusoidal terms carry the factor of one half, because only they have an rms
below their peak.

**B2.** For the signal of B1, what is the total harmonic distortion referred to
the fundamental?

*Answer.* Harmonic power above the fundamental is $4^{2}/2 = 8\\ \\mathrm{V}^{2}$
and the fundamental carries $18\\ \\mathrm{V}^{2}$, so
$\\mathrm{THD} = \\sqrt{8/18} = \\sqrt{0.4444} = 0.6667$, that is 66.67%. **The
trap** is including the 10 V dc term among the "harmonics", which gives
$\\sqrt{108/18} = 2.449$ and a nonsensical 245%. Distortion measures compare
sinusoidal harmonics; dc is an offset, not a harmonic.

**B3.** A square wave is reconstructed from its first 100 harmonics. By how much
does the reconstruction overshoot the step?

*Answer.* About 8.95% of the total jump, or 17.9% of the half-amplitude — the
Gibbs limit, essentially reached by the ninth harmonic and unchanged thereafter.
**The trap** is an answer that scales with the number of terms, such as
"1% because 100 terms were used". The overshoot is asymptotically constant;
only its width shrinks, as $T_{0}/(2 \\times 101)$ here.

**B4.** Which needs more harmonics to reach 95% of its power, a triangle wave or
a sawtooth of the same peak value?

*Answer.* The sawtooth, by a wide margin. The triangle passes 95% with its
fundamental alone (98.55%), while the sawtooth is at 60.79% after one harmonic
and still below 93% after eight. **The trap** is reasoning from peak values,
which are equal, instead of from the decay law: the triangle's amplitudes fall
as $1/n^{2}$ and the sawtooth's as $1/n$, so their powers fall as $1/n^{4}$ and
$1/n^{2}$.

**B5.** A 5 V amplitude sine at 1 kHz is measured to have 4.9 V of fundamental
and 0.5 V of second harmonic. Is the distortion above or below 10%?

*Answer.* $\\mathrm{THD} = 0.5/4.9 = 0.1020$, so 10.20% — just above.
**The trap** is dividing by the 5 V nominal amplitude rather than the measured
fundamental, which returns 10.00% and flips the verdict. Distortion is referred
to what the fundamental actually is, not to what it was supposed to be.

## 9.3 Practice Problems: transforms and pairs

**C1.** A rectangular pulse of 1 V lasts 0.5 ms. Where is the first null of its
spectrum, and what is $X(0)$?

*Answer.* First null at $1/\\tau = 1/0.0005 = 2000\\ \\mathrm{Hz}$; the peak is
$A\\tau = 0.0005\\ \\mathrm{V\\cdot s}$, that is 0.5 mV·s. **The trap** is quoting
the null at $1/(2\\tau ) = 1000\\ \\mathrm{Hz}$ by confusing the sinc's first null
with its half-width; the null is at $1/\\tau$, and the 3 dB half-width is a
different and smaller number, here $0.4430/0.0005 = 886\\ \\mathrm{Hz}$.

**C2.** A signal occupying dc to 4 kHz is multiplied by a 100 kHz carrier. What
band does the result occupy, and what is its one-sided width?

*Answer.* 96 kHz to 104 kHz, a one-sided width of 8 kHz. **The trap** is
answering 4 kHz, forgetting that modulation lifts the negative-frequency half of
the baseband spectrum into positive frequencies, so the occupied width doubles.

**C3.** Two signals have identical magnitude spectra but different phase
spectra. Name one relationship that guarantees this.

*Answer.* One is a time-shifted copy of the other. A delay of $t_{0}$ multiplies
the spectrum by $e^{-j2\\pi ft_{0}}$, which has magnitude one at every frequency.
**The trap** is "one is a scaled copy of the other", which changes magnitudes
everywhere by the same factor and so does change the magnitude spectrum.

**C4.** The impulse response of an ideal low-pass filter with band edge $W$ is a
sinc. Why can this filter not be built?

*Answer.* The sinc extends to $t = -\\infty$, so the filter would have to respond
before it was excited. A brick wall in frequency demands non-causality in time.
**The trap** is blaming component tolerances or finite gain; the obstruction is
mathematical, and no amount of engineering removes it. Real designs approximate
the brick wall with a finite-order response and accept a transition band.

**C5.** A 1 kHz cosine of amplitude 2 V is transformed. Describe $X(f)$.

*Answer.* Two impulses, at $+1\\ \\mathrm{kHz}$ and $-1\\ \\mathrm{kHz}$, each of
area 1 V. **The trap** is answering "one impulse of area 2 V at 1 kHz", which
discards the negative-frequency half. The two-sided description always splits a
real cosine into a conjugate pair of half-height lines, and only a one-sided
convention recombines them into a single 2 V entry.

**C6.** A pulse train has duty cycle 0.25 and period 1 ms. At which harmonic
numbers does its spectrum vanish?

*Answer.* Wherever $nd$ is a nonzero integer, that is $n = 4, 8, 12, \\ldots$,
which in frequency is every multiple of $1/\\tau = 4\\ \\mathrm{kHz}$. **The trap**
is placing nulls at multiples of the fundamental $1\\ \\mathrm{kHz}$; the nulls are
set by the pulse width, and the period only decides how densely the lines are
sampled beneath the envelope.`,
        examTip: 'On any Fourier arithmetic question, write down which convention the numbers are in before computing: peak or peak-to-peak, one-sided or two-sided, amplitude or rms. Most of the wrong answer choices on this topic are the right calculation performed in the wrong convention, and they are chosen precisely because they look like arithmetic slips rather than definitional ones.',
        importantNote: 'Reserve the factor of one half for sinusoidal terms in every power calculation. A dc term contributes its square, a sinusoid of amplitude A contributes A squared over two, and the two rules must never be swapped. That single distinction accounts for more lost marks on Parseval problems than any integration error.',
      },
    ],
    keyTakeaways: [
      'Periodic signals → Fourier Series (discrete spectrum at harmonics nf₀); aperiodic → Fourier Transform (continuous).',
      'Complex exponential form: cₙ = (1/T₀) ∫ x(t)·e^(−j2πnf₀t)dt is most compact for computation.',
      'Parseval: ∫|x(t)|²dt = ∫|X(f)|²df — energy conservation across domains.',
      'Signal smoothness determines spectral roll-off; discontinuities create high-frequency components.',
      'Time-bandwidth product Δt·Δf ≥ 1/(4π) — cannot be narrow in both domains simultaneously.',
      'Exploit signal symmetry: even → cosine only; odd → sine only; half-wave → odd harmonics only.',
      'Orthogonality is the mechanism: the product of two different harmonics integrates to zero over a period, so the coefficient integral keeps exactly one term.',
      'Coefficient decay follows smoothness — 1/n if the waveform jumps, 1/n² if only its slope jumps; square and sawtooth are the first case, triangle and rectified sine the second.',
      'Power fractions in the fundamental: 81.06% square, 98.55% triangle, 60.79% sawtooth. THD follows as the square root of (1/F − 1).',
      'Gibbs overshoot converges to 8.949% of the jump and never shrinks; only its width collapses, as T₀/(2(N+1)).',
      'A full-wave rectified sine has dc 2A/π, ripple fundamental at twice the input frequency, and a first ripple term exactly 2/3 of the dc level.',
      'The transform of a periodic signal is a train of impulses at nf₀ weighted by cₙ — series and transform are one theory, not two.',
    ],
  },

  fee_sampling: {
    topicId: 'fee_sampling',
    title: 'Sampling Theorem and Nyquist Rate',
    domainWeight: 'Signal Processing · 4–6%',
    overview: 'The Shannon-Nyquist sampling theorem establishes the minimum sampling rate for perfect signal reconstruction. Violations cause aliasing, where high frequencies masquerade as low frequencies. Anti-aliasing filters and proper sampling rates are critical for all digital signal processing.',
    sections: [
      {
        id: 'samp-theorem',
        title: '1. Shannon-Nyquist Sampling Theorem',
        content: `## 1.1 The Fundamental Theorem

To perfectly reconstruct a **bandlimited** signal from its samples, the sampling frequency must exceed twice the highest frequency component:

**$f_{s} > 2\\cdot f_{\\max}$** (Nyquist criterion)

The **Nyquist rate** is the minimum sampling frequency: **$f_{s,\\min} = 2\\cdot f_{\\max}$**

The **Nyquist frequency** is the maximum recoverable frequency: **$f_{n} = f_{s}/2$**

| Term | Definition | Example (audio CD) |
|---|---|---|
| **fₛ** (sampling frequency) | Samples per second | 44,100 Hz |
| **f_max** (max signal freq) | Highest frequency in signal | 20,000 Hz |
| **fₙ = fₛ/2** (Nyquist freq) | Folding frequency | 22,050 Hz |
| **T = 1/fₛ** (sampling period) | Time between samples | $22.7 \\mu s$ |

### Frequency-Domain View

Sampling replicates the signal spectrum at multiples of fₛ. If fₛ > 2·f_max, the replicas do not overlap and the original spectrum can be recovered by a low-pass filter at fₙ. If fₛ < 2·f_max, replicas overlap → **aliasing**.

## 1.2 Reconstruction

Perfect reconstruction uses a **sinc interpolation** filter:

**x(t) = Σ x[n] · sinc[(t − nT)/T]**

Practical systems use approximations:
- **Zero-Order Hold (ZOH)**: staircase approximation (most common in DACs)
- **First-Order Hold**: linear interpolation between samples
- **Oversampling + digital filter**: sample at much higher rate, then filter digitally`,
        examTip: 'The most common FE exam mistake is confusing Nyquist frequency (fₙ = fₛ/2) with sampling frequency (fₛ). The Nyquist frequency is the folding point — the maximum frequency that can be represented. Always verify: is the problem asking for the sampling rate or the Nyquist frequency?',
      },
      {
        id: 'samp-aliasing',
        title: '2. Aliasing and Anti-Aliasing Filters',
        content: `## 2.1 Aliasing

When a signal contains frequencies above fₙ = fₛ/2, those components **fold back** into the baseband and become indistinguishable from lower-frequency components.

### Computing Aliased Frequency

For a signal at frequency f sampled at fₛ, the **apparent (aliased) frequency** is:

**$f_{alias} = |f - k\\cdot f_{s}|$** for the integer k that brings the result into [0, fₛ/2]

**Example**: A 15 kHz signal sampled at 20 kHz:
- f_alias = |15 − 20| = 5 kHz
- The 15 kHz tone appears as 5 kHz — completely indistinguishable from a real 5 kHz signal

![Apparent frequency against true input frequency for a fixed sampling rate, computed from the folding formula. Below half the sampling rate the apparent frequency equals the true one; above it, the curve folds into a triangle wave that maps every input into the band from zero to half the sampling rate.](/courses/fe-ee/figures/sig-alias-folding.svg)

The zigzag is the entire aliasing story in one picture. Read any input
frequency on the horizontal axis, go up to the curve, and the height is what
the sampled data will claim the frequency is. Every peak sits at an odd
multiple of fₛ/2 and every valley at a multiple of fₛ, which is why inputs
near a multiple of the sampling rate masquerade as slow drift near DC — the
wagon-wheel effect in film is this valley in action.

### Aliasing in the Frequency Domain

| Condition | Result | Spectrum |
|---|---|---|
| $f_{s} > 2\\cdot f_{\\max}$ | **No aliasing** | Spectral replicas separated |
| $f_{s} = 2\\cdot f_{\\max}$ | **Critical sampling** | Replicas touch — theoretically OK |
| $f_{s} < 2\\cdot f_{\\max}$ | **Aliasing** | Replicas overlap — distortion |

## 2.2 Anti-Aliasing Filters

An **anti-aliasing filter** is a low-pass filter placed **before** the analog-to-digital converter (ADC):

- **Passband edge**: f_max, the highest frequency you intend to keep — the filter's −3 dB cutoff belongs here, not at fₛ/2
- **Stopband edge**: fₙ = fₛ/2, by which point the response must be down by the attenuation the application demands
- **Purpose**: reduce content above fₙ far enough that what folds back is below the noise floor
- **Requirement**: must be an **analog** filter (cannot be digital, since aliasing occurs at sampling)
- **Typical order**: 4th–8th order Butterworth or elliptic for steep roll-off

### Practical Oversampling

Modern systems often **oversample** (sample at much higher than 2·f_max), then digitally filter and **decimate**. This relaxes the analog anti-aliasing filter requirements since the gap between f_max and fₛ/2 is large.`,
        examTip: 'When the FE exam asks for the aliased frequency, use this quick method: fold the signal frequency into the range [0, fₛ/2] by repeatedly subtracting fₛ and taking the absolute value. For instance, 75 kHz sampled at 40 kHz: |75−40| = 35, |35−40| = 5 kHz. The aliased frequency is 5 kHz.',
        importantNote: 'Anti-aliasing filters must be analog — they operate before the ADC. A digital filter cannot remove aliasing because the aliased components are already folded into the baseband and are indistinguishable from genuine low-frequency content.',
      },
      {
        id: 'samp-aliasing-design',
        title: '3. Aliasing Problems & Anti-Aliasing Design',
        content: `## 3.1 Worked Example: Computing Aliased Frequency

**Problem**: A signal contains a component at **$f = 15\\ \\mathrm{kHz}$**. It is sampled at **$f_{s} = 20\\ \\mathrm{kHz}$**. What frequency appears in the sampled output?

**Solution**:
- Nyquist frequency: fₙ = fₛ/2 = 10 kHz
- Since f = 15 kHz > fₙ = 10 kHz, **aliasing occurs**
- Aliased frequency: f_alias = |f − fₛ| = |15 − 20| = **5 kHz**

The 15 kHz signal appears as a phantom 5 kHz signal after sampling. This aliased component is **completely indistinguishable** from a genuine 5 kHz signal — no amount of post-processing can separate them.

**Verification**: The aliased frequency must fall in [0, fₛ/2] = [0, 10 kHz]. Our result of 5 kHz is in this range. If the first subtraction gives a result outside [0, fₛ/2], subtract fₛ again.

## 3.2 Multi-Component Aliasing Example

**Problem**: A signal x(t) = cos(2π·3000t) + cos(2π·14000t) + cos(2π·22000t) is sampled at fₛ = 16 kHz.

| Component | Frequency | $f_{s}/2 = 8\\ \\mathrm{kHz}$ | Aliased? | Apparent Frequency |
|---|---|---|---|---|
| 1st | 3 kHz | $3 < 8$ | No | **3 kHz** (unchanged) |
| 2nd | 14 kHz | $14 > 8$ | Yes | $\\lvert 14 - 16 \\rvert = 2\\ \\mathrm{kHz}$ |
| 3rd | 22 kHz | $22 > 8$ | Yes | $\\lvert 22 - 16 \\rvert = 6$, in range → **6 kHz** |

After sampling, the output appears to contain 3 kHz, 2 kHz, and 6 kHz — the original 14 kHz and 22 kHz components are permanently destroyed and replaced by aliases.

## 3.3 Anti-Aliasing Filter Design

**Design goal**: Remove all frequencies above fₛ/2 before sampling.

**Design procedure:**
1. **Determine signal bandwidth**: f_max = highest frequency of interest
2. **Choose sampling rate**: fₛ ≥ 2.5 × f_max (practical margin above Nyquist minimum)
3. **Set filter cutoff**: fc = f_max — the passband edge, with fₛ/2 as the stopband edge
4. **Choose filter order**: higher order = steeper roll-off in the transition band
5. **Select filter type**: Butterworth for flat passband; Chebyshev for sharper cutoff

**Example**: Audio signal with f_max = 20 kHz, sampled at fₛ = 44.1 kHz.
- Anti-aliasing filter cutoff: fc = 20 kHz, with full attenuation demanded by fₛ/2 = 22.05 kHz
- Transition band: 20 kHz to 22.05 kHz (only 2.05 kHz wide)
- Required: sharp cutoff → use 8th-order elliptic filter (steep roll-off)

**Key constraint**: The anti-aliasing filter MUST be analog. Digital filters operate after sampling, when aliasing has already occurred and cannot be undone.

## 3.4 Oversampling as an Alternative

Instead of a sharp (expensive) analog filter, **oversample** at much higher rate:
- Sample at 4× or 8× the Nyquist rate (e.g., 176.4 kHz for audio)
- Use a gentle analog anti-aliasing filter (transition band is now very wide)
- Apply a sharp **digital** filter after sampling
- **Decimate** (reduce sample rate) to the final desired rate

This trades digital processing cost for analog filter complexity — standard practice in modern ADCs.`,
        examTip: 'For aliasing problems on the FE exam, use the folding formula: f_alias = |f − k·fₛ| where k is the nearest integer that brings the result into [0, fₛ/2]. Practice: 75 kHz at fₛ = 40 kHz → |75 − 2(40)| = |75 − 80| = 5 kHz. Always verify your answer is below fₛ/2.',
        importantNote: 'A common exam trap is asking about a signal at exactly fₛ/2 (the Nyquist frequency). At this frequency, sampling captures exactly 2 samples per cycle — reconstruction is theoretically possible but extremely sensitive to phase. In practice, signals at exactly fₛ/2 are unreliable.',
      },
      {
        id: 'samp-reconstruction-depth',
        title: '4. Reconstruction Hardware and Choosing the Rate',
        content: `## 4.1 What sampling does to the spectrum, precisely

Multiplying a signal by an ideal impulse train at rate fₛ produces a sampled
signal whose spectrum is the original spectrum **repeated** at every integer
multiple of fₛ:

**$X_{s}(f) = (1/T)\\sum _{k=-\\infty}^{\\infty} X(f - k f_{s})$** over all integers k

Each copy is called an **image**. Reconstruction is nothing more than a
low-pass filter that keeps the k = 0 copy and rejects every other one. Two
consequences follow immediately:

- If the copies do not overlap ($f_{s} > 2 f_{\\max}$), the baseband copy is
  pristine and recoverable — the sampling theorem restated in one picture.
- The images are **always present** in the sampled data. Even with a perfect
  anti-aliasing filter on the input, the DAC output contains energy near fₛ,
  2fₛ, and so on, which is why a reconstruction filter is required on the
  output side no matter how clean the input was.

## 4.2 The zero-order hold is a filter, and it droops

A real DAC does not emit impulses — it **holds** each sample value for a full
period T, producing the familiar staircase. Holding is filtering: the ZOH is
equivalent to passing ideal samples through a filter whose magnitude is

**$H_{ZOH}(f) = T\\cdot \\mathrm{sinc}(f/f_{s}) = T\\cdot \\sin (\\pi f/f_{s})/(\\pi f/f_{s})$**

That sinc shape has two exam-relevant effects. It partially suppresses the
images (helpfully), and it **attenuates the top of the wanted band** — called
aperture droop. Computing the droop from the sinc directly:

| Signal frequency | Droop factor sin(x)/x | In dB |
|---|---|---|
| $0.10\\cdot f_{s}$ | 0.984 | $-0.14\\ \\mathrm{dB}$ |
| $0.25\\cdot f_{s}$ | 0.900 | $-0.91\\ \\mathrm{dB}$ |
| $0.45\\cdot f_{s}$ | 0.699 | $-3.11\\ \\mathrm{dB}$ |
| $0.50\\cdot f_{s}$ | 0.637 | $-3.92\\ \\mathrm{dB}$ |

A signal at 45% of the sampling rate emerges about 3 dB weaker than it went
in — from the hold operation alone, before any filter. Systems that use the
full band either apply an inverse-sinc equalizer in the digital domain or
oversample so the wanted band stays in the flat region near the origin, where
the droop is negligible.

**Worked**: a 20 kHz tone reproduced from CD-rate samples sits at
20/44.1 = 0.454 of the sampling rate. The droop factor is
sin(0.454π)/(0.454π) = 0.694, i.e. **−3.2 dB** — a clearly audible loss at
the top of the band if left uncorrected, and the concrete reason CD players
include droop compensation in their digital filters.

## 4.3 Choosing fₛ is a filter-order decision

The sampling theorem gives a floor, not a design value. The real question is
how much transition band your anti-aliasing filter needs, and that couples
the sampling rate to the filter order. Work one example completely.

**Given**: telephone-grade speech, useful content to $f_{\\max} = 3.4\\ \\mathrm{kHz}$,
sampled at the standard $f_{s} = 8\\ \\mathrm{kHz}$. Require 40 dB of alias
protection at the folding frequency.

**Handbook relation**: a Butterworth low-pass of order n attenuates by
$A = 10\\cdot \\log_{10}[1 + (f/f_{c})^{2n}]$ dB with cutoff $f_{c}$.

**Substitution**: put the cutoff at 3.4 kHz and demand A ≥ 40 dB at 4 kHz
(which is fₛ/2, the folding frequency — the lowest input frequency that aliases
at all, and therefore the conservative place to impose the requirement; the
lowest frequency that folds all the way back onto the 3.4 kHz band edge is the
higher fₛ − 3.4 = 4.6 kHz, so a design that meets the specification at 4 kHz
comfortably protects the wanted band). The
ratio is 4/3.4 = 1.176, so we need $(1.176)^{2n} \\ge 10^{4} - 1$, giving

$$n \\ge \\log_{10}(9999) / (2\\cdot \\log_{10} 1.176) = 4.000/0.1411 \\approx 28.4$$

**Answer**: a **29th-order** analog filter — absurd in practice. That absurd
number is the actual engineering content: with only 0.6 kHz of transition
band, brute-force analog filtering fails. The realistic fixes are the ones
this chapter keeps returning to — raise fₛ to widen the transition band, or
oversample heavily and let a sharp digital filter do the work before
decimation. Telephone codecs historically split the difference with a
moderate elliptic filter and accepted modest attenuation of the 3.4–4 kHz
edge.

Redo the same computation with $f_{s} = 10\\ \\mathrm{kHz}$: the stopband edge
moves to 5 kHz, the ratio becomes 5/3.4 = 1.471, and

$$n \\ge \\log_{10}(9999)/(2\\cdot \\log_{10} 1.471) = 4.000/0.3352 \\approx 11.9 \\to n = 12$$

Still large but plausible for an elliptic realization of much lower order.
The general lesson: **every 25% of extra sampling rate buys a large drop in
analog filter order**, which is why practical systems sample at 2.2× to 2.5×
the highest signal frequency rather than at the theoretical minimum.

## 4.4 Rate conversion after the fact

Once a signal is digital, its rate can be changed without returning to
analog:

- **Decimation by M**: digitally low-pass filter to the new Nyquist limit
  $f_{s}/(2M)$, then keep every M-th sample. Filtering must come first —
  discarding samples is itself a sampling operation and aliases just like an
  ADC without an anti-aliasing filter.
- **Interpolation by L**: insert L−1 zeros between samples, then low-pass
  filter at the original $f_{s}/2$ to remove the images the zero-stuffing
  created. The filter also scales amplitude by L to restore the level.

These two operations, cascaded, convert between any pair of rational rates —
how 48 kHz studio audio becomes 44.1 kHz on a release, and how a delta-sigma
converter's multi-megahertz bitstream becomes a clean 48 kHz output. Every
step of the chain obeys the same folding rules as this chapter's first
section; nothing new is required beyond applying them at each rate change.

**Worked**: reducing a 48 kHz recording to an 8 kHz telephony stream is
decimation by M = 6. The new Nyquist limit is 8/2 = **4 kHz**, so the digital
low-pass must remove everything above 4 kHz *before* any samples are
discarded. Skip that filter and a 5 kHz component survives the deletion step
and folds to 8 − 5 = 3 kHz, squarely inside the speech band.`,
        examTip: 'Sampling-rate design problems on the FE exam usually hide a transition-band question: the anti-aliasing filter must fall from its passband edge (f_max) to full attenuation by fₛ/2. If the gap between those two frequencies is small, the required filter order explodes — check the ratio fₛ/2 divided by f_max before defending any "sample at exactly 2·f_max" answer.',
        importantNote: 'Decimation without a preceding digital low-pass filter aliases exactly as an ADC without an anti-aliasing filter does. Any time samples are discarded — in software, in a logging system, in a scope\'s display path — the Nyquist criterion applies at the NEW, lower rate.',
      },
      {
        id: 'samp-derivation',
        title: '5. Deriving the Sampling Theorem, and Two Words That Are Not Synonyms',
        content: `## 5.1 Sampling as multiplication by an impulse train

Section 1 stated the sampling theorem and Section 4 stated the replication
formula. Neither was derived, and the derivation is three lines long, so it is
worth having: it turns the theorem from something to remember into something
that could not have been otherwise.

Model ideal sampling as multiplication by a train of impulses spaced $T$ apart:

$$p(t) = \\sum_{k=-\\infty }^{\\infty }\\delta (t - kT),\\qquad x_{s}(t) = x(t)\\,p(t)$$

The impulse train is periodic with period $T$, so it has a Fourier series. Its
coefficients come straight from the sifting property, because only the impulse
at $t = 0$ lies inside one period of integration:

$$c_{k} = \\frac{1}{T}\\int_{-T/2}^{T/2}\\delta (t)\\,e^{-j2\\pi kt/T}dt = \\frac{1}{T}$$

Every coefficient is the same — the impulse train has a perfectly flat spectrum
of lines. Substituting the series back,

$$p(t) = \\frac{1}{T}\\sum_{k=-\\infty }^{\\infty }e^{\\,j2\\pi kt/T},\\qquad x_{s}(t) = \\frac{1}{T}\\sum_{k=-\\infty }^{\\infty }x(t)\\,e^{\\,j2\\pi kf_{s}t}$$

Each term is the original signal multiplied by a complex exponential, and the
modulation property of the Fourier transform says that shifts the spectrum.
Transforming term by term therefore gives

$$X_{s}(f) = \\frac{1}{T}\\sum_{k=-\\infty }^{\\infty }X(f - kf_{s})$$

That is the whole theorem in one equation. Sampling does not distort the
spectrum; it **copies** it to every multiple of $f_{s}$ and scales the whole
family by $1/T$.

## 5.2 Worked example: reading the theorem off the picture

**Given**: a signal whose spectrum is nonzero only for
$\\lvert f\\rvert \\le f_{\\max} = 4\\ \\mathrm{kHz}$.

**Find**: the condition on $f_{s}$ under which the copies do not overlap.

**Substitution**: the baseband copy occupies $-4$ to $+4\\ \\mathrm{kHz}$. The
copy centred on $+f_{s}$ occupies $f_{s} - 4$ to $f_{s} + 4\\ \\mathrm{kHz}$. These
two are disjoint provided the lower edge of the shifted copy lies above the
upper edge of the baseband copy:

$$f_{s} - f_{\\max} > f_{\\max}\\ \\Longrightarrow \\ f_{s} > 2f_{\\max}$$

**Answer**: $f_{s} > 8\\ \\mathrm{kHz}$. Below that the copies interpenetrate, and
what the samples contain is the **sum** of the overlapping pieces — which cannot
be unmixed, because addition destroys the information about which piece
contributed what.

![Two stacked panels of the same triangular baseband spectrum replicated at every multiple of the sampling rate. In the upper panel the rate is three times the highest signal frequency and the copies stand clear of one another. In the lower panel the rate is below twice that frequency, the copies interpenetrate, and the drawn curve is their sum, which is what the samples actually contain.](/courses/fe-ee/figures/sig2-replication.svg)

**Check**: the lower panel is the important one, and the detail to notice is
that the overlapped curve is a *sum*, drawn at height 0.5 where two skirts meet.
No filter applied after sampling can separate those two contributions, because
by then they are one number per frequency. That is the precise sense in which
aliasing is irreversible, and it is why the anti-alias filter must sit in front
of the converter.

Two boundary readings follow from the same picture. At exactly
$f_{s} = 2f_{\\max}$ the copies touch at $f_{s}/2$ but do not overlap, so
reconstruction is possible in principle — provided the signal carries no
impulse exactly at $f_{\\max}$ and provided the reconstruction filter is a
brick wall, neither of which is available in practice. And because the copies
extend forever in both directions, the sampled data always contains energy near
$f_{s}$, $2f_{s}$ and beyond, no matter how clean the input was. That is what the
reconstruction filter at the output is for.

## 5.3 Worked example: Nyquist rate against Nyquist frequency

These two terms are routinely used as if they were interchangeable. They are
not, they are not even the same kind of quantity, and telling them apart is
worth easy marks.

**Given**: four signals and one converter.

- $x_{1}$ occupies dc to 4 kHz
- $x_{2}$ occupies dc to 2 kHz
- $x_{3}$ occupies dc to 1 kHz
- the converter runs at $f_{s} = 10\\ \\mathrm{kHz}$

**Find**: the Nyquist rate of each signal, the Nyquist frequency of the
converter, and which signals are sampled adequately.

**Handbook relation**: the two definitions, kept strictly apart:

$$f_{\\text{Nyquist rate}} = 2f_{\\max}\\ \\ \\text{(a property of the SIGNAL)}$$

$$f_{\\text{Nyquist frequency}} = \\frac{f_{s}}{2}\\ \\ \\text{(a property of the SAMPLER)}$$

**Substitution**: the Nyquist rates are $2 \\times 4 = 8\\ \\mathrm{kHz}$,
$2 \\times 2 = 4\\ \\mathrm{kHz}$ and $2 \\times 1 = 2\\ \\mathrm{kHz}$. The converter's
Nyquist frequency is $10/2 = 5\\ \\mathrm{kHz}$ regardless of what is connected to
it.

**Answer**: all three signals are sampled adequately, because each one's
Nyquist rate is below the 10 kHz actually used — equivalently, each one's
highest frequency is below the converter's 5 kHz Nyquist frequency.

| Quantity | Symbol | Units | Depends on | Value here |
|---|---|---|---|---|
| Nyquist rate | $2f_{\\max}$ | samples per second | the signal only | 8, 4, 2 kHz |
| Nyquist frequency | $f_{s}/2$ | hertz | the sampler only | 5 kHz |
| Sampling rate | $f_{s}$ | samples per second | the design choice | 10 kHz |
| Oversampling ratio | $f_{s}/(2f_{\\max})$ | dimensionless | both | 1.25, 2.5, 5 |

**Check**: notice that the Nyquist rate of $x_{1}$ (8 kHz) and the Nyquist
frequency of the converter (5 kHz) are different numbers with different meanings
and would be different even if the sampler were changed. A question asking "what
is the Nyquist frequency of this signal" is malformed, and a question asking
"what is the Nyquist rate of this converter" is equally so. When an exam
question uses one of the terms, decide first whether the number it wants is a
property of the waveform or of the clock.

## 5.4 What band-limited actually requires

The theorem's hypothesis is that $X(f)$ is exactly zero above $f_{\\max}$. No
real signal satisfies that, because a signal that is strictly band-limited must
extend infinitely in time — the same duality that makes the ideal filter
non-causal. Every physical waveform starts and stops, so every physical
waveform has spectral content, however small, at every frequency.

The engineering translation is therefore not "make the signal band-limited" but
"push the out-of-band content below the level that matters". That level is
usually set by the converter's own noise floor. A 12-bit converter has a
signal-to-quantisation-noise ratio near 74 dB, so pushing residual out-of-band
energy 74 dB down makes it invisible in the result. A 16-bit converter demands
about 98 dB and therefore a far more aggressive filter or a far higher sampling
rate. This is the quantitative link between the two halves of a converter
specification, and Section 8 computes both of those decibel figures from first
principles rather than quoting them.`,
        examTip: 'Derive the replication statement rather than memorising a folding rule, and every aliasing question becomes the same picture. Copies of the spectrum sit at every multiple of fs; ask whether the copy centred on fs reaches down far enough to touch the baseband copy. It does exactly when fs minus f_max is less than f_max, which is the sampling theorem written as a collision test.',
        importantNote: 'Nyquist rate is 2 f_max and belongs to the signal; Nyquist frequency is fs/2 and belongs to the sampler. They have different units of interpretation and are only numerically equal in the degenerate case of sampling at exactly the Nyquist rate. Almost every trick question on this topic is built on the reader treating them as one quantity.',
      },
      {
        id: 'samp-folding-cases',
        title: '6. Folding Worked: Six Tones, One Sampler',
        content: `## 6.1 The folding rule, stated once

Given an input tone at $f$ and a sampling rate $f_{s}$, the frequency the
samples appear to contain is found by folding $f$ into the band
$[0,\\ f_{s}/2]$. Formally, take the remainder modulo $f_{s}$ and reflect it if it
landed in the upper half:

$$r = f \\bmod f_{s},\\qquad f_{\\text{apparent}} = \\min (r,\\ f_{s} - r)$$

Every worked case below was checked by building the sampled sequence
numerically at the stated rate and locating the peak of its discrete Fourier
transform, rather than by trusting the formula. Where the two disagreed, the
measurement would have won; they never did.

## 6.2 Worked example: an ordinary fold

**Given**: a 7 kHz tone sampled at $f_{s} = 10\\ \\mathrm{kHz}$.

**Find**: the apparent frequency.

**Substitution**: $r = 7000 \\bmod 10000 = 7000\\ \\mathrm{Hz}$, which exceeds
$f_{s}/2 = 5000\\ \\mathrm{Hz}$, so reflect:
$f_{\\text{apparent}} = 10000 - 7000 = 3000\\ \\mathrm{Hz}$.

**Answer**: 3 kHz.

![A seven kilohertz cosine and a three kilohertz cosine drawn together with the sample instants of a ten kilohertz sampler marked. Every sample dot lies exactly on both curves, so the sampled sequence is identical for the two inputs and no processing can distinguish them.](/courses/fe-ee/figures/sig2-alias-samples.svg)

**Check**: the figure is the proof rather than an illustration of it. The dots
were computed from the 7 kHz curve and the 3 kHz curve was drawn afterwards; the
largest disagreement between the two sets of sample values is below
$10^{-12}$. The two inputs produce the same data, so no algorithm can prefer one
over the other. Note also that the alias runs backwards in phase relative to the
input — folding conjugates the tone — which is why aliased components sometimes
appear with inverted phase in a measurement.

## 6.3 Worked example: three tones at once, measured

**Given**: $x(t)$ containing 1.2 kHz, 4.6 kHz and 8.3 kHz components of
amplitudes 1.0 V, 0.7 V and 0.5 V, sampled at $f_{s} = 10\\ \\mathrm{kHz}$.

**Find**: what a spectrum analyser fed from the samples would display.

**Substitution**: 1.2 kHz and 4.6 kHz are both below $f_{s}/2 = 5\\ \\mathrm{kHz}$
and pass through untouched. For the third, $r = 8300\\ \\mathrm{Hz}$ exceeds
5 kHz, so it reflects to $10000 - 8300 = 1700\\ \\mathrm{Hz}$.

**Answer**: lines at 1.2 kHz (1.0 V), 1.7 kHz (0.5 V) and 4.6 kHz (0.7 V).

![A discrete Fourier transform of the actual samples of a three-tone signal. Two lines sit where their inputs were, at one point two and four point six kilohertz. The third line has moved from eight point three kilohertz down to one point seven, and nothing appears above half the sampling rate.](/courses/fe-ee/figures/sig2-alias-dft.svg)

**Check**: the amplitudes come through unchanged — aliasing relocates energy
without attenuating it, which is exactly what makes it dangerous. A component
that has folded onto a wanted frequency arrives at full strength. If the 8.3 kHz
tone had been an interferer at 1 V rather than 0.5 V, it would now be
indistinguishable from a genuine 1.7 kHz signal of the same size.

## 6.4 Worked example: an alias that lands on dc

**Given**: a 30 kHz tone sampled at $f_{s} = 10\\ \\mathrm{kHz}$.

**Find**: the apparent frequency, and what the sample sequence looks like.

**Substitution**: $r = 30000 \\bmod 10000 = 0$, so the apparent frequency is
0 Hz. Writing the samples out shows why:

$$x[n] = \\cos \\left(2\\pi \\cdot 30000\\cdot \\frac{n}{10000} + \\theta \\right) = \\cos (6\\pi n + \\theta ) = \\cos \\theta$$

**Answer**: the samples are a **constant** equal to $\\cos \\theta$. A perfectly
good 30 kHz tone has been recorded as a dc offset whose size depends only on
where the sampling clock happened to fall relative to the waveform.

**Check**: building the sequence numerically with $\\theta = 0.37\\ \\mathrm{rad}$
gives 64 samples all equal to 0.932327, spread below $10^{-9}$, and
$\\cos (0.37) = 0.932327$. This is the most under-appreciated failure mode in
data acquisition: an interferer at an exact multiple of the sampling rate does
not show up as a tone at all, it shows up as a drifting offset, and offsets are
routinely blamed on the amplifier instead.

## 6.5 Worked example: exactly at the Nyquist frequency

**Given**: a 5 kHz tone sampled at $f_{s} = 10\\ \\mathrm{kHz}$, so the tone sits
exactly at $f_{s}/2$.

**Find**: the sample sequence as a function of the tone's phase.

**Substitution**: two samples per cycle land at the same two points of the
waveform every cycle:

$$x[n] = \\cos (\\pi n + \\theta ) = (-1)^{n}\\cos \\theta$$

**Answer**: an alternating sequence of amplitude $\\lvert \\cos \\theta \\rvert$. With
$\\theta = 0$ the samples alternate between $+1$ and $-1$ and the tone is
captured at full size. With $\\theta = \\pi /2$ every sample is exactly zero and
the tone vanishes completely. With $\\theta = \\pi /3$ the samples alternate at
$\\pm 0.5$.

**Check**: all three cases were generated numerically and match
$\\lvert \\cos \\theta \\rvert$ to machine precision. The engineering conclusion is
that $f_{s} = 2f_{\\max}$ is not a design rate but a limit: at the boundary the
recovered amplitude depends on a phase you do not control. Practical systems
leave a margin, which is where the customary factor of 2.2 to 2.5 comes from.

## 6.6 Worked example: slow beats and the wagon wheel

**Given**: a 9.9 kHz tone sampled at 10 kHz, and separately, 60 Hz mains hum
picked up by a logger running at 50 samples per second.

**Find**: the apparent frequencies.

**Substitution**: for the first, $r = 9900\\ \\mathrm{Hz}$ exceeds 5 kHz, so it
reflects to $10000 - 9900 = 100\\ \\mathrm{Hz}$. For the second,
$r = 60 \\bmod 50 = 10\\ \\mathrm{Hz}$, already below $50/2 = 25\\ \\mathrm{Hz}$, so
it stays at 10 Hz.

**Answer**: 100 Hz and 10 Hz respectively. Measuring the first case by
transforming an actual 4096-sample record returned 100.1 Hz, the nearest
available bin to 100 Hz at that record length.

**Check**: both are the same phenomenon as a filmed wagon wheel appearing to
turn slowly backwards. An input just below a multiple of the sampling rate
produces a very low apparent frequency, and it is a genuinely hard fault to
diagnose because slow drift looks like a real physical effect. When a data
logger shows unexplained slow oscillation, computing $f \\bmod f_{s}$ for the
mains frequency and its harmonics is the first thing to try.

## 6.7 The full case table

| Input $f$ | $f_{s}$ | $f_{s}/2$ | Remainder $f \\bmod f_{s}$ | Apparent | Note |
|---|---|---|---|---|---|
| 7 kHz | 10 kHz | 5 kHz | 7 kHz | 3 kHz | reflected |
| 12.5 kHz | 10 kHz | 5 kHz | 2.5 kHz | 2.5 kHz | one wrap, no reflection |
| 17.5 kHz | 10 kHz | 5 kHz | 7.5 kHz | 2.5 kHz | wrapped and reflected |
| 23 kHz | 10 kHz | 5 kHz | 3 kHz | 3 kHz | two wraps |
| 30 kHz | 10 kHz | 5 kHz | 0 | dc | lands on zero |
| 5 kHz | 10 kHz | 5 kHz | 5 kHz | 5 kHz | at the boundary, phase-dependent |
| 9.9 kHz | 10 kHz | 5 kHz | 9.9 kHz | 100 Hz | slow beat |
| 60 Hz | 50 Sa/s | 25 Hz | 10 Hz | 10 Hz | mains into a slow logger |

Every row of this table was produced by sampling the tone and transforming the
result, then compared against the folding formula; the two agree in all eight
cases. Two rows repay a second look. The 12.5 kHz and 17.5 kHz inputs both alias
to 2.5 kHz, so a single measured line at 2.5 kHz has at least four plausible
origins — 2.5, 7.5, 12.5 and 17.5 kHz, and infinitely many more above. Recovering
which one it was is impossible from the data alone, and possible only from prior
knowledge that the input was band-limited. That prior knowledge is precisely
what the anti-alias filter manufactures.

## 6.8 The same rule in the form exams usually print

The remainder-and-reflect recipe is the fastest to execute, but questions are
often phrased using the nearest-multiple form instead. The two are identical.
Choose the integer $k$ that puts $f$ closest to $kf_{s}$:

$$k = \\operatorname{round}\\left(\\frac{f}{f_{s}}\\right),\\qquad f_{\\text{apparent}} = \\lvert f - k f_{s}\\rvert$$

Rounding to the nearest multiple guarantees the result lands in
$[0,\\ f_{s}/2]$, which is why no reflection step is needed in this version. For
the 17.5 kHz case at 10 kSa/s, $17500/10000 = 1.75$ rounds to $k = 2$, and

$$f_{\\text{apparent}} = \\lvert 17500 - 20000\\rvert = 2500\\ \\mathrm{Hz}$$

matching the table. The two forms disagree only when $f/f_{s}$ is exactly a half
integer, where the input sits precisely on $f_{s}/2$ and the answer is
$f_{s}/2$ either way.

A useful corollary drops out of the same picture. Because the copies repeat
every $f_{s}$, the map from input to apparent frequency is periodic and
symmetric, so the set of inputs that all produce the same reading is

$$f \\in \\left\\{\\,k f_{s} \\pm f_{\\text{apparent}}\\ :\\ k = 0, 1, 2, \\ldots \\right\\}$$

For a reading of 2.5 kHz at 10 kSa/s that set is 2.5, 7.5, 12.5, 17.5, 22.5 kHz
and onward without end. Bandpass sampling exploits this deliberately, choosing
$f_{s}$ so that a narrow band sitting high in frequency folds down to a
convenient baseband slot on purpose rather than by accident — but that only
works when the band is narrow enough that no two parts of it collide, which
requires $f_{s} > 2B$ for a band of width $B$, and a careful choice of $k$.`,
        examTip: 'Use the remainder form of the folding rule rather than repeated subtraction: take f modulo fs first, then reflect if the result exceeded fs/2. It reaches the answer in one step for inputs many multiples of fs above the band, where repeated subtraction invites a bookkeeping slip, and it makes the two special cases obvious — a remainder of zero means the alias lands on dc, and a remainder of exactly fs/2 means the amplitude depends on sampling phase.',
        importantNote: 'Aliasing relocates energy without attenuating it. An out-of-band interferer arrives in the baseband at full amplitude and is then indistinguishable from a genuine signal at the frequency it landed on. This is why the anti-alias filter has to attenuate rather than merely roll off, and why the required attenuation is set by the converter resolution rather than by taste.',
      },
      {
        id: 'samp-aa-hold-reconstruct',
        title: '7. Specifying the Filter, Paying for the Hold, Rebuilding the Signal',
        content: `## 7.1 An anti-alias filter is specified, not chosen

"Use a low-pass filter before the ADC" is not a specification. A specification
names a passband edge, a stopband edge and an attenuation, and those three
numbers determine the order. Section 4.3 ran one such calculation; this section
turns it into a procedure and shows what the sampling rate buys.

The passband edge is $f_{\\max}$, the highest frequency worth keeping. The
stopband edge is the lowest input frequency that can fold back into the wanted
band, which from the replication picture is $f_{s} - f_{\\max}$. The attenuation
is set by the converter, because there is no value in suppressing an alias
further below the noise floor than the noise floor itself.

For a Butterworth response of order $n$ with cutoff $f_{c}$,

$$\\lvert H(f)\\rvert ^{2} = \\frac{1}{1 + (f/f_{c})^{2n}},\\qquad A(f) = 10\\log_{10}\\left[1 + (f/f_{c})^{2n}\\right]\\ \\mathrm{dB}$$

Demanding $A \\ge A_{\\text{req}}$ at the stopband edge and solving for $n$,

$$n \\ge \\frac{\\log_{10}\\left(10^{A_{\\text{req}}/10} - 1\\right)}{2\\log_{10}(f_{\\text{stop}}/f_{c})}$$

## 7.2 Worked example: 20 kHz of audio, 60 dB of protection

**Given**: wanted band to $f_{\\max} = 20\\ \\mathrm{kHz}$, Butterworth cutoff placed
at that edge, and a requirement of 60 dB of alias rejection at
$f_{\\text{stop}} = f_{s} - 20\\ \\mathrm{kHz}$.

**Find**: the minimum order at $f_{s} = 48$, 96 and 192 kHz.

**Substitution**: the numerator is common to all three cases, since
$10^{6} - 1 = 999999$ and $\\log_{10}(999999) = 6.00000$. Only the denominator
changes.

At $f_{s} = 48\\ \\mathrm{kHz}$ the stopband edge is 28 kHz, so the ratio is
$28/20 = 1.4$ and $2\\log_{10}(1.4) = 0.292256$:

$$n \\ge \\frac{6.00000}{0.292256} = 20.530\\ \\Longrightarrow \\ n = 21$$

At $f_{s} = 96\\ \\mathrm{kHz}$ the edge moves to 76 kHz, the ratio is
$76/20 = 3.8$ and $2\\log_{10}(3.8) = 1.159567$:

$$n \\ge \\frac{6.00000}{1.159567} = 5.174\\ \\Longrightarrow \\ n = 6$$

At $f_{s} = 192\\ \\mathrm{kHz}$ the edge is 172 kHz, the ratio is
$172/20 = 8.6$ and $2\\log_{10}(8.6) = 1.868997$:

$$n \\ge \\frac{6.00000}{1.868997} = 3.210\\ \\Longrightarrow \\ n = 4$$

**Answer**: 21st order, 6th order and 4th order respectively.

**Check**: substituting each chosen integer order back into the attenuation
formula gives 61.37 dB, 69.57 dB and 74.76 dB at the respective stopband edges —
all comfortably above the 60 dB demanded, as rounding up must guarantee.

![Minimum Butterworth order against sampling rate for a fixed twenty kilohertz wanted band, drawn for forty and sixty decibels of required rejection. The curve falls steeply: quadrupling the sampling rate from forty-eight to one hundred ninety-two kilohertz drops the sixty decibel requirement from twenty-first order to fourth.](/courses/fe-ee/figures/sig2-aa-order.svg)

The shape of that curve is the argument for oversampling stated as a purchase
decision. Going from 48 kHz to 96 kHz costs a factor of two in data rate and
saves fifteen filter orders; going from 96 kHz to 192 kHz costs another factor
of two and saves only two more. Almost all of the benefit arrives in the first
doubling, which is why converter designers oversample by a modest factor in
front of an ordinary filter, or by a very large factor in front of a trivial
one, and rarely choose anything in between.

| $f_{s}$ | Stopband edge | Ratio | Order for 60 dB | Actual attenuation |
|---|---|---|---|---|
| 48 kHz | 28 kHz | 1.40 | 21 | 61.37 dB |
| 96 kHz | 76 kHz | 3.80 | 6 | 69.57 dB |
| 192 kHz | 172 kHz | 8.60 | 4 | 74.76 dB |

## 7.3 The hold is a filter and it droops

A converter that emitted true impulses would be useless, so a real DAC holds
each sample for a full period $T$. That hold is a linear operation with an
impulse response of its own — a rectangle of width $T$ — and therefore a
transfer function:

$$h_{\\mathrm{ZOH}}(t) = \\mathrm{rect}\\left(\\frac{t - T/2}{T}\\right),\\qquad H_{\\mathrm{ZOH}}(f) = T\\operatorname{sinc}(fT)\\,e^{-j\\pi fT}$$

Its magnitude is a sinc in $f/f_{s}$, and the linear phase term is a pure delay
of half a sample. Two consequences, one welcome and one not: the sinc has nulls
at every multiple of $f_{s}$, which lands on the centre of each image and helps
suppress it, and the same sinc sags across the wanted band, which is the
aperture droop tabulated in Section 4.2.

![Zero-order hold magnitude response in decibels out to three times the sampling rate. Inside the wanted band the response sags to minus three point nine two decibels at half the sampling rate; beyond it the nulls at the sampling rate and its multiples sit on the image centres, and the first image peak is thirteen point four six decibels down.](/courses/fe-ee/figures/sig2-zoh-response.svg)

| $f/f_{s}$ | Droop factor | In dB | Where this occurs |
|---|---|---|---|
| 0.050 | 0.99589 | −0.036 | 20 kHz at 400 kSa/s |
| 0.11338 | 0.97899 | −0.184 | 20 kHz at 176.4 kSa/s (4x CD) |
| 0.3333 | 0.82699 | −1.650 | 16 kHz at 48 kSa/s |
| 0.45351 | 0.69440 | −3.168 | 20 kHz at 44.1 kSa/s |
| 0.500 | 0.63662 | −3.922 | the folding frequency itself |
| 1.500 | 0.21221 | −13.46 | peak of the first image |

## 7.4 Worked example: what oversampling does to the droop

**Given**: a 20 kHz tone reproduced first at the CD rate of 44.1 kSa/s and then
from the same material upsampled four times to 176.4 kSa/s.

**Find**: the hold droop in each case, and the equaliser boost needed at the
lower rate.

**Substitution**: at the CD rate the normalised frequency is
$20/44.1 = 0.45351$, and the droop factor $\\operatorname{sinc}(0.45351)$ is
0.69440, which in decibels is −3.168 dB. After four-times upsampling the same
tone sits at $20/176.4 = 0.11338$, where the droop factor is 0.97899, that is
−0.184 dB.

**Answer**: the droop falls from 3.17 dB to 0.18 dB, a factor of about
seventeen in decibel terms, purely from moving the wanted band into the flat
part of the sinc.

**Check**: at the lower rate an inverse-sinc equaliser must supply
$+3.168\\ \\mathrm{dB}$ at 20 kHz, rising steeply toward the band edge — a real
filter with real error. At the higher rate the correction is under a fifth of a
decibel and can simply be skipped. This is the second reason oversampling
converters dominate audio, alongside the anti-alias order argument of Section
7.2, and both reasons are the same argument seen from opposite ends of the
converter.

## 7.5 Worked example: rebuilding the waveform between the samples

**Given**: a 1.4 kHz tone sampled at 8 kSa/s.

**Find**: the value of the reconstructed waveform at instants between the
samples, using ideal interpolation.

**Handbook relation**: with the ideal low-pass reconstruction filter of gain $T$
and band edge $f_{s}/2$, whose impulse response is a sinc, the output is the sum
of one scaled and shifted sinc per sample:

$$x(t) = \\sum_{n=-\\infty }^{\\infty }x[n]\\,\\operatorname{sinc}\\left(\\frac{t - nT}{T}\\right)$$

The kernel has the property that makes this work: it equals 1 at its own sample
instant and exactly 0 at every other one.

$$\\operatorname{sinc}\\left(\\frac{mT - nT}{T}\\right) = \\operatorname{sinc}(m-n) = \\delta _{mn}$$

**Substitution**: evaluating the sum across a window that spans several sample
intervals, keeping 121 kernels, reproduces the true cosine with a worst-case
error of $3.0\\times 10^{-4}$ anywhere in that window. Widening to 401 kernels
drops the worst error to $2.8\\times 10^{-5}$, and to 4001 kernels drops it to
$2.8\\times 10^{-7}$.

**Answer**: the reconstruction is exact in the limit, and its accuracy is
limited only by how much of the infinite sum is kept.

![An ideal reconstruction of a one point four kilohertz tone from eight kilohertz samples. Three individual sinc kernels are drawn as dashed curves, each peaking at its own sample and crossing zero at every other sample instant; their sum, plotted as a solid curve, lies on the original tone everywhere between the samples.](/courses/fe-ee/figures/sig2-sinc-interp.svg)

**Check**: each tenfold widening of the window cuts the error by roughly a
hundred, and the residue is entirely the truncated tail. That is the practical
objection to ideal interpolation: the sinc decays only as $1/t$, so a
high-accuracy reconstruction needs samples from far away in time, which means
latency. Real converters use a
truncated and windowed approximation, accepting a small passband ripple in
exchange for a kernel a few dozen samples long. The zero-order hold is the crudest
member of that family — a kernel exactly one sample wide — which is why it needs
the droop correction of Section 7.4 that a longer kernel would not.`,
        examTip: 'Anti-alias filter questions are order questions in disguise. Write down three numbers before anything else: the passband edge (f_max), the stopband edge (fs minus f_max, or fs/2 if the question says to protect the whole sampled band), and the required attenuation in dB. The Butterworth order formula then gives the answer in one line, and the answer must be rounded UP to an integer — rounding down fails the specification.',
        importantNote: 'The zero-order hold applies a sinc-shaped magnitude to the output, sagging 3.92 dB at the folding frequency. This is not a defect in the DAC, it is what holding a value means, and it is present in every converter that emits a staircase. Correct it with an inverse-sinc digital filter or avoid it by oversampling so the wanted band stays where the sinc is flat.',
      },
      {
        id: 'samp-quantization',
        title: '8. Quantization, Oversampling, and Noise Shaping',
        content: `## 8.1 Where 6.02N plus 1.76 comes from

Sampling discretises time; quantization discretises amplitude. The two errors
are independent and the second one is quantifiable exactly, so it is worth
deriving rather than quoting.

A converter with $N$ bits spanning a full-scale range $\\mathrm{FSR}$ has a step
size

$$\\Delta = \\frac{\\mathrm{FSR}}{2^{N}}$$

Model the error $e$ between the true value and the nearest code as uniformly
distributed over one step, $-\\Delta /2 \\le e \\le \\Delta /2$, with probability
density $1/\\Delta$. This model holds whenever the signal is busy enough to
exercise many codes, which is the usual case and is the model's only real
assumption. Its mean square is a one-line integral:

$$\\sigma _{e}^{2} = \\int_{-\\Delta /2}^{\\Delta /2}e^{2}\\,\\frac{1}{\\Delta }\\,de = \\frac{1}{\\Delta }\\left[\\frac{e^{3}}{3}\\right]_{-\\Delta /2}^{\\Delta /2} = \\frac{\\Delta ^{2}}{12}$$

Now take the largest signal the converter can accept without clipping, a sine of
amplitude $\\mathrm{FSR}/2$, whose mean power is half the square of its
amplitude:

$$P_{\\text{sig}} = \\frac{1}{2}\\left(\\frac{\\mathrm{FSR}}{2}\\right)^{2} = \\frac{\\mathrm{FSR}^{2}}{8}$$

Divide, and the full-scale range cancels because $\\Delta$ carries it too:

$$\\mathrm{SQNR} = \\frac{P_{\\text{sig}}}{\\sigma _{e}^{2}} = \\frac{\\mathrm{FSR}^{2}/8}{\\mathrm{FSR}^{2}/(12\\cdot 2^{2N})} = \\frac{3}{2}\\cdot 2^{2N}$$

In decibels, using $10\\log_{10}(1.5) = 1.7609$ and $20\\log_{10}(2) = 6.0206$,

$$\\mathrm{SQNR}_{\\mathrm{dB}} = 10\\log_{10}\\left(\\tfrac{3}{2}\\right) + 2N\\cdot 10\\log_{10}2 = 6.0206N + 1.7609$$

That is the famous relation, and every term in it is now accounted for: the
6.02 is one bit doubling the amplitude resolution, and the 1.76 is the
three-halves that comes from comparing a sine's mean power against a uniform
error's mean square.

## 8.2 Worked example: resolution in decibels, both ways

**Given**: converters of 8, 10, 12 and 16 bits, each driven by a full-scale
sine.

**Find**: the signal-to-quantisation-noise ratio of each.

**Substitution**: applying the relation directly,

$$\\mathrm{SQNR}_{12} = 6.0206\\times 12 + 1.7609 = 74.01\\ \\mathrm{dB},\\qquad \\mathrm{SQNR}_{16} = 6.0206\\times 16 + 1.7609 = 98.09\\ \\mathrm{dB}$$

and likewise 49.93 dB at 8 bits and 61.97 dB at 10 bits.

**Answer**: roughly 50, 62, 74 and 98 dB.

**Check**: rounding a 400,000-sample full-scale sine to each resolution and
measuring the ratio of signal power to residual power returns 49.75, 61.61,
73.73 and 98.14 dB. The small shortfall at low resolutions is real and
expected: with few codes the error is not quite uniform and is slightly
correlated with the signal, so the idealised model is a little optimistic. By
16 bits the model and the measurement agree to within a twentieth of a decibel.

| Bits | $\\Delta$ as a fraction of FSR | SQNR from the relation | Measured |
|---|---|---|---|
| 8 | 1 in 256 | 49.93 dB | 49.75 dB |
| 10 | 1 in 1024 | 61.97 dB | 61.61 dB |
| 12 | 1 in 4096 | 74.01 dB | 73.73 dB |
| 16 | 1 in 65536 | 98.09 dB | 98.14 dB |

Two cautions the table hides. The relation assumes a **full-scale** sine; a
signal 20 dB below full scale has 20 dB less signal power and the same noise, so
its ratio is 20 dB worse. And it assumes a perfect converter — real parts have
differential and integral nonlinearity that eat one to two bits, which is why
data sheets quote an effective number of bits rather than the nominal count.

## 8.3 Worked example: what oversampling is worth in decibels

**Given**: a converter of fixed resolution running at $f_{s}$, followed by a
digital low-pass filter and decimation down to a band of $f_{\\max}$.

**Find**: the improvement in in-band signal-to-quantisation-noise ratio as a
function of the oversampling ratio $\\mathrm{OSR} = f_{s}/(2f_{\\max})$.

**Handbook relation**: the total quantisation noise power is
$\\Delta ^{2}/12$ whatever the sampling rate, but it is spread uniformly across
the full sampled band, so its density is

$$S_{e}(f) = \\frac{\\Delta ^{2}}{12}\\cdot \\frac{1}{f_{s}}\\ \\ \\text{(one-sided, over } 0 \\le f \\le f_{s}/2)$$

Filtering to $f_{\\max}$ keeps only the fraction $f_{\\max}/(f_{s}/2)$ of it:

$$P_{e,\\text{in band}} = \\frac{\\Delta ^{2}}{12}\\cdot \\frac{1}{\\mathrm{OSR}},\\qquad \\text{gain} = 10\\log_{10}(\\mathrm{OSR})\\ \\mathrm{dB}$$

**Substitution**: at $\\mathrm{OSR} = 4$ the gain is
$10\\log_{10}(4) = 6.02\\ \\mathrm{dB}$; at 16 it is 12.04 dB; at 64 it is
$10\\times 1.806180 = 18.06\\ \\mathrm{dB}$.

**Answer**: plain oversampling buys exactly one bit for every factor of four,
that is half a bit per octave. Sixty-four times oversampling buys three bits,
and $18.06/6.0206 = 3.00$ confirms the bookkeeping.

**Check**: the result is unglamorous — a 64-times faster converter to gain three
bits is a poor trade — and that is exactly why delta-sigma converters do
something cleverer, which the next subsection quantifies.

## 8.4 Worked example: noise shaping changes the exponent

**Given**: a delta-sigma modulator of order $L$ whose loop pushes quantisation
noise out of the band of interest, followed by the same decimation filter.

**Find**: the in-band noise power and the resulting gain.

**Handbook relation**: an $L$-th order shaper multiplies the noise density by
$\\lvert 2\\sin (\\pi f/f_{s})\\rvert ^{2L}$, which is small near dc and large near
$f_{s}/2$. Integrating that density over the narrow band that survives
decimation gives

$$P_{e,\\text{in band}} = \\frac{\\Delta ^{2}}{12}\\cdot \\frac{\\pi ^{2L}}{(2L+1)\\,\\mathrm{OSR}^{\\,2L+1}}$$

so the improvement over the un-oversampled case is

$$\\text{gain} = (20L + 10)\\log_{10}(\\mathrm{OSR}) - 10\\log_{10}\\left(\\frac{\\pi ^{2L}}{2L+1}\\right)\\ \\mathrm{dB}$$

**Substitution**: for $L = 1$ the constant term is
$10\\log_{10}(\\pi ^{2}/3) = 5.1718\\ \\mathrm{dB}$ and for $L = 2$ it is
$10\\log_{10}(\\pi ^{4}/5) = 12.8963\\ \\mathrm{dB}$. At
$\\mathrm{OSR} = 64$, where $\\log_{10}(64) = 1.806180$,

$$\\text{gain}_{L=1} = 30\\times 1.806180 - 5.1718 = 49.01\\ \\mathrm{dB},\\qquad \\text{gain}_{L=2} = 50\\times 1.806180 - 12.8963 = 77.41\\ \\mathrm{dB}$$

**Answer**: 49.01 dB and 77.41 dB, against 18.06 dB for plain oversampling at
the same rate. In bits that is $49.01/6.0206 = 8.14$ and
$77.41/6.0206 = 12.86$, against 3.00.

![Decibels added to the six point zero two N plus one point seven six baseline against oversampling ratio, on logarithmic axes, for plain oversampling and for first and second order noise shaping. Plain oversampling climbs at ten decibels per decade, first order at thirty, second order at fifty.](/courses/fe-ee/figures/sig2-sqnr.svg)

**Check**: the slopes on the figure are the exponents in the formula, so the
mechanism is visible rather than asserted. Plain oversampling gains 10 dB per
decade of OSR, first-order shaping 30 dB, second-order 50 dB. That is why a
single-bit modulator running at a few megahertz can deliver sixteen-bit audio:
it is not resolving sixteen bits at any instant, it is trading an enormous
sampling rate against a shaped noise spectrum, and the decimation filter
collects the payoff.

| OSR | Plain | First order | Second order |
|---|---|---|---|
| 4 | 6.02 dB (1.00 bit) | 12.89 dB (2.14 bits) | 17.21 dB (2.86 bits) |
| 16 | 12.04 dB (2.00 bits) | 30.95 dB (5.14 bits) | 47.31 dB (7.86 bits) |
| 64 | 18.06 dB (3.00 bits) | 49.01 dB (8.14 bits) | 77.41 dB (12.86 bits) |
| 256 | 24.08 dB (4.00 bits) | 67.07 dB (11.14 bits) | 107.52 dB (17.86 bits) |

## 8.5 Worked example: closing the data-rate ledger

**Given**: a compact-disc channel at 44.1 kSa/s, 16 bits, two channels; a
telephone channel at 8 kSa/s, 8 bits, one channel; and a delta-sigma front end
running at 64 times a 48 kSa/s output rate.

**Find**: the raw bit rates and the modulator clock.

**Substitution**: multiplying rate by depth by channel count,

$$44100 \\times 16 \\times 2 = 1411200\\ \\mathrm{bit/s} = 1.4112\\ \\mathrm{Mbit/s}$$

$$8000 \\times 8 = 64000\\ \\mathrm{bit/s} = 64\\ \\mathrm{kbit/s}$$

and the modulator runs at $64 \\times 48 = 3072\\ \\mathrm{kSa/s}$, that is
3.072 MHz.

**Answer**: 1.4112 Mbit/s, 64 kbit/s, and a 3.072 MHz modulator clock.

**Check**: the telephone figure is the familiar 64 kbit/s of a digital voice
channel, and it is fixed by exactly the two decisions this chapter has been
making — a sampling rate chosen from the signal bandwidth, and a word length
chosen from the required signal-to-noise ratio. The whole of digital
communications bandwidth planning starts here.

## 8.6 Worked example: effective bits, and what the ideal model leaves out

**Given**: a converter nominally of 12 bits whose measured ratio of signal to
everything else — noise plus distortion together, the quantity data sheets call
SINAD — is 68.50 dB on a full-scale sine.

**Find**: its effective number of bits, and the shortfall against the ideal.

**Handbook relation**: SINAD is defined against the total unwanted power rather
than quantisation noise alone,

$$\\mathrm{SINAD} = 10\\log_{10}\\frac{P_{\\text{sig}}}{P_{q} + P_{\\text{th}} + P_{\\text{dist}}}$$

and the effective number of bits inverts the ideal relation to ask what an
ideal converter would have needed to perform this well:

$$\\mathrm{ENOB} = \\frac{\\mathrm{SINAD}_{\\mathrm{dB}} - 1.7609}{6.0206}$$

**Substitution**: $68.50 - 1.7609 = 66.7391$, and dividing by 6.0206 gives
11.085.

**Answer**: 11.09 effective bits, so the part behaves like an ideal converter
about 0.92 bits short of its nominal 12.

**Check**: the shortfall of roughly one bit is typical and is caused by the
terms the ideal derivation dropped — thermal noise in the front end,
differential nonlinearity between codes, and clock jitter, which converts timing
error into amplitude error at a rate proportional to the signal's slew. For a
sine of frequency $f$ and rms jitter $t_{j}$ the last of these contributes

$$\\mathrm{SNR}_{\\text{jitter}} = -20\\log_{10}\\left(2\\pi f t_{j}\\right)\\ \\mathrm{dB}$$

which is why high-resolution converters at high input frequencies are limited by
their clock rather than by their comparators.

The uniform-error model also has an honest limitation worth naming: it assumes
the error is uncorrelated with the signal. For a slowly varying or nearly
periodic input that assumption fails and the error becomes structured, appearing
as discrete spurious tones rather than as a noise floor. The standard remedy is
**dither**, a small deliberate noise added before quantisation, typically about
one step in rms amplitude. Dither breaks the correlation at the price of a
slightly higher total noise power,

$$\\sigma _{\\text{total}}^{2} = \\frac{\\Delta ^{2}}{12} + \\sigma _{\\text{dither}}^{2}$$

which is a trade worth making because structured spurs are far more audible, and
far more misleading in a measurement, than an equivalent amount of broadband
noise.

Finally, the two mechanisms of this section combine into a single design
formula. Adding the plain-oversampling gain to the ideal relation gives the
usable dynamic range of a converter plus decimator,

$$\\mathrm{DR}_{\\mathrm{dB}} = 6.0206N + 1.7609 + 10\\log_{10}(\\mathrm{OSR})$$

which rearranges into an equivalent bit count

$$N_{\\text{eff}} = N + \\tfrac{1}{2}\\log_{2}(\\mathrm{OSR})$$

For a 12-bit part at $\\mathrm{OSR} = 16$ that is $12 + 2 = 14$ equivalent bits,
and it is the fastest way to answer an exam question that mixes resolution and
sampling rate in one sentence.`,
        examTip: 'The 6.02N + 1.76 dB relation assumes a full-scale sine wave. If the question says the signal sits some number of decibels below full scale, subtract that number directly from the result — the noise does not change when the signal shrinks. Conversely, if a question asks how many bits are needed for a stated dynamic range, divide by 6.02 and round UP, then check whether the 1.76 offset is being counted.',
        importantNote: 'Plain oversampling improves in-band signal-to-quantisation-noise ratio by 10 log10 of the oversampling ratio, which is one bit per factor of four. Noise shaping changes that to 30 log10 per octave of order, which is why delta-sigma converters exist. Confusing the two rates is the standard trap: a factor-of-four oversample without shaping is worth one bit, not several.',
      },
      {
        id: 'samp-problem-sets',
        title: '9. Problem Sets',
        content: `## 9.1 Problem Set A: rates, folding and the two Nyquists

**A1.** A signal contains components at 3 kHz, 9 kHz and 14 kHz. What is its
Nyquist rate, and what sampling rate would you actually specify?

*Answer.* The Nyquist rate is $2 \\times 14 = 28\\ \\mathrm{kSa/s}$. In practice
specify something like 2.5 times the highest component, so about 35 kSa/s, to
leave the anti-alias filter a usable transition band. **The trap** is answering
7 kHz, the Nyquist frequency that a 14 kSa/s sampler would have; the question
asked for a property of the signal, not of a sampler.

**A2.** A 26 kHz tone is sampled at 10 kSa/s. Where does it appear?

*Answer.* $26000 \\bmod 10000 = 6000\\ \\mathrm{Hz}$, which exceeds
$f_{s}/2 = 5000$, so reflect: $10000 - 6000 = 4000\\ \\mathrm{Hz}$. **The trap** is
stopping at the remainder and answering 6 kHz, which is above the Nyquist
frequency and therefore impossible — any apparent frequency must land inside
$[0,\\ f_{s}/2]$, and that check catches the error instantly.

**A3.** An accelerometer signal is logged at 100 Sa/s. Nearby machinery vibrates
at 100 Hz. What will the log show?

*Answer.* $100 \\bmod 100 = 0$, so the vibration appears as a **dc offset**, not
as a tone. **The trap** is answering "50 Hz, the Nyquist frequency" or "nothing,
it is out of band". An interferer at an exact multiple of the sampling rate is
the worst case precisely because it does not look like interference.

**A4.** Two candidate inputs, 3.5 kHz and 12.5 kHz, are sampled at 8 kSa/s.
Can the recorded data tell them apart?

*Answer.* No. $3500 \\bmod 8000 = 3500$, below 4 kHz, so the first stays at
3.5 kHz. $12500 \\bmod 8000 = 4500$, above 4 kHz, so it reflects to
$8000 - 4500 = 3500\\ \\mathrm{Hz}$. Both produce a 3.5 kHz line. **The trap** is
assuming that a higher input must produce a higher reading; the mapping from
input to apparent frequency is many-to-one, and no amount of post-processing
inverts it.

**A5.** A converter samples at 48 kSa/s. A design review claims the anti-alias
filter can be a digital one implemented in the DSP downstream. Respond.

*Answer.* It cannot. Aliasing occurs at the instant of sampling; by the time the
DSP sees the data, out-of-band content has already been folded into the
baseband and is arithmetically identical to genuine in-band content. The filter
must be analog and must precede the converter. **The trap** is confusing the
anti-alias filter with the decimation filter, which genuinely is digital — but
that one runs before a **further** rate reduction, protecting the new lower
Nyquist frequency, not the original one.

## 9.2 Problem Set B: filters, holds and reconstruction

**B1.** A wanted band reaches 10 kHz and the sampler runs at 30 kSa/s. Where is
the stopband edge of the anti-alias filter, and what Butterworth order gives
40 dB there?

*Answer.* The stopband edge is $f_{s} - f_{\\max} = 20\\ \\mathrm{kHz}$, a ratio of
$20/10 = 2$. With $\\log_{10}(9999) = 4.00000$ and
$2\\log_{10}(2) = 0.602060$, the order is
$n \\ge 4.00000/0.602060 = 6.644$, so $n = 7$. **The trap** is rounding 6.64 down
to 6, which delivers only 36.1 dB and misses the specification; order
requirements always round up.

**B2.** A DAC runs at 48 kSa/s. By how much does the zero-order hold attenuate a
16 kHz tone?

*Answer.* $16/48 = 0.3333$, and $\\operatorname{sinc}(0.3333) = 0.82699$, which
is −1.65 dB. **The trap** is answering −3.92 dB, the droop at the folding
frequency, without noticing that 16 kHz is only two thirds of the way there.

**B3.** Why does a reconstruction filter remain necessary even when the input
was perfectly band-limited before sampling?

*Answer.* Because sampling creates images at every multiple of $f_{s}$ regardless
of how clean the input was. The images are a property of the sampling operation,
not of the signal. **The trap** is thinking of the reconstruction filter as a
second anti-alias filter; they solve different problems at opposite ends of the
chain, and only one of them can be skipped by oversampling.

**B4.** An ideal interpolation kernel is truncated to 41 samples. Roughly what
reconstruction error does that leave?

*Answer.* Around $2.7\\times 10^{-3}$ of full amplitude for the case worked in
Section 7.5, falling by roughly a factor of ten for each factor of ten more
kernels kept. **The trap** is expecting exponential improvement; the sinc's
tail decays only as $1/t$, so accuracy is bought slowly and latency is bought
quickly.

**B5.** A 48 kSa/s recording is to be delivered at 16 kSa/s. What must happen
first, and what happens if it does not?

*Answer.* A digital low-pass filter limited to the new Nyquist frequency of
8 kHz must run **before** any samples are discarded. Skip it and a 10 kHz
component survives the decimation and folds to
$16 - 10 = 6\\ \\mathrm{kHz}$, landing inside the wanted band. **The trap** is
treating sample discarding as a neutral bookkeeping operation; it is a sampling
operation and obeys the same rules as the original conversion.

## 9.3 Practice Problems: quantization and oversampling

**C1.** What signal-to-quantisation-noise ratio does an ideal 14-bit converter
achieve on a full-scale sine?

*Answer.* $6.0206 \\times 14 + 1.7609 = 86.05\\ \\mathrm{dB}$. **The trap** is
dropping the 1.76 offset and answering 84.29 dB, or using
$6 \\times 14 = 84$ from a half-remembered rule of thumb.

**C2.** The same converter is driven by a sine 12 dB below full scale. Now what
is the ratio?

*Answer.* $86.05 - 12 = 74.05\\ \\mathrm{dB}$. The noise floor does not move when
the signal shrinks, so the loss is decibel for decibel. **The trap** is applying
the 12 dB to the bit count, as though backing off the signal cost two bits of
converter — it costs exactly 12 dB of ratio, which is 1.99 bits' worth, but the
converter still has 14.

**C3.** How much does 16 times oversampling improve in-band
signal-to-quantisation-noise ratio, with no noise shaping?

*Answer.* $10\\log_{10}(16) = 12.04\\ \\mathrm{dB}$, which is two bits. **The trap**
is answering 4 bits by counting one bit per factor of two; the rule is one bit
per factor of **four**, because noise power, not amplitude, is what the
decimation filter divides.

**C4.** A first-order delta-sigma modulator runs at OSR = 128. What is its gain
over the same quantiser used at the Nyquist rate?

*Answer.* $\\log_{10}(128) = 2.107210$, so the gain is
$30 \\times 2.107210 - 5.1718 = 58.04\\ \\mathrm{dB}$, about 9.64 bits' worth.
**The trap** is using the plain-oversampling formula and answering 21.07 dB;
the whole point of the modulator is that the exponent changed from one to three.

**C5.** A design needs 90 dB of dynamic range. How many bits, ignoring
oversampling?

*Answer.* Solve $6.0206N + 1.7609 \\ge 90$, so
$N \\ge 88.2391/6.0206 = 14.66$, meaning 15 bits. **The trap** is dividing 90 by
6.02 to get 14.95 and answering 15 by luck, or 14 by rounding down; subtract the
1.76 offset first, then round up.

**C6.** Two engineers disagree: one says a 1-bit converter cannot possibly
deliver CD quality, the other says it does so every day. Who is right?

*Answer.* Both, in different senses. A 1-bit quantiser has an appalling
instantaneous resolution, but inside a noise-shaping loop running at 64 to 256
times the output rate, the decimation filter recovers 16 bits or more of
in-band accuracy — the second-order row of the Section 8.4 table already reaches
12.86 bits of gain at OSR = 64, on top of the quantiser's own baseline.
**The trap** is treating resolution as an instantaneous property. It is a
bandwidth-limited, time-averaged property, and trading rate for resolution is
exactly what a modulator does.`,
        examTip: 'Every rate-conversion question on this exam reduces to asking what the Nyquist frequency is AT THE POINT IN THE CHAIN the question is about. Before the ADC it is fs/2 of the converter; after a decimate-by-M it is fs/(2M); after an interpolate-by-L it is L times higher. Write that number down first and the folding arithmetic follows.',
        importantNote: 'Backing a signal off from full scale costs signal-to-quantisation-noise ratio decibel for decibel, because the quantisation noise floor is fixed by the step size and does not move. A 16-bit converter driven 20 dB below full scale delivers about 78 dB, not 98 dB, which is why headroom management matters as much as converter selection.',
      },
    ],
    keyTakeaways: [
      'Nyquist criterion: fₛ > 2·f_max for perfect reconstruction; Nyquist frequency fₙ = fₛ/2.',
      'Aliasing folds frequencies above fₙ back into baseband: f_alias = |f − k·fₛ|.',
      'Anti-aliasing filter (analog LP at fₙ) is mandatory before the ADC.',
      'Perfect reconstruction uses sinc interpolation; practical systems use ZOH or oversampling.',
      'Oversampling relaxes anti-aliasing filter requirements by widening the transition band.',
      'Do not confuse Nyquist frequency (fₛ/2) with Nyquist rate (2·f_max) — common FE exam trap.',
      'Sampling multiplies by an impulse train, whose flat Fourier series copies the spectrum to every multiple of fₛ: Xₛ(f) = (1/T)ΣX(f − kfₛ). The theorem is a collision test on those copies.',
      'Fold with the remainder form: take f mod fₛ, then reflect if the result exceeds fₛ/2. A remainder of zero puts the alias on dc; a remainder of exactly fₛ/2 makes the amplitude depend on sampling phase.',
      'Anti-alias filters are specified, not chosen: passband edge f_max, stopband edge fₛ − f_max, attenuation set by the converter resolution. Butterworth order follows in one line and always rounds up.',
      'The zero-order hold applies T·sinc(f/fₛ): −3.92 dB of droop at the folding frequency, and nulls that sit on the image centres.',
      'SQNR = 6.02N + 1.76 dB is derived from a uniform error of variance Δ²/12 against a full-scale sine of power FSR²/8 — not memorised.',
      'Plain oversampling buys 10·log₁₀(OSR), one bit per factor of four; first-order noise shaping buys 30·log₁₀(OSR) − 5.17 dB instead.',
    ],
  },

  fee_filters: {
    topicId: 'fee_filters',
    title: 'Analog Filters: Butterworth, Chebyshev, and Types',
    domainWeight: 'Signal Processing · 4–6%',
    overview: 'Analog filters shape frequency responses to pass desired frequencies and attenuate others. Filter type (LP, HP, BP, BS), order, and approximation method (Butterworth, Chebyshev, Elliptic) are the key design choices. The FE exam tests filter identification, cutoff frequency calculation, and roll-off rate.',
    sections: [
      {
        id: 'filt-types',
        title: '1. Filter Types and Transfer Functions',
        content: `## 1.1 Filter Classification by Frequency Response

| Filter Type | Passes | Blocks | Application |
|---|---|---|---|
| **Low-Pass (LP)** | $f < f_{o}$ | $f > f_{o}$ | Anti-aliasing, noise removal |
| **High-Pass (HP)** | $f > f_{o}$ | $f < f_{o}$ | DC blocking, bass cut |
| **Band-Pass (BP)** | $f_{1} < f < f_{2}$ | f < f₁ and f > f₂ | Radio tuning, selective amplification |
| **Band-Stop (BS/Notch)** | f < f₁ and f > f₂ | $f_{1} < f < f_{2}$ | 60 Hz hum removal, interference rejection |

### Standard Transfer Functions

**First-order LP:** **$H(s) = \\omega _{c} / (s + \\omega _{c})$**

**Second-order Butterworth LP:** **$H(s) = \\omega _{c}^{2} / (s^{2} + \\sqrt{2}\\cdot \\omega _{c}\\cdot s + \\omega _{c}^{2})$**

**General second-order:** **$H(s) = \\omega _{n}^{2} / (s^{2} + 2\\zeta \\omega _{n}s + \\omega _{n}^{2})$**

where ζ is the damping ratio and ωₙ is the natural frequency.

## 1.2 Roll-Off and Filter Order

The **order n** of a filter determines the asymptotic roll-off rate:

**Roll-off = −20n dB/decade** (or −6n dB/octave)

| Order | Roll-off | Poles | Complexity |
|---|---|---|---|
| 1st | −20 dB/dec | 1 | Single RC section |
| 2nd | −40 dB/dec | 2 | Active filter (op-amp + R,C) |
| 3rd | −60 dB/dec | 3 | Cascaded sections |
| 4th | −80 dB/dec | 4 | Two second-order sections |

Higher order = steeper transition from passband to stopband, but more components, higher cost, and greater group delay.

### Cutoff Frequency

The **−3 dB cutoff frequency** fₒ (or ωc) is where the output power drops to half (voltage to 1/√2 ≈ 0.707):

**$\\lvert H(j\\omega _{c})\\rvert = 1/\\sqrt{2} \\approx -3\\ \\mathrm{dB}$**`,
        examTip: 'On the FE exam, if you see a transfer function and need to identify the filter type: look at the behavior at DC (s=0) and at high frequency (s→∞). LP has gain at DC and zero at infinity; HP has zero at DC and gain at infinity; BP has gain at a center frequency and zero at both extremes.',
      },
      {
        id: 'filt-approx',
        title: '2. Filter Approximations: Butterworth, Chebyshev, and Elliptic',
        content: `## 2.1 Comparison of Filter Families

| Property | Butterworth | Chebyshev I | Chebyshev II | Elliptic |
|---|---|---|---|---|
| **Passband** | Maximally flat | Equiripple | Flat | Equiripple |
| **Stopband** | Monotonic | Monotonic | Equiripple | Equiripple |
| **Roll-off** | Moderate | Sharp | Sharp | **Sharpest** |
| **Group delay** | Good | Moderate | Moderate | Poor |
| **Use case** | General purpose | Need sharp cutoff | Need flat passband | Minimum order |

## 2.2 Butterworth Filters (Maximally Flat)

The **Butterworth** filter has the flattest possible passband — no ripple:

**$|H(j\\omega)|^{2} = 1 / [1 + (\\omega /\\omega c)^{2n}]$**

At ω = ωc: |H| = 1/√2 = −3 dB regardless of order n.

All poles lie on a circle of radius ωc in the s-plane, equally spaced in the LHP.

![Magnitude in decibels against normalized frequency for a second-order Butterworth, a sixth-order Butterworth, and a fourth-order Chebyshev with one decibel of passband ripple, all computed from their defining magnitude equations. Raising the order steepens the asymptotic slope; allowing ripple sharpens the knee at a lower order.](/courses/fe-ee/figures/sig-filter-approximations.svg)

Two behaviors in the figure repay attention. Far from cutoff, the two
Butterworth curves settle onto straight lines whose slopes are exactly
−40 and −120 dB/decade — the −20n rule made visible. Near cutoff, the
fourth-order Chebyshev initially falls **faster than the sixth-order
Butterworth** despite its lower order; the ripple it permits in the passband
is the currency that buys that sharper knee. Further out the higher-order
Butterworth overtakes it again, because asymptotic slope depends on order
alone.

## 2.3 Chebyshev Filters

**Type I**: allows specified ripple (e.g., 0.5 dB) in the passband for a steeper roll-off than Butterworth of the same order.

**Type II**: has ripple in the stopband while maintaining a flat passband.

For the same specifications (passband ripple, stopband attenuation), Chebyshev requires **fewer stages** than Butterworth.

## 2.4 Filter Design Workflow

1. **Specify**: passband frequency, stopband frequency, passband ripple, stopband attenuation
2. **Choose approximation**: Butterworth (flat), Chebyshev (ripple OK), Elliptic (minimum order)
3. **Determine order** n from specifications
4. **Look up or compute** normalized prototype poles
5. **Frequency scale** and **impedance scale** to desired ωc and impedance level`,
        examTip: 'Butterworth is the default choice when the FE exam does not specify a filter type — it has the simplest transfer function and the most predictable behavior. Chebyshev is used when the problem explicitly mentions passband ripple tolerance or requires a sharper transition with fewer components.',
        importantNote: 'Filter order is the single biggest design variable. Doubling the order doubles the roll-off rate (e.g., from −40 to −80 dB/decade) but also doubles component count and can introduce stability issues in active filter implementations.',
      },
      {
        id: 'filt-realizations',
        title: '3. First- and Second-Order Building Blocks',
        content: `## 3.1 The first-order RC section, completely

Every analog filter reduces to cascaded first- and second-order sections, so
knowing the two building blocks cold covers the whole subject. Start with a
series resistor feeding a shunt capacitor, output taken across the capacitor.

**Given**: R = 1.6 kΩ, C = 10 nF.

**Handbook relation**: $f_{c} = 1/(2\\pi RC)$.

**Substitution**: $f_{c} = 1/(2\\pi \\times 1600 \\times 10\\times 10^{-9})$

**Answer**: $f_{c} \\approx 9.95\\ \\mathrm{kHz}$ — call it 10 kHz.

At that cutoff the section behaves as follows, all of it worth memorizing as
a pattern rather than recomputing each time:

| Frequency | Magnitude | Phase of output |
|---|---|---|
| $0.1\\cdot f_{c}$ | ≈ 1 (−0.04 dB) | $-5.7^{\\circ}$ |
| $f_{c}$ | $1/\\sqrt{2}$ ($-3\\ \\mathrm{dB}$) | $-45^{\\circ}$ |
| $10\\cdot f_{c}$ | ≈ 0.0995 ($-20\\ \\mathrm{dB}$) | $-84.3^{\\circ}$ |

The Bode asymptotes summarize the same story: flat at 0 dB until the corner,
then a straight −20 dB/decade descent, with the true curve sagging 3 dB
exactly at the corner. Swapping the two components — output across the
resistor — flips the section into a high-pass with the *same* corner
frequency; nothing else changes. That symmetry is a frequent quick question.

## 3.2 The second-order section and its Q

The general second-order low-pass

**$H(s) = \\omega_{n}^{2}/(s^{2} + 2\\zeta \\omega_{n}s + \\omega_{n}^{2})$**

adds one genuinely new parameter: the damping ratio ζ, or equivalently the
**quality factor Q = 1/(2ζ)**. Q controls the shape of the knee:

- **Q = 0.707** (ζ = 0.707): the Butterworth value — maximally flat, no peak,
  −3 dB exactly at ωₙ.
- **Q < 0.707**: droopy knee, earlier roll-off — two real poles behaving like
  cascaded first-order sections.
- **Q > 0.707**: a resonant peak appears above 0 dB near ωₙ, growing without
  bound as Q rises. High-Q sections ring in the time domain: peaking in
  frequency and ringing in time are the same pole pair seen two ways.

Active realizations (the **Sallen-Key** topology being the standard two-R,
two-C, one-op-amp form) exist precisely to place complex pole pairs with
chosen Q without inductors. A passive RC chain cannot produce Q above 0.5;
the op-amp's gain is what pushes the poles off the real axis.

### The cascade trap

Cascading two identical first-order sections does **not** give a second-order
filter with the same cutoff. Each section contributes −3 dB at $f_{c}$, so
the pair is already down **6 dB** there; the cascade's true −3 dB point slides
down to $f_{c}\\cdot \\sqrt{2^{1/2}-1} = 0.644\\cdot f_{c}$. In general, n
identical buffered first-order sections have an overall −3 dB frequency of
$f_{c}\\cdot \\sqrt{2^{1/n}-1}$, shrinking as sections are added. Proper
higher-order designs avoid this bandwidth erosion by staggering the pole
positions — which is precisely what the Butterworth pole circle does. A
cascade question that assumes the corner stays put is testing exactly this
point.

## 3.3 Transformations: one prototype, four filter types

Designers tabulate only the normalized low-pass prototype (ωc = 1) because
every other response comes from a substitution on s:

| Target | Substitution | What it does |
|---|---|---|
| Low-pass at $\\omega_{c}$ | $s \\to s/\\omega_{c}$ | scales the corner |
| High-pass at $\\omega_{c}$ | $s \\to \\omega_{c}/s$ | swaps DC and infinity |
| Band-pass | $s \\to (s^{2}+\\omega_{0}^{2})/(B\\cdot s)$ | doubles the order |
| Band-stop | $s \\to B\\cdot s/(s^{2}+\\omega_{0}^{2})$ | doubles the order |

The doubling matters on the exam: a "fourth-order band-pass" built from a
second-order low-pass prototype has second-order behavior on *each side* of
the center frequency, not fourth.

## 3.4 Band-pass arithmetic

A band-pass response is characterized by its two −3 dB edges $f_{1}$ and $f_{2}$:

- **Bandwidth**: $B = f_{2} - f_{1}$
- **Center frequency**: $f_{0} = \\sqrt{f_{1}\\cdot f_{2}}$ — the *geometric* mean
- **Quality factor**: $Q = f_{0}/B$

**Worked**: edges at 900 Hz and 1100 Hz. Then B = 200 Hz,
$f_{0} = \\sqrt{900 \\times 1100} = \\sqrt{990000} = 995\\ \\mathrm{Hz}$ — not the
1000 Hz the arithmetic mean suggests — and Q = 995/200 = **4.97**. For narrow
bands the two means nearly agree, which is why the error goes unnoticed until
a wideband problem punishes it: edges at 100 Hz and 10 kHz give a geometric
center of 1 kHz, nowhere near the arithmetic 5.05 kHz.`,
        examTip: 'For any second-order section, convert between the two parameter languages instantly: Q = 1/(2ζ). The Butterworth knee is Q = 0.707, critical damping is Q = 0.5, and any Q above 0.707 means a visible resonant peak. Questions that give a transfer function and ask about peaking are asking you to read Q off the middle coefficient.',
        importantNote: 'Band-pass center frequency is the geometric mean √(f₁·f₂), not the arithmetic mean. For narrow bands the difference is small enough to hide; for wide bands it is enormous. The same geometric relationship holds for the band-stop notch.',
      },
      {
        id: 'filt-order-design',
        title: '4. Choosing the Order: A Design Walkthrough',
        content: `## 4.1 The specification rectangle

A filter specification on the exam arrives as four numbers: the passband edge
$f_{p}$ with a maximum attenuation $A_{p}$ there, and the stopband edge $f_{st}$
with a minimum attenuation $A_{s}$ there. The design question is always the
same: **what order meets the spec, for each approximation family?**

**Given**: pass 1 kHz with no more than 1 dB of attenuation; reject 2 kHz by
at least 30 dB.

## 4.2 Butterworth order

**Handbook relation**: for a Butterworth with its passband-edge attenuation
pinned at $A_{p}$,

$$n \\ge \\frac{\\log_{10}[(10^{A_{s}/10}-1)/(10^{A_{p}/10}-1)]}{2\\cdot \\log_{10}(f_{st}/f_{p})}$$

**Substitution**: the numerator bracket is $(10^{3}-1)/(10^{0.1}-1) = 999/0.2589254 = 3858.254$,
whose base-ten logarithm is 3.5864. The denominator is $2\\cdot \\log_{10}(2) = 0.60206$.

$$n \\ge 3.5864/0.60206 = 5.957$$

**Answer**: round up — a **6th-order Butterworth**. Orders always round up:
5.957 means fifth order misses the stopband spec by a wide margin, and a
filter that almost meets its specification does not meet it. (Section 6.4
computes exactly how wide: a fifth-order design reaches only 24.25 dB where
30 dB was demanded.)

**Closing the design — where does the cutoff actually go?** The order formula
pinned the passband edge, so the −3 dB cutoff is *not* at 1 kHz. Solving the
Butterworth magnitude for the frequency where attenuation equals 1 dB with
n = 6 gives

$$f_{c} = f_{p}/(10^{A_{p}/10}-1)^{1/(2n)} = 1\\ \\mathrm{kHz}/(0.258925)^{1/12} = 1.1192\\ \\mathrm{kHz}$$

Verify the stopband with that cutoff: the ratio 2/1.1192 = 1.7870, and
$10\\cdot \\log_{10}[1 + (1.7870)^{12}] = 30.26\\ \\mathrm{dB}$ — the 30 dB
requirement met with a small margin, which is exactly what rounding the order
up purchased. This verification step — recompute both band edges after
choosing n — is the difference between an order calculation and a finished
design.

## 4.3 Chebyshev order, same specification

**Handbook relation**: the Chebyshev version replaces the logarithm with the
inverse hyperbolic cosine,

$$n \\ge \\frac{\\cosh^{-1}\\sqrt{(10^{A_{s}/10}-1)/(10^{A_{p}/10}-1)}}{\\cosh^{-1}(f_{st}/f_{p})}$$

**Substitution**: $\\cosh^{-1}\\sqrt{3858.254} = \\cosh^{-1}(62.1148) = 4.8221$, and
$\\cosh^{-1}(2) = 1.31696$.

$$n \\ge 4.8221/1.31696 = 3.6615$$

**Answer**: a **4th-order Chebyshev** with 1 dB ripple. Same specification,
two fewer poles — the concrete payoff of tolerating ripple.

## 4.4 What the order comparison does not show

| Criterion | Butterworth n = 6 | Chebyshev n = 4 |
|---|---|---|
| Passband shape | flat to the edge | ripples between 0 and $-1\\ \\mathrm{dB}$ |
| Component count | higher | lower |
| Group delay | moderately flat | peaked near cutoff |
| Sensitivity to tolerances | benign | tighter |
| Step response | modest overshoot | pronounced ringing |

The rows below the first two are why the lower-order filter is not
automatically the right answer. Chebyshev group delay varies strongly across
the passband, so different frequency components of a pulse arrive at
different times — **phase distortion** — and the step response rings. Data
and video links, where waveform shape carries the information, often accept
the higher Butterworth order or move to a **Bessel** design, which trades
away magnitude sharpness for nearly constant group delay. Audio-band
anti-aliasing, where magnitude flatness in the passband matters and the
signal is not examined edge-by-edge, tolerates Chebyshev or elliptic designs
comfortably.

## 4.5 Reading a transfer function under exam pressure

Given an unfamiliar H(s), extract everything from three quick evaluations:

1. **H(0)** — the DC gain. Nonzero means the filter passes DC: low-pass or
   band-stop.
2. **H(s) as s → ∞** — nonzero means it passes high frequencies: high-pass
   or band-stop. (Nonzero at both extremes with a dip between: band-stop.)
3. **Denominator order** — the filter order n, hence the ultimate slope
   −20n dB/decade.

This three-step read answers identification questions in under thirty
seconds and, combined with the order formulas above, covers the large
majority of filter items on the exam.

**Worked identification**: $H(s) = 5s/(s^{2} + 12s + 400)$. At DC the
numerator is zero, so H(0) = 0 — DC is blocked. As s grows large, H behaves
as 5/s, which also goes to zero — high frequencies are blocked too. Zero at
both extremes with response in between: a **band-pass**, centered at
$\\omega_{0} = \\sqrt{400} = 20$ rad/s, with bandwidth equal to the middle
coefficient, B = 12 rad/s, hence Q = 20/12 = 1.67. Every number came from
inspection; no factoring was required.`,
        examTip: 'Order results from the design formulas always round UP, never to the nearest integer. If the formula returns 5.96, sixth order is required; if it returns 5.02, sixth order is still required. A computed order that you round down produces a filter that misses its stopband specification.',
        importantNote: 'Sharper magnitude response always costs phase linearity. Butterworth, Chebyshev, elliptic form a sequence of sharper knees and progressively worse group-delay flatness; Bessel sits at the opposite extreme. No single family wins both criteria — the exam expects you to know the trade, not to escape it.',
      },
      {
        id: 'filt-ideal-price',
        title: '5. The Four Ideal Responses and the Price of Being Buildable',
        content: `## 5.1 Writing the brick walls down

Sections 1 to 4 described the four responses in words. Written as equations
they are indicator functions — a magnitude that is exactly one inside a band
and exactly zero outside it, with a vertical wall between:

$$\\lvert H_{\\mathrm{LP}}(j\\omega )\\rvert = 1 \\ \\ (\\lvert \\omega \\rvert \\le \\omega _{c}), \\qquad \\lvert H_{\\mathrm{LP}}(j\\omega )\\rvert = 0 \\ \\ (\\lvert \\omega \\rvert > \\omega _{c})$$

$$\\lvert H_{\\mathrm{HP}}(j\\omega )\\rvert = 1 - \\lvert H_{\\mathrm{LP}}(j\\omega )\\rvert , \\qquad \\lvert H_{\\mathrm{BS}}(j\\omega )\\rvert = 1 - \\lvert H_{\\mathrm{BP}}(j\\omega )\\rvert$$

The last line is worth pausing on: high-pass is the arithmetic complement of
low-pass, and band-stop is the complement of band-pass, at every frequency.
Those two identities are the reason one prototype generates all four
responses, a fact section 3.3 exploited as a table of substitutions and
section 8.5 will exploit as arithmetic.

![Four small panels, one per filter type, each showing the ideal brick-wall magnitude as a dashed step and a realizable fourth-order curve as a solid line, all against frequency divided by the corner frequency on a logarithmic axis. Every solid curve crosses its corner at seven tenths of unit magnitude and leans away from the wall on both sides; the band-stop curve reaches an exact null at the centre while its wall is a flat-bottomed trench.](/courses/fe-ee/figures/sig3-ideal-four.svg)

Look at how the realizable curve fails in each panel. It is never a small
failure at one frequency; it is a gradual lean that starts inside the
passband and continues well into the stopband. That leaning region is the
**transition band**, and every practical specification exists to bound it.

## 5.2 Why no circuit can do it

Take the inverse Fourier transform of the ideal low-pass magnitude, with
zero phase:

$$h_{\\mathrm{LP}}(t) = \\frac{1}{2\\pi }\\int _{-\\omega _{c}}^{\\omega _{c}} e^{j\\omega t}\\, d\\omega = \\frac{\\sin (\\omega _{c}t)}{\\pi t} = 2f_{c}\\,\\mathrm{sinc}(2f_{c}t)$$

Two properties of that result kill the idea outright.

**It is non-zero for negative time.** The sinc is even, so
$h(-t) = h(t)$. A circuit whose impulse response is non-zero before the
impulse arrives would have to know the future. Causality alone forbids the
brick wall.

**Its tail decays only as 1/t.** Even if you were willing to wait, the
response never truly settles; truncating it reintroduces exactly the ripple
the ideal wall was supposed to avoid.

The formal statement is the **Paley-Wiener condition**: a causal, stable
filter with a rational transfer function satisfies

$$\\int _{-\\infty }^{\\infty }\\frac{\\bigl\\lvert \\ln \\lvert H(j\\omega )\\rvert \\bigr\\rvert }{1+\\omega ^{2}}\\, d\\omega < \\infty$$

If $\\lvert H\\rvert$ were zero across any band of non-zero width, the
logarithm would be minus infinity there and the integral would diverge. So a
realizable filter may have isolated zeros — the band-stop notch is one — but
it can never be identically zero over a stretch of frequency. **Nothing you
build will ever have a true stopband.** It will have a band where the
attenuation exceeds a number you were willing to accept, which is a
different and much more useful idea.

### Worked example 5.1 — the ideal 1 kHz low-pass, sampled

**Given**: the ideal brick wall at $f_{c} = 1\\ \\mathrm{kHz}$.

**Handbook relation**: $h(t) = 2f_{c}\\,\\mathrm{sinc}(2f_{c}t)$, with
$\\mathrm{sinc}(x) = \\sin (\\pi x)/(\\pi x)$.

**Substitution and answer**, taking the peak and one point on each side:

- $t = 0$: the argument is 0, $\\mathrm{sinc}(0) = 1$, so $h = 2000\\ \\mathrm{s}^{-1}$.
- $t = 0.25\\ \\mathrm{ms}$: the argument is 0.5, and $\\mathrm{sinc}(0.5) = 2/\\pi = 0.63662$, so $h = 1273.24\\ \\mathrm{s}^{-1}$.
- $t = -0.25\\ \\mathrm{ms}$: identical, 1273.24 — response a quarter of a millisecond **before** the impulse.
- $t = 0.5\\ \\mathrm{ms}$: the argument is 1, a zero of the sinc, so $h = 0$.

**Check**: the area under $h(t)$ over all time must equal $H(0) = 1$, and
numerical integration of the same expression returns 1.0000. The shape is
right and the dc gain is right; the only thing wrong with it is that it
cannot exist.

![Impulse response of the ideal one kilohertz low-pass plotted against time in milliseconds, a tall central lobe of height two thousand per second with decaying ripples on both sides. The region left of time zero is shaded to mark output that appears before the input, and nulls are marked every half millisecond.](/courses/fe-ee/figures/sig3-ideal-sinc.svg)

## 5.3 Order and roll-off, derived rather than quoted

Far above cutoff the Butterworth magnitude simplifies. With
$u = \\omega /\\omega _{c}$,

$$\\lvert H(j\\omega )\\rvert = \\frac{1}{\\sqrt{1+u^{2n}}} \\longrightarrow \\frac{1}{u^{n}} \\qquad (u \\gg 1)$$

$$20\\log _{10}\\lvert H\\rvert \\longrightarrow -20n\\log _{10}u$$

Multiply $u$ by ten and the second expression drops by $20n$; multiply it by
two and it drops by $20n\\log _{10}2 = 6.0206n$. The familiar "$-20n$ dB per decade,
$-6n$ dB per octave" rule says nothing more than those two lines, and it now
carries its own derivation.

The rule is **asymptotic**, and the table below — every entry produced by
evaluating the actual pole polynomial at $s = j\\omega$, not by the formula
above — shows how close the approach is:

| n | attenuation at $10\\omega _{c}$ | attenuation at $100\\omega _{c}$ | difference over that decade |
|---|---|---|---|
| 1 | 20.0432 dB | 40.0004 dB | 19.9572 dB |
| 2 | 40.0004 dB | 80.0000 dB | 39.9996 dB |
| 3 | 60.0000 dB | 120.0000 dB | 60.0000 dB |
| 5 | 100.0000 dB | 200.0000 dB | 100.0000 dB |
| 6 | 120.0000 dB | 240.0000 dB | 120.0000 dB |

One decade past cutoff the asymptote is already good to a twentieth of a
decibel, and by two decades it is exact to four places. The slope rule is
safe to use anywhere in the stopband and unsafe near the knee, which is
precisely where the order formulas of section 4 take over.

### Worked example 5.2 — order from a roll-off requirement

**Given**: a preamplifier must attenuate by at least 45 dB at ten times its
corner frequency.

**Handbook relation**: attenuation $\\approx 20n\\log _{10}u$ decibels, with
$u = 10$ giving $20n$.

**Substitution**: $20n \\ge 45$, so $n \\ge 45/20 = 2.25$.

**Answer**: **third order**. Rounding to the nearest integer would give two,
and the table above says a second-order section reaches only 40.0004 dB one
decade out — five decibels short. The third-order section delivers 60.0000 dB,
which is 15 dB of margin, and there is no fractional order available to trim it.

**The distractor**: an answer of 2 comes from rounding 2.25 down or from
reading "45 dB per decade" as though a filter could be built to any slope you
like. Filter slopes come in multiples of 20 dB per decade because poles come
in whole numbers.

## 5.4 What a filter specification must contain

A specification that a designer can act on has **four** numbers, not one:

| Symbol | Name | What it constrains |
|---|---|---|
| $f_{p}$ | passband edge | the highest frequency that must survive |
| $A_{p}$ | passband attenuation | how much loss is tolerable at $f_{p}$ |
| $f_{st}$ | stopband edge | the lowest frequency that must be rejected |
| $A_{s}$ | stopband attenuation | how much rejection is required at $f_{st}$ |

**A single cutoff frequency specifies nothing.** "Low-pass with a cutoff at
half the sampling rate" is the classic empty statement: it places the −3 dB
point exactly at the folding frequency, which permits a first-order section
that is only 3 dB down where the aliases begin, and equally permits an
eighth-order section — both satisfy the words. Every filter of every order
can be scaled to put its −3 dB point anywhere you name, so naming that point
constrains nothing about rejection. The transition band is where the whole
design lives, and it takes two frequencies with two attenuations to pin it
down.`,
        examTip: 'Whenever a question hands you a filter specification, write the four numbers in a column before doing anything else: f_p with A_p, f_st with A_s. If one of the four is missing, the missing one is either implied by convention (A_p = 3 dB, meaning the passband edge IS the −3 dB point) or the question is testing whether you notice. The order formulas take exactly those four numbers and nothing else.',
        importantNote: 'The Paley-Wiener condition is the reason no filter has a true stopband. A realizable response may be zero at isolated frequencies — that is what a notch is — but it cannot be zero across an interval. Every "stopband" in engineering practice is a band where attenuation exceeds an agreed number.',
      },
      {
        id: 'filt-butterworth-deep',
        title: '6. The Butterworth Approximation from First Principles',
        content: `## 6.1 One equation, and why it is that equation

$$\\lvert H(j\\omega )\\rvert ^{2} = \\frac{1}{1+(\\omega /\\omega _{c})^{2n}}$$

Four properties are built into that single line, and each one is a design
decision made for you:

1. It depends only on $\\omega ^{2}$, so it is **even** — a requirement for
   any real physical filter, whose response at $-\\omega$ mirrors that at
   $+\\omega$.
2. At $\\omega = 0$ it equals 1: **unit dc gain**, for every order.
3. At $\\omega = \\omega _{c}$ the denominator is exactly 2, so
   $\\lvert H\\rvert = 1/\\sqrt{2}$: the −3.0103 dB point sits at
   $\\omega _{c}$ **for every order**. This is the property that makes
   Butterworth cutoffs comparable across orders, and it is not shared by
   Chebyshev.
4. It decreases monotonically. No ripple anywhere, in either band.

## 6.2 Maximally flat, proved in two lines

Write $u = \\omega /\\omega _{c}$ and expand as a geometric series, valid for
$u < 1$:

$$\\frac{1}{1+u^{2n}} = 1 - u^{2n} + u^{4n} - u^{6n} + \\cdots$$

Every power of $u$ below $2n$ is **absent**. A Taylor coefficient that is
absent is a derivative that vanishes, so

$$\\left.\\frac{d^{m}}{du^{m}}\\lvert H\\rvert ^{2}\\right|_{u=0} = 0 \\qquad (m = 1, 2, \\ldots , 2n-1)$$

and the first derivative that survives is

$$\\left.\\frac{d^{2n}}{du^{2n}}\\lvert H\\rvert ^{2}\\right|_{u=0} = -(2n)!$$

That is what "maximally flat" means, exactly: of all responses with $n$
poles, this one has the largest possible number of vanishing derivatives at
dc. For $n = 2$ the first survivor is the fourth derivative, $-24$; for
$n = 3$ it is the sixth, $-720$; for $n = 6$ it is the twelfth,
$-479001600$.

### Worked example 6.1 — flatness as a number you can check

**Given**: Butterworth filters of orders 1, 2, 3 and 6, all evaluated at one
tenth of their cutoff.

**Handbook relation**: the shortfall below unit power gain is

$$1 - \\lvert H\\rvert ^{2} = \\frac{u^{2n}}{1+u^{2n}}$$

**Substitution and answer** at $u = 0.1$:

| n | $u^{2n}$ | shortfall $1-\\lvert H\\rvert ^{2}$ | first non-zero derivative at dc |
|---|---|---|---|
| 1 | $10^{-2}$ | $9.9010\\times 10^{-3}$ | 2nd, value $-2$ |
| 2 | $10^{-4}$ | $9.9990\\times 10^{-5}$ | 4th, value $-24$ |
| 3 | $10^{-6}$ | $9.99999\\times 10^{-7}$ | 6th, value $-720$ |
| 6 | $10^{-12}$ | $1.0000\\times 10^{-12}$ | 12th, value $-479001600$ |

Each extra order buys two more decades of flatness at a fixed fraction of
cutoff. The sixth-order filter is flat to twelve decimal places one tenth of
the way to its corner — far flatter than any resistor tolerance you could
build it from, which is why in practice component tolerance, not the
approximation, sets passband flatness.

![Log-log plot of the shortfall below unit power gain against frequency divided by cutoff, for Butterworth orders one, two and six. Each curve is a straight line whose slope equals twice the order, so the sixth-order line falls twelve decades over one decade of frequency while the first-order line falls only two.](/courses/fe-ee/figures/sig3-butter-flat.svg)

## 6.3 Where the poles have to go

The magnitude-squared function extends to the whole $s$-plane by the
substitution $\\omega \\to s/j$:

$$H(s)H(-s) = \\frac{1}{1+\\left(s/(j\\omega _{c})\\right)^{2n}}$$

Setting the denominator to zero gives $2n$ roots. They satisfy
$\\lvert s\\rvert = \\omega _{c}$ — all of them, exactly — so they lie on a
circle of radius $\\omega _{c}$, spaced by $\\pi /n$ radians. Half of them are
in the right half-plane and belong to $H(-s)$; the stable filter takes the
$n$ in the left half-plane:

$$s_{k} = \\omega _{c}\\exp\\left[j\\left(\\frac{\\pi }{2}+\\frac{(2k+1)\\pi }{2n}\\right)\\right], \\qquad k = 0, 1, \\ldots , n-1$$

Three consequences follow immediately. No pole ever lands on the imaginary
axis, because the angles are odd multiples of $\\pi /(2n)$ offset by
$\\pi /2$ — so a Butterworth filter is unconditionally stable. The poles come
in conjugate pairs, so the polynomial has real coefficients. And for odd $n$
one pole falls on the real axis, at $-\\omega _{c}$ exactly; that lone pole is
the first-order section every odd-order design carries.

![Pole plot for the sixth-order Butterworth on the circle of radius one, six crosses in the left half-plane at one hundred and five, one hundred and thirty-five and one hundred and sixty-five degrees together with their conjugates. Radii are drawn to the three upper poles and each is annotated with the quality factor of the second-order section it forms.](/courses/fe-ee/figures/sig3-butter-poles.svg)

Every conjugate pair $s_{k}, s_{k}^{*}$ multiplies out to a real quadratic,

$$(s-s_{k})(s-s_{k}^{*}) = s^{2} - 2\\,\\mathrm{Re}(s_{k})\\,s + \\omega _{c}^{2}$$

and setting that alongside $s^{2}+(\\omega _{n}/Q)s+\\omega _{n}^{2}$ reads the
section quality factor straight off the pole angle:

$$Q_{k} = \\frac{\\omega _{c}}{-2\\,\\mathrm{Re}(s_{k})} = \\frac{1}{-2\\cos \\theta _{k}}$$

### Worked example 6.2 — the third-order poles by hand

**Given**: $n = 3$, normalised so $\\omega _{c} = 1$.

**Handbook relation**: the pole-angle formula above with $n = 3$ gives
$\\theta _{k} = 90^{\\circ } + (2k+1)30^{\\circ }$.

**Substitution**: $k = 0$ gives $120^{\\circ }$, $k = 1$ gives
$180^{\\circ }$, $k = 2$ gives $240^{\\circ }$.

**Answer**: the poles are $-0.5 \\pm j0.866$ and $-1$. The conjugate pair
multiplies to $s^{2}+s+1$ — its middle coefficient is
$-2\\cos 120^{\\circ } = 1$ — and the real pole contributes $s+1$, so

$$B_{3}(s) = (s+1)(s^{2}+s+1) = s^{3}+2s^{2}+2s+1$$

The section $Q$ is $1/(-2\\cos 120^{\\circ }) = 1.0000$.

**Check**: expand and confirm the coefficients are $1, 2, 2, 1$ — a
palindrome, as every normalised Butterworth polynomial is, because the poles
lie on the unit circle and therefore come in reciprocal pairs.

Repeating that construction for orders one through six produces the standard
normalised Butterworth polynomials. **These are computed here from the pole
formula, not copied from a table**, and they agree digit for digit with the
usual tabulations, which are normalised the same way — to $\\omega _{c} = 1$
radian per second, with a leading coefficient of one and a constant term of
one:

| n | normalised denominator, $\\omega _{c} = 1$ | pole angles (degrees, upper half) | section Q values |
|---|---|---|---|
| 1 | $s+1$ | 180 | first order, no Q |
| 2 | $s^{2}+1.414214s+1$ | 135 | 0.707107 |
| 3 | $s^{3}+2s^{2}+2s+1$ | 120, 180 | 1.000000 plus a real pole |
| 4 | $s^{4}+2.613126s^{3}+3.414214s^{2}+2.613126s+1$ | 112.5, 157.5 | 0.541196, 1.306563 |
| 5 | $s^{5}+3.236068s^{4}+5.236068s^{3}+5.236068s^{2}+3.236068s+1$ | 108, 144, 180 | 0.618034, 1.618034 plus a real pole |
| 6 | $s^{6}+3.863703s^{5}+7.464102s^{4}+9.141620s^{3}+7.464102s^{2}+3.863703s+1$ | 105, 135, 165 | 0.517638, 0.707107, 1.931852 |

Two patterns are worth memorising. The **highest** section Q always belongs
to the pole nearest the imaginary axis and grows quickly with order — 1.93 at
sixth order, and it keeps climbing. And the fifth-order Q values, 0.618034
and 1.618034, are the golden ratio and its reciprocal, a consequence of the
$36^{\\circ }$ pole spacing rather than a coincidence.

## 6.4 Evaluating the polynomial is the check that catches everything

The magnitude formula and the pole polynomial are two routes to the same
number, so computing both is a genuine verification.

### Worked example 6.3 — third-order attenuation, two ways

**Given**: $B_{3}(s) = s^{3}+2s^{2}+2s+1$, normalised.

**Route one — evaluate the polynomial.** At $u = 2$, substitute $s = j2$:

$$B_{3}(j2) = -j8 - 8 + j4 + 1 = -7 - j4$$

$$\\lvert B_{3}(j2)\\rvert = \\sqrt{49+16} = \\sqrt{65} = 8.062258$$

so the attenuation is $20\\log _{10}(8.062258) = 18.1291\\ \\mathrm{dB}$.

**Route two — the magnitude formula.**
$10\\log _{10}(1+2^{6}) = 10\\log _{10}(65) = 18.1291\\ \\mathrm{dB}$.

**Answer**: 18.1291 dB, confirmed twice. Repeat at $u = 10$:
$B_{3}(j10) = -199 - j980$, magnitude $\\sqrt{1000001} = 1000.0005$, giving
60.0000 dB — and $10\\log _{10}(1+10^{6})$ gives 60.0000 dB as well.

**Why bother**: the two routes fail differently. A slip in the pole angles
corrupts route one and leaves route two untouched; a slip in reading the
order corrupts route two and leaves route one untouched. Agreement to four
decimal places means both are right.

### Worked example 6.4 — why fifth order missed the specification

**Given**: the section 4 specification — 1 kHz at 1 dB, 2 kHz at 30 dB — and
the question of what a **fifth**-order Butterworth would actually deliver.

**Handbook relation**: pin the passband edge first, exactly as section 4.2
did, but with $n = 5$:

$$f_{c} = f_{p}/(10^{A_{p}/10}-1)^{1/(2n)} = 1\\ \\mathrm{kHz}/(0.258925)^{1/10} = 1.1447\\ \\mathrm{kHz}$$

**Substitution**: the stopband ratio is $2/1.1447 = 1.7472$, and

$$10\\log _{10}\\left[1+(1.7472)^{10}\\right] = 24.25\\ \\mathrm{dB}$$

**Answer**: **24.25 dB, against 30 dB required — short by 5.75 dB.** The
order formula returned 5.957, and the fractional part is not a rounding
nicety; it is nearly six decibels of real shortfall. Sixth order delivers
30.26 dB, a margin of 0.26 dB.

**The distractor**: a candidate who rounds 5.957 to 6 gets the right answer
for the right reason; one who rounds 5.2 down to 5 in some other problem
gets a filter that misses by several decibels. The rule is not "round to the
nearest integer", it is "the smallest integer at or above the formula's
value".`,
        examTip: 'Two Butterworth facts pay for themselves on every filter question. First, the −3 dB point is at ωc for every order — the order changes the slope, never the corner. Second, all poles sit on the circle of radius ωc, so a pole plot with poles at different radii is not Butterworth, whatever the question calls it.',
        importantNote: 'The section Q values rise with order: 0.707 at second order, 1.31 at fourth, 1.93 at sixth. A high-Q section is the one that peaks, rings and is most sensitive to component tolerance, so in a cascade it is always the stage that limits real performance. Knowing which stage that is tells you where to spend money on precision parts.',
      },
      {
        id: 'filt-cheby-bessel',
        title: '7. Chebyshev and Bessel: Buying Steepness, Buying Phase',
        content: `## 7.1 The Chebyshev polynomials

Chebyshev filters replace $u^{2n}$ in the Butterworth denominator with the
square of a polynomial that oscillates. The polynomials are defined by a
recursion,

$$T_{0}(x) = 1, \\qquad T_{1}(x) = x, \\qquad T_{n+1}(x) = 2x\\,T_{n}(x) - T_{n-1}(x)$$

which generates $T_{2} = 2x^{2}-1$, $T_{3} = 4x^{3}-3x$ and
$T_{4} = 8x^{4}-8x^{2}+1$. The property that matters is a change of
behaviour at $x = 1$:

$$T_{n}(x) = \\cos (n\\arccos x) \\ \\ (\\lvert x\\rvert \\le 1), \\qquad T_{n}(x) = \\cosh (n\\,\\mathrm{arccosh}\\,x) \\ \\ (x > 1)$$

Inside the unit interval it is a cosine of something, so it oscillates
between $-1$ and $+1$ and never leaves. Outside, it is a hyperbolic cosine,
which grows explosively. **Bounded oscillation inside, explosive growth
outside** — that is a passband and a stopband written as one function.

## 7.2 The magnitude and the ripple parameter

$$\\lvert H(j\\omega )\\rvert ^{2} = \\frac{1}{1+\\varepsilon ^{2}T_{n}^{2}(\\omega /\\omega _{p})}, \\qquad \\varepsilon ^{2} = 10^{A_{p}/10}-1$$

Inside the passband $T_{n}^{2}$ swings between 0 and 1, so the magnitude
swings between 1 and $1/\\sqrt{1+\\varepsilon ^{2}}$ and nowhere else. That
lower limit **is** the ripple depth:

| passband ripple $A_{p}$ | $\\varepsilon ^{2}$ | $\\varepsilon$ | $1/\\sqrt{1+\\varepsilon ^{2}}$ |
|---|---|---|---|
| 0.5 dB | 0.122018 | 0.349311 | 0.944061 |
| 1.0 dB | 0.258925 | 0.508847 | 0.891251 |

Counting the touches is a favourite exam detail. Over $0 \\le x \\le 1$ the
polynomial $T_{n}$ reaches $\\pm 1$ at $n+1$ points and zero at $n$ points, so
an $n$th-order Chebyshev magnitude touches the **bottom** of the ripple band
$n/2 + 1$ times and the **top** $n/2$ times when $n$ is even. For $n = 4$
that is three touches of $-A_{p}$ (at dc, at $\\omega /\\omega _{p} = 0.7071$
and at the edge) and two of 0 dB. Odd orders start at the top instead,
because $T_{n}(0) = 0$ for odd $n$, so their dc gain is exactly 1.

![Two stacked panels sharing a frequency axis scaled to the passband edge. The upper panel magnifies the passband: the fourth-order one-decibel Chebyshev oscillates between zero and minus one decibel while both Butterworth curves stay pinned near zero. The lower panel shows the full range, where the Chebyshev knee is steeper than the sixth-order Butterworth near the edge and shallower far out.](/courses/fe-ee/figures/sig3-cheby-ripple.svg)

The lower panel repays a second look. Between roughly 1.1 and 1.9 times the
passband edge the fourth-order Chebyshev is **below** the sixth-order
Butterworth — a lower-order filter attenuating more. Past about twice the
edge the sixth-order curve crosses back underneath and stays there forever,
because asymptotic slope is set by order alone and no amount of ripple
changes it. Ripple buys a sharper knee, not a steeper skirt.

### Worked example 7.1 — attenuation at twice the passband edge

**Given**: 1 dB ripple, so $\\varepsilon ^{2} = 0.258925$; evaluate at
$\\omega /\\omega _{p} = 2$ for $n = 3$ and $n = 4$.

**Handbook relation**: attenuation
$= 10\\log _{10}\\left[1+\\varepsilon ^{2}T_{n}^{2}(2)\\right]$, with $T_{n}$
from the explicit polynomials.

**Substitution**, third order first:

$$T_{3}(2) = 4(2)^{3}-3(2) = 32-6 = 26$$

$$10\\log _{10}\\left[1+0.258925\\times 676\\right] = 10\\log _{10}(1+175.03) = 10\\log _{10}(176.03) = 22.456\\ \\mathrm{dB}$$

Fourth order:

$$T_{4}(2) = 8(2)^{4}-8(2)^{2}+1 = 128-32+1 = 97$$

$$10\\log _{10}\\left[1+0.258925\\times 9409\\right] = 10\\log _{10}(1+2436.23) = 10\\log _{10}(2437.23) = 33.869\\ \\mathrm{dB}$$

**Answer**: 22.456 dB at third order, 33.869 dB at fourth. Against the
section 4 requirement of 30 dB, third order fails by 7.5 dB and fourth
passes with 3.9 dB to spare — which is exactly what the order formula's
value of 3.6615 predicted.

**Check by an independent route**: building the fourth-order pole polynomial
from the Chebyshev pole formula and evaluating it at $s = j2$ returns
33.8690 dB, agreeing with the $T_{4}$ route to four decimals.

## 7.3 The two filters side by side

Both designs from section 4 now exist as polynomials, so their responses can
simply be evaluated and tabulated. Every entry below comes from computing
$\\lvert H(j\\omega )\\rvert$ for the actual sixth-order Butterworth (cutoff
1119.19 Hz) and the actual fourth-order 1 dB Chebyshev (passband edge
1000 Hz):

| frequency | Butterworth $n=6$ | Chebyshev $n=4$, 1 dB | which is better |
|---|---|---|---|
| 500 Hz | 0.0003 dB | 0.2724 dB | Butterworth, by a whisker |
| 800 Hz | 0.0766 dB | 0.7339 dB | Butterworth |
| 1000 Hz | 1.0000 dB | 1.0000 dB | tie, by construction |
| 1200 Hz | 5.196 dB | 10.227 dB | Chebyshev |
| 1500 Hz | 15.390 dB | 21.583 dB | Chebyshev |
| 2000 Hz | 30.259 dB | 33.869 dB | Chebyshev |
| 3000 Hz | 51.386 dB | 49.355 dB | Butterworth |
| 4000 Hz | 66.379 dB | 59.802 dB | Butterworth |

The crossover sits between 2 and 3 kHz. Inside the passband the Butterworth
is flatter, in the transition the Chebyshev is far sharper, and deep in the
stopband the extra two poles win again. A specification that stops at 2 kHz
sees only the middle of that story, which is why the Chebyshev needs fewer
poles for it.

## 7.4 Bessel: the other end of the trade

Magnitude is not the only thing a filter does to a signal. **Group delay**

$$\\tau _{g}(\\omega ) = -\\frac{d\\,\\arg H(j\\omega )}{d\\omega }$$

is the time each frequency component is held up. If $\\tau _{g}$ is constant,
every component is delayed equally and the waveform emerges intact, merely
late. If it varies, the components rearrange themselves — pulses ring,
overshoot and smear even though every one of them was passed at full
amplitude.

A useful shortcut: for a transfer function $b_{0}/(s^{n}+\\cdots +a_{1}s+a_{0})$
with a constant numerator, the delay at dc is

$$\\tau _{g}(0) = \\frac{a_{1}}{a_{0}}$$

**Bessel** filters are designed by maximising the flatness of $\\tau _{g}$ at
dc, exactly as Butterworth maximises the flatness of $\\lvert H\\rvert$. Their
denominators are the reverse Bessel polynomials, generated by

$$\\theta _{n}(s) = (2n-1)\\,\\theta _{n-1}(s) + s^{2}\\,\\theta _{n-2}(s), \\qquad \\theta _{0} = 1, \\ \\theta _{1} = s+1$$

| n | $\\theta _{n}(s)$ | $\\tau _{g}(0) = a_{1}/a_{0}$ |
|---|---|---|
| 1 | $s+1$ | $1/1 = 1$ |
| 2 | $s^{2}+3s+3$ | $3/3 = 1$ |
| 3 | $s^{3}+6s^{2}+15s+15$ | $15/15 = 1$ |
| 4 | $s^{4}+10s^{3}+45s^{2}+105s+105$ | $105/105 = 1$ |

The constant term always equals the coefficient of $s$, which is the
normalisation that puts the dc delay at exactly one second for every order.

### Worked example 7.2 — the second-order Bessel, delay and magnitude

**Given**: $H(s) = 3/(s^{2}+3s+3)$.

**Handbook relation**: differentiate the phase.
$\\arg H = -\\arctan\\left[3\\omega /(3-\\omega ^{2})\\right]$, and carrying out
the derivative gives the closed form

$$\\tau _{g}(\\omega ) = \\frac{9+3\\omega ^{2}}{\\omega ^{4}+3\\omega ^{2}+9}$$

**Substitution and answer**:

- $\\omega = 0$: $9/9 = 1.0000$ — matching $a_{1}/a_{0}$, as it must.
- $\\omega = 1$: $12/13 = 0.923077$, down only 7.7 %.
- $\\omega = 2$: $21/37 = 0.567568$.

**And the price.** At $\\omega = 1$ the denominator is
$-1+j3+3 = 2+j3$, of magnitude $\\sqrt{13} = 3.605551$, so
$\\lvert H\\rvert = 3/3.605551 = 0.832050$, which is **−1.597 dB**. A
Butterworth of the same order is 3.0103 dB down there. The Bessel is still
in its passband at the frequency where the Butterworth has reached its
corner; its own −3 dB point is out at $\\omega = 1.3617$. Bessel filters
always look "slow" in magnitude because their corner has been pushed out to
keep the delay flat.

**Check by numerical differentiation**: differentiating the phase of the same
$H$ numerically returns 1.000000, 0.923077 and 0.567568 — the closed form is
right.

### Worked example 7.3 — how flat is flat, at fourth order

**Given**: fourth-order Bessel, Butterworth and 1 dB Chebyshev, each scaled
so its own −3 dB frequency is the unit of comparison.

**Handbook relation**: compute $\\tau _{g}(\\omega )/\\tau _{g}(0)$ across
$0 \\le \\omega \\le \\omega _{3\\mathrm{dB}}$ and record the spread.

**Answer**:

| family, $n = 4$ | $\\omega _{3\\mathrm{dB}}$ in prototype units | $\\tau _{g}(0)$ | range of $\\tau _{g}/\\tau _{g}(0)$ | spread |
|---|---|---|---|---|
| Bessel | 2.113918 | 1.000000 | 0.9819 to 1.0000 | 1.81 % |
| Butterworth | 1.000000 | 2.613126 | 1.0000 to 1.4961 | 49.61 % |
| Chebyshev, 1 dB | 1.053002 | 2.694285 | 1.0000 to 3.0162 | 201.62 % |

**Read the third column too.** The Bessel's dc delay is the *smallest* of the
three in prototype units, and its −3 dB frequency is more than twice as far
out — it is a gentler filter in every magnitude sense. What it buys is the
last column: its delay wanders by under two percent where the Chebyshev's
triples.

![Group delay divided by its own dc value plotted against frequency divided by each filter's own minus three decibel frequency, for fourth-order Bessel, Butterworth and one-decibel Chebyshev. The Bessel trace is a nearly flat line just below one; the Butterworth rises to about one and a half; the Chebyshev climbs past three near the band edge.](/courses/fe-ee/figures/sig3-group-delay.svg)

**The distractor**: a question that asks which filter "distorts least" and
offers elliptic as an option is testing whether you conflate magnitude
flatness with waveform fidelity. Elliptic has the sharpest magnitude and the
worst delay. For a square wave or a data pulse, Bessel wins and elliptic is
the worst choice available.

## 7.5 Choosing between the four families

| Requirement | Choose | Because |
|---|---|---|
| No passband ripple, predictable corner | Butterworth | maximally flat, −3 dB at $\\omega _{c}$ for any order |
| Fewest poles for a given transition | Elliptic, else Chebyshev | ripple in one or both bands buys the knee |
| Flat passband, sharp skirt, ripple acceptable in the stopband | Chebyshev type II | equiripple moved to where nothing lives |
| Pulses, video, data eyes | Bessel | delay flat to 1.8 % at fourth order |
| Anti-aliasing ahead of a converter | Butterworth or Chebyshev | only magnitude matters before sampling |`,
        examTip: 'Chebyshev questions almost always turn on one of three facts: the ripple depth is 1/sqrt(1 + ε²) with ε² = 10^(Ap/10) − 1; the ripple lives only inside the passband; and the −3 dB frequency is NOT the passband edge (for 1 dB ripple at fourth order it sits at 1.053 times the edge). Confusing the passband edge with the −3 dB point is the single most common error in this topic.',
        importantNote: 'Group delay is the derivative of phase with respect to frequency, not the phase itself. A filter can have large phase shift and perfectly flat delay — that is a pure time shift and harms nothing. It is the VARIATION of delay across the band that smears waveforms.',
      },
      {
        id: 'filt-sallen-key',
        title: '8. Active Realization: The Sallen-Key Section, Derived and Designed',
        content: `## 8.1 Deriving the transfer function

The unity-gain Sallen-Key low-pass is two resistors, two capacitors and one
op-amp wired as a follower. The input drives $R_{1}$ into node A; $R_{2}$
carries node A to node B; $C_{2}$ shunts node B to ground; node B feeds the
non-inverting input; and $C_{1}$ returns from the op-amp output to node A.
That single feedback capacitor is what makes complex poles possible.

The follower forces $V_{B} = V_{o}$. Node B then gives

$$\\frac{V_{A}-V_{o}}{R_{2}} = V_{o}\\,sC_{2} \\qquad \\Longrightarrow \\qquad V_{A} = V_{o}(1+sR_{2}C_{2})$$

Kirchhoff's current law at node A, with the $C_{1}$ current flowing back to
the output, reads

$$\\frac{V_{i}-V_{A}}{R_{1}} = \\frac{V_{A}-V_{o}}{R_{2}} + (V_{A}-V_{o})\\,sC_{1}$$

Substituting $V_{A}-V_{o} = V_{o}\\,sR_{2}C_{2}$ on the right and
$V_{A} = V_{o}(1+sR_{2}C_{2})$ on the left, then multiplying through by
$R_{1}$:

$$V_{i} = V_{o}\\left[1 + sC_{2}(R_{1}+R_{2}) + s^{2}R_{1}R_{2}C_{1}C_{2}\\right]$$

$$H(s) = \\frac{1}{R_{1}R_{2}C_{1}C_{2}\\,s^{2} + C_{2}(R_{1}+R_{2})\\,s + 1}$$

Matching this against $\\omega _{n}^{2}/(s^{2}+(\\omega _{n}/Q)s+\\omega _{n}^{2})$:

$$\\omega _{n} = \\frac{1}{\\sqrt{R_{1}R_{2}C_{1}C_{2}}}, \\qquad Q = \\frac{\\sqrt{R_{1}R_{2}C_{1}C_{2}}}{C_{2}(R_{1}+R_{2})}$$

## 8.2 The equal-resistor design equations

Two equations and four components leave two degrees of freedom. Spending one
of them by setting $R_{1} = R_{2} = R$ shrinks the algebra to two relations simple
enough to carry unaided:

$$\\omega _{n} = \\frac{1}{R\\sqrt{C_{1}C_{2}}}, \\qquad Q = \\frac{1}{2}\\sqrt{\\frac{C_{1}}{C_{2}}}, \\qquad \\frac{C_{1}}{C_{2}} = 4Q^{2}$$

**The capacitor ratio alone sets Q, and the resistor alone scales the
frequency.** The two design decisions become independent, which is why this
form is the one worth carrying into an exam. Note also that $Q$ is set by a
*ratio* of like components, which tracks well over temperature, while
$\\omega _{n}$ depends on an $RC$ product, which does not.

### Worked example 8.1 — a 1 kHz Butterworth section

**Given**: $f_{n} = 1\\ \\mathrm{kHz}$, $Q = 1/\\sqrt{2} = 0.7071$, equal
resistors, $C_{2} = 10\\ \\mathrm{nF}$ chosen as a convenient value.

**Handbook relation**: $C_{1}/C_{2} = 4Q^{2}$ and
$R = 1/(\\omega _{n}\\sqrt{C_{1}C_{2}})$.

**Substitution**: $Q^{2} = 0.5$, so the ratio is $4\\times 0.5 = 2$ and
$C_{1} = 20\\ \\mathrm{nF}$. The geometric mean of 20 nF and 10 nF is

$$\\sqrt{C_{1}C_{2}} = \\sqrt{(20\\ \\mathrm{nF})(10\\ \\mathrm{nF})} = 14.1421\\ \\mathrm{nF}$$

and $\\omega _{n} = 2\\pi (1000) = 6283.185\\ \\mathrm{rad/s}$, so

$$R = \\frac{1}{(6283.185)(14.1421\\times 10^{-9})} = 11254\\ \\Omega$$

**Answer**: $R_{1} = R_{2} = 11.25\\ \\mathrm{k}\\Omega$,
$C_{1} = 20\\ \\mathrm{nF}$, $C_{2} = 10\\ \\mathrm{nF}$.

### Worked example 8.2 — verifying that section by evaluating H

**Given**: the components just chosen.

**Handbook relation**: substitute them back into the derived $H(s)$ and
evaluate at $s = j2\\pi f$ — the check that catches a design error the design
equations cannot.

**Answer**:

| frequency | $\\lvert H\\rvert$ | in decibels | expectation |
|---|---|---|---|
| 100 Hz | 0.999950 | −0.0004 dB | flat, one tenth of the corner |
| 500 Hz | 0.970143 | −0.2633 dB | still inside the passband |
| 1000 Hz | 0.707107 | −3.0103 dB | the corner, exactly |
| 2000 Hz | 0.242536 | −12.3045 dB | the knee, not yet asymptotic |
| 10000 Hz | 0.009999 | −40.0004 dB | one decade out, $-20n\\log _{10}10$ with $n=2$ |

The 1 kHz row is the one that proves the design: for $Q = 0.7071$ the
magnitude at $\\omega _{n}$ is exactly $Q$, and $Q = 1/\\sqrt{2}$ is the
$-3$ dB value. That coincidence holds only at the Butterworth $Q$; at any
other $Q$ the −3 dB point and $\\omega _{n}$ part company.

![Three magnitude curves in decibels against frequency on a logarithmic axis, computed from Sallen-Key sections that share a natural frequency of one kilohertz and differ only in the capacitor ratio. The lowest quality factor droops earliest, the Butterworth value crosses minus three decibels exactly at the corner, and the highest peaks six decibels above unity before falling.](/courses/fe-ee/figures/sig3-sallen-key-q.svg)

The peaking of the high-Q trace has a closed form worth knowing:

$$\\lvert H\\rvert _{\\max } = \\frac{Q}{\\sqrt{1-1/(4Q^{2})}} \\qquad (Q > 0.7071)$$

For $Q = 1.9319$ that evaluates to exactly 2, or 6.0206 dB — visible in the
figure and confirmed by sweeping the transfer function.

## 8.3 Cascading sections

Buffered sections multiply:

$$H_{\\mathrm{total}}(s) = H_{1}(s)\\,H_{2}(s)\\cdots H_{m}(s)$$

so the total order is the sum of the section orders, and the decibel curves
**add**. An even order is $n/2$ second-order sections; an odd order is
$(n-1)/2$ second-order sections plus one first-order section for the real
pole.

Two rules govern the arrangement:

- **Assign the Q values from the pole table, never split them evenly.** A
  sixth-order Butterworth is Q = 0.5176, 0.7071 and 1.9319 — three different
  sections. Three identical Q = 0.7071 sections give a completely different
  (and much droopier) response, which is the cascade trap of section 3.2 in
  its higher-order form.
- **Put the lowest-Q section first.** The high-Q section has gain above unity
  near its natural frequency; placing it early would let it overload the
  stages that follow on signals the filter is supposed to reject. Ordering
  low-Q to high-Q keeps the internal signal swing smallest.

## 8.4 Where the ideal section stops being ideal

| Effect | Consequence | Mitigation |
|---|---|---|
| Finite op-amp gain-bandwidth | $Q$ and $\\omega _{n}$ both drift upward | choose a device with gain-bandwidth well above $Q\\,f_{n}$ |
| Component tolerance | $\\omega _{n}$ follows the $RC$ product, $Q$ the capacitor ratio | tolerance on $Q$ is the looser problem |
| Op-amp output impedance | rises with frequency, degrading the feedback path | keep $R$ in the kilohm range, not tens of ohms |
| Capacitor dielectric loss | passband droop and $Q$ loss | film capacitors in the signal path |

The middle row is the design lever: because $Q$ depends on a ratio of two
capacitors and $\\omega _{n}$ on their product with $R$, a five percent
capacitor pair from the same batch holds $Q$ far better than five percent
suggests, while the corner frequency moves by the full tolerance.

## 8.5 Transformations, worked

Section 3.3 tabulated the substitutions. Here they are carried out.

### Worked example 8.3 — low-pass prototype to a 4 kHz high-pass

**Given**: the normalised second-order Butterworth
$H_{p}(s) = 1/(s^{2}+\\sqrt{2}s+1)$ and a target high-pass corner of 4 kHz.

**Handbook relation**: substitute $s \\to \\omega _{h}/s$ and clear
denominators.

**Substitution**: $\\omega _{h} = 2\\pi (4000) = 25132.74\\ \\mathrm{rad/s}$, and

$$H_{\\mathrm{HP}}(s) = \\frac{1}{(\\omega _{h}/s)^{2}+\\sqrt{2}(\\omega _{h}/s)+1} = \\frac{s^{2}}{s^{2}+\\sqrt{2}\\,\\omega _{h}s+\\omega _{h}^{2}}$$

**Answer**: the substitution has planted a **double zero at the origin** —
that is the mechanism by which dc is blocked. Evaluating the result:

| frequency | magnitude |
|---|---|
| 400 Hz | −40.0004 dB |
| 2000 Hz | −12.3045 dB |
| 4000 Hz | −3.0103 dB |
| 40000 Hz | −0.0004 dB |

Compare with the low-pass table in worked example 8.2: the numbers are the
same list read backwards. The transformation is a reflection of the response
about its corner, on a logarithmic frequency axis.

### Worked example 8.4 — low-pass prototype to a band-pass, and the edges it actually produces

**Given**: the first-order prototype $1/(s+1)$, a centre frequency of
1000 Hz and a bandwidth of 200 Hz.

**Handbook relation**: substitute $s \\to (s^{2}+\\omega _{0}^{2})/(Bs)$.

**Substitution**:

$$H_{\\mathrm{BP}}(s) = \\frac{1}{(s^{2}+\\omega _{0}^{2})/(Bs)+1} = \\frac{Bs}{s^{2}+Bs+\\omega _{0}^{2}}$$

**Answer**: setting $\\lvert H\\rvert = 1/\\sqrt{2}$ gives
$\\lvert s^{2}+\\omega _{0}^{2}\\rvert = B\\omega$, whose positive solutions are

$$f_{1,2} = \\frac{\\mp B + \\sqrt{B^{2}+4f_{0}^{2}}}{2}$$

With the numbers, $\\sqrt{B^{2}+4f_{0}^{2}} = \\sqrt{4040000} = 2009.975$, so

$$f_{1} = (2009.975-200)/2 = 904.9875\\ \\mathrm{Hz}, \\qquad f_{2} = (2009.975+200)/2 = 1104.9875\\ \\mathrm{Hz}$$

**Check**: the difference is $1104.9875-904.9875 = 200.0000\\ \\mathrm{Hz}$ —
the requested bandwidth — and the geometric mean
$\\sqrt{(904.9875)(1104.9875)} = 1000.00\\ \\mathrm{Hz}$, the requested centre.
Both to six figures, and sweeping the transfer function numerically locates
the same two edges.

**The distractor**: 900 Hz and 1100 Hz. Those are the *arithmetically*
centred edges, and they are wrong by about 5 Hz each. The band-pass
transformation is geometric, as section 3.4 warned from the other direction:
given edges of 900 and 1100 the centre is 994.99 Hz, not 1000.`,
        examTip: 'For the equal-resistor Sallen-Key section, memorise exactly two lines: C1/C2 = 4Q² and R = 1/(ωn·sqrt(C1·C2)). Every component question in this family falls out of them. Pick C2 as a round value, get C1 from the ratio, then compute R — never the other way around, because capacitors come in far fewer values than resistors.',
        importantNote: 'Cascaded sections multiply their transfer functions, so their decibel curves add — but only if each section is buffered from the next. The Sallen-Key op-amp output provides that buffering automatically. Cascading passive RC stages directly does NOT multiply their individual responses, because each stage loads the one before it.',
      },
      {
        id: 'filt-full-design',
        title: '9. A Complete Design, Verified Numerically',
        content: `## 9.1 The specification

A voice-band channel is to be low-pass filtered ahead of a converter.

| Parameter | Value |
|---|---|
| Passband edge $f_{p}$ | 3.4 kHz |
| Maximum passband attenuation $A_{p}$ | 0.5 dB |
| Stopband edge $f_{st}$ | 10 kHz |
| Minimum stopband attenuation $A_{s}$ | 45 dB |

Four numbers, as section 5.4 demanded. Note what is *not* specified: the
−3 dB frequency. It is an outcome of the design, not an input to it.

### Worked example 9.1 — the order, both families

**Handbook relation**, Butterworth:

$$n \\ge \\frac{\\log_{10}\\left[(10^{A_{s}/10}-1)/(10^{A_{p}/10}-1)\\right]}{2\\log _{10}(f_{st}/f_{p})}$$

**Substitution**: $10^{4.5}-1 = 31621.78$ and $10^{0.05}-1 = 0.122018$, so
the ratio inside the bracket is

$$31621.7766/0.1220185 = 259155.6$$

whose logarithm is 5.4135606. The denominator is
$2\\log _{10}(10/3.4) = 2\\log _{10}(2.941176) = 0.9370422$.

$$n \\ge 5.4135606/0.9370422 = 5.77729$$

**Answer**: a **sixth-order Butterworth**.

**Chebyshev**, same four numbers:

$$n \\ge \\frac{\\cosh^{-1}\\sqrt{259155.6}}{\\cosh^{-1}(10/3.4)} = \\frac{\\cosh^{-1}(509.0733)}{\\cosh^{-1}(2.941176)} = \\frac{6.925738}{1.741717} = 3.976385$$

so a **fourth-order Chebyshev** with 0.5 dB ripple would also do. Two poles
fewer. This chapter takes the Butterworth route because the channel carries
waveform-sensitive data, and section 7.4 quantified what Chebyshev group
delay would do to it.

### Worked example 9.2 — placing the cutoff

**Given**: $n = 6$, $A_{p} = 0.5\\ \\mathrm{dB}$ at $f_{p} = 3.4\\ \\mathrm{kHz}$.

**Handbook relation**: solve the Butterworth magnitude for the frequency at
which attenuation equals $A_{p}$:

$$f_{c} = \\frac{f_{p}}{(10^{A_{p}/10}-1)^{1/(2n)}}$$

**Substitution**: $(0.122018)^{1/12} = 0.839206$, so

$$f_{c} = 3400/0.839206 = 4051.45\\ \\mathrm{Hz}$$

**Answer**: $f_{c} = 4.0514\\ \\mathrm{kHz}$, comfortably above the 3.4 kHz
passband edge. Anyone who sets the cutoff at 3.4 kHz has quietly changed the
specification from 0.5 dB of passband loss to 3.01 dB.

**Advance check on the stopband**: the ratio is
$10000/4051.45 = 2.46825$, and

$$10\\log _{10}\\left[1+(2.46825)^{12}\\right] = 47.09\\ \\mathrm{dB}$$

against 45 dB required — 2.09 dB of margin, the reward for rounding 5.7774
up to 6.

## 9.2 From poles to parts

The six poles sit on the circle of radius
$\\omega _{c} = 2\\pi (4051.45) = 25455.99\\ \\mathrm{rad/s}$ at
$105^{\\circ }$, $135^{\\circ }$, $165^{\\circ }$ and their conjugates, giving
the three section Q values from the section 6.3 table. Choosing
$R = 10\\ \\mathrm{k}\\Omega$ for all three stages fixes

$$\\sqrt{C_{1}C_{2}} = \\frac{1}{\\omega _{c}R} = \\frac{1}{(25455.99)(10000)} = 3.9283\\ \\mathrm{nF}$$

for every stage, and $C_{1}/C_{2} = 4Q^{2}$ then splits that geometric mean
into the two capacitors.

### Worked example 9.3 — the three sets of capacitors

**Given**: the three Q values, $R = 10\\ \\mathrm{k}\\Omega$, and
$\\sqrt{C_{1}C_{2}} = 3.9283\\ \\mathrm{nF}$.

**Handbook relation**:
$C_{2} = \\sqrt{C_{1}C_{2}}/\\sqrt{4Q^{2}} = \\sqrt{C_{1}C_{2}}/(2Q)$ and
$C_{1} = 4Q^{2}C_{2}$.

**Substitution and answer**:

| stage | Q | $4Q^{2}$ | $C_{2}$ | $C_{1}$ | realised $f_{n}$ |
|---|---|---|---|---|---|
| 1 (first in the chain) | 0.517638 | 1.071797 | 3.7945 nF | 4.0669 nF | 4051.45 Hz |
| 2 | 0.707107 | 2.000000 | 2.7778 nF | 5.5555 nF | 4051.45 Hz |
| 3 (last) | 1.931852 | 14.928203 | 1.0167 nF | 15.1780 nF | 4051.45 Hz |

All three share the same natural frequency, as the Butterworth circle
requires — only the capacitor ratio changes from stage to stage. The
low-Q stage leads and the high-Q stage trails, following the ordering rule
of section 8.3.

## 9.3 Verifying the circuit, not the formula

The design so far rests on the Butterworth magnitude equation. The test that
means something is to forget that equation, substitute the **component
values above** into the Sallen-Key transfer function derived in section 8.1,
multiply the three sections together and evaluate the product.

$$H_{\\mathrm{total}}(s) = \\prod _{k=1}^{3}\\frac{1}{R^{2}C_{1k}C_{2k}s^{2}+2RC_{2k}s+1}$$

| frequency | cascade magnitude | requirement | verdict |
|---|---|---|---|
| 1000 Hz | −0.00000 dB | — | flat |
| 2000 Hz | −0.00091 dB | — | flat |
| 3400 Hz | **−0.50000 dB** | at most 0.5 dB | met exactly |
| 4051.45 Hz | −3.01030 dB | — | the −3 dB point, where predicted |
| 5000 Hz | −11.29786 dB | — | inside the transition |
| 8000 Hz | −35.45882 dB | — | approaching the stopband |
| 10000 Hz | **−47.08687 dB** | at least 45 dB | met, 2.09 dB spare |
| 15000 Hz | −68.21774 dB | — | −120 dB per decade taking hold |
| 20000 Hz | −83.21038 dB | — | asymptotic |

The circuit reproduces the specification to five decimal places, and the
47.08687 dB it delivers at 10 kHz matches the 47.09 dB the magnitude formula
predicted in worked example 9.2. Two independent routes, one answer.

![Magnitude of the completed sixth-order cascade in decibels against frequency on a logarithmic axis, with the passband requirement drawn as a shaded box that the curve must stay above and the stopband requirement as a second box it must stay below. The curve grazes the passband corner at half a decibel and clears the stopband corner with a visible margin.](/courses/fe-ee/figures/sig3-design-verify.svg)

The last two rows confirm the slope: from 10 kHz to 20 kHz — one octave —
the response falls by 36.12 dB, and $6.0206 \\times 6 = 36.12$ dB is exactly
what a sixth-order roll-off should give.

## 9.4 What the verification does not cover

A magnitude check confirms magnitude. It says nothing about:

- **Group delay.** This design's delay varies by about 50 % across its
  passband, per section 7.4. If the channel carried pulses rather than
  speech, that would be the dominant defect and a Bessel design or a delay
  equaliser would be needed.
- **Component tolerance.** Every capacitor above is quoted to five figures
  and none of them is purchasable. Rounding to nearest standard values moves
  $f_{c}$ and each $Q$; the margin of 2.09 dB is what absorbs that movement,
  which is the real reason to leave margin.
- **The op-amp.** Section 8.4's gain-bandwidth requirement bites hardest on
  stage 3, where $Q = 1.93$ demands the most loop gain.
- **Noise.** Three cascaded stages contribute three times the op-amp noise,
  weighted by their positions.

Reporting a design as finished on the strength of a magnitude plot alone is
the mistake this section exists to prevent.`,
        examTip: 'Design questions on the FE almost always stop at the order, occasionally at the cutoff frequency, and rarely at component values. Practise the sequence anyway — order, then cutoff, then poles, then parts, then verify — because a question that gives you three of those and asks for the fourth is testing whether you know which way the chain runs.',
        importantNote: 'Two independent routes to the same number is the standard this course holds itself to. Here the Butterworth magnitude formula predicted 47.09 dB at 10 kHz, and evaluating the product of three Sallen-Key sections built from the tabulated capacitors returned 47.08687 dB. If those two had disagreed, one of them would have been wrong, and a plot of either alone would have hidden it.',
      },
      {
        id: 'filt-problems',
        title: '10. Problem Sets',
        content: `## 10.1 Working method

Each answer below names the misstep it is built around, together with the
figure that misstep returns, because on a multiple-choice paper those figures
sit beside the correct one and are chosen to be within easy reach.

### Problem Set A — identification, order and roll-off

**A1.** A filter has $H(0) = 0$ and $H(s) \\to 3$ as $s \\to \\infty$. What
type is it, and what is the minimum order?

**A2.** How much attenuation does a fourth-order Butterworth provide three
octaves above its cutoff?

**A3.** A specification demands 1 dB at 2 kHz and 40 dB at 6 kHz. What
Butterworth order is required?

**A4.** For the order found in A3, where does the −3 dB frequency land?

**A5.** Two identical buffered first-order sections, each with a 1 kHz
corner, are cascaded. What is the overall −3 dB frequency, and what is the
attenuation at 1 kHz?

**A6.** A third-order Butterworth is normalised to $s^{3}+2s^{2}+2s+1$.
Evaluate its attenuation at $\\omega = 3$ by substituting into the
polynomial.

**A7.** A band-pass filter has −3 dB edges at 4 kHz and 9 kHz. Give its
bandwidth, centre frequency and Q.

**A8.** A 1 dB Chebyshev of order 5 is evaluated at its passband edge. What
is the attenuation there, and what is it at dc?

### Answers, Problem Set A

**A1.** Zero gain at dc and finite non-zero gain at infinity: a **high-pass**,
and because a single pole is enough to produce that behaviour, minimum order
is **1**. *Trap*: reading "gain 3 at infinity" as a band-pass because the
gain is not 1. Gain magnitude is irrelevant to type; only the behaviour at
the two extremes matters. That misreading yields "band-pass, order 2".

**A2.** Three octaves is a factor $2^{3} = 8$ in frequency. Evaluating the
magnitude,

$$10\\log _{10}\\left[1+8^{8}\\right] = 10\\log _{10}(16777217) = 72.25\\ \\mathrm{dB}$$

*Trap*: using the octave rule as $-6n$ per octave gives
$6 \\times 4 \\times 3 = 72\\ \\mathrm{dB}$, which is close but not equal —
the exact value is 72.25 dB because the asymptote has not fully taken hold.
Either will be marked right; what matters is being aware of which one is
exact. The costly error is applying the *decade* rule to an octave question:
$20 \\times 4 \\times 3 = 240\\ \\mathrm{dB}$, wrong by a factor of more
than three.

**A3.** With $A_{p} = 1$, $A_{s} = 40$, $f_{st}/f_{p} = 3$:

$$n \\ge \\frac{\\log_{10}\\left[(10^{4}-1)/(10^{0.1}-1)\\right]}{2\\log _{10}3} = \\frac{\\log_{10}(9999/0.2589254)}{0.954243} = \\frac{4.586782}{0.954243} = 4.806723$$

so **fifth order**. *Trap*: rounding 4.8067 to the nearest integer is
harmless here, but rounding *down* on a value like 4.07 is not — and a
candidate who has internalised "round to nearest" will do it. The rule is
always up.

**A4.** With $n = 5$ and the passband edge pinned at 1 dB:

$$f_{c} = 2000/(0.258925)^{1/10} = 2000/0.873610 = 2289.35\\ \\mathrm{Hz}$$

Checking the stopband at that cutoff: the ratio is
$6000/2289.35 = 2.6208$, and
$10\\log _{10}\\left[1+(2.6208)^{10}\\right] = 41.84\\ \\mathrm{dB}$, clearing
the 40 dB requirement with 1.84 dB to spare. *Trap*: answering 2 kHz, i.e. assuming the passband
edge *is* the −3 dB point. It is only when $A_{p}$ happens to be 3.0103 dB.

**A5.** Each section is 3.0103 dB down at 1 kHz, so the pair is
**6.0206 dB** down there — not 3 dB. The overall −3 dB frequency is

$$f_{3} = 1000\\sqrt{2^{1/2}-1} = 1000(0.643594) = 643.6\\ \\mathrm{Hz}$$

*Trap*: answering 1 kHz for the corner and 3 dB for the attenuation.
Cascading sections adds their decibel losses at every frequency, so the
composite corner always moves **down**. Section 3.2 states the general rule.

**A6.** Substitute $s = j3$:

$$B_{3}(j3) = -j27 - 18 + j6 + 1 = -17 - j21$$

$$\\lvert B_{3}(j3)\\rvert = \\sqrt{289+441} = \\sqrt{730} = 27.0185$$

Attenuation $= 20\\log _{10}(27.0185) = 28.633\\ \\mathrm{dB}$, and the
magnitude formula agrees: $10\\log _{10}(1+3^{6}) = 10\\log _{10}(730) = 28.633$.
*Trap*: forgetting that $(j3)^{3} = -j27$ and writing $+j27$, which gives
$-17+j33$ and an answer near 31.4 dB. Powers of $j$ cycle with period four;
$j^{3} = -j$.

**A7.** $B = 9-4 = 5\\ \\mathrm{kHz}$;
$f_{0} = \\sqrt{(4)(9)} = 6\\ \\mathrm{kHz}$; $Q = 6/5 = 1.2$.
*Trap*: the arithmetic mean, $(4+9)/2 = 6.5\\ \\mathrm{kHz}$, which then gives
$Q = 1.3$. For a band this wide the two means differ by 500 Hz. The
geometric mean is the correct one.

**A8.** At the passband edge $T_{5}(1) = 1$, so the attenuation is exactly
the ripple, **1 dB**. At dc, $T_{5}(0) = 0$ because the order is odd, so the
attenuation is exactly **0 dB**. *Trap*: answering 3 dB at the edge, or
answering 1 dB at dc by assuming every Chebyshev starts at the bottom of its
ripple band. Even orders start at the bottom; odd orders start at the top.

### Problem Set B — approximation families, sections and design

**B1.** A 0.5 dB Chebyshev is required. What is $\\varepsilon$, and what is
the minimum passband gain as a fraction of the maximum?

**B2.** Compute the attenuation of a 0.5 dB Chebyshev of order 3 at twice
its passband edge.

**B3.** A Sallen-Key section is to have $Q = 2$ and
$f_{n} = 5\\ \\mathrm{kHz}$ with equal resistors and $C_{2} = 1\\ \\mathrm{nF}$.
Find $C_{1}$ and $R$.

**B4.** For the section in B3, how much does the response peak, and at what
frequency?

**B5.** A fourth-order Butterworth is built as two Sallen-Key sections. What
Q values must they have, and what happens if both are built at $Q = 0.7071$?

**B6.** A second-order Bessel, $H(s) = 3/(s^{2}+3s+3)$, and a second-order
Butterworth, $H(s) = 1/(s^{2}+\\sqrt{2}s+1)$, are compared at
$\\omega = 1$. Give the magnitude and the group delay of each.

### Answers, Problem Set B

**B1.** $\\varepsilon ^{2} = 10^{0.05}-1 = 0.122018$, so
$\\varepsilon = 0.349311$. The minimum passband gain is

$$\\frac{1}{\\sqrt{1+\\varepsilon ^{2}}} = \\frac{1}{\\sqrt{1.122018}} = 0.944061$$

which is $-0.5$ dB, as it must be. *Trap*: computing
$\\varepsilon = 10^{0.05}-1 = 0.122$ and stopping — that is
$\\varepsilon ^{2}$, not $\\varepsilon$. Using 0.122 in place of 0.349 in the
attenuation formula understates the stopband rejection by about 9 dB.

**B2.** $T_{3}(2) = 26$ from the polynomial $4x^{3}-3x$. Then

$$10\\log _{10}\\left[1+0.122018\\times 676\\right] = 10\\log _{10}(1+82.48) = 10\\log _{10}(83.48) = 19.216\\ \\mathrm{dB}$$

*Trap*: using the 1 dB value $\\varepsilon ^{2} = 0.258925$ out of habit,
which gives 22.456 dB — 3.24 dB too optimistic. Less ripple always means
less stopband rejection at the same order; that is the trade in one number.

**B3.** $C_{1}/C_{2} = 4Q^{2} = 4(4) = 16$, so
$C_{1} = 16\\ \\mathrm{nF}$. The geometric mean is
$\\sqrt{(16\\ \\mathrm{nF})(1\\ \\mathrm{nF})} = 4\\ \\mathrm{nF}$, and
$\\omega _{n} = 2\\pi (5000) = 31415.93\\ \\mathrm{rad/s}$, so

$$R = \\frac{1}{(31415.93)(4\\times 10^{-9})} = 7957.7\\ \\Omega$$

**Answer**: $C_{1} = 16\\ \\mathrm{nF}$,
$R = 7.96\\ \\mathrm{k}\\Omega$. *Trap*: using $C_{1}/C_{2} = 2Q$ instead of
$4Q^{2}$, giving $C_{1} = 4\\ \\mathrm{nF}$ and a section whose Q is 1, half
what was asked. The relation is quadratic in Q because Q is *half* the square
root of the ratio.

**B4.** With $Q = 2$,

$$\\lvert H\\rvert _{\\max } = \\frac{Q}{\\sqrt{1-1/(4Q^{2})}} = \\frac{2}{\\sqrt{1-0.0625}} = \\frac{2}{0.968246} = 2.065591$$

which is $20\\log _{10}(2.065591) = 6.301\\ \\mathrm{dB}$, occurring at

$$\\omega _{\\mathrm{peak}} = \\omega _{n}\\sqrt{1-1/(2Q^{2})} = 31415.93\\sqrt{0.875} = 29386.9\\ \\mathrm{rad/s}$$

that is, at 4677.1 Hz — slightly **below** $f_{n}$. *Trap*: answering that
the peak is at $f_{n}$ and equal to $Q$, i.e. 6.02 dB at 5 kHz. Both are
close but neither is exact, and the peak always sits below the natural
frequency.

**B5.** From the section 6.3 table, $Q = 0.541196$ and $Q = 1.306563$. Two
sections at 0.7071 would instead give
$H = 1/(s^{2}+\\sqrt{2}s+1)^{2}$, whose magnitude at $\\omega = 1$ is
$1/2$ — that is $-6.02$ dB rather than $-3.01$ dB — and whose passband
droops steadily instead of staying flat. *Trap*: assuming "Butterworth"
means "every section at Q = 0.707". It means the *poles lie on a circle*,
which forces different Q values for every order above two.

**B6.** Bessel: the denominator at $\\omega = 1$ is
$-1+j3+3 = 2+j3$, magnitude $\\sqrt{13} = 3.605551$, so
$\\lvert H\\rvert = 3/3.605551 = 0.832050$, which is $-1.597$ dB; group
delay $(9+3)/(1+3+9) = 12/13 = 0.923077$. Butterworth: the denominator is
$-1+j\\sqrt{2}+1 = j1.414214$, magnitude 1.414214, so
$\\lvert H\\rvert = 0.707107$, which is $-3.010$ dB; group delay
$\\sqrt{2}(1+1)/(1+1) = 1.414214$.

**Read the comparison**: at the same normalised frequency the Butterworth is
1.4 dB further down but holds the signal up 53 % longer, and its delay is
still climbing while the Bessel's is falling gently. *Trap*: assuming the
filter with more attenuation at a given frequency is the "better" one. They
optimise different quantities, and the question of which is better is
answered by what the signal is, not by the magnitude plot.`,
        examTip: 'When a problem gives you a transfer function and asks for a number at a specific frequency, substitute s = jω into the polynomial and take the magnitude. It is almost always faster than recalling which approximation formula applies, it works for every family, and it cannot be defeated by a filter that is not one of the named types.',
        importantNote: 'Every answer above names its distractor because the distractors are systematic, not random: arithmetic mean for geometric mean, ε for ε², nearest-integer for round-up, passband edge for −3 dB point, and one Q value for all sections. Recognising which of those five is being tested identifies the right answer faster than computing it.',
      },
    ],
    keyTakeaways: [
      'LP, HP, BP, BS filter types determined by which frequencies pass through.',
      'Roll-off = −20n dB/decade; higher order n = steeper cutoff but more complexity.',
      'Butterworth: maximally flat passband, no ripple — general-purpose default.',
      'Chebyshev I: equiripple passband, sharper roll-off than Butterworth of same order.',
      'Elliptic: ripple in both bands, sharpest roll-off, minimum order for given specs.',
      'Cutoff frequency ωc defined at −3 dB point where |H| = 1/√2.',
    ],
  },

  fee_dft_fft: {
    topicId: 'fee_dft_fft',
    title: 'DFT, FFT, and Practical Implementation',
    domainWeight: 'Signal Processing · 4–6%',
    overview: 'The Discrete Fourier Transform (DFT) converts a finite sample sequence into frequency components. The Fast Fourier Transform (FFT) computes the DFT efficiently in O(N log N). Windowing and zero-padding are practical techniques for reducing spectral leakage and improving frequency display.',
    sections: [
      {
        id: 'dft-def',
        title: '1. DFT Definition and Frequency Resolution',
        content: `## 1.1 The Discrete Fourier Transform

The **DFT** converts N time-domain samples into N frequency-domain components:

**$X[k] = \\sum _{n=0}^{N-1} x[n]\\, e^{-j2\\pi kn/N}$** for k = 0, 1, ..., N−1

**Inverse DFT:**
**$x[n] = \\frac{1}{N}\\sum _{k=0}^{N-1} X[k]\\, e^{j2\\pi kn/N}$**

### Frequency Bin Interpretation

| Parameter | Formula | Meaning |
|---|---|---|
| **Frequency of bin k** | $f_{k} = k \\cdot f_{s}/N$ | Center frequency of bin k |
| **Frequency resolution** | $\\Delta f = f_{s}/N$ | Smallest distinguishable frequency difference |
| **Bin 0** | $f_{0} = 0$ (dc) | Average value of signal |
| **Bin N/2** | fₛ/2 (Nyquist) | Maximum frequency represented |
| **Bins N/2+1 to N−1** | Negative frequencies | Mirror of bins 1 to N/2−1 for real signals |

### Improving Frequency Resolution

**$\\Delta f = f_{s}/N = 1/(N\\cdot T) = 1/T_{record}$**

To improve resolution (smaller Δf):
- **Increase N** (more samples) — adds actual information
- **Decrease fₛ** — but risk aliasing
- **Longer record time** T_record = N/fₛ — the fundamental limit

## 1.2 The Fast Fourier Transform (FFT)

The **FFT** is an algorithm (not a different transform) that computes the DFT efficiently:

| Method | Operations | For N = 1024 |
|---|---|---|
| Direct DFT | **$O(N^{2})$** | ~1,048,576 |
| FFT (Cooley-Tukey) | **$O(N \\log _{2} N)$** | ~10,240 |

The **radix-2** Cooley-Tukey algorithm requires N to be a **power of 2** (128, 256, 512, 1024, ...). Cooley-Tukey itself factors any composite N, and mixed-radix libraries exploit that; but the radix-2 form is the one drawn, counted and examined, so in practice a non-power-of-2 record is **zero-padded** to the next power of 2. Section 9 derives its cost and section 6 explains what that padding does and does not buy.`,
        examTip: 'For FE exam DFT problems: given N samples at rate fₛ, the frequency resolution is Δf = fₛ/N and the maximum frequency is fₛ/2. If asked to identify which bin a frequency falls in: bin k = round(f/Δf). These three formulas solve most DFT exam problems.',
      },
      {
        id: 'dft-windowing',
        title: '2. Windowing and Spectral Leakage',
        content: `## 2.1 Spectral Leakage

The DFT implicitly assumes the signal **repeats periodically** every N samples. If the signal is not an exact integer number of periods within the N-sample window, discontinuities at the edges create spurious frequency components — this is **spectral leakage**.

### Why It Happens

A finite-length signal is equivalent to multiplying an infinite signal by a rectangular window. In the frequency domain, this multiplication becomes **convolution** with the window's spectrum (a sinc function), smearing energy into adjacent bins.

![Sixty-four-point DFT magnitude of a cosine that completes ten and a half cycles in the record, computed with and without a Hann window and each trace normalized to its own peak. Without a window the tone smears across every bin, from about minus nine decibels at the bins flanking the peak down to a floor near minus twenty-six decibels at the far end of the axis; the Hann window widens the peak slightly but drops the distant skirts below minus sixty decibels.](/courses/fe-ee/figures/sig-leakage-window.svg)

The worst case is drawn deliberately: the tone sits exactly halfway between
bins 10 and 11, so no bin can claim it cleanly. Note what the window does
and does not fix. The Hann trace still spreads across three or four bins
near the peak — the main lobe widened — but twenty bins away the leakage has
fallen by more than forty additional decibels. Windowing is a trade of
nearby resolution for distant cleanliness, never a free repair.

## 2.2 Window Functions

**Windowing** tapers the signal smoothly to zero at the edges, reducing discontinuities:

| Window | Main-Lobe Width | Side-Lobe Level | Use Case |
|---|---|---|---|
| **Rectangular** | Narrowest | −13 dB (worst) | Only when signal is exactly periodic in window |
| **Hann (Hanning)** | Moderate | $-31\\ \\mathrm{dB}$ | General purpose |
| **Hamming** | Moderate | $-43\\ \\mathrm{dB}$ | Speech processing |
| **Blackman** | Widest | $-58\\ \\mathrm{dB}$ | When side-lobe suppression is critical |
| **Kaiser** | Adjustable (β parameter) | Adjustable | Flexible tradeoff |

### Tradeoff

Windows reduce leakage (lower side-lobes) at the cost of **wider main lobe** (worse frequency resolution). No window eliminates leakage completely — it is a fundamental tradeoff.

## 2.3 Zero-Padding

**Zero-padding** appends zeros to the signal before computing the FFT:

- **Does NOT improve true frequency resolution** (no new information)
- **Does improve spectral display** by interpolating between DFT bins
- **Makes N a power of 2** for efficient FFT computation
- Useful for making spectral peaks easier to locate visually`,
        examTip: 'The FE exam may ask about windowing effects. Key facts: (1) rectangular window has the narrowest main lobe but worst leakage, (2) Hamming/Hann reduce leakage but widen the main lobe, (3) zero-padding does NOT add new spectral information — it just interpolates between existing frequency bins.',
        importantNote: 'A common misconception is that zero-padding improves frequency resolution. It does not — true resolution is Δf = fₛ/N where N is the number of actual data samples, not the zero-padded length. Zero-padding only provides a smoother-looking (interpolated) spectrum.',
      },
      {
        id: 'dft-ztransform',
        title: '3. The Z-Transform and Difference Equations',
        content: `## 3.1 Why discrete systems need their own transform

A digital filter is a **difference equation**: each output sample is a
weighted sum of current and past inputs and past outputs. The z-transform
does for these equations exactly what the Laplace transform does for
differential equations — it converts them to algebra:

**$X(z) = \\sum _{n=-\\infty }^{\\infty } x[n]\\, z^{-n}$** (the bilateral form; causal signals start the sum at n = 0)

The variable z plays the role of a unit advance; its reciprocal $z^{-1}$ is a
**one-sample delay**, which is the physical building block of every digital
filter. A block diagram with delay elements *is* a z-domain expression read
directly.

### The pairs the exam draws on

| Sequence x[n] | Transform X(z) | Converges for |
|---|---|---|
| $\\delta [n]$ (unit impulse) | 1 | all z |
| $u[n]$ (unit step) | $z/(z-1)$ | above magnitude 1 |
| $a^{n}\\cdot u[n]$ | $z/(z-a)$ | above magnitude of a |
| $n\\cdot a^{n}\\cdot u[n]$ | $az/(z-a)^{2}$ | above magnitude of a |

### The properties that do the work

| Property | Time domain | z-domain |
|---|---|---|
| Linearity | $a\\cdot x[n] + b\\cdot y[n]$ | $a\\cdot X(z) + b\\cdot Y(z)$ |
| Delay by k | $x[n-k]$ | $z^{-k}\\cdot X(z)$ |
| Convolution | $x[n] * h[n]$ | $X(z)\\cdot H(z)$ |

The delay property is the workhorse: it is how a difference equation becomes
an algebraic one in a single rewrite.

## 3.2 From difference equation to transfer function

Take the first-order recursive filter

**$y[n] = 0.5\\cdot y[n-1] + x[n]$**

Transform both sides, using the delay property on the y[n−1] term:

$$Y(z) = 0.5\\cdot z^{-1}Y(z) + X(z) \\to H(z) = Y(z)/X(z) = \\frac{1}{1 - 0.5z^{-1}} = \\frac{z}{z - 0.5}$$

One **pole at z = 0.5**. Pole locations govern discrete-time behavior the way
s-plane poles govern continuous behavior, with the stability boundary bent
into a circle:

| Pole location | Behavior |
|---|---|
| Inside the unit circle | decaying term — stable |
| On the unit circle | sustained oscillation — marginal |
| Outside the unit circle | growing term — unstable |
| Positive real axis, inside | smooth decay |
| Negative real axis, inside | decay with alternating sign |

## 3.3 Worked example: solving the difference equation completely

**Given**: the filter above, driven by a unit step x[n] = u[n], starting from
rest.

**Handbook relation**: Y(z) = H(z)·X(z), then partial fractions and the pairs
table invert the result.

**Substitution**: with $X(z) = 1/(1 - z^{-1})$,

$$Y(z) = \\frac{1}{(1 - z^{-1})(1 - 0.5z^{-1})} = \\frac{A}{1 - z^{-1}} + \\frac{B}{1 - 0.5z^{-1}}$$

Cover-up method: A = 1/(1 − 0.5) = **2**; B = 1/(1 − 2) = **−1**.

**Answer**: inverting term by term,

$$y[n] = (2 - 0.5^{n})\\cdot u[n]$$

**Check by direct iteration** — always available for small n, and the
fastest way to catch an algebra slip: y[0] = x[0] = 1 and the formula gives
2 − 1 = 1 ✓; y[1] = 0.5(1) + 1 = 1.5 against 2 − 0.5 = 1.5 ✓;
y[2] = 0.5(1.5) + 1 = 1.75 against 2 − 0.25 = 1.75 ✓. The output climbs
toward a final value of 2, which the transfer function predicts directly:
the DC gain is H evaluated at z = 1, giving 1/(1 − 0.5) = 2.

## 3.4 FIR against IIR

| Property | FIR (no feedback) | IIR (feedback) |
|---|---|---|
| Impulse response | finite length | infinite decay |
| Poles | all at z = 0 | anywhere inside unit circle |
| Stability | guaranteed | must be checked |
| Exactly linear phase | achievable | not achievable |
| Order for a sharp cutoff | high | low |

The recursive example above is IIR — one feedback coefficient gives it an
infinitely long (geometric) impulse response. A moving average, by contrast,
is FIR: its impulse response ends.

## 3.5 Frequency response from H(z)

Evaluating H(z) on the unit circle, $z = e^{j\\omega}$, gives the filter's
response at digital frequency ω (radians/sample, with ω = π the Nyquist
frequency). **Worked**: the two-point moving average
$y[n] = 0.5\\cdot (x[n] + x[n-1])$ has $H(z) = 0.5(1 + z^{-1})$, so

$$|H(e^{j\\omega})| = |\\cos (\\omega /2)|$$

At DC: gain 1. At ω = π/2 (a quarter of the sampling rate): cos(π/4) =
**0.707**, the −3 dB point. At Nyquist: cos(π/2) = **0** — a true null,
which is why averaging adjacent samples kills the fastest-alternating
component completely. A **zero at z = −1** is the pole-zero reading of the
same fact.`,
        examTip: 'For any difference equation on the FE exam, the mechanical route is: replace each delay x[n−k] with z^(−k)X(z), solve for Y(z)/X(z), and read stability from the poles. For small n, verify any closed-form answer by iterating the difference equation directly — two or three samples of agreement catch nearly every partial-fraction error.',
        importantNote: 'The unit circle in the z-plane is the exact analogue of the imaginary axis in the s-plane: it is both the stability boundary and the place where frequency response lives. Digital frequency ω runs from 0 (DC, z = 1) to π (Nyquist, z = −1); anything beyond π wraps — aliasing, seen from the z-domain.',
      },
      {
        id: 'dft-dt-convolution',
        title: '4. Discrete-Time Convolution',
        content: `## 4.1 The convolution sum

A discrete LTI system with impulse response h[n] produces

**$y[n] = x[n] * h[n] = \\sum _{k=-\\infty }^{\\infty } x[k]\\, h[n-k]$**

Same structure as the continuous integral — flip, shift, multiply — but the
integral becomes a finite sum, which makes hand evaluation genuinely
practical. Two facts before computing anything:

- If x has length $L_{1}$ and h has length $L_{2}$, the result has length
  **$L_{1} + L_{2} - 1$**. Write the answer slots first.
- The operation is commutative; organize the arithmetic around whichever
  sequence is shorter.

## 4.2 Worked example, two ways

**Given**: x = {1, 2, 3} and h = {1, 1, 1}, both starting at n = 0.
Output length: 3 + 3 − 1 = **5 samples**.

**Method 1 — the sliding sum.** For each n, add the products where the
flipped, shifted h overlaps x:

- y[0] = 1·1 = **1**
- y[1] = 1·1 + 2·1 = **3**
- y[2] = 1·1 + 2·1 + 3·1 = **6**
- y[3] = 2·1 + 3·1 = **5**
- y[4] = 3·1 = **3**

**Method 2 — the table.** Multiply every x[k] by every h[m] and add along
anti-diagonals (constant k + m):

| × | h = 1 | h = 1 | h = 1 |
|---|---|---|---|
| x = 1 | 1 | 1 | 1 |
| x = 2 | 2 | 2 | 2 |
| x = 3 | 3 | 3 | 3 |

Anti-diagonal sums: 1, then 1+2 = 3, then 1+2+3 = 6, then 2+3 = 5, then 3.
Same answer: **y = {1, 3, 6, 5, 3}**.

**Check**: the sum of all output samples must equal (sum of x)·(sum of h) =
6 × 3 = 18, and 1+3+6+5+3 = 18 ✓. This is the discrete version of the
areas-multiply rule and takes five seconds.

The physical reading: h = {1,1,1} is a three-point running sum, so the
output ramps up as the window fills over x, peaks when the window covers all
of x, and ramps down as it slides off.

## 4.3 Circular convolution and the FFT

Multiplying two N-point DFTs and inverting does **not** give the sliding-sum
result above. It gives **circular** convolution — the shifted sequence wraps
around modulo N, because the DFT treats its N samples as one period of a
periodic signal. The wrapped-around products land on top of the early output
samples, corrupting them (time-domain aliasing).

The repair is allocation of space: **zero-pad both sequences to at least
$L_{1} + L_{2} - 1$ points** before transforming. With enough room, nothing
wraps, and circular convolution equals linear convolution exactly. For the
example above, N ≥ 5 — pad both sequences to 8 (the next power of two) and
the FFT route reproduces {1, 3, 6, 5, 3} followed by zeros.

Why bother routing convolution through the FFT at all? Cost. Direct
convolution of two N-point sequences is $O(N^{2})$ multiplications; the
transform route is two FFTs, N complex products, and an inverse FFT —
$O(N \\log_{2} N)$ overall. For a 32-sample filter the direct method wins;
for a 10,000-sample record against a 1,000-tap filter, fast convolution is
the difference between practical and not.

## 4.4 Where each tool applies

| Task | Right tool |
|---|---|
| Output of a short FIR filter, by hand | sliding sum or table |
| Response of a recursive (IIR) filter | z-transform, then invert |
| Long signal through a long FIR filter | FFT fast convolution, zero-padded |
| Steady-state response to one sinusoid | evaluate H at $z = e^{j\\omega}$ |

The four rows are one idea seen at different sizes: convolution in time is
multiplication in the transform domain, and you pick whichever side of that
identity involves less arithmetic for the problem in front of you.`,
        examTip: 'Before computing any discrete convolution, write down the output length L₁ + L₂ − 1 and, after computing, check that the output samples sum to (Σx)·(Σh). These two bracket checks catch dropped terms and misaligned shifts — the two errors that account for nearly all convolution mistakes under time pressure.',
        importantNote: 'DFT multiplication gives CIRCULAR convolution, not linear. Zero-pad both sequences to at least L₁ + L₂ − 1 points before using the FFT to convolve, or the wrap-around will corrupt the first samples of the result. This padding requirement is a favorite conceptual question.',
      },
      {
        id: 'dft-finite-sum',
        title: '5. The DFT as a Finite Sum, and What It Samples',
        content: `## 5.1 The definition, written honestly

Section 1 stated the transform pair. It is worth restating with the twiddle
factor named, because every property in this chapter falls out of that one
symbol:

$$X[k] = \\sum _{n=0}^{N-1} x[n]\\, W_{N}^{kn}, \\qquad W_{N} = e^{-j2\\pi /N}, \\qquad k = 0, 1, \\ldots , N-1$$

$$x[n] = \\frac{1}{N}\\sum _{k=0}^{N-1} X[k]\\, W_{N}^{-kn}$$

Note what is **finite**: the sum runs over exactly N terms, and there are
exactly N outputs. There is no integral, no limit and no infinity anywhere.
The DFT is a square matrix multiplication — N inputs, N outputs, $N^{2}$
products — and the FFT of section 9 is nothing but a way of doing that
multiplication with fewer of them.

The twiddle factor is an Nth root of unity, and three of its properties do
all the work later:

$$W_{N}^{k+N} = W_{N}^{k}, \\qquad W_{N}^{k+N/2} = -W_{N}^{k}, \\qquad W_{N}^{2} = W_{N/2}$$

Periodicity gives the spectrum its wrap-around; the half-period sign flip is
the butterfly's minus sign; and the squaring identity is what lets an
N-point transform be built from two of half the size.

### Worked example 5.1 — a four-point DFT, by the sum and by the machine

**Given**: $x = \\lbrace 1, 2, 3, 4\\rbrace$, so $N = 4$ and
$W_{4} = e^{-j\\pi /2} = -j$.

**Handbook relation**: $X[k] = \\sum _{n} x[n]\\,W_{4}^{kn}$.

**Substitution**, term by term:

$$X[0] = 1+2+3+4 = 10$$

$$X[1] = 1 + 2(-j) + 3(-1) + 4(j) = (1-3) + j(4-2) = -2+j2$$

$$X[2] = 1 + 2(-1) + 3(1) + 4(-1) = -2$$

$$X[3] = 1 + 2(j) + 3(-1) + 4(-j) = -2-j2$$

**Answer**: magnitudes 10, 2.828427, 2, 2.828427; phases 0, 135, 180 and
−135 degrees.

**Checks, three of them.** Running an FFT on the same four samples returns
the identical complex values to within $2\\times 10^{-15}$. The inverse
transform of the result returns 1, 2, 3, 4. And Parseval's relation,

$$\\sum _{n=0}^{N-1}\\lvert x[n]\\rvert ^{2} = \\frac{1}{N}\\sum _{k=0}^{N-1}\\lvert X[k]\\rvert ^{2}$$

gives $1+4+9+16 = 30$ on the left and $(100+8+4+8)/4 = 30$ on the right.
Three independent confirmations of a four-term sum is not overkill when the
same discipline scales to a 4096-point transform you cannot check by eye.

Notice $X[3] = X^{*}[1]$. That mirror is not an accident of these numbers;
section 10 shows it holds for every real input and halves the work.

## 5.2 What the DFT is a sample of

Take the same finite record and ask for its **discrete-time Fourier
transform** — the continuous function of digital frequency:

$$X(e^{j\\omega }) = \\sum _{n=0}^{N-1} x[n]\\, e^{-j\\omega n}$$

Compare it with the DFT definition. They are the same sum, and the DFT is
that continuous function evaluated at N equally spaced points:

$$X[k] = X(e^{j\\omega })\\Big|_{\\omega = 2\\pi k/N}$$

**The DFT sees N samples of a curve that exists at every frequency.** Between
those samples the DTFT does whatever it likes, and the DFT is blind to it.
That single sentence explains zero-padding (section 6), leakage (section 7)
and scalloping loss (section 7.3) — all three are consequences of sampling a
curve rather than seeing it.

![Continuous curve of the discrete-time Fourier transform magnitude of an eight-sample record whose first four samples are one and last four are zero, with the eight discrete Fourier transform bins drawn as stems on top of it. Stems land exactly on the curve, and the bins at indices two, four and six land on the curve's nulls, reading zero where the curve between them rises above one.](/courses/fe-ee/figures/sig3-dft-samples-dtft.svg)

The figure is a four-sample rectangle inside an eight-point record. Three
bins read exactly zero — and yet the DTFT between them climbs above one. A
spectrum analyser showing only those eight numbers would report no energy at
three frequencies where energy plainly exists in the continuous transform.
Nothing is broken; the DFT simply answers the question it was asked.

There is a third reading of the same equations. The inverse DFT writes
$x[n]$ as a sum of N complex exponentials at frequencies $2\\pi k/N$ — which
is precisely a **Fourier series** for a periodic sequence of period N. So
the DFT coefficients, divided by N, are the Fourier series coefficients of
the **periodic extension** of the record: the infinite signal you get by
laying copies of the N samples end to end forever. The DFT does not know
your signal stopped. It assumes it repeated. Section 7 is the bill for that
assumption.

### Worked example 5.2 — frequency to bin, and bin to frequency

**Given**: $f_{s} = 8\\ \\mathrm{kHz}$, $N = 256$.

**Handbook relation**:

$$\\Delta f = \\frac{f_{s}}{N} = \\frac{1}{NT_{s}} = \\frac{1}{T_{\\mathrm{record}}}, \\qquad k = \\frac{fN}{f_{s}}, \\qquad f_{k} = \\frac{k f_{s}}{N}$$

**Substitution**: $\\Delta f = 8000/256 = 31.25\\ \\mathrm{Hz}$, and the record
lasts $T = 256/8000 = 0.032\\ \\mathrm{s} = 32\\ \\mathrm{ms}$. Confirming the
third form, $1/0.032 = 31.25\\ \\mathrm{Hz}$.

**Answer, forward direction** (frequency to bin):

| tone | $k = fN/f_{s}$ | lands where |
|---|---|---|
| 1000 Hz | $1000/31.25 = 32$ | exactly on bin 32 |
| 1250 Hz | $1250/31.25 = 40$ | exactly on bin 40 |
| 3000 Hz | $3000/31.25 = 96$ | exactly on bin 96 |
| 1100 Hz | $1100/31.25 = 35.2$ | between bins 35 and 36 |

**Answer, reverse direction** (bin to frequency):

| bin k | $f_{k} = k f_{s}/N$ | interpretation |
|---|---|---|
| 0 | 0 Hz | the dc term, the record's mean times N |
| 32 | 1000 Hz | the tone above |
| 128 | 4000 Hz | $f_{s}/2$, the folding bin |
| 200 | 6250 Hz | above folding: read it as $(200-256)(31.25) = -1750\\ \\mathrm{Hz}$ |

**Check**: synthesising a 1000 Hz cosine at this rate and transforming it
puts $\\lvert X[32]\\rvert = 128$, exactly $N/2$, with every other bin below
$4\\times 10^{-13}$ — the tone is coherent with the record, which is the
subject of section 7.

**The trap in the last row.** Bin 200 is above $N/2$, so it belongs to the
mirror image. Reporting "6250 Hz" for a real input is wrong: 6250 Hz is
above the folding frequency and cannot be represented. The energy in bin 200
is the same energy as in bin 56, which sits at 1750 Hz.`,
        examTip: 'Three formulas answer nearly every DFT bookkeeping question: Δf = fs/N, k = f·N/fs, and fk = k·fs/N. Write all three down before starting, because questions alternate between the forward and reverse directions and the one you did not write is the one you will be asked for. Bins above N/2 belong to the mirror; subtract N before converting.',
        importantNote: 'The DFT treats its N samples as one period of a periodic signal. That is not an approximation you can improve on with a better algorithm; it is what the transform is. Every leakage, scalloping and windowing effect in this chapter follows from it.',
      },
      {
        id: 'dft-resolution',
        title: '6. Resolution Against Zero-Padding, on One Signal',
        content: `## 6.1 What resolution is bought with

$$\\Delta f = \\frac{f_{s}}{N} = \\frac{1}{T_{\\mathrm{record}}}$$

Written the second way, the statement is stark: **frequency resolution is the
reciprocal of how long you observed.** Nothing else enters. A faster sample
rate raises the top of the band but, at fixed N, makes the resolution worse.
A slower rate improves it, right up until aliasing ruins the record. The only
clean route to finer resolution is a longer observation.

Two tones separated by $\\delta f$ therefore need a record of at least
$T \\approx 1/\\delta f$ to be distinguished — and "at least" is doing real
work, as the measurements below show.

## 6.2 The demonstration

One signal, used three ways: two equal cosines at 200 Hz and 210 Hz sampled
at 1000 Hz, so the separation is 10 Hz.

### Worked example 6.1 — the same 64 samples, transformed three ways

**Given**: 64 samples at $f_{s} = 1000\\ \\mathrm{Hz}$, containing 200 Hz and
210 Hz at equal amplitude.

**Handbook relation**: $\\Delta f = f_{s}/N$ for the true resolution;
$f_{s}/N_{\\mathrm{FFT}}$ for the spacing of the displayed points.

**Substitution and answer**:

| transform | true $\\Delta f$ | displayed spacing | maxima found between 165 and 245 Hz |
|---|---|---|---|
| 64-point FFT of 64 samples | 15.625 Hz | 15.625 Hz | one, at 203.125 Hz |
| 512-point FFT of the SAME 64 samples | 15.625 Hz | 1.9531 Hz | one main lobe at 201.17 Hz, plus side lobes 11.84 and 11.18 dB below it |
| 256-point FFT of 256 samples | 3.90625 Hz | 3.90625 Hz | **two**, at 199.22 Hz and 210.94 Hz |

**Read the middle row carefully.** Zero-padding turned eight sparse points
into a smooth curve, and the curve has three local maxima — but the two
outer ones are more than eleven decibels down and are the skirt of the
rectangular window, not tones. The padded transform contains **exactly the
information the 64 samples contained**, interpolated. It cannot manufacture
a second peak because there was never a second peak to find.

The bottom row separates the tones because the record is four times longer,
so $\\Delta f$ is four times smaller and the 10 Hz gap spans 2.56 bins
instead of 0.64.

![Three stacked panels sharing a frequency axis from 140 to 280 hertz. The top panel is a stem plot of sixty-four samples with one lobe near 203 hertz; the middle is a smooth interpolated curve from the same sixty-four samples padded to five hundred and twelve points, still with a single main lobe; the bottom is a stem plot of two hundred and fifty-six samples showing two clearly separate lobes with arrows marking them.](/courses/fe-ee/figures/sig3-resolution-zeropad.svg)

### Worked example 6.2 — how long a record does the pair need?

**Given**: tones 10 Hz apart, $f_{s} = 1000\\ \\mathrm{Hz}$, rectangular
window.

**Handbook relation**: the separation in bins is
$\\delta f/\\Delta f = \\delta f\\, N/f_{s}$; two lobes are resolved when that
number is comfortably above one.

**Substitution**, measuring the actual transforms rather than trusting the
rule:

| N | $\\Delta f$ | separation in bins | maxima observed |
|---|---|---|---|
| 64 | 15.6250 Hz | 0.64 | one |
| 128 | 7.8125 Hz | 1.28 | one |
| 160 | 6.2500 Hz | 1.60 | two |
| 192 | 5.2083 Hz | 1.92 | two |
| 256 | 3.9062 Hz | 2.56 | two |

**Answer**: the pair separates somewhere between 1.28 and 1.60 bins of
separation — that is, a record of about 160 ms rather than the 100 ms that
"$\\delta f = \\Delta f$" would suggest. **One bin of separation is
marginal.** The rectangular window's main lobe is two bins wide null to
null, so two tones a single bin apart have overlapping main lobes and merge
into one broader lobe whose peak sits between them, which is exactly what
the 128-sample row shows.

**The distractor**: answering 100 ms, from $T = 1/\\delta f$. That is the
right order of magnitude and the standard textbook rule, and it is optimistic
by roughly half. Whether it counts as wrong depends on the question; what is
never right is claiming that padding the 100 ms record to 1000 points would
help.

## 6.3 What zero-padding is genuinely for

| Purpose | Does padding help? | Why |
|---|---|---|
| Separating two close tones | **No** | resolution is set by record length alone |
| Reading a single peak's frequency more precisely | **Yes** | interpolation locates the lobe's summit between bins |
| Reducing scalloping loss in an amplitude reading | **Yes** | a denser grid lands nearer the true peak |
| Reaching a power-of-two length for a radix-2 FFT | **Yes** | this is the routine housekeeping use |
| Making linear convolution out of circular | **Yes** | section 4.3 — a different mechanism entirely |
| Lowering the noise floor of the spectrum | No | padding adds no data, so it adds no averaging |

The second and third rows are why padding is not merely harmless. A tone
that falls midway between bins reads up to 3.92 dB low on an unpadded
rectangular-window transform (section 7.3 derives that number); padding by a
factor of four cuts the worst case to about 0.22 dB, because the densest
grid point is now at worst an eighth of a bin from the true peak. Padding
improves your **reading** of a lobe. It never adds a lobe.`,
        examTip: 'If a question asks how to distinguish two frequencies that are close together, the answer is always "observe for longer" — more samples at the same rate. If it asks how to make a peak easier to locate or to plot smoothly, the answer is zero-padding. Sorting the question into those two boxes first makes the answer immediate.',
        importantNote: 'The rule "resolution equals fs/N" describes the bin spacing, not a guarantee of resolvability. Measured on real transforms, two equal tones one bin apart merge into a single lobe; about 1.5 bins of separation is where they reliably split with a rectangular window, and more with any tapered window because tapering widens the main lobe.',
      },
      {
        id: 'dft-leakage-derived',
        title: '7. Leakage Derived from the Periodic Extension',
        content: `## 7.1 The rectangular window and its transform

Observing N samples of an infinite signal is multiplication by a rectangular
window. Multiplication in time is convolution in frequency, so the spectrum
you obtain is the true spectrum convolved with the window's transform:

$$W_{R}(\\theta ) = \\sum _{n=0}^{N-1} e^{-jn\\theta } = e^{-j(N-1)\\theta /2}\\,\\frac{\\sin (N\\theta /2)}{\\sin (\\theta /2)}$$

That ratio of sines is the **Dirichlet kernel**. Measured in bins of offset
$d$ from a tone and normalised to its own peak, it is

$$\\lvert D(d)\\rvert = \\left\\lvert \\frac{\\sin (\\pi d)}{N\\sin (\\pi d/N)}\\right\\rvert$$

The numerator vanishes at every integer $d$. **That is the whole mechanism.**
If a tone sits exactly on a bin centre, every other bin sits at an integer
offset, lands on a zero of the kernel, and reads zero. If the tone sits
anywhere else, no bin lands on a zero and every bin reads something.

## 7.2 Coherent and incoherent, measured

A tone is **coherently sampled** when the record holds a whole number of its
cycles:

$$\\frac{f_{0}N}{f_{s}} = k, \\quad k \\ \\text{an integer} \\qquad \\Longleftrightarrow \\qquad f_{0} = \\frac{k f_{s}}{N}$$

Those two conditions say one thing twice over: whole cycles inside the
record, and the tone landing dead on a bin centre. When it holds, the periodic extension
splices together seamlessly and there is no discontinuity to create
spurious frequencies. When it fails, the extension has a step at every
record boundary, and a step has energy everywhere.

### Worked example 7.1 — the same record, half a cycle apart

**Given**: $N = 64$, $f_{s} = 1000\\ \\mathrm{Hz}$; a unit cosine at exactly
10 cycles per record, then at 10.5 cycles.

**Handbook relation**: $f_{0} = k f_{s}/N$ for the coherent case.

**Substitution**: 10 cycles corresponds to
$10(1000)/64 = 156.25\\ \\mathrm{Hz}$; 10.5 cycles to
$10.5(1000)/64 = 164.0625\\ \\mathrm{Hz}$. The two frequencies differ by
7.8125 Hz — exactly five percent.

**Answer**, from the transforms themselves:

| quantity | 10 cycles (coherent) | 10.5 cycles (incoherent) |
|---|---|---|
| tallest bin | 10 | 11 |
| peak magnitude | 32.000000, exactly $N/2$ | 20.675186 |
| largest other bin | $2.1\\times 10^{-14}$, numerical zero | 20.076, only 0.26 dB below the peak |
| energy outside the tallest bin | 0.0000 % | **58.26 %** |
| peak error | none | 3.794 dB low |

**Nearly six tenths of the energy left the peak bin** because the record was
half a cycle long in the wrong direction. Two adjacent bins now claim the
tone almost equally, so neither reads the right amplitude and neither reads
the right frequency.

![Two interleaved bar spectra over the first thirty-two bins of a sixty-four point transform, both normalised to the coherent peak. The coherent trace has exactly one bar, at bin ten. The incoherent trace has a bar in every bin, the tallest pair nearly four decibels below the coherent peak and the rest forming a slowly falling skirt down to about minus thirty decibels.](/courses/fe-ee/figures/sig3-coherent-leak.svg)

## 7.3 Scalloping loss, in closed form

The worst case is a tone exactly halfway between two bins, $d = 0.5$ from
each. The kernel there gives

$$\\lvert D(0.5)\\rvert = \\frac{\\sin (\\pi /2)}{N\\sin \\bigl(\\pi /(2N)\\bigr)} = \\frac{1}{N\\sin \\bigl(\\pi /(2N)\\bigr)} \\ \\longrightarrow \\ \\frac{2}{\\pi } = 0.636620$$

as N grows, because $N\\sin (\\pi /(2N)) \\to \\pi /2$. In decibels the
resulting **scalloping loss** is

$$L = -20\\log _{10}(2/\\pi ) = 3.9224\\ \\mathrm{dB}$$

and it converges quickly: 3.9084 dB at $N = 16$, 3.9215 dB at $N = 64$,
3.9223 dB at $N = 256$. The measured 3.794 dB in the table above is slightly
smaller only because a real cosine also carries a mirror image at the far end
of the axis, whose skirt adds a little energy back into the peak bin.

The rest of the kernel, tabulated in bins of offset:

| offset $d$ (bins) | $\\lvert D\\rvert$ | in decibels |
|---|---|---|
| 0.0 | 1.000000 | 0.00 |
| 0.5 | 0.636684 | −3.92 |
| 1.0 | 0 | null |
| 1.5 | 0.212398 | −13.46 |
| 2.5 | 0.127644 | −17.88 |
| 3.5 | 0.091395 | −20.78 |

The first side lobe at −13.26 dB (its true peak, slightly off the half-bin
points tabulated) is the rectangular window's headline figure, and it is
appalling: a tone 13 dB below another one, six bins away, is invisible.
Section 8 exists to fix that.

### Worked example 7.2 — choosing a coherent record

**Given**: a 1100 Hz tone to be measured at $f_{s} = 8\\ \\mathrm{kHz}$.

**Handbook relation**: coherence requires $f_{0}N/f_{s}$ to be a whole
number.

**Substitution**: with $N = 64$, $1100(64)/8000 = 8.8$ cycles — not a whole
number, so leakage is guaranteed. The nearest bin, bin 9, sits at
$9(8000)/64 = 1125\\ \\mathrm{Hz}$.

**Answer**: the smallest record that makes 1100 Hz coherent at this rate is
$N = 80$, holding exactly 11 cycles in 10.0 ms. Checking: $1100(80)/8000 = 11$.

**But 80 is not a power of two.** This is the practical bind: coherent
sampling and radix-2 lengths pull in opposite directions, and only when the
test frequency can be chosen freely can both be had. In a laboratory you
choose $f_{0} = k f_{s}/N$ with N a power of two and pick k prime to N; in
the field, where the signal chooses its own frequency, you cannot, and you
window instead.

**The distractor**: rounding 8.8 to 9 and reporting the tone as 1125 Hz. The
tone is at 1100 Hz; bin 9 is merely where most of its energy landed. The DFT
never reports frequencies between bin centres, and mistaking the bin for the
tone is a systematic error of up to half a bin — here 62.5 Hz.`,
        examTip: 'Leakage questions reduce to one test: does the record contain a whole number of cycles? Compute f·N/fs. Integer means no leakage at all and the peak reads the exact amplitude; anything else means leakage in every bin and a peak reading up to 3.92 dB low. That single division answers most of them.',
        importantNote: 'Scalloping loss and leakage are the same phenomenon seen at the peak and away from it. A tone between bins loses up to 3.92 dB from its tallest bin, and that missing energy is exactly what appears smeared across the others. Nothing is destroyed; it is redistributed.',
      },
      {
        id: 'dft-windows',
        title: '8. Windows: Main Lobe Traded Against Side Lobes',
        content: `## 8.1 The four standard windows

Each is a raised cosine of one or two terms, defined over
$n = 0, 1, \\ldots , N-1$ in the periodic (DFT-even) form used for spectral
analysis:

$$w_{\\mathrm{rect}}[n] = 1$$

$$w_{\\mathrm{Hann}}[n] = 0.5 - 0.5\\cos\\left(\\frac{2\\pi n}{N}\\right)$$

$$w_{\\mathrm{Hamming}}[n] = 0.54 - 0.46\\cos\\left(\\frac{2\\pi n}{N}\\right)$$

$$w_{\\mathrm{Blackman}}[n] = 0.42 - 0.5\\cos\\left(\\frac{2\\pi n}{N}\\right) + 0.08\\cos\\left(\\frac{4\\pi n}{N}\\right)$$

Two figures of merit follow directly from the coefficients. The **coherent
gain** is the window's mean, which is the leading constant:

$$\\mathrm{CG} = \\frac{1}{N}\\sum _{n=0}^{N-1}w[n] = 1.00,\\ 0.50,\\ 0.54,\\ 0.42 \\ \\text{respectively}$$

and the **equivalent noise bandwidth**, the width in bins of an ideal filter
passing the same noise power, is

$$\\mathrm{ENBW} = \\frac{N\\sum _{n} w^{2}[n]}{\\left(\\sum _{n} w[n]\\right)^{2}}$$

![Four small panels showing the rectangular, Hann, Hamming and Blackman windows as sequences over sixty-four samples, each shaded beneath the curve and annotated with its mean value. The rectangular window is flat at one; Hann and Blackman fall to zero at both ends; Hamming stops at zero point zero eight.](/courses/fe-ee/figures/sig3-window-shapes.svg)

The Hamming window's refusal to reach zero is the visible clue to its
character. That small pedestal is what cancels the first side lobe so
effectively — and it is also why its side lobes stop falling further out,
as the measurements below show.

## 8.2 The measured table

Every number in this table was obtained by transforming a 1024-point window
on a $2^{20}$-point grid and reading the result — not quoted from a
reference:

| window | coherent gain | ENBW (bins) | −3 dB width (bins) | main lobe null to null | peak side lobe | scalloping loss |
|---|---|---|---|---|---|---|
| Rectangular | 1.0000 | 1.0000 | 0.8867 | 2 bins | −13.26 dB | 3.92 dB |
| Hann | 0.5000 | 1.5000 | 1.4414 | 4 bins | −31.47 dB | 1.42 dB |
| Hamming | 0.5400 | 1.3628 | 1.3047 | 4 bins | −42.67 dB | 1.75 dB |
| Blackman | 0.4200 | 1.7268 | 1.6445 | 6 bins | −58.11 dB | 1.10 dB |

The trade is visible along the rows: main-lobe width 2, 4, 4, 6 bins against
side lobes −13, −31, −43, −58 dB. **You buy stopband cleanliness with
resolution, in that order.** The ENBW column cross-checks against closed
forms — 1.5 exactly for Hann, and
$(0.54^{2}+0.46^{2}/2)/0.54^{2} = 1.362826$ for Hamming — which the
measurement reproduces.

![Four small panels of window spectra in decibels against bins from the main lobe centre, each normalised to its own peak with a dashed line at its highest side lobe. The rectangular panel's side lobes start near minus thirteen decibels and barely descend; the Hann and Blackman panels start much lower and fall steeply; the Hamming panel starts lowest of the four-term windows but stays nearly level across the plot.](/courses/fe-ee/figures/sig3-window-spectra.svg)

## 8.3 Why the peak side lobe is not the whole story

Reading only the "peak side lobe" column would rank Hamming above Hann by
11 dB. Measuring the side-lobe envelope further out tells a different story:

| window | 4 bins out | 8 bins out | 16 bins | 32 bins | 64 bins | slope |
|---|---|---|---|---|---|---|
| Rectangular | −20.8 dB | −27.4 dB | −33.8 dB | −39.9 dB | −45.9 dB | −6.2 dB/octave |
| Hann | −41.9 dB | −62.3 dB | −81.3 dB | −99.8 dB | −118.1 dB | −18.6 dB/octave |
| Hamming | −42.7 dB | −45.0 dB | −50.5 dB | −56.5 dB | −62.5 dB | −5.9 dB/octave |
| Blackman | −58.1 dB | −70.6 dB | −88.9 dB | −107.2 dB | −125.5 dB | −18.3 dB/octave |

Sixteen bins from the lobe centre, **Hann is 30 dB cleaner than Hamming**
despite having a first side lobe 11 dB worse. The reason is in the
coefficients: Hann's 0.5 and 0.5 make the window and its first derivative
both vanish at the record ends, so its spectrum falls at 18 dB per octave;
Hamming's pedestal leaves a step at the ends, and a step falls at only
6 dB per octave, the same rate as the rectangular window it was supposed to
improve on.

### Worked example 8.1 — which window finds the weak tone?

**Given**: $N = 512$; a strong tone at bin 64.5 and a second tone 60 dB
weaker at bin 76.5 — twelve bins away, and neither on a bin centre.

**Handbook relation**: the weak tone is visible only if the strong tone's
leakage at bin 76 is below −60 dB.

**Substitution and answer**, measuring the strong tone's own leakage at that
bin:

| window | strong tone's leakage at bin 76 | weak tone at −60 dB is |
|---|---|---|
| Rectangular | −26.7 dB | buried, by 33 dB |
| Hamming | −45.8 dB | buried, by 14 dB |
| Hann | −72.1 dB | **visible, 12 dB above the floor** |
| Blackman | −80.1 dB | **visible, 20 dB above the floor** |

**Answer**: Hann or Blackman. Hamming fails despite its excellent first side
lobe, exactly as section 8.3 predicts — twelve bins out is far enough for
the roll-off rate, not the first side lobe, to decide.

**The distractor**: choosing Hamming from the "peak side lobe" column alone.
It is the best of the four by that single number and the second worst by the
number that mattered here.

## 8.4 Windows cost amplitude, and you must give it back

A window with coherent gain CG scales every amplitude by CG. Recovering the
amplitude of a real sinusoid from its peak bin therefore takes

$$A = \\frac{2\\,\\lvert X[k]\\rvert }{N\\cdot \\mathrm{CG}}$$

The factor of two is the usual one for a real cosine, whose energy splits
between the positive and negative frequency bins.

### Worked example 8.2 — amplitude recovery, windowed and not

**Given**: a 3 V cosine, $N = 256$, coherent at bin 20, transformed with and
without a Hann window.

**Handbook relation**: the equation above, with CG = 1 for rectangular and
0.5 for Hann.

**Substitution**: the predicted peak with the Hann window is

$$\\lvert X[20]\\rvert = \\frac{A\\,N\\,\\mathrm{CG}}{2} = \\frac{(3)(256)(0.5)}{2} = 192$$

**Answer**: the measured peak is exactly 192.000000, and

$$A = \\frac{2(192)}{(256)(0.5)} = 3.00000000\\ \\mathrm{V}$$

Without the window the peak is 384.000000 and
$A = 2(384)/256 = 3.00000000\\ \\mathrm{V}$ — the same answer by the same
route with CG = 1.

**The check that reveals the mechanism**: the bins on either side of the
Hann peak read 96.000000 each, exactly half the peak. A Hann-windowed
coherent tone always spreads over exactly three bins in the ratio 1 : 2 : 1,
because the window is a three-term expression in the frequency domain. Add
the three: $96+192+96 = 384$, the rectangular peak. **The window moved the
energy; it did not remove it.**

**The distractor**: reporting 1.5 V, from forgetting the coherent-gain
correction and dividing by N/2 alone. A Hann window halves every amplitude
reading, and half of 3 is exactly the wrong answer a spectrum analyser gives
when its window correction is switched off.

### Worked example 8.3 — choosing a window in practice

**Given**: four measurement tasks.

**Answer**, with the reasoning that decides each:

| task | window | why |
|---|---|---|
| Coherently sampled test tone, exact amplitude wanted | Rectangular | no leakage exists to suppress, and CG = 1 keeps the amplitude exact |
| General signal of unknown frequency, amplitude wanted | Hann or flat-top | scalloping loss falls from 3.92 dB to 1.42 dB |
| Two tones of similar level, close together | Rectangular or Hann | narrow main lobe matters more than the skirt |
| Weak tone beside a strong one, far apart | Blackman | −58 dB first side lobe and −18 dB/octave beyond it |

The first and last rows are opposite extremes of the same trade, and the
rule that generates all four is: **wide dynamic range needs a tapered
window; fine frequency separation needs a narrow one; you cannot have both
from one record.**`,
        examTip: 'Memorise the ordering, not the decimals: rectangular has the narrowest main lobe (2 bins) and the worst side lobes (−13 dB); Blackman has the widest (6 bins) and the best (−58 dB); Hann and Hamming sit between with 4-bin lobes. Any question asking which window to use is asking whether the problem is resolution or dynamic range.',
        importantNote: 'Every window except the rectangular one scales amplitudes by its coherent gain — 0.5 for Hann, 0.54 for Hamming, 0.42 for Blackman. An amplitude read off a windowed spectrum without dividing by CG is low by that factor, and for Hann that is a full factor of two, or 6 dB.',
      },
      {
        id: 'dft-radix2',
        title: '9. The Radix-2 FFT: Butterfly, Count, Bit Reversal',
        content: `## 9.1 Splitting the sum

Take the DFT sum and separate the even-indexed from the odd-indexed samples.
With $N$ even, write $n = 2r$ and $n = 2r+1$:

$$X[k] = \\sum _{r=0}^{N/2-1}x[2r]\\,W_{N}^{2rk} + \\sum _{r=0}^{N/2-1}x[2r+1]\\,W_{N}^{(2r+1)k}$$

Now use $W_{N}^{2} = W_{N/2}$ on both sums and pull the leftover factor out of
the second:

$$X[k] = \\underbrace{\\sum _{r=0}^{N/2-1}x[2r]\\,W_{N/2}^{rk}}_{E[k]} + W_{N}^{k}\\underbrace{\\sum _{r=0}^{N/2-1}x[2r+1]\\,W_{N/2}^{rk}}_{O[k]}$$

Both braces are **N/2-point DFTs**. That is the entire idea: one transform of
length N has become two of length N/2 plus a handful of multiplications.

The second half of the output costs nothing extra. $E$ and $O$ have period
$N/2$ in $k$, and $W_{N}^{k+N/2} = -W_{N}^{k}$, so

$$X[k] = E[k] + W_{N}^{k}O[k], \\qquad X[k+N/2] = E[k] - W_{N}^{k}O[k] \\qquad (k = 0, \\ldots , N/2-1)$$

Those two lines **are** the butterfly: one complex multiplication
($W_{N}^{k}O[k]$), one addition and one subtraction, producing two outputs.
The multiplier $W_{N}^{k}$ is called the twiddle factor of the butterfly, and
the sign flip in the second line is the crossing that gives the diagram its
name.

## 9.2 Counting, not assuming

Let $M(N)$ be the complex multiplications. Each stage of the recursion does
$N/2$ butterflies, one multiplication each, and calls itself twice on half
the data:

$$M(N) = 2M(N/2) + \\frac{N}{2}, \\qquad M(1) = 0$$

Unrolling: there are $\\log _{2}N$ levels of recursion and every level costs
$N/2$ in total, so

$$M(N) = \\frac{N}{2}\\log _{2}N$$

The additions follow the same argument with two per butterfly:

$$A(N) = 2A(N/2) + N \\qquad \\Longrightarrow \\qquad A(N) = N\\log _{2}N$$

against $N^{2}$ multiplications and $N(N-1)$ additions for the direct sum.
The speed-up ratio is worth carrying:

$$\\frac{N^{2}}{(N/2)\\log _{2}N} = \\frac{2N}{\\log _{2}N}$$

### Worked example 9.1 — the count, verified by running the algorithm

**Given**: a recursive radix-2 transform with a counter in its inner loop,
run on random complex data and checked against a library FFT.

**Handbook relation**: the two recursions above.

**Answer**:

| N | stages $\\log _{2}N$ | butterflies counted | $(N/2)\\log _{2}N$ | adds counted | direct-sum mults $N^{2}$ | speed-up |
|---|---|---|---|---|---|---|
| 8 | 3 | 12 | 12 | 24 | 64 | 5.33 |
| 16 | 4 | 32 | 32 | 64 | 256 | 8.00 |
| 64 | 6 | 192 | 192 | 384 | 4096 | 21.33 |
| 1024 | 10 | 5120 | 5120 | 10240 | 1048576 | 204.80 |

Every counted figure equals the formula, and every output matched the library
transform to better than $10^{-13}$. Checking the last row against the ratio
formula: $2N/\\log _{2}N = 2048/10 = 204.8$.

**The number to remember** is the last row. A 1024-point transform costs
about five thousand complex multiplications instead of about a million. That
factor of two hundred is why real-time spectral analysis exists at all, and
it grows: at $N = 2^{20}$ the ratio is $2097152/20 = 104857.6$.

![Log-log plot of complex multiplications against transform length from eight to one thousand and twenty-four, with one line for the direct sum's N squared and one for the butterflies actually counted by running a recursive radix-2 transform. The lines diverge steadily, reaching a factor of two hundred at one thousand and twenty-four points.](/courses/fe-ee/figures/sig3-fft-cost.svg)

## 9.3 Bit-reversed ordering

Splitting into even and odd, then splitting each of those into even and odd,
sorts the inputs by their **least** significant bit first, then the next, and
so on. Doing that $\\log _{2}N$ times leaves each sample at the address whose
bits are the reverse of its original address.

### Worked example 9.2 — the permutation for eight and sixteen points

**Given**: $N = 8$, so addresses are three bits.

**Handbook relation**: reverse the bits of the index.

**Substitution**:

| index | binary | reversed | new position |
|---|---|---|---|
| 0 | 000 | 000 | 0 |
| 1 | 001 | 100 | 4 |
| 2 | 010 | 010 | 2 |
| 3 | 011 | 110 | 6 |
| 4 | 100 | 001 | 1 |
| 5 | 101 | 101 | 5 |
| 6 | 110 | 011 | 3 |
| 7 | 111 | 111 | 7 |

**Answer**: the input order is 0, 4, 2, 6, 1, 5, 3, 7. For $N = 16$ the same
rule gives 0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15.

**Check**: reversing twice returns the original, so the permutation is its
own inverse — which is why the same routine can be used before a forward
transform or after an inverse one. Indices whose binary form is a palindrome
(0, 2, 5, 7 at $N = 8$) do not move at all.

![Eight-point decimation-in-time signal flow graph with four columns of eight nodes, straight lines carrying each node forward and crossing lines joining the butterfly partners in each of three stages. Inputs on the left are labelled in bit-reversed order and outputs on the right in natural order, with a note that three stages of four butterflies make twelve.](/courses/fe-ee/figures/sig3-butterfly.svg)

Trace one butterfly in the figure and the pattern is clear: in stage 1 the
partners are one apart, in stage 2 two apart, in stage 3 four apart. Each
stage doubles the span, and after $\\log _{2}N$ stages every input has
influenced every output. **Decimation in time** takes bit-reversed inputs and
produces natural-order outputs, as drawn; **decimation in frequency**
reverses that, taking natural inputs and producing bit-reversed outputs.
Both cost the same.

## 9.4 What "in place" buys

Each butterfly reads two values and writes two values to the same two
addresses. So the whole transform runs in the array it started in — no
second buffer of length N is needed, only the bit-reversal shuffle at one
end. For an embedded processor transforming 4096 complex samples, that is
the difference between 64 kilobytes of working memory and 32.`,
        examTip: 'The three FFT numbers worth memorising are (N/2)·log2 N complex multiplications, N·log2 N complex additions, and log2 N stages. Everything else — speed-up ratios, per-stage counts, memory — is arithmetic on those three. And note that N log2 N is the ADDITION count; quoting it as the multiplication count doubles the true figure.',
        importantNote: 'The FFT computes the same DFT, to the same accuracy — it is an algorithm, not a different transform. In fact its accuracy is BETTER than the direct sum for large N, because each output accumulates log2 N rounding errors instead of N of them.',
      },
      {
        id: 'dft-practical',
        title: '10. Scaling Conventions and the Real-Input Symmetry',
        content: `## 10.1 Where the 1/N goes

The transform pair in section 5.1 puts $1/N$ on the inverse. That is the most
common convention and the one every FE reference uses, but it is not the only
one, and a spectrum whose amplitudes are off by a factor of N or
$\\sqrt{N}$ is almost always a convention mismatch rather than a bug.

| convention | forward | inverse | consequence |
|---|---|---|---|
| Engineering standard | no factor | $1/N$ | $X[0]$ is the **sum** of the samples |
| Normalised forward | $1/N$ | no factor | $X[0]$ is the **mean** of the samples |
| Symmetric | $1/\\sqrt{N}$ | $1/\\sqrt{N}$ | Parseval holds without any factor |

With the engineering convention, three readings follow at once:

$$X[0] = \\sum _{n=0}^{N-1}x[n], \\qquad \\bar{x} = \\frac{X[0]}{N}, \\qquad \\sum _{n}\\lvert x[n]\\rvert ^{2} = \\frac{1}{N}\\sum _{k}\\lvert X[k]\\rvert ^{2}$$

and for a real sinusoid of amplitude A, coherently sampled, the peak bin
holds $AN/2$ before any window correction — the factor of two that worked
example 8.2 used.

### Worked example 10.1 — reading a spectrum correctly

**Given**: a 256-point rectangular-window transform of a real signal;
$X[0] = 512$ and the tallest other bin, $k = 20$, has magnitude 384.

**Handbook relation**: mean $= X[0]/N$; sinusoid amplitude
$= 2\\lvert X[k]\\rvert /N$; frequency $= k f_{s}/N$.

**Substitution and answer**:

- dc component: $512/256 = 2.0$ — the signal sits on a 2 V offset.
- tone amplitude: $2(384)/256 = 3.0\\ \\mathrm{V}$.
- if $f_{s} = 1024\\ \\mathrm{Hz}$, the tone is at
  $20(1024)/256 = 80\\ \\mathrm{Hz}$.

**The distractor**: reporting the dc component as 512 and the tone amplitude
as 384. Those are raw bin magnitudes, which scale with N; a 512-point
transform of the same signal would print 1024 and 768 for the same 2 V
offset and 3 V tone. **Bin magnitudes are not volts until they are divided
by N.**

Note also that dc and the folding bin do **not** get the factor of two —
they have no mirror partner to share energy with. Applying the factor of two
to $X[0]$ is a classic doubling of the dc reading.

## 10.2 Real inputs give half the spectrum away

If every $x[n]$ is real, then conjugating the defining sum and re-indexing
gives

$$X[N-k] = X^{*}[k] \\qquad (k = 1, 2, \\ldots , N-1)$$

Magnitude is therefore **even** about $k = N/2$ and phase is **odd**. Only

$$\\frac{N}{2}+1 \\ \\text{bins are independent}$$

running from dc to the folding bin inclusive. Both endpoints, $X[0]$ and
$X[N/2]$, are purely real — they are their own conjugates.

![Two stacked stem plots of the thirty-two point transform of a real sequence. The upper panel shows magnitude, with the bins up to sixteen in one colour and the mirrored bins beyond it in another; the lower panel shows phase, where the mirrored bins point the opposite way. A dashed line marks the folding bin at sixteen.](/courses/fe-ee/figures/sig3-hermitian.svg)

### Worked example 10.2 — the symmetry, and the work it saves

**Given**: a 16-point transform of a real random sequence.

**Handbook relation**: the conjugate symmetry above.

**Check**: computing $\\lvert X[N-k]-X^{*}[k]\\rvert$ for every k returns 0 to
machine precision, and both $X[0]$ and $X[8]$ have zero imaginary part.
Independent bins: $16/2+1 = 9$.

**And the saving.** Two real sequences can share one complex transform. Form
$z[n] = x[n]+jy[n]$, transform once, then separate:

$$X[k] = \\frac{Z[k]+Z^{*}[N-k]}{2}, \\qquad Y[k] = \\frac{Z[k]-Z^{*}[N-k]}{2j}$$

**Answer**: verified numerically, both reconstructions match the individually
computed transforms to better than $10^{-15}$. For $N = 1024$ that is 5120
complex multiplications for two spectra instead of 10240 — **half the work**,
from symmetry alone. A dedicated real-input FFT applies the same idea one
level deeper, packing an N-point real transform into an N/2-point complex one
plus a cheap recombination pass.

## 10.3 Averaging and the noise floor

A single transform of a noisy signal has a noise floor that fluctuates by
several decibels bin to bin, because each bin is one sample of a random
variable. Averaging the **magnitude-squared** spectra of M independent
records reduces the variance by a factor of M without changing resolution:

$$\\bar{S}[k] = \\frac{1}{M}\\sum _{m=1}^{M}\\lvert X_{m}[k]\\rvert ^{2}$$

This is why a spectrum analyser's floor smooths out as it dwells. Two
warnings come with it. Averaging **magnitudes** is not the same as averaging
**powers** and biases the result low. And averaging complex spectra instead
of magnitudes cancels the noise only if the records are phase-coherent — the
right technique when a trigger is available, and a way to erase the signal
when it is not.

For converting an averaged spectrum into a noise **density**, the window's
ENBW from section 8.2 is the divisor:

$$\\text{noise density} = \\frac{\\text{power per bin}}{\\mathrm{ENBW}\\cdot \\Delta f}$$

so a Hann window's 1.5-bin ENBW means each bin collects half again as much
noise as its spacing suggests.

## 10.4 A checklist for any real measurement

| Step | Question | Section |
|---|---|---|
| 1 | Is the sample rate above twice the highest real frequency present? | prerequisite |
| 2 | What is $\\Delta f = f_{s}/N$, and does the record separate what must be separated? | 6.1 |
| 3 | Is the tone coherent, or is a window needed? | 7.2 |
| 4 | Which window, given resolution against dynamic range? | 8.4 |
| 5 | Divide by N, by the coherent gain, and by two for real sinusoids | 10.1 |
| 6 | Are the bins above N/2 being double-counted? | 10.2 |

Steps 5 and 6 are where correct spectra become wrong numbers, and they are
pure bookkeeping.`,
        examTip: 'Bin magnitudes scale with N, so they are never the answer to "what is the amplitude". Divide by N, multiply by two for a real sinusoid away from dc, and divide by the coherent gain if a window was used. Do NOT apply the factor of two at dc or at the folding bin — they have no mirror partner.',
        importantNote: 'For a real input only N/2 + 1 bins carry information; the rest are the conjugate mirror. Summing power over all N bins double-counts everything except dc and the folding bin, which is the most common way a correct transform produces a total power that is twice the truth.',
      },
      {
        id: 'dft-problems',
        title: '11. Problem Sets',
        content: `## 11.1 Working method

Following the filter chapter, every answer identifies the misstep it guards
against together with the figure that misstep returns, since those are the
values printed alongside the correct one.

### Problem Set A — bins, resolution and leakage

**A1.** A 512-point DFT is taken at $f_{s} = 48\\ \\mathrm{kHz}$. Give the
bin spacing, the record length and the frequency of bin 100.

**A2.** In the same transform, a peak appears at bin 400. What real
frequency does it represent?

**A3.** Two tones 25 Hz apart must be separated at
$f_{s} = 10\\ \\mathrm{kHz}$. What is the minimum number of samples, by the
$\\Delta f = \\delta f$ rule, and what would you actually take?

**A4.** A 1 kHz tone is sampled at 16 kHz with N = 128. Is it coherent? What
about a 1.05 kHz tone?

**A5.** A 64-sample record of a single cosine gives a peak of 32.0 in bin 10
and numerical zero everywhere else. What is the amplitude of the cosine?

**A6.** The same measurement, retaken with the tone slightly shifted, gives a
peak of 20.68 in bin 11 and comparable energy in bin 10. What went wrong, and
by how much is the amplitude reading low?

**A7.** A 1024-point record is zero-padded to 4096 before transforming. State
the true resolution and the displayed bin spacing.

**A8.** Parseval's relation is checked on a 4-point sequence
$\\lbrace 1,2,3,4\\rbrace$. Show that it holds.

### Answers, Problem Set A

**A1.** $\\Delta f = 48000/512 = 93.75\\ \\mathrm{Hz}$; record length
$T = 512/48000 = 10.667\\ \\mathrm{ms}$, and $1/T = 93.75\\ \\mathrm{Hz}$
confirms it. Bin 100 sits at $100(93.75) = 9375\\ \\mathrm{Hz}$.
*Trap*: computing $\\Delta f = f_{s}/2N$ by confusing the resolution with the
folding frequency, giving 46.875 Hz and halving every subsequent answer.

**A2.** Bin 400 is above $N/2 = 256$, so it is in the mirror. The signed
frequency is $(400-512)(93.75) = -10500\\ \\mathrm{Hz}$, so the real tone is
at **10.5 kHz**, the same energy that appears in bin 112.
*Trap*: $400(93.75) = 37500\\ \\mathrm{Hz}$, which is above the 24 kHz
folding frequency and therefore cannot be present in a sampled real signal at
all. Any bin index above N/2 that yields a frequency above $f_{s}/2$ is a
signal that the mirror has been forgotten.

**A3.** The rule gives $\\Delta f \\le 25\\ \\mathrm{Hz}$, so
$N \\ge 10000/25 = 400$ samples, a record of 40 ms. In practice, section 6.2
measured that one bin of separation merges the lobes, so take at least 1.5 to
2 bins: $N = 800$, a record of 80 ms, and round up to $N = 1024$ for a
radix-2 transform. *Trap*: answering 400 and stopping. It is the textbook
answer and it will not resolve the pair.

**A4.** Cycles in the record are $fN/f_{s}$. For 1 kHz:
$1000(128)/16000 = 8$ — a whole number, so **coherent**, and the tone lands
exactly on bin 8. For 1.05 kHz: $1050(128)/16000 = 8.4$ — **not coherent**,
so energy appears in every bin and the peak reads low.
*Trap*: assuming that any frequency below $f_{s}/2$ is measured exactly.
Nyquist governs whether the frequency is *representable*; coherence governs
whether the DFT *reads it cleanly*. They are different questions.

**A5.** A coherent real cosine of amplitude A puts $AN/2$ in its bin, so

$$A = \\frac{2\\lvert X[k]\\rvert }{N} = \\frac{2(32.0)}{64} = 1.0$$

*Trap*: answering 0.5 by dividing by N without the factor of two, or 32 by
reading the bin as volts. The factor of two exists because the mirror bin
holds the other half of the cosine's energy.

**A6.** The tone is no longer coherent — it now falls between bins 10 and 11.
The peak has dropped from 32.00 to 20.68, and

$$20\\log _{10}(32.00/20.68) = 3.79\\ \\mathrm{dB}$$

so the amplitude reads 3.79 dB low, about 35 % low in linear terms. The
theoretical worst case is $-20\\log _{10}(2/\\pi ) = 3.92\\ \\mathrm{dB}$.
*Trap*: concluding the tone got weaker. Nothing changed but its frequency,
by less than five percent. This is scalloping loss, and applying a window
would reduce it to 1.42 dB.

**A7.** True resolution is set by the 1024 real samples:
$\\Delta f = f_{s}/1024$. Displayed spacing is $f_{s}/4096$, four times
finer. Every fourth displayed point is a true DFT bin; the three between are
interpolated from the same 1024 numbers. *Trap*: reporting $f_{s}/4096$ as
the resolution — the single most common misconception in this topic, and one
the importantNote of section 2 already flags.

**A8.** Left side: $1^{2}+2^{2}+3^{2}+4^{2} = 30$. Right side: from worked
example 5.1 the magnitudes are 10, 2.828427, 2, 2.828427, so the squares are
100, 8, 4, 8, and

$$\\frac{100+8+4+8}{4} = \\frac{120}{4} = 30$$

*Trap*: forgetting the $1/N$ and reporting 120, or summing magnitudes rather
than their squares.

### Problem Set B — windows, the FFT and practical readings

**B1.** A Hann window is applied to a 1024-point record. State its coherent
gain, its main-lobe width in bins and its peak side lobe.

**B2.** A tone of amplitude 5 V is measured with a Hamming window,
$N = 512$, coherently sampled. What peak bin magnitude is expected?

**B3.** How many complex multiplications does a 4096-point radix-2 FFT
require, and how does that compare with the direct sum?

**B4.** Give the bit-reversed input order for a 16-point decimation-in-time
FFT, and name the indices that do not move.

**B5.** A strong tone and a tone 50 dB weaker, ten bins apart, must both be
seen. Rank rectangular, Hamming and Hann for this task and justify the
ranking.

**B6.** A real 2048-point transform is used to compute total signal power by
summing $\\lvert X[k]\\rvert ^{2}$ over all 2048 bins and dividing by
$N^{2}$. What is wrong with the result?

### Answers, Problem Set B

**B1.** CG = 0.50; main lobe 4 bins null to null (−3 dB width 1.44 bins);
peak side lobe −31.47 dB. Note that none of these depends on N — they are
properties of the window shape, expressed in bins.
*Trap*: expecting the numbers to change with record length. The main lobe is
4 bins whether N is 64 or 65536; only the width of a bin changes.

**B2.** $\\lvert X[k]\\rvert = A\\,N\\,\\mathrm{CG}/2$, so

$$\\lvert X[k]\\rvert = \\frac{(5)(512)(0.54)}{2} = 691.2$$

*Trap*: omitting CG and answering $5(512)/2 = 1280$, or omitting the factor
of two and answering 1382.4. Both errors are single factors, both are common,
and they push the answer in opposite directions.

**B3.** $\\log _{2}4096 = 12$, so

$$M = \\frac{4096}{2}(12) = 2048 \\times 12 = 24576$$

complex multiplications, against $4096^{2} = 16777216$ for the direct sum — a
ratio of $8192/12 = 682.7$. *Trap*: answering
$N\\log _{2}N = 49152$, which is the **addition** count. The multiplication
count carries the factor of one half.

**B4.** 0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15. The fixed
points are the indices whose four-bit patterns are palindromes: 0 (0000),
6 (0110), 9 (1001) and 15 (1111).
*Trap*: reversing the *order* of the list rather than the *bits* of each
index, which produces 15, 14, 13, ... and is a completely different
permutation.

**B5.** **Hann first, Hamming second, rectangular last.** Measuring each window's
side-lobe envelope exactly ten bins from the lobe centre gives −29.5 dB for
rectangular, −46.7 dB for Hamming and −68.5 dB for Hann. Rectangular fails
outright: its skirt sits twenty decibels above where a −50 dB tone would
appear. Hamming is marginal — its first side lobe is an excellent −42.7 dB,
but the skirt falls at only about 6 dB per octave, so it has barely improved
by ten bins. Hann's skirt falls at about 18 dB per octave, putting it 18 dB
below the weak tone and leaving it clearly visible.
*Trap*: ranking by the peak side-lobe column alone, which puts Hamming
first. Section 8.3 measured why that ranking is wrong at this distance.

**B6.** Two errors. First, summing over all 2048 bins **double-counts**: for
a real input, bins 1 through 1023 are duplicated by bins 1025 through 2047,
so every component except dc and the folding bin is counted twice. Second,
the correct Parseval normalisation is $1/N$ applied to the sum of
$\\lvert X[k]\\rvert ^{2}$ to recover the sum of $\\lvert x[n]\\rvert ^{2}$;
dividing by $N^{2}$ instead gives the **mean** square, which is a different
quantity — right if average power was wanted, wrong if total energy was.

Taken together the reported figure is roughly twice the mean power rather
than the total energy. *Trap*: the double-count is invisible because the
answer looks plausible — it is off by a clean factor of two, which reads like
a units problem rather than a symmetry problem.`,
        examTip: 'When a DFT question involves an amplitude, walk the chain in the same order every time: bin magnitude, divide by N, multiply by two (unless dc or the folding bin), divide by coherent gain. Four steps, always the same four, and skipping any one of them produces a plausible wrong answer rather than an obviously wrong one.',
        importantNote: 'Every answer above turns on one of five recurring confusions: bin spacing against folding frequency, displayed spacing against true resolution, coherence against Nyquist, multiplication count against addition count, and the real-input mirror. Recognising which one is under test identifies the answer before the arithmetic starts.',
      },
    ],
    keyTakeaways: [
      'DFT: X[k] = Σ x[n]·e^(−j2πkn/N); converts N samples to N frequency bins.',
      'FFT computes DFT in O(N log N) vs O(N²); requires N = power of 2.',
      'Frequency resolution Δf = fₛ/N; longer records improve resolution.',
      'Frequency of bin k: fₖ = k·fₛ/N; maximum frequency at bin N/2 = fₛ/2.',
      'Windowing reduces spectral leakage but widens the main lobe (resolution tradeoff).',
      'Zero-padding improves spectral display (interpolation) but not true frequency resolution.',
    ],
  },

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 9 — ELECTRONICS  (5 curriculum IDs)
   * ────────────────────────────────────────────────────────────────── */

fee_signal_nyquist: {
  topicId: 'fee_signal_nyquist',
  title: `Nyquist Criterion & Aliasing Pitfalls`,
  domainWeight: 'Signal Processing · 4–6%',
  overview: `This is the practitioner's companion to "Sampling Theorem and Nyquist Rate". That chapter proves the theorem, derives spectral replication, works the folding rule through six tones, prices the zero-order hold and settles quantization noise. This one starts where a correct-looking system still fails: the criterion applied at the boundary instead of past it, the word "Nyquist" used for two different quantities, band-limitation assumed when nothing in the hardware enforces it, and energy that was never in the signal folding in anyway. It then treats the design decisions that follow — a full anti-alias specification driven from a stated stopband, deliberate sub-Nyquist sampling with its forbidden zones, clock jitter, decimation, and the two ways a sampled spectrum lies to whoever reads it.`,
  sections: [
    {
      id: 'nyquist-statement',
      title: `1. The Nyquist-Shannon Sampling Theorem`,
      content: `> **How this chapter divides with its sibling.** The companion chapter,
*Sampling Theorem and Nyquist Rate*, owns the theorem itself: the derivation
from the impulse train, the replication picture, the folding rule worked
across six tones, anti-alias filter order versus sampling rate, zero-order
hold droop, sinc reconstruction and signal-to-quantization-noise ratio. Go
there for the machinery. Sections 1 to 3 below restate just enough of it to
stand on, and Sections 4 to 14 — the bulk of this chapter — cover what the
machinery does not: the failure modes of a system that appears to satisfy the
criterion, and the specifications that keep it from appearing to.

## 1.1 The fundamental statement

A bandlimited continuous-time signal x(t) with no frequency components above f_max can be PERFECTLY RECONSTRUCTED from its samples if the sampling rate satisfies:

  $$f_s > 2 \\cdot f_{\\max}$$

The minimum sampling rate 2·f_max is called the NYQUIST RATE. The corresponding maximum signal frequency f_s/2 is called the NYQUIST FREQUENCY.

Equivalent statements you'll see:

- "Sample at least twice the highest frequency present in the signal"
- "The Nyquist frequency must exceed the maximum signal frequency"
- "f_N = f_s/2 must be greater than f_max"

## 1.2 What "perfect reconstruction" means

If the criterion is met, the original continuous signal can be reconstructed EXACTLY from the samples using ideal sinc interpolation:

  x(t) = Σ x[n] · sinc((t - n·T_s) / T_s)

where T_s = 1/f_s is the sampling period and sinc(x) = sin(πx)/(πx).

In practice, sinc interpolation requires infinitely many samples (the sinc function is infinitely wide). Real systems use a practical reconstruction filter instead, and it introduces some imperfection. Its passband has to reach the top of the wanted band at f_max, while its stopband has to start at f_s − f_max, which is the bottom edge of the first image. Section 6.5 shows why quoting that filter's corner as "f_s/2" describes neither requirement.

## 1.3 What happens when you VIOLATE Nyquist — aliasing

If a signal at frequency f > f_s/2 is sampled, it APPEARS at a DIFFERENT frequency in the digital signal. This is ALIASING.

The aliased frequency is:

  $$f_{alias} = |f - n \\cdot f_s|$$

where n is the integer that makes the result fall in [0, f_s/2].

For example:
- f_s = 1000 Hz, signal at 700 Hz
- f_alias = |700 - 1·1000| = 300 Hz
- Sampled output appears as a 300 Hz signal

You CANNOT distinguish the original 700 Hz from a real 300 Hz signal after sampling. The information is LOST.

![A 700 hertz cosine sampled at one kilohertz, with the 300 hertz alias drawn through the identical sample points. Both computed curves pass through every sample exactly, which is the whole content of aliasing: after sampling, the two frequencies are the same data.](/courses/fe-ee/figures/sig-undersampled-cosine.svg)

The figure is that very example drawn out. Between samples the two cosines
disagree wildly, but AT the samples — the only information the digital
system ever receives — they are numerically identical. No later algorithm
can prefer one interpretation over the other, because the data contain no
evidence either way.

## 1.4 Numerical exam problems

Typical problem: "A 1.5 kHz sinusoid is sampled at 2 kHz. What is the apparent frequency?"

Solution:
- f = 1500 Hz, f_s = 2000 Hz, f_N = 1000 Hz
- 1500 > 1000 → aliasing occurs
- f_alias = |1500 - 1·2000| = 500 Hz
- Apparent frequency: 500 Hz

Another typical problem: "What is the minimum sampling rate to AVOID aliasing for a signal with content up to 4 kHz?"

Solution:
- f_max = 4000 Hz
- f_s > 2·f_max = 8000 Hz
- Answer: f_s > 8 kHz (or "8 kHz" if "≥" is allowed; "must exceed 8 kHz" is the strict statement)

## 1.5 The folding diagram

Visualize aliasing by FOLDING the frequency axis at f_s/2. Frequencies above f_s/2 fold back into the [0, f_s/2] range:

\`\`\`
0 ───── f_s/2 ───── f_s ───── 3·f_s/2 ───── 2·f_s ...
                    ↓ fold     ↓                ↓
            f_s/2 ← 0          f_s ← 0          ...
\`\`\`

A 0.9·f_s signal (above Nyquist) folds to 0.1·f_s. A 1.1·f_s signal folds to 0.1·f_s. A 1.9·f_s signal folds to 0.1·f_s.

## 1.6 The DC component is preserved

A 0 Hz (DC) signal samples to 0 Hz — no aliasing concerns. Aliasing only affects non-DC frequencies above f_s/2.

## 1.7 Bandpass sampling (the special case)

If your signal is BANDPASS (content only between f_L and f_H, with f_L > 0), you can sample at LESS than 2·f_H:

  f_s ≥ 2·B  where B = f_H - f_L

provided f_s is chosen such that the spectrum after sampling doesn't overlap itself. This is "undersampling" or "bandpass sampling" and is used in radio receivers to digitize an RF signal directly.

The exam may test recognition of this concept; full bandpass sampling design is more PE-level.`,
      examTip: `The Nyquist condition is f_s > 2·f_max, NOT f_s ≥ 2·f_max. Some texts/exams use ≥; both produce "minimum" but the strict inequality is the formal statement.`,
      importantNote: `Aliasing CANNOT BE CORRECTED after the fact. Once a signal is sampled below its Nyquist rate, the aliased frequencies are indistinguishable from real frequencies in the digital data. Prevention via anti-aliasing filter is the only fix.`,
    },
    {
      id: 'antialiasing-design',
      title: `2. Anti-Aliasing Filter Design`,
      content: `## 2.1 The anti-aliasing filter (AAF)

To enforce Nyquist, place an ANALOG LOW-PASS FILTER BEFORE the sampler. The filter's job: attenuate any frequency content above f_s/2 to negligible levels before sampling.

  Continuous signal → [Anti-Aliasing Filter] → ADC sampler → digital signal

Without the AAF, any noise or interference above f_s/2 will alias into your signal of interest.

## 2.2 Ideal vs practical AAF

The IDEAL AAF would pass all frequencies < f_s/2 perfectly and block everything above. In practice, real filters have a TRANSITION BAND — they can't go from passing to blocking instantaneously.

Real filters are characterized by:

- **Passband edge f_p** — the highest frequency the filter passes with little attenuation
- **Stopband edge f_st** — the lowest frequency the filter attenuates significantly
- **Transition band** — between f_p and f_st
- **Passband ripple** — how flat the filter is in the passband (typically < 0.5 dB)
- **Stopband attenuation** — how much attenuation at f_st (typically 40-100 dB)

## 2.3 Sample rate margin

Because the filter has a transition band, you must oversample beyond the signal of interest:

- f_p = the highest frequency in your signal of interest (e.g., 20 kHz for audio)
- f_s/2 = f_p + transition band
- f_st (where the filter is fully attenuating) = f_s/2

Example: for 20 kHz audio with a filter having a 2 kHz transition band:
- f_p = 20 kHz
- f_st = 22 kHz (where you want full attenuation)
- f_s ≥ 2 · f_st = 44 kHz

This is why CD audio is sampled at 44.1 kHz, not exactly 40 kHz — there's room for the AAF transition band.

## 2.4 Filter order and steepness

Higher-order filters have steeper rolloff:

- 1st-order: 20 dB/decade (6 dB/octave)
- 2nd-order: 40 dB/decade (12 dB/octave)
- N-th order: 20·N dB/decade

For a given transition band, higher orders allow narrower transitions. Trade-off: higher order = more complexity, more component variation sensitivity, phase distortion.

## 2.5 Filter types (analog)

- **Butterworth** — maximally flat passband; moderate transition; no ripple
- **Chebyshev I** — ripple in passband, sharper transition than Butterworth
- **Chebyshev II (Inverse Chebyshev)** — ripple in stopband, flat passband
- **Elliptic (Cauer)** — ripple in BOTH passband and stopband; sharpest transition for a given order
- **Bessel** — linear phase (constant group delay), gentler magnitude roll-off

For anti-aliasing applications, BUTTERWORTH is typical when ripple-free passband matters; ELLIPTIC for the steepest possible transition.

## 2.6 Oversampling and digital decimation

Modern systems often OVERSAMPLE the signal by a factor much greater than 2× Nyquist, then use a digital filter to reduce the sample rate:

  Analog signal → simple analog AAF → ADC at high f_s → digital LPF → decimate → final digital signal

Why: a simple analog filter is much easier to design than a sharp one. Most of the heavy lifting is done by the digital filter, which can be made nearly ideal with enough taps.

Example: a 16-bit audio ADC might sample at 4.5 MHz (~100× oversampling) with a simple 1st-order analog AAF, then digitally filter and decimate to 44.1 kHz.

This is the technique used in delta-sigma ADCs.

## 2.7 Reconstruction filter (the OUTPUT side)

The reverse of the AAF: when converting back from digital to analog, you also need a low-pass filter to remove spectral images above f_s/2.

  Digital signal → DAC → [Reconstruction Filter] → analog signal

The reconstruction filter is also called a SMOOTHING filter or POST-FILTER.

Its design mirrors the anti-alias filter, and so does the pair of frequencies that pin it down: the passband must still be flat at f_max, and the stopband must be in force by f_s − f_max, where the nearest image begins. Section 6 works that pair out in full. A specification that names only "f_s/2" names neither of them and constrains nothing.

## 2.8 Practical exam pattern

"A signal has content from DC to 5 kHz plus interference at 8 kHz. The sampling rate is 12 kHz. What is the apparent frequency of the interference, and what filter design would prevent it?"

Solution:
- f_s = 12 kHz, f_N = 6 kHz
- 8 kHz interference > 6 kHz → aliases to |8 - 12| = 4 kHz
- 4 kHz falls IN the signal band of interest — interference is now indistinguishable from real signal
- Fix: install an anti-aliasing low-pass filter with passband edge 5 kHz and stopband edge ≤ 6 kHz, achieving sufficient attenuation at 8 kHz

The required attenuation at 8 kHz depends on the application — typically you want the aliased component at least 40 dB below your desired signal level.`,
      examTip: `Anti-aliasing filter goes BEFORE the sampler (analog). Reconstruction filter goes AFTER the DAC (also analog). Both are low-pass, and both are pinned by two frequencies rather than one: the passband edge sits at f_max, the top of the band you care about, and the stopband edge sits at f_s − f_max, the nearest frequency that folds (or images) onto that band. Never answer "cutoff at f_s/2" — Section 6.1 shows that placing the −3 dB corner at the folding frequency guarantees about 3 dB of alias rejection no matter how high the filter order goes.`,
    },
    {
      id: 'common-pitfalls',
      title: `3. Common Sampling Pitfalls and Numerical Practice`,
      content: `## 3.1 The "exactly at Nyquist" trap

A signal at EXACTLY f_s/2 is ambiguous. Mathematically, samples at exactly the Nyquist frequency are insufficient to recover the original. In practice, this means:

- f_s = 1000 Hz, sample a 500 Hz cosine: samples might all be 0 (if you sample at the zero-crossings) or have alternating sign (capturing the wave)
- You CANNOT reliably recover a signal at exactly Nyquist

Always design with f_s > 2·f_max (strict inequality), with comfortable margin.

## 3.2 The folding aliases pile up

If your signal has content at MULTIPLE frequencies above Nyquist, they ALL alias and SUM in the digital output. Example:

- f_s = 1000 Hz, signal contains 700 Hz, 1300 Hz, 2700 Hz
- Aliases: 700 → 300 Hz, 1300 → |1300-1000| = 300 Hz, 2700 → |2700-3000| = 300 Hz
- All three components appear at 300 Hz in the digital output — they're indistinguishable

Once aliased, you cannot un-mix them. ONLY pre-filter prevention works.

## 3.3 Sampling vs anti-aliasing for noise

Even if your SIGNAL of interest meets Nyquist, NOISE at high frequencies will alias if not filtered. Wideband thermal noise extends to GHz; any noise above f_s/2 folds into your digital band.

This is why every ADC needs an anti-aliasing filter — not just to handle deliberate signal content but to suppress noise that would alias.

## 3.4 Calculator tips for Nyquist problems

Using your NCEES-approved calculator:

- Quick check: is the input frequency > f_s/2? If yes, aliasing.
- Compute f_alias = |f_in - n · f_s| for n = 1, 2, ...
- Choose n that yields the smallest positive result, with f_alias ∈ [0, f_s/2]

For values like "11.3 kHz signal sampled at 4 kHz":
- f_N = 2 kHz
- |11.3 - 1·4| = 7.3 (still > 2)
- |11.3 - 2·4| = 3.3 (still > 2)
- |11.3 - 3·4| = 0.7 ≤ 2 ✓ → f_alias = 0.7 kHz

## 3.5 The Nyquist rate is the SIGNAL'S property; sampling rate is the SYSTEM'S choice

Common confusion in exam problems:

- "Nyquist rate" = 2 · f_max(signal). This is a property of the SIGNAL.
- "Sampling rate" = f_s. This is a choice made by the system designer.
- The condition to AVOID aliasing: sampling rate > Nyquist rate.

Don't confuse the two terms in your reasoning.

## 3.6 A sampled signal's spectrum

Mathematically, sampling at rate f_s creates copies of the signal's spectrum at integer multiples of f_s in the frequency domain:

  X_s(f) = (1/T_s) · Σ X(f - n·f_s)   for all integer n

The "copies" are called IMAGES or SPECTRAL REPLICAS. As long as the copies don't overlap, the original X(f) can be recovered by low-pass filtering to extract the baseband copy.

Overlap = aliasing.

## 3.7 Five worked exam-style problems

### Problem 1
"A 3.2 kHz tone is sampled at 5 kHz. What is the apparent frequency?"
- f_N = 2.5 kHz, 3.2 > 2.5 → aliasing
- f_alias = |3.2 - 5| = 1.8 kHz

### Problem 2
"A signal has components at 100 Hz, 1500 Hz, and 4500 Hz. The sampling rate is 2 kHz. Which components alias?"
- f_N = 1 kHz
- 100 Hz < 1000 → no aliasing, appears at 100 Hz
- 1500 Hz > 1000 → aliases to |1500 - 2000| = 500 Hz
- 4500 Hz > 1000 → |4500 - 2·2000| = 500 Hz, or = |4500 - 5000| = 500 Hz
- Three components, two aliases — and the two aliases land at the same frequency (500 Hz)

### Problem 3
"What is the minimum sample rate to avoid aliasing for a signal with max frequency 7.5 kHz?"
- f_s > 2 · 7.5 = 15 kHz
- Minimum: f_s > 15 kHz (in practice, choose 16 kHz or higher to allow for AAF transition band)

### Problem 4
"A signal of interest is 0-8 kHz. Designer selects f_s = 20 kHz. What is the AAF specification?"
- f_p = 8 kHz (passband edge — passes signal)
- f_st ≤ f_s/2 = 10 kHz (stopband edge — full attenuation by here)
- Transition band: 8 → 10 kHz (2 kHz wide)
- Stopband attenuation: ≥ 40 dB typical

### Problem 5
"Audio CD samples at 44.1 kHz. What is the Nyquist frequency? What's the highest audio frequency that can be reproduced without aliasing?"
- f_N = 22.05 kHz
- Highest reproducible audio: anything < 22.05 kHz (in practice, the AAF cuts off slightly below to allow margin; ~20 kHz)
- This conveniently matches human hearing range (20 Hz to 20 kHz)

## 3.8 The five problems at a glance

| Problem | f_s | f_N = f_s/2 | Input | Result |
|---|---|---|---|---|
| 1 | 5 kHz | 2.5 kHz | 3.2 kHz tone | aliases to 1.8 kHz |
| 2 | 2 kHz | 1 kHz | 100 / 1500 / 4500 Hz | 100 Hz clean; both others land on 500 Hz |
| 3 | (to find) | — | content to 7.5 kHz | f_s must exceed 15 kHz |
| 4 | 20 kHz | 10 kHz | signal 0-8 kHz | AAF: pass to 8 kHz, stop by 10 kHz |
| 5 | 44.1 kHz | 22.05 kHz | audio | reproducible content below 22.05 kHz |

Read down the table and the method is always the same three moves: compute
f_s/2, compare every input component against it, and fold whatever exceeds it
back into band with the alias formula. Any sampling question that looks
unfamiliar is one of these five rows wearing different numbers.`,
      examTip: `For aliasing calculations, the formula f_alias = |f - n·f_s| works for any n; pick the n that puts f_alias in [0, f_s/2]. Practice mental computation — these are quick if you're fluent.`,
    },
    {
      id: 'nyq-misreadings',
      title: `4. Three Ways the Criterion Is Misread`,
      content: `## 4.1 A criterion with three hypotheses, not one

Written out with nothing suppressed, the sampling theorem says: *if* the
spectrum of $x(t)$ vanishes identically outside $\\lvert f\\rvert < B$, *and if*

$$f_{s} > 2B$$

*then* the samples $x(nT_{s})$ determine $x(t)$ everywhere. Three separate
things have to be true, and each of them is a place where a real system
quietly departs from the theorem while every number on the block diagram still
looks right.

- The inequality is **strict**. Equality is a different case with a different
  answer, and Section 4.2 computes what that answer is.
- The comparison is between a rate and a bandwidth. Two quantities in this
  subject are habitually both called "Nyquist", they differ by a factor of two,
  and Section 4.3 follows a converter clocked at half the rate it needed
  because of it.
- The hypothesis about the spectrum is a statement about the *physical signal
  arriving at the converter pin*, not about the quantity the sensor is
  advertised to measure. Section 4.4 takes a signal every datasheet would call
  a 100 Hz signal and shows it corrupting a band it never claimed to occupy.

Everything after Section 4 follows from noticing that the third hypothesis is
never true by accident. Sections 5 and 6 are about the one component that can
make it approximately true, and what happens in the absence of that component.

## 4.2 Misreading one: sampling *at* the Nyquist rate instead of above it

Set $f_{s} = 2f_{0}$ exactly and sample $x(t) = A\\cos (2\\pi f_{0}t + \\varphi )$.
The sample instants are $t_{n} = n/(2f_{0})$, so

$$x[n] = A\\cos (\\pi n + \\varphi ) = A(-1)^{n}\\cos \\varphi$$

Read that carefully. The phase has not been sampled; it has been **evaluated
once** and baked into a single scale factor. Whatever $\\varphi$ was, the
sequence is an alternating string of the one value $A\\cos \\varphi$. The
original waveform carried two free parameters, amplitude and phase. The sample
sequence carries one. A two-parameter family has been mapped onto a
one-parameter family, so the map cannot be inverted — which is the whole
failure, stated without any appeal to spectra.

The recovered amplitude is therefore

$$\\hat{A} = A\\lvert \\cos \\varphi \\rvert$$

and the shortfall in decibels is $20\\log_{10}\\lvert \\cos \\varphi \\rvert$,
which runs from 0 dB down to minus infinity as the phase walks a quarter turn.

### Worked example 4A: the tone that samples to nothing

**Given**: $A = 1\\ \\mathrm{V}$, $f_{0} = 1\\ \\mathrm{kHz}$,
$f_{s} = 2\\ \\mathrm{kSa/s}$, so $f_{0}$ sits exactly on the folding frequency.

**Find**: the amplitude a DFT of the samples reports, for
$\\varphi = 0°, 30°, 45°, 60°, 90°$.

**Method**: build 4096 samples, transform, and read the bin at $f_{s}/2$. The
tone is exactly on that bin, so its height *is* the answer — no folding
arithmetic is used anywhere.

| $\\varphi$ | $\\lvert \\cos \\varphi \\rvert$ | amplitude measured off the DFT | shortfall |
|---|---|---|---|
| 0° | 1.000000 | 1.0000 V | 0.00 dB |
| 30° | 0.866025 | 0.8660 V | −1.25 dB |
| 45° | 0.707107 | 0.7071 V | −3.01 dB |
| 60° | 0.500000 | 0.5000 V | −6.02 dB |
| 90° | 0.000000 | 0.0000 V | no signal at all |

**Answer**: anything from full scale to identically zero, decided entirely by
where the clock edges happen to fall on the waveform. At 90° every sample lands
on a zero crossing and the converter records a flat line while a one-volt tone
is present at its input.

![Three copies of the same one-kilohertz cosine, differing only in phase, with the sample points that a two-kilosample-per-second clock takes from each. The zero-phase copy is sampled at its peaks and reads its full amplitude, the sixty-degree copy reads half, and the ninety-degree copy is sampled at every zero crossing and reads nothing at all.](/courses/fe-ee/figures/sig4-critical-sampling.svg)

**Check**: the phase-90° trace in the figure is drawn as a full-amplitude
cosine, and every marker on it sits on the axis. Nothing is wrong with the
drawing; that is what the converter sees. Note also that the criterion has not
been *violated* here in the usual sense — no energy has folded, no alias has
appeared at a wrong frequency. The failure is a rank collapse in the mapping
from waveform to samples, and it happens precisely at equality.

### Worked example 4B: one hertz of margin, and what it costs

**Given**: the same converter at $f_{s} = 2\\ \\mathrm{kSa/s}$, but the tone is
moved to $999\\ \\mathrm{Hz}$ and the worst phase, 90°, is kept.

**Find**: whether amplitude and frequency are recoverable, and how much record
is needed.

**Handbook relation**: two tones separated by $\\Delta f$ are resolved by a
record of length

$$T_{\\mathrm{rec}} \\ge \\frac{1}{\\Delta f}$$

Here the tone must be separated from the fold at 1000 Hz, so
$\\Delta f = 1\\ \\mathrm{Hz}$ and $T_{\\mathrm{rec}} \\ge 1\\ \\mathrm{s}$, which
at 2 kSa/s is 2000 samples.

**Substitution**: 2000 samples are taken and transformed. The peak bin is
$999\\ \\mathrm{Hz}$ and its height gives an amplitude of $1.0000\\ \\mathrm{V}$.

**Answer**: both are recovered exactly. Moving 0.1% off the fold turns a
total failure into a perfect measurement — but only because a full second of
data was collected. Halve the record and the 999 Hz tone and the 1000 Hz fold
are no longer distinguishable, and the pathology returns.

**Check**: this is the practical content of the strict inequality. "Sample
above twice the highest frequency" is not a suggestion to add a safety factor
for its own sake; the margin you leave and the record length you can afford
are the *same* engineering quantity, related by $T_{\\mathrm{rec}} \\ge 1/\\Delta f$.

## 4.3 Misreading two: rate and frequency are not the same number

Two quantities in this subject are both named after Nyquist and differ by a
factor of two. The **Nyquist rate** $2f_{\\max}$ is a property of a waveform and
is measured in samples per second; the **Nyquist frequency** $f_{s}/2$ is a
property of a converter and is measured in hertz. Swapping them does not
produce a slightly wrong answer. It produces a clock running at half or twice
the intended speed, and half is catastrophic.

### Worked example 4C: a converter clocked at half the rate it needed

**Given**: a vibration front end whose specification sheet reads "Nyquist rate
600 kSa/s". A designer reads "Nyquist" and sets the sampling clock to
300 kSa/s, reasoning that the converter's Nyquist frequency should be 300 kHz.
The signal genuinely contains components at 40 kHz, 180 kHz and 260 kHz.

**Find**: where each component appears in the captured record, at the mistaken
rate and at the intended one.

**Method**: sample each tone at each rate and transform. The real DFT returns
bins spanning 0 to $f_{s}/2$, so the bin holding the peak *is* the location.

| component | at 300 kSa/s (the mistake) | at 600 kSa/s (as intended) |
|---|---|---|
| 40 kHz | 40 kHz, unharmed | 40 kHz |
| 180 kHz | 120 kHz | 180 kHz |
| 260 kHz | 40 kHz | 260 kHz |

**Answer**: at the mistaken rate the 260 kHz component lands exactly on top of
the genuine 40 kHz component. The record now shows one peak at 40 kHz whose
height is the vector sum of two unrelated physical processes, and there is no
measurement that can separate them afterwards.

**Check**: the intended rate is $600\\ \\mathrm{kSa/s}$, giving a folding
frequency of $600/2 = 300\\ \\mathrm{kHz}$, comfortably above the 260 kHz
component. The number 300 appears in both readings of the datasheet, which is
exactly why the error survives inspection. Ask which side of the block diagram
a quoted number belongs to before using it: a rate belongs to the signal and
carries the units of a clock, a frequency belongs to the converter and marks a
place on the frequency axis.

## 4.4 Misreading three: nothing enforces band-limitation

The third hypothesis is the one that is never true. A strictly band-limited
signal must extend over all time, so no waveform that starts, stops, switches
or has a corner in it is band-limited. Signals described by their *nominal*
frequency are the trap: a chopper running at 100 Hz is universally called a
100 Hz signal, and its spectrum reaches to the megahertz region.

Take an ideal square wave of fundamental $f_{0}$. Its Fourier series is

$$x(t) = \\frac{4}{\\pi }\\sum _{k=1,3,5,\\dots }^{\\infty } \\frac{1}{k}\\sin (2\\pi k f_{0} t)$$

so the amplitude of harmonic $k$ is $4/(\\pi k)$ and there is no last harmonic.
Every one of them above the folding frequency arrives at the converter, folds,
and adds to whatever is already sitting at the frequency it folds onto.

### Worked example 4D: a 100 Hz chopper corrupting its own third harmonic

**Given**: a 100 Hz square wave of unit amplitude, sampled at
$f_{s} = 1\\ \\mathrm{kSa/s}$ with no filter of any kind. The folding frequency
is 500 Hz, so harmonics 1, 3 and 5 are "in band" and 7, 9, 11, … are not.

**Find**: the amplitudes a DFT of the samples reports for the first three odd
harmonics, against the true series coefficients $4/(\\pi k)$.

**Method**: sample the square wave for 10 s, transform 10000 points so every
harmonic is on a bin, and read the heights.

| harmonic | true $4/(\\pi k)$ | measured off the samples | error |
|---|---|---|---|
| 100 Hz | 1.273240 | 1.294427 | +0.14 dB |
| 300 Hz | 0.424413 | 0.494427 | +1.33 dB |
| 500 Hz | 0.254648 | 0.400000 | +3.92 dB |

**Answer**: every measured harmonic is too large, and the error grows toward
the fold. The 300 Hz reading is 1.33 dB high — a 17% amplitude error on a
component sitting at 60% of the folding frequency, well inside what anyone
would call the safe region.

**Check**: the 500 Hz row has an exact closed form worth recognising. The
measured-to-true ratio is $0.400000/0.254648 = 1.570796$, which is $\\pi /2$ to
six figures, because the component sitting exactly on the fold collects the
infinite family of harmonics that fold onto it and the resulting series sums to
$\\pi /2$ times the isolated coefficient. The fundamental is corrupted too, by
0.14 dB, and it is five times below the folding frequency. Nothing in this
system violates "sample above twice the highest frequency of interest"; what it
violates is the hypothesis that there is a highest frequency at all.`,
      examTip: `Three separate hypotheses hide inside "f_s > 2·f_max": the inequality is strict, the two sides are a rate and a bandwidth rather than two frequencies, and the spectrum has to be genuinely empty above f_max. Exam questions that look ambiguous are usually testing which hypothesis a stated system fails. If a question gives a tone at exactly f_s/2, the answer depends on phase and the honest response is that amplitude is not recoverable.`,
      importantNote: `A component below the folding frequency is not automatically safe. In worked example 4D the 100 Hz fundamental — one fifth of the folding frequency — reads 0.14 dB high because harmonics from above the fold land on it. Whether a given measurement is trustworthy depends on what is present above the fold, not on where the measurement itself sits.`,
    },
    {
      id: 'nyq-uninvited',
      title: `5. Aliasing of Energy the Signal Never Contained`,
      content: `## 5.1 Broadband noise folds, and it folds by the octave

Section 4 dealt with a signal misbehaving. This section deals with energy that
belongs to no signal at all: the amplifier's own thermal and shot noise, and
interference coupled in from elsewhere on the board. Neither is mentioned in
the sampling theorem, because the theorem is about a waveform and these are
about a circuit. Both fold.

Model the front end's noise as flat with one-sided density $S_{0}$ in
$\\mathrm{V^{2}/Hz}$, occupying everything from dc up to the amplifier's own
noise bandwidth $B_{n}$. Sampling maps every one of those hertz into the band
from 0 to $f_{s}/2$, and because noise contributions from disjoint frequency
ranges are uncorrelated, they add in **power**. Writing

$$M = \\frac{B_{n}}{f_{s}/2}$$

for the number of Nyquist-wide slices the front end passes, the density inside
the digital band becomes

$$S_{\\mathrm{digital}} = M\\,S_{0}$$

while the total noise power is unchanged — it has simply been squeezed into a
band $M$ times narrower. Signal power is untouched, so the signal-to-noise
ratio degrades by

$$\\Delta \\mathrm{SNR} = 10\\log_{10}M \\ \\ \\mathrm{dB}$$

Three decibels per doubling of unfiltered front-end bandwidth, forever. This
is why "the converter has a 100 dB noise floor" is a claim about the converter
and not about the measurement.

### Worked example 5A: what an unfiltered front end costs a 16-bit converter

**Given**: a 16-bit converter clocked at $f_{s} = 100\\ \\mathrm{kSa/s}$, fed
directly from an instrumentation amplifier whose noise bandwidth is
$B_{n} = 2\\ \\mathrm{MHz}$. No anti-alias filter is fitted.

**Find**: the rise in the in-band noise density and the loss in effective bits.

**Substitution**: the folding frequency is $100/2 = 50\\ \\mathrm{kHz}$, so

$$M = \\frac{2\\,000\\,000}{50\\,000} = 40$$

$$\\Delta \\mathrm{SNR} = 10\\log_{10}40 = 16.02\\ \\mathrm{dB}$$

**Independent route**: rather than trust that, generate 12.8 million samples of
white noise at 4 MSa/s, keep every fortieth sample, and compare the noise
density of the two records. Measured rise: **16.02 dB**, against 16.0206 dB
from the expression above — agreement to four hundredths of a decibel, and the
simulation never uses the formula.

**Answer**: the converter's own resolution is worth
$6.02 \\times 16 + 1.76 = 98.08\\ \\mathrm{dB}$, and 16.02 dB of that is thrown
away before a single bit is quantized. In bits,

$$\\Delta N = \\frac{16.02}{6.02} = 2.66\\ \\mathrm{bits}$$

so the 16-bit part behaves like a 13.3-bit part. Every rupee spent on the extra
resolution is refunded to the amplifier.

![Rise in in-band noise density against the ratio of front-end noise bandwidth to the folding frequency, on logarithmic axes. Simulated white noise decimated by factors from one to sixty-four is plotted as markers and lands on the ten-log-ten line derived in the text, confirming three decibels of penalty for every doubling of unfiltered bandwidth.](/courses/fe-ee/figures/sig4-noise-folding.svg)

**Check**: the markers in the figure are measurements, not the line evaluated
at integer points; the largest discrepancy across the whole sweep is 0.02 dB.
Note the leftmost point: at $M = 1$ the penalty is exactly zero, which is the
statement that a front end band-limited to the folding frequency folds nothing.
That is the entire job of the anti-alias filter, drawn as a boundary condition.

## 5.2 Noise bandwidth is not the −3 dB bandwidth

Fitting a filter does not reduce $M$ to one, because a real filter keeps
passing a little of everything. The quantity that matters is the **equivalent
noise bandwidth**, the width of the ideal brick wall that would pass the same
noise power:

$$B_{n} = \\frac{1}{\\lvert H(0)\\rvert ^{2}}\\int_{0}^{\\infty }\\lvert H(f)\\rvert ^{2}\\,df$$

For a Butterworth of order $n$ and −3 dB frequency $f_{c}$, that integral has a
closed form:

$$\\frac{B_{n}}{f_{c}} = \\frac{\\pi /(2n)}{\\sin \\bigl(\\pi /(2n)\\bigr)}$$

| filter order $n$ | $B_{n}/f_{c}$ closed form | $B_{n}/f_{c}$ by numerical integration | folding penalty |
|---|---|---|---|
| 1 | 1.5708 | 1.5706 | 1.96 dB |
| 2 | 1.1107 | 1.1107 | 0.46 dB |
| 3 | 1.0472 | 1.0472 | 0.20 dB |
| 4 | 1.0262 | 1.0262 | 0.11 dB |
| 6 | 1.0115 | 1.0115 | 0.05 dB |
| 8 | 1.0065 | 1.0065 | 0.03 dB |

The middle column is the expression above; the right-hand column is the same
integral evaluated numerically on a four-million-point grid, and the two agree
to better than $3\\times 10^{-4}$ everywhere. The penalty column assumes the
−3 dB frequency has been placed at the folding frequency, which as Section 6
argues is the wrong place to put it — but it does isolate one effect cleanly.

### Worked example 5B: a single-pole filter is not a filter

**Given**: the same 100 kSa/s converter, now preceded by a one-pole RC
low-pass with its corner at the folding frequency,
$f_{c} = 50\\ \\mathrm{kHz}$.

**Find**: the residual noise-folding penalty.

**Substitution**: from the table, $B_{n} = 1.5708 \\times 50 = 78.54\\ \\mathrm{kHz}$,
so $M = 78.54/50 = 1.5708$ and

$$\\Delta \\mathrm{SNR} = 10\\log_{10}(1.5708) = 1.96\\ \\mathrm{dB}$$

**Answer**: 1.96 dB, or about a third of a bit, from a filter that was
supposed to fix the problem. Going to second order drops it to 0.46 dB and to
fourth order to 0.11 dB. The single pole is worth having — it took 16.02 dB
down to 1.96 dB — but it does not finish the job, and the reason is that a
single pole is still passing appreciable energy an octave and two octaves out.

**Check**: notice that this penalty is independent of the sampling rate. Scale
$f_{s}$ and $f_{c}$ together and $M$ is unchanged, because $M$ is a ratio of
bandwidths. Oversampling helps only if the filter corner stays put while
$f_{s}$ rises, which is precisely what oversampled converter architectures do.

## 5.3 Interference from a source the signal has nothing to do with

Noise is diffuse and its folding is a statistical penalty. An interferer is a
line, and its folding puts a specific false peak at a specific place. The
distinguishing feature — and the reason it defeats reasoning of the form "our
signal only goes to 200 Hz, so 1 kSa/s is plenty" — is that the interferer is
not part of the signal and was never in anybody's bandwidth budget.

### Worked example 5C: a switching supply inside a strain measurement

**Given**: a bridge amplifier measuring strain, genuine content from dc to
200 Hz, sampled at $f_{s} = 1\\ \\mathrm{kSa/s}$. Two unrelated sources couple
into the cable: a dc-dc converter switching at 62.15 kHz, and the third
harmonic of a nearby motor drive at 38.6 kHz.

**Find**: where each one appears in the captured record.

**Method**: sample each interferer at 1 kSa/s and transform 4000 points; the
peak bin gives the location directly.

| coupled source | frequency | where the record puts it |
|---|---|---|
| dc-dc converter | 62.15 kHz | **150 Hz** |
| motor-drive harmonic | 38.6 kHz | 400 Hz |

**Answer**: the switching tone lands at 150 Hz, three quarters of the way up
the band of interest, indistinguishable from strain. The motor harmonic lands
at 400 Hz, outside the band of interest but inside the digital record, where a
digital filter can still remove it.

**Check**: the two outcomes are worth separating, because they call for
different fixes. Anything folding into $(f_{p},\\ f_{s}/2)$ — here 200 Hz to
500 Hz — is a nuisance that post-processing can delete. Anything folding into
$(0,\\ f_{p})$ is permanent. Section 6.2 shows that the boundary between those
two fates is the input frequency $f_{s} - f_{p}$, and that this, not $f_{s}/2$,
is the frequency an anti-alias filter has to be specified at.

The general point survives the specific numbers. The signal chain does not
know which energy you meant to measure. Sampling folds everything present at
the converter pin, and the only place to make a distinction is in front of it,
in the analog domain, before the fold happens.`,
      examTip: `Two aliasing questions look identical and are not. "Where does this interferer land?" is answered by folding it into [0, f_s/2]. "Does it matter?" is answered by asking whether it lands below f_p, the top of the band you actually want. Interference that folds into the guard band between f_p and f_s/2 can still be removed digitally; interference that folds below f_p cannot.`,
      importantNote: `Broadband noise costs 10·log₁₀(B_n / (f_s/2)) decibels of SNR, where B_n is the front end's equivalent noise bandwidth and not its −3 dB bandwidth. For a single-pole filter the two differ by a factor π/2, which is 1.96 dB of penalty that a −3 dB-based calculation does not predict.`,
    },
    {
      id: 'nyq-aa-specification',
      title: `6. The Anti-Alias Filter Is What Makes the Hypothesis True`,
      content: `> **Division of labour.** The companion chapter's Section 7 already sets up
the anti-alias filter as a three-number specification and solves the
Butterworth order for a stated rejection at $f_{s} - f_{\\max}$, tabulating
the order against sampling rate. That derivation places the filter's corner
*on* the passband edge, which silently accepts 3.01 dB of droop at the top of
the wanted band. This section does three things the companion does not: it
shows what goes wrong when the corner is placed at $f_{s}/2$ instead, it adds
the passband-droop constraint so the corner is derived rather than assumed,
and it separates inputs that reach the wanted band from those that fold only
into the guard band. The magnitude expression below is the same one the
companion uses, restated here so this section stands alone.

## 6.1 Why "cutoff at f_s/2" specifies nothing

The single most common written answer to "specify the anti-alias filter" is
"low-pass, cutoff at $f_{s}/2$". It is worth seeing exactly why that sentence
carries no design information at all.

"Cutoff", unqualified, means the −3 dB frequency. Take any Butterworth of any
order $n$ with its −3 dB frequency at $f_{c}$:

$$\\lvert H(f)\\rvert ^{2} = \\frac{1}{1 + (f/f_{c})^{2n}}$$

$$A(f) = 10\\log_{10}\\!\\left[1 + (f/f_{c})^{2n}\\right] \\ \\ \\mathrm{dB}$$

Put $f = f_{c}$ and the order cancels out of the arithmetic entirely:

$$A(f_{c}) = 10\\log_{10}(1 + 1) = 3.01\\ \\mathrm{dB}$$

Now ask what protection that buys. An input just above the folding frequency,
at $f_{s}/2 + \\delta$, folds to $f_{s}/2 - \\delta$ and arrives attenuated by
$A(f_{s}/2 + \\delta )$, which for small $\\delta$ is barely more than 3.01 dB.
Raising the order does almost nothing: with $f = 1.01f_{c}$, a seventh-order
filter gives 3.32 dB and a fourteenth-order filter gives 3.66 dB. **Doubling
the order bought a third of a decibel.** Rejection at the corner is set by the
corner's definition, not by the roll-off, so a specification that names only
the corner and places it at the fold has specified a filter that lets aliases
through at essentially full strength.

## 6.2 The frequency that actually matters is f_s − f_p

Let $f_{p}$ be the top of the band you intend to keep. Which input frequencies
can land inside $(0,\\ f_{p})$ after sampling? An input in the first fold zone,
$f_{s}/2 < f < f_{s}$, appears at $f_{s} - f$. That result is below $f_{p}$
exactly when

$$f_{s} - f < f_{p} \\ \\Longleftrightarrow \\ f > f_{s} - f_{p}$$

So the lowest input frequency capable of corrupting the wanted band is

$$f_{\\mathrm{crit}} = f_{s} - f_{p}$$

and inputs between $f_{s}/2$ and $f_{s} - f_{p}$ fold harmlessly into the
**guard band** $(f_{p},\\ f_{s}/2)$, where a digital filter can still delete
them. The guard band is $f_{s}/2 - f_{p}$ wide and it is bought entirely with
sampling rate.

$$\\text{guard band width} = \\frac{f_{s}}{2} - f_{p}$$

This gives the anti-alias filter its real specification, which has two
frequencies in it and not one:

- **Passband edge** $f_{p}$, with a stated maximum droop (0.5 dB is typical).
- **Stopband edge** $f_{s} - f_{p}$, with a stated minimum attenuation.

Neither of them is $f_{s}/2$.

## 6.3 How much attenuation, and where the number comes from

The stopband attenuation is not a matter of taste. It is set by the level at
which a folded residue stops mattering, which for a converter is its own noise
floor. The ideal signal-to-quantization-noise ratio of an $N$-bit converter is

$$\\mathrm{SQNR} = 6.02N + 1.76\\ \\ \\mathrm{dB}$$

so demanding that folded energy arrive below the quantization floor means

$$A_{\\mathrm{stop}} \\ge 6.02N + 1.76\\ \\ \\mathrm{dB}$$

For 12 bits that is $6.02 \\times 12 + 1.76 = 74.00\\ \\mathrm{dB}$; for 14 bits,
$6.02 \\times 14 + 1.76 = 86.04\\ \\mathrm{dB}$; for 16 bits,
$6.02 \\times 16 + 1.76 = 98.08\\ \\mathrm{dB}$. Rounding 74.00 up to 80 dB, as
the worked example below does, is a modest and normal margin.

### Worked example 6A: a complete anti-alias specification from a stated stopband

**Given**: an audio-grade acquisition channel. Wanted band dc to
$f_{p} = 20\\ \\mathrm{kHz}$, passband droop at $f_{p}$ not to exceed 0.5 dB,
alias rejection at least 80 dB, sampling rate
$f_{s} = 100\\ \\mathrm{kSa/s}$. Butterworth realization.

**Find**: the filter order and its −3 dB frequency.

**Handbook relation**: the two constraints, written against the magnitude
expression of Section 6.1 with $r = f/f_{c}$:

$$10\\log_{10}\\!\\left[1 + (f_{p}/f_{c})^{2n}\\right] \\le 0.5$$

$$10\\log_{10}\\!\\left[1 + (f_{\\mathrm{crit}}/f_{c})^{2n}\\right] \\ge 80$$

**Substitution**: the critical frequency is
$f_{\\mathrm{crit}} = 100 - 20 = 80\\ \\mathrm{kHz}$. The droop constraint fixes
the corner once the order is chosen:

$$\\frac{f_{p}}{f_{c}} \\le \\left(10^{0.05} - 1\\right)^{1/(2n)} = (0.122018)^{1/(2n)}$$

Try $n = 7$: the bound is $(0.122018)^{1/14} = 0.860488$, so
$f_{c} \\ge 20/0.860488 = 23.24\\ \\mathrm{kHz}$, and at 80 kHz that filter
delivers 75.15 dB — short of 80. Try $n = 8$: the bound is
$(0.122018)^{1/16} = 0.876802$, so $f_{c} \\ge 20/0.876802 = 22.81\\ \\mathrm{kHz}$,
and at 80 kHz it delivers 87.19 dB.

**Answer**: an **eighth-order Butterworth with its −3 dB frequency at
22.81 kHz**. Written as a specification a vendor could quote against:

| parameter | value |
|---|---|
| topology | Butterworth low-pass, analog, ahead of the sampler |
| order | 8 |
| passband edge | 20 kHz |
| passband droop at edge | 0.50 dB |
| −3 dB frequency | 22.81 kHz |
| stopband edge | 80 kHz, which is $f_{s} - f_{p}$ |
| stopband attenuation | 87.19 dB, against 80 dB required |
| sampling rate assumed | 100 kSa/s |

**Independent route**: handing the same four numbers — 20 kHz, 80 kHz, 0.5 dB,
80 dB — to a standard filter-order routine returns order 8 with a −3 dB
frequency of 22 810 Hz, matching the hand derivation to five figures by a
completely different code path. The same routine for an elliptic realization
returns **order 5**, and for a Chebyshev type I, order 6 — the usual ordering,
and the reason production converters rarely use Butterworth here.

**Check**: contrast this with the defective specification. An eighth-order
Butterworth with its corner placed at $f_{s}/2 = 50\\ \\mathrm{kHz}$ delivers, at
the 80 kHz that matters, only **32.66 dB**. Same topology, same order, same
component count, 54.5 dB worse, purely because the corner was named at the
wrong frequency.

![Two eighth-order Butterworth responses on logarithmic frequency axes, one with its minus-three-decibel corner at twenty-two point eight kilohertz and one with its corner at fifty kilohertz. Vertical guides mark the passband edge, the folding frequency and the critical frequency eighty kilohertz, where the two curves are more than fifty decibels apart.](/courses/fe-ee/figures/sig4-aa-cutoff-defect.svg)

## 6.4 Sampling rate and filter order are one decision, not two

Hold the specification of Section 6.3 fixed — 20 kHz passband, 0.5 dB droop,
80 dB rejection — and sweep the sampling rate. The critical frequency moves
with it, and the order follows.

| $f_{s}$ | $f_{\\mathrm{crit}} = f_{s} - f_{p}$ | Butterworth order | −3 dB frequency | elliptic order |
|---|---|---|---|---|
| 44.1 kSa/s | 24.1 kHz | 56 | 20.38 kHz | 9 |
| 48 kSa/s | 28 kHz | 31 | 20.69 kHz | 8 |
| 60 kSa/s | 40 kHz | 15 | 21.45 kHz | 6 |
| 100 kSa/s | 80 kHz | 8 | 22.81 kHz | 5 |
| 200 kSa/s | 180 kHz | 5 | 24.68 kHz | 4 |

Every row is the same channel with a different clock. A 56th-order analog
filter is not a thing anyone builds; a 5th-order elliptic is an afternoon's
work. The lesson is that the sampling rate is chosen to make the filter
buildable, and the theorem's minimum is only the left-hand end of the table.

Comparing this table with the companion chapter's version of the same sweep is
instructive, because the orders differ and neither is wrong. The companion
demands 60 dB and puts the corner on the passband edge; this one demands 80 dB
and holds the droop at that edge to 0.5 dB, which forces the corner up and the
order with it. Two of the three numbers in a filter specification were changed,
so the answer changed. That is the whole argument for writing all three down.

### Worked example 6B: reading the table backwards

**Given**: a project constrained to a 5th-order elliptic anti-alias filter by
board area, with the same 20 kHz passband and 80 dB requirement.

**Find**: the lowest sampling rate that admits it.

**Substitution**: reading the elliptic column, order 5 first appears at
$f_{s} = 100\\ \\mathrm{kSa/s}$; at 60 kSa/s the same specification needs order 6.

**Answer**: 100 kSa/s, which is 2.5 times the theorem's minimum of
$2 \\times 20 = 40\\ \\mathrm{kSa/s}$.

**Check**: this is the origin of the rule of thumb that practical systems run
at 2.2 to 2.5 times the highest wanted frequency. The factor is not a safety
margin bolted onto the theorem; it is the transition band an implementable
filter needs, converted into a clock rate.

## 6.5 The same two frequencies on the output side

The reconstruction filter after the converter faces the mirror-image problem
and is pinned by the mirror-image pair. Its passband must still be flat at
$f_{p}$, because that is the top of the signal being rebuilt. Its stopband must
be in force by the bottom edge of the nearest image, which sits at

$$f_{\\mathrm{image}} = f_{s} - f_{p}$$

— numerically the same frequency as $f_{\\mathrm{crit}}$ on the input side, and
for the same reason. So the specification of worked example 6A serves on both
sides of a 100 kSa/s, 20 kHz channel. What is *not* shared is the zero-order
hold: the converter's hold shapes the output spectrum and the input has no
equivalent, which the companion chapter treats in its Section 7.

Once again, "cutoff at $f_{s}/2$" names neither of the two frequencies that
define the requirement, and if taken as the −3 dB point it puts 3.01 dB of
droop at 50 kHz and leaves the image at 80 kHz almost untouched.`,
      examTip: `Specify an anti-alias filter with two frequencies and two levels: passband edge f_p with a droop limit, and stopband edge f_s − f_p with an attenuation limit taken from the converter's own SQNR, 6.02N + 1.76 dB. If a question offers "cutoff at f_s/2" among the choices, it is the distractor — at the corner the attenuation is 3.01 dB regardless of order.`,
      importantNote: `The critical frequency for an anti-alias filter is f_s − f_p, not f_s/2. Inputs between f_s/2 and f_s − f_p fold into the guard band above f_p, where digital filtering can still remove them; only inputs above f_s − f_p reach the band you care about. Specifying the stopband at f_s/2 is not wrong, merely more expensive than necessary — specifying the −3 dB corner there is wrong.`,
    },
    {
      id: 'nyq-bandpass',
      title: `7. Sub-Nyquist Sampling on Purpose: Permitted Bands and Forbidden Zones`,
      content: `## 7.1 Undersampling is not a violation when the band is narrow

Everything so far has treated folding as damage. It is only damage when the
folded pieces land on top of each other. If a signal occupies a band
$[f_{L},\\ f_{H}]$ with $f_{L} > 0$, most of the axis below $f_{H}$ is empty,
and a sampling rate far below $2f_{H}$ can be chosen so that the replicas
interleave without touching. The band is then translated down to baseband by
the sampler itself, with no mixer, no local oscillator and no image filter.
Radio receivers do this deliberately and call it bandpass sampling, harmonic
sampling or undersampling.

The floor is set by information, not by frequency: with

$$B = f_{H} - f_{L}$$

no rate below $2B$ can work, because the replicas are $B$ wide and there is not
enough room. But $2B$ is a floor, not a recipe. Whether a particular rate above
it works depends on where the band sits, and the permitted rates form
**disconnected intervals** with forbidden gaps between them.

## 7.2 Deriving the permitted intervals

Sampling at $f_{s}$ puts a copy of the positive-frequency band at
$[f_{L} - kf_{s},\\ f_{H} - kf_{s}]$ and a copy of the negative-frequency band at
$[kf_{s} - f_{H},\\ kf_{s} - f_{L}]$, for every integer $k$. For a clean capture
we need one such copy to sit entirely inside $[0,\\ f_{s}/2]$ with nothing else
overlapping it. Requiring the $k$-th downshifted copy to clear zero and the
neighbouring upshifted copy to clear it from above gives, with $n = k + 1$,

$$\\frac{2f_{H}}{n} \\le f_{s} \\le \\frac{2f_{L}}{n - 1}$$

for integer $n$ in the range

$$1 \\le n \\le \\left\\lfloor \\frac{f_{H}}{B} \\right\\rfloor$$

with the $n = 1$ case reading simply $f_{s} \\ge 2f_{H}$, the ordinary
criterion. The interval for a given $n$ is non-empty only when
$2f_{H}/n \\le 2f_{L}/(n-1)$, and it collapses to a single rate at the largest
admissible $n$. Two consequences are worth stating before any numbers:

- The absolute minimum $f_{s} = 2B$ is attainable **only** when $f_{H}/B$ is an
  integer. Otherwise the lowest usable rate is strictly above $2B$.
- Because the intervals are disconnected, **raising the sampling rate can break
  a working design**. That is the opposite of every intuition built up from
  baseband sampling, and it is the single most useful thing in this section.

## 7.3 Worked example 7A: an intermediate-frequency band, mapped completely

**Given**: an IF band from $f_{L} = 20\\ \\mathrm{MHz}$ to
$f_{H} = 24\\ \\mathrm{MHz}$, so $B = 24 - 20 = 4\\ \\mathrm{MHz}$.

**Find**: every permitted sampling rate, and the forbidden zones between them.

**Substitution**: $\\lfloor f_{H}/B\\rfloor = \\lfloor 24/4\\rfloor = 6$, so
$n$ runs from 1 to 6.

| $n$ | lower limit $2f_{H}/n$ | upper limit $2f_{L}/(n-1)$ | permitted interval |
|---|---|---|---|
| 1 | 48 MSa/s | — | 48 and above |
| 2 | 24 MSa/s | 40 MSa/s | 24 to 40 |
| 3 | 16 MSa/s | 20 MSa/s | 16 to 20 |
| 4 | 12 MSa/s | 13.333 MSa/s | 12 to 13.333 |
| 5 | 9.6 MSa/s | 10 MSa/s | 9.6 to 10 |
| 6 | 8 MSa/s | 8 MSa/s | 8 exactly |

**Answer**: the forbidden zones are 8 to 9.6, 10 to 12, 13.333 to 16, 20 to 24
and 40 to 48 MSa/s. Note the last one: **44 MSa/s does not work**, even though
it is 5.5 times the information floor of $2B = 8\\ \\mathrm{MSa/s}$ and only
just short of $2f_{H}$.

![Permitted sampling rates for a twenty to twenty-four megahertz band, drawn as one horizontal bar per replica index from one to six against a sampling-rate axis. The gaps that no index covers are shaded, and markers show that twelve point five megasamples per second falls inside a permitted bar while forty-four megasamples per second falls in a shaded gap.](/courses/fe-ee/figures/sig4-bandpass-zones.svg)

**Check by measurement, permitted rate**: place four tones across the band and
sample at 12.5 MSa/s, which is inside the $n = 4$ interval. Transforming the
samples puts them at

| input tone | where the record puts it |
|---|---|
| 20.5 MHz | 4.5 MHz |
| 21.3 MHz | 3.7 MHz |
| 22.0 MHz | 3.0 MHz |
| 23.4 MHz | 1.6 MHz |

Four distinct outputs, so nothing has collided. Sampling the band edges the
same way puts 20 MHz at 5.0 MHz and 24 MHz at 1.0 MHz, so the whole 4 MHz band
has been translated into $[1,\\ 5]\\ \\mathrm{MHz}$, comfortably inside the
$0$ to $6.25\\ \\mathrm{MHz}$ that a 12.5 MSa/s record can hold. The width is
preserved: $5.0 - 1.0 = 4.0\\ \\mathrm{MHz}$.

**Check by measurement, forbidden rate**: at 44 MSa/s, tones at 20.5 MHz and
23.5 MHz both land at **20.5 MHz**. Two physically distinct signals, one
number. The design is broken at a rate nearly six times the theoretical floor.

## 7.4 Spectral inversion, and why the order of the tones reversed

Look again at the permitted-rate table above: 20.5 MHz came out highest and
23.4 MHz came out lowest. The band has been flipped. This happens whenever the
copy that lands in baseband is the one derived from the *negative*-frequency
image, which is the case for even $n$:

$$f_{\\mathrm{out}} = \\begin{cases} f_{\\mathrm{in}} - (n-1)\\dfrac{f_{s}}{2}, & n \\text{ odd} \\\\[4pt] n\\dfrac{f_{s}}{2} - f_{\\mathrm{in}}, & n \\text{ even}\\end{cases}$$

For $n = 4$, even, so the mapping is decreasing and the band is inverted. A
receiver that undersamples with even $n$ must re-invert in software, or
demodulate with the sign of its frequency axis flipped — a defect that shows up
as a perfectly clean signal that demodulates to noise.

### Worked example 7B: how tight is the clock tolerance?

**Given**: a 2.4 to 2.5 GHz band, so $B = 100\\ \\mathrm{MHz}$ and
$\\lfloor f_{H}/B\\rfloor = \\lfloor 2500/100\\rfloor = 25$.

**Find**: the two highest-$n$ intervals and the clock accuracy each demands.

**Substitution**: for $n = 25$,
$2 \\times 2500/25 = 200\\ \\mathrm{MSa/s}$ and
$2 \\times 2400/24 = 200\\ \\mathrm{MSa/s}$ — the interval is the single point
200 MSa/s. For $n = 24$, the limits are
$2 \\times 2500/24 = 208.333\\ \\mathrm{MSa/s}$ and
$2 \\times 2400/23 = 208.696\\ \\mathrm{MSa/s}$.

**Answer**: the $n = 24$ window is 0.363 MSa/s wide on a 208 MSa/s centre, a
fractional width of

$$\\frac{208.696 - 208.333}{208.333} = 0.0017391$$

or **0.174%**. A clock with 0.2% error walks out of the window.

**Check**: this is why practical undersampling receivers use low $n$ — the
$n = 2$ window in worked example 7A spans 24 to 40 MSa/s, a 50% fractional
width, which any crystal will hold. Pushing $n$ toward its ceiling squeezes the
sampling rate toward $2B$ and the tolerance toward zero at the same time, and
the two trade against each other directly.`,
      examTip: `For bandpass sampling, compute n_max = floor(f_H / B) first, then test the intervals 2f_H/n ≤ f_s ≤ 2f_L/(n−1) downward from n_max. A rate is legal only if it lands inside one of them — being above 2B is necessary and nowhere near sufficient. Remember that even n inverts the spectrum.`,
      importantNote: `Raising the sampling rate can break a bandpass-sampled design. In worked example 7A, 40 MSa/s works and 44 MSa/s does not, even though 44 is higher. This is the one place in the subject where "sample faster" is not a safe default, and it catches people who learned the baseband rule first.`,
    },
    {
      id: 'nyq-jitter',
      title: `8. Jitter: the Sampling Error That Has Nothing to Do With Rate`,
      content: `## 8.1 An error in *when*, not in *what*

Every error so far has come from the sampling rate. Jitter is different: the
rate is right, the filter is right, and the clock edges simply do not arrive
when they were supposed to. Call the timing error on edge $n$ by
$\\Delta_{n}$, with zero mean and standard deviation $\\sigma_{t}$. The captured
value is $x(t_{n} + \\Delta_{n})$ instead of $x(t_{n})$, and for the small
$\\Delta_{n}$ of any real clock a first-order expansion is exact enough:

$$e_{n} = x(t_{n} + \\Delta_{n}) - x(t_{n}) \\approx \\frac{dx}{dt}\\bigg|_{t_{n}}\\Delta_{n}$$

The error is the signal's slope times the timing error. Everything about jitter
follows from that one line: a slowly moving signal is barely affected and a
fast-slewing one is punished, regardless of how fast it is being sampled.

## 8.2 The ceiling, derived

For a full-scale sinusoid $x(t) = A\\sin (2\\pi f_{\\mathrm{in}}t)$ the slope is

$$\\frac{dx}{dt} = 2\\pi f_{\\mathrm{in}}A\\cos (2\\pi f_{\\mathrm{in}}t)$$

If the timing error is independent of the signal phase, the mean-square error
factorises, and the mean square of the cosine over a cycle is one half:

$$\\overline{e^{2}} = (2\\pi f_{\\mathrm{in}}A)^{2}\\cdot \\tfrac{1}{2}\\cdot \\sigma_{t}^{2}$$

The signal's own mean square is $A^{2}/2$, so the amplitudes cancel entirely:

$$\\mathrm{SNR}_{\\mathrm{jitter}} = \\frac{A^{2}/2}{(2\\pi f_{\\mathrm{in}}A)^{2}\\sigma_{t}^{2}/2} = \\frac{1}{(2\\pi f_{\\mathrm{in}}\\sigma_{t})^{2}}$$

$$\\mathrm{SNR}_{\\mathrm{jitter}} = -20\\log_{10}\\!\\left(2\\pi f_{\\mathrm{in}}\\sigma_{t}\\right)\\ \\ \\mathrm{dB}$$

Read the arguments of that logarithm. The sampling rate does not appear.
Jitter is charged against the **input** frequency, so oversampling does not
help, and a converter that behaves perfectly on a 1 kHz input can fail badly on
a 10 MHz input taken with the same clock.

Inverting it gives the clock specification directly:

$$\\sigma_{t,\\max } = \\frac{1}{2\\pi f_{\\mathrm{in}}\\,10^{\\mathrm{SNR}/20}}$$

### Worked example 8A: ten picoseconds on a one-megahertz input

**Given**: $f_{\\mathrm{in}} = 1\\ \\mathrm{MHz}$, clock jitter
$\\sigma_{t} = 10\\ \\mathrm{ps}$ rms.

**Find**: the SNR ceiling and the effective number of bits it corresponds to.

**Substitution**:

$$2\\pi \\times 10^{6} \\times 10^{-11} = 6.2832\\times 10^{-5}$$

$$\\mathrm{SNR} = -20\\log_{10}(6.2832\\times 10^{-5}) = 84.04\\ \\mathrm{dB}$$

**Independent route**: generate two million samples of a 1 MHz sine on a 5 MSa/s
grid, perturb each sample instant by a Gaussian draw of 10 ps, and measure the
ratio of signal power to error power directly. Measured: **84.03 dB**, against
84.04 dB from the derivation — three hundredths of a decibel apart, with the
simulation using no part of the formula.

**Answer**: inverting the resolution relation of Section 6.3,

$$N_{\\mathrm{eff}} = \\frac{84.04 - 1.76}{6.02} = 13.67\\ \\mathrm{bits}$$

so a 16-bit converter fed this clock is a 13.7-bit converter, and paying for
the extra two and a half bits achieves nothing.

![Jitter-limited signal-to-noise ratio against input frequency on logarithmic axes, for clock jitters of one, ten and one hundred picoseconds rms. Simulated measurements at one hundred kilohertz, one megahertz and ten megahertz sit on the derived lines, and horizontal guides mark the ideal signal-to-noise ratios of twelve-bit and sixteen-bit converters.](/courses/fe-ee/figures/sig4-jitter-snr.svg)

**Check**: the markers on the figure are nine independent simulations, three
per jitter value, and the largest departure from the derived line across all of
them is under a quarter of a decibel. Each line falls at 20 dB per decade of
input frequency, which is the direct reading of the logarithm above.

### Worked example 8B: the clock a 16-bit channel actually requires

**Given**: a 16-bit converter whose ideal SQNR is
$6.02 \\times 16 + 1.76 = 98.08\\ \\mathrm{dB}$. The jitter contribution is to
stay at or below that floor.

**Find**: the permitted rms jitter at three input frequencies.

**Substitution**: from the inverted relation,
$10^{98.08/20} = 8.0276\\times 10^{4}$, so at 100 kHz

$$\\sigma_{t,\\max } = \\frac{1}{2\\pi \\times 10^{5}\\times 8.0276\\times 10^{4}} = 1.9853\\times 10^{-11}\\ \\mathrm{s}$$

| converter | ideal SQNR | 100 kHz input | 500 kHz input | 1 MHz input |
|---|---|---|---|---|
| 12 bit | 74.00 dB | 317.6 ps | 63.5 ps | 31.8 ps |
| 14 bit | 86.04 dB | 79.4 ps | 15.9 ps | 7.94 ps |
| 16 bit | 98.08 dB | 19.9 ps | 3.97 ps | 1.99 ps |

**Answer**: 19.9 ps at 100 kHz, falling to 1.99 ps at 1 MHz.

**Check**: read the table across rather than down. Each column is a factor of
four in bits and each row a factor of ten in frequency, and the permitted
jitter falls in exact proportion to frequency along a row — the 20 dB per
decade of the figure, seen in the time domain. Two picoseconds is roughly the
propagation delay of a millimetre of board trace. At the top-right corner of
this table the oscillator, not the comparator array, is the part that sets the
achievable resolution — the observation the companion chapter makes in passing
when it lists jitter among the reasons a real converter falls short of its
ideal effective bits. Sections 8.1 and 8.2 above derive the relation that
remark cites.

## 8.3 Where jitter sits in the error budget

Jitter noise, quantization noise and folded broadband noise are mutually
uncorrelated, so they add in power. Combining the three contributions from
Sections 5, 6 and 8,

$$\\mathrm{SNR}_{\\mathrm{total}}^{-1} = \\mathrm{SNR}_{\\mathrm{quant}}^{-1} + \\mathrm{SNR}_{\\mathrm{jitter}}^{-1} + \\mathrm{SNR}_{\\mathrm{fold}}^{-1}$$

which means the worst term dominates and improving any other one is wasted
effort. That is the practical use of the whole chapter: before specifying a
converter, work out which of the three is largest. A design with an unfiltered
2 MHz front end (16.02 dB of folding penalty, from worked example 5A) does not
need a better clock; it needs a filter.`,
      examTip: `Jitter SNR is −20·log₁₀(2π·f_in·σ_t) and contains no sampling rate. If a question changes f_s and asks what happens to the jitter floor, the answer is nothing. If it changes the input frequency, the floor moves 20 dB per decade.`,
      importantNote: `Aperture jitter inside the converter and phase noise on the clock source enter this expression identically, because both perturb the instant at which the sample is taken. Adding them requires adding their variances, not their rms values: σ_total² = σ_aperture² + σ_clock².`,
    },
    {
      id: 'nyq-rate-change',
      title: `9. Rate Conversion: Throwing Samples Away Is Sampling`,
      content: `## 9.1 The line of code that is a sampler

Nothing in Sections 4 to 8 required an analog-to-digital converter. Any
operation that keeps some samples and discards others is a sampler, obeys the
same criterion at its own output rate, and folds anything above half of that
rate. The dangerous property is that it looks like array indexing:

$$y[m] = x[mM]$$

There is no clock, no filter socket and no analog front end to blame. The new
folding frequency is

$$f_{s}' = \\frac{f_{s}}{M}, \\qquad \\frac{f_{s}'}{2} = \\frac{f_{s}}{2M}$$

and every component of $x$ above $f_{s}/(2M)$ — all of which were perfectly
legitimate before the line executed — folds.

### Worked example 9A: a data-logging routine that moves a bearing tone

**Given**: a vibration recorder capturing at $f_{s} = 25.6\\ \\mathrm{kSa/s}$.
A bearing defect produces a clean tone at 11.0 kHz, well below the original
folding frequency of $25.6/2 = 12.8\\ \\mathrm{kHz}$. To shrink the archive, a
script keeps every eighth sample, giving $f_{s}' = 3.2\\ \\mathrm{kSa/s}$.

**Find**: where the tone appears before and after.

**Method**: transform 25 600 samples of the original record, then transform the
decimated record, and read the peaks. No folding arithmetic.

**Answer**: before, the peak is at **11.0 kHz**. After, the peak is at
**1.4 kHz**. The tone has moved 9.6 kHz down the axis and now sits in the
region where imbalance and misalignment faults live, so the diagnosis changes
from a bearing fault to a shaft fault. Nothing warns the analyst, because the
decimated record is a perfectly ordinary, perfectly plausible file.

![Two stacked spectra on a shared frequency axis. The upper panel is the spectrum of a record sampled at twenty-five point six kilosamples per second showing one line at eleven kilohertz below its twelve point eight kilohertz limit; the lower panel is the same record after keeping every eighth sample, and the line now stands at one point four kilohertz below the new one point six kilohertz limit.](/courses/fe-ee/figures/sig4-decimation-alias.svg)

**Check**: the two panels share an axis so the migration is visible as a
displacement rather than as two unrelated plots. The vertical guides mark the
old and new folding frequencies; the tone was legal against the first and is
not against the second.

## 9.2 How many source frequencies share an output bin

Decimation is many-to-one, and it is worth knowing how many. A component
appearing at output frequency $f_{o}$ in $[0,\\ f_{s}'/2]$ could have come from
any source frequency in the original band $[0,\\ f_{s}/2]$ satisfying

$$f_{\\mathrm{src}} = \\lvert \\pm f_{o} + k f_{s}'\\rvert , \\qquad k = 0, 1, 2, \\dots$$

and counting the members that fall below the original folding frequency gives
exactly $M$ of them. Decimating by eight makes every output bin the sum of
eight source bins.

### Worked example 9B: enumerating the eight

**Given**: $f_{s} = 51.2\\ \\mathrm{kSa/s}$ decimated by $M = 8$ to
$f_{s}' = 6.4\\ \\mathrm{kSa/s}$. An analyst sees a peak at 1.0 kHz.

**Find**: every original frequency that could be responsible.

**Substitution**: taking $\\pm 1.0$ and adding multiples of 6.4 kHz while
staying below $51.2/2 = 25.6\\ \\mathrm{kHz}$ gives 1.0, 5.4, 7.4, 11.8, 13.8,
18.2, 20.2 and 24.6 kHz.

**Answer**: eight candidates, which is $M$. Sampling each one at 6.4 kSa/s and
transforming confirms all eight land on 1.0 kHz.

**Check**: the count is a useful sanity rule. If a decimation stage reduces
the rate by ten and the input was not filtered, every displayed line is the sum
of ten unknown contributions, and reasoning about its height is meaningless.
The same arithmetic governs the noise: decimating unfiltered broadband noise by
$M$ raises the in-band noise density by $10\\log_{10}M$ decibels, which is the
identical mechanism measured in Section 5.1, running now inside the software
rather than at the converter pin.

## 9.3 The filter, and where it must sit

The fix is one filter in one place: a digital low-pass with its stopband in
force at the *new* folding frequency, applied **before** any samples are
discarded.

$$x \\rightarrow \\text{LPF at } f_{s}/(2M) \\rightarrow \\text{keep every } M\\text{th sample} \\rightarrow y$$

Reversing the order accomplishes nothing at all, because after the discard the
folded energy and the wanted energy occupy the same bins.

Going the other way, interpolating by $L$ inserts $L-1$ zeros and creates
images that a low-pass at the original $f_{s}/2$ must remove. A rational
conversion by $L/M$ does both, and the single filter that sits between them
must satisfy whichever constraint is tighter:

$$f_{\\mathrm{cut}} = \\min \\!\\left(\\frac{f_{s}}{2},\\ \\frac{f_{s}'}{2}\\right)$$

### Worked example 9C: studio rate to release rate

**Given**: a 48 kSa/s master to be released at 44.1 kSa/s.

**Find**: the integer ratio, the intermediate rate, and the filter cutoff.

**Substitution**: $44.1/48 = 147/160$ in lowest terms, so $L = 147$ and
$M = 160$. The intermediate rate is $48\\ \\mathrm{kSa/s} \\times 147 = 7056\\ \\mathrm{kSa/s}$,
and the check that the chain is right is

$$48000 \\times 147/160 = 44100$$

**Answer**: interpolate by 147 to 7.056 MSa/s, filter, decimate by 160. The
filter must protect the lower of the two folding frequencies, so
$f_{\\mathrm{cut}} = \\min (24,\\ 22.05) = 22.05\\ \\mathrm{kHz}$.

**Check**: the intermediate rate is never actually materialised in a real
implementation — polyphase decomposition computes only the output samples that
survive — but the cutoff is decided by this picture regardless of how the
arithmetic is arranged. Choosing 24 kHz instead would let content between 22.05
and 24 kHz fold into the top of the released band.`,
      examTip: `Any question containing the words "downsample", "decimate", "keep every Nth sample", "reduce the logging rate" or "resample" is a Nyquist question at the new rate. Compute f_s/(2M) first, then ask which existing components sit above it.`,
      importantNote: `The order of operations is the entire content of multirate design. Filter then discard is correct; discard then filter is a null operation on aliased energy, because by then the folded and the wanted components occupy the same bins and differ by nothing a filter can act on.`,
    },
    {
      id: 'nyq-reading-spectra',
      title: `10. Reading a Sampled Spectrum: Scalloping and the Picket Fence`,
      content: `## 10.1 The DFT does not show you the spectrum

The last two pitfalls do not corrupt the data at all. The record is perfect;
the misreading happens at the display. An $N$-point DFT of a record taken at
$f_{s}$ evaluates the underlying continuous transform at exactly $N$ places,
spaced

$$\\Delta f = \\frac{f_{s}}{N}$$

apart. Between those places it shows nothing. Looking at a spectrum through a
DFT is looking through a picket fence: what lies behind a picket is invisible,
and a tone that happens to sit behind one is measured by its skirts rather than
by its peak.

For a rectangular window the response to a tone offset by $\\delta$ bins from a
bin centre is the Dirichlet kernel

$$D_{N}(\\delta ) = \\frac{\\sin (\\pi \\delta )}{N\\sin (\\pi \\delta /N)}$$

which equals 1 at $\\delta = 0$ and falls to its minimum at $\\delta = 0.5$,
midway between two bins. For large $N$ the denominator linearises and

$$\\lim_{N\\to \\infty }D_{N}(0.5) = \\frac{1}{\\pi /2} = \\frac{2}{\\pi } = 0.63662$$

$$L_{\\mathrm{scallop}} = 20\\log_{10}(2/\\pi ) = -3.92\\ \\mathrm{dB}$$

**Scalloping loss**: up to 3.92 dB of amplitude simply missing, decided by
where the tone happens to sit relative to the bin grid, on a record with no
aliasing, no noise and no jitter in it.

### Worked example 10A: measuring the worst case

**Given**: $N = 1024$, a unit-amplitude tone placed at bin 102.5 — exactly
between two bins.

**Find**: the amplitude the DFT reports.

**Method**: build the record, transform, read the tallest bin, scale by
$2/N$ for a real signal.

**Answer**: **0.638 V** for a 1.000 V tone, a shortfall of 3.92 dB. Moving the
same tone to bin 102.0 returns 1.000 V exactly.

![The magnitude response around a sixty-four-point discrete Fourier transform for two unit-amplitude tones, one sitting exactly on bin sixteen and one sitting halfway between bins sixteen and seventeen. The continuous interpolated curve is drawn through the discrete bin samples, and the half-bin tone's tallest sample reaches only zero point six three eight where the on-bin tone reaches one.](/courses/fe-ee/figures/sig4-scalloping.svg)

**Check**: the figure draws both the continuum and the bins. The half-bin tone
has just as much energy as the on-bin tone — the areas under the two curves are
the same — but the bin grid never lands on its peak, so no single reading
recovers it.

## 10.2 The frequency is wrong too

The same picket fence limits how precisely a peak can be located. A tone
midway between bins produces two equal tallest bins, and picking either commits
an error of half a bin:

$$\\Delta f_{\\mathrm{read}} = \\pm \\frac{f_{s}}{2N}$$

### Worked example 10B: how far off can the reported frequency be?

**Given**: $f_{s} = 10\\ \\mathrm{kSa/s}$ and $N = 1024$.

**Substitution**: the bin spacing is
$10000/1024 = 9.7656\\ \\mathrm{Hz}$ and half of it is
$10000/2048 = 4.8828\\ \\mathrm{Hz}$.

**Answer**: any reported peak frequency carries $\\pm 4.88\\ \\mathrm{Hz}$ of
quantization from the grid alone, before any consideration of noise.

**Check**: this is a display limit, not a resolution limit, and the two are
routinely confused. Resolution — the ability to separate two nearby tones — is
set by the record length $N/f_{s}$ and cannot be improved by any amount of
post-processing. Grid coarseness can be improved: appending zeros to the record
before transforming evaluates the same continuous transform at more places.

## 10.3 Two fixes, and what each one actually fixes

**Zero-padding** interpolates the display. Padding a 1024-point record to 4096
points quarters the grid spacing, so the worst offset from a computed point
falls from half a bin to an eighth of a bin, and the worst-case loss falls to

$$20\\log_{10}\\!\\left[\\frac{\\sin (\\pi /8)}{\\pi /8}\\right] = -0.22\\ \\mathrm{dB}$$

Measured on the bin-102.375 case, a tone that reads 0.784 V unpadded reads
**0.974 V** after fourfold padding. What has not changed is the ability to
separate two close tones; padding adds display points, not information.

**Windowing** flattens the response between bins at the cost of widening it.
Sweeping a tone across a bin in 501 steps and recording the worst reading for
each window gives:

| window | worst-case scalloping loss, measured | coherent gain |
|---|---|---|
| rectangular | −3.92 dB | 1.000 |
| Hann | −1.42 dB | 0.500 |
| Hamming | −1.75 dB | 0.540 |
| Blackman | −1.10 dB | 0.420 |
| flat-top | −0.01 dB | 0.216 |

Every figure in the middle column is measured from a DFT sweep, not quoted.
The flat-top window exists for exactly this purpose: its worst-case amplitude
error is a hundredth of a decibel, which is why calibration instruments use it
and why its very wide main lobe — which ruins resolution — is an acceptable
price when the task is to measure one tone's amplitude accurately.

### Worked example 10C: reading a Hann-windowed peak correctly

**Given**: the bin-102.5 tone of worked example 10A, now windowed with a Hann
window before transforming.

**Find**: the amplitude reported, and the correction needed.

**Substitution**: the window's coherent gain is 0.500, so the raw peak must be
divided by $0.500N/2$ rather than $N/2$. Doing that, the reported amplitude is
**0.849 V**.

**Answer**: 0.849 V against a true 1.000 V, a shortfall of 1.42 dB — down from
3.92 dB, exactly as the table predicts.

**Check**: forgetting the coherent-gain correction is its own error, and a
large one: without it the Hann-windowed reading would be 0.424 V, understating
the tone by 7.4 dB. Two separate corrections are in play — coherent gain, which
is deterministic and always applies, and scalloping, which depends on where the
tone sits and can only be bounded.`,
      examTip: `Amplitude read off a DFT bin is a lower bound on the true amplitude, short by up to 3.92 dB with a rectangular window. If a question gives a measured bin height and asks for the tone's amplitude, check whether it also gives a window — and remember the height must be divided by the window's coherent gain before anything else is done to it.`,
      importantNote: `Zero-padding and record length do different jobs. Padding refines the frequency grid, which reduces scalloping loss and improves peak location; only a longer record improves the ability to resolve two nearby tones. A spectrum that looks smoother after padding contains no more information than it did before.`,
    },
    {
      id: 'nyq-scope',
      title: `11. Oscilloscope Aliasing, and Why the Slow Sweep Lies`,
      content: `## 11.1 A scope's sampling rate is not the number on the box

A digital oscilloscope advertises a maximum sampling rate, and that number is
achieved only at the fastest timebases. The instrument has a fixed acquisition
memory of $N_{\\mathrm{mem}}$ points and must cover the whole screen, which for
a ten-division display spans $10 T_{\\mathrm{div}}$ seconds. The rate it can
actually use is therefore

$$f_{\\mathrm{eff}} = \\min \\!\\left(f_{s,\\max },\\ \\frac{N_{\\mathrm{mem}}}{10\\,T_{\\mathrm{div}}}\\right)$$

and beyond the timebase where the second term takes over, every further click
of the knob halves or tenths the effective sampling rate. The analog front end
does not move: its bandwidth is still hundreds of megahertz, so it is still
delivering everything to the sampler. There is no anti-alias filter that tracks
the timebase, because such a filter would have to be analog, tunable over five
decades and switched in step with a front-panel control.

The result is that the same instrument, on the same signal, tells the truth at
one timebase and lies at another.

### Worked example 11A: a switching ripple that disappears and reappears

**Given**: a scope with $f_{s,\\max } = 1\\ \\mathrm{GSa/s}$ and
$N_{\\mathrm{mem}} = 10\\ \\mathrm{kpts}$, looking at a supply rail carrying a
1.203 MHz switching ripple.

**Find**: the effective sampling rate and the apparent ripple frequency at
1 ms/div and at 10 ms/div.

**Substitution**: at 1 ms/div the screen spans 10 ms, so
$f_{\\mathrm{eff}} = 10\\,000/0.01 = 1\\ \\mathrm{MSa/s}$; at 10 ms/div the
screen spans 100 ms and $f_{\\mathrm{eff}} = 10\\,000/0.1 = 100\\ \\mathrm{kSa/s}$.

**Method**: sample the 1.203 MHz ripple at 100 kSa/s and transform.

**Answer**: at 100 kSa/s the ripple is displayed at **3 kHz** — a slow, fat
wobble roughly four hundred times too slow, which looks exactly like a control
loop instability. Neither the amplitude nor the shape gives it away, because
the sample values are genuine measurements of the real waveform; only their
spacing is wrong.

**Check**: nudge the ripple to 1.200 MHz and sample at 100 kSa/s again. The
transform now puts it at **0 Hz**: the ripple vanishes entirely into a dc
offset, and the trace is a flat line on a rail that is visibly rippling on a
voltmeter's ac range. Both readings come from transforming actual sample
sequences, and both are what the instrument would show.

![Effective oscilloscope sampling rate against timebase on logarithmic axes, for ten-kilopoint and one-megapoint acquisition memories, both capped at one gigasample per second. A horizontal guide marks the two point four megasample per second rate needed to capture a one point two zero three megahertz ripple honestly, and the region below it is shaded as the range of timebases at which the captured waveform is fiction.](/courses/fe-ee/figures/sig4-scope-rate.svg)

**Interpretation of the figure**: each trace is flat at the instrument maximum
until memory runs out, then falls at one decade per decade. The shaded region
is the set of timebase settings at which this particular ripple cannot be
captured honestly. Deeper memory moves the corner right — a megapoint of memory
buys two more decades of trustworthy timebase — which is the whole engineering
argument for acquisition memory, stated in one picture.

## 11.2 What the instrument offers instead

Three features exist because of this, and knowing which one is engaged decides
whether a trace can be believed.

- **Peak detect.** Instead of keeping one sample per decimated interval, the
  acquisition hardware keeps the minimum and maximum found at the full rate.
  The displayed waveshape is still wrong, but the envelope is right, so a fast
  transient that plain decimation would drop entirely shows up as a vertical
  band. Peak detect is a detector of the fact that something is there, not a
  measurement of what it is.
- **High resolution.** The decimated sample is replaced by the *average* over
  the interval, which is a genuine low-pass filter ahead of the effective
  sampler and does suppress folding. It costs bandwidth, which is the point.
- **Equivalent-time sampling.** For a repetitive signal the instrument builds
  one composite record from many triggers, each offset by a fraction of a
  sample period. The effective grid is far finer than the real clock, and a
  100 MSa/s converter can render a 2 GHz sine faithfully. This does not violate
  anything: the composite record genuinely has fine spacing, and the criterion
  is met at that spacing. It fails silently on any signal that is not
  repetitive, which is why single-shot capture always runs in real time.

### Worked example 11B: choosing a timebase that cannot lie

**Given**: the same 10 kpt instrument, looking for anything up to 5 MHz.

**Find**: the slowest timebase that keeps the effective folding frequency above
5 MHz.

**Substitution**: the requirement is $f_{\\mathrm{eff}} > 10\\ \\mathrm{MSa/s}$,
so from the relation above
$T_{\\mathrm{div}} < 10\\,000/(10 \\times 10\\,000\\,000) = 10^{-4}\\ \\mathrm{s}$.

**Answer**: 100 µs/div, and anything slower is unsafe on this signal.

**Check**: the practical procedure needs no arithmetic. Change the timebase and
watch the displayed frequency. A real signal keeps its frequency and simply
shows more or fewer cycles; an aliased one changes frequency, because its
apparent frequency depends on $f_{\\mathrm{eff}}$ and $f_{\\mathrm{eff}}$ just
changed. That two-second test catches every case in this section.`,
      examTip: `Effective scope sampling rate is memory divided by screen time, capped at the instrument maximum. A question that gives memory depth and time per division is asking you to compute it, then treat the scope as an ADC at that rate. The advertised maximum rate is irrelevant at slow timebases.`,
      importantNote: `Equivalent-time sampling does not beat the sampling theorem; it changes the effective sample spacing by combining many triggers. It is valid only for repetitive signals, and applying it to a one-shot event yields a composite of unrelated fragments that looks like a waveform and is not one.`,
    },
    {
      id: 'nyq-problems-a',
      title: `12. Problem Set A — Does This System Alias, and Where Does It Land?`,
      content: `## 12.1 Problem Set A: six systems, one question each

Each item states a complete system. Decide first whether anything folds, then
where it lands, then whether landing there matters. Every answer below was
obtained by sampling the stated waveform and transforming the samples, so the
figures can be reproduced without trusting any formula.

---

**A1.** A bridge amplifier carries genuine content from dc to 2 kHz and is
sampled at 10 kSa/s with no anti-alias filter. A dc-dc converter on the same
board switches at 47 kHz and couples into the cable. (a) Where does the
switching tone appear? (b) Does it damage the measurement? (c) A power-saving
change drops the rate to 9 kSa/s. Does the answer change?

*Answer.* (a) At 10 kSa/s the tone appears at **3 kHz**. (b) The wanted
band ends at 2 kHz and half the sampling rate is $10/2 = 5\\ \\mathrm{kHz}$, so
3 kHz lands in the guard band $(2,\\ 5)\\ \\mathrm{kHz}$; a digital low-pass at
2 kHz removes it and the measurement survives. (c) At 9 kSa/s the same tone
appears at **2 kHz**, exactly on the top edge of the wanted band, where no
digital filter can separate it from real strain. The rate change made a
harmless coupling path into a fatal one, and nothing on the schematic
changed.

---

**A2.** A 48 kSa/s audio channel carries content to 20 kHz. An ultrasonic
proximity sensor nearby radiates a 25 kHz pilot tone that reaches the input.
(a) Where does the pilot land? (b) A later processing stage decimates the
record by two to 24 kSa/s with no filter. Where is the pilot now?

*Answer.* (a) At **23 kHz** — above the 20 kHz wanted band but below the
$48/2 = 24\\ \\mathrm{kHz}$ folding frequency, so it sits in the guard band
and is still removable. (b) After the unfiltered decimation the folding
frequency is $24/2 = 12\\ \\mathrm{kHz}$ and the 23 kHz component reappears at
**1 kHz**, in the middle of the wanted audio band and permanent. The
converter's anti-alias filter did its job; the software stage undid it.

---

**A3.** A software radio digitizes the whole FM broadcast band, 88 MHz to
108 MHz, by bandpass sampling. A designer proposes 50 MSa/s on the grounds that
it comfortably exceeds $2B = 40\\ \\mathrm{MSa/s}$. (a) Is 50 MSa/s permitted?
(b) Demonstrate the failure with two carriers. (c) Propose a rate that works.

*Answer.* (a) No. With $B = 108 - 88 = 20\\ \\mathrm{MHz}$,
$\\lfloor 108/20\\rfloor = 5$, and the permitted intervals are 43.2 to 44,
54 to 58.667, 72 to 88, 108 to 176, and 216 upward, all in MSa/s. The value
50 falls in the forbidden gap between 44 and 54. (b) At 50 MSa/s, carriers at
95 MHz and 105 MHz **both appear at 5 MHz**. (c) 43.5 MSa/s lies inside the
$n = 5$ interval; there the band edges land at 1 MHz and 21 MHz, a span of
$21 - 1 = 20\\ \\mathrm{MHz}$ exactly equal to $B$, with 95 MHz at 8 MHz and
105 MHz at 18 MHz — distinct and correctly ordered.

---

**A4.** An 8 kSa/s converter is fed a 4 kHz sinusoid of 2 V amplitude. The
clock happens to be phase-locked so that samples fall on the waveform's zero
crossings. What does the record contain, and what can be recovered?

*Answer.* The record contains **zeros**. The tone sits exactly at
$8/2 = 4\\ \\mathrm{kHz}$, so the sample sequence reduces to
$2(-1)^{n}\\cos \\varphi$ and this phase makes $\\cos \\varphi = 0$. Amplitude
is not recoverable at any phase without prior knowledge of the phase, because
the sampled sequence has one free parameter where the waveform had two. This
is the equality case of Section 4.2, and it is why the criterion is written
with a strict inequality.

---

**A5.** An oscilloscope specified at 200 MSa/s with 20 kpts of acquisition
memory is set to 5 ms/div. A circuit under test oscillates at 2.35 MHz.
(a) What is the effective sampling rate? (b) What appears on screen?

*Answer.* (a) The screen spans $10 \\times 5 = 50\\ \\mathrm{ms}$, so
$f_{\\mathrm{eff}} = 20000/0.05 = 400\\ \\mathrm{kSa/s}$ — a factor of 500
below the number on the front panel. (b) The oscillation is displayed at
**50 kHz**, and it is stable, repeatable and completely wrong. Speeding the
timebase up until the displayed frequency stops changing is the field test.

---

**A6.** A 14-bit converter is used at an input frequency of 500 kHz. What rms
clock jitter keeps the jitter noise at or below the converter's own
quantization floor?

*Answer.* The ideal SQNR is
$6.02 \\times 14 + 1.76 = 86.04\\ \\mathrm{dB}$, so
$10^{86.04/20} = 2.0045\\times 10^{4}$ and

$$\\sigma_{t,\\max } = \\frac{1}{2\\pi \\times 5\\times 10^{5}\\times 2.0045\\times 10^{4}} = 1.588\\times 10^{-11}\\ \\mathrm{s}$$

or **15.9 ps rms**. Note that the sampling rate was never used, and could not
have been: jitter is charged against the input frequency alone.

## 12.2 The six at a glance

| item | what folds | lands at | verdict |
|---|---|---|---|
| A1 at 10 kSa/s | 47 kHz supply tone | 3 kHz | guard band, removable |
| A1 at 9 kSa/s | 47 kHz supply tone | 2 kHz | in band, permanent |
| A2 at the converter | 25 kHz pilot | 23 kHz | guard band, removable |
| A2 after decimating | 23 kHz pilot | 1 kHz | in band, permanent |
| A3 at 50 MSa/s | 95 and 105 MHz | both 5 MHz | forbidden zone, collision |
| A3 at 43.5 MSa/s | 95 and 105 MHz | 8 and 18 MHz | permitted, clean |
| A4 | nothing folds | — | equality case, rank collapse |
| A5 | 2.35 MHz oscillation | 50 kHz | scope memory limit |
| A6 | no folding at all | — | jitter, 15.9 ps budget |

Read the verdict column and the structure of the whole chapter is visible: two
of these failures are prevented by an analog filter, two by a different clock
rate, one by a different processing order, and one is not a folding problem at
all.`,
      examTip: `Work every aliasing question in three steps and never skip the third: where is the folding frequency, where does the component land, and is that inside the band you care about or in the guard band above it. The guard band between f_p and f_s/2 is the difference between a nuisance and a ruined measurement.`,
    },
    {
      id: 'nyq-problems-b',
      title: `13. Problem Set B — Specifications, Rates and Bands`,
      content: `## 13.1 Problem Set B: five design decisions

These items ask for a number a vendor could be held to, rather than a
classification. Each states its givens completely.

---

**B1.** A process-monitoring channel carries content to $f_{p} = 5\\ \\mathrm{kHz}$
and drives a 12-bit converter at $f_{s} = 40\\ \\mathrm{kSa/s}$. Folded energy is
to arrive below the converter's own quantization floor. Specify a Butterworth
anti-alias filter.

*Answer.* The required stopband attenuation is the converter's ideal SQNR,
$6.02 \\times 12 + 1.76 = 74.00\\ \\mathrm{dB}$. The critical frequency is
$f_{s} - f_{p} = 40 - 5 = 35\\ \\mathrm{kHz}$, giving a stopband-to-corner
ratio of $35/5 = 7$ if the corner is placed at the passband edge. From
$A = 10\\log_{10}[1 + r^{2n}]$,

$$n \\ge \\frac{74.00}{20\\log_{10}7} = \\frac{74.00}{16.90196} = 4.378$$

so **order 5**. Checking the two candidates at 35 kHz: order 4 gives
67.61 dB, short of the requirement, and order 5 gives 84.51 dB, comfortably
over. An independent filter-order routine given 5 kHz, 35 kHz, 0.5 dB and
74 dB also returns order 5.

---

**B2.** The same channel, the same converter, but the clock is reduced to
$f_{s} = 12.5\\ \\mathrm{kSa/s}$ to cut power. Re-specify.

*Answer.* The critical frequency drops to
$12.5 - 5 = 7.5\\ \\mathrm{kHz}$ and the ratio to $7.5/5 = 1.5$, so

$$n \\ge \\frac{74.00}{20\\log_{10}1.5} = \\frac{74.00}{3.52183} = 21.012$$

**order 22** — checking, order 21 gives 73.96 dB, a whisker short of 74, and
order 22 gives 77.48 dB. A 22nd-order analog filter is not a thing anyone
builds, so the honest answer to the design request is that this sampling rate
is not viable with this passband; either raise the clock or accept less alias
rejection. Cutting the rate by a factor of 3.2 multiplied the required order
by 4.4.

---

**B3.** A channel has a wanted band to 8 kHz and is sampled at 20 kSa/s.
(a) How wide is the guard band? (b) Which is the lowest input frequency able to
reach the wanted band? (c) Classify interferers at 11 kHz and at 13 kHz.

*Answer.* (a) The folding frequency is $20/2 = 10\\ \\mathrm{kHz}$ and the
guard band runs from 8 kHz to 10 kHz, so it is $10 - 8 = 2\\ \\mathrm{kHz}$
wide. (b) $f_{s} - f_{p} = 20 - 8 = 12\\ \\mathrm{kHz}$. (c) The 11 kHz
interferer lands at **9 kHz**, inside the guard band, so a digital low-pass
at 8 kHz deletes it. The 13 kHz interferer lands at **7 kHz**, inside the
wanted band, and is permanent. Both were located by sampling and
transforming. Note that 11 kHz is above the folding frequency and still
harmless — being above $f_{s}/2$ is not by itself a fault.

---

**B4.** A receiver bandpass-samples the 2.4 to 2.5 GHz band. (a) What is the
largest usable replica index? (b) Give the permitted interval for $n = 24$ and
the clock accuracy it demands. (c) Comment on the $n = 25$ case.

*Answer.* (a) $B = 100\\ \\mathrm{MHz}$ and
$\\lfloor 2500/100\\rfloor = 25$. (b) For $n = 24$ the interval runs from
$2 \\times 2500/24 = 208.333\\ \\mathrm{MSa/s}$ to
$2 \\times 2400/23 = 208.696\\ \\mathrm{MSa/s}$, a fractional width of
$(208.696 - 208.333)/208.333 = 0.0017391$, or **0.174%** — tighter than an
ordinary crystal's tolerance over temperature. (c) At $n = 25$ both limits
equal 200 MSa/s exactly, so the permitted set is a single point and the
design has zero clock tolerance. Practical undersampling receivers therefore
use small $n$, accepting a higher sampling rate in exchange for a window wide
enough to hold.

---

**B5.** A 16-bit converter runs at 1 MHz input frequency behind an amplifier
whose noise bandwidth is 2 MHz, with no anti-alias filter, clocked by an
oscillator with 5 ps rms jitter. (a) What jitter would the converter's
resolution demand? (b) Which of the three error mechanisms in this chapter
dominates? (c) What should be fixed first?

*Answer.* (a) With
$6.02 \\times 16 + 1.76 = 98.08\\ \\mathrm{dB}$ to protect,
$\\sigma_{t,\\max } = 1.99\\ \\mathrm{ps}$ at 1 MHz, so the 5 ps oscillator
falls short. Its actual ceiling is
$-20\\log_{10}(2\\pi \\times 10^{6}\\times 5\\times 10^{-12}) = 90.05\\ \\mathrm{dB}$,
costing 8.03 dB. (b) The unfiltered front end costs
$10\\log_{10}(2\\,000\\,000/500\\,000) = 6.02\\ \\mathrm{dB}$ if the converter runs
at 1 MSa/s — but at a realistic 2.5 MSa/s for a 1 MHz input the folding
factor is $2\\,000\\,000/1\\,250\\,000 = 1.6$, worth 2.04 dB. So **jitter
dominates** here, at 8.03 dB against 2.04 dB. (c) The clock. This is the
point of computing all three: the intuition that "no anti-alias filter" is
always the biggest problem is wrong in this particular system, and only the
arithmetic settles it.

## 13.2 The specification pattern, in one table

| quantity wanted | expression | where it comes from |
|---|---|---|
| stopband attenuation | $6.02N + 1.76$ dB | the converter's own quantization floor |
| stopband edge | $f_{s} - f_{p}$ | lowest input that folds into the wanted band |
| guard band width | $f_{s}/2 - f_{p}$ | bought with sampling rate |
| Butterworth order | $A/(20\\log_{10}r)$, $r = f_{\\mathrm{crit}}/f_{c}$ | the magnitude expression, solved for $n$ |
| jitter budget | $1/(2\\pi f_{\\mathrm{in}}10^{\\mathrm{SNR}/20})$ | slope times timing error |
| permitted sampling rates | $2f_{H}/n \\le f_{s} \\le 2f_{L}/(n-1)$ | replicas not overlapping |

Every row is derived somewhere in Sections 6 to 8; none of them is a rule of
thumb.`,
      examTip: `When a problem gives converter resolution and asks for an anti-alias specification, the resolution is telling you the required stopband attenuation through 6.02N + 1.76. When it gives a sampling rate and a passband edge, their difference is telling you the stopband edge. Those two substitutions turn almost every filter-specification question into one order calculation.`,
      importantNote: `Compute all three error contributions — folding, jitter and quantization — before improving any of them. Problem B5 is a system where the missing anti-alias filter is the smaller problem, and spending the budget on a filter there would buy 2 dB while an 8 dB defect sat untouched.`,
    },
    {
      id: 'nyq-problems-c',
      title: `14. Practice Problems — Reading a Sampled Spectrum`,
      content: `## 14.1 Practice Problems: what the display is not telling you

These five items concern records that are entirely correct. Every failure below
happens in the reading.

---

**C1.** A 1.000 V amplitude tone is transformed with a 1024-point rectangular
window and happens to sit exactly midway between two bins. What amplitude does
the tallest bin report, and what is the error in decibels?

*Answer.* **0.638 V**, an error of
$20\\log_{10}(0.63662) = -3.92\\ \\mathrm{dB}$. This is the worst case for a
rectangular window and follows from the Dirichlet kernel evaluated at half a
bin, which tends to $2/\\pi$ for large $N$. Moving the same tone onto a bin
centre returns 1.000 V exactly, so the 3.92 dB is a property of the
alignment, not of the signal.

---

**C2.** The same transform is taken at $f_{s} = 10\\ \\mathrm{kSa/s}$ with
$N = 1024$. (a) What is the bin spacing? (b) What is the worst error in a
reported peak frequency? (c) Can more processing improve (b)?

*Answer.* (a) $10000/1024 = 9.7656\\ \\mathrm{Hz}$. (b) Half a bin, so
$10000/2048 = 4.8828\\ \\mathrm{Hz}$, since a tone midway between bins produces
two equally tall bins and either could be reported. (c) Yes — zero-padding
refines the grid and improves peak location. What it cannot improve is the
ability to resolve two tones closer together than about one bin, which is set
by the record length $1024/10000 = 0.1024\\ \\mathrm{s}$ and by nothing else.

---

**C3.** A tone reads 0.784 V on an unpadded 1024-point transform. The record is
zero-padded to 4096 points and transformed again. (a) What does it read now?
(b) What is the worst-case scalloping loss after fourfold padding? (c) Has the
resolution improved?

*Answer.* (a) **0.974 V**. (b) Padding by four quarters the grid spacing,
so the largest offset between a tone and the nearest computed point falls to
an eighth of a bin, and the worst loss becomes
$20\\log_{10}[\\sin (\\pi /8)/(\\pi /8)] = -0.22\\ \\mathrm{dB}$. (c) No. The
transform is being evaluated at more points on the same underlying curve, and
that curve was fixed the moment the record ended.

---

**C4.** The bin-102.5 tone of C1 is windowed with a Hann window before
transforming. (a) What is the reported amplitude with the coherent-gain
correction applied? (b) What is reported if the correction is forgotten?

*Answer.* (a) **0.849 V**, an error of −1.42 dB, which is the Hann
window's worst-case scalloping loss and a substantial improvement on the
rectangular window's 3.92 dB. (b) The Hann window's coherent gain is 0.500,
so omitting the correction halves the reading to **0.424 V**, an error of
−7.44 dB. Two independent corrections are in play, and the deterministic one
is the larger.

---

**C5.** A spectrum computed from a 10 kSa/s record shows a single peak at
2 kHz. Name three input frequencies, other than 2 kHz, that would produce
exactly this display, and state what measurement would distinguish them.

*Answer.* **12 kHz, 18 kHz and 22 kHz** all land on 2 kHz at this sampling
rate, as does 8 kHz; the family is $\\lvert \\pm 2 + 10k\\rvert$ kHz for
integer $k$. No processing of this record distinguishes them, because the
record is numerically identical in every case. The distinguishing measurement
has to happen upstream: sample the same signal again at a different rate and
see whether the peak moves. A genuine 2 kHz tone stays at 2 kHz; an alias
jumps.

## 14.2 Window choice, measured rather than quoted

| window | worst-case scalloping loss | coherent gain | use it when |
|---|---|---|---|
| rectangular | −3.92 dB | 1.000 | the tone is known to be on a bin |
| Hann | −1.42 dB | 0.500 | general-purpose spectral survey |
| Hamming | −1.75 dB | 0.540 | general purpose, narrower main lobe |
| Blackman | −1.10 dB | 0.420 | high dynamic range needed |
| flat-top | −0.01 dB | 0.216 | amplitude calibration of one tone |

Each loss figure was obtained by sweeping a tone across one bin in 501 steps
and recording the smallest peak reading. Reading down the first column shows
the trade the whole table exists to make: the flat-top window is nearly perfect
for amplitude and nearly useless for resolution, and the rectangular window is
the reverse.`,
      examTip: `A peak height read off a DFT bin understates the tone unless the tone happens to be bin-centred. With a rectangular window the understatement can reach 3.92 dB; with a Hann window, 1.42 dB. If a question asks for a tone's amplitude from a bin height, check for a window and divide by its coherent gain first.`,
      importantNote: `Nothing in Section 14 involves aliasing, yet every item is a place where a correct record is read incorrectly. Keep the two apart: aliasing destroys information before the record exists, while scalloping and the picket fence merely obscure information that the record still holds.`,
    },
  ],
  keyTakeaways: [
    'Nyquist criterion: f_s > 2·f_max (strict). Nyquist frequency = f_s/2.',
    'Aliasing maps frequency f > f_s/2 to f_alias = |f - n·f_s| in [0, f_s/2]. Cannot be undone.',
    'Anti-aliasing filter (analog LP) goes BEFORE the sampler; reconstruction filter goes AFTER the DAC. Both are pinned by TWO frequencies: passband edge f_p and stopband edge f_s − f_p. Never "cutoff at f_s/2" — at the corner the attenuation is 3.01 dB whatever the order.',
    'Real filters have transition bands — oversample beyond 2·f_max to allow filter rolloff (CD samples at 44.1 kHz for 20 kHz audio)',
    'Higher-order analog filters have steeper rolloff: N-th order = 20·N dB/decade',
    'Modern systems oversample heavily and use digital decimation — easier than designing sharp analog filters',
    'Bandpass sampling: the permitted rates are the intervals 2·f_H/n ≤ f_s ≤ 2·f_L/(n−1) for 1 ≤ n ≤ floor(f_H/B). They are disconnected, so raising f_s can break a working design, and f_s = 2B is reachable only when f_H/B is an integer.',
    'Sampling exactly AT the Nyquist rate is a different case, not a marginal one: the samples collapse to A·(−1)ⁿ·cos φ, so amplitude depends entirely on phase and at φ = 90° the record is all zeros.',
    'Required stopband attenuation comes from the converter, not from taste: 6.02N + 1.76 dB, the same expression as its ideal SQNR.',
    'Broadband front-end noise folds. The SNR penalty is 10·log₁₀(B_n / (f_s/2)) using the EQUIVALENT NOISE bandwidth, which for one pole is π/2 times the −3 dB bandwidth.',
    'Jitter SNR is −20·log₁₀(2π·f_in·σ_t) and contains no sampling rate. It is charged against the INPUT frequency, so oversampling does not help it.',
    'Decimation is sampling. Filtering must precede the discard, and after decimating by M each output bin is the sum of M source bins.',
    'A DFT bin height understates a tone by up to 3.92 dB (rectangular window) purely from where the tone sits between bins. Zero-padding reduces that; only a longer record improves resolution.',
    'A scope\'s effective rate is memory ÷ screen time, capped at its maximum. At slow timebases it is orders of magnitude below the front-panel number, with no anti-alias filter tracking the knob.',
  ],
},

};
