# Magnetic Order: Moments, Exchange and the Curie Point

<!-- covers: 20.1 -->

Every module so far has moved charge. This one moves the *other* quantum
number. A century of physics compressed into one engineering sentence: spins
interact strongly enough in some solids to hold a common direction at room
temperature, and everything from the power grid's transformers to the read
head that found this file exploits that fact. This first lesson builds the
classical and statistical machinery: where moments come from, why they align,
and how order dies at the Curie point.

**Level.** Sections 1 to 4 undergraduate core; section 5 graduate; section 6
problems.

## 1. Where the moment comes from

An electron carries a magnetic moment from two sources: its orbital motion
and its spin. Both are quantized in units of the **Bohr magneton**,

$$
\mu_B = \frac{e\hbar}{2m_e} = 9.274\times10^{-24}\ {\rm J/T},
$$

and the moment of an atom with total angular momentum quantum number $J$ is

$$
\mu = g\,\mu_B\sqrt{J(J+1)},
$$

with $g$ the Landé factor combining the spin and orbital contributions. Two
consequences frame the whole module. First, filled shells contribute nothing:
their spins and orbital momenta cancel pairwise, which is why magnetism is
the specialty of partially-filled 3d and 4f shells — iron, cobalt, nickel and
the rare earths — rather than a property of matter in general. Second, in a
3d transition metal embedded in a crystal, the orbital contribution is
largely **quenched** by the crystal field: the moment that survives is mostly
spin, $g\approx2$, and the measured moments of Fe (2.2 $\mu_B$ per atom), Co
(1.7) and Ni (0.6) are non-integer because the 3d electrons are itinerant,
shared in bands rather than counted per atom. That non-integer moment is the
first flag that a band picture (section 5) sits beneath the local-moment
story this lesson mostly tells.

A field applied to any material also induces a small *opposing* moment in
every filled shell — Lenz's law operating at the atomic scale. This
**diamagnetism** is universal, temperature-independent and weak
($\chi\sim-10^{-5}$); it is the whole story in silicon, copper and water, and
the background subtraction in every magnetometry measurement.

## 2. Paramagnetism: moments without a committee

Give a solid permanent moments that ignore each other and you get a
**paramagnet**: each moment aligns with the applied field only as far as
thermal agitation permits. The classical calculation (Langevin's, derived in
the supplement) averages a continuous moment orientation over the Boltzmann
distribution and yields

$$
\frac{M}{M_s} = L(x) = \coth x - \frac{1}{x},
\qquad x = \frac{\mu_0 \mu H}{k_B T}.
$$

The quantum version restricts the moment to $2J+1$ orientations and gives
the **Brillouin function** $B_J(x)$, which contains Langevin as its
$J\to\infty$ limit and the simple $\tanh x$ as its $J=\frac{1}{2}$ limit:

![Brillouin functions for two J values with the classical Langevin limit: all rise linearly at small argument and saturate when the field energy per moment beats thermal energy.](/courses/electronic-devices/figures/m20-brillouin.svg)

For laboratory fields at room temperature $x\ll1$: a moment of one Bohr
magneton in a 1 T field has $\mu_B B \approx 5.8\times10^{-5}$ eV against
$k_BT\approx0.025$ eV. Paramagnets are therefore *linear* in every ordinary
circumstance, with the small-argument expansion delivering the **Curie law**:

$$
\chi = \frac{n\,\mu_0\,g^2\mu_B^2\,J(J+1)}{3k_BT} = \frac{C}{T}.
$$

The $1/T$ signature is the fingerprint, and it is diagnostic in both
directions: measure $\chi(T)$, plot $1/\chi$ against $T$, and the slope hands
you the moment per atom — a chemistry-free way to count unpaired electrons
that laboratories use on everything from catalysts to battery cathodes.

![The three temperature signatures on one plot: Curie 1/T for free moments, the small temperature-independent Pauli response of metals, and the negative diamagnetic floor.](/courses/electronic-devices/figures/m20-susceptibility-classes.svg)

Metals add a subtlety worth flagging: conduction electrons show a weak,
nearly temperature-independent **Pauli paramagnetism**, because only the
states within $k_BT$ of the Fermi level can respond — the same Fermi-surface
bottleneck that module 18 used to explain heat capacity. A measured
susceptibility that neither falls as $1/T$ nor sits below zero is the metal
announcing its Fermi sea.

### Worked example 1.1 — counting unpaired electrons from a slope

A dilute magnetic oxide with $n = 2\times10^{27}$ magnetic ions/m³ shows
$1/\chi$ linear in temperature with slope 19.8 K⁻¹ through the origin, i.e.
a Curie constant $C = 0.050$ K. What moment per ion does this imply?

Invert the Curie law with $\mu_{\rm eff}^2 = g^2\mu_B^2 J(J+1)$:

$$
\mu_{\rm eff} = \sqrt{\frac{3k_B C}{n\,\mu_0}}
= \sqrt{\frac{3(1.38\times10^{-23})(0.050)}
{(2\times10^{27})(4\pi\times10^{-7})}}
= 2.9\times10^{-23}\ {\rm J/T} \approx 3.1\,\mu_B.
$$

With $g=2$ this gives $J(J+1)\approx2.4$, $J\approx1.1$: about two unpaired
electrons per ion. A straight line on a lab plot counted electrons without
touching the sample's chemistry — and a *curved* line would have been a
finding too, announcing interactions (section 4) or a second magnetic phase.

## 3. Exchange: the interaction that is not magnetic

Why do the moments in iron align? Not because of their magnetic fields: the
dipole energy between two Bohr magnetons at an interatomic spacing is

$$
E_{\rm dip} \sim \frac{\mu_0\mu_B^2}{4\pi a^3} \approx 5\times10^{-24}\ {\rm J}
\approx 0.03\ {\rm meV},
$$

equivalent to a few kelvin — yet iron holds its order to 1043 K. The
alignment energy is **exchange**: an electrostatic effect. The Pauli
principle forces the two-electron wavefunction to be antisymmetric overall,
which couples the spin configuration to the spatial configuration, and the
spatial configuration sets the Coulomb energy. The energy difference between
parallel and antiparallel spins is written as an effective spin-spin coupling,

$$
E = -2\mathcal{J}\,\vec{S}_1\cdot\vec{S}_2,
$$

with exchange integral $\mathcal{J}$ of order 10 meV — a thousand times the
dipole energy, chemistry-scale, and the reason room-temperature magnetism
exists at all. Its sign is a detail of orbital overlap: positive
$\mathcal{J}$ gives **ferromagnetism** (parallel neighbours), negative gives
**antiferromagnetism** (antiparallel), and two antiparallel sublattices of
unequal moment give **ferrimagnetism** — the ferrites, whose practical charm
is being magnetically ordered yet electrically insulating, so they work at
frequencies where a metal core would be one large eddy-current loss (lesson
2 prices this).

## 4. Mean-field theory and the Curie point

The cheapest honest model of collective order replaces each moment's
neighbours with an average: an effective **molecular field** proportional to
the magnetization itself, $H_{\rm eff} = H + \lambda M$. Self-consistency
then closes the loop — the magnetization both creates and responds to the
field:

$$
M = M_s\,B_J\!\left(\frac{g\mu_B J\,\mu_0(H+\lambda M)}{k_BT}\right).
$$

At zero applied field this equation has a non-zero solution only below a
critical temperature: the **Curie temperature**

$$
T_C = \frac{n\,g^2\mu_B^2\,J(J+1)\,\mu_0\lambda}{3k_B},
$$

proportional to the exchange through $\lambda$. Solving the self-consistency
numerically gives the classic order-parameter curve:

![Mean-field spontaneous magnetization against reduced temperature for three J values, from the self-consistent Weiss equation: flat at low temperature, collapsing vertically at the Curie point.](/courses/electronic-devices/figures/m20-mean-field.svg)

The shape teaches the mechanism. At low temperature the order is nearly
complete and nearly flat: each moment sits in the full molecular field of
its aligned neighbours. Near $T_C$ the collapse is self-accelerating — every
moment that disorders weakens the field holding the others, which is why the
curve ends vertically rather than tapering. Above $T_C$ the material is a
paramagnet, but not a free one: the same expansion that gave the Curie law
now gives the **Curie-Weiss law**,

$$
\chi = \frac{C}{T-\theta},
$$

with $\theta>0$ (and $\approx T_C$ in mean field) for ferromagnetic
exchange, $\theta<0$ for antiferromagnetic. One straight-line extrapolation
of $1/\chi$ therefore reads out the sign and strength of an interaction that
no magnetometer can see directly:

![Inverse susceptibility against temperature for the three exchange cases: the extrapolated intercept is positive for ferromagnetic coupling, zero for free moments, negative for antiferromagnetic.](/courses/electronic-devices/figures/m20-curie-weiss.svg)

Antiferromagnets have their own critical point, the **Néel temperature**
$T_N$, below which the sublattices order with no net moment. For fifty years
that made them curiosities — famously dismissed as interesting but useless
by their own theorist. Lesson 4 will show how completely that verdict has
been reversed: the pinning layers in every spin valve and the fastest
switching media in the laboratory are antiferromagnets.

### Worked example 4.1 — the exchange field

Estimate the molecular field inside iron at low temperature. Mean field says
$k_BT_C \sim \mu_B\,\mu_0 H_{\rm mol}$ within factors of order one, so

$$
\mu_0 H_{\rm mol} \sim \frac{k_B T_C}{\mu_B}
= \frac{(1.38\times10^{-23})(1043)}{9.27\times10^{-24}} \approx 1.5\times10^{3}\ {\rm T}.
$$

Fifteen hundred tesla — a hundred times any laboratory magnet, holding every
iron moment in line. The lesson's central number: exchange is not a
perturbation on magnetostatics; it is a different force wearing magnetic
units.

### Worked example 4.2 — why nickel quits at 358 °C

A magnetic sensor specified to 400 °C is prototyped with a nickel element
($T_C = 631$ K). Predict the failure mode. At 673 K the element is *above*
its Curie point: the spontaneous magnetization is zero and the sensor reads
only a weak Curie-Weiss paramagnetism, falling as $1/(T-\theta)$. Worse, the
approach is steep: by the mean-field curve, at $T/T_C = 0.95$ (600 K) the
magnetization has already lost about a third of its zero-temperature value,
so the sensor drifts severely long before it dies. Materials are chosen with
$T_C$ comfortably — not marginally — above the operating window; permalloy
heads and NdFeB rotors (lesson 2) both obey this rule, and its violation is
a recurring root-cause in failure reviews.

## 5. Graduate extension: itinerant magnetism and the Stoner criterion

The local-moment picture above fails quietly for the very metals that matter
most: iron's 2.2 $\mu_B$ is no integer multiple of anything. In the band
picture, ferromagnetism is a *spontaneous spin-splitting of the conduction
band*: the spin-up and spin-down sub-bands shift rigidly by the exchange
energy, transferring electrons from one to the other until the kinetic-energy
cost of the transfer balances the exchange gain. The instability condition —
the **Stoner criterion** —

$$
I\,g(E_F) > 1
$$

says a metal magnetizes when the product of the exchange integral $I$ and
the density of states at the Fermi level exceeds unity. It explains the
census: Fe, Co and Ni have narrow 3d bands (large $g(E_F)$) and pass;
palladium famously *almost* passes — its product sits just below unity — and
instead amplifies any moment placed in it; broad-band metals fail without
drama. The non-integer moments fall out immediately — the split sub-band
populations need not differ by an integer per atom.

Two more consequences matter downstream. The spin-split band structure means
the electrons at the Fermi level — the only ones that conduct — carry a net
spin polarization $P$, the single most important number in lesson 5's tunnel
junctions. And the exchange splitting collapses at $T_C$ along with the
order, which couples magnetism to transport, giving the resistivity anomaly
at the Curie point that instrument-makers use as a self-calibrating
temperature reference.

## 6. Problems

**P20.1** Gadolinium has $J=7/2$, $g=2$, $n=3.0\times10^{28}$ m⁻³.
Compute its Curie constant and its susceptibility at 350 K (it is
paramagnetic there; $T_C = 293$ K — use Curie-Weiss with
$\theta = 293$ K).

**P20.2** At what combination of field and temperature does a $J=1/2$,
$g=2$ paramagnet reach 90% of saturation? Give the required $B/T$ ratio in
T/K, and comment on why adiabatic demagnetization refrigerators operate in
millikelvin territory.

**P20.3** Show that the Brillouin function reduces to $\tanh x$ for
$J=1/2$ and to the Langevin function as $J\to\infty$.

**P20.4** A material shows $1/\chi$ extrapolating to $-85$ K. Classify its
dominant exchange, and predict qualitatively what its magnetization curve at
4 K looks like compared with a ferromagnet of the same moment density.

**P20.5** From the mean-field expression for $T_C$, estimate the exchange
constant $\lambda$ for iron ($T_C = 1043$ K, $n = 8.5\times10^{28}$ m⁻³,
moment 2.2 $\mu_B$; take $J(J+1)g^2\mu_B^2 \to \mu^2$ for the estimate),
and verify it reproduces worked example 4.1's molecular field within
factors of order one.

**P20.6** Pauli susceptibility is $\chi_P = \mu_0\mu_B^2 g(E_F)$. Explain
in one paragraph, using module 18's degenerate-gas argument, why it is
temperature-independent while Curie susceptibility is not — and why the
same argument made electronic heat capacity linear in $T$.

### Answers

**A20.1** $C = n\mu_0 g^2\mu_B^2 J(J+1)/3k_B$: with $J(J+1)=15.75$,
$g^2\mu_B^2 J(J+1) = 5.4\times10^{-45}$ J²/T², so
$C = (3.0\times10^{28})(4\pi\times10^{-7})(5.4\times10^{-45}) /
(3\cdot1.38\times10^{-23}) \approx 4.9$ K. Then
$\chi(350) = 4.9/(350-293) \approx 0.086$ — enormous by paramagnet
standards, because 350 K sits close above the ordering point.

**A20.2** $\tanh x = 0.9$ at $x = 1.47$, so $\mu_B B/k_BT = 1.47$ and
$B/T = 1.47\,k_B/\mu_B \approx 2.2$ T/K. At 1 K that is a feasible 2.2 T; at
300 K it is 660 T — hence magnetic cooling is a cryogenic technique.

**A20.3** For $J=1/2$ the two-orientation partition function gives
$M/M_s = \tanh x$ directly, and the general $B_J$ collapses to it via
$\coth 2u = \frac{1}{2}(\coth u + \tanh u)$. For $J\to\infty$ the $2J+1$
discrete orientations become a continuum and the orientation sum becomes
Langevin's integral; expanding both at small argument shows the leading
$x/3$ terms agree.

**A20.4** $\theta<0$: antiferromagnetic exchange. Below its Néel point the
net magnetization stays near zero in small fields — the sublattices cancel —
so its $M(H)$ is a shallow line, not a saturating curve; large fields
against the anisotropy produce spin-flop behaviour, which the supplement's
veto list marks as beyond this module's scope.

**A20.5** $\lambda = 3k_BT_C/(n\mu_0\mu^2)$ with $\mu = 2.2\mu_B =
2.04\times10^{-23}$ J/T: $\lambda = (3\cdot1.38\times10^{-23}\cdot1043)/
[(8.5\times10^{28})(4\pi\times10^{-7})(4.2\times10^{-46})] \approx 963$.
Molecular field $\mu_0\lambda M_s = \mu_0\lambda n\mu \approx
(4\pi\times10^{-7})(963)(8.5\times10^{28})(2.04\times10^{-23}) \approx
2.1\times10^{3}$ T — same order as worked example 4.1, as it must be.

**A20.6** Only electrons within $\sim k_BT$ of $E_F$ can change state; the
fraction that can respond to the field grows as $T$ while each response
falls as $1/T$, and the two cancel. The same window argument gave
$c_v \propto T$: both quantities count the responsive fraction of a
degenerate sea, one against a field, one against heat.
