# Filter Foundations

<!-- covers: 9.1, 9.2 -->

## The vocabulary of frequency selection

A filter passes some frequencies and attenuates others. Module 2 built the
machinery - impedance, the complex divider, decibels, Bode thinking - and
this module spends it. Terms first: the **passband** is what survives, the
**stopband** what is suppressed, and the **cutoff** (-3 dB, half power)
marks the boundary. **Rolloff** is how fast attenuation grows past cutoff,
in dB per decade; each reactive element contributes a **pole** worth 20
dB/decade asymptotically. **Order** counts the poles. Phase shift
accompanies every magnitude change, and **group delay** - phase's
derivative - decides whether a waveform keeps its shape; audio and data
care about it, a power-supply filter does not.

Impedance context matters as much as the network: Module 2's two-port rule
applies, because a filter designed for given source and load impedances
changes character when loading changes. This is the classic mistake with
cascaded passive sections.

## The four shapes

**Low-pass** passes below cutoff - smoothing, anti-aliasing, tone control.
**High-pass** passes above - DC blocking, rumble removal. **Band-pass**
passes a window - tuning, tone detection. **Notch (band-stop)** removes a
window - the mains-hum killer. Every one has a first-order RC/RL
realization from Module 2's divider; steeper needs cascaded poles or
resonance.

## The response families

For a given order, component ratios shape the curve, and three named
compromises dominate. **Butterworth**: maximally flat passband, moderate
rolloff, well-behaved phase - the default. **Chebyshev**: steeper rolloff
bought with passband ripple and worse phase. **Bessel**: gentlest rolloff
but maximally flat group delay - waveforms keep their shape, the choice
for pulses and audio crossovers. (Elliptic filters buy the steepest
transition with ripple in both bands - named here for recognition.) The
family choice is a statement about what you can afford to distort:
amplitude flatness, transition width, or time-domain fidelity - pick two
at best.
