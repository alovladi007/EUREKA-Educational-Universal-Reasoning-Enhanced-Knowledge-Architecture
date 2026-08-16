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

The **one-sided amplitude spectrum** plots |cₙ| at each harmonic frequency $nf_{0}$. The spectrum reveals:

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

Discrete-time convolution — the sum version of this operation, with its own
tabular shortcut — is covered with the DFT material, where it pairs naturally
with the FFT's fast-convolution use.`,
        examTip: 'Flip the SIMPLER of the two signals — convolution is commutative, and flipping a rectangle is free while flipping an exponential invites sign errors. Then find the region boundaries (where edges cross) before integrating anything: on the FE exam, most convolution credit is earned by setting the limits correctly.',
        importantNote: 'Convolution in time is multiplication in frequency, and vice versa. This single sentence links filtering (multiplying a spectrum by H(f)) to the time-domain smearing a filter causes, and it is the reason windowing a signal (multiplication in time) spreads its spectrum (convolution in frequency).',
      },
    ],
    keyTakeaways: [
      'Periodic signals → Fourier Series (discrete spectrum at harmonics nf₀); aperiodic → Fourier Transform (continuous).',
      'Complex exponential form: cₙ = (1/T₀) ∫ x(t)·e^(−j2πnf₀t)dt is most compact for computation.',
      'Parseval: ∫|x(t)|²dt = ∫|X(f)|²df — energy conservation across domains.',
      'Signal smoothness determines spectral roll-off; discontinuities create high-frequency components.',
      'Time-bandwidth product Δt·Δf ≥ 1/(4π) — cannot be narrow in both domains simultaneously.',
      'Exploit signal symmetry: even → cosine only; odd → sine only; half-wave → odd harmonics only.',
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

- **Cutoff frequency**: fₙ = fₛ/2
- **Purpose**: remove all frequency content above fₙ before sampling
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
| 2nd | 14 kHz | $14 > 8$ | Yes | \| $14 - 16$ | $= 2\\ \\mathrm{kHz}$ |
| 3rd | 22 kHz | $22 > 8$ | Yes | \| $22 - 16$ | = 6, in range → **6 kHz** |

After sampling, the output appears to contain 3 kHz, 2 kHz, and 6 kHz — the original 14 kHz and 22 kHz components are permanently destroyed and replaced by aliases.

## 3.3 Anti-Aliasing Filter Design

**Design goal**: Remove all frequencies above fₛ/2 before sampling.

**Design procedure:**
1. **Determine signal bandwidth**: f_max = highest frequency of interest
2. **Choose sampling rate**: fₛ ≥ 2.5 × f_max (practical margin above Nyquist minimum)
3. **Set filter cutoff**: fc = fₛ/2 (or slightly below)
4. **Choose filter order**: higher order = steeper roll-off in the transition band
5. **Select filter type**: Butterworth for flat passband; Chebyshev for sharper cutoff

**Example**: Audio signal with f_max = 20 kHz, sampled at fₛ = 44.1 kHz.
- Anti-aliasing filter cutoff: fc = 22.05 kHz
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
(which is fₛ/2, the first frequency that folds back onto the band edge). The
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
section; nothing new is required beyond applying them at each rate change.`,
        examTip: 'Sampling-rate design problems on the FE exam usually hide a transition-band question: the anti-aliasing filter must fall from its passband edge (f_max) to full attenuation by fₛ/2. If the gap between those two frequencies is small, the required filter order explodes — check the ratio fₛ/2 divided by f_max before defending any "sample at exactly 2·f_max" answer.',
        importantNote: 'Decimation without a preceding digital low-pass filter aliases exactly as an ADC without an anti-aliasing filter does. Any time samples are discarded — in software, in a logging system, in a scope\'s display path — the Nyquist criterion applies at the NEW, lower rate.',
      },
    ],
    keyTakeaways: [
      'Nyquist criterion: fₛ > 2·f_max for perfect reconstruction; Nyquist frequency fₙ = fₛ/2.',
      'Aliasing folds frequencies above fₙ back into baseband: f_alias = |f − k·fₛ|.',
      'Anti-aliasing filter (analog LP at fₙ) is mandatory before the ADC.',
      'Perfect reconstruction uses sinc interpolation; practical systems use ZOH or oversampling.',
      'Oversampling relaxes anti-aliasing filter requirements by widening the transition band.',
      'Do not confuse Nyquist frequency (fₛ/2) with Nyquist rate (2·f_max) — common FE exam trap.',
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
majority of filter items on the exam.`,
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
