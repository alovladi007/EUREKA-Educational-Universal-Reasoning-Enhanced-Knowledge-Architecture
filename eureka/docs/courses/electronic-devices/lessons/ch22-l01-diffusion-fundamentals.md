# Diffusion: Fick's Laws, Mechanisms, Regimes and Fields

<!-- covers: 22.1, 22.2, 22.3, 22.4 -->

Every doped region in every device was put there by moving atoms through a
crystal, and every one of those regions has been slowly moving ever since.
Diffusion is how dopants are placed, how junctions blur during subsequent
processing, and how devices eventually fail. This module treats it properly.

## Fick's laws and the diffusion coefficient

Diffusion is the net migration of atoms down a concentration gradient, driven
by nothing more than random thermal motion plus statistics: if there are more
atoms on the left than the right, more will randomly step right than left.

**Fick's first law** states the flux:

    J = -D * dC/dx

The flux J is proportional to the concentration gradient, and the constant D
is the **diffusion coefficient** or diffusivity, in m^2/s. The minus sign says
flux runs downhill.

**Fick's second law** follows from conservation of atoms and gives how the
profile evolves:

    dC/dt = D * d2C/dx2

Two standard solutions cover most of practical processing.

For a **constant surface concentration** (a wafer held in an atmosphere that
keeps the surface saturated, the classical predeposition step) the profile is
a complementary error function, and the total dose grows with the square root
of time.

For a **fixed dose** placed at the surface and then driven in (the drive-in
step, and the usual case after ion implantation) the profile is a Gaussian
that spreads and flattens while conserving its integral.

In both cases the characteristic depth is

    x = sqrt(D * t)

which is the single most useful number in the subject. Doubling the depth
costs four times the time. This square-root behaviour is why deep junctions are
expensive and why the thermal budget, meaning the accumulated product of
diffusivity and time over the whole process, is tracked as a resource.

The temperature dependence is Arrhenius:

    D = D0 * exp(-Ea / kT)

with activation energies typically 3 to 5 eV for substitutional dopants in
silicon. That exponential is steep: raising the temperature by 50 degrees C
near 1000 degrees C can roughly double the diffusivity. This is what makes
diffusion controllable, because you can effectively switch it off by cooling,
and it is also what makes it dangerous, because a small furnace error becomes a
large dose error.

## Atomic mechanisms of diffusion

The macroscopic D hides an atomic-scale question: how does an atom actually
move? The mechanism determines the activation energy, the concentration
dependence and the response to the point defects of module 21.

**Vacancy mechanism.** A substitutional atom moves by swapping with an
adjacent vacancy. It requires a vacancy to be next door, so the diffusivity is
proportional to the vacancy concentration. This is the dominant route for most
substitutional dopants in most crystals, and it is why diffusion couples
directly to the point-defect population.

**Interstitial mechanism.** A small atom sits between lattice sites and hops
from one interstitial site to the next without needing a vacancy. Because it
needs no defect and the barriers are low, this is extremely fast. Hydrogen,
lithium, copper, nickel and iron move this way in silicon, which is why trace
transition metals are so damaging: they can traverse a whole wafer at modest
temperatures and decorate every junction on the way.

**Interstitialcy (kick-out) mechanism.** A self-interstitial displaces a
substitutional dopant atom into an interstitial position; the dopant then
migrates and eventually kicks a lattice atom out to take its place. The dopant
alternates between substitutional and interstitial forms. Boron and phosphorus
in silicon diffuse substantially by this route, which is why their diffusion
is so sensitive to the interstitial supersaturation created by ion implantation
damage or by oxidation.

**Dissociative (Frank-Turnbull) mechanism.** A fast interstitial species and a
slow substitutional species interconvert via vacancies. Gold in silicon and
zinc in gallium arsenide behave this way, producing profiles that no single
constant D can fit.

The practical consequence: the diffusivity of a dopant is **not a material
constant**. It depends on the local point-defect population, which depends on
what else the process is doing. Oxidation injects interstitials into silicon
and speeds up boron and phosphorus, the classic oxidation-enhanced diffusion.
Nitridation injects vacancies and does the opposite. A furnace step intended
to grow an oxide also moves every junction on the wafer.

## Intrinsic, extrinsic and transient regimes

Textbook Fickian diffusion with a constant D is one regime among several, and
knowing which one you are in is most of the skill.

**Intrinsic regime.** The dopant concentration is below the intrinsic carrier
concentration at the diffusion temperature, so the dopant does not perturb the
Fermi level, the charged point-defect populations are unaffected, and D is
genuinely constant. The classical error-function and Gaussian solutions apply.

**Extrinsic regime.** The dopant concentration exceeds the intrinsic carrier
concentration, which at 1000 degrees C in silicon is around 10^19 per cubic
centimetre. Now the dopant sets the Fermi level. Because point defects are
charged, their equilibrium concentrations depend on Fermi level, so heavy
doping changes the vacancy and interstitial populations, which changes D. The
result is a **concentration-dependent diffusivity** and profiles that look
nothing like a Gaussian: phosphorus at high concentration produces the
characteristic kink-and-tail shape, with a flat plateau, an abrupt kink and a
deep tail moving far faster than the plateau. Fitting such a profile with a
constant D produces nonsense.

**Transient enhanced diffusion.** After ion implantation, the crystal is left
with a large excess of self-interstitials from the displacement damage. During
the first seconds of the subsequent anneal, those interstitials drive dopant
diffusion at rates orders of magnitude above equilibrium, before they
annihilate and the rate collapses back. Boron can move further in the first
ten seconds of an anneal than in the following hour. This effect, more than
any other, is why junction depths stopped scaling as easily as lithography and
why **rapid thermal annealing** with fast ramps, then spike anneals with
essentially no soak, then millisecond laser and flash anneals, were each
adopted in turn. The goal in every case is to activate the dopant, meaning to
put it on a lattice site where it donates a carrier, while giving the transient
interstitials no time to move it.

**Solid solubility and clustering.** Above the solid solubility limit, excess
dopant precipitates or forms electrically inactive clusters. You can implant
more atoms than the crystal can hold in solution, and the surplus contributes
no carriers while still scattering the ones you have. This is why sheet
resistance stops falling as implant dose rises, and it is measured by comparing
a chemical profile from secondary ion mass spectrometry against an electrical
profile from spreading resistance or from Hall measurement. The two differ by
exactly the inactive fraction, which is a good example of why module 34 and
module 36 are used together rather than either alone.

## Built-in fields and field-assisted diffusion

Fick's laws describe neutral particles. Dopants in a semiconductor are
ionized, and that changes the picture in a way that is easy to overlook.

Consider a donor diffusing into a wafer. The donors are essentially immobile on
the timescale of electron motion; the electrons they release are highly
mobile. The electrons diffuse ahead of the donor front, leaving a slight
positive charge behind and creating a **built-in electric field** at the
diffusion front. That field then pulls the ionized donors forward.

The effect is bounded and calculable. Because the field arises from the
dopant's own gradient, it enhances diffusion by a factor between 1 and 2 for
singly ionized dopants, the upper limit reached in the fully extrinsic case.
It is not enormous, but it is systematic, and it makes the leading edge of a
profile steeper than pure Fickian diffusion predicts. Since junction depth is
defined by where the profile crosses the background doping, a factor near 2 at
the leading edge is not a detail.

Fields from other sources matter more in specific situations:

- **Applied bias during operation.** Mobile ionic contamination, sodium in
  particular, drifts under the field in a gate dielectric. This was the defect
  that nearly killed the MOS transistor in the 1960s, producing threshold
  voltages that drifted with bias and temperature, and it is why alkali
  cleanliness in fabrication is still policed obsessively. It reappears as
  bias-temperature instability testing.
- **Fields at heterojunctions and at surfaces.** Band bending near an
  interface produces a local field that segregates charged dopants toward or
  away from the interface. Boron segregating into a growing oxide, which
  depletes the silicon underneath, is the standard example and has to be
  compensated in the implant recipe.
- **Electromigration**, the drift of metal atoms driven by momentum transfer
  from a high current density. This is diffusion under an applied force in a
  metal rather than a semiconductor, and it is the dominant wear-out mechanism
  of interconnect. It appears again in module 54.

The general principle: whenever the diffusing species carries charge and the
material carries a field, the flux has a drift term as well as a diffusion
term, exactly as carrier transport did in module 18. The equation is the same
drift-diffusion equation; only the mobile species has changed.
