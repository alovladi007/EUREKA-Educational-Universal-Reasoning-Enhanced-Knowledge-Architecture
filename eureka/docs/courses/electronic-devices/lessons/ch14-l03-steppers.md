# Stepper Motors

<!-- covers: 14.5, 14.6, 14.7, 14.8, 14.9 -->

## Motion in discrete steps

A stepper's rotor snaps to alignments of energized stator coils: pulse the
phases in sequence and it rotates in fixed **steps** - 200 per revolution
(1.8 degrees) being standard. Position control needs no feedback: count
steps from a home switch and you know where you are, provided torque
margin is honest, because overloaded steppers slip silently and the count
lies. That open-loop bargain is the stepper's whole identity: 3D printers
and CNC machines accept it; closed-loop hybrids add encoders to catch the
lie.

## Kinds

**Permanent-magnet** steppers (tin-can) are coarse and cheap; **variable-
reluctance** rotors follow the path of least reluctance (rare now);
**hybrid** steppers - toothed PM rotors - dominate with fine steps and
real torque. Wiring divides **bipolar** (four wires, two coils, current
reversed by an H-bridge per coil - full copper used, the modern default)
from **unipolar** (five/six wires, center taps, one polarity per
half-coil - simpler drive, weaker, now niche). Identification of a
mystery motor is resistance archaeology: measure between leads; center
taps read half the winding resistance, and the meter maps the coils.

## Driving

Sequences escalate: **wave** (one phase at a time), **full-step** (two
on - more torque), **half-step** (alternating one/two - doubled
resolution), and **microstepping** - sinusoidally weighted currents
positioning the rotor between poles for smoothness and quiet, at reduced
incremental torque. Torque falls with speed as inductance limits current
rise (Module 2's L/R against shrinking step times); **chopper drivers**
defeat this by applying high voltage and regulating current by PWM -
which is why steppers run from 12-48 V supplies at modest coil ratings.

## Translators and modules

Nobody sequences by hand twice: **translator** driver ICs (A4988/DRV8825/
TMC class modules) accept STEP and DIR pulses, handle sequencing,
microstepping, current regulation (set the reference - the screw on every
printer driver), and thermal protection. The microcontroller's job
reduces to pulse trains with controlled **acceleration** - ramping step
rate so inertia never exceeds torque, the firmware discipline that
separates smooth machines from ones that stall at the same corner every
time. Silent TMC drivers and sensorless-homing tricks are the current
frontier, reachable with the same two control pins.
