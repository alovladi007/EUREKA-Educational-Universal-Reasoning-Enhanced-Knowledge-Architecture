# Inductance: Storing Energy in a Magnetic Field

<!-- covers: 2.24 -->

## The dual of the capacitor

A coil of wire resists changes in the current through it. Current creates a
magnetic field; changing that field induces a voltage that opposes the change
(Lenz's law). Inductance measures the effect:

v = L di/dt

The unit is the henry: one volt appears across one henry when its current
changes by one ampere per second. Practical parts run microhenries (RF,
switching converters) to millihenries (chokes) to henries (mains-frequency
iron-core chokes).

Everything about the capacitor has a mirror statement here. A capacitor's
voltage cannot jump; an inductor's **current** cannot jump. A capacitor
blocks DC and passes fast changes; an inductor **passes DC** (it is just wire,
minus its winding resistance) and **opposes fast changes**. Capacitors store
energy in an electric field, E = ½CV²; inductors store it magnetically:

E = ½LI²

Inductance grows with the square of the turn count and with the permeability
of the core: winding on iron or ferrite multiplies L enormously over air, at
the price of **saturation** — past a limit current the core cannot magnetize
further and the inductance collapses, a failure mode switching-supply
designers plan around explicitly.

## The interrupted inductor: kickback

Because current cannot jump, breaking an inductive circuit forces the inductor
to keep its current flowing *somewhere* — and v = L di/dt says the voltage
will rise as high as necessary to do it. Open a switch feeding a relay coil
and hundreds of volts appear across the gap, arcing contacts and killing
transistors. The standard cure is a **flyback diode** across the coil,
oriented to be off in normal operation and to give the collapsing current a
quiet loop when the switch opens. Every relay, solenoid, and motor winding in
this course gets one; this paragraph is the reason.

The same physics used deliberately is the boost converter (Module 11): switch
current into an inductor, interrupt it, and harvest the voltage spike into a
capacitor. Kickback is a fault or a feature depending on who planned it.

## RL time constant

An inductor in series with a resistance approaches its final current
exponentially with

τ = L / R

after one τ the current has covered ~63 percent of the distance, and 5τ is
effectively settled — the same exponential arithmetic as RC, with current and
voltage swapping roles. Note the division: *more* resistance makes an RL
circuit settle *faster*, the opposite of RC intuition.

## Series, parallel, and real parts

Inductances combine exactly like resistances: series adds, parallel combines
by reciprocals — provided the coils' fields do not overlap. When they do, the
coupling adds mutual inductance, which is not a nuisance but a component: two
deliberately coupled coils are a transformer, treated with Module 3's
components and again in power supplies.

Real inductors depart from ideal in ways that dominate at the extremes:

- **Winding resistance** — many meters of thin wire; it sets loss and the
  floor of the RL time constant.
- **Interwinding capacitance** — adjacent turns form tiny capacitors, giving
  every inductor a self-resonant frequency above which it looks capacitive
  (the mirror of the capacitor's ESL story).
- **Core losses and saturation** — hysteresis and eddy currents heat the
  core; saturation collapses L at high current. Datasheet current ratings
  encode both.
- **Quality factor Q** — the ratio of energy stored to energy lost per
  cycle, which will grade every resonant circuit in the AC lessons ahead.

With both field-storage components in hand, the next lessons put them under
sinusoidal drive, where resistance generalizes to impedance and the RC/RL
constants become frequency responses.
