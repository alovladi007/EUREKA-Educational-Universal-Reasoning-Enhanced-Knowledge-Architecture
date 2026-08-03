# Module 21 Capstone: Design Cases and the Comprehensive Exam

<!-- covers: 21.1, 21.2, 21.3, 21.4 -->

Three design cases run the module end-to-end, then the comprehensive
exam with fully worked answers, then oral-defense prompts. As in every
capstone, the cases are the format in which this material is actually
used: a brief, a budget, a decision, and the failure mode named in
advance.

**Level.** Integrative; assumes lessons 1 to 7.

## Case 1 — choosing substrates for an image sensor

*Brief.* A backside-illuminated image sensor needs dark current at
single-electron levels: junction leakage and metal contamination are
existential. Choose among standard vacancy-rich CZ, perfect silicon,
annealed wafers, and p/p⁺ epitaxy.

*Analysis.* The pixel array cannot tolerate a single void or loop in
its depletion volume, nor iron above $\sim10^{10}$ cm⁻³ (module 23's
lifetime arithmetic). Standard CZ fails on COPs outright: with bulk
density $10^{6}$ cm⁻³ and 5 µm of active depth, defects per cm² of
array are

$$
N_{areal} \approx (10^{6}\ {\rm cm^{-3}})(5\times10^{-4}\ {\rm cm})
= 500\ {\rm cm^{-2}}
$$

— hundreds of dead pixels per die. Annealed wafers clean a skin but
retain a precipitating bulk of *modest* controllability. Perfect
silicon removes aggregates but (lesson 6, A21.35) getters weakly
without extra help. Epi on p⁺ delivers the cleanest active layer *and*
the strongest gettering — the heavily boron-doped substrate getters by
segregation on top of its oxygen precipitation, with dopant out-
diffusion into the epi layer as its managed cost.

*Decision.* p/p⁺ epi, the industry's actual answer for premium
sensors; annealed or nitrogen-doped perfect material competes at lower
cost points. Named failure mode: epi-layer thickness must exceed the
depletion depth with margin against p⁺ up-diffusion during the flow —
a $\sqrt{Dt}$ check (module 24's arithmetic) that belongs in the
substrate spec, not the device review after the fact.

## Case 2 — a defect budget for a new pull-rate uprate

*Brief.* Crystal growth proposes +15% pull rate for throughput.
Quantify the defect consequences before the pilot.

*Analysis.* Uprating $v$ at fixed hot zone raises $v/G$ by 15%: the
map (lesson 3) says deeper into the vacancy regime — ring walks
outward or off-edge, vacancy excess grows roughly with the margin
above critical. Cooling rate through the void window also rises
(the crystal moves faster through the same thermal field), so by
lesson 4's trade the population shifts toward *more, smaller* voids.
Quantify with the conservation chain: excess up ~40% (nonlinear
near-critical amplification, lesson 3 section 5), density up several-
fold from combined supersaturation and cooling effects, size down as
$N^{-1/3}$. The COP scanner count could move *either way* (A21.21's
inversion); gate-oxide integrity on the thick-oxide legacy products
likely *improves*; bulk tomograph density degrades.

*Decision.* Approve pilot with acceptance defined on *bulk tomography
plus GOI*, explicitly not on scanner counts — the metrology-inversion
trap briefed in advance. Require an oxygen re-spec: faster pull also
shifts $[{\rm O}_i]$ incorporation via melt-flow changes, and the
gettering customers' windows (lesson 6) bound the allowed drift.

## Case 3 — post-mortem: the leaky-junction epidemic

*Brief.* A power-device line sees junction leakage lots spike 40×,
uncorrelated with any fab equipment event. Wafer maps show leakage
sites in a mid-radius annulus.

*Analysis.* The annulus is the tell (lesson 5 section 4): a growth-
condition contour, not a fab pattern (fab excursions map to tools —
scan paths, showerheads — not to crystal radius). An OSF-band
hypothesis fits: mild-vacancy annulus seeded oxide precipitates whose
faults the device's own oxidation grew (worked example 3.1 of lesson
5); the faults' decorated partials leak. Confirm: OSF test on
retained sister wafers; check the vendor's ring-radius control chart
for the drift (lesson 3, worked example 2.1).

*Decision path.* Short term: screen incoming material by ring
position; medium term: vendor corrective on the hot zone; long term —
the strategic lesson — the product's oxidation step was operating as
an unintentional defect-decoration assay, so a deliberate monitor
(quarterly OSF test) becomes cheap insurance. The case's teaching:
radial symmetry in a failure map is the crystal introducing itself,
and the arbitration protocol of lesson 5 assigns the bill.

## Comprehensive exam

**X21.1** Derive the equilibrium vacancy fraction from free-energy
minimization, and evaluate it at 1550 K for $E_f = 4.0$ eV,
$S_f = 5k_B$.

**X21.2** State the Voronkov criterion, the physical origin of each
side of the competition, and the two stacked nonlinearities that make
the regime flip sharp.

**X21.3** A puller runs $v = 0.7$ mm/min, $G(0) = 40$ K/cm with the
radial model $G(r) = G(0)/(1-0.35r^2)$. Locate the critical radius.

**X21.4** Compute $r^*$ and $\Delta G^*$ for void nucleation at
1080 K, $S = 2\times10^{4}$ ($\sigma = 0.95$ J/m²,
$\Omega = 2\times10^{-29}$ m³), and state whether the burst has
plausibly begun (40 $k_BT$ rule).

**X21.5** A crystal's void population is ($10^{7}$ cm⁻³, 70 nm). Its
successor hot zone reports ($10^{5}$ cm⁻³, $d = ?$) from the same
vacancy budget. Find $d$ and give the GOI implication for 4 nm
oxides.

**X21.6** Explain why interstitial-rich material develops micrometre-
scale defects while vacancy-rich material's stay at ~100 nm, using
the two energy-per-defect scalings.

**X21.7** An OSF test shows faults at 350 cm⁻² concentrated at
$r/R = 0.6$–0.75 on vendor A material and 8 cm⁻² uniform on vendor B.
Both crystals pass identical COP specs. Which vendor's material is
riskier for a bipolar product, and why does the COP spec miss it?

**X21.8** Design a high-low-high schedule (temperatures and rough
times) for a wafer with $[{\rm O}_i] = 7.5\times10^{17}$ cm⁻³
targeting a 12 µm denuded zone, justifying each step with a formula
from lessons 4/6.

**X21.9** Iron at $10^{12}$ cm⁻³ contaminates a wafer whose bulk
carries $rN = 2\times10^{4}$ cm⁻² of precipitate sink strength.
Estimate the gettering time constant at 900 °C
($D_{Fe} \approx 1\times10^{-6}$ cm²/s) and the residual iron after a
30 min anneal.

**X21.10** A lot annealed at 450 °C for die-attach cure shifts p⁻
resistivity upward 2×. Name the mechanism, the corrective anneal, and
the wafer parameter that controls susceptibility.

**X21.11** Why does perfect silicon sometimes fail *gettering*
audits, and what are the two standard fixes?

**X21.12** Integrative: a single wafer shows (i) a COP core to
$r/R = 0.55$, (ii) an OSF ring at 0.6, (iii) swirl etch figures
outside 0.7, and (iv) strong bulk precipitation everywhere below
15 µm. Reconstruct the growth condition and thermal history that
wrote all four, citing the responsible lesson for each zone.

### Answers

**A-X21.1** Minimization as supplement section 1:

$$
\frac{n}{N} = e^{5}\exp\!\left(-\frac{4.0}{8.617\times10^{-5}\times1550}\right)
= e^{5}e^{-29.95} \approx 1.4\times10^{-11},
$$

about $7\times10^{11}$ cm⁻³ on $5\times10^{22}$ sites.

**A-X21.2** Vacancy excess for $v/G$ above $\approx1.3\times10^{-3}$
cm² min⁻¹ K⁻¹, interstitial below. Convection ($vC^{eq}$) favours the
more abundant vacancy; gradient-driven back-diffusion
($\propto G\,DC^{eq}$) favours the better transporter, the
interstitial. Sharpness: (i) recombination annihilates the minority,
making the survivor a difference of near-equals; (ii) nucleation's
$e^{-B/\ln^2S}$ threshold amplifies that difference into
all-or-nothing aggregates.

**A-X21.3** $v/G(r) = (0.07/40)(1-0.35r^2)^{-1}$... note the model
inverts: with $G$ rising toward the edge as given,
$v/G(r) = 1.75\times10^{-3}(1-0.35r^2)$. Critical where this equals
$1.3\times10^{-3}$:

$$
1 - 0.35r^2 = 0.743 \;\Rightarrow\; r = \sqrt{0.735} \approx 0.86.
$$

Vacancy core to 86% radius, interstitial rim outside — ring near
$r/R = 0.86$.

**A-X21.4** $k_BT\ln S = (1.49\times10^{-20})(9.90) =
1.48\times10^{-19}$ J:

$$
r^* = \frac{2(0.95)(2\times10^{-29})}{1.48\times10^{-19}} = 0.26\ {\rm nm},
\qquad
\Delta G^* = \frac{16\pi(0.857)(4\times10^{-58})}{3(2.19\times10^{-38})}
\approx 2.6\times10^{-19}\ {\rm J},
$$

i.e. $\Delta G^*/k_BT \approx 17$ — far below 40: nucleation is fast;
the burst is underway or finished at this depth of supersaturation.

**A-X21.5** Conservation: $d \propto N^{-1/3}$:

$$
d = 70\ {\rm nm}\times(10^{7}/10^{5})^{1/3} = 70\times4.64 \approx 325\ {\rm nm}.
$$

Rare but enormous voids: each surface intersection is a guaranteed
4 nm-oxide rupture — GOI worsens despite the 100× density
improvement. (The uprate went the wrong way on the trade for thin
oxides.)

**A-X21.6** Void: cavity energy is surface, cost per stored vacancy
$\propto 1/r$ — growth's incentive weakens; the reservoir, not the
structure, limits size near 100 nm. Loop: line energy over stored
area gives cost per interstitial $\propto \ln R/R$ — monotonically
cheaper, so growth continues while any supply lasts, reaching
micrometres.

**A-X21.7** Vendor A: the annular OSF band marks near-critical growth
with seeded oxide nuclei — bipolar devices' deep, hot cycles will
grow decorated faults through active junctions: high risk. COP specs
count only vacancy voids at the surface; the OSF band lives in a
*different* radial zone and a different defect family, invisible to
the scanner. Vendor B's uniform low count is baseline noise. The
miss is lesson 1's rule: one assay, one defect family.

**A-X21.8** High: 1150 °C, ~2–3 h — out-diffusion depth
$\sqrt{4D_Ot}$ with $D_O(1423) \approx 1.6\times10^{-10}$ cm²/s gives
~15 µm ≥ 12 µm target, and dissolves near-surface nuclei
($S \approx 2$ there: sub-threshold). Low: 700 °C, 4–8 h — deep-bulk
$S \approx 60$ drives the nucleation burst ($\Delta G^*\propto
1/\ln^2S$ now crossable). High: 1000 °C, 4 h — growth at
$r\propto\sqrt{D_Ot}$ to working sink size, $S$ still >8 so no
redissolution. Each leg is one formula pointed at one job.

**A-X21.9** $\tau_g = (4\pi rND_{Fe})^{-1} =
[4\pi(2\times10^{4})(10^{-6})]^{-1} \approx 4.0\ {\rm s}$:

$$
C(30\ {\rm min}) = 10^{12}\,e^{-1800/4.0} \sim 10^{12}e^{-450}
\approx 0.
$$

Effectively total capture — the anneal's iron endpoint is set by
re-injection and cool-down re-emission, not by the pump (worked
example 3.1 of lesson 6's oversizing, re-derived).

**A-X21.10** Thermal donors (O$_i$ clusters, double donors)
compensating the p⁻ doping; corrective: ~650 °C, 30 min donor-kill
then controlled cool; susceptibility parameter: $[{\rm O}_i]$ (donor
formation rate rises steeply with it — low-oxygen or FZ material is
immune).

**A-X21.11** Near-critical growth leaves few vacancies to catalyse
oxygen nucleation (lesson 6's seesaw): precipitate densities can land
below gettering spec, erratically. Fixes: nitrogen co-doping (seeds
nucleation heterogeneously) or an RTA vacancy-installation step
(programs the profile explicitly).

**A-X21.12** (i) Core: $v/G$ above critical inside $r/R \approx 0.55$
— vacancy regime, voids (lessons 3, 4). (ii) Ring at 0.6: the
critical contour's mild-vacancy band, oxide-seeded, developed by the
device's oxidation (lesson 5). (iii) Swirl beyond 0.7: $v/G$ below
critical at the rim — interstitial loops (lesson 5). (iv) Bulk
precipitation below 15 µm with a clean skin: a high-low-high or
RTA-style history — out-diffused/vacancy-denuded skin, nucleated and
grown bulk (lesson 6). One wafer, the whole module: a mixed-regime
crystal, mid-radius near-critical, subsequently defect-engineered for
internal gettering.

## Oral-defense prompts

Standard format: two minutes, one equation, one number. (1) Defend
"the wafer is frozen history" with the 300 K equilibrium calculation.
(2) Explain to a fab manager why COP scanner counts can improve while
material degrades. (3) Justify perfect silicon's price premium from
the corridor-control problem. (4) Argue the OSF ring is a feature (a
diagnostic) as much as a defect, with the arbitration protocol as
evidence. (5) Present internal gettering as this module's physics
integrated into one product, naming each lesson's contribution in one
sentence.
