# Writing with Spin: Torques, MRAM and the Memory Ledger

<!-- covers: 20.3 -->

Lesson 5 read magnetic states; this lesson writes them. The enabling idea
inverts GMR: if a magnetic layer polarizes a current, then a polarized
current must, by conservation of angular momentum, exert a **torque** on a
magnetic layer. Discovered on paper in 1996 and in silicon a few years
later, spin-transfer torque turned the magnetic bit from a field-addressed
liability into a current-addressed, transistor-selected memory cell — and
opened a chapter of the memory industry that this lesson prices against
the incumbents with the course's usual ledger discipline.

**Level.** Sections 1 to 4 undergraduate core; section 5 graduate; section 6
problems.

## 1. Spin-transfer torque: angular momentum bookkeeping

Pass a current through an MTJ. The reference layer polarizes it; the free
layer, if misaligned, absorbs the transverse component of that spin flux.
Absorbed angular momentum per unit time is a torque, and per unit moment it
competes with the damping that otherwise relaxes the free layer into its
easy axis. Balancing spin influx against Gilbert damping gives the
**critical current** for switching a perpendicular cell:

$$
I_{c0} = \frac{2e}{\hbar}\,\frac{\alpha_G}{\eta}\,E_b\cdot 2
\;\sim\; \frac{4e\,\alpha_G}{\hbar\,\eta}\,k_BT\,\Delta,
$$

where $\alpha_G$ is the damping constant (~0.005–0.02), $\eta$ the spin
polarization efficiency, and $E_b = \Delta k_BT$ the very retention barrier
of lesson 3. The proportionality $I_{c0} \propto \Delta$ is the
architecture's central tension: *the same barrier that keeps the bit for
ten years taxes every write*. All device engineering in this lesson is an
attempt to loosen that coupling.

Two features distinguish the torque from a field. It acts only on the
addressed junction — no half-select disturbs, the failure that killed
field-written MRAM (lesson 3's astroid problem). And its sign follows
current direction: one polarity writes P, the reverse writes AP, so the
select transistor is the whole addressing scheme.

### Worked example 1.1 — the write current

A perpendicular cell has $\Delta = 60$ at 300 K, $\alpha_G = 0.01$,
$\eta = 0.6$. Estimate $I_{c0}$:

$$
I_{c0} \approx \frac{4e\,\alpha_G}{\hbar\,\eta}\,k_BT\,\Delta
= \frac{4(1.6\times10^{-19})(0.01)}
{(1.05\times10^{-34})(0.6)}\,(4.14\times10^{-21})(60)
\approx 25\ {\rm \mu A}.
$$

Tens of microamps — comfortably within a minimum-size logic transistor's
drive, which is precisely the threshold that made STT-MRAM integrable. The
formula also displays every lever: halve the damping, halve the current;
raise polarization efficiency (MgO's filtering, lesson 5), gain again;
and note what is *absent* — the cell area. Unlike field writing, whose
current scaled catastrophically as cells shrank, spin torque rides the
scaling curve.

## 2. Thermally assisted switching: the pulse-width dial

At currents below $I_{c0}$, the torque does not switch the cell — it
*lowers the effective barrier*, and temperature does the rest. The
switching probability for a pulse of width $t_p$ follows the Néel
statistics of lesson 3 with a tilted barrier:

$$
P_{sw} = 1 - \exp\!\left[-\frac{t_p}{\tau_0}
e^{-\Delta\left(1 - I/I_{c0}\right)}\right].
$$

![Computed switching probability against drive current for three pulse widths in the thermally assisted model: slow writes complete well below the critical current because thermal activation pays part of the barrier.](/courses/electronic-devices/figures/m20-stt-switching.svg)

The curves order themselves by patience: a millisecond pulse switches at
~75% of $I_{c0}$, a 10 ns pulse demands essentially the full current. This
is a genuine engineering dial — but its steepness is also the *write error
rate* problem: a memory needs $P_{sw}$ not near 1 but near
$1 - 10^{-9}$, far up the sigmoid's tail, so practical write currents
carry substantial overdrive above the 50% point, and write-error-rate
characterization (repeating the write billions of times per condition) is
a standard, expensive step in MRAM qualification.

## 3. The retention-write-read triangle

The MRAM cell lives inside a three-way constraint that reprises lesson 3's
recording trilemma in transistor-connected form:

- **Retention** demands $\Delta \gtrsim 60$–80 (population statistics,
  lesson 3 section 5) — pushing barrier, hence write current, up.

![Mean retention time against the thermal stability factor with the ten-year landmark: the exponential that converts a dimensionless barrier into a warranty clause.](/courses/electronic-devices/figures/m20-retention.svg)

- **Writability** demands $I_{c0}$ within a small transistor's drive and
  an energy per write competitive with DRAM's — pushing $\Delta$ down and
  favouring low damping and high $\eta$.
- **Readability** demands sensing current well *below* the switching
  threshold (or reads become writes — read disturb), yet large enough to
  resolve P from AP quickly through the TMR ratio: pushing for high TMR
  and a read/write current separation of at least an order of magnitude.

A fourth wall closes the room: the tunnel barrier must survive every write
pulse's voltage for $10^{15}$ cycles — time-dependent dielectric breakdown,
module 12's oxide reliability physics returned at two nanometres
thickness. The design that threads all four is the perpendicular
CoFeB/MgO cell of lesson 4: PMA supplies barrier without a wide cell,
MgO supplies TMR and polarization, and the interplay of four modules'
physics in one 30 nm pillar is as integrated as anything this course
builds.

### Worked example 3.1 — read disturb as Néel arithmetic

A cell with $\Delta = 65$ is read at $I_{read} = 0.15\,I_{c0}$ for 20 ns,
$10^{12}$ times over its life. Disturb probability per read
$\approx (t_p/\tau_0)e^{-\Delta(1-0.15)} =
(20\times10^{-9}/10^{-9})e^{-55.25} \approx 2\times10^{-23}$; over
$10^{12}$ reads, $2\times10^{-11}$ — negligible. Repeat at
$I_{read} = 0.4\,I_{c0}$: per-read $\approx 20\,e^{-39} \approx
2.4\times10^{-16}$, lifetime $\approx 2\times10^{-4}$: one bit in five
thousand flips during service. The margin between harmless and warranty
event was a factor 2.7 in read current — the kind of exponential
sensitivity this course has learned to respect since the first tunneling
lesson, now applied to a *read* operation.

## 4. The ledger: where MRAM actually fits

The course's memory ledger (module 17's device-physics-of-the-ledger
method) placed each technology by density, speed, energy, endurance and
volatility. Enter STT-MRAM's row: nonvolatile; read ~10 ns, write
~10–50 ns; endurance $10^{12}$–$10^{15}$ (barrier-limited); write energy
~100 fJ/bit; density below DRAM (the select transistor plus a
magnetics-compatible back-end). That row does not beat DRAM at DRAM's
game or flash at flash's. Its wins are *combinational*: faster and
vastly more endurant than flash, nonvolatile unlike SRAM/DRAM, radiation-
hard (no stored charge to upset — module 21's soft-error physics simply
does not apply), and embeddable in a logic process at temperatures flash
cannot tolerate. Hence its actual products: embedded nonvolatile memory
replacing NOR flash in microcontrollers, last-level cache experiments,
aerospace and industrial buffers. The honest summary this platform owes
its readers: MRAM is not the universal memory its early press promised;
it is a real, shipping, niche-winning technology whose niches are chosen
by exactly the four-constraint arithmetic of section 3.

Spin-orbit torque (SOT) — writing with an in-plane current through an
adjacent heavy metal, via the spin Hall effect separating the two spin
species — decouples the write path from the tunnel barrier entirely: the
read junction no longer endures write voltage, removing the breakdown
wall and promising cache-class speed. Its price is a three-terminal cell
(area) and, at this writing, product maturity a generation behind STT.
The pattern is lesson 4's once more: each new torque is a new interface
resource, and each buys one constraint with another.

## 5. Graduate extension: precession, damping and the nanosecond wall

Why is a magnetic write nanoseconds and not picoseconds? Magnetization
does not move toward a field; it *precesses around* it, at the Larmor
frequency $f = \gamma B/2\pi \approx 28$ GHz/T. Switching proceeds by
spiraling out of one well and into the other, and the spiral's pitch is
set by the damping $\alpha_G$: small damping means many precession cycles
to shed the well's energy — but also small $I_{c0}$ (section 1). Write
speed and write current are thus *the same knob turned opposite ways*,
through $\alpha_G$. The known escapes each break an assumption:
precessional switching applies a calibrated field pulse for exactly half
a precession period (fast, but timing-fragile); SOT's torque geometry
permits sub-ns deterministic switching with an assist field; voltage-
controlled anisotropy momentarily lowers the barrier electrically rather
than fighting it with angular momentum; and antiferromagnetic media
(lesson 1's redemption arc completed) precess at *terahertz* internal
frequencies, holding out picosecond writes if reading them can be solved.
The frontier, stated in course terms: every magnetic write is an angular-
momentum transaction, and the exchange rate — how much energy and time
per unit of angular momentum moved — is set by interfaces, damping and
topology, the three resources this module has spent its second half
cataloguing.

## 6. Problems

**P20.31** Recompute worked example 1.1's $I_{c0}$ with damping raised to
$\alpha_G = 0.02$ (a common penalty of adding a capping layer) and
$\eta$ lowered to 0.4. What write-energy multiple results for the same
20 ns pulse at fixed voltage-per-current?

**P20.32** Using the thermally assisted formula, find the drive
$I/I_{c0}$ at which a 10 ns pulse achieves $P_{sw} = 0.5$ for
$\Delta = 60$, $\tau_0 = 1$ ns. (Solve
$e^{-\Delta(1-x)} = \ln 2/(t_p/\tau_0)$.)

**P20.33** A cell family scales from 40 nm to 28 nm diameter at fixed
thickness and $K_{\rm eff}$. By what factor does $\Delta$ fall, and what
must the anisotropy do to restore $\Delta = 65$? Name the lesson-4
resource that supplies it and its process risk.

**P20.34** Show from section 3's numbers why an order-of-magnitude
read/write separation implies TMR matters for read *speed*: estimate the
sensing time advantage of TMR = 200% over 50% for a fixed
current-integrating sense amplifier (signal $\propto \Delta R \cdot I$,
time $\propto 1/{\rm signal}^2$ at fixed noise).

**P20.35** An SOT cell writes through a heavy-metal line at
$10^{12}$ A/m² for 2 ns without any current through the barrier. State
the two constraint-walls of section 3 that this relaxes, and the new cost
it introduces at the array level.

**P20.36** Antiferromagnetic memory would have no stray fields and THz
dynamics. Using this module's toolkit, name the two device functions that
become *harder* without a net moment, and one lesson-5 mechanism that
still works.

### Answers

**A20.31** $I_{c0}$ scales by $(\alpha_G/\eta)$: factor
$(0.02/0.4)/(0.01/0.6) = 3$. Write energy $\propto I^2$ at fixed
resistance: ~9×. A packaging-driven materials change tripled the current
and nearly decimated the energy budget — the budget-sheet habit of lesson
4 section 5 exists for exactly this.

**A20.32** $t_p/\tau_0 = 10$: need $e^{-60(1-x)} = 0.0693$, so
$60(1-x) = 2.67$, $x = 0.955$. A fast pulse operates within 5% of the
full critical current — thermal help is negligible on nanosecond
timescales, consistent with the figure's rightmost curve.

**A20.33** $\Delta \propto V \propto d^2$: factor $(28/40)^2 = 0.49$ —
barrier halves. Restoring 65 needs $K_{\rm eff}$ up ×2:
interface anisotropy $K_s/t$ (thinner free layer or better interface).
Risk: the thinner layer sits closer to the interdiffusion cliff, and
$M_s$ dispersion across the wafer becomes retention dispersion — the
lesson-3 tail problem in manufacturing form.

**A20.34** Signal ratio $(\Delta R/R)$: 200% vs 50% is 4× the relative
resistance change, so 4× the signal at fixed read current; integration
time for fixed SNR falls as $1/16$. High TMR is not luxury — it is the
difference between a 30 ns and a 2 ns read at equal error rate.

**A20.35** Relaxes: (i) the barrier-breakdown wall (no write voltage
across MgO), (ii) the read-disturb wall (read and write paths separate,
so read current no longer trades against switching threshold). New cost:
a third terminal and second access device per cell — array density and
the peripheral routing budget pay for the physics.

**A20.36** Harder: (i) *reading* — no net moment means no TMR of the
ordinary kind; (ii) *selective addressing by field* — nothing couples to
a uniform field to first order. Still works: tunneling anisotropic
magnetoresistance / spin-orbit readout via the antiferromagnet's
sublattice orientation influencing interface states — a lesson-5-style
density-of-states effect that needs no net magnetization.
