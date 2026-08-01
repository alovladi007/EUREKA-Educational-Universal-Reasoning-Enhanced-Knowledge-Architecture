# Decibels, Input and Output Impedance, and Two-Port Thinking

<!-- covers: 2.31, 2.32, 2.33 -->

## Decibels

Signal chains multiply gains; logarithms turn that into addition. The decibel
expresses a power ratio as

dB = 10 log10(P2/P1)

and, because power goes as voltage squared into a fixed impedance,

dB = 20 log10(V2/V1)

Anchors worth memorizing: 3 dB is a factor of 2 in power (about 1.41 in
voltage); 10 dB is 10x power; 20 dB is 10x voltage; 0 dB is unity; negative
dB is loss. A chain of +26 dB, −3 dB, +10 dB nets +33 dB by simple addition —
the entire reason the unit exists. Absolute flavors pin the reference: dBm is
relative to 1 mW (0 dBm = 1 mW, 30 dBm = 1 W), dBV to 1 volt. The "half-power
point" of a filter is its −3 dB frequency, a phrase used constantly from here
on.

## Input and output impedance

Any stage, however complicated inside, shows two Thevenin faces. Looking into
its input: an **input impedance** Zin, the load it presents to whatever
drives it. Looking back from its output: an **output impedance** Zout, the
source impedance it presents to whatever it drives. Connecting stage A to
stage B forms a voltage divider — Zout(A) against Zin(B) — and the signal
that survives is Zin/(Zin + Zout) of what A intended.

The design rule for voltage signals follows at once: **outputs low, inputs
high**. With Zin at least ten times Zout, the divider passes over 90 percent
and stages can be designed independently — the modularity that makes complex
systems tractable. The exceptions are deliberate power matches (RF's 50 Ω
world, per the conjugate-match rule) where equal impedances are chosen on
purpose and half the voltage is the accepted price.

## Two-port networks and filters

Treating a stage as a **two-port** — input pair, output pair, characterized
by what it does to signals rather than by its innards — is the abstraction
that organizes everything ahead. The first payoff is the passive filter
family, read directly off the complex divider:

- RC with the capacitor on the output: **low-pass**, cutoff fc = 1/(2πRC),
  −3 dB at fc, rolling off 20 dB per decade above.
- Swap R and C: **high-pass**, same fc, mirrored response.
- L and C together buy **band-pass** and **notch** shapes around the
  resonance of the previous lesson.

Cascading two-ports multiplies their responses — adds them in dB — provided
each stage's input impedance is high enough not to load the one before: the
impedance rule and the decibel rule working as one system. Module 9 builds
the full filter vocabulary (orders, ripple, phase) on exactly this frame.
