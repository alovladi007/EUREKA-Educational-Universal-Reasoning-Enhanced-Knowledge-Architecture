# Domains, Walls and Hysteresis: How Magnets Remember

<!-- covers: 20.1 -->

Lesson 1 explained why moments align. This lesson explains the paradox that
follows: a piece of iron, saturated inside at 1.7 MA/m by an exchange field
of a thousand tesla, can sit on a bench showing no external field at all.
The resolution — domains — turns out to be the module's most commercially
consequential idea, because the way domains move under an applied field is
what makes a material *soft* (a transformer core) or *hard* (a permanent
magnet), and the two industries built on that distinction price their
materials by the shapes of the loops this lesson computes.

**Level.** Sections 1 to 4 undergraduate core; section 5 graduate; section 6
problems.

## 1. Why domains exist

A uniformly magnetized block pays an energy bill for the field outside
itself. That **magnetostatic energy** (per unit volume, for a field-filling
configuration) is of order

$$
u_{\rm ms} \sim \frac{\mu_0 M_s^2}{2},
$$

which for iron ($M_s = 1.7\times10^{6}$ A/m) is about $1.8\times10^{6}$
J/m³ — an enormous premium. The material escapes it by splitting into
**domains**: regions individually saturated but collectively arranged so the
flux closes internally and almost nothing leaks out. The subdivision is not
free — each boundary costs wall energy (section 2) — and the observed domain
structure is the settlement between those two bills. Closure domains at the
surface, stripe patterns in thin films, the maze patterns of magnetic force
microscopy: all are solutions of the same minimization with different
boundary conditions.

The demagnetizing field formalizes the geometry dependence. Inside a
uniformly magnetized body, the field opposes the magnetization,
$H_d = -N M$, with the **demagnetizing factor** $N$ set by shape alone: a
sphere has $N = 1/3$ everywhere; a long needle has $N \approx 0$ along its
axis; a thin film has $N = 1$ across its thickness. Shape is therefore an
anisotropy that costs nothing:

![Demagnetizing factors of a prolate spheroid against aspect ratio, computed from the exact expression: the long axis factor collapses toward zero, which is why needles hold their magnetization along their length.](/courses/electronic-devices/figures/m20-demag-shape.svg)

This is why recording particles were needle-shaped for forty years, and why
lesson 4's thin films need engineered interface anisotropy to point
magnetization *out* of the film plane against a full $N=1$ penalty.

## 2. The wall: exchange against anisotropy

Between two domains the magnetization must rotate by (typically) 180°. Over
how many atoms? Exchange wants the rotation spread over as many sites as
possible — the exchange cost of a small angle per step falls as the square
of the angle. But **magnetocrystalline anisotropy**, the energy tying
magnetization to easy crystal axes (density $K$, J/m³), charges for every
moment pointing off-axis, so it wants the wall thin. The compromise, derived
in the supplement by minimizing the sum, gives the **Bloch wall** width and
energy:

$$
\delta = \pi\sqrt{\frac{A}{K}}, \qquad
\sigma_w = 4\sqrt{AK},
$$

with $A$ the exchange stiffness (order 10 pJ/m). The wall profile itself
follows the classic kink solution:

$$
\theta(x) = 2\arctan\!\left(e^{\pi x/\delta}\right),
$$

![Magnetization angle across a Bloch wall for a wide soft-material wall and a narrow hard-material wall, from the kink solution: anisotropy squeezes the same 180-degree rotation into fewer atoms.](/courses/electronic-devices/figures/m20-domain-wall.svg)

![Wall width against anisotropy for two exchange stiffnesses: three decades of K buy a factor of thirty in wall width, from hundreds of nanometres in permalloy to a few in the hardest magnets.](/courses/electronic-devices/figures/m20-wall-width.svg)

The numbers span a huge range: permalloy ($K\sim10^{2}$ J/m³) has walls
hundreds of nanometres wide; Nd₂Fe₁₄B ($K\sim5\times10^{6}$) squeezes the
rotation into a few nanometres. That width matters kinetically — a wide wall
averages over defects and glides easily; a narrow wall can be pinned by a
single grain boundary — and this one contrast will generate both of the
loop shapes in section 3.

### Worked example 2.1 — the wall in iron

Iron: $A = 2\times10^{-11}$ J/m, $K_1 = 4.8\times10^{4}$ J/m³. Then

$$
\delta = \pi\sqrt{\frac{2\times10^{-11}}{4.8\times10^{4}}}
\approx 64\ {\rm nm}, \qquad
\sigma_w = 4\sqrt{AK} \approx 3.9\times10^{-3}\ {\rm J/m^2}.
$$

About two hundred atomic spacings — wide enough to average over point
defects (which is why pure iron is magnetically soft), narrow compared with
the micrometre domains it separates, and the length scale against which
lesson 3 will judge when a particle is too small to afford a wall at all.

## 3. Hysteresis: the loop and its two industries

Sweep the field and the magnetization traces a **hysteresis loop** — the
lag of $M$ behind $H$ that gives the module its memory. Three landmarks name
the loop: the **saturation magnetization** $M_s$, the **remanence** $M_r$
left at zero field, and the **coercivity** $H_c$, the reverse field needed
to zero the magnetization.

![Computed soft and hard hysteresis loops on one axis: the same saturation, coercive fields decades apart. The enclosed area is energy dissipated per cycle, the quantity each industry either minimizes or maximizes.](/courses/electronic-devices/figures/m20-hysteresis-loops.svg)

Mechanistically the loop is domain kinetics. From the demagnetized state,
small fields move walls reversibly; stronger fields tear walls past pinning
sites in irreversible **Barkhausen jumps** (audible, historically, as noise
in a pickup coil — the first direct evidence for domains); near saturation
the last hard-axis domains rotate coherently. Coercivity is therefore not a
property of the ideal crystal but of its *defects*: the pinning landscape
walls must cross to reverse. Soft magnets are soft because their walls are
wide and their microstructure clean; hard magnets are hard because grains
are small, decoupled and anisotropic enough that reversal requires something
close to coherent rotation against the full anisotropy field.

The loop's enclosed area is dissipated energy,

$$
W_{\rm hyst} = \oint \mu_0 H\,dM \quad {\rm (J/m^3\ per\ cycle)},
$$

which at line or switching frequency becomes a power bill. A transformer
core cycling at 50 Hz with a fat loop heats; the electrical-steel industry
exists to make that loop thin. Add the eddy-current term from module 18 —
induced currents scaling as $f^2 B^2 d^2/\rho$ in a lamination of thickness
$d$ — and the full soft-magnet loss budget appears, along with its two
levers: laminate thinner, or raise resistivity. The second lever is the
ferrites' entire franchise: insulating ferrimagnets (lesson 1) whose eddy
losses are negligible at frequencies where any metal has long since been
disqualified. Their price is Snoek's trade-off — permeability and usable
frequency trade against each other at roughly constant product:

![Permeability against frequency for a high-permeability and a high-frequency ferrite, single-pole model with constant permeability-bandwidth product: the Snoek trade that switching-converter designers shop along.](/courses/electronic-devices/figures/m20-snoek.svg)

Hard magnets monetize the opposite corner of the loop. A permanent magnet
in a motor operates in its *second quadrant* — magnetized one way, loaded by
a demagnetizing field the other — and the figure of merit is the largest
rectangle under the demagnetization curve, the **maximum energy product**
$(BH)_{max}$, reaching its ideal value

$$
(BH)_{max} = \frac{B_r^2}{4\mu_0}
$$

for a straight-line (fully rigid) demagnetization characteristic:

![Second-quadrant demagnetization line with the energy product along it, computed from B equal to Br plus mu0 H: the product peaks at the midpoint, where the magnet delivers the most field energy per unit volume.](/courses/electronic-devices/figures/m20-energy-product.svg)

### Worked example 3.1 — pricing a magnet by the square

A bonded ferrite magnet has $B_r = 0.4$ T; sintered NdFeB has
$B_r = 1.3$ T. Compare ideal energy products.

$$
(BH)_{max}^{\rm ferrite} = \frac{0.4^2}{4\mu_0} \approx 32\ {\rm kJ/m^3},
\qquad
(BH)_{max}^{\rm NdFeB} = \frac{1.3^2}{4\mu_0} \approx 336\ {\rm kJ/m^3}.
$$

A factor 3.2 in remanence became a factor 10.5 in energy product — the
square in action. For a motor needing fixed flux, the NdFeB rotor uses a
tenth the magnet volume, which cascades into a smaller air gap, less copper
and a lighter machine: the chain of consequences that moved traction motors
to rare-earth magnets, and the reason a rare-earth supply shock (module 17's
strategy cases) propagates so directly into vehicle economics.

### Worked example 3.2 — a transformer's loop bill

Electrical steel with loop loss 0.6 J/m³ per cycle runs at 50 Hz with core
volume $4\times10^{-3}$ m³. Hysteresis power:

$$
P = W_{\rm hyst}\,f\,V = 0.6\times50\times4\times10^{-3} = 0.12\ {\rm W}.
$$

Small — until scaled. A grid transformer with 2 m³ of core dissipates 60 W
from hysteresis alone, continuously, for forty years: about 21 MWh per unit.
Multiplied over a national fleet, tenths of a percent in loop area are worth
entire power stations, which is why grain-oriented steel (crystallographic
texture aligned with the flux path) commands its premium and why the
loss-per-kilogram figure printed on electrical steel datasheets is, in
effect, the price tag.

## 4. Reading a loop like an engineer

The loop is the module's data sheet, and each region is an assay. The
initial slope from the demagnetized state is the **initial permeability**
$\mu_i$ — the small-signal quantity inductor designers buy. The knee near
saturation warns the power designer where inductance collapses. $M_r/M_s$
measures texture: near 1 means aligned easy axes, near 0.5 an isotropic
powder. $H_c$ tracks microstructure so sensitively that magnetic testing
doubles as metallurgy quality control: hardening a steel raises its
coercivity, and a batch whose loop widened is a batch whose heat treatment
drifted. The lesson's rule: never quote a permeability without its
measurement conditions — amplitude, frequency, temperature and bias all move
the loop, and the number on the datasheet is a point on a surface, not a
constant of nature.

### 4b. The instruments behind the loop

Three instruments produce essentially every loop in this module, and each
carries its own conditions. The **B-H looper** drives a wound sample with
AC and integrates the pickup voltage — fast, production-friendly, and
inherently an *amplitude and frequency dependent* measurement, which is
why core datasheets quote loops at stated $(B, f, T)$. The **vibrating
sample magnetometer** (VSM) oscillates the sample near pickup coils in a
swept DC field — the general-purpose tool for films and powders, slow
enough that its loops are quasi-static, with sensitivity around
$10^{-9}$ A·m². The **SQUID magnetometer** buys four more decades of
sensitivity from superconducting detection, at the price of minutes per
point — the instrument behind every nanoparticle and dilute-moment result
in lesson 3. The routing rule mirrors module 19's sensitivity ladder:
production QC on the looper, film development on the VSM, and anything
whose total moment is small — a single patterned device, a dilute assay —
on the SQUID. And one systematic error travels with all three: the
measured curve is $M$ against *applied* field, while the material
responds to the internal field $H_{\rm int} = H_{\rm app} - NM$; skipping
the demagnetization correction on a stubby sample steepens every loop and
flatters every permeability, a shape-dependent flattery that has survived
into more than one datasheet.

## 5. Graduate extension: the coercivity paradox

Compare the ideal and the real. Coherent rotation against anisotropy
(lesson 3's Stoner-Wohlfarth model applied to a perfect grain) predicts
$H_c \sim 2K/\mu_0 M_s$: for iron about 47 kA/m, for NdFeB nearly 6 MA/m.
Measured coercivities run one to two orders of magnitude *lower* —
well-annealed iron reverses at tens of A/m, commercial NdFeB near 1 MA/m.
This is **Brown's paradox**, and its resolution organizes hard-magnet
metallurgy: real reversal does not rotate a whole grain coherently but
*nucleates* a reverse domain at a defect — a soft grain-boundary phase, a
surface asperity, a sharp corner concentrating the demagnetizing field —
and the wall then sweeps the grain at far lower cost. Coercivity is
therefore a weakest-link property with the statistics to match: it
correlates with the *worst* site in each grain, improves when grain
boundaries are engineered (the heavy-rare-earth grain-boundary diffusion
treatments of modern NdFeB), and degrades at corners, which is why chipped
magnets demagnetize from the chip. The design lesson echoes module 19's
Urbach tails and module 21's yield statistics: in mature materials the mean
structure sets the headline property, but the *tail* of the disorder sets
the specification you can actually certify.

## 6. Problems

**P20.7** Cobalt: $A = 3\times10^{-11}$ J/m, $K_1 = 4.5\times10^{5}$
J/m³. Compute the wall width and wall energy, and compare both with iron
(worked example 2.1).

**P20.8** A permalloy film has $M_s = 8\times10^{5}$ A/m. Compute the
magnetostatic energy density $\mu_0M_s^2/2$ and the shape-anisotropy field
$M_s$ (in kA/m) that resists pointing the magnetization out of plane.
Compare with permalloy's magnetocrystalline anisotropy field of order
100 A/m and draw the conclusion for thin-film device design.

**P20.9** A magnet with $B_r = 1.1$ T is 20% porous (bonded rather than
sintered), scaling $B_r$ by the density fraction. By what factor does the
ideal $(BH)_{max}$ fall?

**P20.10** A switching converter needs $\mu_r \ge 80$ at 20 MHz. Using the
Snoek product from the figure's two materials (take
$(\mu_i-1)f_{res} \approx 3\times10^{9}$ Hz), decide whether any ferrite
on that trade line can serve, and state the alternative.

**P20.11** A 0.35 mm electrical-steel lamination has eddy loss equal to
hysteresis loss at 50 Hz. The lamination is replaced by 0.20 mm sheet of
the same steel. Using the $d^2$ scaling, what fraction of the original
total core loss remains?

**P20.12** A batch of sintered magnets shows coercivity 15% below
specification, with unchanged $B_r$ and $M_s$. Using section 5, name the
two most likely microstructural causes and one corner-geometry cause, and
propose the cheapest screening measurement.

### Answers

**A20.7** $\delta = \pi\sqrt{3\times10^{-11}/4.5\times10^{5}} \approx 26$
nm; $\sigma_w = 4\sqrt{AK} \approx 1.5\times10^{-2}$ J/m². Cobalt's wall is
2.5 times narrower and about four times more expensive per area than
iron's: higher anisotropy squeezes and taxes the wall simultaneously.

**A20.8** $u_{\rm ms} = \mu_0 M_s^2/2 = (4\pi\times10^{-7})(6.4\times10^{11})/2
\approx 4.0\times10^{5}$ J/m³; the shape field is $M_s = 800$ kA/m. That is
four thousand times the crystalline anisotropy field: film-plane
magnetization is locked by shape alone, and only the interface engineering
of lesson 4 (perpendicular anisotropy) can overcome it.

**A20.9** $B_r \to 0.8B_r$, and the product scales as $B_r^2$: factor
$0.64$. A fifth of the density bought back a third of the energy product —
porosity is expensive squared.

**A20.10** Snoek: $\mu_i - 1 \approx 3\times10^{9}/f_{res}$. Demanding
useful response *at* 20 MHz needs $f_{res}$ comfortably above it, say
$\ge 4\times10^{7}$ Hz, giving $\mu_i \lesssim 76$ — just below the
requirement. No ferrite on that line serves with margin; the alternatives
are a gapped core (trading permeability for stability) or powdered-iron
composites, whose distributed air gap performs the same trade
microscopically.

**A20.11** Total initially $= H + E = 2H$. After: hysteresis unchanged
($H$), eddy scaled by $(0.20/0.35)^2 = 0.327$: total $= H(1 + 0.327) =
1.33H$, i.e. 66% of the original. Thinner laminations attack only the eddy
half of the bill.

**A20.12** Microstructural: (i) soft or continuous grain-boundary phase
(nucleation sites), (ii) grain growth beyond the single-domain-like optimum.
Geometry: sharp corners or chips concentrating demagnetizing fields.
Cheapest screen: a full-loop trace on samples from each sinter lot —
coercivity is the canary, and the loop costs minutes against a
microscope's hours.
