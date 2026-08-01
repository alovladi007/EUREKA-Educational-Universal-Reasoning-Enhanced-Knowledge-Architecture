# Audio Amplification: Preamps, Mixers, and Power Stages

<!-- covers: 15.4, 15.5, 15.6, 15.7 -->

## The audio chain

Audio systems are a gain ladder: microphone or instrument level
(millivolts) to **line level** (~1 V) in a preamp, routing and summing in
a mixer, then the power amplifier's watts into a speaker. Each interface
obeys the Module 2 impedance rule in its audio dialect - **bridging**:
outputs low (hundreds of ohms), inputs high (tens of kilohms), voltage
transferred, loading negligible. The exception list is short and
deliberate: microphone/preamp pairings where noise match matters, and
600-ohm legacy gear.

## Preamplifiers

A preamp is Module 8 tuned for ears: low-noise op-amps (or discrete
front ends), gain set by the feedback pair, AC coupling chosen so the
low-frequency corner sits below 20 Hz, and input impedance suited to the
source (1 M-ohm for guitar pickups, 2 k-ohm-ish for dynamic mics via
balanced differential stages). Noise discipline dominates: gain early
(establish signal above the noise floor at the first stage), short
shielded input wiring, and the ground rules - one ground path, shields
landed at one end - that keep hum out. RIAA phono preamps add a
standardized equalization curve: Module 9's filters as a contractual
obligation.

## Mixers

A mixer is the summing amplifier from Module 8 grown professional: each
channel contributes through its fader into a virtual-earth bus, so
channels cannot load each other - the virtual ground doing real work.
Pan pots split to stereo buses; aux sends tap channels for effects and
monitors; tone controls are Module 9 filters per channel (the classic
Baxandall bass/treble being a feedback filter of enduring elegance).
Headroom bookkeeping in dB tracks every stage: clipping in an early
stage is forever, so faders ride below unity and meters watch the sum.

## Power amplifiers

Driving a speaker's low impedance takes current, and the output-stage
classes name the compromise. **Class A** conducts always - purest,
hottest. **Class B** splits push-pull at zero - efficient, with
crossover distortion where devices hand over. **Class AB** biases
slightly on to erase the handover: the classic hi-fi answer, its bias
set against thermal drift. **Class D** switches - PWM at hundreds of
kilohertz into an LC filter, Module 11's switching insight applied to
music - now dominant from phones to subwoofers at 90-percent-plus
efficiency. Ratings worth reading like an engineer: continuous watts
into a stated load at a stated distortion (peak/music/PMPO numbers are
marketing), damping factor (output impedance again), and thermal
design per Module 2. Bridging doubles swing across a load; impedance
minimums exist because current, not voltage, is what melts outputs.
