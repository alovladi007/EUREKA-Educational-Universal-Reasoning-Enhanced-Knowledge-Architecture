# Speakers, Crossovers, Driver ICs, and Signal Sources

<!-- covers: 15.8, 15.9, 15.10, 15.11, 15.12 -->

## Speakers

A dynamic speaker is the microphone's mirror: coil in a magnetic gap,
driven by amplifier current, pushing a cone. Its nominal impedance (4 or
8 ohms) is a curve, not a constant - rising at the bass resonance and
with frequency (the coil is an inductor) - and the amplifier sees all of
it. Drivers specialize by size: woofers move air slowly, tweeters move
fast and small (domes, and piezo elements at the cheap end), midranges
between. Enclosures are half the instrument: sealed boxes trade
extension for control, ported boxes tune a resonance for bass, and an
unbaffled driver cancels its own low end. Efficiency is quoted as dB SPL
at one watt, one meter - typical cones turn over 99 percent of the
amplifier's watts into heat, which reframes the power-amp lesson's
arithmetic.

## Crossovers

Multi-driver systems split the spectrum with Module 9 made of coils and
capacitors: a series inductor low-passes the woofer, a series capacitor
high-passes the tweeter, second-order networks steepen slopes and flip
tweeter polarity by convention. Crossover points and slopes juggle driver
limits and dispersion; component quality matters because these filters
sit in the power path. **Active** systems move the crossover before the
amplifiers - line-level filters, one amp per driver - buying driver
protection and tunability at the price of channels; powered studio
monitors and every subwoofer plate amp work this way.

## Chips that drive speakers

The IC catalog scales with the job: headphone drivers, the eternal
LM386-class single-supply speaker amp (a breadboard staple with its
gain-set capacitor and Zobel network), bridged (BTL) chips that double
swing for small speakers, and Class D modules (PAM8403 to TPA-class)
that put watts on a fingernail with two capacitors. Digital sources speak
**I2S** to DAC/amp chips, and Bluetooth audio modules reduce wireless
sound to power-and-speakers. Datasheet reading carries over: watts at
stated supply, load, and THD, plus the shutdown/mute pin that clicks are
made of (pop suppression is a listed feature for a reason).

## Signals and oddities

**Audible signalers**: piezo elements (raw discs need an oscillator -
Module 10's relaxation circuits at their most audible; "buzzer" modules
include one), magnetic buzzers, and chimes - specified by SPL at
distance and drive. The **miscellaneous drawer** holds enduring circuits:
tone controls, VU meters (Module 8's level indicators calibrated in dB),
white/pink noise sources for room testing, spring and digital reverbs,
and the compressor/limiter - a voltage-controlled amplifier servoed by
its own envelope, protecting speakers and ears alike. Each is prior
modules recombined, which is the audio chapter's quiet thesis: sound is
electronics where every abstraction gets auditioned by ear.
