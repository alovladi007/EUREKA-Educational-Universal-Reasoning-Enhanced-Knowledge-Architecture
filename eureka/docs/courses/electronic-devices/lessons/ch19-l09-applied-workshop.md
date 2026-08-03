# Module 19 Workshop: Three Problems Worked the Long Way

<!-- covers: 19.1, 19.2, 19.3, 19.4, 19.5 -->

Exam problems isolate one idea; real work arrives tangled. This workshop
runs three extended problems at full length: an unknown wafer identified
from raw data, a filter designed from a specification, and an in-line
monitor engineered around its own physics: each solved the slow, auditable
way, with the dead ends left in where they teach.

## Workshop 1: the unlabeled wafer

**The bundle.** A drawer yields an unlabeled, double-side polished wafer.
Bench data, one hour's work: visually grey, opaque; transmission zero
across 400 to 900 nm but 52 percent flat from 1.3 to 2.0 µm (uncoated,
both faces); a four-point probe reads 8.5 ohm-cm; single-side reflectance
at 633 nm is 35 percent; Raman shows one sharp line at 520 cm-1.

**Step 1: the window brackets the gap.** Opaque at 900 nm, transmitting at
1300 nm: the absorption edge sits between 0.95 and 1.35 µm... in energy,
between 0.92 and 1.31 eV. Table 1 candidates: silicon (1.12 eV) fits;
germanium (0.66) would transmit at 900 nm: excluded; GaAs (1.42) would be
transparent at 900 nm too: excluded. The window measurement alone
shortlists to one.

**Step 2: the index confirms.** Two-face incoherent transmission of a
lossless slab:

$$
T=\frac{1-R}{1+R}
\qquad\Rightarrow\qquad
R=\frac{1-T}{1+T}=\frac{0.48}{1.52}=0.316
$$

and inverting lesson 1's reflectance for $k\approx0$:

$$
n=\frac{1+\sqrt{R}}{1-\sqrt{R}}=\frac{1.562}{0.438}=3.57
$$

Table 1's silicon at 1.5 µm: 3.48: agreement to 2.5 percent (the residual:
our $T$ was read flat; real dispersion and a little free-carrier loss).
The 633 nm reflectance cross-checks: predicted from $n=3.88$ visible-range
silicon: $R=(2.88/4.88)^{2}=0.348$: measured 35 percent. Two independent
optical routes, one identity.

**Step 3: Raman seals the phase.** One sharp 520 cm-1 line: single-crystal
silicon, no amorphous 480 shoulder (lesson 4's assay). A polycrystal would
show the same line broadened; the linewidth (not recorded: the bench's
omission, noted for next time) would have graded crystalline quality.

**Step 4: the electrical column.** 8.5 ohm-cm: module 18's
resistivity-doping relation puts it near
$5\times10^{14}\ {\rm cm^{-3}}$ n-type or $1.5\times10^{15}$ p-type:
lightly doped either way: consistent with the clean infrared transmission
(lesson 3's free-carrier term at this doping:
$\alpha_{fc}\sim10^{-2}\ {\rm cm^{-1}}$: invisible across 675 µm). A hot
probe or Hall polarity (module 18) would finish the type; optically we are
done.

**Verdict and the meta-lesson.** Lightly doped single-crystal silicon,
double-side polished: an infrared window blank or test wafer. Four
instruments, forty minutes, every step cross-checked against another
lesson's number: identification is consilience, not one killer
measurement. And the honest gap in the record: no Raman linewidth, no
transmission dispersion: is itself the workshop's lesson: **write down the
whole spectrum, not the summary number, because tomorrow's question is
hiding in today's discarded curve.**

## Workshop 2: a bandpass filter from a purchase spec

**The specification.** Fluorescence instrument, excitation clean-up:
pass 470 to 490 nm with over 90 percent transmission; block 500 to 550 nm
by OD4 ($T\le10^{-4}$); substrate BK7-class glass; materials available:
TiO2-class ($n_H=2.35$) and SiO2-class ($n_L=1.46$).

**Step 1: architecture from the numbers.** OD4 blocking adjacent to a
90 percent passband, 3 percent away in wavelength: a single quarter-wave
stopband (lesson 6: 32 percent fractional width for this pair) is far too
broad and too shallow-skirted alone: the standard architecture is a
**Fabry-Perot bandpass**: two quarter-wave mirrors around a spacer, whose
passband sits inside the mirrors' stopband, plus blocking layers for the
out-of-band leaks.

**Step 2: size the mirrors from the blocking.** Off-resonance, the cavity
transmits roughly the two-mirror leakage; demanding $10^{-4}$ at 520 nm
needs mirror transmissions near $10^{-2}$ each: $R\approx0.99$: lesson 6's
worked arithmetic (recounted honestly in P19.26) prices that at **six
pairs** per mirror for this index pair.

**Step 3: the passband width from finesse.** With $R=0.99$,
$\mathcal{F}=\pi\sqrt{R}/(1-R)=312$. A first-order half-wave spacer
($m=1$... optical order 2): fractional linewidth
$\approx1/(m\pi/\delta...)$: using lesson 6's resolving relation,
$\Delta\lambda\approx\lambda/(2\mathcal{F})\approx0.8$ nm: **far too
narrow**: the spec wants a 20 nm passband, not a laser line. The dead end
teaches the real design move: broad, flat passbands come from **coupled
cavities**: several low-finesse cavities in series flatten and widen the
top (the multi-cavity interference filter, lesson 6's matrix algebra
iterated): and production filters of this spec use two to four coupled
cavities of moderate mirror count.

**Step 4: the redesign, sized honestly.** Per-cavity finesse for a 20 nm
top: $\mathcal{F}\approx\lambda/(2\Delta\lambda)\approx12$:
$R\approx0.78$: about two pairs per mirror; three coupled cavities
sharpen the skirts multiplicatively, and the OD4 at 520 nm is then met by
the *product* of three modest cavities rather than one heroic one:
roughly $10^{-1.5}$ each: with the count now near
3 cavities x (2+2 pairs +spacer) $\approx$ 27 layers plus blockers: a
standard commercial stack.

**Step 5: the tolerances that decide yield.** Passband centring to 2 nm at
480 nm is 0.4 percent in optical thickness: every layer's $nd$ held to a
few tenths of a percent: lesson 6's in-situ optical monitoring is not
optional; and the thermal shift of the finished filter,
$(1/n)(dn/dT)+\alpha_{\rm exp}$ summed over the stack (the capstone case
of lesson 5), lands near 5 to 10 ppm/K: 0.003 nm/K: negligible here,
*checked rather than assumed*.

**The meta-lesson.** The first architecture that satisfies the blocking
fails the bandwidth by a factor of twenty-five, and the fix is
architectural (coupled cavities), not incremental. Optical design iterates
between the spec's columns the same way module 17's system test did:
single-parameter heroics lose to balanced mediocrity in series.

## Workshop 3: an in-line thickness monitor that must not lie

**The task.** A production coater deposits the module's TCO at nominal
200 nm on glass, 60 wafers an hour. Engineering wants thickness to
$\pm2$ percent, in line, contactless, one second per wafer: choose and
harden the measurement.

**Step 1: candidate methods against the clock.** Ellipsometry: sensitive
but model-heavy (lesson 4's correlation trap) and slower to fit;
stylus: contact, off-line; XRR: too slow; **normal-incidence reflectance
spectroscopy**: one spectrum in milliseconds, fringes carry $nd$
(lesson 4's workhorse): selected.

**Step 2: does the film even fringe?** Optical thickness
$nd\approx1.9\times200=380$ nm: about $\lambda/2$ at 760 nm: exactly one
interference oscillation across the visible: marginal but sufficient: the
fringe *phase* at two wavelengths pins $nd$ without needing multiple
maxima. Thinner products would defeat the method: flagged as a limit of
applicability, in writing, before someone reuses the recipe on a 50 nm
run.

**Step 3: separate $n$ from $d$: or refuse to.** The spectrum measures
$nd$; the spec asks for $d$. Two honest routes: fix $n$ from a weekly
ellipsometric calibration (assuming process stability moves $d$, not $n$),
or report $nd$ and re-write the spec: and here the module's physics
decides: this film's index *moves with its doping* (lesson 3's
free-carrier index depression: the plasma edge shifting with carrier
density), and the doping is exactly what the process tunes. **Assuming
fixed $n$ would alias a doping drift into a false thickness alarm.** The
hardened design measures the near-infrared edge position in the same
spectrum (a second observable: lesson 3's contactless carrier density),
fits $(d,n_{\rm vis})$ jointly with the doping-index correlation built in,
and alarms separately on thickness and carrier density.

**Step 4: the audit loop.** Once a shift, one wafer to the ellipsometer
with XRR-pinned thickness (lesson 4's protocol): the in-line monitor is
calibrated against a traceable pair, and the correlation matrix of the
in-line fit is logged, not just the answers: when the correlation drifts
toward the $-0.99$ trap, the two observables have stopped separating and
the monitor says so instead of guessing.

**The meta-lesson.** A measurement is a model plus a maintenance
contract. The naive reflectometer would have worked for months and then
lied during the first deliberate doping change: precisely when
engineering most needed the truth. Designing the failure modes *in*: what
aliases into what, and which second observable breaks the alias: is the
difference between instrumentation and decoration.

## Workshop 4: the responsivity dispute

**The conflict.** A detector vendor certifies 0.62 A/W at 905 nm; the
customer's lab measures 0.53 and threatens rejection. Both instruments are
calibrated. Arbitrate with the module.

**Step 1: bound the physically possible.** Lesson 6 of module 17:
$R_\lambda=\eta\lambda/1.24$: at 905 nm the $\eta=1$ ceiling is 0.73 A/W.
Both numbers are legal; the dispute is 15 percent, and 15 percent is
exactly the scale of the effects this module catalogues: so enumerate
them.

**Step 2: the reflection term.** The vendor quotes with the AR coating's
design assumption; the lab measures at 8 degrees off normal through a
beam-splitter rig. An AR null at normal incidence degrades off-angle
(lesson 6's P19.29): a coating tuned to under 1 percent can return 4 to 6
percent at the lab's geometry: two to three points of the gap, attributable
and testable by re-measuring at normal incidence.

**Step 3: the edge term.** 905 nm sits on silicon's falling edge
(lesson 1's penetration figure: tens of micrometres of depth). The two
instruments' *temperatures* differ: vendor at 25 C, lab at 21 C: and the
edge redshifts 0.27 meV/K (supplement Table 2): a 4 K difference moves the
absorption depth enough to change collected fraction by a point or two in
a thin-depletion device. Testable: warm the lab stage 4 K and watch the
reading walk.

**Step 4: the spectral term.** The lab's "905 nm" LED source has a 30 nm
FWHM; the vendor used a laser. Averaging the steep responsivity slope
across 30 nm biases low by another few points (Jensen's inequality on a
convex-falling curve): the source's linewidth is part of the measurand.
Lesson 2's discipline: the derivative matters, here of $R_\lambda$ itself.

**Resolution.** Three named mechanisms, each a couple of points, each with
a one-hour discriminating test: the parties converge on a measurement
protocol (normal incidence, temperature-logged, laser source) rather than
a lawsuit. **The module's arbitration method: never argue the number;
enumerate the physics between the two setups and test each term.** The
same template settles most inter-lab optical disputes, which are almost
never about calibration and almost always about unstated conditions.

## Workshop 5: commissioning the instrument itself

**The task.** A refurbished spectrophotometer arrives for the module's
measurements. Before any sample data counts, the instrument must earn
trust. Design the validation suite from the module's own physics: no
certified standards budget, one afternoon.

**Check 1: wavelength scale from physics, not stickers.** A holmium-glass
standard costs money; a bare silicon wafer is free and its transmission
edge is a known landmark (with the temperature caveat of the supplement's
Table 2 applied: log the lab temperature). Sharper: the instrument's own
deuterium source line at 656.1 nm, if accessible, pins the scale to an
atomic constant. Two points a hundred nanometres apart expose both offset
and stretch.

**Check 2: photometric linearity by physics.** Two neutral filters
measured separately and then stacked must satisfy
$T_{12}=T_1T_2$ (within the interreflection correction, estimable from
their reflectances by lesson 1): any systematic excess flags detector
nonlinearity or stray light. Three filter pairs spanning three decades map
the linearity curve without a single certified artefact.

**Check 3: stray light at the worst place.** Measure a thick silicon
wafer's "transmission" at 500 nm: the true value is below $10^{-10}$
(lesson 1's edge), so anything the instrument reports there *is its own
stray light floor*, read directly. The sample doubles as a perfect
blocking standard: opaque materials are free OD-infinity references, and
knowing the floor decides which OD claims (lesson 5's specification
section) this instrument may ever adjudicate.

**Check 4: the fringe test for beam geometry.** A double-side polished
thin substrate should show etalon fringes at the contrast lesson 6
predicts from its index; washed-out fringes reveal the beam's angular
spread or incoherence: not a defect for some work, fatal for film
metrology: measured, not assumed, in one scan.

**Check 5: polarization hygiene.** Rotate a polarizer in the beam at a
steep-incidence accessory: residual instrument polarization shows as a
$\cos^{2}$ modulation. Lesson 4's ellipsometric thinking applied to a
"non-polarizing" instrument: every monochromator polarizes somewhat, and
quantifying it decides whether the Brewster-angle measurements of this
module are trustworthy on this bench.

**The commissioning report.** Five checks, each traceable to a boxed
result of the module, each yielding a number (scale offset, linearity
bound, stray floor, angular spread, polarization residue) that becomes the
instrument's condition sheet: the data-book discipline of module 17,
applied to the meter instead of the material. An instrument without a
condition sheet is a sample of unknown provenance that happens to output
numbers: and the module's last worked lesson is that the auditor's chair
faces both ways.

## Common errors clinic

Collected from the module's problem sets, the five mistakes that recur and
the reflex that prevents each:

1. **Field-intensity factor slips**: $\alpha=4\pi k/\lambda$, not
   $2\pi k/\lambda$: intensity decays twice as fast as field
   (supplement, section 2). Reflex: derive once per project, cache the
   box.
2. **Tail points inside a Tauc fit**: the Urbach region bends the
   extrapolation and shifts gaps tens of meV (lesson 3's worked example).
   Reflex: plot semilog first; fit only above the exponential's knee.
3. **"Small k" at large thickness**: germanium's window problem, the
   IR-etalon exam item. Reflex: always form $\alpha d$ before judging any
   $k$.
4. **One-wavelength indices in dispersion problems**: fibre budgets built
   on $n$ instead of $n_g$ (lesson 2). Reflex: information travels at the
   derivative.
5. **Trusting a fit's marginal error bars**: the ellipsometric valley
   (lesson 4's P19.24, workshop 3's alias). Reflex: ask for the
   correlation matrix; if refused, treat the third decimal as fiction.

Each is a one-line habit; together they are most of what separates a
measurement report this module would sign from one it would audit.

## How these workshops were built, and how to build your own

The construction rule, stated because it is course content: each workshop
began from a *decision* (accept the wafer, sign the purchase order, trust
the monitor, settle the dispute, commission the meter) and worked backward
to the minimum set of module results that force the decision. That is the
inverse of textbook order, and it is the order in which working engineers
actually meet physics: decision first, derivation on demand.

To build your own from any module of this course: pick a decision your
work actually faces; list the module's boxed results; strike the ones that
cannot change the decision; and for each survivor, write the two-line
calculation connecting it to the choice. What remains is a workshop, and
the striking step is where the learning lives: knowing which correct
physics is *irrelevant* to a decision is rarer and more valuable than
knowing the physics. The five workshops above struck, among others, the
fractional quantum Hall effect, Lyddane-Sachs-Teller, and the entire
emission lesson: all true, all beside these five points: and every one of
them decisive in some other workshop not yet written.

A final calibration on effort: each workshop above compresses one to three
hours of real bench-and-desk work into a page. Running one per module of
the depth programme, on your own problems, converts this course from read
material into working capital at a rate no amount of additional reading
matches: which is why the programme's remaining modules will each close
with the same invitation.

## Closing the module

Module 19 equipped one probe: light: with its full grammar: two bound
constants, mechanisms per spectral region, instruments per floor, stacks
as synthesized materials, emission as absorption reversed, and selection
as a truce among walls. The growth-and-characterization arc ahead
(modules 28 to 36) will lean on it constantly: every epitaxial reactor
ends in an optical monitor, every wafer meets an ellipsometer before a
probe card: and the depth programme's next stop, module 20, takes the
same discipline into magnetism, where the response is hysteretic, the
"constants" are loops, and the audit habits transfer intact.
