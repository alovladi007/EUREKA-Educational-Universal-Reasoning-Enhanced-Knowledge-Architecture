# Spin Transport: Two Currents, Giant Magnetoresistance and the Tunnel Junction

<!-- covers: 20.3 -->

Spintronics begins with one observation: in a ferromagnet, the two spin
populations conduct *differently*. Lesson 1's Stoner splitting left the
spin-up and spin-down bands with different densities of states at the Fermi
level, so the two spin channels scatter at different rates and carry
different currents. Everything in this lesson — the giant magnetoresistance
that won a Nobel prize nine years after shipping in a disk drive, and the
tunnel junctions that replaced it — is the systematic exploitation of that
asymmetry.

**Level.** Sections 1 to 4 undergraduate core; section 5 graduate; section 6
problems.

## 1. The two-current model

At temperatures well below $T_C$, spin-flip scattering is rare: an electron
keeps its spin over many collisions (the **spin diffusion length**, tens of
nanometres in metals). Conduction therefore proceeds through two nearly
independent channels in parallel — Mott's two-current model — each with its
own resistivity $\rho_\uparrow$, $\rho_\downarrow$, summarized by the
asymmetry

$$
\alpha = \frac{\rho_\downarrow}{\rho_\uparrow},
$$

which reaches 5–10 in the classic ferromagnets and their alloys. The
asymmetry has a clean band explanation: a conduction electron whose spin
matches the minority 3d band has abundant empty d-states to scatter into
(module 18's density-of-states argument for scattering rates), while its
opposite-spin twin does not. One species of electron simply has a worse
commute.

## 2. GMR: resistance you can switch

Now laminate: ferromagnet / normal spacer / ferromagnet, thinner than the
spin diffusion length, with the two magnetizations switchable between
parallel (P) and antiparallel (AP) — by field, or by lesson 4's RKKY
coupling. An electron crossing the stack samples both magnetic layers
before losing its spin memory, and the resistor algebra does the rest.

In P alignment, one spin channel is well-treated in *both* layers (fast
lane), the other poorly treated in both (slow lane): the fast lane shorts
the stack. In AP alignment every electron is well-treated in one layer and
badly in the other: no fast lane exists. With unit up-spin resistivity and
$r_\uparrow = 1, r_\downarrow = \alpha$ per layer, the parallel-channel
sums give

$$
R_P = \frac{2\alpha}{1+\alpha}, \qquad
R_{AP} = \frac{1+\alpha}{2},
$$

and the **giant magnetoresistance ratio**

$$
\frac{\Delta R}{R_P} = \frac{R_{AP}-R_P}{R_P} = \frac{(\alpha-1)^2}{4\alpha}.
$$

![GMR ratio against the spin asymmetry from the two-current resistor model: quadratic near unity, so modest scattering asymmetries produce dramatic resistance switching.](/courses/electronic-devices/figures/m20-two-current.svg)

The formula's message is its numerator: $(\alpha-1)^2$. No asymmetry, no
effect — GMR is manufactured *entirely* from spin-dependent scattering, and
grows quadratically as the channels differentiate. With $\alpha = 5$ the
model gives 80%; real multilayers at low temperature exceeded 100%, and
even the few-percent room-temperature device versions were transformative,
because the incumbent (anisotropic magnetoresistance) offered barely 2%.

The practical embodiment is lesson 4's stack put to work — the **spin
valve**: one layer pinned by exchange bias, one free layer soft enough to
follow a small external field, a copper spacer between:

![Computed spin-valve transfer curve: the free layer switches near zero field, the pinned reference far away, and the resistance is high in the antiparallel window between them.](/courses/electronic-devices/figures/m20-spin-valve.svg)

A read head flying over a disk sees the medium's fringing fields flip the
free layer and reads bits as resistance. GMR heads shipped in 1997, took
areal density through its steepest historical climb, and put a quantum
transport effect discovered nine years earlier into a consumer product —
the fastest lab-to-product path in this course, and the standard case study
for why interface physics (lesson 4's stack toolkit) is an industrial
competence.

### Worked example 2.1 — reading the model honestly

A spin valve measures $R_P = 20.0\ \Omega$, $R_{AP} = 21.6\ \Omega$: GMR
$= 8\%$. What effective $\alpha$ does the two-current model infer?
Solve $(\alpha-1)^2/4\alpha = 0.08$: $\alpha^2 - 2.32\alpha + 1 = 0$,
$\alpha \approx 1.75$. But bulk CoFe has $\alpha \approx 5$. The gap is the
model teaching its own limits: the two-current formula assumes every
electron samples both layers and nothing else. Real devices add
spin-independent resistance (leads, spacer), interface scattering that
differs from bulk, and shunting through the spacer — all diluting the
ratio. The inferred $\alpha$ is an *effective stack parameter*, useful for
comparing process lots, not a bulk material property. The same
model-versus-artifact discipline module 19 demanded of ellipsometry applies
verbatim.

## 3. TMR: replace the spacer with a barrier

Substitute the metallic spacer with two nanometres of insulator and let
electrons *tunnel*. Tunneling conserves spin, and its rate is proportional
to the density of initial states on one side times final states on the
other — so each electrode's spin polarization at the Fermi level,

$$
P = \frac{g_\uparrow(E_F) - g_\downarrow(E_F)}{g_\uparrow(E_F) + g_\downarrow(E_F)},
$$

enters multiplicatively. Counting both channels in both alignments gives
**Julliere's formula** for the tunnel magnetoresistance:

$$
{\rm TMR} = \frac{R_{AP}-R_P}{R_P} = \frac{2P_1P_2}{1-P_1P_2}.
$$

![Julliere tunnel magnetoresistance against electrode polarization, for matched electrodes and for one electrode fixed at one half: the divergence toward full polarization is the incentive behind half-metal and coherent-barrier research.](/courses/electronic-devices/figures/m20-julliere.svg)

With ordinary electrodes ($P \approx 0.4$–0.5) Julliere predicts tens of
percent, and aluminum-oxide junctions delivered exactly that. The revolution
was the **crystalline MgO barrier** (2004): in an epitaxial
CoFeB/MgO/CoFeB junction the barrier acts as a *symmetry filter* —
electron states of one orbital symmetry decay far more slowly through the
MgO than all others, and that channel exists only in the majority-spin band.
The barrier manufactures an effective polarization near unity that the
electrodes alone do not possess, and room-temperature TMR jumped from tens
to hundreds of percent. Note what kind of advance this was: not a better
ferromagnet, but a *quantum-coherence-engineered insulator* — the module's
clearest example of a material doing computation on the states passing
through it.

The magnetic tunnel junction (MTJ) so built is the universal cell of
modern spintronics: read heads since ~2005, every MRAM bit (lesson 6), and
a growing family of magnetic field sensors. Its engineering figure of
merit, the **resistance-area product** ($RA$), is set exponentially by
barrier thickness — the same tunneling exponential this course met in gate
leakage (module 12) — so sub-angstrom thickness control across a wafer is,
once again, the difference between a product and a scrap lot.

### Worked example 3.1 — polarizations from a measured TMR

An AlOx-barrier MTJ with identical electrodes shows TMR = 50%. Julliere:
$0.5 = 2P^2/(1-P^2)$ gives $P^2 = 0.2$, $P = 0.45$ — consistent with the
electrodes' independently measured polarization. An MgO junction with the
*same electrodes* shows TMR = 250%: the same inversion returns an
"effective $P$" of 0.75, exceeding what the electrode metal possesses.
Julliere has become a bookkeeping device — the excess is the barrier's
symmetry filtering, and quoting "$P$" from an MgO junction without saying
so conflates a material property with a stack property. Definitional
hygiene, the course's oldest audit rule, now applied to quantum tunneling.

## 4. The sensor family portrait

Three magnetoresistances now sit in the toolbox, and choosing one is a
budget exercise. **AMR** (module 18's anisotropic effect): ~2%, simplest
films, still standard in automotive angle sensors for its robustness.
**GMR**: ~5–15% in device form, metallic (low $RA$), current-in-plane
geometries cheap to integrate; the choice for mid-performance field
sensing. **TMR**: 100%+, largest signal and highest impedance — best
signal-to-noise per micron squared, now the default for read heads,
industrial encoders and low-field sensing, at the price of a tunnel
barrier's fabrication tolerance and electrostatic-discharge fragility. The
selection matrix is module 17's cost-of-ownership reasoning transplanted:
signal size against process complexity against failure modes, with the
answer depending on which the application can least afford.

## 4b. Currents without magnets: the spin Hall effect

One more transport effect completes the toolkit, and it needs no
ferromagnet at all. In a heavy metal with strong spin-orbit coupling —
platinum, tantalum, tungsten — an ordinary charge current deflects the two
spin species toward *opposite* faces of the wire, the same left/right
sorting a Hall field performs on charge, executed by spin-orbit scattering
instead of a magnetic field. A charge current density $j_c$ thus generates
a transverse **spin current**

$$
j_s = \theta_{SH}\,\frac{\hbar}{2e}\,j_c,
$$

with the **spin Hall angle** $\theta_{SH}$ (0.05–0.3 in the useful metals,
sign included: platinum and tantalum deflect opposite ways) measuring the
conversion efficiency. The inverse effect runs equally well: a spin
current injected into the heavy metal produces a measurable transverse
*voltage*, which is how pure spin currents — including lesson 5's
accumulation-driven ones — are detected electrically.

Two consequences make this section load-bearing rather than ornamental.
First, it supplies lesson 6's second write mechanism: a charge current
flowing *in the plane* of a heavy-metal strip delivers a vertical spin
current into a magnetic layer on top of it — torque without any current
through the tunnel barrier, the SOT geometry whose ledger consequences
lesson 6 prices. Second, it reframes the module's opening claim: lesson 1
said magnetism is spin held in formation by exchange; the spin Hall effect
shows that even *without* exchange, spin is a transportable current with
its own sources, detectors and conversion losses. The two-current model
gave spin a resistance; spin accumulation gave it a battery; the spin
Hall effect gives it a transformer — and with those three circuit
elements, spintronics stops being an effect and becomes an engineering
discipline.

The efficiency arithmetic deserves one honest number. Converting charge
to spin current at $\theta_{SH} = 0.1$ looks lossy, but the SOT geometry
compensates geometrically: every electron in the strip scatters many
times along its length, delivering angular momentum repeatedly, so the
*effective* angular momentum per charge can exceed the naive tunneling
bound of $\hbar/2$ per electron. That is why SOT switching currents are
competitive despite the modest angle — and why the metric quoted in the
literature is the ratio of switched moment to charge passed, not
$\theta_{SH}$ alone: the course's conditions-attached rule, once more,
now applied to a conversion efficiency.

## 5. Graduate extension: spin accumulation and where the resistance lives

The two-current model hides a boundary phenomenon that becomes the whole
story in vertical devices. Where current crosses a ferromagnet/normal-metal
interface, the ferromagnet delivers more majority- than minority-spin
electrons: spin piles up on the normal side — **spin accumulation** — a
splitting of the two channels' electrochemical potentials that decays over
the spin diffusion length $\ell_{sf}$ and adds a *spin-coupled interface
resistance* beyond the ohmic one. Three consequences organize advanced
device work. First, current-perpendicular GMR (the geometry of all modern
stacks) is quantitatively a spin-accumulation calculation, not a resistor
sum. Second, accumulation is a *pure spin current* source: it diffuses spin
without net charge flow, enabling nonlocal spin valves that separate the
charge and spin paths — the laboratory tool by which $\ell_{sf}$ and
interface polarizations are actually measured. Third, the **conductivity
mismatch** problem: injecting spin from a metal ferromagnet into a
semiconductor fails catastrophically because the semiconductor's much
larger resistivity dominates the circuit and depolarizes the injection —
resolved only by inserting a tunnel barrier as a spin-selective ballast
resistor. That resolution is why "MTJ" rather than "ohmic contact" is the
universal spintronic interface, and it completes the arc of this lesson:
every practical spin device is a tunnel junction not by preference but by
circuit theorem.

## 6. Problems

**P20.25** Evaluate the two-current GMR formula for $\alpha =$ 2, 5 and
10. Around which $\alpha$ does the marginal return per unit of asymmetry
peak?

**P20.26** Derive $R_P = 2\alpha/(1+\alpha)$ and $R_{AP} = (1+\alpha)/2$
from the four-resistor network (two layers, two spin channels, unit
$r_\uparrow$), and confirm $R_{AP} > R_P$ for every $\alpha \ne 1$.

**P20.27** A spin valve's spacer is thickened beyond the spin diffusion
length. Predict what happens to the GMR ratio and explain in one sentence
using the model's key assumption.

**P20.28** Julliere with $P_1 = 0.5$: what $P_2$ gives TMR = 100%? What
TMR results if a processing fault demagnetizes the reference layer
($P_2 \to 0$)?

**P20.29** An MgO MTJ's $RA$ product doubles for every 0.2 nm of barrier.
A wafer shows $RA$ varying by a factor 1.6 centre-to-edge. What barrier
thickness nonuniformity does this imply, and why does the read-channel
designer care more about this spread than about the mean?

**P20.30** Using section 5, explain why a CoFe contact sputtered directly
onto silicon injects almost no spin polarization, and what the standard
fix is.

### Answers

**A20.25** $(\alpha-1)^2/4\alpha$: 12.5%, 80%, 202.5%. The *derivative*
per unit $\alpha$ is largest in the mid range around $\alpha\sim2$–4 in
relative terms — beyond that, doubling $\alpha$ roughly doubles GMR (the
function approaches $\alpha/4$), so material development at large
asymmetry buys linear, not accelerating, returns.

**A20.26** P state: channels are $1+1 = 2$ and $\alpha+\alpha = 2\alpha$
in series per channel, paralleled: $R_P = (2)(2\alpha)/(2+2\alpha) =
2\alpha/(1+\alpha)$. AP state: each channel is $1+\alpha$, two identical
in parallel: $(1+\alpha)/2$. Difference: $R_{AP}-R_P =
(1-\alpha)^2/[2(1+\alpha)] > 0$ unless $\alpha = 1$.

**A20.27** GMR collapses toward zero: an electron loses its spin memory
inside the spacer, so no electron samples both layers, and the stack
becomes two uncorrelated resistors whose order no longer matters. The
model's premise — spin conserved across the stack — *is* the effect.

**A20.28** $1.0 = 2(0.5)P_2/(1-0.5P_2)$: $P_2 = 2/3$. With $P_2 = 0$,
TMR $= 0$ exactly: the junction still conducts, but the resistance no
longer depends on alignment — the sensor dies silently, reading a constant.
(Hence production MTJs are screened magnetically, not just electrically.)

**A20.29** $\ln 1.6/\ln 2 \times 0.2\ {\rm nm} \approx 0.14$ nm — below
one atomic layer of nonuniformity, yet a 60% resistance spread. The
channel must bias and threshold every head identically; a spread that
large forces per-device calibration, which costs test time — the mean can
be designed around, the spread must be paid for.

**A20.30** The semiconductor's resistivity dominates the series circuit,
so both spin channels see essentially the same (huge) resistance and the
current's polarization collapses — conductivity mismatch. Fix: a thin
tunnel barrier (or Schottky barrier) at the interface, whose
spin-selective resistance is large enough to matter, restoring a
polarization-dependent division of current.
