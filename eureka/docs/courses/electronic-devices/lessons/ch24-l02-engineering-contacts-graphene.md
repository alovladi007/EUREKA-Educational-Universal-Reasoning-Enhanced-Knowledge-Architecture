# Engineering the Barrier, Graphene Contacts, and What Interfaces Settle

<!-- covers: 24.4, 24.5, 24.6 -->

## Engineering the Schottky barrier

If the Fermi level is pinned by interface states, and if contact resistance is
one of the binding constraints on modern transistors, then unpinning it is
worth real effort. Several approaches work, each attacking a different part of
the mechanism.

**Heavy doping and tunnelling.** This is the classical answer and it does not
lower the barrier at all; it makes the barrier thin enough to tunnel through.
Doping the semiconductor surface to 10^20 per cubic centimetre or above shrinks
the depletion width to a couple of nanometres, at which point carriers tunnel
rather than going over the top. The contact becomes ohmic in behaviour. Every
source and drain contact in conventional silicon technology works this way,
which is why the doping and activation problems of module 22 are contact
problems as much as channel problems. The limit is solid solubility: you cannot
activate more dopant than the crystal will hold, and that ceiling is now the
binding one.

**Interfacial layers that block the gap states.** Insert an ultrathin
insulator, one or two nanometres of titanium dioxide, zinc oxide, magnesium
oxide or even a nitride, between the metal and the semiconductor. The layer is
thin enough that carriers tunnel through it with modest resistance, and thick
enough that the metal wavefunctions decay before reaching the semiconductor,
so the intrinsic gap states are largely suppressed. Measured slope parameters
rise substantially, and specific contact resistances fall by orders of
magnitude on materials that are otherwise hard to contact, germanium being the
standard demonstration. The engineering tension is obvious: too thin and the
depinning is incomplete, too thick and the tunnel resistance dominates. The
optimum is a narrow window, and reproducing it across a wafer is the real
difficulty.

**Interface dipole layers.** Deposit a monolayer of something that carries a
permanent dipole, an ordered organic layer or a controlled fraction of an
electronegative species such as sulphur or selenium, and the dipole shifts the
potential step across the interface. This shifts the barrier without changing
the density of gap states. It is precise, and it is fragile against subsequent
processing.

**Choosing the reaction product.** Since many metals react with the
semiconductor, the practical approach is to control which compound forms rather
than fight it. Silicide contacts (nickel silicide, titanium silicide, cobalt
silicide) are formed deliberately by depositing a metal and annealing, and each
silicide phase has its own barrier height and its own thermal stability. This
turns an uncontrolled reaction into a designed layer with a known work
function, and it is how silicon contacts have been made for decades.

**Passivating the surface first.** A chemically terminated surface, hydrogen
on silicon, sulphur on gallium arsenide, has fewer unsatisfied bonds, so the
extrinsic contribution to the interface state density falls. This helps most
on materials where defect states, rather than intrinsic gap states, dominate.

**Dopant segregation.** Push dopants to pile up right at the metal-semiconductor
interface during the silicidation anneal, producing an extremely thin, extremely
heavily doped layer exactly where the tunnelling has to happen. This gets
around the bulk solid solubility limit because the pile-up is an interface
phenomenon.

The reason this matters commercially: as transistors shrink, the contact area
shrinks with them, so the same specific contact resistivity produces a larger
series resistance. Contact resistance is now a substantial fraction of the
total resistance of a state-of-the-art transistor, and further scaling depends
on materials solutions at this interface rather than on lithography.

## Graphene contacts to semiconductors

Graphene brings a genuinely different interface physics, and it is worth
understanding why rather than treating it as just another conductor.

Graphene is a semimetal one atom thick, with a linear band structure and a
density of states that goes to zero at the Dirac point. Three consequences
follow for contacts:

**Its work function is tunable.** Because the density of states is low near the
Dirac point, a modest gate field or a modest amount of chemical doping shifts
the Fermi level substantially. Graphene's effective work function can be moved
by several hundred millivolts electrostatically, which means a
graphene-semiconductor Schottky barrier can be *tuned in operation*. That is
not possible with a metal, whose enormous density of states pins its own Fermi
level. Gate-tunable barrier diodes and "barristor" transistors exploit exactly
this.

**It couples weakly, by van der Waals bonding.** Graphene has no dangling bonds
on its basal plane. Transferred onto a semiconductor it bonds by van der Waals
forces without chemical reaction and without disrupting the semiconductor's
surface bonding. The interface state density can therefore be much lower than
for an evaporated metal, and Fermi-level pinning is correspondingly weaker. The
same argument applies to contacts on two-dimensional semiconductors such as the
transition metal dichalcogenides, where evaporating a metal directly damages
the monolayer and transferring a contact does not.

**Its own contact resistance is the problem.** The weak coupling that avoids
pinning also limits how much current can be injected per unit area, because
carriers must transfer from a two-dimensional sheet with limited density of
states into the semiconductor. Edge contacts, where a metal bonds to the
graphene edge rather than its face, and various doping and defect-engineering
schemes are how this is addressed. The result is that graphene contacts have
excellent barrier-tuning properties and a resistance floor that has been slow
to come down.

Practical applications where this has traction: gate-tunable Schottky diodes
and photodetectors, contacts to two-dimensional semiconductors where
conventional metallization destroys the channel, and transparent contacts where
graphene's optical transmission of about 97.7 percent per layer is an advantage.
Module 49 covers graphene as a material in its own right.

## What interface physics settles, and what it does not

Pulling module 24 together.

**Settled.** Fermi-level pinning is real, general, and largely intrinsic: it
arises from metal wavefunctions tailing into the semiconductor gap, not from
dirt. Its strength is predicted by the semiconductor's dielectric screening and
its pinning position by the semiconductor's branch point, both computable from
bulk band structure. The Schottky-Mott rule is a limiting case that applies to
weakly screening ionic materials and essentially never to the covalent
semiconductors that carry the industry.

**Settled in practice.** Ohmic contacts are made by tunnelling through a thin
heavily doped barrier, not by finding a metal with the right work function.
Barrier heights can be shifted usefully by thin interfacial layers, dipole
monolayers, controlled reaction products, and dopant segregation.

**Not settled.** Predicting the barrier of a *specific* metal on a *specific*
semiconductor to better than a couple of tenths of an electron-volt remains out
of reach, because it depends on reaction chemistry, on which crystal faces the
metal grains present, on strain, and on process history. Lateral inhomogeneity
of real barriers is ubiquitous and is the reason different measurement methods
disagree on the same sample. And the contact resistance requirements of the
next few device generations are not yet met by any known combination.

Three habits follow from this for anyone working with contacts:

1. **Never trust a barrier height without its measurement method.**
   Current-voltage fitting reports the lowest patch; capacitance reports
   something nearer the average; photoemission reports the chemistry-weighted
   value at the surface it can see. Disagreement is information, not error.
2. **Treat the contact as a material, not as a boundary condition.** The
   interface has a composition, a phase, a morphology and a thermal history,
   and all four are measurable with the tools of modules 33 and 34.
3. **Expect the contact to be the limit.** In modules 46 through 52, covering
   flexible electronics, organic and molecular devices, two-dimensional
   materials and nanotubes, the reported device performance is very often
   limited by contact resistance rather than by the channel material. Reading a
   claimed mobility without asking how the contacts were made and subtracted is
   the single most common way to be misled in that literature.
