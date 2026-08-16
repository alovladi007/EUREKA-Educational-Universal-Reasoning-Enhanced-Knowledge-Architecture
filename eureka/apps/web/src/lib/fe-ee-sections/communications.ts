// FE EE course content — Communications (6 topics).
// Split byte-identically from fe-ee-course-data.ts so section waves
// can be authored in parallel; spread back into FE_EE_COURSE there.
import type { TopicLesson } from '../fe-ee-course-data';

export const FE_EE_COMMUNICATIONS: Record<string, TopicLesson> = {
fee_am_fm: { topicId: 'fee_am_fm', title: 'Analog Modulation: AM & FM', domainWeight: 'Communications · 4–6%',
  overview: 'Amplitude Modulation (AM) and Frequency Modulation (FM) are the two foundational analog modulation techniques. AM encodes information in the carrier amplitude and is bandwidth-efficient but noise-sensitive. FM encodes information in the carrier frequency and trades wider bandwidth for superior noise immunity.',
  sections: [
    { id: 'am-fundamentals', title: '1. Amplitude Modulation (AM)',
      content: `## 1.1 AM Signal Representation

**s(t) = A_c [1 + m_a * m(t)] cos(2 pi f_c t)**

where A_c is carrier amplitude, m(t) is the normalized message (|m(t)| <= 1), and m_a is the **modulation index**.

- **$m_a > 1$** causes **overmodulation** -- envelope crosses zero, distorting the recovered signal.

## 1.2 AM Bandwidth and Power

| Parameter | Formula | Notes |
|---|---|---|
| Bandwidth | **$BW = 2 f_m$** | f_m = highest message frequency |
| Carrier power | **$P_c = A_c^2 / (2R)$** | No information in carrier |
| Sideband power | **$P_s = P_c * m_a^2 / 2$** | Contains all information |
| Total power | **$P_{total} = P_c (1 + m_a^2 / 2)$** | Carrier + sidebands |
| Efficiency | **eta = m_a^2 / (2 + m_a^2)** | Max ~33% at m_a = 1 |

### AM Variants

- **DSB-SC**: removes carrier, 100% efficiency, requires coherent detection.
- **SSB**: one sideband only -- BW = f_m (half of standard AM).
- **VSB**: one sideband + vestige -- used in analog TV.`,
      examTip: 'AM efficiency is at most 33% at full modulation (m_a = 1) because the carrier carries no information. If asked for "useful power," compute P_s = P_c * m_a^2 / 2. DSB-SC achieves 100% efficiency but needs a synchronous detector.',
      importantNote: 'Overmodulation (m_a > 1) causes the AM envelope to cross zero, making envelope detection fail. The FE exam commonly tests whether a given modulation index causes overmodulation.',
    },
    { id: 'fm-fundamentals', title: '2. Frequency Modulation (FM)',
      content: `## 2.1 FM Signal Representation

**s(t) = A_c cos(2 pi f_c t + beta * sin(2 pi f_m t))**

| Parameter | Formula | Meaning |
|---|---|---|
| Frequency deviation | **Delta_f = k_f * A_m** | Max shift from carrier |
| Modulation index | **beta = Delta_f / f_m** | Ratio of deviation to message freq |
| Carson's rule BW | **BW = 2(Delta_f + f_m)** | Practical bandwidth estimate |

- **Narrowband FM (beta << 1)**: BW approx 2 f_m (similar to AM).
- **Wideband FM (beta >> 1)**: BW approx 2 Delta_f.

## 2.2 FM vs. AM

| Feature | AM | FM |
|---|---|---|
| Bandwidth | **2 f_m** | **2(Delta_f + f_m)** |
| Noise immunity | Poor | Excellent -- limiter removes amplitude noise |
| Efficiency | Low (max ~33%) | N/A (constant-envelope) |
| Complexity | Simple envelope detector | Frequency discriminator needed |

## 2.3 Phase Modulation (PM)

**$s(t) = A_c \\cos (2 pi f_c t + k_p m(t))$**. FM and PM are closely related -- FM of m(t) is equivalent to PM of its integral. Digital PSK is fundamentally phase modulation.`,
      examTip: 'Carson\'s rule BW = 2(Delta_f + f_m) is the most-tested FM formula. For narrowband FM (beta << 1) it simplifies to 2 f_m. For wideband FM (beta >> 1) it becomes ~2 Delta_f. Always compute beta first.',
    },
    { id: 'am-fm-receivers', title: '3. Superheterodyne Receivers and Tradeoffs',
      content: `## 3.1 The Bandwidth-Noise Tradeoff

**Wider bandwidth can be traded for better noise performance.** FM exploits this -- spreading the signal over wider bandwidth lets the receiver reject more noise.

**FM improvement factor**: SNR_out / SNR_in = 3 beta^2 (beta + 1) for wideband FM, where SNR_in is the carrier-to-noise ratio in the Carson bandwidth and the message is a single tone (see Section 6.3).

## 3.2 Superheterodyne Receiver

1. **RF amplifier** -- sets noise figure
2. **Mixer + LO** -- down-converts to IF
3. **IF amplifier + filter** -- selectivity and gain
4. **Detector** -- envelope (AM) or discriminator (FM)

- **Image frequency**: f_image = f_signal + 2 f_IF with high-side LO injection (f_LO = f_signal + f_IF), and f_signal - 2 f_IF with low-side injection — the separation is 2 f_IF either way (Section 6.1)
- Higher IF improves image rejection but worsens adjacent-channel selectivity

## 3.3 Pre-emphasis / De-emphasis

FM uses pre-emphasis (boost highs before TX) and de-emphasis (attenuate after RX) to improve high-frequency SNR.`,
      examTip: 'Image frequency = f_signal + 2 f_IF. The image is always separated from the desired signal by exactly twice the IF frequency.',
    },
    { id: 'am-fm-worked', title: '3. AM/FM Worked Problems',
      content: `## 3.1 AM Bandwidth and Efficiency (m = 0.8)

**Given**: Carrier power P_c = 10 kW, modulation index m_a = 0.8, message bandwidth f_m = 5 kHz.

**Step 1 — Bandwidth**: BW = 2 * f_m = 2 * 5 kHz = **10 kHz**

**Step 2 — Sideband power**: P_s = P_c * m_a^2 / 2 = 10000 * 0.64 / 2 = **3200 W**

**Step 3 — Total power**: P_total = P_c(1 + m_a^2/2) = 10000(1 + 0.32) = **13,200 W**

**Step 4 — Efficiency**: eta = m_a^2 / (2 + m_a^2) = 0.64 / 2.64 = **24.2%**

| Parameter | Value |
|---|---|
| Bandwidth | 10 kHz |
| Sideband power | 3,200 W |
| Total power | 13,200 W |
| Efficiency | 24.2% |

## 3.2 FM Carson's Bandwidth

**Given**: Frequency deviation Delta_f = 75 kHz, message frequency f_m = 15 kHz.

- **Modulation index**: beta = Delta_f / f_m = 75 / 15 = **5** (wideband FM)
- **Carson's rule**: BW = 2(Delta_f + f_m) = 2(75 + 15) = **180 kHz**

Since beta = 5 >> 1, this is wideband FM with excellent noise immunity.

## 3.3 DSB-AM vs SSB Bandwidth Savings

| Scheme | Bandwidth | Efficiency | Detection |
|---|---|---|---|
| Standard AM | $2 f_m = 10\\ \\mathrm{kHz}$ | $24.2\\% (m=0.8)$ | Envelope (simple) |
| DSB-SC | $2 f_m = 10\\ \\mathrm{kHz}$ | 100% | Coherent (complex) |
| SSB | $f_m = 5\\ \\mathrm{kHz}$ | 100% | Coherent (complex) |

**SSB saves 50% bandwidth** vs standard AM or DSB-SC while achieving 100% power efficiency. The tradeoff is receiver complexity — SSB requires a synchronous detector or Weaver method.

**Exam strategy**: Always compute beta first for FM problems. If beta < 0.3, use narrowband approximation (BW ≈ 2f_m). If beta > 1, use Carson's rule. For AM, the efficiency formula eta = m_a^2/(2 + m_a^2) is the fastest path.`,
      examTip: 'For AM efficiency at any m_a, just plug into eta = m_a^2/(2+m_a^2). At m_a=1 you get 33%. At m_a=0.5, only 11%. The carrier wastes most power in standard AM.',
      importantNote: 'Carson\'s rule gives an approximate 98% bandwidth. The exact FM bandwidth is infinite (Bessel functions), but Carson\'s rule is always accepted on the FE exam.',
    },
    { id: 'am-envelope-power', title: '4. Reading the AM Envelope: Index, Power, Two Tones',
      content: `## 4.1 The index you can measure on a scope

Every AM number on this exam follows from the modulation index, and the index
is usually handed to you indirectly rather than stated. Put the modulated wave
on an oscilloscope, read the largest envelope excursion and the smallest, and
the index drops out of those two readings:

**m = (V_max - V_min) / (V_max + V_min)**, and the unmodulated carrier
amplitude is **A_c = (V_max + V_min) / 2**.

Both come straight from the definition. The envelope of
s(t) = A_c[1 + m cos(2 pi f_m t)] cos(2 pi f_c t) is A_c(1 + m cos), whose
largest value is A_c(1 + m) and whose smallest is A_c(1 - m). Add the two and
the index cancels; subtract them and the carrier cancels.

**Worked**: an envelope swinging between V_max = 12 V and V_min = 4 V gives
m = (12 - 4)/(12 + 4) = 8/16 = **0.50** and A_c = (12 + 4)/2 = **8 V**. A trace
running from 10 V down to 2 V is m = 8/12 = **0.667**; one running from 9 V to
1 V is m = 8/10 = **0.80**. Notice that the same 8 V of envelope swing means
three different indices, because what matters is the swing relative to the
carrier it rides on.

![Two AM waveforms computed from the standard expression with carrier amplitude Ac and index m, drawn with their envelopes. At m equal to 0.6 the envelope bottoms out at 0.4 Ac and the detected output is the message. At m equal to 1.4 the bracket goes negative 135.6 degrees either side of the message peak, the envelope folds about zero, and at the message trough the detector reads plus 0.4 Ac, a peak that exists nowhere in the message.](/courses/fe-ee/figures/comm-am-envelope.svg)

The lower panel is worth studying because it shows exactly what overmodulation
destroys. The rectifier in an envelope detector cannot know that the bracket
1 + m cos went negative; it reports the magnitude. So a message minimum comes
out as a small local maximum of 0.4 A_c, flanked by two instants where the
envelope is genuinely zero. The recovered audio gains harmonics that were never
transmitted, and no amount of filtering afterwards removes them. That is why
m > 1 is a hardware fault, not merely a poor choice of level.

## 4.2 Power bookkeeping, run in both directions

The forward calculation is in Section 1.2. The exam often runs it backwards:
you are given a total transmitted power and an index, and asked for the carrier
or the sideband share.

**Worked**: a transmitter delivers 6.00 kW total at m = 0.60. From
P_total = P_c(1 + m^2/2) with m^2/2 = 0.18,

- **P_c = 6000 / 1.18 = 5084.75 W**
- **P_sidebands = P_total - P_c = 915.25 W**, which checks against
  P_c(m^2/2) = 5084.75 x 0.18 = 915.25 W
- **efficiency = 915.25 / 6000 = 15.25%**, matching m^2/(2 + m^2) = 0.36/2.36

| Index m | Efficiency m^2/(2+m^2) | Sideband power / P_c | Envelope minimum |
|---|---|---|---|
| 0.25 | 3.03% | 0.031 | 0.75 A_c |
| 0.50 | 11.11% | 0.125 | 0.50 A_c |
| 0.60 | 15.25% | 0.180 | 0.40 A_c |
| 0.80 | 24.24% | 0.320 | 0.20 A_c |
| 1.00 | 33.33% | 0.500 | 0 |
| 1.40 | (overmodulated) | 0.980 | envelope folds |

The last column is the useful one for spotting traps: an envelope that touches
zero is exactly m = 1, and an envelope that appears to cross zero is a report
of overmodulation, not a legitimate reading.

Two of the variants in Section 1.2 are best remembered as power fractions of
this same table. At m = 1 the carrier holds 1.0 of 1.5 units, and each sideband
holds 0.25. Suppressing the carrier (DSB-SC) throws away the 1.0 and keeps 0.5,
so the transmitter power drops by 4.77 dB for the same recovered signal.
Transmitting one sideband alone (SSB) keeps 0.25 of the original 1.5, a
reduction of **7.78 dB**, and halves the occupied bandwidth as well.

## 4.3 Two tones, and the antenna ammeter

Real messages are not single tones. When several tones modulate one carrier,
the powers add, so the indices combine in quadrature:

**m_eff = sqrt(m_1^2 + m_2^2 + ...)**

**Worked**: tones at m_1 = 0.6 and m_2 = 0.8 give
m_eff = sqrt(0.36 + 0.64) = **1.00** — each tone is individually safe, and
together they sit exactly at the overmodulation boundary. This is the standard
version of the trap, and it is answered in one line by the quadrature rule.

The old field measurement uses the same algebra. An RF ammeter in the antenna
lead reads the total current, and since power is proportional to current
squared into a fixed resistance,

**I_total / I_carrier = sqrt(1 + m^2/2)**

**Worked**: an unmodulated carrier draws 10.0 A. At m = 0.80 the meter reads
10 x sqrt(1 + 0.32) = 10 x 1.14891 = **11.49 A**. Run backwards, a reading that
climbs from 10.0 A to 11.49 A means m = sqrt(2[(1.14891)^2 - 1]) = **0.80**.

## 4.4 How the exam asks this

| If the question gives you | Do this first |
|---|---|
| Two envelope voltages | m = (V_max - V_min)/(V_max + V_min) |
| Total power and index | P_c = P_total/(1 + m^2/2) |
| Two modulating tones | Combine indices in quadrature before anything else |
| An antenna current ratio | Square it, subtract 1, double, take the root |
| A statement that the envelope reaches zero | m = 1 exactly; efficiency is 33.3% |

None of these needs a calculator memory: they are five rearrangements of the
same two definitions.`,
      examTip: 'Envelope readings are the fastest route into an AM problem: m = (V_max - V_min)/(V_max + V_min). Two tones combine as m_eff = sqrt(m_1^2 + m_2^2), so 0.6 and 0.8 together reach exactly m = 1 even though neither does alone.',
      importantNote: 'An envelope detector reports magnitude, so overmodulation is not just distortion of amplitude — it turns each message minimum into a false peak of A_c(m - 1). The damage happens before the audio filter, and nothing downstream can undo it.',
    },
    { id: 'fm-sidebands-carson', title: '5. FM Sidebands: Where Carson\'s Rule Comes From',
      content: `## 5.1 An FM signal has infinitely many sidebands

Tone-modulated FM is not two sidebands like AM. Expanding
cos(2 pi f_c t + beta sin 2 pi f_m t) produces a line at the carrier and a pair
of lines at every multiple of f_m either side, with amplitudes given by the
Bessel functions of the first kind: the line n f_m from the carrier has
relative amplitude **|J_n(beta)|**. The total is conserved — the squared
amplitudes always sum to one — so increasing beta does not create power, it
moves power outward from the carrier into the sidebands.

![FM line spectrum at beta equal to 5, computed from the Bessel coefficients, with the Carson band edges drawn at plus and minus 90 kHz. The carrier line is only 0.178 tall while several sidebands exceed 0.36, and the lines inside the Carson band carry 99.36 percent of the transmitted power.](/courses/fe-ee/figures/comm-fm-bessel.svg)

Two exam-relevant facts are visible at once. First, the carrier line is not
special: at beta = 5 it is |J_0(5)| = 0.178, smaller than six of its own
sidebands, and at beta = 2.405 it vanishes entirely — the classic laboratory
method for setting deviation is to advance the modulating level until the
carrier line disappears. Second, the sidebands do not trail off gently and then
stop; they stay significant out to roughly n = beta + 1 and then collapse very
fast. That collapse is the whole justification for Carson's rule.

| beta | J_0 | J_1 | J_2 | J_3 | J_4 | Significant pairs (n <= beta+1) |
|---|---|---|---|---|---|---|
| 0.2 | 0.990 | 0.0995 | 0.0050 | 0.0002 | 0.000 | 1 |
| 1.0 | 0.765 | 0.440 | 0.115 | 0.020 | 0.002 | 2 |
| 5.0 | -0.178 | -0.328 | 0.047 | 0.365 | 0.391 | 6 |

Counting pairs up to n = beta + 1 and doubling gives
BW = 2(beta + 1)f_m = 2(Delta_f + f_m), which is Carson's rule arriving by a
second route. The power actually enclosed is worth knowing as a number, not a
slogan: at beta = 1 it is 99.92%, at beta = 5 it is **99.36%**, and at
beta = 10 it is 99.00%. The traditional "about 98%" is a floor, and the rule
gets slightly conservative as beta grows.

At the other end, beta = 0.2 shows why narrowband FM is treated as an AM
lookalike: the second-order pair is 5.0% of the first, so only one pair
survives and BW = 2f_m. The usual dividing line on the exam is beta < 0.3.

## 5.2 Deviation belongs to the transmitter, beta belongs to the pair

The single most common FM error is treating the deviation as if it depended on
the message frequency. It does not. For FM, **Delta_f = k_f A_m** is set by the
modulating amplitude and the modulator's sensitivity alone; f_m enters only
when you form beta = Delta_f/f_m.

**Worked**: a modulator with k_f = 3 kHz/V is driven by a 5 V, 4 kHz tone.

- Deviation: Delta_f = 3 kHz/V x 5 V = **15 kHz** (the 4 kHz plays no part)
- Index: beta = 15/4 = **3.75**
- Carson bandwidth: 2(15 + 4) = **38 kHz**

Now halve the message frequency to 2 kHz at the same amplitude:

- Deviation is still **15 kHz**
- Index: beta = 15/2 = **7.50** — it doubled
- Carson bandwidth: 2(15 + 2) = **34 kHz** — it barely moved

| Change | Delta_f | beta | Carson BW |
|---|---|---|---|
| Baseline: 5 V at 4 kHz | 15 kHz | 3.75 | 38 kHz |
| Same tone, f_m halved to 2 kHz | 15 kHz | 7.50 | 34 kHz |
| Amplitude doubled to 10 V at 4 kHz | 30 kHz | 7.50 | 68 kHz |

Read the table as a rule: message amplitude moves bandwidth roughly in
proportion, message frequency almost not at all. That asymmetry is why
wideband FM tolerates a wide audio band cheaply, and it is the reason
broadcast FM can carry 15 kHz of audio in a 200 kHz channel — Carson at
Delta_f = 75 kHz and f_m = 15 kHz asks for 180 kHz, leaving 20 kHz of guard.

## 5.3 Phase modulation is the same equation with one term moved

For PM the instantaneous phase, not the frequency, follows the message:
**s(t) = A_c cos(2 pi f_c t + k_p m(t))**, so for a tone the peak phase
deviation is beta_p = k_p A_m, independent of f_m. Since instantaneous
frequency is the derivative of phase, the resulting frequency deviation is
**Delta_f = beta_p f_m**, which now DOES scale with the message frequency —
the exact opposite of FM.

**Worked**: k_p = 3 rad/V driven by the same 5 V tone gives beta_p = 15 rad
at any message frequency. At f_m = 4 kHz the deviation is 15 x 4 = **60 kHz**;
at f_m = 2 kHz it is 15 x 2 = **30 kHz**.

| Quantity | FM | PM |
|---|---|---|
| Set by the modulator | Delta_f = k_f A_m | beta_p = k_p A_m |
| Depends on f_m | beta = Delta_f/f_m | Delta_f = beta_p f_m |
| Doubling the message frequency | Halves beta, BW nearly unchanged | Doubles the deviation and roughly doubles BW |
| Equivalent viewpoint | PM of the integral of m(t) | FM of the derivative of m(t) |

The last row is the one to carry into digital communications: PSK is phase
modulation by a discrete symbol stream, which is why its bandwidth is set by
the symbol rate rather than by any deviation constant.`,
      examTip: 'Compute beta first, then decide which bandwidth rule applies: beta < 0.3 is narrowband (BW = 2 f_m), otherwise Carson BW = 2(Delta_f + f_m). Remember that changing f_m changes beta but hardly changes an FM signal\'s bandwidth, while for PM it changes the deviation itself.',
      importantNote: 'The lines inside the Carson band hold 99.36% of the power at beta = 5 and 99.00% at beta = 10 — the familiar "98%" is a conservative floor. The carrier line is not privileged: J_0(2.405) = 0, so at that index the carrier disappears completely while the signal is still fully modulated.',
    },
    { id: 'am-fm-receiver-numbers', title: '6. Receiver Numbers: Image Rejection and the FM Advantage',
      content: `## 6.1 The image sits on whichever side the local oscillator does

Section 3 gives the image as f_image = f_signal + 2 f_IF. That is the
high-side-injection case, where the local oscillator is placed ABOVE the wanted
signal at f_LO = f_signal + f_IF. A mixer responds to |f_RF - f_LO|, so two
input frequencies produce the same IF, and the unwanted one is always the
mirror of the wanted one about f_LO:

- **High-side LO** (f_LO = f_s + f_IF): image at **f_s + 2 f_IF**
- **Low-side LO** (f_LO = f_s - f_IF): image at **f_s - 2 f_IF**

Either way the separation is exactly 2 f_IF, which is the part the exam tests
most often. Only the sign depends on the design.

**Worked**: an FM broadcast receiver tuned to 100.1 MHz with the standard
10.7 MHz IF. With high-side injection the oscillator runs at 110.8 MHz and the
image is at **121.5 MHz**. With low-side injection it runs at 89.4 MHz and the
image falls at **78.7 MHz**. Broadcast receivers prefer high-side injection
because it compresses the oscillator's tuning range: across the 88-108 MHz
band the high-side oscillator covers 98.7-118.7 MHz, a ratio of **1.20:1**,
against 77.3-97.3 MHz or **1.26:1** low-side. In the AM band the same argument
is decisive rather than marginal — high-side gives 995-2055 kHz (**2.07:1**)
where low-side would demand 85-1145 kHz, a **13.5:1** range no single tuned
circuit can cover.

**Worked**: an AM broadcast receiver at 1000 kHz with a 455 kHz IF has its
image at 1000 + 910 = **1910 kHz** — still inside the AM band, which is why the
front-end tuning must track the oscillator.

## 6.2 How much rejection a front end actually provides

The image is removed before the mixer, by whatever selectivity sits in front of
it. For a single tuned circuit of quality factor Q, the response at a frequency
f relative to resonance f_0 falls off as

**rejection ratio = sqrt(1 + Q^2 (f/f_0 - f_0/f)^2)**

**Worked**, Q = 50 in both cases:

| Receiver | f_0 | Image | Detuning term | Rejection |
|---|---|---|---|---|
| AM, 455 kHz IF | 1000 kHz | 1910 kHz | 1.386 | **36.8 dB** |
| FM, 10.7 MHz IF | 100.1 MHz | 121.5 MHz | 0.390 | **25.8 dB** |

The AM case does better even though its IF is 23 times lower, because what
matters is the FRACTIONAL separation between signal and image, not the absolute
one. This is the whole IF-selection argument in one table: a high IF pushes the
image further away in fractional terms and is easy to filter out at the front
end, while a low IF makes the narrow, steep-skirted channel filter after the
mixer easy to build. Double-conversion receivers take both — a high first IF
for image rejection, a low second IF for selectivity.

## 6.3 What FM buys for the extra bandwidth

Section 3.1 gives the improvement factor 3 beta^2 (beta + 1). It is worth
stating exactly what the two SNRs in that ratio mean, because the constant
changes if you define them differently: the denominator is the carrier-to-noise
ratio measured in the Carson transmission bandwidth, the numerator is the
post-detector SNR in the message band, and the message is a single tone.

**Worked**: broadcast FM at beta = 5 gives
3(25)(6) = **450**, or **26.5 dB** of improvement over the CNR the receiver
sees. A narrowband link at beta = 1 gets 3(1)(2) = 6, only **7.8 dB**. The gain
grows roughly as the cube of beta while the bandwidth grows only linearly,
which is the exchange that makes wideband FM worth its spectrum.

Two limits keep this from being free:

- **Threshold**: below roughly 10 dB CNR the discriminator loses lock, clicks
  appear, and the 26.5 dB advantage collapses within a decibel or two of
  additional fading. AM degrades gracefully; FM falls off a cliff.
- **Capture**: given two co-channel signals, an FM receiver reproduces the
  stronger one and suppresses the weaker almost entirely, typically once the
  stronger leads by a few decibels.

Pre-emphasis is the other half of the noise story. Discriminator output noise
rises with the square of the offset frequency, so the top of the audio band
suffers most. The transmitter therefore boosts high audio frequencies through
a network with time constant tau, and the receiver applies the exact inverse.
The corner sits at **f = 1/(2 pi tau)**: with the North American tau = 75 us
that is **2122 Hz**, and with the European tau = 50 us it is **3183 Hz**. At
the 15 kHz band edge the 75 us network boosts by
10 log10(1 + (2 pi x 15000 x 75e-6)^2) = **17.1 dB** before transmission, and
the receiver's matching de-emphasis takes the same 17.1 dB back out of both the
audio and the noise sitting with it.

| Design choice | What it buys | What it costs |
|---|---|---|
| Higher IF | Image further away fractionally | Harder adjacent-channel selectivity |
| Lower IF | Sharp, cheap channel filters | Image lands close to the wanted signal |
| Larger beta | 3 beta^2 (beta + 1) noise improvement | Bandwidth grows as 2(beta + 1) f_m |
| Pre-emphasis | Recovers high-frequency SNR | Reduced headroom for bright programme material |`,
      examTip: 'Image separation is 2 f_IF regardless of injection side; only the direction flips. If a question fixes the LO frequency, subtract to find the IF first, then place the image on the far side of the LO from the wanted signal.',
      importantNote: 'The FM improvement factor 3 beta^2 (beta + 1) is measured against the carrier-to-noise ratio in the Carson bandwidth, and it only applies above the FM threshold of roughly 10 dB CNR. Below threshold the advantage disappears abruptly — which is why a fading FM link fails suddenly rather than gradually.',
    },
  ],
  keyTakeaways: [
    'AM: s(t) = A_c[1+m_a*m(t)]cos(wt); BW = 2f_m; efficiency eta = m_a^2/(2+m_a^2), max ~33%.',
    'FM: beta = Delta_f/f_m; Carson\'s rule BW = 2(Delta_f + f_m).',
    'AM is bandwidth-efficient but noise-sensitive; FM trades wider BW for noise immunity.',
    'Overmodulation (m_a > 1) causes AM envelope distortion -- common exam trap.',
    'DSB-SC removes carrier for 100% efficiency; SSB halves bandwidth to f_m.',
    'Superheterodyne: RF amp -> mixer -> IF filter -> detector; image freq = f_signal + 2f_IF.',
  ],
},

fee_digital_mod: { topicId: 'fee_digital_mod', title: 'Digital Modulation: ASK, FSK, PSK, QAM', domainWeight: 'Communications · 4–6%',
  overview: 'Digital modulation encodes discrete bits as distinct changes in a carrier signal. ASK varies amplitude, FSK varies frequency, PSK varies phase, and QAM combines amplitude and phase. Higher-order modulations pack more bits per symbol but demand higher SNR.',
  sections: [
    { id: 'digmod-basic', title: '1. Basic Digital Modulation Schemes',
      content: `## 1.1 ASK, FSK, PSK

**ASK**: maps bits to amplitude levels. Simplest but most noise-sensitive.

**FSK**: maps bits to different frequencies. BW_FSK = |f_1 - f_0| + 2B. More noise-resistant than ASK.

**PSK**:

| Scheme | Phases | Bits/Symbol | Key Property |
|---|---|---|---|
| **BPSK** | 0, pi | 1 | Most noise-resistant |
| **QPSK** | 0, pi/2, pi, 3pi/2 | 2 | Same BW as BPSK, double throughput |
| **8-PSK** | 8 equally spaced | 3 | Needs higher SNR |

**BPSK bit-error rate**: BER = Q(sqrt(2 E_b / N_0))

QPSK achieves **2 bits/symbol with the same bandwidth** as BPSK -- this dominates practical systems.

## 1.2 QAM (Quadrature Amplitude Modulation)

QAM varies **both amplitude and phase**:

| Scheme | Points | Bits/Symbol | Spectral Efficiency |
|---|---|---|---|
| **$4-QAM (= QPSK)$** | 4 | 2 | 2 bits/s/Hz |
| **16-QAM** | 16 | 4 | 4 bits/s/Hz |
| **64-QAM** | 64 | 6 | 6 bits/s/Hz |
| **256-QAM** | 256 | 8 | 8 bits/s/Hz |

**bits/symbol = log_2(M)** where M is constellation size.
**Required SNR increases ~6 dB for every QUADRUPLING of M** (that is, ~3 dB for each extra bit per symbol): 4-QAM to 16-QAM costs 6.9 dB of SNR, 16-QAM to 64-QAM 6.1 dB, 64-QAM to 256-QAM 6.0 dB. See Section 4.2 for the constellation geometry behind the number.`,
      examTip: 'QPSK transmits 2 bits/symbol with the SAME bandwidth as BPSK -- essentially two independent BPSK streams on I and Q channels. This is the most important spectral-efficiency fact for the FE exam.',
      importantNote: 'Do not confuse bits per symbol with bits per second. Bits/s = bits/symbol * symbol rate. QPSK at 1 Msym/s = 2 Mbps.',
    },
    { id: 'digmod-ber', title: '2. BER and Design Tradeoffs',
      content: `## 2.1 BER Expressions

| Scheme | BER Formula | Notes |
|---|---|---|
| BPSK | **$Q(\\sqrt{2 E_b/N_0})$** | Best BER per E_b/N_0 |
| QPSK | **$Q(\\sqrt{2 E_b/N_0})$** | Same as BPSK (independent I/Q) |
| 16-QAM | ~4 dB more than QPSK | Higher constellation penalty |

**E_b/N_0 = (S/N) * (B/R_b)** -- universal digital link quality metric.

## 2.2 The Fundamental Tradeoff

- **Higher M** -> more bits/symbol -> higher spectral efficiency
- **Higher M** -> closer constellation points -> higher required E_b/N_0
- This is the **bandwidth-power tradeoff**.

## 2.3 Practical Techniques

- **Gray coding**: adjacent points differ by 1 bit, minimizing bit errors
- **Differential encoding**: data in phase changes, avoids carrier recovery
- **Adaptive modulation**: switch M based on channel conditions (WiFi, 4G/5G)

**Bandwidth**: BW = R_s * (1 + alpha) where alpha is roll-off factor (0.2-0.5 typical).`,
      examTip: 'BPSK and QPSK have identical BER per E_b/N_0 because QPSK is two independent BPSK streams. For 16-QAM, you need ~4 dB more E_b/N_0 than QPSK for the same BER.',
    },
    { id: 'digmod-exam', title: '3. Digital Modulation Exam Problems',
      content: `## 3.1 QPSK vs 16-QAM Bandwidth Efficiency

**Problem**: A channel has 1 MHz bandwidth with roll-off factor alpha = 0.25. Compare throughput for QPSK and 16-QAM.

**Symbol rate**: R_s = BW / (1 + alpha) = 1 MHz / 1.25 = **800 ksym/s**

| Scheme | Bits/Symbol | Bit Rate | Spectral Efficiency |
|---|---|---|---|
| **QPSK** | 2 | 2 * 800k = **1.6 Mbps** | 1.6 bits/s/Hz |
| **16-QAM** | 4 | 4 * 800k = **3.2 Mbps** | 3.2 bits/s/Hz |

16-QAM doubles throughput but requires **~4 dB more E_b/N_0** for the same BER.

## 3.2 BER for BPSK at E_b/N_0 = 10 dB

**Step 1**: Convert to linear: E_b/N_0 = 10^(10/10) = **10**

**Step 2**: BER = Q(sqrt(2 * 10)) = Q(sqrt(20)) = Q(4.47)

**Step 3**: From Q-function table: Q(4.47) ≈ **$3.9 x 10^-6$**

At E_b/N_0 = 10 dB, BPSK and QPSK both achieve BER near 10^-6 — excellent for most applications.

## 3.3 Bits per Symbol for 64-QAM

**bits/symbol = log_2(M) = log_2(64) = 6**

| M-QAM | Constellation Points | Bits/Symbol | Required E_b/N_0 (BER=10^-5) |
|---|---|---|---|
| 4-QAM (QPSK) | 4 | 2 | ~9.6 dB |
| 16-QAM | 16 | 4 | ~13.4 dB |
| **64-QAM** | 64 | **6** | ~17.8 dB |
| 256-QAM | 256 | 8 | ~22.5 dB |

**Rule of thumb**: each quadrupling of M (two more bits per symbol) costs ~4-5 dB more E_b/N_0 — 3.8 dB from 4-QAM to 16-QAM, 4.4 dB to 64-QAM, 4.7 dB to 256-QAM — which is the same thing as ~6 dB more SNR. The formula bits = log_2(M) is guaranteed on the FE reference sheet, but memorizing common values saves time.

**Exam strategy**: For any M-ary modulation, start with bits/symbol = log_2(M). Then bit rate = bits/symbol * symbol rate. For BER questions, remember BPSK/QPSK share the same curve, and higher M needs more E_b/N_0.`,
      examTip: 'Quick formula chain: symbol rate = BW/(1+alpha), bit rate = log_2(M) * symbol rate. QPSK and BPSK have identical BER — this fact appears almost every exam cycle.',
      importantNote: 'Roll-off factor alpha is sometimes given as "excess bandwidth." BW = R_s(1+alpha). If alpha is not given, assume alpha = 0 (Nyquist minimum bandwidth = R_s).',
    },
    { id: 'digmod-constellation-cost', title: '4. Constellation Geometry and the Price of Each Extra Bit',
      content: `## 4.1 Reading a BER curve

Every modulation comparison on this exam reduces to one question: at the
signal quality you have, what error rate does this constellation give? The
curves below answer it, and they are computed from the two expressions the
lesson already states — Q(sqrt(2 E_b/N_0)) for BPSK and QPSK, and the
Gray-coded square-QAM form for the rest.

![Bit error rate against Eb/N0 for BPSK and QPSK on one curve, then 16-QAM and 64-QAM, each computed from its standard expression. The markers show where each curve crosses a bit error rate of ten to the minus five: 9.59 dB, 13.43 dB and 17.79 dB respectively.](/courses/fe-ee/figures/comm-ber-curves.svg)

Three readings matter more than the curves themselves:

- The curves are **steep**. Between 10 and 12 dB, BPSK improves from
  3.9 x 10^-6 to 9.0 x 10^-9, nearly three decades for two decibels. A link
  that is 2 dB short is not slightly worse, it is broken; a link 2 dB long is
  wasting power. This steepness is why fade margin is quoted in whole tens of
  decibels.
- They are **parallel**. Going from QPSK to 64-QAM shifts the whole curve right
  by 17.787 - 9.588 = **8.20 dB** without changing its shape.
- The gaps are **uneven**: 3.85 dB from 4-QAM to 16-QAM, then 4.35 dB, then
  4.72 dB. Each quadrupling of M costs a little more than the one before.

## 4.2 Why the penalty is about 6 dB of SNR per quadrupling

A square M-QAM constellation with minimum spacing d between neighbours has
average symbol energy E_s = (M - 1)d^2/6. Hold the transmitted power fixed and
increase M, and the spacing must shrink: d^2 is proportional to 1/(M - 1).
Since the error probability depends on d/2 measured against the noise, the
required SNR rises by the same factor:

**10 log10[(M - 1)/3] dB relative to QPSK**

| M | (M - 1)/3 | Predicted SNR penalty | Measured Es/N0 penalty at BER 10^-5 |
|---|---|---|---|
| 4 | 1 | 0 dB | 0 dB |
| 16 | 5 | 6.99 dB | 6.86 dB |
| 64 | 21 | 13.22 dB | 12.97 dB |
| 256 | 85 | 19.29 dB | 18.94 dB |

The geometric prediction and the measured requirement agree to about a quarter
of a decibel, and the small discrepancy is the extra outer points a larger
constellation exposes to error. So the rule to memorise is:
**four times as many points costs about 6 dB of SNR**, or equivalently about
3 dB per extra bit per symbol. Stating it as "6 dB per doubling of M" is a
factor-of-two error that will not survive a numerical question.

Note the difference between the two columns of penalty and the E_b/N_0 numbers
in Section 3.3. E_s/N_0 and E_b/N_0 differ by the number of bits per symbol:
**E_s/N_0 = (E_b/N_0) x log2(M)**. Quadrupling M adds 2 bits, worth 3.01 dB, so
a 6 dB SNR penalty appears as only about 4 dB of E_b/N_0 penalty. Both are
correct; they answer different questions. Use E_b/N_0 to compare modulations at
equal information rate, and SNR (or E_s/N_0) to compare them in the same
channel.

## 4.3 Gray coding, quantified

Neighbouring constellation points are the ones confused first, so the labelling
decides how many BITS an error costs. Gray coding assigns labels so that
adjacent points differ in exactly one bit position.

| Labelling of a 4-point axis | 00, 01, 10, 11 in natural order | Gray order 00, 01, 11, 10 |
|---|---|---|
| Neighbours differing by 1 bit | 2 of 3 boundaries | 3 of 3 boundaries |
| Bits wrong per symbol error | up to 2 | 1 |
| BER at high SNR | roughly 1.5 x Gray | baseline |

At high SNR nearly every symbol error is to a nearest neighbour, so Gray
coding turns each symbol error into exactly one bit error, and

**BER is approximately SER / log2(M)**

**Worked**: 16-QAM at a symbol error rate of 4 x 10^-5, Gray-coded, gives
BER = 4 x 10^-5 / 4 = **10^-5**. That is the relationship used to build the
table in Section 3.3, and it is why the exam can quote either rate without
ambiguity as long as Gray coding is assumed.

## 4.4 Choosing M for a channel, in three lines

**Worked**: a 1 MHz channel with roll-off alpha = 0.25 and a measured SNR of
20 dB. Which constellation?

1. Symbol rate: R_s = 1 MHz/1.25 = **800 ksym/s**
2. Candidate bit rates: QPSK 1.6 Mbps, 16-QAM 3.2 Mbps, 64-QAM 4.8 Mbps
3. Convert the channel SNR into E_b/N_0 for each candidate using
   E_b/N_0 = SNR x B/R_b: QPSK gets 100 x 1/1.6 = 62.5 = **17.96 dB**,
   16-QAM gets 100/3.2 = 31.25 = **14.95 dB**, 64-QAM gets 100/4.8 = 20.8 =
   **13.19 dB**.

Compare each with its requirement: QPSK needs 9.6 dB and has 18.0 (8.4 dB
spare), 16-QAM needs 13.4 and has 15.0 (1.5 dB spare), 64-QAM needs 17.8 and
has 13.2 — **short by 4.6 dB**. The right answer is 16-QAM, with a thin margin
that an adaptive system would abandon on the first fade. This three-line
procedure — symbol rate, bit rate, E_b/N_0 — answers every "which modulation"
question on the exam.`,
      examTip: 'Keep E_b/N_0 and SNR straight: E_s/N_0 = (E_b/N_0) x log2(M). A jump from 16-QAM to 64-QAM is +4.35 dB of E_b/N_0 but +6.1 dB of SNR, because the symbol also carries two more bits.',
      importantNote: 'The geometric penalty 10 log10[(M-1)/3] dB relative to QPSK predicts the measured requirement to within 0.3 dB for M up to 256. It is the fastest way to reconstruct the SNR table if you cannot recall the numbers.',
    },
    { id: 'digmod-pcm-pam', title: '5. PCM and PAM: Turning a Waveform into Bits',
      content: `## 5.1 The three steps, and what each one costs

Before any of the modulation above can be used, an analogue source has to
become a bit stream. Pulse code modulation does it in three steps, and each
step has one governing number.

| Step | Governing rule | What it costs |
|---|---|---|
| Sample | f_s >= 2 f_max (Nyquist) | Nothing, if the anti-alias filter is real |
| Quantize | n bits gives 2^n levels | Irreversible quantization noise |
| Encode | Bit rate R_b = n f_s | Bandwidth of at least R_b/2 |

Pulse amplitude modulation stops after the first step: the samples keep their
exact amplitudes and are sent as pulse heights. PAM is therefore analogue in
amplitude and discrete in time, needs no quantizer, and has no quantization
noise — but it also has no immunity to accumulated channel noise, because there
is no decision to regenerate. PCM's quantizer is what makes a digital link
repeatable: every regenerator restores exact levels, so a thousand hops add no
noise at all provided each hop decides correctly.

## 5.2 Quantization noise and the 6 dB rule

A uniform quantizer with step q rounds each sample to the nearest level, so the
error lies in (-q/2, +q/2) and is well modelled as uniformly distributed. Its
mean-square value is **q^2/12**, giving an rms error of q/sqrt(12) = 0.289q.
For a full-scale sinusoid on an n-bit converter this works out to

**SQNR = 6.02 n + 1.76 dB**

![Measured signal-to-quantization-noise ratio against word length, plotted against the 6.02n plus 1.76 dB rule. A full-scale sine is quantized onto two-to-the-n levels and the ratio of signal power to error power is measured directly; from eight bits upward the measurement matches the rule to better than 0.15 dB. A second series repeats the measurement for a sine backed off 6 dB from full scale, and it tracks 6 dB lower everywhere.](/courses/fe-ee/figures/comm-pcm-sqnr.svg)

The second series in the figure carries the point that catches people out: the
rule describes the SIGNAL you present, not the converter. A source that only
reaches half of full scale gives up 6 dB, and the converter's data sheet number
is unreachable in practice. Companding (A-law and mu-law) exists precisely to
flatten this out for speech, by making the step size proportional to the
amplitude so that quiet passages get fine steps.

**Worked, a design question in both directions.** A signal needs 60 dB of SQNR.
Rearranging, n >= (60 - 1.76)/6.02 = 9.67, so **10 bits** (round up — 9 bits
would deliver 55.9 dB). Going the other way: a 12-bit converter spanning 10 V
peak-to-peak has step q = 10/4096 = **2.441 mV**, maximum error q/2 =
**1.221 mV**, rms error q/sqrt(12) = **705 microvolt**, and a full-scale SQNR
of 6.02(12) + 1.76 = **74.0 dB**.

## 5.3 Rate and bandwidth, worked end to end

**Worked — telephone speech.** A 300-3400 Hz voice channel is sampled at
f_s = 8 kHz (comfortably above the 6.8 kHz Nyquist rate, leaving room for a
practical filter) and quantized to n = 8 bits.

- Bit rate: R_b = n f_s = 8 x 8000 = **64 kbps** — the number every telephony
  standard is built from
- SQNR: 6.02(8) + 1.76 = **49.9 dB**
- Minimum transmission bandwidth: R_b/2 = **32 kHz** for binary signalling at
  the Nyquist limit, and R_b/log2(M)/2 if a multilevel line code is used

**Worked — CD audio.** f_s = 44.1 kHz, n = 16 bits, 2 channels:
R_b = 44100 x 16 x 2 = **1.4112 Mbps**, with an SQNR of 6.02(16) + 1.76 =
**98.1 dB**. The sample rate is above 2 x 20 kHz for the same filter-margin
reason as the telephone case.

| Quantity | Telephone PCM | CD audio |
|---|---|---|
| Sample rate | 8 kHz | 44.1 kHz |
| Word length | 8 bits | 16 bits |
| Levels | 256 | 65 536 |
| SQNR (full scale) | 49.9 dB | 98.1 dB |
| Bit rate | 64 kbps | 1.4112 Mbps (stereo) |

The chain of reasoning — Nyquist rate, then levels from the SQNR requirement,
then bit rate, then bandwidth — is exactly the sequence an FE question walks
through, usually asking for the third or fourth link in it.`,
      examTip: 'PCM in four numbers: levels = 2^n, SQNR = 6.02n + 1.76 dB, bit rate = n f_s, minimum bandwidth = bit rate / 2. If a question asks for word length from a required SQNR, always round UP — 9.67 bits means 10.',
      importantNote: 'PAM samples but does not quantize, so it has no quantization noise and no regeneration ability. PCM accepts a fixed quantization penalty once and in exchange can be regenerated indefinitely without accumulating channel noise.',
    },
    { id: 'digmod-error-detection', title: '6. Error Detection: Parity Bits and the CRC',
      content: `## 6.1 Parity: one bit, one guarantee

A parity bit is chosen so that the total number of ones in the codeword is even
(even parity) or odd (odd parity). It is the cheapest possible check and its
guarantee is precise: **any odd number of bit errors changes the parity and is
detected; any even number is not.**

**Worked**: the byte 11010011 contains five ones. Even parity appends a **1**
(making six ones); odd parity appends a **0** (leaving five). If a single bit
flips anywhere in the nine transmitted bits, the count changes by one and the
check fails. If two bits flip, the count changes by two and the codeword still
looks valid — which is why parity alone is unacceptable on any channel where
errors arrive in bursts.

## 6.2 The CRC as a division

A cyclic redundancy check treats the message as the coefficients of a
polynomial and divides by a fixed generator polynomial, using modulo-2
arithmetic — addition and subtraction are both XOR, with no carries or borrows
anywhere. The remainder becomes the check field. For a degree-r generator the
remainder is r bits, so an r-bit frame check sequence is appended.

**Worked, in full.** Message 11010011, generator 1011 (that is, x^3 + x + 1,
degree r = 3).

1. **Append r zeros** to the message: the dividend is 11010011000.
2. **Divide modulo 2**: at each step, if the leading bit under the divisor is
   1, XOR the generator into place, then shift right one position. Carries
   never appear.
3. **Remainder**: the division leaves **011**. This is the frame check
   sequence.
4. **Transmit** message followed by FCS: **11010011011**.
5. **Receiver** divides the whole 11-bit codeword by the same generator. A
   clean codeword leaves remainder **000**; anything else means the frame is
   corrupt and is discarded.

The check is verifiable by hand and by machine, and both were run for the
numbers above. Flipping the fourth transmitted bit gives 11000011011, whose
remainder is 001 — detected. Corrupting bits 5, 6 and 7 together gives a
remainder of 100 — detected.

## 6.3 What a CRC catches, and what slips past

Exhaustively testing every error pattern against this codeword shows the
guarantees are structural, not statistical:

| Error pattern | Detected? | Reason |
|---|---|---|
| Any single bit | Always | A single-bit error polynomial x^i is never divisible by a generator with at least two terms |
| Any burst of length <= r | Always | The error polynomial has degree below the generator's |
| Odd number of bits, generator with an (x+1) factor | Always | Same argument as parity, applied to the factor |
| Error pattern equal to the generator itself | **Never** | It divides exactly and leaves remainder 000 |
| Two bits 7 apart, in this 11-bit codeword | **Never** | The 3-bit remainder repeats with period 2^3 - 1 = 7 |

The last row is the practical design rule hiding in plain sight: a degree-r CRC
protects single-bit errors uniquely only while the codeword is shorter than
2^r - 1 bits. Real generators are chosen long enough that this is never a
constraint — Ethernet's CRC-32 appends four check bytes to frames of up to
1500 bytes, catching every burst up to 32 bits and all but 2^-32 of longer
ones, which is about one undetected frame in four billion.

| Scheme | Overhead | Detects | Typical use |
|---|---|---|---|
| Single parity bit | 1 bit | Odd numbers of errors | Serial links, memory |
| Two-dimensional parity | 1 bit per row and column | All 1-, 2- and 3-bit errors; locates single errors | Simple block formats |
| Checksum (sum of words) | 16-32 bits | Most random errors; misses reordering | IP, UDP, TCP headers |
| CRC-32 | 32 bits | All bursts <= 32 bits | Ethernet, disk sectors |

## 6.4 Detection is not correction

All of the above only DETECT. Acting on the detection needs either a return
path for retransmission (ARQ) or enough added redundancy to correct in place
(forward error correction). The dividing quantity is the minimum Hamming
distance d of the code: a code with minimum distance d detects up to **d - 1**
errors, or corrects up to **floor((d - 1)/2)**. A single parity bit gives
d = 2 — detect one, correct none. Correcting even a single bit needs d = 3,
which is what the Hamming codes achieve with r check bits over
2^r - r - 1 data bits.

**Worked**: how many check bits does a single-error-correcting Hamming code
need for 8 data bits? The requirement is 2^r >= r + k + 1, so with k = 8:
r = 3 gives 8 >= 12 (fails), r = 4 gives 16 >= 13 (works). **Four check bits**,
a 12-bit codeword. The FE exam usually asks this as "how many redundant bits",
and the inequality answers it in one line.`,
      examTip: 'CRC arithmetic is XOR without carries. Append r zeros, divide by the generator, and send the remainder as the check field; the receiver divides the whole codeword and expects a zero remainder. Distance rules: detect d - 1 errors, correct floor((d-1)/2).',
      importantNote: 'A parity bit misses every even number of errors, and a CRC misses exactly those error patterns that are multiples of its generator polynomial. Both failures are structural, not improbable accidents — which is why burst-prone channels use a CRC with a carefully chosen generator rather than a longer checksum.',
    },
  ],
  keyTakeaways: [
    'ASK (noise-sensitive), FSK (moderate), PSK (robust), QAM (high efficiency).',
    'BPSK: 1 bit/symbol; QPSK: 2 bits/symbol with same BW and same BER as BPSK.',
    'QAM: 16-QAM = 4 bits/symbol, 64-QAM = 6; bits/symbol = log_2(M).',
    'Each quadrupling of constellation size (two more bits/symbol) costs ~6 dB more SNR, i.e. ~3 dB per extra bit.',
    'PCM: SQNR = 6.02n + 1.76 dB; bit rate = n f_s; minimum bandwidth = half the bit rate.',
    'Parity catches any odd number of bit errors; a degree-r CRC catches every burst up to r bits.',
    'BER for BPSK/QPSK: Q(sqrt(2 E_b/N_0)); E_b/N_0 = (S/N)*(B/R_b).',
    'Gray coding minimizes bit errors; adaptive modulation matches M to channel.',
  ],
},

fee_noise_snr: { topicId: 'fee_noise_snr', title: 'Noise and Signal-to-Noise Ratio', domainWeight: 'Communications · 4–6%',
  overview: 'Noise sets the fundamental limit on communication system performance. Understanding thermal noise power, noise figure, cascade noise analysis, and SNR calculations is essential for designing receivers. The Friis cascade formula is one of the most frequently tested communications concepts on the FE exam.',
  sections: [
    { id: 'noise-thermal', title: '1. Noise Sources and Thermal Noise',
      content: `## 1.1 Types of Noise

| Noise Type | Source | Spectrum |
|---|---|---|
| **Thermal (Johnson)** | Random electron motion in resistors | White (flat) |
| **Shot** | Discrete charge carriers (diodes) | White |
| **Flicker (1/f)** | Surface defects in semiconductors | Pink |
| **Quantization** | ADC rounding | White (approx.) |

## 1.2 Thermal Noise Power

**$P_n = k T B$**

- k = 1.38 x 10^-23 J/K (Boltzmann constant)
- T = temperature in Kelvin (standard: 290 K)
- B = noise bandwidth (Hz)

At room temperature: **P_n = -174 dBm/Hz** (memorize this!)

For bandwidth B: **P_n(dBm) = -174 + 10 log_10(B)**

## 1.3 Signal-to-Noise Ratio

**$SNR = P_{signal} / P_{noise}$** (linear)

**SNR(dB) = 10 log_10(P_signal / P_noise) = P_signal(dBm) - P_noise(dBm)**`,
      examTip: 'Memorize -174 dBm/Hz as thermal noise floor at room temperature. For noise in 1 MHz bandwidth: P_n = -174 + 60 = -114 dBm. This is the fastest way to solve FE noise problems.',
      importantNote: 'Temperature must be in Kelvin. Room temp is T_0 = 290 K (not 300 K). If a problem specifies a different temperature, use that value.',
    },
    { id: 'noise-cascade', title: '2. Noise Figure and Friis Cascade Formula',
      content: `## 2.1 Noise Figure

**$F = SNR_{in} / SNR_{out}$** (linear, >= 1)

**$NF = 10 \\log _10(F)$** (dB, >= 0)

- Ideal amplifier: F = 1 (NF = 0 dB)
- Passive attenuator with loss L: **$F = L$** (noise figure equals attenuation)
- Typical LNA: NF = 0.5-2 dB; typical mixer: NF = 6-10 dB

## 2.2 Noise Temperature

**T_e = (F - 1) * T_0** where T_0 = 290 K

## 2.3 Friis Cascade Formula

**F_total = F_1 + (F_2 - 1)/G_1 + (F_3 - 1)/(G_1 * G_2) + ...**

### Critical Insight

Each stage's noise contribution is **divided by cumulative gain** of preceding stages:
- **First stage dominates** when G_1 is large
- **LNA as first stage** minimizes system noise figure
- A 3 dB cable loss BEFORE the LNA has F = 2, severely degrading the system

| Cascade Example | F_total Impact |
|---|---|
| LNA first (NF=1 dB, G=20 dB) | System NF ~ 1.1 dB |
| 3 dB cable first, then LNA | System NF ~ 4 dB |`,
      examTip: 'Friis formula: place lowest NF device FIRST with maximum gain. If G_1 = 100 (20 dB), second stage noise barely matters. A passive loss BEFORE the LNA is devastating.',
      importantNote: 'A cable/filter with 3 dB loss placed before the LNA adds F = 2 to the cascade, often doubling the system noise figure. Always put the LNA as close to the antenna as possible.',
    },
    { id: 'noise-worked', title: '3. Noise Calculation Walkthrough',
      content: `## 3.1 Three-Stage Amplifier Friis Cascade

**Given**: Stage 1: F_1 = 2 dB, G_1 = 20 dB. Stage 2: F_2 = 6 dB, G_2 = 10 dB. Stage 3: F_3 = 10 dB.

**Step 1 — Convert to linear**:

| Parameter | dB | Linear |
|---|---|---|
| F_1 | 2 dB | $10^{2/10} = 1.585$ |
| G_1 | 20 dB | $10^{20/10} = 100$ |
| F_2 | 6 dB | $10^{6/10} = 3.981$ |
| G_2 | 10 dB | $10^{10/10} = 10$ |
| F_3 | 10 dB | $10^{10/10} = 10$ |

**Step 2 — Friis cascade formula**:

$$F_{total} = F_1 + (F_2 - 1)/G_1 + (F_3 - 1)/(G_1 * G_2)$$

$$F_{total} = 1.585 + (3.981 - 1)/100 + (10 - 1)/(100 * 10)$$

$$F_{total} = 1.585 + 0.0298 + 0.009 = 1.624$$

**$NF_{total} = 10 \\log _10(1.624) = 2.11\\ \\mathrm{dB}$**

The first stage dominates: 1.585 of 1.624 total. Stages 2 and 3 contribute only 0.039 combined.

## 3.2 Thermal Noise Power for B = 1 MHz at T = 290 K

**Method 1 — Direct**: P_n = kTB = 1.38e-23 * 290 * 1e6 = **$4.0 x 10^-15\\ \\mathrm{W}$**

**Method 2 — dBm shortcut** (faster on exam):

P_n(dBm) = -174 + 10 log_10(B) = -174 + 10 log_10(10^6) = -174 + 60 = **-114 dBm**

| Bandwidth | Noise Power |
|---|---|
| 1 Hz | -174 dBm |
| 1 kHz | -144 dBm |
| **1 MHz** | **-114 dBm** |
| 1 GHz | -84 dBm |

**Exam strategy**: Always convert NF and gain to linear before applying Friis. The dBm shortcut (-174 + 10 log B) is the fastest approach for thermal noise. Verify that stage 1 dominates — if it does not, the receiver design is suboptimal.`,
      examTip: 'Friis step-by-step: (1) convert all dB to linear, (2) apply formula, (3) convert result back to dB. The most common error is mixing dB and linear in the same equation.',
      importantNote: 'If the first stage has low gain (e.g., a passive mixer at G = -6 dB = 0.25 linear), later stages dominate noise. Reorder or add an LNA before the mixer.',
    },
    { id: 'noise-floor-detail', title: '4. The Noise Floor in Numbers',
      content: `## 4.1 Where -174 dBm/Hz actually comes from

The available noise power a resistor delivers to a matched load is P_n = kTB,
and the striking thing about that expression is what is missing: the
resistance. A 50 ohm resistor and a 1 megohm resistor at the same temperature
deliver the same available noise power into their own matched loads. The
resistance sets the open-circuit noise VOLTAGE,
**V_n = sqrt(4 k T B R)**, but a larger R also raises the source impedance by
exactly enough to cancel the difference in delivered power.

**Worked**: at T = 290 K in a 10 kHz bandwidth, a 1 kilohm resistor produces
V_n = sqrt(4 x 1.381e-23 x 290 x 10^4 x 10^3) = **0.400 microvolt** open
circuit, while a 1 megohm resistor produces **12.66 microvolt** — a factor of
31.6, as the square root of a thousand demands. Both deliver
kTB = 4.00 x 10^-17 W = **-134 dBm** of available power.

The spectral density that the whole subject hangs on is therefore
N_0 = kT_0 with the standard reference temperature T_0 = 290 K (a tabulated
convention, not room temperature exactly):

**N_0 = 1.381 x 10^-23 x 290 = 4.004 x 10^-21 W/Hz = -173.98 dBm/Hz**

which is the -174 dBm/Hz everyone quotes, rounded by two hundredths of a
decibel. Use -174; carry the exact value only if a problem asks for watts.

| Bandwidth | 10 log10(B) | Noise power kT_0B | In watts |
|---|---|---|---|
| 1 Hz | 0 dB | -174 dBm | 4.00 x 10^-21 W |
| 1 kHz | 30 dB | -144 dBm | 4.00 x 10^-18 W |
| 200 kHz | 53.0 dB | -121.0 dBm | 8.01 x 10^-16 W |
| 1 MHz | 60 dB | -114 dBm | 4.00 x 10^-15 W |
| 20 MHz | 73.0 dB | -101.0 dBm | 8.01 x 10^-14 W |
| 1 GHz | 90 dB | -84 dBm | 4.00 x 10^-12 W |

Every entry is -174 plus ten times the log of the bandwidth. The only judgement
call is which bandwidth to use, and the answer is the NOISE bandwidth of the
narrowest filter in the chain — not the 3 dB bandwidth. For a single-pole RC
response the two differ by a factor pi/2, so using the 3 dB figure
underestimates the noise by **1.96 dB**. Sharper filters converge on their 3 dB
value, which is why the distinction rarely appears in exam numbers but always
appears in real measurements.

## 4.2 Temperature, in kelvin, always

Noise power is proportional to absolute temperature, so a receiver cooled from
290 K to 77 K (liquid nitrogen) sees its thermal contribution fall by
10 log10(290/77) = 5.76 dB. This is why radio astronomy and deep-space
receivers are cryogenic, and why noise temperature rather than noise figure is
the natural unit for that work:

**T_e = (F - 1) T_0**

| Noise figure | Noise factor F | Equivalent noise temperature T_e |
|---|---|---|
| 0.5 dB | 1.122 | 35.4 K |
| 1.0 dB | 1.259 | 75.1 K |
| 2.0 dB | 1.585 | 169.6 K |
| 3.0 dB | 1.995 | 288.6 K |
| 6.0 dB | 3.981 | 864.5 K |
| 10.0 dB | 10.00 | 2610 K |

Noise temperature adds where noise figure multiplies, which makes system budgets
additive: a 50 K antenna feeding a 1 dB LNA gives
T_sys = 50 + 75.1 = **125.1 K**. Below about 3 dB the two scales stop being
interchangeable in your head — 0.5 dB and 1.0 dB look close together but
differ by more than a factor of two in temperature.

## 4.3 Putting a signal on the floor

**Worked**: a receiver with the 2.105 dB cascade noise figure computed in
Section 3.1 handles a -80 dBm signal in a 1 MHz channel.

- Input noise: -174 + 60 = **-114 dBm**
- Input SNR: -80 - (-114) = **34.0 dB**
- Output SNR: 34.0 - 2.105 = **31.9 dB**, because that is what a noise figure
  means — the decibels of SNR the receiver itself destroys

The same three lines run backwards give sensitivity. If this receiver needs
10 dB of SNR to demodulate, the smallest usable signal is
-114 + 2.105 + 10 = **-101.9 dBm**. Written as one formula, the minimum
discernible signal is

**MDS (dBm) = -174 + 10 log10(B) + NF + SNR_required**

which is the single most useful line in receiver design, and the origin of the
-75 dBm sensitivity marked in the link-budget figure of the companion topic
(20 MHz, NF 6 dB, 20 dB required SNR gives -174 + 73.0 + 6 + 20 = -75.0 dBm).`,
      examTip: 'Noise power kTB does not depend on the resistance — only the noise voltage does. If a problem gives you a resistor value and asks for available noise power, the resistance is a distractor; if it asks for volts, use V_n = sqrt(4kTBR).',
      importantNote: 'Use the NOISE bandwidth, not the 3 dB bandwidth. For a single-pole filter they differ by pi/2, or 1.96 dB of underestimated noise. Multi-pole filters converge on the 3 dB value.',
    },
    { id: 'noise-cascade-design', title: '5. Cascade Design: Friis as a Budget',
      content: `## 5.1 The one picture the formula deserves

Friis says each stage's noise contribution is divided by everything ahead of
it. Plotting that against the first amplifier's gain turns the formula into a
design rule you can see.

![System noise figure against the gain of the first amplifier, computed from the Friis cascade formula for two orderings of the same hardware. The lower curve is a 1 dB LNA followed by a 6 dB stage, and it falls towards the LNA's own 1 dB floor. The upper curve is the same chain with 3 dB of feed cable in front, and it sits exactly 3.00 dB above the lower curve at every gain.](/courses/fe-ee/figures/comm-friis-cascade.svg)

Three things are worth extracting from it:

- **The floor is the first stage.** No amount of gain drives the system noise
  figure below the LNA's own 1.00 dB. Gain suppresses everything AFTER the
  first stage; it cannot improve the first stage.
- **Most of the benefit arrives by 15-20 dB of gain.** At G_1 = 10 dB the
  system is still 0.92 dB above the floor; by G_1 = 20 dB it sits at
  **1.10 dB**, only 0.10 dB above it. A further 10 dB of first-stage gain
  closes that to 0.01 dB — a real but tiny improvement bought at the cost of
  linearity and stability, which is why front-end gain stops around there.
- **The penalty for loss in front is exactly the loss.** The two curves are
  separated by 3.000 dB everywhere, because a passive attenuator has F = L and
  its own gain is 1/L, so both terms scale together. Three decibels of feed
  cable costs three decibels of system noise figure, no more and no less, and
  the arithmetic works out the same for 0.5 dB or 10 dB.

At G_1 = 20 dB the two orderings read **1.10 dB** and **4.10 dB**. Both use the
same LNA and the same following stage. The only difference is which side of the
LNA the cable is on — which is why mast-head amplifiers exist.

## 5.2 The mixer-first mistake, quantified

Passive mixers have conversion LOSS, so putting one first is the same trap as
the cable, only worse because a mixer's noise figure is high as well.

**Worked**: a mixer with NF = 8 dB and conversion gain -6 dB (linear 0.251),
followed by an IF amplifier with NF = 4 dB.

F_total = 6.310 + (2.512 - 1)/0.251 = 6.310 + 6.019 = 12.33, so
**NF = 10.91 dB** — the IF stage contributes nearly half the total, because
there is no gain in front to suppress it.

Now insert the 1 dB, 20 dB LNA in front of that same mixer and IF:

F_total = 1.259 + (6.310 - 1)/100 + (2.512 - 1)/(100 x 0.251) = 1.259 + 0.053 +
0.060 = 1.372, or **1.37 dB**. One component in the right place has taken
9.5 dB out of the system noise figure, and it did so by dividing the two bad
stages by 20 dB of gain.

| Chain order | System noise figure |
|---|---|
| LNA (1 dB, 20 dB gain), then 6 dB stage | 1.10 dB |
| 3 dB cable, then that LNA and stage | 4.10 dB |
| Mixer (8 dB, -6 dB gain), then IF (4 dB) | 10.91 dB |
| LNA, then that mixer and IF | 1.37 dB |

## 5.3 G/T: one number for a whole receiving station

For satellite and radio-astronomy links the antenna and receiver are judged
together by the figure of merit **G/T**, the antenna gain divided by the system
noise temperature, quoted in dB/K:

**G/T (dB/K) = G (dBi) - 10 log10(T_sys)**

**Worked**: a 40 dBi dish on a receiver with T_sys = 150 K gives
G/T = 40 - 21.76 = **18.24 dB/K**. Doubling the dish area (+3 dB) and halving
the system temperature (-3 dB in the denominator term) are worth exactly the
same to the link, which is the practical value of collapsing both into one
number: it tells you where the next decibel is cheapest.

The same reasoning explains a design that looks wrong at first sight. A
cryogenic front end that lowers T_sys from 150 K to 75 K improves G/T by 3 dB —
identical to doubling the collecting area of the dish, and usually far cheaper
than doubling a large reflector.`,
      examTip: 'The cascade question almost always reduces to one comparison: what is in front of the gain? Loss ahead of the LNA adds one-for-one to the system noise figure; loss behind 20 dB of gain is essentially free.',
      importantNote: 'A passive component of loss L has F = L and G = 1/L simultaneously. Both facts are needed in Friis — using F = L while forgetting G = 1/L is the most common cascade error, and it under-predicts the damage badly.',
    },
  ],
  keyTakeaways: [
    'Thermal noise: P_n = kTB; at room temp, noise floor = -174 dBm/Hz.',
    'Noise figure F = SNR_in/SNR_out; NF(dB) = 10 log_10(F); lower is better.',
    'Friis cascade: F_total = F_1 + (F_2-1)/G_1 + (F_3-1)/(G_1*G_2) + ...',
    'First stage dominates: place lowest-NF device first with maximum gain.',
    'Noise temperature: T_e = (F-1)*T_0; passive loss L has F = L.',
    'SNR(dB) = P_signal(dBm) - P_noise(dBm).',
  ],
},

fee_channel_cap: { topicId: 'fee_channel_cap', title: 'Channel Capacity & Shannon-Hartley Theorem', domainWeight: 'Communications · 4–6%',
  overview: 'The Shannon-Hartley theorem establishes the absolute maximum information rate for a noisy channel. This limit applies to every modulation and coding scheme. Understanding how capacity depends on bandwidth and SNR, and the E_b/N_0 metric, is essential for the FE exam.',
  sections: [
    { id: 'shannon-cap', title: '1. Shannon-Hartley Theorem',
      content: `## 1.1 Channel Capacity

**C = B * log_2(1 + S/N)** (bits/second)

- C = maximum achievable bit rate with arbitrarily low error
- B = bandwidth (Hz), S/N = signal-to-noise ratio (LINEAR, not dB)

### Key Properties

| Property | Detail |
|---|---|
| SNR dependence | Logarithmic -- doubling power adds ~1 bit/s/Hz at high SNR |
| BW dependence | Linear -- doubling BW doubles C if SNR constant |
| +3 dB SNR | Adds ~1 bit/s/Hz spectral efficiency |
| +10 dB SNR | Adds ~3.32 bits/s/Hz |

## 1.2 Bandwidth-Limited vs. Power-Limited

| Regime | Strategy |
|---|---|
| **BW-limited** (high SNR) | Use higher-order modulation (more bits/symbol) |
| **Power-limited** (low SNR) | Spread over wider BW, low-order modulation |

## 1.3 Shannon Limit

As BW -> infinity: **C_max = 1.44 * S/N_0** where N_0 is noise PSD. Even infinite bandwidth gives finite capacity.`,
      examTip: 'ALWAYS check if SNR is given in linear or dB. If dB, convert first: S/N(linear) = 10^(SNR_dB/10). A 20 dB SNR = 100 linear, so C = B*log_2(101). Forgetting this conversion is the #1 exam mistake.',
      importantNote: 'Shannon capacity is a theoretical MAXIMUM. Real systems operate below it. If a problem says capacity = C, no system can exceed it -- but not every system achieves it.',
    },
    { id: 'ebn0', title: '2. E_b/N_0 and Spectral Efficiency',
      content: `## 2.1 Energy per Bit

**E_b/N_0 = (S/N) * (B/R_b)**

- E_b = energy per information bit (J)
- N_0 = noise power spectral density (W/Hz)
- R_b = bit rate (bps)

E_b/N_0 is the **universal figure of merit** for digital communication.

## 2.2 Shannon Limit for E_b/N_0

At capacity: **$E_b/N_0 >= \\ln (2) = -1.59\\ \\mathrm{dB}$** (theoretical minimum)

| Modulation | Required E_b/N_0 for BER = 10^-5 |
|---|---|
| BPSK/QPSK | ~9.6 dB |
| 16-QAM | ~13.4 dB |
| 64-QAM | ~17.8 dB |

## 2.3 Spectral Efficiency

**eta = R_b / B = log_2(1 + S/N)** at capacity

Higher spectral efficiency requires higher SNR -- no free lunch.`,
      examTip: 'E_b/N_0 = (S/N)*(B/R_b) bridges analog and digital metrics. Shannon limit of -1.59 dB is theoretical; practical systems need 5-18 dB depending on modulation.',
    },
    { id: 'shannon-worked', title: '3. Shannon Capacity Problems',
      content: `## 3.1 Calculate C for B = 4 kHz, SNR = 31

**Given**: Bandwidth B = 4 kHz, SNR = 31 (linear — NOT dB).

C = B * log_2(1 + S/N) = 4000 * log_2(1 + 31) = 4000 * log_2(32) = 4000 * 5 = **20,000 bps = 20 kbps**

**Verification**: This is the classic telephone channel result. 4 kHz voice band with 31 linear SNR (~15 dB) gives 20 kbps — matching V.34 modem rates.

**Common trap**: If SNR were given as 15 dB instead, you must convert: S/N = 10^(15/10) = 31.6, then C = 4000 * log_2(32.6) ≈ 20.1 kbps.

## 3.2 Minimum E_b/N_0 for Reliable Communication

At Shannon limit: **$E_b/N_0 >= \\ln (2) = 0.693 = -1.59\\ \\mathrm{dB}$**

No system can communicate reliably below this threshold, regardless of coding or modulation.

| System | E_b/N_0 Required | Gap from Shannon |
|---|---|---|
| Shannon limit | -1.59 dB | 0 dB |
| Turbo codes | ~0.7 dB | ~2.3 dB |
| BPSK uncoded | ~9.6 dB | ~11.2 dB |
| 16-QAM uncoded | ~13.4 dB | ~15.0 dB |

Modern turbo and LDPC codes operate within 1 dB of Shannon limit.

## 3.3 Bandwidth-Limited vs Power-Limited Comparison

**Scenario A — Bandwidth-limited**: B = 1 MHz, SNR = 30 dB (1000 linear)
C = 10^6 * log_2(1001) ≈ 10^6 * 9.97 = **9.97 Mbps**
Strategy: use 256-QAM or higher to approach capacity.

**Scenario B — Power-limited**: B = 10 MHz, SNR = 0 dB (1 linear)
C = 10^7 * log_2(2) = 10^7 * 1 = **10 Mbps**
Strategy: spread over wide bandwidth with BPSK + coding.

Both achieve ~10 Mbps but with opposite strategies. The bandwidth-limited system uses high-order modulation; the power-limited system uses wide bandwidth with robust modulation.

**Exam strategy**: Always check SNR units (dB vs linear). If log_2 is hard to compute, use log_2(x) = 3.32 * log_10(x). Memorize: log_2(2)=1, log_2(4)=2, log_2(8)=3, log_2(32)=5, log_2(1024)=10.`,
      examTip: 'Shortcut: log_2(x) = 3.322 * log_10(x). For SNR = 31, log_2(32) = 5 exactly. Memorize powers of 2 — the FE exam loves clean numbers like 32, 64, 1024.',
      importantNote: 'Shannon capacity is the UPPER BOUND. If a problem asks "can system X achieve rate R?" and R > C, the answer is always NO, regardless of the modulation or coding scheme used.',
    },
    { id: 'shannon-frontier', title: '4. The Capacity Frontier, and How Far Real Systems Sit From It',
      content: `## 4.1 The bound written the way a designer uses it

C = B log2(1 + S/N) answers "what rate can this channel carry?" The design
question usually runs the other way: "I want eta = C/B bits per second per
hertz — what signal quality does that demand?" Rearranging the theorem for the
required energy per bit gives the frontier in its most useful form:

**E_b/N_0 = (2^eta - 1) / eta**

![The Shannon capacity bound plotted as spectral efficiency against Eb/N0, computed from Eb/N0 = (2^eta - 1)/eta. The curve approaches a vertical asymptote at minus 1.59 dB as eta goes to zero. Four markers show what uncoded BPSK, QPSK, 16-QAM and 64-QAM actually require for a bit error rate of ten to the minus five, each sitting between 7.6 and 9.6 dB to the right of the bound at the same spectral efficiency.](/courses/fe-ee/figures/comm-shannon-bound.svg)

The vertical asymptote is the famous number. As eta goes to zero,
(2^eta - 1)/eta approaches ln 2 = 0.693 = **-1.59 dB**, and the plot makes
clear what that limit does and does not say: it is reachable only in the limit
of infinite bandwidth per bit. At any spectral efficiency you would actually
build, the bound is well to the right of -1.59 dB — 0 dB at 1 bit/s/Hz,
5.74 dB at 4 bits/s/Hz, 10.21 dB at 6 bits/s/Hz.

## 4.2 The cost of each extra bit per second per hertz

Working from S/N = 2^eta - 1, the required SNR for each spectral efficiency is
a table worth knowing, because the increments tell the whole story of
diminishing returns:

| eta (bits/s/Hz) | Required S/N | In dB | Step from the row above |
|---|---|---|---|
| 1 | 1 | 0.00 dB | — |
| 2 | 3 | 4.77 dB | +4.77 dB |
| 3 | 7 | 8.45 dB | +3.68 dB |
| 4 | 15 | 11.76 dB | +3.31 dB |
| 5 | 31 | 14.91 dB | +3.15 dB |
| 6 | 63 | 17.99 dB | +3.08 dB |
| 10 | 1023 | 30.10 dB | +3.01 dB per bit |

The steps converge on 3.01 dB, because at high SNR each extra bit per hertz
requires doubling (1 + S/N). That single fact is the quantitative core of
"capacity grows logarithmically with power": **doubling transmit power buys one
extra bit per second per hertz, and nothing more, however much power you
started with.** Bandwidth, by contrast, multiplies capacity almost
proportionally as long as the SNR stays high.

## 4.3 What "close to Shannon" means, measured properly

The gap between a real scheme and the bound has to be measured at the SAME
spectral efficiency, or the comparison is meaningless. Doing that with the
uncoded requirements from the digital-modulation topic:

| Scheme | eta | Needs (BER 10^-5) | Bound at that eta | Gap |
|---|---|---|---|---|
| BPSK | 1 | 9.59 dB | 0.00 dB | 9.6 dB |
| QPSK | 2 | 9.59 dB | 1.76 dB | 7.8 dB |
| 16-QAM | 4 | 13.43 dB | 5.74 dB | 7.7 dB |
| 64-QAM | 6 | 17.79 dB | 10.21 dB | 7.6 dB |

Two conclusions follow. First, uncoded modulation of any order sits roughly
7.6-9.6 dB from capacity — the gap is a property of having no coding, not of
the constellation. Second, comparing BPSK's 9.59 dB against the -1.59 dB
asymptote and calling the difference 11.2 dB overstates the available gain,
because -1.59 dB belongs to a system with vanishing spectral efficiency, and
BPSK delivers 1 bit/s/Hz. The honest figure for how much coding can recover at
fixed spectral efficiency is the last column, and modern LDPC and turbo codes
claim most of it.

## 4.4 Capacity as a sanity check on a design

**Worked — the dial-up plateau.** A telephone channel of B = 3.4 kHz at 36 dB
SNR has C = 3400 log2(1 + 3981) = **40.7 kbps**. Practical modems reached
33.6 kbps, about 83% of it, and the last step to 56 kbps was only possible by
removing one of the two analogue-to-digital conversions from the path — the
theorem was not beaten, the channel was changed.

**Worked — bandwidth against power.** A link has S/N_0 = 10^9 (that is, 30 dB
SNR in 1 MHz). Spending the same power over different bandwidths:

| Bandwidth | Resulting SNR | Capacity |
|---|---|---|
| 0.5 MHz | 33.0 dB | 5.48 Mbps |
| 1 MHz | 30.0 dB | 9.97 Mbps |
| 2 MHz | 27.0 dB | 17.94 Mbps |
| 10 MHz | 20.0 dB | 66.58 Mbps |
| 100 MHz | 10.0 dB | 345.9 Mbps |
| Infinite | — | 1.443 Gbps (the 1.44 S/N_0 limit) |

Doubling the bandwidth at fixed power nearly doubles capacity (9.97 to
17.94 Mbps) while doubling the POWER at fixed bandwidth adds only 1.00 Mbps
(9.97 to 10.97). Bandwidth is the cheaper resource whenever it is available —
until the noise floor rises with it and the process saturates at
C_max = 1.44 S/N_0, which is the same asymptote as the -1.59 dB limit seen from
the other side.

## 4.5 The four ways this gets asked

| Question form | The move |
|---|---|
| "Maximum data rate" with SNR in dB | Convert to linear FIRST, then C = B log2(1 + S/N) |
| "Can scheme X at rate R work here?" | Compute C; if R > C the answer is no, whatever the coding |
| "How much SNR for eta bits/s/Hz?" | S/N = 2^eta - 1 |
| "Minimum E_b/N_0" with no bandwidth given | -1.59 dB, and say that it needs unlimited bandwidth |`,
      examTip: 'Two rearrangements cover nearly every capacity question: S/N = 2^eta - 1 for the SNR a spectral efficiency demands, and E_b/N_0 = (2^eta - 1)/eta for the energy per bit it demands. Both come from the same theorem in one line of algebra.',
      importantNote: 'At high SNR each extra bit/s/Hz costs exactly 3.01 dB of power, so doubling transmitter power buys one bit per hertz — no more. Doubling bandwidth nearly doubles capacity instead, which is why wideband systems win whenever spectrum is available.',
    },
    { id: 'shannon-coding-tradeoff', title: '5. Coding: Buying Power Efficiency with Spectral Efficiency',
      content: `## 5.1 What a code rate actually trades

A code of rate r sends one information bit for every 1/r transmitted bits. On a
fixed channel that means the spectral efficiency drops: a rate-1/2 code on
16-QAM delivers eta = 4 x 0.5 = 2 bits/s/Hz instead of 4. Nothing is free —
what the code buys is a lower required E_b/N_0, and the bound tells you the
most that can possibly be bought.

| Scheme | eta = r log2(M) | Bound requires E_b/N_0 | Bound requires SNR |
|---|---|---|---|
| QPSK uncoded | 2.00 | 1.76 dB | 4.77 dB |
| QPSK, r = 3/4 | 1.50 | 0.86 dB | 2.62 dB |
| QPSK, r = 1/2 | 1.00 | 0.00 dB | 0.00 dB |
| 16-QAM, r = 3/4 | 3.00 | 3.68 dB | 8.45 dB |
| 64-QAM, r = 2/3 | 4.00 | 5.74 dB | 11.76 dB |
| 64-QAM, r = 5/6 | 5.00 | 7.92 dB | 14.91 dB |

Read a row pair to see the trade: moving from uncoded QPSK to rate-1/2 QPSK
halves the data rate and lowers the theoretical energy requirement by 1.76 dB —
but the practical saving is much larger than that, because the uncoded scheme
is not sitting on its bound. Uncoded QPSK needs 9.59 dB in practice; a good
rate-1/2 code operating near its own bound of 0.00 dB recovers most of that
7.8 dB gap. **Coding gain is the distance you close to the bound, not the
distance between two bounds.**

## 5.2 Why adaptive modulation exists

Because every (modulation, rate) pair has its own requirement, a system that
can switch between them tracks the channel instead of designing for its worst
hour. Modern standards carry a ladder of these pairs — this is the table a
Wi-Fi or LTE scheduler is walking up and down every few milliseconds.

**Worked**: an 800 ksym/s link carrying 16-QAM delivers 3.2 Mbps uncoded. Add a
rate-1/2 code and the payload falls to **1.6 Mbps**, the same throughput as
uncoded QPSK — but with several decibels more robustness, because the coded
16-QAM decision uses soft information from four bits per symbol rather than
hard decisions on two. Which of the two identically-fast options is better
depends entirely on the SNR available, and that decision is what adaptive
modulation automates.

## 5.3 What the exam expects you to say about coding

- **Rate r reduces throughput to r times the uncoded value** and reduces the
  required E_b/N_0.
- **Coding gain is quoted in dB at a stated BER** — it has no meaning without
  one, because the curves are not parallel at low SNR.
- **Soft-decision decoding beats hard-decision** by roughly 2 dB, because
  handing the decoder a confidence value costs nothing but discards less
  information than a bare 1 or 0.
- **No code beats the bound.** If a question offers a scheme achieving a rate
  above B log2(1 + S/N), it is wrong by construction, and the reasoning takes
  one line to write down.`,
      examTip: 'Coding gain is measured at a fixed BER, and a code rate r multiplies your throughput by r. If a question compares two schemes, compute the spectral efficiency of each first — many "which is better" answers turn on the two ending up at the same eta.',
      importantNote: 'The -1.59 dB Shannon limit applies at vanishing spectral efficiency. At the efficiencies real systems use, the relevant bound is E_b/N_0 = (2^eta - 1)/eta, which is several decibels higher — quoting -1.59 dB as the target for a 6 bit/s/Hz link is off by nearly 12 dB.',
    },
  ],
  keyTakeaways: [
    'Shannon: C = B * log_2(1 + S/N); absolute maximum reliable rate.',
    'Capacity grows logarithmically with SNR but linearly with bandwidth.',
    'Every 10 dB SNR increase adds ~3.32 bits/s/Hz.',
    'E_b/N_0 = (S/N)*(B/R_b); universal digital link quality metric.',
    'Shannon limit: E_b/N_0 >= -1.59 dB; practical systems need 5-18 dB.',
    'Always convert SNR from dB to linear before using Shannon formula.',
  ],
},

fee_multiplexing: { topicId: 'fee_multiplexing', title: 'Multiplexing: TDM, FDM, CDM', domainWeight: 'Communications · 4–6%',
  overview: 'Multiplexing combines multiple signals onto a single shared channel. FDM separates users in frequency, TDM in time, CDM by unique spreading codes. Each has distinct bandwidth, complexity, and interference characteristics.',
  sections: [
    { id: 'mux-fdm-tdm', title: '1. FDM and TDM',
      content: `## 1.1 Frequency Division Multiplexing (FDM)

Each user gets a **distinct frequency band**. All transmit simultaneously at different frequencies.

- **Total BW** = B_1 + B_2 + ... + B_n + guard bands
- Guard bands prevent adjacent-channel interference
- Analog-friendly: AM/FM radio, cable TV

## 1.2 Time Division Multiplexing (TDM)

Each user takes turns using **full bandwidth** in assigned time slots.

| TDM Type | Slot Assignment | Efficiency |
|---|---|---|
| **Synchronous** | Fixed per user | Low (wastes idle slots) |
| **Statistical** | Dynamic, on-demand | High |

- **Total rate**: R_total = R_1 + R_2 + ... + R_n
- **T1 frame**: 24 channels * 8 bits + 1 framing = 193 bits, 8000 frames/s = **1.544 Mbps**

## 1.3 FDM vs. TDM

| Feature | FDM | TDM |
|---|---|---|
| Domain | Frequency | Time |
| Simultaneous | Yes (different freqs) | No (turns) |
| Guards | Frequency guard bands | Time guard intervals |
| Best for | Analog | Digital |`,
      examTip: 'T1 = 1.544 Mbps (24 * 64 kbps + 8 kbps framing). For FDM bandwidth, do not forget guard bands.',
      importantNote: 'Synchronous TDM wastes bandwidth when users are idle. Statistical TDM solves this with dynamic slot assignment but adds variable delay and buffering complexity.',
    },
    { id: 'mux-cdm-wdm', title: '2. CDM, CDMA, and WDM',
      content: `## 2.1 Code Division Multiplexing (CDMA)

All users transmit **simultaneously on same frequency** using unique orthogonal spreading codes.

1. Each user has unique **PN code** of length L
2. Data multiplied by code, spreading BW by factor L
3. Receiver correlates with desired code to extract data

**Spreading gain**: **$G_p = BW_{spread} / BW_{data} = L$**

### CDMA Properties

- **Soft capacity limit**: more users = higher noise floor, no hard cutoff
- **Near-far problem**: strong nearby signals drown weak distant ones -- requires **power control**
- **Graceful degradation**: performance degrades gradually with users

## 2.2 Wavelength Division Multiplexing (WDM)

FDM for fiber optics using different optical wavelengths:
- **CWDM**: ~18 channels, 20 nm spacing
- **DWDM**: 40-160+ channels, 0.8 nm spacing, terabit/s capacity

## 2.3 OFDM

Divides wideband channel into many narrow orthogonal subcarriers:
- Used in WiFi, 4G LTE, 5G NR
- Resilient to multipath fading
- Efficient spectrum use (overlapping but orthogonal)`,
      examTip: 'CDMA spreading gain = code length L. Near-far problem is the critical practical limitation -- without power control, CDMA fails.',
    },
    { id: 'mux-worked', title: '3. Multiplexing Design Problems',
      content: `## 3.1 TDM Frame Structure for 24 Channels at 64 kbps

**Design a T1 TDM frame:**

- Each channel: 64 kbps = 8 bits/sample at 8000 samples/s
- **24 channels * 8 bits = 192 data bits per frame**
- Add 1 framing bit: **193 bits/frame**
- Frame rate: 8000 frames/s
- **Total bit rate**: 193 * 8000 = **1.544 Mbps**

| Parameter | Value |
|---|---|
| Channels | 24 |
| Bits per channel per frame | 8 |
| Framing bits | 1 |
| Frame size | 193 bits |
| Frame rate | 8000 frames/s |
| **Total rate** | **1.544 Mbps** |

Frame duration: 1/8000 = **125 us** (one sample period at 8 kHz).

## 3.2 FDM Guard Band Calculation

**Given**: 12 voice channels, each 4 kHz bandwidth, guard bands of 1 kHz between channels.

- Channel bandwidth: 12 * 4 kHz = 48 kHz
- Guard bands: 11 * 1 kHz = 11 kHz (between channels, not at edges)
- **Total bandwidth**: 48 + 11 = **59 kHz**

**Efficiency**: 48/59 = **81.4%** (guard bands waste 18.6%)

Wider guard bands improve adjacent-channel rejection but waste spectrum. Narrower guard bands require sharper (more expensive) filters.

## 3.3 CDMA Processing Gain

**Given**: Chip rate = 1.2288 Mcps (IS-95 standard), data rate = 9.6 kbps.

**Processing gain**: G_p = chip_rate / data_rate = 1,228,800 / 9,600 = **$128 = 21.1\\ \\mathrm{dB}$**

This means the signal is spread across 128x the minimum bandwidth, providing 21 dB of interference rejection.

| Parameter | IS-95 CDMA |
|---|---|
| Chip rate | 1.2288 Mcps |
| Data rate | 9.6 kbps |
| **Processing gain** | **128 (21.1 dB)** |
| Bandwidth | ~1.25 MHz |

**Maximum users** (approximate): N ≈ G_p / (E_b/N_0) = 128 / 7 ≈ **18 users/cell** (with voice activity factor ~2x: ~36 users).

**Exam strategy**: For TDM, the frame structure formula is total_rate = (channels * bits_per_channel + framing) * frame_rate. For FDM, always account for guard bands. For CDMA, G_p = chip_rate / data_rate.`,
      examTip: 'T1 = 1.544 Mbps is the most-tested TDM value. Remember: 24 channels * 8 bits + 1 framing bit = 193 bits * 8000 frames/s. E1 (European) = 32 channels * 8 bits = 256 bits * 8000 = 2.048 Mbps.',
      importantNote: 'CDMA capacity is soft-limited (degrades gracefully) unlike TDM/FDM which have hard limits. Adding one more CDMA user slightly raises the noise floor for all users.',
    },
    { id: 'mux-overhead-accounting', title: '4. Overhead Accounting: What Each Scheme Charges',
      content: `## 4.1 Two kinds of overhead that behave oppositely

TDM pays for itself with framing bits; FDM pays with guard bands. The two costs
scale in opposite directions with the number of channels, and that single
observation explains most of the design history of both.

![Payload efficiency against the number of multiplexed channels, computed from the two overhead expressions. TDM efficiency is 8N/(8N+1) and rises towards 100 percent as channels are added, passing 99.48 percent at the 24 channels of a T1. FDM efficiency with 4 kHz channels and 1 kHz guard bands is 4N/(5N-1), which falls from 89 percent and settles on an 80 percent floor, reading 81.36 percent at twelve channels.](/courses/fe-ee/figures/comm-mux-efficiency.svg)

The asymmetry is structural. A TDM frame needs framing information once per
frame regardless of how many slots it holds, so the fixed cost is amortised.
An FDM plan needs a guard band in every gap between neighbours, so the cost
grows with the channel count and the ratio never improves. **Time-division
overhead is a fixed cost; frequency-division overhead is a per-unit cost.**

## 4.2 The T1 frame, timed out

| Quantity | Value | Where it comes from |
|---|---|---|
| Sample rate per channel | 8000 /s | Nyquist for a 3.4 kHz voice band |
| Bits per sample | 8 | 256-level companded PCM |
| Payload bits per frame | 192 | 24 channels x 8 bits |
| Framing bits per frame | 1 | One per frame, not one per channel |
| Frame length | 193 bits | 192 + 1 |
| Frame period | 125 microsecond | 1/8000 |
| Line rate | 1.544 Mbps | 193 x 8000 |
| Time slot | 5.208 microsecond | 125/24 |
| Bit time | 647.7 nanosecond | 1/1.544 MHz |
| Payload efficiency | 99.48% | 1536 of 1544 kbps |

E1 organises the same 125 microsecond frame as 32 slots of 8 bits: 256 bits per
frame, **2.048 Mbps**, a 3.906 microsecond slot and a 488.3 ns bit time. Two of
its 32 slots carry framing and signalling rather than voice, so 30 channels are
usable and the payload efficiency is **93.75%** — lower than T1's, in exchange
for out-of-band signalling that T1 has to steal from the voice bits.

## 4.3 Guard bands, and what they buy

**Worked**: 12 voice channels of 4 kHz separated by 1 kHz guard bands need
12(4) + 11(1) = **59 kHz**, for an efficiency of 48/59 = **81.36%**. Scaling up
does not help: 24 channels need 119 kHz (**80.67%**) and 60 channels need
299 kHz (**80.27%**), converging on 4/5 as the figure shows. Narrower guard
bands raise the efficiency but demand filters with steeper skirts, and the
cost of that filter is what fixes the guard band in any real plan.

## 4.4 Statistical multiplexing: paying for the average, not the peak

Synchronous TDM reserves a slot whether or not the source has anything to send.
Statistical TDM assigns slots on demand, so its gain is set by how bursty the
traffic is.

**Worked**: 40 sources, each 64 kbps when active, each active 20% of the time.
Synchronous TDM must provide 40 x 64 = **2560 kbps**. The average demand is
40 x 0.2 x 64 = **512 kbps**, a multiplexing gain of **5x** — at the price of
buffering, variable delay, and a small probability that more than five sources
speak at once and something must queue. That trade, capacity against delay
variation, is the same one that separates circuit switching from packet
switching.

| Scheme | Overhead | Behaviour when a user is idle | Delay |
|---|---|---|---|
| Synchronous TDM | 1 framing bit per frame | Slot transmitted empty | Fixed |
| Statistical TDM | Address or label per burst | Slot given to someone else | Variable |
| FDM | Guard band per gap | Band sits unused | Fixed |
| CDMA | Spreading, factor L | Interference floor falls slightly | Fixed |`,
      examTip: 'For any TDM frame: total rate = (channels x bits per channel + overhead bits) x frame rate. Get the frame rate from the sampling theorem (8000/s for voice) rather than looking for it in the question.',
      importantNote: 'T1 and E1 both use a 125 microsecond frame because both sample voice at 8 kHz. They differ in what fills it: T1 packs 24 channels plus one framing bit; E1 packs 32 slots of which 30 carry voice.',
    },
    { id: 'mux-cdma-ofdm', title: '5. CDMA Soft Capacity and OFDM Arithmetic',
      content: `## 5.1 Spreading gain, and the user count it implies

In CDMA every user occupies the whole band all of the time, so each user's
correlator sees every other user as noise. The despreading operation lifts the
wanted signal by the processing gain while leaving that interference where it
is, which gives a capacity expression with no hard edge in it:

**N = 1 + G_p / (E_b/N_0 required)**

**Worked, IS-95**: chip rate 1.2288 Mcps, data rate 9.6 kbps, so
G_p = 1228800/9600 = **128**, or **21.07 dB**. With a required E_b/N_0 of 7
(8.45 dB), the cell supports N = 1 + 128/7 = **19.3**, so **19 users**. The "1"
is the user's own signal; dropping it gives the 128/7 = 18.3 quoted in
Section 3.3, and either form is accepted — the difference is one user.

Two corrections push this number around in practice, in opposite directions:

- **Voice activity.** Speech occupies the channel about 3/8 of the time, and a
  silent transmitter interferes with nobody. Dividing by 0.375 raises the
  estimate to about **51 users** per cell.
- **Other-cell interference.** Users in neighbouring cells add to the same
  floor, typically reducing the total by a third to a half.

**Worked, UMTS**: 3.84 Mcps carrying a 12.2 kbps voice channel gives
G_p = **314.75**, or **24.98 dB** — nearly 4 dB more processing gain than
IS-95, which is where its capacity advantage per hertz comes from.

## 5.2 Why power control is not optional

Spreading gain protects a user against interference of comparable strength, not
against arbitrarily strong interference. A signal 21 dB above your own wipes
out the entire processing gain by itself.

**Worked**: with an urban path-loss exponent of 3.5, a user 100 m from the base
station arrives 10 x 3.5 x log10(1000/100) = **35 dB** stronger than one at
1 km. That is 14 dB more than the entire IS-95 processing gain — the near user
alone would deny service to the far one. CDMA systems therefore run closed-loop
power control at hundreds of updates per second, driving every handset's
received power to the same value at the base station. FDM and TDM systems do
not need this, because their users are separated by filters and switches rather
than by correlation.

| Property | FDM / TDM | CDMA |
|---|---|---|
| Capacity limit | Hard: slots or bands run out | Soft: interference floor rises |
| Adding one more user | Refused | Everyone's SNR drops slightly |
| Sensitivity to power imbalance | Low | Severe (near-far problem) |
| Frequency planning | Required between cells | Reuse factor of 1 |

## 5.3 OFDM, in four numbers

OFDM divides a wide channel into many narrow subcarriers whose spacing is
chosen so that each one has a null at every other's centre frequency. The
orthogonality condition is exactly **subcarrier spacing = 1/T_u**, where T_u is
the useful symbol duration.

**Worked, a 20 MHz 802.11a channel with a 64-point FFT:**

- Subcarrier spacing: 20 MHz/64 = **312.5 kHz**
- Useful symbol time: T_u = 1/312.5 kHz = **3.2 microsecond**
- Cyclic prefix: 0.8 microsecond, giving a total symbol time of
  **4.0 microsecond**
- Payload: 48 data subcarriers x 6 bits (64-QAM) x 3/4 coding, every
  4 microsecond = **54 Mbps**, which is exactly the top rate of that standard

The cyclic prefix is the interesting one. Copying the tail of each symbol to its
front means any echo arriving within 0.8 microsecond still lands inside the same
symbol, so it adds vectorially instead of smearing into the next one. In
distance terms, 0.8 microsecond x c = **240 m** of extra path length — ample
indoors, which is why the number was chosen. LTE uses 15 kHz spacing instead,
giving T_u = 66.7 microsecond and far more tolerance for the kilometre-scale
echoes of an outdoor cell.

## 5.4 WDM: the same idea one hundred thousand times higher

Wavelength division multiplexing is FDM performed at optical frequencies, and
its grid is specified in frequency even though the hardware is described in
wavelength. Converting between the two is a standard exam step, from
f = c/lambda and its derivative:

**delta_lambda = (lambda^2 / c) delta_f**

**Worked**: the 100 GHz DWDM grid at 1550 nm corresponds to
(1550e-9)^2 / (3.00e8) x 100e9 = **0.80 nm** of spacing, which is the 0.8 nm
quoted in Section 2.2. The C-band from 1530 to 1565 nm spans
195.94 - 191.56 = **4.38 THz**, so it holds about **43 channels** on the
100 GHz grid, or **87** on the 50 GHz grid — and at 100 Gbps per channel, a
single fibre carries several terabits per second.`,
      examTip: 'Processing gain is a ratio of rates: G_p = chip rate / data rate, and 10 log10 of it in dB. For OFDM, the only relationship you need is subcarrier spacing = 1/T_u; everything else in the standard follows from that and the FFT size.',
      importantNote: 'CDMA capacity is limited by interference, so it depends on the required E_b/N_0, voice activity and neighbouring cells — quoting a single user count without stating those assumptions is meaningless. The near-far problem is why power control, not spreading gain, is the hard engineering in a CDMA system.',
    },
  ],
  keyTakeaways: [
    'FDM: separate frequency bands; total BW = sum + guard bands.',
    'TDM: time slots; synchronous (fixed, wasteful) vs. statistical (dynamic, efficient).',
    'T1 = 24 * 64 kbps + 8 kbps framing = 1.544 Mbps.',
    'CDMA: unique spreading codes, all share same freq; soft capacity; spreading gain = code length.',
    'Near-far problem requires power control in CDMA systems.',
    'WDM: FDM for fiber; DWDM enables 40-160+ channels per fiber.',
  ],
},

  /* ══════════════════════════════════════════════════════════════════
   * TOPIC 14 — COMPUTER NETWORKS  (5 curriculum IDs)  ·  3–5 %
   * ══════════════════════════════════════════════════════════════════ */

fee_comms_shannon: {
  topicId: 'fee_comms_shannon',
  title: `Shannon-Hartley Capacity & Link Budgets`,
  domainWeight: 'Communications · 4–6%',
  overview: `Shannon's channel capacity theorem and the link budget are the two foundational quantitative tools in communications. The FE exam tests both: given bandwidth and SNR, compute capacity; given a link path (transmitter, antenna, free-space loss, receiver), determine the received signal-to-noise ratio. This topic provides the formulas, decibel conversions, and practical examples NCEES expects.`,
  sections: [
    {
      id: 'shannon-hartley',
      title: `1. Shannon-Hartley Channel Capacity`,
      content: `## 1.1 The theorem

For a channel with bandwidth B (Hz) and signal-to-noise ratio S/N (linear, not dB), the maximum achievable error-free data rate (channel capacity) C in bits per second is:

  $$C = B \\cdot \\log _{2}(1 + S/N)$$

This is the absolute upper bound — no coding scheme can exceed it without errors. Approaching it requires sophisticated coding (LDPC, turbo codes, polar codes), latency, and computation.

## 1.2 What it tells us

- More BANDWIDTH = more capacity (linear relationship)
- More SNR = more capacity (logarithmic — diminishing returns)
- For doubling capacity: either double bandwidth OR raise SNR substantially (each doubling of (1+SNR) adds 1 bit/Hz)

## 1.3 Numerical examples

**Example 1**: Telephone channel, B = 3 kHz, SNR = 30 dB

- SNR linear = 10^(30/10) = 1000
- C = 3000 · $\\log _{2}$(1 + 1000) = 3000 · $\\log _{2}$(1001) ≈ 3000 · 9.97 ≈ 29.9 kbps

This is why analog modems plateaued at ~33-56 kbps over telephone lines.

**Example 2**: Wi-Fi 20 MHz channel at SNR = 20 dB

- SNR linear = 100
- C = 20 × $10^{6}$ · $\\log _{2}$(101) ≈ 20 × $10^{6}$ · 6.66 ≈ 133 Mbps

Actual Wi-Fi at this SNR achieves ~70-100 Mbps (accounting for protocol overhead, real-world coding gaps).

**Example 3**: To increase capacity from 1 Mbps to 2 Mbps with fixed B = 1 MHz:

- C / B goes from 1 to 2 bits/sec/Hz
- $\\log _{2}$(1 + SNR) goes from 1 to 2
- (1 + SNR) goes from 2 to 4
- SNR goes from 1 (0 dB) to 3 (4.8 dB)
- Just 4.8 dB more SNR doubled capacity

But to go from 2 Mbps to 3 Mbps:
- (1+SNR) goes from 4 to 8
- SNR from 3 to 7
- Need 8.45 dB SNR (3.68 dB more)

To go from 3 Mbps to 4 Mbps: SNR goes from 7 to 15, which is 11.76 dB — only 3.31 dB more.

Diminishing returns: each extra bit costs ~3 dB more SNR at high SNR.

## 1.4 The Shannon limit in decibels

For very low SNR (SNR << 1), Shannon's formula approaches:

  $$C \\approx (B / \\ln  2) \\cdot (S/N) = 1.44 \\cdot B \\cdot (S/N)$$

This is the LINEAR regime. Most modern systems operate at SNR around 10-30 dB, well into the logarithmic regime.

The fundamental SNR-per-bit limit is:

  $$E_b / N_0 = \\ln  2 \\approx 0.693 = -1.59\\ \\mathrm{dB}$$

This is the SHANNON LIMIT — no system can transmit information with E_b/N_0 below -1.59 dB without errors, regardless of bandwidth.

## 1.5 Eb/N0 vs SNR

Two related quantities:

- **SNR (S/N)**: total signal power to total noise power in the channel
- **Eb/N0**: energy per BIT to noise power spectral density

The relationship:
  $$S/N = (E_b \\cdot R) / (N_0 \\cdot B)$$

Where R is data rate (bits/sec) and B is bandwidth (Hz). So:
  $$E_b/N_0 = (S/N) \\cdot (B/R) = (S/N) / (R/B)$$

For BANDLIMITED systems (R/B ≈ 1), SNR ≈ Eb/N0. For SPECTRALLY EFFICIENT modulation (R/B > 1 bit/Hz), SNR > Eb/N0.

## 1.6 Bit error rate (BER) curves

BER depends on modulation scheme AND Eb/N0. Typical FE-tested modulations:

| Modulation | Eb/N0 for BER = 10⁻⁵ |
|---|---|
| BPSK | 9.6 dB |
| QPSK | 9.6 dB (same as BPSK!) |
| 4-QAM | 9.6 dB |
| 16-QAM | 13.4 dB |
| 64-QAM | 17.8 dB |
| 256-QAM | 22.5 dB |

Note: BPSK and QPSK have THE SAME BER vs Eb/N0 — QPSK fits twice the data in the same bandwidth at the same energy per bit. Higher-order QAM gets more spectral efficiency but requires more Eb/N0 to maintain low BER.

## 1.7 The spectral efficiency / power efficiency trade-off

Channel capacity defines a frontier on the (spectral efficiency, power efficiency) plane:

- Spectral efficiency η = R/B (bits/sec/Hz)
- Power efficiency = Eb/N0 (lower is better)

Shannon curve: η = $\\log _{2}$(1 + (R/B) · (E_b/N_0))

Modern coding pushes you closer to the Shannon limit but never exceeds it.`,
      examTip: `Shannon: C = B · log₂(1 + S/N). Use linear SNR, not dB. Doubling SNR linearly adds about 1 bit/Hz to capacity. Shannon limit Eb/N0 ≥ -1.59 dB is the fundamental floor.`,
    },
    {
      id: 'link-budgets',
      title: `2. Link Budget Calculations`,
      content: `## 2.1 The link budget concept

A LINK BUDGET tracks signal power from transmitter to receiver in dB, summing gains and losses to find the received signal level. It's a straightforward addition once everything is in dB.

  P_received (dBm) = P_transmit (dBm) + G_TX_antenna (dBi) - L_path (dB) + G_RX_antenna (dBi) - L_other (dB)

Where:
- P_transmit: transmitter power
- G_TX_antenna: transmit antenna gain
- L_path: path loss (free space, atmospheric, obstacles)
- G_RX_antenna: receive antenna gain
- L_other: connector losses, cable losses, polarization mismatch, etc.

## 2.2 dB review

Decibels for power:
  $$X dB = 10 \\cdot \\log _{10}(P / P_{ref})$$

Common references:
- **dBm**: reference = 1 mW. 0 dBm = 1 mW. 30 dBm = 1 W. -30 dBm = 1 μW.
- **dBW**: reference = 1 W. 0 dBW = 1 W = 30 dBm.
- **dBi**: antenna gain referenced to ISOTROPIC radiator
- **dBd**: gain referenced to half-wave DIPOLE (2.15 dB lower than dBi for same antenna)

Conversion between dBm and watts:
- 0 dBm = 1 mW
- 10 dBm = 10 mW
- 20 dBm = 100 mW
- 30 dBm = 1 W
- 40 dBm = 10 W

Half-power = -3 dB. Double the power = +3 dB. 10× power = +10 dB. 100× = +20 dB.

## 2.3 Free-space path loss (FSPL)

The most-tested loss in FE:

  $$FSPL (dB) = 20\\cdot \\log _{10}(d) + 20\\cdot \\log _{10}(f) + 20\\cdot \\log _{10}(4\\pi /c)$$

Where d is distance (m), f is frequency (Hz), c is speed of light. Combining constants, with distance in KILOMETRES and frequency in MHz:

  $$FSPL (dB) = 20\\cdot \\log _{10}(d/km) + 20\\cdot \\log _{10}(f/MHz) + 32.4$$

(In metres and MHz the same constant becomes -27.6, not +32.4 — the two differ by the 60 dB of the kilometre-to-metre conversion. Section 4.1 tabulates every form.)

Or using miles and MHz:

  FSPL (dB) = 20·$\\log _{10}$(d/miles) + 20·$\\log _{10}$(f/MHz) + 36.6

Or distance in km and GHz:

  $$FSPL (dB) = 20\\cdot \\log _{10}(d/km) + 20\\cdot \\log _{10}(f/GHz) + 92.4$$

Memorize ONE form and convert as needed.

## 2.4 Worked link budget

A 2.4 GHz Wi-Fi link, 100 m distance, with 10 dBi antennas on both ends, 20 dBm TX power, 2 dB cable loss each side.

**Step 1 — path loss from the definition.** Work in wavelengths, which needs no
remembered constant at all. At 2.4 GHz, λ = c/f = (3.00 × $10^{8}$)/(2.4 × $10^{9}$) = 0.125 m, so

  4πd/λ = 4π(100)/0.125 = 4π(800) = 10053
  FSPL = 20·$\\log _{10}$(10053) = **80.05 dB**

**Step 2 — the same number from a unit-specific constant.** In kilometres and
GHz the constant is +92.4:

  FSPL = 20·$\\log _{10}$(0.1) + 20·$\\log _{10}$(2.4) + 92.4 = -20 + 7.6 + 92.4 = **80.0 dB**

In metres and MHz the constant is -27.6:

  FSPL = 20·$\\log _{10}$(100) + 20·$\\log _{10}$(2400) - 27.6 = 40 + 67.6 - 27.6 = **80.0 dB**

Both agree with the wavelength calculation, which is the check to run whenever
a constant is in doubt. Using a constant with the wrong distance unit is the
classic 60 dB error: +32.4 belongs to kilometres and MHz, and applying it to a
distance in metres inflates this 80 dB path to 140 dB.

**Step 3 — the budget itself.**

  P_TX = 20 dBm
  G_TX = 10 dBi, then -2 dB of TX cable
  Path loss = 80.05 dB (computed above for 100 m at 2.4 GHz)
  G_RX = 10 dBi, then -2 dB of RX cable

P_RX = 20 + 10 - 2 - 80.05 - 2 + 10 = **-44.05 dBm**

That's a strong Wi-Fi signal (typical Wi-Fi receiver sensitivity is -70 to -85 dBm).

## 2.5 Receiver sensitivity and noise floor

The receiver has a NOISE FLOOR — the thermal noise power that limits the smallest detectable signal:

  Noise floor (dBm) = -174 + 10·$\\log _{10}$(B) + NF

Where:
- -174 dBm/Hz is the thermal noise power spectral density at room temperature
- B is bandwidth in Hz
- NF is noise figure of receiver (typical 5-10 dB)

For 20 MHz bandwidth, NF = 6 dB:
  Noise floor = -174 + 10·$\\log _{10}$(20×$10^{6}$) + 6 = -174 + 73 + 6 = -95 dBm

For the link to work with 20 dB SNR margin:
  Required RX power = -95 + 20 = -75 dBm

Our calculated RX power was -44 dBm, so we have 31 dB of fade margin — quite good.

## 2.6 Fade margin and link reliability

Real RF channels fluctuate (multipath, weather, mobility). The FADE MARGIN is the excess link power above the minimum required for the desired BER.

Typical design:
- 20 dB fade margin for fixed links (99% availability)
- 30-40 dB fade margin for mobile/cellular (rapid fading)

## 2.7 EIRP

The Equivalent Isotropic Radiated Power (EIRP) is the transmit power times the antenna gain (in linear units) — equivalent power radiated by an ISOTROPIC antenna to produce the same effect:

  EIRP (dBm) = P_TX (dBm) + G_TX (dBi) - L_TX_cable (dB)

Regulatory limits are typically expressed in EIRP (e.g., 36 dBm EIRP for 2.4 GHz Wi-Fi in the US, 30 dBm EIRP for some industrial bands).`,
      examTip: `Memorize FSPL = 20·log(d) + 20·log(f) + constant. The constant depends on units. Most useful form: 20·log(d/km) + 20·log(f/GHz) + 92.4. Always check dimensional consistency.`,
    },
    {
      id: 'modulation-and-systems',
      title: `3. Modulation, Noise Figure, and System Design`,
      content: `## 3.1 Digital modulation summary

| Modulation | Bits/symbol | Spectral efficiency (b/Hz) | Eb/N0 for BER 10⁻⁵ |
|---|---|---|---|
| BPSK | 1 | 1 | 9.6 dB |
| QPSK | 2 | 2 | 9.6 dB |
| 8-PSK | 3 | 3 | 13.0 dB |
| 16-QAM | 4 | 4 | 13.4 dB |
| 64-QAM | 6 | 6 | 17.8 dB |
| 256-QAM | 8 | 8 | 22.5 dB |
| 1024-QAM | 10 | 10 | 27.5 dB |
| 4096-QAM | 12 | 12 | 32.5 dB |

Modern wireless uses ADAPTIVE MODULATION — selects the highest modulation that works given current SNR, dropping to lower-order for weaker signals. Wi-Fi 6 uses up to 1024-QAM; Wi-Fi 7 uses 4096-QAM.

## 3.2 Cascade noise figure (Friis formula)

For multiple amplifier stages cascaded, the overall noise figure depends mostly on the FIRST stage:

  $$F_{total} = F_1 + (F_2 - 1)/G_1 + (F_3 - 1)/(G_1\\cdot G_2) +$$...

Where F is noise factor (linear, not dB) and G is gain (linear).

Lesson: the FIRST amplifier (LNA — low-noise amplifier) dominates the system noise figure if its gain is high enough. This is why receivers always start with an LNA close to the antenna.

Example: LNA with F=1.5 (NF=1.76 dB), G=20 dB (linear 100), followed by mixer with F=10 (NF=10 dB):
  $$F_{total} = 1.5 + (10-1)/100 = 1.5 + 0.09 = 1.59 \\to NF_{total} = 2.0\\ \\mathrm{dB}$$

The mixer's poor noise figure has minimal effect because the LNA's 20 dB gain SUPPRESSES the mixer noise contribution.

## 3.3 Channel coding and Shannon

Modern systems get CLOSE to Shannon limit by using forward error correction (FEC):

- **Convolutional codes** + Viterbi decoder: 3-5 dB from Shannon
- **Turbo codes** (3GPP, deep space): 0.5-1 dB from Shannon
- **LDPC codes** (Wi-Fi, 5G, DVB): 0.1-1 dB from Shannon
- **Polar codes** (5G control channel): similar to LDPC

Coding RATE r = info bits / total bits (e.g., r=1/2 means 1 information bit per 2 transmitted bits). Lower rate = more redundancy = better error correction but lower throughput.

## 3.4 Atmospheric and rain attenuation

For terrestrial radio:

- 2.4 GHz: low atmospheric loss, but vulnerable to obstructions (buildings, foliage)
- 5 GHz: similar
- 24+ GHz (mmWave): significant atmospheric absorption (oxygen at 60 GHz, water vapor at 22 GHz), rain attenuation tens of dB

For satellite links at Ku/Ka band: rain fade can be 5-20 dB during heavy storms. Link budgets include RAIN MARGIN.

## 3.5 Multipath fading

In urban environments, signals reach the receiver via multiple paths (direct + reflected). The paths add VECTORIALLY at the receiver, producing rapid magnitude variations (FADING) as the receiver moves.

- Rayleigh fading: no dominant direct path
- Rician fading: dominant direct path + multipath
- Mitigation: diversity (multiple antennas), MIMO, OFDM (multipath becomes inter-symbol interference managed by cyclic prefix)

## 3.6 Practical link budget for satellite

A geostationary satellite link example:

- Satellite TX power: 100 W = 50 dBm
- Satellite antenna gain: 30 dBi
- EIRP: 80 dBm
- Free space loss at 36,000 km, 12 GHz: ~205 dB
- Atmospheric + rain: 1-3 dB clear weather, 10-20 dB rain fade
- RX antenna gain: 40 dBi (1 m dish)
- Cable + connector loss: 2 dB

Received signal: 80 - 205 - 2 + 40 - 2 = -89 dBm (clear weather)

With receiver noise figure 1 dB and bandwidth 36 MHz:
  Noise floor: -174 + 10·log(36e6) + 1 = -174 + 75.6 + 1 = -97.4 dBm
  SNR = -89 - (-97.4) = 8.4 dB clear weather

With rain fade 15 dB: SNR drops to -6.6 dB → link fails unless using adaptive modulation that drops to lower order

This is why satellite links often have OUTAGE specs ("99.5% availability") rather than absolute "always working" specs.

## 3.7 Simple exam pattern

"A transmitter outputs 30 dBm. The antenna gain at TX is 8 dBi, cable loss is 1 dB. Path loss is 95 dB. The receive antenna has 5 dBi gain and 1 dB cable loss. What is the received power?"

Solution: 30 + 8 - 1 - 95 + 5 - 1 = -54 dBm

If receiver sensitivity is -85 dBm, link margin is -54 - (-85) = 31 dB. Robust link.`,
      examTip: `Link budget = sum of dB gains minus sum of dB losses. dBm + dBi - dB = dBm. Always verify dimensional consistency. The FSPL constants in different unit systems are the most common error source.`,
    },
    {
      id: 'fspl-budget-pictures',
      title: `4. Path Loss and the Budget, Drawn`,
      content: `## 4.1 One equation, four constants

Every version of the free-space loss formula is the same physics —
FSPL = 20 log10(4 pi d f / c) — differing only in what unit the numbers are fed
in. The constant absorbs the conversion, so it is worth seeing all of them in
one place rather than trusting a half-remembered one:

| Distance unit | Frequency unit | Constant added to 20log(d) + 20log(f) |
|---|---|---|
| metres | Hz | -147.55 dB |
| metres | MHz | -27.55 dB |
| kilometres | MHz | +32.45 dB |
| kilometres | GHz | +92.45 dB |
| miles | MHz | +36.58 dB |

Each row differs from the one above it by exactly the decibels of the unit
change: metres to kilometres is 20 log10(1000) = 60 dB, MHz to GHz another
60 dB, and a mile is 1.609 km, worth 20 log10(1.609) = 4.13 dB. If a constant
looks wrong, reconstruct it from a neighbour rather than guessing, or drop to
the wavelength form 20 log10(4 pi d / lambda), which needs no constant at all.

![Free-space path loss against distance on logarithmic axes for 900 MHz, 2.4 GHz and 5.8 GHz, each computed from 20 log10(4 pi d f over c). The three traces are straight and parallel, rising 20 dB per decade of range, and the markers at 100 m read 71.5, 80.1 and 87.7 dB respectively.](/courses/fe-ee/figures/comm-fspl-distance.svg)

Because both d and f enter as 20 log10, the two scaling rules are identical and
both are worth memorising as one number:

- **Doubling the distance adds 6.02 dB**; a decade adds 20 dB
- **Doubling the frequency adds 6.02 dB** at the same distance

The second explains the gap between the traces: 5.8 GHz is 2.417 times
2.4 GHz, so it suffers 20 log10(2.417) = **7.66 dB** more loss over the same
path. That is the entire reason a 5 GHz Wi-Fi network covers less ground than a
2.4 GHz one from the same access point, and it is a question the exam likes
because it can be answered with no calculator at all.

## 4.2 The budget as a running total

A link budget is nothing but a cumulative sum in decibels. Drawing it that way
makes the two margins visible as vertical distances rather than as two more
subtractions to keep straight.

![The 2.4 GHz link budget drawn as a running total in dBm, starting at plus 20 dBm and stepping through TX cable, TX antenna, the 80.05 dB free-space loss, RX antenna and RX cable to arrive at minus 44.05 dBm. Two horizontal references are drawn: the thermal noise floor at minus 94.99 dBm for 20 MHz and a 6 dB noise figure, and a minus 75 dBm sensitivity, leaving 30.9 dB of fade margin.](/courses/fe-ee/figures/comm-link-budget.svg)

| Term | Value | Running total |
|---|---|---|
| Transmitter power | +20 dBm | +20.00 dBm |
| TX cable | -2 dB | +18.00 dBm |
| TX antenna | +10 dBi | +28.00 dBm |
| Free-space loss, 100 m at 2.4 GHz | -80.05 dB | -52.05 dBm |
| RX antenna | +10 dBi | -42.05 dBm |
| RX cable | -2 dB | **-44.05 dBm** |

Two distances then answer the two questions any link raises:

- Against the **noise floor** at -174 + 10 log10(20 MHz) + 6 = **-94.99 dBm**,
  the received signal enjoys an SNR of **50.9 dB** — far more than any
  modulation in the table of Section 3.1 needs
- Against a **-75 dBm sensitivity** (that same noise floor plus the 20 dB of
  SNR the chosen modulation requires), the **fade margin is 30.9 dB**

Note that the sensitivity and the noise floor are not independent numbers: one
is the other plus the required SNR, which is the MDS relationship from the
noise topic. Quoting both is a redundancy that catches arithmetic errors.

## 4.3 Antenna gain from physical size

Link budgets usually hand you the antenna gains, but the exam sometimes hands
you a dish diameter instead. For an aperture antenna of diameter D and
efficiency e,

**G = e (pi D / lambda)^2**

**Worked**: a 1.0 m dish at 12 GHz with 60% efficiency. lambda = 2.498 cm, so
pi D/lambda = 125.75, squared is 15 813, times 0.6 gives 9488 = **39.8 dBi**.

**Worked**: a 3.0 m dish at 4 GHz with 55% efficiency gives lambda = 7.495 cm,
pi D/lambda = 125.75 again, and G = 0.55 x 15 813 = 8697 = **39.4 dBi** —
nearly the same gain from nine
times the area, because the frequency is three times lower. Gain follows
D/lambda, so a dish is only "large" relative to a wavelength.

## 4.4 Cross-checking with the transmission equation

The dB budget and the linear Friis transmission equation must agree, and
running both is the fastest way to catch a unit slip:

**P_r = P_t G_t G_r (lambda / 4 pi d)^2**

**Worked**: P_t = 100 mW, G_t = G_r = 10 dBi (10 linear), d = 100 m,
f = 2.4 GHz. Then (lambda/4 pi d)^2 = (0.1249/1256.6)^2 = 9.881 x 10^-9, and
P_r = 0.1 x 10 x 10 x 9.881e-9 = 9.881 x 10^-8 W = **-40.05 dBm**. The decibel
route gives 20 + 10 - 80.05 + 10 = -40.05 dBm, identical, and two decibels of
cable at each end takes both to the -44.05 dBm of the table above.

## 4.5 What the exam does with all this

| Question form | First move |
|---|---|
| "Received power" with all terms in dB | Add gains, subtract losses; no linear conversion needed |
| "Path loss" with mixed units | Convert to one system, or use the wavelength form |
| "Maximum range" for a stated sensitivity | Solve the budget for FSPL, then invert 20 log10 |
| "Fade margin" | Received power minus sensitivity, both in dBm |
| "Effect of moving to a higher band" | 6.02 dB per doubling of frequency, nothing else changes |

The fourth row is the one most often botched, because margin is a difference of
two dBm figures and therefore has units of dB — subtracting a dBm from a dBm
gives a ratio, never an absolute level.`,
      examTip: `Reconstruct a forgotten FSPL constant instead of guessing: metres to kilometres is 60 dB, MHz to GHz is another 60 dB. Or avoid constants entirely with FSPL = 20 log10(4 pi d / lambda), which is the definition and always right.`,
      importantNote: `Doubling either the distance or the frequency adds 6.02 dB of free-space loss. Both appear as 20 log10, so the two rules are the same rule — which is why moving a link from 2.4 GHz to 5.8 GHz costs 7.66 dB before any other effect is considered.`,
    },
  ],
  keyTakeaways: [
    'Shannon-Hartley: C = B · log₂(1 + S/N). Use LINEAR S/N, not dB. Sets absolute upper bound on error-free data rate.',
    'Shannon limit: Eb/N0 ≥ ln 2 = -1.59 dB. No coding scheme can transmit below this without errors.',
    'BPSK and QPSK have SAME Eb/N0 for same BER. QPSK fits 2× the data in the same bandwidth at same energy per bit.',
    'FSPL = 20·log(d/km) + 20·log(f/GHz) + 92.4 dB. Memorize ONE form and convert.',
    'Noise floor = -174 + 10·log(B/Hz) + NF (in dBm). For wider bandwidth or higher NF, the floor rises.',
    'Friis cascade: F_total = F_1 + (F_2-1)/G_1 + (F_3-1)/(G_1·G_2) + ... The FIRST stage dominates if its gain is high. Use LNA near antenna.',
    'EIRP (dBm) = P_TX (dBm) + G_TX (dBi) - L_TX_cable. Regulatory limits are typically EIRP-based.',
  ],
},
};
