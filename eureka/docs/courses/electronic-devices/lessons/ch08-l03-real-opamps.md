# Real Op-Amps: Types, Specifications, and Care

<!-- covers: 8.6, 8.7, 8.8, 8.9, 8.10, 8.11 -->

## The families

Real parts diverge from the ideal in chosen directions. Bipolar-input
op-amps offer low noise and low offset; FET-input parts (JFET, CMOS) draw
picoamps of bias current - the choice for high-impedance sources like pH
electrodes and charge amps. Precision types minimize offset and drift;
chopper-stabilized parts drive offset to microvolts. Rail-to-rail input
and/or output parts swing (nearly) to their supplies - essential at low
single-supply voltages. Low-power parts sip microamps; high-speed parts
trade everything for bandwidth. The venerable 741 remains a teaching
fossil; the modern default is a rail-to-rail CMOS part chosen by the specs
that follow.

## The specifications that bite

**Input offset voltage**: the small built-in input difference (millivolts
down to microvolts) that the amplifier treats as signal - multiplied by
closed-loop gain, it becomes output error. **Input bias current**: what the
inputs actually draw; through big resistors it becomes voltage error
(matching the impedances seen by both inputs cancels the common part).
**Gain-bandwidth product**: open-loop gain falls with frequency; GBW is
roughly gain times bandwidth available, so a 1 MHz-GBW part at gain 100
gives 10 kHz - budget it. **Slew rate**: the output's maximum volts per
microsecond; large fast swings become triangles when it runs out - full
power bandwidth follows from amplitude times frequency. **CMRR and PSRR**:
rejection of common-mode input and supply garbage, in Module 2 decibels.
**Output current limits and load stability**: op-amps dislike driving big
capacitance directly; a small series resistor restores their composure.

## Powering and practical care

Op-amps run happily on split supplies (+/-12 V classic) or a single
supply, but single-supply designs must create a mid-rail reference - a
divider plus buffer - so signals have somewhere to sit; "ground" in those
schematics means the reference, a direct reuse of Module 2's reference-
node idea. Decouple every supply pin (the 100 nF law). Keep inputs within
the specified common-mode range - many parts misbehave oddly, some invert
phase, outside it. Respect that outputs never quite reach the rails unless
rail-to-rail is promised, and even then not into heavy loads.

## Compensating the residual errors

Offset: many single op-amps expose null pins for a trim pot; the modern
route is choosing a better part or calibrating in software downstream.
Bias-current error: match source impedances at both inputs. **Frequency
compensation**: most parts are internally compensated (stable at unity
gain) at the cost of bandwidth; decompensated parts are faster but demand
minimum gain. Instability announces itself as ringing or oscillation on
edges; the cures are the series output resistor into capacitive loads, a
small feedback capacitor across Rf, and layout that keeps the feedback
node short and far from the output's return path.
