// FE EE course content — Engineering Sciences (3 topics).
// Split byte-identically from fe-ee-course-data.ts so section waves
// can be authored in parallel; spread back into FE_EE_COURSE there.
import type { TopicLesson } from '../fe-ee-course-data';

export const FE_EE_ENGINEERING_SCIENCES: Record<string, TopicLesson> = {
fee_work_energy: {
  topicId: 'fee_work_energy',
  title: 'Work, Energy, Power, and Efficiency',
  domainWeight: 'Engineering Sciences · 3–5%',
  overview: 'Energy conversion is the core of electrical engineering. Power in circuits, energy stored in reactive elements, and efficiency calculations connect electrical quantities to real-world mechanical and thermal systems.',
  sections: [
    {
      id: 'we-power',
      title: '1. Electrical Power and Energy',
      content: `## 1.1 Power Fundamentals

**$P = V\\cdot I$** (instantaneous power in watts)

For resistive elements, three equivalent forms:
- **$P = V\\cdot I = I^{2}R = V^{2}/R$**

All three give the same result; choose based on which quantities you know.

### Energy

Energy is power integrated over time: **$W = \\int P dt = P\\cdot t$** (for constant power)

Units: 1 joule = 1 watt·second; 1 kWh = 3.6 MJ

## 1.2 Energy Stored in Reactive Elements

| Element | Energy Formula | Stored In |
|---|---|---|
| Capacitor | **$W = \\tfrac{1}{2} CV^{2}$** | Electric field |
| Inductor | **$W = \\tfrac{1}{2} LI^{2}$** | Magnetic field |

Reactive elements store and return energy — they do NOT dissipate power (ideal case). Only resistors dissipate power as heat.

## 1.3 Efficiency

**η = P_out / P_in = (useful output) / (total input)**

- Always less than 100% due to losses
- Losses include: I²R (copper losses), core losses, friction, windage

| Device | Typical Efficiency |
|---|---|
| Power transformer | 95-99% |
| Electric motor | 80-95% |
| Solar panel | 15-22% |
| LED lighting | 30-50% |`,
      examTip: 'P = V·I = I²R = V²/R — know all three forms and choose wisely. If you know V and R, use V²/R (do not solve for I first). If you know I and R, use I²R. This saves calculation steps on the FE exam.',
    },
    {
      id: 'we-mechanical',
      title: '2. Electromechanical Energy Conversion',
      content: `## 2.1 Mechanical Power

**$P_{mech} = \\tau \\cdot \\omega$** (torque × angular velocity)

Where τ is in N·m and ω is in rad/s.

### Conversion: Electrical ↔ Mechanical

- **Motor**: electrical input → mechanical output; P_elec = V·I, P_mech = τ·ω
- **Generator**: mechanical input → electrical output; P_mech = τ·ω, P_elec = V·I

Efficiency: η = P_out/P_in (losses = P_in - P_out)

## 2.2 Conservation of Energy

In any system: **Energy in = Energy out + Losses**

For a motor: V·I = τ·ω + P_copper + P_core + P_friction

This energy balance is fundamental to every power conversion problem on the FE exam.

## 2.3 Kinetic and Potential Energy

- **Kinetic**: KE = ½mv²
- **Gravitational potential**: PE = mgh
- **Spring potential**: PE = ½kx²

These appear in electromechanical problems where electrical energy converts to or from mechanical energy (motors, generators, actuators).`,
      examTip: 'For motor problems: input power = V·I (electrical), output power = τ·ω (mechanical), and η = τ·ω/(V·I). Always check units: ω must be in rad/s (not RPM). Convert: ω = 2π·(RPM)/60.',
      importantNote: 'Mechanical power P = τ·ω requires ω in rad/s. A common FE exam error is using RPM directly. Always convert: ω (rad/s) = 2π × N (rev/s) = 2π × RPM / 60.',
    },
    {
      id: 'we-thermal',
      title: '3. Heat, the First Law, and Sizing a Heatsink',
      content: `## 3.1 Every watt you lose becomes heat, and heat has to go somewhere

The engineering sciences questions on this exam are the ones that connect
electrical quantities to the physical world, and the connection that matters
most in practice is thermal. A resistor dissipating 12 W is a 12 W heater; the
only question is how hot it has to get before it can shed that power to the
room. Two relations do almost all of the work.

**Sensible heat** — energy to change a temperature without changing phase:

**$Q = m\\cdot c\\cdot \\Delta T$**

**Conduction through a thermal resistance** — the steady-state form:

**$\\Delta T = P\\cdot \\theta$**

The second equation is Ohm's law with different units: temperature difference
plays the role of voltage, power plays the role of current, and thermal
resistance (in kelvin per watt, K/W) plays the role of resistance. Everything
you already know about series and parallel resistances transfers directly, and
that is not an analogy for teaching purposes — it is the same linear
conservation law with different labels.

## 3.2 Worked problem: heating water

**Given**: 2.5 kg of water, specific heat 4,186 J/(kg·K), heated from 20 °C to
80 °C by a 1.5 kW immersion element.

**Step 1 — energy required.**
Q = 2.5 × 4,186 × 60 = **627,900 J = 627.9 kJ**.

**Step 2 — convert to the utility's unit.** One kilowatt-hour is 3.6 MJ, so
627,900 J = **0.17442 kWh**. At 0.12 per kWh the energy costs about **2.1
cents** — a good sanity anchor for how cheap energy is and how expensive
inefficiency is at scale.

**Step 3 — time at full power.** t = 627,900/1,500 = **418.6 s ≈ 7.0 min**.

**Step 4 — with real losses.** If only 92% of the element's power reaches the
water, t = 627,900/(1,500 × 0.92) = **455.0 s ≈ 7.6 min**. The lost 8% did not
disappear; it warmed the tank and the room.

## 3.3 Worked problem: junction temperature

**Given**: a power device dissipating 12 W in a 40 °C ambient. Junction-to-case
resistance 1.5 K/W, case-to-sink (the thermal interface) 0.5 K/W, sink-to-air
2.8 K/W. Maximum allowable junction temperature 125 °C.

**Step 1 — add the series resistances.**
θ_total = 1.5 + 0.5 + 2.8 = **4.8 K/W**.

**Step 2 — rise above ambient.** ΔT = 12 × 4.8 = 57.6 K.

**Step 3 — junction temperature.** Tj = 40 + 57.6 = **97.6 °C**, comfortably
inside the limit.

**Step 4 — find the design margin.** The largest sink-to-air resistance that
keeps 12 W legal is

θ_sa,max = (125 − 40)/12 − (1.5 + 0.5) = 7.0833 − 2.0 = **5.083 K/W**

and the largest power the existing 2.8 K/W sink can carry is
(125 − 40)/4.8 = **17.71 W**.

![Junction temperature against heatsink-to-ambient thermal resistance for three dissipations, each line computed as Tj = Ta + P(1.5 + 0.5 + theta_sa) with a 40 C ambient. The dashed line is the 125 C junction limit; the marked points are the 12 W design at 97.6 C on a 2.8 K/W sink and the 5.083 K/W resistance at which that same 12 W runs out of margin.](/courses/fe-ee/figures/sci-thermal-resistance.svg)

Read the figure as a design tool rather than a plot. Ambient temperature sets
where every line starts, the package resistances set where they start on the
vertical axis, and the only quantity a designer usually gets to choose is the
horizontal one — how good a heatsink to buy. The lines fan out with power, so
the same sink that gives generous margin at 8 W is marginal at 17.7 W and
illegal at 25 W. The most common real-world failure is not visible on the plot
at all: with no heatsink, a typical θ_sa of 40 K/W puts the junction of this
same 12 W device at 544 °C, which is a way of saying the device is destroyed
within seconds.

## 3.4 Heat engines and the Carnot ceiling

Any device converting heat into work is bounded by the temperatures it works
between:

**$\\eta _{Carnot} = 1 - T_{C}/T_{H}$**

with both temperatures **absolute** (kelvin or rankine). Between a 700 K source
and a 300 K sink the ceiling is 1 − 300/700 = **57.14%**. No arrangement of
machinery beats that, which is why the answer to "the plant achieves 65%
between these reservoirs" is always that the claim is impossible, not that the
design is clever.

Real plants come in well below the ceiling. A 900 kW thermal input at 38%
efficiency delivers 342 kW of work and rejects **558 kW** as waste heat, which
is why large power stations sit next to rivers or cooling towers. The exam
tests the absolute-temperature conversion more often than it tests the
concept — 400 °C is 673.15 K, and using 400 in the ratio produces a wrong
answer that looks plausible.

## 3.5 Where the energy is stored, and how much

Two storage formulas from the circuit world close the loop with the thermal
ones, because energy stored is energy that must eventually be dissipated
somewhere:

| Element | Energy | Worked value |
|---|---|---|
| Capacitor | W = ½CV² | 470 µF at 25 V stores **0.1469 J** |
| Inductor | W = ½LI² | 2.2 mH at 4 A stores **17.6 mJ** |
| Moving mass | W = ½mv² | 1,200 kg at 20 m/s carries 240 kJ |
| Raised mass | W = mgh | 1,200 kg lifted 10 m gains 117.7 kJ |

The capacitor figure is a useful scale reference: 0.1469 J dumped into a short
circuit in a microsecond is 147 kW of instantaneous power, which is why charged
capacitor banks are a shock and arc hazard long after the supply is switched
off, and why the discharge rules in section 4 of the professional-liability
topic exist.`,
      examTip: 'Thermal resistances in a stack add exactly like series electrical resistances, and Tj = Ta + P·Σθ. If the question gives you a maximum junction temperature, it is asking either for the largest θ_sa or the largest P — both are one rearrangement of that single equation.',
      importantNote: 'Carnot efficiency needs ABSOLUTE temperatures. Convert °C to K by adding 273.15 before taking the ratio. Using Celsius values directly is the most common error in this family of problems and always overstates the efficiency.',
    },
    {
      id: 'we-efficiency-chain',
      title: '4. Efficiency Chains, Losses, and What Energy Costs',
      content: `## 4.1 Efficiencies multiply

Real systems convert energy several times over, and the efficiencies of the
stages **multiply**:

**$\\eta _{overall} = \\eta _{1}\\cdot \\eta _{2}\\cdot \\eta _{3}\\cdots$**

Nobody who has seen this written down gets it wrong in the abstract, and plenty
of people get it wrong in a hurry by averaging. Averaging 0.93, 0.88 and 0.96
gives 0.923; multiplying them gives **0.7857**. The difference is not small,
and it is always in the same direction.

**Worked problem.** A variable-speed drive delivers 5.000 kW of shaft power
through a rectifier at 93%, an inverter at 88%, and a motor at 96%. Find the
input power and where the losses occur.

**Step 1 — overall efficiency.** 0.93 × 0.88 × 0.96 = **0.785664**.

**Step 2 — input power.** P_in = 5,000/0.785664 = **6,364.04 W**.

**Step 3 — walk the chain backwards** to find the power crossing each
interface, and difference them:

| Interface | Power | Loss in the stage that follows |
|---|---|---|
| Input from the mains | 6,364.04 W | rectifier: 445.48 W |
| After the rectifier | 5,918.56 W | inverter: 710.23 W |
| After the inverter | 5,208.33 W | motor: 208.33 W |
| Shaft output | 5,000.00 W | — |

The three losses sum to 1,364.04 W, which is exactly P_in − P_out. Any energy
balance that does not close like that contains an arithmetic error.

![Bar chart of the power crossing each interface in a three-stage drive, computed backwards from a 5.000 kW shaft output through efficiencies of 0.93, 0.88 and 0.96. The arrows between bars are labelled with the loss in each stage, and the three losses sum exactly to the 1,364 W difference between input and output.](/courses/fe-ee/figures/sci-efficiency-cascade.svg)

The figure makes the engineering point that the arithmetic alone can hide. The
inverter at 88% is the worst stage by a wide margin — it throws away 710 W,
more than the other two stages combined — so it is where a design review should
start. This is the general rule for cascades: the loss in a stage depends on
both its efficiency and the power flowing through it, so improving the *worst*
stage is almost always worth more than improving the stage that happens to be
easiest to change.

## 4.2 Worked problem: what a motor costs to run

**Given**: a 15 hp motor at 90% efficiency, running 4,000 hours a year, with
electricity at 0.12 per kWh.

**Step 1 — output power in SI.** One horsepower is 745.7 W, so
15 hp = **11,185.5 W**.

**Step 2 — input power.** 11,185.5/0.90 = **12,428.3 W**.

**Step 3 — annual energy.** 12,428.3 W × 4,000 h = 49,713,333 Wh =
**49,713 kWh**.

**Step 4 — annual cost.** 49,713 × 0.12 = **5,965.60 per year**.

Now the question a plant engineer actually asks: is a premium-efficiency
replacement worth it? At 94% the input becomes 11,899.5 W, the annual energy
47,598 kWh, and the annual cost **5,711.74** — a saving of **253.86 a year**.
Over a twelve-year life at 8%, the present worth of that saving is
253.86 × (P/A, 8%, 12) = 253.86 × 7.536078 = **1,913.07**. That is the number
the purchase decision turns on, and it is exactly the machinery of the
engineering economics topic applied to an efficiency figure. Four points of
efficiency are worth about 1,900 on this motor — enough to justify a modest
price premium and not enough to justify a large one.

## 4.3 Where the losses live inside electrical equipment

| Loss | Scales as | Depends on load? | Typical home |
|---|---|---|---|
| Copper (I²R) | current squared | Yes, strongly | Windings, conductors |
| Core (hysteresis + eddy) | roughly flux squared | No — present whenever energised | Transformer and motor iron |
| Friction and windage | roughly speed cubed | With speed, not torque | Bearings, fans, rotor surfaces |
| Switching | frequency × energy per event | With frequency | Power semiconductors |

The load-dependence column is what makes efficiency a curve rather than a
number. Core losses are constant, so at light load they dominate and efficiency
collapses; copper losses grow as I², so at heavy load they dominate. Maximum
efficiency occurs where the two are equal, which is why transformers are
specified to hit peak efficiency somewhere near half to three-quarters of
rated load rather than at 100%.

## 4.4 Worked problem: conductor loss is a design choice

**Given**: a 15 A branch circuit carried on 30 m of 12 AWG copper
(3.309 mm² cross-section, resistivity 1.724×10⁻⁸ Ω·m).

**Step 1 — resistance.** R = ρL/A = (1.724e−8)(30)/(3.309e−6) =
**0.15630 Ω**.

**Step 2 — voltage drop.** V = IR = 15 × 0.15630 = **2.34 V**.

**Step 3 — power lost as heat.** P = I²R = 225 × 0.15630 = **35.17 W**, which
over 2,000 hours of operation is 70.3 kWh thrown away as warm wire.

**Step 4 — the design lever.** Going up to 10 AWG (5.261 mm²) drops the
resistance to 0.09831 Ω and the loss to **22.12 W** — 37.1% less heat for the
same current, because for a fixed length and material the loss is inversely
proportional to cross-sectional area. That is the entire economic argument for
conductor sizing beyond the ampacity minimum, and it is why long runs get
upsized even when the smaller wire is legal.`,
      examTip: 'Cascaded efficiency questions are testing one thing: multiply, never average. If the answer choices include both the product (0.7857 here) and the arithmetic mean (0.923), the mean is the distractor.',
      importantNote: 'Horsepower conversions: 1 hp = 745.7 W (often rounded to 746 W). Motor nameplates give OUTPUT power, so the electrical input is always nameplate/η — never the other way round.',
    },
  ],
  keyTakeaways: [
    'P = V·I = I²R = V²/R; three equivalent forms for resistive power.',
    'Capacitor energy: W = ½CV²; inductor energy: W = ½LI².',
    'Efficiency η = P_out/P_in; always < 100% due to losses.',
    'Mechanical power P = τ·ω; convert RPM to rad/s: ω = 2π·RPM/60.',
    'Energy balance: input = useful output + losses.',
  ],
},

fee_charge_current: {
  topicId: 'fee_charge_current',
  title: 'Charge, Current, Voltage, and Coulomb Force',
  domainWeight: 'Engineering Sciences · 3–5%',
  overview: 'Electric charge, current, voltage, and the forces between charges are the most fundamental concepts in electrical engineering. Ohm\'s law, Coulomb\'s law, and the Lorentz force connect these quantities.',
  sections: [
    {
      id: 'cc-fundamentals',
      title: '1. Charge, Current, and Voltage',
      content: `## 1.1 Electric Charge

**Charge** Q is measured in coulombs (C). One electron carries q = 1.602×10⁻¹⁹ C.

## 1.2 Current

**$I = dQ/dt$** (rate of charge flow, in amperes)

- 1 ampere = 1 coulomb/second
- **Conventional current** flows from + to - (opposite to electron flow)
- DC is constant; AC varies sinusoidally

## 1.3 Voltage

**$V = dW/dQ$** (work per unit charge, in volts)

- 1 volt = 1 joule/coulomb
- Voltage is the "pressure" that drives current through resistance
- **Ohm's law**: V = I·R

## 1.4 Coulomb's Law

Force between point charges:

**$F = k\\cdot Q_{1}\\cdot Q_{2}/r^{2}$** where k = 8.99×$10^{9}$ N·m²/C²

- Like charges repel; opposite charges attract
- Force decreases with square of distance (inverse-square law)

### Electric Field

**$E = F/Q = V/d$** (for uniform field)

| Quantity | Symbol | Unit | Definition |
|---|---|---|---|
| Charge | Q | Coulomb (C) | Fundamental quantity |
| Current | I | Ampere (A) | dQ/dt |
| Voltage | V | Volt (V) | dW/dQ |
| Electric field | E | V/m or N/C | Force per unit charge |`,
      examTip: 'I = dQ/dt and V = dW/dQ are the two most fundamental definitions. Ohm\'s law V = IR is an empirical relationship for resistive materials — it does NOT apply to capacitors, inductors, or nonlinear devices like diodes.',
    },
    {
      id: 'cc-lorentz',
      title: '2. Lorentz Force and Moving Charges',
      content: `## 2.1 The Lorentz Force

A charge q moving with velocity v in electric field E and magnetic field B experiences:

**$F = q(E + v \\times B)$**

- Electric force qE: along E direction (accelerates or decelerates charge)
- Magnetic force q(v×B): perpendicular to both v and B (deflects without doing work)

## 2.2 Force on a Current-Carrying Conductor

**$F = I\\cdot L \\times B = B\\cdot I\\cdot L\\cdot \\sin \\theta$**

Where L is the conductor length vector and θ is the angle between L and B.

Direction: use the **right-hand rule** — point fingers along I, curl toward B, thumb gives F direction.

## 2.3 Applications

- **DC motor**: current in magnetic field → force → rotation
- **Generator**: conductor moves through field → induced EMF
- **Hall effect sensor**: moving charges deflected → voltage across conductor
- **Mass spectrometer**: magnetic force separates ions by mass

### Motional EMF

A conductor moving through a magnetic field:

**$\\varepsilon = B\\cdot L\\cdot v$** (for v perpendicular to B and L)`,
      examTip: 'The Lorentz force F = q(E + v×B) combines electric and magnetic forces. The magnetic force is always PERPENDICULAR to velocity — it changes direction but not speed (does no work). This is why magnetic fields deflect charges but cannot accelerate them.',
    },
    {
      id: 'cc-fields-work',
      title: '3. Forces, Fields, and the Work Done Moving a Charge',
      content: `## 3.1 Superposition is the whole technique

Coulomb's law gives the force between two point charges. Every problem with
more than two charges is solved by the same law applied pairwise, with the
results added **as vectors**:

**$F = k\\cdot q_{1}q_{2}/r^{2}$**, with k = 8.99×10⁹ N·m²/C²

**$E = F/q = k\\cdot q/r^{2}$** — the field a single charge produces

There is no separate technique for three charges, or for ten. There is only
superposition, and the arithmetic difficulty is entirely in the vector
bookkeeping. On a straight line the vectors reduce to signs, which is why exam
problems overwhelmingly place charges on one axis.

**Worked problem.** A +4 nC charge sits at the origin and a −1 nC charge sits
at x = 0.30 m.

**Part (a) — the force between them.**
F = (8.99e9)(4e−9)(1e−9)/(0.30)² = 3.9956×10⁻⁷ N = **0.400 µN**, attractive,
because the charges have opposite signs.

**Part (b) — where is the net field zero on the axis?**

First reason about the location before computing it. Between the charges, the
field from the positive charge points in the +x direction and the field toward
the negative charge also points in the +x direction, so between them the two
contributions **add** and can never cancel. Outside the pair, they oppose. The
null must be nearer the weaker charge, so it lies beyond x = 0.30 m.

Setting the magnitudes equal at some x > 0.30:

k(4)/x² = k(1)/(x − 0.30)²

Taking square roots of both sides, 2/x = 1/(x − 0.30), so 2(x − 0.30) = x and
**x = 0.60 m**. Checking: the +4 nC contributes (8.99e9)(4e−9)/0.36 =
99.89 V/m and the −1 nC contributes (8.99e9)(1e−9)/0.09 = 99.89 V/m. Equal and
opposite; the null is confirmed.

![Net axial electric field of a +4 nC charge at the origin and a −1 nC charge at 0.30 m, plotted on a symmetric log scale so both the five decades of magnitude and the sign change are visible. The field passes through zero only at x = 0.60 m, outside the pair on the side of the weaker charge; between the charges the two contributions have the same sign and add.](/courses/fe-ee/figures/sci-field-null.svg)

The figure answers a question students often get wrong by instinct. The null is
**not** between the charges and it is **not** closer to the larger charge; it is
outside the pair, on the far side of the smaller one, at twice the separation
from the larger. The general rule the picture encodes: for opposite-sign
charges the null lies outside the pair beyond the weaker one, and for same-sign
charges it lies between them. Deciding which case you are in before doing any
algebra eliminates the extraneous root that the squared equation always
produces.

## 3.2 Work, potential, and the electron-volt

Voltage is defined as work per unit charge, so the work to move a charge
through a potential difference is a one-line computation:

**$W = q\\cdot \\Delta V$**

- Moving 2 µC through 12 V takes W = (2e−6)(12) = **24 µJ**.
- One electron moved through 1 V gains 1.602×10⁻¹⁹ J, which is the definition
  of the **electron-volt**. Through 1 kV it gains 1.602×10⁻¹⁶ J.

The electron-volt is not a piece of physics trivia; it is the unit that makes
semiconductor numbers legible. Silicon's band gap of 1.12 eV, a 0.7 V diode
drop and a 5 V logic supply are all directly comparable in these units, which
is why the semiconductor topics use them.

For a **uniform** field — the parallel-plate case — the field is the potential
gradient:

**$E = V/d$**

With 200 V across a 5 mm gap, E = 200/0.005 = **40 kV/m**, and a 3 nC charge in
that gap feels F = qE = (3e−9)(40,000) = **120 µN**. Note that the field
strength depends on the *ratio*, not on the voltage alone: the same 200 V
across 0.5 mm gives 400 kV/m, which is close to the breakdown strength of dry
air at sea level (about 3 MV/m) and explains why small gaps arc at voltages
that large gaps shrug off.

## 3.3 The three quantities and their definitions, in one place

| Quantity | Definition | Unit | Says |
|---|---|---|---|
| Charge Q | fundamental | coulomb (C) | how much |
| Current I | I = dQ/dt | ampere (A) = C/s | how fast it moves |
| Voltage V | V = dW/dQ | volt (V) = J/C | how much energy per unit moved |
| Field E | E = F/q = −dV/dx | V/m or N/C | how hard it pushes |
| Power P | P = VI = (dW/dQ)(dQ/dt) | watt (W) = J/s | energy per second |

The last row is worth reading twice. P = VI is not an independent formula to
memorise; it is the product of the definitions of voltage and current, with dQ
cancelling. Almost everything in the first half of this exam is a consequence
of the two definitions in rows two and three.

## 3.4 Ohm's law is a material property, not a law of nature

V = IR describes materials in which current is proportional to field. Many are:
metals over ordinary temperature ranges, carbon composition, most electrolytes.
Many are not: diodes (exponential), varistors (highly nonlinear by design),
lamps (resistance rises steeply with temperature), and any capacitor or
inductor, where the relation involves a derivative rather than a ratio.

Resistance itself follows from geometry and material:

**$R = \\rho L/A$**

and the resistivity of a metal rises with temperature:

**$R_{T} = R_{0}[1 + \\alpha (T - T_{0})]$**

For copper with α ≈ 0.00393 /°C referred to 20 °C, a winding at 75 °C has
1 + 0.00393(55) = **1.216 times** its cold resistance. That 21.6% is why motor
and transformer efficiency is quoted at a stated temperature, and why a
resistance measurement taken on cold equipment cannot be compared with one
taken after hours of running.`,
      examTip: 'For a null-point problem, decide the region first: opposite-sign charges null OUTSIDE the pair beyond the weaker charge; same-sign charges null BETWEEN them. Then take square roots rather than expanding the quadratic — 2/x = 1/(x−d) is one line, and the expanded form gives a spurious second root.',
      importantNote: 'E = V/d holds only for a UNIFORM field, which in practice means the parallel-plate geometry. For a point charge the field is kq/r² and the potential is kq/r — different powers of r, and confusing them is a standard distractor.',
    },
    {
      id: 'cc-drift-density',
      title: '4. Current as Charge in Motion: Drift, Density, and Bookkeeping',
      content: `## 4.1 Current density and drift velocity

Current is the flow rate of charge through a cross-section. Spreading it over
the area gives **current density**, and dividing by the charge available per
unit volume gives the average speed of the carriers:

**$J = I/A$**  and  **$v_{d} = J/(n\\cdot q)$**

where n is the free-carrier concentration and q is the elementary charge.

**Worked problem.** A 15 A current flows in 12 AWG copper, cross-section
3.309 mm², with n ≈ 8.5×10²⁸ free electrons per cubic metre.

**Step 1 — current density.**
J = 15/(3.309e−6) = 4.533×10⁶ A/m² = **4.53 A/mm²**.

**Step 2 — drift velocity.**
v_d = (4.533e6)/[(8.5e28)(1.602e−19)] = 3.329×10⁻⁴ m/s = **0.333 mm/s**.

That is about **1.2 metres per hour**. An electron entering one end of a 30 m
run would take roughly **a day** to reach the far end. Yet the lamp at the far
end lights instantly, because the *signal* — the electromagnetic field that
tells charges everywhere in the circuit to start moving — propagates at a
substantial fraction of the speed of light. The conductor is already full of
charge carriers; the field only has to nudge them all at once.

Current density, not current, is what determines heating in a conductor, and it
is the quantity that connects wire gauge tables to physics. Continuous-duty
copper in free air is typically run at a few amperes per square millimetre;
the 4.53 A/mm² computed above is in that range, which is why 12 AWG is a
sensible conductor for a 15 A circuit.

## 4.2 Charge bookkeeping

Because I = dQ/dt, charge is the integral of current, and a constant current
makes it a multiplication:

**$Q = I\\cdot t$**

- A battery rated 2,000 mAh delivers 2 A for one hour, which is
  2 × 3,600 = **7,200 C**.
- That is 7,200/1.602×10⁻¹⁹ = **4.49×10²²** electrons.
- A 15 A breaker passes 900 C in a minute — more charge in sixty seconds than a
  phone battery holds.

The ampere-hour is a charge unit dressed as something else, and questions
exploit this. Energy requires the voltage as well: the same 2,000 mAh cell at a
nominal 3.7 V stores 2 × 3.7 = 7.4 Wh = **26.6 kJ**, and it is the watt-hour,
never the ampere-hour, that can be compared across chemistries.

## 4.3 The capacitor: charge stored per volt

**$Q = C\\cdot V$**, so **$i = C\\,dv/dt$**

A 470 µF capacitor charged to 25 V holds Q = (470e−6)(25) = **11.75 mC** and
stores ½CV² = **0.147 J**. The derivative form carries two exam-relevant
consequences. The voltage across a capacitor **cannot change instantaneously**
without infinite current, which is the initial condition every transient
problem starts from. And a capacitor draws current in proportion to how fast
the voltage moves, which is why it is a short circuit to fast edges and an open
circuit to DC.

## 4.4 Conventional current, and why the sign convention is not physics

Current in circuit analysis flows from + to −, opposite to the motion of the
electrons that actually carry it in a metal. The convention predates the
discovery of the electron and was never corrected because nothing depends on
it — every circuit law is consistent under either choice, provided you make one
choice and hold it.

What does matter is the **passive sign convention**: current is taken to enter
the + terminal of an element that absorbs power. With that convention, P = VI
comes out positive for a resistor absorbing energy and negative for a source
delivering it, and an energy balance around a circuit sums to zero. A sign
error here does not produce a slightly wrong answer; it produces an answer that
claims a resistor is generating power.

## 4.5 Putting the definitions to work

**Worked problem.** A 12 V battery drives 2.5 A through a resistive load for 20
minutes. Find the charge moved, the energy delivered, the power, and the load
resistance.

- **Charge**: Q = It = 2.5 × 1,200 = **3,000 C**
- **Energy**: W = QV = 3,000 × 12 = **36,000 J = 36 kJ = 0.01 kWh**
- **Power**: P = VI = 30 W, and 30 W × 1,200 s = 36,000 J, which closes
- **Resistance**: R = V/I = 12/2.5 = **4.8 Ω**, and I²R = 6.25 × 4.8 = 30 W,
  which closes again

Every quantity in that problem came from I = dQ/dt, V = dW/dQ, and Ohm's law,
and every one was checked against another route to the same number. That habit
of closing the loop — computing the answer twice by different paths — is worth
more on this exam than any additional formula.`,
      examTip: 'Drift velocity questions look exotic and are one substitution: v = I/(nqA). The surprising answer — under a millimetre per second — is the point of the question, so an answer choice in metres per second is almost certainly the distractor built from forgetting the carrier density.',
    },
  ],
  keyTakeaways: [
    'Current I = dQ/dt; voltage V = dW/dQ; Ohm\'s law V = IR for resistive elements.',
    'Coulomb\'s law: F = k·Q₁·Q₂/r²; inverse-square law.',
    'Lorentz force: F = q(E + v×B); magnetic force is perpendicular to velocity.',
    'Force on conductor: F = BIL; direction by right-hand rule.',
    'Motional EMF: ε = BLv for conductor moving through field.',
  ],
},

fee_electromech: {
  topicId: 'fee_electromech',
  title: 'Electromechanical Conversion & Sensors',
  domainWeight: 'Engineering Sciences · 3–5%',
  overview: 'Electromechanical conversion transforms electrical energy to mechanical (motors) and vice versa (generators). Sensors convert physical quantities to electrical signals. These bridge fundamental physics and practical engineering.',
  sections: [
    {
      id: 'em-motors-gen',
      title: '1. Motors and Generators',
      content: `## 1.1 Motor Principles

A current-carrying loop in a magnetic field experiences torque:

**$\\tau = N\\cdot B\\cdot I\\cdot A\\cdot \\sin \\theta$**

Where N = turns, B = flux density, I = current, A = loop area, θ = angle to field.

- **Maximum torque**: τ_max = NBIA (when θ = 90°)
- **Motor equation**: V_applied = I·R + E_back
- **Back-EMF**: E_back = k·ω (proportional to speed)

### Motor Operation

At startup: ω = 0 → E_back = 0 → large inrush current I = V/R.
At steady state: E_back ≈ V → small current (just supplying load + losses).

## 1.2 Generator Principles

**Faraday's law**: ε = -N·dΦ/dt

A rotating coil in a magnetic field:

**$\\varepsilon = N\\cdot B\\cdot \\omega \\cdot A\\cdot \\cos (\\omega t)$**

- Peak EMF: ε_peak = NBAω
- Higher speed → higher voltage
- This is the basis of all AC generators

## 1.3 Power Conversion

| Device | Input | Output | Efficiency |
|---|---|---|---|
| Motor | V·I (electrical) | τ·ω (mechanical) | $\\eta = \\tau \\cdot \\omega /(V\\cdot I)$ |
| Generator | τ·ω (mechanical) | V·I (electrical) | $\\eta = V\\cdot I/(\\tau \\cdot \\omega)$ |`,
      examTip: 'Motors and generators use the same electromagnetic principles in opposite directions. The motor equation V = IR + E_back is essential: at high speed, E_back is large so current is small. At stall (ω=0), current is maximum V/R — this is why motors need current limiting at startup.',
    },
    {
      id: 'em-sensors',
      title: '2. Sensors and Measurement',
      content: `## 2.1 Common Sensors

| Sensor | Measures | Principle | Key Formula |
|---|---|---|---|
| Strain gauge | Deformation | Resistance change | $\\Delta R/R = GF\\cdot \\varepsilon$ |
| Thermistor | Temperature | R(T) changes | $R = R_{0}\\cdot \\exp [\\beta (1/T-1/T_{0})]$ |
| Thermocouple | Temperature | Seebeck voltage | $V \\propto \\Delta T$ |
| Accelerometer | Acceleration | Piezoelectric/MEMS | V ∝ acceleration |
| Pressure sensor | Pressure | Diaphragm deflection | V ∝ pressure |

## 2.2 Sensor Characteristics

- **Sensitivity**: output change per unit input (e.g., mV/°C)
- **Accuracy**: closeness to true value
- **Precision**: repeatability of measurements
- **Linearity**: output proportional to input over range
- **Resolution**: smallest detectable change

## 2.3 Wheatstone Bridge

The **Wheatstone bridge** extracts small resistance changes from sensors:

At balance: **$R_{1}/R_{2} = R_{3}/R_{4}$** → output voltage = 0

When one arm changes by ΔR (sensor):
- Output voltage **$V_{out} \\approx V_{supply} \\cdot \\Delta R/(4R)$** (for small ΔR)

Used with strain gauges, RTDs, and other resistive sensors for precise measurement.`,
      examTip: 'For the strain gauge formula ΔR/R = GF·ε, the gauge factor GF ≈ 2 for metallic gauges. The Wheatstone bridge detects the tiny ΔR by producing a proportional output voltage. This is the standard measurement circuit for resistive sensors.',
    },
    {
      id: 'em-dc-machine-lines',
      title: '3. The DC Machine Is a Set of Straight Lines',
      content: `## 3.1 Two equations describe the whole machine

A permanent-magnet DC motor is completely described, for exam purposes, by two
relations and one constant:

**$V = I_{a}R_{a} + k\\omega$**  (the electrical loop, with kω the back-EMF)
**$\\tau = k\\cdot I_{a}$**  (the mechanical output)

The same k appears in both, and in SI units it is the same **number** in both:
volt-seconds per radian and newton-metres per ampere are the same unit. That is
not a coincidence but a statement of energy conservation — the electrical power
consumed by the back-EMF, kω·Ia, is exactly the mechanical power produced,
τ·ω.

Solve the loop for current and substitute:

**$I_{a} = (V - k\\omega )/R_{a}$**, so **$\\tau = k(V - k\\omega )/R_{a}$**

Torque is a **straight line** falling with speed. Everything else follows.

## 3.2 Worked machine: 24 V, 0.6 Ω, k = 0.08

**The two endpoints first**, because they bound every other operating point.

- **Stall** (ω = 0): no back-EMF, so Ia = 24/0.6 = **40 A** and
  τ = 0.08 × 40 = **3.2 N·m**. This is the largest current and the largest
  torque the machine can produce, and it dissipates 960 W as heat with zero
  mechanical output.
- **No load** (τ = 0): current is zero, so kω = V and
  ω = 24/0.08 = **300 rad/s**, which is 300 × 60/(2π) = **2,865 RPM**.

**Maximum mechanical power.** P = τω = k(V − kω)ω/Ra is a downward parabola in
ω, zero at both endpoints, so it peaks halfway between them, at
ω = 150 rad/s. There:

Ia = (24 − 12)/0.6 = **20 A**, τ = **1.6 N·m**, P_out = 1.6 × 150 = **240 W**

which agrees with the closed form P_max = V²/(4Ra) = 576/2.4 = **240 W**. But
look at the input: P_in = 24 × 20 = 480 W, so the efficiency at maximum power is
exactly **50%** — half the input is burned in the armature resistance.

**A sensible operating point.** At ω = 250 rad/s:

| Quantity | Value |
|---|---|
| Armature current | (24 − 20)/0.6 = 6.667 A |
| Torque | 0.08 × 6.667 = 0.5333 N·m |
| Mechanical output | 0.5333 × 250 = 133.33 W |
| Electrical input | 24 × 6.667 = 160.00 W |
| Copper loss | (6.667)²(0.6) = 26.67 W |
| Efficiency | 133.33/160.00 = **83.33%** |

The loss column closes: 160.00 − 26.67 = 133.33 W.

## 3.3 The efficiency of this machine is a straight line too

Something clean falls out of the algebra. Efficiency is

η = τω/(V·Ia) = (k·Ia·ω)/(V·Ia) = kω/V = **ω/ω_no-load**

For an ideal machine whose only loss is armature resistance, **efficiency is
exactly the fraction of no-load speed**. At 250 rad/s out of 300, efficiency is
250/300 = 83.33% — matching the table above without computing any powers at
all. Real machines fall short of this because friction, windage and iron losses
are not in the model, which is why real efficiency curves peak somewhere below
no-load speed instead of rising all the way. But the idealisation explains the
shape, and it explains why motors are geared to run fast and loaded lightly
rather than run slow against a large torque.

![Torque, mechanical power and efficiency of the 24 V machine plotted against speed, all normalised so a single axis carries them. Torque falls linearly from stall to the no-load speed, power is the parabola that peaks at exactly half the no-load speed with a value of V squared over four times the armature resistance, and efficiency rises linearly as the ratio of speed to no-load speed.](/courses/fe-ee/figures/sci-motor-torque-speed.svg)

The figure carries the design lesson that separates a correct answer from a
sensible one. **Maximum power and good efficiency are different operating
points, and they are far apart.** The 150 rad/s peak-power point delivers the
most watts the machine can produce and wastes an equal number as heat; the
250 rad/s point delivers only 133 W but wastes just 27. Continuous-duty drives
are sized to run on the right-hand part of this plot; the peak-power point is a
short-term rating for acceleration, and running there continuously is a thermal
problem, not an electrical one.

## 3.4 Starting current, and what to do about it

At switch-on ω = 0, so there is no back-EMF and the current is limited only by
the armature resistance — **40 A** here against a running current of under 7 A,
a factor of six. On larger machines the ratio is worse. Three standard
remedies, all of which reduce to "keep the voltage off the armature until the
back-EMF exists":

- A **starting resistor** in series, shorted out progressively as speed builds
- **Reduced-voltage starting**, ramping the supply
- A **current-limited drive**, which does the same thing electronically

Induction machines have the same problem for the same reason: at standstill the
slip is 1, the rotor circuit sees full frequency, and the machine looks like a
short-circuited transformer. This is the connection between this topic and the
motor-starting material in power systems — one mechanism, two vocabularies.

## 3.5 The generator is the same machine, read backwards

Drive the shaft instead of the terminals and every equation stands, with the
signs of power flow reversed. The induced EMF for a coil rotating in a field is

**$\\varepsilon = N\\cdot B\\cdot A\\cdot \\omega \\cdot \\cos (\\omega t)$**, peak NBAω

so output voltage is proportional to speed — which is why a generator needs
speed regulation to hold voltage, and why the same machine used as a motor has
a back-EMF proportional to speed. Both statements are ε = kω with different
things held fixed.`,
      examTip: 'Get the two endpoints first on any DC machine problem: stall current V/Ra with torque kV/Ra, and no-load speed V/k. Everything between them is linear interpolation, and maximum power always sits at exactly half the no-load speed with value V²/(4Ra).',
      importantNote: 'The machine constant k is the same number in τ = k·Ia (N·m/A) and E = kω (V·s/rad) when SI units are used. If a problem gives you one and asks for the other, no conversion is needed — but if it gives k in RPM-based units, convert to rad/s first.',
    },
    {
      id: 'em-sensor-front-ends',
      title: '4. Sensor Front Ends: Bridge Output, RTD Linearity, and Meter Loading',
      content: `## 4.1 The quarter bridge, exactly and approximately

A resistive sensor changes by a fraction of a percent, and a bridge converts
that fractional change into a voltage you can amplify. With one active gauge in
a bridge of otherwise equal resistors, the exact output is

**$V_{out} = V_{s}\\cdot \\Delta R/[2(2R + \\Delta R)]$**

which for small ΔR simplifies to the form the handbook gives:

**$V_{out} \\approx (V_{s}/4)(\\Delta R/R)$**

**Worked problem.** A 350 Ω foil gauge with gauge factor 2.0 is bonded to a part
strained to 500 microstrain. Excitation is 10 V.

**Step 1 — fractional resistance change.**
ΔR/R = GF·ε = 2.0 × 500×10⁻⁶ = **0.001**, so ΔR = **0.35 Ω**.

**Step 2 — approximate output.**
V_out ≈ (10/4)(0.001) = **2.5000 mV**.

**Step 3 — exact output.**
V_out = 10 × 0.35/[2(700 + 0.35)] = **2.4988 mV**.

The approximation is high by **0.05%**, which is far below the noise floor of
any practical strain measurement, so use it. But know where it fails: at 2%
strain the same approximation errs by **2.0%**, because the neglected ΔR in the
denominator is no longer negligible. Small-signal approximations are valid
because the signal is small, not because they are exact.

Two practical notes the exam sometimes reaches for. A **half bridge** with
gauges on opposite faces of a beam doubles the output and cancels the apparent
strain from thermal expansion, because both gauges see the same temperature and
opposite mechanical strain. A **full bridge** with four gauges quadruples it.
That is the entire reason multi-gauge bridges exist.

## 4.2 The RTD: a resistance that is a linear thermometer

A platinum resistance thermometer follows, to first order,

**$R(T) = R_{0}[1 + \\alpha T]$**

with R₀ = 100 Ω at 0 °C and α ≈ 0.00385 /°C for the standard industrial curve
("Pt100").

| Temperature | R(T) = 100(1 + 0.00385 T) |
|---|---|
| −40 °C | 84.60 Ω |
| 0 °C | 100.00 Ω |
| 100 °C | 138.50 Ω |
| 150 °C | 157.75 Ω |

The sensitivity is 100 × 0.00385 = **0.385 Ω per °C** — large enough to measure
easily and small enough that lead resistance matters. Two ohms of copper lead
resistance is a **5.2 °C** error, which is why RTDs are wired in three- or
four-wire configurations that let the instrument subtract the leads.

**Self-heating** is the other RTD trap. The excitation current dissipates power
in the sensor and warms it: 1 mA through 157.75 Ω is only **0.158 mW**, small
enough to ignore in air-moving applications and not always small enough in
still air, where a typical dissipation constant of a few milliwatts per kelvin
would turn it into a few hundredths of a degree.

Contrast the three temperature sensors the exam names:

| Sensor | Output | Linearity | Needs |
|---|---|---|---|
| RTD (Pt100) | resistance, 0.385 Ω/°C | very good | excitation current, lead compensation |
| Thermistor | resistance, exponential in 1/T | poor, but very sensitive | linearisation |
| Thermocouple | voltage, tens of µV/°C | moderate | cold-junction compensation |

The thermocouple line is the one candidates forget: a thermocouple measures the
**difference** between its measuring and reference junctions, so its reading is
meaningless without knowing the reference-junction temperature. That is what
cold-junction compensation supplies.

## 4.3 Meter loading: the instrument changes what it measures

Every real instrument perturbs the circuit it is attached to, and the exam
tests whether you can quantify the perturbation.

**A voltmeter is a resistance in parallel with what it measures.**

**Worked problem.** Two 100 kΩ resistors divide 10 V, so the true reading is
5.000 V. Measure the lower resistor with a voltmeter of input resistance Rm.

| Meter Rm | R2 in parallel with Rm | Reading | Error |
|---|---|---|---|
| 10 kΩ | 9.09 kΩ | 0.833 V | **−83.3%** |
| 1 MΩ | 90.91 kΩ | 4.762 V | **−4.76%** |
| 10 MΩ | 99.01 kΩ | 4.975 V | **−0.50%** |

![Voltmeter reading error against meter input resistance for a 100 k/100 k divider driven from 10 V, computed from the exact parallel-combination divider expression and swept over four decades. The marked points are a 1 megohm meter at minus 4.76 percent and a 10 megohm meter at minus 0.50 percent; the dashed line is the 1 percent error level.](/courses/fe-ee/figures/sci-meter-loading.svg)

The figure gives the rule of thumb in a form you can defend: to keep loading
error under about 1%, the meter must be roughly **100 times** the resistance it
sits across. This is why a 10 MΩ digital multimeter is fine on 10 kΩ circuits
and questionable on 1 MΩ circuits, and why the old 20,000 Ω/V analogue meters
were nearly useless on high-impedance nodes — on the 10 V range such a meter
presents 200 kΩ, which on this divider would read 4.00 V and look like a
circuit fault.

**An ammeter is a resistance in series with the loop.** A 0.1 Ω shunt inserted
into a 5 Ω loop driven by 10 V changes the current from 2.000 A to
10/5.1 = 1.9608 A, an error of **−1.96%**. Reducing the shunt to 0.01 Ω cuts
the error to −0.20%. The dual rule: an ammeter's burden resistance should be
small compared with the loop resistance, ideally by a factor of a hundred or
more.

Both cases are the same idea stated twice. **A measurement is only as good as
the instrument's failure to participate in the circuit.** When a question gives
you a meter's input resistance, it is not decoration — it is asking for the
loading error.`,
      examTip: 'When a problem hands you a voltmeter input resistance, compute the parallel combination with the resistance being measured and use the divider formula on that. The answer is always lower than the unloaded voltage, so an answer choice above the ideal value can be eliminated on sight.',
      importantNote: 'Bridge output formulas assume the small-signal case ΔR ≪ R. For strain gauges (ΔR/R around 10⁻³) the approximation errs by hundredths of a percent; for a thermistor whose resistance halves, it is useless and you must use the exact divider expression.',
    },
  ],
  keyTakeaways: [
    'Motor torque: τ = NBIA·sinθ; maximum when loop perpendicular to field.',
    'Back-EMF: E_back = kω; motor equation: V = IR + E_back.',
    'Generator EMF: ε = NBAω·cos(ωt); higher speed = higher voltage.',
    'Strain gauge: ΔR/R = GF·ε (GF ≈ 2); thermistor: exponential R(T).',
    'Wheatstone bridge: balance condition R₁/R₂ = R₃/R₄; detects small ΔR.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 6 — CIRCUIT ANALYSIS  (7 curriculum IDs)  ·  10 %  ← HIGHEST WEIGHT
 * ══════════════════════════════════════════════════════════════════ */

};
