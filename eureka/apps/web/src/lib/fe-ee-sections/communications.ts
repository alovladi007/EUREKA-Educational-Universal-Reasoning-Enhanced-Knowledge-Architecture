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
    { id: 'am-from-the-carrier', title: '7. AM Built From the Carrier: Sidebands, Power, Efficiency',
      content: `## 7.1 One identity produces the entire spectrum

Sections 1 and 4 state the AM waveform and quote its power split. This section
derives both from a single line of algebra, because on the exam the derivation
is faster than the memorised result the moment a question changes one detail.
Start from the tone-modulated carrier:

$$s(t) = A_c\\left[1 + m\\cos(2\\pi f_m t)\\right]\\cos(2\\pi f_c t)$$

Expanding the bracket leaves a plain carrier plus a product of two cosines:

$$s(t) = A_c\\cos(2\\pi f_c t) + mA_c\\cos(2\\pi f_m t)\\cos(2\\pi f_c t)$$

That product is where every AM fact comes from, and the product-to-sum identity
splits it into two ordinary tones:

$$\\cos A\\cos B = \\tfrac{1}{2}\\cos(A-B) + \\tfrac{1}{2}\\cos(A+B)$$

$$s(t) = A_c\\cos(2\\pi f_c t) + \\frac{mA_c}{2}\\cos\\left[2\\pi(f_c-f_m)t\\right] + \\frac{mA_c}{2}\\cos\\left[2\\pi(f_c+f_m)t\\right]$$

The modulated carrier is therefore not one signal whose amplitude wobbles. It is
three steady sinusoids, none of which changes amplitude at all, sitting at
f_c - f_m, f_c and f_c + f_m. The wobble a scope shows is those three beating
against one another. Three consequences drop out at once.

**Bandwidth.** The occupied span runs from the lower line to the upper one:

$$BW = (f_c + f_m) - (f_c - f_m) = 2f_m$$

**Sideband height.** Each sideband stands at m A_c / 2, so it can never exceed
half the carrier, even at m = 1.

**Carrier immobility.** The carrier term contains no m at all. Changing the
message changes the sidebands and leaves the carrier line exactly where it was,
at exactly the height it had. That is the whole reason AM efficiency has a
ceiling.

![Line spectrum of an AM signal with carrier amplitude 10 volts and modulation index 0.6, drawn at a carrier of 100 kilohertz and a message tone of 5 kilohertz. The carrier line stands at 10.00 volts and each sideband at 3.00 volts; into 50 ohms that is 1.000 watt in the carrier and 0.090 watt in each sideband, 1.180 watts in total, so the efficiency is 15.25 percent and the occupied bandwidth is 10 kilohertz.](/courses/fe-ee/figures/com2-am-spectrum.svg)

The line heights in that figure are not taken from the expansion above. They are
the magnitudes of a discrete Fourier transform of the synthesized waveform, so
the picture and the algebra are two independent routes to the same three
numbers. Both give 3.00, 10.00 and 3.00 volts.

### Worked example 7A — powers from the three lines

**Given** A_c = 10.0 V, m = 0.600, f_c = 100 kHz, f_m = 5 kHz, into R = 50 ohm.

Sideband amplitude first, since everything else follows from it:

$$\\frac{mA_c}{2} = \\frac{0.600 \\times 10.0}{2} = 3.00\\ \\mathrm{V}$$

Each line is an ordinary sinusoid, so each carries the ordinary sinusoidal power:

$$P_c = \\frac{A_c^2}{2R} = \\frac{100}{100} = 1.000\\ \\mathrm{W}$$

$$P_{LSB} = P_{USB} = \\frac{(mA_c/2)^2}{2R} = \\frac{9.00}{100} = 0.0900\\ \\mathrm{W}$$

$$P_{total} = 1.000 + 0.0900 + 0.0900 = 1.180\\ \\mathrm{W}$$

and the same total from the compact form, as a check that costs one line:

$$P_{total} = P_c\\left(1 + \\frac{m^2}{2}\\right) = 1.000 \\times 1.180 = 1.180\\ \\mathrm{W}$$

$$\\eta = \\frac{2P_{sb}}{P_{total}} = \\frac{0.180}{1.180} = 0.15254 = 15.25\\%$$

**Answer**: 10 kHz of spectrum, 1.180 W transmitted, 0.180 W of it carrying the
message. The other 84.75% heats the antenna to no purpose.

## 7.2 The efficiency ceiling, and why it is a ceiling

Because the carrier term is fixed and the sideband terms grow as m, the two
shares of transmitted power are

$$\\frac{P_c}{P_{total}} = \\frac{1}{1 + m^2/2}, \\qquad \\frac{2P_{sb}}{P_{total}} = \\frac{m^2/2}{1 + m^2/2} = \\frac{m^2}{2 + m^2}$$

The second expression IS the efficiency, and it is monotonic in m, so the best
legal value is at m = 1:

$$\\eta_{max} = \\frac{1}{2 + 1} = \\frac{1}{3} = 33.33\\%$$

![Carrier share and sideband share of transmitted AM power plotted against modulation index from zero to one. The carrier share falls from 100 percent to 66.67 percent while the sideband share, which is also the efficiency, rises to a ceiling of 33.33 percent, passing 11.11 percent at index 0.5 and 24.24 percent at index 0.8.](/courses/fe-ee/figures/com2-am-power-split.svg)

The curve is worth a second look because it is so flat at the left. Half
modulation does not buy half the efficiency; it buys 11.11%, a third of the
ceiling. Efficiency goes as m squared, so under-modulating is punished twice
over. The generator that drew the figure re-derives every plotted point by
averaging the square of the actual waveform over one message period, without
using the power formula at all, and the two routes agree to a part in a billion.

There is no way past 33.33% while the carrier is still transmitted, because the
carrier is exactly what the envelope detector needs in order to be a simple
diode. That is the trade the next subsection unwinds.

### Worked example 7B — antenna current, forwards and backwards

**Given** an unmodulated carrier drawing 8.00 A into a 50 ohm antenna. Find the
current at m = 0.600, and then recover m from a measured 9.14 A.

Power is proportional to the square of the current into a fixed resistance, so
the current ratio is the square root of the power ratio:

$$\\frac{I_{total}}{I_c} = \\sqrt{1 + \\frac{m^2}{2}} = \\sqrt{1.180} = 1.08628$$

$$I_{total} = 8.00 \\times 1.08628 = 8.690\\ \\mathrm{A}$$

Confirming through power rather than current, which is the independent route:
P_c = I_c^2 R = 64.0 x 50 = 3200 W, and P_total = 3200 x 1.180 = 3776 W, which
is (8.690)^2 x 50 = 3776 W. The two agree.

Backwards, from a meter reading of 9.14 A on the same carrier:

$$m = \\sqrt{2\\left[\\left(\\frac{I_{total}}{I_c}\\right)^2 - 1\\right]} = \\sqrt{2(1.30531 - 1)} = 0.781$$

**Answer**: 8.690 A at m = 0.600; a reading of 9.14 A corresponds to m = 0.781.
The trap here is treating the current ratio as the index: 9.14/8.00 = 1.14 is
not a modulation index, and quoting it as one overstates the modulation by
almost half.

## 7.3 What DSB-SC and SSB actually save

Once you see the spectrum as three lines, the two variants stop being
definitions to memorise and become deletions.

**DSB-SC** removes the carrier line and keeps both sidebands. All the
information survives, because the information was never in the carrier. The
bandwidth is unchanged at 2 f_m, because both sidebands are still there. What
changes is transmitted power.

**SSB** removes the carrier AND one sideband. The surviving sideband contains a
complete copy of the message, since the two sidebands are mirror images
carrying identical information. The bandwidth halves to f_m and the power falls
again.

![Stacked bars comparing transmitted power at modulation index one for full AM, double sideband suppressed carrier, and single sideband, normalized so the carrier is one unit. Full AM totals 1.50 units, DSB-SC totals 0.50, and SSB totals 0.25, which are savings of 4.77 dB and 7.78 dB respectively.](/courses/fe-ee/figures/com2-ssb-ledger.svg)

At m = 1 the ledger reads: carrier 1.00 unit, each sideband 0.25 unit, total
1.50 units. So

$$\\text{DSB-SC saving} = 10\\log_{10}\\frac{1.50}{0.50} = 10\\log_{10}3 = 4.77\\ \\mathrm{dB}$$

$$\\text{SSB saving} = 10\\log_{10}\\frac{1.50}{0.25} = 10\\log_{10}6 = 7.78\\ \\mathrm{dB}$$

Both figures were re-derived by integrating the squared waveforms directly, and
both matched to a thousandth of a decibel. The saving is real power, not a
bookkeeping convention: a 7.78 dB reduction means an SSB transmitter needs about
one sixth of the DC input for the same received signal.

| Scheme | Lines transmitted | Bandwidth | Power at m = 1 | Detector |
|---|---|---|---|---|
| Full AM | carrier + both sidebands | 2 f_m | 1.50 units | Diode envelope |
| DSB-SC | both sidebands | 2 f_m | 0.50 units | Coherent, phase-locked |
| SSB | one sideband | f_m | 0.25 units | Coherent, and frequency-accurate |
| VSB | one sideband + vestige | between f_m and 2 f_m | between 0.25 and 0.50 | Envelope, with a shaped filter |

The cost column is receiver complexity, and it is not small. A coherent detector
needs a local carrier matched in both frequency and phase. An SSB receiver that
is 50 Hz off reproduces speech with every component shifted by 50 Hz, which is
unintelligible for music and merely comical for voice — the reason amateur SSB
sounds the way it does when mistuned.

### Worked example 7C — the power a switch to SSB would save

**Given** an AM transmitter delivering 5.00 kW total at m = 0.800. How much
power would an SSB transmitter need for the same recovered message?

$$P_c = \\frac{P_{total}}{1 + m^2/2} = \\frac{5000}{1.320} = 3787.88\\ \\mathrm{W}$$

$$P_{sb,total} = 5000 - 3787.88 = 1212.12\\ \\mathrm{W}, \\qquad P_{one\\ sideband} = \\frac{1212.12}{2} = 606.06\\ \\mathrm{W}$$

$$\\text{saving} = 10\\log_{10}\\frac{5000}{606.06} = 10\\log_{10}8.250 = 9.16\\ \\mathrm{dB}$$

**Answer**: 606 W instead of 5000 W, a saving of 9.16 dB, and the occupied
bandwidth halves as well. The saving exceeds the 7.78 dB quoted for m = 1
precisely because m = 0.800 is a worse-modulated signal to begin with — the
weaker the modulation, the more of the AM budget is pure carrier, and the more
there is to throw away.

### Worked example 7D — the two-tone index and the boundary it hides

**Given** two audio tones modulating one carrier at m_1 = 0.500 and
m_2 = 0.600. Is the transmitter overmodulated? What is its efficiency?

Powers add, so the indices combine in quadrature rather than arithmetically:

$$m_{eff} = \\sqrt{m_1^2 + m_2^2} = \\sqrt{0.250 + 0.360} = \\sqrt{0.610} = 0.781$$

$$\\eta = \\frac{m_{eff}^2}{2 + m_{eff}^2} = \\frac{0.610}{2.610} = 0.23372 = 23.37\\%$$

**Answer**: m_eff = 0.781, comfortably legal, and the efficiency is 23.37%. The
distractor is arithmetic addition, 0.500 + 0.600 = 1.100, which declares the
transmitter overmodulated when it is not, and would have an operator cutting
audio gain for no reason. Quadrature is not an approximation here; it is what
"powers add" means.

| Given | Route | Common wrong turn |
|---|---|---|
| Envelope maximum and minimum | m from their difference over their sum | Using the ratio of the two readings |
| Total power and m | P_c = P_total/(1 + m^2/2) | Multiplying by (1 - m^2/2) |
| Antenna current ratio | Square, subtract 1, double, take the root | Quoting the ratio itself as m |
| Two modulating tones | Quadrature sum of the indices | Adding the indices |
| An SSB comparison | Compare against ONE sideband's power | Halving the total AM power |`,
      examTip: 'Derive rather than recall: expand A_c[1 + m cos(2 pi f_m t)] cos(2 pi f_c t), read the three line amplitudes A_c, mA_c/2, mA_c/2, and every AM answer on the paper follows. Bandwidth is the span of the outer two lines, efficiency is the sideband share m^2/(2+m^2), and the carrier term has no m in it at all.',
      importantNote: 'SSB is quoted as a 50% bandwidth saving and that is exact, but the POWER saving depends on the modulation index. At m = 1 it is 7.78 dB against full AM; at m = 0.8 it is 9.16 dB, because a lightly modulated AM signal is mostly carrier and the carrier is what SSB discards.',
    },
    { id: 'fm-pm-instantaneous', title: '8. FM and PM: Instantaneous Frequency and Bessel Sidebands',
      content: `## 8.1 Instantaneous frequency is the derivative of phase

Every angle-modulation result follows from one definition. Write the signal as

$$s(t) = A_c\\cos\\left[\\theta(t)\\right]$$

and define the instantaneous frequency as the rate at which that angle advances:

$$f_i(t) = \\frac{1}{2\\pi}\\frac{d\\theta}{dt}$$

This is not a convention chosen for convenience; it is forced. For an
unmodulated carrier theta = 2 pi f_c t, whose derivative over 2 pi is f_c, so
the definition reduces to the ordinary frequency in the one case where the
ordinary frequency is unambiguous.

For **PM** the message drives the phase directly:

$$\\theta(t) = 2\\pi f_c t + k_p\\,m(t) \\quad\\Longrightarrow\\quad f_i(t) = f_c + \\frac{k_p}{2\\pi}\\frac{dm}{dt}$$

For **FM** the message drives the frequency, so the phase is its integral:

$$f_i(t) = f_c + k_f\\,m(t) \\quad\\Longrightarrow\\quad \\theta(t) = 2\\pi f_c t + 2\\pi k_f\\!\\int_0^t m(\\tau)\\,d\\tau$$

That single difference — message versus derivative of message — produces every
distinction between the two. For a tone m(t) = A_m cos(2 pi f_m t) the FM
deviation and index are

$$\\Delta f = k_f A_m, \\qquad \\beta = \\frac{\\Delta f}{f_m} = \\frac{k_f A_m}{f_m}$$

while the PM peak phase deviation and the deviation it implies are

$$\\beta_p = k_p A_m, \\qquad \\Delta f = \\beta_p f_m$$

Read those four expressions side by side and the exam trap is obvious. FM's
deviation does not contain f_m; PM's does. Change the pitch of the message and
an FM transmitter's swing is untouched while a PM transmitter's swing scales
with it.

![Two stacked panels for a 4 kilohertz tone. The upper panel shows the phase deviation of an FM signal, 3.75 radians times a sine, and of a PM signal with the same peak deviation, 3.75 radians times a cosine. The lower panel shows the instantaneous frequency obtained by numerically differentiating each phase: both peak at 15.00 kilohertz, giving a modulation index of 3.75, but the FM deviation follows the message while the PM deviation follows its derivative, a quarter cycle earlier.](/courses/fe-ee/figures/com2-fm-instfreq.svg)

The lower panel is computed by numerically differencing the phase curve above
it, not by plotting the deviation formula. That it lands on 15.00 kHz either way
is the evidence that the derivative definition and the deviation formula are the
same statement.

The figure also makes a point that catches people in identification questions:
for a single tone, an FM signal and a PM signal are indistinguishable apart from
a quarter-cycle shift. You cannot tell them apart from one tone. The difference
only shows up when the message contains more than one frequency, because then
the two respond to the mix differently.

### Worked example 8A — deviation, index and bandwidth from modulator data

**Given** a frequency modulator with sensitivity k_f = 25.0 kHz/V, driven by a
2.40 V tone at f_m = 3.00 kHz.

$$\\Delta f = k_f A_m = 25.0 \\times 2.40 = 60.0\\ \\mathrm{kHz}$$

$$\\beta = \\frac{\\Delta f}{f_m} = \\frac{60.0}{3.00} = 20.0$$

$$BW_{Carson} = 2(\\Delta f + f_m) = 2 \\times 63.0 = 126\\ \\mathrm{kHz}$$

**Answer**: 60.0 kHz of deviation, an index of 20.0, and 126 kHz of occupied
bandwidth. Note that the 3.00 kHz figure did no work in the first line. The
distractor is to multiply the sensitivity by the message frequency instead of
its amplitude, giving 25.0 x 3.00 = 75.0 kHz and a bandwidth of 156 kHz, which
is wrong by 30 kHz and wrong in principle.

## 8.2 Why FM has infinitely many sidebands

Substituting the FM phase for a tone gives

$$s(t) = A_c\\cos\\left[2\\pi f_c t + \\beta\\sin(2\\pi f_m t)\\right]$$

and this cannot be expanded into a finite number of tones, because the message
sits inside a cosine rather than multiplying one. The expansion that does work
is the Jacobi-Anger identity, whose coefficients are the Bessel functions of the
first kind:

$$s(t) = A_c\\sum_{n=-\\infty}^{\\infty} J_n(\\beta)\\cos\\left[2\\pi(f_c + n f_m)t\\right]$$

$$J_n(\\beta) = \\frac{1}{\\pi}\\int_0^{\\pi}\\cos(n\\phi - \\beta\\sin\\phi)\\,d\\phi$$

So the spectrum is a line at the carrier and a pair of lines at every multiple
of f_m either side, forever. Two structural facts govern everything after this.

**Power is conserved.** Angle modulation does not change the envelope, so the
transmitted power cannot depend on beta:

$$\\sum_{n=-\\infty}^{\\infty} J_n^2(\\beta) = 1 \\quad\\text{for every }\\beta$$

Raising beta therefore does not create sideband power; it moves power out of the
carrier line and into the sidebands. That is the deepest difference from AM,
where raising m adds sideband power on top of an unchanged carrier.

**The lines decay abruptly past n = beta.** Below that index they are
comparable to one another; above it they collapse.

![The first three Bessel functions of the first kind plotted against modulation index from zero to ten. J-nought falls through zero at index 2.4048 and again at 5.5201; at an index of five the three coefficients are minus 0.1776, minus 0.3276 and plus 0.0466, so the carrier line is smaller than several of its own sidebands.](/courses/fe-ee/figures/com2-fm-bessel.svg)

Every marked value on that figure is computed twice — once from a library Bessel
routine and once by numerically integrating the integral above — and the two
agree to better than five parts in a million.

### Worked example 8B — the line powers of a broadcast FM signal

**Given** a 100 W FM transmitter at beta = 5.00. How is the power distributed?

Each line carries the fraction J_n^2(beta) of the total, doubled for the pairs:

| Line | Coefficient | Power fraction | Power of 100 W |
|---|---|---|---|
| Carrier, n = 0 | -0.1776 | 0.03154 | 3.15 W |
| n = 1 pair | -0.3276 | 0.21462 | 21.46 W |
| n = 2 pair | +0.0466 | 0.00434 | 0.43 W |
| n = 3 pair | +0.3648 | 0.26620 | 26.62 W |
| n = 4 pair | +0.3912 | 0.30613 | 30.61 W |
| n = 5 pair | +0.2611 | 0.13639 | 13.64 W |
| n = 6 pair | +0.1310 | 0.03435 | 3.43 W |

$$P_{carrier} = J_0^2(5)\\times 100 = 0.03154 \\times 100 = 3.15\\ \\mathrm{W}$$

$$P_{n=4\\ pair} = 2J_4^2(5)\\times 100 = 0.30613 \\times 100 = 30.61\\ \\mathrm{W}$$

**Answer**: the fourth sideband pair carries almost ten times the power of the
carrier. The distractor is the AM intuition that the carrier dominates. It does
not, and at beta = 2.4048 the carrier line disappears entirely while the signal
is still fully modulated — which is exactly how a laboratory sets deviation
without a deviation meter: advance the modulating level until the carrier line
on the analyser nulls.

## 8.3 Carson's rule, and how wrong it is

Counting the pairs that survive up to n = beta + 1 and doubling gives

$$BW_{Carson} = 2(\\beta + 1)f_m = 2(\\Delta f + f_m)$$

which is the standard rule arriving by a route that explains it rather than
asserting it. The question worth asking is how much power that band actually
encloses, since the true spectrum is infinite. Summing the enclosed fractions:

$$P_{enclosed}(N) = J_0^2(\\beta) + 2\\sum_{n=1}^{N} J_n^2(\\beta)$$

![Carson's rule compared with the bandwidth that genuinely holds 99 percent of the transmitted power, both expressed as the half-count N in a bandwidth of 2 N times the message frequency. Carson is the straight line N equals beta plus one; the true 99 percent requirement is a staircase. At beta equal to one and five the two agree exactly, at beta equal to ten the Carson count of eleven encloses only 98.996 percent so the honest count is twelve.](/courses/fe-ee/figures/com2-carson-error.svg)

| beta | Carson N | Power inside Carson band | True N for 99% |
|---|---|---|---|
| 1 | 2 | 99.92% | 2 |
| 5 | 6 | 99.36% | 6 |
| 10 | 11 | 98.996% | 12 |

The familiar claim that Carson's rule captures "about 98%" is a conservative
floor, and the trend runs the other way from what most people expect. At small
beta the rule is generous; at beta = 10 it falls a few hundredths of a percent
short of 99% and the honest 99% band needs one more pair. The FE exam accepts
Carson's rule everywhere, and it should — a 9% bandwidth error at beta = 10 is
irrelevant next to the guard bands a real channel plan carries — but you should
know that it is an engineering estimate with a known sign of error, not an
identity.

### Worked example 8C — a broadcast channel, and where Carson runs short

**Given** broadcast FM with Delta_f = 75.0 kHz in a 200 kHz channel. Check the
fit for a 15.0 kHz audio band and then for a 7.50 kHz one.

At f_m = 15.0 kHz:

$$\\beta = \\frac{75.0}{15.0} = 5.00, \\qquad BW_{Carson} = 2 \\times 90.0 = 180\\ \\mathrm{kHz}$$

The true 99% count at beta = 5 is also N = 6, so the honest bandwidth is
2 x 6 x 15.0 = 180 kHz. Carson and the power integral agree exactly, and 20 kHz
of the channel is left as guard.

At f_m = 7.50 kHz with the same deviation:

$$\\beta = \\frac{75.0}{7.50} = 10.0, \\qquad BW_{Carson} = 2 \\times 82.5 = 165\\ \\mathrm{kHz}$$

but the Carson count of N = 11 encloses only 98.996%, so the true 99% band needs
N = 12, that is 2 x 12 x 7.50 = 180 kHz.

**Answer**: 180 kHz either way by the honest measure. Carson reports 165 kHz for
the narrower audio band, understating the real occupancy by 15 kHz. Both still
fit the 200 kHz channel, which is why the approximation survives in practice.
The distractor is BW = 2 Delta_f = 150 kHz, the wideband shortcut applied where
beta is not large enough to justify it; it understates the 15 kHz case by 30 kHz.

## 8.4 The FM and PM comparison, settled

| Quantity | FM | PM |
|---|---|---|
| What the message sets | Instantaneous frequency | Instantaneous phase |
| Peak deviation | Delta_f = k_f A_m, independent of f_m | Delta_f = k_p A_m f_m, proportional to f_m |
| Modulation index | beta = k_f A_m / f_m | beta_p = k_p A_m, independent of f_m |
| Double the message amplitude | Deviation and index both double | Deviation and index both double |
| Double the message frequency | Index halves, bandwidth barely moves | Deviation doubles, bandwidth roughly doubles |
| Equivalent implementation | PM driven by the integral of m(t) | FM driven by the derivative of m(t) |
| Where it appears digitally | Frequency shift keying | Phase shift keying and QAM |

The last row is the bridge to the next chapter. PSK is phase modulation by a
discrete symbol stream, so its bandwidth is governed by the symbol rate rather
than by any deviation constant — which is why the digital chapter never mentions
Carson's rule.`,
      examTip: 'Write down whether the message sets frequency or phase before anything else. FM: Delta_f = k_f A_m and beta = Delta_f/f_m. PM: beta_p = k_p A_m and Delta_f = beta_p f_m. Carson BW = 2(Delta_f + f_m) applies to both once you have the deviation. The single commonest error is letting f_m into an FM deviation.',
      importantNote: 'FM power is conserved as beta changes: the squared Bessel coefficients always sum to one, so a larger index moves power outward rather than adding it. At beta = 5 the carrier holds only 3.15% of the transmitted power and the fourth sideband pair holds 30.6%, and at beta = 2.4048 the carrier vanishes altogether.',
    },
    { id: 'fm-noise-capture', title: '9. Pre-emphasis, Threshold and Capture: What FM Buys and What It Costs',
      content: `## 9.1 The noise triangle and the network that flattens it

An FM discriminator differentiates phase, and differentiation multiplies a
spectrum by frequency. So even when the noise entering the receiver is flat, the
noise LEAVING the detector has a power spectral density that rises as the square
of the offset from the carrier:

$$S_{n,out}(f) \\propto f^2, \\qquad 0 \\le f \\le W$$

This is the noise triangle, and it means the top of the audio band is far
noisier than the bottom. The remedy is to boost the treble before transmission
and cut it by exactly the same amount afterwards. The pre-emphasis network is a
single zero:

$$H_{pre}(f) = 1 + j\\frac{f}{f_1}, \\qquad f_1 = \\frac{1}{2\\pi\\tau}$$

$$H_{de}(f) = \\frac{1}{1 + jf/f_1}$$

The product is unity, so programme material passes through the pair untouched.
The noise, however, only meets the de-emphasis network, and it is the noise that
loses.

$$\\text{gain} = \\frac{\\displaystyle\\int_0^W f^2\\,df}{\\displaystyle\\int_0^W \\frac{f^2}{1 + (f/f_1)^2}\\,df} = \\frac{W^3/3}{f_1^2\\left[W - f_1\\arctan(W/f_1)\\right]}$$

![Pre-emphasis and de-emphasis responses for a 75 microsecond time constant, plotted against audio frequency on a logarithmic axis, together with the discriminator noise that rises as the square of frequency. The corner sits at 2122 hertz, the pre-emphasis boost reaches 17.07 dB at the 15 kilohertz band edge, and the net signal-to-noise gain from the pair is 13.20 dB.](/courses/fe-ee/figures/com2-preemphasis.svg)

### Worked example 9A — the de-emphasis gain, computed rather than quoted

**Given** the North American standard tau = 75.0 microseconds and an audio band
edge W = 15.0 kHz.

$$f_1 = \\frac{1}{2\\pi\\tau} = \\frac{1}{2\\pi \\times 75.0\\times 10^{-6}} = 2122\\ \\mathrm{Hz}$$

$$\\text{boost at }W = 10\\log_{10}\\left[1 + \\left(\\frac{15000}{2122}\\right)^2\\right] = 10\\log_{10}(50.96) = 17.07\\ \\mathrm{dB}$$

$$\\text{gain} = \\frac{(15000)^3/3}{(2122)^2\\left[15000 - 2122\\arctan(7.0686)\\right]} = 20.88 = 13.20\\ \\mathrm{dB}$$

**Answer**: the pair recovers 13.20 dB of output signal-to-noise ratio. The
generator that drew the figure computes that integral twice, once in the closed
form above and once by numerical quadrature with no closed form at all, and the
two agree to better than a part in a million. The European tau = 50.0 us puts
the corner at 3183 Hz and buys correspondingly less, which is the whole content
of the difference between the two standards.

The cost is headroom. A recording with a bright top end arrives at the modulator
already boosted by up to 17 dB, and if the broadcaster does not reduce level to
compensate, the transmitter overdeviates. That is why FM broadcast processing
chains contain a pre-emphasis limiter rather than a plain peak limiter.

## 9.2 The FM advantage, and the cliff it stands on

Section 6.3 states the improvement factor. Written out with the definitions
attached:

$$\\frac{SNR_{out}}{CNR_{in}} = 3\\beta^2(\\beta + 1)$$

where CNR_in is the carrier-to-noise ratio measured in the full Carson
bandwidth, SNR_out is the post-detector ratio in the message band, and the
message is a single tone. The exchange is favourable because the gain rises as
the cube of beta while the bandwidth rises only linearly:

$$\\frac{BW}{2f_m} = \\beta + 1$$

### Worked example 9B — is the link above threshold, and by how much?

**Given** an FM link at beta = 3.00 delivering CNR = 14.0 dB in its Carson
bandwidth. The receiver's threshold is 10.0 dB.

$$3\\beta^2(\\beta+1) = 3 \\times 9.00 \\times 4.00 = 108$$

$$10\\log_{10}(108) = 20.33\\ \\mathrm{dB}$$

$$SNR_{out} = 14.0 + 20.33 = 34.3\\ \\mathrm{dB}$$

**Answer**: 34.3 dB of output signal-to-noise ratio, with 4.0 dB of margin above
threshold. The distractor is to use 3 beta^2 = 27, worth 14.31 dB, which
understates the improvement by 6.0 dB and would make an adequate link look
marginal. The (beta + 1) factor is not optional; it is the ratio of the
transmission bandwidth to the message bandwidth, and dropping it silently
changes which SNR the ratio is measured against.

**Threshold matters more than the number suggests.** Below roughly 10 dB CNR
the phasor sum of carrier and noise starts to encircle the origin, each
encirclement producing a 2 pi phase jump that the discriminator reports as a
click. The click rate climbs steeply, and the 20 dB of improvement disappears
within a decibel or two of further fading. AM has no such threshold: it degrades
smoothly. This is the real engineering trade behind "FM is better in noise" —
FM is dramatically better right up until it is dramatically worse.

## 9.3 Capture: the loudest signal takes everything

The other consequence of listening to phase rather than amplitude is that two
co-channel signals do not mix. Write the received sum of two carriers as a
single phasor:

$$z(t) = A_1 e^{j2\\pi f_1 t} + A_2 e^{j2\\pi f_2 t}, \\qquad a = \\frac{A_2}{A_1}$$

$$\\frac{1}{2\\pi}\\frac{d\\,\\arg z}{dt} = f_1 + (f_2 - f_1)\\frac{a\\cos\\phi + a^2}{1 + 2a\\cos\\phi + a^2}, \\qquad \\phi = 2\\pi(f_2 - f_1)t$$

Average that over one beat period and something abrupt happens. The mean is
exactly f_1 whenever a < 1 and exactly f_2 whenever a > 1, with no intermediate
behaviour whatever.

![Two panels showing the capture effect. The left panel plots the mean discriminator output against the ratio of interferer to wanted signal in decibels: it is zero for every negative ratio and one for every positive ratio, switching abruptly at equal amplitude. The right panel shows the instantaneous frequency for an amplitude ratio of 0.5, which rides at plus 0.333 and dives to minus 1.000 once per beat period yet averages exactly zero.](/courses/fe-ee/figures/com2-fm-capture.svg)

### Worked example 9C — what a weaker co-channel signal does to the output

**Given** a wanted FM signal and a co-channel interferer 6.0 dB weaker, so
a = 0.501.

The mean output frequency is that of the wanted signal, computed here by
unwrapping the phase of the summed phasor and differentiating it numerically:
the measured mean is 0.000 in units of the beat rate, against 1.000 when the
interferer is the stronger of the two. For a = 0.500 exactly, the instantaneous
frequency rides at

$$\\left.\\frac{d\\theta/dt}{2\\pi\\Delta f}\\right|_{\\phi=0} = \\frac{a + a^2}{(1+a)^2} = \\frac{0.750}{2.250} = 0.333$$

and dives once per beat period to

$$\\left.\\frac{d\\theta/dt}{2\\pi\\Delta f}\\right|_{\\phi=\\pi} = \\frac{-a + a^2}{(1-a)^2} = \\frac{-0.250}{0.250} = -1.000$$

**Answer**: the interferer contributes a periodic disturbance with zero mean, so
the wanted signal is reproduced and the weaker one is suppressed entirely. Real
receivers need a capture ratio of one to two decibels rather than the zero this
idealisation predicts, because a finite limiter and receiver noise blur the
switch — but the mechanism is exactly the one above, and it is why an FM radio
moving between two transmitters flips from one to the other rather than
producing a blend.

| Effect | Governing quantity | What it means in practice |
|---|---|---|
| Noise triangle | Output noise rising as f squared | Treble is the noisiest part of the band |
| Pre-emphasis and de-emphasis | tau = 75 us gives 13.20 dB | Recovered at the cost of modulation headroom |
| Wideband improvement | 3 beta^2 (beta + 1) | 20.33 dB at beta = 3, 26.53 dB at beta = 5 |
| Threshold | About 10 dB CNR | Below it the advantage collapses within a decibel |
| Capture | Amplitude ratio through unity | The stronger signal wins outright |`,
      examTip: 'Two numbers carry most FM noise questions: the improvement factor 3 beta^2 (beta + 1), which is 20.33 dB at beta = 3 and 26.53 dB at beta = 5, and the pre-emphasis corner f = 1/(2 pi tau), which is 2122 Hz for tau = 75 us. Add the improvement in decibels to the carrier-to-noise ratio, then check the result is above the 10 dB threshold before quoting it.',
      importantNote: 'The FM improvement is measured against the CNR in the Carson bandwidth, so widening the bandwidth to raise beta also lowers the CNR that the factor multiplies. This is why the net benefit grows as beta squared rather than beta cubed once the noise bandwidth is accounted for, and why a link cannot be improved indefinitely by raising deviation.',
    },
    { id: 'am-fm-problem-set-a', title: '10. Problem Set A: Amplitude Modulation',
      content: `## Problem Set A — Amplitude Modulation

Work each problem before reading the solution. Every answer names the
distractor and the wrong number it produces, because on this exam the wrong
numbers are printed next to the right ones.

### A1. Envelope readings

An oscilloscope shows an AM envelope swinging between 15.0 V and 5.0 V. The
transmitter feeds a 50 ohm load. Find the modulation index, the unmodulated
carrier amplitude, the total transmitted power and the efficiency.

**Solution.**

$$m = \\frac{V_{max} - V_{min}}{V_{max} + V_{min}} = \\frac{15.0 - 5.0}{15.0 + 5.0} = 0.500$$

$$A_c = \\frac{V_{max} + V_{min}}{2} = \\frac{15.0 + 5.0}{2} = 10.0\\ \\mathrm{V}$$

$$P_c = \\frac{A_c^2}{2R} = \\frac{100}{100} = 1.000\\ \\mathrm{W}$$

$$P_{total} = P_c\\left(1 + \\frac{m^2}{2}\\right) = 1.000 \\times 1.125 = 1.125\\ \\mathrm{W}$$

$$\\eta = \\frac{m^2}{2 + m^2} = \\frac{0.250}{2.250} = 0.1111 = 11.11\\%$$

**Trap**: reading the index as the ratio of the two voltages, 15.0/5.0 = 3.00.
That is not an index at all — an index above one is overmodulation, and above
three is meaningless. The index is a difference over a sum, never a ratio.

### A2. Power split from a total

A transmitter delivers 4.40 kW at m = 0.700. Find the carrier power, the power
in each sideband, and the efficiency.

**Solution.** With m^2/2 = 0.245,

$$P_c = \\frac{P_{total}}{1 + m^2/2} = \\frac{4400}{1.245} = 3534.14\\ \\mathrm{W}$$

$$P_{sb,total} = 4400 - 3534.14 = 865.86\\ \\mathrm{W}, \\qquad P_{\\text{each}} = \\frac{865.86}{2} = 432.93\\ \\mathrm{W}$$

$$\\eta = \\frac{0.490}{2.490} = 0.19679 = 19.68\\%$$

**Trap**: computing P_c = P_total(1 - m^2/2) = 4400 x 0.755 = 3322 W. The
relation is a division, not a subtraction, and the shortcut is 212 W low. Check
by multiplying back: 3534.14 x 1.245 = 4400 W.

### A3. Two tones and the antenna ammeter

Two tones modulate a carrier at m_1 = 0.500 and m_2 = 0.600. The unmodulated
antenna current is 8.00 A. Find the effective index, the efficiency and the
modulated antenna current.

**Solution.**

$$m_{eff} = \\sqrt{0.500^2 + 0.600^2} = \\sqrt{0.610} = 0.781$$

$$\\eta = \\frac{0.610}{2.610} = 0.23372 = 23.37\\%$$

$$I = I_c\\sqrt{1 + \\frac{m_{eff}^2}{2}} = 8.00\\sqrt{1.305} = 8.00 \\times 1.14237 = 9.139\\ \\mathrm{A}$$

**Trap**: adding the indices to get 1.100 and declaring the transmitter
overmodulated. Powers add, so indices add in quadrature; the true index is 0.781
and the transmitter is well inside its limit.

### A4. The SSB comparison

An AM transmitter delivers 5.00 kW total at m = 0.800. What power would an SSB
transmitter need to deliver the same recovered message, and what is the saving
in decibels?

**Solution.**

$$P_c = \\frac{5000}{1.320} = 3787.88\\ \\mathrm{W}, \\qquad P_{one\\ sideband} = \\frac{5000 - 3787.88}{2} = 606.06\\ \\mathrm{W}$$

$$\\text{saving} = 10\\log_{10}\\frac{5000}{606.06} = 10\\log_{10}8.250 = 9.16\\ \\mathrm{dB}$$

**Trap**: answering 3.01 dB on the reasoning that SSB sends "half" the signal.
Halving applies to the BANDWIDTH, exactly; the power saving is 9.16 dB here
because the carrier goes too. The two savings are unrelated numbers and the exam
prints both.

### A5. The overmodulation boundary

An envelope is observed to fall to exactly zero at its minimum, with a maximum
of 24.0 V, into 50 ohms. Find the index, the carrier amplitude and the total
power.

**Solution.** With V_min = 0,

$$m = \\frac{24.0 - 0}{24.0 + 0} = 1.000, \\qquad A_c = \\frac{24.0 + 0}{2} = 12.0\\ \\mathrm{V}$$

$$P_c = \\frac{144}{100} = 1.440\\ \\mathrm{W}, \\qquad P_{total} = 1.440 \\times 1.500 = 2.160\\ \\mathrm{W}$$

and the efficiency is at its ceiling, 33.33%.

**Trap**: taking A_c = 24.0 V because that is the largest voltage on the screen.
The envelope peak is A_c(1 + m), which at m = 1 is twice the carrier. Using
24.0 V gives P_c = 5.76 W, four times too large.

### A6. Bandwidth for a real message

A message occupies 200 Hz to 4.50 kHz. Find the transmitted bandwidth for
standard AM, for DSB-SC and for SSB.

**Solution.** AM and DSB-SC both carry two sidebands, each a mirror of the
message band, so the occupied span reaches from f_c - 4500 to f_c + 4500:

$$BW_{AM} = BW_{DSB-SC} = 2 \\times 4500 = 9000\\ \\mathrm{Hz}$$

SSB carries one sideband, which runs from f_c + 200 to f_c + 4500:

$$BW_{SSB} = 4500 - 200 = 4300\\ \\mathrm{Hz}$$

**Trap**: quoting 4.50 kHz for SSB by halving the AM figure. The single sideband
starts where the message starts, not at the carrier, so the 200 Hz low-frequency
limit is a genuine 200 Hz saving. This is also why SSB voice channels are
specified as 300 Hz to 3.0 kHz and allocated 2.7 kHz rather than 3.0 kHz.`,
      examTip: 'Every AM problem reduces to finding m first. From envelope voltages it is a difference over a sum; from powers it is P_total/P_c = 1 + m^2/2; from currents it is the square of the current ratio. Once m is in hand, efficiency, sideband power and bandwidth are one line each.',
      importantNote: 'SSB halves the bandwidth exactly but saves a power that depends on the modulation index — 7.78 dB at m = 1, 9.16 dB at m = 0.8. Answering 3 dB for either quantity is the single most common error in this topic.',
    },
    { id: 'am-fm-problem-set-b', title: '11. Problem Set B: Angle Modulation',
      content: `## Problem Set B — Angle Modulation

### B1. Deviation, index and bandwidth

A frequency modulator has k_f = 20.0 kHz/V and is driven by a 3.00 V tone at
5.00 kHz. Find the deviation, the index and the Carson bandwidth.

**Solution.**

$$\\Delta f = k_f A_m = 20.0 \\times 3.00 = 60.0\\ \\mathrm{kHz}$$

$$\\beta = \\frac{60.0}{5.00} = 12.0$$

$$BW = 2(\\Delta f + f_m) = 2 \\times 65.0 = 130\\ \\mathrm{kHz}$$

**Trap**: using the wideband shortcut BW = 2 Delta_f = 120 kHz. At beta = 12 the
shortcut is only 7.7% low, which is why it survives as a rule of thumb, but the
exam prints 120 kHz as a distractor whenever it also prints 130 kHz.

### B2. What changes when the message amplitude doubles

The same modulator is now driven by a 6.00 V tone at the same 5.00 kHz. Find the
new deviation, index and bandwidth.

**Solution.**

$$\\Delta f = 20.0 \\times 6.00 = 120\\ \\mathrm{kHz}, \\qquad \\beta = \\frac{120}{5.00} = 24.0$$

$$BW = 2 \\times 125 = 250\\ \\mathrm{kHz}$$

**Trap**: assuming beta is a property of the modulator and leaving it at 12.0,
which gives 130 kHz again. Both the deviation and the index scale with message
amplitude; only the message FREQUENCY leaves the deviation alone.

### B3. The same message through a phase modulator

A phase modulator has k_p = 4.00 rad/V and is driven by the same 3.00 V tone.
Find the deviation and bandwidth at f_m = 5.00 kHz, then at f_m = 10.0 kHz.

**Solution.** The peak phase deviation is set by amplitude alone:

$$\\beta_p = k_p A_m = 4.00 \\times 3.00 = 12.0\\ \\mathrm{rad}$$

$$\\Delta f = \\beta_p f_m = 12.0 \\times 5.00 = 60.0\\ \\mathrm{kHz}, \\qquad BW = 2 \\times 65.0 = 130\\ \\mathrm{kHz}$$

At 10.0 kHz the index is unchanged but the deviation is not:

$$\\Delta f = 12.0 \\times 10.0 = 120\\ \\mathrm{kHz}, \\qquad BW = 2 \\times 130 = 260\\ \\mathrm{kHz}$$

**Trap**: carrying the FM habit across and holding the deviation at 60.0 kHz,
which gives 140 kHz for the second case instead of 260 kHz. In PM the index is
constant and the deviation scales with f_m; in FM it is the other way round.
Note also that at 5.00 kHz this PM signal and the FM signal of problem B1 are
numerically identical — one tone cannot distinguish them.

### B4. Setting deviation by the carrier null

A laboratory modulates a transmitter with a 2.00 kHz tone and raises the
modulating level until the carrier line on a spectrum analyser first disappears.
What is the deviation?

**Solution.** The carrier line is J_0(beta) A_c, and the first zero of J_0 is at
beta = 2.4048:

$$\\Delta f = \\beta f_m = 2.4048 \\times 2.00 = 4.81\\ \\mathrm{kHz}$$

**Trap**: using the second zero, beta = 5.5201, which gives 11.04 kHz. The
question says FIRST disappearance, and the two nulls are 2.3 times apart, so the
distractor is not close. A second trap is dividing rather than multiplying:
2.00/2.4048 = 0.832 kHz.

### B5. Where the power sits at beta = 5

A 100 W FM transmitter operates at beta = 5.00. How much power is in the carrier
line, how much in the fourth sideband pair, and how much falls outside the
Carson bandwidth?

**Solution.** Each line holds the fraction J_n^2(5.00):

$$P_{carrier} = 0.03154 \\times 100 = 3.15\\ \\mathrm{W}$$

$$P_{n=4\\ pair} = 2 \\times 0.15306 \\times 100 = 30.61\\ \\mathrm{W}$$

The Carson band reaches n = 6 and encloses 99.356% of the power, so

$$P_{outside} = 100 - 99.36 = 0.64\\ \\mathrm{W}$$

**Trap**: assuming the carrier holds most of the power, as it does in AM. In
wideband FM the carrier is a minor line — here the fourth sideband pair carries
nearly ten times as much. A second trap is quoting "2% outside Carson" from the
familiar 98% slogan, which overstates the spill by a factor of three.

### B6. Improvement, threshold and the decision

An FM link operates at beta = 3.00 with a measured carrier-to-noise ratio of
14.0 dB in its Carson bandwidth. The discriminator threshold is 10.0 dB. Find
the output signal-to-noise ratio and the fade margin, and state whether raising
beta to 5.00 at constant transmitter power would help.

**Solution.**

$$3\\beta^2(\\beta+1) = 3 \\times 9.00 \\times 4.00 = 108, \\qquad 10\\log_{10}(108) = 20.33\\ \\mathrm{dB}$$

$$SNR_{out} = 14.0 + 20.33 = 34.3\\ \\mathrm{dB}, \\qquad \\text{margin} = 14.0 - 10.0 = 4.0\\ \\mathrm{dB}$$

Raising beta to 5.00 widens the Carson bandwidth from 2(4.00)f_m to 2(6.00)f_m,
a factor of 1.500, so the CNR falls by 10 log10(1.500) = 1.76 dB to 12.24 dB.
The improvement factor rises to 3(25.0)(6.00) = 450, or 26.53 dB, so

$$SNR_{out} = 12.24 + 26.53 = 38.8\\ \\mathrm{dB}, \\qquad \\text{margin} = 12.24 - 10.0 = 2.2\\ \\mathrm{dB}$$

**Answer**: 4.4 dB more output signal-to-noise ratio, bought with 1.8 dB less
fade margin. Whether that is a good trade depends on the channel, and on a
fading path it usually is not — an FM link that drops below threshold loses far
more than 4.4 dB.

**Trap**: raising beta and leaving the CNR alone, which predicts 40.5 dB and no
cost at all. Widening the transmission bandwidth admits more noise, and that
loss has to be carried into the answer.

| Problem | The one line that decides it | Distractor it defeats |
|---|---|---|
| B1, B2 | Delta_f = k_f A_m, with no f_m in it | BW = 2 Delta_f |
| B3 | beta_p = k_p A_m, with no f_m in it | Holding the PM deviation fixed |
| B4 | First zero of J_0 is 2.4048 | The second zero, 5.5201 |
| B5 | Line power is J_n squared, doubled for a pair | Carrier-dominance intuition from AM |
| B6 | Widening the band lowers the CNR first | Adding the improvement to an unchanged CNR |`,
      examTip: 'Angle-modulation problems are won in the first line. Identify FM or PM, write the deviation from the modulator constant and the message AMPLITUDE, form beta, then apply Carson. If the question changes the message frequency, ask which of deviation and index is the one that moves before touching a calculator.',
      importantNote: 'Raising the modulation index is not free noise improvement. The 3 beta^2 (beta + 1) factor multiplies the CNR measured in the Carson bandwidth, and that bandwidth grows as (beta + 1), so widening deviation at constant transmitter power lowers the CNR before the factor is applied and eats into the fade margin above threshold.',
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

**Step 3**: From Q-function table: Q(4.47) ≈ **$3.9 \\times 10^-6$**

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
| BER at high SNR | 4/3 = 1.33 x Gray, measured | baseline |

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
    { id: 'digmod-signal-space', title: '7. Constellations, Decision Regions and Minimum Distance',
      content: `## 7.1 Every scheme in this chapter is a set of points in a plane

A carrier has exactly two degrees of freedom at a given frequency: how much of
$\\cos(2\\pi f_c t)$ it contains and how much of $\\sin(2\\pi f_c t)$. Any modulated
symbol can therefore be written

$$s_k(t) = I_k\\sqrt{\\tfrac{2}{T_s}}\\cos(2\\pi f_c t) - Q_k\\sqrt{\\tfrac{2}{T_s}}\\sin(2\\pi f_c t)$$

and the pair (I_k, Q_k) is a point in a plane. That plane is the constellation,
and it is not a diagram drawn afterwards to illustrate a scheme; it IS the
scheme. ASK varies the radius along one axis, PSK varies the angle at fixed
radius, QAM varies both. The symbol energy is the squared distance from the
origin:

$$E_k = I_k^2 + Q_k^2, \\qquad E_s = \\frac{1}{M}\\sum_{k=1}^{M} E_k$$

A matched filter projects the received waveform back onto the same two axes, so
after detection the receiver holds a noisy point and must decide which of the M
transmitted points it came from. Because the noise is circularly symmetric
Gaussian, the maximum-likelihood decision is simply the NEAREST point, and the
decision regions are the perpendicular bisectors between neighbouring points.
For a square QAM grid those bisectors are horizontal and vertical lines, so the
decision reduces to two independent one-dimensional comparisons — which is why
square QAM demodulators are cheap.

![A 16-QAM constellation with Gray-coded four-bit labels on each point, drawn in units of the minimum spacing d, with the vertical and horizontal decision boundaries between neighbouring points. The average symbol energy is 2.500 d squared, so the minimum distance is 0.6325 times the square root of the symbol energy, and the corner points sit at radius 2.121 d, a peak-to-average power ratio of 1.80.](/courses/fe-ee/figures/com2-qam16-regions.svg)

## 7.2 Average energy fixes the spacing

Put the square M-QAM points at odd multiples of d/2 on each axis. Averaging the
squared coordinate over the L = sqrt(M) levels of one axis and doubling for the
two axes gives the standard result

$$E_s = \\frac{M-1}{6}d^2 \\qquad\\Longleftrightarrow\\qquad d = \\sqrt{\\frac{6E_s}{M-1}}$$

Read the second form as the whole argument for why bigger constellations need
more power. Hold the transmitted power fixed and the spacing shrinks as
1/sqrt(M - 1). Since error probability depends on the spacing measured against
the noise, the required signal-to-noise ratio rises by exactly the reciprocal:

$$\\text{SNR penalty vs QPSK} = 10\\log_{10}\\frac{M-1}{3}\\ \\mathrm{dB}$$

$$10\\log_{10}\\frac{15}{3} = 6.99\\ \\mathrm{dB},\\qquad 10\\log_{10}\\frac{63}{15} = 6.23\\ \\mathrm{dB},\\qquad 10\\log_{10}\\frac{255}{63} = 6.07\\ \\mathrm{dB}$$

Each quadrupling costs a little under 7 dB and the increments settle toward
6.02 dB as M grows, because (M - 1)/(M/4 - 1) tends to 4. This is the geometric
statement of the claim in Section 1.2, and it is worth being able to reconstruct
in ten seconds rather than recall.

### Worked example 7A — energies, spacing and peak-to-average for 16-QAM

**Given** a 16-QAM constellation with points at $(\\pm 1, \\pm 3)$ and
$(\\pm 3, \\pm 1)$ and so on, that is d = 2.

$$E_s = \\frac{1}{16}\\sum_k (I_k^2 + Q_k^2) = 2\\times\\frac{1^2 + 3^2}{2} = 10.0$$

$$E_b = \\frac{E_s}{\\log_2 M} = \\frac{10.0}{4} = 2.50$$

$$\\frac{d}{\\sqrt{E_s}} = \\frac{2}{\\sqrt{10}} = 0.6325$$

$$\\mathrm{PAPR} = \\frac{E_{peak}}{E_s} = \\frac{3^2 + 3^2}{10.0} = \\frac{18.0}{10.0} = 1.80$$

**Answer**: E_s = 10.0, E_b = 2.50, minimum distance 0.6325 sqrt(E_s), and a
peak-to-average power ratio of 1.80. That last number is not decoration: a power
amplifier must be backed off by 10 log10(1.80) = 2.55 dB from its saturated
output to pass the corner points without clipping, which is a real cost of
higher-order QAM that the BER curves never show.

**Trap**: computing E_s as the energy of the outermost point, 18.0. That is the
PEAK, not the average, and using it makes 16-QAM look 2.55 dB better than it is.

## 7.3 PSK puts every point on a circle

For M-PSK the points sit at equal angles on a circle of radius sqrt(E_s), so
every symbol has the same energy and the chord between neighbours is

$$d_{min} = 2\\sqrt{E_s}\\,\\sin\\!\\frac{\\pi}{M}$$

![Three panels showing BPSK, QPSK and 8-PSK as equally spaced points on a circle of unit radius, with the chord between adjacent points drawn. The minimum distances are 2.000, 1.414 and 0.765 times the square root of the symbol energy respectively.](/courses/fe-ee/figures/com2-psk-mindist.svg)

The sine collapses fast. Going from BPSK to QPSK costs
$10\\log_{10}(2.000/1.414)^2 = 3.01\\ \\mathrm{dB}$ of symbol energy, but QPSK
carries two bits instead of one, so the ENERGY PER BIT is unchanged — the
reason BPSK and QPSK share a BER curve. Beyond QPSK the sine keeps shrinking
while the bit count only grows logarithmically, and PSK stops being competitive.

### Worked example 7B — the price of the third bit in PSK

**Given** QPSK and 8-PSK at the same average symbol energy. What is the penalty?

$$d_{QPSK} = 2\\sin\\frac{\\pi}{4} = 1.4142\\sqrt{E_s}, \\qquad d_{8PSK} = 2\\sin\\frac{\\pi}{8} = 0.7654\\sqrt{E_s}$$

$$\\text{penalty} = 20\\log_{10}\\frac{1.4142}{0.7654} = 5.33\\ \\mathrm{dB}$$

**Answer**: 5.33 dB of symbol energy for one extra bit per symbol. Since 8-PSK
carries three bits against QPSK's two, converting to energy per bit returns
$5.33 - 1.76 = 3.57\\ \\mathrm{dB}$, and solving the two error expressions exactly
at a BER of 1e-5 gives 3.38 dB — the geometric estimate is within 0.2 dB of the
truth, which is all an exam needs. Compare this
with 16-QAM, which carries FOUR bits at a minimum distance of
$0.6325\\sqrt{E_s}$ against 16-PSK's $0.3902\\sqrt{E_s}$ — the QAM arrangement
wins by $20\\log_{10}(0.6325/0.3902) = 4.20\\ \\mathrm{dB}$ at the same point
count. That gap is why every modern high-rate system uses QAM rather than
high-order PSK.

**Trap**: assuming "3 dB per extra bit" applies to PSK. It applies roughly to
QAM, where the points spread into two dimensions; PSK crowds them onto a circle
and the penalty grows without bound.

### Worked example 7C — which constellation fits a given minimum distance

**Given** a channel where the receiver can reliably resolve points no closer
than 0.60 sqrt(E_s). Which square QAM constellations qualify?

$$\\frac{d}{\\sqrt{E_s}} = \\sqrt{\\frac{6}{M-1}}$$

$$M = 4: \\sqrt{\\frac{6}{3}} = 1.414, \\qquad M = 16: \\sqrt{\\frac{6}{15}} = 0.632, \\qquad M = 64: \\sqrt{\\frac{6}{63}} = 0.309$$

**Answer**: QPSK and 16-QAM clear the 0.60 threshold; 64-QAM does not, at
0.309. Note how sharply the requirement bites — 64-QAM's points are less than
half as far apart as 16-QAM's at the same transmitted power, which is the same
6.23 dB found in Section 7.2, expressed as a distance instead of a power.

| Scheme | Bits per symbol | d / sqrt(Es) | Constellation shape |
|---|---|---|---|
| BPSK | 1 | 2.000 | Two points on a line |
| QPSK (= 4-QAM) | 2 | 1.414 | Square corners |
| 8-PSK | 3 | 0.765 | Circle of eight |
| 16-QAM | 4 | 0.632 | 4 by 4 grid |
| 16-PSK | 4 | 0.390 | Circle of sixteen |
| 64-QAM | 6 | 0.309 | 8 by 8 grid |
| 256-QAM | 8 | 0.153 | 16 by 16 grid |`,
      examTip: 'Draw the constellation before reaching for a formula. Square QAM: Es = (M-1)d^2/6, so d = sqrt(6 Es/(M-1)) and the SNR penalty against QPSK is 10 log10[(M-1)/3]. M-PSK: d = 2 sqrt(Es) sin(pi/M). Comparing two schemes is comparing two minimum distances at the same average energy.',
      importantNote: 'Peak-to-average power ratio is a real design constraint that BER curves hide. 16-QAM has a PAPR of 1.80, worth 2.55 dB of amplifier back-off; QPSK and every other constant-envelope scheme has a PAPR of 1.00 and needs none. That is part of why constant-envelope schemes survive in power-limited links.',
    },
    { id: 'digmod-rates-ebn0', title: '8. Symbol Rate, Bit Rate, Bandwidth and the Eb/N0 Conversion',
      content: `## 8.1 Three rates, related by two constants

Confusing the three rates is the most productive source of wrong answers in
this topic, so fix them in order.

**Symbol rate** R_s, in symbols per second, is set by the channel bandwidth. A
Nyquist-shaped channel of bandwidth B carries

$$R_s = \\frac{B}{1 + \\alpha}$$

where alpha is the raised-cosine roll-off. With alpha = 0 the channel carries
exactly B symbols per second — the Nyquist limit, unrealisable but the reference
everything else is quoted against.

**Bit rate** R_b, in bits per second, is the symbol rate times the bits each
symbol carries:

$$R_b = R_s\\log_2 M$$

**Bandwidth efficiency** eta is the bit rate per hertz of channel:

$$\\eta = \\frac{R_b}{B} = \\frac{\\log_2 M}{1 + \\alpha}$$

Note what the roll-off does: it never appears in the constellation geometry and
never changes the required Eb/N0, but it scales every rate. A system quoted at
"6 bit/s/Hz for 64-QAM" is quoting the alpha = 0 ideal; the same equipment with
alpha = 0.15 delivers 5.22 bit/s/Hz.

### Worked example 8A — a channel plan from bandwidth outward

**Given** a 6.00 MHz channel with roll-off alpha = 0.15, carrying 64-QAM.

$$R_s = \\frac{6.00}{1.15} = 5.2174\\ \\mathrm{Msym/s}$$

$$R_b = R_s\\log_2 64 = 6 \\times 5.2174 = 31.30\\ \\mathrm{Mbps}$$

$$\\eta = \\frac{31.30}{6.00} = 5.217\\ \\mathrm{bit/s/Hz}$$

**Answer**: 5.22 Msym/s, 31.3 Mbps, 5.22 bit/s/Hz. **Trap**: multiplying the
bandwidth by log2(M) directly, giving 36.0 Mbps and 6.00 bit/s/Hz. That answer
ignores the roll-off entirely and is 15% high — and 36.0 Mbps is a number the
exam is happy to print, because it is also what a Nyquist-ideal channel would
give.

## 8.2 Eb/N0 is not SNR, and the difference is a rate ratio

Signal-to-noise ratio is a ratio of POWERS measured in the channel bandwidth.
Energy per bit over noise density is a ratio of ENERGIES per information bit.
They are connected by the rates:

$$S = E_b R_b, \\qquad N = N_0 B \\qquad\\Longrightarrow\\qquad \\frac{S}{N} = \\frac{E_b}{N_0}\\cdot\\frac{R_b}{B}$$

$$\\frac{E_b}{N_0} = \\frac{S}{N}\\cdot\\frac{B}{R_b} = \\frac{S/N}{\\eta}$$

In decibels this is a subtraction, which is the form to use under exam
pressure:

$$\\left(\\frac{E_b}{N_0}\\right)_{dB} = \\left(\\frac{S}{N}\\right)_{dB} - 10\\log_{10}\\eta$$

The sign trips people constantly. A spectrally efficient link has eta greater
than one, so its Eb/N0 is LOWER than its SNR — the energy of a given SNR has to
be shared among more bits. Only for eta below one does Eb/N0 exceed SNR.

The symbol-energy ratio is the third member of the family:

$$\\frac{E_s}{N_0} = \\frac{E_b}{N_0}\\log_2 M$$

so the 3.01 dB per extra bit per symbol that separates Eb/N0 penalties from SNR
penalties in Section 4.2 is just this factor.

### Worked example 8B — does the link close?

**Given** the 6.00 MHz 64-QAM link of example 8A with a measured SNR of
18.0 dB. Does it reach a bit error rate of 1e-5?

$$\\eta = 5.217, \\qquad 10\\log_{10}(5.217) = 7.17\\ \\mathrm{dB}$$

$$\\left(\\frac{E_b}{N_0}\\right)_{dB} = 18.00 - 7.17 = 10.83\\ \\mathrm{dB}$$

64-QAM needs 17.79 dB for a BER of 1e-5, so

$$\\text{shortfall} = 17.79 - 10.83 = 6.96\\ \\mathrm{dB}$$

**Answer**: no. The link is 6.96 dB short and will not run 64-QAM at that error
rate. Dropping to 16-QAM raises eta only to 3.478 (a 5.41 dB conversion), giving
Eb/N0 = 12.59 dB against a 13.43 dB requirement — still 0.84 dB short. QPSK
gives eta = 1.739, a 2.40 dB conversion, so Eb/N0 = 15.60 dB against 9.59 dB
required, with 6.01 dB to spare. QPSK is the answer.

**Trap**: comparing the 18.0 dB SNR directly against the 17.79 dB requirement
and concluding the link closes with 0.2 dB to spare. Those are different
quantities. The conversion is the whole problem, and skipping it flips the
answer.

## 8.3 How close is any of this to the Shannon bound?

Setting the capacity equal to the bit rate and solving for the energy per bit
gives the minimum Eb/N0 at which a given efficiency is possible at all:

$$\\eta = \\log_2\\!\\left(1 + \\frac{S}{N}\\right) \\qquad\\Longrightarrow\\qquad \\left(\\frac{E_b}{N_0}\\right)_{min} = \\frac{2^{\\eta} - 1}{\\eta}$$

$$\\lim_{\\eta\\to 0}\\frac{2^{\\eta}-1}{\\eta} = \\ln 2 = 0.693 = -1.59\\ \\mathrm{dB}$$

![Bandwidth efficiency plotted against the energy per bit each scheme requires at a bit error rate of one in a hundred thousand, with the Shannon bound drawn alongside. Square QAM from 4 to 256 points needs 9.59, 13.43, 17.79 and 22.50 dB; the Shannon bound at the same efficiencies is far to the left, leaving 7.69 dB of coding gain unclaimed at 4 bit per second per hertz, and no scheme of any kind can operate to the left of the minus 1.59 dB limit.](/courses/fe-ee/figures/com2-eff-vs-ebn0.svg)

### Worked example 8C — the gap uncoded modulation leaves on the table

**Given** 16-QAM at 4 bit/s/Hz, needing 13.43 dB for a BER of 1e-5.

$$\\left(\\frac{E_b}{N_0}\\right)_{min} = \\frac{2^4 - 1}{4} = \\frac{15}{4} = 3.75 = 5.74\\ \\mathrm{dB}$$

$$\\text{gap} = 13.43 - 5.74 = 7.69\\ \\mathrm{dB}$$

**Answer**: 7.69 dB. That gap is exactly what forward error correction is for,
and modern codes recover most of it — which is why a real 16-QAM link with a
strong code runs at an SNR an uncoded analysis would call hopeless. **Trap**:
treating the Shannon figure as an achievable target for uncoded modulation. It
is a bound on what any scheme could do with unlimited coding and delay, not a
requirement any constellation meets on its own.

| Quantity | Formula | 6 MHz, alpha = 0.15, 64-QAM |
|---|---|---|
| Symbol rate | B/(1 + alpha) | 5.217 Msym/s |
| Bit rate | R_s log2 M | 31.30 Mbps |
| Efficiency | log2 M/(1 + alpha) | 5.217 bit/s/Hz |
| Eb/N0 from SNR | SNR minus 10 log10 eta | 18.00 - 7.17 = 10.83 dB |
| Es/N0 from Eb/N0 | plus 10 log10(log2 M) | 10.83 + 7.78 = 18.61 dB |
| Shannon minimum Eb/N0 | (2^eta - 1)/eta | 8.41 dB |`,
      examTip: 'Write the rate chain down before anything else: R_s = B/(1 + alpha), R_b = R_s log2 M, eta = R_b/B. Then Eb/N0 in dB is SNR in dB minus 10 log10(eta). The subtraction is the step questions are built around, and its sign is the trap: an efficient link has Eb/N0 BELOW its SNR.',
      importantNote: 'Roll-off never changes the Eb/N0 a constellation requires, only the rate it achieves. Alpha = 0.15 on a 64-QAM channel costs 0.61 bit/s/Hz of efficiency and nothing at all in required signal quality, so it appears in every rate calculation and in none of the BER work.',
    },
    { id: 'digmod-error-probability', title: '9. Error Probability: the Q-Function, Gray Coding and Measurement',
      content: `## 9.1 One integral answers every binary decision

Detection reduces to asking whether Gaussian noise pushed a sample across a
boundary. The probability of that is the Gaussian tail:

$$Q(x) = \\frac{1}{\\sqrt{2\\pi}}\\int_x^{\\infty} e^{-u^2/2}\\,du$$

For antipodal signalling the two points are 2 sqrt(E_b) apart, the boundary sits
halfway, and the noise standard deviation along that axis is sqrt(N_0/2), so

$$P_b^{BPSK} = Q\\!\\left(\\frac{d/2}{\\sigma}\\right) = Q\\!\\left(\\sqrt{\\frac{2E_b}{N_0}}\\right)$$

QPSK is two independent BPSK streams on the in-phase and quadrature axes, each
carrying half the symbol energy and half the bits, so the energy per bit is the
same on each axis and the bit error rate is identical:

$$P_b^{QPSK} = Q\\!\\left(\\sqrt{\\frac{2E_b}{N_0}}\\right)$$

Coherent binary FSK uses orthogonal rather than antipodal signals, and
orthogonal points are only sqrt(2 E_b) apart instead of 2 sqrt(E_b):

$$P_b^{BFSK} = Q\\!\\left(\\sqrt{\\frac{E_b}{N_0}}\\right)$$

which is exactly $10\\log_{10}2 = 3.01\\ \\mathrm{dB}$ worse than BPSK, forever,
at every error rate. That 3 dB is the entire content of "PSK beats FSK".

![Bit error rate against energy per bit for QPSK, 16-QAM and 64-QAM. The closed-form expressions are drawn as continuous lines and Monte-Carlo bit counts over 600 000 symbols per point are overlaid as open circles; the two agree everywhere within the counting statistics of the run. The curves cross a bit error rate of one in a hundred thousand at 9.59, 13.43 and 17.79 dB.](/courses/fe-ee/figures/com2-ber-mc.svg)

The open circles are there because a curve computed from the same expression the
lesson quotes proves nothing about the expression. They are independent: symbols
are generated, Gaussian noise is added, hard decisions are made, and the bits
that came out wrong are counted. Every marker agrees with the closed form to
within the counting statistics of its own run, which is the only kind of
agreement worth having between a formula and a measurement.

### Worked example 9A — a BER from an Eb/N0, and back again

**Given** BPSK at Eb/N0 = 8.00 dB.

$$\\frac{E_b}{N_0} = 10^{8.00/10} = 6.310$$

$$\\sqrt{\\frac{2E_b}{N_0}} = \\sqrt{12.62} = 3.552$$

$$P_b = Q(3.552) = 1.91\\times 10^{-4}$$

Now backwards: what Eb/N0 gives a BER of 1e-6?

$$Q^{-1}(10^{-6}) = 4.753 \\qquad\\Longrightarrow\\qquad \\frac{E_b}{N_0} = \\frac{4.753^2}{2} = 11.30 = 10.53\\ \\mathrm{dB}$$

**Answer**: 1.91e-4 at 8.00 dB, and 10.53 dB is needed for 1e-6. **Trap**:
forgetting the factor of two inside the square root and computing Q(2.512) =
6.0e-3, which is more than thirty times too pessimistic. The 2 comes from the
antipodal geometry and is not a normalisation convention.

## 9.2 M-QAM: two PAM decisions, then Gray coding

A square M-QAM decision is two independent L-level decisions with
L = sqrt(M). Each has interior points with two neighbours and edge points with
one, so the per-axis symbol error probability is

$$P_{axis} = 2\\left(1 - \\frac{1}{\\sqrt{M}}\\right)Q\\!\\left(\\sqrt{\\frac{3\\log_2 M}{M-1}\\cdot\\frac{E_b}{N_0}}\\right)$$

$$P_{symbol} = 1 - (1 - P_{axis})^2$$

and with Gray labelling nearly every symbol error costs exactly one bit, so

$$P_b \\approx \\frac{P_{symbol}}{\\log_2 M}$$

![Received 16-QAM clouds at two signal qualities on the same decision grid. At an Es/N0 of 14 dB the clouds visibly overlap their boundaries and the measured symbol error rate is 0.03715; at 18 dB they are well separated and the measured rate falls to 0.00057.](/courses/fe-ee/figures/com2-scatter-snr.svg)

### Worked example 9B — from a scatter plot to a bit error rate

**Given** 16-QAM at Es/N0 = 14.0 dB, as in the left panel above.

$$\\frac{E_s}{N_0} = 10^{14.0/10} = 25.12, \\qquad \\frac{E_b}{N_0} = \\frac{25.12}{4} = 6.280 = 7.98\\ \\mathrm{dB}$$

With E_s = 10 and d = 2 the per-axis noise standard deviation is
sqrt(E_s/(2 x 25.12)) = 0.4462, so the half-spacing measured in noise is
1/0.4462 = 2.241, giving

$$P_{axis} = 1.5\\,Q(2.241) = 1.5 \\times 0.01250 = 0.01875$$

$$P_{symbol} = 1 - (1 - 0.01875)^2 = 0.03715$$

$$P_b \\approx \\frac{0.03715}{4} = 9.29\\times 10^{-3}$$

**Answer**: a symbol error rate of 0.03715, matching the measured value printed
on the figure, and a bit error rate near 9.3e-3. The exact expression gives
9.376e-3, so the Gray approximation is 0.9% low here — good enough everywhere
the exam uses it, and it improves as the error rate falls.

**Trap**: reporting the symbol error rate when the question asks for the bit
error rate. They differ by log2(M), which for 16-QAM is a factor of four — one
of the largest single-step errors available in this topic.

## 9.3 Gray coding, measured rather than asserted

Neighbouring points are the ones confused first, so the LABELLING decides how
many bits a symbol error costs. Count the six adjacent pairs on a four-level
axis. Gray labelling (00, 01, 11, 10) differs by one bit at all three
boundaries, so the six directed transitions cost six bit flips. Natural binary
(00, 01, 10, 11) differs by two bits at the middle boundary, so the same six
transitions cost eight. The high-SNR ratio is therefore

$$\\frac{P_b^{natural}}{P_b^{Gray}} \\to \\frac{8}{6} = \\frac{4}{3} = 1.333$$

![Two panels measuring the cost of labelling. The left panel plots measured bit error rate against energy per bit for 16-QAM with Gray labelling and with natural binary labelling, two million symbols per point. The right panel plots their ratio, which settles onto 4 over 3 equal to 1.333 as the signal quality rises.](/courses/fe-ee/figures/com2-gray-penalty.svg)

### Worked example 9C — what Gray coding is worth, in decibels

**Given** the measured 4/3 penalty, express it as a shift of the BER curve.

Near a BER of 1e-5 the 16-QAM curve falls a full decade for every 1.23 dB of
extra energy per bit, so an error-rate factor of 4/3 is worth

$$\\Delta \\approx 1.23\\log_{10}(1.333) = 1.23 \\times 0.1249 = 0.154\\ \\mathrm{dB}$$

**Answer**: Gray coding is worth about 0.15 dB of link margin at these error
rates, and it costs nothing whatever — it is a relabelling of points that are
transmitted identically either way. That is the entire argument for it: a free
0.17 dB, growing at lower error rates because the curve steepens. **Trap**:
believing Gray coding changes the SYMBOL error rate. It does not. The
constellation, the decision regions and the symbol error rate are all
unchanged; only the mapping from symbols to bits differs.

| Scheme | Bit error rate | Requirement at BER 1e-5 |
|---|---|---|
| BPSK | Q(sqrt(2 Eb/N0)) | 9.59 dB |
| QPSK | Q(sqrt(2 Eb/N0)), identical to BPSK | 9.59 dB |
| Coherent BFSK | Q(sqrt(Eb/N0)), 3.01 dB worse | 12.60 dB |
| 16-QAM | Gray-coded square form | 13.43 dB |
| 64-QAM | Gray-coded square form | 17.79 dB |
| 256-QAM | Gray-coded square form | 22.50 dB |`,
      examTip: 'Q(sqrt(2 Eb/N0)) covers BPSK and QPSK together; coherent BFSK drops the 2 and is 3.01 dB worse at every error rate. For M-QAM, work the per-axis PAM decision first, square up to the symbol error rate, then divide by log2(M) for the Gray-coded bit error rate.',
      importantNote: 'Symbol error rate and bit error rate differ by log2(M) under Gray coding — a factor of four for 16-QAM and six for 64-QAM. Read which one the question asks for before computing anything, because both appear among the printed options.',
    },
    { id: 'digmod-problem-set-c', title: '10. Problem Set C: Constellations, Rates and Bandwidth',
      content: `## Problem Set C — Constellations, Rates and Bandwidth

Each solution names the distractor and the wrong number it produces.

### C1. Rate plan for a wideband channel

A 20.0 MHz channel uses raised-cosine filtering with alpha = 0.35. Find the
symbol rate, and the bit rate and efficiency for QPSK and for 256-QAM.

**Solution.**

$$R_s = \\frac{20.0}{1.35} = 14.815\\ \\mathrm{Msym/s}$$

$$R_b^{QPSK} = 2 \\times 14.815 = 29.63\\ \\mathrm{Mbps}, \\qquad \\eta = \\frac{29.63}{20.0} = 1.481\\ \\mathrm{bit/s/Hz}$$

$$R_b^{256} = 8 \\times 14.815 = 118.5\\ \\mathrm{Mbps}, \\qquad \\eta = \\frac{118.5}{20.0} = 5.926\\ \\mathrm{bit/s/Hz}$$

**Trap**: quoting 2.00 and 8.00 bit/s/Hz by ignoring the roll-off. A 35%
roll-off costs a quarter of the throughput, which on a 118 Mbps link is 32 Mbps
of real capacity.

### C2. Does 256-QAM close at 25 dB SNR?

The same 20.0 MHz channel measures 25.0 dB SNR. Can it carry 256-QAM at a bit
error rate of 1e-5? What can it carry?

**Solution.** For 256-QAM, eta = 5.926, so

$$10\\log_{10}(5.926) = 7.73\\ \\mathrm{dB}, \\qquad \\frac{E_b}{N_0} = 25.00 - 7.73 = 17.27\\ \\mathrm{dB}$$

against a requirement of 22.50 dB, a shortfall of 5.23 dB. For QPSK,
eta = 1.481:

$$10\\log_{10}(1.481) = 1.71\\ \\mathrm{dB}, \\qquad \\frac{E_b}{N_0} = 25.00 - 1.71 = 23.29\\ \\mathrm{dB}$$

against 9.59 dB required, with 13.70 dB to spare. Working up the ladder, 64-QAM
has eta = 4.444 (6.48 dB), giving 18.52 dB against 17.79 dB required — 0.73 dB
of margin, which is thin but real.

**Answer**: 64-QAM, at 88.9 Mbps. **Trap**: comparing 25.0 dB SNR against the
22.50 dB requirement and selecting 256-QAM. The requirement is an Eb/N0, not an
SNR, and the conversion costs 7.73 dB here.

### C3. Minimum distance at fixed power

Three constellations are transmitted at the same average symbol energy: QPSK,
16-QAM and 16-PSK. Rank them by minimum distance and state the penalties in
decibels.

**Solution.**

$$d_{QPSK} = \\sqrt{\\frac{6}{3}} = 1.414\\sqrt{E_s}, \\qquad d_{16QAM} = \\sqrt{\\frac{6}{15}} = 0.632\\sqrt{E_s}$$

$$d_{16PSK} = 2\\sin\\frac{\\pi}{16} = 0.390\\sqrt{E_s}$$

$$20\\log_{10}\\frac{1.414}{0.632} = 6.99\\ \\mathrm{dB}, \\qquad 20\\log_{10}\\frac{0.632}{0.390} = 4.20\\ \\mathrm{dB}$$

**Answer**: QPSK is 6.99 dB better than 16-QAM, which is 4.20 dB better than
16-PSK at the same point count. **Trap**: assuming that constellations with the
same number of points perform alike. 16-PSK and 16-QAM both carry four bits per
symbol and differ by 4.20 dB, which is the difference between a link that works
and one that does not.

### C4. Peak-to-average and amplifier back-off

Find the peak-to-average power ratio of 16-QAM and of 64-QAM, and the back-off
each implies.

**Solution.** For a square constellation on odd multiples of d/2, the corner
point sits at $(L-1)d/2$ on each axis:

$$\\mathrm{PAPR}_{16} = \\frac{2(1.5)^2}{2.5} = \\frac{4.50}{2.50} = 1.80 = 2.55\\ \\mathrm{dB}$$

$$\\mathrm{PAPR}_{64} = \\frac{2(3.5)^2}{10.5} = \\frac{24.50}{10.50} = 2.333 = 3.68\\ \\mathrm{dB}$$

**Answer**: 2.55 dB and 3.68 dB of back-off. **Trap**: treating PAPR as a BER
issue. It is an amplifier issue, and it stacks on top of the SNR penalty — a
64-QAM link pays 6.23 dB more required SNR AND 1.13 dB more back-off than
16-QAM, so the true cost of the step is larger than the BER curves alone
suggest.

### C5. Bits, symbols and a common unit slip

A link runs 16-QAM at 5.00 Msym/s. State the bit rate, the bit duration and the
symbol duration.

**Solution.**

$$R_b = 4 \\times 5.00 = 20.0\\ \\mathrm{Mbps}$$

$$T_s = \\frac{1}{5.00\\times 10^6} = 200\\ \\mathrm{ns}, \\qquad T_b = \\frac{1}{20.0\\times 10^6} = 50\\ \\mathrm{ns}$$

**Trap**: giving 200 ns as the bit duration. The symbol is 200 ns long and
carries four bits, so each bit occupies 50 ns of transmission time. Every
energy-per-bit calculation depends on getting this the right way round, since
E_b = S T_b.

### C6. What the Nyquist limit actually forbids

A designer proposes 12.0 Mbps of QPSK in a 5.00 MHz channel. Is it possible,
and with what roll-off?

**Solution.**

$$R_s = \\frac{R_b}{\\log_2 M} = \\frac{12.0}{2} = 6.00\\ \\mathrm{Msym/s}$$

$$1 + \\alpha = \\frac{B}{R_s} = \\frac{5.00}{6.00} = 0.833 \\qquad\\Longrightarrow\\qquad \\alpha = -0.167$$

**Answer**: impossible. A negative roll-off is not a filter, it is a
contradiction: 6.00 Msym/s needs at least 6.00 MHz even with ideal brick-wall
filtering. The design needs 16-QAM (3.00 Msym/s, alpha = 0.67) or a wider
channel. **Trap**: accepting the arithmetic and reporting alpha = 0.167 by
dropping a sign, which turns an impossible design into a comfortable one.`,
      examTip: 'Convert before comparing. Requirements are quoted as Eb/N0; measurements are quoted as SNR; the bridge is 10 log10(eta) and it is a subtraction going from SNR to Eb/N0. If a question hands you both numbers in decibels and they look directly comparable, that is the trap.',
      importantNote: 'A negative roll-off, an efficiency above log2(M), or a symbol rate above the channel bandwidth are all the same impossibility wearing different clothes. Check R_s against B before trusting any rate answer.',
    },
    { id: 'digmod-problem-set-d', title: '11. Problem Set D: Error Probability and Modulation Choice',
      content: `## Problem Set D — Error Probability and Modulation Choice

### D1. BER from Eb/N0

Find the BPSK bit error rate at Eb/N0 = 7.00 dB and at 11.0 dB.

**Solution.**

$$10^{7.00/10} = 5.012, \\qquad \\sqrt{2 \\times 5.012} = 3.166, \\qquad Q(3.166) = 7.73\\times 10^{-4}$$

$$10^{11.0/10} = 12.59, \\qquad \\sqrt{2 \\times 12.59} = 5.018, \\qquad Q(5.018) = 2.61\\times 10^{-7}$$

**Answer**: 7.73e-4 and 2.61e-7. Four decibels buy more than three decades,
which is the steepness that makes fade margin worth paying for. **Trap**:
interpolating linearly between tabulated Q values on a linear scale. The tail
falls off as a Gaussian; interpolate the logarithm or use the argument, never
the probability.

### D2. QPSK against BPSK, settled

A link runs BPSK at 10.0 Mbps in 12.0 MHz. It switches to QPSK at the same bit
rate. What happens to the bandwidth, the symbol rate and the BER?

**Solution.** The bit rate is unchanged, so the symbol rate halves:

$$R_s^{BPSK} = 10.0\\ \\mathrm{Msym/s} \\longrightarrow R_s^{QPSK} = \\frac{10.0}{2} = 5.00\\ \\mathrm{Msym/s}$$

The occupied bandwidth halves with it. The energy per bit is unchanged, because
QPSK's symbols carry twice the energy and twice the bits, so

$$P_b = Q\\!\\left(\\sqrt{\\frac{2E_b}{N_0}}\\right)\\ \\text{for both}$$

**Answer**: half the bandwidth, the same bit rate, the same BER, and no penalty
of any kind. **Trap**: assuming QPSK must cost something because it has more
points. It does not, because its two axes are orthogonal and the noise on one
does not affect the other. The penalty starts at 8-PSK and at 16-QAM, where
points genuinely crowd.

### D3. Symbol error rate to bit error rate

A 64-QAM receiver reports a symbol error rate of 3.00e-4. What is the bit error
rate, assuming Gray coding?

**Solution.**

$$P_b \\approx \\frac{P_{symbol}}{\\log_2 64} = \\frac{3.00\\times 10^{-4}}{6} = 5.00\\times 10^{-5}$$

**Answer**: 5.00e-5. **Trap**: quoting 3.00e-4 as the bit error rate, a factor
of six too high, or multiplying by six instead of dividing, giving 1.80e-3 —
thirty-six times off. Gray coding makes each symbol error cost about ONE bit
out of the six the symbol carried, so the bit rate of errors is lower than the
symbol rate of errors, never higher.

### D4. Choosing a constellation for a measured channel

A 10.0 MHz channel with alpha = 0.25 measures 22.0 dB SNR. Which square QAM
constellation maximises throughput at a BER of 1e-5?

**Solution.**

$$R_s = \\frac{10.0}{1.25} = 8.00\\ \\mathrm{Msym/s}, \\qquad \\eta = \\frac{\\log_2 M}{1.25}$$

| M | eta (bit/s/Hz) | 10 log10 eta | Eb/N0 available | Eb/N0 required | Margin |
|---|---|---|---|---|---|
| 4 | 1.60 | 2.04 dB | 19.96 dB | 9.59 dB | +10.37 dB |
| 16 | 3.20 | 5.05 dB | 16.95 dB | 13.43 dB | +3.52 dB |
| 64 | 4.80 | 6.81 dB | 15.19 dB | 17.79 dB | -2.60 dB |
| 256 | 6.40 | 8.06 dB | 13.94 dB | 22.50 dB | -8.56 dB |

**Answer**: 16-QAM, at 32.0 Mbps, with 3.52 dB of margin. 64-QAM is 2.60 dB
short. **Trap**: choosing 64-QAM because 22.0 dB SNR exceeds its 17.79 dB
figure. The available Eb/N0 falls as the constellation grows, because the same
power is divided among more bits — so the two columns move TOWARDS each other
as M rises, and they cross between 16 and 64.

### D5. The FSK penalty

A system uses coherent binary FSK at Eb/N0 = 12.6 dB. What BER does it achieve,
and what would BPSK achieve at the same Eb/N0?

**Solution.**

$$P_b^{BFSK} = Q\\!\\left(\\sqrt{\\frac{E_b}{N_0}}\\right) = Q(\\sqrt{18.20}) = Q(4.266) = 9.96\\times 10^{-6}$$

$$P_b^{BPSK} = Q(\\sqrt{36.39}) = Q(6.033) = 8.06\\times 10^{-10}$$

**Answer**: FSK reaches 1e-5 where BPSK reaches 8.06e-10 — more than four decades
better at the same energy per bit, from the single factor of two inside the
square root. Equivalently, FSK needs 3.01 dB more energy per bit for any given
error rate. **Trap**: remembering the 3 dB as a BER ratio rather than an energy
ratio. It is 3 dB of ENERGY; on the error rate itself the gap is enormous
because the curve is steep.

### D6. Where the power actually goes

Two links carry 4 bits per symbol at the same average power: one uses 16-QAM,
one uses 16-PSK. Both need a BER of 1e-5. If the 16-QAM link needs 13.43 dB of
Eb/N0, estimate the 16-PSK requirement from the constellation geometry.

**Solution.** At equal symbol energy the minimum distances are
$0.6325\\sqrt{E_s}$ and $0.3902\\sqrt{E_s}$, so

$$\\text{penalty} = 20\\log_{10}\\frac{0.6325}{0.3902} = 4.20\\ \\mathrm{dB}$$

$$\\left(\\frac{E_b}{N_0}\\right)_{16PSK} \\approx 13.43 + 4.20 = 17.6\\ \\mathrm{dB}$$

**Answer**: about 17.6 dB, close to what 64-QAM needs while carrying two fewer
bits per symbol. That is the case against high-order PSK in one line.

**Trap**: assuming the two are equivalent because both carry four bits. The bit
count fixes the rate; the minimum distance fixes the power, and the two are
independent choices.

| Problem | Deciding step | Distractor it defeats |
|---|---|---|
| D1 | Q of a square root, never a linear interpolation | Reading between tabulated probabilities |
| D2 | Eb/N0 unchanged from BPSK to QPSK | Assuming more points must cost SNR |
| D3 | Divide the SER by log2(M) | Multiplying, or quoting the SER |
| D4 | Available Eb/N0 falls as M rises | Comparing SNR against an Eb/N0 requirement |
| D5 | The 2 inside the root is 3.01 dB of energy | Treating 3 dB as an error-rate ratio |
| D6 | Compare minimum distances at equal energy | Equating schemes by point count |`,
      examTip: 'The modulation-choice question has one shape every time: symbol rate from bandwidth, bit rate from log2(M), efficiency, then Eb/N0 = SNR - 10 log10(eta), then compare with the requirement. Build the four-column table and the answer is the last row with a positive margin.',
      importantNote: 'As M rises, the required Eb/N0 rises AND the available Eb/N0 falls, because the same received power is shared among more bits per second. The two effects move toward each other, which is why the highest workable constellation is usually one step below what a naive SNR comparison suggests.',
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

**Method 1 — Direct**: P_n = kTB = 1.38e-23 * 290 * 1e6 = **$4.0 \\times 10^-15\\ \\mathrm{W}$**

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
