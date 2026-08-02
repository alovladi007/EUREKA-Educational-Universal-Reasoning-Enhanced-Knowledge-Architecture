# Defects in Monocrystalline Silicon

<!-- covers: 21.1, 21.2, 21.3, 21.4 -->

A silicon wafer is the most nearly perfect large object humanity manufactures,
and it is still full of defects. This module is about the ones that are
intrinsic, meaning they involve only silicon atoms and empty sites, because
those cannot be removed by purification. They can only be managed by
controlling how the crystal cools.

## Why point-defect aggregates decide yield

At the temperature where silicon crystallizes, about 1414 degrees C,
thermodynamics requires a substantial equilibrium concentration of two point
defects: **vacancies**, which are missing atoms, and **self-interstitials**,
which are extra silicon atoms squeezed between lattice sites. Their
equilibrium concentration falls steeply as the crystal cools.

The problem is that the crystal cools faster than the defects can escape to
the surface. The result is **supersaturation**: far more point defects than
equilibrium allows at the lower temperature, with nowhere to go. Like any
supersaturated system, it relieves itself by nucleating a second phase, and
here the second phase is a cluster of the excess defect. Vacancies aggregate
into **voids**, small empty octahedral cavities typically 100 to 200 nm
across. Interstitials aggregate into **dislocation loops**, extra planes of
atoms bounded by a dislocation line.

Why this matters commercially is worth stating plainly, because it is the
reason an entire branch of crystal growth science exists.

A void intersecting the surface where a gate dielectric will be grown produces
a thin spot in that dielectric. The device built there fails, either
immediately as a gate oxide short or later as an early wear-out. These defects
were historically called **crystal-originated particles**, because when
detected by surface scanning they look like particles, though they are
cavities in the crystal itself. As gate dielectrics thinned from tens of
nanometres to about a nanometre, the tolerance for such thin spots vanished.

Interstitial-type dislocation loops are, if anything, worse in a different way.
A dislocation is a fast diffusion path and a strong sink for metallic
impurities. A loop that intersects a junction creates a local leakage path,
which shows up as a retention failure in a memory cell or as elevated dark
current in an imager. In a large memory array, a handful of such defects per
wafer costs real yield.

So the specification for a modern wafer is not only chemical purity. It is
also a statement about which intrinsic defect dominates, at what size, and at
what density.

## Thermophysical behaviour of vacancies and interstitials

The behaviour of the growing crystal is governed by a competition between two
transport processes, and the outcome is decided by a single ratio.

Point defects are created at the growth interface at their equilibrium
concentrations. Two things then happen as the crystal is pulled away from the
melt:

- the crystal moves away at the **pull rate** v, carrying defects with it, and
- defects diffuse back down the **temperature gradient** G near the interface,
  because their equilibrium concentration is higher where it is hotter.

Vacancies and interstitials also recombine with each other, since a vacancy
and an interstitial annihilate on meeting. Whichever species is in excess
survives.

Because vacancies and interstitials have different formation energies and
different diffusivities, the balance tips one way or the other depending on
v/G. The rule that emerged from this analysis is remarkably clean:

- **v/G above a critical value:** the crystal is **vacancy-rich**. Vacancies
  are swept along faster than they can diffuse back, they supersaturate, and
  voids form.
- **v/G below the critical value:** the crystal is **interstitial-rich**.
  Interstitials dominate, and dislocation loops form.
- **v/G near the critical value:** the two species largely annihilate each
  other, and the crystal comes out nearly free of both. This is the
  **perfect** or defect-free growth window.

This is the single most useful idea in the module. It says that intrinsic
defects are controlled not by purity, not by the melt, but by the *thermal
history*: pull rate and the temperature gradient set by the hot zone design.
Hitting the window requires holding v/G within a few percent across the whole
radius of a 300 mm crystal, over a growth run lasting many hours, which is why
hot zone design and thermal modelling became central to silicon growth (module
29).

Oxygen complicates it usefully. Czochralski silicon dissolves oxygen from the
quartz crucible, typically to a few times 10^17 per cubic centimetre. Oxygen
is supersaturated at operating temperatures and precipitates as silicon
dioxide particles. Those precipitates are damaging near the surface where the
devices are, and *valuable* deeper in the wafer, because they getter metallic
impurities away from the active region. This is **internal gettering**, and the
standard product is a wafer with a **denuded zone**: a defect-free surface
layer tens of micrometres deep for the devices, over a bulk deliberately
populated with oxygen precipitates to trap contamination. Achieving that
profile is a matter of engineering the anneal sequence, and it is a good
example of a defect being made useful by putting it where it helps.

## Voids, dislocation loops and other aggregates

The aggregate population of a wafer is a taxonomy worth knowing, because each
member is detected differently and each fails differently.

**Voids** are octahedral cavities bounded by low-energy crystal planes,
typically 100 to 200 nm, at densities of 10^5 to 10^6 per cubic centimetre in
conventionally grown vacancy-rich material. Their inner surfaces oxidize. They
are detected by laser surface scanning after a preferential etch, by infrared
scattering tomography in the bulk, and functionally by gate oxide integrity
testing, which remains the definitive test because it measures the thing that
actually matters.

**Interstitial dislocation loops**, historically called A-defects or
large etch pits, are extra atomic planes bounded by dislocation. They are
larger and much less numerous than voids, and they are decorated by metals,
which is what makes them leakage sources.

**Oxygen precipitates** and the punched-out dislocations and stacking faults
that surround them, which relieve the volume mismatch between silicon dioxide
and the silicon it displaces. Managed correctly, these are the gettering sites
described above. Managed badly, they reach the surface and cause leakage.

**Grown-in stacking faults**, which are usually nucleated on oxygen
precipitates and appear when the material is oxidized.

Detecting these is a good illustration of a general point from module 33: no
single technique sees everything. Preferential etching plus optical microscopy
is cheap, sensitive and destructive. Infrared tomography sees bulk scattering
centres non-destructively but has a size threshold. Transmission electron
microscopy identifies structure definitively on a tiny sampled volume.
Gate-oxide integrity testing measures the electrical consequence directly but
only for defects at the surface. A defect specification usually cites two or
three of these because each covers the others' blind spots.

## The oxidation-induced stacking fault ring

The most visible signature of the v/G physics is a narrow ring.

Because the temperature gradient G varies across the radius of a growing
crystal, being higher near the edge where heat escapes, the ratio v/G varies
across the radius too. A crystal grown near the critical value therefore
crosses the vacancy-to-interstitial transition somewhere between centre and
edge. At that radius the vacancy and interstitial concentrations are both low
but oxygen precipitation behaviour changes sharply, and after an oxidation
step a dense band of stacking faults appears there. Etched and inspected, it
shows as a distinct ring.

The **OSF ring** is worth understanding for three reasons.

First, it is a **diagnostic**. Its radial position maps the v/G contour
directly. Ring near the edge means the crystal is mostly vacancy-rich; ring
near the centre means mostly interstitial-rich; no ring means the crystal
either never crossed the boundary or crossed it outside the wafer. Growers use
ring position to tune the process, so a defect becomes an instrument.

Second, it is a **killer defect in its own right**. Stacking faults in the
active region cause leakage, so a wafer with a ring crossing its device area
is compromised even though the rest of it is fine. This produces the
characteristic failure signature of a ring-shaped yield loss on a wafer map,
which is diagnostic enough that seeing it points immediately at crystal growth
rather than at wafer processing.

Third, eliminating it defined a generation of process development. Growing
across the whole radius inside the perfect window, so that neither voids nor
loops nor a ring appear anywhere on the wafer, requires precise control of the
hot zone thermal field and of the pull rate profile, and doing it at
economically useful pull rates is what "perfect silicon" or "defect-engineered
silicon" products mean.

The broader lesson generalizes past silicon. Intrinsic point defects are
thermodynamically required, not a sign of sloppy work. What you control is
where they end up: harmlessly annihilated, usefully placed deep in the bulk as
gettering sites, or fatally placed under a gate. Module 22 takes up the
companion question of how atoms move through the crystal once they are in it.
