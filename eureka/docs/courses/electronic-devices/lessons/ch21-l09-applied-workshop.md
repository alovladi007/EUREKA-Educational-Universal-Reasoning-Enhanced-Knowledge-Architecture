# Module 21 Workshop: Three Problems Worked the Long Way

<!-- covers: 21.1, 21.2, 21.3, 21.4 -->

The course's workshop format: real tasks worked at full length, dead
ends included, every step's arithmetic shown as a checkable line. Three
sessions — commissioning a pull-rate window, auditing a denuded-zone
recipe against a customer's thermal budget, and running the numbers on
a contamination excursion — each closing with the error a first-pass
analysis usually makes.

**Level.** Integrative practice; assumes lessons 1 to 8.

## Workshop 1 — commissioning a perfect-silicon window

*Task.* A rebuilt hot zone must grow perfect silicon. Thermal
simulation reports $G(0) = 32$ K/cm and $G(R) = 44$ K/cm at the
interface. Find the pull-rate window and judge feasibility.

*Work.* The neutral corridor requires $v/G(r)$ inside
$(1\pm0.03)\times(v/G)_{crit}$ at every radius. Centre and edge pin
the constraint. At centre:

$$
v = (v/G)_{crit}\,G(0)
= (1.3\times10^{-3})(32) = 0.0416\ {\rm cm/min} = 0.416\ {\rm mm/min}.
$$

At edge:

$$
v = (1.3\times10^{-3})(44) = 0.572\ {\rm mm/min}.
$$

The two radii *demand different pull rates* — but the crystal has only
one. The radial spread of the requirement is

$$
\frac{G(R)}{G(0)} = \frac{44}{32} = 1.375,
$$

a 37% spread against a ±3% corridor: no single $v$ can hold both ends
critical. Feasibility verdict: **not with this hot zone**. The
corridor condition is really a *flatness* condition on $G(r)$:

$$
\frac{G(R)-G(0)}{G(0)} \lesssim 6\%
$$

(the corridor's full width), so the rebuild must add edge shielding
or active heating until the simulated spread collapses by a factor
of six. Only then does the axial problem (scheduling $v$ down the
boule) even begin.

*The usual error.* Commissioning against the *centre* value alone —
the crystal then grows a beautiful perfect-silicon core with an
interstitial rim, passing centre-point sampling and failing the
customer's edge die. Radial acceptance data, not single-point, is the
deliverable; lesson 3's map is the reason.

## Workshop 2 — auditing a denuded zone against a real thermal budget

*Task.* A vendor's RTA-engineered wafer promises a 10 µm denuded zone
and bulk sink strength $rN \ge 10^{4}$ cm⁻² *after* the customer's
flow. The flow's relevant steps: 1050 °C/2 h, then 900 °C/6 h. Audit
the promise.

*Work.* Step 1: does the zone survive? The zone's protection is the
absence of nuclei; the risk is *new* nucleation in the skin during
the customer's steps. Skin oxygen after the vendor's processing:
$5\times10^{17}$ cm⁻³. At 1050 °C (1323 K):

$$
C_{sol} = 9\times10^{22}e^{-1.52/(8.617\times10^{-5}\cdot1323)}
= 9\times10^{22}e^{-13.33} \approx 1.5\times10^{17}\ {\rm cm^{-3}},
$$

$$
S_{skin} = \frac{5\times10^{17}}{1.5\times10^{17}} \approx 3.3.
$$

Sub-threshold by lesson 4's arithmetic (barrier at $S = 3.3$:
$\ln S = 1.19$, and $\Delta G^* \propto 1/\ln^2S$ is ~70× the
burst-level barrier): the skin stays clean. At 900 °C (1173 K):

$$
C_{sol} \approx 9\times10^{22}e^{-15.03} \approx 2.7\times10^{16},
\qquad
S_{skin} \approx 18.
$$

Higher — but homogeneous nucleation at $S = 18$ remains slow, and
6 h at $D_O(1173) \approx 1.0\times10^{-12}$ cm²/s moves oxygen only

$$
\sqrt{4D_Ot} = \sqrt{4(1.0\times10^{-12})(2.16\times10^{4})}
\approx 0.9\ {\rm \mu m},
$$

too little to assemble anything at sparse-nucleus spacings. Zone
survives. Step 2: does the sink strength survive? The 1050 °C step
both grows and ripens the bulk population. Growth first — radius
gain over 2 h with local supersaturation feeding it:

$$
\Delta r \sim \sqrt{2D_O\Omega\,\Delta C\,t}
\;\rightarrow\; {\rm order}\ 20{-}40\ {\rm nm}
$$

(taking the vendor's $r_0 = 40$ nm to ~60 nm; the coarse estimate is
adequate because growth *raises* $rN$). Ripening then trades: if the
long hot exposure dissolves the small tail and the count falls 3×,
conservation ($Nr^3$ fixed) gives

$$
r' = r\,(3)^{1/3} = 60\times1.44 \approx 86\ {\rm nm},
\qquad
r'N' = \frac{rN\times1.44}{3} \approx 0.48\,rN.
$$

Starting from the vendor's as-built $2.5\times10^{4}$ cm⁻²:
end-of-line $rN \approx 1.2\times10^{4}$ — the promise holds, with
20% margin, *provided* the as-built figure is real. Audit output: ask
the vendor for as-built $N$ and $r$ separately (not just the
product), because ripening losses depend on the size distribution's
tail (lesson 4), and a same-product population built as
many-and-small ripens away far more sink strength than few-and-large.

*The usual error.* Auditing the zone (which is robust) and waving
the sink strength through (which is not). The zone fails loudly —
precipitates in the device layer are visible in cross-section — while
sink strength fails silently, surfacing a year later as a lifetime
excursion nobody ties back to the substrate contract.

## Workshop 3 — the iron excursion, priced end to end

*Task.* An ion implanter's contaminated wheel dosed a lot with iron:
surface concentration $3\times10^{12}$ cm⁻². The flow's next step is
1000 °C/1 h. Decide: scrap, or process forward on the internally
gettered substrate ($rN = 1.5\times10^{4}$ cm⁻²)?

*Work.* First, where does the iron go at 1000 °C? Diffusion length:

$$
\sqrt{4D_{Fe}t} = \sqrt{4(3\times10^{-6})(3600)} \approx 0.21\ {\rm cm},
$$

three wafer thicknesses: the dose distributes through the bulk within
minutes. Volumetric concentration on a 775 µm wafer:

$$
C_{Fe} = \frac{3\times10^{12}}{0.0775} \approx 3.9\times10^{13}\ {\rm cm^{-3}},
$$

above solubility at 1000 °C ($\sim3\times10^{13}$ — marginal), and
catastrophically above the device budget of $10^{10}$. Gettering
kinetics:

$$
\tau_g = \frac{1}{4\pi\,rN\,D_{Fe}}
= \frac{1}{4\pi(1.5\times10^{4})(3\times10^{-6})} \approx 1.8\ {\rm s}.
$$

The hour at temperature is $\sim2000\tau_g$: capture is total at
temperature. The real question is the **cool-down**, when captured
iron re-dissolves toward the falling solubility and re-freezes
wherever the last equilibrium leaves it. Iron solubility at 700 °C is
$\sim5\times10^{9}$ cm⁻³; a cool that dwells below 800 °C long enough
for the bulk sinks to re-capture (they do — $\tau_g$ grows to only
minutes at 700 °C with $D_{Fe} \approx 5\times10^{-8}$):

$$
\tau_g(700\ {\rm °C}) = \frac{1}{4\pi(1.5\times10^{4})(5\times10^{-8})}
\approx 106\ {\rm s},
$$

so a controlled ramp (< 3 K/min through 800–650 °C) leaves the
device layer at the sub-$10^{10}$ solubility floor, iron parked in
the bulk precipitates. Fast unload instead would freeze
$\sim10^{12}$-level interstitial iron in the skin — a lifetime
catastrophe and, in p-type, the FeB-pair signature module 23's
surface photovoltage assay reads directly.

*Decision.* Process forward with a modified slow-cool recipe on the
excursion lot plus lifetime mapping on samples; scrap only if the
map's tail fails. Estimated save: the lot; estimated cost: one
recipe deviation and a day of metrology.

*The usual error.* Computing capture at temperature (spectacular)
and skipping the cool-down repartition (decisive). Gettering
verdicts are rendered at 700 °C, not 1000 °C — the module's frozen-
history principle, applied one last time to an impurity instead of a
vacancy.

### Worked example W.1 — the re-emission check in one line

Whether a slow cool suffices reduces to comparing the *release* time
of gettered iron with the ramp time. Release is thermally activated
with the trap's binding ($\sim E_b + E_m \approx 2$ eV effective):

$$
\tau_{rel} \sim \nu^{-1}e^{2.0/k_BT}
\approx 10^{-13}e^{2.0/0.0838}\ {\rm s} \approx 2.4\times10^{-3}\ {\rm s}
$$

at 700 °C — fast: the system stays near local equilibrium during any
practical ramp, so the *equilibrium* solubility at each temperature
(not kinetics) sets the skin's iron. That one line justifies the
workshop's use of solubility curves for the cool-down — and flags the
regime change below ~500 °C where $\tau_{rel}$ blows past hours and
the census freezes for good.

### Worked example W.2 — pricing the metrology that catches this

A lifetime mapper measures at 25 points/wafer, 2 wafers/lot. The
excursion's failure mode (fast unload) leaves skin iron
$\sim10^{12}$ cm⁻³, degrading lifetime from 1 ms to

$$
\tau \approx \frac{1}{\sigma v_{th} N_{Fe}}
\approx \frac{1}{(10^{-16})(10^{7})(10^{12})} \approx 1\ {\rm \mu s},
$$

a 1000× signal — unmissable at any sampling. The audit point is not
sensitivity but *placement*: the map must run after the final
thermal step (the census edits itself until then), and on product
wafers or thermally matched monitors, never on unprocessed witnesses.
Cheap instrument, expensive lesson: metrology inherits the module's
conditions-attached rule like every other number.

## Build-your-own: three exercises in the workshop style

For readers who want the format as practice rather than spectacle,
three self-run briefs with acceptance criteria instead of solutions.
**(a) The uprate memo.** Take Case 2 of the capstone and write the
one-page pilot plan: which three measurements, on which wafers, decide
approval — and state in advance which direction each is allowed to
move. Acceptance: a colleague can run the pilot without asking you
anything. **(b) The vendor-switch audit.** Two vendors offer "equivalent"
internally gettered wafers; one specifies as-built $(N, r)$, the other
only end-of-line $rN$ after a *reference* anneal that differs from
your flow. Write the reconciliation calculation you would demand,
using the ripening conservation ($Nr^3$) and growth ($\sqrt{D_Ot}$)
laws to translate both offers to *your* thermal budget. Acceptance:
both vendors' numbers land in one comparable column. **(c) The
failure-map drill.** Sketch (or fetch from your own line) any radially
patterned failure map and run lesson 5 section 4's classification
against it, writing one sentence per zone naming the responsible
growth condition and the lesson that owns it. Acceptance: every zone
has an owner and a next measurement — the module's promise, that a
wafer map reads as a growth log, cashed by your own hand.

## Closing: the module in one habit

All three workshops executed the same move: locate the temperature at
which the relevant census last equilibrated — the corridor at the
interface, the ripening endpoint of the sink population, the
cool-down repartition of iron — and evaluate every promise *there*,
not at the nameplate condition. Frozen history is the module's
physics and its audit method; carrying that habit forward is worth
more than any single formula in the data book — and module 22 will
need it on its very first page.
