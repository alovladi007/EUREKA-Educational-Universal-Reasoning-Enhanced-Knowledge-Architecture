// FE EE course content — Power Systems (7 topics).
// Split byte-identically from fe-ee-course-data.ts so section waves
// can be authored in parallel; spread back into FE_EE_COURSE there.
import type { TopicLesson } from '../fe-ee-course-data';

export const FE_EE_POWER_SYSTEMS: Record<string, TopicLesson> = {
  fee_3phase_power: {
  topicId: 'fee_3phase_power',
  title: 'Three-Phase Power Systems',
  domainWeight: 'Power Systems · 4–6%',
  overview: 'Three-phase AC power is the backbone of industrial and utility-scale electrical systems. Understanding balanced/unbalanced configurations, Y-delta conversions, and three-phase power calculations is essential for the FE exam and professional practice.',
  sections: [
    {
      id: '3ph-fundamentals',
      title: '1. Three-Phase Sources and Balanced Configurations',
      content: `## 1.1 Why Three-Phase?

Three-phase systems deliver **constant instantaneous power** (no pulsation), use conductors more efficiently than single-phase, and produce rotating magnetic fields that drive motors directly.

Three voltage sources separated by **$120^\\circ$**:

- **$Va = V\\cdot \\cos (\\omega t)$**
- **$Vb = V\\cdot \\cos (\\omega t - 120^\\circ)$**
- **$Vc = V\\cdot \\cos (\\omega t - 240^\\circ)$**

In complex (phasor) notation using the **a-operator** where **$a = e^{j120^\\circ} = -\\tfrac{1}{2} + j\\sqrt{3}/2$**:

| Phasor | Value |
|---|---|
| Va | $V\\angle 0^\\circ$ |
| Vb | $V\\angle -120^\\circ = a^{2}\\cdot Va$ |
| Vc | $V\\angle -240^\\circ = a\\cdot Va$ |

For **balanced** loads: **$Va + Vb + Vc = 0$** and **$Ia + Ib + Ic = 0$**.

## 1.2 Wye (Y) vs. Delta (Δ) Connections

| Property | Wye (Y) | Delta (Δ) |
|---|---|---|
| Line-to-line voltage | **$V_{LL} = \\sqrt{3} \\cdot V_{ph}$** | **$V_{LL} = V_{ph}$** |
| Line current | **$I_L = I_{ph}$** | **$I_L = \\sqrt{3} \\cdot I_{ph}$** |
| Neutral wire | Present (carries unbalanced current) | No neutral |
| Typical use | Distribution, generators | Motors, capacitor banks |

### Y ↔ Δ Impedance Conversion

- **$Z_\\Delta = 3\\cdot Z_Y$** (balanced loads)
- **$Z_Y = Z_\\Delta / 3$**`,
      examTip: 'The √3 factor is the single most tested relationship: in a Y-connection it multiplies VOLTAGE (V_LL = √3·V_ph), while in a Δ-connection it multiplies CURRENT (I_L = √3·I_ph). If you mix these up, every downstream calculation is wrong.',
      importantNote: 'The a-operator a = e^(j120°) satisfies 1 + a + a² = 0. This identity is the mathematical reason Va + Vb + Vc = 0 for a balanced set, and it is used repeatedly in symmetrical component analysis.',
    },
    {
      id: '3ph-power-calcs',
      title: '2. Three-Phase Power and Per-Phase Analysis',
      content: `## 2.1 Three-Phase Power Formulas

| Quantity | Formula | Unit |
|---|---|---|
| Real power | **$P = \\sqrt{3} \\cdot V_{LL} \\cdot I_L \\cdot \\cos (\\phi)$** | W |
| Reactive power | **$Q = \\sqrt{3} \\cdot V_{LL} \\cdot I_L \\cdot \\sin (\\phi)$** | VAR |
| Apparent power | **$S = \\sqrt{3} \\cdot V_{LL} \\cdot I_L$** | VA |
| Complex power | **$S = P + jQ$** | VA |

All formulas use **line** quantities (V_LL and I_L) — no need to know whether the load is Y or Δ.

### Power per phase:
- **$P_{phase} = V_{ph} \\cdot I_{ph} \\cdot \\cos (\\phi)$** → total **$P = 3\\cdot P_{phase}$**

## 2.2 Per-Phase Analysis

For **balanced** systems, analyze one phase as a single-phase circuit:

1. Convert Δ-loads to equivalent Y: **$Z_Y = Z_\\Delta /3$**
2. Solve the single-phase equivalent (line-to-neutral voltage, phase current)
3. Multiply power by 3 for total three-phase power
4. Line quantities: **$V_{LL} = \\sqrt{3}\\cdot V_{ph}$**, **$I_L = I_{ph}$** (Y connection)

## 2.3 Symmetrical Components (Unbalanced Analysis)

Unbalanced currents or voltages decompose into three **sequence** sets:

- **Positive sequence** ($V_{1}$): balanced, normal rotation (abc)
- **Negative sequence** ($V_{2}$): balanced, reverse rotation (acb)
- **Zero sequence** ($V_{0}$): all three phasors equal (in-phase)

**Transformation**: $V_{0}$ = ⅓(Va + Vb + Vc); $V_{1}$ = ⅓(Va + a·Vb + a²·Vc); $V_{2}$ = ⅓(Va + a²·Vb + a·Vc)`,
      examTip: 'On the FE exam, three-phase power problems almost always give line voltage and line current. Plug directly into P = √3·V_LL·I_L·cos(φ). If they give phase quantities, first convert to line quantities using the Y or Δ relationship.',
    },
    {
      id: '3ph-calculation-shortcuts',
      title: '3. Three-Phase Calculation Shortcuts',
      content: `## 3.1 Quick Conversion Reference

**Y ↔ Δ Impedance Conversion (Balanced):**
- **$Z_\\Delta = 3 \\cdot Z_Y$** (Delta impedance is 3× the Wye impedance)
- **$Z_Y = Z_\\Delta / 3$**

**Line ↔ Phase Conversions:**

| Connection | Voltage Relationship | Current Relationship |
|---|---|---|
| **Wye (Y)** | $V_{LL} = \\sqrt{3} \\cdot V_{ph}$ | $I_L = I_{ph}$ |
| **Delta (Δ)** | $V_{LL} = V_{ph}$ | $I_L = \\sqrt{3} \\cdot I_{ph}$ |

**Memory trick**: The √3 factor always multiplies the LARGER quantity — in Y, line voltage is larger; in Δ, line current is larger.

## 3.2 Worked Example: Balanced Y Load

**Problem**: A balanced three-phase Y-connected load has impedance Z_Y = 10 + j5 Ω per phase. The line-to-line voltage is V_LL = 480 V. Find all currents and powers.

**Step 1 — Phase voltage:**

$$V_{ph} = V_{LL} / \\sqrt{3} = 480 / 1.732 = 277.1\\ \\mathrm{V}$$

**Step 2 — Phase current (= line current for Y):**

|Z_Y| = √(10² + 5²) = √125 = **$11.18\\ \\Omega$**

$$I_{ph} = V_{ph} / |Z_Y| = 277.1 / 11.18 = 24.79\\ \\mathrm{A}$$

**$I_L = I_{ph} = 24.79\\ \\mathrm{A}$** (Y connection)

**Step 3 — Power factor angle:**

$$\\phi = \\arctan (X/R) = \\arctan (5/10) = 26.57^\\circ$$

cos(φ) = cos(26.57°) = **0.894 lagging** (inductive load)

**Step 4 — Three-phase power:**

| Power | Formula | Result |
|---|---|---|
| **Real power P** | $\\sqrt{3} \\cdot V_{LL} \\cdot I_L \\cdot \\cos (\\phi)$ | $\\sqrt{3} \\times 480 \\times 24.79 \\times 0.894 = 18,432\\ \\mathrm{W} \\approx 18.4\\ \\mathrm{kW}$ |
| **Reactive power Q** | $\\sqrt{3} \\cdot V_{LL} \\cdot I_L \\cdot \\sin (\\phi)$ | $\\sqrt{3} \\times 480 \\times 24.79 \\times 0.447 = 9,216\\ \\mathrm{VAR} \\approx 9.22\\ \\mathrm{kVAR}$ |
| **Apparent power S** | $\\sqrt{3} \\cdot V_{LL} \\cdot I_L$ | $\\sqrt{3} \\times 480 \\times 24.79 = 20,608 VA \\approx 20.6\\ \\mathrm{kVA}$ |

**Verification**: S² = P² + Q² → 20,608² ≈ 18,432² + 9,216² → 424.5M ≈ 339.7M + 84.9M ≈ 424.6M. Confirmed.

## 3.3 Equivalent Delta Load

If the same load were Δ-connected: Z_Δ = 3 × Z_Y = 30 + j15 Ω

- V_ph(Δ) = V_LL = 480 V (phase voltage equals line voltage in Δ)
- I_ph(Δ) = 480 / |30+j15| = 480 / 33.54 = 14.31 A
- I_L = √3 × 14.31 = **24.79 A** (same line current as Y — proves equivalence)
- Total power: **identical** to the Y case (18.4 kW)

**Key insight**: A balanced Δ load with Z_Δ = 3·Z_Y draws exactly the same line current and power as the equivalent Y load. The per-phase analysis gives identical results regardless of which connection is used.

## 3.4 Common Exam Traps

- **Mixing line and phase quantities**: Always identify whether given values are line or phase before plugging into formulas
- **Forgetting √3 in power formula**: P = √3·V_LL·I_L·cos(φ), NOT 3·V_LL·I_L·cos(φ). The factor 3 appears only when using phase quantities: P = 3·V_ph·I_ph·cos(φ)
- **Voltage given as line-to-neutral vs. line-to-line**: "480 V three-phase" means V_LL = 480 V; "277 V phase" means V_ph = 277 V`,
      examTip: 'When the FE exam says "480 V three-phase system," this ALWAYS means V_LL = 480 V (line-to-line). The phase voltage is V_ph = 480/√3 = 277 V. If you use 480 V as the phase voltage, every answer will be wrong by a factor of √3.',
      importantNote: 'For balanced loads, you can convert freely between Y and Δ representations using Z_Δ = 3·Z_Y. The total power drawn from the source is identical in both cases. The FE exam often gives a Δ-connected load and expects you to convert to Y for per-phase analysis.',
    },
    {
      id: '3ph-instantaneous-power',
      title: '4. Constant Instantaneous Power and the Two-Wattmeter Method',
      content: `## 4.1 What a single phase actually delivers

Section 1 claimed that three-phase power is constant in time. That claim is
worth proving, because the proof explains why every large motor, every arc
furnace and every rectifier front end in industry is three-phase rather than
single-phase.

Take one phase alone. With **$v(t) = \\sqrt{2}\\,V\\cos (\\omega t)$** and
**$i(t) = \\sqrt{2}\\,I\\cos (\\omega t - \\phi )$**, the instantaneous power is the
product, and the product-to-sum identity splits it cleanly:

$$p(t) = 2VI\\cos (\\omega t)\\cos (\\omega t - \\phi ) = VI\\cos \\phi + VI\\cos (2\\omega t - \\phi )$$

Two terms, and they mean different things. The first is a constant equal to
the average power. The second oscillates at **twice** the supply frequency
with amplitude VI — larger than the average whenever the power factor is below
unity, which means the instantaneous power goes **negative** for part of every
cycle. Energy sloshes back toward the source and then returns.

Put the Section 3 load into that expression. There V_ph = 277.1 V,
I = 24.79 A and φ = 26.57°, so VI = 6.87 kVA and cos φ = 0.894:

| Quantity | Expression | Value |
|---|---|---|
| Average power per phase | $VI\\cos \\phi$ | 6.14 kW |
| Pulsation amplitude | $VI$ | 6.87 kW |
| Peak instantaneous | $VI(1 + \\cos \\phi )$ | 13.01 kW |
| Minimum instantaneous | $VI(\\cos \\phi - 1)$ | −0.73 kW |
| Pulsation frequency | $2f$ | 120 Hz |

A single-phase machine fed this way would be shaken at 120 Hz by a torque that
swings from twice its average down through zero and slightly backwards.

## 4.2 Three of them, and the pulsation vanishes

Now add the other two phases, each identical but shifted by 120°. The constant
terms simply add, giving **$3VI\\cos \\phi$**. The double-frequency terms are
shifted by 240° from each other, because a 120° shift in ω t becomes a 240°
shift in 2ω t — and three equal phasors spaced 120° apart in the doubled angle
sum to zero. The pulsation cancels identically:

$$p_{a}(t) + p_{b}(t) + p_{c}(t) = 3VI\\cos \\phi \\quad \\text{for all } t$$

![Instantaneous power of each phase of the worked 480 V load and their sum, over two 60 Hz cycles. Each phase trace pulses at 120 Hz between 13.0 kW and −0.73 kW, and the three pulsations are spaced 240 degrees apart in the doubled angle, so the heavy total trace is a perfectly flat 18.4 kW line.](/courses/fe-ee/figures/pow-3ph-instantaneous.svg)

The figure is drawn straight from the two sinusoids above, with no smoothing:
the flat total is the arithmetic sum of the three pulsing curves at every
sample. Two features repay a second look. Each phase dips **below zero** near
its own current zero crossing, which is the reactive energy being handed back;
and the total never notices, because at that instant the other two phases are
above their averages by exactly the deficit. Constant power means constant
shaft torque, which means no 120 Hz vibration, no torque-ripple fatigue, and
no need for the oversized flywheel a single-phase machine of the same rating
would require.

## 4.3 Measuring three-phase power with two wattmeters

Blondel's theorem says an N-wire circuit needs N − 1 wattmeters. A three-wire
three-phase circuit therefore needs **two**, not three, whether or not the load
is balanced and whether it is wye or delta. Put the current coils in lines a
and c and reference both voltage coils to line b. For a balanced load the two
readings are

$$W_{1} = V_{LL}I_{L}\\cos (\\phi - 30^\\circ ), \\qquad W_{2} = V_{LL}I_{L}\\cos (\\phi + 30^\\circ )$$

For the worked load, with V_LL = 480 V, I_L = 24.79 A and φ = 26.57°:

- **$W_{1} = 480 \\times 24.79 \\times \\cos (-3.43^\\circ ) = 11{,}876\\ \\mathrm{W}$**
- **$W_{2} = 480 \\times 24.79 \\times \\cos (56.57^\\circ ) = 6{,}556\\ \\mathrm{W}$**
- Sum = **18,432 W**, exactly the P computed in Section 3.

The difference carries the reactive information. Expanding both cosines gives
**$W_{1} - W_{2} = V_{LL}I_{L}\\sin \\phi$**, so

$$\\tan \\phi = \\sqrt{3}\\,\\frac{W_{1} - W_{2}}{W_{1} + W_{2}}$$

Here that is 1.732 × 5,320/18,432 = 0.500, and arctan(0.500) = 26.57° — the
load angle recovered from two meter readings with no phase-angle instrument
anywhere. Three-phase reactive power follows as
**$Q = \\sqrt{3}(W_{1} - W_{2})$** = 1.732 × 5,320 = 9,214 VAR, matching the
9.22 kVAR of Section 3 to rounding.

| Load power factor | φ | Reading behaviour |
|---|---|---|
| Unity | 0° | Both meters read equally |
| 0.866 lagging | 30° | W₂ reads zero |
| Below 0.5 lagging | > 60° | **W₂ reads negative** — reverse its coil and subtract |
| 0.5 lagging exactly | 60° | W₂ = 0 again on the other side of the transition |

That negative reading is the classic trap. A technician who reverses the leads
to get an upscale deflection and then **adds** the two numbers reports far too
much power. Below 0.5 power factor the total is the *difference*.`,
      examTip: 'Two facts earn nearly all the two-wattmeter credit: the sum of the readings is always the total three-phase real power, and tan(φ) = √3(W₁ − W₂)/(W₁ + W₂) recovers the power factor. If one meter reads negative, the power factor is below 0.5 and you must subtract that reading, not add it.',
      importantNote: 'The cancellation of the 120 Hz pulsation is exact only for a BALANCED load. Any unbalance leaves a residual double-frequency component in the total power, which appears as torque ripple in machines and is one reason large drives are sensitive to supply unbalance.',
    },
    {
      id: '3ph-unbalanced',
      title: '5. Unbalanced Loads, Neutral Current, and Sequence Components',
      content: `## 5.1 When per-phase analysis stops working

Per-phase analysis rests on a symmetry argument: if all three phases are
identical, solving one of them solves all three. Break the symmetry and that
shortcut is gone. Each phase must be solved on its own, and the neutral — which
carries nothing in a balanced system — starts carrying current.

**Worked case.** A four-wire wye supply with 277.1 V line-to-neutral feeds
three *resistive* loads on the same bus: Z_a = 10 Ω, Z_b = 20 Ω, Z_c = 25 Ω.
The neutral is solidly connected, so each phase sees its full line-to-neutral
voltage regardless of what the others do. Ohm's law, phase by phase:

| Phase | Impedance | Current magnitude | Current angle |
|---|---|---|---|
| a | 10 Ω | 27.71 A | 0° |
| b | 20 Ω | 13.86 A | −120° |
| c | 25 Ω | 11.08 A | +120° |

Adding the three phasors gives the **neutral current**:

$$I_{n} = I_{a} + I_{b} + I_{c} = 15.43\\angle -8.95^\\circ \\ \\mathrm{A}$$

Note the size of it. The neutral carries 15.4 A — more than either of the two
lighter phases — even though nothing is connected to it. This is why the
neutral of a four-wire feeder is sized as a current-carrying conductor, and
why opening it while the phases are energised is dangerous: with the neutral
gone, the load impedances form a series string across the line voltages, the
lightly loaded phases float up toward line-to-line potential, and equipment on
them is destroyed.

Total real power is the sum of three separate I²R terms, not a single
√3 formula:

$$P = I_{a}^{2}Z_{a} + I_{b}^{2}Z_{b} + I_{c}^{2}Z_{c} = 7{,}678.4 + 3{,}839.2 + 3{,}071.4 = 14{,}589\\ \\mathrm{W}$$

Applying **$P = \\sqrt{3}V_{LL}I_{L}\\cos \\phi$** here would be meaningless: there
is no single I_L and no single φ.

## 5.2 Reading the same case in sequence components

Section 2 introduced the transformation. Apply it to these three currents,
with a = 1∠120°:

- **$I_{0} = \\tfrac{1}{3}(I_{a} + I_{b} + I_{c}) = 5.14\\angle -8.95^\\circ$** A
- **$I_{1} = \\tfrac{1}{3}(I_{a} + aI_{b} + a^{2}I_{c}) = 17.55\\angle 0^\\circ$** A
- **$I_{2} = \\tfrac{1}{3}(I_{a} + a^{2}I_{b} + aI_{c}) = 5.14\\angle +8.95^\\circ$** A

Three numbers now say what three phasors said, but they say it in a language
that maps onto physical damage:

| Component | Magnitude | What it does |
|---|---|---|
| Positive, I₁ | 17.55 A | Normal useful current; produces forward torque in machines |
| Negative, I₂ | 5.14 A | Reverse-rotating field; induces double-frequency rotor currents and heats machines |
| Zero, I₀ | 5.14 A | Flows in phase in all three lines; returns through the neutral or ground |

Two checks confirm the arithmetic. First, **$I_{n} = 3I_{0}$**: three times
5.14 A is 15.43 A at −8.95°, exactly the neutral current computed directly.
That identity is the whole reason a residual-current or ground-fault relay
works — connect three current transformers in parallel and the relay sees
3I₀ and nothing else. Second, recombining gives back
$I_{0} + I_{1} + I_{2} = 27.71\\angle 0^\\circ$ A, which is I_a.

The **current unbalance factor** is the ratio that machine standards are
written against:

$$\\frac{|I_{2}|}{|I_{1}|} = \\frac{5.14}{17.55} = 0.293 = 29.3\\%$$

Nearly thirty percent negative-sequence content, from load resistances that
differ by no more than a factor of 2.5. Motors are typically limited to a few
percent continuous negative-sequence current, because the reverse field slips
past the rotor at almost twice synchronous speed and the resulting
double-frequency rotor currents heat the rotor bars fast.

## 5.3 The delta case, and why it behaves differently

Repeat the exercise with the same three impedances connected in delta and
there is no neutral to carry anything, so **$I_{0} = 0$** by construction: the
three line currents must sum to zero because there is nowhere else for charge
to go. The unbalance does not disappear — it reappears entirely as
negative-sequence current, and the three line currents become unequal in a
different pattern.

This is a general and heavily tested rule. **Zero-sequence current requires a
return path.** A delta winding, or an ungrounded wye, offers none, so zero
sequence cannot flow into it from the line side. A grounded wye offers one. The
same rule decides how transformer connections behave in the fault analysis of
the next topic: a delta-wye transformer with the wye solidly grounded is a
*source* of zero-sequence current for downstream ground faults, while blocking
zero sequence from passing through to the delta side.

## 5.4 How the exam frames unbalance

Questions rarely ask for the full decomposition under time pressure. They ask
for one of these:

1. **The neutral current of a specified unbalanced wye** — add the three phasors, or find 3I₀.
2. **Which sequence exists** — a balanced set has only positive sequence; any set summing to zero has no zero sequence; a set of three equal in-phase phasors is pure zero sequence.
3. **What negative sequence does** — heats rotors, and is the reason single-phasing wrecks motors.
4. **Whether zero sequence can flow** — check for a neutral or ground return.

Reach for the a-operator only when the question genuinely needs the
components. If it only needs I_n, phasor addition is faster and less
error-prone.`,
      examTip: 'For an unbalanced four-wire wye, the neutral current is just the phasor sum of the three line currents — and it equals 3I₀. Do not use P = √3·V_LL·I_L·cos(φ) on an unbalanced load; sum the per-phase powers instead. Both substitutions are common exam traps.',
      importantNote: 'A balanced three-phase set has ONLY positive-sequence content: I₁ equals the phase current and I₂ = I₀ = 0. Any nonzero I₂ or I₀ in an answer for a stated balanced load is an arithmetic error, which makes this the fastest sanity check available on symmetrical-component problems.',
    },
  ],
  keyTakeaways: [
    'Y connection: V_LL = √3·V_ph, I_L = I_ph; Delta: V_LL = V_ph, I_L = √3·I_ph.',
    'Three-phase power: P = √3·V_LL·I_L·cos(φ) using line quantities regardless of Y or Δ.',
    'Balanced systems: Va + Vb + Vc = 0; per-phase analysis reduces to single-phase equivalent.',
    'Y ↔ Δ conversion: Z_Δ = 3·Z_Y for balanced impedances.',
    'Symmetrical components decompose unbalanced conditions into zero, positive, and negative sequences.',
  ],
},

  fee_transformers: {
  topicId: 'fee_transformers',
  title: 'Transformers: Equivalent Circuit & Efficiency',
  domainWeight: 'Power Systems · 4–6%',
  overview: 'Transformers are the workhorses of power systems, stepping voltage up for efficient long-distance transmission and down for safe distribution. The FE exam tests ideal transformer ratios, equivalent circuit models, voltage regulation, and efficiency calculations.',
  sections: [
    {
      id: 'xfmr-ideal-real',
      title: '1. Ideal vs. Real Transformer Models',
      content: `## 1.1 Ideal Transformer

An ideal transformer has **perfect coupling, zero losses, and infinite permeability**:

| Relationship | Formula |
|---|---|
| Voltage ratio | **Vs/Vp = Ns/Np = n** (turns ratio) |
| Current ratio | **Ip/Is = n** (currents are inverse) |
| Power conservation | $Pp = Ps \\to Vp\\cdot Ip = Vs\\cdot Is$ |
| Impedance reflection | **$Z_{primary} = Z_{load} / n^{2}$** |

## 1.2 Real Transformer Equivalent Circuit

Real transformers have losses modeled by additional circuit elements:

- **R_c** (core-loss resistance): models hysteresis + eddy-current losses (parallel branch)
- **X_m** (magnetizing reactance): models finite permeability (parallel branch)
- **R_1, R_2** (winding resistance): copper losses in primary/secondary
- **X_1, X_2** (leakage reactance): flux that does not link both windings

### Losses Summary

| Loss Type | Cause | Depends On | Test |
|---|---|---|---|
| Core loss | Hysteresis + eddy currents | Voltage (constant at rated V) | Open-circuit test |
| Copper loss | I²R in windings | Current (load-dependent) | Short-circuit test |

## 1.3 Standard Tests

- **Open-circuit test** (secondary open): measures core losses P_oc and magnetizing branch (R_c, X_m)
- **Short-circuit test** (secondary shorted, reduced voltage): measures copper losses P_sc and leakage impedance (R_eq, X_eq)`,
      examTip: 'The open-circuit test gives core losses and the short-circuit test gives copper losses. This is the most commonly tested transformer lab concept. Remember: OC = core (no load current, rated voltage), SC = copper (rated current, reduced voltage).',
      importantNote: 'Impedance reflects through the turns ratio SQUARED: Z_primary = Z_load/n². A common FE exam mistake is using n instead of n². If n = 10 and Z_load = 5 ohm, the reflected impedance is 5/100 = 0.05 ohm, not 0.5 ohm.',
    },
    {
      id: 'xfmr-regulation-efficiency',
      title: '2. Voltage Regulation and Efficiency',
      content: `## 2.1 Voltage Regulation

**VR = (V_no-load − V_full-load) / V_full-load × 100%**

- Low VR (< 5%) is desirable — output voltage stays nearly constant under load
- Lagging power factor increases VR (inductive loads cause bigger voltage drop)
- Leading power factor can produce negative VR (voltage rises under load)

### Approximate Voltage Drop

**$\\Delta V \\approx I\\cdot (R_{eq}\\cdot \\cos (\\phi) + X_{eq}\\cdot \\sin (\\phi))$**

where R_eq and X_eq are equivalent series impedance referred to one side.

## 2.2 Efficiency

**$\\eta = P_{out} / (P_{out} + P_{core} + P_{copper}) \\times 100\\%$**

Equivalently: **$\\eta = P_{out} / P_{in} \\times 100\\%$**

| Load Condition | Core Loss | Copper Loss | Efficiency |
|---|---|---|---|
| No load | Full (rated) | Zero | Very low |
| Light load | Full | Small | Moderate |
| **Rated load** | Full | **Full** | **Maximum (~95–99%)** |
| Overload | Full | Increases as I² | Decreasing |

**Maximum efficiency** occurs when **$P_{core} = P_{copper}$** (core loss equals copper loss).

### Per-Unit Impedance Shortcut

**$Z_{pu} = Z_{actual} / Z_{base}$** where **$Z_{base} = V_{base}^{2} / S_{base}$**

Per-unit impedance is the same on both sides of the transformer — no need to reflect through n².`,
      examTip: 'Maximum transformer efficiency occurs when core loss equals copper loss. This is a classic FE exam question. At rated load, typical transformer efficiency is 95-99%. If you are asked "at what load is efficiency maximum," set P_core = P_copper and solve for load fraction.',
    },
    {
      id: 'xfmr-problem-checklist',
      title: '3. Transformer Problem-Solving Checklist',
      content: `## 3.1 Step-by-Step for Any Transformer Problem

Follow this checklist for every transformer problem on the FE exam:

1. **Identify the turns ratio**: n = Ns/Np = Vs/Vp (from nameplate or given data)
2. **Reflect impedances to one side**: Z_reflected = Z_load × (Np/Ns)² = Z_load/n²
3. **Find equivalent circuit parameters** (from test data if given)
4. **Calculate voltage regulation**: VR = (V_nl − V_fl)/V_fl × 100%
5. **Calculate efficiency**: η = Pout/(Pout + Pcore + Pcopper) × 100%

## 3.2 Worked Example: Using OC and SC Test Data

**Given**: 10 kVA, 2400/240 V transformer (n = 240/2400 = 0.1 or 1:10)

**Open-circuit test** (on low-voltage side): Voc = 240 V, Ioc = 1.2 A, Poc = 60 W

**Short-circuit test** (on high-voltage side): Vsc = 48 V, Isc = 4.17 A, Psc = 120 W

**Step 1 — Core loss parameters (from OC test):**

- Core loss: **Pcore = 60 W** (constant at rated voltage)
- Apparent power: Soc = 240 × 1.2 = 288 VA
- Core loss resistance: Rc = V²/Poc = 240²/60 = **$960\\ \\Omega$** (referred to LV side)
- Magnetizing reactance: Xm = V²/Qoc where Qoc = √(S² − P²) = √(288² − 60²) = 281.7 → Xm = 240²/281.7 = **$204.5\\ \\Omega$**

**Step 2 — Copper loss parameters (from SC test):**

- Copper loss at rated current: **Pcopper = 120 W**
- Equivalent impedance (referred to HV side): Zeq = Vsc/Isc = 48/4.17 = **$11.51\\ \\Omega$**
- Equivalent resistance: Req = Psc/Isc² = 120/4.17² = **$6.90\\ \\Omega$**
- Equivalent reactance: Xeq = √(Zeq² − Req²) = √(11.51² − 6.90²) = **$9.21\\ \\Omega$**

**Step 3 — Voltage regulation at full load, 0.8 PF lagging:**

VR ≈ (Irated × (Req·cos(φ) + Xeq·sin(φ))) / Vrated × 100%

Irated(HV) = 10,000/2400 = 4.17 A; cos(φ) = 0.8, sin(φ) = 0.6

$$\\Delta V = 4.17 \\times (6.90 \\times 0.8 + 9.21 \\times 0.6) = 4.17 \\times (5.52 + 5.53) = 4.17 \\times 11.05 = 46.1\\ \\mathrm{V}$$

**$VR = 46.1/2400 \\times 100\\% = 1.92\\%$** (excellent regulation)

**Step 4 — Efficiency at full load, 0.8 PF:**

Pout = S × PF = 10,000 × 0.8 = 8,000 W

$$\\eta = 8,000 / (8,000 + 60 + 120) \\times 100\\% = 8,000/8,180 = 97.8\\%$$

**Step 5 — Load for maximum efficiency:**

Max efficiency when Pcore = Pcopper → Pcopper = Psc × (load fraction)²

60 = 120 × x² → x = √(60/120) = √0.5 = **0.707 = 70.7% of full load**

## 3.3 Common Mistakes and Exam Traps

- **Impedance reflection direction**: When reflecting from secondary to primary, multiply by (Np/Ns)². When reflecting primary to secondary, multiply by (Ns/Np)². Getting the direction wrong flips the ratio.
- **Test side matters**: OC test is done on the low-voltage side (measures core parameters on that side). SC test is done on the high-voltage side (measures leakage impedance on that side). Parameters must be reflected to the same side before combining.
- **Regulation sign**: Negative VR means the voltage RISES under load (leading PF with capacitive loads). This is physically real and not an error.
- **Efficiency vs. load**: η is NOT maximum at full load. Maximum η occurs when Pcore = Pcopper, which is typically 50–80% of rated load.`,
      examTip: 'On the FE exam, the OC/SC test interpretation is frequently tested. Remember: OC test → core losses and magnetizing branch; SC test → copper losses and leakage impedance. The OC test gives constant losses (voltage-dependent), and the SC test gives variable losses (current-dependent).',
      importantNote: 'Maximum transformer efficiency does NOT occur at full load — it occurs when core loss equals copper loss. Since core loss is constant and copper loss varies as I², the maximum efficiency point is at a specific load fraction x = √(Pcore/Pcopper_rated). This is one of the most commonly tested transformer concepts.',
    },
    {
      id: 'xfmr-efficiency-curve',
      title: '4. Reading the Efficiency Curve and All-Day Efficiency',
      content: `## 4.1 One expression, drawn

Section 3 found the maximum-efficiency load fraction for the 10 kVA unit by
setting the two losses equal. That is the answer to one question; the curve
behind it answers several more at a glance. Write efficiency as a function of
load fraction x, where x = 1 means rated kVA:

$$\\eta (x) = \\frac{xS_{rated}\\,\\mathrm{pf}}{xS_{rated}\\,\\mathrm{pf} + P_{core} + x^{2}P_{cu,FL}}$$

Everything in it is already known for our transformer: S_rated = 10 kVA,
P_core = 60 W from the open-circuit test, and P_cu,FL = 120 W from the
short-circuit test. Differentiating with respect to x and setting the result
to zero kills the pf term entirely and leaves

$$P_{core} = x^{2}P_{cu,FL} \\;\\Longrightarrow\\; x^{*} = \\sqrt{P_{core}/P_{cu,FL}} = \\sqrt{60/120} = 0.707$$

![Transformer efficiency against load fraction for the worked 10 kVA unit, plotted from the exact efficiency expression at power factors 1.0 and 0.8. Both curves peak at load fraction 0.707, where the load-dependent copper loss has grown to equal the fixed 60 W core loss, and both are remarkably flat from about half load to well past rated load.](/courses/fe-ee/figures/pow-xfmr-efficiency.svg)

The figure makes the power-factor independence visible: the two curves sit at
different heights but their peaks land on the *same* vertical line. That is the
single most useful thing to carry into the exam, because it means a question
can give you a power factor and it will not change where the maximum is.

The second visible feature is how **flat** the curve is. From half load to
125 percent of rating, efficiency at unity power factor moves only between
98.23 and 98.06 percent — under two tenths of a point across a 2.5-to-1 range
of loading. Transformers are forgiving of load level in a way that motors are
not, and that is why a distribution transformer sized generously for future
growth is not the energy sin it might appear.

| Load fraction x | Copper loss | η at pf = 1.0 | η at pf = 0.8 |
|---|---|---|---|
| 0.25 | 7.5 W | 97.37% | 96.74% |
| 0.50 | 30.0 W | 98.23% | 97.80% |
| **0.707** | **60.0 W** | **98.33%** | **97.92%** |
| 1.00 | 120.0 W | 98.23% | 97.80% |
| 1.25 | 187.5 W | 98.06% | 97.58% |

Read the 0.50 and 1.00 rows together: identical efficiency at half load and
full load. That is not coincidence. Efficiency is symmetric about x\\* in the
sense that the total loss P_core + x²P_cu is equal at any two load fractions
whose product is x\\*², and 0.5 × 1.0 = 0.5 = 0.707².

## 4.2 All-day efficiency, the number a utility actually buys

A distribution transformer is energised twenty-four hours a day but loaded
heavily for only a few of them. Core loss runs the whole time; copper loss runs
only when current flows. The figure of merit is therefore **all-day (energy)
efficiency**, computed from energies rather than powers:

$$\\eta _{all\\text{-}day} = \\frac{\\text{output energy over 24 h}}{\\text{output energy} + \\text{core energy} + \\text{copper energy}}$$

**Worked example.** Put the same 10 kVA unit on this daily duty cycle:

| Hours | Load fraction | Power factor | Output energy | Copper energy |
|---|---|---|---|---|
| 6 | 0.25 | 1.0 | 15.0 kWh | 0.045 kWh |
| 8 | 0.50 | 0.9 | 36.0 kWh | 0.240 kWh |
| 6 | 1.00 | 0.8 | 48.0 kWh | 0.720 kWh |
| 4 | 0 (energised) | — | 0 | 0 |
| **Totals** | | | **99.0 kWh** | **1.005 kWh** |

Core loss is 60 W for all 24 hours: 60 × 24 = **1.44 kWh**. Then

$$\\eta _{all\\text{-}day} = \\frac{99.0}{99.0 + 1.005 + 1.44} = \\frac{99.0}{101.445} = 97.59\\%$$

Compare that with the 98.23 percent this unit reaches at rated unity-power-factor
load. Roughly six tenths of a point has been lost, and the reason is visible in
the two energy figures: **core loss consumed 1.44 kWh while copper loss consumed
only 1.005 kWh**, even though copper loss is twice core loss at full load. A
transformer that idles most of the day should be specified with low core loss,
which in practice means better core steel or an amorphous-metal core, and it is
why the maximum-efficiency design point for distribution units is deliberately
placed well below rated load.

## 4.3 What the two tests do and do not give you

| | Open-circuit test | Short-circuit test |
|---|---|---|
| Applied to | Low-voltage side (safer, lower current) | High-voltage side (safer, lower voltage) |
| Other winding | Open | Shorted |
| Applied voltage | Rated | A few percent of rated |
| Current drawn | Exciting current only, 2–6% of rated | Rated |
| Wattmeter reads | **Core loss** | **Copper loss at rated current** |
| Yields | R_c and X_m (shunt branch) | R_eq and X_eq (series branch) |

Two subtleties the exam likes. First, the small copper loss during the OC test
is neglected because the exciting current is a few percent of rated and its
I²R contribution is a few *thousandths* of full-load copper loss. Second, the
core loss during the SC test is neglected because the applied voltage is a few
percent of rated and core loss goes roughly as V². Each test is contaminated by
the other loss, but by a quantity too small to matter — which is exactly why
the pair of tests works.`,
      examTip: 'Maximum efficiency is at x* = √(P_core/P_cu,FL) and does not depend on power factor — the pf cancels when you differentiate. If a question gives you core loss, full-load copper loss, and a power factor, the power factor is only there to compute the OUTPUT power, never the location of the peak.',
      importantNote: 'All-day efficiency is always LOWER than peak efficiency, because core loss is charged for all 24 hours while output energy accrues only during loaded hours. When a question mentions a duty cycle or a daily load schedule, it is asking for energy efficiency, not the power efficiency at any single operating point.',
    },
    {
      id: 'xfmr-connections-auto',
      title: '5. Three-Phase Connections, Autotransformers, and Parallel Operation',
      content: `## 5.1 The four three-phase connections

Three single-phase transformers can be banked, or one three-legged core can
carry all six windings. Either way the primary and secondary can each be wye
or delta, giving four combinations with genuinely different behaviour.

| Connection | Voltage ratio (line) | Phase shift | Zero-sequence path | Typical use |
|---|---|---|---|---|
| Δ–Δ | $N_{p}/N_{s}$ | 0° | Blocked both sides | Industrial, open-delta capable |
| Y–Y | $N_{p}/N_{s}$ | 0° | Passes if both neutrals grounded | Rare alone; needs tertiary |
| Δ–Y | $\\sqrt{3}N_{p}/N_{s}$ | 30° | Grounded wye is a zero-sequence source | Generator step-up |
| Y–Δ | $N_{p}/(\\sqrt{3}N_{s})$ | 30° | Delta traps zero sequence | Transmission step-down |

The **√3 in the line ratio** of the mixed connections is the piece most often
dropped. A Δ–Y bank built from 2400/240 V single-phase units has a *turns*
ratio of 10, but its line-to-line ratio is 2400 to 240√3 = 2400 to 415.7, or
5.77 to 1. Ask which ratio a question wants before dividing.

The **30° phase shift** of the mixed connections matters for paralleling: two
banks with different connections cannot be paralleled, because a 30°
displacement across the tie appears as a large circulating voltage. Standard
practice puts the high-voltage side leading.

The **delta winding's role as a zero-sequence trap** is the reason a Y–Y bank
is usually given a delta tertiary. Without a delta somewhere, third-harmonic
magnetising currents — which are in phase in all three legs, hence zero
sequence — have nowhere to circulate, and they distort the phase voltages
instead.

## 5.2 The autotransformer, and where its rating comes from

Connect the two windings of a two-winding transformer in series instead of
isolating them and you get an **autotransformer**: one continuous winding with
a tap. It carries far more apparent power than its nameplate suggests, which is
worth deriving once rather than memorising.

**Worked example.** Reconnect the 10 kVA, 2400/240 V unit as a step-up
autotransformer: the 240 V winding in series with the 2400 V winding, output
taken across both.

- The 240 V winding is still rated for **10,000/240 = 41.67 A**. That is the current limit of the whole arrangement, because it is the series element.
- Output voltage is 2400 + 240 = **2640 V**, so throughput is 2640 × 41.67 = **110 kVA**.
- Input current is 110,000/2400 = **45.83 A**, and the common (2400 V) winding carries the difference, 45.83 − 41.67 = **4.17 A**, which at 2400 V is **10 kVA** — its own rating, respected.

An eleven-fold increase in rating from the same iron and copper. The multiplier
is not magic: it is exactly the voltage ratio of the connection,
2640/240 = 11. Only 10 kVA is transformed magnetically; the other 100 kVA is
**conducted** straight through the series winding, and conduction costs no core
material.

$$\\frac{S_{auto}}{S_{two\\text{-}winding}} = \\frac{V_{high}}{V_{high} - V_{low}}$$

The catch is the same connection that produces the gain. Primary and secondary
share a conductor, so there is **no galvanic isolation** — a fault or a
high-voltage transient on one side appears directly on the other. Ratios far
from 1:1 also make the gain small (at 10:1 the multiplier is only 1.11) while
keeping the safety penalty, so autotransformers are used where the ratio is
modest: 138/69 kV interties, motor-starting compensators, and laboratory
variable supplies.

## 5.3 Parallel operation and inrush

Two transformers share a load in inverse proportion to their per-unit
impedances, both taken on a common base:

$$\\frac{S_{1}}{S_{2}} = \\frac{Z_{pu,2}}{Z_{pu,1}}$$

Paralleling a 5 percent unit with a 7 percent unit of equal rating therefore
loads the first 1.4 times as hard as the second, and the first will reach its
thermal limit while the second still has margin. Matching per-unit impedance
matters more than matching nameplate kVA. The other requirements are identical
voltage ratios (a mismatch drives circulating current even at no load),
identical phase displacement, and — for three-phase banks — the same phase
sequence.

**Magnetising inrush** is the transient nobody expects from a device with no
moving parts. Energise a transformer at a voltage zero crossing and the flux,
which is the integral of voltage, swings to twice its normal peak; add
remanent flux from the previous de-energisation and the core saturates hard.
Magnetising current then briefly reaches **8 to 12 times rated current**,
decaying over several cycles as winding resistance damps it. Protection must
ride through it, which is why transformer differential relays are restrained by
second-harmonic content: inrush is rich in second harmonic, and internal faults
are not.`,
      examTip: 'For a Δ–Y or Y–Δ bank, the LINE voltage ratio is the turns ratio multiplied or divided by √3 — the winding ratio alone is not the answer. And for parallel operation, load divides inversely with per-unit impedance, so the lower-impedance unit always takes the larger share.',
      importantNote: 'An autotransformer transfers only part of its throughput magnetically; the rest is conducted through the shared winding. That is why its kVA rating exceeds the two-winding rating by the factor V_high/(V_high − V_low), and also why it provides no isolation between the two circuits.',
    },
  ],
  keyTakeaways: [
    'Ideal transformer: Vs/Vp = n, Is/Ip = 1/n, impedance reflects by n².',
    'Core loss (OC test) is voltage-dependent; copper loss (SC test) is current-dependent.',
    'Voltage regulation VR = (V_nl − V_fl)/V_fl × 100%; lagging PF makes VR worse.',
    'Maximum efficiency when P_core = P_copper; typical range 95–99%.',
    'Per-unit impedance Z_pu = Z_actual/Z_base eliminates turns-ratio conversions.',
  ],
},

  fee_per_unit: {
  topicId: 'fee_per_unit',
  title: 'Per-Unit System for Simplified Analysis',
  domainWeight: 'Power Systems · 4–6%',
  overview: 'The per-unit (pu) system normalizes all quantities to dimensionless ratios, eliminating turns-ratio conversions and making impedance values transferable across voltage zones. Mastering per-unit is essential for FE power systems problems.',
  sections: [
    {
      id: 'pu-base-values',
      title: '1. Base Values and Per-Unit Conversion',
      content: `## 1.1 Choosing Base Values

Select **two independent bases** — everything else follows:

1. Choose **S_base** (common choice: 100 MVA for utility, or equipment rating)
2. Choose **V_base** at one voltage zone

### Derived Bases

| Quantity | Formula | Note |
|---|---|---|
| **I_base** | $S_{base} / (\\sqrt{3} \\cdot V_{base})$ | Three-phase; use S_base / V_base for single-phase |
| **Z_base** | $V_{base}^{2} / S_{base}$ | Most important derived base |
| **P_base** | S_base | Same as S_base |

## 1.2 Converting to Per-Unit

- **$V_{pu} = V_{actual} / V_{base}$**
- **$I_{pu} = I_{actual} / I_{base}$**
- **$Z_{pu} = Z_{actual} / Z_{base}$**
- **$P_{pu} = P_{actual} / S_{base}$**

### Changing Base (Re-basing Equipment Data)

Equipment nameplate impedance is given on the equipment's own base. To convert to the system base:

**Z_pu(new) = Z_pu(old) × (S_base(new) / S_base(old)) × (V_base(old) / V_base(new))²**

## 1.3 Multi-Zone Systems

In a system with transformers:

- **S_base is the same throughout** the entire network
- **V_base changes at each transformer** according to the turns ratio
- **Z_pu stays the same** on both sides of an ideal transformer (n:1 disappears)`,
      examTip: 'The re-basing formula Z_pu(new) = Z_pu(old) × (S_new/S_old) × (V_old/V_new)² is tested frequently. If the exam gives generator impedance on its own MVA rating, you must re-base to the system base before combining impedances.',
      importantNote: 'S_base is constant everywhere in the network. V_base changes at each transformer winding according to the turns ratio. Forgetting to change V_base across a transformer is the most common per-unit mistake on the FE exam.',
    },
    {
      id: 'pu-advantages-workflow',
      title: '2. Advantages and Problem-Solving Workflow',
      content: `## 2.1 Why Per-Unit?

- **Transformers disappear**: ideal transformers become 1:1 (no turns-ratio math)
- **Error detection**: all normal per-unit values cluster near **1.0 pu** — a result of 15 pu is clearly wrong
- **Equipment comparison**: generator with Z = 0.15 pu means 15% impedance regardless of voltage rating
- **Simplified fault analysis**: fault currents computed directly without converting between voltage levels

## 2.2 Step-by-Step Workflow

1. **Choose S_base and V_base** at one zone (often the generator or largest transformer)
2. **Compute V_base** at every other zone via transformer turns ratios
3. **Compute Z_base = V_base²/S_base** at each zone
4. **Convert all impedances** to per-unit on the system base (re-base if needed)
5. **Draw the per-unit equivalent circuit** (transformers are short circuits)
6. **Solve** using standard circuit analysis (KVL, KCL, Ohm's law in per-unit)
7. **Convert results back** to actual values: V_actual = V_pu × V_base, etc.

## 2.3 Fault Current Example

For a three-phase fault at a bus:

**$I_{fault}(pu) = V_{prefault}(pu) / Z_{total}(pu)$**

Convert to actual: **$I_{fault} = I_{fault}(pu) \\times I_{base}$** where **$I_{base} = S_{base} / (\\sqrt{3} \\cdot V_{base})$**`,
      examTip: 'On multi-zone power system problems, draw the per-unit circuit first. All transformers become wires (1:1 ratio). Then solve using simple series/parallel impedance combinations. This avoids the messy turns-ratio algebra that causes errors under exam time pressure.',
    },
    {
      id: 'pu-worked',
      title: '3. Worked Examples',
      content: `## 3.1 Building a per-unit base

Choose S_base = 100 MVA and V_base = 138 kV on a transmission section.

$$Z_{base} = V_{base}^2/S_{base} = (138e3)^2/100e6 = 19.044e9/100e6 = 190.4 ohm$$
$$I_{base} = S_{base}/(\\sqrt{3} V_{base}) = 100e6/(1.732 x 138e3) = 418.4\\ \\mathrm{A}$$

A line of actual impedance 38 ohm is then Z_pu = 38/190.4 = **0.200 pu**.

## 3.2 Why per unit exists: transformers disappear

A transformer's per-unit impedance is the SAME referred to either side, so once everything is on a common base the turns ratios vanish from the calculation. That is the whole reason power engineers work this way - a network with six voltage levels becomes one flat circuit.

Per-unit values also cluster in narrow, recognisable bands, which makes an error visible: transformer impedances land near 0.05-0.10 pu, generator subtransient reactances near 0.15-0.25 pu. A per-unit impedance of 8 is a mistake, not a component.

## 3.3 Changing base

Equipment is rated on its own base; the system uses another. Convert with

**$Z_{new} = Z_{old} x (S_{new}/S_{old}) x (V_{old}/V_{new})^2$**

A 50 MVA transformer with 8% impedance on its own 13.8 kV base, moved to a 100 MVA, 13.8 kV system base:

$$Z_{new} = 0.08 x (100/50) x (13.8/13.8)^2 = 0.08 x 2 = 0.16 pu$$

The voltage ratio is 1 here, but note it is SQUARED when it is not - that exponent is the most common slip in base conversion.

## 3.4 Fault current straight from per unit

Per-unit makes symmetrical fault current almost trivial. A three-phase bolted fault at a bus with total 0.16 pu reactance behind it, on a 100 MVA / 13.8 kV base:

$$I_{fault}(pu) = 1.0/0.16 = 6.25 pu$$
$$I_{base} = 100e6/(1.732 x 13.8e3) = 4184\\ \\mathrm{A}$$
$$I_{fault} = 6.25 x 4184 = 26.2\\ \\mathrm{kA}$$

Equivalently the fault MVA is S_base/Z_pu = 100/0.16 = **625 MVA**, which is the number a switchgear rating is chosen against.`,
      examTip: 'Per-unit impedance is unchanged across a transformer, but per-unit CURRENT and VOLTAGE bases are not - they scale with the turns ratio. Fix S_base once for the whole system and let V_base follow the transformer ratios.',
      quiz: [
        {
          question: 'A system uses S_base = 100 MVA and V_base = 20 kV. What is Z_base?',
          options: ['4 ohm', '5 ohm', '0.25 ohm', '2000 ohm'],
          correctIndex: 0,
          explanation: 'Z_base = V_base^2/S_base = (20e3)^2/100e6 = 400e6/100e6 = 4 ohm. Note it is the SQUARE of the voltage over the apparent power; using V rather than V^2 gives 0.0002 and a nonsense result.',
        },
        {
          question: 'A generator rated 8% reactance on a 25 MVA base is placed on a 100 MVA system base at the same voltage. What is its per-unit reactance now?',
          options: ['0.32 pu', '0.02 pu', '0.08 pu', '0.16 pu'],
          correctIndex: 0,
          explanation: 'Z_new = Z_old x (S_new/S_old) = 0.08 x (100/25) = 0.32 pu. Moving to a LARGER MVA base makes the per-unit impedance larger. Dividing instead of multiplying gives 0.02, which would understate fault current fourfold.',
        },
        {
          question: 'A bus has 0.20 pu total reactance on a 100 MVA base. What is the three-phase fault MVA?',
          options: ['500 MVA', '20 MVA', '100 MVA', '2000 MVA'],
          correctIndex: 0,
          explanation: 'Fault MVA = S_base/Z_pu = 100/0.20 = 500 MVA. Lower impedance means a stiffer bus and higher fault duty, which is what switchgear interrupting ratings must be selected against.',
        },
      ],
    },
    {
      id: 'pu-multizone',
      title: '4. A Complete Multi-Zone Walkthrough',
      content: `## 4.1 The system

Sections 1 to 3 built the machinery one piece at a time. This section runs the
whole procedure on a system with three voltage zones, because that is the form
the exam and real life both use, and because every mistake per-unit is designed
to prevent shows up somewhere in it.

A generator feeds a step-up transformer, a transmission line, and a step-down
transformer supplying a load bus. The equipment data, exactly as a nameplate
would give it:

| Element | Rating | Voltage | Impedance (own base) |
|---|---|---|---|
| Generator G | 50 MVA | 13.8 kV | X″ = 0.20 pu |
| Transformer T1 | 50 MVA | 13.8 / 138 kV | Z = 0.08 pu |
| Line | — | 138 kV | 40 Ω actual |
| Transformer T2 | 100 MVA | 138 / 13.8 kV | Z = 0.14 pu |

Every impedance is on a *different* base. Nothing can be added until they all
share one.

## 4.2 Step 1 — pick the bases and propagate them

Choose **S_base = 100 MVA** for the whole network. It never changes anywhere.
Choose **V_base = 13.8 kV** in the generator zone, then let the transformer
turns ratios carry it forward:

| Zone | V_base | Z_base = V_base²/S_base | I_base = S_base/(√3·V_base) |
|---|---|---|---|
| 1: generator | 13.8 kV | 1.904 Ω | 4,184 A |
| 2: line | 138 kV | 190.44 Ω | 418.4 A |
| 3: load bus | 13.8 kV | 1.904 Ω | 4,184 A |

Zone 3 returns to 13.8 kV because T2 steps back down. The bases are a property
of the *network*, not of the equipment ratings — note that T2's own rating
(100 MVA) played no part in choosing them.

## 4.3 Step 2 — re-base every impedance onto 100 MVA

Apply **$Z_{new} = Z_{old}\\left(\\dfrac{S_{new}}{S_{old}}\\right)\\left(\\dfrac{V_{old}}{V_{new}}\\right)^{2}$**
element by element:

- **Generator**: 0.20 × (100/50) × (13.8/13.8)² = **0.40 pu**
- **T1**: 0.08 × (100/50) × 1 = **0.16 pu**
- **Line**: this one is in ohms, so divide by the zone base: 40/190.44 = **0.210 pu**
- **T2**: 0.14 × (100/100) = **0.14 pu** (already on the system base)

Both voltage bases matched the equipment voltage ratings here, so the squared
voltage factor was 1 throughout. That is common but not guaranteed; when a
transformer's nameplate voltage differs from the zone base you chose, that
squared term is live and dropping it is the classic per-unit error.

## 4.4 Step 3 — add them, because the transformers are gone

In per-unit the transformers are no longer ratio elements; they are simply
series impedances. The path from the generator's internal EMF to the load bus
is one series string:

$$Z_{th} = 0.40 + 0.16 + 0.210 + 0.14 = \\mathbf{0.91\\ pu}$$

Every one of those four numbers came from a different voltage level and a
different MVA rating, and they added like resistors in a first-week circuits
problem. That is the entire payoff of the method.

## 4.5 Step 4 — answer the questions

**Three-phase bolted fault at the load bus**, pre-fault voltage 1.0 pu:

$$I_{f} = \\frac{1.0}{0.91} = 1.099\\ \\mathrm{pu} \\qquad I_{f} = 1.099 \\times 4{,}184 = \\mathbf{4{,}597\\ A} = 4.60\\ \\mathrm{kA}$$

$$\\text{Fault MVA} = \\frac{S_{base}}{Z_{pu}} = \\frac{100}{0.91} = \\mathbf{110\\ MVA}$$

![Three-phase fault duty against Thevenin per-unit reactance on a 100 MVA base, drawn on a logarithmic MVA axis. The curve is the single division fault MVA equals S base divided by Z per unit; the marked points are the 0.16 pu generator-terminal case at 625 MVA and this section's 0.91 pu load-bus case at 110 MVA, and the shaded bands show where transformer and generator impedances typically fall.](/courses/fe-ee/figures/pow-pu-fault-duty.svg)

The figure is one division plotted, and it turns per-unit impedance into an
engineering instinct. Read the shaded bands first: transformer impedances live
near 0.05–0.10 pu and generator subtransient reactances near 0.15–0.25 pu on
their own ratings. Then read the curve backwards — a switchgear lineup rated
250 MVA is telling you the Thevenin impedance behind it is about 0.4 pu. The
two marked points bracket the practical range: 0.16 pu at the generator
terminals gives 625 MVA (Section 3.4), while our load bus, four elements
further out, sees only 110 MVA. **Distance from the source is impedance, and
impedance is the only thing limiting fault current.**

Notice what the curve does at small impedance. Halving Z from 0.20 to 0.10 pu
doubles the duty from 500 to 1000 MVA; the relationship is hyperbolic, so
stiff buses become expensive very quickly. This is why utilities sometimes
*add* impedance — series reactors, higher-impedance transformers, split bus
ties — to hold fault duty inside the rating of switchgear already installed.

## 4.6 Where each number would have gone wrong in ohms

Doing the same problem in volts and ohms would have required referring the
generator reactance through T1, the line impedance through T2, and keeping
track of two turns ratios and their squares — six opportunities for a factor
of 100. In per-unit there were four divisions and one addition, and the answer
carries a built-in plausibility check: 0.91 pu is a believable total for a
generator plus two transformers plus a line, whereas 91 pu or 0.0091 pu would
have been visibly absurd.`,
      examTip: 'Work the walkthrough in this exact order: fix S_base once, propagate V_base through the turns ratios, compute Z_base per zone, re-base every impedance, then add. Impedances given in OHMS are divided by that zone Z_base; impedances given in PER UNIT are re-based with the (S_new/S_old)(V_old/V_new)² formula. Confusing which of the two rules applies is the most common way to lose the whole problem.',
      importantNote: 'The re-basing voltage factor (V_old/V_new)² equals 1 only when the equipment nameplate voltage matches the zone base voltage you chose. When it does not — a 13.2 kV generator on a 13.8 kV base, for example — that squared term changes the answer by about 9 percent and is silently omitted by most students.',
    },
    {
      id: 'pu-applications',
      title: '5. Per-Unit Beyond Faults: Regulation, Motor Starting, and Base Pitfalls',
      content: `## 5.1 Single-phase versus three-phase bases

Almost every per-unit error that is not a re-basing error is a base-definition
error. The two conventions differ, and mixing them produces answers wrong by
√3 or by 3.

| Quantity | Three-phase convention | Single-phase convention |
|---|---|---|
| S_base | Total three-phase VA | Per-phase VA |
| V_base | **Line-to-line** | Line-to-neutral |
| I_base | $S_{base}/(\\sqrt{3}V_{base})$ | $S_{base}/V_{base}$ |
| Z_base | $V_{base}^{2}/S_{base}$ | $V_{base}^{2}/S_{base}$ |

The saving grace is that **Z_base has the same form in both**, because the two
√3 factors cancel: using line-to-line volts with total VA gives exactly the
same base ohms as using line-to-neutral volts with per-phase VA. Power system
work therefore uses the three-phase convention universally, and Z_base =
V_LL²/S_3φ is safe to memorise as written. Only I_base needs care.

## 5.2 Voltage drop and regulation, done in per-unit

Per-unit turns the feeder-drop calculation into arithmetic with no units to
track. For a load drawing S_pu = P_pu + jQ_pu through a series impedance
Z_pu = R_pu + jX_pu, the approximate drop is

$$\\Delta V_{pu} \\approx R_{pu}P_{pu} + X_{pu}Q_{pu}$$

Every symbol is dimensionless, and the result is directly a percentage: 0.04
means a 4 percent drop, whatever the voltage class. Take T2 from Section 4,
0.14 pu on 100 MVA, feeding 60 MW at 0.85 lagging. Then P_pu = 0.60,
Q_pu = 0.60 × tan(31.79°) = 0.372, and with the transformer's resistance
negligible against its reactance:

$$\\Delta V_{pu} \\approx 0.14 \\times 0.372 = 0.052 \\;\\Rightarrow\\; \\mathbf{5.2\\%\\ drop}$$

Read the structure of that expression before moving on, because it explains
half of power system operation: **reactance multiplies reactive power** and
resistance multiplies real power. On transmission networks X is much larger
than R, so voltage is controlled almost entirely by Q, and real power flow
barely moves it. On low-voltage distribution feeders R and X are comparable
and both terms matter. The same equation, two different design philosophies.

## 5.3 Motor starting: a per-unit problem in disguise

A large motor started across the line looks, electrically, like a short circuit
with a bit of impedance. Per-unit handles it in three lines.

**Worked example.** A 2000 kVA motor with a locked-rotor current 6 times rated
is started from a 5 MVA transformer of 5.75 percent impedance. What does the
bus voltage do?

Work on the transformer's own 5 MVA base. Locked-rotor apparent power is
6 × 2000 = 12,000 kVA = 12 MVA, so the motor's starting impedance in per-unit
is the reciprocal of that in per-unit MVA:

$$Z_{motor} = \\frac{S_{base}}{S_{LR}} = \\frac{5}{12} = 0.417\\ \\mathrm{pu}$$

The motor and the transformer form a voltage divider across the stiff upstream
source:

$$V_{bus} = \\frac{0.417}{0.417 + 0.0575} = 0.879\\ \\mathrm{pu} \\;\\Rightarrow\\; \\mathbf{12.1\\%\\ dip}$$

Twelve percent is enough to drop out contactors (which typically release
between 60 and 70 percent) elsewhere on the bus, dim lighting visibly, and —
because induction motor torque falls with the **square** of voltage — reduce
the starting torque of the motor itself to 0.879² = 77 percent of its
across-the-line value. That last consequence is why reduced-voltage starting
is a trade rather than a free lunch, and it is developed in the motors topic.

## 5.4 A checklist of base traps

| Trap | Symptom | Fix |
|---|---|---|
| Forgot to re-base equipment data | Fault current off by the ratio of MVA bases | Apply the S ratio to every nameplate impedance |
| Used V rather than V² | Z_base absurdly small; per-unit values in the hundreds | Z_base = V_base²/S_base |
| Changed S_base across a transformer | Impedances that will not add sensibly | S_base is global; only V_base moves |
| Used line-to-neutral volts in a three-phase base | I_base wrong by √3 | Use line-to-line volts with total MVA |
| Mixed MVA and kVA | Answers off by 1000 | Convert everything before the first division |

The final defence is the one Section 2 introduced and it costs nothing: normal
per-unit quantities cluster near 1.0. Voltages run 0.95 to 1.05, transformer
impedances 0.05 to 0.10, generator subtransient reactances 0.15 to 0.25, line
impedances a few tenths at most. A per-unit impedance of 12, or of 0.0008, is
an arithmetic accident announcing itself. No other analysis method in the FE
power syllabus gives you an error detector for free.`,
      examTip: 'Z_base = V_base²/S_base is identical in the single-phase and three-phase conventions — only I_base carries the √3. So if a problem gives line-to-line voltage and total three-phase MVA, you can compute Z_base directly with no √3 anywhere, and that is the form the exam expects.',
      importantNote: 'A motor starting problem, a fault problem, and a voltage-regulation problem are the same per-unit calculation with different impedances. Recognising that a locked-rotor motor is just an impedance of S_base/S_locked-rotor per unit converts an unfamiliar question into a voltage divider you can solve in two lines.',
    },
  ],
  keyTakeaways: [
    'Choose S_base and V_base at one zone; derive Z_base = V_base²/S_base.',
    'V_base changes across transformers by the turns ratio; S_base stays constant everywhere.',
    'Z_pu is the same on both sides of a transformer — turns ratios disappear.',
    'Re-base formula: Z_pu(new) = Z_pu(old) × (S_new/S_old) × (V_old/V_new)².',
    'Normal per-unit values cluster near 1.0; far-off values signal errors.',
  ],
},

  fee_tx_lines: {
  topicId: 'fee_tx_lines',
  title: 'Transmission Lines: Models and Parameters',
  domainWeight: 'Power Systems · 4–6%',
  overview: 'Power transmission lines have distributed resistance, inductance, capacitance, and conductance that affect voltage regulation, losses, and stability. The FE exam tests line models (short, medium, long), surge impedance, and voltage drop calculations.',
  sections: [
    {
      id: 'txl-parameters-models',
      title: '1. Line Parameters and Circuit Models',
      content: `## 1.1 Distributed Parameters

Transmission lines have per-unit-length parameters:

| Parameter | Symbol | Unit | Cause |
|---|---|---|---|
| Series resistance | R | $\\Omega /km$ | Conductor resistivity |
| Series inductance | L | H/km | Magnetic field around conductors |
| Shunt capacitance | C | F/km | Electric field between conductors and ground |
| Shunt conductance | G | S/km | Leakage (usually negligible) |

**Series impedance per unit length**: **$Z = R + j\\omega L$** (Ω/km)
**Shunt admittance per unit length**: **$Y = G + j\\omega C$** (S/km)

## 1.2 Line Models by Length

| Line Length | Model | Elements |
|---|---|---|
| **Short** (< 80 km) | Lumped series impedance | Z_total = z·ℓ (no shunt) |
| **Medium** (80–240 km) | π or T equivalent | Series Z, shunt Y/2 at each end (π model) |
| **Long** (> 240 km) | Distributed parameter | Hyperbolic functions: V = V_R·cosh(γℓ) + I_R·Z₀·sinh(γℓ) |

where **$\\gamma = \\sqrt{Z\\cdot Y}$** is the propagation constant and **ℓ** is line length.

## 1.3 Voltage Drop for Short Line

**$\\Delta V \\approx (R\\cdot P + X\\cdot Q) / V$**

- Both real power P and reactive power Q contribute to voltage drop
- Poor power factor (large Q) worsens voltage drop even at moderate P`,
      examTip: 'The short-line model (series impedance only, no shunt) is overwhelmingly the most tested on the FE exam. For short lines, voltage drop ΔV ≈ I·(R·cos(φ) + X·sin(φ)) or equivalently (RP + XQ)/V. Know this formula cold.',
    },
    {
      id: 'txl-surge-ferranti',
      title: '2. Surge Impedance, Natural Power, and Ferranti Effect',
      content: `## 2.1 Surge Impedance and SIL

**Surge impedance (characteristic impedance)**:

**$Z_{0} = \\sqrt{Z/Y} \\approx \\sqrt{L/C}$**

Typical values: **$200-400\\ \\Omega$** for overhead lines, **$30-60\\ \\Omega$** for underground cables.

**Surge Impedance Loading (SIL)** or Natural Power:

**$P_{SIL} = V^{2}_{LL} / Z_{0}$**

| Load vs. SIL | Voltage Profile | Reactive Power |
|---|---|---|
| Load < SIL | Voltage rises along line (Ferranti effect) | Line generates Q (capacitive) |
| Load = SIL | Flat voltage profile | Q generated = Q absorbed |
| Load > SIL | Voltage drops along line | Line absorbs Q (inductive) |

## 2.2 Ferranti Effect

On **lightly loaded or unloaded** long lines, shunt capacitance charging current flows through series inductance, causing the **receiving-end voltage to exceed the sending-end voltage**.

- More pronounced on longer lines and at higher voltages
- Mitigated by shunt reactors (inductors) at the receiving end

## 2.3 Charging Current

No-load charging current: **$I_c = V \\cdot \\omega \\cdot C \\cdot \\ell$**

Charging reactive power: **$Q_c = V^{2} \\cdot \\omega \\cdot C \\cdot \\ell$** (can be hundreds of MVAR on long HV lines)`,
      examTip: 'SIL = V²/Z₀ is the "sweet spot" where the line generates exactly as much reactive power as it absorbs. Below SIL, voltage rises (Ferranti); above SIL, voltage drops. The FE exam may ask you to identify the Ferranti effect scenario — it always involves a lightly loaded or open-ended long line.',
    },
    {
      id: 'txl-worked',
      title: '3. Worked Examples',
      content: `## 3.1 Voltage drop and regulation

A feeder carries 200 A at 0.9 lagging power factor over a line of R = 0.5 ohm and X = 1.2 ohm per phase, delivering 7.2 kV per phase at the load.

The approximate drop (accurate for small angles, and what the FE expects):

**V_drop = I(R cos(theta) + X sin(theta))** = 200(0.5 x 0.9 + 1.2 x 0.436) = 200(0.45 + 0.523) = 200(0.973) = **195 V**

Sending-end phase voltage = 7200 + 195 = **7395 V**.

Voltage regulation = (V_no-load - V_full-load)/V_full-load = 195/7200 = **2.7%**.

Note what the reactive term did: at 0.9 pf the X sin(theta) term contributes MORE drop than the resistive term, even though X is only 2.4 times R. Improving power factor reduces sin(theta) and hence the drop - a second reason to correct power factor beyond current reduction.

## 3.2 Line losses

Real loss is I^2 R per phase, times three:

$$P_{loss} = 3 x (200)^2 x 0.5 = 3 x 40000 x 0.5 = 60\\ \\mathrm{kW}$$

Delivered power = 3 x V_phase x I x cos(theta) = 3 x 7200 x 200 x 0.9 = **3.89 MW**.

Efficiency = 3.89/(3.89 + 0.06) = **98.5%**.

Halve the current by correcting the power factor to unity (same real power) and the loss falls by a factor of four, not two - I^2 R is quadratic, which is the entire economic argument for transmitting at high voltage and low current.

## 3.3 Short, medium, long

| Length | Model | What is included |
|---|---|---|
| Under ~80 km | short | series R and X only |
| 80-250 km | medium (nominal pi) | series R+jX, shunt capacitance split at both ends |
| Over 250 km | long | distributed parameters, hyperbolic functions |

Shunt capacitance is why a lightly loaded long line can show a HIGHER receiving-end voltage than sending-end - the Ferranti effect. It is a capacitive charging current flowing through the line inductance, and it is the reason shunt reactors exist on long lines.

## 3.4 Surge impedance loading

A line's characteristic impedance Z_0 = sqrt(L/C) is typically 300-400 ohm for overhead lines. Loading at exactly Z_0 makes the reactive production of the shunt capacitance equal the reactive consumption of the series inductance, so the line neither absorbs nor supplies VARs and the voltage profile is flat.

For a 345 kV line with Z_0 = 300 ohm: SIL = V^2/Z_0 = (345e3)^2/300 = **397 MW**. Below SIL the line supplies VARs and voltage rises; above it, the line absorbs VARs and voltage falls.`,
      examTip: 'Use V_drop = I(R cos theta + X sin theta) for FE problems. It is the approximation that ignores the angle between sending and receiving voltage, and at the power factors these questions use it is accurate to well under a percent.',
      quiz: [
        {
          question: 'A feeder carries 100 A at unity power factor through R = 0.4 ohm and X = 1.0 ohm per phase. What is the approximate voltage drop per phase?',
          options: ['40 V', '100 V', '140 V', '108 V'],
          correctIndex: 0,
          explanation: 'V_drop = I(R cos theta + X sin theta) = 100(0.4 x 1 + 1.0 x 0) = 40 V. At unity power factor sin(theta) = 0, so the reactance contributes nothing to the drop - which is exactly why power factor correction reduces voltage drop as well as current.',
        },
        {
          question: 'Line current is halved while delivering the same real power. What happens to the I^2R losses?',
          options: ['They fall to one quarter', 'They halve', 'They are unchanged', 'They fall to one eighth'],
          correctIndex: 0,
          explanation: 'Loss goes as the square of current, so halving I gives (1/2)^2 = one quarter of the loss. This quadratic relationship is the reason transmission uses the highest practical voltage: for fixed power, higher voltage means lower current means far lower loss.',
        },
        {
          question: 'A long transmission line is very lightly loaded. What does the Ferranti effect predict?',
          options: [
            'Receiving-end voltage exceeds sending-end voltage',
            'Receiving-end voltage collapses to zero',
            'The line draws maximum reactive power',
            'Losses reach their maximum'
          ],
          correctIndex: 0,
          explanation: 'On a lightly loaded long line the shunt capacitance charging current flows through the series inductance and raises the receiving-end voltage above the sending end. Shunt reactors are installed specifically to absorb that excess and hold the voltage down.',
        },
      ],
    },
    {
      id: 'txl-distributed',
      title: '4. The Distributed Solution and the Voltage Profile',
      content: `## 4.1 Where the hyperbolic functions come from

Section 1 gave the long-line model as "hyperbolic functions" without saying
why. The reason is that a transmission line is a continuum, not a lump: over a
differential length dx the voltage falls by the series drop and the current
falls by the shunt charging current,

$$\\frac{dV}{dx} = zI, \\qquad \\frac{dI}{dx} = yV$$

Differentiate either one and substitute the other and you get
**$d^{2}V/dx^{2} = zyV$**, whose solution is a pair of exponentials in
**$\\gamma = \\sqrt{zy}$**. Written from the receiving end, with x measured back
toward the source, that solution is

$$V(x) = V_{R}\\cosh (\\gamma x) + I_{R}Z_{0}\\sinh (\\gamma x), \\qquad I(x) = I_{R}\\cosh (\\gamma x) + \\frac{V_{R}}{Z_{0}}\\sinh (\\gamma x)$$

with **$Z_{0} = \\sqrt{z/y}$**. Neglect losses — a good approximation for a
high-voltage line, where the series reactance is many times the resistance —
and γ becomes purely imaginary, γ = jβ with **$\\beta = \\omega \\sqrt{LC}$**. The
hyperbolics collapse to ordinary trigonometric functions:

$$V(x) = V_{R}\\cos (\\beta x) + jZ_{0}I_{R}\\sin (\\beta x)$$

## 4.2 A 300 km line, numerically

Take a line with the standard overhead values **L = 1.3 mH/km** and
**C = 9 nF/km** at 60 Hz:

| Quantity | Expression | Value |
|---|---|---|
| Surge impedance | $Z_{0} = \\sqrt{L/C}$ | 380 Ω |
| Phase constant | $\\beta = \\omega \\sqrt{LC}$ | 1.290 × 10⁻³ rad/km = 0.0739°/km |
| Electrical length of 300 km | $\\beta \\ell$ | 0.3869 rad = **22.2°** |
| Wavelength | $2\\pi /\\beta$ | 4,873 km |
| Propagation velocity | $\\omega /\\beta$ | 2.92 × 10⁵ km/s ≈ 0.97c |

That velocity is the sanity check worth remembering: a lossless overhead line
propagates at very nearly the speed of light, because L and C are set by the
same conductor geometry that sets the wave speed in air. The wavelength at
60 Hz is roughly 5,000 km, so a 300 km line is about one twentieth of a
wavelength — which is exactly why it needs a distributed model while a 50 km
line does not.

## 4.3 Surge impedance loading and the flat profile

Now load the receiving end at unity power factor with **$I_{R} = V_{R}/Z_{0}$**
— that is, with the load resistance equal to the surge impedance. Substituting
into the profile equation:

$$V(x) = V_{R}[\\cos (\\beta x) + j\\sin (\\beta x)] = V_{R}e^{j\\beta x}$$

The magnitude is **V_R everywhere**. The voltage rotates in angle along the
line but never changes size. That loading is the **surge impedance loading**,

$$P_{SIL} = \\frac{V_{LL}^{2}}{Z_{0}}$$

which for this line at 345 kV is (345 kV)²/380 Ω = **313 MW**.

![Voltage magnitude along the 300 km lossless line at three loadings, each normalised to its own sending-end voltage. At half of surge impedance loading the profile climbs 5.8 percent toward the receiving end; at exactly SIL it is perfectly flat; at 1.5 times SIL it sags 7.9 percent. All three curves are computed from V equals V R cosine of beta x plus j Z0 I R sine of beta x.](/courses/fe-ee/figures/pow-line-voltage-profile.svg)

The three curves are the same equation with one number changed, and together
they are the clearest statement of what a transmission line does to voltage:

| Loading | Receiving end (pu of sending) | Reactive behaviour |
|---|---|---|
| No load | 1.080 | Line generates its full charging Q |
| 0.5 × SIL | 1.058 | Net Q generator; voltage rises |
| **1.0 × SIL** | **1.000** | Q generated = Q absorbed; flat |
| 1.5 × SIL | 0.921 | Net Q absorber; voltage sags |

The physical accounting is a two-line argument. Shunt capacitance generates
**$Q_{C} = V^{2}\\omega C\\ell$**, which depends on voltage and therefore barely
changes with load. Series inductance absorbs **$Q_{L} = I^{2}\\omega L\\ell$**,
which depends on current and therefore rises with the square of load. At light
load the capacitive generation wins and voltage rises; at heavy load the
inductive absorption wins and voltage falls; at exactly one crossing point they
balance, and that point is SIL.

## 4.4 Ferranti effect, quantified

The no-load case is worth its own formula. With I_R = 0 the profile equation
gives V_S = V_R cos(βℓ), so

$$\\frac{V_{R}}{V_{S}} = \\frac{1}{\\cos (\\beta \\ell )} = \\frac{1}{\\cos (22.2^\\circ )} = 1.080$$

An **8.0 percent rise** at the open end of a 300 km line, and it grows without
bound as βℓ approaches 90° — a quarter wavelength, about 1,200 km at 60 Hz.
The charging current for this line at 345 kV is

$$I_{C} = V_{LN}\\,\\omega C\\ell = 199{,}186 \\times (377 \\times 2.70\\times 10^{-6}) = 203\\ \\mathrm{A}$$

using Cℓ = 9 nF/km × 300 km = 2.70 μF per phase. The line as a whole therefore
draws **$Q_{C} = V_{LL}^{2}\\omega C\\ell = 121\\ \\mathrm{MVAR}$** from the system with
nothing connected at the far end. Shunt reactors sized at some fraction of that
121 MVAR are switched in at light load precisely to cancel it, and switched out
as load builds.`,
      examTip: 'Two long-line numbers are worth carrying in memory: β ≈ 0.0739 degrees per km at 60 Hz for a typical overhead line, and Ferranti rise = 1/cos(βℓ). Together they let you estimate the no-load voltage rise of any stated line length in one step, which is how the exam usually poses it.',
      importantNote: 'SIL depends only on the line VOLTAGE and its surge impedance — not on conductor size, not on length. Two 345 kV lines of the same geometry have the same SIL whether they run 50 km or 500 km. Length determines how far the voltage profile deviates when the load differs from SIL, not where the balance point sits.',
    },
    {
      id: 'txl-power-flow',
      title: '5. Power Flow, ABCD Parameters, and the Angle Limit',
      content: `## 5.1 The power-angle equation

How much power can a line carry between two buses whose voltages are held
constant? Neglect resistance and let the sending voltage lead the receiving
voltage by the **power angle** δ. The current through the reactance X is
$(V_{S}\\angle \\delta - V_{R}\\angle 0)/(jX)$, and forming the complex power at
the receiving end gives two expressions that between them describe almost all
of transmission operation:

$$P = \\frac{V_{S}V_{R}}{X}\\sin \\delta, \\qquad Q_{R} = \\frac{V_{S}V_{R}\\cos \\delta - V_{R}^{2}}{X}$$

**Worked example.** A 138 kV line of X = 40 Ω joins two buses both held at
138 kV, with δ = 20°:

$$P = \\frac{138^{2}}{40}\\sin 20^\\circ = 476.1 \\times 0.342 = \\mathbf{162.8\\ MW}$$

$$Q_{R} = \\frac{138^{2}\\cos 20^\\circ - 138^{2}}{40} = 476.1\\,(0.9397 - 1) = \\mathbf{-28.7\\ MVAR}$$

The reactive number is negative, meaning the receiving end must *absorb*
28.7 MVAR to hold its voltage at 138 kV. Symmetrically, the sending end must
supply +28.7 MVAR. The reactance consumed it — this is the
$I^{2}\\omega L$ term of Section 4 seen from the terminals.

| δ | P transferred | Fraction of maximum |
|---|---|---|
| 10° | 82.7 MW | 17% |
| 20° | 162.8 MW | 34% |
| 30° | 238.0 MW | 50% |
| 90° | 476.1 MW | 100% (theoretical limit) |

**Maximum transfer is at δ = 90°**, where P_max = V_S V_R/X = 476 MW. Real
systems never approach it. Beyond about 30 to 40° the incremental power per
degree of angle collapses (compare the 10°-to-20° step, 80 MW, with the
30°-to-90° step, 238 MW spread over 60°), and a system operating near 90° has
no margin: any disturbance that pushes δ past 90° causes the transmitted power
to *fall* as the angle grows, which accelerates the sending machine further —
transient instability. Operating limits are therefore set by stability, not by
conductor heating, on long lines.

Read the P equation once more for what it says about design. Transfer capacity
is proportional to **V²** (both voltages scale together) and inversely
proportional to **X**. Doubling the transmission voltage quadruples the
transfer limit; that is the entire economic case for extra-high voltage. Adding
series capacitors to cancel part of X — series compensation — is the other
lever, and it is why long interties carry capacitor banks in series with the
line.

## 5.2 ABCD parameters and a medium-line worked example

Any two-port line model can be written in the standard form

$$V_{S} = AV_{R} + BI_{R}, \\qquad I_{S} = CV_{R} + DI_{R}$$

with AD − BC = 1 for a passive reciprocal network. For the nominal π model
(total series Z, half the total shunt admittance Y at each end):

$$A = D = 1 + \\frac{ZY}{2}, \\qquad B = Z, \\qquad C = Y\\left(1 + \\frac{ZY}{4}\\right)$$

**Worked example.** A 200 km, 230 kV line with z = 0.10 + j0.50 Ω/km and
y = j3.4 × 10⁻⁶ S/km delivers 100 MW at 0.95 lagging power factor at 230 kV.

Totals: **Z = 20 + j100 Ω** (|Z| = 102.0 Ω at 78.7°) and
**Y = j6.80 × 10⁻⁴ S**. Then

- **$A = D = 1 + ZY/2 = 0.966 + j0.0068 = 0.9660\\angle 0.40^\\circ$**
- **$B = Z = 102.0\\angle 78.7^\\circ\\ \\Omega$**
- **$C = 6.684\\times 10^{-4}\\angle 90.2^\\circ$ S**

Receiving-end phase voltage is 230/√3 = 132.8 kV, and the receiving current is
$100/(\\sqrt{3}\\times 230\\times 0.95) = 264.2$ A at −18.2°. Substituting:

| Result | Value |
|---|---|
| Sending-end voltage | 143.6 kV per phase = **248.8 kV line-to-line** |
| Sending-end current | 243.0 A at +2.54° |
| Sending-end power | 103.9 MW |
| Line loss | **3.86 MW** |
| Efficiency | **96.3%** |

**Voltage regulation** uses A, because at no load V_R rises to V_S/|A|:

$$VR = \\frac{|V_{S}|/|A| - |V_{R,FL}|}{|V_{R,FL}|} = \\frac{248.8/0.9660 - 230}{230} = \\mathbf{12.0\\%}$$

Twelve percent is poor, and the reason is the second term of the drop
expression: at 0.95 power factor the load still draws 32.9 MVAR through 100 Ω
of reactance. Correcting the load to unity power factor, or adding shunt
capacitors at the receiving bus, attacks that term directly.

## 5.3 Choosing a model without over-thinking it

| Length | Model | Shunt Y | Typical error if you use the short model |
|---|---|---|---|
| < 80 km | Short: B = Z, A = D = 1, C = 0 | ignored | under 1% |
| 80–250 km | Nominal π | lumped, half each end | a few percent |
| > 250 km | Distributed (hyperbolic) | continuous | 5% and rising |

The exam almost always wants the short model, and says so by giving you only R
and X. The moment shunt capacitance, charging current, Ferranti effect, or SIL
appears in the wording, it wants at least the π model — and the calculation it
actually asks for is usually a single line of the ABCD set, not the whole
four-parameter solve.`,
      examTip: 'P = (V_S·V_R/X)·sin δ is the one power-flow formula to memorise, and its two design consequences follow immediately: capacity scales with V² and inversely with X. If a question asks for maximum transfer, set sin δ = 1 and read off V_S·V_R/X — but note that practical limits sit near 30–40°, not 90°.',
      importantNote: 'Real power flow is controlled by the ANGLE between bus voltages; reactive power flow is controlled by their MAGNITUDES. That split holds because X ≫ R on transmission lines, and it is why phase-shifting transformers move MW while capacitor banks and tap changers move MVAR.',
    },
  ],
  keyTakeaways: [
    'Distributed parameters: Z = R + jωL per km (series), Y = G + jωC per km (shunt).',
    'Short line (< 80 km): lumped Z only; medium: π-model; long: hyperbolic.',
    'Surge impedance Z₀ = √(L/C); SIL = V²/Z₀ defines flat voltage profile.',
    'Short-line voltage drop: ΔV ≈ (RP + XQ)/V — both P and Q matter.',
    'Ferranti effect: receiving voltage > sending voltage on lightly loaded long lines.',
  ],
},

  fee_pf_correction: {
  topicId: 'fee_pf_correction',
  title: 'Power Factor Correction',
  domainWeight: 'Power Systems · 4–6%',
  overview: 'Power factor correction reduces reactive power demand, lowering utility penalties, reducing I²R losses, and freeing capacity. The FE exam tests PF concepts, capacitor sizing, and the power triangle.',
  sections: [
    {
      id: 'pfc-power-triangle',
      title: '1. Power Triangle and Power Factor Fundamentals',
      content: `## 1.1 The Power Triangle

| Quantity | Symbol | Formula | Unit |
|---|---|---|---|
| Real power | P | $V\\cdot I\\cdot \\cos (\\phi)$ | W (watts) |
| Reactive power | Q | $V\\cdot I\\cdot \\sin (\\phi)$ | VAR |
| Apparent power | S | $V\\cdot I$ | VA |
| Complex power | **S** | P + jQ | VA |

**Power factor**: **$PF = \\cos (\\phi) = P / S = P / \\sqrt{P^{2} + Q^{2}}$**

- **Lagging PF** (φ > 0): current lags voltage — inductive loads (motors, transformers)
- **Leading PF** (φ < 0): current leads voltage — capacitive loads
- **Unity PF** (φ = 0): all power is real; Q = 0

## 1.2 Why Correct Power Factor?

| Effect of Low PF | Explanation |
|---|---|
| Higher current draw | I = S/V = P/(V·PF) — lower PF means more current for same real power |
| Increased I²R losses | More current means more resistive losses in wires and transformers |
| Utility penalties | Most utilities penalize PF below 0.90 or 0.95 |
| Reduced capacity | Transformers and generators rated in VA, not W — low PF wastes capacity |

## 1.3 Reactive Power Sign Convention

- Inductive loads **consume** positive Q (lagging)
- Capacitors **generate** positive Q (leading) — they supply the reactive power that inductors need
- Adding a capacitor **reduces** the net Q drawn from the utility`,
      examTip: 'The FE exam loves the formula I = P/(V·PF). Lower power factor means higher current for the same real power. If PF drops from 1.0 to 0.5, current doubles. This directly explains why utilities penalize poor PF.',
    },
    {
      id: 'pfc-capacitor-sizing',
      title: '2. Capacitor Sizing and Correction Methods',
      content: `## 2.1 Capacitor Sizing Formula

To correct from old angle θ₁ to new angle θ₂:

**$Q_c = P \\cdot (\\tan (\\theta _{1}) - \\tan (\\theta _{2}))$**

where:
- P = real power of the load (unchanged by correction)
- θ₁ = arccos(PF_old), θ₂ = arccos(PF_new)
- Q_c = reactive power the capacitor must supply

### Capacitor Value

**$C = Q_c / (\\omega \\cdot V^{2})$** where ω = 2πf

For three-phase: **$Q_c(3\\phi) = 3 \\cdot V_{ph}^{2} \\cdot \\omega \\cdot C$** or **$Q_c(3\\phi) = V_{LL}^{2} \\cdot \\omega \\cdot C$** (for Δ-connected caps)

## 2.2 Correction Methods

| Method | Mechanism | Pros | Cons |
|---|---|---|---|
| **Shunt capacitors** | Add Q_c directly | Simple, cheap, low maintenance | Fixed steps, possible resonance |
| **Synchronous condensers** | Over-excited synchronous motor | Continuously variable Q | Expensive, requires rotating equipment |
| **Static VAR compensator (SVC)** | Thyristor-switched capacitors/reactors | Fast, precise, wide range | Complex, expensive |

## 2.3 Risks of Over-Correction

- **Leading PF** can cause voltage rise on lightly loaded feeders
- **Harmonic resonance**: capacitor bank + system inductance can resonate at harmonic frequencies (5th, 7th, 11th, 13th are common)
- Utility may also penalize leading PF`,
      examTip: 'The capacitor sizing formula Q_c = P·(tan(θ_old) − tan(θ_new)) is the single most tested power factor correction equation. P stays the same (capacitors do not change real power); only Q changes. Make sure to use the ANGLE (arccos of PF), not the PF directly, in the tangent.',
      importantNote: 'Capacitors do NOT change real power P. They only reduce the reactive power Q drawn from the source. The load still consumes the same Q internally — the capacitor supplies it locally so the source does not have to.',
    },
    {
      id: 'pfc-worked',
      title: '3. Worked Examples',
      content: `## 3.1 The correction calculation, end to end

A plant draws 500 kW at 0.75 lagging from a 4160 V, 60 Hz supply. Correct it to 0.95 lagging.

**Before:** theta_1 = arccos(0.75) = 41.4 degrees, tan(theta_1) = 0.882, so Q_1 = 500 x 0.882 = **441 kVAR**. S_1 = 500/0.75 = **667 kVA**.

**After:** theta_2 = arccos(0.95) = 18.2 degrees, tan(theta_2) = 0.329, so Q_2 = 500 x 0.329 = **164 kVAR**. S_2 = 500/0.95 = **526 kVA**.

**Capacitor rating:** Q_C = Q_1 - Q_2 = 441 - 164 = **277 kVAR**.

The general formula is worth carrying: **Q_C = P[tan(theta_1) - tan(theta_2)]**.

## 3.2 What it buys

Line current before: I = P/(sqrt(3) V pf) = 500e3/(1.732 x 4160 x 0.75) = **92.5 A**
Line current after: 500e3/(1.732 x 4160 x 0.95) = **73.0 A**

Compute the current from P directly rather than from a rounded S. Carrying S
forward as 667 kVA instead of its exact 666.7 returns 92.6 A — a tenth of a
percent high, which is small until it lands you between two answer choices.
Round once, at the end.

A 21% current reduction. Feeder losses go as I^2, so they fall by 1 - (73.0/92.5)^2 = **38%**. On a feeder of 0.3 ohm per phase that is 3(92.5^2 - 73.0^2)(0.3) = 3(8561 - 5336)(0.3) = **2.9 kW** saved continuously, plus released transformer and cable capacity.

## 3.3 Sizing the capacitor bank

At 4160 V, delta-connected: Q_C per phase = 277/3 = 92.3 kVAR, and each capacitor sees the full line voltage.

$$X_C = V^2/Q_{phase} = (4160)^2/92.3e3 = 17.3e6/92.3e3 = 187 ohm$$
C = 1/(omega X_C) = 1/(377 x 187) = **14.2 microfarad per phase**

## 3.4 Why not correct to unity

Three reasons the exam expects you to know:

- **Diminishing returns.** Going 0.75 to 0.95 needed 277 kVAR; going 0.95 to 1.00 needs a further 164 kVAR for a much smaller current saving.
- **Overcorrection risk.** A fixed bank sized for full load leaves the plant leading at light load, which can raise voltage above limits and cause resonance with system inductance.
- **Tariffs stop at a target.** Utilities typically penalise below about 0.90-0.95 and pay nothing extra above it, so unity buys no billing benefit.

Automatic switched banks with contactors staged in steps solve the light-load problem, at higher capital cost.`,
      examTip: 'Q_C = P[tan(theta_1) - tan(theta_2)] is the one formula to memorise here. Compute both tangents from the power factors first, and note that real power P is the SAME before and after - the capacitor changes only the reactive component.',
      quiz: [
        {
          question: 'A 200 kW load at 0.8 lagging is to be corrected to unity. What capacitor rating is required?',
          options: ['150 kVAR', '250 kVAR', '160 kVAR', '200 kVAR'],
          correctIndex: 0,
          explanation: 'tan(arccos 0.8) = 0.75, so Q = 200 x 0.75 = 150 kVAR. Correcting to unity means the capacitor supplies all of it. The 250 figure is the apparent power S = 200/0.8, a different quantity entirely.',
        },
        {
          question: 'After power factor correction, what happens to the real power drawn by the load?',
          options: ['Unchanged', 'Reduced in proportion to the improvement', 'Increased slightly', 'Reduced to zero at unity'],
          correctIndex: 0,
          explanation: 'Capacitors supply reactive power only, so P is untouched. What falls is S and therefore the line current, which is where the saving comes from - lower I^2R feeder losses and released capacity, not less real power.',
        },
        {
          question: 'Why is a plant usually corrected to about 0.95 rather than to unity?',
          options: [
            'Diminishing returns and the risk of overcorrection at light load',
            'Unity power factor is physically impossible',
            'Capacitors cannot supply that much reactive power',
            'Utilities charge more at unity power factor'
          ],
          correctIndex: 0,
          explanation: 'The last increment to unity costs disproportionate kVAR for little current saving, and a fixed bank sized for full load leaves the plant leading at light load, raising voltage and risking resonance. Tariffs also stop rewarding improvement around 0.90-0.95.',
        },
      ],
    },
    {
      id: 'pfc-current-loss',
      title: '4. What Power Factor Costs: Current, Loss, and Capacity',
      content: `## 4.1 Two curves that contain the whole argument

Section 3 corrected one plant and reported the savings. This section shows the
shape of the relationship, because the shape is what makes the engineering
decision obvious and it is what the exam tests when it asks a comparative
question rather than a numerical one.

Fix the real power at 500 kW and the supply at 4160 V, and let the power factor
vary. Two consequences follow directly from the definitions, with no new
theory:

$$I_{L} = \\frac{P}{\\sqrt{3}\\,V_{LL}\\,\\mathrm{pf}}, \\qquad \\frac{P_{loss}}{P_{loss,\\,\\mathrm{pf}=1}} = \\left(\\frac{1}{\\mathrm{pf}}\\right)^{2}$$

The first is a rearranged power formula. The second follows because feeder loss
is 3I²R and R does not care about phase angle: if current scales as 1/pf, loss
scales as 1/pf².

![Line current and relative feeder loss against power factor for a fixed 500 kW load at 4160 V, drawn as two stacked panels sharing the power-factor axis. The upper panel is I equals P over root three V times power factor; the lower is relative loss equals one over power factor squared. Markers at 0.75 and 0.95 power factor show the current falling from about 92.5 A to 73.0 A while the loss multiplier falls from 1.78 to 1.11.](/courses/fe-ee/figures/pow-pfc-current.svg)

The two panels are stacked rather than overlaid because they carry different
units, and reading them together is the point. Between 1.0 and about 0.85 both
curves are gentle. Below 0.8 they steepen sharply — at 0.6 power factor the
current is 1.67 times the unity-power-factor value and the loss is 2.78 times.
**Poor power factor is not linearly bad; it is quadratically bad**, and that is
why utility tariffs have a threshold rather than a slope.

| Power factor | S (kVA) | Line current | Q (kVAR) | Loss multiplier |
|---|---|---|---|---|
| 0.70 | 714.3 | 99.1 A | 510.1 | 2.04 |
| 0.75 | 666.7 | 92.5 A | 441.0 | 1.78 |
| 0.80 | 625.0 | 86.7 A | 375.0 | 1.56 |
| 0.85 | 588.2 | 81.6 A | 309.9 | 1.38 |
| 0.90 | 555.6 | 77.1 A | 242.2 | 1.24 |
| 0.95 | 526.3 | 73.0 A | 164.3 | 1.11 |
| 1.00 | 500.0 | 69.4 A | 0 | 1.00 |

Every current in this table is computed straight from P, matching section 3.2.
It is worth seeing why that matters: routing the same calculation through a
three-significant-figure S (667 kVA rather than 666.7) returns 92.6 A at 0.75
power factor instead of 92.52. A tenth of a percent sounds harmless, but FE
distractors are often spaced that closely, so carry full precision through the
intermediates and round only the answer you write down.

## 4.2 The economics in engineering units

Three separate savings ride on that current reduction, and questions ask for
any of them:

1. **Feeder loss.** Correcting 0.75 to 0.95 cuts loss by 1 − (73.05/92.52)² = **37.7 percent**. On a feeder of 0.3 Ω per phase: 7.70 kW before, 4.80 kW after, **2.90 kW saved continuously** — about 25,400 kWh a year.
2. **Released capacity.** Apparent power falls from 667 to 526 kVA. On a 1000 kVA transformer that turns 333 kVA of spare capacity into 474 kVA, enough to add roughly **450 kW** of further load at 0.95 without buying a larger transformer.
3. **Voltage.** Section 3.1 of the transmission-lines topic showed the drop as I(R cos θ + X sin θ). Correction cuts I *and* cuts sin θ, so it attacks the reactive term twice.

The capacity argument is usually the largest in money terms and the one most
often forgotten, because it does not appear on an energy bill. A transformer is
rated in kVA precisely because its limits are thermal and driven by current,
which is indifferent to whether that current is doing useful work.

## 4.3 The reactive power balance

The most useful mental model is that **reactive power is a commodity that
should be produced where it is consumed**. An induction motor needs magnetising
VARs whether or not anyone corrects its power factor; the only question is how
far those VARs travel. Supplied from the utility, they occupy every metre of
conductor between the generator and the motor. Supplied from a capacitor at the
motor terminals, they circulate over a metre of cable.

That framing answers the question students find confusing — why capacitors do
not reduce the load's reactive demand. They do not. The load's internal Q is
unchanged at 441 kVAR; the capacitor supplies 277 of them locally, so the
utility supplies only 164. Nothing about the motor changed.`,
      examTip: 'Feeder loss scales as (1/pf)², so a question asking "by what percentage do losses fall when the power factor improves from pf₁ to pf₂" is answered by 1 − (pf₁/pf₂)² with no other data needed — no voltage, no resistance, no current. Recognising that the resistance cancels saves the whole calculation.',
      importantNote: 'Correcting power factor does not reduce the load\'s reactive demand at all; it relocates the source of that reactive power from the utility to a capacitor beside the load. The saving comes entirely from the shorter path the reactive current now travels, which is why capacitor placement close to the load is worth more than the same kVAR at the service entrance.',
    },
    {
      id: 'pfc-practice',
      title: '5. Bank Placement, Harmonic Resonance, and Practical Limits',
      content: `## 5.1 Where to put the capacitors

Correction can be applied at three levels, and each buys a different set of the
savings listed in Section 4.

| Placement | Relieves | Advantages | Drawbacks |
|---|---|---|---|
| At the motor terminals | Everything upstream, including the motor feeder | Maximum benefit; switches with the motor, so no overcorrection at light load | Most units, highest cost per kVAR; must be sized below the motor's no-load magnetising kVAR |
| At a distribution panel | Panel feeder and upstream | Good compromise; a few larger banks | Branch circuits still carry full reactive current |
| At the service entrance | Only the utility supply and the main transformer | Cheapest per kVAR; simplest to switch and control | Saves nothing inside the plant; internal feeders unchanged |

Motor-terminal correction has a specific hazard that questions like to probe:
a capacitor left connected to a motor that is switched off can **self-excite**
it. The spinning rotor's residual magnetism, fed by the capacitor, sustains
generator action, and the terminal voltage can rise well above rated. The rule
is to size terminal capacitors below the motor's no-load magnetising current,
which keeps the machine below the self-excitation threshold.

## 5.2 Harmonic resonance, the failure mode that surprises people

A capacitor bank does not sit alone. It sits in parallel with the source
inductance seen at that bus, and every parallel LC combination resonates. The
resonant harmonic order is

$$h_{r} = \\sqrt{\\frac{S_{sc}}{Q_{c}}}$$

where S_sc is the short-circuit MVA at the bus (the stiffness of the supply,
computable straight from Section 4 of the per-unit topic as S_base/Z_pu) and
Q_c is the bank rating in MVAR.

**Worked example.** A bus with 150 MVA of short-circuit capacity gets a 6 MVAR
bank:

$$h_{r} = \\sqrt{150/6} = \\sqrt{25} = 5.0$$

Resonance lands exactly on the **5th harmonic**, at 300 Hz on a 60 Hz system —
which is the strongest harmonic produced by six-pulse rectifiers, variable
frequency drives, and most other three-phase power electronics. At resonance
the parallel combination presents a very high impedance to that harmonic
current, so a modest 5th-harmonic injection produces a large 5th-harmonic
voltage. Capacitors fail, fuses blow, and transformers overheat.

| Bank rating | h_r on a 150 MVA bus | Verdict |
|---|---|---|
| 6.0 MVAR | 5.00 | **Directly on the 5th — avoid** |
| 4.0 MVAR | 6.12 | Between the 5th and 7th; acceptable |
| 2.4 MVAR | 7.91 | Close to the 7th; check |

The remedies follow from the formula. Change Q_c to move h_r into a gap
between characteristic harmonics (the odd non-triplen ones: 5th, 7th, 11th,
13th). Or add a small series reactor to each capacitor step, converting the
bank into a **detuned filter** tuned just below the lowest troublesome
harmonic — typically to about the 4.7th — so that it is inductive at the 5th
and cannot resonate with the source.

## 5.3 Sizing in delta versus wye

Section 3.3 sized a delta-connected bank. The wye alternative is worth a line
because it changes the capacitance by a factor of three for the same kVAR. Each
delta unit sees V_LL while each wye unit sees V_LL/√3, and Q per phase is
V²/X_C either way:

| Connection | Voltage per unit | X_C for 92.3 kVAR/phase at 4160 V | C required |
|---|---|---|---|
| Delta | 4160 V | 187.4 Ω | **14.2 μF** per phase |
| Wye | 2402 V | 62.5 Ω | **42.5 μF** per phase |

Three times the capacitance in wye, at one third the voltage rating. The
delta arrangement buys smaller capacitance from more expensive higher-voltage
units; the wye arrangement does the reverse and, when grounded, also provides a
path for zero-sequence and harmonic currents that may or may not be wanted.
Medium-voltage banks are usually wye; low-voltage industrial banks are usually
delta.

## 5.4 Automatic versus fixed banks

A fixed bank is sized for one operating point. Plant load is not one operating
point. Size for full load and the plant runs leading overnight; size for
minimum load and the correction is inadequate when it matters. **Automatic
banks** solve this with contactor-switched steps controlled by a power-factor
relay measuring the incoming feeder, typically in 4 to 8 steps with a target
band around 0.95 lagging.

The switching itself is not free. Energising a capacitor into a bus is closing
a switch onto an uncharged capacitance — the inrush is limited only by the
circuit inductance and can reach many times rated current at a few kilohertz,
which is why capacitor switches carry pre-insertion resistors or inductors and
why back-to-back switching of adjacent steps needs current-limiting reactors.
De-energising is worse: restrike across a parting contact can double or treble
the trapped voltage. These are PE-level details, but the FE-level takeaway is
firm — capacitors are switched devices with transient consequences, not passive
decorations.`,
      examTip: 'The resonance check h_r = √(S_sc/Q_c) is the fastest way to reject a proposed capacitor size. If h_r lands on 5, 7, 11, or 13, the bank will amplify a harmonic the plant almost certainly produces. Move the rating or detune the bank with a series reactor.',
      importantNote: 'For the same kVAR at the same line voltage, a wye-connected bank needs THREE times the capacitance of a delta-connected bank, because each wye unit sees only V_LL/√3 and Q per phase goes as V². Reading "capacitance per phase" from a problem without checking the connection is a reliable way to be wrong by a factor of three.',
    },
  ],
  keyTakeaways: [
    'PF = cos(φ) = P/S; lagging PF (inductive) is the most common industrial issue.',
    'Capacitor sizing: Q_c = P·(tan(θ_old) − tan(θ_new)); P is unchanged by correction.',
    'Lower PF means higher current for the same real power: I = P/(V·PF).',
    'Over-correction risks: voltage rise and harmonic resonance with system inductance.',
    'Synchronous condensers provide continuously variable reactive power support.',
  ],
},

  fee_motors: {
  topicId: 'fee_motors',
  title: 'Rotating Machines: Motors & Generators',
  domainWeight: 'Power Systems · 4–6%',
  overview: 'Rotating machines convert between electrical and mechanical energy. Induction motors dominate industrial loads; synchronous machines control power factor and generate utility power; DC motors offer precise speed/torque control. The FE exam tests slip, synchronous speed, efficiency, and motor characteristics.',
  sections: [
    {
      id: 'motors-induction',
      title: '1. Induction Motors',
      content: `## 1.1 Synchronous Speed and Slip

**Synchronous speed**: **$N_s = 120\\cdot f / P$** (rpm)

where f = supply frequency (Hz), P = number of **poles** (not pole pairs).

| Poles | 60 Hz N_s | 50 Hz N_s |
|---|---|---|
| 2 | 3600 rpm | 3000 rpm |
| 4 | 1800 rpm | 1500 rpm |
| 6 | 1200 rpm | 1000 rpm |
| 8 | 900 rpm | 750 rpm |

**Slip**: **$s = (N_s - N) / N_s$**

- At **no-load**: s ≈ 0 (rotor nearly at synchronous speed)
- At **full load**: s ≈ 0.02–0.05 (2–5%)
- At **starting** (N = 0): s = 1
- At **synchronous speed** (N = N_s): s = 0 (no torque — induction motor cannot run at N_s)

**Rotor frequency**: **$f_{rotor} = s \\cdot f_{line}$**

## 1.2 Torque-Speed Characteristic

- **Starting torque**: moderate to high (design-dependent); inrush current 5–8× rated
- **Breakdown torque**: maximum torque before stalling; typically 2–3× rated torque
- **Operating region**: between no-load and rated slip (linear-ish portion)

### Starting Methods

| Method | Inrush Reduction | Torque Impact |
|---|---|---|
| Direct-on-line (DOL) | None (5–8× I_rated) | Full starting torque |
| Star-delta starter | Reduces to 1/3 | Reduces to 1/3 |
| Soft starter | Variable (2–4×) | Adjustable |
| **VFD** | Minimal (1–1.5×) | Full torque at any speed |

## 1.3 Efficiency and Losses

**$\\eta = P_{mechanical} / P_{electrical}$**

Motor losses:
- **Copper loss** (I²R in stator and rotor windings) — load-dependent
- **Core loss** (hysteresis + eddy current) — voltage-dependent, roughly constant
- **Friction and windage** — speed-dependent, roughly constant
- **Stray load loss** — small, load-dependent`,
      examTip: 'N_s = 120f/P and s = (N_s − N)/N_s are the two most tested motor formulas. A common FE exam question gives a 4-pole, 60 Hz motor running at 1740 rpm and asks for slip: s = (1800 − 1740)/1800 = 0.033 or 3.3%.',
      importantNote: 'P in N_s = 120f/P is the number of POLES, not pole pairs. A 4-pole motor has 2 pole pairs. Some textbooks use pole pairs (p), giving N_s = 60f/p. On the FE exam, the NCEES handbook uses poles, not pole pairs.',
    },
    {
      id: 'motors-synchronous-dc',
      title: '2. Synchronous Machines and DC Motors',
      content: `## 2.1 Synchronous Motors

Synchronous motors run at **exactly N_s** — no slip.

- **Field current** (DC excitation) controls power factor:
  - **Over-excited**: acts as capacitor (generates Q) — used as synchronous condenser
  - **Under-excited**: acts as inductor (absorbs Q)
  - **Normal excitation**: unity power factor

### V-Curve

The V-curve plots armature current I_a vs. field current I_f at constant load:
- Minimum I_a occurs at unity PF
- Left of minimum: under-excited (lagging PF)
- Right of minimum: over-excited (leading PF)

## 2.2 DC Motors

DC motors offer **precise speed and torque control**:

| Type | Speed Control | Torque Characteristic |
|---|---|---|
| **Separately excited** | Armature voltage V_a | τ ∝ I_a (linear torque-current) |
| **Shunt** | Field weakening or V_a | Approximately constant speed |
| **Series** | V_a; never run unloaded! | High starting torque, speed varies with load |

Key relationships:
- **Back-EMF**: E = K·φ·ω (proportional to flux and speed)
- **Torque**: τ = K·φ·I_a
- **Speed**: ω = (V_a − I_a·R_a) / (K·φ)

## 2.3 Motor Selection Guidelines

| Application | Best Motor Type | Reason |
|---|---|---|
| Constant-speed pump/fan | Induction (squirrel cage) | Simple, cheap, reliable |
| Precise speed control | DC or VFD-driven induction | Adjustable speed |
| Power factor correction | Synchronous | Over-excitation generates Q |
| High starting torque (crane) | DC series or wound-rotor induction | Torque profile matches |`,
      examTip: 'Synchronous motors and power factor: over-excited = leading (capacitive), under-excited = lagging (inductive). For DC series motors, NEVER disconnect the load — the motor will overspeed dangerously because torque drops to zero while speed climbs without bound.',
    },
    {
      id: 'motors-torque-curve',
      title: '3. The Torque-Speed Curve from the Circuit Model',
      content: `## 3.1 One equation draws the whole curve

Section 1 described the torque-speed characteristic in words — starting torque,
breakdown torque, an operating region near synchronous speed. All three come
out of a single expression, and deriving them once removes the need to memorise
any of them.

Model one phase of an induction motor as the stator resistance R₁ and total
leakage reactance X in series with the rotor branch, whose resistance appears
in the stator circuit as **R₂/s**. That slip-dependent resistance is the whole
trick of the machine: at standstill (s = 1) the rotor looks like a low
resistance and draws heavy current; near synchronous speed (s → 0) it looks
almost open. Air-gap power is the power delivered to R₂/s, and torque is
air-gap power divided by **synchronous** mechanical speed:

$$T = \\frac{3V_{ph}^{2}(R_{2}/s)}{\\omega _{s}\\left[(R_{1} + R_{2}/s)^{2} + X^{2}\\right]}$$

**Machine used throughout this section:** 460 V, three-phase, 4-pole, 60 Hz,
with R₁ = 0.30 Ω, R₂ = 0.25 Ω, X = 1.20 Ω per phase. Then
V_ph = 460/√3 = 265.6 V, N_s = 120(60)/4 = 1800 rpm, and
ω_s = 2π(60)/2 = 188.5 rad/s.

![Induction motor torque against rotor speed computed from the per-phase circuit model, with slip running from 1 at standstill on the left to 0 at synchronous speed on the right. Torque rises from 161 newton-metres at start to a breakdown value of 365 newton-metres at slip 0.202, then falls steeply and linearly to zero at 1800 rpm; the dashed line is the low-slip linear approximation through the rated point of 123 newton-metres at 1746 rpm.](/courses/fe-ee/figures/pow-motor-torque-speed.svg)

## 3.2 The three landmarks, each in one line

**Starting torque** is the curve at s = 1. Substituting:

$$T_{start} = \\frac{3(265.6)^{2}(0.25)}{188.5\\left[(0.30 + 0.25)^{2} + 1.20^{2}\\right]} = \\mathbf{161.1\\ N{\\cdot}m}$$

**Breakdown torque** is the maximum. Differentiating with respect to R₂/s and
setting the derivative to zero gives the elegant result that maximum torque
occurs when the rotor branch resistance equals the magnitude of everything else
in the loop:

$$s_{max} = \\frac{R_{2}}{\\sqrt{R_{1}^{2} + X^{2}}} = \\frac{0.25}{\\sqrt{0.09 + 1.44}} = \\mathbf{0.202}$$

$$T_{max} = \\frac{3V_{ph}^{2}}{2\\omega _{s}\\left[R_{1} + \\sqrt{R_{1}^{2} + X^{2}}\\right]} = \\mathbf{365.2\\ N{\\cdot}m}$$

Look hard at the T_max expression: **R₂ does not appear in it.** Rotor
resistance sets *where* the peak occurs but not *how high* it is. That single
observation is the entire principle of the wound-rotor motor — insert external
rotor resistance and s_max slides toward 1, moving the same peak torque to
standstill for a high-torque start, then short the rotor out for efficient
running.

**Rated operation** sits at a few percent slip. At s = 0.03, N = 1800(0.97) =
**1746 rpm** and T = **123.1 N·m**.

| Landmark | Slip | Speed | Torque | Ratio to rated |
|---|---|---|---|---|
| Standstill | 1.000 | 0 rpm | 161.1 N·m | 1.31 |
| Breakdown | 0.202 | 1436 rpm | 365.2 N·m | **2.97** |
| Rated | 0.030 | 1746 rpm | 123.1 N·m | 1.00 |
| Synchronous | 0 | 1800 rpm | 0 | 0 |

## 3.3 Why the operating region is a straight line

For small slip, R₂/s is very large compared with R₁ and X, so the bracket in
the denominator is dominated by (R₂/s)² and the whole expression collapses to

$$T \\approx \\frac{3V_{ph}^{2}}{\\omega _{s}R_{2}}\\,s$$

Torque proportional to slip — the dashed line in the figure, which tracks the
exact curve closely from synchronous speed down to about 15 percent slip before
diverging. Three consequences the exam uses:

1. **Slip is proportional to load.** Double the shaft torque and the slip doubles, so speed drops by twice as much below synchronous. An induction motor is an almost-constant-speed machine only because rated slip is small.
2. **Torque goes as V².** A 10 percent voltage sag costs 19 percent of torque, at every slip. This is the same V² that made the motor-starting dip of the per-unit topic matter.
3. **The stable operating region is the steep part.** On the right of the breakdown point, extra load increases slip which increases torque — the machine finds a new equilibrium. On the left, extra load increases slip which *decreases* torque, so the machine decelerates further and stalls. Breakdown torque is the boundary of stability, not merely a number on a datasheet.

## 3.4 Starting current and what starting methods trade

The same circuit at s = 1 gives the starting current:

$$I_{start} = \\frac{V_{ph}}{|R_{1} + R_{2} + jX|} = \\frac{265.6}{|0.55 + j1.20|} = \\mathbf{201.2\\ A}$$

against a rated current (computed in Section 4) of 30.5 A — a ratio of
**6.6 to 1**, right in the usual 5-to-8 band. Because both current and torque
depend on the applied voltage, and torque depends on its square, every
reduced-voltage starting method trades them at a fixed exchange rate:

| Method | Voltage at motor | Starting current | Starting torque |
|---|---|---|---|
| Direct on line | 1.00 | 201 A (6.6×) | 161 N·m (100%) |
| Star-delta | 1/√3 | 67 A (1/3) | 54 N·m (**1/3**) |
| Autotransformer, 65% tap | 0.65 | 85 A (0.42×) | 68 N·m (42%) |
| Soft starter, 70% | 0.70 | 141 A (0.70×) | 79 N·m (49%) |
| VFD | reduced V **and** f | ~1.1× rated | full torque available |

Star-delta halves nothing — it thirds both, because delta-to-star reduces phase
voltage by √3, hence current by √3 in each winding and by 3 in the line, and
torque by the square. The VFD is the outlier because it reduces frequency along
with voltage, holding V/f roughly constant so the air-gap flux stays at its
design value and full torque remains available from zero speed. That is why
VFDs displaced every other starting method wherever the capital cost can be
justified.`,
      examTip: 'Breakdown torque does not depend on rotor resistance — only its slip location does. So a question that adds external rotor resistance to a wound-rotor motor is asking you to slide s_max, not to change T_max. And torque always scales with V², which converts any stated voltage sag into a torque loss in one step.',
      importantNote: 'The stable operating region is between zero slip and breakdown slip, where the torque-speed curve is steep and falling. Operating on the other side of the peak is unstable: an increase in load reduces the torque produced, and the motor stalls. This is why the breakdown torque must exceed the peak load torque with margin, not merely equal it.',
    },
    {
      id: 'motors-power-flow',
      title: '4. Induction Motor Power Flow: A Complete Worked Machine',
      content: `## 4.1 The power flow diagram as arithmetic

Every induction motor question that asks for efficiency, output horsepower, or
rotor losses is walking down the same chain. Electrical power in, minus stator
copper and core losses, is **air-gap power** P_ag. The air gap splits that power
in a fixed ratio set by slip alone:

$$P_{rotor\\,cu} = sP_{ag}, \\qquad P_{mech,\\,developed} = (1-s)P_{ag}$$

Subtract friction and windage and you have shaft output. The slip split is the
part worth internalising: **slip is the fraction of air-gap power that is
thrown away as rotor heat.** A motor running at 3 percent slip converts
97 percent of the air-gap power to mechanical form; one running at 50 percent
slip — a fan starting, or a badly matched load — is dissipating half of it in
the rotor bars, which is why prolonged starting cooks rotors.

## 4.2 The full calculation for the Section 3 machine

Same machine, at s = 0.03. First the stator current:

$$I = \\frac{V_{ph}}{(R_{1} + R_{2}/s) + jX} = \\frac{265.6}{(0.30 + 8.333) + j1.20} = 30.47\\angle -7.91^\\circ\\ \\mathrm{A}$$

The angle is small because R₂/s = 8.333 Ω dominates the 1.20 Ω of reactance at
this slip, so the power factor is 0.990 — high, as it should be for a loaded
motor. Now walk the chain:

| Step | Expression | Value |
|---|---|---|
| Input power | $3V_{ph}I\\cos \\phi$ | 24,045 W |
| Stator copper loss | $3I^{2}R_{1}$ | 836 W |
| Air-gap power | $3I^{2}(R_{2}/s)$ | 23,210 W |
| Rotor copper loss | $sP_{ag}$ | 696 W |
| Developed mechanical power | $(1-s)P_{ag}$ | **22,513 W = 30.2 hp** |
| Efficiency (core, friction neglected) | $P_{mech}/P_{in}$ | **93.6%** |

Two independent checks confirm the torque of Section 3. Torque from developed
power and *actual* speed, ω_m = 188.5(0.97) = 182.8 rad/s:

$$T = \\frac{22{,}513}{182.8} = 123.1\\ \\mathrm{N{\\cdot}m}$$

Torque from air-gap power and *synchronous* speed:

$$T = \\frac{P_{ag}}{\\omega _{s}} = \\frac{23{,}210}{188.5} = 123.1\\ \\mathrm{N{\\cdot}m}$$

Both routes agree, and the second explains why torque is defined against
synchronous speed: the (1 − s) that converts P_ag to P_mech is exactly
cancelled by the (1 − s) that converts ω_s to ω_m.

## 4.3 The nameplate, decoded

A motor nameplate is a compressed version of everything above.

| Nameplate field | What it fixes | Worked value here |
|---|---|---|
| Voltage, phases, frequency | V_ph and ω_s | 460 V, 3-phase, 60 Hz |
| Rated speed (rpm) | Rated slip, via N_s = 120f/P | 1746 rpm → s = 0.030 |
| Horsepower | Shaft output at rated slip | 30 hp |
| Full-load amperes | Thermal sizing of conductors and overloads | 30.5 A |
| Service factor | Permitted continuous overload | 1.15 typical |
| NEMA design letter | Shape of the torque-speed curve | B: normal torque, normal starting current |
| Code letter | Locked-rotor kVA per horsepower | Sets the inrush a supply must tolerate |

The rated-speed field is the one most often used on the exam, because it
back-solves the slip. A nameplate reading 1746 rpm on a 60 Hz supply tells you
immediately that the machine has 4 poles (1800 is the only synchronous speed
just above 1746) and that rated slip is (1800 − 1746)/1800 = 3.0 percent.

The **NEMA design letters** are worth recognising because a question may name
one:

| Design | Starting torque | Starting current | Rated slip | Typical load |
|---|---|---|---|---|
| A | High | High | < 5% | Machine tools |
| **B** | Normal (~150%) | Normal | < 5% | General purpose: pumps, fans |
| C | High (~200%) | Normal | < 5% | Loaded-start conveyors, compressors |
| D | Very high (~275%) | Low | 5–13% | Punch presses, hoists, high-inertia |

Design D buys its enormous starting torque by adding rotor resistance — which,
per Section 3, slides s_max toward standstill — and pays for it with permanent
slip losses at rated load. There is no free torque in an induction machine;
there is only rotor resistance moved around.

## 4.4 Rotor frequency and why it matters

The rotor sees a field rotating past it at the slip speed, so currents induced
in the rotor bars are at

$$f_{rotor} = sf_{line} = 0.03 \\times 60 = 1.8\\ \\mathrm{Hz}$$

Two things follow. Rotor iron losses are negligible in normal running, because
core loss climbs with frequency and 1.8 Hz is nearly DC. And rotor frequency is
a direct, measurable proxy for slip — which is how slip is determined
experimentally on machines whose speed is inconvenient to measure. At
standstill f_rotor is the full 60 Hz, and the rotor iron is then working hard,
another reason locked-rotor conditions are thermally severe.`,
      examTip: 'Rotor copper loss is s·P_ag and developed mechanical power is (1 − s)·P_ag — memorise the split, not a list of separate formulas. And torque can be found as P_ag/ω_s (synchronous speed) or P_mech/ω_m (actual speed); the two are identical, so use whichever quantity the problem hands you.',
      importantNote: 'Rated slip back-solves from the nameplate speed, and the nameplate speed also identifies the pole count: the synchronous speed is always the next standard value above it (3600, 1800, 1200, 900 rpm at 60 Hz). A motor plated 1746 rpm is a 4-pole machine at 3.0 percent slip, and that one deduction unlocks most nameplate problems.',
    },
    {
      id: 'motors-sync-dc-worked',
      title: '5. Synchronous and DC Machines, Quantitatively',
      content: `## 5.1 The synchronous machine phasor equation

Section 2 described excitation control in words. The equation behind it is a
single KVL loop around the per-phase equivalent circuit, where the machine is
an internal EMF E (proportional to field current and speed) behind the
synchronous reactance X_s. For a **motor**, with current drawn into the
machine:

$$\\mathbf{E} = \\mathbf{V} - jX_{s}\\mathbf{I}_{a}$$

The magnitude of E is set by the DC field current; the angle δ between E and V
is set by the shaft load. Real power transferred is the same power-angle
relation the transmission-lines topic derived, because it is the same physics —
a voltage source behind a reactance feeding another voltage source:

$$P = \\frac{3VE}{X_{s}}\\sin \\delta$$

**Worked example.** A 480 V, three-phase synchronous motor with X_s = 2.0 Ω per
phase drives a constant load of 33.26 kW. V_ph = 277.1 V. Vary the field current
and hold the shaft load fixed:

| Excitation | I_a | E per phase | E line-to-line | δ | Reactive delivered to bus |
|---|---|---|---|---|---|
| Under-excited | 50.0 A at 0.8 lag | 231.4 V | 401 V | −20.2° | **−24.9 kVAR** (absorbs) |
| | 44.4 A at 0.9 lag | 251.4 V | 436 V | −18.6° | −16.1 kVAR |
| **Normal** | **40.0 A at 1.0** | **288.4 V** | **500 V** | −16.1° | **0** |
| | 44.4 A at 0.9 lead | 325.8 V | 564 V | −14.2° | +16.1 kVAR |
| Over-excited | 50.0 A at 0.8 lead | 346.5 V | 600 V | −13.4° | **+24.9 kVAR** (supplies) |

That table **is** the V-curve, in numbers. Armature current bottoms out at
40.0 A when the power factor is unity and rises to 50.0 A on either side of it,
tracing the V shape the section title refers to. Verify the middle row: with
unity power factor, I_a = P/(3V_ph) = 33,256/(3 × 277.1) = 40.0 A, and
E = 277.1 − j(2.0)(40.0) = 288.4∠−16.1° V.

Three readings of the table:

- **The load angle never changed much** (13° to 20°) while the reactive output swung 50 kVAR. Excitation is a reactive-power control, not a real-power control.
- **Over-excitation means E exceeds V.** At 0.8 leading, E is 600 V line against a 480 V bus — the machine is "pushing harder" than the system, so it exports reactive power. Under-excited, E is only 401 V and it imports.
- **Pull-out torque scales with E.** The maximum of the power-angle equation is 3VE/X_s, which for the over-excited row is 144 kW — over four times the actual load. Reduce the field and that margin shrinks with it, which is why a synchronous machine is never run at minimum excitation when the load is variable.

A synchronous machine running over-excited with **no** mechanical load at all is
a **synchronous condenser**: δ ≈ 0, P ≈ 0, and a continuously adjustable
reactive output. It is a rotating capacitor bank whose output can be trimmed by
turning a field rheostat, and unlike a capacitor its reactive output does not
collapse when the system voltage sags — a distinction that matters during
disturbances.

## 5.2 DC machines, quantitatively

The two DC machine equations were stated in Section 2. Applied together they
solve every FE-level DC motor problem:

$$E = K\\phi \\omega , \\qquad T = K\\phi I_{a}, \\qquad V_{a} = E + I_{a}R_{a}$$

**Worked example.** A separately excited DC motor runs from 240 V with
R_a = 0.5 Ω, drawing I_a = 40 A at 1200 rpm.

- Back-EMF: **$E = 240 - 40(0.5) = 220\\ \\mathrm{V}$**
- Angular speed: ω = 2π(1200)/60 = 125.7 rad/s
- Machine constant: **$K\\phi = 220/125.7 = 1.751\\ \\mathrm{V{\\cdot}s/rad}$**
- Torque: **$T = 1.751 \\times 40 = 70.0\\ \\mathrm{N{\\cdot}m}$**
- Developed power: **$EI_{a} = 220 \\times 40 = 8{,}800\\ \\mathrm{W} = 11.8\\ \\mathrm{hp}$**
- Armature loss: 40²(0.5) = 800 W; efficiency 8,800/9,600 = **91.7%**

Note that Kφ carries units of V·s/rad and of N·m/A simultaneously — they are
the same unit, which is the mathematical statement that the machine converts
power without preference for direction. That identity is the fastest check on a
DC machine answer: if T/I_a does not equal E/ω, something is wrong.

Now use the same constant to answer the two control questions:

| Change | Calculation | Result |
|---|---|---|
| Load halved to I_a = 20 A | E = 240 − 10 = 230 V; N = 230/1.751 × 60/2π | **1255 rpm** — speed rises 4.5% |
| Field weakened 20% (Kφ → 1.401) | N = 220/1.401 × 60/2π | **1500 rpm**, but T = 1.401 × 40 = 56.0 N·m |

The first row is the shunt/separately-excited machine's near-constant-speed
behaviour: speed changed by under 5 percent for a 50 percent load change,
because the only thing that moved was the small I_a R_a drop. The second is
**field weakening** — the standard way to run a DC machine above base speed,
buying speed at a proportional cost in available torque, which is why DC drives
are described as constant-torque below base speed and constant-power above it.

## 5.3 Choosing among the three machine families

| Requirement | Machine | Because |
|---|---|---|
| Cheapest constant-speed drive | Squirrel-cage induction | No brushes, no slip rings, no field supply |
| Exact speed, independent of load | Synchronous | Runs at N_s or not at all |
| Reactive support alongside a load | Synchronous, over-excited | Field current sets Q independently of P |
| High starting torque, low starting current | Wound-rotor induction, or design D | External rotor resistance moves s_max to 1 |
| Wide, precise speed range | VFD-driven induction, or DC | Constant V/f, or armature voltage control |
| Constant power above base speed | DC with field weakening | Kφ reduced, ω rises at fixed V_a |

The row that generates exam questions is the third. A plant with a large
synchronous motor can run it over-excited and correct the whole facility's
power factor with a machine it needed anyway — the same reactive compensation
the power factor correction topic buys with capacitors, obtained for the cost of
a slightly larger field winding and some extra armature current.`,
      examTip: 'For a synchronous machine, over-excited (E > V) means leading current and reactive power EXPORTED; under-excited (E < V) means lagging current and reactive power imported. For a DC machine, always find the back-EMF first from E = V_a − I_a·R_a — every other quantity follows from it through Kφ = E/ω.',
      importantNote: 'Kφ has units of both V·s/rad and N·m/A, and the two numerical values are identical for any given machine. Checking that T/I_a equals E/ω is a free verification on every DC machine problem, and it catches the most common error — using rpm where rad/s is required, which is off by a factor of 9.55.',
    },
  ],
  keyTakeaways: [
    'Synchronous speed: N_s = 120f/P; slip: s = (N_s − N)/N_s.',
    'Induction motor full-load slip is 2–5%; rotor frequency = s × f_line.',
    'Synchronous motor speed = N_s exactly; field current controls PF.',
    'DC motor: E = Kφω, τ = KφI_a; series motor has high starting torque but must never run unloaded.',
    'Motor efficiency η = P_mech/P_elec; losses = copper + core + friction/windage.',
    'VFDs provide soft starting and variable-speed operation with minimal inrush.',
  ],
},

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 11 — ELECTROMAGNETICS  (5 curriculum IDs)
   * ────────────────────────────────────────────────────────────────── */

fee_power_faults: {
  topicId: 'fee_power_faults',
  title: `Fault Analysis & Symmetrical Components`,
  domainWeight: 'Power Systems · 4–6%',
  overview: `Fault analysis is essential to power system design — sizing circuit breakers, selecting protective relays, evaluating equipment damage. The FE exam tests recognition and basic calculation of three-phase faults, single-line-to-ground faults, line-to-line faults, and double-line-to-ground faults. Symmetrical components (positive, negative, zero sequence) provide the mathematical framework to handle unbalanced faults systematically. This topic was identified as a gap in the platform's existing power systems coverage.`,
  sections: [
    {
      id: 'fault-types',
      title: `1. The Four Fault Types and Their Frequency`,
      content: `## 1.1 The classification

Power system faults are classified by which phases and ground are involved:

| Fault type | Symbol | Phases involved | Approximate frequency |
|---|---|---|---|
| Three-phase fault (balanced) | $3\\phi or LLL$ | All three phases short-circuited | ~5% |
| Three-phase to ground | $3\\phi G$ | All three phases to ground | ~5% |
| Single-line-to-ground | SLG or LG | One phase to ground | ~70% |
| Line-to-line | LL | Two phases short-circuited | ~15% |
| Double-line-to-ground | LLG or DLG | Two phases to ground | ~5% |

So ~70% of all power system faults are SINGLE-LINE-TO-GROUND. Three-phase faults are rare but produce the highest fault currents (used for circuit breaker rating).

## 1.2 Symmetric vs asymmetric

- **Three-phase fault**: symmetric in all three phases. Can be analyzed as a single-phase equivalent.
- **All other faults**: asymmetric. Phases see different voltages and currents. Requires symmetrical components for analysis.

## 1.3 The fault current

When a fault occurs, the impedance from source to fault drops dramatically (often to a small fraction of normal load impedance). Current surges to many times normal:

- Pre-fault current: ~1.0 per-unit (normal load)
- Fault current: 5-30 per-unit, depending on fault type and location

The fault current is determined by:
- The source voltage (typically nominal system voltage)
- The TOTAL impedance from source to fault (transformer impedance, line impedance, generator subtransient impedance, etc.)

## 1.4 Why faults matter

- **Equipment damage**: thermal and magnetic forces increase as I². A 20× current = 400× heating power. Brief faults can melt conductors.
- **System stability**: voltage collapse, generator pole slip
- **Personnel safety**: arc flash hazard, electrocution
- **Circuit breaker rating**: breakers must INTERRUPT the maximum possible fault current

Engineers must KNOW THE FAULT CURRENT at every point in the system to:
- Size circuit breakers (interrupting capacity ≥ max fault current)
- Set protective relays (pickup current, time delays)
- Calculate ground grid potentials (touch and step voltages)
- Determine equipment short-circuit ratings`,
      examTip: `Three-phase fault is rare but PRODUCES the HIGHEST CURRENT. Use 3φ fault current for circuit breaker rating. SLG is most common (70%) but typically lower current than 3φ.`,
    },
    {
      id: 'symmetrical-components',
      title: `2. Symmetrical Components Decomposition`,
      content: `## 2.1 The motivation

For unbalanced systems (and asymmetric faults), analyzing each phase separately is messy. The elegant trick: any unbalanced three-phase set can be decomposed into three BALANCED sets called symmetrical components.

## 2.2 The three sequences

Any set of three phasors V_a, V_b, V_c can be written as the SUM of three balanced sequence components:

1. **Positive sequence (a-b-c rotation)**: V_a1, V_b1 = a²·V_a1, V_c1 = a·V_a1
2. **Negative sequence (a-c-b rotation)**: V_a2, V_b2 = a·V_a2, V_c2 = a²·V_a2
3. **Zero sequence (all equal)**: V_a0 = V_b0 = V_c0

Where a = 1∠120° = -0.5 + j0.866 (the cube root of unity).

So:
  $$V_a = V_a0 + V_a1 + V_a2$$
  $$V_b = V_a0 + a^{2}\\cdot V_a1 + a\\cdot V_a2$$
  $$V_c = V_a0 + a\\cdot V_a1 + a^{2}\\cdot V_a2$$

In matrix form:
  [V_a]   [1  1   1 ]   [V_a0]
  $$[V_b] = [1 a^{2} a] \\times [V_a1]$$
  $$[V_c] [1 a a^{2}] [V_a2]$$

The inverse (decompose phase quantities into sequence quantities):
  [V_a0]       [1  1   1 ]   [V_a]
  $$[V_a1] = \\tfrac{1}{3} \\times [1 a a^{2}] \\times [V_b]$$
  $$[V_a2] [1 a^{2} a] [V_c]$$

## 2.3 Physical interpretation

- **Positive sequence**: balanced three-phase set with normal a-b-c rotation. Represents the system in normal operation. This is what generators and motors are designed for.
- **Negative sequence**: balanced set with REVERSED rotation. Created by unbalanced loads or faults. Causes heating in rotating machines (induces opposing torque + double-frequency currents in rotor).
- **Zero sequence**: three phasors of equal magnitude and angle. Returns through ground or neutral. Created by ground faults.

## 2.4 Sequence impedance networks

Each sequence has its own equivalent impedance network for any component:

- **Generator/motor**: Z_1 (positive sequence, often the subtransient impedance X_d''), Z_2 (negative sequence, typically Z_2 ≈ Z_1 for synchronous machines), Z_0 (zero sequence, depends on neutral grounding)
- **Transformer**: depends on winding configuration (Y-Y, Y-Δ, Δ-Δ); Z_1 = Z_2 = Z_0 = leakage impedance for Y-Y; zero sequence may not pass through Δ at all
- **Transmission line**: Z_1 = Z_2 typically; Z_0 ≈ 3× Z_1 due to ground return path

For fault calculations, you build THREE separate networks (one per sequence) and combine them based on the fault type.

## 2.5 Fault analysis using sequence networks

For each fault type, the three sequence networks are interconnected in a specific way:

### Three-phase fault (3φ)
Only positive-sequence network is involved. No negative or zero sequence (perfectly balanced fault).
  I_a1 = V_pre-fault / Z_1
  Phase currents: I_a = I_a1, I_b = a²·I_a1, I_c = a·I_a1

### Single-line-to-ground (SLG) fault
All three sequence networks connected IN SERIES.
  I_a1 = I_a2 = I_a0 = V_pre-fault / (Z_1 + Z_2 + Z_0 + 3·Z_f)
  where Z_f is the fault impedance (often 0 for bolted fault)
  Phase A current: I_a = 3·I_a1; Phases B and C: I_b = I_c = 0

### Line-to-line (LL) fault (phases B and C)
Positive and negative sequence networks in PARALLEL; zero sequence not involved.
  I_a1 = -I_a2 = V_pre-fault / (Z_1 + Z_2 + Z_f)
  Phase currents: I_a = 0, I_b = -I_c, with specific calculations

### Double-line-to-ground (LLG) fault
Positive in series with parallel combination of negative and zero sequences.
  More complex; requires specific formulas.

## 2.6 Negative-sequence damage

For rotating machines, negative-sequence current creates rotor heating (double-frequency currents in rotor). Generators are typically rated for a MAXIMUM negative-sequence current of 5-10% of rated for continuous operation. Larger negative-sequence currents trigger protective relays.

This is one reason why prolonged unbalanced operation (e.g., single-phasing) damages motors and generators.

## 2.7 Zero-sequence and grounding

Zero-sequence current can only flow if there's a RETURN PATH — typically through ground or a neutral conductor.

- **Solidly grounded systems**: low zero-sequence impedance → large ground-fault currents → fast tripping, but high arc-flash energy
- **Resistance grounded systems**: limited ground-fault current → reduced damage but more complex protection
- **Ungrounded systems**: NO zero-sequence path → tiny ground-fault currents but voltage rise on healthy phases
- **Δ-connected systems**: NO neutral, so no zero-sequence path → ground faults don't trip overcurrent devices easily

This affects fault analysis: in ungrounded systems, the "single-line-to-ground" fault current is very small but the OTHER PHASES see overvoltage.`,
      examTip: `For SLG fault: I_fault = 3·V/(Z_1 + Z_2 + Z_0). For LL fault: I_fault relates to Z_1 + Z_2. For 3φ fault: I_fault = V/Z_1 only. Three-phase fault formula is the simplest because it's purely balanced.`,
    },
    {
      id: 'practical-calculations',
      title: `3. Per-Unit System and Practical Fault Calculations`,
      content: `## 3.1 The per-unit (p.u.) system

Power systems use per-unit normalization extensively because it simplifies analysis with transformers (per-unit values are the same on both sides of an ideal transformer) and makes impedances comparable across voltage levels.

Define BASE QUANTITIES:
- Base power S_base (typically 100 MVA system base)
- Base voltage V_base (different at each voltage level)
- Base current I_base = S_base / (√3 · V_base) for three-phase
- Base impedance Z_base = V_base² / S_base

Then per-unit value = actual value / base value.

## 3.2 Per-unit fault current formula

For a three-phase fault at a bus with Thevenin equivalent impedance Z_th (per-unit):

  I_fault (p.u.) = V_pre-fault (p.u.) / Z_th (p.u.)

For pre-fault voltage of 1.0 p.u. (rated voltage):

  $$I_{fault} (p.u.) = 1.0 / Z_{th}$$

To convert to amperes:
  $$I_{fault} (A) = I_{fault} (p.u.) \\times I_{base} = 1.0 / Z_{th} \\times (S_{base} / (\\sqrt{3} \\cdot V_{base}))$$

## 3.3 Worked example

Three-phase fault at bus B in a system:
- Base: S_base = 100 MVA, V_base = 138 kV
- Thevenin impedance to bus B: Z_th = 0.10 p.u.

Per-unit fault current: I_f (p.u.) = 1.0 / 0.10 = 10 p.u.

$$I_{base} = 100 \\times 10^{6} / (\\sqrt{3} \\cdot 138 \\times 10^{3}) = 418\\ \\mathrm{A}$$

I_fault (actual) = 10 × 418 = 4,180 A

Fault MVA = V × I = 1.0 × 10 = 10 p.u. = 1000 MVA at the fault bus

Circuit breakers at bus B must have interrupting capacity ≥ 1000 MVA at 138 kV class.

## 3.4 Subtransient, transient, and steady-state reactance

Generator reactance changes over time during a fault:

- **Subtransient X_d''** (first ~3-5 cycles): smallest reactance → largest fault current
- **Transient X_d'** (next ~30-100 cycles): medium reactance → medium fault current
- **Synchronous X_d** (steady state): largest reactance → smallest sustained fault current

Use X_d'' for circuit-breaker INTERRUPTING duty (fast-acting breakers see the highest current). Use X_d' for slower devices. Use X_d for steady-state analysis.

For 138 kV bulk power systems, typical X_d'' ≈ 0.15-0.25 p.u., X_d ≈ 1.0-2.0 p.u.

## 3.5 Transformer impedance and fault current

A transformer with impedance Z_T (per-unit on transformer base) will REDUCE the fault current on the secondary side because of its impedance.

If a transformer has Z_T = 0.10 p.u. and is connected between source and fault:

  Z_total = Z_source + Z_T (both expressed on same base)

The transformer is the largest impedance in many systems and is the PRIMARY current-limiting element for downstream faults.

## 3.6 Asymmetric vs symmetric fault current

Immediately after fault inception, there's a DC offset in the fault current due to the inductive nature of the impedance — the current cannot change instantaneously. The TOTAL momentary current can be UP TO 1.6-1.8× the symmetric RMS current, depending on the X/R ratio.

For circuit breaker rating:
- **Symmetric RMS interrupting current**: what the breaker is rated to interrupt
- **Asymmetric RMS or PEAK current**: the breaker must withstand mechanically without damage

Modern breaker specifications include both.

## 3.7 Quick exam approach

For typical FE fault problems:

1. **Identify fault type** (3φ, SLG, LL, LLG)
2. **Identify relevant impedances** (Z_1 always; Z_2 for non-3φ; Z_0 for ground faults)
3. **Apply the fault formula** for that type
4. **Convert to actual current** using base current

For 3φ faults (most common exam type):
  I_fault (p.u.) = 1.0 / Z_1 (Thevenin per unit)
  $$I_{fault} (kA) = I_p.u. \\times I_{base}$$

For SLG faults:
  $$I_{fault} (p.u.) = 3 / (Z_1 + Z_2 + Z_0)$$
  (assuming bolted fault, pre-fault voltage 1.0 p.u.)

## 3.8 Protective relay coordination

A power system has many protective devices (breakers, fuses, reclosers). Coordination ensures the DEVICE CLOSEST TO THE FAULT operates first, isolating the smallest area:

- Each device has a time-current characteristic (TCC)
- Downstream device must clear faster than upstream
- Typical coordination margin: 0.3 seconds between devices

This is more PE-level material; FE may test recognition that protective relays must be coordinated.

## 3.9 Arc-flash analysis

Modern fault analysis includes ARC FLASH calculations — the energy released in an arcing fault that can injure personnel:

  Incident energy (cal/cm²) ∝ I_fault² × t_clear × Distance⁻²

Where t_clear is the time for protective devices to clear the fault. NFPA 70E and IEEE 1584 provide the calculation framework.

FE may test recognition that:
- Arc flash energy depends on fault current AND fault duration
- Faster-clearing protective devices REDUCE arc flash energy
- Personnel protective equipment (PPE) is rated by incident energy level`,
      examTip: `Per-unit base impedance: Z_base = V_base² / S_base. Per-unit fault current for 3φ: I_fault = 1.0 / Z_th. Convert to amperes using I_base = S_base / (√3·V_base). For SLG: I_fault = 3/(Z_1+Z_2+Z_0).`,
    },
    {
      id: 'fault-duty-asymmetry',
      title: `4. Fault Duty, DC Offset, and Breaker Ratings`,
      content: `## 4.1 Which fault is worst is not a fixed answer

Section 1 said the three-phase fault produces the highest current. That is the
usual case, not a law, and the sequence formulas of Section 2 say exactly when
it fails. Compare the two currents at the same bus with 1.0 pu pre-fault
voltage:

$$I_{3\\phi } = \\frac{1}{Z_{1}}, \\qquad I_{SLG} = \\frac{3}{Z_{1} + Z_{2} + Z_{0}}$$

Setting them equal and using Z₂ = Z₁ gives the crossover condition
**Z₀ = Z₁**. So:

| Zero-sequence impedance | Which fault is larger | Physical situation |
|---|---|---|
| Z₀ > Z₁ | Three-phase | Typical: line ground return raises Z₀ to about 3Z₁ |
| Z₀ = Z₁ | Equal | The boundary case |
| **Z₀ < Z₁** | **Single-line-to-ground** | Close to a solidly grounded delta-wye transformer |

| Case (pu) | 3φ | SLG | LL |
|---|---|---|---|
| Z₁ = Z₂ = 0.15, Z₀ = 0.30 | 6.67 | 5.00 | 5.77 |
| Z₁ = Z₂ = 0.15, Z₀ = 0.15 | 6.67 | 6.67 | 5.77 |
| Z₁ = Z₂ = 0.20, Z₀ = 0.10 | 5.00 | **6.00** | 4.33 |

The line-to-line column never leads, and its ratio to the three-phase value is
constant: **$I_{LL}/I_{3\\phi } = \\sqrt{3}/2 = 0.866$** whenever Z₂ = Z₁. That
fixed ratio is worth memorising — it converts a three-phase answer into a
line-to-line answer with one multiplication, and it is a fast way to reject a
distractor.

**Worked example.** At a 13.8 kV bus on a 100 MVA base with Z₁ = Z₂ = 0.15 and
Z₀ = 0.30 pu, I_base = 4,184 A, so the three-phase fault is 6.67 × 4,184 =
**27.9 kA** (666.7 MVA) and the ground fault is 5.00 × 4,184 = **20.9 kA**.
Switchgear here is selected against the 27.9 kA figure; the ground relay is set
against the 20.9 kA one.

## 4.2 The DC offset, and why breakers have two ratings

Everything above is the **symmetric** current — the steady sinusoid. The
instant a fault strikes, current in an inductive circuit cannot jump, so a
decaying DC component appears to enforce continuity from whatever the
pre-fault current was. It is largest when the fault initiates at a voltage
zero, and it decays with the circuit time constant

$$\\tau = \\frac{L}{R} = \\frac{X}{\\omega R}$$

For X/R = 10 on a 60 Hz system, τ = 10/377 = **26.5 ms** — about 1.6 cycles.

![Fault current with maximum DC offset for a circuit with X over R equal to 10, in multiples of the symmetric peak. The symmetric sine wave, the decaying exponential offset with a 26.5 millisecond time constant, and their sum are drawn together; the asymmetric total reaches 1.73 times the symmetric peak at the first crest, roughly half a cycle after inception, and settles onto the symmetric wave within about five cycles.](/courses/fe-ee/figures/pow-fault-asymmetry.svg)

The figure is the sum of two elementary functions, and reading it in that order
makes the standard breaker terminology obvious. Half a cycle after inception
the sine has reached its first peak and the exponential has decayed only to
exp(−πR/X) of its initial value, so the crest is

$$\\frac{i_{peak}}{i_{sym,peak}} = 1 + e^{-\\pi R/X} = 1 + e^{-\\pi /10} = \\mathbf{1.73}$$

| X/R | τ (60 Hz) | Half-cycle peak factor | Asymmetric RMS factor |
|---|---|---|---|
| 2 | 5.3 ms | 1.21 | 1.04 |
| 5 | 13.3 ms | 1.53 | 1.25 |
| **10** | **26.5 ms** | **1.73** | **1.44** |
| 15 | 39.8 ms | 1.81 | 1.52 |
| 25 | 66.3 ms | 1.88 | 1.60 |
| 40 | 106.1 ms | 1.92 | 1.65 |

The theoretical ceiling is 2.0 as X/R goes to infinity, and it is approached
slowly — a purely reactive circuit would never shed the offset at all. The
peak column is the half-cycle formula above; the true maximum occurs a little
before the half cycle and is higher by a few thousandths, which is why the
figure's numerically located peak and the formula agree to two decimals. The
asymmetric RMS column uses **$\\sqrt{1 + 2e^{-2\\pi R/X}}$**, the RMS of the
combined wave over the first half cycle, and it is the multiplier applied to
symmetric RMS current when a momentary duty is quoted in RMS.

Expressed against the symmetric **RMS** current rather than the peak, the crest
factor at X/R = 10 is √2 × 1.73 = **2.45**, which is where the familiar
"peak duty is about 2.6 times symmetric RMS" rule of thumb comes from at the
higher X/R ratios of large substations.

| Rating | What it means | Governing quantity |
|---|---|---|
| **Momentary / close-and-latch** | The breaker must close onto and mechanically survive this current without contacts welding or bracing deforming | Asymmetric peak, first cycle |
| **Interrupting** | The breaker must extinguish the arc and clear at this current after its contact-parting time | Symmetric RMS, sometimes with an asymmetry factor for X/R above 17 |
| **Short-time withstand** | The bus and breaker must carry this current for a stated duration (1 or 3 s) | I²t heating |

A breaker that can interrupt 25 kA symmetric faces 25 × 2.45 = **61 kA** of
peak current in the first cycle on a bus with X/R = 10. The two ratings answer different physical questions — one is about arc
extinction, the other about magnetic forces between conductors, which go as
current squared and reach tonnes per metre at these levels.

## 4.3 Time, and the generator that is not a constant source

Section 3.4 listed the three generator reactances. Put them on the same time
axis as the DC offset and the whole fault waveform makes sense:

| Interval | Generator reactance | What dominates |
|---|---|---|
| 0 to ~2 cycles | X″_d (0.15–0.25 pu) | DC offset plus subtransient current: the momentary peak |
| ~2 cycles to a few tenths of a second | X′_d (0.2–0.4 pu) | Interrupting duty, after contacts part |
| Beyond ~1 s | X_d (1.0–2.0 pu) | Sustained current the relays must still detect |

The envelope decays because the flux linking the damper windings and then the
field winding decays. Sustained fault current from a generator can fall to
**less than its own rated current**, which is why generator protection cannot
rely on overcurrent alone and uses differential and voltage-restrained
elements.

The thermal consequence is the **I²t** integral. A 20 pu fault cleared in
0.1 s deposits 20² × 0.1 = 40 pu²·s of energy; the same fault cleared in 0.5 s
deposits 200 — five times as much for a delay a person could not perceive.
Halving clearing time is worth more than halving fault current, and it is the
reason arc-flash mitigation focuses on faster tripping rather than on impedance.`,
      examTip: `Three-phase is NOT always the worst fault: single-line-to-ground exceeds it whenever Z₀ < Z₁, which happens near a solidly grounded delta-wye transformer. And the line-to-line current is always √3/2 = 0.866 of the three-phase value when Z₂ = Z₁, so one multiplication converts between them.`,
      importantNote: `A breaker carries two distinct current ratings and they answer different questions. Momentary (close-and-latch) duty is the ASYMMETRIC first-cycle peak and is a mechanical limit; interrupting duty is the SYMMETRIC RMS at contact parting and is an arc-extinction limit. Quoting one where the other is required understates the requirement by a factor approaching 2.6.`,
    },
  ],
  keyTakeaways: [
    'Four fault types: 3φ (rare but highest current — used for breaker rating), SLG (most common at ~70%), LL, LLG',
    'Symmetrical components: any unbalanced 3-phase set = sum of positive (a-b-c), negative (a-c-b), and zero (all equal) sequences',
    '3φ fault uses only positive sequence: I_f = V/Z_1. SLG uses all three in series: I_f = 3V/(Z_1+Z_2+Z_0). LL uses Z_1+Z_2.',
    'Per-unit system: Z_base = V_base² / S_base. I_base = S_base / (√3·V_base) for 3-phase.',
    'Generator reactance changes over time: subtransient X_d″ (largest current, first 3-5 cycles), transient X_d′, synchronous X_d',
    'Zero-sequence requires a ground/neutral return path — δ connections and ungrounded systems block zero-sequence current',
    'Asymmetric peak fault current is 1.6-1.8× the symmetric RMS due to DC offset — breakers must withstand it mechanically',
  ],
},

};
