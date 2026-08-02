# Scattering in Semiconductors, Transport Theory, and Real Films

<!-- covers: 18.5, 18.6, 18.7, 18.8 -->

## Scattering mechanisms in semiconductors

A semiconductor has far fewer carriers than a metal, and those carriers are
not degenerate, so the scattering picture is richer. Four mechanisms matter in
practice, and knowing which one dominates tells you what to do about it.

**Acoustic phonon (lattice) scattering.** Carriers scatter off the
long-wavelength vibrations of the lattice. The scattering rate rises with
temperature, and for a simple band the resulting mobility falls roughly as
T^(-3/2). This is the mechanism that limits mobility in a pure, lightly doped
crystal at and above room temperature.

**Ionized impurity scattering.** A charged dopant ion deflects a passing
carrier by Coulomb attraction or repulsion. A slow carrier spends longer in the
ion's field and is deflected more, so *faster* carriers scatter less. Since
carriers get faster as the crystal warms, this mobility contribution *rises*
with temperature, roughly as T^(3/2), the opposite trend from phonons. It also
scales with the ionized impurity concentration.

Put those two together with Matthiessen's rule and you get the characteristic
mobility-versus-temperature curve of a doped semiconductor: rising at low
temperature where impurity scattering dominates, peaking, then falling at high
temperature where phonons take over. The peak moves to higher temperature as
doping increases. This shape is a fingerprint, and measuring it is a standard
way to separate the two contributions.

**Neutral impurity, alloy and carrier-carrier scattering.** Un-ionized
impurities scatter weakly and mostly matter at low temperature. In alloys such
as SiGe or AlGaAs, random arrangement of the constituent atoms scatters
carriers even when the material is chemically perfect: **alloy scattering**
sets a mobility ceiling that purification cannot lift. Carrier-carrier
scattering redistributes momentum within the carrier population; because it
conserves total momentum it does not directly limit conductivity, but it does
matter for how energy is shared.

**Optical phonon scattering.** At higher fields and temperatures carriers can
emit optical phonons, which carry a large fixed quantum of energy. This is a
strongly inelastic process and it is the main brake on carriers at high field
(section 18.10).

Two design consequences follow immediately. First, heavy doping raises carrier
density but lowers mobility, so conductivity does not rise proportionally with
doping and eventually saturates. Second, if you want both high carrier density
and high mobility, you have to physically separate the carriers from the
dopants that supplied them, which is exactly the trick behind the
two-dimensional electron gas in section 18.12.

## The Boltzmann transport picture

Everything above was a relaxation-time argument: assume a single average time
between collisions and turn the crank. The **Boltzmann transport equation** is
the framework that justifies it and shows where it breaks.

The idea is to track a distribution function f(r, k, t): the probability that
a state at position r with crystal momentum hbar*k is occupied at time t. At
equilibrium f is the Fermi-Dirac distribution. Applied fields and temperature
gradients push it away from equilibrium; collisions push it back. The equation
is a bookkeeping statement that those effects must balance in steady state:

    (drift in real space) + (acceleration in k-space) = (collision term)

Solving it in general is hard because the collision term is an integral over
all possible scattering events. The standard simplification is the
**relaxation time approximation**: assume collisions restore equilibrium
exponentially with a single time constant tau, which may depend on carrier
energy. That assumption reproduces sigma = n e mu and gives a principled way to
compute tau for each mechanism, which is where the T^(-3/2) and T^(3/2)
exponents above come from.

What the full framework buys you beyond the simple picture:

- It handles **energy-dependent scattering** correctly, so the mobility is an
  appropriate average over the carrier distribution rather than a single
  number. This is why the Hall mobility and the conductivity mobility differ
  by a numerical factor of order one (section 18.9).
- It treats **thermal transport and thermoelectric effects** in the same
  language, which is the foundation of module 55.
- It shows explicitly when the relaxation-time picture fails: when scattering
  is strongly inelastic (optical phonon emission at high field), when the mean
  free path approaches the device size (ballistic transport), and when the
  field changes faster than tau.

That last point matters more each generation. In a transistor with a channel
tens of nanometres long, a carrier may cross without scattering at all. Drift
and mobility stop being the right description, and the device has to be
modelled ballistically or by direct Monte Carlo simulation of individual
carrier trajectories. Knowing that the diffusive picture has a domain of
validity, rather than treating it as universal, is the useful takeaway.

## Resistivity of thin and polycrystalline films

Bulk resistivity values do not apply to the films actually used in devices,
and the discrepancy has become one of the central problems of modern
interconnect.

Two effects add resistivity to a thin film, and both are geometric rather than
chemical.

**Surface scattering.** When the film thickness approaches the bulk mean free
path (about 40 nm for copper at room temperature), a substantial fraction of
carriers hit a surface before they hit anything else. If a surface scatters
diffusely, that carrier's forward momentum is lost. The resistivity rise
scales roughly with the ratio of mean free path to thickness, so it grows
sharply as films thin.

**Grain boundary scattering.** A polycrystalline film is a mosaic of grains
with disordered boundaries between them. Each boundary partially reflects
carriers. The added resistivity scales with the ratio of mean free path to
grain size and with the reflection coefficient of a boundary. Since deposited
films tend to have grains comparable to their thickness, thinning a film
usually shrinks the grains too, and the two effects compound.

The practical consequence is severe and current. Copper interconnect lines in
advanced logic are now narrower than copper's mean free path, so their
effective resistivity is several times the handbook bulk value and rises as
lines get narrower. Interconnect delay and interconnect power have therefore
been growing while transistors improved, which is why alternative metals with
shorter mean free paths, such as cobalt and ruthenium, are under serious
evaluation despite worse bulk numbers. A material with worse bulk resistivity
can win at 15 nm because it degrades less on the way down. Bulk properties are
the wrong figure of merit for nanoscale conductors.

Thin metal films also have a diffusion barrier and liner around them, which
occupy cross-section without conducting well, further reducing the effective
area. Module 44 covers deposition and microstructure, which is where grain
size is actually decided.

## Effective-medium treatment of inhomogeneous conductors

Many real materials are not uniform. A thick-film resistor is conductive
particles in a glass matrix; a porous film is solid plus void; a composite is
two phases with very different conductivities. You need a way to predict the
conductivity of the mixture from the conductivities and volume fractions of
the constituents.

**Effective medium approximation** does this by treating each inclusion as if
it were embedded in a uniform medium whose conductivity is the unknown
effective value, then requiring self-consistency: the average perturbation
caused by the inclusions must vanish. For a random mixture of two phases, this
yields an implicit equation for the effective conductivity that reduces to
sensible limits at each end.

Two features of the result matter more than the algebra.

**The bounds are far apart.** The same two materials in the same proportions
can have wildly different conductivity depending on geometry. Continuous
parallel paths of the good conductor give a volume-weighted arithmetic
average, the highest possible value. Layers in series across the current give
a harmonic average, the lowest. Real random mixtures fall between, so knowing
composition alone does not determine conductivity. Microstructure does.

**There is a percolation threshold.** In a random mixture of conducting and
insulating particles, conductivity stays near zero until the conducting phase
forms a connected path spanning the sample, then rises steeply. For randomly
packed spheres this happens near 30 percent volume fraction of the conductor,
though the threshold depends strongly on particle shape: high aspect ratio
fillers such as fibres or nanotubes percolate at a few percent or less.

This is directly practical. Conductive adhesives and conductive plastics
(modules 54 and 52) are formulated just above their percolation threshold,
close enough to be economical and far enough to be reliable, because
conductivity near the threshold is steep and therefore sensitive to processing
variation. Thick-film resistor pastes (module 45) get their wide range of
sheet resistances by varying filler fraction across the percolation region.
And a porous or partly oxidized metal film can be far more resistive than its
density suggests, because current has to thread around the voids.
