# Module 22 Capstone: Design Cases and the Comprehensive Exam

<!-- covers: 22.1, 22.2, 22.3, 22.4, 22.5, 22.6, 22.7, 22.8, 22.9, 22.10, 22.11, 22.12, 22.13, 22.14 -->

Three design cases run the module end to end, then the comprehensive exam
with fully worked answers, then the oral-defense prompts. As in every
capstone, the cases are the format in which this material is actually used:
a brief, a budget, a decision, and the failure mode named in advance.

**Level.** The cases assume all of lessons 1 to 5; the exam is closed-book
against the data book of lesson 5, section 7.

## Case 1 - a well diffusion under a thermal-budget ceiling

**Brief.** Form a p-well 1.0 to 1.2 μm deep in $10^{16}$ cm⁻³ n-type
material, surface concentration between $10^{18}$ and $2\times10^{19}$
cm⁻³. The fab allows at most 2 hours of furnace time above 1000 °C.

**Design.** Two-step boron: predeposition to set the dose, drive-in to set
the depth. Lessons 1 and 2 already computed the candidate: 30 min predep at
1000 °C ($Q = 5.1\times10^{14}$ cm⁻², from the stated solubility-limited
erfc), then 60 min drive at 1100 °C giving $Dt = 4.1\times10^{-10}$ cm²,
$C(0) = 1.4\times10^{19}$ cm⁻³, $x_j = 1.1$ μm. Both specifications land
inside their windows with 90 minutes of the 120 spent.

**The audit, which is the actual work.** Check the regime: $C(0)$ exceeds
$n_i(1100\,°C)$ by a small factor, so diffusion near the surface runs
extrinsic with $h \to 2$ and the front will sit slightly deeper than the
constant-$D$ arithmetic; the remaining 30 minutes of budget absorbs the
correction either way. Check what else moves: any later step above 1000 °C
adds its own $Dt$ to this well, so the well must be the first junction
formed, and the budget ledger opened here follows the lot through the flow.

![The thermal budget on log axes, computed from the stated boron parameters: diffusion length against time at three furnace temperatures, with a 10 nm modern junction budget drawn as the horizontal line every advanced anneal must duck under.](/courses/electronic-devices/figures/m22-thermal-budget-map.svg)

**Failure mode, named in advance.** A 15 °C furnace calibration error at
the drive step changes $D$ by a factor $e^{0.4} = 1.5$ (P22.4's relation)
and moves $x_j$ by over 20 percent, out the top of the window. The
monitor-wafer protocol exists to catch exactly this before product does.

## Case 2 - an ultra-shallow junction against TED

**Brief.** Source-drain extension: boron, junction 12 nm at $10^{18}$
cm⁻³ background contrast, sheet resistance as low as possible, implant
already chosen (500 eV, $10^{15}$ cm⁻²).

**Design.** The enemy is transient enhanced diffusion. The implant leaves
an interstitial supersaturation in the thousands; while it lasts, boron
moves at a rate the equilibrium Arrhenius law says is impossible at any
allowed temperature. The design space is one dimension: spend the anneal
before the transient does its moving, or after the transient has died.

$$
x(t) \propto \sqrt{2\int_0^t D\left[1 + f_0\,e^{-t'/\tau}\right]dt'}
$$

![Junction motion computed from the stated enhancement model with a thousand-fold initial boost, for three transient decay times: nearly all the motion happens in the first seconds regardless of the total anneal length.](/courses/electronic-devices/figures/m22-ted-decay.svg)

### Worked example C2.1 - why the spike wins

With $f_0 = 1000$ and $\tau = 5$ s, compare a 30 s soak against a spike
whose time above peak-equivalent temperature is 0.5 s (lesson 5, A22.30
arithmetic). Enhancement integral for the soak:
$f_0\tau(1 - e^{-6}) \approx 5000$ equivalent seconds against 30 real ones;
for the spike, $f_0\tau(1-e^{-0.1}) \approx 476$ against 0.5. The spike
takes ten times less TED motion while still reaching activation
temperature, and a millisecond flash cuts the residual another order. The
industry's anneal history, furnace to RTA to spike to flash, is this
integral being minimized in stages. Co-implanted carbon attacks $f_0$
instead, trapping interstitials chemically; a fin geometry attacks $\tau$
through the $L^2/\pi^2D_I$ sink argument of lesson 3. Three attacks on one
integral, and a modern extension recipe uses all three.

**Failure mode.** Activation and TED share the same thermal axis: an
anneal cold enough to avoid all TED also activates nothing, and the dopant
sits clustered and inactive (lesson 2's SIMS-versus-SRP gap). The recipe
is a saddle point, not an optimum, and it is audited from both sides.

## Case 3 - the contaminated lot

**Brief.** A lot shows collapsed minority-carrier lifetime after a new
metallization vendor's step. SIMS on the junction region shows nothing
above background. Decide what happened and what to do.

**Decision path.** Lifetime collapse with clean junction SIMS is the
signature of an interstitial metal at $10^{11}$ cm⁻³, three orders below
SIMS detection but four orders above the deep-level lethal dose (lesson 2,
section 4). Copper's numbers from the data book: at even 100 °C of back-end
processing it crosses the wafer in minutes. Confirm with a lifetime map
(module 36) and DLTS for the level signature, not with more SIMS.
Containment: quarantine the vendor step, then getter: a backside phosphorus
diffusion or the internal oxygen precipitates of module 21, lesson 6, both
of which work precisely because the metal's interstitial mobility lets it
find the sink at low temperature. The same physics that caused the problem
executes the cure, which is this module's favourite closing irony.

## Case 4 - the buried layer that must not move

**Brief.** A bipolar process needs a heavily doped n-type buried layer
under 2 μm of epitaxial silicon. The epi growth itself runs 30 minutes at
1050 °C, and the finished device needs the buried-layer boundary to blur by
less than 100 nm through the entire flow.

**Design.** This is a dopant-selection problem, and the module's Arrhenius
table decides it. The blur of an initially abrupt boundary after a thermal
budget $\int D\,dt$ is of order $2\sqrt{\int D\,dt}$, and because the
budget adds linearly in $Dt$, a 100 nm blur allowance is a lifetime
account of $Dt_{\max} = (5\times10^{-6})^2 = 2.5\times10^{-11}$ cm². The
epi step alone, at $k_BT = 0.1140$ eV, gives each candidate its audition.
Phosphorus: $D = 4\,e^{-3.7/0.1140} = 3.2\times10^{-14}$ cm²/s, so the
step spends $Dt = 5.8\times10^{-11}$ cm², over twice the lifetime
account: disqualified before the rest of the flow spends anything.
Arsenic: $D = 10\,e^{-4.0/0.1140} = 5.8\times10^{-15}$ cm²/s, spending
$1.0\times10^{-11}$ cm², which is blur of 65 nm and forty percent of the
account gone on step one: legal but living paycheque to paycheque.
Antimony, slower still by the same table's logic, is the traditional
buried-layer dopant precisely for this immobility, with arsenic taken
when higher solubility matters more than the margin. The selection rule
generalizes across the course: **when a profile must survive processing,
choose the dopant by its diffusivity first and its solubility second**,
the same reasoning that picked carbon for HBT bases in lesson 3.

**Failure mode.** Autodoping: during the epi step the buried layer
out-diffuses and evaporates dopant into the gas phase, which re-deposits
ahead of the growth front and raises the epi background. The
countermeasures, a capping ramp, reduced pressure, and again the slowest
adequate dopant, are diffusion engineering applied to the gas boundary
condition rather than the solid, and forgetting them costs the epi its
resistivity spec even while the buried layer itself stays in budget.

## Comprehensive exam

Answer all eight. The data book (lesson 5, section 7) is the only allowed
reference; every question is solvable with it plus this module's stated
equations.

**Q1.** A predeposition doubles its time. State the change in dose, in
surface concentration, and in the depth of the $10^{-4}C_s$ contour.

**Q2.** From the stated parameters, compute phosphorus's diffusivity at
1100 °C and the drive time for a 0.5 μm junction from a surface at
$10^{19}$ cm⁻³ over a $10^{16}$ cm⁻³ background.

**Q3.** A boron profile in heavily n-type material diffuses slower than in
intrinsic material at the same temperature. Which vehicle charge sign does
this implicate, and through which equation?

**Q4.** Rank for abruptness of the as-diffused front and justify in one
line each: erfc boron, extrinsic zinc in GaAs, arsenic.

**Q5.** A II-VI layer flips from p to n after a sealed anneal. What was in
the ampoule, and what mass-action statement governs?

**Q6.** A 7 nm nanosheet and a bulk monitor wafer get the same implant and
spike. Which shows more TED motion and by roughly what mechanism-based
factor is its transient shorter?

**Q7.** A CZ crystal's tail-end resistivity is 40 percent of its seed-end
value for a $k = 0.35$ dopant. What fraction was grown when the tail was
cut?

**Q8.** A colleague fits Arrhenius parameters from three points spanning
40 K and announces a Meyer-Neldel rule across two such fits. Give the two
audit objections, one statistical, one physical.

### Answers

**A1.** Dose grows as $\sqrt{t}$: factor $\sqrt{2} = 1.41$. Surface
concentration is pinned at $C_s$: unchanged. The $10^{-4}$ contour sits at
fixed $\eta$, so it advances as $\sqrt{Dt}$: factor 1.41. One solution,
three different sensitivities, and the exam's easiest trap is answering
"doubles" to any of them.

**A2.** $k_BT = 0.1183$ eV; $D = 4\,e^{-3.7/0.1183} = 4\,e^{-31.3} =
1.0\times10^{-13}$ cm²/s. Junction condition squared:
$x_j^2 = 4\,Dt\,\ln(10^{19}/10^{16}) = 4\times6.9\,Dt$, so with
$x_j = 5\times10^{-5}$ cm, $Dt = 2.5\times10^{-9}/27.6 =
9.1\times10^{-11}$ cm², hence $t = 9.1\times10^{-11}/1.0\times10^{-13} =
910$ s $\approx 15$ minutes. Marking note: the most common slip in this
module is losing the factor 4 when squaring $x_j = 2\sqrt{Dt\ln(\cdot)}$,
which returns 4 minutes and a junction 0.25 μm short; check the factor
before checking anything else.

**A3.** Slower with higher $n$ implicates a positively charged vehicle:
the $D^{+}(n_i/n)$ term of the charged-vehicle sum is the only one that
falls as $n$ rises. Boron's vehicle bookkeeping in n-type material is read
off exactly this way.

**A4.** Zinc sharpest: $D \propto C^2$ dies with concentration, so the
front is a wall (lesson 3's computed figure). Arsenic next: slow,
vacancy-mediated, high contrast. Erfc boron least abrupt: constant $D$
with field enhancement $h \to 2$ steepening the front only mildly.

**A5.** The ampoule held the volatile constituent, mercury (or the group
II/VI element generally) at high overpressure. Governing statement:
$[V_{\mathrm{II}}] \propto 1/p_{\mathrm{II}}$; filling the acceptor-like
vacancies removes the p-doping and residual donors take over.

**A6.** The bulk wafer shows more TED motion. The nanosheet's transient
dies in $\tau \approx L^2/\pi^2D_I$: for 7 nm against a 100 nm damage-to-
surface distance, the ratio is $(100/7)^2 \approx 200$ times shorter, and
in absolute terms microseconds against the ramp-scale times where bulk TED
does its damage.

**A7.** Resistivity at 40 percent means concentration at $1/0.4 = 2.5$
times the seed value. Seed lays down $kC_0$; solve
$(1-g)^{k-1} = 2.5$: $(1-g)^{-0.65} = 2.5$, $\ln$: $-0.65\ln(1-g) =
0.916$, $\ln(1-g) = -1.41$, $1-g = 0.244$: the tail cut came at
$g \approx 0.76$, three quarters grown.

**A8.** Statistical: over 40 K the fitted $(\ln D_0, E_a)$ covariance
ellipse lies along the compensation direction, so two fits generate a
two-point "rule" from noise alone; demand the covariance or a wider
temperature span. Physical: a rule needs a family, related processes
sharing a mechanism; two arbitrary fits are not a family, and no mechanism
has been identified for the claimed $E_{MN}$.

## Oral-defense prompts

1. Defend the claim "a diffusivity is a defect population in disguise"
   using three pieces of evidence from three different lessons.
2. Your junction is 8 percent too deep on the monitor wafer. Walk through
   the decision tree: which measurements, in which order, distinguish
   furnace error, TED underestimate, and regime misclassification?
3. Explain to a manager, without equations, why the fab's fastest anneal
   and its purest crystal both exist because of the same square root.
4. The module states $h \le 2$ and $f = 0.5$ as exact. Explain where each
   number comes from and what would have to be true of the physics for
   either to change.
