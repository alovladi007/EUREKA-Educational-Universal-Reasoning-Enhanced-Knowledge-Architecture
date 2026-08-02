# Transparent Conductive Oxides

<!-- covers: 56.1, 56.2, 56.3 -->

## What a transparent conductor must achieve

A transparent conductor has to do two things that are normally mutually
exclusive. Conduction requires free carriers; free carriers absorb and reflect
light. Understanding why the combination is possible at all is the whole subject.

**The physics of the window.** Free carriers in a solid respond collectively at
the **plasma frequency**, which rises with carrier concentration. Below the
plasma frequency the material reflects, behaving like a metal; above it the
carriers cannot follow the field and the material transmits. Separately, photons
with energy above the bandgap are absorbed by interband transitions.

A transparent conductor therefore needs a transmission window bounded on both
sides:

- **A wide bandgap**, above about 3.1 eV, so that no visible photon has enough
  energy to excite an electron across it. This is why every transparent conductor
  is a wide-gap oxide.
- **A plasma frequency below the visible**, in the near infrared, so that visible
  light sits above it and passes. This caps the carrier concentration at roughly
  10^21 per cubic centimetre. Push the doping higher and the plasma edge moves
  into the red, the material starts to look bluish and reflective, and
  transparency is lost.

With carrier concentration capped, the only remaining route to higher
conductivity is **higher mobility**. That single conclusion organizes the entire
materials design effort in this field: TCO research is mobility research.

**How performance is quoted.** The practical figure is **sheet resistance**
against **transmittance**, since both scale with thickness in opposite
directions: a thicker film conducts better and transmits less. Quoting a sheet
resistance without the transmittance, or a transmittance without the wavelength
range and without stating whether the substrate is included, is meaningless.
Various figures of merit combine the two into a single number, all of them
essentially a ratio of conductivity to visible absorption coefficient.

Typical requirements by application:

- Touch screens: 100 to 500 ohms per square, above 90 percent transmittance.
- Flat panel display electrodes: 10 to 100 ohms per square.
- Solar cell front contacts: 10 ohms per square or below, with transmittance
  needed across a broader spectrum than the visible, since the cell uses the near
  infrared too.
- Low-emissivity architectural glass: transmit visible, reflect thermal infrared,
  which uses the plasma edge deliberately rather than avoiding it.

## Designing TCO materials

**Indium tin oxide** is the incumbent and the benchmark. Indium oxide doped with
around 10 percent tin, giving sheet resistance around 10 ohms per square at 90
percent transmittance in a film of 100 to 200 nm, with mobility of 30 to 50
cm^2/(V s). It has been the standard for decades and it is very good.

Its problems are why alternatives are pursued:

- **Indium is scarce and expensive**, recovered as a by-product of zinc mining,
  with supply concentrated geographically. Price has been volatile.
- **It is brittle.** Being a ceramic, it cracks at bending strains around 1
  percent, which limits flexible displays (module 46).
- **It requires elevated-temperature deposition or annealing** to reach its best
  properties, which conflicts with plastic substrates.
- **It is chemically reduced** by contact with reactive materials, and in solar
  cell stacks it can be degraded by hydrogen plasma processing.

**The design principles that emerged**, and these are the useful transferable
content:

**1. The conduction band must be made of overlapping metal s orbitals.** This is
the key insight. In these oxides the conduction band minimum is formed from the
spherically symmetric s orbitals of the metal cation. Because s orbitals are
isotropic, they overlap well with their neighbours even when the arrangement is
disordered, so the band is wide, the effective mass is small, and mobility stays
high. That is fundamentally different from a covalent semiconductor, where
directional sp3 bonds require geometric order for good overlap and mobility
collapses when the structure is disordered.

This explains a fact that would otherwise be surprising: **amorphous** transparent
oxides can have mobilities of 10 cm^2/(V s) or more, an order of magnitude above
amorphous silicon, because the orbital overlap does not depend on bond angles. It
is why amorphous indium gallium zinc oxide became the channel material of choice
for high-resolution display backplanes (modules 41 and 46), and it is the clearest
demonstration in this course that the character of the conduction band, not just
the degree of order, determines mobility in a disordered material.

**2. Doping is by oxygen vacancies and by aliovalent substitution.** Oxygen
vacancies act as donors, so the carrier concentration depends on the oxygen
partial pressure during deposition and annealing, exactly as in module 27's
defect chemistry. Substitutional doping, tin on indium, aluminium or gallium on
zinc, fluorine on oxygen, provides more stable and controllable doping.

**3. Mobility is limited by ionized impurity scattering** at these carrier
concentrations (module 18), which sets a practical ceiling. Strategies to raise
it include doping with species whose ionized cores scatter less, spatially
separating the dopants from the channel, and improving crystallinity.

**The alternative material families:**

- **Aluminium- or gallium-doped zinc oxide.** Cheap, abundant, non-toxic, with
  performance approaching ITO. Its weakness is chemical and thermal stability,
  particularly in humid environments, where it degrades. Widely used in thin-film
  photovoltaics.
- **Fluorine-doped tin oxide.** Chemically and thermally very robust, which is
  why it is the standard coating on architectural low-emissivity glass and on
  substrates for dye-sensitized and perovskite solar cells, where processing is
  aggressive. Its conductivity is below ITO's.
- **Amorphous indium gallium zinc oxide** and related amorphous oxides, whose
  main role is as a semiconductor channel rather than a conductor, exploiting the
  same s-orbital conduction band at much lower carrier concentration.
- **p-type transparent oxides**, principally copper-based delafossites. These are
  scientifically important because a transparent p-n junction would enable
  transparent electronics, and they perform poorly: the valence band is made of
  localized oxygen 2p orbitals, which are directional and narrow, so hole
  mobility and conductivity are orders of magnitude below the n-type materials.
  This asymmetry is intrinsic to the oxide electronic structure rather than a
  processing problem, and it is the reason transparent electronics has remained a
  one-sided technology.
- **Non-oxide alternatives**, competing on flexibility rather than on
  performance: silver nanowire networks, which are percolating conductors
  (module 18) that are flexible and haze the image slightly; metal meshes,
  patterned finely enough to be invisible; carbon nanotube networks; graphene
  (module 49); and PEDOT:PSS (module 52). Each beats ITO on flexibility and none
  beats it on the sheet-resistance-versus-transmittance trade for large areas.

## Searching for new TCO candidates

The search for better transparent conductors has become a standard testbed for
computational materials discovery, and it is worth understanding as a
methodology, because the same approach is now applied across this course's
material families.

**The screening approach.** Rather than synthesizing candidates one at a time,
compute properties for large numbers of known and hypothetical compounds and
filter. The screening criteria follow directly from the physics above:

1. **Bandgap above about 3 eV**, computed from band structure, with the caveat
   that standard density functional calculations systematically underestimate
   gaps and require a correction.
2. **Small electron effective mass**, read from the curvature of the conduction
   band, which predicts high mobility.
3. **Dopability**, assessed by computing defect formation energies to check
   whether donors can be introduced without the crystal spontaneously creating
   compensating defects. This is the self-compensation question of module 32, and
   it is the criterion that eliminates most otherwise attractive candidates.
4. **Thermodynamic stability**, checked against competing phases so that the
   proposed compound is actually synthesizable.
5. **Abundance, cost and toxicity** of the constituents, applied as a filter from
   the start rather than discovered afterwards.

**What this has produced.** Screening across tens of thousands of compounds has
identified candidate families beyond the traditional oxides, and several
predicted materials have been synthesized and shown to have roughly the predicted
properties. It has not produced a material that displaces ITO, which is the
honest bottom line.

**Why prediction is hard here**, and this is the generalizable lesson:

- Computed properties are for **ideal crystals**; real films are polycrystalline
  or amorphous, with grain boundaries and defects that dominate mobility.
- **Dopability is the hardest thing to predict** and the most often decisive.
  Many compounds with excellent computed band structures cannot be doped, for the
  thermodynamic reasons in module 32.
- **Processing is not in the model.** A material that requires 800 degrees C or a
  reducing atmosphere is unusable on plastic regardless of its properties.
- **Stability over years in service** is outside what these calculations address.

The pattern generalizes past TCOs: computational screening is very good at
eliminating candidates and identifying families worth attention, and it does not
substitute for the synthesis, doping and integration work that determines whether
a material becomes a technology. Every module in this half of the course has
supplied an example of that gap, and this one is simply where the screening
methodology has been applied most systematically.
