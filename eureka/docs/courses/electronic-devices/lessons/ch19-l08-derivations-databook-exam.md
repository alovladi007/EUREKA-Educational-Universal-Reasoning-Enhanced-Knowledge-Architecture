# Module 19 Supplement: Derivations, Data Book, and Comprehensive Exam

<!-- covers: 19.1, 19.2, 19.3, 19.4, 19.5 -->

The module's postponed proofs, its working data, and its exam. As in module
17's supplement, each derivation is short, examinable, and the source of a
formula used earlier as a result.

## 1. Fresnel from the boundary conditions

At an interface, Maxwell demands continuity of the tangential $E$ and $H$.
For s-polarization at incidence $\theta_0$ into media $n_0,n_1$:

$$
E_0+E_r=E_t,
\qquad
n_0\cos\theta_0\,(E_0-E_r)=n_1\cos\theta_1\,E_t
$$

Eliminate $E_t$:

$$
\boxed{\;r_s=\frac{n_0\cos\theta_0-n_1\cos\theta_1}
{n_0\cos\theta_0+n_1\cos\theta_1}\;}
$$

and the p-case swaps the cosine pairing, whose zero is Brewster's angle
(lesson 1's P19.6). At normal incidence both collapse to
$r=(n_0-n_1)/(n_0+n_1)$: the reflectance formula of lesson 1, now earned.
Every stack of lesson 6 is these two lines iterated; nothing else enters.

## 2. Beer-Lambert from the wave equation

Insert $\tilde N=n-ik$ into the plane wave:

$$
E=E_0\,e^{i\omega(\tilde Nz/c-t)}
=E_0\,e^{i\omega(nz/c-t)}\,e^{-\omega kz/c}
$$

Intensity is $|E|^{2}$:

$$
I=I_0\,e^{-2\omega kz/c}=I_0e^{-\alpha z},
\qquad
\alpha=\frac{2\omega k}{c}=\frac{4\pi k}{\lambda}
$$

: the lesson 1 box in three lines, and the factor-of-two between field and
intensity decay made explicit, because losing it is the classic error in
loss budgets.

## 3. Lyddane-Sachs-Teller in four lines

The phonon dielectric function of lesson 3, at its two ends:
$\varepsilon(0)=\varepsilon_\infty\,\omega_{LO}^{2}/\omega_{TO}^{2}$
(set $\omega=0$), and $\varepsilon(\infty)=\varepsilon_\infty$ by
construction. Divide:

$$
\boxed{\;\frac{\varepsilon(0)}{\varepsilon_\infty}
=\frac{\omega_{LO}^{2}}{\omega_{TO}^{2}}\;}
$$

The relation's power is its freedom from oscillator details: any polar
crystal's static and optical dielectric constants fix the ratio of its
phonon frequencies, and lesson 3's P19.17 used it as a spectrometer.

## 4. Rayleigh's fourth power

A subwavelength fluctuation of polarizability radiates as a dipole. The
radiated power of an oscillating dipole scales as $\omega^{4}$ (two time
derivatives of the dipole moment, squared), so with driving amplitude set
by the incident field,

$$
\alpha_{\rm scatt}\ \propto\ \omega^{4}\ \propto\ \frac{1}{\lambda^{4}}
$$

: the fibre-loss floor of lesson 5, the blue of the sky, and the reason
telecom migrated to the longest wavelength silica's multiphonon wall
allows: one exponent, three phenomena, and the derivation is one sentence
about dipole radiation.

## 5. The exciton as scaled hydrogen

Coulomb binding in a dielectric with effective masses maps onto hydrogen by
substituting $e^{2}\to e^{2}/\varepsilon_r$ and $m_0\to\mu^{*}$:

$$
E_X=13.6\ {\rm eV}\times\frac{\mu^{*}/m_0}{\varepsilon_r^{2}},
\qquad
a_X=0.053\ {\rm nm}\times\frac{\varepsilon_r}{\mu^{*}/m_0}
$$

The scaling explains the family portrait in one glance: III-V bulk
(screened, light: meV binding, invisible warm), nitrides (marginal), 2D and
organic (unscreened: hundreds of meV, optics-dominating): lesson 3's
figure and module 52's architecture, one substitution apart.

## 6. Kramers-Kronig, the two-line sketch

The response function $\chi(t)$ vanishes for $t<0$ (causality). Its Fourier
transform is therefore analytic in the upper half-plane, and Cauchy's
theorem applied along the real axis with a principal-value detour yields

$$
\chi_1(\omega)=\frac{1}{\pi}\,\mathcal{P}\!\int
\frac{\chi_2(\omega')}{\omega'-\omega}\,d\omega'
$$

: the dispersion relation of lesson 1. The physics content is exactly one
word, "causality"; everything else is contour integration: which is why
the relation survives every material detail and audits all of them.

## 7. The module data book

Optical constants at standard wavelengths (300 K, representative published
values: facts; films differ per lesson 4's porosity caveat).

**Table 1: n and k at working wavelengths.**

| material | 550 nm | 1310 nm | 10.6 um | window (um) |
|---|---|---|---|---|
| fused silica | 1.460, ~0 | 1.447, ~0 | absorbing | 0.18 - 3.5 |
| Si | 4.08, 0.028 | 3.50, ~0 | 3.42, ~0 | 1.1 - 9 |
| Ge | 5.2, 2.3 | 4.35, ~0* | 4.00, ~0 | 1.8 - 15 |
| GaAs | 3.86, 0.20 | 3.40, ~0 | 3.27, ~0 | 0.9 - 17 |
| GaN | 2.39, ~0 | 2.32, ~0 | absorbing | 0.37 - 7 |
| ZnSe | 2.68, ~0 | 2.46, ~0 | 2.40, ~0 | 0.5 - 20 |
| degenerate oxide (TCO) | ~1.9, small | metallic side | reflecting | visible only |

*Ge at 1310 nm sits just past its edge: lesson 1's P19.1 showed how "~0"
at a millimetre is not zero: the table's tilde is a warning, not a value.

**Table 2: the change coefficients** (per K): $dn/dT$: silica
$+1.0\times10^{-5}$, Si $+1.8\times10^{-4}$, GaAs $+2.5\times10^{-4}$,
ZnSe $+6\times10^{-5}$; gap shifts $dE_g/dT$: Si $-0.27$ meV/K, GaAs
$-0.45$ meV/K, GaN $-0.45$ meV/K. The pairing to remember: semiconductors
move both their index *and* their edge with temperature; glasses move only
the index, and twenty times less: why glass optics are the stable half of
any hybrid system.

**Table 3: the sensitivity ladder** (lesson 4's figure in numbers):
transmission on films floors near $10^{2}\ {\rm cm^{-1}}$; ellipsometric
$k$-fits similar; PDS and CPM $10^{-1}$; bulk cavity methods $10^{-6}$:
choose the method after the expected $\alpha$, not before.

### Worked example 7.1 — the data book in anger

Select the window and AR strategy for a 1310 nm instrument port that also
must pass visible alignment light. Silica: passes both, $n=1.45$:
4 percent per face uncoated: single MgF2-class layer suffices. Silicon:
blocks the visible: fails the alignment requirement outright despite
superb 1310 behaviour. ZnSe: passes both but $n=2.46$: 18 percent per
face: needs serious coating and costs more. Verdict: silica, one line per
candidate, all from Table 1: what a data book is for, and the visible
requirement, not the design wavelength, did the deciding: the binding
constraint arrives from the side, as usual.

## 8. Comprehensive exam

Constants: Module C plus the tables above. (G) marks graduate tier.

**X19.9** Derive the normal-incidence reflectance of germanium at 10.6 µm
from Table 1, then the round-trip loss of an uncoated 2 mm Ge etalon
including two surfaces.

**X19.10** A quarter-wave AR of ZnS ($n=2.2$) is deposited on Ge for
10.6 µm. Give the thickness and residual reflectance, and the better
two-material strategy.

**X19.11** From Table 2, compute how far silicon's 1.12 eV edge moves from
25 C to 125 C in nanometres, and state one system in this course that must
budget for it.

**X19.12** An LED datasheet claims spectrum FWHM of 0.9 kT at 300 K.
Audit with lesson 7's theorem.

**X19.13** A fibre's measured loss is 0.35 dB/km at 1310 and 0.19 at 1550.
Assuming Rayleigh dominance, predict 1310 from 1550 and interpret the
excess.

**X19.14** (G) A vendor's "athermal" interferometer pairs silicon
waveguides with an overclad whose $dn/dT$ is negative. Using Table 2,
estimate the required overclad coefficient for first-order athermality if
the mode is 70 percent in silicon, and comment on feasibility.

**X19.15** (G) Show from the ABC model that at low drive EL efficiency
rises linearly with current, and identify what a *sublinear* low-drive
rise diagnoses.

**X19.16** (G) Synthesis. Using only module-19 tools, outline the complete
optical characterisation you would order for module 41's next
microcrystalline silicon batch, one line of justification each.

### Exam answers

**X19.9** $R=((4.00-1)/(4.00+1))^{2}=(3/5)^{2}=0.36$ per face. Etalon
round trip: two transits, four surface encounters in reflection terms:
single-pass transmission through two faces
$=(1-0.36)^{2}=0.41$: 59 percent gone before any bulk loss: germanium
optics without AR coatings are paperweights: Table 1's high-index rows all
carry this implicit coating bill.

**X19.10** $d=10.6/(4\times2.2)=1.20\ {\rm \mu m}$. Residual:
$R=((n_c^{2}-n_s)/(n_c^{2}+n_s))^{2}=((4.84-4.00)/(8.84))^{2}
=0.009$: 0.9 percent: excellent. Better still: the exact match needs
$n_c=\sqrt{4.00}=2.0$: a two-layer design bracketing 2.0 with available
indices (ZnS high, a fluoride low) nulls over a wider band: lesson 6's
matrix algebra, applied where Table 1's materials actually live.

**X19.11** $\Delta E_g=-0.27\times100=-27$ meV: edge from 1107 to
1134 nm: $\lambda=1240/E$: 27 nm of red shift. System: silicon photonics'
Ge detectors and any near-edge silicon sensor: responsivity at a fixed
1310 nm laser changes with chip temperature as the edge approaches:
detector calibration tables are Varshni in disguise (lesson 7's pyrometer
made the same point in emission).

**X19.12** Theorem: thermal-broadened edge emission has FWHM
$\approx1.8\,k_BT$; 0.9 kT is half the thermodynamic floor: impossible for
a simple LED at 300 K. Honest readings: the spectrum is filtered
(cavity/phosphor line), the "FWHM" is misquoted, or the junction is far
colder than claimed. A one-number audit catching a datasheet: the module's
recurring sport, and the theorem's first field use.

**X19.13** Rayleigh: $\alpha\propto\lambda^{-4}$:
$0.19\times(1550/1310)^{4}=0.19\times1.96=0.37$ dB/km predicted at 1310:
measured 0.35: the windows are *both* essentially at the Rayleigh floor,
with the small deficit inside measurement and waveguide-contribution
noise. Interpretation: purification is complete; further loss reduction
requires changing the glass (the fluoride-fibre dream) not cleaning it:
lesson 5's intrinsic-versus-preparational verdict, delivered by an
exponent.

**X19.14** Athermal: $0.7\,(dn/dT)_{\rm Si}+0.3\,(dn/dT)_{\rm clad}=0$:
$(dn/dT)_{\rm clad}=-0.7\times1.8\times10^{-4}/0.3=-4.2\times10^{-4}$/K.
Available negative-coefficient polymers reach about $-1$ to
$-3\times10^{-4}$: feasibility is marginal: real designs also shrink the
silicon confinement factor. The estimate shows both the trick and its
strain in one weighted average: and why "athermal" datasheets deserve the
confinement-factor question.

**X19.15** Low drive: $n$ small: $\eta\approx Bn^{2}/An=Bn/A\propto n$:
and since $J\propto An$ there, $\eta\propto J$: linear rise, as claimed.
A *sublinear* rise flags an $A$ that grows as carriers spread into
defective regions or leak past the wells: drive-dependent SRH: the
curve's low end is a defect spectrometer just as its high end (droop) is
an Auger one: one rational function, two diagnostics.

**X19.16** (1) Transmission with fringes: thickness and gross edge
(lesson 4 section 1): rejects wrong-thickness runs in minutes.
(2) Raman 480/520 decomposition: crystalline fraction, the batch's
defining number (lesson 4 section 4). (3) Ellipsometry with an XRR-pinned
thickness: porosity via index deficit (lesson 4's audit rules).
(4) CPM plus PDS sub-gap pair: defect density and the void signature from
their divergence (lesson 4 section 5): module 40's quality axis.
(5) PL only as a cheap check: weak edge emission expected: its
*presence* at strength would flag unexpected crystallinity. Order:
cheapest and fastest first, every number with wavelength-temperature
context, agreement across techniques as the acceptance criterion: the
module's method, compressed to a checklist a technician can run.

## 8a. A one-page revision map of module 19

Twelve results carry the module; reconstructing each with its validity
conditions is the mastery criterion.

1. $\tilde N=n-ik$, $\alpha=4\pi k/\lambda$: two constants, one wave, the
   field-versus-intensity factor of two explicit.
2. $R=((n-1)^{2}+k^{2})/((n+1)^{2}+k^{2})$ and its Fresnel parents:
   every interface announces the index.
3. Kramers-Kronig and the f-sum rule: causality's audit pair.
4. The Lorentz oscillator: all spectra as sums of one shape; Drude as its
   zero-frequency limit, bridging module 18.
5. Sellmeier and $n_g=n-\lambda\,dn/d\lambda$: dispersion parameterised,
   and information travelling at the derivative.
6. Tauc's two exponents and the Urbach slope: gaps extracted honestly,
   disorder read as a slope.
7. Free-carrier absorption $\propto n\lambda^{2}$ and the plasma edge:
   doping as an optical variable, module 56's design box.
8. Reststrahlen with Lyddane-Sachs-Teller: the lattice's mirror band and
   its four-number spectroscopy.
9. The Airy film, quarter-wave transformer, and the stack matrix:
   interference as a manufacturable material.
10. Finesse, stopbands, and the $4n^{2}$ trapping bound: cavities and
    their limits.
11. Kirchhoff, Planck weighting, the ABC efficiency function, and
    etendue: emission's bookkeeping and its vetoes.
12. The instrument floors and the correlation trap: extraction as part of
    the quantity.

The map's grammar mirrors module 18's: items 1 to 4 are one causal object
elaborated, 5 to 8 are mechanisms per spectral region, 9 and 10 are
geometry compounding the constants, 11 and 12 are the two directions of
measurement: four ideas, not twelve formulas, for long-term memory: and
each item, per the closing veto list, is carried for what it can refuse.

## 8b. Oral examination prompts

Six viva prompts with model answers in brief, testing judgement over
recall.

**O1. "Why can't I have a high-index, perfectly transparent coating?"**
Model: Kramers-Kronig: index above one is the causal shadow of absorption
somewhere; engineering means parking the loss outside the band of use, and
a claim without a stated band is a claim against causality.

**O2. "My film's Tauc gap and its PL peak disagree by 80 meV. Which is
wrong?"** Model: possibly neither: Tauc extrapolates the extended-state
edge while PL emits from the tail's bottom and excitons; in disordered
films an 80 meV Stokes-type offset is the *Urbach physics itself*. The
pair's difference is a disorder measurement, not an error: report both
with mechanisms.

**O3. "Defend measuring at Brewster's angle."** Model: sensitivity of the
p-s ratio peaks where $r_p$ dives; ellipsometry is a ratio instrument, so
work where the ratio moves fastest: geometry is gain.

**O4. "The etendue theorem in one sentence, and one purchase it stopped."**
Model: no optic increases radiance, so source area-times-angle bounds
every coupling; it stopped the LED-into-single-mode-fibre proposal at the
first meeting: worked example 3.1 of the emission lesson, in the field.

**O5. "When is a fringe a signal and when a nuisance?"** Model: when its
spacing is the measurand (film metrology, cavity filters) it is the
signal; when it rides uninvited on a spectrum (etalon effects in
substrates, windows) it is systematic error: same Airy physics, opposite
bookkeeping: and the cure for the nuisance (wedge, index-matching,
incoherence) is chosen from the same equation.

**O6. "Which single number from this module goes into your
due-diligence kit?"** Strong choices: $\alpha=4\pi k/\lambda$ (the
k-at-thickness trap), $4n^{2}$ (the light-trapping bound any absorber
claim must respect), or $1.8\,k_BT$ (the emission linewidth floor).
Credit for any, with its veto stated: the module grades numbers by what
they can refuse.

## 9. The module's veto list

Each boxed result, with the claim it kills: Kramers-Kronig vetoes
"high index, no absorption anywhere"; the f-sum rule vetoes "arbitrarily
strong response from fixed electrons"; Beer-Lambert's factor pair vetoes
"small k, thick part, no loss"; the Tauc exponents veto gap claims made
with the wrong plot; the Urbach slope vetoes "sharp edge" claims from
disordered films; the plasma edge vetoes "transparent conductor at any
doping"; etendue vetoes "brighter than the source"; Kirchhoff and
detailed balance veto absorption-emission mismatches; and the correlation
matrix vetoes three-decimal ellipsometry. Module 20 next: magnetism,
where the same discipline meets hysteresis: and the veto habit, by now,
needs no introduction.
