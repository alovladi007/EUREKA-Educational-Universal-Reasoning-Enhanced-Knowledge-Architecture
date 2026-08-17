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

**Ripple factor r ≈ 1/(4√3 · f · R · C)** (full-wave), and
**r ≈ 1/(2√3 · f · R · C)** (half-wave)

Larger C or larger R (lighter load) = lower ripple. Section 6.4 derives both
forms from the single relation r = ΔV/(2√3·Vdc).`,
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

The standard 1:10 transformer actually delivers 12.0 Vrms, so the real secondary peak is Vpeak = 12.0 × √2 = **16.97 V**, slightly above the 16.65 V the specification demanded. With the capacitor filter,

**Vdc ≈ Vpeak − ΔV/2 − 2·Vdiode = 16.97 − 0.25 − 1.4 ≈ 15.3 V** (acceptable).

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
      {
        id: 'diode-loadline-models',
        title: '5. Load Lines, Iteration, and Choosing a Diode Model',
        content: `## 5.1 A diode circuit is two equations, not one

Every diode problem in this chapter is the same problem wearing different
clothes. Everything except the diode is linear, so Thevenin collapses it to a
source $V_{S}$ behind a resistance $R$, and Kirchhoff's voltage law around that
loop gives a straight line in the current-voltage plane:

$$i = \\frac{V_{S} - v}{R}$$

The device supplies the second relation, and it is the only nonlinear statement
anywhere in the circuit:

$$i = I_{S}\\left(e^{v/(nV_{T})} - 1\\right)$$

Two equations, two unknowns, one crossing. That crossing is the **operating
point**, and everything else in diode analysis — model selection, iteration,
small-signal linearisation — is a strategy for locating it fast enough to be
worth the trouble.

![The exponential diode characteristic and the straight load line for a five volt source behind one kilohm resistor, crossing at 0.577 volts and 4.42 milliamperes. A square marker shows where the constant-drop model places the same operating point, at 4.30 milliamperes.](/courses/fe-ee/figures/elec2-diode-loadline.svg)

Sketch the load line from its two intercepts and you never have to derive it
again. It meets the voltage axis at $v = V_{S}$ (zero current means zero drop
across $R$) and the current axis at $i = V_{S}/R$ (zero diode voltage means the
resistor takes the whole source). For the figure's circuit those intercepts are
5 V and 5 mA. Lay the diode curve across that line and the answer is where they
meet, no algebra required — which is precisely what a three-minute exam
question rewards.

## 5.2 Worked Example — one circuit, three diode models

**Given**: $V_{S} = 5\\ \\mathrm{V}$ in series with $R = 1\\ \\mathrm{k}\\Omega$
and one silicon diode with $I_{S} = 1\\ \\mathrm{pA}$, $n = 1$,
$V_{T} = 26\\ \\mathrm{mV}$. Find the diode current under each model.

**Ideal model** ($v = 0$): the resistor takes the entire source.

$$I = \\frac{5 - 0}{1000} = 5.00\\ \\mathrm{mA}$$

**Constant-drop model** ($v = 0.7\\ \\mathrm{V}$):

$$I = \\frac{5 - 0.7}{1000} = 4.30\\ \\mathrm{mA}$$

**Exponential model**: substitute the load line into the diode law and iterate.
Start from the constant-drop guess, compute the current it implies, then invert
the diode law to get a better voltage:

$$v_{k+1} = nV_{T}\\ln\\!\\left(\\frac{i_{k}}{I_{S}} + 1\\right), \\qquad i_{k} = \\frac{V_{S} - v_{k}}{R}$$

- Start $v_{0} = 0.700\\ \\mathrm{V}$, so $i_{0} = 4.300\\ \\mathrm{mA}$ and $v_{1} = 0.5767\\ \\mathrm{V}$
- Then $i_{1} = 4.4233\\ \\mathrm{mA}$ and $v_{2} = 0.5775\\ \\mathrm{V}$
- Then $i_{2} = 4.4225\\ \\mathrm{mA}$ and $v_{3} = 0.5775\\ \\mathrm{V}$ — converged

**Answer**: the true operating point is $0.5775\\ \\mathrm{V}$ and
$4.4225\\ \\mathrm{mA}$, and two iterations were enough. Notice how fast the
loop settles: the logarithm compresses a 3% current error into a fraction of a
millivolt, which is the same statement as the 60 mV per decade rule from
Section 4.2 read backwards.

| Model | Predicted current | Error against the exponential | When it earns its keep |
|---|---|---|---|
| Ideal short circuit | 5.00 mA | +13.1% | Sketching, and rails far above 0.7 V |
| Constant drop 0.7 V | 4.30 mA | −2.8% | Almost every FE exam problem |
| Exponential, iterated | 4.4225 mA | reference | Low-voltage rails, log-axis questions |

The 2.8% column entry is the whole argument for the constant-drop model. It is
wrong by less than the tolerance of the resistor sitting next to it, and it
costs one subtraction instead of a fixed-point iteration.

## 5.3 Worked Example — the same method on a different rail

**Given**: $V_{S} = 10\\ \\mathrm{V}$, $R = 2.2\\ \\mathrm{k}\\Omega$, same diode.

**Constant drop**: $I = (10 - 0.7)/2200 = 4.2273\\ \\mathrm{mA}$.

**Iterated**: starting from that current,

$$v = 0.026\\ln\\!\\left(\\frac{4.2273\\times 10^{-3}}{10^{-12}}\\right) = 0.5765\\ \\mathrm{V}$$

which returns $i = (10 - 0.5765)/2200 = 4.2834\\ \\mathrm{mA}$, and one more
pass leaves the voltage at $0.5766\\ \\mathrm{V}$.

**Answer**: $0.5766\\ \\mathrm{V}$ and $4.2834\\ \\mathrm{mA}$; the constant-drop
model is now only **1.3%** low, against 2.8% on the 5 V rail. The pattern is
general and worth carrying into the exam: **the constant-drop model gets better
as the supply voltage grows**, because the modelling error is a fixed few tens
of millivolts divided by an ever-larger $V_{S} - v$.

## 5.4 Small-signal (dynamic) resistance

Differentiate the diode law at a bias current $I_{D}$ and invert:

$$\\frac{di}{dv} = \\frac{I_{D}}{nV_{T}} \\qquad \\Longrightarrow \\qquad r_{d} = \\frac{nV_{T}}{I_{D}}$$

This is the resistance the diode presents to a **small** wiggle riding on the
bias, not to the bias itself. At the 4.4225 mA operating point above,

$$r_{d} = \\frac{0.026}{4.4225\\times 10^{-3}} = 5.88\\ \\Omega$$

The number is startlingly small next to the 1 kΩ in series with it, and that
disparity is the entire mechanism behind limiters, clamps, and diode-based
references: a device carrying milliamperes behaves like a few ohms to signals,
so it pins a node without dissipating much.

## 5.5 Worked Example — a diode as a ripple filter

**Given**: a diode biased at $I_{D} = 20\\ \\mathrm{mA}$ through a
$470\\ \\Omega$ resistor from a supply that carries 50 mV peak-to-peak of
ripple. How much ripple appears across the diode?

**Handbook relations**: $r_{d} = V_{T}/I_{D}$, then the ripple divides between
$R$ and $r_{d}$ as an ordinary voltage divider because both are now linear.

**Substitution**:

$$r_{d} = \\frac{0.026}{0.020} = 1.30\\ \\Omega$$

$$\\Delta v_{d} = 50\\ \\mathrm{mV}\\times\\frac{1.30}{470 + 1.30} = 0.138\\ \\mathrm{mV}$$

**Answer**: 0.14 mV, an attenuation of 362 to 1. The diode has not "filtered"
anything in the capacitor sense — no energy is stored — it has simply refused
to change its voltage, and its 1.3 Ω dynamic resistance is the quantitative
form of that refusal. Raise the bias to 200 mA and $r_{d}$ falls to 0.13 Ω,
tightening the clamp by another factor of ten. That is why reference strings
are run at the highest current the power budget tolerates.`,
        examTip: 'When a problem gives you a saturation current and asks for a real operating point, do not try to solve the transcendental equation. Start at 0.7 V, compute the loop current, take the logarithm to get a better voltage, and repeat. Two passes are always enough at exam precision, and the first pass alone is usually within 1%.',
        importantNote: 'Do not confuse the DC resistance V/I with the dynamic resistance nVt/I. At 4.42 mA the diode of Section 5.2 has a DC resistance of 0.5775/0.0044225 = 131 Ω but a dynamic resistance of only 5.88 Ω. Bias calculations use the first; ripple, clamp, and small-signal calculations use the second.',
      },
      {
        id: 'diode-rectifier-waveforms',
        title: '6. Rectifier Waveforms: Averages, RMS, Ripple, and Diode Current',
        content: `## 6.1 Where the π comes from

The half-wave and full-wave DC formulas quoted in Section 1.2 are just the
average value of the plotted waveform, and deriving them once removes any need
to memorise which one carries the 2:

$$V_{dc,\\mathrm{half}} = \\frac{1}{2\\pi}\\int_{0}^{\\pi}V_{m}\\sin\\theta\\ d\\theta = \\frac{V_{m}}{\\pi}$$

$$V_{dc,\\mathrm{full}} = \\frac{1}{\\pi}\\int_{0}^{\\pi}V_{m}\\sin\\theta\\ d\\theta = \\frac{2V_{m}}{\\pi}$$

The integrand is identical. Only the averaging window differs: the half-wave
circuit spreads one hump over a full period, the full-wave circuit fits two
humps into the same period. That is the entire factor of two.

![Half-wave and full-wave rectified outputs of the same seventeen volt peak sine, drawn over two periods, with dashed horizontal lines at their computed averages of 5.41 volts and 10.82 volts.](/courses/fe-ee/figures/elec2-rect-waveforms.svg)

For the figure's $V_{m} = 17\\ \\mathrm{V}$:

$$V_{dc,\\mathrm{half}} = \\frac{17}{\\pi} = 5.41\\ \\mathrm{V}, \\qquad V_{dc,\\mathrm{full}} = \\frac{2\\times 17}{\\pi} = 10.82\\ \\mathrm{V}$$

## 6.2 RMS, form factor, and the unfiltered ripple factor

The same integrals in the mean-square give the RMS values, and here the two
circuits differ by $\\sqrt{2}$ rather than 2:

$$V_{rms,\\mathrm{half}} = \\sqrt{\\frac{1}{2\\pi}\\int_{0}^{\\pi}V_{m}^{2}\\sin^{2}\\theta\\ d\\theta} = \\frac{V_{m}}{2}$$

$$V_{rms,\\mathrm{full}} = \\frac{V_{m}}{\\sqrt{2}}$$

Split the output into its DC part and everything else, and the "everything
else" is the ripple. Because the two parts are orthogonal, their squares add:

$$V_{ac,rms} = \\sqrt{V_{rms}^{2} - V_{dc}^{2}} \\qquad \\Longrightarrow \\qquad r = \\frac{V_{ac,rms}}{V_{dc}} = \\sqrt{\\left(\\frac{V_{rms}}{V_{dc}}\\right)^{2} - 1}$$

## 6.3 Worked Example — ripple factor with no filter at all

**Given**: an unfiltered half-wave rectifier and an unfiltered full-wave
bridge, both from the same sinusoid. Find the ripple factor of each.

**Half-wave**: the ratio $V_{rms}/V_{dc} = (V_{m}/2)/(V_{m}/\\pi) = \\pi/2 = 1.5708$, so

$$r_{\\mathrm{half}} = \\sqrt{1.5708^{2} - 1} = \\sqrt{1.4674} = 1.211$$

**Full-wave**: the ratio is $(V_{m}/\\sqrt{2})/(2V_{m}/\\pi) = \\pi/(2\\sqrt{2}) = 1.1107$, so

$$r_{\\mathrm{full}} = \\sqrt{1.1107^{2} - 1} = \\sqrt{0.2337} = 0.483$$

**Answer**: **121.1%** and **48.3%**. Both are useless as DC, which is the
point — an unfiltered rectifier output has more AC in it than DC in the
half-wave case. The same ratio also gives the classic efficiency figures, since
$\\eta = (V_{dc}/V_{rms})^{2}$ evaluates to 40.5% and 81.1%, the numbers already
tabulated in Section 1.2.

## 6.4 The capacitor filter, from discharge to ripple factor

Add a reservoir capacitor and the output no longer follows the sine. It tracks
the peak, then coasts downward on the load current until the next peak
recharges it. Treating that coast as a straight line — accurate when the ripple
is small, which is the design intent — the charge lost between peaks is
$I_{dc}\\Delta t$ and the resulting voltage sag is:

$$\\Delta V = \\frac{I_{dc}\\Delta t}{C} = \\frac{I_{dc}}{kfC}$$

with $k = 1$ for half-wave (one peak per cycle) and $k = 2$ for full-wave (two
peaks per cycle). Written out:

$$\\Delta V_{\\mathrm{half}} = \\frac{I_{dc}}{fC}, \\qquad \\Delta V_{\\mathrm{full}} = \\frac{I_{dc}}{2fC}$$

![Peak-to-peak ripple against filter capacitance for both rectifier types at 150 milliamperes of load and 60 hertz, with marked points at 1000, 2500 and 3300 microfarads and a dashed line at the half-volt design limit.](/courses/fe-ee/figures/elec2-ripple-vs-c.svg)

The coasting waveform is very nearly a triangle, and a triangle's RMS deviation
from its own mean is its peak-to-peak height divided by $2\\sqrt{3}$. Divide by
$V_{dc} = I_{dc}R_{L}$ and the ripple factor drops out:

$$r = \\frac{\\Delta V}{2\\sqrt{3}\\,V_{dc}} \\qquad \\Longrightarrow \\qquad r_{\\mathrm{full}} = \\frac{1}{4\\sqrt{3}fR_{L}C}, \\qquad r_{\\mathrm{half}} = \\frac{1}{2\\sqrt{3}fR_{L}C}$$

Both formulas fall out of the same line, which is the safest way to keep them
straight: the full-wave version carries the extra 2 because its capacitor is
recharged twice as often.

## 6.5 Worked Example — sizing the reservoir capacitor

**Given**: a full-wave bridge on a 60 Hz line delivering
$I_{dc} = 150\\ \\mathrm{mA}$ at $V_{dc} = 15\\ \\mathrm{V}$. Ripple must not
exceed 0.5 V peak-to-peak.

**Handbook relation**: $C = I_{dc}/(2f\\Delta V)$.

**Substitution**:

$$C = \\frac{0.150}{2\\times 60\\times 0.5} = 2500\\ \\mu\\mathrm{F}$$

Choosing the next standard value, 3300 μF, the delivered ripple improves to

$$\\Delta V = \\frac{0.150}{2\\times 60\\times 3300\\times 10^{-6}} = 0.379\\ \\mathrm{V}$$

**Answer**: 2500 μF is the minimum, 3300 μF is the part to buy, and the ripple
factor at the standard value is

$$r = \\frac{0.379}{2\\sqrt{3}\\times 15} = 0.0073 = 0.73\\%$$

Both marked points sit on the figure's full-wave curve. Note the shape of that
curve: ripple falls as $1/C$, so the first 1000 μF buys far more improvement
than the tenth. Doubling from 2500 μF to 5000 μF only halves an already small
number, which is why filter design stops at "good enough" and hands the rest of
the job to a regulator.

## 6.6 The diode current nobody computes until it fails

A capacitor-filtered rectifier draws current only while the incoming sine is
above the capacitor voltage. That window is narrow, and since the whole cycle's
charge must move through it, the diode current inside the window is large.
Conduction begins where the sine crosses the bottom of the ripple:

$$\\sin\\phi_{1} = 1 - \\frac{\\Delta V}{V_{m}}$$

and ends at the peak. During conduction the output rides the sine, so the
capacitor current is $C\\,dv/dt$ and the diode carries that plus the load:

$$i_{D,\\mathrm{peak}} = \\omega C V_{m}\\cos\\phi_{1} + I_{dc}$$

## 6.7 Worked Example — peak repetitive diode current

**Given**: the filtered bridge of Section 6.5 — $V_{m} = 17\\ \\mathrm{V}$,
$C = 2500\\ \\mu\\mathrm{F}$, $\\Delta V = 0.5\\ \\mathrm{V}$,
$I_{dc} = 150\\ \\mathrm{mA}$, $f = 60\\ \\mathrm{Hz}$.

**Substitution**:

$$\\sin\\phi_{1} = 1 - \\frac{0.5}{17} = 0.9706 \\qquad \\Longrightarrow \\qquad \\phi_{1} = 76.07^{\\circ}$$

The conduction window is therefore $90 - 76.07 = 13.93^{\\circ}$ of each
half-cycle, or **7.7%** of the time. With
$\\omega = 2\\pi(60) = 377\\ \\mathrm{rad/s}$ and $\\cos\\phi_{1} = 0.2407$:

$$i_{D,\\mathrm{peak}} = 377\\times 2500\\times 10^{-6}\\times 17\\times 0.2407 + 0.150 = 4.01\\ \\mathrm{A}$$

**Answer**: **4.0 A peak**, from a circuit whose load draws 150 mA — a ratio of
27 to 1. This is why rectifier diodes are specified by repetitive surge current
as well as average current, why the transformer must be rated on RMS winding
current rather than DC output, and why a bigger filter capacitor is not free:
raising C lowers ripple, which narrows $\\phi_{1}$, which drives the peak
current up.

## 6.8 Six-pulse three-phase, where the ripple nearly disappears

A three-phase bridge produces six output humps per cycle from the difference of
the largest and smallest phase voltages. The output never falls below
$1.5V_{m}$ and never rises above $\\sqrt{3}V_{m}$:

$$V_{dc,6p} = \\frac{3\\sqrt{3}}{\\pi}V_{m} = 1.654\\,V_{m}$$

![Single-phase full-wave and six-pulse three-phase rectified outputs over one cycle in per-unit peak phase voltage, with their computed averages of 0.637 and 1.654 marked, and the six-pulse output never dropping below 1.500.](/courses/fe-ee/figures/elec2-rectifier-ripple.svg)

| Quantity | Half-wave | Full-wave bridge | Six-pulse three-phase |
|---|---|---|---|
| DC output | 0.318 Vm | 0.637 Vm | 1.654 Vm |
| RMS output | 0.500 Vm | 0.707 Vm | 1.655 Vm |
| Form factor | 1.571 | 1.111 | 1.001 |
| Ripple factor, no filter | 121.1% | 48.3% | 4.20% |
| Ripple frequency | f | 2f | 6f |
| Conversion efficiency | 40.5% | 81.1% | 99.8% |

## 6.9 Worked Example — a six-pulse output without a filter

**Given**: a three-phase bridge fed from phase voltages of
$V_{m} = 17\\ \\mathrm{V}$ peak. Find the DC output, the peak-to-peak ripple,
and the ripple frequency on a 60 Hz supply.

**Substitution**:

$$V_{dc} = 1.654\\times 17 = 28.12\\ \\mathrm{V}$$

$$\\Delta V_{pp} = (\\sqrt{3} - 1.5)\\times 17 = 0.23205\\times 17 = 3.94\\ \\mathrm{V}$$

$$f_{ripple} = 6\\times 60 = 360\\ \\mathrm{Hz}$$

**Answer**: 28.12 V with 3.94 V of peak-to-peak ripple — 14.0% of the mean —
riding at 360 Hz, and a ripple factor of only 4.20% with **no capacitor
anywhere in the circuit**. Compare that to the single-phase bridge's 48.3% on
the same row of the table. The six-pulse rectifier is the reason industrial DC
buses run three-phase: the filter it needs is roughly a tenth the size, and the
360 Hz it does need to filter is six times easier to remove than 60 Hz.`,
        examTip: 'Two conversions cause more lost marks than every formula in this section combined. First, Vpeak = √2 · Vrms, never 2 · Vrms. Second, the ripple formula wants the DC LOAD current, not the RMS transformer current. Write Vm and Idc on the page before touching a rectifier formula and the rest is substitution.',
        importantNote: 'The exam-standard ripple factor for a capacitor-filtered FULL-WAVE rectifier is r = 1/(4√3·f·R·C). The 1/(2√3·f·R·C) form is the HALF-WAVE result. Both come from the single relation r = ΔV/(2√3·Vdc); the difference is only whether ΔV carries a 2 in its denominator.',
      },
      {
        id: 'diode-limiters-regulation',
        title: '7. Clippers, Clampers, Multipliers, and Regulation That Is Not Ideal',
        content: `## 7.1 A clipper is a transfer characteristic

Section 2.2 described clippers in words. The honest description is a graph of
output against input, because a clipper is defined entirely by where its slope
changes. Between the breakpoints every diode is off, the circuit is a wire, and
the slope is exactly one. Outside them a diode conducts and the output follows
the branch that turned on.

![Transfer characteristic of a double-ended biased clipper: unity slope between minus 2.7 and plus 3.7 volts, and a nearly flat slope of 0.006 outside those breakpoints, plotted against the dashed unity-slope line.](/courses/fe-ee/figures/elec2-clipper-transfer.svg)

For a shunt branch made of a diode in series with a bias source $V_{B}$, the
breakpoint sits one diode drop beyond the bias:

$$V_{clip} = V_{B} + 0.7\\ \\mathrm{V}$$

The clipped segments in the figure are not perfectly flat, and the reason is
Section 5.4. A conducting diode is not a short; it is its dynamic resistance
$r_{d}$, which forms a divider with the series resistor $R$:

$$\\text{slope}_{clipped} = \\frac{r_{d}}{R + r_{d}}$$

## 7.2 Worked Example — reading the double-ended clipper

**Given**: the figure's circuit — $R = 1\\ \\mathrm{k}\\Omega$ in series, one
branch of a diode plus a $+3.0\\ \\mathrm{V}$ source, a second branch of a
reversed diode plus a $-2.0\\ \\mathrm{V}$ source, conducting-diode dynamic
resistance $r_{d} = 6\\ \\Omega$. The input is an 8 V peak sine.

**Breakpoints**:

$$V_{clip,+} = 3.0 + 0.7 = 3.7\\ \\mathrm{V}, \\qquad V_{clip,-} = -(2.0 + 0.7) = -2.7\\ \\mathrm{V}$$

**Slope beyond the breakpoints**:

$$\\frac{r_{d}}{R + r_{d}} = \\frac{6}{1006} = 0.00596$$

**Output extremes**:

$$v_{o,\\max} = 3.7 + (8 - 3.7)(0.00596) = 3.726\\ \\mathrm{V}$$

$$v_{o,\\min} = -2.7 + (-8 + 2.7)(0.00596) = -2.732\\ \\mathrm{V}$$

**Answer**: a 16 V peak-to-peak input leaves as 6.46 V peak-to-peak, with the
positive side flattened at 3.73 V and the negative at −2.73 V. The extra
26 mV and 32 mV above the ideal breakpoints are the dynamic resistance showing
itself; an ideal-diode answer of exactly 3.7 and −2.7 is correct to within 1%,
which is why the exam accepts it — but a clipper built to hold a logic
threshold within 20 mV cannot ignore that term.

## 7.3 Clampers: the capacitor remembers, the diode enforces

A clamper puts a capacitor **in series** with the signal and a diode **across**
the output. On the first few cycles the diode conducts on whichever peak it
faces, charging the capacitor until that peak can no longer push the output
past the diode's threshold. From then on the capacitor is a fixed battery in
series with the source, and the output is the input shifted bodily:

$$v_{o}(t) = v_{i}(t) - V_{C}, \\qquad V_{C} = V_{m} - 0.7\\ \\mathrm{V}$$

Nothing about the shape changes. The peak-to-peak stays $2V_{m}$, the harmonic
content is untouched, and only the average moves — which is precisely the
opposite of what a clipper does, and the distinction the exam checks.

## 7.4 Worked Example — the output range of a negative clamper

**Given**: a 10 V peak, 60 Hz sine through a series capacitor into a node with
a silicon diode to ground, oriented so it conducts when the output tries to go
positive. Load resistance $R_{L} = 10\\ \\mathrm{k}\\Omega$, $C = 100\\ \\mu\\mathrm{F}$.

**Capacitor charge**: at the positive input peak the diode pins the output at
$+0.7\\ \\mathrm{V}$, so

$$V_{C} = 10 - 0.7 = 9.3\\ \\mathrm{V}$$

**Output extremes**:

$$v_{o,\\max} = +10 - 9.3 = +0.7\\ \\mathrm{V}, \\qquad v_{o,\\min} = -10 - 9.3 = -19.3\\ \\mathrm{V}$$

**Average**: $(0.7 - 19.3)/2 = -9.3\\ \\mathrm{V}$.

**Droop check**: the time constant is
$R_{L}C = 10^{4}\\times 10^{-4} = 1.0\\ \\mathrm{s}$ against a period of
16.67 ms, so between refreshes the capacitor loses

$$\\Delta V_{C} \\approx V_{C}\\frac{T}{R_{L}C} = 9.3\\times\\frac{0.01667}{1.0} = 0.155\\ \\mathrm{V}$$

**Answer**: the waveform still swings 20 V peak-to-peak, exactly as it did at
the input, but now runs from +0.7 V down to −19.3 V about a −9.3 V average,
with 0.16 V of droop. The design rule behind that last line is the one to carry
into the exam: **the clamper time constant must be long compared with the
signal period**, typically at least ten periods, or the shifted waveform sags
visibly between cycles.

## 7.5 Voltage multipliers

A half-wave voltage doubler is a clamper followed by a peak detector. The
clamping stage lifts the waveform so its negative excursion sits near ground
and its positive excursion reaches $2V_{m}$; the second diode and capacitor
then hold that peak. Each silicon diode costs its own drop:

$$V_{out} \\approx 2V_{m} - 2(0.7)\\ \\mathrm{V}$$

The cost is regulation. Multipliers have no low-impedance path to the source —
the output is supported only by capacitors — so their output voltage sags
quickly with load current, which is why they appear in high-voltage, low-current
applications and essentially nowhere else.

## 7.6 Worked Example — a half-wave doubler

**Given**: a 24 Vrms, 60 Hz secondary driving a half-wave doubler with two
silicon diodes and a light load.

**Substitution**:

$$V_{m} = 24\\sqrt{2} = 33.94\\ \\mathrm{V}$$

$$V_{out} = 2(33.94) - 1.4 = 66.48\\ \\mathrm{V}$$

**Answer**: about 66.5 V from a 24 V winding, with each diode seeing a reverse
voltage of $2V_{m} = 67.88\\ \\mathrm{V}$, so a 100 V part is the minimum
sensible choice. The trap in this problem is answering 48 V by doubling the RMS
value instead of the peak — a multiplier multiplies **peaks**, and the RMS-to-peak
conversion has to happen first.

## 7.7 The Zener that is not ideal

Section 2.1 treated the Zener as a perfect 5.1 V battery. A real one has a
slope, quoted on datasheets as the dynamic impedance $r_{z}$, typically a few
ohms to a few tens of ohms:

$$V_{Z} = V_{Z0} + r_{z}I_{Z}$$

$V_{Z0}$ is the extrapolated intercept, not the nameplate voltage. A 5.1 V part
specified at a 20 mA test current with $r_{z} = 10\\ \\Omega$ has

$$V_{Z0} = 5.1 - (10)(0.020) = 4.90\\ \\mathrm{V}$$

With that model the regulator becomes an ordinary linear circuit, and two
figures of merit fall straight out of it. **Line regulation** is the fraction
of an input change that survives to the output:

$$\\frac{\\Delta V_{o}}{\\Delta V_{in}} = \\frac{1}{1 + R_{s}/r_{z} + R_{s}/R_{L}}$$

**Load regulation** is governed by the output resistance seen by the load:

$$R_{out} = R_{s}\\parallel r_{z}$$

And below a certain input the Zener simply stops conducting, leaving a bare
resistive divider:

$$V_{in,\\mathrm{dropout}} = V_{Z0}\\frac{R_{s} + R_{L}}{R_{L}}$$

![Regulator output voltage against input voltage from 2 to 18 volts, showing the steep unregulated divider line below the 6.34 volt dropout and the nearly flat regulated branch rising only 61 millivolts per input volt above it.](/courses/fe-ee/figures/elec2-zener-line-regulation.svg)

## 7.8 Worked Example — line and load regulation with real numbers

**Given**: the Section 4.5 regulator — $R_{s} = 150\\ \\Omega$,
$R_{L} = 510\\ \\Omega$, 5.1 V Zener at 20 mA with $r_{z} = 10\\ \\Omega$, so
$V_{Z0} = 4.90\\ \\mathrm{V}$.

**Line regulation**:

$$\\frac{\\Delta V_{o}}{\\Delta V_{in}} = \\frac{1}{1 + 150/10 + 150/510} = \\frac{1}{16.29} = 0.0614$$

A 1 V peak-to-peak ripple riding on the input therefore appears at the output
as **61 mV** peak-to-peak. Remove the Zener and the same node is a plain
divider passing $510/660 = 0.773$, or **773 mV** — a factor of 12.6 worse.

**Load regulation**:

$$R_{out} = \\frac{150\\times 10}{160} = 9.375\\ \\Omega$$

The load draws 10.3 mA, so disconnecting it raises the output by
$9.375\\times 0.0103 = 96\\ \\mathrm{mV}$, from 5.247 V to 5.344 V.

**Dropout**:

$$V_{in,\\mathrm{dropout}} = 4.90\\times\\frac{660}{510} = 6.34\\ \\mathrm{V}$$

**Answer**: the regulator holds roughly 5.25 V, not the nameplate 5.10 V,
because the 34.7 mA of Zener current adds $r_{z}I_{Z} = 0.347\\ \\mathrm{V}$ to
$V_{Z0}$. It attenuates input ripple 16-fold, shifts 96 mV when the load
disconnects, and collapses into an unregulated divider below 6.34 V of input.
The ideal-Zener analysis of Section 4.5 got the current right to within 4% —
36 mA against 34.7 mA — which is why the exam teaches it. But every
specification a datasheet actually quotes lives in the $r_{z}$ term, and none
of them can be computed with a perfect-battery model.`,
        examTip: 'Clipper questions reduce to two numbers: the breakpoint (bias plus 0.7 V) and the slope on each side (1 inside, near 0 outside). Clamper questions reduce to two different numbers: the capacitor voltage (peak minus 0.7 V) and the unchanged peak-to-peak swing. Deciding which of the two circuits you are looking at — series capacitor means clamper — is most of the work.',
        importantNote: 'A Zener regulator output is not the nameplate voltage. It is Vz0 + rz·Iz, and Iz changes with both line and load. In the worked regulator above the output reads 5.25 V rather than 5.10 V at nominal input, and moves another 96 mV when the load is removed. Ideal-Zener answers are fine for currents and power, but never for output tolerance.',
      },
      {
        id: 'diode-practice-problems',
        title: '8. Practice Problems with Full Solutions',
        content: `## 8.1 How to work these

Work every problem on paper with the handbook and a calculator before reading
the solutions. Each is sized for about three minutes, which is the pace the FE
demands, and each solution names the distractor a hurried candidate lands on.
Unless a problem says otherwise, diodes are silicon with a 0.7 V constant drop
and the line frequency is 60 Hz.

## 8.2 Problem Set A — Rectifiers, Filters, and Waveform Numbers

**A1.** A 24 Vrms secondary drives a single-diode half-wave rectifier into a
resistive load. Ignoring the diode drop, what is the average output voltage?

**A2.** An 18 Vrms secondary drives a full-wave bridge into a resistive load.
Using the constant-drop model, what is the average output voltage?

**A3.** The bridge of A2 now supplies 250 mA of DC load current through a
2200 μF reservoir capacitor. What is the peak-to-peak ripple voltage, and at
what frequency does it appear?

**A4.** A centre-tapped full-wave rectifier is fed from a 36 Vrms
centre-tapped secondary (18 Vrms from centre tap to each end). What peak
inverse voltage must each diode withstand?

**A5.** For the filtered supply of A3, what is the ripple factor?

**A6.** What is the ripple factor of an **unfiltered** full-wave bridge
output?

**A7.** A full-wave bridge with a 17 V peak secondary, a 2500 μF capacitor and
150 mA of DC load current has 0.5 V of peak-to-peak ripple. Estimate the peak
repetitive current in each conducting diode.

## 8.3 Set A Solutions

**A1 — 10.80 V.** Convert first: $V_{m} = 24\\sqrt{2} = 33.94\\ \\mathrm{V}$, then

$$V_{dc} = \\frac{V_{m}}{\\pi} = \\frac{33.94}{\\pi} = 10.80\\ \\mathrm{V}$$

*Traps*: dividing the RMS value by π gives 7.64 V — that is the answer for
someone who never converted to peak. Using the full-wave formula gives 21.61 V,
exactly double, and it is always offered as a choice.

**A2 — 15.31 V.** $V_{m} = 18\\sqrt{2} = 25.46\\ \\mathrm{V}$. Two diodes
conduct in series on every half-cycle, so the peak reaching the load is
$25.46 - 1.4 = 24.06\\ \\mathrm{V}$:

$$V_{dc} = \\frac{2(25.46 - 1.4)}{\\pi} = 15.31\\ \\mathrm{V}$$

*Trap*: forget the 1.4 V bridge drop and you get $2(25.46)/\\pi = 16.21\\ \\mathrm{V}$.
That 0.9 V gap is small enough to look like a rounding difference and large
enough to be a separate multiple-choice option.

**A3 — 0.947 V at 120 Hz.** Full-wave means two charging events per cycle:

$$\\Delta V = \\frac{I_{dc}}{2fC} = \\frac{0.250}{2(60)(2200\\times 10^{-6})} = 0.947\\ \\mathrm{V}$$

*Trap*: the half-wave form $I_{dc}/(fC)$ returns 1.894 V, precisely twice the
right answer. The ripple frequency is $2f = 120\\ \\mathrm{Hz}$, not 60 Hz —
a second, independent place the same mistake shows up.

**A4 — 50.9 V, so specify 100 V parts.** Each half-winding peaks at
$18\\sqrt{2} = 25.46\\ \\mathrm{V}$. When one diode conducts, the other sits
across both half-windings in series:

$$PIV = 2V_{m} = 2(25.46) = 50.9\\ \\mathrm{V}$$

*Trap*: answering 25.5 V by importing the **bridge** result. The bridge splits
reverse voltage between two series diodes, so its PIV is $V_{m}$; the
centre-tapped topology does not, and that difference is the main reason bridges
dominate despite needing four diodes.

**A5 — 1.78%.** The load resistance implied by A2 and A3 is
$R_{L} = 15.31/0.250 = 61.2\\ \\Omega$. Either route works:

$$r = \\frac{\\Delta V}{2\\sqrt{3}V_{dc}} = \\frac{0.947}{2\\sqrt{3}(15.31)} = 0.0179$$

$$r = \\frac{1}{4\\sqrt{3}fR_{L}C} = \\frac{1}{4\\sqrt{3}(60)(61.3)(2200\\times 10^{-6})} = 0.0178$$

*Trap*: using $1/(2\\sqrt{3}fR_{L}C)$ doubles the answer to 3.57%. That form is
the half-wave result, and it is printed in enough references to be a genuinely
common error.

**A6 — 48.3%.** With no capacitor, use the RMS-to-DC ratio directly:

$$r = \\sqrt{\\left(\\frac{V_{m}/\\sqrt{2}}{2V_{m}/\\pi}\\right)^{2} - 1} = \\sqrt{1.1107^{2} - 1} = 0.483$$

*Trap*: 121% is the half-wave figure. Note also that A5 and A6 describe the
same rectifier — the capacitor is what takes 48.3% down to 1.78%.

**A7 — about 4.0 A.** Conduction starts where the sine crosses the bottom of
the ripple:

$$\\sin\\phi_{1} = 1 - \\frac{0.5}{17} = 0.9706 \\quad \\Longrightarrow \\quad \\phi_{1} = 76.07^{\\circ}$$

so the diodes conduct for only 13.93° of each half-cycle. With
$\\omega = 377\\ \\mathrm{rad/s}$ and $\\cos\\phi_{1} = 0.2407$:

$$i_{D,\\mathrm{peak}} = \\omega CV_{m}\\cos\\phi_{1} + I_{dc} = 3.86 + 0.15 = 4.01\\ \\mathrm{A}$$

*Trap*: answering 150 mA, the DC load current, or 300 mA on the theory that
each diode pair carries half the cycle. Average and peak differ by a factor of
27 here, and the datasheet parameter that matters for survival is the peak.

## 8.4 Problem Set B — Regulators, Limiters, and Real Diodes

**B1.** A 10 V source in series with 2.2 kΩ drives one silicon diode
($I_{S} = 1\\ \\mathrm{pA}$, $n = 1$, $V_{T} = 26\\ \\mathrm{mV}$). Find the
current using the constant-drop model, then using the exponential model.

**B2.** A 20 V supply feeds a 12 V Zener through $R_{s} = 220\\ \\Omega$ with
a 1 kΩ load. Find the Zener current and power, then repeat with the load
disconnected.

**B3.** A regulator has $R_{s} = 150\\ \\Omega$, $R_{L} = 510\\ \\Omega$ and a
Zener with $r_{z} = 10\\ \\Omega$. How much of a 1 V peak-to-peak input ripple
reaches the output?

**B4.** For the same regulator, by how much does the output voltage rise when
the 10.3 mA load is disconnected?

**B5.** A double-ended clipper uses a +3.0 V branch and a −2.0 V branch with
silicon diodes and a 1 kΩ series resistor. An 8 V peak sine is applied. What
are the output extremes?

**B6.** A diode drops 0.70 V at 25 °C. Estimate its drop at 85 °C and the
factor by which its reverse leakage grows.

**B7.** A half-wave voltage doubler runs from a 24 Vrms secondary with silicon
diodes. Find the no-load output and the required diode PIV.

**B8.** A six-pulse three-phase bridge is fed from 17 V peak phase voltages on
a 60 Hz supply. Find the DC output, the peak-to-peak ripple and the ripple
frequency.

## 8.5 Set B Solutions

**B1 — 4.227 mA and 4.283 mA.** Constant drop first:

$$I = \\frac{10 - 0.7}{2200} = 4.227\\ \\mathrm{mA}$$

Then iterate the exponential once from that current:

$$v = 0.026\\ln\\!\\left(\\frac{4.227\\times 10^{-3}}{10^{-12}}\\right) = 0.5765\\ \\mathrm{V} \\quad \\Longrightarrow \\quad I = \\frac{10 - 0.577}{2200} = 4.283\\ \\mathrm{mA}$$

*Trap*: the ideal-diode answer 10/2200 = 4.545 mA is 6% high, roughly five
times the constant-drop error. On a 10 V rail the constant-drop model is worth
its one extra subtraction.

**B2 — 24.4 mA and 0.292 W loaded; 36.4 mA and 0.436 W unloaded.**

$$I_{s} = \\frac{20 - 12}{220} = 36.4\\ \\mathrm{mA}, \\qquad I_{L} = \\frac{12}{1000} = 12.0\\ \\mathrm{mA}$$

$$I_{Z} = 36.4 - 12.0 = 24.4\\ \\mathrm{mA}, \\qquad P_{Z} = 12(0.0244) = 0.292\\ \\mathrm{W}$$

Disconnect the load and all 36.4 mA passes through the Zener:
$P_{Z} = 12(0.0364) = 0.436\\ \\mathrm{W}$.

*Trap*: sizing the part from the 0.292 W loaded figure and specifying a 0.4 W
Zener. The circuit destroys it the first time the load is unplugged. No-load is
always the worst case for Zener dissipation.

**B3 — 61 mV.**

$$\\frac{\\Delta V_{o}}{\\Delta V_{in}} = \\frac{1}{1 + 150/10 + 150/510} = 0.0614$$

so $1\\ \\mathrm{V}\\times 0.0614 = 61\\ \\mathrm{mV}$ peak-to-peak survives.

*Trap*: answering zero because "the Zener holds the voltage constant." It does
not; it holds it to within $r_{z}$. The same circuit without the Zener would
pass 773 mV, so the device buys a factor of 12.6, not infinity.

**B4 — 96 mV.** The load sees the source resistance

$$R_{out} = R_{s}\\parallel r_{z} = \\frac{150(10)}{160} = 9.375\\ \\Omega$$

$$\\Delta V_{o} = R_{out}I_{L} = 9.375(0.0103) = 0.096\\ \\mathrm{V}$$

*Trap*: using $R_{s} = 150\\ \\Omega$ alone gives 1.54 V, sixteen times too
large. The Zener's low dynamic impedance sits in parallel with the series
resistor and dominates it.

**B5 — +3.73 V and −2.73 V.** Breakpoints are one diode drop past each bias, at
+3.7 V and −2.7 V. The conducting branch presents $r_{d} \\approx 6\\ \\Omega$
against the 1 kΩ series resistor, a slope of 0.00596, so

$$v_{o,\\max} = 3.7 + (8 - 3.7)(0.00596) = 3.73\\ \\mathrm{V}$$

$$v_{o,\\min} = -2.7 + (-8 + 2.7)(0.00596) = -2.73\\ \\mathrm{V}$$

*Trap*: answering +3.0 V and −2.0 V by omitting the diode drops. The bias
source sets where the diode **starts** to conduct; the diode itself adds its
0.7 V on top.

**B6 — about 0.58 V, with leakage up 64-fold.** The forward drop falls roughly
2 mV per °C:

$$V_{f}(85\\ ^{\\circ}\\mathrm{C}) = 0.70 - 0.002(85 - 25) = 0.58\\ \\mathrm{V}$$

Reverse leakage roughly doubles every 10 °C, and 60 °C is six doublings:

$$2^{6} = 64$$

*Trap*: adding instead of subtracting, giving 0.82 V. The exponential gets
easier to climb as the junction heats, so the forward drop goes **down** while
the leakage goes **up** — the two move in opposite directions, which is exactly
why the sign is so easy to lose.

**B7 — 66.5 V, PIV 67.9 V.** Peak first:

$$V_{m} = 24\\sqrt{2} = 33.94\\ \\mathrm{V}, \\qquad V_{out} = 2(33.94) - 1.4 = 66.48\\ \\mathrm{V}$$

Each diode blocks $2V_{m} = 67.88\\ \\mathrm{V}$, so a 100 V part is the
smallest sensible choice.

*Trap*: 48 V, from doubling the RMS value. A multiplier stacks **peak**
voltages, and the RMS-to-peak conversion must come first.

**B8 — 28.12 V, 3.94 V peak-to-peak, at 360 Hz.**

$$V_{dc} = \\frac{3\\sqrt{3}}{\\pi}V_{m} = 1.654(17) = 28.12\\ \\mathrm{V}$$

The six-pulse output runs between $1.5V_{m} = 25.5\\ \\mathrm{V}$ and
$\\sqrt{3}V_{m} = 29.44\\ \\mathrm{V}$:

$$\\Delta V_{pp} = (1.732 - 1.500)(17) = 3.94\\ \\mathrm{V}, \\qquad f_{ripple} = 6(60) = 360\\ \\mathrm{Hz}$$

*Trap*: applying the single-phase $2V_{m}/\\pi$ and answering 10.82 V. The
factor is $3\\sqrt{3}/\\pi = 1.654$, larger than one because the six-pulse
output is built from **line-to-line** differences of the phase voltages, not
from a single phase.

## 8.6 What the two sets have in common

Every trap listed above is one of four errors: an RMS value used where a peak
belongs, a diode drop omitted, a half-wave formula applied to a full-wave
circuit, or an ideal model pushed past the point where its error matters. Check
those four before committing an answer and the diode portion of the exam
becomes arithmetic.`,
        examTip: 'Rehearse the unit-conversion order until it is automatic: RMS to peak (×√2), then subtract diode drops, then apply the π factor, then apply the ripple formula. Every trap in both problem sets above is a step of that sequence performed out of order or skipped entirely.',
        importantNote: 'Peak repetitive diode current in a capacitor-filtered rectifier is one to two orders of magnitude above the DC load current — 4.0 A for a 150 mA supply in problem A7. Diodes and transformers must be selected on that peak, not on the average, and the inrush at power-on with a fully discharged capacitor is larger still.',
      },
    ],
    keyTakeaways: [
      'Half-wave: Vdc = Vpeak/π ≈ 0.318·Vpeak; full-wave bridge: Vdc = 2Vpeak/π ≈ 0.636·Vpeak.',
      'PIV: bridge rectifier = Vpeak per diode; half-wave = 2Vpeak.',
      'Ripple factor r ≈ 1/(4√3·f·R·C) for full-wave with capacitor filter (half-wave is 1/(2√3·f·R·C)).',
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
      {
        id: 'bjt-loadline-swing',
        title: '5. The Load Line, the Q-Point, and Maximum Symmetric Swing',
        content: `## 5.1 The circuit draws a line, the transistor picks a curve

A BJT stage is two descriptions of the same collector current. The transistor
supplies a family of output characteristics — one curve per base current,
nearly flat in the active region because $I_{C} = \\beta I_{B}$ barely depends
on $V_{CE}$. The circuit supplies a single straight line, which is just KVL
around the collector-emitter loop:

$$V_{CE} = V_{CC} - I_{C}(R_{C} + R_{E})$$

Rearranged, that is a line of slope $-1/(R_{C}+R_{E})$ through two easy
intercepts: $V_{CE} = V_{CC}$ when $I_{C} = 0$, and

$$I_{C,\\max} = \\frac{V_{CC}}{R_{C}+R_{E}}$$

when $V_{CE} = 0$. For the Section 3 design ($V_{CC} = 12\\ \\mathrm{V}$,
$R_{C} = 270\\ \\Omega$, $R_{E} = 2.7\\ \\mathrm{k}\\Omega$) those intercepts are
12 V and

$$I_{C,\\max} = \\frac{12}{2970} = 4.04\\ \\mathrm{mA}$$

![Three output characteristic curves for base currents of 10, 20 and 30 microamps with the DC load line from 12 volts to 4.04 milliamps drawn across them, and the quiescent point marked at 6.17 volts and 1.96 milliamperes.](/courses/fe-ee/figures/elec2-bjt-loadline-qpoint.svg)

The bias network decides **which** curve the transistor sits on; the load line
decides **where** on that curve. Move the divider and the Q-point slides along
the line; change $R_{C}$ or $R_{E}$ and the line itself pivots. Nothing else
can happen, which is why sketching the load line first turns most bias
questions into reading off a graph.

## 5.2 Worked Example — locating the Q-point on the load line

**Given**: the Section 3 divider bias — $V_{B} = 6.0\\ \\mathrm{V}$ from a
30 kΩ/30 kΩ divider, $R_{E} = 2.7\\ \\mathrm{k}\\Omega$,
$R_{C} = 270\\ \\Omega$, $V_{CC} = 12\\ \\mathrm{V}$, β = 100.

**Handbook sequence**: $V_{E} = V_{B} - 0.7$; $I_{E} = V_{E}/R_{E}$;
$I_{C} = \\alpha I_{E}$; $V_{CE} = V_{CC} - I_{C}R_{C} - I_{E}R_{E}$.

**Substitution**:

$$V_{E} = 6.0 - 0.7 = 5.30\\ \\mathrm{V}, \\qquad I_{E} = \\frac{5.30}{2700} = 1.963\\ \\mathrm{mA}$$

$$I_{B} = \\frac{I_{E}}{\\beta + 1} = \\frac{1.963}{101} = 19.4\\ \\mu\\mathrm{A}, \\qquad I_{C} = \\frac{100}{101}(1.963) = 1.944\\ \\mathrm{mA}$$

$$V_{CE} = 12 - (1.963\\times 10^{-3})(2970) = 6.17\\ \\mathrm{V}$$

**Answer**: Q sits at 6.17 V and 1.96 mA, marked in the figure exactly where
the load line crosses the curve for roughly 19 μA of base current. Two
confirmations are worth the ten seconds they cost: $V_{CE} = 6.17\\ \\mathrm{V}$
is far above the 0.2 V saturation edge, and the collector voltage
$V_{C} = 12 - (1.963\\times 10^{-3})(270) = 11.47\\ \\mathrm{V}$ is comfortably
above $V_{E} = 5.30\\ \\mathrm{V}$, so the base-collector junction is reverse
biased. Both tests say active region, which is the licence to use every
small-signal formula in Section 2.

## 5.3 Where the Q-point should sit

An amplifier clips when the transistor runs out of room in either direction.
Going up in $V_{CE}$ it runs out at cutoff, having only $V_{CC} - V_{CEQ}$ to
give; going down it runs out at saturation, with $V_{CEQ} - V_{CE,sat}$ to
spend. The usable symmetric swing is whichever is smaller:

$$V_{swing} = \\min\\left(V_{CC} - V_{CEQ},\\ V_{CEQ} - V_{CE,sat}\\right)$$

![Two dashed headroom lines against quiescent collector-emitter voltage, one falling and one rising, with their lower envelope peaked at 6.1 volts of bias giving 5.9 volts of symmetric swing.](/courses/fe-ee/figures/elec2-bjt-swing.svg)

Setting the two arms equal gives the optimum, which is why "bias at midsupply"
is the standing advice:

$$V_{CEQ,opt} = \\frac{V_{CC} + V_{CE,sat}}{2}, \\qquad V_{swing,\\max} = \\frac{V_{CC} - V_{CE,sat}}{2}$$

## 5.4 Worked Example — optimum bias for maximum swing

**Given**: $V_{CC} = 12\\ \\mathrm{V}$, $V_{CE,sat} = 0.2\\ \\mathrm{V}$, and an
AC load line that coincides with the DC load line — that is, no emitter bypass
capacitor and no AC-coupled load.

**Substitution**:

$$V_{CEQ,opt} = \\frac{12 + 0.2}{2} = 6.10\\ \\mathrm{V}, \\qquad V_{swing,\\max} = \\frac{12 - 0.2}{2} = 5.90\\ \\mathrm{V}$$

**Answer**: bias at 6.10 V for 5.90 V of peak swing, which is the apex of the
figure's envelope. The Section 3 design's 6.17 V is 70 mV off that optimum and
gives up 70 mV of swing — a 1.2% penalty, invisible in practice. What matters
is the shape of the curve on either side: bias at 2 V and the swing collapses
to 1.8 V, clipping on the saturation side; bias at 10 V and it collapses to
2.0 V, clipping on the cutoff side. The penalty for missing midsupply is
linear, and it is symmetric only because the two failure modes are.

## 5.5 The AC load line, and a swing surprise

Section 5.4 assumed the AC and DC load lines coincide. Add the bypass capacitor
that Section 3 requires for full gain and they part company: at signal
frequencies $R_{E}$ vanishes, so the AC collector resistance is $R_{C}$ alone,
and the AC load line through Q is far steeper than the DC one. The cutoff-side
headroom is no longer $V_{CC} - V_{CEQ}$ but the much smaller product of the
bias current and the AC load resistance:

$$v_{swing,\\mathrm{cutoff}} = I_{C}r_{c}, \\qquad r_{c} = R_{C}\\parallel R_{L}$$

## 5.6 Worked Example — why the Section 3 stage cannot swing 5.9 V

**Given**: the Section 3 design with $R_{E}$ fully bypassed, no external load,
$I_{C} = 1.944\\ \\mathrm{mA}$, $R_{C} = 270\\ \\Omega$,
$V_{CEQ} = 6.17\\ \\mathrm{V}$.

**Cutoff-side limit**:

$$v_{swing,\\mathrm{cutoff}} = (1.944\\times 10^{-3})(270) = 0.525\\ \\mathrm{V}$$

**Saturation-side limit**: $6.17 - 0.2 = 5.97\\ \\mathrm{V}$.

**Answer**: the smaller of the two governs, so this stage clips at
**0.525 V peak**, not 5.9 V. The saturation headroom is eleven times larger
than the circuit can ever use. There is a tidy identity hiding in that number:
since $g_{m} = I_{C}/V_{T}$ and $\\lvert A_{v}\\rvert = g_{m}R_{C}$,

$$I_{C}R_{C} = \\lvert A_{v}\\rvert V_{T} = 20.2\\times 26\\ \\mathrm{mV} = 0.525\\ \\mathrm{V}$$

**The cutoff-limited output swing of a bypassed common-emitter stage depends
only on its gain**, not on the supply, the bias current, or the resistor
values. Ask for a gain of 20 and 0.52 V peak is all you get; ask for 100 and it
falls to 2.6 V only because you have also asked for five times the gain. Swing
and gain are traded one for one through $V_{T}$, and the way out is not a
bigger supply but a second stage, an unbypassed emitter resistor, or a
differential pair.`,
        examTip: 'Draw the load line from its two intercepts — VCC on the voltage axis, VCC/(RC+RE) on the current axis — before anything else. Every bias question then reduces to marking one point on it, and the saturation check becomes visual: if the bias current the divider demands exceeds the current intercept, the transistor is saturated and no active-region formula applies.',
        importantNote: 'The DC load line uses RC + RE; the AC load line uses RC in parallel with any AC-coupled load, and excludes RE entirely if RE is bypassed. Maximum-swing questions are about the AC load line. Using the DC line when a bypass capacitor is present overestimates the available swing — by a factor of eleven in the Section 3 design.',
      },
      {
        id: 'bjt-smallsignal-numbers',
        title: '6. The Exponential Base, gm, and Emitter Degeneration',
        content: `## 6.1 Everything small-signal comes from one exponential

The base-emitter junction is a diode, so the collector current is exponential
in $V_{BE}$:

$$I_{C} = I_{S}e^{V_{BE}/V_{T}}$$

Differentiate it and the transconductance appears with no further physics:

$$g_{m} = \\frac{dI_{C}}{dV_{BE}} = \\frac{I_{C}}{V_{T}}$$

Two companions follow immediately. Looking into the base, the same current
change is delivered by a base current β times smaller, so the input resistance
is β times larger:

$$r_{\\pi} = \\frac{\\beta}{g_{m}} = \\frac{\\beta V_{T}}{I_{C}}$$

Looking into the emitter, the current is essentially all of $I_{C}$, so the
resistance is the reciprocal of the transconductance:

$$r_{e} = \\frac{V_{T}}{I_{E}} \\approx \\frac{1}{g_{m}}$$

![Collector current against base-emitter voltage on a logarithmic current axis, a straight line marked at 10 microamps, 100 microamps, 1 milliamp and 10 milliamps, with the 59.9 millivolt decade spacing arrowed and the constant-drop 0.7 volt line shown.](/courses/fe-ee/figures/elec2-bjt-vbe-decade.svg)

The figure is that exponential drawn honestly. On a log current axis it is a
straight line of slope one decade per $V_{T}\\ln 10$:

$$\\Delta V_{BE} = V_{T}\\ln 10 = 0.026\\times 2.3026 = 59.9\\ \\mathrm{mV}$$

## 6.2 Worked Example — the small-signal trio at two bias points

**Given**: β = 100, $V_{T} = 26\\ \\mathrm{mV}$. Find $g_{m}$, $r_{\\pi}$ and
$r_{e}$ at $I_{C} = 1\\ \\mathrm{mA}$ and again at the Section 3 bias of
$I_{E} = 1.963\\ \\mathrm{mA}$.

**At 1 mA**:

$$g_{m} = \\frac{10^{-3}}{0.026} = 38.46\\ \\mathrm{mS}, \\qquad r_{\\pi} = \\frac{100}{0.038462} = 2600\\ \\Omega, \\qquad r_{e} = 26\\ \\Omega$$

**At 1.963 mA**:

$$g_{m} = \\frac{1.963\\times 10^{-3}}{0.026} = 75.5\\ \\mathrm{mS}, \\qquad r_{\\pi} = \\frac{100}{0.0755} = 1325\\ \\Omega, \\qquad r_{e} = 13.2\\ \\Omega$$

**Answer**: doubling the bias doubles $g_{m}$ and halves both resistances. That
single scaling relation is the reason bias current is the primary design knob:
it sets gain, input impedance and output impedance simultaneously, and in
opposite directions. Note also that $r_{\\pi}$ at 1.963 mA is 1325 Ω while the
divider it hangs from is 15 kΩ — so the stage's input resistance is
$1325\\parallel 15000 = 1217\\ \\Omega$, dominated by the transistor, not the
bias network.

## 6.3 Worked Example — reading the exponential backwards

**Given**: a transistor whose $V_{BE}$ measures 0.700 V at 1 mA. What is
$V_{BE}$ at 10 μA, and at 10 mA?

**Handbook relation**: each factor of ten in current costs 59.9 mV.

**Substitution**: 10 μA is two decades below 1 mA, and 10 mA is one decade
above:

$$V_{BE}(10\\ \\mu\\mathrm{A}) = 0.700 - 2(0.0599) = 0.580\\ \\mathrm{V}$$

$$V_{BE}(10\\ \\mathrm{mA}) = 0.700 + 0.0599 = 0.760\\ \\mathrm{V}$$

**Answer**: 0.580 V and 0.760 V, the two outer marked points in the figure.
This is the quantitative defence of the constant-drop model: across a
thousand-to-one current range, $V_{BE}$ moves by only 180 mV. Assume 0.7 V and
you are exactly right at 1 mA, 120 mV optimistic at 10 μA, and 60 mV pessimistic
at 10 mA — errors that vanish next to a 6 V supply and matter enormously in a
current mirror, where two junctions are being matched to each other rather than
to a rail.

## 6.4 Emitter degeneration: paying gain for everything else

Leave part of $R_{E}$ unbypassed and the emitter node moves with the signal.
The input signal is then divided between the base-emitter junction and the
emitter resistor, and the exact gain becomes

$$\\lvert A_{v}\\rvert = \\frac{g_{m}R_{C}}{1 + g_{m}R_{E}} = \\frac{R_{C}}{1/g_{m} + R_{E}}$$

Once $g_{m}R_{E} \\gg 1$ the transistor drops out of the expression entirely:

$$\\lvert A_{v}\\rvert \\approx \\frac{R_{C}}{R_{E}}$$

![Common-emitter gain magnitude against unbypassed emitter resistance, the exact curve falling from 20.4 at zero ohms through 11.6 at ten ohms, with the RC over RE approximation converging onto it above about fifty ohms.](/courses/fe-ee/figures/elec2-bjt-gain-vs-re.svg)

The gap between the two curves in the figure is the size of $1/g_{m}$, and it
is the reason a "small" emitter resistor is not small.

## 6.5 Worked Example — how little degeneration it takes

**Given**: the Section 3 stage, $g_{m} = 75.5\\ \\mathrm{mS}$ (so
$1/g_{m} = 13.2\\ \\Omega$), $R_{C} = 270\\ \\Omega$. Find the gain for
$R_{E} = 0$, 10 Ω, 27 Ω and 100 Ω, and compare with $R_{C}/R_{E}$.

**Substitution**:

$$R_{E} = 0: \\quad \\lvert A_{v}\\rvert = 75.5\\times 10^{-3}\\times 270 = 20.4$$

$$R_{E} = 10\\ \\Omega: \\quad \\lvert A_{v}\\rvert = \\frac{270}{13.2 + 10} = 11.6 \\quad (R_{C}/R_{E} = 27)$$

$$R_{E} = 27\\ \\Omega: \\quad \\lvert A_{v}\\rvert = \\frac{270}{13.2 + 27} = 6.71 \\quad (R_{C}/R_{E} = 10)$$

$$R_{E} = 100\\ \\Omega: \\quad \\lvert A_{v}\\rvert = \\frac{270}{13.2 + 100} = 2.38 \\quad (R_{C}/R_{E} = 2.7)$$

**Answer**: a 10 Ω resistor — less than a tenth of the collector resistor —
already cuts the gain nearly in half, because it is comparable to the 13.2 Ω
the transistor contributes on its own. The $R_{C}/R_{E}$ shortcut is 133% high
at 10 Ω, 49% high at 27 Ω, and 13% high at 100 Ω. **Use it only when
$R_{E} \\gg 1/g_{m}$**, which in practice means $R_{E}$ of at least a few
hundred ohms at milliampere bias currents.

| $R_{E}$ unbypassed | Exact $\\lvert A_{v}\\rvert$ | $R_{C}/R_{E}$ | Error of the shortcut | $Z_{in}$ at the base |
|---|---|---|---|---|
| 0 Ω | 20.4 | — | — | 1.32 kΩ |
| 10 Ω | 11.6 | 27 | +133% | 2.33 kΩ |
| 27 Ω | 6.71 | 10 | +49% | 4.05 kΩ |
| 100 Ω | 2.38 | 2.7 | +13% | 11.4 kΩ |

The last column is the compensation. Degeneration multiplies the base input
resistance by the same factor it divides the gain, because $R_{E}$ is reflected
into the base as $(\\beta+1)R_{E}$:

$$Z_{in,\\mathrm{base}} = r_{\\pi} + (\\beta+1)R_{E}$$

## 6.6 Worked Example — degeneration as thermal insurance

**Given**: the Section 3 stage warms by 50 °C. $V_{BE}$ falls about 2 mV per
°C. Compare the collector-current drift with and without the emitter resistor.

**With $R_{E} = 2.7\\ \\mathrm{k}\\Omega$**: the divider holds $V_{B}$ fixed, so
a 100 mV fall in $V_{BE}$ raises $V_{E}$ by 100 mV:

$$\\Delta I_{E} = \\frac{0.100}{2700} = 37\\ \\mu\\mathrm{A} \\quad \\Longrightarrow \\quad \\frac{\\Delta I_{E}}{I_{E}} = \\frac{37\\ \\mu\\mathrm{A}}{1.963\\ \\mathrm{mA}} = 1.9\\%$$

**Without an emitter resistor**: the same 100 mV lands entirely on the
junction, and the current is exponential in it:

$$\\frac{I_{C,hot}}{I_{C,cold}} = e^{0.100/0.026} = 46.8$$

**Answer**: 1.9% against a factor of **46.8**. The undegenerated stage does not
merely drift — it runs away, because more current means more dissipation, which
means a hotter junction, which means still more current. The emitter resistor
converts an exponential feedback loop into a linear one, and that, rather than
gain stability, is the reason it is never omitted in a real design.

## 6.7 The Early effect, and why it is usually ignored

Real output characteristics slope gently upward instead of running flat,
because the collector voltage modulates the effective base width. The slope is
captured by an output resistance referred to an extrapolated intercept called
the Early voltage:

$$r_{o} = \\frac{V_{A}}{I_{C}}$$

At the Section 3 bias with $V_{A} = 100\\ \\mathrm{V}$:

$$r_{o} = \\frac{100}{1.963\\times 10^{-3}} = 50.9\\ \\mathrm{k}\\Omega$$

That resistance appears in parallel with $R_{C}$, so the gain becomes
$g_{m}(R_{C}\\parallel r_{o}) = 20.28$ instead of 20.38 — a 0.5% correction, far
below the tolerance of the resistors. This is why FE-level analysis drops
$r_{o}$ without apology. It stops being negligible only when the collector load
is itself a current source of comparable impedance, which is the situation in
an integrated op-amp gain stage and essentially nowhere in discrete design.`,
        examTip: 'Compute gm = IC/26 mV first and everything else in the small-signal model is one step away: rpi = beta/gm, re = 1/gm, |Av| = gm·RC for a bypassed stage and RC/(1/gm + RE) for a degenerated one. Writing 1/gm on the page as an actual number in ohms is what stops the RC/RE shortcut being used where it does not belong.',
        importantNote: 'The emitter resistor 1/gm is inside the transistor and always present. At 2 mA it is 13 Ω, which is why a 10 Ω unbypassed resistor halves the gain rather than barely touching it. Any gain formula written as RC/RE is really RC/(1/gm + RE) with a term dropped, and the dropped term is only negligible above a few hundred ohms.',
      },
      {
        id: 'bjt-frequency-response',
        title: '7. Frequency Response from One Corner to the Other',
        content: `## 7.1 Two different families of capacitor

A discrete common-emitter stage contains capacitors of two kinds, and they do
opposite jobs. The **external** ones — input coupling, output coupling, emitter
bypass — are large, deliberately placed, and act as short circuits in the
passband; they set the **low**-frequency corner, because at low enough
frequency they stop being short circuits. The **internal** ones —
$C_{\\pi}$ across the base-emitter junction and $C_{\\mu}$ across the
base-collector junction — are a few picofarads, unavoidable, and open circuits
in the passband; they set the **high**-frequency corner, because at high enough
frequency they stop being open circuits.

Each capacitor contributes one pole, and each pole is the reciprocal of a
time constant formed with the resistance that capacitor sees:

$$f = \\frac{1}{2\\pi R_{\\mathrm{eq}}C}$$

The whole of frequency-response analysis at FE level is identifying
$R_{\\mathrm{eq}}$ for each capacitor. Nothing else is required.

## 7.2 Worked Example — sizing the three external capacitors

**Given**: the Section 3 stage — $r_{\\pi} = 1325\\ \\Omega$, bias divider
Thevenin resistance $R_{th} = 15\\ \\mathrm{k}\\Omega$,
$R_{C} = 270\\ \\Omega$, $R_{E} = 2.7\\ \\mathrm{k}\\Omega$,
$g_{m} = 75.5\\ \\mathrm{mS}$, β = 100, driving a 10 kΩ load. Place every
external corner at or below 20 Hz.

**Input coupling capacitor.** It sees the source resistance in series with the
amplifier's own input resistance:

$$Z_{in} = r_{\\pi}\\parallel R_{th} = \\frac{1325\\times 15000}{16325} = 1217\\ \\Omega$$

Driven from a low-impedance source, a 1 μF capacitor therefore corners at

$$f_{L} = \\frac{1}{2\\pi(1217)(10^{-6})} = 131\\ \\mathrm{Hz}$$

which is the lower corner drawn in the Bode figure below. Add the 10 kΩ source
resistance used for the Miller calculation and the same capacitor sees
11.2 kΩ, dropping the corner to 14.2 Hz — a reminder that a coupling
capacitor's corner is a property of the **whole** network, not of the capacitor.

**Output coupling capacitor.** It sees $R_{C} + R_{L} = 10.27\\ \\mathrm{k}\\Omega$:

$$C = \\frac{1}{2\\pi(10270)(20)} = 0.775\\ \\mu\\mathrm{F}$$

**Emitter bypass capacitor.** This is the one that catches people out. Looking
up from the emitter node the capacitor does not see $R_{E}$ alone; it sees
$R_{E}$ in parallel with the resistance looking into the emitter, which is
$1/g_{m}$ plus the base network divided by $(\\beta+1)$:

$$R_{\\mathrm{eq}} = R_{E}\\parallel\\left(\\frac{1}{g_{m}} + \\frac{R_{th}}{\\beta+1}\\right) = 2700\\parallel(13.2 + 148.5) = 152.6\\ \\Omega$$

$$C_{E} = \\frac{1}{2\\pi(152.6)(20)} = 52\\ \\mu\\mathrm{F}$$

**Answer**: 1 μF in, 0.775 μF out, and 52 μF (specify 100 μF) across the emitter
resistor. The bypass capacitor is 67 times larger than the output coupling
capacitor, and the reason is entirely in that 152.6 Ω: the emitter node is a
low-impedance node, so bypassing it takes a lot of capacitance. Compute the
corner from $R_{E} = 2.7\\ \\mathrm{k}\\Omega$ instead and you get 2.9 μF, an
undersize by a factor of eighteen, and a stage that has lost most of its gain
across the entire audio band.

## 7.3 The high end belongs to Miller

At the top of the band, $C_{\\mu}$ bridges the base and collector — the input
and output of an inverting amplifier of gain $\\lvert A_{v}\\rvert$. When the
base moves up by one volt the collector moves down by $\\lvert A_{v}\\rvert$
volts, so the voltage across $C_{\\mu}$ changes by $1 + \\lvert A_{v}\\rvert$
volts and it draws $(1+\\lvert A_{v}\\rvert)$ times the current a grounded
capacitor would. To the source it therefore looks that much larger:

$$C_{in} = C_{\\pi} + C_{\\mu}\\left(1 + \\lvert A_{v}\\rvert\\right)$$

$$f_{H} = \\frac{1}{2\\pi R_{s}C_{in}}$$

## 7.4 Worked Example — the complete Bode plot

**Given**: the Section 4.4 numbers — $\\lvert A_{v}\\rvert = 20$,
$C_{\\pi} = 16\\ \\mathrm{pF}$, $C_{\\mu} = 4\\ \\mathrm{pF}$,
$R_{s} = 10\\ \\mathrm{k}\\Omega$ — with the 1 μF input coupling capacitor of
Section 7.2.

**Midband gain**:

$$A_{\\mathrm{mid,dB}} = 20\\log_{10}(20) = 26.0\\ \\mathrm{dB}$$

**Upper corner**:

$$C_{in} = 16 + 4(21) = 100\\ \\mathrm{pF}, \\qquad f_{H} = \\frac{1}{2\\pi(10^{4})(10^{-10})} = 159\\ \\mathrm{kHz}$$

**Lower corner**: 130 Hz from Section 7.2.

![Bode magnitude plot of the common-emitter stage, flat at 26 decibels between a 130 hertz lower corner set by the coupling capacitor and a 159 kilohertz upper corner set by the Miller capacitance, rolling off at 20 decibels per decade on each side.](/courses/fe-ee/figures/elec2-bjt-bode.svg)

**Answer**: 26.0 dB of flat gain from 130 Hz to 159 kHz, a bandwidth of
159 kHz, with a 20 dB-per-decade slope on each side because each corner comes
from a single pole. Note the asymmetry of cause: the lower corner is a design
choice — make the capacitor bigger and it moves wherever you want — while the
upper corner is imposed by the device and the source impedance together, and
the only levers on it are less gain or a lower source resistance.

## 7.5 Worked Example — trading gain against bandwidth

**Given**: the same stage redesigned for $\\lvert A_{v}\\rvert = 10$ instead of
20, with $C_{\\pi}$, $C_{\\mu}$ and $R_{s}$ unchanged.

**Substitution**:

$$C_{in} = 16 + 4(11) = 60\\ \\mathrm{pF}, \\qquad f_{H} = \\frac{1}{2\\pi(10^{4})(60\\times 10^{-12})} = 265\\ \\mathrm{kHz}$$

**Answer**: halving the gain raises the bandwidth from 159 kHz to 265 kHz — a
factor of **1.67, not 2**. The gain-bandwidth products are 3.18 MHz and
2.65 MHz respectively, so the product is not constant here. It becomes constant
only when the Miller term buries the fixed $C_{\\pi}$, and its limiting value is

$$\\lim_{\\lvert A_{v}\\rvert \\to \\infty} \\lvert A_{v}\\rvert f_{H} = \\frac{1}{2\\pi R_{s}C_{\\mu}} = \\frac{1}{2\\pi(10^{4})(4\\times 10^{-12})} = 3.98\\ \\mathrm{MHz}$$

At a gain of 20 the stage already realises 80% of that ceiling; at a gain of 10
only 67%. The rule of thumb from Section 2.3 is therefore an upper bound
approached from below, and quoting it as an equality at low gain overstates the
bandwidth available.

## 7.6 Worked Example — the transistor's own limit

**Given**: $g_{m} = 75.5\\ \\mathrm{mS}$, $C_{\\pi} = 16\\ \\mathrm{pF}$,
$C_{\\mu} = 4\\ \\mathrm{pF}$.

**Handbook relation**: $f_{T}$ is where the short-circuit current gain falls to
unity:

$$f_{T} = \\frac{g_{m}}{2\\pi(C_{\\pi} + C_{\\mu})} = \\frac{0.0755}{2\\pi(20\\times 10^{-12})} = 601\\ \\mathrm{MHz}$$

**Answer**: 601 MHz, roughly 3800 times the 159 kHz the stage actually
delivers. The device is nowhere near its limit; the **circuit** is. Almost all
of the shortfall is the 10 kΩ source resistance working against a
Miller-multiplied 4 pF. Drive the same transistor from 100 Ω and $f_{H}$ rises
a hundredfold to 15.9 MHz, which is why the cascode — a common-emitter stage
whose collector is held still by a common-base stage, denying $C_{\\mu}$ its
gain multiplication — is the standard answer whenever both gain and bandwidth
are required.

| Capacitor | Resistance it sees | Corner it sets | Direction of roll-off |
|---|---|---|---|
| Input coupling, 1 μF | 1.22 kΩ | 131 Hz | low-frequency |
| Output coupling, 0.775 μF | 10.27 kΩ | 20 Hz | low-frequency |
| Emitter bypass, 52 μF | 152.6 Ω | 20 Hz | low-frequency |
| Miller input, 100 pF | 10 kΩ | 159 kHz | high-frequency |

The overall lower corner is the **highest** of the low-frequency poles, since
the first one to appear as frequency falls is the one that cuts the gain. Here
that is the 131 Hz input coupling pole, which is exactly what the figure
shows.`,
        examTip: 'For each capacitor ask one question: what resistance does it see with all sources zeroed? Coupling capacitors see the series sum on either side of them; the emitter bypass capacitor sees RE in parallel with (1/gm + Rth/(β+1)), which is tens of ohms, not thousands. The dominant low-frequency corner is the HIGHEST of the individual corners, not their sum.',
        importantNote: 'The Miller capacitance is Cπ + Cμ(1 + |Av|), not Cπ + Cμ. In the worked stage that is 100 pF instead of 20 pF — a factor of five in bandwidth. And because Cπ does not scale with gain, halving the gain buys only 1.67× the bandwidth here, not the 2× a strict constant-GBW argument predicts.',
      },
      {
        id: 'bjt-practice-problems',
        title: '8. Practice Problems with Full Solutions',
        content: `## 8.1 How to work these

Do each problem on paper first. Every one is handbook-solvable in about three
minutes, and every solution names the distractor a hurried candidate lands on.
Unless stated otherwise: silicon NPN, $V_{BE} = 0.7\\ \\mathrm{V}$,
$V_{CE,sat} = 0.2\\ \\mathrm{V}$, $V_{T} = 26\\ \\mathrm{mV}$.

## 8.2 Problem Set A — Regions, Biasing, and Switching

**A1.** A divider-biased stage has $V_{CC} = 15\\ \\mathrm{V}$,
$R_{1} = 47\\ \\mathrm{k}\\Omega$, $R_{2} = 10\\ \\mathrm{k}\\Omega$,
$R_{E} = 1\\ \\mathrm{k}\\Omega$, $R_{C} = 2.2\\ \\mathrm{k}\\Omega$, β = 150.
Find $V_{B}$, $V_{E}$, $I_{E}$ and $V_{CE}$ using the stiff-divider
approximation.

**A2.** Repeat A1 including base loading. By what percentage does the exact
emitter current differ from the approximate one?

**A3.** A switch has $V_{CC} = 5\\ \\mathrm{V}$, $R_{C} = 470\\ \\Omega$,
$I_{B} = 0.2\\ \\mathrm{mA}$, β = 80. Which region is the transistor in, and
what is $I_{C}$?

**A4.** A fixed-bias stage has $V_{CC} = 10\\ \\mathrm{V}$,
$R_{B} = 470\\ \\mathrm{k}\\Omega$, $R_{C} = 1\\ \\mathrm{k}\\Omega$, β = 200.
Find $I_{B}$, $I_{C}$ and $V_{CE}$.

**A5.** The transistor in A4 is replaced by one with β = 100, then by one with
β = 400. What happens to $V_{CE}$?

**A6.** A stage has $V_{CC} = 12\\ \\mathrm{V}$, $R_{C} = 270\\ \\Omega$,
$R_{E} = 2.7\\ \\mathrm{k}\\Omega$, β = 100, driven with
$I_{B} = 40\\ \\mu\\mathrm{A}$. Active or saturated?

**A7.** Find the transistor dissipation at the Q-point of Section 5.2, then
compare the dissipation of a device switching 100 mA as a saturated switch
against the same current in the middle of its active region at
$V_{CE} = 6\\ \\mathrm{V}$.

## 8.3 Set A Solutions

**A1 — 2.63 V, 1.93 V, 1.93 mA, 8.82 V.**

$$V_{B} = 15\\frac{10}{57} = 2.632\\ \\mathrm{V}, \\qquad V_{E} = 2.632 - 0.7 = 1.932\\ \\mathrm{V}$$

$$I_{E} = \\frac{1.932}{1000} = 1.932\\ \\mathrm{mA}, \\qquad V_{CE} = 15 - (1.932\\times 10^{-3})(3200) = 8.82\\ \\mathrm{V}$$

*Trap*: computing $15 - I_{C}R_{C} = 10.75\\ \\mathrm{V}$ and calling it
$V_{CE}$. That is $V_{C}$, the collector voltage with respect to ground.
$V_{CE}$ must also give back the 1.93 V sitting on the emitter, so the
resistance in the KVL loop is $R_{C} + R_{E} = 3.2\\ \\mathrm{k}\\Omega$.

**A2 — 1.83 mA, 5.2% lower.** The divider's Thevenin resistance is

$$R_{th} = \\frac{47\\times 10}{57} = 8.25\\ \\mathrm{k}\\Omega$$

$$I_{E} = \\frac{V_{B} - 0.7}{R_{E} + R_{th}/(\\beta+1)} = \\frac{1.932}{1000 + 54.6} = 1.832\\ \\mathrm{mA}$$

*Trap*: assuming the stiff-divider shortcut is always good enough. Here
$R_{th}/(\\beta+1) = 54.6\\ \\Omega$ against $R_{E} = 1000\\ \\Omega$, so the
error is 5%. Halve β to 75 and the correction term doubles to 109 Ω, taking the
error to 10% — which is why the design rule sets the divider current at roughly
ten times $I_{B}$.

**A3 — saturated, $I_{C} = 10.2\\ \\mathrm{mA}$.** Compute both candidates:

$$\\beta I_{B} = 80(0.2) = 16.0\\ \\mathrm{mA}, \\qquad I_{C,\\max} = \\frac{5 - 0.2}{470} = 10.2\\ \\mathrm{mA}$$

The smaller wins, so $I_{C} = 10.2\\ \\mathrm{mA}$ and
$V_{CE} \\approx 0.2\\ \\mathrm{V}$. The forced beta is $10.2/0.2 = 51$.

*Trap*: answering 16 mA. Check it against the supply: 16 mA through 470 Ω
demands 7.5 V of drop from a 5 V rail, which would put $V_{CE}$ at −2.5 V.
Any negative $V_{CE}$ in an NPN answer means saturation, every time.

**A4 — 19.8 μA, 3.96 mA, 6.04 V.**

$$I_{B} = \\frac{10 - 0.7}{470\\times 10^{3}} = 19.8\\ \\mu\\mathrm{A}, \\qquad I_{C} = 200(19.8\\ \\mu\\mathrm{A}) = 3.96\\ \\mathrm{mA}$$

$$V_{CE} = 10 - (3.96\\times 10^{-3})(1000) = 6.04\\ \\mathrm{V}$$

Active, since $I_{C,\\max} = (10-0.2)/1000 = 9.8\\ \\mathrm{mA}$ is larger.

*Trap*: dropping the 0.7 V and using $10/470\\mathrm{k} = 21.3\\ \\mu\\mathrm{A}$,
which yields 4.26 mA and $V_{CE} = 5.74\\ \\mathrm{V}$. The base-emitter drop is
7.5% of the 9.3 V that actually appears across $R_{B}$ — small, but it is the
whole difference between two offered choices.

**A5 — $V_{CE}$ moves from 8.02 V to 2.09 V.** The base current is fixed at
19.8 μA by $R_{B}$, so the collector current is directly proportional to β:

$$\\beta = 100: \\ I_{C} = 1.98\\ \\mathrm{mA}, \\ V_{CE} = 8.02\\ \\mathrm{V}$$

$$\\beta = 400: \\ I_{C} = 7.92\\ \\mathrm{mA}, \\ V_{CE} = 2.09\\ \\mathrm{V}$$

*Trap*: assuming the Q-point is "roughly stable" because the circuit still
works. It does still work — barely — but the swing has collapsed from about
5.9 V to 1.9 V, and a slightly higher β or a warmer day pushes it into
saturation. This is the quantitative version of the Section 1.2 stability
argument, and the reason fixed base bias survives only in switching circuits.

**A6 — saturated, but only just.**

$$\\beta I_{B} = 100(40\\ \\mu\\mathrm{A}) = 4.00\\ \\mathrm{mA}, \\qquad I_{C,\\max} = \\frac{12 - 0.2}{2970} = 3.97\\ \\mathrm{mA}$$

The circuit cannot deliver the 4.00 mA the transistor wants, so it saturates at
3.97 mA.

*Trap*: rounding both to 4 mA and declaring the device active. When the two
candidates land within a few percent, the transistor is at the edge of
saturation and neither the active-region model nor the saturated model is
trustworthy — the honest answer on the exam is the smaller current, and in
design the honest answer is to move the bias.

**A7 — 12 mW at the Q-point; 20 mW switching against 600 mW linear.**

$$P_{Q} = V_{CE}I_{C} = 6.17(1.944\\times 10^{-3}) = 12.0\\ \\mathrm{mW}$$

$$P_{sat} = 0.2(0.100) = 20\\ \\mathrm{mW}, \\qquad P_{active} = 6(0.100) = 600\\ \\mathrm{mW}$$

*Trap*: assuming a transistor passing more current always dissipates more. The
saturated switch carries fifty times the collector current of the Q-point
example and still dissipates less than twice the power, because $V_{CE}$ has
collapsed to 0.2 V. Dissipation is a **product**, and the whole argument for
switching-mode design is that the product is small at both ends of the load
line and large only in between.

## 8.4 Problem Set B — Small-Signal Analysis and Frequency Response

**B1.** A common-emitter stage is biased at $I_{C} = 1\\ \\mathrm{mA}$ with
β = 100 and $R_{C} = 4.7\\ \\mathrm{k}\\Omega$, emitter fully bypassed. Find
$g_{m}$, $r_{\\pi}$ and $A_{v}$.

**B2.** The stage of B1 now drives a 4.7 kΩ load through a coupling capacitor.
Find the new gain.

**B3.** A stage with $g_{m} = 75.5\\ \\mathrm{mS}$ and
$R_{C} = 270\\ \\Omega$ has 27 Ω of emitter resistance left unbypassed.
Compare the exact gain with the $R_{C}/R_{E}$ estimate.

**B4.** An emitter follower runs at $I_{C} = 5\\ \\mathrm{mA}$ with β = 120,
$R_{E} = 470\\ \\Omega$, an AC-coupled load $R_{L} = 470\\ \\Omega$ and a
source resistance of 1 kΩ. Find $Z_{in}$ at the base, $Z_{out}$, and $A_{v}$.

**B5.** A common-emitter stage has $\\lvert A_{v}\\rvert = 50$,
$C_{\\mu} = 3\\ \\mathrm{pF}$, $C_{\\pi} = 20\\ \\mathrm{pF}$, and is driven
from 5 kΩ. Find the input capacitance and the upper corner frequency.

**B6.** For the Section 3 stage ($R_{E} = 2.7\\ \\mathrm{k}\\Omega$,
$R_{th} = 15\\ \\mathrm{k}\\Omega$, β = 100, $g_{m} = 75.5\\ \\mathrm{mS}$),
what bypass capacitance places the emitter corner at 20 Hz?

**B7.** Find $f_{T}$ for a transistor with $g_{m} = 75.5\\ \\mathrm{mS}$,
$C_{\\pi} = 16\\ \\mathrm{pF}$ and $C_{\\mu} = 4\\ \\mathrm{pF}$.

**B8.** A common-base stage runs at $I_{C} = 2\\ \\mathrm{mA}$ with
$R_{C} = 3.3\\ \\mathrm{k}\\Omega$ and β = 100. Find $g_{m}$, $A_{v}$, the
input resistance at the emitter, and the current gain.

## 8.5 Set B Solutions

**B1 — 38.5 mS, 2.6 kΩ, −181.**

$$g_{m} = \\frac{10^{-3}}{0.026} = 38.46\\ \\mathrm{mS}, \\qquad r_{\\pi} = \\frac{100}{0.038462} = 2600\\ \\Omega$$

$$A_{v} = -g_{m}R_{C} = -(0.0385)(4700) = -181$$

*Trap*: writing $g_{m} = I_{C}\\times 26\\ \\mathrm{mV}$ instead of
$I_{C}/26\\ \\mathrm{mV}$. The units settle it — transconductance is siemens, so
current must be divided by a voltage.

**B2 — −90.4.** The AC collector resistance is the parallel combination:

$$r_{c} = \\frac{4700\\times 4700}{9400} = 2350\\ \\Omega, \\qquad A_{v} = -(0.0385)(2350) = -90.4$$

*Trap*: answering −181 because the load is "capacitively coupled, so it does
not affect the DC bias." True for bias and false for gain — the coupling
capacitor is a short at signal frequencies, which is precisely why the load
halves the gain here.

**B3 — 6.71 exact against 10 estimated, an error of 49%.**

$$\\lvert A_{v}\\rvert = \\frac{R_{C}}{1/g_{m} + R_{E}} = \\frac{270}{13.2 + 27} = 6.71$$

*Trap*: $R_{C}/R_{E} = 270/27 = 10$. The shortcut silently assumes
$R_{E} \\gg 1/g_{m}$, and here 27 Ω is only twice 13.2 Ω. Write $1/g_{m}$ on the
page as a number in ohms and the shortcut disqualifies itself.

**B4 — 29 kΩ, 13.5 Ω, 0.978.**

$$r_{e} = \\frac{0.026}{0.005} = 5.2\\ \\Omega, \\qquad r_{\\pi} = 120(5.2) = 624\\ \\Omega, \\qquad R_{E}\\parallel R_{L} = 235\\ \\Omega$$

$$Z_{in} = r_{\\pi} + (\\beta+1)(R_{E}\\parallel R_{L}) = 624 + 121(235) = 29.1\\ \\mathrm{k}\\Omega$$

$$Z_{out} = r_{e} + \\frac{R_{s}}{\\beta+1} = 5.2 + \\frac{1000}{121} = 13.5\\ \\Omega$$

$$A_{v} = \\frac{235}{235 + 5.2} = 0.978$$

*Trap*: quoting $Z_{in} = r_{\\pi} = 624\\ \\Omega$. That is the input resistance
of a *bypassed common-emitter* stage; in a follower the emitter load is
reflected into the base multiplied by $(\\beta+1)$, and it is that reflection,
not the transistor, that produces the 29 kΩ.

**B5 — 173 pF, 184 kHz.**

$$C_{in} = 20 + 3(1 + 50) = 173\\ \\mathrm{pF}, \\qquad f_{H} = \\frac{1}{2\\pi(5000)(173\\times 10^{-12})} = 184\\ \\mathrm{kHz}$$

*Trap*: adding the capacitances without the Miller multiplier, giving 23 pF and
1.38 MHz — a bandwidth overstated by 7.5 times. The 3 pF that looks negligible
contributes 153 pF of the 173 pF total.

**B6 — 52 μF, so specify 100 μF.**

$$R_{\\mathrm{eq}} = R_{E}\\parallel\\left(\\frac{1}{g_{m}} + \\frac{R_{th}}{\\beta+1}\\right) = 2700\\parallel(13.2 + 148.5) = 152.6\\ \\Omega$$

$$C_{E} = \\frac{1}{2\\pi(152.6)(20)} = 52\\ \\mu\\mathrm{F}$$

*Trap*: using $R_{E} = 2.7\\ \\mathrm{k}\\Omega$ and answering 2.9 μF. That
capacitor corners at 350 Hz instead of 20 Hz, so the stage loses gain across
most of the audio band while measuring perfectly at 1 kHz.

**B7 — 601 MHz.**

$$f_{T} = \\frac{g_{m}}{2\\pi(C_{\\pi}+C_{\\mu})} = \\frac{0.0755}{2\\pi(20\\times 10^{-12})} = 601\\ \\mathrm{MHz}$$

*Trap*: using only $C_{\\pi}$ and answering 751 MHz. Both junction capacitances
load the base at high frequency; $C_{\\mu}$ escapes Miller multiplication in the
$f_{T}$ definition because the output is short-circuited, but it does not
disappear.

**B8 — 76.9 mS, +254, 13 Ω, 0.99.**

$$g_{m} = \\frac{2\\times 10^{-3}}{0.026} = 76.9\\ \\mathrm{mS}, \\qquad A_{v} = +g_{m}R_{C} = +254$$

$$Z_{in} = r_{e} = \\frac{0.026}{2\\times 10^{-3}} = 13\\ \\Omega, \\qquad A_{i} = \\alpha = \\frac{\\beta}{\\beta+1} = 0.99$$

*Trap*: writing the gain as negative. The common-base stage does **not** invert
— the input is the emitter, the output is the collector, and they move together.
The other half of the trap is expecting current gain: a CB stage has voltage
gain of 254 and current gain of 0.99, so it is a current buffer with voltage
gain, the exact complement of the emitter follower.

## 8.6 The four questions that answer every BJT problem

Every problem above is one of four questions. **Which region?** — compare
$\\beta I_{B}$ with $(V_{CC}-0.2)/R_{C}$ and take the smaller. **Where is Q?**
— $V_{B}$, then $V_{E}$, then $I_{E}$, then $V_{CE}$ using $R_{C}+R_{E}$.
**What is the gain?** — $g_{m} = I_{C}/V_{T}$, then $R_{C}$ or
$R_{C}\\parallel R_{L}$ on top, and $1/g_{m} + R_{E}$ underneath. **What
resistance does this capacitor see?** — the answer is the corner frequency.
Nothing in the FE Electronics section asks a fifth question.`,
        examTip: 'Before writing any small-signal answer, confirm the region. A saturated transistor has no gm, no rpi and no gain, and every small-signal formula returns a confident wrong number for it. The region check costs one comparison: β·IB against (VCC − VCE,sat)/RC.',
        importantNote: 'CE inverts and has high voltage and current gain. CC (follower) does not invert, has unity voltage gain and (β+1) current gain, and transforms impedance downward. CB does not invert, has high voltage gain and unity current gain, and transforms impedance upward. Getting the sign and the gain type right is worth more exam marks than any single formula.',
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

$$V_{DS} = V_{DD} - I_{D}(R_{D} + R_{S}) = 10 - 1.3547 \\times 3 = 5.94\\ \\mathrm{V}$$

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

$$g_{m} = 2I_{D}/(V_{GS} - V_{t}) = 2 \\times 1.3547/1.646 = 1.65\\ \\mathrm{mS}$$

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
      {
        id: 'mos-overdrive',
        title: '5. Overdrive Voltage: The Single Number That Sets Everything',
        content: `## 5.1 Saturation depends on one variable, not two

Write the saturation law once more and look hard at what it actually contains:

$$I_{D} = K\\,(V_{GS} - V_{t})^{2}, \\qquad K = (\\mu _{n}C_{ox}/2)\\cdot (W/L)$$

The gate voltage never appears alone. Neither does the threshold. Only their
difference matters, and that difference deserves its own name and its own
symbol:

$$V_{ov} \\equiv V_{GS} - V_{t}$$

Call it the **overdrive** (some references say *effective gate voltage* or
$V_{eff}$). Once you carry $V_{ov}$ as the working variable, the whole
saturation-region toolkit collapses to three short statements:

$$I_{D} = K\\,V_{ov}^{2}, \\qquad g_{m} = 2K\\,V_{ov}, \\qquad V_{DS,sat} = V_{ov}$$

The third is the region boundary from Section 1 rewritten: a device is in
saturation exactly when its drain-source voltage is at least its own
overdrive. That is why $V_{ov}$ is worth isolating — it is simultaneously the
current-setting knob, the gain-setting knob, and the headroom the transistor
demands from the supply.

![The square-law transfer curve for K equal to 0.5 milliamps per volt squared and a threshold of 1 volt, with the tangent drawn at a gate-source voltage of 3 volts. The tangent slope is the transconductance, 2 millisiemens, and the marked operating point carries 2 milliamps at an overdrive of 2 volts.](/courses/fe-ee/figures/elec2-mos-transfer-square.svg)

The figure is the square law and its slope shown as two different statements.
The curve is $I_{D} = 0.5\\,(V_{GS} - 1)^{2}$ in mA; the straight line is its
tangent at $V_{GS} = 3\\ \\mathrm{V}$. Read three facts off it before moving on.
The curve leaves the axis at $V_{t} = 1\\ \\mathrm{V}$, not at the origin. The
marked point sits at 2 mA with 2 V of overdrive. And the tangent there has
slope 2 mS, which is $2K V_{ov} = 2 \\times 0.5 \\times 2$ — the *derivative* of
a squared quantity, so it grows only linearly while the current grows
quadratically.

## 5.2 Worked example: what a 2 V overdrive costs you

**Given**: the device of the figure, $K = 0.5\\ \\mathrm{mA/V^{2}}$,
$V_{t} = 1\\ \\mathrm{V}$, biased at $V_{GS} = 3\\ \\mathrm{V}$ with adequate
drain voltage. Find $I_{D}$, $g_{m}$, and the ratio $g_{m}/I_{D}$. Compare
against a BJT carrying the same current.

**Handbook relations**: $I_{D} = K V_{ov}^{2}$, $g_{m} = 2 I_{D}/V_{ov}$, and
for the bipolar comparison $g_{m} = I_{C}/V_{T}$ with
$V_{T} = 26\\ \\mathrm{mV}$.

**Substitution**:

$$V_{ov} = 3 - 1 = 2\\ \\mathrm{V}, \\qquad I_{D} = 0.5 \\times 2^{2} = 2.0\\ \\mathrm{mA}$$

$$g_{m} = 2 \\times 2.0\\ \\mathrm{mA}/2\\ \\mathrm{V} = 2.0\\ \\mathrm{mS}, \\qquad g_{m}/I_{D} = 2/V_{ov} = 1.0\\ \\mathrm{V^{-1}}$$

$$g_{m,BJT} = 2.0\\ \\mathrm{mA}/26\\ \\mathrm{mV} = 76.9\\ \\mathrm{mS}$$

**Answer**: 2.0 mA and 2.0 mS. The bipolar device delivers 38.5 times more
transconductance from the identical bias current, because its
$g_{m}/I_{D} = 1/V_{T} = 38.5\\ \\mathrm{V^{-1}}$ is fixed by temperature while
the FET's is $2/V_{ov}$ and you chose a large $V_{ov}$.

**Consistency check**: recompute $g_{m}$ from the other handbook form,
$g_{m} = 2K V_{ov} = 2 \\times 0.5 \\times 2 = 2.0\\ \\mathrm{mS}$, and from the
square-root form $g_{m} = \\sqrt{4 K I_{D}} = \\sqrt{4 \\times 0.5 \\times 2.0} = 2.0\\ \\mathrm{mS}$. Three routes, one number.

## 5.3 The efficiency table nobody writes down

Sweep the overdrive across the range a designer actually uses and tabulate
what the same transistor gives back. Every row uses
$K = 0.5\\ \\mathrm{mA/V^{2}}$.

| Overdrive $V_{ov}$ | $I_{D} = K V_{ov}^{2}$ | $g_{m} = 2K V_{ov}$ | $g_{m}/I_{D}$ | $V_{DS}$ needed |
|---|---|---|---|---|
| 0.2 V | 0.020 mA | 0.20 mS | 10.0 V⁻¹ | 0.2 V |
| 0.5 V | 0.125 mA | 0.50 mS | 4.0 V⁻¹ | 0.5 V |
| 1.0 V | 0.500 mA | 1.00 mS | 2.0 V⁻¹ | 1.0 V |
| 2.0 V | 2.000 mA | 2.00 mS | 1.0 V⁻¹ | 2.0 V |

Two trends run in opposite directions down that table, and the tension between
them is the whole of low-voltage analog design. Small overdrive is
*transconductance-efficient*: at 0.2 V of overdrive the device returns ten
siemens of $g_{m}$ per amp of bias, ten times better than at 2 V. Small
overdrive is also *headroom-cheap*: the transistor only demands 0.2 V of drain
voltage to stay saturated, leaving the rest of the supply for signal swing.
What small overdrive costs is current-carrying capability and sensitivity to
threshold variation — at 0.2 V of overdrive, a 50 mV shift in $V_{t}$ moves
the current by roughly 50 percent.

The last column is the one FE candidates most often forget. A stage biased at
a 2 V overdrive has thrown away 2 V of a possibly 5 V supply before any signal
has appeared. That is why integrated designers bias at 0.1 to 0.3 V of
overdrive and discrete designers, working from 12 V or 15 V rails, feel free to
use volts.

## 5.4 Worked example: sizing W/L for a target current

**Given**: a process with $\\mu _{n}C_{ox} = 200\\ \\mathrm{\\mu A/V^{2}}$. Choose
$W/L$ so the device carries $I_{D} = 2\\ \\mathrm{mA}$ at an overdrive of
0.5 V, and find the resulting $g_{m}$.

**Handbook relation**: $I_{D} = (\\mu _{n}C_{ox}/2)(W/L)V_{ov}^{2}$, rearranged
for the aspect ratio.

**Substitution**:

$$W/L = \\frac{2 I_{D}}{\\mu _{n}C_{ox}\\,V_{ov}^{2}} = \\frac{2 \\times 2\\ \\mathrm{mA}}{200\\ \\mathrm{\\mu A/V^{2}} \\times 0.25\\ \\mathrm{V^{2}}} = \\frac{4\\ \\mathrm{mA}}{50\\ \\mathrm{\\mu A}} = 80$$

$$g_{m} = 2 I_{D}/V_{ov} = 2 \\times 2\\ \\mathrm{mA}/0.5\\ \\mathrm{V} = 8.0\\ \\mathrm{mS}$$

**Answer**: $W/L = 80$, $g_{m} = 8\\ \\mathrm{mS}$.

**Consistency check** by the square-root form, which uses the aspect ratio
rather than the overdrive:
$g_{m} = \\sqrt{2 \\mu _{n}C_{ox}(W/L) I_{D}} = \\sqrt{2 \\times 200\\ \\mathrm{\\mu A/V^{2}} \\times 80 \\times 2\\ \\mathrm{mA}} = \\sqrt{64\\ \\mathrm{mS^{2}}} = 8.0\\ \\mathrm{mS}$.

Put this beside Section 5.2. Both devices carry 2 mA. The wide one, run at
0.5 V of overdrive, gives 8 mS; the narrow one at 2 V of overdrive gives 2 mS.
Four times the transconductance for four times less overdrive, at identical
power. Nothing was free — the wide device is eighty squares of silicon and has
four times the gate capacitance, so it is slower. Area and speed bought the
gain.

## 5.5 Reading the transconductance comparison

![Transconductance plotted against bias current on logarithmic axes for a MOSFET with a process transconductance of 1 milliamp per volt squared and for a bipolar transistor. The MOSFET follows a half-slope square-root line, the bipolar a unit-slope line; they cross at 1.35 microamps, and at 1 milliamp the bipolar leads by a factor of 27.](/courses/fe-ee/figures/elec2-mos-gm-vs-id.svg)

The same square law rewritten in terms of current rather than voltage gives

$$g_{m} = \\sqrt{2 k'\\, I_{D}}, \\qquad k' = \\mu _{n}C_{ox}(W/L) = 2K$$

which on log axes is a straight line of slope one half. The bipolar law
$g_{m} = I_{C}/V_{T}$ is a straight line of slope one. Two straight lines of
different slope cross exactly once, and setting the expressions equal locates
the crossing:

$$\\sqrt{2 k' I} = I/V_{T} \\;\\Longrightarrow\\; I_{cross} = 2 k' V_{T}^{2} = 2 \\times 1\\ \\mathrm{mA/V^{2}} \\times (0.026)^{2} = 1.35\\ \\mathrm{\\mu A}$$

Below 1.35 µA the FET is the better transconductor; above it the bipolar pulls
away, reaching 38.5 mS against 1.41 mS at 1 mA — the factor of 27 marked on
the figure. The practical reading is that the two device families are not
competing for the same job. The FET wins on input impedance, on switching, and
in micropower; the bipolar wins on gain per milliamp in the milliamp range.`,
        examTip: 'Convert every MOSFET problem to overdrive on the first line: write V_ov = V_GS − V_t before anything else. Then I_D = K·V_ov², g_m = 2K·V_ov = 2·I_D/V_ov, and the saturation test is simply V_DS ≥ V_ov. Candidates who keep working in V_GS eventually substitute it where V_ov belongs, and the square law turns that slip into a large, confident, wrong number.',
        importantNote: 'The three g_m forms — 2K·V_ov, 2·I_D/V_ov, and √(2k′·I_D) — are algebraically identical, but they differ in which quantity is being held fixed. Reach for 2·I_D/V_ov when the bias point is known, and for √(2k′·I_D) when the device size is known and you are comparing currents.',
      },
      {
        id: 'mos-bias-robustness',
        title: '6. The Bias Point Seen Graphically, and How Far It Moves',
        content: `## 6.1 Two curves, one intersection

Section 4 solved the divider-plus-source-resistor bias algebraically. The same
problem has a picture, and the picture is worth having because it explains why
the quadratic produced a root that had to be thrown away.

Two independent relations connect $I_{D}$ and $V_{GS}$ in that circuit. The
**device** contributes the square law, which knows nothing about the circuit:

$$I_{D} = K\\,(V_{GS} - V_{t})^{2}$$

The **circuit** contributes a straight line from KVL around the gate-source
loop, which knows nothing about the transistor:

$$V_{GS} = V_{G} - I_{D}R_{S} \\;\\Longrightarrow\\; I_{D} = (V_{G} - V_{GS})/R_{S}$$

Plot both on the same axes and the operating point is where they meet, because
that is the only place both statements hold at once.

![The bias quadratic solved graphically: the parabola is the device square law for K equal to 0.5 milliamps per volt squared and a 1 volt threshold, the straight line is the circuit relation for a 4 volt gate and a 1 kilohm source resistor. They intersect at 2.65 volts and 1.35 milliamps; the algebra also returns a second root at 6.65 milliamps that would require a negative gate-source voltage.](/courses/fe-ee/figures/elec2-mos-bias-graphical.svg)

The circuit line is easy to draw without computing anything. It hits the
current axis at $V_{G}/R_{S} = 4\\ \\mathrm{V}/1\\ \\mathrm{k}\\Omega = 4\\ \\mathrm{mA}$
and the voltage axis at $V_{GS} = V_{G} = 4\\ \\mathrm{V}$, and its slope is
$-1/R_{S} = -1\\ \\mathrm{mA/V}$. That is the FET analogue of a load line, and
every element of it is a circuit quantity.

## 6.2 Worked example: the graphical and algebraic answers must agree

**Given**: $K = 0.5\\ \\mathrm{mA/V^{2}}$, $V_{t} = 1\\ \\mathrm{V}$,
$V_{G} = 4\\ \\mathrm{V}$, $R_{S} = 1\\ \\mathrm{k}\\Omega$. Locate the Q-point
graphically, then confirm it algebraically.

**Graphical step**: the drawn line runs from (0 V, 4 mA) to (4 V, 0 mA). The
parabola starts at 1 V and passes through (2 V, 0.5 mA) and (3 V, 2.0 mA). The
crossing sits between those two parabola points, close to 2.65 V, where the
line has fallen to about 1.35 mA.

**Algebraic confirmation**: substituting the line into the parabola with
current in mA and resistance in kΩ,

$$I_{D} = 0.5\\,(4 - I_{D} - 1)^{2} = 0.5\\,(3 - I_{D})^{2}$$

$$I_{D}^{2} - 8 I_{D} + 9 = 0 \\;\\Longrightarrow\\; I_{D} = 4 \\pm \\sqrt{7} = 6.646\\ \\text{or}\\ 1.354\\ \\mathrm{mA}$$

**Answer**: $I_{D} = 1.354\\ \\mathrm{mA}$ and
$V_{GS} = 4 - 1.354 = 2.646\\ \\mathrm{V}$, matching the reading to the
precision the graph supports.

**Where the second root went**: the picture shows it. The parabola and the
line cross only once in the region the device can actually occupy. Algebra
squared the relation and, in doing so, also solved a problem the circuit never
posed — one in which the parabola is extended to the left of the threshold
where the real device carries no current. The 6.65 mA root needs
$V_{GS} = 4 - 6.646 = -2.65\\ \\mathrm{V}$, below threshold, where $I_{D} = 0$.
It contradicts itself.

## 6.3 What the source resistor buys

The reason to spend a resistor and a volt or two of headroom on $R_{S}$ is
that $K$ is not a reliable number. It varies with processing, with die
temperature, and from part to part in the same bin; a spread of ±20 percent is
ordinary for a discrete part. Ask what that spread does to the drain current
in two different bias schemes.

**Fixed gate-source voltage** (no source resistor, $V_{GS}$ pinned at
2.646 V):

$$I_{D} = K\\,(1.646)^{2} \\;\\Longrightarrow\\; I_{D} \\propto K$$

so a ±20 percent spread in $K$ is a ±20 percent spread in $I_{D}$, exactly.

**With the source resistor**, the quadratic must be re-solved for each $K$,
because $V_{GS}$ is now free to move.

## 6.4 Worked example: how far the Q-point actually drifts

**Given**: the circuit of 6.2, with $K$ taking the values 0.4, 0.5 and
0.6 mA/V² — the nominal part and its ±20 percent extremes.

**Handbook relation**: for each $K$, solve
$I_{D} = K(3 - I_{D})^{2}$ with $I_{D}$ in mA and take the root with
$V_{GS} > V_{t}$.

**Substitution**: expanding $I_{D} = K(3 - I_{D})^{2}$ gives the general form
$K I_{D}^{2} - (6K + 1)I_{D} + 9K = 0$. For $K = 0.4$ that is
$0.4 I_{D}^{2} - 3.4 I_{D} + 3.6 = 0$, whose admissible root is 1.240 mA. For
$K = 0.6$ it is $0.6 I_{D}^{2} - 4.6 I_{D} + 5.4 = 0$, giving 1.447 mA.

| $K$ (mA/V²) | $I_{D}$ with $R_{S}$ | drift | $I_{D}$ at fixed $V_{GS}$ | drift |
|---|---|---|---|---|
| 0.4 (−20%) | 1.240 mA | −8.5% | 1.083 mA | −20.0% |
| 0.5 (nominal) | 1.354 mA | — | 1.354 mA | — |
| 0.6 (+20%) | 1.447 mA | +6.9% | 1.625 mA | +20.0% |

**Answer**: the source resistor cuts a ±20 percent device spread down to about
−8.5 / +6.9 percent at the drain. The mechanism is visible on the graph: a
larger $K$ lifts the parabola, the intersection slides up the fixed circuit
line, and sliding up that line *reduces* $V_{GS}$, which pushes the current
back down. That is negative feedback expressed as geometry.

**Consistency check**: at $K = 0.6$ the solution gives
$V_{GS} = 4 - 1.447 = 2.553\\ \\mathrm{V}$, and
$0.6 \\times (2.553 - 1)^{2} = 0.6 \\times 2.412 = 1.447\\ \\mathrm{mA}$ ✓.

Two design corollaries follow. A larger $R_{S}$ steepens the trade — it flattens
the circuit line, so the intersection moves even less — but it costs headroom,
because every volt across $R_{S}$ is a volt unavailable to $V_{DS}$. And the
comparison assumed the divider holds $V_{G}$ steady, which for a MOSFET it does:
with no gate current, the divider can use megohm resistors and still not sag.`,
        examTip: 'When a problem gives you a source resistor, the load-line sketch is faster than the quadratic for eliminating wrong choices: the answer must lie below the line intercept V_G/R_S and to the right of V_t. On the numbers here that is under 4 mA and above 1 V, which kills the 6.65 mA distractor without any algebra at all.',
        importantNote: 'Bias stability against K spread and bias stability against temperature are different questions. The source resistor helps with both, but MOSFET threshold voltage also falls roughly 2 mV per degree C while carrier mobility drops — at high current the mobility term dominates and drain current has a negative temperature coefficient, which is why power MOSFETs can be paralleled without the thermal runaway that plagues paralleled bipolars.',
      },
      {
        id: 'mos-switch-triode',
        title: '7. The MOSFET as a Switch: Triode-Region On-Resistance',
        content: `## 7.1 A resistor you can turn off

Analog problems keep the MOSFET in saturation; switching problems keep it in
triode, hard on, with $V_{DS}$ near zero. Start from the triode equation and
take that limit:

$$I_{D} = K\\,[\\,2(V_{GS} - V_{t})V_{DS} - V_{DS}^{2}\\,]$$

When $V_{DS} \\ll 2V_{ov}$ the squared term is negligible next to the linear
one, and what remains is Ohm's law:

$$I_{D} \\approx 2K\\,V_{ov}\\,V_{DS} \\;\\Longrightarrow\\; r_{DS(on)} = \\frac{V_{DS}}{I_{D}} = \\frac{1}{2K\\,V_{ov}}$$

That is the entire theory of the MOSFET switch. The channel is a resistor
whose conductance is proportional to gate overdrive, so **more gate drive means
less on-resistance**, in inverse proportion.

![Channel on-resistance against gate-source voltage for a device with K equal to 0.5 milliamps per volt squared and a 1 volt threshold. The dashed curve is the small-signal formula one over twice K times overdrive; the solid curve is the secant resistance measured at a drain-source voltage of 0.2 volts. Marked values are 1000 ohms at 2 volts of gate drive, 500 ohms at 3 volts, and 250 ohms at 5 volts.](/courses/fe-ee/figures/elec2-mos-ron.svg)

The two traces answer two different questions. The dashed one is the
*small-signal* resistance in the limit $V_{DS}\\to 0$, which is what an analog
switch passing a millivolt-scale signal sees. The solid one is the *secant*
resistance $V_{DS}/I_{D}$ evaluated at $V_{DS} = 0.2\\ \\mathrm{V}$, which is
what a switch carrying real current sees; it runs slightly higher because the
$-V_{DS}^{2}$ term has begun to bite. At $V_{GS} = 5\\ \\mathrm{V}$ the two read
250 Ω and 256 Ω, a 2.6 percent gap — small enough to ignore on the exam,
large enough to know about.

## 7.2 Worked example: on-resistance, drop, and dissipation

**Given**: the device above, $K = 0.5\\ \\mathrm{mA/V^{2}}$,
$V_{t} = 1\\ \\mathrm{V}$, gate driven to $V_{GS} = 5\\ \\mathrm{V}$, carrying
$I_{D} = 0.4\\ \\mathrm{mA}$. Find the on-resistance, the drain-source drop, and
the power dissipated in the channel.

**Handbook relations**: $r_{DS(on)} = 1/(2K V_{ov})$, then $V = IR$ and
$P = I^{2}R$.

**Substitution**:

$$V_{ov} = 5 - 1 = 4\\ \\mathrm{V}, \\qquad r_{DS(on)} = \\frac{1}{2 \\times 0.5\\ \\mathrm{mA/V^{2}} \\times 4\\ \\mathrm{V}} = \\frac{1}{4\\ \\mathrm{mA/V}} = 250\\ \\Omega$$

$$V_{DS} = 0.4\\ \\mathrm{mA} \\times 250\\ \\Omega = 0.100\\ \\mathrm{V}, \\qquad P = (0.4\\ \\mathrm{mA})^{2} \\times 250\\ \\Omega = 40\\ \\mathrm{\\mu W}$$

**Answer**: 250 Ω, 100 mV, 40 µW.

**Consistency check** against the full triode equation, which does not assume
$V_{DS}$ is small. Setting
$0.4 = 0.5\\,(8V_{DS} - V_{DS}^{2})$ gives
$V_{DS}^{2} - 8V_{DS} + 0.8 = 0$ and

$$V_{DS} = 4 - \\sqrt{16 - 0.8} = 4 - 3.8987 = 0.1013\\ \\mathrm{V}$$

The linear estimate was 1.3 percent low, and the exact dissipation is 40.5 µW.
The approximation is safe here precisely because $0.1\\ \\mathrm{V}$ is far
below $2V_{ov} = 8\\ \\mathrm{V}$.

**The trap**: applying the saturation formula gives
$I_{D} = 0.5 \\times 4^{2} = 8\\ \\mathrm{mA}$, twenty times the stated current,
and every downstream number then goes wrong. Saturation is not the default
region — it is a claim that must survive the test $V_{DS} \\ge V_{ov}$, and
0.1 V against 4 V fails it decisively.

## 7.3 Why switches want volts of gate drive

Because $r_{DS(on)}$ goes as $1/V_{ov}$, the on-resistance halves each time the
overdrive doubles, and a logic-level part driven from 3.3 V behaves very
differently from the same part driven from 10 V. This is the reason gate-driver
chips exist, and the reason a MOSFET driven directly from a microcontroller pin
often runs hot in a circuit that the datasheet said would be fine.

| Gate drive $V_{GS}$ | Overdrive | $r_{DS(on)} = 1/(2K V_{ov})$ | Drop at 0.4 mA |
|---|---|---|---|
| 2 V | 1 V | 1000 Ω | 400 mV |
| 3 V | 2 V | 500 Ω | 200 mV |
| 5 V | 4 V | 250 Ω | 100 mV |

The exam version of this idea usually asks for the drop or the loss rather than
the resistance itself, so carry the chain all the way through: overdrive, then
resistance, then $IR$, then $I^{2}R$.

## 7.4 Worked example: choosing gate drive for a 1 percent drop

**Given**: a power device with $K = 25\\ \\mathrm{mA/V^{2}}$ and
$V_{t} = 1\\ \\mathrm{V}$ switches a $1\\ \\mathrm{k}\\Omega$ load from a 5 V
rail. The specification allows the switch to waste at most 1 percent of the
supply. What gate-source voltage is required?

**Handbook relations**: the switch and load form a divider, so the fractional
loss is $r_{DS(on)}/(R_{L} + r_{DS(on)})$, with
$r_{DS(on)} = 1/(2K V_{ov})$.

**Substitution**: a 1 percent budget on a 1 kΩ load means
$r_{DS(on)} \\le 10.1\\ \\Omega$, since
$10.1/1010.1 = 0.0100$. Solving the on-resistance formula for overdrive,

$$V_{ov} = \\frac{1}{2K\\,r_{DS(on)}} = \\frac{1}{2 \\times 25\\ \\mathrm{mA/V^{2}} \\times 10.1\\ \\Omega} = 1.98\\ \\mathrm{V}$$

$$V_{GS} = V_{ov} + V_{t} = 1.98 + 1 = 2.98\\ \\mathrm{V}$$

**Answer**: about 3.0 V of gate drive. Checking the round number directly, at
$V_{GS} = 3\\ \\mathrm{V}$ the overdrive is 2 V, the on-resistance is
$1/(2 \\times 25 \\times 2) = 10\\ \\Omega$, the load current is
$5/1010 = 4.95\\ \\mathrm{mA}$, and the drop is 49.5 mV — 0.99 percent of the
rail ✓.

**Consistency check across drives**: at 2 V the resistance doubles to 20 Ω and
the loss doubles to 1.96 percent; at 5 V it falls to 5 Ω and 0.50 percent; at
10 V, to 2.22 Ω and 0.22 percent. Each doubling of overdrive halves the loss,
exactly as $1/V_{ov}$ requires, and the returns flatten because the load
resistance eventually dominates the divider.

## 7.5 The other loss: switching

Conduction loss $I^{2}r_{DS(on)}$ is only half the budget. Every transition
also charges and discharges the gate capacitance and drags the device through
the region where voltage and current are simultaneously large. The gate-charge
loss alone is

$$P_{gate} = Q_{G}\\,V_{GS}\\,f_{sw}$$

which is why a large, low-resistance device is not automatically the better
choice: it has more gate charge, so above some switching frequency the
conduction loss it saves is smaller than the switching loss it adds. That
trade-off belongs to the power-electronics chapter, but its origin is right
here in the triode equation.`,
        examTip: 'A MOSFET switch problem gives itself away by a drain-source voltage far below the overdrive — typically tens or hundreds of millivolts. That is triode, so use r_DS(on) = 1/(2K·V_ov) and then Ohm and Joule. Reaching for I_D = K·V_ov² in a switching problem produces a current the circuit could never supply, which is a useful self-check: if the computed current exceeds V_supply/R_load, you used the wrong region.',
        importantNote: 'Datasheets quote r_DS(on) at a stated gate voltage, and that footnote is the whole specification. The same part can show 10 mΩ at V_GS = 10 V and 40 mΩ at V_GS = 4.5 V. When a problem supplies a gate voltage at all, it is telling you the on-resistance is meant to be computed, not looked up.',
      },
      {
        id: 'mos-cmos-inverter',
        title: '8. Inside the CMOS Inverter: Trip Point, Noise Margins, Power',
        content: `## 8.1 The transfer curve is a current balance

Section 2.3 described the CMOS inverter as two switches. That description is
true at the ends and useless in the middle, where both devices conduct and the
gain lives. The honest statement is a current balance: for any input voltage,
the output settles wherever the NMOS drain current equals the PMOS source
current, each device obeying the same triode and saturation equations used
throughout this chapter.

$$I_{Dn}(v_{in}, v_{out}) = I_{Dp}(v_{in}, v_{out})$$

Solving that equation at every input voltage traces the **voltage transfer
characteristic**, or VTC.

![Voltage transfer characteristic of a CMOS inverter on a 5 volt supply, obtained by balancing the NMOS and PMOS currents at each input voltage. Matched devices put the switching threshold exactly at 2.5 volts, where the slope reaches minus 27; the unity-gain points are at 2.06 and 2.94 volts, giving equal noise margins of 2.06 volts.](/courses/fe-ee/figures/elec2-cmos-vtc.svg)

Five regions are visible in that single curve, and naming them is a standard
exam question:

| Input range (VDD = 5 V, Vt = 1 V) | NMOS | PMOS | Output |
|---|---|---|---|
| $v_{in} < 1\\ \\mathrm{V}$ | cutoff | triode | held at 5 V |
| $1 < v_{in} < 2.5\\ \\mathrm{V}$ | saturation | triode | falling |
| $v_{in} = 2.5\\ \\mathrm{V}$ | saturation | saturation | steep transition |
| $2.5 < v_{in} < 4\\ \\mathrm{V}$ | triode | saturation | falling |
| $v_{in} > 4\\ \\mathrm{V}$ | triode | cutoff | held at 0 V |

The steep middle row is the interesting one. With both devices saturated, both
have high output resistance, and the stage is momentarily a high-gain amplifier
— the computed slope there is −27. A digital gate is an analog amplifier that
is only ever allowed to visit its high-gain region in passing.

## 8.2 Worked example: switching threshold and noise margins

**Given**: the inverter of the figure — matched devices, equal $K$,
$V_{tn} = \\lvert V_{tp} \\rvert = 1\\ \\mathrm{V}$, $V_{DD} = 5\\ \\mathrm{V}$.
The unity-gain points read $V_{IL} = 2.06\\ \\mathrm{V}$ and
$V_{IH} = 2.94\\ \\mathrm{V}$. Find the switching threshold and both noise
margins.

**Handbook relations**: with both devices in saturation at the trip point,
setting the currents equal gives

$$K\\,(V_{M} - V_{tn})^{2} = K\\,(V_{DD} - V_{M} - \\lvert V_{tp} \\rvert)^{2}$$

Taking the positive root of both sides and solving for $V_{M}$,

$$V_{M} = \\frac{V_{DD} - \\lvert V_{tp} \\rvert + V_{tn}}{2} = \\frac{5 - 1 + 1}{2} = 2.5\\ \\mathrm{V}$$

The noise margins are the gaps between what a driving gate guarantees and what
a receiving gate tolerates:

$$NM_{H} = V_{OH} - V_{IH} = 5.00 - 2.94 = 2.06\\ \\mathrm{V}$$

$$NM_{L} = V_{IL} - V_{OL} = 2.06 - 0.00 = 2.06\\ \\mathrm{V}$$

**Answer**: $V_{M} = 2.5\\ \\mathrm{V}$ with both margins at 2.06 V, which is
41 percent of the supply in each direction.

**Consistency check**: symmetry demands $NM_{H} = NM_{L}$ for matched devices,
and $V_{IL} + V_{IH} = 2.06 + 2.94 = 5.00\\ \\mathrm{V} = V_{DD}$ confirms the
curve is symmetric about mid-supply ✓.

**Why this matters**: 2.06 V of margin on a 5 V rail is enormous next to
bipolar logic families, and it is the reason CMOS is difficult to upset with
ground bounce or coupled noise. It also explains the design rule that mismatched
device widths shift $V_{M}$ away from mid-supply and trade one margin for the
other — a wider PMOS pulls $V_{M}$ up, improving the low margin and hurting the
high one.

## 8.3 Where the power goes

An idle CMOS gate really does dissipate almost nothing: one device is always
off, so no DC path exists between the rails. Power appears only when the gate
*changes*, and it comes from three places.

**Dynamic (capacitive) power.** Each low-to-high transition draws a charge
$C V_{DD}$ from the supply and stores $\\tfrac{1}{2}C V_{DD}^{2}$ in the load,
dissipating the other half in the PMOS channel; the following high-to-low
transition dumps the stored half in the NMOS channel. One full cycle therefore
costs one $C V_{DD}^{2}$:

$$P_{dyn} = f_{sw}\\,C_{L}\\,V_{DD}^{2}$$

**Short-circuit (crowbar) power.** During the transition, while
$V_{t} < v_{in} < V_{DD} - \\lvert V_{tp} \\rvert$, both devices conduct and a
current spike flows directly from rail to rail. It peaks where both are
saturated, at $v_{in} = V_{DD}/2$.

**Static (leakage) power.** Subthreshold conduction and gate-oxide tunnelling,
negligible in the FE exam's device generation and dominant in modern ones.

## 8.4 Worked example: dynamic power and the crowbar spike

**Given**: a gate driving $C_{L} = 10\\ \\mathrm{pF}$, switching at
$f_{sw} = 100\\ \\mathrm{MHz}$ on a 5 V supply, built from the matched devices
above with $K = 0.5\\ \\mathrm{mA/V^{2}}$. Find the dynamic power, the effect of
halving the supply, and the peak crowbar current.

**Handbook relations**: $P_{dyn} = f C_{L}V_{DD}^{2}$, and at mid-supply both
devices are saturated with overdrive $V_{DD}/2 - V_{t}$.

**Substitution**:

$$P_{dyn} = 100\\ \\mathrm{MHz} \\times 10\\ \\mathrm{pF} \\times (5\\ \\mathrm{V})^{2} = 10^{8} \\times 10^{-11} \\times 25 = 25\\ \\mathrm{mW}$$

$$P_{dyn}(2.5\\ \\mathrm{V}) = 10^{8} \\times 10^{-11} \\times 6.25 = 6.25\\ \\mathrm{mW}$$

$$I_{peak} = K\\,(V_{DD}/2 - V_{t})^{2} = 0.5\\ \\mathrm{mA/V^{2}} \\times (1.5\\ \\mathrm{V})^{2} = 1.13\\ \\mathrm{mA}$$

**Answer**: 25 mW at 5 V, 6.25 mW at 2.5 V, and a 1.13 mA rail-to-rail spike at
the crossing point.

**Consistency check**: the supply enters squared, so halving it should quarter
the power — and $25/4 = 6.25$ ✓. That quadratic dependence, not any clever
circuit trick, is why every processor generation has chased a lower core
voltage.

**The trap**: many references write the switching energy as
$\\tfrac{1}{2}C V_{DD}^{2}$, which is the energy *stored* on the capacitor, not
the energy drawn from the supply over a complete cycle. Charging dissipates one
half and discharging the other, so a full cycle costs $C V_{DD}^{2}$ and the
half-factor answer, 12.5 mW here, is the classic distractor.`,
        examTip: 'For a matched CMOS inverter the trip point is V_DD/2 and the two noise margins are equal — recognising that symmetry answers most exam questions on the VTC without solving anything. When the devices are NOT matched, use V_M = (V_DD − |V_tp| + V_tn·√r)/(1 + √r) with r the ratio of the device transconductance parameters, and remember which way it moves: strengthening the PMOS raises V_M.',
        importantNote: 'CMOS static power is near zero but dynamic power is not, and dynamic power is what sets a chip\'s thermal budget. P = f·C·V² says the three available levers are frequency, capacitance and supply voltage, and only the supply enters squared — which is why voltage scaling, not clock reduction, has been the dominant power-saving strategy.',
      },
      {
        id: 'mos-problem-set-a',
        title: '9. Problem Set A: Regions, Bias, and the Quadratic',
        content: `## 9.1 How to work this set

Six FE-style items follow. Each is solvable in about three minutes with the
handbook relations already stated in this chapter, and each was chosen because
a specific wrong habit produces a specific wrong answer that will be sitting on
the answer sheet waiting for you. Work all six before reading Section 9.3, and
in every one write down the region you are assuming before you write any
current. Currents are in mA and resistances in kΩ unless stated otherwise, so
their product is in volts throughout.

## 9.2 Problem Set A: regions, bias, and the quadratic

**A1.** An NMOS device has $K = 0.5\\ \\mathrm{mA/V^{2}}$ and
$V_{t} = 1\\ \\mathrm{V}$. It is biased at $V_{GS} = 3\\ \\mathrm{V}$ and
$V_{DS} = 5\\ \\mathrm{V}$. What is the drain current?

**A2.** The same device now has its drain voltage reduced to
$V_{DS} = 0.5\\ \\mathrm{V}$, with $V_{GS}$ unchanged at 3 V. What is the drain
current?

**A3.** A process has $\\mu _{n}C_{ox} = 100\\ \\mathrm{\\mu A/V^{2}}$; the device
has $W/L = 20$ and $V_{t} = 0.8\\ \\mathrm{V}$. What gate-source voltage puts
0.4 mA through it in saturation?

**A4.** In a divider-biased stage, $V_{DD} = 12\\ \\mathrm{V}$, the gate sits at
$V_{G} = 5\\ \\mathrm{V}$, $R_{S} = 2\\ \\mathrm{k}\\Omega$,
$R_{D} = 3\\ \\mathrm{k}\\Omega$, $K = 0.25\\ \\mathrm{mA/V^{2}}$ and
$V_{t} = 1\\ \\mathrm{V}$. Find $I_{D}$, $V_{GS}$ and $V_{DS}$, and confirm the
region.

**A5.** A PMOS device has $V_{t} = -1\\ \\mathrm{V}$ and
$K = 0.5\\ \\mathrm{mA/V^{2}}$. Its source is at 5 V, its gate at 2 V, and its
drain at 1 V. Identify the region and find the drain current.

**A6.** An n-channel JFET has $I_{DSS} = 10\\ \\mathrm{mA}$ and
$V_{p} = -5\\ \\mathrm{V}$. It is self-biased with the gate returned to ground
through 1 MΩ and $R_{S} = 1\\ \\mathrm{k}\\Omega$ in the source. Find $I_{D}$
and $V_{GS}$.

## 9.3 Full solutions, and the distractor each one sets

**A1.** Test the region first: $V_{ov} = 3 - 1 = 2\\ \\mathrm{V}$, and
$V_{DS} = 5 \\ge 2$, so the device is saturated.

$$I_{D} = 0.5\\ \\mathrm{mA/V^{2}} \\times (2\\ \\mathrm{V})^{2} = 2.0\\ \\mathrm{mA}$$

*Trap*: squaring $V_{GS}$ instead of the overdrive gives
$0.5 \\times 9 = 4.5\\ \\mathrm{mA}$, which is the standard wrong choice on this
item. The threshold is not decoration; it is subtracted before squaring.

**A2.** The overdrive is still 2 V, but now $V_{DS} = 0.5 < 2$, so the device
is in **triode** and the square law does not apply.

$$I_{D} = 0.5\\,[\\,2(2)(0.5) - (0.5)^{2}\\,] = 0.5\\,(2 - 0.25) = 0.875\\ \\mathrm{mA}$$

*Trap*: reusing A1's answer of 2.0 mA. The problem changed only the drain
voltage, which is exactly the quantity the region test depends on. Whenever an
exam gives two versions of one device, the second version is usually testing
the region boundary.

**A3.** Convert the process parameters to $K$ first, remembering the factor of
two:

$$K = (\\mu _{n}C_{ox}/2)(W/L) = (100\\ \\mathrm{\\mu A/V^{2}}/2)(20) = 1.0\\ \\mathrm{mA/V^{2}}$$

$$V_{ov} = \\sqrt{I_{D}/K} = \\sqrt{0.4\\ \\mathrm{mA}/1.0\\ \\mathrm{mA/V^{2}}} = 0.632\\ \\mathrm{V}$$

$$V_{GS} = 0.632 + 0.8 = 1.43\\ \\mathrm{V}$$

*Trap*: omitting the division by two gives $K = 2\\ \\mathrm{mA/V^{2}}$,
$V_{ov} = 0.447\\ \\mathrm{V}$ and $V_{GS} = 1.25\\ \\mathrm{V}$ — a plausible
looking answer that is wrong by 12 percent. The handbook writes the saturation
current with $\\mu _{n}C_{ox}/2$ for a reason.

**A4.** Gate current is zero, so $V_{G} = 5\\ \\mathrm{V}$ regardless of the
divider resistances, and $V_{GS} = 5 - 2 I_{D}$ with $I_{D}$ in mA and
resistance in kΩ. Substituting into the square law,

$$I_{D} = 0.25\\,(5 - 2I_{D} - 1)^{2} = 0.25\\,(4 - 2I_{D})^{2}$$

$$I_{D}^{2} - 5 I_{D} + 4 = 0 \\;\\Longrightarrow\\; I_{D} = 1\\ \\mathrm{mA}\\ \\text{or}\\ 4\\ \\mathrm{mA}$$

Test both. At 4 mA, $V_{GS} = 5 - 8 = -3\\ \\mathrm{V}$, below threshold, so the
device would be off — reject. At 1 mA, $V_{GS} = 3\\ \\mathrm{V}$ and
$V_{ov} = 2\\ \\mathrm{V}$, which is consistent.

$$V_{DS} = V_{DD} - I_{D}(R_{D} + R_{S}) = 12 - 1(3 + 2) = 7\\ \\mathrm{V}$$

Since $7 \\ge 2$, saturation is confirmed ✓.

*Trap*: taking the larger root, 4.0 mA. Both roots satisfy the algebra; only
one satisfies the transistor. Substitute each back into $V_{GS} = V_{G} - I_{D}R_{S}$
before choosing.

**A5.** For a PMOS, work with source-referenced magnitudes.
$V_{SG} = 5 - 2 = 3\\ \\mathrm{V}$, so the overdrive is
$V_{SG} - \\lvert V_{t} \\rvert = 2\\ \\mathrm{V}$. The source-drain voltage is
$V_{SD} = 5 - 1 = 4\\ \\mathrm{V}$, and $4 \\ge 2$, so the device is saturated.

$$I_{D} = K\\,(V_{SG} - \\lvert V_{t} \\rvert)^{2} = 0.5 \\times 2^{2} = 2.0\\ \\mathrm{mA}$$

*Trap*: writing $V_{GS} = 2 - 5 = -3\\ \\mathrm{V}$ and then feeding $-3$ into
the NMOS form gives $0.5(-3-(-1))^{2}$, which happens to be right here by
accident, but the same habit fails as soon as the threshold and the supply do
not line up so conveniently. Convert to magnitudes deliberately rather than
hoping the signs cancel.

**A6.** A JFET obeys the $I_{DSS}$ law, and self-bias sets
$V_{GS} = -I_{D}R_{S}$, which with $I_{D}$ in mA and $R_{S} = 1\\ \\mathrm{k}\\Omega$
is numerically $V_{GS} = -I_{D}$.

$$I_{D} = 10\\,(1 - (-I_{D})/(-5))^{2} = 10\\,(1 - I_{D}/5)^{2}$$

$$0.4\\,I_{D}^{2} - 5 I_{D} + 10 = 0 \\;\\Longrightarrow\\; I_{D} = 2.5\\ \\mathrm{mA}\\ \\text{or}\\ 10\\ \\mathrm{mA}$$

The 10 mA root needs $V_{GS} = -10\\ \\mathrm{V}$, well past the −5 V pinch-off,
where the channel is closed. Take $I_{D} = 2.5\\ \\mathrm{mA}$, giving
$V_{GS} = -2.5\\ \\mathrm{V}$, and verify:
$10(1 - 0.5)^{2} = 2.5\\ \\mathrm{mA}$ ✓.

*Trap*: reaching for $K$ and $V_{t}$. The problem supplied $I_{DSS}$ and
$V_{p}$, which is the exam telling you which parabola to use. Note also that
$I_{D} = I_{DSS}/4$ at $V_{GS} = V_{p}/2$, the same half-and-quarter pattern
seen in Section 3.3.`,
        examTip: 'Every problem in this set was decided by a region test or a root test, not by the arithmetic. Build the habit of writing two lines before any answer: the assumed region with its inequality, and — if a quadratic appeared — the back-substitution of each root into V_GS. On the FE, those two lines are worth more marks per second than any algebraic speed.',
      },
      {
        id: 'mos-problem-set-b',
        title: '10. Problem Set B: Small-Signal, Switching, and CMOS',
        content: `## 10.1 Scope of this set

Six more items, drawn from Sections 5 through 8 rather than from the biasing
material. Take $V_{T} = 26\\ \\mathrm{mV}$ wherever a bipolar comparison
appears, and assume every device is in saturation unless a problem gives you
reason to check. These are the small-signal and switching questions, so the
arithmetic is lighter and the conceptual traps are heavier.

## 10.2 Practice Problems: small signal, switching, and CMOS

**B1.** A MOSFET has $k' = \\mu _{n}C_{ox}(W/L) = 1\\ \\mathrm{mA/V^{2}}$ and is
biased at $I_{D} = 1\\ \\mathrm{mA}$. Find $g_{m}$, and compare it with a
bipolar transistor carrying the same 1 mA.

**B2.** The same MOSFET is rebiased to 4 mA. By what factor does $g_{m}$
change?

**B3.** A device with $k' = 1\\ \\mathrm{mA/V^{2}}$ runs at 0.5 mA and has
channel-length modulation $\\lambda = 0.05\\ \\mathrm{V^{-1}}$. Find the output
resistance and the intrinsic gain $g_{m}r_{o}$.

**B4.** Using the Q-point from problem A4 ($I_{D} = 1\\ \\mathrm{mA}$,
$V_{ov} = 2\\ \\mathrm{V}$, $R_{D} = 3\\ \\mathrm{k}\\Omega$,
$R_{S} = 2\\ \\mathrm{k}\\Omega$), find the common-source voltage gain with the
source resistor bypassed, and again with it unbypassed.

**B5.** A source follower has $g_{m} = 2\\ \\mathrm{mS}$ and
$R_{S} = 1\\ \\mathrm{k}\\Omega$. Find the voltage gain and the output
resistance seen looking into the source.

**B6.** A CMOS gate drives 10 pF at 100 MHz from a 5 V supply. Find the dynamic
power, then the power after the supply is reduced to 3.3 V.

## 10.3 Full solutions, and the distractor each one sets

**B1.** Use the current form of the transconductance.

$$g_{m} = \\sqrt{2 k' I_{D}} = \\sqrt{2 \\times 1\\ \\mathrm{mA/V^{2}} \\times 1\\ \\mathrm{mA}} = 1.41\\ \\mathrm{mS}$$

$$g_{m,BJT} = I_{C}/V_{T} = 1\\ \\mathrm{mA}/26\\ \\mathrm{mV} = 38.5\\ \\mathrm{mS}$$

The bipolar leads by a factor of 27.2, the crossing marked on the figure in
Section 5.5.

*Trap*: using $2 I_{D}/V_{ov}$ without first finding $V_{ov}$. It gives the
same answer only if you compute $V_{ov} = \\sqrt{2 I_{D}/k'} = 1.41\\ \\mathrm{V}$
first; guessing an overdrive of 1 V instead returns 2 mS.

**B2.** Since $g_{m} \\propto \\sqrt{I_{D}}$, quadrupling the current doubles
the transconductance:

$$g_{m} = \\sqrt{2 \\times 1\\ \\mathrm{mA/V^{2}} \\times 4\\ \\mathrm{mA}} = 2.83\\ \\mathrm{mS}$$

*Trap*: 5.66 mS, from assuming $g_{m}$ scales with current the way a bipolar's
does. That linear intuition is correct for the BJT and wrong for the FET, and
telling them apart is the point of the problem.

**B3.** Output resistance from channel-length modulation, then the product with
transconductance:

$$r_{o} = \\frac{1}{\\lambda I_{D}} = \\frac{1}{0.05\\ \\mathrm{V^{-1}} \\times 0.5\\ \\mathrm{mA}} = 40\\ \\mathrm{k}\\Omega$$

$$g_{m} = \\sqrt{2 \\times 1\\ \\mathrm{mA/V^{2}} \\times 0.5\\ \\mathrm{mA}} = 1.0\\ \\mathrm{mS}, \\qquad g_{m}r_{o} = 1.0\\ \\mathrm{mS} \\times 40\\ \\mathrm{k}\\Omega = 40$$

*Trap*: quoting $r_{o} = 1/\\lambda = 20\\ \\Omega$ by dropping the current. The
units expose it immediately — volts per amp requires a current in the
denominator.

**B4.** First the transconductance at the stated Q-point,
$g_{m} = 2 I_{D}/V_{ov} = 2(1)/2 = 1.0\\ \\mathrm{mS}$. Then

$$A_{v} = -g_{m}R_{D} = -1.0\\ \\mathrm{mS} \\times 3\\ \\mathrm{k}\\Omega = -3.0$$

$$A_{v,unbypassed} = \\frac{-g_{m}R_{D}}{1 + g_{m}R_{S}} = \\frac{-3.0}{1 + 1.0 \\times 2} = -1.0$$

*Trap*: computing $g_{m} = 2 I_{D}/V_{GS} = 2/3 = 0.67\\ \\mathrm{mS}$ and
reporting a gain of −2.0. The denominator of the transconductance formula is
the overdrive, never the gate-source voltage.

**B5.** The follower divides against its own transconductance:

$$A_{v} = \\frac{g_{m}R_{S}}{1 + g_{m}R_{S}} = \\frac{2}{1 + 2} = 0.667$$

$$R_{out} = (1/g_{m}) \\parallel R_{S} = 500\\ \\Omega \\parallel 1000\\ \\Omega = 333\\ \\Omega$$

*Trap*: answering 1.00 and 500 Ω. Unity gain is the limiting case for
$g_{m}R_{S} \\gg 1$, and with $g_{m}R_{S} = 2$ that limit is not close. A
follower with a modest $g_{m}R_{S}$ product is a poor buffer, which is a real
design warning and not a trick.

**B6.** Dynamic power is quadratic in supply voltage:

$$P = f C_{L}V_{DD}^{2} = 10^{8} \\times 10\\times 10^{-12} \\times 25 = 25\\ \\mathrm{mW}$$

$$P(3.3\\ \\mathrm{V}) = 10^{8} \\times 10 \\times 10^{-12} \\times 10.89 = 10.9\\ \\mathrm{mW}$$

The supply fell by a third and the power fell by 56 percent.

*Trap*: inserting a factor of one half and answering 12.5 mW. That half is the
energy stored on the load capacitance, not the energy the supply delivers over
a complete charge-and-discharge cycle.`,
        examTip: 'Small-signal answers are only as good as the Q-point they came from, so on a two-part problem never carry a rounded bias current into the gain calculation — carry the exact value and round once at the end. And check the sign: a common-source stage inverts, a source follower does not, and an answer with the wrong sign is wrong even when its magnitude matches a choice on the sheet.',
        importantNote: 'The recurring theme across both problem sets is that FET results scale as square roots, not linearly. Doubling the current does not double g_m, and halving the supply does not halve dynamic power. Distractors on this material are almost always built from the linear intuition a bipolar circuit would justify.',
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
is GBW divided by the **noise gain** — the factor 1 + R_f/R_in that the feedback
network presents to the amplifier, which for this inverting stage is 11 even
though the signal gain is −10. The bandwidth is therefore 1 MHz/11 = **91 kHz**,
while a *non-inverting* stage built from the same two resistors has a signal
gain of 11 as well and reaches the same 91 kHz. Gain is traded against bandwidth
one-for-one, so an inverting stage at −100 works only to about 9.9 kHz. This is
why the ideal assumption of infinite bandwidth has to be abandoned as soon as a
question mentions frequency at all, and Section 4 works the distinction out in
full.

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

- If V+ supply = +15 V and V− supply = −15 V, output saturates at approximately **$\\pm 13$ to $\\pm 14\\ \\mathrm{V}$** (1–2 V below rails for standard op-amps)
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
| Summing | **$-Rf\\cdot \\sum (Vi/Ri)$** | One term per input |
| Difference | **(Rf/Rin)·(V2−V1)** | When ratios matched |
| Integrator | **−1/(sRC)** | C replaces Rf |
| Differentiator | **−sRC** | C replaces Rin |`,
        examTip: 'On the FE exam, always check for saturation after computing the ideal output. If the calculated output exceeds the supply voltage, the answer is the saturation voltage, not the calculated value. This trap appears in problems where the gain is very high (Av > 50) or the input is unexpectedly large.',
        importantNote: 'When an op-amp saturates, the virtual short assumption breaks down. The output is stuck at the rail, and V⁺ is no longer equal to V⁻. If an exam problem asks what happens when positive feedback is applied (output to + input), the answer is always a comparator or latch — the output slams to one rail.',
      },
      {
        id: 'opamp-gbw-noise-gain',
        title: '4. Gain-Bandwidth Product and the Noise Gain',
        content: `## 4.1 Where the finite bandwidth comes from

An internally compensated op-amp is deliberately built with a single dominant
pole, so its open-loop gain is

$$A(f) = \\frac{A_{0}}{1 + j f/f_{0}}$$

with a typical $A_{0} = 10^{5}$ (100 dB) and a first corner as low as
$f_{0} = 10\\ \\mathrm{Hz}$. Above that corner the magnitude falls at 20 dB per
decade, which means the product of gain and frequency is constant:

$$\\lvert A \\rvert \\cdot f \\approx A_{0}f_{0} \\equiv GBW = 10^{5} \\times 10\\ \\mathrm{Hz} = 1\\ \\mathrm{MHz}$$

That single-pole shape is not an accident of manufacturing; it is designed in,
because a one-pole open-loop response guarantees stability at any closed-loop
gain down to unity.

![Closed-loop magnitude responses at gains of 10, 100 and 1000 under a 1 megahertz gain-bandwidth product, drawn from the exact feedback expression rather than sketched. The dashed open-loop curve starts at 100 decibels and falls 20 decibels per decade from 10 hertz; the three closed-loop curves are flat then break at 100 kilohertz, 10 kilohertz and 1 kilohertz respectively, and all three merge into the open-loop curve at 1 megahertz.](/courses/fe-ee/figures/elec2-opamp-gbw.svg)

Each closed-loop curve is flat where feedback has gain to spare and bends over
where it runs out. The bend is at

$$f_{3dB} = \\frac{GBW}{\\text{noise gain}}$$

and every curve rejoins the open-loop line at the same 1 MHz. That common
endpoint is the visual statement of the trade: whatever you take in gain you
give back in bandwidth, and the product is a property of the part.

## 4.2 Noise gain is the quantity that matters

The bandwidth denominator is **not** the signal gain. It is the reciprocal of
the feedback factor $\\beta$, the fraction of the output fed back to the
inverting input, and that quantity has its own name:

$$\\text{noise gain} = 1/\\beta = 1 + R_{f}/R_{in}$$

For a non-inverting amplifier the signal gain and the noise gain are the same
number, which is why the two are so often confused. For an inverting amplifier
they differ by exactly one: signal gain $-R_{f}/R_{in}$, noise gain
$1 + R_{f}/R_{in}$. The feedback network cannot tell which terminal the signal
arrived at; it only knows the divider ratio, so the divider ratio is what sets
the loop.

| Stage (R_in = 1 kΩ, R_f = 9 kΩ) | Signal gain | Noise gain | Bandwidth at GBW = 1 MHz |
|---|---|---|---|
| Non-inverting | +10 | 10 | 100 kHz |
| Inverting | $-9$ | 10 | 100 kHz |
| Buffer (R_f = 0) | +1 | 1 | 1 MHz |

Read the middle row carefully. The inverting stage has *less* signal gain than
the non-inverting one built from the same parts, and exactly the same
bandwidth. It is a slightly worse deal, and that is the honest reason to reach
for the non-inverting topology when bandwidth is tight.

## 4.3 Worked example: bandwidth of a non-inverting stage

**Given**: a non-inverting amplifier with $R_{in} = 1\\ \\mathrm{k}\\Omega$ to
ground and $R_{f} = 49\\ \\mathrm{k}\\Omega$, built from a part with
$GBW = 1\\ \\mathrm{MHz}$ and $A_{0} = 10^{5}$. Find the closed-loop gain, the
bandwidth, and the loop gain available at DC.

**Handbook relations**: $A_{cl} = 1 + R_{f}/R_{in}$,
$f_{3dB} = GBW/A_{cl}$ for a non-inverting stage, and loop gain
$= A_{0}\\beta$.

**Substitution**:

$$A_{cl} = 1 + 49/1 = 50$$

$$f_{3dB} = \\frac{1\\ \\mathrm{MHz}}{50} = 20\\ \\mathrm{kHz}$$

$$A_{0}\\beta = 10^{5}/50 = 2000$$

**Answer**: gain 50, bandwidth 20 kHz, and 2000 of loop gain at DC.

**Why the loop gain matters**: it is the factor by which feedback suppresses
everything you did not want — distortion, output impedance, and the difference
between the ideal gain formula and reality. With 2000 to spend at DC, the
closed-loop gain is within 0.05 percent of the ideal 50. At 20 kHz the loop
gain has fallen to about 1, and the same formula is 3 dB optimistic. The ideal
model does not fail suddenly; it degrades in step with the loop gain.

## 4.4 Worked example: the same resistors, wired inverting

**Given**: the same $R_{in} = 1\\ \\mathrm{k}\\Omega$ and
$R_{f} = 49\\ \\mathrm{k}\\Omega$, now wired as an inverting amplifier with the
non-inverting terminal grounded. Find the signal gain and the bandwidth.

**Handbook relations**: signal gain $-R_{f}/R_{in}$, bandwidth
$GBW/(1 + R_{f}/R_{in})$.

**Substitution**:

$$A_{cl} = -49/1 = -49, \\qquad \\text{noise gain} = 1 + 49 = 50$$

$$f_{3dB} = \\frac{1\\ \\mathrm{MHz}}{50} = 20\\ \\mathrm{kHz}$$

**Answer**: a signal gain of −49 with a bandwidth of 20 kHz.

**The trap**: dividing by the signal gain gives
$1\\ \\mathrm{MHz}/49 = 20.4\\ \\mathrm{kHz}$, which is close enough to look
right and wrong for a reason worth understanding. At low gains the error is
severe rather than cosmetic: a unity-gain *inverter* has a signal gain of −1, a
noise gain of 2, and therefore only half the bandwidth of a unity-gain
follower, which has a noise gain of 1. Same part, same nominal gain magnitude,
factor-of-two difference in bandwidth.

## 4.5 Rise time, the time-domain face of the same limit

Exam questions sometimes ask for a step response instead of a bandwidth. For a
single-pole system the two are locked together:

$$t_{r} \\approx \\frac{0.35}{f_{3dB}}$$

so the 20 kHz stage above settles a small step in roughly
$0.35/20\\ \\mathrm{kHz} = 17.5\\ \\mathrm{\\mu s}$. This relation holds only for
*small* steps, where the amplifier stays linear. Push the step larger and the
output stops obeying the bandwidth limit altogether and obeys a different one,
which is the subject of Section 5.`,
        examTip: 'Divide GBW by the noise gain 1 + Rf/Rin, not by the signal gain. For non-inverting stages the two are identical and nothing goes wrong; for inverting stages the noise gain is one larger, and the discrepancy is largest exactly where FE problems like to sit — at low gain. A unity-gain inverter gets half the bandwidth of a unity-gain buffer.',
        importantNote: 'GBW characterises small-signal behaviour only. An amplifier can be comfortably within its bandwidth and still reproduce a large signal badly, because slew rate is a separate specification with a separate cause. Never conclude from "the frequency is below f_3dB" that the output is undistorted.',
      },
      {
        id: 'opamp-slew-rate',
        title: '5. Slew Rate and Full-Power Bandwidth',
        content: `## 5.1 A limit that bandwidth cannot explain

Inside the op-amp, a fixed tail current charges the compensation capacitor.
Once the input step is large enough to steer the entire tail current to one
side, the output can rise no faster than that current allows:

$$SR = \\frac{dv_{out}}{dt}\\bigg\\rvert_{max} = \\frac{I_{tail}}{C_{c}}$$

This is a **constant volts-per-second**, independent of frequency and
independent of the closed-loop gain. It is a large-signal limit, and it is the
reason an amplifier that measures perfectly on a 10 mV test signal can turn a
5 V sine into a triangle.

Compare a sinusoid's steepest slope against it. For
$v(t) = A\\sin(2\\pi f t)$ the maximum slope occurs at the zero crossing:

$$\\left. \\frac{dv}{dt} \\right\\rvert_{max} = 2\\pi f A$$

The output is faithful only while $2\\pi f A \\le SR$, which rearranges into a
ceiling on amplitude that falls as $1/f$:

$$A_{max}(f) = \\frac{SR}{2\\pi f}$$

![Largest undistorted output amplitude against frequency for an amplifier with a slew rate of 0.5 volts per microsecond and a 13.5 volt output swing limit. The flat ceiling is the rail; the falling hyperbola is the slew limit; they meet at the full-power bandwidth of 5.89 kilohertz, and at 20 kilohertz the largest undistorted sine is 3.98 volts peak.](/courses/fe-ee/figures/elec2-opamp-slew.svg)

Two ceilings, one usable region. Below the corner the rails are the binding
constraint and the amplifier will deliver its full swing; above it the slew
rate binds and the achievable amplitude falls off inversely with frequency.
The corner where they meet has a name.

## 5.2 Full-power bandwidth

The **full-power bandwidth** is the highest frequency at which the amplifier
can still swing to its rated peak output $V_{p}$:

$$f_{FP} = \\frac{SR}{2\\pi V_{p}}$$

It is a single number that captures both specifications at once, and it is
always far below the small-signal bandwidth. The part in the figure has a
1 MHz GBW and a full-power bandwidth of 5.89 kHz — a factor of 170 between
what it can do with millivolts and what it can do with volts.

## 5.3 Worked example: is this signal slew-limited?

**Given**: an op-amp with $SR = 0.5\\ \\mathrm{V/\\mu s}$ is asked to produce a
5 V peak sine wave at 10 kHz. Is the output distorted?

**Handbook relation**: compare the demanded slope $2\\pi f A$ with $SR$.

**Substitution**:

$$2\\pi f A = 2\\pi \\times 10^{4}\\ \\mathrm{Hz} \\times 5\\ \\mathrm{V} = 3.14 \\times 10^{5}\\ \\mathrm{V/s} = 0.314\\ \\mathrm{V/\\mu s}$$

**Answer**: 0.314 V/µs is below the 0.5 V/µs the amplifier can supply, so the
output is clean. The margin is only 1.6 times, so raising either the amplitude
or the frequency by 60 percent would push it over.

**Consistency check** from the other direction: the largest undistorted
amplitude at 10 kHz is
$A_{max} = 0.5\\ \\mathrm{V/\\mu s}/(2\\pi \\times 10\\ \\mathrm{kHz}) = 7.96\\ \\mathrm{V}$,
and the requested 5 V is comfortably under it ✓.

## 5.4 Worked example: two ceilings at 20 kHz

**Given**: the same 0.5 V/µs part on ±15 V supplies, with a usable swing of
±13.5 V. Find the full-power bandwidth, and the largest undistorted sine at
20 kHz.

**Handbook relations**: $f_{FP} = SR/(2\\pi V_{p})$ and
$A_{max} = SR/(2\\pi f)$.

**Substitution**:

$$f_{FP} = \\frac{0.5 \\times 10^{6}\\ \\mathrm{V/s}}{2\\pi \\times 13.5\\ \\mathrm{V}} = 5.89\\ \\mathrm{kHz}$$

$$A_{max}(20\\ \\mathrm{kHz}) = \\frac{0.5 \\times 10^{6}}{2\\pi \\times 2 \\times 10^{4}} = 3.98\\ \\mathrm{V\\ peak}$$

**Answer**: 5.89 kHz and 3.98 V peak, both marked on the figure.

**Reading the result**: at 20 kHz this amplifier can deliver 29 percent of its
rated swing. Nothing in the gain-bandwidth specification says so — 20 kHz is
one fiftieth of the 1 MHz GBW, deep inside the small-signal passband. Slew rate
and bandwidth are independent specifications and both must be checked.

**The trap**: answering with $GBW/A_{cl}$. A question that gives you a slew
rate in volts per microsecond is asking a large-signal question, and the
gain-bandwidth product does not appear in the answer at all.

## 5.5 What slew limiting looks like

| Symptom | Slew limiting | Bandwidth limiting |
|---|---|---|
| Depends on amplitude | yes | no |
| Sine output shape | straightening toward a triangle | still a sine |
| Square-wave edges | constant-slope ramp | exponential curve |
| Cured by reducing signal | yes | no |
| Cured by reducing gain | no | yes |

The amplitude dependence in the first row is the diagnostic. A stage whose
distortion vanishes when the input is halved is slew limited; one whose
frequency response is unchanged when the input is halved is bandwidth limited.
The square-wave test in the third row is the classic bench measurement, and it
is also how slew rate is specified: drive a large step and measure the slope of
the straight-line output.`,
        examTip: 'Two different questions hide behind the phrase "the amplifier cannot follow the signal". If the problem gives volts per microsecond, use A_max = SR/(2πf) or f_FP = SR/(2πV_p). If it gives a gain-bandwidth product, use f_3dB = GBW/noise gain. When both are given, check both — the answer is whichever ceiling is lower at the stated frequency.',
        importantNote: 'Slew rate is set by internal current and compensation capacitance, so it does not improve when you lower the closed-loop gain. This is exactly opposite to the gain-bandwidth trade and is the single most useful fact for telling the two limits apart on an exam.',
      },
      {
        id: 'opamp-clipping',
        title: '6. Clipping: When the Answer Is the Rail',
        content: `## 6.1 The formula stops at the supply

Every closed-loop gain expression in this chapter assumes the op-amp can
produce whatever output the feedback demands. It cannot. A standard op-amp on
±15 V supplies swings to roughly ±13.5 V, losing about 1.5 V per rail to the
output stage; rail-to-rail parts do better, reaching within 50 to 200 mV. The
transfer characteristic is therefore the ideal straight line with a clamp:

$$v_{out} = \\mathrm{clip}\\!\\left(A_{cl}\\,v_{in},\\; -V_{sat},\\; +V_{sat}\\right)$$

and the input at which the clamp takes over follows immediately:

$$\\lvert v_{in} \\rvert _{break} = \\frac{V_{sat}}{\\lvert A_{cl} \\rvert}$$

![Left, the transfer characteristic of a gain of minus ten stage clamped at plus and minus 13.5 volts, with the ideal straight line dashed behind it and break points marked at plus and minus 1.35 volts of input. Right, a 2 volt peak sinusoid through the same stage, flat-topped against both rails for 53 percent of every cycle.](/courses/fe-ee/figures/elec2-opamp-clipping.svg)

The dashed line in the left panel is the answer the gain formula gives; the
solid line is the answer the circuit gives. For inputs under 1.35 V they
coincide exactly, which is why the ideal analysis is so useful. Beyond that,
the formula would promise −25 V from a supply that has 15 V to offer.

## 6.2 Worked example: linear or clipped?

**Given**: an inverting stage with $R_{in} = 1\\ \\mathrm{k}\\Omega$,
$R_{f} = 10\\ \\mathrm{k}\\Omega$, on ±15 V supplies with
$V_{sat} = 13.5\\ \\mathrm{V}$. Find the output for inputs of 0.5 V and 2.0 V.

**Handbook relations**: $A_{cl} = -R_{f}/R_{in}$, then compare the ideal output
with $V_{sat}$.

**Substitution**:

$$A_{cl} = -10, \\qquad \\lvert v_{in} \\rvert _{break} = 13.5/10 = 1.35\\ \\mathrm{V}$$

At 0.5 V in: $-10 \\times 0.5 = -5.0\\ \\mathrm{V}$, and
$5.0 < 13.5$, so the stage is linear and −5.00 V is the answer.

At 2.0 V in: the formula gives −20 V, which exceeds the rail, so the output
sits at **−13.5 V**.

**Answer**: −5.00 V and −13.5 V.

**The trap**: −20 V. It will be on the answer sheet, it is what the gain
formula says, and it is a voltage the circuit physically cannot produce. Any
computed output larger in magnitude than the supply is a signal to stop and
report the rail.

## 6.3 Worked example: how much of the cycle is flat

**Given**: the same −10 stage clipping at ±13.5 V, driven by a 2.0 V peak
sinusoid. What fraction of each cycle is spent against a rail?

**Handbook relation**: the output is clipped whenever
$\\lvert A_{cl}\\,A\\sin\\theta \\rvert \\ge V_{sat}$, that is whenever
$\\lvert \\sin\\theta \\rvert \\ge V_{sat}/(\\lvert A_{cl} \\rvert A)$.

**Substitution**: the sine threshold is
$13.5/(10 \\times 2.0) = 0.675$. The fraction of a cycle for which
$\\lvert \\sin\\theta \\rvert$ stays *below* a threshold $s$ is
$(2/\\pi)\\arcsin s$, so the clipped fraction is its complement:

$$\\text{clipped fraction} = 1 - \\frac{2}{\\pi}\\arcsin(0.675) = 1 - 0.4717 = 0.528$$

**Answer**: 52.8 percent of every cycle is flat — the figure's 53 percent.
More than half of the waveform carries no information about the input at all.

**Consistency check**: as the input grows the threshold $V_{sat}/(A_{cl}A)$
falls toward zero, $\\arcsin$ goes to zero, and the clipped fraction approaches
1 — the output becomes a square wave. As the input falls to 1.35 V the
threshold reaches 1, $\\arcsin(1) = \\pi/2$, and the clipped fraction is exactly
0 ✓. Both limits behave.

## 6.4 Worked example: choosing a gain that fits the rails

**Given**: a sensor delivers up to 1.2 V peak. The amplifier runs on ±15 V
rails with $V_{sat} = 13.5\\ \\mathrm{V}$. What is the largest usable gain
magnitude, and what standard resistor ratio realises it with margin?

**Handbook relation**: $\\lvert A_{cl} \\rvert \\le V_{sat}/v_{in,peak}$.

**Substitution**:

$$\\lvert A_{cl} \\rvert _{max} = \\frac{13.5\\ \\mathrm{V}}{1.2\\ \\mathrm{V}} = 11.25$$

**Answer**: 11.25 is the ceiling, so a design gain of 10 leaves 12.5 percent of
headroom and is the sensible choice —
$R_{f}/R_{in} = 10\\ \\mathrm{k}\\Omega/1\\ \\mathrm{k}\\Omega$ inverting, giving a
12.0 V peak output against a 13.5 V limit.

**Check the margin against reality**: supply tolerance, temperature, and
sensor over-range all eat into that 1.5 V. Designers usually target 70 to 80
percent of the available swing, which is why the round number below the
computed ceiling is the right answer to this kind of question rather than the
ceiling itself.

## 6.5 Saturation breaks the virtual short

The most important consequence of clipping is not the wrong number; it is that
the analysis method stops working. The virtual short $V^{+} = V^{-}$ is a
*result* of negative feedback having enough loop gain to enforce it. When the
output is pinned at a rail, the feedback loop is open — the output no longer
responds to the input — and the input terminals are free to differ by whatever
the source imposes.

| Condition | $V^{+} = V^{-}$? | Analysis to use |
|---|---|---|
| Negative feedback, output within rails | yes | closed-loop gain formulas |
| Output at a rail | no | output equals the rail |
| No feedback path | no | comparator: output is one of two rails |
| Feedback to the non-inverting input | no | Schmitt trigger or latch |

The last two rows are why a question that shows feedback going to the
*non-inverting* terminal is never asking for a gain. It is asking about a
comparator with hysteresis, whose two thresholds come from a divider between
the output and that terminal, and whose output is always one rail or the other.`,
        examTip: 'Finish every op-amp calculation with a rail check. Compute the ideal output, compare its magnitude with the supply, and if it is larger the answer is the saturation voltage — typically 1 to 2 V inside the rail unless the problem says rail-to-rail. This one habit converts a whole family of trap questions into free marks.',
        importantNote: 'A clipped stage is not merely inaccurate, it is non-linear, so superposition and the gain formulas stop applying to it entirely. If one input of a summing amplifier drives the output into a rail, the contributions of the other inputs can no longer be computed separately and added.',
      },
      {
        id: 'opamp-integrator-time',
        title: '7. The Integrator in the Time Domain, and Why It Drifts',
        content: `## 7.1 The current has nowhere else to go

Section 2.2 gave the integrator as a formula. Derive it once from the two
rules and it stops being something to memorise. The inverting node is a virtual
ground and swallows no current, so the current arriving through $R$ must pass
entirely through $C$:

$$\\frac{v_{in}}{R} = -C\\,\\frac{dv_{out}}{dt}$$

$$\\frac{dv_{out}}{dt} = -\\frac{v_{in}}{RC} \\;\\Longrightarrow\\; v_{out}(t) = -\\frac{1}{RC}\\int_{0}^{t} v_{in}\\,d\\tau + v_{out}(0)$$

The middle form is the one to carry into an exam. It says a **constant input
produces a constant output slope**, and the slope is the input divided by the
time constant. Everything else follows from that sentence.

![A plus and minus 1 volt square wave at 250 hertz driving an integrator with a 10 kilohm resistor and a 0.1 microfarad capacitor, giving a 2 volt peak-to-peak triangle computed by numerical integration. A second trace shows the same circuit with a 1 millivolt input offset and no DC feedback path, walking steadily off toward the rail at 1 volt per second.](/courses/fe-ee/figures/elec2-opamp-integrator.svg)

## 7.2 Worked example: square wave to triangle

**Given**: $R = 10\\ \\mathrm{k}\\Omega$, $C = 0.1\\ \\mathrm{\\mu F}$, driven by a
±1 V square wave at 250 Hz. Find the output waveform shape and its
peak-to-peak amplitude.

**Handbook relations**: $RC$ sets the ramp rate
$\\lvert dv_{out}/dt \\rvert = v_{in}/RC$; the ramp runs for half a period
before the input reverses.

**Substitution**:

$$RC = 10^{4}\\ \\Omega \\times 10^{-7}\\ \\mathrm{F} = 1\\ \\mathrm{ms}$$

$$\\left\\lvert \\frac{dv_{out}}{dt} \\right\\rvert = \\frac{1\\ \\mathrm{V}}{1\\ \\mathrm{ms}} = 1000\\ \\mathrm{V/s}$$

$$T/2 = \\frac{1}{2 \\times 250\\ \\mathrm{Hz}} = 2\\ \\mathrm{ms}, \\qquad \\Delta v = 1000\\ \\mathrm{V/s} \\times 2\\ \\mathrm{ms} = 2.0\\ \\mathrm{V}$$

**Answer**: a triangle wave of 2.0 V peak-to-peak, inverted with respect to the
input — when the square wave is high the output ramps *down*.

**Consistency check**: the triangle must return to where it started after a
full period, and it does, because the positive and negative half-cycles
contribute equal and opposite 2 V excursions. An integrator output that does
not close on itself over one period signals a net DC component in the input,
which is exactly the failure mode of Section 7.4.

## 7.3 Worked example: integrating a step

**Given**: $R = 100\\ \\mathrm{k}\\Omega$, $C = 0.01\\ \\mathrm{\\mu F}$, output
initially zero. A steady +2 V is applied for 3 ms. Find the output at the end
of that interval.

**Handbook relation**: for constant input,
$v_{out} = -v_{in}t/(RC)$.

**Substitution**:

$$RC = 10^{5} \\times 10^{-8} = 1\\ \\mathrm{ms}$$

$$v_{out} = -\\frac{2\\ \\mathrm{V} \\times 3\\ \\mathrm{ms}}{1\\ \\mathrm{ms}} = -6.0\\ \\mathrm{V}$$

**Answer**: −6.0 V, still comfortably inside a ±15 V supply.

**Consistency check** by rate: the ramp rate is
$2\\ \\mathrm{V}/1\\ \\mathrm{ms} = 2000\\ \\mathrm{V/s}$, and 3 ms at that rate is
6 V of travel ✓. Note how the same $RC = 1\\ \\mathrm{ms}$ was reached from
completely different component values — 100 kΩ with 0.01 µF here, 10 kΩ with
0.1 µF above. The time constant is what the circuit responds to; the individual
values are chosen for input impedance and for how much current the source must
deliver.

## 7.4 Worked example: offset drift, and the resistor that fixes it

**Given**: the integrator of Section 7.2 with a 1 mV input offset voltage and
no DC feedback path, on ±12 V supplies. How fast does the output drift, and how
long until it reaches a rail? Then repeat with
$R_{F} = 1\\ \\mathrm{M}\\Omega$ placed across the capacitor.

**Handbook relations**: the offset is indistinguishable from a real input, so
it produces a ramp at $V_{os}/RC$. With $R_{F}$ present, the DC gain becomes
finite at $-R_{F}/R$.

**Substitution** without the resistor:

$$\\frac{dv_{out}}{dt} = \\frac{1\\ \\mathrm{mV}}{1\\ \\mathrm{ms}} = 1.0\\ \\mathrm{V/s}, \\qquad t_{rail} = \\frac{12\\ \\mathrm{V}}{1.0\\ \\mathrm{V/s}} = 12\\ \\mathrm{s}$$

**Substitution** with $R_{F} = 1\\ \\mathrm{M}\\Omega$:

$$A_{DC} = -R_{F}/R = -10^{6}/10^{4} = -100, \\qquad v_{out,offset} = 100 \\times 1\\ \\mathrm{mV} = 0.10\\ \\mathrm{V}$$

**Answer**: the bare integrator saturates in 12 seconds; the compensated one
settles at a harmless 100 mV offset and stays there.

**What it costs**: the added resistor turns the perfect integrator into a
low-pass filter whose corner sits at

$$f_{c} = \\frac{1}{2\\pi R_{F}C} = \\frac{1}{2\\pi \\times 10^{6} \\times 10^{-7}} = 1.59\\ \\mathrm{Hz}$$

Above 1.59 Hz the circuit still integrates properly; below it, the response
flattens and integration stops. That is the whole design rule — put the corner
safely below the lowest frequency you actually need to integrate, and accept
that true DC is not one of them.`,
        examTip: 'For a constant input, skip the integral sign entirely: the output is a ramp of slope −v_in/RC, and the answer is that slope times the elapsed time. Then check the result against the supply rails, because integrator problems are written so that a slightly longer interval would have saturated the output.',
        importantNote: 'The feedback resistor across the capacitor is not an optional refinement — without a DC path around the capacitor the op-amp\'s own input offset and bias current integrate without limit, and the circuit reaches a rail on its own with no signal applied. Any practical integrator schematic that lacks that resistor is either wrong or relies on an external reset switch.',
      },
      {
        id: 'opamp-active-filter',
        title: '8. The Active Low-Pass Filter: Two Circuits in One',
        content: `## 8.1 An inverting amplifier with a capacitor in the feedback

Put a capacitor in *parallel* with the feedback resistor rather than replacing
it, and the feedback element becomes a frequency-dependent impedance:

$$Z_{f}(s) = R_{f} \\parallel \\frac{1}{sC_{f}} = \\frac{R_{f}}{1 + sR_{f}C_{f}}$$

The virtual-ground derivation is unchanged — the input branch sets the current,
the feedback element decides what that current does — so the transfer function
is the inverting gain formula with $Z_{f}$ in place of $R_{f}$:

$$H(s) = -\\frac{Z_{f}}{R_{in}} = -\\frac{R_{f}/R_{in}}{1 + sR_{f}C_{f}}$$

That is a first-order low-pass filter with a **passband gain** set by the
resistor ratio and a **corner** set by the feedback pair alone:

$$A_{0} = -\\frac{R_{f}}{R_{in}}, \\qquad f_{c} = \\frac{1}{2\\pi R_{f}C_{f}}$$

The independence is the useful part: $R_{in}$ moves the gain without touching
the corner, and $C_{f}$ moves the corner without touching the gain.

![Magnitude and phase of a first-order inverting active low-pass filter with a 10 kilohm input resistor, a 100 kilohm feedback resistor and a 1.5915 nanofarad feedback capacitor. The magnitude is flat at 20 decibels, drops 3 decibels at a corner of 1.00 kilohertz and then falls 20 decibels per decade; the phase starts at 180 degrees, passes 135 degrees at the corner and approaches 90 degrees far above it.](/courses/fe-ee/figures/elec2-opamp-active-lpf.svg)

Two features of the phase plot are worth pinning down because they surprise
people. It starts at 180°, not 0°, because the circuit inverts. And it ends at
90°, not 0°, because a first-order pole contributes only 90° of lag — the
inversion supplies the other 180° and the two combine.

## 8.2 Worked example: reading the response

**Given**: $R_{in} = 10\\ \\mathrm{k}\\Omega$, $R_{f} = 100\\ \\mathrm{k}\\Omega$,
$C_{f} = 1.5915\\ \\mathrm{nF}$. Find the DC gain, the corner frequency, the
gain magnitude at the corner, and the gain at 10 kHz.

**Handbook relations**: the two design formulas above, plus
$\\lvert H \\rvert = A_{0}/\\sqrt{1 + (f/f_{c})^{2}}$.

**Substitution**:

$$A_{0} = -100/10 = -10 \\;\\;(20\\ \\mathrm{dB})$$

$$f_{c} = \\frac{1}{2\\pi \\times 10^{5}\\ \\Omega \\times 1.5915 \\times 10^{-9}\\ \\mathrm{F}} = 1.00\\ \\mathrm{kHz}$$

$$\\lvert H(f_{c}) \\rvert = 10/\\sqrt{2} = 7.07 \\;\\;(17.0\\ \\mathrm{dB})$$

$$\\lvert H(10\\ \\mathrm{kHz}) \\rvert = \\frac{10}{\\sqrt{1 + 10^{2}}} = \\frac{10}{10.05} = 0.995$$

**Answer**: gain −10 in the passband, corner at 1.00 kHz, 7.07 at the corner,
and 0.995 — essentially unity — one decade above it.

**Consistency check**: one decade above a first-order corner the response
should be 20 dB below the passband. The passband is 20 dB and the computed
value is $20\\log_{10}(0.995) = -0.04\\ \\mathrm{dB}$, a fall of 20.04 dB ✓. The
small excess over exactly 20 dB is the difference between the asymptote and the
true curve, and it shrinks further at higher frequencies.

## 8.3 Worked example: designing to a specification

**Given**: design an inverting active low-pass with a passband gain of −5, a
corner at 2.00 kHz, and an input impedance of at least 10 kΩ.

**Handbook relations**: $R_{in}$ is the input impedance;
$R_{f} = \\lvert A_{0} \\rvert R_{in}$; $C_{f} = 1/(2\\pi R_{f}f_{c})$.

**Substitution**: take $R_{in} = 10\\ \\mathrm{k}\\Omega$, the minimum allowed,
since larger values only worsen noise and offset.

$$R_{f} = 5 \\times 10\\ \\mathrm{k}\\Omega = 50\\ \\mathrm{k}\\Omega$$

$$C_{f} = \\frac{1}{2\\pi \\times 50\\ \\mathrm{k}\\Omega \\times 2\\ \\mathrm{kHz}} = 1.59\\ \\mathrm{nF}$$

**Answer**: 10 kΩ, 50 kΩ, and 1.59 nF.

**Consistency check**: $1/(2\\pi \\times 5 \\times 10^{4} \\times 1.5915 \\times 10^{-9}) = 2.00\\ \\mathrm{kHz}$ ✓,
and the DC gain is $-50/10 = -5$ ✓. Note that halving $R_{f}$ from the previous
example while keeping the same capacitor doubled the corner — the corner
depends on the *product* $R_{f}C_{f}$, so the two components trade off freely
and the choice between them is made on availability and on how much the
capacitor's tolerance matters.

## 8.4 Order, roll-off, and what the exam expects

| Filter | Roll-off | Phase shift far from the corner | Op-amps needed |
|---|---|---|---|
| First-order low-pass | 20 dB/decade | 90° | 1 |
| Second-order low-pass | 40 dB/decade | 180° | 1 (Sallen-Key) |
| First-order high-pass | 20 dB/decade | 90° (leading) | 1 |
| Band-pass (one pole each side) | 20 dB/decade each side | — | 1 |

FE questions on active filters almost always stop at first order and ask for
one of three things: the corner frequency from $R$ and $C$, the passband gain
from the resistor ratio, or the attenuation a stated number of decades past the
corner. All three come out of the two design formulas and the 20 dB per decade
rule, and none of them requires the transfer function to be written down.

The one conceptual point worth carrying beyond the exam is why anyone bothers
with an active filter when a resistor and a capacitor would do. Three reasons:
the op-amp supplies gain rather than the loss a passive network imposes; the
low output impedance means the next stage cannot detune this one, so sections
cascade without interacting; and no inductor is required, which at audio
frequencies is decisive because an inductor of the necessary size would be
large, lossy, and expensive.`,
        examTip: 'For an inverting active low-pass, the corner frequency involves only the feedback pair: f_c = 1/(2π·R_f·C_f). The input resistor never appears in it. Candidates who write 1/(2π·R_in·C_f) get an answer that scales the right way with the capacitor and is wrong by the gain factor, which is exactly the kind of near-miss that has a distractor built for it.',
        importantNote: 'The op-amp\'s own gain-bandwidth product sets an upper bound on any active filter. A design calling for a 100 kHz corner at a gain of 100 asks for 10 MHz of gain-bandwidth, so a 1 MHz part cannot build it no matter how the passives are chosen. Check GBW against gain times corner frequency before trusting an active filter design.',
      },
      {
        id: 'opamp-problem-set-a',
        title: '9. Problem Set A: Ideal Op-Amp Circuits',
        content: `## 9.1 How to work this set

Seven items, all solvable with the two rules from Section 1 and about three
minutes each. Assume ideal op-amps with supplies large enough that nothing
saturates, unless a problem says otherwise. Write the node equation before
reaching for a memorised gain formula on any circuit that is not exactly one of
the standard four — the rules generalise, the formulas do not.

## 9.2 Problem Set A: virtual short, superposition, and feedback elements

**A1.** An inverting amplifier has $R_{in} = 2\\ \\mathrm{k}\\Omega$ and
$R_{f} = 47\\ \\mathrm{k}\\Omega$. Find the output for an input of 0.15 V.

**A2.** A non-inverting amplifier has $R_{1} = 1.2\\ \\mathrm{k}\\Omega$ from the
inverting node to ground and $R_{f} = 18\\ \\mathrm{k}\\Omega$ in feedback. Find
the output for an input of 0.40 V.

**A3.** A summing amplifier has $R_{f} = 30\\ \\mathrm{k}\\Omega$ and three
inputs: 0.5 V through 10 kΩ, −0.2 V through 5 kΩ, and 0.1 V through 3 kΩ. Find
the output.

**A4.** A difference amplifier uses 10 kΩ input resistors and 100 kΩ feedback
and reference resistors, all matched. The inverting input sees 2.05 V and the
non-inverting input sees 2.00 V. Find the output.

**A5.** An integrator has $R = 100\\ \\mathrm{k}\\Omega$ and
$C = 0.01\\ \\mathrm{\\mu F}$, with the capacitor initially discharged. A steady
2 V is applied for 3 ms. Find the output.

**A6.** Three stages are cascaded: a unity-gain buffer, then an inverting stage
of gain −4, then a non-inverting stage of gain +3. Find the overall gain and
the output for a 0.25 V input.

**A7.** A photodiode delivering 20 µA is connected to the inverting input of a
transimpedance amplifier with $R_{f} = 100\\ \\mathrm{k}\\Omega$ and the
non-inverting input grounded. Find the output voltage.

## 9.3 Full solutions, and the distractor each one sets

**A1.** Straight application of the inverting formula:

$$v_{out} = -\\frac{R_{f}}{R_{in}}v_{in} = -\\frac{47}{2} \\times 0.15 = -3.53\\ \\mathrm{V}$$

*Trap*: adding the one. Using $1 + R_{f}/R_{in} = 24.5$ gives +3.68 V, right
magnitude family, wrong sign and wrong by the extra unit. The "1 +" belongs to
the non-inverting topology only.

**A2.** Now the one does belong:

$$v_{out} = \\left(1 + \\frac{18}{1.2}\\right)0.40 = (1 + 15)(0.40) = 16 \\times 0.40 = 6.40\\ \\mathrm{V}$$

*Trap*: dropping the one gives 6.00 V, and dropping the one *and* the sign
convention gives −6.00 V. Both appear as choices on questions of this type.

**A3.** Each input sees its own gain into the virtual ground, and the
contributions add:

$$v_{out} = -R_{f}\\left(\\frac{0.5}{10} + \\frac{-0.2}{5} + \\frac{0.1}{3}\\right)\\ \\mathrm{k}\\Omega^{-1}$$

$$v_{out} = -(1.5 - 1.2 + 1.0) = -1.30\\ \\mathrm{V}$$

*Trap*: mishandling the negative input. The −0.2 V source contributes
$+1.2\\ \\mathrm{V}$, not −1.2 V, because the stage inverts it. Treating all
three magnitudes as positive gives −3.70 V.

**A4.** With all four resistors matched, the difference amplifier gain is the
resistor ratio applied to the *difference*:

$$v_{out} = \\frac{R_{f}}{R_{1}}(v_{+} - v_{-}) = 10\\,(2.00 - 2.05) = -0.50\\ \\mathrm{V}$$

*Trap*: amplifying the common-mode level. The two inputs are both about 2 V,
and $10 \\times 2.025 = 20.25\\ \\mathrm{V}$ is not only wrong but beyond most
supplies. Rejecting that 2.025 V common-mode component while amplifying the
50 mV difference by 10 is the entire purpose of the circuit.

**A5.** Constant input, so the output is a ramp:

$$RC = 100\\ \\mathrm{k}\\Omega \\times 0.01\\ \\mathrm{\\mu F} = 1\\ \\mathrm{ms}$$

$$v_{out} = -\\frac{v_{in}t}{RC} = -\\frac{2 \\times 3}{1} = -6.00\\ \\mathrm{V}$$

*Trap*: computing $RC$ as 1 s by mismatching the prefixes, which produces
−6 mV. Convert both component values to base units before multiplying, every
time.

**A6.** Cascaded stages multiply, and the buffer contributes exactly 1:

$$A_{total} = (+1)(-4)(+3) = -12$$

$$v_{out} = -12 \\times 0.25 = -3.00\\ \\mathrm{V}$$

*Trap*: adding gains, or losing the single inversion. Only one stage inverts,
so the overall sign is negative; two inverting stages in a chain would have
made it positive.

**A7.** The virtual ground holds the diode's cathode at 0 V, and all its
current flows through the feedback resistor:

$$v_{out} = -I\\,R_{f} = -20\\ \\mathrm{\\mu A} \\times 100\\ \\mathrm{k}\\Omega = -2.00\\ \\mathrm{V}$$

*Trap*: looking for an input resistor. There is none — the source is a current
source, so the transimpedance gain is $R_{f}$ in volts per amp, and the input
impedance seen by the diode is nearly zero, which is exactly why this topology
is used for photodiodes.`,
        examTip: 'Three quantities decide every problem in this set: which terminal the signal enters, what the feedback element is, and whether more than one source is present. Answer those three before writing anything, and the correct formula selects itself. Guessing a formula from the picture is what produces the sign errors and the missing "1 +".',
      },
      {
        id: 'opamp-problem-set-b',
        title: '10. Problem Set B: Real Op-Amp Limits',
        content: `## 10.1 Scope of this set

Seven items drawn from Sections 4 through 8, where the ideal model no longer
suffices. Use $GBW = 1\\ \\mathrm{MHz}$ and $SR = 0.5\\ \\mathrm{V/\\mu s}$ unless
a problem states otherwise, and take the usable output swing as ±13.5 V on
±15 V supplies. In every item, decide first whether the question is a
small-signal one or a large-signal one — that single choice determines which
specification applies.

## 10.2 Practice Problems: bandwidth, slew, clipping, filters

**B1.** A non-inverting amplifier is set for a gain of 100. What is its
closed-loop bandwidth?

**B2.** An inverting amplifier uses $R_{in} = 1\\ \\mathrm{k}\\Omega$ and
$R_{f} = 20\\ \\mathrm{k}\\Omega$. What is its closed-loop bandwidth?

**B3.** The amplifier must deliver a 10 V peak sine at 20 kHz. Is it slew
limited, and if so what is the largest undistorted amplitude at that frequency?

**B4.** What is the full-power bandwidth for a 13.5 V peak output?

**B5.** An inverting stage of gain −10 is driven by a 2.0 V peak sine. What
fraction of each cycle is clipped?

**B6.** An active low-pass has $R_{in} = 10\\ \\mathrm{k}\\Omega$,
$R_{f} = 100\\ \\mathrm{k}\\Omega$ and $C_{f} = 1.5915\\ \\mathrm{nF}$. Give the
passband gain and the corner frequency, then the output amplitude for a 0.1 V
input at 1.00 kHz.

**B7.** An op-amp with 2 mV of input offset voltage and 80 nA of input bias
current is used in a non-inverting stage of gain 100 whose feedback network
presents 100 kΩ to the inverting input. Estimate the output error from each
cause.

## 10.3 Full solutions, and the distractor each one sets

**B1.** For a non-inverting stage the signal gain and the noise gain coincide:

$$f_{3dB} = \\frac{GBW}{A_{cl}} = \\frac{1\\ \\mathrm{MHz}}{100} = 10\\ \\mathrm{kHz}$$

*Trap*: none serious here — this is the easy case, and it is included because
recognising it as the easy case is what lets you spot B2 as the hard one.

**B2.** The signal gain is −20 but the feedback divider presents a noise gain
of 21:

$$f_{3dB} = \\frac{GBW}{1 + R_{f}/R_{in}} = \\frac{1\\ \\mathrm{MHz}}{21} = 47.6\\ \\mathrm{kHz}$$

*Trap*: 50.0 kHz, from dividing by the signal gain of 20. It is a 5 percent
error here and a factor of two at unity gain, and it is the single most common
mistake on op-amp bandwidth questions.

**B3.** Compare the demanded slope with the slew rate:

$$2\\pi f A = 2\\pi \\times 2\\times 10^{4} \\times 10 = 1.26 \\times 10^{6}\\ \\mathrm{V/s} = 1.26\\ \\mathrm{V/\\mu s}$$

That exceeds 0.5 V/µs, so the output is slew limited and triangular. The
largest clean amplitude is

$$A_{max} = \\frac{SR}{2\\pi f} = \\frac{0.5 \\times 10^{6}}{2\\pi \\times 2 \\times 10^{4}} = 3.98\\ \\mathrm{V\\ peak}$$

*Trap*: concluding "20 kHz is well below the 1 MHz GBW, therefore fine". The
gain-bandwidth product describes small signals; 10 V is not a small signal.

**B4.** Directly from the definition:

$$f_{FP} = \\frac{SR}{2\\pi V_{p}} = \\frac{0.5 \\times 10^{6}}{2\\pi \\times 13.5} = 5.89\\ \\mathrm{kHz}$$

*Trap*: using the RMS value 9.55 V instead of the peak, which gives 8.33 kHz.
Slew rate limits the *instantaneous* slope, so the peak amplitude is the
quantity that belongs in the formula.

**B5.** The output would reach 20 V peak but clamps at 13.5 V, so the sine
threshold is $13.5/20 = 0.675$:

$$\\text{clipped fraction} = 1 - \\frac{2}{\\pi}\\arcsin(0.675) = 0.528$$

*Trap*: reporting the fraction of the *amplitude* removed,
$1 - 13.5/20 = 0.325$. The question asks about time, not voltage, and the sine
spends longer near its peaks than a linear reading suggests.

**B6.** Gain and corner come from separate component pairs:

$$A_{0} = -\\frac{100}{10} = -10, \\qquad f_{c} = \\frac{1}{2\\pi R_{f}C_{f}} = 1.00\\ \\mathrm{kHz}$$

At the corner the magnitude is down by $\\sqrt{2}$:

$$\\lvert v_{out} \\rvert = 0.1\\ \\mathrm{V} \\times \\frac{10}{\\sqrt{2}} = 0.707\\ \\mathrm{V}$$

*Trap*: answering 1.00 V by using the passband gain at the corner frequency.
The corner is defined as the point where the response has already fallen 3 dB,
so the passband gain does not apply there.

**B7.** The two error sources act differently. Offset voltage is amplified by
the noise gain:

$$V_{err,os} = 100 \\times 2\\ \\mathrm{mV} = 200\\ \\mathrm{mV}$$

Bias current flows in the feedback network resistance and creates a voltage
that is then amplified in the same way, but the standard estimate quotes the
input-referred drop directly:

$$V_{err,bias} = 80\\ \\mathrm{nA} \\times 100\\ \\mathrm{k}\\Omega = 8\\ \\mathrm{mV}$$

*Answer*: about 200 mV from offset and 8 mV referred to the input from bias
current, so offset dominates.

*Trap*: assuming the errors are negligible because the op-amp is "good". At a
gain of 100 a 2 mV offset becomes 200 mV at the output, which is 1.5 percent of
full scale on a 13.5 V swing — enough to ruin a precision measurement and the
reason chopper and auto-zero amplifiers exist.`,
        examTip: 'Sort every real-limit question into one of three bins on sight. Frequency response of a small signal is gain-bandwidth. Amplitude of a large signal at a stated frequency is slew rate. Output magnitude compared against the supply is clipping. Problems that give you two specifications are usually asking which one binds first, and the answer is whichever yields the smaller allowed output.',
        importantNote: 'Notice that the ideal analysis was never wrong in these problems — it was incomplete. Every answer here started from an ideal gain formula and then applied one real constraint on top. That is the correct working order on the exam: solve the ideal circuit, then test the result against bandwidth, slew rate, and the rails in that sequence.',
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
        examTip: 'For ripple calculations on the FE exam, use the pair that matches the converter. Boost: ΔIL = Vin·D/(L·fₛ) and ΔVo = Io·D/(C·fₛ). Buck: ΔIL = Vin·D·(1−D)/(L·fₛ) = Vo·(1−D)/(L·fₛ) and ΔVo = ΔIL/(8·C·fₛ). To reduce ripple, increase L, C, or switching frequency fₛ. The FE exam often asks which parameter change most effectively reduces ripple.',
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
      {
        id: 'pe-buck-time-domain',
        title: '5. The Buck Converter in the Time Domain',
        content: `## 5.1 Volt-second balance, the law behind every conversion ratio

Section 1 handed you three conversion ratios to memorise. All three fall out of
one principle, and deriving them takes about fifteen seconds — which is faster
than recovering from a memorised buck-boost formula whose sign you have stored
upside down.

An inductor obeys the element law

$$v_{L} = L\\,\\frac{di_{L}}{dt}$$

In periodic steady state its current has to arrive back where it started after
one complete switching period. If it did not, the current would walk further
from its starting value on every cycle until the core saturated or the switch
gave out. Written as an integral over one period, that requirement is
**volt-second balance**:

$$\\int_{0}^{T} v_{L}\\,dt = 0$$

When the inductor sees one constant voltage during the on-time and a second
constant voltage during the off-time, the integral collapses into two
rectangles of equal area and opposite sign:

$$V_{on}\\,D\\,T + V_{off}\\,(1 - D)\\,T = 0$$

Every conversion ratio in this chapter now reads straight off that line. In a
**buck** the inductor bridges the switch node and the output, so it carries
$V_{in} - V_{o}$ while the switch conducts and $-V_{o}$ while the diode
freewheels:

$$(V_{in} - V_{o})\\,D - V_{o}\\,(1 - D) = 0 \\;\\Longrightarrow\\; V_{o} = D\\,V_{in}$$

In a **boost** the inductor sits across the input while the switch conducts,
then in series with the input feeding the output while the diode conducts:

$$V_{in}\\,D + (V_{in} - V_{o})(1 - D) = 0 \\;\\Longrightarrow\\; \\frac{V_{o}}{V_{in}} = \\frac{1}{1 - D}$$

In a **buck-boost** the inductor is across the input, then across the output
with its connection reversed:

$$V_{in}\\,D + V_{o}\\,(1 - D) = 0 \\;\\Longrightarrow\\; V_{o} = -\\,V_{in}\\,\\frac{D}{1 - D}$$

The negative sign is not a convention to be memorised. It appears because the
inductor is tied to the output the other way round, and that is the physical
fact the sign records.

The capacitor obeys the matching law, **charge balance**: its voltage must also
return after one period, so its average current over a cycle is zero.

$$\\langle i_{C} \\rangle = 0$$

That single statement is what lets you say, without any further analysis, that
the average inductor current in a buck equals the load current, and that in a
boost it is the average *diode* current that equals the load current while the
inductor carries the larger input current.

## 5.2 One converter, drawn

Take the converter Section 3.3 worked numerically: 24 V in, 12 V out,
$f_{s} = 100\\ \\mathrm{kHz}$, $L = 100\\ \\mu\\mathrm{H}$,
$C = 100\\ \\mu\\mathrm{F}$, feeding a 2 A load.

![Switch-node voltage and inductor current over two switching periods of a 24 V to 12 V buck converter at 100 kHz. The switch node is a square wave that sits at 24 V for five microseconds and at zero for five microseconds; the inductor current is a triangle rising and falling at 120 kiloamps per second between a 1.70 A valley and a 2.30 A peak, centred on the 2.00 A load current.](/courses/fe-ee/figures/elec2-buck-waveforms.svg)

The top trace is the whole control mechanism in one picture. The switch node is
a rectangle that alternates between $V_{in}$ and roughly zero, and the inductor
plus capacitor take its **average**, which is $D\\,V_{in} = 12\\ \\mathrm{V}$.
The converter is not dividing the voltage down through a resistor; it is
chopping it and averaging, which is why the ideal efficiency is 100 per cent
rather than the 50 per cent a resistive divider would give here.

The bottom trace is the inductor's reply. It has no curvature at all, because a
constant voltage across an inductor produces a constant $di/dt$, so a square
wave in gives a triangle wave out. The triangle is centred on 2.00 A — the load
current — and it is the *centre*, not the peak, that the load sees.

## 5.3 Worked example: reading the switching waveforms

**Given**: the converter above, $V_{in} = 24\\ \\mathrm{V}$,
$V_{o} = 12\\ \\mathrm{V}$, $f_{s} = 100\\ \\mathrm{kHz}$,
$L = 100\\ \\mu\\mathrm{H}$, $I_{o} = 2\\ \\mathrm{A}$. Find the period,
on-time, both inductor slopes, and the peak and valley currents.

**Period and on-time**:

$$T = 1/f_{s} = 10\\ \\mu\\mathrm{s}, \\qquad D = V_{o}/V_{in} = 0.5, \\qquad t_{on} = D\\,T = 5\\ \\mu\\mathrm{s}$$

**Slopes**, straight from the element law. During the on-time the inductor
holds $24 - 12 = 12\\ \\mathrm{V}$:

$$\\frac{di_{L}}{dt}\\bigg|_{on} = \\frac{V_{in} - V_{o}}{L} = \\frac{12}{100\\times 10^{-6}} = 1.2\\times 10^{5}\\ \\mathrm{A/s} = 0.12\\ \\mathrm{A}/\\mu\\mathrm{s}$$

During the off-time it holds $-12\\ \\mathrm{V}$, so the down-slope is
$-0.12\\ \\mathrm{A}/\\mu\\mathrm{s}$. The two slopes are equal and opposite here
only because D happens to be exactly one half.

**Ripple**, as slope times time:

$$\\Delta I_{L} = 0.12 \\times 5 = 0.6\\ \\mathrm{A}$$

which agrees with both handbook forms,
$\\Delta I_{L} = V_{in}D(1-D)/(Lf_{s})$ and
$\\Delta I_{L} = V_{o}(1-D)/(Lf_{s})$. The second form is the more useful one in
practice, because a regulator holds $V_{o}$ fixed while $V_{in}$ wanders.

**Peak and valley**, centred on the load current:

$$I_{pk} = I_{o} + \\Delta I_{L}/2 = 2.30\\ \\mathrm{A}, \\qquad I_{val} = I_{o} - \\Delta I_{L}/2 = 1.70\\ \\mathrm{A}$$

**Check** by volt-seconds. The on-time applies

$$12\\ \\mathrm{V} \\times 5\\ \\mu\\mathrm{s} = 60\\ \\mu\\mathrm{V\\cdot s}$$

and the off-time removes the same 60 µV·s. Balanced, so the steady state the
whole calculation assumed is real rather than assumed.

**Answer**: 10 µs period, 5 µs on-time, ±0.12 A/µs, 2.30 A peak, 1.70 A valley.
The saturation rating of the inductor must clear 2.30 A, not 2.00 A — sizing
magnetics from average current is one of the most common design errors this
calculation exists to prevent.

## 5.4 Where the output-ripple formula comes from

The formula $\\Delta V_{o} = \\Delta I_{L}/(8Cf_{s})$ looks arbitrary until you
see the geometry. The capacitor takes whatever the inductor delivers beyond the
load's demand, so the capacitor current is the triangular ripple with its
average stripped off. That current is positive for exactly half the period, and
the charge it deposits is the area of one triangle of base $T/2$ and height
$\\Delta I_{L}/2$:

$$\\Delta Q = \\tfrac{1}{2}\\cdot\\frac{T}{2}\\cdot\\frac{\\Delta I_{L}}{2} = \\frac{\\Delta I_{L}\\,T}{8}$$

$$\\Delta V_{o} = \\frac{\\Delta Q}{C} = \\frac{\\Delta I_{L}}{8\\,C\\,f_{s}}$$

That is where the 8 lives: one half from the triangle's area, one half from the
half-period, one half from splitting the ripple about its mean. The boost
converter has a different capacitor waveform — a rectangle, because the diode
delivers charge only during the off-time — which is why its ripple formula is
$\\Delta V_{o} = I_{o}D/(Cf_{s})$ with no 8 in sight. Substituting one formula
into the other converter is the single most productive distractor on this
topic.

## 5.5 Worked example: output ripple, and the term the formula omits

**Given**: the same converter, $C = 100\\ \\mu\\mathrm{F}$ with an equivalent
series resistance of $20\\ \\mathrm{m}\\Omega$. Find the ideal ripple, the ESR
ripple, and which one governs.

**Capacitive term**:

$$\\Delta V_{o,C} = \\frac{0.6}{8 \\times 100\\times 10^{-6} \\times 100\\times 10^{3}} = \\frac{0.6}{80} = 7.5\\ \\mathrm{mV}$$

**Resistive term**. The same triangular current flows through the ESR, and
Ohm's law applies to it directly:

$$\\Delta V_{o,ESR} = ESR \\times \\Delta I_{L} = 0.020 \\times 0.6 = 12\\ \\mathrm{mV}$$

**Ratio**: $12/7.5 = 1.6$, so the resistance of the capacitor produces sixty
per cent more ripple than its capacitance does.

**Answer**: about 7.5 mV ideal, 12 mV from ESR. As a fraction of the 12 V
output the ideal figure is $7.5\\times 10^{-3}/12 = 0.0625\\%$. The lesson is
the one the FE tests obliquely: adding capacitance stops helping once ESR
dominates, and the fix is a lower-ESR part or several capacitors in parallel,
not a bigger number of microfarads. Doubling $f_{s}$ halves the capacitive term
and the ESR term together, because both scale with $\\Delta I_{L}$.

## 5.6 The continuous-conduction boundary

Every ratio derived in 5.1 assumed the inductor current never reaches zero. If
the load is light enough that the falling triangle touches zero before the
period ends, the diode stops conducting, the switch node floats, and the
converter enters **discontinuous conduction mode**. The output then rises above
$D\\,V_{in}$ and becomes load-dependent, which is why a bench measurement that
disagrees with $V_{o} = DV_{in}$ at light load is usually not a broken
converter.

The boundary is reached when the ripple triangle's half-height equals the
average:

$$I_{o,crit} = \\frac{\\Delta I_{L}}{2} = \\frac{V_{o}(1 - D)}{2\\,L\\,f_{s}}$$

Rearranging for the inductance that just holds continuous conduction at a load
resistance R gives the handbook form:

$$L_{crit} = \\frac{(1 - D)\\,R}{2\\,f_{s}}$$

![Critical inductance against duty cycle for a buck converter at 100 kHz, drawn for load resistances of 6, 12 and 24 ohms. Each curve is a straight line falling from its value at zero duty cycle to zero at unity duty cycle; the 6 ohm curve passes through 15 microhenries at a duty cycle of one half, and a horizontal line at 100 microhenries sits above all three.](/courses/fe-ee/figures/elec2-buck-ccm-boundary.svg)

Two shapes carry the meaning. Each line falls to zero as D approaches one,
because a converter that is on almost all the time barely lets its inductor
current fall at all; and the lines fan upward with R, because a light load has
less average current for the same ripple to hide inside. Both together say the
same thing: **light loads and low duty cycles push a converter into DCM**.

## 5.7 Worked example: sizing L for continuous conduction

**Given**: the 24 V to 12 V converter, $f_{s} = 100\\ \\mathrm{kHz}$, which must
stay continuous down to a 0.5 A load. Choose L.

**Load resistance at minimum load**:
$R_{max} = V_{o}/I_{o,min} = 12/0.5 = 24\\ \\Omega$.

**Critical inductance**:

$$L_{crit} = \\frac{(1 - 0.5)\\times 24}{2 \\times 100\\times 10^{3}} = \\frac{12}{2\\times 10^{5}} = 60\\ \\mu\\mathrm{H}$$

**Cross-check by the current route**, which avoids the resistance step:

$$L \\ge \\frac{V_{o}(1 - D)}{2\\,f_{s}\\,I_{o,min}} = \\frac{12 \\times 0.5}{2 \\times 10^{5} \\times 0.5} = 60\\ \\mu\\mathrm{H}$$

**Answer**: 60 µH is the boundary, so the 100 µH part already specified is
comfortable, and the figure shows why — the 100 µH line sits above all three
load curves. Turn the question around and the same relation says what the
100 µH choice buys: with $L = 100\\ \\mu\\mathrm{H}$,

$$I_{o,crit} = \\frac{12 \\times 0.5}{2 \\times 100\\times 10^{-6} \\times 100\\times 10^{3}} = 0.30\\ \\mathrm{A}$$

so the converter stays continuous down to 0.30 A, equivalently up to a
$40\\ \\Omega$ load. The distractor here is to evaluate $L_{crit}$ at the
*maximum* load; that gives the smallest boundary inductance and guarantees DCM
exactly where the design was supposed to be safe.

## 5.8 Component stresses, which the conversion ratio never mentions

Choosing parts needs currents the ratio formulas do not supply. For the same
converter, at $D = 0.5$ and $I_{o} = 2\\ \\mathrm{A}$:

| Quantity | Relation | Value here |
|---|---|---|
| Average inductor current | $I_{o}$ | 2.00 A |
| Peak inductor current | $I_{o} + \\Delta I_{L}/2$ | 2.30 A |
| Ripple RMS of a triangle | $\\Delta I_{L}/(2\\sqrt{3})$ | 0.173 A |
| Inductor RMS current | $\\sqrt{I_{o}^{2} + (\\Delta I_{L}/2\\sqrt{3})^{2}}$ | 2.008 A |
| Switch RMS current | $I_{o}\\sqrt{D}$ | 1.414 A |
| Diode average current | $I_{o}(1 - D)$ | 1.00 A |
| Average input current | $D\\,I_{o}$ | 1.00 A |

## 5.9 Worked example: stresses and the power balance

**Given**: the table's relations and the reference design.

**Inductor RMS**. The ripple's contribution enters as a sum of squares, and it
is small:

$$I_{L,rms} = \\sqrt{2.00^{2} + 0.173^{2}} = \\sqrt{4.030} = 2.008\\ \\mathrm{A}$$

Copper loss therefore differs from the DC estimate by only 0.4 per cent, which
is the standard justification for ignoring ripple in a winding-loss calculation
when the ripple is a modest fraction of the average.

**Input current and the power balance**:

$$I_{in} = D\\,I_{o} = 0.5 \\times 2 = 1.00\\ \\mathrm{A}, \\qquad P_{in} = 24 \\times 1.00 = 24\\ \\mathrm{W} = 12 \\times 2 = P_{o}$$

**Answer**: 2.008 A inductor RMS, 1.414 A switch RMS, 1.00 A diode average,
1.00 A average input current. A buck steps voltage down and current *up* on the
load side; the input draws only half the output current here, and that is the
exchange the ideal power balance enforces. Any answer in which a lossless buck
draws more input current than it delivers has the transformation backwards.`,
        examTip: 'Volt-second balance is worth more than the three memorised ratios, because it produces them. Write the inductor voltage during the on-time and the off-time, set the areas equal, and solve. It also tells you instantly that a buck cannot boost and a boost cannot buck: the on-time and off-time voltages must have opposite signs, which constrains where the output can sit.',
        importantNote: 'The ripple formulas for the buck and the boost are not interchangeable. Buck: ΔVo = ΔIL/(8·C·fs), because the capacitor sees a triangular current. Boost: ΔVo = Io·D/(C·fs), because the capacitor supplies the whole load current during the on-time. Applying the buck formula to a boost understates the required capacitance by more than an order of magnitude in typical designs.',
      },
      {
        id: 'pe-losses',
        title: '6. Losses, Efficiency, and Boost Design',
        content: `## 6.1 Four places the power goes

An ideal converter has $P_{in} = P_{o}$. A real one loses power in four
distinct ways, and the FE tests whether you can tell them apart by how they
scale with load current.

| Loss mechanism | Scales as | Dominates at |
|---|---|---|
| Controller, gate drive, core loss | constant | light load |
| Diode conduction, $(1-D)V_{f}I_{o}$ | linear in $I_{o}$ | all loads, mildly |
| Switch conduction, $D\\,R_{ds}I_{o}^{2}$ | square of $I_{o}$ | heavy load |
| Switching transitions, $\\tfrac{1}{2}V_{in}I\\,(t_{r}+t_{f})f_{s}$ | linear in $f_{s}$ | high frequency |

Efficiency is then

$$\\eta = \\frac{P_{o}}{P_{o} + P_{loss}} = \\frac{V_{o}I_{o}}{V_{o}I_{o} + P_{fix} + (1-D)V_{f}I_{o} + D\\,R_{ds}I_{o}^{2}}$$

![Efficiency against load current for a 24 V to 12 V buck with a fixed 0.25 W loss, a 0.5 V diode drop and a 50 milliohm switch. The curve climbs steeply from about 94 per cent at light load, peaks at 96.7 per cent near 3.16 A, and falls slowly toward 95.5 per cent at 12 A.](/courses/fe-ee/figures/elec2-converter-efficiency.svg)

The shape is universal for switching converters and it explains a great deal of
datasheet behaviour. At light load the fixed overhead is a large share of a
small output, so efficiency collapses. At heavy load the square-law conduction
term takes over. In between there is a maximum, and it falls exactly where the
fixed loss equals the square-law loss:

$$P_{fix} = D\\,R_{ds}I_{o}^{2} \\;\\Longrightarrow\\; I_{o}^{*} = \\sqrt{\\frac{P_{fix}}{D\\,R_{ds}}}$$

## 6.2 Worked example: a loss budget at two load currents

**Given**: $V_{o} = 12\\ \\mathrm{V}$, $D = 0.5$,
$P_{fix} = 0.25\\ \\mathrm{W}$, $V_{f} = 0.5\\ \\mathrm{V}$,
$R_{ds} = 50\\ \\mathrm{m}\\Omega$. Find the efficiency at 1 A and at 12 A, and
the current of peak efficiency.

**At 1 A**, term by term: fixed 0.250 W; diode
$(1 - 0.5)(0.5)(1) = 0.250\\ \\mathrm{W}$; switch
$(0.5)(0.05)(1)^{2} = 0.025\\ \\mathrm{W}$; total 0.525 W against 12 W of
output.

$$\\eta = \\frac{12}{12 + 0.525} = 0.9581 = 95.81\\%$$

**At 12 A**: fixed 0.250 W; diode $(0.5)(0.5)(12) = 3.00\\ \\mathrm{W}$; switch
$(0.5)(0.05)(144) = 3.60\\ \\mathrm{W}$; total 6.85 W against 144 W.

$$\\eta = \\frac{144}{144 + 6.85} = 0.9546 = 95.46\\%$$

**Peak**:

$$I_{o}^{*} = \\sqrt{\\frac{0.25}{0.5 \\times 0.05}} = \\sqrt{10} = 3.16\\ \\mathrm{A}, \\qquad \\eta_{max} = 96.71\\%$$

**Answer**: 95.81 per cent at 1 A, 96.71 per cent at 3.16 A, 95.46 per cent at
12 A. Notice how the composition inverts: at 1 A the fixed term is 48 per cent
of all loss and the switch term is under 5 per cent; at 12 A the switch term
alone is more than half. Improving the wrong term is the practical error, and
the exam version of it is a question that asks which change most improves
light-load efficiency — the answer is never a lower on-resistance.

## 6.3 Frequency: the trade with two signs

Raising $f_{s}$ shrinks every passive component, because both ripple formulas
carry $f_{s}$ in the denominator. It also multiplies the switching loss
directly. For the reference design, with a combined rise and fall time of 40 ns
and a 2 A switched current:

$$P_{sw} = \\tfrac{1}{2}V_{in}I\\,(t_{r} + t_{f})\\,f_{s} = \\tfrac{1}{2}(24)(2)(40\\times 10^{-9})(100\\times 10^{3}) = 0.096\\ \\mathrm{W}$$

At 400 kHz the same expression gives 0.384 W, and the inductor needed for the
same ripple falls to a quarter of its size. That is the whole design trade in
two numbers: silicon area and gate charge buy magnetics volume. Exam items
phrase it as "what happens to ripple if the switching frequency doubles" —
ripple halves, in both the current and the voltage — and the follow-up asks
what limits the frequency, which is switching loss.

## 6.4 Worked example: designing a boost converter from a specification

**Given**: 12 V input, 30 V output, 1 A load, $f_{s} = 100\\ \\mathrm{kHz}$.
Choose D, find the input current, and pick L for 30 per cent current ripple and
C for 100 mV of output ripple.

**Duty cycle**, from $V_{o}/V_{in} = 1/(1-D)$:

$$D = 1 - \\frac{V_{in}}{V_{o}} = 1 - \\frac{12}{30} = 0.60$$

**Input current**, from the lossless power balance
$V_{in}I_{in} = V_{o}I_{o}$:

$$I_{in} = \\frac{I_{o}}{1 - D} = \\frac{1}{0.40} = 2.5\\ \\mathrm{A}$$

The inductor carries this 2.5 A, not the 1 A load current — in a boost the
inductor is on the *input* side. Thirty per cent ripple therefore means
$\\Delta I_{L} = 0.3 \\times 2.5 = 0.75\\ \\mathrm{A}$.

**Inductor**, from $\\Delta I_{L} = V_{in}D/(Lf_{s})$:

$$L = \\frac{V_{in}D}{\\Delta I_{L}\\,f_{s}} = \\frac{12 \\times 0.60}{0.75 \\times 100\\times 10^{3}} = 96\\ \\mu\\mathrm{H}$$

**Capacitor**, from the boost ripple relation
$\\Delta V_{o} = I_{o}D/(Cf_{s})$:

$$C = \\frac{I_{o}D}{\\Delta V_{o}\\,f_{s}} = \\frac{1 \\times 0.60}{0.100 \\times 100\\times 10^{3}} = 60\\ \\mu\\mathrm{F}$$

**Answer**: D = 0.60, 2.5 A input, 96 µH, 60 µF. Two traps are built into this
problem. The first is applying the buck ripple formula to the capacitor, which
would give roughly 5 µF and an output ripple twelve times worse than specified.
The second is sizing the inductor for 0.3 A on the assumption that the ripple
is a fraction of the *load* current; the boost inductor never sees the load
current directly.

## 6.5 Worked example: the ceiling on boost ratio

**Given**: the ideal curve of Section 1 says a 10× boost needs
$D = 1 - 1/10 = 0.90$, and 5× needs 0.80. Why does no practical converter run
there?

**Include a resistance.** With a total series resistance $R_{L}$ in the
inductor path, the boost ratio acquires a divisor that grows as
$(1-D)^{2}$ shrinks:

$$\\frac{V_{o}}{V_{in}} = \\frac{1}{1 - D}\\cdot\\frac{1}{1 + \\dfrac{R_{L}}{(1-D)^{2}R}}$$

**Read the sensitivity.** Differentiating the ideal ratio,

$$\\frac{d(V_{o}/V_{in})}{dD} = \\frac{1}{(1 - D)^{2}}$$

At D = 0.5 that derivative is 4; at D = 0.9 it is 100. A one per cent change in
duty cycle moves the output twenty-five times harder at D = 0.9 than at D = 0.5.

**Answer**: the ideal formula is not wrong, it is incomplete. As
$(1-D) \\to 0$ the input current $I_{o}/(1-D)$ diverges, the resistive term in
the denominator above grows without bound, and the ratio turns over and falls
instead of rising. Practical single-stage boost ratios stall near 4 to 5, which
is exactly the ceiling Section 1.2 quotes. On the exam, a question asking for
the duty cycle that gives a 10× boost still wants D = 0.9 from the ideal
formula; a question asking whether that converter will actually work wants this
paragraph.`,
        examTip: 'Sort loss questions by how the loss scales. Fixed losses hurt at light load, I²R losses hurt at heavy load, and switching losses hurt at high frequency. The peak of an efficiency curve sits where the fixed loss equals the square-law loss, at Io = sqrt(P_fix/(D·Rds)), and no amount of on-resistance improvement moves the light-load end of that curve.',
        importantNote: 'In a boost converter the inductor and the switch carry the INPUT current Io/(1−D), not the load current. At D = 0.6 that is 2.5 times the load current; at D = 0.8 it is five times. Every component rating on the input side of a boost must be computed from Iin, and sizing them from Io is the error that destroys hardware rather than merely losing marks.',
      },
      {
        id: 'pe-rectifier-detail',
        title: '7. Rectifier Averages, RMS, and Diode Ratings',
        content: `## 7.1 The same sine, two rectifiers

Section 2 tabulated rectifier outputs. This section derives them, because the
derivation is short and the table is easy to misremember under time pressure.

The average of a rectified sine is an integral over the conducting portion. For
a half-wave rectifier the diode conducts for half of each period:

$$V_{dc} = \\frac{1}{2\\pi}\\int_{0}^{\\pi} V_{m}\\sin\\theta\\,d\\theta = \\frac{V_{m}}{\\pi}$$

A full-wave rectifier folds the negative half up instead of discarding it, so
the same integral is taken over half the period rather than a whole one, and
the answer doubles:

$$V_{dc} = \\frac{1}{\\pi}\\int_{0}^{\\pi} V_{m}\\sin\\theta\\,d\\theta = \\frac{2V_{m}}{\\pi}$$

![Half-wave and full-wave rectified output from one 17 volt peak sinusoid over two cycles, with the two computed averages drawn as horizontal lines at 5.41 volts and 10.82 volts. The half-wave trace is flat at zero during alternate half cycles while the full-wave trace fills them in.](/courses/fe-ee/figures/elec2-rect-waveforms.svg)

The RMS values come from the same kind of integral applied to the square. The
half-wave case is zero for half the time, so its mean square is half that of
the full sine, and its RMS is $V_{m}/2$; the full-wave case is a complete sine
as far as the square is concerned, so its RMS is $V_{m}/\\sqrt{2}$, identical
to the AC source's own RMS.

$$V_{rms,half} = \\frac{V_{m}}{2}, \\qquad V_{rms,full} = \\frac{V_{m}}{\\sqrt{2}}$$

## 7.2 Worked example: averages, RMS, and ripple from one 17 V peak

**Given**: a transformer secondary of 12.02 V rms, so
$V_{m} = 17.0\\ \\mathrm{V}$. Compute the DC and RMS output of a half-wave and a
full-wave rectifier, and both ripple factors.

**Averages**:

$$V_{dc,half} = \\frac{17.0}{\\pi} = 5.41\\ \\mathrm{V}, \\qquad V_{dc,full} = \\frac{2 \\times 17.0}{\\pi} = 10.82\\ \\mathrm{V}$$

**RMS**:

$$V_{rms,half} = \\frac{17.0}{2} = 8.50\\ \\mathrm{V}, \\qquad V_{rms,full} = \\frac{17.0}{\\sqrt{2}} = 12.02\\ \\mathrm{V}$$

**Form factor**, the ratio of RMS to average:

$$FF_{half} = \\frac{8.50}{5.41} = 1.571 = \\frac{\\pi}{2}, \\qquad FF_{full} = \\frac{12.02}{10.82} = 1.111 = \\frac{\\pi}{2\\sqrt{2}}$$

**Ripple factor**, which measures the AC content relative to the DC:

$$r = \\frac{V_{ac,rms}}{V_{dc}} = \\sqrt{FF^{2} - 1}$$

$$r_{half} = \\sqrt{1.571^{2} - 1} = 1.211 = 121\\%, \\qquad r_{full} = \\sqrt{1.111^{2} - 1} = 0.483 = 48.3\\%$$

**Answer**: 5.41 V and 10.82 V average, 8.50 V and 12.02 V RMS, 121 per cent
and 48.3 per cent ripple — the two ripple figures Section 2's table quotes. The
half-wave rectifier's ripple exceeds 100 per cent because the AC content of its
output genuinely is larger than its DC content; nothing is wrong with a ripple
factor above unity. The exam trap in this family is squaring or halving the
source RMS instead of converting to peak first: 12.02 V rms is not the peak,
and $2 \\times 12.02/\\pi$ is not the full-wave average.

## 7.3 Diode ratings, which the average never tells you

Selecting a rectifier diode needs the **peak inverse voltage** it must block
while off, and that depends on topology rather than on the average output.

| Topology | Vdc | PIV per diode | Diodes | Ripple frequency |
|---|---|---|---|---|
| Half-wave | $V_{m}/\\pi$ | $V_{m}$ | 1 | f |
| Centre-tapped full-wave | $2V_{m}/\\pi$ | $2V_{m}$ | 2 | 2f |
| Bridge full-wave | $2V_{m}/\\pi$ | $V_{m}$ | 4 | 2f |
| Six-pulse three-phase | $3\\sqrt{3}V_{m}/\\pi$ | $\\sqrt{3}V_{m}$ | 6 | 6f |

The centre-tapped and bridge rows produce identical averages and identical
ripple, and differ only in the trade the designer accepts: two diodes rated at
twice the voltage, or four diodes rated at once the voltage and two forward
drops in the conduction path instead of one. For the 17 V peak above, the
bridge diodes need only 17 V of blocking while the centre-tapped pair needs
34 V.

## 7.4 Worked example: a capacitor-input filter

**Given**: a bridge rectifier from the same 17 V peak, a
$1000\\ \\mu\\mathrm{F}$ filter capacitor, a 0.5 A DC load, and a 60 Hz line.
Find the ripple and the average output.

**Ripple**. Between peaks the capacitor supplies the load alone, discharging
for very nearly the whole interval between conduction pulses, which is
$1/(2f)$ for a full-wave circuit:

$$V_{r(pp)} \\approx \\frac{I_{dc}}{2\\,f\\,C} = \\frac{0.5}{2 \\times 60 \\times 1000\\times 10^{-6}} = 4.17\\ \\mathrm{V}$$

**Average**, sitting half a ripple below the peak, less two diode drops:

$$V_{dc} \\approx V_{m} - 2V_{f} - \\frac{V_{r(pp)}}{2} = 17.0 - 1.4 - 2.08 = 13.5\\ \\mathrm{V}$$

**Answer**: 4.17 V peak-to-peak ripple on about 13.5 V of DC. Two things are
worth carrying away. First, the filtered average (13.5 V) is far above the
unfiltered average (10.8 V), because a capacitor-input filter holds the output
near the *peak* rather than averaging the waveform — a question that filters the
output and then applies $2V_{m}/\\pi$ has confused the two circuits. Second, the
same capacitor on a half-wave rectifier would give twice the ripple, 8.33 V,
because the discharge interval doubles.

## 7.5 Worked example: the six-pulse front end of a drive

**Given**: a 208 V line-to-line, 60 Hz three-phase supply feeding an
uncontrolled six-pulse bridge. Find the DC bus voltage and the ripple
frequency.

**Peak phase voltage**:

$$V_{m} = \\frac{\\sqrt{2}\\,V_{LL}}{\\sqrt{3}} = \\frac{1.4142 \\times 208}{1.7321} = 169.8\\ \\mathrm{V}$$

**DC output**, by the handbook relation:

$$V_{dc} = \\frac{3\\sqrt{3}\\,V_{m}}{\\pi} = \\frac{3 \\times 1.7321 \\times 169.8}{\\pi} = 280.9\\ \\mathrm{V}$$

**Same result, one step**, by folding the line-to-line conversion into the
constant:

$$V_{dc} = \\frac{3\\sqrt{2}}{\\pi}V_{LL} = 1.3505 \\times 208 = 280.9\\ \\mathrm{V}$$

**Ripple frequency**: six conduction intervals per cycle at 60 Hz gives
$6 \\times 60 = 360\\ \\mathrm{Hz}$.

**Answer**: a 281 V bus with 360 Hz ripple at about 4.2 per cent. Both the
magnitude and the frequency work in the designer's favour — smaller ripple, and
what remains is six times easier to filter, so a three-phase drive bus needs a
fraction of the capacitance a single-phase one would. The 1.35 constant is worth
memorising in the line-to-line form, because industrial problems always quote
line-to-line voltage.`,
        examTip: 'Convert the given RMS to a peak before touching any rectifier formula. Vm = sqrt(2)·Vrms for single phase, and Vm = sqrt(2)·VLL/sqrt(3) for the phase peak of a three-phase system. Every average, RMS and PIV expression in this section is written in terms of Vm, and substituting an RMS value straight into them is the single most common rectifier error.',
        importantNote: 'A capacitor-input filter changes what the output average means. Without a filter the bridge delivers 2Vm/π; with a large filter it delivers roughly Vm minus the diode drops minus half the ripple, which is much higher. Read the circuit before choosing the formula — the presence of a filter capacitor decides which one applies.',
      },
      {
        id: 'pe-phase-control',
        title: '8. Phase Control Across the Full Range',
        content: `## 8.1 One cosine, three operating regions

The controlled-rectifier relation of Section 2.1 is more general than it looks.
For a fully controlled single-phase bridge with a continuous-current load:

$$V_{dc} = \\frac{2V_{m}}{\\pi}\\cos\\alpha$$

and for the six-pulse three-phase equivalent:

$$V_{dc} = \\frac{3\\sqrt{2}}{\\pi}V_{LL}\\cos\\alpha = 1.35\\,V_{LL}\\cos\\alpha$$

![Average DC output of a phase-controlled single-phase bridge on 120 volts rms against firing angle from zero to 180 degrees. The curve is a cosine starting at 108.0 volts, passing through 54.0 volts at 60 degrees, crossing zero at 90 degrees and reaching minus 54.0 volts at 120 degrees, with the positive region labelled rectifying and the negative region labelled inverting.](/courses/fe-ee/figures/elec2-scr-cosine.svg)

The curve divides into three regions that the same formula describes without
any change of equation.

- **α below 90°**: positive average, power flows from the AC line into the DC
  load. At α = 0 the SCR bridge behaves exactly as a diode bridge.
- **α = 90°**: zero average. The load sees equal positive and negative areas.
- **α above 90°**: negative average. With a load able to push current — a
  running motor, a battery, a photovoltaic string — power flows back into the
  line, and the converter is **inverting**.

The current direction never changes; only the polarity of the average voltage
does. That is the defining constraint of a line-commutated converter, and it is
why regenerative braking with a thyristor drive reverses the armature voltage
rather than the armature current.

## 8.2 Worked example: firing angle for a specified output

**Given**: a fully controlled single-phase bridge on a 240 V rms line must
deliver 100 V DC into a continuous-current load. Find α, and then find the
output at α = 30°.

**Maximum output**, at α = 0:

$$V_{m} = \\sqrt{2} \\times 240 = 339.4\\ \\mathrm{V}, \\qquad V_{dc,max} = \\frac{2 \\times 339.4}{\\pi} = 216.1\\ \\mathrm{V}$$

**Required cosine**:

$$\\cos\\alpha = \\frac{100}{216.1} = 0.4627 \\;\\Longrightarrow\\; \\alpha = 62.4^{\\circ}$$

**Output at 30 degrees**:

$$V_{dc} = 216.1 \\times \\cos 30^{\\circ} = 216.1 \\times 0.8660 = 187.1\\ \\mathrm{V}$$

**Answer**: α = 62.4° for 100 V, and 187.1 V at α = 30°. The relationship is
strongly non-linear in α even though it is a plain cosine: the first 30 degrees
of delay cost only 13 per cent of the output, while the 30 degrees from 60° to
90° cost half of it. Control resolution is therefore worst near α = 0 and best
near α = 90°, which is the opposite of the intuition that a small delay does
little.

## 8.3 Worked example: inversion and the regeneration limit

**Given**: a six-pulse controlled bridge on a 208 V line-to-line supply,
operating at α = 135° with a DC machine able to supply current.

**Average output**:

$$V_{dc} = 1.35 \\times 208 \\times \\cos 135^{\\circ} = 280.9 \\times (-0.7071) = -198.6\\ \\mathrm{V}$$

**Interpretation**: the DC terminals sit at −198.6 V while current continues in
its original direction, so the product $V_{dc}I_{dc}$ is negative and the
machine is returning about 199 V times its current to the AC line.

**Answer**: −198.6 V, inverting. In practice α is limited to roughly 150°
rather than 180°, because each thyristor needs a finite reverse-biased interval
to regain its blocking ability before the line voltage turns positive again.
Firing too late leaves a device still conducting when it should be blocking and
produces a **commutation failure**, which shorts the supply through the bridge.
The exam version asks why the theoretical −216 V at α = 180° is unreachable,
and turn-off time is the answer.

## 8.4 Reading the cosine backwards

Two habits make phase-control problems fast. First, evaluate
$V_{dc,max}$ once, then treat everything else as a cosine multiplier: 0.966 at
15°, 0.866 at 30°, 0.707 at 45°, 0.500 at 60°, 0 at 90°. Second, remember that
α is measured from the instant a *diode* in the same position would have begun
conducting, not from a voltage zero crossing in the abstract. On the FE, an
answer computed from a firing angle measured from the wrong reference will
usually be one of the offered distractors.`,
        examTip: 'Compute the α = 0 output first — 2Vm/π for a single-phase bridge, 1.35·VLL for a six-pulse three-phase bridge — and then multiply by cos α. Working the cosine into the integral from scratch wastes time, and going the other way (dividing a required output by the cosine) is where sign and reference errors enter.',
        importantNote: 'A line-commutated converter can reverse its voltage but never its current. Power reverses because Vdc goes negative while Idc keeps its direction. Any answer that has the DC current reversing at α > 90° describes a circuit thyristors cannot build.',
      },
      {
        id: 'pe-problems-converters',
        title: '9. Problem Set A: Converters and Losses',
        content: `## 9.1 How to use this set

Seven problems at FE pace. Each should take about three minutes with a
calculator and the relations from Sections 1, 5 and 6. Work all seven before
reading the solutions, and write down the duty cycle first every time.

## 9.2 Problem Set A: converters, ripple, and losses

**A1.** A buck converter runs from 48 V to 18 V at 200 kHz with
$L = 47\\ \\mu\\mathrm{H}$ and a 3 A load. Find the duty cycle, the
peak-to-peak inductor ripple, and the peak inductor current.

**A2.** A boost converter produces 12 V from a 5 V source and supplies 0.8 A.
Find the duty cycle and the average input current.

**A3.** A buck-boost converter runs from 12 V at a duty cycle of 0.40. Find the
output voltage, including its polarity, and the duty cycle that would make the
output magnitude equal the input.

**A4.** The buck converter of Section 5 has its output capacitor changed to
$220\\ \\mu\\mathrm{F}$. With $\\Delta I_{L} = 0.6\\ \\mathrm{A}$ and
$f_{s} = 100\\ \\mathrm{kHz}$, find the ideal output ripple.

**A5.** A buck converter delivers 5 V from 12 V at 250 kHz with
$L = 22\\ \\mu\\mathrm{H}$. Find the smallest load current for which the
converter remains in continuous conduction.

**A6.** A converter delivering 12 V at 5 A from a 24 V source is 90 per cent
efficient. Find the average input current and the total loss.

**A7.** A switch in a 24 V converter carries 2 A and has a combined rise and
fall time of 60 ns. Compare its switching loss at 200 kHz with its conduction
loss, given $D = 0.5$ and $R_{ds} = 50\\ \\mathrm{m}\\Omega$.

### Full solutions

**A1.** $D = V_{o}/V_{in} = 18/48 = 0.375$. Then

$$\\Delta I_{L} = \\frac{V_{o}(1 - D)}{L f_{s}} = \\frac{18 \\times 0.625}{47\\times 10^{-6} \\times 200\\times 10^{3}} = \\frac{11.25}{9.4} = 1.20\\ \\mathrm{A}$$

and $I_{pk} = 3 + 1.20/2 = 3.60\\ \\mathrm{A}$ (valley 2.40 A). *Trap*: using
$V_{in}$ in place of $V_{o}$ in the numerator gives 3.19 A of ripple, which
would put the valley below zero and wrongly suggest discontinuous conduction.
The correct alternative form is $V_{in}D(1-D)/(Lf_{s})$, which also returns
1.20 A — if your two forms disagree, one of them has the wrong voltage.

**A2.** $V_{o}/V_{in} = 1/(1-D)$ gives $1 - D = 5/12$, so
$D = 0.583$. The lossless balance gives

$$I_{in} = \\frac{I_{o}}{1 - D} = \\frac{0.8}{0.4167} = 1.92\\ \\mathrm{A}$$

*Check*: $5 \\times 1.92 = 9.6\\ \\mathrm{W} = 12 \\times 0.8$. *Trap*: reading
D as $V_{in}/V_{o} = 0.417$, the complement of the right answer, which is
exactly what the offered distractor will be.

**A3.** The buck-boost magnitude is

$$\\lvert V_{o}\\rvert = \\frac{V_{in}D}{1 - D} = \\frac{12 \\times 0.4}{0.6} = 8\\ \\mathrm{V}$$

and the output is **negative** with respect to the common
node: −8 V. The magnitude equals the input when $D/(1-D) = 1$, that is
$D = 0.50$. *Trap*: answering +8 V. The buck-boost inverts, and a question that
lists both +8 V and −8 V is testing only that.

**A4.**

$$\\Delta V_{o} = \\frac{\\Delta I_{L}}{8Cf_{s}} = \\frac{0.6}{8 \\times 220\\times 10^{-6} \\times 100\\times 10^{3}} = \\frac{0.6}{176} = 3.41\\ \\mathrm{mV}$$

*Trap*: using the boost form $I_{o}D/(Cf_{s})$ with the 2 A load gives 45.5 mV,
thirteen times too large. The capacitor in a buck never carries the load
current; it carries only the ripple.

**A5.** $D = 5/12 = 0.4167$, so

$$\\Delta I_{L} = \\frac{5(1 - 0.4167)}{22\\times 10^{-6} \\times 250\\times 10^{3}} = \\frac{2.917}{5.5} = 0.530\\ \\mathrm{A}$$

$$I_{o,min} = \\frac{\\Delta I_{L}}{2} = 0.265\\ \\mathrm{A}$$

equivalently a load resistance no larger than
$5/0.265 = 18.9\\ \\Omega$. *Trap*: quoting the full ripple, 0.53 A, as the
boundary. The boundary is where the *valley* reaches zero, which happens when
the average equals half the ripple.

**A6.** $P_{o} = 12 \\times 5 = 60\\ \\mathrm{W}$, so

$$P_{in} = \\frac{60}{0.90} = 66.7\\ \\mathrm{W}, \\qquad I_{in} = \\frac{66.7}{24} = 2.78\\ \\mathrm{A}$$

and the loss is $66.67 - 60 = 6.67\\ \\mathrm{W}$. *Trap*: the ideal answer
$I_{in} = DI_{o} = 2.50\\ \\mathrm{A}$, which ignores the stated efficiency. A
real converter draws *more* than the ideal input current, never less.

**A7.** Switching loss:

$$P_{sw} = \\tfrac{1}{2}(24)(2)(60\\times 10^{-9})(200\\times 10^{3}) = 0.288\\ \\mathrm{W}$$

Conduction loss:

$$P_{cond} = D\\,R_{ds}I^{2} = 0.5 \\times 0.05 \\times 4 = 0.100\\ \\mathrm{W}$$

Switching loss is 2.88 times conduction loss, so this design is
switching-limited and a faster device, not a lower-resistance one, is the
improvement that pays. *Trap*: omitting the factor of one half, which comes
from the triangular overlap of voltage and current during a transition.`,
        examTip: 'On any converter problem, write the duty cycle first and sanity-check it against the topology: a buck has D = Vo/Vin and cannot exceed 1; a boost has D = 1 − Vin/Vo and cannot be negative. If your duty cycle comes out above one or below zero, you have chosen the wrong topology formula, and no later arithmetic will recover.',
      },
      {
        id: 'pe-problems-rectifiers',
        title: '10. Problem Set B: Rectifiers and Phase Control',
        content: `## 10.1 How to use this set

Six problems, again at about three minutes each. Convert every given RMS to a
peak before you start, and decide whether the circuit is half-wave, full-wave
or six-pulse before you reach for a formula.

## 10.2 Problem Set B: rectifiers, ratings, and firing angles

**B1.** A half-wave rectifier is fed from a 24 V rms secondary. Find the peak,
the DC average, and the RMS of the output, assuming ideal diodes.

**B2.** The same 24 V rms secondary feeds a bridge rectifier whose diodes each
drop 0.7 V. Find the DC output, and the loss of output caused by the diodes.

**B3.** A 24-0-24 V rms centre-tapped transformer feeds a two-diode full-wave
rectifier. Find the peak inverse voltage each diode must withstand, and state
what a bridge from the same 24 V rms winding would require instead.

**B4.** An uncontrolled six-pulse bridge is fed from a 208 V line-to-line, 60 Hz
supply. Find the DC output and the fundamental ripple frequency.

**B5.** A fully controlled single-phase bridge on 240 V rms must deliver 100 V
DC into a continuous-current load. Find the firing angle.

**B6.** A six-pulse controlled bridge on 208 V line-to-line operates at
α = 135°. Find the average DC voltage and state the direction of power flow.

### Full solutions

**B1.** $V_{m} = \\sqrt{2}\\times 24 = 33.94\\ \\mathrm{V}$. Then

$$V_{dc} = \\frac{V_{m}}{\\pi} = \\frac{33.94}{\\pi} = 10.80\\ \\mathrm{V}, \\qquad V_{rms} = \\frac{V_{m}}{2} = 16.97\\ \\mathrm{V}$$

*Trap*: dividing the RMS by π directly, giving 7.64 V. The formula is written
in peak volts, and the conversion has to happen first.

**B2.** Two diodes conduct in series on each half cycle, so the sine is clipped
by 1.4 V throughout conduction:

$$V_{dc} = \\frac{2(V_{m} - 1.4)}{\\pi} = \\frac{2 \\times 32.54}{\\pi} = 20.72\\ \\mathrm{V}$$

against $2V_{m}/\\pi = 21.61\\ \\mathrm{V}$ ideal, so the diodes cost 0.89 V.
*Trap*: subtracting only one diode drop, which is right for a centre-tapped
circuit and wrong for a bridge, or subtracting 1.4 V from the *average* rather
than from the peak — the second gives 20.21 V, close enough to appear among the
options.

**B3.** For the centre-tapped circuit the off diode sees the whole winding, both
halves in series, so

$$PIV = 2V_{m} = 2 \\times 33.94 = 67.9\\ \\mathrm{V}$$

A bridge from a single 24 V rms winding needs only $V_{m} = 33.9\\ \\mathrm{V}$
of blocking per diode, at the cost of four diodes and two forward drops in the
path. *Trap*: quoting 33.9 V for the centre-tapped case by reasoning from one
half-winding.

**B4.**

$$V_{dc} = \\frac{3\\sqrt{2}}{\\pi}V_{LL} = 1.3505 \\times 208 = 280.9\\ \\mathrm{V}, \\qquad f_{ripple} = 6 \\times 60 = 360\\ \\mathrm{Hz}$$

*Trap*: applying the 1.35 constant to the *phase* voltage of 120 V, giving
162 V. The constant 1.35 is defined against line-to-line RMS; the phase-peak
form of the same relation is $3\\sqrt{3}V_{m}/\\pi$ with
$V_{m} = 169.8\\ \\mathrm{V}$, which returns the same 280.9 V.

**B5.** $V_{m} = \\sqrt{2}\\times 240 = 339.4\\ \\mathrm{V}$ and
$V_{dc,max} = 2V_{m}/\\pi = 216.1\\ \\mathrm{V}$, so

$$\\cos\\alpha = \\frac{100}{216.1} = 0.4627, \\qquad \\alpha = 62.4^{\\circ}$$

*Trap*: taking the arccosine of $100/339.4 = 0.295$, which uses the peak
instead of the α = 0 average and returns 72.8°.

**B6.**

$$V_{dc} = 1.3505 \\times 208 \\times \\cos 135^{\\circ} = -198.6\\ \\mathrm{V}$$

The DC current keeps its direction while the voltage has reversed, so power
flows from the DC side into the AC line: the converter is inverting, and the
load is regenerating. *Trap*: reporting +198.6 V by taking the magnitude of the
cosine. The sign is the entire answer to this question.`,
        examTip: 'Rectifier questions decide themselves on three checks: did you convert RMS to peak, is the circuit half-wave or full-wave, and is there a filter capacitor. Get those three right and the arithmetic is one line. Phase-control questions add a fourth: multiply the α = 0 average by cos α, and keep the sign.',
        importantNote: 'Peak inverse voltage is a topology property, not an output property. The centre-tapped full-wave rectifier and the bridge deliver identical averages from the same peak, yet the centre-tapped diodes must block twice the voltage. Any question that asks you to select a diode is asking for PIV, and the average output is the distractor.',
      },
    ],
    keyTakeaways: [
      'Buck: Vo = D·Vin (step-down); Boost: Vo = Vin/(1−D) (step-up); D = ton/(ton+toff).',
      'Ripple, per topology — boost: ΔIL = Vin·D/(L·fₛ), ΔVo = Io·D/(C·fₛ); buck: ΔIL = Vo·(1−D)/(L·fₛ), ΔVo = ΔIL/(8·C·fₛ).',
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
