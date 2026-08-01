# Photothyristors, Optoisolators, and Optical Fiber

<!-- covers: 5.8, 5.9, 5.10 -->

## Light-fired power switches

A photothyristor is an SCR or triac whose gate is a photodetector: light
latches it. Packaged with an LED, it becomes the opto-triac - the standard
way logic safely fires mains loads. Zero-crossing versions wait for the AC
wave to pass through zero before latching, which kills the switching
transient and most of the interference; random-phase versions fire
immediately and enable phase-angle dimming. Small opto-triacs usually
trigger a larger power triac rather than carry the load themselves - the
datasheet's trigger current and blocking voltage tell you which role a part
can play.

## Optoisolators

An optoisolator crosses a signal over an insulation barrier with no shared
conductor: LED in, detector out, thousands of volts of isolation between.
Uses are everywhere the two sides must not meet electrically - mains
sensing, motor drivers, medical front ends, breaking ground loops between
chassis.

The workhorse is LED plus phototransistor (PC817 class). Its **current
transfer ratio** - output current per LED current - is the gain figure,
loosely specified and falling with LED age, so designs saturate the output
rather than trust CTR linearity. Speed is modest; digital isolators and
opto parts with integrated logic outputs serve fast buses. Design mechanics:
set LED current like any LED (a few milliamps to saturate the output), give
the output a pull-up sized for the load and the speed, and respect
**creepage and clearance** - the isolation is only as good as the physical
distance across the package and board keeps it. Linear isolation (analog
across the barrier) uses matched-photodiode parts or, more commonly now,
modulation: convert to PWM or digital, cross, convert back.

## Optical fiber

Fiber carries light down a glass or plastic core by total internal
reflection: the cladding's lower refractive index traps rays shallower than
the critical angle. Plastic fiber and cheap LEDs make short industrial
links immune to every electrical insult at once - EMI, ground loops,
lightning induction, and eavesdropping by induction. Glass fiber goes to
kilometers: multimode (wider core, LED- or VCSEL-driven, modal dispersion
limits distance-bandwidth) and single-mode (narrow core, laser-driven, the
long-haul answer). The link budget is the engineering: source power minus
connector, splice, and per-kilometer losses must still exceed receiver
sensitivity - decibel arithmetic from Module 2, now in optical dBm. The
receiver is the photodiode-plus-transimpedance pair from the previous
lesson; the whole module's parts assemble into one system here.
