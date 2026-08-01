# Light Sources: Photons, Lamps, and LEDs

<!-- covers: 5.1, 5.2, 5.3 -->

## A little light physics

Light is electromagnetic radiation delivered in quanta - photons - whose
energy is fixed by wavelength: E = hc/lambda, shorter is more energetic.
Visible light spans roughly 400 nm (violet) to 700 nm (red), flanked by
ultraviolet and infrared, both of which electronics uses constantly (UV for
erasing and curing, IR for remotes and proximity). The photon picture
explains the whole module: emitting a photon costs a fixed energy step, and
detecting one requires the photon to afford a device's energy step. That is
why an LED's color sets its forward voltage and why silicon detectors fade
beyond ~1100 nm - photons cheaper than the bandgap cannot lift an electron
across it.

## Lamps

Incandescent lamps heat a tungsten filament white-hot: broadband, warm,
dimmable, and inefficient - most output is infrared. Their cold filament
resistance is roughly a tenth of the hot value, so switch-on inrush is
about ten times running current - a real sizing input for switches and
transistors driving them, and the classic reason lamps die at turn-on.
Discharge lamps (neon indicators, fluorescents) conduct through ionized
gas: they need a strike voltage, exhibit negative resistance, and demand a
ballast to limit current. Neon bulbs survive as charming ~90 V indicators;
fluorescents and their phosphors were the efficiency story until LEDs ended
the argument.

## LEDs

A light-emitting diode is a junction whose recombining carriers emit
photons. Everything from the diode lesson applies, with color chemistry
setting forward voltage: red ~1.8-2.0 V, green/yellow ~2.0-2.2 V, blue and
white ~3.0-3.4 V (white is blue plus phosphor).

The one non-negotiable habit: an LED is current-driven, and never connects
straight across a supply. Series resistor arithmetic is the divider rule's
simplest job: R = (Vsupply - Vf) / If, with 5-20 mA for indicators.
Brightness tracks current, but the linear, flicker-free way to dim is PWM -
switch fast, vary duty cycle, let the eye average (the microcontroller
module's first trick). High-power illumination LEDs escalate the same
physics: an amp or more, a constant-current driver rather than a resistor,
and a heat sink sized by Module 2's thermal arithmetic, because the diode
that makes light also makes heat and its lifetime is a temperature story.
Multicolor packages are just multiple dies (RGB = three LEDs sharing an
anode or cathode); seven-segment displays are LEDs in a costume that
Module 12 will drive.
