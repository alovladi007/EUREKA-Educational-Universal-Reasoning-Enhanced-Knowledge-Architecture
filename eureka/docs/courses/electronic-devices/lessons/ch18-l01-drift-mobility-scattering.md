# Drift, Mobility and Why Resistivity Depends on Temperature

<!-- covers: 18.1, 18.2, 18.3, 18.4 -->

Ohm's law is an experimental summary, not an explanation. This lesson replaces
it with a mechanism: carriers accelerate in a field, get scattered, and the
balance between the two fixes the conductivity. Everything about resistivity in
metals, alloys and semiconductors follows from asking what does the scattering.

**Level.** Sections 1 to 4 are the undergraduate core. Sections marked
*Graduate extension* carry the Drude-to-Boltzmann bridge, the Ziman resistivity
formula and the Sommerfeld correction, and can be skipped on a first pass
without breaking the thread.

## 1. Drift velocity, mobility and conductivity

### 1.1 The equation of motion

Carriers in a solid are never still. At room temperature an electron in a
non-degenerate semiconductor moves at a thermal speed obtained by equating
kinetic energy to the equipartition value,

$$
\tfrac{3}{2}k_BT=\tfrac{1}{2}m^{*}v_{\rm th}^{2}
\quad\Longrightarrow\quad
v_{\rm th}=\sqrt{\frac{3k_BT}{m^{*}}}
$$

which for $m^{*}=0.26\,m_0$ in silicon at 300 K gives $v_{\rm th}\approx
2.3\times10^{5}\ {\rm m/s}$. That motion is random, so it carries no net
current.

Now apply a field $\mathcal{E}$. Newton's law with a friction term standing in
for scattering is

$$
m^{*}\frac{d\mathbf{v}_d}{dt}=-e\boldsymbol{\mathcal{E}}-\frac{m^{*}\mathbf{v}_d}{\tau}
$$

The friction term is the entire model: it says that scattering destroys the
drift momentum on a timescale $\tau$, the **mean free time**. Setting
$d\mathbf{v}_d/dt=0$ for steady state gives

$$
\boxed{\;\mathbf{v}_d=-\frac{e\tau}{m^{*}}\boldsymbol{\mathcal{E}}\equiv-\mu\boldsymbol{\mathcal{E}},
\qquad \mu=\frac{e\tau}{m^{*}}\;}
$$

The proportionality constant $\mu$ is the **drift mobility**. In SI it is
${\rm m^{2}V^{-1}s^{-1}}$; the literature almost always uses
${\rm cm^{2}V^{-1}s^{-1}}$, and $1\ {\rm m^{2}/Vs}=10^{4}\ {\rm cm^{2}/Vs}$.

### 1.2 From mobility to conductivity

With $n$ carriers per unit volume each of charge $-e$, the current density is
$\mathbf{J}=-en\mathbf{v}_d=en\mu\boldsymbol{\mathcal{E}}$, and comparing with
$\mathbf{J}=\sigma\boldsymbol{\mathcal{E}}$:

$$
\boxed{\;\sigma=en\mu=\frac{ne^{2}\tau}{m^{*}}\;}
\qquad\text{and for both carrier types}\qquad
\sigma=e\left(n\mu_n+p\mu_p\right)
$$

This factorization is the organizing idea of the whole module, because the two
factors are controlled by completely different physics. **Carrier density is
set by doping and temperature. Mobility is set by scattering.** A material can
be a poor conductor because it has few carriers or because those carriers are
scattered constantly, and the two cases behave nothing alike.

Three companion quantities:

| quantity | definition | silicon at 300 K, lightly doped |
|---|---|---|
| mean free time $\tau$ | average time between collisions | $\tau=\mu m^{*}/e\approx0.21\ {\rm ps}$ |
| mean free path $\ell$ | $\ell=v_{\rm th}\tau$ | $\approx 48\ {\rm nm}$ |
| drift velocity at 1 kV/cm | $v_d=\mu\mathcal{E}$ | $\approx1.4\times10^{5}\ {\rm cm/s}$ |

### Worked example 1.1 — how slow is drift, really?

A copper wire of cross-section $A=1\ {\rm mm^{2}}$ carries $I=1\ {\rm A}$.
Copper has one free electron per atom, density $8.96\ {\rm g/cm^{3}}$ and molar
mass $63.5\ {\rm g/mol}$, so

$$
n=\frac{8.96}{63.5}\times6.022\times10^{23}=8.5\times10^{22}\ {\rm cm^{-3}}
=8.5\times10^{28}\ {\rm m^{-3}}
$$

From $J=nev_d$,

$$
v_d=\frac{J}{ne}=\frac{1/(10^{-6})}{8.5\times10^{28}\times1.602\times10^{-19}}
=7.3\times10^{-5}\ {\rm m/s}\approx0.07\ {\rm mm/s}
$$

Roughly **four metres per day**. The drift velocity is about nine orders of
magnitude below the Fermi velocity of the same electrons. A signal travels down
the wire near the speed of light because the *field* propagates, not because
carriers do. Keeping these three speeds separate, thermal (or Fermi), drift and
signal, prevents most of the confusion beginners have about conduction.

## 2. Matthiessen's rule: adding independent scattering rates

Real carriers meet several scatterers at once. If the mechanisms are
statistically independent, the probabilities of scattering per unit time add:

$$
\frac{1}{\tau}=\sum_i\frac{1}{\tau_i}
$$

Since $\mu=e\tau/m^{*}$ and $\rho=1/\sigma=m^{*}/(ne^{2}\tau)$, this becomes

$$
\boxed{\;\frac{1}{\mu}=\sum_i\frac{1}{\mu_i}
\qquad\text{equivalently}\qquad
\rho=\sum_i\rho_i\;}
$$

This is **Matthiessen's rule**, and the resistivity form is the one to
remember: independent scattering contributions add as resistivities. Two
consequences worth internalizing:

- **The worst mechanism dominates.** If $\rho_1=20$ and $\rho_2=2$ in the same
  units, removing mechanism 2 entirely buys 9 percent. The right question about
  a conductor is always "what limits it *here*", never "how pure is it".
- **The rule is an approximation.** It assumes the mechanisms do not interfere.
  It fails when an impurity distorts the lattice enough to change local phonon
  scattering, and when scattering is strongly anisotropic so that the two
  mechanisms relax different parts of the distribution. Measured deviations
  from Matthiessen's rule are therefore themselves evidence of coupling.

![Two mechanisms with opposite temperature dependence combine through Matthiessen's rule. Impurity scattering limits the cold end, lattice scattering the hot end, and the peak sits where they cross.](/courses/electronic-devices/figures/m18-mobility-vs-temperature.svg)

### Worked example 2.1 — combining mobilities

A sample has lattice-limited mobility $\mu_L=1400$ and impurity-limited
$\mu_I=600\ {\rm cm^{2}/Vs}$. Then

$$
\frac{1}{\mu}=\frac{1}{1400}+\frac{1}{600}=7.14\times10^{-4}+1.667\times10^{-3}
=2.381\times10^{-3}
$$

$$
\mu=420\ {\rm cm^{2}/Vs}
$$

The result is below the smaller of the two, always. Note also that a 10 percent
improvement in $\mu_I$ moves $\mu$ by 7 percent, while a 10 percent improvement
in $\mu_L$ moves it by 2 percent. Effort should go where the reciprocal is
largest.

## 3. Why the resistivity of a metal rises with temperature

In a metal $n$ is fixed: every atom donates its valence electrons regardless of
temperature. All the temperature dependence therefore lives in $\tau$.

### 3.1 The phonon argument

An electron scatters off the displacement of an ion from its lattice site. The
scattering cross-section is proportional to the mean square displacement
$\langle u^{2}\rangle$, and for a classical oscillator of stiffness $K$ in
thermal equilibrium,

$$
\tfrac{1}{2}K\langle u^{2}\rangle=\tfrac{1}{2}k_BT
\quad\Longrightarrow\quad
\langle u^{2}\rangle=\frac{k_BT}{K}\;\propto\;T
$$

The scattering rate is (number of scatterers) $\times$ (cross-section)
$\times$ (velocity), and in a metal the velocity is the Fermi velocity, which
is temperature-independent. So $1/\tau\propto T$ and

$$
\rho_{\rm phonon}\propto T \qquad (T\gtrsim\theta_D/3)
$$

Below about a third of the Debye temperature $\theta_D$ the phonon population
freezes out, both the number of phonons and the effective scattering angle
shrink, and the Bloch-Gruneisen result $\rho\propto T^{5}$ takes over.

### 3.2 Matthiessen made visible

Adding the temperature-independent defect term:

$$
\rho(T)=\rho_{\rm res}+\rho_{\rm phonon}(T)
$$

Curves for samples of different purity are therefore **parallel**, offset by a
constant. That is the experimental signature of Matthiessen's rule, and it is
what the figure below shows.

![Three purities of the same metal. The phonon term is common, so the curves are parallel and separated only by their residual resistivity.](/courses/electronic-devices/figures/m18-metal-resistivity.svg)

The standard purity metric follows directly. The **residual resistance ratio**

$$
\mathrm{RRR}=\frac{\rho(300\ {\rm K})}{\rho(4.2\ {\rm K})}
\approx\frac{\rho_{\rm phonon}(300)+\rho_{\rm res}}{\rho_{\rm res}}
$$

is large when the phonon term dominates, which means very little else is in the
way. Commercial copper has RRR of 50 to 100; the best annealed single crystals
exceed $10^{4}$.

### 3.3 The temperature coefficient of resistance

Engineers meet this as

$$
\rho(T)=\rho_0\left[1+\alpha_0(T-T_0)\right],
\qquad
\alpha_0=\frac{1}{\rho_0}\left.\frac{d\rho}{dT}\right|_{T_0}
$$

For a pure metal near room temperature $\rho_{\rm res}\ll\rho_{\rm phonon}$, so
$\rho\approx cT$ and $\alpha_0\approx1/T_0=1/293\approx3.4\times10^{-3}\
{\rm K^{-1}}$. Measured values cluster near $3.9\times10^{-3}$ for copper,
aluminium and platinum, which is the same physics with the residual term and
the Bloch-Gruneisen curvature folded in. **A room-temperature TCR near
$1/T$ is a fingerprint that phonons dominate.**

| material | $\rho$ at 300 K (n$\Omega\,$m) | $\alpha_0$ ($10^{-3}$/K) | what limits it |
|---|---|---|---|
| silver | 15.9 | 3.8 | phonons |
| copper | 16.8 | 3.9 | phonons |
| aluminium | 26.5 | 3.9 | phonons |
| tungsten | 52.8 | 4.5 | phonons |
| nichrome | 1100 | 0.4 | alloy disorder |
| constantan | 490 | 0.01 | alloy disorder, deliberately compensated |

### Worked example 3.1 — a platinum resistance thermometer

A Pt100 sensor reads $100.00\ \Omega$ at 0 °C with
$\alpha_0=3.85\times10^{-3}\ {\rm K^{-1}}$. What resistance corresponds to
85 °C, and what temperature error follows from a $0.05\ \Omega$ measurement
uncertainty?

$$
R=100\left[1+3.85\times10^{-3}\times85\right]=132.7\ \Omega
$$

$$
\frac{dR}{dT}=100\times3.85\times10^{-3}=0.385\ \Omega/{\rm K}
\quad\Longrightarrow\quad
\delta T=\frac{0.05}{0.385}=0.13\ {\rm K}
$$

The sensitivity is set by $\alpha_0$, which is set by the phonon physics of
section 3.1. This is a direct line from lattice vibrations to an instrument
specification.

### 3.4 Contrast with semiconductors

Semiconductors do the opposite, for a different reason. There $n$ rises roughly
as

$$
n_i\propto T^{3/2}\exp\!\left(-\frac{E_g}{2k_BT}\right)
$$

and that exponential swamps the falling mobility. **Metals get worse when hot
because of mobility; semiconductors get better when hot because of carrier
density.** Same equation $\sigma=ne\mu$, different dominant factor. Every
negative-temperature-coefficient thermistor is this exponential, and every
thermal runaway in a bipolar device is it too.

## 4. Alloys and Nordheim's rule

A solute atom perturbs the periodic potential in two ways: its core charge
differs, and its size differs, so it strains the lattice around it. Both
scatter. Because the perturbation is static, the contribution is essentially
temperature-independent and adds to the residual term.

For a random solid solution the added resistivity follows

$$
\boxed{\;\rho_{\rm alloy}=C\,x(1-x)\;}
$$

with $x$ the solute atomic fraction. This is **Nordheim's rule**. The shape is
forced by the disorder: at $x=0$ every site is host and at $x=1$ every site is
solute, so both ends are perfectly ordered crystals with no alloy scattering,
and the disorder is maximal in between.

![Nordheim's parabola for two solute-solvent pairs. The prefactor grows with how dissimilar the atoms are; the shape is fixed by the statistics of a random solution.](/courses/electronic-devices/figures/m18-nordheim.svg)

*Where the parabola comes from.* Treat each site independently. The probability
that a given site is a scatterer-relative-to-the-average is the probability
that it differs from the mean occupancy. For a binary random alloy the variance
of the site occupancy is exactly

$$
\langle(\delta c)^{2}\rangle=x(1-x)
$$

and, in the Born approximation, the scattering rate is proportional to the mean
square of the potential fluctuation, hence to $x(1-x)$. So Nordheim's rule is
the statistics of a random binary mixture, not an empirical curve fit.

### Three consequences

- **Resistance alloys sit near $x=0.5$.** Constantan (roughly Cu-45Ni) and
  nichrome are chosen where the Nordheim term is large and, more importantly,
  where its temperature independence nearly cancels the phonon term. That gives
  the near-zero TCR in the table above: a deliberate use of disorder.
- **Conductors must be kept pure.** Copper busbar and interconnect are specified
  at very high purity because the parabola is steep near $x=0$: the initial
  slope is $C$, so the first atomic percent costs the most.
- **Order changes everything.** Nordheim's rule assumes a *random* solution. If
  the alloy orders into a compound or separates into two phases, the disorder
  falls and resistivity drops sharply at fixed composition. Heat treatment can
  therefore change resistivity without changing chemistry, which is a useful
  diagnostic and an occasional manufacturing surprise.

### Worked example 4.1 — extracting the Nordheim coefficient

A Cu-Ni alloy at $x=0.20$ measures $\rho=210\ {\rm n\Omega\,m}$ at 300 K. Pure
copper is $16.8$. Estimate $C$, then predict $\rho$ at $x=0.45$.

Subtract the host contribution and invert the rule:

$$
\rho_{\rm alloy}=210-16.8=193\ {\rm n\Omega\,m}
\quad\Longrightarrow\quad
C=\frac{193}{0.20\times0.80}=1206\ {\rm n\Omega\,m}
$$

$$
\rho(0.45)\approx16.8+1206\times0.45\times0.55=16.8+298=315\ {\rm n\Omega\,m}
$$

The measured value for that composition is around $300\ {\rm n\Omega\,m}$, so
the one-parameter rule is good to a few percent across a wide composition
range. Where it fails badly, suspect ordering or a second phase.

## 5. Graduate extension: from Drude to Boltzmann

The relaxation-time argument above is Drude's, with a quantum effective mass
bolted on. Two things about it are wrong in detail, and knowing which matters.

### 5.1 Which electrons carry the current

Drude assumed all $n$ electrons respond. In a degenerate metal they cannot:
the Pauli principle blocks any electron more than $\sim k_BT$ below the Fermi
level from changing its state. Only a fraction $\sim k_BT/E_F$ of electrons
are free to scatter.

The remarkable result is that the conductivity formula survives. Solving the
Boltzmann equation in the relaxation-time approximation gives

$$
\sigma=\frac{e^{2}}{3}v_F^{2}\,\tau(E_F)\,g(E_F)
$$

where $g(E_F)$ is the density of states at the Fermi level. For a free-electron
gas $g(E_F)=3n/2E_F$ and $E_F=\tfrac{1}{2}m v_F^{2}$, and substituting returns

$$
\sigma=\frac{ne^{2}\tau}{m}
$$

exactly as before. **The Drude expression is right; Drude's reason for it was
not.** The correct statement is that $n$ is the total density but $\tau$ and
$v$ are evaluated *at the Fermi surface*. This is why measured $\tau$ in a
metal is a Fermi-surface property and why the temperature dependence is that of
$\tau(E_F)$ alone.

### 5.2 Energy-dependent $\tau$ and the averaging problem

In a non-degenerate semiconductor, carriers occupy a broad Maxwellian
distribution and $\tau$ depends on energy, typically as a power law
$\tau(E)\propto E^{s}$ with $s=-1/2$ for acoustic phonon scattering and
$s=+3/2$ for ionised impurity scattering. The transport mobility uses the
weighted average

$$
\langle\tau\rangle=\frac{\int_0^{\infty}\tau(E)\,E^{3/2}\,(-\partial f/\partial E)\,dE}
{\int_0^{\infty}E^{3/2}\,(-\partial f/\partial E)\,dE}
$$

Evaluating this for a Maxwellian gives the two temperature exponents used
throughout this module:

$$
\mu_{\rm ac}\propto T^{-3/2},\qquad \mu_{\rm ii}\propto T^{+3/2}
$$

It also explains why the **Hall mobility differs from the drift mobility**. The
Hall coefficient involves $\langle\tau^{2}\rangle$ rather than
$\langle\tau\rangle$, so

$$
\mu_H=r_H\,\mu_d,\qquad
r_H=\frac{\langle\tau^{2}\rangle}{\langle\tau\rangle^{2}}
$$

with $r_H=3\pi/8\approx1.18$ for acoustic scattering and $315\pi/512\approx1.93$
for ionised impurity scattering. Reporting a Hall mobility as a drift mobility
is therefore a systematic error of up to a factor of two, and module 36 returns
to it.

### 5.3 The Ziman formula, and why alloys are different

For phonon scattering in a metal the resistivity can be written as an integral
over the Fermi surface weighted by the phonon spectrum. The essential feature
is the factor $(1-\cos\theta)$:

$$
\frac{1}{\tau_{\rm tr}}\propto\int (1-\cos\theta)\,S(\mathbf{q})\,d\Omega
$$

Forward scattering ($\theta\to0$) does not degrade the current at all, so it
does not contribute to resistivity even though it is a real scattering event.
This is why the *transport* lifetime differs from the *quantum* lifetime
measured by, say, the width of a quantum oscillation, and the two can differ by
an order of magnitude in a 2D electron gas where small-angle scattering from
remote donors dominates. Module 18's later lesson on the 2DEG depends on this
distinction: modulation doping removes scatterers from the channel, but what it
suppresses most effectively is precisely the large-angle scattering that
$(1-\cos\theta)$ weights heavily.

## 6. Problems

**P18.1** Aluminium has $\rho=26.5\ {\rm n\Omega\,m}$ at 300 K, one free
electron per atom, density $2.70\ {\rm g/cm^{3}}$ and molar mass
$27.0\ {\rm g/mol}$. Find $n$, $\mu$, and $\tau$ (take $m^{*}=m_0$).

**P18.2** A silicon sample has $\mu_L=1350$ and, at a doping of
$10^{17}\ {\rm cm^{-3}}$, $\mu_I=900\ {\rm cm^{2}/Vs}$. (a) Find $\mu$. (b) The
doping is raised tenfold, which halves $\mu_I$. Find the new $\mu$ and the
percentage change in $\sigma$, given that $n$ rose by a factor of ten.

**P18.3** A copper sample has RRR = 80. Estimate $\rho_{\rm res}$ and the
temperature at which the phonon and residual contributions are equal, assuming
$\rho_{\rm phonon}$ is linear in $T$ down to that point.

**P18.4** A Cu-Ni alloy at $x=0.10$ has $\rho=130\ {\rm n\Omega\,m}$. Using
Nordheim's rule with pure Cu at 16.8, find $C$ and the composition of maximum
resistivity, and comment on why the real Cu-Ni system peaks slightly off
$x=0.5$.

**P18.5** *(graduate)* Show that for $\tau(E)=\tau_0(E/k_BT)^{s}$ and a
Maxwellian distribution, $\langle\tau\rangle=\tau_0\,\Gamma(s+5/2)/\Gamma(5/2)$.
Evaluate for $s=-1/2$ and confirm the $T^{-3/2}$ mobility law.

### Answers

**P18.1** $n=6.02\times10^{28}\ {\rm m^{-3}}$;
$\mu=1/(ne\rho)=3.9\times10^{-3}\ {\rm m^{2}/Vs}=39\ {\rm cm^{2}/Vs}$;
$\tau=\mu m_0/e=2.2\times10^{-14}\ {\rm s}$. Note how much lower a metal's
mobility is than silicon's, and that its conductivity is nonetheless far higher
because $n$ is six orders of magnitude larger. This is the $\sigma=ne\mu$
factorization at work.

**P18.2** (a) $1/\mu=1/1350+1/900\Rightarrow\mu=540\ {\rm cm^{2}/Vs}$.
(b) $\mu_I=450$, so $1/\mu=1/1350+1/450\Rightarrow\mu=337.5$. Conductivity
scales as $n\mu$: $(10\times337.5)/(1\times540)=6.25$, a 525 percent increase.
Ten times the dopant bought 6.25 times the conductivity, which is the
diminishing return that makes heavy doping unattractive for series resistance.

**P18.3** $\rho_{\rm res}=\rho(300)/{\rm RRR}=16.8/80=0.21\ {\rm n\Omega\,m}$.
Linear phonon term $\rho_{\rm ph}=16.6\,(T/300)$, equal to $\rho_{\rm res}$ at
$T=3.8\ {\rm K}$. In reality the Bloch-Gruneisen $T^{5}$ roll-off makes the
crossing occur higher, near 10 to 20 K, which is why the linear extrapolation
is only a first estimate.

**P18.4** $C=(130-16.8)/(0.1\times0.9)=1258\ {\rm n\Omega\,m}$; maximum at
$x=0.5$ giving $\rho\approx331\ {\rm n\Omega\,m}$. The real system peaks near
$x=0.45$ and lower than the rule predicts, because Cu-Ni develops short-range
order and, below about 600 K, a miscibility gap. Both reduce the randomness
that the $x(1-x)$ variance assumed.

**P18.5** With $f\propto e^{-E/k_BT}$ the weighting is $E^{3/2}e^{-E/k_BT}$, so
$\langle\tau\rangle=\tau_0\int u^{s+3/2}e^{-u}du/\int u^{3/2}e^{-u}du
=\tau_0\Gamma(s+5/2)/\Gamma(5/2)$. For acoustic scattering the collision rate
goes as the phonon population times the density of final states, giving
$\tau_0\propto T^{-1}$ and $s=-1/2$, so
$\langle\tau\rangle\propto T^{-1}\cdot T^{0}$ with the gamma-function ratio a
pure number $=\Gamma(2)/\Gamma(5/2)=0.752$. Folding in the $T^{-1/2}$ from
expressing $E$ in units of $k_BT$ yields $\mu\propto T^{-3/2}$.
