# AC Power, Thevenin in AC, and Resonance

<!-- covers: 2.28, 2.29, 2.30 -->

## Three kinds of AC power

With sinusoids, "power" splits into three related quantities. **Real power**
P (watts) is energy actually converted per second — heat, light, motion.
**Reactive power** Q (VAR) is energy sloshing back and forth between the
source and the fields of L and C, never converted. **Apparent power** S (VA)
is what the wires must carry: S = Vrms x Irms.

They relate by the power triangle, S² = P² + Q², and the ratio

power factor = P / S = cos φ

where φ is the phase angle between voltage and current. A resistor has power
factor 1; a pure reactance, 0 — current flows, wires heat, nothing useful
happens. RMS values exist precisely to make the arithmetic honest: the RMS of
a sine is its peak divided by sqrt(2), defined so that Vrms across a resistor
dissipates Vrms²/R exactly like DC. Mains "120 V" or "230 V" are RMS figures.

Utilities bill and size equipment on this arithmetic, which is why industrial
plants add capacitor banks to cancel inductive Q — power factor correction is
the divider rule of the power triangle. In electronics the same idea explains
why a supply rated 100 VA may deliver far fewer watts into a reactive load.

## Thevenin, AC form

Thevenin's theorem carries over verbatim with impedances: any linear AC
network at two terminals is a phasor source Vth in series with a complex
impedance Zth, computed exactly as before (open-circuit voltage; sources
deactivated for Zth). Maximum power transfer gains one refinement: the
optimal load is the **complex conjugate** of the source impedance,
ZL = Zth* — the reactances cancel, and the resistances match as in DC. This
conjugate match is the design rule behind RF and audio interfacing.

## Resonance

Put L and C together and there is one frequency where their reactances are
equal and opposite:

f0 = 1 / (2π sqrt(LC))

**Series RLC:** at f0 the +jωL and −j/(ωC) cancel; the loop impedance
collapses to just R, current peaks, and the voltages across L and C — each
Q times the source voltage — cancel each other in phase. That individual
component voltages exceed the source is measurable, occasionally hazardous,
and entirely real.

**Parallel RLC** mirrors it: at f0 the tank's impedance is maximal, current
from the source is minimal, while a large circulating current swirls between
L and C internally.

**Q and bandwidth.** The quality factor Q measures how sharply tuned the
resonance is: for a series circuit Q = ω0L/R (energy stored over energy lost
per cycle). Bandwidth follows directly:

BW = f0 / Q

A high-Q circuit rings long and selects narrowly — a radio tuner. A low-Q
circuit responds broadly and settles fast. Losses (winding resistance,
capacitor ESR, and whatever load the tank drives) all lower the working Q, so
a "loaded Q" is always below the component Q; connecting a measurement probe
detunes the very circuit it measures — the electrical version of the
observer effect the sensors module returns to.

Resonance is the organizing idea behind oscillators (Module 10), tuned
filters (Module 9), and unintended board-level ringing when stray L meets
stray C — the same equation, invited or not.
