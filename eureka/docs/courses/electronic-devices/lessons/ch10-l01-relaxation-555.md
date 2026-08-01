# Relaxation Oscillators and the 555 Timer

<!-- covers: 10.1, 10.2 -->

## RC relaxation oscillators

A relaxation oscillator charges a capacitor toward a threshold, triggers,
discharges, and repeats - Module 2's RC exponential bent into a loop by
Module 8's hysteresis. The canonical form: a Schmidt-configured comparator
whose output charges its own input capacitor through R. The output is a
square wave; the capacitor wears a rough sawtooth; frequency scales as
1/RC with the exact constant set by the threshold band. A CMOS inverter
with Schmitt inputs plus one R and one C is the minimal implementation;
the astable pair of transistors flipping each other is the classic
discrete one. Relaxation oscillators are inexact (they inherit RC
tolerance and threshold drift) but simple, low-frequency-friendly, and
everywhere a clock need only be approximate - blinkers, beepers, charge
pumps.

## The 555

The 555 timer packages the idea with dignity: two comparators referenced
at 1/3 and 2/3 of supply from an internal divider, a flip-flop, a
discharge transistor, and a stout output.

**Astable** (oscillator): two resistors and a capacitor. C charges through
Ra + Rb toward 2/3 Vcc, discharges through Rb to 1/3 Vcc; frequency ~=
1.44 / ((Ra + 2 Rb) C), duty cycle set by the resistor ratio (always above
50 percent in the basic circuit; a diode across Rb or the fully-symmetric
variants fix that). Because both thresholds are supply ratios, the timing
is largely supply-independent - the design's quiet elegance.

**Monostable** (one-shot): a trigger below 1/3 Vcc starts a single pulse
of width 1.1 R C - the debouncer, the delay, the pulse stretcher.

**Practical notes**: decouple the control pin (pin 5) with 10-100 nF; the
bipolar 555's output crowbar draws a supply spike each transition (decouple
generously); CMOS versions (7555) run to microamps and megohertz-plus with
gentler outputs; timing capacitors should be the stable dielectrics of
Module 3, because the oscillator is exactly as good as its C. Two 555s -
or the dual 556 - chain into delayed-pulse and gated-tone circuits; the
device's half-century survival is the strongest recommendation a part can
have.
