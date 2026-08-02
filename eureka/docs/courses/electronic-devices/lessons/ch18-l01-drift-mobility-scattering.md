# Drift, Mobility and Why Resistivity Depends on Temperature

<!-- covers: 18.1, 18.2, 18.3, 18.4 -->

Ohm's law is an experimental summary, not an explanation. This lesson replaces
it with a mechanism: charge carriers accelerate in a field, get scattered,
and the balance between the two fixes the conductivity. Everything about
resistivity in metals, alloys and semiconductors follows from asking what does
the scattering.

## Drift velocity, mobility and conductivity

Carriers in a solid are never still. At room temperature an electron in a
semiconductor moves at a thermal speed on the order of 10^5 m/s, in a random
direction that changes at every collision. That random motion carries no net
current, because the average velocity is zero.

Apply an electric field E and a small bias is added to the randomness. Between
collisions the electron accelerates along the field; at each collision its
momentum is largely randomized again. The net result is a small **drift
velocity** superimposed on the large random speed:

    v_d = mu * E

The proportionality constant mu is the **drift mobility**, in m^2/(V s). It is
worth internalizing the scale: drift velocity in a normal circuit is on the
order of millimetres per second, thousands of times *slower* than the thermal
motion and slower than a garden snail. Current flows fast because the whole
carrier sea shifts at once, not because individual carriers are quick.

If there are n carriers per unit volume, each of charge e, the current density
is

    J = n e v_d = n e mu E

and comparing with J = sigma E gives the central result of this module:

    sigma = n e mu

Conductivity is carrier density times mobility. That factorization is the
organizing idea for everything that follows, because the two factors are
controlled by completely different physics. Carrier density is set by doping
and temperature. Mobility is set by scattering. A material can be a poor
conductor because it has few carriers or because those carriers are scattered
constantly, and the two cases behave nothing alike.

Mobility itself comes from the mean time between scattering events, usually
written tau:

    mu = e * tau / m*

where m* is the effective mass, the mass an electron appears to have once the
periodic potential of the lattice is folded into its motion. Effective mass is
a band-structure property and can be much smaller than the free electron mass,
which is one reason some semiconductors are so much faster than others.

Two related quantities are worth keeping straight. The **mean free path** is
the average distance between collisions, roughly the thermal speed times tau,
typically tens of nanometres in a good conductor at room temperature. The
**mean free time** tau is the average time. When you shrink a film or a wire
below the mean free path, the boundaries themselves start doing the
scattering, which is section 18.7.

## Adding independent scattering rates

Real carriers are scattered by several mechanisms at once: lattice vibrations,
impurity atoms, grain boundaries, other carriers, surfaces. Each mechanism has
its own characteristic time. If the mechanisms are independent, then the
*rates* add rather than the times:

    1/tau_total = 1/tau_1 + 1/tau_2 + ...

Since resistivity is inversely proportional to tau, this becomes an additive
rule in resistivity, which is the form you will actually use:

    rho_total = rho_1 + rho_2 + ...

This is **Matthiessen's rule**. It says that the resistivity contributions of
independent scattering mechanisms simply add. It is enormously useful and it
is an approximation. It fails when the mechanisms are not independent, for
instance when an impurity distorts the lattice enough to change how phonons
scatter nearby, and it fails when the scattering is strongly anisotropic. In
practice it is accurate enough that deviations from it are themselves used as
evidence that something more interesting is going on.

The practical consequence: the *dominant* scattering mechanism controls the
resistivity, because the largest term dominates a sum. If lattice scattering
contributes 20 nano-ohm-metres and impurity scattering 2, cleaning up the
impurities buys you 10 percent. This is why the right question about a
conductor is always "what limits it here", not "how pure is it".

## Why the resistivity of a metal rises with temperature

In a metal the carrier density n is fixed. Every atom contributes its valence
electrons to the conduction band regardless of temperature, so all the
temperature dependence of resistivity lives in the mobility, which means in
the scattering.

The dominant scatterer in a reasonably pure metal at ordinary temperatures is
the **lattice vibration**, or phonon. Heat the metal and the atoms vibrate
with larger amplitude, presenting a larger effective target to a passing
electron. The scattering rate goes up, tau falls, mobility falls, and
resistivity rises. Above roughly one third of the Debye temperature the
vibrational energy is proportional to T, the scattering cross-section is
proportional to the mean square displacement which is proportional to T, and
so resistivity is close to linear in temperature. That linearity is why
platinum resistance thermometers work and why the temperature coefficient of
resistance for common metals sits near 0.004 per degree C.

At low temperature the phonons freeze out and the linear term collapses, but
the resistivity does not go to zero. It flattens onto a **residual
resistivity** set by impurities and structural defects, which do not care about
temperature. Matthiessen's rule shows this cleanly:

    rho(T) = rho_residual + rho_phonon(T)

The ratio of resistivity at room temperature to residual resistivity, the
residual resistance ratio, is a standard purity figure of merit for metals: a
high ratio means the phonon term dominates, which means very little else is in
the way.

Note the contrast with semiconductors, which have the opposite behaviour for a
different reason. There the carrier density n rises steeply with temperature
as more carriers are thermally excited across the gap or off dopant atoms, and
that increase overwhelms the falling mobility. Metals get worse when hot
because of mobility; semiconductors get better when hot because of carrier
density. Same equation, different dominant factor.

## Alloy resistivity and the concentration rule

Add a solute atom to a metal and it disturbs the periodic potential in two
ways: it has a different core charge, and it usually has a different size, so
it strains the lattice around it. Both scatter electrons. The result is that
even small alloying additions raise resistivity substantially, and they do so
in a way that is largely temperature-independent, adding to the residual term.

For a solid solution the added resistivity follows a characteristic parabolic
dependence on composition:

    rho_alloy = C * x * (1 - x)

where x is the atomic fraction of solute and C is a constant for the pair of
metals. This is **Nordheim's rule**. The shape makes physical sense. At x = 0
there is no disorder because every site is the host atom, and at x = 1 there
is again no disorder because every site is the solute atom, so a perfectly
ordered pure crystal sits at each end. Maximum disorder, and therefore maximum
scattering, occurs near the middle of the composition range.

Three consequences worth carrying forward:

- **Resistance alloys are deliberately near 50/50.** Constantan (roughly
  copper and nickel in equal parts) and nichrome are chosen at compositions
  where the Nordheim term is large and where its temperature dependence nearly
  cancels the phonon term, giving a resistor whose value hardly drifts with
  temperature. That is a designed use of disorder.
- **Conductors must be kept pure.** Copper interconnect and busbar are
  specified to very high purity precisely because Nordheim scattering is
  brutal at small concentrations: a fraction of a percent of a soluble
  impurity can cost several percent of conductivity.
- **The constant C is large when the atoms are dissimilar.** Solutes that
  differ strongly in valence or in size scatter harder, so the resistivity
  penalty per atomic percent varies by an order of magnitude across pairs.

Nordheim's rule applies to a genuine solid solution, where solute atoms sit
randomly on lattice sites. If the alloy instead forms an ordered compound or
separates into two phases, the disorder falls and resistivity drops, sometimes
sharply. Heat treatment can therefore change the resistivity of a fixed
composition, which is a useful diagnostic and an occasional nasty surprise in
manufacturing.
