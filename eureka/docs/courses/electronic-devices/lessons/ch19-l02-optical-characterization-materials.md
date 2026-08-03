# Refractive Index and Dispersion

<!-- covers: 19.2 -->

Lesson 1 established that $n$ and $k$ are one causal object. This lesson
lives on the real side: how the index varies with wavelength, why it must,
how it is parameterised for design, and the second-order coefficients
(thermal, electrical, mechanical) through which the "constant" responds to
the world.

**Level.** Sections 1 to 4 undergraduate; section 5 graduate; section 6
problems.

## 1. Why every index disperses

Between absorption resonances, the Kramers-Kronig integral of lesson 1 makes
the index a weighted memory of all the poles:

$$
n^{2}(\omega)-1=\sum_j\frac{f_j\,\omega_j^{2}}{\omega_j^{2}-\omega^{2}}
$$

![The index across five decades of wavelength for a two-pole model: pulled up approaching the UV electronic resonance, pulled down toward the IR lattice resonance, and falling gently in between. Every transparent material lives in such a valley.](/courses/electronic-devices/figures/m19-oscillator-sum.svg)

Within a transparency window the UV poles dominate from the left, so $n$
**falls** as wavelength grows: **normal dispersion**. The rule of thumb this
buys: materials with smaller gaps have nearer UV poles and hence higher
visible indices: silica (9 eV gap) at 1.46 against silicon (1.1 eV) at 3.5:
lesson 1's estate observation, now with its mechanism.

## 2. Sellmeier: dispersion as an engineering contract

Group the poles into a few effective resonances and the working form
appears:

$$
\boxed{\;n^{2}(\lambda)=1+\sum_{j=1}^{3}
\frac{B_j\,\lambda^{2}}{\lambda^{2}-C_j}\;}
$$

![The three-term Sellmeier fit of fused silica, computed from the standard published coefficients. Two UV terms and one infrared term reproduce the measured index to the fifth decimal across the entire transmission window.](/courses/electronic-devices/figures/m19-sellmeier.svg)

The $C_j$ are squared pole wavelengths, the $B_j$ their strengths; the form
is the physics of section 1 with fitted constants, which is why it
extrapolates so much better than a polynomial: it fails only where new
physics (a real absorption) begins. Glass catalogues, lens-design software
and fibre models all speak Sellmeier.

### Worked example 2.1 — using the fit as a designer does

How much does silica's index differ between the two fibre windows, 1310 and
1550 nm, and what does it mean for a wavelength-division system? Evaluating
the fit: $n(1.31)=1.4468$, $n(1.55)=1.4440$: a difference of $2.8\times
10^{-3}$. Over 100 km, the *phase* paths differ by
$\Delta nL=280$ m: irrelevant to detection: but the pulse-speed difference
(next section) is what disperses data, and this example is why the naive
"index difference" is the wrong first question: the derivative, not the
value, carries the system penalty.

## 3. Group velocity: what information actually travels at

A pulse is a beat of neighbouring frequencies; its envelope moves at the
group velocity, described by the **group index**

$$
\boxed{\;n_g=n-\lambda\frac{dn}{d\lambda},
\qquad v_g=\frac{c}{n_g}\;}
$$

![Phase and group index of silica computed from the same Sellmeier fit. The group index passes through a minimum: the zero-dispersion wavelength near 1.27 micrometres where neighbouring wavelengths travel together.](/courses/electronic-devices/figures/m19-group-index.svg)

The curvature of $n_g$ is the **chromatic dispersion** that limits fibre
links, quoted as $D$ in ps/(nm km): the differential delay per nanometre of
source width per kilometre. Where $n_g$ is minimal, $D=0$: the
zero-dispersion wavelength: and silica's landing near 1.3 µm (with the loss
minimum at 1.55 µm) shaped the entire telecom band plan: two material
curves, one industry map.

### Worked example 3.1 — a link's dispersion budget

A 10 Gb/s link uses a laser with 0.1 nm linewidth at 1550 nm over 80 km of
fibre with $D=17$ ps/(nm km). Pulse spread:

$$
\Delta t=D\,\Delta\lambda\,L=17\times0.1\times80=136\ {\rm ps}
$$

Bit period 100 ps: the spread **exceeds the bit slot**: uncompensated, the
link fails. Remedies, each a materials-or-design chapter: dispersion-
compensating fibre (engineered waveguide dispersion), narrower sources, or
moving to 1310 nm and paying the loss. This one multiplication is the
gatekeeper of every long link, and the reason "how wide is your laser" is a
systems question.

### Worked example 3.2 — group delay in a sensor

A silicon photonic delay line seeks 100 ps of on-chip delay at 1550 nm
using a waveguide with $n_g=4.2$ (waveguide dispersion added to material's).
Length: $L=ct/n_g=3\times10^{8}\times10^{-10}/4.2=7.1$ mm: centimetres of
spiral on a chip. High group index buys compactness: and the same
enhancement multiplies loss and nonlinearity, the standard slow-light tax.

## 4. The glass map and the coefficients of change

### 4.1 Two numbers per glass

Visible-optics practice compresses dispersion into the **Abbe number**

$$
V_d=\frac{n_d-1}{n_F-n_C}
$$

(large $V_d$ = low dispersion), and materials plot on the index-Abbe plane:

![The glass map: crowns to the low-dispersion left, flints to the high-index right. An achromatic doublet pairs one from each side so their colour errors cancel at two wavelengths.](/courses/electronic-devices/figures/m19-abbe-map.svg)

The achromat condition for two thin lenses in contact,
$\phi_1/V_1+\phi_2/V_2=0$, forces opposite-signed powers from
different-$V$ glasses: why the map has to be two-dimensional and why exotic
low-dispersion materials (fluorite-class) command their prices.

### 4.2 The index responds to everything

| coefficient | symbol, scale | who uses it |
|---|---|---|
| thermo-optic | $dn/dT$: silica $+1\times10^{-5}$/K, silicon $+1.8\times10^{-4}$/K | interferometer drift; thermal tuning of ring resonators |
| electro-optic | $r$: LiNbO3-class, pm/V | modulators (deferred photonic scope) |
| carrier plasma | $\Delta n(N)$: silicon $-$ | the silicon modulator's mechanism (module 37) |
| photoelastic | $p$: all glasses | stress birefringence; fibre sensors |

Silicon's large $dn/dT$ makes photonic circuits thermally twitchy: a ring
resonator detunes by a linewidth for a fraction of a degree: so every
silicon photonic chip carries heaters and control loops: a materials
coefficient turned into a power budget.

### Worked example 4.1 — how stable must the lab be?

An interferometric sensor uses 10 cm of silicon waveguide at 1550 nm and
must hold phase to $\lambda/100$. Temperature tolerance:

$$
\Delta\phi=\frac{2\pi L}{\lambda}\frac{dn}{dT}\Delta T
\Rightarrow
\Delta T=\frac{\lambda/100}{L\,(dn/dT)}
=\frac{1.55\times10^{-8}}{0.1\times1.8\times10^{-4}}=0.86\ {\rm mK}
$$

Millikelvin stability or active referencing: no free-running silicon
interferometer survives a lab's air conditioning. The same arithmetic with
silica's twentyfold-smaller coefficient is why fibre interferometers are
merely difficult rather than absurd.

## 5. Graduate extension: engineered dispersion

**Waveguide dispersion.** Confinement adds a geometric term: the mode
samples core and cladding in a wavelength-dependent ratio, so total
dispersion is material plus waveguide. Designers move the zero-dispersion
point (dispersion-shifted fibre), flatten it, or invert the sign: the
compensating-fibre trick of worked example 3.1: all with geometry, no new
chemistry. Photonic-crystal and nanostructured guides push this to extremes
(slow light, $n_g$ of tens), always paying the loss-and-bandwidth tax.

**Birefringence as a resource.** Anisotropic index differences retard one
polarization against the other: wave plates from calcite-class crystals,
polarization-maintaining fibre from deliberate stress rods (photoelastic
coefficient used on purpose), and liquid-crystal displays from electrically
reoriented birefringence: an entire display industry running on
$\Delta n\approx0.1$ and a volt.

**The honesty rule for quoted indices.** Any index without wavelength,
temperature and (for films) density/porosity context is under-specified:
lesson 4's ellipsometry can fit a film's "index" to three decimals that
shift in the fourth with humidity. The module's data discipline (module 17,
supplement) applies verbatim.

## 5b. Where dispersion bites next in this course

A forward routing, so the lesson's machinery is recognised when it
reappears wearing other modules' clothes. In **module 31**, infrared
detector optics live where materials run out of Abbe-map choices: the
mid-IR designer colour-corrects with diffractive surfaces and material
pairs like germanium-with-chalcogenide because the visible map's crowns
and flints simply do not transmit there: same achromat algebra, a
five-material palette. In **module 33**, electron microscopy has its own
chromatic aberration: an energy spread in the beam is a wavelength spread,
and the correctors that fixed it in the 2000s are the electron-optical
achromats of this lesson's section 4. In **module 41**, the
thin-film-silicon stack's optical model must carry the full $n(\lambda)$
of each layer or its interference-based thickness extraction fails
precisely at the band edge where the cell's performance is decided. And in
**module 56**, the free-carrier contribution to the index (this lesson's
coefficient table meeting lesson 3's plasma physics) makes a transparent
conductor's dispersion depend on its doping: two process knobs, one
optical constant: the correlation an in-line monitor must be designed
around, as the workshop lesson demonstrates at length.

The pattern across all four: dispersion is never the headline property and
routinely the failure mode. The derivative of the index, like the
derivative of every material property in this course, is where designs
that matched at one operating point discover they were never matched at
all: a closing sentence that the thermal, mechanical and electrical
modules ahead will each re-earn with their own coefficients.

## 6. Problems

**P19.7** From the two-pole model, explain in two sentences why adding lead
oxide to a glass (heavy ions, strong low-energy electronic transitions)
raises both index and dispersion: the flint recipe.

**P19.8** Evaluate silica's $n$ at 0.4 and 0.7 µm from the Sellmeier fit
and compute $V_d$-style dispersion $(n_{0.4}-n_{0.7})$; compare with the
$2.8\times10^{-3}$ of the fibre windows and explain the ratio.

**P19.9** A source of 2 nm width runs at 850 nm over 500 m of fibre with
$D=-90$ ps/(nm km) (silica's normal-dispersion side). Find the spread and
the maximum bit rate by the quarter-period rule.

**P19.10** Show that $n_g=n+\omega\,dn/d\omega$ is the same statement as
the boxed $\lambda$ form.

**P19.11** A thermally tuned silicon ring needs one free spectral range of
tuning: $\Delta n/n=\lambda/(n L_{\rm rt})\times m$... simplified: it needs
$\Delta n=3\times10^{-3}$. What temperature swing, and what does the answer
say about tuning power?

**P19.12** *(graduate)* An achromat pairs $V_1=64$, $V_2=36$ for net power
$\phi=0.02\ {\rm cm^{-1}}$. Find the element powers and comment on why
secondary spectrum (the residual at a third wavelength) drives designers to
the map's exotic corners.

### Answers

**P19.7** Heavy-metal ions add strong oscillators just beyond the visible;
by section 1 the nearby poles raise $n$ across the visible, and their
proximity makes the $\lambda$-dependence steep, lowering $V_d$: index and
dispersion rise together because both are the same poles moving closer:
the flint corner of the map, explained by the transform.

**P19.8** Fit gives $n(0.4)=1.4701$, $n(0.7)=1.4553$:
$\Delta n=1.48\times10^{-2}$: five times the infrared pair's difference
over a similar fractional span: the visible sits nearer the UV poles where
the curve steepens: dispersion is a proximity effect.

**P19.9** $\Delta t=90\times2\times0.5=90$ ps. Quarter-period rule:
bit period $\ge4\Delta t=360$ ps: about **2.8 Gb/s**: why 850 nm multimode
links are short and why their VCSELs are spec'd in fractions of a
nanometre. (The negative sign flips which colours lead, not the penalty.)

**P19.10** With $\lambda=2\pi c/\omega$:
$d/d\lambda=-(\omega^{2}/2\pi c)\,d/d\omega$: substitute into
$n-\lambda\,dn/d\lambda$ and the sign cancellation yields
$n+\omega\,dn/d\omega$: one identity in two dialects; deriving it once
prevents the classic sign error in dispersion calculations.

**P19.11** $\Delta T=\Delta n/(dn/dT)=3\times10^{-3}/1.8\times10^{-4}
=17$ K. At a typical few mW per ring-heater-kelvin, tens of milliwatts per
ring: multiplied by thousands of rings in a switch fabric, the thermal
tuning budget rivals the optical power budget: the coefficient table's
quiet system cost.

**P19.12** $\phi_1/64=-\phi_2/36$ and $\phi_1+\phi_2=0.02$:
$\phi_1=0.02\times64/(64-36)=0.0457$, $\phi_2=-0.0257\ {\rm cm^{-1}}$:
elements 2.3x stronger than the doublet they build, with opposite signs:
strong curvatures, tight tolerances. The pairing cancels dispersion at two
chosen wavelengths only; the residual at a third depends on the *shape* of
each glass's dispersion curve (partial dispersion), and only the map's
anomalous corners (fluorites, special crowns) bend that shape: why apo
lenses cost what they cost, and a preview of how deeply "one number per
material" fails an exacting design.
