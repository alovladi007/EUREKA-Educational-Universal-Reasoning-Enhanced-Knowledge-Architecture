# Thermoelectric Materials

<!-- covers: 55.1, 55.2, 55.3, 55.4 -->

## Thermoelectric effects and the figure of merit

Thermoelectric devices convert heat directly into electricity and electricity
directly into cooling, with no moving parts and no working fluid. The physics is
three related effects.

**The Seebeck effect.** Apply a temperature difference across a conductor and a
voltage appears. The mechanism is straightforward: carriers at the hot end have
more thermal energy and diffuse toward the cold end faster than the reverse,
accumulating there until the resulting electric field balances the diffusion. The
**Seebeck coefficient** S is the voltage per unit temperature difference, in
microvolts per kelvin, and its sign follows the carrier sign, so it is negative
for n-type and positive for p-type material. Metals have small coefficients, a
few microvolts per kelvin, because their carrier population is degenerate and
nearly symmetric about the Fermi level. Semiconductors reach hundreds of
microvolts per kelvin.

**The Peltier effect.** Pass a current across a junction between two different
conductors and heat is absorbed or released there, because carriers carry
different amounts of energy in the two materials and the difference must come
from or go to the lattice. This is the effect a thermoelectric cooler uses, and
it is genuinely solid-state refrigeration.

**The Thomson effect**, heat absorbed or released when a current flows along a
conductor with a temperature gradient, which completes the thermodynamic
description and matters less practically.

**The figure of merit.** Device efficiency is governed by a dimensionless
quantity:

    ZT = S^2 * sigma * T / kappa

where sigma is electrical conductivity and kappa is thermal conductivity. The
numerator S^2 sigma is called the **power factor**. The physical meaning is
clear: you want a large voltage per degree, you want current to flow easily so
the internal resistance does not eat the output, and you want the material to
resist heat flow so the temperature difference is maintained rather than
short-circuited thermally.

**Why this is hard**, and it is the central difficulty of the whole field: the
three quantities are not independent, and they pull against each other.

- **S falls as carrier concentration rises**, because a more degenerate carrier
  distribution is more symmetric about the Fermi level.
- **sigma rises with carrier concentration.** So S^2 sigma has a maximum at an
  intermediate carrier concentration, typically around 10^19 to 10^20 per cubic
  centimetre, which is heavily doped semiconductor territory. Metals fail because
  S is too small; insulators fail because sigma is too small. Thermoelectrics are
  necessarily heavily doped semiconductors.
- **kappa has two parts**: a lattice (phonon) contribution and an electronic
  contribution. The electronic part is tied to sigma by the Wiedemann-Franz law
  (module 35), so improving electrical conductivity automatically worsens thermal
  conductivity. The **only** part of the equation that can be attacked
  independently is the **lattice** thermal conductivity.

That last point is the strategic insight of the field, and it is worth stating as
a slogan that has organized fifty years of research: a good thermoelectric is a
**phonon glass and an electron crystal**. It should scatter phonons as though it
were amorphous while conducting electrons as though it were a perfect crystal.

**Where ZT stands.** Commercial materials reach ZT around 1, corresponding to
roughly 5 to 8 percent conversion efficiency across a useful temperature
difference. Laboratory materials reach 1.5 to 2.5 in specific temperature
windows. ZT of 3 or above would make thermoelectrics competitive with
conventional heat engines and refrigeration for many applications, and it has not
been reached reproducibly.

## Semiconductors as thermoelectrics

The material families, organized by their temperature range, because a
thermoelectric is only good over a limited window and a real device stacks
segments.

**Bismuth telluride and its alloys**, near room temperature to about 200 degrees
C. This has been the commercial material since the 1950s and it is what every
Peltier cooler and every portable thermoelectric refrigerator contains. Bismuth
telluride alloyed with antimony telluride for p-type and with bismuth selenide
for n-type, in each case using **alloy scattering** to suppress lattice thermal
conductivity (module 35) while keeping the electronic structure favourable. Its
layered structure gives anisotropy, which is exploited by orienting the material.

**Lead telluride and related tellurides**, 200 to 600 degrees C, used for
mid-temperature waste heat recovery. Recent work on these has produced some of
the highest reported ZT values, through the band-structure and nanostructuring
strategies below.

**Silicon-germanium alloys**, above 600 degrees C. Their virtue is exactly the
property that is a problem elsewhere in this course: alloying silicon with
germanium collapses the lattice thermal conductivity by mass-disorder phonon
scattering (module 38), while the electronic properties remain workable. SiGe
thermoelectric couples power the radioisotope generators on deep space probes,
which have operated continuously for decades with no maintenance. That
application is the field's clearest success and it demonstrates the technology's
real advantage: absolute reliability with no moving parts.

**Skutterudites and clathrates**, cage-like structures with large voids. A heavy
guest atom placed loosely in the cage "rattles", scattering phonons strongly
while barely affecting the electron transport through the framework. This is the
phonon-glass electron-crystal idea implemented structurally, and it is one of the
more elegant materials designs in this course.

**Half-Heusler alloys**, mechanically robust and thermally stable, of interest
for automotive exhaust heat recovery where mechanical durability matters as much
as ZT.

**Oxide thermoelectrics**, with modest ZT and excellent high-temperature
stability in air, which the tellurides lack.

**Organic and hybrid thermoelectrics**, principally PEDOT-based, with low ZT and
low thermal conductivity, flexibility and low processing cost. Their target is
body-heat harvesting for wearables rather than power generation.

A materials-supply point worth noting: tellurium is scarce, and bismuth
telluride's dominance is a genuine constraint on any large-scale deployment.
Several research programmes are motivated as much by tellurium avoidance as by
performance.

## Nanostructuring and new design concepts

The modern strategies all attack one of the coupled quantities without paying the
usual penalty in the others.

**Nanostructuring to scatter phonons selectively.** This is the most productive
idea. Phonons that carry most of the heat have mean free paths of tens to
hundreds of nanometres, while the electrons that carry the current have mean free
paths of a few nanometres. Introducing interfaces spaced tens of nanometres apart
therefore scatters phonons strongly and electrons hardly at all. Implementations
include nanocomposites made by ball-milling and hot-pressing, superlattices,
nanoinclusions precipitated within a matrix, and deliberately fine grain
structures. **Hierarchical architectures** go further, combining atomic-scale
point defects to scatter short-wavelength phonons, nanoscale precipitates for
mid-wavelength phonons, and mesoscale grain boundaries for long-wavelength
phonons, so that the whole phonon spectrum is attacked.

**Band structure engineering** to raise the power factor:

- **Band convergence**, aligning several electronic bands at the same energy so
  that more carriers contribute without raising the Fermi level, which raises S
  and sigma together. This is done by alloying to tune band positions.
- **Resonant levels**, where a dopant introduces a sharp feature in the density
  of states near the Fermi level, increasing the energy asymmetry of the carrier
  distribution and therefore S.
- **Energy filtering**, using barriers to preferentially block low-energy
  carriers, which contribute to conduction but reduce the average energy per
  carrier and therefore reduce S.

**Materials with intrinsically low lattice thermal conductivity.** Rather than
engineering scattering into a good conductor, start with a material whose lattice
conducts poorly by nature: heavy elements, weak bonding, complex unit cells, and
strong anharmonicity. Tin selenide is the striking example, with a very low
lattice thermal conductivity arising from its highly anharmonic bonding, and
correspondingly high reported ZT along particular crystal directions. Anisotropy
is severe enough that single-crystal and polycrystalline results differ greatly,
which is a reason to read reported values with attention to the sample form.

**A caution on reported values.** ZT is a compound quantity assembled from three
separately measured properties, often on different samples or in different
directions, each with its own uncertainty. Errors compound, and the field has a
history of high reported values that did not reproduce. The standards that have
emerged are to measure all properties on the same sample in the same direction,
to report the measurement uncertainty, and, most convincingly, to build a device
and measure its actual efficiency, since a device efficiency cannot be inflated
by measurement error in the same way.

## Where thermoelectrics are actually used

Honest applications, separated from aspirations.

**In production and paying for themselves:**

- **Radioisotope thermoelectric generators** for deep space, where nothing else
  works and reliability is absolute.
- **Peltier coolers** for laser diodes and detectors, where precise, compact,
  vibration-free temperature control matters more than efficiency, and for
  scientific instruments, small refrigerators and seat cooling.
- **Thermocouples**, which are the Seebeck effect used as a sensor rather than a
  generator and are by unit count the largest application of thermoelectricity
  in existence. Every industrial temperature measurement is one.
- **Remote power** from a flame or a heat source where reliability outweighs
  efficiency.

**Persistently proposed, persistently marginal:**

- **Automotive waste heat recovery.** An engine wastes most of its fuel energy as
  heat, and recovering a few percent of it would be worth having. Repeated
  demonstrations have not converted, because the added mass, cost and back
  pressure roughly cancel the fuel saving, and because electrification has
  changed the target.
- **Industrial waste heat recovery**, where the economics depend sharply on the
  temperature and the duty cycle, and where a conventional heat engine usually
  wins if the heat source is large and steady.
- **Body-heat harvesting for wearables**, where the available temperature
  difference across a thin device on skin is a couple of degrees, so the power is
  microwatts. That is enough for some sensors and not for much else.

**The honest summary.** Thermoelectrics occupy a defensible niche defined by
**reliability, silence, scalability to small size and absence of moving parts**,
not by efficiency. At ZT around 1 they convert a few percent, which loses to any
mechanical heat engine that can be made to fit. Reaching ZT of 3 would change
that calculus, the strategies above are the credible routes toward it, and
progress has been real but slower than repeatedly forecast. Describing the field
accurately means holding both halves of that at once.
