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

$$V_{ph} = V_{LL} / \\sqrt{3} = 480 / 1.73205 = 277.13\\ \\mathrm{V}$$

**Step 2 — Phase current (= line current for Y):**

$\\lvert Z_Y \\rvert = \\sqrt{10^{2}+5^{2}} = \\sqrt{125} = 11.1803\\ \\Omega$

$$I_{ph} = V_{ph} / \\lvert Z_Y \\rvert = 277.13 / 11.1803 = 24.787\\ \\mathrm{A}$$

**$I_L = I_{ph} = 24.787\\ \\mathrm{A}$** (Y connection)

**Step 3 — Power factor angle:**

$$\\phi = \\arctan (X/R) = \\arctan (5/10) = 26.565^\\circ$$

cos(φ) = cos(26.565°) = **0.89443 lagging** (inductive load), and sin(φ) = 0.44721

**Step 4 — Three-phase power:**

| Power | Formula | Result |
|---|---|---|
| **Real power P** | $\\sqrt{3} \\cdot V_{LL} \\cdot I_L \\cdot \\cos (\\phi)$ | $\\sqrt{3} \\times 480 \\times 24.787 \\times 0.89443 = 18,432\\ \\mathrm{W} \\approx 18.4\\ \\mathrm{kW}$ |
| **Reactive power Q** | $\\sqrt{3} \\cdot V_{LL} \\cdot I_L \\cdot \\sin (\\phi)$ | $\\sqrt{3} \\times 480 \\times 24.787 \\times 0.44721 = 9,216\\ \\mathrm{VAR} \\approx 9.22\\ \\mathrm{kVAR}$ |
| **Apparent power S** | $\\sqrt{3} \\cdot V_{LL} \\cdot I_L$ | $\\sqrt{3} \\times 480 \\times 24.787 = 20,608\\ \\mathrm{VA} \\approx 20.6\\ \\mathrm{kVA}$ |

**Verification**: S² = P² + Q² → 20,608² ≈ 18,432² + 9,216² → 424.7M ≈ 339.7M + 84.9M ≈ 424.7M. Confirmed.

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

Put the Section 3 load into that expression. There V_ph = 277.13 V,
I = 24.787 A and φ = 26.565°, so VI = 6.87 kVA and cos φ = 0.89443:

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

For the worked load, with V_LL = 480 V, I_L = 24.787 A and φ = 26.565°:

- **$W_{1} = 480 \\times 24.787 \\times \\cos (-3.435^\\circ ) = 11{,}876\\ \\mathrm{W}$**
- **$W_{2} = 480 \\times 24.787 \\times \\cos (56.565^\\circ ) = 6{,}556\\ \\mathrm{W}$**
- Sum = **18,432 W**, exactly the P computed in Section 3.

The difference carries the reactive information. Expanding both cosines gives
**$W_{1} - W_{2} = V_{LL}I_{L}\\sin \\phi$**, so

$$\\tan \\phi = \\sqrt{3}\\,\\frac{W_{1} - W_{2}}{W_{1} + W_{2}}$$

Here that is 1.7321 × 5,320.9/18,432 = 0.5000, and arctan(0.5000) = 26.57° —
the load angle recovered from two meter readings with no phase-angle
instrument anywhere. Three-phase reactive power follows as
**$Q = \\sqrt{3}(W_{1} - W_{2})$** = 1.7321 × 5,320.9 = 9,216 VAR, matching the
9.22 kVAR of Section 3 exactly.

| Load power factor | φ | Reading behaviour |
|---|---|---|
| Unity | 0° | Both meters read equally |
| 0.866 lagging | 30° | W₂ = ½W₁ — the ratio is 0.5, **not** zero |
| 0.5 lagging exactly | 60° | **W₂ reads exactly zero**; all the power is on W₁ |
| Below 0.5 lagging | > 60° | **W₂ reads negative** — reverse its coil and subtract |

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
    {
      id: '3ph-sqrt3-copper',
      title: '6. Where the √3 Comes From, and the Copper It Saves',
      content: `## 6.1 A line voltage is a DIFFERENCE of two phase voltages

Sections 1 to 3 used **$V_{LL} = \\sqrt{3}\\,V_{ph}$** as a rule to be obeyed.
It is worth two minutes to see where the number comes from, because the same
two minutes explain the 30° angle that goes with it — and the angle is what
separates candidates who can handle a delta-connected load from candidates who
can only handle a wye.

A voltmeter connected between lines a and b does not measure either phase
voltage. It measures the potential of a minus the potential of b, and in
phasor form that is a subtraction:

$$V_{ab} = V_{an} - V_{bn}$$

Put the balanced set in. With **$V_{an} = V\\angle 0^\\circ$** and
**$V_{bn} = V\\angle -120^\\circ$**, write the second phasor in rectangular
form and subtract:

$$V_{ab} = V\\angle 0^\\circ - V\\left(-\\tfrac{1}{2} - j\\tfrac{\\sqrt{3}}{2}\\right)$$

$$V_{ab} = V\\left(1 + \\tfrac{1}{2} + j\\tfrac{\\sqrt{3}}{2}\\right) = V\\left(\\tfrac{3}{2} + j\\tfrac{\\sqrt{3}}{2}\\right)$$

The magnitude of that bracket is **$\\sqrt{(3/2)^2 + (\\sqrt{3}/2)^2} = \\sqrt{3}$**
and its angle is **$\\arctan\\!\\left[(\\sqrt{3}/2)\\div(3/2)\\right] = 30^\\circ$**, so

$$V_{ab} = \\sqrt{3}\\,V\\angle 30^\\circ$$

The √3 is not a convention. It is the length of the chord between two unit
vectors 120° apart, which is **$2\\sin 60^\\circ = \\sqrt{3}$**. The 30° comes
from the chord bisecting that 120° gap. Everything about the wye connection
follows from that one piece of geometry.

![Phasor construction of the line voltages of a balanced 480 V system. The three line-to-neutral phasors of 277.13 V are drawn in one hue and the three line-to-line phasors of 480.0 V in another; a light guide arrow shows minus-Vbn added to the tip of Van, landing exactly on Vab, which is 1.7321 times longer and leads Van by exactly 30 degrees.](/courses/fe-ee/figures/pow2-3ph-phasor-sqrt3.svg)

For a 480 V system, **$V_{ph} = 480/\\sqrt{3} = 277.128$ V**, and the six
phasors are:

| Phasor | Magnitude | Angle | Relationship |
|---|---|---|---|
| $V_{an}$ | 277.13 V | 0° | reference |
| $V_{bn}$ | 277.13 V | −120° | $a^{2}V_{an}$ |
| $V_{cn}$ | 277.13 V | +120° | $aV_{an}$ |
| $V_{ab}$ | 480.00 V | +30° | $\\sqrt{3}\\,V_{an}\\angle 30^\\circ$ |
| $V_{bc}$ | 480.00 V | −90° | $\\sqrt{3}\\,V_{bn}\\angle 30^\\circ$ |
| $V_{ca}$ | 480.00 V | +150° | $\\sqrt{3}\\,V_{cn}\\angle 30^\\circ$ |

Both sets sum to zero, and both are balanced. The line set is simply rotated
30° and stretched by √3.

## 6.2 The delta mirror: current does what voltage did

In a delta load the three impedances sit **across** the lines, so each one
sees the full line voltage and there is no √3 on voltage at all. The √3 moves
to current, and by exactly the same subtraction. Kirchhoff's current law at
corner a of the delta gives

$$I_{a} = I_{ab} - I_{ca}$$

with **$I_{ab}$** and **$I_{ca}$** a balanced pair 120° apart, so the identical
algebra returns

$$I_{a} = \\sqrt{3}\\,I_{ab}\\angle -30^\\circ$$

Note the sign of the angle. Line current **lags** the delta phase current by
30°, whereas line voltage **leads** phase voltage by 30°. A candidate who
memorises "√3 and 30°" without the sign will get magnitudes right and phase
relationships backwards, which matters the moment two sources must be
paralleled or a delta–wye transformer bank must be phased.

$$\\frac{|I_{L}|}{|I_{ph}|} = \\left|1 - 1\\angle 120^\\circ\\right| = \\sqrt{3} = 1.7321$$

### Worked example 6.1 — a delta load, phase and line quantities

A balanced delta load of **$Z_{\\Delta} = 30 + j40\\ \\Omega$** per phase is
supplied at 208 V line-to-line. Find the phase current, the line current, and
the total complex power.

**Step 1 — impedance in polar form.** **$|Z| = \\sqrt{30^2 + 40^2} = 50\\ \\Omega$**
at **$\\arctan(40/30) = 53.13^\\circ$**.

**Step 2 — phase current.** Each impedance sees the whole 208 V:

$$I_{ab} = \\frac{208\\angle 0^\\circ}{50\\angle 53.13^\\circ} = 4.160\\angle -53.13^\\circ\\ \\mathrm{A}$$

**Step 3 — line current.** Multiply by √3 and rotate 30° back:

$$I_{a} = \\sqrt{3}\\times 4.160\\angle (-53.13^\\circ - 30^\\circ) = 7.205\\angle -83.13^\\circ\\ \\mathrm{A}$$

**Step 4 — power.** Using phase quantities,
**$S = 3V_{ph}I_{ph}^{*} = 3\\times 208\\times 4.160\\angle 53.13^\\circ$** =
1,557.5 W + j2,076.7 VAR, magnitude 2,595.8 VA. The line-quantity formula
agrees: **$\\sqrt{3}\\times 208\\times 7.205\\times 0.6 = 1{,}557.5$ W**.

**Trap named.** The 7.205 A is what an ammeter on the supply conductor reads;
the 4.160 A never leaves the delta. A clamp meter placed on a delta winding
lead and a clamp meter placed on the feeder disagree by 73 percent, and both
are correct.

## 6.3 The copper argument: why the grid is three-phase

Three-phase is not merely convenient. It is cheaper in metal, and the saving
can be computed exactly. Fix four things across the comparison: the power
delivered, the distance, the total conductor loss, and the line-to-line
voltage (which sets the insulation class and so the cost of everything that is
not conductor).

For a single-phase two-wire circuit at unity power factor,
**$I_{1\\phi} = P/V$**, and both conductors carry it:

$$P_{loss,1\\phi} = 2I_{1\\phi}^{2}R_{1}$$

For a three-phase three-wire circuit at the same V and P,
**$I_{3\\phi} = P/(\\sqrt{3}V)$**, and three conductors carry it:

$$P_{loss,3\\phi} = 3I_{3\\phi}^{2}R_{3} = 3\\left(\\frac{P}{\\sqrt{3}V}\\right)^{2}R_{3} = \\frac{P^{2}}{V^{2}}R_{3}$$

Setting the two losses equal gives **$R_{3} = 2R_{1}$** — each three-phase
conductor may be twice as resistive, so half the cross-section. Conductor
volume is **$n\\,A\\,\\ell$** and **$A = \\rho\\ell/R$**, so volume scales as
**$n/R$**:

$$\\frac{\\text{metal}_{3\\phi}}{\\text{metal}_{1\\phi}} = \\frac{3/R_{3}}{2/R_{1}} = \\frac{3/(2R_{1})}{2/R_{1}} = \\frac{3}{4} = 0.75$$

A 25 percent saving in conductor metal, before any argument about rotating
fields or constant torque. Add a full-size neutral and the saving evaporates
entirely; use a half-size neutral, which is what a balanced load permits, and
you keep half of it.

![Conductor metal required by four wiring systems to deliver the same power over the same distance at the same line-to-line voltage and the same total resistive loss, plotted as a percentage of the single-phase two-wire case. Three-phase three-wire needs 75.0 percent, three-phase four-wire with a half-size neutral 87.5 percent, and three-phase four-wire with a full-size neutral exactly 100 percent.](/courses/fe-ee/figures/pow2-3ph-copper-economy.svg)

### Worked example 6.2 — the saving in millimetres of copper

Deliver 500 kW at unity power factor over 1.2 km at 4,160 V line-to-line, and
allow 2 percent of the delivered power (10 kW) as conductor loss. Size the
copper both ways. Take **$\\rho = 1.724\\times 10^{-8}\\ \\Omega\\!\\cdot\\!\\mathrm{m}$**.

**Three-phase.** **$I = 500{,}000/(\\sqrt{3}\\times 4{,}160) = 69.393$ A**. Three
conductors share the 10 kW:

$$R_{3} = \\frac{10{,}000}{3\\times 69.393^{2}} = 0.69222\\ \\Omega \\quad\\Rightarrow\\quad A_{3} = \\frac{\\rho\\ell}{R_{3}} = 29.89\\ \\mathrm{mm^{2}}$$

**Single-phase.** **$I = 500{,}000/4{,}160 = 120.192$ A**, and two conductors
share the same 10 kW:

$$R_{1} = \\frac{10{,}000}{2\\times 120.192^{2}} = 0.34611\\ \\Omega \\quad\\Rightarrow\\quad A_{1} = 59.77\\ \\mathrm{mm^{2}}$$

Total metal is **$3\\times 29.887 = 89.66\\ \\mathrm{mm^{2}}$** against
**$2\\times 59.775 = 119.55\\ \\mathrm{mm^{2}}$** — a ratio of exactly 0.750, as
the algebra promised. Over 1.2 km that is 36 m³ of copper cross-section-metre
saved per circuit, which at utility scale is the whole argument.

### Worked example 6.3 — sizing a feeder from a kW rating

A 480 V, three-phase feeder must supply 75 kW at 0.85 power factor lagging.
Find the line current, the apparent and reactive power, and the per-phase wye
impedance the feeder sees.

$$I_{L} = \\frac{P}{\\sqrt{3}\\,V_{LL}\\cos\\phi} = \\frac{75{,}000}{\\sqrt{3}\\times 480\\times 0.85} = 106.13\\ \\mathrm{A}$$

**$\\phi = \\arccos 0.85 = 31.79^\\circ$**, so **$S = 75{,}000/0.85 = 88{,}235$ VA**
and **$Q = 88{,}235\\sin 31.79^\\circ = 46{,}481$ VAR**. The equivalent wye
impedance follows from the phase voltage:

$$|Z_{Y}| = \\frac{V_{LL}/\\sqrt{3}}{I_{L}} = \\frac{277.13}{106.13} = 2.6112\\ \\Omega$$

$$Z_{Y} = 2.6112\\angle 31.79^\\circ = 2.2195 + j1.3755\\ \\Omega, \\qquad Z_{\\Delta} = 3Z_{Y} = 6.659 + j4.127\\ \\Omega$$

Check by working forward from the impedance:
**$S = 3V_{ph}^{2}/Z_{Y}^{*} = 75{,}000 + j46{,}481$** VA. The two routes agree
to the last displayed digit, which is the habit worth carrying into the exam:
every three-phase answer can be re-derived from the other side of the power
triangle in about fifteen seconds.`,
      examTip: 'Both √3 relationships come from ONE subtraction of two phasors 120° apart, and both carry a 30° rotation. In wye, line voltage leads phase voltage by 30°; in delta, line current LAGS phase current by 30°. Memorising the magnitudes without the signs is enough for a scalar power question and not enough for anything involving phasing.',
      importantNote: 'The 25 percent copper saving assumes a three-WIRE three-phase circuit. A four-wire circuit with a full-size neutral uses exactly the same metal as single-phase, so the economic case for three-phase distribution rests on the neutral carrying little or no current — which is precisely what unbalance and triplen harmonics destroy.',
    },
    {
      id: '3ph-unbalance-practice',
      title: '7. Unbalance in Practice: Neutrals, Motor Heating, Meter Readings',
      content: `## 7.1 The neutral carries the phasor sum, never the arithmetic sum

A 208Y/120 V lighting panel is loaded to 60 A on phase a, 45 A on phase b and
30 A on phase c, all resistive. A common wrong instinct is to say the neutral
carries the 30 A "left over" from the biggest and smallest legs. The neutral
carries the phasor sum:

$$I_{n} = I_{a} + I_{b} + I_{c} = 60\\angle 0^\\circ + 45\\angle -120^\\circ + 30\\angle 120^\\circ$$

Resolve each into components. The real parts are 60, −22.5 and −15; the
imaginary parts are 0, −38.971 and +25.981. Adding,

$$I_{n} = 22.5 - j12.990 = 25.98\\angle -30^\\circ\\ \\mathrm{A}$$

For unity-power-factor loads there is a closed form worth carrying:

$$|I_{n}| = \\sqrt{I_{a}^{2} + I_{b}^{2} + I_{c}^{2} - I_{a}I_{b} - I_{b}I_{c} - I_{c}I_{a}}$$

which evaluates to **$\\sqrt{6{,}525 - 5{,}850} = \\sqrt{675} = 25.98$ A**, the
same number. That expression can be rewritten as

$$|I_{n}| = \\sqrt{\\tfrac{1}{2}\\left[(I_{a}-I_{b})^{2} + (I_{b}-I_{c})^{2} + (I_{c}-I_{a})^{2}\\right]}$$

and in that form it says something useful: the neutral current depends only on
the **differences** between the phase currents, never on their common part. A
panel loaded 200/185/170 A carries the same neutral current as one loaded
60/45/30 A.

![Neutral current of a four-wire wye as the phase-a current is swept from 0 to 90 A while phases b and c are held at 45 A and 30 A, all at unity power factor. The curve is a shallow V with its minimum of 12.99 A at 37.5 A, and the lesson case of 60, 45 and 30 A is marked at 25.98 A; the neutral current never falls to zero because the two fixed legs are themselves unequal.](/courses/fe-ee/figures/pow2-3ph-neutral-current.svg)

The figure makes the design point. Sweeping phase a from 0 to 90 A never
drives the neutral to zero, because b and c already differ from each other.
The best achievable is 12.99 A, at **$I_{a} = (I_{b}+I_{c})/2 = 37.5$ A**.
Perfect neutral cancellation requires all three legs equal, which no real
lighting panel achieves.

### Worked example 7.1 — the neutral that is bigger than the phases

Three balanced 100 A fundamental loads are electronic ballasts, each also
drawing 35 A of third-harmonic current. Find the phase conductor rms current
and the neutral rms current.

**Phase conductor.** Harmonics of different order are orthogonal, so rms
currents add in quadrature:

$$I_{ph} = \\sqrt{100^{2} + 35^{2}} = 105.95\\ \\mathrm{A}$$

**Neutral.** Third harmonics are a **zero-sequence** set: shifting the
fundamental by 120° shifts its third harmonic by 360°, so the three
third-harmonic currents are **in phase**. They add arithmetically in the
neutral while the fundamentals cancel:

$$I_{n} = 3\\times 35 = 105\\ \\mathrm{A}$$

The neutral carries 105 A while each phase carries 105.95 A — 99.1 percent of
the phase current, on a "balanced" load. This is why modern four-wire feeders
serving electronic loads are specified with a full-size or oversized neutral,
and why the 25 percent copper saving of Section 6.3 quietly disappears in an
office building.

## 7.2 Voltage unbalance is a rotor-heating problem

Unbalance in the **supply** matters more than unbalance in the load, because
motors are extremely sensitive to it. The practical index is the voltage
unbalance factor. The engineering definition is the ratio of negative- to
positive-sequence voltage,

$$\\mathrm{VUF} = \\frac{|V_{2}|}{|V_{1}|}\\times 100\\%$$

That is the IEC definition. NEMA defines a separate index, the line voltage
unbalance rate, which needs only three voltmeter readings — the maximum
deviation from the average divided by the average:

$$\\mathrm{LVUR} = \\frac{\\max\\left|V_{k} - V_{\\mathrm{avg}}\\right|}{V_{\\mathrm{avg}}}\\times 100\\%$$

For readings of 480, 475 and 465 V the average is 473.33 V, the largest
deviation is 8.33 V, and the LVUR is **1.76 percent**. The two indices are not
the same quantity and are not interchangeable in a specification: they agree
closely for small unbalance, and diverge once the phase angles as well as the
magnitudes are disturbed, because only the sequence-based VUF sees angle error
at all.

Why a motor cares: the negative-sequence voltage drives current through the
**negative-sequence impedance**, and to a negative-sequence field the rotor is
turning backwards at nearly twice synchronous speed. Its impedance is
therefore close to the locked-rotor impedance, which is small:

$$\\frac{I_{2}}{I_{1}} = \\frac{V_{2}}{V_{1}}\\cdot\\frac{Z_{1}}{Z_{2}} \\approx \\mathrm{VUF}\\times \\frac{I_{LR}}{I_{FL}}$$

For a machine with a locked-rotor current six times full load, **1 percent of
voltage unbalance produces 6 percent of extra current**, and that current
lands in the rotor at roughly twice line frequency, where the skin effect
makes the rotor bars more resistive still.

![Effect of supply voltage unbalance on an induction motor, computed from the ratio of negative to positive sequence impedance. The upper panel plots negative-sequence stator current as a percentage of rated against unbalance factor for locked-rotor ratios of 5, 6 and 7, giving 5 to 7 percent of extra current per percent of unbalance. The lower panel plots the resulting stator copper-loss multiplier, which reaches 1.032 at 3 percent unbalance for a ratio of 6.](/courses/fe-ee/figures/pow2-3ph-unbalance-heating.svg)

### Worked example 7.2 — from three voltmeter readings to a derating decision

A 460 V motor is fed by a panel reading 481, 474 and 468 V line-to-line. The
machine has a locked-rotor current of 6.5 times full load. Estimate the
negative-sequence current and the increase in stator copper loss.

**Step 1 — unbalance factor.** Average = (481 + 474 + 468)/3 = 474.33 V.
Deviations are +6.67, −0.33 and −6.33 V, so

$$\\mathrm{VUF} = \\frac{6.667}{474.33}\\times 100 = 1.41\\%$$

**Step 2 — negative-sequence current.**
**$I_{2}/I_{1} = 1.4056\\times 6.5 = 9.14$ percent of rated**.

**Step 3 — loss.** Stator copper loss scales with the sum of the squares:

$$\\frac{P_{cu}}{P_{cu,bal}} = \\frac{I_{1}^{2} + I_{2}^{2}}{I_{1}^{2}} = 1 + 0.0914^{2} = 1.0084$$

Under one percent extra stator loss — which sounds harmless — but the same
9.1 percent of current in the rotor appears at 2 − s times line frequency,
where the rotor resistance is substantially higher than its dc value, and the
rotor is the part with no cooling fan of its own. That asymmetry between a
small stator number and a large rotor consequence is exactly why unbalance
limits are written in tenths of a percent.

## 7.3 Two wattmeters across the whole power-factor range

Section 4 introduced the two-wattmeter method at one operating point. The
behaviour across the range is worth seeing whole, because two of the three
exam traps live at specific angles.

$$W_{1} = V_{LL}I_{L}\\cos(\\phi - 30^\\circ), \\qquad W_{2} = V_{LL}I_{L}\\cos(\\phi + 30^\\circ)$$

$$W_{1} + W_{2} = V_{LL}I_{L}\\left[\\cos(\\phi-30^\\circ)+\\cos(\\phi+30^\\circ)\\right] = \\sqrt{3}\\,V_{LL}I_{L}\\cos\\phi$$

The sum identity uses **$\\cos(A-B)+\\cos(A+B) = 2\\cos A\\cos B$** with
**$2\\cos 30^\\circ = \\sqrt{3}$**. The difference uses the companion identity:

$$W_{1} - W_{2} = 2V_{LL}I_{L}\\sin\\phi\\sin 30^\\circ = V_{LL}I_{L}\\sin\\phi$$

![The two wattmeter readings normalised to the product of line voltage and line current, plotted against load angle from unity power factor to zero. W1 rises to a maximum at 30 degrees and falls back; W2 falls monotonically, passes exactly through zero at 60 degrees and goes negative beyond it; their sum traces root-three times cosine phi. The 0.866 power-factor point is marked to show W2 equal to half of W1 there, not zero.](/courses/fe-ee/figures/pow2-3ph-wattmeter-pf.svg)

| Power factor | φ | W₁ / V_LL I_L | W₂ / V_LL I_L | W₂ / W₁ |
|---|---|---|---|---|
| 1.000 | 0° | 0.866 | 0.866 | 1.000 |
| 0.866 lag | 30° | 1.000 | 0.500 | 0.500 |
| 0.800 lag | 36.87° | 0.993 | 0.393 | 0.396 |
| 0.500 lag | 60° | 0.866 | 0.000 | 0.000 |
| 0.300 lag | 72.54° | 0.737 | −0.217 | −0.295 |

Two things to read off. **W₁ peaks at φ = 30°, not at unity power factor** —
the individual readings are not monotone, only their sum is. And **W₂ crosses
zero at φ = 60°, that is at pf = 0.5**, not at 0.866. The 0.866 point gives a
ratio of one half, which is a different fact that is easy to confuse with it.

### Worked example 7.3 — recovering power factor from two readings

Two wattmeters on a three-wire load read 6,500 W and 2,100 W. Find the total
real power, the power factor, and the reactive power.

$$P = W_{1} + W_{2} = 8{,}600\\ \\mathrm{W}$$

$$\\tan\\phi = \\sqrt{3}\\,\\frac{W_{1}-W_{2}}{W_{1}+W_{2}} = 1.7321\\times\\frac{4{,}400}{8{,}600} = 0.8862$$

**$\\phi = \\arctan 0.8862 = 41.55^\\circ$**, so **$\\cos\\phi = 0.748$ lagging**
and **$Q = \\sqrt{3}(W_{1}-W_{2}) = 7{,}621$ VAR**. Sanity check:
**$S = \\sqrt{8{,}600^{2}+7{,}621^{2}} = 11{,}491$ VA** and
**$P/S = 0.748$**, which closes the triangle.

### Worked example 7.4 — one meter reads backwards

The same instruments on a different load read 15,000 W and, after the
technician reverses the potential coil to get an upscale deflection, 3,000 W.
Find the true power and power factor.

The reversal means the true reading is **−3,000 W**. Therefore

$$P = 15{,}000 + (-3{,}000) = 12{,}000\\ \\mathrm{W}$$

$$\\tan\\phi = 1.7321\\times\\frac{15{,}000-(-3{,}000)}{12{,}000} = 2.598 \\;\\Rightarrow\\; \\phi = 68.95^\\circ, \\ \\cos\\phi = 0.359$$

**Trap named.** A technician who adds 15,000 and 3,000 reports 18,000 W — half
again too much — and a power factor of 0.87 instead of 0.36. The tell is that a
negative reading only ever occurs below 0.5 power factor, so any load whose
meters straddle zero is severely inductive and needs correction, not a
recalculation.

### Worked example 7.5 — an unbalanced four-wire wye, done correctly

A 208Y/120 V four-wire supply feeds **$Z_{a}=10\\ \\Omega$**,
**$Z_{b}=20\\ \\Omega$** and **$Z_{c}=10-j10\\ \\Omega$**. Find the line
currents, the neutral current, and the total real power.

With a solid neutral each phase is independent, so each current is its own
phase voltage over its own impedance:

$$I_{a} = \\frac{120\\angle 0^\\circ}{10} = 12.00\\angle 0^\\circ, \\quad I_{b} = \\frac{120\\angle -120^\\circ}{20} = 6.00\\angle -120^\\circ$$

$$I_{c} = \\frac{120\\angle 120^\\circ}{14.142\\angle -45^\\circ} = 8.485\\angle 165^\\circ\\ \\mathrm{A}$$

Adding the three in rectangular form gives 0.804 − j3.000, so

$$I_{n} = 3.106\\angle -75^\\circ\\ \\mathrm{A}$$

Total real power is the sum of the per-phase powers, **not** a √3 formula:

$$P = I_{a}^{2}R_{a} + I_{b}^{2}R_{b} + I_{c}^{2}R_{c} = 1{,}440 + 720 + 720 = 2{,}880\\ \\mathrm{W}$$

**Trap named.** Feeding the average line current 8.83 A and a nominal 0.9
power factor into **$P=\\sqrt{3}V_{LL}I_{L}\\cos\\phi$** returns 2,863 W. It is
close enough to look right and it is wrong in principle: the formula assumes
one common angle, and this load has three different ones. On any unbalanced
load, sum the phases.`,
      examTip: 'Three numbers to have ready: the neutral of an unbalanced unity-pf wye is √(ΣI² − ΣI·I), triplen harmonics add ARITHMETICALLY in the neutral (three times the per-phase harmonic), and one percent of voltage unbalance costs roughly six percent of extra motor current. Each is a one-line calculation that examiners like because it looks like it needs more.',
      importantNote: 'W₂ reads zero at a power factor of 0.5, not 0.866. At 0.866 the ratio W₂/W₁ is exactly one half. Those two facts sit thirty degrees apart and are the most commonly transposed pair in the two-wattmeter question.',
    },
    {
      id: '3ph-problem-set-a',
      title: '8. Problem Set A: Balanced Circuits, Conversions, and Feeders',
      content: `Everything in Sections 1 to 6 is now available to you. What
follows is the part that decides the exam.

## 8. Problem Set A — balanced three-phase circuits

Work these under exam conditions: handbook formulas only, about three minutes
each, and write down which quantity is line and which is phase before you
start. Full solutions follow.

### The problems

**A1.** A balanced wye load of **$12 + j9\\ \\Omega$** per phase is supplied at
208 V line-to-line. Find the line current, the total real power, and the power
factor.

**A2.** A 460 V three-phase motor draws 52 A at 0.88 power factor lagging.
Find the apparent, real and reactive power, and the equivalent per-phase wye
impedance.

**A3.** A delta-connected load draws 18 A of **line** current from a 240 V
three-phase supply at 0.90 power factor lagging. Find the phase current, the
per-phase impedance, and the total real power.

**A4.** Two balanced loads share a 480 V bus. Load 1 draws 40 kW at 0.80 power
factor lagging; load 2 draws 25 kVA at 0.95 power factor **leading**. Find the
combined apparent power, the combined power factor, and the line current.

**A5.** A 4,160 V, three-phase feeder of **$0.35 + j0.85\\ \\Omega$** per phase
delivers 1.5 MW at 0.85 power factor lagging **measured at the load**. Find
the sending-end line-to-line voltage.

**A6.** A balanced delta load of **$9\\angle 25^\\circ\\ \\Omega$** per phase is
connected to a 208 V supply. Find the equivalent wye impedance, the line
current, and the total real power.

### Solutions

**A1.** **$|Z| = \\sqrt{12^{2}+9^{2}} = 15\\ \\Omega$** at
**$\\arctan(9/12) = 36.87^\\circ$**, so pf = 0.800 lagging. In a wye the
impedance sees the phase voltage:

$$I_{L} = I_{ph} = \\frac{208/\\sqrt{3}}{15} = \\frac{120.09}{15} = 8.006\\ \\mathrm{A}$$

$$P = 3I^{2}R = 3\\times 8.006^{2}\\times 12 = 2{,}307\\ \\mathrm{W}$$

Check with line quantities: **$\\sqrt{3}\\times 208\\times 8.006\\times 0.800 = 2{,}307$ W**.
*Distractor:* dividing 208 by 15 gives 13.87 A, the answer for a delta load —
a factor of √3 too large.

**A2.** **$S = \\sqrt{3}\\times 460\\times 52 = 41{,}431$ VA**, so
**$P = 41{,}431\\times 0.88 = 36{,}459$ W**. With
**$\\phi = \\arccos 0.88 = 28.36^\\circ$**, **$Q = 41{,}431\\sin 28.36^\\circ = 19{,}678$ VAR**.
The equivalent wye impedance is

$$|Z_{Y}| = \\frac{460/\\sqrt{3}}{52} = 5.1073\\ \\Omega \\;\\Rightarrow\\; Z_{Y} = 4.494 + j2.426\\ \\Omega$$

*Distractor:* 460/52 = 8.85 Ω is the delta-equivalent magnitude divided by √3,
not the wye value.

**A3.** In a delta the line current is √3 times the phase current, so

$$I_{ph} = \\frac{18}{\\sqrt{3}} = 10.392\\ \\mathrm{A}, \\qquad |Z_{\\Delta}| = \\frac{240}{10.392} = 23.094\\ \\Omega$$

At **$\\arccos 0.90 = 25.84^\\circ$** this is **$20.78 + j10.07\\ \\Omega$**, and

$$P = \\sqrt{3}\\times 240\\times 18\\times 0.90 = 6{,}734\\ \\mathrm{W}$$

*Distractor:* using 18 A as the phase current returns 13.33 Ω, which is the
answer for a wye of the same line current.

**A4.** Convert both to rectangular power. Load 1:
**$Q_{1} = 40\\tan(36.87^\\circ) = 30.0$ kVAR** lagging. Load 2:
**$P_{2} = 25\\times 0.95 = 23.75$ kW** and
**$Q_{2} = -25\\sin(18.19^\\circ) = -7.806$ kVAR** (leading, hence negative).

$$P_{T} = 63.75\\ \\mathrm{kW}, \\qquad Q_{T} = 30.0 - 7.806 = 22.19\\ \\mathrm{kVAR}$$

$$S_{T} = \\sqrt{63.75^{2}+22.19^{2}} = 67.50\\ \\mathrm{kVA}, \\quad \\mathrm{pf} = \\frac{63.75}{67.50} = 0.944\\ \\text{lagging}$$

$$I_{L} = \\frac{67{,}503}{\\sqrt{3}\\times 480} = 81.19\\ \\mathrm{A}$$

*Distractor:* adding the apparent powers (50 + 25 = 75 kVA) ignores the angle
and overstates the current by 11 percent. Only P and Q add.

**A5.** Load current **$I = 1.5\\times 10^{6}/(\\sqrt{3}\\times 4{,}160\\times 0.85) = 244.92$ A**
at **$-31.79^\\circ$**. Working per phase with
**$V_{R} = 4{,}160/\\sqrt{3} = 2{,}401.8\\angle 0^\\circ$** V:

$$V_{S} = V_{R} + IZ = 2{,}401.8 + (244.92\\angle -31.79^\\circ)(0.35+j0.85)$$

$$V_{S} = 2{,}584.3 + j131.8 = 2{,}587.7\\angle 2.92^\\circ\\ \\mathrm{V}$$

so **$V_{S,LL} = \\sqrt{3}\\times 2{,}587.7 = 4{,}482$ V**, a rise of 322 V and a
regulation of 7.74 percent. The handbook approximation
**$\\Delta V \\approx I(R\\cos\\phi + X\\sin\\phi) = 244.92(0.2975+0.4476) = 182.5$ V**
per phase, or 316 V line-to-line, is 1.9 percent low because it drops the
quadrature term — accurate enough for a multiple choice, not for a study.

**A6.** **$Z_{Y} = Z_{\\Delta}/3 = 3\\angle 25^\\circ\\ \\Omega = 2.719 + j1.268\\ \\Omega$**.
Either route gives the same line current:

$$I_{ph,\\Delta} = \\frac{208}{9} = 23.11\\ \\mathrm{A} \\;\\Rightarrow\\; I_{L} = \\sqrt{3}\\times 23.11 = 40.03\\ \\mathrm{A}$$

$$I_{L} = \\frac{208/\\sqrt{3}}{3} = 40.03\\ \\mathrm{A} \\quad\\text{(wye route, identical)}$$

$$P = \\sqrt{3}\\times 208\\times 40.03\\times \\cos 25^\\circ = 13{,}070\\ \\mathrm{W}$$

*Distractor:* multiplying the delta impedance by 3 instead of dividing gives
27 Ω and a line current nine times too small.`,
      examTip: 'On any balanced problem, write V_LL, I_L, and φ in a column before touching a formula. Roughly a third of lost marks in this section come from putting a phase quantity into a line-quantity formula, and that habit catches it before the arithmetic starts.',
      importantNote: 'Apparent powers never add arithmetically unless the two loads share a power-factor angle. Convert each load to P and Q, add those, and rebuild S at the end. Problem A4 is built entirely around that one rule.',
    },
    {
      id: '3ph-problem-set-b',
      title: '9. Problem Set B: Unbalance, Metering, and Neutral Sizing',
      content: `The balanced formulas are the easy half of this section. The
questions below are the other half.

## 9. Problem Set B — unbalance, metering, and neutral sizing

These are the questions that separate candidates who learned the balanced
formulas from candidates who understand what they assume. Full solutions
follow the six problems.

### The problems

**B1.** A 208Y/120 V four-wire panel carries 80 A on phase a, 50 A on phase b
and 35 A on phase c, all at unity power factor. Find the neutral current.

**B2.** Two wattmeters connected to a three-wire balanced load read 6.5 kW and
2.1 kW. Find the total power, the power factor, and the reactive power.

**B3.** The same pair of meters on another load read 15 kW and 3 kW, the second
only after its potential coil was reversed. Find the true total power and the
power factor.

**B4.** A panel reads 481, 474 and 468 V line-to-line. Compute the voltage
unbalance factor by the deviation-from-average definition. For a motor with a
locked-rotor current of 6.0 per unit, estimate the negative-sequence current.

**B5.** Each phase of a balanced four-wire feeder carries 120 A of fundamental
plus 40 A of third harmonic. Find the phase conductor rms current and the
neutral rms current, and state which conductor is more heavily loaded relative
to a 125 A rating.

**B6.** A 208Y/120 V four-wire supply feeds **$Z_{a}=10\\ \\Omega$**,
**$Z_{b}=20\\ \\Omega$**, **$Z_{c}=10-j10\\ \\Omega$**. Find the three line
currents, the neutral current, and the total real power delivered.

### Solutions

**B1.** Use the unity-power-factor closed form:

$$|I_{n}| = \\sqrt{80^{2}+50^{2}+35^{2}-(80)(50)-(50)(35)-(35)(80)}$$

$$|I_{n}| = \\sqrt{6{,}400+2{,}500+1{,}225-4{,}000-1{,}750-2{,}800} = \\sqrt{1{,}575} = 39.69\\ \\mathrm{A}$$

*Distractor:* 80 − 35 = 45 A is the arithmetic "leftover" and is not what the
neutral sees. Notice also that the answer depends only on the differences
between the legs, so a panel at 200/170/155 A gives the identical 39.69 A.

**B2.** **$P = 6{,}500 + 2{,}100 = 8{,}600$ W**.

$$\\tan\\phi = \\sqrt{3}\\times\\frac{6{,}500-2{,}100}{8{,}600} = 0.8862 \\;\\Rightarrow\\; \\phi = 41.55^\\circ$$

**$\\cos\\phi = 0.748$ lagging**, **$Q = \\sqrt{3}\\times 4{,}400 = 7{,}621$ VAR**.
*Distractor:* omitting the √3 from the tangent gives 0.512 and a power factor
of 0.890 — the single most common slip in this question type.

**B3.** The reversal means the second reading is negative:

$$P = 15{,}000 - 3{,}000 = 12{,}000\\ \\mathrm{W}$$

$$\\tan\\phi = \\sqrt{3}\\times\\frac{18{,}000}{12{,}000} = 2.598 \\;\\Rightarrow\\; \\phi = 68.95^\\circ, \\quad \\cos\\phi = 0.359$$

*Distractor:* 18,000 W and pf 0.87 is the answer for a technician who trusts
the deflection. The clue that something is a sign error is structural: a
reading can only go negative below 0.5 power factor, so an answer above 0.5
from a reversed meter contradicts itself.

**B4.** Average = 474.33 V; deviations +6.67, −0.33, −6.33 V.

$$\\mathrm{VUF} = \\frac{6.667}{474.33}\\times 100 = 1.41\\%$$

$$\\frac{I_{2}}{I_{1}} \\approx 1.4056\\times 6.0 = 8.4\\%\\ \\text{of rated current}$$

*Distractor:* using the full spread 481 − 468 = 13 V instead of the maximum
deviation from average doubles the answer to 2.74 percent.

**B5.** Phase conductor:

$$I_{ph} = \\sqrt{120^{2}+40^{2}} = 126.49\\ \\mathrm{A}$$

Neutral, since third harmonics are zero sequence and add directly:

$$I_{n} = 3\\times 40 = 120\\ \\mathrm{A}$$

The phase conductor at 126.5 A is over its 125 A rating; the neutral at 120 A
is just under it, at 94.9 percent of the phase current on a load that a
balanced-system calculation would have said carries no neutral current at all.
*Distractor:* 40 A in the neutral treats the harmonic as if it cancelled like
the fundamental.

**B6.** With a solid neutral each leg is independent:

$$I_{a} = \\frac{120\\angle 0^\\circ}{10} = 12.00\\angle 0^\\circ\\ \\mathrm{A}, \\qquad I_{b} = \\frac{120\\angle -120^\\circ}{20} = 6.00\\angle -120^\\circ\\ \\mathrm{A}$$

$$I_{c} = \\frac{120\\angle 120^\\circ}{14.142\\angle -45^\\circ} = 8.485\\angle 165^\\circ\\ \\mathrm{A}$$

$$I_{n} = (12.00) + (-3.00 - j5.196) + (-8.196 + j2.196) = 0.804 - j3.000 = 3.106\\angle -75^\\circ\\ \\mathrm{A}$$

$$P = 12.00^{2}(10) + 6.00^{2}(20) + 8.485^{2}(10) = 1{,}440 + 720 + 720 = 2{,}880\\ \\mathrm{W}$$

*Distractor:* **$\\sqrt{3}V_{LL}I_{avg}\\cos\\phi$** with the average current
8.83 A and pf 0.9 returns 2,863 W. It is within one percent here and would be
wildly wrong on a more severely unbalanced load, because the formula presumes
a single power-factor angle that this circuit does not have.`,
      examTip: 'Every problem in this set is solved by refusing one shortcut: the √3 power formula, the arithmetic neutral, the upscale meter deflection, or the assumption that harmonics cancel. Identify the assumption before you compute, and each becomes a thirty-second question.',
      importantNote: 'Zero-sequence quantities are the connecting thread here. The neutral current is 3I₀, triplen harmonics are a zero-sequence set and therefore add in the neutral, and a delta winding or an ungrounded wye offers zero-sequence current no path at all. One idea, three exam questions.',
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
| Current drawn | Exciting current only, well under 5% of rated | Rated |
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
    {
      id: 'xfmr-test-data-to-circuit',
      title: '6. From Test Data to a Working Equivalent Circuit',
      content: `## 6.1 The four numbers a test report contains

Section 4.3 said what the open- and short-circuit tests measure. This section
does the arithmetic, because "the OC test gives core loss" is a fact you can
recite without being able to use it. A test report contains six numbers —
voltage, current and power for each test — and they reduce to four circuit
parameters. Everything else about the transformer follows.

Take a **50 kVA, 2400/240 V, 60 Hz** distribution unit. Rated currents are

$$I_{H} = \\frac{50{,}000}{2{,}400} = 20.833\\ \\mathrm{A}, \\qquad I_{L} = \\frac{50{,}000}{240} = 208.33\\ \\mathrm{A}$$

and the tests read:

| Test | Applied to | Voltage | Current | Power |
|---|---|---|---|---|
| Open circuit | 240 V (LV) side | 240 V | 1.80 A | 245 W |
| Short circuit | 2400 V (HV) side | 98 V | 20.83 A | 650 W |

## 6.2 Reducing the open-circuit test

The far winding is open, so no load current flows and the entire measurement
belongs to the **shunt** branch. Model that branch as a conductance in
parallel with a susceptance. Real power fixes the conductance:

$$G_{c} = \\frac{P_{OC}}{V_{OC}^{2}} = \\frac{245}{240^{2}} = 4.2535\\times 10^{-3}\\ \\mathrm{S} \\;\\Rightarrow\\; R_{c} = 235.10\\ \\Omega$$

Total admittance magnitude comes from current over voltage, and the
magnetising susceptance is what is left after removing the conductance in
quadrature:

$$|Y_{\\phi}| = \\frac{I_{OC}}{V_{OC}} = \\frac{1.80}{240} = 7.500\\times 10^{-3}\\ \\mathrm{S}$$

$$B_{m} = \\sqrt{|Y_{\\phi}|^{2} - G_{c}^{2}} = \\sqrt{(7.500)^{2}-(4.2535)^{2}}\\times 10^{-3} = 6.177\\times 10^{-3}\\ \\mathrm{S}$$

$$X_{m} = \\frac{1}{B_{m}} = 161.89\\ \\Omega \\ \\text{(referred to the 240 V side)}$$

Two sanity checks worth thirty seconds each. The **exciting current is
1.80/208.33 = 0.86 percent of rated**, which is where a healthy modern unit
sits. And the **no-load power factor is 245/(240 × 1.80) = 0.567** — poor, as
it must be, because a magnetising branch is mostly reactive.

## 6.3 Reducing the short-circuit test

With the far winding shorted, the shunt branch is bypassed by a near-zero
impedance and the measurement belongs entirely to the **series** branch:

$$Z_{eq} = \\frac{V_{SC}}{I_{SC}} = \\frac{98}{20.833} = 4.7040\\ \\Omega, \\qquad R_{eq} = \\frac{P_{SC}}{I_{SC}^{2}} = \\frac{650}{20.833^{2}} = 1.4976\\ \\Omega$$

$$X_{eq} = \\sqrt{Z_{eq}^{2}-R_{eq}^{2}} = \\sqrt{22.128 - 2.243} = 4.4592\\ \\Omega$$

so **$Z_{eq} = 1.4976 + j4.4592 = 4.704\\angle 71.44^\\circ\\ \\Omega$** referred to
the 2400 V side. The impedance angle above 70° is typical: leakage reactance
dominates resistance in any transformer above a few kVA, and that single fact
drives everything about regulation.

### Worked example 6.1 — moving the parameters to the other side

Refer the whole equivalent circuit to the 240 V side. The turns ratio is
**$a = 2400/240 = 10$**, and impedances scale by **$a^{2} = 100$** when moving
toward the low-voltage side by division:

$$R_{eq,LV} = \\frac{1.4976}{100} = 0.014976\\ \\Omega, \\qquad X_{eq,LV} = \\frac{4.4592}{100} = 0.044592\\ \\Omega$$

The shunt parameters, already on the LV side, move the other way if you want
them on the HV side:

$$R_{c,HV} = 235.10\\times 100 = 23{,}510\\ \\Omega, \\qquad X_{m,HV} = 161.89\\times 100 = 16{,}189\\ \\Omega$$

**Trap named.** Multiplying by 10 instead of 100 is the single most common
error in this calculation, and it survives a plausibility check because the
answer is still "a smallish resistance". Always ask whether the reflected
value is bigger or smaller than the shunt value it must sit beside: an
equivalent series impedance of 0.15 Ω next to a 235 Ω magnetising branch is
sensible; 0.15 Ω next to 2.35 Ω is not.

### Worked example 6.2 — the same four numbers in per unit

Per-unit form makes the transformer comparable with every other one in the
system. On its own rating, **$Z_{base,HV} = 2{,}400^{2}/50{,}000 = 115.20\\ \\Omega$**, so

$$Z_{pu} = \\frac{4.7040}{115.20} = 0.04083, \\quad R_{pu} = \\frac{1.4976}{115.20} = 0.01300, \\quad X_{pu} = \\frac{4.4592}{115.20} = 0.03871$$

A "4.08 percent impedance" transformer, in nameplate language. The shortcut
worth knowing is that the same number falls straight out of the test voltage:

$$Z_{pu} = \\frac{V_{SC}}{V_{rated}} = \\frac{98}{2{,}400} = 0.04083$$

because the short-circuit test drives rated current, so the applied voltage
**is** the per-unit impedance. Likewise **$R_{pu} = P_{SC}/S_{rated} = 650/50{,}000 = 0.01300$**.
Two divisions, no ohms at all — and both work from either side of the
transformer, which is the whole point of per unit.

## 6.4 The two losses, drawn

Core loss is fixed by the applied voltage and therefore constant in service;
copper loss follows the square of load current. Writing the load fraction as
**$x = I/I_{rated}$**:

$$P_{loss}(x) = P_{core} + x^{2}P_{cu,FL} = 245 + 650x^{2}\\ \\mathrm{W}$$

![Core loss, copper loss and total loss of the 50 kVA unit against load fraction. Core loss is a flat 245 W line; copper loss is the parabola 650x squared; the two cross at load fraction 0.614, where total loss is 490 W and efficiency is at its maximum, well to the left of rated load.](/courses/fe-ee/figures/pow2-xfmr-loss-split.svg)

### Worked example 6.3 — efficiency at three operating points

Compute the efficiency of the 50 kVA unit at rated load, at the
maximum-efficiency point, and at quarter load, all at 0.8 power factor lagging.

**Rated load.** Output = 50,000 × 0.8 = 40,000 W; loss = 245 + 650 = 895 W:

$$\\eta = \\frac{40{,}000}{40{,}000+895} = 97.81\\%$$

**Maximum-efficiency point.** **$x^{*} = \\sqrt{245/650} = 0.6139$**, so output =
0.6139 × 50,000 × 0.8 = 24,558 W and loss = 2 × 245 = 490 W:

$$\\eta_{max} = \\frac{24{,}558}{24{,}558+490} = 98.04\\%$$

**Quarter load.** Output = 10,000 W; loss = 245 + 0.0625 × 650 = 285.6 W:

$$\\eta = \\frac{10{,}000}{10{,}285.6} = 97.22\\%$$

The peak is only 0.23 points above the rated-load value and 0.82 above quarter
load. Transformer efficiency curves are flat, which is why the exam can afford
to ask *where* the peak is rather than *how high* it is.

### Worked example 6.4 — what the tests do NOT tell you

A candidate is given the test data above and asked for the transformer's
**short-circuit current** if the secondary is bolted while rated voltage is
applied. Use the per-unit impedance:

$$I_{SC} = \\frac{I_{rated}}{Z_{pu}} = \\frac{20.833}{0.04083} = 510.2\\ \\mathrm{A} = 24.5\\times \\text{rated}$$

That is a valid first estimate and it is also incomplete: it ignores the source
impedance behind the transformer, which on a real feeder limits the current
further. The transformer impedance is a **lower bound** on the impedance of the
fault loop, so 24.5 per unit is the worst case the transformer itself allows.
That distinction — transformer impedance alone versus the whole Thévenin path —
is the bridge into the fault-analysis topic.`,
      examTip: 'Per unit turns the short-circuit test into two divisions: Z_pu = V_SC/V_rated and R_pu = P_SC/S_rated, both dimensionless and both independent of which winding was tested. If a question gives SC data and asks for percent impedance, you should not be computing any ohms at all.',
      importantNote: 'The OC test is run on the LOW-voltage side and the SC test on the HIGH-voltage side, for practical reasons: full rated voltage is easier to apply at 240 V, and rated current is easier to circulate at 98 V. The parameters therefore land on different sides, and one set must be reflected by a² before the two can be combined.',
    },
    {
      id: 'xfmr-regulation-banks',
      title: '7. Regulation, Parallel Banks, and Duty-Cycle Design',
      content: `## 7.1 Regulation across the power-factor range

Voltage regulation is the rise in secondary voltage when load is removed,
expressed as a fraction of the loaded value. Working per phase with the load
as reference, the sending voltage is

$$V_{S} = V_{R} + I\\,Z_{eq}, \\qquad \\mathrm{VR} = \\frac{|V_{S}|-|V_{R}|}{|V_{R}|}\\times 100\\%$$

The handbook approximation drops the quadrature term and leaves a form you can
evaluate mentally:

$$\\mathrm{VR} \\approx \\frac{I\\left(R_{eq}\\cos\\phi + X_{eq}\\sin\\phi\\right)}{V_{R}}\\times 100\\% = \\left(R_{pu}\\cos\\phi + X_{pu}\\sin\\phi\\right)\\times 100\\%$$

with **$\\sin\\phi$ taken negative for a leading load**. That sign is the whole
story. Because **$X_{pu} \\gg R_{pu}$** in any transformer, the reactive term
dominates, and a leading load subtracts it.

![Voltage regulation of the 50 kVA unit at rated current, swept from 0.5 leading through unity to 0.5 lagging power factor. The exact curve and the handbook approximation lie within a tenth of a point of one another across the range; regulation rises to about 4 percent at heavily lagging power factors and passes through zero at 0.941 leading, going negative beyond it.](/courses/fe-ee/figures/pow2-xfmr-regulation-pf.svg)

Reading the figure at three points, for **$R_{pu}=0.0130$** and
**$X_{pu}=0.0387$**:

| Load power factor | Approximate VR | Exact VR | Comment |
|---|---|---|---|
| 0.60 lagging | +3.88% | +3.88% | worst practical case |
| 0.80 lagging | +3.36% | +3.39% | the usual exam value |
| 1.00 | +1.30% | +1.37% | resistive term only |
| 0.941 leading | −0.09% | 0.00% | regulation vanishes |
| 0.80 leading | −1.28% | −1.21% | secondary rises under load |

### Worked example 7.1 — regulation the exact way, and the error you accept

Find the exact regulation of the 50 kVA unit at rated current and 0.8 power
factor lagging, and compare with the approximation.

Take **$V_{R} = 2{,}400\\angle 0^\\circ$** V referred to the HV side and
**$I = 20.833\\angle -36.87^\\circ$** A. Then

$$I Z_{eq} = (20.833\\angle -36.87^\\circ)(4.704\\angle 71.44^\\circ) = 98.0\\angle 34.57^\\circ = 80.7 + j55.6$$

$$V_{S} = 2{,}400 + 80.7 + j55.6 = 2{,}480.7 + j55.6 = 2{,}481.3\\ \\mathrm{V}$$

$$\\mathrm{VR} = \\frac{2{,}481.3-2{,}400}{2{,}400}\\times 100 = 3.39\\%$$

The approximation gives **$(0.0130)(0.8)+(0.0387)(0.6) = 0.03363$**, or 3.36
percent — low by 0.03 points, an error of under one percent of the answer. The
approximation drops the **$j55.6$** term, and a quadrature addition of 55.6 to
2,480.7 changes the magnitude by only 0.62 V. That is why the approximation
survives: the quadrature component enters as a square root of a sum of squares
and is therefore second order.

### Worked example 7.2 — the power factor at which regulation disappears

At what leading power factor does this transformer have zero regulation?

Set the approximation to zero: **$R_{pu}\\cos\\phi = X_{pu}\\sin\\phi$**, so

$$\\tan\\phi = \\frac{R_{pu}}{X_{pu}} = \\frac{0.0130}{0.0387} = 0.3359 \\;\\Rightarrow\\; \\phi = 18.57^\\circ\\ \\text{leading}$$

giving pf = 0.948 leading. Solving the exact expression numerically returns
**0.941 leading**, the point marked on the figure. Beyond it the secondary
voltage under load exceeds its no-load value — a capacitive load pushing the
voltage up, which is the same physics as the Ferranti effect on a lightly
loaded line and the reason a large capacitor bank switched onto a lightly
loaded transformer can cause an overvoltage trip.

## 7.2 Two transformers in parallel: the capacity you actually get

Section 5.3 gave the sharing rule. What it did not give is the consequence,
which is where the marks are. Two units in parallel share load in proportion
to **rating divided by per-unit impedance**:

$$\\frac{S_{1}}{S_{2}} = \\frac{S_{1,rated}/Z_{pu,1}}{S_{2,rated}/Z_{pu,2}}$$

![Loading of two paralleled transformers as the bus load grows: a 500 kVA unit at 5 percent impedance and a 300 kVA unit at 6 percent, each plotted as a percentage of its own nameplate. The 500 kVA unit rises twice as fast and reaches 100 percent when the bus carries 750 kVA, at which point the 300 kVA unit is only 83 percent loaded, so 50 of the 800 kVA of installed capacity is unreachable.](/courses/fe-ee/figures/pow2-xfmr-parallel-share.svg)

### Worked example 7.3 — how much of the bank you can use

A 500 kVA transformer of 5 percent impedance is paralleled with a 300 kVA unit
of 6 percent. Find the share fractions and the maximum bus load.

$$k_{1} = \\frac{500}{0.05} = 10{,}000, \\qquad k_{2} = \\frac{300}{0.06} = 5{,}000$$

$$f_{1} = \\frac{10{,}000}{15{,}000} = 0.6667, \\qquad f_{2} = 0.3333$$

The 500 kVA unit reaches rating when **$0.6667 S_{bus} = 500$**, that is at
**$S_{bus} = 750$ kVA**; the 300 kVA unit would not reach rating until 900 kVA.
The binding constraint is the first:

$$S_{usable} = 750\\ \\mathrm{kVA} \\ \\text{of}\\ 800\\ \\mathrm{kVA}\\ \\text{installed} = 93.75\\%$$

At 750 kVA the small unit is at 250/300 = 83.3 percent. **Trap named.** The
tempting answer is 800 kVA, the sum of the nameplates. That is only correct
when the per-unit impedances are equal, and it is why matching impedance
matters more than matching rating.

## 7.3 Where the autotransformer stops paying

The advantage factor derived in Section 5.2 is worth plotting rather than
memorising, because it collapses fast. With **$k = V_{H}/V_{L}$**:

$$\\frac{S_{auto}}{S_{two\\text{-}winding}} = \\frac{V_{H}}{V_{H}-V_{L}} = \\frac{k}{k-1}$$

![Autotransformer throughput advantage against voltage ratio. The curve k over k minus one falls steeply: at a ratio of 1.25 the advantage is five times, at 2 to 1 it is only double, and by 4 to 1 it is down to 1.33, so the connection earns its lack of isolation only when the two voltages are close together.](/courses/fe-ee/figures/pow2-xfmr-auto-advantage.svg)

### Worked example 7.4 — a 10 kVA winding pair carrying 50 kVA

A 10 kVA, 480/120 V two-winding transformer is reconnected as a 600/480 V
step-up autotransformer. Find the throughput rating and the current in each
winding.

The 120 V winding is the series element, rated
**$10{,}000/120 = 83.33$ A**, and that current is the high-side line current:

$$S_{auto} = 600\\times 83.333 = 50{,}000\\ \\mathrm{VA} = 5\\times S_{two\\text{-}winding}$$

$$I_{L} = \\frac{50{,}000}{480} = 104.17\\ \\mathrm{A}, \\qquad I_{common} = 104.167-83.333 = 20.83\\ \\mathrm{A}$$

and 20.83 A at 480 V is exactly 10 kVA — the common winding is respected too.
Of the 50 kVA throughput, **10 kVA is transformed magnetically and 40 kVA is
conducted**, which is why the core does not need to grow. Compare with the
Section 5.2 example, a 2640/240 connection of ratio 11, whose advantage was 11
times; the advantage is always the connection ratio
**$V_{H}/(V_{H}-V_{L})$** and nothing else.

## 7.4 Designing for the duty cycle, not the nameplate

Section 4.2 computed all-day efficiency for one duty cycle. The design question
behind it is which loss to buy down. Core loss is billed for all 8,760 hours of
the year; copper loss is billed only when current flows. Put the 50 kVA unit on

| Hours | Load fraction | Power factor | Output energy | Total loss energy |
|---|---|---|---|---|
| 6 | 0.20 | 0.90 | 54.0 kWh | 1.626 kWh |
| 10 | 0.50 | 0.90 | 225.0 kWh | 4.075 kWh |
| 6 | 0.90 | 0.85 | 229.5 kWh | 4.629 kWh |
| 2 | 0 (energised) | — | 0 | 0.490 kWh |
| **Totals** | | | **508.5 kWh** | **10.820 kWh** |

$$\\eta_{all\\text{-}day} = \\frac{508.5}{508.5+10.820} = 97.92\\%$$

Of the 10.82 kWh of loss, **5.88 kWh is core loss** (245 W for 24 hours) — 54
percent of the total, on a machine whose copper loss is 2.7 times its core loss
at full load. Halving the core loss would save 2.94 kWh a day; halving the
full-load copper loss would save only 2.47 kWh.

![Peak power efficiency and 24-hour energy efficiency of the 50 kVA unit plotted against core loss, with full-load copper loss held at 650 watts and the duty cycle fixed. Both fall as core loss rises, but the energy efficiency falls roughly twice as fast, so the gap between the two widens from about a quarter of a point at 100 watts to more than a point and a half at 800 watts.](/courses/fe-ee/figures/pow2-xfmr-allday-duty.svg)

The two curves diverge because the peak-efficiency figure is evaluated at a
load fraction that itself moves with core loss, while the energy figure charges
core loss for the full day regardless. A designer reading only the peak number
would accept a cheaper, lossier core; the utility paying the bill reads the
lower curve.`,
      examTip: 'Regulation questions almost always want (R_pu·cos φ + X_pu·sin φ) with sin φ NEGATIVE for a leading load. That one sign converts a positive regulation into a negative one and is the difference between the right answer and the distractor placed directly beside it.',
      importantNote: 'Two transformers in parallel do not deliver the sum of their nameplates unless their per-unit impedances match. Compute the share taken by each unit, find which one saturates first, and report the bus load at that point — the unusable remainder is the answer the question is really testing.',
    },
    {
      id: 'xfmr-problem-set-a',
      title: '8. Problem Set A: Test Data, Losses, and Efficiency',
      content: `A single 25 kVA, 2400/240 V, 60 Hz transformer runs through the whole
set. Its test report reads: open circuit on the LV side, 240 V, 1.20 A, 130 W;
short circuit on the HV side, 65 V at rated current, 320 W.

## 8. Problem Set A — equivalent circuit, losses, and efficiency

Six problems, roughly three minutes each. Full solutions follow.

### The problems

**A1.** From the open-circuit data, find the core-loss resistance and the
magnetising reactance referred to the 240 V side, and the exciting current as
a percentage of rated.

**A2.** From the short-circuit data, find **$R_{eq}$**, **$X_{eq}$** and
**$Z_{eq}$** referred to the 2400 V side, and express the impedance in per
unit on the transformer rating.

**A3.** Find the efficiency at half load and 0.9 power factor lagging.

**A4.** Find the load fraction at which efficiency is maximum, and the
efficiency there at 0.9 power factor.

**A5.** The transformer supplies a load of **$8 + j6\\ \\Omega$** on its 240 V
side. Find the impedance seen looking into the 2400 V terminals, ignoring the
transformer's own impedance.

**A6.** The unit carries full load at 0.9 power factor for 8 hours, half load
at 0.9 for 8 hours, and no load for 8 hours. Find the all-day efficiency.

### Solutions

**A1.** Conductance from real power, admittance from current:

$$G_{c} = \\frac{130}{240^{2}} = 2.2569\\times10^{-3}\\ \\mathrm{S} \\;\\Rightarrow\\; R_{c} = 443.1\\ \\Omega$$

$$|Y| = \\frac{1.20}{240} = 5.000\\times10^{-3}\\ \\mathrm{S}, \\quad B_{m} = \\sqrt{5.000^{2}-2.2569^{2}}\\times10^{-3} = 4.4616\\times10^{-3}\\ \\mathrm{S}$$

so **$X_{m} = 224.1\\ \\Omega$**. Rated LV current is 25,000/240 = 104.17 A, so
the exciting current is **1.20/104.17 = 1.15 percent** of rated.
*Distractor:* taking **$X_{m} = V/I = 200\\ \\Omega$** ignores that the 1.20 A has
a real component; the error is 12 percent.

**A2.** Rated HV current is 25,000/2,400 = 10.417 A.

$$Z_{eq} = \\frac{65}{10.417} = 6.240\\ \\Omega, \\qquad R_{eq} = \\frac{320}{10.417^{2}} = 2.9491\\ \\Omega$$

$$X_{eq} = \\sqrt{6.240^{2}-2.9491^{2}} = 5.4991\\ \\Omega$$

In per unit, either divide by **$Z_{base}=2{,}400^{2}/25{,}000 = 230.4\\ \\Omega$**
or use the shortcut:

$$Z_{pu} = \\frac{65}{2{,}400} = 0.02708, \\qquad R_{pu} = \\frac{320}{25{,}000} = 0.01280$$

*Distractor:* 65/2,400 is sometimes misread as a percentage of the low side;
it is a percentage of the tested winding's rated voltage, which here is 2,400 V.

**A3.** Output = 0.5 × 25,000 × 0.9 = 11,250 W. Loss = 130 + (0.5)²(320) = 210 W.

$$\\eta = \\frac{11{,}250}{11{,}250+210} = 98.17\\%$$

*Distractor:* halving the copper loss instead of quartering it gives 290 W of
loss and 97.49 percent.

**A4.** **$x^{*} = \\sqrt{130/320} = 0.6374$**. Output = 0.6374 × 25,000 × 0.9 =
14,341 W, loss = 2 × 130 = 260 W:

$$\\eta_{max} = \\frac{14{,}341}{14{,}341+260} = 98.22\\%$$

*Distractor:* the peak is NOT at full load; full load gives 98.04 percent here.

**A5.** The turns ratio is 10, so impedance reflects by 100:

$$Z_{HV} = 10^{2}(8+j6) = 800 + j600\\ \\Omega = 1{,}000\\angle 36.87^\\circ\\ \\Omega$$

*Distractor:* multiplying by 10 gives 80 + j60 Ω and a load current ten times
too large — the classic **$n$ instead of $n^{2}$** slip.

**A6.** Output energy = 8(25 × 0.9) + 8(12.5 × 0.9) = 180 + 90 = **270 kWh**.
Loss energy: core runs 24 hours at 130 W = 3.12 kWh; copper runs 8 h at 320 W
and 8 h at 80 W = 2.56 + 0.64 = 3.20 kWh.

$$\\eta_{all\\text{-}day} = \\frac{270}{270+6.32} = 97.71\\%$$

*Distractor:* charging core loss only for the 16 loaded hours gives 98.08
percent. The transformer is energised for all 24.`,
      examTip: 'The exciting current in a healthy transformer is well under five percent of rated, and the short-circuit voltage is two to ten percent of rated. If your reduction of test data produces numbers outside those bands, you have almost certainly used the wrong rated current or the wrong side.',
      importantNote: 'Every quantity in this set exists on a specific side of the transformer. Write "referred to HV" or "referred to LV" beside each answer as you get it. Combining an HV series impedance with an LV shunt impedance without reflecting one of them is the error that survives every plausibility check.',
    },
    {
      id: 'xfmr-problem-set-b',
      title: '9. Problem Set B: Regulation, Banks, and Parallel Operation',
      content: `These six use the same 25 kVA unit where a transformer is needed, and
extend to the three-phase and multi-unit questions that follow it.

## 9. Problem Set B — regulation, three-phase banks, parallel operation

### The problems

**B1.** The 25 kVA unit of Problem Set A has **$R_{pu}=0.0128$** and
**$X_{pu}=0.0239$**. Find the voltage regulation at rated current and 0.85
power factor lagging.

**B2.** Find the regulation of the same unit at rated current and 0.85 power
factor **leading**, and state what the sign means physically.

**B3.** Three 50 kVA, 7200/240 V single-phase transformers form a Δ–Y bank.
Find the line-to-line voltage on each side, the bank rating, and the
low-voltage line current at rated load.

**B4.** One unit of that bank fails and is removed. Find the rating of the
remaining open-delta bank and express it as a percentage of the original.

**B5.** A 250 kVA transformer of 4 percent impedance is paralleled with a
400 kVA unit of 6 percent. Find the maximum bus load before either is
overloaded.

**B6.** A 15 kVA, 7200/600 V transformer is reconnected as a 7800/7200 V
step-up autotransformer. Find its throughput rating and the current in the
series winding.

### Solutions

**B1.** **$\\phi = \\arccos 0.85 = 31.79^\\circ$**, **$\\sin\\phi = 0.5268$**:

$$\\mathrm{VR} \\approx (0.0128)(0.85)+(0.0239)(0.5268) = 0.01088+0.01259 = 0.02347$$

or **2.35 percent**. Solving **$|V_{R}+IZ_{eq}|$** exactly returns 2.356
percent, so the approximation is good to nine thousandths of a point here.

**B2.** With a leading load the reactive term reverses sign:

$$\\mathrm{VR} \\approx (0.0128)(0.85)-(0.0239)(0.5268) = -0.00171 = -0.171\\%$$

The exact value is −0.134 percent. A **negative regulation means the secondary
voltage is higher on load than off it**: the capacitive load current, flowing
through the leakage reactance, produces a voltage rise rather than a drop.
*Distractor:* +2.35 percent, obtained by ignoring the lead.

**B3.** Delta on the high side, so **$V_{LL,HV} = 7{,}200$ V**. Wye on the low
side, so **$V_{LL,LV} = 240\\sqrt{3} = 415.7$ V**. The bank rating is the sum
of the three units, **150 kVA**, and

$$I_{L,LV} = \\frac{150{,}000}{\\sqrt{3}\\times 415.7} = 208.3\\ \\mathrm{A}$$

which is exactly each unit's rated 240 V winding current, as it must be for a
wye secondary. *Distractor:* calling the LV line voltage 240 V forgets that a
wye secondary multiplies the winding voltage by √3.

**B4.** Two single-phase units in open delta deliver

$$S_{open\\Delta} = \\sqrt{3}\\times 50 = 86.60\\ \\mathrm{kVA}$$

which is **57.7 percent** of the 150 kVA three-unit bank, and 86.6 percent of
the 100 kVA of iron still connected. *Distractor:* 100 kVA — the two remaining
units cannot be loaded to their nameplate, because in open delta the winding
currents are no longer in phase with their winding voltages.

**B5.** Share factors:

$$k_{1} = \\frac{250}{0.04} = 6{,}250, \\qquad k_{2} = \\frac{400}{0.06} = 6{,}667$$

$$f_{1} = \\frac{6{,}250}{12{,}917} = 0.4839, \\qquad f_{2} = 0.5161$$

The 250 kVA unit saturates at **$250/0.48384 = 516.7$ kVA** of bus load; the
400 kVA unit would not saturate until 775 kVA. So the answer is **516.7 kVA**,
just 79.5 percent of the 650 kVA installed. *Distractor:* 650 kVA assumes
matched impedances.

**B6.** The 600 V winding becomes the series element:

$$S_{auto} = 15\\times\\frac{7{,}800}{600} = 195\\ \\mathrm{kVA}$$

$$I_{series} = \\frac{195{,}000}{7{,}800} = 25.0\\ \\mathrm{A} = \\frac{15{,}000}{600}$$

The series winding carries exactly its two-winding rated current, and the
common 7,200 V winding carries the difference,
**$195{,}000/7{,}200 - 25.0 = 2.08$ A**, which at 7,200 V is again 15 kVA.
*Distractor:* 15 kVA — the nameplate of the two-winding unit, which is only
the magnetically transferred part; the other 180 kVA is conducted.`,
      examTip: 'Bank questions turn on one decision made before any arithmetic: is the quantity you are given a WINDING quantity or a LINE quantity? Write the connection (Δ or Y) beside each side of the bank, apply √3 exactly once per wye, and the rest is division.',
      importantNote: 'Open-delta capacity is √3 times ONE unit, not two — 57.7 percent of the full bank. The factor is 1/√3 relative to the two remaining units because their currents are 30 degrees out of phase with their voltages once the third leg is gone.',
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
    {
      id: 'pu-impedance-diagram',
      title: '6. Building an Impedance Diagram From Nameplates',
      content: `## 6.1 A four-zone system, and one base decision

Section 4 walked a three-zone system. This one is larger, deliberately: five
series elements, four voltage levels, and one piece of equipment whose
nameplate voltage does **not** match its zone base — which is where most
per-unit marks are actually lost.

| Element | Nameplate | Impedance (own base) |
|---|---|---|
| Generator G | 90 MVA, 13.8 kV | X″ = 0.18 pu |
| Transformer T1 | 100 MVA, 13.8/138 kV | X = 0.10 pu |
| Transmission line | 138 kV | X = 32 Ω |
| Transformer T2 | 50 MVA, 138/13.2 kV | X = 0.08 pu |
| Transformer T3 | 15 MVA, 13.2/4.16 kV | X = 0.06 pu |
| Motor M | 8 MVA, **4.00 kV** | X″ = 0.20 pu |

Choose **$S_{base} = 100$ MVA** everywhere and **$V_{base} = 138$ kV** in the
transmission zone. Every other base voltage now follows from the transformer
ratios and nothing else — not from what the equipment is rated at, and not
from what the operator calls the bus.

## 6.2 Base quantities in every zone

$$V_{base,zone} = V_{base,ref}\\times \\prod \\left(\\text{turns ratios crossed}\\right), \\qquad Z_{base} = \\frac{V_{base}^{2}}{S_{base}}, \\qquad I_{base} = \\frac{S_{base}}{\\sqrt{3}\\,V_{base}}$$

| Zone | V_base | Z_base | I_base |
|---|---|---|---|
| Generator | 13.80 kV | 1.9044 Ω | 4,184 A |
| Transmission | 138.0 kV | 190.44 Ω | 418.4 A |
| Distribution | 13.20 kV | 1.7424 Ω | 4,374 A |
| Motor bus | 4.160 kV | 0.17306 Ω | 13,879 A |

![Base current and base impedance in each of the four zones of the study system on a 100 MVA base, both on logarithmic axes. Base current spans 418 amperes at 138 kilovolts to 13,879 amperes at 4.16 kilovolts, a factor of 33, while base impedance spans 0.173 ohms to 190 ohms, a factor of 1,100 — and the per-unit description of the same equipment does not move at all.](/courses/fe-ee/figures/pow2-pu-base-ladder.svg)

That figure is the argument for per unit in one image. The **same 100 MVA**
appears as 418 A in one zone and 13,879 A in another, and the same fraction of
it is 1.0 pu in both.

### Worked example 6.1 — propagating base voltage through a chain

A 13.8 kV generator feeds a 13.8/138 kV step-up, a 138/69 kV autotransformer,
and a 69/12.47 kV distribution transformer. On a 100 MVA base referenced to
the generator, find the base voltage, impedance and current in each of the
four zones.

Multiply by each turns ratio in turn:

$$13.8 \\to 13.8\\times\\frac{138}{13.8} = 138\\ \\mathrm{kV} \\to 138\\times\\frac{69}{138} = 69\\ \\mathrm{kV} \\to 69\\times\\frac{12.47}{69} = 12.47\\ \\mathrm{kV}$$

$$Z_{base} = \\frac{(138)^{2}}{100} = 190.44\\ \\Omega, \\quad \\frac{(69)^{2}}{100} = 47.61\\ \\Omega, \\quad \\frac{(12.47)^{2}}{100} = 1.555\\ \\Omega$$

with base currents 418.4 A, 836.7 A and 4,630 A. **Trap named.** The 69 kV
zone base is 69 kV because the transformer says so, even if the line is
operated at 66 kV. Base voltage is a bookkeeping choice propagated by turns
ratios; operating voltage is a measurement, and confusing the two puts a
correction factor where none belongs.

## 6.3 Re-basing every nameplate onto the study base

$$Z_{pu,new} = Z_{pu,old}\\times\\frac{S_{base,new}}{S_{base,old}}\\times\\left(\\frac{V_{base,old}}{V_{base,new}}\\right)^{2}$$

| Element | Calculation | Result |
|---|---|---|
| Generator | $0.18\\times(100/90)\\times(13.8/13.8)^{2}$ | 0.2000 pu |
| T1 | $0.10\\times(100/100)$ | 0.1000 pu |
| Line | $32/190.44$ | 0.1680 pu |
| T2 | $0.08\\times(100/50)$ | 0.1600 pu |
| T3 | $0.06\\times(100/15)$ | 0.4000 pu |
| Motor | $0.20\\times(100/8)\\times(4.00/4.16)^{2}$ | 2.3114 pu |

The motor is the interesting row. Its nameplate says 4.00 kV, its zone base is
4.16 kV, and the squared ratio is **$(4.00/4.16)^{2} = 0.9246$**. Omit it and
you get 2.5000 pu — **8.2 percent high**, which propagates straight into the
fault current and the starting dip.

### Worked example 6.2 — an impedance given in ohms, on the wrong side

The 32 Ω line reactance was measured at 138 kV, so it divides by the 138 kV
zone base. Suppose instead a report gives the same line as **1,270 Ω referred
to the 13.8 kV generator side**. Confirm the two are the same per-unit value.

Referring 138 kV ohms down to 13.8 kV divides by the square of the turns
ratio, **$(138/13.8)^{2} = 100$**, so 32 Ω becomes 0.32 Ω — not 1,270 Ω.
Referring **up** multiplies by 100: 1,270 Ω on the 13.8 kV side is 127,000 Ω at
138 kV, which is absurd for a line. The report is wrong by a factor of 100 in
the direction of the referral, and per unit catches it instantly:

$$\\frac{1{,}270}{1.9044} = 666.9\\ \\mathrm{pu}$$

A line reactance of 667 pu is impossible; transmission lines land between 0.05
and 0.6 pu on a 100 MVA base. **That plausibility band is the reason to work in
per unit at all** — an ohmic error of a factor of 100 looks like just another
big number, and a per-unit error of a factor of 100 looks like nonsense.

## 6.4 The fault answer, at four buses at once

With the impedance diagram built, a three-phase fault at any bus is one
division. The Thévenin reactance is the running sum from the source, and

$$S_{fault} = \\frac{S_{base}}{X_{th,pu}}, \\qquad I_{fault} = \\frac{I_{base,zone}}{X_{th,pu}}$$

![Cumulative source reactance to each of the four buses and the fault duty it produces. The reactance climbs from 0.200 per unit at the generator terminals through 0.300 and 0.628 to 1.028 per unit at the motor bus, and the fault duty falls correspondingly from 500 MVA to 333 MVA, 159 MVA and 97.3 MVA.](/courses/fe-ee/figures/pow2-pu-impedance-stack.svg)

| Fault at | X_th (pu) | Fault MVA | Fault current |
|---|---|---|---|
| Bus 1, 13.8 kV | 0.2000 | 500.0 | 20,918 A |
| Bus 2, 138 kV | 0.3000 | 333.3 | 1,394.6 A |
| Bus 3, 13.2 kV | 0.6280 | 159.2 | 6,964 A |
| Bus 4, 4.16 kV | 1.0280 | 97.27 | 13,500 A |

Note that the fault **current** is not monotone even though the fault **MVA**
is: bus 3 sees fewer MVA than bus 2 but five times the amperes, because its
base current is ten times larger. Any answer given in amperes has to name its
voltage level.

### Worked example 6.3 — the same fault, computed in ohms as a check

Verify the 138 kV bus result without per unit. Referred to 138 kV, the
generator reactance is
**$0.18\\times(13.8^{2}/90)\\times(138/13.8)^{2} = 0.18\\times 2.116\\times 100 = 38.09\\ \\Omega$**
and T1 is **$0.10\\times(138^{2}/100) = 19.044\\ \\Omega$**. The total is 57.13 Ω, so

$$I_{f} = \\frac{138{,}000/\\sqrt{3}}{57.13} = \\frac{79{,}674}{57.13} = 1{,}394.6\\ \\mathrm{A}$$

identical to the per-unit answer, and roughly four times the work — with two
extra opportunities to drop a factor of 100.

### Worked example 6.4 — expressing a measurement in per unit

A relay reports 1,200 A flowing at the 4.16 kV motor bus. Express it in per
unit on the study base, and state the loading of the 8 MVA motor.

$$I_{pu} = \\frac{1{,}200}{13{,}879} = 0.0865\\ \\mathrm{pu} \\;\\Rightarrow\\; S = 0.0865\\times 100 = 8.65\\ \\mathrm{MVA}$$

which is **108 percent** of the motor's 8 MVA rating. Per unit converted a
relay reading into a loading percentage in two divisions and without any
mention of √3, because the √3 is already inside the base current.`,
      examTip: 'Fix S_base once, then let V_base ride the turns ratios and nothing else. Every downstream quantity — Z_base, I_base, and every re-based impedance — is then mechanical. The only judgement call in the whole procedure is which zone you write the reference voltage in, and that choice never changes any per-unit answer.',
      importantNote: 'The squared voltage ratio in the re-basing formula equals 1 only when the equipment nameplate voltage matches the zone base. The 4.00 kV motor on a 4.16 kV base in this system carries a factor of 0.9246, and dropping it inflates every result that depends on that machine by 8.2 percent.',
    },
    {
      id: 'pu-stress-cases',
      title: '7. Per-Unit Under Stress: Off-Nominal Ratios and Machine Contributions',
      content: `## 7.1 How much the squared term is worth

The re-basing formula has three factors and only one of them is routinely
dropped. Hold a 0.20 pu machine impedance fixed, put it on a 13.8 kV zone base,
and vary its nameplate voltage:

$$Z_{new} = 0.20\\times\\left(\\frac{V_{nameplate}}{13.8}\\right)^{2}$$

![The re-based impedance of a 0.20 per-unit machine as its nameplate voltage is swept around a 13.8 kilovolt zone base, with the error caused by omitting the squared voltage term plotted beneath it. A 13.2 kilovolt machine re-bases to 0.1830 per unit, so ignoring the term overstates it by 9.3 percent; a 12.5 kilovolt machine would be overstated by 22 percent.](/courses/fe-ee/figures/pow2-pu-rebase-sensitivity.svg)

| Nameplate | Factor | Re-based Z | Error if omitted |
|---|---|---|---|
| 12.5 kV | 0.8205 | 0.1641 pu | +21.9% |
| 13.2 kV | 0.9149 | 0.1830 pu | +9.3% |
| 13.8 kV | 1.0000 | 0.2000 pu | 0% |
| 14.4 kV | 1.0889 | 0.2178 pu | −8.2% |

The errors are not small and they are not symmetric. A 13.2 kV generator on a
13.8 kV base — an entirely ordinary situation, since 13.8 kV is a standard
system voltage and 13.2 kV is a standard machine voltage — carries a 9.3
percent error, which lands directly on a breaker duty calculation.

### Worked example 7.1 — a round trip through ohms

A transformer has 6 percent impedance on its own 20 MVA, 13.8 kV rating.
Convert it to ohms, then onto a 100 MVA, 13.2 kV base, and confirm the two
routes agree.

**Via ohms.** **$Z_{base,own} = 13.8^{2}/20 = 9.522\\ \\Omega$**, so
**$Z = 0.06\\times 9.522 = 0.5713\\ \\Omega$**. The new base impedance is
**$13.2^{2}/100 = 1.7424\\ \\Omega$**, giving

$$Z_{pu,new} = \\frac{0.5713}{1.7424} = 0.3279\\ \\mathrm{pu}$$

**Via the formula.**

$$Z_{pu,new} = 0.06\\times\\frac{100}{20}\\times\\left(\\frac{13.8}{13.2}\\right)^{2} = 0.06\\times 5\\times 1.0930 = 0.3279\\ \\mathrm{pu}$$

Identical, as they must be — the formula is only the ohmic route with the ohms
cancelled out. Doing it both ways once is the fastest way to stop distrusting
the formula under exam pressure.

## 7.2 Motors are generators, for about five cycles

A per-unit diagram built only from the utility path understates fault duty,
sometimes badly. Every rotating machine on the bus has stored magnetic energy
and inertia, and for the first cycles of a fault it behaves as a voltage behind
its subtransient reactance — a **source**, feeding the fault from the load
side. Its impedance therefore appears in **parallel** with the source path:

$$X_{eq} = \\frac{X_{th}X_{motor}}{X_{th}+X_{motor}}, \\qquad S_{fault} = \\frac{S_{base}}{X_{eq}}$$

![Three-phase fault duty at the 4.16 kilovolt motor bus as the connected motor rating grows from zero to 20 megavolt-amperes. The utility path alone gives 97.3 megavolt-amperes; an 8 megavolt-ampere motor at 0.20 per-unit subtransient reactance adds 43.3 more, a 44 percent increase in the duty the breaker must interrupt.](/courses/fe-ee/figures/pow2-pu-motor-contribution.svg)

### Worked example 7.2 — the motor contribution at bus 4

Add the 8 MVA motor to the bus-4 fault of Section 6.4. Its re-based reactance
is 2.3114 pu, in parallel with the 1.0280 pu source path:

$$X_{eq} = \\frac{(1.0280)(2.3114)}{1.0280+2.3114} = \\frac{2.3761}{3.3394} = 0.7116\\ \\mathrm{pu}$$

$$S_{fault} = \\frac{100}{0.7116} = 140.5\\ \\mathrm{MVA}, \\qquad I_{f} = \\frac{13{,}879}{0.7116} = 19{,}505\\ \\mathrm{A}$$

The motor added **43.3 MVA, or 44 percent**. A switchgear lineup selected for
the 97.3 MVA utility contribution would be under-rated by the motors it was
installed to serve. **Trap named.** The tempting simplification is that load
absorbs fault current. Passive load does; rotating load supplies it, and the
distinction is worth 44 percent here.

## 7.3 Starting a motor: the same divider, different impedance

A locked rotor is an impedance, and its per-unit value comes from the
locked-rotor apparent power exactly as a fault impedance comes from fault MVA:

$$Z_{LR,pu} = \\frac{S_{base}}{S_{LR}}\\times\\left(\\frac{V_{rated}}{V_{base}}\\right)^{2}, \\qquad V_{bus} = \\frac{Z_{LR}}{Z_{LR}+Z_{th}} = \\frac{1}{1+S_{LR}/S_{SC}}$$

![Bus voltage during a direct-on-line motor start plotted against the ratio of locked-rotor kilovolt-amperes to the bus short-circuit kilovolt-amperes. The curve is the reciprocal of one plus that ratio, so a ten percent ratio holds 0.909 per unit and a twenty-five percent ratio drops to 0.80; the worked case of a 2 megavolt-ampere motor at six times rated current on a 97.3 megavolt-ampere bus sits at 0.882 per unit.](/courses/fe-ee/figures/pow2-pu-motor-start-dip.svg)

### Worked example 7.3 — will the contactors hold?

Start a 2 MVA, 4.00 kV motor with a locked-rotor current six times rated,
direct on line, at bus 4 of the study system.

$$Z_{LR} = \\frac{100}{6\\times 2}\\times\\left(\\frac{4.00}{4.16}\\right)^{2} = 8.3333\\times 0.92456 = 7.7046\\ \\mathrm{pu}$$

$$V_{bus} = \\frac{7.7046}{7.7046+1.0280} = 0.8823\\ \\mathrm{pu} = 3{,}670\\ \\mathrm{V}$$

An 11.8 percent dip. Most contactors drop out somewhere between 0.70 and 0.80
pu, so this start is acceptable; a dip past 0.80 pu would demand a reduced-
voltage starter or a stiffer supply. Note that the answer needed no
transformer ratios and no amperes — only two per-unit impedances.

## 7.4 Single-phase bases, sequence bases, and per-unit load

Three loose ends that the exam reaches for once the mechanics are secure.

**Single-phase versus three-phase.** The per-phase and three-phase conventions
give the **same** base impedance:

$$Z_{base} = \\frac{(V_{LL})^{2}}{S_{3\\phi}} = \\frac{(V_{LN})^{2}}{S_{1\\phi}}$$

because both numerator and denominator carry a factor of 3. Only base current
differs, by √3. So a problem stated entirely in line-to-line kV and total MVA
needs no √3 anywhere until amperes are requested.

**Sequence networks.** Positive-, negative- and zero-sequence networks all use
the **same** bases. A generator with **$X_{1}=0.20$**, **$X_{2}=0.18$** and
**$X_{0}=0.07$** pu has all three on its own rating, and all three re-base with
the identical formula. That is why symmetrical-component fault formulas can add
sequence impedances directly.

**Load in per unit.** A constant-impedance load of **$S_{L}$** at rated voltage
has

$$Z_{load,pu} = \\frac{S_{base}}{S_{L}}\\angle \\arccos(\\mathrm{pf})$$

so a 20 MVA, 0.9 pf load on a 100 MVA base is **$5.0\\angle 25.84^\\circ$ pu**.
Large per-unit impedance means light load — the reciprocal relationship that
makes a per-unit diagram readable at a glance.

### Worked example 7.4 — voltage drop on a per-unit feeder

A feeder of **$0.02 + j0.06$ pu** delivers 0.8 pu at 0.9 power factor lagging,
with the load bus held at 1.00 pu. Find the sending-end voltage.

$$I = 0.8\\angle -25.84^\\circ\\ \\mathrm{pu}, \\qquad V_{S} = 1.00 + (0.8\\angle -25.84^\\circ)(0.0632\\angle 71.57^\\circ)$$

$$V_{S} = 1.00 + 0.0506\\angle 45.73^\\circ = 1.0353 + j0.0362 = 1.0360\\ \\mathrm{pu}$$

a 3.60 percent drop along the feeder. The approximation
**$I(R\\cos\\phi + X\\sin\\phi) = 0.8(0.018+0.02615) = 0.0353$** gives 3.53
percent. Both are per-unit numbers that transfer unchanged to any voltage
level this feeder might be built at, which is the property no ohmic
calculation has.

## 7.5 Reading a per-unit diagram for errors

The most underrated benefit of per unit is not the arithmetic it saves but the
mistakes it exposes. Because every impedance in a healthy power system lands
inside a narrow band once it is expressed on a common base, a diagram can be
audited by eye before a single calculation is attempted. On a 100 MVA base:

| Element | Typical per-unit range | What a value outside it means |
|---|---|---|
| Generator subtransient $X''$ | 0.15 – 0.30 on its own rating | wrong base MVA, usually by a factor of 10 |
| Transformer impedance | 0.05 – 0.12 on its own rating | percent read as a fraction, or the reverse |
| Transmission line, 100 km | 0.05 – 0.60 | ohms divided by the wrong zone base |
| Distribution feeder, 1 km | 0.01 – 0.10 | line-to-neutral voltage used for $Z_{base}$ |
| Rated load impedance | 0.8 – 1.5 | apparent power confused with real power |
| Locked-rotor motor | $S_{base}/S_{LR}$, often 5 – 60 | rated rather than locked-rotor kVA used |

Three habits follow from that table. First, **re-base everything before you
combine anything**, because two impedances on different bases look perfectly
compatible and add to nonsense. Second, **write the base beside every number**
until the diagram is complete; "0.08" is not an impedance, "0.08 pu on 50 MVA"
is. Third, **check the total**. A Thévenin reactance from a strong grid to a
distribution bus should land somewhere between 0.3 and 1.5 pu; 0.03 pu implies
a fault duty of 3,300 MVA at a 4 kV bus, which no such bus has, and 15 pu
implies a supply too weak to start anything on it.

The same reasoning runs backwards and is worth practising, because examiners
like it. A switchgear nameplate reading 250 MVA is telling you the Thévenin
impedance behind it is 100/250 = 0.40 pu; a transformer stamped 5.75 percent on
30 MVA is 0.192 pu on a 100 MVA base; a motor whose starting current is quoted
as 6.5 per unit has a locked-rotor impedance of 1/6.5 = 0.154 pu on its own
rating. Each of those conversions is one division, and each turns a piece of
equipment documentation directly into a component of the impedance diagram.
None of them requires knowing a single voltage level, a single winding
connection, or a single ampere, which is exactly why a per-unit diagram can be
assembled from a stack of nameplates and audited by a reviewer who has never
seen the site.`,
      examTip: 'Locked-rotor impedance, fault impedance and load impedance are all S_base divided by an apparent power, times the off-nominal voltage correction. Recognising that one pattern turns three apparently different question types into the same two-line calculation.',
      importantNote: 'Rotating machines contribute to fault current. Their subtransient reactance appears in PARALLEL with the utility path, which raises the duty rather than lowering it — 44 percent higher at the motor bus of this system. Any breaker-selection question that mentions connected motors is testing exactly this.',
    },
    {
      id: 'pu-problem-set-a',
      title: '8. Problem Set A: Bases, Re-basing, and Diagram Construction',
      content: `Per-unit questions are graded on bookkeeping, not insight. These six
are chosen so that a single misplaced base voltage changes the answer visibly.

## 8. Problem Set A — bases and re-basing

### The problems

**A1.** On a 50 MVA, 115 kV base, find the base impedance and the base current.

**A2.** A generator is rated 40 MVA, 13.8 kV with **$X'' = 0.15$** pu on its own
base. Express it on a 100 MVA, 13.8 kV base.

**A3.** A transformer is rated 25 MVA, 12.47/69 kV with 7 percent impedance.
The low-voltage zone base is 13.2 kV and the system base is 100 MVA. Find its
per-unit impedance on the system base.

**A4.** A 138 kV line has 45 Ω of series reactance. Find its per-unit value on
a 100 MVA base.

**A5.** A 13.8 kV generator feeds a 13.8/138 kV transformer, then a 138/69 kV
transformer, then a 69/12.47 kV transformer. On a 100 MVA base, list the base
voltage, base impedance and base current in all four zones.

**A6.** A relay at a 4.16 kV bus reads 1,200 A. Express this current in per
unit on a 100 MVA base.

### Solutions

**A1.**

$$Z_{base} = \\frac{(115{,}000)^{2}}{50\\times 10^{6}} = 264.5\\ \\Omega, \\qquad I_{base} = \\frac{50\\times 10^{6}}{\\sqrt{3}\\times 115{,}000} = 251.0\\ \\mathrm{A}$$

*Distractor:* putting √3 into the impedance gives 152.7 Ω. Base impedance
never carries a √3.

**A2.** The voltages match, so only the MVA ratio applies:

$$X = 0.15\\times\\frac{100}{40} = 0.375\\ \\mathrm{pu}$$

*Distractor:* dividing instead of multiplying gives 0.060 pu. The rule to
carry: moving to a **larger** base MVA makes a per-unit impedance **larger**,
because the same ohms are now a bigger fraction of a smaller base impedance.

**A3.** Both factors are in play:

$$Z = 0.07\\times\\frac{100}{25}\\times\\left(\\frac{12.47}{13.2}\\right)^{2} = 0.07\\times 4\\times 0.8925 = 0.2499\\ \\mathrm{pu}$$

*Distractor:* 0.2800 pu, from dropping the voltage term — 12.1 percent high.

**A4.** **$Z_{base} = 138{,}000^{2}/10^{8} = 190.44\\ \\Omega$**, so

$$X_{pu} = \\frac{45}{190.44} = 0.2363\\ \\mathrm{pu}$$

*Distractor:* using 69 kV (line-to-neutral) gives 0.945 pu, four times too
large. Base voltage in a three-phase per-unit system is line-to-line.

**A5.** Base voltage rides the turns ratios: 13.8 → 138 → 69 → 12.47 kV.

| Zone | V_base | Z_base | I_base |
|---|---|---|---|
| 1 | 13.80 kV | 1.9044 Ω | 4,184 A |
| 2 | 138.0 kV | 190.44 Ω | 418.4 A |
| 3 | 69.00 kV | 47.61 Ω | 836.7 A |
| 4 | 12.47 kV | 1.5550 Ω | 4,630 A |

*Distractor:* the 138/69 kV unit is an autotransformer in many versions of
this question, which tempts candidates to skip it. Base voltage crosses every
transformer, auto or not.

**A6.** **$I_{base} = 10^{8}/(\\sqrt{3}\\times 4{,}160) = 13{,}879$ A**, so

$$I_{pu} = \\frac{1{,}200}{13{,}879} = 0.0865\\ \\mathrm{pu} \\;\\Rightarrow\\; S = 8.65\\ \\mathrm{MVA}$$

*Distractor:* omitting the √3 gives 24,038 A of base current and 0.0499 pu.`,
      examTip: 'Every one of these is a division. The marks are lost in choosing what to divide by, so write the three bases — S_base, V_base, and the Z_base or I_base you derived from them — at the top of the page before reading the question a second time.',
      importantNote: 'Moving to a LARGER base MVA increases a per-unit impedance, and moving to a LARGER base voltage decreases it. If a re-based answer moves the wrong way, the formula has been inverted; check that before checking the arithmetic.',
    },
    {
      id: 'pu-problem-set-b',
      title: '9. Problem Set B: Fault Duty, Machine Contributions, Starting',
      content: `Once the diagram exists, the questions it answers are all short.
These six are the four things per unit is actually used for.

## 9. Problem Set B — fault duty, starting, and regulation

### The problems

**B1.** The Thévenin reactance to a 13.8 kV bus is 0.25 pu on a 100 MVA base.
Find the three-phase fault MVA and the fault current.

**B2.** Two paths feed a bus: one of 0.20 + 0.10 pu in series, the other of
0.40 pu. Find the equivalent reactance and the fault duty on a 100 MVA base.

**B3.** A 1.5 MVA motor with a locked-rotor current 5.5 times rated is started
direct on line at a bus whose short-circuit capacity is 60 MVA. Find the bus
voltage during the start.

**B4.** A feeder of 0.02 + j0.06 pu delivers 0.8 pu at 0.9 power factor lagging
into a bus held at 1.00 pu. Find the sending-end voltage magnitude.

**B5.** A transformer has 6 percent impedance on 20 MVA, 13.8 kV. Find its
value in ohms and its per-unit value on a 100 MVA, 13.2 kV base.

**B6.** A 4.16 kV bus has a source Thévenin reactance of 0.90 pu on 100 MVA and
3 MVA of connected motors with **$X''=0.17$** pu on their own base. Find the
symmetrical fault current with and without the motor contribution.

### Solutions

**B1.**

$$S_{f} = \\frac{100}{0.25} = 400\\ \\mathrm{MVA}, \\qquad I_{f} = \\frac{I_{base}}{0.25} = \\frac{4{,}184}{0.25} = 16{,}735\\ \\mathrm{A}$$

*Distractor:* computing 400 MVA and then dividing by 4.16 kV or 138 kV instead
of 13.8 kV. The fault MVA is level-independent; the amperes are not.

**B2.**

$$X_{eq} = \\frac{(0.30)(0.40)}{0.30+0.40} = 0.1714\\ \\mathrm{pu} \\;\\Rightarrow\\; S_{f} = \\frac{100}{0.1714} = 583.3\\ \\mathrm{MVA}$$

*Distractor:* adding the two paths gives 0.70 pu and 143 MVA — a factor of
four low. Parallel sources increase fault duty; only series elements reduce it.

**B3.** **$S_{LR} = 5.5\\times 1.5 = 8.25$ MVA**, so the ratio is 8.25/60 = 0.1375:

$$V_{bus} = \\frac{1}{1+0.1375} = 0.879\\ \\mathrm{pu}$$

a 12.1 percent dip. *Distractor:* 1 − 0.1375 = 0.8625 pu, from subtracting the
ratio instead of using the divider — close enough to look plausible and wrong
by a point and a half.

**B4.** **$I = 0.8\\angle -25.84^\\circ$** pu and **$Z = 0.0632\\angle 71.57^\\circ$** pu:

$$V_{S} = 1.00 + 0.0506\\angle 45.73^\\circ = 1.0353+j0.0362$$

$$|V_{S}| = 1.0360\\ \\mathrm{pu} \\;\\Rightarrow\\; 3.60\\%\\ \\text{drop}$$

The approximation **$0.8(0.02\\times 0.9 + 0.06\\times 0.436) = 0.0353$** gives
3.53 percent. *Distractor:* adding magnitudes, 1.00 + 0.0506 = 1.0506, ignores
that the drop is largely in quadrature with the load voltage.

**B5.** **$Z_{base,own} = 13.8^{2}/20 = 9.522\\ \\Omega$**, so
**$Z = 0.5713\\ \\Omega$**. On the new base,
**$Z_{base} = 13.2^{2}/100 = 1.7424\\ \\Omega$**:

$$Z_{pu} = \\frac{0.5713}{1.7424} = 0.3279\\ \\mathrm{pu} = 0.06\\times 5\\times\\left(\\frac{13.8}{13.2}\\right)^{2}$$

*Distractor:* 0.30 pu, from using the MVA ratio alone. The 9.3 percent
difference is the voltage term.

**B6.** Motor reactance on the system base:
**$X_{m} = 0.17\\times(100/3) = 5.667$ pu**. Without the motors,

$$I_{f} = \\frac{13{,}879}{0.90} = 15{,}421\\ \\mathrm{A}$$

With them, **$X_{eq} = (0.90)(5.667)/(6.567) = 0.7767$ pu**:

$$I_{f} = \\frac{13{,}879}{0.7767} = 17{,}870\\ \\mathrm{A} \\quad (+15.9\\%)$$

*Distractor:* ignoring 3 MVA of motors on a bus fed through 0.90 pu looks
harmless and costs 16 percent of the interrupting duty — enough to change the
breaker selection.`,
      examTip: 'Series impedances reduce fault current; parallel sources increase it. When a question adds a second feed, a generator, or a bank of motors, the equivalent reactance must go DOWN and the duty must go UP. That directional check catches most sign and topology errors before the arithmetic starts.',
      importantNote: 'Fault MVA is the same number no matter which voltage level you quote it at, because S_base is constant across the whole per-unit diagram. Fault current in amperes is not — it must be divided by the base current of the zone where the fault sits.',
    },
    {
      id: 'pu-when-transformers-return',
      title: '10. When Transformers Do Not Disappear, and Other Second-Order Cases',
      content: `## 10.1 The condition under which the turns ratio actually vanishes

Sections 1 through 9 leaned on a claim that was stated but never qualified:
transformers become plain series impedances in per unit. That claim carries a
condition, and every tap-changing transformer in service violates it.

The turns ratio cancels only when the **base voltages on the two sides are
chosen in the same ratio as the actual turns ratio**. Write the actual ratio as
$N$ and the base ratio as $N_{base}$; what survives in the per-unit circuit is
an ideal transformer of residual ratio

$$c = \\frac{N}{N_{base}}$$

When the transformer sits on its nominal tap, $c = 1$, the ideal element is 1:1,
and it can be erased. When it does not, $c \\ne 1$ and an ideal transformer
remains in the diagram — a device that changes per-unit voltage without changing
per-unit power. That residual element is what a load-flow program calls an
off-nominal tap, and it is the reason tap changers can control voltage at all:
a transformer that truly vanished in per unit could not regulate anything.

### Worked example 10.1 — a transformer on the +5 percent tap

*A 40 MVA, 138/13.8 kV transformer has $Z = 0.09$ pu on its own base and its
low-voltage tap is set +5 percent. The system base is 100 MVA with 138 kV and
13.8 kV zone bases. Find its per-unit impedance and the no-load secondary
voltage for 1.00 pu on the primary.*

The +5 percent tap makes the real winding ratio 138 / 14.49 kV, so the
equipment's own low-voltage base is 14.49 kV, not 13.8 kV. Re-base with both
factors live:

$$Z = 0.09\\times\\frac{100}{40}\\times\\left(\\frac{14.49}{13.8}\\right)^{2} = 0.09\\times 2.5\\times 1.1025 = 0.2481\\ \\mathrm{pu}$$

$$c = \\frac{14.49}{13.8} = 1.05 \\;\\Rightarrow\\; V_{2} = 1.05\\times 1.00 = 1.05\\ \\mathrm{pu} = 14.49\\ \\mathrm{kV}$$

Ignoring the tap gives 0.2250 pu instead of 0.2481 pu — **9.3 percent below the
correct figure** — and it also loses the entire regulating effect, the 5 percent
voltage boost the tap was installed to provide. **Trap named.** A tap setting is not a detail of the
hardware; it is a change to the equipment's own base voltage, and it therefore
enters the re-basing formula through the squared term.

## 10.2 Winding connection: the one thing per unit really does absorb

A three-phase bank can be wye-wye, delta-delta, wye-delta or delta-wye, and the
ohmic impedance referred to a given side differs between them. The per-unit
impedance does not. The reason is a cancellation worth seeing once, because it
is the strongest single argument for the method.

Take three identical single-phase units, each rated $S_{1\\phi}$ at winding
voltage $V_{1\\phi}$. Connect them in wye. The bank rating is $3S_{1\\phi}$ and the
bank's line-to-line voltage is $\\sqrt{3}V_{1\\phi}$, so the two base impedances are

$$Z_{base,unit} = \\frac{V_{1\\phi}^{2}}{S_{1\\phi}}, \\qquad Z_{base,bank} = \\frac{\\left(\\sqrt{3}V_{1\\phi}\\right)^{2}}{3S_{1\\phi}} = \\frac{3V_{1\\phi}^{2}}{3S_{1\\phi}} = \\frac{V_{1\\phi}^{2}}{S_{1\\phi}}$$

They are **identical**, so a per-unit impedance quoted on one unit's rating is
already correct on the bank's rating. The factor of 3 from the power and the
factor of 3 from the squared voltage cancel exactly.

### Worked example 10.2 — three single-phase units into a bank

*Three single-phase transformers, each 10 MVA, 79.67/13.8 kV with $Z = 0.08$ pu
on its own base, are connected wye on the high side and delta on the low side.
Find the bank rating, its voltage ratio, and its per-unit impedance on a 100 MVA
base.*

$$S_{bank} = 3\\times 10 = 30\\ \\mathrm{MVA}, \\qquad V_{HV,LL} = \\sqrt{3}\\times 79.67 = 138.0\\ \\mathrm{kV}, \\qquad V_{LV,LL} = 13.8\\ \\mathrm{kV}$$

Confirm the impedance the long way. One unit:
$Z_{base} = 79.674^{2}/10 = 634.8\\ \\Omega$, so $Z = 0.08\\times 634.8 = 50.78\\ \\Omega$
in each high-side winding, which in wye is also the per-phase impedance of the
bank. The bank's base is $138^{2}/30 = 634.8\\ \\Omega$, so

$$Z_{pu,bank} = \\frac{50.78}{634.8} = 0.0800\\ \\mathrm{pu} \\;\\Rightarrow\\; Z = 0.08\\times\\frac{100}{30} = 0.2667\\ \\mathrm{pu}$$

The delta low side changes nothing: its line-to-line voltage is the winding
voltage of 13.8 kV, its base impedance is $13.8^{2}/30 = 6.348\\ \\Omega$, and the
delta-to-wye conversion supplies the factor of 3 that makes the per-unit value
come out at 0.08 again.

**One thing per unit does *not* absorb.** A wye-delta or delta-wye bank shifts
the phase by 30°, and that shift is real: it survives into the per-unit diagram
and matters for relay coordination and for unbalanced fault studies. Per unit
removes the magnitude ratio, never the angle.

## 10.3 Nameplate percent impedance as a fault-current instrument

A transformer nameplate carries its impedance as a percentage, and that number
is the short-circuit test result: the fraction of rated voltage needed to drive
rated current through a shorted secondary. Inverting it gives the current a
short on the secondary draws from an infinitely stiff primary:

$$I_{SC} = \\frac{I_{rated}}{Z_{pu}}, \\qquad S_{SC} = \\frac{S_{rated}}{Z_{pu}}$$

### Worked example 10.3 — through-fault current at a 480 V switchboard

*A 1,500 kVA, 13.8 kV / 480 V transformer has 5.75 percent impedance. Find the
bolted three-phase fault current on its secondary, first from an infinite bus
and then with a utility source of 250 MVA short-circuit capacity.*

$$I_{rated} = \\frac{1{,}500{,}000}{\\sqrt{3}\\times 480} = 1{,}804\\ \\mathrm{A} \\;\\Rightarrow\\; I_{SC} = \\frac{1{,}804}{0.0575} = 31{,}378\\ \\mathrm{A}$$

Now bring the utility in. On the transformer's own 1.5 MVA base the source
impedance is

$$Z_{source} = \\frac{S_{base}}{S_{SC,utility}} = \\frac{1.5}{250} = 0.0060\\ \\mathrm{pu} \\;\\Rightarrow\\; Z_{total} = 0.0635\\ \\mathrm{pu}$$

$$I_{SC} = \\frac{1{,}804}{0.0635} = 28{,}413\\ \\mathrm{A}, \\qquad S_{SC} = \\frac{1.5}{0.0635} = 23.6\\ \\mathrm{MVA}$$

The infinite-bus figure is **10.4 percent high**. That is the conservative
direction for choosing a breaker and the wrong direction for coordinating a
downstream fuse, which is why the shortcut is standard for the first calculation
and never for the last one.

## 10.4 Per-unit power flow, losses and regulation in one pass

Once every quantity is per-unit, the complex power relation carries no scale
factors at all — no √3, no factor of three, no kilo or mega:

$$S_{pu} = V_{pu}I_{pu}^{*}, \\qquad P_{loss,pu} = \\lvert I_{pu}\\rvert^{2}R_{pu}, \\qquad Q_{line,pu} = \\lvert I_{pu}\\rvert^{2}X_{pu}$$

### Worked example 10.4 — a loaded line, end to end

*A line of $0.02 + j0.08$ pu on a 100 MVA base delivers 1.00 pu of apparent
power at 0.90 power factor lagging into a bus held at 1.00 pu. Find the sending
voltage, the real loss in megawatts and the reactive power the line consumes.*

$$S = 0.900 + j0.436\\ \\mathrm{pu} \\;\\Rightarrow\\; I = \\left(\\frac{S}{V}\\right)^{*} = 1.000\\angle -25.84^\\circ\\ \\mathrm{pu}$$

$$V_{S} = 1.00 + \\left(1.000\\angle -25.84^\\circ\\right)\\left(0.08246\\angle 75.96^\\circ\\right) = 1.0529 + j0.0633 = 1.0548\\angle 3.44^\\circ\\ \\mathrm{pu}$$

$$P_{loss} = (1.000)^{2}(0.02) = 0.0200\\ \\mathrm{pu} = 2.00\\ \\mathrm{MW}, \\qquad Q_{line} = (1.000)^{2}(0.08) = 8.00\\ \\mathrm{MVAR}$$

Check against the approximation of Section 5.2:
$R P + X Q = 0.02(0.900) + 0.08(0.436) = 0.0529$ pu, against the exact
0.0548 pu — within 4 percent, and instantly. Note also that the line consumes
four times more reactive power than real, which is generic for transmission and
is the reason reactive support is a separate planning problem from real-power
dispatch.

## 10.5 What per unit costs

Two honest limitations, both of which the exam occasionally probes. First,
**per unit hides absolute magnitude**: 0.05 pu on a 100 MVA base is 9.52 Ω in
the 138 kV zone and 0.0952 Ω in the 13.8 kV zone, a hundredfold difference that
the per-unit number itself gives no hint of, and a reader who has stopped
tracking zones can carry a value into the wrong one with no warning from the
arithmetic.
Second, **per unit does not linearise anything**. Saturation, temperature
coefficients and voltage-dependent load stay exactly as non-linear as they were.
The method is a change of units, not a change of physics, and its whole benefit
is that the units are chosen so that the transformers cancel and the healthy
values cluster near one.`,
      examTip: 'Ask one question before erasing a transformer from a per-unit diagram: is its actual ratio the same as the ratio of the two zone base voltages? If yes it becomes a series impedance. If no — a tap setting, a nameplate that does not match the chosen bases — an ideal transformer of ratio c = N/N_base stays behind, and its own base voltage changes the squared term in the re-basing formula as well.',
      importantNote: 'Percent impedance on a transformer nameplate is a per-unit impedance on that transformer\'s own rating, and its reciprocal is the through-fault current in multiples of rated current. A 5.75 percent transformer passes 1/0.0575 = 17.4 times rated current into a bolted secondary fault from an infinite bus. Adding a finite source impedance always lowers that figure — by 10.4 percent for the 250 MVA utility in Worked example 10.3.',
    },
    {
      id: 'pu-problem-set-c',
      title: '11. Problem Set C: Taps, Banks, Nameplates and Power Flow',
      content: `The third set covers the material of Section 10, where the answers stop
being pure bookkeeping and start depending on whether a condition holds. Six
problems, each about three minutes with a handbook.

## 11. Problem Set C — taps, banks and nameplate data

### The problems

**C1.** Find the base impedance and base current for a 50 MVA, 34.5 kV base.

**C2.** A 2,000 kVA, 13.8 kV / 480 V transformer has 5.75 percent impedance.
Express it on a 100 MVA base, and find its ohmic value referred to the 480 V
side.

**C3.** A 25 MVA, 115/13.8 kV transformer with 7.5 percent impedance is set on
its +2.5 percent tap. On a 100 MVA base with a 13.8 kV low-side zone base, find
its per-unit impedance and the residual per-unit turns ratio.

**C4.** A 750 kVA, 208 V secondary transformer has 4.5 percent impedance. Find
the secondary rated current, the bolted three-phase fault current from an
infinite bus, and the fault MVA.

**C5.** Three single-phase 5 MVA, 7.967/2.40 kV transformers with 6 percent
impedance are banked wye-delta. Find the bank rating, both line-to-line
voltages, and the bank impedance on a 100 MVA base.

**C6.** A line of $0.015 + j0.060$ pu on a 100 MVA base delivers 0.85 pu at 0.95
power factor lagging into a bus held at 1.00 pu. Find the sending-end voltage
magnitude and the real loss in megawatts.

### Solutions

**C1.**

$$Z_{base} = \\frac{(34{,}500)^{2}}{50\\times 10^{6}} = 23.81\\ \\Omega, \\qquad I_{base} = \\frac{50\\times 10^{6}}{\\sqrt{3}\\times 34{,}500} = 836.7\\ \\mathrm{A}$$

*Distractor:* 34.5 kV is a line-to-line voltage, and dividing it by √3 first
gives $Z_{base} = 7.94\\ \\Omega$ — a third of the right answer. Base impedance
takes line-to-line volts with three-phase MVA and carries no √3.

**C2.** The voltages match the equipment rating, so only the MVA ratio applies:

$$Z = 0.0575\\times\\frac{100}{2.0} = 2.875\\ \\mathrm{pu}$$

$$Z_{base,own,480} = \\frac{480^{2}}{2\\times 10^{6}} = 0.1152\\ \\Omega \\;\\Rightarrow\\; Z = 0.0575\\times 0.1152 = 0.006624\\ \\Omega$$

*Distractor:* 2.875 pu looks like an error to a reader trained on "values cluster
near 1.0", and it is not — a small transformer expressed on a large system base
legitimately lands in the units. The clustering rule applies to equipment on its
**own** rating, not after a fiftyfold re-base.

**C3.** The +2.5 percent tap makes the real low-side rating 14.145 kV:

$$Z = 0.075\\times\\frac{100}{25}\\times\\left(\\frac{14.145}{13.8}\\right)^{2} = 0.075\\times 4\\times 1.050625 = 0.3152\\ \\mathrm{pu}$$

$$c = \\frac{14.145}{13.8} = 1.025$$

*Distractor:* 0.3000 pu, from taking the tap as a detail that does not enter the
electrical model. It is 4.8 percent below the correct 0.3152 pu, and it also
discards the 2.5 percent voltage boost that is the tap's entire purpose.

**C4.**

$$I_{rated} = \\frac{750{,}000}{\\sqrt{3}\\times 208} = 2{,}082\\ \\mathrm{A} \\;\\Rightarrow\\; I_{SC} = \\frac{2{,}082}{0.045} = 46{,}262\\ \\mathrm{A}$$

$$S_{SC} = \\frac{0.750}{0.045} = 16.67\\ \\mathrm{MVA}$$

*Distractor:* multiplying by 4.5 percent instead of dividing gives 93.7 A, which
is smaller than rated current and therefore self-evidently absurd — a short
circuit cannot draw less than the load it replaced. Percent impedance divides.

**C5.** Wye on the high side multiplies the winding voltage by √3; delta on the
low side does not:

$$S_{bank} = 15\\ \\mathrm{MVA}, \\qquad V_{HV,LL} = \\sqrt{3}(7.967) = 13.80\\ \\mathrm{kV}, \\qquad V_{LV,LL} = 2.40\\ \\mathrm{kV}$$

$$Z_{pu,bank} = 0.06\\ \\text{(unchanged)} \\;\\Rightarrow\\; Z = 0.06\\times\\frac{100}{15} = 0.400\\ \\mathrm{pu}$$

*Distractor:* dividing or multiplying the 6 percent by 3 or by √3 to "account
for" the connection. Per-unit impedance is invariant under the banking
connection, because the factor of 3 in the bank rating and the factor of 3 in
the squared line voltage cancel — Section 10.2 shows the cancellation.

**C6.** $S = 0.8075 + j0.2654$ pu, so $I = 0.850\\angle -18.19^\\circ$ pu:

$$V_{S} = 1.00 + \\left(0.850\\angle -18.19^\\circ\\right)\\left(0.06185\\angle 75.96^\\circ\\right) = 1.0280 + j0.0445 = 1.0290\\ \\mathrm{pu}$$

$$P_{loss} = (0.850)^{2}(0.015) = 0.01084\\ \\mathrm{pu} = 1.08\\ \\mathrm{MW}$$

*Distractor:* adding magnitudes, $1.00 + 0.0526 = 1.0526$ pu, which ignores that
most of the drop is in quadrature with the receiving voltage. The approximation
$RP + XQ = 0.015(0.8075) + 0.060(0.2654) = 0.0280$ pu is the one to use under
time pressure, and it lands within 0.1 percent here.`,
      examTip: 'Two of these six turn on a condition rather than on arithmetic: C3 on whether the tap changes the equipment base voltage, and C5 on whether the banking connection changes the per-unit impedance. It does in the first case and it does not in the second, and knowing which is which is the entire content of the question.',
      importantNote: 'A per-unit impedance far from 1.0 is not automatically an error. C2 gives 2.875 pu for a perfectly healthy 2 MVA transformer expressed on a 100 MVA base. The plausibility bands quoted throughout this chapter apply to equipment on ITS OWN rating; after re-basing to a much larger system base, small equipment legitimately lands in the units or the tens.',
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
    {
      id: 'txl-three-models',
      title: '6. Three Models, One Line: Where Each Stops Being True',
      content: `## 6.1 The line this section works with

Everything below refers to one machine-checkable line: **230 kV, 60 Hz**, with
per-kilometre constants

$$z = 0.08 + j0.50\\ \\Omega/\\mathrm{km}, \\qquad y = j3.30\\times 10^{-6}\\ \\mathrm{S/km}$$

From these two numbers everything else follows. The characteristic impedance
and propagation constant are

$$Z_{c} = \\sqrt{\\frac{z}{y}} = 391.72\\angle -4.545^\\circ\\ \\Omega, \\qquad \\gamma = \\sqrt{zy} = 1.0244\\times 10^{-4} + j1.28860\\times 10^{-3}\\ \\mathrm{km^{-1}}$$

so **$\\alpha = 1.024\\times10^{-4}$ Np/km** and
**$\\beta = 1.2886\\times 10^{-3}$ rad/km = 0.07383°/km**. The wavelength is
**$2\\pi/\\beta = 4{,}876$ km**, a quarter of it 1,219 km — which is why no
practical line reaches the quarter-wave point and why every real line sits on
the gently curving first part of the hyperbolic functions.

Dropping resistance gives the **surge impedance**, the number SIL is defined
from:

$$Z_{surge} = \\sqrt{x/b} = \\sqrt{0.50/3.30\\times10^{-6}} = 389.25\\ \\Omega, \\qquad \\mathrm{SIL} = \\frac{V_{LL}^{2}}{Z_{surge}} = \\frac{230^{2}}{389.25} = 135.9\\ \\mathrm{MW}$$

| Quantity | Symbol | Value |
|---|---|---|
| Characteristic impedance | $Z_{c}$ | 391.72 ∠−4.545° Ω |
| Surge impedance (lossless) | $Z_{surge}$ | 389.25 Ω |
| Attenuation constant | $\\alpha$ | 1.024 × 10⁻⁴ Np/km |
| Phase constant | $\\beta$ | 0.07383 °/km |
| Wavelength | $\\lambda$ | 4,876 km |
| Surge impedance loading | SIL | 135.9 MW |

## 6.2 The three models, side by side

Each model is an ABCD pair. The short line keeps only the series impedance;
the nominal π splits the shunt admittance into two halves at the ends; the
exact solution uses the hyperbolic functions of **$\\gamma\\ell$**:

$$\\text{short:}\\quad A = 1,\\ B = Z, \\qquad \\text{nominal }\\pi:\\quad A = 1+\\frac{ZY}{2},\\ B = Z$$

$$\\text{exact:}\\quad A = \\cosh(\\gamma\\ell),\\quad B = Z_{c}\\sinh(\\gamma\\ell),\\quad C = \\frac{\\sinh(\\gamma\\ell)}{Z_{c}}$$

Load the line with **150 MW at 0.95 power factor lagging** and compare the
sending-end voltage each model predicts.

| Length | Exact V_S | Short-line error | Nominal-π error |
|---|---|---|---|
| 50 km | 238.0 kV | +0.20% | +0.003% |
| 100 km | 246.0 kV | +0.78% | +0.03% |
| 200 km | 261.4 kV | +2.93% | +0.21% |
| 300 km | 275.7 kV | +6.24% | +0.72% |
| 500 km | 298.4 kV | +15.97% | +3.31% |

![Error in sending-end voltage from the short-line and nominal-pi models against line length, for a 150 megawatt load at 0.95 power factor on the study line. The short-line model passes one percent error at 114 kilometres and reaches 16 percent at 500 kilometres; the nominal-pi model does not reach one percent until 335 kilometres.](/courses/fe-ee/figures/pow2-txl-model-error.svg)

The figure turns the usual rules of thumb into measured numbers. On this line
the short-line model holds to 1 percent out to **114 km** and the nominal π to
**335 km** — close to the textbook boundaries of 80 km and 250 km, and
conservative in both cases because the textbook figures are stated for heavier
loading and higher reactance per kilometre.

### Worked example 6.1 — the same line at 300 km, exactly

Compute the sending end of the 300 km line delivering 150 MW at 0.95 power
factor lagging at 230 kV.

**Step 1 — ABCD.** With **$\\gamma\\ell = 0.03073 + j0.38658$**,

$$A = \\cosh(\\gamma\\ell) = 0.92671\\angle 0.717^\\circ, \\qquad B = Z_{c}\\sinh(\\gamma\\ell) = 148.18\\angle 81.14^\\circ\\ \\Omega$$

$$C = \\frac{\\sinh(\\gamma\\ell)}{Z_{c}} = 9.657\\times10^{-4}\\angle 90.23^\\circ\\ \\mathrm{S}$$

**Step 2 — currents and voltages.**
**$I_{R} = 150\\times10^{6}/(\\sqrt{3}\\times 230{,}000\\times 0.95) = 396.35\\angle -18.19^\\circ$ A**, and
**$V_{R} = 132{,}791\\angle 0^\\circ$ V** per phase, so

$$V_{S} = AV_{R} + BI_{R} = 159{,}147\\angle 19.77^\\circ\\ \\mathrm{V} \\;\\Rightarrow\\; 275.65\\ \\mathrm{kV\\ line\\!-\\!to\\!-\\!line}$$

$$I_{S} = CV_{R} + DI_{R} = 350.29\\angle 2.93^\\circ\\ \\mathrm{A}$$

**Step 3 — power and loss.**
**$P_{S} = 3\\,\\mathrm{Re}(V_{S}I_{S}^{*}) = 160.07$ MW**, so the loss is
**10.07 MW** and the efficiency **93.71 percent**. The power angle is
**19.77°**, comfortably inside the 30° practical limit.

**Trap named.** The short-line model gives 292.9 kV here, 6.2 percent high.
That error is larger than the entire voltage-regulation budget of a
transmission system, which is why 300 km is emphatically not a short line.

### Worked example 6.2 — regulation of the same line

$$\\mathrm{VR} = \\frac{|V_{S}|/|A| - |V_{R}|}{|V_{R}|}\\times 100\\%$$

The **$|A|$** in the denominator is the point: removing the load does not
leave the receiving voltage at **$|V_{S}|$**, because the line's own shunt
capacitance still divides it. Here

$$\\mathrm{VR} = \\frac{275.65/0.92671 - 230}{230}\\times 100 = 29.33\\%$$

A 29 percent regulation is unacceptable, and it is honest: an uncompensated
300 km line loaded above SIL genuinely behaves that way. Real lines of this
length carry series capacitors, shunt reactors, or both, and the exam question
that follows this calculation is usually "what compensation is needed".

## 6.3 Ferranti rise and the charging the line generates

Open the far end and the load current vanishes, leaving
**$V_{R} = V_{S}/A$**. Since **$|A| < 1$** for any line of appreciable length,
the open end sits **above** the source:

$$\\frac{V_{R,no\\ load}}{V_{S}} = \\frac{1}{|A|} \\approx \\frac{1}{\\cos(\\beta\\ell)}$$

![Open-end voltage rise against line length in the upper panel and the reactive power the line generates in the lower panel. A 300 kilometre line rises to 1.0791 per unit, or 248.2 kilovolts on a 230 kilovolt base, and generates 52.4 megavars of charging that a shunt reactor must absorb; by 600 kilometres the rise is 39 percent and the charging is 105 megavars.](/courses/fe-ee/figures/pow2-txl-ferranti-length.svg)

The lower panel gives the cause. A line is a distributed capacitor, and at no
load it generates

$$Q_{C} = V_{LL}^{2}\\,b\\,\\ell = (230\\times10^{3})^{2}(3.30\\times10^{-6})(300) = 52.4\\ \\mathrm{MVAR}$$

with nowhere for that reactive power to go. It flows back through the source
impedance, and reactive current flowing **into** a capacitance raises the
voltage across it.

### Worked example 6.3 — sizing a shunt reactor

The 300 km line is to be energised from one end with the far end open, and the
open-end voltage must not exceed 1.05 pu. How much shunt reactive absorption is
needed at the open end?

Uncompensated the rise is 1.0791 pu. A shunt reactor of susceptance
**$B_{L}$** at the open end changes the terminal condition; to first order the
compensation degree needed is the fraction of the line's own charging that must
be cancelled. Requiring the effective **$\\beta\\ell$** to fall from 22.15° to
the value that gives 1.05:

$$\\cos(\\beta\\ell)_{new} = \\frac{1}{1.05} = 0.95238 \\;\\Rightarrow\\; (\\beta\\ell)_{new} = 17.75^\\circ$$

$$\\text{compensation} = 1 - \\left(\\frac{17.75}{22.15}\\right)^{2} = 1 - 0.642 = 35.8\\%$$

so roughly **$0.358\\times 52.4 = 18.8$ MVAR** of shunt reactor. The squared
ratio appears because **$\\beta = \\omega\\sqrt{LC}$**, and cancelling a fraction
of C reduces β by the square root of that fraction. Practical reactors on lines
of this length are commonly rated 30 to 70 percent of line charging, which
brackets this answer.

### Worked example 6.4 — a genuinely short line, done the short way

A 40 km, 138 kV feeder of **$z = 0.09 + j0.45\\ \\Omega/\\mathrm{km}$** delivers
60 MW at 0.9 power factor lagging. Find the sending voltage, the regulation,
and the efficiency.

**$Z = 3.60 + j18.00 = 18.36\\angle 78.69^\\circ\\ \\Omega$** and
**$I = 278.91\\angle -25.84^\\circ$ A**:

$$V_{S} = 79{,}674 + (278.91\\angle -25.84^\\circ)(18.36\\angle 78.69^\\circ) = 82{,}867\\angle 2.82^\\circ\\ \\mathrm{V}$$

giving **143.53 kV line-to-line** and a regulation of **4.01 percent**. The
handbook approximation
**$I(R\\cos\\phi + X\\sin\\phi) = 278.91(3.24 + 7.845) = 3{,}092$ V** per phase
is 5.36 kV line-to-line against an exact 5.53 kV — 3 percent low, which at this
length is entirely acceptable. Loss is
**$3I^{2}R = 3(278.91)^{2}(3.60) = 0.840$ MW**, so efficiency is **98.62
percent**. At 40 km the shunt admittance contributes nothing worth writing
down, which is exactly what "short line" means.`,
      examTip: 'Compute γℓ = √(zy)·ℓ first and look at it. If its magnitude is under about 0.1, every model agrees and you may use the short line. Between 0.1 and 0.5 the nominal π is right. Above 0.5 only the hyperbolic solution is defensible. That single number decides the model before any voltage is calculated.',
      importantNote: 'Voltage regulation of a long line uses |V_S|/|A| as the no-load receiving voltage, not |V_S| itself. Omitting the division by |A| understates regulation by exactly the Ferranti rise — 7.9 percent on this 300 km line — and it is the single most common error in long-line questions.',
    },
    {
      id: 'txl-limits-dispatch',
      title: '7. Loading Limits, Losses, and Economic Dispatch',
      content: `## 7.1 Three limits, and which one binds

A transmission line has three independent ceilings, and which one binds depends
almost entirely on length.

- **Thermal.** Conductor temperature, hence sag and annealing. Independent of length. Binds on short lines.
- **Voltage drop.** Typically 5 percent end to end. Binds on medium lines.
- **Steady-state stability.** The angle **$\\delta$** must stay well below 90°, in practice 30–40°. Binds on long lines.

The angle limit is computable directly from the ABCD parameters:

$$P_{R} = \\frac{|V_{S}||V_{R}|}{|B|}\\sin\\delta - \\frac{|A||V_{R}|^{2}}{|B|}\\cos(\\theta_{B}-\\theta_{A})$$

For a first estimate the second term is dropped and **$|B| \\approx X$**:

$$P_{max} = \\frac{|V_{S}||V_{R}|}{|B|}, \\qquad P_{30^\\circ} = 0.5\\,P_{max}$$

![Deliverable power in multiples of surge impedance loading against line length, for angle limits of 30, 40 and 90 degrees. The curves fall steeply with length: a 300 kilometre line can carry 1.31 times SIL at a 30 degree angle, a 400 kilometre line exactly 1.00 times SIL, and beyond 500 kilometres the line cannot even reach its own surge impedance loading within a 30 degree angle.](/courses/fe-ee/figures/pow2-txl-loadability.svg)

| Length | $\\lvert B \\rvert$ | P at δ = 30° | In SIL |
|---|---|---|---|
| 100 km | 50.50 Ω | 523.8 MW | 3.85 × |
| 200 km | 100.16 Ω | 264.1 MW | 1.94 × |
| 300 km | 148.18 Ω | 178.5 MW | 1.31 × |
| 400 km | 193.75 Ω | 136.5 MW | 1.00 × |
| 600 km | 274.63 Ω | 96.3 MW | 0.71 × |

Read the last row. A 600 km line at a 30° angle limit cannot even deliver its
own surge impedance loading — which is why very long ac lines are series
compensated, and why beyond roughly 700 km high-voltage dc becomes the
economic answer.

### Worked example 7.1 — how much can this corridor carry?

A 230 kV line has **$X = 60\\ \\Omega$**. Find the power transferred at
**$\\delta = 25^\\circ$**, the theoretical maximum, and the angle at which the
line carries 80 percent of maximum.

$$P_{max} = \\frac{V_{S}V_{R}}{X} = \\frac{(230\\times10^{3})^{2}}{60} = 881.7\\ \\mathrm{MW}$$

$$P(25^\\circ) = 881.7\\sin 25^\\circ = 372.6\\ \\mathrm{MW}$$

$$\\sin\\delta = 0.80 \\;\\Rightarrow\\; \\delta = 53.13^\\circ$$

**Trap named.** 53° is far past any operating limit. At 30° the line carries
exactly half its theoretical maximum, and that halving is the price of
stability margin — one of the few places in power engineering where the safety
factor is visible as a clean factor of two.

## 7.2 Loss, and the loading that minimises it

Line loss is not simply proportional to load squared, because a lightly loaded
line still carries charging current. Sweep the 300 km line at unity power
factor:

![Loss as a percentage of sending power in the upper panel and the ratio of sending to receiving voltage in the lower panel, both against loading in multiples of surge impedance loading for the 300 kilometre line at unity power factor. Loss has a minimum of about 2.6 percent near a quarter of SIL, rises to 5.8 percent at SIL and 10.6 percent at twice SIL; the voltage ratio passes through unity near two thirds of SIL.](/courses/fe-ee/figures/pow2-txl-loss-loading.svg)

| Loading | Power | Loss | V_S / V_R |
|---|---|---|---|
| 0.25 × SIL | 34.0 MW | 2.59% | 0.947 |
| 0.50 × SIL | 68.0 MW | 3.42% | 0.977 |
| 1.00 × SIL | 135.9 MW | 5.82% | 1.059 |
| 1.50 × SIL | 203.9 MW | 8.27% | 1.167 |
| 2.00 × SIL | 271.8 MW | 10.63% | 1.294 |

Two features repay attention. The loss **percentage has a minimum** near a
quarter of SIL, because below that the fixed charging current dominates the
much smaller load current. And the voltage ratio passes through unity at about
0.66 × SIL, **not** at SIL — a useful correction to the usual statement.
Terminating the line in its characteristic impedance **$Z_{c}$** (which draws
134.6 MW and −10.7 MVAR here, not 135.9 MW at unity power factor) gives a rise
of exactly **$e^{\\alpha\\ell} = 1.0312$**, the pure loss term. "Flat profile at
SIL" is a lossless-line statement, and this is how far the real line departs
from it.

### Worked example 7.2 — loss on a 345 kV corridor

A 345 kV line with 12 Ω of series resistance delivers 300 MW at 0.95 power
factor lagging. Find the loss.

$$I = \\frac{300\\times10^{6}}{\\sqrt{3}\\times 345\\times10^{3}\\times 0.95} = 528.47\\ \\mathrm{A}$$

$$P_{loss} = 3I^{2}R = 3(528.47)^{2}(12) = 10.05\\ \\mathrm{MW} = 3.35\\%\\ \\text{of the delivered power}$$

**Trap named.** Correcting the power factor to unity at the receiving end drops
the current to 502.0 A and the loss to 9.07 MW — a 9.7 percent reduction in
loss for no change in delivered real power. Loss scales with the square of
**total** current, so it responds to reactive power exactly as it does to real.

## 7.3 Economic dispatch: the equal-incremental-cost rule

Once several generators can serve the same demand, the question becomes how to
split it. Model each unit's fuel cost as a quadratic in output:

$$C_{i}(P_{i}) = a_{i} + b_{i}P_{i} + c_{i}P_{i}^{2}\\ \\ \\text{per hour}, \\qquad \\lambda_{i} = \\frac{dC_{i}}{dP_{i}} = b_{i} + 2c_{i}P_{i}$$

Minimising total cost subject to **$\\sum P_{i} = D$** with a Lagrange
multiplier gives the classical result: **every unit not at a limit runs at the
same incremental cost**.

$$\\frac{dC_{1}}{dP_{1}} = \\frac{dC_{2}}{dP_{2}} = \\dots = \\lambda, \\qquad \\sum P_{i} = D$$

A unit whose incremental cost at its minimum output already exceeds λ stays off;
a unit that hits its maximum is held there and drops out of the equality.

![Incremental cost lines of two generating units and the equal-lambda dispatch that serves 250 megawatts of demand. Unit one is the flatter and cheaper line and takes 160 megawatts; unit two takes 90; both meet at an incremental cost of 6.58 per megawatt hour, and the split costs 12.25 per hour less than sharing the demand equally.](/courses/fe-ee/figures/pow2-txl-dispatch-lambda.svg)

### Worked example 7.3 — a two-unit dispatch

Two units have

$$C_{1} = 500 + 5.3P_{1} + 0.004P_{1}^{2}, \\qquad C_{2} = 400 + 5.5P_{2} + 0.006P_{2}^{2}$$

in cost units per hour with P in MW. Dispatch 250 MW.

Set the incremental costs equal:

$$5.3 + 0.008P_{1} = 5.5 + 0.012P_{2}, \\qquad P_{1}+P_{2} = 250$$

Substituting **$P_{1} = 250 - P_{2}$** gives
**$5.3 + 2.0 - 0.008P_{2} = 5.5 + 0.012P_{2}$**, so **$0.020P_{2} = 1.80$** and

$$P_{2} = 90\\ \\mathrm{MW}, \\qquad P_{1} = 160\\ \\mathrm{MW}, \\qquad \\lambda = 5.3 + 0.008(160) = 6.58$$

Total cost is **$C_{1}(160) + C_{2}(90) = 1{,}450.4 + 943.6 = 2{,}394.0$** per
hour. Splitting the demand equally at 125 MW each costs **2,406.25** — the
optimal dispatch saves **12.25 per hour**, or about 107,000 per year of
continuous operation.

### Worked example 7.4 — when a limit binds

Take **$C_{1} = 200 + 7.0P_{1} + 0.008P_{1}^{2}$** and
**$C_{2} = 300 + 6.4P_{2} + 0.005P_{2}^{2}$**, dispatch 180 MW, and impose a
100 MW maximum on unit 2.

**Unconstrained:** **$7.0 + 0.016P_{1} = 6.4 + 0.010P_{2}$** with
**$P_{1}+P_{2}=180$** gives

$$0.026P_{2} = 0.016(180)+0.6 = 3.48 \\;\\Rightarrow\\; P_{2} = 133.85\\ \\mathrm{MW}, \\quad P_{1} = 46.15\\ \\mathrm{MW}$$

at **$\\lambda = 7.738$**, costing 1,786.31 per hour. But unit 2 cannot exceed
100 MW. **Constrained:** hold **$P_{2} = 100$** and let unit 1 take the rest:

$$P_{1} = 80\\ \\mathrm{MW}, \\quad \\lambda_{1} = 7.0+0.016(80) = 8.28, \\quad \\lambda_{2} = 6.4+0.010(100) = 7.40$$

costing 1,801.20 per hour. The incremental costs are now **unequal**, and that
is correct: λ₂ < λ₁ means unit 2 would be cheaper on the margin but is not
allowed to grow. The 14.89 per hour difference is the shadow price of that
limit. **Trap named.** Reporting unequal incremental costs as an error is the
mistake; the equal-λ rule applies only to units strictly between their limits.`,
      examTip: 'Economic dispatch questions are two linear equations: set the incremental costs equal, and set the outputs to sum to demand. Solve, then CHECK each output against its limits. If one violates a limit, pin it there and re-solve with the remaining units — that second step is where most of the marks sit.',
      importantNote: 'Line loss responds to total current, so it depends on reactive power as much as on real power. Correcting a 300 MW load from 0.95 power factor to unity cuts the loss by 9.7 percent while delivering exactly the same megawatts, which is why loss reduction is one of the standard justifications for capacitor banks.',
    },
    {
      id: 'txl-problem-set-a',
      title: '8. Problem Set A: Parameters, Models, and Voltage Drop',
      content: `The first three problems are short-line arithmetic; the last three
test whether the long-line constants mean anything to you.

## 8. Problem Set A — line parameters and model choice

### The problems

**A1.** A 40 km, 138 kV feeder has **$z = 0.09 + j0.45\\ \\Omega/\\mathrm{km}$**
and delivers 60 MW at 0.9 power factor lagging. Find the sending-end
line-to-line voltage and the voltage regulation.

**A2.** For the same feeder, compare the exact voltage drop with the
approximation **$I(R\\cos\\phi + X\\sin\\phi)$**, and find the line loss and
efficiency.

**A3.** A 345 kV line has **$x = 0.48\\ \\Omega/\\mathrm{km}$** and
**$b = 3.4\\times10^{-6}\\ \\mathrm{S/km}$**. Find its surge impedance and SIL.

**A4.** For the same line, find β in degrees per kilometre, the electrical
length of a 400 km section, and the wavelength.

**A5.** A line has β = 0.0739 °/km. Find the open-end voltage rise of a 250 km
section.

**A6.** Find the reactive power generated by a 180 km section of the 345 kV
line of A3 at no load.

### Solutions

**A1.** **$Z = 40(0.09+j0.45) = 3.60+j18.00 = 18.36\\angle 78.69^\\circ\\ \\Omega$**
and **$I = 60\\times10^{6}/(\\sqrt{3}\\times138{,}000\\times0.9) = 278.91\\angle -25.84^\\circ$ A**.

$$V_{S} = 79{,}674 + (278.91\\angle -25.84^\\circ)(18.36\\angle 78.69^\\circ) = 82{,}867\\ \\mathrm{V/phase}$$

so **143.53 kV** line-to-line and **VR = 4.01 percent**. *Distractor:* using
138 kV as the phase voltage inflates every result by √3.

**A2.** Approximate drop per phase:

$$I(R\\cos\\phi + X\\sin\\phi) = 278.91\\left(3.60(0.9)+18.00(0.436)\\right) = 3{,}092\\ \\mathrm{V}$$

or 5.36 kV line-to-line, against an exact 5.53 kV — 3.1 percent low. Loss is
**$3(278.91)^{2}(3.60) = 0.840$ MW**, so

$$\\eta = \\frac{60.00}{60.84} = 98.62\\%$$

*Distractor:* computing loss as **$I^{2}R$** rather than **$3I^{2}R$** gives
0.280 MW and an efficiency of 99.5 percent.

**A3.**

$$Z_{surge} = \\sqrt{\\frac{0.48}{3.4\\times10^{-6}}} = 375.73\\ \\Omega, \\qquad \\mathrm{SIL} = \\frac{345^{2}}{375.73} = 316.8\\ \\mathrm{MW}$$

*Distractor:* using the line-to-neutral voltage gives 105.6 MW, a third of the
right answer. SIL always uses line-to-line kV.

**A4.**

$$\\beta = \\sqrt{xb} = \\sqrt{0.48\\times3.4\\times10^{-6}} = 1.2775\\times10^{-3}\\ \\mathrm{rad/km} = 0.07320\\ ^\\circ/\\mathrm{km}$$

A 400 km section is **29.28° electrical**, and the wavelength is
**$2\\pi/\\beta = 4{,}918$ km**. *Distractor:* leaving β in radians and calling
0.511 the electrical "degrees" of the 400 km section.

**A5.** **$\\beta\\ell = 0.0739\\times250 = 18.475^\\circ$**, so

$$\\frac{V_{R}}{V_{S}} = \\frac{1}{\\cos 18.475^\\circ} = 1.0543 \\;\\Rightarrow\\; 5.43\\%\\ \\text{rise}$$

*Distractor:* using **$\\cos(\\beta\\ell)$** rather than its reciprocal reports a
5.2 percent **drop**, the wrong sign entirely.

**A6.**

$$Q_{C} = V_{LL}^{2}b\\ell = (345\\times10^{3})^{2}(3.4\\times10^{-6})(180) = 72.84\\ \\mathrm{MVAR}$$

*Distractor:* using **$\\omega C$** with C in farads per kilometre without
converting; b is already the susceptance per kilometre.`,
      examTip: 'Every quantity in this set comes from just four line constants — r, x, b and length. Write those four down, form z and y, and compute γ and Z_c once. Nine out of ten transmission questions are then a substitution.',
      importantNote: 'SIL, surge impedance and the Ferranti ratio are all LOSSLESS quantities: they use x and b only. Resistance enters the loss and the efficiency, and it shifts the exact answers by a fraction of a percent, but it never appears in the definition of SIL.',
    },
    {
      id: 'txl-problem-set-b',
      title: '9. Problem Set B: Power Flow, Limits, and Dispatch',
      content: `These six move from the line itself to the system decisions the line
forces: how much can flow, what it costs, and which machine should make it.

## 9. Problem Set B — power transfer and economic dispatch

### The problems

**B1.** A 230 kV line has 60 Ω of series reactance. Find the power transferred
at a 25° angle and the theoretical maximum.

**B2.** At what angle does that line carry 80 percent of its maximum, and what
fraction does it carry at the practical 30° limit?

**B3.** A long line has **$A = 0.93\\angle 0.7^\\circ$** and
**$B = 150\\angle 81^\\circ\\ \\Omega$**, and is operated with a sending voltage
of 1.05 pu on a 230 kV base with 230 kV at the receiving end on load. Find the
no-load receiving voltage and the voltage regulation.

**B4.** A 345 kV line with 12 Ω of series resistance delivers 300 MW at 0.95
power factor lagging. Find the loss, and the loss if the power factor were
corrected to unity at the receiving end.

**B5.** Two units have **$C_{1} = 200 + 7.0P_{1} + 0.008P_{1}^{2}$** and
**$C_{2} = 300 + 6.4P_{2} + 0.005P_{2}^{2}$** per hour. Dispatch 150 MW
economically and find the saving over an equal split.

**B6.** Repeat B5 for 180 MW of demand with unit 2 limited to 100 MW.

### Solutions

**B1.**

$$P_{max} = \\frac{(230\\times10^{3})^{2}}{60} = 881.7\\ \\mathrm{MW}, \\qquad P(25^\\circ) = 881.7\\sin 25^\\circ = 372.6\\ \\mathrm{MW}$$

*Distractor:* using line-to-neutral voltage gives 293.9 MW. The formula
**$V_{S}V_{R}/X$** takes line-to-line voltages and returns three-phase power.

**B2.** **$\\delta = \\arcsin 0.80 = 53.13^\\circ$**, and at 30° the line carries
**$\\sin 30^\\circ = 0.500$**, exactly half of maximum. *Distractor:* reading
"80 percent of maximum" as "an 80 percent angle", 72°.

**B3.** No-load receiving voltage:

$$V_{R,nl} = \\frac{|V_{S}|}{|A|} = \\frac{1.05\\times 230}{0.93} = 259.68\\ \\mathrm{kV}$$

$$\\mathrm{VR} = \\frac{259.68-230}{230}\\times 100 = 12.90\\%$$

*Distractor:* using 1.05 × 230 = 241.5 kV as the no-load value gives 5.0
percent and forgets that the line's own capacitance raises it further.

**B4.** At 0.95 power factor,
**$I = 300\\times10^{6}/(\\sqrt{3}\\times345{,}000\\times0.95) = 528.47$ A**:

$$P_{loss} = 3(528.47)^{2}(12) = 10.05\\ \\mathrm{MW}$$

At unity power factor **$I = 502.04$ A** and the loss is **9.07 MW**, a
**9.75 percent** reduction. *Distractor:* assuming loss is unchanged because
the megawatts are unchanged — the current is not.

**B5.** Equal incremental cost:

$$7.0 + 0.016P_{1} = 6.4 + 0.010P_{2}, \\qquad P_{1}+P_{2} = 150$$

$$0.026P_{2} = 0.016(150)+0.6 = 3.00 \\;\\Rightarrow\\; P_{2} = 115.38,\\ P_{1} = 34.62\\ \\mathrm{MW}$$

with **$\\lambda = 7.554$** and a total cost of **1,556.92** per hour against
**1,578.13** for an equal split — a saving of **21.20 per hour**.
*Distractor:* dispatching by average cost rather than incremental cost, which
loads the wrong machine because the constant terms are irrelevant to the split.

**B6.** Unconstrained the answer is **$P_{2} = 133.85$ MW**, above the 100 MW
limit. Pin unit 2 at 100 MW and give unit 1 the remainder:

$$P_{1} = 80\\ \\mathrm{MW}, \\qquad \\lambda_{1} = 8.28, \\qquad \\lambda_{2} = 7.40$$

Total cost **1,801.20** per hour, against 1,786.31 if the limit did not exist.
*Distractor:* forcing the incremental costs to stay equal by reducing unit 1
as well, which fails to meet the 180 MW demand. Once a unit is at a limit it
leaves the equality, and the remaining units absorb the balance.`,
      examTip: 'Recognise the shape of the question. "Angle given, find power" is one sine. "Power given, find angle" is one arcsine. "Two units, one demand" is two linear equations. None of the three needs more than four lines of algebra, and all three are heavily represented.',
      importantNote: 'The equal-incremental-cost rule holds only for units operating strictly between their limits. A unit at its maximum has a LOWER incremental cost than the others and a unit at its minimum has a HIGHER one; both situations are correct optima, not errors to be corrected.',
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
    {
      id: 'pfc-hardware-economics',
      title: '6. From kVAR to Hardware: Capacitance, Steps, and Released Capacity',
      content: `## 6.1 One plant, carried through

A 480 V, three-phase plant draws **600 kW at 0.72 power factor lagging**. Its
service is a 1,500 kVA transformer of 5.75 percent impedance, so the bus has a
short-circuit capacity of

$$S_{sc} = \\frac{1{,}500}{0.0575} = 26.09\\ \\mathrm{MVA}$$

That single figure will decide the resonance and the voltage rise in Section 7,
so it is worth capturing before any capacitor is chosen.

Start from the power triangle. With **$\\theta_{1} = \\arccos 0.72 = 43.95^\\circ$**:

$$Q_{1} = P\\tan\\theta_{1} = 600\\times 0.96385 = 578.3\\ \\mathrm{kVAR}, \\qquad S_{1} = \\frac{600}{0.72} = 833.3\\ \\mathrm{kVA}$$

$$I_{1} = \\frac{833{,}333}{\\sqrt{3}\\times 480} = 1{,}002.3\\ \\mathrm{A}$$

An 833 kVA demand on a 1,500 kVA service, and a thousand amps of switchgear
duty, for 600 kW of useful work.

### Worked example 6.1 — sizing the bank to a target

Correct the plant to 0.95 lagging. With
**$\\theta_{2} = \\arccos 0.95 = 18.19^\\circ$**:

$$Q_{2} = 600\\times 0.32868 = 197.2\\ \\mathrm{kVAR}$$

$$Q_{C} = Q_{1} - Q_{2} = 578.3 - 197.2 = 381.1\\ \\mathrm{kVAR}$$

The new apparent power is **$600/0.95 = 631.6$ kVA** and the new current
**759.7 A** — a 24.2 percent reduction in both. **Trap named.** Nothing about
the 600 kW changed. Candidates who recompute P after correction, or who
subtract kVA rather than kVAR, produce answers that are wrong in a way the
power triangle makes obvious the moment it is drawn.

## 6.2 Why the last few points cost the most

The sizing formula is linear in tangent, and tangent is not linear in power
factor. It runs away as the target approaches unity:

$$\\frac{Q_{C}}{P} = \\tan(\\arccos \\mathrm{pf}_{1}) - \\tan(\\arccos \\mathrm{pf}_{2})$$

![Capacitor rating in kVAR per kW of load needed to reach a target power factor, plotted for starting points of 0.70, 0.75 and 0.80. All three curves climb gently to about 0.90 and then turn sharply upward: moving from 0.75 to 0.95 costs 0.553 kVAR per kW, and the remaining stretch from 0.95 to unity costs another 0.315.](/courses/fe-ee/figures/pow2-pfc-kvar-target.svg)

| From 0.75 to… | kVAR per kW | Cumulative |
|---|---|---|
| 0.85 | 0.262 | 0.262 |
| 0.90 | 0.136 more | 0.398 |
| 0.95 | 0.156 more | 0.553 |
| 0.98 | 0.126 more | 0.679 |
| 1.00 | 0.203 more | 0.882 |

Read the increments, not the totals. Getting from 0.95 to unity costs 0.203
kVAR per kW — more than the whole step from 0.85 to 0.90 — and buys only five
points of power factor, which is why tariffs and practice both stop at about
0.95. Beyond that the capacitors cost more than the demand charge they avoid,
and the overcorrection risks of Section 7 begin.

## 6.3 kVAR into farads

A capacitor's rating and its capacitance are related through the voltage
**across the individual unit**, which is where the delta-versus-wye question
becomes concrete:

$$Q_{phase} = \\frac{V_{C}^{2}}{X_{C}} = \\omega C V_{C}^{2} \\;\\Longrightarrow\\; C = \\frac{Q_{phase}}{\\omega V_{C}^{2}}$$

For the 381.1 kVAR bank at 480 V, each phase must supply 127.03 kVAR. In
delta each unit sees the full 480 V; in wye each sees 277.1 V:

$$C_{\\Delta} = \\frac{127{,}034}{377\\times 480^{2}} = 1{,}462.5\\ \\mu\\mathrm{F}, \\qquad C_{Y} = \\frac{127{,}034}{377\\times 277.13^{2}} = 4{,}387.6\\ \\mu\\mathrm{F}$$

exactly three times as much, because **$V_{C}^{2}$** differs by three.

![Capacitance per phase required to supply 381 kVAR, plotted against system voltage on logarithmic axes for wye and delta connections. Both fall as the square of voltage: a delta bank needs 1,462.5 microfarads at 480 volts, 19.5 at 4,160 volts, and only 1.8 at 13.8 kilovolts, while the wye equivalent needs three times as much at every voltage.](/courses/fe-ee/figures/pow2-pfc-capacitance.svg)

### Worked example 6.2 — the same kVAR at three voltages

Deliver 381 kVAR at 480 V, 4,160 V and 13.8 kV, delta connected.

$$C = \\frac{127{,}034}{377\\,V^{2}}: \\quad 1{,}462.5\\ \\mu\\mathrm{F},\\quad 19.47\\ \\mu\\mathrm{F},\\quad 1.77\\ \\mu\\mathrm{F}$$

A factor of 826 between the first and last, for identical reactive support.
This is the physical reason capacitor banks migrate to the highest convenient
voltage: dielectric volume scales with capacitance, and the medium-voltage
unit is a fraction of the size and cost of the low-voltage one.

### Worked example 6.3 — a bank moved to the wrong voltage

A 100 kVAR bank rated 240 V is installed on a 208 V system. What does it
actually deliver?

Capacitance is fixed by the hardware; output follows the square of applied
voltage:

$$Q_{actual} = Q_{rated}\\left(\\frac{V_{applied}}{V_{rated}}\\right)^{2} = 100\\left(\\frac{208}{240}\\right)^{2} = 75.1\\ \\mathrm{kVAR}$$

A quarter of the correction is missing. **Trap named.** The reverse error is
dangerous rather than merely disappointing: a 208 V bank on a 240 V system
delivers 133 kVAR and sees 15 percent overvoltage continuously, which shortens
capacitor life dramatically because dielectric loss scales with the square of
the field.

## 6.4 What correction actually buys

![Apparent power drawn by the 600 kilowatt plant in the upper panel and the transformer capacity released in the lower panel, both against corrected power factor. The demand falls from 833.3 kVA uncorrected to 631.6 kVA at 0.95, releasing 201.8 kVA — 24.2 percent of the service — and the load first fits inside a 750 kVA transformer once the power factor reaches 0.80.](/courses/fe-ee/figures/pow2-pfc-released-capacity.svg)

Three benefits, in the order a plant engineer meets them.

**Released capacity.** Correcting to 0.95 drops the demand from 833.3 to 631.6
kVA, freeing **201.8 kVA** — enough to add a third of the plant's existing load
without touching the transformer.

**Reduced loss.** Loss scales with the square of current:

$$\\frac{P_{loss,2}}{P_{loss,1}} = \\left(\\frac{I_{2}}{I_{1}}\\right)^{2} = \\left(\\frac{\\mathrm{pf}_{1}}{\\mathrm{pf}_{2}}\\right)^{2} = \\left(\\frac{0.72}{0.95}\\right)^{2} = 0.574$$

a **42.6 percent** reduction in every ohm between the capacitor and the source.

**Improved voltage.** The same reactive current no longer flows through the
service impedance, so the bus recovers roughly **$Q_{C}/S_{sc}$** in per unit.

### Worked example 6.4 — stepping a bank in practical sizes

Capacitor banks come in fixed steps. Correct a 450 kW load from 0.78 to 0.95
using 25 kVAR steps, and report the achieved power factor.

$$Q_{C} = 450\\left(\\tan 38.74^\\circ - \\tan 18.19^\\circ\\right) = 450(0.80228-0.32868) = 213.1\\ \\mathrm{kVAR}$$

Eight steps give 200 kVAR, nine give 225 kVAR. With
**$Q_{1} = 450\\times 0.80228 = 361.0$ kVAR**:

$$\\text{8 steps: } Q_{net} = 161.0\\ \\mathrm{kVAR} \\Rightarrow \\mathrm{pf} = \\frac{450}{\\sqrt{450^{2}+161.0^{2}}} = 0.942$$

$$\\text{9 steps: } Q_{net} = 136.0\\ \\mathrm{kVAR} \\Rightarrow \\mathrm{pf} = 0.957$$

Nine steps it is, and the answer sits just above target rather than just below
— which matters when a tariff pays by threshold. Note that the load is still
lagging in both cases: with 361 kVAR of demand, 225 kVAR of capacitors cannot
overcorrect anything.

## 6.5 How tariffs turn kVAR into money

Utilities recover the cost of carrying reactive power in one of three ways, and
knowing which one a question implies decides the target power factor.

| Tariff form | What is billed | Consequence for the target |
|---|---|---|
| kVA demand | The peak apparent power in the month | Correct hard; every kVAR removed is billable demand removed |
| kW demand plus a power-factor penalty | Peak real power, surcharged below a threshold | Correct only to the threshold, typically 0.90 or 0.95 |
| kVARh energy | Reactive energy over the month | Correct to the average load angle, not the peak |

The middle form is the most common and the most exploitable. A penalty written
as "demand is billed at **$\\mathrm{kW}\\times 0.95/\\mathrm{pf}$** whenever the
power factor is below 0.95" makes the billed demand of the 600 kW plant

$$600\\times\\frac{0.95}{0.72} = 791.7\\ \\mathrm{kW}$$

so the plant pays for 191.7 kW it never used. Correcting to exactly 0.95 removes
the whole surcharge; correcting beyond it removes nothing further, because the
multiplier is clipped at unity. That is the arithmetic behind the industry
habit of targeting 0.95 and stopping.

The **payback** calculation that follows is the standard engineering-economics
overlay. A bank costs roughly in proportion to its kVAR, and it saves the
surcharge plus the loss reduction of Section 6.4 every hour the plant runs.
With the plant's 4.71 kW of feeder loss saved for 6,000 operating hours a year,
the energy saving alone is

$$4.71\\ \\mathrm{kW}\\times 6{,}000\\ \\mathrm{h} = 28{,}260\\ \\mathrm{kWh\\ per\\ year}$$

before any demand credit. On a low-voltage bank the demand credit usually
dominates and the payback lands between one and three years, which is why
power-factor correction is the most reliably approved capital project in an
industrial plant.

One caution the tariff table hides: penalties are assessed on the **billing
interval of worst power factor**, not on the average. A plant whose load
collapses overnight while a fixed bank stays energised can be penalised for a
**leading** power factor at three in the morning while running at 0.95 lagging
all day. That is the case automatic switched banks exist to solve, and it is
why Section 7 treats overcorrection as a real failure mode rather than a
theoretical one. On the exam the same idea appears as a single sentence buried
in the stem — "the plant operates two shifts" or "the load varies from 20 to
100 percent" — and it is always an instruction to choose a switched bank over
a fixed one.`,
      examTip: 'Q_c = P(tan θ₁ − tan θ₂) and C = Q_phase/(ωV_C²) are the only two formulas this section needs, but the second one demands the voltage ACROSS ONE CAPACITOR — line-to-line for delta, line-to-neutral for wye. Getting that wrong is a factor-of-three error, and both wrong answers are always on the option list.',
      importantNote: 'A capacitor bank delivers kVAR proportional to the SQUARE of the applied voltage, not to the voltage. A bank operated at 90 percent of its rated voltage supplies only 81 percent of its rated kVAR — which is exactly when the system needs it most, and is the fundamental weakness of shunt capacitors as voltage support.',
    },
    {
      id: 'pfc-limits-alternatives',
      title: '7. Overcorrection, Detuning, and the Alternatives',
      content: `## 7.1 Past unity, everything gets worse again

Power factor is not a quantity to maximise; it is a quantity to place. Add
capacitors beyond the load's own reactive demand and the net reactive power
reverses sign, the power factor becomes **leading**, and it falls away from
unity just as fast as it climbed toward it.

$$\\mathrm{pf} = \\frac{P}{\\sqrt{P^{2}+\\left(Q_{L}-Q_{C}\\right)^{2}}}$$

The expression is symmetric in **$(Q_{L}-Q_{C})$**, so 100 kVAR of
overcorrection costs exactly what 100 kVAR of undercorrection costs. Utilities
usually penalise both, and leading power factor carries a second problem the
lagging case does not: **voltage rise**.

$$\\frac{\\Delta V}{V} \\approx \\frac{Q_{C}}{S_{sc}}$$

![Power factor and bus voltage rise of the 600 kilowatt plant as its capacitor bank grows from zero to 800 kVAR. Power factor climbs to exactly unity when the bank reaches the load's own 578 kVAR and then falls again into the leading region, while the voltage rise climbs linearly past 2 percent at about 520 kVAR; the correctly sized 381 kVAR bank sits at 0.95 lagging and 1.46 percent rise.](/courses/fe-ee/figures/pow2-pfc-overcorrection.svg)

| Bank | Net Q | Power factor | Voltage rise |
|---|---|---|---|
| 0 | 578.3 kVAR lag | 0.720 lagging | 0% |
| 200 kVAR | 378.3 lag | 0.846 lagging | 0.77% |
| 381 kVAR | 197.3 lag | 0.950 lagging | 1.46% |
| 578 kVAR | 0 | 1.000 | 2.22% |
| 700 kVAR | 121.7 lead | 0.980 leading | 2.68% |

### Worked example 7.1 — an overcorrected bus

A 500 kW load at 0.85 power factor lagging is fitted with a 400 kVAR bank.
Find the resulting power factor.

$$Q_{L} = 500\\tan(31.79^\\circ) = 309.9\\ \\mathrm{kVAR}, \\qquad Q_{net} = 309.9-400 = -90.1\\ \\mathrm{kVAR}$$

$$\\mathrm{pf} = \\frac{500}{\\sqrt{500^{2}+90.1^{2}}} = 0.984\\ \\text{leading}$$

The correct bank for unity would have been 309.9 kVAR, and for 0.95 lagging
only 145.6 kVAR. **Trap named.** An answer of "0.984" with no lead/lag label is
half an answer, and on this bus it is the half that matters: the 90 kVAR of
export raises the voltage and can trip an overvoltage relay at light load,
when **$Q_{L}$** collapses but the fixed bank does not.

### Worked example 7.2 — self-excitation of a motor

A 100 hp motor draws 28 A at no load on a 480 V supply. Size the largest
capacitor that may be switched **with** the motor.

The no-load current is almost entirely magnetising, so

$$Q_{M} = \\sqrt{3}\\times 480\\times 28 = 23.3\\ \\mathrm{kVAR}$$

Standard practice caps the switched bank at about 90 percent of that:

$$Q_{C,max} \\approx 0.9\\times 23.3 = 21.0\\ \\mathrm{kVAR} \\;\\Rightarrow\\; \\text{specify 20 kVAR}$$

Exceed it and the capacitors can supply more magnetising current than the
machine needs. After the contactor opens, the still-spinning rotor and the
capacitors form a self-excited generator: voltage builds up uncontrolled, out
of phase with the returning supply, and reclosing onto it produces a transient
torque that has broken shafts. This is one of the few power-system limits set
by a **maximum**, not a minimum.

## 7.2 Detuning: what the reactor costs

Section 5.2 established that a bank resonates with the source at
**$h_{r} = \\sqrt{S_{sc}/Q_{C}}$**, and that a small series reactor moves the
bank's own resonance below the lowest troublesome harmonic. Now the arithmetic.
A reactor with **$X_{L} = X_{C}/h_{t}^{2}$** tunes the branch to order
**$h_{t}$**, and the fundamental-frequency net reactance becomes

$$X_{net} = X_{C} - X_{L} = X_{C}\\left(1-\\frac{1}{h_{t}^{2}}\\right)$$

Two consequences follow immediately. The bank delivers **more** kVAR than its
capacitors are rated for, and the capacitors see **more** voltage than the
system voltage, both by the same factor:

$$\\frac{Q_{delivered}}{Q_{rated}} = \\frac{V_{C}}{V_{system}} = \\frac{1}{1-1/h_{t}^{2}}$$

![Cost of detuning plotted against the tuning order chosen. The upper panel shows the capacitor overvoltage and kVAR gain, which is 4.74 percent at the industry-standard 4.7th-order tuning and 8.9 percent if the bank is tuned as low as the 3.5th; the lower panel shows the series reactor needed, 4.53 percent of the capacitive reactance at the 4.7th order.](/courses/fe-ee/figures/pow2-pfc-detune.svg)

| Tuning order | Reactor (% of X_C) | Capacitor overvoltage | kVAR gain |
|---|---|---|---|
| 3.8 | 6.93% | +7.44% | +7.44% |
| 4.2 | 5.67% | +6.01% | +6.01% |
| **4.7** | **4.53%** | **+4.74%** | **+4.74%** |
| 5.7 | 3.08% | +3.18% | +3.18% |
| 6.7 | 2.23% | +2.28% | +2.28% |

### Worked example 7.3 — specifying a detuned bank

Detune the plant's 381 kVAR, 480 V bank to the 4.7th order. Find the reactor
size, the capacitor voltage rating required, and the kVAR the bank will
actually deliver.

$$\\frac{X_{L}}{X_{C}} = \\frac{1}{4.7^{2}} = 0.04527 \\;\\Rightarrow\\; \\text{a 4.53 percent reactor}$$

$$\\frac{1}{1-0.04527} = 1.0474 \\;\\Rightarrow\\; V_{C} = 1.0474\\times 480 = 503\\ \\mathrm{V}$$

so the capacitors must be **525 V units**, the next standard rating above 503,
and the bank will deliver **$381.1\\times 1.0474 = 399.2$ kVAR** rather than 381.
Sizing the capacitors as though the reactor were not there produces continuous
5 percent overvoltage on the dielectric and premature failure — the most common
defect in retrofitted detuned banks.

### Worked example 7.4 — a resonance check that fails, and its fix

A 22 MVA bus is to receive an 800 kVAR bank. Check it.

$$h_{r} = \\sqrt{\\frac{22{,}000}{800}} = \\sqrt{27.5} = 5.24$$

Dangerously close to the 5th harmonic, the dominant output of six-pulse
drives. Two fixes, both computable:

**Move the rating.** Landing exactly on the 5th needs
**$Q_{C} = 22{,}000/25 = 880$ kVAR**, and on the 7th needs
**$22{,}000/49 = 449$ kVAR**. A 600 kVAR bank gives **$h_{r} = 6.06$**, sitting
in the gap between the 5th and 7th, and is the smallest change that works.

**Detune it.** Keep 800 kVAR and add a 4.53 percent reactor. The branch is then
inductive above the 4.7th order, so it cannot form a parallel resonance with
the source at the 5th, 7th or anything above.

## 7.3 When capacitors are the wrong answer

Shunt capacitors are cheap, lossless to a first approximation, and dumb: their
output falls as the square of voltage exactly when voltage support is most
needed, and they cannot absorb reactive power at all. Three alternatives cover
the cases they cannot.

| Device | Reactive range | Response | Typical use |
|---|---|---|---|
| Shunt capacitor bank | Supply only, in steps | Contactor, seconds | Industrial correction, feeder support |
| Shunt reactor | Absorb only, fixed | Switched, seconds | Long-line Ferranti control |
| Synchronous condenser | Supply **and** absorb, continuous | Excitation, ~1 s | Grid voltage support, inertia |
| Static VAR compensator | Supply and absorb, continuous | Thyristor, ~20 ms | Arc furnaces, flicker control |

A **synchronous condenser** is a synchronous machine on no load whose field is
adjusted to make it look capacitive (overexcited) or inductive (underexcited).
Its reactive output is continuously variable and, unlike a capacitor, its
current does **not** collapse as voltage falls — it rises, because the internal
emf is held by the field. That single property makes it far better at riding
through a disturbance, at the cost of rotating machinery and its losses.

A **static VAR compensator** achieves the same two-quadrant range electronically
by thyristor-switching capacitors and phase-controlling a reactor, and responds
within a cycle. It is the standard answer where the load itself fluctuates
faster than a contactor can follow, which is why arc-furnace installations use
them and why the same technology stabilises long transmission corridors.`,
      examTip: 'A leading power factor is a wrong answer, not a better one. Whenever a capacitor size is given rather than derived, compute Q_L − Q_C and check its SIGN before taking the arccosine. Half the distractors in this topic are the correct magnitude with the wrong lead-or-lag label.',
      importantNote: 'A detuning reactor makes the bank deliver more kVAR than its capacitor rating and puts the same percentage of extra voltage on the dielectric. Specify capacitors for V_system/(1 − 1/h²), not for V_system — at the standard 4.7th-order tuning that is a 4.74 percent margin, which forces a 480 V bank onto 525 V units.',
    },
    {
      id: 'pfc-problem-set-a',
      title: '8. Problem Set A: Sizing, Hardware, and Savings',
      content: `Six sizing problems on a 450 kW, 480 V plant at 0.78 power factor
lagging. Each should take about three minutes.

## 8. Problem Set A — sizing a bank and counting the savings

### The problems

**A1.** Find the capacitor rating needed to correct the plant from 0.78 to
0.95 lagging.

**A2.** Find the apparent power and line current before and after, and the
transformer capacity released.

**A3.** Find the capacitance per phase of a 200 kVAR delta-connected bank at
480 V, and the same bank at 4,160 V.

**A4.** A 100 kVAR bank rated 240 V is installed on a 208 V system. Find the
kVAR it actually delivers.

**A5.** The feeder to the plant has 0.010 Ω per phase. Find the loss before and
after the correction of A1.

**A6.** The bank is built from 25 kVAR steps. Find the number of steps and the
power factor achieved.

### Solutions

**A1.** **$\\theta_{1} = \\arccos 0.78 = 38.74^\\circ$** and
**$\\theta_{2} = 18.19^\\circ$**:

$$Q_{C} = 450\\left(0.80228 - 0.32868\\right) = 213.1\\ \\mathrm{kVAR}$$

*Distractor:* using the power factors instead of their tangents gives
450(0.95 − 0.78) = 76.5 kVAR, a third of the right answer.

**A2.**

$$S_{1} = \\frac{450}{0.78} = 576.9\\ \\mathrm{kVA}, \\qquad S_{2} = \\frac{450}{0.95} = 473.7\\ \\mathrm{kVA}$$

$$I_{1} = \\frac{576{,}923}{\\sqrt{3}\\times480} = 693.9\\ \\mathrm{A}, \\qquad I_{2} = 569.8\\ \\mathrm{A}$$

Released capacity is **103.2 kVA**, and the current falls **17.9 percent**.
*Distractor:* reporting the released capacity as the 213.1 kVAR of the bank —
kVAR and kVA are not interchangeable, and the released kVA is smaller because
the triangle closes.

**A3.** Per phase, 200/3 = 66.67 kVAR:

$$C = \\frac{66{,}667}{377\\times 480^{2}} = 767.5\\ \\mu\\mathrm{F}, \\qquad C = \\frac{66{,}667}{377\\times 4{,}160^{2}} = 10.22\\ \\mu\\mathrm{F}$$

*Distractor:* using the full 200 kVAR in the numerator triples both answers.

**A4.**

$$Q = 100\\left(\\frac{208}{240}\\right)^{2} = 75.1\\ \\mathrm{kVAR}$$

*Distractor:* scaling linearly gives 86.7 kVAR. Capacitor output follows
voltage squared.

**A5.**

$$P_{loss,1} = 3(693.9)^{2}(0.010) = 14.45\\ \\mathrm{kW}, \\qquad P_{loss,2} = 3(569.8)^{2}(0.010) = 9.74\\ \\mathrm{kW}$$

a saving of **4.71 kW, or 32.6 percent**, which equals
**$1-(0.78/0.95)^{2}$** exactly. *Distractor:* forgetting the factor of three
for the three phases.

**A6.** 213.1/25 = 8.52, so eight steps give 200 kVAR and nine give 225 kVAR.
With **$Q_{1} = 450\\times0.80228 = 361.0$ kVAR**:

$$\\text{9 steps: } Q_{net} = 136.0\\ \\mathrm{kVAR}, \\quad \\mathrm{pf} = \\frac{450}{\\sqrt{450^{2}+136.0^{2}}} = 0.957\\ \\text{lagging}$$

Eight steps would reach only 0.942, short of target. *Distractor:* rounding
8.52 down by habit; a tariff threshold at 0.95 rewards rounding up here, and
361 kVAR of demand means nine steps still cannot overcorrect.`,
      examTip: 'Write the four numbers P, Q₁, Q₂ and Q_C in a column before touching a calculator, and keep P in the first row where it belongs — unchanged. Every quantity the question can ask for is one operation away from that column.',
      importantNote: 'Released capacity in kVA is always LESS than the capacitor rating in kVAR, because the sides of a right triangle do not add. On this plant a 213 kVAR bank releases only 103 kVA of transformer capacity, and answering with the kVAR figure is the single most common error in the released-capacity question.',
    },
    {
      id: 'pfc-problem-set-b',
      title: '9. Problem Set B: Resonance, Overcorrection, and Limits',
      content: `The sizing arithmetic is the easy half. These six ask whether the
bank you sized is safe to install.

## 9. Problem Set B — resonance, overcorrection, and machine limits

### The problems

**B1.** A bus has 22 MVA of short-circuit capacity and is to receive an
800 kVAR bank. Find the resonant harmonic order and state whether the bank is
acceptable.

**B2.** For the same bus, find the bank ratings that would land exactly on the
5th and 7th harmonics, and propose a safe rating between them.

**B3.** A 480 V bank is detuned to the 4.7th order. Find the reactor as a
percentage of the capacitive reactance, the capacitor terminal voltage, and
the standard capacitor voltage rating to specify.

**B4.** A 500 kW load at 0.85 power factor lagging receives a 400 kVAR bank.
Find the resulting power factor and its sense.

**B5.** A 600 kVAR bank is switched onto a bus with 30 MVA of short-circuit
capacity. Estimate the voltage rise.

**B6.** A 100 hp motor draws 28 A at no load on 480 V. Find the largest
capacitor that may be switched with the motor.

### Solutions

**B1.**

$$h_{r} = \\sqrt{\\frac{22{,}000}{800}} = 5.24$$

Within 5 percent of the 5th harmonic, which six-pulse drives produce strongly.
**Not acceptable** without detuning. *Distractor:* 27.5, from forgetting the
square root.

**B2.**

$$Q_{5} = \\frac{22{,}000}{25} = 880\\ \\mathrm{kVAR}, \\qquad Q_{7} = \\frac{22{,}000}{49} = 449\\ \\mathrm{kVAR}$$

Anything between roughly 500 and 800 kVAR lands in the gap; **600 kVAR** gives
**$h_{r} = 6.06$**, comfortably clear of both. Note the ordering: a **larger**
bank gives a **lower** resonant order, because Q_C is in the denominator.

**B3.**

$$\\frac{X_{L}}{X_{C}} = \\frac{1}{4.7^{2}} = 4.53\\%, \\qquad V_{C} = \\frac{480}{1-0.04527} = 503\\ \\mathrm{V}$$

Specify **525 V** capacitors, the next standard rating. *Distractor:* 480 V
units, which then run 4.7 percent overvoltage for their whole service life.

**B4.** **$Q_{L} = 500\\tan(31.79^\\circ) = 309.9$ kVAR**, so
**$Q_{net} = -90.1$ kVAR**:

$$\\mathrm{pf} = \\frac{500}{\\sqrt{500^{2}+90.1^{2}}} = 0.984\\ \\text{LEADING}$$

*Distractor:* 0.984 lagging. The magnitude is right and the sense is wrong,
and on this bus the sense is the whole answer — the bank exports 90 kVAR and
raises the voltage.

**B5.**

$$\\frac{\\Delta V}{V} \\approx \\frac{600}{30{,}000} = 2.0\\%$$

Enough to matter against a transformer tap step, which is typically 2.5
percent. *Distractor:* treating the rise as negligible because the bank is
"only" 2 percent of the short-circuit capacity — that ratio **is** the rise.

**B6.**

$$Q_{M} = \\sqrt{3}\\times 480\\times 28 = 23.3\\ \\mathrm{kVAR} \\;\\Rightarrow\\; Q_{C,max} = 0.9\\times 23.3 = 21.0\\ \\mathrm{kVAR}$$

Specify **20 kVAR**. *Distractor:* sizing from the motor's full-load kVAR,
which is several times larger and guarantees self-excitation on every stop.`,
      examTip: 'Three checks turn a sized bank into an installed one: resonance order √(S_sc/Q_c) away from 5, 7, 11 and 13; net reactive power still lagging; and, for motor-switched banks, capacitor kVAR below the machine no-load magnetising kVAR. A question that supplies short-circuit MVA or no-load current is asking for one of these.',
      importantNote: 'A larger capacitor bank produces a LOWER resonant harmonic order, because Q_c sits in the denominator of √(S_sc/Q_c). Adding capacitance to move away from the 7th harmonic can walk the resonance straight onto the 5th, which is stronger — always compute the new order rather than assuming the direction of the change.',
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
- Machine constant: **$K\\phi = 220/125.66 = 1.751\\ \\mathrm{V{\\cdot}s/rad}$**
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
    {
      id: 'motors-thevenin-rotor',
      title: '6. Thévenin Reduction and What Rotor Resistance Buys',
      content: `## 6.1 The circuit the simplified model left out

Section 3 drew torque from a circuit with the magnetising branch removed. That
is the right first model, and it is worth knowing exactly what it costs.

Put the magnetising reactance back. The 460 V machine now reads
**$R_{1} = 0.30\\ \\Omega$**, **$X_{1} = 0.50\\ \\Omega$**,
**$X_{m} = 20\\ \\Omega$**, **$R_{2} = 0.25\\ \\Omega$**,
**$X_{2} = 0.70\\ \\Omega$**, all per phase referred to the stator. Looking from
the rotor branch back toward the supply, everything to the left is a Thévenin
source:

$$V_{th} = V_{ph}\\left|\\frac{jX_{m}}{R_{1}+j(X_{1}+X_{m})}\\right|, \\qquad Z_{th} = \\frac{jX_{m}(R_{1}+jX_{1})}{R_{1}+j(X_{1}+X_{m})}$$

Evaluating with **$V_{ph} = 265.58$ V**:

$$V_{th} = 265.58\\times\\frac{20}{\\left|0.30+j20.5\\right|} = 259.08\\ \\mathrm{V}$$

$$Z_{th} = 0.2855 + j0.4920\\ \\Omega$$

The source voltage has fallen 2.4 percent and the source resistance from 0.30
to 0.2855 Ω. Torque is then the same expression with the Thévenin quantities in
place of the terminal ones:

$$T = \\frac{3V_{th}^{2}(R_{2}/s)}{\\omega_{s}\\left[(R_{th}+R_{2}/s)^{2}+(X_{th}+X_{2})^{2}\\right]}$$

$$s_{maxT} = \\frac{R_{2}}{\\sqrt{R_{th}^{2}+(X_{th}+X_{2})^{2}}}, \\qquad T_{max} = \\frac{3V_{th}^{2}}{2\\omega_{s}\\left[R_{th}+\\sqrt{R_{th}^{2}+(X_{th}+X_{2})^{2}}\\right]}$$

### Worked example 6.1 — how much the simplification costs

Compare the three landmark torques computed both ways.

| Quantity | Simplified | Thévenin | Difference |
|---|---|---|---|
| Slip at max torque | 0.2021 | 0.2040 | +0.9% |
| Breakdown torque | 365.2 N·m | 353.5 N·m | −3.2% |
| Starting torque | 161.1 N·m | 156.4 N·m | −2.9% |
| Torque at s = 0.03 | 123.1 N·m | 117.6 N·m | −4.5% |

The simplified model is **optimistic by 3 to 5 percent** and gets the *shape*
exactly right. For an exam question asked to two significant figures the
difference rarely changes the chosen option; for a machine specification it
matters, because a 3 percent optimism in breakdown torque is a 3 percent
optimism in the margin against stalling. **Trap named.** The error is not the
same at every slip, so it cannot be corrected by a single factor — which is
why the reduction is done properly whenever the numbers must be trusted.

## 6.2 The rotor-resistance family

The breakdown-torque expression contains **$R_{1}$**, **$X$** and
**$V_{ph}$** — and no **$R_{2}$** at all. Rotor resistance therefore relocates
the peak without changing its height, which is the single most useful structural
fact about induction machines.

![Torque-speed curves of the same 460 volt machine with rotor resistances of 0.15, 0.25 and 0.40 ohms per phase. All three peak at exactly 365.2 newton-metres, but the peak slides from 1,582 rpm down to 1,218 rpm as the resistance grows, lifting starting torque from 103 to 233 newton-metres while the curve near synchronous speed becomes progressively softer.](/courses/fe-ee/figures/pow2-mot-nema-designs.svg)

| R₂ (Ω) | Slip at peak | Speed at peak | Starting torque | T_start / T_max |
|---|---|---|---|---|
| 0.15 | 0.121 | 1,582 rpm | 102.5 N·m | 0.281 |
| 0.25 | 0.202 | 1,436 rpm | 161.1 N·m | 0.441 |
| 0.40 | 0.323 | 1,218 rpm | 232.7 N·m | 0.637 |
| 0.80 | 0.647 | 636 rpm | 338.9 N·m | 0.928 |

That table is the NEMA design classification in numbers. A low-resistance rotor
(**design A**) gives high efficiency at rated slip and poor starting torque; a
high-resistance rotor (**design D**) gives magnificent starting torque and runs
at 8 to 13 percent slip, wasting that fraction of air-gap power as rotor heat
every second it operates. **Design B**, the general-purpose workhorse, sits
where the 0.25 Ω row does.

### Worked example 6.2 — the critical rotor resistance

At what rotor resistance does the peak torque land exactly at standstill, and
what is the starting torque there?

Set **$s_{maxT} = 1$** in the simplified form:

$$R_{2}^{*} = \\sqrt{R_{1}^{2}+X^{2}} = \\sqrt{0.30^{2}+1.20^{2}} = 1.2369\\ \\Omega$$

At that resistance the machine starts **at** its breakdown torque, 365.2 N·m —
2.27 times its 161 N·m as built, and 2.97 times its rated torque.

![Slip at maximum torque and starting torque plotted against rotor resistance. The slip is linear in resistance and reaches 1 at 1.237 ohms; starting torque rises to a maximum of exactly the breakdown value, 365.2 newton-metres, at that same resistance and falls again beyond it, so adding rotor resistance past the critical value makes starting worse rather than better.](/courses/fe-ee/figures/pow2-mot-rotor-resistance.svg)

The lower panel carries the warning. Beyond 1.2369 Ω the starting torque
**falls**: the rotor branch is now so resistive that current collapses faster
than the torque-per-amp improves. Rotor resistance is not a knob to be turned
as far as it goes.

### Worked example 6.3 — sizing a wound-rotor starting resistor

A 460 V, 4-pole wound-rotor machine has **$R_{1} = 0.20\\ \\Omega$**,
**$R_{2} = 0.18\\ \\Omega$** and **$X = 0.90\\ \\Omega$** per phase referred to the
stator. Find its starting and breakdown torque as built, and the external
rotor resistance needed to start at breakdown torque.

$$T_{start} = \\frac{3(265.58)^{2}(0.18)}{188.5\\left[(0.38)^{2}+(0.90)^{2}\\right]} = 211.7\\ \\mathrm{N{\\cdot}m}$$

$$s_{maxT} = \\frac{0.18}{\\sqrt{0.04+0.81}} = 0.1952, \\qquad T_{max} = \\frac{3(265.58)^{2}}{2(188.5)\\left[0.20+0.9220\\right]} = 500.3\\ \\mathrm{N{\\cdot}m}$$

To move the peak to standstill needs **$R_{2} = 0.9220\\ \\Omega$** referred to
the stator, so the external resistance is

$$R_{ext} = 0.9220 - 0.18 = 0.7420\\ \\Omega\\ \\text{(referred to the stator)}$$

Starting torque then rises from 211.7 to 500.3 N·m — a factor of 2.36 — while
the starting **current** falls, because the rotor branch impedance has grown.
That combination, more torque at less current, is unique to the wound-rotor
machine and is why it survived in crane and hoist service long after squirrel
cages took over everything else.

### Worked example 6.4 — reading a nameplate backwards

A 6-pole, 60 Hz motor runs at 1,164 rpm. Find the synchronous speed, the slip,
and the rotor frequency.

$$N_{s} = \\frac{120f}{p} = \\frac{120\\times 60}{6} = 1{,}200\\ \\mathrm{rpm}$$

$$s = \\frac{1{,}200-1{,}164}{1{,}200} = 0.0300, \\qquad f_{r} = sf = 0.03\\times 60 = 1.80\\ \\mathrm{Hz}$$

The 36 rpm of slip speed corresponds to 1.8 Hz in the rotor bars. **Trap
named.** Rotor frequency is what makes the rotor's own reactance
**$sX_{2}$** rather than **$X_{2}$**, and it is why the running machine is
nearly resistive while the starting machine is nearly reactive — the same
physical circuit at 1.8 Hz and at 60 Hz.`,
      examTip: 'Breakdown torque depends on V², R₁ and X but NOT on R₂; slip at breakdown depends on R₂ and nothing else in the numerator. Any question that changes rotor resistance is asking you to move the peak, and any question that changes voltage is asking you to scale it by the square.',
      importantNote: 'The simplified circuit that omits the magnetising branch overstates torque by 3 to 5 percent on this machine, and the error varies with slip. Use it for exam arithmetic and structural reasoning; use the Thévenin reduction whenever a margin against stalling is being claimed.',
    },
    {
      id: 'motors-across-load',
      title: '7. Machines Across the Load Range: Efficiency, Excitation, DC',
      content: `## 7.1 Where an induction motor is actually good

Solving the full circuit at every slip gives the two curves a specifier cares
about. Fixed losses of 350 W core and 250 W friction and windage are added to
the 460 V machine.

![Efficiency and power factor of the 460 volt induction machine plotted against shaft output. Efficiency rises steeply to a peak of 91.1 percent near 14.7 kilowatts and then declines slowly, while power factor climbs continuously from 0.33 at 3 kilowatts to about 0.90 near 35 kilowatts; the rated point at slip 0.03 delivers 21.25 kilowatts at 90.4 percent efficiency and 0.875 power factor.](/courses/fe-ee/figures/pow2-mot-eff-pf-load.svg)

| Load | Output | Slip | Efficiency | Power factor |
|---|---|---|---|---|
| 25% | 5.25 kW | 0.0070 | 86.3% | 0.485 |
| 50% | 10.69 kW | 0.0143 | 90.6% | 0.729 |
| 75% | 15.94 kW | 0.0218 | 91.1% | 0.830 |
| **100%** | **21.25 kW** | **0.0300** | **90.4%** | **0.875** |
| 125% | 26.53 kW | 0.0389 | 89.2% | 0.895 |

Read the two columns against each other. Efficiency is remarkably flat — it
varies by under five points across a five-to-one load range — while **power
factor collapses** at light load, from 0.875 to 0.485. That asymmetry is the
whole argument for not oversizing motors: an oversized machine barely loses
efficiency but drags the plant power factor down, which is a cost paid at the
meter under every tariff in Section 6 of the power-factor topic.

### Worked example 7.1 — a full power-flow chain

A three-phase induction motor draws 25 kW. Stator copper loss is 900 W, core
loss 400 W, friction and windage 300 W, and the slip is 3.5 percent on a
6-pole, 60 Hz supply. Find every intermediate power, the developed torque, the
shaft torque and the efficiency.

$$P_{ag} = P_{in} - P_{scl} - P_{core} = 25{,}000 - 900 - 400 = 23{,}700\\ \\mathrm{W}$$

$$P_{rcl} = sP_{ag} = 0.035\\times 23{,}700 = 829.5\\ \\mathrm{W}$$

$$P_{mech} = (1-s)P_{ag} = 22{,}870.5\\ \\mathrm{W}, \\qquad P_{out} = 22{,}870.5-300 = 22{,}570.5\\ \\mathrm{W}$$

With **$\\omega_{s} = 2\\pi(60)/3 = 125.66$ rad/s** and
**$\\omega_{r} = 0.965\\omega_{s} = 121.27$ rad/s**:

$$T_{dev} = \\frac{P_{ag}}{\\omega_{s}} = \\frac{23{,}700}{125.66} = 188.6\\ \\mathrm{N{\\cdot}m}, \\qquad T_{shaft} = \\frac{P_{out}}{\\omega_{r}} = 186.1\\ \\mathrm{N{\\cdot}m}$$

$$\\eta = \\frac{22{,}570.5}{25{,}000} = 90.28\\%$$

**Trap named.** Developed torque divides air-gap power by **synchronous** speed;
shaft torque divides output power by **rotor** speed. Using rotor speed in the
first expression inflates the answer by 1/(1−s), and using synchronous speed in
the second deflates it by the same factor. The two errors look identical on the
page and land on different distractors.

## 7.2 The V-curves, drawn

Section 5 tabulated a synchronous motor's response to excitation at one load.
Sweeping the internal emf continuously, at three shaft loads, produces the
family the name refers to.

![Synchronous motor V-curves: armature current against internal emf at full load, half load and no load. Each curve has a minimum where the power factor is unity — 40.0 amperes at 288 volts on full load, 20.0 amperes at 280 volts on half load, and zero at 277 volts on no load — and rises on both sides, steeply on the under-excited left and more gently on the over-excited right.](/courses/fe-ee/figures/pow2-mot-vcurve.svg)

Three properties are visible and worth stating as rules:

- **Each minimum is unity power factor.** The armature current at that point is purely real: **$I_{a} = P/(3V_{ph})$**, independent of reactance.
- **The minima drift right as load increases.** More shaft load means a larger δ, so a larger E is needed to keep the current in phase.
- **The no-load curve reaches zero.** With no shaft power and E = V there is no armature current at all; the machine floats on the bus. Move the field either way and it becomes a pure reactive source or sink — a **synchronous condenser**.

### Worked example 7.2 — excitation for a specified power factor

A 2,300 V, 6-pole, 60 Hz synchronous motor with **$X_{s} = 8\\ \\Omega$** per
phase drives 500 kW. Find the armature current and internal emf when the field
is set for 0.8 power factor leading, and the pull-out power at that excitation.

$$I_{a} = \\frac{500{,}000}{\\sqrt{3}\\times 2{,}300\\times 0.8} = 156.9\\angle +36.87^\\circ\\ \\mathrm{A}$$

$$E = V - jX_{s}I_{a} = 1{,}327.9 - j8(156.9\\angle 36.87^\\circ) = 2{,}310.5\\angle -25.76^\\circ\\ \\mathrm{V}$$

so **4,002 V line-to-line internally against a 2,300 V bus** — heavily
over-excited, as leading operation requires. The pull-out power is the maximum
of the power-angle expression:

$$P_{max} = \\frac{3VE}{X_{s}} = \\frac{3(1{,}327.9)(2{,}310.5)}{8} = 1{,}150.6\\ \\mathrm{kW}$$

a margin of **2.30 times** the actual load. The machine also supplies
**$3VI_{a}\\sin\\phi = 375$ kVAR** to the bus while doing it — a synchronous
motor sized for its mechanical job and over-excited is a capacitor bank the
plant did not have to buy. Speed is exactly **$120(60)/6 = 1{,}200$ rpm**, load
or no load.

## 7.3 DC machines: two characteristics, two applications

The two DC equations, **$E = K\\phi\\,\\omega$** and **$T = K\\phi\\,I_{a}$**, produce
completely different behaviour depending on how the field is connected.

**Shunt**: the field sees the full terminal voltage, so **$K\\phi$** is constant.

$$\\omega = \\frac{V - I_{a}R_{a}}{K\\phi} = \\frac{V}{K\\phi} - \\frac{R_{a}}{(K\\phi)^{2}}T$$

a straight line with a small negative slope — nearly constant speed.

**Series**: the field carries the armature current, so **$\\phi \\propto I_{a}$**
and **$T = kI_{a}^{2}$**.

$$\\omega = \\frac{V}{\\sqrt{kT}} - \\frac{R}{k}$$

speed falling as the inverse square root of torque — very high torque at low
speed, and dangerous overspeed at no load.

![Speed against torque for a 240 volt shunt motor and a 240 volt series motor. The shunt characteristic is a nearly flat line falling from 1,846 rpm at 24 newton-metres to 1,655 rpm at 96; the series characteristic starts above 3,500 rpm at light load, crosses the shunt curve near 60 newton-metres, and falls to about 900 rpm at 200 newton-metres.](/courses/fe-ee/figures/pow2-mot-dc-speed-torque.svg)

### Worked example 7.3 — a shunt motor at three loads

A 240 V shunt motor has **$R_{a} = 0.40\\ \\Omega$** and
**$K\\phi = 1.20\\ \\mathrm{V{\\cdot}s/rad}$**. Find the speed at armature currents
of 20, 50 and 80 A.

$$\\omega = \\frac{240 - 0.40I_{a}}{1.20}$$

| I_a | Torque | ω | Speed |
|---|---|---|---|
| 20 A | 24.0 N·m | 193.3 rad/s | 1,846 rpm |
| 50 A | 60.0 N·m | 183.3 rad/s | 1,751 rpm |
| 80 A | 96.0 N·m | 173.3 rad/s | 1,655 rpm |

A four-fold increase in torque costs 10.3 percent of speed. **Check:** at
50 A, **$T/I_{a} = 60.0/50 = 1.20$** and
**$E/\\omega = (240-20)/183.3 = 1.20$** — the two meanings of Kφ agree, which
they must.

### Worked example 7.4 — the same torque from a series motor

A 240 V series motor has **$T = 0.020I_{a}^{2}$** and a total resistance of
0.50 Ω. Find the speed at 60.5 N·m and at 200 N·m, and the starting resistance
needed to hold the inrush to twice the 50 A rated current.

At **$T = 60.5$ N·m**, **$I_{a} = \\sqrt{60.5/0.020} = 55.0$ A**:

$$\\omega = \\frac{240 - 55.0(0.50)}{0.020\\times 55.0} = \\frac{212.5}{1.10} = 193.2\\ \\mathrm{rad/s} = 1{,}845\\ \\mathrm{rpm}$$

At **$T = 200$ N·m**, **$I_{a} = 100$ A** and **$\\omega = 95.0$ rad/s = 907
rpm**. Torque tripled and speed halved, so output power is roughly constant —
the defining property of series traction drives.

**Starting.** At standstill there is no back emf, so

$$R_{total} = \\frac{240}{2\\times 50} = 2.40\\ \\Omega \\;\\Rightarrow\\; R_{ext} = 2.40-0.50 = 1.90\\ \\Omega$$

**Trap named.** Never run a series motor unloaded. As T approaches zero the
**$V/\\sqrt{kT}$** term diverges, and a real machine reaches destructive speed
in seconds — which is why series motors are permanently coupled through gearing
and never belted.`,
      examTip: 'Two divisions decide most machine questions: air-gap power over SYNCHRONOUS speed gives developed torque, and output power over ROTOR speed gives shaft torque. Write ω_s = 2πf/(p/2) at the top of the page in rad/s, never in rpm, and both follow.',
      importantNote: 'Efficiency and power factor do not degrade together at part load. Efficiency stays within a few points from half load upward, while power factor falls off a cliff — 0.875 at rated load and 0.485 at quarter load on this machine. That is why oversizing a motor is a power-factor problem long before it is an efficiency problem.',
    },
    {
      id: 'motors-problem-set-a',
      title: '8. Problem Set A: Induction Machine Analysis',
      content: `Six induction-machine problems, all solvable from the slip
definition and the power-flow chain. Full solutions follow.

## 8. Problem Set A — slip, power flow, and torque

### The problems

**A1.** A 6-pole, 60 Hz induction motor runs at 1,164 rpm. Find the
synchronous speed, the slip, the slip speed and the rotor frequency.

**A2.** That motor draws 25 kW with 900 W of stator copper loss and 400 W of
core loss. Find the air-gap power, the rotor copper loss and the mechanical
power developed, using the slip from A1 rounded to 3.5 percent.

**A3.** With 300 W of friction and windage, find the shaft output, the
developed torque, the shaft torque and the efficiency.

**A4.** A 460 V, 4-pole machine has **$R_{1}=0.20\\ \\Omega$**,
**$R_{2}=0.18\\ \\Omega$** and **$X=0.90\\ \\Omega$** per phase. Find the starting
torque, the slip at maximum torque and the breakdown torque.

**A5.** For that machine, find the external rotor resistance that puts maximum
torque at standstill, and the resulting starting torque.

**A6.** The machine of A4 is supplied at 414 V instead of 460 V. Find the new
breakdown torque and the new slip at which it occurs.

### Solutions

**A1.**

$$N_{s} = \\frac{120(60)}{6} = 1{,}200\\ \\mathrm{rpm}, \\qquad s = \\frac{1{,}200-1{,}164}{1{,}200} = 0.0300$$

Slip speed is **36 rpm** and rotor frequency **$sf = 1.80$ Hz**.
*Distractor:* 1,164/1,200 = 0.970 is the speed ratio, not the slip.

**A2.**

$$P_{ag} = 25{,}000-900-400 = 23{,}700\\ \\mathrm{W}$$

$$P_{rcl} = 0.035(23{,}700) = 829.5\\ \\mathrm{W}, \\qquad P_{mech} = 0.965(23{,}700) = 22{,}870.5\\ \\mathrm{W}$$

*Distractor:* taking rotor copper loss as a fraction of the **input** power
rather than the air-gap power gives 875 W. Slip multiplies P_ag, always.

**A3.** **$P_{out} = 22{,}870.5-300 = 22{,}570.5$ W**, and with
**$\\omega_{s} = 125.66$ rad/s**, **$\\omega_{r} = 121.27$ rad/s**:

$$T_{dev} = \\frac{23{,}700}{125.66} = 188.6\\ \\mathrm{N{\\cdot}m}, \\qquad T_{shaft} = \\frac{22{,}570.5}{121.27} = 186.1\\ \\mathrm{N{\\cdot}m}$$

$$\\eta = \\frac{22{,}570.5}{25{,}000} = 90.28\\%$$

*Distractor:* dividing air-gap power by rotor speed gives 195.4 N·m for the
developed torque, high by 3.6 percent.

**A4.** With **$V_{ph} = 265.58$ V** and **$\\omega_{s} = 188.5$ rad/s**:

$$T_{start} = \\frac{3(265.58)^{2}(0.18)}{188.5\\left[(0.38)^{2}+0.81\\right]} = 211.7\\ \\mathrm{N{\\cdot}m}$$

$$s_{maxT} = \\frac{0.18}{\\sqrt{0.04+0.81}} = 0.1952, \\qquad T_{max} = \\frac{3(265.58)^{2}}{2(188.5)(0.20+0.9220)} = 500.3\\ \\mathrm{N{\\cdot}m}$$

*Distractor:* using 460 V rather than 265.58 V in the numerator triples every
torque.

**A5.** Maximum torque at standstill needs
**$R_{2} = \\sqrt{R_{1}^{2}+X^{2}} = 0.9220\\ \\Omega$**, so

$$R_{ext} = 0.9220-0.18 = 0.7420\\ \\Omega, \\qquad T_{start} = T_{max} = 500.3\\ \\mathrm{N{\\cdot}m}$$

a 2.36-fold improvement. *Distractor:* 0.9220 Ω itself — the question asks for
the **added** resistance, and the rotor already has 0.18 Ω of its own.

**A6.** Torque scales with the square of voltage and the breakdown slip does
not move at all:

$$T_{max}' = 500.3\\left(\\frac{414}{460}\\right)^{2} = 500.3(0.81) = 405.2\\ \\mathrm{N{\\cdot}m}, \\qquad s_{maxT} = 0.1952$$

A 10 percent voltage sag costs 19 percent of the stalling margin.
*Distractor:* scaling linearly gives 450.3 N·m and understates the risk.`,
      examTip: 'Every quantity in the power-flow chain is one multiplication from its neighbour: P_ag × s is rotor copper loss, P_ag × (1−s) is mechanical power, and P_ag ÷ ω_s is developed torque. Draw the chain once at the top of the page and the question becomes a matter of entering it at the right point.',
      importantNote: 'Torque scales with the SQUARE of applied voltage while the slip at maximum torque does not change at all. A 10 percent voltage sag therefore removes 19 percent of the breakdown torque, and it is the reason under-voltage is the most common cause of induction-motor stalling on a weak feeder.',
    },
    {
      id: 'motors-problem-set-b',
      title: '9. Problem Set B: Synchronous and DC Machines',
      content: `The synchronous machine is a phasor problem and the DC machine is
two equations. These six cover both, plus the selection question that follows.

## 9. Problem Set B — synchronous and DC machines

### The problems

**B1.** A 2,300 V, 6-pole, 60 Hz synchronous motor with **$X_{s}=8\\ \\Omega$**
per phase drives 500 kW at 0.8 power factor leading. Find the speed, the
armature current and the internal emf.

**B2.** For that operating point, find the pull-out power and the reactive
power the machine supplies to the bus.

**B3.** The field of the same motor is reduced until the power factor becomes
0.8 lagging at the same shaft load. State what happens to the internal emf and
to the reactive power, without recomputing the magnitudes.

**B4.** A 240 V DC shunt motor has **$R_{a}=0.40\\ \\Omega$** and
**$K\\phi = 1.20$ V·s/rad**. Find the speed and torque at 50 A, and verify Kφ
from both of its definitions.

**B5.** A 240 V DC series motor has **$T = 0.020I_{a}^{2}$** and 0.50 Ω of
total resistance. Find its speed at 60.5 N·m and at 200 N·m.

**B6.** For the series motor of B5, rated at 50 A, find the external
resistance needed to limit starting current to twice rated.

### Solutions

**B1.** Speed is fixed: **$N_{s} = 120(60)/6 = 1{,}200$ rpm**.

$$I_{a} = \\frac{500{,}000}{\\sqrt{3}(2{,}300)(0.8)} = 156.9\\ \\mathrm{A}\\ \\text{at}\\ +36.87^\\circ$$

$$E = 1{,}327.9 - j8(156.9\\angle 36.87^\\circ) = 2{,}310.5\\angle -25.76^\\circ\\ \\mathrm{V/phase}$$

or **4,002 V line-to-line**. *Distractor:* using **$E = V + jX_{s}I_{a}$**, the
generator convention, gives 1,157 V per phase and a nonsensical under-excited
answer for a leading power factor.

**B2.**

$$P_{max} = \\frac{3(1{,}327.9)(2{,}310.5)}{8} = 1{,}150.6\\ \\mathrm{kW}\\ (2.30\\times\\text{the load})$$

$$Q = \\sqrt{3}(2{,}300)(156.9)\\sin(36.87^\\circ) = 375\\ \\mathrm{kVAR\\ supplied}$$

*Distractor:* computing pull-out from V² rather than VE — the field is what
sets the margin.

**B3.** Reducing the field reduces **E**, so the machine moves left along its
V-curve, through unity power factor, into the under-excited region. It then
**absorbs** reactive power instead of supplying it, and the pull-out margin
**falls** in proportion to E. Shaft power is unchanged, so δ increases to
compensate. *Distractor:* claiming the shaft power changes — excitation is a
reactive control only.

**B4.**

$$\\omega = \\frac{240-50(0.40)}{1.20} = 183.3\\ \\mathrm{rad/s} = 1{,}751\\ \\mathrm{rpm}, \\qquad T = 1.20(50) = 60.0\\ \\mathrm{N{\\cdot}m}$$

Verification: **$E/\\omega = 220/183.3 = 1.20$** V·s/rad and
**$T/I_{a} = 60/50 = 1.20$** N·m/A — the same number, as it must be.
*Distractor:* reporting 183.3 as rpm, which is off by the factor 9.549.

**B5.** At 60.5 N·m, **$I_{a} = \\sqrt{60.5/0.020} = 55.0$ A**:

$$\\omega = \\frac{240-55.0(0.50)}{0.020(55.0)} = 193.2\\ \\mathrm{rad/s} = 1{,}845\\ \\mathrm{rpm}$$

At 200 N·m, **$I_{a} = 100$ A** and **$\\omega = 190/2.00 = 95.0$ rad/s = 907
rpm**. *Distractor:* assuming torque is proportional to current, as in a shunt
machine; in a series machine it goes as current squared.

**B6.** At standstill the back emf is zero:

$$R_{total} = \\frac{240}{2(50)} = 2.40\\ \\Omega \\;\\Rightarrow\\; R_{ext} = 2.40-0.50 = 1.90\\ \\Omega$$

*Distractor:* forgetting to subtract the machine's own 0.50 Ω, which
over-resists the start and produces only 69 percent of the intended torque.`,
      examTip: 'For a synchronous MOTOR use E = V − jX_s·I_a; for a generator use E = V + jX_s·I_a. Choosing the wrong one is not a sign error you can fix at the end — it changes the magnitude of E and therefore the pull-out power, and both wrong answers appear on the option list.',
      importantNote: 'A DC series motor must never be run unloaded. Its speed goes as V/√(kT), which diverges as torque approaches zero; that is the same property that gives it enormous starting torque, and it is why series machines are geared rather than belted to their loads.',
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
    {
      id: 'fault-four-types-worked',
      title: '5. All Four Fault Types From One Set of Sequence Networks',
      content: `## 5.1 Three networks, four connections

Symmetrical components do not solve a fault. They **convert** it: an
unbalanced three-phase problem becomes three balanced single-phase problems
that are coupled only at the fault point, and the way they are coupled is
what distinguishes one fault type from another.

| Fault | Network connection | Fault-point relation |
|---|---|---|
| Three-phase | positive only | $I_{a1} = E/Z_{1}$ |
| Line to ground | all three in **series** | $I_{a1}=I_{a2}=I_{a0}=E/(Z_{1}+Z_{2}+Z_{0}+3Z_{f})$ |
| Line to line | positive and negative in **parallel** | $I_{a1}=-I_{a2}=E/(Z_{1}+Z_{2})$ |
| Two lines to ground | negative and zero in parallel, then in series with positive | $I_{a1}=E/[Z_{1}+Z_{2}Z_{0}/(Z_{2}+Z_{0})]$ |

Learn the four connections and every fault calculation is the same two steps:
build the sequence currents, then transform back with

$$\\begin{bmatrix}I_{a}\\\\ I_{b}\\\\ I_{c}\\end{bmatrix} = \\begin{bmatrix}1&1&1\\\\ 1&a^{2}&a\\\\ 1&a&a^{2}\\end{bmatrix}\\begin{bmatrix}I_{a0}\\\\ I_{a1}\\\\ I_{a2}\\end{bmatrix}$$

## 5.2 One bus, all four answers

Take a 13.8 kV bus with **$X_{1} = X_{2} = 0.20$ pu** and
**$X_{0} = 0.10$ pu** on a 100 MVA base, prefault voltage 1.0 pu, and a bolted
fault. Base current is **$100\\times10^{6}/(\\sqrt{3}\\times 13{,}800) = 4{,}183.7$ A**.

**Three-phase.** Only the positive network exists:

$$I_{f} = \\frac{1.0}{0.20} = 5.000\\ \\mathrm{pu} = 20{,}918\\ \\mathrm{A}$$

**Single line to ground.** Three networks in series:

$$I_{a} = \\frac{3(1.0)}{0.20+0.20+0.10} = \\frac{3}{0.50} = 6.000\\ \\mathrm{pu} = 25{,}102\\ \\mathrm{A}$$

**Line to line.** Positive and negative in parallel; the faulted phase current
is √3 times the sequence current:

$$I_{b} = \\frac{\\sqrt{3}(1.0)}{0.20+0.20} = 4.330\\ \\mathrm{pu} = 18{,}116\\ \\mathrm{A}$$

**Two lines to ground.** Zero and negative in parallel:

$$I_{a1} = \\frac{1.0}{0.20 + \\frac{(0.20)(0.10)}{0.30}} = \\frac{1.0}{0.2667} = 3.750\\ \\mathrm{pu}$$

$$V_{a1} = 1.0 - j0.20(3.750\\angle -90^\\circ) = 0.250, \\quad I_{a2} = -\\frac{0.250}{j0.20} = 1.250, \\quad I_{a0} = -\\frac{0.250}{j0.10} = 2.500\\ \\mathrm{pu}$$

Transforming back gives phase currents of **5.728 pu (23,965 A)** in each
faulted phase and a **ground return of $3I_{a0} = 7.500$ pu, or 31,378 A** —
the largest number on this bus, and the one the ground grid must carry.

| Fault | Phase current | Ground current | Relative to 3-phase |
|---|---|---|---|
| Three-phase | 20,918 A | 0 | 1.000 |
| Line to ground | 25,102 A | 25,102 A | 1.200 |
| Line to line | 18,116 A | 0 | 0.866 |
| Two lines to ground | 23,965 A | 31,378 A | 1.146 |

![Sequence-component signature of four fault types on the 13.8 kilovolt bus, drawn as grouped bars of zero, positive and negative sequence current. A three-phase fault is pure positive sequence at 5.00 per unit; a single-line-to-ground fault splits exactly into thirds at 2.00 each; a line-to-line fault has no zero sequence and equal positive and negative components of 2.50; and a double-line-to-ground fault gives 2.50, 3.75 and 1.25.](/courses/fe-ee/figures/pow2-flt-sequence-signature.svg)

That figure is how a modern relay identifies a fault before a human sees it.
Zero-sequence current present means the ground is involved. Negative sequence
without zero sequence means a phase-to-phase fault. Neither present means the
disturbance is balanced.

### Worked example 5.1 — decomposing a measured set

A relay records **$I_{a} = 10\\angle 0^\\circ$**, **$I_{b} = 8\\angle -140^\\circ$**
and **$I_{c} = 6\\angle 100^\\circ$** amperes. Find the sequence components and
the neutral current.

$$I_{a0} = \\tfrac{1}{3}\\left(I_{a}+I_{b}+I_{c}\\right) = 0.977\\angle 15.16^\\circ\\ \\mathrm{A}$$

$$I_{a1} = \\tfrac{1}{3}\\left(I_{a}+aI_{b}+a^{2}I_{c}\\right) = 7.882\\angle -11.68^\\circ\\ \\mathrm{A}$$

$$I_{a2} = \\tfrac{1}{3}\\left(I_{a}+a^{2}I_{b}+aI_{c}\\right) = 1.894\\angle 45.05^\\circ\\ \\mathrm{A}$$

Neutral current is **$3I_{a0} = 2.932$ A**. Check by transforming back: the
three reconstructed magnitudes are exactly 10, 8 and 6 A. **Trap named.** The
**$a$** and **$a^{2}$** swap between the positive- and negative-sequence rows;
interchanging them exchanges the two answers, and since both are plausible
magnitudes nothing about the result looks wrong.

### Worked example 5.2 — a ground fault through arc resistance

Repeat the single-line-to-ground calculation on the lesson bus with 2 Ω of arc
resistance at the fault. Base impedance is
**$13{,}800^{2}/10^{8} = 1.9044\\ \\Omega$**, so **$Z_{f} = 1.0502$ pu**, and
**$3Z_{f}$** enters the series loop:

$$I_{a} = \\frac{3(1.0)}{\\left|j0.50 + 3(1.0502)\\right|} = \\frac{3}{3.1927} = 0.9396\\ \\mathrm{pu} = 3{,}930\\ \\mathrm{A}$$

Two ohms of arc has cut the ground fault current by **84 percent**. That is why
ground faults are hard to detect and why sensitive ground relays are set far
below phase relays: a bolted ground fault looks like a short circuit, and a
high-impedance one looks like load.

## 5.3 Which fault is worst, and when

![Fault current for the four shunt fault types as the zero-sequence reactance is swept from 0.15 to 5 times the positive-sequence value. The single-line-to-ground current falls steeply from above 7 per unit and crosses the flat 5.00 per-unit three-phase line exactly at X0 equal to X1; the line-to-line current is a flat 4.330 per unit because it does not involve the zero-sequence network at all.](/courses/fe-ee/figures/pow2-flt-type-comparison.svg)

The crossover is worth deriving rather than remembering. Setting the two
currents equal with **$Z_{2}=Z_{1}$**:

$$\\frac{3E}{2Z_{1}+Z_{0}} = \\frac{E}{Z_{1}} \\;\\Longleftrightarrow\\; 3Z_{1} = 2Z_{1}+Z_{0} \\;\\Longleftrightarrow\\; Z_{0} = Z_{1}$$

So the ground fault exceeds the three-phase fault **exactly when the
zero-sequence impedance is smaller than the positive-sequence impedance**, which
happens routinely at the solidly grounded wye of a delta–wye transformer,
where the zero-sequence network sees only the transformer and not the source
behind it.

### Worked example 5.3 — sizing a breaker on the right fault

The bus above is to receive a breaker. Which current sets the interrupting
rating?

The largest **phase** current is the single-line-to-ground value, 25,102 A —
20 percent above the three-phase value. Choosing on the three-phase number
alone under-rates the breaker by that margin. (The 31,378 A of ground return in
the double-line-to-ground case flows in the earth and the neutral, not through
a single breaker pole, so it sizes the **ground grid** rather than the
interrupter.)

**Trap named.** "Three-phase is the worst fault" is a rule of thumb that holds
on transmission systems, where the zero-sequence path includes long lines with
**$X_{0}\\approx 3X_{1}$**. It fails at distribution substations, and that is
precisely where the breaker is smallest and the margin thinnest.

### Worked example 5.4 — the asymmetric first cycle

The bus has an X/R ratio of 15. Find the total asymmetric rms current half a
cycle after a three-phase fault.

The dc offset decays with **$\\tau = (X/R)/\\omega = 15/377 = 0.03979$ s**, and the
total rms is

$$I_{asym} = I_{sym}\\sqrt{1 + 2e^{-2t/\\tau}}$$

At **$t = 1/120$ s**, **$2t/\\tau = 0.4189$** and
**$\\sqrt{1+2(0.6577)} = 1.5217$**, so

$$I_{asym} = 1.5217\\times 20{,}918 = 31{,}831\\ \\mathrm{A}$$

The breaker must close and latch against 31.8 kA even though it only has to
interrupt 20.9 kA a few cycles later.`,
      examTip: 'The four sequence-network connections are the whole topic: positive only, three in series, positive parallel negative, and negative parallel zero then in series with positive. Write those four down before reading the numbers, and every fault question becomes one impedance combination and one division.',
      importantNote: 'Fault impedance enters the single-line-to-ground loop as 3Z_f, not Z_f, because the fault current passes through the same physical impedance three times as far as the sequence networks are concerned. Two ohms of arc on this 13.8 kV bus removes 84 percent of the ground-fault current, which is why high-impedance ground faults are a detection problem rather than an interruption problem.',
    },
    {
      id: 'fault-coordination-grounding',
      title: '6. Protection Coordination and System Grounding',
      content: `## 6.1 Fault current is a function of position

A protective scheme has to distinguish a fault at the far end of a feeder from
load at the near end, and the only information available is current. Take a
13.8 kV feeder of **$z = 0.30+j0.60\\ \\Omega/\\mathrm{km}$** fed from a source of
**$j0.50\\ \\Omega$**:

$$I_{f}(d) = \\frac{V_{LN}}{\\left|Z_{s} + zd\\right|} = \\frac{7{,}967}{\\left|j0.50 + (0.30+j0.60)d\\right|}$$

![Three-phase fault current along a 13.8 kilovolt feeder against distance from the substation. It falls from 15,935 amperes at the substation bus to 4,420 at 2 kilometres and 2,092 at 5 kilometres, a factor of 7.6 across a short feeder, and approaches a plausible 1,000 ampere relay pickup only beyond 11 kilometres.](/courses/fe-ee/figures/pow2-flt-current-vs-distance.svg)

| Fault position | Impedance to fault | Fault current |
|---|---|---|
| Substation bus | 0.500 Ω | 15,935 A |
| 1 km | 1.140 Ω | 6,988 A |
| 2 km | 1.803 Ω | 4,420 A |
| 5 km | 3.808 Ω | 2,092 A |
| 8 km | 5.818 Ω | 1,369 A |

The 7.6-to-1 spread across five kilometres is what makes distance-graded
protection possible, and the flattening beyond that is what makes it stop
working: past about 8 km a fault current is no longer clearly distinguishable
from a heavy load, which is where impedance relays replace overcurrent relays.

### Worked example 6.1 — how far does a pickup setting reach?

A relay picks up at 1,000 A. How far along the feeder can it detect a bolted
three-phase fault? Solve **$|j0.5 + (0.30+j0.60)d| = 7{,}967/1{,}000 = 7.967$**:

$$\\sqrt{(0.30d)^{2} + (0.5+0.60d)^{2}} = 7.967 \\;\\Longrightarrow\\; d = 11.21\\ \\mathrm{km}$$

At a 2,000 A pickup the reach falls to **5.26 km**. Halving the reach requires
doubling the setting, because impedance grows almost linearly with distance and
current is its reciprocal. **Trap named.** Reach must be checked against the
**minimum** fault current — a line-to-line fault at the far end, at 0.866 of
the three-phase value — not against the bolted three-phase current, which is
the easiest fault to see.

## 6.2 Inverse-time coordination

An overcurrent relay trips after a delay that shrinks as current grows. The
standard very-inverse characteristic is

$$t = \\frac{TD \\times 13.5}{M - 1}, \\qquad M = \\frac{I}{I_{pickup}}$$

with **$TD$** the time dial. Two relays in series must satisfy one rule at
every current they both see: the **downstream** relay must operate first, by a
margin large enough to cover breaker operating time, relay overtravel and
setting error — conventionally **0.3 to 0.4 s**.

![Time-current curves of two very-inverse overcurrent relays in series on log-log axes. The downstream relay picks up at 100 amperes with a time dial of 0.10 and the upstream at 300 amperes with a time dial of 0.30; the vertical gap between them narrows as current rises, from 3.78 seconds at 600 amperes to 0.294 seconds at 4,000 amperes.](/courses/fe-ee/figures/pow2-flt-tcc-coordination.svg)

| Fault current | Downstream trips | Upstream trips | Margin |
|---|---|---|---|
| 800 A | 0.193 s | 2.430 s | 2.237 s |
| 2,000 A | 0.071 s | 0.715 s | 0.644 s |
| 2,500 A | 0.056 s | 0.552 s | 0.496 s |
| 4,000 A | 0.035 s | 0.328 s | 0.294 s |

The margin **shrinks as current rises**, so coordination must always be checked
at the **maximum** fault current the pair can both see — here 4,000 A, where
0.294 s is marginally short of the 0.30 s target.

### Worked example 6.2 — fixing a marginal interval

Raise the upstream time dial so the margin at 4,000 A is 0.35 s.

The downstream relay operates in 0.0346 s, so the upstream must operate at
0.3846 s. With **$M = 4{,}000/300 = 13.33$**:

$$TD = \\frac{t(M-1)}{13.5} = \\frac{0.3846\\times 12.33}{13.5} = 0.351$$

Raise the dial from 0.30 to 0.35. **Trap named.** Every other point on the
upstream curve is delayed by the same 17 percent, so a 600 A fault now clears
in 4.73 s instead of 4.05 s. Coordination is always a trade of selectivity
against clearing time, and the arc-flash energy released is proportional to
that time.

## 6.3 Grounding: the one design choice that sets ground fault current

Phase fault current is set by the source and the conductors, which are not
negotiable. Ground fault current is set by the **neutral connection**, which
is. Inserting **$R_{n}$** in the neutral adds **$3R_{n}$** to the
zero-sequence loop:

$$I_{SLG} = \\frac{3E}{\\left|Z_{1}+Z_{2}+Z_{0}+3R_{n}\\right|}$$

![Single-line-to-ground fault current on the 13.8 kilovolt bus against neutral grounding resistance, on logarithmic axes. Solid grounding gives 25,102 amperes; a 10 ohm resistor gives 796 amperes and a 50 ohm resistor 159 amperes, and the shaded band marks the 400 to 2,000 ampere window that low-resistance grounding designs usually target.](/courses/fe-ee/figures/pow2-flt-grounding.svg)

| Method | Neutral | Ground fault current | Consequence |
|---|---|---|---|
| Solidly grounded | Direct | 25,102 A | Severe arc damage; simple relaying |
| Low resistance | ~10 Ω | 796 A | Limits damage; still detectable |
| High resistance | ~50 Ω | 159 A | Alarm rather than trip; keeps process running |
| Ungrounded | None | Capacitive only, a few amps | Transient overvoltage risk on the healthy phases |

### Worked example 6.3 — sizing a neutral grounding resistor

Choose **$R_{n}$** to limit the ground fault on the lesson bus to 400 A.

In per unit, 400 A is **$400/4{,}183.7 = 0.09561$ pu**, so the loop impedance
must be **$3/0.09561 = 31.38$ pu**. Since **$3R_{n}$** dominates the small
reactances:

$$3R_{n} \\approx 31.38 \\;\\Rightarrow\\; R_{n} \\approx 10.46\\ \\mathrm{pu} = 10.46\\times 1.9044 = 19.92\\ \\Omega$$

Specify a **20 Ω** resistor. Its rating is set by the fault it must survive:
**$I^{2}R = 400^{2}\\times 20 = 3.2$ MW** for the ten seconds a typical resistor
is rated. **Trap named.** The 3 in **$3R_{n}$** is the whole calculation. Sizing
from **$E/R_{n}$** without it gives 6.6 Ω and triple the intended fault current.

### Worked example 6.4 — why the delta winding matters

A delta–wye transformer feeds the bus, with the wye solidly grounded on the
low side. Explain, in sequence terms, why the ground fault current does not
depend on the source behind the transformer.

The delta winding provides no path for zero-sequence current to leave the
transformer, so the **zero-sequence network terminates at the transformer**: it
sees only the transformer's own zero-sequence reactance, typically 0.85 of its
positive-sequence value, and nothing of the system beyond. The positive- and
negative-sequence networks, by contrast, see the whole source. That asymmetry is
exactly the **$Z_{0} < Z_{1}$** condition of Section 5.3, and it is why a
distribution bus fed through a delta–wye transformer routinely has a ground
fault current larger than its three-phase fault current.`,
      examTip: 'Coordination margin is always tightest at the HIGHEST common fault current, because inverse curves converge. Check the pair at maximum fault duty first; if it passes there, the lower currents look after themselves.',
      importantNote: 'A neutral grounding resistor appears in the zero-sequence loop as 3R_n. That factor of three is the difference between a correctly sized resistor and one that permits three times the intended fault current, and it is the most reliably tested detail in the grounding question.',
    },
    {
      id: 'fault-problem-set-a',
      title: '7. Problem Set A: Symmetrical Components and Fault Types',
      content: `All six use the 13.8 kV bus of Section 5: **$X_{1}=X_{2}=0.20$ pu**,
**$X_{0}=0.10$ pu** on 100 MVA, base current 4,183.7 A, prefault 1.0 pu.

## 7. Problem Set A — sequence components and the four faults

### The problems

**A1.** A relay records **$I_{a}=10\\angle 0^\\circ$**,
**$I_{b}=8\\angle -140^\\circ$**, **$I_{c}=6\\angle 100^\\circ$** A. Find the three
sequence components and the neutral current.

**A2.** Find the bolted single-line-to-ground fault current on the bus, in per
unit and in amperes.

**A3.** Repeat A2 with 2 Ω of arc resistance at the fault.

**A4.** Find the line-to-line fault current, and its ratio to the three-phase
fault current.

**A5.** Find the double-line-to-ground fault: the three sequence currents, the
faulted phase current, and the ground return current.

**A6.** The bus has an X/R ratio of 15. Find the asymmetric rms current half a
cycle after a bolted three-phase fault.

### Solutions

**A1.**

$$I_{a0} = \\tfrac{1}{3}(I_{a}+I_{b}+I_{c}) = 0.977\\angle 15.16^\\circ\\ \\mathrm{A}$$

$$I_{a1} = 7.882\\angle -11.68^\\circ\\ \\mathrm{A}, \\qquad I_{a2} = 1.894\\angle 45.05^\\circ\\ \\mathrm{A}$$

and **$I_{n} = 3I_{a0} = 2.932$ A**. *Distractor:* omitting the 1/3 from all
three definitions triples every component; the check is that the reconstructed
phase currents must return 10, 8 and 6 A exactly.

**A2.**

$$I_{a} = \\frac{3(1.0)}{0.20+0.20+0.10} = 6.000\\ \\mathrm{pu} = 25{,}102\\ \\mathrm{A}$$

*Distractor:* omitting the factor of 3 gives 2.0 pu. The 3 comes from
**$I_{a} = 3I_{a1}$** at a single-phase fault.

**A3.** **$Z_{f} = 2/1.9044 = 1.0502$ pu**, and it enters as **$3Z_{f}$**:

$$I_{a} = \\frac{3}{\\left|j0.50+3.1506\\right|} = \\frac{3}{3.1901} = 0.9404\\ \\mathrm{pu} = 3{,}934\\ \\mathrm{A}$$

An 84 percent reduction from two ohms. *Distractor:* using **$Z_{f}$** rather
than **$3Z_{f}$** returns 1.90 pu, twice too large.

**A4.**

$$I_{b} = \\frac{\\sqrt{3}(1.0)}{0.40} = 4.330\\ \\mathrm{pu} = 18{,}116\\ \\mathrm{A}, \\qquad \\frac{I_{LL}}{I_{3\\phi}} = \\frac{\\sqrt{3}}{2} = 0.866$$

The 0.866 ratio holds whenever **$Z_{2}=Z_{1}$**, which is nearly always true
away from rotating machines. *Distractor:* 1.0/0.40 = 2.5 pu is the sequence
current, not the phase current.

**A5.**

$$I_{a1} = \\frac{1.0}{0.20+\\frac{(0.20)(0.10)}{0.30}} = 3.750\\ \\mathrm{pu}, \\qquad V_{a1} = 0.250\\ \\mathrm{pu}$$

$$I_{a2} = -\\frac{0.250}{j0.20} = 1.250\\ \\mathrm{pu}, \\qquad I_{a0} = -\\frac{0.250}{j0.10} = 2.500\\ \\mathrm{pu}$$

Phase current **5.728 pu = 23,965 A**; ground return
**$3I_{a0} = 7.500$ pu = 31,378 A**. *Distractor:* reporting 7.5 pu as the
phase current — it is the sum returning through earth, and no single conductor
carries it.

**A6.** **$\\tau = 15/377 = 0.03979$ s** and **$t = 1/120$ s**:

$$I_{asym} = 20{,}918\\sqrt{1+2e^{-0.4189}} = 20{,}918(1.5217) = 31{,}831\\ \\mathrm{A}$$

*Distractor:* using the peak asymmetry factor of √2 × 1.52 = 2.15 and
reporting 45 kA — that is the instantaneous **peak**, which sizes mechanical
bracing, not the rms the close-and-latch rating is written against.`,
      examTip: 'Sequence currents are per-phase quantities; the fault current in a conductor is a transformation away. I_a = 3I_a1 for a single-line-to-ground fault, I_b = √3·I_a1 for a line-to-line fault, and 3I_a0 for the ground return of a double-line-to-ground fault. Reporting a sequence current as a fault current is the most frequent error in this topic.',
      importantNote: 'Every current in this set is a per-unit number multiplied by 4,183.7 A. Compute all four faults in per unit first, compare them there, and convert once at the end — the comparison is the part the question is testing and it needs no amperes at all.',
    },
    {
      id: 'fault-problem-set-b',
      title: '8. Problem Set B: Duty, Coordination, and Grounding',
      content: `The fault current is only the first half of the question. These six
are about what is done with it.

## 8. Problem Set B — breaker duty, relay coordination, grounding

### The problems

**B1.** A 13.8 kV feeder of **$z = 0.30+j0.60\\ \\Omega/\\mathrm{km}$** is fed from a
source of **$j0.50\\ \\Omega$**. Find the bolted three-phase fault current at the
bus and at 2 km.

**B2.** A relay on that feeder picks up at 1,000 A. Find its reach for a bolted
three-phase fault, and comment on its reach for a line-to-line fault.

**B3.** Two very-inverse relays follow **$t = TD\\times 13.5/(M-1)$**. The
downstream unit has a 100 A pickup and TD 0.10; the upstream has a 300 A pickup
and TD 0.30. Find the coordination margin at 2,000 A and at 4,000 A.

**B4.** Raise the upstream time dial so the margin at 4,000 A is 0.35 s.

**B5.** On the Section 5 bus, choose a neutral grounding resistor to limit the
ground fault current to 400 A, and find the energy the resistor must dissipate
in a 10 second fault.

**B6.** Explain why a distribution bus fed through a delta–wye transformer can
have a ground fault current larger than its three-phase fault current.

### Solutions

**B1.** With **$V_{LN} = 7{,}967$ V**:

$$I_{f}(0) = \\frac{7{,}967}{0.500} = 15{,}935\\ \\mathrm{A}, \\qquad I_{f}(2) = \\frac{7{,}967}{\\left|j0.5+0.60+j1.20\\right|} = \\frac{7{,}967}{1.803} = 4{,}420\\ \\mathrm{A}$$

*Distractor:* adding the impedance magnitudes arithmetically, 0.50 + 1.342 =
1.842 Ω, instead of adding the complex quantities.

**B2.** Solve **$\\left|j0.5+(0.30+j0.60)d\\right| = 7.967$**:

$$\\sqrt{(0.30d)^{2}+(0.5+0.60d)^{2}} = 7.967 \\;\\Rightarrow\\; d = 11.21\\ \\mathrm{km}$$

For a line-to-line fault the current is 0.866 of that value at every point, so
the same 1,000 A pickup reaches only about **9.5 km**. Reach must be verified
against the minimum fault, not the maximum. *Distractor:* dividing 7.967 by
0.671 Ω/km as though the impedances were scalars gives 11.9 km.

**B3.**

$$t_{down}(2000) = \\frac{0.10\\times13.5}{19} = 0.0711\\ \\mathrm{s}, \\qquad t_{up}(2000) = \\frac{0.30\\times13.5}{5.667} = 0.7147\\ \\mathrm{s}$$

a margin of **0.644 s**. At 4,000 A the two times are 0.0346 s and 0.3284 s,
so the margin is **0.294 s** — marginally short of the usual 0.30 s.
*Distractor:* checking the margin at the lowest fault current, where it is
2.2 s and looks entirely comfortable.

**B4.** The upstream relay must operate at **$0.0346+0.35 = 0.3846$ s** with
**$M = 13.33$**:

$$TD = \\frac{0.3846(13.33-1)}{13.5} = 0.351$$

Set the dial to **0.35**, and note that every other point on the curve slows by
the same 17 percent.

**B5.** 400 A is **0.09561 pu**, so the loop impedance must be
**$3/0.09561 = 31.38$ pu**, essentially all of it in **$3R_{n}$**:

$$R_{n} = \\frac{31.38}{3} = 10.46\\ \\mathrm{pu} = 19.9\\ \\Omega \\;\\Rightarrow\\; \\text{specify } 20\\ \\Omega$$

$$E_{10s} = I^{2}R_{n}t = (400)^{2}(20)(10) = 32\\ \\mathrm{MJ}$$

*Distractor:* omitting the factor of 3 gives 6.6 Ω and 1,200 A of fault
current, three times the design target.

**B6.** The delta winding gives zero-sequence current no path out of the
transformer, so the zero-sequence network **terminates at the transformer** and
sees only its own reactance — typically about 0.85 of the positive-sequence
value — while the positive- and negative-sequence networks see the transformer
**plus** the whole source impedance behind it. The result is
**$Z_{0}<Z_{1}$**, and by the Section 5.3 crossover that makes

$$I_{SLG} = \\frac{3E}{2Z_{1}+Z_{0}} > \\frac{E}{Z_{1}} = I_{3\\phi}$$

*Distractor:* asserting that the three-phase fault is always the worst case.
It is the worst case on transmission systems, where the zero-sequence path
includes long lines and **$Z_{0}\\approx 3Z_{1}$** — and it is routinely false
at the low-voltage bus of a delta–wye transformer.`,
      examTip: 'Relay questions come in exactly two shapes: given a current find a time, or given a time find a dial. Both are one rearrangement of t = TD·K/(Mⁿ − 1), so write M = I/I_pickup first and the rest is arithmetic.',
      importantNote: 'Reach and coordination must be verified at the two EXTREMES: minimum fault current, which is a far-end line-to-line fault at 0.866 of three-phase, for sensitivity; and maximum fault current, at the bus, for the coordination margin. A scheme checked only at one operating point will fail at the other.',
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
