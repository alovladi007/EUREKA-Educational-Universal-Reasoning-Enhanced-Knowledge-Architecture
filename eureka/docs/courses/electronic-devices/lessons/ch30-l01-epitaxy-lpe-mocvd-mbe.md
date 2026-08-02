# Epitaxial Crystal Growth: LPE, MOCVD and MBE

<!-- covers: 30.1, 30.2, 30.3 -->

Epitaxy is growing a crystalline layer on a crystalline substrate, with the
layer taking its orientation from the substrate underneath. Almost every
compound semiconductor device, and a large fraction of silicon devices, is
built in an epitaxial layer rather than in the substrate itself, for three
reasons: the layer can be purer than any bulk crystal, its doping can be
controlled abruptly with depth, and it can be a different material from the
substrate, which is what makes heterostructures possible.

Two terms recur. **Homoepitaxy** grows the same material as the substrate, so
the lattice matches perfectly and the only question is quality. **Heteroepitaxy**
grows a different material, and then lattice mismatch and thermal expansion
mismatch become the central problems. A layer thinner than a critical thickness
can accommodate the mismatch elastically, growing **pseudomorphically** with its
in-plane lattice constant strained to match the substrate. Beyond that
thickness it is energetically cheaper to relax by generating **misfit
dislocations** at the interface, and those dislocations usually thread up
through the layer to the surface, where they degrade devices. Almost all
heteroepitaxial engineering is about staying below the critical thickness,
grading the composition slowly enough to keep dislocations confined, or
accepting the dislocations and designing a device that tolerates them.

## Liquid-phase epitaxy

The oldest of the three, and still used where its particular advantages matter.

The substrate is brought into contact with a metallic solution saturated with
the material to be grown, usually at 600 to 900 degrees C, and the system is
cooled slightly. The solution becomes supersaturated and deposits the
semiconductor onto the substrate. In practice the substrate is slid under a
series of melt wells in a graphite boat, each of a different composition, so a
multilayer structure is grown by sliding from one well to the next.

Advantages that keep it alive:

- **It grows near equilibrium**, so the material quality is excellent and the
  point-defect density is low. Minority carrier lifetimes in LPE material are
  among the best achievable.
- **It is cheap.** The apparatus is a furnace, a graphite boat and a hydrogen
  ambient. There are no toxic gas cabinets and no ultra-high vacuum.
- **It purifies as it grows**, because the segregation coefficient of many
  impurities favours the liquid, so the grown layer is cleaner than the source.
- **High growth rates**, micrometres per minute, which suits thick layers.

Limitations that pushed it aside for most modern work:

- **Poor thickness control** at the very thin end. Growing a 5 nm quantum well
  reproducibly is not realistic.
- **Poor interface abruptness**, because the melt takes time to be wiped away
  and some intermixing is unavoidable.
- **Surface morphology** suffers from melt carryover and from meniscus effects.
- **Limited composition range**, because the layer composition is set by the
  liquidus and not chosen freely.

LPE therefore remains in use for thick, high-quality layers where abruptness
does not matter: some infrared detector material (module 31), some power device
layers, and magnetic garnet films.

## Metal-organic chemical vapour deposition

The dominant production technique for compound semiconductors, and the process
behind essentially every LED and laser diode manufactured today.

Gaseous precursors are transported over a heated substrate, where they
decompose and deposit the film. The group III source is a metal-organic
compound, an alkyl of gallium, indium or aluminium; the group V source is
typically a hydride, arsine, phosphine or ammonia. The precursors pyrolyse at
the hot substrate, the semiconductor deposits, and the organic fragments are
carried away in the gas stream. Dopants are supplied as further gaseous
precursors, switched on and off with the gas flow.

What makes it the production choice:

- **Throughput and scale.** Reactors handle many large wafers per run, and the
  process is compatible with continuous production.
- **Wide material range.** It grows arsenides, phosphides, nitrides and
  antimonides, including the aluminium-containing alloys, and including gallium
  nitride, which molecular beam epitaxy handles less readily at production
  scale.
- **Good abruptness.** Interfaces of one to two monolayers are achievable by
  fast gas switching, which is enough for quantum wells and for most
  heterostructures.
- **Higher growth rates than MBE**, so thick layers are practical.

Its costs and constraints are real and worth stating plainly:

- **Precursor toxicity.** Arsine and phosphine are acutely toxic gases. Handling
  them demands gas cabinets, scrubbers, continuous monitoring and interlocks,
  and this dominates the facility cost. Alternative less-hazardous precursors
  exist and are used where the process tolerates them.
- **Parasitic gas-phase reactions.** Precursors can react with each other before
  reaching the surface, particularly the aluminium and nitrogen chemistries,
  producing particles and depleting the reactants. Reactor geometry and pressure
  are designed largely around suppressing this.
- **Carbon and hydrogen incorporation** from the organic ligands, which acts as
  unintentional doping and as passivation.
- **No real-time surface diagnostic**, because the reactor is not under vacuum.
  Growth is controlled by calibrated recipes and verified after the fact.

## Molecular beam epitaxy

The research and precision technique, and the production choice where its
control is worth the cost.

Growth takes place in ultra-high vacuum, at pressures around 10^-10 torr or
lower. Elemental sources are heated in effusion cells until they evaporate,
producing molecular beams that travel to the substrate without colliding with
anything, because the mean free path in that vacuum is far longer than the
chamber. Shutters in front of each cell open and close in a fraction of a
second, which switches the arriving flux essentially instantaneously.

What that buys:

- **Monolayer control.** Growth rates are around one monolayer per second, and
  shutters switch faster than a monolayer forms, so a layer thickness can be
  specified to within an atomic plane.
- **Atomically abrupt interfaces**, which is what modulation-doped structures
  and short-period superlattices need (module 18).
- **In-situ diagnostics.** Because the chamber is under vacuum, an electron beam
  can be used during growth. **Reflection high-energy electron diffraction**
  gives a diffraction pattern from the growing surface whose intensity
  oscillates once per monolayer completed, so the operator literally counts
  atomic layers as they form. Nothing in MOCVD or LPE compares.
- **Low growth temperature**, which limits interdiffusion (module 22) and
  allows metastable compositions that equilibrium methods cannot reach.
- **High purity**, since sources are elemental and the background is vacuum.

The costs:

- **Slow.** Roughly one micrometre per hour. Thick layers are impractical.
- **Expensive and maintenance-heavy.** Ultra-high vacuum systems require regular
  bake-outs, and source recharging means venting and re-establishing vacuum,
  which takes days.
- **Limited throughput**, though production MBE systems for specific products,
  notably some infrared detectors and certain radio-frequency device layers,
  do exist.
- **Difficulty with some chemistries**, phosphorus in particular, because
  elemental phosphorus sources are awkward, which led to gas-source and
  chemical-beam hybrids that use hydride sources in an MBE chamber.

## Choosing among them

The decision is usually made on three axes.

**Thickness and abruptness.** Need a 5 nm layer with a monolayer-abrupt
interface? MBE. Need a 50 micrometre layer? LPE or a high-rate vapour method.
Need something in between with production throughput? MOCVD.

**Material system.** Nitrides are largely MOCVD territory at production scale.
Antimonides and some narrow-gap materials favour MBE for its low growth
temperature. Thick garnet and some detector layers stay with LPE.

**Volume and cost.** MOCVD dominates production because it scales; MBE dominates
research because it controls; LPE survives where its cheapness and quality suit
the layer.

A general principle worth carrying: epitaxy is where a device's vertical
structure is defined, and it is the step with the least tolerance for error,
because everything above and below depends on it and none of it can be repaired
later. The characterization techniques of module 33, x-ray diffraction for
composition and strain and transmission electron microscopy for interfaces, are
paired with these growth methods so closely that they are usually run in the
same laboratory.
