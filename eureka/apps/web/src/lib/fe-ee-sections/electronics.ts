// FE EE course content — Electronics (5 topics).
// Split byte-identically from fe-ee-course-data.ts so section waves
// can be authored in parallel; spread back into FE_EE_COURSE there.
import type { TopicLesson } from '../fe-ee-course-data';

export const FE_EE_ELECTRONICS: Record<string, TopicLesson> = {
  fee_diodes: {
    topicId: 'fee_diodes',
    title: 'Diode Circuits and Applications',
    domainWeight: 'Electronics · 7–11%',
    overview: 'Diodes are two-terminal semiconductor devices that allow current in one direction. Rectifier circuits (half-wave, full-wave bridge), Zener regulators, clippers, and clampers are fundamental building blocks tested on the FE exam. Key calculations involve DC output voltage, PIV ratings, and ripple factor.',
    sections: [
      {
        id: 'diode-rectifiers',
        title: '1. Diode Fundamentals and Rectifier Circuits',
        content: `## 1.1 Diode Characteristics

The **ideal diode** has zero forward resistance and infinite reverse resistance. Practical **silicon diodes** have:

- **Forward voltage drop**: Vf ≈ **$0.6-0.7\\ \\mathrm{V}$**
- **Reverse leakage current**: negligible (nA range)
- **Breakdown voltage**: diode fails if reverse voltage exceeds rating

### Diode Models for Analysis

| Model | Forward | Reverse | Use |
|---|---|---|---|
| **Ideal** | Short circuit | Open circuit | Quick estimation |
| **Constant drop** | 0.7 V source | Open circuit | FE exam standard |
| **Exponential** | i = Iₛ·(e^(v/nVt)−1) | $-I_{s}$ | Precise analysis |

where Vt = kT/q ≈ **26 mV** at room temperature (thermal voltage).

![The exponential diode equation plotted on a linear milliampere scale, with the constant-drop model drawn as a vertical line at seven tenths of a volt and the ideal model at zero volts. Marked points show ten milliamperes at 0.599 volts and one hundred milliamperes at 0.659 volts, computed from the equation.](/courses/fe-ee/figures/elec-diode-models.svg)

The figure explains why the crude-looking 0.7 V model works so well: on a
linear current axis the exponential is indistinguishable from a vertical
line. Moving from 10 mA to 100 mA — a full decade — shifts the forward
voltage by only 60 mV, so pretending the drop is a fixed 0.7 V misjudges the
voltage by a few tens of millivolts at worst. When circuit voltages are
measured in volts, that error is invisible; when they are measured in tenths
of a volt (a 1.5 V battery charger, a logic-level rectifier), the constant
model starts to bite, and the exam expects you to know which regime you are
in.

## 1.2 Rectifier Circuits

Rectifiers convert AC to DC:

### Half-Wave Rectifier (1 diode)

- Conducts only positive half-cycles
- **Vdc = Vpeak/π ≈ 0.318·Vpeak**
- **PIV = Vpeak** (for simple) or **2·Vpeak** (with filter capacitor)
- Ripple frequency = input frequency f

### Full-Wave Bridge Rectifier (4 diodes)

- Conducts both half-cycles (flips negative half)
- **Vdc = 2·Vpeak/π ≈ 0.636·Vpeak**
- **PIV = Vpeak** per diode
- Ripple frequency = **2f** (double the input frequency)

| Parameter | Half-Wave | Full-Wave Bridge |
|---|---|---|
| Vdc | Vpeak/π | 2·Vpeak/π |
| PIV per diode | 2·Vpeak | Vpeak |
| Ripple frequency | f | 2f |
| Efficiency | 40.6% | 81.2% |
| Transformer utilization | Poor | Good |

### Filtering

A **smoothing capacitor** reduces ripple:

**Ripple factor r ≈ 1/(2√3 · f · R · C)** (full-wave)

Larger C or larger R (lighter load) = lower ripple.`,
        examTip: 'Remember the π factor: half-wave Vdc = Vpeak/π, full-wave Vdc = 2Vpeak/π. For the bridge rectifier PIV, each diode sees only Vpeak (not 2Vpeak) because two diodes share the reverse voltage. This is a frequent FE exam question.',
      },
      {
        id: 'diode-zener-clipper',
        title: '2. Zener Regulators, Clippers, and Clampers',
        content: `## 2.1 Zener Diode Voltage Regulators

A **Zener diode** operates in **reverse breakdown** at a precisely controlled voltage Vz. It maintains constant output voltage despite load and supply variations.

### Basic Zener Regulator Design

**Circuit**: Vin → series resistor Rs → parallel Zener + load RL

- **Series resistor current**: Is = (Vin − Vz)/Rs
- **Load current**: IL = Vz/RL
- **Zener current**: Iz = Is − IL
- **Requirement**: Iz > Iz_min (Zener must stay in breakdown)
- **Power dissipation**: Pz = Vz · Iz (must not exceed rating)

### Design Constraints

| Condition | Requirement |
|---|---|
| Minimum Vin | Iz ≥ Iz_min with maximum IL |
| Maximum Vin | Pz ≤ Pz_max with minimum IL |
| Load regulation | Vz stable as IL varies |
| Line regulation | Vz stable as Vin varies |

## 2.2 Clipper and Clamper Circuits

**Clippers** (limiters) remove portions of a signal above or below a threshold:
- **Series clipper**: diode in series blocks one polarity
- **Parallel clipper**: diode + reference voltage shunts excess signal
- **Biased clipper**: diode + DC source sets the clipping level at Vclip = Vbias + 0.7 V

**Clampers** (DC restorers) shift the DC level of a signal without changing its AC shape:
- A capacitor + diode combination shifts the entire waveform up or down
- Output DC level is clamped to the diode reference voltage
- The capacitor must be large enough to hold charge between cycles

### Efficiency and Power

Rectifier efficiency: **η = Pdc/Pac**

For practical design, account for diode drops: each silicon diode subtracts ~0.7 V from the output. A bridge rectifier loses **$2 \\times 0.7 = 1.4\\ \\mathrm{V}$** from the peak output.`,
        examTip: 'For Zener regulator problems on the FE exam, always check that the Zener current stays above the minimum (Iz > Iz_min) at worst-case conditions (minimum Vin, maximum IL). If Iz drops below minimum, the Zener falls out of breakdown and regulation is lost.',
        importantNote: 'A common FE exam mistake is forgetting to subtract diode voltage drops in rectifier circuits. A full-wave bridge loses 2 × 0.7 = 1.4 V, so actual Vdc = 2(Vpeak − 1.4)/π for the constant-drop model. This matters significantly for low-voltage circuits.',
      },
      {
        id: 'diode-rectifier-design',
        title: '3. Rectifier Design Calculations',
        content: `## 3.1 Full Worked Example: Full-Wave Bridge Rectifier with Filter

**Design requirements:**
- Input: 120 Vrms, 60 Hz AC
- Output: approximately 15 V DC
- Maximum ripple voltage: 0.5 V peak-to-peak
- Load resistance: RL = 100 Ω

**Step 1 — Determine the transformer turns ratio:**

Required secondary peak voltage: Vpeak = Vdc + Vripple/2 + 2·Vdiode = 15 + 0.25 + 1.4 = **16.65 V**

Secondary RMS voltage: Vrms = Vpeak/√2 = 16.65/1.414 = **11.78 V**

Turns ratio: n = Vsecondary/Vprimary = 11.78/120 ≈ **1:10.2** (use standard 1:10 transformer)

**Step 2 — Calculate the filter capacitor:**

For a full-wave rectifier with capacitor filter, ripple voltage is:

**ΔV = Idc / (2·f·C)**

where Idc = Vdc/RL = 15/100 = 150 mA, and f = 60 Hz.

Solving for C: **C = Idc / (2·f·ΔV) = 0.15 / (2 × 60 × 0.5) = 2500 μF**

Select next standard value: **$C = 3300 \\mu F$** (provides margin).

**Step 3 — Determine PIV rating:**

For a bridge rectifier: **PIV = Vpeak = 16.65 V** per diode.

Select diodes rated for at least **$2\\times PIV = 33.3\\ \\mathrm{V}$** (safety margin). A 1N4001 (PIV = 50 V) is suitable.

**Step 4 — Verify average DC output:**

With the capacitor filter, **Vdc ≈ Vpeak − ΔV/2 − 2·Vdiode = 16.95 − 0.25 − 1.4 ≈ 15.3 V** (acceptable).

## 3.2 Ripple Factor Calculations

| Parameter | Half-Wave | Full-Wave Bridge |
|---|---|---|
| Ripple voltage ΔV | Idc/(f·C) | **Idc/(2f·C)** |
| Ripple frequency | f (60 Hz) | **2f (120 Hz)** |
| Ripple factor (with C) | $1/(2\\sqrt{3}\\cdot f\\cdot R\\cdot C)$ | **$1/(4\\sqrt{3}\\cdot f\\cdot R\\cdot C)$** |

**Key insight**: The full-wave bridge has **half the ripple** of a half-wave rectifier for the same capacitor — this is why bridge rectifiers are preferred for most applications.

## 3.3 Common Design Mistakes

- **Forgetting diode drops**: Each diode subtracts 0.7 V. A bridge has 2 diodes in the current path → subtract 1.4 V from peak output.
- **PIV confusion**: In a bridge, each diode sees only Vpeak. In a center-tap full-wave, each diode sees 2·Vpeak. The bridge configuration has a lower PIV requirement.
- **Surge current**: At power-on, the discharged capacitor draws a large inrush current. Add a small series resistor (1–10 Ω) or use an NTC thermistor to limit surge.
- **Load current vs. ripple tradeoff**: Heavier load (smaller RL) increases ripple for a given C. If the exam asks "what happens when load increases," the answer is always "more ripple."`,
        examTip: 'On the FE exam, the ripple formula ΔV = Idc/(2fC) for full-wave is the most commonly tested calculation. Remember the factor of 2 in the denominator for full-wave — if you use ΔV = Idc/(fC) you will get the half-wave answer, which is a classic trap.',
        importantNote: 'When calculating Vpeak from Vrms for a sinusoidal source, use Vpeak = √2 × Vrms. A very common mistake is using Vpeak = 2 × Vrms (which applies to peak-to-peak, not peak). For 120 Vrms: Vpeak = 169.7 V, NOT 240 V.',
      },
      {
        id: 'diode-junction-physics',
        title: '4. Junction Behavior: Where the Diode Comes From',
        content: `## 4.1 The pn junction at equilibrium

A diode is a single crystal doped differently on its two sides: **acceptor**
impurities create the p-side, rich in holes, and **donor** impurities create
the n-side, rich in electrons. Where the two regions meet, carriers diffuse
across the boundary — holes into the n-side, electrons into the p-side — and
each departure leaves behind a fixed, ionized dopant atom. The result is the
**depletion region**: a thin zone stripped of mobile carriers, containing
bare negative ions on the p-side and bare positive ions on the n-side.

Those fixed charges create an electric field pointing from n to p, and the
field opposes further diffusion. Equilibrium is the standoff between the two
tendencies, and the potential difference it establishes is the **built-in
potential**:

**$V_{bi} = V_{T}\\cdot \\ln (N_{A}\\cdot N_{D}/n_{i}^{2})$**

**Worked**: silicon doped with $N_{A} = N_{D} = 10^{16}$ per cm³ and
intrinsic concentration $n_{i} = 10^{10}$ per cm³ at room temperature:

$$V_{bi} = 0.026\\cdot \\ln (10^{32}/10^{20}) = 0.026\\cdot \\ln (10^{12}) = 0.026 \\times 27.6 = 0.72\\ \\mathrm{V}$$

That number is not the 0.7 V forward drop by coincidence — the same
exponential carrier statistics set both, which is why the constant-drop value
is stable across ordinary silicon diodes.

## 4.2 What bias does to the barrier

| Applied bias | Depletion region | Barrier | Current |
|---|---|---|---|
| None | equilibrium width | $V_{bi}$ | zero net |
| Forward (p positive) | narrows | lowered | grows exponentially |
| Reverse (n positive) | widens | raised | only leakage $-I_{s}$ |

Forward bias lowers the barrier, and because the carrier population
available to cross it is exponential in energy, current rises exponentially
with voltage — the diode equation is this sentence written as mathematics.
Reverse bias raises the barrier; the only current is the tiny drift of
thermally generated minority carriers, which is why $I_{s}$ is called the
saturation current: more reverse voltage cannot recruit more of them.

Two useful slopes follow directly from the exponential:

- **60 mV per decade**: raising the forward voltage by
  $V_{T}\\cdot \\ln (10) = 0.026 \\times 2.30 = 60\\ \\mathrm{mV}$ multiplies the
  current by ten.
- **Dynamic resistance**: for small signals around a bias point,
  $r_{d} = n\\cdot V_{T}/I_{D}$. At 10 mA with n = 1: $r_{d} = 26\\ \\mathrm{mV}/10\\ \\mathrm{mA} = 2.6\\ \\Omega$.
  This tiny incremental resistance is what clamps and limiters exploit.

## 4.3 Temperature, the quiet variable

The forward drop **decreases about 2 mV per °C** — the exponential gets
easier to climb as thermal energy rises. From 25 °C to 100 °C a diode's drop
falls by roughly 75 × 2 = **150 mV**, from 0.70 V to about 0.55 V. Circuits
that use a diode drop as a reference must either compensate for this or
exploit it: the same −2 mV/°C makes a forward diode a serviceable
temperature sensor.

Reverse leakage moves the other way, approximately **doubling every 10 °C**.
A rectifier that leaks negligibly on the bench can leak a thousand times more
at 125 °C inside an enclosure — worth remembering when an exam question asks
what temperature does to rectifier performance.

## 4.4 Reverse breakdown: two different mechanisms

Past a certain reverse voltage the junction conducts heavily. Two distinct
physical processes produce this, and the distinction is tested:

| Mechanism | Dominates below ≈ 5 V ratings | Dominates above ≈ 7 V ratings |
|---|---|---|
| Name | **Zener** (tunneling) | **Avalanche** (impact ionization) |
| Requires | very heavy doping, thin depletion region | wider depletion region, high field |
| Temperature coefficient | negative (drop falls when hot) | positive (drop rises when hot) |

Between roughly 5 and 7 V the two mechanisms coexist and their opposite
temperature coefficients partially cancel — the reason 5.6 V and 6.2 V
"Zener" diodes (really mixed-mode devices) are the most temperature-stable
choices, and the traditional pick for references. Breakdown is
**nondestructive** provided the external circuit limits the current so the
power $V_{Z}\\cdot I_{Z}$ stays inside the rating; that current-limiting
resistor is what the next worked example sizes.

## 4.5 Worked example: a complete Zener regulator check

**Given**: $V_{in} = 12\\ \\mathrm{V}$, Zener $V_{Z} = 5.1\\ \\mathrm{V}$ with
$I_{Z,\\min} = 5\\ \\mathrm{mA}$ and $P_{Z,\\max} = 0.5\\ \\mathrm{W}$, series
resistor $R_{s} = 150\\ \\Omega$, load $R_{L} = 510\\ \\Omega$.

**Handbook relations**: $I_{s} = (V_{in} - V_{Z})/R_{s}$; $I_{L} = V_{Z}/R_{L}$;
$I_{Z} = I_{s} - I_{L}$; $P_{Z} = V_{Z}\\cdot I_{Z}$.

**Substitution**:

- $I_{s} = (12 - 5.1)/150 = 6.9/150 = 46\\ \\mathrm{mA}$
- $I_{L} = 5.1/510 = 10\\ \\mathrm{mA}$
- $I_{Z} = 46 - 10 = 36\\ \\mathrm{mA}$ — comfortably above the 5 mA minimum ✓
- $P_{Z} = 5.1 \\times 0.036 = 0.184\\ \\mathrm{W}$ — inside the 0.5 W rating ✓

**Answer**: the regulator holds 5.1 V with 36 mA of Zener margin. Now stress
it the way the exam does: **disconnect the load**. All 46 mA flows through
the Zener and $P_{Z} = 5.1 \\times 0.046 = 0.235\\ \\mathrm{W}$ — still safe
here, but this no-load case is the worst case for dissipation, just as
full-load with minimum $V_{in}$ is the worst case for staying in breakdown.
A Zener design is verified only when both corners check out.

**Line variation, same drill**: if the supply climbs to 15 V with the load
connected, $I_{s} = (15 - 5.1)/150 = 66\\ \\mathrm{mA}$, so
$I_{Z} = 66 - 10 = 56\\ \\mathrm{mA}$ and
$P_{Z} = 5.1 \\times 0.056 = 0.286\\ \\mathrm{W}$ — the Zener absorbs the
entire supply excursion while the load never sees it. That absorption is
regulation, and its cost is exactly the extra watts the table of design
constraints in Section 2 budgets for.`,
        examTip: 'Zener regulator problems have exactly two failure corners: minimum Vin with maximum load current (does I_Z stay above I_Z,min?) and maximum Vin with the load disconnected (does P_Z stay under the rating?). Check both corners every time — the given operating point is almost never the one that fails.',
        importantNote: 'Forward drop falls about 2 mV/°C and reverse leakage roughly doubles every 10 °C. When an exam question introduces temperature, the diode\'s 0.7 V is no longer 0.7 V, and paralleled diodes without ballast resistors current-hog because the hottest diode steals the current.',
      },
    ],
    keyTakeaways: [
      'Half-wave: Vdc = Vpeak/π ≈ 0.318·Vpeak; full-wave bridge: Vdc = 2Vpeak/π ≈ 0.636·Vpeak.',
      'PIV: bridge rectifier = Vpeak per diode; half-wave = 2Vpeak.',
      'Ripple factor r ≈ 1/(2√3·f·R·C) for full-wave with capacitor filter.',
      'Zener regulator: Vout = Vz constant; verify Iz > Iz_min at worst-case conditions.',
      'Clippers limit signal amplitude; clampers shift DC level without changing AC shape.',
      'Account for diode voltage drops (0.7 V per diode) in all practical calculations.',
    ],
  },

  fee_bjt: {
    topicId: 'fee_bjt',
    title: 'BJT Analysis and Amplifier Configurations',
    domainWeight: 'Electronics · 7–11%',
    overview: 'Bipolar Junction Transistors (BJTs) are current-controlled devices forming the basis of analog amplifiers. The FE exam tests DC biasing (Q-point), operating region identification, small-signal analysis, and comparison of CE, CC, and CB amplifier configurations.',
    sections: [
      {
        id: 'bjt-dc-bias',
        title: '1. BJT Operating Regions and DC Biasing',
        content: `## 1.1 BJT Operating Regions

A BJT has three terminals: **Base (B)**, **Collector (C)**, **Emitter (E)**. For NPN:

| Region | Condition | Behavior |
|---|---|---|
| **Active** (amplification) | VBE ≈ 0.7 V, VCE > VCE(sat) | $Ic = \\beta \\cdot Ib$ |
| **Saturation** (switch ON) | $VBE \\approx 0.7\\ \\mathrm{V}, VCE \\approx 0.2\\ \\mathrm{V}$ | Ic < β·Ib (current-limited by circuit) |
| **Cutoff** (switch OFF) | $VBE < 0.5\\ \\mathrm{V}, Ib \\approx 0$ | Ic ≈ 0 (both junctions reverse-biased) |

### Key DC Relationships

- **$Ic = \\beta \\cdot Ib$** (active region); β = hfe typically 50–300
- **$Ie = Ic + Ib = (\\beta +1) \\cdot Ib$**
- **$VBE \\approx 0.7\\ \\mathrm{V}$** (silicon)
- **VCE(sat) ≈ 0.2 V** (minimum collector-emitter voltage in saturation)

## 1.2 Q-Point Biasing Methods

The **Q-point** (quiescent operating point) sets DC conditions for amplification.

### Voltage Divider Bias (Most Stable)

The most common and stable biasing method:

1. **$VB = VCC \\cdot R2/(R1+R2)$** (base voltage from voltage divider)
2. **$VE = VB - 0.7\\ \\mathrm{V}$** (emitter voltage)
3. **$IE = VE/RE$** (emitter current)
4. **$IC \\approx IE$** (since β >> 1)
5. **$VCE = VCC - IC(RC+RE)$** (verify active: VCE > 0.2 V)

### Why Voltage Divider is Preferred

- **Stability against β variations**: The Q-point depends on VB (set by resistors) rather than β
- **Temperature compensation**: RE provides negative feedback — if IC increases, VE increases, reducing VBE and stabilizing IC
- **Predictable**: Q-point nearly independent of transistor parameters

![Collector bias current against current gain for the two biasing schemes, computed from their bias equations. Fixed base bias is a straight line through the origin, tripling from two to six milliamperes as beta goes from one hundred to three hundred; voltage-divider bias with an emitter resistor stays within a few percent of 1.9 milliamperes across the same range.](/courses/fe-ee/figures/elec-bjt-bias-stability.svg)

The two curves are the entire argument for divider bias, drawn. β is the one
transistor parameter the designer cannot control — it varies threefold
between units of the same part number and drifts with temperature — so a
bias current *proportional* to β (the straight line) means the Q-point is
set by luck. The nearly flat curve is what the emitter resistor's feedback
buys: the divider fixes VB, VB fixes VE, and VE fixes IE through RE, with β
relegated to a small correction term. Section 4 puts numbers on both curves.`,
        examTip: 'On the FE exam, voltage divider bias is the standard biasing method. The key steps: (1) find VB from the divider, (2) subtract 0.7 V for VE, (3) IE = VE/RE, (4) IC ≈ IE, (5) VCE = VCC − IC(RC+RE). Always verify VCE > 0.2 V to confirm active region.',
      },
      {
        id: 'bjt-small-signal',
        title: '2. Small-Signal Analysis and Amplifier Configurations',
        content: `## 2.1 Small-Signal Model Parameters

For AC analysis around the Q-point, the BJT is modeled with small-signal parameters:

- **Transconductance**: **$gm = IC/VT \\approx IC/26\\ \\mathrm{mV}$** (at room temperature)
- **Input resistance**: **$r\\pi = \\beta /gm = \\beta \\cdot VT/IC$**
- **Small-signal emitter resistance**: **$re = VT/IE \\approx 26\\ \\mathrm{mV}/IE$**
- **Output resistance**: **$ro = VA/IC$** (VA = Early voltage, typically 50–200 V)

## 2.2 Amplifier Configurations

| Parameter | Common-Emitter (CE) | Common-Collector (CC) | Common-Base (CB) |
|---|---|---|---|
| **Voltage gain** | **Av = −gm·RC** (high) | **$Av \\approx 1$** | **Av = gm·RC** (high) |
| **Current gain** | **Ai ≈ β** (high) | **$Ai \\approx \\beta +1$** | **$Ai \\approx 1$** |
| **Input impedance** | **Zin = rπ** (moderate) | **Zin = rπ + (β+1)·RE** (high) | **Zin = re** (low) |
| **Output impedance** | **Zout ≈ RC** | **Zout ≈ re** (low) | **Zout ≈ RC** |
| **Phase inversion** | **Yes** (180°) | **No** | **No** |
| **Primary use** | General amplification | Buffer / impedance matching | High-frequency / cascode |

### Common-Emitter (CE) — Most Popular

The CE configuration provides **high voltage gain** and **high current gain**, making it the most widely used amplifier stage:

**$Av = -gm \\cdot RC = -IC \\cdot RC / VT$**

The negative sign indicates **180° phase inversion**.

### Common-Collector (CC) — Emitter Follower

Unity voltage gain but **very high input impedance** and **very low output impedance** — ideal as a **buffer** between a high-impedance source and low-impedance load.

### Common-Base (CB)

Low input impedance but **no Miller effect** (no capacitive multiplication), making it excellent for **high-frequency applications** and as the second stage of a cascode amplifier.

## 2.3 Frequency Response

The BJT has frequency-dependent behavior due to internal capacitances:

- **fT (unity-gain frequency)**: frequency where current gain drops to 1; **$fT = gm/(2\\pi \\cdot C\\pi)$**
- **Miller effect**: in CE configuration, CBC appears multiplied by gain: **Cin_Miller = CBC·(1+|Av|)**
- **Bandwidth**: inversely related to gain (gain-bandwidth product ≈ constant)`,
        examTip: 'The small-signal transconductance gm = IC/VT is the most important parameter. At room temperature, VT ≈ 26 mV. For IC = 1 mA: gm = 1/26 ≈ 38.5 mS. Voltage gain of CE stage is Av = −gm·RC, so gain is proportional to bias current.',
        importantNote: 'Always verify the transistor is in the active region before applying small-signal analysis. Small-signal parameters (gm, rπ) are only valid at the Q-point. If VCE < 0.2 V (saturation) or IB ≈ 0 (cutoff), the linear small-signal model does not apply.',
      },
      {
        id: 'bjt-amplifier-design',
        title: '3. BJT Amplifier Design Problem',
        content: `## 3.1 Design Problem Statement

**Design a common-emitter amplifier** with the following specifications:
- Supply: VCC = 12 V
- Voltage gain: |Av| ≈ 20
- Transistor: β = 100, VBE = 0.7 V
- Q-point: IC ≈ 2 mA, VCE ≈ 6 V (midpoint biasing for maximum swing)

## 3.2 Step-by-Step Design

**Step 1 — Choose RC and RE from the Q-point:**

Apply KVL around the collector-emitter loop:

VCC = IC·RC + VCE + IE·RE ≈ IC·(RC + RE) + VCE (since IC ≈ IE)

$$12 = 2\\ \\mathrm{mA} \\cdot (RC + RE) + 6 \\to RC + RE = 3 k\\Omega$$

**Step 2 — Set RC from the gain requirement:**

Small-signal gain: |Av| = gm · RC (with bypassed RE)

First, find gm: **$gm = IC/VT = 2\\ \\mathrm{mA} / 26\\ \\mathrm{mV} = 76.9 mS$**

RC = |Av|/gm = 20/0.0769 = **$260\\ \\Omega$** → use standard value **$RC = 270\\ \\Omega$**

Then RE = 3000 − 270 = **$2730\\ \\Omega$** → use **$RE = 2.7 k\\Omega$**

**Step 3 — Design the voltage divider bias:**

Required base voltage: VB = VBE + IE·RE = 0.7 + 2 mA × 2.7 kΩ = **6.1 V**

For stable biasing, divider current should be ~10× IB:

IB = IC/β = 2 mA/100 = 20 μA → Idivider ≈ 200 μA

**R2 = VB/Idivider = 6.1/0.2 mA = 30.5 kΩ** → use **$R2 = 30 k\\Omega$**

**R1 = (VCC − VB)/Idivider = (12 − 6.1)/0.2 mA = 29.5 kΩ** → use **$R1 = 30 k\\Omega$**

**Step 4 — Verify the Q-point:**

VB = 12 × 30/(30+30) = **6.0 V** (close to target)

$$VE = 6.0 - 0.7 = 5.3\\ \\mathrm{V} \\to IE = 5.3/2.7k = 1.96\\ \\mathrm{mA} \\approx 2\\ \\mathrm{mA}$$

VCE = 12 − 1.96 mA × (270 + 2700) = 12 − 5.82 = **6.18 V** → active region confirmed (VCE > 0.2 V)

**Step 5 — Calculate actual small-signal gain:**

$$gm = 1.96\\ \\mathrm{mA} / 26\\ \\mathrm{mV} = 75.4 mS$$

**$Av = -gm \\times RC = -75.4 \\times 0.270 = -20.4$** (meets spec, negative sign = 180° inversion)

## 3.3 Design Verification Checklist

- **Active region**: VCE = 6.18 V >> 0.2 V → confirmed
- **Bias stability**: Divider current (200 μA) >> IB (20 μA) → β-independent
- **Gain**: |Av| = 20.4 ≈ 20 → meets specification
- **Swing**: VCE at midpoint allows ±5 V output swing before clipping
- **Bypass capacitor**: CE across RE is needed for full AC gain; without it, Av = −RC/(RE + 1/gm) ≈ −0.1 (gain drops dramatically)`,
        examTip: 'The FE exam BJT amplifier design sequence is always: (1) set Q-point from VCC and desired VCE, (2) find gm = IC/VT, (3) choose RC = |Av|/gm, (4) design bias divider with current ~10× IB. If the bypass capacitor is removed, gain drops to approximately −RC/RE — the exam may ask about this.',
        importantNote: 'The bypass capacitor across RE is essential for AC gain. It short-circuits RE at signal frequencies, giving full gain Av = −gm·RC. Without it, RE provides negative feedback and gain drops to about −RC/RE. Many FE exam questions test whether you recognize this distinction.',
      },
      {
        id: 'bjt-stability-switching',
        title: '4. Bias Stability, the Saturation Check, and the Follower',
        content: `## 4.1 Putting numbers on the two bias schemes

The stability claim from Section 1 deserves arithmetic. Compare the two
circuits at β = 100 and again at β = 300 — the realistic spread for one part
number.

**Fixed base bias** (base resistor straight to VCC, no emitter resistor):
$I_{B} = (V_{CC} - 0.7)/R_{B}$, and the collector current is β times that.
With $V_{CC} = 12\\ \\mathrm{V}$ and $R_{B} = 565\\ \\mathrm{k}\\Omega$:

$$I_{B} = 11.3/565\\mathrm{k} = 20\\ \\mu \\mathrm{A}$$

- At β = 100: $I_{C} = 100 \\times 20\\ \\mu \\mathrm{A} = 2.0\\ \\mathrm{mA}$
- At β = 300: $I_{C} = 300 \\times 20\\ \\mu \\mathrm{A} = 6.0\\ \\mathrm{mA}$ — a **3× shift**

Every milliampere of that shift moves VCE, so the same circuit that sits at
midsupply with one transistor is saturated with its replacement.

**Voltage-divider bias** with the Section 3 values (VB = 6.0 V from a
30 kΩ/30 kΩ divider, RE = 2.7 kΩ). Including the base-side loading through
the divider's Thevenin resistance $R_{B,th} = 30\\mathrm{k} \\| 30\\mathrm{k} = 15\\ \\mathrm{k}\\Omega$:

**$I_{E} = (V_{B} - 0.7)/(R_{E} + R_{B,th}/(\\beta +1))$**

- At β = 100: $I_{E} = 5.3/(2700 + 148.5) = 1.86\\ \\mathrm{mA}$
- At β = 300: $I_{E} = 5.3/(2700 + 49.8) = 1.93\\ \\mathrm{mA}$ — a **3.6% shift**

| Bias scheme | $I_{C}$ at β = 100 | $I_{C}$ at β = 300 | Change |
|---|---|---|---|
| Fixed base | 2.0 mA | 6.0 mA | +200% |
| Voltage divider + RE | 1.86 mA | 1.93 mA | +3.6% |

The formula also names the design rule: β stops mattering when
$R_{B,th}/(\\beta +1)$ is small next to $R_{E}$. Keeping the divider stiff
(divider current about ten times $I_{B}$) is precisely what keeps that ratio
small.

## 4.2 The saturation check, and the BJT as a switch

Small-signal analysis is valid only in the active region, so every bias
answer needs one closing test: is $V_{CE}$ still above about 0.2 V, and is
$I_{C}$ still β times $I_{B}$? A switching example shows how the second test
fails.

**Given**: $V_{CC} = 5\\ \\mathrm{V}$, $R_{C} = 1\\ \\mathrm{k}\\Omega$, base
driven with $I_{B} = 0.5\\ \\mathrm{mA}$, β = 100.

**Handbook relation**: the collector circuit can supply at most
$I_{C,\\max} = (V_{CC} - V_{CE,sat})/R_{C}$.

**Substitution**: $I_{C,\\max} = (5 - 0.2)/1\\mathrm{k} = 4.8\\ \\mathrm{mA}$.
The active-region prediction $\\beta \\cdot I_{B} = 100 \\times 0.5 = 50\\ \\mathrm{mA}$
is ten times more than the circuit can deliver.

**Answer**: the transistor is **saturated**. $I_{C} = 4.8\\ \\mathrm{mA}$,
$V_{CE} \\approx 0.2\\ \\mathrm{V}$, and the effective ratio
$I_{C}/I_{B} = 4.8/0.5 = 9.6$ — called the **forced beta**, well below the
transistor's β of 100. That excess base drive is deliberate in switching
design: an overdrive factor of 5–10 guarantees hard saturation across
temperature and unit-to-unit spread, giving a low, predictable on-state
drop. The price is slower turn-off, because the flooded base must be
discharged before the collector can rise.

The identification drill, worth automating: compute $\\beta \\cdot I_{B}$ and
$(V_{CC} - 0.2)/R_{C}$, and the **smaller** number is the actual collector
current. If the smaller one is $\\beta \\cdot I_{B}$, the device is active;
otherwise it is saturated and no small-signal formula applies.

## 4.3 The emitter follower with real numbers

The common-collector stage earns its keep through impedances, not gain, so
work them once concretely.

**Given**: follower biased at $I_{C} = 2\\ \\mathrm{mA}$, β = 100,
$R_{E} = 1\\ \\mathrm{k}\\Omega$, AC-coupled load $R_{L} = 1\\ \\mathrm{k}\\Omega$,
source resistance $R_{s} = 600\\ \\Omega$.

**Handbook relations**: $r_{e} = V_{T}/I_{E} \\approx 26\\ \\mathrm{mV}/2\\ \\mathrm{mA} = 13\\ \\Omega$;
looking into the base, resistances in the emitter are multiplied by (β+1);
looking into the emitter, resistances at the base are divided by (β+1).

**Input resistance** (at the base): the emitter sees $R_{E} \\| R_{L} = 500\\ \\Omega$, so

$$Z_{in} = r_{\\pi } + (\\beta +1)(R_{E} \\| R_{L}) = 1300 + 101 \\times 500 \\approx 51.8\\ \\mathrm{k}\\Omega$$

**Output resistance** (at the emitter):

$$Z_{out} \\approx r_{e} + R_{s}/(\\beta +1) = 13 + 600/101 \\approx 18.9\\ \\Omega$$

**Answer**: the stage presents a 52 kΩ load to the source while driving the
1 kΩ load from about 19 Ω. That 2,700-to-1 impedance transformation — with
voltage gain just under one — is the follower's entire job description, and
the (β+1) reflection rule that produced both numbers transfers unchanged to
any resistance you place at either terminal.

One more habit worth building: the same reflection logic explains why an
unbypassed emitter resistor tames the CE stage's gain. Seen from the base,
$R_{E}$ appears (β+1) times larger, swamping $r_{\\pi }$ and setting the gain
to approximately $-R_{C}/R_{E}$ — the formula quoted in Section 3, now with
its mechanism attached.

## 4.4 A Miller-effect number, since Section 2 promised one

**Given**: a CE stage with $|A_{v}| = 20$, collector-base capacitance
$C_{BC} = 4\\ \\mathrm{pF}$, base-emitter capacitance
$C_{\\pi } = 16\\ \\mathrm{pF}$, driven from $R_{s} = 10\\ \\mathrm{k}\\Omega$.

**Handbook relation**: the Miller-multiplied input capacitance is
$C_{in} = C_{\\pi } + C_{BC}(1 + |A_{v}|)$, forming a low-pass with the
source resistance.

**Substitution**: $C_{in} = 16 + 4 \\times 21 = 100\\ \\mathrm{pF}$, so

$$f_{3dB} = 1/(2\\pi R_{s}C_{in}) = 1/(2\\pi \\times 10^{4} \\times 10^{-10}) = 159\\ \\mathrm{kHz}$$

**Answer**: a 4 pF junction capacitance, multiplied by the gain it straddles,
dominates the 16 pF device capacitance four to one and caps the stage at
159 kHz. Halve the gain and bandwidth roughly doubles — the gain-bandwidth
trade of Section 2.3 with actual numbers attached, and the reason the CB and
cascode stages, which deny $C_{BC}$ its gain multiplication, own the
high-frequency territory.`,
        examTip: 'For any BJT problem, compute both candidate collector currents — β·I_B and (VCC − 0.2)/RC — and take the smaller. This single comparison classifies the region, finds the operating point, and warns you off small-signal formulas when the device is saturated. It turns a conceptual question into thirty seconds of arithmetic.',
        importantNote: 'Impedance reflection is the follower in one rule: emitter-side resistances look (β+1) times LARGER from the base, and base-side resistances look (β+1) times SMALLER from the emitter. Both follower impedance formulas, and the unbypassed-RE gain formula, are this one rule applied in each direction.',
      },
    ],
    keyTakeaways: [
      'Active region: IC = β·IB; saturation: VCE < 0.2 V; cutoff: IB ≈ 0.',
      'Voltage divider bias is most stable; Q-point: VB → VE = VB−0.7 → IE = VE/RE → VCE = VCC−IC(RC+RE).',
      'Small-signal: gm = IC/VT ≈ IC/26 mV; rπ = β/gm; re = VT/IE.',
      'CE: Av = −gm·RC (high gain, phase inversion); CC: Av ≈ 1 (buffer); CB: high-frequency use.',
      'Miller effect multiplies CBC by (1+|Av|) in CE — limits bandwidth at high gain.',
      'Frequency limit: fT = gm/(2π·Cπ); gain-bandwidth product is approximately constant.',
    ],
  },

  fee_mosfet: {
    topicId: 'fee_mosfet',
    title: 'MOSFET Circuits and Biasing',
    domainWeight: 'Electronics · 7–11%',
    overview: 'MOSFETs are voltage-controlled devices with essentially zero gate current — the dominant transistor in modern electronics. The FE exam tests MOSFET operating regions, the square-law equation in saturation, biasing methods, and amplifier configurations (CS, CD, CG).',
    sections: [
      {
        id: 'mos-regions',
        title: '1. MOSFET Operating Regions and the Square-Law Model',
        content: `## 1.1 Enhancement-Mode NMOS

An **N-channel enhancement MOSFET** has three terminals: **Gate (G)**, **Drain (D)**, **Source (S)**.

| Region | Condition | Drain Current |
|---|---|---|
| **Cutoff** | $VGS < Vt$ | $ID = 0$ |
| **Triode (Linear)** | $VGS > Vt, VDS < VGS - Vt$ | $ID = K\\cdot [2(VGS-Vt)\\cdot VDS - VDS^{2}]$ |
| **Saturation** | $VGS > Vt, VDS \\ge VGS - Vt$ | **$ID = K\\cdot (VGS - Vt)^{2}$** |

where **$K = (\\mu _{n}C_{ox}/2)\\cdot (W/L)$** is the device transconductance parameter.

- **Vt** = threshold voltage (typically 0.5–2 V for NMOS)
- **$\\mu _{n}C_{ox}$** = process transconductance parameter (μA/V²)
- **W/L** = width-to-length ratio (designer controls this)

![NMOS output characteristics computed from the triode and saturation equations for gate voltages of two, three, and four volts, with the pinch-off parabola drawn dashed. Left of the parabola the device behaves as a voltage-controlled resistor; right of it each curve runs nearly flat at the square-law current.](/courses/fe-ee/figures/elec-mosfet-regions.svg)

Read the figure the way the exam wants the equations read. Along the dashed
parabola, $V_{DS} = V_{GS} - V_{t}$ exactly — the boundary where the channel
pinches off at the drain end. Left of it, the curves bend because the drain
voltage is still thinning the channel as it rises: a resistor whose value the
gate controls. Right of it, the current locks to $K(V_{GS} - V_{t})^{2}$ and
the slight upward tilt is channel-length modulation, the MOSFET's version of
the Early effect. Notice also the uneven vertical spacing of the three
curves — equal 1 V gate steps produce currents of 0.5, 2.0, and 4.5 mA —
which is the square law announcing itself before any algebra.

### Saturation Equation (Most Important)

**$ID = (\\mu _{n}C_{ox}/2) \\cdot (W/L) \\cdot (VGS - Vt)^{2}$**

This **square-law** relationship means doubling (VGS − Vt) quadruples the drain current.

### Transconductance

**$gm = \\partial ID/\\partial VGS = \\mu _{n}C_{ox} \\cdot (W/L) \\cdot (VGS - Vt) = 2\\cdot ID/(VGS - Vt)$**

Alternative: **$gm = \\sqrt{2\\cdot \\mu _{n}C_{ox}\\cdot (W/L)\\cdot ID}$**

## 1.2 P-Channel MOSFET

PMOS is complementary — all voltages and currents reverse:
- Conducts when **$VGS < Vt$** (Vt is negative)
- Current flows from source to drain
- Used in CMOS logic paired with NMOS

## 1.3 Depletion-Mode MOSFET

A **depletion-mode** MOSFET conducts at VGS = 0 and turns off with negative VGS (for N-channel):
- **$ID = IDSS \\cdot (1 - VGS/Vp)^{2}$** where IDSS is drain current at VGS = 0 and Vp is pinch-off voltage`,
        examTip: 'The saturation current equation ID = K·(VGS−Vt)² is the most-tested MOSFET formula on the FE exam. Always check VDS ≥ VGS−Vt to confirm saturation before using this equation. If VDS < VGS−Vt, the MOSFET is in the triode (linear) region and requires the different formula.',
      },
      {
        id: 'mos-amplifiers',
        title: '2. MOSFET Biasing and Amplifier Configurations',
        content: `## 2.1 Biasing Methods

### Self-Bias with Source Resistor

The most common discrete MOSFET biasing method:

1. Gate voltage set by a resistor divider or directly: **$VG = VDD \\cdot R2/(R1+R2)$**
2. Source voltage: **$VS = ID \\cdot RS$**
3. Gate-source voltage: **$VGS = VG - VS = VG - ID\\cdot RS$**
4. Solve simultaneously with saturation equation: ID = K·(VGS − Vt)²

The source resistor RS provides **negative feedback**: if ID increases → VS increases → VGS decreases → ID decreases. This stabilizes the Q-point.

### Key Advantage over BJTs

MOSFET gate draws **essentially zero DC current** (IG ≈ 0), so:
- Gate bias resistors do not affect the bias point
- Input impedance is extremely high (MΩ to GΩ)
- Biasing is simpler — no base current to account for

## 2.2 Amplifier Configurations

| Parameter | Common-Source (CS) | Common-Drain (CD) | Common-Gate (CG) |
|---|---|---|---|
| **Voltage gain** | **$Av = -gm\\cdot RD$** | **$Av \\approx gm\\cdot RS/(1+gm\\cdot RS) \\approx 1$** | **$Av = gm\\cdot RD$** |
| **Input impedance** | **Very high** (gate) | **Very high** (gate) | **Low** (≈ 1/gm) |
| **Output impedance** | **$\\approx RD$** | **≈ 1/gm** (low) | **$\\approx RD$** |
| **Phase inversion** | **Yes** | **No** | **No** |
| **Analog to BJT** | CE | CC (emitter follower) | CB |

### Common-Source (CS) — Primary Amplifier

**$Av = -gm \\cdot RD$** (without source degeneration)

**$Av = -gm \\cdot RD / (1 + gm\\cdot RS)$** (with unbypassed RS — reduces gain but improves linearity)

### Common-Drain (CD) — Source Follower

**$Av \\approx 1$** (unity gain buffer), **Zin ≈ ∞**, **Zout ≈ 1/gm**

Ideal for driving low-impedance loads from high-impedance sources.

### Common-Gate (CG)

Low input impedance (≈ 1/gm) but **no Miller effect** — excellent for **high-frequency** and **cascode** applications.

## 2.3 CMOS Inverter

The foundation of digital electronics: NMOS + PMOS in series between VDD and ground. When input is high, NMOS on / PMOS off → output low. When input is low, PMOS on / NMOS off → output high. **Zero static power dissipation** (no DC path in either state).`,
        examTip: 'For MOSFET amplifier gain on the FE exam: CS gain is Av = −gm·RD. To find gm, first find the Q-point (ID from biasing), then gm = 2·ID/(VGS−Vt). This two-step process (bias first, then small-signal) is the standard approach for all transistor amplifier problems.',
        importantNote: 'MOSFETs are vulnerable to electrostatic discharge (ESD) — the thin gate oxide can be permanently damaged by static voltages. This is an engineering practice detail that occasionally appears on the FE exam in the context of device handling and protection circuits.',
      },
      {
        id: 'mos-jfet',
        title: '3. JFETs: The Other Field-Effect Transistor',
        content: `## 3.1 How a JFET differs from a MOSFET

The **junction FET** controls its channel not with an insulated gate but with
a reverse-biased pn junction. An n-channel JFET is a bar of n-type silicon
with p-type gate regions on its sides; reverse-biasing the gate-channel
junction widens the junction's depletion region, which squeezes the
conducting channel from the sides. More negative gate voltage means a
narrower channel and less current, until at the **pinch-off voltage**
$V_{p}$ (a negative number for n-channel) the channel closes entirely.

Three consequences define the device:

- A JFET is **depletion-mode only**: at $V_{GS} = 0$ the channel is fully
  open and the drain current is at its maximum, called **$I_{DSS}$**. The
  device is normally on; gate voltage can only reduce the current.
- The gate must stay **reverse-biased** ($V_{GS} \\le 0$ for n-channel).
  Forward-biasing it turns the gate junction into a conducting diode and the
  gate stops being a high-impedance terminal.
- Gate leakage is a junction's reverse current — nanoamps — so like the
  MOSFET, the JFET draws essentially no gate current, just through different
  physics.

## 3.2 The square law, JFET edition

In its saturation (active) region the JFET obeys:

**$I_{D} = I_{DSS}\\cdot (1 - V_{GS}/V_{p})^{2}$**

Same parabola as the MOSFET, parameterized differently: the curve is
anchored at the two endpoints ($I_{D} = I_{DSS}$ at $V_{GS} = 0$;
$I_{D} = 0$ at $V_{GS} = V_{p}$) rather than at a threshold. The
transconductance follows by differentiation:

**$g_{m} = (2\\cdot I_{DSS}/|V_{p}|)\\cdot (1 - V_{GS}/V_{p}) = g_{m0}\\cdot (1 - V_{GS}/V_{p})$**

where $g_{m0} = 2\\cdot I_{DSS}/|V_{p}|$ is the maximum value, reached at
$V_{GS} = 0$.

## 3.3 Worked example: operating point and gm

**Given**: n-channel JFET with $I_{DSS} = 8\\ \\mathrm{mA}$,
$V_{p} = -4\\ \\mathrm{V}$, biased at $V_{GS} = -2\\ \\mathrm{V}$.

**Handbook relation**: the square law above.

**Substitution**:

$$I_{D} = 8\\ \\mathrm{mA}\\cdot (1 - (-2)/(-4))^{2} = 8\\ \\mathrm{mA}\\cdot (1 - 0.5)^{2} = 8 \\times 0.25 = 2\\ \\mathrm{mA}$$

$$g_{m0} = 2 \\times 8\\ \\mathrm{mA}/4\\ \\mathrm{V} = 4\\ \\mathrm{mS}, \\quad g_{m} = 4\\ \\mathrm{mS} \\times (1 - 0.5) = 2\\ \\mathrm{mS}$$

**Answer**: $I_{D} = 2\\ \\mathrm{mA}$, $g_{m} = 2\\ \\mathrm{mS}$. Note the
pattern worth remembering: biasing at half the pinch-off voltage gives one
quarter of $I_{DSS}$ and half of $g_{m0}$ — the squared term and its
derivative moving at different rates.

**Self-bias sets this point with one resistor.** Ground the gate through a
large resistor and insert $R_{S}$ in the source: then
$V_{GS} = -I_{D}\\cdot R_{S}$ automatically. For the target above,
$R_{S} = 2\\ \\mathrm{V}/2\\ \\mathrm{mA} = 1\\ \\mathrm{k}\\Omega$. No divider is
needed because, unlike an enhancement MOSFET, the JFET conducts at zero
gate-source voltage and the source current itself generates the required
negative bias.

## 3.4 Choosing among the three FET flavors

| Property | JFET | Depletion MOSFET | Enhancement MOSFET |
|---|---|---|---|
| Conducts at $V_{GS} = 0$? | yes ($I_{DSS}$) | yes | no |
| Gate isolation | reverse junction | oxide | oxide |
| Gate can be driven past 0 V? | no (junction conducts) | yes, both polarities | yes |
| Governing constants | $I_{DSS}, V_{p}$ | $I_{DSS}, V_{p}$ | $K, V_{t}$ |
| Typical role | low-noise analog front ends | RF, current sources | logic, power, nearly everything |

On the exam, the parameter set named in the problem identifies the device:
$I_{DSS}$ and $V_{p}$ mean the $(1 - V_{GS}/V_{p})^{2}$ law;
$K$ (or $\\mu _{n}C_{ox}$ and W/L) with $V_{t}$ means the
$(V_{GS} - V_{t})^{2}$ law. Both are parabolas; the constants tell you which
form to reach for, and mixing the two forms is the characteristic JFET
error.`,
        examTip: 'Identify the FET from its given constants before writing anything: I_DSS and V_p mean the JFET/depletion law I_D = I_DSS(1 − V_GS/V_p)²; K and V_t mean the enhancement law I_D = K(V_GS − V_t)². The two parabolas are not interchangeable, and the exam supplies exactly the constants the correct law needs.',
        importantNote: 'An n-channel JFET\'s gate must remain at or below the source voltage. About half a volt of forward gate bias turns the gate-channel junction on, gate current flows, and the high-impedance-input assumption collapses. This boundary — not oxide breakdown — is the JFET\'s gate-drive limit.',
      },
      {
        id: 'mos-bias-walkthrough',
        title: '4. A Complete Bias and Gain Walkthrough',
        content: `## 4.1 The problem the square law makes quadratic

Divider-plus-source-resistor biasing of an enhancement MOSFET has one
wrinkle the BJT version lacks: $V_{GS}$ depends on $I_{D}$ (through the
source resistor) while $I_{D}$ depends on $V_{GS}$ (through the square law).
The two must be solved **simultaneously**, and because the law is quadratic,
two candidate answers appear — one of them physical nonsense. Work it fully.

**Given**: $V_{DD} = 10\\ \\mathrm{V}$; divider sets the gate at
$V_{G} = 4\\ \\mathrm{V}$; $R_{S} = 1\\ \\mathrm{k}\\Omega$;
$R_{D} = 2\\ \\mathrm{k}\\Omega$; device constants
$K = 0.5\\ \\mathrm{mA/V^{2}}$, $V_{t} = 1\\ \\mathrm{V}$. Gate current is zero,
so the divider voltage is the gate voltage.

**Handbook relations**: $V_{GS} = V_{G} - I_{D}R_{S}$ and, assuming
saturation, $I_{D} = K(V_{GS} - V_{t})^{2}$.

**Substitution**: with $I_{D}$ in mA and resistances in kΩ,

$$I_{D} = 0.5\\cdot (4 - I_{D} - 1)^{2} = 0.5\\cdot (3 - I_{D})^{2}$$

Expanding: $2I_{D} = 9 - 6I_{D} + I_{D}^{2}$, so
$I_{D}^{2} - 8I_{D} + 9 = 0$ and

$$I_{D} = (8 \\pm \\sqrt{64 - 36})/2 = 4 \\pm 2.65$$

Two roots: 6.65 mA and 1.35 mA.

**Root selection** — this is where the marks are lost. Try 6.65 mA:
$V_{GS} = 4 - 6.65 = -2.65\\ \\mathrm{V}$, below threshold, where the device
carries no current at all. The root contradicts the equation it came from;
discard it. The physical answer is **$I_{D} = 1.35\\ \\mathrm{mA}$**, giving
$V_{GS} = 4 - 1.35 = 2.65\\ \\mathrm{V}$.

**Consistency check** (recomputing, as always, by a second route):
$K(V_{GS} - V_{t})^{2} = 0.5 \\times (1.646)^{2} = 0.5 \\times 2.708 = 1.35\\ \\mathrm{mA}$ ✓

## 4.2 Confirming the region

The square law was an assumption; verify it. The overdrive is
$V_{GS} - V_{t} = 1.65\\ \\mathrm{V}$, and

$$V_{DS} = V_{DD} - I_{D}(R_{D} + R_{S}) = 10 - 1.35 \\times 3 = 5.94\\ \\mathrm{V}$$

Since $5.94 \\ge 1.65$, the device is well inside saturation ✓. Had this
failed, the correct move is to re-solve using the triode equation — not to
quietly keep the square-law answer.

| Step | Quantity | Value |
|---|---|---|
| 1 | $I_{D}$ (physical root) | 1.35 mA |
| 2 | $V_{GS}$ | 2.65 V |
| 3 | overdrive $V_{GS} - V_{t}$ | 1.65 V |
| 4 | $V_{DS}$ | 5.94 V |
| 5 | region check | $V_{DS} >$ overdrive ✓ saturation |

## 4.3 From bias to gain

With the Q-point settled, small-signal quantities follow in one line each:

$$g_{m} = 2I_{D}/(V_{GS} - V_{t}) = 2 \\times 1.35/1.65 = 1.65\\ \\mathrm{mS}$$

Common-source voltage gain with the source resistor bypassed:

$$A_{v} = -g_{m}\\cdot R_{D} = -1.65\\ \\mathrm{mS} \\times 2\\ \\mathrm{k}\\Omega = -3.3$$

Leave $R_{S}$ unbypassed and the gain degenerates to
$A_{v} = -g_{m}R_{D}/(1 + g_{m}R_{S}) = -3.3/2.65 = -1.24$ — the same
feedback that stabilized the bias point now trading gain for linearity, the
FET twin of the BJT's unbypassed-RE behavior.

The modest gain is worth a comment because it surprises BJT-trained
intuition. At the same 1.35 mA, a BJT would offer
$g_{m} = I_{C}/V_{T} = 52\\ \\mathrm{mS}$ — thirty times more. MOSFET
transconductance is set by the overdrive voltage (volts) where the BJT's is
set by the thermal voltage (26 mV); low-overdrive design narrows the gap,
which is exactly what integrated design does.

## 4.4 Second-order effects the exam names

- **Channel-length modulation**: in saturation the current rises slightly
  with $V_{DS}$, modeled as a factor $(1 + \\lambda V_{DS})$. The associated
  output resistance is $r_{o} = 1/(\\lambda I_{D})$; with
  $\\lambda = 0.02\\ \\mathrm{V^{-1}}$ at 1.35 mA,
  $r_{o} = 1/(0.02 \\times 1.35\\ \\mathrm{mA}) = 37\\ \\mathrm{k}\\Omega$. It
  caps the gain available from a current-source-loaded stage at
  $-g_{m}r_{o}$, here about −61.
- **Body effect**: if the source is not tied to the substrate, source-body
  reverse bias raises the effective $V_{t}$. In discrete parts source and
  body are usually bonded and the effect vanishes; in ICs it must be
  budgeted.
- **Subthreshold conduction**: below $V_{t}$ the current is not exactly zero
  — it decays exponentially. Digital leakage-power questions live here; FE
  analog problems treat cutoff as zero current.`,
        examTip: 'The FET bias quadratic always yields two roots, and the bogus one reliably fails the same test: substitute it back and V_GS lands below threshold (or requires a sign the circuit cannot produce). Substitute BOTH roots before choosing, and then confirm V_DS ≥ V_GS − V_t so the square law you assumed was actually valid.',
        importantNote: 'MOSFET gm = 2·I_D/(V_GS − V_t) depends on overdrive, not temperature-fixed constants — at equal current it is typically an order of magnitude below a BJT\'s gm = I_C/V_T. When an exam answer for a FET stage looks "too low" next to a BJT stage, that ratio is the reason, not an arithmetic slip.',
      },
    ],
    keyTakeaways: [
      'Saturation: ID = (μₙCₒₓ/2)·(W/L)·(VGS−Vt)²; requires VDS ≥ VGS−Vt.',
      'Transconductance: gm = 2·ID/(VGS−Vt) = μₙCₒₓ·(W/L)·(VGS−Vt).',
      'Zero gate current (IG ≈ 0) → very high input impedance; simpler biasing than BJTs.',
      'CS: Av = −gm·RD (high gain, phase inversion); CD: Av ≈ 1 (buffer); CG: high-frequency.',
      'Self-bias via RS: VGS = VG − ID·RS provides negative feedback stabilization.',
      'CMOS (NMOS + PMOS): zero static power — basis of all modern digital circuits.',
    ],
  },

  fee_opamp: {
    topicId: 'fee_opamp',
    title: 'Operational Amplifier Circuits',
    domainWeight: 'Electronics · 7–11%',
    overview: 'Operational amplifiers (op-amps) are high-gain differential amplifiers used with feedback to create precise analog circuits. The FE exam tests ideal op-amp analysis using the virtual short principle, inverting/non-inverting gain formulas, integrators, differentiators, and summing amplifiers.',
    sections: [
      {
        id: 'opamp-ideal',
        title: '1. Ideal Op-Amp Model and Feedback Circuits',
        content: `## 1.1 Ideal Op-Amp Assumptions

| Parameter | Ideal Value | Real (e.g., LM741) |
|---|---|---|
| **Open-loop gain (Aol)** | ∞ | $10^{5}-10^{6}$ |
| **Input impedance (Zin)** | ∞ | $1-10 M\\Omega$ |
| **Output impedance (Zout)** | 0 | $50-100\\ \\Omega$ |
| **Bandwidth** | ∞ | $GBW \\approx 1\\ \\mathrm{MHz}$ |
| **Input offset voltage** | 0 | $1-5\\ \\mathrm{mV}$ |
| **Input bias current** | 0 | $nA-\\mu A$ |

### The Virtual Short Principle

With **negative feedback**, the ideal op-amp enforces two conditions:

1. **$V^{+} = V^{-}$** (virtual short — inputs are at the same voltage)
2. **$I^{+} = I^{-} = 0$** (no current flows into the inputs)

These two rules are sufficient to analyze **any** ideal op-amp circuit.

## 1.2 Standard Feedback Configurations

### Inverting Amplifier

**Acl = −Rf/Rin**

- Input applied to the inverting (−) terminal through Rin
- Feedback from output to (−) through Rf
- Input impedance = Rin (not infinite)
- **180° phase inversion**

![An inverting amplifier: the source drives Rin into the inverting terminal, Rf feeds the output back to that same node, and the non-inverting terminal is tied to ground. With Rin = 1 kilohm and Rf = 10 kilohm the closed-loop gain is minus ten.](/courses/fe-ee/figures/sch-opamp-inverting.svg)

Derive the gain from the two rules rather than recalling it, because the same
three lines handle every variation the exam throws at this topology.

The non-inverting terminal is grounded, so rule 1 ($V^{+}$ = $V^{-}$) puts the inverting
node at **0 V** — a *virtual ground*: held at ground potential by feedback, but
not connected to ground. Rule 2 says no current enters the op-amp input, so all
the current arriving through Rin must continue through Rf.

- Current in: i = (v_in − 0)/R_in = v_in/R_in
- Same current out: v_out = 0 − i·R_f = −v_in·R_f/R_in
- Therefore **$A = -R_f/R_{in}$**

With the values drawn, A = −10 kΩ/1 kΩ = **$-10$**. A 0.5 V input gives −5.0 V
out, via 0.5 mA flowing through both resistors and dropping 5 V across Rf.

Two consequences of the virtual ground are tested more often than the gain
itself:

**Input impedance is R_in, not infinite.** The source looks into the virtual
ground through R_in and sees exactly 1 kΩ here. That is the price of the
inverting topology, and it is why you cannot simply raise R_f/R_in without
thinking — pushing gain up by shrinking R_in loads the source harder.

**The gain depends only on the ratio.** 10 kΩ/1 kΩ and 100 kΩ/10 kΩ give
identical gain, which is why resistor *matching* matters far more than absolute
accuracy in these circuits.

| Configuration (R_in = 1 kΩ, R_f = 10 kΩ) | Gain | Z_in | Phase | v_out for v_in = 0.5 V |
|---|---|---|---|---|
| Inverting | $-10$ | $1 k\\Omega$ | $180^\\circ$ | $-5.00\\ \\mathrm{V}$ |
| Non-inverting | $1 + 10 = +11$ | ≈ ∞ | $0^\\circ$ | +5.50 V |
| Unity buffer | +1 | ≈ ∞ | $0^\\circ$ | +0.50 V |

The non-inverting gain is **11, not 10** — the "1 +" is not decoration. It comes
from the input appearing directly at the output through the feedback divider,
and dropping it is one of the most reliably punished slips in this section.

### Where the ideal model stops

Two real limits appear in FE questions even though the analysis above assumes
neither.

**Output swing.** The output cannot exceed the supply rails. On ±12 V supplies,
the −10 gain stage clips for any input beyond 1.2 V in magnitude, so a 2 V input
gives roughly −12 V and not −20 V. If a computed output exceeds the supply, the
answer is the rail.

**Gain-bandwidth product.** For a typical 1 MHz GBW part, closed-loop bandwidth
is GBW divided by the closed-loop gain: 1 MHz/10 = **100 kHz**. Gain is traded
against bandwidth one-for-one, so the same amplifier at a gain of 100 works only
to 10 kHz. This is why the ideal assumption of infinite bandwidth has to be
abandoned as soon as a question mentions frequency at all.

### The virtual ground generalises

Everything above used one fact — the inverting node sits at 0 V and swallows no
current — and that one fact carries the rest of the topic.

**Summing amplifier.** Feed several sources into the same virtual ground through
their own resistors. Because the node is held at 0 V, no source can see any
other: each contributes i = v/R independently, and the currents simply add in
R_f. With R_f = 10 kΩ and inputs of 0.1 V through 1 kΩ, 0.2 V through 2 kΩ and
0.5 V through 5 kΩ:

$$v_{out} = -(10\\times 0.1 + 5\\times 0.2 + 2\\times 0.5) = -(1 + 1 + 1) = -3.0\\ \\mathrm{V}$$

Each branch contributes exactly 1 V despite its different source voltage,
because gain is set per-input by R_f/R_n. That independence is the reason this
circuit is an audio mixer and a DAC summing node, and it is why the *inverting*
form is used for summing while the non-inverting form is not.

**Integrator.** Replace R_f with a capacitor. The current v_in/R_in still has
nowhere to go but the feedback element, and forcing that current through a
capacitor gives dv_out/dt = −v_in/(R_in C). With R_in = 10 kΩ and C = 0.1 µF,
R_in C = 1 ms, so a steady 1 V input ramps the output at −1000 V/s. After 5 ms
the output is at −5 V, and on ±12 V supplies it reaches the rail at 12 ms and
stops. A real integrator needs a large resistor across C to stop DC offset from
driving it into the rail on its own; the ideal analysis does not predict that,
and it is the most common practical failure of this circuit.

| Feedback element | Relationship | Circuit |
|---|---|---|
| Resistor R_f | $v_{out} = -v_{in} R_f/R_{in}$ | inverting amplifier |
| Capacitor C | $v_{out} = -(1/R_{in} C)\\int v_{in} dt$ | integrator |
| Resistor, with C at the input | $v_{out} = -R_f C dv_{in}/dt$ | differentiator |

Read that table as one idea rather than three formulas: **the input branch sets
the current, the feedback element decides what that current does.**

### When the virtual short does not apply

Both rules depend on **negative feedback** being present. Remove the feedback
path, or route it to the non-inverting terminal instead, and $V^{+}$ no longer equals
$V^{-}$ — the open-loop gain of $10^{5}$ or more drives the output straight to whichever
rail the input difference points at. That circuit is a **comparator**, not an
amplifier, and its output is one of two voltages rather than a scaled copy.

So before applying $V^{+}$ = $V^{-}$ to anything, check where the feedback goes. If it
returns to the inverting input, the virtual short holds and the closed-loop
formulas apply. If there is no feedback at all, or it returns to the
non-inverting input, expect saturation or latch-up and analyse it as a switching
element. Applying the amplifier formulas to a comparator produces a confident
numerical answer that is not on the answer sheet.

### Non-Inverting Amplifier

**Acl = 1 + Rf/Rin**

- Input applied to the non-inverting (+) terminal
- Feedback divider between output and (−) terminal
- Input impedance ≈ ∞ (signal at high-Z + input)
- **No phase inversion**

### Unity-Gain Buffer (Voltage Follower)

**Acl = 1** (Rf = 0, Rin = ∞: output connected directly to − input)

- **Zin ≈ ∞, Zout ≈ 0** — perfect impedance matching buffer
- Isolates a high-impedance source from a low-impedance load`,
        examTip: 'For any op-amp circuit on the FE exam, apply two rules: (1) V⁺ = V⁻ and (2) no current into inputs. Write KCL at the inverting node using these constraints, and the gain formula falls out directly. This works for every configuration — inverting, non-inverting, summing, differencing, integrator, differentiator.',
      },
      {
        id: 'opamp-special',
        title: '2. Summing, Integrating, and Differentiating Circuits',
        content: `## 2.1 Summing Amplifier

Combines multiple weighted inputs:

**$Vo = -Rf \\cdot (V_{1}/R_{1} + V_{2}/R_{2} + V_{3}/R_{3} + ...)$**

Each input is weighted by −Rf/Rᵢ. If all Rᵢ = R, then Vo = −(Rf/R)·($V_{1}$+$V_{2}$+$V_{3}$+...) — a scaled sum.

### Difference (Differential) Amplifier

**Vo = (Rf/Rin) · ($V_{2}$ − $V_{1}$)** (when Rf/Rin = $R_{2}$/$R_{1}$)

Amplifies the **difference** between two inputs while rejecting common-mode signals. The **Common-Mode Rejection Ratio (CMRR)** measures this ability.

## 2.2 Integrator

**$Vo = -(1/RC) \\cdot \\int Vi dt$**

- Capacitor C replaces Rf in the inverting configuration
- Output is proportional to the integral of the input
- A constant input produces a linear ramp output
- **Practical issue**: DC offset causes unbounded drift — add a large resistor in parallel with C to limit DC gain

### In the s-domain:

**H(s) = −1/(sRC)** — gain increases without bound at low frequencies

## 2.3 Differentiator

**Vo = −RC · dVi/dt**

- Capacitor C replaces Rin in the inverting configuration
- Output proportional to the rate of change of input
- **Practical issue**: amplifies high-frequency noise — add a small resistor in series with C

### In the s-domain:

**H(s) = −sRC** — gain increases without bound at high frequencies

## 2.4 Gain-Bandwidth Product (GBW)

For a real op-amp, the product of closed-loop gain and bandwidth is constant:

**GBW = Aol · $f_{3}dB$ = Acl · BW**

| Closed-Loop Gain | Bandwidth |
|---|---|
| 1 (buffer) | $1\\ \\mathrm{MHz} (= GBW)$ |
| 10 | 100 kHz |
| 100 | 10 kHz |
| 1000 | 1 kHz |

Higher gain → lower bandwidth. This is a fundamental tradeoff.`,
        examTip: 'The integrator and differentiator are frequently tested on the FE exam. Key distinction: integrator has C in feedback (replaces Rf), differentiator has C at input (replaces Rin). In the s-domain: integrator gain = −1/(sRC) rolls off with frequency; differentiator gain = −sRC increases with frequency.',
        importantNote: 'Real integrators need a DC feedback path (large resistor across C) to prevent output saturation from input offset. Real differentiators need a series resistor with C to limit high-frequency noise amplification. The FE exam may ask about these practical limitations.',
      },
      {
        id: 'opamp-analysis-shortcuts',
        title: '3. Op-Amp Circuit Analysis Shortcuts',
        content: `## 3.1 The Virtual Short Method — Quick Analysis

For ANY ideal op-amp circuit with negative feedback, apply these two rules and solve:

**Rule 1**: $V^{+}$ = $V^{-}$ (virtual short — no voltage difference between inputs)
**Rule 2**: $I^{+}$ = $I^{-}$ = 0 (no current into either input terminal)

**Worked Example — Determine the output of this circuit:**

Non-inverting input: $V^{+}$ connected to 3 V. Feedback: Rf = 20 kΩ from output to $V^{-}$. Rin = 10 kΩ from $V^{-}$ to ground.

1. By Rule 1: $V^{-}$ = $V^{+}$ = **3 V**
2. Current through Rin: I = $V^{-}$/Rin = 3/10k = **0.3 mA** (flows toward ground)
3. By Rule 2: same current flows through Rf (no current into the op-amp)
4. Voltage across Rf: V_Rf = I × Rf = 0.3 mA × 20 kΩ = **6 V**
5. Output: Vo = $V^{-}$ + V_Rf = 3 + 6 = **9 V**

**Verification**: Non-inverting gain = 1 + Rf/Rin = 1 + 20/10 = 3. Vo = 3 × 3 V = 9 V. Confirmed.

## 3.2 Superposition in Op-Amp Circuits

When multiple inputs feed an op-amp circuit, use **superposition**:

1. Set all inputs to zero except one
2. Find the output contribution from that input
3. Repeat for each input
4. Sum all contributions

**Example — Summing amplifier with two inputs:**

V1 = 2 V through R1 = 10 kΩ; V2 = −1 V through R2 = 20 kΩ; Rf = 40 kΩ

- From V1 alone: Vo1 = −(Rf/R1)·V1 = −(40/10)·2 = **$-8\\ \\mathrm{V}$**
- From V2 alone: Vo2 = −(Rf/R2)·V2 = −(40/20)·(−1) = **+2 V**
- **Total: Vo = −8 + 2 = −6 V**

## 3.3 Common Trap: Rail Voltage Saturation

The ideal op-amp model assumes infinite output voltage range, but **real op-amps clip** at the supply rails:

- If V+ supply = +15 V and V− supply = −15 V, output saturates at approximately **$\\pm 13 to \\pm 14\\ \\mathrm{V}$** (1–2 V below rails for standard op-amps)
- Rail-to-rail op-amps can reach within 50–200 mV of the supply

**Example trap**: An inverting amplifier with Av = −100, Vin = 0.5 V → calculated Vo = −50 V. But if supply is ±15 V, the actual output is **$-14\\ \\mathrm{V}$** (saturated, not −50 V).

**How to spot saturation on the exam:**
1. Calculate the ideal output voltage
2. Compare to supply rails
3. If |Vo| > |Vsupply| − 1.5 V, the output is **clipped/saturated**
4. When saturated, the virtual short ($V^{+}$ = $V^{-}$) **no longer holds** — the op-amp is in open-loop

## 3.4 Quick Gain Formulas Reference

| Circuit | Gain Formula | Notes |
|---|---|---|
| Inverting | **−Rf/Rin** | Input impedance = Rin |
| Non-inverting | **1 + Rf/Rin** | Input impedance ≈ ∞ |
| Buffer | **1** | Rf = 0, Rin = ∞ |
| Summing | **$-Rf\\cdot \\Sigma (Vi/Ri)$** | One term per input |
| Difference | **(Rf/Rin)·(V2−V1)** | When ratios matched |
| Integrator | **−1/(sRC)** | C replaces Rf |
| Differentiator | **−sRC** | C replaces Rin |`,
        examTip: 'On the FE exam, always check for saturation after computing the ideal output. If the calculated output exceeds the supply voltage, the answer is the saturation voltage, not the calculated value. This trap appears in problems where the gain is very high (Av > 50) or the input is unexpectedly large.',
        importantNote: 'When an op-amp saturates, the virtual short assumption breaks down. The output is stuck at the rail, and V⁺ is no longer equal to V⁻. If an exam problem asks what happens when positive feedback is applied (output to + input), the answer is always a comparator or latch — the output slams to one rail.',
      },
    ],
    keyTakeaways: [
      'Virtual short principle: V⁺ = V⁻ and I⁺ = I⁻ = 0 with negative feedback — solves any ideal op-amp circuit.',
      'Inverting: Acl = −Rf/Rin; Non-inverting: Acl = 1 + Rf/Rin; Buffer: Acl = 1.',
      'Summing amplifier: Vo = −Rf·(V₁/R₁ + V₂/R₂ + ...) — weighted sum of inputs.',
      'Integrator: Vo = −(1/RC)·∫Vi dt; Differentiator: Vo = −RC·dVi/dt.',
      'GBW = Aol · f₃dB = constant; higher gain means lower bandwidth.',
      'Practical integrators need DC feedback; differentiators need noise-limiting resistor.',
    ],
  },

  fee_power_elec: {
    topicId: 'fee_power_elec',
    title: 'Power Electronics: Rectifiers and Converters',
    domainWeight: 'Electronics · 7–11%',
    overview: 'Power electronics converts electrical energy between different voltage/current levels and between AC and DC. Buck and boost converters, three-phase rectifiers, PWM control, and ripple calculations are the key FE exam topics in this area.',
    sections: [
      {
        id: 'pe-converters',
        title: '1. DC-DC Converters: Buck and Boost',
        content: `## 1.1 Buck Converter (Step-Down)

The **buck converter** reduces DC voltage using a switch, inductor, diode, and capacitor:

**Vo = D · Vin** where **D = ton/(ton + toff)** is the duty cycle (0 ≤ D ≤ 1)

| Parameter | Formula |
|---|---|
| Output voltage | **Vo = D · Vin** |
| Inductor current ripple | **ΔIL = Vin · D · (1−D) / (L · fₛ)** |
| Output voltage ripple | **$\\Delta Vo = \\Delta IL / (8 \\cdot C \\cdot f_{s})$** |
| Minimum inductance (CCM) | **Lmin = (1−D) · R / (2 · fₛ)** |

### Continuous vs. Discontinuous Conduction Mode

- **CCM** (continuous): inductor current never reaches zero — formulas above apply
- **DCM** (discontinuous): inductor current drops to zero each cycle — output depends on load

## 1.2 Boost Converter (Step-Up)

The **boost converter** increases DC voltage:

**Vo = Vin / (1 − D)**

| Parameter | Formula |
|---|---|
| Output voltage | **Vo = Vin/(1−D)** |
| Inductor current ripple | **ΔIL = Vin · D / (L · fₛ)** |
| Output voltage ripple | **$\\Delta Vo = Io \\cdot D / (C \\cdot f_{s})$** |

As D → 1, Vo → ∞ theoretically, but practical limits (losses, component ratings) cap the boost ratio to about 4–5×.

## 1.3 Buck-Boost Converter

**Vo = −Vin · D/(1−D)** (output is inverted polarity)

Can step up (D > 0.5) or step down (D < 0.5) voltage.

![Voltage conversion ratio against duty cycle for the three basic converters, computed from their ideal continuous-conduction formulas. The buck is a straight line from zero to one; the boost and buck-boost curves run away toward infinity as the duty cycle approaches one, with the buck-boost crossing unity at a duty cycle of one half.](/courses/fe-ee/figures/elec-converter-ratios.svg)

Keep the shapes, not just the formulas. The buck's straight line means its
control is nearly linear — half duty, half voltage. The boost family's
hockey-stick means the opposite: near D = 0.9 a one-percent duty change
moves the output about ten percent, and the parasitic losses that the ideal
formulas ignore grow just as fast, which is why practical boost ratios stall
around 4–5× no matter what the formula promises. Exam questions that ask
"what duty cycle gives 10× boost" are probing whether you attach that
practical ceiling to the ideal curve.

### Efficiency

Ideal converters are **100% efficient** (Pin = Pout). Real converters: 85–95% typical. Losses include switch conduction and switching losses, inductor core/copper losses, and diode forward drop.`,
        examTip: 'Buck: Vo = D·Vin (output always less than input). Boost: Vo = Vin/(1−D) (output always greater than input). These two formulas are the most-tested power electronics equations on the FE exam. Remember: D is always between 0 and 1.',
      },
      {
        id: 'pe-rectifiers-pwm',
        title: '2. Three-Phase Rectifiers and PWM Control',
        content: `## 2.1 Three-Phase Rectifiers

Three-phase rectifiers handle higher power with lower ripple than single-phase:

### Six-Pulse (Uncontrolled) Diode Rectifier

**Vdc = (3√3/π) · Vm ≈ 1.35 · VL_rms**

where Vm is the peak phase voltage and VL_rms is the line-to-line RMS voltage.

| Rectifier Type | Vdc | Ripple Frequency | Ripple Factor |
|---|---|---|---|
| Single-phase half-wave | $Vm/\\pi$ | f | 121% |
| Single-phase full-wave | $2Vm/\\pi$ | 2f | 48% |
| Three-phase half-wave | $3\\sqrt{3}\\cdot Vm/(2\\pi)$ | 3f | 18% |
| **Three-phase full-wave (6-pulse)** | **$3\\sqrt{3}\\cdot Vm/\\pi$** | **6f** | **4%** |

### Controlled (SCR) Rectifiers

Thyristor-based rectifiers allow variable DC output by delaying the firing angle α:

**Vdc = (3√3·Vm/π) · cos(α)**

At α = 0°: full output; at α = 90°: Vdc = 0; at α > 90°: negative Vdc (regeneration).

## 2.2 Pulse-Width Modulation (PWM)

PWM controls average output by rapidly switching between on and off states:

**Vavg = D · Vsupply**

### Key PWM Parameters

- **Switching frequency fₛ**: typically 10–100 kHz (much higher than load bandwidth)
- **Duty cycle D**: fraction of period the switch is on
- **Ripple**: determined by L, C, and fₛ — higher fₛ means lower ripple

### Energy Storage Principle

- **Inductors** resist current change: smooth output current
- **Capacitors** resist voltage change: smooth output voltage
- Combined L-C filter produces clean DC from PWM switching

## 2.3 Inverters (DC to AC)

**Inverters** convert DC to AC for motor drives, solar grid-tie, and UPS systems:

- **H-bridge**: four switches create alternating polarity across load
- **PWM inverter**: modulates pulse widths to approximate a sinusoidal output
- **Three-phase inverter**: six switches (three half-bridges) for motor drive applications`,
        examTip: 'For ripple calculations on the FE exam: inductor ripple ΔIL = V·D/(L·fₛ) and capacitor ripple ΔVo = I·D/(C·fₛ). To reduce ripple, increase L, C, or switching frequency fₛ. The FE exam often asks which parameter change most effectively reduces ripple.',
        importantNote: 'Three-phase rectifiers have dramatically lower ripple than single-phase (4% vs 48% for full-wave). This is why industrial power systems use three-phase power — not just for higher power, but for cleaner DC output. This concept frequently appears on the FE exam.',
      },
      {
        id: 'pe-thyristors',
        title: '3. Thyristors and Worked Converter Problems',
        content: `## 3.1 The thyristor: a switch that latches

The **SCR** (silicon controlled rectifier) is a four-layer pnpn device with
anode, cathode, and gate. Its defining behavior is **latching**: a brief
gate pulse turns it on, and thereafter the gate loses all authority — the
device stays on as long as its anode current remains above a small
**holding current** $I_{H}$, and it turns off only when the external circuit
drives that current toward zero.

The mechanism is regenerative feedback. The pnpn stack behaves as an npn and
a pnp transistor wired so that each one's collector feeds the other's base;
the gate pulse starts the loop, each transistor drives the other harder, and
the pair slams into saturation in microseconds. This is why the gate cannot
turn the device off — the loop feeds itself once running.

| Parameter | Meaning | Typical concern |
|---|---|---|
| $I_{H}$ (holding current) | minimum anode current to stay latched | device drops out on light loads |
| $I_{L}$ (latching current) | minimum anode current to latch initially | slightly above $I_{H}$; short gate pulses may fail to latch |
| dv/dt rating | fastest allowed anode voltage rise | fast transients can false-trigger; snubber RC limits dv/dt |
| di/dt rating | fastest allowed current rise at turn-on | conduction starts near the gate and must spread |

In AC circuits, turn-off is free: the line current passes through zero every
half cycle, unlatching the device — which is why the SCR's natural habitat
is the **phase-controlled rectifier**. In DC circuits an SCR that has
latched must be forced off with an auxiliary commutation circuit, which is
the main reason DC switching migrated to transistors.

**Relatives**: the **TRIAC** conducts in both directions (two
antiparallel SCR structures, one gate) and runs lamp dimmers and small AC
motor controls; the **GTO** can be turned off by a large negative gate
pulse; the **IGBT**, though a transistor rather than a thyristor, has
displaced thyristors in most new medium-power designs precisely because it
never latches and its gate keeps full control.

## 3.2 Worked example: phase-controlled rectifier

**Given**: a single-phase full-wave SCR bridge fed from 120 V rms, firing
angle α = 60°, driving a highly inductive (continuous-current) load.

**Handbook relation**: $V_{dc} = (2V_{m}/\\pi )\\cdot \\cos \\alpha$, with
$V_{m} = \\sqrt{2}\\cdot V_{rms}$.

**Substitution**: $V_{m} = 1.414 \\times 120 = 169.7\\ \\mathrm{V}$, so

$$V_{dc} = (2 \\times 169.7/\\pi )\\cdot \\cos 60^{\\circ} = 108.0 \\times 0.5 = 54.0\\ \\mathrm{V}$$

**Answer**: 54 V — exactly half the uncontrolled bridge's 108 V, because
cos 60° = 0.5. Delaying the firing angle is throttling: α = 0° recovers the
full diode-bridge output, α = 90° gives zero average, and beyond 90° the
average goes negative, returning energy to the line (inversion) when the
load can supply it. One formula, smoothly spanning rectifier and inverter.

## 3.3 Worked example: buck converter ripple, end to end

**Given**: buck converter, $V_{in} = 24\\ \\mathrm{V}$,
$V_{o} = 12\\ \\mathrm{V}$, $f_{s} = 100\\ \\mathrm{kHz}$,
$L = 100\\ \\mu \\mathrm{H}$, $C = 100\\ \\mu \\mathrm{F}$.

**Duty cycle**: $D = V_{o}/V_{in} = 12/24 = 0.5$.

**Inductor ripple**: $\\Delta I_{L} = V_{in}\\cdot D(1-D)/(L\\cdot f_{s}) = 24 \\times 0.25/(10^{-4} \\times 10^{5}) = 6/10 = 0.6\\ \\mathrm{A}$

**Output voltage ripple**: $\\Delta V_{o} = \\Delta I_{L}/(8\\cdot C\\cdot f_{s}) = 0.6/(8 \\times 10^{-4} \\times 10^{5}) = 0.6/80 = 7.5\\ \\mathrm{mV}$

The numbers carry the design intuition: a hefty 0.6 A of current ripple in
the inductor becomes 7.5 mV — less than a tenth of a percent — at the
output, because the capacitor integrates the triangular current. Doubling
$f_{s}$ halves both numbers at once, which is the perennial argument for
switching faster, bounded by switching losses that grow with every
transition.

For the **boost** twin: at $V_{in} = 12\\ \\mathrm{V}$ and D = 0.6,
$V_{o} = 12/(1 - 0.6) = 30\\ \\mathrm{V}$, and the ideal power balance
$P_{in} = P_{out}$ forces the input current to be $1/(1-D) = 2.5$ times the
output current — boost converters trade current for voltage, and the input
side must be wired for it.`,
        examTip: 'Latching is the whole thyristor story: the gate can only turn an SCR ON. Turn-off requires the anode current to fall below the holding current — automatic at every AC zero crossing, but requiring forced commutation in DC circuits. Any question about "turning off an SCR with the gate" has a one-word answer: impossible (unless the part is a GTO).',
        importantNote: 'In the controlled-rectifier formula V_dc = (2V_m/π)·cos α, the angle α is measured from the natural diode turn-on point, not from the voltage zero crossing in some arbitrary sense. At α = 0 the SCR bridge IS the diode bridge; delaying conduction only ever reduces (then reverses) the average output.',
      },
      {
        id: 'pe-instrumentation',
        title: '4. Instrumentation: Bridges, Data Converters, and Error',
        content: `## 4.1 Why instrumentation lives in this chapter

Every converter in the sections above runs closed-loop: something must
measure the output voltage or inductor current before the controller can
adjust the duty cycle. That sensing chain — bridge or shunt, amplifier, ADC
— is the instrumentation the FE outline asks about, and its three standard
questions are bridges, converter resolution, and measurement error.

## 4.2 The Wheatstone bridge

Four resistances in a diamond, excitation $V_{s}$ across one diagonal,
measurement $V_{o}$ across the other. The bridge is **balanced** — zero
output — when the ratios match:

**$R_{1}/R_{2} = R_{4}/R_{3}$**, equivalently $R_{1}\\cdot R_{3} = R_{2}\\cdot R_{4}$

Balance is the null-measurement trick: an unknown resistor is found by
adjusting a known one until a sensitive meter reads zero, and at null the
excitation level and the meter calibration both drop out of the result. That
insensitivity is why bridge measurements were the precision standard long
before precision electronics existed.

Sensors use the bridge *off*-null. Replace one arm with a strain gauge whose
resistance changes by a small fraction $\\Delta R/R$; for the
equal-resistance quarter-bridge the output is, to first order:

**$V_{o} \\approx V_{s}\\cdot (\\Delta R/R)/4$**

**Worked**: $V_{s} = 10\\ \\mathrm{V}$ excitation and a strain gauge at
$\\Delta R/R = 0.1\\%$:

$$V_{o} = 10 \\times 0.001/4 = 2.5\\ \\mathrm{mV}$$

**Answer**: 2.5 mV — which explains the rest of the signal chain: outputs
this small are why instrumentation amplifiers with high common-mode
rejection sit between bridge and ADC, and why a half-bridge (two active
arms) or full bridge (four) is used to double or quadruple the signal when
the mechanics allow it.

## 4.3 ADC and DAC resolution

An n-bit converter divides its full-scale range FS into $2^{n}$ steps. The
step size — one **LSB** — is the resolution:

**$LSB = FS/2^{n}$**

**Worked**: a 12-bit ADC spanning 0–10 V:

$$LSB = 10/2^{12} = 10/4096 = 2.44\\ \\mathrm{mV}$$

Quantization rounds each sample to the nearest step, so the error is at most
**±LSB/2** (±1.22 mV here). Treated as noise, this rounding sets the ideal
signal-to-noise ratio of an n-bit converter:

**$SNR = 6.02\\cdot n + 1.76\\ \\mathrm{dB}$** — for 12 bits, 74.0 dB.

Each added bit halves the step and buys almost exactly 6 dB. The DAC runs
the same arithmetic backward: output = FS·(code/$2^{n}$), same LSB, same
step staircase — smoothed by the reconstruction filtering that the
signal-processing chapters justify.

Resolution and accuracy are different claims. A converter resolves 2.44 mV
steps; whether the 2.44 mV it reports is *true* depends on its reference
voltage, linearity, and offset — which is where error analysis takes over.

## 4.4 Measurement error, in the exam's vocabulary

| Term | Meaning | Countermeasure |
|---|---|---|
| Systematic error | consistent offset or scale error; repeatable | calibrate it out |
| Random error | scatter between repeated readings | average n readings (scatter shrinks as $\\sqrt{n}$) |
| Accuracy | closeness to the true value | limited by systematic error |
| Precision | repeatability of readings | limited by random error |
| Loading error | the meter itself disturbs the circuit | high meter impedance (voltage), low (current) |

A meter can be precise and inaccurate — tightly clustered readings, all
wrong by the same 2% — and the cluster's tightness is no evidence of truth.

**Spec-reading worked example**: a voltmeter specified ±1% *of full scale*
on its 100 V range reads 20 V. The uncertainty is ±1 V — which is **±5% of
the reading**. The same measurement on a 25 V range would carry ±0.25 V,
about ±1.25% of reading. Percent-of-full-scale specs punish readings low on
the range; using the lowest range that fits the signal is not neatness, it
is accuracy. Specs quoted as "±(0.5% of reading + 2 counts)" combine both
behaviors: the counts term is a fixed floor that dominates small readings,
the percent term dominates large ones.`,
        examTip: 'For bridge problems, check balance first: R₁·R₃ = R₂·R₄ means zero output regardless of excitation. For converter problems, everything follows from LSB = FS/2ⁿ — quantization error is half of it, and ideal SNR is 6.02n + 1.76 dB. These two formulas plus the balance condition answer nearly every instrumentation item.',
        importantNote: 'A ±1%-of-full-scale meter is NOT a ±1% measurement. Reading 20 V on a 100 V range carries ±1 V — five percent of the value. When an exam problem gives a full-scale accuracy spec and a reading well below full scale, converting the spec to percent-of-reading is the entire point of the question.',
      },
    ],
    keyTakeaways: [
      'Buck: Vo = D·Vin (step-down); Boost: Vo = Vin/(1−D) (step-up); D = ton/(ton+toff).',
      'Inductor ripple: ΔIL = V·D/(L·fₛ); capacitor ripple: ΔVo = I·D/(C·fₛ).',
      'Three-phase 6-pulse rectifier: Vdc ≈ 1.35·VL_rms with only 4% ripple.',
      'PWM at high switching frequency + LC filter produces clean DC from switched output.',
      'Controlled rectifiers use SCR firing angle α: Vdc = Vdc_max · cos(α).',
      'Ideal converters: Pin = Pout (100% efficient); real converters: 85–95% typical.',
    ],
  },

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 10 — POWER SYSTEMS  (6 curriculum IDs from 5 sections)
   * ────────────────────────────────────────────────────────────────── */

};
