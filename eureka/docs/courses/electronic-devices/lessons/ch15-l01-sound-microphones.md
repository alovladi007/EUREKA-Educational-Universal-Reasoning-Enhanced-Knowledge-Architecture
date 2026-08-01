# Sound and Microphones

<!-- covers: 15.1, 15.2, 15.3 -->

## A little acoustics

Sound is pressure waves: frequency is pitch (human hearing spans ~20 Hz
to 20 kHz, shrinking with age), amplitude is loudness, and loudness
perception is logarithmic - Module 2's decibel arrives home. Sound
pressure level in dB SPL references 20 micropascals (the hearing
threshold); conversation sits near 60 dB SPL, pain near 120. Timbre is
harmonic content - the Fourier lesson audible - and room acoustics
(reflection, absorption, standing waves) shape everything a microphone
hears and a speaker delivers.

## How microphones work

Every microphone converts pressure to voltage through a moving element.
**Dynamic** mics move a coil in a magnetic field (a speaker run
backward): rugged, no power needed, modest output, happiest against loud
sources. **Condenser** mics vary a charged capacitor's spacing -
Module 2's C changing with a diaphragm - requiring polarization (48 V
phantom power for studio mics) and an internal buffer, repaying with
sensitivity and extension. **Electret** condensers freeze the charge into
a film and need only a couple of volts through a resistor for their
internal JFET - the ubiquitous capsule. **MEMS** microphones put an
electret-class element plus preamp (analog or digital/PDM out) on
silicon: the phone-era default, tiny and consistent.

## Reading a microphone datasheet

**Sensitivity**: output per pascal, in mV/Pa or dBV/Pa - sets gain
required downstream. **Impedance**: the Thevenin fact governing cable and
preamp choice (low-Z balanced mics drive long cables; the pH-meter rule
recalls that high-Z sources demand high-Z inputs and short leads).
**Frequency response**: flat is honest, shaped is flattering - read the
curve, not the range. **Directionality**: omni hears everything; cardioid
rejects the rear (feedback resistance on stage); figure-eight takes
sides. **Maximum SPL and self-noise** bracket the dynamic range, in the
dB arithmetic that this module never stops using. **Balanced output** -
signal on two wires, interference common to both, subtracted at the
differential input (Module 8) - is why professional audio survives long
cables; the XLR connector carries the convention.
