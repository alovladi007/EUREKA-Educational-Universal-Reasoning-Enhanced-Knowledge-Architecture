# Structural Characterization: Probes, Beams and X-Ray Diffraction

<!-- covers: 33.1, 33.2, 33.3 -->

Characterization answers a question that sounds trivial and is not: what did I
actually make? Every claim in the preceding modules, about crystal quality,
composition, strain, interface abruptness and defect density, rests on a
measurement. This module and the next three cover the instruments.

## How radiation interacts with matter

Every technique in this module works by sending something at the sample and
measuring what comes back. What comes back is determined by the interaction,
so the interaction determines what you can learn.

**Photons** interact with the electron cloud. The strength and character of the
interaction depend enormously on energy:

- **Infrared and visible** photons excite vibrations and electronic transitions,
  giving the bonding and band-structure information of module 19. They probe
  micrometres, non-destructively.
- **Ultraviolet and soft x-rays** excite core electrons, so absorption edges
  identify elements. Photoelectrons that escape carry chemical state
  information, which is module 34's subject.
- **Hard x-rays** scatter elastically off the electron density. Because their
  wavelength is comparable to interatomic spacing, they diffract, which gives
  the structural information described below. They penetrate deeply and cause
  little damage, which makes them the standard non-destructive structural probe.
- **Gamma rays** interact with nuclei, and Mossbauer spectroscopy uses that for
  local site symmetry and magnetic environment in a few specific elements.

**Neutrons** interact with nuclei rather than electrons. That gives them three
distinctive powers: they see light elements such as hydrogen, lithium and oxygen
that x-rays barely notice; they distinguish isotopes and neighbouring elements
that have almost identical x-ray scattering; and, because they carry a magnetic
moment, they scatter from magnetic order, making neutron diffraction the primary
technique for magnetic structure. They also penetrate centimetres of most
materials, so they measure bulk samples and engineering components rather than
surfaces. The cost is that they require a reactor or spallation source, so
access is scarce.

The essential comparison to internalize: **x-rays see electron density, neutrons
see nuclei and magnetism, electrons see potential and interact very strongly**.
That last property is why electron techniques give superb spatial resolution on
very thin samples and cannot penetrate bulk material.

## How particle beams interact with matter

**Electrons** scatter strongly, both elastically and inelastically, which makes
them the highest-resolution structural probe available and confines them to
thin samples or to surfaces. A single incident electron produces a cascade of
signals, and a modern electron microscope collects several at once:

- **Transmitted electrons**, giving images and diffraction patterns from a
  sample thinned to under about 100 nm.
- **Backscattered electrons**, whose yield rises with atomic number, giving
  compositional contrast in a scanning microscope.
- **Secondary electrons**, low-energy electrons knocked out of the surface,
  giving topographic contrast, which is the familiar scanning electron
  microscope image.
- **Characteristic x-rays**, emitted when a core hole created by the beam is
  filled. Their energies identify elements, and this is energy-dispersive x-ray
  spectroscopy, the standard microanalysis technique attached to almost every
  electron microscope.
- **Auger electrons**, an alternative decay path for the same core hole, and
  the basis of Auger spectroscopy in module 34.
- **Cathodoluminescence**, light emitted as electron-hole pairs recombine,
  which maps optical properties and defects with electron-beam resolution.
- **Energy loss spectrum** of transmitted electrons, giving elemental
  composition, bonding and dielectric response from nanometre volumes.

**Ions** are heavy, so they sputter the surface as well as probing it. That is
either a problem or the whole point. Secondary ion mass spectrometry uses the
sputtered material as its signal (module 34). Rutherford backscattering
spectrometry uses the elastic scattering of megaelectronvolt helium ions to give
composition against depth *quantitatively without standards*, which is unusual
and valuable, and in its channelling variant it measures crystalline quality and
the fraction of dopant atoms sitting on lattice sites.

**Scanned probes** are a different category: rather than a beam, a sharp tip is
brought close to the surface. Atomic force microscopy measures topography and,
in its various modes, mechanical, electrical and magnetic properties, at
nanometre lateral and sub-nanometre vertical resolution, in air or liquid.
Scanning tunnelling microscopy measures tunnelling current and gives atomic
resolution and local electronic structure on conducting samples in vacuum.

The trade that governs all of it: **resolution, penetration and damage are
coupled**. A probe that interacts strongly gives high resolution, penetrates
poorly, and damages the sample. A probe that interacts weakly penetrates deeply
and damages little, and gives averaged information. Choosing a technique means
choosing where on that triangle you want to sit.

## X-ray diffraction

Diffraction is the workhorse structural technique, and for epitaxial
semiconductor layers it is close to indispensable.

The physics is Bragg's law: constructive interference from parallel lattice
planes spaced d apart occurs when

    n * lambda = 2 * d * sin(theta)

So measuring the angles at which diffracted intensity appears gives the set of
plane spacings, and therefore the lattice parameters and the symmetry.

**Powder or polycrystalline diffraction** identifies which phases are present
by matching the pattern of peak positions and intensities against reference
data. Peak positions give lattice parameters, peak areas give phase fractions,
and peak widths give crystallite size and microstrain, separable because size
broadening and strain broadening have different angular dependences. This is the
routine phase identification method for ceramics, thick films and any
polycrystalline material.

**High-resolution diffraction of epitaxial layers** is where the technique
becomes quantitative and specific, and it is worth understanding what it
delivers because it is the standard acceptance measurement for the epitaxy of
module 30.

Scanning across a substrate reflection, an epitaxial layer produces its own peak
nearby. The **angular separation** between layer and substrate peaks gives the
difference in lattice spacing perpendicular to the surface, which for a
pseudomorphic layer converts directly into composition. For silicon-germanium,
this is how germanium fraction is measured to better than a tenth of a percent.

**Interference fringes** flanking the layer peak, arising from the finite layer
thickness acting like an optical etalon, give the thickness from their spacing,
to within a fraction of a nanometre. A superlattice gives a series of satellite
peaks whose spacing gives the period.

**Reciprocal space mapping**, a two-dimensional scan rather than a line scan,
separates the in-plane and out-of-plane lattice parameters. That separation is
what distinguishes a **strained pseudomorphic** layer, whose in-plane parameter
matches the substrate, from a **relaxed** layer, whose in-plane parameter has
returned toward its natural value. Since relaxation means misfit dislocations
have formed, this measurement tells you directly whether the critical thickness
was exceeded. Nothing else measures that as cleanly.

**Rocking curve width** measures crystalline perfection. A perfect crystal gives
a peak whose width is set by the intrinsic Darwin width, of order arc seconds.
Mosaic spread, dislocations and curvature all broaden it, so the measured width
is a routine quality metric, and for materials such as gallium nitride on
foreign substrates it correlates with threading dislocation density well enough
to be used as a production monitor.

**X-ray reflectivity**, measured at grazing incidence below the critical angle,
gives layer thickness, density and interface roughness for films from
nanometres to a few hundred nanometres, with no requirement that the film be
crystalline at all. It is the standard thickness metrology for amorphous layers
where diffraction has nothing to work with.

**Grazing incidence diffraction** keeps the beam near the surface so the
information depth is a few nanometres, which is how thin films are measured
without the substrate signal drowning them.

The limitations worth stating: diffraction measures an average over the
illuminated volume, so it reports a mean composition and a distribution width
rather than a map, unless a microfocused beam is used; it is insensitive to
features at concentrations below roughly one percent; and amorphous material
produces only broad halos. For local information, electron microscopy in the
next lesson is the complement, and the two together are the standard pairing.
