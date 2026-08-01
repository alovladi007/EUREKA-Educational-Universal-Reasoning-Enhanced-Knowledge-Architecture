# Comparators and Op-Amp Applications

<!-- covers: 8.12, 8.13, 8.14, 8.15, 8.16, 8.17 -->

## Comparators proper

A comparator answers one question - which input is higher - as fast as
possible. Dedicated comparators (LM393 class) beat op-amps at the job:
they recover from overdrive instantly and many have **open-collector**
outputs that need a pull-up resistor and, in exchange, level-shift to any
logic voltage and wire-AND together. Op-amps pressed into comparator duty
are slow to leave saturation; comparators pressed into amplifier duty
oscillate. Use each for its purpose.

## Hysteresis, again and properly

A bare comparator on a slowly drifting input chatters at the threshold -
noise crosses it many times. The Schmitt configuration from the feedback
lesson fixes it: positive feedback creates an upper and a lower threshold
separated by a band wider than the noise. Design is two resistors: their
ratio sets the band, centered by the reference choice. Every thermostat,
light-activated switch, and battery-voltage monitor in this course's
projects is a comparator with hysteresis wearing a different sensor.

## Single-supply technique

On one supply the reference cannot be ground-and-below; build a threshold
divider from the rail and compare against it. Open-collector outputs make
the level indicator almost free: a chain of comparators against a resistor-
ladder of references - each output lighting an LED - is the **window
comparator** generalized into the bar-graph **voltage-level indicator**
(the LM3914 integrates the whole idea). A window comparator itself is two
comparators ANDed: in-range when above the low threshold and below the
high one - the go/no-go tester.

## The applications drawer

The op-amp module closes by naming what the pieces build. Precision
**rectifiers** put a diode inside the feedback loop, dividing its 0.7 V
sin by open-loop gain - millivolt signals rectified honestly. **Peak
detectors** add a capacitor to hold the maximum. **Current sources** hold
a resistor's voltage constant, so its current is constant into any
compliant load. **Instrumentation amplifiers** - two buffering op-amps
feeding a difference stage, gain set by one resistor - read bridges and
biopotentials with high impedance on both inputs; buy them integrated.
**Active rectifier/absolute-value, sample-and-hold, log amps** for wide
dynamic range, and **voltage references** stiffer than any Zener complete
the standard shelf. Every one is the golden rules plus Module 2 arithmetic
- which is the module's real conclusion: learn the two rules and the
catalog becomes derivable rather than memorizable.
