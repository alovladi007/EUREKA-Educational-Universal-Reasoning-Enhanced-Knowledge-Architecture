# Amorphous and Microcrystalline Silicon: Plasma Chemistry, Growth and Defects

<!-- covers: 41.1, 41.2, 41.3 -->

Hydrogenated amorphous silicon is deposited from a silane plasma, and almost
every property of the resulting film traces back to what happens in that plasma
and at the growing surface. This module follows that chain.

## Chemistry of silane plasmas

The standard process is **plasma-enhanced chemical vapour deposition**: silane
gas, often diluted in hydrogen, flows between two electrodes at a pressure of
around 0.1 to 1 torr, with radio-frequency power at 13.56 MHz sustaining a glow
discharge. The substrate sits at 150 to 300 degrees C, far below what thermal
CVD of silicon would require, and that low temperature is the entire point: it
allows deposition on glass, on steel foil and on polymer.

**Why a plasma is needed.** Silane does not decompose usefully at 250 degrees C.
In the plasma, energetic electrons, which reach effective temperatures of tens
of thousands of kelvin while the gas stays near the substrate temperature,
collide with silane and break it apart. The substrate never sees that energy.
A plasma is therefore a way to get high-temperature chemistry at a
low-temperature surface, which is the general reason plasma processes exist.

**What the electrons make.** Electron impact on silane produces a mixture of
radicals and ions. The dominant neutral radicals are SiH3, SiH2 and SiH, plus
atomic hydrogen, and their relative proportions depend on the electron energy
distribution and therefore on power, pressure and excitation frequency.

The distinction that matters most for film quality is between them:

- **SiH3 is the good precursor.** It has a low sticking probability, so it
  bounces along the growing surface many times before finding a favourable site.
  That mobility is what allows a well-ordered network to form at a temperature
  where the surface atoms themselves cannot rearrange. Films grown under
  conditions where SiH3 dominates have the lowest defect densities.
- **SiH2 and SiH are the bad precursors.** They are highly reactive, stick where
  they land, and insert into surface bonds indiscriminately, producing a
  disordered, void-rich, strained network with clustered hydrogen. Films grown
  under high-power conditions where these dominate are poor.

The practical rule that follows is counterintuitive and important: **more power
is worse**. Increasing radio-frequency power raises the deposition rate and
degrades the film, because it shifts the radical population toward the reactive
species and it increases ion bombardment energy. Device-grade amorphous silicon
is grown slowly, at a few angstroms per second, and the trade between rate and
quality has been the central process tension in this technology for forty years.

**Higher excitation frequency**, in the very-high-frequency range around 40 to
100 MHz, partly escapes this trade. Raising the frequency lowers the sheath
voltage and therefore the ion bombardment energy, while sustaining the discharge
more efficiently, so deposition rate can be raised without the usual quality
penalty. This became the standard route to faster deposition, particularly for
microcrystalline material.

**Powder formation** is the other plasma problem. Silane plasmas polymerize:
radicals react in the gas phase to form larger silicon-hydride clusters that
grow into nanoparticles, which then contaminate the film and the chamber. Powder
formation worsens with pressure, power and silane concentration, and it is
suppressed by hydrogen dilution, by pulsed excitation, and by reactor design
that limits residence time.

**Hydrogen dilution** is the single most important process knob. Adding large
amounts of hydrogen to the silane feed does several things at once: it reduces
the silane partial pressure and hence the radical density, it suppresses powder,
and it supplies atomic hydrogen to the growing surface. At high enough dilution
the film transitions from amorphous to **microcrystalline**, and the dilution
ratio at which that happens is the primary control over crystalline fraction.

## Film growth at the surface

Once a radical reaches the surface, several processes compete, and the balance
sets the network quality.

**Surface diffusion.** An SiH3 radical adsorbs, diffuses across the
hydrogen-terminated surface, and eventually finds a dangling bond to which it
can bond. Longer diffusion means better site selection and a better-ordered
network. Diffusion length rises with substrate temperature, which is why films
grown below about 150 degrees C are poor and why there is a lower limit to how
cold a good film can be grown.

**Hydrogen abstraction and coverage.** Atomic hydrogen from the plasma removes
surface hydrogen, creating the dangling bonds that incoming radicals attach to.
It also etches weakly bonded and strained material preferentially. That selective
etching is the key to the microcrystalline transition: under high hydrogen
dilution, disordered material is etched away faster than it deposits, while
ordered crystalline nuclei survive and grow. The film crystallizes not because
crystallization is favoured thermodynamically at that temperature but because the
amorphous phase is being selectively removed.

**Ion bombardment.** Ions accelerated across the plasma sheath strike the growing
film. Modest energies help by supplying local mobility; higher energies create
defects and voids. Controlling sheath voltage, through pressure, frequency and
electrode configuration, is therefore a quality control.

**Subsurface hydrogen.** Hydrogen diffuses a few atomic layers into the growing
film and relaxes the network from within, which is part of why hydrogen content
of 5 to 15 atomic percent is optimal. More hydrogen than that produces clustered
SiH2 configurations, voids and poor stability.

The resulting **growth regimes** as hydrogen dilution increases at fixed other
conditions:

1. **Amorphous**, at low dilution. Device-grade a-Si:H for solar cell absorbers
   and thin-film transistors.
2. **Protocrystalline or edge-of-transition**, just below the onset of
   crystallinity. This material is amorphous but grown at the edge, and it has
   measurably better light stability than material grown well inside the
   amorphous regime. It is a standard choice for the top cell of a tandem.
3. **Mixed phase**, with crystallites in an amorphous matrix.
4. **Microcrystalline (nanocrystalline)**, at high dilution, with a crystalline
   fraction typically 50 to 70 percent, conical grains growing upward from an
   amorphous incubation layer at the substrate.

That **incubation layer** is a practical nuisance worth knowing: crystallites
take some thickness to nucleate, so the first tens of nanometres are amorphous
regardless of the intended phase. In a thin device layer that can be a
substantial fraction of the total, so seed layers and dilution profiling are
used to shorten it.

## Measuring defect density

Because defect density is the property that determines whether a film is
device-grade, several independent measurements exist and using more than one is
standard practice.

**Electron spin resonance** counts unpaired electrons, which in this material
means neutral dangling bonds. It is the most direct measurement and it is the
calibration reference for the others. Its limitation is that it counts only
neutral, paramagnetic defects, so charged dangling bonds in doped material are
invisible to it, and it needs a relatively large sample.

**Constant photocurrent method** (module 23), measuring the sub-gap absorption
at around 1.2 eV and converting to defect density with a calibration constant
established against ESR. It works on device-thickness films on any substrate and
it is the routine method.

**Photothermal deflection spectroscopy**, measuring the same sub-gap absorption
through the heat deposited rather than through carriers. Comparing it with CPM
separates absorption from collection, since the two agree only if every absorbed
photon generates a collected carrier.

**Space-charge-limited current** measurement (module 26), giving trap density
from the current-voltage characteristic of a sandwich structure.

**Photoconductivity ratio**, the ratio of illuminated to dark conductivity, which
is not a defect density but correlates strongly with it and takes minutes rather
than hours. It is the standard fast screen.

**Time-of-flight and photocarrier grating** (module 23) for the
mobility-lifetime products, which is what the device actually cares about.

For **microcrystalline** material the picture is more complicated, and it is
worth flagging because a naive measurement misleads. The defects are at grain
boundaries as well as in the amorphous tissue, oxygen contamination from air
exposure through the porous grain boundary network raises the conductivity and
acts as unintentional n-type doping, and the material is inhomogeneous through
its thickness because of the incubation layer and the conical grain growth. A
single number for "the defect density" of a microcrystalline film is therefore
less meaningful than for an amorphous one, and characterization has to include
the crystalline fraction from Raman and the structure from cross-sectional
microscopy (module 33).

The general standard of evidence in this field: report defect density from at
least two independent methods, report the hydrogen content and bonding
configuration from infrared, report the crystalline fraction from Raman if the
material is anywhere near the transition, and report all of it after light
soaking as well as as-deposited.
