# Bulk Crystal Growth: Why Single Crystals, and How the Methods Arose

<!-- covers: 28.1, 28.2, 28.3 -->

## Why single crystals, and what growth must control

Almost every semiconductor device is built on a single crystal, and it is worth
being explicit about why, because the answer is not obvious and the cost is
enormous.

**Grain boundaries are electrically active.** A boundary between two
misoriented grains is a plane of unsatisfied and strained bonds. It creates
states in the gap that trap carriers and act as recombination centres, it
scatters carriers and lowers mobility (module 18), and it is a fast diffusion
path for dopants and contaminants (module 22). A transistor whose channel
contains a grain boundary behaves differently from one that does not, which in
a billion-transistor chip means unacceptable variability.

**Reproducibility requires a defined orientation.** Etch rates, oxidation
rates, carrier mobility, piezoresistance and cleavage all depend on
crystallographic direction. A polycrystalline substrate would present a random
orientation to every device.

**Minority carrier lifetime is exquisitely sensitive.** Solar cells and bipolar
devices depend on carriers diffusing tens or hundreds of micrometres before
recombining. Any structural or chemical defect shortens that, and the
sensitivity is such that a contamination level of 10^11 atoms per cubic
centimetre, which is one part in 10^12, matters.

So a growth process must simultaneously control four things:

1. **Crystallinity.** One grain, nucleated from a seed, with dislocation
   density near zero for silicon and low for compounds.
2. **Purity.** Unintentional impurities below the level where they affect
   carrier lifetime, which is far below the level where they affect doping.
3. **Doping.** The intended dopant at the intended concentration, uniform along
   and across the crystal despite segregation (module 22).
4. **Stoichiometry**, in a compound: the ratio of the constituents must be
   right, and the native defects that result from getting it wrong control the
   electrical properties (module 22).

Two further constraints are economic rather than physical, and they drive the
technology as hard as the physics does: the crystal should be as large in
diameter as possible, since chip cost scales with wafer area processed, and the
growth should be as fast as possible without losing control of the first four.
Every technique below is a particular compromise among those six.

## How the main growth methods emerged

The history is worth a paragraph because each method was invented to solve a
specific problem, and knowing the problem tells you when to use the method.

Pulling a crystal from a melt on a rotating seed was developed early in the
twentieth century as a way to measure crystallization rates in metals, then
adapted decades later to germanium and silicon for transistors. Adding a
**seed** of known orientation, and adding a **necking** step where the crystal
is deliberately pulled thin at the start, turned it from a laboratory curiosity
into a manufacturing process. Necking matters more than it sounds: the thermal
shock of contacting the melt generates dislocations in the seed, and pulling
through a narrow neck lets them glide out to the surface, so the crystal grows
on beyond the neck dislocation-free. That trick is why silicon boules are
dislocation-free at all.

**Float-zone** growth arose from the need for purity beyond what a crucible
allows. Any container contaminates the melt it holds; a quartz crucible
dissolves and delivers oxygen to silicon at around 10^18 atoms per cubic
centimetre. Holding the melt by surface tension alone, with no container, gives
the cleanest silicon available, at the cost of being limited in diameter by
what surface tension can support.

**Bridgman and gradient-freeze** methods, where the melt is contained in a
crucible and solidified progressively by moving the crucible or the temperature
profile, were developed for materials that are harder to pull: compounds with
volatile constituents, materials that wet and stick to the crucible, and
materials whose low thermal conductivity makes pulling unstable.

**Vapour growth** methods emerged for materials that decompose before melting,
or that melt at temperatures and pressures no equipment can hold. Silicon
carbide and aluminium nitride are grown by sublimation and recondensation for
exactly this reason, and gallium nitride bulk crystals remain difficult because
neither melt nor simple vapour routes work well.

**Solution growth**, including growth from a flux and hydrothermal growth under
pressure, allows crystallization far below the melting point. It is slow, and
it is the only route for some materials, notably quartz for oscillators and
several oxides.

The pattern across the history is that the container, the volatility of a
constituent and the melting behaviour are what determine which method is
possible. Everything else is optimization.

## Melt, solution and vapour growth techniques

A working taxonomy, with what each one buys and costs.

**Czochralski (CZ).** A seed is dipped into a melt held in a crucible and
slowly withdrawn while rotating, and the crystal grows at the meniscus.
Diameter is controlled by pull rate and heater power through a feedback loop
that usually watches the meniscus optically. Advantages: large diameter, high
throughput, no contact with the crucible wall so no wall-induced stress, and
the ability to see and control the process. Disadvantages: the melt touches the
crucible, so contamination is inevitable; convection in a large melt is
unsteady and writes striations into the crystal (module 22); and materials with
a volatile constituent lose it from the free melt surface.

Variants exist for the volatility problem. **Liquid encapsulated Czochralski**
floats a layer of molten boric oxide on the melt to suppress evaporation, with
an inert overpressure above it, and is the standard route for gallium arsenide
and indium phosphide. **Magnetic Czochralski** applies a magnetic field to damp
convection in the conducting melt, reducing striations and reducing oxygen
transport from the crucible.

**Float zone (FZ).** A molten zone is held between two solid rods by surface
tension and passed along, usually heated by a radio-frequency coil. Because
there is no crucible, oxygen and metallic contamination are the lowest of any
method, and the repeated passage of a zone also purifies by segregation
(module 22). Disadvantages: diameter is limited by the surface tension that
must hold the zone, the feed rod must itself be a reasonably good rod, and the
process is less economic at large diameter. FZ silicon is therefore used where
purity and high resistivity matter, particularly in power devices and detectors,
while CZ dominates in volume.

**Bridgman and vertical gradient freeze.** The charge is melted in a crucible
and solidified directionally by translating the crucible through a temperature
gradient, or by moving the gradient with no mechanical motion at all, which is
what "gradient freeze" means. Advantages: mechanically quiet, low thermal
stress, so low dislocation density in materials that are prone to it, and
easily contained volatile constituents. Disadvantages: the crystal contacts the
crucible wall, so it can stick, nucleate spuriously, or take up impurities, and
the growth is not visible.

For compound semiconductors this trade matters a great deal. Gallium arsenide
grown by gradient freeze has dislocation densities one to two orders of
magnitude below liquid encapsulated Czochralski material, because the thermal
stresses are so much lower, and that is why substrates for lasers and other
dislocation-sensitive devices are typically gradient-freeze material.

**Sublimation and physical vapour transport.** The source material sublimes at
high temperature and recondenses on a cooler seed. This is how silicon carbide
boules are grown, at temperatures above 2000 degrees C, and it is why silicon
carbide wafers are small, slow to produce and expensive relative to silicon.
Defect control, particularly of the micropipe defects that are hollow cores of
screw dislocations, was the main barrier to commercializing silicon carbide
power devices and took roughly two decades to solve.

**Solution and flux growth.** Crystallization from a solvent below the melting
point. Hydrothermal growth of quartz in an alkaline solution under high
pressure supplies the entire oscillator industry. Flux growth is used for oxides
and for some nitrides where nothing else works. The characteristic drawback is
slowness, sometimes months per crystal, and possible incorporation of the
solvent.

**Skull melting and cold crucible techniques**, where the melt is contained by
a solidified shell of its own material, exist for materials that attack every
available crucible.

The next lesson takes silicon specifically, since it is the most refined of
these processes and the one whose details matter most.
