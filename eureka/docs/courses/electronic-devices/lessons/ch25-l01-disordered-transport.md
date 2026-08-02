# Charge Transport in Disordered Materials

<!-- covers: 25.1, 25.2, 25.3, 25.4 -->

## What disorder does to transport

Module 18 built transport on a crystal: periodic potential, Bloch waves,
extended states, occasional scattering. Remove the periodicity and that
foundation goes with it. Amorphous silicon, chalcogenide glasses, organic
semiconductors, polycrystalline oxides and conducting polymers all conduct, but
none of them conducts the way a crystal does, and the differences are not
small corrections.

Two kinds of disorder matter, and they are worth separating.

**Structural (topological) disorder** means bond lengths and angles vary, and
the long-range order is gone. Short-range order usually survives: in amorphous
silicon each atom still has close to four neighbours at close to the tetrahedral
angle. That is why an amorphous semiconductor still has a bandgap at all. The
gap is a consequence of local bonding, not of periodicity.

**Compositional disorder** means the chemical identity of sites varies
randomly, as in an alloy, or the local environment varies, as in a doped
polymer.

What disorder does to the electronic structure is specific and consequential:

**Band edges become tails.** In a crystal the density of states drops abruptly
to zero at the band edge. Disorder smears it into an exponentially decaying
**band tail** reaching into the gap. The characteristic decay energy, the
**Urbach energy**, is the standard quantitative measure of disorder: roughly 50
meV for the valence tail of device-grade a-Si:H, larger for worse material.

**States become localized.** This is the central idea. A state in a disordered
potential can be either **extended**, spread over the whole sample, or
**localized**, confined to a region of a few nanometres with an exponentially
decaying envelope. Anderson showed that sufficiently strong disorder localizes
states outright. In practice the tail states are localized and the states deeper
in the band are extended, and the energy separating them is the **mobility
edge**.

The mobility edge is the organizing concept of this module. It is not a gap in
the density of states: there are plenty of states on both sides. It is a
boundary in *character*. A carrier above the mobility edge can move by
propagating; a carrier below it must hop. The conductivity therefore has a step
at that energy even though the density of states is continuous, which is why it
is called a mobility gap rather than a bandgap in disordered materials, and why
the two are not the same number.

**Deep defect states.** In addition to tails, coordination defects create
states near the middle of the gap. In amorphous silicon these are dangling
bonds. They are efficient recombination centres and they pin the Fermi level,
which is why unhydrogenated amorphous silicon cannot be doped: adding a donor
just moves charge into the defect band instead of into the conduction band.
Hydrogen passivation (module 22) removes most of them and is what makes the
material usable.

## Transport through extended states

If the Fermi level can be pushed close enough to the mobility edge, either by
doping or by a gate field or by illumination, carriers occupy extended states
above it and transport looks superficially conventional.

The conductivity then has the activated form

    sigma = sigma_0 * exp(-(E_C - E_F) / kT)

where E_C is the mobility edge. The activation energy is the distance from the
Fermi level to the mobility edge, and measuring it is the standard way to
locate the Fermi level in an amorphous film. Plotting log(sigma) against 1/T
gives a straight line whose slope is that distance and whose intercept is the
prefactor.

Three features distinguish this from crystalline transport.

**Mobility is low.** Even above the mobility edge, the mean free path is
comparable to the interatomic spacing, so the semiclassical picture of module
18 is at its limit. Extended-state mobilities in a-Si:H are around 10 cm^2/(V s)
rather than the 1400 of crystalline silicon. That is not a defect density
problem; it is what disorder costs.

**The measured drift mobility is much lower still**, typically 1 cm^2/(V s) for
electrons and 0.01 or less for holes in a-Si:H. The reason is **multiple
trapping**: a carrier spends most of its time immobile in a tail state, waiting
to be thermally released back above the mobility edge, where it moves briefly
before being trapped again. The observed mobility is the extended-state
mobility multiplied by the fraction of time spent free. Since that fraction is
thermally activated, the drift mobility is strongly temperature dependent in a
way that a crystalline mobility is not.

**Transport is dispersive.** Because the release time from a tail state depends
exponentially on its depth and the tail is exponential in energy, the
distribution of release times is extremely broad, spanning many decades. A
packet of carriers therefore does not travel as a packet; it spreads faster
than it drifts. This is exactly the dispersive time-of-flight signature of
module 23: no plateau, two power-law regimes, and a transit time that depends
on sample thickness in a way a normal mobility never would.

The practical consequence for devices: in an amorphous silicon thin-film
transistor, the gate field pushes the Fermi level up toward the conduction band
mobility edge, and the field-effect mobility rises steeply with gate voltage as
the tail states fill and a larger fraction of the induced charge becomes mobile.
A field-effect mobility quoted without the gate voltage at which it was measured
is not a well-defined number. Module 46 returns to this.

## Hopping transport in localized states

When the Fermi level sits deep in the gap, in a region where all states are
localized, activation to the mobility edge is too expensive and a different
mechanism takes over: carriers tunnel directly between localized states,
absorbing or emitting a phonon to make up the energy difference. This is
**phonon-assisted hopping**.

The rate for a single hop depends on two factors that pull in opposite
directions:

- **Distance.** Tunnelling probability falls exponentially with the separation
  between sites, as exp(-2R/a) where a is the localization radius.
- **Energy.** The hop needs a phonon of the right energy, and the probability
  of finding one falls as exp(-dE/kT) for an upward hop.

At relatively high temperature, phonons are plentiful and energy is cheap, so
carriers hop to their **nearest neighbour** regardless of energy mismatch.
Conductivity is then simply activated with an energy set by the typical
neighbour spacing in energy, giving a straight line on a log(sigma) against 1/T
plot.

At low temperature, phonons of the required energy become scarce and the energy
term dominates. It then pays to tunnel *further* to reach a site that is closer
in energy. The carrier optimizes the trade-off, and the optimum hop distance
grows as the temperature falls. Carrying the optimization through gives Mott's
**variable range hopping** law:

    sigma = sigma_0 * exp(-(T_0/T)^(1/4))

in three dimensions, with exponent 1/3 in two dimensions. The characteristic
temperature T_0 depends on the localization radius and on the density of states
at the Fermi level, so fitting the law gives access to both.

The T^(-1/4) signature is the standard experimental evidence for hopping. In
practice you plot log(sigma) against T^(-1/4) and look for a straight line over
a decent temperature range. A caution that is worth internalizing: over a
narrow temperature range, T^(-1/4), T^(-1/3), T^(-1/2) and simple activation are
all nearly straight, and picking between them from a limited data set is not
justified. Claims of variable range hopping should span at least a decade in
temperature.

A variant, **Efros-Shklovskii hopping**, gives exponent 1/2 and appears when
Coulomb interaction between localized carriers opens a soft gap in the density
of states at the Fermi level. It typically takes over from Mott behaviour at
the lowest temperatures.

In organic semiconductors and molecular solids the same physics appears with
different vocabulary. Carriers hop between molecules, and the barrier is
dominated by the **reorganization energy**, the energy cost of the molecular
geometry relaxing after charge arrives. Marcus theory describes the rate. The
practical rules are familiar though: mobility rises with temperature (the
opposite of a crystal), rises with carrier concentration as deeper states fill,
and depends on field. Reported organic mobilities therefore vary by orders of
magnitude depending on measurement conditions, which is why comparing them
across papers requires care.

## Reading transport data from a disordered film

A short field guide, since the diagnostic skill is what this module is for.

**Plot log(sigma) against 1/T first.** A straight line over a wide range
indicates activated transport, and the slope gives the activation energy, which
is the Fermi level's distance from the mobility edge. A curve that flattens at
low temperature indicates a crossover to hopping.

**If it curves, try the hopping plots.** log(sigma) against T^(-1/4) straight
over a decade indicates Mott variable range hopping; T^(-1/2) suggests the
Coulomb-gap variant. Insist on range before believing either.

**Check the prefactor.** For genuine extended-state transport the prefactor
sigma_0 should be of order 10^2 to 10^3 siemens per centimetre. A fitted
prefactor many orders of magnitude away from that is a strong hint that the
model is wrong, or that the sample is inhomogeneous and you are fitting a
mixture of two mechanisms.

**Watch for the Meyer-Neldel rule** (module 22). In a series of samples of the
same material prepared differently, the prefactor and activation energy will
usually be correlated. That correlation is real physics in some cases and a
fitting artefact in others, and distinguishing them requires checking the
error correlation of the fit.

**Expect the mobility to depend on everything.** In a disordered material,
mobility depends on temperature, on carrier density, on field and, in
dispersive transport, on sample thickness and transit time. A single number is
not a material property. Always record the conditions.

**Distinguish bulk from interface.** In a thin film with contacts, the
measurement may be dominated by contact barriers (module 24) or by a surface
accumulation layer rather than by the bulk. Varying contact spacing and film
thickness is how you find out.

The larger point is that disorder does not merely degrade crystalline
behaviour; it substitutes a different mechanism with different laws. Materials
in modules 40, 41, 46 and 52 are all in this regime, and their device physics
is unintelligible without it.
