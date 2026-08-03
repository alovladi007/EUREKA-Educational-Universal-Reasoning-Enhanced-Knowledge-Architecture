# Vacancies and Interstitials: Thermophysics of the Native Pair

<!-- covers: 21.2 -->

Lesson 1 proved the native defects must exist; this lesson gives them
their working physics — how fast each moves, how they annihilate each
other, and how a cooling crystal ends up holding orders of magnitude more
of one species than equilibrium allows. These are the coefficients and
mechanisms that lesson 3's growth criterion and lesson 4's aggregation
burst consume as inputs.

**Level.** Sections 1 to 4 undergraduate core; section 5 graduate; section 6
problems.

## 1. Two random walkers

Each species migrates by thermally activated hops, giving Arrhenius
diffusivities

$$
D_{V,I} = D_0\,\exp\!\left(-\frac{E_m}{k_BT}\right),
$$

with migration energies near 0.4–1 eV — far smaller than the ~4 eV
formation energies, so a defect that exists moves readily at high
temperature. The self-interstitial is the faster walker at growth
temperatures:

![Vacancy and self-interstitial diffusivities against inverse temperature with representative migration energies: the interstitial out-runs the vacancy, the asymmetry the growth criterion exploits.](/courses/electronic-devices/figures/m21-diffusivity.svg)

The *products* $C_{eq}D$ — how much transport each species can actually
perform — are the quantities experiments constrain best (lesson 1
section 5), and their near-equality at the melting point, with opposite
temperature slopes, is the finely balanced competition from which
lesson 3's criterion emerges. Numbers worth carrying: near the melt both
species diffuse at $\sim10^{-4}$ cm²/s — a micrometre in a millisecond —
while by 900 °C the vacancy is effectively parked on device timescales.

## 2. Recombination: the pair annihilates

The two species are each other's antiparticles: a vacancy meeting an
interstitial restores the perfect lattice,

$$
V + I \;\rightleftharpoons\; 0,
\qquad
C_VC_I \big|_{eq} = C_V^{eq}C_I^{eq},
$$

with a large energy release (~7–8 eV, the sum of the formation
energies). At high temperature recombination is fast enough to hold the
*product* of the two concentrations near its equilibrium value even when
each individual concentration is perturbed — the quasi-equilibrium
assumption underlying lesson 3's analysis. Its consequence is a seesaw:
any process that enriches one species necessarily starves the other,
which is why a crystal emerges from growth with an excess of *either*
vacancies *or* interstitials, never both. One species wins the first
act; the loser is annihilated to feed the victory.

### Worked example 2.1 — the recombination-limited window

Estimate the time for recombination to relax a 10% interstitial excess
at 1400 °C, where $D_I \sim 5\times10^{-5}$ cm²/s and vacancies number
$C_V \sim 10^{14}$ cm⁻³. Treating vacancies as static traps of capture
radius $r_c \approx 0.5$ nm, the interstitial lifetime is

$$
\tau = \frac{1}{4\pi r_c D_I C_V}
= \frac{1}{4\pi(5\times10^{-8})(5\times10^{-5})(10^{14})}
\approx 0.3\ {\rm s}.
$$

Seconds — while the crystal spends *minutes* per centimetre of growth at
these temperatures. Near the interface, recombination is effectively
instantaneous on the process timescale, validating quasi-equilibrium; by
1100 °C the same estimate stretches toward hours as both $D$ and $C$
collapse, and the surviving species decouples. The window between "too
fast to matter" and "too slow to matter" is exactly where the crystal's
fate is sealed.

## 3. Supersaturation: the gap that drives everything

Follow the winning species down the temperature axis. Its actual
concentration, set near the interface, is nearly conserved during the
rapid cool (losses only to distant surfaces and recombination with the
dwindling minority). Its *equilibrium* concentration meanwhile collapses
exponentially. The ratio

$$
S(T) = \frac{C(T)}{C^{eq}(T)}
$$

therefore explodes from 1 at the interface to $10^{3}$–$10^{5}$ within a
few hundred kelvin of cooling:

![Frozen-in concentration against the collapsing equilibrium during cooldown: the widening gap is the supersaturation that will pay for every aggregate in the next lesson.](/courses/electronic-devices/figures/m21-supersaturation.svg)

Supersaturation is stored thermodynamic anger: a free-energy reservoir
$k_BT\ln S$ per defect (about 0.7 eV at $S = 10^{3}$, 1150 K) available
to pay for aggregation. Lesson 4 spends this reservoir; here the point
is its *inevitability* — no cooling schedule avoids it, because the
alternative (staying at equilibrium) would require the defect population
to evaporate through a crystal that is freezing solid around it. Defect
engineering therefore never asks *whether* supersaturation develops,
only *where it gets spent*: on many small harmless clusters, few large
dangerous ones, or (lesson 6's trick) on deliberately provided sinks.

### Worked example 3.1 — sizing the reservoir

A vacancy-rich crystal freezes in $C_V = 8\times10^{13}$ cm⁻³. By
1100 K the equilibrium value (lesson 1's Arrhenius with
$E_f = 4.0$ eV, prefactor matched to $10^{13.2}$ cm⁻³ at 1685 K) has
fallen to $\sim2\times10^{9}$ cm⁻³. Supersaturation:

$$
S = \frac{8\times10^{13}}{2\times10^{9}} = 4\times10^{4},
\qquad
k_BT\ln S = (0.0948\ {\rm eV})(10.6) \approx 1.0\ {\rm eV}
$$

per vacancy. A reservoir of one electron-volt per defect, $10^{13}$-fold
per cm³ — chemistry-scale energy waiting for a mechanism. The next
lesson's nucleation threshold is the tap.

## 4. The interface: where the census is taken

The concentrations that matter are set in the first millimetres behind
the solid-liquid interface, where three currents compete. **Convection**:
the crystal moves away from the interface at pull rate $v$, carrying its
frozen-in defects — a flux $vC$ for each species. **Fickian
back-diffusion**: the steep temperature gradient $G$ makes equilibrium
concentrations fall steeply with distance, so defects diffuse *toward*
the interface, down their concentration gradients — a flux
$\sim DC^{eq}E_f G/k_BT^2$ favouring the better transporter.
**Recombination**: enforcing the seesaw of section 2 between them. Fast
pulling (large $v$) lets convection win for the more *abundant* species —
the vacancy; slow pulling in a steep gradient lets back-diffusion win for
the more *mobile* species — the interstitial. The competition depends on
the two knobs only through their ratio, and lesson 3 turns that
observation into the industry's most consequential single parameter.

## 4b. The minimal transport model, written down

The three-current picture becomes quantitative in one equation. In the
frame of the moving crystal (growth along $z$ at rate $v$), each
species' concentration obeys a steady drift-diffusion-reaction balance:

$$
\frac{\partial}{\partial z}\!\left(D\frac{\partial C}{\partial z}\right)
- v\frac{\partial C}{\partial z}
- k_r\left(C_VC_I - C_V^{eq}C_I^{eq}\right) = 0,
$$

with the temperature field entering through $D(T(z))$ and
$C^{eq}(T(z))$, and $T(z)$ supplied by the hot-zone's thermal model
($G = dT/dz$ at the interface). Boundary conditions: equilibrium at the
interface ($C = C^{eq}(T_m)$ — the melt is a perfect reservoir) and
vanishing gradients far downstream. This two-species boundary-value
problem *is* the industry's growth simulator's core; everything lesson 3
says is a statement about its solutions. One analytic landmark deserves
its own line: far from the interface, where recombination has retired
the minority species, the survivor's equation reduces to pure
convection of a frozen concentration, and the crossover happens where
the local equilibration time exceeds the transit time — defining an
**effective freeze-out temperature** by

$$
\tau_{\rm eq}(T_f) \approx \frac{k_BT_f^2}{E_f\,G\,v},
$$

the time the crystal spends in the temperature interval over which
$C^{eq}$ changes appreciably. Above $T_f$ the census tracks
equilibrium; below, it is cargo. Every "frozen-in concentration" this
module quotes is shorthand for "the equilibrium value at that
trajectory's $T_f$" — which is why the frozen amount depends on $v$ and
$G$ separately (through the trajectory), even though the *species
choice* of lesson 3 depends only on their ratio. The distinction —
ratio picks the winner, trajectory sizes the prize — is worth a
margin note now, because it resurfaces as an exam trap and as the
reason two hot zones at identical $v/G$ can ship different void
densities.

## 5. Graduate extension: charge states and the doping seesaw

Both native defects are amphoteric: $V$ and $I$ each possess several
charge states within the gap ($V^{2-}$ through $V^{2+}$ across the known
spectrum), and each charged state's formation energy shifts with the
Fermi level by its charge times $E_F$. Consequences ripple through
everything this module and module 24 (diffusion) do. Heavy n-type doping
raises the equilibrium population of acceptor-like vacancies —
measurably enhancing vacancy-mediated diffusion of dopants like
antimony; heavy p-type favours differently charged species and shifts
the balance toward interstitial-mediated mechanisms (boron and
phosphorus diffuse via $I$; their anomalous behaviours — emitter push,
oxidation-enhanced diffusion — are interstitial weather reports). For
crystal growth, the practical corollary is that the critical ratio of
lesson 3 *shifts with heavy doping*: strongly n-type crystals grow
vacancy-richer at the same $v/G$, and growers of heavily doped product
maintain their own calibration curves rather than borrowing the
lightly-doped literature value. The audit rule generalizes lesson 1's:
every "constant" of native-defect physics silently assumes a Fermi
level, and moving it is moving the constant.

## 6. Problems

**P21.7** Evaluate both diffusivities of the figure's parameters at
1685 K and at 1000 K, and the distance $\sqrt{4Dt}$ each species covers
in one hour at each temperature. Which statements like "vacancies are
mobile" survive the temperature qualifier?

**P21.8** From the law of mass action for $V+I\rightleftharpoons0$,
show that if growth enriches vacancies by a factor 3 over equilibrium
while quasi-equilibrium holds, interstitials are depleted to 1/3 — and
compute the net excess $C_V - C_I$ in units of $C^{eq}$ (take both
equilibria equal).

**P21.9** Repeat worked example 3.1 for an interstitial-rich crystal
with $C_I = 3\times10^{13}$ cm⁻³ frozen in, $E_f = 4.4$ eV, prefactor
matched to $10^{13}$ cm⁻³ at 1685 K, at 1200 K. Is the interstitial or
the vacancy reservoir larger at the same temperature, and why does the
answer favour void formation over loop formation happening *earlier* in
the cooldown?

**P21.10** The capture-radius estimate of worked example 2.1 treated
vacancies as static. Justify that approximation at 1400 °C using the
diffusivity figure, and state when it fails.

**P21.11** A crystal grower doubles the pull rate and observes the
defect regime flip from interstitial-type etch patterns to COPs.
Explain with section 4's three currents, without using the word
"Voronkov."

**P21.12** Heavily arsenic-doped crystals ($n \gg n_i$ at growth
temperatures? — consider) are observed to be more vacancy-rich than
lightly doped ones at identical $v/G$. Using section 5, give the
mechanism, and explain the flagged subtlety about $n/n_i$ at 1685 K.

### Answers

**A21.7** At 1685 K: $D_I \approx 2\times10^{-3}e^{-0.9/0.145}\times30
\approx 1.2\times10^{-4}$ cm²/s; $D_V \approx 3\times10^{-6}
e^{-0.4/0.145} \approx 1.9\times10^{-7}$... using the figure's
constructed prefactors, both land near $10^{-4}$–$10^{-7}$ cm²/s;
one-hour ranges $\sqrt{4Dt}$: interstitial ~1.3 cm, vacancy ~0.05 cm.
At 1000 K the ranges shrink to tens of micrometres and micrometres
respectively. "Mobile" survives only as "mobile above ~1200 K on
process timescales" — the qualifier is the content.

**A21.8** Mass action: $C_VC_I = C^{eq}_VC^{eq}_I$. With
$C_V = 3C^{eq}$: $C_I = C^{eq}/3$. Net excess
$= 3C^{eq} - C^{eq}/3 = (8/3)C^{eq} \approx 2.7C^{eq}$ of vacancies —
enrichment of one species *is* depletion of the other, and the net
excess is what survives to aggregate.

**A21.9** $C^{eq}_I(1200) = 10^{13}e^{-4.4(1/0.1034 - 1/0.1452)}
\approx 10^{13}e^{-12.2} \approx 5\times10^{7}$ cm⁻³;
$S = 3\times10^{13}/5\times10^{7} = 6\times10^{5}$;
$k_BT\ln S \approx 0.1034\times13.3 \approx 1.4$ eV. The interstitial's
larger formation energy makes its equilibrium collapse faster, so at
matched temperature its supersaturation is larger — but vacancy crystals
aggregate *earlier* (higher T) because the void's binding is stronger
per defect and its nucleation barrier lower; the reservoir size alone
does not order the events, the barrier does (lesson 4's point).

**A21.10** Static-trap capture requires the trap to move slower than
the walker: $D_V/D_I \ll 1$ at 1400 °C by an order or more per the
figure, so vacancy motion adds only a modest correction (formally,
replace $D_I$ with $D_I + D_V$). Fails when the diffusivities cross or
comparable — toward lower temperatures where the *vacancy* becomes the
relatively livelier species in some parameter sets, and in any case the
correction is bounded by factor 2.

**A21.11** Doubling $v$ doubles the convective flux $vC$ of both
species while leaving back-diffusion (set by $G$ and the transport
products) unchanged. Convection favours the more abundant species —
vacancies — so the crystal now retains a vacancy excess where
previously back-diffusion's preference for the more mobile
interstitial had the upper hand. The surviving species flipped, and
with it the aggregate family: COPs are the vacancy signature.

**A21.12** Acceptor-like vacancy charge states have lower formation
energy when the Fermi level is high: n-type doping raises equilibrium
$C_V$ at the interface, tilting the census toward vacancies at fixed
$v/G$. Subtlety: at 1685 K, $n_i \sim 10^{19}$ cm⁻³, so "heavily
doped" must mean comparable to *that* — degenerate-at-room-temperature
doping (~$10^{19-20}$) only modestly exceeds $n_i$ at the melt, which
is why the shift is real but not enormous, and why room-temperature
intuition about "heavily doped" misleads at growth temperature.
