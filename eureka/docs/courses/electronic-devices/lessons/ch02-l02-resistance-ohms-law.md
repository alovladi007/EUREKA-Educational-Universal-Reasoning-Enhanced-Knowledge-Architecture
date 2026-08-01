# Resistance, Ohm's Law, and Where Heat Comes From

<!-- covers: 2.5, 2.5.1, 2.5.2, 2.6, 2.7, 2.8, 2.8.1, 2.9, 2.10, 2.11 -->

**In this lesson:** Ohm's law and where it does (and doesn't) apply · what physically sets resistance · the conductor–semiconductor–insulator spectrum · power, heat, and picking a resistor that survives · real wire and gauge selection · the three meanings of "ground."

---

## 1 · Ohm's law

For a resistor, current is proportional to the voltage across it:

$$V = I R$$

$R$, in ohms ($\Omega$), is the constant of proportionality — **how many volts of push each ampere of flow requires**.

> **One fact, not three.** The rearrangements are the same statement solved for a different unknown:
> $$I = \frac{V}{R} \qquad R = \frac{V}{I}$$
> Know any two of $V$, $I$, $R$ and you know the third.

### Where it applies — and where it doesn't

Ohm's law is an *empirical property of materials*, not a law of nature. Materials that obey it are called **ohmic**.

| Behaves ohmically (over wide ranges) | Doesn't |
|---|---|
| Metals | Diodes |
| Carbon films | Lamps (as their filament heats) |
| | Semiconductors generally |

The non-ohmic column is precisely what makes those parts interesting later in the course.

---

## 2 · What sets a conductor's resistance

Resistance is **geometry × material**:

$$R = \frac{\rho L}{A}$$

Two intuitions carry the whole formula:

- **Double the length $L$** → double the resistance. Twice the lattice for carriers to fight through.
- **Double the cross-section $A$** → half the resistance. Twice the parallel paths.

### Resistivity: the material's own number

$\rho$ (**resistivity**, ohm-meters) captures how obstructive the lattice itself is. Its reciprocal is **conductivity**.

| Material | Resistivity | Which is why… |
|---|---|---|
| Copper | $\approx 1.7 \times 10^{-8}\ \Omega\!\cdot\!\text{m}$ | …it wires the world |
| Nichrome | ~60× worse | …it makes heating elements |

### Temperature moves it

- **Metals:** resistivity **rises** roughly linearly with temperature — warmer lattice, more scattering.
- **Semiconductors:** resistivity **falls** as heat frees more carriers.

That sign-flip matters twice later: it's how **thermistors** sense temperature, and it's why an overheating transistor can **run away**.

---

## 3 · Conductors, insulators, semiconductors

The spread of resistivity across materials is a factor of about $10^{24}$ — perhaps the largest range of any physical property we use.

| Class | Examples | What the electrons are doing |
|---|---|---|
| **Conductors** | metals | Carriers free at any temperature |
| **Insulators** | glass, PTFE, dry air | Electrons bound so strongly that fields of *millions of volts per meter* are needed to rip them loose |
| **Semiconductors** | silicon, germanium | In between — a carrier population you can **tune** by doping, temperature, and field |

> **Every insulator gives up eventually.** Ripping electrons loose does happen: every insulator has a **breakdown voltage**. Lightning is air's.

That tunable middle row is the property the entire second half of this course exploits.

---

## 4 · Heat and power in resistance

Combine $P = VI$ with Ohm's law and you get the two forms you'll use daily:

$$P = I^2 R \qquad\qquad P = \frac{V^2}{R}$$

Every resistor converts electrical energy to heat at this rate — **always**.

### Worked example: the same resistor, two fates

> A **1 kΩ** resistor across **12 V**:
> $$P = \frac{12^2}{1000} = 144\ \text{mW}$$
> Fine for a standard quarter-watt part.
>
> The same resistor across **50 V**:
> $$P = \frac{50^2}{1000} = 2.5\ \text{W}$$
> A quarter-watt part will discolor, drift, and eventually open.

> **Rule of thumb:** choose a power rating with a **factor of two of headroom**.

### Thermal resistance: Ohm's law for heat

Heat leaving a component obeys a law shaped exactly like Ohm's:

$$\text{temperature rise} = \text{power} \times \text{thermal resistance (°C/W)}$$

| Mounting | Junction → ambient |
|---|---|
| Part in still air | ~200 °C/W |
| Bolted to a heat sink | a few °C/W |

When later chapters say a regulator "needs a heat sink," this is the arithmetic they mean. Silicon junctions typically must stay below about **150 °C** — work backward from there.

---

## 5 · Wires, gauges, and the imperfect conductor

Real wire is a resistor too — just a small one. Wire is sold by **gauge** (AWG in North America):

- **Smaller gauge number = thicker wire.**
- Resistance roughly **halves every three gauge steps**.

### The two consequences that drive wire selection

1. **Voltage drop.** Ten meters of thin hookup wire carrying an ampere can eat a tenth of a volt *each way* — a 3.3 V sensor circuit will feel that.
2. **Heating.** $I^2R$ in a wire bundled inside insulation raises its temperature. That's why **ampacity tables** exist, and why **fuses** (next lesson group) are placed to open before insulation cooks.

> **Bench rules of thumb**
>
> | Use | Wire |
> |---|---|
> | Typical breadboard circuits | 22 AWG |
> | Motors and power stages | 18 AWG or better, short runs |

---

## 6 · Grounds and reference points

"Ground" carries **three meanings** that must not be blurred:

| Term | What it is | Why it exists |
|---|---|---|
| **Reference ground** | The node you declare 0 V | So other node voltages have meaning — every circuit has one, even battery toys |
| **Chassis ground** | A conductive enclosure tied to that reference | Shielding and safety bonding |
| **Earth ground** | A literal rod in the soil, bonded through building wiring | Gives fault current somewhere to go **that is not you** |

Schematic symbols distinguish the three. Appendix A returns to earth grounding where mains wiring is described.

> In this course, "ground" unqualified means the **reference node**.

---

## Key takeaways

- $V = IR$ — one relationship, three arrangements. Ohmic is a material property, not a universal law.
- $R = \rho L / A$: longer = more resistance, fatter = less; the material contributes $\rho$.
- Metals get *more* resistive when hot; semiconductors get *less* — the root of thermistors and thermal runaway.
- $P = I^2R = V^2/R$ heats every resistor, always. Size the power rating with 2× headroom, and remember heat flow has its own Ohm's law (°C per watt).
- Real wire drops voltage and makes heat; pick gauge for the current and the run.
- Say which ground you mean: reference, chassis, or earth.
