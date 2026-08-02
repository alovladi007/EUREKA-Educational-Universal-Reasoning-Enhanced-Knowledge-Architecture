# The Superconducting State and the Cuprate Families

<!-- covers: 51.1, 51.2, 51.3 -->

## The superconducting state

Superconductivity is not simply very good conduction. It is a distinct
thermodynamic phase with two defining properties, and the second is the one that
proves the point.

**Zero resistance.** Below a critical temperature Tc, DC resistance is not small
but exactly zero within any measurement's ability to detect. Persistent currents
in superconducting loops have been observed to decay with time constants of many
years.

**The Meissner effect.** A superconductor expels magnetic flux from its interior
as it is cooled through Tc, actively, rather than merely preventing new flux from
entering. A perfect conductor would trap whatever flux was present when its
resistance vanished; a superconductor pushes it out. This distinguishes
superconductivity as a genuine equilibrium phase rather than a limiting case of
good conduction, and it is what makes magnetic levitation demonstrations work.

**The mechanism, for conventional superconductors.** Electrons repel each other,
but in a lattice an electron attracts the positive ions around it, distorting the
lattice slightly. Because the ions are heavy they respond slowly, so the
distortion persists after the electron has moved on and can attract a second
electron. The result is a weak net attraction between electrons mediated by
lattice vibrations. Below Tc this binds electrons into **Cooper pairs** with
opposite momenta and spins. Pairs are bosons and condense into a single
macroscopic quantum state described by one wavefunction, and exciting any
individual pair out of that state costs a minimum energy, the **energy gap**.
Scattering that would ordinarily cause resistance cannot occur because there is
no available final state within reach, so the current flows without dissipation.
This is BCS theory, and its most direct confirmation is the **isotope effect**:
Tc depends on the ion mass, exactly as a lattice-vibration-mediated mechanism
requires.

**The three critical parameters.** Superconductivity is destroyed by exceeding
any one of them, and all three matter for applications:

- **Critical temperature Tc.**
- **Critical magnetic field Hc**, which for a magnet application is the field the
  wire must carry while conducting.
- **Critical current density Jc**, the current the material can carry before
  going normal.

**Type I and type II.** Type I superconductors, mostly elemental metals, expel
flux completely up to a single critical field and then go normal. Their critical
fields are low, which makes them useless for magnets. **Type II** superconductors
have two critical fields: below the lower one they expel flux completely, and
between the two they admit flux in quantized **vortices**, each carrying one flux
quantum with a normal core, while the material between the vortices remains
superconducting. Type II materials tolerate very high fields, and all practical
superconductors are type II.

**Flux pinning is what makes them useful**, and this is the point most often
missed. In the vortex state, a transport current exerts a Lorentz force on the
vortices. If they move, they dissipate energy and the material has resistance
despite being superconducting. To carry current without loss, the vortices must
be **pinned** in place by defects: normal-metal inclusions, dislocations, grain
boundaries, or deliberately introduced nanoparticles. The critical current
density is therefore set by the **microstructure**, not by the intrinsic
superconducting properties. This is a striking inversion of the usual message of
this course: here defects are the functional feature, and a perfect crystal would
carry almost no useful current.

**Practical conventional superconductors** are niobium-titanium, ductile and
easily drawn into wire, used in MRI magnets and accelerator magnets, and
niobium-tin, with higher Tc and critical field and brittle, so it must be formed
and then reacted in place after winding. Both need liquid helium.

## The cuprate families

In 1986 superconductivity was found in a layered copper oxide at 35 K, above the
30 K that a conventional phonon mechanism was thought to allow. Within two years
Tc had reached 92 K, above the boiling point of liquid nitrogen at 77 K, which
changed the economics completely: nitrogen is cheap and abundant while helium is
expensive and finite.

**Common structural features.** All cuprates contain **copper oxide planes**,
square lattices of copper and oxygen, separated by charge-reservoir layers of
other elements. Superconductivity lives in those planes and the reservoir layers
supply carriers to them. The structures are perovskite-derived and strongly
layered, and that layering makes the properties extremely anisotropic.

**The families**, distinguished by what sits between the planes:

- **Lanthanum-strontium-copper oxide**, the original, Tc around 38 K, one copper
  oxide plane per unit cell, structurally the simplest and therefore the most
  studied theoretically.
- **Yttrium-barium-copper oxide (YBCO)**, Tc about 92 K, two copper oxide planes
  plus copper-oxygen chains that act as the reservoir. This is the material of
  most practical interest, and its oxygen content is a critical variable: the
  chains take up and release oxygen reversibly, and Tc depends sharply on the
  oxygen stoichiometry, which means oxygen annealing is part of every processing
  route.
- **Bismuth-strontium-calcium-copper oxide (BSCCO)**, Tc up to about 110 K,
  extremely micaceous, which allowed it to be made into practical tape by
  packing powder in a silver tube and drawing and rolling it, so that the flakes
  align mechanically.
- **Thallium and mercury cuprates**, reaching about 135 K at ambient pressure and
  higher under pressure, which remains the highest ambient-pressure Tc for this
  family. Both contain highly toxic elements, which limits their practical use.

**The phase diagram** is the essential picture. Plot temperature against carrier
doping and the undoped parent compound is an **antiferromagnetic insulator**,
which is already surprising: simple band theory predicts a metal, and the
material is insulating because of strong electron-electron repulsion, making it a
Mott insulator. Doping holes into the planes destroys the antiferromagnetism and
produces superconductivity over a dome-shaped region, with the maximum Tc at an
optimal doping around 0.16 holes per copper. Underdoped, there is a **pseudogap**
region above Tc in which a partial gap is present without superconductivity;
overdoped, the material becomes a more conventional metal.

**Why the mechanism is still unsettled.** The isotope effect is weak or absent
near optimal doping, so lattice vibrations are not the pairing glue. The pairing
symmetry is **d-wave**, meaning the gap changes sign around the Fermi surface and
vanishes along particular directions, unlike the isotropic s-wave gap of
conventional superconductors, and that symmetry has been measured directly by
phase-sensitive experiments. The leading candidate mechanism involves
antiferromagnetic spin fluctuations, which the phase diagram makes natural since
superconductivity appears right where magnetic order is destroyed. After nearly
four decades there is no consensus theory, and it is more honest to say that than
to present any one account as settled.

## Physical properties of the cuprates

The properties determine the applications, and most of them are inconvenient.

**Extreme anisotropy.** Conduction along the copper oxide planes is orders of
magnitude better than across them. Every practical conductor must therefore have
its planes aligned along the current direction, which turns wire manufacture into
a texture-control problem.

**Weak-link grain boundaries.** This is the decisive practical obstacle. The
superconducting coherence length in cuprates is very short, one to two
nanometres in plane and a fraction of a nanometre across the planes, which is
comparable to the width of a grain boundary. A boundary is therefore a genuine
barrier rather than a minor perturbation, and critical current across a
misaligned boundary falls roughly exponentially with misorientation angle. Beyond
about 5 to 10 degrees of misalignment, the boundary carries almost nothing.

The consequence is severe: a randomly oriented polycrystalline cuprate carries a
tiny fraction of the current that a single crystal does. Making a useful wire
therefore requires **biaxial texture**, meaning the grains must be aligned in all
three directions, not just one, along a flexible metre-scale tape. That
requirement is why cuprate conductors took two decades and enormous investment to
commercialize.

**Brittleness.** They are ceramics. They cannot be drawn like a metal wire and
they crack under bending strain, which constrains coil winding.

**Flux creep.** At 77 K, thermal energy is a much larger fraction of the pinning
energy than at 4 K, so vortices hop between pinning sites more readily and
dissipation appears at currents well below the nominal critical current. Higher
operating temperature is therefore not purely an advantage: it makes flux pinning
harder, and it is why some high-field applications run cuprate conductors at 20
to 30 K rather than at 77, accepting cryogenics in exchange for performance.

**Sensitivity to stoichiometry and to moisture.** Oxygen content controls Tc and
can change during processing and service, and several cuprates degrade on
exposure to water.

The next lesson covers how these obstacles were engineered around, the other
superconductor families, and what the technology is actually used for.
