# Diodes

<!-- covers: 4.2 -->

## The one-way valve, quantified

A silicon diode conducts when forward-biased past about 0.6-0.7 V and drops
roughly that voltage almost regardless of current - the useful lie; the
truth is a steep exponential. In reverse it leaks nanoamps until its rated
maximum reverse voltage. Model for circuit work: ideal switch plus 0.7 V.
That drop costs real power (P = 0.7 x I), which is why rectifying 10 A
through a plain diode heats seven watts and why better alternatives exist.

## The family

- **Rectifiers** (1N4007 class): built for amps and hundreds of volts,
  slow to stop conducting - fine at mains frequency, wrong for switchers.
- **Small-signal** (1N4148 class): tiny currents, nanosecond speed - logic
  steering, clamps, demodulation.
- **Schottky**: a metal-semiconductor junction with 0.2-0.4 V drop and no
  reverse-recovery lag - the default flyback and switching-supply diode; the
  price is more leakage and lower voltage ratings.
- **Zener**: operated in controlled reverse breakdown at its rated voltage,
  it holds that voltage while current varies - the crude regulator and the
  clamp. Below ~5 V true Zener physics, above it avalanche; both sold as
  Zeners.
- **Varactor**: reverse-biased junction used as voltage-variable
  capacitance for tuning.
- LEDs are diodes too - Module 5 gives them their own treatment.

## Circuits diodes make

**Rectification**: half-wave (one diode, half the waveform), full-wave
bridge (four diodes, both halves, two drops in series), and the
center-tapped two-diode variant - Module 11 builds supplies from these.
**Clamps** hold a node within a diode drop of a rail: input-protection pairs
to supply and ground are exactly this. **Steering** picks the higher of two
supplies (battery backup ORing). **Flyback** across every coil, as Module 2
ordered. **Level shifting** exploits the fixed drop, and a diode's ~2 mV/C
drift makes it a serviceable temperature sensor - nuisance and feature in
one property.

Datasheet reading distills to four numbers: maximum average forward
current, peak surge current (rectifiers meet capacitor inrush), maximum
reverse voltage with margin over the real circuit's peaks, and recovery
time matched to switching frequency.
