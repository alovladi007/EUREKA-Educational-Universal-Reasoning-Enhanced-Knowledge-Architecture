# Voids, Loops and the OSF Ring: the Aggregates Up Close

<!-- covers: 21.3, 21.4 -->

Lesson 4 delivered a population census; this lesson meets the citizens.
Each aggregate family — the vacancy's octahedral void, the interstitial's
dislocation loop, and the oxidation-induced stacking fault that decorates
the boundary between their territories — has its own structure, its own
energetics, its own detection chemistry and its own way of killing a
device. Knowing them individually is what turns lesson 3's map from a
diagram into a diagnostic instrument.

**Level.** Sections 1 to 4 undergraduate core; section 5 graduate;
section 6 problems.

## 1. The void: an octahedral absence

Vacancies condense into cavities bounded by the crystal's cheapest
surfaces — {111} planes — giving octahedra (often truncated, often twinned
into double voids) of 50–200 nm, their inner walls lined with the few-
nanometre oxide lesson 4's heterogeneous story predicted. Densities run
$10^{5}$–$10^{7}$ cm⁻³ in standard vacancy-rich material: rare enough
that a random micrograph shows none, common enough that every device on a
die sits within tens of micrometres of one.

Detection defines the aliases (lesson 1's audit rule in action). On the
polished surface, a truncated void is a pit: the **COP** of particle
scanners. In the bulk, infrared laser scattering tomography counts them
without contact. Etched in copper-decorating or Secco-type chemistries,
they seed **flow-pattern defects** — the historical name from the etch
figure's teardrop. One physical object, four assay names, four different
size floors: the module's data book tabulates the conversions, and any
uncontexted "defect density" should trigger the by-now-reflexive
question, *measured how?*

Device charge sheet, sharpened from lesson 1: the void's oxide-thinning
attack scales with the ratio of void size to gate-oxide thickness, which
is why the COP crisis peaked in the thick-oxide era and why modern
thin-oxide logic — built on epi or annealed or perfect substrates anyway
— retired the problem by substrate choice rather than by solving it.

## 2. The loop: interstitials pay rent in strain

Excess interstitials cannot dig cavities; they are *extra* matter. Their
condensate is a disc of inserted crystal plane — an **extrinsic
dislocation loop**, bounded by a dislocation line, historically surfacing
as the **A-swirl** (large loops) and **B-swirl** (their small precursors)
etch patterns. The energetics explain both their existence and their
menace. A loop of radius $R$ storing $N \propto R^2$ interstitials costs
elastic energy $\propto R\ln R$ (the dislocation line), so the energy
*per stored interstitial* falls as the loop grows:

$$
\frac{E}{N} \propto \frac{\ln R}{R},
$$

![Stored energy per interstitial against loop radius: each additional atom is cheaper than the last, so loops grow without bound while the supply lasts.](/courses/electronic-devices/figures/m21-loop-strain.svg)

an ever-cheaper landfill that never saturates — unlike the void, whose
surface-to-volume economics are self-limiting. Hence the asymmetry of
fates: vacancy material's voids are numerous and nanoscopic;
interstitial material's loops are sparse and can reach *micrometres*.
The device consequence follows the size: a micrometre-scale dislocation
threading a junction is a recombination highway and a metal-precipitation
wick (module 23's lifetime physics), lethal to bipolar gain, image-sensor
dark current and any junction's leakage floor. Loop material is
accordingly unsellable for most products — one reason the industry's
default regime sits on the vacancy side, where the failure mode is at
least small, countable and skinnable.

### Worked example 2.1 — why loops dwarf voids

A crystal freezes $3\times10^{13}$ cm⁻³ interstitials, which condense
into loops of areal atom density $1.5\times10^{15}$ cm⁻² (one {111}
plane). For a loop density of $10^{4}$ cm⁻³, each loop stores
$3\times10^{9}$ atoms, so its area is

$$
A = \frac{3\times10^{9}}{1.5\times10^{15}} = 2\times10^{-6}\ {\rm cm^2}
\;\Rightarrow\; R = \sqrt{A/\pi} \approx 8\ {\rm \mu m}.
$$

The same defect budget that made 100 nm voids (lesson 4's worked
example) makes *eight-micrometre* loops, because a two-dimensional
condensate spends its atoms on area, not volume. Dimensionality, not
chemistry, sets the scale gap — and the 8 µm answer is exactly the size
class that etches as A-swirl and murders junctions.

## 3. The OSF ring: a growth condition made visible

The **oxidation-induced stacking fault** is a hybrid: it needs a seed
*and* a push. The seeds are the modest oxide precipitates that form in
the band of mild vacancy excess flanking lesson 3's critical contour.
The push is device processing itself: thermal oxidation injects silicon
interstitials into the wafer (the oxide takes more volume than the
silicon it consumes; the surplus atoms go inward — module 24 uses the
same injection to explain oxidation-enhanced diffusion). Those
interstitials condense on the seeds as *extrinsic stacking faults* —
partial-dislocation-bounded inserted planes, micrometres long, growing
roughly as oxidation proceeds and shrinking again (retrogrowth) at very
high temperatures where the fault's own line tension wins:

$$
L_{\rm OSF} \sim k\,t^{n}\ \ (n \approx 0.7{-}0.8\ {\rm during\ growth}),
$$

an empirical growth law whose exponent and prefactor are oxidation-
condition-dependent — quoted here to fix orders, not constants.

On a wafer spanning the critical radius, the seeds lie in an annulus;
oxidize the wafer and the faults decorate it as the visible **OSF
ring** — lesson 3's contour, developed like a photograph by the fab's
own front-end step:

![OSF ring radius against normalized centre pull condition, from the radial model: the ring emerges at the edge, sweeps inward as the ratio falls, and vanishes when the wafer goes all-interstitial.](/courses/electronic-devices/figures/m21-osf-ring.svg)

The ring's device record is nuanced. The faults themselves leak (their
bounding partials collect metals), so devices *on* the ring suffer; but
the ring band's *bulk* is also where oxygen precipitates most readily —
gettering-friendly. The historical resolution: place the ring where it
does least harm (pull-rate scheduling walks it to the wafer edge or off
it entirely), or remove its raw material (perfect silicon), or bury it
(epi). Modern OSF relevance is mostly diagnostic — an unplanned ring
shift is a growth-drift alarm (lesson 3's worked example 2.1), and an
OSF *test* (deliberate oxidation plus etch on samples) remains a cheap,
standard crystal-quality assay.

### Worked example 3.1 — the OSF test as arbitration

A fab blames rising pixel dark current on substrate quality; the vendor
blames fab metals. Arbitration protocol: matched wafer halves, one
processed by each party's standard OSF test (steam oxidation ~1100 °C,
Wright etch, count faults/cm²). Vendor's half: 3 faults/cm² —
consistent with historical baseline. Fab's half: 400/cm², concentrated
in a mid-radius annulus. Reading: the *seeds* were present in both
halves (same crystal), but only the fab's oxidation grew them — yet the
vendor's control oxidation did not. Conclusion: the fab's oxidation is
injecting more interstitials (wetter, hotter, or longer than believed)
or its ambient carries a fault-nucleating contaminant; the crystal's
seed density is at baseline. The OSF test's power is exactly this
factoring: seeds are the crystal's liability, growth is the process's
— and a two-legged experiment separates the factors in a day.

## 4. Reading a wafer map like a growth log

Assemble the module so far into the diagnostic it was always building
toward. **Uniform COP disc, no ring:** solidly vacancy growth
($v/G$ everywhere above critical); check cooling rate if density is
off-trend (lesson 4's trade). **Core COPs + mid-radius OSF ring +
clean rim:** the classic mixed wafer; ring radius calibrates the centre
ratio (lesson 3, worked example 2.1). **Swirl etch patterns,
no COPs:** interstitial growth — for most products, a reject or a
deliberate specialty. **Clean everywhere:** perfect silicon, or
anneal/epi countermeasures — distinguish by depth profiling (annealed
wafers are clean only in a skin; perfect material is clean throughout).
Each signature is the growth condition's autobiography, written in
defects and readable years later — the reason failure analysts call the
wafer map the cheapest growth audit ever run.

## 4b. The economics of the countermeasures

Section 4's diagnostic map has a commercial twin: given a wafer's
defect signature, what does each escape route cost? The three
countermeasures price out differently per wafer and per risk. The
**anneal-out** route (1200 °C argon/hydrogen, hours) spends furnace
time and a slip-risk premium — high-temperature batch anneals of large
wafers flirt with thermal-stress dislocations, module 22's territory —
to convert standard vacancy material into a clean-skin product; its
depth is bounded by the reservoir arithmetic of A21.29's
$\sqrt{Dt}$, so it protects shallow devices only. The **epitaxy**
route buys the cleanest known surface (module 29's single-crystal
overgrowth buries every substrate aggregate) at the highest cash cost
per wafer, plus the p⁺ substrate synergy that image-sensor and logic
products exploit; its risk ledger swaps crystal defects for epi
defects (stacking faults seeded by residual COPs — the substrate
still matters). The **perfect-silicon** route moves the cost upstream
into pull-rate productivity and corridor control (lesson 3), shipping
a wafer that needs no countermeasure at all but whose gettering must
be re-engineered (lesson 6 takes this up). A useful audit number ties
the three together: the countermeasure's cost must undercut the
yield value it protects,

$$
\Delta{\rm cost} < A_{\rm die}\,\Delta D_0\cdot({\rm value/die}),
$$

lesson 1's Poisson arithmetic run in reverse — and the historical
migrations of each product class (memory to perfect/annealed, logic
to epi, power to float-zone or annealed) are just this inequality
evaluated at each node's die size and margin. Defect physics proposes;
cost-of-ownership disposes.

## 5. Graduate extension: are voids and loops thermodynamic or kinetic objects?

A sharpening question for the whole module: is the observed aggregate
population an equilibrium state or a kinetic accident? The answer —
kinetic, but *locally* equilibrated — repays care. Globally, the true
free-energy minimum for a supersaturated crystal would be a single
enormous aggregate (surface-to-volume favours consolidation without
bound) plus a matrix at exact equilibrium; ripening (lesson 4) crawls
toward it but at rates that stall macroscopically — the observed
population is frozen mid-consolidation, a glass in configuration space.
Locally, however, each interface equilibrates fast: void walls sit at
the Gibbs-Thomson-corrected local equilibrium, loop lines at their
line-tension balance. This two-scale structure licenses the module's
mathematics — equilibrium thermodynamics *inside* the formulas
(equilibrium concentrations, Gibbs-Thomson factors) chained by kinetic
equations *between* them (nucleation rates, diffusion growth) — and
warns where it breaks: fast ramps (RTA, laser anneal, lesson 6's
vacancy engineering) outrun even local equilibration, and there the
population must be simulated with full rate equations, the industrial
practice behind every hot-zone design code. The philosophical takeaway
matches module 20's magnetic hysteresis: the objects on the wafer are
history, pinned by barriers — and engineering them is the art of
choosing which history gets frozen.

## 6. Problems

**P21.25** A void population has density $5\times10^{6}$ cm⁻³ and
diameter 90 nm. Compute the expected COP areal density on a polished
surface (intersection density ≈ volume density × diameter) and compare
with a scanner spec of 0.1 defects/cm² at ≥90 nm.

**P21.26** Using worked example 2.1's method, find the loop radius if
the same interstitial budget condensed at $10^{6}$ cm⁻³ loop density,
and state which etch class (A- or B-swirl) each density scenario
matches.

**P21.27** Why do voids stop growing but loops do not? Answer with the
two energy-per-defect scalings, one sentence each.

**P21.28** An OSF ring at $r/R = 0.5$ moves to 0.8 after a hot-zone
rebuild at constant pull rate. Did the rebuild steepen or flatten the
edge gradient relative to centre? (Use the radial model's logic.)

**P21.29** A 1200 °C argon anneal removes COPs from the top 5 µm of a
vacancy-rich wafer. Explain the mechanism in this module's terms — what
supplies the silicon, what happens to the wall oxide, and why the bulk
voids survive.

**P21.30** Design the two-legged experiment of worked example 3.1 for
the *opposite* verdict — an outcome pattern that would convict the
crystal instead of the fab — and state the tell.

### Answers

**A21.25** Areal density $\approx (5\times10^{6})(9\times10^{-6})
= 45$ cm⁻² — 450× over spec: this material is unshippable for that
product; it is standard-COP material destined for epi or relaxed
design rules. (The arithmetic is why COP specs effectively dictate
substrate strategy.)

**A21.26** Atoms per loop $= 3\times10^{13}/10^{6} = 3\times10^{7}$;
$A = 2\times10^{-8}$ cm², $R = 0.8$ µm. The $10^{4}$ cm⁻³/8 µm case is
A-swirl (sparse, large); $10^{6}$/0.8 µm is B-swirl territory (denser,
smaller precursors) — the historical pair reproduced by density
bookkeeping alone.

**A21.27** Void: energy per stored vacancy rises as surface/volume
$\propto 1/r$ falls — self-limiting once the reservoir drains, since
further growth requires net supply. Loop: energy per stored
interstitial *falls* as $\ln R/R$ — an open-ended discount that
accepts atoms as long as any supersaturation persists, hence the
micrometre scale.

**A21.28** Ring radius grew: the critical crossing moved outward,
meaning $v/G$ at mid-radii now stays *above* critical further out —
the edge gradient penalty weakened. The rebuild *flattened* $G(r)$
(relatively less edge cooling), enlarging the vacancy core. At
constant $v$, flattening $G$ raises $v/G$ everywhere; the map shifts
right.

**A21.29** At 1200 °C in a reducing/inert ambient, the void-wall oxide
dissolves (oxygen retreats into the bulk, solubility is high), leaving
a bare cavity; surface self-diffusion and the near-surface
interstitial supply from the free surface then fill the cavity —
the free surface acts as an infinite defect reservoir a few
micrometres away. Beyond the diffusion skin ($\sqrt{Dt}$ of the
anneal), no reservoir reaches: bulk voids, still oxide-lined, persist.
Hence a denuded *COP* skin over an unchanged bulk — cousin to lesson
6's oxygen denuded zone, same $\sqrt{Dt}$ geometry.

**A21.30** Same split-lot protocol, but the tell inverts: if *both*
halves — vendor control oxidation and fab oxidation — show elevated,
radially patterned fault counts versus historical baseline, the seed
density itself rose: the crystal carries more nuclei (growth drift
into the ring band, oxygen excursion). Fault counts that track the
*wafer* rather than the *oxidation leg* convict the crystal; counts
that track the leg convict the process. The design is a two-factor
experiment with one factor per party — arbitration by ANOVA, in four
wafers.
