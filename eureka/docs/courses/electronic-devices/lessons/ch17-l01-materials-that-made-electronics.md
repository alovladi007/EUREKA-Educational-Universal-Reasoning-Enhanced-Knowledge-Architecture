# How Materials Decided What Electronics Could Become

<!-- covers: 17.1, 17.2, 17.3 -->

The first sixteen modules of this course treat components as given. A
transistor switches, a capacitor stores, an LED emits. From here on the
question changes: *why* does a transistor switch at that speed, leak that
much, and cost that little, while an LED made of silicon barely glows at all?
Every answer is a materials answer. This module sets up the rest.

## Integration: what actually scaled

The defining fact of electronics is that the number of devices on one chip
grew by roughly six orders of magnitude over five decades while the price per
device fell by about the same factor. That is not a normal engineering
trajectory. It happened because of a specific property of the technology:
making a chip costs roughly the same whether it holds a thousand transistors
or a billion, because the cost is dominated by processing a whole wafer, not
by touching individual devices. Shrink the device and you get more of them for
free.

Three things had to hold for that to work, and all three are properties of
materials rather than of circuit design.

First, the process had to be **planar**. Devices are built by depositing,
patterning and doping flat layers on a flat surface, so one lithographic step
defines millions of features at once. A process that required assembling
devices individually would have scaled linearly in cost and stopped.

Second, the material had to tolerate **repeated high-temperature processing**
without degrading. A wafer goes through hundreds of steps, several of them
near 1000 degrees C. The crystal has to survive that with its electrical
properties intact and its dopants roughly where you put them.

Third, defect densities had to fall as fast as device counts rose. A billion
transistors on a chip means a single killer defect per billion devices costs
you a chip. The yield problem is a materials-purity problem, and modules 21
and 22 are about exactly the defects and diffusion behaviour that decide it.

Shrinking eventually stopped being free. Below roughly 100 nm, gate oxides
became thin enough for electrons to tunnel through them, leakage stopped being
negligible, and power density became the binding constraint rather than area.
The response was to change materials rather than to keep shrinking the same
ones: a higher-permittivity gate dielectric so the layer could be physically
thicker while staying electrically thin (module 43), metal gates instead of
polysilicon, strained silicon channels to raise mobility (module 38), and
copper instead of aluminium interconnect with a low-permittivity insulator
between the lines. Each of those is a materials substitution, made because
geometry alone had run out.

## Why silicon, and why it kept winning

Silicon is not the best semiconductor by most single measures. Germanium has
higher carrier mobility. Gallium arsenide is faster and emits light. Silicon
carbide handles more voltage and heat. Silicon won anyway, and understanding
why is the single most useful piece of judgement in this half of the course,
because it shows that a material is chosen on a *system* of properties, not on
its best number.

Silicon's advantages compound:

- **Its native oxide is excellent.** Grow silicon in oxygen and you get
  silicon dioxide: an electrically superb insulator, chemically stable,
  mechanically adherent, and forming an interface with the underlying silicon
  that has remarkably few electrically active defects. No other semiconductor
  has an oxide anywhere near this good. This one accident of chemistry is why
  the metal-oxide-semiconductor transistor exists at all, and it is why the
  industry spent two decades reluctant to leave silicon dioxide even after it
  became too leaky.
- **Its bandgap sits in the right place.** About 1.1 eV at room temperature is
  wide enough that thermally generated carriers do not swamp the doped
  carriers at normal operating temperatures, and narrow enough that ordinary
  dopants ionize completely. Germanium, at 0.66 eV, leaks badly as it warms.
- **It is abundant and purifiable.** Silicon is the second most common element
  in the crust, and the chemistry to purify it to better than one foreign atom
  in ten billion is well established (module 29).
- **It is mechanically robust.** Large wafers can be handled, polished and
  processed without fracturing, which is what allowed wafer diameters to grow
  from 25 mm to 300 mm and drive the cost per device down further.

Silicon's one glaring weakness is optical. Its bandgap is **indirect**: the
lowest point of the conduction band and the highest point of the valence band
sit at different crystal momenta, so an electron cannot drop across the gap by
emitting a photon alone. It needs a lattice vibration to conserve momentum at
the same time, which makes radiative recombination a rare, slow event.
Silicon absorbs light well enough to make good detectors and solar cells, but
it is a hopeless light emitter. That single band-structure fact is the reason
a second family of semiconductors exists.

## Compound semiconductors and the jobs silicon cannot do

Combine a group III element with a group V element, or a group II with a group
VI, and you get a semiconductor whose properties you can tune by changing the
composition. Gallium arsenide, indium phosphide, gallium nitride, cadmium
telluride and mercury cadmium telluride are all in this family, and later
modules treat their growth (modules 30 to 32) and properties (modules 39, 49)
in detail.

What the compounds buy you:

- **Direct bandgaps.** In most III-V compounds the band extrema line up in
  momentum, so an electron and hole can recombine by emitting a photon
  directly. This is why every laser diode and LED you have ever used is a
  compound semiconductor and not silicon.
- **A tunable gap.** Alloying shifts the gap continuously. Mixing gallium and
  indium with nitrogen spans the ultraviolet through the visible; mixing
  mercury into cadmium telluride tunes an infrared detector to the wavelength
  band you need. You choose the photon energy by choosing a composition.
- **Higher electron mobility and saturation velocity.** Electrons in gallium
  arsenide move several times faster than in silicon at the same field, which
  is why compound devices dominate microwave and millimetre-wave amplification.
- **Wide gaps for power and heat.** Gallium nitride and silicon carbide have
  gaps around 3.4 and 3.3 eV. A wide gap means a large breakdown field, so a
  device blocking a given voltage can be much thinner and therefore much lower
  in resistance, and it means the device keeps working hot.

What the compounds cost you is exactly what silicon has: there is no good
native oxide, crystals are harder and more expensive to grow, wafers are
smaller and more fragile, and the materials are often scarce or toxic. So the
industry settled into a division of labour that still holds. Silicon does
logic, memory and most analogue work, in enormous volume and at low cost.
Compounds do the jobs that depend on a property silicon does not have:
emitting and detecting light, switching at very high frequency, and handling
high voltage and temperature.

The frontier is combining them. Growing a compound layer on a silicon wafer
gets you compound performance at silicon cost and scale, but the two crystals
usually have different lattice spacings and different thermal expansion, so
the interface fills with dislocations that ruin device lifetime. Module 30 on
epitaxy and module 33 on structural characterization are where that fight
happens.

## What the rest of this half does

With that framing, the sequence ahead follows a logic. Modules 18 to 27
establish the fundamental properties: how charge moves, what light does to a
material, how magnetism and dielectric response work, what defects and
diffusion do to a crystal. Modules 28 to 36 cover how these materials are made
and, just as importantly, how you find out what you actually made. Modules 37
to 45 work through the specific materials that carry mainstream electronics.
Modules 46 to 57 cover the materials behind newer device classes, from
phase-change memory and graphene to superconductors, thermoelectrics and the
packaging that has to hold all of it together.
