# Network Theorems: Kirchhoff, Superposition, Thevenin and Norton

<!-- covers: 2.17, 2.18, 2.19, 2.19.1, 2.19.2, 2.20, 2.20.1 -->

Series-parallel reduction fails the moment a network has a bridge, multiple
sources, or any topology that is not a ladder. The theorems in this lesson
handle every linear circuit, no exceptions, and they are the working language
of every schematic discussion you will ever have.

## Kirchhoff's two laws

**KCL (current law):** the currents into any node sum to zero — charge does
not pile up at a junction. Whatever flows in flows out.

**KVL (voltage law):** the voltage changes around any closed loop sum to zero
— potential is single-valued, so walking any loop back to your starting point
returns you to the same energy level.

These are conservation of charge and energy dressed for circuits. The method:
name a current for each branch (direction guessed freely — a negative answer
just means the guess was backward), write KCL at the nodes and KVL around
independent loops, and solve the linear system. Sign discipline is the entire
skill: pick a walking direction, count a drop when entering a component at its
higher-potential end, a rise otherwise, and never change convention
mid-problem. Two well-chosen loops solve most textbook networks; a computer
solves the rest by exactly the same equations.

## Superposition

In a linear circuit with several sources, the response to all sources equals
the sum of the responses to each source taken alone, with the others
*deactivated*: voltage sources replaced by shorts (zero volts means the
terminals are tied together), current sources by opens (zero amps means the
branch is absent). Solve one simple circuit per source and add.

Superposition is why a signal riding on a DC bias can be analyzed as two
separate problems, which is precisely how every amplifier chapter later in
this course thinks. Its limit matters too: it applies to voltages and currents
only — never to power, which is quadratic and does not add by source.

## Thevenin's theorem

Any linear two-terminal network — however tangled — is equivalent, at those
terminals, to one voltage source Vth in series with one resistance Rth.

- **Vth** is the open-circuit voltage at the terminals.
- **Rth** is the resistance seen looking back into the terminals with sources
  deactivated (same short/open replacements as superposition). Equivalently,
  Rth = Vth / Isc, where Isc is the short-circuit current.

The payoff is separation of concerns: reduce everything upstream of a load to
two numbers, then study any load against them with the divider rule. The
loaded-divider problem from the previous lesson *is* a Thevenin argument: a
divider's Rth is R1 parallel R2, which quantifies exactly how much a load
drags the tap. The battery internal-resistance model is Thevenin applied to
chemistry. Later, an amplifier's "output impedance" is nothing but its Rth.

## Norton's theorem

The mirror image: the same network is also one current source In in parallel
with the same Rth, where In = Vth/Rth. Thevenin and Norton forms interconvert
freely; use whichever makes the next calculation a one-liner (series
structures favor Thevenin, parallel structures favor Norton).

## Maximum power transfer

With a fixed source (Vth, Rth), the load that extracts the most power is
RL = Rth, and at that match exactly half the power is lost inside the source
— 50 percent efficiency, at best. Two different design goals follow. Power
systems want *efficiency*, so they make Rth as small as possible and never
match. Signal systems (radio front ends, audio lines) often want *maximum
signal power* into the next stage, so they match impedances deliberately. When
a later chapter says a 50 Ω antenna feed "must be matched," this theorem is
the reason, and when a power supply boasts low output impedance, it is the
same theorem read the other way.
