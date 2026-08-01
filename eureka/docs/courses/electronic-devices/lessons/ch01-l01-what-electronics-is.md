# What Electronics Is, and How to Learn It

<!-- covers: chapter 1 -->

Electronics is the craft of controlling electric charge to do useful work:
sensing the world, computing decisions, and acting on them. Every device you
will study in this course is a variation on that one theme. A thermistor turns
temperature into a resistance you can measure. A microcontroller turns
measurements into decisions. A transistor turns a small decision into a large
current, and a motor turns that current back into motion. The whole field fits
in the loop between sensing, deciding, and acting.

## Two ways to describe the same circuit

You will constantly move between two descriptions of any circuit, and knowing
which one you are using matters more than beginners expect.

The **physical description** is copper, silicon, and electric fields. Charge
carriers drift through conductors; energy is stored in fields and dissipated
as heat. This level explains *why* components behave as they do — why a
resistor warms up, why a capacitor blocks steady current but passes changes,
why a wire is not really a perfect conductor at high frequency.

The **model description** is symbols and mathematics: ideal sources, pure
resistances, lumped capacitances. Models deliberately ignore most of the
physics so that you can calculate. An ideal battery holds its voltage at any
current, which no real battery does; the model is still the right starting
point because it makes the arithmetic tractable, and you add reality back in
(internal resistance, temperature drift, tolerance) only where it changes the
answer.

Good practice is to design in the model world and then ask, deliberately,
where the model is lying to you. Most debugging is finding the place where the
real component stopped behaving like its symbol.

## The roles components play

It helps to sort the parts catalog by role rather than by name:

- **Sources** put energy in: batteries, supplies, generators, signal sources.
- **Passive components** shape energy without adding any: resistors limit and
  divide, capacitors store charge in electric fields, inductors store energy
  in magnetic fields, transformers move energy between windings.
- **Active components** use a small signal to control a larger one: diodes
  steer current one way, transistors amplify and switch, integrated circuits
  package thousands to billions of them into functions.
- **Transducers** cross between the electrical world and everything else:
  sensors inward, speakers, motors, and displays outward.

A radio, a power supply, and a robot differ mostly in which roles dominate,
not in the physics underneath.

## How this course is organized

The course walks the same road most working engineers walked. First, theory:
charge, current, voltage, resistance, and the circuit laws that let you
predict any network of them (Module 2 — the longest module, and the
foundation everything else stands on). Then the component families one at a
time: passives, semiconductors, optoelectronics, sensors. A hands-on module
covers the workshop itself: instruments, prototyping, soldering, and safe
practice. From there the course builds upward through the classic functional
blocks — amplifiers, filters, oscillators, regulators — into digital logic,
microcontrollers, and finally applied domains: motors, audio, and modular
ecosystems for rapid prototyping. Three reference appendices close it out.

Nothing in later modules is magic; every op-amp trick and every switching
regulator reduces to Module 2's handful of laws applied carefully. When a
later topic feels opaque, the fix is almost always three modules back, not
ahead.

## What to have on hand

You can complete the theory modules with pencil and paper, but electronics
rewards touching it. A breadboard, a digital multimeter, a handful of
resistors, capacitors, LEDs, and a 5 V or 9 V source are enough for the first
half of the course. The hands-on module discusses instruments in detail before
any project requires them.

**Safety, from day one:** the projects in this course stay at low voltage,
and mains electricity is treated only descriptively (Appendix A explains how
wall power works so you can respect it, not so you can wire it). Anything
above roughly 50 V deserves training, insulation, and a second person nearby.
