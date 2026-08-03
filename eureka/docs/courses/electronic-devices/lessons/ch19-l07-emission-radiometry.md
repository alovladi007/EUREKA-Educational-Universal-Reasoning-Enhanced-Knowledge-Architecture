# Emission and Radiometry: the Other Direction of Every Arrow

<!-- covers: 19.3, 19.4 -->

Lessons 1 to 4 pointed light *at* materials. This lesson reverses the
arrows: thermal emission, luminescence quantified, and the bookkeeping
(radiometric and photometric) that turns spectra into specifications. The
governing principle is reciprocity: **a material emits exactly where and as
it absorbs**, and every section is that sentence with units attached.

**Level.** Sections 1 to 4 undergraduate; section 5 graduate; section 6
problems.

## 1. Thermal emission: Kirchhoff's bargain

A body at temperature $T$ emits, per unit area and wavelength, the Planck
spectral radiance times its emissivity:

$$
M(\lambda,T)=\varepsilon(\lambda)\,
\frac{2\pi hc^{2}}{\lambda^{5}}
\frac{1}{e^{hc/\lambda k_BT}-1}
$$

and Kirchhoff's law pins the emissivity to lesson 1's constants:

$$
\boxed{\;\varepsilon(\lambda)=A(\lambda)=1-R(\lambda)-T_r(\lambda)\;}
$$

Absorptivity equals emissivity, wavelength by wavelength, angle by angle:
detailed balance again (module 17's lesson 6 met it as van
Roosbroeck-Shockley; here is its thermal face). The integrated forms
complete the toolkit:

$$
M_{\rm tot}=\varepsilon\,\sigma T^{4},
\qquad
\lambda_{\rm peak}T=2898\ {\rm \mu m\,K}
$$

### Worked example 1.1 — why pyrometers argue with wafers

A pyrometer reads a silicon wafer at 700 C through lesson 5's viewport,
assuming $\varepsilon=0.7$. But silicon's emissivity at the pyrometer band
swings with temperature (band edge shifting across the band: lesson 3's
Varshni), with doping (free carriers: lesson 3), and with backside films
(interference: lesson 6). A true 0.55 emissivity read as 0.7 underreports
radiance-equivalent temperature: the error, linearised through Wien,

$$
\Delta T\approx\frac{\lambda T^{2}}{c_2}\ln\frac{\varepsilon_{\rm ass}}
{\varepsilon_{\rm true}}
=\frac{1.5\times10^{-6}\times(973)^{2}}{1.44\times10^{-2}}\times\ln1.27
\approx24\ {\rm K}
$$

Twenty-four degrees of process error from an emissivity guess: why rapid
thermal processors carry emissivity-compensating ripple pyrometry, and why
module 22's activation anneals (exponential in $T$) cannot tolerate naive
radiometry. Kirchhoff's law is the *fix* too: measure reflectance in situ,
infer emissivity, correct: the law used as an instrument.

## 2. Luminescence, quantified

### 2.1 The emission spectrum's shape

A semiconductor's spontaneous emission follows the product of the joint
density of states and the carrier occupations: for a non-degenerate
population,

$$
I(E)\ \propto\ \alpha(E)\,E^{2}\,e^{-E/k_BT}
$$

: absorption rising past the gap times the Boltzmann tail falling: a peak
just above $E_g$ with a high-energy slope of exactly $k_BT$. Two working
consequences: the **slope thermometry** of lesson 4's PL (fit the high side,
read the carrier temperature: hot-carrier populations from module 18 show
up as stretched slopes), and the **redshift-with-heating** of every LED
spectrum (gap shrinking plus tail broadening).

### 2.2 The rates, from first principles to datasheet

Radiative recombination in a semiconductor:

$$
R_{\rm rad}=B\,np,
\qquad
\tau_r=\frac{1}{B\,n_0}\ \text{(doped, low injection)}
$$

with $B\sim10^{-10}\ {\rm cm^{3}/s}$ for direct gaps and
$\sim10^{-14}$ for silicon: the four decades module 17's clock race quoted,
now attached to the constant that lesson 3's absorption fixes through
detailed balance. Auger recombination adds the high-density ceiling,

$$
R_{\rm Auger}=C\,n^{3}\ \text{(or }n^{2}p\text{)},
$$

and the full efficiency-versus-drive curve of any emitter is the ABC
bookkeeping:

$$
\eta(n)=\frac{Bn^{2}}{An+Bn^{2}+Cn^{3}}
$$

: rising as radiative beats Shockley-Read-Hall ($An$), falling as Auger
($Cn^{3}$) takes over: **droop**, the LED industry's central curve, is this
one-line rational function.

### Worked example 2.1 — locating peak efficiency

With $A=10^{7}\ {\rm s^{-1}}$, $B=10^{-10}\ {\rm cm^{3}s^{-1}}$,
$C=10^{-30}\ {\rm cm^{6}s^{-1}}$: maximise $\eta$: $d\eta/dn=0$ gives
$An=Cn^{3}$:

$$
n^{*}=\sqrt{A/C}=\sqrt{10^{37}}=3.2\times10^{18}\ {\rm cm^{-3}}
$$

$$
\eta^{*}=\frac{Bn^{*}}{A/n^{*}+Bn^{*}+Cn^{*2}}\cdot n^{*}\ \Rightarrow\
\eta^{*}=\frac{Bn^{*}}{2\sqrt{AC}+Bn^{*}}=\frac{0.32}{0.32+0.0063...}
$$

: computing cleanly: $Bn^{*}=3.2\times10^{8}$, $2\sqrt{AC}=2\times
\sqrt{10^{-23}}=6.3\times10^{-12}$... rates per carrier:
$A=10^{7}$, $Bn^{*}=3.2\times10^{8}$, $Cn^{*2}=10^{7}$:
$\eta^{*}=3.2\times10^{8}/(10^{7}+3.2\times10^{8}+10^{7})=0.94$.
Peak efficiency 94 percent at $3\times10^{18}$: below it SRH wins (defect
quality: the $A$ knob, module 32's dislocation story), above it Auger
(the $C$ wall, module 39's spin-orbit attack). One rational function
organises two research fields.

## 3. Radiometry to photometry: the two bookkeepings

Radiometric quantities (watts) become photometric ones (lumens) through
the eye's weighting: lesson-headline numbers from module 17's lesson 6,
here given their formal frame:

| radiometric | unit | photometric | unit |
|---|---|---|---|
| radiant flux | W | luminous flux | lm |
| radiant intensity | W/sr | luminous intensity | cd |
| irradiance | W/m2 | illuminance | lx |
| radiance | W/m2 sr | luminance | cd/m2 |

Two invariants do the engineering work:

- **Radiance conservation (etendue).** Along any lossless optical system,
  radiance cannot increase, and the throughput $A\Omega$ (area times solid
  angle) is conserved:

$$
n^{2}A\,\Omega=\text{const}
$$

  No lens brightens a source: it only trades area against angle: the law
  that vetoes half of proposed illumination optics and sizes every
  fibre-coupling problem.

### Worked example 3.1 — the etendue veto

Couple a 1 mm2 LED emitting into a hemisphere ($\Omega=2\pi$) into a fibre
of 100 µm2 core and 0.2 sr acceptance. Source etendue:
$1\times2\pi=6.3\ {\rm mm^{2}sr}$; fibre: $10^{-4}\times0.2=2\times10^{-5}$:
ratio $3\times10^{5}$: at best **three parts in a million** of the light
couples, whatever optics intervene. The one-line calculation that separates
LEDs (big, wide: illumination) from lasers (small, narrow: fibres) as
source classes: and the reason module 17's transceiver used a laser
without discussion.

- **The luminous efficacy ceiling.** Weighting by $V(\lambda)$ caps any
  white spectrum near 300 to 350 lm/W (module 17's Haitz ceiling), and a
  monochromatic 555 nm source at exactly 683: photometry's constants are
  anthropology, not physics, and the design consequence is that spectrum
  shaping, not just efficiency, sets a lamp's headline number.

## 4. Emission as metrology: three instruments revisited

Reciprocity converts lesson 4's toolkit into emission modes:
**electroluminescence imaging** of solar modules (drive the cell as an LED;
dark regions map series resistance and cracks: the production-line X-ray of
photovoltaics); **photoluminescence imaging** at wafer scale (lifetime maps
from emission intensity: module 23's contactless lifetime, parallelised);
and **thermography** through Kirchhoff (hot spots radiate their own
diagnosis: module 54's package debugging). In each, the *same* material
physics measured in absorption serves in emission, with the sensitivity
advantages of counting photons against a dark background.

### Worked example 4.1 — reading an EL image

A module's EL image shows one cell at 60 percent of its neighbours'
intensity. EL intensity scales as $e^{qV_j/k_BT}$ with the cell's junction
voltage: a 40 percent deficit reads as

$$
\Delta V_j=\frac{k_BT}{q}\ln(0.6)=-13\ {\rm mV}
$$

: thirteen millivolts of extra series-resistance drop at the test current:
about half a broken gridline's worth: quantitative triage from a
camera photo, powered entirely by the exponential this course has used
since module 17. The audit habit: EL darkness means *voltage*, not
directly "damage": a shunt and a series fault darken differently
(uniform vs localised), and the image's pattern, not its level, names the
mechanism.

## 4b. Emissivity engineering: Kirchhoff used as a design tool

Because emissivity equals absorptivity wavelength by wavelength, shaping a
surface's absorption spectrum *is* shaping its thermal radiation: and three
product categories are nothing but that sentence executed.

**Low-emissivity glazing.** Architectural glass carries a transparent
conductor whose plasma edge (lesson 3) sits just beyond the visible: the
coating transmits daylight but, being metallic across the thermal infrared
(10 µm at room temperature by Wien), reflects it: emissivity drops from
glass's 0.84 to below 0.1, cutting radiative heat exchange through the
window several-fold. The same film measured in lesson 3 as a conductor is
sold by the square kilometre as an *emissivity* product: one spectrum, two
industries, and module 56's material doing quiet double duty.

**Selective solar absorbers.** A solar-thermal collector wants total
absorption across the solar spectrum (0.3 to 2.5 µm) and near-zero
emission at its own 400 K operating band (7 to 10 µm): a step-function
absorptivity, engineered with cermet gradients or multilayer stacks
(lesson 6's machinery aimed at the infrared). Figures of merit
$\alpha_{\rm sol}/\varepsilon_{\rm th}$ above 10 are commercial: the
surface harvests sunlight while refusing to glow it back.

**Daytime radiative cooling.** Invert the trick: emit strongly *inside*
the 8 to 13 µm atmospheric window (where the sky is transparent to space's
3 K) while reflecting the solar band: a surface engineered this way sits
several degrees below ambient in full sun, pumping heat to the cosmos.
Polymer-photonic and particle-filled films reached product form in the
2020s: passive cooling from spectrum shaping alone, and the design brief
is literally a target $\varepsilon(\lambda)$ curve handed to lesson 6's
matrix method.

### Worked example 4b.1 — the low-E payoff, computed

A single-pane window at 15 C faces a room at 20 C. Radiative exchange per
square metre scales with emissivity: with $\varepsilon=0.84$:
$q=0.84\times\sigma\times(293^{4}-288^{4})=0.84\times5.67\times10^{-8}
\times(7.37-6.87)\times10^{9}\ /10\ldots$ computing:
$293^{4}=7.37\times10^{9}$, $288^{4}=6.87\times10^{9}$: difference
$5.0\times10^{8}$: $q=0.84\times5.67\times10^{-8}\times5.0\times10^{8}
=23.8\ {\rm W/m^{2}}$. At $\varepsilon=0.08$: 2.3 W/m2: **21 W/m2 saved
per pane**, every hour the temperatures differ: across a glass facade,
kilowatts, from a hundred-nanometre film specified by its plasma
wavelength. Radiometry's bookkeeping, cashed as an energy bill.

## 5. Graduate extension: detailed balance as the master constraint

The van Roosbroeck-Shockley integral ties the $B$ coefficient to the
absorption spectrum:

$$
B\,n_i^{2}=\int_0^{\infty}\alpha(E)\,
\frac{8\pi E^{2}}{h^{3}c^{2}}\,e^{-E/k_BT}\,dE
$$

: compute the right side from lesson 3's edge and the radiative clock of
module 17 follows with no emission measurement at all. The same logic
bounds detectors (a detector's dark current cannot undercut the thermal
radiation its absorptivity forces it to exchange: the background-limited
floor of module 31's infrared systems) and, run at full strength on a
solar absorber, yields the detailed-balance efficiency limit: deferred
with the photovoltaic scope, but its machinery is now entirely in hand.

The examiner's use: any datasheet claiming an absorptivity spectrum and an
emission (or dark-current) performance inconsistent with this integral is
wrong by causality's bookkeeping: the third audit theorem of the module,
joining Kramers-Kronig and the f-sum rule.

## 6. Problems

**P19.31** A blackbody at 1200 K: peak wavelength, total emitted power per
cm2, and the fraction (qualitatively) a silicon detector sees.

**P19.32** An anodised (high-emissivity) and a bare-aluminium (low)
heatsink run at the same temperature with the same convection. Compare
their radiative contributions at 80 C using $\varepsilon=0.85$ vs 0.05, and
draw module 54's conclusion.

**P19.33** An LED's high-energy PL slope reads 34 meV. Carrier temperature?
What drive-side change would flatten it toward the lattice's 26 meV?

**P19.34** With the ABC constants of worked example 2.1, find the current
density corresponding to $n^{*}$ in a 3 nm quantum well
($J=qd\,(An+Bn^{2}+Cn^{3})$), and comment against real LED operating
points.

**P19.35** A laser diode couples 80 percent into a fibre while an LED of
equal lumens couples $10^{-5}$. Using etendue language, attribute the gap.

**P19.36** *(graduate)* From $I(E)\propto\alpha(E)E^{2}e^{-E/k_BT}$, show
the emission peak of a direct-gap semiconductor sits at
$E_g+\tfrac{1}{2}k_BT$ and the FWHM is about $1.8\,k_BT$: the two numbers
every PL fitter hard-codes.

### Answers

**P19.31** $\lambda_{\rm peak}=2898/1200=2.4\ {\rm \mu m}$;
$M=\sigma T^{4}=5.67\times10^{-8}\times2.07\times10^{12}=1.18\times10^{5}
\ {\rm W/m^{2}}=11.8\ {\rm W/cm^{2}}$. Silicon (edge 1.1 µm) sees only the
Planck tail below 1.1 µm: a few percent of the total: why silicon cameras
image 1200 K objects dimly while module 31's detectors own the peak: the
window figure and Wien's law jointly assigning the market.

**P19.32** Radiative flux scales with $\varepsilon$: at 80 C
($T=353$, surroundings 300 K):
$q_{\rm rad}=\varepsilon\sigma(T^{4}-T_0^{4})
=\varepsilon\times5.67\times10^{-8}\times(1.55-0.81)\times10^{10}
=\varepsilon\times420\ {\rm W/m^{2}}$: 357 vs 21 W/m2. Anodising buys a
free convection-sized second channel; bare aluminium radiates almost
nothing: why black heatsinks are not cosmetic (module 54), and why
"shiny = hot" in thermography needs Kirchhoff literacy to un-trick.

**P19.33** Slope $=k_BT_e$: $T_e=34/0.0862=394$ K against the 300 K
lattice: carriers 94 K hot: module 18's energy balance visible in a
spectrum. Flatten by lowering injection (less kinetic energy dumped per
carrier) or improving heat-sinking; a slope that *stays* hot at low drive
flags poor thermal design rather than hot-carrier physics: the two causes
separate by their drive dependence.

**P19.34** Rates at $n^{*}=3.2\times10^{18}$: $An=3.2\times10^{25}$,
$Bn^{2}=1.02\times10^{27}$, $Cn^{3}=3.3\times10^{25}$ (cm$^{-3}$s$^{-1}$):
sum $1.09\times10^{27}$. $J=qd\times$sum$=1.6\times10^{-19}\times3\times
10^{-7}\ {\rm cm}\times1.09\times10^{27}=52\ {\rm A/cm^{2}}$. Real
high-power LEDs run 10 to 100 A/cm2: the efficiency peak sits squarely in
the operating window, and pushing brightness beyond it is precisely the
droop regime: the ABC curve is the datasheet's skeleton.

**P19.35** The laser's diffraction-limited etendue ($\sim\lambda^{2}$)
fits inside any single-mode fibre's; the LED's mm2-times-hemisphere
etendue exceeds it by five to six decades, and conservation forbids
compression: the gap is not engineering shortfall but invariant
bookkeeping: sources are classified by etendue before wavelength, price
or efficiency: the lesson's veto, restated as a classification.

**P19.36** Near the edge $\alpha\propto\sqrt{E-E_g}$:
$I\propto\sqrt{x}\,e^{-x/k_BT}$ with $x=E-E_g$ (the $E^{2}$ prefactor
varies negligibly across $k_BT$). Maximise: $d/dx[\tfrac{1}{2}\ln x-x/k_BT]
=0$: $x=k_BT/2$: peak at $E_g+\tfrac{1}{2}k_BT$. FWHM: solve
$\sqrt{x}e^{-x/k_BT}=\tfrac{1}{2}\max$ numerically: roots near
$0.05\,k_BT$ and $1.85\,k_BT$: width $\approx1.8\,k_BT$ (about 46 meV at
room temperature): the reason every room-temperature edge PL is
"about 2kT wide", now a theorem instead of folklore.
