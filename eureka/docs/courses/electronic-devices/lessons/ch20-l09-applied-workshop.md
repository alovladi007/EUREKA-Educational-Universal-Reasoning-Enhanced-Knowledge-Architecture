# Module 20 Workshop: Three Problems Worked the Long Way

<!-- covers: 20.1, 20.2, 20.3 -->

The course's workshop format: real tasks, worked at full length with the
dead ends left in, because the dead ends are where the module's concepts
earn their keep. Three sessions — a materials identification, a stack
diagnosis, and a retention audit — each ending with the error that a
first-pass analysis usually makes.

**Level.** Integrative practice; assumes lessons 1 to 8.

## Workshop 1 — identify the mystery core

*Task.* An unlabeled toroidal core from a legacy power supply must be
re-sourced. Available: a signal generator, a scope, two windings, a scale
and a caliper.

*Work.* Mass and volume give density 4.9 g/cm³ — immediately informative:
metals (7.6–8.9) are excluded; ferrites (4.5–5.3) fit. The loop test:
drive the primary and integrate the secondary voltage to trace $B$–$H$.
Measured: $\mu_i \approx 2200$ at 10 kHz, loop thin, saturation near
0.45 T. Snoek's rule cross-checks the family:

$$
(\mu_i - 1)\,f_{res} \approx 3\times10^{9}\ {\rm Hz}
\;\Rightarrow\; f_{res} \approx 1.4\ {\rm MHz},
$$

so this core rolls off in the low-MHz range: a MnZn power ferrite, not a
NiZn. Frequency-sweeping the inductance confirms the predicted rolloff
near 1.5 MHz. Replacement: any MnZn power grade with matching $\mu_i$,
saturation and loss density at the operating point.

*The usual error.* Quoting the measured $\mu_i$ without its conditions.
At 100 mT drive the same core measures an *amplitude* permeability nearly
double the initial value; a buyer matching the wrong number gets a part
that saturates early. Lesson 7's first audit rule, encountered in the
wild.

## Workshop 2 — the sensor that reads backwards

*Task.* A batch of GMR field sensors inverts its output after a board
rework that involved a wave-solder pass. Diagnose and disposition.

*Work.* An inverted response means the *reference* direction flipped: the
free layer still follows the field, but resistance now falls where it
rose. The suspect is exchange bias. Wave solder holds the board near
260 °C — read the stack: IrMn pinning, blocking temperature ~250 °C.
The pass unfroze the antiferromagnet; whatever field was present as it
cooled — here, the stray field of a neighbouring transformer, opposing
the original set direction — re-pinned the reference the wrong way.
Sanity-check the energetics with the bias formula:

$$
H_{eb} = \frac{\sigma_{eb}}{\mu_0 M_s t_F}
\approx \frac{2\times10^{-4}}
{(4\pi\times10^{-7})(10^{6})(5\times10^{-9})} \approx 32\ {\rm kA/m},
$$

unchanged in magnitude — consistent with a clean flip rather than
degradation, which matches the symptom: full signal, wrong sign.
Disposition: re-anneal at 280 °C in a saturating field along the correct
axis and cool — the same field-cool that manufactured the bias resets it
(capstone X20.8's mechanism). Process fix: keep magnetics below $T_B$
during rework, or fixture a bias magnet during any excursion.

*The usual error.* Concluding "damaged sensor, scrap the batch." The
failure is a *setting*, not a defect — the distinction between intrinsic
and extrinsic properties (lesson 7's second audit rule) is worth an
entire production lot.

## Workshop 3 — the retention audit

*Task.* A vendor claims ten-year retention for an MRAM macro at 125 °C.
The datasheet shows $\Delta = 62$ *measured at 25 °C*. Audit the claim.

*Work.* Two corrections stack against the headline number. First,
temperature enters the denominator of $\Delta = K_{\rm eff}V/k_BT$
directly: 398 K versus 298 K scales $\Delta$ by 298/398 even if
$K_{\rm eff}$ held constant. It does not — PMA's interface anisotropy
falls with temperature roughly as $M_s^{2.1}$-ish scaling; take a
representative 20% loss of $K_{\rm eff}$ at 125 °C. Combined:

$$
\Delta(398\ {\rm K}) \approx 62 \times \frac{298}{398}\times0.8 \approx 37.
$$

Mean flip time $\tau = \tau_0e^{\Delta} = 10^{-9}e^{37} \approx 10^{7}$ s
— about four months, not ten years, for a *single average bit*. Second,
the fleet statistics (lesson 3 section 5): a 16 Mb macro needs
$NP_{\rm flip}$ small, demanding roughly

$$
\Delta \gtrsim \ln\!\left(\frac{N\,t}{\tau_0}\right)
= \ln\!\left(\frac{(1.6\times10^{7})(3.15\times10^{8})}{10^{-9}}\right)
\approx 78
$$

at the operating temperature. The audited gap is enormous: 37 delivered
against 78 required. Either the vendor's claim silently assumes ECC plus
scrubbing (which converts retention into an error-*rate* budget — a
legitimate but different claim), or the 125 °C figure is unsupported.
The follow-up question for the vendor is therefore precise: "state
$\Delta$ at 125 °C and the assumed scrub interval."

*The usual error.* Auditing the exponential but not the *population*:
a $\Delta$ that holds one bit for a decade loses a megabit array in
weeks. The mean-versus-fleet displacement — lesson 3, lesson 6, and
module 21's yield statistics — is the single most transferable habit
this module teaches.

## Closing: the module in one habit

Each workshop reduced to the same move: find the energy ratio the
situation actually depends on — drive amplitude against anisotropy,
thermal energy against blocking, barrier against fleet-scaled
observation time — and refuse any number quoted without its conditions.
That habit, more than any formula, is what transfers to module 21's
defects and beyond.
