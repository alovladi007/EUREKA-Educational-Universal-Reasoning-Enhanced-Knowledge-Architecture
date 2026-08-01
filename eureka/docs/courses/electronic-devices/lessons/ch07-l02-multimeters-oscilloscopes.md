# Multimeters and Oscilloscopes

<!-- covers: 7.3, 7.4 -->

## Multimeters

The digital multimeter is the bench's first instrument, and Module 2
already stated its physics: voltmeters in parallel with ~10 megohm input,
ammeters in series through a fused shunt, ohmmeters sourcing a known small
current into an unpowered circuit. Craft turns those facts into habits.
Counts and digits set resolution (a 6000-count meter resolves 0.001 V on
the 6 V range); accuracy is a percent-of-reading plus digits, from the
manual, not assumed. Continuity mode is the most-used mode in practice -
beep means connected - with the caveat that it can conduct through
semiconductor junctions and mislead; diode mode deliberately does, reading
the junction's forward drop and identifying pinout and health in one
number. True-RMS meters read non-sinusoidal AC honestly where average-
responding meters lie - the Module 2 waveform lesson deciding a purchase.
The classic failure: measuring voltage with the leads still in the current
jacks, which shorts the circuit through the meter's shunt; the fuse that
then blows is doing its Module 3 job. Autoranging is convenience; manual
ranging is speed and stability when chasing a drifting value.

## Oscilloscopes

A scope draws voltage against time - the instrument that turns Module 2's
transients, ringing, and phase from theory into pictures. Modern bench
scopes are digital: two or four channels, bandwidth from 50 MHz up,
sampling fast enough to honor it. Bandwidth is the -3 dB point from the
decibel lesson, and the working rule follows the edge-content arithmetic:
bandwidth of at least 0.35 / rise time of the fastest edge you care about,
with 5x the fundamental as a comfortable floor for repetitive waves.

Triggering is the skill that separates users from owners: edge trigger on
the right channel, slope, and level turns hash into a stable trace; holdoff
and single-shot capture catch rare events; the trigger point is time zero
and pre-trigger capture shows what led up to it. Probes are part of the
circuit: a 10x passive probe divides by ten and, more importantly, presents
~10 megohms and a few picofarads instead of the cable's raw capacitance -
compensate it against the calibration square wave (the little screw) or
every edge lies. The probe's ground clip is a loop inductance; for fast
edges, the short ground spring replaces it. Two channels plus math give
differential views and, with a current probe or shunt, power waveforms.
The scope's own limits - front-end noise floor, memory depth deciding how
long you can record at full rate - are the last things the display teaches
you to read.
