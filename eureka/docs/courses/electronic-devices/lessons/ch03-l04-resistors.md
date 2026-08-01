# Resistors as Components

<!-- covers: 3.5 -->

## From law to part

Module 2 established what resistance does; this lesson is about resistors as
purchasable objects. The bridge is short: Ohm's law and the series-parallel
rules are assumed from here on.

## Reading and choosing

Through-hole resistors wear color bands: two or three significant digits, a
multiplier, and a tolerance band (gold 5 percent, brown 1 percent). Surface-
mount parts print digits instead - 472 means 47 x 10^2, 4.7 kilohms.
Standard values come in E-series (E12, E24, E96) spaced so each value's
tolerance window meets the next; this is why 4.7 k exists and 5 k mostly
does not.

Four numbers select a resistor: value, tolerance, power rating, and package.
Power was Module 2's I-squared-R arithmetic with headroom. Tolerance is a
design decision - a 5 percent part in a voltage divider driving an ADC may
waste two of your bits, while a pull-up could be 20 percent off and no one
would know.

## Real resistor behavior

Beyond tolerance, real parts drift with temperature (specified as ppm per
degree; metal film's low tempco is why precision circuits use it), add a
little noise (carbon composition is noisiest, wirewound and metal film
quietest), and carry parasitic inductance - a wirewound resistor is
literally a coil, and fast circuits avoid it for that reason. Voltage
ratings exist too: a tall resistance across a big supply can exceed the
element's rated volts before it exceeds its watts.

Types map to jobs: **metal film** for precision and low noise, **thick-film
chip** for nearly everything surface-mount, **wirewound** for power,
**carbon film** for the legacy drawer. Networks and arrays pack matched
resistors into one package, useful for bus pull-ups and matched dividers.

## Variable resistors

A potentiometer is a resistive track with a sliding tap - three terminals,
and the divider rule made mechanical. Wired as a divider it spans its full
range smoothly; wired as a two-terminal rheostat it adjusts resistance but
never quite reaches zero and wastes a terminal's usefulness. Tapers matter:
linear for control voltages, logarithmic for volume, because hearing is
logarithmic (the decibel lesson, embodied in a knob). Trimmers are small
set-and-forget potentiometers for calibration; multi-turn versions trade
speed for settability.

Two potentiometer cautions carry over from theory: the divider-loading rule
(a low-resistance load bends the taper), and the wiper's current limit,
which is far below what the track's power rating implies at the track's
ends. When a knob must survive millions of cycles or a dirty environment,
the modern answer is often a rotary encoder plus firmware - a preview of the
microcontroller module's philosophy of replacing analog adjustment with
digital state.
