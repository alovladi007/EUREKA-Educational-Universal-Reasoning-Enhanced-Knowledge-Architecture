# Charge in Motion: Current, Voltage, and Power

<!-- covers: 2.1, 2.2, 2.2.1, 2.3, 2.3.1, 2.3.2, 2.3.3, 2.3.4, 2.3.5, 2.4, 2.4.1 -->

## Current: counting charge as it passes

Electric current is the rate at which charge crosses a boundary. Pick any
cross-section of a wire; if charge Q passes through it in time t, the average
current is I = Q/t. The unit, the ampere, is one coulomb per second, and one
coulomb is the charge of about 6.24 x 10^18 electrons — an enormous number,
which is why currents we call small still involve unimaginably many carriers.

Two conventions coexist and you must hold both without confusion.
**Conventional current** points from + to −, a definition fixed by history
before the electron was discovered. **Electron flow** is the physical drift of
negative carriers, which runs the opposite way in a metal. Every formula,
datasheet, and schematic arrow in this course uses conventional current;
electron flow matters only when the physics of a device (a vacuum tube, a
semiconductor junction) makes you think about actual carriers.

For perspective on magnitudes: a microcontroller pin sources a few
milliamperes, an LED wants tens of milliamperes, a soldering iron draws a few
amperes, a car starter motor a few hundred. The span from a nanoamp leakage to
a hundred-amp motor is eleven orders of magnitude, and the same laws cover all
of it.

A subtlety worth keeping: the individual electrons in a copper wire drift
astonishingly slowly — well under a millimeter per second at ordinary
currents. What moves near light speed is the *field* that pushes them, which
is why a lamp lights the instant you close a switch even though no single
electron has gone anywhere far.

## Voltage: the push per unit of charge

Voltage is energy per charge: one volt is one joule given to (or taken from)
each coulomb that moves between two points. Voltage is always a *difference*
between two points; the phrase "the voltage at a node" silently means "with
respect to the circuit's reference (ground)". Nothing about a single isolated
point has a voltage.

A battery maintains its voltage chemically: reactions at the electrodes do
work on charge, lifting it to higher potential the way a pump lifts water.
Generators do the same with magnetism, solar cells with light, thermocouples
with temperature differences. Whatever the mechanism, the source is a charge
pump with a stated energy-per-charge.

The **water analogy**, used carefully, is honest: voltage is pressure
difference, current is flow rate, a resistor is a narrow pipe, a capacitor is
a rubber-membrane tank that stores pressure, a diode is a check valve. It
breaks down where water intuition has no counterpart (there is no wire
inductance in a garden hose), so treat it as scaffolding to be discarded, not
as the theory.

**Combining sources:** cells in series add their voltages (each coulomb gets
lifted twice), and matched cells in parallel keep the same voltage while
sharing the current demand, extending capacity. Never parallel mismatched
voltages; the higher source drives current backward through the lower one,
wasting energy in both and often damaging the weaker cell.

## Power: the rate of energy conversion

Multiply the two definitions and units cancel beautifully: voltage is joules
per coulomb, current is coulombs per second, so their product is joules per
second — watts.

P = V x I

This **generalized power law** holds for every component, in every circuit, at
every instant: the power a component absorbs is the voltage across it times
the current through it. A component absorbing power converts electrical energy
into something else — heat in a resistor, light in an LED, chemistry in a
charging battery, motion in a motor. A component *delivering* power (a
discharging battery, a generator) is the same equation with the current
flowing out of its positive terminal.

Keep P = VI in reach at all times. It sizes resistors so they do not char,
predicts battery life, explains why power lines run at high voltage (same
power at higher V means lower I, and losses grow with current), and later
underlies every efficiency argument about regulators and amplifiers.

## The microscopic picture, briefly

Inside a metal, conduction electrons form a gas of carriers wandering
randomly at high thermal speeds. Applying a voltage tilts the landscape: a
small drift superimposes on the random walk, and that drift is the current.
Collisions with the lattice transfer energy to it — the metal warms. That is
resistance seen from underneath, and it is the subject of the next lesson.
