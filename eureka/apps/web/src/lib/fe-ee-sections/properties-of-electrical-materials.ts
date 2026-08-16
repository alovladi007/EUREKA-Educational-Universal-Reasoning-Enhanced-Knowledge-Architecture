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
