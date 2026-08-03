# Optical Characterization: the Instruments and Their Honest Limits

<!-- covers: 19.4 -->

Lessons 1 to 3 supplied the physics a light beam can read. This lesson is
the laboratory: which instrument extracts which quantity, at what floor,
with which artefacts. It is the optical wing of the measurement triad this
course builds (module 33 structural, module 34 chemical, module 36
electrical), and it comes first in any real workflow because it is fast,
contactless and non-destructive.

**Level.** Sections 1 to 5 undergraduate; section 6 graduate; section 7
problems.

## 1. Transmission and reflection: the workhorse

One spectrophotometer scan of a film on a transparent substrate delivers
three quantities at once:

![A computed film-on-glass transmission spectrum. The fringe spacing measures optical thickness, the fringe envelope measures absorption, and the cutoff measures the gap: one scan, three numbers.](/courses/electronic-devices/figures/m19-interference-fringes.svg)

The fringes are Fabry-Perot interference; adjacent maxima at $\lambda_1,
\lambda_2$ give the thickness directly:

$$
\boxed{\;d=\frac{\lambda_1\lambda_2}{2\left(n\lambda_2-n\lambda_1\right)}
\approx\frac{\lambda_1\lambda_2}{2n(\lambda_1-\lambda_2)}\;}
$$

and envelope-method analysis extracts $n(\lambda)$ and $\alpha(\lambda)$
from the fringe maxima and minima alone: film metrology from a machine
every lab owns.

### Worked example 1.1 — thickness from two fringe peaks

Maxima at 720 and 654 nm, film index 2.05:

$$
d=\frac{720\times654}{2\times2.05\times(720-654)}
=\frac{4.71\times10^{5}}{270.6}=1740\ {\rm nm}
$$

A 1.74 µm film measured to ~1 percent with no model beyond $n$: and the
caveats are the content: the method needs fringes (films thicker than about
$\lambda/2n$), a transparent substrate, and surface roughness below the
wavelength scale or the fringe contrast, and with it the extraction,
collapses.

## 2. Ellipsometry: the ratio measurement

Reflect polarized light and measure the **ratio** of the p and s
reflection coefficients:

$$
\rho=\frac{r_p}{r_s}=\tan\Psi\,e^{i\Delta}
$$

Two numbers per wavelength ($\Psi,\Delta$) instead of one, measured as a
ratio: immune to source drift, needing no reference sample: and fitted to a
layer model to yield thickness and optical constants.

![Computed ellipsometric Psi for an oxide on a model substrate at seventy degrees: five nanometres of thickness moves the whole spectrum. Sub-nanometre sensitivity is routine, and everything depends on the model being right.](/courses/electronic-devices/figures/m19-ellipsometry.svg)

The power and the trap are the same fact: **ellipsometry measures nothing
directly**. Thickness, index, roughness and interlayers emerge from a
regression, correlated parameters and all. The professional discipline:
fix what can be fixed independently (substrate constants from a bare
reference; one thickness from X-ray reflectivity, module 33), report the
confidence intervals, and distrust any fit whose parameters trade against
each other in the correlation matrix.

### Worked example 2.1 — why 70 degrees

The sensitivity of $\rho$ peaks where $r_p$ passes through its minimum:
Brewster's angle (lesson 1). For silicon, $\theta_B=\arctan(3.9)=75.6$
degrees: the industry's 70 to 75 degree mounting is Brewster physics frozen
into instrument castings, and measuring a low-index film on silicon at 45
degrees throws away most of the signal: geometry is part of the
measurement.

## 3. Photoluminescence: asking the carriers themselves

Excite above the gap; collect the emission as carriers recombine:

![A computed PL spectrum annotated by what each feature reports: peak position reads gap and alloy composition, width reads inhomogeneity, and the deep band's ratio to the edge is the quality number a grower quotes.](/courses/electronic-devices/figures/m19-pl-spectrum.svg)

What each feature measures, with its lesson-3 physics attached: the peak
sits at gap (or exciton, cold) so it maps **composition** across a wafer to
sub-percent alloy precision; the width reads **inhomogeneity** (alloy
fluctuation, strain); the deep-band-to-edge ratio proxies the
**nonradiative population** (module 17's clock race, run in reverse); and
time-resolved PL yields the **lifetime** directly, feeding straight into
detector and cell design.

The honest limitation is structural: **PL only reports on materials that
emit**. Silicon's indirect edge makes PL faint (module 37), which is why
silicon lifetime work uses module 23's photoconductance methods instead:
the techniques partition the material world along the direct/indirect line
of lesson 3.

### Worked example 3.1 — a composition map without touching the wafer

An InGaN wafer's PL peak varies from 445 to 462 nm centre-to-edge. Using
lesson 3's Vegard-plus-bowing (module 17 worked the inverse), the 17 nm
spread converts to an indium variation of about 1.5 percent absolute:
mapped in minutes on a production tool, no contact, no prep: and the same
map's linewidth channel flags where the well width, not the composition,
wanders. This is the instrument module 32's growers live on.

## 4. Raman: phonons as fingerprints

Inelastic scattering shifts a probe laser by phonon energies:

![Computed mixed-phase silicon spectra: the crystalline line at 520 wavenumbers rising out of the amorphous 480 band as the crystalline fraction grows. The area ratio is module 41's standard phase assay.](/courses/electronic-devices/figures/m19-raman-fractions.svg)

The working channels: **peak position** identifies the phase and, shifted,
measures strain (the silicon line moves about $-2\ {\rm cm^{-1}}$ per GPa
biaxial tension: module 38's strain metrology); **width** reads crystallite
size and disorder; **intensity ratios** quantify phase mixtures; and
polarization selection rules read crystal orientation. All at optical-spot
resolution, through windows, on production material.

### Worked example 4.1 — strain in a transistor channel

A strained-silicon channel shows its Raman line at 517.2 against the bulk
520.0 cm$^{-1}$. With the stated coefficient, the 2.8 cm$^{-1}$ softening
reads about 1.4 GPa of biaxial tension: module 38's mobility booster,
verified non-destructively on the actual device wafer. The spot size
(~0.5 µm) averages over several devices; tip-enhanced variants chase single
structures: resolution, as always, trades against simplicity.

## 5. The sub-gap problem and the sensitivity ladder

Transmission through a 1 µm film cannot see $\alpha$ below roughly
$10^{2}\ {\rm cm^{-1}}$ ($\alpha d\sim10^{-2}$): and lesson 3 put the
defect and tail states precisely there. The specialist methods reach down:

![The floors of the module's methods on one axis: transmission stops where films' defect physics begins, and the photothermal and photocurrent methods exist precisely to reach three decades further down.](/courses/electronic-devices/figures/m19-sensitivity-ladder.svg)

**Photothermal deflection** reads absorbed heat via the refractive-index
gradient it creates in a fluid over the sample (lesson 2's $dn/dT$, used
as the detector); **constant photocurrent** (module 23) reads the carriers
generated, holding collection fixed; each reaches
$\alpha\sim10^{-1}\ {\rm cm^{-1}}$ on micrometre films. Their disagreement
is itself a measurement: PDS counts all absorption, CPM only the
carrier-producing part, so the difference isolates absorption that never
yields carriers: voids, surfaces: module 40 uses exactly that subtraction.

### Worked example 5.1 — sizing the gap between the methods

A 1.2 µm amorphous-silicon film is specified to have a mid-gap defect
absorption below $\alpha = 1\ {\rm cm^{-1}}$ at 1.2 eV. Can transmission
verify the spec, and what does the ladder say to use instead?

The absorbance the spec implies is

$$
\alpha d = (1\ {\rm cm^{-1}})(1.2\times10^{-4}\ {\rm cm})
         = 1.2\times10^{-4}.
$$

Transmission must therefore resolve a fractional intensity change of about
$1.2\times10^{-4}$ — on top of interference fringes of order 30% (section
1) and a photometric repeatability of perhaps $10^{-3}$ on a good
spectrophotometer. The signal sits an order of magnitude *below* the
instrument's noise floor and three orders below the fringe structure:
transmission cannot verify this spec, it can only fail to contradict it.

The ladder's answer: PDS at its $\alpha\sim10^{-1}\ {\rm cm^{-1}}$ floor
gives $\alpha d \sim 10^{-5}$ equivalent sensitivity on this film — one
decade of margin below the spec, enough to measure the actual value rather
than bound it. And the audit rule follows immediately: if the customer's
acceptance test is written as "transmission shows no sub-gap absorption",
the test is vacuous — every film passes, including bad ones. The
purchase-spec lesson (lesson 5) turns this into a drafting rule: a spec
must name a method whose floor sits at least a factor of a few *below*
the number being certified, or the certificate certifies the instrument,
not the film.

## 6. Graduate extension: the workflow and its audit rules

A characterization sequence for a new film, with each step's veto:

1. **Transmission/reflection**: thickness, gap, gross absorption: vetoes
   "wrong material entirely" in ten minutes.
2. **Ellipsometry**: precision thickness and $n,k$ dispersion: vetoes
   process drift; audited by an independent thickness (module 33's XRR).
3. **Raman**: phase, strain, crystallinity: vetoes "amorphous when you
   ordered crystal" (module 41's assay).
4. **PL** (if direct): composition map, lifetime, deep-level ratio: vetoes
   "dead material" before a single contact is deposited.
5. **Sub-gap method**: defect density: the number modules 23 and 40 need.

Cross-technique consistency is the standard of proof: a gap from Tauc, an
edge from PL and a $k$-spectrum from ellipsometry must agree within their
stated conditions (lesson 3's shifting-edge caveats), and a disagreement is
a finding: filling, field, strain or inhomogeneity: not an embarrassment.
And the meta-rule inherited from module 17's data book: every optical
number travels with wavelength, temperature and (films) thickness-porosity
context, or it travels as rumour.

## 7. Problems

**P19.19** Fringe maxima at 950, 838, 750 nm; $n=1.95$. Extract the
thickness from both adjacent pairs and comment on the consistency check.

**P19.20** Why does ellipsometry need no intensity reference while
transmission does? State the failure this immunity prevents, and one
artefact it does not.

**P19.21** A PL map's linewidth doubles in a wafer region while its peak
stays fixed. Composition, well-width fluctuation, or strain: argue which,
and name the confirming measurement.

**P19.22** A Raman spectrum of a film shows only the broad 480 band. The
grower's X-ray shows sharp diffraction. Reconcile the "contradiction".

**P19.23** A PDS spectrum and a CPM spectrum of the same a-Si:H film agree
above 1.4 eV and diverge by 5x at 1.1 eV, PDS higher. Interpret.

**P19.24** *(graduate)* An ellipsometric fit returns thickness
$102\pm1$ nm and index $1.46\pm0.01$ with a parameter correlation of
$-0.98$. What does the correlation mean physically, what additional single
measurement breaks it, and why does the fitted "confidence" understate the
real uncertainty?

### Answers

**P19.19** Pairs: $d=(950\times838)/(2\times1.95\times112)=1823$ nm;
$(838\times750)/(2\times1.95\times88)=1832$ nm: agreement to 0.5 percent
validates both the thickness and the assumed flat $n$; disagreement would
have flagged dispersion or misindexed fringe orders: the pair-consistency
check is the method's built-in audit.

**P19.20** It measures the p-to-s *ratio* on one beam: source drift, window
absorption and detector gain hit both polarizations identically and cancel.
Prevented: the lamp-ageing baseline errors that plague transmission.
Not prevented: model error: a wrong layer stack fits beautifully and lies:
immunity to noise is not immunity to assumption.

**P19.21** Fixed peak rules out mean-composition and uniform-strain shifts;
doubled width with fixed centre is fluctuation *about* the same mean: well
width or alloy clustering. Confirming: low-temperature PL (splits the
inhomogeneous envelope into localized lines) or TEM of the wells (module
33). The logic: position = mean, width = variance: moments of the same
distribution, separately diagnostic.

**P19.22** Raman's optical skin depth at the probe wavelength samples the
top fraction of a micrometre; X-ray penetrates the full stack. An amorphous
cap over crystalline underlayers satisfies both instruments: the
"contradiction" is a depth-profile disguised as a dispute: change the
probe wavelength (deeper) or glancing X-ray (shallower) and the layer
order falls out. Sampling volume is part of every technique's identity.

**P19.23** PDS counts all dissipated photons; CPM counts only those
yielding collected carriers. Divergence at low energy = absorption without
carrier collection: void surfaces, back-contact absorption, or deep states
that recombine geminate: module 40 reads the 5x as a void-rich network's
signature. Two instruments disagreeing by mechanism is a third instrument.

**P19.24** The $-0.98$ says the data constrain mainly the *product* (the
optical path $nd$): thickness up trades index down along a valley the
regression cannot see out of. One independent thickness (XRR, or a stylus
step) pins $d$ and collapses the valley. The quoted marginal errors assume
the other parameter known: along the valley floor the joint uncertainty is
far larger: which is why serious ellipsometry reports the correlation
matrix, and why "we fit it to three decimals" is, alone, a sentence to
audit rather than believe.
