# Transients, Nonsinusoidal Sources, and Simulation

<!-- covers: 2.34, 2.35, 2.36, 2.37 -->

## Transient circuits

Phasor analysis describes the steady state — the behavior after a circuit has
settled into rhythm with its source. Flip a switch and there is a **transient**
between the old state and the new: the RC and RL exponentials of the earlier
lessons, now seen as the general rule. The recipe for any first-order switch
event: find the variable that cannot jump (capacitor voltage, inductor
current), take its value at the instant of switching as the starting point,
find where the new circuit would settle, and connect the two with an
exponential of time constant RC or L/R.

Second-order circuits — both L and C present — can **ring**: the response
overshoots and oscillates at roughly the resonant frequency while R damps it
away. Underdamped, critically damped, and overdamped name how much R relative
to the L/C pair; the damped ring on every fast digital edge and every relay
click is this physics, uninvited.

## Periodic but not sinusoidal

Fourier's theorem: any periodic waveform is a sum of sinusoids — a
fundamental at the repetition frequency plus **harmonics** at integer
multiples. A square wave is the fundamental plus odd harmonics falling off as
1/n; a triangle wave the same but as 1/n², which is why it sounds and filters
so much smoother. The practical method follows from superposition: pass each
harmonic through the circuit's frequency response separately and resum.
Sharp corners live in high harmonics — so any low-pass rounds a square wave,
and a "distorted" amplifier is one that redistributed harmonic energy. This
one idea unifies filters, audio timbre, and digital signal integrity.

## Nonperiodic sources

Signals that never repeat — a single pulse, a step, noise, speech — extend
the same idea from a sum to a continuum of frequencies (the Fourier
transform). The engineering moral survives intact without the calculus: the
faster a signal's edges, the wider the band of frequencies it occupies. A
nanosecond edge is a broadband event, which is why fast logic radiates, why
scope bandwidth must exceed the signal's edge content (a working rule:
bandwidth ≈ 0.35 divided by rise time), and why "digital" boards fail in
analog ways.

## SPICE: the calculator of record

Hand analysis carries a page or two of components; beyond that, circuit
simulation does the bookkeeping. SPICE-family tools (the free LTspice and
ngspice among them) take a netlist — components, nodes, values — and offer
the three analyses this module taught by hand: **DC operating point**
(bias), **AC sweep** (the frequency response of the phasor lessons, plotted
in dB), and **transient** (the time-domain waveforms of this lesson).

Use it as a check on understanding, not a substitute: simulation happily
produces precise nonsense from a wrong model, ideal parts hide the ESR,
saturation, and tolerance realities this module flagged, and a result you
cannot roughly predict by hand is a result you cannot trust. Estimate first,
simulate second, and when the two disagree, finding out why is where the
learning is. With that, the theory module is complete; everything after it is
these laws wearing component costumes.
