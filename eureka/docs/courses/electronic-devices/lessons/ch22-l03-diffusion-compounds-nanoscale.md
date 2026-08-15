# Diffusion in Compound Semiconductors and at the Nanoscale

<!-- covers: 22.8, 22.9, 22.10 -->

Silicon's diffusion story has one sublattice and a defect population the
process engineer mostly inherits. This lesson removes both simplifications.
In a compound semiconductor the native defect population is a knob the
furnace ambient turns, and in a nanoscale volume the bulk description fails
in five distinct ways at once. Both facts restructure how doping is done.

**Level.** Sections 1 and 2 undergraduate core with graduate passages
flagged; section 3 core for anyone touching a modern process; section 4
problems.

## 1. Diffusion in III-V compounds

A compound has two sublattices, and that single fact makes diffusion
qualitatively harder than in silicon. Gallium arsenide has gallium sites and
arsenic sites, each with its own vacancies and interstitials, and the two
defect populations are not free parameters: they are pinned to the **group V
overpressure** through the equilibrium between the crystal and the vapour.
Write the exchange with arsenic vapour (predominantly As₄) as

$$
\tfrac{1}{4}\,\mathrm{As_4(g)} \;\rightleftharpoons\;
\mathrm{As_{As}} + V_{\mathrm{Ga}},
$$

adding one lattice pair's worth of arsenic requires creating a gallium
vacancy alongside it. Mass action applied to this reaction, with the solid's
site fractions near unity, gives

$$
[V_{\mathrm{Ga}}] = K(T)\,p_{\mathrm{As_4}}^{1/4},
\qquad
[V_{\mathrm{As}}] = \frac{K'(T)}{p_{\mathrm{As_4}}^{1/4}},
$$

the second following from the first because the vacancy populations on the
two sublattices are linked by the fixed crystal stoichiometry (their product
is a constant at fixed temperature, the Schottky analogue of module 21's
mass-action seesaw).

![Sublattice vacancy populations computed from the stated quarter-power mass-action relations: raising the arsenic overpressure manufactures gallium vacancies and consumes arsenic vacancies, so the anneal ambient selects which diffusion vehicle exists.](/courses/electronic-devices/figures/m22-gaas-ambient.svg)

The consequence is operational, not academic: the same anneal at the same
temperature produces different dopant diffusion under different ambients,
because dopant diffusion is mediated by whichever vacancy the ambient is
manufacturing. Reproducible III-V annealing therefore always controls the
group V partial pressure, by a dielectric cap, by proximity capping against a
sacrificial wafer, or by an explicit arsenic or phosphorus ambient. An
uncapped GaAs anneal in flowing nitrogen is not a process; it is a
stoichiometry experiment.

**The dopants split by sublattice.** Silicon is amphoteric in GaAs: a donor
on a gallium site, an acceptor on an arsenic site. Which site it takes
depends on stoichiometry and on doping level, and at high concentration the
crystal pushes new silicon onto the compensating site, so the free carrier
concentration saturates well below the atomic concentration. This is
thermodynamic self-compensation, a limit no purity improvement removes.
Carbon, the modern p-dopant for HBT bases, is prized for the opposite
property this lesson keeps meeting: it barely diffuses, so a base doped to
$10^{19}$ cm⁻³ stays thin through every subsequent step.

**Zinc, the classic cautionary tale (graduate core).** Zinc diffuses by the
dissociative route: a fast interstitial donor form Zn$_i^+$ and a slow
substitutional acceptor form Zn$_s^-$ interconvert via gallium vacancies.
Working through the mass action of the interconversion with the Fermi level
set by the zinc itself yields an effective diffusivity rising roughly as the
square of the local concentration,

$$
D_{\mathrm{eff}}(C) \approx D_s\left(\frac{C}{C_s}\right)^{2},
$$

and a nonlinear diffusion equation whose solution abandons the erfc shape
for a profile that stays near the surface concentration and then falls off a
cliff:

![Profile computed by explicit finite differences from the stated concentration-dependent diffusion equation with D proportional to C squared, against a constant-D erfc matched at half depth: the nonlinearity turns the gentle error function into an advancing wall.](/courses/electronic-devices/figures/m22-zinc-front.svg)

The front is steep because the diffusivity dies with the concentration:
material ahead of the front cannot diffuse until the concentration arrives,
and then it diffuses fast. Two process consequences: junction placement is
set almost entirely by the front position, which is good for abruptness, and
the front position is exquisitely sensitive to the surface concentration,
which is bad for control.

### Worked example 1.1 - the front's sensitivity to the source

For $D \propto C^2$ diffusion from a constant surface source, the front
depth scales as $x_f \sim \sqrt{D_{\mathrm{eff}}(C_s)\,t} \propto
C_s\sqrt{t}$. A vapour-source fluctuation that raises the surface
concentration 20 percent therefore moves the front 20 percent deeper at
fixed time, where an erfc process would move a depth contour only through
the logarithm-weak dependence of lesson 1. If the junction budget allows 5
percent depth variation, the zinc source must hold $C_s$ to 5 percent, a
vapour-pressure control problem, which is why zinc diffusions ran in sealed
ampoules and why carbon replaced zinc wherever thinness mattered more than
conductance.

**Impurity-induced layer disordering (graduate note).** Diffusing zinc or
silicon through a quantum-well stack drags the host atoms into motion: the
point defects that carry the dopant also carry group III interdiffusion, so
the wells and barriers intermix and the local bandgap rises. Used on
purpose, this writes transparent windows and lateral waveguides into laser
material with no etching. Uninvited, the same physics is the ceiling on
every III-V thermal budget: **an abrupt heterointerface is a kinetic
achievement, not an equilibrium state**, and every subsequent hot step
spends some of it.

## 2. Diffusion in II-VI compounds

The II-VI compounds are more ionic and more weakly bonded than the III-Vs,
and everything about their diffusion follows from the resulting mobility.

**Stoichiometry is doping.** In mercury cadmium telluride, the infrared
detector workhorse (module 31), mercury is bound so weakly that mercury
vacancies, which are acceptors, dominate the native defect population. Their
concentration obeys the same vapour mass action as section 1:

$$
[V_{\mathrm{Hg}}] \propto \frac{1}{p_{\mathrm{Hg}}},
$$

so annealing under high mercury overpressure fills vacancies and yields
n-type material, and annealing mercury-poor creates them and yields p-type.
The anneal ambient is not a background condition; it is the doping step.
Type conversion of a finished layer by a low-temperature mercury anneal is
routine detector-factory practice, and it has no silicon analogue at all.

**Everything interdiffuses.** The same mobility that lets stoichiometry
equilibrate lets a CdTe/HgTe superlattice intermix at temperatures barely
above room ambient on device timescales. II-VI processing budgets are
correspondingly tiny, and long-term compositional stability is a design
input, not an assumption.

**Self-compensation closed a whole industry road (graduate core).** Dope a
wide-gap II-VI heavily p-type and the crystal responds by generating
compensating native donors: the wider the gap, the more energy the crystal
recovers by re-trapping the hole, until defect generation is spontaneous.
The free-energy bookkeeping per compensating defect,

$$
\Delta G \approx E_{\mathrm{form}} - E_{\mathrm{gap\ recovery}},
$$

turns negative for gaps above roughly the formation cost of the cheap native
donor, and no growth cleverness changes the sign. Zinc selenide blue
emitters foundered on exactly this. Gallium nitride succeeded not because
nitrides evade the thermodynamics but because magnesium acceptors turned out
to be hydrogen-passivated rather than compensated, and hydrogen can be
driven off (lesson 2, section 3): the announcement that a 700 °C anneal
activates p-GaN is, in this module's language, the discovery that the
compensation was kinetic, not thermodynamic. Module 32 continues that story.

**The doping-asymmetry rule of thumb.** Stepping back from the specific
compounds, a pattern worth carrying: nearly every semiconductor is easier
to dope one way than the other, and the hard direction is set by which
compensating native defect is cheap. Wide-gap II-VIs resist p-doping
because native donors are cheap; GaAs resists degenerate n-doping with
silicon because the amphoteric flip is cheap; germanium's n-plus problem
(lesson 2) is fast vacancy-mediated donor diffusion plus low solubility;
even silicon shows a soft version, with n-plus arsenic clustering at
lower concentration than boron's limits. When a datasheet lists a
material's record electron and hole concentrations and they differ by
three orders of magnitude, this module's mass-action bookkeeping is
usually the reason, and the question to ask is not "what dopant" but
"which native defect is undercutting it, and what ambient or kinetic
trick starves that defect". The GaN-magnesium story is the canonical
existence proof that the trick is sometimes there to be found.

## 3. Diffusion in nanoscale volumes

When the diffusion length or the doped volume becomes comparable to the
device dimension, the bulk description fails in five ways, each with a name
and a countermeasure.

**Surfaces take over transport.** A nanowire or fin has a large fraction of
its atoms within a bond or two of a boundary, where barriers differ and
surface diffusion typically runs orders of magnitude faster than bulk. Most
contaminant motion in a fin is along it, not through it.

**Boundaries drain the defect reservoir.** A free surface annihilates
excess point defects. The interstitial supersaturation that drives TED
therefore decays with a time constant set by diffusion to the nearest sink;
for a body of thickness $L$ with absorbing boundaries the slowest mode
decays as

$$
\tau \approx \frac{L^2}{\pi^2 D_I},
$$

so thin bodies lose their TED almost immediately. Helpful, but it also
means a diffusion recipe calibrated on planar wafers does not transfer to a
fin, and every geometry change reopens calibration.

### Worked example 3.1 - TED lifetime in a fin versus a wafer

Take a self-interstitial diffusivity of $D_I = 10^{-7}$ cm²/s at anneal
temperature (representative magnitude for silicon interstitials near
1000 °C). In a 10 nm fin, $L = 10^{-6}$ cm:

$$
\tau \approx \frac{(10^{-6})^2}{\pi^2\times10^{-7}}
\approx 1\times10^{-6}\ \mathrm{s},
$$

a microsecond. In bulk, the nearest sink is the wafer surface at, say, 100
nm from the damage: $\tau \approx (10^{-5})^2/(\pi^2\times10^{-7}) \approx
10^{-4}$ s, and with damage-stabilized clusters feeding the supersaturation
the observed decay stretches to seconds. The fin's TED is over before the
temperature stabilizes; the wafer's TED does its damage during the ramp.
Same implant, same anneal, different physics, purely from geometry.

**Doping becomes a rumour.** Dopant number in a volume $V$ at concentration
$C$ is Poisson-distributed with mean $N = CV$ and spread $\sqrt{N}$:

$$
\frac{\sigma_N}{N} = \frac{1}{\sqrt{N}}.
$$

![Mean dopant count computed as N = C L cubed at a concentration of 1e18 per cubic centimetre, with the Poisson band plus or minus root N: below about 30 nanometres the count is small and its fluctuation is a large fraction of itself.](/courses/electronic-devices/figures/m22-dopant-count.svg)

### Worked example 3.2 - counting the dopants in a channel

A 20 nm cube at $C = 10^{18}$ cm⁻³ contains
$N = 10^{18}\times(2\times10^{-6})^3 = 8$ dopants, with spread
$\sqrt{8} = 2.8$, a 35 percent fluctuation, and device-to-device threshold
scatter to match. The industry's answer was architectural, not
metrological: fully depleted SOI, finFETs and gate-all-around nanosheets
all run essentially undoped channels whose electrostatics come from
geometry, retiring channel doping precisely because its statistics could
not be engineered away.

**Interfaces out-compete solubility.** In a small volume there is always an
interface nearby, and for many dopants the interface is the energetically
preferred address: boron piles up at the silicon-oxide interface, dopants
segregate to grain boundaries in polysilicon, and the resulting profiles
owe more to segregation than to the implant. Deliberate **dopant
segregation layers** at metal-semiconductor contacts exploit the same
physics to thin the Schottky barrier.

**Grain boundaries are highways.** In polycrystalline films, boundary
diffusion runs many orders faster than lattice diffusion, giving the
two-slope profile of a shallow lattice component plus a deep boundary tail
(the Le Claire regime-B analysis assigns the tail a
$\ln C \propto -x^{6/5}$ shape, the form the figure uses):

![Penetration profile computed as the stated lattice erfc plus a boundary tail of the Le Claire form: on semilog axes the two mechanisms separate into two slopes, and the deep tail belongs to the boundaries.](/courses/electronic-devices/figures/m22-grain-boundary-tail.svg)

This is the mechanism behind copper penetration of inadequate barrier
layers in interconnect: a barrier defeats it by being amorphous, or by
stuffing its boundaries with a segregant, not by being thick. Two further
nanoscale effects earn a mention: **stress-modified diffusion**, since
strain shifts formation and migration energies (module 38's strained
channels diffuse differently relaxed), and **size-depressed melting**,
which lets nanoparticle pastes sinter at temperatures where bulk metal
would not move (module 54).

The uncomfortable summary: a bulk-calibrated diffusivity is an upper-bound
estimate for a nanostructure, not a prediction, and at advanced nodes the
re-calibration of diffusion models against the actual geometry is a
first-class line item in technology development cost.

## 4. Problems

**P22.13** From the two mass-action relations of section 1, show that the
product $[V_{\mathrm{Ga}}][V_{\mathrm{As}}]$ is independent of arsenic
pressure, and name the module 21 result this mirrors.

**P22.14** A GaAs anneal is run twice, once capped with nitride and once
under high As₄ overpressure. A gallium-vacancy-mediated dopant diffused
twice as deep in the second run. Estimate the effective overpressure ratio
between the runs.

**P22.15** For the zinc model $D \propto C^2$, show that the profile's
half-depth advances as $C_s\sqrt{t}$ and compute the depth change when the
ampoule temperature error raises $C_s$ by 10 percent while $t$ is held.

**P22.16** HgCdTe: a layer anneals to n-type at high mercury pressure and
p-type at low. Using the stated $[V_{\mathrm{Hg}}] \propto 1/p_{\mathrm{Hg}}$
relation, explain which carrier each condition produces and why the
crossover pressure shifts with temperature.

**P22.17** Recompute worked example 3.1 for a 5 nm nanosheet and for a 50 nm
fin, and state the qualitative TED behaviour of each.

**P22.18** A 14 nm-node engineer proposes reusing a planar-calibrated TED
model, arguing the implant and anneal are identical. Give the two distinct
nanoscale reasons this fails, with the relevant equations.

### Answers

**A22.13** Multiply: $[V_{\mathrm{Ga}}][V_{\mathrm{As}}] = K K'$, the
pressure exponents $+1/4$ and $-1/4$ cancelling. This is a Schottky-pair
mass action: enriching one sublattice's vacancies depletes the other's,
mirroring module 21's $C_VC_I = C_V^{eq}C_I^{eq}$ seesaw for vacancies and
interstitials in silicon.

**A22.14** Depth doubled at fixed time means $D$ rose 4-fold (depth
$\propto \sqrt{Dt}$). With $D \propto [V_{\mathrm{Ga}}] \propto p^{1/4}$,
a 4-fold $D$ needs $p$ larger by $4^4 = 256$. The quarter power is the
lesson: enormous ambient changes make modest diffusion changes, so an
uncontrolled factor-of-few pressure drift is survivable, but "capped" versus
"open tube" spans orders of magnitude and is not.

**A22.15** With the front at concentration near $C_s$,
$x_f \sim \sqrt{D_{\mathrm{eff}}(C_s)t} = \sqrt{D_s t}\,(C_s/C_s^{ref})$
for the stated scaling, linear in $C_s$. A 10 percent $C_s$ rise moves the
front 10 percent deeper: a percent-for-percent transfer, with none of the
logarithmic protection an erfc junction enjoys.

**A22.16** Mercury vacancies are acceptors. Low $p_{\mathrm{Hg}}$: many
vacancies, acceptors dominate, p-type. High $p_{\mathrm{Hg}}$: vacancies
filled, residual donors win, n-type. The crossover sits where vacancy
acceptors balance the background donors; since $[V_{\mathrm{Hg}}]$ at fixed
pressure rises steeply with temperature (its formation is thermally
activated), holding the crossover requires more mercury pressure at higher
temperature, which is why anneal recipes quote a pressure-temperature line,
not a pressure.

**A22.17** 5 nm: $\tau = (5\times10^{-7})^2/(\pi^2\times10^{-7}) =
2.5\times10^{-7}$ s; TED is extinguished essentially instantly, and implant
damage anneals to the surfaces before moving anything. 50 nm:
$\tau = (5\times10^{-6})^2/(\pi^2\times10^{-7}) = 2.5\times10^{-5}$ s,
still far below wafer-scale seconds: even a generous fin suppresses most of
the transient. The regime boundary is wherever $\tau$ crosses the ramp
time.

**A22.18** First, sink proximity: $\tau \approx L^2/\pi^2D_I$ collapses the
interstitial supersaturation orders of magnitude faster in a fin, so the
enhancement time-integral the planar model encodes is wrong (worked example
3.1). Second, segregation: with interfaces nanometres away, the boundary
condition, pile-up or depletion at the oxide and at the gate stack,
dominates the final profile, and the planar model's bulk solution never
sees it. Same implant, same anneal, different $\int D_{\mathrm{eff}}dt$
and different boundary conditions: both halves of the diffusion problem
changed.
