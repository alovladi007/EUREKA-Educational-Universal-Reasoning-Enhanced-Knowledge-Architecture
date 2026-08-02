# Magnetism, from Domains and Hysteresis to Spintronics

<!-- covers: 20.1, 20.2, 20.3 -->

## Classical magnetism: order, domains and hysteresis

Magnetism in solids comes from electron spin and orbital angular momentum. The
useful classification is by how neighbouring moments interact.

**Diamagnetic** materials have no permanent moments; an applied field induces
a weak opposing one. Every material is diamagnetic to some degree; it only
matters when nothing stronger is present.

**Paramagnetic** materials have permanent moments that do not interact, so
thermal agitation randomizes them and an applied field aligns them only
partially. Susceptibility falls as 1/T, the Curie law.

**Ferromagnetic** materials have moments that align with their neighbours
through the **exchange interaction**. Exchange is not the magnetic dipole force
between moments, which is far too weak to explain magnetic order at room
temperature; it is an electrostatic effect arising from the Pauli exclusion
principle, which makes parallel-spin configurations lower in energy in certain
electronic structures. Exchange energies are of order 0.1 eV, comparable to
chemical bonding, which is why iron stays magnetic up to 770 degrees C. Above
the **Curie temperature** thermal energy destroys the order and the material
becomes paramagnetic.

**Antiferromagnetic** materials have neighbouring moments that align
antiparallel, so there is order but no net moment. **Ferrimagnetic** materials
have antiparallel sublattices of unequal size, giving a net moment; the
ferrites used as inductor and transformer cores are of this type, and their
practical virtue is being magnetic and electrically insulating at once, so
eddy current losses are negligible at high frequency.

**Domains** explain why a piece of iron can be ferromagnetic and yet show no
external field. Uniform magnetization stores a large amount of energy in the
field outside the sample. The material lowers that energy by breaking into
regions, each magnetized to saturation but in different directions, so the
external fields largely cancel. Between domains sit **domain walls**, of
finite width, where the magnetization rotates gradually because exchange
resists abrupt change while anisotropy resists pointing away from easy
directions.

Magnetizing a sample means growing the favourably oriented domains at the
expense of the others, then rotating the remainder into the field. Both steps
are impeded by defects, grain boundaries and inclusions, which pin domain
walls. Because unpinning is irreversible, the return path differs from the
outward path, and the result is the **hysteresis loop**. Its parameters are
the vocabulary of magnetic materials:

- **Saturation magnetization**, the moment when everything is aligned, an
  intrinsic property of composition.
- **Remanence**, what is left after the field is removed. This is the signal
  in magnetic storage.
- **Coercivity**, the reverse field needed to bring magnetization back to
  zero. This is the extrinsic, microstructure-controlled parameter, and it
  divides the whole field in two.

**Soft** magnetic materials have low coercivity and narrow loops. They
magnetize and demagnetize easily and dissipate little per cycle, since the
loop area is the energy lost per cycle. They are what you want in transformers,
motors, inductors and shields, and they are made soft by removing the pinning
sites: large clean grains, low stress, or no grains at all in an amorphous
metallic glass.

**Hard** magnetic materials have high coercivity and wide loops. They resist
demagnetization, which is what a permanent magnet needs. They are made hard by
strong crystalline anisotropy plus a microstructure of fine, decoupled
particles, so reversing one does not cascade into the next. Their figure of
merit is the maximum energy product, and the modern rare-earth families reach
values two orders of magnitude above the steel magnets of a century ago.

The same distinction determines the loss budget in power electronics: core
loss is hysteresis loss (loop area times frequency) plus eddy current loss
(which is why cores are laminated or made of insulating ferrite) plus anomalous
loss from domain wall dynamics.

## Nanoscale and unconventional magnetism

Shrink a magnetic particle and the classical picture changes in specific ways.

Below a critical size, typically tens of nanometres, forming a domain wall
costs more energy than it saves, so the particle is **single domain**. It
magnetizes only by coherent rotation, which requires overcoming the full
anisotropy, so coercivity is at a maximum there. This is why fine-particle
media are the basis of both permanent magnets and recording media.

Shrink further and thermal energy becomes comparable to the anisotropy energy
barrier that holds the moment in place. The moment then flips spontaneously
and the particle behaves like a paramagnet with a very large moment:
**superparamagnetism**. The stored bit is lost. This is a hard physical limit
on magnetic storage density, and module 50 covers the engineering response to
it, which is to use higher-anisotropy materials, at the cost of needing a
larger field to write them.

Thin films and multilayers add effects with no bulk analogue:

- **Interface anisotropy** can make the easy axis perpendicular to the film,
  which is what perpendicular magnetic recording exploits.
- **Interlayer exchange coupling** through a non-magnetic spacer oscillates
  in sign with spacer thickness, so two ferromagnetic layers can be made to
  align parallel or antiparallel by choosing a thickness to within an atomic
  layer.
- **Exchange bias** at a ferromagnet-antiferromagnet interface pins the
  ferromagnet's magnetization in one direction, shifting its loop off centre.
  This is how a reference layer is fixed in a spin valve.
- **Vortex states** form in small discs, where the magnetization curls in the
  plane and turns out of plane only at a nanometre-scale core, giving a stable
  configuration with almost no stray field.

## Spintronic devices and spin-based information

Conventional electronics uses only the charge of the electron. **Spintronics**
uses its spin as well, and the enabling discovery was that resistance can
depend on relative magnetic orientation.

**Giant magnetoresistance.** In a stack of two ferromagnetic layers separated
by a thin non-magnetic metal, the resistance is noticeably lower when the two
magnetizations are parallel than when they are antiparallel. The reason is
that scattering rates in a ferromagnet differ for spin-up and spin-down
electrons. When the layers are parallel, one spin channel passes easily
through both; when antiparallel, each channel is strongly scattered in one
layer or the other. In a practical **spin valve**, one layer is pinned by
exchange bias and the other rotates freely with the external field, so the
device becomes a sensitive field sensor. GMR read heads increased hard disk
density by orders of magnitude and reached mass production within about a
decade of the effect's discovery, which is unusually fast for a materials
effect.

**Tunnel magnetoresistance.** Replace the metal spacer with a thin insulating
barrier and electrons tunnel rather than diffuse. The tunnelling probability
depends on the density of available states of matching spin on the far side,
so the resistance ratio between parallel and antiparallel states becomes much
larger. With crystalline magnesium oxide barriers, which filter tunnelling
electrons by symmetry as well as by spin, ratios of several hundred percent
are routine. The magnetic tunnel junction is the storage element of magnetic
random access memory (module 50).

**Spin transfer torque.** A spin-polarized current passing into a magnetic
layer transfers angular momentum to it and can switch its magnetization
directly, with no external field. This turned MRAM from a device needing
current-carrying write lines into one that writes through the bit itself,
which is what made it scalable. Related spin-orbit torque schemes use a heavy
metal adjacent layer to generate the spin current more efficiently.

The resulting memory is genuinely non-volatile, writes in nanoseconds,
tolerates effectively unlimited write cycles, and resists radiation. Its
drawbacks are cell area and write energy relative to static RAM, so it has
found its place as embedded non-volatile memory replacing flash in
microcontrollers, and as a candidate for last-level cache, rather than as a
universal memory.

Two further directions are worth knowing by name. **Semiconductor spintronics**
aims to inject, manipulate and detect spin in semiconductors, which would allow
logic and memory in one material system; the obstacle is that spin injection
from a metal into a semiconductor is inefficient because of the conductivity
mismatch, and spin coherence times are short at room temperature. **Quantum
information** uses spin as a qubit, in quantum dots, in nitrogen-vacancy
centres in diamond, and in donor atoms in isotopically purified silicon. The
attraction of the silicon route is that the same isotope purification that
removes nuclear spins also removes the main source of decoherence, and the
fabrication base already exists.

Spintronics is the clearest case in this course of a materials effect becoming
a product: the physics is interface physics, the performance is set by
atomic-scale layer control, and the manufacturing question is whether you can
deposit those layers reproducibly across a wafer. Module 44 covers that
deposition problem.
