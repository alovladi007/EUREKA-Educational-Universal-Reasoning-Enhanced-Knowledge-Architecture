# Resistance, Ohm's Law, and Where Heat Comes From

<!-- covers: 2.5, 2.5.1, 2.5.2, 2.6, 2.7, 2.8, 2.8.1, 2.9, 2.10, 2.11 -->

## Ohm's law

For a resistor, current is proportional to the voltage across it:

V = I x R

R, in ohms, is the constant of proportionality — how many volts of push each
ampere of flow requires. The three rearrangements (I = V/R, R = V/I) are one
fact, not three. Ohm's law is an empirical property of materials called
*ohmic*, not a law of nature: metals and carbon films obey it closely over
wide ranges; diodes, lamps as they heat, and semiconductors generally do not,
which is precisely what makes those parts interesting later.

## What sets a conductor's resistance

Resistance is geometry times material:

R = ρL / A

Double a wire's length and you double its resistance — twice the lattice for
carriers to fight through. Double its cross-sectional area and you halve the
resistance — twice the parallel paths. The material constant ρ (resistivity,
ohm-meters) captures how obstructive the lattice itself is; its reciprocal is
conductivity. Copper sits near 1.7 x 10^-8 ohm-m, which is why it wires the
world; nichrome is ~60x worse, which is why it makes heating elements.

Resistivity drifts with temperature. In metals it rises roughly linearly —
warmer lattice, more scattering. In semiconductors it *falls* as heat frees
more carriers, a sign-flip that matters for thermistors and for why
overheating transistors can run away.

## Insulators, conductors, semiconductors

The spread of resistivity across materials is a factor of about 10^24 —
perhaps the largest range of any physical property we use. Conductors (metals)
have carriers free at any temperature. Insulators (glass, PTFE, dry air) bind
their electrons so strongly that fields of millions of volts per meter are
needed to rip them loose — which does happen; every insulator has a breakdown
voltage, and lightning is air's. Semiconductors (silicon, germanium) sit
between, with a carrier population you can tune by doping, temperature, and
field — the property the entire second half of this course exploits.

## Heat and power in resistance

Combine P = VI with Ohm's law and you get the two forms you will use daily:

P = I²R    and    P = V²/R

Every resistor converts electrical energy to heat at this rate, always. Sizing
matters: a 1 kΩ resistor across 12 V dissipates 144 mW — fine for a standard
quarter-watt part; across 50 V it would need to shed 2.5 W and a quarter-watt
part will discolor, drift, and eventually open. Choose a power rating with a
factor of two of headroom.

**Thermal resistance** completes the picture. Heat leaving a component obeys a
law shaped exactly like Ohm's: temperature rise = power x thermal resistance
(°C per watt). A part in still air might show 200 °C/W from junction to
ambient; bolt it to a heat sink and the number drops to a few °C/W. When later
chapters say a regulator "needs a heat sink," this is the arithmetic they
mean. Silicon junctions typically must stay below about 150 °C; work backward
from there.

## Wires, gauges, and the imperfect conductor

Real wire is a resistor too, just a small one. Wire is sold by gauge (AWG in
North America): *smaller* gauge numbers mean *thicker* wire, roughly halving
resistance every three gauge steps. Two consequences drive selection. First,
voltage drop: ten meters of thin hookup wire carrying an ampere can eat a
tenth of a volt each way, which a 3.3 V sensor circuit will feel. Second,
heating: I²R in a wire bundled inside insulation raises its temperature, which
is why ampacity tables exist and why fuses (next lesson group) are placed to
open before insulation cooks.

For low-voltage bench work the rule of thumb is generous headroom: 22 AWG
handles the currents of typical breadboard circuits; motors and power stages
deserve 18 AWG or better and short runs.

## Grounds and reference points

"Ground" carries three meanings that must not be blurred. **Reference ground**
is simply the node you declare zero volts so other node voltages have meaning
— every circuit has one, even battery toys. **Chassis ground** is a
conductive enclosure tied to that reference. **Earth ground** is a literal rod
in the soil, bonded through building wiring, whose job is safety: it gives
fault current somewhere to go that is not you. Schematic symbols distinguish
them, and Appendix A returns to earth grounding where mains wiring is
described. In this course "ground" unqualified means the reference node.
