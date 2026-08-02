# Thin Films: Deposition, Structure and Properties

<!-- covers: 44.1, 44.2, 44.3, 44.4 -->

Almost every functional layer in a device is a thin film, and its properties are
determined far more by how it was deposited than by what it is made of. Two films
of identical composition, deposited differently, can differ by orders of
magnitude in resistivity, by hundreds of megapascals in stress, and by decades
in lifetime. This module is about that dependence.

## Deposition methods

The methods divide by whether material arrives as atoms transported physically
or as molecules that react chemically at the surface.

**Physical vapour deposition.**

*Evaporation* heats a source until it evaporates and the vapour condenses on the
substrate. Simple, clean, high rate, and directional, so it covers the tops of
features and not their sidewalls. That directionality is a defect for coverage
and a virtue for lift-off patterning. Electron-beam evaporation reaches
refractory materials that resistive heating cannot.

*Sputtering* bombards a target with argon ions, ejecting target atoms that
deposit on the substrate. It is the workhorse for metals and for many compounds:

- It handles **alloys and compounds** far better than evaporation, because
  material is removed atom by atom rather than by preferential evaporation of
  the more volatile component.
- **Magnetron** configurations confine electrons near the target with a magnetic
  field, raising ionization efficiency and rate.
- **Reactive sputtering** introduces a reactive gas, so sputtering a metal
  target in oxygen or nitrogen deposits an oxide or nitride. This is how
  titanium nitride barriers and many transparent oxides are made. It has a
  characteristic hysteresis problem: as reactive gas is added, the target itself
  becomes poisoned by a compound layer, and the transition between metallic and
  poisoned modes is abrupt and hysteretic, so the process must be actively
  controlled.
- **Ion bombardment during growth** densifies the film and modifies its stress,
  which is a control knob and also a source of damage to what lies underneath.

*Pulsed laser deposition* ablates a target with a focused laser pulse. It
transfers complex stoichiometries faithfully, which makes it excellent for oxides
in research, and it scales poorly in area and produces particulates.

**Chemical vapour deposition.** Precursor gases react at or near the heated
substrate to deposit a solid film.

- **Thermal CVD** at atmospheric or low pressure. Good conformality, because
  precursors reach all surfaces, but it requires temperatures many materials
  cannot survive.
- **Plasma-enhanced CVD**, which supplies the activation energy from the plasma
  rather than from the substrate, allowing deposition at 200 to 400 degrees C
  (module 41). This is how dielectrics are deposited over metallized wafers.
- **Atomic layer deposition**, which deserves separate treatment. Precursors are
  introduced alternately, never together, and each half-reaction is
  **self-limiting**: it stops when the surface is saturated. Growth is therefore
  exactly one atomic layer per cycle, independent of flux, so thickness is set by
  counting cycles and conformality is perfect even in holes with aspect ratios of
  hundreds. Those two properties, angstrom-level thickness control and perfect
  conformality, are why ALD became indispensable as devices went
  three-dimensional. Its cost is speed: a cycle takes seconds and deposits an
  angstrom.

**Solution methods.** Spin coating, dip coating, spray, inkjet and slot-die
printing. Cheap, scalable to large area, and limited in the material quality
achievable. These carry organic and printed electronics (module 52) and several
thick-film processes (module 45).

**Electrochemical deposition.** Plating from solution. This is how copper
interconnect is actually filled: a plating chemistry with additives that suppress
deposition at the field surface and accelerate it at the bottom of a trench gives
**superconformal** or bottom-up fill, so a narrow deep trench fills without a
seam. That additive chemistry is one of the more remarkable pieces of process
engineering in the industry, and without it damascene copper would not work.

## Film structure and microstructure

What arrives at the surface is atoms; what results is a microstructure, and the
route between them follows a few reliable rules.

**Nucleation and growth mode.** Whether the film wets the substrate determines
its early structure. Layer-by-layer growth occurs when the film-substrate
interaction is strong; island growth when it is weak; and layer-then-island
growth when strain accumulates in an initially wetting film, which is the
mechanism behind self-assembled quantum dots.

**Structure zone behaviour.** For sputtered and evaporated films the resulting
microstructure correlates strongly with the ratio of substrate temperature to the
material's melting point, and with the working pressure. The pattern:

- At low temperature ratios, adatoms barely move, and shadowing produces porous
  columnar structures with voided boundaries. Such films are low in density,
  high in resistivity and prone to absorbing moisture.
- At intermediate ratios, surface diffusion operates and gives dense columnar
  grains.
- At high ratios, bulk diffusion operates and gives large equiaxed recrystallized
  grains.

Ion bombardment shifts the whole pattern toward denser structures at lower
temperature, which is why bias sputtering and ion-assisted deposition exist.

**Texture.** Deposited polycrystalline films are usually textured, meaning grains
share a preferred orientation, because the lowest-surface-energy plane grows
fastest. Copper interconnect texture matters directly for electromigration
lifetime, since grain boundary character determines the diffusion path.

**Stress.** Every film is stressed, and it comes from two sources. **Intrinsic
stress** is built in during growth, from grain boundary formation, from
incorporated impurities, and from ion bombardment, and it can be tensile or
compressive depending on conditions. **Thermal stress** arises on cooling from
the deposition temperature because of expansion mismatch (module 35). Total
stress is measured from the curvature it induces in the substrate, and it matters
because excessive stress cracks films, delaminates them, bows wafers enough to
break lithographic overlay, and drives stress-migration voiding in interconnect.
Stress is also engineered deliberately: highly stressed nitride capping layers
are used as channel stressors in CMOS.

**Interfaces and adhesion.** A film is only as good as its adhesion, which
depends on chemical bonding, on cleanliness, and on the stress it must hold.
Adhesion layers, typically titanium or chromium under gold or copper, exist
purely because the noble metal does not bond to oxide.

## Properties of thin films

The recurring theme, already met several times in this course, is that thin-film
properties differ systematically from bulk ones, and always in the same
direction.

**Electrical.** Resistivity is higher than bulk because of surface and grain
boundary scattering (module 18), and the excess grows sharply as thickness falls
below the mean free path. This is the dominant interconnect problem of the
current era.

**Thermal.** Conductivity is lower than bulk because of the same boundary
scattering applied to phonons (module 35), plus interface thermal resistance at
every boundary. Using bulk thermal conductivity in a thin-film thermal model is a
systematic and often large error.

**Mechanical.** Thin films are typically stronger than bulk in yield strength,
because dislocation motion is confined, and they are much more sensitive to
defects. Their measured properties depend on thickness, which means a single
number is incomplete.

**Optical.** Optical constants of a film differ from the bulk material because of
density differences, porosity, and roughness, so ellipsometric analysis (module
19) should not assume bulk reference data for a deposited film.

**Chemical.** High surface-to-volume ratio makes films more reactive, more prone
to oxidation and to moisture uptake, and more vulnerable to interdiffusion with
neighbours over a device lifetime.

## Thin-film process choices

A short selection framework.

**What conformality do you need?** A flat surface allows anything. A moderate
step allows CVD. A high-aspect-ratio hole requires ALD or a bottom-up
electrochemical process. This question usually decides the method before any
other.

**What thermal budget do you have?** Before metallization, several hundred
degrees are available. After, roughly 400 degrees C is the ceiling. Plasma
processes and ALD exist largely to work under that ceiling.

**What thickness control do you need?** Angstroms demands ALD. Nanometres allows
sputtering with calibrated rates. Micrometres favours plating or CVD for rate.

**What stress can the stack tolerate?** Highly stressed films crack and
delaminate, and stress is adjustable through pressure, bias and temperature.

**Can you measure it?** Thickness by ellipsometry or x-ray reflectivity, sheet
resistance by four-point probe, stress by wafer curvature, structure by x-ray
diffraction and electron backscatter diffraction, composition by the methods of
module 34. A film property that cannot be monitored in line will drift.

The final point, which is the module's whole argument: **specify the process, not
just the material**. A purchase order or a paper that says "300 nm of titanium
nitride" has not specified the film. Deposition method, temperature, pressure,
bias, and reactive gas ratio all have to be stated, because they will change the
resistivity by a factor of several and the stress by hundreds of megapascals.
