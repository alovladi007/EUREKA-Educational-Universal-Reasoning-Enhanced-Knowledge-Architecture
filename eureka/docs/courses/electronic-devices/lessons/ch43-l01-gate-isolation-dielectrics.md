# Dielectrics for Microelectronics: Requirements, Gate and Isolation Layers

<!-- covers: 43.1, 43.2, 43.3 -->

## What a microelectronic dielectric must do

A chip contains more dielectric by volume than semiconductor, and the dielectrics
do four distinct jobs with four incompatible specifications. Treating them as a
single material class is the mistake this module exists to prevent.

The four roles:

1. **Gate dielectric**, separating the gate from the channel. It wants **high**
   permittivity, because capacitance is what controls the channel.
2. **Isolation dielectric**, separating one device from the next. It wants
   mechanical integrity, planarity and low leakage.
3. **Capacitor dielectric**, storing charge in a memory cell. It wants very high
   permittivity in a small area.
4. **Interconnect dielectric**, separating the wires. It wants **low**
   permittivity, because capacitance between wires costs delay and power.

Requirement 1 and requirement 4 point in exactly opposite directions, which is
why no single material serves.

The properties that get specified for all of them:

- **Permittivity**, high or low depending on role.
- **Breakdown field and leakage**, since the layer must insulate for ten years
  at operating field and temperature (module 26).
- **Thermal stability** against every subsequent process step, and chemical
  stability against the materials it touches.
- **Interface quality**, which for the gate dielectric means an interface trap
  density low enough not to degrade mobility or shift threshold.
- **Band offsets** to the semiconductor, which must exceed about 1 eV on both
  the conduction and valence sides, otherwise carriers are thermally emitted over
  the barrier rather than having to tunnel through it.
- **Mechanical properties**, because a film must survive chemical-mechanical
  polishing, thermal cycling and packaging stress.
- **Deposition conformality**, increasingly decisive as structures became
  three-dimensional.

## Gate dielectrics and the high-k transition

Silicon dioxide held this role for four decades, for the reasons given in module
17: it grows thermally on silicon, it is stable, and its interface with silicon
has an unusually low density of electrically active defects, of order 10^10 per
square centimetre per electron-volt after a hydrogen anneal. Nothing else comes
close on interface quality.

**Why it had to be replaced.** Scaling requires increasing the gate capacitance
per unit area, and for a fixed material that means thinning the layer. By the
early 2000s the oxide was approaching 1.2 nm, which is about five atomic layers,
and direct tunnelling current (module 26) was rising exponentially with each
angstrom removed. Standby power was becoming dominated by gate leakage. The
layer could not be thinned further, and capacitance could not stop increasing.

**The high-k solution.** Capacitance per unit area is permittivity divided by
thickness. Use a material with higher permittivity and you can make the layer
physically thicker while keeping the same capacitance. Since tunnelling depends
exponentially on physical thickness and capacitance depends on the ratio, this
is an enormous win: replacing silicon dioxide (relative permittivity 3.9) with
hafnium oxide (about 20 to 25) allows a physical thickness several times greater
at the same electrical thickness, cutting leakage by orders of magnitude.

The convention that emerged is **equivalent oxide thickness**: the thickness of
silicon dioxide that would give the same capacitance. A stack with an EOT of 1
nm might be 4 nm of physical hafnia.

**Why it took so long.** Every candidate material failed at least one
requirement, and the search was long:

- **Silicon nitride and oxynitride** were the first step, with permittivity
  around 7, adopted as an incremental measure.
- **Tantalum pentoxide and titanium dioxide** have high permittivity and
  inadequate conduction band offset, so they leak by thermal emission.
- **Aluminium oxide** has good offsets and stability and only modest permittivity
  around 9.
- **Zirconium and hafnium oxides** have permittivity around 20 to 25, adequate
  offsets, and thermodynamic stability in contact with silicon. Hafnia won.

Then the integration problems appeared, and they were harder than the material
selection:

- **An interfacial layer forms.** A thin silicon dioxide or silicate layer grows
  between the silicon and the high-k film, in series with it. Because it has the
  low permittivity, it dominates the total EOT, so the benefit is partly lost.
  Controlling that layer to a few angstroms is a central process problem.
- **Mobility degrades.** Channel mobility in early high-k devices fell
  substantially, attributed to remote Coulomb scattering from charge in the
  high-k film and to remote phonon scattering, since the soft polar phonons of a
  high-permittivity oxide couple to channel carriers. The two effects are
  physically linked to the very property that makes the material useful.
- **Fermi level pinning with polysilicon gates** made the threshold voltage
  uncontrollable, which is why the high-k transition had to be accompanied by a
  switch to **metal gates**, with different metals for n-channel and p-channel
  devices to set their work functions. The industry could not adopt high-k alone;
  the two changes had to arrive together, which is why the transition happened
  in one step at one node rather than gradually.
- **Crystallization** of hafnia during anneals creates grain boundaries that leak
  and that vary from device to device, so the film is doped with silicon,
  aluminium or lanthanum to keep it amorphous. That same dopant chemistry, at
  different concentrations, is what makes it ferroelectric (module 42), which is
  a pleasing connection.

**Deposition** is by atomic layer deposition, which is what makes the whole thing
possible: alternating self-limiting surface reactions deposit one atomic layer
per cycle, giving angstrom control and perfect conformality over the
three-dimensional fin and nanosheet structures that followed.

## Isolation dielectrics

Isolation keeps neighbouring devices from interacting, and its history is a
lesson in how a geometric problem drives a materials process.

**Local oxidation of silicon (LOCOS)** was the original approach: mask the active
areas with silicon nitride and thermally oxidize the rest. It is simple and it
has a fatal geometric flaw at small dimensions. Oxidation proceeds sideways under
the mask edge as well as downward, producing the tapered **bird's beak** that
eats into the active area. At small pitches the bird's beaks from both sides
consume the device.

**Shallow trench isolation (STI)** replaced it and is universal now: etch a
trench between devices, fill it with deposited oxide, and planarize back with
chemical-mechanical polishing. It has vertical walls, so it consumes no lateral
area, and the planarization gives a flat surface that lithography needs at small
feature sizes.

STI brought its own materials problems, each of which generated a process
solution:

- **Filling high-aspect-ratio trenches without voids.** Conventional plasma
  deposition closes the top of a narrow trench before the bottom fills, leaving a
  keyhole. The answers were high-density plasma deposition, which sputters as it
  deposits and so keeps the opening clear, and flowable chemical vapour
  deposition, which deposits a liquid-like film that flows into the trench and
  is then cured.
- **Stress.** The oxide fill has a different thermal expansion coefficient from
  silicon, so it compresses the active area at the trench edge. This shifts
  threshold voltage and changes mobility as a function of how close a device is
  to a trench edge, which is why layout-dependent effects became a first-order
  concern in analogue design. It is also exploited deliberately as a stressor.
- **Divot formation** at the trench corner during subsequent wet etches,
  producing a parasitic corner transistor that turns on early and degrades the
  subthreshold characteristic.

**Silicon-on-insulator** takes isolation further by placing a buried oxide layer
under the whole device layer, eliminating the substrate as a coupling path. It
reduces junction capacitance, removes latch-up, improves radiation hardness, and
in the fully depleted variant removes the need for channel doping and therefore
removes random dopant fluctuation (module 22). The buried oxide is made either by
implanting oxygen and annealing, or by bonding an oxidized wafer to another and
cleaving a thin layer off with a hydrogen implant. Its costs are substrate price
and a thermal one: the buried oxide has poor thermal conductivity, so the device
layer is thermally isolated and self-heats, which is a real constraint in power
and analogue applications.

**Deep trench isolation** for high-voltage and imaging applications, where
trenches extend micrometres into the substrate to block lateral current and
optical crosstalk between pixels.
