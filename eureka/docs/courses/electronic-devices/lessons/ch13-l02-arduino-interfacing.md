# Arduino and Interfacing with Microcontrollers

<!-- covers: 13.4, 13.5 -->

## Arduino as an on-ramp

Arduino is three things braided: boards (Uno and kin), a portable C++
core (setup() and loop(), pinMode/digitalWrite/analogRead), and an
ecosystem of libraries plus shields that reduce most peripherals to an
include and three calls. Its genius is subtraction - the toolchain,
programmer, and boilerplate vanish - which makes it the right first
platform and a legitimate prototyping tool thereafter. The same IDE now
targets ESP32, RP2040, and ARM boards; graduation paths (vendor IDEs,
PlatformIO, bare registers) stay open when timing or footprint demand.
The honest caveats: the abstraction hides costs (digitalWrite is slow
compared to direct port access), and the 5 V Uno world meets a 3.3 V
sensor world - level awareness from Module 12 travels here.

## The interfacing catechism

Wiring the outside world to pins is this course in miniature.

**Digital in**: switches per Module 3 - pull-up (usually the internal
one), button to ground, debounce in hardware or firmware. **Digital
out**: LEDs with their resistor arithmetic; anything beyond tens of
milliamps through Module 4's transistor with its flyback diode on coils
and motors - the microcontroller commands, it does not carry.

**Analog in**: the ADC rules of Module 12 - respect source impedance,
band-limit, use the quiet reference, average in firmware. **Analog
out**: PWM plus RC filter, or a DAC/I2S part when quality matters.

**Serial buses**: UART for point-to-point and debug consoles (crossed
TX/RX, matched baud); **I2C** for the sensor swarm - two open-drain
lines, pull-ups sized to bus capacitance, addresses resolved (Module 6's
digital sensors all live here); **SPI** for speed - four wires plus a
chip-select per device. The logic analyzer from Module 7 is the
disagreement-settler for all three.

**Timing**: hardware timers and interrupts replace delay() the moment
two things must happen at once; interrupt handlers stay short, shared
data gets guarded - the single deepest firmware habit this course can
gift.

**Robustness**: every lesson's protections converge at the pins - series
resistors and clamps on lines leaving the board, TVS on connectors
(Module 4), optical isolation where domains differ (Module 5), watchdog
armed, brown-out set. A microcontroller project is the course's parts
list orchestrated by code - which is precisely why it sits at the end.
