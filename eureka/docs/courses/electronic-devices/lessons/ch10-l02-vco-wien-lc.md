# Sinusoidal Oscillators: VCOs, Wien-Bridge, and LC

<!-- covers: 10.3, 10.4, 10.5 -->

## The oscillation criterion

An oscillator is an amplifier whose output feeds back to its input **in
phase** with **loop gain of exactly one**. More gain and the amplitude
grows until something limits it; less and it dies. Every sinusoidal
oscillator is a frequency-selective network choosing where the phase
condition holds, plus an amplifier restoring the loss, plus some mechanism
- explicit or accidental - that regulates gain to unity.

## Voltage-controlled oscillators

A VCO's frequency follows a control voltage. Relaxation-style VCOs steer
the capacitor's charging current with the control voltage - linear
frequency control, the heart of function-generator ICs and PLLs
(phase-locked loops, where a VCO is servoed to track a reference). LC and
crystal VCOs pull their resonator with a varactor - Module 4's
voltage-variable capacitance earning its keep. Function generator chips
and the classic 566/8038 lineage package triangle-and-square VCOs;
microcontroller-era designs often replace them with programmable
oscillators and DDS chips, which synthesize a sine numerically.

## Wien-bridge and twin-T

The **Wien-bridge** puts a series RC and parallel RC pair in the positive
feedback path: at f = 1/(2 pi R C) the network's phase is zero and its
attenuation is exactly 3, so an amplifier of gain 3 oscillates there. The
subtlety is gain control: fixed gain 3 either dies or clips. The classic
solution - a lamp in the gain leg whose resistance rises as it warms -
regulates amplitude to striking purity; modern versions use a JFET or
diode network as the variable element. The result is the cleanest simple
audio sine source. The **twin-T** oscillator inverts the trick: the notch
network from Module 9 in the negative feedback path lets gain survive only
at the notch frequency.

## LC oscillators

At radio frequencies the resonator is Module 2's LC tank, and the named
variants differ in how the feedback taps it: **Colpitts** divides the
capacitor (two Cs, feedback from their junction), **Hartley** divides the
inductor, **Clapp** adds a series capacitor for stability. Frequency is
the tank's f0 = 1/(2 pi sqrt(LC)); purity and stability inherit the
tank's Q and its components' tempco. Amplitude self-limits on the
transistor's nonlinearity, which also generates the harmonics a following
tank filters. LC oscillators drift with temperature and load - buffer the
output, keep the tank mechanically stiff - and when drift is
unacceptable, the next lesson's crystal takes over.
