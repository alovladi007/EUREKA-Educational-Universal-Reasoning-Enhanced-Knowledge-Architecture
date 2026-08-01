# Capacitance: Storing Charge in a Field

<!-- covers: 2.21, 2.22, 2.23 -->

## What a capacitor is

Two conductors separated by an insulator form a capacitor. Push charge onto
one plate and an equal opposite charge is drawn to the other; the energy is
held in the electric field between them. Capacitance measures how much charge
the pair holds per volt across it:

C = Q / V

The unit, the farad, is one coulomb per volt — enormous in practice, so real
parts run from picofarads (RF tuning) through nanofarads (signal work) to
microfarads (supply smoothing) and single-digit farads only in supercapacitors.

Geometry sets the value: capacitance grows with plate area, shrinks with plate
separation, and multiplies by the dielectric constant of the insulator between
the plates. Every construction trick in a parts catalog — rolled films,
stacked ceramics, wet electrolytics — is a way to buy area and thinness
without a physically huge part.

## The defining behavior: i = C dv/dt

Current through a capacitor is proportional to how fast its voltage changes.
Three consequences do most of the circuit work:

1. **DC is blocked.** A steady voltage means dv/dt = 0, so no current. After
   charging, a capacitor is an open circuit to DC.
2. **Fast changes pass.** The quicker the voltage wiggles, the more current
   flows — capacitors couple signals while blocking bias, and shunt
   high-frequency noise to ground (decoupling).
3. **Voltage cannot jump.** An instantaneous voltage step would demand
   infinite current, so capacitor voltage is always continuous. This is why
   capacitors hold up a supply rail through brief load spikes — and why a
   charged capacitor bites after the power is off.

Energy stored: E = ½CV². A camera-flash electrolytic at a few hundred volts
holds real, respect-worthy energy; discharge large capacitors deliberately.

## RC charging and the time constant

Charge a capacitor through a resistor and the voltage approaches its target
exponentially, with time constant

τ = R x C

After one τ the capacitor has covered about 63 percent of the remaining
distance; after 5τ it is within 1 percent — "fully" charged for practical
purposes. The same constant governs discharge. This single number is the
heartbeat of timing circuits, debouncers, ramp generators, and every filter in
Module 9: RC = seconds when R is in ohms and C in farads (or, handier at
bench scale, kΩ x µF = ms).

## Combining capacitors

The rules are the mirror image of resistors. **Parallel capacitances add**
(more plate area side by side): C = C1 + C2. **Series combine by
reciprocals** (the same charge must sit on every capacitor in the chain, so
voltage divides): 1/C = 1/C1 + 1/C2. Series connection is also how voltage
ratings stack — with balancing resistors, because real leakage never divides
evenly on its own.

## Real capacitors

The ideal part exists only in the model world. Real capacitors add:

- **Leakage** — the dielectric conducts slightly, so stored charge bleeds off
  (electrolytics leak most).
- **ESR** (equivalent series resistance) — heats the part under ripple
  current and limits how fast it can dump charge.
- **ESL** (series inductance) — leads and internal structure make every
  capacitor self-resonant; above that frequency it behaves inductively, which
  is why boards pair a big electrolytic with a small ceramic side by side.
- **Tolerance and drift** — some ceramic dielectrics lose a large fraction of
  their capacitance with DC bias and temperature; timing circuits use film or
  stable-dielectric ceramics for this reason.
- **Polarity** — electrolytics and tantalums are polarized; reverse them and
  they fail, sometimes energetically. Observe the marked terminal.

Choose by role: bulk electrolytic for energy storage, ceramic for decoupling,
film for timing and audio, and always derate voltage generously.
