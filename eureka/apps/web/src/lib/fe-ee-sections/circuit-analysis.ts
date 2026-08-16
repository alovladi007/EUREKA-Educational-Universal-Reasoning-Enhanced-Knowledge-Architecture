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

$$I2 = I x R3/(R2+R3) = 1.5 \\times 12/18 = 1.0\\ \\mathrm{A}$$

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
    {
      id: 'dcf-conductance',
      title: '5. Conductance, and the Shape of a Parallel Network',
      content: `## 5.1 The reciprocal that makes parallel networks easy

Section 2 gave the parallel rule as a reciprocal sum, which is correct and
awkward. Defining **conductance** removes the awkwardness:

$$G = \\frac{1}{R} \\qquad \\text{measured in siemens, S}$$

Ohm's law then reads $I = G\\,V$, and the two combination rules become
symmetric statements rather than a formula and its inverse:

$$R_{series} = \\sum_{k} R_{k}, \\qquad G_{parallel} = \\sum_{k} G_{k}$$

Resistances add when the same current passes through every element;
conductances add when the same voltage appears across every element. That is
one idea seen from two sides, and it is worth carrying because the second form
generalises. The current divider for any number of parallel branches is
simply each branch's share of the total conductance:

$$I_{k} = I_{total}\\,\\frac{G_{k}}{\\sum_{j} G_{j}}$$

For exactly two branches, substituting $G = 1/R$ and clearing fractions
recovers the familiar rule with the *other* resistance on top:

$$I_{1} = I_{total}\\,\\frac{1/R_{1}}{1/R_{1} + 1/R_{2}} = I_{total}\\,\\frac{R_{2}}{R_{1} + R_{2}}$$

The conductance form is the one to write down when three or more branches
share a node, because the two-resistor form does not extend and attempts to
extend it produce answers that do not sum to the total current.

Three special cases are worth having in memory rather than deriving:

$$R_{eq} = \\frac{R_{1}R_{2}}{R_{1} + R_{2}} \\;\\;(\\text{two}), \\qquad R_{eq} = \\frac{R}{N} \\;\\;(N \\text{ equal}), \\qquad R_{eq} < \\min_{k} R_{k} \\;\\;(\\text{always})$$

## 5.2 Why a parallel combination can only shrink

The last of those three is not a rule of thumb; it follows from the
conductance form. Adding a branch adds a positive conductance, and a larger
conductance is a smaller resistance. Adding a path for current cannot make
current harder to push.

![Parallel equivalent resistance of a fixed 100 ohm resistor against a swept partner resistance from 1 to 1000 ohms. The curve rises steeply at first, passes through 50 ohms where the partner equals 100 ohms, reaches 90.9 ohms at a partner of 1000 ohms, and approaches but never touches a dashed asymptote at 100 ohms.](/courses/fe-ee/figures/ckt2-parallel-shrink.svg)

Read the curve at four places and the whole behaviour is fixed. A
$1\\ \\Omega$ partner drags the pair down to $0.99\\ \\Omega$ — the small
resistor dominates almost completely. An equal $100\\ \\Omega$ partner halves
it to $50\\ \\Omega$. A $1000\\ \\Omega$ partner, ten times larger, only lifts
the pair to $90.9\\ \\Omega$, so it has removed 9 per cent. And the dashed
asymptote at $100\\ \\Omega$ is a ceiling the curve approaches from below and
never reaches, whatever partner you choose.

The practical consequence is the one exam questions exploit: **a resistor ten
times larger than its parallel partner may usually be ignored**, at a cost of
about 9 per cent, and a resistor a hundred times larger costs about 1 per cent.
That is how a bias network with a stray leakage path is analysed in ten
seconds instead of two minutes.

## 5.3 Worked example: three resistors, two routes

**Given**: $12\\ \\Omega$, $6\\ \\Omega$ and $4\\ \\Omega$ in parallel. Find
the equivalent resistance twice, by different routes, and split a 6 A source
between them.

**Route one, conductances**:

$$G = \\frac{1}{12} + \\frac{1}{6} + \\frac{1}{4} = 0.0833 + 0.1667 + 0.2500 = 0.5000\\ \\mathrm{S}$$

$$R_{eq} = \\frac{1}{0.5} = 2\\ \\Omega$$

**Route two, pairwise**: combine the first two,
$12\\Vert 6 = 72/18 = 4\\ \\Omega$, then combine that with the third,
$4\\Vert 4 = 2\\ \\Omega$. Same answer, and the agreement of two independent
routes is the check.

**Current split**, from the node voltage:

$$V = I\\,R_{eq} = 6 \\times 2 = 12\\ \\mathrm{V}$$

$$I_{12} = \\frac{12}{12} = 1\\ \\mathrm{A}, \\qquad I_{6} = \\frac{12}{6} = 2\\ \\mathrm{A}, \\qquad I_{4} = \\frac{12}{4} = 3\\ \\mathrm{A}$$

**Answer**: $2\\ \\Omega$, splitting as 1 A, 2 A and 3 A. The three currents
sum to 6 A, and they are in the ratio 1 : 2 : 3, which is the ratio of the
conductances and the *inverse* ratio of the resistances. Note that
$2\\ \\Omega$ is below $4\\ \\Omega$, the smallest resistor present, exactly as
Section 5.1 promised. Any answer above $4\\ \\Omega$ can be rejected without
checking the arithmetic.

## 5.4 What happens when one branch changes

Section 1.5 solved a 12 V source feeding $R_{1} = 4\\ \\Omega$ in series with
the parallel pair $R_{2} = 6\\ \\Omega$ and $R_{3} = 12\\ \\Omega$. That is one
point on a family. Sweeping $R_{3}$ while everything else holds shows how the
three currents in a ladder move together.

![Source current and both branch currents for a 12 volt source feeding a 4 ohm series resistor and a parallel pair, as the third resistor is swept from 2 to 40 ohms. The source current falls from above 2 amps toward 1.2 amps, the current in the 6 ohm branch rises, and the current in the swept branch falls; at 12 ohms the three curves are marked at 1.5, 1.0 and 0.5 amps.](/courses/fe-ee/figures/ckt2-ladder-sweep.svg)

Three features of this figure are worth naming, because each is a separate exam
question in disguise.

- **The two branch currents always sum to the source current.** That is KCL,
  and it holds at every point on the sweep, not only at the worked value.
- **Raising $R_{3}$ raises the current in $R_{2}$.** Removing current from one
  parallel branch raises the voltage across the pair, which pushes more current
  through the other. The branches are not independent.
- **The curves flatten toward limits.** As $R_{3} \\to \\infty$ the third branch
  is an open circuit and the source current settles at
  $12/(4 + 6) = 1.2\\ \\mathrm{A}$. As $R_{3} \\to 0$ it short-circuits the pair
  and the source current rises toward $12/4 = 3\\ \\mathrm{A}$.

| $R_{3}$ | $R_{2}\\Vert R_{3}$ | Source current | Through $R_{2}$ | Through $R_{3}$ |
|---|---|---|---|---|
| $2\\ \\Omega$ | $1.500\\ \\Omega$ | 2.182 A | 0.545 A | 1.636 A |
| $6\\ \\Omega$ | $3.000\\ \\Omega$ | 1.714 A | 0.857 A | 0.857 A |
| $12\\ \\Omega$ | $4.000\\ \\Omega$ | 1.500 A | 1.000 A | 0.500 A |
| $24\\ \\Omega$ | $4.800\\ \\Omega$ | 1.364 A | 1.091 A | 0.273 A |
| $40\\ \\Omega$ | $5.217\\ \\Omega$ | 1.302 A | 1.132 A | 0.170 A |

## 5.5 Worked example: one row of that table, from scratch

**Given**: the same ladder with $R_{3} = 24\\ \\Omega$. Find every current and
verify with a power balance.

**Reduce**:

$$R_{2}\\Vert R_{3} = \\frac{6 \\times 24}{6 + 24} = \\frac{144}{30} = 4.8\\ \\Omega, \\qquad R_{eq} = 4 + 4.8 = 8.8\\ \\Omega$$

**Source current and node voltage**:

$$I = \\frac{12}{8.8} = 1.3636\\ \\mathrm{A}, \\qquad V_{p} = 1.3636 \\times 4.8 = 6.545\\ \\mathrm{V}$$

**Branch currents**, two ways. By Ohm's law on each branch,
$I_{2} = 6.545/6 = 1.091\\ \\mathrm{A}$ and
$I_{3} = 6.545/24 = 0.273\\ \\mathrm{A}$. By the divider,

$$I_{3} = I\\,\\frac{R_{2}}{R_{2} + R_{3}} = 1.364 \\times \\frac{6}{30} = 0.273\\ \\mathrm{A}$$

**Power balance**:

$$P_{source} = 12 \\times 1.3636 = 16.36\\ \\mathrm{W}$$

$$P_{1} + P_{2} + P_{3} = (1.3636)^{2}(4) + \\frac{(6.545)^{2}}{6} + \\frac{(6.545)^{2}}{24} = 7.438 + 7.140 + 1.785 = 16.36\\ \\mathrm{W}$$

**Answer**: 1.364 A from the source, splitting 1.091 A and 0.273 A. Compare
this with the $R_{3} = 12\\ \\Omega$ row: doubling $R_{3}$ halved its current
(0.500 A to 0.273 A, not exactly, because the node voltage moved) and *raised*
the current in the untouched $R_{2}$ from 1.000 A to 1.091 A. Expecting an
untouched branch to hold its current is the misconception this sweep exists to
break.

## 5.6 Worked example: the resistance of the wiring

**Given**: a 12 V supply feeds a load drawing 5 A through a pair of leads whose
total round-trip resistance is $0.08\\ \\Omega$. Find the load voltage, the
power lost in the wiring, and the fraction of the delivered power it
represents.

**Lead drop**, by Ohm's law on the leads themselves:

$$V_{drop} = I\\,R_{lead} = 5 \\times 0.08 = 0.40\\ \\mathrm{V}$$

**Load voltage**, by KVL around the single loop:

$$V_{load} = 12 - 0.40 = 11.60\\ \\mathrm{V}$$

**Powers**:

$$P_{lead} = I^{2}R_{lead} = 25 \\times 0.08 = 2.0\\ \\mathrm{W}, \\qquad P_{load} = 11.60 \\times 5 = 58.0\\ \\mathrm{W}$$

$$\\frac{P_{lead}}{P_{lead} + P_{load}} = \\frac{2.0}{60.0} = 3.33\\%$$

**Answer**: 11.60 V at the load, 2.0 W wasted, 3.3 per cent of the total. The
structure here is identical to the internal-resistance calculation of Section
4.3 — a resistance in series with the source, taking a share of the voltage
proportional to the current — and recognising that identity is worth more than
either formula. Wiring resistance, battery internal resistance and a Thevenin
resistance all do the same arithmetic to the same load.`,
      examTip: 'Write conductances, not resistances, whenever three or more elements share a pair of nodes. The two-resistor product-over-sum rule does not generalise, and applying it repeatedly is slower and more error-prone than one reciprocal sum. Check every parallel answer against the rule that it must be smaller than the smallest resistor present.',
      importantNote: 'Changing one branch of a parallel pair changes the current in the other branch too, because the shared node voltage moves. The only quantity that stays fixed when you alter a branch is the source voltage. Any reasoning that assumes an untouched branch keeps its old current is wrong unless the source feeding the pair is an ideal voltage source directly across them.',
    },
    {
      id: 'dcf-sources-power',
      title: '6. Real Sources, Loading, and Power Transfer',
      content: `## 6.1 The straight line every real source follows

Section 4.3 introduced internal resistance with one operating point. The full
picture is a straight line, and it contains everything a two-terminal source
can do:

$$v_{t} = E - I\\,r$$

Two intercepts anchor it. At $I = 0$ the terminals read the full EMF, which is
the **open-circuit voltage**. At $v_{t} = 0$ the current is limited only by the
internal resistance, giving the **short-circuit current**:

$$I_{sc} = \\frac{E}{r}$$

Between them, the power delivered to the load is the product of the two, which
makes it a downward parabola through both intercepts:

$$P_{load} = v_{t}I = E\\,I - I^{2}r$$

![Terminal voltage and delivered power for a 12 volt source with 0.5 ohms of internal resistance, both drawn as fractions of their open-circuit and peak values against load current from zero to 24 amps. Terminal voltage falls linearly to zero at 24 amps; delivered power is a parabola peaking at 12 amps, and the 2 amp operating point is marked at 11 volts.](/courses/fe-ee/figures/ckt2-terminal-droop.svg)

For the chapter's 12 V source behind $0.5\\ \\Omega$, the numbers on that figure
are worth memorising as a shape. Short-circuit current
$12/0.5 = 24\\ \\mathrm{A}$. Peak delivered power at exactly half of that,
$I = E/2r = 12\\ \\mathrm{A}$, where the terminals sit at half the EMF, 6 V, and
the load receives

$$P_{max} = \\frac{E^{2}}{4r} = \\frac{144}{2} = 72\\ \\mathrm{W}$$

At that peak the internal resistance is also dissipating 72 W, so the source is
50 per cent efficient — a fact Section 6.4 turns into a design principle.

## 6.2 Worked example: internal resistance from two measurements

**Given**: a battery reads 12.6 V with no load and 11.4 V while delivering 6 A.
Find the internal resistance, the short-circuit current, and the terminal
voltage at 20 A.

**Internal resistance**, from the slope of the line through the two points:

$$r = \\frac{\\Delta v_{t}}{\\Delta I} = \\frac{12.6 - 11.4}{6 - 0} = \\frac{1.2}{6} = 0.20\\ \\Omega$$

**Short-circuit current**:

$$I_{sc} = \\frac{12.6}{0.20} = 63\\ \\mathrm{A}$$

**At 20 A**:

$$v_{t} = 12.6 - 20 \\times 0.20 = 8.6\\ \\mathrm{V}$$

**Answer**: $0.20\\ \\Omega$, 63 A, and 8.6 V. Two measurements at different
currents are all that is ever needed to characterise a linear source, and the
result is its Thevenin equivalent: $V_{th} = 12.6\\ \\mathrm{V}$,
$R_{th} = 0.20\\ \\Omega$. The distractor in this family divides the loaded
terminal voltage by the current, $11.4/6 = 1.9\\ \\Omega$, which is the *load*
resistance rather than the internal one.

## 6.3 Regulation, in the vocabulary the exam uses

The droop is quoted as **load regulation**, the fractional sag between no load
and full load:

$$\\text{regulation} = \\frac{V_{no\\text{-}load} - V_{full\\text{-}load}}{V_{full\\text{-}load}} \\times 100\\%$$

For the Section 4.3 battery, $(12 - 11)/11 = 9.1\\%$. For a bench supply
holding 5.10 V unloaded and 4.85 V at full load, the figure is
$(5.10 - 4.85)/4.85 = 5.15\\%$. Lower is stiffer. Note the denominator: the
full-load value, not the no-load one. Using the no-load value gives 8.3 per
cent and 4.9 per cent for these two cases, and both will appear among the
options.

## 6.4 Maximum power and maximum efficiency point different ways

Write the load ratio $x = R_{L}/R_{th}$. The delivered power and the efficiency
then take two compact forms:

$$\\frac{P}{P_{max}} = \\frac{4x}{(1 + x)^{2}}, \\qquad \\eta = \\frac{x}{1 + x}$$

![Fraction of peak load power and efficiency against the ratio of load resistance to source resistance. The power curve rises to a maximum of one at a ratio of one and falls slowly afterwards, while the efficiency curve rises monotonically through 50 per cent at a ratio of one and 75 per cent at a ratio of three.](/courses/fe-ee/figures/ckt2-maxpower.svg)

The two curves cross purposes. Power peaks at $x = 1$, where efficiency is
exactly one half. Efficiency climbs without limit toward 100 per cent as the
load grows, but by then the power is falling away. At $x = 3$ the load still
receives 75 per cent of the maximum possible power while running at 75 per cent
efficiency — which is why real power systems are designed with
$R_{L} \\gg R_{th}$ and only signal circuits are matched.

The other lesson is the flatness of the power curve near its peak. At
$x = 0.5$ and at $x = 2$ the delivered power is the same
$4(0.5)/(1.5)^{2} = 0.889$, so being a factor of two away from the match in
either direction costs only 11 per cent. Matching precisely is rarely worth
much.

## 6.5 Worked example: matched load against practical load

**Given**: a source with $V_{th} = 20\\ \\mathrm{V}$ and
$R_{th} = 8\\ \\Omega$. Find the maximum deliverable power and the load that
takes it, then compare with a $24\\ \\Omega$ load.

**Matched case**, $R_{L} = R_{th} = 8\\ \\Omega$:

$$I = \\frac{20}{8 + 8} = 1.25\\ \\mathrm{A}, \\qquad P_{max} = \\frac{V_{th}^{2}}{4R_{th}} = \\frac{400}{32} = 12.5\\ \\mathrm{W}$$

The internal resistance dissipates the same 12.5 W, so efficiency is 50 per
cent.

**Practical case**, $R_{L} = 24\\ \\Omega$, that is $x = 3$:

$$I = \\frac{20}{32} = 0.625\\ \\mathrm{A}, \\qquad P = I^{2}R_{L} = (0.625)^{2}(24) = 9.375\\ \\mathrm{W}$$

$$\\eta = \\frac{R_{L}}{R_{th} + R_{L}} = \\frac{24}{32} = 75\\%$$

**Answer**: 12.5 W at 50 per cent efficiency when matched, 9.375 W at 75 per
cent efficiency at three times the match. The second design gives up a quarter
of the available power to halve the waste. The FE trap is the phrase "maximum
power transfer" attached to a question that actually asks for maximum
efficiency; they are different conditions and only one of them is $R_{L} = R_{th}$.

## 6.6 Worked example: the meter that changes the measurement

**Given**: 10 V across two $1\\ \\mathrm{M}\\Omega$ resistors in series. A
voltmeter of $1\\ \\mathrm{M}\\Omega$ input resistance is placed across the lower
resistor. Find the reading, and repeat for a $10\\ \\mathrm{M}\\Omega$ meter.

**Undisturbed value**: the midpoint of an equal divider is 5.00 V.

**With the 1 MΩ meter**, the lower arm becomes

$$1\\Vert 1 = 0.5\\ \\mathrm{M}\\Omega, \\qquad V = 10 \\times \\frac{0.5}{1 + 0.5} = 3.33\\ \\mathrm{V}$$

an error of $-33.3\\%$.

**With the 10 MΩ meter**:

$$1\\Vert 10 = 0.909\\ \\mathrm{M}\\Omega, \\qquad V = 10 \\times \\frac{0.909}{1.909} = 4.76\\ \\mathrm{V}$$

an error of $-4.8\\%$.

**Answer**: 3.33 V and 4.76 V, against a true 5.00 V. The rule the arithmetic
encodes is that **loading error depends on the ratio of the meter's resistance
to the resistance it is placed across**, not on the meter's resistance alone.
A ten-to-one ratio costs about 5 per cent, a hundred-to-one about 0.5 per cent.
The same relation with the inequality reversed governs ammeters: an ammeter of
$0.5\\ \\Omega$ inserted in a loop of $10\\ \\Omega$ on a 5 V source reads

$$I_{meas} = \\frac{5}{10.5} = 0.476\\ \\mathrm{A}$$

against a true 0.500 A, again $-4.8\\%$. Voltmeters must be large compared with
what they measure across; ammeters must be small compared with what they
measure through.`,
      examTip: 'Maximum power transfer means RL = Rth and 50 per cent efficiency, and it applies to signal and matching problems, not to power delivery. If a question asks for the most efficient design, the answer is the largest practical load resistance, not the matched one. Reading which of the two is being asked for is the entire difficulty of these items.',
      importantNote: 'Load regulation divides by the FULL-LOAD voltage, not the no-load voltage. A supply going from 5.10 V to 4.85 V has 5.15 per cent regulation, not 4.90 per cent. Both numbers will be offered, and the definition is the only thing being tested.',
    },
    {
      id: 'dcf-bridges',
      title: '7. Bridges, Symmetry, and Networks That Resist Reduction',
      content: `## 7.1 The circuit series-parallel reduction cannot touch

Four resistors in a diamond with a fifth across the middle is the smallest
common network in which no two elements are in series and no two are in
parallel. It is the **Wheatstone bridge**, and every DC analysis technique
meets its limit here.

Label the supply $V_{s}$ across the vertical diagonal, the left-hand arms
$R_{1}$ (top) and $R_{2}$ (bottom), the right-hand arms $R_{3}$ (top) and
$R_{x}$ (bottom). With nothing drawing current from the middle, each side is
just a voltage divider, so the output across the middle is a difference of two
divider fractions:

$$v_{o} = V_{s}\\left(\\frac{R_{2}}{R_{1} + R_{2}} - \\frac{R_{x}}{R_{3} + R_{x}}\\right)$$

Setting that to zero gives the **balance condition**, which can be written
three equivalent ways:

$$\\frac{R_{1}}{R_{2}} = \\frac{R_{3}}{R_{x}}, \\qquad R_{1}R_{x} = R_{2}R_{3}, \\qquad R_{x} = \\frac{R_{2}R_{3}}{R_{1}}$$

![Open-circuit output of a Wheatstone bridge with three 1000 ohm arms on a 10 volt supply, plotted against the unknown fourth arm from 800 to 1250 ohms. The curve crosses zero at 1000 ohms, is nearly straight across a few per cent either side, and reads minus 24.9 millivolts when the unknown arm is 1 per cent high.](/courses/fe-ee/figures/ckt2-bridge-balance.svg)

Notice what is absent from the balance condition: the supply voltage. A null is
a null whatever the excitation, so a bridge measurement inherits neither the
accuracy of the supply nor the calibration of the detector. It needs only that
the detector can tell zero from not-zero. That is why bridges were the
precision resistance standard for a century.

## 7.2 Worked example: balancing a bridge

**Given**: $R_{1} = 1000\\ \\Omega$ and $R_{2} = 1000\\ \\Omega$ on the left,
$R_{3} = 680\\ \\Omega$ on the right. Find the unknown arm at balance, then
repeat with $R_{1}$ changed to $2000\\ \\Omega$.

**First case**:

$$R_{x} = \\frac{R_{2}R_{3}}{R_{1}} = \\frac{1000 \\times 680}{1000} = 680\\ \\Omega$$

**Second case**:

$$R_{x} = \\frac{1000 \\times 680}{2000} = 340\\ \\Omega$$

**Answer**: $680\\ \\Omega$, then $340\\ \\Omega$. The ratio arm $R_{2}/R_{1}$
is a multiplier on the standard resistor, which is exactly how a laboratory
bridge covers decades of range with one adjustable standard: setting the ratio
to 1000, 100, 10, 1, 0.1 and so on scales the readable range without changing
the standard. The trap is pairing the wrong arms — the balance condition
multiplies *opposite* arms, so the two resistors that appear together in
$R_{1}R_{x}$ are diagonally across from each other, never adjacent.

## 7.3 Off-null: the bridge as a sensor

A strain gauge, a thermistor or an RTD is a resistor that changes slightly, and
the bridge converts that change into a voltage. Take all four arms equal to R
and let one change by $\\Delta R$. Substituting into the output expression and
expanding to first order gives the quarter-bridge relation:

$$v_{o} \\approx -\\,\\frac{V_{s}}{4}\\cdot\\frac{\\Delta R}{R}$$

The sensitivity is a quarter of the excitation per unit fractional change, and
it is *linear only to first order*. The exact expression curves, which is what
the figure's slight bend away from a straight line shows over a wide sweep.

## 7.4 Worked example: exact and approximate off-null output

**Given**: the bridge of the figure, $V_{s} = 10\\ \\mathrm{V}$ and three
$1000\\ \\Omega$ arms, with the fourth arm 1 per cent high at
$1010\\ \\Omega$. Find the output exactly and by the approximation, then repeat
at 0.2 per cent.

**Exact, at 1 per cent**:

$$v_{o} = 10\\left(\\frac{1000}{2000} - \\frac{1010}{2010}\\right) = 10\\,(0.500000 - 0.502488) = -24.876\\ \\mathrm{mV}$$

**Approximate**:

$$v_{o} \\approx -\\frac{10}{4}(0.01) = -25.00\\ \\mathrm{mV}$$

**Error**: $0.124/24.876 = 0.5\\%$ of reading.

**At 0.2 per cent** the exact value is $-4.995\\ \\mathrm{mV}$ against an
approximate $-5.000\\ \\mathrm{mV}$, an error of 0.1 per cent.

**Answer**: −24.88 mV exact, −25.00 mV approximate at 1 per cent; −4.995 mV
against −5.000 mV at 0.2 per cent. The approximation error is about half the
fractional resistance change, so it is negligible for real strain measurements,
where $\\Delta R/R$ is measured in parts per thousand. Two things follow. The
signal is small — tens of millivolts at best — which is why an instrumentation
amplifier always follows a bridge. And the sign depends on which arm moves,
which is how a half-bridge with one arm rising and one falling doubles the
output while cancelling the temperature drift both arms share.

## 7.5 Worked example: a bridge you can solve by inspection

**Given**: 12 V across a bridge whose left side is $20\\ \\Omega$ over
$40\\ \\Omega$ and whose right side is $10\\ \\Omega$ over $20\\ \\Omega$, with a
$15\\ \\Omega$ resistor across the middle. Find the source current.

**Test balance first**, before any reduction:

$$\\frac{20}{40} = 0.5 = \\frac{10}{20}$$

The ratios match, so the bridge is balanced.

**Consequence**: both middle nodes sit at the same potential.

$$V_{B} = 12 \\times \\frac{40}{60} = 8\\ \\mathrm{V}, \\qquad V_{C} = 12 \\times \\frac{20}{30} = 8\\ \\mathrm{V}$$

With no voltage across it, the $15\\ \\Omega$ resistor carries no current and
can be deleted. What remains is two series pairs in parallel:

$$R_{eq} = (20 + 40)\\Vert(10 + 20) = \\frac{60 \\times 30}{90} = 20\\ \\Omega$$

$$I = \\frac{12}{20} = 0.60\\ \\mathrm{A}$$

**Answer**: 0.60 A, splitting 0.20 A down the left side and 0.40 A down the
right. The whole problem collapses to a ratio check. A common distractor
treats the $15\\ \\Omega$ resistor as being in parallel with the rest, giving
$20\\Vert 15 = 8.57\\ \\Omega$ and 1.4 A — a resistor with zero volts across it
carries zero current no matter what it is connected to.

## 7.6 When the bridge is not balanced

Delete nothing. The network genuinely does not reduce, and two routes remain.

**Nodal analysis** is the shorter of the two here. With the supply node at 12 V
and the bottom node as reference, two unknowns remain. For the same bridge with
the lower-left arm changed to $30\\ \\Omega$:

$$\\frac{V_{B} - 12}{20} + \\frac{V_{B}}{30} + \\frac{V_{B} - V_{C}}{15} = 0$$

$$\\frac{V_{C} - 12}{10} + \\frac{V_{C}}{20} + \\frac{V_{C} - V_{B}}{15} = 0$$

Solving gives $V_{B} = 7.485\\ \\mathrm{V}$ and
$V_{C} = 7.842\\ \\mathrm{V}$, so the bridge resistor carries
$(7.485 - 7.842)/15 = -23.8\\ \\mathrm{mA}$ — that is, 23.8 mA flowing from C to
B. The source delivers 0.642 A, so the network presents
$12/0.642 = 18.7\\ \\Omega$.

**Delta-to-wye conversion** is the alternative, and it turns the unreduceable
network into a ladder. For a delta of $R_{ab}$, $R_{bc}$ and $R_{ca}$, the
equivalent wye resistor at each node is the product of the two delta resistors
touching that node divided by the sum of all three:

$$R_{a} = \\frac{R_{ab}R_{ca}}{R_{ab} + R_{bc} + R_{ca}}$$

For $R_{ab} = 6\\ \\Omega$, $R_{bc} = 3\\ \\Omega$, $R_{ca} = 9\\ \\Omega$ the sum
is $18\\ \\Omega$ and the wye arms are

$$R_{a} = \\frac{54}{18} = 3\\ \\Omega, \\qquad R_{b} = \\frac{18}{18} = 1\\ \\Omega, \\qquad R_{c} = \\frac{27}{18} = 1.5\\ \\Omega$$

A symmetric delta of three equal R converts to a wye of $R/3$, so a
$30\\ \\Omega$ delta becomes a $10\\ \\Omega$ wye. That factor of three, and its
inverse for the reverse conversion, is the sanity check to apply before
trusting an unbalanced-bridge answer.`,
      examTip: 'Check the balance ratio before doing anything else to a bridge. If opposite-arm products are equal, the middle element carries no current, you may delete it, and the problem becomes two series pairs in parallel — a ten-second answer. Only if the ratios differ do you need nodal analysis or a delta-wye conversion.',
      importantNote: 'The bridge balance condition contains no supply voltage and no detector calibration. Doubling the excitation doubles the off-null output but does not move the null. Any answer suggesting that the balance point depends on the source voltage has missed the reason bridges are used at all.',
    },
    {
      id: 'dcf-problems-a',
      title: '8. Problem Set A: Ohm, Kirchhoff, and Dividers',
      content: `## 8.1 How to use this set

Seven problems at FE pace, about three minutes each. Reduce before you solve,
and finish each one with a check you did not use to get the answer.

## 8.2 Problem Set A: reduction, dividers, and power

**A1.** A 36 V source drives $6\\ \\Omega$ in series with the parallel
combination of $12\\ \\Omega$ and $4\\ \\Omega$. Find the source current, the
voltage across the parallel pair, and both branch currents.

**A2.** A 12 V source feeds two $10\\ \\mathrm{k}\\Omega$ resistors in series.
Find the midpoint voltage, then find it again with a
$10\\ \\mathrm{k}\\Omega$ load connected across the lower resistor.

**A3.** A 6 A current source feeds three parallel resistors of
$12\\ \\Omega$, $6\\ \\Omega$ and $4\\ \\Omega$. Find the voltage across the
group and the current in each branch.

**A4.** A $100\\ \\Omega$ resistor is rated at 0.25 W. Find the largest current
and the largest voltage it may carry.

**A5.** A single loop contains a 20 V source and an 8 V source connected in
opposition, together with $4\\ \\Omega$ and $6\\ \\Omega$. Find the loop current
and account for all the power.

**A6.** A 24 V source drives $8\\ \\Omega$ in series with the parallel pair
$6\\ \\Omega$ and $3\\ \\Omega$. Find the power dissipated in the
$3\\ \\Omega$ resistor.

**A7.** A 12 V supply feeds a 5 A load through leads of total resistance
$0.08\\ \\Omega$. Find the load voltage and the percentage of total power lost
in the leads.

### Full solutions

**A1.** The pair is $12 \\times 4/16 = 3\\ \\Omega$, so
$R_{eq} = 6 + 3 = 9\\ \\Omega$ and

$$I = \\frac{36}{9} = 4\\ \\mathrm{A}, \\qquad V_{pair} = 4 \\times 3 = 12\\ \\mathrm{V}$$

$$I_{12} = \\frac{12}{12} = 1\\ \\mathrm{A}, \\qquad I_{4} = \\frac{12}{4} = 3\\ \\mathrm{A}$$

*Check*: $1 + 3 = 4\\ \\mathrm{A}$, which is KCL. *Trap*: adding the parallel
resistors as though they were in series, giving
$36/(6 + 16) = 1.64\\ \\mathrm{A}$ — an answer larger than the smallest resistor
alone would allow.

**A2.** Unloaded, the divider gives
$12 \\times 10/20 = 6.00\\ \\mathrm{V}$. Loaded, the lower arm becomes
$10\\Vert 10 = 5\\ \\mathrm{k}\\Omega$ and

$$V = 12 \\times \\frac{5}{10 + 5} = 4.00\\ \\mathrm{V}$$

a 33 per cent error. *Trap*: answering 6 V because the divider ratio "has not
changed". Connecting anything across a divider arm changes the arm.

**A3.** Conductances sum to
$1/12 + 1/6 + 1/4 = 0.5\\ \\mathrm{S}$, so $R_{eq} = 2\\ \\Omega$ and

$$V = 6 \\times 2 = 12\\ \\mathrm{V}, \\qquad I_{12} = 1\\ \\mathrm{A}, \\quad I_{6} = 2\\ \\mathrm{A}, \\quad I_{4} = 3\\ \\mathrm{A}$$

*Trap*: applying the two-resistor divider rule to three branches. It does not
extend, and the three answers it produces will not sum to 6 A.

**A4.** From $P = I^{2}R$ and $P = V^{2}/R$:

$$I_{max} = \\sqrt{\\frac{0.25}{100}} = 0.050\\ \\mathrm{A}, \\qquad V_{max} = \\sqrt{0.25 \\times 100} = 5.0\\ \\mathrm{V}$$

*Check*: $5.0 \\times 0.050 = 0.25\\ \\mathrm{W}$. *Trap*: computing
$P/R = 2.5\\ \\mathrm{mA}$, which mixes the two power forms and is dimensionally
wrong.

**A5.** The sources oppose, so KVL around the loop gives

$$I = \\frac{20 - 8}{4 + 6} = 1.20\\ \\mathrm{A}$$

The 20 V source delivers $20 \\times 1.2 = 24.0\\ \\mathrm{W}$; the 8 V source
*absorbs* $8 \\times 1.2 = 9.6\\ \\mathrm{W}$, because current enters its
positive terminal — it is being charged. The resistors take
$(1.2)^{2}(4) = 5.76\\ \\mathrm{W}$ and
$(1.2)^{2}(6) = 8.64\\ \\mathrm{W}$.

$$9.6 + 5.76 + 8.64 = 24.0\\ \\mathrm{W}$$

*Trap*: adding the sources to get 2.80 A. Whether sources add or subtract is
decided by their polarities in the loop, and "in opposition" is the phrase that
decides it here.

**A6.** The pair is $6 \\times 3/9 = 2\\ \\Omega$, so
$R_{eq} = 10\\ \\Omega$ and $I = 2.4\\ \\mathrm{A}$. The pair drops
$2.4 \\times 2 = 4.8\\ \\mathrm{V}$, so

$$I_{3} = \\frac{4.8}{3} = 1.60\\ \\mathrm{A}, \\qquad P_{3} = (1.60)^{2}(3) = 7.68\\ \\mathrm{W}$$

*Check*: total dissipation is
$46.08 + 3.84 + 7.68 = 57.6\\ \\mathrm{W} = 24 \\times 2.4$. *Trap*: using the
source current of 2.4 A in $I^{2}R$ for the $3\\ \\Omega$ branch, giving
17.3 W; only the series element carries the full source current.

**A7.**

$$V_{drop} = 5 \\times 0.08 = 0.40\\ \\mathrm{V}, \\qquad V_{load} = 11.60\\ \\mathrm{V}$$

$$\\frac{P_{lead}}{P_{total}} = \\frac{25 \\times 0.08}{12 \\times 5} = \\frac{2.0}{60} = 3.3\\%$$

*Trap*: computing the lead loss as $V_{drop} \\times I_{load}$ with the supply
voltage rather than the drop, or quoting the loss against the load power (58 W)
instead of the total (60 W). The two give 3.4 per cent and 3.3 per cent, close
enough that the definition has to be right.`,
      examTip: 'Reduce, solve, then check. The check that catches the most errors is KCL at the node where a branch splits: the branch currents must sum to what entered. The second-best is a power balance, which catches a factor-of-two or a wrong resistance that KCL alone can miss.',
    },
    {
      id: 'dcf-problems-b',
      title: '9. Problem Set B: Sources, Power Transfer, and Bridges',
      content: `## 9.1 How to use this set

Seven more, drawing on Sections 6 and 7. Every one of them can be done with a
handbook and three minutes.

## 9.2 Problem Set B: real sources, meters, and bridges

**B1.** A battery reads 12.6 V open-circuit and 11.4 V while delivering 6 A.
Find its internal resistance and its short-circuit current.

**B2.** A source has $V_{th} = 20\\ \\mathrm{V}$ and $R_{th} = 8\\ \\Omega$.
Find the maximum power it can deliver and the load that takes it, then find the
power and efficiency with a $24\\ \\Omega$ load.

**B3.** A 10 V supply feeds two $1\\ \\mathrm{M}\\Omega$ resistors in series. A
voltmeter of $1\\ \\mathrm{M}\\Omega$ input resistance measures the lower
resistor. Find the reading and the error, then repeat with a
$10\\ \\mathrm{M}\\Omega$ meter.

**B4.** A Wheatstone bridge has $R_{1} = 1000\\ \\Omega$,
$R_{2} = 1000\\ \\Omega$ and $R_{3} = 680\\ \\Omega$. Find the fourth arm at
balance, and find it again if $R_{1}$ is changed to $2000\\ \\Omega$.

**B5.** A quarter bridge with four nominally equal arms runs on 10 V
excitation. One arm rises by 0.2 per cent. Find the output.

**B6.** A bench supply reads 5.10 V unloaded and 4.85 V at a 2 A load. Find its
load regulation and its output resistance.

**B7.** An ammeter of $0.5\\ \\Omega$ is inserted into a loop consisting of a
5 V source and $10\\ \\Omega$. Find the measured current and the error it
introduces.

### Full solutions

**B1.**

$$r = \\frac{12.6 - 11.4}{6} = 0.20\\ \\Omega, \\qquad I_{sc} = \\frac{12.6}{0.20} = 63\\ \\mathrm{A}$$

*Trap*: dividing the loaded terminal voltage by the current,
$11.4/6 = 1.9\\ \\Omega$. That is the load resistance. The internal resistance
comes from the *change* in terminal voltage per unit change in current.

**B2.** Matched:

$$R_{L} = 8\\ \\Omega, \\qquad P_{max} = \\frac{20^{2}}{4 \\times 8} = 12.5\\ \\mathrm{W}, \\qquad \\eta = 50\\%$$

At $24\\ \\Omega$: $I = 20/32 = 0.625\\ \\mathrm{A}$, so
$P = (0.625)^{2}(24) = 9.38\\ \\mathrm{W}$ and
$\\eta = 24/32 = 75\\%$. *Trap*: computing the maximum as

$$\\frac{V_{th}^{2}}{R_{th}} = \\frac{400}{8} = 50\\ \\mathrm{W}$$

which forgets that half the source voltage is lost inside
$R_{th}$ at the match. The factor of four in the denominator is not optional.

**B3.** With the 1 MΩ meter the lower arm is $0.5\\ \\mathrm{M}\\Omega$:

$$V = 10 \\times \\frac{0.5}{1.5} = 3.33\\ \\mathrm{V} \\quad (-33\\%)$$

With the 10 MΩ meter the lower arm is $0.909\\ \\mathrm{M}\\Omega$:

$$V = 10 \\times \\frac{0.909}{1.909} = 4.76\\ \\mathrm{V} \\quad (-4.8\\%)$$

*Trap*: assuming a high-impedance meter cannot load a circuit. What matters is
the ratio to the circuit resistance, and a 1 MΩ divider is high enough to
embarrass a 10 MΩ meter.

**B4.**

$$R_{x} = \\frac{R_{2}R_{3}}{R_{1}} = \\frac{1000 \\times 680}{1000} = 680\\ \\Omega, \\qquad \\text{then} \\quad \\frac{1000 \\times 680}{2000} = 340\\ \\Omega$$

*Trap*: pairing adjacent arms instead of opposite ones, which gives
$R_{1}R_{2} = R_{3}R_{x}$ and an answer of $1470\\ \\Omega$ in the first case.

**B5.**

$$v_{o} \\approx \\frac{V_{s}}{4}\\cdot\\frac{\\Delta R}{R} = \\frac{10}{4}(0.002) = 5.00\\ \\mathrm{mV}$$

The exact value is 4.995 mV, so the first-order relation is good to 0.1 per
cent here. *Trap*: dropping the factor of four and quoting 20 mV. Only a
quarter of the fractional change appears at the output of a single-active-arm
bridge, which is precisely why half and full bridges exist.

**B6.**

$$\\text{regulation} = \\frac{5.10 - 4.85}{4.85} \\times 100 = 5.15\\%, \\qquad R_{out} = \\frac{5.10 - 4.85}{2} = 0.125\\ \\Omega$$

*Trap*: dividing by the no-load voltage, which gives 4.90 per cent. The
denominator is the full-load value.

**B7.**

$$I_{true} = \\frac{5}{10} = 0.500\\ \\mathrm{A}, \\qquad I_{meas} = \\frac{5}{10.5} = 0.476\\ \\mathrm{A}$$

an error of $-4.8\\%$. *Trap*: expecting the ammeter's resistance to raise the
reading. Inserting resistance in series can only reduce the current, so the
measured value is always below the true one, and a positive error is not
available.`,
      examTip: 'Meter-loading problems are divider problems in disguise. A voltmeter appears in PARALLEL with what it measures and must therefore be large; an ammeter appears in SERIES and must therefore be small. In both cases the error is set by the ratio of the meter resistance to the circuit resistance, and both errors are always negative.',
      importantNote: 'Maximum power from a Thevenin source is V²/(4R), not V²/R. At the matched condition the load sees only half the open-circuit voltage, so the power is one quarter of the naive figure. This factor of four is the most frequently dropped constant in the whole Circuit Analysis section.',
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
    {
      id: 'nt-loadline',
      title: '5. The Equivalent as a Terminal Characteristic',
      content: `## 5.1 Two numbers, one straight line

Everything a linear one-port can do at its terminals is carried by a single
straight line relating port voltage to port current. Superposition is the
reason. Treat the current drawn out of the port as one more independent
source; then the port voltage is a weighted sum of the internal sources and
that current, and with the internal sources fixed only one variable is left.
Write the line as

$$v(i) = V_{Th} - R_{Th}\\, i$$

and the two constants are exactly the Thevenin pair. The intercept is the
open-circuit voltage, since i = 0 there. The slope is the Thevenin resistance
carrying a minus sign, because drawing more current out of any real source
drags the terminal voltage down:

$$V_{Th} = v(0), \\qquad R_{Th} = -\\,\\frac{dv}{di}$$

That same line crosses the current axis where v = 0, and the crossing is the
Norton current:

$$I_N = \\frac{V_{Th}}{R_{Th}}$$

So the three quantities of section 1 are not three separate measurements.
They are the intercept, the slope, and the other intercept of one line, which
is why any two of them force the third.

## 5.2 The circuit this section reduces

Take a 24 V source feeding $R_{1}$ = 6 Ω into node a; from a, $R_{2}$ = 3 Ω
returns to the reference, and $R_{3}$ = 2 Ω runs from a out to the load
terminal. Reduce it once and every load question afterwards is a division.

Open the terminals. No current flows in $R_{3}$, so no voltage is dropped
across it and the terminal sits at the divider voltage:

$$V_{Th} = 24 \\cdot \\frac{3}{6+3} = 8\\ \\mathrm{V}$$

Deactivate the 24 V source — replace it with a wire — and look back in.
$R_{1}$ and $R_{2}$ are in parallel, and $R_{3}$ is in series with that pair
on the way to the terminal:

$$R_{Th} = \\frac{6\\cdot 3}{6+3} + 2 = 2 + 2 = 4\\ \\Omega$$

$$I_N = \\frac{V_{Th}}{R_{Th}} = \\frac{8}{4} = 2\\ \\mathrm{A}$$

$$v = 8 - 4i$$

![Terminal voltage against terminal current for an 8 V, 4 ohm equivalent, with load lines for 4 ohm and 12 ohm crossing it. The source line runs from the open-circuit 8 V to the short-circuit 2 A; each load line is v equals R times i through the origin, and the crossing is the operating point.](/courses/fe-ee/figures/ckt2-thevenin-loadline.svg)

A resistive load imposes its own straight line through the origin, v = R_L i.
Two lines cross once, and the crossing is where the circuit actually operates.
Nothing about that picture is decorative: it is the graphical form of the one
equation

$$i = \\frac{V_{Th}}{R_{Th}+R_L}$$

and it is how a non-linear load — a diode, an LED, a solar panel — is handled
when there is no algebra to solve. The source line stays straight; you draw
the device curve on the same axes and read the intersection.

## 5.3 Worked: two loads off one load line

Attach $R_L$ = 4 Ω to the equivalent above.

$$i = \\frac{8}{4+4} = 1.00\\ \\mathrm{A}, \\qquad v = 1.00 \\times 4 = 4.00\\ \\mathrm{V}$$

$$P_L = i^{2}R_L = 1.00^{2}\\times 4 = 4.00\\ \\mathrm{W}$$

Now swap in 12 Ω without touching the original network:

$$i = \\frac{8}{4+12} = 0.50\\ \\mathrm{A}, \\qquad v = 0.50 \\times 12 = 6.00\\ \\mathrm{V}$$

$$P_L = 0.50^{2}\\times 12 = 3.00\\ \\mathrm{W}$$

Tripling the load resistance raised the load voltage from 4 V to 6 V but cut
the delivered power from 4 W to 3 W. Both points sit on the figure, and both
took one division each because the reduction was already done. Running the
original three-resistor network twice would have taken four times as long and
offered twice as many places to slip.

## 5.4 Worked: finding an equivalent you cannot open up

A sealed module is loaded with 15 Ω and measures 15.0 V at its terminals;
loaded with 45 Ω it measures 18.0 V. Nothing inside is visible. Find the
equivalent.

Each reading gives a current:

$$I_1 = \\frac{15.0}{15} = 1.00\\ \\mathrm{A}, \\qquad I_2 = \\frac{18.0}{45} = 0.40\\ \\mathrm{A}$$

Two points determine the line, and the slope is the Thevenin resistance:

$$R_{Th} = -\\frac{V_2-V_1}{I_2-I_1} = \\frac{18.0-15.0}{1.00-0.40} = \\frac{3.0}{0.6} = 5\\ \\Omega$$

$$V_{Th} = V_1 + I_1 R_{Th} = 15.0 + 1.00\\times 5 = 20\\ \\mathrm{V}$$

Check on the second point: 20 − 0.40 × 5 = 18.0 V, as measured. The module
behaves as 20 V behind 5 Ω, and its short-circuit current would be 4 A —
which is a prediction, not a measurement, and is exactly the kind of number
you would rather predict than test.

There is a faster field version of the same idea. The load that pulls the
terminal voltage down to **half** its open-circuit value is numerically equal
to $R_{Th}$, since $V_{Th}R_L/(R_{Th}+R_L) = V_{Th}/2$ forces $R_L = R_{Th}$.
One open-circuit reading and one adjustable resistor give the pair without any
algebra at all.

## 5.5 Every real source is already a Thevenin equivalent

A battery, a bench supply, an alternator and a solar cell all present an
internal resistance whether or not anyone drew it. Model a 12 V cell with
r = 0.5 Ω:

$$v_t = E - I r = 12 - 0.5\\,I$$

$$p_{delivered} = v_t I = EI - I^{2}r$$

![Terminal voltage and delivered power for a 12 V source with 0.5 ohm internal resistance, both plotted as a fraction of their own reference value against load current. The voltage falls linearly to zero at the 24 A short-circuit current while the power rises to a peak at 12 A and returns to zero.](/courses/fe-ee/figures/ckt2-terminal-droop.svg)

The voltage line reaches zero at the short-circuit current:

$$I_{sc} = \\frac{E}{r} = \\frac{12}{0.5} = 24\\ \\mathrm{A}$$

The power curve is a downward parabola through both intercepts, so it peaks
midway between them:

$$I_{P,max} = \\frac{E}{2r} = 12\\ \\mathrm{A}, \\qquad P_{max} = \\frac{E^{2}}{4r} = \\frac{144}{2} = 72\\ \\mathrm{W}$$

At a modest 2 A draw the terminals hold 12 − 2(0.5) = 11.0 V and deliver
22.0 W, which is 91.7 % of the open-circuit voltage. That is the regime real
equipment is designed for. The 72 W peak sits at 12 A, where the terminals
have collapsed to 6 V and the cell is heating itself as fast as it is feeding
the load — a rating, not an operating point.

## 5.6 Worked: internal resistance from two meter readings

A battery reads 12.6 V with nothing connected and 12.0 V across a 20 Ω load.
Find the internal resistance and the short-circuit current.

$$I = \\frac{12.0}{20} = 0.60\\ \\mathrm{A}$$

$$r = \\frac{E - v_t}{I} = \\frac{12.6-12.0}{0.60} = 1.0\\ \\Omega$$

$$I_{sc} = \\frac{E}{r} = \\frac{12.6}{1.0} = 12.6\\ \\mathrm{A}$$

The 0.6 V that went missing is the whole measurement. A common slip is to
divide the terminal voltage by the current, 12.0/0.60 = 20 Ω, which recovers
the load resistance and says nothing about the battery.

| Quantity | Where it lives on the line | How it is obtained | This section's value |
|---|---|---|---|
| $V_{Th}$ | voltage intercept | terminals open | 8 V |
| $I_N$ | current intercept | terminals shorted | 2 A |
| $R_{Th}$ | negative slope | source deactivation, or two loaded readings | 4 Ω |
| Operating point | crossing with the load line | one division | 1 A at 4 Ω |`,
      examTip: 'When a question gives two loaded terminal readings instead of a schematic, do not look for a circuit to reduce. Convert each reading to a current, take the slope between the two points for R_Th, and extrapolate back to zero current for V_Th. Two points, one line, done in under a minute.',
      importantNote: 'The load line only works when the source line is straight, which requires the network inside to be linear. A network containing a diode or a saturating element has no single Thevenin pair, and reducing it as though it did is a silent error that produces plausible numbers.',
    },
    {
      id: 'nt-transform',
      title: '6. Source Transformation and Chained Reduction',
      content: `## 6.1 The transformation, stated as an equivalence of lines

A voltage source $V_s$ in series with R and a current source $I_s$ in parallel
with the same R produce the identical terminal line whenever

$$V_s = I_s R, \\qquad I_s = \\frac{V_s}{R}$$

Take 12 V behind 6 Ω. Its terminal line is v = 12 − 6i. Now take 2 A across
6 Ω: the load current i steals from the source current, so the resistor
carries (2 − i) and

$$v = 6(2-i) = 12 - 6i$$

the same line, coefficient for coefficient.

![Terminal voltage against current for a 12 V source behind 6 ohm and a 2 A source across 6 ohm, drawn on the same axes and falling exactly on top of each other, with a mismatched 2.5 A version plotted as a separate parallel line.](/courses/fe-ee/figures/ckt2-source-transform.svg)

The figure also draws what a botched transformation looks like: 2.5 A across
6 Ω gives v = 15 − 6i, a line parallel to the correct one but 3 V above it
everywhere. Parallel is the signature — a wrong current with a right
resistance shifts the intercept and leaves the slope alone, so every answer
comes out biased by a constant rather than obviously broken.

## 6.2 What the transformation does not preserve

The two models are indistinguishable **from outside**, and distinguishable in
one important way from inside. Leave the terminals open. The Thevenin model
carries no current anywhere and dissipates nothing. The Norton model still
circulates its full 2 A through its own 6 Ω:

$$P_{internal} = I_N^{2}R = 2^{2}\\times 6 = 24\\ \\mathrm{W}$$

Internal dissipation is not an invariant of the transformation, so an
equivalent may never be used to compute the losses, temperature rise or
efficiency of the real circuit it replaced. Use it for terminal behaviour, go
back to the original network for anything internal. This is the same trap in
different clothing as "power does not superpose".

## 6.3 Worked: collapsing a ladder by alternating transformations

A 12 V source behind 6 Ω feeds a 3 Ω shunt to the reference, and a 4 Ω series
resistor carries on to the load terminals. Reduce it without writing a single
mesh equation.

**Step 1 — go Norton.** 12 V behind 6 Ω becomes

$$I_N = \\frac{12}{6} = 2\\ \\mathrm{A} \\ \\text{across}\\ 6\\ \\Omega$$

**Step 2 — absorb the shunt.** The 6 Ω is now in parallel with the 3 Ω:

$$R = \\frac{6\\times 3}{6+3} = 2\\ \\Omega$$

**Step 3 — go back to Thevenin.** 2 A across 2 Ω becomes

$$V = 2 \\times 2 = 4\\ \\mathrm{V}\\ \\text{behind}\\ 2\\ \\Omega$$

**Step 4 — absorb the series resistor.** Series resistances add on the
Thevenin side:

$$R_{Th} = 2 + 4 = 6\\ \\Omega, \\qquad V_{Th} = 4\\ \\mathrm{V}$$

Into a 6 Ω load the answer is one division:

$$i = \\frac{4}{6+6} = 0.333\\ \\mathrm{A}, \\qquad v_L = 2.00\\ \\mathrm{V}, \\qquad P_L = 0.667\\ \\mathrm{W}$$

The rhythm is worth memorising: **Norton to swallow a parallel element,
Thevenin to swallow a series one**, alternating until the ladder is gone.

## 6.4 Worked: the transformation that is not allowed

A 5 A source feeds node a directly, and a 10 Ω resistor runs from node a to
the load terminal. Can that be turned into a voltage source of 50 V?

No. The transformation requires the resistor to be **in parallel** with the
current source, and this one is in series with it. A series element on a
current source cannot change what the source does — the current is 5 A
whatever the resistor is — so there is nothing for the transformation to act
on. The mirror-image rule holds for voltage sources: a resistor in parallel
with an ideal voltage source is invisible to the rest of the circuit and
cannot be transformed either, though it does load the source and must be kept
if internal currents matter.

$$\\text{transformable: } V_s \\text{ in series with } R, \\quad I_s \\text{ in parallel with } R$$

| Configuration | Transformable? | What to do instead |
|---|---|---|
| $V_s$ in series with R | yes | becomes $V_s/R$ across R |
| $I_s$ in parallel with R | yes | becomes $I_s R$ in series with R |
| $I_s$ in series with R | no | the R is irrelevant to the port current |
| $V_s$ in parallel with R | no | the R is irrelevant to the port voltage |
| Dependent source with its own R | yes, carefully | the controlling variable must survive the move |

The last row is the one that costs marks. A dependent source transforms by the
same algebra, but if the controlling current or voltage is defined across the
element being absorbed, the control variable disappears and the new circuit is
unsolvable. Redefine the control in terms of a surviving branch before moving
anything.`,
      examTip: 'Source transformation is usually the fastest route through a single-loop-plus-shunts ladder because each step removes one element and needs one multiplication or division. Alternate Norton and Thevenin: Norton to swallow a parallel resistor, Thevenin to swallow a series one.',
      importantNote: 'An equivalent circuit reproduces terminal behaviour only. Internal power, internal currents and efficiency belong to the original network. Computing the losses of a supply from its Norton model gives 24 W of dissipation at open circuit for a source that is actually doing nothing.',
    },
    {
      id: 'nt-superposition-deep',
      title: '7. Superposition, Quantitatively',
      content: `## 7.1 Linearity is the whole permission slip

A circuit is linear when every element obeys a proportional law — v = Ri,
v = L di/dt, i = C dv/dt — and every dependent source is a constant multiple
of its control. In such a circuit any response y is a weighted sum of the
independent source values:

$$y = a_1 x_1 + a_2 x_2 + \\dots + a_n x_n$$

The coefficients depend only on the topology and the element values, never on
the sources. Setting all sources but one to zero isolates a single term, and
the terms add back. That is superposition, and it is not a technique so much
as a restatement of what linear means.

## 7.2 The node this section works

A node V is fed by a 10 V source through $R_{1}$ = 2 Ω, by a second source
$V_b$ through $R_{2}$ = 4 Ω, and drains to the reference through
$R_{3}$ = 4 Ω. Working in conductances keeps the algebra clean:

$$G_1 = 0.5\\ \\mathrm{S}, \\quad G_2 = 0.25\\ \\mathrm{S}, \\quad G_3 = 0.25\\ \\mathrm{S}, \\quad \\sum G = 1.0\\ \\mathrm{S}$$

$$V = \\frac{10\\,G_1 + V_b\\,G_2}{G_1+G_2+G_3} = 5 + 0.25\\,V_b$$

![Two straight lines showing each source's separate contribution to a node voltage as the second source is swept, plus their sum. The contribution of the fixed 10 V source is a horizontal line at 5 V, the second source contributes a line of slope one quarter, and the total is their sum.](/courses/fe-ee/figures/ckt2-superposition-stack.svg)

Read the structure off the figure. One source's contribution is a horizontal
line, because that source is not being swept; the other is a straight line
through the origin with slope $G_2/\\sum G$ = 0.25; and the total is their
sum, which is also straight. If any element in the circuit were non-linear,
the total would bend and the two separate curves would no longer add up to it.

## 7.3 Worked: the node two ways

Set $V_b$ = 4 V.

**Source 1 alone.** Deactivate $V_b$, replacing it with a wire. Then
$R_{2}$ and $R_{3}$ both run from the node to the reference:

$$V_a = 10\\cdot\\frac{G_1}{\\sum G} = 10 \\times 0.5 = 5.0\\ \\mathrm{V}$$

**Source 2 alone.** Deactivate the 10 V source the same way:

$$V_b\\text{-part} = 4\\cdot\\frac{G_2}{\\sum G} = 4 \\times 0.25 = 1.0\\ \\mathrm{V}$$

**Sum.** V = 5.0 + 1.0 = **6.0 V**.

**Direct check by one nodal equation.** Without splitting anything:

$$\\frac{V-10}{2} + \\frac{V-4}{4} + \\frac{V}{4} = 0 \\Rightarrow V = 6.0\\ \\mathrm{V}$$

Identical, as it must be. Note the cost: superposition took two analyses, the
nodal equation took one. With two sources at the same frequency, nodal wins on
speed. Superposition earns its keep when the sources cannot be handled in one
analysis at all — different frequencies, or a mix of DC and AC.

## 7.4 Worked: why power refuses to superpose

The 4 Ω path to the reference carries the node voltage, so with V = 6.0 V:

$$P = \\frac{V^{2}}{R_3} = \\frac{6.0^{2}}{4} = 9.00\\ \\mathrm{W}$$

Adding the two separate powers instead gives

$$\\frac{5.0^{2}}{4} + \\frac{1.0^{2}}{4} = 6.25 + 0.25 = 6.50\\ \\mathrm{W}$$

which is 28 % low. The missing piece is visible the moment the square is
expanded:

$$\\frac{(V_a+V_b)^{2}}{R} = \\frac{V_a^{2}}{R} + \\frac{V_b^{2}}{R} + \\frac{2V_aV_b}{R}$$

The cross term here is 2(5.0)(1.0)/4 = 2.50 W, and 6.50 + 2.50 = 9.00 W
exactly. Superposing power silently discards that cross term. When the two
contributions have opposite signs the cross term is negative and the naive sum
comes out too **high** instead, so the error does not even have a reliable
direction to correct for.

## 7.5 Worked: DC and AC in the same circuit

A 12 V DC source in series with a 5 V rms 60 Hz source drives R = 10 Ω in
series with L = 26.5 mH. Find the rms current and the power in the resistor.

These sources cannot be combined into one phasor — one of them has no phase
and no frequency. Superposition is not a shortcut here, it is the only route.

**DC alone.** At zero frequency the inductor is a short:

$$I_{dc} = \\frac{12}{10} = 1.200\\ \\mathrm{A}$$

**AC alone.** At 60 Hz, with omega = 377 rad/s:

$$X_L = \\omega L = 377 \\times 0.0265 = 9.99\\ \\Omega$$

$$\\lvert Z \\rvert = \\sqrt{10^{2}+9.99^{2}} = 14.14\\ \\Omega, \\qquad I_{ac} = \\frac{5}{14.14} = 0.354\\ \\mathrm{A\\ rms}$$

**Combine.** The DC term and the AC term are at different frequencies, so
their product averages to zero over a cycle and the rms values combine in
quadrature — never by addition:

$$I_{rms} = \\sqrt{I_{dc}^{2}+I_{ac}^{2}} = \\sqrt{1.200^{2}+0.354^{2}} = 1.251\\ \\mathrm{A}$$

$$P_R = I_{rms}^{2}R = 1.251^{2}\\times 10 = 15.65\\ \\mathrm{W}$$

Adding the currents arithmetically gives 1.554 A and claims 24.1 W, more than
half again too much. The inductor, meanwhile, dissipates nothing at either
frequency; it only shapes how much AC current gets through.

## 7.6 What superposes and what does not

| Quantity | Superposes? | Why |
|---|---|---|
| Branch voltage | yes | linear in the sources |
| Branch current | yes | linear in the sources |
| Node voltage | yes | linear in the sources |
| Power, energy | no | quadratic; the cross term is lost |
| rms of same-frequency terms | no | phase must be carried; add as phasors first |
| rms of different-frequency terms | in quadrature | cross term averages to zero |
| Response of a diode or saturating core | no | the element is not linear |

The middle rows deserve a second look, because they are not the same rule. Two
sinusoids **at the same frequency** must be added as phasors, keeping phase,
before any rms is taken. Two components at **different** frequencies have no
fixed phase relationship over a cycle, their product integrates to zero, and
their rms values combine as the legs of a right triangle. Confusing the two
cases produces answers that are wrong by whatever the cross term happened to
be.

## 7.7 The rules that survive contact with the exam

Deactivating a source means forcing its own variable to zero, and nothing
else. A voltage source held at zero volts is a wire, so it becomes a short.
A current source held at zero amps passes nothing, so it becomes an open.
Reversing that pair is the single most common superposition error, and it does
not produce an obviously silly answer — it produces a plausible one.

Dependent sources are never deactivated. They are not excitation; they are
part of how the circuit responds, and they stay live in every sub-analysis
with their controlling variable recomputed each time.`,
      examTip: 'Count the sources before choosing superposition. With n independent sources at one frequency it needs n full analyses, and a single nodal equation usually beats it. Choose superposition when the sources are at different frequencies, or when the question itself asks for a single source contribution.',
      importantNote: 'Superposing rms values only works when the components are at different frequencies, where they combine in quadrature. Same-frequency components must be added as phasors first, because their relative phase matters and a quadrature sum throws it away.',
    },
    {
      id: 'nt-maxpower-deep',
      title: '8. Maximum Power Transfer, Derived and Bounded',
      content: `## 8.1 Where the maximum comes from

Attach $R_L$ to a Thevenin pair. The delivered power is

$$P_L = i^{2}R_L = \\left(\\frac{V_{Th}}{R_{Th}+R_L}\\right)^{2}R_L$$

Both limits are zero — a short has no voltage across it, an open has no
current through it — so a maximum must sit somewhere between. Differentiate
with respect to the load and set it to zero:

$$\\frac{dP_L}{dR_L} = V_{Th}^{2}\\,\\frac{R_{Th}-R_L}{(R_{Th}+R_L)^{3}} = 0 \\Rightarrow R_L = R_{Th}$$

The numerator vanishes only when the load equals the source resistance, and
substituting back gives the value everyone memorises:

$$P_{max} = \\frac{V_{Th}^{2}}{4R_{Th}}$$

Note carefully what is being held fixed. The **source** is fixed and the
**load** is chosen. If instead the load were fixed and the source resistance
free, the answer would be different and far less interesting: make $R_{Th}$ as
small as possible. Power systems live in that second world, which is why
nothing in a substation is impedance matched.

## 8.2 One curve, both design goals

Normalise by the ratio x = $R_L/R_{Th}$ and the whole subject fits on two
curves:

$$\\frac{P_L}{P_{max}} = \\frac{4x}{(1+x)^{2}}, \\qquad \\eta = \\frac{P_L}{P_{total}} = \\frac{x}{1+x}$$

![Delivered power as a fraction of its own peak, and efficiency, both plotted against the ratio of load to source resistance. Power rises to a maximum at a ratio of one and falls away on both sides, while efficiency climbs monotonically past it toward unity.](/courses/fe-ee/figures/ckt2-maxpower.svg)

| $x = R_L/R_{Th}$ | $P_L/P_{max}$ | Efficiency | Reading |
|---|---|---|---|
| 0.25 | 0.640 | 20 % | badly under-matched |
| 0.50 | 0.889 | 33 % | 11 % below peak already |
| 1.00 | 1.000 | 50 % | matched: peak power, half wasted inside |
| 2.00 | 0.889 | 67 % | same power as x = 0.5, twice the efficiency |
| 3.00 | 0.750 | 75 % | the practical compromise |
| 9.00 | 0.360 | 90 % | power-system territory |

Two facts fall straight out of the table. First, the power peak is **flat**:
halving or doubling the load costs 11 %, which is why a match specified to
three decimal places is engineering theatre. Second, x = 0.5 and x = 2.0
deliver identical power at wildly different efficiency — 33 % against 67 % —
so when a mismatch is unavoidable, err on the **high** side of the match. The
delivered power is the same and the source runs cooler.

## 8.3 Worked: matched against deliberately mismatched

A source has $V_{Th}$ = 20 V and $R_{Th}$ = 5 Ω.

**Matched.** $R_L$ = 5 Ω:

$$i = \\frac{20}{5+5} = 2.0\\ \\mathrm{A}, \\qquad P_L = 2.0^{2}\\times 5 = 20\\ \\mathrm{W}$$

$$P_{max} = \\frac{20^{2}}{4\\times 5} = \\frac{400}{20} = 20\\ \\mathrm{W}\\quad\\checkmark$$

The source resistance also burns $2.0^{2}\\times 5$ = 20 W, so 40 W leaves the
ideal source and half of it never reaches the load.

**Mismatched at x = 3.** $R_L$ = 15 Ω:

$$i = \\frac{20}{5+15} = 1.0\\ \\mathrm{A}, \\qquad P_L = 1.0^{2}\\times 15 = 15\\ \\mathrm{W}$$

Internal loss is now $1.0^{2}\\times 5$ = 5 W, total 20 W drawn, efficiency
75 %. The load gets 75 % of the peak power while the source dissipates a
quarter of what it did when matched. For anything that has to run continuously
and not overheat, that is the better circuit, and the numbers agree with the
x = 3 point marked on the figure.

## 8.4 Worked: the conjugate match in AC

An AC one-port has $Z_{Th}$ = 8 − j4 Ω and $V_{Th}$ = 89.44 V rms. Choose the
load for maximum power.

The reactive part of the source must be cancelled, not copied:

$$Z_L = Z_{Th}^{*} = 8 + j4\\ \\Omega$$

Then $Z_{Th}+Z_L$ = 16 Ω, purely real, and

$$P_{max} = \\frac{\\lvert V_{Th}\\rvert^{2}}{4R_{Th}} = \\frac{89.44^{2}}{4\\times 8} = \\frac{8000}{32} = 250\\ \\mathrm{W}$$

Two near-misses show what the conjugate is buying. Copying the source
impedance instead, $Z_L$ = 8 − j4, gives a total of 16 − j8 Ω, a current of
89.44/17.89 = 5.00 A and only

$$P = 5.00^{2}\\times 8 = 200\\ \\mathrm{W}$$

Matching magnitudes alone, $Z_L$ = 8.944 Ω resistive, gives 236 W. Both are
plausible-looking answers and both leave power on the table, because the
reactances are still there circulating energy that never becomes work.

## 8.5 When the load is not yours to choose

Most real problems fix the load and ask what the source must do. Then the
matched condition is irrelevant and the design rule inverts: make $R_{Th}$ as
small as the budget allows, because

$$\\eta = \\frac{R_L}{R_{Th}+R_L} \\to 1 \\quad\\text{as}\\quad R_{Th}\\to 0$$

A distribution transformer with 0.02 pu impedance is not trying to transfer
maximum power; it is trying to lose as little as possible on the way. Matching
belongs where the source is weak and irreplaceable and the signal is what
matters — an antenna, a transducer, a photodiode, the output stage of an RF
amplifier. Naming which of those two worlds a question lives in is usually
half the answer.`,
      examTip: 'Read the question for which side is fixed. "What load draws maximum power" means R_L = R_Th and 50 % efficiency. "What source resistance maximises load power" means make it as small as possible, and there is no interior optimum to differentiate for.',
      importantNote: 'In AC the match is the CONJUGATE, Z_L = Z_Th*, not Z_L = Z_Th and not a magnitude match. For Z_Th = 8 - j4 the three candidates deliver 250 W, 200 W and 236 W respectively, and only the conjugate cancels the reactance.',
    },
    {
      id: 'nt-bridge',
      title: '9. Networks That Refuse to Reduce',
      content: `## 9.1 The bridge, and what balance means

A bridge has four arms and a fifth element across the middle, and no two
resistors in it are in series or in parallel. With arms $R_{1}$ and $R_{2}$ on
one side and $R_{3}$ and $R_x$ on the other, across a supply V, the
open-circuit output between the two midpoints is the difference of two
dividers:

$$v_o = V\\left(\\frac{R_2}{R_1+R_2} - \\frac{R_x}{R_3+R_x}\\right)$$

![Open-circuit bridge output in millivolts against the unknown arm, crossing zero at the balance point and running nearly straight for several percent either side of it.](/courses/fe-ee/figures/ckt2-bridge-balance.svg)

Setting that to zero gives the balance condition, and the supply voltage
cancels out of it entirely:

$$\\frac{R_1}{R_2} = \\frac{R_3}{R_x} \\quad\\Longleftrightarrow\\quad R_x = \\frac{R_3R_2}{R_1}$$

That cancellation is the reason bridges are used for precision measurement. A
null depends only on ratios of resistances, so supply drift, meter calibration
and amplifier gain do not enter. You are not reading a scale; you are
detecting a zero.

## 9.2 Worked: a balanced bridge, and the arm that carries nothing

Three arms of 1000 Ω and a fourth adjustable arm sit across 10 V. At
$R_x$ = 1000 Ω both midpoints are at 5.00 V, the difference is zero, and the
element bridging them carries no current whatever its value. It can be removed
or replaced by a short without changing anything else, and the remaining
network is a plain series-parallel reduction.

Now increase $R_x$ by 1 %, to 1010 Ω:

$$v_o = 10\\left(0.5000 - \\frac{1010}{2010}\\right) = 10(0.5000-0.502488) = -24.88\\ \\mathrm{mV}$$

A 1 % change in one arm moves the output by about 25 mV out of a 10 V supply,
roughly V/400 per percent. That small, nearly linear slope is what a strain
gauge sells: tiny fractional changes converted into a voltage that a
differential amplifier can take seriously.

## 9.3 Worked: an unbalanced bridge by delta-wye

Balance is a special case. When the bridge is unbalanced the middle arm
carries current, no two elements are series or parallel, and one delta must be
converted before anything reduces.

Take a 12 V source across nodes 1 and 0. From node 1: 30 Ω to node 2 and 60 Ω
to node 3. Between the midpoints: 90 Ω. From node 2: 25 Ω to the reference;
from node 3: 10 Ω to the reference. Check balance first — 30/25 = 1.2 against
60/10 = 6, so it is unbalanced and no shortcut exists.

Convert the delta on nodes 1, 2, 3. Each wye arm is the product of the two
delta resistors touching that node, over the sum of all three:

$$\\sum R_\\Delta = 30+60+90 = 180\\ \\Omega$$

$$R_1 = \\frac{30\\times 60}{180} = 10\\ \\Omega, \\quad R_2 = \\frac{30\\times 90}{180} = 15\\ \\Omega, \\quad R_3 = \\frac{60\\times 90}{180} = 30\\ \\Omega$$

Now the network is a ladder. The two lower branches are 15 + 25 = 40 Ω and
30 + 10 = 40 Ω, in parallel:

$$R_{eq} = 10 + \\frac{40\\times 40}{40+40} = 10 + 20 = 30\\ \\Omega$$

$$I_{source} = \\frac{12}{30} = 0.400\\ \\mathrm{A}$$

A nodal solve of the original five-resistor bridge gives midpoint voltages of
5.00 V and 2.00 V and the same 0.400 A, so the conversion did not change the
circuit — it only made it reducible. The 90 Ω arm carries
(5.00 − 2.00)/90 = 33.3 mA, which is exactly the current that balance would
have removed.

The reverse conversion, wye to delta, is the sum of the pairwise products
divided by the opposite arm:

$$R_{12} = \\frac{R_1R_2+R_2R_3+R_3R_1}{R_3}$$

and for the balanced case the pair collapses to $R_\\Delta = 3R_Y$, which is
worth carrying in memory purely so the direction never gets reversed. A wye is
always the smaller of the two.

## 9.4 Worked: Thevenin resistance with a dependent source, two ways

A 12 V source feeds $R_{1}$ = 4 Ω into node a; $R_{2}$ = 2 Ω runs from a to
the reference; and a current source of value $2I_1$ — where $I_1$ is the
current in $R_{1}$ flowing toward a — is injected into node a. Terminals are
a and the reference.

**Open circuit.** With $I_1 = (12-V)/4$, KCL at a says the injected total
$3I_1$ leaves through $R_{2}$:

$$3\\cdot\\frac{12-V}{4} = \\frac{V}{2} \\Rightarrow 36-3V = 2V \\Rightarrow V_{oc} = 7.2\\ \\mathrm{V}$$

**Short circuit.** Shorting a to the reference forces V = 0, so
$I_1 = 12/4 = 3$ A and $R_{2}$ carries nothing:

$$I_{sc} = I_1 + 2I_1 = 3I_1 = 9.0\\ \\mathrm{A}$$

$$R_{Th} = \\frac{V_{oc}}{I_{sc}} = \\frac{7.2}{9.0} = 0.80\\ \\Omega$$

**Test-source check.** Kill the 12 V source only, apply $V_t$ at the
terminals. Now $I_1 = -V_t/4$, and the current the test source must supply is
what leaves through $R_{2}$ minus what the dependent source contributes:

$$I_t = \\frac{V_t}{2} - 3I_1 = \\frac{V_t}{2} + \\frac{3V_t}{4} = 1.25\\,V_t$$

$$R_{Th} = \\frac{V_t}{I_t} = \\frac{1}{1.25} = 0.80\\ \\Omega\\quad\\checkmark$$

Two independent routes, one answer. Had the dependent source been wrongly
deactivated, the result would have been 4 Ω in parallel with 2 Ω = 1.33 Ω —
not absurd on its face, and wrong by a factor of 1.67 in every load
calculation that followed. Maximum power into this port is

$$P_{max} = \\frac{V_{oc}^{2}}{4R_{Th}} = \\frac{7.2^{2}}{4\\times 0.8} = \\frac{51.84}{3.2} = 16.2\\ \\mathrm{W}$$

## 9.5 Choosing a route when nothing reduces

| Symptom | Route |
|---|---|
| No series or parallel pair anywhere | delta-wye on one triangle, then reduce |
| Bridge with the ratio condition satisfied | balanced: delete the middle arm, then reduce |
| Dependent source present, terminals accessible | $R_{Th} = V_{oc}/I_{sc}$ |
| Dependent source with no independent source | test source, $R_{Th} = V_t/I_t$ |
| Only one branch current wanted | mesh or nodal directly |
| Load about to be swept | Thevenin once, then divide repeatedly |`,
      examTip: 'Test a bridge for balance before doing anything else: cross-multiply the two arm ratios. If they match, the middle element carries zero current and can be deleted, and a problem that looked like delta-wye becomes two series pairs in parallel.',
      importantNote: 'Delta-wye conversions preserve terminal behaviour at the three nodes only. Voltages and currents inside the converted section have no counterpart in the original circuit, so if a question asks for the current in one of the delta resistors, convert back before answering.',
    },
    {
      id: 'nt-problems',
      title: '10. Problem Sets',
      content: `Everything above was demonstrated. These two sets are yours to
solve. Work each one with a calculator and the handbook only, write the
equivalent or the deactivation state down before computing anything, and
target three minutes per problem. Full solutions follow each set, and each
solution names the wrong answer the question is built to attract.

## Problem Set C: Equivalents, Sources and Transformations

**C1.** A 24 V source feeds 6 Ω into node a. From a, 3 Ω returns to the
reference and 2 Ω runs out to terminal b. Find $V_{Th}$, $R_{Th}$ and $I_N$
at terminal b.

**C2.** Using the equivalent from C1, find the power delivered to a 6 Ω load.

**C3.** A sealed module delivers 15.0 V into a 15 Ω load and 18.0 V into a
45 Ω load. Find its Thevenin equivalent.

**C4.** A one-port containing a dependent source measures 7.2 V open-circuit
and 9.0 A short-circuit. Find $R_{Th}$ and the maximum power available.

**C5.** A 6 A current source sits in parallel with 5 Ω, and a 3 Ω resistor
runs from that combination to the output terminals. Find the Thevenin
equivalent.

**C6.** A 9 V battery reads 8.4 V across a 28 Ω load. Find the internal
resistance and the short-circuit current.

### Worked answers, Set C

**C1.** Open the terminals: no current flows in the 2 Ω, so it drops nothing
and the terminal sits at the divider voltage.

$$V_{Th} = 24\\cdot\\frac{3}{6+3} = 8.00\\ \\mathrm{V}$$

Deactivate the source and look in: the 6 Ω and 3 Ω are in parallel, with the
2 Ω in series on the way out.

$$R_{Th} = \\frac{6\\times 3}{9} + 2 = 4.00\\ \\Omega, \\qquad I_N = \\frac{8}{4} = 2.00\\ \\mathrm{A}$$

**Trap.** Putting the 2 Ω into the divider gives 24 × 3/11 = 6.55 V, and
leaving it out of $R_{Th}$ gives 2 Ω and a short-circuit current of 4 A,
double the truth. The rule that settles it: an element carrying no current
cannot affect $V_{Th}$, but it always affects $R_{Th}$.

**C2.** One division, no re-analysis:

$$i = \\frac{8}{4+6} = 0.800\\ \\mathrm{A}, \\qquad P_L = 0.800^{2}\\times 6 = 3.84\\ \\mathrm{W}$$

**Trap.** Using $V_{Th}^{2}/R_L$ = 64/6 = 10.7 W puts the whole 8 V across the
load and forgets that $R_{Th}$ takes its share. The load only sees 4.8 V.

**C3.** Convert each reading to a current: 15.0/15 = 1.00 A and 18.0/45 =
0.400 A. Two points on the terminal line:

$$R_{Th} = \\frac{18.0-15.0}{1.00-0.400} = 5.00\\ \\Omega, \\qquad V_{Th} = 15.0 + 1.00\\times 5 = 20.0\\ \\mathrm{V}$$

**Trap.** Dividing a single reading, 15.0/1.00 = 15 Ω, recovers the load you
already knew and tells you nothing about the module. One loaded reading can
never separate $V_{Th}$ from $R_{Th}$; you need two.

**C4.** The ratio works whatever is inside, which is the entire reason it is
the method of choice when sources may not be deactivated:

$$R_{Th} = \\frac{7.2}{9.0} = 0.800\\ \\Omega, \\qquad P_{max} = \\frac{7.2^{2}}{4\\times 0.8} = 16.2\\ \\mathrm{W}$$

**Trap.** Answering that it cannot be determined because a dependent source is
present. It can, and this is how.

**C5.** Transform first, then absorb the series element:

$$V = 6 \\times 5 = 30\\ \\mathrm{V}\\ \\text{behind}\\ 5\\ \\Omega, \\qquad R_{Th} = 5+3 = 8\\ \\Omega$$

so 30 V behind 8 Ω.

**Trap.** Multiplying the source current by the series resistor, 6 × 3 = 18 V,
transforms across the wrong element. Only the resistor **in parallel** with a
current source takes part in the transformation.

**C6.** The load current is 8.4/28 = 0.300 A, and 0.6 V went missing inside:

$$r = \\frac{9.0-8.4}{0.300} = 2.00\\ \\Omega, \\qquad I_{sc} = \\frac{9.0}{2.0} = 4.50\\ \\mathrm{A}$$

**Trap.** Dividing terminal voltage by current, 8.4/0.3 = 28 Ω, returns the
load resistance. The internal resistance is always found from the **drop**,
never from the terminal voltage itself.

## Problem Set D: Superposition, Matching and Bridges

**D1.** A node is fed by 10 V through 2 Ω and by 4 V through 4 Ω, and drains
to the reference through 4 Ω. Find the node voltage by superposition.

**D2.** For the circuit of D1, find the power in the 4 Ω resistor that goes to
the reference.

**D3.** A 12 V DC source in series with a 5 V rms 60 Hz source drives 10 Ω in
series with 26.5 mH. Find the rms current and the resistor power.

**D4.** A source has $V_{Th}$ = 20 V and $R_{Th}$ = 5 Ω. What load draws
maximum power, how much is it, and at what efficiency?

**D5.** The same source must drive a fixed 15 Ω load. What fraction of the
maximum power reaches it, and what is the efficiency?

**D6.** An AC one-port has $Z_{Th}$ = 8 − j4 Ω and $V_{Th}$ = 89.44 V rms.
Find the load for maximum power and that power.

**D7.** A bridge of three 1000 Ω arms and a fourth arm across a 10 V supply is
balanced. The fourth arm rises by 1 %. Find the new open-circuit output.

### Worked answers, Set D

**D1.** In conductances, $G_1$ = 0.5 S, $G_2$ = 0.25 S, $G_3$ = 0.25 S,
summing to 1.0 S.

$$V_a = 10\\times\\frac{0.5}{1.0} = 5.00\\ \\mathrm{V}, \\qquad V_b = 4\\times\\frac{0.25}{1.0} = 1.00\\ \\mathrm{V}$$

$$V = 5.00+1.00 = 6.00\\ \\mathrm{V}$$

**Trap.** Opening a voltage source instead of shorting it. Deactivation forces
the source variable to zero, and a zero-volt source is a wire.

**D2.** Superpose the voltage, then square it:

$$P = \\frac{6.00^{2}}{4} = 9.00\\ \\mathrm{W}$$

**Trap.** Adding the separate powers gives 25/4 + 1/4 = 6.50 W, 28 % low,
because the cross term 2(5)(1)/4 = 2.50 W has been discarded. Power never
superposes.

**D3.** DC first, with the inductor a short: $I_{dc}$ = 12/10 = 1.200 A. Then
AC, with $X_L = 377 \\times 0.0265$ = 9.99 Ω:

$$\\lvert Z \\rvert = \\sqrt{10^{2}+9.99^{2}} = 14.14\\ \\Omega, \\qquad I_{ac} = \\frac{5}{14.14} = 0.354\\ \\mathrm{A}$$

$$I_{rms} = \\sqrt{1.200^{2}+0.354^{2}} = 1.251\\ \\mathrm{A}, \\qquad P = 1.251^{2}\\times 10 = 15.65\\ \\mathrm{W}$$

**Trap.** Adding the currents to 1.554 A and reporting 24.1 W. Components at
different frequencies combine in quadrature, never arithmetically.

**D4.** $R_L$ = $R_{Th}$ = 5 Ω.

$$P_{max} = \\frac{20^{2}}{4\\times 5} = 20.0\\ \\mathrm{W}, \\qquad \\eta = 50\\ \\%$$

**Trap.** Reporting 100 % efficiency at the match. At $R_L = R_{Th}$ the
source resistance dissipates exactly as much as the load does.

**D5.** With x = 15/5 = 3:

$$\\frac{P_L}{P_{max}} = \\frac{4(3)}{(1+3)^{2}} = 0.750, \\qquad \\eta = \\frac{3}{4} = 75\\ \\%$$

so 15.0 W of the 20.0 W peak, at 75 % efficiency — the trade the table in 8.2
makes explicit.

**Trap.** Concluding that an unmatched load is badly wrong. Three times the
matched resistance still delivers three-quarters of the peak power while
cutting internal dissipation from 20 W to 5 W.

**D6.** Conjugate match: $Z_L = 8 + j4$ Ω, total impedance 16 Ω real.

$$P_{max} = \\frac{89.44^{2}}{4\\times 8} = 250\\ \\mathrm{W}$$

**Trap.** Copying the source impedance, $Z_L = 8 - j4$, leaves 16 − j8 Ω,
a 5.00 A current and 200 W. Matching magnitudes only, 8.944 Ω resistive,
gives 236 W. Both are on the low side because the reactance is still
circulating energy.

**D7.** Balance puts both midpoints at 5.00 V. Raising one arm to 1010 Ω:

$$v_o = 10\\left(0.5000-\\frac{1010}{2010}\\right) = -24.88\\ \\mathrm{mV}$$

**Trap.** Scaling the supply by 1 % to get 100 mV. The output is the
difference of two dividers, and a 1 % arm change moves a divider by only about
a quarter of a percent, so the bridge output runs near V/400 per percent — not
V/100.`,
      examTip: 'In every one of these, write the equivalent or the deactivation state before touching the calculator. Nearly all the wrong answers above come from arithmetic performed on a circuit that was never correctly set up, and they are wrong by clean-looking factors that make them attractive multiple-choice options.',
      quiz: [
        {
          question: 'A one-port measures 15.0 V into a 15 ohm load and 18.0 V into a 45 ohm load. What is R_Th?',
          options: ['5 ohm', '15 ohm', '30 ohm', '3 ohm'],
          correctIndex: 0,
          explanation: 'Currents are 1.00 A and 0.400 A, so R_Th = (18.0 - 15.0)/(1.00 - 0.400) = 5 ohm and V_Th = 20 V. Dividing one reading by its own current returns the load resistance, which is the 15 ohm distractor.',
        },
        {
          question: 'A source with R_Th = 5 ohm drives a fixed 15 ohm load. Compared with the matched case, the delivered power is:',
          options: ['75% of the peak, at 75% efficiency', 'equal to the peak, at 75% efficiency', '33% of the peak, at 50% efficiency', '25% of the peak, at 25% efficiency'],
          correctIndex: 0,
          explanation: 'With x = 3, P/P_max = 4x/(1+x)^2 = 0.75 and efficiency is x/(1+x) = 0.75. The power peak is flat, so a threefold mismatch still delivers three-quarters of the maximum while cutting internal dissipation to a quarter of its matched value.',
        },
        {
          question: 'An AC source has Z_Th = 8 - j4 ohm. Which load draws maximum power?',
          options: ['8 + j4 ohm', '8 - j4 ohm', '8.94 ohm resistive', '8 ohm resistive'],
          correctIndex: 0,
          explanation: 'Maximum power needs the conjugate, Z_L = Z_Th*, so the reactances cancel and only 16 ohm of resistance remains. Copying Z_Th gives 200 W and a magnitude match gives 236 W, against 250 W for the conjugate.',
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
    {
      id: 'acp-derivation',
      title: '6. The Phasor Method, Derived',
      content: `## 6.1 What the method actually buys

A series RLC branch driven by a source obeys one integro-differential
equation:

$$L\\frac{di}{dt} + Ri + \\frac{1}{C}\\int i\\,dt = v(t)$$

Solving that directly for every question the exam asks would be unthinkable.
Phasors reduce it to a division, and the reduction rests on one observation:
a sinusoid is the real part of a rotating complex exponential.

$$v(t) = V_m\\cos(\\omega t+\\phi) = \\Re\\left\\{V_m e^{j\\phi}\\,e^{j\\omega t}\\right\\}$$

Everything time-varying is packed into the common factor $e^{j\\omega t}$, and
everything specific to this particular signal — its size and its timing — is
packed into the constant in front. That constant is the phasor:

$$\\mathbf{V} = V_m e^{j\\phi} = V_m\\angle\\phi$$

Differentiation now costs a multiplication, and integration a division:

$$\\frac{d}{dt}\\left(\\mathbf{V}e^{j\\omega t}\\right) = j\\omega\\,\\mathbf{V}e^{j\\omega t}, \\qquad \\int \\mathbf{V}e^{j\\omega t}\\,dt = \\frac{\\mathbf{V}}{j\\omega}e^{j\\omega t}$$

Substitute those into the branch equation, cancel the $e^{j\\omega t}$ that
appears in every term, and the calculus is gone:

$$\\left(R + j\\omega L + \\frac{1}{j\\omega C}\\right)\\mathbf{I} = \\mathbf{V}$$

$$Z(j\\omega) = R + j\\omega L + \\frac{1}{j\\omega C}, \\qquad \\mathbf{I} = \\frac{\\mathbf{V}}{Z}$$

Three conditions are hiding in that cancellation, and every one of them is
examined. The circuit must be **linear**, or superposing exponentials is not
allowed. Every source must be at **one frequency**, or there is no common
factor to cancel. And the answer is the **steady state** only — the natural
response has already died away, which is why phasors say nothing about what
happens in the first few milliseconds after a switch closes.

## 6.2 The three element laws, and where the j comes from

| Element | Time domain | Phasor domain | Angle contributed |
|---|---|---|---|
| Resistor | $v = Ri$ | $\\mathbf{V} = R\\,\\mathbf{I}$ | 0 degrees |
| Inductor | $v = L\\,di/dt$ | $\\mathbf{V} = j\\omega L\\,\\mathbf{I}$ | +90 degrees |
| Capacitor | $i = C\\,dv/dt$ | $\\mathbf{I} = j\\omega C\\,\\mathbf{V}$ | −90 degrees |

The inductor law comes straight from the derivative rule:

$$v = L\\frac{di}{dt} \\Rightarrow \\mathbf{V} = j\\omega L\\,\\mathbf{I} = \\omega L\\,\\mathbf{I}\\angle 90^{\\circ}$$

and the capacitor from the same rule read backwards:

$$\\mathbf{V} = \\frac{\\mathbf{I}}{j\\omega C} = -\\frac{j}{\\omega C}\\,\\mathbf{I} = \\frac{\\mathbf{I}}{\\omega C}\\angle(-90^{\\circ})$$

Multiplying by j rotates a phasor a quarter turn counter-clockwise; dividing
by j rotates it the other way. That single fact is the whole content of the
mnemonic: in an inductor the voltage leads, in a capacitor the current leads.
The reactances themselves are the magnitudes,

$$X_L = \\omega L, \\qquad X_C = \\frac{1}{\\omega C}$$

and the sign convention that keeps everything consistent is to write the
impedance as $Z = R + jX$ with $X = X_L - X_C$. A positive X means inductive
and lagging current; a negative X means capacitive and leading current.

## 6.3 Worked: a phasor from a waveform written as a sine

Convert i(t) = 12 sin(377t + 30°) A to a phasor.

Phasor notation is referenced to the **cosine**, so a sine must be shifted
before anything else happens:

$$\\sin\\theta = \\cos(\\theta - 90^{\\circ})$$

$$i(t) = 12\\cos(377t + 30^{\\circ} - 90^{\\circ}) = 12\\cos(377t - 60^{\\circ})$$

$$\\mathbf{I} = 12\\angle(-60^{\\circ})\\ \\mathrm{A\\ peak} = 8.49\\angle(-60^{\\circ})\\ \\mathrm{A\\ rms}$$

and the frequency travels alongside, not inside, the phasor:

$$f = \\frac{\\omega}{2\\pi} = \\frac{377}{2\\pi} = 60.0\\ \\mathrm{Hz}$$

Writing 12 angle 30 degrees straight off the page is the single most common
conversion error in this chapter, and it is 90 degrees wrong in a direction
that will flip an answer from lagging to leading.

## 6.4 Phasors add as vectors, and magnitudes do not add

![Two current phasors drawn as arrows from the origin, one of 10 A along the real axis and one of 8 A along the imaginary axis, with their vector sum of 12.81 A at 38.66 degrees and the head-to-tail construction shown as a dashed line.](/courses/fe-ee/figures/ckt2-phasor-add.svg)

Two currents arrive at a node: $\\mathbf{I}_1 = 10\\angle 0^{\\circ}$ A and
$\\mathbf{I}_2 = 8\\angle 90^{\\circ}$ A. In rectangular form the sum is
immediate:

$$\\mathbf{I}_1+\\mathbf{I}_2 = (10+j0)+(0+j8) = 10+j8$$

$$\\lvert \\mathbf{I}\\rvert = \\sqrt{10^{2}+8^{2}} = 12.81\\ \\mathrm{A}, \\qquad \\theta = \\arctan\\frac{8}{10} = 38.66^{\\circ}$$

Ten amps and eight amps meeting at a node produce 12.81 A, not 18 A. Over five
amps have gone nowhere at all, and no energy was lost: the two currents simply
peak at different instants, so their crests never coincide. An ammeter in the
common branch reads 12.81 A and is not faulty.

The working rules follow the form of the arithmetic:

$$\\mathbf{Z}_1\\mathbf{Z}_2 = \\lvert Z_1\\rvert\\lvert Z_2\\rvert\\angle(\\theta_1+\\theta_2), \\qquad \\frac{\\mathbf{Z}_1}{\\mathbf{Z}_2} = \\frac{\\lvert Z_1\\rvert}{\\lvert Z_2\\rvert}\\angle(\\theta_1-\\theta_2)$$

| Operation | Do it in | Because |
|---|---|---|
| Addition, subtraction | rectangular | real parts and imaginary parts are independent |
| Multiplication, division | polar | magnitudes multiply, angles add |
| Series impedances | rectangular | they add |
| Parallel impedances | mixed: product in polar, sum in rectangular | both forms are needed in one expression |
| Reading a final answer | polar | the exam asks for magnitude and phase |

## 6.5 Worked: two currents that partly cancel

$\\mathbf{I}_1 = 6\\angle 0^{\\circ}$ A and $\\mathbf{I}_2 = 8\\angle(-90^{\\circ})$ A
enter a node. Find the total.

$$\\mathbf{I} = 6 - j8, \\qquad \\lvert \\mathbf{I}\\rvert = \\sqrt{36+64} = 10.0\\ \\mathrm{A}$$

$$\\theta = \\arctan\\frac{-8}{6} = -53.13^{\\circ}$$

so 10.0 A lagging by 53.13 degrees. Adding magnitudes gives 14 A, and
subtracting them gives 2 A; both appear as answer choices, and both ignore the
right angle between the two contributions.

## 6.6 Worked: rectangular and polar, both directions

Convert Z = 5∠53.13° Ω to rectangular, then back.

$$R = \\lvert Z\\rvert\\cos\\theta = 5\\cos 53.13^{\\circ} = 3.00\\ \\Omega$$

$$X = \\lvert Z\\rvert\\sin\\theta = 5\\sin 53.13^{\\circ} = 4.00\\ \\Omega$$

so Z = 3 + j4 Ω, and back again:

$$\\lvert Z\\rvert = \\sqrt{3^{2}+4^{2}} = 5.00\\ \\Omega, \\qquad \\theta = \\arctan\\frac{4}{3} = 53.13^{\\circ}$$

The 3-4-5 triangle and its 36.87/53.13 degree pair turn up constantly in this
exam, and recognising them saves real time. One caution on the arctangent: it
cannot tell 3 + j4 from −3 − j4, because the ratio is the same. Always check
which quadrant the rectangular form puts you in before writing the angle down.`,
      examTip: 'Write omega and the phasor reference down before anything else. Convert every source to the same reference — cosine, and either all peak or all rms — because a phasor sum of one peak-referenced and one rms-referenced quantity is meaningless, and the resulting number always looks plausible.',
      importantNote: 'Phasors describe the steady state of a linear circuit at one frequency. They cannot represent a transient, a DC level, a different frequency in the same sum, or the behaviour of any non-linear element. When a problem has sources at two frequencies, solve each one separately and combine the results in the time domain.',
    },
    {
      id: 'acp-sweep',
      title: '7. One Circuit at Every Frequency',
      content: `## 7.1 The branch this section follows

Take a single series branch and keep it for the rest of the chapter:
R = 30 Ω, L = 100 mH, C = 20 µF. Everything about it follows from two
reactances that move in opposite directions:

$$X_L = 2\\pi f L, \\qquad X_C = \\frac{1}{2\\pi f C}$$

$$Z = R + j\\,(X_L-X_C), \\qquad \\lvert Z\\rvert = \\sqrt{R^{2}+(X_L-X_C)^{2}}, \\qquad \\theta = \\arctan\\frac{X_L-X_C}{R}$$

They are equal at exactly one frequency, found by setting
$2\\pi f L = 1/(2\\pi f C)$:

$$f_0 = \\frac{1}{2\\pi\\sqrt{LC}} = \\frac{1}{2\\pi\\sqrt{0.100\\times 20\\times 10^{-6}}} = 112.5\\ \\mathrm{Hz}$$

![Inductive reactance rising as a straight line of slope one on log-log axes, capacitive reactance falling with slope minus one, and the series impedance magnitude dipping to the resistance value where the two cross at 112.5 hertz.](/courses/fe-ee/figures/ckt2-reactance-vs-f.svg)

On logarithmic axes $X_L$ is a straight line of slope +1 and $X_C$ a straight
line of slope −1. Two straight lines of different slope meet exactly once,
which is the geometric reason a series LC has one resonant frequency and not a
band of them.

| f (Hz) | $X_L$ (Ω) | $X_C$ (Ω) | $X = X_L-X_C$ (Ω) | $\\lvert Z\\rvert$ (Ω) | θ (deg) | Character |
|---|---|---|---|---|---|---|
| 30 | 18.85 | 265.26 | −246.41 | 248.23 | −83.06 | strongly capacitive |
| 60 | 37.70 | 132.63 | −94.93 | 99.56 | −72.46 | capacitive |
| 91.17 | 57.28 | 87.28 | −30.00 | 42.43 | −45.00 | lower half-power edge |
| 112.54 | 70.71 | 70.71 | 0.00 | 30.00 | 0.00 | resonant, purely resistive |
| 138.92 | 87.28 | 57.28 | +30.00 | 42.43 | +45.00 | upper half-power edge |
| 200 | 125.66 | 39.79 | +85.88 | 90.96 | +70.74 | inductive |
| 400 | 251.33 | 19.89 | +231.43 | 233.37 | +82.61 | strongly inductive |

Read the third and fourth columns together. The impedance magnitude is never
smaller than R and reaches R only at 112.54 Hz, because a hypotenuse cannot be
shorter than one of its legs. And the angle changes **sign** at that
frequency, so a branch that was returning energy early in the cycle starts
storing it instead. Nothing about the components changed; only the frequency
did.

## 7.2 Worked: the branch at 60 Hz, element by element

Apply 120 V rms at 60 Hz. First the reactances, from omega and not from f:

$$\\omega = 2\\pi(60) = 377\\ \\mathrm{rad/s}$$

$$X_L = 377\\times 0.100 = 37.70\\ \\Omega, \\qquad X_C = \\frac{1}{377\\times 20\\times 10^{-6}} = 132.63\\ \\Omega$$

$$X = 37.70-132.63 = -94.93\\ \\Omega$$

$$\\lvert Z\\rvert = \\sqrt{30^{2}+94.93^{2}} = 99.56\\ \\Omega, \\qquad \\theta = -72.46^{\\circ}$$

$$I = \\frac{120}{99.56} = 1.205\\ \\mathrm{A\\ rms}$$

The current **leads** by 72.46 degrees, because at 60 Hz — well below
resonance — the capacitor dominates. Now the element voltages, each the
current times its own magnitude:

$$V_R = 1.2053\\times 30 = 36.16\\ \\mathrm{V}$$

$$V_L = 1.2053\\times 37.70 = 45.44\\ \\mathrm{V}, \\qquad V_C = 1.2053\\times 132.63 = 159.86\\ \\mathrm{V}$$

The capacitor holds 159.86 V while the source supplies 120 V, and the
magnitudes sum to 241 V. Neither observation breaks KVL, because KVL applies
to the phasors:

$$\\mathbf{V} = V_R + j(V_L-V_C) = 36.16 - j114.42, \\qquad \\lvert \\mathbf{V}\\rvert = \\sqrt{36.16^{2}+114.42^{2}} = 120.0\\ \\mathrm{V}$$

The inductor and capacitor voltages are 180 degrees apart and cancel most of
each other before the resistor voltage is added in quadrature. Any AC circuit
question that asks whether a component voltage can exceed the supply is asking
whether you know this.

## 7.3 Worked: the same branch at resonance

At $f_0$ = 112.54 Hz the two reactances are equal:

$$X_L = X_C = 2\\pi(112.54)(0.100) = 70.71\\ \\Omega$$

$$Z = 30 + j0, \\qquad I = \\frac{120}{30} = 4.00\\ \\mathrm{A}$$

The current is more than three times its 60 Hz value, and the branch looks
purely resistive to the source. The element voltages, however, do not
disappear:

$$V_L = V_C = 4.00\\times 70.71 = 282.8\\ \\mathrm{V}$$

which is 2.36 times the supply voltage. That multiplier is the quality factor:

$$Q = \\frac{X_L(f_0)}{R} = \\frac{70.71}{30} = 2.357$$

$$\\mathrm{BW} = \\frac{R}{2\\pi L} = \\frac{30}{2\\pi(0.100)} = 47.75\\ \\mathrm{Hz}$$

A resonant branch with a modest Q of 2.36 already puts 283 V across parts fed
from a 120 V source. Component voltage ratings, not the supply rating, are
what decide whether such a circuit survives.

## 7.4 The angle, and the two frequencies where it is 45 degrees

![Impedance angle of the series branch against frequency on a logarithmic axis, running from nearly minus ninety degrees at low frequency through zero at resonance to nearly plus ninety at high frequency, with the plus and minus forty-five degree crossings marked.](/courses/fe-ee/figures/ckt2-impedance-angle.svg)

$$\\theta(f) = \\arctan\\frac{2\\pi f L - 1/(2\\pi f C)}{R}$$

The curve is bounded by ±90 degrees and can never reach either, because R is
always in the branch. It crosses ±45 degrees where the net reactance equals
the resistance in magnitude, and those two frequencies — 91.17 Hz and
138.92 Hz for this branch — are the half-power edges. Their separation is the
bandwidth:

$$f_{hi}-f_{lo} = 138.92-91.17 = 47.75\\ \\mathrm{Hz} = \\frac{R}{2\\pi L}\\quad\\checkmark$$

Note that the edges are **not** symmetric about $f_0$ on a linear axis: 112.54
is not the average of 91.17 and 138.92, which is 115.04. They are symmetric
geometrically, since $\\sqrt{91.17\\times 138.92}$ = 112.54. That is why a log
frequency axis is the honest way to draw this.

## 7.5 Worked: phase as a time shift on an oscilloscope

An oscilloscope shows the shift between two traces in milliseconds, so the
conversion is always the same:

$$\\Delta t = \\frac{\\theta}{360^{\\circ}}\\,T, \\qquad \\theta = 360^{\\circ}\\frac{\\Delta t}{T}$$

![One cycle each of voltage and current for a load whose impedance angle is 36.87 degrees, each normalised to its own peak, with the horizontal shift between the positive-going zero crossings marked as 1.71 milliseconds.](/courses/fe-ee/figures/ckt2-vi-lag.svg)

Take a load of Z = 4 + j3 Ω driven by v(t) = 170 cos(377t) V.

$$\\lvert Z\\rvert = \\sqrt{4^{2}+3^{2}} = 5.00\\ \\Omega, \\qquad \\theta = \\arctan\\frac{3}{4} = 36.87^{\\circ}$$

$$I_m = \\frac{170}{5.00} = 34.0\\ \\mathrm{A}, \\qquad i(t) = 34.0\\cos(377t - 36.87^{\\circ})\\ \\mathrm{A}$$

At 60 Hz the period is 16.67 ms, so the lag appears on screen as

$$\\Delta t = \\frac{36.87}{360}\\times 16.67 = 1.71\\ \\mathrm{ms}$$

and in rms terms the current is 34.0/1.414 = 24.04 A. The inductance behind
the 3 Ω of reactance is

$$L = \\frac{X_L}{\\omega} = \\frac{3}{377} = 7.96\\ \\mathrm{mH}$$

Two checks belong with every scope reading. The measured offset must be less
than half a period, or the wrong pair of crossings was used and the true angle
is the supplement. And the direction has to be identified before the value is
trusted: current crossing **after** voltage is lagging and inductive, current
crossing **before** it is leading and capacitive. The instrument reports a
number either way.`,
      examTip: 'Compute omega once, write it down, and reuse it. An error of f for omega scales every reactance by 6.283, and because both reactances move the same way the impedance angle often still looks reasonable, which is what makes the mistake survive a sanity check.',
      quiz: [
        {
          question: 'A series branch of R = 30 ohm, L = 100 mH and C = 20 microfarad is driven at 60 Hz. Is it inductive or capacitive, and by what angle?',
          options: ['Capacitive, 72.5 degrees, current leading', 'Inductive, 72.5 degrees, current lagging', 'Capacitive, 17.5 degrees, current leading', 'Resistive, since both reactances are present'],
          correctIndex: 0,
          explanation: 'X_L = 37.70 ohm and X_C = 132.63 ohm, so the net reactance is -94.93 ohm and the branch is capacitive with the current leading by arctan(94.93/30) = 72.46 degrees. Its resonance is at 112.5 Hz, well above 60 Hz, and below resonance the capacitor always dominates.',
        },
        {
          question: 'In the same branch at resonance, driven by 120 V rms, what voltage appears across the capacitor?',
          options: ['283 V', '120 V', '30 V', '0 V'],
          correctIndex: 0,
          explanation: 'At resonance Z = R = 30 ohm, so I = 4.00 A, and X_C = X_L = 70.71 ohm gives V_C = 4.00 x 70.71 = 283 V. The reactive voltages cancel each other in the KVL sum, which is why the source only has to supply 120 V while the components see 283 V.',
        },
      ],
    },
    {
      id: 'acp-networks',
      title: '8. Network Analysis in the Phasor Domain',
      content: `## 8.1 Every DC tool, with Z where R used to be

Once the elements have impedances, nothing else about circuit analysis
changes. Kirchhoff's laws hold for phasors because they hold instant by
instant; series and parallel combination, the two dividers, nodal and mesh
analysis, Thevenin, Norton and superposition all carry over with complex
arithmetic replacing real arithmetic.

$$Z_{series} = Z_1+Z_2+\\dots, \\qquad Z_{par} = \\frac{Z_1Z_2}{Z_1+Z_2}, \\qquad Y = \\frac{1}{Z} = G+jB$$

$$\\mathbf{V}_2 = \\mathbf{V}\\,\\frac{Z_2}{Z_1+Z_2}, \\qquad \\mathbf{I}_1 = \\mathbf{I}\\,\\frac{Z_2}{Z_1+Z_2}$$

The current divider looks wrong at first glance and is not: the branch with
the **smaller** impedance takes the larger current, so the numerator carries
the other branch. It is the same asymmetry as the resistive case.

The one genuinely new hazard is that complex numbers do not order themselves.
There is no such thing as the larger of 3 + j4 and 5 − j1, so any step that
depends on comparing sizes has to compare magnitudes explicitly.

## 8.2 Worked: a divider whose output exceeds its input

$Z_1 = 40+j30$ Ω in series with $Z_2 = -j50$ Ω across a 100∠0° V rms source.
Find the voltage across each.

$$Z_1+Z_2 = 40+j30-j50 = 40-j20 = 44.72\\angle(-26.57^{\\circ})\\ \\Omega$$

$$\\mathbf{V}_2 = 100\\,\\frac{50\\angle(-90^{\\circ})}{44.72\\angle(-26.57^{\\circ})} = 111.8\\angle(-63.43^{\\circ})\\ \\mathrm{V}$$

$$\\mathbf{V}_1 = 100\\,\\frac{50\\angle 36.87^{\\circ}}{44.72\\angle(-26.57^{\\circ})} = 111.8\\angle 63.43^{\\circ}\\ \\mathrm{V}$$

Both branch voltages are 111.8 V from a 100 V source, and their magnitudes sum
to 223.6 V. The phasor sum is what KVL actually requires:

$$\\mathbf{V}_1+\\mathbf{V}_2 = 2(111.8)\\cos(63.43^{\\circ}) = 100.0\\angle 0^{\\circ}\\ \\mathrm{V}\\quad\\checkmark$$

A resistive divider can never do this. A reactive one can, whenever the branch
impedances partly cancel, and the effect is exactly why capacitors in series
LC networks fail on over-voltage rather than over-current.

## 8.3 Worked: parallel branches through admittance

A 20 Ω resistor is in parallel with an inductive reactance of j15 Ω. Find the
equivalent impedance.

The admittance route avoids dividing complex numbers:

$$Y = \\frac{1}{20}+\\frac{1}{j15} = 0.0500 - j0.0667\\ \\mathrm{S}$$

$$\\lvert Y\\rvert = \\sqrt{0.0500^{2}+0.0667^{2}} = 0.0833\\ \\mathrm{S}, \\qquad \\angle Y = -53.13^{\\circ}$$

$$Z = \\frac{1}{Y} = 12.0\\angle 53.13^{\\circ} = 7.20+j9.60\\ \\Omega$$

Two features of that answer are worth noticing. The magnitude, 12.0 Ω, is
smaller than either branch, as any parallel combination must be. And the
resistive part of Z is 7.20 Ω even though the only resistor in the circuit is
20 Ω — because the reactance changes how much current the resistor is asked to
carry, the real part of an impedance is not simply the resistance present.
Answering 20 Ω for the real part is a standing trap.

## 8.4 Worked: Thevenin equivalent of an AC one-port

A 100∠0° V rms source sits behind a 10 Ω series resistor, with a capacitive
reactance of −j20 Ω across the output terminals. Reduce it.

**Open-circuit voltage** — a divider:

$$\\mathbf{V}_{Th} = 100\\,\\frac{-j20}{10-j20} = 100\\,\\frac{20\\angle(-90^{\\circ})}{22.36\\angle(-63.43^{\\circ})} = 89.44\\angle(-26.57^{\\circ})\\ \\mathrm{V}$$

**Thevenin impedance** — deactivate the source and look in, exactly as in DC:

$$Z_{Th} = \\frac{10(-j20)}{10-j20} = \\frac{-j200(10+j20)}{500} = 8-j4\\ \\Omega$$

**Norton check.** The short-circuit current is the source current with the
terminals shorted, 100/10 = 10∠0° A, and

$$\\mathbf{I}_N Z_{Th} = 10\\times 8.944\\angle(-26.57^{\\circ}) = 89.44\\angle(-26.57^{\\circ})\\ \\mathrm{V}\\quad\\checkmark$$

which is the open-circuit voltage by an independent route. Every DC habit
transfers, including the habit of computing two of the three quantities and
predicting the third.

## 8.5 Frequency response, and where the corner is

A first-order RC low-pass takes its output across the capacitor:

$$H(j\\omega) = \\frac{1/(j\\omega C)}{R+1/(j\\omega C)} = \\frac{1}{1+j\\omega RC}$$

$$\\lvert H\\rvert = \\frac{1}{\\sqrt{1+(f/f_c)^{2}}}, \\qquad \\angle H = -\\arctan\\frac{f}{f_c}, \\qquad f_c = \\frac{1}{2\\pi RC}$$

![Magnitude response of a first-order RC low-pass filter in decibels against log frequency, with the flat zero-decibel asymptote and the minus twenty decibel per decade asymptote crossing at the corner frequency, three decibels above the true curve.](/courses/fe-ee/figures/ckt2-bode-rc.svg)

With R = 1.6 kΩ and C = 100 nF,

$$f_c = \\frac{1}{2\\pi(1600)(100\\times 10^{-9})} = 994.7\\ \\mathrm{Hz}$$

The corner has a physical meaning that survives every variation of this
problem: it is the frequency at which the capacitor's reactance equals the
resistance.

$$X_C(f_c) = \\frac{1}{2\\pi(994.7)(100\\times 10^{-9})} = 1600\\ \\Omega = R$$

There the two contributions are equal and at right angles, so the output is
$1/\\sqrt{2}$ of the input and lags by 45 degrees:

$$20\\log_{10}\\frac{1}{\\sqrt{2}} = -3.01\\ \\mathrm{dB}$$

One decade above the corner the true response is −20.04 dB against the
asymptote's −20.00 dB, which is why the straight-line construction is safe to
use everywhere except within about an octave of the corner itself.

## 8.6 Worked: output of the filter at 5 kHz

Feed 1.00 V rms at 5.00 kHz into the filter above.

$$\\frac{f}{f_c} = \\frac{5000}{994.7} = 5.027$$

$$\\lvert H\\rvert = \\frac{1}{\\sqrt{1+5.027^{2}}} = 0.195, \\qquad V_{out} = 0.195\\ \\mathrm{V\\ rms}$$

$$20\\log_{10}(0.195) = -14.19\\ \\mathrm{dB}, \\qquad \\angle H = -\\arctan(5.027) = -78.75^{\\circ}$$

The asymptote would have predicted $-20\\log_{10}(5.027)$ = −14.02 dB, within
0.2 dB of the exact answer — close enough to check an answer against, not
close enough to be the answer when the question asks for a voltage.

| Frequency | $\\lvert H\\rvert$ | dB | Phase |
|---|---|---|---|
| 100 Hz | 0.995 | −0.04 | −5.7 deg |
| 200 Hz | 0.980 | −0.17 | −11.4 deg |
| 994.7 Hz (corner) | 0.707 | −3.01 | −45.0 deg |
| 5.00 kHz | 0.195 | −14.19 | −78.7 deg |
| 9.95 kHz (decade) | 0.0995 | −20.04 | −84.3 deg |`,
      examTip: 'When the handbook formula for a divider or a reduction is written in R, use it unchanged with Z. The only adjustments are that every quantity is complex and that comparisons of size must be made on magnitudes. Do the additions in rectangular form and the divisions in polar form and the arithmetic stays short.',
      importantNote: 'The real part of an impedance is not the resistance in the circuit unless nothing else is in parallel with it. A 20 ohm resistor paralleled with j15 ohm presents 7.2 + j9.6 ohm, and using 20 ohm as the resistive part will misstate the real power by a factor of nearly three.',
    },
    {
      id: 'acp-problems',
      title: '9. Problem Sets',
      content: `Everything above was demonstrated. These two sets are yours to
solve. Convert to omega first, name the reference (peak or rms) before adding
anything, and target three minutes per problem. Full solutions follow each
set, and each one names the wrong answer the question was built to attract.

## Problem Set A: Phasors, Impedance and RMS

**A1.** A 50 Ω resistor is in series with a 150 mH inductor at 60 Hz. Find the
impedance magnitude and angle.

**A2.** Convert i(t) = 12 sin(377t + 30°) A to a cosine-referenced phasor, and
give both the peak and rms forms.

**A3.** Two currents enter a node: 6∠0° A and 8∠−90° A. Find the total.

**A4.** Find the reactance magnitude of a 40 µF capacitor at 400 Hz.

**A5.** A load draws 5.0 A rms from a 240 V rms supply with the current
lagging by 25°. Find its impedance in rectangular form.

**A6.** A branch has Z = 8 − j6 Ω. Find its admittance, conductance and
susceptance.

**A7.** Find the rms value of v(t) = 8 + 6 cos(ωt) V.

### Worked answers, Set A

**A1.** $\\omega = 377$ rad/s, so $X_L = 377\\times 0.150 = 56.55$ Ω.

$$\\lvert Z\\rvert = \\sqrt{50^{2}+56.55^{2}} = 75.48\\ \\Omega, \\qquad \\theta = \\arctan\\frac{56.55}{50} = 48.52^{\\circ}$$

**Trap.** Adding the two arithmetically gives 106.5 Ω, which overstates the
impedance by 41 % and understates the current by the same proportion.
Resistance and reactance are at right angles, always.

**A2.** Shift the sine to a cosine before doing anything else:

$$12\\sin(377t+30^{\\circ}) = 12\\cos(377t-60^{\\circ})$$

$$\\mathbf{I} = 12\\angle(-60^{\\circ})\\ \\mathrm{A\\ peak} = 8.49\\angle(-60^{\\circ})\\ \\mathrm{A\\ rms}$$

**Trap.** Reading 12∠30° straight off the page. That is 90 degrees wrong, and
in a power-factor question it converts a lagging load into a leading one.

**A3.** In rectangular form the sum is 6 − j8, so

$$\\lvert \\mathbf{I}\\rvert = \\sqrt{36+64} = 10.0\\ \\mathrm{A}, \\qquad \\theta = -53.13^{\\circ}$$

**Trap.** 14 A, from adding magnitudes. The two currents peak a quarter cycle
apart and their crests never coincide.

**A4.** $\\omega = 2\\pi(400) = 2513$ rad/s.

$$X_C = \\frac{1}{2513\\times 40\\times 10^{-6}} = 9.95\\ \\Omega$$

**Trap.** Using f instead of omega gives 62.5 Ω, a factor of 6.28 too large;
forgetting to invert gives 0.1005 Ω. Both appear as choices in this style of
question.

**A5.** The magnitude is the voltage over the current, and lagging current
means a positive angle:

$$\\lvert Z\\rvert = \\frac{240}{5.0} = 48\\ \\Omega, \\qquad Z = 48\\angle 25^{\\circ}$$

$$R = 48\\cos 25^{\\circ} = 43.5\\ \\Omega, \\qquad X = 48\\sin 25^{\\circ} = 20.3\\ \\Omega$$

so Z = 43.5 + j20.3 Ω.

**Trap.** Giving the angle as −25°. The current lags the voltage, so the
impedance angle is positive and the load is inductive.

**A6.** Rationalise rather than inverting the parts separately:

$$Y = \\frac{1}{8-j6} = \\frac{8+j6}{8^{2}+6^{2}} = \\frac{8+j6}{100} = 0.0800+j0.0600\\ \\mathrm{S}$$

so G = 0.0800 S and B = 0.0600 S, and the check $\\lvert Y\\rvert = 1/\\lvert Z\\rvert$
gives 0.100 S against 1/10 Ω.

**Trap.** Writing G = 1/8 = 0.125 S and B = −1/6 S. Conductance equals 1/R
only when there is no reactance in the branch.

**A7.** The DC term and the AC term are at different frequencies, so they
combine in quadrature:

$$V_{rms} = \\sqrt{8^{2}+\\left(\\frac{6}{\\sqrt{2}}\\right)^{2}} = \\sqrt{64+18} = 9.06\\ \\mathrm{V}$$

**Trap.** 14 V from adding the offset to the peak, or 12.24 V from adding the
offset to the AC rms. Neither is a quadrature sum, and both would overstate
the heating badly.

## Problem Set B: Frequency, Networks and Response

**B1.** A series branch of R = 30 Ω, L = 100 mH and C = 20 µF is driven by
120 V rms at 60 Hz. Find the current magnitude and its phase relative to the
supply.

**B2.** For the same branch, find the resonant frequency, the current there,
and the capacitor voltage there.

**B3.** $Z_1 = 40+j30$ Ω is in series with $Z_2 = -j50$ Ω across 100∠0° V rms.
Find the voltage across $Z_2$.

**B4.** A 20 Ω resistor is in parallel with an inductive reactance of j15 Ω.
Find the equivalent impedance in polar and rectangular form.

**B5.** An RC low-pass has R = 1.6 kΩ and C = 100 nF. Find the corner
frequency, and the output amplitude and phase at 5.00 kHz for a 1.00 V input.

**B6.** At 400 Hz, an oscilloscope shows the current zero-crossing 0.35 ms
after the voltage zero-crossing. Find the phase angle and the power factor.

**B7.** A 100∠0° V rms source behind 10 Ω has −j20 Ω across its output
terminals. Find the Thevenin equivalent at those terminals.

### Worked answers, Set B

**B1.** $X_L = 377(0.100) = 37.70$ Ω and $X_C = 1/(377\\times 20\\times 10^{-6})$
= 132.63 Ω, so X = −94.93 Ω.

$$\\lvert Z\\rvert = \\sqrt{30^{2}+94.93^{2}} = 99.56\\ \\Omega, \\qquad I = \\frac{120}{99.56} = 1.205\\ \\mathrm{A}$$

leading by 72.46 degrees.

**Trap.** Answering "lagging" because an inductor is present. Below resonance
the capacitor wins, and 60 Hz is well below this branch's 112.5 Hz.

**B2.** $f_0 = 1/(2\\pi\\sqrt{LC})$ = 112.5 Hz, where the reactances cancel:

$$I = \\frac{120}{30} = 4.00\\ \\mathrm{A}, \\qquad X_C = 70.71\\ \\Omega, \\qquad V_C = 4.00\\times 70.71 = 283\\ \\mathrm{V}$$

**Trap.** Reporting 120 V across the capacitor because it cannot exceed the
supply. It can, by the factor Q = 2.36, and this is where reactive components
actually fail.

**B3.** The series total is 40 − j20 = 44.72∠−26.57° Ω.

$$\\mathbf{V}_2 = 100\\,\\frac{50\\angle(-90^{\\circ})}{44.72\\angle(-26.57^{\\circ})} = 111.8\\angle(-63.43^{\\circ})\\ \\mathrm{V}$$

**Trap.** Assuming a divider output cannot exceed its input and discarding the
answer. With reactive branches that partly cancel, 111.8 V from a 100 V source
is correct, and the other branch holds 111.8 V as well.

**B4.** Working in admittance:

$$Y = 0.0500-j0.0667\\ \\mathrm{S}, \\qquad Z = \\frac{1}{Y} = 12.0\\angle 53.13^{\\circ} = 7.20+j9.60\\ \\Omega$$

**Trap.** Treating the reactance as a resistance and computing
1/(1/20 + 1/15) = 8.57 Ω. That ignores the right angle and is 29 % low on the
magnitude while giving no phase at all.

**B5.** $f_c = 1/(2\\pi RC)$ = 994.7 Hz, and f/f_c = 5.027 at 5.00 kHz:

$$\\lvert H\\rvert = \\frac{1}{\\sqrt{1+5.027^{2}}} = 0.195, \\qquad V_{out} = 0.195\\ \\mathrm{V}, \\qquad \\angle H = -78.75^{\\circ}$$

**Trap.** Using 1/(RC) = 6250 as though it were in hertz. That puts the corner
above the test frequency and returns 0.78 V — four times too much — because
the 2π was left out.

**B6.** The period is 1/400 = 2.50 ms.

$$\\theta = 360^{\\circ}\\frac{0.35}{2.50} = 50.4^{\\circ}, \\qquad \\mathrm{pf} = \\cos 50.4^{\\circ} = 0.637\\ \\text{lagging}$$

**Trap.** Using the 60 Hz period of 16.67 ms out of habit, which gives 7.6
degrees and a power factor of 0.99. Always take the period from the stated
frequency.

**B7.** Divider for the open-circuit voltage, source deactivation for the
impedance:

$$\\mathbf{V}_{Th} = 100\\,\\frac{-j20}{10-j20} = 89.44\\angle(-26.57^{\\circ})\\ \\mathrm{V}$$

$$Z_{Th} = \\frac{10(-j20)}{10-j20} = 8-j4\\ \\Omega$$

**Trap.** Reporting $Z_{Th}$ = 10 − j20 Ω, the series sum. Deactivating the
source puts the 10 Ω in **parallel** with the reactance, not in series with
it.`,
      examTip: 'Every trap in these two sets is one of four things: f used where omega belongs, magnitudes added where phasors were required, a sine read as though it were a cosine, or a sign of phase taken from the presence of a component rather than from the net reactance. Checking those four before submitting an answer catches most of what this section can throw.',
      quiz: [
        {
          question: 'A 20 ohm resistor is in parallel with an inductive reactance of j15 ohm. What is the equivalent impedance?',
          options: ['7.2 + j9.6 ohm', '20 + j15 ohm', '8.57 ohm', '35 ohm'],
          correctIndex: 0,
          explanation: 'Y = 1/20 + 1/(j15) = 0.05 - j0.0667 S, so Z = 1/Y = 12 at 53.13 degrees = 7.2 + j9.6 ohm. The 8.57 ohm distractor comes from treating the reactance as a resistance in the reciprocal formula, which discards the right angle between the two branch currents.',
        },
        {
          question: 'An RC low-pass has R = 1.6 kohm and C = 100 nF. What is its corner frequency?',
          options: ['995 Hz', '6250 Hz', '160 Hz', '1600 Hz'],
          correctIndex: 0,
          explanation: 'f_c = 1/(2 pi R C) = 1/(2 pi x 1600 x 100e-9) = 994.7 Hz. The 6250 Hz distractor is 1/(RC), which is the corner in radians per second and is 2 pi times too large when quoted in hertz.',
        },
        {
          question: 'A 100 V rms source behind 10 ohm has -j20 ohm across its output terminals. What is Z_Th?',
          options: ['8 - j4 ohm', '10 - j20 ohm', '10 + j20 ohm', '22.4 ohm'],
          correctIndex: 0,
          explanation: 'Deactivating the source shorts it, placing the 10 ohm in parallel with the -j20 ohm: Z_Th = 10(-j20)/(10 - j20) = 8 - j4 ohm. Answering 10 - j20 treats the two as being in series, which is what they look like on the schematic but not what the port sees.',
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

$$S = V I = 240 \\times 20 = 4800 VA$$
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

- Lower cutoff: $f_{1} \\approx f_{0} - BW/2$
- Upper cutoff: $f_{2} \\approx f_{0} + BW/2$

Those two are the **high-Q approximation**, not identities. What is exact is that
$f_{2} - f_{1} = BW$ and that $f_{0} = \\sqrt{f_{1}f_{2}}$, the geometric mean.
Section 6 derives the exact cutoffs and shows how far the approximation drifts
once Q falls below about 5.

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
    {
      id: 'res-impedance',
      title: '5. Resonance Derived from the Impedance Function',
      content: `Resonance is usually introduced as a rule — set the two reactances
equal — and the rule is correct, but it hides where the interesting behaviour
comes from. Every quantity in this chapter, the resonant frequency, the quality
factor, the bandwidth and the phase reversal, falls out of one complex function
of frequency. Deriving them together is faster than memorising them separately,
and it makes the parallel case free rather than a second thing to learn.

## 5.1 One function, everything in it

A series RLC branch has impedance

$$Z(j\\omega) = R + j\\omega L + \\frac{1}{j\\omega C} = R + j\\left(\\omega L - \\frac{1}{\\omega C}\\right)$$

The real part is fixed; the imaginary part is a difference of two terms that move
in opposite directions with frequency. Write the net reactance as $X(\\omega)$:

$$X(\\omega) = \\omega L - \\frac{1}{\\omega C}, \\qquad \\lvert Z \\rvert = \\sqrt{R^2 + X^2}, \\qquad \\theta = \\arctan \\frac{X}{R}$$

Three consequences follow immediately and need no further physics. The magnitude
is smallest where $X = 0$, because a sum of squares is minimised by killing the
term that can be killed. The angle is zero at the same place, so the branch looks
purely resistive there. And setting $X = 0$ gives the resonant frequency:

$$\\omega L = \\frac{1}{\\omega C} \\;\\Longrightarrow\\; \\omega_0 = \\frac{1}{\\sqrt{LC}}, \\qquad f_0 = \\frac{1}{2\\pi \\sqrt{LC}}$$

Both $R$ and the source are absent from that result. Damping changes the shape of
the response around resonance and can never move it.

## 5.2 The two reactances, drawn

Take $R = 30$ ohm, $L = 100$ mH and $C = 20$ microfarad — the same components the
second-order transient work uses, so the two chapters describe one circuit.

$$f_0 = \\frac{1}{2\\pi \\sqrt{(0.100)(20 \\times 10^{-6})}} = \\frac{1}{2\\pi (1.414 \\times 10^{-3})} = 112.54\\ \\text{Hz}$$

![Inductive reactance rising linearly and capacitive reactance falling as one over frequency on logarithmic axes, crossing at 112.5 hertz, with the magnitude of the series impedance dipping to the 30 ohm resistance at that crossing.](/courses/fe-ee/figures/ckt2-reactance-vs-f.svg)

On logarithmic axes $X_L = 2\\pi f L$ is a straight line of slope $+1$ and
$X_C = 1/(2\\pi f C)$ a straight line of slope $-1$. They cross once, and only
once, which is why a series RLC has exactly one resonant frequency. Below the
crossing $X_C$ dominates and the branch is **capacitive**; above it the branch is
**inductive**. The $\\lvert Z \\rvert$ curve tracks whichever reactance is larger
and dips to touch $R$ at the crossing.

## 5.3 Worked example 1 — resonance from the impedance function

For that circuit driven by 12 V rms, find the resonant frequency, the reactances
there, the current, and the voltage across each element.

$$\\omega_0 = \\frac{1}{\\sqrt{2 \\times 10^{-6}}} = 707.1\\ \\text{rad/s} \\;\\Rightarrow\\; f_0 = 112.54\\ \\text{Hz}$$

$$X_L = \\omega_0 L = 707.1 \\times 0.100 = 70.71\\ \\Omega, \\qquad X_C = \\frac{1}{\\omega_0 C} = \\frac{1}{707.1 \\times 20 \\times 10^{-6}} = 70.71\\ \\Omega$$

Equal, as they must be — computing both is the fastest check that $LC$ was
inverted correctly. Note that their common value is
$\\sqrt{L/C} = \\sqrt{5000} = 70.71$ ohm, the characteristic impedance, which is
the same quantity that set the critical damping resistance in the transient
chapter.

$$\\lvert Z \\rvert = R = 30\\ \\Omega, \\qquad I = \\frac{12}{30} = 0.400\\ \\text{A}$$

$$V_R = 12\\ \\text{V}, \\qquad V_L = V_C = 0.400 \\times 70.71 = 28.28\\ \\text{V}$$

The reactive voltages exceed the source by the factor $70.71/30 = 2.357$, which
is the quality factor, and they cancel in the loop because they are 180 degrees
apart.

## 5.4 The angle, and what the half-power edges really are

The magnitude tells you how much current flows; the angle tells you what kind of
load the source sees. Sweeping it produces a curve that is the same shape for
every series RLC:

![Impedance angle of a series RLC swept on a logarithmic frequency axis, running from minus ninety degrees at low frequency through zero at 112.5 hertz to plus ninety degrees at high frequency, with the plus and minus forty-five degree crossings marked at 138.9 and 91.2 hertz.](/courses/fe-ee/figures/ckt2-impedance-angle.svg)

The $\\pm 45$ degree crossings are not an arbitrary choice of marker. The angle is
45 degrees exactly when $\\lvert X \\rvert = R$, and at that condition

$$\\lvert Z \\rvert = \\sqrt{R^2 + R^2} = R\\sqrt{2}$$

so the current is $1/\\sqrt{2}$ of its peak and the power is half. **The
half-power frequencies and the 45 degree phase frequencies are the same two
frequencies.** That equivalence is worth carrying, because a question that gives
you a phase angle has silently given you a bandwidth edge.

## 5.5 Worked example 2 — the impedance angle away from resonance

For the same circuit, find the impedance and angle at 60 Hz, and the two
frequencies at which the angle reaches $\\pm 45$ degrees.

$$X_L = 2\\pi (60)(0.100) = 37.70\\ \\Omega, \\qquad X_C = \\frac{1}{2\\pi (60)(20 \\times 10^{-6})} = 132.63\\ \\Omega$$

$$X = 37.70 - 132.63 = -94.93\\ \\Omega, \\qquad \\lvert Z \\rvert = \\sqrt{30^2 + 94.93^2} = 99.56\\ \\Omega$$

$$\\theta = \\arctan \\frac{-94.93}{30} = -72.46^{\\circ}$$

Negative, so the circuit is capacitive at 60 Hz and the current **leads**. The
current has fallen from 0.400 A at resonance to $12/99.56 = 0.121$ A, a factor of
3.32, from a frequency change of less than a factor of two.

For the 45 degree points set $\\lvert X \\rvert = R = 30$ ohm. Writing
$\\alpha = R/2L = 150$ s$^{-1}$, the two roots of
$\\omega^2 \\mp (R/L)\\omega - \\omega_0^2 = 0$ are

$$\\omega_{1,2} = \\mp \\alpha + \\sqrt{\\alpha^2 + \\omega_0^2} = \\mp 150 + \\sqrt{22500 + 500000} = \\mp 150 + 722.8$$

giving 572.8 and 872.8 rad/s, i.e. **91.17 Hz and 138.92 Hz**. Their difference
is exactly $2\\alpha = 300$ rad/s, which is $R/L$, and that is the bandwidth.

## 5.6 The quality factor, three definitions that agree

Q is defined three different ways in three different places, and the definitions
are equivalent rather than merely similar. For a series circuit:

$$Q = \\frac{\\omega_0 L}{R} = \\frac{1}{\\omega_0 R C} = \\frac{1}{R}\\sqrt{\\frac{L}{C}}$$

The **reactance form** is the first: Q is the ratio of the reactance at
resonance to the resistance. The **bandwidth form** follows from the half-power
derivation above:

$$Q = \\frac{\\omega_0}{BW} = \\frac{f_0}{f_2 - f_1}$$

The **energy form** is the most general, and the only one that survives outside
electrical circuits:

$$Q = 2\\pi \\times \\frac{\\text{energy stored}}{\\text{energy dissipated per cycle}}$$

They agree because at resonance the total stored energy is constant — it merely
shuttles between the inductor and the capacitor — while the resistor removes a
fixed amount each cycle. There is also a fourth form, useful when the circuit is
not a textbook RLC at all, in terms of the slope of the reactance curve:

$$Q = \\frac{\\omega_0}{2R}\\left. \\frac{dX}{d\\omega} \\right|_{\\omega_0}$$

A steeply crossing reactance curve is a high-Q circuit, which is exactly what the
figure in section 5.2 shows geometrically.

## 5.7 Worked example 3 — Q by three independent routes

Confirm that the three definitions give one number for the 30 ohm, 100 mH,
20 microfarad circuit driven at 12 V rms.

**Reactance route.**

$$Q = \\frac{\\omega_0 L}{R} = \\frac{707.1 \\times 0.100}{30} = 2.357$$

**Bandwidth route.** From the half-power frequencies just computed,

$$Q = \\frac{f_0}{f_2 - f_1} = \\frac{112.54}{138.92 - 91.17} = \\frac{112.54}{47.75} = 2.357$$

**Energy route.** At resonance the current is 0.400 A rms, so its peak is
$0.400\\sqrt{2} = 0.5657$ A and the peak energy in the inductor is

$$W = \\tfrac{1}{2}L\\,i_{\\text{pk}}^2 = 0.5 (0.100)(0.5657)^2 = 16.0\\ \\text{mJ}$$

Half a cycle later that same 16.0 mJ sits in the capacitor, whose peak voltage is
$0.400 \\times 70.71 \\times \\sqrt{2} = 40.0$ V and whose stored energy is
$\\tfrac{1}{2}CV^2 = 16.0$ mJ — the same number, which is the whole point of
resonance. Meanwhile the resistor dissipates

$$P = I^2 R = (0.400)^2 (30) = 4.80\\ \\text{W} \\;\\Rightarrow\\; W_{\\text{cycle}} = \\frac{P}{f_0} = \\frac{4.80}{112.54} = 42.65\\ \\text{mJ}$$

$$Q = 2\\pi \\frac{16.0}{42.65} = 2.357$$

Three routes, three different physical arguments, one number to four figures. If
an exam question gives you any one of reactance, bandwidth or energy, it has
given you Q.`,
      examTip: 'Setting the net reactance to zero gives the resonant frequency; setting its magnitude equal to R gives BOTH half-power frequencies. Almost every series-resonance question is one of those two conditions in disguise.',
      importantNote: 'The half-power frequencies and the 45-degree phase frequencies are identical, because |X| = R makes |Z| = R·sqrt(2) and the phase 45 degrees at the same instant. A question phrased in phase angle is a bandwidth question.',
    },
    {
      id: 'res-bandwidth',
      title: '6. Bandwidth, Exact Half-Power Frequencies and Loaded Q',
      content: `Bandwidth is where resonance questions get their distractors, because
there are two formulas in circulation and only one of them is exact. This section
derives the exact pair, shows what the common approximation costs, and then takes
the step that separates a calculation from a design: the Q you get is not the Q
you specify, because the load is part of the circuit.

## 6.1 The exact half-power frequencies

Half power means $\\lvert Z \\rvert = R\\sqrt{2}$, hence $\\lvert X \\rvert = R$:

$$\\left\\lvert \\omega L - \\frac{1}{\\omega C} \\right\\rvert = R$$

Clearing the fraction gives two quadratics in $\\omega$, whose positive roots are

$$\\omega_1 = -\\frac{R}{2L} + \\sqrt{\\left(\\frac{R}{2L}\\right)^2 + \\frac{1}{LC}}, \\qquad \\omega_2 = +\\frac{R}{2L} + \\sqrt{\\left(\\frac{R}{2L}\\right)^2 + \\frac{1}{LC}}$$

Two exact consequences drop straight out. Subtracting:

$$\\omega_2 - \\omega_1 = \\frac{R}{L} = \\frac{\\omega_0}{Q} \\quad \\text{(bandwidth, exactly)}$$

Multiplying, since the radical terms cancel against the squares:

$$\\omega_1 \\omega_2 = \\frac{1}{LC} = \\omega_0^2 \\;\\Longrightarrow\\; \\omega_0 = \\sqrt{\\omega_1 \\omega_2} \\quad \\text{(geometric mean, exactly)}$$

In terms of Q alone the pair is often written

$$\\omega_{1,2} = \\omega_0 \\left[\\sqrt{1 + \\frac{1}{4Q^2}} \\mp \\frac{1}{2Q}\\right]$$

The bracketed radical is the entire difference between the exact answer and the
familiar $\\omega_0 \\pm BW/2$. At $Q = 10$ it equals 1.00125, a 0.125 % shift; at
$Q = 2$ it equals 1.0308.

## 6.2 What the approximation costs

Compare exact against approximate for the 30 ohm circuit of section 5, where
$Q = 2.357$:

| Quantity | Exact | $f_0 \\pm BW/2$ | Error |
|---|---|---|---|
| $f_1$ | 91.17 Hz | 88.67 Hz | 2.7 % low |
| $f_2$ | 138.92 Hz | 136.41 Hz | 1.8 % low |
| $f_2 - f_1$ | 47.75 Hz | 47.75 Hz | none |
| centre of the band | 115.04 Hz | 112.54 Hz | 2.2 % high |

The bandwidth is right either way. What the approximation gets wrong is the
*placement* of the band: the true half-power frequencies are not symmetric about
$f_0$ on a linear axis, they are symmetric about it on a logarithmic one. The
arithmetic mean of the true edges is 115.04 Hz, which sits 2.2 % above $f_0$, and
that gap is exactly the radical above.

## 6.3 Worked example 4 — exact half-power frequencies at Q = 5

Keep $L = 100$ mH and $C = 20$ microfarad but reduce the resistance to
$R = 14.14$ ohm. Find Q, the bandwidth, and both half-power frequencies exactly.

$$Q = \\frac{\\omega_0 L}{R} = \\frac{70.71}{14.14} = 5.000, \\qquad BW = \\frac{f_0}{Q} = \\frac{112.54}{5} = 22.51\\ \\text{Hz}$$

$$\\sqrt{1 + \\frac{1}{4(25)}} = \\sqrt{1.01} = 1.004988$$

$$f_1 = 112.54(1.004988 - 0.1) = 101.85\\ \\text{Hz}, \\qquad f_2 = 112.54(1.004988 + 0.1) = 124.35\\ \\text{Hz}$$

![One resonance curve for a quality factor of five, with the half-power band shaded between 101.8 and 124.4 hertz, the 0.707 line drawn across it, and the note that 112.5 hertz is the geometric mean of the two edges.](/courses/fe-ee/figures/ckt2-halfpower-band.svg)

Check both exact identities: the difference is
$f_2 - f_1 = 112.54 \\times 0.2 = 22.51$ Hz, matching $f_0/Q$; and the geometric mean is
$\\sqrt{101.85 \\times 124.35} = 112.54$ Hz, matching $f_0$. The approximation
would have given 101.29 and 123.79 Hz, each 0.55 % low — small enough to be
invisible at this Q, which is precisely why the exam sets problems at Q near 2
instead.

## 6.4 What Q buys, drawn three times

Holding $L$ and $C$ fixed and changing only $R$ moves nothing except the width:

![Three series-RLC current responses normalised to their own peaks for quality factors of two, five and fifteen, all peaking at 112.5 hertz, with bandwidths of 56.3, 22.5 and 7.5 hertz respectively.](/courses/fe-ee/figures/ckt2-resonance-q.svg)

| Q | $R$ required | BW | Half-power edges |
|---|---|---|---|
| 2 | 35.36 $\\Omega$ | 56.27 Hz | 87.1 and 143.4 Hz |
| 5 | 14.14 $\\Omega$ | 22.51 Hz | 101.8 and 124.4 Hz |
| 15 | 4.71 $\\Omega$ | 7.50 Hz | 108.9 and 116.4 Hz |

The trade is not negotiable. Selectivity and speed are the same quantity seen in
two domains: a bandwidth of $BW$ rad/s corresponds to an envelope time constant
of $2/BW$ seconds, so the Q = 15 circuit that rejects a neighbouring station
cleanly also takes fifteen times as long to settle after a change. The transient
chapter's $\\zeta$ and this chapter's Q are the same parameter written twice:

$$Q = \\frac{1}{2\\zeta}$$

so $Q = 0.5$ is critical damping, $Q$ below 0.5 is overdamped, and every resonant
circuit worth the name is underdamped.

## 6.5 Worked example 5 — geometric mean, tested where it matters

A circuit's half-power frequencies are measured at 91.17 Hz and 138.92 Hz. Find
the resonant frequency and the quality factor.

$$f_0 = \\sqrt{f_1 f_2} = \\sqrt{91.17 \\times 138.92} = \\sqrt{12665} = 112.54\\ \\text{Hz}$$

$$BW = 138.92 - 91.17 = 47.75\\ \\text{Hz}, \\qquad Q = \\frac{112.54}{47.75} = 2.357$$

*The trap.* The arithmetic mean gives 115.04 Hz and a Q of 2.409 — both wrong by
about 2 %, which sounds negligible until you notice the exam offers both numbers
as choices. At Q = 10 the two means differ by 0.12 % and either would round to
the same answer; the questions that test this are always written at low Q, and
recognising a low-Q setup is the cue to use the geometric mean deliberately.

## 6.6 Loaded Q: the Q you get is not the Q you asked for

Everything so far assumed the resonant circuit is alone. It never is. A tuned
circuit feeds something, and whatever it feeds appears as an additional
resistance that dissipates energy — which is to say, it lowers Q and widens the
bandwidth. The distinction has names:

- **Unloaded Q**, written $Q_u$, is set by the circuit's own losses, in practice
  almost entirely the inductor's winding resistance.
- **Loaded Q**, written $Q_L$, includes the source and load resistances the tank
  actually sees.

For a parallel tank the resistances combine in parallel, so the effect is easy to
compute and easy to underestimate:

$$Q_L = R_{\\text{total}}\\sqrt{\\frac{C}{L}}, \\qquad \\frac{1}{R_{\\text{total}}} = \\frac{1}{R_{\\text{dyn}}} + \\frac{1}{R_{\\text{load}}}$$

A real inductor with winding resistance $R_w$ in series presents, at resonance, a
finite equivalent parallel resistance:

$$R_{\\text{dyn}} = \\frac{L}{R_w C} = Q_u^2 R_w$$

which is the number a tuned amplifier stage actually works into.

## 6.7 Worked example 6 — a practical tank, unloaded and loaded

A coil of 50 microhenry with 4 ohm of winding resistance is tuned by 200
picofarad. Find the resonant frequency, the unloaded Q, the dynamic resistance
and the unloaded bandwidth. Then load the tank with 25 kilohm and repeat.

$$\\omega_0 = \\frac{1}{\\sqrt{(50 \\times 10^{-6})(200 \\times 10^{-12})}} = \\frac{1}{\\sqrt{10^{-14}}} = 10^{7}\\ \\text{rad/s} \\;\\Rightarrow\\; f_0 = 1.592\\ \\text{MHz}$$

$$Q_u = \\frac{\\omega_0 L}{R_w} = \\frac{10^{7} \\times 50 \\times 10^{-6}}{4} = \\frac{500}{4} = 125$$

$$R_{\\text{dyn}} = \\frac{L}{R_w C} = \\frac{50 \\times 10^{-6}}{(4)(200 \\times 10^{-12})} = 62.5\\ \\text{k}\\Omega$$

which agrees with $Q_u^2 R_w = 125^2 \\times 4 = 62.5$ kilohm, as it must. The
unloaded bandwidth is $f_0/Q_u = 1.592 \\times 10^{6}/125 = $ **12.73 kHz**.

Now connect a 25 kilohm load across the tank:

$$R_{\\text{total}} = \\frac{62.5 \\times 25}{62.5 + 25} = 17.86\\ \\text{k}\\Omega, \\qquad Q_L = 17857\\sqrt{\\frac{200 \\times 10^{-12}}{50 \\times 10^{-6}}} = 17857 \\times 0.002 = 35.7$$

$$BW_L = \\frac{1.592 \\times 10^{6}}{35.7} = 44.56\\ \\text{kHz}$$

The load, which is larger than the tank's own dynamic resistance, has still cut Q
by a factor of 3.5 and widened the band by the same factor. That is the practical
message: a specification quoted as an unloaded Q is close to meaningless, and a
filter that measures beautifully on the bench will not do so once it drives
anything. The design fix is impedance transformation — a tapped coil or a
capacitive divider — which presents the load to the tank as a larger resistance
than it really is.`,
      examTip: 'Bandwidth is exactly f0/Q and exactly R/L in rad/s for a series circuit; the half-power FREQUENCIES are only approximately f0 ± BW/2. When a question gives you both edges, always recover f0 as their geometric mean.',
      importantNote: 'Adding a load resistance always lowers Q and widens the bandwidth, never the reverse. If a computed loaded Q comes out higher than the unloaded Q, a parallel combination has been done as a series one.',
    },
    {
      id: 'res-parallel-filters',
      title: '7. The Parallel Dual and What Resonance Is For',
      content: `Parallel resonance is not a second topic to learn. It is the same
analysis with admittance in place of impedance, and every statement about the
series circuit maps onto it by exchanging voltage for current, L for C, and
series for parallel. Doing the derivation once in the dual form makes the whole
set of parallel results free.

## 7.1 The dual, derived

The admittance of a parallel RLC is

$$Y(j\\omega) = \\frac{1}{R} + j\\omega C + \\frac{1}{j\\omega L} = \\frac{1}{R} + j\\left(\\omega C - \\frac{1}{\\omega L}\\right)$$

which is the series expression with $R \\to 1/R$, $L \\to C$ and $C \\to L$.
Setting the net susceptance to zero gives the same resonant frequency:

$$\\omega C = \\frac{1}{\\omega L} \\;\\Longrightarrow\\; \\omega_0 = \\frac{1}{\\sqrt{LC}}$$

Because the admittance is minimised there, the **impedance is maximised**:

$$\\lvert Z \\rvert_{\\max} = R \\quad \\text{at } \\omega_0$$

and the quality factor takes the reciprocal form:

$$Q = \\frac{R}{\\omega_0 L} = \\omega_0 R C = R\\sqrt{\\frac{C}{L}}, \\qquad BW = \\frac{\\omega_0}{Q} = \\frac{1}{RC}$$

Every one of those is the series formula turned upside down. Note the
consequence that catches people out: in a **series** circuit larger R means lower
Q, while in a **parallel** circuit larger R means **higher** Q. The same physical
statement covers both — Q rises when the loss element takes less energy out — but
the algebra looks opposite.

## 7.2 Worked example 7 — parallel resonance and current magnification

Put the familiar $L = 100$ mH and $C = 20$ microfarad in parallel with
$R = 2$ kilohm, and drive the combination from a 10 mA rms current source. Find
the resonant frequency, Q, bandwidth, terminal voltage and the branch currents.

$$f_0 = 112.54\\ \\text{Hz} \\quad \\text{(unchanged: it depends only on } L \\text{ and } C)$$

$$Q = R\\sqrt{\\frac{C}{L}} = 2000\\sqrt{\\frac{20 \\times 10^{-6}}{0.100}} = 2000 \\times 0.01414 = 28.28$$

$$BW = \\frac{f_0}{Q} = \\frac{112.54}{28.28} = 3.98\\ \\text{Hz}, \\qquad \\text{equivalently } \\frac{1}{RC} = \\frac{1}{(2000)(20 \\times 10^{-6})} = 25\\ \\text{rad/s}$$

![Impedance magnitude of a parallel RLC against frequency, rising to a 2 kilohm peak at 112.5 hertz and falling away on both sides, with the note that the quality factor of 28.3 gives a bandwidth of 3.98 hertz.](/courses/fe-ee/figures/ckt2-parallel-resonance.svg)

At resonance the tank looks like a plain 2 kilohm, so

$$V = IR = 0.010 \\times 2000 = 20\\ \\text{V}, \\qquad I_C = \\frac{V}{X_C} = \\frac{20}{70.71} = 0.283\\ \\text{A}$$

and $I_L$ is the same 0.283 A, 180 degrees out of phase. **The tank branches carry
28.3 times the current the source supplies** — the current-magnification dual of
the series circuit's voltage magnification — and that circulating current is
real, heats the coil, and sets the wire gauge. A 10 mA source feeding conductors
rated for 10 mA will fail here.

Compare the two circuits built from these same three components: in series
$Q = 2.357$ and $BW = 47.75$ Hz; in parallel with 2 kilohm, $Q = 28.28$ and
$BW = 3.98$ Hz. Same L, same C, same resonant frequency, twelve times the
selectivity, because the resistance moved from carrying the loop current to
shunting the tank.

## 7.3 One RLC, four filters

The reason resonance is on the syllabus at all is filtering, and a single series
RLC gives all four standard responses depending only on where the output is
taken:

| Output across | Response | Reason |
|---|---|---|
| R | band-pass | current peaks at $f_0$, so $V_R$ does |
| L | high-pass, second order | $X_L$ grows with frequency |
| C | low-pass, second order | $X_C$ shrinks with frequency |
| L and C together | band-stop (notch) | their series pair is zero at $f_0$ |

The band-pass case is the one Q describes directly: its gain is

$$\\lvert H(j\\omega) \\rvert = \\frac{1}{\\sqrt{1 + Q^2 \\left(\\dfrac{\\omega}{\\omega_0} - \\dfrac{\\omega_0}{\\omega}\\right)^2}}$$

which equals 1 at resonance and $1/\\sqrt{2}$ at the half-power edges by
construction. A decade either side of resonance, at $Q = 2.357$, this evaluates
to 0.0428 — about 27 dB of rejection, and symmetric in the logarithmic sense
rather than the linear one.

For the second-order low-pass taken across the capacitor, the damping that gives
the flattest passband is $\\zeta = 0.707$, i.e. $Q = 0.707$. Below that the
response peaks before it rolls off; above it the corner is soft. That single
value is why 0.707 appears both as the half-power amplitude ratio and as the
Butterworth damping ratio, and confusing the two is a common exam misstep — they
are numerically equal for unrelated reasons.

## 7.4 The first-order corner, and where 3 dB comes from

Not every filter is resonant. A single R and C give a first-order low-pass whose
transfer function and corner frequency are

$$H(j\\omega) = \\frac{1}{1 + j\\omega RC}, \\qquad \\lvert H \\rvert = \\frac{1}{\\sqrt{1 + (f/f_c)^2}}, \\qquad f_c = \\frac{1}{2\\pi RC}$$

At $f = f_c$ the magnitude is $1/\\sqrt{2}$, which in decibels is

$$20 \\log_{10}\\frac{1}{\\sqrt{2}} = -3.01\\ \\text{dB}$$

That is the origin of the "3 dB point" in every filter specification: it is not a
convention chosen for convenience, it is the frequency at which the output power
is exactly half.

![Magnitude response of a first-order RC low-pass in decibels, with the flat and minus twenty decibel per decade asymptotes crossing at the 995 hertz corner where the true response is 3.01 decibels down, and a marked point one decade higher at minus 20.04 decibels.](/courses/fe-ee/figures/ckt2-bode-rc.svg)

The two straight asymptotes — 0 dB below the corner and $-20$ dB per decade above
it — intersect exactly at $f_c$, where the true curve is 3.01 dB below them. One
decade past the corner the true value is $-20.04$ dB against the asymptote's
$-20$ dB, an error of 0.04 dB, which is why sketching Bode plots from asymptotes
is safe everywhere except within about an octave of the corner.

## 7.5 Worked example 8 — an RC corner, its roll-off and its phase

A 4.7 kilohm resistor feeds a 33 nanofarad capacitor to ground. Find the corner
frequency, the attenuation at 10 kHz in decibels, and the phase shift there.

$$f_c = \\frac{1}{2\\pi (4700)(33 \\times 10^{-9})} = \\frac{1}{2\\pi (1.551 \\times 10^{-4})} = 1026.14\\ \\text{Hz}$$

At 10 kHz the frequency ratio is $10000/1026.14 = 9.745$:

$$\\lvert H \\rvert = \\frac{1}{\\sqrt{1 + 9.745^2}} = \\frac{1}{9.796} = 0.1021 \\;\\Rightarrow\\; 20 \\log_{10}(0.1021) = -19.82\\ \\text{dB}$$

$$\\theta = -\\arctan (9.745) = -84.14^{\\circ}$$

The asymptotic estimate is worth comparing: 10 kHz is
$\\log_{10}(9.745) = 0.989$ decades past the corner, so the asymptote predicts
$-19.78$ dB. The 0.04 dB discrepancy is the same one the figure marks. Note also
the time-domain reading of the same component pair:
$\\tau = RC = 155$ microseconds, so this filter would take about
$5\\tau = 0.78$ ms to settle after a step — the identical circuit described in the
identical way, in the other domain.`,
      examTip: 'For a parallel resonant circuit Q = R·sqrt(C/L) and BW = 1/(RC); for a series one Q = (1/R)·sqrt(L/C) and BW = R/L. If you cannot recall which, check the limiting case: an ideal parallel tank with R infinite must have infinite Q.',
      importantNote: 'The 0.707 that appears as the half-power amplitude ratio and the 0.707 that appears as the maximally flat damping ratio are numerically equal for unrelated reasons. Do not use one to justify the other.',
    },
    {
      id: 'res-pset-a',
      title: '8. Problem Set A — Series Resonance, Q and Bandwidth',
      content: `Six problems at FE pace. Each should take about three minutes with a
calculator, and each is built around one specific error. Work them all before
looking at the solutions.

## 8.1 Problem Set A — the problems

**A1.** A series circuit has L = 2 mH and C = 5 nanofarad. What is its resonant
frequency in hertz?

**A2.** A series RLC circuit with R = 8 ohm, L = 40 mH and C = 10 microfarad is
driven by 20 V rms. At resonance, find the current, the capacitor voltage, the
quality factor and the bandwidth in hertz.

**A3.** A resonant circuit's half-power frequencies are measured at 1.80 kHz and
2.20 kHz. Find the resonant frequency and the quality factor.

**A4.** A series resonant circuit is centred at 1.000 MHz with Q = 80. Find the
bandwidth and both half-power frequencies, exactly.

**A5.** Design a series resonant circuit centred at 100 kHz with a 4 kHz
bandwidth using a 250 microhenry inductor. Find C, Q and the total series
resistance.

**A6.** For the circuit of A2, at what two frequencies does the impedance
magnitude reach twice its minimum value?

## 8.2 Problem Set A — answers, worked in full

**A1 — 50.3 kHz.**

$$\\omega_0 = \\frac{1}{\\sqrt{(2 \\times 10^{-3})(5 \\times 10^{-9})}} = \\frac{1}{\\sqrt{10^{-11}}} = 3.162 \\times 10^{5}\\ \\text{rad/s}$$

$$f_0 = \\frac{3.162 \\times 10^{5}}{2\\pi} = 50.3\\ \\text{kHz}$$

*The trap.* Quoting 316 227 as the answer answers a question about
$\\omega_0$ that was not asked. Read the units demanded before dividing by
$2\\pi$, and note that the two answers differ by a factor of 6.28 — large enough
that both appear among the choices.

**A2 — 2.5 A, 158 V, Q = 7.91, BW = 31.8 Hz.**

$$\\omega_0 = \\frac{1}{\\sqrt{(0.040)(10^{-5})}} = \\frac{1}{\\sqrt{4 \\times 10^{-7}}} = 1581\\ \\text{rad/s} \\;\\Rightarrow\\; f_0 = 251.6\\ \\text{Hz}$$

At resonance $\\lvert Z \\rvert = R$, so $I = 20/8 = 2.5$ A. The capacitive
reactance is $X_C = 1/(1581 \\times 10^{-5}) = 63.25$ ohm, so

$$V_C = 2.5 \\times 63.25 = 158.1\\ \\text{V}, \\qquad Q = \\frac{\\omega_0 L}{R} = \\frac{1581 \\times 0.040}{8} = 7.91$$

$$BW = \\frac{R}{L} = \\frac{8}{0.040} = 200\\ \\text{rad/s} = 31.8\\ \\text{Hz}$$

*The trap.* Answering 20 V for the capacitor voltage. The reactive voltages are
Q times the source, here 7.91 times, and the check is that
$V_C = Q V_s = 7.91 \\times 20 = 158$ V agrees with the Ohm's law route. The
second trap is quoting the bandwidth as 200 without units when the question asks
for hertz.

**A3 — 1990 Hz and Q = 4.97.** The resonant frequency is the geometric mean:

$$f_0 = \\sqrt{1800 \\times 2200} = \\sqrt{3.96 \\times 10^{6}} = 1990\\ \\text{Hz}$$

$$BW = 2200 - 1800 = 400\\ \\text{Hz}, \\qquad Q = \\frac{1990}{400} = 4.97$$

*The trap.* The arithmetic mean gives exactly 2000 Hz and a Q of 5.00, and both
are offered. They are wrong by 0.5 %, which is small but deliberate: the
question is testing whether you know which mean applies, and it chose numbers
where the wrong answer looks suspiciously round.

**A4 — 12.5 kHz, 993.77 kHz and 1006.27 kHz.**

$$BW = \\frac{f_0}{Q} = \\frac{10^{6}}{80} = 12.5\\ \\text{kHz}$$

$$f_{1,2} = f_0\\left[\\sqrt{1 + \\frac{1}{4(6400)}} \\mp \\frac{1}{160}\\right] = 10^{6}\\left[1.0000195 \\mp 0.00625\\right]$$

$$f_1 = 993.770\\ \\text{kHz}, \\qquad f_2 = 1006.270\\ \\text{kHz}$$

*The observation, not a trap.* At Q = 80 the exact and approximate edges differ
by only 19.5 Hz in a million, so $f_0 \\pm BW/2$ is entirely adequate here. The
point of working it exactly is to see that the radical correction scales as
$1/Q^2$: it is 0.002 % at Q = 80 and 2.2 % at Q = 2.36.

**A5 — 10.13 nF, Q = 25, R = 6.28 ohm.**

$$\\omega_0 = 2\\pi (10^{5}) = 6.283 \\times 10^{5}\\ \\text{rad/s}, \\qquad C = \\frac{1}{\\omega_0^2 L} = \\frac{1}{(6.283 \\times 10^{5})^2 (250 \\times 10^{-6})}$$

$$C = \\frac{1}{(3.948 \\times 10^{11})(2.5 \\times 10^{-4})} = \\frac{1}{9.870 \\times 10^{7}} = 10.13\\ \\text{nF}$$

$$Q = \\frac{f_0}{BW} = \\frac{100}{4} = 25, \\qquad R = \\frac{\\omega_0 L}{Q} = \\frac{(6.283 \\times 10^{5})(2.5 \\times 10^{-4})}{25} = \\frac{157.1}{25} = 6.28\\ \\Omega$$

*The trap, and the engineering point.* That 6.28 ohm is the **total** loop
resistance, winding included. If the coil alone measures 10 ohm the specification
is unreachable: Q would cap at $157.1/10 = 15.7$ and the bandwidth would not go
below 6.4 kHz. Answering "add a 6.28 ohm resistor" without checking the coil is
the difference between a calculation and a design.

**A6 — 226 Hz and 281 Hz.** Twice the minimum impedance means
$\\lvert Z \\rvert = 2R = 16$ ohm, so the net reactance must satisfy

$$\\lvert X \\rvert = \\sqrt{(2R)^2 - R^2} = R\\sqrt{3} = 8\\sqrt{3} = 13.86\\ \\Omega$$

Solving $\\omega L - 1/(\\omega C) = \\pm 13.86$ as before, with
$X/L = 346.4$ and $4/(LC) = 10^{7}$:

$$\\omega = \\frac{\\pm 346.4 + \\sqrt{346.4^2 + 10^{7}}}{2} = \\frac{\\pm 346.4 + 3181}{2}$$

giving 1417 and 1764 rad/s, i.e. **225.6 Hz and 280.7 Hz**.

*The trap.* Doubling the impedance is **not** the half-power condition — that one
needs $\\lvert Z \\rvert = R\\sqrt{2}$, giving edges at 236 and 268 Hz. Reaching
for the bandwidth formula produces those instead, and both appear as choices.
Note also that the two answers span 346.4 rad/s, which is $\\sqrt{3}$ times the
bandwidth $R/L = 200$ — the width of any constant-magnitude band scales with the
reactance it demands.`,
      examTip: 'Compute f0 first, then check that X_L and X_C really are equal there. If they are not, the usual cause is microfarads left as whole numbers instead of converted to farads - which changes the answer by a factor of a thousand, not a few percent.',
    },
    {
      id: 'res-pset-b',
      title: '9. Problem Set B — Parallel Resonance, Loading and Filters',
      content: `The second set covers the parallel dual, practical tanks with coil
resistance, loaded Q, and the first-order filter arithmetic that shares the
same vocabulary. The dominant trap throughout is using a series formula on a
parallel circuit.

## 9.1 Problem Set B — the problems

**B1.** A parallel RLC circuit has R = 10 kilohm, L = 25 mH and C = 100
nanofarad. Find the resonant frequency, the quality factor and the bandwidth.

**B2.** A coil of 50 microhenry with 4 ohm winding resistance is tuned by 200
picofarad. Find the resonant frequency, the coil Q and the dynamic resistance of
the tank.

**B3.** The tank of B2 is loaded by 25 kilohm. Find the loaded Q and the loaded
bandwidth, and state the factor by which the bandwidth changed.

**B4.** A 4.7 kilohm resistor feeds a 33 nanofarad capacitor to ground. Find the
corner frequency and the attenuation, in decibels, at 10 kHz.

**B5.** Using the components of B1 in **series** instead of in parallel, find the
bandwidth. Compare it with the parallel answer.

**B6.** A 3.00 MHz resonator stores 12.0 microjoule and dissipates 40.0 mW. Find
its quality factor and its bandwidth.

## 9.2 Problem Set B — answers, worked in full

**B1 — 3183 Hz, Q = 20, BW = 159 Hz.**

$$\\omega_0 = \\frac{1}{\\sqrt{(0.025)(10^{-7})}} = \\frac{1}{\\sqrt{2.5 \\times 10^{-9}}} = 20000\\ \\text{rad/s} \\;\\Rightarrow\\; f_0 = 3183\\ \\text{Hz}$$

$$Q = R\\sqrt{\\frac{C}{L}} = 10^{4}\\sqrt{\\frac{10^{-7}}{0.025}} = 10^{4}\\sqrt{4 \\times 10^{-6}} = 10^{4}(0.002) = 20$$

$$BW = \\frac{f_0}{Q} = \\frac{3183}{20} = 159\\ \\text{Hz}, \\qquad \\text{check: } \\frac{1}{RC} = \\frac{1}{(10^{4})(10^{-7})} = 1000\\ \\text{rad/s} = 159\\ \\text{Hz}$$

*The trap.* Using the series form $Q = \\omega_0 L/R$ gives
$20000 \\times 0.025/10^{4} = 0.05$, four hundred times too small, and a
"bandwidth" of 63.7 kHz. The two Q formulas are reciprocals of each other in R,
so the error is never small.

**B2 — 1.592 MHz, Q = 125, 62.5 kilohm.**

$$\\omega_0 = \\frac{1}{\\sqrt{(50 \\times 10^{-6})(200 \\times 10^{-12})}} = 10^{7}\\ \\text{rad/s} \\;\\Rightarrow\\; f_0 = 1.592\\ \\text{MHz}$$

$$Q_u = \\frac{\\omega_0 L}{R_w} = \\frac{500}{4} = 125, \\qquad R_{\\text{dyn}} = \\frac{L}{R_w C} = \\frac{50 \\times 10^{-6}}{8 \\times 10^{-10}} = 62.5\\ \\text{k}\\Omega$$

*The trap.* Answering "infinite" for the impedance of a parallel LC at
resonance. It is infinite only for lossless components; the winding resistance
transforms into a finite $Q_u^2 R_w = 125^2 \\times 4 = 62.5$ kilohm, and that
number, not infinity, sets the gain of anything the tank drives. Note the coil Q
here is computed with the **series** formula, because the winding resistance is
genuinely in series with the coil.

**B3 — Q = 35.7, BW = 44.6 kHz, 3.5 times wider.**

$$R_{\\text{total}} = 62.5\\ \\text{k}\\Omega \\parallel 25\\ \\text{k}\\Omega = \\frac{62.5 \\times 25}{87.5} = 17.86\\ \\text{k}\\Omega$$

$$Q_L = R_{\\text{total}}\\sqrt{\\frac{C}{L}} = 17857 \\times 0.002 = 35.7, \\qquad BW_L = \\frac{1.592 \\times 10^{6}}{35.7} = 44.6\\ \\text{kHz}$$

Against the unloaded 12.73 kHz, the band is **3.5 times wider**, the same factor
by which Q fell.

*The trap.* Averaging the two Q values, or adding the two resistances in series,
both give answers near 44 kilohm and a Q around 88 — an "improvement" that is
physically impossible. Loading a resonator can only remove energy, so
$Q_L < Q_u$ always. If your loaded Q exceeds the unloaded one, the parallel
combination was done wrong.

**B4 — 1026 Hz and $-19.8$ dB.**

$$f_c = \\frac{1}{2\\pi RC} = \\frac{1}{2\\pi (4700)(33 \\times 10^{-9})} = 1026.14\\ \\text{Hz}$$

$$\\lvert H \\rvert = \\frac{1}{\\sqrt{1 + (10000/1026.14)^2}} = \\frac{1}{\\sqrt{1 + 94.97}} = 0.1021 \\;\\Rightarrow\\; -19.8\\ \\text{dB}$$

*The trap.* Using $-20$ dB per decade from the corner without checking the
distance gives $-20.0$ dB, which happens to be within 0.2 dB here because 10 kHz
is 0.989 decades up. The asymptote is a good tool and a bad habit: within an
octave of the corner it is off by up to 3 dB.

**B5 — 400 000 rad/s, against 1000 rad/s.** In series,

$$BW = \\frac{R}{L} = \\frac{10^{4}}{0.025} = 4 \\times 10^{5}\\ \\text{rad/s} = 63.7\\ \\text{kHz}$$

against the parallel circuit's 1000 rad/s, or 159 Hz — **four hundred times
wider** from the same three components. The corresponding series Q is 0.05, which
is below 0.5 and therefore not resonant at all in any useful sense; it is an
overdamped circuit with no peak.

*The lesson.* A 10 kilohm resistance is enormous in series with a 500 ohm
reactance and negligible in parallel with it. Q is always a comparison between
the resistance and the reactance at resonance, and which way the comparison runs
depends entirely on the topology.

**B6 — Q = 5655, BW = 531 Hz.** Use the energy definition in its per-radian
form, which is the version that avoids a factor of $2\\pi$:

$$Q = \\frac{\\omega_0 W_{\\text{stored}}}{P_{\\text{dissipated}}} = \\frac{2\\pi (3.00 \\times 10^{6})(12.0 \\times 10^{-6})}{0.0400} = \\frac{226.2}{0.0400} = 5655$$

$$BW = \\frac{f_0}{Q} = \\frac{3.00 \\times 10^{6}}{5655} = 531\\ \\text{Hz}$$

*The trap.* Dropping the $2\\pi$ gives 900, and the "energy per cycle" form
misapplied gives $2\\pi \\times 12/40 \\times 10^{-3}$ with the wrong units
entirely. The two correct statements are
$Q = 2\\pi W/W_{\\text{cycle}}$ and $Q = \\omega_0 W/P$; they are the same because
$W_{\\text{cycle}} = P/f_0$. A resonator of this Q rings for about
$Q/\\pi \\approx 1800$ cycles before its amplitude falls to a tenth, which is what
makes crystal references useful.`,
      examTip: 'Before choosing a Q formula, look at where the resistance is. Resistance in the loop is a series problem, Q = (1/R)sqrt(L/C); resistance across the tank is a parallel problem, Q = R·sqrt(C/L). The two answers differ by a factor of Q squared.',
      importantNote: 'Loading a resonant circuit can only lower Q and widen bandwidth. A loaded Q higher than the unloaded Q is arithmetically impossible and always means the parallel resistance combination was computed as a series one.',
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
tan φ = √3 ($W_{1}$ − $W_{2}$)/($W_{1}$ + $W_{2}$), where $W_{1}$ is the **larger** of the two
readings for a lagging load — which is why the two-wattmeter method survives
in practice long after digital meters could have replaced it. Section 7.4
derives that expression and shows why the labelling matters.`,
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

$$S = \\sqrt{3} V_L I_L = 1.73205 \\times 480 \\times 30 = 24{,}941.5\\ \\mathrm{VA}$$
$$P = S\\cos \\phi = 24{,}941.5 \\times 0.85 = 21{,}200\\ \\mathrm{W}$$
$$Q = S\\sin \\phi = 24{,}941.5 \\times 0.52678 = 13{,}139\\ \\mathrm{VAR}$$

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
    {
      id: '3ph-sqrt3',
      title: '5. Where the Root Three Comes From, and the 30 Degrees With It',
      content: `## 5.1 The three voltages, written down properly

Every result in this chapter is a consequence of three sinusoids of equal
amplitude spaced one third of a cycle apart. With $V_{m}$ the peak of each phase
voltage and the neutral node as the reference, an **abc** (positive) sequence
source produces

$$v_{an}(t) = V_{m}\\cos \\omega t, \\qquad v_{bn}(t) = V_{m}\\cos (\\omega t - 120^\\circ), \\qquad v_{cn}(t) = V_{m}\\cos (\\omega t + 120^\\circ)$$

The claim that these sum to zero is not an approximation and not a consequence
of balance in the load — it is trigonometry, true at every instant:

$$\\cos \\theta + \\cos (\\theta - 120^\\circ) + \\cos (\\theta + 120^\\circ) = \\cos \\theta + 2\\cos \\theta \\cos 120^\\circ = \\cos \\theta - \\cos \\theta = 0$$

That single line is worth more than the four rows of the table in Section 1.2,
because everything else — the missing neutral current, the constant power, the
√3 — descends from it.

## 5.2 The line voltage, derived rather than asserted

A line voltage is a **difference** of two phase voltages, because the two line
conductors are the two terminals you connect a voltmeter to:

$$v_{ab}(t) = v_{an}(t) - v_{bn}(t) = V_{m}\\left[\\cos \\omega t - \\cos (\\omega t - 120^\\circ)\\right]$$

Apply the identity $\\cos A - \\cos B = -2\\sin \\frac{A+B}{2}\\sin \\frac{A-B}{2}$ with
$A = \\omega t$ and $B = \\omega t - 120^\\circ$:

$$v_{ab}(t) = -2V_{m}\\sin (\\omega t - 60^\\circ)\\sin (60^\\circ) = -\\sqrt{3}\\,V_{m}\\sin (\\omega t - 60^\\circ) = \\sqrt{3}\\,V_{m}\\cos (\\omega t + 30^\\circ)$$

Two facts fall out of one line of algebra. The line voltage is **√3 times
larger**, and it **leads by 30°**. The √3 is not a fudge factor from a table; it
is $2\\sin 60^\\circ$, and the 30° is exactly half of the 120° spacing.

![Three phase voltages of 169.7 volt peak spaced 120 degrees apart, with the line voltage v_ab formed as v_an minus v_bn drawn over them. The line voltage peaks at 293.9 volts, root three times higher, and reaches that peak 30 degrees earlier than v_an does.](/courses/fe-ee/figures/ckt2-3ph-waveforms.svg)

The figure plots exactly that for a 120 V (rms) phase voltage. The peak of each
phase voltage is $120\\sqrt{2} = 169.71$ V; the peak of the line voltage is
$\\sqrt{3}\\times 169.71 = 293.94$ V, whose rms value is
$120\\sqrt{3} = 207.85$ V — the "208 V" stamped on every commercial panel in
North America. Read the horizontal axis as well as the vertical one: the heavy
line-voltage curve crests at −30°, thirty degrees **before** $v_{an}$ does, which
is what a phasor angle of +30° means once you put it back on a time axis.

## 5.3 The same result as one isosceles triangle

Phasors get there faster. Place $V_{an} = 120\\angle 0^\\circ$ and
$V_{bn} = 120\\angle -120^\\circ$. Then $-V_{bn}$ points at +60°, and adding it
head-to-tail to $V_{an}$ builds an isosceles triangle whose two equal sides are
$V_{ph}$ and whose apex angle is 60°:

$$\\lvert V_{ab}\\rvert = 2 V_{ph}\\cos 30^\\circ = \\sqrt{3}\\,V_{ph} = 207.85\\ \\mathrm{V}, \\qquad \\angle V_{ab} = +30^\\circ$$

![Phasor diagram of a wye source. Three 120 volt phase voltages radiate at 0, minus 120 and plus 120 degrees, and the line voltage V_ab is drawn as the resultant of V_an and minus V_bn placed head to tail, reaching 207.85 volts at plus 30 degrees.](/courses/fe-ee/figures/ckt2-3ph-phasors.svg)

The full set for a 208 V system, which is worth being able to write from memory
because half of the traps in this topic are angle traps rather than magnitude
traps:

| Phase voltages (line-to-neutral) | Line voltages (line-to-line) |
|---|---|
| $V_{an} = 120.1\\angle 0^\\circ$ | $V_{ab} = 208\\angle 30^\\circ$ |
| $V_{bn} = 120.1\\angle -120^\\circ$ | $V_{bc} = 208\\angle -90^\\circ$ |
| $V_{cn} = 120.1\\angle 120^\\circ$ | $V_{ca} = 208\\angle 150^\\circ$ |

The three line voltages are themselves a balanced set: equal magnitudes, 120°
apart, and they sum to zero for the same reason the phase voltages do.

### Worked example 5.1 — the six voltages of a 480 V system

*A 480 V, three-phase, four-wire wye source is labelled abc. Write all six
voltages in polar form, taking $V_{an}$ as the reference.*

The nameplate voltage of a three-phase system is always **line-to-line**, so
480 V is $V_{L}$ and

$$V_{ph} = \\frac{480}{\\sqrt{3}} = 277.13\\ \\mathrm{V}$$

$$V_{an} = 277.1\\angle 0^\\circ, \\quad V_{bn} = 277.1\\angle -120^\\circ, \\quad V_{cn} = 277.1\\angle 120^\\circ$$

$$V_{ab} = 480\\angle 30^\\circ, \\quad V_{bc} = 480\\angle -90^\\circ, \\quad V_{ca} = 480\\angle 150^\\circ$$

This is the ubiquitous **480/277 V** commercial service: motors and large
equipment take 480 V between lines, and fluorescent and LED lighting ballasts
take 277 V between one line and neutral. If a problem hands you "277 V", it has
already given you a phase voltage and multiplying by √3 again is the error the
distractor is waiting for.

## 5.4 The delta relation, from KCL at one corner

Delta has no neutral, so its √3 has to come from somewhere else — and it comes
from Kirchhoff's current law at a terminal where two windings meet. Current
arriving on line *a* splits between the *ab* and *ca* branches:

$$I_{a} = I_{ab} - I_{ca}$$

With balanced phase currents $I_{ab} = I_{ph}\\angle 0^\\circ$ and
$I_{ca} = I_{ph}\\angle 120^\\circ$, that difference is structurally the same
subtraction as Section 5.2:

$$I_{a} = I_{ph}\\left(1\\angle 0^\\circ - 1\\angle 120^\\circ\\right) = \\sqrt{3}\\,I_{ph}\\angle -30^\\circ$$

![Phasor construction showing that a line quantity is root three times a phase quantity and displaced by 30 degrees, drawn for a balanced set.](/courses/fe-ee/figures/pow2-3ph-phasor-sqrt3.svg)

Note the sign of the 30° carefully, because this is the detail that separates a
memorised rule from an understood one:

| Connection | √3 appears on | Angle relation (abc sequence) |
|---|---|---|
| Wye | voltage: $V_{L} = \\sqrt{3}V_{ph}$ | line voltage **leads** phase voltage by 30° |
| Delta | current: $I_{L} = \\sqrt{3}I_{ph}$ | line current **lags** phase current by 30° |

Both come from subtracting two members of a balanced set. Which member you
subtract decides the sign, and the two connections happen to subtract in
opposite senses.

### Worked example 5.2 — recovering delta phase currents from a clamp meter

*A clamp meter on line a of a balanced delta-connected heater bank reads 52 A,
and a phase-angle meter puts it at $-25^\\circ$ relative to $V_{an}$. What current
flows in each heater element?*

A clamp meter can only ever read a **line** current, because the delta windings
are inside the machine. Invert the relation just derived:

$$I_{ab} = \\frac{I_{a}}{\\sqrt{3}\\angle -30^\\circ} = \\frac{52\\angle -25^\\circ}{1.732\\angle -30^\\circ} = 30.02\\angle 5^\\circ\\ \\mathrm{A}$$

Each element carries **30.0 A**, not 52 A. Sizing the element for the clamp
reading over-specifies it by 73 percent; sizing the supply conductor for 30 A
under-specifies it by the same factor and is the dangerous direction of the
same mistake.

## 5.5 Phase sequence, and the one thing it changes

Reverse any two of the three connections and the source becomes **acb**
(negative) sequence: $V_{an} = V_{ph}\\angle 0^\\circ$,
$V_{bn} = V_{ph}\\angle 120^\\circ$, $V_{cn} = V_{ph}\\angle -120^\\circ$. All the
magnitude relations survive untouched — the √3 is still √3 — but every 30°
reverses direction, and every induction motor on the system runs backwards.

$$V_{ab} = V_{an} - V_{bn} = V_{ph}\\left(1\\angle 0^\\circ - 1\\angle 120^\\circ\\right) = \\sqrt{3}\\,V_{ph}\\angle -30^\\circ$$

### Worked example 5.3 — reading the sequence off a meter

*A recorder logs $V_{an} = 277\\angle 0^\\circ$, $V_{bn} = 277\\angle 120^\\circ$ and
$V_{cn} = 277\\angle -120^\\circ$. Find $V_{ab}$ and state the sequence.*

$$V_{ab} = 277\\left[1 - \\left(-0.5 + j0.866\\right)\\right] = 277\\left(1.5 - j0.866\\right) = 480\\angle -30^\\circ\\ \\mathrm{V}$$

The magnitude is the familiar 480 V, but the angle is **−30°**, so this is an
**acb** sequence and the line voltage lags. On the exam this shows up as a
question in which every magnitude choice is 480 V and the four options differ
only in angle; the magnitude relations cannot discriminate, and the sequence
is the whole question.`,
      examTip: 'Derive the √3 rather than recalling it: it is 2 sin 60°, which is what you get when you subtract two equal phasors that are 120° apart. That derivation also hands you the 30°, which is the half of the relation that memorised tables usually omit and that angle-based distractors exploit.',
      importantNote: 'A three-phase nameplate voltage is line-to-line unless the problem explicitly says otherwise. 208 V, 480 V, 4.16 kV and 13.8 kV are all line-to-line figures; their line-to-neutral partners are 120 V, 277 V, 2.40 kV and 7.97 kV. Applying √3 to a number that is already a line voltage is the single most common three-phase arithmetic error.',
    },
    {
      id: '3ph-perphase-technique',
      title: '6. The Per-Phase Equivalent as a Working Technique',
      content: `## 6.1 The recipe, with the feeder included

Section 1.6 named the per-phase equivalent; this section uses it on problems
that cannot be done in the head, which is where its value actually lies. The
procedure never varies:

1. Convert every delta element to its wye equivalent, $Z_{Y} = Z_{\\Delta}/3$.
2. Draw **one** phase: a source of $V_{L}/\\sqrt{3}$ at $0^\\circ$, the feeder
   impedance of one conductor, the load impedance of one phase, and a return
   through an ideal neutral.
3. Solve it as an ordinary single-phase AC circuit.
4. Multiply powers by three; rotate the other two phases by $\\mp 120^\\circ$.

Step 2 contains the step people skip. The per-phase circuit uses the impedance
of **one conductor**, not of a loop of two, because the neutral of a balanced
system carries no current and therefore drops no voltage. There is no
"return-conductor" impedance to add, which is precisely the simplification a
single-phase two-wire calculation does not get to make.

### Worked example 6.1 — a wye load at the end of a real feeder

*A 480 V, 60 Hz, balanced source feeds a wye-connected load of
$8 + j6\\ \\Omega$ per phase through a feeder of $0.3 + j0.6\\ \\Omega$ per
conductor. Find the line current, the voltage at the load, the power delivered,
the feeder loss and the efficiency.*

Per phase, the source is $277.13\\angle 0^\\circ$ V and the two impedances are in
series:

$$Z_{total} = (0.3 + j0.6) + (8 + j6) = 8.3 + j6.6\\ \\Omega = 10.604\\angle 38.49^\\circ\\ \\Omega$$

$$I_{a} = \\frac{277.13\\angle 0^\\circ}{10.604\\angle 38.49^\\circ} = 26.13\\angle -38.49^\\circ\\ \\mathrm{A}$$

In wye that current is both the phase current and the line current, so all three
lines carry 26.13 A. The load voltage follows from the load impedance alone:

$$V_{load,ph} = I_{a}Z_{load} = (26.13)(10.0) = 261.34\\ \\mathrm{V} \\;\\Rightarrow\\; V_{load,LL} = \\sqrt{3}(261.34) = 452.6\\ \\mathrm{V}$$

$$P_{load} = 3I^{2}R_{load} = 3(26.13)^{2}(8) = 16{,}391\\ \\mathrm{W} = 16.39\\ \\mathrm{kW}$$

$$P_{loss} = 3I^{2}R_{line} = 3(26.13)^{2}(0.3) = 614.7\\ \\mathrm{W}, \\qquad \\eta = \\frac{16{,}391}{17{,}006} = 96.4\\%$$

Two checks are worth the ten seconds each. First, the line-quantity formula must
agree: $\\sqrt{3}(452.6)(26.13)(0.8) = 16{,}391$ W, using the **load** power
factor of $8/10 = 0.8$, not the 0.783 seen at the source. Second, the voltage
regulation is $(480 - 452.6)/452.6 = 6.0$ percent, which is a believable feeder
drop; a computed drop of 20 percent or of 0.2 percent would mean the feeder
impedance had been applied three times or not at all.

### Worked example 6.2 — the same feeder, a delta load

*Replace that load with a delta of $24 + j18\\ \\Omega$ per phase, everything else
unchanged. Find the line current and the power.*

The delta cannot go into a per-phase circuit until it is a wye:

$$Z_{Y} = \\frac{Z_{\\Delta}}{3} = \\frac{24 + j18}{3} = 8 + j6\\ \\Omega$$

which is the load of Worked example 6.1 exactly. The line current is therefore
the same **26.13 A at −38.49°**, the load line voltage is the same **452.6 V**,
and the power is the same **16.39 kW**. What differs is what happens *inside*
the load:

$$I_{ph,\\Delta} = \\frac{I_{L}}{\\sqrt{3}} = \\frac{26.13}{1.732} = 15.09\\ \\mathrm{A}, \\qquad V_{ph,\\Delta} = V_{LL} = 452.6\\ \\mathrm{V}$$

Confirm the power from those numbers alone:
$3(15.09)^{2}(24) = 16{,}390$ W. The lesson is that $Z_{\\Delta} = 3Z_{Y}$ makes
two physically different loads indistinguishable **from the terminals**, which
is exactly the property that makes the conversion legal.

## 6.2 Why the power is constant, and single-phase power is not

Take one phase of a balanced load with the current lagging the voltage by θ.
Instantaneous power is a product of two cosines, which a product identity turns
into a constant plus a double-frequency term:

$$p_{a}(t) = 2V I\\cos (\\omega t)\\cos (\\omega t - \\theta) = V I\\left[\\cos \\theta + \\cos (2\\omega t - \\theta)\\right]$$

The other two phases are the same expression shifted by $\\mp 120^\\circ$, and
because the ripple term runs at **twice** frequency, those shifts become
$\\mp 240^\\circ$ in the ripple — still a balanced set of three, and still summing
to zero:

$$p(t) = p_{a} + p_{b} + p_{c} = 3VI\\cos \\theta + VI\\left[\\cos (2\\omega t - \\theta) + \\cos (2\\omega t - \\theta - 240^\\circ) + \\cos (2\\omega t - \\theta + 240^\\circ)\\right] = 3VI\\cos \\theta$$

![Instantaneous power of each phase of a balanced three-phase load and of the three together, normalised to the product of rms voltage and current. Each phase pulses at twice line frequency and dips below zero, while their sum is a dead flat line at three times the power factor, here 2.40.](/courses/fe-ee/figures/ckt2-3ph-power-constant.svg)

The figure is that algebra plotted for a power factor of 0.8
($\\theta = 36.87^\\circ$). Each phase swings between roughly $-0.2$ and $+1.8$
times $VI$ and even goes momentarily negative — energy flowing back to the
source out of the load's inductance. The sum sits at exactly
$3\\cos \\theta = 2.40$ with zero ripple, and that flat line is a mechanical fact
as much as an electrical one: a three-phase motor develops constant torque,
which is why it needs no starting winding, produces no 120 Hz vibration, and can
be built smaller than a single-phase machine of the same rating.

## 6.3 Copper economy, derived

The third standard argument for three phases is metal. Compare a single-phase
two-wire system with a three-phase three-wire system carrying the **same power**,
over the **same distance**, at the **same line-to-line voltage**, with the
**same total resistive loss**.

$$I_{1\\phi} = \\frac{P}{V}, \\qquad I_{3\\phi} = \\frac{P}{\\sqrt{3}V} = \\frac{I_{1\\phi}}{\\sqrt{3}}$$

Equal loss fixes the conductor resistances against each other:

$$2I_{1\\phi}^{2}R_{1} = 3\\left(\\frac{I_{1\\phi}}{\\sqrt{3}}\\right)^{2}R_{3} = I_{1\\phi}^{2}R_{3} \\;\\Rightarrow\\; R_{3} = 2R_{1}$$

Conductor volume for a fixed length goes as the cross-section, which goes as the
reciprocal of resistance, so the metal ratio is the number of conductors divided
by their resistance:

$$\\frac{\\text{metal}_{3\\phi}}{\\text{metal}_{1\\phi}} = \\frac{3/R_{3}}{2/R_{1}} = \\frac{3/(2R_{1})}{2/R_{1}} = \\frac{3}{4} = 75\\%$$

![Conductor metal needed by four wiring systems to deliver the same power over the same distance at the same line-to-line voltage and the same total resistive loss, as a percentage of the single-phase two-wire case. Three-phase three-wire needs 75.0 percent, three-phase four-wire with a half-size neutral 87.5 percent, and three-phase four-wire with a full-size neutral exactly 100 percent.](/courses/fe-ee/figures/pow2-3ph-copper-economy.svg)

The 75 percent figure quoted in Section 4.2 is therefore exact, not a rule of
thumb — but it is exact **only for three wires**. The figure shows what the
neutral costs: a half-size neutral takes the system to 87.5 percent and a
full-size neutral to exactly 100 percent, at which point three-phase has no
copper advantage left at all. That is the real reason distribution engineers
resist full-size neutrals, and the reason Section 7.3's harmonic loads, which
force full-size neutrals, are expensive as well as inconvenient.

### Worked example 6.3 — wye-delta starting, with numbers

*A motor presents $4 + j3\\ \\Omega$ per phase and is normally run delta-connected
on a 480 V supply. Find the line current and power when it is started in delta,
and again when it is started in wye.*

Delta, with each winding across the full 480 V:

$$I_{ph} = \\frac{480}{5.0} = 96.0\\ \\mathrm{A}, \\qquad I_{L} = \\sqrt{3}(96.0) = 166.3\\ \\mathrm{A}, \\qquad P = 3(96.0)^{2}(4) = 110.6\\ \\mathrm{kW}$$

Wye, with each winding across only $480/\\sqrt{3} = 277.1$ V:

$$I_{L} = I_{ph} = \\frac{277.13}{5.0} = 55.43\\ \\mathrm{A}, \\qquad P = 3(55.43)^{2}(4) = 36.86\\ \\mathrm{kW}$$

The ratios are exactly 3 in both current and power:
$166.3/55.43 = 3.00$ and $110.6/36.86 = 3.00$. A starter that closes the windings
in wye therefore draws one third of the inrush **and** develops one third of the
torque, since induction motor torque tracks the square of applied voltage and
$(1/\\sqrt{3})^{2} = 1/3$. Wye-delta starting is a trade at a fixed exchange rate,
not a free reduction, and a question that offers "one third the current at full
torque" is offering the impossible.`,
      examTip: 'In the per-phase circuit use the impedance of ONE conductor, and take the source as V_L/√3 at 0°. Do not add a return-path impedance — the balanced neutral carries no current — and do not divide the load impedance by three unless it was given as a delta.',
      importantNote: 'Power factor belongs to a specific pair of terminals. In Worked example 6.1 the load power factor is 0.800 and the power factor seen by the source is 0.783, because the feeder adds reactance. When a problem says "power factor" without qualification it means at the load, but any efficiency or regulation question needs both.',
    },
    {
      id: '3ph-unbalance-measurement',
      title: '7. Unbalance, the Neutral, and What Two Wattmeters Read',
      content: `## 7.1 The four-wire wye: three independent single-phase circuits

An unbalanced load kills per-phase analysis, but when a **neutral conductor is
present and its impedance is negligible** the problem does not become hard — it
becomes three separate single-phase problems. The neutral pins each load
terminal to the source neutral, so every phase sees its own phase voltage
whatever the other two are doing:

$$I_{a} = \\frac{V_{an}}{Z_{a}}, \\qquad I_{b} = \\frac{V_{bn}}{Z_{b}}, \\qquad I_{c} = \\frac{V_{cn}}{Z_{c}}, \\qquad I_{n} = I_{a} + I_{b} + I_{c}$$

The neutral current is a **phasor** sum, never an arithmetic one, and it is the
only quantity in the four-wire problem that requires the three phases to be
considered together.

![Neutral current of a four-wire wye as the phase-a current is varied while phases b and c are held at 10 amperes. The neutral is exactly zero at perfect balance, rises to 2 amperes when phase a is 20 percent high, and reaches a full 10 amperes when phase a is open.](/courses/fe-ee/figures/ckt2-3ph-neutral.svg)

The figure sweeps one phase of an otherwise balanced 10 A system and plots what
the neutral carries. Two readings matter. The V touches **exactly zero** only at
perfect balance — the neutral is a direct measure of imbalance and of nothing
else. And with phase a open the neutral carries a **full 10 A**, the same current
a healthy phase carries, which is why an undersized neutral is a fire risk under
fault conditions rather than merely a code violation.

### Worked example 7.1 — the neutral current of a lighting panel

*A 208/120 V four-wire panel supplies resistive lighting of 10 Ω, 20 Ω and 30 Ω
on phases a, b and c. Find the three line currents, the neutral current and the
total power.*

$$I_{a} = \\frac{120\\angle 0^\\circ}{10} = 12\\angle 0^\\circ, \\quad I_{b} = \\frac{120\\angle -120^\\circ}{20} = 6\\angle -120^\\circ, \\quad I_{c} = \\frac{120\\angle 120^\\circ}{30} = 4\\angle 120^\\circ$$

Add in rectangular form:

$$I_{n} = (12 + j0) + (-3 - j5.196) + (-2 + j3.464) = 7.000 - j1.732 = 7.211\\angle -13.90^\\circ\\ \\mathrm{A}$$

$$P = \\frac{120^{2}}{10} + \\frac{120^{2}}{20} + \\frac{120^{2}}{30} = 1440 + 720 + 480 = 2640\\ \\mathrm{W}$$

**7.21 A in the neutral**, on a panel whose largest phase carries 12 A. The
arithmetic shortcut $12 - 6 - 4 = 2$ A is wrong, and so is $12 - 4 = 8$ A; only
the phasor sum survives. Note also that $P = \\sqrt{3}V_{L}I_{L}\\cos \\phi$ is
**unusable** here, because there is no single $I_{L}$ and no single φ. Unbalanced
power is always summed phase by phase.

## 7.2 Take the neutral away and the load voltages move

Remove the neutral from that same panel and the load's star point is no longer
tied to the source's. It floats to whatever potential makes the three currents
sum to zero, and Millman's theorem gives it in one expression:

$$V_{N'N} = \\frac{V_{an}Y_{a} + V_{bn}Y_{b} + V_{cn}Y_{c}}{Y_{a} + Y_{b} + Y_{c}}, \\qquad I_{k} = \\left(V_{kn} - V_{N'N}\\right)Y_{k}$$

### Worked example 7.2 — the same panel with an open neutral

*Repeat Worked example 7.1 with the neutral conductor broken.*

With $Y_{a} = 0.1$, $Y_{b} = 0.05$ and $Y_{c} = 0.0333$ S, the numerator is
$120\\angle 0^\\circ (0.1) + 120\\angle -120^\\circ (0.05) + 120\\angle 120^\\circ (0.0333)$
and the denominator is $0.18333$ S:

$$V_{N'N} = 39.33\\angle -13.90^\\circ\\ \\mathrm{V}$$

Subtracting that displacement from each source phase voltage gives the voltage
each group of lamps actually receives:

| Phase | Impedance | Load voltage | Current | Power |
|---|---|---|---|---|
| a | 10 Ω | 82.36 V | 8.236 A | 678.3 W |
| b | 20 Ω | 136.25 V | 6.813 A | 928.3 W |
| c | 30 Ω | 149.98 V | 4.999 A | 749.8 W |

The total is 2356 W against 2640 W with the neutral intact, but the total is not
the point. **The most heavily loaded phase collapsed to 82 V and the least
loaded rose to 150 V** — a 25 percent overvoltage that will visibly shorten lamp
life on phase c while phase a sits dim. This is the classic open-neutral fault,
and it explains why the failure presents to a building occupant as "some lights
are too bright and some are too dim" rather than as an outage. Note the internal
check: the displacement angle, $-13.90^\\circ$, matches the neutral current angle
of Worked example 7.1, because the current the neutral used to carry is exactly
what now drives the star point off centre.

## 7.3 Triplen harmonics: the neutral current that survives balance

Section 4.3 flagged the harmonic case; here is the arithmetic. Third-harmonic
currents produced by single-phase electronic loads are displaced by
$3 \\times 120^\\circ = 360^\\circ$ between phases — that is, they are **in phase**
with one another — so they do not cancel in the neutral, they add:

$$I_{n,3rd} = 3I_{3}, \\qquad I_{phase} = \\sqrt{I_{1}^{2} + I_{3}^{2}}$$

For a balanced bank of switch-mode supplies drawing 40 A of fundamental with
30 percent third harmonic, $I_{3} = 12$ A:

$$I_{n} = 3(12) = 36\\ \\mathrm{A}, \\qquad I_{phase} = \\sqrt{40^{2} + 12^{2}} = 41.76\\ \\mathrm{A}$$

The neutral carries 86 percent of the phase current in a load that is perfectly
balanced. At 60 percent third harmonic, which office equipment can reach,

$$I_{n} = 3(24) = 72\\ \\mathrm{A} > I_{phase} = \\sqrt{40^{2} + 24^{2}} = 46.65\\ \\mathrm{A}$$

and the neutral carries **1.54 times** the phase current. Any exam question that
says "balanced load, therefore zero neutral current" is assuming linear loads;
say so explicitly if the question mentions harmonics, rectifiers or electronic
ballasts.

## 7.4 Two wattmeters, derived and then inverted

Blondel's theorem was stated in Section 1.7. Deriving what each meter reads
turns it from a fact into a tool. Put the current coils in lines a and c with
both voltage coils referred to line b. Meter 1 sees $V_{ab}$ and $I_{a}$; meter 2
sees $V_{cb}$ and $I_{c}$. For a balanced load with current lagging by θ, the
angle between $V_{ab}$ and $I_{a}$ is $\\theta - 30^\\circ$ and the angle between
$V_{cb}$ and $I_{c}$ is $\\theta + 30^\\circ$:

$$W_{1} = V_{L}I_{L}\\cos (\\theta - 30^\\circ), \\qquad W_{2} = V_{L}I_{L}\\cos (\\theta + 30^\\circ)$$

Adding them and expanding both cosines, the sine terms cancel and the cosine
terms double:

$$W_{1} + W_{2} = 2V_{L}I_{L}\\cos \\theta \\cos 30^\\circ = \\sqrt{3}\\,V_{L}I_{L}\\cos \\theta = P$$

Subtracting them, the cosine terms cancel instead:

$$W_{1} - W_{2} = 2V_{L}I_{L}\\sin \\theta \\sin 30^\\circ = V_{L}I_{L}\\sin \\theta = \\frac{Q}{\\sqrt{3}}$$

which is the whole method in two lines: the **sum** is real power and the
**difference** is reactive power scaled by √3. Dividing one by the other kills
$V_{L}I_{L}$ and leaves the load angle:

$$\\tan \\theta = \\sqrt{3}\\,\\frac{W_{1} - W_{2}}{W_{1} + W_{2}}, \\qquad Q = \\sqrt{3}\\left(W_{1} - W_{2}\\right)$$

![The two wattmeter readings normalised to the product of line voltage and line current, plotted against load angle. W1 rises to a maximum at 30 degrees and falls back, W2 falls monotonically and passes through zero at exactly 60 degrees before going negative, and their sum traces root three times the cosine of the angle.](/courses/fe-ee/figures/pow2-3ph-wattmeter-pf.svg)

The figure makes the three readable landmarks obvious. At unity power factor
the meters read equally. At $\\theta = 60^\\circ$, which is a power factor of
exactly 0.5, $W_{2} = V_{L}I_{L}\\cos 90^\\circ = 0$; beyond it the reading is
**negative**. And at a power factor of 0.866 ($\\theta = 30^\\circ$) the readings
are in the ratio 2:1, not 1:0 — a distractor the exam likes, because "one meter
reads zero" feels as though it should happen at the nicer-looking power factor.

### Worked example 7.3 — predicting the readings, then recovering the load

*A balanced load draws 30 A at 480 V with a power factor of 0.80 lagging.
Predict both wattmeter readings, then show that the readings alone recover the
power factor.*

$$\\theta = \\arccos 0.80 = 36.87^\\circ$$

$$W_{1} = (480)(30)\\cos (6.87^\\circ) = 14{,}297\\ \\mathrm{W}, \\qquad W_{2} = (480)(30)\\cos (66.87^\\circ) = 5{,}657\\ \\mathrm{W}$$

$$W_{1} + W_{2} = 19{,}953\\ \\mathrm{W} = \\sqrt{3}(480)(30)(0.80) \\;\\checkmark$$

Now run it backwards, as a technician with only two meter readings must:

$$\\tan \\theta = \\sqrt{3}\\,\\frac{14{,}297 - 5{,}657}{19{,}953} = 0.7500 \\;\\Rightarrow\\; \\theta = 36.87^\\circ \\;\\Rightarrow\\; \\mathrm{pf} = 0.800$$

$$Q = \\sqrt{3}(14{,}297 - 5{,}657) = 14{,}965\\ \\mathrm{VAR}$$

Two readings, no voltmeter, no ammeter, no phase-angle meter, and the complete
description of the load. That is why the method outlived the instruments it was
invented for.

## 7.5 Measuring unbalance: two indices that are not the same thing

Utilities and motor standards quantify unbalance with two different definitions,
and the exam expects you to know that they are different definitions rather than
two names for one quantity.

**NEMA MG-1 voltage unbalance** — often written LVUR, the line voltage unbalance
rate — is a purely arithmetic index built from the three line-voltage
**magnitudes** and nothing else:

$$\\mathrm{LVUR} = \\frac{\\max \\lvert V_{k} - V_{avg}\\rvert}{V_{avg}}\\times 100\\%$$

**IEC voltage unbalance factor** — VUF, also written $u_{2}$ — is defined from
**symmetrical components**, as the ratio of the negative-sequence to the
positive-sequence voltage:

$$\\mathrm{VUF} = \\frac{\\lvert V_{2}\\rvert}{\\lvert V_{1}\\rvert}\\times 100\\%, \\qquad V_{1} = \\frac{V_{ab} + aV_{bc} + a^{2}V_{ca}}{3}, \\qquad V_{2} = \\frac{V_{ab} + a^{2}V_{bc} + aV_{ca}}{3}$$

where $a = 1\\angle 120^\\circ$. The LVUR ignores angles entirely; the VUF depends
on them. The two indices generally give **different numbers for the same
system**, and neither is an approximation of the other — they are separate
standards with separate definitions, adopted by separate bodies. What they share
is a use: both are compared against limits, typically 2 percent, and both feed
motor derating.

### Worked example 7.4 — both indices for one set of readings

*A recorder logs line voltages of 480 V, 470 V and 464 V. Compute the NEMA LVUR
and the IEC VUF.*

$$V_{avg} = \\frac{480 + 470 + 464}{3} = 471.33\\ \\mathrm{V}, \\qquad \\max \\lvert V_{k} - V_{avg}\\rvert = 8.67\\ \\mathrm{V}$$

$$\\mathrm{LVUR} = \\frac{8.67}{471.33}\\times 100 = 1.84\\%$$

For the VUF the three magnitudes must first be closed into a triangle, since
$V_{ab} + V_{bc} + V_{ca} = 0$ always. Doing so gives
$480\\angle 0^\\circ$, $470\\angle -121.54^\\circ$ and $464\\angle 120.31^\\circ$, and
the sequence components follow:

$$\\lvert V_{1}\\rvert = 471.29\\ \\mathrm{V}, \\qquad \\lvert V_{2}\\rvert = 9.354\\ \\mathrm{V}, \\qquad \\mathrm{VUF} = 1.98\\%$$

**1.84 percent by one standard and 1.98 percent by the other**, from identical
measurements. One is inside a 2 percent limit and one is on the edge of it,
which is precisely why the standard has to be named whenever the number is
quoted.

![The effect of supply voltage unbalance on an induction motor. The upper panel plots negative-sequence stator current as a percentage of rated against unbalance factor for several locked-rotor ratios; the lower panel plots the resulting stator copper-loss multiplier, which reaches 1.032 at 3 percent unbalance for a locked-rotor ratio of six.](/courses/fe-ee/figures/pow2-3ph-unbalance-heating.svg)

Why either index is worth measuring is in the figure. The negative-sequence
voltage drives current through the motor's negative-sequence impedance, which
at running speed is close to its locked-rotor impedance — five to seven times
smaller than the positive-sequence impedance. A 1 percent voltage unbalance
therefore produces something like a 6 percent unbalance in current, all of it
extra heating in the stator, and NEMA MG-1 requires derating above 1 percent for
exactly that reason. **Small voltage unbalance, large current unbalance** is the
sentence to carry out of this section.`,
      examTip: 'When a load is unbalanced, stop reaching for √3·V_L·I_L·cos φ — there is no single line current and no single angle to put in it. Compute each phase separately and add the three real powers. The √3 formula is a balanced-system formula and using it on an unbalanced load is a category error, not a rounding error.',
      importantNote: 'The NEMA LVUR (maximum deviation from the average of the three line-voltage magnitudes) and the IEC VUF (ratio of negative-sequence to positive-sequence voltage) are two independent standard definitions, not an approximation and an exact form of one quantity. For the 480/470/464 V set in Worked example 7.4 they give 1.84 percent and 1.98 percent respectively. Always state which index a quoted unbalance figure refers to.',
    },
    {
      id: '3ph-problem-set-a',
      title: '8. Problem Set A: Connections, the Root Three, and Balanced Power',
      content: `Work each of these on paper before reading the solution. All seven are
handbook-solvable in about three minutes, and each one is built around a
specific √3 trap.

## 8. Problem Set A — connections and balanced power

### The problems

**A1.** A balanced wye load is supplied at 4,160 V line-to-line. Find the phase
voltage.

**A2.** Three 12 Ω resistors are connected in delta on a 240 V, three-phase
supply. Find the phase current, the line current and the total power.

**A3.** A balanced wye load of $6 + j8\\ \\Omega$ per phase is connected to a 208 V
supply. Find the line current, the power factor, and the real, reactive and
apparent power.

**A4.** A motor draws 25 A of line current at 480 V with a power factor of 0.85
lagging. Find its apparent, real and reactive power.

**A5.** A balanced delta load of $30 + j40\\ \\Omega$ per phase is connected to a
480 V supply. Find the phase current, the line current and the real power.

**A6.** Three identical resistors dissipate 6 kW connected in wye across a given
supply. What do they dissipate reconnected in delta on the same supply?

**A7.** Two wattmeters on a balanced load read 4.2 kW and 1.6 kW. Find the total
power and the power factor.

### Solutions

**A1.** A three-phase nameplate voltage is line-to-line, and in wye the phase
voltage is smaller:

$$V_{ph} = \\frac{4{,}160}{\\sqrt{3}} = 2{,}402\\ \\mathrm{V}$$

*Distractor:* multiplying instead of dividing gives 7,205 V — the answer to a
question nobody asked, because no wye source has a phase voltage larger than its
line voltage. If your phase voltage exceeds your line voltage in a wye, the
operation was inverted.

**A2.** In delta each element sees the full line voltage:

$$I_{ph} = \\frac{240}{12} = 20.0\\ \\mathrm{A}, \\qquad I_{L} = \\sqrt{3}(20.0) = 34.64\\ \\mathrm{A}$$

$$P = 3I_{ph}^{2}R = 3(400)(12) = 14{,}400\\ \\mathrm{W} = \\sqrt{3}(240)(34.64)$$

*Distractor:* dividing the 240 V by √3 first, as though the load were wye, gives
11.55 A per element and 4,800 W — exactly one third of the right answer, and the
single most common three-phase error there is.

**A3.** $\\lvert Z\\rvert = \\sqrt{36 + 64} = 10\\ \\Omega$, and in wye the phase
current is the line current:

$$I_{L} = \\frac{208/\\sqrt{3}}{10} = \\frac{120.09}{10} = 12.01\\ \\mathrm{A}, \\qquad \\mathrm{pf} = \\frac{R}{\\lvert Z\\rvert} = \\frac{6}{10} = 0.600\\ \\text{lagging}$$

$$P = 3I^{2}R = 2{,}596\\ \\mathrm{W}, \\qquad Q = 3I^{2}X = 3{,}461\\ \\mathrm{VAR}, \\qquad S = \\sqrt{3}(208)(12.01) = 4{,}326\\ \\mathrm{VA}$$

*Distractor:* taking the power factor as $\\cos (\\arctan (6/8)) = 0.8$ by reading
the impedance triangle upside down. Power factor is resistance over magnitude,
never reactance over magnitude.

**A4.** The line-quantity formulas need no knowledge of the connection at all:

$$S = \\sqrt{3}(480)(25) = 20{,}785\\ \\mathrm{VA}, \\qquad P = S(0.85) = 17{,}667\\ \\mathrm{W}$$

$$Q = S\\sin (\\arccos 0.85) = 20{,}785(0.5268) = 10{,}949\\ \\mathrm{VAR}$$

*Distractor:* using $3V_{L}I_{L}$ rather than $\\sqrt{3}V_{L}I_{L}$ gives 36.0 kVA,
which is $\\sqrt{3}$ too large. The formula $P = 3V_{ph}I_{ph}\\cos \\phi$ is correct
but takes **phase** quantities; mixing the 3 from one form with the line
quantities of the other is the trap.

**A5.** $\\lvert Z\\rvert = \\sqrt{900 + 1600} = 50\\ \\Omega$, and in delta each
element sees 480 V:

$$I_{ph} = \\frac{480}{50} = 9.60\\ \\mathrm{A}, \\qquad I_{L} = \\sqrt{3}(9.60) = 16.63\\ \\mathrm{A}, \\qquad P = 3(9.60)^{2}(30) = 8{,}294\\ \\mathrm{W}$$

Check it through the wye equivalent: $Z_{Y} = (30 + j40)/3 = 10 + j13.33\\ \\Omega$
of magnitude 16.67 Ω, giving $I_{L} = 277.13/16.667 = 16.63$ A — identical, as it
must be.

*Distractor:* 4.80 A per element, from dividing the 480 V by √3 before dividing
by the impedance. Delta elements never see anything but the line voltage.

**A6.** Delta draws exactly three times the wye power on the same supply:

$$P_{Y} = \\frac{3(V_{L}/\\sqrt{3})^{2}}{R} = \\frac{V_{L}^{2}}{R}, \\qquad P_{\\Delta} = \\frac{3V_{L}^{2}}{R} = 3P_{Y} = 18\\ \\mathrm{kW}$$

*Distractor:* √3 times 6 kW = 10.4 kW, from applying the √3 once instead of
squaring it. The voltage ratio is √3 and power goes as voltage squared, so the
power ratio is 3.

**A7.**

$$P = W_{1} + W_{2} = 5.80\\ \\mathrm{kW}, \\qquad \\tan \\theta = \\sqrt{3}\\,\\frac{4.2 - 1.6}{5.8} = 0.7764$$

$$\\theta = 37.83^\\circ \\;\\Rightarrow\\; \\mathrm{pf} = \\cos 37.83^\\circ = 0.790\\ \\text{lagging}$$

*Distractor:* 2.6 kW, from subtracting the readings because one "looks like" a
correction. The difference has a meaning — it is $Q/\\sqrt{3}$ — but the total
power is always the sum.`,
      examTip: 'Before any arithmetic, write two words at the top of the page: WYE or DELTA, and LINE or PHASE for each given number. Six of these seven problems have a distractor that is reachable only by getting one of those two labels wrong, and that is representative of the real exam.',
      importantNote: 'S = √3·V_L·I_L and P = 3·V_ph·I_ph·cos φ are both correct and they are not interchangeable term by term. The first takes line quantities and carries √3; the second takes phase quantities and carries 3. Writing 3·V_L·I_L or √3·V_ph·I_ph produces an answer wrong by a factor of √3 in opposite directions.',
    },
    {
      id: '3ph-problem-set-b',
      title: '9. Problem Set B: Feeders, Unbalance, Measurement, Correction',
      content: `The second set is the harder half of the topic: loads at the end of a
feeder, unbalanced neutrals, wattmeter inversion and three-phase power factor
correction. Each is still a three-minute problem with a handbook.

## 9. Problem Set B — feeders, unbalance and measurement

### The problems

**B1.** A 480 V source feeds a wye load of $10 + j7.5\\ \\Omega$ per phase through
a feeder of $0.2 + j0.4\\ \\Omega$ per conductor. Find the line current, the load
line voltage, the power delivered and the feeder efficiency.

**B2.** A 208/120 V four-wire panel carries resistive loads of 8 Ω, 12 Ω and
24 Ω on phases a, b and c. Find the three line currents, the neutral current and
the total power.

**B3.** A balanced delta load draws 45 A of line current at 480 V with a power
factor of 0.75 lagging. Find the phase current, the per-phase impedance in
rectangular form, and P, Q and S.

**B4.** A 480 V plant draws 150 kW at 0.78 power factor lagging. Find the
capacitive reactive power needed to correct to 0.95, the per-phase capacitance
if the bank is delta-connected at 60 Hz, and the reduction in feeder loss.

**B5.** Show that a three-phase three-wire system needs 75 percent of the
conductor metal of a single-phase two-wire system delivering the same power the
same distance at the same line voltage with the same total loss.

**B6.** Two wattmeters on a balanced three-phase load read +90 kW and −15 kW.
Find the total power, the power factor, the reactive power, and the line current
at 480 V.

**B7.** A motor with $1.6 + j3.2\\ \\Omega$ per phase runs delta-connected on
460 V. Find the starting line current in delta and in wye, and the ratio.

### Solutions

**B1.** Per phase, source $277.13\\angle 0^\\circ$ V and
$Z_{total} = 10.2 + j7.9 = 12.90\\angle 37.76^\\circ\\ \\Omega$:

$$I_{L} = \\frac{277.13}{12.90} = 21.48\\angle -37.76^\\circ\\ \\mathrm{A}$$

$$V_{load,ph} = (21.48)(12.5) = 268.5\\ \\mathrm{V} \\;\\Rightarrow\\; V_{load,LL} = 465.1\\ \\mathrm{V}$$

$$P_{load} = 3(21.48)^{2}(10) = 13{,}842\\ \\mathrm{W}, \\qquad P_{loss} = 3(21.48)^{2}(0.2) = 276.8\\ \\mathrm{W}$$

$$\\eta = \\frac{10}{10.2} = 98.0\\%$$

*Distractor:* using the full 480 V across the load, which gives 15.5 kW and a
100 percent efficient feeder. The feeder impedance is small but it is not zero,
and the question is asking for exactly the difference it makes.

**B2.**

$$I_{a} = \\frac{120}{8} = 15\\angle 0^\\circ, \\qquad I_{b} = \\frac{120}{12} = 10\\angle -120^\\circ, \\qquad I_{c} = \\frac{120}{24} = 5\\angle 120^\\circ$$

$$I_{n} = (15 + j0) + (-5 - j8.660) + (-2.5 + j4.330) = 7.500 - j4.330 = 8.660\\angle -30^\\circ\\ \\mathrm{A}$$

$$P = \\frac{120^{2}}{8} + \\frac{120^{2}}{12} + \\frac{120^{2}}{24} = 1800 + 1200 + 600 = 3{,}600\\ \\mathrm{W}$$

*Distractor:* 15 − 10 − 5 = 0 A of neutral current, from treating the phasors as
signed scalars. The answer is 8.66 A, more than half the largest phase current,
and a panel wired on the arithmetic assumption would have an undersized neutral.

**B3.** In delta the line current is the larger one:

$$I_{ph} = \\frac{45}{\\sqrt{3}} = 25.98\\ \\mathrm{A}, \\qquad \\lvert Z_{ph}\\rvert = \\frac{480}{25.98} = 18.48\\ \\Omega$$

$$\\theta = \\arccos 0.75 = 41.41^\\circ \\;\\Rightarrow\\; Z_{ph} = 13.86 + j12.22\\ \\Omega$$

$$S = \\sqrt{3}(480)(45) = 37.41\\ \\mathrm{kVA}, \\quad P = 28.06\\ \\mathrm{kW}, \\quad Q = 24.75\\ \\mathrm{kVAR}$$

*Distractor:* $480/45 = 10.67\\ \\Omega$, from using the line current with the phase
voltage. In a delta those two belong to different elements, and mixing them
understates the impedance by √3.

**B4.** Correction changes Q and leaves P alone:

$$Q_{1} = 150\\tan (\\arccos 0.78) = 120.3\\ \\mathrm{kVAR}, \\qquad Q_{2} = 150\\tan (\\arccos 0.95) = 49.3\\ \\mathrm{kVAR}$$

$$Q_{C} = 120.3 - 49.3 = 71.0\\ \\mathrm{kVAR} \\;\\Rightarrow\\; 23.68\\ \\mathrm{kVAR\\ per\\ phase}$$

In delta each capacitor sees the full 480 V:

$$C = \\frac{Q_{C,ph}}{2\\pi f V^{2}} = \\frac{23{,}680}{2\\pi (60)(480)^{2}} = 272.6\\ \\mu \\mathrm{F}$$

Line current falls from $150{,}000/(\\sqrt{3}\\cdot 480\\cdot 0.78) = 231.3$ A to
189.9 A, so the loss falls by

$$1 - \\left(\\frac{0.78}{0.95}\\right)^{2} = 32.6\\%$$

*Distractor:* a wye-connected bank of the same kVAR needs 817.9 µF per phase —
three times as much capacitance — because each unit sees $480/\\sqrt{3}$ and
capacitive kVAR goes as $V^{2}$. Quoting a delta bank's capacitance for a wye
bank, or the reverse, is wrong by exactly three.

**B5.** Same power at the same line voltage fixes the currents, and equal loss
then fixes the resistances:

$$I_{3\\phi} = \\frac{I_{1\\phi}}{\\sqrt{3}}, \\qquad 2I_{1\\phi}^{2}R_{1} = 3\\left(\\frac{I_{1\\phi}}{\\sqrt{3}}\\right)^{2}R_{3} \\;\\Rightarrow\\; R_{3} = 2R_{1}$$

Metal goes as conductors over resistance:

$$\\frac{3/R_{3}}{2/R_{1}} = \\frac{3}{4} = 75\\%$$

*Distractor:* comparing at equal **phase** voltage rather than equal line
voltage, which produces a different and much less flattering ratio. The standard
result assumes the two systems are compared at the same line-to-line voltage,
and it applies to three wires only — add a full-size neutral and the advantage
disappears entirely.

**B6.** A negative reading is added, not discarded:

$$P = 90 + (-15) = 75\\ \\mathrm{kW}, \\qquad \\tan \\theta = \\sqrt{3}\\,\\frac{90 - (-15)}{75} = 2.425$$

$$\\theta = 67.59^\\circ \\;\\Rightarrow\\; \\mathrm{pf} = 0.381\\ \\text{lagging}, \\qquad Q = \\sqrt{3}(105) = 181.9\\ \\mathrm{kVAR}$$

$$I_{L} = \\frac{75{,}000}{\\sqrt{3}(480)(0.381)} = 236.6\\ \\mathrm{A}$$

*Distractor:* 105 kW, from taking the magnitude of the negative reading. The
negative sign is information — it says immediately, before any arithmetic, that
the power factor is below 0.5, which the computed 0.381 confirms.

**B7.** $\\lvert Z\\rvert = \\sqrt{1.6^{2} + 3.2^{2}} = 3.578\\ \\Omega$.

$$\\text{Delta: } I_{ph} = \\frac{460}{3.578} = 128.6\\ \\mathrm{A}, \\qquad I_{L} = \\sqrt{3}(128.6) = 222.7\\ \\mathrm{A}$$

$$\\text{Wye: } I_{L} = I_{ph} = \\frac{460/\\sqrt{3}}{3.578} = \\frac{265.6}{3.578} = 74.23\\ \\mathrm{A}$$

$$\\frac{222.7}{74.23} = 3.00$$

*Distractor:* a ratio of √3 = 1.73, from applying the √3 once. Both the voltage
across each winding and the line-to-phase current relation contribute a √3, and
their product is 3 — which is why a wye-delta starter is quoted as a
"one-third-current" starter and never as a "58 percent" one.`,
      examTip: 'For any problem with a feeder, solve the per-phase circuit for CURRENT first and then build everything else from it. Current is common to the feeder and the load, so one division gives you the load voltage, the drop, both powers and the efficiency without a second complex division.',
      importantNote: 'Capacitor bank sizing depends on the connection. A delta bank sees the line voltage and needs one third the capacitance of a wye bank of the same kVAR — 272.6 µF against 817.9 µF in Problem B4. The kVAR is what the utility meters and what the problem usually specifies; the microfarads are what you order, and the connection is what converts between them.',
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
    {
      id: 'tr-ode',
      title: '5. Solving the First-Order Equation Rather Than Quoting It',
      content: `The universal formula of section 1 is a shortcut, and a shortcut is
worth trusting only once you have watched it come out of the circuit. What
follows is the same physics, derived rather than asserted, because the
derivation is also the statement of when the shortcut fails: it holds for one
independent energy-storage element driven by a constant source, and for nothing
else. Recognising that boundary is worth as many exam marks as the formula
itself.

## 5.1 The RC step, from Kirchhoff to the exponential

Put a resistor and a capacitor in series across a source that steps from zero to
$V$ at $t = 0$. KVL around the single loop gives

$$V = i(t)\\,R + v_C(t)$$

and the capacitor's own definition supplies the current:

$$i(t) = C\\,\\frac{dv_C}{dt}$$

Substituting one into the other produces a first-order linear differential
equation with constant coefficients:

$$RC\\,\\frac{dv_C}{dt} + v_C = V$$

Separate the variables. Every term containing the unknown goes left, every term
containing time goes right:

$$\\frac{dv_C}{V - v_C} = \\frac{dt}{RC}$$

Integrate both sides:

$$-\\ln (V - v_C) = \\frac{t}{RC} + K$$

Exponentiate, absorb the constant, and the exponential appears without ever
having been assumed:

$$V - v_C(t) = A\\,e^{-t/RC}$$

Finally apply the initial condition. If the capacitor already held $V_0$ at the
instant of switching, then $A = V - V_0$, and

$$v_C(t) = V + (V_0 - V)\\,e^{-t/RC}$$

That is precisely the universal formula with $x(\\infty) = V$, $x(0) = V_0$ and
$\\tau = RC$. Nothing was memorised; the product $RC$ arrived as the only
combination of the two components that carries units of time.

## 5.2 The same answer as natural plus forced response

The second route is the one that generalises to higher order, so it is worth
having as well. Write the solution as two pieces that are added:

$$v_C(t) = v_{\\text{natural}}(t) + v_{\\text{forced}}(t)$$

The **natural response** solves the source-free equation $RC\\,dv/dt + v = 0$.
Trying $v = A e^{st}$ gives the characteristic equation

$$RCs + 1 = 0 \\;\\Longrightarrow\\; s = -\\frac{1}{RC}$$

so $v_{\\text{natural}} = A e^{-t/\\tau}$ with $\\tau = -1/s$. The time constant
is the negative reciprocal of the characteristic root, which is the definition
that survives into second-order and into Laplace methods.

The **forced response** is whatever the circuit settles to under the drive. For
a constant source that is the DC steady state, $v_{\\text{forced}} = V$.

Only after adding the two is the initial condition applied. This is the single
most common error in the whole topic: fitting $A$ to the natural response alone
gives $A = V_0$ instead of $A = V_0 - V$, and every subsequent number is wrong.
The initial condition belongs to the **total** response.

## 5.3 The RL dual, derived the same way

Swap the capacitor for an inductor and repeat. KVL gives

$$V = i(t)\\,R + L\\,\\frac{di}{dt}$$

which rearranges into the same standard form,

$$\\frac{L}{R}\\,\\frac{di}{dt} + i = \\frac{V}{R}$$

so the time constant is $\\tau = L/R$ and the final current is $V/R$. With an
initial current $I_0$ the solution is

$$i(t) = \\frac{V}{R} + \\left(I_0 - \\frac{V}{R}\\right) e^{-tR/L}$$

and the inductor voltage follows by differentiating:

$$v_L(t) = L\\,\\frac{di}{dt} = (V - I_0 R)\\,e^{-tR/L}$$

Notice that $\\tau = L/R$ moves the opposite way from intuition: **more**
resistance makes an RL circuit **faster**, while more resistance makes an RC
circuit slower. Exam questions exploit that asymmetry directly, offering "the
time constant increases" as a distractor for both circuits when it is true of
only one.

## 5.4 Worked example 1 — an RC step solved from the differential equation

A 47 microfarad capacitor, initially uncharged, is connected through 3.3 kilohm
to a 24 V source at $t = 0$. Find the time constant, the initial current, the
voltage at one, two, three and five time constants, and the time to reach 20 V.

**Time constant.** $\\tau = RC = 3300 \\times 47 \\times 10^{-6} = 0.1551$ s, i.e.
**155.1 ms**. The kilohm-times-microfarad shortcut gives it in milliseconds by
inspection: $3.3 \\times 47 = 155.1$.

**Initial current.** At $t = 0^{+}$ the capacitor still holds 0 V, so the whole
24 V sits across the resistor and $i(0^{+}) = 24/3300 = $ **7.273 mA**.

**The response.** $v_C(t) = 24\\left(1 - e^{-t/0.1551}\\right)$ volts.

| Elapsed | $t$ | $v_C$ | $i = (24 - v_C)/R$ |
|---|---|---|---|
| $1\\tau$ | 155.1 ms | 15.17 V | 2.675 mA |
| $2\\tau$ | 310.2 ms | 20.75 V | 0.984 mA |
| $3\\tau$ | 465.3 ms | 22.81 V | 0.362 mA |
| $5\\tau$ | 775.5 ms | 23.84 V | 0.049 mA |

**Time to 20 V.** Invert the exponential:

$$t = -\\tau \\ln \\left(\\frac{V - v}{V - V_0}\\right) = -0.1551 \\ln \\left(\\frac{24 - 20}{24}\\right) = 0.1551 \\times 1.7918 = 0.2779\\ \\text{s}$$

so **277.9 ms**, which sits sensibly between the 310.2 ms that reaches 20.75 V
and the 155.1 ms that reaches 15.17 V. The half-way time is a useful sanity
anchor of its own: $t_{1/2} = \\tau \\ln 2 = 0.1075$ s for any first-order
circuit charging from zero.

## 5.5 The three questions, in the order that avoids errors

Every first-order problem reduces to answering three questions, and answering
them in this order stops the usual mistakes:

1. **What is the state variable, and what is it immediately after switching?**
   Only $v_C$ and $i_L$ are continuous. Solve the pre-switch circuit in steady
   state, read $v_C(0^{-})$ or $i_L(0^{-})$, and carry it across unchanged.
2. **What is the final value?** Redraw the post-switch circuit at DC steady
   state, capacitors open and inductors shorted, and solve it as a resistive
   network.
3. **What resistance does the element see?** Kill every independent source
   (voltage sources shorted, current sources opened) and find the Thevenin
   resistance at the element's own terminals. That resistance, not the one drawn
   nearest, sets $\\tau$.

Any quantity that is not $v_C$ or $i_L$ — a resistor current, a branch voltage —
is then recovered algebraically from the state variable at whatever instant is
asked. Those quantities may jump discontinuously, and often do.

## 5.6 Worked example 2 — the time constant from a Thevenin equivalent

A 40 V source feeds an 8 kilohm resistor into a node; from that node a 12 kilohm
resistor returns to ground, and a 2.2 microfarad capacitor also sits from the
node to ground. The capacitor is uncharged when the source is applied at
$t = 0$. Find the final voltage, the time constant, and the voltage at 20 ms.

**Final value.** With the capacitor open, the two resistors form a divider:

$$v_C(\\infty) = 40 \\times \\frac{12}{8 + 12} = 24\\ \\text{V}$$

**Time constant.** Kill the 40 V source by shorting it. The capacitor then sees
8 kilohm in parallel with 12 kilohm:

$$R_{\\text{th}} = \\frac{8 \\times 12}{8 + 12} = 4.8\\ \\text{k}\\Omega, \\qquad \\tau = 4800 \\times 2.2 \\times 10^{-6} = 10.56\\ \\text{ms}$$

**At 20 ms.** That is $20/10.56 = 1.894$ time constants, so

$$v_C = 24\\left(1 - e^{-1.894}\\right) = 24(1 - 0.1504) = 20.39\\ \\text{V}$$

The distractors write themselves, and every one of them is a real student
answer: 26.4 ms from using the 12 kilohm alone, 17.6 ms from using the 8 kilohm
alone, and 44 ms from adding the two in series. Only the killed-source parallel
combination is right, and it is the smallest of the four — the parallel
combination is always smaller than either resistor, so a time constant larger
than $R_{\\min}C$ is a red flag before you check anything else.

## 5.7 One pair of curves, and the tangent that fixes the scale

Because the solution depends on time only through $t/\\tau$, a single pair of
curves in normalised units serves every RC and RL circuit that will ever be set:

![Charging and discharging exponentials plotted against elapsed time in units of the time constant, with the 63.2, 86.5, 95.0, 98.2 and 99.3 percent marks shown, and the initial tangent drawn to the point where it meets the final value at exactly one time constant.](/courses/fe-ee/figures/ckt2-rc-charge.svg)

The dashed straight line is worth more than the marked percentages. Differentiate
the response at the instant of switching:

$$\\left. \\frac{dv_C}{dt} \\right|_{t=0} = \\frac{V - V_0}{\\tau}$$

At that initial rate the capacitor would reach its final value in exactly one
time constant. It does not, because the rate falls as the gap closes, but the
construction gives a graphical definition of $\\tau$ that needs no logarithms:
draw the tangent at the start of a measured transient, see where it crosses the
final value, and read the time constant off the axis. Oscilloscope work uses
this constantly, and it is also the fastest way to check a computed $\\tau$
against a sketch.

## 5.8 Worked example 3 — the RL turn-on, both variables at once

A 250 mH coil of 50 ohm resistance is switched onto 24 V. Find the time
constant, the final current, the current and coil voltage at one time constant,
the stored energy, and the time to reach 0.40 A.

$$\\tau = \\frac{L}{R} = \\frac{0.25}{50} = 5\\ \\text{ms}, \\qquad i(\\infty) = \\frac{24}{50} = 0.48\\ \\text{A}$$

$$i(t) = 0.48\\left(1 - e^{-t/5\\,\\text{ms}}\\right)\\ \\text{A}, \\qquad v_L(t) = 24\\,e^{-t/5\\,\\text{ms}}\\ \\text{V}$$

At $t = \\tau$: $i = 0.48 \\times 0.6321 = $ **0.3034 A** and
$v_L = 24 \\times 0.3679 = $ **8.829 V**. The two are exact mirror images, which
the figure makes plain:

![Inductor current rising and inductor voltage falling during an RL turn-on, both normalised to their initial or final values, with the one time constant point at 5 ms marked at 0.303 A and 8.83 V.](/courses/fe-ee/figures/ckt2-rl-current.svg)

**Stored energy at steady state.**

$$W = \\tfrac{1}{2}L\\,i^2 = 0.5 \\times 0.25 \\times 0.48^2 = 28.8\\ \\text{mJ}$$

**Time to 0.40 A.**

$$t = -\\tau \\ln \\left(1 - \\frac{0.40}{0.48}\\right) = -5 \\ln (0.1667) = 5 \\times 1.7918 = 8.959\\ \\text{ms}$$

That is not quite two time constants, which agrees with the current at 12 ms
being already 0.4365 A. If your answer for a rising current exceeds the final
value, or a computed time comes out negative, the logarithm argument went
negative and the initial and final values were swapped.

## 5.9 Turn-off: the transient that destroys switches

Energising an inductor is gentle; de-energising one is not. The stored energy
$\\tfrac{1}{2}Li^2$ has to leave through whatever path exists, and if the switch
opens the only remaining path is the air between its contacts. The coil enforces
its current by raising its terminal voltage without limit:

$$v_L = L\\,\\frac{di}{dt}$$

The engineering answer is to give the current a deliberate path — a flyback
diode, a resistor, or an RC snubber — so that the decay happens through a
component chosen for the job. The resistor version is the one that yields clean
numbers, because the peak voltage it produces is simply Ohm's law on the
instantaneous current.

## 5.10 Worked example 4 — a coil interrupted into a bleeder resistor

The 250 mH, 50 ohm coil above is carrying its full 0.48 A when the supply switch
opens. A 1 kilohm bleeder resistor is permanently connected across the coil.
Find the voltage that appears across the bleeder at the instant of opening, the
new time constant, the current 500 microseconds later, and how the stored energy
divides.

**Voltage at the instant of opening.** Inductor current is continuous, so 0.48 A
must immediately flow in the bleeder:

$$v = i(0^{+})\\,R_b = 0.48 \\times 1000 = 480\\ \\text{V}$$

Twenty times the 24 V supply, from a resistor whose only job is protection. That
is why a snubber's voltage rating matters more than its power rating.

**New time constant.** The loop is now the coil in series with its own 50 ohm
winding and the 1 kilohm bleeder:

$$\\tau = \\frac{L}{R + R_b} = \\frac{0.25}{1050} = 238.1\\ \\mu\\text{s}$$

**Current at 500 microseconds.** $500/238.1 = 2.100$ time constants, so
$i = 0.48\\,e^{-2.100} = $ **58.8 mA**.

**Energy split.** The full 28.8 mJ leaves the field; the two resistances share it
in proportion to their values because they carry the same current at every
instant:

$$W_b = 28.8 \\times \\frac{1000}{1050} = 27.43\\ \\text{mJ}$$

The remaining 1.37 mJ heats the winding. Choosing a larger bleeder decays the
current faster and captures a larger share of the energy, at the price of a
proportionally larger voltage spike — 10 kilohm would clear the current in
24.9 microseconds but generate 4.8 kV. That trade between speed and stress is
the entire design problem, and it is why the diode, which clamps at roughly one
volt and accepts a slow decay, is the default choice wherever slow is acceptable.`,
      examTip: 'Derive the time constant as the negative reciprocal of the characteristic root, tau = -1/s. It is the same number as RC or L/R for first-order circuits, and it is the only definition that still works when the circuit becomes second order.',
      importantNote: 'Apply the initial condition to the TOTAL response, natural plus forced - never to the natural part alone. Fitting the constant before adding the forced term is the error that produces an answer starting at the right value and heading to the wrong one.',
    },
    {
      id: 'tr-second-ode',
      title: '6. Second-Order Circuits: Roots, Regimes and Ringing',
      content: `A circuit with both an inductor and a capacitor stores energy in two
places and can trade it back and forth, which no first-order circuit can do. The
mathematics changes accordingly: one characteristic root becomes two, and the
character of the response depends on whether those two roots are real or
complex. Everything in this section is the arithmetic of that one question.

## 6.1 The equation and its roots

For a series RLC loop driven by a step of amplitude $V$, KVL and the two element
laws give

$$LC\\,\\frac{d^2 v_C}{dt^2} + RC\\,\\frac{dv_C}{dt} + v_C = V$$

Divide through by $LC$ and the standard form appears:

$$\\frac{d^2 v_C}{dt^2} + \\frac{R}{L}\\,\\frac{dv_C}{dt} + \\frac{1}{LC}\\,v_C = \\frac{V}{LC}$$

The characteristic equation of the homogeneous part is

$$s^2 + \\frac{R}{L}\\,s + \\frac{1}{LC} = 0$$

which is universally written with two named parameters,

$$s^2 + 2\\alpha s + \\omega_0^2 = 0, \\qquad \\alpha = \\frac{R}{2L}, \\qquad \\omega_0 = \\frac{1}{\\sqrt{LC}}$$

and solved by the quadratic formula:

$$s_{1,2} = -\\alpha \\pm \\sqrt{\\alpha^2 - \\omega_0^2}$$

Everything hangs on the sign of what is under that radical. The damping ratio
names it in dimensionless form:

$$\\zeta = \\frac{\\alpha}{\\omega_0} = \\frac{R}{2}\\sqrt{\\frac{C}{L}} = \\frac{R}{2\\sqrt{L/C}}$$

The **parallel** RLC has the same $\\omega_0$ and a different $\\alpha$, and the
difference is not cosmetic:

$$\\alpha_{\\text{series}} = \\frac{R}{2L}, \\qquad \\alpha_{\\text{parallel}} = \\frac{1}{2RC}$$

In the series circuit more resistance damps harder; in the parallel circuit more
resistance damps **less**, because the loss path is a shunt and a bigger shunt
resistance draws less current out of the tank. Using the series formula on a
parallel circuit is the single most productive distractor in this part of the
syllabus, and it usually changes the answer by orders of magnitude rather than
percentages.

## 6.2 One L and C, three resistors, three different worlds

Fix $L = 100$ mH and $C = 20$ microfarad. Then

$$\\omega_0 = \\frac{1}{\\sqrt{0.100 \\times 20 \\times 10^{-6}}} = \\frac{1}{\\sqrt{2 \\times 10^{-6}}} = 707.1\\ \\text{rad/s}$$

which is $f_0 = 112.54$ Hz, and the characteristic impedance is
$\\sqrt{L/C} = \\sqrt{5000} = 70.71$ ohm. Critical damping needs
$R = 2\\sqrt{L/C} = 141.4$ ohm. Three choices of $R$ then produce the three
regimes:

| $\\zeta$ | $R$ | Roots $s_{1,2}$ | Regime |
|---|---|---|---|
| 0.25 | 35.36 $\\Omega$ | $-176.8 \\pm j684.7$ | underdamped |
| 1.00 | 141.4 $\\Omega$ | $-707.1$ (twice) | critically damped |
| 2.50 | 353.6 $\\Omega$ | $-147.6$ and $-3388$ | overdamped |

![Series RLC step response for damping ratios of 0.25, 1.0 and 2.5 on identical L and C, showing a 44.4 percent overshoot for the underdamped case, no overshoot for the critical case, and a slow monotonic approach for the overdamped case.](/courses/fe-ee/figures/ckt2-rlc-damping.svg)

Three readings the figure supports and a formula does not. First, the
underdamped curve crosses its target early and then oscillates about it; the
overshoot is not a defect of the model but the actual voltage the capacitor
reaches. Second, the critically damped curve is the fastest one that never
crosses — the boundary case is not a compromise, it is an optimum. Third, the
overdamped curve is *slower* than the critical one despite having more
resistance to dissipate energy, which is the result students find least
intuitive and which the root arithmetic in section 6.5 explains exactly.

## 6.3 Worked example 5 — the underdamped step, root by root

Take $R = 35.36$ ohm with the $L$ and $C$ above. Classify the response, find the
roots, write the solution, and give the ringing frequency and the first peak.

$$\\alpha = \\frac{R}{2L} = \\frac{35.36}{0.200} = 176.8\\ \\text{s}^{-1}, \\qquad \\omega_0 = 707.1\\ \\text{rad/s}$$

Since $\\alpha < \\omega_0$ the radical is negative and the roots are a complex
conjugate pair. The **damped natural frequency** is

$$\\omega_d = \\sqrt{\\omega_0^2 - \\alpha^2} = \\sqrt{500000 - 31250} = 684.7\\ \\text{rad/s}$$

so $s_{1,2} = -176.8 \\pm j684.7$, and $\\zeta = 176.8/707.1 = 0.250$. The step
response of the capacitor voltage, with the initial conditions
$v_C(0) = 0$ and $i_L(0) = 0$, is

$$v_C(t) = V\\left[1 - e^{-\\alpha t}\\left(\\cos \\omega_d t + \\frac{\\alpha}{\\omega_d}\\,\\sin \\omega_d t\\right)\\right]$$

with $\\alpha/\\omega_d = 0.2582$ here.

**Ringing frequency.** $f_d = \\omega_d/2\\pi = 684.7/6.2832 = $ **108.97 Hz**,
and the ring period is $T_d = 2\\pi/\\omega_d = $ **9.177 ms**.

**First peak.** The response peaks half a ring period in, at

$$t_p = \\frac{\\pi}{\\omega_d} = \\frac{\\pi}{684.7} = 4.589\\ \\text{ms}$$

and the overshoot there is

$$M_p = e^{-\\pi \\zeta / \\sqrt{1 - \\zeta^2}} = e^{-\\pi (0.25)/0.9682} = e^{-0.8112} = 0.4443$$

so the capacitor reaches **144.4 %** of the final voltage. Feed a 100 V step into
this circuit and the capacitor briefly sees 144 V. That is the number that sizes
the component, and quoting the 100 V supply instead is the classic mistake.

**The frequency trap.** The undamped frequency here is
$\\omega_0/2\\pi = 112.54$ Hz. The circuit does not ring at 112.54 Hz; it rings at
108.97 Hz. At this damping the two differ by only 3 %, which is exactly why the
substitution slips past unnoticed — and why exam problems are written at
damping ratios where it does not.

## 6.4 The two non-oscillatory forms

When the roots are real the cosine and sine disappear. For **critical damping**
the two roots coincide at $s = -\\alpha = -\\omega_0$, and the repeated root forces
a $t\\,e^{st}$ term into the solution:

$$v_C(t) = V\\left[1 - e^{-\\alpha t}(1 + \\alpha t)\\right]$$

For **overdamping** the roots are distinct and real, and the step response is a
weighted difference of two plain exponentials:

$$v_C(t) = V\\left[1 - \\frac{s_1 e^{s_2 t} - s_2 e^{s_1 t}}{s_1 - s_2}\\right]$$

Neither expression can overshoot, because neither contains an oscillatory
factor. That is a structural fact, not an approximation: an overdamped circuit
cannot be made to ring by any choice of step size.

## 6.5 Worked example 6 — critical and overdamped, same L and C

Keep $L = 100$ mH and $C = 20$ microfarad, and compare $R = 141.4$ ohm with
$R = 353.6$ ohm.

**Critical, $R = 141.4$ ohm.** $\\alpha = 141.42/0.200 = 707.1 = \\omega_0$, so
$\\zeta = 1$ and both roots sit at $-707.1$. The response
$1 - e^{-707.1t}(1 + 707.1t)$ reaches 95 % of final when $\\alpha t = 4.744$,
i.e. at **6.71 ms**, and 99 % when $\\alpha t = 6.638$, i.e. at **9.39 ms**.

**Overdamped, $R = 353.6$ ohm.** Now $\\alpha = 353.6/0.200 = 1768$ and

$$\\sqrt{\\alpha^2 - \\omega_0^2} = \\sqrt{3.126 \\times 10^{6} - 5.000 \\times 10^{5}} = 1620\\ \\text{s}^{-1}$$

$$s_1 = -1768 + 1620 = -147.6\\ \\text{s}^{-1}, \\qquad s_2 = -1768 - 1620 = -3388\\ \\text{s}^{-1}$$

The two roots correspond to time constants of $1/147.6 = 6.78$ ms and
$1/3388 = 0.295$ ms. The fast one dies almost immediately; the **slow** one
dominates everything you see, and the response reaches 95 % only at
**20.6 ms** — three times longer than the critically damped circuit with a
quarter of the resistance.

That is the resolution of the paradox. Adding resistance beyond critical does
not remove energy faster; it splits the response into a fast root and a slow
root, and pushes the slow root closer to the origin. The slowest root always
governs, so past $\\zeta = 1$ every further ohm makes the circuit lazier. A
relay driver, a comparator input, a moving-coil meter: all of them are damped
deliberately near $\\zeta = 1$ and never far beyond it.

## 6.6 The three specification numbers

Design work rarely asks for $s_1$ and $s_2$. It asks for overshoot, speed and
settling, and all three come from $\\zeta$ and $\\omega_0$ alone:

$$M_p = e^{-\\pi \\zeta / \\sqrt{1 - \\zeta^2}} \\quad \\text{(fractional overshoot)}$$

$$t_p = \\frac{\\pi}{\\omega_d} = \\frac{\\pi}{\\omega_0 \\sqrt{1 - \\zeta^2}} \\quad \\text{(time of first peak)}$$

$$t_s \\approx \\frac{4}{\\zeta \\omega_0} = \\frac{4}{\\alpha} \\quad \\text{(2 \\% settling)}$$

Overshoot depends on $\\zeta$ only — not on $\\omega_0$, not on the step size, not
on which element you measure. Scaling $L$ and $C$ to move $\\omega_0$ while
holding $\\zeta$ changes every time in the response and leaves the shape
identical.

| $\\zeta$ | Overshoot | Regime | Typical use |
|---|---|---|---|
| 0.1 | 72.9 % | very lightly damped | resonators, oscillator tanks |
| 0.25 | 44.4 % | underdamped | fast response, overshoot tolerated |
| 0.5 | 16.3 % | underdamped | common control compromise |
| 0.707 | 4.3 % | maximally flat | filters, instrumentation |
| 1.0 | 0 % | critically damped | meters, positioners |
| 2.5 | 0 % | overdamped | deliberately slow, no ring |

## 6.7 Worked example 7 — a specification given only in zeta

A second-order circuit is specified as $\\zeta = 0.40$ with an undamped natural
frequency of 2000 rad/s. Find the percentage overshoot, the time of the first
peak, and the 2 % settling time.

$$\\sqrt{1 - \\zeta^2} = \\sqrt{1 - 0.16} = 0.9165, \\qquad \\omega_d = 2000 \\times 0.9165 = 1833\\ \\text{rad/s}$$

$$M_p = e^{-\\pi (0.40)/0.9165} = e^{-1.371} = 0.2538 \\;\\Rightarrow\\; 25.4\\ \\%$$

$$t_p = \\frac{\\pi}{1833} = 1.714\\ \\text{ms}, \\qquad t_s \\approx \\frac{4}{0.40 \\times 2000} = 5.00\\ \\text{ms}$$

The trap is in $t_p$: using the undamped $\\omega_0 = 2000$ instead of
$\\omega_d = 1833$ gives $\\pi/2000 = 1.571$ ms, which is a plausible-looking
distractor about 8 % low. The rule is that **every time in the oscillatory
response is governed by** $\\omega_d$, and only the envelope is governed by
$\\alpha$.

## 6.8 Ringing, the envelope, and the logarithmic decrement

Reduce the damping to $\\zeta = 0.1$ on the same $L$ and $C$ — that is
$R = 2\\zeta\\sqrt{L/C} = 14.14$ ohm — and the circuit rings visibly:

![A lightly damped step response with damping ratio 0.1, its exponential envelope drawn as dashed curves, the 8.93 millisecond ring period marked between the first two peaks, and the note that each peak is 53.2 percent of the one before.](/courses/fe-ee/figures/ckt2-ringing-envelope.svg)

$$\\omega_d = 707.1\\sqrt{1 - 0.01} = 703.6\\ \\text{rad/s} \\;\\Rightarrow\\; f_d = 111.98\\ \\text{Hz}, \\quad T_d = 8.930\\ \\text{ms}$$

The envelope decays as $e^{-\\alpha t}$ with $\\alpha = \\zeta \\omega_0 = 70.71$,
so the envelope time constant is $1/70.71 = 14.14$ ms — about 1.59 ring periods,
which is why the trace shows roughly five visible cycles before it is lost in
the baseline.

The ratio of successive peaks above the final value is fixed by $\\zeta$ alone:

$$\\frac{A_{n+1}}{A_n} = e^{-\\alpha T_d} = e^{-2\\pi \\zeta / \\sqrt{1 - \\zeta^2}}$$

which here is $e^{-0.6315} = 0.5318$: each peak is 53.2 % of the one before.
Taking logarithms defines the **logarithmic decrement** $\\delta$ and inverts the
relation:

$$\\delta = \\ln \\frac{A_n}{A_{n+1}} = \\frac{2\\pi \\zeta}{\\sqrt{1 - \\zeta^2}} \\;\\Longrightarrow\\; \\zeta = \\frac{\\delta}{\\sqrt{4\\pi^2 + \\delta^2}}$$

This is how damping is measured rather than calculated, and it needs no
knowledge of $R$, $L$ or $C$ — only two peak heights and the time between them.
It is also the link back to resonance: for a lightly damped circuit
$Q = 1/(2\\zeta)$, so $\\zeta = 0.1$ is a $Q$ of 5, and the same circuit analysed
in the frequency domain would show a bandwidth of $f_0/Q$.

## 6.9 Worked example 8 — extracting zeta, omega and R from a scope trace

An oscilloscope shows a ringing step response settling to 5.00 V. The first peak
overshoots to 7.40 V and the second to 6.35 V, and the two peaks are
400 microseconds apart. The inductance is known to be 10 mH. Find $\\zeta$,
$\\omega_d$, $\\omega_0$, $Q$, and then $R$ and $C$.

**Peak amplitudes above final.** $A_1 = 7.40 - 5.00 = 2.40$ V and
$A_2 = 6.35 - 5.00 = 1.35$ V, so $A_2/A_1 = 0.5625$.

$$\\delta = \\ln \\frac{1}{0.5625} = 0.5754, \\qquad \\zeta = \\frac{0.5754}{\\sqrt{4\\pi^2 + 0.331}} = \\frac{0.5754}{6.310} = 0.0912$$

**Frequencies.** The measured period is the *damped* one:

$$\\omega_d = \\frac{2\\pi}{400 \\times 10^{-6}} = 15708\\ \\text{rad/s}, \\qquad \\omega_0 = \\frac{\\omega_d}{\\sqrt{1 - \\zeta^2}} = 15774\\ \\text{rad/s}$$

**Quality factor.** $Q = 1/(2\\zeta) = $ **5.48**.

**Components.** With $L = 10$ mH,

$$R = 2\\zeta \\omega_0 L = 2(0.0912)(15774)(0.010) = 28.8\\ \\Omega$$

$$C = \\frac{1}{\\omega_0^2 L} = \\frac{1}{(15774)^2 (0.010)} = 402\\ \\text{nF}$$

Every number came from the picture. This is the practical value of the
second-order theory: a trace and two measurements identify a circuit whose
component values were never given.

## 6.10 The time constant and the corner frequency are the same fact

A first-order circuit has one number, and it can be quoted in either domain. The
RC that sets $\\tau$ also sets the corner frequency of the same network as a
filter:

$$f_c = \\frac{1}{2\\pi RC} = \\frac{1}{2\\pi \\tau}$$

Take $R = 1.6$ kilohm and $C = 100$ nF: $\\tau = 160$ microseconds and
$f_c = 994.7$ Hz.

![Magnitude response of a first-order RC low-pass filter in decibels on a logarithmic frequency axis, with the flat and minus twenty decibel per decade asymptotes crossing at the 995 hertz corner where the true curve is 3.01 decibels down.](/courses/fe-ee/figures/ckt2-bode-rc.svg)

The two domains agree numerically, not just in spirit. The 10 % to 90 % rise
time of the step response is $\\tau \\ln 9 = 2.20\\tau = 352$ microseconds, and the
standard bandwidth-rise-time rule gives

$$t_r \\approx \\frac{0.35}{f_c} = \\frac{0.35}{994.7} = 351.9\\ \\mu\\text{s}$$

the same answer to three figures, because $0.35 \\approx \\ln 9 / 2\\pi$. A slow
circuit and a low-bandwidth circuit are one circuit described twice, and being
fluent in the translation lets you answer a transient question with a filter
formula when the transient route is longer.`,
      examTip: 'Compute alpha and omega_0 first and compare them before doing anything else. alpha < omega_0 is underdamped and the answer will involve omega_d; alpha > omega_0 is overdamped and the answer is two real exponentials whose SLOWER root sets the speed.',
      importantNote: 'alpha = R/2L for a SERIES RLC and alpha = 1/(2RC) for a PARALLEL RLC. omega_0 = 1/sqrt(LC) in both. Using the series alpha on a parallel circuit typically changes the damping ratio by more than an order of magnitude, which turns an underdamped answer into an overdamped one.',
    },
    {
      id: 'tr-pset-a',
      title: '7. Problem Set A — First-Order Transients',
      content: `Six problems in the FE style. Each is meant to be finished in about
three minutes with a calculator and the handbook, and each one is built around a
specific way of going wrong. Work all six before reading the solutions; the
solutions name the trap and the number it produces, because recognising a wrong
answer that looks reasonable is most of what the exam tests.

## 7.1 Problem Set A — the problems

**A1.** A 220 microfarad capacitor, initially uncharged, is connected through a
470 ohm resistor to a 12 V source. What is the capacitor voltage 150 ms after
the connection is made?

**A2.** A 100 microfarad capacitor charged to 50 V is discharged through a
33 kilohm resistor. How long does it take to fall to 5 V?

**A3.** A 20 V source feeds a 10 kilohm resistor into a node; a 15 kilohm
resistor runs from that node to ground and a 1 microfarad capacitor, initially
uncharged, sits from the node to ground. Find the final capacitor voltage, the
time constant, and the capacitor voltage 10 ms after the source is applied.

**A4.** A 1.2 H coil of 80 ohm resistance is switched onto a 48 V supply. What is
the final current, and how long does the current take to reach 90 % of it?

**A5.** A 0.8 H relay coil of 60 ohm winding resistance is carrying 1.5 A when
its supply switch opens. A 470 ohm resistor is permanently connected across the
coil. Find the voltage across that resistor at the instant of opening, the decay
time constant, and the energy the resistor absorbs.

**A6.** A 5 V pulse 200 microseconds long drives a 10 kilohm resistor feeding a
10 nanofarad capacitor to ground. Find the capacitor voltage at the end of the
pulse, and 200 microseconds after the input returns to zero.

## 7.2 Problem Set A — answers, worked in full

**A1 — 9.19 V.** The time constant is
$\\tau = 470 \\times 220 \\times 10^{-6} = 103.4$ ms, so 150 ms is 1.451 time
constants:

$$v_C = 12\\left(1 - e^{-1.451}\\right) = 12(1 - 0.2344) = 9.19\\ \\text{V}$$

*The trap.* Reading 150 ms as "about one time constant" and quoting the 63.2 %
value gives 7.59 V. The ratio $t/\\tau$ must be computed, not eyeballed; 1.45
time constants is 76.6 % of the way, not 63.2 %.

**A2 — 7.60 s.** Here $\\tau = 33000 \\times 100 \\times 10^{-6} = 3.30$ s, and
the decay from 50 V to 5 V is a factor of ten:

$$t = -\\tau \\ln \\left(\\frac{5}{50}\\right) = 3.30 \\ln 10 = 3.30 \\times 2.303 = 7.60\\ \\text{s}$$

*The trap.* "Falls to 10 % of its value" is not the same as "fully discharged",
so the five-time-constant rule gives 16.5 s, more than twice the right answer.
Ten percent is $\\ln 10 = 2.30$ time constants; 1 % is 4.61; only 0.67 % is 5.

**A3 — 12 V, 6 ms, and 9.73 V.** With the capacitor open at steady state the
resistors divide the supply:
$v_C(\\infty) = 20 \\times 15/(10 + 15) = 12$ V. Killing the source puts the two
resistors in parallel at the capacitor terminals:

$$R_{\\text{th}} = \\frac{10 \\times 15}{25} = 6\\ \\text{k}\\Omega, \\qquad \\tau = 6000 \\times 10^{-6} = 6\\ \\text{ms}$$

$$v_C(10\\ \\text{ms}) = 12\\left(1 - e^{-10/6}\\right) = 12(1 - 0.1889) = 9.73\\ \\text{V}$$

*The trap.* Using the 10 kilohm alone gives 10 ms and an answer of 7.59 V; using
the series total of 25 kilohm gives 25 ms and 3.96 V. Both are offered as
choices. The capacitor sees the Thevenin resistance, and a parallel combination
is always smaller than either resistor.

**A4 — 0.6 A and 34.5 ms.** $i(\\infty) = 48/80 = 0.6$ A and
$\\tau = L/R = 1.2/80 = 15$ ms. Ninety percent of the rise is

$$t = -\\tau \\ln (1 - 0.90) = 15 \\ln 10 = 34.5\\ \\text{ms}$$

*The trap.* Three time constants, 45 ms, corresponds to 95 %, not 90 %; two,
30 ms, corresponds to 86.5 %. The tempting shortcut of rounding 90 % to "about
three tau" is 30 % long. Note also that increasing $R$ here would make the
circuit **faster**, the opposite of the RC case.

**A5 — 705 V, 1.51 ms, 0.798 J.** Inductor current is continuous, so 1.5 A
immediately flows through the 470 ohm resistor:

$$v = 1.5 \\times 470 = 705\\ \\text{V}$$

The decay loop contains the winding and the bleeder in series:

$$\\tau = \\frac{L}{R + R_b} = \\frac{0.8}{530} = 1.51\\ \\text{ms}$$

The total stored energy is
$\\tfrac{1}{2}(0.8)(1.5)^2 = 0.9$ J, shared in proportion to resistance because
both carry the same current:
$0.9 \\times 470/530 = 0.798$ J in the bleeder.

*The trap.* Dividing the coil's supply voltage by anything, or assuming the
resistor sees the 90 V that drove 1.5 A through 60 ohm, misses the point
entirely: the voltage across a flyback element is set by the **current** the
inductor insists on maintaining, not by the supply it was connected to.

**A6 — 4.32 V, then 0.585 V.** $\\tau = 10^{4} \\times 10^{-8} = 100$
microseconds, so the 200 microsecond pulse is exactly $2\\tau$:

$$v_C(200\\ \\mu\\text{s}) = 5\\left(1 - e^{-2}\\right) = 5(0.8647) = 4.32\\ \\text{V}$$

When the input returns to zero the capacitor discharges from **that** value, not
from 5 V, through the same 10 kilohm:

$$v_C(400\\ \\mu\\text{s}) = 4.32\\,e^{-2} = 0.585\\ \\text{V}$$

*The trap.* Starting the discharge from the source voltage gives
$5e^{-2} = 0.677$ V, about 16 % high. The lesson generalises: in any sequence of
switching events, the final value of one interval is the initial value of the
next, and the capacitor never reaches the supply in finite time.`,
      examTip: 'Convert the elapsed time into time constants before doing anything else. Almost every wrong answer in a first-order problem comes from treating t as if it were a whole number of tau when the ratio is 1.45 or 2.3.',
    },
    {
      id: 'tr-pset-b',
      title: '8. Problem Set B — Second-Order Response and Switching',
      content: `The second set moves to circuits with two energy-storage elements
and to the switching hazards that follow from stored energy. The recurring traps
here are three: using the series damping formula on a parallel circuit, using the
undamped frequency where the damped one belongs, and forgetting that the slowest
root controls an overdamped response.

## 8.1 Problem Set B — the problems

**B1.** A series RLC circuit has R = 200 ohm, L = 50 mH and C = 0.5 microfarad.
Classify the response and give the frequency, in hertz, at which it rings.

**B2.** A series RLC circuit uses L = 20 mH and C = 80 nanofarad. What resistance
gives critical damping, and what is the undamped natural frequency?

**B3.** A second-order step response overshoots by 10 %. Find the damping ratio,
and if the undamped natural frequency is 5000 rad/s, find the time of the first
peak and the 2 % settling time.

**B4.** A parallel RLC circuit has R = 500 ohm, L = 10 mH and C = 1 microfarad.
Find the damping ratio and classify the natural response.

**B5.** A 470 microfarad capacitor charged to 400 V is discharged through a
2 ohm resistance. Find the initial current, the peak power, the stored energy and
the time constant.

**B6.** A ringing waveform shows successive peaks of 3.0 V and 1.8 V above its
final value, 250 microseconds apart. Find the damping ratio and the quality
factor.

## 8.2 Problem Set B — answers, worked in full

**B1 — underdamped, 955 Hz.** Compute the two parameters and compare them:

$$\\alpha = \\frac{R}{2L} = \\frac{200}{0.100} = 2000\\ \\text{s}^{-1}, \\qquad \\omega_0 = \\frac{1}{\\sqrt{(0.050)(0.5 \\times 10^{-6})}} = 6325\\ \\text{rad/s}$$

Since $\\alpha < \\omega_0$ the response is underdamped, with
$\\zeta = 2000/6325 = 0.316$ and

$$\\omega_d = \\sqrt{\\omega_0^2 - \\alpha^2} = \\sqrt{4.0 \\times 10^{7} - 4.0 \\times 10^{6}} = 6000\\ \\text{rad/s}$$

$$f_d = \\frac{6000}{2\\pi} = 954.9\\ \\text{Hz}$$

*The trap.* Using the undamped $\\omega_0$ instead of $\\omega_d$ gives
$6325/2\\pi = 1006.6$ Hz — about 5 % high, and always offered as a choice. A
circuit rings at its **damped** frequency; the undamped one is a construction
that exists only when R is zero.

**B2 — 1000 ohm and 25 000 rad/s.** Critical damping is $\\zeta = 1$, i.e.
$\\alpha = \\omega_0$:

$$R_{\\text{crit}} = 2\\sqrt{\\frac{L}{C}} = 2\\sqrt{\\frac{0.020}{80 \\times 10^{-9}}} = 2\\sqrt{250000} = 1000\\ \\Omega$$

$$\\omega_0 = \\frac{1}{\\sqrt{(0.020)(80 \\times 10^{-9})}} = \\frac{1}{\\sqrt{1.6 \\times 10^{-9}}} = 25000\\ \\text{rad/s}$$

which is 3979 Hz.

*The trap.* Dropping the factor of two gives 500 ohm, the characteristic
impedance $\\sqrt{L/C}$ rather than the critical resistance. That value is a real
quantity — it is the surge impedance of the LC pair — which is what makes it a
convincing wrong answer.

**B3 — zeta = 0.591, 0.779 ms, 1.35 ms.** Invert the overshoot formula:

$$\\ln M_p = \\frac{-\\pi \\zeta}{\\sqrt{1 - \\zeta^2}} \\;\\Longrightarrow\\; \\frac{\\zeta}{\\sqrt{1 - \\zeta^2}} = \\frac{-\\ln 0.10}{\\pi} = \\frac{2.303}{\\pi} = 0.7329$$

Squaring and rearranging gives $\\zeta^2 = 0.7329^2/(1 + 0.7329^2) = 0.3495$, so
$\\zeta = 0.591$. Then

$$\\omega_d = 5000\\sqrt{1 - 0.3495} = 4033\\ \\text{rad/s}, \\qquad t_p = \\frac{\\pi}{4033} = 0.779\\ \\text{ms}$$

$$t_s \\approx \\frac{4}{\\zeta \\omega_0} = \\frac{4}{(0.591)(5000)} = 1.35\\ \\text{ms}$$

*The trap.* Using $\\omega_0$ for the peak time gives
$\\pi/5000 = 0.628$ ms, 19 % low. At this damping the gap between $\\omega_0$ and
$\\omega_d$ is large enough that the error is unmistakable once you look for it.

**B4 — zeta = 0.1, underdamped.** For a **parallel** RLC the damping coefficient
is not $R/2L$:

$$\\alpha = \\frac{1}{2RC} = \\frac{1}{2(500)(10^{-6})} = 1000\\ \\text{s}^{-1}, \\qquad \\omega_0 = \\frac{1}{\\sqrt{(0.010)(10^{-6})}} = 10000\\ \\text{rad/s}$$

so $\\zeta = 0.1$, strongly underdamped, and
$\\omega_d = 10000\\sqrt{0.99} = 9950$ rad/s.

*The trap.* Reaching for the series formula gives
$\\alpha = R/2L = 500/0.020 = 25000$, hence $\\zeta = 2.5$ and the answer
"overdamped" — the opposite conclusion from a factor-of-25 error. Note also that
critical damping in this parallel circuit needs $R = \\tfrac{1}{2}\\sqrt{L/C} = 50$
ohm, so **reducing** the resistance is what damps it.

**B5 — 200 A, 80 kW, 37.6 J, 0.94 ms.** The capacitor holds its voltage through
the switching instant, so the full 400 V appears across 2 ohm:

$$i(0^{+}) = \\frac{400}{2} = 200\\ \\text{A}, \\qquad p(0^{+}) = 400 \\times 200 = 80\\ \\text{kW}$$

$$W = \\tfrac{1}{2}CV^2 = 0.5 (470 \\times 10^{-6})(400)^2 = 37.6\\ \\text{J}, \\qquad \\tau = RC = 0.94\\ \\text{ms}$$

*The trap.* The 80 kW is instantaneous, not average; the whole event is over in
about $5\\tau = 4.7$ ms and delivers only 37.6 J. Quoting 80 kW as a power rating
for the resistor confuses peak power with energy, and it is the reason inrush
resistors are specified in joules rather than watts.

**B6 — zeta = 0.081, Q = 6.17.** The peak ratio is $1.8/3.0 = 0.600$, so the
logarithmic decrement is

$$\\delta = \\ln \\frac{1}{0.600} = 0.5108, \\qquad \\zeta = \\frac{\\delta}{\\sqrt{4\\pi^2 + \\delta^2}} = \\frac{0.5108}{6.304} = 0.0810$$

$$Q = \\frac{1}{2\\zeta} = 6.17$$

As a cross-check, the 250 microsecond spacing gives
$\\omega_d = 2\\pi/250\\,\\mu\\text{s} = 25133$ rad/s and
$\\alpha = \\zeta \\omega_0 = 2043$ s$^{-1}$, an envelope time constant of
489 microseconds — about two ring periods, which matches a waveform whose second
peak is still 60 % of the first.

*The trap.* Using the ratio directly as a damping ratio, or setting
$\\zeta = \\delta/2\\pi = 0.0813$, gives an answer close enough to pass unnoticed
here but badly wrong at heavy damping, where the $\\sqrt{4\\pi^2 + \\delta^2}$
denominator matters. The simplified form is the small-$\\zeta$ limit of the
correct one, and the exam picks the case where the two separate.`,
      examTip: 'Write down alpha and omega_0 as two numbers before choosing any formula, and check which topology you have. alpha = R/2L is series only; alpha = 1/(2RC) is parallel only. The rest of the second-order machinery is identical for both.',
      importantNote: 'In an overdamped circuit the SLOWER root - the one closer to the origin - sets the settling time. Adding resistance past critical damping pushes that root toward the origin, so the circuit gets slower, not faster.',
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
