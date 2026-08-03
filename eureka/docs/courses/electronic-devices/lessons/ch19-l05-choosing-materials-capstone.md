# Choosing Optical Materials, Capstone Cases, and the Module Exam

<!-- covers: 19.5 -->

Selection closes the module: the properties of lessons 1 to 3, priced
against an application, measured by lesson 4. As everywhere in this course,
the binding constraint is usually not the headline property.

**Level.** Sections 1 and 2 undergraduate; the cases integrate everything;
the exam closes.

## 1. The selection axes

**The window first.** Lesson 3's two walls: electronic edge left,
multiphonon right: define where a material can serve at all. The window
figure is the shortlist generator: silica-class for 0.2 to 3 µm; oxide and
fluoride crystals stretching each end; ZnSe, chalcogenides and the salts
for the thermal infrared; silicon and germanium as infrared windows
*because* their electronic edges sit in the near-IR (lesson 1's germanium
problem taught the $k$-at-thickness caveat).

**Then the index pair.** $n$ for power (confinement, reflection,
extraction: module 17's cone) and $V_d$-style dispersion for imaging
(lesson 2's map).

**Then the loss floor at the application's scale.** A window tolerates
$10^{-1}\ {\rm cm^{-1}}$; a fibre demanded $10^{-6}$ (0.2 dB/km), reached
only when purification removed transition metals and hydroxyl to
parts-per-billion, leaving Rayleigh scattering from frozen density
fluctuations:

$$
\alpha_{\rm Rayleigh}\propto\frac{1}{\lambda^{4}}
$$

as the intrinsic floor: the reason the telecom bands sit at the long-
wavelength end of silica's window, just short of the multiphonon wall.
**Knowing whether a loss is intrinsic or preparational is the selection
skill**: one motivates purification, the other a different material.

**Then everything non-optical.** $dn/dT$ (lesson 2's millikelvin problem),
expansion match to the mount (module 35), hardness and chemistry for the
exposed surface, and cost per finished square centimetre: the figure
modules 45 and 54 taught to respect. Selection tables that stop at optical
columns select prototypes, not products.

## 2. The recurring role reversal

In electronic materials, optical properties are usually the *measurement
channel* rather than the function: the passivation layer must be
transparent at the inspection wavelength; the gate stack's constants exist
so ellipsometry can watch its thickness; the substrate's free-carrier
absorption (lesson 3's problem P19.16) decides whether backside inspection
works at all. Reading a process spec, ask of every optical number whether
it serves the device or the metrology: the answer reorganises priorities,
and it is why this module sits before the growth-and-characterization arc
rather than with the deferred photonics.

### Worked example 2.1 — a window that is really a budget

An in-situ pyrometer must read a 700 C wafer through a viewport that also
passes a 10.6 µm heating laser. Selection: the viewport needs transmission
at both 1 to 2 µm (pyrometry band) and 10.6 µm: silica's multiphonon wall
kills it at 10.6; ZnSe passes both (window figure); but ZnSe's $n=2.4$
reflects 17 percent per face (lesson 1): the laser budget loses a third
through two faces unless AR-coated for 10.6, and the coating must survive
deposition coatings and cleaning. The "window material" line item became an
interlocked optical-thermal-chemical budget: which is the section's thesis
demonstrated in one fixture.

### Worked example 2.2 — intrinsic or preparational?

A crystal supplier's new lot shows $\alpha=0.02\ {\rm cm^{-1}}$ at the
design wavelength against a datasheet $0.005$. Rayleigh floor for this
material at this wavelength computes to $0.003$: the excess 0.017 is
extrinsic: and its spectrum (lesson 4's PDS) shows a broad band matching a
known impurity rather than the featureless $\lambda^{-4}$: reject the lot,
cite the band. Ten minutes of module-19 reasoning converts "it seems
lossy" into a supplier corrective action with a mechanism attached.

## 2b. Specifying optical purchases: the columns that bind

Because selection ends in a purchase order, the module owes a template.
An optical component specification that survives contact with a supplier
carries, at minimum:

**The optical columns, each with conditions.** Transmission or reflectance
*with wavelength band, angle range and polarization stated* (lesson 6's
oblique-incidence splitting makes an angle-free spec unenforceable);
surface figure and roughness separately (figure bends wavefronts,
roughness scatters: lesson 6's scatter budget, and the two are measured
by different instruments); and for anything coated, the coating's own
spectral curve rather than the adjective "AR-coated", plus its angle
shift.

**The environmental columns.** Operating temperature range with the
allowed drift (the capstone case below is what omitting it costs);
humidity and cleaning chemistry (soft IR materials and some fluorides
degrade under standard solvent wipes: a chemical column deciding an
optical purchase); and laser damage threshold where power flows, quoted
at the actual pulse format, since thresholds scale differently for
continuous and pulsed exposure.

**The audit columns.** Which standard test method each number comes from,
on what instrument class, at what sampling ("one witness piece per coating
run" versus "each part"): lesson 4 taught that the extraction is part of
the value; a specification that names the method is the only kind a
dispute can be settled under. And an explicit acceptance criterion tied to
the application's own floor: the sensitivity ladder says a
$10^{-4}$-absorption claim cannot be verified by a transmission
measurement, so specifying one obliges the supplier to photothermal or
cavity methods: and pricing follows.

The template's deeper point repeats the module's: **an optical number
without its conditions is not yet a quantity.** Procurement is where that
philosophy either becomes contract language or becomes a warranty claim
eighteen months later, and the half page above is the cheap version.

### Worked example 2b.1 — two lines that would have prevented a recall

A camera module's IR-cut filter was specified as "T > 90 percent,
400-650 nm; T < 5 percent, 700-1100 nm" and passed incoming inspection at
normal incidence. In the f/1.8 camera, marginal rays arrive at up to 25
degrees, where the dielectric edge (lesson 6's angle shift,
$\Delta\lambda/\lambda\approx-\sin^{2}\theta/2n_{\rm eff}^{2}$) walks
about 12 nm blue: the cut edge moved into the deep red, and production
units showed magenta corners under incandescent light. The two missing
lines: "specified over 0 to 25 degrees" and "edge shift < 5 nm over the
cone": would have moved the failure from the field to the supplier's
design desk, at the cost of a slightly thicker stack. Angle is a
specification column, not a detail: the lesson every imaging program
learns exactly once.

## 3. Capstone case: the AR stack that failed qualification

**Symptom.** A silicon sensor's multilayer antireflection coating passes
optical spec at 25 C but its reflectance minimum sits 12 nm too blue at
85 C, failing the hot test.

**Diagnosis with the module.** A quarter-wave stack's condition scales with
optical thickness $n(T)\,d(T)$: the shift combines $dn/dT$ and expansion:

$$
\frac{\Delta\lambda}{\lambda}=\left(\frac{1}{n}\frac{dn}{dT}
+\alpha_{\rm exp}\right)\Delta T
$$

A 12 nm shift at 550 nm over 60 K needs an effective coefficient of
$3.6\times10^{-4}\ {\rm K^{-1}}$: an order beyond the oxide constituents'
known values: so the *materials* are not the culprit: the fit is. Lesson
4's audit: the room-temperature ellipsometric model had traded thickness
against index (the correlated-fit trap) and assigned wrong layer
thicknesses that happened to null at 25 C. Refit with an independent XRR
thickness, redeposit to corrected targets: passes at both temperatures.

**The module's moral.** The failure looked thermo-optic (lesson 2), was
diagnosed by a coefficient bound (data-book discipline), and traced to a
regression artefact (lesson 4): three lessons in one root cause, and no
new deposition chemistry involved.

## 4. Comprehensive exam

Constants: Module C; silica Sellmeier from lesson 2. (G) marks graduate
tier.

**X19.1** A material has $n=2.2$, $k=0.4$ at 500 nm. Compute $R$, $\alpha$,
and the thickness transmitting 1 percent (ignore multiple reflections).

**X19.2** Design the quarter-wave AR for lesson-worked silicon at 550 nm
with an available $n_c=1.9$ film; give residual reflectance and the
thickness tolerance for $R\le1$ percent.

**X19.3** From the silica fit, compute $n_g$ at 1.55 µm by numerical
derivative ($\pm10$ nm) and the group delay of 50 km of fibre.

**X19.4** A direct-gap film shows Tauc-intercept 2.42 eV cold (10 K) and
2.36 eV at 300 K. Which lesson-3 mechanisms could move it, and which is
operative here?

**X19.5** An ellipsometer fits an unknown film as $d=61$ nm, $n=2.31$ with
correlation $-0.99$. XRR reports 54 nm. Give the corrected index estimate
(constant optical path) and state which quantity the original fit had
actually measured.

**X19.6** A transparent conductor needs sheet resistance below
$15\ \Omega/\square$ from a 200 nm film with the plasma edge no shorter
than 1.1 µm ($\varepsilon_\infty=3.9$, $m^{*}=0.3m_0$). Using module 18's
$\sigma=ne\mu$, find the maximum allowed $n$, the implied minimum $\mu$,
and the design verdict.

**X19.7** (G) An infrared window of the ZnSe class must hold total
emissivity-related absorption loss below 0.5 percent at 10.6 µm across
8 mm. Bound the allowable $\alpha$, compare with a measured
$k=2\times10^{-6}$, and rule.

**X19.8** (G) Prove from Kramers-Kronig that a material transparent at all
frequencies must have $n=1$ everywhere: no lossless high-index materials:
and state the engineering escape that metamaterial vendors actually use.

### Exam answers

**X19.1** $R=((1.2)^{2}+0.16)/((3.2)^{2}+0.16)=1.60/10.40=0.154$.
$\alpha=4\pi\times0.4/5\times10^{-7}=1.0\times10^{7}\ {\rm m^{-1}}$:
$d=\ln100/\alpha=0.46\ {\rm \mu m}$: strongly absorbing: this is a
metal-like film, and the 15 percent reflectance with high loss is the
optical signature module 56's conductor screens for.

**X19.2** $d=550/(4\times1.9)=72.4$ nm; residual
$R=((n_c^{2}-n_s)/(n_c^{2}+n_s))^{2}=((3.61-3.5)/(7.11))^{2}
=2.4\times10^{-4}$: effectively nulled. Tolerance: detuning phase
$\delta=\pi/2\times(d/d_0)$: $R(\delta)$ rises to 1 percent at about
$\pm8$ percent thickness: $\pm6$ nm: comfortably inside deposition
control: single-layer AR is forgiving, which is why it ships everywhere.

**X19.3** $n(1.54)=1.44402$, $n(1.56)=1.44379$ (fit):
$dn/d\lambda=-1.15\times10^{-2}\ {\rm \mu m^{-1}}$:
$n_g=1.4439+1.55\times0.0115=1.4617$. Delay
$=n_gL/c=1.4617\times5\times10^{4}/3\times10^{8}=244\ {\rm \mu s}$.
The 0.018 excess of $n_g$ over $n$ is 3 µs of it: the dialect difference
of lesson 2's P19.10, now in microseconds.

**X19.4** Candidates: Varshni thermal shrinkage (redshift with warming:
matches direction), Burstein-Moss (needs degenerate doping: would
*blueshift* when cold only via filling: wrong sign here), Franz-Keldysh
(needs field). A 60 meV redshift over 290 K is canonical Varshni: the
default explanation earns the verdict, and the exam point is eliminating
the exotic before invoking it.

**X19.5** Constant path: $nd=2.31\times61=140.9$: $n=140.9/54=2.61$. The
fit had measured the optical thickness $nd$ to high precision and split it
arbitrarily: the correlation coefficient said so in advance: lesson 4's
P19.24 as an exam reflex.

**X19.6** Plasma-edge cap: from lesson 3's formula run inverse at
$\lambda_p=1.1$ µm: $\omega_p=1.71\times10^{15}$:
$n=\varepsilon_0\varepsilon_\infty m^{*}\omega_p^{2}/e^{2}
=8.85\times10^{-12}\times3.9\times2.73\times10^{-31}\times2.94\times10^{30}
/2.57\times10^{-38}=1.08\times10^{27}\ {\rm m^{-3}}\approx1.1\times10^{21}
\ {\rm cm^{-3}}$. Conductivity need:
$\sigma=1/(R_st)=1/(15\times2\times10^{-5}\ {\rm \Omega\,cm})=3333\
{\rm S/cm}$: $\mu=\sigma/ne=3333/(1.1\times10^{21}\times1.6\times10^{-19})
=19\ {\rm cm^{2}/Vs}$. Verdict: feasible: 19 is below good oxide
mobilities (module 18's degenerate-oxide audit found 58): the spec closes
with margin, and the calculation just reproduced module 56's design box
from two module-19 constraints.

**X19.7** Loss budget: $\alpha d\le5\times10^{-3}$:
$\alpha\le6.3\times10^{-3}\ {\rm cm^{-1}}$. Measured $k$:
$\alpha=4\pi k/\lambda=4\pi\times2\times10^{-6}/1.06\times10^{-3}\ {\rm cm}
=2.4\times10^{-2}\ {\rm cm^{-1}}$: four times over budget: fails: and the
lesson-1 deception repeats: a $k$ of "two millionths" sounded superb and
was not, because 10.6 µm's long wavelength divides it by little. High-power
IR optics buy their windows by $\alpha$, and this arithmetic is the
purchase order.

**X19.8** Kramers-Kronig gives $n(\omega)-1$ as an integral over
$k(\omega')$; if $k\equiv0$ everywhere the integral vanishes and $n\equiv1$
at all frequencies. Any index above one is purchased with absorption
somewhere: the escape is to park the mandatory loss outside the band of
use (silica pays in the deep UV and mid-IR): band-limited transparency,
never lossless dielectrics. A metamaterial claiming high index and zero
loss over all bands is claiming a violation of causality: the module's
final audit, and its sharpest.

## 5. The module's four ideas

1. **Two numbers, one causal object**: $n$ and $k$ are bound by
   Kramers-Kronig; every index is paid for with absorption somewhere.
2. **Edges are mechanisms**: direct, indirect, excitonic, Urbach, free
   carrier, phonon: each with its own plot, each moving under doping,
   field and temperature for stated reasons.
3. **The window is a truce**: between electronic and vibrational walls;
   selection starts there and ends in thermal-mechanical-economic columns.
4. **Optical measurement is model-mediated**: ratios beat intensities,
   correlations lurk in fits, floors differ by four decades between
   methods: audit the extraction, not just the spectrum.
