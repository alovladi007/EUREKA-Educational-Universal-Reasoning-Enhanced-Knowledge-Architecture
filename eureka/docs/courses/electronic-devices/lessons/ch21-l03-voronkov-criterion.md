# The Voronkov Criterion: One Ratio Decides the Crystal's Fate

<!-- covers: 21.1, 21.2 -->

Few results in materials engineering compress as much industrial
consequence into as small an expression. The ratio of pull rate to
interface thermal gradient, $v/G$, determines — sharply, reproducibly,
across every Czochralski puller on Earth — whether a silicon crystal
emerges vacancy-rich (voids, COPs) or interstitial-rich (dislocation
loops). This lesson builds the criterion from lesson 2's two currents,
extends it radially to explain the patterns wafers actually show, and
follows it into the control room where "perfect silicon" is grown by
holding one number inside a narrow window.

**Level.** Sections 1 to 4 undergraduate core; section 5 graduate;
section 6 problems.

## 1. The competition, quantified

Recall lesson 2's interface picture. The growing crystal carries both
defect species away by convection (flux $vC^{eq}$ each), while the steep
gradient behind the interface drives both back toward it by diffusion
down their equilibrium profiles. The diffusive flux for each species
scales as

$$
J_{\rm diff} \sim D\,\frac{dC^{eq}}{dz}
= D\,C^{eq}\,\frac{E_f}{k_BT^2}\,G,
$$

proportional to $G$ and to the species' transport product $DC^{eq}$. The
convective flux is proportional to $v$ and to $C^{eq}$ alone. Vacancies
are the more numerous species at the melting point; interstitials the
more mobile. So:

- **Large $v$, small $G$** — convection dominates; the more *abundant*
  species wins: **vacancy excess**.
- **Small $v$, large $G$** — back-diffusion dominates; the more *mobile*
  species escapes backward less readily... more precisely, the
  interstitial's superior transport product lets it maintain supply to
  the interface region while recombination consumes the vacancy excess:
  **interstitial excess**.

Because each flux is linear in its knob, the outcome depends only on the
ratio, with a critical value where the two species' survivals balance:

$$
\left(\frac{v}{G}\right)_{crit} \approx 1.3\times10^{-3}
\ {\rm cm^2\,min^{-1}\,K^{-1}},
$$

the widely used experimental calibration (constants of this kind are
facts of the literature; a grower's own hot zone refines the third
digit). The flip at the criterion is remarkably sharp:

![Surviving defect excess against the normalized ratio of pull rate to gradient: interstitial excess below the critical value, vacancy excess above, with a narrow near-neutral corridor between.](/courses/electronic-devices/figures/m21-voronkov.svg)

### Worked example 1.1 — placing a real process on the map

A 300 mm puller runs $v = 0.5$ mm/min with an axial gradient at the
interface of $G = 35$ K/cm. Then

$$
\frac{v}{G} = \frac{0.05\ {\rm cm/min}}{35\ {\rm K/cm}}
= 1.43\times10^{-3}\ {\rm cm^2\,min^{-1}\,K^{-1}},
$$

about 10% above critical: mildly vacancy-rich — the standard regime for
high-throughput memory-era material, COPs expected and managed. To grow
interstitial-type material instead, the grower must cut $v$ by ~20% or
steepen $G$ — and every percent of pull rate is a percent of puller
productivity, which is why the *direction* of the industry's solution
(section 4) was not "grow slower."

## 2. The radial complication: rings

The criterion would be a footnote if $G$ were uniform. It is not: heat
leaves the crystal through its cylindrical surface as well as axially,
so the interface gradient *rises toward the edge*. With $v$ common to
the whole interface, $v/G(r)$ *falls* from centre to edge:

![Radial profiles of the normalized ratio for three pull rates: the ratio falls toward the edge, and where it crosses the critical value the defect regime flips at a ring.](/courses/electronic-devices/figures/m21-voronkov-radial.svg)

A crystal pulled with its centre above critical and its edge below
contains *both* regimes, separated by a cylindrical **critical surface**
— on a wafer, a ring. Inside: vacancy core, voids. Outside: interstitial
rim, loops. The boundary itself, nearly defect-free, is flanked by a
band where moderate vacancy excess plus oxygen forms the nuclei that
oxidation will later decorate as the **OSF ring** (lesson 5 does the
decoration; here it is the criterion's contour made visible). The whole
geometry condenses onto one operating map:

![Defect regime against centre ratio and radial position: the critical contour sweeps from edge to centre as the ratio falls, reproducing ring-core wafer patterns from one inequality.](/courses/electronic-devices/figures/m21-defect-regime-map.svg)

Every classic wafer-map pathology reads off this chart. High pull rate:
all-vacancy wafer, COPs everywhere, no ring. Intermediate: vacancy core
with its void population, OSF ring at the critical radius, interstitial
rim. Low: all-interstitial, loop patterns. And the ring *moves with
process drift* — a hot-zone aging that steepens edge cooling walks the
ring inward lot by lot, which is why the ring radius is tracked on
control charts as a growth-health telltale.

### Worked example 2.1 — reading a drifting ring

Incoming wafers show the OSF ring at $r/R = 0.7$ where qualification
lots had 0.85. Using the radial model $v/G(r) = (v/G)_0(1-0.35r^2)$ with
critical crossing at the ring: qualification implies
$(v/G)_0(1-0.35\cdot0.72) = 1$, so $(v/G)_0 = 1.34$; the new lots give
$(v/G)_0(1-0.35\cdot0.49) = 1$, so $(v/G)_0 = 1.21$. The centre ratio
fell ~10%: either pull rate slipped or — more common — the aging hot
zone's insulation now steepens $G$. The wafer told the puller's
maintenance story; disposition is a growth-side audit, not a fab
excursion. (The model's simple quadratic is a teaching stand-in; the
production version uses the hot zone's simulated $G(r)$, but the
inversion logic is identical.)

## 3. Perfect silicon: engineering inside the corridor

The map suggests a third product: hold $v/G$ *at* critical across the
entire radius, and neither species survives in force — no voids, no
loops. This is **perfect silicon** (defect-free or pure silicon in
vendor dialects), and since the late 1990s it has been a mainstream
premium product. The engineering is a corridor problem: the neutral band
is narrow (a few percent in $v/G$), and it must be held

- **radially** — requiring hot zones designed so $G(r)$ tracks as flat
  as possible (radiation shields, active edge heaters: module 28's
  territory), and
- **axially** — as the crystal lengthens, the thermal environment
  changes, so $v$ is servo-scheduled down the boule to keep the ratio
  centred.

The reward is a wafer needing no COP countermeasures; the price is pull
rate near the critical value (slower than the vacancy-regime maximum)
and tighter process control. The alternative strategies — anneal-out
(high-temperature argon/hydrogen anneals dissolving near-surface voids)
and epitaxial overgrowth (burying them under a clean layer, module 29)
— each accept the defects and clean up a skin. The market spans all
three: epi wafers for logic, annealed or perfect wafers for image
sensors and memory, standard vacancy material where design rules
tolerate COPs. Cost-of-ownership arithmetic in module 17's style — not
physics — picks among them per product.

## 4. What the criterion does *not* control

An honesty section the datasheets skip. The criterion sets the *net
excess species and its amount*; it does not by itself set the final
aggregate population — that requires lesson 4's cooling-history
physics (the same excess quenched fast gives many small voids; cooled
slowly, few large ones). It says nothing about **oxygen**, whose
precipitation behaviour (lesson 6) rides on top of the vacancy census
and often matters more to the device than the voids do. And it is
calibrated for lightly doped, standard-diameter Czochralski growth:
heavy doping shifts it (lesson 2 section 5), magnetic-field growth
(module 28) changes the melt flow feeding it, and float-zone crystals
— tiny oxygen, different thermal fields — play by their own numbers.
A criterion this famous accumulates over-broad citation; its domain of
validity is part of its statement.

## 5. Graduate extension: why the flip is so sharp

The tanh-like sharpness of the regime flip is not obvious — the two
fluxes differ only linearly in $v/G$. The amplifier is **recombination
during the cooldown**. Just behind the interface both species coexist
at comparable concentrations; over the next few hundred kelvin of
cooling, $V+I\to0$ consumes the minority almost completely (lesson 2's
mass action: the product $C_VC_I$ collapses with equilibrium). The
surviving excess is the *difference* of two nearly equal incorporations
— and a difference of near-equals is exquisitely sensitive to its
inputs. A 5% change in relative incorporation near the crossover swings
the survivor's concentration by large factors, which the subsequent
nucleation threshold (exponential in supersaturation, lesson 4) then
amplifies again into an all-or-nothing defect map. Two stacked
nonlinearities — annihilation of the minority, exponential nucleation —
turn a gentle linear competition into the step function wafers exhibit.
The general lesson exports well beyond silicon: whenever a *difference*
of large fluxes feeds a *threshold* process, expect knife-edge
phenomenology, and design the control system for the knife edge rather
than the underlying gentle physics.

## 6. Problems

**P21.13** A puller runs $v = 1.0$ mm/min, $G = 45$ K/cm. Compute
$v/G$, classify the regime, and name the aggregate family and its
device signature.

**P21.14** Using the radial model of worked example 2.1 with
$(v/G)_0 = 1.5$ (normalized), find the ring radius. What centre value
places the ring exactly at the edge ($r/R = 1$)?

**P21.15** A grower wants all-interstitial material on a hot zone with
$G(0) = 30$ K/cm. What is the maximum pull rate? If the puller's
economics require $v \ge 0.6$ mm/min, what must the hot-zone redesign
deliver instead?

**P21.16** Explain why the OSF ring is a *contour of the growth
condition* rather than a defect that migrated to that radius — and
what its persistence at fixed radius through wafering and polishing
tells you.

**P21.17** Perfect-silicon growth holds a corridor of ±3% in $v/G$
along a 2 m boule while the effective $G$ drifts 15% end to end.
Sketch the required $v$ schedule (direction and rough shape), and name
the two measurement feedbacks a production puller uses to close this
loop.

**P21.18** Using section 5, explain why crystal-to-crystal
reproducibility of *void density* is much worse near the critical
ratio than deep in the vacancy regime — and why perfect-silicon
vendors nevertheless choose to live there.

### Answers

**A21.13** $v/G = 0.1/45 = 2.2\times10^{-3}$ cm² min⁻¹ K⁻¹ — 1.7×
critical: solidly vacancy-rich. Aggregates: octahedral voids → COPs;
signature: gate-oxide integrity failures and scanner pits at fixed
coordinates (lesson 1).

**A21.14** $1.5(1-0.35r^2) = 1 \Rightarrow r^2 = (1-1/1.5)/0.35 =
0.952$, $r/R = 0.976$... recompute: $(1 - 0.667)/0.35 = 0.952$,
$r = 0.98$ — nearly at the edge. Exactly at the edge:
$(v/G)_0(1-0.35) = 1 \Rightarrow (v/G)_0 = 1.54$. (Centre values above
1.54 give an all-vacancy wafer, ring gone over the edge.)

**A21.15** Need $v/G < 1.3\times10^{-3}$: $v < 1.3\times10^{-3}\times30
= 0.039$ cm/min $= 0.39$ mm/min. For $v = 0.6$ mm/min the gradient must
satisfy $G > 0.06/1.3\times10^{-3} = 46$ K/cm: the redesign must
steepen interface cooling by ~55% — radiation shields and gas-jet
cooling, the standard fast-cool hot-zone package.

**A21.16** The nuclei that become OSFs formed *at growth*, at the
radius where the local condition sat near critical with mild vacancy
excess; nothing moved laterally — centimetre-scale migration is
impossible for any aggregate (lesson 1). Its fixed radius through all
subsequent processing confirms it is written into the crystal's body:
slicing position along the boule changes the ring radius only insofar
as the growth condition drifted axially.

**A21.17** As effective $G$ falls along the boule (typical as the
crystal lengthens and radiates less efficiently), $v$ must fall
proportionally to hold the ratio: a monotonically declining pull-rate
schedule, steepest where the thermal drift is fastest, tuned per hot
zone. Feedbacks: (i) in-line diameter/thermal camera signals feeding
the growth model in real time; (ii) post-growth defect mapping (ring
radius, void assays) on witness wafers feeding the *next* run's
schedule — a run-to-run control loop.

**A21.18** Near critical, the surviving excess is the difference of
near-equal incorporations: percent-level noise in $v$, $G$ or melt flow
becomes tens-of-percent noise in the excess, then order-of-magnitude
noise in nucleated density through the exponential threshold. Deep in
the vacancy regime the excess is robustly large and densities
reproduce. Vendors accept the sensitivity because the *product spec*
there is "no detectable aggregates" — the corridor's output is a
null, which is easier to keep in spec than a controlled nonzero
density, provided the control loop holds the corridor at all.
