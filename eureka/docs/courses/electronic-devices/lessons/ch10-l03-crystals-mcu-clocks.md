# Crystal Oscillators and Microcontroller Clocks

<!-- covers: 10.6, 10.7 -->

## Quartz resonators

A quartz crystal is a piezoelectric slab that rings mechanically at a
frequency set by its cut and dimensions, coupling to the circuit through
its electrodes. Electrically it models as a series RLC of astonishing Q -
tens of thousands - with a parallel package capacitance: a resonator a
thousand times sharper than any LC tank. Frequency tolerance is quoted in
parts per million, drift in ppm per degree; compare the RC oscillator's
percent-grade wander.

The standard circuit is the **Pierce oscillator**: an inverting amplifier
(one CMOS inverter, or the one inside every microcontroller) with the
crystal from output to input and two small **load capacitors** to ground.
The crystal's specified load capacitance must match what the circuit
presents - the two caps in series plus board strays - or the frequency
sits ppm off; that is calibration, not failure. Drive level matters:
overdriving a small crystal ages or fractures it.

The family tree: **watch crystals** (32.768 kHz, 2^15, one tick per
second after 15 divide-by-twos) run real-time clocks at microamps; **AT-cut
megahertz crystals** clock everything else; **TCXOs** add temperature
compensation for single-ppm stability; **OCXOs** oven the crystal for
parts-per-billion; **ceramic resonators** trade two orders of accuracy for
pennies and built-in caps; **crystal oscillator modules** package crystal,
amplifier, and output driver - five volts in, clock out, no design
required. MEMS oscillators do the same job in silicon.

## Clocking microcontrollers

Every microcontroller offers a menu that recapitulates this module.
**Internal RC** oscillators: zero parts, percent-grade accuracy - fine for
blinking, marginal for asynchronous serial at speed, wrong for USB without
trim. **External crystal** through the on-chip Pierce amplifier: the ppm
default. **Ceramic resonator**: the cost compromise. **External clock
input**: one oscillator disciplines many chips. Add the 32.768 kHz watch
crystal on the RTC pins for timekeeping through sleep. Inside, a **PLL**
multiplies the reference up to the core frequency - the VCO lesson closing
its loop - and firmware selects sources at boot. The design rule inherits
everything above: crystal and its load caps tight against the pins, ground
plane beneath, and the datasheet's load capacitance honored, because a
clock that is slightly wrong fails intermittently, which is the most
expensive way to fail.
