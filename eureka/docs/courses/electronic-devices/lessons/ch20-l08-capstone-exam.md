# Module 20 Capstone: Design Cases and the Comprehensive Exam

<!-- covers: 20.1, 20.2, 20.3 -->

The working lessons built the toolkit; this capstone spends it. Four design
cases run the module's machinery end-to-end the way a review board would —
each a realistic brief, worked to numbers, with the failure modes named.
The comprehensive exam follows, then oral-defense prompts in the course's
standard format.

**Level.** Integrative; assumes lessons 1 to 7.

## Case 1 — a core material for a 2 MHz point-of-load converter

*Brief.* A 2 MHz switching converter needs an inductor core: ripple flux
30 mT, volume constrained, efficiency paramount.

*Analysis.* Frequency disqualifies electrical steel instantly: lesson 2's
eddy scaling $P_e \propto f^2B^2d^2/\rho$ at 2 MHz makes any conductive
lamination a heater. The candidates are ferrites and powdered-iron
composites. Snoek's rule prices the ferrite family: needing useful
response at 2 MHz with margin (resonance at, say, 10 MHz) allows

$$
\mu_i \lesssim 1 + \frac{3\times10^{9}}{10^{7}} \approx 300,
$$

comfortably available in NiZn and mid-grade MnZn material. Core loss at
30 mT/2 MHz then selects between specific power-loss grades — the
figure-of-merit printed by every ferrite vendor as loss density at stated
$(B, f, T)$, honest to lesson 7's conditions rule. The composite
alternative distributes an air gap through the material, buying saturation
headroom and loss at high bias but at $\mu_r \sim 20$–100.

*Decision.* Power ferrite for lowest loss at small bias; composite if the
inductor sees large DC bias (module 22's regulators). Failure mode to
brief: ferrite loss density has a temperature *minimum* near 80–100 °C by
design — a unit cooled too aggressively runs *worse*, a genuinely
counterintuitive thermal spec worth a sentence in any review.

## Case 2 — sizing an MRAM node against DRAM refresh

*Brief.* An embedded controller spends 12% of its power budget refreshing
DRAM during idle. Would an STT-MRAM buffer of the same capacity pay?

*Analysis.* The MRAM cell holds data at zero power with
$\Delta \ge 60$: idle power falls to leakage only. The costs move to the
write path. Per-bit write energy, lesson 6:

$$
E_w \approx I_{c0}\,V\,t_p \approx
(30\ {\rm \mu A})(0.5\ {\rm V})(20\ {\rm ns}) \approx 0.3\ {\rm pJ},
$$

roughly an order above DRAM's per-bit write. The ledger therefore hinges
on *duty cycle*: a buffer written continuously loses; one written
occasionally and holding for long idle stretches wins by the whole refresh
budget. Quantitatively, with idle fraction $\iota$ and write bandwidth
$W$, MRAM wins when

$$
\iota\,P_{\rm refresh} > W\,(E_w^{\rm MRAM} - E_w^{\rm DRAM}),
$$

which for the controller's telemetry (idle-dominated, kilobyte-per-second
logging) is satisfied by three orders of magnitude.

*Decision.* Adopt for the idle-dominated buffer; retain DRAM for the
working set. Brief the review on endurance: $10^{12}$ writes at the log
rate is centuries, but a firmware bug that hot-loops a status word into
one address is the realistic killer — wear-leveling even "eternal"
memories is cheap insurance, a lesson flash taught the industry once
already.

## Case 3 — a nanoparticle assay's magnetic design

*Brief.* A lateral-flow diagnostic wants magnetic labels readable by a
GMR strip sensor: maximum moment per particle, zero clustering in storage.

*Analysis.* Zero clustering demands superparamagnetism at shelf
conditions — lesson 3's arithmetic with the *measurement time* being the
shelf life. For $\tau < 1$ s at 300 K, $\Delta < 25.3$:
magnetite's $K = 1.4\times10^{4}$ J/m³ caps the core at

$$
V < \frac{25.3\,k_BT}{K} \approx 7.5\times10^{-24}\ {\rm m^3}
\;\Rightarrow\; d < 24\ {\rm nm}.
$$

Moment per particle then scales as $M_sV \propto d^3$: the design wants
the *largest* diameter under the cap — 20 nm cores, or better, clusters
of small cores in a polymer shell (large total moment, each core
individually superparamagnetic; the shell prevents exchange between
cores). Sensor side: lesson 5's family portrait picks GMR over TMR here —
the strip works in liquid proximity with modest fields, where robustness
and cost dominate raw signal.

*Decision.* 100 nm polymer beads carrying ~20 nm magnetite cores, GMR
readout. The named failure mode: drying artifacts concentrating beads
into transient clusters whose *collective* dipole fields imprint the
sensor — mitigated by the zero-remanence design itself, which is why the
superparamagnetic cap is a hard spec, not a preference.

## Case 4 — post-mortem: the demagnetized rotor

*Brief.* A traction-motor batch returns with 8% torque loss after summer
service in a hot climate. Magnets: sintered NdFeB, spec'd to 150 °C.

*Analysis.* NdFeB's Achilles heel is temperature: coercivity falls
steeply with $T$ (its $T_C$ of ~585 K is low among hard magnets, and
$H_c$ falls faster than $B_r$). At the hottest corner of the operating
envelope, the second-quadrant load line (lesson 2) swings toward the
knee of the $B(H)$ curve; past the knee, reversal domains nucleate
(Brown's paradox territory — lesson 2 section 5) and the loss is
*irreversible*: the magnet returns cooled but not recovered. The 8%
figure and its distribution across the batch discriminate hypotheses: a
uniform loss says thermal excursion beyond the knee; a tail of severe
units says corner chipping or a low-coercivity sinter lot (lesson 2's
weakest-link statistics).

*Decision path.* Loop-trace samples (cheap, lesson 2's canary); if lot
coercivity is on-spec, the fix is thermal — derate the envelope or move
to a higher-coercivity grade. The grade fix has a supply-chain
price: heavy-rare-earth doping, module 17's strategy cases

returning with a vengeance. The case's teaching: a magnet spec is a
*trajectory* constraint — the worst simultaneous $(T, H)$ point of the
service life, not the nameplate maximum of either alone.

## Comprehensive exam

**X20.1** Derive the Curie law from the small-argument Langevin function,
stating where the $1/3$ arises, and give the two experimental signatures
that distinguish Curie paramagnetism from Pauli paramagnetism.

**X20.2** A material's $1/\chi$ plot is straight above 400 K with
intercept $+380$ K, but curves away below. Interpret both features and
predict the ordering temperature's relation to 380 K in real (non-mean-
field) materials.

**X20.3** From $A = 1.5\times10^{-11}$ J/m and a measured wall width of
40 nm, extract $K$ and the wall energy, and classify the material on the
soft/hard axis.

**X20.4** A film's hysteresis loop is square with $M_r/M_s = 0.98$ when
measured along one in-plane axis and nearly closed (anhysteretic) at 90°.
What does this say about its anisotropy, and which two figures of this
module would you use to model its switching?

**X20.5** Prove that for the ideal straight-line demagnetization
characteristic, $(BH)_{max}$ occurs exactly at $B = B_r/2$ and equals
$B_r^2/4\mu_0$.

**X20.6** A 12 nm cobalt particle: single-domain or multi-domain? Blocked
or superparamagnetic on a 100 s magnetometer at 300 K? Use Table 1/2
values and show both criteria.

**X20.7** Explain why the recording trilemma cannot be solved by
simultaneously raising $K$ and lowering grain count per bit, and name
which vertex each historical escape (perpendicular media, composite
grains, HAMR) attacked.

**X20.8** An MTJ stack loses its exchange bias after a 280 °C solder
step. Name the mechanism, the stack parameter that sets this limit, and
the recovery procedure — and explain why the recovery works.

**X20.9** Two nominally identical spin valves show GMR of 8% and 5%.
List three stack-level causes (not bulk material causes) consistent with
lesson 5's dilution factors, and one measurement to separate them.

**X20.10** Derive Julliere's formula from spin-channel state counting,
then state the two assumptions MgO junctions violate and the observable
consequence of each.

**X20.11** For a perpendicular cell with $\Delta = 70$ and
$\tau_0 = 1$ ns, compute the mean time to thermal flip and the flip
probability of one bit in ten years. Then compute the expected number of
failures in a 1 Gb array over ten years and state whether error
correction suffices.

**X20.12** Show that STT write current is independent of cell area at
fixed $\Delta$ (combine $I_{c0} \propto E_b$ with $E_b = \Delta k_BT$),
and explain why this made STT-MRAM scalable where field-write was not.

**X20.13** A read current of $0.3I_{c0}$ is proposed to speed sensing.
Using the thermally assisted exponent, estimate the change in disturb
rate relative to $0.15I_{c0}$ for $\Delta = 65$, and rule on the
proposal.

**X20.14** Sketch (in words) the energy landscape of a Stoner-Wohlfarth
particle at the astroid boundary for a 45° field, and explain why
switching there is thermally assisted in practice at finite temperature.

**X20.15** The module claims "every practical spin device is a tunnel
junction by circuit theorem." Reconstruct the conductivity-mismatch
argument in four sentences and name the theorem-breaking exception this
module itself introduced.

**X20.16** Integrative: trace one bit of data written to an STT-MRAM
cell through every energy scale of this module — exchange, anisotropy,
magnetostatics, thermal, and the angular-momentum transaction — naming
where each lesson's physics enters.

### Answers

**A-X20.1** $L(x)\approx x/3$ with $x = \mu\mu_0H/k_BT$ gives
$\chi = n\mu_0\mu^2/3k_BT$; the 1/3 is the spherical orientation average
(supplement section 1). Signatures: Curie $\chi \propto 1/T$ and
saturates at feasible $B/T$; Pauli is $T$-independent and unsaturable in
practice (only the Fermi window responds).

**A-X20.2** Straight Curie-Weiss regime: local moments with net
ferromagnetic exchange, $\theta = 380$ K. Downward curvature approaching
order: short-range correlations growing before true order. Real $T_C$
falls *below* $\theta$ (fluctuations delay ordering), typically by
5–20%.

**A-X20.3** $\delta = \pi\sqrt{A/K} \Rightarrow K = A\pi^2/\delta^2 =
(1.5\times10^{-11})(9.87)/(1.6\times10^{-15}) \approx 9.3\times10^{4}$
J/m³; $\sigma_w = 4\sqrt{AK} \approx 4.7\times10^{-3}$ J/m². Between Fe
and Co in Table 2: moderately soft — usable core material, never a
permanent magnet.

**A-X20.4** Strong uniaxial in-plane anisotropy: easy axis along the
square-loop direction, hard axis at 90° showing coherent rotation
(closed, linear). Model with the Stoner-Wohlfarth astroid (switching)
plus the hysteresis-loop figure (easy-axis square loop) — the film is the
textbook single-domain case writ large.

**A-X20.5** $B = B_r + \mu_0H$ on the line (H negative);
$|BH| = -(B_r+\mu_0H)H/1$. Maximize: $d/dH[-(B_rH + \mu_0H^2)] =
-(B_r + 2\mu_0H) = 0 \Rightarrow \mu_0H = -B_r/2$, so $B = B_r/2$ and
$|BH| = (B_r/2)(B_r/2\mu_0) = B_r^2/4\mu_0$.

**A-X20.6** $d_c$ for Co: $72\sqrt{AK}/\mu_0M_s^2 =
72\sqrt{(3\times10^{-11})(4.5\times10^{5})}/
[(4\pi\times10^{-7})(2.07\times10^{12})] \approx 102$ nm: 12 nm is
single-domain. Barrier: $KV = (4.5\times10^{5})(9.05\times10^{-25}) =
4.1\times10^{-19}$ J; $\Delta = 98$ at 300 K: solidly blocked. A
single-domain, thermally stable switch — recording-grade.

**A-X20.7** Raising $K$ breaks writability ($H_K = 2K/\mu_0M_s$ exceeds
head fields); lowering grain count breaks SNR ($\propto\sqrt{N}$); the
two moves also compound each other's failure. Perpendicular: writability
(better head-field geometry). Composite: writability (soft handle) while
holding retention. HAMR: writability by temporarily destroying $K$ at
the Curie point.

**A-X20.8** The step exceeded the antiferromagnet's blocking temperature:
interface spins unfroze and the bias direction randomized (or rotated
toward stray fields). Limiting parameter: the AF layer's $T_B$
(IrMn ~250 °C class). Recovery: field-cool anneal — reheat above $T_B$,
apply a saturating field to align the ferromagnet, cool; the AF interface
refreezes against the aligned layer, resetting the bias by the same
mechanism that manufactured it.

**A-X20.9** (i) spacer thickness drift (spin memory loss / shunting),
(ii) interface roughness or intermixing lowering interfacial
spin-dependent scattering, (iii) incomplete antiparallel alignment
(weakened SAF or pinning, so the "AP" state is canted). Separator: a
full transfer-curve trace — canted alignment shows as loop distortion,
while interface degradation lowers $\Delta R$ with clean loop shape.

**A-X20.10** Derivation as supplement section 5. Violated assumptions:
(a) tunneling independent of orbital symmetry — MgO transmits one
symmetry preferentially, observable as TMR far exceeding electrode-$P$
predictions; (b) polarization a property of electrodes alone — observable
as "effective $P$" depending on barrier crystallinity and annealing,
i.e. the same electrodes giving different $P$ in different stacks.

**A-X20.11** $\tau = \tau_0e^{\Delta} = 10^{-9}e^{70} \approx
2.5\times10^{21}$ s. Ten years $= 3.15\times10^{8}$ s:
$P \approx t/\tau = 1.2\times10^{-13}$ per bit. In $10^{9}$ bits:
$\approx 1.2\times10^{-4}$ expected failures — ECC trivially suffices;
the array is retention-limited by extrinsic defects, not thermal
physics.

**A-X20.12** $I_{c0} \propto E_b/(\hbar/e)\cdot(\alpha_G/\eta)$ and
$E_b = \Delta k_BT$ is fixed by the retention spec, not by area: a
smaller cell needs higher $K_{\rm eff}$ to hold the same $\Delta$, but
the *current* target is unchanged, while the transistor behind it shrinks
with the node. Field-write current, by contrast, had to generate a fixed
$H$ from an ever-thinner wire — scaling against itself.

**A-X20.13** Exponent change: $\Delta(1-I/I_{c0})$ moves from
$65(0.85) = 55.25$ to $65(0.7) = 45.5$: disturb rate rises by
$e^{9.75} \approx 1.7\times10^{4}$. Lesson 6's worked example already
sat at $2\times10^{-11}$ lifetime probability; ×$10^{4}$ approaches
$10^{-7}$ — tolerable for some products, not for automotive. Ruling:
reject without a compensating $\Delta$ increase or shorter read pulse;
the proposal spends exponential margin for linear speed.

**A-X20.14** At the boundary, the field has annihilated the barrier
between the initial well and the saddle: the landscape has an
inflection where the well and barrier merge. Just inside the astroid a
vestigial barrier of a few $k_BT$ remains, so thermal kicks complete the
switch early — real switching astroids measured at finite temperature
sit *inside* the zero-temperature curve, by more for slower
measurements (Néel again).

**A-X20.15** A ferromagnetic metal and a semiconductor in series divide
voltage by resistance; the semiconductor dominates by orders of
magnitude, and since its resistance is spin-blind, the current arriving
is unpolarized regardless of the injector. A spin-selective interface
resistance comparable to the semiconductor's — a tunnel barrier —
restores spin-dependent division. Exception introduced by this module:
SOT writing, where no current need cross the junction at all; the
"theorem" governs injection, not torque-by-proximity.

**A-X20.16** Exchange (lesson 1) holds the free layer's moments as one
macrospin; interface anisotropy (lesson 4) builds the barrier that
magnetostatics (lesson 2's shape term) would otherwise flatten; thermal
energy (lesson 3) attacks the barrier continuously, priced by
$\Delta = K_{\rm eff}V/k_BT$; the write is an angular-momentum transfer
(lesson 6) polarized by the reference stack (lessons 4-5: SAF + exchange
bias + MgO filtering), and the read converts alignment to resistance by
tunneling state-counting (lesson 5). One bit, six lessons, one budget
sheet.

## Oral-defense prompts

In the course's standard format — each expects two minutes, one equation,
one number. (1) Defend the claim that exchange is electrostatic, with the
dipole-energy estimate as your foil. (2) Explain to a mechanical engineer
why laminations exist, quantitatively. (3) Justify the $\Delta \ge 60$
retention rule from Néel statistics and fleet size. (4) Argue for or
against replacing a client's AlOx MTJ sensor design with MgO, naming the
manufacturing risk you accept. (5) Explain why MRAM did not replace DRAM,
in ledger terms, without underselling what MRAM did win.
