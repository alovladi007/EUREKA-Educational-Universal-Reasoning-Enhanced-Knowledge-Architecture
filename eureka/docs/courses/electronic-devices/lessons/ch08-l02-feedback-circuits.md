# Feedback and the Classic Op-Amp Circuits

<!-- covers: 8.4, 8.5 -->

## Negative feedback circuits

Route a fraction of the output back to the **minus** input and the golden
rules generate the canon:

**Voltage follower**: output wired to -, signal into +. Gain exactly 1;
input impedance enormous, output stiff. This is the buffer that fixes
Module 2's divider-loading problem - the impedance rule (outputs low,
inputs high) sold as a part.

**Non-inverting amplifier**: feedback through a divider (Rf from output to
-, Rg from - to ground). The output must make the divider's tap equal the
input, so gain = 1 + Rf/Rg. Input impedance stays enormous.

**Inverting amplifier**: + grounded, input through Rin to -, feedback Rf.
The - input is held at ground (a **virtual ground**); input current
Vin/Rin must flow through Rf, so gain = -Rf/Rin. Input impedance is Rin -
finite, the price of inversion.

**Summing amplifier**: several input resistors into the virtual ground;
currents add, output is the weighted inverted sum - the audio mixer's core.

**Difference amplifier**: four matched resistors subtract one input from
the other - the bridge reader from the sensors module.

**Integrator and differentiator**: replace Rf with a capacitor and the
output ramps at a rate set by the input (integrator); swap positions for
the differentiator. Both are the calculus of Module 2 made hardware, and
both need a large resistor across the capacitor (integrator) or a small
one in series (differentiator) to tame drift and noise.

**Transimpedance amplifier**: photodiode into the virtual ground, feedback
resistor converts its current to voltage - Module 5's promised partner.

The unifying analysis: mark the virtual short (inputs equal), apply "no
input current," write Ohm's law. Every circuit above yields in three lines.

## Positive feedback

Route feedback to the **plus** input and equality becomes instability: any
difference grows. Controlled, that is not a defect but a function. The
**Schmitt trigger** adds a resistor from output to +, so the switching
threshold moves after each transition: two thresholds (hysteresis), one
for rising and one for falling. Noisy or slow signals cross once, cleanly,
instead of chattering - the debouncing and squaring tool the comparator
lessons formalize. Positive feedback also underlies oscillators (Module
10): feedback that arrives in phase, with net loop gain of one, sustains
itself. The sign of the feedback terminal is thus the fork in analog
design: minus stabilizes, plus commits.
