# Steady-State Photoconductivity and the Methods Built On It

<!-- covers: 23.1, 23.2, 23.3, 23.4 -->

Photoconductivity is the change in a material's conductivity when it is
illuminated. As a device function it gives you photoresistors and detectors.
As a *measurement*, which is what this module is about, it is one of the most
powerful probes available for disordered and thin-film semiconductors, because
it reports on carrier generation, transport and trapping all at once and needs
only two contacts and a light source.

## Steady-state photoconductivity

Illuminate a semiconductor with photons above its bandgap and each absorbed
photon can create an electron-hole pair. Under steady illumination, generation
balances recombination and an excess carrier population builds up. The extra
conductivity is

    delta_sigma = e * (delta_n * mu_n + delta_p * mu_p)

For a generation rate G and a carrier lifetime tau, the steady excess density
is delta_n = G * tau, so

    delta_sigma is proportional to G * mu * tau

The product **mu times tau** is the central figure of merit. It sets how far a
carrier travels per unit field before it recombines, and it determines whether
a photoconductor, a solar cell or an x-ray detector can collect the charge it
generates. Reporting mobility alone or lifetime alone is much less informative
than reporting their product, because it is the product the device sees.

Two features of the measurement carry real information.

**The intensity dependence.** Plot photoconductivity against light intensity
and it usually follows a power law, delta_sigma proportional to G^gamma, with
gamma between 0.5 and 1. The exponent identifies the recombination physics.
A value of 1 indicates monomolecular recombination, where lifetime is
independent of carrier density, typical when a fixed population of
recombination centres dominates. A value of 0.5 indicates bimolecular
recombination, where an electron must find a hole and both densities rise
together. Intermediate values, common in disordered materials, indicate
recombination through an exponential distribution of gap states, and the
exponent then maps to the width of that distribution. Getting gamma is
essentially free once you are measuring at all, and it constrains the model
more than the absolute magnitude does.

**The temperature dependence.** Cooling usually raises photoconductivity as
thermal release from traps slows and the effective lifetime rises, then it can
fall again once carriers freeze into traps and stop contributing. The shape of
that curve maps the distribution of trap depths.

The main practical caution is that photoconductivity is a **contact-dependent**
measurement. Non-ohmic contacts inject or block carriers and can produce
apparent photoconductive gain far above unity or suppress the signal entirely.
Coplanar contacts on a film also measure a path that may be dominated by a
surface layer rather than the bulk. Checking linearity of the dark current
against voltage, and checking that results do not change with contact spacing,
are the standard controls.

A related quantity worth naming is **photoconductive gain**: the number of
carriers passing through the external circuit per absorbed photon. If one
carrier type is trapped while the other circulates repeatedly through ohmic
contacts before recombining, the gain can be far greater than one. This is why
photoconductors can be extremely sensitive, and it is also why they are slow,
since the same long trapping time that gives gain sets the response time. The
gain-bandwidth product is roughly conserved, which is a constraint no amount
of material improvement removes.

## Constant photocurrent methods

Absorption in the sub-bandgap region carries the information about defect
states, and it is far too weak to measure by transmission (module 19). The
constant photocurrent method gets at it by measuring carriers rather than
photons.

The idea is straightforward and clever. Sweep the photon energy across the
sub-gap range and, at each energy, adjust the light intensity so that the
**photocurrent stays constant**. Holding the photocurrent constant holds the
steady-state carrier density constant, which holds the occupation of the trap
distribution constant, which holds mu and tau constant. Everything on the
transport side of the problem is therefore frozen, and the only thing varying
is how many photons it took to keep it there. The required photon flux is
inversely proportional to the absorption coefficient, so the reciprocal of the
flux, plotted against photon energy, traces the absorption spectrum directly.

Why this matters: the method reaches absorption coefficients down to roughly
10^-1 per cm, several orders of magnitude below what transmission through a
one-micrometre film can resolve. That range is exactly where the defect
absorption of hydrogenated amorphous silicon lives, so this became the standard
way to measure the defect density of thin-film silicon (module 41). The
absorption at a chosen sub-gap energy, around 1.2 eV for a-Si:H, is
proportional to the density of dangling-bond states, and a calibration
constant converts it into a defect density per cubic centimetre.

The method also delivers the **Urbach energy**, the exponential slope of the
band tail just below the gap, from the steeper part of the same spectrum. That
slope is the standard quantitative measure of structural disorder in an
amorphous network.

Two caveats keep results honest. The technique measures a product of absorption
and collection, so it assumes that every photon absorbed at every energy
contributes carriers with the same collection efficiency, which is not exactly
true when the absorbing states are very deep. And the conversion from sub-gap
absorption to an absolute defect density relies on a calibration constant
established against another method, usually electron spin resonance, so the
absolute numbers inherit that calibration's uncertainty even though the
relative comparisons are solid.

A closely related variant, **photothermal deflection spectroscopy**, measures
the heat deposited by absorption instead of the carriers, using the deflection
of a probe beam in the heated medium above the sample. Because it does not
require carrier collection at all, it is a useful cross-check: where the two
methods disagree, the discrepancy is telling you about collection rather than
about absorption.

## The steady-state photocarrier grating

Measuring the mobility-lifetime product of the **minority** carrier separately
is difficult in a material where both carriers contribute. The steady-state
photocarrier grating solves it with an interference trick.

Illuminate the sample with two coherent beams that interfere at its surface,
producing a sinusoidal intensity pattern with a period set by the angle between
them. That creates a sinusoidal generation-rate pattern, and therefore a
sinusoidal excess carrier pattern: a grating written in carrier density.

Now the physics that matters. Carriers diffuse from the peaks toward the
troughs, which washes the grating out. How completely they wash it out depends
on how far they diffuse before recombining, which is the **ambipolar diffusion
length**. Compare the photocurrent with the grating present (coherent beams)
against the photocurrent with the same total intensity but no grating (beams
made incoherent), and the ratio gives the grating's amplitude, from which the
diffusion length follows. Repeat at several grating periods and you get the
length without needing to know absolute intensities or absorption coefficients.

The key point is which quantity comes out. Ambipolar transport in a material
where one carrier is much slower is dominated by the **slower** carrier, so
the measured length reports the minority-carrier mobility-lifetime product.
In a-Si:H that is the hole, and the hole mu-tau is what limits solar cell
collection, so this measurement bears directly on device performance. It is
also contactless in principle for the grating part, and it works on films only
a micrometre thick.

Its limits are honest ones: it needs a coherent source and good optical
stability, the analysis assumes small-signal conditions so the grating must not
be so deep that it perturbs the trap occupancy, and surface recombination can
contaminate the result on very thin samples.

## Modulated photocurrent spectroscopy

The methods above are steady state and therefore average over all timescales.
Modulating the light adds frequency as a variable, and frequency resolves
energy.

Illuminate with a small sinusoidally modulated component on top of a steady
bias light, and measure the amplitude and **phase** of the resulting
photocurrent as a function of modulation frequency. Carriers that are trapped
and re-emitted quickly follow the modulation; those trapped in deeper states
are released too slowly and lag behind. The phase shift between light and
current therefore encodes the emission-time distribution of the traps.

Because the thermal emission rate from a trap depends exponentially on its
depth, scanning the modulation frequency scans an energy window through the
gap. Analysis of amplitude and phase against frequency yields the **density of
gap states** as a function of energy, over a range of roughly 0.2 to 0.6 eV
below the conduction band edge in a typical measurement, with the accessible
window shifting with temperature.

What this buys over the constant photocurrent method is energy resolution
rather than just a total. The constant photocurrent method gives an integrated
defect absorption; modulated photocurrent gives a spectrum of state density
against energy, which distinguishes a narrow defect band from a broad
distribution and tracks how the distribution changes under light soaking or
annealing.

The technique demands care. The extracted density of states depends on the
assumed capture cross-sections, on whether the response is dominated by
electrons or holes, and on staying in the small-signal regime where the bias
light fixes the occupation and the modulation only probes it. Practitioners
cross-check against the transient methods of the next lesson, which sample the
same states with a different time structure. Agreement between a frequency
domain method and a time domain method is the usual standard of proof here,
because each has failure modes the other does not share.
