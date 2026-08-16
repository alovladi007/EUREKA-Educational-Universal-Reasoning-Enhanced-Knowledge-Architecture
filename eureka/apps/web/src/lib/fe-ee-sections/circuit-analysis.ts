// FE EE course content — Circuit Analysis (7 topics).
// Split byte-identically from fe-ee-course-data.ts so section waves
// can be authored in parallel; spread back into FE_EE_COURSE there.
import type { TopicLesson } from '../fe-ee-course-data';

export const FE_EE_CIRCUIT_ANALYSIS: Record<string, TopicLesson> = {
fee_dc_fundamentals: {
  topicId: 'fee_dc_fundamentals',
  title: 'DC Circuit Fundamentals: Ohm\'s Law, KCL, KVL',
  domainWeight: 'Circuit Analysis · 10%',
  overview: 'Ohm\'s law, Kirchhoff\'s current law (KCL), and Kirchhoff\'s voltage law (KVL) are the three pillars of circuit analysis. Series and parallel combinations, voltage dividers, and current dividers build on these foundations.',
  sections: [
    {
      id: 'dcf-ohm-kirchhoff',
      title: '1. Ohm\'s Law and Kirchhoff\'s Laws',
      content: `## 1.1 Reading the schematic before you analyse it

Every FE Electrical question that shows a circuit expects you to identify the
components from their symbols alone, without a legend. Misreading one symbol
does not cost you part of a question; it changes which equation you write, and
the answer is then wrong by a mechanism no amount of careful arithmetic can
recover. Spend the time here once.

![The component symbols the FE Electrical and Computer exam draws without labelling. Sources are shown upright so the polarity marks read correctly; the two-terminal passives are shown horizontally as they appear in a ladder.](/courses/fe-ee/figures/sch-symbols-reference.svg)

Four pairs account for most misreadings on the exam:

| Confused pair | The distinguishing mark | Consequence of misreading |
|---|---|---|
| DC source vs current source | + / − inside the circle vs a single arrow | You constrain the wrong quantity in KCL/KVL |
| Capacitor vs battery cell | equal-length plates vs one long and one short | Wrong element law: i = C dv/dt vs a fixed V |
| Diode vs Zener | straight cathode bar vs bent bar | Reverse-bias behaviour flips entirely |
| Ground vs negative rail | three tapering bars vs a single bar | Node reference moves, so every node voltage shifts |

The rule underneath all four: a **source** fixes one quantity and lets the
circuit choose the other. A voltage source fixes V and the circuit sets I; a
current source fixes I and the circuit sets V. Everything else in DC analysis
follows from that and from Ohm's law.

## 1.2 Ohm's Law

**$V = I\\cdot R$** relates voltage, current, and resistance.

Three equivalent forms for power: **$P = V\\cdot I = I^{2}R = V^{2}/R$**

Pick the power form by what you already know, not by habit. If you have solved
for a branch current, I²R needs no further division; if you have a node
voltage, V²/R does. Both are algebraically the same statement, and choosing
the one that matches your known quantity removes a step where sign errors get
introduced.

## 1.3 Kirchhoff's Current Law (KCL)

**The sum of currents entering a node equals the sum leaving:**

**$\\Sigma I_{in} = \\Sigma I_{out}$** or equivalently **$\\Sigma I = 0$** (with sign convention)

KCL is conservation of charge — charge cannot accumulate at a node.

## 1.4 Kirchhoff's Voltage Law (KVL)

**The sum of voltage rises around any closed loop equals zero:**

**$\\Sigma V = 0$** (around any closed loop)

KVL is conservation of energy — energy gained equals energy lost around any path.

### Systematic Approach

For any DC circuit:
1. **Label all nodes** and assign current directions (arbitrary — negative result means opposite)
2. **Apply KCL** at each node (n-1 independent equations for n nodes)
3. **Apply KVL** around each independent loop
4. **Apply Ohm's law** (V = IR) to relate voltages and currents
5. **Solve** the system of equations

## 1.5 The three laws on one circuit

Description in words is where circuit problems go wrong. "A 12 V source drives
4 Ω in series with 6 Ω in parallel with 12 Ω" has to be held entirely in your
head; the same statement drawn is read in a second:

![A 12 V source feeding R1 = 4 ohm in series with the parallel pair R2 = 6 ohm and R3 = 12 ohm. Node A is the junction the two parallel branches share.](/courses/fe-ee/figures/sch-dc-ladder.svg)

Work it in the order the laws come in.

**Reduce.** R2 and R3 share both of their nodes, so they are in parallel:
R2‖R3 = (6 × 12)/(6 + 12) = 72/18 = **$4\\ \\Omega$**. That sits in series with R1, so
the source sees R_eq = 4 + 4 = **$8\\ \\Omega$**.

**Ohm's law for the source current.** I = 12/8 = **1.5 A**.

**KVL around the outer loop.** The drop across R1 is 1.5 × 4 = 6 V, so node A
sits at 12 − 6 = **6 V** above the reference. The two drops sum to the source:
6 + 6 = 12 V. If they had not summed, you would stop here rather than carry the
error forward.

**KCL at node A.** Each parallel branch sees the same 6 V:

| Branch | Voltage | Resistance | Current | Power |
|---|---|---|---|---|
| R1 | 6 V | $4\\ \\Omega$ | 1.500 A | 9.0 W |
| R2 | 6 V | $6\\ \\Omega$ | 1.000 A | 6.0 W |
| R3 | 6 V | $12\\ \\Omega$ | 0.500 A | 3.0 W |
| **Source** | 12 V | $8\\ \\Omega (eq.)$ | **1.500 A** | **18.0 W** |

The branch currents sum to 1.000 + 0.500 = 1.500 A, which is the source
current — that is KCL closing. The dissipated powers sum to 9 + 6 + 3 = 18 W,
which is 12 V × 1.5 A — that is conservation of energy closing. Two independent
checks, both arithmetic, both taking about five seconds.

Notice which branch carries more. R2 is the *smaller* resistor and takes twice
the current of R3, while both drop the same voltage. That is the whole content
of the current-divider rule, and seeing it once on a drawn circuit is worth
more than memorising which resistance goes in the numerator.`,
      examTip: 'If your calculated current is negative, the actual direction is opposite to your assumed direction — the magnitude is still correct. Do NOT redo the problem. This is the beauty of the systematic approach: arbitrary assumptions are self-correcting.',
      importantNote: 'KCL applies at every node, and KVL applies around every loop — these laws are ALWAYS valid in lumped-element circuits. When other techniques (Thevenin, superposition) seem unclear, fall back to KCL/KVL. They never fail.',
    },
    {
      id: 'dcf-series-parallel',
      title: '2. Series/Parallel, Voltage Dividers, and Current Dividers',
      content: `## 2.1 Series and Parallel Combinations

### Series (same current through all elements)
- **$R_{total} = R_{1} + R_{2} + ... + R_{n}$**
- Voltages add: V_total = $V_{1}$ + $V_{2}$ + ...
- Largest resistor has largest voltage drop

### Parallel (same voltage across all elements)
- **$1/R_{total} = 1/R_{1} + 1/R_{2} + ... + 1/R_{n}$**
- For two resistors: **$R_{total} = R_{1}\\cdot R_{2}/(R_{1} + R_{2})$**
- Currents add: I_total = $I_{1}$ + $I_{2}$ + ...
- Total resistance is ALWAYS less than the smallest individual resistance

## 2.2 Voltage Divider

For resistors in series:

**$V_x = V_{total} \\cdot R_x / (R_{1} + R_{2} + ... + R_{n})$**

For two resistors: $V_{1}$ = V · $R_{1}$/($R_{1}$+$R_{2}$), $V_{2}$ = V · $R_{2}$/($R_{1}$+$R_{2}$)

## 2.3 Current Divider

For two resistors in parallel:

**$I_{1} = I_{total} \\cdot R_{2}/(R_{1} + R_{2})$** (current through $R_{1}$ uses the OTHER resistance)

**$I_{2} = I_{total} \\cdot R_{1}/(R_{1} + R_{2})$**

Note: current goes preferentially through the SMALLER resistance (path of least resistance).

| Configuration | Same Quantity | Add Up | Equivalent |
|---|---|---|---|
| Series | Current | Voltages | $R_{eq} = \\Sigma R$ |
| Parallel | Voltage | Currents | $1/R_{eq} = \\Sigma (1/R)$ |`,
      examTip: 'The current divider formula is backwards from what you might expect: I through R₁ uses R₂ in the numerator. Think of it as: more resistance in YOUR branch means LESS current goes through it, so the OTHER resistance goes on top.',
    },
    {
      id: 'dcf-worked',
      title: '3. Worked Examples',
      content: `## 3.1 Ladder reduction and a divider

A 12 V source drives R1 = 4 ohm in series with the parallel pair R2 = 6 ohm and R3 = 12 ohm. Find the current from the source and the voltage across the parallel pair.

The parallel pair: R23 = (6)(12)/(6+12) = 72/18 = **4 ohm**. Total: R = 4 + 4 = **8 ohm**. Source current: I = 12/8 = **1.5 A**.

Voltage across the pair, by the divider: V23 = 12 x 4/8 = **6 V**. Check with Ohm's law: (1.5 A)(4 ohm) = 6 V. Agrees.

Branch currents: I2 = 6/6 = 1 A, I3 = 6/12 = 0.5 A, and 1 + 0.5 = 1.5 A, which is KCL at the node. Two independent checks on one answer is what makes this reliable under time pressure.

## 3.2 Current divider, and why it looks backwards

The same 1.5 A splits between 6 ohm and 12 ohm. The divider gives

$$I2 = I x R3/(R2+R3) = 1.5 x 12/18 = 1.0\\ \\mathrm{A}$$

The 6 ohm branch — the smaller resistance — takes the larger share, and the formula gets there by putting the OTHER resistance on top. If your answer gives more current to the larger resistor, you have the fraction upside down.

## 3.3 Node analysis when reduction stalls

Two sources, 10 V and 4 V, feed a common node through 2 ohm and 4 ohm respectively; a 4 ohm resistor runs from that node to ground. Series-parallel reduction cannot touch this, so use one node equation with node voltage V:

$$(V - 10)/2 + (V - 4)/4 + V/4 = 0$$

Multiply by 4: 2(V - 10) + (V - 4) + V = 0, so 2V - 20 + V - 4 + V = 0, giving 4V = 24 and **$V = 6\\ \\mathrm{V}$**.

Currents: (6-10)/2 = -2 A (so 2 A flows INTO the node from the 10 V source), (6-4)/4 = 0.5 A out, 6/4 = 1.5 A out. Out equals 0.5 + 1.5 = 2 A in. KCL balances.

## 3.4 Power accounting

In 3.1, the source delivers P = VI = 12 x 1.5 = **18 W**. The 4 ohm series resistor dissipates I squared R = (1.5)(1.5)(4) = 9 W; the 6 ohm takes (1)(1)(6) = 6 W; the 12 ohm takes (0.5)(0.5)(12) = 3 W. Total dissipated = 9 + 6 + 3 = **18 W**. Delivered equals dissipated, as it must.`,
      examTip: 'Finish every circuit problem with one check you did not use to get the answer - KCL at a node, or a power balance. It costs ten seconds and catches the sign and factor errors that account for most lost marks on this section.',
      quiz: [
        {
          question: 'A 24 V source drives 3 ohm in series with the parallel combination of 12 ohm and 6 ohm. What current does the source deliver?',
          options: ['3.43 A', '2.00 A', '4.00 A', '8.00 A'],
          correctIndex: 0,
          explanation: 'The parallel pair is (12)(6)/(12+6) = 72/18 = 4 ohm. Total resistance is 3 + 4 = 7 ohm, so I = 24/7 = 3.43 A. Choosing 4.00 A means dividing 24 by the parallel pair alone and forgetting the series 3 ohm.',
        },
        {
          question: 'A 2 A source feeds two parallel resistors, 8 ohm and 2 ohm. How much current flows through the 8 ohm resistor?',
          options: ['0.4 A', '1.6 A', '1.0 A', '0.25 A'],
          correctIndex: 0,
          explanation: 'The current divider puts the OTHER resistance on top: I_8 = 2 x 2/(8+2) = 0.4 A. Current prefers the lower-resistance path, so the 2 ohm branch takes the remaining 1.6 A. Answering 1.6 A is the classic inverted-fraction error.',
        },
        {
          question: 'Solving a node equation gives a branch current of -3 A relative to your assumed direction. What should you do?',
          options: [
            'Accept it: the magnitude is 3 A and the true direction is opposite to your assumption',
            'Redo the analysis with the arrow reversed',
            'Take the absolute value and keep the assumed direction',
            'The circuit is unsolvable as drawn',
          ],
          correctIndex: 0,
          explanation: 'Assumed current directions are arbitrary and self-correcting. A negative result means the current flows the other way with magnitude 3 A. Redoing the problem wastes time and reversing the arrow without changing the sign gives a wrong answer downstream.',
        },
      ],
    },
    {
      id: 'dcf-depth',
      title: '4. Reading a Divider, and Choosing Your Method',
      content: `## 4.1 What the divider fractions actually do

The two divider rules look similar and behave oppositely, which is why they
are the most-confused pair in DC analysis. Fix the total resistance and sweep
how it is split:

![Voltage and current fractions for R1 in a two-resistor pair with R1 + R2 fixed at 100 ohm. Raising R1 gives it more of the voltage and less of the current, and the two curves cross where the resistances are equal.](/courses/fe-ee/figures/circuits-divider-split.svg)

Everything you need is in the crossing. Below the midpoint R1 is the smaller
resistor, so it carries most of the current and drops least of the voltage;
above it, the reverse. The curves are mirror images because the two fractions
sum to one: R1/(R1+R2) + R2/(R1+R2) = 1.

That is the sanity check to apply every time. If your two branch currents do
not sum to the total, or your two voltage drops do not sum to the source, you
have made an arithmetic error - not a conceptual one - and it will take ten
seconds to find.

## 4.2 Choosing between reduction, nodal and mesh

Three methods, and picking the wrong one costs minutes:

| Situation | Use | Why |
|---|---|---|
| Pure ladder of series/parallel groups | reduction | no simultaneous equations at all |
| Several current sources, few nodes | nodal | current sources enter directly |
| Several voltage sources, few loops | mesh | voltage sources enter directly |
| Bridge or delta that will not reduce | nodal or mesh | reduction is impossible |

The equation counts decide it when both are viable. For a network with N nodes
and B branches, nodal needs **N - 1** equations and mesh needs **B - N + 1**.
Count both, take the smaller.

**Worked:** a bridge with 4 nodes and 6 branches. Nodal: 4 - 1 = 3 equations.
Mesh: 6 - 4 + 1 = 3 equations. A tie, so pick by source type - if the bridge
is driven by one voltage source, mesh is marginally cleaner.

## 4.3 A source that is not ideal

Real sources have internal resistance, and the exam tests what that does. A
battery of EMF 12 V with r = 0.5 ohm driving a 5.5 ohm load:

$$I = 12/(0.5 + 5.5) = 2\\ \\mathrm{A}$$
Terminal voltage = 12 - (2)(0.5) = **11 V**, not 12

The terminal voltage droops under load, and the droop is I times r. At short
circuit the current is limited only by r: 12/0.5 = 24 A, and the terminal
voltage is zero. That short-circuit current is exactly the Norton current of
the source, which is the bridge to the next chapter.

**Load regulation** = (V_noload - V_fullload)/V_fullload = (12 - 11)/11 =
**9.1%**. A stiff source is one with small r and therefore small regulation.

## 4.4 Where the power goes

For that same battery: the source produces P = EMF x I = 12 x 2 = **24 W**, of
which the internal resistance eats I^2 r = (4)(0.5) = **2 W** and the load
receives (4)(5.5) = **22 W**. Efficiency 22/24 = **91.7%**.

Note what happens as the load resistance falls toward r: the load power rises
to a maximum at R = r and then falls again, while efficiency falls
monotonically. Those two curves peak in different places, which is the point
the maximum-power-transfer question always turns on.`,
      examTip: 'Count the nodes and the loops before you start writing equations. Nodal needs N-1, mesh needs B-N+1, and on an exam where every question is worth the same, spending two minutes on the wrong method is the most expensive mistake available.',
      importantNote: 'Terminal voltage equals EMF only at zero current. Every question that mentions internal resistance, battery droop, or a source that "sags under load" is testing V_terminal = EMF - I r, and the answer is never simply the EMF.',
    },
  ],
  keyTakeaways: [
    'V = IR (Ohm\'s law); P = VI = I²R = V²/R (power).',
    'KCL: ΣI at node = 0; KVL: ΣV around loop = 0.',
    'Series: same current, R adds; parallel: same voltage, conductances add.',
    'Voltage divider: V_x = V·R_x/R_total; current divider: I₁ = I·R₂/(R₁+R₂).',
    'Parallel resistance is ALWAYS less than the smallest individual resistance.',
  ],
},

fee_network_theorems: {
  topicId: 'fee_network_theorems',
  title: 'Network Theorems: Thevenin, Norton, Superposition',
  domainWeight: 'Circuit Analysis · 10%',
  overview: 'Thevenin and Norton theorems simplify complex networks to equivalent circuits. Superposition handles multiple-source circuits. Maximum power transfer determines optimal load matching. These are the most powerful tools in circuit analysis.',
  sections: [
    {
      id: 'nt-thevenin-norton',
      title: '1. Thevenin and Norton Equivalents',
      content: `## 1.1 Thevenin's Theorem

Any linear two-terminal network can be replaced by:
- **V_Th** (Thevenin voltage) in series with **R_Th** (Thevenin resistance)

The claim is stronger than it first sounds. It is not that the two circuits
behave similarly, or behave the same for one load — it is that **no measurement
made at terminals a-b can distinguish them, for any load whatsoever**. That is
what makes the theorem worth the effort: you do the reduction once, then sweep
the load as many times as the question asks without touching the original
network again.

![The same one-port drawn as a Thevenin source (4 V behind 2 ohm, in series) and as its Norton equivalent (2 A across 2 ohm, in parallel). Terminals a-b are the port; nothing measured there can tell the two apart.](/courses/fe-ee/figures/sch-thevenin-pair.svg)

### Finding V_Th and R_Th

1. **Remove the load** from terminals A-B
2. **V_Th = open-circuit voltage** at A-B (no load connected)
3. **R_Th**: deactivate all independent sources, calculate resistance looking into A-B
   - Voltage sources → short circuits (wire)
   - Current sources → open circuits (removed)

With load connected: **$I_{load} = V_{Th}/(R_{Th} + R_{load})$**

## 1.2 Norton's Theorem

Any linear network = **I_N** (current source) in parallel with **R_N**

- **I_N = short-circuit current** (short A-B terminals)
- **$R_N = R_{Th}$** (same resistance)
- **Relationship**: V_Th = I_N · R_N

### When to Use Which

| Situation | Best Approach |
|---|---|
| Analyzing varying loads | Thevenin or Norton |
| Voltage-source-heavy circuit | Thevenin more intuitive |
| Current-source-heavy circuit | Norton more intuitive |
| Need current through one element | Thevenin often fastest |

## 1.3 Reducing a real network, and checking it two ways

Take a 6 V source in series with $R_{1}$ = 3 Ω, with $R_{2}$ = 6 Ω across the output
terminals. Reduce it to the pair drawn above.

**V_Th, by open circuit.** With nothing across a-b, no current flows out of the
port, so $R_{1}$ and $R_{2}$ form a plain divider:
$$V_{Th} = 6 \\times 6/(3 + 6) = 36/9 = 4\\ \\mathrm{V}$$.

**R_Th, by source deactivation.** Kill the 6 V source — replace it with a wire,
because a voltage source holds zero volts when off, and a wire is the element
that holds zero volts. $R_{1}$ and $R_{2}$ are then both connected between the a node and
the reference, i.e. in parallel:
$$R_{Th} = (3 \\times 6)/(3 + 6) = 18/9 = 2\\ \\Omega$$.

**I_N, by short circuit — the independent check.** Now short a-b directly. The
short puts 0 V across $R_{2}$, so $R_{2}$ carries no current at all and the entire source
current goes through $R_{1}$ into the short:
$$I_N = 6/3 = 2\\ \\mathrm{A}$$.

Those three numbers must satisfy V_Th = I_N · R_N. Here 2 A × 2 Ω = 4 V, which
matches the open-circuit voltage computed by a completely different route. This
is the verification worth building the habit around: **compute two of the three
and predict the third**. If the prediction fails, the error is in the reduction,
not in whatever you do next.

| Quantity | How it is found | Load present? | Value here |
|---|---|---|---|
| V_Th | open-circuit voltage at a-b | none (open) | 4 V |
| I_N | short-circuit current at a-b | short | 2 A |
| $R_{Th} = R_N$ | sources deactivated, look in | none | $2\\ \\Omega$ |
| Consistency | $V_{Th} = I_N \\cdot R_N$ | — | 2 × 2 = 4 ✓ |

## 1.4 What the equivalent is for: sweeping the load

With the equivalent in hand, every load question is one division:
I_L = 4/(2 + R_L), and P_L = I_L²R_L.

| R_L | $I_L = 4/(2+R_L)$ | $V_L = I_L\\cdot R_L$ | $P_L = I_L^{2}R_L$ | Efficiency P_L/P_total |
|---|---|---|---|---|
| 0 Ω (short) | 2.000 A | 0.00 V | 0.00 W | 0 % |
| $1\\ \\Omega$ | 1.333 A | 1.33 V | 1.78 W | 33 % |
| **2 Ω (matched)** | **1.000 A** | **2.00 V** | **2.00 W** | **50 %** |
| $4\\ \\Omega$ | 0.667 A | 2.67 V | 1.78 W | 67 % |
| $8\\ \\Omega$ | 0.400 A | 3.20 V | 1.28 W | 80 % |
| ∞ (open) | 0 A | 4.00 V | 0.00 W | — |

Three things in that table are worth carrying into the exam.

First, **power peaks at R_L = R_Th**, at P_max = V_Th²/(4R_Th) = 16/8 = 2 W.
That is the maximum power transfer result, and here it arrives as an observation
about a table rather than a formula to recall.

Second, the peak is **flat**. Moving from 2 Ω to either 1 Ω or 4 Ω — a factor of
two in either direction — costs only 11 % of the delivered power, 1.78 W against
2.00 W. Matching is worth doing, but a question that claims a small mismatch is
catastrophic is describing something other than a resistive load.

Third, **matched does not mean efficient**. At R_L = R_Th exactly half the power
drawn from the source is burned inside R_Th, so efficiency is 50 %. Maximum
power transfer and maximum efficiency are different design goals that point in
opposite directions: signal circuits match to get the most signal out, power
systems deliberately keep R_Th ≪ R_L so that efficiency rises toward 100 % and
the delivered power, though below the theoretical peak, costs far less to
supply.`,
      examTip: 'To find R_Th: deactivate sources (voltage → short, current → open) and calculate resistance looking into the terminals. A common FE exam mistake is deactivating sources incorrectly — voltage sources become SHORT circuits (zero voltage), current sources become OPEN circuits (zero current).',
      importantNote: 'Dependent sources are NEVER deactivated in Thevenin/Norton analysis. Only independent sources are turned off. If the circuit has dependent sources, use the test source method: apply a test voltage V_test, find resulting I_test, then R_Th = V_test/I_test.',
    },
    {
      id: 'nt-superposition-maxpower',
      title: '2. Superposition and Maximum Power Transfer',
      content: `## 2.1 Superposition Theorem

In a linear circuit with multiple independent sources, the response is the **sum of responses** due to each source acting alone.

### Procedure:
1. **Keep one source active**, deactivate all others
2. **Solve** for the desired quantity
3. **Repeat** for each source
4. **Add** all contributions algebraically (with signs)

### When Superposition Excels
- Circuits with sources at **different frequencies** (DC + AC, or two different AC)
- Sources at different frequencies do not interact, so superposition is natural

## 2.2 Maximum Power Transfer

Maximum power is delivered to a load when:

**$R_{load} = R_{Th}$** (for purely resistive circuits)
**$Z_{load} = Z_{Th}$*** (conjugate match for complex impedances)

The maximum power delivered:

**$P_{\\max} = V_{Th}^{2} / (4\\cdot R_{Th})$**

### Important Tradeoffs

| Condition | Power Transfer | Efficiency |
|---|---|---|
| $R_L = R_{Th}$ | **Maximum** (P_max) | 50% |
| $R_L > R_{Th}$ | Less than max | Higher than 50% |
| R_L >> R_Th | Much less | Approaches 100% |
| $R_L < R_{Th}$ | Less than max | Lower than 50% |

Maximum power transfer and maximum efficiency are **opposite goals**.`,
      examTip: 'Maximum power transfer delivers P_max = V_Th²/(4R_Th) at 50% efficiency. This matters in communications (match impedances for signal power). In power systems, efficiency matters more, so loads are NOT matched to source impedance.',
      importantNote: 'For AC circuits with complex impedances, maximum power transfer requires the CONJUGATE match: Z_L = Z_Th*. If Z_Th = R + jX, then Z_L should be R - jX. The reactive parts cancel, and resistive parts match.',
    },
    {
      id: 'nt-worked',
      title: '3. Worked Examples',
      content: `## 3.1 Thevenin equivalent, step by step

A 12 V source feeds R1 = 6 ohm; from the R1-node a 3 ohm resistor goes to ground, and the load terminals sit across that 3 ohm. Find the Thevenin equivalent seen by the load.

**V_th** — open-circuit voltage, load removed. The 6 ohm and 3 ohm form a divider: V_th = 12 x 3/(6+3) = **4 V**.

**R_th** — kill the independent source (voltage source becomes a short) and look back in. The 6 ohm and 3 ohm are then in parallel: R_th = (6)(3)/9 = **2 ohm**.

So the load sees 4 V behind 2 ohm. Attach a 2 ohm load and the current is 4/(2+2) = 1 A, with 2 V across the load.

## 3.2 The same circuit by Norton

I_N is the short-circuit current at the terminals. Shorting them puts the 3 ohm out of play, so I_N = 12/6 = **2 A**, and R_N = R_th = **2 ohm**.

Check the source transformation: V_th = I_N x R_th = 2 x 2 = 4 V. Consistent with 3.1, as it must be — Thevenin and Norton are the same circuit written two ways.

## 3.3 Superposition with two sources

A 10 V source through 5 ohm and a 2 A source both feed a 5 ohm load to ground.

**Voltage source alone** (current source opened): the 10 V divides across 5 + 5, giving V_L = **5 V**.

**Current source alone** (voltage source shorted): 2 A sees two 5 ohm paths in parallel, so 1 A goes through the load, giving V_L = 1 x 5 = **5 V**.

Superpose: V_L = 5 + 5 = **10 V**, and the load current is 2 A.

Note what you may NOT superpose: power. Computing (5 V)^2/5 + (5 V)^2/5 = 10 W is wrong; the real load power is (10)^2/5 = **20 W**. Power is quadratic in the response, so it must be computed from the total.

## 3.4 Maximum power transfer

With the 4 V / 2 ohm Thevenin source of 3.1, maximum load power occurs at R_L = R_th = 2 ohm. Then V_L = 2 V and P_L = (2)^2/2 = **2 W**.

Efficiency at that point is only 50% — half the power is burned in R_th. Maximum power and maximum efficiency are different design targets, and the exam tests that they are not the same thing.`,
      examTip: 'To find R_th, kill INDEPENDENT sources only: short voltage sources, open current sources. A dependent source stays in the circuit - for those, apply a 1 V test source at the terminals and compute R_th = 1/I_test.',
      quiz: [
        {
          question: 'A network has V_th = 20 V and R_th = 5 ohm. What is the Norton equivalent?',
          options: ['4 A in parallel with 5 ohm', '4 A in series with 5 ohm', '100 A in parallel with 5 ohm', '20 A in parallel with 5 ohm'],
          correctIndex: 0,
          explanation: 'I_N = V_th/R_th = 20/5 = 4 A, and R_N = R_th = 5 ohm, with the resistance in PARALLEL for a Norton source. A Norton current source in series with its resistance would be meaningless, since the series element cannot change the source current.',
        },
        {
          question: 'Superposition gives a load voltage of 6 V from one source and 4 V from another, acting alone. The load is 2 ohm. What is the actual power dissipated in it?',
          options: ['50 W', '26 W', '18 W', '10 W'],
          correctIndex: 0,
          explanation: 'Superpose the VOLTAGE first: 6 + 4 = 10 V. Then P = V^2/R = 100/2 = 50 W. Adding the individual powers (36/2 + 16/2 = 26 W) is the trap: power is quadratic in the response and does not superpose.',
        },
        {
          question: 'For maximum power transfer to a load from a source with 8 ohm internal resistance, what load resistance is required, and what efficiency results?',
          options: ['8 ohm, 50% efficient', '8 ohm, 100% efficient', '0 ohm, 100% efficient', '16 ohm, 67% efficient'],
          correctIndex: 0,
          explanation: 'Maximum power transfer needs R_L = R_th = 8 ohm. With equal resistances the source dissipates as much as the load, so efficiency is exactly 50%. Power systems are designed for efficiency instead, which is why R_L >> R_th there.',
        },
      ],
    },
    {
      id: 'nt-depth',
      title: '4. Dependent Sources, Delta-Wye and Method Selection',
      content: `## 4.1 Thevenin resistance when a dependent source is present

The kill-the-sources shortcut applies to INDEPENDENT sources only. A dependent
source is part of the circuit's behaviour, not an external excitation, so it
must stay. Two routes:

**Test-source method.** Remove independent sources, apply a 1 V test source at
the terminals, compute the current it delivers, and R_th = 1 V / I_test.

**Open-circuit / short-circuit method.** Compute V_oc and I_sc with everything
present, and R_th = V_oc / I_sc. Usually the faster of the two, and it works
whatever is inside.

**Worked:** a network has V_oc = 6 V and I_sc = 1.5 A. Then R_th = 6/1.5 =
**4 ohm**, whether or not it contains dependent sources - the ratio does not
care what produced the two numbers.

A dependent source can also make R_th **negative**, which is not an error: it
is what an oscillator or a negative-impedance converter does, and it is how
sustained oscillation is possible at all.

## 4.2 Delta-wye conversion

Some networks - the bridge in particular - have no series or parallel pair
anywhere. Converting one delta to a wye usually unlocks the whole reduction.

**Delta to wye:** each wye resistor is the product of its two adjacent delta
resistors over the sum of all three.

R_1 = R_a R_b/(R_a + R_b + R_c), and cyclically.

**Wye to delta:** each delta resistor is the sum of the pairwise products over
the opposite wye resistor.

For the **balanced** case the whole thing collapses to two facts worth
memorising: **$R_{wye} = R_{delta}/3$**, and **$R_{delta} = 3 R_{wye}$**.

**Worked:** a delta of three 90 ohm resistors converts to a wye of 30 ohm
each. A bridge whose upper delta is 90/90/90 becomes a wye of 30/30/30, after
which the remaining network is a plain series-parallel reduction.

## 4.3 Superposition: what it may and may not be used for

Superposition applies to any **linear** response - voltage and current - and
never to power, because power is quadratic. It also fails outright on any
non-linear element: a diode, a transistor in a non-linear region, or a
saturating core.

The procedure is mechanical: one independent source active at a time, all
others killed (voltage sources shorted, current sources opened), and the
individual responses summed. **Dependent sources are never killed** - they
remain active in every sub-analysis.

Its cost is real. Superposition needs one full analysis per source, so with
three sources it is three times the work of a single nodal analysis. It earns
its place when the sources are at different frequencies, where nodal analysis
cannot combine them in one set of phasors and superposition is the only route.

## 4.4 Choosing the theorem

| Question asks for | Reach for |
|---|---|
| Behaviour of one varying load | Thevenin - compute the equivalent once, then sweep |
| A single branch current in a fixed network | mesh or nodal directly |
| Response with sources at different frequencies | superposition, one frequency at a time |
| Maximum power into a load | Thevenin, then R_L = R_th |
| A bridge that will not reduce | delta-wye, then reduction |

The Thevenin case is the one people under-use. If a question asks what happens
for three different load resistances, computing the equivalent once and
reusing it is three times faster than three full analyses.`,
      examTip: 'Never kill a dependent source. If R_th cannot be found by inspection because one is present, use R_th = V_oc / I_sc - it needs two calculations you can already do and never requires a test source.',
      quiz: [
        {
          question: 'A network containing a dependent source has V_oc = 10 V and I_sc = 2.5 A at its terminals. What is R_th?',
          options: ['4 ohm', '25 ohm', '0.25 ohm', 'It cannot be determined with a dependent source present'],
          correctIndex: 0,
          explanation: 'R_th = V_oc/I_sc = 10/2.5 = 4 ohm. This ratio works regardless of what the network contains, which is exactly why it is the method of choice when killing sources is not permitted.',
        },
        {
          question: 'A balanced delta of three 60 ohm resistors is converted to a wye. What is each wye resistance?',
          options: ['20 ohm', '180 ohm', '60 ohm', '30 ohm'],
          correctIndex: 0,
          explanation: 'For the balanced case R_wye = R_delta/3 = 60/3 = 20 ohm. The wye is always the smaller of the pair; getting the direction backwards gives 180 ohm and a nine-fold error in any subsequent power calculation.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'Thevenin: V_Th (open-circuit voltage) + R_Th (resistance with sources off).',
    'Norton: I_N (short-circuit current) + R_N = R_Th; V_Th = I_N·R_Th.',
    'Superposition: sum responses from each source individually.',
    'Max power transfer: R_L = R_Th; P_max = V_Th²/(4R_Th) at 50% efficiency.',
    'Deactivate: voltage source → short circuit; current source → open circuit.',
  ],
},

fee_ac_phasors: {
  topicId: 'fee_ac_phasors',
  title: 'AC Steady-State Analysis: Phasors and Impedance',
  domainWeight: 'Circuit Analysis · 10%',
  overview: 'Phasor analysis converts sinusoidal steady-state problems from differential equations to algebraic equations. Impedance generalizes resistance to AC, and all DC analysis techniques apply using phasors.',
  sections: [
    {
      id: 'acp-phasors',
      title: '1. Phasor Representation and Impedance',
      content: `## 1.1 Phasor Conversion

A sinusoidal signal v(t) = Vm·cos(ωt + φ) converts to phasor:

**$V = Vm\\angle \\phi$** (polar form) or **$V = Vm\\cdot \\cos \\phi + j\\cdot Vm\\cdot \\sin \\phi$** (rectangular)

The angular frequency ω = 2πf relates frequency f (Hz) to radians/second.

## 1.2 Impedance

**Impedance Z** generalizes Ohm's law to AC: **$V = I\\cdot Z$**

| Element | Impedance | Reactance | Phase Relationship |
|---|---|---|---|
| Resistor | $Z_R = R$ | $X_R = 0$ | V and I in phase |
| Inductor | $Z_L = j\\omega L$ | $X_L = \\omega L$ | V leads I by 90° |
| Capacitor | $Z_C = 1/(j\\omega C) = -j/(\\omega C)$ | $X_C = -1/(\\omega C)$ | I leads V by 90° |

### Impedance in Rectangular and Polar Form

**$Z = R + jX = |Z|\\angle \\theta$**

Where:
- |Z| = sqrt(R² + X²)
- θ = arctan(X/R)
- R is resistance (real part)
- X is reactance (imaginary part)

## 1.3 Admittance

**$Y = 1/Z = G + jB$**

Where G is conductance and B is susceptance. Admittance is useful for parallel circuits.

### Combining Impedances

- **Series**: Z_total = $Z_{1}$ + $Z_{2}$ (add impedances)
- **Parallel**: 1/Z_total = 1/$Z_{1}$ + 1/$Z_{2}$ (add admittances)`,
      examTip: 'Mnemonic for inductor/capacitor phase: "ELI the ICE man" — E leads I in L (inductor), I leads E in C (capacitor). On the FE exam, inductive impedance is +jωL (positive imaginary) and capacitive impedance is -j/(ωC) (negative imaginary).',
      importantNote: 'ALL DC circuit analysis techniques work with phasors: KVL, KCL, Thevenin, Norton, superposition, voltage divider, current divider — just use impedances Z instead of resistances R, and phasors instead of DC values.',
    },
    {
      id: 'acp-frequency',
      title: '2. Frequency Behavior and RMS Values',
      content: `## 2.1 Frequency-Dependent Behavior

Impedance changes with frequency ω:

| Frequency | Inductor Z_L = jωL | Capacitor Z_C = 1/(jωC) |
|---|---|---|
| $DC (\\omega \\to 0)$ | **0** (short circuit) | **∞** (open circuit) |
| Low ω | Small | Large |
| High ω | Large | Small |
| ω → ∞ | **∞** (open circuit) | **0** (short circuit) |

This frequency dependence is the basis of filters:
- **Low-pass filter**: passes low frequencies (inductor blocks high, capacitor shorts high)
- **High-pass filter**: passes high frequencies (capacitor blocks low, inductor shorts low)

## 2.2 RMS (Root Mean Square) Values

For sinusoidal signals:

**$V_{rms} = V_{peak} / \\sqrt{2} \\approx 0.707 \\cdot V_{peak}$**

- RMS values are used for power calculations: **$P = V_{rms} \\cdot I_{rms} \\cdot \\cos \\phi$**
- Standard outlet voltage (120V) is an RMS value; peak is 120·sqrt(2) ≈ 170V
- Phasors typically represent **peak** values unless specified as RMS

### Phasor Addition

To add two sinusoids at the same frequency:
1. Convert each to phasor (rectangular form)
2. Add real parts, add imaginary parts
3. Convert back to polar for magnitude and phase`,
      examTip: 'At DC: inductors are short circuits (wire), capacitors are open circuits (break). At very high frequency: inductors are open, capacitors are short. This is the most important frequency-behavior fact for the FE exam.',
    },
    {
      id: 'acp-worked',
      title: '3. Worked Examples',
      content: `## 3.1 Building an impedance

A series RL branch has R = 30 ohm and L = 80 mH, driven at 60 Hz.

omega = 2 pi f = 2 pi (60) = **377 rad/s**. Then X_L = omega L = 377 x 0.080 = **30.2 ohm**.

Z = 30 + j30.2, magnitude sqrt(30^2 + 30.2^2) = sqrt(900 + 912) = **42.6 ohm**, angle arctan(30.2/30) = **45.2 degrees**.

With a 120 V rms source, I = 120/42.6 = **2.82 A rms**, lagging the voltage by 45.2 degrees. In an inductive branch the current lags — ELI: in an inductor (L), E leads I.

## 3.2 Series RLC at a chosen frequency

R = 20 ohm, L = 50 mH, C = 100 microfarad, driven at 60 Hz.

X_L = 377 x 0.050 = 18.85 ohm. X_C = 1/(omega C) = 1/(377 x 100e-6) = 1/0.0377 = **26.5 ohm**.

Net reactance: X = X_L - X_C = 18.85 - 26.5 = **-7.7 ohm**, so the branch is net CAPACITIVE at this frequency and the current LEADS.

|Z| = sqrt(20^2 + 7.7^2) = sqrt(400 + 59) = **21.4 ohm**, angle = arctan(-7.7/20) = **-21.1 degrees**.

## 3.3 Parallel branches: add admittances

A 10 ohm resistor sits in parallel with a j20 ohm inductive reactance. Working in admittance is faster than the product-over-sum:

Y = 1/10 + 1/(j20) = 0.1 - j0.05 siemens.

|Y| = sqrt(0.01 + 0.0025) = 0.1118 S, so |Z| = 1/0.1118 = **8.94 ohm**, at angle +26.6 degrees (the sign flips when you invert).

## 3.4 rms, average and peak

A sinusoid of 170 V peak has V_rms = 170/sqrt(2) = **120 V** — the familiar mains figure. Its full-cycle average is **zero**; the average of its magnitude is 2 V_peak/pi = 108 V, which is what a rectifier-type meter responds to.

Only rms belongs in a power calculation. Using peak or average in P = V^2/R is a common and expensive slip.`,
      examTip: 'Convert to omega = 2 pi f first and write it down. Most phasor errors on this exam are not conceptual - they are using f where omega belongs, which puts every reactance out by a factor of 6.28.',
      quiz: [
        {
          question: 'A 100 microfarad capacitor is driven at 60 Hz. What is its reactance magnitude?',
          options: ['26.5 ohm', '37.7 ohm', '0.0377 ohm', '16.7 ohm'],
          correctIndex: 0,
          explanation: 'X_C = 1/(omega C) with omega = 2 pi (60) = 377 rad/s, so X_C = 1/(377 x 100e-6) = 1/0.0377 = 26.5 ohm. Using f = 60 instead of omega gives 166 ohm; inverting the expression gives 0.0377.',
        },
        {
          question: 'In a series circuit at a given frequency, X_L = 40 ohm and X_C = 55 ohm. The current relative to the applied voltage is:',
          options: ['leading, because the branch is net capacitive', 'lagging, because the branch is net inductive', 'in phase, because the reactances are similar', 'leading, because X_L is smaller in magnitude than R'],
          correctIndex: 0,
          explanation: 'Net reactance is X_L - X_C = -15 ohm, so the branch is capacitive and the current leads the voltage. ICE: in a capacitor (C), I leads E. The value of R affects the size of the phase angle but never its sign.',
        },
        {
          question: 'A sinusoidal voltage has a peak value of 340 V. What is its rms value?',
          options: ['240 V', '340 V', '480 V', '216 V'],
          correctIndex: 0,
          explanation: 'For a sinusoid, V_rms = V_peak/sqrt(2) = 340/1.414 = 240 V. The 216 V distractor is the rectified average (2 V_peak/pi), which meters may display but which must never be used in a power calculation.',
        },
      ],
    },
    {
      id: 'acp-depth',
      title: '4. Reactance Across Frequency, and Non-Sinusoidal Waveforms',
      content: `## 4.1 Why the two reactances cancel at exactly one frequency

Inductive and capacitive reactance move in opposite directions with frequency,
and on log axes that is unmistakable:

![Inductive reactance rises in proportion to frequency while capacitive reactance falls as its inverse. The two are equal at one frequency only, where the net reactance passes through zero rather than merely becoming small.](/courses/fe-ee/figures/circuits-impedance-vs-frequency.svg)

X_L = omega L is a straight line of slope +1 on log-log; X_C = 1/(omega C) has
slope -1. Two straight lines of different slope cross exactly once, which is
why a series LC has exactly one resonant frequency rather than a band of them.

Below the crossing the capacitor dominates and the branch is capacitive, so
current leads. Above it, the inductor dominates and current lags. At the
crossing the net reactance is zero and the branch looks purely resistive.

## 4.2 Impedance is not the sum of magnitudes

A frequent and expensive error: for R = 30 ohm in series with X_L = 40 ohm,
the impedance magnitude is **not** 70 ohm. Reactance is at right angles to
resistance, so

|Z| = sqrt(30^2 + 40^2) = sqrt(900 + 1600) = **50 ohm**

Adding them arithmetically overstates the impedance by 40%, and would make the
current 40% too small. The right triangle is not decoration - it is the whole
relationship.

## 4.3 Admittance, conductance and susceptance

For parallel circuits, invert everything:

**$Y = 1/Z = G + jB$**, where G is conductance and B is susceptance.

The trap is that G is **not** 1/R when reactance is present. For Z = R + jX,

$$Y = 1/(R + jX) = (R - jX)/(R^2 + X^2)$$

so G = R/(R^2 + X^2) and B = -X/(R^2 + X^2). Only when X = 0 does G reduce to
1/R.

**Worked:** Z = 6 + j8 ohm. |Z| = 10, so |Y| = 0.1 S. Then G = 6/100 = 0.06 S
and B = -8/100 = -0.08 S. Check: sqrt(0.06^2 + 0.08^2) = sqrt(0.0036+0.0064)
= 0.1 S. Consistent.

## 4.4 rms of the waveforms the exam actually uses

Phasors assume a sinusoid. When the waveform is not sinusoidal the phasor
machinery does not apply, but the rms definition still does, and these four
values cover almost every non-sinusoidal question:

| Waveform | rms | Relative to peak |
|---|---|---|
| Sinusoid | $V_p/\\sqrt{2}$ | 0.707 |
| Square (bipolar) | V_p | 1.000 |
| Triangle / sawtooth | $V_p/\\sqrt{3}$ | 0.577 |
| Half-wave rectified sinusoid | V_p/2 | 0.500 |
| Full-wave rectified sinusoid | $V_p/\\sqrt{2}$ | 0.707 |

The last row surprises people: full-wave rectification does not change the rms
at all, because rms squares the signal and squaring removes the sign. It
changes the AVERAGE, from zero to 2V_p/pi, which is what a DC meter reads.

**Worked:** a 100 V peak square wave into 25 ohm dissipates V_rms^2/R =
100^2/25 = **400 W**. The same peak as a sinusoid gives (70.7)^2/25 =
**200 W** - exactly half, because the square wave sits at full amplitude all
the time and the sinusoid does not.

## 4.5 Phase measurement in practice

An oscilloscope measures phase as a time offset, not an angle, so the
conversion has to be done by hand:

**phase (degrees) = 360 x (delta t / T)**

where T is the period of one full cycle.

**Worked:** at 60 Hz the period is 16.67 ms. A current zero-crossing lagging
the voltage crossing by 1.85 ms is

360 x (1.85/16.67) = **40 degrees** lagging, so pf = cos(40) = **0.766**.

Two practical checks on that reading. The offset must be less than half a
period, or you have measured to the wrong crossing and the true angle is the
supplement. And the sign is set by which trace crosses first - current after
voltage is lagging and inductive, current before voltage is leading and
capacitive. An oscilloscope will happily show you a plausible number for the
wrong pair of crossings, so identify the direction before trusting the value.`,
      examTip: 'If a question gives a waveform sketch rather than the word "sinusoidal", stop before reaching for V_p/sqrt(2). Identify the shape first and use its own rms factor - this is the single most reliable trap in the AC section.',
      quiz: [
        {
          question: 'A resistance of 8 ohm is in series with a capacitive reactance of 6 ohm. What is the impedance magnitude?',
          options: ['10 ohm', '14 ohm', '2 ohm', '48 ohm'],
          correctIndex: 0,
          explanation: 'Resistance and reactance are perpendicular, so |Z| = sqrt(8^2 + 6^2) = sqrt(100) = 10 ohm. Adding them arithmetically to 14 ohm ignores the right angle and overstates the impedance by 40 percent.',
        },
        {
          question: 'A 100 V peak bipolar square wave and a 100 V peak sinusoid each drive the same resistor. How do their dissipated powers compare?',
          options: [
            'The square wave dissipates twice as much',
            'They dissipate the same power',
            'The sinusoid dissipates twice as much',
            'The square wave dissipates 1.41 times as much',
          ],
          correctIndex: 0,
          explanation: 'Square-wave rms equals its peak (100 V); sinusoid rms is 70.7 V. Power goes as rms squared, so the ratio is (100/70.7)^2 = 2. The square wave sits at full amplitude continuously while the sinusoid spends most of its time below peak.',
        },
      ],
    },
    {
      id: 'acp-waveshapes',
      title: '5. Waveform Analysis: Average and RMS from the Definition',
      content: `## 5.1 The three numbers a waveform owns

Any periodic waveform carries three summary values, and exam questions turn
on knowing which one is being asked for:

- **Full-cycle average** — the DC component, $(1/T)\\int _{0}^{T} x(t)\\, dt$. Zero
  for any waveform symmetric about the axis.
- **Rectified average** — the average of the magnitude, which is what a
  rectifier-and-meter movement responds to.
- **RMS** — the working value for power:

**$X_{rms} = \\sqrt{(1/T)\\int _{0}^{T} x^{2}(t)\\, dt}$**

The rms earns its privileged position because $P = X_{rms}^{2}/R$ holds for
EVERY waveform shape, not only sinusoids. It is, by construction, the DC
value that would heat the same resistor at the same rate — square the signal,
average the squares, take the root, exactly in that order.

## 5.2 Deriving the factors rather than memorising them

![One period each of a sine, a triangle and a square wave at the same peak, with the rms level dashed and the rectified average dotted on each panel. The three rms levels — 0.707, 0.577 and 1.000 of peak — are computed from the plotted samples, not asserted.](/courses/fe-ee/figures/circuits-waveform-rms.svg)

Each classic factor falls out of the definition in a line or two, and
deriving them once makes them hard to misremember:

- **Sinusoid.** Squaring gives $\\cos ^{2}$, whose average over a cycle is
  exactly 1/2. Root of 1/2: rms = $V_p/\\sqrt{2}$ = 0.707 $V_p$.
- **Triangle or sawtooth.** On every linear stretch the value is proportional
  to time, so the square is a parabola whose average is 1/3 of its peak.
  Root: rms = $V_p/\\sqrt{3}$ = 0.577 $V_p$. Any waveform built entirely from
  straight ramps between $+V_p$ and $-V_p$ shares this factor — sawtooth and
  triangle alike.
- **Square wave.** The square of the signal is $V_p^{2}$ at every instant, so
  the rms IS the peak. No averaging can reduce a constant.
- **Half-wave rectified sinusoid.** Sinusoid for half the cycle, zero for the
  other half, so the mean square is half the sinusoid's: $V_p^{2}/4$, giving
  rms = $V_p/2$.

## 5.3 A DC offset adds in quadrature

When a waveform rides on a DC level, the two parts combine the way
perpendicular legs do:

**$X_{rms} = \\sqrt{X_{DC}^{2} + X_{AC,rms}^{2}}$**

The cross term integrates to zero because the AC part averages to zero over a
cycle — which is precisely why the combination is Pythagorean rather than
arithmetic.

**Worked:** v(t) = 10 + 5 cos(omega t) volts across 4 ohm.

The AC part alone has rms 5/sqrt(2), so rms squared = 100 + 25/2 = 112.5 and
V_rms = sqrt(112.5) = **10.61 V**. Power: P = 112.5/4 = **28.1 W**.

Adding 10 + 3.54 = 13.54 V and squaring would claim 45.8 W — over 60% high.
The offset and the ripple do not add as magnitudes any more than resistance
and reactance do.

## 5.4 Form factor, crest factor, and why cheap meters lie

Two ratios summarise a shape, and both appear as distractors:

| Waveform | Rectified average | rms | Form factor | Crest factor |
|---|---|---|---|---|
| Sinusoid | 0.637 $V_p$ | 0.707 $V_p$ | 1.11 | 1.41 |
| Square (bipolar) | 1.000 $V_p$ | 1.000 $V_p$ | 1.00 | 1.00 |
| Triangle / sawtooth | 0.500 $V_p$ | 0.577 $V_p$ | 1.15 | 1.73 |

**Form factor** = rms / rectified average. An averaging meter actually
measures the rectified average and multiplies by 1.11, the sinusoid's form
factor, before printing "rms" on its face. Feed it anything non-sinusoidal
and the printed number is wrong by a predictable ratio: a square wave reads
about 11% high, a triangle about 4% low. A true-rms meter squares and
averages internally and has no such error.

**Crest factor** = peak / rms. It warns how far above the rms the waveform
actually excursions — relevant for insulation, for converter ratings and for
meters whose input stage clips. The triangle's 1.73 means its peaks stand 73%
above the heating-equivalent level.

## 5.5 Worked: power from a triangular current

A triangular current of 3 A peak flows in a 10 ohm resistor. Find the power.

$$I_{rms} = 3/\\sqrt{3} = 1.73\\ \\mathrm{A}$$

$$P = I_{rms}^{2}R = 3 \\times 10 = 30\\ \\mathrm{W}$$

The two wrong routes bracket it: using the peak, (3)^2 x 10 = 90 W, a
threefold overstatement; using the rectified average of 1.5 A,
(1.5)^2 x 10 = 22.5 W, a quarter low. Only the rms squares-then-averages in
the order that heating actually happens, which is why it is the only value
allowed inside a power formula.`,
      examTip: 'Before any rms arithmetic, name the shape and write its factor down: sqrt(2) sine, sqrt(3) triangle, 1 square, 2 half-wave. If the waveform has a DC offset, combine offset and ripple in quadrature - never by simple addition. These two habits between them defuse nearly every waveform trap the exam sets.',
      quiz: [
        {
          question: 'A voltage v(t) = 6 + 8 sin(omega t) volts is applied to a heater. What rms value governs the heating?',
          options: ['8.25 V', '14.0 V', '11.7 V', '10.0 V'],
          correctIndex: 0,
          explanation: 'The AC rms is 8/sqrt(2) = 5.66 V, and quadrature combination gives sqrt(36 + 32) = sqrt(68) = 8.25 V. Adding 6 + 8 = 14 V treats peak and offset as aligned magnitudes, and 6 + 5.66 = 11.7 V still adds what must be combined as perpendicular components.',
        },
        {
          question: 'An averaging multimeter calibrated for sinusoids reads a bipolar square wave. Its display is:',
          options: ['About 11% above the true rms', 'Exactly correct', 'About 11% below the true rms', 'Half the true rms'],
          correctIndex: 0,
          explanation: 'The meter measures the rectified average and multiplies by the sinusoidal form factor 1.11. For a square wave the rectified average already equals the rms, so the built-in 1.11 pushes the display 11% high. Only a true-rms instrument squares and averages internally.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'Phasor: v(t) = Vm·cos(ωt+φ) → V = Vm∠φ; all DC tools apply.',
    'Impedance: Z_R = R, Z_L = jωL, Z_C = 1/(jωC).',
    'ELI the ICE man: voltage leads current in inductors, current leads in capacitors.',
    'At DC: L = short, C = open. At high frequency: L = open, C = short.',
    'V_rms = V_peak/sqrt(2); power uses RMS values.',
  ],
},

fee_ac_power: {
  topicId: 'fee_ac_power',
  title: 'AC Power: Real, Reactive, and Apparent',
  domainWeight: 'Circuit Analysis · 10%',
  overview: 'AC power has three components: real power (useful work), reactive power (energy oscillation), and apparent power (total burden). The power triangle and power factor correction are essential for power system analysis.',
  sections: [
    {
      id: 'acpow-triangle',
      title: '1. Power Triangle and Power Factor',
      content: `## 1.1 Three Types of AC Power

| Power | Symbol | Unit | Formula | Meaning |
|---|---|---|---|---|
| Real (Active) | P | Watts (W) | $V\\cdot I\\cdot \\cos \\phi$ | Does useful work |
| Reactive | Q | VAR | $V\\cdot I\\cdot \\sin \\phi$ | Oscillates, no net work |
| Apparent | S | VA | $V\\cdot I$ | Total power burden |

### The Power Triangle

**$S^{2} = P^{2} + Q^{2}$** (Pythagorean relationship)

**$S = P + jQ$** (complex power)

- P is the horizontal leg
- Q is the vertical leg
- S is the hypotenuse

## 1.2 Power Factor

**$PF = \\cos \\phi = P/S$**

Where φ is the phase angle between voltage and current.

| PF | Meaning | Load Type |
|---|---|---|
| $PF = 1$ | Unity (all real) | Purely resistive |
| PF < 1, lagging | Current lags voltage | Inductive (motors) |
| PF < 1, leading | Current leads voltage | Capacitive |

### Why Power Factor Matters

Low PF means:
- More current needed for the same real power: **$I = P/(V\\cdot PF)$**
- Higher I²R losses in conductors
- Larger transformers and cables needed
- Utilities charge penalties for low PF`,
      examTip: 'The power triangle S² = P² + Q² and PF = P/S = cosφ are the most tested AC power concepts on the FE exam. Remember: S is always the largest (hypotenuse), P is always positive, and Q is positive for inductive (lagging) loads and negative for capacitive (leading) loads.',
    },
    {
      id: 'acpow-correction',
      title: '2. Complex Power and Power Factor Correction',
      content: `## 2.1 Complex Power

**$S = V \\cdot I$*** (voltage phasor times conjugate of current phasor)

**$S = P + jQ = |V|\\cdot |I|\\angle (\\theta v - \\theta i)$**

For a load with impedance Z = R + jX:
- **$P = I^{2}\\cdot R$** (real power dissipated in resistance)
- **$Q = I^{2}\\cdot X$** (reactive power in reactance)

## 2.2 Power Factor Correction

Industrial loads (motors) are inductive (lagging PF). Adding **parallel capacitors** reduces reactive power:

### Calculating Required Capacitance

To correct from $PF_{1}$ to $PF_{2}$:

1. Calculate old angle: φ₁ = arccos($PF_{1}$)
2. Calculate new angle: φ₂ = arccos($PF_{2}$)
3. Required capacitive reactive power: **$Q_C = P\\cdot (\\tan \\phi _{1} - \\tan \\phi _{2})$**
4. Capacitor value: **$C = Q_C/(\\omega \\cdot V^{2})$**

### Example
- 100 kW load at PF = 0.8 lagging; correct to PF = 0.95
- φ₁ = arccos(0.8) = 36.87°, φ₂ = arccos(0.95) = 18.19°
- Q_C = 100(tan36.87° - tan18.19°) = 100(0.75 - 0.329) = 42.1 kVAR

The capacitor bank must supply 42.1 kVAR of reactive power.`,
      examTip: 'Power factor correction adds capacitors in PARALLEL with the inductive load (not in series). The capacitor supplies reactive power locally, reducing the reactive power drawn from the source. This lowers apparent power and current without changing the real power consumed.',
      importantNote: 'Over-correcting power factor (making it leading) can cause voltage rise and potential resonance problems. Utilities typically require PF between 0.90 and 1.00 lagging — not leading.',
    },
    {
      id: 'acpw-worked',
      title: '3. Worked Examples',
      content: `## 3.1 The power triangle from a load

A single-phase load draws 20 A rms at 240 V rms with a lagging power factor of 0.80.

$$S = V I = 240 x 20 = 4800 VA$$
P = S cos(theta) = 4800 x 0.80 = **3840 W**
Q = S sin(theta), and sin(theta) = sqrt(1 - 0.64) = 0.60, so Q = 4800 x 0.60 = **2880 VAR** (lagging, so inductive and positive by convention)

Check the triangle: sqrt(3840^2 + 2880^2) = sqrt(14.75e6 + 8.29e6) = sqrt(23.04e6) = 4800 VA. Consistent.

The phase angle is arccos(0.80) = **36.9 degrees**, current lagging.

## 3.2 Power factor correction

Correct the load above to unity power factor at 60 Hz. The capacitor must supply the whole 2880 VAR:

$$Q_C = V^2/X_C, so X_C = V^2/Q_C = 240^2/2880 = 57600/2880 = 20 ohm$$.

C = 1/(omega X_C) = 1/(377 x 20) = 1/7540 = **133 microfarad**.

What changes: P stays at 3840 W — the capacitor supplies no real power. But S falls from 4800 VA to 3840 VA, so the line current falls from 20 A to 3840/240 = **16 A**, a 20% reduction. That current reduction is the whole economic point: smaller conductors and lower I squared R losses in the feeder.

## 3.3 Correcting to 0.95 rather than unity

Full correction is rarely economic. At pf = 0.95, theta = 18.2 degrees and the load may retain Q = P tan(theta) = 3840 x 0.329 = **1264 VAR**.

The capacitor supplies only the difference: 2880 - 1264 = **1616 VAR**, needing X_C = 57600/1616 = 35.6 ohm and C = 1/(377 x 35.6) = **74.5 microfarad** — barely more than half the capacitance for most of the benefit. Diminishing returns near unity is why utilities set a target rather than demanding unity.

## 3.4 Reading the sign of Q

A load with leading power factor (capacitive) has negative Q by the usual convention: it SUPPLIES reactive power rather than absorbing it. Synchronous motors run overexcited do exactly this, which is why they are used as power-factor correctors in industrial plants.`,
      examTip: 'Write S, P and Q as a right triangle before computing anything. Given any two of {S, P, Q, pf, theta} the rest follow by trigonometry, and the triangle keeps you from mixing watts with volt-amperes - which is the single most common error in this section.',
      quiz: [
        {
          question: 'A load draws 10 kW at a lagging power factor of 0.70. What is its apparent power?',
          options: ['14.3 kVA', '7.0 kVA', '10.0 kVA', '20.4 kVA'],
          correctIndex: 0,
          explanation: 'S = P/cos(theta) = 10/0.70 = 14.3 kVA. Multiplying instead of dividing gives 7.0 kVA, which would put apparent power below real power - impossible, since S is the hypotenuse of the power triangle and can never be smaller than P.',
        },
        {
          question: 'A capacitor is added in parallel with an inductive load to correct the power factor. What happens to the real power drawn from the source?',
          options: ['It is unchanged', 'It decreases in proportion to the correction', 'It increases', 'It falls to zero at unity power factor'],
          correctIndex: 0,
          explanation: 'An ideal capacitor absorbs no real power, so P is untouched. What changes is Q and therefore S and the line current. The benefit of correction is smaller conductors and lower I^2R feeder losses, not less real power delivered to the load.',
        },
        {
          question: 'A 240 V, 60 Hz load needs 1200 VAR of capacitive correction. What capacitance is required?',
          options: ['55.3 microfarad', '20.8 microfarad', '133 microfarad', '8.8 microfarad'],
          correctIndex: 0,
          explanation: 'X_C = V^2/Q = 57600/1200 = 48 ohm, then C = 1/(omega X_C) = 1/(377 x 48) = 55.3 microfarad. Forgetting to convert X_C to capacitance, or using f instead of omega, produces the other options.',
        },
      ],
    },
    {
      id: 'acpw-depth',
      title: '4. What a Poor Power Factor Actually Costs',
      content: `## 4.1 The cost curve

Hold the real power fixed at 1 kW and sweep the power factor. Apparent power
and reactive power both climb steeply as the factor falls:

![With real power held at 1 kW, apparent power S = P/pf and reactive power Q = P tan(arccos pf) both rise sharply as the power factor falls, while the real power that does the work stays flat.](/courses/fe-ee/figures/circuits-power-triangle.svg)

Read the shape rather than the numbers. At pf = 1 the apparent power equals
the real power and there is no reactive component at all. At pf = 0.7 the
apparent power is already 43% higher than the real power. By pf = 0.4 it has
more than doubled, and the reactive power exceeds the real power.

Since line current is S/V, that curve **is** the current the utility must
deliver and the conductors must carry - for exactly the same 1 kW of useful
work throughout.

## 4.2 Instantaneous power and where the negative part goes

For v = V_m cos(omega t) and i = I_m cos(omega t - theta), the instantaneous
power is

p(t) = V I cos(theta) + V I cos(2 omega t - theta)

using rms V and I. Two terms, and they behave completely differently:

- The first is **constant**, equal to P. This is the energy that leaves the
  source and does not come back.
- The second **oscillates at twice the line frequency** with zero average.
  This is energy sloshing into the reactance and back out again, twice per
  cycle.

When theta is nonzero, p(t) dips **negative** for part of each cycle: the load
is returning energy to the source. That returned energy still had to travel
down the conductors to get there, and it still caused I^2 R loss on the way.
That is the physical reason reactive power costs money without doing work.

At theta = 90 degrees (pure reactance) the constant term vanishes entirely,
the waveform is symmetric about zero, and the average power is exactly zero -
while the current is at full amplitude.

## 4.3 Complex power, and the sign convention that matters

**$S = V I$*** (voltage phasor times the CONJUGATE of the current phasor)
$$= P + jQ$$.

The conjugate is not optional. Using V I instead of V I* flips the sign of Q
and turns a lagging load into a leading one.

**Worked:** V = 240 at 0 degrees, I = 12 at -30 degrees (lagging).
S = (240)(12 at +30) = 2880 at 30 degrees = 2880cos30 + j2880sin30
= **2494 + j1440**, so P = 2494 W and Q = +1440 VAR.

Positive Q means the load absorbs reactive power, i.e. it is inductive. A
leading load returns negative Q.

## 4.4 The three quantities on a bill

| Quantity | Unit | Metered? | What it costs you |
|---|---|---|---|
| Real power P | kW / kWh | yes, always | the energy charge |
| Apparent power S | kVA | often, as demand | the demand charge, sized by peak |
| Reactive power Q | kVAR | sometimes | a power-factor penalty below target |

A plant that halves its reactive power does not reduce its kWh at all. It
reduces the kVA demand and removes the penalty, and it frees transformer and
cable capacity that was being spent carrying current that did no work. Those
are the three benefits an exam answer should name.`,
      examTip: 'S = V I* with the conjugate. Write the star every time - the sign of Q is the whole answer to "is this load leading or lagging", and dropping the conjugate reverses it silently.',
      quiz: [
        {
          question: 'A purely reactive load draws 10 A rms at 240 V rms. What is the average real power delivered to it?',
          options: ['0 W', '2400 W', '1200 W', '1697 W'],
          correctIndex: 0,
          explanation: 'A purely reactive load has theta = 90 degrees, so P = VI cos(90) = 0. Energy flows into the reactance and back out twice per cycle with zero net transfer - yet the full 10 A still flows in the conductors and still causes I^2R loss there.',
        },
        {
          question: 'V = 120 at 0 degrees and I = 5 at -60 degrees. What is the complex power S?',
          options: ['300 + j520 VA', '300 - j520 VA', '600 at -60 degrees VA', '520 + j300 VA'],
          correctIndex: 0,
          explanation: 'S = V I* = (120)(5 at +60) = 600 at 60 degrees = 600cos60 + j600sin60 = 300 + j520. The conjugate flips the current angle from -60 to +60, and the positive Q confirms an inductive, lagging load.',
        },
      ],
    },
    {
      id: 'acpw-combining',
      title: '5. Instantaneous Power, Element Signs, and Combining Loads',
      content: `## 5.1 Watching p(t) instead of reasoning about it

Multiply v(t) and i(t) point by point and the product is the instantaneous
power, whose shape carries the whole argument of this chapter in one picture:

![Instantaneous power over two cycles for a resistive load and for a load with a 60 degree phase angle, both at the same rms voltage and current. The resistive curve pulses between zero and twice its average without ever going negative; the 60 degree curve has a lower average and spends part of every cycle below zero, handing energy back to the line.](/courses/fe-ee/figures/circuits-instantaneous-power.svg)

With rms values V and I, the product of the two sinusoids expands to

**$p(t) = VI\\cos \\theta + VI\\cos (2\\omega t - \\theta)$**

and the two curves in the figure are exactly that expression at theta = 0 and
theta = 60 degrees. Set them side by side:

- The **resistive** curve swings between 0 and 2VI at twice the line
  frequency, and its average is the full VI. It touches zero twice per cycle
  but never crosses it — every joule that leaves the source stays delivered.
- The **60 degree** curve has the same swing but a lower centre. Its average
  is VI cos(60) = 0.5 VI, and it reaches −0.5 VI twice per cycle. In those
  shaded lobes the load is pushing energy back toward the source.
- Both loads carry the SAME rms current, so the feeder heats identically in
  the two cases. Only one of them converts that current fully into work.
  That asymmetry, drawn rather than defined, is the power factor.

Push theta to 90 degrees and the centre of the oscillation reaches zero: the
average power vanishes while the current is undiminished. Every joule
delivered during one quarter-cycle returns during the next, which is the
operational meaning of "purely reactive".

## 5.2 The sign of Q, element by element

Each ideal element occupies a fixed place in the power triangle, and mixed
loads are settled by summing these rows:

| Element | Real power | Reactive power | Bookkeeping role |
|---|---|---|---|
| Resistor | $P = I^{2}R$ | 0 | dissipates, never stores |
| Inductor | 0 | $Q = +I^{2}X_L$ | absorbs VARs |
| Capacitor | 0 | $Q = -I^{2}X_C$ | supplies VARs |

The signs are convention — an inductor is counted as consuming reactive power
and a capacitor as producing it — but once adopted they make correction
arithmetic automatic: a capacitor's negative Q offsets an inductor's positive
Q directly, which is the entire mechanism behind the capacitor banks of
section 2.

## 5.3 Complex powers add; apparent powers do not

Parallel loads share one voltage, so their complex powers sum:
$S_{total} = S_{1} + S_{2} + ...$, with the real parts and the reactive parts
each adding SEPARATELY. What must never be added is the apparent power
magnitudes, unless every load happens to sit at one common phase angle.

**Worked:** two loads share a 240 V rms feeder. Load 1 draws 6 kW with a
lagging factor of 0.80; load 2 draws 4 kW at unity.

Load 1's triangle: S_1 = 6/0.80 = 7.5 kVA, so Q_1 = sqrt(7.5^2 - 6^2) =
**4.5 kVAR**. The 6, 7.5, 4.5 sides are a scaled 3-4-5 right triangle, a
pattern worth recognising on sight because exam writers reuse it. Load 2
brings 4 kW and no VARs at all.

Totals: P = 6 + 4 = **10 kW** and Q = 4.5 + 0 = **4.5 kVAR**, so

$$S = \\sqrt{10^{2} + 4.5^{2}} = \\sqrt{120.25} = 10.97\\ \\mathrm{kVA}$$

The combined power factor is 10/10.97 = **0.912 lagging**, and the feeder
carries 10,970/240 = **45.7 A**.

Adding the apparent powers instead — 7.5 + 4 = 11.5 kVA — overstates the
burden by roughly 5%, and the error widens as the load angles spread apart.
The triangle adds leg by leg; the hypotenuses never add.

## 5.4 Correcting the combined installation

Bring that feeder to 0.98 lagging at 60 Hz. At the target angle,
tan(arccos 0.98) = 0.203, so the reactive power the supply will still carry is

Q_allowed = 10 x 0.203 = **2.03 kVAR**

The capacitor bank must produce the remainder: Q_C = 4.5 - 2.03 =
**2.47 kVAR**. Converting that to hardware,

X_C = V^2/Q_C = 57600/2470 = 23.3 ohm, and C = 1/(omega X_C) = 1/(377 x 23.3) = **113.8 microfarad**

After correction the apparent power falls to 10/0.98 = 10.2 kVA and the line
current to 10,200/240 = **42.5 A** — a 7% reduction for the climb from 0.912
to 0.98. Compare that with section 3.2, where the first stage of correction
cut the current by a full 20%: the closer the starting point sits to unity,
the less each additional kVAR of capacitance buys. Utilities set targets like
0.95 or 0.98 precisely because the last few hundredths are the most expensive.

One more consequence worth naming: transformers, switchgear and conductors
are all rated in kVA, not kW. Correction that trims S from 10.97 to
10.2 kVA frees that margin for future load without touching the real power
delivered — capacity recovered from bookkeeping rather than from copper.`,
      examTip: 'When a problem gives several loads, resist every urge to combine their kVA ratings directly. Convert each load to P and Q, add the columns, and rebuild S = sqrt(P^2 + Q^2) at the end. The componentwise path is never wrong; the magnitude shortcut almost always is.',
      quiz: [
        {
          question: 'Load A draws 3 kW at 0.6 lagging and load B draws 4 kW at unity, on the same feeder. What is the total apparent power?',
          options: ['8.06 kVA', '9.00 kVA', '7.00 kVA', '5.00 kVA'],
          correctIndex: 0,
          explanation: 'Load A: S = 3/0.6 = 5 kVA, so Q = sqrt(25 - 9) = 4 kVAR. Totals: P = 7 kW, Q = 4 kVAR, S = sqrt(49 + 16) = sqrt(65) = 8.06 kVA. Adding the individual apparent powers (5 + 4 = 9 kVA) ignores that the two loads sit at different angles.',
        },
        {
          question: 'For a load with theta = 90 degrees, the instantaneous power p(t):',
          options: [
            'Averages zero, alternating symmetrically above and below the axis',
            'Is always positive but pulsating',
            'Is constant at VI',
            'Is zero at every instant',
          ],
          correctIndex: 0,
          explanation: 'At theta = 90 degrees the constant term VI cos(theta) vanishes, leaving only the double-frequency oscillation. Power flows in during one quarter-cycle and back out during the next, netting zero — while the conductors still carry the full rms current. p(t) is not zero at every instant; only its average is.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'P = VI·cosφ (real, watts); Q = VI·sinφ (reactive, VAR); S = VI (apparent, VA).',
    'Power triangle: S² = P² + Q²; PF = P/S = cosφ.',
    'Lagging PF (inductive loads) is most common; correct with parallel capacitors.',
    'Q_C = P·(tanφ₁ - tanφ₂) calculates required capacitive reactive power.',
    'Low PF increases current, losses, and equipment sizing requirements.',
  ],
},

fee_resonance: {
  topicId: 'fee_resonance',
  title: 'Resonance and Frequency Response',
  domainWeight: 'Circuit Analysis · 10%',
  overview: 'Resonance occurs when inductive and capacitive reactances cancel. The resonant frequency, quality factor, and bandwidth characterize RLC circuit frequency response and are fundamental to filter design.',
  sections: [
    {
      id: 'res-series-parallel',
      title: '1. Series and Parallel Resonance',
      content: `## 1.1 Resonant Frequency

At resonance, X_L = X_C:

**$\\omega _{0} = 1/\\sqrt{LC}$** (rad/s) or **$f_{0} = 1/(2\\pi \\cdot \\sqrt{LC})$** (Hz)

## 1.2 Series RLC Resonance

At resonance:
- **$Z = R$** (minimum impedance, purely resistive)
- **Current is maximum**: I = V/R
- Voltage and current are **in phase** (φ = 0)
- Voltage across L and C can be **much larger** than source voltage (Q-factor amplification)

## 1.3 Parallel RLC Resonance

At resonance:
- **$Z = R$** (maximum impedance, purely resistive)
- Current from source is **minimum**: I = V/R
- This is the opposite behavior from series resonance

| Property | Series RLC | Parallel RLC |
|---|---|---|
| At resonance | Z minimum | Z maximum |
| Current | Maximum | Minimum |
| Impedance | $Z = R$ | Z = R (or Q²R for practical) |
| Application | Band-pass filter | Band-reject filter |

## 1.4 One circuit, numbers all the way through

Resonance questions are quick once the circuit is on paper, because every
quantity comes from the same three components:

![A series RLC circuit driven by a sinusoidal source: R = 10 ohm, L = 100 mH and C = 10 microfarad in one loop. Series resonance is the condition that makes this loop look purely resistive.](/courses/fe-ee/figures/sch-rlc-series.svg)

**Resonant frequency.** ω₀ = 1/√(LC) = 1/√(0.1 × 10×$10^{-6}$) = 1/√($10^{-6}$) =
**1000 rad/s**, which is $f_{0}$ = 1000/2π = **159.2 Hz**.

**The reactances at that frequency.** X_L = ω₀L = 1000 × 0.1 = 100 Ω, and
X_C = 1/(ω₀C) = 1/(1000 × 10×$10^{-6}$) = 100 Ω. Equal, as they must be — that
equality *is* the definition of resonance, and computing both is the fastest
check that you inverted LC correctly.

**Quality factor, two ways.** Q = ω₀L/R = 1000 × 0.1/10 = 10. Independently,
Q = (1/R)√(L/C) = (1/10)√(0.1/$10^{-5}$) = (1/10)√($10^{4}$) = (1/10)(100) = 10. Same
answer by a different route.

**Bandwidth.** BW = ω₀/Q = 1000/10 = **100 rad/s**, i.e. 15.92 Hz. The
half-power frequencies are not simply ω₀ ± BW/2; they are

$$\\omega = \\mp R/(2L) + \\sqrt{(R/2L)^{2} + 1/(LC)} = \\mp 50 + \\sqrt{2500 + 10^{6}} = \\mp 50 + 1001.25$$

giving **951.25 and 1051.25 rad/s**. Their difference is exactly 100 rad/s, so
the bandwidth formula holds precisely, while their *geometric* mean —
√(951.25 × 1051.25) = 1000.0 — is ω₀. The band is symmetric on a logarithmic
axis, not a linear one, which is why the arithmetic midpoint 1001.25 is slightly
above ω₀ rather than equal to it.

## 1.5 Voltage magnification, and why it surprises people

Drive the loop above with a 10 V rms source at resonance. The impedance is
purely R = 10 Ω, so I = 10/10 = 1 A rms. Then:

| Element | Impedance at ω₀ | Voltage across it | Relative to source |
|---|---|---|---|
| R | $10\\ \\Omega$ | 10.0 V | $1\\times$ |
| L | $j100\\ \\Omega$ | 100.0 V | **$10\\times$** |
| C | $-j100\\ \\Omega$ | 100.0 V | **$10\\times$** |
| L and C together | $j100 - j100 = 0$ | 0.0 V | $0\\times$ |

A 10 V source produces 100 V across the inductor. Nothing is violated: the
inductor and capacitor voltages are 180° out of phase and cancel exactly, so
KVL around the loop closes on 10 V. But the *individual* element voltages are
Q times the source, and Q = 10 here. This is why a component rated for the
supply voltage can fail in a resonant circuit, and it is a favourite exam trap:
the question gives a source voltage and asks for V_C, and the answer is not the
source voltage.

Move off resonance and the effect collapses quickly. At ω = 2000 rad/s,
X_L = 200 Ω and X_C = 50 Ω, so the net reactance is 150 Ω and
|Z| = √(10² + 150²) = 150.3 Ω — fifteen times the resonant impedance, with the
current down by the same factor. High Q buys sharp selectivity; it does not buy
a broad response.

## 1.6 The parallel case, using the same components

Rearrange those same three elements in parallel across a source and every
statement inverts. ω₀ is unchanged at 1/√(LC) = 1000 rad/s, because it depends
only on L and C. But now:

- The L and C branches carry equal and opposite currents that **circulate
  between them** rather than returning to the source, so the current drawn from
  the supply is a *minimum* at resonance.
- The impedance seen by the source is a *maximum*, not a minimum.
- **Current** magnification replaces voltage magnification: the tank branches
  carry Q times the source current.

A useful way to keep the pair straight is to ask what the resonant element
*shares* with the source. In series, all elements share the current, so the
dramatic quantity is voltage. In parallel, all elements share the voltage, so
the dramatic quantity is current. Everything else — the factor of Q, the
BW = ω₀/Q relation, the flat-topped selectivity trade-off — carries over
unchanged.`,
      examTip: 'Series resonance: impedance MINIMUM, current MAXIMUM. Parallel resonance: impedance MAXIMUM, current MINIMUM. This is the most important distinction. The resonant frequency formula ω₀ = 1/sqrt(LC) is the same for both.',
    },
    {
      id: 'res-q-bw',
      title: '2. Quality Factor and Bandwidth',
      content: `## 2.1 Quality Factor (Q)

**$Q = \\omega _{0}L/R = 1/(\\omega _{0}RC) = \\sqrt{L/C}/R$**

Q measures how "sharp" the resonance peak is:
- **High Q** (> 10): narrow bandwidth, very selective
- **Low Q** (< 1): broad bandwidth, not selective

Q also represents energy stored vs. energy dissipated per cycle:
- Q = 2π × (energy stored) / (energy dissipated per cycle)

## 2.2 Bandwidth

**$BW = f_{0}/Q = R/(2\\pi L)$** for series RLC

The bandwidth is the frequency range between the **-3 dB points** (half-power points):

- Lower cutoff: $f_{1}$ = $f_{0}$ - BW/2
- Upper cutoff: $f_{2}$ = $f_{0}$ + BW/2

At the -3 dB points:
- Power is **half** of peak power
- Current is **$1/\\sqrt{2} \\approx 0.707$** of peak current
- Impedance is **$\\sqrt{2} \\approx 1.414$** times minimum impedance

### Selectivity

| Q Value | Bandwidth | Application |
|---|---|---|
| $Q > 100$ | Very narrow | Radio tuning, crystal oscillators |
| $Q = 10-100$ | Moderate | Band-pass filters |
| $Q < 10$ | Wide | Broadband circuits |
| $Q < 1$ | Very wide | Damped systems |`,
      examTip: 'BW = f₀/Q tells you everything: higher Q = narrower bandwidth = more selective. On the FE exam, if asked about bandwidth, find Q first. Remember: Q = ω₀L/R, so increasing R decreases Q and widens bandwidth.',
      importantNote: 'The -3 dB points are where power drops to HALF (-3 dB ≈ 10·log(0.5)) — not where voltage drops to half. Voltage at -3 dB is 1/sqrt(2) ≈ 0.707 of peak. This is a common source of confusion.',
    },
    {
      id: 'res-worked',
      title: '3. Worked Examples',
      content: `## 3.1 Series resonance: the full set of numbers

R = 10 ohm, L = 100 mH, C = 10 microfarad in series across a 50 V rms source.

omega_0 = 1/sqrt(LC) = 1/sqrt(0.1 x 10e-6) = 1/sqrt(1e-6) = **1000 rad/s**, i.e. f_0 = 1000/(2 pi) = **159 Hz**.

At resonance X_L = 1000 x 0.1 = 100 ohm and X_C = 1/(1000 x 10e-6) = 100 ohm — equal, as they must be. They cancel, so Z = R = **10 ohm** and the current is maximal: I = 50/10 = **5 A**.

Q = omega_0 L/R = (1000)(0.1)/10 = **10**. Equivalently Q = (1/R)sqrt(L/C) = (1/10)sqrt(0.1/10e-6) = (1/10)(100) = 10. Bandwidth: BW = omega_0/Q = 1000/10 = **100 rad/s**.

## 3.2 Voltage magnification

The reactive voltages at resonance are NOT zero — they are large and opposite:

V_L = I X_L = 5 x 100 = **500 V**, and V_C = 500 V, 180 degrees out of phase.

That is Q times the 50 V source. A component rated for the supply voltage will fail here. Voltage magnification by Q is real, is the basis of tuned circuits, and is a favourite exam question precisely because the answer looks impossible.

## 3.3 Half-power points

The half-power frequencies sit approximately omega_0 ± BW/2 for high Q: 1000 ± 50, so **950 and 1050 rad/s**. At those points |Z| = R sqrt(2) = 14.1 ohm, the current has fallen to 5/sqrt(2) = 3.54 A, and the power to half its peak — which is what "half-power" names.

## 3.4 Parallel resonance is the mirror image

Take the same L and C in parallel with R. The resonant frequency is the same 1000 rad/s, but at resonance the parallel LC presents a very HIGH impedance, so the line current is MINIMAL rather than maximal, and the circuit acts as a band-stop rather than a band-pass.

| | Series resonance | Parallel resonance |
|---|---|---|
| Impedance at omega_0 | minimum, = R | maximum |
| Current at omega_0 | maximum | minimum |
| Magnified quantity | voltage across L and C | current circulating in L and C |
| Behaves as | band-pass / acceptor | band-stop / rejector |`,
      examTip: 'Compute omega_0 = 1/sqrt(LC) first and check that X_L and X_C really are equal there. If they are not, you have a unit slip - almost always microfarads left as whole numbers instead of converted to farads.',
      quiz: [
        {
          question: 'A series RLC circuit has L = 40 mH and C = 25 microfarad. What is its resonant frequency in rad/s?',
          options: ['1000 rad/s', '159 rad/s', '6283 rad/s', '100 rad/s'],
          correctIndex: 0,
          explanation: 'omega_0 = 1/sqrt(LC) = 1/sqrt(0.040 x 25e-6) = 1/sqrt(1e-6) = 1000 rad/s. The 159 distractor is that answer converted to hertz - read whether the question asks for omega or f.',
        },
        {
          question: 'At series resonance with Q = 20 and a 10 V source, what is the magnitude of the voltage across the inductor?',
          options: ['200 V', '10 V', '0 V', '0.5 V'],
          correctIndex: 0,
          explanation: 'Voltage magnification at resonance is Q times the source: 20 x 10 = 200 V. The inductor and capacitor voltages are equal and opposite so they cancel in the loop, but each is individually large - which is why component voltage ratings matter in tuned circuits.',
        },
        {
          question: 'How does a parallel RLC circuit behave at its resonant frequency?',
          options: [
            'Impedance is maximum and line current is minimum',
            'Impedance is minimum and line current is maximum',
            'Impedance is zero',
            'It has no resonant frequency',
          ],
          correctIndex: 0,
          explanation: 'Parallel resonance is the dual of series: the tank presents maximum impedance, so the current drawn from the line is minimum. This makes it a band-stop (rejector) circuit, whereas series resonance is band-pass (acceptor).',
        },
      ],
    },
    {
      id: 'res-depth',
      title: '4. Selectivity, Bandwidth and the Q Trade-off',
      content: `## 4.1 What Q buys and what it costs

Fix L and C so the resonant frequency does not move, and vary only R:

![Series RLC current against frequency for Q = 2, 5 and 10, each normalised to its own peak. All three peak at the same frequency; higher Q gives a narrower band, which is the relationship BW = omega_0 / Q made visible.](/courses/fe-ee/figures/circuits-series-resonance.svg)

Three facts the figure makes obvious and a sentence does not:

- **The centre does not move.** omega_0 = 1/sqrt(LC) has no R in it, so
  changing damping changes the shape and never the tuning.
- **Higher Q is narrower.** BW = omega_0/Q exactly, so doubling Q halves the
  bandwidth.
- **The half-power line is where the band is measured.** The 0.707 line cuts
  each curve at two points, and the gap between them is the bandwidth.

The trade is unavoidable: a highly selective circuit rejects neighbouring
frequencies well but responds slowly to changes, because a narrow bandwidth in
frequency is a long settling time in the time domain. A radio front end wants
high Q to separate stations; a power filter wants low Q so it does not ring.

## 4.2 Bandwidth from the half-power frequencies

The exact half-power frequencies are

omega_1,2 = omega_0[sqrt(1 + 1/(4Q^2)) -/+ 1/(2Q)]

which for Q above about 5 collapses to the approximation omega_0 ± BW/2 that
the worked examples used.

Two relations worth carrying:

- **omega_0 = sqrt(omega_1 omega_2)** - the resonant frequency is the
  GEOMETRIC mean of the half-power points, not the arithmetic mean. For low Q
  the two differ noticeably.
- **BW = omega_2 - omega_1 = R/L** for a series circuit, which is a route to
  bandwidth that never needs Q at all.

**Worked:** a circuit has half-power points at 900 and 1100 rad/s. The
geometric mean is sqrt(900 x 1100) = sqrt(990000) = **995 rad/s**, not the
1000 the arithmetic mean would suggest. BW = 200 rad/s, so Q = 995/200 =
**4.98**.

## 4.3 Parallel resonance with a real inductor

An ideal parallel LC has infinite impedance at resonance. A real one does not,
because the inductor carries winding resistance R_L in series with it. The
tank's impedance at resonance becomes finite:

**$Z_{tank} = L/(R_L C)$**

which is often written as Q^2 R_L. This is the dynamic resistance, and it is
what a real tank circuit presents to the source.

**Worked:** L = 100 microhenry, C = 100 picofarad, R_L = 5 ohm.
Z_tank = 100e-6/(5 x 100e-12) = 100e-6/500e-12 = **200 kilohm**.

High but finite, and it is the number that sets the gain of a tuned amplifier
stage.

## 4.4 Energy view of Q

Q has a definition independent of any circuit topology:

**Q = 2 pi x (energy stored)/(energy dissipated per cycle)**

A Q of 50 means the circuit stores about 50/(2 pi) = 8 times the energy it
loses each cycle, so oscillation persists for roughly Q radians - about
Q/(2 pi) = 8 full cycles - before decaying appreciably. That is why a high-Q
resonator rings and a low-Q one does not, and why Q appears identically in
mechanical resonators, quartz crystals and RLC circuits.

## 4.5 Designing a filter to a specification

A tuned circuit is to pass 455 kHz with a 10 kHz bandwidth, using a 100
microhenry inductor. Find C, Q and the required R.

**Capacitance from the centre frequency.** omega_0 = 2 pi (455e3) = 2.859e6
rad/s. From omega_0 = 1/sqrt(LC),

C = 1/(omega_0^2 L) = 1/((2.859e6)^2 x 100e-6) = 1/(8.174e12 x 1e-4)
= 1/8.174e8 = **1.22 nanofarad**

**Q from the bandwidth.** Q = f_0/BW = 455/10 = **45.5**.

**R from Q.** For a series circuit Q = omega_0 L/R, so

R = omega_0 L/Q = (2.859e6)(100e-6)/45.5 = 285.9/45.5 = **6.28 ohm**

That total includes the inductor's own winding resistance, which at these
frequencies is often the dominant term - meaning the achievable Q is set by
the inductor you can build, not by a resistor you choose. If the winding alone
measures 10 ohm, the bandwidth cannot be narrower than omega_0 L/10 = 28.6,
i.e. BW = 455/28.6 = **15.9 kHz**, and the specification is unachievable with
that component. Recognising that constraint is the difference between a
calculation and a design.`,
      examTip: 'Resonant frequency is the GEOMETRIC mean of the half-power frequencies, sqrt(f1 f2), not their average. At high Q the two agree closely enough to hide the error, which is exactly why the exam sets low-Q numbers where they do not.',
      quiz: [
        {
          question: 'A resonant circuit has half-power frequencies of 400 and 900 rad/s. What is its resonant frequency?',
          options: ['600 rad/s', '650 rad/s', '500 rad/s', '1300 rad/s'],
          correctIndex: 0,
          explanation: 'omega_0 is the GEOMETRIC mean: sqrt(400 x 900) = sqrt(360000) = 600 rad/s. The arithmetic mean gives 650, which is wrong - and the gap between the two answers grows as Q falls, which is why the exam chooses widely separated half-power points.',
        },
        {
          question: 'A series RLC circuit has R = 4 ohm and L = 20 mH. What is its bandwidth?',
          options: ['200 rad/s', '80 rad/s', '5000 rad/s', 'It cannot be found without C'],
          correctIndex: 0,
          explanation: 'BW = R/L = 4/0.020 = 200 rad/s. Bandwidth depends only on R and L - the capacitance sets where the band is centred but not how wide it is, which is why C is genuinely not needed here.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'Resonant frequency: ω₀ = 1/sqrt(LC); f₀ = 1/(2π·sqrt(LC)).',
    'Series resonance: Z minimum, I maximum; parallel: Z maximum, I minimum.',
    'Quality factor Q = ω₀L/R; higher Q = sharper peak.',
    'Bandwidth BW = f₀/Q; -3 dB points are at half-power.',
    'At resonance: impedance is purely resistive, voltage and current are in phase.',
  ],
},

fee_three_phase: {
  topicId: 'fee_three_phase',
  title: 'Three-Phase Circuits and Power',
  domainWeight: 'Circuit Analysis · 10%',
  overview: 'Three-phase AC systems are the standard for industrial power delivery. Three voltages 120 degrees apart provide constant power, efficient transmission, and compact motor designs. Wye and delta configurations have different voltage-current relationships.',
  sections: [
    {
      id: '3ph-config',
      title: '1. Wye and Delta Configurations',
      content: `## 1.1 Three-Phase Voltages

Three balanced sinusoidal voltages, each 120° apart:
- V_a = Vm∠0°
- V_b = Vm∠-120°
- V_c = Vm∠-240° (= Vm∠+120°)

For balanced systems: **$V_a + V_b + V_c = 0$**

## 1.2 Wye (Y) Connection

Phase windings share a common **neutral point**.

| Quantity | Relationship |
|---|---|
| Line voltage | $V_L = \\sqrt{3} \\cdot V_{ph}$ |
| Line current | $I_L = I_{ph}$ |
| Neutral carries | Only unbalanced current (zero if balanced) |

## 1.3 Delta (Δ) Connection

Phase windings form a closed triangle.

| Quantity | Relationship |
|---|---|
| Line voltage | $V_L = V_{ph}$ |
| Line current | $I_L = \\sqrt{3} \\cdot I_{ph}$ |
| No neutral wire | Delta has no neutral point |

### Delta-Wye Conversion

For balanced impedances: **$Z_\\Delta = 3 \\cdot Z_Y$** (or Z_Y = Z_Δ/3)

## 1.4 The two loads, drawn

Every three-phase question begins with deciding which of these two you are
looking at, because the √3 goes in a different place for each:

![Three equal impedances connected in wye, sharing a neutral point N, and the same three connected in delta as a closed triangle. Terminals A, B and C are the three line conductors in both cases.](/courses/fe-ee/figures/sch-wye-delta.svg)

The distinction to hold on to is *which quantity the phase element sees*:

- In **wye**, each element sits between a line and the neutral, so it sees the
  **phase voltage** V_L/√3, and whatever current flows through it is also the
  line current — there is nowhere else for that current to go.
- In **delta**, each element sits between two lines, so it sees the **full line
  voltage**. But each line conductor feeds two elements, so the line current is
  √3 times the current in any one element.

Exactly one √3 appears in each connection, and it is on the quantity the
element does *not* share with the line. Getting this backwards is the single
most common three-phase error, and it is worth re-deriving from the picture
rather than memorising four rows.

## 1.5 The same three impedances, both ways

Take a balanced 208 V (line-to-line) supply and three 10 Ω resistive elements.
Connect them first in wye, then in delta, and compute everything.

| Quantity | Wye connection | Delta connection |
|---|---|---|
| Voltage across each element | $208/\\sqrt{3} = 120.1\\ \\mathrm{V}$ | 208 V |
| Current in each element | $120.1/10 = 12.01\\ \\mathrm{A}$ | $208/10 = 20.80\\ \\mathrm{A}$ |
| Line current | 12.01 A | $\\sqrt{3} \\times 20.80 = 36.03\\ \\mathrm{A}$ |
| Power per element | $12.01^{2} \\times 10 = 1442\\ \\mathrm{W}$ | $20.80^{2} \\times 10 = 4326\\ \\mathrm{W}$ |
| **Total real power** | **4.33 kW** | **12.98 kW** |

The delta connection draws **exactly three times** the power of the wye from the
same supply, and the ratio is not approximate: algebraically
P_Y = 3(V_L/√3)²/Z = V_L²/Z, while P_Δ = 3V_L²/Z. Nothing about the elements
changed — only how they are wired — which is the whole basis of wye-delta
motor starting, where a motor is brought up to speed in wye at one third of the
inrush and then switched to delta for full torque.

Check the total power the other way as well:
P = √3 · V_L · I_L · cos φ. For the wye case that is
1.732 × 208 × 12.01 × 1 = 4327 W, and for delta
1.732 × 208 × 36.03 × 1 = 12,980 W. Both agree with the per-element column to
within rounding. **This formula uses line quantities and works for either
connection** — that is precisely why it is the one to reach for when a problem
gives you a nameplate rather than a diagram. The √3 is already built in, so
applying it to phase quantities double-counts.

## 1.6 Per-phase analysis, and when it is legal

For a balanced system, all three phases carry the same magnitudes displaced by
120°, so you may solve **one phase** and rotate the answer. The standard
procedure is:

1. Convert any delta load to its wye equivalent with Z_Y = Z_Δ/3.
2. Draw the single-phase circuit: one source of V_L/√3 at 0°, one Z_Y, neutral
   as the reference.
3. Solve it as an ordinary AC circuit.
4. Multiply the resulting power by three; rotate voltages and currents by
   ∓120° for the other two phases.

Two conditions make this legal, and the exam does test them. The source must be
balanced, and the load must be balanced. When either fails — one blown fuse, one
oversized single-phase load — the phases no longer differ by a simple rotation,
the neutral carries current, and per-phase analysis gives the wrong answer
rather than an approximate one. Unbalanced systems need node analysis, or
symmetrical components at the professional level.

For a balanced wye load the neutral current is
I_a + I_b + I_c = I(1∠0° + 1∠−120° + 1∠120°) = 0. That is why a balanced
four-wire system can run with a thin neutral, and why removing the neutral
entirely changes nothing until the load goes out of balance.

## 1.7 Measuring the power that actually flows

A three-phase load needs only **two** wattmeters, not three, whether or not the
load is balanced and whether it is wye or delta — Blondel's theorem, which says
an n-wire system needs n − 1 meters. Connect each meter's current coil in a
different line and both voltage coils to the third line; total power is the
algebraic sum of the two readings.

The sum is *algebraic*, and one reading goes negative when the power factor
falls below 0.5. That is not a fault and not a wiring error, and a question that
reports one negative wattmeter is testing whether you subtract rather than
ignore it. The two readings also give the power factor directly, since
tan φ = √3 ($P_{2}$ − $P_{1}$)/($P_{2}$ + $P_{1}$) — which is why the two-wattmeter method survives
in practice long after digital meters could have replaced it.`,
      examTip: 'The sqrt(3) factor appears in EVERY three-phase problem. For wye: multiply phase voltage by sqrt(3) to get line voltage. For delta: multiply phase current by sqrt(3) to get line current. Draw the phasor diagram if you forget which one.',
    },
    {
      id: '3ph-power',
      title: '2. Three-Phase Power and Per-Phase Analysis',
      content: `## 2.1 Three-Phase Power

For balanced systems:

- **$P = \\sqrt{3} \\cdot V_L \\cdot I_L \\cdot \\cos \\phi$** (real power)
- **$Q = \\sqrt{3} \\cdot V_L \\cdot I_L \\cdot \\sin \\phi$** (reactive power)
- **$S = \\sqrt{3} \\cdot V_L \\cdot I_L$** (apparent power)

Or equivalently: **$P = 3 \\cdot V_{ph} \\cdot I_{ph} \\cdot \\cos \\phi$** (three times single-phase power)

### Key Advantage

Three-phase power is **constant** — it does not pulsate like single-phase. This provides smoother torque in motors and more efficient power transmission.

## 2.2 Per-Phase Analysis

For balanced three-phase systems, analyze **one phase** and multiply by 3:

1. Convert delta loads to wye equivalent if needed (Z_Y = Z_Δ/3)
2. Draw single-phase equivalent circuit
3. Solve for phase voltage, current, and power
4. Multiply power by 3 for total three-phase power

This simplifies analysis enormously — a three-phase problem becomes a single-phase problem.

## 2.3 Unbalanced Systems

When loads are unbalanced:
- Per-phase analysis does NOT apply
- Neutral current is NOT zero
- Use **symmetrical components** (positive, negative, zero sequence) for analysis`,
      examTip: 'Per-phase analysis is the key to solving three-phase problems quickly. Convert everything to wye, solve one phase, multiply power by 3. The FE exam typically gives balanced systems, so per-phase analysis works for most problems.',
      importantNote: 'Three-phase power P = sqrt(3)·V_L·I_L·cosφ uses LINE values (not phase values). This is the standard formula because line values are what meters measure at terminals. Make sure you identify whether given values are line or phase before applying formulas.',
    },
    {
      id: '3ph-worked',
      title: '3. Worked Examples',
      content: `## 3.1 Balanced wye load

A balanced wye load of 10 ohm per phase is fed from a 208 V line-to-line, 60 Hz supply.

In wye, V_line = sqrt(3) V_phase, so V_phase = 208/1.732 = **120 V**.
In wye, I_line = I_phase = 120/10 = **12 A**.

Total real power (purely resistive load, pf = 1):

P = sqrt(3) V_L I_L cos(theta) = 1.732 x 208 x 12 x 1 = **4324 W**

Cross-check per phase: 3 x V_phase x I_phase = 3 x 120 x 12 = 4320 W. The small difference is rounding in sqrt(3); either route is acceptable.

## 3.2 The same load connected in delta

Reconnect those 10 ohm elements in delta on the same 208 V line.

In delta, V_phase = V_line = **208 V**, so I_phase = 208/10 = **20.8 A**.
In delta, I_line = sqrt(3) I_phase = 1.732 x 20.8 = **36 A**.

P = sqrt(3) x 208 x 36 = **12,970 W** — three times the wye figure.

**That factor of three is the point.** The same three resistors draw three times the power in delta as in wye on the same line voltage, because each element sees sqrt(3) times the voltage and hence 3 times the power. It is why motor starters use wye for starting and switch to delta for running.

## 3.3 A load with power factor

A balanced delta load draws 30 A of line current at 480 V line-to-line with pf = 0.85 lagging.

$$S = \\sqrt{3} V_L I_L = 1.732 x 480 x 30 = 24,940 VA$$
$$P = S x 0.85 = 21,200\\ \\mathrm{W}$$
$$Q = S x \\sin (\\arccos  0.85) = 24,940 x 0.527 = 13,140\\ \\mathrm{VAR}$$

Note that the sqrt(3) V_L I_L formula uses LINE quantities for both, whichever way the load is connected — that is why it is the one worth memorising.

## 3.4 Delta-to-wye conversion for analysis

A balanced delta of Z_delta converts to a wye of **$Z_{wye} = Z_{delta}/3$**. Converting a delta load to its wye equivalent lets you analyse one phase against neutral and multiply by three, which is almost always faster than working the delta directly.

Applying it to 3.2: Z_wye = 10/3 = 3.33 ohm per phase, V_phase = 120 V, I_line = 120/3.33 = 36 A. Matches the delta answer exactly.`,
      examTip: 'Write down which connection you have before touching sqrt(3). Wye: line voltage is sqrt(3) larger, currents equal. Delta: line current is sqrt(3) larger, voltages equal. Getting this backwards is the single biggest source of lost marks in three-phase problems.',
      quiz: [
        {
          question: 'A balanced wye load is supplied at 480 V line-to-line. What is the phase voltage?',
          options: ['277 V', '480 V', '831 V', '240 V'],
          correctIndex: 0,
          explanation: 'In wye, V_phase = V_line/sqrt(3) = 480/1.732 = 277 V. This is the standard 480/277 V commercial system, where 277 V is what lighting circuits use line-to-neutral.',
        },
        {
          question: 'Three identical resistors draw 6 kW when connected in wye across a given line voltage. What power do they draw reconnected in delta on the same line?',
          options: ['18 kW', '2 kW', '6 kW', '10.4 kW'],
          correctIndex: 0,
          explanation: 'Delta draws three times the wye power for the same line voltage, because each element sees sqrt(3) times the voltage and power goes as voltage squared. This is exactly why wye-delta starting reduces motor inrush - starting in wye draws a third of the delta current.',
        },
        {
          question: 'A balanced three-phase load draws 25 A of line current at 208 V line-to-line with a power factor of 0.9. What is the real power?',
          options: ['8.1 kW', '4.7 kW', '14.0 kW', '5.2 kW'],
          correctIndex: 0,
          explanation: 'P = sqrt(3) V_L I_L cos(theta) = 1.732 x 208 x 25 x 0.9 = 8106 W. The sqrt(3) formula takes LINE voltage and LINE current whatever the connection, which is what makes it the one to remember.',
        },
      ],
    },
    {
      id: '3ph-depth',
      title: '4. Why Three Phase, and What Unbalance Does',
      content: `## 4.1 The factor of three, across the whole range

The same three resistors, on the same line voltage, in the two connections:

![Total real power against line voltage for three 10 ohm resistors connected in wye and in delta. The delta connection draws exactly three times the wye power at every voltage, not merely near one operating point.](/courses/fe-ee/figures/circuits-three-phase-wye-delta.svg)

The ratio is exactly three everywhere, because each delta element sees
sqrt(3) times the voltage a wye element sees, and power goes as voltage
squared: (sqrt(3))^2 = 3.

This is the whole basis of **wye-delta starting**. Start a motor in wye and it
draws a third of the current and produces a third of the torque; switch to
delta once it is up to speed. The trade is explicit - you cannot have the
reduced inrush and the full starting torque at the same time.

## 4.2 Why three phases rather than one or six

Three reasons the exam expects:

- **Constant instantaneous power.** For a balanced three-phase load the three
  phase powers sum to a constant, with no 120 Hz pulsation. A single-phase
  motor pulses at twice line frequency and needs extra mass or a starting
  winding to run smoothly.
- **No neutral current when balanced.** The three phase currents sum to zero,
  so the neutral carries nothing and can be sized smaller - or omitted in a
  three-wire delta.
- **Less conductor for the same power.** Three-phase transmission moves a
  given power with roughly 75% of the copper a comparable single-phase system
  needs.

Six phases would improve the first two only marginally while doubling the
apparatus, which is why three is the settled compromise.

## 4.3 Unbalance, and the neutral

The zero-neutral-current result holds ONLY when the load is balanced. With
unequal phase loads the neutral carries the phasor sum, and it is not
generally the arithmetic difference.

**Worked:** phase currents of 10 A, 10 A and 4 A, at the usual 120-degree
spacing. Taking the first along the reference axis:

$$I_a = 10 at 0, I_b = 10 at -120, I_c = 4 at +120$$

Real parts: 10 + 10(-0.5) + 4(-0.5) = 10 - 5 - 2 = **3**
Imag parts: 0 + 10(-0.866) + 4(+0.866) = -8.66 + 3.46 = **-5.2**

$$I_n = \\sqrt{9 + 27} = 6.0\\ \\mathrm{A}$$

Note it is not 10 - 4 = 6 by coincidence of these numbers; change the angles
and the arithmetic-difference shortcut fails. Always sum as phasors.

A further trap in modern buildings: non-linear single-phase loads inject third
harmonics, which are in phase across all three phases and therefore ADD in the
neutral rather than cancelling. A neutral can carry more current than any
phase, which is why codes require full-sized or oversized neutrals on
harmonic-rich circuits.

## 4.4 Two-wattmeter method

Three-phase power can be measured with two wattmeters regardless of balance,
provided there is no neutral connection:

**$P_{total} = W1 + W2$**

and for a balanced load the power factor follows from the ratio:

**tan(theta) = sqrt(3)(W1 - W2)/(W1 + W2)**

**Worked:** W1 = 8 kW, W2 = 2 kW. Total = **10 kW**.
tan(theta) = 1.732(6)/10 = 1.039, so theta = 46.1 degrees and
$$pf = \\cos (46.1) = 0.693$$.

When one wattmeter reads negative, the power factor is below 0.5 - a useful
diagnostic that needs no calculation at all.`,
      examTip: 'The two-wattmeter total is the SUM of the readings even when one is negative. A negative reading is not an error to be corrected by taking a magnitude; it is the instrument telling you the power factor is under 0.5.',
      quiz: [
        {
          question: 'Two wattmeters measuring a balanced three-phase load read 6 kW and -1 kW. What is the total power?',
          options: ['5 kW', '7 kW', '6 kW', '1 kW'],
          correctIndex: 0,
          explanation: 'P_total = W1 + W2 = 6 + (-1) = 5 kW. The negative reading is added, not subtracted or discarded - and its presence tells you immediately that the power factor is below 0.5.',
        },
        {
          question: 'Why does the neutral of a balanced three-phase wye load carry no current?',
          options: [
            'The three phase currents are equal and 120 degrees apart, so they sum to zero as phasors',
            'The neutral is not connected in a balanced system',
            'The currents cancel in pairs, leaving one phase',
            'Neutral current is blocked by the transformer',
          ],
          correctIndex: 0,
          explanation: 'Three equal phasors spaced 120 degrees apart sum to zero, so nothing returns through the neutral. This fails as soon as the load is unbalanced, and fails badly with third-harmonic loads whose components are in phase across all three lines and therefore ADD in the neutral.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'Wye: V_L = sqrt(3)·V_ph, I_L = I_ph; Delta: V_L = V_ph, I_L = sqrt(3)·I_ph.',
    'Three-phase power: P = sqrt(3)·V_L·I_L·cosφ (constant, not pulsating).',
    'Per-phase analysis: solve one phase, multiply power by 3 (balanced systems only).',
    'Delta-wye conversion: Z_Δ = 3·Z_Y for balanced loads.',
    'Balanced neutral current is zero; unbalanced systems need symmetrical components.',
  ],
},

fee_transients: {
  topicId: 'fee_transients',
  title: 'Transient Analysis: RC, RL, and RLC Circuits',
  domainWeight: 'Circuit Analysis · 10%',
  overview: 'Transient response describes circuit behavior after switching events. First-order RC and RL circuits follow exponential responses with time constant τ. Second-order RLC circuits can be underdamped, critically damped, or overdamped.',
  sections: [
    {
      id: 'trans-first',
      title: '1. First-Order Transients (RC and RL)',
      content: `## 1.1 The Universal First-Order Formula

**$x(t) = x(\\infty) + [x(0) - x(\\infty)] \\cdot e^{-t/\\tau}$**

This single formula solves ANY first-order transient. Find three things:
1. **x(0)**: initial value (from circuit conditions before switching)
2. **$x(\\infty)$**: final value (from circuit at t → ∞ in steady state)
3. **τ**: time constant

### Time Constants

| Circuit | Time Constant | Settling Time (99%) |
|---|---|---|
| RC | $\\tau = R\\cdot C$ | $5\\tau = 5RC$ |
| RL | $\\tau = L/R$ | $5\\tau = 5L/R$ |

## 1.2 RC Circuit Responses

### Charging (from 0 to V):
- v_C(t) = V(1 - e^(-t/RC))
- i(t) = (V/R)·e^(-t/RC)

### Discharging (from $V_{0}$ to 0):
- v_C(t) = $V_{0}$·e^(-t/RC)
- i(t) = -($V_{0}$/R)·e^(-t/RC)

## 1.3 RL Circuit Response

### Energizing (from 0 to V/R):
- i_L(t) = (V/R)(1 - e^(-tR/L))
- v_L(t) = V·e^(-tR/L)

## 1.4 Initial Conditions (Continuity)

At the instant of switching (t = $0^{+}$):
- **Capacitor voltage cannot change instantly**: v_C($0^{+}$) = v_C($0^{-}$)
- **Inductor current cannot change instantly**: i_L($0^{+}$) = i_L($0^{-}$)

## 1.5 A charging circuit, end to end

The universal formula needs three numbers, and all three are read off the
circuit rather than derived:

![A 100 V source, a switch that closes at t = 0, a 50 kilohm resistor and a 10 microfarad capacitor in series. The capacitor charges through the resistor once the switch closes.](/courses/fe-ee/figures/sch-rc-transient.svg)

**$\\tau = RC$** = 50×10³ × 10×$10^{-6}$ = **0.5 s**. Get the exponents right by grouping:
kΩ × µF = 10³ × $10^{-6}$ = 10⁻³, so kΩ × µF gives milliseconds directly. Here
50 × 10 = 500 ms. That shortcut removes the most common arithmetic slip in the
whole topic.

**$x(0^{+}) = 0\\ \\mathrm{V}.$** The capacitor was uncharged before the switch closed, and
capacitor voltage is continuous, so it is still 0 V immediately after.

**$x(\\infty) = 100\\ \\mathrm{V}.$** After a long time the capacitor current falls to zero, so
there is no drop across R and the capacitor holds the full source voltage.

Therefore v_C(t) = 100(1 − e^(−t/0.5)) volts.

The current follows from the *resistor*, not the capacitor: at t = $0^{+}$ the
capacitor is at 0 V so the entire 100 V appears across R, giving
i($0^{+}$) = 100/50 kΩ = **2 mA**. This is the counter-intuitive half of the problem
worth stating plainly: **the capacitor voltage starts at its minimum while the
current starts at its maximum.** The element that cannot change is the voltage;
the current is free to jump, and it does.

| Time | $t/\\tau$ | v_C | Fraction of final | i(t) |
|---|---|---|---|---|
| 0 s | 0 | 0.00 V | 0.0 % | 2.000 mA |
| 0.5 s | $1\\tau$ | 63.21 V | 63.2 % | 0.736 mA |
| 1.0 s | $2\\tau$ | 86.47 V | 86.5 % | 0.271 mA |
| 1.5 s | $3\\tau$ | 95.02 V | 95.0 % | 0.100 mA |
| 2.0 s | $4\\tau$ | 98.17 V | 98.2 % | 0.037 mA |
| 2.5 s | $5\\tau$ | 99.33 V | 99.3 % | 0.013 mA |

The percentages in the middle column are worth memorising, because FE questions
ask for them far more often than they ask for a general time: **63.2 % after one
time constant, 86.5 % after two, 95 % after three, 99.3 % after five.** Note also
that every row satisfies v_C + i·R = 100 V, which is KVL and is the check to run
if a computed value looks wrong.

## 1.6 Solving for time rather than voltage

The other common form asks *when* rather than *how much*. Invert the exponential:

$$t = -\\tau \\cdot \\ln [(x(\\infty) - x(t))/(x(\\infty) - x(0))]$$

For this circuit to reach 90 V:
$$t = -0.5 \\cdot \\ln [(100 - 90)/(100 - 0)] = -0.5 \\cdot \\ln (0.1) = 0.5 \\times 2.303 = 1.15\\ \\mathrm{s}$$.

Sanity-check it against the table: 90 V sits between the 86.47 V at 2τ = 1.0 s
and the 95.02 V at 3τ = 1.5 s, and 1.15 s lands between them. Any answer outside
that bracket is arithmetic, not physics.

## 1.7 Where the energy goes

Charging this capacitor stores E = ½CV² = ½ × 10×$10^{-6}$ × 100² = **0.05 J**. But
the source delivers charge Q = CV at a constant 100 V, so it supplies
E = QV = CV² = **0.1 J**. The missing half — another 0.05 J — is dissipated in
R as heat, and this is true **regardless of the value of R**.

Making R smaller charges the capacitor faster but does not improve the
efficiency, which is fixed at 50 % for charging a capacitor from a constant
voltage source through any resistance. It is a result that appears in FE
questions as a distractor set where three of the options depend on R and the
correct one does not.`,
      examTip: 'The universal formula x(t) = x(∞) + [x(0)-x(∞)]·e^(-t/τ) is the MOST important transient formula. Step 1: find initial value. Step 2: find final value (replace C with open, L with short for DC steady state). Step 3: find τ. Plug in and you are done.',
      importantNote: 'At t = 0⁺, capacitors act as voltage sources (maintaining their voltage) and inductors act as current sources (maintaining their current). At t = ∞, capacitors act as open circuits and inductors act as short circuits (DC steady state). These two limiting cases give you x(0) and x(∞).',
    },
    {
      id: 'trans-second',
      title: '2. Second-Order Transients (RLC)',
      content: `## 2.1 RLC Circuit Response Types

The characteristic equation: **$s^{2} + 2\\alpha s + \\omega _{0}^{2} = 0$**

Where:
- **$\\alpha = R/(2L)$** is the damping coefficient (series RLC)
- **$\\omega _{0} = 1/\\sqrt{LC}$** is the natural frequency
- **$\\zeta = \\alpha /\\omega _{0} = R/(2\\sqrt{L/C})$** is the damping ratio

### Response Types

| Condition | Type | Roots | Behavior |
|---|---|---|---|
| $\\zeta < 1 (\\alpha < \\omega _{0})$ | **Underdamped** | Complex conjugate | Oscillates with decay |
| $\\zeta = 1 (\\alpha = \\omega _{0})$ | **Critically damped** | Repeated real | Fastest non-oscillatory |
| $\\zeta > 1 (\\alpha > \\omega _{0})$ | **Overdamped** | Distinct real | Slow, monotonic |

### Underdamped Response

**$x(t) = e^{-\\alpha t} \\cdot [A\\cdot \\cos (\\omega d\\cdot t) + B\\cdot \\sin (\\omega d\\cdot t)]$**

Where **$\\omega d = \\omega _{0}\\cdot \\sqrt{1-\\zeta ^{2}}$** is the damped natural frequency.

## 2.2 Practical Implications

- **Underdamped**: voltage/current oscillates (ringing) — seen in LC filters, clock circuits
- **Critically damped**: fastest settling without overshoot — ideal for measurement systems
- **Overdamped**: sluggish but no overshoot — over-designed damping

### Protection Considerations

- **Inductor switching**: opening a switch in an inductive circuit causes voltage spikes (v = L·di/dt with large di/dt)
- **Solution**: snubber circuits, flyback diodes
- **Capacitor switching**: closing a switch to charge a capacitor causes current spikes
- **Solution**: series resistance to limit inrush current`,
      examTip: 'The damping ratio ζ = R/(2sqrt(L/C)) is your go-to parameter. Increasing R increases ζ (more damping). ζ < 1 means oscillation; ζ = 1 is the critical boundary. On the FE exam, you will often need to identify which case applies from given R, L, C values.',
    },
    {
      id: 'tr-worked',
      title: '3. Worked Examples',
      content: `## 3.1 RC charging

A 10 microfarad capacitor, initially uncharged, charges through 50 kilohm from a 100 V source.

tau = RC = (50e3)(10e-6) = **0.5 s**.

v_C(t) = 100(1 - e^(-t/0.5)) volts.

At t = tau: v = 100(1 - 0.368) = **63.2 V** — the defining 63.2% of the final value.
At t = 3 tau = 1.5 s: v = 100(1 - 0.0498) = **95.0 V**.
At t = 5 tau = 2.5 s: v = **99.3 V**, conventionally "fully charged".

The current runs the other way: i(t) = (100/50e3) e^(-t/0.5) = 2 e^(-t/0.5) mA, starting at **2 mA** and decaying to zero.

## 3.2 The two limiting circuits

Almost every transient multiple-choice question yields to sketching two circuits rather than solving anything:

| Element | t = 0+ (just after switching) | t = infinity (steady state) |
|---|---|---|
| Capacitor, initially uncharged | short circuit | open circuit |
| Capacitor, initially charged to V0 | voltage source V0 | open circuit |
| Inductor, initially unenergised | open circuit | short circuit |
| Inductor, carrying I0 | current source I0 | short circuit |

The reason is the continuity rules: **capacitor voltage cannot change instantaneously, and inductor current cannot change instantaneously.** Everything else in a first-order circuit follows.

## 3.3 RL energising with a series resistance

A 2 H inductor with 100 ohm in series is switched onto 50 V.

tau = L/R = 2/100 = **0.02 s** = 20 ms. Final current = 50/100 = **0.5 A**.

$$i(t) = 0.5(1 - e^{-t/0.02}) A$$.

At t = 0+ the inductor is an open circuit, so i = 0 and the full 50 V appears across the inductor. At steady state the inductor is a plain wire, so the whole 50 V sits across the resistor and the inductor voltage is zero.

Stored energy at steady state: W = (1/2) L I^2 = 0.5 x 2 x 0.25 = **0.25 J**.

## 3.4 The general first-order formula

Any first-order transient can be written without solving a differential equation:

**x(t) = x(infinity) + [x(0+) - x(infinity)] e^(-t/tau)**

Find the final value from the steady-state circuit, the initial value from the continuity rule, and tau from the resistance seen by the reactive element with sources killed. Three quantities, no calculus.

Example: the capacitor of 3.1 already charged to 40 V when the switch closes. Then x(0+) = 40, x(infinity) = 100, tau = 0.5 s, so v_C(t) = 100 - 60 e^(-2t) volts.`,
      examTip: 'For tau, use the resistance the reactive element SEES with independent sources killed - which is the Thevenin resistance at its terminals, not necessarily the resistor drawn next to it. In a circuit with several resistors this is where most tau errors come from.',
      quiz: [
        {
          question: 'A 100 microfarad capacitor discharges through 20 kilohm. How long is one time constant?',
          options: ['2 s', '0.2 s', '20 s', '0.05 s'],
          correctIndex: 0,
          explanation: 'tau = RC = (20e3)(100e-6) = 2 s. After 2 s the voltage has fallen to 36.8% of its initial value, and after roughly 5 tau = 10 s it is conventionally considered fully discharged.',
        },
        {
          question: 'An uncharged capacitor is in a circuit at the instant a switch closes. How does it behave at t = 0+?',
          options: ['As a short circuit', 'As an open circuit', 'As a resistor equal to 1/(omega C)', 'As a voltage source equal to the supply'],
          correctIndex: 0,
          explanation: 'Capacitor voltage cannot change instantaneously, so an uncharged capacitor holds 0 V at t = 0+, which is exactly what a short circuit does. It becomes an open circuit only at steady state. An inductor is the mirror image: open at t = 0+, short at steady state.',
        },
        {
          question: 'An RL circuit has L = 0.5 H and a Thevenin resistance of 250 ohm at the inductor terminals. What fraction of the final current is reached after 5 ms?',
          options: ['91.8%', '63.2%', '36.8%', '99.3%'],
          correctIndex: 0,
          explanation: 'tau = L/R = 0.5/250 = 2 ms, so 5 ms is 2.5 time constants. The rising response gives 1 - e^(-2.5) = 1 - 0.082 = 91.8%. The 63.2% figure applies at exactly one time constant and 99.3% at five.',
        },
      ],
    },
    {
      id: 'tr-depth',
      title: '4. The Universal Curve, Switching and Second-Order Circuits',
      content: `## 4.1 One pair of curves for every first-order circuit

Every RC and RL transient in the syllabus is one of these two shapes, plotted
in units of tau so the same picture serves every component value:

![Charging and discharging exponentials against time in units of the time constant. The markers give the values the exam asks for: 63.2 percent of the change after one time constant, 95.0 percent after three, 99.3 percent after five.](/courses/fe-ee/figures/circuits-rc-rl-transient.svg)

Memorise three points on it and you can answer most transient questions
without the exponential at all:

| Elapsed | Change completed | Remaining |
|---|---|---|
| 1 tau | 63.2% | 36.8% |
| 2 tau | 86.5% | 13.5% |
| 3 tau | 95.0% | 5.0% |
| 5 tau | 99.3% | 0.7% |

The curve never actually reaches its final value, which is why "fully charged"
is a convention (five tau) rather than a fact.

## 4.2 Finding tau when the circuit is not just R and C

tau uses the resistance the reactive element **sees**, which is the Thevenin
resistance at its terminals with independent sources killed - not whichever
resistor is drawn nearest.

**Worked:** a capacitor sits between a node and ground. From that node, 6 ohm
goes to a voltage source and 12 ohm goes to ground. Kill the source (short it)
and the capacitor sees 6 in parallel with 12 = **4 ohm**. With C = 250
microfarad, tau = (4)(250e-6) = **1 ms** - not 1.5 ms from the 6 ohm alone,
and not 3 ms from the 12 ohm alone.

Getting this wrong scales every subsequent time by the same factor, so it is
worth the extra ten seconds of drawing the killed-source circuit.

## 4.3 Switching energy, and why inductors are dangerous

Opening a switch in an inductive circuit forces di/dt toward infinity, and
v = L di/dt follows it. A 0.5 H relay coil carrying 2 A, interrupted in 1
microsecond, would in principle generate

$$v = 0.5 x (2/1e-6) = 1 MV$$

In practice the switch contacts arc and clamp it far below that, which is
exactly the damage mechanism. A flyback diode across the coil gives the
current a path so it decays through the diode rather than through an arc,
dissipating the stored (1/2)L I^2 = 1 J harmlessly.

Capacitors have the mirror hazard: closing a switch onto a discharged
capacitor asks for infinite di/dt from the source, which is why inrush current
limiting exists.

## 4.4 When the circuit is second order

Put both L and C in the same loop and the response stops being a single
exponential. The characteristic equation s^2 + (R/L)s + 1/(LC) = 0 gives
alpha = R/2L and omega_0 = 1/sqrt(LC), and their comparison names the
response - the same alpha-versus-omega_0 test the differential-equations
chapter derives.

**Worked:** R = 100 ohm, L = 10 mH, C = 1 microfarad.
alpha = 100/0.020 = 5000, omega_0 = 1/sqrt(10e-3 x 1e-6) = 1/sqrt(1e-8) =
10,000. Since alpha < omega_0, **underdamped**, with
omega_d = sqrt(1e8 - 2.5e7) = **8660 rad/s**.

The envelope decays as e^(-5000t), so the 1/e time is 200 microseconds and the
ringing is at 8660/(2 pi) = 1378 Hz. Both numbers come straight from alpha and
omega_d, with no differential equation solved.`,
      examTip: 'Draw the killed-source circuit before computing tau. Independent voltage sources become shorts and current sources become opens, and the resistance the reactive element then sees is the only one that matters.',
      quiz: [
        {
          question: 'A capacitor sees 12 ohm to ground and 4 ohm to an ideal voltage source. What resistance sets its time constant?',
          options: ['3 ohm', '16 ohm', '12 ohm', '4 ohm'],
          correctIndex: 0,
          explanation: 'Kill the source by shorting it, and the capacitor sees 12 in parallel with 4 = 48/16 = 3 ohm. Using either resistor alone, or adding them in series, gives a time constant that is wrong by a factor of four or more.',
        },
        {
          question: 'A 2 H inductor carrying 3 A has its circuit opened. How much energy must be dissipated somewhere?',
          options: ['9 J', '6 J', '3 J', '18 J'],
          correctIndex: 0,
          explanation: 'W = (1/2)L I^2 = 0.5 x 2 x 9 = 9 J. That energy cannot vanish instantaneously, so without a flyback path it goes into an arc across the opening contacts - which is the mechanism that destroys switches in inductive circuits.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'Universal first-order: x(t) = x(∞) + [x(0)-x(∞)]·e^(-t/τ); τ = RC or L/R.',
    'At t=0⁺: v_C cannot change, i_L cannot change (continuity conditions).',
    'At t=∞ (DC): C = open circuit, L = short circuit.',
    'Damping ratio ζ = R/(2sqrt(L/C)); ζ<1 underdamped, ζ=1 critical, ζ>1 overdamped.',
    'Settling time ≈ 5τ for first-order; depends on ζ and ωn for second-order.',
  ],
},


// ═══════════════════════════════════════════════════════════════
// TOPICS 7–17 (Linear Systems through Software Development)
// ═══════════════════════════════════════════════════════════════

};
