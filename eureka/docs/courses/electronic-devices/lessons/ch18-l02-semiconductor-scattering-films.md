# Scattering in Semiconductors, Transport Theory, and Real Films

<!-- covers: 18.5, 18.6, 18.7, 18.8 -->

**Level.** Section 1 and 3 are the undergraduate core. Section 2 is the
Boltzmann formalism and section 4 the effective-medium theory; both are
graduate material, and both are used later in the course, so they are derived
rather than quoted.

## 1. Scattering mechanisms in semiconductors

A semiconductor has far fewer carriers than a metal, and they are
non-degenerate, so the scattering picture is richer. Four mechanisms matter.

### 1.1 Acoustic phonon (deformation potential) scattering

A long-wavelength acoustic phonon strains the lattice, and strain shifts the
band edge by the deformation potential $\Xi$. Carriers scatter off that
fluctuating potential. Fermi's golden rule with an elastic, equipartitioned
phonon population gives a relaxation time

$$
\tau_{\rm ac}(E)=\frac{\pi\hbar^{4}c_{l}}{\sqrt{2}\,\Xi^{2}(m^{*})^{3/2}k_BT}\;E^{-1/2}
$$

with $c_l$ the longitudinal elastic constant. Two features carry the physics:
the explicit $T^{-1}$ from the phonon population, and $\tau\propto E^{-1/2}$.
Averaging over a Maxwellian, as in module 18 lesson 1 section 5.2, adds a
further $T^{-1/2}$, so

$$
\boxed{\;\mu_{\rm ac}\propto T^{-3/2}\;}
$$

### 1.2 Ionised impurity scattering

A carrier passing a charged dopant is deflected by a screened Coulomb
potential. The Brooks-Herring treatment yields

$$
\mu_{\rm ii}=\frac{128\sqrt{2\pi}\,\varepsilon^{2}(k_BT)^{3/2}}
{N_I\,e^{3}\sqrt{m^{*}}\;\ln\!\left(1+b\right)-b/(1+b)},
\qquad
b=\frac{24 m^{*}\varepsilon (k_BT)^{2}}{\hbar^{2}e^{2}n}
$$

The structure matters more than the constants: $\mu_{\rm ii}\propto
T^{3/2}/N_I$. A faster carrier spends less time in the ion's field and is
deflected less, so **hotter is better** here, the opposite of phonons. The
logarithm is the screening cut-off, which is why the result depends weakly on
carrier density as well as on impurity density.

Put the two together with Matthiessen's rule and the peaked curve of lesson 1
follows, with the peak moving to higher temperature as doping rises.

### 1.3 Alloy and neutral impurity scattering

In a random alloy $A_xB_{1-x}C$, the cation site potential fluctuates even in a
chemically perfect crystal. The scattering rate is proportional to the same
composition variance met in Nordheim's rule:

$$
\frac{1}{\tau_{\rm alloy}}\propto x(1-x)\,\Delta U^{2}
$$

so alloy scattering sets a **mobility ceiling that purification cannot lift**.
This is why SiGe, AlGaAs and the quaternaries have mobilities well below their
endpoint compounds, and it is the reason module 55 can use alloying to wreck
thermal conductivity on purpose.

### 1.4 Optical phonon and carrier-carrier scattering

Optical phonons carry a large fixed quantum, $\hbar\omega_{\rm op}=63\ {\rm meV}$
in silicon and $36\ {\rm meV}$ in GaAs. Below that energy a carrier cannot emit
one, so the channel switches on abruptly once carriers are heated past it. That
threshold is the brake behind velocity saturation in the next lesson.

Carrier-carrier scattering conserves total momentum, so to first order it does
**not** limit conductivity. It redistributes energy within the carrier gas,
which matters for how hot carriers thermalize, not for how much current flows.

### 1.5 The design consequence

Doping raises $n$ and lowers $\mu$, so conductivity saturates rather than
scaling with dopant. Getting **both** high density and high mobility requires
separating carriers from their parent dopants in space, which is exactly the
modulation-doping trick of lesson 4.

| mechanism | $\tau(E)$ | $\mu(T)$ | controlled by |
|---|---|---|---|
| acoustic phonon | $E^{-1/2}$ | $T^{-3/2}$ | nothing (intrinsic) |
| ionised impurity | $E^{+3/2}$ | $T^{+3/2}$ | doping, compensation |
| alloy disorder | $E^{-1/2}$ | $T^{-1/2}$ | composition only |
| optical phonon | threshold | steep above $\hbar\omega_{\rm op}$ | intrinsic |
| surface roughness | - | falls with field | interface quality |

## 2. The Boltzmann transport equation

Everything above assumed a relaxation time. The Boltzmann equation is what
justifies it and shows where it fails.

### 2.1 The equation

Track $f(\mathbf{r},\mathbf{k},t)$, the occupation of a state. In steady state
the streaming terms balance the collisions:

$$
\underbrace{\mathbf{v}\cdot\nabla_{\mathbf{r}}f}_{\text{diffusion}}
+\underbrace{\frac{\mathbf{F}}{\hbar}\cdot\nabla_{\mathbf{k}}f}_{\text{field}}
=\left(\frac{\partial f}{\partial t}\right)_{\rm coll}
$$

The collision term is an integral over all transitions,

$$
\left(\frac{\partial f}{\partial t}\right)_{\rm coll}
=\sum_{\mathbf{k}'}\Big[S(\mathbf{k}',\mathbf{k})f'(1-f)-S(\mathbf{k},\mathbf{k}')f(1-f')\Big]
$$

which is what makes the equation hard.

### 2.2 The relaxation-time approximation and what it delivers

Assume collisions drive $f$ back to equilibrium exponentially,

$$
\left(\frac{\partial f}{\partial t}\right)_{\rm coll}=-\frac{f-f_0}{\tau(E)}
$$

Linearising for a small uniform field gives
$f=f_0+e\tau\mathbf{v}\cdot\boldsymbol{\mathcal{E}}\,(\partial f_0/\partial E)$,
and integrating the current $\mathbf{J}=-e\int\mathbf{v}f\,d^{3}k/4\pi^{3}$
returns

$$
\sigma=\frac{ne^{2}\langle\tau\rangle}{m^{*}}
$$

with the energy average of lesson 1. So the Drude form is recovered, now with a
principled definition of $\langle\tau\rangle$ and a route to computing it per
mechanism.

The same framework, with a temperature gradient instead of a field, gives the
thermoelectric coefficients of module 55 without any new physics.

### 2.3 Where the picture breaks

Three failures, each of which names a later topic:

- **Inelastic scattering.** Optical phonon emission removes a fixed large
  energy, so no single $\tau$ describes it. High-field transport needs the full
  equation or Monte Carlo.
- **Ballistic transport.** When the device is shorter than $\ell$, carriers
  cross without scattering and $\mu$ stops being meaningful. In a 20 nm channel
  with $\ell\approx50$ nm this is the normal case, and the Landauer picture of
  lesson 4 replaces drift-diffusion.
- **Fast transients.** If the field changes on a timescale shorter than $\tau$,
  carriers overshoot their steady-state velocity. Velocity overshoot is real and
  is exploited in short-channel devices.

## 3. Resistivity of thin and polycrystalline films

Bulk resistivity does not describe the films devices are made of, and the gap is
now a first-order industry problem.

### 3.1 Surface scattering: Fuchs-Sondheimer

Solve the Boltzmann equation in a slab with a boundary condition that a
fraction $p$ of carriers reflect specularly and $(1-p)$ diffusely. For a film
much thicker than the mean free path the result reduces to

$$
\boxed{\;\frac{\rho_f}{\rho_0}=1+\frac{3}{8}(1-p)\frac{\lambda}{t}\;}
\qquad (t\gg\lambda)
$$

Specular reflection ($p=1$) costs nothing: the carrier keeps its forward
momentum. Only diffuse reflection, which randomises direction, adds
resistivity.

### 3.2 Grain boundaries: Mayadas-Shatzkes

Model boundaries as planes of reflection coefficient $R$ spaced by the grain
diameter $d$. With $\alpha=(\lambda/d)\,R/(1-R)$,

$$
\frac{\rho_0}{\rho_g}=3\left[\frac{1}{3}-\frac{\alpha}{2}+\alpha^{2}
-\alpha^{3}\ln\!\left(1+\frac{1}{\alpha}\right)\right]
$$

![Both size effects plotted against dimension in units of the bulk mean free path, which is why the curves are material-independent. Below about two mean free paths the film is dominated by its own geometry.](/courses/electronic-devices/figures/m18-thin-film-resistivity.svg)

### 3.3 Why this now governs interconnect

Copper's mean free path is about 39 nm at 300 K. Advanced interconnect lines are
narrower than that, so both effects are in their strong regime and compound,
because deposited films tend to have grains comparable to their thickness.

### Worked example 3.1 — the effective resistivity of a narrow line

A copper line is 20 nm wide with grain size $d\approx20$ nm, $p=0$, $R=0.3$,
$\lambda=39$ nm, $\rho_0=16.8\ {\rm n\Omega\,m}$. Estimate the resistivity.

Surface term:

$$
\frac{\rho_f}{\rho_0}=1+\frac{3}{8}(1)\frac{39}{20}=1+0.73=1.73
$$

Grain boundary term with $\alpha=(39/20)(0.3/0.7)=0.836$:

$$
3\left[0.333-0.418+0.699-0.584\ln(2.196)\right]=3\left[0.614-0.460\right]=0.463
$$

so $\rho_g/\rho_0=1/0.463=2.16$. Adding the excesses (Matthiessen in the same
spirit as lesson 1):

$$
\frac{\rho}{\rho_0}\approx1+0.73+1.16=2.89
\quad\Longrightarrow\quad
\rho\approx48.5\ {\rm n\Omega\,m}
$$

Nearly three times the handbook value. **This is why a metal with worse bulk
resistivity but a shorter mean free path, such as cobalt or ruthenium, can win
at 15 nm**: it degrades less on the way down. Bulk resistivity is the wrong
figure of merit for a nanoscale conductor.

## 4. Inhomogeneous media and the effective-medium approximation

Thick-film resistors, conductive adhesives, porous films and composites are
mixtures, and their conductivity is not a weighted average of the constituents.

### 4.1 Bounds first

For any two-phase mixture, conduction is bounded by the two extreme geometries:

$$
\sigma_{\parallel}=\phi\sigma_1+(1-\phi)\sigma_2
\qquad\text{(slabs parallel to the current)}
$$

$$
\frac{1}{\sigma_{\perp}}=\frac{\phi}{\sigma_1}+\frac{1-\phi}{\sigma_2}
\qquad\text{(slabs across the current)}
$$

These Wiener bounds are far apart when the constituents differ strongly, which
is the first lesson: **composition does not determine conductivity;
microstructure does.**

### 4.2 The Bruggeman self-consistent condition

Embed each inclusion in a medium of the unknown effective conductivity and
require that the average field perturbation vanish. For spherical inclusions in
three dimensions,

$$
\phi\,\frac{\sigma_1-\sigma_{\rm eff}}{\sigma_1+2\sigma_{\rm eff}}
+(1-\phi)\,\frac{\sigma_2-\sigma_{\rm eff}}{\sigma_2+2\sigma_{\rm eff}}=0
$$

Setting the insulating phase to $\sigma_2=0$ and solving gives a strikingly
simple result:

$$
\boxed{\;\sigma_{\rm eff}=\sigma_1\,\frac{\phi-\phi_c}{1-\phi_c},
\qquad \phi_c=\tfrac{1}{3}\;}
$$

Conductivity is exactly zero below a **percolation threshold** and rises
linearly above it.

![The self-consistent mixture has no conduction at all until a connected path spans the sample. The parallel bound is drawn for comparison: the same composition, a different geometry, a completely different conductivity.](/courses/electronic-devices/figures/m18-percolation.svg)

### 4.3 Percolation in practice

The Bruggeman $\phi_c=1/3$ is for spheres in the mean-field treatment. Real
thresholds depend strongly on particle shape, because what matters is
connectivity, not volume:

| filler shape | approximate $\phi_c$ | consequence |
|---|---|---|
| spheres, random packing | 0.25 to 0.30 | conductive adhesives are heavily loaded |
| flakes | 0.05 to 0.15 | silver flake beats silver powder |
| fibres, aspect ratio 100 | 0.01 to 0.02 | carbon fibre composites conduct cheaply |
| nanotubes, aspect ratio 1000 | below 0.005 | a fraction of a percent suffices |

Near threshold, conductivity follows a power law $\sigma\propto(\phi-\phi_c)^{t}$
with $t\approx2$ in three dimensions, so it is **steep**, and therefore
sensitive to processing variation. Formulators sit deliberately above the knee.

Three places this returns in the course: thick-film resistor pastes get their
decade range of sheet resistance by moving across this curve (module 45);
isotropic and anisotropic conductive adhesives are formulated respectively just
above and just below threshold (module 54); and a porous or partly oxidised
metal film is far more resistive than its density suggests, because current
must thread around the voids.

## 5. Problems

**P18.6** A silicon sample at 300 K has $N_I=10^{17}\ {\rm cm^{-3}}$ and
lattice-limited mobility 1350. Given $\mu_{\rm ii}=760\ {\rm cm^{2}/Vs}$ at this
doping, find $\mu$ at 300 K and at 200 K, using the temperature exponents from
the table.

**P18.7** An aluminium film is 30 nm thick with $\lambda=19$ nm and fully
diffuse surfaces. By what factor does surface scattering alone raise its
resistivity? What thickness would halve that excess?

**P18.8** A conductive adhesive uses silver spheres with $\phi_c=0.28$ and
$t=2.0$. If a formulation at $\phi=0.35$ has bulk conductivity
$1.0\times10^{5}\ {\rm S/m}$, what conductivity results if mixing variation
drops a batch to $\phi=0.31$? Comment on process control.

**P18.9** *(graduate)* Starting from the linearised Boltzmann equation, show
that a temperature gradient produces a current
$\mathbf{J}=\sigma S(-\nabla T)$ and identify $S$ as an energy-weighted average
of $\tau$. This is the Seebeck coefficient of module 55.

### Answers

**P18.6** At 300 K, $1/\mu=1/1350+1/760\Rightarrow\mu=486\ {\rm cm^{2}/Vs}$. At
200 K, $\mu_L=1350(200/300)^{-3/2}=2480$ and
$\mu_I=760(200/300)^{3/2}=414$, so $1/\mu=1/2480+1/414\Rightarrow
\mu=355\ {\rm cm^{2}/Vs}$. Cooling made it **worse**, because at this doping
impurity scattering already dominates and it gets stronger as carriers slow.
That is the left-hand branch of the lesson 1 figure.

**P18.7** $\rho_f/\rho_0=1+\tfrac{3}{8}(19/30)=1.238$, a 23.8 percent excess. To
halve it to 11.9 percent needs $\tfrac{3}{8}(19/t)=0.119$, so $t=60$ nm.
Thickness buys improvement only linearly in $1/t$, which is why this problem
does not go away with modest process changes.

**P18.8** $\sigma\propto(\phi-\phi_c)^{2}$. Ratio
$=\left[(0.31-0.28)/(0.35-0.28)\right]^{2}=(0.03/0.07)^{2}=0.184$, so
$\sigma$ falls to $1.8\times10^{4}\ {\rm S/m}$, a factor of 5.4 for a 4 percent
loading change. Near threshold the composition tolerance has to be far tighter
than intuition suggests, which is why formulations sit well above the knee even
though silver is expensive.

**P18.9** With $f=f_0+g$ and $f_0$ depending on $\mathbf{r}$ through $T$, the
streaming term contributes
$\mathbf{v}\cdot\nabla T\,(\partial f_0/\partial T)
=\mathbf{v}\cdot\nabla T\,\frac{E-E_F}{T}\left(-\frac{\partial f_0}{\partial E}\right)$.
Balancing against $-g/\tau$ and integrating the current gives
$\mathbf{J}=\sigma S(-\nabla T)$ with

$$
S=-\frac{1}{eT}\frac{\langle\tau(E)\,(E-E_F)\rangle}{\langle\tau(E)\rangle}
$$

So the Seebeck coefficient measures the **average energy carried per carrier
relative to the Fermi level**. That is why $S$ is large when the carrier
distribution is asymmetric about $E_F$ and vanishes for a symmetric degenerate
metal, and it is the basis of every band-engineering strategy in module 55.
