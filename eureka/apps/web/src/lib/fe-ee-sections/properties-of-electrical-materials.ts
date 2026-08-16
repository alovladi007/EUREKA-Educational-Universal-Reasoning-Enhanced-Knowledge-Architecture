// FE EE course content — Properties of Electrical Materials (4 topics).
// Split byte-identically from fe-ee-course-data.ts so section waves
// can be authored in parallel; spread back into FE_EE_COURSE there.
import type { TopicLesson } from '../fe-ee-course-data';

export const FE_EE_PROPERTIES_OF_ELECTRICAL_MATERIALS: Record<string, TopicLesson> = {
fee_conductors: {
  topicId: 'fee_conductors',
  title: 'Conductors and Resistivity',
  domainWeight: 'Properties of Electrical Materials · 3–5%',
  overview: 'Conductivity and resistivity are fundamental material properties determining how easily charge flows. Understanding resistance as a function of geometry, material, and temperature is essential for wire selection and circuit design.',
  sections: [
    {
      id: 'cond-resistivity',
      title: '1. Resistivity, Conductivity, and Resistance',
      content: `## 1.1 Fundamental Relationships

**Resistivity** ρ (ohm·meters) is an intrinsic material property:

**$R = \\rho L/A$**

Where:
- R = resistance (Ω)
- ρ = resistivity (Ω·m)
- L = conductor length (m)
- A = cross-sectional area (m²)

**Conductivity** σ = 1/ρ (siemens/meter)

### Material Classification

| Material Type | Resistivity Range | Examples |
|---|---|---|
| Conductors | $10^{-8}\\ \\Omega \\cdot m$ | Copper (1.7×10⁻⁸), Aluminum (2.8×10⁻⁸) |
| Semiconductors | $10^{-4} to 10^{4}\\ \\Omega \\cdot m$ | Silicon, Germanium |
| Insulators | $10^{8} to 10^{20}\\ \\Omega \\cdot m$ | Glass, Rubber, Teflon |

## 1.2 Temperature Dependence

**$\\rho (T) = \\rho _{0}[1 + \\alpha (T - T_{0})]$**

Where α is the **temperature coefficient of resistance**:
- **Metals** (positive α): resistance increases with temperature
- **Semiconductors** (negative α): resistance decreases with temperature
- **Superconductors**: ρ → 0 below critical temperature Tc`,
      examTip: 'R = ρL/A is one of the most commonly tested formulas. Doubling length doubles resistance; doubling cross-sectional area halves resistance. Temperature coefficient α is positive for metals (resistance goes UP when hot) and negative for thermistors (resistance goes DOWN when hot).',
    },
    {
      id: 'cond-current',
      title: '2. Current Density and Wire Selection',
      content: `## 2.1 Current Density and Drift Velocity

**Current density**: J = I/A (A/m²)

**Drift velocity**: vd = J/(n·e) where n is carrier concentration, e is electron charge

Despite fast signal propagation (near light speed), electrons drift slowly (mm/s). The electric field propagates at near-light speed, pushing electrons throughout the wire almost simultaneously.

## 2.2 Wire Gauge and Selection

AWG (American Wire Gauge) is the standard wire sizing system:
- **Smaller gauge number = thicker wire = lower resistance**
- Each 3-gauge decrease roughly doubles the cross-sectional area
- Each 10-gauge decrease multiplies area by ~10

| AWG | Diameter (mm) | Resistance (mΩ/m) | Typical Use |
|---|---|---|---|
| 10 | 2.59 | 3.3 | 30A circuits |
| 12 | 2.05 | 5.2 | 20A household |
| 14 | 1.63 | 8.3 | 15A household |
| 18 | 1.02 | 21 | Low-power electronics |

### Wire Selection Criteria
- **Current capacity** (ampacity): wire must handle the current without overheating
- **Voltage drop**: V = IR limits distance; thicker wire for longer runs
- **Cost**: larger wire costs more; balance against performance`,
      examTip: 'For the FE exam, know that voltage drop V = I×R limits how far current can travel at a given wire gauge. For long cable runs, use thicker wire (lower gauge number) to keep voltage drop acceptable. The formula R = ρL/A directly determines this tradeoff.',
    },
    {
      id: 'cond-temp',
      title: '3. Temperature Dependence, Worked',
      content: `## 3.1 Geometry first: one wire, two routes to R

Given: 100 m of AWG 12 copper (diameter 2.05 mm), ρ = 1.7×10⁻⁸ Ω·m at 20 °C.

Relation: R = ρL/A with A = π·d²/4.

Substitution: A = π(2.05×10⁻³)²/4 = 3.30×10⁻⁶ m².

R = (1.7×10⁻⁸ × 100) / 3.30×10⁻⁶ = **0.515 Ω**

Cross-check from the wire table: 5.2 mΩ/m × 100 m = 0.52 Ω ✓. Two routes, one
answer — and note the unit discipline: the diameter arrived in millimetres and
had to become metres BEFORE squaring, because the mm→m factor of 10⁻³ turns
into 10⁻⁶ inside the area.

## 3.2 Now heat it

The same run sits in a hot cable tray at 75 °C. Relation:
R(T) = R₀[1 + α(T − T₀)], with copper's tabulated α = 0.00393 per °C
referenced to 20 °C.

R(75) = 0.515 × [1 + 0.00393 × (75 − 20)] = 0.515 × 1.216 = **0.626 Ω**

A 55 °C rise cost 22% more resistance — and therefore 22% more I²R loss at the
same current, which heats the tray further. For copper near room temperature a
useful mental rate is roughly 0.4% per °C.

![Resistance against temperature computed from the two models the lesson states: the linear metal law with tabulated coefficients for copper and tungsten, and the exponential NTC thermistor law with B equal to 3950 kelvin on a logarithmic axis. The metal changes by tens of percent over the range while the thermistor changes fifty-fold.](/courses/fe-ee/figures/mat-resistivity-temp.svg)

## 3.3 The same physics, run as a thermometer

Because α is stable and well characterised, resistance measures temperature.

**Winding-rise measurement.** Given: a motor winding reads 10.00 Ω cold at
20 °C and 11.57 Ω after an hour at load. Relation: solve the linear law for ΔT.

ΔT = (R/R₀ − 1)/α = (1.157 − 1)/0.00393 = 0.157/0.00393 = **40 °C rise**,
so the winding is near 60 °C. This is the classic method for the average
temperature of a winding you cannot reach with a probe — the copper itself is
the sensor.

**RTDs and thermistors.** A platinum RTD (standard α = 0.00385 per °C) gives a
small, linear, repeatable signal; an NTC thermistor gives a huge, nonlinear
one — the figure's factor-of-50 swing from 25 to 150 °C against the metal's
tens of percent. Choose the RTD for accuracy over wide ranges, the thermistor
for sensitivity in a narrow band, and remember which direction each moves:
metal up with temperature, semiconductor down.

| Sensing element | Law | Coefficient | Character |
|---|---|---|---|
| Copper winding | linear in T | +0.393 %/°C | measures its own temperature |
| Platinum RTD | linear in T | +0.385 %/°C | accurate, stable, gentle slope |
| NTC thermistor | exponential in 1/T | ≈ −4 %/°C near 25 °C | huge signal, strongly nonlinear |`,
      examTip: 'The temperature law needs the resistance at the REFERENCE temperature, not just any measured value. If the problem hands you R at 30 °C and α referenced to 20 °C, convert to R₂₀ first — applying α from the wrong baseline is the built-in distractor.',
    },
    {
      id: 'cond-thermal',
      title: '4. Thermal Properties of Electrical Materials',
      content: `## 4.1 Heat flow is Ohm's law with different labels

Steady heat conduction through a slab obeys q = κ·A·ΔT/L, with κ the
**thermal conductivity** in W/(m·K). Regroup it and the electrical analogy is
exact:

**ΔT = q · Rθ, with Rθ = L/(κA) in K/W**

Temperature difference plays voltage, heat flow plays current, and thermal
resistances in series ADD. Every junction-temperature calculation in
electronics is a one-loop "circuit" solved with this analogy.

Worked: a transistor dissipates 2 W. Junction-to-case resistance 5 K/W,
case-to-ambient (heat sink) 20 K/W, ambient 40 °C.

T_junction = 40 + 2 × (5 + 20) = 40 + 50 = **90 °C**

To run cooler, attack the LARGEST resistance in the chain — a better heat sink,
not a better package, is what this budget wants.

## 4.2 Why good conductors of charge conduct heat too

In metals the same free electrons carry both charge and heat, so electrical and
thermal conductivity travel together. The **Wiedemann–Franz relation** makes it
quantitative: κ/(σT) ≈ L₀ = 2.44×10⁻⁸ W·Ω/K². Check it on copper at 300 K:

κ ≈ L₀·T·σ = 2.44×10⁻⁸ × 300 / 1.7×10⁻⁸ = **431 W/(m·K)**

against the tabulated 401 W/(m·K) — within 8%, the remainder being lattice
effects the simple electron picture ignores. The practical consequence runs
both ways: busbars double as heat spreaders, and there is no metal that
conducts current well but heat poorly. Insulators, lacking free electrons, must
move heat by lattice vibration alone — most do it badly, which is why the
electrically-insulating layer in a power assembly is usually also the thermal
bottleneck. Exceptions matter: alumina, and especially aluminum nitride, are
ceramic insulators engineered to conduct heat respectably.

Typical tabulated room-temperature values:

| Material | κ, W/(m·K) | CTE, ppm/K | Specific heat, J/(kg·K) | Role |
|---|---|---|---|---|
| Copper | 401 | 17 | 385 | conductor, heat spreader |
| Aluminum | 237 | 23 | 900 | conductor, heat sinks |
| Silicon | 149 | 2.6 | 700 | die |
| Alumina (Al₂O₃) | ≈ 30 | 6.8 | 880 | insulating substrate |
| SAC solder | ≈ 58 | ≈ 22 | 230 | die/board attach |
| FR-4 laminate | ≈ 0.3 | ≈ 14 in-plane | ≈ 1200 | board — the bottleneck |

## 4.3 Expansion: the mismatch problem

Materials grow with temperature: ΔL = α_CTE·L·ΔT, with α_CTE in ppm/K from the
table. Given: a 2 m aluminum busbar cycling 60 K.

ΔL = 23×10⁻⁶ × 2 × 60 = 2.76×10⁻³ m = **2.8 mm**

Nearly three millimetres of motion per thermal cycle — which is why long bus
runs get flexible links. The subtler failure is the MISMATCH: silicon at
2.6 ppm/K soldered over FR-4 at ~14 ppm/K strains the joints on every cycle,
and repeated cycling fatigues the solder. Substrate choices like alumina sit
between the two CTEs to split the difference.

## 4.4 Heat capacity: surviving the transient

Specific heat c sets how much energy a mass absorbs per kelvin: Q = m·c·ΔT.
Given: a 10 g copper element absorbing a fault pulse, allowed 100 K of rise:

Q = 0.010 × 385 × 100 = **385 J**

For short pulses, thermal mass — not thermal resistance — is the protection:
the energy lands before conduction can move it anywhere. Fuse elements,
inrush-limiting resistors and motor windings during a stall all live on this
budget. Steady state belongs to Rθ; transients belong to m·c.`,
      examTip: 'Series thermal resistances add exactly like series electrical resistances, and the junction temperature is ambient plus power times the total. Draw the thermal chain as a circuit and the problem solves itself with Ohm-law reflexes.',
      importantNote: 'The Wiedemann-Franz link means you can never have a metal that is a good electrical conductor and a poor thermal one - the same electrons do both jobs. When a design needs electrical isolation WITH good heat removal, the answer is a ceramic like alumina or aluminum nitride, and this exact selection question is FE material.',
    },
    {
      id: 'cond-set',
      title: '5. Problem Set and Recurring Errors',
      content: `## 5.1 Voltage drop over a feeder

Given: 200 m of aluminum conductor (ρ = 2.8×10⁻⁸ Ω·m), cross-section 10 mm²,
carrying 20 A. Find the resistance and the voltage drop.

R = ρL/A = 2.8×10⁻⁸ × 200 / 10×10⁻⁶ = **0.56 Ω**

V = IR = 20 × 0.56 = **11.2 V**

On a 230 V circuit that is a 4.9% drop — marginal, and the reason feeder
problems end with "select the next larger size." Note 10 mm² became 10×10⁻⁶ m²;
the mm²→m² conversion is 10⁻⁶, and skipping it is a six-order-of-magnitude
error that the answer choices will happily accommodate.

## 5.2 Percent change without absolute values

Given: a copper conductor's resistance at 20 °C is R₀; by what percentage does
it rise at 90 °C?

R/R₀ = 1 + 0.00393 × 70 = 1.275 → **27.5% increase**

No geometry needed — the temperature factor is a pure ratio, and exam items
exploit that by never telling you the actual resistance.

## 5.3 Reasoning: which metal for the job?

Copper beats aluminum on resistivity (1.7 vs 2.8 ×10⁻⁸ Ω·m), but aluminum wins
on mass: its density (2700 kg/m³) is under a third of copper's (8960 kg/m³).
For equal RESISTANCE per unit length, the aluminum conductor needs 1.65× the
cross-section but still weighs roughly half as much — which is why overhead
transmission lines are aluminum (with steel reinforcement for strength) while
motor windings and busbars in tight volumes stay copper. When an exam item
asks "why aluminum overhead," the credited reasoning is conductivity per unit
MASS, not per unit volume.

At the extreme end sits the superconductor: below its critical temperature the
resistivity is not merely small but exactly zero, so a current in a closed
superconducting loop persists without any source. The price is cryogenics, a
critical magnetic field, and a critical current density — exceed any of the
three and the material quenches back to normal conduction, dumping its stored
energy as heat. MRI magnets are the everyday application: kiloamp currents
circulating for years in a loop that dissipates nothing.

## 5.4 Skin effect: frequency stealing the area back

At DC, current fills the whole cross-section. At AC it crowds toward the
surface, penetrating only to roughly the **skin depth**

**δ = √(ρ / (π·f·μ))**

For copper: δ ≈ **8.5 mm at 60 Hz** but only **0.21 mm at 100 kHz** — computed
from the tabulated ρ and μ₀. A fat 60 Hz busbar uses most of its copper; the
same bar at 100 kHz conducts in a thin shell and its AC resistance multiplies.
The material did not change — the usable A in R = ρL/A did. This is why
high-frequency windings use **litz wire** (many insulated strands, each thinner
than δ) and why very-high-frequency conductors can be hollow tubes: the core
copper was doing nothing anyway. Notice the parallel with lamination in
magnetic cores — both are geometry answers to an induced-current problem, and
the exam likes the analogy.

## 5.5 Where marks are lost

| Error | What it looks like | The fix |
|---|---|---|
| Diameter used as radius | area 4× too large, R 4× too small | A = πd²/4 when given diameter |
| mm² not converted | resistance off by 10⁶ | area in m² before dividing |
| α applied from the wrong baseline | R at 30 °C treated as R₂₀ | the law references the temperature α was quoted at |
| Doubling A to halve L's effect | confusing the two geometry knobs | R scales UP with L, DOWN with A — check direction |
| κ and σ swapped in the analogy | thermal resistance from electrical ρ | Rθ = L/(κA) uses THERMAL conductivity |`,
      examTip: 'R = ρL/A questions are unit questions in disguise: resistivity arrives in Ω·m, geometry in mm and mm², and the distractors are exactly the answers produced by each missed conversion. Convert everything to SI before substituting and the problem is thirty seconds long.',
    },
  ],
  keyTakeaways: [
    'Resistivity ρ is intrinsic; resistance R = ρL/A depends on geometry.',
    'Temperature coefficient α: positive for metals (R increases), negative for semiconductors.',
    'Conductivity σ = 1/ρ; copper is the standard conductor (ρ ≈ 1.7×10⁻⁸ Ω·m).',
    'AWG: smaller number = thicker wire = lower resistance.',
    'Wire selection balances ampacity, voltage drop, and cost.',
  ],
},

fee_semiconductors: {
  topicId: 'fee_semiconductors',
  title: 'Semiconductors and Band Gap',
  domainWeight: 'Properties of Electrical Materials · 3–5%',
  overview: 'Semiconductors have properties between conductors and insulators, controlled by doping. Band gap energy, carrier concentration, and the p-n junction are fundamental to all electronic devices.',
  sections: [
    {
      id: 'semi-band',
      title: '1. Band Structure and Intrinsic Semiconductors',
      content: `## 1.1 Energy Bands

In a semiconductor crystal:
- **Valence band**: electrons are bound to atoms (cannot conduct)
- **Conduction band**: electrons are free to move (can conduct)
- **Band gap** Eg: energy required to promote an electron from valence to conduction band

| Material | Band Gap Eg | Type |
|---|---|---|
| Silicon (Si) | 1.12 eV | Semiconductor |
| Germanium (Ge) | 0.66 eV | Semiconductor |
| Gallium Arsenide (GaAs) | 1.42 eV | Semiconductor |
| Diamond | 5.47 eV | Insulator |

## 1.2 Intrinsic Carrier Concentration

**$ni \\propto \\exp (-Eg/(2kT))$**

Where k = 8.617×$10^{-5}$ eV/K (Boltzmann constant) and T is temperature in Kelvin.

For silicon at 300K: **$ni \\approx 1.5 \\times 10^{10} cm^{-3}$**

### Temperature Effects
- Higher T → more thermal energy → more electrons promoted → higher conductivity
- Carrier concentration roughly **doubles every 5-10°C**
- This is why semiconductor devices are temperature-sensitive`,
      examTip: 'Smaller band gap = higher intrinsic conductivity at room temperature. Germanium (Eg = 0.66 eV) has more carriers than silicon (Eg = 1.12 eV) at room temperature, which means more leakage current. This is why silicon dominates — it has lower leakage.',
    },
    {
      id: 'semi-doping',
      title: '2. Doping and the p-n Junction',
      content: `## 2.1 Doping

Adding impurities dramatically changes conductivity:

### N-type Doping (Donor)
- Add atoms with 5 valence electrons (P, As, Sb)
- Extra electron is loosely bound → easily becomes free carrier
- **Majority carriers**: electrons; **Minority carriers**: holes
- n ≈ ND (donor concentration), p = ni²/ND

### P-type Doping (Acceptor)
- Add atoms with 3 valence electrons (B, Al, Ga)
- Missing electron creates a "hole" that acts as positive charge
- **Majority carriers**: holes; **Minority carriers**: electrons
- p ≈ NA (acceptor concentration), n = ni²/NA

### Mass Action Law

**$n \\times p = ni^{2}$** (constant at fixed temperature, regardless of doping)

## 2.2 The p-n Junction (Diode)

When p-type meets n-type:
- A **depletion region** forms at the junction (no free carriers)
- Built-in potential ≈ 0.7 V for silicon
- **Forward bias** (+ to p, - to n): narrows depletion region → current flows
- **Reverse bias**: widens depletion region → minimal current (leakage only)

### Shockley Diode Equation

**$I = Is(e^{qV/kT} - 1)$**

Where Is is saturation current (≈ 10⁻¹² A), q = 1.602×10⁻¹⁹ C, kT/q ≈ 26 mV at 300K.`,
      examTip: 'The mass action law n×p = ni² is critical. If you dope silicon with ND = 10¹⁶ donors/cm³, then n ≈ 10¹⁶ and p = (1.5×10¹⁰)²/10¹⁶ = 2.25×10⁴ cm⁻³. The minority carrier concentration drops dramatically with doping.',
      importantNote: 'Thermal runaway in power devices: as temperature rises, more carriers are generated, increasing current, which generates more heat, further increasing temperature. Without proper thermal management (heat sinks, thermal shutdown), this positive feedback loop destroys the device.',
    },
    {
      id: 'semi-carriers',
      title: '3. Conductivity from Carriers, Worked',
      content: `## 3.1 The one formula that prices a semiconductor

Conductivity is carriers times mobility times charge:

**σ = q(n·μn + p·μp)**

with q = 1.602×10⁻¹⁹ C and the tabulated silicon mobilities μn ≈ 1350 and
μp ≈ 480 cm²/(V·s). Electrons are nearly three times as mobile as holes in
silicon — which is why, given the choice, high-speed devices are built to
conduct with electrons.

Worked: silicon doped with ND = 10¹⁶ donors/cm³. Then n ≈ 10¹⁶ and the hole
term is negligible (p = 2.25×10⁴ cm⁻³ from mass action — twelve orders down):

σ = 1.602×10⁻¹⁹ × 10¹⁶ × 1350 = **2.16 S/cm**, so ρ = 1/σ = **0.46 Ω·cm**

Compare intrinsic silicon, where n = p = ni = 1.5×10¹⁰ and BOTH carriers count:

σᵢ = 1.602×10⁻¹⁹ × 1.5×10¹⁰ × (1350 + 480) = 4.40×10⁻⁶ S/cm, ρᵢ ≈ 2.3×10⁵ Ω·cm

The doping raised conductivity by a factor of about **5×10⁵** — while replacing
only one silicon atom in five million (10¹⁶ dopants against 5×10²² atoms/cm³).
No other class of material changes its electrical character this violently
under such gentle chemistry; that leverage is the entire semiconductor
industry.

## 3.2 Temperature: the plateau and the cliff

![Intrinsic carrier concentration against temperature for silicon and germanium, each normalised to its own value at 300 kelvin and computed from the exponential band-gap law. The logarithmic axis shows silicon gaining roughly three decades of carriers between room temperature and 175 degrees Celsius, and the smaller gap of germanium rising less steeply from a far higher starting concentration.](/courses/fe-ee/figures/mat-carrier-ni.svg)

A DOPED device holds n ≈ ND over a wide "extrinsic" range: the dopants are
fully ionised and thermally-generated pairs are a rounding error. But ni climbs
exponentially, and when it approaches the doping level the device forgets its
doping — junctions leak, the designed asymmetry washes out, and the device
fails functionally though nothing has melted. That crossover sets the maximum
junction temperature: roughly 150–200 °C for silicon. Germanium, starting with
ni three orders higher and a smaller gap, runs out near 85–100 °C — the
historical reason silicon displaced it. Wide-gap materials (SiC at 3.3 eV, GaN
at 3.4 eV) push the same limit past 300 °C and into power applications.

| Material | Eg (eV) | ni at 300 K (cm⁻³) | Practical junction limit |
|---|---|---|---|
| Germanium | 0.66 | ≈ 2.4×10¹³ | ≈ 85–100 °C |
| Silicon | 1.12 | ≈ 1.5×10¹⁰ | ≈ 150–200 °C |
| Silicon carbide (4H) | 3.26 | ≈ 10⁻⁸ | > 300 °C |

The table's ni column spans twenty decades for a factor-of-five change in gap —
the exponential exp(−Eg/2kT) is doing that, and it is the single most
consequential formula in this topic.

## 3.3 The Hall effect: counting carriers directly

Pass current through a bar in a perpendicular magnetic field and the carriers
are pushed sideways, piling up until the resulting transverse field balances
the magnetic force. The equilibrium **Hall voltage** across a bar of thickness
t is

**V_H = I·B / (n·q·t)**

Given: an n-type bar with n = 10¹⁶ cm⁻³ = 10²² m⁻³, t = 0.5 mm, I = 1 mA,
B = 0.5 T.

V_H = (10⁻³ × 0.5) / (10²² × 1.602×10⁻¹⁹ × 5×10⁻⁴) = **0.62 mV**

Two things make this measurement the workhorse of semiconductor
characterisation. The magnitude gives n — the doping level — directly, with no
model in between. And the SIGN of V_H reveals which carrier is moving:
electrons and holes drifting in the same conventional-current direction are
deflected to the SAME side, so the polarity of the pile-up differs between
n-type and p-type. Hall measurements are how hole conduction was established as
physically real, and a Hall sensor in a motor or clamp meter is this same
equation earning a living.`,
      examTip: 'In σ = q(nμn + pμp), doped material needs only its majority term — the minority contribution is tens of orders smaller. If an exam answer requires both terms, the material is intrinsic; if it is doped, one term is the whole answer.',
    },
    {
      id: 'semi-diode',
      title: '4. The Diode Equation in Numbers',
      content: `## 4.1 The scale that matters: 26 mV

The thermal voltage VT = kT/q = **25.85 mV at 300 K** sets the exponential's
pace. With Is = 10⁻¹² A, the Shockley equation I = Is(e^(V/VT) − 1) gives:

| V (V) | I | Step |
|---|---|---|
| 0.60 | 12 mA | — |
| 0.66 | 123 mA | +60 mV → ×10 |
| 0.72 | 1.23 A | +60 mV → ×10 |

Each 59.5 mV — that is VT·ln 10 — multiplies the current by ten. Run backwards:
a decade less current costs only 60 mV of forward voltage, which is why a
diode's "on voltage" looks locked near 0.6–0.7 V across three decades of
operating current.

![The same Shockley diode current drawn twice from one computation with saturation current ten to the minus twelve amperes: on linear axes the curve appears to switch on near 0.7 volts, while on the logarithmic axis it is a single straight exponential climbing one decade for every 59.5 millivolts.](/courses/fe-ee/figures/mat-diode-iv.svg)

The figure's point is that the celebrated 0.7 V "knee" is an artifact of linear
axes: the exponential has no knee, no threshold, and no switch. The 0.7 V rule
of thumb works because the exponential is so steep there that circuit-level
currents all crowd into a narrow voltage band — a useful fiction, and the exam
uses it too, but questions about WHY it works are answered by VT·ln 10.

## 4.2 Reverse bias and temperature, quantified

In reverse, the exponential dies and I → −Is: a leakage floor, not a mirror of
the forward curve. But Is rides on ni², so it inherits the band-gap
exponential — leakage roughly **doubles every 8–10 °C** in silicon. A design
that tolerates nanoamp leakage at 25 °C should expect the better part of a
microamp at 100 °C.

Forward voltage runs the other way: at fixed current, VF falls by roughly
**2 mV per °C** (the standard silicon rule) because the growing Is needs less
voltage for the same current. Two practical consequences: a diode drop makes a
serviceable crude thermometer, and paralleled diodes share badly — the hotter
one takes more current, heats further, and hogs the load. The same mechanism at
higher power is the thermal-runaway loop flagged earlier in this topic.

## 4.3 The gap as a wavelength

A photon can create an electron-hole pair only if it carries at least the gap
energy, and a recombining pair emits a photon of about the gap energy. The
conversion is

**λ (µm) ≈ 1.24 / Eg (eV)**

| Material | Eg (eV) | λ = 1.24/Eg | Optical role |
|---|---|---|---|
| Germanium | 0.66 | 1.88 µm | infrared detectors |
| Silicon | 1.12 | 1.11 µm | photodiodes, solar cells |
| GaAs | 1.42 | 0.87 µm | IR LEDs, lasers |
| GaN | 3.4 | 0.36 µm | blue/UV LEDs |

Silicon absorbs everything shorter than 1.11 µm — the whole visible spectrum —
which is why it makes solar cells; photons longer than that pass through as if
the wafer were glass. Building a BLUE emitter needed a 3-eV-class gap, which is
why LED lighting waited for gallium nitride. One formula, read in both
directions: absorption edge for detectors, emission colour for LEDs, and the
1.24 constant is just h·c expressed in eV·µm.`,
      examTip: 'Two numbers unlock most diode items: 26 mV of thermal voltage at room temperature, and 60 mV per decade of current. Given any (V, I) pair you can walk to any other operating point in decades without touching an exponential.',
    },
    {
      id: 'semi-set',
      title: '5. Problem Set and Recurring Errors',
      content: `## 5.1 Minority concentration in p-type material

Given: silicon doped with NA = 5×10¹⁵ acceptors/cm³ at 300 K. Find both carrier
concentrations.

Majority: p ≈ NA = 5×10¹⁵ cm⁻³. Minority, from mass action n·p = ni²:

n = (1.5×10¹⁰)² / 5×10¹⁵ = 2.25×10²⁰ / 5×10¹⁵ = **4.5×10⁴ cm⁻³**

Holes are the majority here — acceptors make p-type. Getting the carrier TYPE
right is worth as much as the arithmetic: donors (P, As, Sb, five valence
electrons) give electrons; acceptors (B, Al, Ga, three) give holes.

## 5.2 Resistance of a doped bar

Given: a bar of the ND = 10¹⁶ material from section 3 (ρ = 0.46 Ω·cm), 1 cm
long with 0.1 cm² cross-section.

R = ρL/A = 0.46 × 1 / 0.1 = **4.6 Ω**

The geometry formula is the same one used for copper — only ρ changed, by nine
orders of magnitude. Keeping resistivity in Ω·cm with geometry in cm is
self-consistent and avoids the unit slip entirely, but never mix Ω·cm with
metres.

## 5.3 Voltage step for a current ratio

Given: a silicon diode carries 1 mA at 0.62 V, 300 K. Estimate the voltage at
10 mA.

ΔV = VT·ln(I₂/I₁) = 25.85 mV × ln 10 = 59.5 mV → V ≈ 0.62 + 0.06 = **0.68 V**

One decade, sixty millivolts, no exponentials evaluated. For a factor of 2 the
step is VT·ln 2 = 18 mV — worth recognising on sight.

The same ratio logic runs in reverse for temperature: if the ambient rises so
that leakage matters, each 8–10 °C of rise doubles Is, and the forward voltage
at fixed current gives back about 2 mV/°C. An item that raises BOTH the
temperature and the current is asking you to apply the two effects
independently and sum the small voltage changes — they are separate mechanisms
and neither cancels the other exactly.

## 5.4 Where marks are lost

| Error | What it looks like | The fix |
|---|---|---|
| Eg instead of Eg/2 in the ni exponential | carrier ratios squared away from reality | pair creation splits the gap energy across the exponent's 2kT |
| Mixing cm and m units | σ off by 10⁴ | mobilities are tabulated in cm²/(V·s); keep the whole computation in cm |
| Adding minority carriers to σ | two-term sums for doped material | the minority term is ~12 orders down; it never matters in doped σ |
| Treating 0.7 V as a constant of nature | no answer for "why 0.7?" questions | it is where the exponential crosses circuit-scale currents |
| Celsius in kT | VT = 2 mV at "T = 25" | temperature in the exponential is always kelvin |
| Donor/acceptor swapped | n-type from boron | five valence electrons donate; three accept |`,
      examTip: 'Mass-action problems are one-line divisions, and the trap is only the exponent arithmetic: (1.5×10¹⁰)² is 2.25×10²⁰, not 2.25×10¹⁰⁰ and not 3×10²⁰. Slow down for the squares of powers of ten and these are free points.',
    },
  ],
  keyTakeaways: [
    'Band gap Eg determines carrier excitation; silicon Eg = 1.12 eV, ni ≈ 1.5×10¹⁰ cm⁻³ at 300K.',
    'N-type (donor): extra electrons; P-type (acceptor): extra holes.',
    'Mass action law: n×p = ni² always holds at fixed temperature.',
    'Shockley equation I = Is(e^(qV/kT)-1) describes diode exponential I-V curve.',
    'Forward bias: current flows (V > 0.7V for Si); reverse bias: only leakage current.',
  ],
},

fee_dielectrics: {
  topicId: 'fee_dielectrics',
  title: 'Dielectrics and Insulators',
  domainWeight: 'Properties of Electrical Materials · 3–5%',
  overview: 'Dielectric materials store energy in electric fields and enable capacitors. Dielectric constant, breakdown strength, and loss tangent determine capacitor performance and insulation reliability.',
  sections: [
    {
      id: 'diel-cap',
      title: '1. Dielectric Constant and Capacitance',
      content: `## 1.1 Dielectric Properties

The **dielectric constant** (relative permittivity) εr measures how much a material increases capacitance compared to vacuum:

**$C = \\varepsilon r\\cdot \\varepsilon _{0}\\cdot A/d$**

Where ε₀ = 8.854×10⁻¹² F/m is permittivity of free space.

| Material | $\\varepsilon r$ | Typical Application |
|---|---|---|
| Vacuum | 1 | Reference |
| Air | 1.0006 | Variable capacitors |
| Mica | 3-7 | Precision capacitors |
| Glass | 4-10 | Substrates |
| Ceramic (X7R) | 100-10000 | High-density capacitors |
| Water | 80 | (Not used in capacitors) |

## 1.2 Energy Storage

**$U = \\tfrac{1}{2} CV^{2} = \\tfrac{1}{2} \\varepsilon r\\cdot \\varepsilon _{0}\\cdot (A/d)\\cdot V^{2}$**

Higher εr → more energy stored per volume → smaller capacitors for same capacitance.

## 1.3 Breakdown Voltage

**Dielectric strength** is the maximum electric field before breakdown (permanent damage). It is thickness-dependent: thin layers withstand far higher fields per metre than bulk pieces of the same material, which is why capacitor-grade films and MLCC layers carry much larger numbers than bulk insulators:
- Air: ~3 MV/m
- Mica (thin sheet): ~150 MV/m
- Ceramic: ~10–35 MV/m in bulk; thin multilayer-capacitor layers reach 100+ MV/m

Design with **safety margin**: operating field should be 30-50% of breakdown strength.`,
      examTip: 'C = εr·ε₀·A/d is a high-frequency FE exam formula. To increase capacitance: increase εr (better dielectric material), increase A (larger plates), or decrease d (thinner dielectric). But decreasing d also brings you closer to breakdown — there is always a tradeoff.',
    },
    {
      id: 'diel-loss',
      title: '2. Dielectric Loss and Insulation',
      content: `## 2.1 Dielectric Loss

Real dielectrics dissipate some energy as heat, characterized by the **loss tangent** tan(δ):

- **Low-loss materials** (tan δ < 0.001): mica, PTFE — used in high-frequency applications
- **High-loss materials** (tan δ > 0.01): some ceramics — cause heating at high frequency

Dielectric power loss: **$P_{loss} \\propto V^{2}\\cdot f\\cdot \\tan (\\delta)$**

Higher frequency and higher voltage increase dielectric heating.

## 2.2 Polarization Mechanisms

Different polarization mechanisms contribute at different frequencies:

| Mechanism | Frequency Range | Description |
|---|---|---|
| Electronic | Optical (10¹⁵ Hz) | Electron cloud shifts |
| Ionic | Infrared (10¹² Hz) | Ions shift positions |
| Dipolar | Microwave (10⁹ Hz) | Polar molecules rotate |
| Interfacial | Low freq (10³ Hz) | Charges accumulate at interfaces |

At higher frequencies, slower mechanisms cannot follow the field, reducing εr. This frequency-dependent permittivity must be considered in AC circuit design.

## 2.3 Insulation Properties

- **Insulation resistance**: should be > 10¹² Ω for good insulators
- **Moisture absorption** degrades insulation — environmental protection required
- **Temperature** affects all properties — insulation must work at maximum operating temperature`,
      examTip: 'For high-frequency applications, use low-loss dielectrics (mica, PTFE). For high-capacitance applications, use high-εr materials (ceramic). The FE exam may ask you to select a dielectric based on application requirements.',
    },
    {
      id: 'diel-sizing',
      title: '3. Sizing a Capacitor Against Breakdown',
      content: `## 3.1 One ceramic layer, all the numbers

Given: a single ceramic layer with εr = 2000, plate area 1 cm², dielectric
thickness 10 µm, operated at 50 V.

**Capacitance.** C = εr·ε₀·A/d:

C = 2000 × 8.854×10⁻¹² × (1×10⁻⁴) / (10×10⁻⁶) = **177 nF**

**Field check.** E = V/d = 50 / 10×10⁻⁶ = **5 MV/m**. A ceramic layer this
thin (10 µm) withstands fields of order 100 MV/m — thin layers break down at
far higher fields than bulk ceramic — so the operating field is about 5% of
breakdown, comfortably inside a 30–50% design ceiling.

**Stored energy.** U = ½CV² = 0.5 × 1.77×10⁻⁷ × 50² = **0.22 mJ**.

Three formulas, one component, and every number audited. Real multilayer parts
stack dozens to hundreds of such layers in parallel — capacitances in parallel
add, so a 100-layer stack of this geometry is already 17.7 µF in a few cubic
millimetres. Thin layers are the whole trick, and thin layers are why voltage
ratings on high-capacitance ceramics are modest: d appears in C's denominator
AND in E = V/d.

## 3.2 Energy density: what εr and breakdown buy together

Writing the stored energy per unit volume of dielectric,

**u = ½·εr·ε₀·E²**

says a dielectric is valuable for TWO multiplied reasons: its permittivity
(linear factor) and the square of the field it can stand. Evaluating at each
material's tabulated limit:

| Material | εr | E_bd (MV/m) | u at breakdown |
|---|---|---|---|
| Air | 1.0 | 3 | ≈ 40 J/m³ |
| Mica | 6 | 150 | ≈ 6×10⁵ J/m³ |
| Class-2 ceramic | 2000 | 20 | ≈ 3.5×10⁶ J/m³ |

![Stored energy density against electric field for air, mica and a class-2 ceramic, each computed from one half epsilon-r epsilon-zero E-squared and terminated at that material's tabulated breakdown strength. The endpoints span five decades, which is why capacitor volumes for the same job differ so dramatically.](/courses/fe-ee/figures/mat-dielectric-energy.svg)

The E² weighting produces an unintuitive ranking: mica's modest εr = 6 lands
within a single order of magnitude of the ceramic's result despite a 333×
permittivity deficit, because mica stands 7.5× the field and the square of 7.5
claws back a factor of 56. High breakdown strength competes with high
permittivity on even terms — per unit of energy stored — whenever the design
is free to raise the voltage.

One honest caveat about class-2 ceramics: the tabulated εr is a small-signal
value. Under DC bias these materials lose a large fraction of their
permittivity, so the effective energy density in service is well below the
table's promise. Film and mica capacitors hold their εr; that stability is what
you are buying when you specify them.

## 3.3 Reading a ceramic's class code

The class-1/class-2 split is a permittivity-versus-stability trade written
into the part numbers, and selection items assume you can read it:

| Code | Class | εr behaviour | Capacitance drift |
|---|---|---|---|
| C0G / NP0 | 1 | low εr (tens) | ≈ ±30 ppm/°C — essentially flat |
| X7R | 2 | high εr (thousands) | ±15% over −55 to +125 °C |
| Y5V | 2 | very high εr | −82% to +22% over its range |

A C0G part behaves like a small, honest film capacitor in a ceramic body: its
value can sit in a filter or an oscillator. An X7R holds enough charge for
decoupling but its value is a moving target — worse under DC bias, worse with
temperature, worse with age. Y5V trades away so much stability that only the
least critical bulk-decoupling roles tolerate it. The rule that follows: any
capacitor whose VALUE appears in a design equation gets class 1 or film;
capacitors that merely need to be "big enough" may be class 2. Exam stems that
mention timing, filtering, or measurement are pointing at the first category.`,
      examTip: 'Capacitor geometry problems are unit-conversion problems: area arrives in cm², thickness in µm, and both must reach SI before C = εr·ε₀·A/d. A wrong answer that is a clean power of ten away from an option is a conversion slip, not a method error.',
    },
    {
      id: 'diel-loss-worked',
      title: '4. Loss in Numbers, and Choosing a Dielectric',
      content: `## 4.1 From tan δ to watts

A lossy capacitor behaves like an ideal one in series with an **equivalent
series resistance**, and the loss tangent is the bridge:

**ESR = tan δ / (ωC)**

Worked: a 100 nF class-2 ceramic with tan δ = 0.025, carrying 0.5 A rms of
ripple at 100 kHz.

ωC = 2π × 10⁵ × 10⁻⁷ = 0.0628 S → ESR = 0.025 / 0.0628 = **0.40 Ω**

P = I²·ESR = 0.5² × 0.40 = **0.10 W**

A tenth of a watt inside a component of a few cubic millimetres is a real
temperature rise, and dielectric loss grows with frequency while tan δ itself
also drifts upward — ripple-current heating is what actually limits many
switching-supply capacitor choices, not voltage or capacitance.

For field-driven (voltage-driven) situations the same physics reads
P = V²·ωC·tan δ: loss climbs linearly with frequency and with the SQUARE of
voltage, which is why high-voltage high-frequency service is the hardest duty a
dielectric sees.

## 4.2 Quality factor and the materials ladder

The reciprocal Q = 1/tan δ is the dielectric's quality factor. Typical
tabulated room-temperature magnitudes:

| Material | tan δ (order) | Q (order) | Natural habitat |
|---|---|---|---|
| PTFE, polypropylene | 10⁻⁴ | 10⁴ | RF, snubbers, precision filters |
| Mica | 10⁻⁴–10⁻³ | 10³–10⁴ | RF, high stability |
| Class-1 ceramic (C0G) | ≈ 10⁻³ | ≈ 10³ | stable small-value ceramics |
| Class-2 ceramic (X7R) | 0.01–0.03 | 30–100 | bulk decoupling |
| Aluminum electrolytic | ≈ 10⁻¹ | ≈ 10 | bulk energy storage |

The ladder explains the standard board layout: an electrolytic for bulk charge,
a class-2 ceramic beside the IC for mid-frequency decoupling, and a class-1 or
film part wherever the capacitance VALUE participates in a filter or timing
computation. Each step down the tan δ column costs capacitance per volume;
each step up costs precision and loss. There is no dielectric at the top of
every column — which is precisely why selection questions have content.

Environment moves every row of the table. Absorbed moisture raises both εr and
tan δ while dragging insulation resistance down, which is why hygroscopic
materials like paper are only used oil-impregnated and sealed. Temperature
generally worsens loss and accelerates ageing — a common thumb rule halves
insulation life for every 8–10 °C of sustained overtemperature — so a
dielectric's rating is really a temperature-voltage-time envelope, not a single
number. When an exam stem specifies a damp or hot service environment, it is
inviting exactly this derating conversation: the printed room-temperature
numbers are the starting point of the answer, never the end of it.`,
      examTip: 'Loss scales as V² × f × tan δ. When an item doubles the frequency AND doubles the voltage, dielectric heating goes up eightfold — the squared factor belongs to voltage, and mixing up which factor is squared is the planted error.',
    },
    {
      id: 'diel-set',
      title: '5. Problem Set and Recurring Errors',
      content: `## 5.1 Air gap, then a dielectric slab

Given: parallel plates, A = 0.01 m², separation 1 mm, air between.

C = ε₀A/d = 8.854×10⁻¹² × 0.01 / 0.001 = **88.5 pF**

A glass slab with εr = 4 fills the gap: C = 4 × 88.5 = **354 pF**. If the
capacitor was CHARGED and disconnected before insertion, Q is fixed, so
V = Q/C falls to a quarter and the stored energy U = Q²/2C falls fourfold —
the slab is pulled inward as the field does work on it. If instead a source
holds V constant, energy RISES fourfold as the source supplies charge. Which
quantity is held fixed decides every before/after energy question.

## 5.2 Rating a film for voltage

Given: a 10 µm polymer film with breakdown strength 200 MV/m, derated to 40% of
breakdown. Maximum working voltage:

V = 0.40 × 200×10⁶ × 10×10⁻⁶ = **800 V**

Field times thickness is voltage — the breakdown NUMBER is a field, and
forgetting the thickness multiplication (or the derating) generates the
distractor set.

## 5.3 Mains-frequency dielectric heating

Given: a 1 µF capacitor with tan δ = 0.02 across 230 V rms, 50 Hz.

P = V²·ωC·tan δ = 230² × (2π × 50 × 10⁻⁶) × 0.02
 = 52 900 × 3.14×10⁻⁴ × 0.02 = **0.33 W**

A third of a watt of standing heat for a capacitor that ideally dissipates
nothing — at mains voltage even a mediocre tan δ matters, which is why
across-the-line capacitors are specified as low-loss safety-rated film types.

## 5.4 Two dielectrics in series: where the stress goes

Given: 10 kV across a 1 mm air gap in series with 4 mm of glass (εr = 4). Find
the field in each layer.

Relation: the flux density D is continuous across the interface, so
ε₀·εr_air·E_air = ε₀·εr_glass·E_glass, giving E_air = 4·E_glass. The voltages
add:

E_air(0.001) + (E_air/4)(0.004) = 10⁴ → E_air × 0.002 = 10⁴

**E_air = 5 MV/m, E_glass = 1.25 MV/m**

The LOW-permittivity layer takes the high field — series dielectrics divide
stress inversely to εr, exactly as series capacitors divide voltage inversely
to capacitance. And 5 MV/m exceeds air's 3 MV/m breakdown: the air gap
discharges even though the glass is loafing at under 1% of its strength. Had
the 5 mm been solid glass, the field would be a uniform 2 MV/m everywhere and
nothing would break down.

This is the physics of the most common real insulation failure. A microscopic
air VOID inside cast resin or cable insulation sees an elevated field, breaks
down locally, and the resulting **partial discharges** erode the surrounding
material until the whole wall fails — years later. It is why high-voltage
insulation is vacuum-impregnated (oil or resin displacing every air pocket) and
why partial-discharge testing, not just a voltage-withstand test, is the
acceptance criterion for HV equipment.

## 5.5 Where marks are lost

| Error | What it looks like | The fix |
|---|---|---|
| εr used where ε belongs | C off by a factor of 8.854×10⁻¹² | the formula needs the ε₀ AND the εr |
| Thickness left in µm | capacitance 10⁶ too large | d in metres before dividing |
| Breakdown field read as a voltage | "the film survives 200 MV" | multiply by thickness: V = E·d |
| Fixed-Q and fixed-V cases swapped | energy rising when it should fall | disconnected → Q fixed; source attached → V fixed |
| tan δ treated as frequency-independent | loss extrapolated across decades | tabulated tan δ holds near its stated frequency only |`,
      examTip: 'Dielectric-insertion energy questions hinge on one reading-comprehension bit: is the capacitor still connected to the source? Fixed charge means energy falls when εr rises; fixed voltage means it rises. Decide that before computing anything.',
    },
  ],
  keyTakeaways: [
    'Dielectric constant εr increases capacitance: C = εr·ε₀·A/d.',
    'Higher εr enables smaller capacitors but may increase loss.',
    'Breakdown voltage limits operating field; design with 30-50% safety margin.',
    'Loss tangent tan(δ) characterizes dielectric heating; critical at high frequencies.',
    'Moisture and temperature degrade insulation properties.',
  ],
},

fee_magnetic_mat: {
  topicId: 'fee_magnetic_mat',
  title: 'Magnetic Materials',
  domainWeight: 'Properties of Electrical Materials · 3–5%',
  overview: 'Magnetic materials determine inductance, transformer efficiency, and motor performance. Permeability, the B-H curve, hysteresis loss, and the Curie temperature are essential for understanding magnetic devices.',
  sections: [
    {
      id: 'mag-types',
      title: '1. Magnetic Material Classification',
      content: `## 1.1 Permeability

**$B = \\mu _{0}\\cdot \\mu r\\cdot H$** where μ₀ = 4π×$10^{-7}$ H/m

**Permeability** μ = μ₀·μr determines field amplification.

| Material Type | $\\mu r$ | Example | Behavior |
|---|---|---|---|
| Diamagnetic | < 1 (slightly) | Copper, Bismuth | Weakly repels field |
| Paramagnetic | > 1 (slightly) | Aluminum | Weakly attracts field |
| Ferromagnetic | >> 1 (100-5000) | Iron, Nickel, Cobalt | Strongly attracts, retains |

## 1.2 Ferromagnetic Materials

Ferromagnetic materials have **unpaired electrons** with exchange interactions causing spontaneous alignment. Key properties:
- **High permeability**: greatly amplifies magnetic fields
- **Saturation**: B levels off at high H (all domains aligned)
- **Remanence**: retains magnetization after field removed
- **Coercivity**: reverse field needed to demagnetize

### Curie Temperature

Above the **Curie temperature** Tc, ferromagnetic materials become paramagnetic:
- Iron: Tc ≈ 770°C
- Nickel: Tc ≈ 358°C
- Cobalt: Tc ≈ 1115°C`,
      examTip: 'Ferromagnetic cores dramatically increase inductance: L = μr·μ₀·n²·A/l. An iron core with μr = 1000 increases inductance by 1000× compared to air. This is why transformers and inductors use ferromagnetic cores.',
    },
    {
      id: 'mag-hysteresis',
      title: '2. Hysteresis and Core Losses',
      content: `## 2.1 The B-H Curve and Hysteresis Loop

As applied field H increases from zero:
1. **Initial magnetization**: B rises steeply then levels off (saturation)
2. **H decreases to zero**: B does not return to zero — **remanence** Br remains
3. **H reversed**: coercive field **Hc** needed to bring B to zero
4. **Full reversal**: creates the **hysteresis loop**

### Hysteresis Loss

The **area inside the hysteresis loop** represents energy dissipated as heat per cycle:

**W_hysteresis = (loop area) × frequency**

## 2.2 Soft vs Hard Magnetic Materials

| Property | Soft Magnetic | Hard Magnetic |
|---|---|---|
| Loop shape | Narrow (small area) | Wide (large area) |
| Coercivity | Low | High |
| Remanence | Low-moderate | High |
| Application | **Transformers, motors** | **Permanent magnets** |
| Examples | Silicon steel, ferrites | NdFeB, SmCo, Alnico |

## 2.3 Eddy Current Losses

Changing magnetic flux induces circulating currents (**eddy currents**) in conductive cores:

**$P_{eddy} \\propto B^{2}\\cdot f^{2}\\cdot t^{2}/\\rho$**

Where t = lamination thickness, f = frequency, ρ = resistivity.

### Reducing Core Losses
- **Lamination**: thin stacked sheets limit eddy current paths
- **Ferrites**: high-resistivity ceramic magnets for high-frequency applications
- **Thinner laminations**: reduce eddy currents further but increase manufacturing cost`,
      examTip: 'Transformer core losses = hysteresis loss + eddy current loss. Hysteresis loss is proportional to frequency (area × f). Eddy current loss is proportional to f² and to lamination thickness squared. This is why high-frequency transformers use ferrite cores (high ρ) instead of iron laminations.',
      importantNote: 'Core losses are present whenever the magnetic field is changing — even at no load. Copper losses (I²R in windings) depend on load current. Total transformer loss = core loss + copper loss. Maximum efficiency occurs when core loss equals copper loss.',
    },
    {
      id: 'mag-loop-read',
      title: '3. Reading the Loop, and Using It',
      content: `## 3.1 The loop as a materials datasheet

![Two hysteresis loops computed from a stated tanh magnetisation model rather than measured data - a schematic comparison. The narrow loop with small coercivity represents a soft transformer material; the wide loop with large coercivity represents a hard permanent-magnet material, with its remanence and coercivity marked.](/courses/fe-ee/figures/mat-bh-loops.svg)

Everything a magnetic-materials question asks is a point on this picture:

- **Saturation Bs** — the ceiling. Push H further and B barely responds; an
  inductor driven into saturation loses its inductance exactly when it is
  carrying the most current.
- **Remanence Br** — the B remaining at H = 0. High Br is the product in a
  permanent magnet and a nuisance in a transformer (it is why re-energising a
  transformer can draw a large inrush: the core remembers where it left off).
- **Coercivity Hc** — the reverse field that forces B to zero. This single
  number sorts materials: small Hc erases cheaply (soft), large Hc resists
  erasure (hard).
- **Loop area** — energy dissipated per cycle per unit volume, in J/m³. Soft
  materials minimise it; hard materials maximise the stored product instead.

Typical tabulated values put the classes three or more orders apart in Hc:

| Material | Class | Hc (A/m, order) | Bs or Br (T) | Job |
|---|---|---|---|---|
| Grain-oriented silicon steel | soft | 10–60 | Bs ≈ 2.0 | 50/60 Hz transformers |
| MnZn ferrite | soft | 10–30 | Bs ≈ 0.4–0.5 | switching supplies |
| Alnico | hard | ≈ 5×10⁴ | Br ≈ 1.2 | instruments, sensors |
| NdFeB | hard | ≈ 9×10⁵ | Br ≈ 1.2–1.4 | motors, actuators |

## 3.2 Worked: what a core buys an inductor

Given: a 100-turn winding on a toroid of cross-section 1 cm², magnetic path
length 10 cm, core μr = 2000.

Relation: L = μ₀·μr·N²·A / l.

L = (4π×10⁻⁷)(2000)(100²)(1×10⁻⁴) / 0.1 = **25.1 mH**

The identical winding on air: 25.1 mH / 2000 = **12.6 µH**. The core
multiplied inductance by exactly μr — three orders of magnitude of inductance
for free, EXCEPT that the core saturates, heats, and its μr drifts with
temperature and drive level. Air never saturates; iron never stops being a
compromise. High-current filter inductors split the difference with a
deliberate **air gap** in the core, trading some μr for a saturation ceiling
set by geometry instead of by the material.

## 3.3 The magnetic circuit: reluctance and what a gap does

Flux problems obey an Ohm's-law analogy of their own: magnetomotive force
F = N·I drives flux Φ through **reluctance** R = l/(μ₀·μr·A), and series
reluctances add.

Given: the toroid family above — path 0.2 m, μr = 1500, A = 4 cm², 200 turns
at 0.5 A — now with a 1 mm air gap cut into the core.

- R_core = 0.2 / (μ₀ × 1500 × 4×10⁻⁴) = 2.65×10⁵ A·t/Wb
- R_gap = 0.001 / (μ₀ × 4×10⁻⁴) = 1.99×10⁶ A·t/Wb

One millimetre of air carries **7.5 times** the reluctance of the entire
20 cm iron path, because the gap's μr is 1. The flux:

Φ = N·I / (R_core + R_gap) = 100 / 2.26×10⁶ = 4.4×10⁻⁵ Wb → B = Φ/A = **0.11 T**

Without the gap this excitation produced 0.94 T. The gap cost a factor of 8.5
in flux — and that is exactly its job: the gap now DOMINATES the circuit, so
the inductance depends on a machined air spacing rather than on the core's
temperamental μr, and the core no longer saturates at working current. The
electrical analogy is a large stable resistor swamping a drifting small one.

| Magnetic quantity | Electrical analogue | Formula |
|---|---|---|
| mmf F = N·I (A·t) | EMF (V) | source |
| Flux Φ (Wb) | current (A) | what flows |
| Reluctance R (A·t/Wb) | resistance (Ω) | l/(μ₀μrA) |
| Series gaps and cores | series resistors | reluctances add |`,
      examTip: 'Attach each loop landmark to its axis: remanence Br lives on the B-axis (H = 0), coercivity Hc on the H-axis (B = 0). Exam figures ask you to point at them, and swapping the two axes intercepts is the standard wrong answer.',
    },
    {
      id: 'mag-loss-worked',
      title: '4. Core Loss in Numbers',
      content: `## 4.1 Hysteresis loss from loop area

The loop area is energy per cycle per cubic metre, so power is area × frequency
× volume.

Given: a 60 Hz transformer core of volume 5×10⁻⁴ m³ whose material traces a
loop of area 250 J/m³ at the working flux density.

P_h = 250 × 60 × 5×10⁻⁴ = **7.5 W**

Every term is legible: run the same core at 400 Hz (aircraft power) and
hysteresis loss scales by 400/60 = 6.7× — before eddy currents are even
considered. In practice the loop area itself grows with peak flux density; the
empirical **Steinmetz relation** P_h ∝ f·B^n with n ≈ 1.6–2 captures that, and
its exponent is fitted to measurements, not derived.

## 4.2 Eddy loss and the two quadratic levers

P_e ∝ B²·f²·t²/ρ gives the designer two squared levers: frequency (fixed by
the application) and lamination thickness t (the designer's choice). Halving t
cuts eddy loss to a QUARTER; that is why 50/60 Hz cores are stacks of
0.3-mm-class insulated sheets rather than solid iron, and why the sheets are
silicon steel — the alloying raises resistivity ρ, which sits in the
denominator doing the same job resistively that lamination does geometrically.

![Hysteresis and eddy-current loss components against frequency on logarithmic axes, computed from their stated proportionalities with constants set equal at one kilohertz. Below the crossover the linear hysteresis term dominates the total; above it the frequency-squared eddy term takes over.](/courses/fe-ee/figures/mat-core-loss.svg)

The crossover in the figure is the design boundary made visible: at mains
frequency, laminated steel's eddy problem is tamed and its high Bs (≈ 2 T) wins.
At tens of kilohertz the f² term makes ANY good conductor hopeless, and design
moves to ferrites — ceramic ferrimagnets with resistivity of order 1 Ω·m
against steel's 5×10⁻⁷ Ω·m, so nearly no eddy path at all. Ferrite's price is a
lower Bs (≈ 0.4–0.5 T) and modest μr, which smaller high-frequency cores can
afford.

| Frequency regime | Core choice | Why it wins |
|---|---|---|
| 50/60–400 Hz | laminated silicon steel | high Bs; lamination controls f² term |
| 1–20 kHz | thin laminations, powdered iron | thinner t chases the f² term |
| 20 kHz–1 MHz | MnZn / NiZn ferrite | resistivity kills eddy currents outright |

## 4.3 Both losses at once

Given: a core dissipates 4 W of hysteresis and 2 W of eddy loss at 60 Hz. The
same core, same peak flux, at 120 Hz:

P = 4 × (120/60) + 2 × (120/60)² = 8 + 8 = **16 W**

Doubling frequency ROUGHLY doubled one loss and exactly quadrupled the other —
separate scalings, applied separately, then summed. Items that ask for a single
combined scaling factor are testing whether you keep the two mechanisms apart.

## 4.4 The thermal ceiling: Curie temperature in practice

Core loss is heat, and heat walks the core toward its **Curie temperature** —
the point where thermal agitation defeats the exchange alignment and the
material drops to paramagnetic behaviour, μr collapsing toward 1. For iron that
is 770 °C, far above any sane operating point; but for MnZn ferrites Tc can be
as low as 120–200 °C, uncomfortably close to a hot switching supply. Worse, a
ferrite's losses often RISE as it approaches Tc, so an overheating core loses
permeability, ripples more, dissipates more, and runs away thermally. The
design rule that follows: ferrite core temperature limits come from Tc margins
and the loss-versus-temperature curve, not merely from wire insulation ratings.
Unlike saturation, which reverses the instant the current drops, a core pushed
past Tc recovers its magnetism only on cooling — the loss of μr is total while
it lasts.`,
      examTip: 'Frequency-scaling questions hand you the split between hysteresis and eddy loss for a reason: scale the first by f and the second by f², never the total by either. The one-mechanism-only answers are both on the option list.',
    },
    {
      id: 'mag-set',
      title: '5. Problem Set and Recurring Errors',
      content: `## 5.1 From winding current to flux density

Given: 200 turns on a core of magnetic path length 0.2 m carrying 0.5 A, core
μr = 1500.

Relation: H = N·I / l, then B = μ₀·μr·H.

H = 200 × 0.5 / 0.2 = **500 A/m**

B = (4π×10⁻⁷)(1500)(500) = **0.94 T**

Sanity check against saturation: 0.94 T is comfortable for silicon steel
(Bs ≈ 2 T) and already past saturation for most ferrites (Bs ≈ 0.5 T) — the
same excitation is fine in one material and useless in another, which is
exactly the kind of cross-check the exam rewards.

## 5.2 Flux through the core

With cross-section A = 4 cm²: Φ = B·A = 0.94 × 4×10⁻⁴ = **3.8×10⁻⁴ Wb**.
B is a density (Wb/m² = T); Φ is the total (Wb). Keeping the two straight is
worth a point on most magnetics items.

## 5.3 Hysteresis power, backwards

Given: a 50 Hz core of volume 2×10⁻³ m³ must dissipate no more than 18 W of
hysteresis loss. Maximum allowable loop area:

area = P / (f × V) = 18 / (50 × 2×10⁻³) = **180 J/m³**

The same relation solved for a different unknown — reading which variable is
requested before substituting saves the resolve-and-rearrange minute.

## 5.4 Where marks are lost

| Error | What it looks like | The fix |
|---|---|---|
| B and H interchanged | tesla assigned to N·I/l | H in A/m from the winding; B in T from the material response |
| μr added instead of multiplied | B = μ₀(1500 + 500) nonsense | B = μ₀ × μr × H, all factors |
| Loop area units dropped | J/m³ treated as watts | multiply by frequency AND volume for power |
| Soft/hard classes reversed | NdFeB proposed for a transformer core | small Hc cycles cheaply; large Hc stores permanently |
| Curie behaviour misread | expecting magnetism to survive any temperature | above Tc the material is paramagnetic and the magnet is gone |
| Eddy scaling applied to hysteresis | quadrupling both losses at double f | only the eddy term carries f² |`,
      examTip: 'μ₀ = 4π×10⁻⁷ H/m is one of the few constants worth having at your fingertips: with H = NI/l and B = μ₀μrH you can move from winding drawing to flux density in two lines, and most magnetic-materials items are exactly that trip.',
    },
  ],
  keyTakeaways: [
    'Permeability μ = μ₀·μr; ferromagnetic materials have μr >> 1.',
    'Hysteresis loop area = energy loss per cycle; soft materials minimize this loss.',
    'Eddy current loss ∝ B²·f²·t²; lamination reduces eddy currents.',
    'Curie temperature: ferromagnetic → paramagnetic transition.',
    'Soft magnets for transformers/motors; hard magnets for permanent magnets.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 5 — ENGINEERING SCIENCES  (3 curriculum IDs)  ·  3–5 %
 * ══════════════════════════════════════════════════════════════════ */

};
