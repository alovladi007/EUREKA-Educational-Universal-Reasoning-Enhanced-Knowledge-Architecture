# Carbon Nanotubes and Fullerene Materials

<!-- covers: 48.1, 48.2 -->

## Carbon nanotubes

A carbon nanotube is a sheet of graphene rolled into a seamless cylinder,
typically one to a few nanometres in diameter and up to millimetres long. That
geometric description contains everything, because the electronic properties
follow from how the sheet is rolled.

**Chirality decides everything.** The way the sheet is wrapped is specified by a
pair of integers (n, m) giving the circumference vector in terms of the graphene
lattice. Rolling the sheet imposes a periodic boundary condition around the
circumference, which quantizes the allowed electron wavevectors in that
direction. Whether the resulting allowed lines pass through graphene's Dirac
points determines the electronic character:

- If **n minus m is divisible by 3**, the tube is **metallic** or very nearly so.
- Otherwise the tube is **semiconducting**, with a bandgap inversely proportional
  to diameter, roughly 0.7 eV for a 1 nm tube.

Statistically, a random synthesis produces about one third metallic and two
thirds semiconducting tubes. That single statistic is the central obstacle to
nanotube electronics, and it has consumed thirty years of effort.

**The properties, which are genuinely exceptional:**

- **Current-carrying capacity** above 10^9 amperes per square centimetre, about a
  thousand times what copper tolerates before electromigration destroys it.
- **Ballistic transport** over micrometres at room temperature in good tubes,
  because there are few scattering states available in a one-dimensional band
  structure.
- **Mobility** measured above 10^5 cm^2/(V s) in individual semiconducting tubes,
  far above silicon.
- **Thermal conductivity** along the axis comparable to diamond.
- **Tensile strength** among the highest measured for any material, with a
  Young's modulus around 1 terapascal.
- **Chemical stability and enormous surface area** for sensing and
  electrochemistry.

**Synthesis** is by arc discharge, laser ablation, or, dominantly for volume
production, **chemical vapour deposition** in which a hydrocarbon decomposes over
metal catalyst nanoparticles. Tube diameter correlates with catalyst particle
size, so catalyst engineering is the main handle. Chirality control from
synthesis has improved substantially, with certain catalyst and template
approaches enriching particular species, and it is still not the clean single-
chirality growth that electronics would need.

**Sorting after growth** has therefore carried most of the practical progress:
density gradient ultracentrifugation, selective polymer wrapping in which a
conjugated polymer preferentially disperses semiconducting tubes, and aqueous
two-phase extraction. Semiconducting purity above 99.9 percent is achievable,
which sounds excellent and is not obviously sufficient: in a circuit with
millions of tubes, one metallic tube in a thousand still shorts many devices.
This gap between impressive purity and required purity is a good illustration of
how integrated-circuit requirements differ from materials requirements.

**Applications, separated honestly into what ships and what does not:**

*Shipping today.* Conductive additives in lithium-ion battery electrodes, which is
by tonnage the largest use. Conductive and antistatic composites. Field emission
sources in some display and x-ray tube products. Electrostatic dissipation in
automotive plastics.

*Demonstrated and progressing.* Carbon nanotube field-effect transistors, where
individual devices outperform silicon at comparable dimensions, and where
complete microprocessors have been built from thousands of tubes. Progress is
real. What blocks production is the combination of chirality purity, placement
and alignment of tubes at defined positions, contact resistance to individual
tubes, and variability, and each of those is a hard manufacturing problem rather
than a physics problem.

*Interconnect*, where the current density capability is attractive, blocked by
contact resistance and by the difficulty of growing dense aligned bundles in
vias.

*Sensors*, where the enormous surface-to-volume ratio makes conductance
extremely sensitive to adsorbed species, with the same selectivity problem as
every other chemiresistive sensor (modules 45 and 53).

*Thermal interface materials and field emitters*, both exploiting the extreme
anisotropy.

**A safety note that belongs in any honest treatment.** Long, thin, biopersistent
fibres raise inhalation toxicity concerns analogous in mechanism to those
established for asbestos, and some long multiwall nanotubes have shown
pathogenic responses in animal studies. Handling of dry nanotube powder requires
containment and respiratory protection, and this is a live regulatory area rather
than a settled one. Material embedded in a cured composite is a different and
much lower exposure situation than loose powder.

## Fullerene solids

A fullerene is a closed cage of carbon atoms, the archetype being C60, a
truncated icosahedron of sixty atoms with the pattern of a football. Larger cages
and endohedral variants with atoms trapped inside also exist.

**As a molecular solid.** C60 molecules pack into a face-centred cubic crystal
held together by van der Waals forces. Because the intermolecular interaction is
weak, the molecules rotate almost freely at room temperature and the electronic
bands derived from the molecular orbitals are narrow. Pure C60 is a
semiconductor with a gap around 1.6 eV and it is a poor conductor.

**Doping and superconductivity.** Intercalating alkali metals into the interstitial
sites of the C60 lattice transfers electrons into the lowest unoccupied molecular
orbital band. At a stoichiometry of three alkali atoms per cage the band is half
filled and the material becomes metallic, and below a critical temperature it
becomes **superconducting**. Critical temperatures reach around 18 K for
potassium-doped and 33 K for caesium-rubidium-doped material, with higher values
reported under pressure. These were, for a period, the highest-temperature
molecular superconductors known, and the pairing appears to be conventional
phonon-mediated coupling to the high-frequency intramolecular vibrations of the
cage. The materials are extremely air-sensitive, which limits them to laboratory
study.

**As an electron acceptor**, which is the application that actually matters. C60
and its soluble derivatives, principally the methyl ester PCBM, are excellent
electron acceptors: they accept an electron readily, they are reasonably good
electron transporters for a molecular solid, and they are soluble enough to be
processed from solution when functionalized.

This made fullerene derivatives the standard acceptor in **organic photovoltaics**
for roughly two decades. The bulk heterojunction architecture blends a
conjugated polymer donor with a fullerene acceptor so that the two phases
interpenetrate on a scale of tens of nanometres, which is comparable to the
exciton diffusion length, so that photogenerated excitons reach an interface
before recombining. Fullerenes also serve as the electron transport layer in
perovskite solar cells and as n-type layers in organic transistors.

Their limitations drove the field past them: fullerenes absorb weakly in the
visible, so they contribute little photocurrent themselves; their energy levels
are hard to tune, which caps the achievable voltage; and they are prone to
diffusing and aggregating over time, which degrades the blend morphology and
therefore the device. Non-fullerene acceptors, designed molecules that absorb
strongly, have tunable levels and form more stable morphologies, displaced them
and raised organic solar cell efficiencies substantially. Module 52 covers the
organic electronics context.

**Other fullerene uses** are modest: additives in lubricants and composites,
and a long-running research interest in endohedral fullerenes, where an atom
trapped inside the cage is shielded from its surroundings, as candidate qubits
and as MRI contrast agents.

## What to take from this module

Carbon nanotubes and fullerenes are a useful pair because they illustrate two
different outcomes for a celebrated material.

The nanotube has properties that beat silicon on nearly every axis and has not
displaced it, because **the manufacturing requirements of integrated circuits are
statistical**: it is not enough that a tube be excellent, every tube in a billion
must be the right kind, in the right place, with the right contacts. Materials
excellence and manufacturability are different achievements, and this course has
made that point before with mercury cadmium telluride and with zinc selenide.

The fullerene had unremarkable properties and found a real role as an
**enabling component in someone else's device**, then lost it to designed
molecules. That is a common and unglamorous trajectory, and being clear-eyed
about it is more useful than either the excitement that surrounded these
materials on discovery or the dismissiveness that sometimes follows.
