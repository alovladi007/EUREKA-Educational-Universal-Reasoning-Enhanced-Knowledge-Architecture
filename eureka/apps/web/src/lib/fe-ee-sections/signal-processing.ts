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
**$x(t) = a_{0} + \\Sigma a_{n}\\cdot \\cos (n\\omega _{0}t) + \\Sigma b_{n}\\cdot \\sin (n\\omega _{0}t)$**

where ω₀ = 2πf₀ and:
- **$a_{0} = (1/T_{0}) \\int x(t) dt$** (DC component / average value)
- **$a_{n} = (2/T_{0}) \\int x(t)\\cdot \\cos (n\\omega _{0}t) dt$**
- **$b_{n} = (2/T_{0}) \\int x(t)\\cdot \\sin (n\\omega _{0}t) dt$**

**Complex exponential form** (more compact):
**$x(t) = \\Sigma c_{n} \\cdot e^{j2\\pi nf_{0}t}$**

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
| **Coefficients** | cₙ (dimensionless or V) | $X(f) (V/Hz or V\\cdot s)$ |
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
$x(t) = A_{0} + \\Sigma A_{n}\\cos (n\\omega _{0}t + \\phi _{n})$. Expand one term with
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
| Trigonometric | $a_{0} + \\Sigma [a_{n}\\cos + b_{n}\\sin ]$ | $n \\ge 1$, one-sided | hand integration, symmetry arguments |
| Amplitude-phase | $A_{0} + \\Sigma A_{n}\\cos (n\\omega _{0}t + \\phi _{n})$ | $n \\ge 1$, one-sided | reading a measured spectrum analyser trace |
| Complex exponential | $\\Sigma c_{n}e^{jn\\omega _{0}t}$ | all integers $n$, two-sided | algebra, filtering, and the leap to the transform |

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
| $\\Sigma \\delta (t - kT)$ | $(1/T)\\Sigma \\delta (f - k/T)$ | sampling itself |

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

**$X_{s}(f) = (1/T)\\cdot \\Sigma X(f - k\\cdot f_{s})$** over all integers k

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

**First-order LP:** **$H(s) = \\omega c / (s + \\omega c)$**

**Second-order Butterworth LP:** **$H(s) = \\omega c^{2} / (s^{2} + \\sqrt{2}\\cdot \\omega c\\cdot s + \\omega c^{2})$**

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

**$|H(j\\omega c)| = 1/\\sqrt{2} \\approx -3\\ \\mathrm{dB}$**`,
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

**Substitution**: the numerator bracket is $(10^{3}-1)/(10^{0.1}-1) = 999/0.2589 = 3859$,
whose log is 3.587. The denominator is $2\\cdot \\log_{10}(2) = 0.602$.

$$n \\ge 3.587/0.602 = 5.96$$

**Answer**: round up — a **6th-order Butterworth**. Orders always round up:
5.96 means fifth order misses the stopband spec by a fraction of a dB, and a
filter that almost meets its specification does not meet it.

**Closing the design — where does the cutoff actually go?** The order formula
pinned the passband edge, so the −3 dB cutoff is *not* at 1 kHz. Solving the
Butterworth magnitude for the frequency where attenuation equals 1 dB with
n = 6 gives

$$f_{c} = f_{p}/(10^{A_{p}/10}-1)^{1/2n} = 1\\ \\mathrm{kHz}/(0.2589)^{1/12} = 1.119\\ \\mathrm{kHz}$$

Verify the stopband with that cutoff: the ratio 2/1.119 = 1.787, and
$10\\cdot \\log_{10}[1 + (1.787)^{12}] = 30.3\\ \\mathrm{dB}$ — the 30 dB
requirement met with a small margin, which is exactly what rounding the order
up purchased. This verification step — recompute both band edges after
choosing n — is the difference between an order calculation and a finished
design.

## 4.3 Chebyshev order, same specification

**Handbook relation**: the Chebyshev version replaces the logarithm with the
inverse hyperbolic cosine,

$$n \\ge \\frac{\\cosh^{-1}\\sqrt{(10^{A_{s}/10}-1)/(10^{A_{p}/10}-1)}}{\\cosh^{-1}(f_{st}/f_{p})}$$

**Substitution**: $\\cosh^{-1}\\sqrt{3859} = \\cosh^{-1}(62.1) = 4.82$, and
$\\cosh^{-1}(2) = 1.317$.

$$n \\ge 4.82/1.317 = 3.66$$

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

**$X[k] = \\Sigma (n=0 to N-1) x[n] \\cdot e^{-j2\\pi kn/N}$** for k = 0, 1, ..., N−1

**Inverse DFT:**
**$x[n] = (1/N) \\Sigma (k=0 to N-1) X[k] \\cdot e^{j2\\pi kn/N}$**

### Frequency Bin Interpretation

| Parameter | Formula | Meaning |
|---|---|---|
| **Frequency of bin k** | $f_{k} = k \\cdot f_{s}/N$ | Center frequency of bin k |
| **Frequency resolution** | $\\Delta f = f_{s}/N$ | Smallest distinguishable frequency difference |
| **Bin 0** | $f_{0} = 0 (DC)$ | Average value of signal |
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

The Cooley-Tukey algorithm requires N to be a **power of 2** (128, 256, 512, 1024, ...). If your data has a non-power-of-2 length, **zero-pad** to the next power of 2.`,
        examTip: 'For FE exam DFT problems: given N samples at rate fₛ, the frequency resolution is Δf = fₛ/N and the maximum frequency is fₛ/2. If asked to identify which bin a frequency falls in: bin k = round(f/Δf). These three formulas solve most DFT exam problems.',
      },
      {
        id: 'dft-windowing',
        title: '2. Windowing and Spectral Leakage',
        content: `## 2.1 Spectral Leakage

The DFT implicitly assumes the signal **repeats periodically** every N samples. If the signal is not an exact integer number of periods within the N-sample window, discontinuities at the edges create spurious frequency components — this is **spectral leakage**.

### Why It Happens

A finite-length signal is equivalent to multiplying an infinite signal by a rectangular window. In the frequency domain, this multiplication becomes **convolution** with the window's spectrum (a sinc function), smearing energy into adjacent bins.

![Sixty-four-point DFT magnitude of a cosine that completes ten and a half cycles in the record, computed with and without a Hann window and each trace normalized to its own peak. Without a window the tone smears across every bin at roughly minus thirteen to minus twenty-five decibels; the Hann window widens the peak slightly but drops the distant skirts below minus sixty decibels.](/courses/fe-ee/figures/sig-leakage-window.svg)

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

**$X(z) = \\Sigma x[n]\\cdot z^{-n}$** summed over all n

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

**$y[n] = x[n] * h[n] = \\Sigma x[k]\\cdot h[n-k]$** summed over k

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
  overview: `The sampling theorem is one of the most-tested concepts in FE Signal Processing because it underlies all digital signal acquisition. Beyond the basic statement, the exam tests numerical aliasing problems (given a sample rate and an input frequency, where does the alias appear?), anti-aliasing filter design (what cutoff?), and reconstruction error analysis. This topic provides the depth NCEES expects.`,
  sections: [
    {
      id: 'nyquist-statement',
      title: `1. The Nyquist-Shannon Sampling Theorem`,
      content: `## 1.1 The fundamental statement

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

In practice, sinc interpolation requires infinitely many samples (the sinc function is infinitely wide). Real systems use practical reconstruction filters (low-pass with cutoff = f_s/2) which introduce some imperfection.

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

Same design constraints as AAF: cutoff at f_s/2 (or slightly above), with adequate stopband attenuation.

## 2.8 Practical exam pattern

"A signal has content from DC to 5 kHz plus interference at 8 kHz. The sampling rate is 12 kHz. What is the apparent frequency of the interference, and what filter design would prevent it?"

Solution:
- f_s = 12 kHz, f_N = 6 kHz
- 8 kHz interference > 6 kHz → aliases to |8 - 12| = 4 kHz
- 4 kHz falls IN the signal band of interest — interference is now indistinguishable from real signal
- Fix: install an anti-aliasing low-pass filter with passband edge 5 kHz and stopband edge ≤ 6 kHz, achieving sufficient attenuation at 8 kHz

The required attenuation at 8 kHz depends on the application — typically you want the aliased component at least 40 dB below your desired signal level.`,
      examTip: `Anti-aliasing filter goes BEFORE the sampler (analog). Reconstruction filter goes AFTER the DAC (also analog). Both are low-pass; both have cutoff at f_s/2.`,
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
  ],
  keyTakeaways: [
    'Nyquist criterion: f_s > 2·f_max (strict). Nyquist frequency = f_s/2.',
    'Aliasing maps frequency f > f_s/2 to f_alias = |f - n·f_s| in [0, f_s/2]. Cannot be undone.',
    'Anti-aliasing filter (analog LP, cutoff at f_s/2) goes BEFORE the sampler. Reconstruction filter goes AFTER the DAC.',
    'Real filters have transition bands — oversample beyond 2·f_max to allow filter rolloff (CD samples at 44.1 kHz for 20 kHz audio)',
    'Higher-order analog filters have steeper rolloff: N-th order = 20·N dB/decade',
    'Modern systems oversample heavily and use digital decimation — easier than designing sharp analog filters',
    'Bandpass sampling: a band-limited signal between f_L and f_H can be sampled at 2·B (B = f_H - f_L) if frequencies don\'t overlap after replication',
  ],
},

};
