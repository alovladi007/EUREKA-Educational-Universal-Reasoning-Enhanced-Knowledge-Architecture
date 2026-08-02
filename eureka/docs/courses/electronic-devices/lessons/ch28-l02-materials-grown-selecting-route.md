# Which Materials Are Grown Which Way, and How to Select a Route

<!-- covers: 28.4, 28.5 -->

## Which materials are grown which way

A survey, organized by what forces the choice. The pattern to watch for is that
the growth method is dictated by the material's melting behaviour, the
volatility of its constituents, and how much dislocation the intended device
will tolerate.

**Silicon.** Czochralski for the overwhelming majority, at 300 mm diameter with
450 mm demonstrated but not adopted, because the wafer-cost benefit did not
justify retooling. Float zone for high-resistivity, low-oxygen material used in
power devices and radiation detectors. Silicon is the only semiconductor grown
routinely dislocation-free at large diameter, and module 29 covers it in detail.

**Germanium.** Czochralski, and much easier than silicon in some respects since
it melts lower and is less reactive. Grown for infrared optics, gamma-ray
detectors, which require the highest purity of any semiconductor at around 10^10
impurities per cubic centimetre, and as substrates for multijunction solar cells
because its lattice constant matches gallium arsenide.

**Gallium arsenide.** Liquid encapsulated Czochralski for large diameter and
semi-insulating substrates, vertical gradient freeze for low dislocation
density. Arsenic is volatile, so both methods must contain it, with encapsulant
plus overpressure in the first case and a sealed crucible in the second.
Semi-insulating GaAs is a special case worth knowing: a native defect known as
EL2 pins the Fermi level near midgap, giving resistivities around 10^7 ohm-cm
without any intentional doping. That property is what makes GaAs substrates
usable directly as insulating carriers for microwave circuits, with no need for
an insulating layer.

**Indium phosphide.** Liquid encapsulated Czochralski, with the additional
difficulty that phosphorus is more volatile than arsenic and the material is
mechanically weaker. Substrates remain small and expensive, which is a real
constraint on the fibre-optic component industry that depends on them.

**Silicon carbide.** Physical vapour transport at above 2000 degrees C. Wafers
have grown from 50 to 200 mm over about two decades. The defect that mattered
most was the micropipe, and reducing its density from hundreds per square
centimetre to essentially zero is what enabled commercial power devices. Cost
per unit area remains an order of magnitude above silicon, which is why SiC is
used where its blocking voltage and thermal performance pay for it and nowhere
else.

**Gallium nitride.** The hard case. It has no accessible melt at practical
pressure, so bulk crystals are grown by hydride vapour phase epitaxy on foreign
seeds, by ammonothermal growth in supercritical ammonia which is slow but gives
excellent quality, or from sodium flux. Because bulk substrates are scarce and
costly, most GaN devices are grown heteroepitaxially on sapphire, silicon
carbide or silicon, which leaves dislocation densities of 10^8 per square
centimetre or more. That an LED works at all with that dislocation density is
genuinely surprising and is attributed to carrier localization in the indium
gallium nitride alloy, which keeps carriers away from the dislocations. Module
32 returns to this.

**Sapphire.** Grown by several melt methods including Kyropoulos and edge-
defined film-fed growth. Used as a GaN substrate and as a cover material.

**Mercury cadmium telluride and other II-VI compounds.** Bulk growth is
difficult because of high vapour pressure, a narrow solidification range and
easy twinning. Bridgman variants and travelling heater methods are used, and
much of the practical device material is grown epitaxially on cadmium zinc
telluride substrates instead, which is module 31.

**Quartz.** Hydrothermal, in autoclaves, over weeks to months. The entire
frequency-control industry rests on it.

**Oxides** including lithium niobate, yttrium aluminium garnet and the
perovskites of module 57: Czochralski for the congruently melting ones, flux or
hydrothermal growth otherwise.

## Selecting a growth route

Rather than memorizing the table, the useful skill is the decision sequence.
These questions, in this order, narrow the choice for a new material.

**1. Does it melt congruently at an accessible temperature and pressure?**
If yes, a melt method is preferred, because melt growth is orders of magnitude
faster than solution or vapour growth. If the material decomposes before
melting, or requires impractical pressure, you are in vapour or solution
territory and should expect small crystals, long runs and high cost.

**2. Is any constituent volatile?** If yes, the melt must be contained or
covered: encapsulation with an overpressure, or a sealed crucible. This
immediately rules out simple open Czochralski and float zone.

**3. How much contamination can the application tolerate?** If the answer is
"almost none", the crucible itself becomes the problem and a crucible-free
route such as float zone is required, accepting the diameter penalty. For
detector-grade germanium and high-resistivity silicon, this is the deciding
question.

**4. How dislocation-sensitive is the device?** Lasers degrade at dislocations,
so they need the lowest-stress method available, which is usually gradient
freeze. Digital electronics on silicon needs dislocation-free material, which
necking plus careful thermal design provides. Power devices on silicon carbide
mainly needed micropipes eliminated. LEDs on gallium nitride tolerate
astonishing dislocation densities. Matching the growth investment to the
device's actual sensitivity avoids paying for perfection that does not buy
anything.

**5. What diameter does the economics require?** Chip cost scales with the area
processed per run, so larger wafers are cheaper per device, but only if the
whole process line supports them. This is why 300 mm silicon is standard while
450 mm is not: the physics was demonstrated and the capital cost of requalifying
every tool was not justified by the remaining benefit.

**6. What is the acceptable growth rate?** Silicon grows at millimetres per
minute; silicon carbide at fractions of a millimetre per hour; hydrothermal
quartz at fractions of a millimetre per day. Growth rate translates directly
into substrate price, and substrate price often decides which device
architecture is viable.

A final observation that ties this module to the rest of the course. Growth
controls something no later processing can fix. Dislocations, native defects,
stoichiometry and bulk purity are set when the crystal forms; annealing can
redistribute them and gettering can move contamination around (module 21), but
none of it creates a better crystal than the one that was grown. Everything
downstream, the epitaxy of module 30, the characterization of modules 33 to 36,
and the device performance of modules 37 onward, is bounded by this step. That
is why the growth chapters sit early in the materials half and why a materials
problem that appears at final test surprisingly often turns out to have been
decided in the crystal puller.
