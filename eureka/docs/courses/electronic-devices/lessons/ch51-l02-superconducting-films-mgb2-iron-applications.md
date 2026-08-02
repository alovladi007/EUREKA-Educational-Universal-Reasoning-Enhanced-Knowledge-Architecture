# Superconducting Films, MgB2, Iron-Based Superconductors and Applications

<!-- covers: 51.4, 51.5, 51.6, 51.7 -->

## Superconducting films

The weak-link problem of the previous lesson makes cuprate conductors a
**texture** problem, and solving it is the main achievement of the field's
engineering side.

**Why texture.** Critical current across a grain boundary falls roughly
exponentially with misorientation angle, so a useful conductor needs its grains
aligned within a few degrees, in all three axes, along a tape hundreds of metres
long. That is a demanding requirement, since the tape must also be flexible,
mechanically strong and manufacturable at reasonable cost.

**The two production routes**, both of which work by giving the superconductor a
biaxially textured template to grow on:

**Rolling-assisted biaxially textured substrates.** A nickel-tungsten alloy tape
is heavily rolled and then recrystallized, and the recrystallization texture
comes out sharply biaxial. Buffer layers are deposited epitaxially on it to block
chemical reaction and to bridge the lattice mismatch, and the superconductor is
grown on top. The texture originates in the metallurgy of the substrate.

**Ion beam assisted deposition.** A textured buffer layer is grown on an untextured
metal tape by bombarding it with an ion beam at a specific angle during
deposition. Grains that happen to be aligned with the beam survive; misaligned
grains are preferentially sputtered away. The texture is created by selective
destruction rather than inherited, which means the substrate can be ordinary
Hastelloy, mechanically stronger and cheaper than the textured nickel alloy.

Either route ends with the superconducting layer deposited by pulsed laser
deposition, metal-organic deposition or reactive co-evaporation, capped with
silver and copper for electrical and thermal stabilization. The resulting
conductor is a multilayer tape a few millimetres wide and about 0.1 mm thick,
usually called **coated conductor** or **second-generation high-temperature
superconductor wire**.

**Flux pinning engineering.** Once texture is achieved, the critical current is
limited by vortex motion, so pinning centres are added deliberately: nanoscale
inclusions of barium zirconate or similar oxides, introduced during growth, which
self-assemble into columnar defects aligned with the growth direction. Those
columns pin vortices very effectively when the field is applied along them.
This is a striking example of designing a defect microstructure for a functional
purpose, and it improved in-field critical currents by large factors.

**First-generation wire** remains in use: BSCCO powder packed in a silver tube,
then drawn and rolled so that the micaceous grains align mechanically, and
reacted. It is simpler and it requires silver in quantity, which caps how cheap it
can ever be.

**Thin-film electronics.** A separate application area with different
requirements: films for microwave filters exploiting very low surface resistance,
superconducting quantum interference devices for extremely sensitive
magnetometry, and single-photon detectors. Most electronic applications use
conventional niobium films rather than cuprates, because niobium is far easier to
process reproducibly and the devices are already cold.

## Magnesium diboride

Discovered to be superconducting in 2001, decades after the compound was a
common laboratory chemical, which is a good reminder that the space of known
compounds has not been exhaustively tested.

**Tc is 39 K**, which is remarkable for a simple binary compound and roughly
double the previous record for a conventional superconductor. The mechanism is
conventional phonon-mediated pairing, confirmed by a clear isotope effect, made
unusually strong by boron's light mass and its very stiff in-plane bonds, which
give high-frequency phonons. It has **two distinct energy gaps**, associated with
different parts of the Fermi surface, which is unusual and well characterized.

**Why it matters practically** is not Tc alone but the absence of the cuprates'
problems:

- **Grain boundaries are not weak links.** The coherence length is longer and the
  order parameter is isotropic in sign, so current passes across misoriented
  boundaries. That means **no texture is required**, which removes the single
  most expensive part of cuprate conductor manufacture.
- **The constituents are cheap and abundant.** Magnesium and boron cost a small
  fraction of the rare earths, silver and specialty substrates that cuprate tape
  needs.
- **It is straightforward to make into wire** by packing powder in a metal tube
  and drawing it, then reacting in place.

**Its limitations** are equally clear: at 39 K it needs cooling below liquid
nitrogen temperature, so it runs at 20 K on a cryocooler, and its upper critical
field, while improvable by carbon doping and by introducing pinning, remains
below what the cuprates achieve.

Its niche is therefore applications wanting cheap conductor at 20 K rather than
maximum field: MRI magnets designed for cryocooler operation without liquid
helium, which matters given helium supply volatility, and some fault-current and
transmission demonstrations.

## Iron-based superconductors

Discovered in 2008, the second family of high-temperature superconductors, and
their significance is partly scientific and partly as a test of ideas.

**Structure and Tc.** They are layered compounds built on iron-pnictide or
iron-chalcogenide planes, structurally analogous to the cuprates' copper oxide
planes. Several structural families exist, with maximum Tc around 55 K in bulk
and reports above 65 K in single-layer iron selenide films on strontium titanate.

**Why they were a shock.** Iron is strongly magnetic, and magnetism was
understood to be hostile to conventional superconductivity because it breaks
Cooper pairs. Finding superconductivity in an iron compound at high temperature
forced a re-examination.

**What they clarify about mechanism.** Their phase diagram resembles the
cuprates': an antiferromagnetic parent compound, superconductivity appearing when
that order is suppressed by doping or pressure, and a dome-shaped Tc curve.
That parallel across two chemically unrelated families supports the idea that
**magnetic fluctuations** are involved in the pairing, which is the leading
cuprate hypothesis. The pairing symmetry appears to be a sign-changing s-wave
state rather than the cuprates' d-wave, which is a difference the theory has to
accommodate.

**Practical properties**, which are better than the cuprates in the ways that
matter for wire:

- Grain boundaries tolerate larger misorientation, roughly 5 to 9 degrees before
  serious degradation, which is more forgiving than the cuprates though not as
  free as MgB2.
- **Very high upper critical fields**, above 100 tesla in some members, with low
  anisotropy compared with the cuprates. For very high field magnets that
  combination is attractive.
- Wires have been made by the powder-in-tube route with useful critical current
  densities.

The honest status: promising for very-high-field applications, considerably less
developed than the cuprates, and requiring cooling well below liquid nitrogen.
Their main contribution so far has been to the physics rather than to technology.

## Applications and limits

**What is in production and paying for itself:**

- **MRI magnets**, the dominant commercial superconductor application by a wide
  margin, using niobium-titanium at 4 K. Every hospital MRI is a superconducting
  magnet, and this single application consumes most of the world's
  superconducting wire.
- **Nuclear magnetic resonance spectrometers**, using niobium-tin for the
  highest fields.
- **Particle accelerator magnets**, using niobium-titanium and niobium-tin.
- **SQUID magnetometers**, the most sensitive magnetic field detectors made, used
  in magnetoencephalography, geophysical survey and materials characterization.
- **Superconducting single-photon detectors**, now the standard detector for
  quantum optics and quantum key distribution because of their combination of
  efficiency, low dark counts and timing resolution.
- **Superconducting qubits**, which are the leading solid-state quantum computing
  platform. They are made of aluminium and niobium films with Josephson
  junctions, and they operate in the millikelvin range.

**What has been demonstrated repeatedly and not adopted broadly:**

- **Power transmission cables**, which have run in real grids in several
  demonstrations. They work. The economics rarely close, because the cryogenic
  plant, its reliability and its parasitic power consumption compete against
  copper that requires none of it. Where they have found a foothold is in dense
  urban retrofits, where the value is delivering far more power through an
  existing duct than copper could.
- **Fault current limiters**, where a superconductor carries normal current
  losslessly and quenches into a resistive state during a fault, limiting the
  current. This uses the transition itself as the function, and it is one of the
  more elegant applications.
- **Motors and generators**, particularly for wind turbines and ship propulsion,
  where the power-to-weight advantage is real and the cryogenics on a rotating
  machine is difficult.
- **Magnetic levitation transport**, technically successful and economically
  constrained by the cost of the guideway rather than the magnets.
- **Superconducting magnetic energy storage** and **fusion magnets**, the latter
  being one of the strongest current drivers: high-field cuprate tape allows a
  more compact tokamak, and that argument has funded a substantial expansion of
  coated-conductor manufacturing.

**Why adoption is limited**, stated plainly:

1. **Cryogenics dominates the system cost**, and it adds a failure mode and a
   maintenance burden that a copper system does not have.
2. **Coated conductor remains expensive** per ampere-metre despite two decades of
   development, because the textured multilayer architecture is intrinsically
   complex.
3. **Quench protection** is a serious engineering problem: a small normal region
   dissipates heat, which grows the normal region, and the magnet's stored energy
   must be extracted before the conductor is destroyed. In high-temperature
   superconductors the normal zone propagates slowly, which makes detecting a
   quench before damage occurs harder rather than easier.
4. **Mechanical fragility** of the ceramics constrains coil design.

**Would room-temperature superconductivity change this?** Yes, and it is worth
being precise about the caveats. Even at room temperature, a material would still
need adequate critical current density and critical field to be useful, would
still need to be manufacturable as a long flexible conductor, and would still
need quench protection. Hydride superconductors have shown very high Tc under
pressures of hundreds of gigapascals, which is a genuine and important result
about mechanism and is not a route to a wire. Claims in this area have a poor
reproducibility record, and the appropriate response to a new one is to wait for
independent replication of both zero resistance and the Meissner effect on the
same sample.
