# Wires, Cables, and Connectors

<!-- covers: 3.1 -->

## Wire

Wire is the component everyone forgets is a component. Solid wire holds its
shape and suits breadboards and point-to-point runs; stranded wire flexes
without fatiguing and belongs anywhere that moves. Insulation matters as much
as copper: its temperature rating and voltage rating are the wire's real
limits, and its color is free documentation — pick a convention (red for
supply, black for the reference rail) and never betray it.

Gauge selection was covered with resistance in Module 2: thicker wire for
higher current, shorter runs for lower drop. Add one workshop rule here:
every mechanical joint is a future intermittent fault, so a circuit that
works when you press on it has just told you where its bad joint is.

## Cables

A cable is wires packaged for a purpose, and the packaging is engineering:

- **Ribbon cable** keeps many conductors in known order for connectors that
  pierce all of them at once.
- **Twisted pair** cancels magnetically induced noise, because each twist
  reverses the loop's orientation and successive pickups cancel. This is why
  it carries networks and long sensor runs.
- **Coaxial cable** surrounds a center conductor with a grounded shield, so
  the field stays inside and outside interference stays outside. It has a
  characteristic impedance (75 ohm for video, 50 ohm for RF gear) that
  matters once cable length approaches the signal's wavelength - the
  impedance-matching story from Module 2 made physical.
- **Shielded multiconductor** wraps ordinary signal bundles in foil or braid
  for the same reason, grounded at one end to avoid loop currents.

## High-frequency reality

At mains and audio frequencies a wire is a wire. As frequency climbs, the
Module 2 parasitics take over: series inductance (roughly nanohenries per
millimeter), capacitance to neighbors, and **skin effect** - alternating
current crowds toward the conductor surface, raising effective resistance
with the square root of frequency. Long leads on a fast signal ring, radiate,
and pick up neighbors; the cure is short leads, ground planes, and cables
designed for the job.

## Connectors

Connectors are specified by current per contact, mating cycle count, and
whether they can be inserted wrong. A few families recur everywhere: screw
terminals (field-serviceable power), 0.1-inch pin headers (every dev board),
crimped housings (reliable when the crimp tool is right, treacherous when
pliers pretend), audio and barrel jacks, USB, and coaxial families like BNC
and SMA. Two habits prevent most connector grief: strain-relieve every cable
so force lands on the housing rather than the solder joints, and treat
polarized connectors as the cheap insurance they are.

## Reading the drawings

Schematic wiring symbols carry conventions worth learning early: dots mark
joined crossings, no dot means wires merely cross, and a small bridge or
break symbol is sometimes used to emphasize non-connection. Connector pins
are numbered from a marked pin 1; ribbon cable's red stripe tracks it.
When a schematic and a board disagree, the meter settles it - continuity
mode exists precisely for this argument.
