# Low-Dimensional Conduction: 2DEG, Quantized Channels, Quantum Hall

<!-- covers: 18.12, 18.13, 18.14 -->

Confine carriers to a region comparable to their quantum wavelength and
transport stops being a story about drift and scattering and becomes a story
about allowed states. The three cases of this lesson descend in
dimensionality, and each underpins a real technology or a live measurement
standard.

**Level.** Sections 1 to 3 alternate derivation and application at the
undergraduate-to-early-graduate boundary; sections 2.4, 3.4 and 4.4 to 4.6 are
graduate. Section 5 is the problem set.

## 1. Dimensionality is a property of the density of states

Before any device: what confinement actually does. Count plane-wave states in
a box of $d$ dimensions. States fill $k$-space uniformly, the number below
wavevector $k$ scales as $k^{d}$, and with $E\propto k^{2}$ the density of
states per unit energy obeys

$$
g_d(E)\propto E^{\,(d-2)/2}
$$

Three exponents, three qualitatively different materials:

$$
g_{3D}=\frac{(2m^{*})^{3/2}}{2\pi^{2}\hbar^{3}}\sqrt{E},
\qquad
g_{2D}=\frac{m^{*}}{\pi\hbar^{2}}\ \text{per subband},
\qquad
g_{1D}=\frac{1}{\pi\hbar}\sqrt{\frac{2m^{*}}{E-E_n}}\ \text{per mode}
$$

![The square-root rise of the bulk, the energy-independent staircase of the sheet, and the inverse-square-root spikes of the wire: every optical and transport peculiarity of low-dimensional devices traces back to one of these three shapes.](/courses/electronic-devices/figures/m18-dos-dimensionality.svg)

The 2D constancy makes sheet properties linear in density
($E_F=\pi\hbar^{2}n_s/m^{*}$: used repeatedly below). The 1D divergences (van
Hove singularities) concentrate response at subband edges, which is why
nanotubes and nanowires show sharp spectral features where bulk crystals show
smooth bands (module 48 reads nanotube optics off exactly these spikes).

## 2. The two-dimensional electron gas

### 2.1 Modulation doping: separating carriers from their ions

Lesson 2 quantified the cost of doping: the ions that donate the carriers
scatter them, and $\mu_{\rm ii}\propto1/N_I$ caps every bulk mobility.
**Modulation doping** breaks the bargain. Grow wide-gap AlGaAs on narrow-gap
GaAs; dope only the AlGaAs, and keep an undoped spacer of thickness $d_s$
against the interface. Donated electrons fall into the GaAs, where the
conduction band is lower, and are held against the junction by the attraction
of the ions they left; the band edge bends into a roughly triangular well.

![The band diagram computed for the structure: ionised donors on the left of the undoped spacer, the electron sheet on the right, and two bound subbands in the triangular notch. The spatial gap between charge and scatterer is the entire trick.](/courses/electronic-devices/figures/m18-2deg-band.svg)

### 2.2 The triangular well

Near the interface, $V(z)\approx e\mathcal{E}_sz$: Schrodinger's equation with
a linear potential, whose solutions are Airy functions with energies

$$
E_i\simeq\left(\frac{\hbar^{2}}{2m^{*}}\right)^{1/3}
\left[\frac{3\pi e\mathcal{E}_s}{2}\left(i+\tfrac{3}{4}\right)\right]^{2/3},
\qquad i=0,1,2,\dots
$$

Spacings run 20 to 50 meV: at low temperature and moderate density only
$E_0$ is occupied, motion normal to the interface is frozen out, and the
system is genuinely two-dimensional. In-plane motion remains free, with the
constant $g_{2D}$ of section 1.

### 2.3 What the separation buys, quantitatively

Remote ions a spacer-length away scatter through small angles only, and
lesson 1's $(1-\cos\theta)$ weighting discounts small angles almost entirely
(that is the figure in lesson 1, section 8.4, and the
$\tau_{\rm tr}/\tau_q\approx76$ of its problem P18.11 was measured on exactly
this system). The results rewrote the record book: bulk GaAs peaks near
$10^{4}\ {\rm cm^{2}/Vs}$ at ideal doping; 2DEGs pass
$10^{6}$ routinely and exceed $3\times10^{7}$ in the cleanest structures, with
mean free paths beyond 100 µm: macroscopic distances without a single
momentum-relaxing event.

The design trade is explicit: widening the spacer weakens remote scattering
but also weakens the transfer that populates the well, so $n_s$ falls as
$\mu$ rises. Every heterostructure datasheet is a chosen point on that curve.

### Worked example 2.1 — the electrostatics of the sheet

Treat the spacer as a capacitor: donors at surface density $n_s$ sit a
distance $d_{\rm eff}\approx d_s+w_d/2$ from the sheet. For
$n_s=3\times10^{11}\ {\rm cm^{-2}}$ and $\varepsilon_r=12.9$, the interface
field is

$$
\mathcal{E}_s=\frac{en_s}{\varepsilon}
=\frac{1.602\times10^{-19}\times3\times10^{15}}
{12.9\times8.854\times10^{-12}}
=4.2\times10^{6}\ {\rm V/m}
$$

Feeding the triangular-well formula with $m^{*}=0.067m_0$:

$$
E_0\simeq\left(\frac{(1.055\times10^{-34})^{2}}
{2\times6.10\times10^{-32}}\right)^{1/3}
\left[\frac{3\pi\times1.602\times10^{-19}\times4.2\times10^{6}}{2}
\times\frac{3}{4}\right]^{2/3}
=3.8\times10^{-21}\ {\rm J}\approx24\ {\rm meV}
$$

and $E_1-E_0\approx0.77E_0\left[(7/3)^{2/3}-1\right]\approx18$ meV. Against
the Fermi energy $E_F=\pi\hbar^{2}n_s/m^{*}=10.7$ meV: one subband occupied,
confirming the two-dimensional idealisation, and showing how the
approximation would fail at higher density: push $n_s$ past about
$8\times10^{11}$ and the second subband populates, opening a new intersubband
scattering channel that visibly dents the mobility. Density-dependent
mobility kinks are subband spectroscopy for free.

### Worked example 2.2 — charge control: the HEMT equation

Gate the 2DEG through a barrier of thickness $d$ (donor layer plus spacer,
say 30 nm). The sheet obeys a capacitor law,

$$
n_s=\frac{\varepsilon}{ed}\left(V_G-V_T\right)
$$

Per volt of gate drive:

$$
\frac{\varepsilon}{ed}
=\frac{12.9\times8.854\times10^{-12}}
{1.602\times10^{-19}\times30\times10^{-9}}
=2.4\times10^{16}\ {\rm m^{-2}V^{-1}}
=2.4\times10^{12}\ {\rm cm^{-2}V^{-1}}
$$

Half a volt of overdrive supplies the $10^{12}\ {\rm cm^{-2}}$ a microwave
HEMT runs on. Transconductance then follows as
$g_m=(\varepsilon/d)\,v$ per unit width with $v$ the (near-saturation, often
overshoot-assisted: lesson 3) carrier velocity: the two lessons meet inside
one device equation. In AlGaN/GaN the same electrostatics is driven not by
donors but by polarization discontinuity, delivering
$n_s\approx10^{13}\ {\rm cm^{-2}}$ with **no doping at all**: the highest
sheet densities in any undoped semiconductor system, and the reason GaN power
amplifiers exist (module 32 supplies the materials story).

### 2.4 Graduate: screening and the last scatterers

With remote ions neutralised, what limits the best 2DEGs? In order of their
historical removal: background impurities in the channel (attacked with
purer sources: module 30's MBE), interface roughness (attacked with
growth-interrupted smoothing), and finally the unremovable acoustic phonons,
which at millikelvin temperatures leave interaction physics itself as the
"limit": the fractional quantum Hall regime of section 4.6 only became
visible because every disorder scatterer had been engineered away. A
technology chapter became a discovery instrument, which is the recurring
pattern of this lesson.

## 3. One dimension: quantized conductance

### 3.1 Modes

Constrict the 2DEG to a width $W$ comparable to the Fermi wavelength
($\lambda_F=\sqrt{2\pi/n_s}\approx46$ nm at
$3\times10^{11}\ {\rm cm^{-2}}$). Transverse motion quantizes into
waveguide-like modes,

$$
E_n(k_x)=\frac{\hbar^{2}\pi^{2}n^{2}}{2m^{*}W^{2}}
+\frac{\hbar^{2}k_x^{2}}{2m^{*}}
$$

and the number of propagating modes at the Fermi level is
$N=\lfloor k_FW/\pi\rfloor$: a gate that squeezes $W$ admits them one at a
time.

### 3.2 The Landauer miracle: velocity cancels density

The current one spin-degenerate mode carries between reservoirs offset by
$eV$ is charge times density of states times velocity. In one dimension,

$$
g_{1D}(E)\,v(E)=\frac{2}{\pi\hbar v}\times v=\frac{2}{\pi\hbar}
$$

**energy-independent**: slow modes are dense, fast modes are sparse, and the
product is universal. Hence

$$
\boxed{\;G=\frac{2e^{2}}{h}\sum_{n}T_n,
\qquad
G_0=\frac{2e^{2}}{h}=(12.906\ {\rm k\Omega})^{-1}\;}
$$

![Each mode admitted by the widening channel adds exactly one conductance quantum; the step height contains only fundamental constants, and the material has vanished from its own conductance.](/courses/electronic-devices/figures/m18-quantized-conductance.svg)

### 3.3 Where is the resistance of a perfect wire?

A ballistic channel ($T_n=1$) still resists: $12.9\ {\rm k\Omega}$ for one
mode. The dissipation happens **in the reservoirs**, where the few modes of
the channel thermalise into the continuum; the channel itself is lossless.
Resistance here is a counting statement about how many conduction pathways
connect two contacts, not a statement about scattering. Practical corollary:
as interconnects approach a few modes, $h/2e^{2}$ per mode is a floor no
material choice can breach: the far end of lesson 2's regime map, reached from
the ballistic side. The same accounting extends to heat: each mode also
carries a quantum of thermal conductance,
$g_{\rm th}=\pi^{2}k_B^{2}T/3h$, verified in the same geometries.

### Worked example 3.1 — reading a QPC trace

A point contact shows plateaux at 77.5, 155.0 and 232.4 µS. Dividing by
$G_0=77.48$ µS: 1.00, 2.00, 3.00: one, two, three modes, quantised to better
than a percent with no material parameter anywhere. Now the same device at
4.2 K instead of 0.1 K: steps survive but round, because plateaux need the
subband spacing (a few meV at $W\approx100$ nm) to exceed both $k_BT$ and the
source-drain broadening. In atomic-scale metal break junctions the spacings
are electron-volts and the *same staircase* appears at room temperature:
module 52 measures single molecules against exactly this ladder.

### 3.4 Graduate: from Landauer to Ohm, and back

Two ballistic obstacles in series do not add resistances: transmissions
compose. For incoherent addition of a scatterer of transmission $T$ inside a
mode,

$$
R=\frac{h}{2e^{2}}\left(1+\frac{1-T}{T}\right)
=\underbrace{\frac{h}{2e^{2}}}_{\rm contacts}
+\underbrace{\frac{h}{2e^{2}}\frac{1-T}{T}}_{\rm scatterer}
$$

The second term, summed over many weak scatterers, grows linearly with length
and reproduces Ohm's law with the Drude resistivity: **lesson 1 is the
long-wire limit of this lesson.** Coherent addition instead multiplies
amplitudes and produces interference: universal conductance fluctuations and
weak localisation, the graduate topics module 25 leans on when disorder wins.

## 4. Two dimensions in a magnetic field: the quantum Hall effect

### 4.1 Landau quantization

A perpendicular field bends in-plane motion into cyclotron orbits; quantum
mechanically the continuum collapses onto **Landau levels**,

$$
E_n=\hbar\omega_c\left(n+\tfrac{1}{2}\right),
\qquad
\omega_c=\frac{eB}{m^{*}}
$$

each level holding one state per flux quantum threading the sample:

$$
n_L=\frac{eB}{h}\approx2.4\times10^{10}\ {\rm cm^{-2}}\ \text{per tesla}
$$

The **filling factor** $\nu=n_s/n_L=n_sh/eB$ counts occupied levels.

![The level energies fan out linearly in field while the Fermi energy holds still: every crossing empties a level, and the transport coefficients oscillate with the periodicity in inverse field that the crossings define.](/courses/electronic-devices/figures/m18-landau-fan.svg)

### 4.2 Oscillations as a measuring instrument

Each crossing in the fan modulates the resistivity (Shubnikov-de Haas
oscillations), periodic in $1/B$ with

$$
\Delta\!\left(\frac{1}{B}\right)=\frac{2e}{h\,n_s}
$$

so an oscillation trace hands over the sheet density with no geometry, no
thickness, and no Hall factor: the standard density measurement in every
heterostructure lab, and the damping of the oscillations yields the quantum
lifetime $\tau_q$ of lesson 1's section 8.4. One cryostat sweep, three
transport parameters.

### 4.3 Plateaux: why the quantization is exact

At integer $\nu$ the Fermi level sits in a gap: the interior is inert, and
conduction proceeds along **edge channels** where the levels bend up at the
boundary. Edge states are chiral: each edge carries one direction only, so
backscattering requires crossing the sample and is exponentially suppressed.
Landauer accounting with $\nu$ perfect edge modes gives

$$
\boxed{\;R_{xy}=\frac{h}{\nu e^{2}},
\qquad
\frac{h}{e^{2}}=25\,812.807\ \Omega\;}
$$

while $\rho_{xx}\to0$.

![The Hall resistance locks onto plateaux while the longitudinal resistance collapses to zero at the same fields; the two quantities share an axis only in field, so they are stacked rather than superposed.](/courses/electronic-devices/figures/m18-quantum-hall.svg)

Disorder, everywhere else the enemy, is what gives the plateaux their
**width**: localized states between Landau levels absorb carriers as $B$
varies without joining transport, holding $\nu_{\rm eff}$ pinned across a
field range. A cleaner sample shows *narrower* plateaux: the one context in
this module where dirt improves the measurement.

### Worked example 4.1 — locating and using a plateau

For $n_s=3\times10^{11}\ {\rm cm^{-2}}$: the $\nu=2$ plateau requires

$$
B=\frac{n_sh}{2e}
=\frac{3\times10^{15}\times6.626\times10^{-34}}{2\times1.602\times10^{-19}}
=6.2\ {\rm T},
\qquad
R_{xy}=\frac{25\,812.807}{2}=12\,906.4\ \Omega
$$

Resolving it needs $\hbar\omega_c\gg k_BT$: at 6.2 T,
$\hbar\omega_c=1.73\ {\rm meV/T}\times6.2=10.7$ meV against
$k_BT=0.36$ meV at 4.2 K: comfortable. The same arithmetic run backwards is
how any Hall bar in any lab is turned into a resistance standard: pick $B$
for a convenient integer, sit on the plateau, and the resistance is a ratio
of fundamental constants to parts in $10^{9}$.

### 4.4 Graduate: metrology

Plateau values reproduce across samples, materials and laboratories at the
$10^{-9}$ level, which made the quantum Hall resistance the practical
realisation of the ohm; since the 2019 SI fixed $e$ and $h$ by definition,
$R_K=h/e^{2}$ is exact, and resistance calibration chains terminate on a
Hall bar. Graphene's anomalously large Landau gaps (module 49) let the
standard run at 5 T and 4 K instead of 15 T and 0.3 K: a materials
substitution translating directly into cheaper primary metrology.

### 4.5 Graduate: why the effect survives imperfection

The deeper reason the quantization is exact: $\nu$ is a **topological
invariant** of the filled bands: an integer that cannot change under any
continuous deformation of the Hamiltonian, disorder and interactions
included, as long as the gap stays open. Exactness by topology rather than by
precision engineering is a design principle with a future: the topological
insulators and edge-mode devices that grew from this observation are the
module's furthest downstream descendants.

### 4.6 Graduate: the fractional effect

In the cleanest 2DEGs at high field, plateaux appear at
$\nu=1/3,\,2/5,\,\dots$ where non-interacting electrons have no gap at all.
Electron-electron interaction opens one: the ground state is a correlated
liquid whose elementary excitations carry **fractional charge** $e/3$
(confirmed by shot-noise measurements) and obey anyonic statistics. Nothing
in the single-particle framework of this module predicts it: the fractional
effect marks the honest boundary of lesson-level transport theory, and the
frontier where module 51's correlated-electron physics takes over.

## 5. What module 18 hands to the rest of the course

The factorization $\sigma=ne\mu$ and the discipline of asking which factor
moved. The additivity of scattering rates and the primacy of the worst
mechanism. The $(1-\cos\theta)$ distinction between colliding and resisting.
The regime map: diffusive, quasi-ballistic, ballistic, localised, with the
governing equation changing at each border. And the habit of treating
measurement artefacts (Hall factors, two-carrier nulls, size effects, plateau
widths) as physics to be used rather than noise to be apologised for.

## 6. Problems

**P18.37** A 2DEG has $n_s=5\times10^{11}\ {\rm cm^{-2}}$ (GaAs). Find
$E_F$, $k_F$, $\lambda_F$, and the $\nu=4$ field.

**P18.38** How many transverse modes does a 350 nm wide channel carry at
$n_s=3\times10^{11}\ {\rm cm^{-2}}$, and what is its ballistic resistance?

**P18.39** A QPC's subband spacing is 2.5 meV. Estimate the temperature at
which the plateaux wash out, and the source-drain bias that does the same at
base temperature.

**P18.40** Shubnikov-de Haas oscillations show minima at 2.10 T and 2.43 T
(adjacent). Find $n_s$.

**P18.41** A HEMT with a 25 nm barrier ($\varepsilon_r=12.9$) is driven 0.4 V
above threshold. Find $n_s$, and $E_F$ of the resulting gas.

**P18.42** The thermal conductance quantum is
$\pi^{2}k_B^{2}T/3h$ per mode. Evaluate it at 1 K, and find the electrical
Lorenz ratio it implies for one ballistic mode: compare with the
Wiedemann-Franz value of module 35.

**P18.43** Show that the 2D density of states gives
$E_F=\pi\hbar^{2}n_s/m^{*}$, and find the density at which $E_F$ reaches the
18 meV subband spacing of worked example 2.1: the two-subband threshold.

**P18.44** A graphene quantum Hall standard runs at $\nu=2$, $B=5$ T. What
sheet density was chosen, and what $R_{xy}$ does it hold?

**P18.45** *(graduate)* Two point contacts of 3 and 5 modes sit in series,
incoherently. Find the two-terminal resistance, and explain why it is not
$R_3+R_5$.

**P18.46** *(graduate)* From $\Delta(1/B)=2e/hn_s$, show that the $\nu$ values
of successive $\rho_{xx}$ minima differ by 2 in a spin-degenerate system, and
predict how the pattern changes when Zeeman splitting resolves.

**P18.47** *(graduate)* A 2DEG shows $\tau_q=0.5$ ps and
$\tau_{\rm tr}=25$ ps. In a naive picture where every scattering event were
isotropic, what mobility would the sample show, and what does the actual
ratio imply about the dominant disorder?

**P18.48** *(graduate)* Estimate the edge-state velocity in a quantum Hall
sample from $v=\mathcal{E}_{\rm edge}/B$ with a confining field of
$10^{6}$ V/m at 6 T, and the time an edge carrier takes to circulate a 1 mm
square sample: the scale on which equilibration between edges must be
avoided.

### Answers

**P18.37** $E_F=\pi\hbar^{2}n_s/m^{*}$ with $n_s=5\times10^{15}\ {\rm m^{-2}}$:
$17.8$ meV. $k_F=\sqrt{2\pi n_s}=1.77\times10^{8}\ {\rm m^{-1}}$;
$\lambda_F=2\pi/k_F=35$ nm. $\nu=4$:
$B=n_sh/4e=5.2$ T.

**P18.38** $N=\lfloor k_FW/\pi\rfloor$ with
$k_F=1.37\times10^{8}$: $N=\lfloor1.37\times10^{8}\times3.5\times10^{-7}/\pi\rfloor
=\lfloor15.3\rfloor=15$ modes; $R=12.906/15=860\ \Omega$.

**P18.39** Wash-out when $k_BT\approx\Delta/4$ (thermal smearing of the step
edges): $T\approx2.5/(4\times0.0862)\approx7$ K. Bias: steps smear when
$eV_{sd}\approx\Delta$, so about 2.5 mV: quantised-conductance experiments run
microvolt excitations for exactly this reason.

**P18.40** $\Delta(1/B)=1/2.10-1/2.43=0.0647\ {\rm T^{-1}}$;
$n_s=2e/(h\Delta(1/B))
=2\times1.602\times10^{-19}/(6.626\times10^{-34}\times0.0647)
=7.5\times10^{15}\ {\rm m^{-2}}=7.5\times10^{11}\ {\rm cm^{-2}}$.

**P18.41** $n_s=\varepsilon(V_G-V_T)/ed
=12.9\times8.854\times10^{-12}\times0.4/(1.602\times10^{-19}\times25\times10^{-9})
=1.14\times10^{16}\ {\rm m^{-2}}=1.14\times10^{12}\ {\rm cm^{-2}}$;
$E_F=\pi\hbar^{2}n_s/m^{*}=40.8$ meV: past the second-subband threshold of
P18.43, so the real device populates two subbands at this drive, with the
mobility consequences flagged in worked example 2.1.

**P18.42** $g_{\rm th}=\pi^{2}k_B^{2}T/3h
=\pi^{2}(1.381\times10^{-23})^{2}\times1/(3\times6.626\times10^{-34})
=9.5\times10^{-13}\ {\rm W/K}$ at 1 K. Ratio to $G_0T$:
$g_{\rm th}/(G_0T)=\pi^{2}k_B^{2}/3e^{2}\times(h/2h)\dots$ cleanly:
$g_{\rm th}/T\div G_0=(\pi^{2}k_B^{2}/3h)/(2e^{2}/h)
=\pi^{2}k_B^{2}/6e^{2}$: half the Lorenz number, because the electrical
quantum counts two spins while the standard Wiedemann-Franz ratio is per
conducting channel. Ballistic transport obeys Wiedemann-Franz mode by mode:
the law is deeper than the diffusive derivation module 35 gives for it.

**P18.43** Fill the constant DOS: $n_s=g_{2D}E_F=m^{*}E_F/\pi\hbar^{2}$,
invert for $E_F$. Setting $E_F=18$ meV:
$n_s=m^{*}E_F/\pi\hbar^{2}
=0.067\times9.109\times10^{-31}\times2.88\times10^{-21}
/(\pi\times(1.055\times10^{-34})^{2})=5.0\times10^{15}\ {\rm m^{-2}}
=5.0\times10^{11}\ {\rm cm^{-2}}$: the two-subband threshold quoted in the
worked example, now derived.

**P18.44** $n_s=\nu eB/h=2\times1.602\times10^{-19}\times5/6.626\times10^{-34}
=2.4\times10^{15}\ {\rm m^{-2}}=2.4\times10^{11}\ {\rm cm^{-2}}$, set by
gating; $R_{xy}=12\,906.4\ \Omega$, exactly as in GaAs: the plateau value
knows no material, which is the entire point of standards built on it.

**P18.45** Incoherent series addition applies to the *scatterer* parts only.
Contact resistance $h/2e^{2}$ divided by the mode count appears once per
constriction as its total two-terminal resistance:
$R=12.906(1/3+1/5)-$ correction... cleanest through transmission: total
transmission for series incoherent obstacles
$T=T_1T_2/(T_1+T_2-T_1T_2)$ per mode is overkill here; with ideal contacts
between them acting as a reservoir, resistances simply add:
$R=12.906(1/3+1/5)=6.88\ {\rm k\Omega}$. If instead the region between is
phase-coherent and reservoir-free, the answer depends on interference and can
sit anywhere between $12.906/5$ and much larger: the question "do resistances
add?" *is* the question "is there a thermalising reservoir between them?",
which is the conceptual heart of Landauer transport.

**P18.46** Minima occur when $E_F$ sits between levels: $\nu$ even in a
spin-degenerate system, so successive minima step $\nu$ by 2, matching the
factor 2 in $\Delta(1/B)=2e/hn_s$. Once Zeeman splitting exceeds the level
broadening, odd plateaux appear and the $1/B$ period halves: watching the odd
integers emerge with rising field is a direct readout of the spin gap
overtaking disorder broadening.

**P18.47** If all scattering were isotropic, $\tau_{\rm tr}$ would equal
$\tau_q=0.5$ ps, giving
$\mu=e\tau/m^{*}=1.602\times10^{-19}\times5\times10^{-13}
/(6.10\times10^{-32})=1.3\ {\rm m^{2}/Vs}=1.3\times10^{4}\ {\rm cm^{2}/Vs}$.
The actual $\tau_{\rm tr}$ is 50 times longer:
$\mu=6.6\times10^{5}\ {\rm cm^{2}/Vs}$, and the ratio of 50 identifies the
disorder as overwhelmingly small-angle, meaning remote: background impurities
in the channel would drag the ratio toward one. Two lifetimes, one
diagnosis: which cleanliness problem to attack next in growth.

**P18.48** $v=\mathcal{E}/B=10^{6}/6=1.7\times10^{5}$ m/s. Perimeter 4 mm:
circulation time $t=4\times10^{-3}/1.7\times10^{5}=24$ ns. Edge equilibration
experiments and quantum Hall interferometry live on keeping phase and
population coherent over fractions of this loop, and the number explains
why such devices are millimetres, not metres.
