# Diffusion in the Melt, the Meyer-Neldel Rule, and What Diffusion Explains

<!-- covers: 22.11, 22.12, 22.13, 22.14 -->

## Diffusion in the melt

Crystal growth (modules 28 to 32) is a transport problem before it is a
crystallography problem, and the transport happens in liquid.

Diffusivities in a melt are five to six orders of magnitude larger than in the
corresponding solid, typically around 10^-8 m^2/s, because there is no lattice
to hop through. That sounds like it should make everything uniform, and it does
not, for one reason: **segregation**.

When a crystal solidifies, most solutes are not equally soluble in the solid
and the liquid. The **segregation coefficient** k is the ratio of the
concentration incorporated into the solid to that in the liquid at the
interface. For most dopants in silicon k is well below 1, meaning the growing
crystal rejects solute back into the melt. Boron is the notable near-unity
exception, at about 0.8, which is one practical reason boron is the standard
p-type dopant for bulk-grown silicon: the crystal comes out much more uniform
along its length.

Two consequences follow, one along the crystal and one across it.

**Axial segregation.** As growth proceeds, rejected solute accumulates in the
shrinking melt, so its concentration rises, and so does the concentration
entering the crystal. A Czochralski crystal grown from a fixed charge is
therefore more heavily doped at its tail than at its seed end, following a
predictable curve. Wafer resistivity is specified as a range partly because of
this. Continuous or recharged melt growth exists specifically to flatten it.

**The boundary layer, and why stirring matters.** Rejected solute has to
diffuse away from the interface into the bulk melt. Convection and crystal
rotation stir the melt but cannot penetrate the last thin film of liquid at
the interface, so a diffusion boundary layer forms, in which solute is
enriched. The **effective** segregation coefficient therefore lies between the
equilibrium k and 1, depending on growth rate and stirring: grow fast or stir
weakly and the boundary layer thickens, the interface liquid is more enriched,
and more solute is incorporated. This is why growth rate and rotation are
specified as tightly as temperature.

Unsteady convection makes this worse in a specific, visible way. Buoyancy-driven
flow in the melt is turbulent and oscillatory, so the boundary layer thickness
fluctuates, and the incorporation fluctuates with it. Since the crystal is
rotating, the record of those fluctuations is written into the crystal as
**striations**, fine concentric bands of varying dopant concentration. They are
revealed by preferential etching or by spreading resistance and they are a
direct read-out of melt hydrodynamics. Suppressing them was one of the main
motivations for applying magnetic fields to the melt, since a field damps
convection in a conducting liquid, giving magnetically-confined Czochralski
growth.

**Zone refining** turns segregation into a purification tool. Pass a molten
zone slowly along an ingot; solutes with k below 1 are swept along with the
zone, concentrating at the far end. Repeat and the impurity concentration in
the middle falls geometrically. Float-zone silicon (module 29) is purified this
way and reaches the lowest impurity levels of any bulk material, with the added
benefit that the melt never touches a crucible and so picks up no oxygen.

## The Meyer-Neldel compensation rule

Here is an empirical regularity that shows up across an unreasonable range of
thermally activated processes, and it is worth knowing both because it is
useful and because it is easy to over-interpret.

Take a family of related processes, for example the same dopant diffusing in a
series of related alloys, or conduction in a set of amorphous films made under
different conditions. Each follows an Arrhenius law with its own prefactor D0
and activation energy Ea. The rule is that within such a family, the logarithm
of the prefactor varies **linearly** with the activation energy:

    ln(D0) = ln(D00) + Ea / E_MN

where E_MN is a characteristic energy for the family. The practical consequence
is that a higher barrier comes with a larger prefactor, so the two partly
cancel. This is the "compensation" in the name.

A striking corollary: substituting the rule into the Arrhenius expression shows
that all members of the family have the same rate at one particular
temperature, the **isokinetic temperature**, where the exponential and
prefactor effects exactly offset. Plot the Arrhenius lines of a family and they
converge on a single point.

Where it shows up: dopant diffusion series, conduction in amorphous and organic
semiconductors, thermally stimulated defect reactions, chemical reaction
kinetics, and viscosity of glasses. The usual physical explanation is
**entropy compensation**. A process with a higher energy barrier typically
requires a more specific configuration of the surrounding atoms, or the
cooperation of more of them, and that raises the activation entropy, which
appears in the prefactor. In systems where a large barrier must be assembled
from many small excitations, the number of ways to assemble it grows
exponentially with the barrier, which yields the observed form directly.

Two honest cautions. First, an apparent Meyer-Neldel line can be produced
artificially when D0 and Ea are extracted from a fit over a narrow temperature
range, because the two fit parameters are strongly correlated and their errors
lie along exactly this direction. Any claimed compensation rule should be
checked against the fitting-error correlation before it is believed. Second,
the rule is empirical. It organizes data and suggests that a family shares a
mechanism; it does not by itself identify the mechanism.

## What the diffusion picture explains

Pulling module 22 together, diffusion is the reason for a surprising number of
apparently unrelated facts in this course.

- **Junction depth scales as the square root of thermal budget**, so device
  scaling forced anneals from hours to milliseconds and eventually toward
  non-equilibrium activation.
- **Diffusivity is not a material constant.** It depends on point-defect
  populations, which depend on Fermi level, on oxidation or nitridation, on
  implantation damage, on the ambient overpressure in a compound, and on
  strain. A process step aimed at one thing routinely moves dopants somewhere
  else.
- **The chemical profile and the electrical profile differ**, and their
  difference is the inactive fraction. Two independent measurements are
  required to see it.
- **Trace metals matter at concentrations far below dopant levels**, because
  they move interstitially and create deep recombination centres. Gettering,
  whether by internal oxygen precipitates or by phosphorus diffusion, is a
  designed defect sink.
- **Hydrogen passivates everything and does not stay put**, which makes it
  simultaneously the reason amorphous silicon works, the reason MOS interfaces
  are quiet, and a leading suspect in long-term threshold drift.
- **Compound semiconductors need ambient control** because their native defect
  populations, and hence their doping and interdiffusion, are set by the group
  V or group VI partial pressure.
- **Heterostructure abruptness is metastable.** Every interface in this course
  is a kinetically frozen state that a sufficient thermal budget will erase.
- **Growth uniformity is melt hydrodynamics.** Segregation plus a fluctuating
  boundary layer writes the flow pattern of the melt into the dopant profile of
  the crystal.
- **Electromigration and stress migration are diffusion under load**, and they
  set interconnect lifetime.

The unifying idea is that a device is not a static structure. It is a
configuration of atoms held in place by the fact that, at operating
temperature, they move slowly. Every reliability specification is, underneath,
a statement about a diffusion coefficient.

## Where to read further on diffusion

For continuing study, these are the directions that repay effort, listed by
what they add rather than by title:

- **A standard semiconductor process text** for the classical
  error-function and Gaussian solutions worked through with real recipes, and
  for the coupled diffusion equations used in process simulation.
- **Process simulation tools** (the TCAD family) which solve the coupled
  dopant and point-defect equations numerically. Working through a simulated
  implant and anneal, then comparing against a measured SIMS profile, teaches
  more about transient enhanced diffusion than any derivation.
- **The point-defect literature in silicon**, which connects module 21 and
  this module: the same vacancy and interstitial populations that decide void
  and loop formation decide dopant diffusivity.
- **Compound semiconductor processing references** for ambient-controlled
  annealing, amphoteric doping and impurity-induced disordering.
- **The reliability literature** on negative bias temperature instability,
  hot-carrier degradation and electromigration, which is where diffusion
  physics turns into product lifetime.

Within this course, module 34 covers how the profiles are measured, module 36
how the electrical consequences are measured, modules 28 to 32 the growth in
which melt diffusion operates, and module 41 the hydrogenated amorphous
material whose entire existence depends on the passivation chemistry described
here.
