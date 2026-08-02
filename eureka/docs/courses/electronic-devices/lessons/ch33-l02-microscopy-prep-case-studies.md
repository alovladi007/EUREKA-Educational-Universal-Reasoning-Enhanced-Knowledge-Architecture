# Microscopy, Functional Mapping, Sample Preparation and a Characterization Plan

<!-- covers: 33.4, 33.5, 33.6, 33.7, 33.8 -->

## Electron microscopy, imaging and diffraction

**Scanning electron microscopy** rasters a focused beam over a bulk sample and
collects secondary electrons for topography or backscattered electrons for
compositional contrast. Resolution reaches a few nanometres, depth of field is
large, and sample preparation is minimal for conducting samples. With an
energy-dispersive x-ray detector attached it gives elemental composition from
each point, though with a spatial resolution limited by the micrometre-scale
interaction volume in which the x-rays are generated, not by the beam size. This
distinction catches people out: the image can resolve 5 nm while the
accompanying composition map averages over a micrometre.

**Transmission electron microscopy** passes electrons through a sample thinned
below about 100 nm and forms an image or a diffraction pattern from them. What
it gives that nothing else does:

- **Direct imaging of dislocations, stacking faults, precipitates and grain
  boundaries**, with the ability to determine a dislocation's Burgers vector
  from how its contrast changes with diffraction condition.
- **Atomic resolution imaging of interfaces**, which is how heterostructure
  abruptness is verified and how a claimed monolayer-sharp interface is
  actually checked.
- **Selected area and convergent beam diffraction** from regions as small as
  nanometres, giving local structure and symmetry.
- **Scanning transmission mode with a high-angle annular detector**, where
  image intensity scales roughly with the square of atomic number, giving
  directly interpretable compositional contrast at atomic resolution.
- **Electron energy loss spectroscopy**, giving elemental composition, bonding
  and oxidation state from atomic-scale volumes, especially good for light
  elements where x-ray methods are weak.

The limitations are severe and must always be stated with the result. The
sampled volume is tiny, so a TEM image is an anecdote unless supported by a
technique that averages. Preparation is destructive and can introduce the very
defects being reported. The beam damages many materials, particularly organics,
oxides and anything with weak bonds. And a projection through a finite thickness
can make three-dimensional structures look like something they are not.

**Electron backscatter diffraction** in a scanning microscope maps crystal
orientation point by point over a polished surface, giving grain size, texture
and boundary character over areas of square millimetres. For polycrystalline
films and for interconnect metallurgy this is the technique that connects
microstructure to the transport behaviour of module 18.

**Scanned probe microscopy** completes the picture where topography and local
properties matter: atomic force microscopy for surface roughness on grown films,
which correlates directly with epitaxial growth mode, plus conductive, Kelvin
probe and magnetic force variants for local electrical and magnetic mapping.

## Mapping functional activity

Structure is not the same as function. A technique that shows a perfect lattice
does not show whether the material works, and several methods bridge that gap by
mapping an electrical or optical response with spatial resolution.

**Electron beam induced current.** Scan an electron beam over a device with a
junction and collect the current it generates. The beam creates electron-hole
pairs; wherever a defect kills them before collection, the current drops. The
result is a map of recombination activity, showing exactly which dislocations
and grain boundaries are electrically harmful. This is important because not all
structural defects are electrically active, and this technique separates the two
populations directly.

**Cathodoluminescence.** Collect the light emitted under electron
bombardment, spectrally resolved and spatially mapped. It gives local bandgap,
so alloy composition fluctuations become visible, and it identifies
defect-related emission. Together with EBIC it is the standard pairing for
understanding why a light-emitting structure underperforms.

**Photoluminescence and Raman mapping**, described in module 19, at optical
spatial resolution.

**Scanning capacitance and spreading resistance microscopy**, which map dopant
concentration in two dimensions across a cleaved device cross-section. This is
how a simulated dopant profile is checked against the real one.

**Thermal and photocurrent mapping** for locating hot spots and shunts in solar
cells and power devices.

The general point is worth stating explicitly because it is easy to lose: a
structural defect matters only if it is electrically active, and activity
depends on decoration by impurities, on local strain and on where the defect
sits relative to the junction. Structural and functional maps of the same region
are far more informative than either alone.

## Sample preparation and its artefacts

Preparation is where most characterization errors are introduced, and it
deserves more suspicion than it usually gets.

**Mechanical polishing** introduces subsurface damage to a depth comparable to
the abrasive size, so a nominally polished cross-section may be several
micrometres of damaged material over the region of interest. Final chemical or
chemo-mechanical polishing removes it.

**Focused ion beam milling** is the standard way to make a TEM lamella from a
specific device feature, and it implants gallium, amorphizes the surface layers,
and can induce local heating. Low-energy final polishing steps reduce but do not
eliminate this. Anyone reporting an amorphous layer at an interface seen in a
FIB-prepared sample should first ask whether the FIB made it.

**Cleaving** gives an undamaged cross-section for materials that cleave cleanly,
and is preferred where it is possible.

**Etching**, particularly preferential or defect etching, reveals dislocations
as etch pits and is cheap, fast and destructive. Etch pit density is a standard
dislocation metric, and it counts only dislocations that intersect the surface
and only those the etchant reveals, so it is a lower bound whose calibration
depends on the etchant.

**Coating** insulating samples with a conducting film to prevent charging in an
electron microscope, which obscures fine surface detail and adds a spurious
composition signal.

**Contamination** from handling, from the vacuum system, and from the electron
beam cracking residual hydrocarbons into a carbon deposit that grows visibly
during observation.

The discipline that follows: **always ask what the preparation could have
created**. A defect seen only in one preparation route is suspect. Where a
result matters, prepare the same material two different ways and compare.

## Combining techniques: worked case studies

Three composite examples, chosen because they show why single techniques are
never enough.

**A strained silicon-germanium layer that is underperforming.** High-resolution
x-ray diffraction gives the germanium fraction and, from a reciprocal space
map, whether the layer has relaxed. If it has relaxed, TEM cross-section shows
whether the dislocations are confined to the interface or threading to the
surface. Raman mapping gives the strain distribution laterally, which reveals
non-uniform relaxation. Atomic force microscopy shows whether cross-hatch
surface roughness has developed, which accompanies relaxation. Four techniques,
each answering a different part of "why is the mobility low".

**A gallium nitride LED with poor efficiency.** X-ray rocking curve width gives
threading dislocation density. Cathodoluminescence mapping shows dark spots at
dislocations and the scale of indium composition fluctuation, which controls
carrier localization. TEM confirms whether the quantum wells are the intended
thickness and whether their interfaces are abrupt. Secondary ion mass
spectrometry gives the magnesium and hydrogen profiles in the p-layer, which
bears on whether the acceptors are activated (module 32).

**A failing interconnect line.** Electron backscatter diffraction gives grain
size and texture, which set both resistivity (module 18) and electromigration
lifetime. FIB cross-section plus TEM shows the barrier layer continuity. Energy
dispersive spectroscopy across the barrier looks for copper penetration.
Four-point resistance measurement gives the electrical consequence.

The pattern in all three: one technique to average over the wafer, one to look
at a specific location, one to measure composition, one to measure the
electrical or optical consequence.

## Building a characterization plan

A practical procedure for a new or problematic material.

**1. Start non-destructive and averaging.** Optical measurements (module 19),
x-ray diffraction and reflectivity, sheet resistance. These are fast, cheap,
consume nothing, and they tell you whether the sample is what you think it is
before you spend anything.

**2. Add composition.** X-ray fluorescence or energy-dispersive spectroscopy
for major constituents, secondary ion mass spectrometry for trace species and
depth profiles (module 34).

**3. Localize.** Scanning electron microscopy and scanned probe first, since
they are relatively easy, then TEM only when a specific question requires
atomic-scale information at a known location.

**4. Measure the function.** Electrical characterization (module 36), lifetime,
and functional mapping. If the structure looks perfect and the device does not
work, the answer is usually at an interface or in an electrically active defect
that structural imaging did not flag.

**5. Cross-check anything that matters.** Two independent techniques agreeing
is the standard of evidence. Two techniques disagreeing is information about a
preparation artefact or a sampling difference, not an inconvenience to be
explained away.

**6. Record conditions, always.** Beam energy, dose, preparation route,
temperature, atmosphere and sample history. A characterization result without
its conditions is not reproducible, and reproducibility is the entire point.
