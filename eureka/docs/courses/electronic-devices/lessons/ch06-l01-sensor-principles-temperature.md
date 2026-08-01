# Sensor Principles and Temperature Measurement

<!-- covers: 6.1, 6.2 -->

## What every sensor shares

A sensor maps a physical quantity onto an electrical one, and four ideas
grade every mapping. **Precision** is repeatability - how tightly repeated
readings cluster. **Accuracy** is truth - how close the cluster sits to the
real value. **Resolution** is the smallest distinguishable step. They are
independent: a sensor can resolve millidegrees, repeat beautifully, and be
two degrees wrong. **Calibration** converts the first two into the third:
compare against a reference, correct offset and slope (two points fix a
straight line), and remember that calibration drifts.

The **observer effect** is physics, not philosophy: measuring changes the
measured. A thermistor self-heats with its own excitation current; a
voltmeter loads its divider (Module 2's rule); a pressure tap perturbs the
flow. Good practice minimizes the excitation, then corrects for what
remains - Appendix B's uncertainty language turns this discipline into
numbers.

## Temperature

Temperature is the most-measured quantity in electronics, with four
standard answers.

**Thermistors** (NTC) are the semiconductors whose resistance falls with
heat - Module 2's sign-flip made useful. Wired in a divider they are cheap
and sensitive, but the resistance-temperature curve is exponential
(described by the beta equation or better by Steinhart-Hart), so linear
interpolation only works over narrow spans; firmware applies the equation.
Self-heating sets the floor on excitation current. PTC siblings switch
resistance sharply upward and serve as resettable fuses and heater limits
rather than measurers.

**RTDs** - platinum resistance elements like PT100 - drift by an
almost-linear ~0.385 percent per degree from a precise 100 ohm at 0 C:
laboratory-grade accuracy and stability, small signal, and lead resistance
big enough to matter (three- and four-wire connections exist to cancel it -
the four-wire idea being force current on one pair, sense voltage on the
other, so lead drops never enter).

**Thermocouples** exploit the Seebeck effect: junctions of dissimilar
metals develop microvolts per degree of *difference* between hot junction
and reference. They measure flames and furnaces no silicon survives, at the
price of tiny signals and a required cold-junction reference measurement -
which is, with pleasing circularity, usually a semiconductor sensor.

**Semiconductor sensors** package the diode's ~2 mV/C drift, calibrated:
analog parts output millivolts per degree; digital ones ship the reading
over I2C. Within their -40 to +125 C world they are the easy, accurate
answer and the natural microcontroller companion.

Selection collapses to range, accuracy needed, and interface effort - and
whatever the sensor, the thermal contact to the thing measured usually
dominates the error budget.
