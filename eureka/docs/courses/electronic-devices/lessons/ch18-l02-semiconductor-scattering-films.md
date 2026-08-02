# Scattering in Semiconductors, Transport Theory, and Real Films

<!-- covers: 18.5, 18.6, 18.7, 18.8 -->

Lesson 1 treated scattering as a single number $\tau$. This lesson opens the
box: which mechanisms scatter carriers in a semiconductor, how each one scales,
what the Boltzmann equation says about combining them, and what happens to
conduction when the conductor is a thin film, a polycrystal, or a mixture
rather than an ideal crystal.

**Level.** Sections 1 and 3 to 5 are the undergraduate core. Section 2 (the
Boltzmann machinery) and the derivations inside section 5 are graduate
material; both get used later, so they are derived rather than quoted.
Section 6 is the problem set.

## 1. The scattering catalogue

### 1.1 Acoustic phonons: the intrinsic floor

A long-wavelength acoustic phonon strains the lattice, and strain shifts the
band edge through the **deformation potential** $\Xi$ (a few eV in common
semiconductors): a passing sound wave is a travelling ripple in the potential
that carriers feel. Fermi's golden rule with an equipartitioned phonon
population gives

$$
\frac{1}{\tau_{\rm ac}(E)}
=\frac{\sqrt{2}\,\Xi^{2}(m^{*})^{3/2}k_BT}{\pi\hbar^{4}c_l}\,E^{1/2}
$$

with $c_l$ the longitudinal elastic constant. Two features carry the physics:
the explicit factor $T$ from the phonon population, and the rate growing as
$\sqrt{E}$ because faster carriers sample more lattice per second. Averaging
over the Maxwellian (lesson 1, section 8.2) yields

$$
\boxed{\;\mu_{\rm ac}\propto T^{-3/2}\;}
$$

This is the mechanism no purification touches: it is the crystal itself.

### 1.2 Ionised impurities: the price of doping

A carrier passing a charged dopant follows a Coulomb-deflected path; the
physics is Rutherford scattering with two solid-state amendments, screening
and degeneracy. The Brooks-Herring result, in its structure rather than its
constants:

$$
\mu_{\rm ii}\propto\frac{T^{3/2}}{N_I\,\ln(1+b)-b/(1+b)},
\qquad b\propto\frac{(k_BT)^{2}}{n}
$$

Fast carriers are deflected less (a swift fly-by spends little time in the
ion's field), hence the *rising* $T^{3/2}$; more ions scatter more, hence the
$1/N_I$; and the logarithm is the screening cut-off: beyond the screening
length the ion's charge is invisible, which is what keeps the Coulomb
cross-section from diverging.

The screening length itself, for a non-degenerate semiconductor, is the Debye
length

$$
L_D=\sqrt{\frac{\varepsilon k_BT}{e^{2}n}}
$$

about 41 nm for silicon at $10^{16}\ {\rm cm^{-3}}$ and 300 K, shrinking as
$n^{-1/2}$: heavier doping both adds scatterers and shortens the range of
each, which is why the mobility fall with doping eventually saturates.

### 1.3 The mechanisms that dominate elsewhere

- **Polar optical phonons.** In compound semiconductors the two atoms of the
  basis carry opposite effective charge, so an optical phonon is an oscillating
  dipole field that grips carriers strongly. This, not deformation-potential
  scattering, limits GaAs and GaN at room temperature, and its strength is why
  GaN's mobility (about 1200) sits far below what its light electron mass
  alone would give.
- **Piezoelectric scattering.** In crystals without inversion symmetry,
  acoustic strain also generates polarization; matters at low temperature in
  III-V and II-VI materials.
- **Intervalley scattering.** A large-momentum phonon can throw a carrier
  between equivalent conduction-band valleys; switched on above a threshold
  phonon energy, it is part of what shapes silicon's velocity saturation
  (lesson 3).
- **Neutral impurities.** Un-ionised dopants at low temperature; weak,
  short-range, nearly temperature-independent.
- **Carrier-carrier.** Conserves total momentum, so it does not degrade
  current directly; it redistributes energy, thermalising hot carriers, and it
  drags minority carriers along with majority flow.
- **Alloy disorder.** The $x(1-x)$ ceiling of lesson 1, section 7.2.
- **Surface roughness.** In a MOSFET inversion layer the gate field presses
  carriers against an atomically imperfect interface; the higher the field,
  the harder the pressing, giving the universal falling branch of inversion
  mobility at high gate bias. Module 43's interface quality is largely about
  this term.
- **Dislocations.** Charged line defects scatter cylindrically; negligible in
  good silicon at $10^{4}\ {\rm cm^{-2}}$, dominant in GaN-on-sapphire at
  $10^{8}$ to $10^{10}\ {\rm cm^{-2}}$ (modules 30 and 32).

| mechanism | $\tau(E)$ | $\mu(T)$ | knob that controls it |
|---|---|---|---|
| acoustic phonon | $E^{-1/2}$ | $T^{-3/2}$ | none: intrinsic |
| polar optical | complex | steep fall near $\theta_{\rm op}$ | material choice |
| ionised impurity | $E^{+3/2}$ | $T^{+3/2}$ | doping, compensation |
| neutral impurity | const | weak | freeze-out only |
| alloy | $E^{-1/2}$ | $T^{-1/2}$ | composition |
| surface roughness | falls with field | weak in $T$ | interface quality |
| dislocation | anisotropic | rises with $T$ | growth quality |

### 1.4 What doping actually buys

Combining lattice and impurity terms through Matthiessen gives the measured
mobility-versus-doping curve, standardly parameterised by the Caughey-Thomas
fit:

$$
\mu(N)=\mu_{\rm min}+\frac{\mu_{\rm max}-\mu_{\rm min}}
{1+\left(N/N_{\rm ref}\right)^{\alpha}}
$$

![Silicon at room temperature: the lattice-limited plateau at light doping, the ionised-impurity collapse through the mid range, and the saturation floor where screening and degeneracy take over. Electrons hold a three-to-one advantage over holes the whole way.](/courses/electronic-devices/figures/m18-mobility-vs-doping.svg)

Reading the curve is a designer's skill: conductivity is $ne\mu(n)$, so each
decade of doping below $10^{17}$ buys nearly a decade of conductivity, while a
decade past $10^{19}$ buys barely a factor of four. Sheet resistance targets,
contact layers and the extrinsic-plateau economics of lesson 1 all trace back
to this saturation.

### Worked example 1.1 — conductivity returns on doping

Using the electron fit ($\mu_{\rm min}=68.5$, $\mu_{\rm max}=1414$,
$N_{\rm ref}=9.2\times10^{16}$, $\alpha=0.711$), compare
$\sigma$ at $N=10^{16}$ and $10^{19}\ {\rm cm^{-3}}$.

At $10^{16}$: $(N/N_{\rm ref})^{\alpha}=(0.109)^{0.711}=0.207$, so
$\mu=68.5+1345.5/1.207=1183\ {\rm cm^{2}/Vs}$ and
$\sigma=ne\mu=1.90\ {\rm S/cm}$.

At $10^{19}$: $(108.7)^{0.711}=28.0$, so $\mu=68.5+1345.5/29.0=114.9$ and
$\sigma=184\ {\rm S/cm}$.

Three decades of dopant bought a factor of 97, not 1000: a third of the
nominal gain evaporated into impurity scattering. That lost factor of ten is
exactly the gap that modulation doping (lesson 4) recovers by moving the ions
away.

### Worked example 1.2 — which mechanism, from data alone

A film's mobility falls from 900 at 200 K to 480 at 400 K. Which mechanism
dominates? Fit a power law:
$\ln(900/480)/\ln(400/200)=0.907$, so $\mu\propto T^{-0.9}$. Pure acoustic
scattering predicts $-1.5$; pure impurity, $+1.5$. A slope of $-0.9$ says
lattice scattering dominates but is diluted by an impurity contribution.
Solve with Matthiessen assuming the pure laws: at 200 K let
$1/900=1/\mu_L+1/\mu_I$; at 400 K,
$1/480=1/(\mu_L 2^{-3/2})+1/(\mu_I 2^{3/2})$. Substituting
$x=1/\mu_L$, $y=1/\mu_I$ at 200 K: $x+y=1.111\times10^{-3}$ and
$2.828x+0.354y=2.083\times10^{-3}$, giving
$x=6.83\times10^{-4}$ ($\mu_L=1464$) and $y=4.28\times10^{-4}$
($\mu_I=2336$) at 200 K. Two temperatures, two mechanisms quantified: this
decomposition is a standard characterisation move, and module 36 does it with
five temperatures and a least-squares fit rather than two points.

## 2. The Boltzmann transport equation

### 2.1 The bookkeeping equation

Track the occupation $f(\mathbf{r},\mathbf{k},t)$ of each state. In steady
state, streaming balances collisions:

$$
\underbrace{\mathbf{v}\cdot\nabla_{\mathbf{r}}f}_{\text{diffusion}}
+\underbrace{\frac{\mathbf{F}}{\hbar}\cdot\nabla_{\mathbf{k}}f}_{\text{field}}
=\left(\frac{\partial f}{\partial t}\right)_{\rm coll}
$$

The collision term is an integral over all in- and out-scattering transitions,
weighted by occupations and blocking factors, and it is what makes the
equation hard: it couples every $\mathbf{k}$ to every other.

### 2.2 The relaxation-time approximation, worked

Assume collisions restore equilibrium exponentially:

$$
\left(\frac{\partial f}{\partial t}\right)_{\rm coll}
=-\frac{f-f_0}{\tau(E)}
$$

For a small uniform field, write $f=f_0+g$ and keep first order:

$$
-\frac{e\boldsymbol{\mathcal{E}}}{\hbar}\cdot\nabla_{\mathbf{k}}f_0
=-\frac{g}{\tau}
\quad\Longrightarrow\quad
g=e\tau\,\mathbf{v}\cdot\boldsymbol{\mathcal{E}}
\left(-\frac{\partial f_0}{\partial E}\right)
$$

The perturbation lives where $-\partial f_0/\partial E$ is large: across the
whole Maxwellian in a non-degenerate semiconductor, in a $k_BT$ shell at the
Fermi surface in a metal, which is the precise content of lesson 1's
section 8.1. Integrating the current
$\mathbf{J}=-e\int\mathbf{v}\,g\,d^{3}k/4\pi^{3}$ recovers

$$
\sigma=\frac{ne^{2}\langle\tau\rangle}{m^{*}}
$$

with the $\Gamma$-function average already used. The same $g$, driven by
$\nabla T$ instead of $\boldsymbol{\mathcal{E}}$, delivers the Seebeck
coefficient (problem P18.24), which is how module 55's thermoelectricity falls
out of this lesson with no new physics.

### 2.3 Where the approximation is honest and where it is not

The RTA is exact for elastic, isotropic scattering. It degrades gracefully for
anisotropic elastic scattering, where the $(1-\cos\theta)$ transport weighting
(lesson 1, section 8.4) patches it. It fails structurally for:

- **Strongly inelastic events.** Optical-phonon emission dumps 60 meV at a
  stroke; no single $\tau$ captures a process that reshapes the distribution.
  High-field transport (lesson 3) is done by Monte Carlo simulation, which
  samples individual carrier histories against the full scattering table.
- **Ballistic devices.** With channel length below $\ell$, "scattering per
  unit length" is the wrong variable altogether; lesson 4's Landauer picture
  replaces it.
- **Fast transients.** A field changing on the scale of $\tau$ produces
  velocity overshoot (lesson 3), invisible by construction to any steady-state
  $\mu(\mathcal{E})$ curve.

### Worked example 2.1 — mobility from a computed relaxation time

A Monte Carlo code reports, for electrons at 300 K,
$\tau(E)=0.30\,(E/k_BT)^{-1/2}$ ps. Find $\mu$ for $m^{*}=0.26\,m_0$.

$$
\langle\tau\rangle=\tau_0\frac{\Gamma(2)}{\Gamma(5/2)}
=0.30\ {\rm ps}\times\frac{1}{1.329}=0.226\ {\rm ps}
$$

$$
\mu=\frac{e\langle\tau\rangle}{m^{*}}
=\frac{1.602\times10^{-19}\times2.26\times10^{-13}}
{0.26\times9.109\times10^{-31}}
=0.153\ {\rm m^{2}/Vs}=1530\ {\rm cm^{2}/Vs}
$$

Consistent with silicon's lattice-limited value: the code's microscopic
$\tau(E)$ and the measured macroscopic $\mu$ meet through one
$\Gamma$-function.

## 3. Thin films: when the boundary is the scatterer

### 3.1 Fuchs-Sondheimer surfaces

Solve the Boltzmann equation in a slab of thickness $t$, with a fraction $p$
of carriers reflecting specularly (mirror-like: forward momentum kept) and
$1-p$ diffusely (momentum randomised). In the thick-film limit,

$$
\boxed{\;\frac{\rho_f}{\rho_0}=1+\frac{3}{8}(1-p)\frac{\lambda}{t}\;}
\qquad(t\gtrsim\lambda)
$$

A perfectly specular surface ($p=1$) costs nothing, which identifies the real
enemy as roughness at the scale of the electron wavelength. Real metal
surfaces and, worse, metal-liner interfaces are close to fully diffuse.

### 3.2 Mayadas-Shatzkes grain boundaries

Model boundaries as partially reflecting planes, reflection coefficient $R$,
spaced by grain diameter $d$. With $\alpha=(\lambda/d)\,R/(1-R)$,

$$
\frac{\rho_0}{\rho_g}
=3\left[\frac{1}{3}-\frac{\alpha}{2}+\alpha^{2}
-\alpha^{3}\ln\!\left(1+\frac{1}{\alpha}\right)\right]
$$

![Both size effects against dimension in units of the bulk mean free path: material-independent curves, which is the point of plotting them this way. Below roughly two mean free paths the film's geometry, not its chemistry, is the resistor.](/courses/electronic-devices/figures/m18-thin-film-resistivity.svg)

Copper's $\lambda$ is 39 nm at room temperature, and deposited films tend to
have grains comparable to their thickness, so both effects strengthen together
as lines shrink: the modern interconnect problem in one sentence.

### 3.3 The temperature twist

$\lambda$ grows as the phonons freeze out ($\lambda\propto1/T$ roughly), so
**size effects strengthen on cooling**: a wire that shows a 2x bulk penalty at
300 K can show 10x at 77 K, and cryogenic computing proposals have to budget
for interconnect that improves far less than bulk copper's RRR promises. Size
effects also blunt the TCR, since the geometric term is
temperature-independent: a thin film's measured TCR is always below bulk, and
the deficit is itself used as a diagnostic of $\lambda/t$.

### Worked example 3.1 — a 20 nm interconnect line

Copper, $t=d=20$ nm, diffuse surfaces ($p=0$), $R=0.3$,
$\lambda=39$ nm, $\rho_0=16.8\ {\rm n\Omega\,m}$.

Surface: $1+\tfrac{3}{8}(39/20)=1.73$.
Grains: $\alpha=(39/20)(0.3/0.7)=0.836$; the bracket evaluates to
$0.333-0.418+0.699-0.584\times\ln(2.196)=0.154$, so
$\rho_0/\rho_g=0.463$ and $\rho_g/\rho_0=2.16$.
Adding excesses: $\rho/\rho_0\approx1+0.73+1.16=2.89$, so
$\rho\approx49\ {\rm n\Omega\,m}$.

Almost three times bulk. Now redo the worked interconnect delay of lesson 1
with this resistivity: 0.34 ns becomes about 1 ns per millimetre. **This
factor, not transistor speed, is the frontier**, and it is why cobalt and
ruthenium, with shorter $\lambda$ (about 7 to 11 nm) and hence less to lose,
displace copper at the finest pitches despite worse bulk resistivity.

### Worked example 3.2 — separating the two effects experimentally

You suspect grains, not surfaces, dominate a 30 nm film. Design the
experiment. Anneal to grow grains at fixed thickness: the Mayadas term falls
while Fuchs-Sondheimer stays fixed, so the resistivity drop measures the
grain-boundary share directly. Measured on copper: annealing 30 nm films from
$d\approx15$ nm to $d\approx60$ nm typically recovers more than half the
excess, fingering boundaries as the larger culprit at these dimensions, which
is why interconnect processes anneal for grain growth and engineer bamboo
microstructures where boundaries span the line instead of lying along it.

## 4. Between crystal and film: the regime map

The quantities $\lambda$ and $L$ organise every transport regime in this
course, and it pays to place them on one chart.

![Mean free path against feature size: drift-diffusion below the diagonal, Landauer above it, and a decade-wide quasi-ballistic band along it. Real devices from this course are marked, and several sit uncomfortably on the line.](/courses/electronic-devices/figures/m18-mfp-regime-map.svg)

Three readings. A silicon FET channel at 20 nm with $\lambda\approx40$ nm is
*above* the line: its current is set by injection at the source barrier, not
by channel mobility, which is why "mobility" extracted from short devices is a
fiction unless corrected. A copper interconnect sits *below* the line as a
wire yet its cross-section sits at $\lambda$, hence section 3. And module 25's
disordered semiconductors live so far below the diagonal that $\lambda$
approaches the atomic spacing and the axis itself loses meaning, the
Ioffe-Regel exit of lesson 1.

## 5. Mixtures: effective media and percolation

### 5.1 Bounds before theories

For a two-phase mixture, no microstructure can beat slabs in parallel or do
worse than slabs in series:

$$
\sigma_{\parallel}=\phi\sigma_1+(1-\phi)\sigma_2,
\qquad
\frac{1}{\sigma_{\perp}}=\frac{\phi}{\sigma_1}+\frac{1-\phi}{\sigma_2}
$$

When the phases differ strongly these Wiener bounds are decades apart:
**composition does not determine conductivity; connectivity does.** Any claimed
composite conductivity outside the bounds is a measurement error, which makes
them a free sanity check.

### 5.2 Bruggeman's self-consistent medium

Embed each spherical grain in the yet-unknown effective medium and demand the
average field perturbation vanish:

$$
\phi\,\frac{\sigma_1-\sigma_{\rm eff}}{\sigma_1+2\sigma_{\rm eff}}
+(1-\phi)\,\frac{\sigma_2-\sigma_{\rm eff}}{\sigma_2+2\sigma_{\rm eff}}=0
$$

Set the second phase insulating, $\sigma_2=0$. The bracketed equation
collapses to a linear one, giving

$$
\boxed{\;\sigma_{\rm eff}=\sigma_1\,\frac{3\phi-1}{2}
\quad\text{for }\phi>\phi_c=\tfrac{1}{3},\qquad
\sigma_{\rm eff}=0\ \text{below}\;}
$$

A **percolation threshold**: below one-third filling, no conduction at all,
however conductive the filler.

![The self-consistent mixture conducts nothing until a connected path spans the sample, then rises linearly; the parallel bound above it is the same recipe with a different geometry, decades apart.](/courses/electronic-devices/figures/m18-percolation.svg)

### 5.3 Real percolation

Mean-field Bruggeman gets the existence of the threshold right and its details
wrong. Real random systems follow

$$
\sigma\propto(\phi-\phi_c)^{t},\qquad t\approx2.0\ \text{in 3D}
$$

with $\phi_c$ set by particle **shape**, because connectivity is what counts:

| filler | $\phi_c$ (approx.) | consequence |
|---|---|---|
| spheres | 0.28 | adhesives need heavy silver loading |
| flakes | 0.05 to 0.15 | silver flake beats powder |
| fibres, aspect 100 | 0.01 | conductive plastics at percent loadings |
| nanotubes, aspect 1000 | below 0.005 | transparent antistatic films |

The steep power law near threshold makes conduction exquisitely sensitive to
loading there, so products are formulated safely above the knee: thick-film
resistors span their decade range by walking down this curve (module 45),
isotropic conductive adhesives sit above threshold while anisotropic films sit
deliberately below it and rely on compression to connect (module 54), and a
porous barrier or seed layer can measure far more resistive than its density
suggests because current threads around voids.

### Worked example 5.1 — process tolerance near threshold

Silver spheres, $\phi_c=0.28$, $t=2.0$; a batch at $\phi=0.35$ delivers
$1.0\times10^{5}$ S/m. Mixing drift drops one lot to $\phi=0.31$:

$$
\frac{\sigma_{0.31}}{\sigma_{0.35}}
=\left(\frac{0.31-0.28}{0.35-0.28}\right)^{2}
=\left(\frac{0.03}{0.07}\right)^{2}=0.184
$$

The lot ships at $1.8\times10^{4}$ S/m: a factor of 5.4 lost to a four-point
loading slip. Sitting one distance from threshold buys conductivity; sitting
two distances buys manufacturability, which is why cost-optimised loadings are
never at the knee even though silver is money.

### Worked example 5.2 — using the bounds as a fraud detector

A datasheet claims $2\times10^{6}$ S/m for a 20 volume-percent silver-epoxy
composite ($\sigma_{\rm Ag}=6.3\times10^{7}$). The parallel bound is
$0.20\times6.3\times10^{7}=1.26\times10^{7}$: the claim passes that. The
percolation reality check does not: 20 percent spheres is *below* the
threshold, and even flakes at $\phi_c=0.10$ with $t=2$ give
$\sigma\sim6.3\times10^{7}\times(0.10)^{2}\times$(prefactor of order one)
$\sim6\times10^{5}$. The claimed number exceeds the physically plausible by
about 3x and demands scrutiny of the test geometry: bulk conductivity and
through-a-thin-bond-line conductance are routinely conflated in adhesive
datasheets, and this arithmetic is how you catch it.

## 6. Problems

**P18.13** From the table's power laws, at what temperature do acoustic-phonon
and ionised-impurity mobilities cross for a sample where they are equal at
150 K? What is the shape of $\mu(T)$ there?

**P18.14** Silicon at $N=3\times10^{17}\ {\rm cm^{-3}}$: evaluate the
Caughey-Thomas electron mobility, then the resistivity.

**P18.15** A GaAs sample has $\mu=8000$ at 300 K falling to 3500 at 400 K.
Show these points are inconsistent with pure acoustic-phonon scattering, and
name the mechanism responsible.

**P18.16** The Debye screening length at $10^{16}\ {\rm cm^{-3}}$ was quoted
as 41 nm. Verify it, and evaluate at $10^{19}$.

**P18.17** An aluminium film ($\lambda=19$ nm) is deposited at 50 nm with
$p=0$. Find the surface excess. The film is then thinned by polishing to
15 nm: find the new ratio and comment on the validity of the thick-film
formula there.

**P18.18** A 25 nm copper line has measured $\rho=52\ {\rm n\Omega\,m}$.
Assuming $p=0$ surfaces account for the Fuchs-Sondheimer share, extract the
grain-boundary reflection coefficient $R$ for $d=25$ nm.

**P18.19** Ruthenium: $\rho_0=71\ {\rm n\Omega\,m}$, $\lambda=6.6$ nm. At what
linewidth does fully diffuse copper ($\rho_0=16.8$, $\lambda=39$ nm) become
worse than fully diffuse ruthenium, comparing surface terms only with $t$ the
linewidth?

**P18.20** Estimate the TCR of the 20 nm copper line of worked example 3.1,
given bulk TCR $3.9\times10^{-3}\ {\rm K^{-1}}$, assuming the size excess is
temperature-independent.

**P18.21** Carbon fibres, aspect ratio 100, $\phi_c=0.01$, $t=2$: what loading
makes a polymer composite reach $10^{-2}$ of the fibre conductivity, and what
does the answer become for spheres at $\phi_c=0.28$?

**P18.22** Prove the Wiener series bound from two resistors in series, and
show the Bruggeman result respects both bounds for all $\phi$.

**P18.23** *(graduate)* Show that in two dimensions the Bruggeman condition
with $\sigma_2=0$ gives $\phi_c=1/2$, and connect this to why ultrathin
percolating metal films conduct later in their growth than 3D composites at
the same volume fraction.

**P18.24** *(graduate)* Drive the linearised Boltzmann equation with a
temperature gradient and show
$S=-\frac{1}{eT}\left(\langle E\tau\rangle/\langle\tau\rangle-E_F\right)$,
then state why heavy doping shrinks it.

### Answers

**P18.13** Equal components at the peak (lesson 1, worked example 4.2), so the
peak *is* 150 K and $\mu(T)$ falls as $T^{-3/2}$ above, $T^{3/2}$ below: the
crossing temperature is the mobility maximum.

**P18.14** $(3\times10^{17}/9.2\times10^{16})^{0.711}=(3.26)^{0.711}=2.32$;
$\mu=68.5+1345.5/3.32=474\ {\rm cm^{2}/Vs}$.
$\rho=1/(ne\mu)=1/(3\times10^{17}\times1.602\times10^{-19}\times474)
=0.0439\ \Omega\,$cm.

**P18.15** Acoustic prediction:
$8000\times(400/300)^{-3/2}=5196$, but 3500 is measured: the extra loss is
polar-optical scattering, which strengthens steeply as $k_BT$ climbs toward
the optical phonon energy (36 meV in GaAs). GaAs mobility data can never be
fitted with the $-3/2$ law alone, and the misfit direction identifies the
polar mechanism.

**P18.16** $L_D=\sqrt{\varepsilon k_BT/e^{2}n}$ with
$\varepsilon=11.7\times8.854\times10^{-12}$:
numerator $=1.036\times10^{-10}\times0.02585\times1.602\times10^{-19}$...
cleaner in one line:
$L_D=\sqrt{(11.7)(8.854\times10^{-12})(0.02585)/(1.602\times10^{-19}
\times10^{22})}=41\ {\rm nm}$ at $10^{16}\ {\rm cm^{-3}}$; scaling as
$n^{-1/2}$ gives 1.3 nm at $10^{19}$: at contact-layer doping the screening
cloud is two lattice constants, and the "ion" a carrier sees is barely there,
part of why the mobility fall saturates.

**P18.17** At 50 nm: $1+\tfrac{3}{8}(19/50)=1.14$. At 15 nm the formula gives
$1+0.475=1.48$, but $t<\lambda$ sits outside the thick-film expansion's
validity; the exact Fuchs solution gives a larger penalty, so 1.48 is a lower
bound. Quoting the expansion below $t\approx\lambda$ understates the problem,
a common error in quick estimates.

**P18.18** Surface share: $\tfrac{3}{8}(39/25)=0.585$, so surfaces alone
predict $\rho=16.8\times1.585=26.6$. The remainder ratio needed from grains:
$52/16.8-1-0.585=1.510$, so the Mayadas bracket must equal
$1/2.510=0.398$. Solving $3[\ldots]=0.398$ numerically for $\alpha$:
$\alpha\approx0.55$, and $R/(1-R)=\alpha d/\lambda=0.55\times25/39=0.353$,
giving $R\approx0.26$. Within the range (0.2 to 0.4) reported for copper,
which is the consistency check the extraction needs.

**P18.19** Surface-limited resistivities:
$\rho_{\rm Cu}(t)=16.8[1+14.6/t]$, $\rho_{\rm Ru}(t)=71[1+2.47/t]$ (nm).
Setting equal: $16.8t+245.6=71t+175.6$ gives $54.2t=70.0$, so
$t\approx1.3$ nm by this surface-only comparison; adding grain terms with
realistic $R$ moves the crossover to the 5 to 10 nm range. The structure of
the answer is what matters: the crossover exists because the penalty term
scales with $\rho_0\lambda$, and ruthenium's $\rho_0\lambda$ product is
smaller: the correct scaling figure of merit for end-of-roadmap conductors.

**P18.20** Only the bulk share drifts:
$\alpha_{\rm film}=\alpha_{\rm bulk}\times\rho_0/\rho_{\rm film}
=3.9\times10^{-3}/2.89=1.35\times10^{-3}\ {\rm K^{-1}}$. Measuring a film TCR
of a third of bulk is in fact a standard way to infer the size-effect share
without modelling $p$ and $R$ separately.

**P18.21** Need $(\phi-\phi_c)^{2}=10^{-2}$, so $\phi=\phi_c+0.1$: fibres at
11 percent, spheres at 38 percent. The aspect ratio moved the requirement by a
factor of 3.5 in loading, which for silver at bullion prices is the entire
economics of the conductive-adhesive industry.

**P18.22** Series slabs: thicknesses $\phi$ and $1-\phi$ per unit length,
resistances add:
$1/\sigma_{\perp}=\phi/\sigma_1+(1-\phi)/\sigma_2$. For Bruggeman with
$\sigma_2=0$: $\sigma_{\rm eff}=\sigma_1(3\phi-1)/2\le\phi\sigma_1$ requires
$(3\phi-1)/2\le\phi$, that is $\phi\le1$: true. And
$\sigma_{\rm eff}\ge0=\sigma_{\perp}$ trivially. Both bounds respected, as any
credible mixture theory must.

**P18.23** In 2D the depolarisation factor changes the denominator from
$\sigma_1+2\sigma_{\rm eff}$ to $\sigma_1+\sigma_{\rm eff}$; setting
$\sigma_2=0$ gives $\sigma_{\rm eff}=\sigma_1(2\phi-1)$, zero at
$\phi_c=1/2$. A growing metal film is a 2D percolation problem in its early
coalescence stage, so it conducts nothing until half-coverage: the measured
"percolation thickness" of thin metal films (module 44), and the reason
ultrathin transparent metal electrodes are hard, both live in that changed
threshold.

**P18.24** With $f_0(E;T(\mathbf{r}))$, the streaming term contributes
$\mathbf{v}\cdot\nabla T\,\frac{E-E_F}{T}(-\partial f_0/\partial E)$; the RTA
gives $g$ proportional to that, and the current integral splits into
$\langle\tau\rangle$ and $\langle E\tau\rangle$ pieces:

$$
S=-\frac{1}{eT}\left(\frac{\langle E\tau\rangle}{\langle\tau\rangle}-E_F\right)
$$

The Seebeck coefficient measures the mean transported energy relative to the
Fermi level. Heavy doping pushes $E_F$ up into the distribution, shrinking the
offset, which is exactly the $S$-versus-$\sigma$ trade that module 55's power
factor $S^{2}\sigma$ has to optimise through, and the reason thermoelectrics
are doped semiconductors rather than metals.
