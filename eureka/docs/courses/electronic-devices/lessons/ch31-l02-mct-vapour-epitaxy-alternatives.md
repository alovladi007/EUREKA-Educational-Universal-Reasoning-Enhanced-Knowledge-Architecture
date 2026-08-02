# Vapour-Phase Epitaxy of MCT, and the Alternatives to It

<!-- covers: 31.3, 31.4, 31.5 -->

## Metal-organic vapour phase epitaxy

MOVPE brought to mercury cadmium telluride what it brought to the III-V system:
the ability to build multilayer heterostructures with controlled composition
and doping profiles, on large-area substrates, in a production-compatible tool.

The chemistry is distinctive. Cadmium and tellurium are supplied as
metal-organic precursors, but there is no practical metal-organic source of
mercury, so mercury is supplied as **elemental vapour** from a heated reservoir
inside the reactor. That asymmetry shapes the whole process: mercury is present
in large excess, its partial pressure is set by the reservoir temperature, and
controlling that pressure is the primary composition control.

Growth temperatures are low by epitaxial standards, typically 350 to 400
degrees C, which is necessary because the material interdiffuses so readily
(module 22). Even at those temperatures, interdiffusion during growth softens
heterointerfaces, and any subsequent processing step has to respect a thermal
budget measured in tens of degrees rather than hundreds.

The distinctive technique developed for this system is **interdiffused
multilayer process** growth: instead of trying to deposit the alloy directly,
alternate very thin layers of mercury telluride and cadmium telluride are
grown, and the natural interdiffusion at the growth temperature homogenizes
them into the alloy. Because the average composition is set by the relative
layer thicknesses, which are set by timing, this gives composition control
better than direct alloy growth, whose composition depends on precursor
efficiencies that drift.

What MOVPE delivers here:

- **In-situ doping.** Arsenic for p-type, iodine for n-type, incorporated
  during growth rather than by post-growth annealing under mercury pressure.
  This is a real advance, because it decouples doping from stoichiometry
  control.
- **Heterostructure device architectures.** Graded-gap absorbers, barrier
  layers that block majority carriers while passing minority carriers, and
  two-colour stacked detectors are all only possible with layer-by-layer
  composition control.
- **Growth on alternative substrates**, particularly gallium arsenide and
  silicon with buffer layers, which addresses the substrate cost and size
  problem from the previous lesson.

Its difficulties are the toxicity of the precursors combined with a large
inventory of hot mercury, and the sensitivity of composition to reactor
conditions, which makes uniformity across a large wafer demanding.

## Molecular beam epitaxy of MCT

MBE has become the technique of choice for the most demanding MCT device
structures, for reasons that follow directly from module 30's comparison.

**Low growth temperature.** MBE grows MCT at around 180 to 200 degrees C, far
below MOVPE. At that temperature interdiffusion is essentially frozen, so
heterointerfaces stay abrupt and superlattices survive. For a material this
prone to intermixing, that is decisive.

**In-situ monitoring.** Reflection high-energy electron diffraction watches the
surface during growth, and infrared spectroscopic ellipsometry can be used to
monitor composition in real time and to correct it during the run. Composition
control to a few tenths of a percent, which is what long-wavelength detectors
need, is achievable this way and is difficult otherwise.

**Doping control.** Arsenic as the p-type dopant and indium as n-type, with
abrupt profiles.

**Complex structures.** Superlattice detector designs, barrier architectures
and multi-colour stacks are all MBE work.

The costs are the ones MBE always carries, and one specific to this material:
elemental mercury has a very high vapour pressure even at modest temperature,
so the mercury flux is enormous compared with the other sources, most of it
lands on the chamber walls rather than the substrate, and the system must
handle and recover large mercury inventories. This makes MCT MBE systems
specialized rather than general-purpose.

The practical division across the three epitaxial methods for this material:
LPE for thick, simple, high-lifetime absorbers, MOVPE where production
throughput on alternative substrates matters, MBE where interface abruptness and
composition precision decide device performance.

## Alternatives to MCT

MCT's difficulties, substrate cost and size, composition sensitivity,
mechanical fragility, mercury handling, and the cryogenic cooling most designs
require, have motivated a long search for replacements. Several are now real
products, and the comparison is instructive because it shows how a material
with worse fundamental physics can win on manufacturability.

**Type-II superlattices**, most commonly indium arsenide with gallium antimonide
or with indium gallium antimonide. Instead of tuning a bulk alloy's gap, the
effective gap is set by the layer thicknesses of a superlattice, because the
electron and hole states are confined in different layers and the transition
energy between them depends on geometry. This gives infrared response from a
well-behaved III-V system grown on gallium antimonide substrates, which are
larger, cheaper and mechanically stronger than cadmium zinc telluride.
Theoretical arguments predict suppressed Auger recombination and therefore
higher operating temperature. The practical limitation has been minority
carrier lifetime, which remains below MCT's, so the theoretical advantage has
been slow to convert into measured performance.

**Quantum well infrared photodetectors**, using intersubband transitions in
gallium arsenide and aluminium gallium arsenide quantum wells. They are built
in the most mature compound semiconductor system in existence, so uniformity
across large arrays is excellent and cost is low. Their intrinsic drawbacks
are low quantum efficiency, since the intersubband transition is weak and does
not absorb normally incident light without a grating coupler, and the need for
lower operating temperatures. They found their place in large-format arrays
where uniformity matters more than peak sensitivity.

**Quantum dot infrared photodetectors**, which relax the polarization selection
rule that hampers quantum wells and promise longer carrier lifetimes through
the phonon bottleneck. Dot size non-uniformity has kept performance below
expectation.

**Microbolometers**, an entirely different physical principle. A thermally
isolated membrane of vanadium oxide or amorphous silicon absorbs infrared,
warms, and changes resistance. No bandgap is involved, so there is no cut-off
wavelength and, critically, **no cooling required**. Uncooled microbolometer
arrays are slower and less sensitive than cooled photon detectors, and they are
cheap enough and small enough to put thermal imaging into handheld instruments,
vehicles and phones. In terms of units shipped, this is the technology that won
the infrared market, which is a reminder that the figure of merit that matters
commercially is often not the one the physics community optimizes.

**Lead salts and colloidal quantum dots**, offering solution processing and very
low cost at the expense of stability and performance.

The honest summary: MCT remains the highest-performance infrared material,
particularly for long wavelengths and for applications that can afford
cryogenic cooling. Its competitors have not matched it on sensitivity, and they
have taken most of the market anyway by being cheaper, larger, more uniform or
uncooled. That pattern, where the best material loses to the adequate and
manufacturable one, recurs throughout this course and is worth recognizing
before it surprises you in practice.
