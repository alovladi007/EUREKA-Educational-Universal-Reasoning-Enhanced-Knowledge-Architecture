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

**Step 2 — input power.** 11,185.5/0.90 = **12,428.3333 W**.

**Step 3 — annual energy.** 12,428.3333 W × 4,000 h = 49,713,333 Wh =
**49,713.33 kWh**.

**Step 4 — annual cost.** 49,713.33 × 0.12 = **5,965.60 per year**.

Now the question a plant engineer actually asks: is a premium-efficiency
replacement worth it? At 94% the input becomes 11,899.4681 W, the annual energy
47,597.87 kWh, and the annual cost **5,711.74** — a saving of **253.8553 a
year**. Over a twelve-year life at 8%, the present worth of that saving is
253.8553 × (P/A, 8%, 12) = 253.8553 × 7.536078 = **1,913.07**. That is the number
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
    {
      id: 'we-line-integral',
      title: '5. Work as a Line Integral and the Work-Energy Theorem',
      content: `## 5.1 The definition everything else descends from

Section 1 wrote work as a force multiplied by a distance. That is a special
case, and carrying it around as though it were the definition is exactly what
makes the harder questions on this exam look unfamiliar. The definition is a
line integral: work accumulates along whatever path the body actually travels,
counting only the component of force that points along that path.

$$W = \\int_{C} \\vec{F} \\cdot d\\vec{r}$$

With a scalar path coordinate s and an angle between the force and the
direction of travel, the same statement reads

$$W = \\int_{s_{1}}^{s_{2}} F\\cos\\theta \\, ds$$

Three consequences drop straight out of that form, and each is worth a question
on its own.

**A force at right angles to the motion does no work at all.** The cosine
vanishes, so the normal force under a sliding block, the string tension in a
conical pendulum, and the magnetic part of the Lorentz force contribute exactly
nothing to the energy budget however large they grow.

**A constant force collapses the integral into a dot product.** If the force
does not vary over the path,

$$W = \\vec{F} \\cdot \\vec{d} = F d \\cos\\theta$$

which is the schoolbook expression, now visible as one case rather than the
rule.

**A force that varies with position needs the area under its own curve.** A
spring obeying $F = kx$ is the standard instance, and eyeballing an average
never substitutes for the integral.

Units settle the argument. One newton-metre is
$1\\ \\mathrm{kg} \\, \\mathrm{m}^{2} / \\mathrm{s}^{2}$, and so is one joule,
and so is the combination hiding inside $\\tfrac{1}{2}mv^{2}$ and inside $mgh$.
Any candidate expression for an energy that fails to reduce to kilogram metre
squared per second squared contains a mistake, and confirming that costs five
seconds.

![Force along the path plotted against displacement for F(x) = 60 + 25x newtons over four metres. The shaded region under the sloping line is the line integral, 60(4) + 25(16)/2 = 440 joules; the dashed rectangle is what the constant-force shortcut would give using the starting value of 60 newtons, only 240 joules. The force has reached 160 newtons by x = 4 m.](/courses/fe-ee/figures/sci2-work-line-integral.svg)

The picture is worth holding on to because the gap between the two areas is not
a rounding difference. The rectangle underestimates by 200 joules on a 440
joule job, so a candidate who reaches for force times distance out of habit
answers a question that was never asked. Whenever a stated force carries an
x in it, the integral is compulsory.

### Worked example 5A: dragging a crate, one force at a time

**Given.** An 80 kg crate is hauled 12 m across a level floor by a 240 N rope
pulling 30 degrees above the horizontal. The coefficient of kinetic friction is
0.25 and the crate starts at rest. Take g as 9.81 m/s squared.

**Step 1 — the rope.** Only the horizontal component travels with the crate:

$$W_{\\mathrm{rope}} = 240 \\times 12 \\times 0.8660254 = 2494.15 \\ \\mathrm{J}$$

**Step 2 — the normal force, which does no work but sets the friction.** The
rope carries part of the weight, so the floor pushes up with less than mg:

$$N = 80 \\times 9.81 - 240 \\times 0.5 = 664.8 \\ \\mathrm{N}$$

Missing that lift is the single commonest error in this family. Using mg alone
would give 784.8 N and a friction force 18 per cent too large.

**Step 3 — friction, which always opposes the motion.**

$$f = 0.25 \\times 664.8 = 166.2 \\ \\mathrm{N}$$

$$W_{f} = -166.2 \\times 12 = -1994.4 \\ \\mathrm{J}$$

**Step 4 — the net work, and the speed it buys.** Gravity and the normal force
are both perpendicular to the 12 m of travel, so they drop out:

$$W_{\\mathrm{net}} = 2494.15 - 1994.4 = 499.75 \\ \\mathrm{J}$$

$$v = \\sqrt{\\tfrac{2 W_{\\mathrm{net}}}{m}} = \\sqrt{\\tfrac{2 \\times 499.7532}{80}} = 3.535 \\ \\mathrm{m/s}$$

**Step 5 — the independent check.** Nothing above used Newton's second law, so
run the problem again through kinematics. The net horizontal force is
$240 \\times 0.8660254 - 166.2 = 41.6461$ N, the acceleration is
$41.6461 / 80 = 0.520576$ m/s squared, and constant-acceleration motion over
12 m ends at $\\sqrt{2 \\times 0.520576 \\times 12} = 3.535$ m/s. Two routes,
one answer, and the agreement rules out both an arithmetic slip and a dropped
force.

## 5.2 The work-energy theorem is a derivation, not a postulate

Students often memorise $W_{\\mathrm{net}} = \\Delta KE$ as a separate law. It
is not; it is what the definition of work becomes once Newton's second law is
substituted in. Start from the integral, replace force with mass times
acceleration, and change the variable of integration from position to velocity
using $dx = v \\, dt$:

$$W_{\\mathrm{net}} = \\int F \\, dx = \\int m \\frac{dv}{dt} \\, dx = \\int m v \\, dv$$

$$W_{\\mathrm{net}} = \\tfrac{1}{2} m v_{2}^{2} - \\tfrac{1}{2} m v_{1}^{2} = \\Delta KE$$

Two things about that derivation matter in an exam. First, the theorem holds
for every force at once, friction included, so it never needs a separate
correction term. Second, only the endpoint speeds appear: the detail of how the
force varied along the way vanished into the integral. When a question gives
you a start speed, an end speed and asks for a force or a distance, the theorem
short-circuits the kinematics entirely.

| Energy store | Expression | What sets it | Typical scale |
|---|---|---|---|
| Translational kinetic | one half m v squared | mass and speed | 1,200 kg at 20 m/s: 240 kJ |
| Rotational kinetic | one half I omega squared | inertia and spin | 7.99 kg m squared at 3,600 rev/min: 567.80 kJ |
| Gravitational | m g h | mass and height | 1,500 kg lifted 22.5 m: 331.09 kJ |
| Elastic | one half k x squared | stiffness and stretch | 3,500 N/m at 80 mm: 11.2 J |
| Electric field | one half C V squared | capacitance and volts | 220 microfarads at 400 V: 17.6 J |
| Magnetic field | one half L I squared | inductance and amps | 2.2 mH at 4 A: 17.6 mJ |

The last two rows are there deliberately. The bar for a candidate is not
knowing six formulas but recognising that they are the same statement six
times: a store that grows as the square of whatever quantity drives it, and
that therefore falls to a quarter when that quantity is halved.

### Worked example 5B: a spring launcher, checked three ways

**Given.** A spring of stiffness 3,500 N/m is compressed 80 mm and released
against a 0.45 kg slider on a frictionless track.

**Step 1 — the stored energy, as an integral.** The force grows linearly with
compression, so the area under $F = kx$ from zero to x is a triangle:

$$U = \\int_{0}^{x} k s \\, ds = \\tfrac{1}{2} k x^{2} = 0.5 \\times 3500 \\times 0.0064 = 11.2 \\ \\mathrm{J}$$

**Step 2 — launch speed on a level track.** All of it becomes kinetic energy:

$$v = \\sqrt{\\tfrac{2U}{m}}, \\qquad 2 \\times 11.2 / 0.45 = 49.7778$$

so $v = 7.055$ m/s.

**Step 3 — launch height if the track turns vertical.** Now all of it becomes
gravitational instead. With $0.45 \\times 9.81 = 4.4145$ newtons of weight,

$$h = \\frac{U}{mg}, \\qquad 11.2 / 4.4145 = 2.5371 \\ \\mathrm{m}$$

**Step 4 — the check that the two agree.** Kinematics says a body launched at
v rises $v^{2}/2g$, and $49.7778 / 19.62 = 2.5371$ metres. The spring energy,
the launch speed and the rise height are three faces of one number, and if any
pair disagrees the arithmetic is wrong somewhere.

## 5.3 Conservative forces, potential energy, and where conservation stops

A force is conservative when the work it does depends only on where the body
started and finished, never on the route. Gravity and an ideal spring qualify;
friction and air drag do not. The formal test is that the work around any
closed loop vanishes:

$$\\oint_{C} \\vec{F} \\cdot d\\vec{r} = 0$$

For any force passing that test a potential energy can be defined, with the
work done equal to the drop in potential:

$$W_{\\mathrm{cons}} = -\\Delta U, \\qquad U_{\\mathrm{grav}} = mgh, \\qquad U_{\\mathrm{spring}} = \\tfrac{1}{2}kx^{2}$$

Mechanical energy is then conserved whenever the only forces acting are
conservative:

$$\\tfrac{1}{2}mv_{1}^{2} + U_{1} = \\tfrac{1}{2}mv_{2}^{2} + U_{2}$$

Real machinery always has friction, so the honest general statement carries a
term for the non-conservative work, which is negative and irreversible:

$$\\left( \\tfrac{1}{2}mv_{2}^{2} + U_{2} \\right) - \\left( \\tfrac{1}{2}mv_{1}^{2} + U_{1} \\right) = W_{\\mathrm{nc}}$$

Energy itself is never lost. What the friction term destroys is not energy but
availability: the kinetic energy of a coherent moving block becomes the random
kinetic energy of molecules, which is heat, and no arrangement of machinery
returns all of it. That distinction is the bridge between this chapter and the
thermal material in section 3, and it is why an examiner can write "energy is
conserved" and "half the energy was lost" on the same page without
contradicting themselves.

### Worked example 5C: the incline where conservation visibly fails

**Given.** A 25 kg crate is released from rest and slides 6.0 m down the face
of a 20 degree incline. The coefficient of kinetic friction is 0.30.

**Step 1 — the height given up.**

$$h = 6 \\times 0.34202014 = 2.05212 \\ \\mathrm{m}$$

**Step 2 — the potential energy released.**

$$\\Delta U = 25 \\times 9.81 \\times 2.0521209 = 503.283 \\ \\mathrm{J}$$

**Step 3 — the normal force on the slope, and the friction it produces.** On an
incline the surface carries only the component of weight perpendicular to it:

$$N = 245.25 \\times 0.93969262 = 230.4596 \\ \\mathrm{N}$$

$$W_{f} = -0.3 \\times 230.4596 \\times 6 = -414.827 \\ \\mathrm{J}$$

**Step 4 — what is left as kinetic energy.**

$$KE = 503.283 - 414.827 = 88.456 \\ \\mathrm{J}$$

$$v = \\sqrt{2 \\times 88.4554 / 25} = 2.660 \\ \\mathrm{m/s}$$

**Step 5 — the independent route.** Along the slope the acceleration is
$g(\\sin\\theta - \\mu\\cos\\theta)$, which evaluates to 0.589702 m/s squared,
and $\\sqrt{2 \\times 0.589702 \\times 6} = 2.660$ m/s. The agreement confirms
both the friction model and the geometry.

**What the numbers say.** Of the 503.28 J released, 414.83 J went into heating
the slope and the crate, and only 88.46 J into motion. Eighty-two per cent of
the drop was dissipated. Had the question said "frictionless" the answer would
have been $\\sqrt{2 \\times 9.81 \\times 2.0521209} = 6.345$ m/s, more than
twice as fast, which is why a distractor built from ignoring friction is always
on the answer sheet and always looks reasonable.`,
      examTip: 'When a problem names a force that varies with position, work is the AREA under the force-displacement curve, never the force at one end times the distance. If the answer choices contain both, the product of an endpoint force and the distance is the distractor.',
      importantNote: 'On an inclined or angled pull, the normal force is not mg. A rope angled upward reduces it; an incline scales it by the cosine of the slope angle. Compute N from a force balance perpendicular to the motion before multiplying by the coefficient of friction.',
    },
    {
      id: 'we-power-rotation',
      title: '6. Power, Rotation, and the Electrical-Mechanical Bridge',
      content: `## 6.1 Power is a derivative, and averages are not instants

Power is the rate at which work is done, and because work is an integral of
force along a path, power turns out to be a plain product of force and
velocity:

$$P = \\frac{dW}{dt} = \\vec{F} \\cdot \\vec{v}$$

Reading that backwards recovers the energy: work is the area under the power
curve, which is the single most useful picture in this chapter.

$$W = \\int_{t_{1}}^{t_{2}} P \\, dt$$

Average power is that area divided by the elapsed time, and it is emphatically
not the same quantity as the instantaneous power:

$$P_{\\mathrm{avg}} = \\frac{1}{t_{2} - t_{1}} \\int_{t_{1}}^{t_{2}} P \\, dt = \\frac{W}{\\Delta t}$$

The distinction has money attached to it. A utility bill is proportional to the
area, so it follows the average. A conductor, a breaker and a motor winding all
respond to the instantaneous value, so they must be sized on the peak. A duty
cycle that averages 9.5 kW but peaks at 11.2 kW needs a machine rated for the
larger number and a supply contract written around the smaller one.

### Worked example 6A: sizing a hoist from its duty cycle

**Given.** A hoist lifts 1,500 kg. It accelerates from rest to 0.75 m/s in
5.0 s, holds that speed for 25.0 s, and brakes to rest in a further 5.0 s. The
gearbox and motor together are 82 per cent efficient.

**Step 1 — the geometry of the ramp.** The acceleration is
$0.75 / 5 = 0.15$ m/s squared and the distance is the area under the speed
profile, which is a trapezoid:

$$h = 0.5 \\times 0.75 \\times 5 + 0.75 \\times 25 + 0.5 \\times 0.75 \\times 5 = 22.5 \\ \\mathrm{m}$$

**Step 2 — the cable tension in each phase.** The rope must support the weight
and supply the acceleration, so $F = m(g + a)$:

$$F_{\\mathrm{up}} = 1500 \\times 9.96 = 14940 \\ \\mathrm{N}, \\qquad F_{\\mathrm{cruise}} = 1500 \\times 9.81 = 14715 \\ \\mathrm{N}$$

$$F_{\\mathrm{brake}} = 1500 \\times 9.66 = 14490 \\ \\mathrm{N}$$

**Step 3 — the peak power, which sizes the machine.** The largest force and the
largest speed coincide at the very end of the acceleration ramp:

$$P_{\\mathrm{peak}} = 14940 \\times 0.75 = 11205 \\ \\mathrm{W}$$

while the cruise phase settles back to
$14715 \\times 0.75 = 11036.25$ W.

**Step 4 — the total work, twice over.** The closed form only needs the height,
because the load starts and finishes at rest and the kinetic energy round trip
cancels exactly:

$$W = mgh = 1500 \\times 9.81 \\times 22.5 = 331087.5 \\ \\mathrm{J}$$

Integrating the instantaneous power over the whole 35 s duty cycle gives the
same 331,087.5 J, and the figure below is that integration drawn.

**Step 5 — average power, and the electricity it costs.**

$$P_{\\mathrm{avg}} = 331087.5 / 35 = 9459.64 \\ \\mathrm{W}$$

$$W_{\\mathrm{elec}} = 331087.5 / 0.82 = 403765.24 \\ \\mathrm{J} = 0.11216 \\ \\mathrm{kWh}$$

so 72,677.74 J of the input never reached the load.

![Two stacked panels for a 1,500 kg hoist duty cycle. The upper panel is cable power against time, computed as the product of m(g plus a) and the trapezoidal speed profile: a ramp to an 11,205 W peak at 5 s, a flat 11,036.25 W cruise, and a lower ramp down during braking because the tension falls to 14,490 N. The lower panel is the running integral of that power, which lands exactly on mgh = 331.0875 kJ.](/courses/fe-ee/figures/sci2-hoist-power-energy.svg)

Read the two panels together. The step in the upper trace at 5 s is real, not a
drawing artefact: an idealised trapezoidal speed profile changes acceleration
instantaneously, so the tension jumps by 450 N and the power with it. The lower
panel never steps, because integration smooths. That relationship, a jump in
the derivative appearing as a kink in the integral, is worth internalising
here, because the same pairing shows up in the capacitor and inductor
transients of the circuits chapters.

**Step 6 — the drum, as a cross-check.** If the rope runs over a drum of radius
0.35 m, the drum turns at $0.75 / 0.35 = 2.142857$ rad/s, which is 20.4628
revolutions per minute, and carries a torque of
$14715 \\times 0.35 = 5150.25$ N-m while cruising. The product is
$5150.25 \\times 2.142857 = 11036.25$ W, the same cruise power arrived at from
torque and angular speed rather than from force and linear speed.

## 6.2 Rotation: the same mechanics with different letters

Every translational quantity has a rotational partner, and once the
correspondence is set the formulas need no separate memorising.

| Straight line | Rotation | Link |
|---|---|---|
| force F (N) | torque tau (N-m) | tau equals F times the radius |
| mass m (kg) | moment of inertia I (kg m squared) | I depends on shape as well as mass |
| velocity v (m/s) | angular velocity omega (rad/s) | v equals omega times the radius |
| momentum m v | angular momentum I omega | both conserved without external effort |
| kinetic energy one half m v squared | one half I omega squared | identical structure |
| power F v | tau omega | identical structure |

The two relations that carry the most exam traffic are

$$\\tau = I \\alpha, \\qquad P = \\tau \\omega$$

and the conversion that quietly destroys more answers than any formula:

$$\\omega = \\frac{2\\pi N}{60}$$

with N in revolutions per minute. Nameplates and problem statements speak in
revolutions per minute; every mechanical equation demands radians per second.
A number entered without that conversion is wrong by a factor of 9.5493, which
is large enough to be obvious and small enough to be mistaken for a units slip
somewhere else.

Moment of inertia depends on where the mass sits, not merely how much there is.
For rotation about the axis named:

| Body | Axis | Moment of inertia |
|---|---|---|
| Solid cylinder or disc | its own centreline | one half M R squared |
| Thin ring or hollow cylinder | its own centreline | M R squared |
| Solid sphere | a diameter | two fifths M R squared |
| Slender rod, length L | perpendicular, through the centre | M L squared over 12 |
| Slender rod, length L | perpendicular, through one end | M L squared over 3 |

Moving the axis from the centre of mass to a parallel line a distance d away
adds a term that costs nothing to remember and rescues a great many problems:

$$I = I_{\\mathrm{cm}} + M d^{2}$$

### Worked example 6B: what a flywheel can actually give back

**Given.** A solid steel disc 0.60 m in diameter and 0.080 m thick, with steel
taken at 7,850 kg per cubic metre, spins down from 3,600 to 2,400 revolutions
per minute to ride through a supply dip.

**Step 1 — mass from geometry.**

$$V = \\pi R^{2} t = 3.14159265 \\times 0.09 \\times 0.08 = 0.02261947 \\ \\mathrm{m^{3}}$$

$$m = 7850 \\times 0.02261947 = 177.563 \\ \\mathrm{kg}$$

**Step 2 — moment of inertia of a disc.**

$$I = \\tfrac{1}{2} m R^{2} = 0.5 \\times 177.5628 \\times 0.09 = 7.99033 \\ \\mathrm{kg \\, m^{2}}$$

**Step 3 — the two speeds, in radians per second.**

$$\\omega_{1} = \\frac{2\\pi \\times 3600}{60} = 376.9911, \\qquad \\omega_{2} = \\frac{2\\pi \\times 2400}{60} = 251.3274$$

**Step 4 — the stored energies.** At the top speed the disc holds 567,801.82 J
and at the bottom speed 252,356.37 J, so the usable band is

$$\\Delta E = \\tfrac{1}{2} I (\\omega_{1}^{2} - \\omega_{2}^{2}) = 315445.46 \\ \\mathrm{J}$$

**Step 5 — the shortcut that makes the answer obvious.** Because energy climbs
as the square of speed, the fraction recovered between two speeds depends only
on their ratio. Here $2400 / 3600 = 0.666667$, so

$$\\frac{\\Delta E}{E_{1}} = 1 - \\left( \\tfrac{2}{3} \\right)^{2} = \\tfrac{5}{9} = 0.555556$$

and five ninths of 567,801.82 is the same 315,445.46 J. A flywheel allowed to
drop only ten per cent in speed gives up
$1 - 0.9^{2} = 0.19$, barely a fifth of what it holds, which is why
flywheel systems are designed around wide speed swings and why their power
electronics has to tolerate them.

**Step 6 — the power that band can support.** Discharged over 3.0 s it supports
$315445.46 / 3 = 105148.49$ W, a little over 105 kW. Compared against the
hoist of the previous example, this one disc stores 95.28 per cent of a
complete lift cycle, so a flywheel of this size can carry that machine through
one interruption and no more.

![Stored kinetic energy against shaft speed for a 177.56 kg steel disc of 0.30 m radius, computed as one half I omega squared with omega converted from revolutions per minute. The curve is a parabola through the origin; the shaded band between 2,400 and 3,600 rev/min marks the 315.45 kJ actually available, which is five ninths of the 567.80 kJ held at the top speed.](/courses/fe-ee/figures/sci2-flywheel-usable-energy.svg)

The parabola is the whole lesson. Half the top speed leaves a quarter of the
energy, so the bottom half of the speed range holds only a quarter of what the
machine ever stored. Every question about spin-down, regenerative braking or
kinetic storage is a question about the shape of that curve.

## 6.3 The bridge: watts are watts

The reason a mechanical chapter sits inside an electrical examination is that
the joule does not care which side of the machine it is on. A watt-second is a
joule; a newton-metre is a joule; a volt-coulomb is a joule. The bridge across
a motor or a generator is written on one line:

$$P_{\\mathrm{elec}} = VI \\quad \\longleftrightarrow \\quad P_{\\mathrm{mech}} = \\tau \\omega$$

with the efficiency accounting for what leaks out between them:

$$\\eta_{\\mathrm{motor}} = \\frac{\\tau \\omega}{VI}, \\qquad \\eta_{\\mathrm{generator}} = \\frac{VI}{\\tau \\omega}$$

| Quantity | Electrical form | Mechanical form | Common unit |
|---|---|---|---|
| Effort | volts V | force N or torque N-m | — |
| Flow | amperes A | m/s or rad/s | — |
| Power | V times A | N times m/s, or N-m times rad/s | watt |
| Energy | watt-second | newton-metre | joule |
| Bulk energy | kilowatt-hour, 3.6 MJ | 1 hp-hour, 2.6845 MJ | joule |
| Resistance to change | inductance L | inertia m or I | — |

The last row is not decoration. An inductor opposes a change in current exactly
as a mass opposes a change in velocity, both store energy as one half of a
coefficient times the square of their flow variable, and both make the same
kind of transient when a source is suddenly applied. Section 7 puts that
analogy to work.

### Worked example 6C: pump shaft power from head and flow

**Given.** A pump lifts 0.025 cubic metres of water per second against a total
head of 32 m. Water is 998 kg per cubic metre; the pump is 72 per cent
efficient and its motor is 91 per cent efficient.

**Step 1 — hydraulic power, which is just mgh per second.** Replacing mass by
density times volumetric flow,

$$P_{\\mathrm{hyd}} = \\rho g Q H = 998 \\times 9.81 \\times 0.025 \\times 32 = 7832.3 \\ \\mathrm{W}$$

**Step 2 — up through the pump.**

$$P_{\\mathrm{shaft}} = 7832.304 / 0.72 = 10878.2 \\ \\mathrm{W}$$

**Step 3 — up through the motor.**

$$P_{\\mathrm{elec}} = 10878.2 / 0.91 = 11954.07 \\ \\mathrm{W}$$

**Step 4 — the check by multiplying the efficiencies first.**
$0.72 \\times 0.91 = 0.6552$, and $7832.304 / 0.6552 = 11954.07$ W. Same
answer, fewer keystrokes, and a reminder that stage efficiencies multiply.

**Step 5 — the number an operator actually wants.** Energy per unit of water
delivered is the electrical power divided by the flow, which is
$11954.0659 / 0.025 = 478162.6$ joules per cubic metre, or 0.13282 kWh per
cubic metre. Over an eight-hour
shift the pump uses 95.63 kWh and moves 720 cubic metres, and dividing those
returns the same 0.13282 kWh per cubic metre. Specific energy of that kind is
how pumping, compressed air and refrigeration plant are actually benchmarked,
because it is independent of how long the machine happened to run.`,
      examTip: 'Every rotational formula needs angular velocity in radians per second. Convert revolutions per minute by dividing by 9.5493, or equivalently multiplying by 2 pi and dividing by 60. An answer choice exactly 9.5493 times another is the trap built from skipping that step.',
      importantNote: 'Peak power and average power size different things. The motor, cable and breaker follow the peak; the energy bill follows the average. A duty-cycle question that gives a speed profile is nearly always asking you to distinguish the two.',
    },
    {
      id: 'we-machine-cases',
      title: '7. Machines End to End: Acceleration, Recovery, and Chains',
      content: `## 7.1 Accelerating an inertial load costs twice what it stores

Bring a motor up to speed against pure inertia and something surprising falls
out of the algebra. Take a separately excited direct-current machine with a
fixed armature voltage V, armature resistance R, and torque constant K, driving
an inertia J with no load torque. Two equations describe it: the electrical
loop and the mechanical one.

$$V = iR + K\\omega, \\qquad K i = J \\frac{d\\omega}{dt}$$

Eliminating the current gives a first-order rise with a purely mechanical time
constant:

$$\\omega(t) = \\omega_{\\infty} \\left( 1 - e^{-t/T} \\right), \\qquad \\omega_{\\infty} = \\frac{V}{K}, \\qquad T = \\frac{JR}{K^{2}}$$

$$i(t) = \\frac{V}{R} e^{-t/T}$$

Now integrate the armature loss over the whole run-up. The current is a decaying
exponential, so its square decays at twice the rate:

$$\\int_{0}^{\\infty} i^{2} R \\, dt = \\frac{V^{2}}{R} \\int_{0}^{\\infty} e^{-2t/T} dt = \\frac{V^{2}}{R} \\cdot \\frac{T}{2} = \\tfrac{1}{2} J \\omega_{\\infty}^{2}$$

The heat dumped in the armature equals the kinetic energy delivered to the
load, exactly, whatever the resistance is. Halving R halves the time constant
and doubles the current, and the two effects cancel. Bringing a flywheel up to
speed on a fixed voltage is therefore a fifty per cent efficient operation
before any other loss is counted, and the only escapes are a controlled ramp of
the supply voltage or a drive that limits current deliberately.

### Worked example 7A: the run-up energy bill

**Given.** V is 240 V, armature resistance 0.45 ohm, torque constant
1.8 N-m per ampere, load inertia 0.85 kg m squared, no friction.

**Step 1 — the endpoints.**

$$\\omega_{\\infty} = 240 / 1.8 = 133.333 \\ \\mathrm{rad/s}$$

which is 1,273.24 revolutions per minute.

**Step 2 — the time constant.**

$$T = \\frac{0.85 \\times 0.45}{3.24} = 0.118056 \\ \\mathrm{s}$$

**Step 3 — the inrush, which is the design problem.** At standstill there is no
back electromotive force, so the armature sees the full supply:

$$i(0) = 240 / 0.45 = 533.333 \\ \\mathrm{A}$$

producing a stall torque of $1.8 \\times 533.333 = 960$ N-m and an initial
angular acceleration of $960 / 0.85 = 1129.41$ rad/s squared. No practical
machine tolerates 533 A, which is why direct-on-line starting of a large
direct-current motor needs series resistance or a controlled drive.

**Step 4 — the energy ledger.**

$$KE = 0.5 \\times 0.85 \\times 17777.78 = 7555.56 \\ \\mathrm{J}$$

$$W_{R} = \\frac{240^{2}}{0.45} \\cdot \\frac{0.118056}{2} = 7555.56 \\ \\mathrm{J}$$

$$W_{\\mathrm{supply}} = 7555.5556 + 7555.5556 = 15111.1112 \\ \\mathrm{J}$$

**Step 5 — how long it takes.** Reaching 95 per cent of final speed takes
$T \\ln 20 = 0.353663$ s, and half speed takes $T \\ln 2 = 0.081830$ s.

![Two stacked panels for a 240 V direct-current motor accelerating a 0.85 kg m squared inertia. The upper panel is shaft speed against time, an exponential rise with time constant J R over K squared equal to 0.1181 s approaching 133.33 rad/s. The lower panel is cumulative energy: the running integral of V i from the supply reaching 15,111.1 J, against one half J omega squared and the running integral of i squared R, which both settle at 7,555.6 J. The two lower curves cross, because the resistance takes its share early while the load is still slow.](/courses/fe-ee/figures/sci2-motor-load-accel.svg)

The crossing in the lower panel is the physical story. Early in the run-up the
shaft is barely turning, so almost none of the supplied power is doing
mechanical work and nearly all of it is heating the winding; late in the run-up
the back electromotive force has risen, the current has collapsed, and almost
everything left goes into the load. The two curves have to meet at the same
value in the end, and that is what makes the fifty per cent result inescapable
rather than coincidental.

### Worked example 7B: how much braking energy comes back

**Given.** A 1,600 kg vehicle slows from 25 m/s to 8 m/s. The drive returns
68 per cent of the mechanical energy to a 350 V battery, and the deceleration
takes 4.0 s.

**Step 1 — the kinetic energy given up.**

$$\\Delta KE = 0.5 \\times 1600 \\times (625 - 64) = 448800 \\ \\mathrm{J}$$

**Step 2 — what reaches the battery.**

$$W_{\\mathrm{rec}} = 0.68 \\times 448800 = 305184 \\ \\mathrm{J}$$

which is $305184 / 3600 = 84.7733$ watt-hours.

**Step 3 — the same energy expressed as charge, which is what the battery
actually counts.**

$$Q = \\frac{W}{V} = 305184 / 350 = 871.954 \\ \\mathrm{C}$$

$$Q = 871.9543 / 3600 = 0.2422095 \\ \\mathrm{A \\, h}$$

**Step 4 — the rates involved.** The wheels shed
$448800 / 4 = 112200$ W and the battery absorbs
$305184 / 4 = 76296$ W, at a mean charging current of
$871.9543 / 4 = 217.99$ A. Those figures, not the energy, decide whether the
recovery is possible: a pack that cannot swallow 218 A simply wastes the rest
in the friction brakes regardless of how efficient the drive is.

## 7.2 Efficiency is a curve, not a number

Section 4 listed the loss mechanisms and noted that some scale with load and
some do not. Putting the two together gives efficiency as a function of load
rather than a single nameplate figure. Write the fixed loss as the core loss
and the load-dependent one as copper loss growing with the square of current;
at per-unit load x on a machine rated S with unity power factor,

$$\\eta(x) = \\frac{x S}{x S + P_{0} + x^{2} P_{c}}$$

Differentiating and setting the result to zero gives a result worth carrying
into the exam room: efficiency peaks where the variable loss has grown to equal
the fixed one.

$$x^{2} P_{c} = P_{0} \\quad \\Longrightarrow \\quad x^{*} = \\sqrt{\\frac{P_{0}}{P_{c}}}$$

![Efficiency against per-unit load for a 25 kVA transformer with 95 W of core loss and 320 W of copper loss at full load, computed from the loss model in the text. The curve climbs steeply out of light load, peaks at 98.624 per cent when the load reaches 54.49 per cent of rating, and falls slowly to 98.367 per cent at full load. A dashed line marks the peak.](/courses/fe-ee/figures/sci2-efficiency-vs-load.svg)

For the machine drawn, $x^{*} = \\sqrt{95/320} = 0.544862$, so peak efficiency
arrives at 54.49 per cent of rating and reaches 98.6243 per cent, against
98.3671 per cent at full load. That is why distribution transformers, which
spend their lives well below nameplate, are designed with their loss balance
deliberately offset. It also explains the collapse at the left of the plot: at
5 per cent load the same 95 W of core loss now sits against only 1,250 W of
output, and efficiency drops to 92.88 per cent. An idling machine is an
expensive machine.

### Worked example 7C: a conveyor from the battery to the load

**Given.** A battery-powered belt raises 4,000 kg of material per hour through
5.0 m. The chain from the battery outward runs at 97 per cent for battery
discharge, 96 per cent for the inverter, 86 per cent for the motor and 94 per
cent for the gearbox and belt. The battery is 48 V.

**Step 1 — the useful power, which is a mass flow rate times gh.**

$$P_{\\mathrm{use}} = \\dot{m} g h = 1.1111111 \\times 9.81 \\times 5 = 54.5 \\ \\mathrm{W}$$

**Step 2 — the chain efficiency, multiplied and never averaged.**

$$\\eta = 0.94 \\times 0.86 \\times 0.96 \\times 0.97 = 0.752782$$

**Step 3 — what the battery must deliver.**

$$P_{\\mathrm{batt}} = 54.5 / 0.752782 = 72.398 \\ \\mathrm{W}$$

**Step 4 — an eight-hour shift, in three currencies.** The energy is
$72.3981 \\times 8 = 579.185$ watt-hours. At 48 V that is
$579.1849 / 48 = 12.06635$ ampere-hours, which is
$12.066352 \\times 3600 = 43438.87$ coulombs. The belt has moved 32,000 kg and
the genuinely useful lifting energy was only 0.4360 kWh.

**Step 5 — where the argument connects.** Three different units named the same
physical quantity in step 4: watt-hours, ampere-hours and coulombs. The first
is an energy, the last two are charges, and they are interchangeable only
because a nominal voltage was supplied. The next chapter takes that
distinction apart properly, because on this exam confusing an ampere-hour with
an energy is a reliable way to lose a mark.

## 7.3 A checklist for any energy-conversion question

| Ask | Because |
|---|---|
| Are the endpoints at rest? | If so the kinetic terms cancel and only the height matters |
| Is the force constant along the path? | If not, the work is an integral, not a product |
| Is the speed in rad/s? | Every rotational formula demands it |
| Which loss scales with load? | Copper does, core does not, and that sets the efficiency curve |
| Does the ledger close? | Input minus output must equal the losses you named, to the joule |
| Peak or average? | Machines follow the peak, bills follow the average |

The last row deserves the final word. Nearly every energy question on this exam
is answerable by writing down what came in, what came out, and insisting the
difference be accounted for. A balance that does not close does not mean the
physics is subtle; it means a term is missing, and it is usually the one that
was perpendicular to the motion or the one that was quoted in the wrong units.`,
      examTip: 'Charging any energy store through a resistance from a fixed source wastes exactly as much as it stores, whether the store is a capacitor or a spinning inertia. If a question asks for the supply energy during a run-up or a charge-up, the answer is twice the stored energy.',
      importantNote: 'Maximum efficiency occurs where the load-dependent loss equals the fixed loss, at per-unit load equal to the square root of the ratio of the two. It is not at full load, and assuming it is will pick the wrong answer on transformer and motor efficiency questions.',
    },
    {
      id: 'we-problem-sets',
      title: '8. Problem Sets',
      content: `## Problem Set A: work, energy, and the theorem

Work each one before reading the answer. Take g as 9.81 m/s squared throughout
and keep four significant figures in intermediate steps.

**A1.** A 45 kg crate is pushed 8.0 m by a horizontal 180 N force against a
constant 130 N of friction. Find the net work and the final speed from rest.

*Answer.* The net force is 50 N, so $W = 50 \\times 8 = 400$ J and
$v = \\sqrt{2 \\times 400 / 45} = 4.216$ m/s. Note the two named forces are
already along the motion, so no cosine appears.

**A2.** A force $F(x) = 60 + 25x$ newtons acts from x equal to 0 to x equal to
4.0 m. Find the work.

*Answer.* $W = 60 \\times 4 + 25 \\times 16 / 2 = 440$ J. The rectangle built
from the starting force alone gives 240 J and is the distractor.

**A3.** A 1,200 kg car slows from 30 m/s to 18 m/s. How much work did the
brakes do?

*Answer.* $W = 0.5 \\times 1200 \\times (324 - 900) = -345600$ J. The sign is
part of the answer: the brakes removed 345.6 kJ.

**A4.** A 0.25 kg ball is thrown vertically upward at 14 m/s. Ignoring drag,
how high does it rise?

*Answer.* $h = 196 / 19.62 = 9.990$ m. The mass never enters, which is the
point of the question.

**A5.** A spring of stiffness 800 N/m is stretched from 0.05 m to 0.12 m. How
much work does that take?

*Answer.* $W = 0.5 \\times 800 \\times (0.0144 - 0.0025) = 4.76$ J. Using the
difference of the squares, not the square of the difference, is what is being
tested.

## Problem Set B: power, torque, and rotation

**B1.** A motor delivers 22 N-m at 1,750 revolutions per minute. Find the shaft
power.

*Answer.* $\\omega = 2\\pi \\times 1750 / 60 = 183.2596$ rad/s and
$P = 22 \\times 183.2596 = 4031.7$ W, about 5.41 horsepower.

**B2.** A solid steel cylinder of mass 60 kg and radius 0.25 m spins at 900
revolutions per minute. Find its rotational kinetic energy.

*Answer.* $I = 0.5 \\times 60 \\times 0.0625 = 1.875$ kg m squared,
$\\omega = 94.24778$ rad/s, and the energy is 8,327.5 J.

**B3.** A 5.0 kW drive accelerates a load of 2.4 kg m squared from rest to
250 rad/s at constant power. Neglecting losses, how long does it take?

*Answer.* $KE = 0.5 \\times 2.4 \\times 62500 = 75000$ J and
$t = 75000 / 5000 = 15.00$ s. Constant power, not constant torque, is what
makes this a one-line problem.

**B4.** A hoist raises 900 kg at 0.45 m/s. Find the useful power and the input
power at 78 per cent efficiency.

*Answer.* $P = 900 \\times 9.81 \\times 0.45 = 3973.05$ W useful and
$3973.05 / 0.78 = 5093.65$ W in.

**B5.** How many joules are in 2.5 kWh, and how long will that run a 400 W
load?

*Answer.* $2.5 \\times 3600000 = 9000000$ J, and 2,500 Wh divided by 400 W is
6.250 hours. Working it in watt-hours avoids the conversion entirely.

## Practice Problems C: machines end to end

**C1.** A three-stage chain of efficiencies 0.95, 0.89 and 0.83 drives a 3.0 kW
output. Find the input power and the total loss.

*Answer.* $\\eta = 0.95 \\times 0.89 \\times 0.83 = 0.701765$, so
$P_{\\mathrm{in}} = 3000 / 0.701765 = 4274.935$ W and the loss is 1,274.935 W.
The arithmetic mean of the three efficiencies is 0.89, which would give
3,371 W, and that is the trap.

**C2.** A flywheel of moment of inertia 12 kg m squared slows from 2,000 to
1,200 revolutions per minute. How much energy does it release?

*Answer.* The speeds are 209.4395 and 125.6637 rad/s, giving 168,441 J. The
short route notices that $1200/2000 = 0.6$, so the fraction released is
$1 - 0.36 = 0.64$ of the energy held at 2,000 revolutions per minute.

**C3.** A pump moves 0.040 cubic metres per second against 18 m of head. Water
is 998 kg per cubic metre and the overall efficiency is 0.63. Find the
electrical input power.

*Answer.* $P_{\\mathrm{hyd}} = 998 \\times 9.81 \\times 0.040 \\times 18 = 7049.07$ W
and $7049.0736 / 0.63 = 11189.0$ W.

**C4.** A direct-current motor with armature resistance 0.8 ohm and torque
constant 1.2 N-m per ampere runs from 120 V and accelerates a 0.30 kg m squared
inertia. Find the mechanical time constant, the final speed, the stored kinetic
energy and the armature heating during the run-up.

*Answer.* $T = 0.30 \\times 0.8 / 1.44 = 0.166667$ s,
$\\omega_{\\infty} = 120 / 1.2 = 100.0$ rad/s,
$KE = 0.5 \\times 0.30 \\times 10000 = 1500$ J, and the armature dissipates the
same 1,500 J, because the fifty per cent split does not depend on any of the
numbers.

**C5.** A 15 kW motor at 91 per cent efficiency runs 6 hours a day for 300 days
a year at 0.11 per kilowatt-hour. What does the electricity cost?

*Answer.* The input is $15000 / 0.91 = 16483.5$ W, the annual energy is
29,670.33 kWh, and the bill is 3,263.74 a year. Note that the nameplate is the
OUTPUT, so the input is larger, not smaller.

## How to use these

Three habits separate candidates who finish this section quickly from those who
do not. Convert revolutions per minute before writing anything else down.
Decide whether a force is constant before choosing between a product and an
integral. And close the energy ledger at the end of every problem, because a
balance that fails has told you where the error is without your having to hunt
for it.`,
      examTip: 'Answer sheets for this section are built from three predictable errors: revolutions per minute left unconverted, efficiencies averaged instead of multiplied, and nameplate power treated as an input rather than an output. Checking those three before selecting eliminates most distractors.',
    },
  ],
  keyTakeaways: [
    'P = V·I = I²R = V²/R; three equivalent forms for resistive power.',
    'Capacitor energy: W = ½CV²; inductor energy: W = ½LI².',
    'Efficiency η = P_out/P_in; always < 100% due to losses.',
    'Mechanical power P = τ·ω; convert RPM to rad/s: ω = 2π·RPM/60.',
    'Energy balance: input = useful output + losses.',
    'Work is a line integral W = ∫F·dr; force times distance only when F is constant.',
    'The work-energy theorem W_net = ΔKE follows from Newton II and includes friction.',
    'Rotational energy ½Iω²; a flywheel between two speeds releases 1 − (N₂/N₁)² of it.',
    'Accelerating an inertia from a fixed voltage burns exactly as much as it stores.',
    'Peak efficiency sits where copper loss equals core loss, at load √(P₀/Pc).',
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
    {
      id: 'cc-quantisation',
      title: '5. Quantised Charge, the Coulomb, and Current as a Derivative',
      content: `## 5.1 Charge comes in lumps, and the coulomb is an enormous number of them

Electric charge is quantised. Every free charge that has ever been measured is
an integer multiple of one elementary charge, so the total charge on a body is

$$Q = N e, \\qquad e = 1.602176634 \\times 10^{-19} \\ \\mathrm{C}$$

That value is exact rather than measured: since the 2019 revision of the SI the
ampere is defined by fixing it, so the elementary charge is now a defined
constant in the same way the speed of light is. Rounding it to
$1.602 \\times 10^{-19}$ C, as most reference tables and this chapter's earlier
sections do, costs about one part in nine thousand and is never the reason an
exam answer is wrong.

Inverting the relation says how many electrons a coulomb represents:

$$N = \\frac{1}{1.602176634 \\times 10^{-19}} = 6.241509 \\times 10^{18}$$

Six billion billion electrons per coulomb is worth pausing over, because it is
what makes charge behave like a smooth fluid in every circuit calculation you
will ever do. Quantisation matters in a single-electron transistor and in shot
noise; it is completely invisible in a lamp circuit, and that is why the whole
of circuit theory can treat current as a continuous variable without apology.

| Situation | Charge moved | Electrons |
|---|---|---|
| One elementary charge | 1.602177 times ten to the minus nineteen C | 1 |
| A 220 microfarad capacitor at 400 V | 88.0 mC | 5.4925 times ten to the seventeen |
| A 15 A breaker in one minute | 900 C | 5.6174 times ten to the twenty-one |
| A 100 A-h battery, fully discharged | 360,000 C | 2.2469 times ten to the twenty-four |
| A 3,000 mA-h cell, fully discharged | 10,800 C | 6.7408 times ten to the twenty-two |

## 5.2 Current is the derivative of charge, and charge is the integral of current

The definition already appeared in section 1. Its integral form is what
questions are actually built on, because real currents are rarely constant:

$$i(t) = \\frac{dq}{dt}, \\qquad q(t) = q(t_{0}) + \\int_{t_{0}}^{t} i(\\lambda) \\, d\\lambda$$

One ampere is one coulomb per second. When the current is constant the integral
degenerates to a product, $Q = It$, and when it is not, the charge is the area
under the current waveform, exactly as work was the area under a power curve in
the previous chapter.

**State the sign convention out loud, because it is not a physical fact.** Draw
a reference arrow on a branch. A positive current then means positive charge
moving in the direction of that arrow, and a negative current means positive
charge moving the other way, or equivalently negative charge moving along the
arrow. In a metal the actual carriers are electrons drifting opposite to the
conventional current, and this changes no result whatever, provided a single
convention is chosen and held. Alongside it sits the **passive sign
convention**: for any element that absorbs power, the reference current is
drawn entering the terminal marked positive. With those two choices in place,

$$p(t) = v(t) \\, i(t)$$

comes out positive for a resistor absorbing energy and negative for a source
delivering it, and the powers around any circuit sum to zero. A sign error here
does not produce a slightly wrong answer; it produces one that claims a resistor
generates energy.

### Worked example 5A: a current pulse, and the charge it moves

**Given.** A welding controller passes a current that rises linearly from zero
to 4.0 A over 2.0 ms and then falls linearly back to zero over the following
3.0 ms.

**Step 1 — charge as area.** The waveform is a triangle of height 4.0 A and
base 5.0 ms:

$$Q = 0.5 \\times 4 \\times 0.005 = 0.010 \\ \\mathrm{C} = 10.0 \\ \\mathrm{mC}$$

**Step 2 — the same result by piecewise integration.** The rising ramp
contributes $0.5 \\times 4 \\times 0.002 = 0.004$ C and the falling
ramp $0.5 \\times 4 \\times 0.003 = 0.006$ C, and
$0.004 + 0.006 = 0.010$ C. Two routes, one answer.

**Step 3 — the electron count.**

$$N = \\frac{0.010}{1.602176634 \\times 10^{-19}} = 6.2415 \\times 10^{16}$$

**Step 4 — the average, which is what a slow meter would show.**

$$I_{\\mathrm{avg}} = 0.010 / 0.005 = 2.0 \\ \\mathrm{A}$$

The peak is twice the average, which is a general property of a triangular
pulse and a useful sanity check.

![Two stacked panels. The upper is the triangular current pulse, rising to 4.0 A at 2 ms and returning to zero at 5 ms, with the area under it shaded and a dashed line at the 2.0 A mean. The lower is the running integral of that current, a smooth S-shaped curve reaching 4 mC at the current peak and levelling at the full 10 mC once the pulse ends.](/courses/fe-ee/figures/sci2-charge-integral.svg)

Two features of the lower trace repay attention. It is steepest exactly where
the current is largest, because current is its slope. And it flattens rather
than falling once the pulse ends, because charge that has been moved stays
moved: the integral of a signal that returns to zero does not itself return to
zero unless the signal went negative somewhere.

### Worked example 5B: a sinusoid moves charge and yet moves none

**Given.** A line current $i(t) = 8.0 \\sin(2 \\pi 60 t)$ amperes.

**Step 1 — the angular frequency.**

$$\\omega = 2 \\pi \\times 60 = 376.9911 \\ \\mathrm{rad/s}$$

**Step 2 — charge over one half cycle,** which lasts $1/120$ second:

$$Q = \\int_{0}^{1/120} 8 \\sin(\\omega t) \\, dt = \\frac{8}{\\omega} \\left[ 1 - \\cos \\pi \\right] = \\frac{16}{376.9911}$$

which evaluates to 0.0424413 C, or 42.44 mC.

**Step 3 — charge over a full cycle.** The second half cycle is the mirror of
the first with the opposite sign, so the two cancel and the net charge through
the conductor over any whole number of cycles is exactly zero.

**Step 4 — why that is not a paradox.** Energy is delivered on both half cycles
because the voltage reverses along with the current, so their product stays
positive in a resistive load. The root-mean-square value
$8 / \\sqrt{2} = 5.657$ A is the quantity that determines heating, and it is
emphatically not the average of the current, which is zero. This is the cleanest
demonstration on the exam that charge transport and energy transport are
different bookkeeping.

## 5.3 Kirchhoff's current law is charge conservation, nothing more

A circuit node is a point with no capacity to store charge. Whatever arrives
must leave, at every instant, so

$$\\sum_{k=1}^{n} i_{k}(t) = 0$$

with currents entering counted positive and leaving counted negative, or the
other way round provided the choice is uniform. The statement in integral form
is the one that shows its origin plainly:

$$\\frac{dq_{\\mathrm{node}}}{dt} = 0$$

This is not an approximation and it is not restricted to direct current. It
holds instant by instant for any waveform whatever, and it is the reason the
law survives into alternating-current analysis unchanged where the voltage law
needs care about induced loops.

### Worked example 5C: closing a node

**Given.** Four conductors meet at a terminal block. Measured currents are
3.2 A and 1.7 A flowing in, and 4.1 A flowing out on the third. Find the
fourth.

**Step 1 — write the sum with a consistent sign.** Taking inflow as positive
and calling the unknown outflow $i_{4}$,

$$3.2 + 1.7 - 4.1 - i_{4} = 0$$

$$i_{4} = 3.2 + 1.7 - 4.1 = 0.8 \\ \\mathrm{A}$$

**Step 2 — check the sign.** The result is positive, so 0.8 A really does leave
on the fourth conductor. A negative answer would not have been an error; it
would have meant the current flows the other way and the reference arrow was
drawn backwards, which is a legitimate and common outcome.

**Step 3 — the charge view.** Over one minute the node passes
$4.9 \\times 60 = 294$ coulombs in and the same 294 out. Nothing accumulates,
which is precisely the content of the law.

## 5.4 Current density and drift, for two very different conductors

Section 4 computed the drift velocity in 12 AWG building wire and found a third
of a millimetre per second. That figure is easy to dismiss as a curiosity, so
it is worth doing a second conductor with a very different geometry to see what
the model actually depends on.

$$J = \\frac{I}{A}, \\qquad v_{d} = \\frac{J}{n q}$$

The denominator $nq$ is a property of the material alone. For copper with
$n = 8.5 \\times 10^{28}$ free electrons per cubic metre it is about
$1.3619 \\times 10^{10}$ coulombs per cubic metre, and every copper conductor
in existence shares that number.

### Worked example 5D: a printed-circuit trace

**Given.** A trace in one-ounce copper, taken as 35 micrometres thick and
0.50 mm wide, carrying 2.0 A over a 50 mm run.

**Step 1 — cross-section.**

$$A = 35 \\times 10^{-6} \\times 0.5 \\times 10^{-3} = 1.75 \\times 10^{-8} \\ \\mathrm{m^{2}}$$

which is 0.0175 square millimetres, $3.309 \\times 10^{-6} / 1.75 \\times 10^{-8} = 189.09$ times smaller than the
12 AWG building wire of section 4.

**Step 2 — current density.**

$$J = \\frac{2.0}{1.75 \\times 10^{-8}} = 1.142857 \\times 10^{8} \\ \\mathrm{A/m^{2}}$$

or 114.29 amperes per square millimetre, against about 4.5 for the building
wire.

**Step 3 — drift velocity.**

$$v_{d} = \\frac{1.142857 \\times 10^{8}}{1.361850 \\times 10^{10}} = 8.392 \\ \\mathrm{mm/s}$$

Twenty-five times faster than in the building wire, in the same metal, purely
because the same order of current is squeezed through a far smaller area. And
still slower than a snail.

**Step 4 — what the density costs in heat.** Resistance per unit length is
resistivity over area, and with copper at
$1.724 \\times 10^{-8}$ ohm-metre,

$$\\frac{R}{L} = \\frac{1.724 \\times 10^{-8}}{1.75 \\times 10^{-8}} = 0.985143 \\ \\mathrm{\\Omega / m}$$

so the 50 mm run has $0.985143 \\times 0.05 = 0.049257$ ohm, drops
$2 \\times 0.049257 = 0.098514$ V and dissipates
$4 \\times 0.049257 = 0.19703$ W. A fifth of a watt in a trace 50 mm long is
a real thermal design problem, and it is the direct consequence of the current
density computed in step 2.

![Drift velocity against current density on logarithmic axes for copper with 8.5 times ten to the twenty-eight carriers per cubic metre and for an n-type silicon doped to ten to the twenty-two per cubic metre, both from v equals J over n q. Three copper operating points are marked: a busbar at 2.0 A per square millimetre giving 0.147 mm/s, 12 AWG at 15 A giving 0.333 mm/s, and the printed trace at 114 A per square millimetre giving 8.39 mm/s. The silicon line stops at a dashed ceiling near ten to the fifth metres per second, where carrier velocity saturates and the linear model fails.](/courses/fe-ee/figures/sci2-drift-velocity.svg)

The figure carries the point that no single calculation can. Both lines obey
the same law and both are straight with the same slope; they are separated by
seven decades purely because copper offers roughly ten million times more
carriers per cubic metre than lightly doped silicon does. In a semiconductor,
carriers are scarce and therefore fast; in a metal they are abundant and
therefore slow. That is why semiconductors respond to fields in picoseconds
while the electrons in the wire feeding them barely move at all, and it is the
physical root of the drift and diffusion equations in the materials chapters.

The dashed ceiling matters too. Above roughly ten to the fifth metres per
second in silicon, carriers stop accelerating with field, and the neat
proportionality between current density and drift velocity stops describing
anything. Every model on this exam has a range of validity, and a model applied
outside it produces confident nonsense.`,
      examTip: 'Charge is the AREA under the current waveform, so a triangular or trapezoidal pulse needs the geometry of a triangle, not the peak value times the duration. The peak-times-duration answer is exactly twice the truth for a triangle and is always on the answer sheet.',
      importantNote: 'The net charge carried by an alternating current over a whole number of cycles is zero, but the energy delivered is not, because the voltage reverses with the current. Never use an average current to size heating; use the root-mean-square value.',
    },
    {
      id: 'cc-capacitor-rc',
      title: '6. Capacitor Charge, Stored Energy, and the RC Transient',
      content: `## 6.1 A capacitor is a device that stores charge in proportion to voltage

The defining relation is a proportionality, and the constant is the
capacitance:

$$q = C v$$

Differentiate it and the terminal behaviour appears:

$$i = C \\frac{dv}{dt}$$

Two consequences follow that every transient problem depends on. Because a
finite current cannot produce an infinite rate of change, **the voltage across a
capacitor cannot change instantaneously**, which supplies the initial condition
for every switching problem. And because the current is proportional to the rate
of change rather than to the voltage itself, a capacitor passes fast edges and
blocks steady direct current, which is the entire basis of coupling and bypass.

## 6.2 Where the one half comes from

The stored energy formula is derived, not decreed. Push the capacitor from
empty to a final voltage V and integrate the instantaneous power, substituting
the terminal relation as you go:

$$W = \\int_{0}^{T} v i \\, dt = \\int_{0}^{T} v \\, C \\frac{dv}{dt} \\, dt = \\int_{0}^{V} C v \\, dv$$

$$W = \\tfrac{1}{2} C V^{2}$$

The factor of one half is not a fudge: it appears because the early charge
arrives while the voltage is still low and therefore costs little, while the
last charge arrives at the full voltage. Using $q = Cv$ the same energy can be
written two other ways, and all three are worth recognising on sight:

$$W = \\tfrac{1}{2} C V^{2} = \\tfrac{1}{2} Q V = \\frac{Q^{2}}{2C}$$

![Two stacked panels for a 220 microfarad capacitor. The upper panel plots stored charge against voltage, a straight line through the origin reaching 88 mC at 400 V, with 44 mC marked at half that voltage. The lower panel plots stored energy, a parabola reaching 17.6 J at 400 V but only 4.4 J at 200 V, so halving the voltage keeps half the charge and a quarter of the energy.](/courses/fe-ee/figures/sci2-capacitor-energy.svg)

The contrast between the two panels is the point. Charge is linear in voltage
and energy is quadratic, and the area under the upper line is the lower curve.
That is the same relationship the derivation above expresses, drawn rather than
integrated, and it is why a capacitor bank discharged only halfway has given up
three quarters of what it held.

### Worked example 6A: a 220 microfarad capacitor at 400 V

**Given.** A 220 microfarad film capacitor in a direct-current link, charged to
400 V.

**Step 1 — the stored charge.**

$$Q = C V = 220 \\times 10^{-6} \\times 400 = 0.088 \\ \\mathrm{C} = 88.0 \\ \\mathrm{mC}$$

**Step 2 — the stored energy, three ways.**

$$W = 0.5 \\times 0.00022 \\times 160000 = 17.6 \\ \\mathrm{J}$$

$$W = 0.5 \\times 0.088 \\times 400 = 17.6 \\ \\mathrm{J}$$

and $Q^{2}/2C$ gives 17.6 J as well. Three independent routes to the same
number is what a candidate should want before moving on.

**Step 3 — how many electrons that displaced.**

$$N = \\frac{0.088}{1.602176634 \\times 10^{-19}} = 5.4925 \\times 10^{17}$$

**Step 4 — the safety number.** Dumped into a short circuit that empties it in
250 microseconds, the mean power is

$$P = 17.6 / 0.00025 = 70400 \\ \\mathrm{W}$$

at a mean current of $0.088 / 0.00025 = 352$ A. Seventy kilowatts from a
component the size of a coffee cup is why bleed resistors, discharge interlocks
and the wait-before-you-touch rule exist on every drive and every power supply.

## 6.3 The RC transient, integrated rather than quoted

Connect a source through a resistance to an initially empty capacitor. Kirchhoff
around the loop and the terminal relation give a first-order equation whose
solution is the pair of waveforms every candidate has seen:

$$v(t) = V_{s} \\left( 1 - e^{-t/\\tau} \\right), \\qquad i(t) = \\frac{V_{s}}{R} e^{-t/\\tau}, \\qquad \\tau = RC$$

$$q(t) = C V_{s} \\left( 1 - e^{-t/\\tau} \\right)$$

What is usually skipped is the integration, and it is the integration that
carries the insight. Total charge delivered is the area under the current:

$$\\int_{0}^{\\infty} \\frac{V_{s}}{R} e^{-t/\\tau} dt = \\frac{V_{s}}{R} \\tau = C V_{s}$$

which is what $q = Cv$ demanded, so the waveform and the definition agree.
Energy taken from the source is that charge times the constant source voltage:

$$W_{\\mathrm{src}} = Q V_{s} = C V_{s}^{2}$$

Energy left in the capacitor is one half of that. Energy burnt in the resistor
is the remainder, and it can be integrated directly to prove it:

$$\\int_{0}^{\\infty} i^{2} R \\, dt = \\frac{V_{s}^{2}}{R} \\int_{0}^{\\infty} e^{-2t/\\tau} dt = \\frac{V_{s}^{2}}{R} \\cdot \\frac{\\tau}{2} = \\tfrac{1}{2} C V_{s}^{2}$$

**The resistance cancels.** Charging a capacitor from a fixed voltage through
any resistance whatever is exactly fifty per cent efficient. Making the
resistor smaller makes the transient faster and the current larger in precisely
compensating measure. The only ways out are to ramp the source voltage or to
charge through an inductor, which is why every efficient supply does one or the
other. Readers who met the motor run-up in the previous chapter will recognise
the identical result with different letters: inertia for capacitance, armature
resistance for series resistance, and the same inescapable half.

### Worked example 6B: 24 V through 10 kilohms into 47 microfarads

**Step 1 — the time constant.**

$$\\tau = 10000 \\times 0.000047 = 0.47 \\ \\mathrm{s}$$

**Step 2 — the endpoints.** The initial current is
$24 / 10000 = 0.0024$ A, that is 2.4 mA, and the final charge is
$0.000047 \\times 24 = 0.001128$ C, that is 1.128 mC.

**Step 3 — one time constant in.** The exponential factor is 0.3678794, so

$$v(\\tau) = 24 \\times 0.6321206 = 15.171 \\ \\mathrm{V}$$

$$i(\\tau) = 2.4 \\times 0.3678794 = 0.88291 \\ \\mathrm{mA}$$

and the charge is $1.128 \\times 0.6321206 = 0.713032$ mC. The same 63.21 and
36.79 per cent appear in all three, because all three share one exponential.

**Step 4 — practical completion.** After five time constants,
$5 \\times 0.47 = 2.35$ s, the capacitor is 99.3262 per cent charged, which is
the usual engineering definition of done.

**Step 5 — the energy ledger.**

$$W_{\\mathrm{src}} = 0.000047 \\times 576 = 0.027072 \\ \\mathrm{J}$$

$$W_{C} = 0.5 \\times 0.000047 \\times 576 = 0.013536 \\ \\mathrm{J}$$

and the resistor takes the remaining 13.536 mJ, which
$(V^{2}/R)(\\tau/2)$ confirms independently. Note that 10 kilohms never
appeared in the final split.

![Three stacked panels for a 24 V source charging 47 microfarads through 10 kilohms. The first is capacitor voltage rising towards 24 V, marked at 15.171 V after one time constant of 0.47 s. The second is the charging current decaying from 2.4 mA, marked at 0.8829 mA after one time constant, with a note that its area is 1.128 mC. The third is cumulative energy: 27.072 mJ leaving the source, splitting into 13.536 mJ stored in the capacitor and 13.536 mJ burnt in the resistor.](/courses/fe-ee/figures/sci2-rc-charge-waveforms.svg)

The bottom panel is the one to remember. The two lower traces begin very
differently, because early on the capacitor is nearly empty and almost all the
supplied power is being dissipated, but they end together. No choice of R moves
that endpoint.

### Worked example 6C: sizing a ride-through capacitor bank

**Given.** A 24 V direct-current bus feeds a load drawing a steady 8.0 A. The
bus must survive a 20 ms interruption without falling below 18 V.

**Step 1 — treat the load as a constant current, which it is over 20 ms.** Then
$i = C \\, dv/dt$ rearranges into a sizing formula:

$$C = \\frac{I \\Delta t}{\\Delta V} = \\frac{8.0 \\times 0.020}{6.0} = 0.026667 \\ \\mathrm{F}$$

that is 26,667 microfarads.

**Step 2 — the charge check.** The load removes
$Q = 8.0 \\times 0.020 = 0.16$ C, and the bank supplies
$C \\Delta V = 0.026667 \\times 6 = 0.16$ C. The two agree, as they must.

**Step 3 — the energy check, by a completely different route.**

$$W = \\tfrac{1}{2} C (24^{2} - 18^{2}) = 0.5 \\times 0.0266667 \\times 252 = 3.36 \\ \\mathrm{J}$$

and the load, drawing 8 A while the bus falls linearly from 24 V to 18 V, takes
a mean voltage of 21 V, so it consumes
$21 \\times 8 \\times 0.020 = 3.36$ J. Three independent closures on one
answer.

**Step 4 — the design lesson.** The bank actually holds
$0.5 \\times 0.0266667 \\times 576 = 7.68$ J at 24 V, and only
$3.36 / 7.68 = 0.4375$ of that is usable before the rail falls out of
tolerance. Capacitive storage is always specified by the voltage window you can
tolerate, never by the total energy on the datasheet.`,
      examTip: 'Charging a capacitor through a resistor from a fixed source wastes exactly as much energy as it stores, no matter what the resistance is. If a question asks how much energy the supply delivered, the answer is C V squared, and the stored half is only half of that.',
      importantNote: 'Capacitor energy goes as the SQUARE of voltage while charge goes linearly with it. A bank discharged from full to half voltage has given up three quarters of its energy but only half its charge, and questions are written to catch candidates who assume both halve together.',
    },
    {
      id: 'cc-batteries-faraday',
      title: `7. Amp-Hours, Faraday's Law, and Charge in Power Terms`,
      content: `## 7.1 An ampere-hour is a charge wearing a disguise

The unit that causes the most confusion in this chapter is not the coulomb but
the ampere-hour. It is a charge, full stop, and the conversion is one
multiplication:

$$Q_{\\mathrm{C}} = 3600 \\, Q_{\\mathrm{Ah}}$$

Energy needs a voltage as well, and that is where the trouble starts:

$$W = Q V = 3600 \\, Q_{\\mathrm{Ah}} \\, V_{\\mathrm{nom}}$$

Two cells with identical ampere-hour ratings hold different energies unless
they share a nominal voltage, so ampere-hours can never be compared across
chemistries. Watt-hours can, which is why every honest specification sheet
quotes them.

![Stored energy against rated capacity, on logarithmic axes, for three nominal voltages: a 3.7 V lithium cell, a 12 V lead-acid battery and a 48 V pack, each a straight line of energy equal to capacity times voltage. Three points are marked: a 3 A-h cell holding 11.1 W-h, a 100 A-h 12 V battery holding 1,200 W-h, and a 60 A-h 48 V pack holding 2,880 W-h.](/courses/fe-ee/figures/sci2-ah-energy-map.svg)

The three parallel lines are the whole argument. Reading horizontally across
them at any fixed capacity shows three different energies, and the ratio
between the top and bottom lines is just the ratio of the nominal voltages. A
question that offers capacities in ampere-hours and asks which battery stores
more energy is testing exactly this and nothing else.

### Worked example 7A: three batteries, in every unit that matters

**Given.** A 100 A-h lead-acid battery at 12 V nominal, weighing 25 kg, and a
3,000 mA-h lithium cell at 3.7 V nominal, weighing 45 g.

**Step 1 — the lead-acid battery, as charge.**

$$Q = 100 \\times 3600 = 360000 \\ \\mathrm{C}$$

**Step 2 — as energy.**

$$W = 360000 \\times 12 = 4320000 \\ \\mathrm{J} = 4.32 \\ \\mathrm{MJ}$$

which is $4320000 / 3600000 = 1.2$ kWh.

**Step 3 — the electron count, for scale.**

$$N = \\frac{360000}{1.602176634 \\times 10^{-19}} = 2.2469 \\times 10^{24}$$

which is $360000 / 96485 = 3.7311$ moles of electrons, a hint of where section
7.2 is going.

**Step 4 — the lithium cell.** Three ampere-hours is
$3 \\times 3600 = 10800$ C, and at 3.7 V that is
$10800 \\times 3.7 = 39960$ J, or 11.1 W-h.

**Step 5 — the comparison worth making.** Specific energy is
$1200 / 25 = 48$ W-h per kilogram for the lead-acid battery and
$11.1 / 0.045 = 246.67$ W-h per kilogram for the cell, a factor of
$246.66667 / 48 = 5.139$. That ratio, not the ampere-hour rating, is what
decides whether a design flies, drives or sits on a shelf.

## 7.2 Faraday's law of electrolysis: charge counted in atoms

Charge does not only carry energy; in an electrochemical cell it carries matter.
Each ion deposited at an electrode requires a fixed number of electrons, so the
mass deposited is strictly proportional to the charge passed. The constant is
the charge on one mole of electrons:

$$F = N_{A} e = 96485 \\ \\mathrm{C/mol}$$

and the law is

$$m = \\frac{Q M}{n F}$$

with M the molar mass in grams per mole and n the number of electrons per ion.
The grouping $M/(nF)$ is called the **electrochemical equivalent** and is a
property of the reaction alone, so it is worth tabulating:

| Deposit | Reaction | M (g/mol) | n | g per coulomb | g per A-h |
|---|---|---|---|---|---|
| Copper | Cu two plus plus two electrons | 63.546 | 2 | 0.000329305 | 1.18550 |
| Silver | Ag plus plus one electron | 107.868 | 1 | 0.001117977 | 4.02472 |
| Nickel | Ni two plus plus two electrons | 58.693 | 2 | 0.000304156 | 1.09496 |
| Aluminium | Al three plus plus three electrons | 26.982 | 3 | 0.0000932166 | 0.335580 |

Note what the fourth column does to intuition. Silver plates nearly three and a
half times as much mass per coulomb as copper, partly because its atoms are
heavier and mostly because each one needs only a single electron. Aluminium is
the opposite on both counts, which is a large part of why smelting it is so
energy-intensive.

![Copper deposit thickness against plating time at three current densities, from d equal to M J t divided by n F rho with copper at 63.546 g per mole, two electrons per ion, Faraday constant 96,485 C per mole and density 8,960 kg per cubic metre. All three lines are straight through the origin because Faraday's law is linear in charge; the marked point is 3.0 A over 100 square centimetres for 45 minutes, giving 2.667 g and 29.77 micrometres.](/courses/fe-ee/figures/sci2-plating-thickness.svg)

Because the law is linear in charge, doubling either the current or the time
doubles the deposit, and the three lines in the figure differ only in slope.
That linearity is what makes plating controllable: an ampere-hour meter on the
tank is a direct readout of grams deposited.

### Worked example 7B: plating copper onto a panel

**Given.** A 100 square centimetre panel is plated at 3.0 A for 45 minutes in a
copper sulphate bath. Copper is 63.546 g per mole, deposits as a divalent ion,
and has a density of 8.96 g per cubic centimetre.

**Step 1 — charge passed.**

$$Q = 3.0 \\times 2700 = 8100 \\ \\mathrm{C}$$

**Step 2 — moles of electrons, then moles of copper.**

$$n_{e} = 8100 / 96485 = 0.0839509 \\ \\mathrm{mol}$$

Each copper atom takes two, so 0.0419754 mol of copper is deposited.

**Step 3 — mass.**

$$m = 0.0419754 \\times 63.546 = 2.6674 \\ \\mathrm{g}$$

**Step 4 — the independent route, through the electrochemical equivalent.**
$63.546 / 192970 = 0.000329305$ gram per coulomb, which is
$0.000329305 \\times 3600 = 1.185498$ gram per ampere-hour. Then
$3.0 \\times 0.75 \\times 1.185498 = 2.6674$ g. Same answer from a different
grouping of the same constants.

**Step 5 — thickness, which is what the customer specified.** Volume is mass
over density:

$$V = 2.6673711 / 8.96 = 0.2976977 \\ \\mathrm{cm^{3}}$$

Spread over 100 square centimetres that is 0.002976977 cm, or **29.77
micrometres**. The plating rate is
$29.7698 / 45 = 0.66155$ micrometre per minute, and the current density is
$3.0 / 100 = 0.03$ ampere per square centimetre, that is 30 mA per square
centimetre, which is an ordinary figure for a copper bath.

**Step 6 — the sanity check that catches unit errors.** A 30 micrometre layer
over 100 square centimetres is $0.003 \\times 100 = 0.3$ cubic centimetres of
metal, and at 8.96 g per cubic centimetre that is
$0.3 \\times 8.96 = 2.688$ g, against the 2.667 g the law gave for the slightly
thinner real deposit. Anything off by a factor of a thousand is a
centimetre-versus-metre slip, and anything off by a factor of two is a forgotten
n.

## 7.3 Charge, current and power, in direct and alternating current

Everything so far in this chapter can be assembled into one comparison, and the
comparison is what the exam actually asks about.

For **direct current** the three quantities are related by simple products:

$$Q = I t, \\qquad P = V I, \\qquad W = P t = Q V$$

For **alternating current** the instantaneous relations are unchanged, but the
quantities a meter or a bill reports are averages over a cycle:

$$p(t) = v(t) i(t), \\qquad P = \\frac{1}{T} \\int_{0}^{T} v i \\, dt = V_{\\mathrm{rms}} I_{\\mathrm{rms}} \\cos\\phi$$

and the net charge over a whole number of cycles is zero, as section 5.2
established.

### Worked example 7C: the same current, two very different ledgers

**Given.** Case one, a 48 V direct-current bus carrying 12 A for 30 minutes.
Case two, a supply with $v(t) = 170 \\sin \\omega t$ volts and
$i(t) = 12 \\sin(\\omega t - 30^{\\circ})$ amperes at 60 Hz.

**Case one, step 1 — power and energy.**

$$P = 48 \\times 12 = 576 \\ \\mathrm{W}$$

$$W = 576 \\times 1800 = 1036800 \\ \\mathrm{J}$$

which is $1036800 / 3600000 = 0.288$ kWh.

**Case one, step 2 — charge.**
$Q = 12 \\times 1800 = 21600$ C moved in one direction, and every coulomb of it
arrived at the load and left through the return.

**Case two, step 1 — root-mean-square values.**

$$V_{\\mathrm{rms}} = 170 / 1.41421356 = 120.208 \\ \\mathrm{V}, \\qquad I_{\\mathrm{rms}} = 12 / 1.41421356 = 8.4853 \\ \\mathrm{A}$$

**Case two, step 2 — the three powers.** Apparent power is the product of the
root-mean-square values:

$$S = 170 \\times 12 / 2 = 1020 \\ \\mathrm{VA}$$

$$P = 1020 \\times 0.8660254 = 883.35 \\ \\mathrm{W}$$

$$Q_{\\mathrm{reac}} = 1020 \\times 0.5 = 510 \\ \\mathrm{var}$$

**Case two, step 3 — charge.** Over each half cycle the conductor carries
$2 \\times 12 / 376.9911 = 0.063662$ coulomb, that is 63.66 mC, and over the
full cycle the net is zero. The charge sloshes; it does not accumulate.

**What the comparison shows.** The peak current is 12 A in both cases, yet the
direct-current case delivers 576 W and the alternating-current case delivers
883.35 W, a ratio of 1.534, because the alternating source has a much higher
peak voltage. Meanwhile the direct-current case moves 21,600 C in one direction
and the alternating case moves none at all on balance. Current magnitude alone
tells you almost nothing; you need the voltage, the phase and the averaging
convention before any of these numbers means anything.

| Quantity | Direct current | Alternating current, sinusoidal |
|---|---|---|
| Current | constant I | peak I, root-mean-square I over root two |
| Power | V times I, constant | average V times I times cosine of the phase angle |
| Net charge per second | I coulombs, one direction | zero over a whole cycle |
| Heating in a resistor | I squared R | root-mean-square current squared times R |
| Energy in time t | V I t | average power times t |`,
      examTip: 'Convert ampere-hours to coulombs by multiplying by 3,600, and to joules only after a voltage is supplied. A question that compares two batteries by ampere-hours alone without giving voltages is unanswerable, and one that gives voltages is testing whether you multiply.',
      importantNote: 'Faraday electrolysis problems need BOTH the molar mass and the ion valence. Forgetting the valence n gives an answer exactly n times too large, and for the common divalent metals copper, nickel and zinc that is a clean factor of two that looks entirely plausible.',
    },
    {
      id: 'cc-problem-sets',
      title: '8. Problem Sets',
      content: `## Problem Set A: charge, current, and nodes

Take the elementary charge as 1.602177 times ten to the minus nineteen coulomb.

**A1.** A steady 5.0 A flows for 3.0 minutes. How much charge passes, and how
many electrons?

*Answer.* $Q = 5 \\times 180 = 900$ C, and dividing by the elementary charge
gives $5.617 \\times 10^{21}$ electrons.

**A2.** The voltage across a 10 microfarad capacitor ramps linearly from 0 to
50 V in 4.0 ms. What current flows?

*Answer.* The slope is 12,500 V/s, so
$i = 0.00001 \\times 12500 = 0.125$ A. It is constant, because the ramp is
linear.

**A3.** At a node, 6.5 A and 2.2 A enter and 3.9 A leaves on one branch. What
leaves on the other?

*Answer.* $6.5 + 2.2 - 3.9 = 4.8$ A.

**A4.** A current $i(t) = 2.0t$ amperes flows from t equal to zero to t equal
to 3.0 s. How much charge moves?

*Answer.* The integral of 2t is t squared, so
$Q = 3^{2} = 9.0$ C. Using the final current times the duration gives 18 C and
is the distractor.

**A5.** A 2,500 mA-h cell has a nominal voltage of 3.6 V. Express its capacity
in coulombs and its energy in joules and watt-hours.

*Answer.* $2.5 \\times 3600 = 9000$ C, then
$9000 \\times 3.6 = 32400$ J, which is 9.0 W-h.

## Problem Set B: capacitors and the RC transient

**B1.** A 100 microfarad capacitor is charged to 63 V. Find the stored charge
and energy.

*Answer.* $Q = 0.0001 \\times 63 = 0.0063$ C, that is 6.3 mC, and
$W = 0.5 \\times 0.0001 \\times 3969 = 0.19845$ J.

**B2.** A 2.2 kilohm resistor charges a 470 nanofarad capacitor from a 5 V
source. Find the time constant and the capacitor voltage after 1.0 ms.

*Answer.* $\\tau = 2200 \\times 0.00000047 = 0.001034$ s. One millisecond is
0.967118 time constants, the exponential factor is 0.380177, and
$v = 5 \\times 0.619823 = 3.099$ V.

**B3.** A 1,000 microfarad capacitor is charged to 15 V through a resistor.
How much energy leaves the supply, how much is stored, and how much is burnt?

*Answer.* Charge is $0.001 \\times 15 = 0.015$ C, so the supply delivers
$0.015 \\times 15 = 0.225$ J, the capacitor keeps
$0.5 \\times 0.001 \\times 225 = 0.1125$ J, and the resistor burns the other
0.1125 J. The resistance value was never needed.

**B4.** A 4,700 microfarad bank holds up a 12 V rail supplying 3.0 A. How long
before the rail falls to 9 V?

*Answer.* $\\Delta t = C \\Delta V / I = 0.0047 \\times 3 / 3.0 = 0.0047$ s,
that is 4.7 ms.

**B5.** A 220 microfarad capacitor carries 1.5 A. How fast is its voltage
changing?

*Answer.* $dv/dt = 1.5 / 0.00022 = 6818.2$ V/s, so it crosses 100 V in about
15 ms.

## Practice Problems C: batteries, plating, and power

**C1.** A 60 A-h pack has a nominal voltage of 48 V. Find its energy in
kilowatt-hours and in megajoules.

*Answer.* $60 \\times 48 = 2880$ W-h, that is 2.880 kWh, and multiplying by
3,600 gives 10.368 MJ.

**C2.** Silver plates as a monovalent ion with a molar mass of 107.868 g/mol.
How much silver does 2.0 A deposit in 30 minutes?

*Answer.* $Q = 2.0 \\times 1800 = 3600$ C and
$m = 3600 \\times 107.868 / 96485 = 4.025$ g. Silver needs one electron per
atom, so no factor of two appears.

**C3.** Nickel plates as a divalent ion with a molar mass of 58.693 g/mol.
Find its electrochemical equivalent in grams per ampere-hour.

*Answer.* $58.693 / 192970 = 0.000304156$ gram per coulomb, and multiplying by
3,600 gives 1.09496 gram per ampere-hour.

**C4.** A 230 V root-mean-square supply delivers 6.0 A root-mean-square at a
power factor of 0.85 lagging. Find the apparent power, the real power, and the
energy consumed in 3 hours.

*Answer.* $S = 230 \\times 6 = 1380$ VA,
$P = 1380 \\times 0.85 = 1173$ W, and the energy is 3.519 kWh. The apparent
power is what the cable and the transformer must carry; the real power is what
the meter charges for.

**C5.** A charger supplies 5.0 A into a battery for 90 minutes at a terminal
voltage of 13.8 V. Find the charge delivered and the energy supplied.

*Answer.* $Q = 5.0 \\times 5400 = 27000$ C, and
$W = 27000 \\times 13.8 = 372600$ J, which is 0.1035 kWh. The battery will
store less than that, because charging is not lossless.

## How to use these

Every problem above is one of three moves. Either integrate a current to get a
charge, or multiply a charge by a voltage to get an energy, or divide an energy
by a time to get a power. When a question resists, write down which of the
three it is asking for and which two of the four quantities you were given;
the missing step becomes obvious, and the units confirm it before you reach for
the calculator.`,
      examTip: 'Every quantity in this chapter is one of four: charge in coulombs, current in amperes, energy in joules and power in watts. Write down which two you were given and which one is wanted, and the required operation is forced. Most wrong answers here are the right arithmetic on the wrong pair.',
    },
  ],
  keyTakeaways: [
    'Current I = dQ/dt; voltage V = dW/dQ; Ohm\'s law V = IR for resistive elements.',
    'Coulomb\'s law: F = k·Q₁·Q₂/r²; inverse-square law.',
    'Lorentz force: F = q(E + v×B); magnetic force is perpendicular to velocity.',
    'Force on conductor: F = BIL; direction by right-hand rule.',
    'Motional EMF: ε = BLv for conductor moving through field.',
    'Charge is the area under i(t): q = ∫i dt, and Q = It only for a constant current.',
    'Capacitor energy W = ½CV² = ½QV = Q²/2C; charging through any R is 50% efficient.',
    'An amp-hour is 3,600 C — a charge. It becomes energy only once a voltage is given.',
    'Faraday electrolysis: m = QM/(nF) with F = 96,485 C/mol; the valence n is the trap.',
    'AC moves zero net charge per cycle yet delivers power P = V_rms·I_rms·cos φ.',
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

Where N = turns, B = flux density, I = current, A = loop area, and θ is the
angle between the **loop normal** (its magnetic moment) and B — not the angle
between the plane of the loop and B, which is its complement.

- **Maximum torque**: τ_max = NBIA (when θ = 90°, so the field lies in the
  plane of the loop and the moment is perpendicular to it)
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
    {
      id: 'em-magnetic-circuit',
      title: '5. The Magnetic Circuit: One Idea, and Where It Stops Working',
      content: `## 5.1 Three quantities and a law that looks familiar

Nearly every device in this chapter is a coil wound on iron with, more often
than not, a deliberate slot of air cut into the iron. One piece of bookkeeping
handles all of them. A winding of $N$ turns carrying current $I$ drives a
**magnetomotive force**

$$\\mathcal{F} = N I$$

quoted in ampere-turns, which is to say in amperes: the turn count is a pure
number and brings no dimension of its own. That drive pushes a **flux** $\\Phi$,
in webers, round a closed path whose opposition to flux is its **reluctance**

$$\\mathcal{R} = \\frac{\\ell}{\\mu_{r}\\mu_{0}A}$$

with $\\ell$ the mean path length in metres, $A$ the cross-section in square
metres, and $\\mu_{0} = 4\\pi \\times 10^{-7}\\ \\mathrm{H/m}$. Push the units
through before trusting the formula: metres divided by henries-per-metre times
square-metres leaves inverse henries, and one henry is one weber per ampere, so
reluctance carries amperes per weber. The three quantities are tied by

$$\\mathcal{F} = \\Phi\\,\\mathcal{R}$$

which is the magnetic-circuit law, and its arithmetic is the arithmetic of
Ohm's law with different labels on the boxes.

| Electric circuit | Magnetic circuit | Unit of the magnetic quantity |
|---|---|---|
| EMF $V$ | MMF $\\mathcal{F} = NI$ | $\\mathrm{A}$ |
| current $I$ | flux $\\Phi$ | $\\mathrm{Wb}$ |
| resistance $R = \\ell/(\\sigma A)$ | reluctance $\\mathcal{R} = \\ell/(\\mu A)$ | $\\mathrm{A/Wb}$ |
| conductance $G$ | permeance $\\mathcal{P} = 1/\\mathcal{R}$ | $\\mathrm{H}$ |
| loop rule on voltages | Ampere's law on $H\\ell$ terms | $\\mathrm{A}$ |
| node rule on currents | flux continuity at a joint | $\\mathrm{Wb}$ |

Everything that follows from that table follows without further thought.
Reluctances in series add. Reluctances in parallel combine as product over sum.
The drive divides across series elements in **proportion** to reluctance, and
the flux divides between parallel branches in **inverse** proportion. Solving a
magnetic circuit is solving a resistive network you have already solved a
hundred times.

## 5.2 Four places where the correspondence fails

The table above is a tool, not a truth, and a candidate who forgets the
difference will be caught by one of these four.

**Reluctance is not a constant.** In a resistor, $R$ does not depend on how
much current flows. In iron, $\\mu_{r}$ collapses as the material saturates, so
$\\mathcal{R}$ depends on the very flux you are trying to find. A problem that
states a permeability has quietly told you to stay in the linear region; a
problem that gives a B-H curve has told you to iterate instead.

**Flux leaks, and current does not.** The ratio of conductivities between
copper and air is of order $10^{20}$, so current stays in the wire to a
precision no experiment will ever question. The ratio of permeabilities between
iron and air is of order $10^{3}$ to $10^{4}$. Iron therefore guides flux the
way a levee guides a river rather than the way a wire guides current, and a few
percent of the flux takes a path through the air outside the core. That
**leakage flux** links some windings and not others, and it is the entire
reason a real transformer has leakage reactance.

**Gaps fringe.** Flux crossing an air gap bows outward, so the effective area
of the gap exceeds the area of the iron face. Section 5.4 puts a number on it.

**There is no magnetic Joule heating, and the dimensions prove it.** In the
electric circuit, $I^{2}R$ is a power, and a steady current in a steady
resistance dissipates energy for as long as it flows. Form the same product
magnetically and look at what comes out:

$$\\tfrac{1}{2}\\Phi^{2}\\mathcal{R} \\longrightarrow \\mathrm{Wb}^{2}\\cdot\\frac{\\mathrm{A}}{\\mathrm{Wb}} = \\mathrm{Wb}\\cdot\\mathrm{A} = \\mathrm{V}\\cdot\\mathrm{s}\\cdot\\mathrm{A} = \\mathrm{J}$$

Joules, not watts. That expression is not a dissipation at all: it is the
**energy stored** in the magnetic circuit, and it comes straight back out when
the current is switched off. A steady flux held by a superconducting winding
would cost nothing to maintain forever. So the algebra of the analogy survives
into the magnetic domain and its energetics does not, and any argument that
reasons from "reluctance is like resistance, therefore something is being
dissipated" is wrong. The genuine losses in iron are hysteresis and eddy
currents, they are properties of a **changing** field, and section 6 treats
them on their own terms.

## 5.3 Worked example: a gapped ring, solved by two routes

A rectangular ring of silicon steel has mean magnetic path length
$\\ell_{c} = 0.60\\ \\mathrm{m}$ and a square section 20 mm on a side, so
$A = 4.0\\ \\mathrm{cm}^{2} = 4.0 \\times 10^{-4}\\ \\mathrm{m}^{2}$. Treat the
iron as linear with $\\mu_{r} = 2500$. A gap $g = 1.0\\ \\mathrm{mm}$ is cut in
it, and a winding of $N = 500$ turns carries $I = 2.0\\ \\mathrm{A}$. Neglect
fringing and leakage. Find the flux, the flux density, and how the drive
divides.

**Step 1 -- the two reluctances.**

$$\\mathcal{R}_{c} = \\frac{0.60}{(4\\pi \\times 10^{-7})(2500)(4.0 \\times 10^{-4})} = 4.7746 \\times 10^{5}\\ \\mathrm{A/Wb}$$

$$\\mathcal{R}_{g} = \\frac{1.0 \\times 10^{-3}}{(4\\pi \\times 10^{-7})(4.0 \\times 10^{-4})} = 1.9894 \\times 10^{6}\\ \\mathrm{A/Wb}$$

**Step 2 -- the ratio, before any arithmetic.** Divide one by the other and the
areas and $\\mu_{0}$ both cancel:

$$\\frac{\\mathcal{R}_{g}}{\\mathcal{R}_{c}} = \\mu_{r}\\,\\frac{g}{\\ell_{c}} = 2500 \\cdot \\frac{0.001}{0.60} = 4.1667$$

One millimetre of air out of 601 mm of path presents **more than four times**
the opposition of all 600 mm of the iron. That single line is the reason air
gaps dominate magnetic-circuit problems, and it is worth carrying as a formula:
the gap wins whenever $\\mu_{r}g > \\ell_{c}$, which for ordinary steel means
whenever the gap exceeds a few ten-thousandths of the path length.

**Step 3 -- flux and flux density.** With
$\\mathcal{R} = 4.7746 \\times 10^{5} + 1.9894 \\times 10^{6} = 2.4669 \\times 10^{6}\\ \\mathrm{A/Wb}$
and $\\mathcal{F} = 500 \\times 2.0 = 1000\\ \\mathrm{A}$,

$$\\Phi = \\frac{\\mathcal{F}}{\\mathcal{R}} = \\frac{1000}{2.4669 \\times 10^{6}} = 4.0537 \\times 10^{-4}\\ \\mathrm{Wb}$$

$$B = \\frac{\\Phi}{A} = \\frac{4.0537 \\times 10^{-4}}{4.0 \\times 10^{-4}} = 1.0134\\ \\mathrm{T}$$

**Step 4 -- how the drive divides.** In proportion to reluctance, exactly as
voltage divides across series resistors:

$$\\mathcal{F}_{g} = \\Phi\\,\\mathcal{R}_{g} = (4.0537 \\times 10^{-4})(1.9894 \\times 10^{6}) = 806.45\\ \\mathrm{A}$$

$$\\mathcal{F}_{c} = 1000 - 806.45 = 193.55\\ \\mathrm{A}$$

so the gap takes $806.45/1000 = 80.6\\%$ of the drive. The fraction is exactly
$25/31$, because the reluctance ratio was exactly $25/6$.

**The second route, as a check.** Forget reluctance and apply Ampere's law
directly. Flux density is continuous across the iron-air interface, so $B$ is
the same on both sides while $H$ is not:

$$H_{c} = \\frac{B}{\\mu_{r}\\mu_{0}} = \\frac{1.0134}{(2500)(4\\pi \\times 10^{-7})} = 322.58\\ \\mathrm{A/m}$$

$$H_{g} = \\frac{B}{\\mu_{0}} = \\frac{1.0134}{4\\pi \\times 10^{-7}} = 8.0645 \\times 10^{5}\\ \\mathrm{A/m}$$

$$H_{c}\\ell_{c} + H_{g}g = (322.58)(0.60) + (8.0645 \\times 10^{5})(0.001) = 193.55 + 806.45 = 1000.0\\ \\mathrm{A}$$

The loop closes on the 1000 ampere-turns we started from, which is the whole
content of Ampere's law and confirms every number above by a path that never
mentions reluctance. Note also that $H_{g}/H_{c} = 2500$ exactly, which is
$\\mu_{r}$: the field strength jumps by the permeability ratio at the interface
because the flux density may not.

![Two stacked panels against air-gap length from zero to two millimetres. The upper panel splits the thousand ampere-turns of drive between the gap and the iron, the two shares crossing at about one quarter of a millimetre and the gap share reaching eighty-one percent at the one millimetre operating point marked with a dot. The lower panel plots the resulting core flux, falling steeply from about two point one milliwebers with no gap to the marked 0.4054 milliweber operating point.](/courses/fe-ee/figures/sci3-reluctance-ladder.svg)

The upper panel is the sentence "the gap dominates" turned into a curve, and
the crossing point tells you where domination begins: at roughly $0.24$ mm, a
quarter of a millimetre of air already matches 600 mm of iron. The lower panel
is the price. Cutting the gap divided the flux by a factor of $5.17$ against
the ungapped ring, and section 10 explains why an inductor designer pays that
price gladly and a transformer designer never does.

## 5.4 Worked example: what neglecting fringing costs

Flux crossing the gap bulges sideways, and the standard first correction adds
one gap length to each transverse dimension of the pole face. For our 20 mm
square face with a 1.0 mm gap,

$$A_{\\mathrm{eff}} = (a + g)(b + g) = (0.021)(0.021) = 4.41 \\times 10^{-4}\\ \\mathrm{m}^{2}$$

which is $10.25\\%$ more area than the iron has, so the gap reluctance falls by
the same factor to $1.8045 \\times 10^{6}\\ \\mathrm{A/Wb}$. Redo step 3:

$$\\Phi = \\frac{1000}{4.7746 \\times 10^{5} + 1.8045 \\times 10^{6}} = 4.3822 \\times 10^{-4}\\ \\mathrm{Wb}$$

That is $8.11\\%$ more flux than the unfringed calculation predicted, and
$B$ rises from 1.0134 T to 1.0956 T. Two lessons sit in the gap between
$10.25\\%$ and $8.11\\%$. First, the correction is **diluted**: the gap is only
part of the circuit, so an error in the gap reaches the answer reduced by the
gap's share of the total. Second, eight percent is larger than the tolerance on
any permeability figure you were given, which is why practical gap formulas
carry correction factors and why designers who care about the answer measure
the finished part.

## 5.5 Worked example: a parallel magnetic circuit with one gap

A shell-type core has a centre limb 0.10 m long of section
$8.0\\ \\mathrm{cm}^{2}$ and two outer limbs each 0.30 m long of section
$4.0\\ \\mathrm{cm}^{2}$; the iron has $\\mu_{r} = 2000$ throughout. The coil on
the centre limb has 300 turns and carries 0.40 A. A gap of 0.5 mm is cut into
**one** outer limb. Find the flux in each limb.

The centre limb is made twice the area of each outer limb on purpose, so that
in the symmetric case every part of the core runs at the same flux density.
Adding the gap destroys that symmetry, which is exactly what makes the problem
worth working.

**Step 1 -- the three branch reluctances.**

$$\\mathcal{R}_{1} = \\frac{0.10}{(4\\pi \\times 10^{-7})(2000)(8.0 \\times 10^{-4})} = 4.9736 \\times 10^{4}\\ \\mathrm{A/Wb}$$

$$\\mathcal{R}_{A} = \\frac{0.30}{(4\\pi \\times 10^{-7})(2000)(4.0 \\times 10^{-4})} = 2.9842 \\times 10^{5}\\ \\mathrm{A/Wb}$$

The gapped limb is 0.2995 m of iron in series with 0.5 mm of air:

$$\\mathcal{R}_{B} = 2.9792 \\times 10^{5} + 9.9472 \\times 10^{5} = 1.2926 \\times 10^{6}\\ \\mathrm{A/Wb}$$

**Step 2 -- combine and solve.** The two outer limbs are in parallel:

$$\\mathcal{R}_{\\parallel} = \\frac{\\mathcal{R}_{A}\\mathcal{R}_{B}}{\\mathcal{R}_{A} + \\mathcal{R}_{B}} = 2.4245 \\times 10^{5}\\ \\mathrm{A/Wb}$$

$$\\Phi_{\\mathrm{total}} = \\frac{300 \\times 0.40}{4.9736 \\times 10^{4} + 2.4245 \\times 10^{5}} = 4.1070 \\times 10^{-4}\\ \\mathrm{Wb}$$

**Step 3 -- divide the flux.** Inverse proportion, so the easy branch takes
most of it:

$$\\Phi_{A} = \\Phi_{\\mathrm{total}}\\,\\frac{\\mathcal{R}_{B}}{\\mathcal{R}_{A} + \\mathcal{R}_{B}} = 3.3367 \\times 10^{-4}\\ \\mathrm{Wb}$$

$$\\Phi_{B} = \\Phi_{\\mathrm{total}} - \\Phi_{A} = 7.7031 \\times 10^{-5}\\ \\mathrm{Wb}$$

| Limb | Reluctance (A/Wb) | Flux (mWb) | Share | $B$ (T) |
|---|---|---|---|---|
| Centre | $4.9736 \\times 10^{4}$ | 0.41070 | 100% | 0.5134 |
| Outer, solid | $2.9842 \\times 10^{5}$ | 0.33367 | 81.2% | 0.8342 |
| Outer, gapped | $1.2926 \\times 10^{6}$ | 0.07703 | 18.8% | 0.1926 |

**Step 4 -- check it two ways.** Both parallel branches must carry the same
magnetomotive force, because they hang between the same pair of joints:

$$\\Phi_{A}\\mathcal{R}_{A} = 99.57\\ \\mathrm{A} \\qquad \\Phi_{B}\\mathcal{R}_{B} = 99.57\\ \\mathrm{A}$$

and the loop through the centre limb closes on the drive:

$$\\Phi_{\\mathrm{total}}\\mathcal{R}_{1} + 99.57 = 20.43 + 99.57 = 120.0\\ \\mathrm{A}$$

Both checks pass. Notice how sharply half a millimetre of air redistributes the
field: the gapped limb runs at 0.19 T while the solid one runs at 0.83 T, over
four times higher, from the same drive. That is the design mechanism behind every
flux-diverting shunt and every magnetic proximity sensor.

![Flux in the three limbs of the shell core plotted against the gap cut into one outer limb, from zero to one millimetre. At zero gap the two outer limbs share equally at 0.30 milliwebers each; as the gap opens, the gapped limb falls steeply while the solid limb rises slightly and the centre limb, being their sum, falls. Circles mark the worked 0.5 millimetre case.](/courses/fe-ee/figures/sci3-parallel-core.svg)

The slight **rise** of the solid limb is the part worth understanding. Cutting
the gap raises the total reluctance, so less flux enters the core overall, but
it raises the gapped branch far more than it raises the parallel combination,
so the solid branch ends up with a larger share of a smaller total, and the two
effects nearly cancel. That kind of near-cancellation is invisible in the
formulas and obvious in the plot, which is what plots are for.`,
      examTip: 'On any gapped magnetic circuit, compute the ratio of gap to core reluctance FIRST, as mu_r times g over the core path length. If that ratio is large the gap carries almost all the drive and the iron can often be neglected entirely, turning a two-element problem into a one-element one. On the FE this shortcut is usually worth more than the exact answer, because the answer choices are far apart.',
      importantNote: 'Reluctance is measured in A/Wb, which is the same as inverse henries. It is NOT measured in ohms and it does not dissipate anything. The product one half Phi squared times reluctance carries units of joules, not watts, and is the energy stored in the field. Any argument of the form "reluctance is like resistance so power is lost in it" is dimensionally incoherent.',
    },
    {
      id: 'em-core-loss',
      title: '6. The B-H Curve, Saturation, and the Two Core Losses',
      content: `## 6.1 Permeability is an operating point, not a material property

Section 5 assumed a constant $\\mu_{r} = 2500$. Real iron does no such thing.
To make the departure concrete, this section uses a magnetisation curve that is
written down rather than measured, so every number below can be reproduced:

$$B(H) = \\frac{2B_{s}}{\\pi}\\arctan\\!\\left(\\frac{\\pi \\mu_{i}H}{2B_{s}}\\right)$$

with saturation flux density $B_{s} = 1.8\\ \\mathrm{T}$ and initial slope
$\\mu_{i} = 5000\\mu_{0}$. The two limits are the two facts the model has to
carry: for small $H$ the arctangent is its own argument and $B \\to \\mu_{i}H$,
while for large $H$ the arctangent approaches $\\pi/2$ and $B \\to B_{s}$. The
inverse is closed-form, which makes the later energy integrals exact:

$$H(B) = \\frac{2B_{s}}{\\pi \\mu_{i}}\\tan\\!\\left(\\frac{\\pi B}{2B_{s}}\\right)$$

The **secant permeability** at a working point is $B/(\\mu_{0}H)$, and on this
curve it is anything but constant:

| $H$ (A/m) | $B$ (T) | secant $\\mu_{r} = B/(\\mu_{0}H)$ |
|---|---|---|
| 100 | 0.575 | 4574 |
| 300 | 1.174 | 3114 |
| 425 | 1.336 | 2500 |
| 681 | 1.500 | 1754 |
| 1000 | 1.593 | 1268 |

The third row is the honest reconciliation with section 5: the constant 2500
used there is the secant permeability of this material at about 1.34 T. Below
that flux density the linear model **understates** the flux; above it, it
overstates it, and near saturation it overstates it badly.

![Two panels. The upper plots flux density against field strength for the stated arctangent model, rising steeply from the origin and flattening toward the 1.8 tesla saturation line, with a marked point at 425 amperes per metre and 1.34 tesla. The lower panel plots secant relative permeability against flux density, falling from 5000 at low flux through the marked 2500 point at 1.34 tesla and on down past 1000 near saturation.](/courses/fe-ee/figures/sci3-bh-curve.svg)

The lower panel is the one to remember. **Permeability is a number you read off
a curve at the flux density you are running at**, and a designer who pushes a
core 20% harder does not get 20% more flux for 20% more current.

## 6.2 Worked example: hysteresis loss is the area of a loop

Real iron does not retrace the same curve going down as it took going up. Give
the model a coercivity by displacing the two branches symmetrically, with a
displacement that vanishes at the tips so the loop closes:

$$H_{\\uparrow,\\downarrow}(B) = H(B) \\pm H_{c}\\left[1 - \\left(\\frac{B}{B_{m}}\\right)^{2}\\right]$$

Take $H_{c} = 50\\ \\mathrm{A/m}$ and drive the core to $B_{m} = 1.5\\ \\mathrm{T}$.
The energy the source must supply per unit volume in one traversal is

$$w_{h} = \\oint H\\,dB$$

and its dimensions settle the question of what it is:
$(\\mathrm{A/m})(\\mathrm{Wb/m^{2}}) = \\mathrm{A}\\cdot\\mathrm{V}\\cdot\\mathrm{s}/\\mathrm{m}^{3} = \\mathrm{J/m^{3}}$,
an energy density. Because the two branches differ only by the displacement
term, the integral collapses:

$$w_{h} = \\int_{-B_{m}}^{B_{m}}\\left(H_{\\uparrow} - H_{\\downarrow}\\right)dB = 2H_{c}\\int_{-B_{m}}^{B_{m}}\\left[1 - \\frac{B^{2}}{B_{m}^{2}}\\right]dB = \\frac{8}{3}H_{c}B_{m}$$

$$w_{h} = \\frac{8}{3}(50)(1.5) = 200.0\\ \\mathrm{J/m^{3}}\\ \\text{per cycle}$$

**The loss is per cycle, so the power is proportional to frequency:**

$$P_{h} = f\\,w_{h} = (60)(200.0) = 12{,}000\\ \\mathrm{W/m^{3}}$$

and at a steel density of $7650\\ \\mathrm{kg/m^{3}}$ that is
$12000/7650 = 1.569\\ \\mathrm{W/kg}$.

![The hysteresis loop of the stated model, flux density against field strength, with the enclosed area shaded. The dashed anhysteretic curve runs up the middle of the loop. Markers show the coercivity at plus and minus 50 amperes per metre where the branches cross zero flux, and the remanence at plus and minus 0.295 tesla where they cross zero field.](/courses/fe-ee/figures/sci3-hysteresis-loop.svg)

Two consequences follow from "the loss is an area". A **narrow** loop means a
soft magnetic material and a low-loss core, which is what transformer steel is
bred for; a **fat** loop means a permanent magnet, where the whole point is to
resist being demagnetised. And driving a core harder costs more than
proportionally, because widening the loop in $B$ also widens it in $H$: the
empirical summary of that is the Steinmetz form $P_{h} = k_{h}fB_{m}^{n}$ with
the exponent $n$ between about 1.6 and 2.0. The model above happens to give
$n = 1$ exactly, because a fixed coercivity was assumed; real coercivity grows
with drive, and that is where the extra exponent comes from.

## 6.3 Worked example: eddy currents, and why cores are laminated

A changing flux induces a voltage round every closed path in the core itself,
and the core is a conductor. For a sheet of thickness $d$ thin compared with
the skin depth, the classical result is

$$P_{e} = \\frac{\\pi^{2}d^{2}f^{2}B_{m}^{2}}{6\\rho}$$

Check the dimensions before using it:
$\\mathrm{m}^{2}\\cdot\\mathrm{s}^{-2}\\cdot\\mathrm{T}^{2}/(\\Omega\\cdot\\mathrm{m})$
reduces to $\\mathrm{V}^{2}/(\\Omega\\cdot\\mathrm{m}^{3}) = \\mathrm{W/m^{3}}$,
a power density, as it must be. Take laminations
$d = 0.35\\ \\mathrm{mm}$ thick of resistivity
$\\rho = 4.7 \\times 10^{-7}\\ \\Omega\\cdot\\mathrm{m}$, at 60 Hz and
$B_{m} = 1.5\\ \\mathrm{T}$:

$$P_{e} = \\frac{(9.8696)(3.5 \\times 10^{-4})^{2}(60)^{2}(1.5)^{2}}{(6)(4.7 \\times 10^{-7})} = 3473\\ \\mathrm{W/m^{3}}$$

Add the hysteresis term and the core loses
$12{,}000 + 3473 = 15{,}473\\ \\mathrm{W/m^{3}}$, which is
$2.02\\ \\mathrm{W/kg}$ -- squarely in the range a real grain-oriented steel
would quote at this flux density and frequency, which is a reassuring sign that
neither model has gone off the rails.

**The thickness dependence is the design lever.** Eddy loss goes as $d^{2}$, so
switching to 0.50 mm laminations multiplies it by $(0.50/0.35)^{2} = 2.041$, to
$7087\\ \\mathrm{W/m^{3}}$, while the hysteresis term does not move at all.
Halving the lamination thickness quarters the eddy term. Nothing else in
magnetics offers that kind of leverage for that little effort, which is why
every AC core you will ever meet is built from stacked insulated sheets rather
than solid metal.

**The formula has a validity limit, and it is worth respecting.** It assumes
the field penetrates the sheet fully, which requires the thickness to be small
against the skin depth

$$\\delta = \\sqrt{\\frac{2\\rho}{\\omega \\mu}}$$

At 60 Hz, with the secant permeability at 1.5 T being $1754\\mu_{0}$, this gives
$\\delta = 1.064\\ \\mathrm{mm}$, so $d/\\delta = 0.33$ and the formula is safe.
At 400 Hz the skin depth falls to 0.412 mm and $d/\\delta = 0.85$, close enough
to the limit that the classical expression begins to overestimate. For a
**solid** 20 mm core the ratio would be about 19, the formula would be
nonsense, and the true loss would be governed by the field failing to reach the
interior at all. The qualitative conclusion is unchanged -- do not build AC
cores out of solid iron -- but the number would be meaningless.

## 6.4 Which loss wins, and where

The two terms scale differently, so their relative sizes depend entirely on
frequency:

| Quantity | Hysteresis | Eddy current |
|---|---|---|
| Frequency | $\\propto f$ | $\\propto f^{2}$ |
| Peak flux | $\\propto B_{m}^{n}$, $n \\approx 1.6$ to $2.0$ | $\\propto B_{m}^{2}$ |
| Lamination thickness | no dependence | $\\propto d^{2}$ |
| Resistivity | no dependence | $\\propto 1/\\rho$ |
| At 60 Hz, this core | $12{,}000\\ \\mathrm{W/m^{3}}$ (78%) | $3473\\ \\mathrm{W/m^{3}}$ (22%) |
| At 400 Hz, this core | $80{,}000\\ \\mathrm{W/m^{3}}$ (34%) | $154{,}344\\ \\mathrm{W/m^{3}}$ (66%) |

They cross where $w_{h}f = k_{e}f^{2}$, that is at $f = w_{h}/k_{e}$:

$$f_{\\times} = \\frac{200.0}{0.96465} = 207.3\\ \\mathrm{Hz}$$

With 0.50 mm laminations the crossing falls to 101.6 Hz, exactly a factor
$2.041$ lower, since the crossing frequency is inversely proportional to
$k_{e}$ and therefore to $d^{2}$.

![Loss density against frequency from 20 to 400 hertz at 1.5 tesla peak. The hysteresis line rises linearly, and two eddy-current parabolas rise from the origin, the thicker 0.50 millimetre lamination steeply and the 0.35 millimetre one about half as fast. A dot marks where the 0.35 millimetre eddy curve crosses the hysteresis line at 207 hertz.](/courses/fe-ee/figures/sci3-core-loss.svg)

This is why aircraft power systems at 400 Hz use very thin laminations or
powdered cores, and why the same steel that is efficient in a 60 Hz distribution
transformer would be unusable in a switching converter running at tens of
kilohertz.`,
      examTip: 'Separate the two loss terms by their frequency exponent. If a problem gives loss at two frequencies at the same flux density, write P = a f + b f squared, solve the two equations for a and b, and you have separated hysteresis from eddy current without knowing anything about the material. That separation is a standard exam question and it needs no data beyond the two measurements.',
      importantNote: 'The classical eddy-current formula assumes the lamination is thin compared with the skin depth. Before quoting it, compute the skin depth at the working frequency and the working permeability. For 0.35 mm steel at 60 Hz the ratio is about a third and the formula is fine; for a solid core it is off by orders of magnitude and the honest answer is that the field never reaches the middle.',
    },
    {
      id: 'em-inductance-coupling',
      title: '7. Inductance from Geometry, and What Couples Two Windings',
      content: `## 7.1 Three expressions for one quantity

**Flux linkage** is the bookkeeping quantity that makes inductance simple. If
every one of $N$ turns encloses the same flux $\\Phi$, then

$$\\lambda = N\\Phi \\qquad [\\,\\mathrm{Wb}\\,]$$

and inductance is defined as flux linkage per ampere. Combining that definition
with the magnetic-circuit law gives three faces of the same number:

$$L = \\frac{\\lambda}{i} = \\frac{N\\Phi}{i} = \\frac{N^{2}}{\\mathcal{R}}$$

The last form is the useful one, and it carries two statements worth
memorising. Inductance goes as the **square** of turns, because turns both
create the flux and link it. And inductance is fixed entirely by turns and
**geometry** through the reluctance -- put the same coil on a bigger core and
you get more inductance without touching the winding.

For a long straight solenoid with no iron, $\\mathcal{R} = \\ell/(\\mu_{0}A)$
and the standard formula drops out:

$$L = \\frac{\\mu_{0}N^{2}A}{\\ell}$$

**Worked check.** A 200-turn coil 0.15 m long of cross-section
$3.0\\ \\mathrm{cm}^{2}$, air-cored:

$$L = \\frac{(4\\pi \\times 10^{-7})(200)^{2}(3.0 \\times 10^{-4})}{0.15} = 1.0053 \\times 10^{-4}\\ \\mathrm{H} = 100.53\\ \\mu\\mathrm{H}$$

Slide a closed iron core of $\\mu_{r} = 2500$ into the same winding and the
reluctance falls by 2500, so $L$ rises to $251.3\\ \\mathrm{mH}$ -- a factor of
2500 for no change in the copper. That is what iron is for.

## 7.2 Worked example: two windings, mutual inductance and coupling

Return to the gapped ring of section 5.3, with
$\\mathcal{R} = 2.4669 \\times 10^{6}\\ \\mathrm{A/Wb}$. Wind a second coil of
$N_{2} = 200$ turns on the same core beside the existing
$N_{1} = 500$.

**Self-inductances.** Each is its own turns squared over the shared reluctance:

$$L_{1} = \\frac{500^{2}}{2.4669 \\times 10^{6}} = 101.3417\\ \\mathrm{mH} \\qquad L_{2} = \\frac{200^{2}}{2.4669 \\times 10^{6}} = 16.2147\\ \\mathrm{mH}$$

Their ratio is $101.3417/16.2147 = 6.2500$, which is $(500/200)^{2}$, as the
turns-squared law demands.

**Mutual inductance** is the flux linkage of one winding per ampere in the
other. Current $i_{1}$ drives flux $N_{1}i_{1}/\\mathcal{R}$, all of which
threads winding 2 if none of it leaks, so

$$M = \\frac{N_{2}\\Phi}{i_{1}} = \\frac{N_{1}N_{2}}{\\mathcal{R}} = \\frac{(500)(200)}{2.4669 \\times 10^{6}} = 40.5367\\ \\mathrm{mH}$$

**The coupling coefficient** compares that with the largest value the two
self-inductances permit:

$$k = \\frac{M}{\\sqrt{L_{1}L_{2}}}$$

$$\\sqrt{L_{1}L_{2}} = \\sqrt{(101.3417)(16.2147)} = 40.5367\\ \\mathrm{mH} \\quad \\Rightarrow \\quad k = 1.0000$$

The idealisation returns $k = 1$ exactly, and the algebra shows why it must:
$\\sqrt{(N_{1}^{2}/\\mathcal{R})(N_{2}^{2}/\\mathcal{R})} = N_{1}N_{2}/\\mathcal{R}$,
which is $M$. **Perfect coupling is not an approximation in this model; it is a
consequence of assuming that every line of flux threads both windings.** Real
values of $k$ fall short only because some flux does not, and that is the
single physical meaning of the coupling coefficient: $k^{2}$ is the fraction of
one winding's flux that reaches the other.

## 7.3 Worked example: measuring $M$ with an inductance meter

You cannot put a meter directly across a mutual inductance, but you can measure
it in two connections. Wire the coils in series so their fluxes add, then
reverse one:

$$L_{\\mathrm{aid}} = L_{1} + L_{2} + 2M \\qquad L_{\\mathrm{opp}} = L_{1} + L_{2} - 2M$$

Subtract, and everything but the quantity you want cancels:

$$M = \\frac{L_{\\mathrm{aid}} - L_{\\mathrm{opp}}}{4}$$

Suppose the core above achieves $k = 0.94$ in practice, so
$M = 0.94 \\times 40.5367 = 38.1045\\ \\mathrm{mH}$ and $2M = 76.2090\\ \\mathrm{mH}$.
The meter would then read

$$L_{\\mathrm{aid}} = 101.3417 + 16.2147 + 76.2090 = 193.7654\\ \\mathrm{mH}$$

$$L_{\\mathrm{opp}} = 101.3417 + 16.2147 - 76.2090 = 41.3474\\ \\mathrm{mH}$$

$$193.7654 - 41.3474 = 152.4180 \\qquad \\frac{152.4180}{4} = 38.1045\\ \\mathrm{mH}$$

which recovers what we put in. Two details make this a favourite exam question.
The **opposing** reading is the smaller one, always, so if your two
measurements are handed to you unlabelled the smaller is $L_{\\mathrm{opp}}$.
And the factor is **four**, not two: the aiding case adds $2M$ and the opposing
case subtracts it, so the difference is $4M$. Dropping to a factor of two is
the single most common arithmetic slip in this topic.

| Quantity | Perfect coupling | With $k = 0.94$ |
|---|---|---|
| $L_{1}$ | 101.3417 mH | 101.3417 mH |
| $L_{2}$ | 16.2147 mH | 16.2147 mH |
| $M$ | 40.5367 mH | 38.1045 mH |
| $L_{\\mathrm{aid}}$ | 198.6298 mH | 193.7654 mH |
| $L_{\\mathrm{opp}}$ | 36.4830 mH | 41.3474 mH |

Note that imperfect coupling **raises** the opposing reading and **lowers** the
aiding one, squeezing the two together. In the limit $k \\to 0$ both readings
collapse onto $L_{1} + L_{2}$, which is exactly what two coils on opposite
sides of the room would give.`,
      examTip: 'When two coils sit on a common core, do not compute M from a flux argument if you can avoid it. Compute the reluctance once, then read off L1, L2 and M as N1 squared, N2 squared and N1 times N2, all over that same reluctance. Three answers from one division, and the coupling coefficient is then 1 by construction unless the problem says otherwise.',
      importantNote: 'Mutual inductance from a series test uses M = (L_aiding minus L_opposing) over FOUR. The factor is four because the aiding connection adds 2M and the opposing connection subtracts 2M, so the difference between them is 4M. Halving that to 2M is the standard mistake.',
    },
    {
      id: 'em-energy-force',
      title: '8. Energy, Co-energy, and Force by the Energy Method',
      content: `## 8.1 Two areas on one curve

Draw the flux linkage of a device against its current. The area **above** the
curve, integrated along the $\\lambda$ axis, is the energy stored in the field:

$$W_{f} = \\int_{0}^{\\lambda} i\\,d\\lambda'$$

The area **below** it, integrated along the $i$ axis, is the **co-energy**:

$$W' = \\int_{0}^{i} \\lambda\\,di'$$

Together they fill the rectangle, so

$$W_{f} + W' = \\lambda i$$

always, for any characteristic whatever. Co-energy has no physical existence --
nothing in the device is storing it -- but it is the correct thing to
differentiate when current is the variable you control, and that is why it
earns a name.

If the device is **linear**, $\\lambda = Li$, the curve is a straight line, the
two areas are congruent triangles, and every expression collapses:

$$W_{f} = W' = \\tfrac{1}{2}\\lambda i = \\tfrac{1}{2}Li^{2} = \\frac{\\lambda^{2}}{2L}$$

This is why so many textbook problems never mention co-energy: in the linear
case it equals the energy numerically and the distinction is invisible. It
stops being invisible the moment the iron saturates.

Field energy can also be counted where it actually sits, as a density
integrated over volume:

$$w = \\int_{0}^{B} H\\,dB' \\quad\\longrightarrow\\quad w = \\frac{B^{2}}{2\\mu} \\ \\text{when linear}$$

and $\\mathrm{T}^{2}/(\\mathrm{H/m})$ does reduce to $\\mathrm{J/m^{3}}$, as the
name requires.

## 8.2 Worked example: the two areas, when they differ

Take the **ungapped** ring of section 5, using the saturating curve of section
6, and drive it to $B_{m} = 1.5\\ \\mathrm{T}$. The coil sees

$$i = \\frac{\\ell_{c}H(B_{m})}{N} = \\frac{(0.60)(680.64)}{500} = 0.81677\\ \\mathrm{A}$$

$$\\lambda = NAB_{m} = (500)(4.0 \\times 10^{-4})(1.5) = 0.30000\\ \\mathrm{Wb}$$

so the enclosing rectangle is $\\lambda i = 0.24503\\ \\mathrm{J}$. The stored
energy is the volume integral of the energy density, and since the flux density
is uniform the volume comes straight out:

$$W_{f} = V\\!\\int_{0}^{B_{m}}\\!H\\,dB = (2.40 \\times 10^{-4})(282.48) = 0.067794\\ \\mathrm{J}$$

$$W' = \\lambda i - W_{f} = 0.24503 - 0.067794 = 0.17724\\ \\mathrm{J}$$

The two are **not** equal: co-energy is 2.61 times the energy, taking 72.3% of
the rectangle against 27.7%. Half the rectangle would be
$0.12252\\ \\mathrm{J}$, and neither quantity is anywhere near it. A saturating
device stores far less energy than its terminal inductance suggests, because
the extra amperes near the top of the curve buy almost no extra flux.

![The flux linkage of the saturating ungapped core plotted against coil current, bending over as the iron saturates. The region between the curve and the horizontal line at the top is shaded and labelled as the field energy of 0.0678 joules; the region below the curve is shaded and labelled as the co-energy of 0.1772 joules. A dashed straight chord from the origin to the operating point marks what a linear device would have done.](/courses/fe-ee/figures/sci3-coenergy.svg)

The dashed chord is the linear device that has the same inductance at this one
operating point, $L = \\lambda/i = 0.3673\\ \\mathrm{H}$. It splits the
rectangle down the middle. The real curve does not, and any energy calculation
that uses $\\tfrac{1}{2}Li^{2}$ on a saturating device is quoting the chord
rather than the curve.

## 8.3 The force rules, and the sign that trips people

The energy method says: hold one electrical variable fixed, differentiate the
appropriate energy function with respect to position, and read off the force.
There are two correct statements and they are not interchangeable.

$$f = -\\left.\\frac{\\partial W_{f}(\\lambda, x)}{\\partial x}\\right|_{\\lambda} \\qquad\\qquad f = +\\left.\\frac{\\partial W'(i, x)}{\\partial x}\\right|_{i}$$

**The held variable and the sign travel together, and the reason is energy
bookkeeping.** At constant flux linkage the induced voltage $d\\lambda/dt$ is
zero, so the electrical source delivers nothing and any mechanical work must be
paid for out of the field: energy goes down as work comes out, hence the minus.
At constant current the source **is** delivering, and what it delivers over a
small displacement is $i\\,d\\lambda = i^{2}\\,dL$; exactly half of that goes into
the field and the other half emerges as mechanical work, which is why the
co-energy derivative carries a plus.
Writing $f = +\\partial W_{f}/\\partial x$ at constant $\\lambda$ gets the
direction of the force backwards.

For a linear device both routes reduce to the expression you will actually use:

$$f = \\tfrac{1}{2}i^{2}\\frac{dL}{dx} \\qquad\\text{or equivalently}\\qquad f = -\\tfrac{1}{2}\\Phi^{2}\\frac{d\\mathcal{R}}{dx}$$

Check the dimensions of the first:
$\\mathrm{A}^{2}\\cdot\\mathrm{H/m} = \\mathrm{A}^{2}\\cdot\\mathrm{V}\\cdot\\mathrm{s}/(\\mathrm{A}\\cdot\\mathrm{m}) = \\mathrm{J/m} = \\mathrm{N}$.
And of the second:
$\\mathrm{Wb}^{2}\\cdot\\mathrm{A}/(\\mathrm{Wb}\\cdot\\mathrm{m}) = \\mathrm{J/m} = \\mathrm{N}$.
Both are forces. The sign structure is now readable at a glance: **the force
always acts to increase inductance, equivalently to decrease reluctance**,
which is the same as saying that magnetic systems pull themselves toward
configurations that make it easier for flux to flow.

## 8.4 Worked example: the pull of a plunger, by three routes

Give the ring of section 5 a movable armature so the gap length $x$ is
variable, keep $N = 500$ and $i = 2.0\\ \\mathrm{A}$, and ask for the pull at
$x = 1.0\\ \\mathrm{mm}$.

**Route 1 -- energy method, iron neglected.** With
$L(x) = \\mu_{0}N^{2}A/x$,

$$\\frac{dL}{dx} = -\\frac{\\mu_{0}N^{2}A}{x^{2}} \\quad\\Rightarrow\\quad |f| = \\frac{\\mu_{0}N^{2}i^{2}A}{2x^{2}}$$

$$|f| = \\frac{(4\\pi \\times 10^{-7})(500)^{2}(2.0)^{2}(4.0 \\times 10^{-4})}{2(1.0 \\times 10^{-3})^{2}} = 251.33\\ \\mathrm{N}$$

**Route 2 -- direct field calculation.** Ampere's law with no iron drop gives
$B = \\mu_{0}Ni/x = 1.2566\\ \\mathrm{T}$. Magnetic pressure on a pole face is
the energy density itself:

$$f = \\frac{B^{2}}{2\\mu_{0}}A = \\frac{(1.2566)^{2}}{2(4\\pi \\times 10^{-7})}(4.0 \\times 10^{-4}) = (6.2832 \\times 10^{5})(4.0 \\times 10^{-4}) = 251.33\\ \\mathrm{N}$$

The two routes agree to the last figure printed, and they agree **identically**
rather than numerically: substituting $B = \\mu_{0}Ni/x$ into
$B^{2}A/(2\\mu_{0})$ reproduces $\\mu_{0}N^{2}i^{2}A/(2x^{2})$ term by term.
That is the confirmation the energy method needs, because nothing in its
derivation ever mentioned a field.

**Now keep the iron.** The real inductance is
$L(x) = N^{2}/(\\mathcal{R}_{c} + x/\\mu_{0}A)$, and at
$x = 1.0\\ \\mathrm{mm}$ this gives $dL/dx = -81.727\\ \\mathrm{H/m}$, so

$$f = \\tfrac{1}{2}(2.0)^{2}(-81.727) = -163.45\\ \\mathrm{N}$$

the minus sign meaning the force pulls the gap **closed**. The direct route
agrees: the true flux density is only $1.0134\\ \\mathrm{T}$, so the pressure is
$4.0864 \\times 10^{5}\\ \\mathrm{Pa}$ and the pull is
$163.45\\ \\mathrm{N}$. And a **third** route, differentiating field energy at
constant flux, gives the same again:

$$f = -\\tfrac{1}{2}\\Phi^{2}\\frac{d\\mathcal{R}}{dx} = -\\frac{\\Phi^{2}}{2\\mu_{0}A} = -\\frac{(4.0537 \\times 10^{-4})^{2}}{2(4\\pi \\times 10^{-7})(4.0 \\times 10^{-4})} = -163.45\\ \\mathrm{N}$$

Neglecting the iron overstated the pull by a factor of
$251.327/163.454 = 1.5376$, which is exactly the square of the flux-density
ratio, $(1.2566/1.0134)^{2}$ -- force follows $B^{2}$, so a 24% error in flux
density becomes a 54% error in force.
**Force errors are always worse than flux errors, and always by the square.**

| Gap $x$ | $L$ (mH) | Pull, iron ignored | Pull, iron kept | Overstatement |
|---|---|---|---|---|
| 0.5 mm | 169.82 | 1005.3 N | 459.0 N | $\\times 2.19$ |
| 1.0 mm | 101.34 | 251.3 N | 163.5 N | $\\times 1.54$ |
| 2.0 mm | 56.100 | 62.8 N | 50.1 N | $\\times 1.25$ |

The overstatement is worst where the gap is smallest, because that is where the
iron is the largest share of what is left. A 163 N pull would hold
$163.45/9.80665 = 16.67\\ \\mathrm{kg}$ against standard gravity, which is a
realistic figure for a relay of this size and a useful sanity check on the
arithmetic.

![Pull on the plunger against gap length from 0.2 to 3 millimetres on a logarithmic force axis. The dashed upper curve is the iron-free idealisation falling as one over gap squared; the solid lower curve keeps the iron reluctance and falls less steeply. Open circles at six gap values are the independently computed Maxwell-stress result and lie exactly on the solid curve.](/courses/fe-ee/figures/sci3-actuator-force.svg)

The circles are the point of the figure. They are not sampled from the line;
they are computed from $B^{2}A/2\\mu_{0}$ with $B$ taken from the magnetic
circuit, and they land on a curve produced by numerically differentiating an
inductance. Two different pieces of physics, one answer.

## 8.5 Worked example: the sideways pull, which is much weaker

Not every actuator closes a gap. Hold the gap fixed at
$g = 1.0\\ \\mathrm{mm}$ and let a plunger of width
$w = 20\\ \\mathrm{mm}$ slide across it, so that the **overlap** $u$ changes
while the separation does not. Now $L(u) = \\mu_{0}N^{2}wu/g$ and

$$f = \\tfrac{1}{2}i^{2}\\frac{dL}{du} = \\frac{\\mu_{0}N^{2}i^{2}w}{2g} = \\frac{(4\\pi \\times 10^{-7})(500)^{2}(2.0)^{2}(0.020)}{2(1.0 \\times 10^{-3})} = 12.566\\ \\mathrm{N}$$

positive, so the plunger is pulled **in** to increase the overlap. The direct
route applies the same magnetic pressure, but to the face that is being swept
out, whose area is $wg$ rather than $A$:

$$f = \\frac{B^{2}}{2\\mu_{0}}(wg) = (6.2832 \\times 10^{5})(2.0 \\times 10^{-5}) = 12.566\\ \\mathrm{N}$$

Agreement again, and the ratio to the gap-closing force is instructive:

$$\\frac{f_{\\mathrm{normal}}}{f_{\\mathrm{lateral}}} = \\frac{A}{wg} = \\frac{4.0 \\times 10^{-4}}{2.0 \\times 10^{-5}} = 20.0$$

**A magnetic actuator pulls twenty times harder along the gap than across it**,
at these proportions. That single ratio explains the whole zoo of actuator
geometries: relays and contactors close a gap because that is where the force
is, while linear motors and rotary machines accept the weaker sideways force
because it is the one that can act through an unlimited stroke.

## 8.6 Worked example: reluctance torque, and where the energy goes

Rotation is the same calculation with an angle in place of a length:

$$\\tau = \\tfrac{1}{2}i^{2}\\frac{dL}{d\\theta}$$

and $\\mathrm{A}^{2}\\cdot\\mathrm{H} = \\mathrm{A}^{2}\\cdot\\mathrm{V}\\cdot\\mathrm{s}/\\mathrm{A} = \\mathrm{J}$,
which per radian is a newton-metre. A salient two-pole rotor in a stator bore
presents an inductance that varies twice per revolution:

$$L(\\theta) = L_{0} + L_{2}\\cos 2\\theta$$

Take $L_{0} = 100\\ \\mathrm{mH}$, $L_{2} = 40\\ \\mathrm{mH}$ and
$i = 5\\ \\mathrm{A}$ held constant:

$$\\tau = \\tfrac{1}{2}i^{2}(-2L_{2}\\sin 2\\theta) = -i^{2}L_{2}\\sin 2\\theta = -(25)(0.040)\\sin 2\\theta = -1.000\\sin 2\\theta\\ \\mathrm{N}\\cdot\\mathrm{m}$$

| $\\theta$ | $L(\\theta)$ | $\\tau$ | Interpretation |
|---|---|---|---|
| 0 deg | 140 mH | 0 | aligned, stable |
| 30 deg | 120 mH | $-0.866\\ \\mathrm{N}\\cdot\\mathrm{m}$ | pulled back toward 0 |
| 45 deg | 100 mH | $-1.000\\ \\mathrm{N}\\cdot\\mathrm{m}$ | strongest pull |
| 60 deg | 80 mH | $-0.866\\ \\mathrm{N}\\cdot\\mathrm{m}$ | still pulled back |
| 90 deg | 60 mH | 0 | unaligned, unstable |

The torque is negative throughout the first quadrant, meaning it always drives
$\\theta$ back toward zero -- toward the position of **maximum inductance**,
just as section 8.3 promised. Both equilibria have zero torque, but only the
aligned one is stable; nudge the rotor off 90 degrees and it runs away. That is
the operating principle of a switched-reluctance machine, and it also explains
why such a machine needs no rotor winding, no magnets and no brushes.

**Now close the energy ledger over a finite rotation.** Turn the rotor from 0 to
90 degrees while holding the current at 5 A. The mechanical work done **by** the
field is

$$W_{\\mathrm{mech}} = \\int_{0}^{\\pi/2}\\tau\\,d\\theta = -1.000\\int_{0}^{\\pi/2}\\sin 2\\theta\\,d\\theta = -1.000\\ \\mathrm{J}$$

negative, so 1.000 J of work must be done **on** the rotor to drag it to the
unaligned position. The stored energy also falls, because the inductance did:

$$\\Delta W_{f} = \\tfrac{1}{2}i^{2}\\Delta L = \\tfrac{1}{2}(25)(0.060 - 0.140) = -1.000\\ \\mathrm{J}$$

and the electrical port, held at constant current, absorbs

$$W_{\\mathrm{elec}} = i\\,\\Delta\\lambda = i^{2}\\Delta L = (25)(-0.080) = -2.000\\ \\mathrm{J}$$

The ledger reads $-2.000 = -1.000 + (-1.000)$: two joules were returned to the
supply, one from the field and one from the work done on the shaft. **Exactly
half the electrical energy exchanged at constant current appears as mechanical
work and half as a change in stored field energy** -- which is the finite-motion
statement of the factor of one half in $\\tfrac{1}{2}i^{2}\\,dL/dx$, and the
cleanest way to remember where that half comes from.

![Two stacked panels against rotor angle from 0 to 180 degrees. The upper panel shows inductance varying sinusoidally at twice the angle between 140 and 60 millihenries. The lower panel shows the resulting torque, a negative sine at twice the angle reaching minus one newton-metre at 45 degrees and plus one at 135 degrees, with open circles at seven angles marking the independently differentiated result.](/courses/fe-ee/figures/sci3-reluctance-torque.svg)`,
      examTip: 'Every energy-method force problem reduces to one question: how does the inductance change as the part moves? Write L as a function of position, differentiate, multiply by half the current squared. If the inductance rises with the motion, the force pushes that way. You almost never need the field itself.',
      importantNote: 'The two force expressions are minus the derivative of FIELD energy at constant flux linkage, and plus the derivative of CO-ENERGY at constant current. Mixing them up -- differentiating field energy while holding current -- gives an answer with the wrong sign in a saturating device. In a linear device the two agree numerically, which is why the error survives so long undetected.',
    },
    {
      id: 'em-lorentz-linear-machine',
      title: '9. The Lorentz Pair, and the Linear DC Machine',
      content: `## 9.1 Two laws with the same constant in them

A straight conductor of length $\\ell$ carrying current $i$ across a
perpendicular flux density $B$ feels a force

$$f = B\\ell i$$

and the same conductor moving at speed $v$ across the same field develops an
electromotive force

$$e = B\\ell v$$

Check both: $\\mathrm{T}\\cdot\\mathrm{m}\\cdot\\mathrm{A} = (\\mathrm{V}\\cdot\\mathrm{s}/\\mathrm{m}^{2})\\cdot\\mathrm{m}\\cdot\\mathrm{A} = \\mathrm{N}$
for the first, and
$\\mathrm{T}\\cdot\\mathrm{m}\\cdot(\\mathrm{m/s}) = \\mathrm{V}$ for the
second. These are the two faces of electromechanical conversion, and the fact
that they wear the **same coefficient** $B\\ell$ is not a coincidence. Multiply
each by the quantity that turns it into a power:

$$P_{\\mathrm{mech}} = f v = (B\\ell i)v \\qquad P_{\\mathrm{elec}} = e i = (B\\ell v)i$$

They are the same product. Not approximately, not to within an efficiency
factor: **the conversion itself is exactly lossless, and the two expressions
are algebraically identical.** Everything that is lost in a real machine is lost
somewhere else -- in the winding resistance, in the core, in friction -- and
none of it happens in the conversion. That is why the energy audit of a machine
always closes, and why a mismatch in your arithmetic is a mistake rather than a
physical effect.

This is the linear counterpart of the statement in section 3.1 that the same
constant $k$ appears in $\\tau = ki$ and $e = k\\omega$. One idea, two
geometries.

## 9.2 Worked example: a rail bar driven from rest

A conducting bar of mass $m = 2.0\\ \\mathrm{kg}$ slides without friction on
rails $\\ell = 0.50\\ \\mathrm{m}$ apart in a vertical field
$B = 0.80\\ \\mathrm{T}$. The rails are fed from
$V = 24\\ \\mathrm{V}$ through a total loop resistance
$R = 0.40\\ \\mathrm{\\Omega}$. Describe the motion from rest, and audit the
energy.

The conversion coefficient is $B\\ell = (0.80)(0.50) = 0.40\\ \\mathrm{V}\\cdot\\mathrm{s}/\\mathrm{m}$,
and the two governing relations are the loop equation and Newton's second law:

$$i = \\frac{V - B\\ell v}{R} \\qquad m\\frac{dv}{dt} = B\\ell\\,i$$

Eliminate the current and the whole problem becomes one first-order equation:

$$\\frac{dv}{dt} = \\frac{(B\\ell)^{2}}{mR}\\left(v_{\\infty} - v\\right), \\qquad v_{\\infty} = \\frac{V}{B\\ell}, \\qquad T = \\frac{mR}{(B\\ell)^{2}}$$

The time constant deserves a dimensional look, because it is built entirely
from things that are not seconds:
$\\mathrm{kg}\\cdot\\Omega/(\\mathrm{T}\\cdot\\mathrm{m})^{2}$ reduces to
$\\mathrm{kg}\\cdot\\mathrm{m}^{2}/(\\mathrm{J}\\cdot\\mathrm{s})$, and since a
joule is $\\mathrm{kg}\\cdot\\mathrm{m}^{2}/\\mathrm{s}^{2}$ that is a second.

**The three numbers that bound the motion.**

- **At rest**, there is no back-EMF, so $i = 24/0.40 = 60\\ \\mathrm{A}$, the
  thrust is $(0.80)(0.50)(60) = 24\\ \\mathrm{N}$, and the acceleration is
  $24/2.0 = 12\\ \\mathrm{m/s^{2}}$.
- **At steady state**, the bar has no force on it, so the current is zero and
  the back-EMF has grown to equal the supply: $v_{\\infty} = 24/0.40 = 60\\ \\mathrm{m/s}$.
- **In between**, the time constant is $T = 0.80/0.16 = 5.0\\ \\mathrm{s}$.

$$v(t) = 60\\left(1 - e^{-t/5}\\right)\\ \\mathrm{m/s} \\qquad i(t) = 60\\,e^{-t/5}\\ \\mathrm{A}$$

**The energy audit, and a result that surprises people.** The charge delivered
over the whole run-up is $\\int i\\,dt = (60)(5.0) = 300\\ \\mathrm{C}$, so the
supply hands over

$$W_{\\mathrm{in}} = V\\!\\int i\\,dt = (24)(300) = 7200\\ \\mathrm{J}$$

The bar ends up with

$$W_{\\mathrm{kin}} = \\tfrac{1}{2}mv_{\\infty}^{2} = 0.5 \\times 2.0 \\times 3600 = 3600\\ \\mathrm{J}$$

and the resistance has burned

$$W_{R} = \\int i^{2}R\\,dt = R\\,i_{0}^{2}\\frac{T}{2} = 0.40 \\times 3600 \\times 2.5 = 3600\\ \\mathrm{J}$$

**Exactly half of the supplied energy reached the bar, and exactly half was
burned in the resistance -- and that split does not depend on a single one of
the numbers.** In symbols the supplied energy is
$W_{\\mathrm{in}} = V(V/R)(mR/(B\\ell)^{2}) = mV^{2}/(B\\ell)^{2}$, while the
kinetic energy is $W_{\\mathrm{kin}} = \\tfrac{1}{2}m(V/B\\ell)^{2}$, exactly
half of it for any $m$, $R$, $B$, $\\ell$ or $V$. It is the same
theorem as charging a capacitor through a resistor from a fixed source, and it
is the reason nobody accelerates a load by simply connecting it to a supply and
waiting: half the bill is unavoidable waste.

![Two stacked panels against time over twenty-five seconds. The upper panel shows the bar speed rising exponentially toward sixty metres per second while the current falls exponentially from sixty amperes to zero, both with a five-second time constant. The lower panel shows cumulative energy: the supplied curve rising to 7200 joules and the kinetic and resistive curves each rising to 3600 joules, the resistive one leading early and the kinetic one catching up.](/courses/fe-ee/figures/sci3-linear-machine.svg)

The lower panel shows where the waste is incurred: the resistive curve rises
fastest at the beginning, when the current is largest and the bar is barely
moving, so almost none of the early energy does useful work. A drive that ramps
the voltage instead of applying it in one step keeps the current low throughout
and beats the fifty-percent limit -- which is exactly the argument for
soft-starters in section 3.4, arriving here from a different direction.

## 9.3 Worked example: loaded, and then generating

**Pulling a load.** Attach a constant opposing force of
$6.0\\ \\mathrm{N}$. In steady state the thrust must match it, so

$$i = \\frac{6.0}{0.40} = 15\\ \\mathrm{A} \\qquad e = 24 - 15 \\times 0.40 = 18\\ \\mathrm{V} \\qquad v = \\frac{18}{0.40} = 45\\ \\mathrm{m/s}$$

$$P_{\\mathrm{mech}} = 6.0 \\times 45 = 270\\ \\mathrm{W} \\qquad P_{\\mathrm{in}} = 24 \\times 15 = 360\\ \\mathrm{W} \\qquad P_{R} = 225 \\times 0.40 = 90\\ \\mathrm{W}$$

and $270 + 90 = 360$, so the ledger closes. Efficiency is
$270/360 = 0.75$, which is also $e/V = 18/24 = 0.75$: **for this machine
efficiency is simply the fraction of the supply that shows up as back-EMF**,
the same result section 3.3 obtained for the rotary machine as the fraction of
no-load speed.

**Driving it backwards.** Now disconnect nothing, but force the bar along at
$80\\ \\mathrm{m/s}$, above its no-load speed:

$$e = 0.40 \\times 80 = 32\\ \\mathrm{V} \\qquad 32 - 24 = 8\\ \\mathrm{V} \\qquad i = \\frac{8}{0.40} = 20\\ \\mathrm{A}$$

The current now flows **out** of the bar and into the supply. The force on the
bar is $0.40 \\times 20 = 8.0\\ \\mathrm{N}$, opposing the motion, so whoever is
pushing must supply $8.0 \\times 80 = 640\\ \\mathrm{W}$. Of that,
$24 \\times 20 = 480\\ \\mathrm{W}$ is returned to the supply and
$400 \\times 0.40 = 160\\ \\mathrm{W}$ is lost in the resistance:
$480 + 160 = 640$. The machine has become a generator without any change of
hardware, wiring or equation -- only the sign of the current changed.

| Mode | $v$ (m/s) | $e$ (V) | $i$ (A) | Force (N) | Mechanical | Electrical |
|---|---|---|---|---|---|---|
| Stall | 0 | 0 | 60 | $+24$ | 0 W | 1440 W in |
| Loaded | 45 | 18 | 15 | $+6.0$ | 270 W out | 360 W in |
| No load | 60 | 24 | 0 | 0 | 0 W | 0 W |
| Generating | 80 | 32 | $-20$ | $-8.0$ | 640 W in | 480 W out |

Read the table down the current column. The current, and with it the force,
changes sign exactly at the no-load speed, and nothing else about the machine
changes at all. **Motoring and generating are the same device on two sides of
one operating point**, which is the single most useful thing to know about any
electric machine.`,
      examTip: 'Whenever a question mixes electrical and mechanical quantities, write the power balance first and solve it for whatever is missing: supply power equals copper loss plus mechanical power, exactly. That one equation replaces most of the algebra, and it works in generating mode too, with the signs of the mechanical and supply terms swapped.',
      importantNote: 'The product B times l appears in BOTH the force law and the EMF law with the same value, so mechanical power out and electrical power converted are the same number by construction. If your two power figures differ, the arithmetic is wrong; there is no loss mechanism inside the conversion itself.',
    },
    {
      id: 'em-transformer-coupling',
      title: '10. The Transformer: Coupling Without Motion',
      content: `## 10.1 The ideal ratios come straight from flux linkage

A transformer is the case of section 7 with nothing moving. Two windings share
one core, so they share one flux, and Faraday's law applied to each gives

$$v_{1} = N_{1}\\frac{d\\Phi}{dt} \\qquad v_{2} = N_{2}\\frac{d\\Phi}{dt} \\qquad\\Rightarrow\\qquad \\frac{v_{1}}{v_{2}} = \\frac{N_{1}}{N_{2}}$$

The current ratio comes from the magnetic circuit rather than from Faraday. The
net drive round the core is the difference of the two sets of ampere-turns, and
it must equal the flux times the reluctance:

$$N_{1}i_{1} - N_{2}i_{2} = \\Phi\\,\\mathcal{R}$$

Let the reluctance go to zero and the right-hand side vanishes, leaving

$$\\frac{i_{1}}{i_{2}} = \\frac{N_{2}}{N_{1}}$$

**The ideal transformer is the zero-reluctance limit of a magnetic circuit.**
Every departure from ideality in a real transformer is a named piece of
reluctance or resistance that this limit threw away: finite $\\mathcal{R}$
becomes magnetising reactance, leakage flux becomes leakage reactance, winding
resistance becomes copper loss, and hysteresis and eddy currents become core
loss.

## 10.2 Worked example: magnetising current, and the price of a stray gap

The magnetising current is the current the primary draws with the secondary
open, and it is set entirely by the reluctance:

$$L_{m} = \\frac{N_{1}^{2}}{\\mathcal{R}} \\qquad X_{m} = \\omega L_{m} \\qquad I_{m} = \\frac{V_{1}}{X_{m}}$$

Take the ring of section 5, 500 turns, on 120 V at 60 Hz, and compare the
ungapped core against the gapped one:

| | Ungapped | With a 1.0 mm gap |
|---|---|---|
| $\\mathcal{R}$ (A/Wb) | $4.7746 \\times 10^{5}$ | $2.4669 \\times 10^{6}$ |
| $L_{m}$ | 523.60 mH | 101.34 mH |
| $X_{m}$ at 60 Hz | 197.392 $\\Omega$ | 38.205 $\\Omega$ |
| $I_{m}$ at 120 V | $120/197.392 = 0.6079$ A | $120/38.205 = 3.141$ A |

The magnetising current rose by $3.141/0.6079 = 5.167$, which is exactly the
ratio of the reluctances, $31/6$. **For a transformer that is a disaster**:
magnetising current is pure overhead, flowing whether or not the secondary is
loaded, filling the winding with copper loss that produces nothing.

The practical version of this is a stacking error. Take a core with mean path
0.50 m, section $6.0\\ \\mathrm{cm}^{2}$, $\\mu_{r} = 4000$, 250 turns, on 120 V
at 60 Hz. Assembled properly, $\\mathcal{R} = 165{,}786\\ \\mathrm{A/Wb}$,
$L_{m} = 0.37699\\ \\mathrm{H}$, $X_{m} = 142.1223\\ \\Omega$ and
$I_{m} = 120/142.1223 = 0.84434\\ \\mathrm{A}$. Now suppose the E and I
laminations are stacked with a 0.2 mm film of burr and varnish between them:

$$\\mathcal{R} = 165{,}720 + 265{,}258 = 430{,}978\\ \\mathrm{A/Wb}$$

$$L_{m} = 0.14502\\ \\mathrm{H} \\qquad X_{m} = 54.671\\ \\Omega \\qquad I_{m} = \\frac{120}{54.671} = 2.195\\ \\mathrm{A}$$

The reluctance ratio is $430978.3/165786.4 = 2.5996$, so **two tenths of a
millimetre of dirt has multiplied the magnetising current by 2.6**. This is why
transformer laminations are interleaved rather than butted, and why a
transformer that hums, runs warm and draws current with nothing connected has a
mechanical fault rather than an electrical one.

## 10.3 Why an inductor wants a gap and a transformer never does

The same gap that ruins a transformer is deliberately designed into a
smoothing choke, and the reason is where the energy sits. Energy density is
$B^{2}/2\\mu$, so at equal flux density the air stores $\\mu_{r}$ times more per
cubic metre than the iron does. Return to the gapped ring of section 5.3, at
$B = 1.0134\\ \\mathrm{T}$:

| Region | Volume | Energy density | Energy |
|---|---|---|---|
| Air gap | $0.40\\ \\mathrm{cm}^{3}$ | $408{,}636\\ \\mathrm{J/m^{3}}$ | 0.163454 J |
| Iron | $240\\ \\mathrm{cm}^{3}$ | $163.45\\ \\mathrm{J/m^{3}}$ | 0.039229 J |
| Total | | | 0.202683 J |

$$0.163454 + 0.039229 = 0.202683\\ \\mathrm{J} \\qquad \\text{and} \\qquad \\tfrac{1}{2}Li^{2} = \\tfrac{1}{2}(0.1013417)(4.0) = 0.202683\\ \\mathrm{J}$$

The field-integral route and the circuit route give the same joule, which is
the check that matters here because the two calculations have almost nothing in
common. And the split is striking: **one six-hundredth of the volume holds 80.6% of
the energy**, since $0.40/240.4 = 1/601$. The ratio of the two energies is
$0.163454/0.039229 = 4.1667$ -- the reluctance ratio again, exactly, because at
constant flux each region stores energy in proportion to its reluctance.

So the two devices have opposite goals built from identical parts:

| | Energy-storage inductor | Transformer |
|---|---|---|
| Wants reluctance | high, and mostly in air | as low as physically possible |
| Gap | designed in, tightly controlled | a defect |
| Stores energy | yes, that is the job | no, storage is pure overhead |
| Saturation behaviour | gap holds $L$ up to high current | avoided by design margin |
| Magnetising current | irrelevant | the figure of merit |

The last row of that table is the exam-ready summary. A gap also **linearises**:
gap reluctance is a constant of geometry and cannot saturate, so a heavily
gapped inductor holds its inductance to far higher currents than an ungapped
one, at the cost of needing more turns to reach the same value in the first
place.`,
      examTip: 'Treat any transformer question as a magnetic-circuit question that has been told to ignore its own reluctance. The turns ratio for voltage comes from the shared flux, the turns ratio for current comes from ampere-turn cancellation, and everything a real transformer does that an ideal one does not is a piece of reluctance or resistance the ideal model dropped.',
      importantNote: 'At the same flux density, an air gap stores roughly mu_r times more energy per unit volume than the iron beside it. In the worked ring, one six-hundredth of the volume holds 80.6 percent of the energy. That single fact explains why energy-storage inductors are gapped on purpose and why the same gap is a manufacturing defect in a transformer.',
    },
    {
      id: 'em-problem-sets',
      title: '11. Problem Sets',
      content: `## Problem Set 11.1 -- Magnetic circuits, inductance and stored energy

Work each one all the way to a number before reading the answer. Take
$\\mu_{0} = 4\\pi \\times 10^{-7}\\ \\mathrm{H/m}$ and neglect leakage and
fringing unless told otherwise.

**Problem 1.** A toroid of mean radius 60 mm and cross-section
$2.5\\ \\mathrm{cm}^{2}$ is wound with 400 turns on a core of
$\\mu_{r} = 1800$, and carries 0.30 A. Find the reluctance, the flux, the flux
density, the inductance and the stored energy. Confirm the energy by a second
formula.

*Answer.* The mean path is $\\ell = 2\\pi(0.060) = 0.37699\\ \\mathrm{m}$, so

$$\\mathcal{R} = \\frac{0.37699}{(4\\pi \\times 10^{-7})(1800)(2.5 \\times 10^{-4})} = 6.6667 \\times 10^{5}\\ \\mathrm{A/Wb}$$

With $\\mathcal{F} = 120\\ \\mathrm{A}$: $\\Phi = 0.18000\\ \\mathrm{mWb}$,
$B = 0.72000\\ \\mathrm{T}$, and $L = N^{2}/\\mathcal{R} = 0.24000\\ \\mathrm{H}$.
The energy is $\\tfrac{1}{2}Li^{2} = 10.800\\ \\mathrm{mJ}$, and the check
$\\tfrac{1}{2}\\Phi^{2}\\mathcal{R}$ gives the same 10.800 mJ.

**Problem 2.** Saw a 0.8 mm gap in that toroid and raise the current to 2.0 A.
Find the flux density and the force pulling the gap shut, then say what mass
that force would hold up.

*Answer.* The iron path shortens to 0.37619 m, giving
$\\mathcal{R}_{\\mathrm{iron}} = 6.6525 \\times 10^{5}$ and
$\\mathcal{R}_{\\mathrm{gap}} = 2.5465 \\times 10^{6}\\ \\mathrm{A/Wb}$, so the
gap carries 79.3% of the drive. With $\\mathcal{F} = 800\\ \\mathrm{A}$:
$\\Phi = 0.24909\\ \\mathrm{mWb}$, $B = 0.99635\\ \\mathrm{T}$ and
$L = 49.817\\ \\mathrm{mH}$. The pull is

$$f = \\frac{B^{2}A}{2\\mu_{0}} = 98.75\\ \\mathrm{N}$$

which the energy method confirms as $-\\tfrac{1}{2}\\Phi^{2}/(\\mu_{0}A)$, the
same 98.75 N. Against $g = 9.80665\\ \\mathrm{m/s^{2}}$ that would hold
$10.069\\ \\mathrm{kg}$.

**Problem 3.** Add a second winding of 150 turns to the gapped toroid of
Problem 2. Find $L_{2}$, $M$, $k$, and the two series readings.

*Answer.* $L_{1} = 49.8174\\ \\mathrm{mH}$ and
$L_{2} = 150^{2}/\\mathcal{R} = 7.0056\\ \\mathrm{mH}$, while
$M = (400)(150)/\\mathcal{R} = 18.6815\\ \\mathrm{mH}$. Since all three come
from one reluctance, $k = 1.0000$ exactly. The series readings are

$$L_{\\mathrm{aid}} = 49.8174 + 7.0056 + 37.3630 = 94.186\\ \\mathrm{mH}$$

$$L_{\\mathrm{opp}} = 49.8174 + 7.0056 - 37.3630 = 19.460\\ \\mathrm{mH}$$

**Problem 4.** Take the shell core of section 5.5 -- centre limb 0.10 m by
$8.0\\ \\mathrm{cm}^{2}$, two outer limbs 0.30 m by $4.0\\ \\mathrm{cm}^{2}$,
$\\mu_{r} = 2000$, 300 turns at 0.40 A -- but cut the 0.5 mm gap into the
**centre** limb instead of an outer one. Find the flux density everywhere, and
explain the result.

*Answer.* Now the gap is in series with everything, so the two outer limbs stay
symmetric and simply parallel to $1.4921 \\times 10^{5}\\ \\mathrm{A/Wb}$. The
gapped centre limb is $5.4685 \\times 10^{5}$, so
$\\mathcal{R} = 6.9605 \\times 10^{5}\\ \\mathrm{A/Wb}$ and
$\\Phi = 0.17240\\ \\mathrm{mWb}$. The centre limb runs at
$B = 0.21550\\ \\mathrm{T}$, and each outer limb carries half the flux through
half the area, so it runs at $0.21550\\ \\mathrm{T}$ too. **Moving the gap to
the centre restores uniform flux density**, at the price of a lower total flux
than the outer-limb version delivered: this is the standard way to gap a shell
core, and the reason the centre limb is made double the area.

## Problem Set 11.2 -- Force, torque and electromechanical conversion

**Problem 1.** A solenoid actuator has 800 turns, a pole face of
$6.0\\ \\mathrm{cm}^{2}$, and a working gap of 1.5 mm. Neglect the iron. At
1.5 A, find the flux density and the pull, and check the pull by a second
route.

*Answer.* $B = \\mu_{0}Ni/x = 1.0053\\ \\mathrm{T}$, and the magnetic pressure
$B^{2}/2\\mu_{0}$ acting on the face gives

$$f = \\frac{(1.0053)^{2}(6.0 \\times 10^{-4})}{2(4\\pi \\times 10^{-7})} = 241.27\\ \\mathrm{N}$$

The energy method, $\\tfrac{1}{2}i^{2}\\mu_{0}N^{2}A/x^{2}$, returns the same
241.27 N. That would hold $24.603\\ \\mathrm{kg}$.

**Problem 2.** A salient rotor has
$L(\\theta) = 80 + 30\\cos 2\\theta$ millihenries and carries a constant 8.0 A.
Find the peak torque and where it occurs, then the mechanical work, the change
in stored energy and the electrical energy exchanged when the rotor is dragged
from aligned to unaligned.

*Answer.* $\\tau = -i^{2}L_{2}\\sin 2\\theta = -(64)(0.030)\\sin 2\\theta$, so the
peak magnitude is $1.9200\\ \\mathrm{N}\\cdot\\mathrm{m}$ at 45 degrees. Over
the quarter turn, $W_{\\mathrm{mech}} = -1.9200\\ \\mathrm{J}$,
$\\Delta W_{f} = \\tfrac{1}{2}i^{2}\\Delta L = -1.9200\\ \\mathrm{J}$ and
$W_{\\mathrm{elec}} = i^{2}\\Delta L = -3.8400\\ \\mathrm{J}$. The ledger reads
$-3.8400 = -1.9200 + (-1.9200)$: half the exchanged energy is mechanical and
half is field, as always at constant current.

**Problem 3.** A rail machine has $B = 0.60\\ \\mathrm{T}$, rails 0.80 m apart,
a 40 V supply, 0.50 ohm loop resistance, a 3.0 kg bar and a constant 4.0 N of
friction. Find the steady-state current, speed and efficiency, and the
acceleration at the instant of switch-on.

*Answer.* $B\\ell = 0.4800\\ \\mathrm{V}\\cdot\\mathrm{s}/\\mathrm{m}$. Steady
state needs thrust equal to friction:

$$i = \\frac{4.0}{0.48} = 8.3333\\ \\mathrm{A} \\qquad e = 40 - 8.3333 \\times 0.50 = 35.833\\ \\mathrm{V} \\qquad v = \\frac{35.833}{0.48} = 74.652\\ \\mathrm{m/s}$$

$$P_{\\mathrm{mech}} = 4.0 \\times 74.652 = 298.61\\ \\mathrm{W} \\qquad P_{\\mathrm{in}} = 40 \\times 8.3333 = 333.33\\ \\mathrm{W} \\qquad P_{R} = 69.4439 \\times 0.50 = 34.722\\ \\mathrm{W}$$

and $298.61 + 34.72 = 333.33\\ \\mathrm{W}$ closes the ledger. Efficiency is
$\\eta = e/V = 35.833/40 = 0.8958$, or 89.58%. At switch-on there is no
back-EMF, so $i = 40/0.50 = 80\\ \\mathrm{A}$, the thrust is
$0.48 \\times 80 = 38.4\\ \\mathrm{N}$, the net force is
$38.4 - 4.0 = 34.4\\ \\mathrm{N}$ and the acceleration is
$34.4/3.0 = 11.467\\ \\mathrm{m/s^{2}}$.

**Problem 4.** A relay has a C-shaped core of iron path 0.18 m and section
$2.0\\ \\mathrm{cm}^{2}$ with $\\mu_{r} = 3000$; the armature closes across
**two** gaps of 0.6 mm each. The coil has 1200 turns. At 0.25 A, find the flux
density and the total pull. Then find the current needed to hold a 12 N return
spring.

*Answer.* The iron contributes $2.3873 \\times 10^{5}$ and the two gaps
together $4.7746 \\times 10^{6}\\ \\mathrm{A/Wb}$, so

$$\\mathcal{R} = 238{,}732 + 4{,}774{,}648 = 5{,}013{,}380\\ \\mathrm{A/Wb}$$

With $\\mathcal{F} = 300\\ \\mathrm{A}$: $\\Phi = 0.059840\\ \\mathrm{mWb}$ and
$B = 0.29920\\ \\mathrm{T}$. Each face pulls
$B^{2}A/2\\mu_{0} = 7.1238\\ \\mathrm{N}$, so the total is
$2 \\times 7.1238 = 14.248\\ \\mathrm{N}$; the energy route,
$\\tfrac{1}{2}\\Phi^{2}\\,d\\mathcal{R}/dx$ with two gaps opening together,
gives the same 14.248 N. Since the circuit is linear, force goes as the square
of the current, so holding 12 N needs

$$i = 0.25\\sqrt{\\frac{12}{14.248}} = 0.22944\\ \\mathrm{A}$$

Note that the relay **drops out** well below the current that pulled it in,
because the gaps close as it operates and the force rises steeply -- the
hysteresis in a relay is geometric, not magnetic.`,
      examTip: 'Every problem in these two sets has the same skeleton: build the reluctance, divide the ampere-turns by it to get flux, divide by area to get B, then either differentiate an inductance or apply B squared over two mu-nought to a face. If a question asks for a force and you have not yet found B, you are not ready to answer it.',
      importantNote: 'When an armature closes TWO gaps at once, both shrink together, so the reluctance derivative carries a factor of two and the total pull is twice the single-face figure. Forgetting the second face halves the answer, and it is the most common error in relay problems.',
    },
  ],
  keyTakeaways: [
    'Motor torque: τ = NBIA·sinθ; maximum when loop perpendicular to field.',
    'Back-EMF: E_back = kω; motor equation: V = IR + E_back.',
    'Generator EMF: ε = NBAω·cos(ωt); higher speed = higher voltage.',
    'Strain gauge: ΔR/R = GF·ε (GF ≈ 2); thermistor: exponential R(T).',
    'Wheatstone bridge: balance condition R₁/R₂ = R₃/R₄; detects small ΔR.',
    'Magnetic circuit: F = NI drives Φ against reluctance R = ℓ/(μA), in A/Wb. Series adds, parallel is product over sum.',
    'An air gap dominates: R_gap/R_core = μ_r·g/ℓ_c. One millimetre of air in the worked 0.60 m ring beats all the iron by 25 to 6.',
    'The analogy has no dissipation term. Half Φ²R carries units of joules, not watts — it is the stored energy, not a loss.',
    'Core loss splits by frequency exponent: hysteresis ∝ f (the loop area per cycle), eddy current ∝ d²f²/ρ. Halving lamination thickness quarters the eddy term.',
    'L = N²/R, M = N₁N₂/R, k = M/√(L₁L₂). From a series test, M = (L_aiding − L_opposing)/4 — the factor is four.',
    'Force by the energy method: f = ½i²·dL/dx at constant current, or f = −½Φ²·dR/dx at constant flux. Force always acts to raise inductance.',
    'Direct check on any of those: magnetic pressure B²/(2μ₀) times pole-face area. The worked plunger gives 163.45 N by both routes.',
    'Reluctance torque τ = ½i²·dL/dθ. Over a finite move at constant current, exactly half the electrical energy becomes work and half becomes field.',
    'BLI and BLv carry the same coefficient, so f·v = e·i identically — the conversion itself is lossless.',
    'A gap is designed into an energy-storage inductor and is a defect in a transformer: at equal B, air stores μ_r times the energy density of the iron.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 6 — CIRCUIT ANALYSIS  (7 curriculum IDs)  ·  10 %  ← HIGHEST WEIGHT
 * ══════════════════════════════════════════════════════════════════ */

};
