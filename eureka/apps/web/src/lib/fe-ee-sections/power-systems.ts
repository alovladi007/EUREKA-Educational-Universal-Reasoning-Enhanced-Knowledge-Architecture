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

Line current before: I = S/(sqrt(3) V) = 667e3/(1.732 x 4160) = **92.6 A**
Line current after: 526e3/(1.732 x 4160) = **73.0 A**

A 21% current reduction. Feeder losses go as I^2, so they fall by 1 - (73/92.6)^2 = **38%**. On a feeder of 0.3 ohm per phase that is 3(92.6^2 - 73^2)(0.3) = 3(8575 - 5329)(0.3) = **2.9 kW** saved continuously, plus released transformer and cable capacity.

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
