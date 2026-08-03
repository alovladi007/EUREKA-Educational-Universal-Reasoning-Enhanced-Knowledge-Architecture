# Thin-Film Optics: Interference as an Engineering Material

<!-- covers: 19.1, 19.2 -->

A stack of films with chosen indices and thicknesses is effectively a new
optical material, synthesised by interference. This lesson builds the
transfer-matrix machinery that designs every AR coating, mirror stack and
filter in the industry, because the module's constants only become products
through it.

**Level.** Sections 1 to 4 undergraduate-to-graduate boundary; section 5
graduate; section 6 problems.

## 1. One film, exactly

For a film (index $n_1$, thickness $d$) between media $n_0$ and $n_2$, the
reflected amplitudes at the two interfaces interfere with the round-trip
phase

$$
\beta=\frac{2\pi n_1 d\cos\theta_1}{\lambda}
$$

Summing the multiple bounces as a geometric series (the Airy result):

$$
\boxed{\;r=\frac{r_{01}+r_{12}\,e^{-2i\beta}}
{1+r_{01}r_{12}\,e^{-2i\beta}}\;}
$$

Two special cases run the industry:

- **Half-wave** ($\beta=\pi$): $e^{-2i\beta}=1$: the film vanishes
  optically: an "absentee layer", used as a protective cap that does not
  disturb a design wavelength.
- **Quarter-wave** ($\beta=\pi/2$): $e^{-2i\beta}=-1$: the film transforms
  the substrate admittance as

$$
n_{\rm eff}=\frac{n_1^{2}}{n_2}
$$

The quarter-wave transformer is the single most used identity in optical
engineering: lesson 1's AR condition $n_1=\sqrt{n_0n_2}$ is the special
case that maps $n_2$ to $n_0$.

### Worked example 1.1 — an admittance chase

What does a quarter-wave of $n_1=2.35$ on glass ($n_2=1.52$) look like to
the incident air? $n_{\rm eff}=2.35^{2}/1.52=3.63$: the coated glass
*reflects like silicon*: $R=((3.63-1)/(4.63))^{2}=32$ percent from a 32
percent-transparent stack of transparent materials. Interference
manufactures reflectance without absorption: the operating principle of
every dielectric mirror, and the reason a "transparent coating" claim needs
a wavelength attached.

## 2. The transfer matrix: stacks by multiplication

Each layer contributes a **characteristic matrix**

$$
M_j=\begin{pmatrix}\cos\beta_j & \dfrac{i\sin\beta_j}{n_j}\\[2mm]
i\,n_j\sin\beta_j & \cos\beta_j\end{pmatrix}
$$

and a stack is the product $M=M_1M_2\cdots M_N$, from which the reflectance
follows with the two outer media. The method's power is structural:
**design becomes algebra**, and every filter catalogue is a factored matrix
product. Two families cover most needs:

**The quarter-wave mirror.** Alternate high and low quarter-waves,
$(HL)^{m}$. Each pair multiplies the effective admittance by
$(n_H/n_L)^{2}$, so reflectance climbs geometrically:

$$
R=\left(\frac{1-(n_H/n_L)^{2m}\,n_H^{2}/n_s}
{1+(n_H/n_L)^{2m}\,n_H^{2}/n_s}\right)^{2}
$$

### Worked example 2.1 — 99.9 percent from glass and titania

$n_H=2.35$, $n_L=1.46$, glass substrate, how many pairs for $R\ge99.9$
percent? Ratio $(2.35/1.46)^{2}=2.59$ per pair. Requirement:
the admittance mismatch term must exceed about 66 (from inverting the
formula for $R=0.999$): $2.59^{m}\times(2.35^{2}/1.52)\ge66$:
$2.59^{m}\ge18.2$: $m\ge\ln18.2/\ln2.59=3.05$: **four pairs** overshoot
comfortably (check: $2.59^{4}\times3.63=163$: $R=99.85$...
five pairs: 99.94 percent). Eight to ten evaporated layers replace a metal
mirror and beat its absorption: laser mirrors reach 99.999 percent with
more pairs and cleaner films, a number no metal approaches.

**The bandwidth caveat.** The mirror is quarter-wave only at its design
wavelength: high reflectance spans a stopband of fractional width

$$
\frac{\Delta\lambda}{\lambda_0}
\approx\frac{4}{\pi}\arcsin\!\left(\frac{n_H-n_L}{n_H+n_L}\right)
$$

about 32 percent for the pair above: outside it the stack transmits: a
mirror with a colour, which is the point of dichroic optics and the trap of
assuming "mirror" means broadband.

## 3. Cavities: interference squared

Enclose a spacer between two mirror stacks and transmission collapses to
resonant lines: the Fabry-Perot condition

$$
2n_cd_c=m\lambda
$$

with linewidth set by the mirror reflectance through the finesse

$$
\mathcal{F}=\frac{\pi\sqrt{R}}{1-R},
\qquad
\Delta\lambda_{\rm FWHM}=\frac{\lambda}{ m\,\mathcal{F}}
$$

### Worked example 3.1 — a wavelength-division filter

A telecom add-drop filter needs a 0.4 nm passband at 1550 nm from a
half-wave cavity ($m=2$ effective order): $\mathcal{F}=1550/(2\times0.4)
\approx1940$: $\sqrt{R}\pi/(1-R)=1940$ gives $1-R\approx1.6\times10^{-3}$:
mirrors of 99.84 percent: about seven quarter-wave pairs per side by
worked example 2.1's arithmetic. Forty-ish deposited layers, each
controlled to nanometres: and module 44's deposition control, monitored
*optically in situ* by watching the growing stack's reflectance walk its
design curve, is what makes the yield economic. The metrology and the
product are the same physics.

The same architecture at other scales: the VCSEL (module 17's emitter)
is a semiconductor Fabry-Perot with epitaxial mirrors; interference filters
in every fluorescence instrument; and the etalon fringes of lesson 4's
transmission measurement are the uninvited version, which is why "fringe"
is both a signal and a nuisance depending on who ordered it.

## 4. Absorption inside stacks: where the field puts it

Interference redistributes the standing-wave field, so *where* a lossy
layer sits decides what it absorbs. The absorbed fraction in a thin layer
scales with the local intensity $|E(z)|^{2}$: at a mirror's surface the
field has a node (metals) or antinode structure (dielectric stacks) and a
2 nm absorber can be made to absorb double its naive share or nearly
nothing by half-wave repositioning.

Three engineering exploitations, each a later module's device: resonant-
cavity-enhanced photodetectors (thin absorber at an antinode: module 31's
efficiency trick), saturable-absorber mirrors for lasers, and the
back-reflector plus texture "light trapping" of thin-film photovoltaics
(module 41), whose ergodic limit multiplies the path length by

$$
\boxed{\;4n^{2}\;}
$$

: about 50 for silicon: the celebrated bound that lets a micrometre of
material absorb like fifty.

### Worked example 4.1 — the 4n squared dividend

An indirect film with $\alpha=10^{2}\ {\rm cm^{-1}}$ at the band edge and
$d=2\ {\rm \mu m}$ absorbs $1-e^{-0.02}=2$ percent in one pass. With
ideal Lambertian trapping the effective path is $4n^{2}d$ with $n=3.5$:
$98\ {\rm \mu m}$: absorption $1-e^{-0.98}=62$ percent. Texturing bought a
factor of thirty: no new material, pure geometry: and the audit habit
notes the bound assumes lossless mirrors and full randomisation: real
cells reach a useful fraction of it, never the bound itself.

## 5. Graduate extension: beyond periodic

**Rugate and gradient-index films** replace discrete layers with continuous
index profiles: sidelobe suppression by apodisation: the Fourier-transform
view of coating design (the reflectance spectrum is, in the weak limit, the
transform of the index profile) makes filter synthesis a signal-processing
problem, and modern needle-optimisation design descends from exactly that
mapping.

**Beyond specular: scattering budgets.** Interface roughness $\sigma$
scatters light out of the specular design with a total integrated scatter
$\propto(4\pi\sigma\cos\theta/\lambda)^{2}$: at EUV lithography
wavelengths this term is why mirror polish is specified in tens of
picometres: module 33's metrology and this module's optics meeting at the
angstrom.

**Photonic crystals.** Extend the quarter-wave stack's stopband to two and
three dimensions and the language becomes bands and gaps: deliberately the
same words as module 18, because the mathematics is: a periodic potential
for photons. The deferred photonics wave owns the devices; the conceptual
bridge, stopband = bandgap, belongs here.

## 5b. From design to chamber: what manufacturing does to the matrix

The transfer matrix assumes each layer has its nominal index and thickness
with sharp interfaces; deposition (module 44's physics) delivers something
else, and the deltas are the coating industry's daily bread.

**Index deficits.** Evaporated films grow columnar and slightly porous:
their index runs one to three percent below bulk and, worse, *breathes*:
moisture filling the pores raises the index and redshifts every edge, the
notorious "vacuum-to-air shift" measured as a filter moving nanometres
between the chamber and the bench. Energetic processes (ion assist,
sputtering) densify toward bulk index and stability: why precision filters
specify the deposition process, not just the design: lesson 4's porosity
caveat, here as a yield item.

**Thickness control and its compounding.** A stack's performance
sensitivity concentrates unevenly: the cavity spacers of section 3 carry
tolerances several times tighter than the mirror layers, and optical
monitoring exploits exactly that: terminate each critical layer at a
turning point of the monitored reflectance, where first-order thickness
error self-cancels. The turning-point method is the reason forty-layer
filters yield at all, and it is the matrix method run live as a control
law rather than off-line as a design tool.

**Interface grading and scatter.** Real interfaces mix over a nanometre
or two and carry roughness; both scatter light out of the design
(section 5's budget) and soften stopband edges. The audit measurement is
angle-resolved scatter, and the specification language ("total integrated
scatter below x at wavelength y") comes straight from that instrument.

**Stress, the silent partner.** Every layer arrives stressed (module 44),
and forty layers integrate to wafer-bowing forces that detune filters by
bending the substrate and, at the extreme, delaminate stacks. Coating
designs are stress-balanced (alternating tensile and compressive
materials) as a mechanical constraint co-equal with the optical one: the
matrix method's elegant algebra shares the spreadsheet with a strain
ledger, and module 54's thermomechanical discipline enters optics through
this door.

The section's moral completes the lesson's: interference synthesis is
real and routine, *and* its products are process artefacts whose optical
identity depends on chamber physics: the module's twin themes: constants
with conditions, extraction as part of the value: apply to the things we
build from the constants, too.

## 6. Problems

**P19.25** Compute the reflectance of a half-wave of $n=2.0$ on silicon at
its design wavelength, and explain "absentee" in one line.

**P19.26** How many $(HL)$ pairs of $n_H=2.1$, $n_L=1.38$ on glass reach
$R=99$ percent, and what stopband width do they provide?

**P19.27** A Fabry-Perot with $R=0.95$ mirrors and a 2 µm silica cavity:
find the free spectral range near 1550 nm, the finesse and the linewidth.

**P19.28** A 3 nm metal absorber is placed first at a field node, then an
antinode, in a stack where the standing-wave contrast is 4:1 in intensity.
Bound the ratio of absorbed powers, and name the module-31 device using
this.

**P19.29** Show that at oblique incidence the quarter-wave condition splits
for s and p (via $\cos\theta_1$ and the modified admittances), and state
the consequence for AR coatings on steep camera lenses.

**P19.30** *(graduate)* Using the geometric-series Airy sum, derive the
finesse formula and show the resolving power of order $m$ is
$m\mathcal{F}$: the interferometrist's figure of merit.

### Answers

**P19.25** Half-wave: the film is optically absent: $R$ equals bare
silicon's 31 percent (lesson 1). "Absentee": at its design wavelength a
half-wave layer maps every admittance to itself: protection without
optical cost, at one wavelength only.

**P19.26** Per-pair factor $(2.1/1.38)^{2}=2.316$. Need
$2.316^{m}\times(2.1^{2}/1.52)=2.316^{m}\times2.90$ large enough for
$R=0.99$: mismatch about 20: $2.316^{m}\ge6.9$: $m=2.3$: **three pairs**
(check: $2.316^{3}\times2.90=36$: $R=(35/37)^{2}=0.895$... four pairs:
$83.5$: $R=(82.5/84.5)^{2}=0.953$; five: $R=0.979$; six: 0.991): honest
recount says **six pairs**: the exponential is real but the prefactor
matters, and showing the recount is the answer's point: coating design
rewards arithmetic humility.

**P19.27** FSR $=\lambda^{2}/2n_cd_c=(1.55\times10^{-6})^{2}
/(2\times1.44\times2\times10^{-6})=417$ nm... units: $=4.17\times10^{-7}$ m
$=417$ nm: enormous because the cavity is thin: order $m\approx3.7$.
$\mathcal{F}=\pi\sqrt{0.95}/0.05=61$. Linewidth $=$ FSR$/\mathcal{F}
=6.8$ nm. A thin cavity gives few, fat lines: telecom filters thicken the
cavity or raise $R$: worked example 3.1's regime.

**P19.28** Absorption tracks $|E|^{2}$: bound is the intensity contrast,
**4:1**, between antinode and node placements (thin-layer limit).
Device: the resonant-cavity-enhanced photodetector: a thin absorber parked
at an antinode to multiply quantum efficiency without thickening the
transit region: bandwidth and efficiency decoupled by placement.

**P19.29** $\beta$ carries $\cos\theta_1$: the phase thickness thins with
angle; and the Fresnel admittances split ($n\cos\theta$ vs $n/\cos\theta$),
so one physical thickness cannot quarter-wave both polarizations off
normal: AR performance degrades and polarizes at the lens margin: why
wide-angle coatings are multilayer compromises designed across angle, not
just wavelength.

**P19.30** Transmitted intensity from the Airy sum:
$T\propto1/(1+F\sin^{2}\beta)$ with $F=4R/(1-R)^{2}$. Half-maximum at
$\sin^{2}\beta=1/F$: $\delta\beta=2/\sqrt{F}$ full width against the
$\pi$ between orders: $\mathcal{F}=\pi/\delta\beta=\pi\sqrt{F}/2
=\pi\sqrt{R}/(1-R)$. Resolving power: $\lambda/\Delta\lambda
=m\pi/\delta\beta=m\mathcal{F}$: order times finesse: the two ways to
resolve finely, thick cavities or good mirrors, stated as one product.
