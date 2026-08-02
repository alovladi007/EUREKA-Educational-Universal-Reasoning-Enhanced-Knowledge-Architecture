# Module 17 Supplement: Derivations and the Data Book

<!-- covers: 17.1, 17.2, 17.3 -->

Every module of this course closes with the proofs it postponed and the
numbers it will reuse. Four derivations here were invoked earlier as results;
each is short, and each is the kind an examiner asks for. The tables at the
end are the module's working data, gathered once.

## 1. The effective density of states, derived

Lesson 2 used $N_c$ as the degeneracy yardstick. It is the conduction band's
states, Boltzmann-weighted and folded to the band edge. Starting from the 3D
density of states of module 18,

$$
g(E)=\frac{(2m^{*})^{3/2}}{2\pi^{2}\hbar^{3}}\sqrt{E-E_c}
$$

the electron density in the non-degenerate limit is

$$
n=\int_{E_c}^{\infty}g(E)\,e^{-(E-E_F)/k_BT}\,dE
=\frac{(2m^{*})^{3/2}}{2\pi^{2}\hbar^{3}}\,e^{-(E_c-E_F)/k_BT}
\int_{0}^{\infty}\sqrt{x}\,e^{-x/k_BT}\,dx
$$

The integral is $\Gamma(3/2)(k_BT)^{3/2}=\tfrac{\sqrt{\pi}}{2}(k_BT)^{3/2}$,
giving

$$
\boxed{\;n=N_c\,e^{-(E_c-E_F)/k_BT},
\qquad
N_c=2\left(\frac{2\pi m^{*}k_BT}{h^{2}}\right)^{3/2}\;}
$$

### Worked example 1.1 — the yardstick, computed

Silicon, density-of-states mass $1.08\,m_0$, 300 K:

$$
N_c=2\left(\frac{2\pi\times1.08\times9.109\times10^{-31}
\times1.381\times10^{-23}\times300}{(6.626\times10^{-34})^{2}}\right)^{3/2}
$$

Inner bracket: $2\pi\times1.08\times9.109\times10^{-31}=6.18\times10^{-30}$;
times $k_BT=4.14\times10^{-21}$: $2.56\times10^{-50}$; over
$h^{2}=4.39\times10^{-67}$: $5.83\times10^{16}\ {\rm m^{-2}}$. To the 3/2:
$1.41\times10^{25}\ {\rm m^{-3}}$; times 2: $2.8\times10^{25}\ {\rm m^{-3}}
=2.8\times10^{19}\ {\rm cm^{-3}}$: the number lesson 2 quoted, now earned,
and with it the $T^{3/2}$ that quietly steepens every $n_i(T)$ plot in this
module beyond its pure exponential.

## 2. The 60 mV/decade slope, derived

Subthreshold current is diffusion of carriers over a gate-lowered barrier;
the carrier density at the source end of the channel follows Boltzmann in
the surface potential $\psi_s$:

$$
I\propto e^{e\psi_s/k_BT}
\quad\Rightarrow\quad
\frac{d(\log_{10}I)}{d\psi_s}=\frac{e}{k_BT\ln 10}
$$

The gate divides its voltage with the depletion (and trap) capacitance:

$$
\frac{d\psi_s}{dV_G}=\frac{C_{\rm ox}}{C_{\rm ox}+C_{\rm dep}+C_{\rm it}}
\equiv\frac{1}{n}
$$

so the swing is

$$
\boxed{\;S=n\,\frac{k_BT}{e}\ln 10\ \ge\ 59.6\ {\rm mV/decade\ at\ 300\ K}\;}
$$

The bound is saturated only when the gate owns the surface completely
($n\to1$): lesson 2's interface condition and module 43's EOT race are both
campaigns to hold $n$ near one, and the two escape routes (non-Boltzmann
injection, $n<1$ via ferroelectrics) are the graduate problem of lesson 2
restated as capacitor arithmetic.

## 3. The extraction cone, derived

Lesson 6 used $\eta_{\rm extr}\approx1/4n^{2}$. Photons inside a die of
index $n$ escape one face only within the critical cone
$\theta_c=\arcsin(1/n)$. For isotropic internal emission, the escaping
fraction is the cone's solid angle over $4\pi$, times the Fresnel
transmission; keeping the geometric factor:

$$
\frac{\Omega_c}{4\pi}=\frac{2\pi(1-\cos\theta_c)}{4\pi}
=\frac{1-\cos\theta_c}{2}
\approx\frac{\theta_c^{2}}{4}\approx\frac{1}{4n^{2}}
$$

using $\cos\theta_c\approx1-\theta_c^{2}/2$ and $\theta_c\approx1/n$ for
large $n$.

### Worked example 3.1 — GaN against GaAs at the facet

GaN, $n=2.4$: exact $(1-\cos(24.6^{\circ}))/2=(1-0.909)/2=4.5$ percent;
small-angle form $1/(4\times5.76)=4.3$ percent: the approximation is honest.
GaAs, $n=3.5$: exact 2.1 percent. The 2x between them is one reason nitride
LEDs reached lighting service with simpler packages: the estate map's index
column, cashing out in the solid angle.

## 4. Dies per wafer, derived

Lesson 1's formula is two terms of geometry. Whole-wafer area over die area
gives the ideal count; the deficit is the ring of partially covered dies at
the edge, whose number is approximately the circumference over the die's
mean chord $\sqrt{2A}$... more carefully, a die of area $A$ (aspect near
square, side $\sqrt{A}$) straddles the boundary if its centre lies within
about $\sqrt{A}/\sqrt{2}$ of it:

$$
N\approx\frac{\pi(d/2)^{2}}{A}-\frac{\pi d}{\sqrt{2A}}
$$

The correction term scales as $d/\sqrt{A}$: relatively worst for large dies
on small wafers, which stacks with the yield exponential of lesson 1: both
taxes on area, one statistical, one geometric: and is the second quiet
argument in the 300 mm business case of lesson 2.

## 5. Graduate derivation: the negative binomial from clustered defects

Lesson 1 asserted the clustering law; here is its origin. Let the local
defect density itself fluctuate wafer-to-wafer and region-to-region with a
gamma distribution of mean $D_0$ and shape $\alpha$:

$$
p(D)=\frac{\alpha^{\alpha}D^{\alpha-1}}{\Gamma(\alpha)D_0^{\alpha}}
e^{-\alpha D/D_0}
$$

The observed yield is Poisson averaged over that mixture:

$$
Y=\int_0^{\infty}e^{-AD}\,p(D)\,dD
=\left(\frac{\alpha/D_0}{\alpha/D_0+A}\right)^{\alpha}
=\boxed{\left(1+\frac{AD_0}{\alpha}\right)^{-\alpha}}
$$

The compounding is exact, and it identifies $\alpha$ physically: the
inverse variance of the cleanliness itself,
${\rm Var}(D)/D_0^{2}=1/\alpha$. A fab whose defectivity is *uniform*
(boringly consistent) has large $\alpha$ and Poisson pain on big dies; a fab
whose excursions cluster in time and space has small $\alpha$ and, by
lesson 1's problem E-answer logic, spares its large dies: why yield
engineers report variance, not just mean, and why "one bad lot" is better
news than the same defects spread thin.

## 6. The module data book

Constants gathered for reuse (300 K, common literature values: facts; two
significant figures where spreads exist).

**Table 1: the working semiconductors.**

| | $E_g$ (eV) | type | $a$ (A) | $\mu_n$ | $\mu_p$ | $\varepsilon_r$ | $k_{\rm th}$ (W/mK) | $\mathcal{E}_c$ (MV/cm) |
|---|---|---|---|---|---|---|---|---|
| Ge | 0.66 | ind. | 5.658 | 3900 | 1900 | 16.0 | 60 | 0.1 |
| Si | 1.12 | ind. | 5.431 | 1400 | 450 | 11.7 | 150 | 0.3 |
| GaAs | 1.42 | dir. | 5.653 | 8500 | 400 | 12.9 | 55 | 0.4 |
| InP | 1.34 | dir. | 5.869 | 5400 | 200 | 12.5 | 68 | 0.5 |
| In$_{0.53}$Ga$_{0.47}$As | 0.74 | dir. | 5.869 | 12000 | 300 | 13.9 | 5 | 0.2 |
| 4H-SiC | 3.26 | ind. | 3.073* | 900 | 120 | 9.7 | 490 | 3.0 |
| GaN | 3.40 | dir. | 3.189* | 1200 | 30 | 8.9 | 130 | 3.3 |
| Ga$_2$O$_3$ | 4.8 | dir. | - | 200 | - | 10 | 27 | 8 (proj.) |

*wurtzite/hexagonal a-axis.

**Table 2: shallow dopant depths in silicon** (meV): P 45, As 54, Sb 39;
B 45, Al 67, Ga 72, In 157: the first row is why phosphorus, arsenic and
boron own the industry and indium never did.

**Table 3: the substrate ladder's economics** (order-of-magnitude,
per-area, processed): Si 300 mm = 1; SOI = 2-3; GaAs 150 mm = 8-10;
InP 100 mm = 30-50; SiC 200 mm = 5-8 and falling; sapphire = 2-3.
Read with lesson 2's rule: a compound product must clear its column's
multiple in value per area, or address a market where silicon scores zero.

### Worked example 6.1 — the tables in anger

Rank Ge, GaAs and 4H-SiC for a 175 C, 100 V automotive switch using only
the tables. Leakage: $n_i$ from $E_g$: Ge disqualified (lesson 2's
exponential); GaAs adequate; SiC absurdly good. Conduction: the
$\mu\varepsilon\mathcal{E}_c^{3}$ figure: GaAs
$8500\times12.9\times0.064=7.0\times10^{3}$; SiC
$900\times9.7\times27=2.4\times10^{5}$: SiC by 34x despite the mobility
column. Heat: 490 vs 55: SiC by 9x. Verdict in three table lookups, no new
physics: which is what a data book is for.

## 6b. Reading the data book critically: provenance and error bars

A data book invites misuse, so its own rules belong beside it.

**Every entry is a conditional.** "Silicon mobility 1400" is lattice-limited,
lightly doped, bulk, 300 K, drift not Hall: module 18 spent a lesson on the
conditions, and the table entry is the *ceiling* of a family of curves, not
a property of the element. The working habit: when transferring any table
number into a calculation, write its conditions next to it once. The three
classic misuses this prevents: quoting bulk mobility for an inversion layer
(2 to 3x optimistic: lesson 5's device used 200, not 1400); quoting bulk
thermal conductivity for a thin film (module 35's boundary-scattering
deficit, up to several-fold at device scales); and quoting $\mathcal{E}_c$
as a constant when it drifts with doping (module 18's breakdown figure said
so on its face).

**Spread is information.** Where the literature spreads (GaN thermal
conductivity spans 130 to 250 W/mK by dislocation density; Ga2O3's
projected $\mathcal{E}_c$ is a theory number), the spread usually *is* the
materials-quality story: a tight number means a mature material. A useful
classroom exercise: rank Table 1's columns by how much you would trust a
third significant figure, and notice the ranking reproduces the materials'
industrial maturity almost exactly: silicon and GaAs tight, the wide-gap
newcomers loose: measurement maturity tracks manufacturing maturity because
both are bought with the same wafers.

**Units discipline.** The table mixes conventional units (cm2/Vs, W/mK,
MV/cm) because the literature does; every worked example in this module
converts explicitly before computing. The single most frequent arithmetic
failure in graded work is a silent cm-to-m slip inside a mobility or a
critical field: the defence is mechanical: carry units through one line of
every calculation, as the worked examples model.

**What is deliberately absent.** No prices beyond order-of-magnitude
(Table 3): they date in months; the *ratios* and the ladder logic endure.
No reliability constants: activation energies are mechanism-specific and
belong with their mechanisms (modules 22, 54). And no photonic-property
columns: the deferred scope of SCOPE.md keeps the estate honest.

## 6c. Where each thread continues

A routing table from this module's claims to their owning modules, for
navigation: the scaling identities and their device faces, modules 37 and
43; yield's physical causes, modules 21 (grown-in defects) and 44 (film
particles); the purification chain in full, modules 28 and 29; oxygen's
double life, modules 21 and 22; the interface war on other semiconductors,
module 24; the estate map's growth machinery, module 30, with the nitrides'
special physics in module 32 and the metastable colonies in module 39; the
emitter and detector ledgers at infrared depth, module 31; transport
underneath every mobility quoted here, module 18 throughout; heat's full
accounting, modules 35 and 54; and the deferred photonic estate, catalogued
in SCOPE.md, which this module's lesson 6 has now equipped you to read
critically when its wave arrives. Module 17 is the course's table of
contents written as physics; everything after it is the chapters.

One final navigation habit, stated once because it applies to all of them:
when a later module cites a number this supplement tabulated, come back and
check whether the conditions attached in section 6b still hold in the new
context. The single most common integration error across a course of this
size is a table value silently crossing a validity boundary between the
module that established it and the module that spends it, and the round
trip back to the data book is the thirty-second insurance against it.

## 7. Problems

**P17.39** Compute $N_v$ for silicon ($m_p^{*}=0.81\,m_0$) and combine with
worked example 1.1 to predict $n_i$ at 300 K from
$n_i=\sqrt{N_cN_v}e^{-E_g/2k_BT}$; compare with $1.0\times10^{10}$.

**P17.40** What subthreshold factor $n$ does a measured 78 mV/decade at
300 K imply, and what $C_{\rm dep}/C_{\rm ox}$ if traps are negligible?

**P17.41** From the cone derivation, what index would give 10 percent
single-face extraction, and name a display technology whose emitters
approach it.

**P17.42** A 200 mm pilot line runs 4 cm2 dies: compute gross dies, then
good dies at $D_0=0.25$, $\alpha=2$, and the cost multiple versus the same
product on 300 mm at $D_0=0.08$, $\alpha=4$ (equal per-wafer cost 1 and
2.2 respectively).

**P17.43** Show from the gamma-mixture result that the small-$AD_0$
expansions of Poisson and negative binomial agree to first order, and
state the practical consequence for small-die products.

**P17.44** *(graduate)* Using Table 1, estimate the Johnson-limit ranking
of GaAs vs GaN via $\mathcal{E}_cv_{\rm sat}$ taking
$v_{\rm sat}=1.2\times10^{7}$ and $2.5\times10^{7}$ cm/s respectively, and
reconcile with the lesson 3 lollipop.

### Answers

**P17.39** $N_v=2.8\times10^{19}\times(0.81/1.08)^{3/2}
=2.8\times10^{19}\times0.65=1.8\times10^{19}$... using the standard
$1.04\times10^{19}$ convention for silicon's valence band: the
$m^{3/2}$ scaling gives $1.8\times10^{19}$ with this mass choice: mass
conventions differ by valley-counting, worth one sentence in any answer.
With $N_v=1.04\times10^{19}$:
$n_i=\sqrt{2.8\times1.04}\times10^{19}\times e^{-1.12/0.0517}
=1.71\times10^{19}\times e^{-21.66}=1.71\times10^{19}\times3.9\times10^{-10}
=6.7\times10^{9}$: within 1.5x of the canonical $1.0\times10^{10}$:
the residual is bandgap narrowing and the $T^{3}$ prefactor's precision:
agreement at this level is what "derived from first principles" honestly
buys.

**P17.40** $n=78/59.6=1.31$; $C_{\rm dep}/C_{\rm ox}=n-1=0.31$: a healthy
modern device; 100+ mV/decade readings imply either thick EOT, deep
depletion or the trap term: the three-way diagnosis lesson 2 set up.

**P17.41** $1/4n^{2}=0.10$: $n=1.58$: organic emitters (OLED stacks,
$n\approx1.7$-1.8) sit nearest, one reason OLED displays never needed the
photon-plumbing industry inorganic LEDs did: index is destiny at the exit
facet.

**P17.42** Gross on 200 mm: $\pi\times100/4-\pi\times20/\sqrt{8}
=78.5-22.2=56$; yield $(1+0.5)^{-2}=0.44$: 25 good. On 300 mm:
$176.7-33.3=143$ gross; yield $(1+0.08)^{-4}=0.735$: 105 good. Cost per
good die: $1/25=0.040$ vs $2.2/105=0.021$: the mature big-wafer line wins
2x even at 2.2x wafer cost: lesson 1's engine, run end-to-end through both
derived formulas: and the pilot line's real product is learning, not dies.

**P17.43** $(1+x/\alpha)^{-\alpha}\approx1-x+\frac{\alpha+1}{2\alpha}x^{2}$
vs $e^{-x}\approx1-x+x^{2}/2$: identical at first order; clustering is a
*second-order* phenomenon in $AD_0$. Consequence: for small dies
($AD_0\ll1$) the models are indistinguishable and $\alpha$ is
unmeasurable from yield alone: fit clustering on your biggest die or not
at all.

**P17.44** GaAs: $0.4\times1.2=0.48$; GaN: $3.3\times2.5=8.25$
(MV/cm x $10^{7}$ cm/s units): ratio 17x: matching the lollipop's relative
placement (the lollipop's absolute Si-referenced numbers fold in Si's own
product): consistency across two figures drawn from one table: the audit
habit, applied to the course itself.
