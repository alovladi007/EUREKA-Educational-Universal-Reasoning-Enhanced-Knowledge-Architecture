# Optical Constants: What Light Measures in a Solid

<!-- covers: 19.1 -->

Light is the most informative non-destructive probe an electronic material
ever meets. This module's first lesson builds the machinery: two numbers per
wavelength that encode everything a beam can learn, the theorems that bind
them, and the microscopic model that generates them both.

**Level.** Sections 1 to 4 undergraduate core; section 5 graduate; section 6
problems.

## 1. The complex index and what each part does

A monochromatic wave in a medium is described by one complex number,

$$
\tilde{N}=n-ik
$$

Insert into the plane wave $e^{i(\tilde{N}\omega z/c-\omega t)}$ and the two
parts separate jobs: $n$ sets the phase velocity $c/n$ and therefore
refraction; $k$, the **extinction coefficient**, sets exponential decay.
Intensity goes as the field squared:

$$
I(z)=I_0e^{-\alpha z},
\qquad
\boxed{\;\alpha=\frac{4\pi k}{\lambda}\;}
$$

The reciprocal $1/\alpha$ is the **penetration depth**: the working length
scale of every absorber, emitter and detector in this course.

The same physics wears a second notation. The **dielectric function**
$\tilde{\varepsilon}=\varepsilon_1-i\varepsilon_2$ relates to the index by
$\tilde{\varepsilon}=\tilde{N}^{2}$:

$$
\varepsilon_1=n^{2}-k^{2},
\qquad
\varepsilon_2=2nk
$$

Optics speaks in $n,k$ (propagation); solid-state physics speaks in
$\varepsilon$ (response of the electron system). They are one quantity, and
fluency in the translation is assumed from here on.

### Worked example 1.1 — from a datasheet k to a device thickness

An absorber layer quotes $k=0.08$ at $\lambda=620$ nm. What thickness
absorbs 90 percent of the entering light?

$$
\alpha=\frac{4\pi\times0.08}{620\times10^{-9}}=1.62\times10^{6}\ {\rm m^{-1}}
=1.62\times10^{4}\ {\rm cm^{-1}}
$$

$e^{-\alpha d}=0.1$: $d=\ln 10/\alpha=1.42\ {\rm \mu m}$. One line from an
optical constant to a layer specification: the daily arithmetic of
photodetector and solar-absorber design.

The span of this one parameter across a single material is worth seeing
whole:

![Silicon-like penetration depth computed from a stated two-term absorption model: four decades between the ultraviolet and the band edge. Every image sensor's colour response, crosstalk budget and surface-passivation sensitivity is this curve read as a depth chart.](/courses/electronic-devices/figures/m19-penetration-depth.svg)

## 2. Reflection: the index announces itself at every surface

Continuity of the fields at a boundary gives the normal-incidence
reflectance

$$
\boxed{\;R=\frac{(n-1)^{2}+k^{2}}{(n+1)^{2}+k^{2}}\;}
$$

![Reflectance against index for three extinction levels, with silica, gallium nitride and silicon marked. A high-index facet is a built-in mirror, whether wanted or not.](/courses/electronic-devices/figures/m19-reflectance-vs-n.svg)

Silicon's $n\approx3.5$ reflects 31 percent of normal-incidence light from a
bare surface: the loss every solar cell's antireflection coating exists to
cancel, and, run in reverse, the free facet mirror that module 17's laser
used. The quarter-wave coating condition follows from the same Fresnel
algebra: a layer of index $n_c=\sqrt{n}$ and thickness $\lambda/4n_c$ nulls
the reflection at its design wavelength.

Away from normal incidence the two polarizations part company:

![The s and p reflectances for a glass-like and a silicon-like index. The p wave vanishes at Brewster's angle, and the whole ellipsometry industry of lesson 4 lives inside the difference between these two curves.](/courses/electronic-devices/figures/m19-fresnel-angles.svg)

$$
\theta_B=\arctan n
$$

### Worked example 2.1 — an antireflection coating, checked

Design the single-layer AR coating for silicon at 600 nm and estimate the
residual reflectance if the ideal coating index is unavailable and
$n_c=2.0$ is used instead ($\sqrt{3.5}=1.87$ ideal).

Thickness: $d=\lambda/4n_c=600/8=75$ nm. Residual at centre wavelength for
a quarter-wave layer:

$$
R=\left(\frac{n_c^{2}-n}{n_c^{2}+n}\right)^{2}
=\left(\frac{4.0-3.5}{4.0+3.5}\right)^{2}=(0.0667)^{2}=0.44\ \text{percent}
$$

From 31 percent to 0.4 percent with one evaporated layer of slightly wrong
index: why AR coating is the cheapest efficiency any optical device buys,
and why the *availability* of an index (a materials-catalogue fact) matters
more than its ideality.

## 3. The microscopic origin: one oscillator makes both constants

Model a bound electron as a damped oscillator driven by the light field.
Its polarization contributes

$$
\tilde{\varepsilon}(\omega)=1+\frac{\omega_p^{2}}
{\omega_0^{2}-\omega^{2}-i\gamma\omega}
$$

with resonance $\omega_0$, strength $\omega_p^{2}$, damping $\gamma$.

![The n and k of a single Lorentz oscillator, computed. Absorption peaks at the resonance while the index swings through its anomalous excursion around it: two curves, one cause.](/courses/electronic-devices/figures/m19-lorentz-nk.svg)

Every feature of real optical spectra is sums of this shape: electronic
transitions in the UV-visible, lattice vibrations in the infrared, free
carriers as the $\omega_0\to0$ limit (which recovers module 18's Drude
$\sigma(\omega)$ exactly: one model bridging the two modules). Lesson 2
builds dispersion from these poles; lesson 3 catalogues the absorption each
kind of pole produces.

## 4. Kramers-Kronig: absorption and dispersion are not independent

Causality alone: the medium cannot polarize before the field arrives:
forces the real and imaginary parts to be Hilbert transforms of each other:

$$
n(\omega)-1=\frac{2}{\pi}\,\mathcal{P}\!\int_0^{\infty}
\frac{\omega'k(\omega')}{\omega'^{2}-\omega^{2}}\,d\omega'
$$

Three working consequences:

- **Measure one, compute the other.** Reflectance or absorption over a wide
  range yields the full $n(\omega)$: the standard route to optical constants
  where direct index measurement is impossible.
- **Wherever a material absorbs, its index must swing nearby.** The
  anomalous-dispersion excursion of the figure is mandatory, not incidental.
- **Sum rules audit data.** The integrated $\varepsilon_2$ counts electrons;
  a published constant set violating the f-sum rule is wrong somewhere, and
  running the check is a real referee's tool.

### Worked example 4.1 — a consistency audit in miniature

A vendor claims a coating with $n=2.6$ across the entire visible and "zero
absorption anywhere". Audit: silica, with UV resonances at 0.1 um, manages
only 1.46 in the visible; reaching 2.6 requires strong oscillators close to
the visible (lesson 2's sum-of-poles figure): and Kramers-Kronig then puts
the absorption edge of those oscillators near the blue. High index with no
nearby absorption violates the transform. The claim as stated is
unphysical: the honest versions are "high index, absorbing in the near-UV"
(titania-class, true) or "moderate index, transparent deep into the UV"
(fluoride-class, true), and a one-line causality argument separated
marketing from physics.

## 5. Graduate extension: what "constant" hides

**Local response only.** The $\tilde{N}(\omega)$ formalism assumes the
polarization at a point depends on the field at that point. Near sharp
excitonic resonances and in metals at short scales, spatial dispersion
(dependence on $\mathbf{q}$) enters, and thin-film optical "constants"
acquire thickness dependence: part of why film data and bulk data differ
beyond density arguments (module 44 meets the practical side).

**Anisotropy.** In non-cubic crystals $\tilde{\varepsilon}$ is a tensor:
uniaxial materials carry ordinary and extraordinary indices, and module 32's
nitrides, module 45's sapphire substrates and every liquid-crystal display
live on the difference. A single quoted $n$ for such a material is
incomplete without its axis.

**Nonlinearity.** At laser intensities the polarization gains terms in
$E^{2}$ and $E^{3}$: second-harmonic generation, the electro-optic effect,
intensity-dependent index. This course's electronic scope stops at noting
where they hide inside "constants": the electro-optic coefficient is how a
field modulates $n$, which is how modulators work, and the deferred
photonics wave (SCOPE.md) owns the full story.

## 6. Problems

**P19.1** Germanium at 2 µm has $n=4.1$, $k=0.001$. Find $R$, $\alpha$, the
penetration depth, and the single-pass transmission of a 0.5 mm window
(two surfaces, ignore interference).

**P19.2** What coating index and thickness antireflect GaAs ($n=3.5$) at
900 nm, and what happens to the null at 800 nm? (Compute the phase error.)

**P19.3** From the Lorentz form, show that at exact resonance
$\varepsilon_2=\omega_p^{2}/\gamma\omega_0$ and that the full width of the
$\varepsilon_2$ peak is $\gamma$: absorption linewidth measures damping.

**P19.4** Silicon's penetration depth spans 10 nm (UV) to 100 µm (1.05 µm).
Using the model figure, explain the ordering of colour collection depths in
an image sensor and why red pixels suffer more crosstalk.

**P19.5** *(graduate)* The f-sum rule reads
$\int_0^{\infty}\omega\,\varepsilon_2\,d\omega=\tfrac{\pi}{2}\omega_p^{2}$
with $\omega_p^{2}=ne^{2}/\varepsilon_0m$. Evaluate the electron density
this implies if a material's visible-UV absorption exhausts the rule by
4 electrons per atom at atomic density $5\times10^{22}\ {\rm cm^{-3}}$, and
state what the rule forbids a metamaterial vendor from claiming.

**P19.6** *(graduate)* Show from the Fresnel equations that at Brewster's
angle the reflected light is fully s-polarized, and give the two practical
uses this course makes of that fact (one in this module, one anywhere
else).

### Answers

**P19.1** $R=((3.1)^{2}+10^{-6})/((5.1)^{2}+10^{-6})=9.61/26.01=0.369$.
$\alpha=4\pi\times0.001/2\times10^{-6}=6.3\times10^{3}\ {\rm m^{-1}}$
$=63\ {\rm cm^{-1}}$; depth 159 µm. Bulk transmission over 0.5 mm:
$e^{-3.14}=0.043$... that kills the window: recompute honestly:
$\alpha d=6.3\times10^{3}\times5\times10^{-4}=3.15$: $T_{\rm bulk}=4.3$
percent: with two 37-percent surfaces, total under 2 percent. The "small"
$k=0.001$ destroyed a half-millimetre window: extinction coefficients
deceive at thickness, which is why IR-window specs quote $\alpha$, not $k$.

**P19.2** $n_c=\sqrt{3.5}=1.87$, $d=900/(4\times1.87)=120$ nm. At 800 nm
the layer is $\lambda/4\times(900/800)=1.125$ quarter-waves: 12.5 percent
phase error; residual $R\approx R_{\rm bare}\sin^{2}(\ldots)$ small but
nonzero: single-layer coatings are narrowband, and broadband AR is a
multilayer synthesis problem: the door to thin-film design.

**P19.3** At $\omega=\omega_0$ the denominator is $-i\gamma\omega_0$:
$\varepsilon_2=\omega_p^{2}/\gamma\omega_0$. Half-maximum where
$|\omega_0^{2}-\omega^{2}|=\gamma\omega$: near resonance
$\omega_0^{2}-\omega^{2}\approx2\omega_0\Delta$: $\Delta=\pm\gamma/2$:
full width $\gamma$. Spectroscopy reads dissipation directly off a
linewidth: used from Raman phonon lifetimes to exciton dephasing.

**P19.4** Blue absorbs in the first tens of nanometres (surface-recombination
territory: why blue quantum efficiency tests surface passivation); green
within a micrometre; red and near-IR generate carriers many micrometres
deep, below the pixel's depletion, where they diffuse sideways before
collection: red crosstalk. The stratification is the penetration-depth
figure read as a pixel cross-section, and deep-trench isolation (module 43)
is the remedy sold against it.

**P19.5** $\omega_p^{2}$ for $n=4\times5\times10^{22}=2\times10^{23}
\ {\rm cm^{-3}}=2\times10^{29}\ {\rm m^{-3}}$:
$\omega_p=\sqrt{ne^{2}/\varepsilon_0m}=\sqrt{2\times10^{29}\times(1.6\times
10^{-19})^{2}/(8.85\times10^{-12}\times9.1\times10^{-31})}=2.5\times10^{16}$
rad/s (a 75 nm plasma wavelength: deep UV, as befits dense valence
electrons). Forbidden claim: arbitrarily strong absorption or index over an
arbitrarily wide band from a fixed electron density: oscillator strength is
conserved, so a resonance added somewhere is strength removed elsewhere.
Sum rules are conservation laws for optical marketing.

**P19.6** At $\theta_B$, $r_p=0$ by construction (the numerator
$n\cos\theta-\cos\theta_t$ vanishes when $\theta+\theta_t=90^{\circ}$), so
only s survives in reflection. Uses: pile-of-plates/Brewster-window
polarizers and glare-free laser cavity windows; and in this course,
ellipsometry's sensitivity maximum sits near Brewster (lesson 4): the
measurement angle of 70 to 75 degrees on silicon is $\theta_B$ wearing lab
clothes.
