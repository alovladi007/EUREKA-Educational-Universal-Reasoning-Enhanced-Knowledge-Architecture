# Thin Films and Interfaces: Engineered Anisotropy, Coupling and New Spin Textures

<!-- covers: 20.2 -->

Bulk magnetism hands you what the crystal chose. Films hand you knobs.
Confine a magnet to a few atomic layers and its behaviour is dominated by
surfaces and neighbours: interface anisotropy can stand the magnetization
upright against a full shape penalty, a nonmagnetic spacer two atoms thicker
can flip the sign of the coupling across it, an adjacent antiferromagnet can
shift the entire hysteresis loop sideways, and broken inversion symmetry can
twist walls into chiral objects that behave like particles. Every device in
lessons 5 and 6 is assembled from exactly these four interface effects, so
this lesson builds them in order.

**Level.** Sections 1 to 4 undergraduate core; section 5 graduate; section 6
problems.

## 1. Anisotropy by the layer: PMA

Lesson 2 established the obstacle: a film's shape anisotropy
($N = 1$ through-thickness) locks magnetization in-plane with an energy
$\mu_0M_s^2/2$ — hundreds of kJ/m³ for a strong magnet. Interfaces supply
the counterweapon. At a Co/Pt or CoFeB/MgO boundary, interfacial
hybridization adds an anisotropy energy *per unit area*, $K_s$ (order
1 mJ/m²), favouring out-of-plane moments. Distributed over a film of
thickness $t$ it contributes $K_s/t$ per volume, so the effective
out-of-plane anisotropy is

$$
K_{\rm eff} = \frac{K_s}{t} - \frac{\mu_0 M_s^2}{2},
$$

positive — **perpendicular magnetic anisotropy** (PMA) — below a critical
thickness

$$
t_c = \frac{2K_s}{\mu_0 M_s^2}.
$$

The $1/t$ scaling is the design rule: PMA is a *thin-film-only* resource,
switched on by making the film thinner than a couple of nanometres. It
rebuilt two industries. Recording media went perpendicular in 2005 (lesson
3's trilemma), and MRAM went perpendicular a decade later, because a
perpendicular cell holds its barrier $KV$ at smaller diameter and switches
with less current (lesson 6). The same arithmetic warns of fragility:
$K_s$ is an *interface* property, so a few tenths of a nanometre of
interdiffusion or oxidation during processing erases the margin — a
manufacturing sensitivity module 33's metrology exists to police.

### Worked example 1.1 — the PMA window

CoFeB on MgO: $K_s \approx 1.3\times10^{-3}$ J/m²,
$M_s = 1.2\times10^{6}$ A/m. Critical thickness:

$$
t_c = \frac{2\times1.3\times10^{-3}}{(4\pi\times10^{-7})(1.44\times10^{12})}
\approx 1.4\ {\rm nm}.
$$

The free layer of a perpendicular MRAM cell must be thinner than about
seven atomic layers — and not much thinner, since $K_{\rm eff}V$ (the
retention barrier) also shrinks with volume. Real cells sit near 1 nm:
a two-atomic-layer process window, held across 300 mm wafers, which is the
fabrication achievement behind every MRAM product brief.

## 2. Talking through the spacer: RKKY and the synthetic antiferromagnet

Separate two ferromagnetic films with a nonmagnetic metal and they still
converse. The conduction electrons of the spacer scatter off the first
layer's moment, and the spin disturbance they carry oscillates in space —
the same RKKY mechanism that couples dilute moments through a host metal.
The interlayer coupling therefore *oscillates in sign* with spacer
thickness:

$$
J(r) \propto \frac{\sin(2k_Fr) - 2k_Fr\cos(2k_Fr)}{(2k_Fr)^4},
$$

![RKKY-form interlayer coupling against spacer thickness in Fermi-wavelength units: the sign alternates, so an angstrom-level choice of spacer selects ferromagnetic or antiferromagnetic alignment.](/courses/electronic-devices/figures/m20-rkky.svg)

with period set by the spacer's Fermi wavelength — typically around one
nanometre. The discovery that a ruthenium spacer at its first
antiferromagnetic peak couples two films rigidly antiparallel gave the
**synthetic antiferromagnet** (SAF): a lamination with almost no net
moment, hence almost no stray field and almost no response to external
fields, yet built from ordinary ferromagnets. The SAF is the quiet
workhorse of every device in the next two lessons — reference layers that
do not budge and do not disturb their neighbours — and the historical
route by which the antiparallel state needed for GMR (lesson 5) was first
manufactured on demand.

### Worked example 2.1 — choosing the spacer

A stack designer needs antiparallel coupling with maximum strength. From
the oscillation, the first antiferromagnetic extremum of $J$ sits near
$2k_Fr \approx 4.5$ (the first negative lobe). For a spacer with
$k_F \approx 1.2\times10^{10}$ m⁻¹, that is
$r \approx 4.5/(2\times1.2\times10^{10}) \approx 0.19$ nm... one atomic
layer is ~0.2 nm, and real oscillation periods (measured, with band
structure corrections) come out near 0.9 nm for Ru — the naive free-electron
estimate underestimates the period severely. The worked lesson: the
*existence and sign structure* of RKKY is free-electron physics you can
compute; the *quantitative period* requires the spacer's real Fermi
surface, and stack recipes are tuned empirically around the predicted
lobes. An honest model knows which of its outputs to trust — this course's
recurring audit rule.

## 3. Borrowed stubbornness: exchange bias

Grow a ferromagnet on an antiferromagnet (CoFe on IrMn, say) and cool
through the antiferromagnet's Néel point in a field. The result is
startling: the ferromagnet's hysteresis loop is no longer centred at zero
but *shifted* by a bias field $H_{eb}$ — as if a permanent internal field
pinned it one way. The interface spins of the antiferromagnet, frozen by
its enormous effective anisotropy and invisible externally (no net
moment), torque the ferromagnet through interface exchange
$\sigma_{eb}$ (J/m²):

$$
H_{eb} = \frac{\sigma_{eb}}{\mu_0 M_s\,t_F},
$$

falling as $1/t_F$ — an interface effect again. **Exchange bias** is how
every spin valve and MTJ gets its *pinned* reference layer: the
antiferromagnet contributes no signal, no stray field, and no
field-sensitivity of its own, just stubbornness on loan. Two engineering
caveats travel with it: the bias disappears above the antiferromagnet's
**blocking temperature** (typically 150–250 °C, setting the stack's thermal
budget and its data-retention-under-solder-reflow specification), and it is
set — and can be *reset* — by field-cooling, which is both the
manufacturing step (anneal in field) and a failure mode (a hot, magnetized
environment slowly re-writes the reference direction).

## 4. Chirality for free: DMI and skyrmions

At an interface that breaks inversion symmetry, with strong spin-orbit
coupling in the neighbouring heavy metal (Pt, W), the exchange interaction
acquires an antisymmetric partner — the **Dzyaloshinskii-Moriya
interaction** (DMI):

$$
E_{\rm DMI} = -\vec{D}_{12}\cdot(\vec{S}_1\times\vec{S}_2),
$$

which is minimized not by parallel spins but by *perpendicular* ones with a
fixed rotational sense. DMI does not overthrow exchange — it decorates it:
walls acquire a preferred chirality (all rotating the same way), and above
a threshold DMI stabilizes **skyrmions**, localized whirls in which the
magnetization wraps the full sphere once:

![Radial profile of a skyrmion from the 360-degree wall ansatz for two sizes: the core points opposite the film, the edge aligns with it, and the wrap between them is held by the interfacial DMI.](/courses/electronic-devices/figures/m20-skyrmion.svg)

The wrap count is a topological integer, so a skyrmion cannot unwind
continuously — it behaves as a robust, particle-like bit, movable by the
spin currents of lesson 6 at current densities orders below those that
move ordinary walls. Racetrack-style memories that shift a queue of
skyrmions past a fixed reader remain a research technology, and this
course's honesty rule applies: no shipping product stores your data in
skyrmions as of this module's writing. They are here because they complete
the anisotropy-coupling-chirality toolkit, and because the antiferromagnet
story of lesson 1 warns how quickly interesting-but-useless can become
load-bearing.

## 5. Graduate extension: the anisotropy budget sheet

Every film in this lesson is a competition of energies per volume, and the
professional habit is to tabulate them before believing any design. For a
1 nm CoFeB free layer: shape $-\mu_0M_s^2/2 \approx -9\times10^{5}$ J/m³;
interface $+K_s/t \approx +1.3\times10^{6}$; net PMA
$\approx +4\times10^{5}$ J/m³. Now perturb as a fab would. Thickness +10%:
interface term falls to $1.18\times10^{6}$, net falls 30% — thickness is
the sensitivity champion. Interdiffusion cutting $K_s$ by 15%: net falls
~50%. Temperature to 400 K: $M_s$ falls a few percent, *helping* PMA
(smaller shape penalty) but shrinking the moment lesson 6's torques act
on. The budget sheet does for magnetics what module 19's absorption
budgets did for optics: it converts a stack from a list of layers into a
ranked list of vulnerabilities, and it is the artifact a review board
actually reads. The deeper graduate point: *every term on the sheet is an
interface-over-volume effect* — $K_s/t$, $\sigma_{eb}/t$, DMI $\propto
1/t$ — so film magnetics is the engineering of surface-to-volume ratio,
and "make it thinner" is simultaneously the source of every capability and
every fragility in the stack.

## 6. Problems

**P20.19** A Co film has $K_s = 0.8$ mJ/m² per interface (two interfaces,
Pt on both sides) and $M_s = 1.4\times10^{6}$ A/m. Compute $t_c$ counting
both interfaces, in nanometres and atomic layers (0.2 nm each).

**P20.20** For the stack of worked example 1.1 at $t = 1.0$ nm, compute
$K_{\rm eff}$ and the retention barrier $\Delta = K_{\rm eff}V/k_BT$ at
300 K for a circular cell of 30 nm diameter. Does it meet the $\Delta \ge
60$ archival criterion from lesson 3?

**P20.21** An exchange-biased layer with $\sigma_{eb} = 0.2$ mJ/m²,
$M_s = 1.0\times10^{6}$ A/m shows $H_{eb} = 32$ kA/m. What is $t_F$? The
designer doubles $t_F$ to raise the read signal; what happens to the bias,
and why is this a real trade rather than a free choice?

**P20.22** A SAF reference uses the first antiferromagnetic RKKY lobe. A
process drift adds 0.15 nm to the Ru spacer (period 0.9 nm). Using the
oscillation figure, describe qualitatively what happens to the coupling
strength and sign margin, and name the device-level symptom.

**P20.23** Why can a skyrmion not be removed by any continuous
rearrangement of spins, while an ordinary bubble domain can? State the
argument in one paragraph using the wrap-count idea, and name the loophole
(where the topological protection actually fails in a real finite film).

**P20.24** Rank the three interface energies of this lesson — $K_s/t$,
$\sigma_{eb}/t_F$, DMI — by their sensitivity to one shared enemy, and
name that enemy with a process example.

### Answers

**A20.19** $t_c = 2\times(2\times0.8\times10^{-3})/
[(4\pi\times10^{-7})(1.96\times10^{12})] \approx 1.3$ nm — about six or
seven atomic layers. (Doubling the interfaces doubled the budget; the
shape penalty grew with $M_s^2$ and took most of it back.)

**A20.20** $K_{\rm eff} = 1.3\times10^{-3}/10^{-9} - 9.05\times10^{5}
\approx 4.0\times10^{5}$ J/m³. $V = \pi(15\times10^{-9})^2(10^{-9}) =
7.1\times10^{-25}$ m³. $\Delta = (4.0\times10^{5})(7.1\times10^{-25})/
(4.14\times10^{-21}) \approx 68$. Meets 60 with thin margin — and the
margin is one thickness-percent away from not existing, which is worked
example 1.1's process-window point restated as retention.

**A20.21** $t_F = \sigma_{eb}/(\mu_0M_sH_{eb}) = 2\times10^{-4}/
[(4\pi\times10^{-7})(10^{6})(3.2\times10^{4})] \approx 5$ nm. Doubling
$t_F$ halves $H_{eb}$ to 16 kA/m: more signal, weaker pinning. If the
sensor's field range approaches the reduced bias, the reference layer
starts to walk — signal and stability are bought from the same $1/t_F$.

**A20.22** 0.15 nm is a sixth of the period: the operating point slides
off the lobe's extremum toward the zero crossing, so antiparallel coupling
weakens substantially though the sign likely survives. Symptom: the
reference layer's rigidity drops, showing up as loop distortion and a
field-offset drift in the finished sensor — a wafer-level magnetics test
catches it before packaging.

**A20.23** The skyrmion's magnetization covers the whole sphere of
directions exactly once; any continuous deformation preserves that integer
covering, and the uniform state covers zero times, so no continuous path
connects them. A bubble domain without the wrap (trivial winding) can
shrink and vanish. The loophole: at the film's *edge*, or via a singular
point (Bloch point) where magnetization vanishes momentarily, the integer
can change — so real skyrmion lifetimes are set by edge and singularity
barriers, not by infinity.

**A20.24** Shared enemy: interface degradation by interdiffusion/oxidation
during thermal processing (e.g. the 400 °C back-end anneal). Sensitivity
ranking, most to least fragile: DMI (needs an atomically sharp
heavy-metal interface), $K_s/t$ (hybridization at one boundary),
$\sigma_{eb}/t_F$ (survives modest mixing but dies at the blocking
temperature). One anneal specification therefore guards three different
physical resources — which is why the thermal budget line appears in every
magnetics process document.
