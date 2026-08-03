# Aggregation: Nucleation, the Burst and the Ripening Aftermath

<!-- covers: 21.2, 21.3 -->

Lesson 2 left the winning defect species supersaturated by four orders of
magnitude — a reservoir of stored free energy. This lesson spends it. The
spending mechanism, classical nucleation, has a barrier that makes the
onset of aggregation an all-or-nothing threshold; crossing it during
cooldown produces a short, violent burst that fixes the aggregate
population for the crystal's whole life. Size, density, and their
inescapable trade-off all follow from three formulas and one conservation
law — the working mathematics of this lesson.

**Level.** Sections 1 to 4 undergraduate core; section 5 graduate;
section 6 problems.

## 1. The nucleation barrier

Let the supersaturated species (take vacancies; the loop story is
parallel) begin assembling a spherical cluster of radius $r$. The
cluster's free energy balances a volume gain against a surface tax:

$$
\Delta G(r) = -\frac{4}{3}\pi r^3\,\frac{k_BT\ln S}{\Omega}
+ 4\pi r^2\sigma,
$$

with $\Omega$ the atomic volume, $\sigma$ the void's surface energy
(~1 J/m² for silicon's internal surfaces) and $S$ the supersaturation
ratio of lesson 2. Small clusters are surface-dominated and cost energy;
large ones are volume-dominated and release it. Between sits the maximum:

![Cluster free energy against radius for a low and a high supersaturation: each curve climbs a surface-tax hill to a critical radius, and stronger supersaturation lowers both the hill and its position.](/courses/electronic-devices/figures/m21-nucleation-barrier.svg)

Setting $d\Delta G/dr = 0$ gives the **critical radius** and barrier:

$$
r^* = \frac{2\sigma\Omega}{k_BT\ln S},
\qquad
\Delta G^* = \frac{16\pi\sigma^3\Omega^2}{3(k_BT\ln S)^2}.
$$

![Critical radius against supersaturation ratio: near equilibrium the critical nucleus is enormous and unreachable, at strong supersaturation it shrinks to atomic scale.](/courses/electronic-devices/figures/m21-critical-radius.svg)

A cluster below $r^*$ tends to redissolve; above, growth is downhill.
Both quantities collapse as $S$ grows — the physical content of "cooling
arms the bomb": at the interface ($S = 1$) nucleation is impossible
($r^* \to \infty$); a few hundred kelvin later $r^*$ is a nanometre and
the barrier a few electron-volts.

### Worked example 1.1 — the barrier in numbers

At $T = 1100$ K with $S = 4\times10^{4}$ (worked example 3.1 of lesson
2), $\sigma = 0.95$ J/m², $\Omega = 2\times10^{-29}$ m³:
$k_BT\ln S = (1.52\times10^{-20})(10.6) = 1.61\times10^{-19}$ J. Then

$$
r^* = \frac{2(0.95)(2\times10^{-29})}{1.61\times10^{-19}}
\approx 0.24\ {\rm nm},
\qquad
\Delta G^* = \frac{16\pi(0.95)^3(2\times10^{-29})^2}
{3(1.61\times10^{-19})^2}
\approx 2.2\times10^{-19}\ {\rm J} \approx 1.4\ {\rm eV}.
$$

A critical nucleus of a few atoms and a barrier around an electron-volt:
readily crossed by thermal fluctuation. The same evaluation at $S = 10$
gives $r^* \approx 1.1$ nm and $\Delta G^* \approx 28$ eV — utterly
uncrossable. Somewhere between those supersaturations, reached at a
specific temperature during cooldown, the crystal switches from inert to
explosive; finding that temperature is the next section's business.

## 2. The rate threshold and the burst

Fluctuations surmount the barrier at a rate per unit volume

$$
J = J_0\exp\!\left(-\frac{\Delta G^*}{k_BT}\right)
= J_0\exp\!\left[-\frac{B}{(\ln S)^2}\right],
$$

the second form exposing the structure: the barrier enters through
$1/(\ln S)^2$, so $J$ is *hyper*-exponentially sensitive to
supersaturation.

![Nucleation rate against supersaturation ratio on a log scale: negligible over most of the range, then climbing tens of orders of magnitude across a narrow threshold band.](/courses/electronic-devices/figures/m21-nucleation-rate.svg)

Now run the cooldown movie. Temperature falls; $S(T)$ climbs; $J$ stays
effectively zero until the threshold band, then leaps from
never-in-the-age-of-the-universe to everywhere-at-once. Nucleation
happens as a **burst** in a narrow temperature window (for voids in
vacancy-rich CZ silicon, near 1100 °C). The burst self-terminates: the
new nuclei grow, draining the supersaturation that feeds $J$, and the
rate collapses as violently as it rose. Result: a nucleation *event*,
not a process — a population census taken in a few kelvin of cooling,
after which no new members join. Everything observable about voids
(their density's sensitivity to cooling rate through *that specific
window*, their striking size uniformity — all nucleated together, grown
together) is this burst's signature.

## 3. Growth, conservation and the trade-off

After the burst, the $N$ nuclei per unit volume grow diffusion-limited,
radius following the universal square root

$$
r(t) \approx \sqrt{2D\,\delta C\,\Omega\, t}\ \ {\rm (schematically)},
\qquad r \propto \sqrt{Dt},
$$

until the reservoir runs dry. Conservation then chains size to density:
the frozen-in excess $C_V$ is fixed, so

$$
N\cdot\frac{4\pi r_f^3}{3\Omega} \approx C_V
\quad\Longrightarrow\quad
r_f \propto N^{-1/3}.
$$

The knob behind $N$ is the cooling rate through the nucleation window:
quench fast and the supersaturation overshoots deep into the threshold
band before draining — many nuclei, small final size; cool slowly and
the first sparse nuclei drain the reservoir gently — few, large voids.

![Void density and void size against cooling rate through the nucleation window: the conservation law forces them to trade, and the product of density and cubed size stays fixed.](/courses/electronic-devices/figures/m21-void-tradeoff.svg)

![Two cooling trajectories through the aggregation windows: hot-zone design determines how long each crystal section spends where voids and oxygen precipitates nucleate.](/courses/electronic-devices/figures/m21-thermal-history.svg)

Which end to prefer is a *device* question with a famous non-obvious
answer. Total voided volume is fixed — but harm is not proportional to
volume. A COP damages a gate when a void of tens of nanometres meets it:
many small voids means many scanner counts but each too small to kill a
modern thin oxide; few large ones means rare but lethal intersections.
The industry's fast-cool hot zones (small, numerous voids) and the
anneal-out strategies (dissolving the small ones entirely from a
surface skin) both exploit the trade's small-and-many end.

### Worked example 3.1 — budgeting the voids

A vacancy excess of $6\times10^{13}$ cm⁻³ aggregates completely. For a
resulting void density of $2\times10^{6}$ cm⁻³ (slow-cool regime),
each void contains $3\times10^{7}$ vacancies; with
$\Omega = 2\times10^{-23}$ cm³, void volume
$= 6\times10^{-16}$ cm³, diameter

$$
d = \left(\frac{6V}{\pi}\right)^{1/3}
= \left(\frac{6\times6\times10^{-16}}{\pi}\right)^{1/3}
\approx 1.05\times10^{-5}\ {\rm cm} \approx 105\ {\rm nm}.
$$

Repeat at $2\times10^{8}$ cm⁻³ (fast cool): 100× the density, each void
$10^{-2}$ the volume → diameter 22 nm. The first population murders
65 nm-node gate oxides; the second slips beneath the scanner's and the
oxide's thresholds alike. Same vacancy budget, opposite commercial
fates — the conservation law is the whole story, and it is three lines
of arithmetic.

## 4. Ripening: the aftermath

The burst's population is not the final word on long anneals. With the
supersaturation spent, surface energy still discriminates: the
equilibrium concentration adjacent to a small precipitate exceeds that
near a large one (the Gibbs-Thomson effect, exponentiating $2\sigma
\Omega/rk_BT$), so defects evaporate from small aggregates and condense
on large — **Ostwald ripening**:

![Precipitate size distributions at three stages of ripening: the mean grows, the count falls, and the small tail continually dissolves to feed the large.](/courses/electronic-devices/figures/m21-ostwald.svg)

The coarsening follows the classic $\bar r \propto t^{1/3}$ scaling in
the diffusion-limited case, with the count falling to conserve mass.
Ripening matters twice downstream: it is why extended high-temperature
device processing *coarsens* an oxygen-precipitate population (lesson 6)
— helpful when large sinks getter better, harmful when a denuded zone's
small survivors regrow — and why "the same crystal" measured after
different thermal simulations reports different defect densities: the
census keeps editing itself, and any quoted density silently carries its
thermal history, this module's version of the conditions-attached rule.

## 4b. The rate-equation picture: how the industry actually computes

The analytic story of sections 1-4 — barrier, burst, trade — is the
skeleton; production hot-zone design puts flesh on it with **cluster
rate equations**. Track the concentration $f_n$ of clusters containing
$n$ defects; each grows or shrinks by single attachment and emission:

$$
\frac{df_n}{dt} = \beta_{n-1}f_{n-1} - (\beta_n + \alpha_n)f_n
+ \alpha_{n+1}f_{n+1},
$$

with attachment rates $\beta_n \propto D\,C_1\,n^{1/3}$
(diffusion-limited onto a cluster's surface) and emission rates
$\alpha_n$ fixed by detailed balance against the Gibbs-Thomson-corrected
equilibrium — the same two physical inputs the analytic theory used, now
solved as a few-thousand-ODE ladder along the crystal's simulated
$T(t)$. What the ladder adds is everything the analytic compression
discarded: the burst's finite width, the survival of sub-critical
clusters into later windows, the interaction of the void window with the
oxygen window further down the cooldown, and honest size
*distributions* rather than a single $(N, r_f)$ pair. What it does not
add is new physics — every coefficient traces back to a diffusivity, a
surface energy and an equilibrium concentration from this module's
tables, which is why the analytic theory remains the audit tool of
choice: when a simulation's output violates the conservation trade
$N r_f^3 \approx C_{excess}\Omega\cdot3/4\pi$ or predicts nucleation
at $S$ values whose barrier exceeds ~60 $k_BT$, the model, not the
physics, is broken. The division of labour mirrors module 20's
micromagnetics: closed forms to *understand and audit*, rate ladders to
*predict and optimize* — and an engineer fluent in only one of the two
is at the mercy of the other.

## 5. Graduate extension: heterogeneous shortcuts and the oxygen assist

Classical *homogeneous* nucleation is the clean textbook route, and real
crystals cheat it. Any pre-existing internal surface — an oxide
precipitate's interface, a residual impurity cluster, even the strain
field of dissolved oxygen — offers a site where part of the surface tax
is already paid: **heterogeneous nucleation** with an effective barrier
$\Delta G^*_{het} = f\cdot\Delta G^*$, $f < 1$ set by wetting geometry.
Two consequences organize CZ practice. First, voids in oxygen-bearing CZ
silicon actually nucleate with an oxide-assisted character — their inner
walls carry a thin oxide lining, and the void window sits where vacancy
and oxygen chemistry can cooperate: the textbook homogeneous formulas
predict the *shape* of the phenomenology (thresholds, trade-offs)
robustly but their absolute temperatures only after calibration.
Second, heterogeneous assistance is a *tool*: nitrogen doping at parts-
per-billion seeds vacancy aggregation earlier and finer (small, benign
voids plus enhanced oxygen precipitation — a commercial wafer variant),
and lesson 6's entire internal-gettering architecture is deliberately
engineered heterogeneous nucleation. The graduate posture toward the
classical theory follows: trust its logarithms, calibrate its
prefactors, and treat every real nucleation temperature as the
homogeneous prediction amended by whatever surfaces the crystal already
contains.

## 6. Problems

**P21.19** Evaluate $r^*$ and $\Delta G^*$ at $T = 1000$ K for
$S = 10^{3}$ and $S = 10^{5}$ ($\sigma = 0.95$ J/m²,
$\Omega = 2\times10^{-29}$ m³), and state which case nucleates on
process timescales (compare $\Delta G^*$ to ~40 $k_BT$).

**P21.20** Show from the two formulas that
$\Delta G^* = \frac{4}{3}\pi r^{*2}\sigma$ — one third of the critical
cluster's surface energy — and use it to explain in one sentence why
lowering $\sigma$ (heterogeneous sites) is so effective.

**P21.21** A hot-zone change doubles the cooling rate through the void
window and is observed to raise void density 8×. What does the
conservation law predict for the diameter change, and for the response
of (a) a particle scanner thresholded at 60 nm, (b) gate-oxide-integrity
yield on 3 nm oxides?

**P21.22** Using the Gibbs-Thomson factor $e^{2\sigma\Omega/rk_BT}$,
compute the equilibrium-concentration ratio between the surfaces of
20 nm and 200 nm voids at 1300 K, and explain which way defects flow.

**P21.23** Nitrogen-doped CZ shows finer, denser voids at identical
$v/G$ and cooling. Locate the change in the framework of sections 1-3:
which quantity did nitrogen move, and which observable confirms it?

**P21.24** A wafer vendor reports void density from a laser scattering
tomograph; a customer reports COP density from a surface scanner after
SC1. The numbers differ by 50×. Reconcile without assuming anyone erred.

### Answers

**A21.19** $k_BT = 1.38\times10^{-20}$ J. $S = 10^{3}$:
$\ln S = 6.9$, $k_BT\ln S = 9.5\times10^{-20}$;
$r^* = 2(0.95)(2\times10^{-29})/9.5\times10^{-20} = 0.40$ nm;
$\Delta G^* = 16\pi(0.857)(4\times10^{-58})/(3\cdot9.1\times10^{-39})
\approx 6.3\times10^{-19}$ J $\approx 46\,k_BT$ — marginal, slow.
$S = 10^{5}$: $\ln S = 11.5$, barrier scales by $(6.9/11.5)^2 = 0.36$:
$\approx 17\,k_BT$ — fast nucleation. The threshold band lives between.

**A21.20** Substitute $r^*$ into $\Delta G(r^*)$: the volume term
equals $-\frac{8}{3}\pi r^{*2}\sigma$ and the surface term
$4\pi r^{*2}\sigma$, leaving $\frac{4}{3}\pi r^{*2}\sigma$. Since the
barrier *is* one third of the critical surface bill, any site that
pre-pays surface (a wall, an interface) cuts the barrier
proportionally — heterogeneous nucleation wins by discount, not by new
physics.

**A21.21** $r_f \propto N^{-1/3}$: 8× density → diameter halves.
(a) A population that halved its diameter largely drops below a fixed
60 nm threshold: scanner counts *fall* even as true density rose 8× —
metrology inversion, worth a memo. (b) Smaller voids thin the oxide
less severely; GOI yield typically *improves*. Both instruments moved
opposite to the naive expectation, courtesy of one conservation law.

**A21.22** Exponent: $2\sigma\Omega/rk_BT$ with
$k_BT = 1.79\times10^{-20}$ J. For $r = 10$ nm:
$2(0.95)(2\times10^{-29})/(10^{-8}\cdot1.79\times10^{-20}) = 0.21$;
for $r = 100$ nm: 0.021. Ratio $e^{0.19} \approx 1.21$: the small
void's surface holds ~21% higher equilibrium concentration, so the net
flow is small → large. Gentle per-pair, relentless in aggregate — the
$t^{1/3}$ crawl.

**A21.23** Nitrogen supplies heterogeneous sites (and binds vacancies
into complexes that nucleate early): effectively lower $\sigma$/higher
$f$-discount → threshold crossed at higher temperature, more nuclei
before drain → larger $N$, and conservation delivers the finer size.
Confirming observable: the void nucleation window shifted upward in
temperature (measurable by interrupted-cooling experiments), plus the
denser-finer population itself.

**A21.24** Different instruments define different populations (lesson
1's audit rule): the tomograph counts *bulk* voids above its optical
detection size throughout a volume; the scanner counts only voids
*intersecting the polished surface* and opened by the clean, above a
size threshold, per area. Converting bulk density to areal
intersection (density × diameter) and applying different size floors
easily spans 50×. The reconciliation is a definitions table, not a
dispute — and the data book (lesson 7) provides exactly that.
