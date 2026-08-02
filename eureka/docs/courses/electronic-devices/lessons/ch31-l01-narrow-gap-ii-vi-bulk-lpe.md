# Narrow-Bandgap II-VI Semiconductors: Bulk Growth and Liquid-Phase Epitaxy

<!-- covers: 31.1, 31.2 -->

The narrow-gap II-VI compounds exist for one reason: they detect infrared
radiation that no other material system covers as well. Mercury cadmium
telluride, usually written HgCdTe or MCT, is the dominant member, and
understanding why it is both indispensable and difficult is the point of this
module.

**Why the material matters.** Mercury telluride is a semimetal with essentially
zero bandgap; cadmium telluride has a gap of about 1.5 eV. Alloying them gives
a continuous range in between, so by choosing the mercury fraction you tune the
bandgap anywhere from zero to 1.5 eV, and therefore tune the cut-off wavelength
of a detector anywhere from the visible out beyond 20 micrometres. The two
atmospheric transmission windows that matter for thermal imaging, roughly 3 to
5 micrometres and 8 to 12 micrometres, are both reachable, and the alloy has a
direct gap with high absorption coefficient and high electron mobility. No
other single material system covers that span with that performance.

**Why it is difficult.** Every difficulty traces back to the weak
mercury-tellurium bond and the high mercury vapour pressure:

- The bandgap is a steep function of composition in the long-wavelength alloys,
  so a composition error of a fraction of a percent shifts the cut-off
  wavelength substantially. Composition uniformity requirements are therefore
  extreme.
- Mercury evaporates readily, so growth and every subsequent thermal step must
  control mercury overpressure, and stoichiometry rather than impurity doping
  sets the electrical type (module 22).
- The material is mechanically soft and easily damaged by handling and
  polishing.
- The pseudo-binary phase diagram has a wide separation between liquidus and
  solidus, which means strong segregation and therefore composition gradients
  during any melt growth.

## Bulk growth of narrow-gap II-VI crystals

Bulk MCT crystals are grown mainly to make substrates and, historically, to make
detectors directly. Three routes have been used, and their comparison is a good
illustration of trade-offs under a difficult phase diagram.

**Solid state recrystallization**, in which a sealed quenched ingot is annealed
for a long time to grow grains and homogenize composition. It is simple and it
gives reasonable uniformity, and grain boundaries persist.

**Bridgman growth**, directional solidification in a sealed ampoule. It suffers
badly from the wide liquidus-solidus separation: the first material to freeze
is much richer in cadmium than the last, so axial composition varies
substantially and only part of the ingot is usable. Sealing is mandatory
because of the mercury pressure, and the ampoule must withstand it at
temperature, which is a nontrivial engineering constraint in itself.

**Travelling heater method**, in which a narrow molten zone rich in tellurium is
passed through the charge at a temperature well below the melting point of the
compound. Because it is effectively a solution growth, it runs cooler, the
mercury pressure is lower, and the composition of the growing crystal is set by
the zone rather than by a progressively depleting melt. It gives the best
uniformity and the largest usable crystals of the three, at very slow growth
rates measured in millimetres per day.

The important commercial outcome is that bulk MCT is no longer the main device
material. Instead, **cadmium zinc telluride** is grown in bulk and used as a
*substrate* for epitaxial MCT. Adding a few percent zinc to cadmium telluride
tunes its lattice constant to match the MCT alloy of interest, which allows
lattice-matched epitaxy and therefore very low dislocation density.

That substrate is itself a serious materials problem. Cadmium zinc telluride is
grown by Bridgman or travelling-heater methods, is prone to twinning and to
tellurium inclusions, is mechanically fragile, and is available only in small
diameters at high cost. Substrate cost and size are the principal constraints
on large-format infrared focal plane arrays, which is why growing MCT on
alternative substrates, silicon, germanium or gallium arsenide, with a buffer
layer to absorb the mismatch, has been pursued for decades. Those alternatives
give large, cheap, mechanically robust substrates and leave dislocation
densities one to two orders of magnitude higher, which costs detector
performance particularly at long wavelength and low temperature.

## Liquid-phase epitaxy of mercury cadmium telluride

LPE was the first epitaxial technique to make production-quality MCT, and it
remains in use, which is unusual given that LPE has been displaced almost
everywhere else.

Two variants are used, distinguished by which component is in excess in the
melt:

**Tellurium-rich melts** operate at lower temperature, roughly 400 to 500
degrees C, which keeps the mercury pressure manageable and reduces
interdiffusion. The mercury concentration in a tellurium-rich melt is low, so
mercury loss from the melt during growth is a significant control problem.

**Mercury-rich melts** run hotter but hold a much larger mercury reservoir, so
the melt composition is more stable during growth, and the resulting material
tends to have lower defect densities. The penalty is the containment problem: a
large quantity of mercury at high temperature is both a materials handling
challenge and a safety one.

The practical implementations are the slider boat, as described in module 30,
and dipping or tipping arrangements where the substrate is immersed in the melt.

What LPE gives for this material:

- **Excellent crystalline quality and long minority carrier lifetime**, because
  growth is near equilibrium. Detector performance depends directly on
  lifetime, so this matters more here than in many applications.
- **High growth rate**, suiting the several-micrometre absorber layers a
  detector needs.
- **Low cost of equipment**, with no toxic hydride gases involved.

What it cannot do:

- **Abrupt heterojunctions and thin layers.** Modern detector architectures use
  multilayer heterostructures with graded and abrupt junctions to suppress dark
  current and to allow two-colour operation. LPE cannot define those.
- **Large-area uniformity** to the standard that large focal plane arrays now
  demand.
- **In-situ doping control** with the flexibility of a vapour process.

The consequence is a division that mirrors module 30 in miniature: LPE for
thick, high-lifetime, single-layer absorbers where its quality and cost win, and
MOVPE and MBE, covered in the next lesson, for the multilayer heterostructure
devices that dominate current development. The choice is not about which method
is better, it is about whether the device needs a thick perfect layer or a
complex thin stack.
