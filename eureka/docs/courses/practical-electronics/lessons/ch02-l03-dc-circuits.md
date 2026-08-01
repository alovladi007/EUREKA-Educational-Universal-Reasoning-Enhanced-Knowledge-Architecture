# DC Circuits: Series, Parallel, Dividers, and Real Sources

<!-- covers: 2.12, 2.12.1, 2.13, 2.14, 2.15, 2.16 -->

## Series and parallel resistance

Two rules generate every resistor network result you will ever need.

**Series** (one path, same current through all): resistances add.
R = R1 + R2 + ... The voltages divide in proportion to resistance, because
each ohm takes the same share of the push per ampere.

**Parallel** (same voltage across all, currents split): conductances add,
which gives the reciprocal rule 1/R = 1/R1 + 1/R2 + ... For exactly two
resistors this collapses to the product-over-sum form R1R2/(R1+R2), worth
memorizing. Parallel resistance is always smaller than the smallest branch —
adding a path can only make flow easier. Currents divide in *inverse*
proportion to resistance.

Sanity anchors: two equal resistors in parallel halve; ten equal resistors in
parallel give a tenth. If a computed parallel value came out larger than a
branch, a reciprocal was dropped somewhere.

## The voltage divider

Put two resistors in series across a source and tap the midpoint:

Vout = Vin x R2 / (R1 + R2)

This one-line circuit is everywhere: sensor interfaces (a thermistor as R1
turns temperature into voltage), level shifting, biasing, feedback networks.
Its trap is equally universal: the formula assumes nothing draws current from
the tap. A load resistance across R2 sits in parallel with it and drags Vout
down. The working rule: keep the load at least ten times R2, or account for it
explicitly. Dividers are for *sensing* voltages, never for *powering* loads —
a divider feeding a motor wastes most of its power in R1 and sags besides.

## Measuring V, I, and R

A **voltmeter** goes in parallel with the thing measured and must have very
high input resistance (10 MΩ is typical for a DMM) so it steals negligible
current — it is a deliberately feeble load on the divider rule above. An
**ammeter** goes in series and must have near-zero resistance so it adds
negligible drop. Reversing these roles is the classic beginner accident: an
ammeter across a supply is a short circuit through a delicate instrument, and
meters fuse their current ranges for exactly this moment. An **ohmmeter**
pushes a small known current through an unpowered component and reads the
drop; measuring resistance in a live circuit gives numbers that are part
fiction (parallel paths) and can damage the meter.

## Real batteries: internal resistance

An ideal source holds its voltage at any current. A real battery behaves like
an ideal source in series with a small **internal resistance** r, so its
terminal voltage sags under load: Vterminal = Vemf − I x r. A fresh alkaline
cell might show r of a few tenths of an ohm; as chemistry depletes, r climbs,
and the battery "dies" not by losing its EMF but by becoming unable to deliver
current without collapsing. This is why a nearly dead battery can read 1.5 V
on a meter (no load) yet fail in a flashlight, and why the honest battery test
is voltage *under load*.

The same series-r picture explains source combination rules from the previous
lesson and previews Thevenin's theorem: every real source looks like an ideal
one behind a resistance.

## Open circuits, short circuits, and fuses

An **open** is infinite resistance: current zero, and the full source voltage
appears across the break — which is why a switched-off lamp socket still
bites. A **short** is near-zero resistance: voltage across it collapses and
current is limited only by what the source and wiring can deliver, with I²R
heating concentrated wherever resistance remains. Neither is rare; both are
the two most common fault modes of everything.

Protection is a sacrificial series element. A **fuse** melts; a **circuit
breaker** trips magnetically or thermally and resets. Both are rated for the
current they carry indefinitely and placed so that the *wiring* is protected —
the fuse blows before the copper cooks. They protect against fire, not against
electronics damage (semiconductors die in microseconds; fuses act in
milliseconds) and not against shock (that is the job of earth grounding and
residual-current devices, Appendix A).
