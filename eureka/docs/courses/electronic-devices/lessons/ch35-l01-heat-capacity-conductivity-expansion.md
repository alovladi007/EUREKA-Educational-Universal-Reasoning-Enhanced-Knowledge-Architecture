# Thermal Properties: Heat Capacity, Conductivity and Expansion

<!-- covers: 35.1, 35.2, 35.3 -->

Thermal properties decide more electronic design than their coverage in most
courses suggests. Every device dissipates power, every package has to move that
heat out, and every joint between two materials of different expansion
coefficient is a fatigue crack waiting for enough thermal cycles.

## Heat capacity

Heat capacity is the energy required to raise a material's temperature by one
degree. The useful distinction is between the extensive quantity and the
specific heat per unit mass or per mole, and for solids the difference between
constant pressure and constant volume is small enough to ignore in most
engineering work.

The physics is about where the energy goes. In a solid it goes mainly into
**lattice vibrations**, and the temperature dependence reflects how many
vibrational modes are thermally accessible.

At high temperature, every vibrational mode carries its full classical share of
energy, and the molar heat capacity approaches about 25 J/(mol K) for a simple
solid regardless of what the solid is. This is the **Dulong-Petit** value, and
its material-independence is a good sanity check: a reported specific heat that
implies a molar value far from 25 at room temperature deserves scrutiny.

At low temperature, modes with energy above kT freeze out and heat capacity
falls. The **Debye model** captures this by treating the solid as a continuum of
vibrational modes up to a cut-off, and it predicts that lattice heat capacity
falls as T^3 at low temperature, which is observed. The **Debye temperature**
is the characteristic scale: above it the material is classical, below it
quantum effects dominate. Stiff, light materials such as diamond have high Debye
temperatures, above 2000 K, which is why diamond's heat capacity is still rising
at room temperature.

In metals there is an additional electronic contribution, linear in temperature,
which is negligible at room temperature and dominates below a few kelvin.
Plotting C/T against T^2 at low temperature separates the two contributions as
intercept and slope, and it is the standard way to measure the electronic
density of states at the Fermi level.

Where it matters practically:

- **Thermal mass in transient events.** How hot a device gets during a
  microsecond current pulse is set by the heat capacity of the material within
  the thermal diffusion length, not by the steady-state thermal resistance. This
  governs electrostatic discharge survival and short-circuit ratings in power
  devices.
- **Phase change memory** (module 47) writes by melting and quenching a small
  volume, and the energy per bit is set by heat capacity plus latent heat.
- **Calorimetry** as an analytical tool, covered in the next lesson.

## Thermal conductivity

Thermal conductivity is the more consequential property, and it is where the
material differences are enormous: from about 0.02 W/(m K) for still air, to
0.2 for polymers, to 150 for silicon, to 400 for copper, to over 2000 for
diamond. That is five orders of magnitude, and it drives most packaging
decisions.

Heat is carried by two mechanisms, and knowing which one dominates tells you how
a material will behave.

**Phonons**, meaning lattice vibrations, carry heat in insulators and
semiconductors. The conductivity follows a kinetic-theory form: heat capacity
times phonon velocity times phonon mean free path. That mean free path is
limited by whatever scatters phonons, and this is where it becomes a materials
design problem, because the scatterers are the same defects that scatter
electrons plus some that are specific to phonons:

- **Other phonons** through anharmonic (Umklapp) processes, which become more
  frequent as temperature rises, so phonon conductivity generally falls as 1/T
  above the Debye temperature.
- **Point defects and isotopes.** Mass disorder scatters phonons strongly.
  Isotopically purified silicon has noticeably higher thermal conductivity than
  natural silicon, and isotopically pure diamond higher still, purely because
  the mass disorder is removed.
- **Alloying.** Random substitution scatters phonons very effectively, which is
  why alloy semiconductors have much lower thermal conductivity than either
  constituent. This is a serious problem for heat removal in alloy devices and a
  deliberate tool in thermoelectrics (module 55).
- **Boundaries and interfaces.** In a thin film, once the thickness approaches
  the phonon mean free path, boundary scattering limits conductivity, exactly as
  it did for electrons in module 18. Thin-film thermal conductivity is therefore
  substantially below bulk, and using bulk values in a thermal model of a thin
  layer is a systematic error.

**Electrons** carry heat in metals, and they carry it in proportion to how well
they carry charge. The **Wiedemann-Franz law** states that the ratio of thermal
to electrical conductivity is proportional to temperature with a nearly
universal constant, the Lorenz number. That relationship is useful in both
directions: it lets you estimate thermal conductivity from a resistance
measurement, and departures from it are evidence that something other than
ordinary electron transport is occurring.

Two practical points that dominate real designs:

**Interface thermal resistance.** Heat crossing a boundary between two materials
encounters a resistance that exists even for a perfect interface, because the
phonon spectra do not match and some phonons reflect. In real joints, roughness
and voids add far more. In a packaged device the total thermal path is often
dominated by the interfaces, not by the materials, which is why thermal
interface materials are a product category and why module 54 spends time on
them.

**Anisotropy.** Layered and fibrous materials conduct very differently along and
across the layers. Graphite and graphene conduct superbly in plane and poorly
through the plane; printed circuit board laminate is similarly anisotropic. A
single quoted number for such a material is meaningless without a direction.

## Thermal expansion

Almost all solids expand on heating, because the interatomic potential is
anharmonic: the repulsive wall is steeper than the attractive tail, so as
vibration amplitude grows the average separation increases. Stiffer, more
strongly bound materials with deeper potential wells expand less, which is why
expansion coefficient correlates inversely with melting point across broad
families of materials.

Typical linear coefficients, in parts per million per kelvin, are worth carrying
in memory because the comparisons drive design:

- Silicon: about 2.6
- Silicon dioxide (fused): about 0.5
- Alumina: about 7
- Copper: about 17
- Aluminium: about 23
- Solder alloys: 20 to 25
- Epoxy moulding compound: 10 to 20 below its glass transition, and two to
  three times that above it
- Printed circuit board laminate: about 15 in plane, much higher through
  thickness

The consequences are structural and they are the main cause of wear-out in
packaged electronics:

**Thermal stress.** Bond two materials with different expansion coefficients and
heat them, and stress develops proportional to the mismatch, the temperature
change and the stiffness. A silicon die soldered to a copper leadframe and
cycled between operating and idle temperatures accumulates strain in the solder
every cycle. Solder creeps, cracks initiate, and eventually the joint fails.
Thermal cycling tests exist to measure exactly this, and the industry-standard
lifetime models are strain-based.

**Wafer bow.** A film deposited at high temperature and cooled contracts
differently from the substrate, bending the wafer. Excessive bow breaks
lithographic overlay and can crack the film. Measuring wafer curvature before
and after deposition is the standard way to get film stress, via the Stoney
equation.

**Design responses.** Choose expansion-matched materials where possible, which
is why specialized alloys and composites exist purely to hit a target expansion
coefficient (module 54 covers them). Where matching is impossible, insert a
compliant layer to absorb the strain, which is what underfill and die-attach
adhesives do. Or make the mismatched dimension short, since stress scales with
the distance from the neutral point, which is why small dies survive thermal
cycling far better than large ones.

The general principle: thermal expansion is the property that couples the
electrical design to the mechanical one. It is the reason a package is a
materials problem rather than a container.
