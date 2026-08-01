# Transistors: BJTs and FETs

<!-- covers: 4.3 -->

## The idea

A transistor lets a small electrical quantity control a large one. Two
families dominate: bipolar junction transistors (BJTs), controlled by
current, and field-effect transistors (FETs), controlled by voltage. Both
switch and both amplify; the differences decide which you reach for.

## BJTs

An NPN transistor is two junctions back to back: base-emitter forward
biased like a diode (0.7 V), collector collecting. Base current times gain
(beta, typically 100-300, loosely specified) sets collector current, up to
what the external circuit allows.

Two operating styles: as a **switch**, drive enough base current that the
collector saturates near 0.2 V - compute base resistor from (Vdrive - 0.7)/
Ib with Ib generously above Ic/beta. As an **amplifier**, bias in the active
region and small base wiggles become large collector swings - Module 8's
op-amps package this properly. PNP mirrors everything for high-side duty.
BJT virtues: cheap, robust, predictable 0.7 V; vices: base current loads
the driver, saturation is slowish, and beta varies with everything.

## MOSFETs

An enhancement MOSFET conducts drain-to-source when gate-to-source voltage
exceeds its threshold; the gate is insulated and draws no DC current at
all. On, it is a resistance - **Rds(on)**, milliohms in good parts - so
conduction loss is I-squared-R rather than a fixed drop: the reason MOSFETs
own power switching. N-channel parts (low side) beat p-channel (high side)
on Rds(on) at equal cost.

Three cautions. **Threshold vs logic levels**: a "logic-level" FET is fully
on at 3.3 or 5 V; a standard one may barely conduct and cook. **Gate
capacitance**: no DC current, but nanofarads to charge every switching
edge - fast PWM needs gate drive current. **The body diode**: built-in,
source-to-drain, sometimes your free flyback, sometimes a sneak path.
Static can puncture the thin gate oxide before assembly; handle bare parts
with basic ESD care.

## Choosing and checking

Switch selection: voltage rating above worst-case (plus kickback), current
rating with thermal headroom by the Module 2 arithmetic, logic-level gate
if a microcontroller drives it, gate resistor to tame ringing, pulldown so
floating means off. JFETs and depletion parts (on by default) fill niche
analog roles worth recognizing on schematics. First diagnosis is always
the same: measure the control voltage (VBE or VGS), then the switched
voltage (VCE or VDS) - one tells you if you asked, the other if it obeyed.
