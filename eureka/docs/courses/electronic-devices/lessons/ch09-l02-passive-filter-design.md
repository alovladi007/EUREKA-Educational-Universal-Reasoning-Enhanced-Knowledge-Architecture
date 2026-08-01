# Passive Filter Design

<!-- covers: 9.3, 9.4, 9.5, 9.6, 9.7 -->

## First-order RC design

The workhorse: series R, shunt C makes a low-pass with fc = 1/(2 pi R C);
swap them for the high-pass with the same formula. Design is two choices.
Pick fc from the job; pick R to respect impedances - large against the
source's output impedance, small against the load's input impedance (the
Module 2 rule), then C follows. At fc the output is -3 dB and phase is 45
degrees; a decade out, attenuation is ~20 dB and phase approaches 90.

Cascading two RC sections steepens rolloff toward 40 dB/decade, but each
section loads the previous - the honest fix is a buffer between (Module 8's
follower), an impedance step of 10x per section as the rough alternative.

## A note on types, applied

The named families from the previous lesson are recipes for component
ratios once order exceeds one. Passive RC alone cannot produce complex
poles - cascaded RCs make only gentle knees - so true Butterworth or
Chebyshev shapes passively require inductors (RLC), and at low frequencies
inductors are large, lossy, and hum-prone. This is the economic argument
for the next lesson's active filters; passively, LC design tables serve RF
where inductors are small.

## Band-pass and notch

**Wide band-pass**: cascade a high-pass and a low-pass with separated
cutoffs; order of sections barely matters if buffered. **Narrow band-pass**
is Module 2's series or parallel RLC resonance put to work: center
frequency f0 = 1/(2 pi sqrt(LC)), bandwidth f0/Q, with loaded Q set by the
source and load the tank sees.

**Notch**: the **twin-T** network - two bridged T sections, one RC low
path and one CR high path - nulls deeply at f0 = 1/(2 pi R C) with
ordinary parts, the classic 50/60 Hz hum remover. Its Q is modest and its
null depth lives and dies on component matching (1 percent parts or
trimming); bootstrapping the T's common node from a follower sharpens Q,
previewing the active module. LC series traps to ground and parallel
tanks in line do the same job at radio frequencies.

Throughout, the checklist is the same: confirm the source and load
impedances the design assumes, verify with a swept measurement (function
generator plus scope, plotting Module 2's dB against log frequency), and
remember that component tolerance moves fc by the same percentage.
