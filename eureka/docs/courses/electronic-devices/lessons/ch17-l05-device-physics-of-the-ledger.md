# The Device Physics Behind the Ledger

<!-- covers: 17.1, 17.2 -->

Lesson 1 used the scaling table as given. This lesson derives every row of it
from first-course device physics, because the module's claims deserve their
proofs, and because the derivations are the working vocabulary of everything
from module 37 onward.

**Level.** Sections 1 to 4 undergraduate; section 5 graduate; section 6
problems.

## 1. The transistor current, derived

### 1.1 Charge control

A MOS gate is a capacitor over the channel. Beyond threshold, the inversion
charge per area at position $y$ along the channel is

$$
Q_i(y)=C_{\rm ox}\left[V_G-V_T-V(y)\right],
\qquad C_{\rm ox}=\frac{\varepsilon_{\rm ox}}{t_{\rm ox}}
$$

Current is charge times velocity times width, with drift velocity
$\mu\,dV/dy$:

$$
I_D=W\mu C_{\rm ox}\left[V_G-V_T-V(y)\right]\frac{dV}{dy}
$$

Integrating $y$ from 0 to $L$ and $V$ from 0 to $V_D$:

$$
\boxed{\;I_D=\frac{\mu C_{\rm ox}W}{L}
\left[(V_G-V_T)V_D-\frac{V_D^{2}}{2}\right]\;}
$$

and at pinch-off ($V_D=V_G-V_T$) the square law:

$$
I_{D,\rm sat}=\frac{\mu C_{\rm ox}W}{2L}(V_G-V_T)^{2}
$$

### 1.2 Where the scaling table's rows come from

Apply the constant-field recipe ($L,W,t_{\rm ox},V\to1/\kappa$; so
$C_{\rm ox}\to\kappa$, gate capacitance $C=C_{\rm ox}WL\to1/\kappa$):

$$
I\to\frac{\kappa}{\kappa}\cdot\frac{(1/\kappa)^{2}}{1/\kappa}
=\frac{1}{\kappa},
\qquad
\tau=\frac{CV}{I}\to\frac{(1/\kappa)(1/\kappa)}{1/\kappa}=\frac{1}{\kappa}
$$

$$
P=IV\to\frac{1}{\kappa^{2}},
\qquad
\frac{P}{WL}\to\frac{1/\kappa^{2}}{1/\kappa^{2}}=1
$$

Every row of lesson 1's table in four lines. The modern correction from
module 18: short channels run velocity-saturated, so

$$
I_{D,\rm sat}\approx WC_{\rm ox}(V_G-V_T)\,v_{\rm sat}
$$

linear rather than quadratic in overdrive, indifferent to $L$, and
indifferent to $\mu$: which is why the industry's channel-material efforts
(module 38) chase *injection velocity* and electrostatics rather than bulk
mobility, and why lesson 2 called mobility a mid-table virtue.

### Worked example 1.1 — a real drive current

$W=1\ \mu$m, $L=20$ nm, 1 nm EOT ($C_{\rm ox}=3.45\times10^{-2}$ F/m2... in
device units $3.45\ \mu$F/cm2), overdrive 0.4 V, $v_{\rm sat}=10^{7}$ cm/s:

$$
I_D=WC_{\rm ox}(V_G-V_T)v_{\rm sat}
=10^{-4}\times3.45\times10^{-6}\times0.4\times10^{7}
$$

per-cm bookkeeping: $C_{\rm ox}(V_G-V_T)=1.38\times10^{-6}$ C/cm2; times
$v_{\rm sat}$: $13.8$ A/cm of width: times $10^{-4}$ cm: $I_D=1.38$ mA:
matching the ~1 mA/µm of modern datasheets. The square law with the same
inputs would predict several times more: the saturation regime is not a
correction, it is the operating point.

## 2. Switching energy, delay and the power identities

### 2.1 The three identities

Charging a node of capacitance $C$ through any resistance to $V$ draws
$QV=CV^{2}$ from the supply and stores half:

$$
E_{\rm switch}=\tfrac{1}{2}CV^{2}
\quad\text{(the other half heats the pull-up)}
$$

At activity factor $a$ and frequency $f$ over $N$ gates:

$$
P_{\rm dyn}=a\,N\,C V^{2}f
$$

Leakage adds the subthreshold floor (lesson 2's slope):

$$
P_{\rm leak}=NV I_0\,10^{-V_T/S}
$$

The pair is the modern designer's vice: lowering $V_T$ speeds switching
(more overdrive) and inflates $10^{-V_T/S}$ exponentially: the reason
"threshold voltage" appears in three flavours on every process menu, and the
reason $S=60$ mV/decade at 300 K is the wall lesson 2's problem P17.15
proved.

### Worked example 2.1 — the leakage-delay bargain, priced

A chip has $10^{9}$ gates, $C=0.1$ fF each, $V=0.8$ V, $f=3$ GHz, $a=0.1$;
$S=70$ mV/dec, $I_0=1\ \mu$A/µm-equivalent giving 100 nA per gate at
$V_T=0$. Compare $V_T=0.25$ and 0.35 V.

Dynamic: $P=0.1\times10^{9}\times10^{-16}\times0.64\times3\times10^{9}
=19.2$ W: unchanged by $V_T$.
Leakage at 0.25: $10^{9}\times0.8\times10^{-7}\times10^{-250/70}
=80\times10^{-3.57}=80\times2.7\times10^{-4}$ W... carefully:
per-gate $=10^{-7}\times10^{-3.57}=2.7\times10^{-11}$ A; total current
27 mA; power $\times0.8$ V $=21$ mW... times $10^{9}$ gates properly:
$I=10^{9}\times2.7\times10^{-11}=2.7\times10^{-2}$ A: $P=22$ mW.
At 0.35: another decade-and-a-half down: 0.7 mW.
But overdrive fell from 0.55 to 0.45 V: saturated-regime delay up
$0.55/0.45=22$ percent.
**22 percent speed for 21 mW**: at 19 W dynamic, leakage is noise here: take
the fast threshold. Now stand at 85 C where $S=85$ mV/dec and $I_0$ is 30x:
leakage at 0.25 V becomes
$30\times10^{9}\times10^{-7}\times10^{-250/85}\times0.8=2.7$ W and climbing
exponentially: the *same* menu choice flips. Threshold selection is a
thermal-corner calculation, not a preference: and the vice tightens every
generation as $V$ falls toward $V_T$.

## 3. The wire's veto

### 3.1 RC of a scaled interconnect

A wire of length $\ell$, width and spacing $w$, thickness $t$, dielectric
$\varepsilon$:

$$
R=\rho\frac{\ell}{wt},
\qquad
C\approx\varepsilon\frac{\ell t}{w}+\varepsilon\frac{\ell w}{h}
\ \Rightarrow\
RC\propto\rho\varepsilon\frac{\ell^{2}}{wt}\times(\text{geometry})
$$

The decisive feature: **RC scales as $\ell^{2}$** (both factors grow with
length) and is independent of widening everything together ($R$ down, $C$
up). Local wires shrink with the devices and keep pace; **global wires span
the die, whose edge does not shrink**: their delay grows every node while
gate delay falls. The crossover generation, when a cross-chip wire cost more
time than a gate, reshaped the industry: repeaters, then clock domains, then
the network-on-chip: architecture absorbing a materials limit.

The materials counterattack is the two factors: $\rho$ (copper, then
module 18's size-effect fight, then cobalt/ruthenium) and $\varepsilon$
(module 43's low-k programme), each worth exactly one multiplicative step
while $\ell^{2}$ compounds. This is why interconnect, not the transistor,
is the cited limiter in every roadmap since the millennium: the wire has no
exponential on its side.

### Worked example 3.1 — repeater insertion from the physics

A 1 cm global line, $R'=150\ \Omega$/mm scaled, $C'=0.2$ pF/mm. Unrepeated
delay (distributed RC): $0.38\,R'C'\ell^{2}=0.38\times150\times0.2\times
10^{-12}\times100=1.14$ ns: three clock cycles lost in transit. Split into
$n$ segments with ideal repeaters: delay $\approx n\times0.38R'C'(\ell/n)^{2}
=1.14/n$ ns plus $n\times\tau_{\rm rep}$ with $\tau_{\rm rep}=15$ ps:
optimum at $d/dn=0$: $n=\sqrt{1140/15}=8.7$: nine repeaters, total
$1140/8.7+8.7\times15\approx262$ ps: a 4.4x recovery bought with silicon
area and power: the standard bargain on every long route, derived from the
$\ell^{2}$.

## 4. Heat: the ledger's collection agency

Power exits through a thermal series chain (module 35 owns the details):

$$
T_j=T_a+P\,(R_{\rm die}+R_{\rm TIM}+R_{\rm sink})
$$

and reliability collects through activated mechanisms:

$$
t_{\rm fail}\propto e^{E_a/k_BT_j}
\quad\Rightarrow\quad
\frac{t_1}{t_2}=e^{\frac{E_a}{k_B}\left(\frac{1}{T_1}-\frac{1}{T_2}\right)}
$$

### Worked example 4.1 — what a TIM upgrade is worth in lifetime

150 W through $R_{\rm total}=0.30$ K/W at $T_a=45$ C: $T_j=90$ C. A better
interface material cuts 0.04 K/W: $T_j=84$ C. With $E_a=0.7$ eV
(electromigration-class):

$$
\frac{t_{84}}{t_{90}}
=\exp\left[\frac{0.7}{8.617\times10^{-5}}
\left(\frac{1}{357}-\frac{1}{363}\right)\right]
=\exp\left[8124\times4.63\times10^{-5}\right]=e^{0.376}=1.46
$$

Six degrees bought 46 percent more life: thermal engineering is reliability
engineering at an exponential exchange rate, and module 54's obsession with
interface materials is this arithmetic run through a product warranty.

## 5. Graduate extension: two identities worth owning

**The energy-delay frontier.** Combining the identities:
$E\propto CV^{2}$ and $\tau\propto CV/I(V)$: sweeping $V$ traces an
energy-delay curve for a given technology; scaling shifts the whole curve
($E\tau\propto1/\kappa^{4}$ under Dennard: a useful compound metric). Real
menus quote $E\tau$ or $E\tau^{2}$ minima; and the post-Dennard era is
visible as these curves converging: newer nodes win big at iso-energy and
barely at iso-delay: the quantitative face of lesson 1's "faster but not
cheaper, cooler but not quicker".

**Subthreshold computing as the other endpoint.** Run *below* threshold:
$I\propto e^{(V_G-V_T)/nk_BT}$: delay explodes exponentially but
$E=CV^{2}$ collapses quadratically: the energy-optimal supply sits near
$2$-$3\,k_BT/e\times n\ln(\cdot)$: around 0.3 to 0.4 V, where leakage
energy per operation balances dynamic. That optimum, derived entirely from
this lesson's identities, is where hearing aids, sensor nodes and
harvest-powered chips actually run: one ledger, both ends priced.

## 6. Problems

**P17.24** Derive the linear-region conductance $g_{ds}=\mu C_{\rm ox}
(W/L)(V_G-V_T)$ from the boxed current, and evaluate for the worked
example's device at $V_G-V_T=0.4$ V.

**P17.25** Show that under constant-voltage scaling ($V$ fixed, dimensions
$1/\kappa$) the square-law delay scales as $1/\kappa^{2}$ but power density
as $\kappa^{3}$, and use lesson 1's figure to date the abandonment.

**P17.26** A node of 40 fF total swings 0.75 V at 2.5 GHz with $a=0.15$.
Dynamic power? What low-k change (module 43) cuts it 20 percent at fixed
speed?

**P17.27** For the repeater example, recompute the optimum with
$\tau_{\rm rep}=8$ ps (a faster node) and comment on the trend.

**P17.28** A part at $T_j=105$ C has 10-year electromigration life
($E_a=0.85$ eV). What junction temperature doubles it?

**P17.29** *(graduate)* From $P_{\rm leak}\propto e^{-V_T/nk_BT/e...}$
properly: minimise total energy per operation
$E=CV^{2}+P_{\rm leak}\tau_{\rm op}$ over $V$ for fixed work, taking
$\tau_{\rm op}\propto e^{+V_T.../}$... set up the trade symbolically and
show why an interior optimum must exist.

**P17.30** *(graduate)* Using $RC\propto\rho\varepsilon\ell^{2}/(wt)$, show
that scaling all cross-sections with $1/\kappa$ while $\ell$ is fixed gives
$RC\to\kappa^{2}RC$, and reconcile with the size-effect worsening of
module 18 to produce the compound global-wire penalty per node.

### Answers

**P17.24** Differentiate at small $V_D$: $I_D\approx\mu C_{\rm ox}(W/L)
(V_G-V_T)V_D$: $g_{ds}=\mu C_{\rm ox}(W/L)(V_G-V_T)$. With $\mu=200$
cm2/Vs (inversion layer, module 18), $C_{\rm ox}=3.45\ \mu$F/cm2,
$W/L=50$: $g=200\times3.45\times10^{-6}\times50\times0.4=1.38\times10^{-2}$
S: a 72 Ω on-resistance: and the velocity-saturated reality is higher,
which is why $R_{\rm on}$ extraction distinguishes the regimes.

**P17.25** $I\propto(W/L)V^{2}/t_{\rm ox}\to\kappa V^{2}$:
$\tau=CV/I\to(1/\kappa)V/(\kappa V^{2})\times V=1/\kappa^{2}$ at fixed $V$;
$P=IV\to\kappa$: density $P/WL\to\kappa^{3}$. The figure's frequency curve
climbing steeply pre-1990s rode this $1/\kappa^{2}$; the voltage panel's
descent starting early 1990s dates the forced switch to constant-field.

**P17.26** $P=aCV^{2}f=0.15\times4\times10^{-14}\times0.5625\times2.5
\times10^{9}=8.4$ mW per such node. Twenty percent off at fixed speed needs
$C$ down 20 percent: $\varepsilon_r$ from, say, 3.0 to 2.4: precisely one
generation of module 43's low-k ladder: the link between a dielectric
constant and a power budget made explicit.

**P17.27** $n=\sqrt{1140/8}=11.9$: twelve segments, delay
$1140/11.9+11.9\times8=191$ ps. Faster repeaters push the optimum toward
*more* of them: global wiring consumes an increasing repeater population
each node: thousands per die: silicon spent shepherding electrons past a
materials limit.

**P17.28** Need $e^{(E_a/k_B)(1/T-1/378)}=2$:
$1/T-1/378=\ln2\times8.617\times10^{-5}/0.85=7.03\times10^{-5}$:
$1/T=2.716\times10^{-3}$: $T=368$ K $=95$ C. Ten degrees per doubling in
this regime: the "10-degree rule" of reliability folklore, here derived
rather than recited.

**P17.29** With work fixed, $\tau_{\rm op}$ (time the leakage integrates
over) rises as $V$ falls, roughly $\tau\propto e^{c(V_T-V)/}$ in
near/subthreshold: $E(V)=CV^{2}+I_0e^{-V_T/S'}V\tau(V)$: first term
monotone down, second monotone up as $V\to V_T^{+}$ from delay explosion:
continuity gives an interior minimum. The structure, not the constants, is
the point: *any* leaky switch with thermally activated speed has an
energy-optimal supply above zero: the subthreshold-computing operating
point exists by inequality, not by fashion.

**P17.30** Fixed $\ell$: $R\to\kappa^{2}R$ ($wt\to1/\kappa^{2}$),
$C\to C$ roughly (geometry ratios preserved): $RC\to\kappa^{2}$. Module 18
adds resistivity growth $\rho(w)$ as $w$ nears $\lambda$: an extra 1.2 to
1.4x per node historically: compound penalty $\approx2.4$-$2.8$x per node
for unrepeated global delay: against a $1/\kappa$ gate: the two-line
summary of why on-chip communication, not computation, sets modern floor
plans.
