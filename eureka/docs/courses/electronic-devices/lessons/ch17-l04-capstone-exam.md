# Module 17 Capstone: Materials Strategy Cases and Comprehensive Exam

<!-- covers: 17.1, 17.2, 17.3 -->

Module 17's three lessons supplied the industry's operating equations:
compounding density, learning curves, Dennard's ledger, Poisson yield, the
leakage exponential, the interface condition, the estate map, the efficiency
race, and the Johnson and critical-field limits. This capstone runs three
strategy cases that only close when several of those are used together, then
sets the exam.

## Case study 1: should this accelerator be a chiplet?

**The brief.** An AI accelerator wants 5 cm2 of logic at a node with mature
$D_0=0.12\ {\rm cm^{-2}}$, $\alpha=3$. Packaging a 4-chiplet version costs
an extra 18 percent of good-silicon cost and loses 7 percent performance to
die-to-die links. Decide.

**Yield arithmetic.** Monolith: negative binomial
$Y=(1+0.6/3)^{-3}=(1.2)^{-3}=0.579$. Chiplets of 1.25 cm2:
$Y=(1+0.05)^{-3}=0.864$. Good-silicon-per-wafer ratio: $0.864/0.579=1.49$.

**The decision line.** Chiplets win iff $1.49>1.18\times(1/0.93)^{\gamma}$
where $\gamma$ prices how much the market pays for performance. For a
cost-driven part ($\gamma\approx0$): $1.49>1.18$: split. For a
performance-priced flagship where 7 percent speed is 15 percent price
($\gamma$ large): the monolith can still win. **The same wafer statistics
support both answers**; what decides is the demand curve: which is why both
products exist in the market, and why lesson 1 insisted the economics travel
with the physics.

**Sensitivity check worth writing down.** At early-ramp $D_0=0.3$:
monolith $Y=(1.5)^{-3}=0.296$, chiplet $(1.125)^{-3}=0.702$: ratio 2.37, and
nothing performance-side survives that: **chiplets are above all a
ramp-phase and big-die insurance policy**, which is why the largest dies
fragmented first and why mature small dies never do.

## Case study 2: the 1.3 µm transceiver: which material where?

**The brief.** A datacentre transceiver needs: a 1.31 µm laser, a modulator,
a waveguide network, a photodetector, and a CMOS driver: five functions.
Assign materials with the module's tools.

**The laser.** 1.31 µm $=0.95$ eV, needed *direct*: silicon (1.12 eV,
indirect: $\eta\sim10^{-4}$ by lesson 3's race) is out on both counts.
The estate map's InP column: InGaAsP or InAlGaAs quaternaries straddle
0.95 eV lattice-matched to InP: the only workable landlord. Ticket price
(lesson 2): 150 mm fragile substrates: accepted, no alternative.

**Waveguides.** Need transparency at 1.31 µm: silicon's gap clears
($E_{\rm ph}<E_g$: no interband absorption) and its high index confines
tightly; and lesson 1's economics demand the big wafer wherever possible.
Silicon-on-insulator photonics takes it.

**Detector.** Silicon transparent at 1.31 µm: useless here by the same gap
arithmetic that made it a good waveguide: germanium ($E_g=0.66$ eV) absorbs
strongly, and module 38's Ge-on-Si epitaxy delivers it inside the CMOS flow:
the near-miss material of lesson 2 employed exactly where its weakness is a
strength.

**Modulator and driver.** Silicon: carrier-plasma modulation suffices, and
the driver is ordinary CMOS: lesson 1's cadence works *for* you wherever the
function is electronic.

**The assembly.** One package, three materials, each holding only the estate
it wins: III-V for photon generation, Ge for photon capture, Si for
everything countable. This partition (not any single-material triumph) is
the industry's actual answer, and every attempt to cheat it (silicon
lasers, III-V logic) has lost to the arithmetic in lessons 2 and 3.

## Case study 3: reading a scaling claim like an examiner

**The claim** (composite of real press releases): "Our new node doubles
density, cuts power 40 percent, boosts performance 18 percent, and will
halve cost per transistor."

**Audit with the ledger.** Post-Dennard, the three gains are not
independent: at fixed field they came as ($\kappa^{2}$, $\kappa$, flat
power/area). Doubled density is $\kappa=1.41$; Dennardian performance would
be +41 percent, power/device $-50$ percent. The claimed +18 percent
performance with $-40$ percent power sits *below* both classic dividends:
consistent with a voltage-constrained node spending its shrink on energy:
plausible, and itself evidence the free lunch is over.

**The cost audit.** Halving cost per transistor at 2x density requires
flat wafer cost (lesson 1's engine): against a 25 to 30 percent per-node
rise, the honest expectation is a 30 to 40 percent cut, not 50. The claim
mixes a *density* fact with a *cost* hope: and pricing the gap is precisely
the skill lesson 1 built. Verdict: physics consistent, economics
oversold by 10 to 20 points: the standard finding, which is why roadmap
claims are audited on exactly this template.

## Case study 4: the warehouse relamping, audited to payback

**The brief.** A warehouse runs 400 fixtures of 400 W metal-halide
(effective efficacy about 65 lm/W after ballast and lumen depreciation),
6000 hours a year at 0.15 per kWh. Proposed: LED highbays delivering the
same 26,000 lm each at 160 lm/W fixture efficacy, price 180 per fixture
installed. Audit the proposal with the module's tools, including the two
traps vendors leave out.

**Energy arithmetic.** Required flux per fixture: 26,000 lm. LED electrical
power: $26{,}000/160=162.5$ W against the incumbent's ~430 W at the wall.
Saving per fixture: 267.5 W; per year:
$267.5\times6000=1605$ kWh: 241 per year. Simple payback:
$180/241=0.75$ years. Fleet: 400 fixtures save 642 MWh a year.

**Trap one: thermal derating.** The 160 lm/W is rated at 25 C junction-ish
conditions; a sealed highbay at warehouse ceiling summer temperatures runs
the junction 60 to 80 C hotter. Lesson 3's efficiency race: the
nonradiative clock accelerates with temperature (droop compounds it), and a
realistic hot-lumen derate is 8 to 12 percent. Recompute at 145 lm/W:
power 179 W, saving 251 W: payback 0.80 years: survives easily, but a
marginal retrofit (say at 0.06 per kWh industrial rates) would have slipped
by the same fraction, and the audit habit is to *always* ask at what
junction temperature the datasheet lumen was measured: module 35's
territory arriving in a purchase order.

**Trap two: lifetime claims and the activation exponential.** "L70 =
100,000 hours" is an extrapolation from weeks of testing through an
Arrhenius model: lesson 5's reliability identity. The honest read: the
claim is a *model output* whose $E_a$ was fitted, and the same fixture run
20 C hotter halves the projection (the 10-degree rule derived in P17.28).
Specifying the fixture's thermal resistance and the site's ambient
profile: not the L70 number itself: is what a competent procurement
writes. Verdict: proceed: the physics margin is wide here: with a
contract clause pinning the thermal conditions behind both headline
numbers. The module's efficiency chain and reliability exponential turned
a brochure into a contract.

## Case study 5: 905 or 1550: a LiDAR's wavelength as a materials decision

**The brief.** An automotive LiDAR team must pick its wavelength. The two
industry camps: 905 nm (silicon detection) and 1550 nm (InGaAs detection,
lesson 3's estate). Decide like a materials engineer, not a partisan.

**The eye-safety budget.** The retina focuses 400-1400 nm light; beyond
1400 nm the cornea and ocular media absorb first, so permissible exposure
at 1550 nm is orders of magnitude higher than at 905 nm. Consequence: the
1550 nm system may emit far more peak power: range scales as the fourth
root of power in the radar-like link budget, so a 100x power allowance
buys roughly 3x range headroom: the physics case for 1550.

**The detector ledger (lesson 6).** At 905 nm: silicon,
$R_\lambda=\eta\times0.905/1.24\approx0.5$ A/W at modest $\eta$ (worked
problem P17.34's thin-depletion tax), dark current picoamps, and: the
decisive entry: silicon APDs and SPAD arrays with $k=0.05$ noise behaviour
(module 18's McIntyre) manufactured in CMOS-adjacent fabs at consumer
prices. At 1550 nm: InGaAs, $R\approx1.0$ A/W: better per photon: but dark
current three orders higher (the narrow-gap leakage exponential of
lesson 2, billed at the detector), APD excess noise at $k\approx0.5$
(four times the noise figure at equal gain), and 100 mm-class substrate
economics: lesson 2's ladder charging rent on every pixel of a focal
plane.

**The emitter ledger.** 905 nm: GaAs-based edge emitters and VCSEL
arrays: the most industrialised laser technology on earth, pennies per
watt. 1550 nm: InP-based, telecom-grade: superb, and an order of
magnitude dearer per emitted watt, with lesson 6's P17.37 threshold
sensitivity ($T_0\approx60$ K) demanding thermal management in an
automotive ambient.

**The system verdict.** Write the figure of merit as range-per-dollar
under a safety ceiling. 1550 wins numerator physics (power allowance,
atmospheric haze penetration); 905 wins every denominator line (silicon
detection, GaAs emission, CMOS integration, the volume Wright curve of
lesson 1). The market's split answer: premium long-range units at 1550,
volume units at 905: is the estate-map partition again: neither camp is
wrong; they are optimising different terms of the same product. The
transferable lesson, and the module's: **a wavelength choice is a
simultaneous selection of two semiconductor supply chains**, and pricing
both chains is the actual engineering decision. Every "which band" debate
in this course (module 31's infrared detectors, module 56's transparent
conductors) is this case with different numbers.

## Comprehensive exam

Problems marked (G) are graduate tier. Constants: Module C.

**E17.1** The density rule delivered $2^{26}$ from 1971 to 2023. If the
cadence has stretched to 3 years, what density multiple does 2035 add, and
what wafer-cost growth per node keeps cost per transistor falling?

**E17.2** A device family shows $b=0.35$. Volumes grow 25 percent per year.
How many years to halve cost?

**E17.3** Under constant-field scaling, show energy per switching event
scales as $1/\kappa^{3}$, and compute the cumulative energy factor across
the 1990-2005 era ($\kappa\approx1.4$ per node, 7 nodes).

**E17.4** A 2.2 cm2 die yields 61 percent (Poisson). Find $D_0$; find the
yield of a 0.9 cm2 derivative; find the die area at which yield falls to 30
percent.

**E17.5** Germanium logic at 85 C: with $n_i$ doubling every 9 K from
$2.4\times10^{13}$ at 300 K, estimate $n_i(358\ {\rm K})$ and the leakage
ratio to silicon at the same temperature ($n_i^{\rm Si}(358)\approx
2\times10^{12}$).

**E17.6** A deposited gate stack on InGaAs achieves
$D_{\rm it}=5\times10^{12}\ {\rm cm^{-2}eV^{-1}}$ at $C_{\rm ox}$ of 1 nm
EOT. Compute the subthreshold swing and the gate overdrive needed for 5
decades of on/off, and compare with silicon at $10^{10}$.

**E17.7** Find the GaAsP composition for a 650 nm emitter
($E_{\rm GaAs}=1.42$, $E_{\rm GaP}=2.26$ direct branch, $b=0.19$) and state
the constraint the estate map adds before the design is real.

**E17.8** A well with $\tau_r=3$ ns must hold $\eta\ge80$ percent at 150 C
where nonradiative capture triples. What room-temperature $\tau_{nr}$
margin is needed?

**E17.9** (G) Prove that in the negative binomial limit $\alpha\to0$ the
yield of any die area approaches $(1+AD_0/\alpha)^{-\alpha}\to1$ ... examine
the limit properly and interpret physically.

**E17.10** (G) A GaN-on-Si epi stack needs 4 µm of nitride at 4 percent
mismatch, far beyond the figure's $h_c$ of a few nm. List the three
engineering escapes of lesson 3 problem P17.21 and, for each, the module of
this course that develops it.

**E17.11** (G) Derive the Johnson product bound from
transit-time and breakdown arguments: maximum voltage
$V=\mathcal{E}_cL$, maximum transit frequency $f=v_{\rm sat}/2\pi L$: and
explain why no mobility term appears.

**E17.12** (G) Synthesis. A startup proposes "germanium CMOS on 300 mm for
datacentre logic: 2x hole mobility, drop-in economics." Write the
four-line materials audit this module equips you to give.

### Exam answers

**E17.1** $2035-2023=12$ years at 3-year doubling: $2^{4}=16$x. Engine
condition: wafer-cost growth per node below the per-node density gain of
2.0: unchanged: but with four nodes per twelve years instead of six, the
*rate* of cost decline drops by a third even at constant per-node economics:
the cadence itself is a price term.

**E17.2** Need $V^{0.35}$ up 2x: $V\times2^{1/0.35}=7.26$x volume. At 1.25x
per year: $t=\ln7.26/\ln1.25=8.9$ years: learning without shrink is a slow
engine, which is lesson 1's warning about post-scaling economics.

**E17.3** Energy $=CV^{2}$: $C\to C/\kappa$, $V\to V/\kappa$:
$E\to E/\kappa^{3}$. Seven nodes: $1.4^{21}=1180$: three orders of
magnitude per operation in fifteen years: the era mobile computing was
minted from; and its end is why architecture and materials now carry the
energy burden.

**E17.4** $D_0=-\ln0.61/2.2=0.225\ {\rm cm^{-2}}$.
$Y(0.9)=e^{-0.202}=0.817$. $A=-\ln0.30/0.225=5.35\ {\rm cm^{2}}$.

**E17.5** $58/9=6.4$ doublings: $n_i\approx2.4\times10^{13}\times85
=2.0\times10^{15}$. Ratio $(n_i^{\rm Ge}/n_i^{\rm Si})^{2}=(10^{3})^{2}
=10^{6}$: at server temperatures germanium is six orders leakier: E-grade
confirmation of lesson 2's verdict, and the quantitative floor under
"Ge only as thin films inside silicon".

**E17.6** $C_{\rm it}/C_{\rm ox}$: from lesson 2's worked example scale
($10^{12}\to$ ratio 0.149 at 2 nm): at 1 nm EOT, $C_{\rm ox}=3.45\times
10^{-2}$ F/m2 and $C_{\rm it}=5\times2.57\times10^{-3}\times$($10^{12}$
scaling)$=1.28\times10^{-2}$: $S=60(1+0.372)=82$ mV/dec. Five decades:
0.41 V of subthreshold swing alone versus silicon's
$60(1+0.0074)\approx60.4$: 0.30 V. The III-V device spends a third of a
1 V supply's budget before conduction begins: the interface tax, invoiced.

**E17.7** $1240/650=1.908$ eV: solve $1.908=1.42+0.84x-0.19x(1-x)$:
$0.19x^{2}+0.65x-0.488=0$: $x=(-0.65+\sqrt{0.4225+0.371})/0.38
=(-0.65+0.891)/0.38=0.634$. Constraint: no lattice-matched substrate at
that composition: GaAsP red emitters grew graded on GaAs and paid in
dislocations: acceptable for indicators (lesson 3's forgiving-defect
arithmetic), never for lasers: the estate map's second column always gets a
vote.

**E17.8** At 150 C: $\tau_{nr}^{\rm hot}\ge\tau_r\eta/(1-\eta)=3\times4
=12$ ns: room-temperature $\tau_{nr}\ge36$ ns: via the capture arithmetic,
defect budgets tighten threefold before derating: high-temperature
optoelectronics is a defect-density specification in disguise.

**E17.9** As $\alpha\to0$ with $AD_0$ fixed:
$(1+AD_0/\alpha)^{-\alpha}=e^{-\alpha\ln(1+AD_0/\alpha)}$ and
$\alpha\ln(1+AD_0/\alpha)\to\alpha\ln(AD_0/\alpha)\to0$: yield $\to1$.
Interpretation: $\alpha\to0$ is total clustering: all defects pile onto
vanishingly few dies, sparing the rest: the theoretical limit of "kill one
die, save the wafer", and why clustering is a fab's friend.

**E17.10** (i) Reduce misfit: compositional grading/virtual substrates:
module 38. (ii) Manage dislocations: nucleation layers, filtering
superlattices, tolerant devices: module 32. (iii) Strain partition/buffer
engineering with periodic interlayers: module 30's epitaxy toolkit.
GaN-on-Si products ship using all three at once.

**E17.11** $V_{\max}=\mathcal{E}_cL$; $f_{\max}=v_{\rm sat}/2\pi L$:
product $Vf=\mathcal{E}_cv_{\rm sat}/2\pi$: independent of $L$, hence of
design: a pure material bound. Mobility is absent because at the
breakdown-limited, transit-limited corner the carrier moves at saturation
velocity: module 18 lesson 3's regime where $\mu$ ceased to matter:
low-field virtue buys nothing at the power-frequency frontier.

**E17.12** The audit: (1) leakage: $n_i$ 2400x silicon's: E17.5's $10^{6}$
at temperature: datacentre junctions cannot hold state: fails at line one.
(2) No stable oxide: GeO2 water-soluble: the interface condition of
lesson 2 unmet without imported dielectrics still below silicon's
$D_{\rm it}$. (3) 938 C melting point: thermal-budget vocabulary shrinks
(lesson 2 WE 3.1). (4) "Drop-in economics" ignores that the incumbent's
economics are the *system* (yield learning, substrate ladder, cadence):
lesson 2's closing rule. Verdict: hole mobility is real and is already
harvested the viable way: as strained SiGe/Ge *channels inside* silicon
CMOS (module 38): the startup's one true fact leads to the incumbent's
roadmap, not a rival platform.

## The module's four ideas, for long-term memory

1. **Compounding rules with material permissions**: exponentials hold only
   while physics keeps granting them, and each grant is a later module.
2. **Exponential sensitivities**: leakage in $E_g$, yield in $AD_0$,
   subthreshold in $D_{\rm it}$: materials enter device economics through
   exponents, never linearly.
3. **The system test**: platforms win on products of properties: audit any
   "better material" claim against the full ledger.
4. **The estate map with rent**: composition tunes gaps and lattices along
   computable lines; mismatch charges by the nanometre; the stable outcome
   is partition, not conquest.
