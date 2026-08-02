# Molecular-Scale Devices, DNA Electronics, and What the Field Delivered

<!-- covers: 52.4, 52.5, 52.6 -->

## Molecular-scale devices

Plastic electronics uses organic materials in bulk. **Molecular electronics** in
the strict sense is the more radical proposal: use a single molecule, or a few,
as the active device. A molecule is one to a few nanometres across, is defined
exactly by its chemical formula so every copy is identical, and can in principle
be synthesized in Avogadro numbers cheaply. Those are genuinely attractive
arguments and they are why the field has persisted.

**How a single-molecule junction is made and measured.** The molecule is
chemically anchored between two metal electrodes, usually gold, through end
groups such as thiols that bond to the metal. Practical geometries include:

- **Break junctions**, where a thin metal wire is stretched until it breaks and a
  molecule bridges the resulting gap. Mechanically controllable break junctions
  allow the gap to be tuned; scanning tunnelling microscope break junctions
  repeatedly form and break contacts and build up statistics over thousands of
  traces.
- **Crossed-wire and nanopore junctions** for small ensembles.
- **Self-assembled monolayers** between a substrate and a soft top contact, often
  a liquid-metal or conducting-polymer electrode to avoid the metal filaments
  that evaporating a metal directly onto a monolayer produces.

**What is measured.** Conductance of a molecular junction, expressed relative to
the conductance quantum of module 18. A typical alkane chain conducts at 10^-5 of
a conductance quantum or less; a conjugated molecule of similar length conducts
far more. The dependence on length distinguishes mechanisms: **tunnelling**
through the molecule gives conductance falling exponentially with length, while
**hopping** through molecular sites gives a much weaker, roughly inverse
dependence. Measuring conductance against chain length is therefore the standard
experiment for identifying the transport mechanism, and the crossover from
tunnelling to hopping as molecules lengthen has been observed clearly.

**Demonstrated device functions**, all real observations:

- **Rectification**, using a molecule with an electron-rich end and an
  electron-poor end so that current flows more easily in one direction.
- **Switching**, using molecules that change conformation, oxidation state or
  charge state, giving two conductance levels.
- **Negative differential resistance** in some systems.
- **Single-molecule transistors**, where a nearby gate shifts the molecular level
  relative to the electrodes' Fermi levels, giving Coulomb blockade and Kondo
  physics at low temperature.
- **Quantum interference effects**, where the arrangement of the connection
  points on an aromatic ring changes conductance by orders of magnitude without
  changing the molecular formula. This is a genuinely quantum-mechanical design
  handle with no classical analogue.

**Why none of this has become a technology**, stated plainly:

1. **The contacts dominate.** The measured conductance is usually determined more
   by the metal-molecule interface, its bonding geometry, and its Fermi-level
   alignment (module 24) than by the molecule. Two laboratories measuring the
   same molecule can differ by orders of magnitude because their contacts differ.
2. **Reproducibility.** Individual junctions vary enormously, so results must be
   reported as histograms over thousands of measurements rather than as single
   values. That is good practice and it also means no single junction can be
   relied upon.
3. **No placement technology.** There is no method for putting a specific
   molecule at a specific location with specific contacts, a billion times, with
   the yield an integrated circuit requires. This is the same barrier that stops
   carbon nanotube logic (module 48), and it is a manufacturing barrier rather
   than a physics one.
4. **Stability.** Molecular junctions degrade under bias and with time, and
   metal atoms migrate along and into the molecular layer.
5. **Gain and fan-out.** A logic technology needs a device whose output can drive
   several inputs. Molecular devices generally do not provide gain, and a
   two-terminal rectifier or switch cannot be composed into logic without one.

The honest summary is that molecular electronics has become an excellent
**physics** discipline, teaching about quantum transport, contacts and
interference at the ultimate scale, and it is not on a path to replacing
transistors. Where molecular-scale ideas do appear in real devices, it is in
ensembles rather than single molecules: self-assembled monolayers as dipole
layers to shift Schottky barriers (module 24), molecular switching in resistive
memory, and molecular recognition layers in sensors (module 53).

## DNA as an electronic material

DNA attracted attention for two entirely different reasons and it is important
to keep them apart, because one has succeeded and the other has not.

**As a conductor.** Double-stranded DNA has a stack of aromatic base pairs down
its axis, spaced about 0.34 nm apart, which is structurally similar to the
stacked aromatic systems that conduct in organic crystals. Whether DNA conducts
along that stack has been asked since the 1960s.

The experimental record was, for a long period, contradictory, with reports
spanning insulator, semiconductor, conductor and even proximity-induced
superconductor. The discrepancies traced to sample preparation, contacts,
humidity, the substrate, and the length and sequence of the molecule. The
resolution that has emerged is:

- Short double-stranded DNA, up to a few nanometres, conducts by **coherent
  tunnelling**, with conductance falling exponentially with length.
- Longer DNA conducts by **thermally activated hopping** between guanine sites,
  which are the easiest to oxidize, with a much weaker length dependence.
- Conductance depends strongly on **sequence**, since guanine-rich stretches
  conduct better, and on **hydration**, since dry DNA conducts poorly.
- Absolute conductance is low. DNA is a poor conductor by any electronic
  standard.

Charge transport in DNA does have real biological significance, since oxidative
damage can migrate along a strand to guanine sites, which is relevant to
mutation and repair. As an electronic conductor it is not competitive.

**As a construction material**, which is where DNA has genuinely succeeded.
Base-pairing is programmable: a sequence binds only to its complement, with high
specificity, and the resulting structures self-assemble in solution. **DNA
origami** folds a long scaffold strand with hundreds of short staple strands into
an arbitrary two- or three-dimensional shape with nanometre precision, at yields
that are usable.

That capability is being applied as a **scaffold and placement technology** for
other materials rather than as an electronic material itself:

- Positioning metal nanoparticles, quantum dots or carbon nanotubes at defined
  locations on a DNA template, which addresses exactly the placement problem that
  blocks nanotube and molecular electronics.
- **DNA metallization**, where a strand is used as a template for depositing
  metal, producing a nanowire that conducts through the metal, not the DNA.
- **DNA-directed assembly** of components onto lithographically defined binding
  sites, combining top-down patterning with bottom-up placement.
- **DNA data storage**, which is not electronics at all but is a real and
  advancing technology: information encoded in base sequence, with extraordinary
  volumetric density and multi-century stability, limited by the cost and speed
  of synthesis and sequencing.

The useful distinction: DNA's value in this field is its **information content
and self-assembly**, not its conductivity.

## What molecular electronics has delivered

A fair accounting, since this is a field where the gap between promise and
product has been unusually wide and unusually well publicized.

**Delivered, at scale:**

- **OLED displays**, a genuine multi-billion-unit industry built on organic
  semiconductors, covered in the previous lesson.
- **PEDOT:PSS** and related conductive polymers as ubiquitous functional layers.
- **Organic photoreceptors** in laser printers and photocopiers, which quietly
  preceded everything else and remain in production.
- **Organic photovoltaics** in niche applications, with efficiencies now
  respectable.
- **Chemical and biological sensors** using molecular recognition layers, covered
  in module 53.
- **Self-assembled monolayers** as functional interface layers in inorganic
  devices: dipole layers, adhesion promoters, resist and lubrication layers.

**Not delivered:**

- Single-molecule logic circuits.
- Any general replacement for the transistor.
- DNA-based electronic circuitry.

**What the field taught**, which is the durable contribution:

- The physics of transport through single molecules and quantum point contacts,
  including interference effects that have no classical analogue.
- That **contacts dominate at the nanoscale**, a lesson that generalizes to
  every material in modules 46 through 49 and that should now be the first
  question asked about any nanoscale device measurement.
- Self-assembly as a fabrication principle, which appears in block copolymer
  lithography, in DNA origami and in monolayer functionalization.
- Rigorous statistical reporting of device measurements, since molecular
  junctions forced the community to abandon single-device claims in favour of
  distributions.

The pattern is the same one this course has met with nanotubes, with wide-gap
II-VI compounds and with thin-film silicon: a material or approach that fails at
its headline goal can leave behind methods, understanding and unglamorous working
products that outlast the original ambition. Judging a field only by whether it
achieved what its founders promised misses most of what it actually produced.
