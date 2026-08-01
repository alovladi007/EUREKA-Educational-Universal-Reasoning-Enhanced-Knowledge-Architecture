# AC Analysis: Sinusoids, Complex Numbers, and Impedance

<!-- covers: 2.25, 2.26, 2.27 -->

## Why sinusoids, and why complex numbers

AC analysis privileges the sine wave for one deep reason: a sinusoid into any
linear circuit comes out a sinusoid of the same frequency — only its
amplitude and phase change. Two numbers per signal, then, fully describe what
a circuit does at a given frequency. Complex numbers carry exactly two
numbers (magnitude and angle), so they are the natural bookkeeping.

A sinusoid V0 cos(ωt + φ) is represented by the **phasor** V0∠φ — a complex
number of magnitude V0 and angle φ, with the spinning e^(jωt) factored out
and understood. (Electronics writes j for the imaginary unit; i is taken.)
Angular frequency ω = 2πf ties the notation to hertz. All the algebra of
Module 2 — Ohm, dividers, Kirchhoff, Thevenin — survives intact with complex
arithmetic substituted for real.

## Impedance: resistance generalized

Each passive component gets a complex "resistance," its **impedance** Z, so
that V = IZ holds for phasors:

- Resistor: Z = R. No frequency dependence, no phase shift.
- Inductor: Z = jωL. Magnitude ωL grows with frequency (**inductive
  reactance** XL); the +j means voltage leads current by 90°.
- Capacitor: Z = 1/(jωC) = −j/(ωC). Magnitude 1/(ωC) falls with frequency
  (**capacitive reactance** XC); the −j means current leads voltage by 90°.

The limits confirm the DC lessons: at ω → 0 a capacitor's impedance blows up
(open) and an inductor's vanishes (wire); at high frequency they trade
places. A mnemonic generations have used: in a capacitor C, I leads V; in an
inductor L, V leads I ("ELI the ICE man" encodes the same fact).

Series impedances add; parallel combine by reciprocals; the divider rule
becomes Vout = Vin x Z2/(Z1 + Z2). That one complex divider IS the RC
low-pass, the RC high-pass, and every passive filter in Module 9 — evaluate
it at different ω and read off magnitude (gain) and angle (phase shift).

## Working a circuit

The routine: convert sources to phasors, components to impedances, solve with
DC-style algebra, convert back. A series RC driven at ω has
Z = R − j/(ωC); the current magnitude is V0/|Z| with
|Z| = sqrt(R² + 1/(ωC)²), and its phase leads the source voltage by
arctan(1/(ωRC)). No differential equations were harmed; that is the entire
point of the method.

Two cautions. First, phasor arithmetic is per-frequency: a signal containing
several frequencies is handled by superposition, one at a time (Fourier's
idea, made explicit later in this module). Second, some genuinely odd-looking
results are real physics, not algebra slips: voltages across L and C in the
same loop can each *exceed* the source voltage, because their opposite phases
partially cancel — the preview of resonance, next lesson.
