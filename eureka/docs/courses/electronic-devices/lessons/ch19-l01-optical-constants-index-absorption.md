# Optical Constants, Refractive Index, and Absorption

<!-- covers: 19.1, 19.2, 19.3 -->

Light is the most informative non-destructive probe of an electronic material.
Shine it on a sample and what comes back encodes the bandgap, the doping, the
film thickness, the crystallinity and the defect population. This module is
about the quantities that carry that information and, in the next lesson, the
instruments that read them.

## Optical constants: n, k and the dielectric function

An electromagnetic wave travelling through a material is described by a single
complex refractive index:

    N = n - i*k

The real part n sets the phase velocity, c/n, and therefore refraction. The
imaginary part k, the **extinction coefficient**, sets how fast the wave
decays. Because intensity goes as the square of the field amplitude, k relates
to the **absorption coefficient** alpha by

    alpha = 4 * pi * k / lambda

with alpha in units of inverse length. Its reciprocal, 1/alpha, is the depth
at which intensity has fallen to about 37 percent, the natural way to think
about penetration.

The same physics can be written as a complex **dielectric function**,
epsilon = epsilon_1 - i*epsilon_2, and the two descriptions are related by
epsilon = N^2, so epsilon_1 = n^2 - k^2 and epsilon_2 = 2nk. Optical people
prefer n and k; solid-state people prefer epsilon, because epsilon connects
directly to the band structure. They are the same information.

Two facts about these quantities do a lot of work.

**They are not independent.** Causality alone (the material cannot respond
before the light arrives) forces a mathematical relationship between the real
and imaginary parts across all frequencies, the **Kramers-Kronig relations**.
Given absorption over a wide enough spectral range you can compute the
refractive index, and vice versa. Ellipsometry and reflectivity analysis lean
on this constantly, and it explains an otherwise puzzling fact: anywhere a
material absorbs strongly, its refractive index varies rapidly nearby.
Absorption and dispersion are two faces of one response.

**Reflection follows from them.** At normal incidence from air,

    R = ((n-1)^2 + k^2) / ((n+1)^2 + k^2)

A high index means a high reflectivity, which is why silicon, with n of about
3.5 in the near infrared, reflects more than 30 percent of the light hitting a
bare polished surface. That is exactly the loss an antireflection coating
exists to cancel, and the same equation is what makes such a coating
designable.

## Refractive index and dispersion

The refractive index of any real material varies with wavelength, which is
**dispersion**. In the transparent region below the absorption edge, index
falls smoothly as wavelength rises (normal dispersion), and is well described
by empirical forms such as the Sellmeier equation, a sum of resonance terms
fitted to measured data. Near and above an absorption feature the index swings
sharply and can even rise with wavelength (anomalous dispersion), which is the
Kramers-Kronig relationship made visible.

Several contributions add up to the index of a semiconductor or insulator:

- **Electronic polarization** from interband transitions, dominant in the
  visible and ultraviolet, which is why materials with a smaller bandgap
  generally have a higher refractive index. Silicon (gap 1.1 eV, n about 3.5)
  against silicon dioxide (gap about 9 eV, n about 1.46) is the standard
  illustration, and it is not a coincidence but a consequence.
- **Lattice (ionic) polarization** from the displacement of charged ions,
  which matters in the infrared and produces strong reststrahlen reflection
  bands near the optical phonon frequencies in polar crystals.
- **Free carrier response**, which lowers the index and adds absorption at
  long wavelengths in doped material. Push the doping high enough and the
  plasma frequency moves into the visible; that is the physics of transparent
  conducting oxides in module 56.

The index also responds to conditions, which is both a nuisance and a tool.
It shifts with temperature (the thermo-optic coefficient), with strain (the
photoelastic effect), with applied field (the electro-optic effect, the basis
of optical modulators) and, at high intensity, with the intensity itself
(the nonlinear index). For measurement purposes the important consequence is
that an index measured at 20 degrees C on unstrained material does not apply to
a hot, strained film on a wafer.

## Absorption processes in solids

An absorption spectrum is a list of the mechanisms by which a material can
take energy out of a light beam. Each one dominates a different spectral
region and each carries different information.

**Fundamental (interband) absorption.** Above the bandgap, a photon can
promote a valence electron into the conduction band. This is the strongest
absorption in a semiconductor and it defines the **absorption edge**. Its
shape distinguishes the two band-structure classes cleanly:

- In a **direct gap** material the transition needs only a photon, so
  absorption rises very steeply above the gap, with alpha climbing to 10^4 per
  cm within a few tens of meV. Near the edge, alpha^2 varies linearly with
  photon energy, so plotting alpha^2 against energy and extrapolating gives
  the gap.
- In an **indirect gap** material the transition also needs a phonon to
  conserve momentum, making it a weaker, second-order process. Absorption
  turns on gradually over hundreds of meV, and here alpha^(1/2) is the
  quantity that varies linearly with energy. This weakness is why a silicon
  solar cell needs hundreds of micrometres of material to absorb sunlight
  while a gallium arsenide cell needs a few.

**Excitonic absorption.** An electron and the hole it leaves behind attract
each other and can form a bound pair, an **exciton**, whose energy sits
slightly below the gap. This produces sharp absorption peaks just below the
edge, prominent at low temperature and in materials with low dielectric
screening, and prominent at room temperature in quantum wells and in organic
semiconductors, where binding energies are much larger.

**Free carrier absorption.** Carriers already in a band absorb photons and
move to higher states within the same band. This absorption grows with carrier
concentration and with wavelength (roughly as lambda^2), so it dominates in
the infrared in doped material. It is a loss mechanism in infrared optics and
a useful non-contact measure of carrier density.

**Lattice (reststrahlen) absorption.** In a polar crystal, infrared photons
couple directly to optical phonons, giving intense absorption and reflection
bands at characteristic frequencies. Those frequencies are fingerprints of
bonding, which is what makes infrared spectroscopy a compositional tool: the
Si-H stretching modes in amorphous silicon (module 41) and the Si-O modes in
oxide films are read this way routinely.

**Impurity and defect absorption.** States inside the gap absorb below-gap
photons. These features are weak but diagnostically rich, since their energies
identify specific defect species. Sub-gap absorption in amorphous
semiconductors also produces the **Urbach tail**, an exponential edge whose
width measures the degree of structural disorder, and which module 40 uses as
a quantitative disorder metric.

Read together, one absorption spectrum tells you the bandgap and whether it is
direct, the doping level, the bonding chemistry, the disorder and the defect
content. That is why optical characterization comes before most of the
electrical methods in a materials workflow: it is fast, non-contact, needs no
processing, and it does not damage the sample.
