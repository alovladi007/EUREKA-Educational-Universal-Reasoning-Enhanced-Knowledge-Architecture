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
| Conductors | $\\sim 10^{-8}\\ \\Omega \\cdot m$ | Copper (1.7×10⁻⁸), Aluminum (2.8×10⁻⁸) |
| Semiconductors | $10^{-4}\\ \\text{to}\\ 10^{4}\\ \\Omega \\cdot m$ | Silicon, Germanium |
| Insulators | $10^{8}\\ \\text{to}\\ 10^{20}\\ \\Omega \\cdot m$ | Glass, Rubber, Teflon |

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
    {
      id: 'cond-drift',
      title: '6. The Drift Model: Where Ohm\'s Law Comes From',
      content: `## 6.1 The constants this chapter uses, named once

Numbers in this chapter come from two places and nowhere else: exact SI
constants, and tabulated material values that are named where they are used.
The constants are the elementary charge $q = 1.602176634 \\times 10^{-19}$ C and
the Boltzmann constant $k = 1.380649 \\times 10^{-23}$ J/K, both exact by the
2019 SI definitions, together with the Avogadro constant
$N_A = 6.02214076 \\times 10^{23}$ per mole and the magnetic constant
$\\mu_0 = 4\\pi \\times 10^{-7}$ H/m. For copper the tabulated values are the
IACS annealed-copper resistivity $\\rho_{20} = 1.724 \\times 10^{-8}$ Ω·m at
20 °C, the mass density 8960 kg/m³, the molar mass 63.546 g/mol, the specific
heat 385 J/(kg·K) and the temperature coefficient 0.00393 per °C referenced to
20 °C. Sections 1 to 5 above rounded that resistivity to
$1.7 \\times 10^{-8}$ Ω·m; the two differ by 1.4%, which is far below the
spacing of any FE answer set, but the unrounded figure is what reproduces the
wire tables and it is what the rest of this chapter uses.

## 6.2 How many carriers are actually in there

Ohm's law is not a law of nature so much as a consequence of a crowd of charges
being nudged along by a field while colliding constantly with the lattice. To
price that picture we first need to know how crowded the crowd is. Copper
contributes one loosely held outer electron per atom, so the free-electron
density is the atomic density:

$$n = \\frac{\\rho_m N_A z}{M}$$

with $\\rho_m$ the mass density, $M$ the molar mass and $z$ the number of free
electrons contributed per atom. Check the units before substituting anything:
$\\mathrm{(g/m^3)(mol^{-1})/(g\\,mol^{-1})} = \\mathrm{m^{-3}}$, which is a
number per unit volume, as required. Substituting copper's tabulated values,
with the density written in grams so it cancels against the molar mass:

$$n = \\frac{(8.960 \\times 10^{6}\\ \\mathrm{g/m^3})(6.02214076 \\times 10^{23}\\ \\mathrm{mol^{-1}})}{63.546\\ \\mathrm{g/mol}} = 8.4912 \\times 10^{28}\\ \\mathrm{m^{-3}}$$

Eighty-five thousand million million million million free electrons per cubic
metre. It is worth pausing on that number, because it is the reason metals
conduct at all and the reason their conductivity barely depends on temperature
compared with a semiconductor's: the carrier population is fixed by chemistry,
not by thermal excitation, so heating a metal cannot create more carriers. It
can only make the existing ones collide more often.

The combination that appears in every drift calculation is the free-charge
density $nq$:

$$nq = (8.4912 \\times 10^{28}\\ \\mathrm{m^{-3}})(1.602176634 \\times 10^{-19}\\ \\mathrm{C}) = 1.3604 \\times 10^{10}\\ \\mathrm{C/m^3}$$

Thirteen and a half gigacoulombs of mobile charge in every cubic metre of
copper, held in place by an equal and opposite charge on the ion cores.

### Worked example 6.1 — how fast do the electrons actually move?

Given: 20 A flowing in AWG 12 copper, whose diameter follows from the gauge
definition (36 AWG is 0.005 in and 4/0 is 0.460 in, with 39 equal geometric
steps between, so $d = 0.127 \\times 92^{(36-n)/39}$ mm) as $d = 2.0525$ mm.

Relation: current density and drift velocity,

$$J = \\frac{I}{A}, \\qquad v_d = \\frac{J}{nq} = \\frac{I}{nqA}$$

Dimensional check on the second form: amperes divided by (coulombs per cubic
metre times square metres) is (C/s)/(C/m) = m/s, a velocity. Good.

Substitution. The area is $A = \\pi d^2/4 = 3.309\\ \\mathrm{mm^2} = 3.3088 \\times 10^{-6}$ m², so

$$J = \\frac{20\\ \\mathrm{A}}{3.3088 \\times 10^{-6}\\ \\mathrm{m^2}} = 6.0445 \\times 10^{6}\\ \\mathrm{A/m^2}$$

$$v_d = \\frac{6.0445 \\times 10^{6}\\ \\mathrm{A/m^2}}{1.3604 \\times 10^{10}\\ \\mathrm{C/m^3}} = 4.443 \\times 10^{-4}\\ \\mathrm{m/s} = 0.4443\\ \\mathrm{mm/s}$$

Independent route: compute $v_d = I/(nqA)$ in one step without forming $J$, and
the same 0.444 mm/s falls out, which confirms no factor of area went astray.

At 0.444 mm per second an electron needs $10 / (4.443 \\times 10^{-4}) = 22{,}507$
seconds, or 6.25 hours, to travel ten metres of cable. The lamp at the far end
lights in nanoseconds. Nothing is contradictory here: the field that pushes the
electrons propagates through the space around the conductor at a large fraction
of the speed of light, so every electron along the whole run starts moving
essentially at once. The charge that arrives at the lamp was already sitting in
the lamp's own leads.

![Electron drift velocity against conductor current for three copper sizes, computed from v equals I divided by n q A with the free-electron density eight point four nine times ten to the twenty-eight per cubic metre. Twenty amps in AWG 12 gives four tenths of a millimetre per second, and two hundred amps in a 4/0 conductor gives less still, because the larger area more than compensates for the larger current.](/courses/fe-ee/figures/mat2-drift-velocity.svg)

Notice what the figure says about size: 200 A in a 4/0 conductor drifts at
0.137 mm/s, slower than 20 A in AWG 12, because 4/0 has 32 times the area for
ten times the current. Drift velocity is a statement about current DENSITY, not
current.

## 6.3 Mobility, collisions, and the origin of resistance

Between collisions an electron accelerates freely under the field. The average
velocity it accumulates is proportional to the field, and the constant of
proportionality is the **mobility**:

$$v_d = \\mu E$$

Mobility carries units of m²/(V·s): velocity per unit field, or
$\\mathrm{(m/s)/(V/m)}$, which simplifies exactly to m²/(V·s). In the Drude
picture the electron is accelerated for a mean free time $\\tau$ before a
collision randomises its momentum, so

$$\\mu = \\frac{q\\tau}{m}$$

Substituting $v_d = \\mu E$ into $J = nqv_d$ gives the microscopic form of Ohm's
law directly:

$$J = nq\\mu E = \\sigma E, \\qquad \\sigma = nq\\mu$$

That is the whole derivation. Conductivity is carrier density times charge
times mobility, and NOTHING else. Every material in this section differs from
every other only in those three factors.

### Worked example 6.2 — copper's mobility, collision time and mean free path

Given: $\\rho_{20} = 1.724 \\times 10^{-8}$ Ω·m and $n = 8.49 \\times 10^{28}$ m⁻³
from above, plus the electron mass $m = 9.1093837015 \\times 10^{-31}$ kg and
copper's tabulated Fermi velocity $v_F = 1.57 \\times 10^{6}$ m/s.

Relation: $\\sigma = nq\\mu$ rearranged, then $\\mu = q\\tau/m$ rearranged again.

$$\\sigma = \\frac{1}{1.724 \\times 10^{-8}\\ \\Omega \\cdot m} = 5.8005 \\times 10^{7}\\ \\mathrm{S/m}$$

$$\\mu = \\frac{\\sigma}{nq} = \\frac{5.8005 \\times 10^{7}\\ \\mathrm{S/m}}{1.3604 \\times 10^{10}\\ \\mathrm{C/m^3}} = 4.264 \\times 10^{-3}\\ \\mathrm{m^2/(V \\cdot s)}$$

which is 42.6 cm²/(V·s) in the units semiconductor work prefers — a number
worth remembering, because silicon's electron mobility of 1350 cm²/(V·s) is
THIRTY TIMES LARGER. Metals do not conduct better than semiconductors because
their carriers are more mobile. They conduct better because they have
millions of times more of them.

$$\\tau = \\frac{m\\mu}{q} = \\frac{(9.109 \\times 10^{-31}\\ \\mathrm{kg})(4.264 \\times 10^{-3}\\ \\mathrm{m^2/(V \\cdot s)})}{1.602 \\times 10^{-19}\\ \\mathrm{C}} = 2.424 \\times 10^{-14}\\ \\mathrm{s}$$

Twenty-four femtoseconds between collisions. Multiplying by the Fermi velocity
gives the distance covered in that time:

$$\\lambda = v_F \\tau = (1.57 \\times 10^{6}\\ \\mathrm{m/s})(2.424 \\times 10^{-14}\\ \\mathrm{s}) = 3.81 \\times 10^{-8}\\ \\mathrm{m} = 38\\ \\mathrm{nm}$$

Thirty-eight nanometres, roughly 150 atomic spacings. This number has become
practical rather than academic: interconnects in modern integrated circuits are
narrower than 38 nm, so the wire walls themselves start scattering electrons
and the effective resistivity of on-chip copper rises above the bulk value. The
Drude model, a century old, predicts where that begins.

## 6.4 From the microscopic law to the one on the formula sheet

Take a uniform bar of length $L$ and area $A$ carrying a uniform current. The
field inside is $E = V/L$ and the current density is $J = I/A$. Substituting
both into $J = \\sigma E$:

$$\\frac{I}{A} = \\sigma \\frac{V}{L} \\quad \\Longrightarrow \\quad V = \\frac{L}{\\sigma A} I$$

Comparing with $V = IR$ identifies the resistance, and with $\\rho = 1/\\sigma$:

$$R = \\frac{L}{\\sigma A} = \\frac{\\rho L}{A}$$

The geometry formula from section 1 is therefore not an independent fact. It is
$J = \\sigma E$ specialised to a uniform bar, and every one of its features
follows: resistance rises with length because the same field must be maintained
over more metres, and falls with area because more parallel paths share the
current. It also tells you exactly when the formula stops working, namely when
the current is NOT uniform across the section — which is precisely the skin
effect of section 9.

### Worked example 6.3 — the field inside a working conductor

Given: the same 100 m AWG 12 run at 20 A, at 20 °C.

Relation: $E = \\rho J$, the point form of Ohm's law, with $J$ from worked
example 6.1.

$$E = (1.724 \\times 10^{-8}\\ \\Omega \\cdot m)(6.045 \\times 10^{6}\\ \\mathrm{A/m^2}) = 0.1042\\ \\mathrm{V/m}$$

Over 100 m that is a drop of 10.42 V. Independent route, through the lumped
formula: the per-metre resistance is
$R' = \\rho/A = 1.724 \\times 10^{-8}/3.3088 \\times 10^{-6} = 5.210$ mΩ/m, so
$R = 0.5210$ Ω and $V = 20 \\times 0.5210 = 10.42$ V. The two agree to four
figures, and the 5.21 mΩ/m also matches the wire table in section 2, which is a
third check on the same physics.

The dissipation follows: $P = I^2 R = 400 \\times 0.5210 = 208.4$ W, or 2.08 W
for every metre of cable. That is why 20 A on AWG 12 is a household limit and
not a comfortable one.

## 6.5 Why the light comes on immediately

Students often meet the 0.444 mm/s result as a paradox. It is not one, and the
resolution is worth stating precisely because the FE likes conceptual items
here. Energy does not travel inside the conductor with the electrons; it
travels in the electromagnetic field in the space AROUND the conductor, at
$c/\\sqrt{\\varepsilon_r}$ for the surrounding insulation — typically 60 to 70%
of the speed of light in a cable. The conductor's role is to guide that field
and to define where the current flows. What arrives at the far end in
nanoseconds is the field; what moves at a fraction of a millimetre per second
is the charge; and what dissipates in the copper is the tiny fraction of the
energy flow that leaks into the metal because the metal is not perfect.

| Quantity in a working copper conductor | Symbol | Typical magnitude | Set by |
|---|---|---|---|
| Free-electron density | n | 8.49e28 per m³ | chemistry, not temperature |
| Free-charge density | nq | 1.36e10 C/m³ | n and q |
| Drift velocity at 20 A in AWG 12 | v_d | 0.444 mm/s | current density |
| Mobility | mu | 4.26e-3 m²/(V·s) | scattering |
| Mean free time | tau | 24 fs | lattice vibration and defects |
| Mean free path | lambda | 38 nm | tau and Fermi velocity |
| Internal field at 20 A in AWG 12 | E | 0.104 V/m | rho times J |
| Signal propagation speed | v_p | about 2e8 m/s | the surrounding dielectric |`,
      examTip: 'Every conductivity question in this section reduces to sigma = n q mu. When an item asks why a metal conducts better than a doped semiconductor, the credited answer is carrier DENSITY, not mobility — copper is thirty times LESS mobile than silicon and still conducts a million times better.',
      importantNote: 'Drift velocity and signal speed are different quantities with different mechanisms, and an exam item that gives you a wire length and asks "how long before the far end sees current" is testing whether you know that. Charge crawls at millimetres per second; the field that carries the energy travels at roughly two thirds the speed of light in the cable dielectric.',
    },
    {
      id: 'cond-materials',
      title: '7. Conductivity, Resistivity, and Choosing a Metal',
      content: `## 7.1 Two names for one property

Conductivity and resistivity are reciprocals, $\\sigma = 1/\\rho$, and the only
reason both survive is that each makes a different calculation easy.
Conductivity adds when conductors sit in parallel, because parallel paths share
a common field; resistivity adds when they sit in series along a common
current. Composite conductors — a steel-cored aluminium transmission line, a
copper-clad steel wire, a tinned copper braid — are parallel problems, so they
are conductivity problems:

$$\\sigma_{eff} A_{total} = \\sum_i \\sigma_i A_i$$

Units: siemens per metre times square metres gives siemens·metre, which is the
reciprocal of ohms per metre — a per-unit-length conductance, exactly what a
composite conductor's rating is.

## 7.2 The real numbers, and the IACS convention

The trade quotes conductor metals against a standard rather than in SI units.
The International Annealed Copper Standard fixes 100% IACS as
$\\rho = 1.7241 \\times 10^{-8}$ Ω·m at 20 °C, so a material's percentage
conductivity is

$$\\%\\,\\mathrm{IACS} = \\frac{1.7241 \\times 10^{-8}\\ \\Omega \\cdot m}{\\rho} \\times 100$$

Silver beats the standard and comes in above 100%, which is not a mistake — the
standard is copper, not the best possible metal. The table below is computed
from that one relation and tabulated room-temperature resistivities and
densities; every percentage in it is the formula above applied to the
resistivity in the same row.

| Material at 20 °C | rho (1e-8 ohm·m) | sigma (1e7 S/m) | percent IACS | density (kg/m³) | alpha (per °C) |
|---|---|---|---|---|---|
| Silver | 1.59 | 6.29 | 108.4 | 10490 | 0.00380 |
| Copper, annealed | 1.724 | 5.80 | 100.0 | 8960 | 0.00393 |
| Gold | 2.44 | 4.10 | 70.7 | 19300 | 0.00340 |
| Aluminium, EC grade | 2.83 | 3.53 | 60.9 | 2700 | 0.00403 |
| Tungsten | 5.6 | 1.79 | 30.8 | 19300 | 0.00450 |
| Iron | 9.7 | 1.03 | 17.8 | 7870 | 0.00500 |
| Constantan (55Cu-45Ni) | 49 | 0.204 | 3.52 | 8900 | 0.00002 |
| Nichrome (80Ni-20Cr) | 110 | 0.0909 | 1.57 | 8400 | 0.00040 |

Two entries in that table are not conductors at all in intent. Constantan and
nichrome are chosen for the OPPOSITE property: high resistivity so a short
length gives useful resistance, and a temperature coefficient near zero so the
resistance does not wander as the part heats. Constantan's coefficient is two
hundred times smaller than copper's, which is why precision shunts and strain
gauges are made from it and why the FE asks about it.

## 7.3 Copper against aluminium, decided properly

Copper wins on resistivity by a factor of $2.83/1.724 = 1.64$. Aluminium wins
on density by a factor of $8960/2700 = 3.32$. The engineering question is which
factor governs, and the answer depends on what is scarce.

If the constraint is SPACE — a slot in a motor, a conduit fill, a busbar
enclosure — resistivity governs and copper wins outright, because for a fixed
cross-section copper simply has less resistance. If the constraint is MASS or
COST — an overhead line hanging between towers — the relevant figure of merit
is conductivity per unit mass:

$$\\frac{\\sigma}{\\rho_m} = \\frac{1}{\\rho \\rho_m}$$

Units: (S/m)/(kg/m³) = S·m²/kg. For copper that is
$1/(1.724 \\times 10^{-8} \\times 8960) = 6474$ S·m²/kg; for EC aluminium it is
$1/(2.83 \\times 10^{-8} \\times 2700) = 13087$ S·m²/kg. Aluminium is 2.02 times
better per kilogram, and that ratio — not the resistivity ratio — is why the grid is
aluminium.

### Worked example 7.1 — swapping copper for aluminium at equal resistance

Given: a 4/0 AWG copper conductor, area 107.22 mm², is to be replaced by an EC
aluminium conductor of the same resistance per metre. Find the aluminium area
and compare the masses.

Relation: equal $R' = \\rho/A$ requires $A_{Al}/A_{Cu} = \\rho_{Al}/\\rho_{Cu}$,
and mass per metre is $\\rho_m A$.

$$A_{Al} = A_{Cu}\\frac{\\rho_{Al}}{\\rho_{Cu}} = 107.22 \\times \\frac{2.83}{1.724} = 176.0\\ \\mathrm{mm^2}$$

$$\\frac{m_{Al}}{m_{Cu}} = \\frac{A_{Al}\\rho_{m,Al}}{A_{Cu}\\rho_{m,Cu}} = \\frac{176.0 \\times 2700}{107.22 \\times 8960} = 0.495$$

The aluminium conductor is 64% fatter and 50.5% lighter. Independent route: the
mass ratio must equal the reciprocal of the conductivity-per-mass ratio, and
$1/2.0216 = 0.495$ — the same number by a completely different argument, which
confirms the areas were scaled the right way round. Checking the direction
matters here, because inverting the resistivity ratio gives 0.61 and a mass
ratio of 0.18, and 0.18 is a plausible-looking wrong answer.

The costs of that choice are real: aluminium creeps under bolt pressure, forms
a stubborn insulating oxide, and expands 35% more per kelvin than copper, so
aluminium terminations need rated connectors, an oxide-penetrating compound and
Belleville washers. Aluminium is the right conductor and the wrong contact.

### Worked example 7.2 — a composite conductor

Given: a conductor of total area 100 mm² made of 60 mm² of EC aluminium around
a 40 mm² steel core, with steel resistivity $1.6 \\times 10^{-7}$ Ω·m. Find the
effective resistivity.

Relation: parallel conductances add, so
$1/R' = \\sigma_{Al}A_{Al} + \\sigma_{St}A_{St}$ and
$\\rho_{eff} = A_{total}/(\\sigma_{Al}A_{Al} + \\sigma_{St}A_{St})$.

$$\\sigma_{Al}A_{Al} = (3.53 \\times 10^{7})(60 \\times 10^{-6}) = 2118\\ \\mathrm{S \\cdot m}$$

$$\\sigma_{St}A_{St} = (6.25 \\times 10^{6})(40 \\times 10^{-6}) = 250\\ \\mathrm{S \\cdot m}$$

$$\\rho_{eff} = \\frac{100 \\times 10^{-6}}{2118 + 250} = 4.22 \\times 10^{-8}\\ \\Omega \\cdot m$$

The steel occupies 40% of the section and carries
$250/(2118+250) = 10.6\\%$ of the current. That is the point of steel-reinforced
aluminium conductor: the steel is there for tensile strength, contributes a
tenth of the conduction almost incidentally, and the effective resistivity sits
at 1.49 times pure aluminium's rather than at aluminium's own value. An exam
item that averages the two resistivities arithmetically gets
$(2.83 + 16)/2 = 9.4 \\times 10^{-8}$, which is more than double the truth,
because resistivities in PARALLEL do not average — conductances add.

## 7.4 What actually sets a metal's resistivity

Matthiessen's rule says the scattering mechanisms add independently in the
resistivity, not in the conductivity:

$$\\rho(T) = \\rho_{thermal}(T) + \\rho_{residual}$$

The thermal term comes from lattice vibrations and vanishes as the metal
approaches absolute zero; the residual term comes from impurities, alloying
elements, grain boundaries and cold work, and does not. This single equation
explains most of the table above. Alloys are resistive because every foreign
atom is a permanent scattering site: copper with a few percent of nickel loses
most of its conductivity, and 80Ni-20Cr nichrome is 64 times more resistive
than copper for exactly that reason. It also explains why hard-drawn copper
(97.5% IACS, $\\rho = 1.768 \\times 10^{-8}$ Ω·m) conducts slightly worse than
annealed copper: the drawing process leaves dislocations behind, annealing
removes them, and the residual term falls back.

The ratio of the room-temperature resistivity to the residual value is the
**residual resistance ratio**, and it is the standard purity metric for
cryogenic conductors:

$$\\mathrm{RRR} = \\frac{\\rho(273\\ \\mathrm{K})}{\\rho(4.2\\ \\mathrm{K})}$$

Commercial copper has an RRR near 100; the copper stabiliser wrapped around
superconducting magnet wire is specified at several hundred, because its whole
job is to carry the current for the fraction of a second after a quench.

| Effect on resistivity | Mechanism | Reversible? | Typical size |
|---|---|---|---|
| Heating | more lattice vibration | yes | +0.4% per °C for copper |
| Alloying | permanent scattering sites | no | up to 60x for nichrome |
| Cold working | dislocations | yes, by annealing | +2.6% for hard-drawn copper |
| Cooling toward 0 K | thermal term vanishes | yes | down to the residual floor |
| Very thin films | surface and grain scattering | no | rises below about 40 nm |`,
      examTip: 'Percent IACS is a conductivity, so it goes DOWN as resistivity goes up, and 108% IACS for silver is correct rather than an error. When comparing conductors for an overhead line the figure of merit is conductivity per unit mass and aluminium wins by about two to one; for a fixed cross-section copper wins by 1.64 to one. Read which constraint the question imposes.',
    },
    {
      id: 'cond-tempco',
      title: '8. Temperature Coefficient: Model, Limits, and Hot Conductors',
      content: `## 8.1 The linear law and the ratio law are the same law

Every FE temperature problem starts from

$$R(T) = R_{ref}\\left[1 + \\alpha_{ref}(T - T_{ref})\\right]$$

where the subscript matters more than anything else in the equation: both the
resistance and the coefficient belong to the SAME reference temperature.
Factoring $\\alpha$ out of the bracket rewrites it in a form that hides the
reference entirely:

$$R(T) = R_{ref}\\,\\alpha_{ref}\\left[\\frac{1}{\\alpha_{ref}} + T - T_{ref}\\right] = R_{ref}\\,\\alpha_{ref}\\left[T - T_{\\infty}\\right]$$

with the **inferred zero**

$$T_{\\infty} = T_{ref} - \\frac{1}{\\alpha_{ref}}$$

Because $R$ is now proportional to $(T - T_{\\infty})$, any two temperatures are
related by a pure ratio with no reference resistance in sight:

$$\\frac{R_2}{R_1} = \\frac{T_2 - T_{\\infty}}{T_1 - T_{\\infty}}$$

For copper, $T_{\\infty} = 20 - 1/0.00393 = -234.45$ °C, which is where the
familiar form $R_2/R_1 = (234.45 + T_2)/(234.45 + T_1)$ comes from. Aluminium's
is $20 - 1/0.00403 = -228.14$ °C, silver's is $-243.16$ °C, tungsten's is
$-202.22$ °C. Committing copper's 234.5 to memory removes the reference-
temperature trap entirely, because the ratio law does not care what temperature
the coefficient was quoted at.

![Resistance as a fraction of its twenty-degree value against temperature for copper and for two resistance alloys, all three computed from the same linear law with their tabulated coefficients. Copper's line is steep and extrapolates to zero at minus two hundred thirty-four and a half degrees Celsius, while nichrome moves nine percent and constantan half a percent over the same two-hundred-thirty-degree span.](/courses/fe-ee/figures/mat2-tempco-metals.svg)

The figure draws the inferred zero explicitly, and the label on it is the point:
the straight line reaches zero at $-234.45$ °C, which is 38.7 K, and copper
absolutely does not lose its resistance there. The intercept is an artefact of
extrapolating a straight line far past its validity, and it is useful precisely
because it is an artefact — it packages the coefficient into a single constant.

## 8.2 Where the straight line stops being true

The linear model earns its keep between roughly $-50$ °C and $+200$ °C for the
common conductor metals, and the reason is Matthiessen's rule from section 7.
At ordinary temperatures the thermal term dominates and happens to be very
nearly proportional to absolute temperature, which is what makes the law
linear. Below about 50 K the thermal term collapses toward zero and the
residual impurity term takes over, so the curve flattens onto a floor instead
of continuing to the inferred zero. Far above room temperature the coefficient
itself drifts, and near a phase change all bets are off. Three regimes, then:

$$\\rho \\approx \\rho_{residual} \\quad (T \\ll 50\\ \\mathrm{K}), \\qquad \\rho \\propto T \\quad (\\mathrm{ordinary}), \\qquad \\mathrm{nonlinear} \\quad (\\mathrm{very\\ hot})$$

Semiconductors break the model in the other direction and for a different
reason. In a metal, heating adds scattering to a fixed carrier population, so
resistance rises. In a semiconductor, heating adds carriers exponentially,
which overwhelms the extra scattering, so resistance falls — the negative
coefficient of section 3.3 and the thermistor. The signs differ because the
mechanisms differ, not because the materials are arbitrary.

### Worked example 8.1 — winding temperature from a resistance measurement

Given: a motor winding reads 2.400 Ω at an ambient of 22 °C before the run and
3.010 Ω immediately after shutdown. Copper, $T_{\\infty} = -234.45$ °C. Find the
mean winding temperature and the rise.

Relation: the ratio law solved for $T_2$,

$$T_2 = \\frac{R_2}{R_1}\\left(T_1 - T_{\\infty}\\right) + T_{\\infty}$$

$$T_2 = \\frac{3.010}{2.400}(22 + 234.45) - 234.45 = 1.254167 \\times 256.45 - 234.45 = 321.63 - 234.45 = 87.18\\ ^{\\circ}\\mathrm{C}$$

so the rise is 65.18 K above the 22 °C ambient. Independent route through the
linear form: the coefficient referenced to 22 °C is
$\\alpha_{22} = 1/256.45 = 0.0038994$ per °C, and

$$\\Delta T = \\frac{R_2/R_1 - 1}{\\alpha_{22}} = \\frac{0.254167}{0.0038994} = 65.18\\ \\mathrm{K}$$

The two agree exactly, as they must, because they are algebraic rearrangements
of one another. Note that the answer is a MEAN temperature over the whole
winding — the hot spot is warmer, typically by 10 to 15 K, which is why
insulation classes are specified with a hot-spot allowance on top of the
measured rise.

### Worked example 8.2 — the wrong-baseline trap, and what it costs

Given: a copper element measures 1.500 Ω at 40 °C. Its coefficient is quoted as
$\\alpha_{20} = 0.00393$ per °C. Find the resistance at 100 °C.

The trap: applying the coefficient directly to the 40 °C measurement gives

$$R_{100} \\stackrel{?}{=} 1.500\\left[1 + 0.00393(100 - 40)\\right] = 1.500 \\times 1.2358 = 1.8537\\ \\Omega$$

which is wrong, because $\\alpha_{20}$ multiplies a resistance referenced to
20 °C and 1.500 Ω is not that resistance. Correct route, in two steps:

$$R_{20} = \\frac{1.500}{1 + 0.00393(40 - 20)} = \\frac{1.500}{1.0786} = 1.39069\\ \\Omega$$

$$R_{100} = 1.39069\\left[1 + 0.00393(100 - 20)\\right] = 1.39069 \\times 1.3144 = 1.8279\\ \\Omega$$

Independent route, straight through the ratio law with no reference at all:

$$R_{100} = 1.500 \\times \\frac{234.45 + 100}{234.45 + 40} = 1.500 \\times \\frac{334.45}{274.45} = 1.8279\\ \\Omega$$

Both correct routes give 1.828 Ω; the trap gives 1.854 Ω, which is 1.4% high.
That is small enough to look right and large enough to be a distractor, and it
is the single most common error in this part of the exam. The ratio law is
immune to it, which is the best reason to use the ratio law.

### Worked example 8.3 — a hot conductor's extra loss

Given: the 100 m AWG 12 run from worked example 6.3, resistance 0.5210 Ω at
20 °C, carrying 20 A, now sitting in a cable tray at 75 °C.

Relation: scale the resistance, then square the current.

$$R_{75} = 0.5210\\left[1 + 0.00393 \\times 55\\right] = 0.5210 \\times 1.21615 = 0.6336\\ \\Omega$$

$$P_{75} = I^2R_{75} = 400 \\times 0.6336 = 253.4\\ \\mathrm{W}$$

against 208.4 W at 20 °C — 21.6% more heat for the same current, purely from
the temperature. Independent route through the ratio law:
$R_{75}/R_{20} = (234.45+75)/(234.45+20) = 309.45/254.45 = 1.2162$, matching the
linear factor 1.21615 to five figures.

This is why the loop matters. More heat raises the temperature, which raises
the resistance, which produces more heat. In a conductor the loop converges
because the heat removal also grows with temperature, but it converges at a
higher temperature than a cold-resistance calculation predicts. Cable ampacity
tables are computed at the conductor's rated temperature for exactly this
reason, and a designer who uses 20 °C resistance to check voltage drop on a
fully loaded feeder underestimates it by about a fifth.

## 8.3 The same physics as an instrument

Because $\\alpha$ is stable and reproducible, a conductor is a thermometer.
Platinum is the standard choice: its tabulated coefficient of 0.00385 per °C
(the IEC 60751 value for industrial sensors) gives the Pt100, a 100.00 Ω
element at 0 °C whose resistance at 100 °C is

$$R_{100} = 100.00\\left[1 + 0.00385 \\times 100\\right] = 138.5\\ \\Omega$$

That 38.5 Ω of span over 100 K is only 0.385 Ω per kelvin, so a Pt100 must be
read with a three- or four-wire connection: two metres of copper lead at
5.21 mΩ/m contributes about 21 mΩ of series error, which is 54 mK of apparent
temperature error. Small, but exactly the size of the accuracy a platinum
sensor is bought for.

| Sensor type | Law | Sensitivity near 25 °C | Best use |
|---|---|---|---|
| Copper winding | linear, alpha 0.00393 | 0.393 %/°C | mean temperature of a coil you cannot probe |
| Platinum Pt100 | linear, alpha 0.00385 | 0.385 %/°C | accurate, wide range, needs lead compensation |
| Nichrome element | linear, alpha 0.0004 | 0.04 %/°C | heaters, where you do NOT want the change |
| Constantan shunt | linear, alpha 0.00002 | 0.002 %/°C | precision current sensing |
| NTC thermistor | exponential in 1/T | about -4 %/°C | high sensitivity over a narrow band |`,
      examTip: 'Convert every temperature-coefficient problem into the ratio form R2/R1 = (234.5 + T2)/(234.5 + T1) for copper. It cannot be broken by a measurement quoted at the wrong reference temperature, which is the built-in distractor, and it needs no reference resistance at all.',
      importantNote: 'The inferred zero of -234.45 °C for copper is a property of the STRAIGHT-LINE MODEL, not of copper. Real copper flattens onto a residual resistivity floor below about 50 K set by its impurities, which is why the residual resistance ratio is the purity specification for cryogenic conductors.',
    },
    {
      id: 'cond-skin',
      title: '9. Skin Effect and AC Resistance, Derived',
      content: `## 9.1 Where the skin depth formula comes from

Section 5.4 quoted the skin depth. It is worth deriving, because the derivation
explains the square roots that make the formula memorable. Inside a good
conductor the displacement current is negligible next to the conduction
current, so Maxwell's equations collapse to a diffusion equation for the field:

$$\\nabla^2 \\mathbf{E} = \\mu\\sigma\\frac{\\partial \\mathbf{E}}{\\partial t}$$

For a sinusoidal excitation at angular frequency $\\omega$, the time derivative
becomes multiplication by $j\\omega$, and for a field varying only with depth
$x$ into a flat conductor surface the equation is one-dimensional:

$$\\frac{d^2 E}{dx^2} = j\\omega\\mu\\sigma E$$

The solution decaying into the metal is $E(x) = E_0 e^{-\\gamma x}$ with
$\\gamma = \\sqrt{j\\omega\\mu\\sigma}$. Since $\\sqrt{j} = (1+j)/\\sqrt{2}$, this
separates cleanly into a decay and a phase lag:

$$\\gamma = \\frac{1+j}{\\delta}, \\qquad \\delta = \\sqrt{\\frac{2}{\\omega\\mu\\sigma}} = \\sqrt{\\frac{\\rho}{\\pi f \\mu}}$$

$$E(x) = E_0\\,e^{-x/\\delta}\\,e^{-jx/\\delta}$$

So $\\delta$ is doing two jobs at once: it is the depth at which the amplitude
has fallen to $1/e$ of its surface value, and it is also the depth at which the
current has fallen a full radian behind the surface current in phase. Current
deep in a conductor is not merely small, it is out of phase, and that is why
you cannot recover it by simply adding more metal.

Dimensional check, because this is a formula students misremember with $\\mu$ in
the numerator. Resistivity is Ω·m, frequency is s⁻¹, permeability is H/m which
is Ω·s/m. Then
$\\rho/(f\\mu) = (\\Omega \\cdot m)/[(s^{-1})(\\Omega \\cdot s/m)] = m^2$, and the
square root is a length. Putting $\\mu$ upstairs would give m⁻², whose square
root is not a length at all — the check catches the error immediately.

## 9.2 What the formula says

Three dependencies, all square roots, all worth internalising. Depth falls as
$1/\\sqrt{f}$, so a hundredfold rise in frequency costs a factor of ten. Depth
rises as $\\sqrt{\\rho}$, so a WORSE conductor has a THICKER skin — which sounds
backwards until you remember that skin effect is caused by induced eddy
currents, and a poor conductor supports weaker ones. And depth falls as
$1/\\sqrt{\\mu}$, which is why magnetic materials are a special case.

![Skin depth against frequency on logarithmic axes for copper, aluminium and low-carbon steel, each computed from delta equals the square root of resistivity over pi times frequency times permeability. Copper and aluminium use the magnetic constant; the steel curve assumes a relative permeability of one hundred and sits well below both despite its higher resistivity.](/courses/fe-ee/figures/mat2-skin-depth.svg)

The steel curve carries an ASSUMPTION, stated here as plainly as in the figure:
a relative permeability of 100, which is a representative order of magnitude
for low-carbon steel at power-frequency flux densities but is not a fixed
constant — steel's permeability depends strongly on the flux density and on the
grade. With that assumption and a tabulated
$\\rho = 1.6 \\times 10^{-7}$ Ω·m, the 60 Hz skin depth of steel is 2.60 mm
against copper's 8.53 mm. The permeability more than cancels the higher
resistivity, and the practical consequence is that steel conduit, steel
armouring and steel-cored conductors all behave differently under AC than a
naive resistivity comparison suggests.

| Material and permeability | delta at 60 Hz | at 1 kHz | at 100 kHz | at 1 MHz |
|---|---|---|---|---|
| Copper, mu_r = 1 | 8.53 mm | 2.09 mm | 0.209 mm | 66.1 um |
| Aluminium EC, mu_r = 1 | 10.93 mm | 2.68 mm | 0.268 mm | 84.7 um |
| Silver, mu_r = 1 | 8.19 mm | 2.01 mm | 0.201 mm | 63.5 um |
| Steel, mu_r = 100 assumed | 2.60 mm | 0.637 mm | 63.7 um | 20.1 um |

### Worked example 9.1 — skin depth of copper, two frequencies

Given: copper at 20 °C, $\\rho = 1.724 \\times 10^{-8}$ Ω·m,
$\\mu = \\mu_0 = 4\\pi \\times 10^{-7}$ H/m. Find $\\delta$ at 60 Hz and at
100 kHz.

$$\\delta_{60} = \\sqrt{\\frac{1.724 \\times 10^{-8}}{\\pi(60)(1.25664 \\times 10^{-6})}} = \\sqrt{7.2783 \\times 10^{-5}} = 8.531 \\times 10^{-3}\\ \\mathrm{m}$$

so 8.53 mm. Independent route, using the scaling law instead of resubstituting:
$\\delta \\propto 1/\\sqrt{f}$, so
$\\delta_{100k} = 8.531\\sqrt{60/100000} = 8.531 \\times 0.024495 = 0.2090$ mm.
Direct substitution at 100 kHz gives the same 0.2090 mm, confirming both the
arithmetic and the exponent.

At 60 Hz an 8.5 mm skin is deeper than the radius of anything below about
4/0 AWG, so power-frequency wiring is essentially a DC problem. At 100 kHz the
skin is thinner than a human hair and the picture changes completely.

## 9.3 What it costs: AC resistance

If the current were confined uniformly to a shell of thickness $\\delta$ inside
a wire of radius $a$, the conducting area would be the annulus
$\\pi[a^2 - (a-\\delta)^2] = \\pi\\delta(2a - \\delta)$, and since resistance goes
inversely with area:

$$\\frac{R_{ac}}{R_{dc}} = \\frac{\\pi a^2}{\\pi\\delta(2a-\\delta)} = \\frac{a^2}{\\delta(2a-\\delta)} \\qquad (a > \\delta)$$

For $a \\gg \\delta$ this tends to $a/(2\\delta)$, and the exact cylindrical
solution has the refined asymptote

$$\\frac{R_{ac}}{R_{dc}} \\approx \\frac{a}{2\\delta} + \\frac{1}{4} + \\frac{3\\delta}{32a}$$

The exact result requires Kelvin functions and is not FE material, but it is
what the figure below plots, so the approximations can be measured against it.
When $a < \\delta$ the shell model must be abandoned: the current fills the wire
and the ratio approaches 1 from above, never below.

![Ratio of AC to DC resistance against frequency on a logarithmic frequency axis for AWG 12, AWG 6 and 4 slash 0 copper conductors, computed from the exact cylindrical solution written with Kelvin functions. At sixty hertz all three sit essentially at unity; by one hundred kilohertz the smallest is already at nearly three times its DC resistance and the largest is far above the plot.](/courses/fe-ee/figures/mat2-ac-resistance.svg)

### Worked example 9.2 — AC resistance of AWG 12 at 100 kHz

Given: AWG 12 copper, $d = 2.0525$ mm so $a = 1.0263$ mm; $\\delta = 0.2090$ mm
from worked example 9.1.

Relation: the uniform-shell model above.

$$\\frac{a}{\\delta} = \\frac{1.0263}{0.2090} = 4.911$$

$$\\frac{R_{ac}}{R_{dc}} = \\frac{(4.911)^2}{2(4.911) - 1} = \\frac{24.118}{8.822} = 2.734$$

using the convenient form obtained by dividing numerator and denominator by
$\\delta^2$, which turns the model into a function of $a/\\delta$ alone. The
exact cylindrical solution for the same conductor gives 2.724, so the shell
model is 0.36% high — comfortably inside exam tolerance and derived in one
line from geometry.

The DC resistance was 5.210 mΩ/m, so at 100 kHz the same wire presents
$5.210 \\times 2.734 = 14.24$ mΩ/m. Nothing about the copper changed. The usable
$A$ in $R = \\rho L/A$ shrank.

### Worked example 9.3 — is skin effect relevant at 60 Hz?

Given: a 4/0 AWG conductor, $d = 11.684$ mm so $a = 5.842$ mm, at 60 Hz where
$\\delta = 8.531$ mm.

Here $a/\\delta = 5.842/8.531 = 0.685$, which is LESS than one, so the shell
model does not apply and the exact solution must be quoted: the ratio is 1.005.
Half a percent. Even the largest conductor in common building work is a DC
problem at 60 Hz. Push the same conductor to 1 kHz, where $\\delta = 2.090$ mm
and $a/\\delta = 2.796$, and the ratio becomes 1.661 — a 66% penalty. The
transition is not gradual in practice: it happens over about one decade of
frequency centred on where the radius equals the skin depth.

## 9.4 The engineering answers

Once the problem is understood as "the usable area shrank", the fixes are
obvious and they are all geometric.

**Litz wire** divides the conductor into many strands each thinner than
$\\delta$, individually insulated and transposed so each strand spends equal
time at every radius. Every strand then carries its share and the DC area is
recovered. It is expensive, and above a few megahertz the strand count needed
becomes impractical.

**Tubular and hollow conductors** simply delete the copper that was doing
nothing. A hollow bus tube at high frequency has nearly the AC resistance of
the solid bar it replaces, at a fraction of the mass.

**Laminations** are the same answer to the closely related problem in magnetic
cores, where the induced eddy currents circulate in the iron itself. Splitting
the core into sheets thinner than $\\delta$ interrupts those loops. The FE likes
this parallel because it shows the mechanism is one mechanism: an induced
current opposing a changing field, defeated by making the conductor thin in the
direction the induced current wants to flow.

**Plating** exploits the effect rather than fighting it. At microwave
frequencies the current lives in the outermost micrometre, so a silver or gold
flash on a brass waveguide gives the surface conductivity of the precious metal
at the bulk cost of the base metal.

One caution to carry into a real design: the skin effect is only half the
story. Conductors carrying AC near one another also suffer the **proximity
effect**, in which each conductor's field crowds its neighbour's current toward
one side. In a tightly wound multi-layer inductor the proximity loss can exceed
the skin loss by a large factor, and litz wire is bought as much for the
proximity effect as for the skin effect.`,
      examTip: 'Skin depth carries mu in the DENOMINATOR under the root, so a magnetic conductor has a THINNER skin, not a thicker one. Check by units: rho over (f mu) has dimensions of area, and inverting mu would make the square root dimensionally impossible.',
    },
    {
      id: 'cond-sizing',
      title: '10. Sizing a Conductor: Ampacity, Voltage Drop, Derating',
      content: `## 10.1 Three independent constraints

A conductor size has to satisfy three separate requirements, and the largest of
the three governs. **Ampacity** is thermal: the conductor must not exceed its
insulation's temperature rating in continuous service. **Voltage drop** is
functional: the load must still see enough voltage. **Short-circuit withstand**
is a survival requirement: the conductor must not be destroyed during the fault
clearing time. It is common for a run to be sized by ampacity at short lengths
and by voltage drop at long ones, and the crossover is worth being able to
find.

## 10.2 Ampacity from first principles

In steady state a bare conductor loses its heat through its surface. Balancing
generation against loss per metre of length:

$$I^2\\frac{\\rho}{A} = h\\,(\\pi d)\\,\\Delta T$$

with $h$ an overall surface coefficient in W/(m²·K) covering convection and
radiation together. Substituting $A = \\pi d^2/4$ and solving for the rise:

$$\\Delta T = \\frac{4 I^2 \\rho}{\\pi^2 h\\, d^3}$$

Dimensional check: $\\mathrm{A^2 \\cdot \\Omega \\cdot m/[(W\\,m^{-2}K^{-1})m^3]}$.
The numerator is A²·Ω·m = W·m; dividing by W·m·K⁻¹ leaves K. Correct.

Now read the exponent. The rise goes as $I^2/d^3$, so at a fixed allowable rise

$$I \\propto d^{3/2}$$

Doubling the diameter quadruples the area but only multiplies the allowable
current by $2^{1.5} = 2.83$. That single exponent explains the whole shape of
every ampacity table: the current a conductor can carry per unit of
cross-section FALLS as conductors get larger, because heat leaves through a
perimeter that grows like $d$ while heat is generated in an area that grows
like $d^2$. It is also why paralleling two smaller conductors beats one large
one thermally, and why big conductors are the ones that most need free air.

![Steady temperature rise above ambient against current for AWG 12, AWG 6 and AWG 2 bare copper in still air, computed from the heat balance with an assumed surface coefficient of fifteen watts per square metre per kelvin. A dashed line marks the forty-five kelvin rise that takes a conductor to seventy-five degrees in a thirty-degree room, and the three curves cross it at widely different currents.](/courses/fe-ee/figures/mat2-ampacity-rise.svg)

### Worked example 10.1 — temperature rise of a loaded conductor

Given: AWG 12 bare copper, $d = 2.0525$ mm, carrying 20 A. Assume
$h = 15$ W/(m²·K), a representative still-air value for a small cylinder
including radiation, and take the resistivity at the conductor's own operating
temperature, $\\rho_{75} = 2.0966 \\times 10^{-8}$ Ω·m.

$$\\frac{\\rho_{75}}{A} = \\frac{2.0966 \\times 10^{-8}}{3.3088 \\times 10^{-6}} = 6.337 \\times 10^{-3}\\ \\Omega/\\mathrm{m}$$

$$P' = I^2 R' = 400 \\times 6.337 \\times 10^{-3} = 2.535\\ \\mathrm{W/m}$$

$$\\Delta T = \\frac{P'}{h\\pi d} = \\frac{2.535}{15\\pi(2.0525 \\times 10^{-3})} = \\frac{2.535}{0.09672} = 26.2\\ \\mathrm{K}$$

Independent route through the collapsed formula
$\\Delta T = 4I^2\\rho/(\\pi^2 h d^3)$, substituting the same numbers, returns
26.2 K as well, which confirms the area and perimeter were not interchanged —
the classic slip here produces an answer off by $d/4$, a factor of about 500.

A 26 K rise in a 30 °C room puts the conductor at 56 °C, comfortably inside a
75 °C insulation rating. Push the same wire to 30 A and the rise goes as the
square: $26.2 \\times (30/20)^2 = 59$ K, taking it to 89 °C and past the rating.
That, in one line, is what an ampacity limit is.

### Worked example 10.2 — the d to the three-halves law, checked

Given: the same conditions, but AWG 6, $d = 4.1154$ mm. What current gives the
same 26.2 K rise?

$$I_6 = I_{12}\\left(\\frac{d_6}{d_{12}}\\right)^{3/2} = 20\\left(\\frac{4.1154}{2.0525}\\right)^{1.5} = 20 \\times 2.839 = 56.8\\ \\mathrm{A}$$

Independent route: substitute 56.8 A and AWG 6's own geometry back into the
full heat balance. The per-metre resistance is
$2.0966 \\times 10^{-8}/1.3302 \\times 10^{-5} = 1.576$ mΩ/m, the loss is
$56.8^2 \\times 1.576 \\times 10^{-3} = 5.085$ W/m, and dividing by
$15\\pi(4.1154 \\times 10^{-3}) = 0.19394$ gives 26.2 K. The two routes agree, so
the exponent 3/2 is confirmed rather than asserted.

Compare with the published figure: NEC 2020 Table 310.16 lists 65 A for 6 AWG
copper at 75 °C. A bare wire in still air with an assumed film coefficient
lands at 56.8 A for the same rise, which is the right order and slightly
conservative — real installations run in raceways (worse) but the tabulated
values assume a 30 °C ambient and a 45 K rise (more headroom than our 26 K).
The physics gives the shape; the code table gives the calibrated numbers.

| Copper conductor | Area (mm²) | R' at 75 °C (mOhm/m) | NEC 310.16 at 75 °C |
|---|---|---|---|
| 12 AWG | 3.309 | 6.34 | 25 A |
| 10 AWG | 5.261 | 3.99 | 35 A |
| 8 AWG | 8.366 | 2.51 | 50 A |
| 6 AWG | 13.302 | 1.58 | 65 A |
| 4 AWG | 21.151 | 0.991 | 85 A |
| 2 AWG | 33.631 | 0.623 | 115 A |
| 1/0 AWG | 53.475 | 0.392 | 150 A |
| 4/0 AWG | 107.22 | 0.196 | 230 A |

The ampacity column is quoted from NEC 2020 Table 310.16, 75 °C column, copper,
not more than three current-carrying conductors in a raceway, 30 °C ambient;
the resistance column is computed from $\\rho_{75}/A$ with the areas in the same
row. Notice that ampacity rises by a factor of 9.2 from 12 AWG to 4/0 while
area rises by a factor of 32.4 — the $d^{3/2}$ law again, now visible in
somebody else's table.

## 10.3 Derating, derived rather than looked up

Table values assume a 30 °C ambient. In a hotter room there is less thermal
headroom, and since $\\Delta T \\propto I^2$ at a fixed conductor and surface
coefficient, the allowable current scales as the square root of the headroom:

$$F_{amb} = \\sqrt{\\frac{T_{rated} - T_{ambient}}{T_{rated} - 30}}$$

For a 75 °C conductor at 40 °C ambient, $\\sqrt{35/45} = 0.882$; at 50 °C,
$\\sqrt{25/45} = 0.745$. Those are the published correction factors, reproduced
here from the heat balance rather than copied from a table — which is the best
possible evidence that the heat balance is the right model.

![Ambient derating factor against ambient temperature for sixty, seventy-five and ninety degree insulation systems, each the square root of the remaining thermal headroom divided by the headroom at a thirty degree reference. Every curve passes through unity at thirty degrees and falls to zero at its own insulation rating.](/courses/fe-ee/figures/mat2-derating.svg)

A second correction applies when conductors are bundled: each one's heat has to
escape past the others, which is equivalent to reducing $h$. NEC 310.15(C)(1)
gives 80% for 4 to 6 current-carrying conductors, 70% for 7 to 9, and 50% for
10 to 20. The two factors multiply.

### Worked example 10.3 — a derated ampacity

Given: 6 AWG copper THWN, tabulated 65 A at 75 °C, installed in a 45 °C
ambient with six current-carrying conductors in the raceway.

$$I_{allowed} = 65 \\times \\sqrt{\\frac{75-45}{45}} \\times 0.80 = 65 \\times 0.8165 \\times 0.80 = 42.5\\ \\mathrm{A}$$

The conductor rated 65 A can carry 42.5 A in this installation — a 35%
reduction, and entirely from the environment rather than the copper. The trap
in exam items is applying one factor and forgetting the other, which gives
53.1 A or 52.0 A depending on which is dropped; both are plausible distractors
and both are unsafe.

## 10.4 Voltage drop, and the full feeder

Voltage drop uses the resistance of the whole current path, which for a
single-phase circuit means BOTH conductors:

$$\\Delta V = I \\times 2 \\times \\frac{\\rho L}{A} \\qquad \\mathrm{(single\\ phase)}$$

$$\\Delta V = \\sqrt{3}\\, I \\times \\frac{\\rho L}{A} \\qquad \\mathrm{(three\\ phase,\\ line\\ to\\ line)}$$

and the resistivity belongs at the conductor's operating temperature, not at
20 °C, because a loaded feeder is hot. Using the cold value understates the
drop by about 20% for a 75 °C conductor.

### Worked example 10.4 — sizing a feeder end to end

Given: a 240 V single-phase feeder, 60 A continuous, 45 m one way, copper at
75 °C so $\\rho_{75} = 2.0966 \\times 10^{-8}$ Ω·m. The design target is 3% drop.

**Step 1, ampacity.** 60 A needs at least 6 AWG from the table above (65 A). Try
6 AWG, $A = 13.302$ mm².

**Step 2, voltage drop.** One-way resistance:

$$R_{one} = \\frac{(2.0966 \\times 10^{-8})(45)}{13.302 \\times 10^{-6}} = 0.07093\\ \\Omega$$

Both conductors: $R_{total} = 0.14186$ Ω. Then

$$\\Delta V = 60 \\times 0.14186 = 8.512\\ \\mathrm{V} \\quad \\Longrightarrow \\quad \\frac{8.512}{240} = 3.55\\%$$

Over target. **Step 3, go one size up.** For 4 AWG, $A = 21.151$ mm²:

$$R_{one} = \\frac{(2.0966 \\times 10^{-8})(45)}{21.151 \\times 10^{-6}} = 0.04461\\ \\Omega, \\qquad R_{total} = 0.08922\\ \\Omega$$

$$\\Delta V = 60 \\times 0.08922 = 5.353\\ \\mathrm{V} = 2.23\\%$$

Acceptable. Independent check on the areas: 4 AWG should have
$21.151/13.302 = 1.590$ times the area of 6 AWG, and the AWG definition gives
$92^{4/39} = 1.590$ exactly. The drop scaled by the reciprocal,
$8.512/1.590 = 5.353$ V, which is the number computed above.

**Step 4, the loss, and a check that ties it together.**

$$P_{loss} = I^2 R_{total} = 3600 \\times 0.08922 = 321.2\\ \\mathrm{W}$$

The load receives $240 - 5.353 = 234.6$ V at 60 A, or 14,079 W. The loss is
therefore $321.2/14079 = 2.28\\%$ of the delivered power — the SAME percentage
as the voltage drop, which is not a coincidence: for a series resistance,
$P_{loss}/P_{load} = I^2R/(IV_{load}) = IR/V_{load} = \\Delta V/V_{load}$. That
identity is the quickest sanity check available on any feeder calculation, and
it fails loudly if you forgot to double the one-way resistance.

## 10.5 Surviving a fault

During a short circuit the current is so large and the time so short that no
heat escapes; all of it stays in the copper. Setting the resistive heating
against the thermal mass, with the resistivity itself rising as the conductor
heats:

$$\\rho_m c\\,\\frac{dT}{dt} = J^2\\rho_{20}\\left[1 + \\alpha(T-20)\\right]$$

Separating and integrating from the initial temperature $T_1$ to the maximum
allowed $T_2$:

$$J^2 t = \\frac{\\rho_m c}{\\rho_{20}\\,\\alpha}\\ln\\!\\left[\\frac{1 + \\alpha(T_2 - 20)}{1 + \\alpha(T_1 - 20)}\\right]$$

### Worked example 10.5 — one-second short-circuit rating

Given: copper, initial temperature 75 °C (the conductor was fully loaded),
maximum permitted 250 °C for thermoplastic insulation. Tabulated values:
$\\rho_m c = 8960 \\times 385 = 3.4496 \\times 10^{6}$ J/(m³·K),
$\\rho_{20} = 1.724 \\times 10^{-8}$ Ω·m, $\\alpha = 0.00393$ per °C.

$$\\frac{\\rho_m c}{\\rho_{20}\\alpha} = \\frac{3.4496 \\times 10^{6}}{(1.724 \\times 10^{-8})(0.00393)} = 5.0914 \\times 10^{16}\\ \\mathrm{A^2 s/m^4}$$

$$\\ln\\!\\left[\\frac{1 + 0.00393(230)}{1 + 0.00393(55)}\\right] = \\ln\\frac{1.90390}{1.21615} = \\ln 1.56552 = 0.44822$$

$$J^2 t = (5.0914 \\times 10^{16})(0.44822) = 2.2820 \\times 10^{16}\\ \\mathrm{A^2 s/m^4}$$

For $t = 1$ s, $J = \\sqrt{2.2820 \\times 10^{16}} = 1.511 \\times 10^{8}$ A/m²,
which is 151 A/mm². A 4/0 conductor at 107.22 mm² therefore withstands about
16.2 kA for one second. Shorten the clearing time to 0.1 s and the allowable
density rises by $\\sqrt{10}$ to 478 A/mm², because it is $J^2t$ that is
conserved, not $J$. That square-root-of-time behaviour is why fast protection
lets a designer use smaller conductors, and why an item that scales the current
linearly with time gets it badly wrong.`,
      examTip: 'The three sizing constraints are checked in order and the largest conductor wins: ampacity first, then voltage drop, then short-circuit withstand. Voltage drop uses BOTH conductors of a single-phase loop (factor 2) or root three for three-phase line-to-line, and the resistivity belongs at operating temperature, which is about 20% above the 20 °C value for a 75 °C conductor.',
      importantNote: 'Ampacity scales as diameter to the three-halves power because heat is generated in an area and removed through a perimeter. Doubling the diameter multiplies the allowable current by 2.83, not by 4, and every published ampacity table obeys that exponent - it is a physics result, not a code convention.',
    },
    {
      id: 'cond-joints',
      title: '11. Joints, Superconductors, and the Thermal Endgame',
      content: `## 11.1 Contact resistance: the joint is the weak point

A bolted or crimped joint looks like continuous metal and is nothing of the
kind. Two nominally flat surfaces touch only at a scattering of microscopic
high points, and all the current must funnel through those spots. The
resistance of a single circular contact spot of radius $a$ between two
identical metals is Holm's **constriction resistance**:

$$R_c = \\frac{\\rho}{2a}$$

Dimensional check: Ω·m divided by m gives Ω. The formula is startling for what
it does NOT contain: no length, no apparent contact area. The current spreads
out into a semi-infinite half space on each side, and the whole resistance
accumulates within a few spot radii of the contact. Geometry beyond that does
not matter.

How big is the spot? Under load the high points deform plastically until the
contact area can carry the force at the material's hardness $H$, so
$\\pi a^2 H = F$ and

$$a = \\sqrt{\\frac{F}{\\pi H}} \\quad \\Longrightarrow \\quad R_c = \\frac{\\rho}{2}\\sqrt{\\frac{\\pi H}{F}}$$

The consequence is the single most useful fact about connections:
$R_c \\propto 1/\\sqrt{F}$. Contact resistance falls with the square root of the
clamping force, so a joint that loses half its bolt tension gains only
$\\sqrt{2} = 1.41$ times the resistance — a modest change that produces a
distinctly immodest amount of heat once squared against a large current.

### Worked example 11.1 — a bolted busbar joint

Given: annealed copper, $\\rho = 1.724 \\times 10^{-8}$ Ω·m, tabulated
indentation hardness $H = 4 \\times 10^{8}$ Pa, bolt force 100 N carried on a
single effective contact spot. Find $R_c$ and the dissipation at 200 A.

$$a = \\sqrt{\\frac{100}{\\pi(4 \\times 10^{8})}} = \\sqrt{7.9577 \\times 10^{-8}} = 2.821 \\times 10^{-4}\\ \\mathrm{m}$$

$$R_c = \\frac{1.724 \\times 10^{-8}}{2(2.821 \\times 10^{-4})} = 3.056 \\times 10^{-5}\\ \\Omega = 30.6\\ \\mu\\Omega$$

$$P = I^2 R_c = (200)^2 (3.056 \\times 10^{-5}) = 1.22\\ \\mathrm{W}$$

Independent route through the combined formula: $R_c = (\\rho/2)\\sqrt{\\pi H/F}$
gives $(8.62 \\times 10^{-9})\\sqrt{\\pi(4 \\times 10^{8})/100} = 30.6$ µΩ,
matching. Put that 30.6 µΩ in context: it equals 190 mm of 4/0 conductor. One
joint is worth nearly a fifth of a metre of cable — provided it stays tight.

Now halve the bolt force to 50 N. The spot radius falls by $\\sqrt{2}$ and the
resistance rises to 43.2 µΩ, taking the dissipation to 1.73 W. That extra half
watt heats the joint, which anneals the copper (lowering $H$, which actually
helps) but also oxidises the interface and relaxes the bolt further. The loop
is unstable, which is why loose connections are a fire mechanism and why
torque specifications on power terminations are not advisory.

Real joints have many spots in parallel, so measured values are far below the
single-spot figure — twenty equal spots would give one twentieth the resistance
— but the scaling with force is unchanged, and the failure mode is the
progressive loss of spots rather than a change in the material. Two more
mechanisms deserve a mention because the FE asks about them. **Film resistance**
adds a series term where an oxide or sulphide layer has grown; aluminium's
oxide forms in seconds and is a genuine insulator, which is why aluminium
terminations need an oxide-cutting compound. **Galvanic corrosion** attacks
dissimilar-metal joints in the presence of moisture, with the less noble metal
sacrificing itself — aluminium against copper being the standard bad example,
and the reason bimetallic transition washers and tinned lugs exist.

## 11.2 Superconductivity as a set of material properties

Section 5.3 introduced the superconductor as a limiting case. Treated properly
it is a material with three critical properties, and exceeding ANY of them
returns the material to normal conduction:

- the **critical temperature** $T_c$, below which resistance is identically
  zero rather than merely small;
- the **critical magnetic field** $B_c$, above which superconductivity is
  destroyed even at zero current;
- the **critical current density** $J_c$, which is not independent — the
  current's own field is what reaches $B_c$ first.

The critical field falls with temperature according to a law that is nearly
universal among the elemental superconductors:

$$B_c(T) = B_c(0)\\left[1 - \\left(\\frac{T}{T_c}\\right)^2\\right]$$

### Worked example 11.2 — operating margin of a lead superconductor

Given: lead, with tabulated $T_c = 7.2$ K and $B_c(0) = 80.3$ mT, operated in a
liquid-helium bath at 4.2 K.

$$B_c(4.2) = 80.3\\left[1 - \\left(\\frac{4.2}{7.2}\\right)^2\\right] = 80.3\\left[1 - 0.3403\\right] = 80.3 \\times 0.6597 = 53.0\\ \\mathrm{mT}$$

So two thirds of the zero-temperature field survives at 4.2 K, and 53 mT is the
ceiling. That is a feeble field — barely more than a refrigerator magnet — and
it is why elemental superconductors are useless for magnets and why practical
magnet wire is niobium-titanium (a type II superconductor, $T_c$ about 9.2 K,
usable above 10 T at 4.2 K) or niobium-tin ($T_c$ about 18.3 K, usable higher
still). The distinction between type I and type II is exactly this: type I
expels flux completely and quits at a low field, while type II admits flux as
quantised vortices and survives to far higher fields.

| Superconductor | T_c (K) | Class | Where it is used |
|---|---|---|---|
| Mercury | 4.15 | type I | the 1911 discovery, nothing else |
| Lead | 7.2 | type I | laboratory demonstrations |
| Niobium-titanium | about 9.2 | type II | MRI and accelerator magnets |
| Niobium-tin | about 18.3 | type II | high-field research magnets |
| Magnesium diboride | about 39 | type II | emerging, liquid-hydrogen range |
| YBCO ceramic | about 92 | type II | liquid-nitrogen-cooled tapes and leads |

The last row is the one that changed the field: above 77 K a superconductor can
be cooled with liquid nitrogen, which is cheap and abundant, instead of liquid
helium, which is neither.

A superconducting loop carries a persistent current forever because there is no
resistance to dissipate it — an MRI magnet is charged once and then
disconnected. The failure mode is the **quench**: a small normal region appears,
dissipates heat, drives its neighbours normal, and the whole stored magnetic
energy $\\tfrac{1}{2}LI^2$ lands in the winding within seconds. For a modest
0.5 H magnet at 300 A that is 22.5 kJ, which is why quench protection and the
copper stabiliser of section 7 exist.

## 11.3 The thermal endgame, gathered

Everything in this chapter converges on temperature, so it is worth setting the
three regimes side by side. In STEADY state, heat flow is limited by thermal
resistance and the tool is $\\Delta T = P R_\\theta$ from section 4. In a
TRANSIENT of a few seconds or less, conduction has not had time to act and the
tool is thermal mass, $Q = mc\\Delta T$, which is what section 10.5 integrated.
And in the SPECIAL CASE of a conductor in air, the steady state is set by the
surface rather than by conduction, which is the ampacity balance of section
10.2. Three tools, three timescales, and using the wrong one is a
characteristic exam error.

$$\\Delta T = P R_\\theta \\quad \\mathrm{(steady)}, \\qquad \\Delta T = \\frac{Q}{mc} \\quad \\mathrm{(adiabatic)}, \\qquad \\Delta T = \\frac{4I^2\\rho}{\\pi^2 h d^3} \\quad \\mathrm{(surface\\ limited)}$$

The positive feedback that runs through all three is worth stating once more in
its own right. Resistance rises with temperature; dissipation rises with
resistance; temperature rises with dissipation. For a metal conductor the loop
gain is well below one — a 55 K rise costs only 21.6% more resistance while the
heat removal grows roughly in proportion to $\\Delta T$ — so it converges. In a
semiconductor with a NEGATIVE coefficient the same loop can have gain above
one, and that is thermal runaway. Same feedback path, opposite sign, completely
different outcome.`,
      examTip: 'Constriction resistance rho/(2a) contains no length and no apparent contact area, and it falls as the square root of clamping force. When an item asks what happens to a joint when a bolt loosens by half, the answer is a factor of root two in resistance and therefore root two in heat at fixed current - not a factor of two.',
    },
    {
      id: 'cond-practice',
      title: '12. Practice Problems and Recurring Errors',
      content: `## 12.1 Practice Problems: geometry, materials, and temperature

**P1.** A 250 m run of copper conductor with a 16 mm² cross-section carries
35 A at an operating temperature of 60 °C. Find the resistance and the
one-conductor voltage drop. Use $\\rho_{20} = 1.724 \\times 10^{-8}$ Ω·m and
$\\alpha_{20} = 0.00393$ per °C.

*Answer.* First correct the resistivity to the operating temperature:

$$\\rho_{60} = 1.724 \\times 10^{-8}\\left[1 + 0.00393(40)\\right] = 1.724 \\times 10^{-8} \\times 1.1572 = 1.995 \\times 10^{-8}\\ \\Omega \\cdot m$$

$$R = \\frac{(1.995 \\times 10^{-8})(250)}{16 \\times 10^{-6}} = 0.3117\\ \\Omega$$

$$\\Delta V = 35 \\times 0.3117 = 10.91\\ \\mathrm{V}$$

*The trap.* Using the 20 °C resistivity gives $R = 0.2694$ Ω and 9.43 V, which
is 13.6% low, and 9.43 V will be one of the choices. A loaded conductor is
hot; correct the resistivity first. The second trap is the area conversion:
16 mm² is $16 \\times 10^{-6}$ m², not $16 \\times 10^{-3}$, and using the latter
gives 0.311 mΩ and 10.9 mV — a thousandfold error that looks superficially like
the right digits.

**P2.** Two conductors of the same material and the same mass are to be
compared. Conductor B is twice as long as conductor A. What is the ratio of
their resistances?

*Answer.* Equal mass and equal density means equal volume, so
$L_A A_A = L_B A_B$. With $L_B = 2L_A$ this gives $A_B = A_A/2$. Then

$$\\frac{R_B}{R_A} = \\frac{L_B/A_B}{L_A/A_A} = \\frac{2L_A/(A_A/2)}{L_A/A_A} = 4$$

*The trap.* Answering 2, by scaling only the length. The mass constraint forces
the area to change as well, and the two effects multiply rather than one of
them acting alone. Any FE item that fixes mass or volume rather than area is
asking for this $L^2$ behaviour.

**P3.** A tungsten lamp filament measures 25 Ω at 20 °C and draws 0.30 A from a
120 V supply when hot. Estimate the filament's operating temperature. Tungsten
$\\alpha_{20} = 0.0045$ per °C, so $T_\\infty = -202.22$ °C.

*Answer.* The hot resistance is $R_{hot} = 120/0.30 = 400$ Ω, so
$R_{hot}/R_{20} = 400/25 = 16$. Using the ratio law:

$$T_{hot} = 16\\left(20 + 202.22\\right) - 202.22 = 16 \\times 222.22 - 202.22 = 3555.5 - 202.2 = 3353\\ ^{\\circ}\\mathrm{C}$$

*The trap.* Two of them. First, a cold-resistance calculation predicts
$120/25 = 4.8$ A of inrush against a 0.30 A steady current, a factor of sixteen
— which is exactly why lamps fail at switch-on and why the answer of 4.8 A to
"what current does this lamp draw" is wrong by that factor. Second, the linear
model is being extrapolated to 3350 °C, thousands of degrees past its honest
range, so this is an ESTIMATE. It happens to land near tungsten's true
operating temperature, which is a useful accident, not a validation of the
model.

**P4.** A copper conductor and an aluminium conductor have the same length,
mass and material cost per kilogram. Which has the lower resistance, and by
what factor?

*Answer.* Equal mass and equal length fixes $\\rho_m A$, so
$A_{Al}/A_{Cu} = \\rho_{m,Cu}/\\rho_{m,Al} = 8960/2700 = 3.319$. Then

$$\\frac{R_{Al}}{R_{Cu}} = \\frac{\\rho_{Al}}{\\rho_{Cu}} \\times \\frac{A_{Cu}}{A_{Al}} = 1.6415 \\times \\frac{1}{3.319} = 0.495$$

Aluminium wins by a factor of two, which is the conductivity-per-unit-mass
result of section 7.3 arriving by a different road.

*The trap.* Comparing resistivities alone and answering "copper, by 1.64".
That answer is correct only when the AREAS are equal, and the question fixed
the masses instead. Read which quantity is held constant — it is the entire
content of the item.

## 12.2 Practice Problems: AC, sizing, and thermal

**P5.** A copper conductor of 10 mm diameter carries current at 10 kHz. Find
the skin depth and the approximate ratio of AC to DC resistance.

*Answer.* From $\\delta = \\sqrt{\\rho/(\\pi f \\mu_0)}$ with the 60 Hz value of
8.531 mm as an anchor and the $1/\\sqrt{f}$ scaling:

$$\\delta_{10k} = 8.531\\sqrt{\\frac{60}{10000}} = 8.531 \\times 0.07746 = 0.6608\\ \\mathrm{mm}$$

With $a = 5$ mm, $a/\\delta = 5/0.6608 = 7.567$, so the uniform-shell model gives

$$\\frac{R_{ac}}{R_{dc}} = \\frac{(7.567)^2}{2(7.567)-1} = \\frac{57.259}{14.134} = 4.0512$$

The exact cylindrical solution gives 4.0457, so the shell model is 0.14% high.

*The trap.* Answering with $a/(2\\delta) = 3.784$, the leading asymptotic term
alone. The neglected $+1/4$ is 6.6% of the answer here, and 3.78 will be
offered. Keep the full shell expression, or at minimum add the quarter.

**P6.** A 480 V three-phase feeder carries 100 A over 120 m using 1/0 AWG
copper (53.475 mm²) at 75 °C. Find the line-to-line voltage drop as a
percentage, and the total power lost.

*Answer.* Per-conductor resistance first:

$$R = \\frac{(2.0966 \\times 10^{-8})(120)}{53.475 \\times 10^{-6}} = 0.04705\\ \\Omega$$

Three-phase line-to-line drop and total loss in three conductors:

$$\\Delta V = \\sqrt{3}\\,(100)(0.04705) = 8.150\\ \\mathrm{V} \\quad \\Longrightarrow \\quad \\frac{8.150}{480} = 1.70\\%$$

$$P_{loss} = 3I^2R = 3(10000)(0.04705) = 1412\\ \\mathrm{W}$$

*The trap.* Using a factor of 2 as though the circuit were single-phase gives
9.41 V and 1.96%; using no factor at all gives 4.70 V and 0.98%. The root-three
belongs to the line-to-line drop of a balanced three-phase system, and the
factor 3 in the loss counts the three conductors — different threes, doing
different jobs, and mixing them up is the whole point of the distractors.

**P7.** A 90 °C-rated conductor is tabulated at 115 A in a 30 °C ambient.
Installed in a 55 °C ambient with eight current-carrying conductors, what is
its allowable current?

*Answer.* Ambient factor, then bundling factor:

$$F_{amb} = \\sqrt{\\frac{90-55}{90-30}} = \\sqrt{0.5833} = 0.7638$$

$$I_{allowed} = 115 \\times 0.7638 \\times 0.70 = 61.5\\ \\mathrm{A}$$

*The trap.* Applying the ambient correction from the 75 °C column, which would
use $\\sqrt{20/45} = 0.667$ and give 53.7 A. The correction is relative to the
conductor's OWN rating: a 90 °C conductor has more headroom in a hot room than
a 75 °C one, which is exactly why the higher temperature rating is bought.

**P8.** How long can a 35 mm² copper conductor initially at 90 °C carry 8 kA
before reaching 250 °C?

*Answer.* From worked example 10.5's integrated form, recomputed for the new
starting temperature:

$$\\ln\\!\\left[\\frac{1 + 0.00393(230)}{1 + 0.00393(70)}\\right] = \\ln\\frac{1.90390}{1.27510} = \\ln 1.49314 = 0.40086$$

$$J^2t = (5.0914 \\times 10^{16})(0.40086) = 2.0409 \\times 10^{16}\\ \\mathrm{A^2s/m^4}$$

The current density is $J = 8000/(35 \\times 10^{-6}) = 2.2857 \\times 10^{8}$
A/m², so

$$t = \\frac{2.0409 \\times 10^{16}}{(2.2857 \\times 10^{8})^2} = \\frac{2.0409 \\times 10^{16}}{5.2245 \\times 10^{16}} = 0.391\\ \\mathrm{s}$$

*The trap.* Treating the withstand as a current-time product rather than a
current-squared-time product. Halving the current would then appear to double
the allowable time, when it actually quadruples it. Every adiabatic heating
question in this subject is an $I^2t$ question.

## 12.3 Practice Problems: reasoning and units

**P9.** A semiconductor thermistor and a copper winding both measure 100 Ω at
25 °C. Both are heated to 75 °C. Sketch, in words, what happens to each and
explain the difference in terms of carrier density and mobility.

*Answer.* The copper rises to
$100(234.45+75)/(234.45+25) = 100 \\times 309.45/259.45 = 119.3$ Ω, a 19.3%
increase, because heating a metal cannot change its fixed carrier density and
can only shorten the mean free time between collisions, lowering mobility. The
thermistor FALLS, typically by a factor of five or more over that span, because
heating a semiconductor generates carriers exponentially and the gain in
carrier density overwhelms the same loss of mobility that the metal suffers.
Sign of $\\alpha$ is therefore a statement about which of $n$ and $\\mu$ in
$\\sigma = nq\\mu$ is free to move.

*The trap.* Attributing the metal's positive coefficient to "losing carriers",
which is not a mechanism metals have available. The carrier count in copper is
set by chemistry.

**P10.** Explain why a 500 kcmil copper conductor is rated at 380 A while five
1/0 conductors, of almost the same total area, are rated far higher in
aggregate. What single exponent accounts for it?

*Answer.* Total area of five 1/0 conductors is
$5 \\times 53.475 = 267.4$ mm² against 253 mm² for 500 kcmil, so the areas are
comparable. But heat leaves through a perimeter, and five separate conductors
present $5\\pi d_{1/0} = 5\\pi(8.2515) = 129.6$ mm of perimeter against
$\\pi(17.96) = 56.4$ mm for the single one — 2.30 times as much surface for the
same copper. Since $\\Delta T \\propto I^2/d^3$ at fixed material and film
coefficient, the current a conductor can carry goes as $d^{3/2}$ while its area
goes as $d^2$, so ampacity per unit area falls as $d^{-1/2}$. That single
exponent is the whole answer, and it is why paralleled conductors are a
thermal, not merely a mechanical, convenience.

*The trap.* Assuming ampacity is proportional to area, which would make the two
arrangements equivalent. It is not, and the derating tables that apply when
paralleled conductors are bundled together exist precisely because bundling
gives back the perimeter advantage.

## 12.4 Extended error table

| Error | What it looks like | Why it happens | The fix |
|---|---|---|---|
| Cold resistivity on a loaded conductor | drop and loss about 20% low | rho_20 is the tabulated value | correct to the operating temperature first |
| Coefficient applied off its reference | 1.4% error, plausible answer | alpha_20 needs R_20 | use the ratio form with 234.5 for copper |
| One-way resistance for voltage drop | half the true drop | the return conductor forgotten | factor 2 single-phase, root 3 three-phase line-to-line |
| Ampacity scaled with area | large conductors overrated | heat leaves through a perimeter | current scales as diameter to the 3/2 |
| Resistivities averaged for a composite | wildly high effective rho | parallel paths were treated as series | add conductances, sigma A, not resistivities |
| Only the leading skin term kept | R_ac/R_dc about 7% low | the +1/4 dropped | keep the full shell form |
| Derating factors applied one at a time | ampacity 25% optimistic | ambient and bundling both apply | multiply the two factors |
| I times t instead of I squared t | fault withstand off by the current ratio | linear intuition | adiabatic heating conserves J squared t |
| Diameter used where radius belongs | area four times too large | d and a interchanged | A = pi d squared over 4, a = d over 2 |
| mm squared read as m squared | resistance off by a million | the conversion is 1e-6, not 1e-3 | convert areas before substituting |`,
      examTip: 'When a problem holds MASS or VOLUME constant instead of area, resistance scales as the square of length rather than the first power, because shortening the conductor fattens it. Reading which quantity is fixed is usually the whole item.',
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

**$n_i \\propto \\exp(-E_g/(2kT))$**

Where k = 8.617×$10^{-5}$ eV/K (Boltzmann constant) and T is temperature in Kelvin.

For silicon at 300K: **$n_i \\approx 1.5 \\times 10^{10}\\ \\mathrm{cm^{-3}}$**

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

**$n \\times p = n_i^{2}$** (constant at fixed temperature, regardless of doping)

## 2.2 The p-n Junction (Diode)

When p-type meets n-type:
- A **depletion region** forms at the junction (no free carriers)
- Built-in potential 0.57 to 0.93 V for silicon depending on the doping — see section 8, where it is derived as V_bi = V_T ln(N_A N_D/n_i²)
- **Forward bias** (+ to p, - to n): narrows depletion region → current flows
- **Reverse bias**: widens depletion region → minimal current (leakage only)

### Shockley Diode Equation

**$I = I_S(e^{qV/kT} - 1)$**

Where I_S is the saturation current (≈ 10⁻¹² A for a small-signal silicon diode), q = 1.602176634×10⁻¹⁹ C, and kT/q ≈ 25.85 mV at 300 K.`,
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
| 0.60 | 12.03 mA | — |
| 0.66 | 122.6 mA | +60 mV → ×10.19 |
| 0.72 | 1.249 A | +60 mV → ×10.19 |

The step is ×10.19 rather than a round ×10 because a full decade costs
VT·ln 10 = 59.5 mV, and the table steps by 60 mV — half a millivolt more, worth
1.9% extra current each time. Each 59.5 mV — that is VT·ln 10 — multiplies the
current by exactly ten. Run backwards:
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

In reverse, the exponential dies and I → −I_S: a leakage floor, not a mirror of
the forward curve. Two different currents wear the name "leakage" and they
double at different rates, which is worth separating carefully because the
usual rule of thumb belongs to only one of them. The IDEAL saturation current
rides on n_i², so it inherits the band-gap exponential squared and doubles
about every **4.5 °C** in silicon — the derivation is in section 10.3. The
current a real silicon diode actually leaks in reverse is dominated instead by
thermal generation inside the depletion region, which scales as n_i rather than
n_i², so it doubles about every **9 °C**. That second figure is the origin of
the familiar "leakage doubles every ten degrees" rule. A design that tolerates
nanoamp leakage at 25 °C should expect roughly 2^(75/9) ≈ 320 times as much at
100 °C, which is the better part of a microamp.

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

The geometry formula is the same one used for copper — only ρ changed, and by
five and a half orders of magnitude: 0.46 Ω·cm against copper's 1.7×10⁻⁶ Ω·cm
is a ratio of 2.7×10⁵. (Intrinsic silicon, at 2.3×10⁵ Ω·cm, sits eleven orders
above copper; doping closed most of that gap.) Keeping resistivity in Ω·cm with geometry in cm is
self-consistent and avoids the unit slip entirely, but never mix Ω·cm with
metres.

## 5.3 Voltage step for a current ratio

Given: a silicon diode carries 1 mA at 0.62 V, 300 K. Estimate the voltage at
10 mA.

ΔV = VT·ln(I₂/I₁) = 25.85 mV × ln 10 = 59.5 mV → V ≈ 0.62 + 0.06 = **0.68 V**

One decade, sixty millivolts, no exponentials evaluated. For a factor of 2 the
step is VT·ln 2 = 18 mV — worth recognising on sight.

The same ratio logic runs in reverse for temperature: if the ambient rises so
that leakage matters, each 4.5 °C of rise doubles the ideal I_S (and each 9 °C
doubles the generation leakage a real diode actually shows), while the forward
voltage at fixed current gives back about 2 mV/°C. An item that raises BOTH the
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
    {
      id: 'semi-bonds',
      title: '6. Bonds, Bands, and the Intrinsic Population',
      content: `## 6.1 The constants and material values this chapter uses

Every number below comes from an exact SI constant or from a named tabulated
value. The constants are $q = 1.602176634 \\times 10^{-19}$ C and
$k = 1.380649 \\times 10^{-23}$ J/K, both exact since the 2019 SI redefinition,
with $k = 8.617333262 \\times 10^{-5}$ eV/K in the units band problems prefer,
and $\\varepsilon_0 = 8.8541878128 \\times 10^{-12}$ F/m. For silicon at 300 K
this chapter uses, throughout and without exception, the following tabulated
values: band gap $E_g = 1.12$ eV, intrinsic concentration
$n_i = 1.5 \\times 10^{10}$ cm⁻³, low-doping mobilities $\\mu_n = 1350$ and
$\\mu_p = 480$ cm²/(V·s), relative permittivity 11.7, and an atomic density of
$5.0 \\times 10^{22}$ cm⁻³.

Two honest caveats about those, because they matter for reproducing answers.
First, every one of them is temperature-dependent: $n_i$ violently so, the
mobilities appreciably, the gap mildly. Quoting them "at 300 K" is not
decoration. Second, the value $n_i = 1.5 \\times 10^{10}$ cm⁻³ is the classic
textbook figure and the one embedded in this course's worked examples;
measurements published since the early 1990s put silicon's true intrinsic
concentration nearer $1.0 \\times 10^{10}$ cm⁻³. The difference matters for
research and not at all for the FE, where answer choices are separated by
orders of magnitude — but it is stated here rather than hidden, and section 6.3
shows exactly where the discrepancy comes from.

The thermal voltage appears in almost every equation from here on:

$$V_T = \\frac{kT}{q} = \\frac{(1.380649 \\times 10^{-23}\\ \\mathrm{J/K})(300\\ \\mathrm{K})}{1.602176634 \\times 10^{-19}\\ \\mathrm{C}} = 0.025852\\ \\mathrm{V}$$

Units: joules per coulomb is volts, so the check is immediate. Two derived
quantities are worth memorising alongside it: $V_T \\ln 10 = 59.5$ mV and
$V_T \\ln 2 = 17.9$ mV.

## 6.2 From bonds to bands

A silicon atom has four valence electrons and shares each with a neighbour in
the diamond lattice, so at absolute zero every bond is complete, every electron
is localised, and the crystal is an insulator. Break one bond and two things
appear at once: a free electron, and the vacancy it left. That vacancy is
filled by an electron from a neighbouring bond, whose own vacancy is then
filled from further along, so the vacancy propagates. Tracking the vacancy
instead of the many electrons that move is not a fiction of convenience: the
vacancy behaves in every measurable way like a particle of charge $+q$ with its
own effective mass and mobility. It is the **hole**, and the Hall measurement
of section 3.3 is the experiment that settles its reality.

The band picture is the same story told in energy. The bonding states form the
valence band and the antibonding states the conduction band, separated by the
gap $E_g$. Metals have a partly filled band and therefore no gap to cross;
insulators have a gap so wide that thermal energy never crosses it; and a
semiconductor is simply a material whose gap is small enough that room
temperature promotes a useful — but tiny — fraction of its electrons.

How tiny? Compare the gap with the thermal energy scale. At 300 K,
$kT = 0.025852$ eV, while silicon's gap is 1.12 eV, so

$$\\frac{E_g}{kT} = \\frac{1.12}{0.025852} = 43.32$$

Forty-three times the average thermal energy. Only the extreme tail of the
Boltzmann distribution reaches that far, which is why intrinsic silicon has
$1.5 \\times 10^{10}$ carriers per cm³ against $5.0 \\times 10^{22}$ atoms — one
bond broken in every $3.3 \\times 10^{12}$.

## 6.3 The intrinsic concentration, and where its formula comes from

Integrating the density of states against the Fermi function gives the
electron and hole populations in terms of the effective densities of states
$N_C$ and $N_V$:

$$n = N_C \\exp\\!\\left(-\\frac{E_C - E_F}{kT}\\right), \\qquad p = N_V \\exp\\!\\left(-\\frac{E_F - E_V}{kT}\\right)$$

Multiplying them, the Fermi level cancels — which is the single most useful
algebraic fact in this subject:

$$np = N_C N_V \\exp\\!\\left(-\\frac{E_C - E_V}{kT}\\right) = N_C N_V \\exp\\!\\left(-\\frac{E_g}{kT}\\right)$$

The right-hand side contains no reference to doping at all, so it is the same
in intrinsic material, where $n = p = n_i$:

$$n_i = \\sqrt{N_C N_V}\\,\\exp\\!\\left(-\\frac{E_g}{2kT}\\right)$$

$$np = n_i^2$$

That is the mass-action law of section 2.1, now derived rather than asserted,
and the factor of 2 in the exponent is now explained: it comes from the square
root, which comes from $n$ and $p$ each contributing half the gap. An exam
distractor writes $\\exp(-E_g/kT)$ without the 2, which squares the error.

### Worked example 6.1 — the constant sets do not quite agree, and by how much

Given: silicon's tabulated effective densities of states at 300 K,
$N_C = 2.8 \\times 10^{19}$ cm⁻³ and $N_V = 1.04 \\times 10^{19}$ cm⁻³, with
$E_g = 1.12$ eV. Compute $n_i$ from the formula above and compare with the
tabulated $1.5 \\times 10^{10}$ cm⁻³.

$$\\sqrt{N_C N_V} = \\sqrt{(2.8 \\times 10^{19})(1.04 \\times 10^{19})} = 1.706 \\times 10^{19}\\ \\mathrm{cm^{-3}}$$

$$\\exp\\!\\left(-\\frac{1.12}{2(0.025852)}\\right) = \\exp(-21.662) = 3.912 \\times 10^{-10}$$

$$n_i = (1.706 \\times 10^{19})(3.912 \\times 10^{-10}) = 6.68 \\times 10^{9}\\ \\mathrm{cm^{-3}}$$

Six point seven thousand million, not fifteen thousand million. The two differ
by a factor of 2.25, and the difference is real rather than an arithmetic slip:
the parabolic-band effective masses behind $N_C$ and $N_V$ are approximations,
the gap itself is slightly temperature-dependent, and the classic
$1.5 \\times 10^{10}$ predates modern measurements. The modern measured value,
about $1.0 \\times 10^{10}$ cm⁻³, sits between them. This chapter continues to
use $1.5 \\times 10^{10}$ so that its results match sections 1 to 5, and the
lesson to take is not that one number is wrong but that a formula built on
approximate constants deserves to be quoted to one significant figure.

## 6.4 Temperature: the exponential that governs everything

The prefactor $\\sqrt{N_C N_V}$ is itself temperature-dependent, going as
$T^{3/2}$, so the full temperature law is

$$n_i(T) \\propto T^{3/2}\\exp\\!\\left(-\\frac{E_g}{2kT}\\right)$$

Anchoring on the known 300 K value avoids the prefactor entirely and is the
form to use in practice:

$$n_i(T) = n_i(300)\\left(\\frac{T}{300}\\right)^{3/2}\\exp\\!\\left[\\frac{E_g}{2k}\\left(\\frac{1}{300} - \\frac{1}{T}\\right)\\right]$$

with $E_g/2k = 1.12/(2 \\times 8.617333262 \\times 10^{-5}) = 6498.5$ K for
silicon, a temperature-like constant that packages the whole exponent.

### Worked example 6.2 — silicon's intrinsic concentration at four temperatures

Given: the anchored law above with $n_i(300) = 1.5 \\times 10^{10}$ cm⁻³ and
$E_g/2k = 6498.5$ K, holding $E_g$ constant at 1.12 eV.

At 350 K: the prefactor ratio is $(350/300)^{1.5} = 1.2601$ and the exponent is
$6498.5(1/300 - 1/350) = 6498.5 \\times 4.7619 \\times 10^{-4} = 3.0945$, so

$$n_i(350) = (1.5 \\times 10^{10})(1.2601)\\,e^{3.0945} = (1.5 \\times 10^{10})(27.82) = 4.17 \\times 10^{11}\\ \\mathrm{cm^{-3}}$$

Repeating at three more temperatures, and reporting to three figures:

| Temperature | (T/300)^1.5 | exponential factor | n_i (per cm³) |
|---|---|---|---|
| 250 K | 0.7607 | 0.013137 | 1.50e8 |
| 300 K | 1.0000 | 1.0000 | 1.50e10 |
| 350 K | 1.2601 | 22.076 | 4.17e11 |
| 400 K | 1.5396 | 224.85 | 5.19e12 |
| 500 K | 2.1517 | 5793.4 | 1.87e14 |

Independent route on the 500 K entry: instead of the anchored formula, take the
logarithmic derivative of the law and integrate it, or simply check the local
doubling rate against the table. Differentiating $\\ln n_i$:

$$\\frac{d\\ln n_i}{dT} = \\frac{3}{2T} + \\frac{E_g}{2kT^2} = \\frac{1.5}{300} + \\frac{6498.5}{300^2} = 0.005 + 0.07221 = 0.07721\\ \\mathrm{K^{-1}}$$

$$T_{double} = \\frac{\\ln 2}{0.07721} = 8.98\\ \\mathrm{K}, \\qquad T_{decade} = \\frac{\\ln 10}{0.07721} = 29.8\\ \\mathrm{K}$$

So near room temperature silicon's carrier population doubles every 9 K and
gains a decade every 30 K. Checking that against the table: from 300 to 400 K
is 100 K, which should be $100/29.8 = 3.36$ decades, giving
$1.5 \\times 10^{10} \\times 10^{3.36} = 3.4 \\times 10^{13}$. The table says
$5.19 \\times 10^{12}$, a factor of 6.6 lower, and the reason is that the
doubling RATE itself falls as $T$ rises — the $1/T^2$ in the derivative. The
local rate is a room-temperature rule, not a licence to extrapolate a hundred
kelvin. That is a genuinely useful thing to have caught: the "doubles every
10 °C" rule is local, and using it across a wide span overestimates badly.

![Intrinsic carrier concentration against temperature for silicon and germanium on a logarithmic axis, each anchored at its tabulated three-hundred-kelvin value and computed from the temperature law with its own band gap. A dashed line marks a doping level of ten to the fifteenth per cubic centimetre; germanium crosses it near four hundred kelvin and silicon near five hundred sixty-five kelvin.](/courses/fe-ee/figures/mat2-ni-temperature.svg)

## 6.5 The gap itself moves

Holding $E_g$ constant is an approximation, and a measurable one. The empirical
Varshni relation describes the shrinkage:

$$E_g(T) = E_g(0) - \\frac{\\alpha T^2}{T + \\beta}$$

with silicon's tabulated parameters $E_g(0) = 1.170$ eV,
$\\alpha = 4.73 \\times 10^{-4}$ eV/K and $\\beta = 636$ K. At 300 K this gives

$$E_g(300) = 1.170 - \\frac{(4.73 \\times 10^{-4})(90000)}{936} = 1.170 - 0.0455 = 1.1245\\ \\mathrm{eV}$$

which recovers the tabulated 1.12 eV, a satisfying consistency check on both
numbers. At 400 K it gives 1.097 eV and at 500 K 1.066 eV. A shrinking gap
makes $n_i$ rise even faster than the constant-gap law predicts, so the table
in worked example 6.2 is, if anything, conservative at its hot end. The lattice
expands as it heats, the bonds weaken, and the gap follows — the mechanism is
that simple.

| Material | E_g at 300 K (eV) | n_i at 300 K (cm⁻³) | Practical junction limit |
|---|---|---|---|
| Germanium | 0.66 | 2.4e13 | about 85 to 100 °C |
| Silicon | 1.12 | 1.5e10 | about 150 to 200 °C |
| Gallium arsenide | 1.42 | about 2e6 | above 300 °C |
| Silicon carbide, 4H | 3.26 | about 1e-8 | above 300 °C, limited by packaging |
| Gallium nitride | 3.4 | far below 1 | above 300 °C, limited by packaging |`,
      examTip: 'The factor of 2 in exp(-Eg/2kT) is not optional and it is not a convention: it comes from the square root of the np product, because an electron and a hole are created together and each carries half the gap. Writing exp(-Eg/kT) for n_i squares the true answer, and the squared value will be among the choices.',
      importantNote: 'The rule that carriers double every 8 to 10 °C is a LOCAL rate valid near room temperature only, because the doubling rate itself falls as one over temperature squared. Extrapolating it across a hundred kelvin overestimates the carrier concentration by nearly an order of magnitude - use the full anchored formula for wide temperature spans.',
    },
    {
      id: 'semi-neutrality',
      title: '7. Doping Solved Exactly: Mass Action and Charge Neutrality',
      content: `## 7.1 Two equations, two unknowns

Doping is the deliberate substitution of a group V atom (phosphorus, arsenic,
antimony — five valence electrons, one spare) or a group III atom (boron,
aluminium, gallium — three valence electrons, one short) into the silicon
lattice. At room temperature the dopant states are shallow enough that
essentially all of them are ionised, so a donor contributes one electron and a
fixed positive core, and an acceptor contributes one hole and a fixed negative
core.

The crystal as a whole is neutral, so the mobile charges must balance the fixed
ones:

$$q\\left(p + N_D^{+}\\right) = q\\left(n + N_A^{-}\\right) \\quad \\Longrightarrow \\quad n - p = N_D - N_A$$

assuming complete ionisation. This is the equation that is usually skipped, and
skipping it is what makes the majority-carrier shortcut look like a definition
rather than an approximation. Pair it with mass action:

$$np = n_i^2$$

Two equations, two unknowns. Substituting $p = n_i^2/n$ into the neutrality
condition gives a quadratic in $n$:

$$n^2 - (N_D - N_A)n - n_i^2 = 0$$

whose physically meaningful root (the one that is positive) is

$$n = \\frac{(N_D - N_A) + \\sqrt{(N_D - N_A)^2 + 4n_i^2}}{2}, \\qquad p = \\frac{n_i^2}{n}$$

For net p-type material the same algebra with the roles exchanged gives

$$p = \\frac{(N_A - N_D) + \\sqrt{(N_A - N_D)^2 + 4n_i^2}}{2}, \\qquad n = \\frac{n_i^2}{p}$$

Write $N = N_D - N_A$ for the net doping. Two limits are visible in the
quadratic without any arithmetic. When $N \\gg n_i$ the square root is
essentially $N$ and the solution collapses to $n = N$, $p = n_i^2/N$ — the
familiar shortcut. When $N \\to 0$ the root becomes $2n_i$ and the solution
collapses to $n = p = n_i$ — intrinsic material. Everything interesting happens
where $N$ is comparable with $n_i$.

![Electron and hole concentrations against net doping on logarithmic axes for silicon at three hundred kelvin, from the exact quadratic, with the majority and minority shortcuts drawn as dotted asymptotes. The exact curves bend away from both shortcuts within about a decade of the intrinsic concentration and merge with them above it.](/courses/fe-ee/figures/mat2-carrier-exact.svg)

### Worked example 7.1 — ordinary doping, where the shortcut is superb

Given: silicon at 300 K doped with $N_D = 1 \\times 10^{16}$ cm⁻³ donors, no
acceptors, $n_i = 1.5 \\times 10^{10}$ cm⁻³.

Exact route, through the quadratic. First
$4n_i^2 = 4(2.25 \\times 10^{20}) = 9.0 \\times 10^{20}$, against
$N^2 = 1.0 \\times 10^{32}$. The correction under the root is therefore a part
in $1.1 \\times 10^{11}$, and expanding the square root to first order:

$$\\sqrt{N^2 + 4n_i^2} \\approx N\\left(1 + \\frac{2n_i^2}{N^2}\\right) = N + \\frac{2n_i^2}{N}$$

$$n = \\frac{N + N + 2n_i^2/N}{2} = N + \\frac{n_i^2}{N} = 1 \\times 10^{16} + 2.25 \\times 10^{4}$$

$$p = \\frac{n_i^2}{n} = \\frac{2.25 \\times 10^{20}}{1.0000000000000225 \\times 10^{16}} = 2.25 \\times 10^{4}\\ \\mathrm{cm^{-3}}$$

Verification against BOTH governing equations, which is the point of the
exercise. Mass action: $np = (1.0 \\times 10^{16})(2.25 \\times 10^{4}) = 2.25 \\times 10^{20} = n_i^2$.
Neutrality: $n - p = 1 \\times 10^{16} + 2.25 \\times 10^{4} - 2.25 \\times 10^{4} = 1 \\times 10^{16} = N_D$.
Both satisfied simultaneously, which is the only acceptable check.

The shortcut $n = N_D$ is low by $2.25 \\times 10^{4}$ out of $10^{16}$, a
relative error of $2.25 \\times 10^{-12}$. Two parts in a million million. For
any ordinary doping level the shortcut is not an approximation so much as an
identity to the precision anyone can measure.

### Worked example 7.2 — lightly doped material, where the shortcut fails

Given: the same silicon doped with only $N_D = 2 \\times 10^{10}$ cm⁻³ — barely
more than the intrinsic concentration itself.

Exact route, no expansion this time because the terms are comparable:

$$\\sqrt{N^2 + 4n_i^2} = \\sqrt{(2 \\times 10^{10})^2 + 9.0 \\times 10^{20}} = \\sqrt{1.30 \\times 10^{21}} = 3.6056 \\times 10^{10}$$

$$n = \\frac{2 \\times 10^{10} + 3.6056 \\times 10^{10}}{2} = 2.8028 \\times 10^{10}\\ \\mathrm{cm^{-3}}$$

$$p = \\frac{2.25 \\times 10^{20}}{2.8028 \\times 10^{10}} = 8.0278 \\times 10^{9}\\ \\mathrm{cm^{-3}}$$

Verify both equations again. Mass action:
$(2.8028 \\times 10^{10})(8.0278 \\times 10^{9}) = 2.250 \\times 10^{20} = n_i^2$.
Neutrality: $2.8028 \\times 10^{10} - 0.80278 \\times 10^{10} = 2.000 \\times 10^{10} = N_D$.
Both hold.

Now the shortcuts. The majority shortcut says $n = N_D = 2 \\times 10^{10}$,
which is low by

$$\\frac{2.0000 - 2.8028}{2.8028} \\times 100 = -28.6\\%$$

The minority shortcut says $p = n_i^2/N_D = 2.25 \\times 10^{20}/2 \\times 10^{10} = 1.125 \\times 10^{10}$,
which is HIGH by

$$\\frac{1.1250 - 0.80278}{0.80278} \\times 100 = +40.1\\%$$

Both wrong, in opposite directions, and both wrong by amounts that would ruin
any device calculation. The errors are opposite because the shortcut version
violates neutrality: it gives $n - p = 2 \\times 10^{10} - 1.125 \\times 10^{10} = 0.875 \\times 10^{10}$
instead of $2 \\times 10^{10}$, so it is not merely imprecise, it is
inconsistent with charge conservation.

### Worked example 7.3 — the failure that actually happens: high temperature

Given: silicon doped $N_D = 1 \\times 10^{15}$ cm⁻³ operated at 500 K, where
worked example 6.2 established $n_i = 1.87 \\times 10^{14}$ cm⁻³.

$$4n_i^2 = 4(3.4969 \\times 10^{28}) = 1.3988 \\times 10^{29}, \\qquad N^2 = 1.0 \\times 10^{30}$$

$$n = \\frac{1.0 \\times 10^{15} + \\sqrt{1.1399 \\times 10^{30}}}{2} = \\frac{1.0 \\times 10^{15} + 1.0677 \\times 10^{15}}{2} = 1.0338 \\times 10^{15}$$

$$p = \\frac{3.4969 \\times 10^{28}}{1.0338 \\times 10^{15}} = 3.383 \\times 10^{13}\\ \\mathrm{cm^{-3}}$$

Check neutrality: $1.0338 \\times 10^{15} - 0.0338 \\times 10^{15} = 1.000 \\times 10^{15}$.
Correct.

The majority shortcut is now 3.3% low and the minority shortcut 3.4% high, and
more importantly the minority population has climbed from $2.25 \\times 10^{5}$
at 300 K to $3.4 \\times 10^{13}$ — eight orders of magnitude, and now only a
factor of 30 below the majority population. This is the mechanism behind the
maximum junction temperature of section 3.2 stated quantitatively. The device
does not melt; it forgets which side is which.

### Worked example 7.4 — compensation

Given: silicon containing both $N_D = 1 \\times 10^{16}$ and
$N_A = 9.9 \\times 10^{15}$ cm⁻³.

Only the NET doping matters:
$N = 1.0 \\times 10^{16} - 0.99 \\times 10^{16} = 1.0 \\times 10^{14}$ cm⁻³, so

$$n = 1.0 \\times 10^{14}\\ \\mathrm{cm^{-3}}, \\qquad p = \\frac{2.25 \\times 10^{20}}{1.0 \\times 10^{14}} = 2.25 \\times 10^{6}\\ \\mathrm{cm^{-3}}$$

The material is n-type with a hundredth of the carriers its donor count
suggests. This is not a curiosity — it is how integrated circuits are built.
Every well, source and drain is formed by over-doping a region that already
contains the opposite type, and only the net difference survives. The
compensating dopants do not vanish, though: both species still scatter
carriers, so a heavily compensated layer has markedly lower mobility than
lightly doped material of the same net concentration. Net doping fixes the
carrier count; total doping fixes the mobility.

| Case | Net doping N | n (cm⁻³) | p (cm⁻³) | Majority shortcut error |
|---|---|---|---|---|
| Ordinary n-type | 1e16 | 1.0000e16 | 2.25e4 | 2e-12 (negligible) |
| Compensated | 1e14 net | 1.0000e14 | 2.25e6 | negligible |
| Near-intrinsic | 2e10 | 2.8028e10 | 8.0278e9 | 28.6% low |
| Undoped | 0 | 1.5e10 | 1.5e10 | undefined |
| n-type at 500 K | 1e15 | 1.0338e15 | 3.383e13 | 3.3% low |

## 7.2 The Fermi level as a bookkeeping device

The Fermi level is where the equations put the doping information. Starting
from the intrinsic case, where $n = n_i$ when $E_F = E_i$, and comparing with
the general expression:

$$n = n_i \\exp\\!\\left(\\frac{E_F - E_i}{kT}\\right), \\qquad p = n_i \\exp\\!\\left(\\frac{E_i - E_F}{kT}\\right)$$

Multiplying these two reproduces $np = n_i^2$ identically, which is a good
check that they are consistent. Solving the first for the level position:

$$E_F - E_i = kT\\ln\\!\\left(\\frac{n}{n_i}\\right)$$

Since the relationship is logarithmic, a decade of doping is worth only
$kT\\ln 10 = 59.5$ meV of level shift — the same 59.5 mV that governs the diode.
The Fermi level therefore moves slowly and never reaches the band edge for
non-degenerate doping.

![Fermi level position relative to the intrinsic level against majority doping concentration, for n-type and p-type silicon at three hundred kelvin, with the band edges drawn as horizontal guides at plus and minus fifty-six hundredths of an electronvolt. Both curves are straight on the logarithmic doping axis, rising or falling by fifty-nine and a half millielectronvolts per decade.](/courses/fe-ee/figures/mat2-fermi-doping.svg)

### Worked example 7.5 — where the Fermi level sits

Given: silicon at 300 K with $N_D = 1 \\times 10^{16}$ cm⁻³, so
$n = 1 \\times 10^{16}$ cm⁻³.

$$E_F - E_i = (0.025852)\\ln\\!\\left(\\frac{1 \\times 10^{16}}{1.5 \\times 10^{10}}\\right) = (0.025852)\\ln(6.667 \\times 10^{5}) = (0.025852)(13.410) = 0.3467\\ \\mathrm{eV}$$

Since $E_i$ sits near midgap, $E_C - E_i \\approx E_g/2 = 0.56$ eV, so the Fermi
level is $0.56 - 0.3467 = 0.213$ eV below the conduction band edge.

Independent route, through $N_C$ instead of $n_i$:
$E_C - E_F = kT\\ln(N_C/n) = (0.025852)\\ln(2800) = (0.025852)(7.937) = 0.2052$ eV.
The two routes differ by 8 meV, and the discrepancy is not arithmetic — it is
the same inconsistency worked example 6.1 exposed between the tabulated $n_i$
and the tabulated $N_C$, $N_V$, $E_g$ set. Eight millielectronvolts is a third
of $kT$, so nothing built on either number is materially affected, but mixing
constant sets in one calculation is how such gaps appear and it is worth
noticing when they do.

For p-type with $N_A = 1 \\times 10^{17}$ cm⁻³ the level moves the other way:

$$E_i - E_F = (0.025852)\\ln\\!\\left(\\frac{1 \\times 10^{17}}{1.5 \\times 10^{10}}\\right) = (0.025852)(15.712) = 0.4062\\ \\mathrm{eV}$$

so 0.406 eV below the intrinsic level, or 0.154 eV above the valence band edge.
Both results are needed in section 9, because the built-in potential of a
junction is precisely the difference between the two Fermi-level positions
before contact.`,
      examTip: 'Charge neutrality and mass action must hold TOGETHER, and checking both is the only proof an answer is right. If n minus p does not reproduce the net doping, the answer is wrong however good the mass-action arithmetic was - and that is exactly the failure mode of the majority shortcut in lightly doped material.',
      importantNote: 'Compensated material is governed by NET doping for its carrier count and by TOTAL doping for its mobility. A layer with 1e16 donors and 9.9e15 acceptors behaves like 1e14 net material in carrier concentration, but scatters like 2e16 material - which is why heavily compensated regions are unexpectedly resistive.',
    },
    {
      id: 'semi-transport',
      title: '8. Drift, Diffusion, and the Einstein Relation',
      content: `## 8.1 Two ways for charge to move, and only two

A semiconductor supports exactly two transport mechanisms, and every device in
the syllabus is built by arranging them against each other.

**Drift** is motion under a field, identical in form to the metal case of the
conductors chapter but with two carrier types instead of one:

$$J_{n,drift} = qn\\mu_n E, \\qquad J_{p,drift} = qp\\mu_p E$$

$$J_{drift} = q(n\\mu_n + p\\mu_p)E = \\sigma E$$

Note the signs work out so that both terms ADD. Electrons carry negative charge
and drift against the field; holes carry positive charge and drift with it;
both deliver conventional current in the same direction. That is why the
conductivity expression is a sum and not a difference, and it is a favourite
conceptual item.

**Diffusion** is motion down a concentration gradient, with no field required
at all — carriers simply spread out because random thermal motion takes more of
them out of a crowded region than into it:

$$J_{n,diff} = qD_n\\frac{dn}{dx}, \\qquad J_{p,diff} = -qD_p\\frac{dp}{dx}$$

The signs here are the ones students get wrong, and they are worth reasoning
out rather than memorising. Both carrier types flow from high concentration to
low. For holes that flow IS the conventional current, so a positive gradient
gives current in the negative direction, hence the minus sign. For electrons
the flow is opposite to the conventional current AND the charge is negative, so
the two sign flips cancel and the electron diffusion current takes a plus sign.

The total current in each carrier is the sum:

$$J_n = qn\\mu_n E + qD_n\\frac{dn}{dx}, \\qquad J_p = qp\\mu_p E - qD_p\\frac{dp}{dx}$$

## 8.2 The Einstein relation, derived

Diffusion and drift are not independent. Both arise from the same random
thermal motion interrupted by the same scattering events, so their coefficients
must be linked — and equilibrium forces the link.

Consider a bar of non-uniformly doped semiconductor in the dark with no
external connection. No current flows anywhere, by definition of equilibrium,
so $J_n = 0$ everywhere. But the doping gradient guarantees a concentration
gradient, so there IS diffusion; it must be exactly cancelled by drift in a
built-in field. Setting $J_n = 0$:

$$qn\\mu_n E = -qD_n\\frac{dn}{dx}$$

In equilibrium the Fermi level is flat, so from section 7.2 the concentration
varies only because $E_i$ varies with position:
$n = n_i\\exp[(E_F - E_i)/kT]$. The electrostatic potential is related to the
band bending by $E = (1/q)\\,dE_i/dx$, and differentiating the concentration:

$$\\frac{dn}{dx} = -\\frac{n}{kT}\\frac{dE_i}{dx} = -\\frac{qn}{kT}E$$

Substituting that into the equilibrium condition:

$$qn\\mu_n E = -qD_n\\left(-\\frac{qn}{kT}E\\right) = \\frac{q^2nD_n}{kT}E$$

Cancelling $qnE$ from both sides leaves the **Einstein relation**:

$$\\frac{D_n}{\\mu_n} = \\frac{kT}{q} = V_T, \\qquad \\frac{D_p}{\\mu_p} = V_T$$

Dimensional check: mobility is cm²/(V·s), $V_T$ is volts, so the product is
cm²/s — which is exactly the dimension of a diffusion coefficient. Correct.

### Worked example 8.1 — silicon's diffusion coefficients

Given: $\\mu_n = 1350$ and $\\mu_p = 480$ cm²/(V·s), $V_T = 0.025852$ V at 300 K.

$$D_n = V_T\\mu_n = (0.025852)(1350) = 34.90\\ \\mathrm{cm^2/s}$$

$$D_p = V_T\\mu_p = (0.025852)(480) = 12.41\\ \\mathrm{cm^2/s}$$

Independent check on the ratio: $D_n/D_p$ must equal $\\mu_n/\\mu_p$ exactly
since both share the same $V_T$, and $34.90/12.41 = 2.812$ against
$1350/480 = 2.8125$. Consistent.

These two numbers are worth carrying. They are what makes electrons the
preferred carrier for fast devices — an electron diffuses nearly three times as
fast as a hole, so an n-channel transistor beats a p-channel one of the same
geometry by that factor, which is why CMOS layouts make the p-channel devices
physically wider.

### Worked example 8.2 — comparing a drift current with a diffusion current

Given: n-type silicon with $n = 1 \\times 10^{16}$ cm⁻³ in a field of 100 V/cm,
and separately an injected hole excess of $1 \\times 10^{14}$ cm⁻³ falling
linearly to zero over 50 µm.

Drift, from $J_n = qn\\mu_n E$:

$$J_{n,drift} = (1.602 \\times 10^{-19})(1 \\times 10^{16})(1350)(100) = 216.3\\ \\mathrm{A/cm^2}$$

Units check: (C)(cm⁻³)(cm²/(V·s))(V/cm) = C/(s·cm²) = A/cm². Correct.

Diffusion, from $J_p = -qD_p\\,dp/dx$ with
$dp/dx = -(1 \\times 10^{14})/(5 \\times 10^{-3}\\ \\mathrm{cm}) = -2 \\times 10^{16}$ cm⁻⁴:

$$J_{p,diff} = -(1.602 \\times 10^{-19})(12.41)(-2 \\times 10^{16}) = 0.0398\\ \\mathrm{A/cm^2} = 39.8\\ \\mathrm{mA/cm^2}$$

Units check: (C)(cm²/s)(cm⁻⁴) = C/(s·cm²) = A/cm². Correct.

The drift current is 5400 times larger, but that comparison is unfair and
instructive at once: the drift term is carried by $10^{16}$ majority carriers
and the diffusion term by $10^{14}$ minority ones. Per carrier, diffusion is
doing far more work. In a forward-biased diode the entire current is minority
diffusion, and the fields are so small in the neutral regions that drift is
negligible there — the roles reverse completely depending on where in the
device you stand.

## 8.3 What limits mobility, and when it stops being a constant

Mobility is not a material constant; it depends on doping and on temperature
through two competing scattering mechanisms.

**Lattice (phonon) scattering** grows with temperature because a hotter lattice
vibrates more. The tabulated model exponent for silicon electrons is
$\\mu_L \\propto T^{-2.4}$, so mobility FALLS as the crystal heats.

**Ionised impurity scattering** weakens with temperature because faster
carriers spend less time near each charged dopant core, giving
$\\mu_I \\propto T^{+3/2}$. It also strengthens with doping, since more dopants
means more scatterers.

The two combine through Matthiessen's rule applied to the reciprocals:

$$\\frac{1}{\\mu} = \\frac{1}{\\mu_L} + \\frac{1}{\\mu_I}$$

so the SMALLER mobility dominates, exactly as the larger resistivity does in
the metal case. Lightly doped silicon at room temperature is lattice-limited
and its mobility falls with heating; heavily doped or cryogenic material is
impurity-limited and the trend reverses. Practically, $\\mu_n$ falls from
1350 cm²/(V·s) at low doping to a few hundred at $10^{18}$ cm⁻³, which is why
this chapter's tabulated values are labelled "low doping" and why a heavily
doped resistor is not simply a lightly doped one scaled.

Mobility also fails at high fields. Drift velocity cannot exceed the
**saturation velocity**, about $1 \\times 10^{7}$ cm/s in silicon, so the linear
relation $v = \\mu E$ breaks down above a critical field of roughly

$$E_{crit} \\approx \\frac{v_{sat}}{\\mu_n} = \\frac{1 \\times 10^{7}}{1350} = 7.4 \\times 10^{3}\\ \\mathrm{V/cm}$$

At 100 V/cm, worked example 8.2's field, the drift velocity is
$\\mu_n E = 1.35 \\times 10^{5}$ cm/s, comfortably below saturation. Inside a
short-channel transistor, where a volt falls across a fraction of a micrometre,
the field is tens of kilovolts per centimetre and velocity saturation is the
dominant physics.

## 8.4 Conductivity of doped material, both types

With the carrier concentrations of section 7 in hand, conductivity is a
substitution:

$$\\sigma = q(n\\mu_n + p\\mu_p), \\qquad \\rho = \\frac{1}{\\sigma}$$

### Worked example 8.3 — n-type and p-type at the same doping

Given: two silicon samples, one with $N_D = 1 \\times 10^{16}$ cm⁻³ and one with
$N_A = 1 \\times 10^{16}$ cm⁻³, both at 300 K, using the low-doping mobilities.

n-type, keeping both terms so the minority contribution can be sized:

$$\\sigma_n = (1.602 \\times 10^{-19})\\left[(1 \\times 10^{16})(1350) + (2.25 \\times 10^{4})(480)\\right] = (1.602 \\times 10^{-19})(1.35 \\times 10^{19} + 1.08 \\times 10^{7})$$

The hole term is $1.08 \\times 10^{7}$ against $1.35 \\times 10^{19}$, a fraction
of $8 \\times 10^{-13}$ — twelve orders down, as section 3.1 claimed. Dropping
it:

$$\\sigma_n = 2.163\\ \\mathrm{S/cm}, \\qquad \\rho_n = 0.4623\\ \\Omega \\cdot \\mathrm{cm}$$

p-type, same doping:

$$\\sigma_p = (1.602 \\times 10^{-19})(1 \\times 10^{16})(480) = 0.7690\\ \\mathrm{S/cm}, \\qquad \\rho_p = 1.300\\ \\Omega \\cdot \\mathrm{cm}$$

Independent route on the comparison: the ratio of resistivities must be exactly
the inverse ratio of mobilities, since the carrier concentrations are equal.
$1.300/0.4623 = 2.812$ against $1350/480 = 2.8125$. Consistent. p-type silicon
is 2.81 times more resistive than n-type at the same doping, purely because
holes are less mobile — and that single fact drives an enormous amount of
device layout.

## 8.5 Generation, recombination, and how far a carrier gets

Carriers are created and destroyed continuously. In equilibrium the two rates
balance and $np = n_i^2$; disturb the population and the excess decays. For
low-level injection into n-type material the net recombination rate is
proportional to the excess:

$$U = \\frac{\\Delta p}{\\tau_p}$$

where $\\tau_p$ is the **minority carrier lifetime**, a strong function of
material quality — nanoseconds in defective material, milliseconds in the
float-zone silicon used for power devices. Left alone, an injected population
decays exponentially:

$$\\Delta p(t) = \\Delta p(0)\\,e^{-t/\\tau_p}$$

If instead carriers are injected steadily at one face and recombine as they
diffuse inward, the steady-state continuity equation is

$$D_p\\frac{d^2\\Delta p}{dx^2} = \\frac{\\Delta p}{\\tau_p}$$

whose decaying solution defines the **diffusion length**:

$$\\Delta p(x) = \\Delta p(0)\\,e^{-x/L_p}, \\qquad L_p = \\sqrt{D_p\\tau_p}$$

Dimensional check: (cm²/s)(s) = cm², whose square root is a length. Correct.
The diffusion length answers the question every device design asks: how far
does an injected minority carrier get before it disappears?

### Worked example 8.4 — lifetime, diffusion length, and photoconductivity

Given: n-type silicon, $N_D = 1 \\times 10^{16}$ cm⁻³, minority hole lifetime
$\\tau_p = 2$ µs, illuminated so that $\\Delta n = \\Delta p = 1 \\times 10^{14}$ cm⁻³
uniformly.

Diffusion length:

$$L_p = \\sqrt{(12.41\\ \\mathrm{cm^2/s})(2 \\times 10^{-6}\\ \\mathrm{s})} = \\sqrt{2.482 \\times 10^{-5}} = 4.982 \\times 10^{-3}\\ \\mathrm{cm} = 49.8\\ \\mu\\mathrm{m}$$

For comparison the electron diffusion length at the same lifetime is
$\\sqrt{(34.90)(2 \\times 10^{-6})} = 8.354 \\times 10^{-3}$ cm, or 83.5 µm. Both
are tens of micrometres, which is why the neutral regions of a discrete diode
are made comparable to that scale and why wafer thickness matters for solar
cells.

Recombination rate at the injected level:

$$U = \\frac{1 \\times 10^{14}}{2 \\times 10^{-6}} = 5 \\times 10^{19}\\ \\mathrm{cm^{-3}s^{-1}}$$

Photoconductivity, the extra conductivity the light produces:

$$\\Delta\\sigma = q(\\Delta n\\,\\mu_n + \\Delta p\\,\\mu_p) = (1.602 \\times 10^{-19})(1 \\times 10^{14})(1350 + 480) = 0.02932\\ \\mathrm{S/cm}$$

against the dark conductivity of 2.163 S/cm from worked example 8.3 — a change
of 1.36%. Note that BOTH mobilities appear here even though the material is
doped, because light creates carriers in PAIRS and the excess electron and hole
populations are equal. That is the one situation where the "drop the minority
term" rule of section 3.1 does not apply, and it is exactly what makes a
photoconductor work.

Check that low-level injection is legitimate:
$\\Delta p/N_D = 1 \\times 10^{14}/1 \\times 10^{16} = 1\\%$ for the minority
carriers relative to the majority population, so the majority concentration is
essentially unchanged and the linear lifetime model applies. Push the
illumination two orders higher and the analysis would need the full
Shockley-Read-Hall form,

$$U = \\frac{pn - n_i^2}{\\tau(n + p + 2n_i)}$$

which reduces to $\\Delta p/\\tau_p$ only when one carrier type dominates the
denominator.`,
      examTip: 'The Einstein relation D = V_T mu is the bridge between the two transport mechanisms and it is worth memorising as numbers: for silicon at 300 K, D_n = 34.9 and D_p = 12.4 cm squared per second. Any item that gives you a mobility and asks for a diffusion length is asking you to multiply by 25.85 mV first.',
      importantNote: 'Optical or injected excess carriers come in PAIRS, so both mobility terms count in the conductivity change even in heavily doped material. The rule that only the majority term matters applies to the equilibrium conductivity of doped material, not to the change produced by injection.',
    },
    {
      id: 'semi-junction',
      title: '9. The p-n Junction: Built-in Potential, Depletion, and the Diode Law',
      content: `## 9.1 Why a potential appears with no battery attached

Bring p-type and n-type silicon into contact. The enormous concentration
gradients drive holes into the n side and electrons into the p side. Each
departing carrier leaves behind an ionised dopant core that cannot move, so a
region of fixed charge builds up: negative acceptor cores on the p side,
positive donor cores on the n side. That charge creates a field pointing from
n to p, and the field opposes further diffusion. Equilibrium is reached when
drift exactly cancels diffusion — which is the same condition that produced the
Einstein relation, now applied to a step in doping.

The potential difference across the junction can be read directly off the Fermi
levels. Before contact, the n side has $E_F - E_i = kT\\ln(N_D/n_i)$ and the p
side has $E_i - E_F = kT\\ln(N_A/n_i)$. After contact the Fermi level must be
flat, so the bands bend by the sum of those two shifts:

$$qV_{bi} = kT\\ln\\!\\left(\\frac{N_D}{n_i}\\right) + kT\\ln\\!\\left(\\frac{N_A}{n_i}\\right)$$

$$V_{bi} = V_T\\ln\\!\\left(\\frac{N_A N_D}{n_i^2}\\right)$$

The $n_i^2$ in the denominator is not decoration: it is why the built-in
potential depends on temperature twice over, once through $V_T$ in front and
much more strongly through $n_i^2$ inside the logarithm, and the second effect
wins. Heating a junction REDUCES its built-in potential.

### Worked example 9.1 — built-in potential of an asymmetric junction

Given: $N_A = 1 \\times 10^{17}$ cm⁻³ on the p side, $N_D = 1 \\times 10^{16}$
cm⁻³ on the n side, $n_i = 1.5 \\times 10^{10}$ cm⁻³ at 300 K,
$V_T = 0.025852$ V.

$$\\frac{N_A N_D}{n_i^2} = \\frac{(1 \\times 10^{17})(1 \\times 10^{16})}{2.25 \\times 10^{20}} = 4.444 \\times 10^{12}$$

$$V_{bi} = (0.025852)\\ln(4.444 \\times 10^{12}) = (0.025852)(29.123) = 0.7529\\ \\mathrm{V}$$

Independent route, adding the two Fermi shifts computed separately in worked
example 7.5: the n side contributed 0.3467 eV and the p side 0.4062 eV, and
$0.3467 + 0.4062 = 0.7529$ eV. Identical, which confirms both the logarithm and
the claim that $V_{bi}$ is just the sum of the two level displacements.

Now the doping dependence, since section 2.2 flagged the range. Symmetric
doping at $10^{15}$ on both sides gives
$V_T\\ln(10^{30}/2.25 \\times 10^{20}) = (0.025852)(22.215) = 0.574$ V; at
$10^{18}$ on both sides it gives $(0.025852)(36.030) = 0.931$ V. So the built-in
potential runs from about 0.57 V to about 0.93 V across the practical doping
range. It is emphatically NOT a constant 0.7 V, and it is not the same quantity
as a diode's forward "on" voltage either, though the two land in the same
neighbourhood for common doping.

## 9.2 The depletion region, from Poisson's equation

Assume the transition is abrupt and that the depleted region is completely
swept of mobile carriers — the **depletion approximation**. Poisson's equation
in one dimension is then driven by the fixed dopant charge alone:

$$\\frac{d^2\\psi}{dx^2} = +\\frac{qN_A}{\\varepsilon} \\quad \\mathrm{on\\ the\\ p\\ side}, \\qquad -x_p < x < 0$$

$$\\frac{d^2\\psi}{dx^2} = -\\frac{qN_D}{\\varepsilon} \\quad \\mathrm{on\\ the\\ n\\ side}, \\qquad 0 < x < x_n$$

Integrating once gives a field that is triangular, peaking at the junction and
falling linearly to zero at each depletion edge. Overall neutrality requires
the two charge blocks to be equal:

$$qN_A x_p = qN_D x_n \\quad \\Longrightarrow \\quad N_A x_p = N_D x_n$$

which says the depletion region extends further into the LIGHTLY doped side, in
inverse proportion to the doping. The peak field follows from either block:

$$E_{max} = \\frac{qN_D x_n}{\\varepsilon} = \\frac{qN_A x_p}{\\varepsilon}$$

and the total potential is the area under the triangular field profile:

$$V_{bi} = \\frac{1}{2}E_{max}W, \\qquad W = x_n + x_p$$

Combining those three relations and solving for the total width:

$$W = \\sqrt{\\frac{2\\varepsilon V_{bi}}{q}\\left(\\frac{1}{N_A} + \\frac{1}{N_D}\\right)}$$

Dimensional check: $\\varepsilon V/q$ has units (F/m)(V)/(C) = (C/V/m)(V)/C =
1/m, and multiplying by a volume per particle (m³) gives m², whose square root
is a length. Correct.

### Worked example 9.2 — depletion width, peak field and capacitance

Given: the junction of worked example 9.1, $V_{bi} = 0.7529$ V, with silicon's
tabulated relative permittivity 11.7 so
$\\varepsilon = 11.7 \\times 8.8541878128 \\times 10^{-12} = 1.03594 \\times 10^{-10}$ F/m.
Work in SI, so $N_A = 1 \\times 10^{23}$ m⁻³ and $N_D = 1 \\times 10^{22}$ m⁻³.

$$\\frac{1}{N_A} + \\frac{1}{N_D} = 1 \\times 10^{-23} + 1 \\times 10^{-22} = 1.1 \\times 10^{-22}\\ \\mathrm{m^3}$$

$$W = \\sqrt{\\frac{2(1.03594 \\times 10^{-10})(0.7529)(1.1 \\times 10^{-22})}{1.602176634 \\times 10^{-19}}} = \\sqrt{1.0710 \\times 10^{-13}} = 3.2726 \\times 10^{-7}\\ \\mathrm{m}$$

so $W = 0.327$ µm. Splitting it by the neutrality condition
$x_n/x_p = N_A/N_D = 10$:

$$x_n = W\\frac{N_A}{N_A + N_D} = 0.3273 \\times \\frac{10}{11} = 0.2975\\ \\mu\\mathrm{m}, \\qquad x_p = 0.0298\\ \\mu\\mathrm{m}$$

Ninety-one percent of the depletion region sits in the lightly doped n side.
Peak field, by the first route:

$$E_{max} = \\frac{2V_{bi}}{W} = \\frac{2(0.7529)}{3.2726 \\times 10^{-7}} = 4.60 \\times 10^{6}\\ \\mathrm{V/m} = 46.0\\ \\mathrm{kV/cm}$$

Independent route, from the charge instead of the area:
$E_{max} = qN_Dx_n/\\varepsilon = (1.602176634 \\times 10^{-19})(1 \\times 10^{22})(2.9751 \\times 10^{-7})/(1.03594 \\times 10^{-10})$,
which gives $4.60 \\times 10^{6}$ V/m as well. The two routes use completely
different relations — one integrates the field, the other differentiates it —
so their agreement checks the whole construction.

Forty-six kilovolts per centimetre exists across a third of a micrometre of
silicon with no supply attached. It is well below silicon's breakdown field of
roughly 300 kV/cm, which is what reverse bias is capable of reaching.

![Field and potential profiles through an abrupt p-n junction, both drawn as fractions of their own peak, computed from the depletion approximation for a p side doped ten to the seventeenth and an n side doped ten to the sixteenth per cubic centimetre. The field is a triangle peaking at the metallurgical junction and the potential is the pair of parabolas that integrates it, with ninety-one percent of the width on the lightly doped side.](/courses/fe-ee/figures/mat2-junction-profile.svg)

## 9.3 Bias, and what moves

Applying a reverse bias $V_R$ adds directly to the built-in barrier, so every
result above scales with $V_{bi} + V_R$ in place of $V_{bi}$:

$$W(V_R) = W_0\\sqrt{1 + \\frac{V_R}{V_{bi}}}, \\qquad E_{max}(V_R) = E_{max,0}\\sqrt{1 + \\frac{V_R}{V_{bi}}}$$

The depleted region is a parallel-plate capacitor with the depletion width as
its separation, so the junction capacitance per unit area follows immediately:

$$\\frac{C_j}{A} = \\frac{\\varepsilon}{W} = \\frac{C_{j0}/A}{\\sqrt{1 + V_R/V_{bi}}}$$

### Worked example 9.3 — a junction under 10 V reverse bias

Given: the same junction, $W_0 = 0.3273$ µm, $V_{bi} = 0.7529$ V,
$\\varepsilon = 1.03594 \\times 10^{-10}$ F/m.

$$\\sqrt{1 + \\frac{10}{0.7529}} = \\sqrt{14.282} = 3.779$$

$$W(10) = 0.3273 \\times 3.779 = 1.237\\ \\mu\\mathrm{m}, \\qquad E_{max}(10) = 46.0 \\times 3.779 = 174\\ \\mathrm{kV/cm}$$

Zero-bias capacitance per unit area:

$$\\frac{C_{j0}}{A} = \\frac{1.03594 \\times 10^{-10}}{3.2726 \\times 10^{-7}} = 3.166 \\times 10^{-4}\\ \\mathrm{F/m^2} = 31.66\\ \\mathrm{nF/cm^2}$$

and at 10 V reverse it is $31.66/3.779 = 8.38$ nF/cm². The capacitance fell by a
factor of 3.78 for a 10 V change — which is a varactor, and the reason a
reverse-biased diode tunes a resonant circuit. It is also why a rectifier
recovers slowly: the charge stored in that capacitance has to be removed before
the diode can block.

![Depletion width and junction capacitance against reverse bias, each as a multiple of its zero-bias value, computed from the square-root law. At ten volts reverse the layer is three point seven seven nine times wider and the capacitance three point seven seven nine times smaller.](/courses/fe-ee/figures/mat2-depletion-bias.svg)

Forward bias does the opposite: it subtracts from the barrier, narrows the
depletion region, and lets the diffusion current that the barrier was holding
back flood across. That is the diode equation.

## 9.4 The diode equation, with its saturation current derived

Lowering the barrier by $V$ multiplies the number of carriers with enough
energy to cross by the Boltzmann factor $e^{V/V_T}$, while the reverse-flowing
generated current is unaffected by bias. Subtracting the two:

$$I = I_S\\left(e^{V/(\\eta V_T)} - 1\\right)$$

with $\\eta$ the ideality factor, 1 for an ideal diffusion-dominated diode and
up to 2 where recombination in the depletion region dominates. Take $\\eta = 1$
throughout below. The saturation current is not a free parameter — it follows
from the minority diffusion on each side:

$$I_S = qA n_i^2\\left(\\frac{D_p}{L_p N_D} + \\frac{D_n}{L_n N_A}\\right)$$

Every factor there has already been computed in this chapter, which makes the
whole diode characteristic a derived object rather than a curve fit.

### Worked example 9.4 — building a diode's characteristic from material data

Given: junction area $A = 1 \\times 10^{-4}$ cm², $N_A = 1 \\times 10^{17}$ and
$N_D = 1 \\times 10^{16}$ cm⁻³, lifetimes 1 µs on both sides, and the transport
values $D_n = 34.90$, $D_p = 12.41$ cm²/s from worked example 8.1.

Diffusion lengths first:

$$L_p = \\sqrt{(12.41)(1 \\times 10^{-6})} = 3.523 \\times 10^{-3}\\ \\mathrm{cm}, \\qquad L_n = \\sqrt{(34.90)(1 \\times 10^{-6})} = 5.908 \\times 10^{-3}\\ \\mathrm{cm}$$

The two bracket terms:

$$\\frac{D_p}{L_pN_D} = \\frac{12.41}{(3.523 \\times 10^{-3})(1 \\times 10^{16})} = 3.523 \\times 10^{-13}, \\qquad \\frac{D_n}{L_nN_A} = \\frac{34.90}{(5.908 \\times 10^{-3})(1 \\times 10^{17})} = 5.907 \\times 10^{-14}$$

The n side, being lightly doped, supplies 86% of the total — injection always
runs preferentially INTO the lightly doped side, which is the design principle
behind every one-sided junction. Summing to $4.113 \\times 10^{-13}$:

$$I_S = (1.602 \\times 10^{-19})(1 \\times 10^{-4})(2.25 \\times 10^{20})(4.113 \\times 10^{-13}) = 1.483 \\times 10^{-15}\\ \\mathrm{A}$$

About 1.5 femtoamps. Now find the forward voltage at 1 mA:

$$V = V_T\\ln\\!\\left(\\frac{I}{I_S}\\right) = (0.025852)\\ln\\!\\left(\\frac{1 \\times 10^{-3}}{1.483 \\times 10^{-15}}\\right) = (0.025852)(27.237) = 0.7041\\ \\mathrm{V}$$

There is the famous 0.7 V, DERIVED — from the gap through $n_i$, from the
mobilities through the Einstein relation, from the lifetimes through the
diffusion lengths, and from the geometry through the area. It is not a
constant of nature and it is not an assumption. Change the area to
$1 \\times 10^{-2}$ cm², a hundred times larger, and $I_S$ rises by 100, so the
forward voltage at the same current falls by $V_T\\ln 100 = 119$ mV to 0.585 V.
A big diode has a lower forward drop at a given current, and now you can say by
exactly how much.

Independent check on the decade rule: at 0.1 mA the same formula gives
$(0.025852)\\ln(6.743 \\times 10^{10}) = 0.6446$ V, and
$0.7041 - 0.6446 = 0.0595$ V — precisely $V_T\\ln 10$, as section 4.1 promised.

## 9.5 Temperature, quantified

Two effects run in opposite directions and both are worth being able to derive.
Model the saturation current's temperature dependence by holding the geometry
and transport factors fixed and letting $n_i^2 \\propto T^3 e^{-E_g/kT}$ carry
it:

$$\\frac{I_S(T)}{I_S(300)} = \\left(\\frac{T}{300}\\right)^{3}\\exp\\!\\left[\\frac{E_g}{k}\\left(\\frac{1}{300} - \\frac{1}{T}\\right)\\right]$$

Taking the logarithmic derivative gives the doubling temperature:

$$\\frac{d\\ln I_S}{dT} = \\frac{3}{T} + \\frac{E_g}{kT^2} = 0.01 + \\frac{1.12}{(8.617333 \\times 10^{-5})(90000)} = 0.01 + 0.14441 = 0.15441\\ \\mathrm{K^{-1}}$$

$$T_{double} = \\frac{\\ln 2}{0.15441} = 4.49\\ \\mathrm{K}$$

which is the 4.5 °C figure quoted in section 4.2, and exactly half the 8.98 K
doubling temperature of $n_i$ itself, as it must be since $I_S$ goes as $n_i^2$.

Now the forward voltage at FIXED current. Writing
$V = V_T\\ln(I/I_S)$ and substituting the model for $I_S$:

$$V(T) = \\frac{E_g}{q} + \\frac{kT}{q}\\left[\\ln\\frac{I}{K} - 3\\ln T\\right]$$

for a temperature-independent constant $K$. Differentiating:

$$\\frac{dV}{dT} = \\frac{V - E_g/q}{T} - \\frac{3k}{q}$$

### Worked example 9.5 — the two millivolts per degree, derived

Given: the diode of worked example 9.4 at 300 K, $E_g/q = 1.12$ V,
$3k/q = 3(8.617333 \\times 10^{-5}) = 2.585 \\times 10^{-4}$ V/K.

At the 1 mA operating point, $V = 0.7041$ V:

$$\\frac{dV}{dT} = \\frac{0.7041 - 1.12}{300} - 2.585 \\times 10^{-4} = -1.3862 \\times 10^{-3} - 2.585 \\times 10^{-4} = -1.645\\ \\mathrm{mV/K}$$

At a lower current where $V = 0.600$ V:

$$\\frac{dV}{dT} = \\frac{0.600 - 1.12}{300} - 2.585 \\times 10^{-4} = -1.7333 \\times 10^{-3} - 2.585 \\times 10^{-4} = -1.992\\ \\mathrm{mV/K}$$

So the celebrated "2 mV per degree" is not a universal constant either: it is
the value at a forward drop near 0.6 V, and it shrinks in magnitude as the
operating current rises. The formula shows why — the coefficient depends on how
far $V$ sits below the band-gap voltage, and a diode biased AT $E_g/q$ would
have a coefficient of only $-3k/q = -0.26$ mV/K. That observation is the basis
of the band-gap voltage reference, which sums a diode drop against a
proportional-to-absolute-temperature voltage to land near 1.2 V with almost no
temperature coefficient at all.

![Diode forward characteristic on a logarithmic current axis at two hundred fifty, three hundred and three hundred fifty kelvin, computed from the Shockley equation with the saturation current carried by its n i squared temperature law. A dashed one-milliamp bias line shows the forward voltage walking from zero point seven eight five volts down to zero point six two one volts across the hundred-kelvin span.](/courses/fe-ee/figures/mat2-diode-temperature.svg)

The figure makes the practical point that a table of numbers cannot: heating
does not move a threshold, it moves the WHOLE exponential sideways. Two
consequences follow directly. A diode drop makes a serviceable thermometer,
linear to a few tenths of a percent over a useful span. And paralleled diodes
or transistors share badly, because the hotter one needs less voltage for the
same current, so it takes more current, so it gets hotter — the thermal-runaway
loop of section 2.2, now with a number attached to its gain.`,
      examTip: 'Built-in potential is V_T ln(N_A N_D / n_i squared) and it depends on doping, running from about 0.57 V to 0.93 V over the practical range. It is not 0.7 V by definition and it is not the same thing as a diode forward drop, which additionally depends on the current and the junction area.',
      importantNote: 'The depletion region extends into the LIGHTLY doped side in inverse proportion to doping, because the two fixed-charge blocks must be equal. For a ten-to-one doping ratio, ninety-one percent of the width sits on the light side - which is why a one-sided junction lets you treat the heavily doped side as a contact.',
    },
    {
      id: 'semi-practice',
      title: '10. Practice Problems and Recurring Errors',
      content: `## 10.1 Practice Problems: carriers and concentrations

**P1.** Silicon at 300 K is doped with $N_D = 2 \\times 10^{15}$ cm⁻³ and
$N_A = 5 \\times 10^{14}$ cm⁻³. Find $n$ and $p$, and verify both governing
equations.

*Answer.* Net doping is
$N = 2 \\times 10^{15} - 5 \\times 10^{14} = 1.5 \\times 10^{15}$ cm⁻³, which is
five orders above $n_i$, so the shortcut is safe but must still be checked
against neutrality:

$$n \\approx 1.5 \\times 10^{15}\\ \\mathrm{cm^{-3}}, \\qquad p = \\frac{2.25 \\times 10^{20}}{1.5 \\times 10^{15}} = 1.5 \\times 10^{5}\\ \\mathrm{cm^{-3}}$$

Mass action: $(1.5 \\times 10^{15})(1.5 \\times 10^{5}) = 2.25 \\times 10^{20}$.
Neutrality: $n - p = 1.5 \\times 10^{15}$ to eleven figures, matching
$N_D - N_A$. Both satisfied, and the material is n-type.

*The trap.* Using $N_D$ alone and reporting $n = 2 \\times 10^{15}$, which
ignores the acceptors entirely and gets both carrier concentrations wrong by
33%. Compensated doping subtracts; it does not simply add the majority
species.

**P2.** At what temperature does the intrinsic concentration of silicon reach
the doping level of $1 \\times 10^{15}$ cm⁻³, and why does that temperature
matter?

*Answer.* From the anchored law of section 6.4 the ratio needed is
$n_i(T)/n_i(300) = 1 \\times 10^{15}/1.5 \\times 10^{10} = 6.667 \\times 10^{4}$.
Solving the anchored formula numerically gives $T = 565$ K, or 292 °C. Above
that temperature thermally generated pairs outnumber the dopants, the material
stops behaving as n-type at all, and every junction in the device leaks freely.
That is the physical ceiling behind silicon's 150 to 200 °C rating — real
devices fail well before the intrinsic crossover because leakage becomes
intolerable long before it becomes total.

*The trap.* Answering with the local doubling rule: $6.667 \\times 10^{4}$ is
$\\log_2(6.667 \\times 10^{4}) = 16.0$ doublings, and at 9 K each that suggests
144 K of rise, giving 444 K. The true answer is 565 K, because the doubling
interval lengthens as temperature rises. The local rule is for local questions.

**P3.** A silicon sample is measured to have $n = 4 \\times 10^{10}$ cm⁻³ at
300 K. Find $p$ and the net doping.

*Answer.* Mass action gives the minority population directly:

$$p = \\frac{2.25 \\times 10^{20}}{4 \\times 10^{10}} = 5.625 \\times 10^{9}\\ \\mathrm{cm^{-3}}$$

and neutrality then gives the net doping:

$$N_D - N_A = n - p = 4.000 \\times 10^{10} - 0.5625 \\times 10^{10} = 3.4375 \\times 10^{10}\\ \\mathrm{cm^{-3}}$$

*The trap.* Assuming $N_D = n = 4 \\times 10^{10}$, which is 16% high. At
concentrations within a decade or so of $n_i$ the majority carrier count and
the doping are genuinely different numbers, and this problem is constructed to
be in exactly that regime. Verify by substituting back: with
$N = 3.4375 \\times 10^{10}$ the quadratic returns
$n = 4.000 \\times 10^{10}$, closing the loop.

## 10.2 Practice Problems: transport and conductivity

**P4.** Find the resistivity of p-type silicon doped
$N_A = 5 \\times 10^{16}$ cm⁻³, using the low-doping mobility
$\\mu_p = 480$ cm²/(V·s), and state why the answer is optimistic.

*Answer.*

$$\\sigma = q p \\mu_p = (1.602 \\times 10^{-19})(5 \\times 10^{16})(480) = 3.845\\ \\mathrm{S/cm}$$

$$\\rho = \\frac{1}{3.845} = 0.2601\\ \\Omega \\cdot \\mathrm{cm}$$

It is optimistic because 480 cm²/(V·s) is the LOW-DOPING hole mobility, and at
$5 \\times 10^{16}$ cm⁻³ ionised-impurity scattering has already reduced the
real mobility appreciably, so the true resistivity is higher than computed. The
FE will not usually ask for the corrected value, but it does ask which
direction the error runs.

*The trap.* Including the minority electron term. Here
$n = 2.25 \\times 10^{20}/5 \\times 10^{16} = 4500$ cm⁻³, and its contribution to
the bracket is $(4500)(1350) = 6.075 \\times 10^{6}$ against
$(5 \\times 10^{16})(480) = 2.4 \\times 10^{19}$ — a fraction of
$2.5 \\times 10^{-13}$. It is not merely small, it is unmeasurable.

**P5.** An n-type silicon bar has $\\mu_n = 1350$ cm²/(V·s) and a minority hole
lifetime of 5 µs. Find the hole diffusion coefficient, the hole diffusion
length, and the time for an injected pulse to decay to 10% of its initial
value.

*Answer.* The bar's electron mobility is given, but the question asks about
HOLES, so use $\\mu_p = 480$ cm²/(V·s):

$$D_p = V_T\\mu_p = (0.025852)(480) = 12.41\\ \\mathrm{cm^2/s}$$

$$L_p = \\sqrt{(12.41)(5 \\times 10^{-6})} = \\sqrt{6.205 \\times 10^{-5}} = 7.877 \\times 10^{-3}\\ \\mathrm{cm} = 78.8\\ \\mu\\mathrm{m}$$

$$t = \\tau_p\\ln 10 = (5 \\times 10^{-6})(2.3026) = 1.151 \\times 10^{-5}\\ \\mathrm{s} = 11.5\\ \\mu\\mathrm{s}$$

*The trap.* Using the quoted electron mobility for the hole calculation, which
gives $D = 34.9$ and $L = 132$ µm — a 68% error in the length, and the quoted
$\\mu_n$ is in the problem precisely as bait. Minority carriers in n-type
material are HOLES.

**P6.** A silicon sample carries a uniform field of 2 kV/cm. Is the linear
mobility model valid for electrons? Compute the drift velocity and compare with
saturation.

*Answer.* The linear estimate is

$$v_d = \\mu_n E = (1350)(2000) = 2.7 \\times 10^{6}\\ \\mathrm{cm/s}$$

against a saturation velocity of $1 \\times 10^{7}$ cm/s, so the linear result is
27% of saturation and the model is beginning to bend but is not yet badly
wrong. The critical field where the extrapolated linear velocity would reach
saturation is $1 \\times 10^{7}/1350 = 7.4 \\times 10^{3}$ V/cm, and 2 kV/cm is
comfortably below it.

*The trap.* Assuming the linear model always holds and reporting velocities
above $1 \\times 10^{7}$ cm/s at higher fields. No carrier in silicon travels
faster than that in steady state, whatever $\\mu E$ says.

## 10.3 Practice Problems: junctions and diodes

**P7.** A silicon p-n junction has $N_A = 1 \\times 10^{18}$ and
$N_D = 1 \\times 10^{15}$ cm⁻³. Find the built-in potential, the depletion width
at zero bias, and the fraction of that width on each side.

*Answer.*

$$V_{bi} = (0.025852)\\ln\\!\\left(\\frac{(1 \\times 10^{18})(1 \\times 10^{15})}{2.25 \\times 10^{20}}\\right) = (0.025852)\\ln(4.444 \\times 10^{12}) = 0.7529\\ \\mathrm{V}$$

— the same 0.7529 V as worked example 9.1, because the PRODUCT of the doping is
the same even though the individual values differ by three orders of magnitude.
For the width, with $N_A = 1 \\times 10^{24}$ and $N_D = 1 \\times 10^{21}$ m⁻³:

$$\\frac{1}{N_A} + \\frac{1}{N_D} = 1 \\times 10^{-24} + 1 \\times 10^{-21} = 1.001 \\times 10^{-21}\\ \\mathrm{m^3}$$

$$W = \\sqrt{\\frac{2(1.03594 \\times 10^{-10})(0.7529)(1.001 \\times 10^{-21})}{1.602176634 \\times 10^{-19}}} = \\sqrt{9.7460 \\times 10^{-13}} = 9.872 \\times 10^{-7}\\ \\mathrm{m}$$

so $W = 0.987$ µm, three times the width of the more symmetric junction at the
same $V_{bi}$, and $x_n/x_p = N_A/N_D = 1000$, so 99.9% of it lies in the n
side.

*The trap.* Expecting the built-in potential to change when the doping ratio
changes. It depends only on the product, so a junction can be made one-sided
without altering $V_{bi}$ at all — which is exactly why one-sided junctions are
useful.

**P8.** A silicon diode carries 2 mA at 0.65 V and 300 K. What voltage gives
20 mA at the same temperature, and what is the saturation current?

*Answer.* Ratios first, no exponentials required:

$$\\Delta V = V_T\\ln\\!\\left(\\frac{20}{2}\\right) = (0.025852)(2.3026) = 0.0595\\ \\mathrm{V} \\quad \\Longrightarrow \\quad V = 0.7095\\ \\mathrm{V}$$

For the saturation current, invert the diode equation at the given point:

$$I_S = \\frac{I}{e^{V/V_T} - 1} = \\frac{2 \\times 10^{-3}}{e^{25.143}} = \\frac{2 \\times 10^{-3}}{8.308 \\times 10^{10}} = 2.407 \\times 10^{-14}\\ \\mathrm{A}$$

using $0.65/0.025852 = 25.143$, and dropping the $-1$ against
$8.3 \\times 10^{10}$.

*The trap.* Two of them. Using 26 mV instead of 25.85 mV in the exponent gives
$e^{25.0} = 7.20 \\times 10^{10}$ and an $I_S$ of $2.778 \\times 10^{-14}$ A, 15%
high — small enough to pass unnoticed and large enough to miss a bracketed
answer. And treating the 0.7 V rule as gospel would put the 20 mA point at
0.7 V rather than 0.7095 V, discarding the entire content of the question.

**P9.** The junction of worked example 9.2 has a zero-bias capacitance of
31.7 nF/cm². What reverse bias halves it?

*Answer.* Capacitance goes as the inverse square root of $(1 + V_R/V_{bi})$, so
halving it needs that bracket to equal 4:

$$1 + \\frac{V_R}{V_{bi}} = 4 \\quad \\Longrightarrow \\quad V_R = 3V_{bi} = 3(0.7529) = 2.259\\ \\mathrm{V}$$

*The trap.* Answering $V_R = 4V_{bi} = 3.01$ V by forgetting the 1, or
answering $2V_{bi}$ by taking the square root of the wrong side. The bracket
must reach 4 because the square root of 4 is the factor of 2 in the
capacitance, and the built-in potential is already inside the bracket before
any bias is applied.

**P10.** A silicon diode has a forward drop of 0.62 V at 1 mA and 25 °C. What
is its drop at the same current at 85 °C, and how much does the reverse
saturation current change?

*Answer.* Forward voltage, using the derived coefficient at a 0.62 V operating
point:

$$\\frac{dV}{dT} = \\frac{0.62 - 1.12}{298} - 2.585 \\times 10^{-4} = -1.6779 \\times 10^{-3} - 2.585 \\times 10^{-4} = -1.936\\ \\mathrm{mV/K}$$

$$V(85\\ ^{\\circ}\\mathrm{C}) \\approx 0.62 - (1.936 \\times 10^{-3})(60) = 0.62 - 0.116 = 0.504\\ \\mathrm{V}$$

The saturation current, doubling every 4.49 K, rises by

$$2^{60/4.49} = 2^{13.36} = 1.05 \\times 10^{4}$$

so roughly ten thousandfold. A real diode's measured reverse leakage, dominated
by depletion-region generation and doubling every 9 K instead, rises by
$2^{60/9} = 2^{6.67} = 102$, or about a hundredfold.

*The trap.* Applying the 4.49 K doubling rate to a MEASURED leakage current.
The ideal $I_S$ in the Shockley equation and the leakage a meter reads on a
real diode are different currents with different temperature laws, and quoting
a ten-thousandfold rise for something a datasheet says goes up a hundredfold is
the kind of discrepancy that should prompt a second look at which current is
being discussed.

## 10.4 Extended error table

| Error | What it looks like | Why it happens | The fix |
|---|---|---|---|
| E_g instead of E_g/2 in the n_i exponent | n_i squared away from reality | the square root in sqrt(N_C N_V) forgotten | an electron and hole split the gap between them |
| Total doping used instead of net | compensated material badly wrong | acceptors ignored in n-type | n minus p equals N_D minus N_A |
| Majority shortcut near n_i | 29% low on n, 40% high on p | the quadratic was skipped | solve n squared minus N n minus n_i squared equals zero |
| Only mass action checked | an answer that violates neutrality | one equation used for two unknowns | verify n minus p as well as n p |
| Local doubling rule extrapolated | n_i overestimated by 6x over 100 K | the rate falls as 1 over T squared | use the anchored formula for wide spans |
| Electron mobility used for holes | diffusion length 68% high | the problem quoted mu_n as bait | minority carriers in n-type are holes |
| Minority term kept in doped sigma | needless two-term sums | symmetry with the intrinsic case | the minority term is 1e-13 of the total |
| Injection treated like doping | photoconductivity a third too low | one mobility used | injected carriers come in pairs; both count |
| V_bi assumed to be 0.7 V | wrong depletion width and field | a rule of thumb taken as a definition | V_bi is V_T ln(N_A N_D over n_i squared) |
| The 1 dropped in the bias bracket | capacitance ratios wrong | 1 + V_R over V_bi read as V_R over V_bi | the built-in potential is there at zero bias |
| Ideal I_S rate used for real leakage | a hundredfold error over 60 K | two different currents share a name | I_S goes as n_i squared, generation leakage as n_i |
| Celsius in the exponential | V_T of 2 mV at "T = 25" | the kelvin conversion skipped | every T in these formulas is absolute |`,
      examTip: 'Every carrier-concentration answer must satisfy BOTH n p equal to n_i squared and n minus p equal to the net doping. Checking the second one costs five seconds and catches every version of the compensated-doping and near-intrinsic traps, which between them account for most of the lost marks in this topic.',
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
thickness 10 μm, operated at 50 V.

**Capacitance.** C = εr·ε₀·A/d:

C = 2000 × 8.854×10⁻¹² × (1×10⁻⁴) / (10×10⁻⁶) = **177 nF**

**Field check.** E = V/d = 50 / 10×10⁻⁶ = **5 MV/m**. A ceramic layer this
thin (10 μm) withstands fields of order 100 MV/m — thin layers break down at
far higher fields than bulk ceramic — so the operating field is about 5% of
breakdown, comfortably inside a 30–50% design ceiling.

**Stored energy.** U = ½CV² = 0.5 × 1.77×10⁻⁷ × 50² = **0.22 mJ**.

Three formulas, one component, and every number audited. Real multilayer parts
stack dozens to hundreds of such layers in parallel — capacitances in parallel
add, so a 100-layer stack of this geometry is already 17.7 μF in a few cubic
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
      examTip: 'Capacitor geometry problems are unit-conversion problems: area arrives in cm², thickness in μm, and both must reach SI before C = εr·ε₀·A/d. A wrong answer that is a clean power of ten away from an option is a conversion slip, not a method error.',
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

Given: a 10 μm polymer film with breakdown strength 200 MV/m, derated to 40% of
breakdown. Maximum working voltage:

V = 0.40 × 200×10⁶ × 10×10⁻⁶ = **800 V**

Field times thickness is voltage — the breakdown NUMBER is a field, and
forgetting the thickness multiplication (or the derating) generates the
distractor set.

## 5.3 Mains-frequency dielectric heating

Given: a 1 μF capacitor with tan δ = 0.02 across 230 V rms, 50 Hz.

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
discharges even though the glass is loafing at about an eighth of its own
strength — bulk glass withstands of order 10 MV/m, so 1.25 MV/m is roughly 12%
of it, not the sub-1% figure you would get by mistakenly applying mica's
150 MV/m to glass. Had the 5 mm been solid glass, the field would be a uniform
2 MV/m everywhere and nothing would break down.

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
| Thickness left in μm | capacitance 10⁶ too large | d in metres before dividing |
| Breakdown field read as a voltage | "the film survives 200 MV" | multiply by thickness: V = E·d |
| Fixed-Q and fixed-V cases swapped | energy rising when it should fall | disconnected → Q fixed; source attached → V fixed |
| tan δ treated as frequency-independent | loss extrapolated across decades | tabulated tan δ holds near its stated frequency only |`,
      examTip: 'Dielectric-insertion energy questions hinge on one reading-comprehension bit: is the capacitor still connected to the source? Fixed charge means energy falls when εr rises; fixed voltage means it rises. Decide that before computing anything.',
    },
    {
      id: 'diel-polarisation',
      title: '6. Polarisation Mechanisms and Dielectric Dispersion',
      content: `## 6.1 What an insulator does with a field

A conductor answers a field by moving charge through itself. An insulator has
no charge free to move, so it answers by displacing bound charge *within* each
atom, ion or molecule. Every such displacement is an electric **dipole moment**

$$\\mathbf{p} = q\\,\\mathbf{d}$$

where $q$ is the displaced charge and $\\mathbf{d}$ the separation vector,
pointing from the negative to the positive member of the pair. The unit is the
coulomb-metre; the older molecular unit is the debye, with
$1\\ \\mathrm{D} = 3.33564 \\times 10^{-30}\\ \\mathrm{C} \\cdot \\mathrm{m}$.

Summing those moments over a volume and dividing by it gives the
**polarisation**, the single field that carries the whole material response:

$$\\mathbf{P} = \\frac{1}{V}\\sum_k \\mathbf{p}_k = N\\langle \\mathbf{p}\\rangle$$

with $N$ the number density of contributing units. The dimensional reading of
$\\mathbf{P}$ is worth pausing on:
$(\\mathrm{C} \\cdot \\mathrm{m})/\\mathrm{m^3} = \\mathrm{C/m^2}$. Polarisation
carries the units of a SURFACE charge density, and that is not a coincidence —
uniform polarisation leaves uncompensated bound charge exactly on the two faces
perpendicular to $\\mathbf{P}$, of areal density $\\sigma_b = P$. Everything a
dielectric does to a capacitor follows from those two bound sheets partially
cancelling the free charge on the plates.

## 6.2 Permittivity assembled from polarisation

Gauss's law counts free charge only if the bound charge is folded into a new
field, the **electric displacement**

$$\\mathbf{D} = \\varepsilon_0\\mathbf{E} + \\mathbf{P}$$

For a linear, isotropic, non-polar-ordered material the polarisation tracks the
field, $\\mathbf{P} = \\varepsilon_0\\chi_e\\mathbf{E}$, with $\\chi_e$ the
dimensionless **electric susceptibility**. Substituting,

$$\\mathbf{D} = \\varepsilon_0(1 + \\chi_e)\\mathbf{E} = \\varepsilon_0\\varepsilon_r\\mathbf{E}, \\qquad \\varepsilon_r = 1 + \\chi_e$$

So relative permittivity is not an extra postulate: it is one plus the
susceptibility, and the susceptibility is the polarisation per unit of
$\\varepsilon_0\\mathbf{E}$. A vacuum has $\\chi_e = 0$ and therefore
$\\varepsilon_r = 1$ exactly, which is the anchor every table is written
against. Throughout this chapter
$\\varepsilon_0 = 8.8541878128 \\times 10^{-12}\\ \\mathrm{F/m}$.

## 6.3 Four mechanisms, four clocks

Bound charge can be displaced in four physically distinct ways, and they differ
by more than twelve decades in how fast they can follow a reversing field.

| Mechanism | What moves | Follows the field up to | Contribution to $\\varepsilon_r$ |
|---|---|---|---|
| Electronic | the electron cloud against its nucleus | optical, $\\sim 10^{15}$ Hz | 1 to 3, present in every material |
| Ionic (atomic) | whole ions against one another | infrared, $\\sim 10^{12}$ to $10^{13}$ Hz | a few to tens, in ionic solids |
| Orientational (dipolar) | permanent molecular dipoles rotating | microwave, $\\sim 10^{9}$ to $10^{11}$ Hz | tens, in polar liquids and polymers |
| Interfacial (Maxwell-Wagner) | charge piling up at internal boundaries | audio and below, $\\lesssim 10^{4}$ Hz | very large and very variable |

The ordering is by inertia. An electron cloud has almost none, so it keeps up
with visible light; an ion is thousands of times heavier and gives up in the
infrared; a whole molecule fighting its neighbours' viscosity gives up in the
microwave band; and space charge crawling to an internal interface may need
milliseconds. Each mechanism, as it drops out, subtracts its own contribution
from $\\varepsilon_r$ — which is why permittivity is a DECREASING staircase in
frequency, never a single number.

![Real and imaginary permittivity of a four-mechanism model spectrum against frequency on logarithmic axes, computed from two Debye relaxations and two Lorentz oscillators whose parameters are stated in the lesson. The upper panel shows the real part descending in four steps from 233.4 at low frequency to 1 in the far ultraviolet; the lower panel shows that every step down is accompanied by a peak in the loss.](/courses/fe-ee/figures/mat3-polar-dispersion.svg)

The model behind the figure is declared, not measured: two relaxations
(interfacial with $\\Delta\\varepsilon = 180$ at 300 Hz, orientational with
$\\Delta\\varepsilon = 45$ at 2 GHz) and two oscillators (ionic with
$\\Delta\\varepsilon = 5$ at 8 THz, electronic with $\\Delta\\varepsilon = 2.4$
at 2 PHz). Adding them to the vacuum baseline gives
$1 + 180 + 45 + 5 + 2.4 = 233.4$ at low frequency and 1 above the last
resonance, and the figure asserts both endpoints. No real material has exactly
this spectrum; every real material has this SHAPE.

Between the last relaxation and the first resonance the model sits at
$1 + 5 + 2.4 = 8.4$, and above the ionic resonance at $1 + 2.4 = 3.4$. That
last plateau is the OPTICAL permittivity, and its square root
$\\sqrt{3.4} = 1.8439$ is the refractive index. The identity
$n = \\sqrt{\\varepsilon_r}$ at optical frequency is the reason a table of
low-frequency $\\varepsilon_r$ never predicts a material's optics: water has
$\\varepsilon_r = 80$ at 1 kHz and $n = 1.33$, which is
$\\varepsilon_r = 1.77$, because 78 of those 80 units are rotation that light
is far too fast to excite.

## 6.4 Worked: how much of water's permittivity is molecular rotation

Given: water at 20 °C. Tabulated inputs, each named — molecular dipole moment
1.85 D, density 1000 kg/m³, molar mass 18.015 g/mol,
$k_B = 1.380649 \\times 10^{-23}$ J/K, $N_A = 6.02214076 \\times 10^{23}$/mol.

Step 1, the moment in SI:

$$p = 1.85\\ \\mathrm{D} \\times 3.33564 \\times 10^{-30}\\ \\mathrm{C} \\cdot \\mathrm{m/D} = 6.171 \\times 10^{-30}\\ \\mathrm{C} \\cdot \\mathrm{m}$$

Step 2, the number density:

$$N = \\frac{\\rho N_A}{M} = \\frac{(1.000 \\times 10^{6}\\ \\mathrm{g/m^3})(6.02214076 \\times 10^{23}\\ \\mathrm{mol^{-1}})}{18.015\\ \\mathrm{g/mol}} = 3.3428 \\times 10^{28}\\ \\mathrm{m^{-3}}$$

Step 3, the Langevin result for weak fields. Thermal agitation randomises the
dipoles; the field biases them only slightly, and expanding the Langevin
function for $pE \\ll k_BT$ gives an average moment $\\langle p\\rangle = p^2E/(3k_BT)$,
so the orientational polarisability is

$$\\alpha_o = \\frac{p^2}{3k_BT} = \\frac{(6.171 \\times 10^{-30})^2}{3(1.380649 \\times 10^{-23})(293.15)} = 3.1362 \\times 10^{-39}\\ \\mathrm{C} \\cdot \\mathrm{m^2/V}$$

Dimensional check: $(\\mathrm{C} \\cdot \\mathrm{m})^2/\\mathrm{J}$, and since
$1\\ \\mathrm{J} = 1\\ \\mathrm{C} \\cdot \\mathrm{V}$ this is
$\\mathrm{C} \\cdot \\mathrm{m^2/V}$ — moment per unit field, which is what a
polarisability must be.

Step 4, susceptibility if every molecule felt the macroscopic field:

$$\\chi_e = \\frac{N\\alpha_o}{\\varepsilon_0} = \\frac{(3.3428 \\times 10^{28})(3.1362 \\times 10^{-39})}{8.8541878128 \\times 10^{-12}} = 11.84$$

giving $\\varepsilon_r = 12.84$ against a measured 80.1. The prediction is low
by a factor of 6.2, and that gap is the honest lesson: a molecule does not sit
in the macroscopic field, it sits in the field of its polarised neighbours as
well. The classical repair, the Clausius-Mossotti relation

$$\\frac{\\varepsilon_r - 1}{\\varepsilon_r + 2} = \\frac{N\\alpha}{3\\varepsilon_0}$$

does not rescue water either: the right-hand side evaluates to 3.95, while the
left-hand side can never exceed 1. Clausius-Mossotti diverges once
$N\\alpha/(3\\varepsilon_0)$ reaches 1/3, and hydrogen-bonded liquids sail past
that. Water's permittivity needs the Onsager and Kirkwood corrections, which
are outside the FE syllabus — but knowing WHY the simple route fails is not,
because it is the same reason a mixture rule for a composite dielectric is
always approximate.

## 6.5 Debye relaxation, and the circle it draws

A rotating dipole does not stop instantly when the field reverses; it relaxes
with a time constant $\\tau$. Solving the resulting first-order response gives
the **Debye** form for the complex permittivity

$$\\varepsilon^*(\\omega) = \\varepsilon_\\infty + \\frac{\\varepsilon_s - \\varepsilon_\\infty}{1 + j\\omega\\tau}$$

whose real and imaginary parts separate into

$$\\varepsilon'(\\omega) = \\varepsilon_\\infty + \\frac{\\varepsilon_s - \\varepsilon_\\infty}{1 + \\omega^2\\tau^2}, \\qquad \\varepsilon''(\\omega) = \\frac{(\\varepsilon_s - \\varepsilon_\\infty)\\,\\omega\\tau}{1 + \\omega^2\\tau^2}$$

Here $\\varepsilon_s$ is the static (low-frequency) value and
$\\varepsilon_\\infty$ what is left once this mechanism has dropped out. Two
consequences follow immediately. The loss $\\varepsilon''$ is zero at both ends
and peaks where $\\omega\\tau = 1$, at the value
$(\\varepsilon_s - \\varepsilon_\\infty)/2$; and eliminating $\\omega\\tau$
between the two expressions gives a circle,

$$\\left(\\varepsilon' - \\frac{\\varepsilon_s + \\varepsilon_\\infty}{2}\\right)^{2} + (\\varepsilon'')^{2} = \\left(\\frac{\\varepsilon_s - \\varepsilon_\\infty}{2}\\right)^{2}$$

A single relaxation time therefore plots as an exact semicircle in the
$(\\varepsilon', \\varepsilon'')$ plane. Real materials with a distribution of
relaxation times plot as a depressed arc, and how far the arc is depressed is
how spread the distribution is — that is the entire content of the Cole-Cole
diagnostic.

![Cole-Cole plot of the Debye response of liquid water at twenty degrees Celsius, computed from the stated static permittivity 80.1, high-frequency permittivity 5.6 and relaxation time 9.4 picoseconds. The locus is an exact semicircle from 80.1 down to 5.6 on the real axis, with the apex at the relaxation frequency of 16.9 gigahertz and the 2.45 gigahertz oven band marked well up the low-frequency side.](/courses/fe-ee/figures/mat3-cole-cole-water.svg)

## 6.6 Worked: water at the oven frequency

Given: liquid water at 20 °C with tabulated Debye parameters
$\\varepsilon_s = 80.1$, $\\varepsilon_\\infty = 5.6$,
$\\tau = 9.4\\ \\mathrm{ps}$. Those three numbers vary between sources by a
percent or two and shift substantially with temperature; they are quoted here
as a 20 °C set, not as constants of nature.

Relaxation frequency:

$$f_{rel} = \\frac{1}{2\\pi\\tau} = \\frac{1}{2\\pi(9.4 \\times 10^{-12}\\ \\mathrm{s})} = 1.6931 \\times 10^{10}\\ \\mathrm{Hz} = 16.93\\ \\mathrm{GHz}$$

At the 2.45 GHz oven band, $\\omega\\tau = 2\\pi(2.45 \\times 10^{9})(9.4 \\times 10^{-12}) = 0.14470$, so

$$\\varepsilon' = 5.6 + \\frac{74.5}{1 + 0.14470^2} = 78.572, \\qquad \\varepsilon'' = \\frac{74.5(0.14470)}{1 + 0.14470^2} = 10.559$$

$$\\tan\\delta = \\frac{\\varepsilon''}{\\varepsilon'} = \\frac{10.559}{78.572} = 0.13439$$

Independent check, from the circle rather than from the two formulas: the point
$(78.572, 10.559)$ must satisfy
$(\\varepsilon' - 42.85)^2 + (\\varepsilon'')^2 = 37.25^2$. Left side:
$(35.722)^2 + (10.559)^2 = 1276.1 + 111.5 = 1387.6$, and $37.25^2 = 1387.6$.
The figure asserts that identity at every plotted frequency, not merely at
this one.

Note what the numbers say about oven design. At 2.45 GHz water is NOT at its
loss peak — the peak is at 16.9 GHz, nearly seven times higher. Ovens sit well
down the low-frequency flank deliberately: at the peak the loss is so large
that the field would be absorbed within a few millimetres and cook only the
surface. Section 8 turns this $\\varepsilon''$ into watts and into a
penetration depth.

## 6.7 Worked: predicting the relaxation time from viscosity

Debye's own estimate treats the molecule as a sphere of radius $a$ rotating
against the viscous drag of its neighbours, which gives

$$\\tau = \\frac{4\\pi\\eta a^{3}}{k_BT}$$

Given: water at 20 °C, tabulated viscosity
$\\eta = 1.002 \\times 10^{-3}\\ \\mathrm{Pa} \\cdot \\mathrm{s}$, molecular
radius taken as $a = 1.4 \\times 10^{-10}$ m (the conventional van der Waals
radius of the water molecule).

$$\\tau = \\frac{4\\pi(1.002 \\times 10^{-3})(1.4 \\times 10^{-10})^{3}}{(1.380649 \\times 10^{-23})(293.15)} = \\frac{3.4551 \\times 10^{-32}}{4.0473 \\times 10^{-21}} = 8.537 \\times 10^{-12}\\ \\mathrm{s}$$

Dimensional check:
$\\mathrm{Pa} \\cdot \\mathrm{s} \\times \\mathrm{m^3} = \\mathrm{N/m^2} \\cdot \\mathrm{s} \\cdot \\mathrm{m^3} = \\mathrm{N} \\cdot \\mathrm{m} \\cdot \\mathrm{s} = \\mathrm{J} \\cdot \\mathrm{s}$,
divided by $k_BT$ in joules leaves seconds.

That is 8.54 ps against the tabulated 9.4 ps — 9% low, from a model that knows
nothing but viscosity, temperature and molecular size. The agreement is the
point: dielectric relaxation in a liquid is a MECHANICAL process, and anything
that thickens the liquid slows it. Cooling water raises $\\eta$ faster than it
lowers $T$, so $\\tau$ rises and the loss peak walks down in frequency, which
is exactly why frozen food heats so badly in a microwave: ice has a relaxation
frequency in the kilohertz, and at 2.45 GHz its $\\varepsilon''$ is
comparatively tiny.`,
      examTip: 'Permittivity is a staircase in frequency, never a single number. If a stem gives you a low-frequency epsilon-r and asks about optical or microwave behaviour, the tabulated value is the wrong one to use, and the intended answer names the mechanism that has dropped out.',
    },
    {
      id: 'diel-boundary',
      title: '7. Permittivity, Boundary Conditions and Layered Insulation',
      content: `## 7.1 Two definitions of relative permittivity that must agree

Section 6 built $\\varepsilon_r = 1 + \\chi_e$ out of polarisation. The
laboratory definition is different in wording and identical in content: fill a
capacitor with the material and take the capacitance ratio,

$$\\varepsilon_r \\equiv \\frac{C_{\\text{filled}}}{C_{\\text{vacuum}}}$$

For a parallel plate that is immediate. In vacuum
$C_0 = \\varepsilon_0 A/d$; with the dielectric,
$D = \\varepsilon_0\\varepsilon_r E$ means the same plate charge supports
$\\varepsilon_r$ times the field-free-space value, so

$$C = \\varepsilon_0\\varepsilon_r\\frac{A}{d} = \\varepsilon_r C_0$$

and the two definitions coincide. Keeping both in view matters because exam
items switch between them without warning: a stem that says "the capacitance
rises by a factor of 4 when the slab is inserted" has just told you
$\\varepsilon_r = 4$ without using the word permittivity.

The energy stored follows from either route:

$$U = \\tfrac{1}{2}CV^{2} = \\tfrac{1}{2}\\varepsilon_0\\varepsilon_r\\frac{A}{d}V^{2}$$

and, per unit volume of dielectric, from the field alone:

$$u = \\frac{U}{Ad} = \\tfrac{1}{2}\\varepsilon_0\\varepsilon_r E^{2} = \\tfrac{1}{2}DE$$

The two must always reconcile, and section 7.4 checks a real case both ways.
Dimensional check on $u$: $\\mathrm{(F/m)(V/m)^2} = \\mathrm{F} \\cdot \\mathrm{V^2/m^3} = \\mathrm{J/m^3}$,
since $\\mathrm{F} \\cdot \\mathrm{V^2} = \\mathrm{C} \\cdot \\mathrm{V} = \\mathrm{J}$.

## 7.2 What survives an interface

At a boundary between two dielectrics carrying no free surface charge, the
integral forms of Gauss's law and of the electrostatic circulation law give one
condition each:

$$D_{n1} = D_{n2} \\quad \\Longrightarrow \\quad \\varepsilon_1 E_{n1} = \\varepsilon_2 E_{n2}$$

$$E_{t1} = E_{t2}$$

The NORMAL component of $\\mathbf{D}$ is continuous; the TANGENTIAL component of
$\\mathbf{E}$ is continuous. Which of the two governs a problem is decided by
geometry, and for a layered capacitor with the layers perpendicular to the
field it is the first: the flux density is the same in every layer, and the
field is therefore inversely proportional to permittivity,

$$E_i = \\frac{D}{\\varepsilon_0\\varepsilon_{r,i}}$$

with the layer voltages adding to the terminal voltage,

$$V = \\sum_i E_i d_i = D\\sum_i \\frac{d_i}{\\varepsilon_0\\varepsilon_{r,i}}$$

That last expression is worth reading as a circuit statement, because the sum
is exactly the reciprocal of a series capacitance per unit area:

$$\\frac{1}{C_{series}} = \\sum_i \\frac{d_i}{\\varepsilon_0\\varepsilon_{r,i}A}$$

Layered insulation IS series capacitors, and the voltage divides between series
capacitors inversely to their capacitance — which is the same statement as
field dividing inversely to permittivity.

## 7.3 Worked: air over glass, three independent routes

Given: 10 kV across a stack of 1 mm of air ($\\varepsilon_r = 1$) in series
with 4 mm of glass ($\\varepsilon_r = 4$), area 1 m² for convenience.

Route 1 — flux density first.

$$D = \\frac{V}{\\dfrac{d_1}{\\varepsilon_0\\varepsilon_{r1}} + \\dfrac{d_2}{\\varepsilon_0\\varepsilon_{r2}}} = \\frac{10^{4}}{\\dfrac{10^{-3}}{\\varepsilon_0} + \\dfrac{4 \\times 10^{-3}}{4\\varepsilon_0}} = \\frac{10^{4}\\,\\varepsilon_0}{2 \\times 10^{-3}} = 4.4271 \\times 10^{-5}\\ \\mathrm{C/m^2}$$

$$E_{air} = \\frac{D}{\\varepsilon_0} = 5.000 \\times 10^{6}\\ \\mathrm{V/m}, \\qquad E_{glass} = \\frac{D}{4\\varepsilon_0} = 1.250 \\times 10^{6}\\ \\mathrm{V/m}$$

Route 2 — series capacitance. Per square metre,
$C_1 = \\varepsilon_0/10^{-3} = 8.8542\\ \\mathrm{nF}$ and
$C_2 = 4\\varepsilon_0/(4 \\times 10^{-3}) = 8.8542\\ \\mathrm{nF}$; the two are
equal, so the series value is half of either, 4.4271 nF, and

$$D = \\frac{Q}{A} = \\frac{C_{series}V}{A} = (4.4271 \\times 10^{-9})(10^{4}) = 4.4271 \\times 10^{-5}\\ \\mathrm{C/m^2}$$

identical to route 1. The equality of $C_1$ and $C_2$ is the numerical
signature of the answer: two series capacitors of equal value split the voltage
evenly, so 5 kV lands on 1 mm of air and 5 kV on 4 mm of glass.

Route 3 — voltage sum, as a check:
$(5.00 \\times 10^{6})(10^{-3}) + (1.25 \\times 10^{6})(4 \\times 10^{-3}) = 5000 + 5000 = 10\\,000$ V.

![Field, flux density and potential plotted across a series stack of one millimetre of air and four millimetres of glass at ten kilovolts, all computed from the continuity of normal flux density. The upper panel shows the electric field stepping down by a factor of four at the interface while the flux density runs straight through unchanged; the lower panel shows the potential climbing steeply through the thin air layer and gently through the thick glass.](/courses/fe-ee/figures/mat3-layer-field.svg)

## 7.4 Worked: the same stack by energy, both ways

Lumped route, per square metre of plate:

$$U = \\tfrac{1}{2}C_{series}V^{2} = \\tfrac{1}{2}(4.4271 \\times 10^{-9})(10^{4})^{2} = 0.22135\\ \\mathrm{J/m^2}$$

Field route, integrating $u = \\tfrac{1}{2}\\varepsilon_0\\varepsilon_r E^2$ over
each layer separately, because the integrand is constant inside each:

$$U_{air} = \\tfrac{1}{2}\\varepsilon_0(1)(5.00 \\times 10^{6})^{2}(10^{-3}) = 0.110677\\ \\mathrm{J/m^2}$$

$$U_{glass} = \\tfrac{1}{2}\\varepsilon_0(4)(1.25 \\times 10^{6})^{2}(4 \\times 10^{-3}) = 0.110677\\ \\mathrm{J/m^2}$$

The two layers contribute equally, and their sum of 0.221355 J/m² reproduces
the lumped result to every printed digit. The split is also instructive: the thin
air layer, one fifth of the thickness, holds HALF the stored energy, because
energy density goes as $\\varepsilon_r E^2$ and the field advantage is squared
while the permittivity handicap is only linear. Where the field is high, the
energy is; and where the energy is, the failure will be.

This is also the place to name the classic factor error. Writing
$u = \\tfrac{1}{2}\\varepsilon_0 E^2$ inside a dielectric — dropping the
$\\varepsilon_r$ — understates the glass layer's energy fourfold, and it looks
plausible because the vacuum formula is the one most students memorise. The
guard is the $D$ form: $u = \\tfrac{1}{2}DE$ needs no memory of which
permittivity belongs where, because $D$ already carries it.

## 7.5 Where the stress goes, as a rule

The result generalises without arithmetic. For two layers of equal thickness,
the field ratio is exactly the inverse permittivity ratio, and each layer's
field relative to the average $E_{avg} = V/(d_1 + d_2)$ is

$$\\frac{E_1}{E_{avg}} = \\frac{2k}{k + 1}, \\qquad \\frac{E_2}{E_{avg}} = \\frac{2}{k + 1}, \\qquad k = \\frac{\\varepsilon_{r2}}{\\varepsilon_{r1}}$$

At $k = 1$ both are unity, as they must be. At $k = 10$ the weak layer carries
$20/11 = 1.82$ times the average field while the strong layer loafs at
$2/11 = 0.18$ times it. And as $k \\to \\infty$ the weak layer approaches TWICE
the average — for equal thicknesses it eventually carries the entire voltage
across half the total gap.

![Layer field divided by average field against the permittivity ratio of a two-layer stack of equal thicknesses, on a logarithmic ratio axis, computed from the continuity of flux density. The low-permittivity layer rises toward twice the average field while the high-permittivity layer falls toward zero, the two curves crossing at unity ratio where both equal the average.](/courses/fe-ee/figures/mat3-stack-stress-ratio.svg)

The design rule is therefore uncomfortable and unavoidable: putting a
high-permittivity insulator next to a low-permittivity one moves the stress
ONTO the low-permittivity one, and the lowest-permittivity material in most
real assemblies is a gas — air in a void, air in a delamination, air under a
badly seated washer. Section 10 follows that thought to partial discharge.

## 7.6 Worked: a three-layer bushing, and which layer decides the rating

Given: 20 kV across 0.5 mm of air, 2 mm of epoxy ($\\varepsilon_r = 4$), and
another 0.5 mm of air.

$$\\sum_i \\frac{d_i}{\\varepsilon_{r,i}} = \\frac{0.5}{1} + \\frac{2}{4} + \\frac{0.5}{1} = 1.5\\ \\mathrm{mm}$$

$$D = \\frac{\\varepsilon_0 V}{\\sum_i d_i/\\varepsilon_{r,i}} = \\frac{(8.8541878128 \\times 10^{-12})(2 \\times 10^{4})}{1.5 \\times 10^{-3}} = 1.1806 \\times 10^{-4}\\ \\mathrm{C/m^2}$$

$$E_{air} = \\frac{D}{\\varepsilon_0} = 1.3333 \\times 10^{7}\\ \\mathrm{V/m}, \\qquad E_{epoxy} = \\frac{D}{4\\varepsilon_0} = 3.3333 \\times 10^{6}\\ \\mathrm{V/m}$$

Voltage check:
$2(1.3333 \\times 10^{7})(5 \\times 10^{-4}) + (3.3333 \\times 10^{6})(2 \\times 10^{-3}) = 13\\,333 + 6667 = 20\\,000$ V.

The air layers stand 13.3 MV/m against a bulk air strength near 3 MV/m: they
are more than four times over, and the assembly discharges in the air long
before the epoxy notices. Two thirds of the applied voltage is being spent on
one third of the thickness. The fix is not thicker epoxy — that makes the
division WORSE by taking an even larger share of the geometric path away from
the layer that cannot afford it — but eliminating the air, which is what
vacuum impregnation and cast-in bushings are for.`,
      examTip: 'In a layered capacitor the flux density D is the quantity that runs straight through, and the field is D over epsilon-zero times epsilon-r in each layer. Solve for D once from the voltage, then read every layer field off it; solving layer by layer from the voltage invites the reciprocal error.',
    },
    {
      id: 'diel-loss-deep',
      title: '8. Loss Tangent, Dissipation Factor, ESR and Dielectric Heating',
      content: `## 8.1 Loss written into the permittivity

A perfect dielectric returns everything it stores. A real one lags, and the
tidiest bookkeeping makes permittivity complex:

$$\\varepsilon^{*} = \\varepsilon' - j\\varepsilon''$$

with $\\varepsilon'$ the storage term and $\\varepsilon''$ the loss term, both
usually quoted relative to $\\varepsilon_0$. The current drawn by a capacitor
whose vacuum capacitance is $C_0$ is then

$$I = j\\omega C_0\\varepsilon^{*}V = \\underbrace{j\\omega C_0\\varepsilon' V}_{\\text{quadrature}} + \\underbrace{\\omega C_0\\varepsilon'' V}_{\\text{in phase}}$$

The in-phase piece is a conductance. Writing $C = C_0\\varepsilon'$ for the
capacitance actually measured,

$$G_p = \\omega C\\frac{\\varepsilon''}{\\varepsilon'} = \\omega C\\tan\\delta, \\qquad \\tan\\delta \\equiv \\frac{\\varepsilon''}{\\varepsilon'}$$

$\\delta$ is the angle by which the current falls short of a perfect 90°
quadrature. The **dissipation factor** DF is the same number, usually printed
as a percentage; the **quality factor** is its reciprocal:

$$Q = \\frac{1}{\\tan\\delta} = \\frac{\\varepsilon'}{\\varepsilon''}$$

Loss driven by a voltage source follows in one line:

$$P = V^{2}G_p = V^{2}\\omega C\\tan\\delta$$

which is the origin of the scaling the older sections quote: loss grows with
the SQUARE of voltage and the FIRST power of frequency, at fixed $\\tan\\delta$.

## 8.2 The same loss as a series resistance

A capacitor datasheet prefers a series model, because ripple current is what a
switching converter delivers. Setting the series impedance
$Z = R_s + 1/(j\\omega C)$ and computing its loss angle gives
$\\tan\\delta = \\omega C R_s$, hence

$$\\mathrm{ESR} = \\frac{\\tan\\delta}{\\omega C}$$

$$P = I_{rms}^{2}\\,\\mathrm{ESR}$$

The parallel and series pictures are the same physics, and at any one frequency
they give identical power — a fact worth checking rather than trusting, which
section 8.3 does. What they do NOT share is frequency behaviour: the
dielectric part of ESR falls as $1/\\omega$, so a real capacitor's ESR curve
descends until it hits the floor set by plate, lead and termination
resistance, and then stops.

![Equivalent series resistance and ripple heating against frequency for a hundred nanofarad capacitor with a loss tangent of 0.025, on logarithmic axes. The dielectric term falls as one over frequency, the total flattens onto a twenty milliohm metallic floor above about two megahertz, and the marked point shows a tenth of a watt of heating at a hundred kilohertz with half an amp of ripple.](/courses/fe-ee/figures/mat3-esr-frequency.svg)

## 8.3 Worked: ripple heating, and the two models reconciled

Given: 100 nF class-2 ceramic, $\\tan\\delta = 0.025$, carrying 0.5 A rms of
ripple at 100 kHz.

$$\\omega C = 2\\pi(10^{5})(10^{-7}) = 0.0628319\\ \\mathrm{S}$$

$$\\mathrm{ESR} = \\frac{0.025}{0.0628319} = 0.39789\\ \\Omega$$

$$P = I^{2}\\,\\mathrm{ESR} = (0.5)^{2}(0.39789) = 0.09947\\ \\mathrm{W}$$

Independent route, through the parallel model. The same ripple current across
an ideal 100 nF at 100 kHz develops

$$V = \\frac{I}{\\omega C} = \\frac{0.5}{0.0628319} = 7.9577\\ \\mathrm{V\\,rms}$$

$$P = V^{2}\\omega C\\tan\\delta = (7.9577)^{2}(0.0628319)(0.025) = 0.09947\\ \\mathrm{W}$$

Identical, as the algebra guarantees:
$V^2\\omega C\\tan\\delta = (I/\\omega C)^2\\omega C\\tan\\delta = I^2\\tan\\delta/(\\omega C)$.
The check is cheap and it catches the commonest slip in this material, which is
using the ripple current with the parallel formula or the ripple voltage with
the series one.

A tenth of a watt inside a 0603 chip is not negligible. With a thermal
resistance of order 100 K/W to the board, that is a rise of several kelvin
above an already warm plane — and $\\tan\\delta$ for class-2 ceramics generally
worsens with temperature, so the loop closes on itself.

## 8.4 Worked: film against class-2 ceramic in the same snubber

Given: 4.7 μF carrying 40 V rms of ripple at 20 kHz. Compare a polypropylene
film part with $\\tan\\delta = 2 \\times 10^{-4}$ against a class-2 ceramic with
$\\tan\\delta = 0.025$.

$$\\omega C = 2\\pi(2 \\times 10^{4})(4.7 \\times 10^{-6}) = 0.590619\\ \\mathrm{S}$$

Film:

$$P = V^{2}\\omega C\\tan\\delta = (40)^{2}(0.590619)(2 \\times 10^{-4}) = 0.18900\\ \\mathrm{W}$$

Class-2 ceramic:

$$P = (40)^{2}(0.590619)(0.025) = 23.625\\ \\mathrm{W}$$

A factor of 125, which is simply the ratio of the two loss tangents, because
everything else in the expression is identical. Twenty-four watts inside a
surface-mount ceramic is not a derating question, it is a fire; this is why AC
line and snubber duty is film territory and why substituting "the same
capacitance in a smaller package" is one of the more dangerous
value-engineering moves available.

The corresponding equivalent series resistances are
$2 \\times 10^{-4}/0.590619 = 0.339\\ \\mathrm{m\\Omega}$ and
$0.025/0.590619 = 42.3\\ \\mathrm{m\\Omega}$ — the same factor of 125, seen from
the series side.

## 8.5 Heating a volume, and how deep the heat gets

For a field inside a lossy dielectric the dissipated power per unit volume is

$$p_v = \\omega\\varepsilon_0\\varepsilon'' E_{rms}^{2} = \\sigma_{eff}E_{rms}^{2}, \\qquad \\sigma_{eff} = \\omega\\varepsilon_0\\varepsilon''$$

Dimensional check on $\\sigma_{eff}$:
$\\mathrm{s^{-1}} \\times \\mathrm{F/m} = \\mathrm{F/(m \\cdot s)} = \\mathrm{S/m}$,
because a farad per second is a siemens. Dielectric loss is
indistinguishable from an ohmic conductivity as far as the power balance is
concerned — which is why the two are so often confused, and why the
distinction only reappears when you change frequency.

How deep the heating reaches is set by attenuation. Writing
$\\alpha = (\\omega/c)\\,\\mathrm{Im}\\sqrt{\\varepsilon^{*}}$ for the amplitude
attenuation constant, the power penetration depth is

$$D_p = \\frac{1}{2\\alpha}$$

and in the low-loss limit this reduces to the more quotable

$$D_p \\approx \\frac{\\lambda_0\\sqrt{\\varepsilon'}}{2\\pi\\varepsilon''}$$

## 8.6 Worked: the microwave oven, run backwards

Given: 250 mL of water raised 60 K in 90 s. Water at 2.45 GHz and 20 °C has,
from section 6.6, $\\varepsilon' = 78.572$ and $\\varepsilon'' = 10.559$;
specific heat capacity 4182 J/(kg·K).

Effective conductivity:

$$\\sigma_{eff} = 2\\pi(2.45 \\times 10^{9})(8.8541878128 \\times 10^{-12})(10.559) = 1.4392\\ \\mathrm{S/m}$$

Power actually delivered to the load:

$$P = \\frac{mc\\,\\Delta T}{t} = \\frac{(0.250)(4182)(60)}{90} = 697.0\\ \\mathrm{W}$$

Volumetric:

$$p_v = \\frac{P}{\\mathcal{V}} = \\frac{697.0}{2.5 \\times 10^{-4}\\ \\mathrm{m^3}} = 2.788 \\times 10^{6}\\ \\mathrm{W/m^3}$$

and inverting the heating law for the field that must be present:

$$E_{rms} = \\sqrt{\\frac{p_v}{\\sigma_{eff}}} = \\sqrt{\\frac{2.788 \\times 10^{6}}{1.4392}} = 1392\\ \\mathrm{V/m}$$

Check by the other route: $\\sigma_{eff}E_{rms}^2 = (1.4392)(1392)^2 = 2.788 \\times 10^{6}$ W/m³,
and $p_v\\mathcal{V}/(mc) = 0.667$ K/s, which over 90 s is the 60 K asked for.

Penetration depth, from the exact expression with
$\\varepsilon^{*} = 78.572 - j10.559$: the square root is
$8.8840 - j0.59428$, so
$\\alpha = (2\\pi \\times 2.45 \\times 10^{9}/2.99792458 \\times 10^{8})(0.59428) = 30.52\\ \\mathrm{Np/m}$
and $D_p = 1/(2 \\times 30.52) = 1.64\\ \\mathrm{cm}$. The low-loss approximation
gives 1.63 cm, agreeing to within a percent because $\\varepsilon''$ really is
small next to $\\varepsilon'$ here.

Sixteen millimetres is the whole engineering story of the domestic oven: the
field is substantially absorbed within about that depth, so anything much
thicker cooks from the outside inward by ordinary conduction, and the turntable
exists because the standing-wave pattern of the cavity is not uniform. A 1.4
kV/m field, meanwhile, is far below air's 3 MV/m breakdown — the oven does not
arc on water, it arcs on metal edges where the field is concentrated by
hundreds.`,
      examTip: 'Loss tangent questions come in two dialects. Given a ripple CURRENT use ESR = tan delta over omega C and P = I squared times ESR; given a ripple VOLTAGE use P = V squared times omega C times tan delta. Both give the same watts, and mixing the two gives an answer wrong by the square of the reactance.',
    },
    {
      id: 'diel-breakdown',
      title: '9. Breakdown: Mechanisms, Thickness Dependence and the Series Stack',
      content: `## 9.1 Four ways an insulator stops insulating

Dielectric strength is not one phenomenon, and the mechanism decides which
variables matter.

| Mechanism | What happens | Time to fail | What controls it |
|---|---|---|---|
| Intrinsic (electronic) | field tears electrons from bonds directly | nanoseconds | pure material, field only |
| Avalanche | a seed electron multiplies through impact ionisation | microseconds | mean free path, thickness |
| Thermal | loss heating raises conductivity, which raises heating | seconds to hours | $\\tan\\delta$, cooling, ambient |
| Electrochemical or treeing | discharges and moisture erode a growing channel | months to years | voids, impurities, partial discharge |

Only the first is a material constant. Everything a datasheet calls "dielectric
strength" is a measurement under a stated waveform, electrode geometry,
thickness and ramp rate, and the FE-relevant consequence is that a single
tabulated MV/m is a starting point, never a guarantee.

## 9.2 Why thin is strong

Measured breakdown field rises as the sample gets thinner. Two reasons
compound: a thinner sample contains fewer of the defects that seed a failure
(a weakest-link, extreme-value effect), and there is less path length in which
an avalanche can build. Empirically the field follows a power law over several
decades,

$$E_{bd}(d) = E_{ref}\\left(\\frac{d}{d_{ref}}\\right)^{-n}$$

with $n$ typically between 0.2 and 0.5 for polymer films. Multiplying by
thickness turns that into the WITHSTAND VOLTAGE,

$$V_{bd}(d) = E_{bd}(d)\\,d = E_{ref}\\,d_{ref}^{\\,n}\\,d^{\\,1-n}$$

which still increases with thickness, but sublinearly. Doubling the thickness
does not double the rating.

![Breakdown field and withstand voltage against dielectric thickness on logarithmic axes, computed from a power law anchored at two hundred megavolts per metre at ten micrometres with an exponent of 0.35. The upper panel shows the field falling by a factor of five between ten micrometres and one millimetre; the lower panel shows the voltage still rising, but as thickness to the power 0.65.](/courses/fe-ee/figures/mat3-breakdown-thickness.svg)

## 9.3 Worked: what the exponent costs a designer

Given: a polymer whose breakdown field is 200 MV/m at $d_{ref} = 10\\ \\mu\\mathrm{m}$,
with $n = 0.35$. These are a stated anchor and a stated exponent, not universal
constants.

At 1 mm — a hundredfold thickness increase:

$$E_{bd} = 200\\left(\\frac{10^{-3}}{10^{-5}}\\right)^{-0.35} = 200(100)^{-0.35} = 200(0.19953) = 39.91\\ \\mathrm{MV/m}$$

The field capability has fallen fivefold. The voltage capability, however, has
risen:

$$\\frac{V_{bd}(10^{-3})}{V_{bd}(10^{-5})} = (100)^{1-0.35} = (100)^{0.65} = 19.95$$

so 2000 V becomes 39.9 kV, not 200 kV. And for the everyday case of simply
doubling a film thickness,

$$\\frac{V_{bd}(2d)}{V_{bd}(d)} = 2^{0.65} = 1.5692$$

Fifty-seven percent more voltage for one hundred percent more thickness, which
also means half the capacitance for the same area. That trade — capacitance
falling as $1/d$ while voltage rises only as $d^{0.65}$ — is why the energy
density of a film capacitor falls as its voltage rating rises, and why
high-voltage capacitor banks are built from series strings of moderate-voltage
parts rather than from single thick ones.

## 9.4 Gases: Paschen's law and the gap that is too small to break down

Solid breakdown scales smoothly. Gas breakdown does not, because it needs a
seed electron to gain ionising energy between collisions AND enough collisions
to multiply. The Townsend analysis gives

$$V_b = \\frac{B\\,(pd)}{\\ln(A\\,pd) - \\ln\\!\\left[\\ln\\!\\left(1 + \\dfrac{1}{\\gamma}\\right)\\right]}$$

where $p$ is pressure, $d$ the gap, $\\gamma$ the secondary-emission
coefficient of the cathode, and $A$, $B$ are gas constants. Breakdown voltage
depends on the PRODUCT $pd$, not on the gap alone — the Paschen similarity law.
Differentiating gives a minimum at

$$(pd)_{min} = \\frac{e\\,\\ln(1 + 1/\\gamma)}{A}, \\qquad V_{min} = \\frac{e\\,B\\,\\ln(1 + 1/\\gamma)}{A}$$

![Paschen breakdown voltage against pressure-gap product for air on logarithmic axes, computed from the Townsend expression with the stated constants A equal to fifteen per centimetre-torr, B equal to three hundred sixty-five volts per centimetre-torr, and a secondary emission coefficient of 0.01. The curve falls to a minimum of three hundred five volts and rises steeply on both sides, with a shaded band marking where the reduced field stays inside the range over which those constants were fitted.](/courses/fe-ee/figures/mat3-paschen-air.svg)

## 9.5 Worked: the Paschen minimum for air

Given, as stated constants for air with a typical metal cathode:
$A = 15\\ \\mathrm{(cm \\cdot torr)^{-1}}$,
$B = 365\\ \\mathrm{V/(cm \\cdot torr)}$, $\\gamma = 0.01$.

$$\\ln(1 + 1/\\gamma) = \\ln(101) = 4.61512$$

$$(pd)_{min} = \\frac{(2.718282)(4.61512)}{15} = 0.83635\\ \\mathrm{torr} \\cdot \\mathrm{cm}$$

$$V_{min} = \\frac{(2.718282)(365)(4.61512)}{15} = 305.27\\ \\mathrm{V}$$

A structural check that costs nothing: at the minimum the reduced field is
$V_{min}/(pd)_{min} = 305.27/0.83635 = 365.0\\ \\mathrm{V/(cm \\cdot torr)}$,
which is exactly $B$. That identity falls out of the differentiation and
confirms both numbers at once.

At atmospheric pressure, 760 torr, the minimum sits at a gap of
$0.83635/760 = 1.1\\ \\mu\\mathrm{m}$. Below that gap air simply will not break
down at any voltage the curve permits — the asymptote is at
$pd = \\ln(101)/15 = 0.3077\\ \\mathrm{torr} \\cdot \\mathrm{cm}$, and inside it
an electron cannot find enough molecules to ionise. This is why MEMS contacts
and IC metal spacings survive fields that would be preposterous in a
millimetre gap, and why vacuum is an excellent insulator until a surface
supplies its own vapour.

Two honesty notes. The constants $A$ and $B$ are fitted over a limited range of
reduced field, roughly 100 to 800 V/(cm·torr) for air, and the shaded band on
the figure marks it; outside that band the curve is qualitatively right and
quantitatively optimistic. And $\\gamma$ depends on cathode material and
surface condition, which is why handbook minima for air scatter between about
300 and 350 V rather than settling on one figure.

## 9.6 Worked: which layer of a series stack fails, with numbers

Given: the three-layer bushing of section 7.6 — 0.5 mm air, 2 mm epoxy
($\\varepsilon_r = 4$), 0.5 mm air, at 20 kV. Field results carried forward:
13.33 MV/m in each air layer, 3.33 MV/m in the epoxy. Tabulated strengths:
about 3 MV/m for bulk air at atmospheric pressure, and 20 MV/m for a
representative cast epoxy.

Utilisation of each material:

$$\\frac{E_{air}}{E_{bd,air}} = \\frac{13.33}{3} = 4.44, \\qquad \\frac{E_{epoxy}}{E_{bd,epoxy}} = \\frac{3.333}{20} = 0.167$$

The air is at 444% of its strength and the epoxy at 17% of its own. The
assembly fails in the air, and no amount of better epoxy helps.

Now solve the useful inverse. What terminal voltage keeps the air at 40% of its
strength, that is at 1.2 MV/m? The flux density that produces that field is
$D = \\varepsilon_0(1.2 \\times 10^{6}) = 1.0625 \\times 10^{-5}\\ \\mathrm{C/m^2}$,
and the terminal voltage follows from the same sum as before:

$$V = D\\sum_i\\frac{d_i}{\\varepsilon_0\\varepsilon_{r,i}} = (1.0625 \\times 10^{-5})\\frac{1.5 \\times 10^{-3}}{8.8541878128 \\times 10^{-12}} = 1800\\ \\mathrm{V}$$

Eighteen hundred volts, from an assembly with 3 mm of epoxy in it. The air is
costing more than an order of magnitude of rating. Replace both air layers with
epoxy and the whole 3 mm becomes uniform at
$V/(3 \\times 10^{-3})$; holding 40% of 20 MV/m then allows
$0.4(20 \\times 10^{6})(3 \\times 10^{-3}) = 24\\ \\mathrm{kV}$. The same
materials, the same thickness, thirteen times the rating — purely by removing
the gas.

That comparison is the single most transferable idea in dielectric design, and
it is the reason section 10 spends its length on voids.`,
      examTip: 'Breakdown numbers are FIELDS, in volts per metre. Multiply by thickness to get a voltage and divide voltage by thickness to get a field, and check the exponent story before scaling: doubling thickness raises withstand voltage by well under two because the strength itself falls with thickness.',
    },
    {
      id: 'diel-insulation',
      title: '10. Insulation Resistance, Surface Leakage, Partial Discharge and Corona',
      content: `## 10.1 Volume resistivity, surface resistivity, and two different failures

An insulator leaks through its bulk and across its surface, and the two are
measured and defeated differently.

Bulk leakage obeys the ordinary resistance law with the material's **volume
resistivity** $\\rho$ in Ω·m:

$$R = \\rho\\frac{d}{A}$$

For a coaxial geometry the integral over shells gives

$$R_{ins} = \\frac{\\rho}{2\\pi L}\\ln\\frac{b}{a}$$

Surface leakage uses **surface resistivity** $\\rho_s$, quoted in ohms per
square, so called because the resistance of any square patch of a surface is
independent of the square's size:

$$R_{surf} = \\rho_s\\frac{L}{W}$$

Volume resistivities of good polymers sit near $10^{14}$ to $10^{17}$ Ω·m,
falling steeply with temperature and with absorbed moisture; surface
resistivity is dominated by contamination and humidity rather than by the
polymer, which is why a clean dry insulator and the same insulator after a
season outdoors are different components. Tracking resistance, quoted as a
comparative tracking index in volts, measures how well a surface survives that
history.

## 10.2 The one product that does not care about geometry

Multiply the bulk insulation resistance of a capacitor by its own capacitance
and the geometry cancels exactly:

$$RC = \\left(\\rho\\frac{d}{A}\\right)\\left(\\varepsilon_0\\varepsilon_r\\frac{A}{d}\\right) = \\rho\\,\\varepsilon_0\\varepsilon_r$$

The self-discharge time constant of a capacitor is a MATERIAL property. This is
why capacitor datasheets specify insulation resistance as an
"ohm-farad" product (equivalently, megohm-microfarads, which are seconds) above
some capacitance and as a plain resistance below it. Dimensional check:
$\\Omega \\cdot \\mathrm{m} \\times \\mathrm{F/m} = \\Omega \\cdot \\mathrm{F} = \\mathrm{s}$.

## 10.3 Worked: self-discharge of three dielectrics

Given tabulated room-temperature volume resistivities and permittivities —
polypropylene $10^{16}$ Ω·m with $\\varepsilon_r = 2.2$, XLPE $10^{14}$ Ω·m with
$\\varepsilon_r = 2.3$, class-2 ceramic $10^{11}$ Ω·m with
$\\varepsilon_r = 2000$. All three vary by orders of magnitude with grade,
temperature and moisture; these are representative magnitudes.

$$\\tau_{PP} = (10^{16})(8.8541878128 \\times 10^{-12})(2.2) = 1.9479 \\times 10^{5}\\ \\mathrm{s} = 54.1\\ \\mathrm{h}$$

$$\\tau_{XLPE} = (10^{14})(8.8541878128 \\times 10^{-12})(2.3) = 2036\\ \\mathrm{s} = 33.9\\ \\mathrm{min}$$

$$\\tau_{cer} = (10^{11})(8.8541878128 \\times 10^{-12})(2000) = 1771\\ \\mathrm{s} = 29.5\\ \\mathrm{min}$$

The ceramic and the XLPE land within 15% of one another for entirely different
reasons: the ceramic has a resistivity a thousand times worse but a
permittivity nearly a thousand times better, and the product is what matters.
That is the practical content of the geometry-free identity, and it explains why
a sample-and-hold circuit uses polypropylene or PTFE and never a class-2
ceramic, regardless of how much capacitance the ceramic offers.

## 10.4 Worked: leakage and insulation resistance of a cable

Given: 1 km of single-core XLPE cable, conductor radius 5 mm, insulation outer
radius 9.5 mm, $\\rho = 10^{14}$ Ω·m, $\\varepsilon_r = 2.3$, operating at 8.7 kV
to earth.

$$R_{ins} = \\frac{\\rho}{2\\pi L}\\ln\\frac{b}{a} = \\frac{10^{14}}{2\\pi(1000)}\\ln(1.9) = \\frac{10^{14}(0.641854)}{6283.19} = 1.0215 \\times 10^{10}\\ \\Omega$$

$$I_{leak} = \\frac{8700}{1.0215 \\times 10^{10}} = 8.517 \\times 10^{-7}\\ \\mathrm{A} = 0.85\\ \\mu\\mathrm{A}$$

Independent check by the geometry-free product. The cable's capacitance is

$$C = \\frac{2\\pi\\varepsilon_0\\varepsilon_r L}{\\ln(b/a)} = \\frac{2\\pi(8.8541878128 \\times 10^{-12})(2.3)(1000)}{0.641854} = 199.4\\ \\mathrm{nF}$$

so $R_{ins}C = (1.0215 \\times 10^{10})(1.994 \\times 10^{-7}) = 2037\\ \\mathrm{s}$,
matching the $\\rho\\varepsilon_0\\varepsilon_r = 2036\\ \\mathrm{s}$ of section
10.3 to four figures. Two quantities computed from different formulas
reproducing a material constant is the strongest arithmetic check available in
this material.

The stress on the insulation is not uniform, incidentally. In a coaxial
geometry $E(r) = V/(r\\ln(b/a))$, so the maximum sits at the conductor surface:

$$E_{max} = \\frac{8700}{(0.005)(0.641854)} = 2.711 \\times 10^{6}\\ \\mathrm{V/m} = 2.71\\ \\mathrm{MV/m}$$

## 10.5 Voids, and why they are the whole problem

Section 7.5 established that a low-permittivity layer in series takes the high
field. A gas-filled void inside a solid insulator is that layer, and the
enhancement depends on its shape. For a flat disc-shaped void with its faces
perpendicular to the field, the flux density runs straight through and

$$E_{void} = \\varepsilon_r E_{bulk}$$

For a spherical void in a uniform field the solution of Laplace's equation
gives the milder

$$E_{void} = \\frac{3\\varepsilon_r}{2\\varepsilon_r + 1}E_{bulk}$$

The disc is far worse: at $\\varepsilon_r = 4$ the factors are 4.00 and 1.33
respectively. Delaminations and flat cracks are therefore much more dangerous
than round gas bubbles, which is exactly backwards from the intuition that a
bigger void is a worse void.

Whether the enhanced field actually discharges is a Paschen question, and for
small gaps in air the streamer inception criterion is usually written

$$E_{inc} = \\left(\\frac{E}{p}\\right)_{cr}p\\left[1 + \\frac{K}{\\sqrt{p\\,d}}\\right]$$

with tabulated air constants $(E/p)_{cr} = 24.2\\ \\mathrm{V/(Pa \\cdot m)}$ and
$K = 8.6\\ \\mathrm{Pa^{1/2}m^{1/2}}$. The bracket is the size correction: small
voids need much higher fields.

## 10.6 Worked: does this void discharge

Given: a cast epoxy insulator, $\\varepsilon_r = 4$, carrying a bulk field of
8 MV/m, containing a spherical air void 0.5 mm across at atmospheric pressure
101 325 Pa.

Field inside the void:

$$E_{void} = \\frac{3(4)}{2(4) + 1}(8 \\times 10^{6}) = \\frac{12}{9}(8 \\times 10^{6}) = 1.0667 \\times 10^{7}\\ \\mathrm{V/m}$$

Inception field for that size:

$$p\\,d = (101\\,325)(5 \\times 10^{-4}) = 50.66\\ \\mathrm{Pa} \\cdot \\mathrm{m}, \\qquad \\sqrt{p\\,d} = 7.118$$

$$E_{inc} = (24.2)(101\\,325)\\left[1 + \\frac{8.6}{7.118}\\right] = (2.4521 \\times 10^{6})(2.2082) = 5.415 \\times 10^{6}\\ \\mathrm{V/m}$$

Since $1.067 \\times 10^{7} > 5.42 \\times 10^{6}$, the void discharges — the
enhanced field is nearly twice the inception field. Each discharge dumps a
small charge, erodes the epoxy wall, and extends a conducting tree; the bulk
insulation is nowhere near its own 20 MV/m strength, and it will still fail,
after months or years. Partial discharge is a SLOW failure driven by a fast
event, which is why acceptance testing for HV apparatus measures picocoulombs
of discharge rather than merely applying a withstand voltage for a minute.

Had the same void been a flat delamination instead of a sphere, the field in it
would be $4(8 \\times 10^{6}) = 3.2 \\times 10^{7}$ V/m, six times inception
instead of twice.

## 10.7 Corona, and Peek's expression

In open air around a conductor, the same physics appears as **corona**: the
field at the conductor surface exceeds inception in a thin sheath, ionising the
air there without bridging to anything. Peek's empirical expression for the
surface field at onset, in SI form, is

$$E_v = 3 \\times 10^{6}\\,m\\,\\delta\\left(1 + \\frac{0.0301}{\\sqrt{\\delta\\,r}}\\right)$$

with $r$ the conductor radius in metres, $\\delta$ the air density relative to
standard conditions, and $m$ a surface-condition factor (1 for a polished
conductor, roughly 0.8 to 0.9 for a stranded or weathered one). The
corresponding line-to-neutral **disruptive critical voltage** for a conductor
spaced $D$ from its return is

$$V_d = E_v\\,r\\ln\\frac{D}{r}$$

The $1/\\sqrt{r}$ term says thin conductors need a HIGHER surface field to start
corona, but they reach that field at a much lower voltage — which is why corona
rings are fat, why EHV lines bundle several conductors per phase, and why a
sharp burr is where the buzzing starts.

## 10.8 Worked: corona onset on a transmission conductor

Given: a smooth conductor of radius 10 mm, phase spacing 3 m, standard air
density $\\delta = 1$, surface factor $m = 1$.

$$E_v = 3 \\times 10^{6}\\left(1 + \\frac{0.0301}{\\sqrt{0.01}}\\right) = 3 \\times 10^{6}(1 + 0.301) = 3.903 \\times 10^{6}\\ \\mathrm{V/m}$$

$$V_d = (3.903 \\times 10^{6})(0.01)\\ln\\frac{3}{0.01} = (3.903 \\times 10^{4})(5.7038) = 2.226 \\times 10^{5}\\ \\mathrm{V}$$

That is 223 kV line to neutral, so a line-to-line rating of
$\\sqrt{3}(223) = 386\\ \\mathrm{kV}$ before fair-weather corona starts — a
comfortable but not generous margin on a 345 kV line, which is precisely the
regime where the design is made.

Now shrink the conductor to 1 mm radius:

$$E_v = 3 \\times 10^{6}\\left(1 + \\frac{0.0301}{\\sqrt{0.001}}\\right) = 3 \\times 10^{6}(1.9518) = 5.856 \\times 10^{6}\\ \\mathrm{V/m}$$

$$V_d = (5.856 \\times 10^{6})(0.001)\\ln\\frac{3}{0.001} = (5856)(8.0064) = 4.688 \\times 10^{4}\\ \\mathrm{V}$$

The onset field went UP by 50%, and the onset voltage went DOWN by a factor of
4.7. Both statements are true simultaneously and neither is the whole answer;
holding only the first is how a designer talks themselves into a thin
conductor. A weathered surface would take another 10 to 20% off through $m$,
and high-altitude air another slice through $\\delta$.`,
      examTip: 'The insulation-resistance times capacitance product equals rho times epsilon-zero times epsilon-r, in seconds, with the geometry cancelled. If a problem gives you resistivity, permittivity and any capacitance, the self-discharge time constant is available without ever touching the dimensions.',
    },
    {
      id: 'diel-families',
      title: '11. Capacitor Families Compared with Numbers',
      content: `## 11.1 The four figures of merit that actually separate families

Selection questions are decided by four quantities, and every family wins one
of them and loses another.

Energy per unit volume of dielectric, from section 7.1, evaluated at the
material's own field limit:

$$u_{max} = \\tfrac{1}{2}\\varepsilon_0\\varepsilon_r E_{bd}^{2}$$

Volumetric capacitance, the quantity a decoupling designer cares about:

$$\\frac{C}{\\mathcal{V}} = \\frac{\\varepsilon_0\\varepsilon_r A/d}{Ad} = \\frac{\\varepsilon_0\\varepsilon_r}{d^{2}}$$

Loss, as $\\tan\\delta$; and stability, as the temperature coefficient and the
voltage coefficient. The last of these is the one that catches people, because
class-1 and film dielectrics essentially do not have it and class-2 ceramics
have an enormous one.

## 11.2 Worked: energy density across four dielectrics

Given tabulated permittivities and representative breakdown strengths, each
named with its material and each varying with grade and thickness: air
($\\varepsilon_r = 1.0$, 3 MV/m), mica ($\\varepsilon_r = 6$, 150 MV/m),
biaxially oriented polypropylene film ($\\varepsilon_r = 2.2$, 500 MV/m), and a
class-2 ceramic ($\\varepsilon_r = 2000$, 20 MV/m).

$$u_{air} = \\tfrac{1}{2}(8.8541878128 \\times 10^{-12})(1.0)(3 \\times 10^{6})^{2} = 39.84\\ \\mathrm{J/m^3}$$

$$u_{mica} = \\tfrac{1}{2}(8.8541878128 \\times 10^{-12})(6)(150 \\times 10^{6})^{2} = 5.977 \\times 10^{5}\\ \\mathrm{J/m^3}$$

$$u_{film} = \\tfrac{1}{2}(8.8541878128 \\times 10^{-12})(2.2)(500 \\times 10^{6})^{2} = 2.435 \\times 10^{6}\\ \\mathrm{J/m^3}$$

$$u_{cer} = \\tfrac{1}{2}(8.8541878128 \\times 10^{-12})(2000)(20 \\times 10^{6})^{2} = 3.542 \\times 10^{6}\\ \\mathrm{J/m^3}$$

The ranking is the surprise: polypropylene, with a permittivity 900 times
smaller than the ceramic, lands within a factor of 1.5 of it, because the field
term is squared and film stands 25 times the field. The exponent decides the
contest, not the permittivity — and this is before the ceramic's voltage
coefficient is applied, which removes most of its remaining advantage in
service.

Air is four to five decades below the rest — 4.2 decades below mica and 4.9
below the ceramic — which is the whole reason vacuum and air-spaced capacitors
exist only where loss and stability matter far more than size.

## 11.3 The voltage coefficient, and what it does to a nominal value

A class-2 ceramic is ferroelectric. Its permittivity is a small-signal property
of a domain structure, and a DC bias progressively locks those domains, so the
capacitance falls. Datasheets present this as a capacitance-versus-DC-bias
curve, and the derating is severe: a small case size at its rated voltage may
retain well under half its nominal value. Class-1 (C0G/NP0) ceramics, film and
mica have no measurable effect of this kind.

Writing $k_V$ for the fractional retention at the applied bias, the effective
capacitance is

$$C_{eff} = k_V\\,C_{nom}$$

and, because energy goes as the square of voltage but only the first power of
capacitance,

$$U_{eff} = \\tfrac{1}{2}k_V C_{nom}V^{2}$$

## 11.4 Worked: derating a class-2 ceramic bulk capacitor

Given: a 10 μF X7R rated 25 V, used at 16 V, with a datasheet curve stating a
60% loss of capacitance at that bias, so $k_V = 0.40$. Tolerance is ±10% and
the part has aged 5% since manufacture.

$$C_{eff} = (0.40)(10\\ \\mu\\mathrm{F}) = 4.0\\ \\mu\\mathrm{F}$$

Worst case, stacking the tolerance and the ageing multiplicatively:

$$C_{worst} = (0.40)(0.90)(0.95)(10\\ \\mu\\mathrm{F}) = 3.42\\ \\mu\\mathrm{F}$$

A part bought as 10 μF is delivering 3.4 μF. If the design needed 8 μF of bulk
decoupling, three of these are required, not one — and the arithmetic that
reveals it takes one line. Temperature has not even been applied yet; X7R adds
another ±15% over its −55 to +125 °C range.

The same 8 μF in film would occupy a volume larger by roughly the ratio of the
volumetric capacitances, which is why nobody does it on a logic board and why
everybody does it on a motor drive.

## 11.5 The selection table, with the trade written out

| Family | $\\varepsilon_r$ (order) | $\\tan\\delta$ (order) | Temperature coefficient | Voltage coefficient | Where it belongs |
|---|---|---|---|---|---|
| Air / vacuum | 1 | $< 10^{-5}$ | negligible | none | RF standards, tuning |
| PTFE, polypropylene film | 2 to 2.3 | $10^{-4}$ | tens of ppm/°C | none | snubbers, AC line, precision |
| Mica | 6 to 7 | $10^{-4}$ to $10^{-3}$ | tens of ppm/°C | none | RF power, high stability |
| Class-1 ceramic (C0G) | 10 to 100 | $\\approx 10^{-3}$ | $\\pm 30$ ppm/°C | none | filters, timing, oscillators |
| Class-2 ceramic (X7R) | $10^{3}$ to $10^{4}$ | 0.01 to 0.03 | $\\pm 15\\%$ over range | large and negative | bulk decoupling |
| Aluminium electrolytic | effective, very large | $\\approx 10^{-1}$ | strongly temperature-dependent | modest | bulk energy, low frequency |

Read the table by columns and the design rule writes itself: any capacitor
whose VALUE appears in an equation must come from a row with no voltage
coefficient and a small temperature coefficient. Any capacitor that merely
needs to be large may come from the rows below. There is no row that wins every
column, which is why this is a selection problem and not a lookup.`,
      examTip: 'Energy density goes as epsilon-r times the SQUARE of breakdown field, so a low-permittivity film with a very high field can beat a high-permittivity ceramic outright. Compute both terms before ranking materials; ranking on permittivity alone is the planted mistake.',
    },
    {
      id: 'diel-temp-freq',
      title: '12. Temperature, Frequency and Ageing',
      content: `## 12.1 Temperature coefficient of capacitance

For a stable dielectric the capacitance drifts linearly enough to be quoted as
a single coefficient:

$$\\frac{\\Delta C}{C} = \\alpha_C\\,\\Delta T$$

with $\\alpha_C$ in parts per million per kelvin. Class-1 ceramics and film
parts are specified this way; class-2 ceramics are not, because their drift is
neither small nor linear, and their specification is instead a maximum
percentage excursion over a named temperature band. Reading a class-2 code is
therefore reading a promise about a WORST CASE, not a slope.

## 12.2 Worked: a C0G capacitor in an oscillator

Given: a 100 pF C0G with $\\alpha_C = 30$ ppm/K, in an LC oscillator, taken from
25 °C to 125 °C.

$$\\Delta C = C\\alpha_C\\Delta T = (100\\ \\mathrm{pF})(30 \\times 10^{-6})(100\\ \\mathrm{K}) = 0.30\\ \\mathrm{pF}$$

a drift of 0.30%. Since $f_0 = 1/(2\\pi\\sqrt{LC})$, the fractional frequency
shift is half the fractional capacitance shift with the sign reversed:

$$\\frac{\\Delta f}{f} = -\\tfrac{1}{2}\\frac{\\Delta C}{C} = -\\tfrac{1}{2}(0.0030) = -0.15\\%$$

Now substitute an X7R of the same value. Its ±15% band gives
$\\Delta C/C$ up to 0.15, and

$$\\frac{\\Delta f}{f} = -\\tfrac{1}{2}(0.15) = -7.5\\%$$

Fifty times worse, from a part that costs the same and looks identical on the
board. Timing and filtering are the two words in an exam stem that make this
distinction the answer.

## 12.3 Frequency: loss, permittivity and the end of capacitance

Three things happen as frequency rises. Permittivity falls, as each
polarisation mechanism drops out (section 6). Loss tangent generally rises
through each relaxation region and dips between them, so a $\\tan\\delta$ quoted
at 1 kHz says little at 1 MHz. And the series inductance of the leads and
plates eventually dominates, at the **self-resonant frequency**

$$f_{SRF} = \\frac{1}{2\\pi\\sqrt{L_{ESL}C}}$$

above which the component is an inductor with a capacitor in series, not the
other way round.

## 12.4 Worked: where a decoupling capacitor stops decoupling

Given: 100 nF in a small chip package with an equivalent series inductance of
1.2 nH including its via and pad.

$$f_{SRF} = \\frac{1}{2\\pi\\sqrt{(1.2 \\times 10^{-9})(1 \\times 10^{-7})}} = \\frac{1}{2\\pi(1.0954 \\times 10^{-8})} = 1.453 \\times 10^{7}\\ \\mathrm{Hz}$$

14.5 MHz. Above it the impedance RISES with frequency, so the part is no longer
providing a low-impedance return for the 100 MHz edges it was placed there to
serve. Replacing it with 1 nF in the same package moves resonance up by
$\\sqrt{100} = 10$ times, to 145 MHz, at the cost of a tenth of the charge — the
reason boards carry a ladder of decoupling values rather than one big one.

## 12.5 Ageing and the two exponential rules

Two empirical laws govern dielectric lifetime, and both are exponential, so
both punish overreach much harder than intuition suggests. The thermal rule,
often attributed to Montsinger, halves life for each fixed temperature
increment:

$$L = L_0\\,2^{(T_0 - T)/\\Delta}$$

with $\\Delta$ of order 8 to 10 K for organic insulation. The voltage rule is a
power law:

$$L = L_0\\left(\\frac{V_0}{V}\\right)^{n}$$

with $n$ typically 8 to 12 for solid polymer insulation, which is why a 20%
overvoltage is not a 20% problem.

Class-2 ceramics have a third, distinct mechanism: their capacitance decays
logarithmically with time since the last thermal excursion above the Curie
point of the ceramic, typically a few percent per decade of hours. A part
measured a week after reflow is not the part that was measured at the factory.

## 12.6 Worked: electrolytic life at a cooler operating point

Given: an aluminium electrolytic rated 2000 h at 105 °C, operating at a case
temperature of 65 °C, with the 10 K rule.

$$L = 2000 \\times 2^{(105 - 65)/10} = 2000 \\times 2^{4} = 32\\,000\\ \\mathrm{h}$$

$$\\frac{32\\,000\\ \\mathrm{h}}{8760\\ \\mathrm{h/yr}} = 3.65\\ \\mathrm{years}$$

If the 8 K figure is used instead, the multiplier becomes
$2^{40/8} = 2^{5} = 32$ and the life is 64 000 h, or 7.3 years. The two
"identical" rules differ by a factor of two over a 40 K span, which is a fair
statement of how precise lifetime prediction actually is — and a good reason to
quote the rule you used.

Running the same part at 85 °C instead gives $2000 \\times 2^{2} = 8000$ h, under
a year of continuous service. Twenty kelvin of cooling bought a factor of four,
and that is the entire argument for putting the electrolytic away from the heat
sink.`,
      examTip: 'Frequency shift is half the capacitance shift and opposite in sign, because frequency depends on the square root of capacitance. A 0.3 percent capacitance drift is a 0.15 percent frequency drift, and forgetting the factor of one half is the standard distractor.',
    },
    {
      id: 'diel-set-a',
      title: '13. Problem Set A: Fields, Capacitance and Energy',
      content: `## 13.1 Problem Set A

Work each item to a number before reading on. Every answer here is reproduced
from a relation stated earlier in this chapter.

**A1.** A single MLCC layer uses a class-2 ceramic with $\\varepsilon_r = 2500$,
8 μm thick, at 25 V. Find the field, and the total plate area needed for 220 nF.

**A2.** For the same part, find the stored energy by the lumped formula and by
integrating the energy density over the dielectric volume.

**A3.** A 12 kV supply is applied across 0.6 mm of air in series with 3 mm of
epoxy, $\\varepsilon_r = 3.5$. Find the field in each layer and compare with the
uniform field the same total gap would carry if it were all epoxy.

**A4.** A 6 μm polymer film has a breakdown strength of 250 MV/m at that
thickness. Rate it at 35% of breakdown.

**A5.** A parallel-plate capacitor with a 1 mm air gap is charged to 500 V and
DISCONNECTED, then a slab of $\\varepsilon_r = 5$ is slid in to fill the gap.
State what happens to $Q$, $C$, $V$, $E$ and $U$, with factors.

## 13.2 Worked answers to Problem Set A

**A1.** Field first, since it needs no capacitance:

$$E = \\frac{V}{d} = \\frac{25}{8 \\times 10^{-6}} = 3.125 \\times 10^{6}\\ \\mathrm{V/m} = 3.125\\ \\mathrm{MV/m}$$

Area from the capacitance relation, rearranged:

$$A = \\frac{Cd}{\\varepsilon_0\\varepsilon_r} = \\frac{(220 \\times 10^{-9})(8 \\times 10^{-6})}{(8.8541878128 \\times 10^{-12})(2500)} = 7.951 \\times 10^{-5}\\ \\mathrm{m^2} = 0.795\\ \\mathrm{cm^2}$$

Spread over 80 stacked layers in parallel that is 0.994 mm² of plate per layer
— a chip a millimetre on a side, which is exactly what a 220 nF 0402 part is.

**A2.** Lumped:

$$U = \\tfrac{1}{2}CV^{2} = \\tfrac{1}{2}(220 \\times 10^{-9})(25)^{2} = 6.875 \\times 10^{-5}\\ \\mathrm{J} = 68.75\\ \\mu\\mathrm{J}$$

By energy density:

$$u = \\tfrac{1}{2}\\varepsilon_0\\varepsilon_r E^{2} = \\tfrac{1}{2}(8.8541878128 \\times 10^{-12})(2500)(3.125 \\times 10^{6})^{2} = 1.0808 \\times 10^{5}\\ \\mathrm{J/m^3}$$

$$\\mathcal{V} = Ad = (7.951 \\times 10^{-5})(8 \\times 10^{-6}) = 6.361 \\times 10^{-10}\\ \\mathrm{m^3}$$

$$U = u\\mathcal{V} = (1.0808 \\times 10^{5})(6.361 \\times 10^{-10}) = 6.875 \\times 10^{-5}\\ \\mathrm{J}$$

The two agree exactly, as they must, and the field route is the one that also
tells you the answer is stored in 0.64 cubic millimetres of ceramic.

**A3.** Sum of reduced thicknesses:

$$\\sum_i \\frac{d_i}{\\varepsilon_{r,i}} = \\frac{0.6}{1} + \\frac{3}{3.5} = 0.6 + 0.857143 = 1.457143\\ \\mathrm{mm}$$

$$D = \\frac{\\varepsilon_0 V}{\\sum d_i/\\varepsilon_{r,i}} = \\frac{(8.8541878128 \\times 10^{-12})(12\\,000)}{1.457143 \\times 10^{-3}} = 7.2917 \\times 10^{-5}\\ \\mathrm{C/m^2}$$

$$E_{air} = \\frac{D}{\\varepsilon_0} = 8.235\\ \\mathrm{MV/m}, \\qquad E_{epoxy} = \\frac{D}{3.5\\varepsilon_0} = 2.353\\ \\mathrm{MV/m}$$

Check: $(8.235)(0.6) + (2.353)(3) = 4.941 + 7.059 = 12.0$ kV. All-epoxy over the
same 3.6 mm would give

$$E = \\frac{12\\,000}{3.6 \\times 10^{-3}} = 3.333 \\times 10^{6}\\ \\mathrm{V/m}$$

uniformly — under half the field the air is being asked to stand, and
comfortably inside its own strength. The air layer alone converts a safe design into a
discharging one.

**A4.**

$$V_{max} = 0.35\\,E_{bd}\\,d = 0.35(250 \\times 10^{6})(6 \\times 10^{-6}) = 525\\ \\mathrm{V}$$

**A5.** Disconnected means $Q$ is FIXED. Then $C$ rises by 5,
$V = Q/C$ falls to a fifth, $E = V/d$ falls to a fifth, and
$U = Q^{2}/(2C)$ falls to a fifth. Numerically $V$ goes from 500 V to 100 V and
$E$ from 500 kV/m to 100 kV/m. The energy that disappeared did mechanical work
pulling the slab in. Had a source held $V$ at 500 V instead, $C$ would still
rise by 5 but $Q$ and $U = \\tfrac{1}{2}CV^{2}$ would rise by 5 as well, with
the source supplying both the extra stored energy and an equal amount of work.`,
      examTip: 'Before touching a dielectric-insertion problem, write down which of Q or V is held fixed. Disconnected means fixed charge and falling energy; connected means fixed voltage and rising energy. Every other quantity follows in one line from whichever you fixed.',
    },
    {
      id: 'diel-set-b',
      title: '14. Problem Set B: Loss, Breakdown and Insulation',
      content: `## 14.1 Problem Set B

**B1.** A 2.2 μF film capacitor with $\\tan\\delta = 3 \\times 10^{-4}$ carries
400 V rms at 30 kHz. Find its ESR and its dissipation.

**B2.** A slab of insulation with $\\rho = 10^{13}$ Ω·m is 2 mm thick with an
electrode area of $10^{-3}$ m². Find the insulation resistance and the leakage
current at 1 kV.

**B3.** A glass with $\\rho = 10^{12}$ Ω·m and $\\varepsilon_r = 6$ is used as a
capacitor dielectric. Find the self-discharge time constant without using any
dimension.

**B4.** A 60 Hz core-loss meter is irrelevant here, but the same style of
question applies to dielectrics: a capacitor dissipating 0.33 W at 50 Hz and
230 V is moved to 400 Hz at the same voltage. Find the new dissipation, stating
the assumption.

**B5.** A conductor of 5 mm radius, surface factor $m = 0.85$, sits 2 m from
its return in standard air. Find the corona onset field and the disruptive
critical voltage.

## 14.2 Worked answers to Problem Set B

**B1.**

$$\\omega C = 2\\pi(3 \\times 10^{4})(2.2 \\times 10^{-6}) = 0.414690\\ \\mathrm{S}$$

$$\\mathrm{ESR} = \\frac{\\tan\\delta}{\\omega C} = \\frac{3 \\times 10^{-4}}{0.414690} = 7.234 \\times 10^{-4}\\ \\Omega = 0.723\\ \\mathrm{m\\Omega}$$

$$P = V^{2}\\omega C\\tan\\delta = (400)^{2}(0.414690)(3 \\times 10^{-4}) = 19.91\\ \\mathrm{W}$$

Check by the current route: the reactive current is
$I = V\\omega C = (400)(0.414690) = 165.9$ A rms, and
$I^{2}\\,\\mathrm{ESR} = (165.9)^{2}(7.234 \\times 10^{-4}) = 19.91$ W. Twenty
watts from a loss tangent of three parts in ten thousand — because 166 A is
flowing. Induction-heating tank capacitors are water-cooled for exactly this
reason.

**B2.**

$$R = \\rho\\frac{d}{A} = (10^{13})\\frac{2 \\times 10^{-3}}{10^{-3}} = 2 \\times 10^{13}\\ \\Omega$$

$$I = \\frac{1000}{2 \\times 10^{13}} = 5 \\times 10^{-11}\\ \\mathrm{A} = 50\\ \\mathrm{pA}$$

Fifty picoamps is below the input bias current of many op-amps, which is the
practical reason such measurements need guarding: the leakage across the
BOARD SURFACE will usually exceed the leakage through the insulator.

**B3.**

$$\\tau = \\rho\\varepsilon_0\\varepsilon_r = (10^{12})(8.8541878128 \\times 10^{-12})(6) = 53.1\\ \\mathrm{s}$$

No area, no thickness, no capacitance value required — the geometry cancels
identically, which is the point of the identity.

**B4.** Assuming $\\tan\\delta$ is unchanged over the eight-to-one frequency
span, which is the assumption that must be stated:

$$P_2 = P_1\\frac{f_2}{f_1} = 0.33\\left(\\frac{400}{50}\\right) = 2.64\\ \\mathrm{W}$$

Loss is linear in frequency at fixed voltage and fixed $\\tan\\delta$, from
$P = V^{2}\\omega C\\tan\\delta$. In reality $\\tan\\delta$ drifts across a decade
of frequency, so 2.64 W is a floor rather than a prediction — and the honest
answer names the assumption alongside the number.

**B5.**

$$E_v = 3 \\times 10^{6}(0.85)\\left(1 + \\frac{0.0301}{\\sqrt{0.005}}\\right) = (2.55 \\times 10^{6})(1 + 0.42568) = 3.635 \\times 10^{6}\\ \\mathrm{V/m}$$

$$V_d = E_v\\,r\\ln\\frac{D}{r} = (3.635 \\times 10^{6})(0.005)\\ln\\frac{2}{0.005} = (1.8175 \\times 10^{4})(5.9915) = 1.089 \\times 10^{5}\\ \\mathrm{V}$$

109 kV to neutral. Note how much the surface factor cost: with $m = 1$ the
onset field would be $4.277 \\times 10^{6}$ V/m and the critical voltage 128 kV,
so weathering alone removed 15% of the margin.

## 14.3 Where marks are lost in this half of the chapter

| Error | What it looks like | The fix |
|---|---|---|
| Loss tangent applied at the wrong frequency | a 1 kHz figure used at 1 MHz | tan delta is quoted AT a frequency; say which |
| ESR and parallel conductance mixed | current used with the voltage formula | I with ESR, V with omega C tan delta |
| Breakdown scaled linearly with thickness | doubling d assumed to double the rating | the strength itself falls; the rating goes as d to the 0.65 |
| Void field taken as the bulk field | a 20 MV/m epoxy declared safe at 8 MV/m | multiply by epsilon-r for a disc, or by 3 epsilon-r over 2 epsilon-r plus 1 for a sphere |
| Insulation resistance quoted without temperature | a room-temperature figure used at 90 °C | resistivity falls steeply and roughly exponentially with temperature |
| Corona onset field confused with onset voltage | a thin wire called corona-resistant | thin wires need a higher FIELD and reach it at a lower VOLTAGE |`,
      examTip: 'When a stem changes one variable and asks for a new loss, name the exponent before substituting: dielectric loss is linear in frequency, quadratic in voltage, and linear in tan delta. Two of those three are usually held fixed, and the item is testing whether you know which one moved.',
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

The **area inside the hysteresis loop** is the energy dissipated as heat per cycle PER UNIT VOLUME, in J/m³. Turning it into a power therefore needs BOTH a frequency and a core volume:

**P_hysteresis = (loop area) × frequency × (core volume)**

Dropping the volume factor leaves a power density in W/m³, not watts — the slip the error table in section 5 lists.

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

The identical winding on air: 25.1 mH / 2000 = **12.6 μH**. The core
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
    {
      id: 'mag-origin',
      title: '6. Where Magnetism Comes From, and the Five Classes',
      content: `## 6.1 Moments, and the two fields they create

A circulating current is a magnetic dipole. For a planar loop of current $I$
enclosing vector area $\\mathbf{A}$ the moment is

$$\\mathbf{m} = I\\mathbf{A}$$

with units A·m². Placed in a flux density it feels a torque and stores an
orientation energy,

$$\\boldsymbol{\\tau} = \\mathbf{m}\\times\\mathbf{B}, \\qquad U = -\\mathbf{m}\\cdot\\mathbf{B}$$

so a moment left free will turn until it lies along $\\mathbf{B}$, which is the
mechanism behind every compass, every relay armature and every rotor.

Inside matter the loops are electrons: orbital motion around a nucleus, and the
intrinsic spin, which contributes the larger share in the useful materials. The
natural unit of both is the **Bohr magneton**

$$\\mu_B = \\frac{e\\hbar}{2m_e} = 9.2740100783 \\times 10^{-24}\\ \\mathrm{J/T}$$

Adding the moments in a volume and dividing gives the **magnetisation**

$$\\mathbf{M} = \\frac{1}{V}\\sum_k \\mathbf{m}_k$$

whose units are $\\mathrm{A} \\cdot \\mathrm{m^2/m^3} = \\mathrm{A/m}$ — the same
units as $\\mathbf{H}$, and that is the whole reason the two can be added:

$$\\mathbf{B} = \\mu_0(\\mathbf{H} + \\mathbf{M})$$

with $\\mu_0 = 4\\pi \\times 10^{-7}\\ \\mathrm{H/m}$. Compare this with
$\\mathbf{D} = \\varepsilon_0\\mathbf{E} + \\mathbf{P}$ from the dielectrics
chapter: the structure is identical, with $\\mathbf{H}$ playing the role of the
field the SOURCES impose and $\\mathbf{M}$ the material's answer. The one
awkward asymmetry is that $\\varepsilon_0$ multiplies only the vacuum term in
the electric case, while $\\mu_0$ multiplies both terms in the magnetic one —
which is exactly why $\\mathbf{M}$ shares units with $\\mathbf{H}$ and
$\\mathbf{P}$ does not share units with $\\mathbf{E}$.

For a linear material $\\mathbf{M} = \\chi_m\\mathbf{H}$, and substituting gives

$$\\mathbf{B} = \\mu_0(1 + \\chi_m)\\mathbf{H} = \\mu_0\\mu_r\\mathbf{H}, \\qquad \\mu_r = 1 + \\chi_m$$

Relative permeability is one plus the magnetic susceptibility, precisely
parallel to $\\varepsilon_r = 1 + \\chi_e$. Classifying magnetic materials is
therefore classifying the sign and size of one dimensionless number.

## 6.2 Five classes, sorted by that one number

| Class | Sign of $\\chi_m$ | Magnitude | Mechanism | Examples |
|---|---|---|---|---|
| Diamagnetic | negative | $10^{-6}$ to $10^{-4}$ | induced orbital currents oppose the applied field | copper, bismuth, water, most organics |
| Paramagnetic | positive | $10^{-6}$ to $10^{-3}$ | existing moments partly align against thermal disorder | aluminium, platinum, liquid oxygen |
| Ferromagnetic | positive | $10^{2}$ to $10^{6}$ | exchange coupling aligns neighbouring spins parallel | iron, cobalt, nickel, silicon steel |
| Ferrimagnetic | positive | $10^{2}$ to $10^{4}$ | two opposed sublattices of unequal moment | MnZn and NiZn ferrites, magnetite |
| Antiferromagnetic | positive, small | $10^{-5}$ to $10^{-3}$ | opposed sublattices of EQUAL moment, cancelling | MnO, NiO, chromium |

Diamagnetism is universal — every material has it, from Lenz's law applied to
orbital electrons — but it is masked whenever anything stronger is present.
Paramagnetism needs unpaired moments and no coupling between them.
Ferromagnetism needs the quantum exchange interaction, which is why only a
handful of elements have it. Ferrimagnetism is the engineering workhorse above
audio frequency, because the cancelling sublattices leave a usable but modest
magnetisation in a material that happens to be a ceramic insulator.
Antiferromagnets look almost non-magnetic from outside, which is precisely
what makes them useful as pinning layers in devices.

![Magnitude of volume susceptibility for nine named materials on a logarithmic axis, spanning eleven decades from bismuth at minus 1.66 times ten to the minus four up to supermalloy at one million, with each bar annotated by the sign of its susceptibility. The diamagnetic and paramagnetic bars are nearly indistinguishable in length, and only the sign separates them.](/courses/fe-ee/figures/mat3-susceptibility-ladder.svg)

The figure makes the practical point that a table of numbers hides: dia- and
paramagnets differ by SIGN, not by size, and both are so close to
$\\mu_r = 1$ that for circuit purposes they are air. Only the ordered classes
are worth a core.

## 6.3 Worked: iron's saturation flux density from atomic moments

Given, as tabulated constants: iron density 7874 kg/m³, molar mass
55.845 g/mol, and a magnetic moment of 2.22 $\\mu_B$ per atom (the accepted
value for body-centred-cubic iron, which is not an integer because the 3d
electrons are itinerant rather than localised).

Atomic number density:

$$n = \\frac{\\rho N_A}{M} = \\frac{(7.874 \\times 10^{6}\\ \\mathrm{g/m^3})(6.02214076 \\times 10^{23}\\ \\mathrm{mol^{-1}})}{55.845\\ \\mathrm{g/mol}} = 8.4911 \\times 10^{28}\\ \\mathrm{m^{-3}}$$

Saturation magnetisation, every moment aligned:

$$M_s = n(2.22\\mu_B) = (8.4911 \\times 10^{28})(2.22)(9.2740100783 \\times 10^{-24}) = 1.7482 \\times 10^{6}\\ \\mathrm{A/m}$$

$$B_s = \\mu_0 M_s = (1.2566370614 \\times 10^{-6})(1.7482 \\times 10^{6}) = 2.197\\ \\mathrm{T}$$

The measured saturation of pure iron is about 2.15 T, so the atomic route is
high by 2.2%. That is a strikingly good agreement from nothing but a density,
a molar mass and a moment per atom, and it is worth trusting the check for what
it proves: saturation flux density is not an adjustable engineering parameter,
it is a count of atoms times the moment each one carries. No processing,
lamination or annealing can raise it.

Repeating the calculation for nickel (density 8908 kg/m³, molar mass
58.693 g/mol, 0.606 $\\mu_B$ per atom) gives
$n = 9.1400 \\times 10^{28}\\ \\mathrm{m^{-3}}$,
$M_s = 5.137 \\times 10^{5}\\ \\mathrm{A/m}$ and $B_s = 0.646$ T against a
measured 0.61 T — 6% high, the same story with a smaller moment. This is also
why silicon steel tops out near 2.0 T rather than iron's 2.15: the silicon
atoms carry no moment and dilute the count.

## 6.4 Worked: how little a diamagnet actually does

Given: copper, tabulated volume susceptibility
$\\chi_m = -9.63 \\times 10^{-6}$, sitting where the flux density would be 1 T
in free space.

$$H = \\frac{B}{\\mu_0} = \\frac{1}{1.2566370614 \\times 10^{-6}} = 7.9577 \\times 10^{5}\\ \\mathrm{A/m}$$

$$M = \\chi_m H = (-9.63 \\times 10^{-6})(7.9577 \\times 10^{5}) = -7.663\\ \\mathrm{A/m}$$

$$\\mu_0 M = -9.63 \\times 10^{-6}\\ \\mathrm{T}$$

Copper's answer to a one-tesla field is under ten microtesla, in the opposing
direction. Its relative permeability is

$$\\mu_r = 1 + \\chi_m = 0.99999037$$

which is why every inductance formula treats copper windings, aluminium
chassis and brass hardware as if they were air. The moment a ferromagnetic
screw or a steel bracket enters the same magnetic path, that assumption fails
by three orders of magnitude, and this is a real and frequent design error
rather than a textbook curiosity.

## 6.5 The temperature laws above the ordering point

Paramagnetic susceptibility falls as thermal agitation wins, following the
**Curie law**

$$\\chi_m = \\frac{C}{T}$$

with $C$ the Curie constant of the material. A ferromagnet heated above its
ordering temperature becomes paramagnetic but with the exchange interaction
still biasing it, giving the **Curie-Weiss law**

$$\\chi_m = \\frac{C}{T - \\theta}$$

where $\\theta$ is close to the Curie temperature $T_c$. The divergence at
$T \\to \\theta$ from above is the transition announcing itself.

## 6.6 Worked: how fast susceptibility falls above the Curie point

Given: iron, with $\\theta = 1043$ K (770 °C). Compare the susceptibility at
1100 K and at 1300 K. The Curie constant cancels in a ratio, so no fitted
number is needed:

$$\\frac{\\chi(1100)}{\\chi(1300)} = \\frac{T_2 - \\theta}{T_1 - \\theta} = \\frac{1300 - 1043}{1100 - 1043} = \\frac{257}{57} = 4.509$$

Fifty-seven kelvin above the transition the material is still 4.5 times more
susceptible than it is two hundred kelvin further up. The lesson for design is
that the collapse at $T_c$ is not a soft fade: a core run close to its Curie
point sits on a steep curve, and small temperature excursions move its
permeability a great deal. Section 11 puts numbers on the other side of the
transition.`,
      examTip: 'Relative permeability is one plus the susceptibility, exactly as relative permittivity is one plus the electric susceptibility. If a stem hands you a susceptibility of minus ten to the minus five, the permeability is 0.99999 and the material is magnetically air; the sign is the only thing that distinguishes it from a paramagnet.',
    },
    {
      id: 'mag-permeability',
      title: '7. Permeability Defined Three Ways, and Why the Distinction Matters',
      content: `## 7.1 One curve, several slopes, several numbers

"Permeability" names at least four different quantities in datasheets, and
using the wrong one is worth a factor of six on a real core. All four are read
off the same normal magnetisation curve.

Amplitude (or normal) permeability, the secant from the origin:

$$\\mu_a = \\frac{1}{\\mu_0}\\frac{B}{H}$$

Initial permeability, its limit at vanishing drive:

$$\\mu_i = \\lim_{H \\rightarrow 0}\\frac{1}{\\mu_0}\\frac{B}{H}$$

Differential permeability, the tangent:

$$\\mu_d = \\frac{1}{\\mu_0}\\frac{dB}{dH}$$

Incremental permeability, the slope of a small minor loop about a DC bias
$H_{dc}$:

$$\\mu_\\Delta = \\frac{1}{\\mu_0}\\frac{\\Delta B}{\\Delta H}\\ \\text{at}\\ H = H_{dc}$$

At the origin the first three coincide. Everywhere else they differ, and
$\\mu_\\Delta$ under bias is the one that governs whether a filter inductor
still has its inductance when the converter is delivering full current.

## 7.2 A curve to compute on

To keep every number below traceable, take a normal curve defined by a stated
expression rather than by a datasheet trace:

$$B(H) = \\mu_0\\mu_i H + B_s\\frac{(H/H_0)^{2}}{1 + (H/H_0)^{2}}$$

with $\\mu_i = 300$, $B_s = 1.5$ T and $H_0 = 200$ A/m. The first term supplies
a finite slope at the origin; the second is a sigmoid with an inflection at
positive $H$, which is what makes the maximum differential permeability exceed
the initial one — the behaviour every soft material shows and the reason the
definitions cannot be merged. Differentiating and dividing by $H$ respectively,

$$\\mu_d(H) = \\mu_i + \\frac{B_s}{\\mu_0 H_0}\\frac{2(H/H_0)}{\\left[1 + (H/H_0)^{2}\\right]^{2}}$$

$$\\mu_a(H) = \\mu_i + \\frac{B_s}{\\mu_0 H_0}\\frac{(H/H_0)}{1 + (H/H_0)^{2}}$$

Both reduce to $\\mu_i$ at $H = 0$, as they must.

![A normal magnetisation curve computed from the stated expression, with four constructions drawn on it: the initial tangent of slope three hundred, the tangent at the inflection where the differential permeability peaks at 4177, the steepest secant from the origin where the amplitude permeability peaks at 3284, and a shallow minor-loop slope at a six hundred amp-per-metre bias where the incremental permeability has fallen to 658.](/courses/fe-ee/figures/mat3-permeability-defs.svg)

## 7.3 Worked: the three permeabilities of that curve

The recurring group is

$$k = \\frac{B_s}{\\mu_0 H_0} = \\frac{1.5}{(1.2566370614 \\times 10^{-6})(200)} = 5968.31$$

Initial: both expressions give $\\mu_i = 300$ at $H = 0$.

Maximum differential: $\\mu_d$ peaks where
$d/dH\\left[2x/(1+x^{2})^{2}\\right] = 0$ with $x = H/H_0$, that is at
$x = 1/\\sqrt{3}$, so

$$H_{d,max} = \\frac{200}{\\sqrt{3}} = 115.47\\ \\mathrm{A/m}, \\qquad \\mu_{d,max} = 300 + 5968.31\\frac{2/\\sqrt{3}}{(4/3)^{2}} = 4176.5$$

Maximum amplitude: $x/(1+x^{2})$ peaks at $x = 1$, so

$$H_{a,max} = H_0 = 200\\ \\mathrm{A/m}, \\qquad \\mu_{a,max} = 300 + \\frac{5968.31}{2} = 3284.2$$

Three names, three numbers, spanning a factor of 13.9 from 300 to 4176.5 on one
material. And the ordering is not accidental:
$\\mu_{d,max} > \\mu_{a,max} > \\mu_i$ always, because a secant from the origin
can never be as steep as the steepest tangent, and the tangent at the origin is
shallower than the tangent at the inflection. A datasheet that quotes
"permeability 3300" and a handbook that quotes "4200" for the same alloy are
probably both right and answering different questions.

Sanity check on the curve itself: at $H = 200$ A/m,

$$B = (1.2566370614 \\times 10^{-6})(300)(200) + 1.5\\frac{1}{2} = 0.075398 + 0.75 = 0.825398\\ \\mathrm{T}$$

and $B/(\\mu_0 H) = 0.825398/(2.5133 \\times 10^{-4}) = 3284.2$, reproducing
$\\mu_{a,max}$ by an independent route.

## 7.4 Worked: what a DC bias does to incremental permeability

Given: the same core carrying a DC bias of 600 A/m, with a small AC excursion
on top.

$$\\mu_\\Delta \\approx \\mu_d(600) = 300 + 5968.31\\frac{2(3)}{(1 + 9)^{2}} = 300 + 358.1 = 658.1$$

$$\\frac{\\mu_{d,max}}{\\mu_\\Delta} = \\frac{4176.5}{658.1} = 6.346$$

The small-signal inductance has fallen by a factor of 6.3 at a bias only five
times the field at which the differential permeability peaked. The core sits at
$B = 1.576$ T — 1.350 T of it from the saturating term and 0.226 T from the
linear one — so it is past its knee but is still carrying flux, which is
exactly the deceptive region. A filter inductor designed at zero bias and
measured at full load will disappoint by roughly this factor, and the failure
looks like ripple that grows with load current rather than like a hard
saturation event.

One honesty note: a real minor loop about a bias point encloses area, so its
average slope is somewhat LOWER than the anhysteretic $\\mu_d$ used here, and
$\\mu_\\Delta$ also depends on the size of the AC excursion. The calculation
above is the right shape and an optimistic magnitude, which is the correct way
round for a warning.

## 7.5 Reading a datasheet without being misled

| Datasheet phrase | Which definition | Where it is measured | What it is good for |
|---|---|---|---|
| initial permeability $\\mu_i$ | initial | very small drive, often 0.25 mT | small-signal filters, signal transformers |
| maximum permeability $\\mu_{max}$ | usually maximum amplitude | at the knee | comparing alloys, not designing |
| amplitude permeability $\\mu_a$ | amplitude | at a stated peak flux density | power transformers at rated flux |
| incremental permeability $\\mu_\\Delta$ | incremental | at a stated DC bias | DC-biased chokes, output inductors |
| effective permeability $\\mu_e$ | amplitude of a GAPPED core | whole magnetic path | gapped cores, section 10 |

The last row is the one that catches designers: $\\mu_e$ is a property of the
core PLUS its gap, not of the material, and it is deliberately much smaller
than any material figure. Section 10 computes it.`,
      examTip: 'When an item gives a permeability and a DC bias in the same breath, it wants the incremental value, which is far smaller than the initial one. When it gives a permeability with no operating point at all, it means B = mu-zero times mu-r times H with a single constant, and you should use it and move on.',
    },
    {
      id: 'mag-loop-energy',
      title: '8. The Hysteresis Loop as Energy, Derived and Integrated',
      content: `## 8.1 Why the loop area is joules per cubic metre

The statement "the loop area is the energy lost per cycle per unit volume" is
usually asserted. It is short to derive, and the derivation is worth having
because it fixes the units and shows where the volume comes from.

Take a toroid of mean path length $l$, cross-section $A$ and $N$ turns. Ampere's
law around the mean path gives the field from the winding current,

$$H = \\frac{NI}{l} \\quad \\Longrightarrow \\quad I = \\frac{Hl}{N}$$

and Faraday's law gives the terminal voltage from the changing flux,

$$v = N\\frac{d\\Phi}{dt} = NA\\frac{dB}{dt}$$

The instantaneous power into the winding is the product,

$$p = vI = \\left(NA\\frac{dB}{dt}\\right)\\left(\\frac{Hl}{N}\\right) = (Al)\\,H\\frac{dB}{dt}$$

The turns count cancels, leaving the core volume $\\mathcal{V} = Al$ multiplying
a purely material quantity. Dividing by the volume and integrating over one
complete cycle,

$$w_{cycle} = \\oint H\\,dB$$

which is the area enclosed by the loop in the $(H, B)$ plane. Units:
$\\mathrm{(A/m)(T)} = \\mathrm{(A/m)(V \\cdot s/m^2)} = \\mathrm{A} \\cdot \\mathrm{V} \\cdot \\mathrm{s/m^3} = \\mathrm{J/m^3}$.
Power then needs a frequency and a volume:

$$P_h = f\\,\\mathcal{V}\\oint H\\,dB$$

Both factors are the ones students drop. A loop area alone is not watts, and
the number of turns never appears — a fact worth trusting, since it means the
same core loses the same power whether it is wound with 50 turns or 500, as
long as the flux swing is the same.

## 8.2 Rayleigh's law: a loop with a closed form

Low-field behaviour of a soft material obeys **Rayleigh's law**, in which the
initial curve is a parabola,

$$B = \\mu_0\\left(\\mu_i H + \\nu H^{2}\\right)$$

with $\\nu$ the Rayleigh constant in m/A. Cycling to $\\pm H_0$ traces two
parabolic branches,

$$B_{\\pm}(H) = \\mu_0\\left[(\\mu_i + \\nu H_0)H \\pm \\frac{\\nu}{2}\\left(H_0^{2} - H^{2}\\right)\\right]$$

with the upper sign for the descending branch. The amplitude permeability is
read straight off the linear coefficient,

$$\\mu_a = \\mu_i + \\nu H_0$$

and the enclosed area integrates in one line:

$$W = \\int_{-H_0}^{H_0}\\left(B_+ - B_-\\right)dH = \\mu_0\\nu\\int_{-H_0}^{H_0}\\left(H_0^{2} - H^{2}\\right)dH = \\frac{4}{3}\\mu_0\\nu H_0^{3}$$

A hysteresis loop with an exact area, from two stated constants. Everything in
this section is checked against it.

![A Rayleigh minor loop computed from the stated initial permeability of 250 and Rayleigh constant of 25 metres per amp at a drive amplitude of fifty amps per metre, with the enclosed area shaded and the parabolic initial curve drawn through it. The coercive points where the branches cross zero flux density are marked at plus and minus 18.1 amps per metre.](/courses/fe-ee/figures/mat3-rayleigh-loop.svg)

## 8.3 Worked: the loop area by two independent routes

Given: $\\mu_i = 250$, $\\nu = 25\\ \\mathrm{m/A}$, driven to
$H_0 = 50\\ \\mathrm{A/m}$. These are stated fit constants for the material in
its Rayleigh region, not universal properties.

Amplitude permeability and peak flux density:

$$\\mu_a = 250 + (25)(50) = 1500$$

$$B_0 = \\mu_0\\mu_a H_0 = (1.2566370614 \\times 10^{-6})(1500)(50) = 0.0942478\\ \\mathrm{T}$$

Closed form for the area:

$$W = \\frac{4}{3}(1.2566370614 \\times 10^{-6})(25)(50)^{3} = \\frac{4}{3}(1.2566370614 \\times 10^{-6})(3.125 \\times 10^{6}) = 5.2360\\ \\mathrm{J/m^3}$$

Independent route, the contour integral $\\oint H\\,dB$ evaluated numerically
around the same two branches, is asserted in the figure generator to agree with
that closed form to within $10^{-5}$ J/m³ — about two parts per million. A
third route, integrating the vertical gap between the branches over $H$, agrees
to a part in ten million. The three are different integrals of the same loop
and they must coincide; checking that they do is what turns a formula into a
number you can publish.

Power in a 60 Hz core of volume $5 \\times 10^{-4}$ m³:

$$P_h = f\\mathcal{V}W = (60)(5 \\times 10^{-4})(5.2360) = 0.15708\\ \\mathrm{W}$$

## 8.4 Worked: coercivity of a Rayleigh loop

The ascending branch crosses $B = 0$ where

$$\\frac{\\nu}{2}H^{2} + \\mu_a H - \\frac{\\nu}{2}H_0^{2} = 0$$

so, taking the positive root,

$$H_c = \\frac{\\mu_a}{\\nu}\\left(\\sqrt{1 + \\frac{\\nu^{2}H_0^{2}}{\\mu_a^{2}}} - 1\\right) = 60\\left(\\sqrt{1 + 0.694444} - 1\\right) = 18.10\\ \\mathrm{A/m}$$

Read the structure before the number: coercivity here is not a material
constant at all, it depends on the drive amplitude $H_0$. That is a genuine
property of minor loops — drive a soft core harder and its apparent coercivity
grows, until the drive reaches saturation and the loop becomes the major one
whose $H_c$ IS quoted as a material figure. Comparing an $H_c$ measured at one
drive level with a datasheet figure measured at another is a common way to
conclude that a batch of cores is wrong when it is not.

## 8.5 Worked: where the Steinmetz exponent comes from

The empirical **Steinmetz relation** for hysteresis loss,

$$P_h = k_h\\,f\\,B_m^{\\,n}$$

carries an exponent usually quoted as 1.6 to 2. Rayleigh's law lets that
exponent be derived rather than fitted, for the low-field regime at least.
Doubling the drive from 50 to 100 A/m multiplies the area by
$(100/50)^{3} = 8$, while the peak flux density rises only from
$\\mu_0(1500)(50)$ to $\\mu_0(2750)(100)$, a factor of 3.6667. The implied
exponent is

$$n = \\frac{\\ln 8}{\\ln 3.6667} = \\frac{2.0794}{1.2993} = 1.600$$

which lands on the classic value. The same construction between 5 and 10 A/m,
where the linear $\\mu_i$ term still dominates, gives
$n = \\ln 8/\\ln 2.6667 = 2.120$. And in the opposite limit, where $\\nu H_0$
swamps $\\mu_i$, the peak flux density goes as $H_0^{2}$ and the area as
$H_0^{3}$, giving

$$W \\propto B_0^{3/2} \\quad \\Longrightarrow \\quad n \\rightarrow 1.5$$

So the Steinmetz exponent is not a constant of nature: it runs from 3 at
vanishing drive down to 1.5 deep in the Rayleigh region, and 1.6 is simply
where most power materials happen to be operated. An exponent quoted without
its flux-density range is half a specification.

Rayleigh's law itself expires well before saturation, so none of this licenses
extrapolating the parabola to the knee; the figure is drawn only over the
region where the law applies.`,
      examTip: 'Loop area is joules per cubic metre per cycle. To reach watts you must multiply by BOTH the frequency and the core volume, and the number of turns never enters. An answer in watts that used only one of those two factors is off by whichever one was dropped.',
    },
    {
      id: 'mag-core-loss',
      title: '9. Core Loss Separated: Hysteresis, Eddy Currents and Lamination Thickness',
      content: `## 9.1 Deriving the eddy-current loss of a lamination

Hysteresis loss comes from the material. Eddy loss comes from the GEOMETRY of
the conductor the material happens also to be, and it can be derived from
scratch for the case that matters — a thin sheet with the flux in its plane.

Let the sheet have thickness $t$, resistivity $\\rho$, and a spatially uniform
flux density $B(x, t) = B_m\\sin\\omega t$ (this uniformity is the assumption
whose validity section 9.2 checks). Take $x$ from the mid-plane. The flux
enclosed by a rectangular circuit lying between $-x$ and $+x$ changes, and
Faraday's law gives an induced electric field

$$E(x) = -x\\frac{dB}{dt}$$

Ohm's law makes that a dissipation density $E^{2}/\\rho$. Averaging over the
thickness uses $\\langle x^{2}\\rangle = t^{2}/12$, and averaging over the cycle
uses $\\langle (dB/dt)^{2}\\rangle = \\omega^{2}B_m^{2}/2$, so

$$p_e = \\frac{\\langle x^{2}\\rangle\\langle (dB/dt)^{2}\\rangle}{\\rho} = \\frac{(t^{2}/12)(\\omega^{2}B_m^{2}/2)}{\\rho} = \\frac{\\pi^{2}f^{2}B_m^{2}t^{2}}{6\\rho}$$

using $\\omega = 2\\pi f$. Dimensional check:
$\\mathrm{s^{-2}} \\times \\mathrm{T^2} \\times \\mathrm{m^2}/(\\Omega \\cdot \\mathrm{m})$;
with $\\mathrm{T} = \\mathrm{V} \\cdot \\mathrm{s/m^2}$ this is
$\\mathrm{V^2}/(\\Omega \\cdot \\mathrm{m^3}) = \\mathrm{W/m^3}$.

Everything the older sections asserted about scaling is now visible in an
equation with no adjustable constants: loss goes as the SQUARE of frequency,
the SQUARE of peak flux density, the SQUARE of thickness, and inversely as
resistivity. Two of those four are the designer's to choose.

## 9.2 The condition under which that formula is true

The derivation assumed the flux density is uniform across the sheet, which
fails once the eddy currents themselves shield the interior. The scale is the
**skin depth**

$$\\delta = \\sqrt{\\frac{\\rho}{\\pi f\\mu_0\\mu_r}}$$

and the exact one-dimensional solution gives the ratio of true loss to the
classical formula as

$$F(\\xi) = \\frac{3}{\\xi}\\,\\frac{\\sinh\\xi - \\sin\\xi}{\\cosh\\xi - \\cos\\xi}, \\qquad \\xi = \\frac{t}{\\delta}$$

Expanding for small $\\xi$ gives $F \\approx 1 - \\xi^{4}/630$, so the classical
formula is excellent while $t \\ll \\delta$ and progressively OPTIMISTIC beyond.
For large $\\xi$, $F \\rightarrow 3/\\xi$, so the true loss grows as $t$ rather
than $t^{2}$ — the interior has stopped participating.

![Eddy-current loss density against lamination thickness on logarithmic axes at sixty hertz and 1.5 tesla in silicon steel, showing the classical thickness-squared law and the exact skin-effect solution. The two coincide below the 1.41 millimetre skin depth marked on the plot and separate above it, and the operating point of a 0.35 millimetre sheet is marked at 3473 watts per cubic metre.](/courses/fe-ee/figures/mat3-eddy-thickness.svg)

## 9.3 Worked: a 0.35 mm silicon-steel lamination at 60 Hz

Given, all named: grain-oriented silicon steel with
$\\rho = 4.7 \\times 10^{-7}\\ \\Omega \\cdot \\mathrm{m}$, density 7650 kg/m³,
$\\mu_r \\approx 1000$ at the working point, run at $f = 60$ Hz and
$B_m = 1.5$ T, in sheets $t = 0.35$ mm thick. Resistivity and permeability both
vary appreciably with silicon content and with flux density; these are
representative figures for a common grade.

$$p_e = \\frac{\\pi^{2}(60)^{2}(1.5)^{2}(3.5 \\times 10^{-4})^{2}}{6(4.7 \\times 10^{-7})} = \\frac{9.7931 \\times 10^{-3}}{2.82 \\times 10^{-6}} = 3473\\ \\mathrm{W/m^3}$$

Per unit mass, which is how core loss is actually sold:

$$\\frac{3473}{7650} = 0.454\\ \\mathrm{W/kg}$$

Validity check, not optional:

$$\\delta = \\sqrt{\\frac{4.7 \\times 10^{-7}}{\\pi(60)(1.2566370614 \\times 10^{-6})(1000)}} = 1.409\\ \\mathrm{mm}$$

so $\\xi = 0.35/1.409 = 0.2484$ and $F(\\xi) = 0.999994$. The classical formula
is in error by six parts per million here, which is why nobody bothers with the
hyperbolic functions at mains frequency. The number is also a reassuring match
to reality: measured total core loss for this class of material at 1.5 T and
60 Hz is a couple of watts per kilogram, of which the eddy share being about
half a watt is exactly the expected split.

## 9.4 Worked: what a solid core would have cost

Same material, same flux, same frequency, but a solid block 50 mm thick instead
of a stack of 0.35 mm sheets. The classical law scales by thickness squared:

$$\\frac{p_e(50\\ \\mathrm{mm})}{p_e(0.35\\ \\mathrm{mm})} = \\left(\\frac{50}{0.35}\\right)^{2} = 20\\,408$$

giving $7.087 \\times 10^{7}$ W/m³. Now apply the correction the formula
demands, since $\\xi = 50/1.409 = 35.5$ is enormous:

$$F(\\xi) = \\frac{3}{\\xi}\\cdot\\frac{\\sinh\\xi - \\sin\\xi}{\\cosh\\xi - \\cos\\xi} = 0.08452$$

$$p_e = (7.087 \\times 10^{7})(0.08452) = 5.99 \\times 10^{6}\\ \\mathrm{W/m^3}$$

The skin effect saves a factor of twelve — and 6 MW per cubic metre is still
absurd, some 1700 times the laminated figure. Lamination is not an optimisation,
it is the enabling step, and the honest version of the argument uses the exact
factor rather than quoting a 20 000-fold penalty that the physics never
actually delivers.

## 9.5 Worked: choosing lamination thickness against a loss budget

Given: a 60 Hz design at $B_m = 1.5$ T in the same steel, with an eddy-loss
budget of 1000 W/m³. Rearranging,

$$t = \\sqrt{\\frac{6\\rho\\,p_e}{\\pi^{2}f^{2}B_m^{2}}} = \\sqrt{\\frac{6(4.7 \\times 10^{-7})(1000)}{\\pi^{2}(60)^{2}(1.5)^{2}}} = 1.878 \\times 10^{-4}\\ \\mathrm{m}$$

188 μm, or a standard 0.18 mm grade. Halving the sheet thickness from 0.35 mm
would have quartered the loss to 868 W/m³, comfortably inside budget — the
same conclusion by inspection, since the law is quadratic. What the quadratic
does not tell you is that each halving roughly doubles the number of sheets to
stack, punches, deburr and insulate, and lowers the stacking factor so more
core volume is needed for the same flux. That cost is why 0.35 mm and 0.27 mm
remain the common grades rather than something far thinner.

## 9.6 Separating the two losses on a single straight line

Total core loss per unit volume, with the Steinmetz form for hysteresis and the
derived expression for eddy currents:

$$p_{total} = k_h f B_m^{\\,n} + \\frac{\\pi^{2}t^{2}}{6\\rho}f^{2}B_m^{2}$$

Divide through by frequency at fixed $B_m$ and it becomes a straight line in
$f$:

$$\\frac{p_{total}}{f} = \\underbrace{k_h B_m^{\\,n}}_{\\text{intercept}} + \\underbrace{\\frac{\\pi^{2}t^{2}B_m^{2}}{6\\rho}}_{\\text{slope}}f$$

That is the classical **loss separation** measurement: sweep frequency at
constant peak flux density, plot loss per cycle, and the intercept is the
hysteresis loop area while the slope is the eddy coefficient.

![Core loss components against frequency for silicon steel at 1.5 tesla, and the same data replotted as loss per cycle against frequency. The first panel shows the linear hysteresis term and the quadratic eddy term crossing at 259 hertz; the second shows loss per cycle as a straight line whose intercept of 250 joules per cubic metre is the loop area and whose slope of 0.965 is the eddy coefficient.](/courses/fe-ee/figures/mat3-loss-separation.svg)

## 9.7 Worked: reading the intercept and the slope

Given: the 0.35 mm silicon steel above at 1.5 T, with a measured loop area of
250 J/m³ at that flux density.

$$k_e = \\frac{\\pi^{2}t^{2}B_m^{2}}{6\\rho} = \\frac{\\pi^{2}(3.5 \\times 10^{-4})^{2}(1.5)^{2}}{6(4.7 \\times 10^{-7})} = 0.96465\\ \\mathrm{J} \\cdot \\mathrm{s/m^3}$$

Crossover, where the two mechanisms contribute equally:

$$f_{x} = \\frac{250}{0.96465} = 259.2\\ \\mathrm{Hz}$$

At 60 Hz the split is

$$p_h = (250)(60) = 15\\,000\\ \\mathrm{W/m^3}, \\qquad p_e = (0.96465)(60)^{2} = 3473\\ \\mathrm{W/m^3}$$

for a total of 18 473 W/m³, or 2.41 W/kg — in the right range for this grade at
this flux density, and dominated by hysteresis in the ratio 4.32 to 1. Move the same core to
400 Hz aircraft power and the ratio inverts: hysteresis rises by 400/60 = 6.67
to 100 kW/m³ while eddy loss rises by $(400/60)^{2} = 44.4$ to 154 kW/m³. That
inversion, at a frequency still far below anything a switching converter uses,
is the whole reason 400 Hz machines use thinner laminations and switching
converters abandon metal altogether.

Real measurements do not fall perfectly on the line. The residual, called
anomalous or excess loss, comes from the fact that flux reversal actually
happens at moving domain walls rather than uniformly through the material, and
it is usually fitted as a further term proportional to $f^{1.5}$. Its existence
is worth knowing so that a stubborn 10 to 30% discrepancy between the two-term
model and a measurement is recognised as physics rather than as a mistake.

## 9.8 Worked: why ferrite wins above about 20 kHz

Given: a core of characteristic dimension 10 mm at 100 kHz and
$B_m = 0.1$ T, made first from MnZn ferrite ($\\rho \\approx 1\\ \\Omega \\cdot \\mathrm{m}$,
$\\mu_r \\approx 2000$) and then, hypothetically, from silicon steel of the same
dimensions ($\\rho = 4.7 \\times 10^{-7}\\ \\Omega \\cdot \\mathrm{m}$).

$$p_{e,ferrite} = \\frac{\\pi^{2}(10^{5})^{2}(0.1)^{2}(10^{-2})^{2}}{6(1)} = 1.645 \\times 10^{4}\\ \\mathrm{W/m^3}$$

$$p_{e,steel} = \\frac{\\pi^{2}(10^{5})^{2}(0.1)^{2}(10^{-2})^{2}}{6(4.7 \\times 10^{-7})} = 3.50 \\times 10^{10}\\ \\mathrm{W/m^3}$$

A ratio of $2.13 \\times 10^{6}$, which is simply the resistivity ratio, since
every other factor is shared. Validity for the ferrite:
$\\delta = 35.6$ mm at 100 kHz, comfortably larger than the 10 mm dimension, so
the classical formula applies without correction.

Ferrite pays for that with a saturation flux density of 0.4 to 0.5 T against
silicon steel's 2.0 T, so a ferrite core must be roughly four times the
cross-section for the same volt-seconds per turn. At 100 kHz the volt-seconds
per turn are a thousandth of what they were at 100 Hz, so the penalty is
affordable and the eddy-loss advantage is not merely decisive, it is the only
option.`,
      examTip: 'Hysteresis loss is linear in frequency and eddy loss is quadratic, so scale them SEPARATELY and add. If an item gives you the split at one frequency and asks for another, multiply the first term by the frequency ratio and the second by its square; a single combined factor is always wrong and is always on the option list.',
    },
    {
      id: 'mag-gap',
      title: '10. Saturation, Air Gaps and the Fringing Correction',
      content: `## 10.1 Magnetic circuits, with the analogy stated precisely

Flux obeys an Ohm's-law analogue. Magnetomotive force drives flux through
reluctance:

$$\\mathcal{F} = NI = \\Phi\\,\\mathcal{R}, \\qquad \\mathcal{R} = \\frac{l}{\\mu_0\\mu_r A}$$

Reluctances in series add, exactly as resistances do, and inductance follows
from the flux linkage:

$$L = \\frac{N\\Phi}{I} = \\frac{N^{2}}{\\mathcal{R}_{total}}$$

Cutting a gap of length $l_g$ into a core of path length $l_c$ adds a
reluctance with $\\mu_r = 1$, and the two in series give an **effective
permeability** for the whole path:

$$\\mu_e = \\frac{\\mu_r}{1 + \\mu_r\\dfrac{l_g}{l_c}}$$

The group $\\mu_r l_g/l_c$ decides everything. When it is large the gap
dominates and $\\mu_e \\approx l_c/l_g$, a purely geometric number with the
material's temperamental $\\mu_r$ divided out. That substitution — a machined
dimension in place of a material property — is why gaps exist.

## 10.2 Worked: a gapped inductor, four quantities at once

Given: 100 turns on a core of cross-section 1 cm², magnetic path 0.1 m,
$\\mu_r = 2000$, with a 0.5 mm gap. Take $B_s = 0.35$ T for the material.

Reluctances:

$$\\mathcal{R}_c = \\frac{0.1}{(1.2566370614 \\times 10^{-6})(2000)(10^{-4})} = 3.9789 \\times 10^{5}\\ \\mathrm{A/Wb}$$

$$\\mathcal{R}_g = \\frac{5 \\times 10^{-4}}{(1.2566370614 \\times 10^{-6})(10^{-4})} = 3.9789 \\times 10^{6}\\ \\mathrm{A/Wb}$$

The gap carries ten times the reluctance of the entire core, and the ratio is
exact rather than approximate:
$\\mathcal{R}_g/\\mathcal{R}_c = \\mu_r l_g/l_c = (2000)(0.005) = 10$.

Inductance:

$$L = \\frac{N^{2}}{\\mathcal{R}_c + \\mathcal{R}_g} = \\frac{10^{4}}{4.3768 \\times 10^{6}} = 2.285\\ \\mathrm{mH}$$

against $10^{4}/(3.9789 \\times 10^{5}) = 25.13$ mH ungapped — a fall by exactly
$1 + 10 = 11$.

Saturation current. Since
$B = \\mu_0 NI/(l_g + l_c/\\mu_r)$, the current that reaches $B_s$ is

$$I_{sat} = \\frac{B_s\\left(l_g + l_c/\\mu_r\\right)}{\\mu_0 N} = \\frac{(0.35)(5.5 \\times 10^{-4})}{(1.2566370614 \\times 10^{-6})(100)} = 1.532\\ \\mathrm{A}$$

against 0.1393 A ungapped — a rise by exactly 11, the same factor the
inductance fell by.

Storable energy, which is what an inductor is actually for:

$$U = \\tfrac{1}{2}LI_{sat}^{2} = \\tfrac{1}{2}(2.285 \\times 10^{-3})(1.532)^{2} = 2.681\\ \\mathrm{mJ}$$

against $\\tfrac{1}{2}(25.13 \\times 10^{-3})(0.1393)^{2} = 0.2438$ mJ ungapped.
The gap multiplied the storable energy by 11 as well — because
$U \\propto LI^{2}$ and $L$ fell by 11 while $I^{2}$ rose by $11^{2}$.

That is the whole case for gapping in one line: a gap does not improve an
inductor's inductance, it improves its ENERGY, and inductors in switching
converters are energy stores.

## 10.3 Worked: the same energy by integrating the field

The lumped result deserves a check that never touches $L$ or $I$. At
$B = B_s = 0.35$ T the energy density is $B^{2}/(2\\mu)$ in each region, so

$$U = \\frac{B^{2}}{2\\mu_0}A\\,l_g + \\frac{B^{2}}{2\\mu_0\\mu_r}A\\,l_c$$

$$U = \\frac{(0.35)^{2}}{2(1.2566370614 \\times 10^{-6})}(10^{-4})(5 \\times 10^{-4}) + \\frac{(0.35)^{2}}{2(1.2566370614 \\times 10^{-6})(2000)}(10^{-4})(0.1)$$

$$U = 2.4371 \\times 10^{-3} + 2.4371 \\times 10^{-4} = 2.6808 \\times 10^{-3}\\ \\mathrm{J}$$

which reproduces the 2.681 mJ of section 10.2 exactly. It also reveals the
split: 90.9% of the stored energy sits in half a millimetre of air, and 9.1% in
100 mm of expensive ferrite. The energy fraction in the gap is

$$\\frac{U_g}{U_g + U_c} = \\frac{l_g}{l_g + l_c/\\mu_r}$$

which is identical to the reluctance fraction
$\\mathcal{R}_g/(\\mathcal{R}_g + \\mathcal{R}_c)$, as it must be — both regions
carry the same flux through the same area.

![Share of stored magnetic energy held in the air gap, and the effective relative permeability, both against gap length on logarithmic axes for a core of 0.2 metre path length at relative permeability 1500. The energy split reaches fifty-fifty when the gap equals the core path divided by the permeability, 0.133 millimetres, and a one millimetre gap already holds 88.2 percent of the energy while dragging the effective permeability down to 176.](/courses/fe-ee/figures/mat3-gap-energy-split.svg)

The figure uses the toroid of section 3.3 — path 0.2 m, $\\mu_r = 1500$ — so its
numbers differ from the worked inductor above: there the equivalent air length
is $l_c/\\mu_r = 0.2/1500 = 0.133$ mm, a 1 mm gap holds 88.2% of the energy, and
$\\mu_e = 1500/(1 + 7.5) = 176.5$. The shape of the curve is the transferable
part: the gap takes over as soon as it exceeds $l_c/\\mu_r$, which for any
decent core material is a fraction of a millimetre.

## 10.4 Fringing, and two corrections that disagree

Flux does not stay inside the gap. It bulges outward, so the effective gap area
exceeds the core area, the gap reluctance falls, and the real inductance
exceeds the calculation above. Two corrections are in common use. The first
simply adds the gap length to each cross-sectional dimension:

$$A_{fr} \\approx (a + l_g)(b + l_g)$$

The second, from magnetics design practice, scales the area by a factor
involving the winding window height $G$:

$$F = 1 + \\frac{l_g}{\\sqrt{A_c}}\\ln\\frac{2G}{l_g}, \\qquad A_{fr} = F\\,A_c$$

## 10.5 Worked: fringing on the gapped inductor, both ways

Given: the 1 cm² core above as a 10 mm square, $l_g = 0.5$ mm, in a window of
height $G = 20$ mm.

Dimension-addition:

$$A_{fr} = (10.5\\ \\mathrm{mm})(10.5\\ \\mathrm{mm}) = 110.25\\ \\mathrm{mm^2}$$

a 10.25% increase, which lowers $\\mathcal{R}_g$ to
$3.9789 \\times 10^{6}/1.1025 = 3.6090 \\times 10^{6}$ and raises the inductance
to

$$L = \\frac{10^{4}}{3.9789 \\times 10^{5} + 3.6090 \\times 10^{6}} = 2.496\\ \\mathrm{mH}$$

a 9.2% rise over the 2.285 mH computed with no fringing.

The area-factor form:

$$F = 1 + \\frac{0.5}{10}\\ln\\frac{40}{0.5} = 1 + (0.05)(4.3820) = 1.2191$$

giving $A_{fr} = 121.9\\ \\mathrm{mm^2}$, $\\mathcal{R}_g = 3.2638 \\times 10^{6}$
and $L = 2.731$ mH, a 19.5% rise.

Nine percent against twenty percent, from two respectable approximations
applied to the same core. That disagreement is the honest headline: fringing
corrections are estimates, they diverge as the gap grows relative to the core
dimensions, and a gapped inductor whose inductance matters is measured, not
merely computed. The two do agree on the direction and on the order of
magnitude, which is what an approximation is for, and both say the same
practical thing — split one large gap into several small ones distributed
around the path, and the fringing penalty (and the winding loss it causes by
pushing flux through the copper) falls sharply.

## 10.6 Worked: re-checking the gapped toroid of section 3.3

The earlier section computed a 1 mm gap in a 0.2 m path at $\\mu_r = 1500$,
cross-section 4 cm², driven by 200 turns at 0.5 A. Recomputing every step from
the definitions above:

$$\\mathcal{R}_c = \\frac{0.2}{(1.2566370614 \\times 10^{-6})(1500)(4 \\times 10^{-4})} = 2.6526 \\times 10^{5}\\ \\mathrm{A/Wb}$$

$$\\mathcal{R}_g = \\frac{10^{-3}}{(1.2566370614 \\times 10^{-6})(4 \\times 10^{-4})} = 1.9894 \\times 10^{6}\\ \\mathrm{A/Wb}$$

$$\\Phi = \\frac{NI}{\\mathcal{R}_c + \\mathcal{R}_g} = \\frac{100}{2.2547 \\times 10^{6}} = 4.4352 \\times 10^{-5}\\ \\mathrm{Wb}$$

$$B = \\frac{\\Phi}{A} = \\frac{4.4352 \\times 10^{-5}}{4 \\times 10^{-4}} = 0.1109\\ \\mathrm{T}$$

confirming the 0.11 T published there, the reluctance ratio of exactly 7.5, and
the flux reduction factor of 0.9425/0.1109 = 8.50 against the ungapped case.

One refinement the earlier treatment left implicit: the iron path should
strictly be 0.199 m once a 1 mm gap has been cut out of a 0.2 m circuit. Redoing
it that way gives $\\mathcal{R}_c = 2.6393 \\times 10^{5}$ and $B = 0.11094$ T
against 0.11088 T — a change of 0.06%, far below the uncertainty in $\\mu_r$
itself. The approximation is safe, and knowing WHY it is safe is better than
not noticing it was made.

## 10.7 What saturation does to a circuit, not just to a curve

Above the knee, $\\mu_d$ collapses toward 1 and the inductance collapses with
it. In a converter that is a runaway: inductance falls, so current rises
faster, so the core saturates harder, so inductance falls further. The current
waveform stops being a triangle and turns up sharply at its peak, which is the
oscilloscope signature.

Three defences, in increasing order of cost. Reduce the flux swing by adding
turns or raising frequency, since $B_m \\propto V/(N A f)$. Add a gap, which
raises $I_{sat}$ in proportion to $\\mu_e$ reduction as section 10.2 showed. Or
choose a material with a higher $B_s$ and accept its loss, which at mains
frequency means silicon steel at 2.0 T and above 20 kHz means it does not.

Note the contrast with the Curie limit of section 11: saturation is instant and
instantly reversible — drop the current and the inductance returns within the
cycle. A core taken past its Curie temperature loses its permeability entirely
and gets it back only on cooling.`,
      examTip: 'A gap divides the effective permeability by one plus mu-r times gap over path, and multiplies the saturation current by exactly the same factor. Compute that one dimensionless group first; every other number in a gapped-core problem is the ungapped answer scaled by it.',
    },
    {
      id: 'mag-curie-mstr',
      title: '11. Curie Point, Temperature Effects and Magnetostriction',
      content: `## 11.1 The Curie transition, computed

Exchange coupling aligns neighbouring spins; thermal agitation randomises them.
The Weiss mean-field treatment replaces the exchange with an effective internal
field proportional to the magnetisation itself, and for spin one-half the
self-consistency condition reduces to

$$m = \\tanh\\!\\left(\\frac{m}{T/T_c}\\right), \\qquad m = \\frac{M}{M_s}$$

Above $T_c$ the only solution is $m = 0$. Below it a non-zero solution appears
and grows rapidly. Expanding $\\tanh$ to third order near the transition gives
the shape of that growth,

$$m \\approx \\sqrt{3t^{2}(1 - t)}, \\qquad t = \\frac{T}{T_c}$$

so magnetisation rises as the square root of the distance below $T_c$ — a
vertical tangent at the transition, not a gentle onset.

![Reduced magnetisation against reduced temperature from the mean-field self-consistency condition, solved numerically, with the square-root approximation near the transition drawn alongside. At half the Curie temperature the material still holds 95.8 percent of full magnetisation, at nine tenths it holds 52.5 percent, and above the Curie point it holds none.](/courses/fe-ee/figures/mat3-weiss-curie.svg)

## 11.2 Worked: reading the curve at three temperatures

Solving $m = \\tanh(m/t)$ numerically at three reduced temperatures:

$$m(0.5) = 0.9575, \\qquad m(0.9) = 0.5254, \\qquad m(0.95) = 0.3795$$

The check on those numbers is the expansion above. At $t = 0.9$ it predicts
$\\sqrt{3(0.81)(0.1)} = 0.4930$ against the exact 0.5254, a 6% underestimate
that is entirely appropriate for a third-order expansion 10% away from the
transition, and the figure asserts the two agree within 2% over the range where
the expansion is legitimate.

The engineering reading: half the Curie temperature costs 4% of the
magnetisation, but nine tenths costs 47%. Cores are safe over most of their
range and then fail rapidly, which is why the datasheet limit is a Curie
MARGIN rather than a fraction.

## 11.3 Ordering temperatures worth recognising

| Material | Ordering temperature | Class | Consequence |
|---|---|---|---|
| Cobalt | 1115 °C | ferro | irrelevant in service |
| Iron | 770 °C | ferro | irrelevant in service |
| Nickel | 358 °C | ferro | relevant in some heaters |
| SmCo magnets | 720 to 800 °C | ferri/ferro | excellent high-temperature magnet |
| NdFeB magnets | 310 to 370 °C | ferri/ferro | irreversible loss well below this |
| MnZn power ferrite | 120 to 220 °C | ferri | a real design constraint |
| Gadolinium | 20 °C | ferro | magnetic near room temperature only |
| Chromium | 38 °C (Neel) | antiferro | ordering vanishes just above room temperature |

The ferrite row is the one that bites. A switching supply running a core at
110 °C with a Curie point of 130 °C has almost no margin, and ferrite losses
generally RISE as the Curie point is approached, so an overheating core loses
permeability, ripples harder, dissipates more and runs away. Permanent magnets
have a second, earlier limit: irreversible loss begins at a maximum operating
temperature far below $T_c$, because partial demagnetisation at the operating
load line does not recover on cooling.

## 11.4 Magnetostriction: the core changes shape

A magnetised material strains. The fractional length change along the field is
the **magnetostriction**

$$\\lambda = \\frac{\\Delta l}{l}$$

and its value at saturation, $\\lambda_s$, is quoted in parts per million.
Crucially the strain is an EVEN function of $B$: reversing the field reverses
the magnetisation but not the sign of the strain. A core driven at frequency
$f$ therefore vibrates at

$$f_{acoustic} = 2f$$

which is why a 50 Hz transformer hums at 100 Hz and a 60 Hz one at 120 Hz,
with harmonics at every further even multiple.

| Material | $\\lambda_s$ (parts per million) | Note |
|---|---|---|
| Nickel | $-33$ | large and negative; the classic magnetostrictive metal |
| Cobalt | $-62$ | polycrystalline value |
| Iron | $\\approx -7$ | polycrystalline; single crystals are $+21$ along one axis and $-21$ along another |
| Grain-oriented 3% silicon iron | $+7$ to $+9$ | along the rolling direction; the source of transformer hum |
| MnZn ferrite | $-1$ to $-3$ | small, which helps quiet switching supplies |
| Terfenol-D | $+1600$ to $+2000$ | engineered giant magnetostriction, for actuators |

Values depend strongly on crystallographic direction, on alloy composition and
on applied mechanical stress, so a single number per material is a summary
rather than a constant.

## 11.5 Worked: the displacement behind transformer hum

Given: a grain-oriented silicon-steel limb 0.3 m long, reaching a peak
magnetostrictive strain of $2 \\times 10^{-6}$ at working flux density, driven
at 60 Hz.

$$\\Delta l = \\lambda\\,l = (2 \\times 10^{-6})(0.3) = 6.0 \\times 10^{-7}\\ \\mathrm{m} = 0.60\\ \\mu\\mathrm{m}$$

$$f_{acoustic} = 2(60) = 120\\ \\mathrm{Hz}$$

Six tenths of a micrometre, twice per cycle, radiating from a large flat steel
surface. That is the entire mechanism of the sound a substation makes. Three
consequences follow. The hum is at twice line frequency and is therefore a
diagnostic — a transformer that suddenly hums at line frequency has a
mechanical problem, not a magnetostrictive one. The displacement grows steeply
with flux density, so a transformer run above its design flux gets audibly
louder before it gets measurably hotter. And clamping the core changes the
sound but cannot remove the source, since the strain is generated inside the
steel.

For contrast, the same 0.3 m of Terfenol-D at $1.6 \\times 10^{-3}$ would move
480 μm — nearly half a millimetre, which is why that material is built into
sonar transducers and precision actuators rather than avoided.

## 11.6 The inverse effect, and why it matters

Magnetostriction runs backwards: applying mechanical stress changes the
permeability and the magnetisation. This **Villari effect** is the basis of
magnetoelastic torque and force sensors, and it is also a nuisance, because a
core that is clamped, potted or thermally stressed has a different permeability
from the same core sitting loose. Ferrite cores are specified with mounting
pressure limits for exactly this reason, and a gapped core held together with
an over-tightened clamp can shift its inductance by a few percent — a change
large enough to matter in a resonant converter and invisible to every
electrical measurement made before assembly.`,
      examTip: 'Magnetostriction is even in flux density, so the acoustic tone is at twice the electrical frequency. An item that asks for the hum frequency of a 60 hertz transformer wants 120 hertz, and the 60 hertz option is there for anyone who did not notice the strain does not care about the sign of B.',
    },
    {
      id: 'mag-set-a',
      title: '12. Problem Set A: Magnetic Circuits, Flux and Inductance',
      content: `## 12.1 Problem Set A

Work each to a number first. Every answer comes from a relation stated earlier
in this chapter.

**A1.** A toroid carries 500 turns on a core of magnetic path length 0.25 m and
cross-section 6 cm², with $\\mu_r = 1200$, driven at 0.12 A. Find $H$, $B$,
$\\Phi$ and $L$.

**A2.** Find the stored energy of A1 by the lumped formula and again by
integrating the field energy density over the core volume.

**A3.** Cut a 0.8 mm gap into the A1 core. Find the reluctance ratio, the new
inductance, the effective permeability, the flux density at the same 0.12 A,
and the share of energy now held in the gap.

**A4.** A material has $\\chi_m = 4999$. State $\\mu_r$, and state the flux
density it produces at $H = 300$ A/m.

**A5.** A cobalt-based amorphous ribbon has $\\mu_r = 40\\,000$ and a core path
of 0.15 m. What gap length puts half the stored energy in the gap?

## 12.2 Worked answers to Problem Set A

**A1.**

$$H = \\frac{NI}{l} = \\frac{(500)(0.12)}{0.25} = 240\\ \\mathrm{A/m}$$

$$B = \\mu_0\\mu_r H = (1.2566370614 \\times 10^{-6})(1200)(240) = 0.3619\\ \\mathrm{T}$$

$$\\Phi = BA = (0.3619)(6 \\times 10^{-4}) = 2.1715 \\times 10^{-4}\\ \\mathrm{Wb}$$

$$L = \\frac{\\mu_0\\mu_r N^{2}A}{l} = \\frac{(1.2566370614 \\times 10^{-6})(1200)(500)^{2}(6 \\times 10^{-4})}{0.25} = 0.90478\\ \\mathrm{H}$$

Cross-check through reluctance:

$$\\mathcal{R} = \\frac{0.25}{(1.2566370614 \\times 10^{-6})(1200)(6 \\times 10^{-4})} = 2.7631 \\times 10^{5}\\ \\mathrm{A/Wb}$$

$$L = \\frac{N^{2}}{\\mathcal{R}} = \\frac{2.5 \\times 10^{5}}{2.7631 \\times 10^{5}} = 0.90478\\ \\mathrm{H}$$

identical, by a route that never used the permeability twice.

**A2.** Lumped:

$$U = \\tfrac{1}{2}LI^{2} = \\tfrac{1}{2}(0.90478)(0.12)^{2} = 6.5144 \\times 10^{-3}\\ \\mathrm{J}$$

By field energy density, $u = B^{2}/(2\\mu_0\\mu_r)$ over a volume
$Al = (6 \\times 10^{-4})(0.25) = 1.5 \\times 10^{-4}\\ \\mathrm{m^3}$:

$$U = \\frac{(0.3619)^{2}}{2(1.2566370614 \\times 10^{-6})(1200)}(1.5 \\times 10^{-4}) = 6.5144 \\times 10^{-3}\\ \\mathrm{J}$$

The two agree to five figures, which is the check worth doing whenever a
magnetic energy is quoted.

**A3.** The controlling group first:

$$\\frac{\\mathcal{R}_g}{\\mathcal{R}_c} = \\mu_r\\frac{l_g}{l_c} = (1200)\\frac{8 \\times 10^{-4}}{0.25} = 3.84$$

$$L = \\frac{0.90478}{1 + 3.84} = 0.18694\\ \\mathrm{H}, \\qquad \\mu_e = \\frac{1200}{4.84} = 247.9$$

$$B = \\frac{0.3619}{4.84} = 0.07477\\ \\mathrm{T}$$

$$\\frac{U_g}{U_{total}} = \\frac{3.84}{4.84} = 0.7934$$

Every one of those is the ungapped answer scaled by the same factor of 4.84 —
which is why computing that group first is worth the ten seconds.

**A4.**

$$\\mu_r = 1 + \\chi_m = 5000$$

$$B = \\mu_0\\mu_r H = (1.2566370614 \\times 10^{-6})(5000)(300) = 1.885\\ \\mathrm{T}$$

A flux density of 1.885 T is above the saturation of everything except iron and
cobalt-iron alloys, so the honest answer names the assumption: this is what the
LINEAR relation predicts, and a real material with that initial permeability
would have left the linear region long before 300 A/m.

**A5.** Half the energy sits in the gap when the gap length equals the
equivalent air length of the core:

$$l_g = \\frac{l_c}{\\mu_r} = \\frac{0.15}{40\\,000} = 3.75 \\times 10^{-6}\\ \\mathrm{m} = 3.75\\ \\mu\\mathrm{m}$$

Under four micrometres. On a material this permeable, a gap you could create by
a fingerprint on a mating face halves the effective permeability — which is why
very high permeability cores are supplied as uncut toroids and why any
cut-core assembly of them is lapped, not merely clamped.`,
      examTip: 'Compute mu-r times gap over core path FIRST in any gapped-core problem. Inductance, flux density and effective permeability all divide by one plus that group, saturation current multiplies by it, and the gap energy share is the group divided by one plus itself.',
    },
    {
      id: 'mag-set-b',
      title: '13. Problem Set B: Losses, Temperature and Materials',
      content: `## 13.1 Problem Set B

**B1.** A core dissipates 20 W of hysteresis loss and 10 W of eddy loss at
50 Hz. At 60 Hz and the same peak flux density, find the total.

**B2.** A material traces a loop of area 300 J/m³ at working flux density. Find
the hysteresis power in a $8 \\times 10^{-4}$ m³ core at 50 Hz and again at
60 Hz.

**B3.** A 400 Hz design runs at $B_m = 1.2$ T in a steel of
$\\rho = 5.5 \\times 10^{-7}\\ \\Omega \\cdot \\mathrm{m}$. Find the lamination
thickness that meets an eddy-loss budget of 4000 W/m³, and check the thin-sheet
assumption at $\\mu_r = 4000$.

**B4.** Laminations are changed from 0.50 mm to 0.27 mm with everything else
held. By what factor does eddy loss change, and does hysteresis loss change?

**B5.** A ferrite has a Curie temperature of 210 °C. At what case temperature
does the mean-field model say it retains half its saturation magnetisation, and
why is that not the design limit?

## 13.2 Worked answers to Problem Set B

**B1.** Scale the two mechanisms separately:

$$P = 20\\left(\\frac{60}{50}\\right) + 10\\left(\\frac{60}{50}\\right)^{2} = 24 + 14.4 = 38.4\\ \\mathrm{W}$$

The single-factor answers are 36 W (both scaled linearly) and 43.2 W (both
scaled quadratically); both will be on the option list.

**B2.**

$$P_h = f\\mathcal{V}W = (50)(8 \\times 10^{-4})(300) = 12.0\\ \\mathrm{W}$$

$$P_h = (60)(8 \\times 10^{-4})(300) = 14.4\\ \\mathrm{W}$$

The loop area itself grows with peak flux density in reality, so holding it
fixed while changing frequency is the stated assumption, not a law.

**B3.**

$$t = \\sqrt{\\frac{6\\rho\\,p_e}{\\pi^{2}f^{2}B_m^{2}}} = \\sqrt{\\frac{6(5.5 \\times 10^{-7})(4000)}{\\pi^{2}(400)^{2}(1.2)^{2}}} = 7.619 \\times 10^{-5}\\ \\mathrm{m} = 76.2\\ \\mu\\mathrm{m}$$

Validity:

$$\\delta = \\sqrt{\\frac{5.5 \\times 10^{-7}}{\\pi(400)(1.2566370614 \\times 10^{-6})(4000)}} = 2.951 \\times 10^{-4}\\ \\mathrm{m} = 0.295\\ \\mathrm{mm}$$

so $t/\\delta = 0.258$, comfortably thin, and the classical formula stands. Note
that 76 μm is thin foil rather than sheet, which is precisely why 400 Hz
aircraft transformers are expensive and why the alternative — moving to a
ferrite or a nanocrystalline ribbon — is often taken instead.

**B4.** Eddy loss goes as thickness squared:

$$\\frac{p_e(0.27)}{p_e(0.50)} = \\left(\\frac{0.27}{0.50}\\right)^{2} = 0.2916$$

a fall to 29.2% of the original. Hysteresis loss does not change at all: it is
a property of the material and the flux swing, and thinner sheets of the same
alloy trace the same loop. An answer that scales both is scaling a geometric
effect as if it were a material one.

**B5.** Solving $m = \\tanh(m/t)$ for the reduced temperature that gives
$m = 0.5$ returns $t = 0.9102$, so

$$T = 0.9102\\,T_c = 0.9102(210 + 273) = 439.6\\ \\mathrm{K} = 166.6\\ ^\\circ\\mathrm{C}$$

But that is nowhere near a design limit, for three separate reasons. Ferrite
core loss rises steeply approaching $T_c$, so thermal runaway arrives first.
Saturation flux density falls with magnetisation, so a core designed at 0.4 T
at 25 °C is saturating at 0.2 T long before 165 °C. And the winding insulation
and the potting compound have their own limits, usually well below. Practical
ferrite design keeps the core 50 to 80 K below $T_c$, and the mean-field number
is useful only as an upper bound that shows how much margin the real limits are
buying.

## 13.3 Where marks are lost in this half of the chapter

| Error | What it looks like | The fix |
|---|---|---|
| Susceptibility used as permeability | mu-r quoted as 4999 instead of 5000 | mu-r is one PLUS chi, and for ferromagnets the difference is invisible |
| Loop area quoted as a power | J/m³ reported in watts | multiply by frequency AND core volume |
| Turns count kept in a loss calculation | core loss said to depend on N | N cancels in the H dB derivation |
| One permeability used everywhere | initial permeability applied at a DC bias | incremental permeability under bias can be six times smaller |
| Eddy formula used past its validity | thick block loss taken from the t-squared law | check t against the skin depth first |
| Gap treated as a small correction | 0.5 mm gap ignored beside 100 mm of core | the gap reluctance is mu-r times larger per unit length |
| Fringing ignored or over-trusted | a computed inductance quoted to three figures | fringing corrections disagree by a factor of two; measure |
| Curie point confused with saturation | a saturating core said to be too hot | saturation reverses within the cycle; the Curie loss does not |`,
      examTip: 'Frequency-scaling items always give you the loss SPLIT, and they give it for a reason: hysteresis carries the first power of frequency and eddy currents the second. Scale each separately, add, and check that your answer sits between the two single-factor traps.',
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
