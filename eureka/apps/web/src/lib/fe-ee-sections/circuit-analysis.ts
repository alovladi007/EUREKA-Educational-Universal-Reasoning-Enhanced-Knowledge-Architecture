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

$$I = \\frac{12}{8.8} = 1.364\\ \\mathrm{A}, \\qquad V_{p} = 1.364 \\times 4.8 = 6.545\\ \\mathrm{V}$$

**Branch currents**, two ways. By Ohm's law on each branch,
$I_{2} = 6.545/6 = 1.091\\ \\mathrm{A}$ and
$I_{3} = 6.545/24 = 0.273\\ \\mathrm{A}$. By the divider,

$$I_{3} = I\\,\\frac{R_{2}}{R_{2} + R_{3}} = 1.364 \\times \\frac{6}{30} = 0.273\\ \\mathrm{A}$$

**Power balance**:

$$P_{source} = 12 \\times 1.364 = 16.36\\ \\mathrm{W}$$

$$P_{1} + P_{2} + P_{3} = (1.364)^{2}(4) + \\frac{(6.545)^{2}}{6} + \\frac{(6.545)^{2}}{24} = 7.44 + 7.14 + 1.79 = 16.36\\ \\mathrm{W}$$

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

$$V_R = 1.205\\times 30 = 36.16\\ \\mathrm{V}$$

$$V_L = 1.205\\times 37.70 = 45.44\\ \\mathrm{V}, \\qquad V_C = 1.205\\times 132.63 = 159.86\\ \\mathrm{V}$$

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
