# Inorganic Perovskite Oxides: Structure, Properties and Photocatalysis

<!-- covers: 57.1, 57.2 -->

## Properties of the perovskite structure

The perovskite oxides are the most versatile single structural family in solid
state electronics. One crystal structure, with a huge range of chemical
substitutions, produces insulators, ferroelectrics, ferromagnets,
superconductors, ionic conductors and catalysts. Understanding why is worth more
than memorizing the list.

**The structure.** The formula is ABO3. The large A cation sits at the corners of
a cube, the smaller B cation at the body centre, and oxygen at the face centres,
so the B cation sits inside a corner-sharing octahedron of six oxygens and the A
cation occupies the large cavity between eight such octahedra.

**Why it accommodates so much chemistry.** The structure is remarkably tolerant
of substitution. The tolerance factor, essentially a ratio of ionic radii,
predicts whether a given A and B pair will form the structure, and a wide range
of combinations does. Two cations means two independent chemical handles, and
each site can be partially substituted, which allows continuous tuning of
properties. Adding to that, the oxygen sublattice tolerates vacancies in large
concentrations, giving a third handle.

**Why small distortions produce large property changes.** The ideal cubic
structure is often unstable, and the crystal relieves the misfit by tilting and
rotating the oxygen octahedra, or by displacing the B cation off centre. Those
distortions are tiny, picometres, and their electronic consequences are enormous
because the electronic properties depend on the B-O-B bond angle, which controls
orbital overlap and therefore bandwidth, magnetic exchange and conduction. A
structure that can distort in many nearly-degenerate ways, each with different
electronic character, is a structure whose properties can be pushed around by
composition, strain and temperature. That is the whole reason this family is so
rich.

**The property list**, each with its representative compound:

- **Ferroelectricity.** Barium titanate and lead zirconate titanate (module 42),
  where the B cation displacement produces the spontaneous polarization.
- **Piezoelectricity**, from the same non-centrosymmetric distortion.
- **High permittivity**, especially near the ferroelectric transition, which is
  the basis of ceramic capacitors.
- **Superconductivity.** The cuprates (module 51) are perovskite-derived, with
  their copper oxide planes being layers of the corner-sharing octahedral
  network.
- **Colossal magnetoresistance** in manganites, where the resistance falls by
  orders of magnitude in a magnetic field because the field aligns spins and so
  permits the double-exchange hopping that carries the current. The link between
  magnetism and conduction here is direct: the electron can only hop if the spins
  on the two sites are aligned.
- **Ionic conduction**, in lanthanum gallate and related compositions, from
  oxygen vacancies introduced by aliovalent doping (module 27).
- **Mixed ionic-electronic conduction**, in the cobaltites and ferrites used as
  fuel cell electrodes.
- **Metal-insulator transitions**, in vanadates and nickelates, where a small
  temperature or strain change switches the material between conducting and
  insulating states.
- **Catalysis**, discussed below.
- **Two-dimensional electron gases at oxide interfaces**, notably at the
  interface between two band insulators, lanthanum aluminate and strontium
  titanate, where a conducting sheet appears that neither material has alone.
  This is one of the more surprising results in oxide electronics and it opened
  the field of oxide interface engineering.

**Strain as a design variable.** Because the properties depend so sensitively on
bond angles, growing a perovskite film epitaxially on a substrate with a slightly
different lattice constant strains it and shifts its properties substantially.
Ferroelectric transition temperatures have been shifted by hundreds of degrees
this way, and materials that are not ferroelectric in bulk have been made
ferroelectric by strain. This gives module 30's epitaxy a role here that it does
not have in most of the materials in this course: the substrate is a functional
parameter, not just a support.

## Photocatalytic activity

A photocatalyst absorbs light, generates electron-hole pairs, and uses them to
drive chemical reactions at its surface. The applications are water splitting to
produce hydrogen, degradation of organic pollutants in water and air, and carbon
dioxide reduction.

**The requirements**, which are demanding and mostly in conflict:

1. **The bandgap must straddle the redox potentials of the reaction.** For water
   splitting, the conduction band edge must sit above the hydrogen evolution
   potential and the valence band edge below the oxygen evolution potential.
   Thermodynamically this needs at least 1.23 eV, and with the kinetic
   overpotentials that real surfaces require it needs roughly 1.8 to 2.0 eV in
   practice.
2. **The gap must be small enough to absorb sunlight.** Most of the solar
   spectrum is below 3 eV, so a wide-gap material absorbs only the small
   ultraviolet fraction and wastes the rest.

Those two requirements pull against each other, and reconciling them is the
central problem of the field. Titanium dioxide, the reference photocatalyst, has
a 3.2 eV gap that straddles the water potentials comfortably and absorbs only
about 4 percent of sunlight.

3. **Photogenerated carriers must reach the surface before recombining**, which
   requires adequate carrier lifetime and short diffusion distances, hence
   nanostructuring.
4. **The surface must catalyse the reaction**, which usually requires a
   co-catalyst, platinum for hydrogen evolution or a cobalt or nickel oxide for
   oxygen evolution, since the semiconductor's bare surface is kinetically slow.
5. **The material must be stable** under illumination in water, which eliminates
   many otherwise suitable semiconductors that photo-corrode.

**Why perovskites are studied here.** Strontium titanate is the classic
perovskite photocatalyst and it has the same problem as titanium dioxide: a wide
gap. The structural family's advantage is the tunability described above. Both
cation sites can be substituted to shift the band edges independently, since the
conduction band is derived largely from the B cation d orbitals and the valence
band from oxygen 2p orbitals with A-site influence. That gives more control over
band positions than a binary oxide allows.

The specific strategies:

- **Cation substitution** to narrow the gap while keeping the band edges
  straddling the redox potentials. This is a two-constraint optimization and the
  reason it is hard: narrowing the gap usually moves one edge past its target.
- **Anion doping**, replacing some oxygen with nitrogen or sulphur, which raises
  the valence band edge because nitrogen 2p sits above oxygen 2p, narrowing the
  gap from the top. **Oxynitride and oxysulphide perovskites** reach gaps around
  2 eV with band edges still suitably placed, and they are among the more
  promising visible-light photocatalysts. Their weakness is stability: the
  nitride is more easily oxidized than the oxide, so the catalyst can degrade by
  oxidizing itself instead of the target.
- **Z-scheme systems**, in which two different photocatalysts each drive one half
  reaction and are connected by a redox shuttle. This relaxes the requirement
  that a single material straddle both potentials, so each material can have a
  narrower gap. It mirrors natural photosynthesis, which uses two photosystems
  for the same reason.
- **Co-catalyst loading and surface engineering**, including depositing the
  reduction and oxidation co-catalysts on different crystal facets so that the
  electrons and holes are spatially separated and cannot recombine.

**The honest status of solar water splitting.** Solar-to-hydrogen efficiencies
for particulate photocatalyst systems remain low, of order a percent, against the
roughly 10 percent generally regarded as the threshold for economic interest.
Higher efficiencies have been achieved with photoelectrochemical cells using
III-V semiconductors, which are far too expensive to deploy, and with the
straightforward combination of a photovoltaic panel and a conventional
electrolyser, which works today and is the benchmark any integrated approach must
beat. The scientific case for particulate photocatalysis is that it could be very
cheap if it worked, because it requires no wiring, no electrodes and no
electrolyser; the engineering case remains unproven.

**Where photocatalysis does work commercially**, which is worth separating from
the hydrogen story: **self-cleaning and air-purifying surfaces**. Titanium
dioxide coatings on glass, tiles and building materials oxidize organic
contaminants under ambient ultraviolet and become superhydrophilic when
illuminated, so water sheets off rather than beading and carries dirt with it.
This is a real product category, and the requirement is modest activity over
years rather than high efficiency, which the material meets.
