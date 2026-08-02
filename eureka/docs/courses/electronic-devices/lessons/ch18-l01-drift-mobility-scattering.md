# Drift, Mobility and Why Resistivity Depends on Temperature

<!-- covers: 18.1, 18.2, 18.3, 18.4 -->

Ohm's law is an experimental summary, not an explanation. This lesson replaces
it with a mechanism: carriers accelerate in a field, get scattered, and the
balance between the two fixes the conductivity. Everything about resistivity in
metals, alloys and semiconductors follows from asking what does the scattering.

**Level.** Sections 1 to 7 are the undergraduate core, in a fixed pattern:
derivation, orders of magnitude, worked examples. Section 8 is the graduate
extension: the Sommerfeld correction, energy-dependent relaxation, the Hall
factor and the transport-versus-quantum lifetime distinction. Section 9 is a
problem set with full answers.

## 1. The three speeds, and the equation of motion

### 1.1 Thermal, drift and signal speed

Carriers in a solid are never still. In a non-degenerate semiconductor the
thermal speed follows from equipartition,

$$
\tfrac{3}{2}k_BT=\tfrac{1}{2}m^{*}v_{\rm th}^{2}
\quad\Longrightarrow\quad
v_{\rm th}=\sqrt{\frac{3k_BT}{m^{*}}}
$$

which for $m^{*}=0.26\,m_0$ in silicon at 300 K gives
$v_{\rm th}\approx2.3\times10^{5}\ {\rm m/s}$. In a metal the analogous scale
is the Fermi velocity, $v_F=\sqrt{2E_F/m}\approx1.6\times10^{6}\ {\rm m/s}$
for copper, set by the Pauli principle rather than by temperature. Both are
random motions and carry no net current.

Three distinct speeds have to be kept apart, because confusing them produces
most beginner errors about conduction:

| speed | scale | what it is |
|---|---|---|
| thermal / Fermi | $10^{5}$ to $10^{6}$ m/s | random carrier motion |
| drift | $10^{-5}$ to $10^{5}$ m/s | the field-driven average |
| signal | near $c$ | propagation of the field itself |

A signal crosses a board in nanoseconds while the electrons that carry the
current creep along at a snail's pace, because the *field* propagates, not the
carriers.

### 1.2 The Drude equation of motion

Apply a field $\mathcal{E}$. Newton's law with a friction term standing in for
scattering is

$$
m^{*}\frac{d\mathbf{v}_d}{dt}
=-e\boldsymbol{\mathcal{E}}-\frac{m^{*}\mathbf{v}_d}{\tau}
$$

The friction term is the entire model: it asserts that collisions destroy the
drift momentum on a timescale $\tau$, the **mean free time**. The general
solution for a field switched on at $t=0$ is

$$
\mathbf{v}_d(t)=-\frac{e\tau}{m^{*}}\boldsymbol{\mathcal{E}}
\left(1-e^{-t/\tau}\right)
$$

![The drift velocity relaxes exponentially to its steady value with the scattering time as the time constant; after one mean free time the carrier gas has covered 63 percent of the distance.](/courses/electronic-devices/figures/m18-drude-transient.svg)

Steady state gives the definition of mobility:

$$
\boxed{\;\mathbf{v}_d=-\mu\boldsymbol{\mathcal{E}},
\qquad \mu=\frac{e\tau}{m^{*}}\;}
$$

In SI, $\mu$ is ${\rm m^{2}V^{-1}s^{-1}}$; the literature uses
${\rm cm^{2}V^{-1}s^{-1}}$, and $1\ {\rm m^{2}/Vs}=10^{4}\ {\rm cm^{2}/Vs}$.
The two ingredients say exactly what raises mobility: a long time between
collisions and a light effective mass. Everything in module 18 is a story
about one or the other.

### 1.3 The AC response

Drive the same equation with $\mathcal{E}e^{i\omega t}$ and the steady
oscillating solution gives a complex conductivity,

$$
\sigma(\omega)=\frac{\sigma_0}{1+i\omega\tau},
\qquad
|\sigma|=\frac{\sigma_0}{\sqrt{1+\omega^{2}\tau^{2}}}
$$

![The magnitude rolls off and the current lags the field, both governed by the single product of frequency and scattering time; with tau around 20 femtoseconds in a metal the corner sits in the terahertz.](/courses/electronic-devices/figures/m18-ac-drude.svg)

With $\tau\approx2\times10^{-14}$ s in copper, $\omega\tau=1$ falls near 8 THz:
metals behave as ideal Ohmic conductors through the entire electronic spectrum
and only fail approaching the infrared. The same expression is the low-frequency
end of the free-carrier optics of module 19, and setting
$\sigma(\omega)$ into Maxwell's equations yields the plasma frequency at which
a conductor turns transparent, the fact module 56 builds transparent conductors
on. One model, three modules.

### Worked example 1.1 — how slow is drift, really?

A copper wire of cross-section $A=1\ {\rm mm^{2}}$ carries $I=1\ {\rm A}$.
Copper has one conduction electron per atom, density $8.96\ {\rm g/cm^{3}}$,
molar mass $63.5\ {\rm g/mol}$:

$$
n=\frac{8.96}{63.5}\times6.022\times10^{23}
=8.5\times10^{22}\ {\rm cm^{-3}}=8.5\times10^{28}\ {\rm m^{-3}}
$$

$$
v_d=\frac{J}{ne}
=\frac{10^{6}\ {\rm A/m^{2}}}{8.5\times10^{28}\times1.602\times10^{-19}}
=7.3\times10^{-5}\ {\rm m/s}
$$

About **four metres per day**, nine orders of magnitude below the Fermi
velocity of the same electrons.

### Worked example 1.2 — the memory time of the electron gas

How long after a current is interrupted does the drift motion survive? From the
transient solution, the decay constant is $\tau$ itself. For copper,
$\tau=\mu m/e$ with $\mu=4.3\times10^{-3}\ {\rm m^{2}/Vs}$:

$$
\tau=\frac{4.3\times10^{-3}\times9.109\times10^{-31}}{1.602\times10^{-19}}
=2.4\times10^{-14}\ {\rm s}
$$

Twenty-four femtoseconds. Every circuit-level memory effect, inductive kick
included, is field energy, not carrier momentum: the electron gas itself
forgets essentially instantly.

## 2. Carrier statistics: degenerate or not

### 2.1 Two distributions

The occupation of a state at energy $E$ is the Fermi-Dirac function

$$
f(E)=\frac{1}{1+e^{(E-E_F)/k_BT}}
$$

When $E-E_F\gg k_BT$ the exponential dominates and

$$
f(E)\approx e^{-(E-E_F)/k_BT}
$$

which is Maxwell-Boltzmann. The approximation is excellent beyond about
$3k_BT$ above $E_F$ and catastrophic below it, where Fermi-Dirac saturates at
one occupant per state while the classical form happily predicts several.

![The full quantum distribution and its classical limit agree in the tail and disagree completely near and below the Fermi level, which is why the same formulas serve lightly doped semiconductors and fail for metals.](/courses/electronic-devices/figures/m18-fermi-maxwell.svg)

### 2.2 The practical criterion

A semiconductor is **non-degenerate** while its carrier density stays well
below the effective density of states,

$$
N_c=2\left(\frac{2\pi m^{*}k_BT}{h^{2}}\right)^{3/2}
$$

which for silicon electrons at 300 K is $2.8\times10^{19}\ {\rm cm^{-3}}$. The
working rule: below about $10^{18}\ {\rm cm^{-3}}$ silicon is comfortably
non-degenerate and Boltzmann statistics apply; at $10^{19}$ and above, the
Fermi level enters the band, the material is **degenerate**, and it behaves
like a poor metal. Metals sit at $10^{22}$ to $10^{23}\ {\rm cm^{-3}}$, five
orders of magnitude past the crossover, which is why metallic conduction is a
Fermi-surface story from the start.

This one criterion decides which formulas apply throughout the course: the
$T^{3/2}$ prefactors of the scattering laws, the diffusion-mobility relation
(the Einstein relation $D/\mu=k_BT/e$ holds only when non-degenerate), and the
interpretation of every temperature dependence.

### Worked example 2.1 — is this contact layer a metal?

A source contact is doped to $n=8\times10^{19}\ {\rm cm^{-3}}$. Degenerate?
Estimate the Fermi level position using the degenerate free-electron result

$$
E_F=\frac{\hbar^{2}}{2m^{*}}\left(3\pi^{2}n\right)^{2/3}
$$

With $m^{*}=0.26\,m_0$ and $n=8\times10^{25}\ {\rm m^{-3}}$:
$(3\pi^{2}n)^{2/3}=(2.37\times10^{27})^{2/3}=1.78\times10^{18}\ {\rm m^{-2}}$,
so

$$
E_F=\frac{(1.055\times10^{-34})^{2}}{2\times0.26\times9.109\times10^{-31}}
\times1.78\times10^{18}=4.2\times10^{-20}\ {\rm J}=0.26\ {\rm eV}
$$

The Fermi level sits a quarter of an electron-volt **inside the conduction
band**, ten times $k_BT$. The layer is fully degenerate: its carrier density is
temperature-independent, its resistivity rises with temperature like a metal's,
and Boltzmann-statistics formulas do not apply to it. Contact layers are
metals that happen to be made of silicon.

## 3. Conductivity, resistivity, and sheet resistance

### 3.1 The central factorization

With $n$ carriers of charge $-e$ drifting at $v_d$, the current density is
$\mathbf{J}=en\mu\boldsymbol{\mathcal{E}}$, so

$$
\boxed{\;\sigma=en\mu=\frac{ne^{2}\tau}{m^{*}},\qquad
\sigma=e(n\mu_n+p\mu_p)\ \text{with both carriers}\;}
$$

The two factors are controlled by different physics. **Carrier density is set
by doping and temperature; mobility is set by scattering.** A material can
conduct badly because it has few carriers or because they are constantly
scattered, and the two cases respond oppositely to almost every intervention.
The span of the product is the widest of any material property in engineering:
from $10^{-16}\ {\rm S/m}$ in PTFE to $6\times10^{7}$ in silver, twenty-three
orders of magnitude.

Companion quantities worth having at recall for silicon at 300 K, lightly
doped: $\tau=\mu m^{*}/e\approx0.2\ {\rm ps}$, mean free path
$\ell=v_{\rm th}\tau\approx45\ {\rm nm}$.

### 3.2 Sheet resistance

Films and diffusions have a fixed thickness $t$ set by the process, and the
designer chooses only the layout. Factor the resistance accordingly:

$$
R=\rho\frac{L}{Wt}=\frac{\rho}{t}\cdot\frac{L}{W}
=R_s\times\left(\text{number of squares}\right)
$$

![Only the length-to-width ratio enters: a resistor of five squares has the same resistance at any absolute size, which is why layouts are counted in squares.](/courses/electronic-devices/figures/m18-sheet-resistance.svg)

The **sheet resistance** $R_s=\rho/t$, in "ohms per square", is the natural
unit of every planar technology. Typical values: 10 to 100 m$\Omega/\square$
for interconnect metal, 10 to 100 $\Omega/\square$ for silicided polysilicon
and diffusions, $10^{2}$ to $10^{3}$ for undoped semiconductor films, and it
is the figure of merit for the transparent conductors of module 56.

### Worked example 3.1 — an interconnect delay budget

A copper line ($\rho=17\ {\rm n\Omega\,m}$ bulk) is 100 nm thick, 100 nm wide
and 1 mm long, over a dielectric giving 0.2 fF per micrometre of length.
Estimate the RC delay, using the bulk resistivity first.

$$
R_s=\frac{17\times10^{-9}}{100\times10^{-9}}=0.17\ \Omega/\square,
\qquad
N_\square=\frac{10^{-3}}{10^{-7}}=10^{4}
\ \Rightarrow\ R=1.7\ {\rm k\Omega}
$$

$$
C=0.2\ {\rm fF/\mu m}\times1000\ {\rm \mu m}=0.2\ {\rm pF}
\qquad
RC=1.7\times10^{3}\times0.2\times10^{-12}=0.34\ {\rm ns}
$$

A third of a nanosecond to cross one millimetre: several clock cycles. And
lesson 2 shows the bulk resistivity is optimistic by 2 to 3 times at this
width, so the real budget is worse. This one number is why interconnect, not
transistors, limits modern chips, and why module 43 spends a lesson on low-k
dielectrics: the other factor in the product is $C$.

### Worked example 3.2 — sizing a diffused resistor

A process offers a p-type diffusion with $R_s=120\ \Omega/\square$. Lay out
$4.8\ {\rm k\Omega}$. Squares needed: $4800/120=40$. At the minimum width of
$2\ {\rm \mu m}$, the resistor is $80\ {\rm \mu m}$ long, folded into a
serpentine. Corner squares count roughly 0.56 of a straight square because
current crowds the inside edge; with 6 corners the layout is trimmed to
$40-6\times(1-0.56)\approx37.4$ straight squares. Layout handbooks carry that
0.56; the physics is nothing but current crowding.

## 4. Matthiessen's rule

### 4.1 Adding rates

Independent scattering mechanisms add as probabilities per unit time:

$$
\frac{1}{\tau}=\sum_i\frac{1}{\tau_i}
\quad\Longrightarrow\quad
\boxed{\;\frac{1}{\mu}=\sum_i\frac{1}{\mu_i}
\qquad\text{equivalently}\qquad
\rho=\sum_i\rho_i\;}
$$

The resistivity form is the memorable one: **independent contributions add as
resistivities.** Two consequences:

- **The worst mechanism dominates.** With $\rho_1=20$ and $\rho_2=2$, removing
  mechanism 2 entirely buys 9 percent. The right question about a conductor is
  always "what limits it here", never "how pure is it".
- **It is an approximation.** It fails when mechanisms interfere (an impurity
  that changes local phonon modes), and when they are anisotropic in different
  ways so that no single $\tau$ describes both. Deviations from Matthiessen's
  rule are themselves used as evidence of such coupling.

![Two mechanisms with opposite temperature dependence combine through Matthiessen's rule; impurity scattering limits the cold end, lattice scattering the hot end, and the peak sits where they cross.](/courses/electronic-devices/figures/m18-mobility-vs-temperature.svg)

### Worked example 4.1 — combining and prioritising

A sample has $\mu_L=1400$ and $\mu_I=600\ {\rm cm^{2}/Vs}$:

$$
\frac{1}{\mu}=\frac{1}{1400}+\frac{1}{600}
=2.381\times10^{-3}
\ \Rightarrow\ \mu=420\ {\rm cm^{2}/Vs}
$$

Below the smaller input, always. A 10 percent improvement in $\mu_I$ moves the
answer by 7 percent; the same improvement in $\mu_L$ moves it 2 percent.
Optimisation effort goes where the reciprocal is largest.

### Worked example 4.2 — reading a mobility peak

A Hall measurement gives $\mu=2100\ {\rm cm^{2}/Vs}$ at 150 K and the mobility
peaks there. Estimate the two components, assuming pure power laws
$\mu_L=aT^{-3/2}$ and $\mu_I=bT^{3/2}$. At the peak of
$1/\mu=1/\mu_L+1/\mu_I$, the derivative gives $\mu_L=\mu_I$ (equal components,
since their logarithmic slopes are equal and opposite). Hence at 150 K each is
$2\times2100=4200\ {\rm cm^{2}/Vs}$, so at 300 K,
$\mu_L=4200\,(300/150)^{-3/2}=1485$ and $\mu_I=4200\,(2)^{3/2}=11900$: room
temperature is lattice-limited, and cooling this sample below 150 K makes it
worse, not better. The peak location is a doping diagnostic, and it moves up
in temperature as $N_I$ rises.

## 5. Metals: the phonon term, cold and hot

### 5.1 The classical argument

In a metal, $n$ is fixed; all the temperature dependence lives in $\tau$. An
electron scatters off the displacement of an ion from its site, with
cross-section proportional to the mean-square displacement of a thermal
oscillator:

$$
\tfrac{1}{2}K\langle u^{2}\rangle=\tfrac{1}{2}k_BT
\ \Longrightarrow\
\langle u^{2}\rangle=\frac{k_BT}{K}\propto T
$$

The carrier speed in the rate (density of scatterers x cross-section x speed)
is the temperature-independent $v_F$, so $1/\tau\propto T$ and

$$
\rho_{\rm ph}\propto T\qquad(T\gtrsim\theta_D/3)
$$

### 5.2 Bloch-Gruneisen: what happens when phonons freeze

Below roughly a third of the Debye temperature $\theta_D$ two suppressions
compound: fewer phonons exist, and those remaining carry small momentum, so
each scattering event deflects the electron only slightly and the
$(1-\cos\theta)$ weighting of section 8.4 discounts it further. The full
result is the Bloch-Gruneisen integral,

$$
\rho_{\rm ph}(T)\propto\left(\frac{T}{\theta_D}\right)^{5}
\int_{0}^{\theta_D/T}\frac{x^{5}e^{x}}{(e^{x}-1)^{2}}\,dx
$$

whose limits are $\rho\propto T$ for $T\gg\theta_D$ and the famous
$\rho\propto T^{5}$ for $T\ll\theta_D$.

![The curve computed from the integral itself, with both asymptotes drawn: five powers of temperature at the cold end collapse to one at the warm end.](/courses/electronic-devices/figures/m18-bloch-gruneisen.svg)

Adding the temperature-independent defect term restores Matthiessen:

$$
\rho(T)=\rho_{\rm res}+\rho_{\rm ph}(T)
$$

so purity curves are **parallel**, offset by their residual resistivity, and
the **residual resistance ratio** ${\rm RRR}=\rho(300\,{\rm K})/\rho(4.2\,{\rm K})$
is the standard purity metric: 50 to 100 for commercial copper, above $10^{4}$
for the best crystals.

![Three purities of the same metal share one phonon curve; only the temperature-independent floor differs, which is Matthiessen's rule made visible.](/courses/electronic-devices/figures/m18-metal-resistivity.svg)

### 5.3 The temperature coefficient, and its limits

Engineering data sheets linearise:

$$
\rho(T)=\rho_0\left[1+\alpha_0(T-T_0)\right],
\qquad
\alpha_0=\frac{1}{\rho_0}\left.\frac{d\rho}{dT}\right|_{T_0}
$$

For a pure metal near room temperature $\rho\approx cT$, so
$\alpha_0\approx1/T_0\approx3.4\times10^{-3}\ {\rm K^{-1}}$; measured values
cluster near $3.9\times10^{-3}$ for copper, aluminium and platinum. **A TCR
near $1/T$ is a fingerprint of phonon-limited conduction**, and a TCR far
below it (constantan at $10^{-5}$) is a fingerprint of disorder-limited
conduction, section 7.

| material | $\rho$ at 300 K (n$\Omega\,$m) | $\alpha_0$ ($10^{-3}$/K) | limited by |
|---|---|---|---|
| silver | 15.9 | 3.8 | phonons |
| copper | 16.8 | 3.9 | phonons |
| gold | 22.1 | 3.4 | phonons |
| aluminium | 26.5 | 3.9 | phonons |
| tungsten | 52.8 | 4.5 | phonons |
| platinum | 105 | 3.92 | phonons |
| nichrome | 1100 | 0.4 | alloy disorder |
| constantan | 490 | 0.01 | disorder, compensated |
| manganin | 430 | 0.02 | disorder, compensated |

The linearisation has a measurable cost. Platinum resistance thermometry uses
the quadratic Callendar-Van Dusen form
$R(T)=R_0(1+AT+BT^{2})$ with $B<0$; treating platinum as linear misreads
increasingly badly at high temperature:

![The error of a straight-line reading of a platinum sensor grows past fifty degrees by 600 C, which is why standards specify the quadratic and why precision readout never uses the single-number TCR.](/courses/electronic-devices/figures/m18-tcr-error.svg)

### Worked example 5.1 — a platinum thermometer, done properly

A Pt100 reads $R=213.5\ \Omega$. Linear estimate with
$\alpha=3.9083\times10^{-3}$: $T=(2.135-1)/0.0039083=290.4\ ^{\circ}$C.
Quadratic: solve $1+AT+BT^{2}=2.135$ with $A=3.9083\times10^{-3}$,
$B=-5.775\times10^{-7}$:

$$
T=\frac{-A+\sqrt{A^{2}+4B(2.135-1)}}{2B}
=\frac{-3.9083\times10^{-3}+\sqrt{1.5275\times10^{-5}-2.622\times10^{-6}}}
{-1.155\times10^{-6}}
$$

$$
=\frac{-3.9083\times10^{-3}+3.5571\times10^{-3}}{-1.155\times10^{-6}}
=304.1\ ^{\circ}{\rm C}
$$

The linear reading is **13.7 degrees low**. At the top of the range the error
approaches an entire control band, which is why the quadratic is not optional.

### Worked example 5.2 — RRR and the crossover

Copper with RRR = 80: $\rho_{\rm res}=16.8/80=0.21\ {\rm n\Omega\,m}$. Where do
the two contributions cross? Linear extrapolation
$\rho_{\rm ph}=16.6\,(T/300)$ crosses at 3.8 K, but by then the
Bloch-Gruneisen $T^{5}$ suppression has cut the phonon term far below the
linear estimate, pushing the true crossover to 15 to 25 K. The lesson: the
linear law must never be extrapolated below $\theta_D/3$ (about 115 K for
copper), which is precisely what the figure's $T^{5}$ branch is warning about.

### 5.4 The semiconductor contrast

Semiconductors run the opposite way because the dominant factor switches from
$\mu$ to $n$:

$$
n_i(T)=\sqrt{N_cN_v}\;e^{-E_g/2k_BT}
$$

Between freeze-out and intrinsic takeover lies the **extrinsic plateau**,
where $n\approx N_D$ and devices are designed to live:

![The full carrier density of a doped sample on an Arrhenius axis: a steep intrinsic slope of half the gap, a flat extrinsic plateau, and a freeze-out slope of half the donor depth. The plateau's ends are the real operating limits of the technology.](/courses/electronic-devices/figures/m18-sigma-semiconductor.svg)

Reading the figure quantitatively is a skill worth having: on the
$\ln n$-versus-$1/T$ axis the intrinsic branch has slope $-E_g/2k_B$ and the
freeze-out branch slope $-E_d/2k_B$, so **band gaps and dopant depths are
measured with a resistance bridge and a cryostat**. The upper end of the
plateau, where $n_i(T)$ reaches the doping, is the maximum operating
temperature: roughly 200 to 250 C for silicon at ordinary dopings, and the
single most cited justification for the wide-gap materials of module 39.

### Worked example 5.3 — maximum operating temperature

At what temperature does intrinsic carrier density reach $10^{15}$, upsetting
a $N_D=10^{15}\ {\rm cm^{-3}}$ drift region? Solve
$n_i(T)=10^{15}$ with $n_i(300)=1.0\times10^{10}$ and
$E_g=1.12$ eV, ignoring the prefactor's slow $T^{3}$ drift:

$$
\frac{n_i(T)}{n_i(300)}=e^{-\frac{E_g}{2k_B}\left(\frac{1}{T}-\frac{1}{300}\right)}=10^{5}
$$

$$
\frac{1}{300}-\frac{1}{T}=\frac{2k_B\ln 10^{5}}{E_g}
=\frac{2\times8.617\times10^{-5}\times11.51}{1.12}=1.771\times10^{-3}
$$

giving $1/T=1.562\times10^{-3}$, $T=640\ {\rm K}\approx367\ ^{\circ}$C. High
resistivity power devices hit intrinsic takeover well below that in practice
(the criterion $n_i\approx0.1N_D$ is already trouble), which brackets silicon
power electronics to junction temperatures near 175 C and hands the hotter
territory to SiC.

## 6. Interlude: what to remember so far

Three sentences carry sections 1 to 5. Mobility is $e\tau/m^{*}$, so
everything that lengthens the time between collisions or lightens the carrier
raises it. Resistivities of independent mechanisms add, so the worst one is the
design target. Metals lose mobility as they warm while semiconductors gain
carriers, and each behaviour is a measurement instrument: the metal's slope is
a thermometer, the semiconductor's slope is a spectrometer for gaps and dopant
depths.

## 7. Alloys: Nordheim's rule and the disorder ceiling

### 7.1 The variance argument

A solute atom perturbs the lattice twice over: different core potential,
different size. Both scatter. For a **random** solid solution, treat each site
as an independent random variable equal to solute with probability $x$. The
mean-square fluctuation of the site potential is proportional to the variance
of a Bernoulli variable,

$$
\langle(\delta U)^{2}\rangle\propto x(1-x)
$$

and in the Born approximation the scattering rate follows the mean-square
perturbation, so

$$
\boxed{\;\rho_{\rm alloy}=C\,x(1-x)\;}
$$

This is **Nordheim's rule**, and it is statistics, not curve fitting: zero at
both pure ends, maximal disorder at the middle. The coefficient $C$ grows with
the valence and size mismatch of the pair, from tens of
${\rm n\Omega\,m}$ for silver-gold (nearly identical atoms) to over a thousand
for copper-nickel.

![The parabola for two solute-solvent pairs computed from the rule itself; the prefactor measures how dissimilar the two atoms are, the shape is fixed by the site-occupancy variance.](/courses/electronic-devices/figures/m18-nordheim.svg)

Three consequences:

- **Resistance alloys sit near $x=0.5$**, where the disorder term is large and
  temperature-independent, cancelling the phonon TCR: constantan and manganin
  in the table above are designed there, and their $10^{-5}$ TCRs are why
  precision shunts and strain gauges are made of them.
- **Conductors must be pure.** The parabola is steepest at the ends: the first
  atomic percent costs the most. This is why interconnect copper and busbar
  aluminium carry purity specifications that look absurd until you differentiate
  the rule at $x=0$.
- **Ordering breaks the rule.** The variance argument assumed randomness. If
  the alloy orders into a compound or phase-separates, disorder collapses and
  resistivity drops at fixed composition; a heat treatment can change the
  resistivity of the same chemistry. An anomalously low Nordheim coefficient is
  evidence of short-range order.

### 7.2 The same variance in semiconductors

The identical $x(1-x)$ appears when the alloy is a semiconductor: SiGe,
AlGaAs, InGaN. There it acts on mobility through alloy scattering,

$$
\frac{1}{\mu_{\rm alloy}}=\frac{1}{\mu_{\rm host}(x)}+\frac{x(1-x)}{C_A}
$$

![Interpolating between two hosts does not interpolate the mobility: the disorder term carves a valley whose bottom no purification can raise, because the scatterer is the alloy itself.](/courses/electronic-devices/figures/m18-alloy-mobility.svg)

This ceiling is intrinsic: the scatterer is the composition itself. Module 38
meets it in SiGe channels, module 31 in HgCdTe detectors, and module 55 turns
the same physics around and uses maximal-disorder alloys to scatter *phonons*
on purpose in thermoelectrics. One variance, four modules.

### Worked example 7.1 — extracting and using the coefficient

A Cu-Ni alloy at $x=0.20$ measures $210\ {\rm n\Omega\,m}$; pure copper is
16.8. Then

$$
C=\frac{210-16.8}{0.20\times0.80}=1208\ {\rm n\Omega\,m}
$$

Predict $x=0.45$: $\rho=16.8+1208\times0.45\times0.55=316\ {\rm n\Omega\,m}$;
measured values sit near 300, a few percent off, with the discrepancy carrying
the short-range-order physics above.

### Worked example 7.2 — designing a low-TCR shunt

A shunt alloy must hold $\pm100$ ppm/K over 0 to 100 C. The phonon term of the
copper host contributes $d\rho/dT\approx0.055\ {\rm n\Omega\,m/K}$ around room
temperature. A disorder term $C\,x(1-x)$ with $C=1208$ at $x=0.45$ adds
$299\ {\rm n\Omega\,m}$ of temperature-independent resistivity, diluting the
TCR to

$$
\alpha=\frac{0.055}{16.8+299}=1.7\times10^{-4}\ {\rm K^{-1}}=170\ {\rm ppm/K}
$$

Close, and not enough: real constantan reaches 10 ppm/K because the alloy's
electronic structure gives the disorder term a slight *negative* temperature
slope that cancels the phonon term to first order. The lesson generalises:
dilution gets you the first factor of twenty, cancellation engineering gets the
rest, and the cancellation is why the composition is tuned to the percent.

## 8. Graduate extension: from Drude to Boltzmann

### 8.1 Which electrons carry the current

Drude let all $n$ electrons respond to the field. In a degenerate metal the
Pauli principle forbids it: only states within about $k_BT$ of the Fermi
surface can scatter into empty states. The Boltzmann treatment (lesson 2,
section 2) gives

$$
\sigma=\frac{e^{2}}{3}v_F^{2}\,\tau(E_F)\,g(E_F)
$$

For free electrons $g(E_F)=3n/2E_F$ and $E_F=\tfrac{1}{2}mv_F^{2}$, and
substitution collapses this to $\sigma=ne^{2}\tau/m$: **the Drude formula is
correct, and Drude's reason for it was wrong.** The total density appears, but
$\tau$ and $v$ are Fermi-surface properties. This is why metal resistivities
track $\tau(E_F)$ alone, and why heat capacity, which Drude got badly wrong, is
suppressed by the factor $k_BT/E_F$ while conductivity is not.

### 8.2 Energy averaging and the power laws

In a non-degenerate semiconductor the whole Maxwellian participates, and
$\tau$ depends on energy, typically as $\tau=\tau_0(E/k_BT)^{s}$. The
current-weighted average is

$$
\langle\tau\rangle
=\frac{\displaystyle\int_0^{\infty}\tau(E)\,E^{3/2}e^{-E/k_BT}\,dE}
{\displaystyle\int_0^{\infty}E^{3/2}e^{-E/k_BT}\,dE}
=\tau_0\,\frac{\Gamma(s+5/2)}{\Gamma(5/2)}
$$

With $s=-1/2$ and $\tau_0\propto T^{-1}$ for acoustic phonons the celebrated
$\mu\propto T^{-3/2}$ emerges; with $s=+3/2$ for ionised impurities,
$\mu\propto T^{+3/2}$. The exponents used all through section 4 are theorems,
not fits.

### 8.3 The Hall factor

The Hall coefficient involves $\langle\tau^{2}\rangle$ rather than
$\langle\tau\rangle$:

$$
\mu_H=r_H\,\mu_d,
\qquad
r_H=\frac{\langle\tau^{2}\rangle}{\langle\tau\rangle^{2}}
=\frac{\Gamma(2s+5/2)\,\Gamma(5/2)}{\Gamma(s+5/2)^{2}}
$$

Evaluating: $r_H=3\pi/8=1.18$ for acoustic scattering, $315\pi/512=1.93$ for
ionised-impurity scattering, exactly 1 for a degenerate metal (no averaging
spread). Reporting a Hall mobility as a drift mobility is therefore a
systematic error of up to a factor of two, in a direction that flatters the
material. Lesson 3 and module 36 enforce the distinction.

### 8.4 Transport versus quantum lifetime

Fermi's golden rule counts every scattering event; resistance does not. A
carrier deflected by one degree still delivers essentially all its forward
momentum. The transport rate carries the weighting

$$
\frac{1}{\tau_{\rm tr}}\propto\int(1-\cos\theta)\,P(\theta)\,d\Omega
$$

while the quantum lifetime $\tau_q$ (measured from the broadening of quantum
oscillations) integrates $P(\theta)$ bare.

![All collisions count toward the quantum lifetime, but the transport integrand suppresses the forward peak; for a remote-donor angular distribution the two lifetimes separate by more than an order of magnitude.](/courses/electronic-devices/figures/m18-lifetimes.svg)

For isotropic scattering the two coincide. For the small-angle scattering of
remote ionised donors in a modulation-doped heterostructure,
$\tau_{\rm tr}/\tau_q$ reaches 10 to 100: the electron is interrupted
constantly and slowed almost never. That single distinction explains how
lesson 4's 2DEG can show million-range mobilities while its quantum levels
remain visibly broadened, and it is a warning for experimenters: two
legitimate "lifetimes" of the same sample differ by an order of magnitude, and
each answers a different question.

### 8.5 Where the whole framework stops

Three boundaries, each picked up later: **inelastic dominance** (optical
phonon emission at high field, lesson 3), **ballistic transport** (device
shorter than $\ell$, lesson 4), and **strong localisation** (disorder so
strong that $\ell$ approaches the electron wavelength and the Boltzmann
picture of well-defined trajectories fails entirely, module 25's hopping
regime). The Ioffe-Regel criterion $k_F\ell\sim1$ marks the last frontier:
below it, "mobility" stops being a meaningful word.

## 9. Problems

**P18.1** Aluminium: $\rho=26.5\ {\rm n\Omega\,m}$, three free electrons per
atom, density $2.70\ {\rm g/cm^{3}}$, molar mass 27.0. Find $n$, $\mu$, $\tau$
and the mean free path (take $v_F=2.0\times10^{6}$ m/s, $m^{*}=m_0$).

**P18.2** A silicon layer is doped $2\times10^{16}\ {\rm cm^{-3}}$ n-type.
Using $\mu_n=1200\ {\rm cm^{2}/Vs}$, find $\rho$ and the sheet resistance of a
0.5 µm layer, and the resistance of a 20-square serpentine made in it.

**P18.3** From the AC Drude form, at what frequency does copper's conductivity
magnitude fall 5 percent below DC? ($\tau=2.4\times10^{-14}$ s.)

**P18.4** A sample shows $\mu=800$ at 250 K rising to a maximum of 950 at
190 K. Assuming pure $T^{\pm3/2}$ laws, find $\mu_L$ and $\mu_I$ at 300 K and
state which side of the peak room temperature sits on.

**P18.5** Copper at 77 K: with RRR = 60 and the linear phonon law valid down
to 77 K, what fraction of the room-temperature resistivity survives, and what
is the ratio of the two Matthiessen terms there?

**P18.6** Estimate the temperature at which a Pt100's linear-model error
reaches one degree, using $R=R_0(1+AT+BT^{2})$ with the section 5 constants.

**P18.7** A Cu-Ni alloy must have $\rho=400\ {\rm n\Omega\,m}$. With
$C=1208\ {\rm n\Omega\,m}$ and pure copper at 16.8, find the two compositions
that satisfy it and give one reason to prefer the lower one.

**P18.8** Show from the Nordheim form that the initial slope
$d\rho/dx$ at $x=0$ equals $C$, and use it to bound the tolerable impurity
fraction if interconnect resistivity may rise at most 1 percent
($C=1208\ {\rm n\Omega\,m}$ for the worst-case solute).

**P18.9** An n-type wafer must hold its extrinsic plateau to 200 C. Using the
worked-example method, find the minimum doping.

**P18.10** *(graduate)* Derive $\langle\tau\rangle=\tau_0\Gamma(s+5/2)/\Gamma(5/2)$
for $\tau=\tau_0(E/k_BT)^{s}$ and a Maxwellian, and evaluate the Hall factor
for $s=-1/2$.

**P18.11** *(graduate)* A 2DEG shows $\tau_q=0.4$ ps from oscillation damping
and $\mu=8\times10^{5}\ {\rm cm^{2}/Vs}$ with $m^{*}=0.067\,m_0$. Find
$\tau_{\rm tr}$ and the lifetime ratio, and state what angular distribution
this implies.

**P18.12** *(graduate)* Using the Ioffe-Regel criterion $k_F\ell\approx1$ with
$n=10^{21}\ {\rm cm^{-3}}$, estimate the mobility at which the Boltzmann
picture fails ($m^{*}=m_0$), and name the module of this course that operates
below it.

### Answers

**P18.1** $n=3\times(2.70/27.0)\times6.022\times10^{23}
=1.81\times10^{23}\ {\rm cm^{-3}}=1.81\times10^{29}\ {\rm m^{-3}}$.
$\mu=1/(ne\rho)=1.30\times10^{-3}\ {\rm m^{2}/Vs}=13\ {\rm cm^{2}/Vs}$;
$\tau=\mu m_0/e=7.4\times10^{-15}$ s; $\ell=v_F\tau=15$ nm. Note the pattern
against copper: three times the carriers, a third the mobility.

**P18.2** $\sigma=ne\mu=2\times10^{16}\times1.602\times10^{-19}\times1200
=3.85\ {\rm S/cm}$, so $\rho=0.26\ \Omega\,$cm.
$R_s=\rho/t=0.26/(0.5\times10^{-4})=5.2\ {\rm k\Omega}/\square$;
20 squares give $104\ {\rm k\Omega}$.

**P18.3** $1/\sqrt{1+\omega^{2}\tau^{2}}=0.95$ gives $\omega\tau=0.329$, so
$f=0.329/(2\pi\times2.4\times10^{-14})=2.2\ {\rm THz}$. Copper is a textbook
resistor through the entire radio and microwave range.

**P18.4** At the peak the components are equal: each
$2\times950=1900$ at 190 K. Then
$\mu_L(300)=1900(300/190)^{-3/2}=958$ and
$\mu_I(300)=1900(300/190)^{3/2}=3768$. Room temperature is on the
lattice-limited side; check: combining gives 764, and the measured 800 at
250 K interpolates consistently.

**P18.5** $\rho_{\rm res}=16.8/60=0.28$; $\rho_{\rm ph}(77)=16.6\times77/300
=4.26$; total $4.54\ {\rm n\Omega\,m}=27$ percent of the 300 K value. Ratio
phonon-to-residual $=15$: still phonon-dominated, which is why liquid-nitrogen
cooling of copper coils buys a real factor of 3.7 in loss.

**P18.6** Error $=(AT+BT^{2})/A-T=BT^{2}/A$. Setting
$|B|T^{2}/A=1$: $T=\sqrt{A/|B|}=\sqrt{3.9083\times10^{-3}/5.775\times10^{-7}}
=82\ ^{\circ}$C. Above roughly the boiling point of water, the single-TCR
model is already a degree wrong: calibration standards switch to the quadratic
long before that.

**P18.7** $x(1-x)=(400-16.8)/1208=0.317$, so $x^{2}-x+0.317=0$ and
$x=0.5\pm\sqrt{0.25-0.317}$... the discriminant is negative: **no composition
reaches 400** with this pair's $C$ at the naive level; the maximum is
$16.8+1208/4=319$. The problem is a trap with a lesson: Nordheim caps the
resistivity available from a given pair at $C/4$, and reaching higher values
needs a pair with larger mismatch or a second mechanism. (Real nichrome gets
to 1100 through both.)

**P18.8** Differentiate: $d\rho/dx=C(1-2x)\to C$ at $x=0$. A 1 percent rise on
copper is $0.168\ {\rm n\Omega\,m}$, so
$x\le0.168/1208=1.4\times10^{-4}$: about **140 atomic ppm** of a dissimilar
solute is all a 1 percent budget tolerates, which is why interconnect purity
is specified at 99.99 percent and better.

**P18.9** Require $n_i(473\ {\rm K})\le0.1\,N_D$. Scaling from
$n_i(300)=10^{10}$ with $E_g=1.12$ eV:
$(1/300-1/473)=1.219\times10^{-3}$, exponent
$=E_g/2k_B\times1.219\times10^{-3}=7.92$, so
$n_i(473)=10^{10}e^{7.92}=2.8\times10^{13}$. Then
$N_D\ge2.8\times10^{14}\ {\rm cm^{-3}}$. Lightly doped drift regions are the
first casualties of heat, which is exactly where power devices need low doping
for blocking voltage: the silicon power-device designer is squeezed from both
sides, and problem P18.13 of lesson 3 quantifies the escape via SiC.

**P18.10** Substituting $u=E/k_BT$:
$\langle\tau\rangle=\tau_0\int u^{s+3/2}e^{-u}du/\int u^{3/2}e^{-u}du
=\tau_0\Gamma(s+5/2)/\Gamma(5/2)$. For $s=-1/2$:
$\langle\tau^{2}\rangle/\langle\tau\rangle^{2}
=\Gamma(3/2)\Gamma(5/2)/\Gamma(2)^{2}
=(\sqrt{\pi}/2)(3\sqrt{\pi}/4)/1=3\pi/8\approx1.18$.

**P18.11** $\tau_{\rm tr}=\mu m^{*}/e
=80\times0.067\times9.109\times10^{-31}/1.602\times10^{-19}=3.05\times10^{-11}$ s
$=30.5$ ps. Ratio $\tau_{\rm tr}/\tau_q=76$: scattering is overwhelmingly
small-angle, exactly the remote-donor signature of the figure in section 8.4.
An interface-roughness-limited sample would show a ratio near one; the ratio
is a fingerprint of *which* disorder limits the sample.

**P18.12** $k_F=(3\pi^{2}n)^{1/3}=(3\pi^{2}\times10^{27})^{1/3}
=3.1\times10^{9}\ {\rm m^{-1}}$, so $\ell=1/k_F=0.32$ nm. Then
$\tau=\ell/v_F$ with $v_F=\hbar k_F/m_0=3.6\times10^{5}$ m/s gives
$\tau=9\times10^{-16}$ s and $\mu=e\tau/m_0\approx1.6\ {\rm cm^{2}/Vs}$.
Below a few ${\rm cm^{2}/Vs}$ at metallic densities, band transport is dead:
module 25's disordered semiconductors, with mobilities of $10^{-3}$ to 10,
live below the Ioffe-Regel line, and that is why they required a different
theory, not a smaller $\tau$.
