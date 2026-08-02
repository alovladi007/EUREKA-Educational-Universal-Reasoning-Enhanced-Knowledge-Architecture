# Surface Chemical Analysis: XPS, Auger, Glow Discharge and SIMS

<!-- covers: 34.1, 34.2, 34.3, 34.4 -->

Module 33 answered "what is the structure". This module answers "what elements
are present, in what chemical state, and how deep". For electronic materials
that question is usually about the top few nanometres, because that is where
interfaces, contamination and passivation live, and it is where devices fail.

## Electron spectroscopies: XPS and Auger

Both techniques rely on the same first step: a core electron is ejected from an
atom, leaving a hole. What is measured differs.

**X-ray photoelectron spectroscopy (XPS)** irradiates the surface with
monochromatic soft x-rays and measures the kinetic energy of the emitted
photoelectrons. Since the photon energy is known, the binding energy follows
directly, and binding energies are characteristic of the element and of the
core level. That gives elemental identification for everything except hydrogen
and helium.

The property that makes XPS uniquely valuable is the **chemical shift**. The
binding energy of a core electron shifts by a few electron-volts depending on
the atom's oxidation state and its bonding partners, because the valence charge
distribution screens the core differently. Silicon in a silicon dioxide layer
appears about 4 eV from elemental silicon, and the intermediate suboxide states
appear in between. So a single silicon spectrum from a partially oxidized
surface tells you not only that oxygen is present, but how much of the silicon
is fully oxidized, how much is suboxide and how much is elemental. That is
information no other routine technique gives.

Its characteristics:

- **Information depth of about 5 to 10 nm**, set not by how deep the x-rays
  penetrate, which is micrometres, but by how far a photoelectron can travel
  without losing energy. This makes it genuinely surface sensitive.
- **Quantitative to roughly 5 to 10 percent relative**, using tabulated
  sensitivity factors, without needing a matched standard.
- **Detection limit around 0.1 to 1 atomic percent**, which is poor by trace
  analysis standards. XPS is a major-and-minor-constituent technique, not a
  trace technique.
- **Lateral resolution** from millimetres down to a few micrometres with
  focused sources, so it is not a high-resolution imaging method.
- **Angle-resolved measurement** varies the information depth by changing the
  take-off angle, giving non-destructive depth information within the top few
  nanometres, which is how ultrathin gate dielectric stacks are profiled.

**Auger electron spectroscopy (AES)** uses an electron beam to create the core
hole and measures the Auger electrons emitted when the hole is filled by a
non-radiative process. The Auger energy depends only on the atomic energy
levels, so it identifies the element.

Compared with XPS: Auger has much better **lateral resolution**, down to tens of
nanometres, because an electron beam can be focused far more tightly than an
x-ray beam. That makes scanning Auger microscopy the tool for compositional
maps of small features, such as a single contaminated bond pad or a specific
particle. The trade is that chemical state information is weaker and harder to
interpret than XPS chemical shifts, and the electron beam damages insulators and
charges them, so insulating samples are difficult.

**Depth profiling** with either technique means alternating analysis with ion
sputtering to remove material. This works and it introduces artefacts: sputtering
mixes atoms across the receding interface, preferentially removes one species
over another so the measured composition drifts, roughens the surface so depth
resolution degrades with depth, and can chemically reduce oxides so the chemical
state information becomes unreliable. Rotating the sample during sputtering and
using low-energy or cluster ion beams mitigate these. Interpreting a sputter
depth profile without accounting for them is a standard way to be wrong about an
interface.

## Glow-discharge optical and mass spectrometry

Where XPS and Auger are surface techniques with poor detection limits, glow
discharge methods are bulk and depth-profiling techniques with excellent ones.

The sample is made the cathode of a low-pressure plasma. Argon ions sputter the
surface uniformly over a spot several millimetres across, and the sputtered
atoms are excited in the plasma. Two detection options follow:

**Glow discharge optical emission spectroscopy (GDOES)** measures the light
emitted by the excited atoms. Each element has characteristic emission lines, so
simultaneous multi-element detection is straightforward with a polychromator.
Sputter rates are high, micrometres per minute, so a profile through a
100-micrometre coating takes minutes rather than hours.

**Glow discharge mass spectrometry (GDMS)** feeds the sputtered material into a
mass spectrometer instead. Detection limits reach parts per billion, which makes
it the standard technique for certifying the purity of high-purity metals and of
the polysilicon feedstock in module 29.

What these methods are good for:

- **Fast, deep profiles** through coatings and multilayers, where SIMS would be
  impractically slow.
- **Uniform sputtering** over a large area, which averages out local roughness
  and gives good depth resolution relative to the depth reached.
- **Trace bulk analysis** at very low levels, in the GDMS variant.

What they are not good for: they need a reasonably flat, reasonably large
sample; they have essentially no lateral resolution; and the near-surface first
few nanometres are compromised by the discharge stabilizing.

## Secondary ion mass spectrometry

SIMS is the most sensitive elemental technique in common use, and it is the
reference method for dopant profiles in semiconductors.

A primary ion beam, typically oxygen or caesium, sputters the surface. A small
fraction of the ejected material leaves as ions, and those secondary ions are
mass analysed. Since a mass spectrometer can count single ions, detection limits
reach parts per billion for favourable species, which is roughly 10^14 atoms per
cubic centimetre, and sometimes better.

Its characteristics:

- **All elements including hydrogen**, and isotopic sensitivity. It is the only
  routine way to profile hydrogen and lithium.
- **Depth resolution of a few nanometres** with low-energy primary beams, so
  shallow implants and thin layers are measurable.
- **Dynamic range of five or six orders of magnitude** in a single profile,
  which is what a dopant profile needs since it spans from 10^20 at the surface
  to 10^15 in the substrate.
- **Imaging mode** giving lateral maps at sub-micrometre resolution.

Its problems are important enough that they define good practice:

**Matrix effects.** The probability that a sputtered atom leaves as an ion
depends strongly on the chemistry of the surface it leaves. The same
concentration of boron gives different signal in silicon and in silicon dioxide,
by an order of magnitude or more. SIMS is therefore **not quantitative without a
standard in the same matrix**, usually an ion-implanted sample with a known
dose. Profiles crossing an interface show an artefactual jump at the interface
that is matrix effect rather than composition.

**The surface transient.** The first few nanometres of a profile are unreliable
while the primary beam establishes a steady-state altered layer. For very
shallow implants, which is exactly the case that matters most in advanced
devices, this transient overlaps the region of interest.

**Knock-on and mixing.** The primary beam drives atoms deeper into the sample,
smearing sharp features and producing an exponential trailing edge below any
abrupt interface. This limits the measurable steepness of a junction regardless
of the true profile.

**Roughening and crater effects**, which degrade depth resolution as the crater
deepens, and which require careful gating so that only ions from the flat crater
bottom are counted.

**Mass interferences**, where a molecular ion has the same nominal mass as the
species of interest, requiring high mass resolution or a different primary
species to resolve.

## Choosing a surface analysis method

A short decision guide, since the value of this module is knowing which
instrument answers which question.

- **What elements are on this surface, and in what chemical state?** XPS. It is
  the default first question for contamination, oxidation and passivation
  problems.
- **What is the composition of this small feature?** Scanning Auger, for its
  lateral resolution.
- **What is the dopant profile, and how much hydrogen is in this film?** SIMS,
  with a matched implanted standard.
- **How pure is this bulk material?** GDMS.
- **What is the composition through this thick coating, quickly?** GDOES.
- **How thick is this oxide, non-destructively?** Ellipsometry (module 19) or
  x-ray reflectivity (module 33), not these techniques.

Two habits that keep surface analysis honest. First, surface analysis measures
the surface *as presented*, and every sample has been exposed to air, handled,
and possibly cleaned; a carbon and oxygen signal is present on essentially every
sample that has seen atmosphere, and mistaking it for a property of the material
is the most common beginner error. Second, sputter depth profiles are
reconstructions, not photographs: the depth axis comes from an assumed sputter
rate and the composition axis from assumed sensitivity factors, and both deserve
to be checked against an independent thickness measurement.
