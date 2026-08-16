// FE EE course content — Probability & Statistics (4 topics).
// Split byte-identically from fe-ee-course-data.ts so section waves
// can be authored in parallel; spread back into FE_EE_COURSE there.
import type { TopicLesson } from '../fe-ee-course-data';

export const FE_EE_PROBABILITY_STATISTICS: Record<string, TopicLesson> = {
fee_prob_dist: {
  topicId: 'fee_prob_dist',
  title: 'Probability Distributions',
  domainWeight: 'Probability & Statistics · 4–6%',
  overview: 'Probability distributions model uncertainty in engineering — from component failure rates to measurement errors. The FE exam tests binomial, Poisson, normal, and exponential distributions along with basic probability rules.',
  sections: [
    {
      id: 'pd-rules',
      title: '1. Probability Rules and Bayes Theorem',
      content: `## 1.1 Fundamental Rules

- **Range**: 0 ≤ P(A) ≤ 1
- **Complement**: P(A') = 1 - P(A)
- **Union (OR)**: P(A ∪ B) = P(A) + P(B) - P(A ∩ B)
- **Intersection (AND)**: P(A ∩ B) = P(A)·P(B|A)
- **Independent events**: P(A ∩ B) = P(A)·P(B) when A, B are independent
- **Conditional**: P(A|B) = P(A ∩ B)/P(B)

## 1.2 Bayes' Theorem

**$P(A|B) = P(B|A)\\cdot P(A) / P(B)$**

Bayes' theorem updates probabilities with new evidence. It reverses the conditioning:
- P(A) is the **prior** probability
- P(A|B) is the **posterior** probability after observing B
- P(B|A) is the **likelihood**

### Total Probability

P(B) = Σ P(B|Aᵢ)·P(Aᵢ) for all mutually exclusive events Aᵢ`,
      examTip: 'On the FE exam, Bayes\' theorem problems typically give P(B|A) and ask for P(A|B). Set up the formula carefully and use total probability for the denominator. Common context: diagnostic testing (given test positive, what is probability of actual defect?).',
    },
    {
      id: 'pd-distributions',
      title: '2. Common Probability Distributions',
      content: `## 2.1 Discrete Distributions

### Binomial Distribution
Models **n independent trials** with probability p of success each:

**$P(X=k) = C(n,k)\\cdot p^k\\cdot (1-p)^{n-k}$**

- Mean: E[X] = np
- Variance: Var(X) = np(1-p)

### Poisson Distribution
Models **rare events** with average rate λ:

**$P(X=k) = (\\lambda ^k \\cdot e^{-\\lambda}) / k!$**

- Mean = Variance = λ
- Approximates binomial when n is large, p is small, and λ = np

## 2.2 Continuous Distributions

### Normal (Gaussian) Distribution

**$f(x) = (1/(\\sigma \\cdot \\sqrt{2\\pi})) \\cdot e^{-(x-\\mu)^{2}/(2\\sigma ^{2})}$**

- **Standard normal**: Z = (X - μ)/σ (use Z-tables for probabilities)
- **68-95-99.7 rule**: ~68% within 1σ, ~95% within 2σ, ~99.7% within 3σ

### Exponential Distribution

**$f(t) = \\lambda \\cdot e^{-\\lambda t}$** for t ≥ 0

- Mean: 1/λ
- **Memoryless property**: P(T > t+s | T > s) = P(T > t)
- Models time between failures in reliability analysis

| Distribution | Type | Use Case | Key Parameter |
|---|---|---|---|
| Binomial | Discrete | Pass/fail in n trials | n, p |
| Poisson | Discrete | Rare event counts | λ (rate) |
| Normal | Continuous | Measurement errors | μ, σ |
| Exponential | Continuous | Time between failures | λ (failure rate) |`,
      examTip: 'Know which distribution fits the scenario: fixed number of trials with pass/fail → binomial; counting rare events per interval → Poisson; continuous measurement with bell shape → normal; time until failure → exponential. The FE reference has Z-tables for normal distribution.',
      importantNote: 'The exponential distribution is the ONLY continuous distribution with the memoryless property. This means the probability of surviving another hour is the same regardless of how long the component has already been running. This is unrealistic for wear-out failures but valid for random failures.',
    },
    {
      id: 'pd-counting',
      title: '3. Counting: Permutations and Combinations',
      content: `## 3.1 Why counting comes first

Most exam probabilities reduce to a ratio: outcomes you care about over outcomes
that exist. Both numbers are counts, and the counting rules decide whether a
question is trivial or hopeless. The only decision that matters is whether
**order counts as different**.

A **permutation** treats ABC and CBA as different arrangements:

**P(n, r) = n! / (n − r)!**

A **combination** treats them as the same selection:

**C(n, r) = n! / [r! (n − r)!]**

The two are linked by C(n, r) = P(n, r) / r!, because every unordered selection
of r items can be arranged r! ways. If you remember only one fact from this
section, make it that division: the combination count is always the permutation
count with the internal orderings collapsed.

| Question being asked | Does order matter? | Count with | Value for n = 10, r = 3 |
|---|---|---|---|
| Fill three distinct roles (lead, backup, reviewer) from ten engineers | yes | P(10, 3) = 10·9·8 | 720 |
| Pick a three-person team from ten, roles identical | no | C(10, 3) = 720 / 3! | 120 |
| Arrange all ten in a queue | yes | 10! | 3,628,800 |
| Split ten into a chosen three and a remaining seven | no | C(10, 3) = C(10, 7) | 120 |

The last row is the symmetry C(n, r) = C(n, n − r): choosing who is in is the
same act as choosing who is out. It also halves the arithmetic whenever r is
more than half of n.

## 3.2 Two counts, worked in FE style

**Selection without roles.** Given: 12 relays on a shelf, 2 to be pulled for a
routine test, and it does not matter which is tested first. Relation:
C(n, r) = n! / [r!(n − r)!]. Substitution: C(12, 2) = (12 × 11)/2 = **66
possible pairs**. If instead the first pulled relay becomes the primary and the
second the spare, order now matters: P(12, 2) = 12 × 11 = **132 ordered
choices** — exactly twice as many, because each pair can be ordered 2! ways.

**The at-least-one trick.** Given: a lot where each unit independently has a
0.05 chance of being defective; 10 units are shipped. Find the probability at
least one is defective. Counting the ways to have one, two, three or more
defects is ten separate binomial terms. The complement is one term:

P(at least one) = 1 − P(none) = 1 − (0.95)¹⁰ = 1 − 0.599 = **0.401**

Any question containing the words "at least one" should trigger this reflex.
The direct route gets the same answer and costs five minutes you do not have.

## 3.3 Total probability and Bayes, with numbers

Given: 2% of boards from a line are defective. An automated tester flags 95% of
defective boards, but also falsely flags 8% of good boards. A board has just
been flagged — what is the probability it is actually defective?

Relation: Bayes' theorem, with the total-probability sum in the denominator.

- P(flag | defective)·P(defective) = 0.95 × 0.02 = 0.019
- P(flag | good)·P(good) = 0.08 × 0.98 = 0.0784
- P(flag) = 0.019 + 0.0784 = 0.0974

P(defective | flag) = 0.019 / 0.0974 = **0.195**

Only one flagged board in five is actually bad. The intuition-breaker is the
**base rate**: good boards outnumber defective ones 49 to 1, so even an 8%
false-flag rate on the large population swamps a 95% catch rate on the small
one. The exam writes this problem with medical tests, smoke detectors and
inspection stations; the algebra never changes.`,
      examTip: 'Decide order-or-not before touching the formulas: roles, sequences, and rankings mean permutations; teams, samples, and hands mean combinations. If your combination answer is not smaller than the matching permutation answer, you have divided by the wrong factorial.',
    },
    {
      id: 'pd-ztable',
      title: '4. Working the Normal Table',
      content: `## 4.1 One curve for every normal problem

Normal distributions differ only in centre and width. The substitution

**z = (x − μ) / σ**

maps every one of them onto the standard normal with mean 0 and standard
deviation 1, which is the only curve the reference tables print. A z-value is a
distance from the mean measured in standard deviations, and that is the right
way to read it: z = 1.5 means one and a half standard deviations above centre,
whatever the units of the original problem were.

![The standard normal density with its one-, two- and three-sigma bands shaded. The percentages are computed from the error function: 68.3 percent of the area lies within one standard deviation, 95.4 within two, 99.7 within three.](/courses/fe-ee/figures/prob-normal-bands.svg)

## 4.2 The four table moves

The printed table gives the cumulative area Φ(z) = P(Z ≤ z) for positive z.
Every question is one of four manipulations of that number:

| You want | Use | Why it works |
|---|---|---|
| P(Z ≤ z), z positive | Φ(z) directly | that is the table entry |
| P(Z > z) | 1 − Φ(z) | total area is 1 |
| P(Z ≤ −z) | 1 − Φ(z) | the curve is symmetric |
| P(−a ≤ Z ≤ b) | Φ(b) − Φ(−a) | subtract cumulative areas |

A handful of entries recur so often they are worth recognising on sight
(values from the standard normal table):

| z | Φ(z) | Common role |
|---|---|---|
| 1.00 | 0.8413 | one sigma |
| 1.28 | 0.8997 | 90th percentile |
| 1.50 | 0.9332 | — |
| 1.645 | 0.9500 | 95% one-sided |
| 1.96 | 0.9750 | 95% two-sided |
| 2.33 | 0.9901 | 99% one-sided |
| 2.58 | 0.9951 | 99% two-sided |

## 4.3 Worked: a resistor tolerance question

Given: a production line makes resistors with mean 100 Ω and standard deviation
2 Ω, normally distributed. What fraction exceed 103 Ω?

Relation: z = (x − μ)/σ, then the tail from the table.

Substitution: z = (103 − 100)/2 = 1.50. Tail: P(Z > 1.5) = 1 − 0.9332 =
**0.0668, about 6.7%**.

Fraction between 97 and 103 Ω: by symmetry both limits are 1.5 sigma out, so
P = Φ(1.5) − Φ(−1.5) = 0.9332 − 0.0668 = **0.8664**.

The table also runs backwards. To set a one-sided screening limit that passes
99% of production: the z holding 0.99 below it is 2.33, so the limit is
x = μ + zσ = 100 + 2.33 × 2 = **104.7 Ω**. Forward questions convert x to z and
look up area; inverse questions start from the area, find z, and convert back.
Both directions appear on the exam, and a quick sketch of the curve with the
target area shaded prevents nearly every direction error.`,
      examTip: 'Always sketch the bell and shade what the question asks before touching the table. The table hands you area to the LEFT of z; every wrong answer choice is the area on the other side of the line you actually needed.',
    },
    {
      id: 'pd-worked',
      title: '5. Worked Problems Across the Distributions',
      content: `## 5.1 Binomial, exactly

Given: 20 boards are assembled, each independently with a 0.10 probability of a
soldering defect. Find the probability of exactly 2 defective boards.

Relation: P(X = k) = C(n, k) p^k (1 − p)^(n−k).

Substitution: C(20, 2) = 190; p² = 0.01; (0.9)¹⁸ = 0.1501.

P(X = 2) = 190 × 0.01 × 0.1501 = **0.285**

Mean and variance come free: E[X] = np = 2 defects expected, and
Var(X) = np(1 − p) = 1.8, so σ = 1.34. A quick sanity check on any binomial
answer is whether your k sits within a couple of σ of np — probabilities out
there are small, and probabilities near np are the big ones.

## 5.2 Poisson, and when it stands in for the binomial

The Poisson needs only the average rate. Given: a substation logs an average of
3 lightning-related trips per year. The probability of exactly 2 next year:

P(X = 2) = λ² e^(−λ) / 2! = 9 × 0.0498 / 2 = **0.224**

It is also the large-n, small-p limit of the binomial with λ = np. Redo the
board problem the Poisson way: λ = 20 × 0.10 = 2, so
P(X = 2) = 4 e^(−2) / 2 = **0.271** against the exact 0.285 — close, and the
agreement improves as n grows and p shrinks.

![Probability mass functions of the binomial with twenty trials at probability 0.1 and the Poisson with rate 2, side by side for each count. Matching the rate to np makes the two nearly coincide, which is the approximation used for rare events.](/courses/fe-ee/figures/prob-binomial-poisson.svg)

The practical rule: reach for the Poisson when events are rare individually but
you observe many opportunities — call arrivals, particle counts, surge events —
and reach for the binomial when the trial count is small enough to count on
your fingers.

## 5.3 Exponential: the waiting time

If events arrive Poisson at rate λ, the time between them is exponential.
Reliability is the standard costume: a component with constant failure rate
λ = 1/2000 per hour (a mean life of 2000 hours) survives past time t with
probability

**R(t) = e^(−λt)**

Given: find the probability it runs 3000 hours without failing.
Substitution: R(3000) = e^(−3000/2000) = e^(−1.5) = **0.223**.

Now the memoryless twist: the same component has already run 1000 hours. The
probability it survives 3000 MORE hours is still e^(−1.5) = 0.223. Nothing
about its history changes the arithmetic — that is what constant failure rate
means, and it is the single most-tested property of this distribution.

## 5.4 The chooser, one more time

| Scenario signature | Distribution | The formula you will need |
|---|---|---|
| Fixed n trials, each pass/fail | binomial | C(n,k) p^k (1−p)^(n−k) |
| Counts per interval at a known average rate | Poisson | λ^k e^(−λ) / k! |
| Continuous measurement clustered about a mean | normal | z = (x − μ)/σ, then the table |
| Waiting time between random events | exponential | R(t) = e^(−λt) |`,
      examTip: 'MTTF and failure rate are reciprocals: a 2000-hour mean life IS λ = 0.0005 per hour. Exam items quote one and expect the other, and the trap answer is always the one built from the un-inverted number.',
    },
    {
      id: 'pd-errors',
      title: '6. Where Marks Are Lost',
      content: `## 6.1 Five recurring errors

| Error | What it looks like | The fix |
|---|---|---|
| Permutation where a combination belongs | 720 teams instead of 120 | ask whether swapping two chosen items creates a new outcome |
| Adding P(A) and P(B) for overlapping events | probabilities that exceed 1 | subtract P(A ∩ B); only mutually exclusive events add cleanly |
| Reading the wrong side of the z-table | reporting Φ(z) when the question asked for the tail | sketch and shade before looking anything up |
| Poisson applied to common events | λ = np with p = 0.4 | the approximation needs rare events; use the exact binomial |
| Conditioning an exponential on age | discounting survival because the unit is old | memoryless: the remaining-life distribution never changes |

## 6.2 The habit that catches the rest

Every distribution on this exam has a mean you can compute in seconds: np for
the binomial, λ for the Poisson, μ as given for the normal, 1/λ for the
exponential. Before accepting any probability answer, ask where the question's
threshold sits relative to that mean. A "probability" of 0.45 for an outcome
four standard deviations from centre is wrong regardless of how carefully the
table was read, and this ten-second plausibility check flags mis-set z signs,
inverted rates and swapped parameters — the errors that survive careful
arithmetic because the arithmetic itself was done correctly on the wrong
setup.`,
      examTip: 'Distractors on probability items are manufactured from the four classic slips: the complement of the right answer, the permutation-for-combination count, the opposite table tail, and the un-inverted rate. If your answer matches an option, check it is not one of these four before moving on.',
    },
    {
      id: 'pd-axioms',
      title: '7. The Axioms Behind the Rules',
      content: `## 7.1 Three statements, and the rest is bookkeeping

Everything in Section 1 follows from three assumptions about a function that
assigns numbers to subsets of a sample space. Write the sample space as S, the
set of every outcome a single run of the experiment can produce, and call any
subset of S an event. A probability measure is a rule P that obeys

$$P(A) \\ge 0 \\quad \\text{for every event } A \\subseteq S$$

$$P(S) = 1$$

$$P\\left(\\bigcup_{i} A_{i}\\right) = \\sum_{i} P(A_{i}) \\quad \\text{whenever the } A_{i} \\text{ are pairwise disjoint}$$

Nothing else is assumed. The familiar rules are theorems, and deriving them
once is worth more than memorising them five times, because a derived rule
tells you where its own edge is.

Take the complement. S splits into A and everything outside A, and those two
pieces share no outcome, so the third axiom applies and the second fixes the
total:

$$1 = P(S) = P(A) + P(A^{c}) \\quad \\Longrightarrow \\quad P(A^{c}) = 1 - P(A)$$

Take the union of two events that DO overlap. Split the union into a disjoint
pair, then split B the same way:

$$P(A \\cup B) = P(A) + P(B \\cap A^{c})$$

$$P(B) = P(A \\cap B) + P(B \\cap A^{c})$$

Solve the second for the piece appearing in the first and substitute:

$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$

The subtraction is not a correction bolted on afterwards; it is what falls out
when the overlap is counted once instead of twice. Repeating the argument for
three events gives the alternating pattern

$$P(A \\cup B \\cup C) = P(A) + P(B) + P(C) - P(A \\cap B) - P(A \\cap C) - P(B \\cap C) + P(A \\cap B \\cap C)$$

Two more consequences fall straight out and are worth stating because they
double as answer filters. Since the empty set is disjoint from itself,
P(empty) = 0. And if every outcome in A also lies in B, then B is A plus a
disjoint remainder whose probability cannot be negative, so

$$A \\subseteq B \\quad \\Longrightarrow \\quad P(A) \\le P(B)$$

That monotonicity is the reason a probability computed for a narrower event may
never exceed one computed for a wider one. When a multi-part answer violates
it, the error is upstream of the arithmetic.

## 7.2 Worked: three inspection stations, counted two ways

Given: a run of 500 assembled boards passes three independent checks. 80 fail
the visual check (event A), 60 fail the in-circuit test (event B) and 40 fail
the functional test (event C). Of those, 25 fail both A and B, 18 fail both A
and C, 15 fail both B and C, and 8 fail all three. Find the probability that a
board picked at random from the run failed at least one check.

Relation: the three-event inclusion-exclusion identity above, divided by 500.

Substitution, first as a count:

$$80 + 60 + 40 - 25 - 18 - 15 + 8 = 130$$

$$130 / 500 = 0.26$$

The second route does no subtracting at all. Peel the population into the seven
disjoint regions of the Venn diagram, each obtained by removing the boards that
also belong to a larger overlap:

| Region | Count from the givens | Boards |
|---|---|---|
| A only | 80 − 25 − 18 + 8 | 45 |
| B only | 60 − 25 − 15 + 8 | 28 |
| C only | 40 − 18 − 15 + 8 | 15 |
| A and B, not C | 25 − 8 | 17 |
| A and C, not B | 18 − 8 | 10 |
| B and C, not A | 15 − 8 | 7 |
| all three | given | 8 |

Those seven counts total 130, which is the inclusion-exclusion answer arrived
at by a route that never subtracted an over-count because it never created
one. Two things follow. Every cell came out non-negative, which is the test
that the stated overlaps are mutually consistent — a stem that produced a
negative cell would be describing an impossible run. And the boards that
cleared everything number 500 − 130 = 370, a probability of 0.74.

The plus-eight at the end of the identity is where marks go. Subtracting the
three pairwise overlaps removes the triple overlap three times, having added it
three times, so it must be put back once. Any three-event union problem whose
answer forgets that term lands on 122 boards and 0.244 instead of 130 and 0.26.

## 7.3 Worked: when the complement is the short road

Given: eight cable joints are made independently, each with probability 0.03 of
needing rework. Find the probability that at least one needs rework.

Relation: the complement rule, with independence turning the intersection into
a product.

$$P(\\text{at least one}) = 1 - P(\\text{none}) = 1 - (1 - 0.03)^{8}$$

Substitution: $0.97^{8} = 0.7837$, so the answer is $1 - 0.7837 = 0.2163$, near
enough 21.6%.

Now compare the direct route: eight separate binomial terms for one, two,
three, four, five, six, seven and eight reworks, added. It gives the same
0.2163 and costs eight times the arithmetic. The complement collapses "at least
one" into one subtraction every time, and the phrase "at least one" in a stem
should trigger it before the pencil moves.

The same reflex handles "at least two", though with one extra term:

$$P(X \\ge 2) = 1 - P(0) - P(1) = 1 - 0.97^{8} - 8(0.03)(0.97)^{7}$$

which evaluates to 0.02231. Note how much smaller that is than 0.2163 — nearly
all of the at-least-one probability is the single-rework case, which is the
signature of a rare independent event and the reason the next sections spend
so long on it.`,
      examTip: 'Read the three-event union formula off its sign pattern: singles add, pairs subtract, the triple adds back. If a stem gives you every pairwise overlap and the triple overlap, it wants inclusion-exclusion; if it gives you only P(A) and P(B) and calls the events mutually exclusive, the overlaps are zero and the whole thing collapses to addition.',
      importantNote: 'Mutually exclusive and independent are opposite conditions, not synonyms. Mutually exclusive events cannot both occur, so P(A ∩ B) = 0 and knowing A happened tells you B did not — which is maximal dependence. Two events with non-zero probability can be one or the other, never both.',
    },
    {
      id: 'pd-bayes2',
      title: '8. Conditioning, Independence and the Base Rate',
      content: `## 8.1 Conditioning is renormalising

The conditional probability of A given B restricts attention to the outcomes in
B and rescales so that the restricted world has total probability one:

$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}, \\qquad P(B) > 0$$

Rearranged, that is the multiplication rule, and chaining it across three
events gives the form used for sequential draws:

$$P(A \\cap B) = P(B)\\,P(A \\mid B) = P(A)\\,P(B \\mid A)$$

$$P(A \\cap B \\cap C) = P(A)\\,P(B \\mid A)\\,P(C \\mid A \\cap B)$$

Independence is the special case where the conditioning changes nothing:

$$P(A \\mid B) = P(A) \\quad \\Longleftrightarrow \\quad P(A \\cap B) = P(A)\\,P(B)$$

The product form is the better working definition because it is symmetric and
it survives P(B) = 0. It also makes the standard exam check mechanical:
multiply the two marginals and compare with the stated joint. If they differ,
the events are dependent, whatever the stem's wording suggests.

Beyond two events, independence has to be checked on every subcollection.
Three events are mutually independent only when all four of these hold:

$$P(A \\cap B) = P(A)P(B), \\quad P(A \\cap C) = P(A)P(C), \\quad P(B \\cap C) = P(B)P(C)$$

$$P(A \\cap B \\cap C) = P(A)\\,P(B)\\,P(C)$$

Pairwise independence does not imply the triple product, which is why
reliability models that assume "independent components" have to earn the
assumption on shared power, shared cooling and shared maintenance crews rather
than assert it.

## 8.2 Total probability, then Bayes

Partition the sample space into mutually exclusive cases that between them
cover everything. Every event B is then the disjoint union of its slices, and
the third axiom adds them:

$$P(B) = \\sum_{i} P(B \\mid A_{i})\\,P(A_{i})$$

Bayes' theorem is nothing more than the two ways of writing the joint
probability, divided:

$$P(A_{j} \\mid B) = \\frac{P(B \\mid A_{j})\\,P(A_{j})}{P(B)} = \\frac{P(B \\mid A_{j})\\,P(A_{j})}{\\sum_{i} P(B \\mid A_{i})\\,P(A_{i})}$$

The numerator is one slice; the denominator is every slice. The result is
therefore a share, and it can never exceed one no matter how convincing the
evidence — a useful check on an answer that comes out at 1.4.

An equivalent form carries the intuition better. Divide the posterior for A by
the posterior for its complement and the denominators cancel:

$$\\frac{P(A \\mid B)}{P(A^{c} \\mid B)} = \\frac{P(A)}{P(A^{c})} \\times \\frac{P(B \\mid A)}{P(B \\mid A^{c})}$$

In words: posterior odds equal prior odds times the likelihood ratio. Evidence
multiplies the odds you started with. If the odds you started with are long,
strong evidence still leaves them long.

## 8.3 Worked: a very good test for a very rare fault

Given: a fault is present in 0.4% of units in service. A diagnostic flags 99%
of faulty units (sensitivity 0.99) and correctly clears 96% of sound ones
(specificity 0.96, so the false-flag rate is 0.04). A unit has just been
flagged. Find the probability it is genuinely faulty.

Relation: Bayes with the total-probability sum in the denominator.

Substitution, one term at a time:

$$P(\\text{flag} \\cap \\text{fault}) = 0.99 \\times 0.004 = 0.00396$$

$$P(\\text{flag} \\cap \\text{sound}) = 0.04 \\times 0.996 = 0.03984$$

$$P(\\text{flag}) = 0.00396 + 0.03984 = 0.0438$$

$$P(\\text{fault} \\mid \\text{flag}) = 0.00396 / 0.0438 = 0.0904$$

Nine percent. A test that catches 99 faults in 100 delivers a flag that is
wrong more than nine times in ten, and the reason is arithmetic rather than
metrology: sound units outnumber faulty ones 249 to 1, so a 4% error rate on
the huge group produces ten times as many flags as a 99% catch rate on the tiny
one. The odds form says the same thing in one line — prior odds
0.004/0.996 = 0.004016, likelihood ratio 0.99/0.04 = 24.75, posterior odds
0.09940, which is a probability of 0.0904.

![Posterior probability of the fault plotted against how common the fault is, for a test with sensitivity 0.99 and specificity 0.96. One positive result at a prevalence of 0.4 percent leaves the posterior at 9.0 percent; two independent positives lift it to 71.1 percent. The curve is steep only where the condition is already fairly common.](/courses/fe-ee/figures/prob2-bayes-baserate.svg)

The negative result is the mirror image and is worth one line of arithmetic
because it is the number a maintenance planner actually uses:

$$P(\\text{fault} \\mid \\text{clear}) = \\frac{0.01 \\times 0.004}{0.01 \\times 0.004 + 0.96 \\times 0.996} = 0.0000418$$

About one in 23,900. On a rare fault, a clear result is extremely informative
and a flag is barely informative at all — the asymmetry the exam is testing.

## 8.4 Worked: the second test, and why it changes everything

Given: the same unit is tested a second time with an independent instrument of
identical sensitivity and specificity, and flags again. Find the updated
probability.

Relation: conditional independence of the two results given the true state
turns each likelihood into a square.

$$P(\\text{fault} \\mid \\text{two flags}) = \\frac{0.99^{2} \\times 0.004}{0.99^{2} \\times 0.004 + 0.04^{2} \\times 0.996}$$

Substitution: the numerator is $0.9801 \\times 0.004 = 0.0039204$ and the second
term of the denominator is $0.0016 \\times 0.996 = 0.0015936$, so

$$0.0039204 / 0.0055140 = 0.7110$$

From 9.0% to 71.1% on one repeat. The odds form explains the jump without any
new arithmetic: each independent flag multiplies the odds by 24.75, so two
flags multiply by 612.6, and 0.004016 × 612.6 = 2.460 in odds, which is 0.711
as a probability. Rare things need two pieces of evidence, and the exam's
favourite disguise for this is a stem that quotes a confirmatory retest.

| Quantity | Symbol used here | Value in the worked case |
|---|---|---|
| Prevalence (prior) | P(fault) | 0.004 |
| Sensitivity | P(flag given fault) | 0.99 |
| Specificity | P(clear given sound) | 0.96 |
| False-flag rate | 1 − specificity | 0.04 |
| Flag rate overall | P(flag) | 0.0438 |
| Posterior after one flag | P(fault given flag) | 0.0904 |
| Posterior after two flags | P(fault given two flags) | 0.7110 |

The trap answers on an item like this are 0.99 (reading sensitivity as the
answer), 0.96 (reading specificity), and 0.0438 (stopping at the denominator).
All three appear because all three are numbers the stem handed you.`,
      examTip: 'Build the denominator before touching the fraction. Write the two products P(evidence given cause) × P(cause) and P(evidence given no cause) × P(no cause), add them, and only then divide. Almost every wrong Bayes answer is a right numerator over a wrong denominator.',
      importantNote: 'Sensitivity and positive predictive value answer different questions and are equal only by coincidence. Sensitivity conditions on the true state and is a property of the instrument; predictive value conditions on the reading and depends on how common the condition is. Moving a test from a general population to a pre-screened one changes its predictive value without touching its sensitivity.',
    },
    {
      id: 'pd-counting2',
      title: '9. Counting Rules in Full',
      content: `## 9.1 One principle, four formulas

Every counting rule on this exam descends from the multiplication principle: if
a task is a sequence of stages and stage i can be completed n_i ways regardless
of the earlier choices, the whole task can be completed in the product of the
stage counts. Everything below is that principle with a specific bookkeeping
question attached.

Ordered selection with replacement — each of r positions independently takes
any of n values:

$$N = n^{r}$$

Ordered selection without replacement — the pool shrinks by one each time:

$$P(n, r) = n(n-1)(n-2)\\cdots(n-r+1) = \\frac{n!}{(n-r)!}$$

Unordered selection without replacement — divide out the r! orderings of each
chosen set:

$$C(n, r) = \\binom{n}{r} = \\frac{n!}{r!\\,(n-r)!} = \\frac{P(n,r)}{r!}$$

Arrangements of a multiset — n items of which n_1 are of one indistinguishable
kind, n_2 of another, and so on:

$$N = \\frac{n!}{n_{1}!\\,n_{2}!\\cdots n_{k}!}$$

Two identities save real time. The symmetry

$$\\binom{n}{r} = \\binom{n}{n-r}$$

lets you choose the smaller side, and Pascal's relation

$$\\binom{n}{r} = \\binom{n-1}{r-1} + \\binom{n-1}{r}$$

builds any binomial coefficient from smaller ones by splitting on whether a
nominated item is in or out. The same coefficients are the ones multiplying the
terms of a binomial expansion, which is exactly why they turn up in the
binomial distribution two sections from now.

| Situation | Order matters? | Repeats allowed? | Count |
|---|---|---|---|
| PIN of length 4 from 10 digits | yes | yes | 10 to the 4th = 10,000 |
| Podium finish, 3 places from 8 runners | yes | no | P(8,3) = 336 |
| Committee of 3 from 8 | no | no | C(8,3) = 56 |
| Letters of a word with repeated letters | yes | fixed multiset | n! over the factorials of the repeats |

## 9.2 Turning a count into a probability

When every outcome of a finite sample space is equally likely — and only then —

$$P(A) = \\frac{\\text{number of outcomes in } A}{\\text{number of outcomes in } S}$$

The equally-likely clause is the whole game. Drawing three cards, every
three-card set is equally likely, so counting works. Summing two dice, the
eleven possible totals are NOT equally likely, so counting totals fails while
counting the 36 ordered pairs succeeds. Whenever a counting answer feels wrong,
check that the objects being counted are the ones with equal probability.

## 9.3 Worked: arrangements when items repeat

Given: a burn-in rack holds nine slots in a row, to be filled with four
identical type-A modules, three identical type-B modules and two identical
type-C modules. How many distinguishable loadings exist?

Relation: the multiset formula, because swapping two type-A modules produces
the same visible rack.

Substitution: $9! = 362880$ and $4!\\,3!\\,2! = 24 \\times 6 \\times 2 = 288$, so

$$362880 / 288 = 1260$$

The check that matters here is conceptual, and it is available cheaply. If all
nine modules were distinguishable there would be 362,880 loadings; the four
identical A modules can be permuted 24 ways among their chosen slots without
changing anything, the three B modules 6 ways and the two C modules 2 ways, and
those permutations are independent of one another, so each visible loading has
been counted 288 times. The trap answer 362,880 is the one that forgets the
modules are interchangeable, and it is 288 times too large.

An equivalent route reaches the same number by choosing slots instead of
arranging modules: pick which 4 of the 9 slots hold A, then which 3 of the
remaining 5 hold B, and C takes what is left.

$$\\binom{9}{4}\\binom{5}{3}\\binom{2}{2} = 126 \\times 10 \\times 1 = 1260$$

Two independent routes, one answer. When a counting problem allows both, doing
both takes twenty seconds and removes all doubt.

## 9.4 Worked: sampling a lot without replacement

Given: a lot of 20 relays contains 5 that are out of tolerance. Four are drawn
at random, all at once. Find the probability that exactly one drawn relay is
out of tolerance, and the probability that none is.

Relation: count the favourable sets and divide by the total sets, since every
4-relay set is equally likely.

$$P(X = 1) = \\frac{\\binom{5}{1}\\binom{15}{3}}{\\binom{20}{4}} = \\frac{5 \\times 455}{4845}$$

Substitution: $5 \\times 455 = 2275$, and $2275 / 4845 = 0.4696$.

For none out of tolerance, all four come from the 15 good relays:

$$P(X = 0) = \\frac{\\binom{15}{4}}{\\binom{20}{4}} = 1365 / 4845 = 0.2817$$

The sample space here is small enough to settle by brute force: of the 4,845
four-relay subsets of the lot, 2,275 contain exactly one bad relay and 1,365
contain none, which is where those two fractions come from. The remaining 1,205
subsets carry two, three or four bad relays.

Contrast the answer you would get by treating each draw as an independent trial
at p = 5/20 = 0.25, which is what the binomial assumes:

$$\\binom{4}{1}(0.25)^{1}(0.75)^{3} = 4 \\times 0.25 \\times 0.421875 = 0.4219$$

That is 0.4219 against the correct 0.4696 — a 10% relative error, because
removing one bad relay from a 20-relay lot really does change the odds for the
next draw. The binomial is the with-replacement model; the count above is the
without-replacement one. Section 10 gives the second its name.`,
      examTip: 'Sampling "all at once" and sampling "one after another without replacement" are the same probability problem, because a set has no order. If a stem says the items are drawn together, you may still work it draw by draw with conditional probabilities and you will get the same number.',
    },
    {
      id: 'pd-discrete2',
      title: '10. The Discrete Families, Derived',
      content: `## 10.1 Start from the single trial

A Bernoulli variable takes the value 1 with probability p and 0 otherwise. Its
two moments are immediate, and because squaring leaves 0 and 1 alone the second
moment equals the first:

$$E[X] = 0(1-p) + 1(p) = p$$

$$E[X^{2}] = 0^{2}(1-p) + 1^{2}(p) = p$$

$$\\mathrm{Var}(X) = E[X^{2}] - (E[X])^{2} = p - p^{2} = p(1-p)$$

That last expression peaks at p = 0.5, where a single trial is least
predictable, and vanishes at p = 0 and p = 1, where it is not random at all.

## 10.2 Binomial: counting successes in a fixed number of trials

Modelling assumptions, all four of which have to hold: a FIXED number n of
trials, each with only two outcomes, a CONSTANT success probability p, and
INDEPENDENCE between trials. Break any one and the binomial is the wrong tool —
the without-replacement draw of Section 9.4 breaks the third and fourth
together.

The pmf counts the arrangements of k successes among n slots and weights each
by its probability:

$$P(X = k) = \\binom{n}{k} p^{k} (1-p)^{n-k}, \\qquad k = 0, 1, \\ldots, n$$

The moments are easiest to get without touching that formula. Write the count
as a sum of n Bernoulli indicators, one per trial:

$$X = X_{1} + X_{2} + \\cdots + X_{n}$$

Expectation is linear whether or not the terms are independent, so

$$E[X] = \\sum_{i=1}^{n} E[X_{i}] = np$$

Variance adds only because the trials ARE independent, which is exactly where
that assumption is spent:

$$\\mathrm{Var}(X) = \\sum_{i=1}^{n} \\mathrm{Var}(X_{i}) = np(1-p)$$

Note the standard deviation grows like the square root of n while the mean
grows like n, so the count becomes proportionally more predictable as the batch
gets larger — the reason sampling plans specify a sample size rather than a
sample fraction.

## 10.3 Poisson: counting events in a window

Assumptions: events occur at a constant average rate, in non-overlapping
intervals independently, and never two at exactly the same instant. Then the
count in a window of any length has

$$P(X = k) = \\frac{\\lambda^{k} e^{-\\lambda}}{k!}, \\qquad k = 0, 1, 2, \\ldots$$

where lambda is the expected number of events in that window — rate times
window length, so doubling the window doubles lambda. Summing the pmf recovers
the exponential series and confirms it is a distribution. The mean comes from
cancelling one factor of k against the factorial:

$$E[X] = \\sum_{k=0}^{\\infty} k\\,\\frac{\\lambda^{k} e^{-\\lambda}}{k!} = \\lambda \\sum_{k=1}^{\\infty} \\frac{\\lambda^{k-1} e^{-\\lambda}}{(k-1)!} = \\lambda$$

The same trick twice gives the factorial moment, and the variance follows:

$$E[X(X-1)] = \\lambda^{2} \\quad \\Longrightarrow \\quad \\mathrm{Var}(X) = \\lambda^{2} + \\lambda - \\lambda^{2} = \\lambda$$

Mean equals variance is the Poisson's fingerprint. Count data whose sample
variance badly exceeds its sample mean is telling you the events cluster, and
the Poisson model is wrong.

## 10.4 Geometric and hypergeometric

The geometric counts trials up to and including the first success, under the
same assumptions as the binomial but with n unbounded:

$$P(X = k) = (1-p)^{k-1} p, \\qquad k = 1, 2, 3, \\ldots$$

$$P(X > m) = (1-p)^{m}$$

Its mean follows from a one-line self-consistency argument that avoids summing
any series. Spend one trial. With probability p you are done; with probability
1 − p you face a fresh copy of the identical problem:

$$E[X] = 1 + (1-p)\\,E[X] \\quad \\Longrightarrow \\quad E[X] = \\frac{1}{p}$$

$$\\mathrm{Var}(X) = \\frac{1-p}{p^{2}}$$

The survival form is the discrete memoryless property, and it is the discrete
twin of the exponential result proved in Section 12.

The hypergeometric is the binomial with the replacement removed. A population
of N contains K marked items; n are drawn together:

$$P(X = k) = \\frac{\\binom{K}{k}\\binom{N-K}{n-k}}{\\binom{N}{n}}$$

$$E[X] = n\\frac{K}{N}$$

$$\\mathrm{Var}(X) = n\\frac{K}{N}\\left(1 - \\frac{K}{N}\\right)\\frac{N-n}{N-1}$$

The mean matches the binomial exactly, because linearity of expectation does
not care that the draws are dependent. The variance does not match: the last
factor, the finite population correction, is always at most 1 and pulls the
spread below the binomial value. Sampling without replacement is more
informative per draw, and the correction is how much more. When n is a small
fraction of N the correction is close to 1 and the binomial is a safe stand-in;
the usual working threshold is a sample below about 5% of the population.

![Four discrete laws drawn as small multiples, each from its own probability formula: the binomial for twelve breakers at probability 0.08, the Poisson for 3.4 arrivals an hour, the geometric for the trial number of the first success at probability 0.15, and the hypergeometric for four items drawn from a lot of twenty containing five defectives.](/courses/fe-ee/figures/prob2-discrete-family.svg)

| Family | Question it answers | Parameters | Mean | Variance |
|---|---|---|---|---|
| Bernoulli | did this one trial succeed | p | p | p(1 − p) |
| Binomial | how many successes in n fixed trials | n, p | np | np(1 − p) |
| Poisson | how many events in this window | λ | λ | λ |
| Geometric | how many trials until the first success | p | 1/p | (1 − p)/p² |
| Hypergeometric | how many marked items in a draw of n from N | N, K, n | nK/N | nK/N (1 − K/N)(N − n)/(N − 1) |

## 10.5 Worked: breakers, arrivals and first successes

**Binomial.** Given: 12 breakers are commanded to trip, each independently
failing to trip with probability 0.08. Find the probability that at most one
fails.

Relation: P(X ≤ 1) = P(0) + P(1) from the binomial pmf.

Substitution: $0.92^{12} = 0.36767$ and $12 \\times 0.08 \\times 0.92^{11} = 0.38365$, so

$$0.36767 + 0.38365 = 0.75132$$

Roughly a one-in-four chance that two or more breakers fail — an unacceptable
number for a protection scheme, which is the engineering point of the
calculation. The mean count is np = 0.96 failures and the variance is
$12 \\times 0.08 \\times 0.92 = 0.8832$, giving a standard deviation of 0.94.

**Poisson.** Given: a feeder logs an average of 3.4 momentary interruptions per
hour. Find the probability that an hour contains two or more.

Relation: the complement, so only the k = 0 and k = 1 terms are needed.

Substitution: the two terms share the factor $e^{-3.4} = 0.033373$, and their
bracket is 1 + 3.4, so

$$P(X \\ge 2) = 1 - e^{-3.4}(1 + 3.4) = 1 - 0.14684 = 0.85316$$

Doubling the window to two hours doubles lambda to 6.8; it does not square
anything, and the answer choice built by squaring is the standard distractor.

**Geometric.** Given: an automatic reclose succeeds with probability 0.15 on
each attempt, independently. Find the probability the first success comes on
the fourth attempt, and the mean number of attempts.

Relation: three failures then a success.

$$P(X = 4) = (0.85)^{3}(0.15) = 0.614125 \\times 0.15 = 0.09212$$

The mean is 1/0.15 = 6.67 attempts with a standard deviation of 6.15 — nearly
as large as the mean, which is characteristic of the geometric and is why
"average time to success" is a poor planning number for this distribution. The
chance of still failing after four attempts is $0.85^{4} = 0.52201$, so more
than half the time four tries are not enough.`,
      examTip: 'Identify the family from what is being counted, not from the cover story. Counting successes out of a fixed n is binomial; counting events in a window is Poisson; counting trials until something happens is geometric; counting marked items in a draw from a finite pool with no replacement is hypergeometric. The same substation can generate all four.',
      importantNote: 'The hypergeometric mean equals the binomial mean, nK/N against np with p = K/N, but the variances differ by the factor (N − n)/(N − 1). An exam item that gives a lot size is signalling that the correction matters; one that says "a large shipment" is signalling that it does not.',
    },
    {
      id: 'pd-poisson-limit',
      title: '11. The Poisson Limit of the Binomial',
      content: `## 11.1 Why the two families meet

Hold the expected count fixed at lambda while letting the number of trials grow
and the per-trial probability shrink to match, p = lambda/n. The binomial pmf
then converges term by term to the Poisson pmf:

$$\\lim_{n \\to \\infty} \\binom{n}{k}\\left(\\frac{\\lambda}{n}\\right)^{k}\\left(1 - \\frac{\\lambda}{n}\\right)^{n-k} = \\frac{\\lambda^{k} e^{-\\lambda}}{k!}$$

The proof splits the left side into three pieces, each with its own limit.
Write the binomial coefficient as a falling factorial over k!:

$$\\binom{n}{k}\\left(\\frac{\\lambda}{n}\\right)^{k} = \\frac{n(n-1)\\cdots(n-k+1)}{n^{k}} \\cdot \\frac{\\lambda^{k}}{k!}$$

The fraction on the left is a product of k terms each tending to 1. The
remaining factor splits as well:

$$\\left(1 - \\frac{\\lambda}{n}\\right)^{n-k} = \\left(1 - \\frac{\\lambda}{n}\\right)^{n}\\left(1 - \\frac{\\lambda}{n}\\right)^{-k}$$

The first factor is the classical limit definition of $e^{-\\lambda}$ and the
second tends to 1. Multiplying the three limits gives the Poisson pmf. Nothing
in the argument requires k to be small, so the convergence is for the whole
distribution, not just its low end.

## 11.2 How fast, in numbers

Convergence proofs say nothing about whether an approximation is usable at
n = 40. The table below answers that directly for lambda = 2, comparing the
exact binomial probability of exactly two events against the Poisson value
0.27067, and reporting the largest gap over ALL counts k rather than only the
convenient one.

| n | p = 2/n | binomial P(X = 2) | Poisson P(X = 2) | largest gap over all k |
|---|---|---|---|---|
| 10 | 0.200 | 0.30199 | 0.27067 | 0.03132 |
| 20 | 0.100 | 0.28518 | 0.27067 | 0.01451 |
| 50 | 0.040 | 0.27623 | 0.27067 | 0.00556 |
| 200 | 0.010 | 0.27203 | 0.27067 | 0.00136 |
| 1000 | 0.002 | 0.27094 | 0.27067 | 0.00027 |

The gap falls by roughly the factor n rises. From n = 20 to n = 200, a factor
of ten in trials buys a factor of ten in accuracy, and the product of n and the
largest gap settles near 0.27 rather than drifting — which is what "the error
is of order 1/n" means in practice.

![Largest absolute difference between the binomial and Poisson probability mass functions plotted against the number of trials on logarithmic axes, with the trial probability set to 2 over n so the expected count stays at two. The worst gap over all counts falls from 0.031 at ten trials to 0.00027 at a thousand, tracking the dashed pure one-over-n reference line drawn through the twenty-trial point.](/courses/fe-ee/figures/prob2-poisson-limit.svg)

The working rules follow from the table rather than from authority. Below about
n = 20 the approximation is worth a few percent of absolute probability and
should not be used when the exact binomial is available. By n = 50 with p at
0.04 the error is under 0.006. The conditions usually quoted, n at least 20
with p at most 0.05, or n at least 100 with np at most 10, both land in the
region where the table shows errors in the third decimal place.

## 11.3 Worked: the same question three ways

Given: 200 solder joints are inspected, each independently defective with
probability 0.01. Find the probability that exactly two are defective.

Route one, exact binomial:

$$P(X = 2) = \\binom{200}{2}(0.01)^{2}(0.99)^{198} = 0.27203$$

Route two, Poisson with lambda = np = 2:

$$P(X = 2) = \\frac{2^{2} e^{-2}}{2!} = \\frac{4 \\times 0.135335}{2} = 0.27067$$

Route three, the normal approximation of Section 14, which needs np at least
about 5 and therefore does NOT apply here — np is 2. Attempting it anyway gives
a badly wrong answer, and recognising that it is inapplicable is itself a
common exam question.

The binomial and Poisson answers differ by 0.00136, a relative error of half a
percent, which is well inside the precision of the 0.01 defect rate that was
handed to you. That is the real justification for the approximation: it is
accurate to better than the input data.

Now flip one number. Given the same 200 joints but a defect probability of
0.40, the Poisson with lambda = 80 is useless — its variance would be 80 while
the binomial variance is $200 \\times 0.4 \\times 0.6 = 48$, and a model that
overstates the spread by two thirds is not an approximation. Rare events, not
merely many trials, is the condition that matters.`,
      examTip: 'When a stem gives n and p and asks for a probability, compute np first. If np is under about 5 and p is small, the Poisson is available and faster. If np and n(1 − p) both exceed about 5, the normal approximation of Section 14 is available instead. If neither, the exact binomial is the only honest route.',
    },
    {
      id: 'pd-continuous2',
      title: '12. Continuous Models and the Memoryless Proof',
      content: `## 12.1 Densities, not probabilities

A continuous random variable is described by a density f, and the density is
not a probability — it is a probability per unit of x, and it may exceed 1. The
rules are

$$f(x) \\ge 0, \\qquad \\int_{-\\infty}^{\\infty} f(x)\\,dx = 1$$

$$P(a \\le X \\le b) = \\int_{a}^{b} f(x)\\,dx$$

$$F(x) = P(X \\le x) = \\int_{-\\infty}^{x} f(u)\\,du, \\qquad f(x) = \\frac{dF}{dx}$$

One consequence catches people out. The integral over a single point is zero,
so

$$P(X = c) = 0 \\quad \\text{for every } c$$

and therefore the endpoints do not matter: P(X < c) and P(X ≤ c) are the same
number. For discrete variables they are not, which is the entire content of the
continuity correction in Section 14.

## 12.2 Uniform: the flat case, integrated

When nothing is known but the limits, the density is constant:

$$f(x) = \\frac{1}{b-a}, \\qquad a \\le x \\le b$$

$$E[X] = \\int_{a}^{b} \\frac{x}{b-a}\\,dx = \\frac{b^{2}-a^{2}}{2(b-a)} = \\frac{a+b}{2}$$

$$E[X^{2}] = \\int_{a}^{b} \\frac{x^{2}}{b-a}\\,dx = \\frac{b^{3}-a^{3}}{3(b-a)} = \\frac{a^{2}+ab+b^{2}}{3}$$

$$\\mathrm{Var}(X) = \\frac{a^{2}+ab+b^{2}}{3} - \\frac{(a+b)^{2}}{4} = \\frac{(b-a)^{2}}{12}$$

The 12 is not a convention to memorise; it is what the algebra leaves behind
after the common denominator. This is the model for quantisation error, for a
dimension known only to its tolerance band, and for the phase of an
unsynchronised signal.

## 12.3 Exponential: waiting for a Poisson event

If events arrive Poisson at rate lambda, the wait for the next one has

$$f(t) = \\lambda e^{-\\lambda t}, \\qquad F(t) = 1 - e^{-\\lambda t}, \\qquad R(t) = e^{-\\lambda t}$$

for t at least zero. The survival function R is the same object reliability
engineering calls reliability. Integrating by parts once gives the mean and
twice gives the second moment:

$$E[T] = \\int_{0}^{\\infty} t\\,\\lambda e^{-\\lambda t}\\,dt = \\frac{1}{\\lambda}$$

$$E[T^{2}] = \\int_{0}^{\\infty} t^{2}\\,\\lambda e^{-\\lambda t}\\,dt = \\frac{2}{\\lambda^{2}}$$

$$\\mathrm{Var}(T) = \\frac{2}{\\lambda^{2}} - \\frac{1}{\\lambda^{2}} = \\frac{1}{\\lambda^{2}}$$

Mean and standard deviation are equal, both 1/lambda. A component whose mean
life is 2000 hours has a standard deviation of 2000 hours: half of them fail
before 1386 hours, since the median is (ln 2)/lambda, well short of the mean.

## 12.4 The memoryless property, proved

Claim: for the exponential, and only for the exponential among continuous
distributions on the positive line, the remaining life of a used unit has the
same distribution as the life of a new one. Condition on survival to age s and
apply the definition of conditional probability:

$$P(T > s+t \\mid T > s) = \\frac{P(T > s+t \\ \\text{and}\\ T > s)}{P(T > s)} = \\frac{P(T > s+t)}{P(T > s)}$$

The intersection collapsed because surviving past s + t already implies
surviving past s. Substituting the survival function finishes it:

$$\\frac{e^{-\\lambda(s+t)}}{e^{-\\lambda s}} = e^{-\\lambda t} = P(T > t)$$

The age s cancelled. Physically this says the item has no wear mechanism: its
failures are externally triggered, not accumulated. That is a reasonable model
for lightning arrestor strikes and a poor one for bearing wear, and the
distinction is what the next subsection quantifies.

## 12.5 Worked: a Weibull wear-out calculation

The Weibull adds a shape parameter that lets the failure rate change with age:

$$F(t) = 1 - \\exp\\left[-\\left(\\frac{t}{\\eta}\\right)^{\\beta}\\right], \\qquad R(t) = \\exp\\left[-\\left(\\frac{t}{\\eta}\\right)^{\\beta}\\right]$$

$$h(t) = \\frac{f(t)}{R(t)} = \\frac{\\beta}{\\eta}\\left(\\frac{t}{\\eta}\\right)^{\\beta-1}$$

$$E[T] = \\eta\\,\\Gamma\\!\\left(1 + \\frac{1}{\\beta}\\right), \\qquad \\Gamma(z) = \\int_{0}^{\\infty} u^{z-1}e^{-u}\\,du$$

Beta below 1 gives a falling hazard, beta equal to 1 collapses the Weibull to
the exponential with lambda = 1/eta, and beta above 1 gives a rising hazard.
Eta is the characteristic life, the age by which a fraction 1 − 1/e = 0.632 of
units have failed, whatever beta is.

Given: a fan with beta = 2.5 and eta = 4000 hours. Find the reliability at
2000 hours, the mean life, and the chance a fan that has already run 2000 hours
lasts another 2000.

Relation: the three formulas above.

Substitution. At 2000 hours the age ratio is 0.5, and $0.5^{2.5} = 0.176777$:

$$R(2000) = e^{-0.176777} = 0.8380$$

The mean uses the gamma function at 1 + 1/2.5 = 1.4, whose value from the
defining integral is 0.88726:

$$E[T] = 4000 \\times 0.88726 = 3549 \\ \\text{hours}$$

The conditional survival divides one reliability by another. At 4000 hours the
age ratio is 1, so R(4000) = e^{-1} = 0.36788, and

$$\\frac{R(4000)}{R(2000)} = 0.36788 / 0.83797 = 0.4390$$

A new fan has a 83.8% chance of reaching 2000 hours; a fan already at 2000
hours has only a 43.9% chance of reaching 4000. Age matters, and it matters by
a factor of nearly two.

![Chance of surviving a further two thousand hours plotted against hours already run, for an exponential and a Weibull with shape 2.5 matched to the same mean life. The exponential line is flat at 56.9 percent because age cancels in the conditional probability; the Weibull falls from 83.8 percent when new to 43.9 percent at two thousand hours.](/courses/fe-ee/figures/prob2-memoryless.svg)

The comparison in the figure holds the mean life fixed. An exponential with the
same 3549-hour mean has lambda = 1/3549, so its reliability at 2000 hours is
$e^{-0.5635} = 0.5692$, and that number does not change with age. The
exponential is simultaneously more pessimistic about a new unit and far more
optimistic about an old one — which is precisely why using it on a wear-out
mechanism produces maintenance intervals that are too long.`,
      examTip: 'Convert between mean life and rate before anything else: λ = 1/MTBF, always. Then decide whether the failure mechanism has memory. Constant rate means exponential and the age of the unit is irrelevant; wear-out means a Weibull with β above 1 and age is the dominant variable.',
      importantNote: 'The characteristic life η is not the mean life unless β = 1. For β = 2.5 the mean is 0.887η, and reading η off a data sheet and calling it MTTF overstates the mean by about 13%.',
    },
    {
      id: 'pd-ztable2',
      title: '13. The Standard Normal Transformation, Both Directions',
      content: `## 13.1 One table, two directions

The normal density has two parameters, so there are infinitely many normal
curves, and no book prints infinitely many tables. The standardising
substitution collapses them all onto one:

$$Z = \\frac{X - \\mu}{\\sigma}, \\qquad E[Z] = 0, \\qquad \\mathrm{Var}(Z) = 1$$

The two properties follow from the linear rules: subtracting a constant shifts
the mean and leaves the variance alone, dividing by a constant divides the
standard deviation. Nothing about the SHAPE changes, which is why a table of
the standardised curve serves every normal problem.

The tabulated function is the cumulative area to the left,

$$\\Phi(z) = P(Z \\le z) = \\int_{-\\infty}^{z} \\frac{1}{\\sqrt{2\\pi}} e^{-u^{2}/2}\\,du = \\frac{1}{2}\\left[1 + \\mathrm{erf}\\!\\left(\\frac{z}{\\sqrt{2}}\\right)\\right]$$

with the symmetry

$$\\Phi(-z) = 1 - \\Phi(z)$$

that lets a table of positive z cover the negative half. There is no closed
form for the integral, which is the entire reason a table exists.

Problems run in one of two directions. FORWARD problems give a value and want
an area: convert x to z, look up, adjust for which tail. INVERSE problems give
an area and want a value: find the z that carries that area, then undo the
substitution with

$$x = \\mu + z\\sigma$$

The five inverse lookups worth recognising on sight, all read from the standard
normal table at the stated two-sided confidence:

| Two-sided confidence | Area in each tail | z from the table |
|---|---|---|
| 80% | 0.100 | 1.282 |
| 90% | 0.050 | 1.645 |
| 95% | 0.025 | 1.960 |
| 98% | 0.010 | 2.326 |
| 99% | 0.005 | 2.576 |

## 13.2 Worked: a bus voltage, forwards

Given: bus voltage is normal with a mean of 480 V and a standard deviation of
10 V. Find the fraction of the time it lies between 465 V and 500 V.

Relation: standardise both limits, then subtract cumulative areas.

Substitution:

$$z_{1} = (465 - 480) / 10 = -1.50, \\qquad z_{2} = (500 - 480) / 10 = 2.00$$

From the standard normal table, $\\Phi(2.00) = 0.9772$ and, by symmetry,
$\\Phi(-1.50) = 1 - 0.9332 = 0.0668$. The band therefore holds

$$0.9772 - 0.0668 = 0.9104$$

about 91% of the time. Sketching the bell with the strip between −1.5 and +2.0
shaded makes the subtraction obvious and prevents the two classic slips:
adding the two table entries, which gives an impossible 1.044, and taking
0.9772 alone, which answers a different question.

## 13.3 Worked: the same bus, backwards

Given: the same distribution. (a) Find the voltage exceeded 95% of the time.
(b) Find the symmetric band that contains 95% of the time.

Relation: inverse lookup, then $x = \\mu + z\\sigma$.

(a) 95% ABOVE the value means 5% below it, so the tail area is 0.05 in the
lower tail and the table's z is −1.645:

$$480 - 1.645 \\times 10 = 463.55$$

so about 463.6 V.

(b) A symmetric 95% leaves 2.5% in each tail, so z is ±1.960:

$$480 - 1.96 \\times 10 = 460.4, \\qquad 480 + 1.96 \\times 10 = 499.6$$

Note that the two answers use DIFFERENT z values for the same 95%, because one
is one-sided and the other is two-sided. Confusing them is the single most
productive distractor generator in this part of the exam: an item that wants
the one-sided 463.6 will always offer 460.4 as a choice, and the other way
round.

A last direction check. In part (a) the answer must lie below the mean, since
most of the distribution has to be above it. In part (b) the answers must
straddle the mean. If a computed x sits on the wrong side of mu, the sign of z
was dropped, and no amount of table precision will rescue it.`,
      examTip: 'Write the z with its sign and keep it. Every inverse-lookup error on this exam is a lost minus sign, and the resulting answer is the mirror image of the right one about the mean — which is exactly why it is always one of the choices.',
    },
    {
      id: 'pd-normapprox',
      title: '14. The Normal Approximation to the Binomial',
      content: `## 14.1 When a lumpy count can be treated as smooth

A binomial count is a sum of n independent Bernoulli variables, so the central
limit theorem applies to it directly. For large n the count behaves like a
normal variable with the binomial's own mean and variance:

$$X \\ \\dot\\sim \\ N\\big(np,\\ np(1-p)\\big)$$

$$Z = \\frac{X - np}{\\sqrt{np(1-p)}}$$

The approximation is a convenience, not a licence: it fails when the binomial
is strongly skewed, and skewness is governed by how far p sits from 0.5 and by
how small n is. The usual admission test is

$$np \\ge 5 \\quad \\text{and} \\quad n(1-p) \\ge 5$$

with some texts demanding 10 instead of 5. Both conditions are needed. With
n = 200 and p = 0.01 the first fails at np = 2, and the Poisson of Section 11
is the right tool instead. The two approximations therefore cover
complementary regions, and reading np is how you choose.

## 14.2 The half-unit correction

The binomial lives on integers and the normal on a continuum, so the two
disagree about what "54" means. In the discrete world the probability of
exactly 54 is a bar of positive height; in the continuous world any single
point has probability zero. The fix is to give each integer the unit interval
around it, so the bar at 54 occupies 53.5 to 54.5, and to cut the normal curve
at the edge of that interval:

$$P(X \\le k) \\approx \\Phi\\!\\left(\\frac{k + 0.5 - np}{\\sqrt{np(1-p)}}\\right)$$

$$P(X \\ge k) \\approx 1 - \\Phi\\!\\left(\\frac{k - 0.5 - np}{\\sqrt{np(1-p)}}\\right)$$

$$P(X = k) \\approx \\Phi\\!\\left(\\frac{k + 0.5 - np}{\\sqrt{np(1-p)}}\\right) - \\Phi\\!\\left(\\frac{k - 0.5 - np}{\\sqrt{np(1-p)}}\\right)$$

The half goes in the direction that makes the interval BIGGER: outward for
"at most" and "at least", and both ways for an exact value. Getting the
direction wrong is worse than omitting the correction, because it moves the
answer the wrong way by the same amount.

## 14.3 Worked: two hundred trials and one half-unit

Given: 200 independent items, each conforming with probability 0.30. Find the
probability that at most 54 conform.

Relation: check admissibility, then apply the corrected approximation.

Admissibility: np = 60 and n(1 − p) = 140, both comfortably above 5.

Parameters: $200 \\times 0.30 \\times 0.70 = 42$, so the standard deviation is
the square root of 42, which is 6.4807.

Substitution, corrected:

$$z = \\frac{54.5 - 60}{6.4807} = -0.8487 \\quad \\Longrightarrow \\quad \\Phi(-0.8487) = 0.19803$$

Substitution, uncorrected, for comparison:

$$z = \\frac{54 - 60}{6.4807} = -0.9258 \\quad \\Longrightarrow \\quad \\Phi(-0.9258) = 0.17727$$

The exact binomial value, summed term by term, is 0.19885. The corrected
approximation is off by 0.00082; the uncorrected one is off by 0.02158, which
is twenty-six times worse. On a value that rounds to 0.20, that is the
difference between the right answer choice and the one below it.

![Top panel: the exact binomial probability bars for two hundred trials at probability 0.30, with the normal density of mean sixty and standard deviation 6.481 drawn over them, and the cut line at 54.5 marked. Bottom panel: the error of the cumulative approximation against the exact binomial, with and without the half-unit correction, showing the uncorrected curve reaching minus 0.035 near the mean while the corrected one stays within 0.003.](/courses/fe-ee/figures/prob2-normal-approx.svg)

The lower panel of the figure shows why the correction matters most in the
middle. Near the mean the binomial bars are tall, so half a bar is a large
piece of probability; far out in the tails the bars are short and the
correction is nearly free. An item that asks for a far-tail probability may
give the same rounded answer either way, which is exactly why the habit has to
be automatic rather than judged case by case.

| Question asked | Correct cut | Common wrong cut |
|---|---|---|
| at most 54 | 54.5 | 54 |
| fewer than 54 | 53.5 | 54 |
| at least 54 | 53.5 | 54 |
| more than 54 | 54.5 | 54 |
| exactly 54 | 53.5 and 54.5 | 54 alone, giving zero |

The last row is the one that exposes the whole idea: without the correction,
the normal approximation says the probability of exactly 54 is zero, which is
plainly wrong. Cutting the curve at both 53.5 and 54.5 instead returns 0.0401
against the exact binomial value of 0.0410.`,
      examTip: 'Compute np and n(1 − p) before deciding anything. Both above 5 means the normal approximation is admissible; np small with p small means Poisson; neither means the exact binomial. Then apply the half-unit shift in the direction that widens the interval you were asked about.',
    },
    {
      id: 'pd-reliability',
      title: '15. Reliability: Series, Parallel, MTBF and the Bathtub',
      content: `## 15.1 Reliability is a survival probability

Reliability R(t) is the probability that an item is still working at time t,
which is the survival function of its failure-time distribution:

$$R(t) = P(T > t) = 1 - F(t), \\qquad R(0) = 1$$

The hazard rate, or instantaneous failure rate, is the density of failures
among the survivors:

$$h(t) = \\frac{f(t)}{R(t)} = -\\frac{1}{R(t)}\\frac{dR}{dt}$$

Integrating that relation recovers the reliability from the hazard, which is
the identity behind every reliability model in the section:

$$R(t) = \\exp\\left[-\\int_{0}^{t} h(u)\\,du\\right]$$

Constant hazard, h = lambda, returns the exponential immediately, and that is
the only case in which a single number — a failure rate, or its reciprocal the
mean time between failures — describes the whole distribution:

$$\\mathrm{MTBF} = \\int_{0}^{\\infty} R(t)\\,dt = \\frac{1}{\\lambda} \\quad \\text{when } h \\text{ is constant}$$

## 15.2 Series and parallel structures

A SERIES system needs every block. With independent blocks the survival
probabilities multiply:

$$R_{s}(t) = \\prod_{i=1}^{n} R_{i}(t)$$

If every block has a constant hazard, the exponentials combine and the rates
simply add:

$$R_{s}(t) = \\exp\\left[-\\left(\\sum_{i} \\lambda_{i}\\right) t\\right], \\qquad \\lambda_{s} = \\sum_{i} \\lambda_{i}$$

which is why a series chain is always less reliable than its worst block, and
why adding a block can only hurt.

An active PARALLEL system needs only one survivor, so it is the complement of
everything having failed:

$$R_{p}(t) = 1 - \\prod_{i=1}^{n} \\left[1 - R_{i}(t)\\right]$$

Note that the rates do NOT add here, and the parallel system is not
exponential even when its units are. For two identical exponential units the
mean life comes out to

$$\\mathrm{MTTF}_{\\text{parallel}} = \\frac{1}{\\lambda} + \\frac{1}{2\\lambda} = \\frac{3}{2\\lambda}$$

— redundancy buys 50% more mean life from a doubling of hardware, which is a
sobering ratio and the reason redundancy is justified by mission reliability at
a specified time rather than by mean life.

A k-out-of-n system needs at least k of n identical units, which is a binomial
sum:

$$R_{k/n} = \\sum_{i=k}^{n} \\binom{n}{i} R^{i}(1-R)^{n-i}$$

![Left panel: system reliability against identical component reliability for series systems of two, five and ten blocks, all falling steeply below a component reliability of 0.95. Right panel: the same axes for active parallel redundancy of one, two and three units, with the two-out-of-three voting point at 0.972 marked for a component reliability of 0.90.](/courses/fe-ee/figures/prob2-series-parallel.svg)

## 15.3 The bathtub curve

Real populations do not have a constant hazard over their whole lives. Three
mechanisms overlap: manufacturing escapes that show up early and are steadily
weeded out, externally triggered random failures at a roughly constant rate,
and wear-out that accelerates with age. Each is a Weibull hazard with a
different shape parameter:

$$h(t) = \\frac{\\beta}{\\eta}\\left(\\frac{t}{\\eta}\\right)^{\\beta-1}$$

Beta below 1 falls, beta equal to 1 is flat, beta above 1 rises. Adding the
three gives the tub.

![Left panel: Weibull hazard rates for shape parameters 0.5, 1 and 3, falling, flat and rising respectively. Right panel: their sum, which forms the bathtub curve with a broad flat minimum in mid-life where a constant failure rate is a defensible model.](/courses/fe-ee/figures/prob2-bathtub-hazard.svg)

Burn-in exists to move product past the falling region before shipment;
preventive replacement exists to retire it before the rising region. The
exponential model, and every MTBF quoted without a shape parameter, is a claim
about the flat middle only.

## 15.4 Worked: a series chain and its redundant twin

Given: a protection chain has three blocks with constant failure rates of 12,
30 and 8 failures per million hours. Find the system rate, the MTBF, and the
reliability at 1000 hours. Then find the reliability at 1000 hours if the
30-per-million block is duplicated in active parallel.

Relation: rates add in series; parallel blocks combine through their
complements.

Series rate:

$$12 + 30 + 8 = 50 \\ \\text{failures per million hours}$$

$$\\mathrm{MTBF} = 1 / 0.000050 = 20000 \\ \\text{hours}$$

Reliability at 1000 hours, from the exponent (50 per million)(1000 hours) =
0.05:

$$R_{s}(1000) = e^{-0.05} = 0.9512$$

Now duplicate the worst block. Each copy alone has
$R = e^{-0.030} = 0.97045$, so the pair has

$$R_{\\text{pair}} = 1 - (1 - 0.97045)^{2} = 1 - 0.00087 = 0.99913$$

and the chain becomes the pair in series with the other two blocks, which
survive at $e^{-0.012} = 0.98807$ and $e^{-0.008} = 0.99203$:

$$0.99913 \\times 0.98807 \\times 0.99203 = 0.97934$$

Failure probability at 1000 hours drops from 0.0488 to 0.0207, a 58% cut, from
duplicating one block. Note that the redundant chain is no longer exponential:
its hazard now rises with age, so no single rate describes it and inverting the
1000-hour reliability to quote an MTBF is meaningless. That inversion is the
standard trap on redundancy items.

A last structure worth knowing is 2-out-of-3 voting, used wherever a spurious
trip is as costly as a missed one. With three units each at R = 0.90:

$$3 \\times 0.81 \\times 0.1 + 0.729 = 0.972$$

Better than one unit at 0.90 and worse than three in pure parallel at 0.999,
which is the price paid for rejecting single-unit false alarms as well as
single-unit failures.`,
      examTip: 'Failure rates add only in series and only with constant hazards. If a stem has parallel paths, work in reliabilities and complements — never add rates across a redundancy — and never invert a redundant system reliability to quote an MTBF.',
      importantNote: 'Independence is the load-bearing assumption in every formula in this section. Blocks sharing a power supply, a cooling loop, a firmware image or a maintenance crew have correlated failures, and the computed parallel reliability is then an upper bound rather than an estimate.',
    },
    {
      id: 'pd-set1',
      title: '16. Problem Set A: Rules, Counting and Discrete Laws',
      content: `## Problem Set A — six items, worked

**A1.** For two events, P(A) = 0.35, P(B) = 0.45 and P(A and B) = 0.15. Find
P(A or B), the probability that exactly one occurs, P(A given B), and state
whether A and B are independent.

*Answer.* Inclusion-exclusion first:

$$0.35 + 0.45 - 0.15 = 0.65$$

Exactly one means the union minus the overlap, 0.65 − 0.15 = **0.50**. The
conditional is $0.15 / 0.45 = 0.3333$. For independence, compare the product of
the marginals with the stated joint: $0.35 \\times 0.45 = 0.1575$, which is not
0.15, so the events are **dependent** — mildly and negatively.

*Trap.* Adding the two probabilities gives 0.80, which exceeds the correct 0.65
because the overlap is counted twice. A second trap declares independence
because "nothing in the problem links them"; independence is a numerical
condition, not a narrative one.

**A2.** Three suppliers provide 50%, 30% and 20% of a part, with defect rates
0.01, 0.02 and 0.05. A defective part is found. What is the probability it came
from the third supplier?

*Answer.* Total probability first:

$$0.005 + 0.006 + 0.010 = 0.021$$

The three products are 0.5(0.01), 0.3(0.02) and 0.2(0.05). Bayes then gives

$$0.010 / 0.021 = 0.47619$$

so **0.476**. The three posteriors are 0.238, 0.286 and 0.476 and they sum to
1, which is the check.

*Trap.* Answering 0.05, the defect rate of supplier three, or 0.20, its share.
The first is the likelihood and the second the prior; the question asks for the
posterior, and it is bigger than both because supplier three is much the
worst offender.

**A3.** A five-character access code starts with a letter and then uses letters
or digits, with no character repeated. How many codes exist?

*Answer.* Multiplication principle with a shrinking pool. The first position
has 26 choices; each later position draws from 36 symbols minus those already
used:

$$26 \\times 35 \\times 34 \\times 33 \\times 32 = 32672640$$

about **32.7 million**.

*Trap.* Allowing repeats gives 26 × 36⁴ = 43,670,016, which is 34% too many.
The phrase "no character repeated" is the only thing separating the two, and it
is easy to read past.

**A4.** Fifteen relays are commanded to trip; each independently fails with
probability 0.04. Find the probability that at least one fails.

*Answer.* Complement:

$$1 - 0.96^{15} = 1 - 0.54209 = 0.45791$$

so **0.458**.

*Trap.* Quoting np = 15 × 0.04 = **0.60** as the probability. That is the
expected NUMBER of failures, not a probability, and the giveaway is that the
same arithmetic with 30 relays would give 1.2 — an impossible probability.

**A5.** Alarms arrive at an average of 2.5 per shift, Poisson. Find the
probability of exactly four in a shift, and of at least one.

*Answer.* With $2.5^{4} = 39.0625$ and $e^{-2.5} = 0.082085$:

$$39.0625 \\times 0.082085 / 24 = 0.13360$$

so **0.134**. For at least one, the complement uses only the k = 0 term:

$$1 - 0.08208 = 0.91792$$

so **0.918**.

*Trap.* Dividing by 4 instead of 4! = 24, which returns 0.802. That is larger
than P(X = 2) = 0.257, and a Poisson pmf cannot rise as it moves away from its
mode at 2, so the answer flags itself without any further work.

**A6.** A box of 12 fuses contains 3 that are out of specification. Three are
drawn together. Find the probability none is out of specification.

*Answer.* Hypergeometric, because the draw is without replacement:

$$P(X = 0) = \\frac{\\binom{9}{3}}{\\binom{12}{3}} = 84 / 220 = 0.38182$$

so **0.382**.

*Trap.* Treating the draws as independent at p = 9/12 = 0.75 gives
0.75³ = **0.42188**, which is 10% high. Removing a good fuse makes the next
draw worse, and the binomial cannot see that.`,
      examTip: 'On every item in this set the wrong answer was a number the stem handed you or a formula from the adjacent family. Before committing, name the family out loud — union, Bayes, counting, binomial, Poisson, hypergeometric — and confirm its assumptions hold for the stem as written.',
    },
    {
      id: 'pd-set2',
      title: '17. Problem Set B: Continuous Models and Reliability',
      content: `## Problem Set B — six items, worked

**B1.** A dimension is normal with a mean of 68.0 mm and a standard deviation
of 2.5 mm. Find the fraction above 72.0 mm.

*Answer.* Standardise, then take the upper tail:

$$z = (72.0 - 68.0) / 2.5 = 1.60$$

The standard normal table gives Φ(1.60) = 0.9452, so

$$1 - 0.9452 = 0.0548$$

about **5.5%**.

*Trap.* Reporting 0.9452, the area the table hands you, which answers "below
72" instead of "above". Shading the sketch first makes this impossible.

**B2.** Time to first service is normal with a mean of 48 months and a standard
deviation of 6 months. Set a warranty length such that only 2% of units need
service before it expires.

*Answer.* Inverse lookup. A lower-tail area of 0.02 corresponds to z = −2.05
in the standard normal table, so

$$48 - 2.05 \\times 6 = 35.7 \\ \\text{months}$$

about **36 months**.

*Trap.* Using +2.05 gives 60.3 months, a warranty that 98% of units would
outlive — the mirror-image answer produced by dropping the sign, and always one
of the offered choices.

**B3.** A drive has an MTBF of 1200 hours with a constant failure rate. Find
the probability it fails within the first 300 hours.

*Answer.* The rate is the reciprocal of the mean, so the exponent is
300/1200 = 0.25:

$$F(300) = 1 - e^{-0.25} = 1 - 0.7788 = 0.2212$$

about **0.221**.

*Trap.* Quoting 300/1200 = **0.25** directly. That ratio is the exponent, not
the probability, and the two agree only for small exponents — here they differ
by 13%, and at 1200 hours the exponent would read 1.00 while the probability is
only 0.632.

**B4.** A bearing follows a Weibull law with β = 1.8 and η = 2500 hours. Find
its reliability at 1500 hours.

*Answer.* The age ratio is 1500/2500 = 0.6, and $0.6^{1.8} = 0.39872$:

$$R(1500) = e^{-0.39872} = 0.6712$$

about **0.671**.

*Trap.* Treating η as a mean life and using the exponential, which gives
$e^{-0.6} = 0.5488$ — an 18% understatement, because at β = 1.8 the bearing is
still in the low-hazard part of its life at 0.6 of characteristic life. The
same mistake in the other direction appears past the characteristic life, where
the exponential is far too optimistic.

**B5.** Three blocks in series have reliabilities 0.95, 0.98 and 0.99 at the
mission time. Find the system reliability, then find it again with the weakest
block duplicated in active parallel.

*Answer.* Series multiplies:

$$0.95 \\times 0.98 \\times 0.99 = 0.92169$$

Duplicating the 0.95 block gives a pair at 1 − 0.05² = 0.9975, so

$$0.9975 \\times 0.98 \\times 0.99 = 0.96777$$

Failure probability falls from 0.0783 to 0.0322.

*Trap.* Averaging the three block reliabilities to 0.9733, or adding the
parallel pair to 1.90. Series reliability is a product and is always below the
smallest factor, which is the sanity check both traps fail.

**B6.** A coin-like test is run 100 times with success probability 0.50. Find
the probability of at least 60 successes.

*Answer.* Admissibility: np = 50 and n(1 − p) = 50, both above 5. The standard
deviation is the square root of 100(0.5)(0.5) = 25, which is 5. For "at least
60" the correction widens the interval downward to 59.5:

$$z = (59.5 - 50) / 5 = 1.90$$

The table gives Φ(1.90) = 0.9713, so the answer is

$$1 - 0.9713 = 0.0287$$

about **0.029**, against an exact binomial value of 0.02844.

*Trap.* Omitting the correction gives z = 2.00 and a tail of **0.0228**, which
is 20% low. Applying the correction in the wrong direction, to 60.5, gives
z = 2.10 and 0.0179, which is worse than not correcting at all.`,
      examTip: 'Continuous items reward a two-line setup: write the parameter conversion (rate from mean, z from x, age ratio from characteristic life) on one line and the formula on the next. Most of the lost marks in this set come from substituting a correct number into the wrong slot rather than from any failure of the table.',
    },
  ],
  keyTakeaways: [
    'Bayes\' theorem: P(A|B) = P(B|A)·P(A)/P(B) — reverses conditional probability.',
    'Binomial: n trials, probability p; Poisson: rare events with rate λ.',
    'Normal distribution: Z = (X-μ)/σ standardizes for table lookup.',
    'Exponential: models failure times; memoryless property.',
    '68-95-99.7 rule for normal: 68% within 1σ, 95% within 2σ, 99.7% within 3σ.',
  ],
},

fee_expected_values: {
  topicId: 'fee_expected_values',
  title: 'Expected Values and Variance',
  domainWeight: 'Probability & Statistics · 4–6%',
  overview: 'Expected value and variance quantify the center and spread of distributions. These statistical measures summarize data for engineering decisions about tolerances, reliability, and quality control.',
  sections: [
    {
      id: 'ev-measures',
      title: '1. Central Tendency and Spread',
      content: `## 1.1 Measures of Central Tendency

- **Mean (average)**: μ = ΣX/N (population) or x̄ = ΣX/n (sample)
- **Median**: middle value when sorted; robust to outliers
- **Mode**: most frequent value

### Expected Value

For a discrete random variable: **$E[X] = \\Sigma x_{i}\\cdot P(x_{i})$**

Properties:
- E[aX + b] = a·E[X] + b
- E[X + Y] = E[X] + E[Y] (always, even if dependent)
- E[XY] = E[X]·E[Y] whenever X, Y are independent (sufficient, not necessary — see Section 10)

## 1.2 Measures of Spread

- **Variance**: σ² = E[(X - μ)²] = E[X²] - (E[X])²
- **Standard deviation**: σ = sqrt(σ²) (same units as data)
- **Sample variance**: s² = Σ(X - x̄)²/(n-1) (divide by n-1 for unbiased estimate)

| Measure | Population | Sample |
|---|---|---|
| Mean | $\\mu = \\Sigma X/N$ | $\\bar{x} = \\Sigma X/n$ |
| Variance | $\\sigma ^{2} = \\Sigma (X-\\mu)^{2}/N$ | $s^{2} = \\Sigma (X-\\bar{x})^{2}/(n-1)$ |
| Std Dev | $\\sigma = \\sqrt{\\sigma ^{2}}$ | $s = \\sqrt{s^{2}}$ |`,
      examTip: 'Sample variance divides by (n-1), not n. This is called Bessel\'s correction and gives an unbiased estimate. The FE exam may test whether you use n or n-1 in the denominator — sample statistics always use n-1.',
    },
    {
      id: 'ev-covariance',
      title: '2. Covariance and Correlation',
      content: `## 2.1 Covariance

**Cov(X,Y) = E[(X - μx)(Y - μy)] = E[XY] - E[X]·E[Y]**

- Positive covariance: X and Y tend to increase together
- Negative covariance: one increases as the other decreases
- Zero covariance: no linear relationship (but may have nonlinear)

## 2.2 Correlation Coefficient

**r = Cov(X,Y) / (σx · σy)**

| r Value | Interpretation |
|---|---|
| $r = +1$ | Perfect positive linear relationship |
| $r = -1$ | Perfect negative linear relationship |
| $r = 0$ | No linear relationship |
| $0 < \\lvert r\\rvert < 0.5$ | Weak linear relationship |
| $0.5 < \\lvert r\\rvert < 0.8$ | Moderate linear relationship |
| $0.8 < \\lvert r\\rvert < 1$ | Strong linear relationship |

### Variance of Sums

- **Var(X + Y) = Var(X) + Var(Y) + 2·Cov(X,Y)**
- If X, Y independent: Var(X + Y) = Var(X) + Var(Y)
- **Var(aX) = a²·Var(X)**`,
      examTip: 'Correlation does NOT imply causation — this is a classic FE exam concept. Two variables can be strongly correlated (r near ±1) without one causing the other. Also remember: r = 0 means no LINEAR relationship, but a strong nonlinear relationship could still exist.',
      importantNote: 'When adding independent random variables, variances ADD but standard deviations do NOT. This is a common mistake: σ(X+Y) ≠ σ(X) + σ(Y). Instead, σ(X+Y) = sqrt(σx² + σy²).',
    },
    {
      id: 'ev-central',
      title: '3. Choosing the Right Average',
      content: `## 3.1 Three averages, one dataset

Seven measured response times of a protection relay, in milliseconds:

2.1, 2.4, 2.4, 2.7, 3.0, 3.2, 9.8

- **Mean**: sum 25.6, divided by 7 → **3.66 ms**
- **Median**: fourth value of the sorted seven → **2.7 ms**
- **Mode**: the repeated value → **2.4 ms**

One sluggish trial dragged the mean above six of the seven observations. The
median barely noticed. That is the entire practical difference: the mean uses
every value's magnitude, so a single outlier moves it; the median uses only
rank, so it stays put. Report the mean when the total matters (energy, cost,
cumulative load — the mean times n IS the total). Report the median when a
typical value matters and the data may contain flyers.

The mean also has a property the exam leans on: deviations about it sum to
exactly zero. That makes it the balance point of the data, and it is the
built-in arithmetic check used in the next subsection.

## 3.2 Dispersion by hand

Given the sample 4, 7, 9, 10, 15 (n = 5):

Mean: x̄ = 45/5 = 9. Deviations: −5, −2, 0, 1, 6 — they sum to zero, so the
mean is right. Squared deviations: 25, 4, 0, 1, 36, summing to 66.

- **Sample variance**: s² = 66 / (5 − 1) = **16.5**
- **Sample standard deviation**: s = √16.5 = **4.06**
- Treating the five values as a whole population instead: σ² = 66/5 = 13.2,
  σ = 3.63

The n − 1 matters at exam sample sizes: here it is the difference between 4.06
and 3.63, and both will be waiting among the answer choices.

| Measure | Formula | Value here | Moved by one outlier? |
|---|---|---|---|
| Mean | Σx / n | 9 | yes |
| Median | middle of sorted data | 9 | barely |
| Range | max − min | 11 | maximally |
| Sample variance | Σ(x − x̄)² / (n−1) | 16.5 | strongly (squared) |
| Standard deviation | √s² | 4.06 | strongly |
| Coefficient of variation | s / x̄ | 0.45 | strongly |

The **coefficient of variation** CV = s/x̄ is spread as a fraction of the mean —
dimensionless, so it compares scatter across quantities with different units. A
45% CV says this sample is noisy; a machining process with the same s on a mean
of 900 would have CV = 0.45% and be tight.`,
      examTip: 'Deviations from the mean must sum to zero — total it before squaring anything. This three-second check catches the most common statistics slip on the exam, which is an arithmetic error in the mean poisoning every number computed after it.',
    },
    {
      id: 'ev-functions',
      title: '4. Functions of a Random Variable',
      content: `## 4.1 E[g(X)] from a pmf, start to finish

Given: the number of line faults per shift, X, with distribution

| x | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| P(x) | 0.50 | 0.30 | 0.15 | 0.05 |

Relations: E[X] = Σx·P(x), E[X²] = Σx²·P(x), Var(X) = E[X²] − (E[X])².

Substitution:
- E[X] = 0(0.5) + 1(0.3) + 2(0.15) + 3(0.05) = **0.75 faults**
- E[X²] = 0 + 0.3 + 4(0.15) + 9(0.05) = 1.35
- Var(X) = 1.35 − (0.75)² = 1.35 − 0.5625 = **0.7875**, so σ = 0.89

Note that E[X²] = 1.35 is NOT (E[X])² = 0.5625. The gap between them is
exactly the variance — for a function as simple as squaring, plugging the mean
into the function already fails. Expectation passes through linear functions
only.

Now a function of X. Each fault costs a fixed 20 minutes of switching plus 50
minutes of repair: downtime D = 20 + 50X per shift.

- E[D] = 20 + 50·E[X] = 20 + 37.5 = **57.5 minutes**
- Var(D) = 50²·Var(X) = 2500 × 0.7875 = 1969, so σ_D = **44.4 minutes**

The constant 20 shifted the mean and vanished from the variance — adding a
constant moves every outcome equally, spreading nothing. The factor 50 scaled
the standard deviation by 50 and the variance by 50². Those two rules,
E[aX + b] = a·E[X] + b and Var(aX + b) = a²·Var(X), settle most
function-of-a-random-variable items on this exam by themselves.

## 4.2 Why the mean is only half the description

![Two probability distributions sharing the same mean of five: a binomial with variance 2.5 and a Poisson with variance 5. The wider one puts real probability on outcomes the narrow one effectively never produces.](/courses/fe-ee/figures/prob-same-mean-spread.svg)

Both distributions above average 5, yet the wider one puts 6.8% of its
probability on nine or more while the narrow one puts 1.1% there — six times
as much weight on the outcomes that break a tolerance. Tolerance, risk and margin questions are
variance questions wearing a mean's clothing: two suppliers with equal average
resistance are not equal if one's spread is double the other's.

## 4.3 Combining random variables

Means always add: E[X + Y] = E[X] + E[Y], dependent or not. Variances add only
for independent variables, and it is variances — never standard deviations —
that add:

Two independent delay stages, each with σ = 3 µs, give a total spread of
σ = √(9 + 9) = **4.24 µs**, not 6 µs. Ten identical independent stages give
√10 × 3 = 9.5 µs, not 30. This square-root growth of accumulated noise is why
averaging n measurements shrinks the error of the mean by √n — the same fact
run in reverse.`,
      examTip: 'Adding a constant to a random variable changes its mean and leaves its variance alone; multiplying by a squares its way into the variance. If an answer choice implies Var(X + b) grew because of b, it is the trap.',
    },
    {
      id: 'ev-set',
      title: '5. Problem Set: Moments in FE Style',
      content: `## 5.1 Mean and variance from a pmf

Given: an order arrives for 10, 20 or 30 units with probabilities 0.2, 0.5 and
0.3. Find the mean, variance and standard deviation of the order size.

Relations: E[X] = Σx·P(x); Var = E[X²] − (E[X])².

- E[X] = 10(0.2) + 20(0.5) + 30(0.3) = 2 + 10 + 9 = **21 units**
- E[X²] = 100(0.2) + 400(0.5) + 900(0.3) = 20 + 200 + 270 = 490
- Var(X) = 490 − 441 = **49**, σ = **7 units**

The clean σ is deliberate: exam writers like data that lands on integers, so a
wildly non-round intermediate is worth a second look.

## 5.2 Sample statistics from raw data

Given the sample 12, 15, 19, 22 (n = 4): find x̄ and s.

x̄ = 68/4 = **17**. Deviations: −5, −2, 2, 5 (sum zero ✓). Squares:
25 + 4 + 4 + 25 = 58.

s² = 58/3 = 19.33, so s = **4.40**. Dividing by n = 4 instead gives 3.81 — the
distractor manufactured from the population formula.

## 5.3 Variance of a sum with correlation in it

Given: Var(X) = 4, Var(Y) = 9, Cov(X, Y) = −2.

Relation: Var(X ± Y) = Var(X) + Var(Y) ± 2·Cov(X, Y).

- Var(X + Y) = 4 + 9 + 2(−2) = **9**, σ = 3
- Var(X − Y) = 4 + 9 − 2(−2) = **17**, σ = 4.12

The negative covariance means the variables move oppositely, so summing lets
them partially cancel — the sum is LESS spread out than independence (13) would
predict, while the difference is more. Negatively correlated error sources
partially cancel in a sum; that is the statistical basis of differential
signalling and of hedging generally.

## 5.4 Where marks are lost

| Error | What it looks like | The fix |
|---|---|---|
| n instead of n − 1 for a sample | s = 3.81 in problem 5.2 | sample statistics always spend one degree of freedom on x̄ |
| Adding standard deviations | σ = 3 + 3 = 6 for two stages | add variances, then take one square root |
| (E[X])² for E[X²] | variance of zero from real data | square first, then average |
| Constant inflating variance | Var(X + 20) = Var(X) + 400 | shifts move the centre, not the spread |
| Covariance sign dropped | 17 and 9 swapped in problem 5.3 | the cross term carries its sign into the sum |`,
      examTip: 'When a variance answer comes out negative you have subtracted (E[X])² from the wrong quantity or lost a covariance sign — variance can be zero but never negative, so a negative intermediate is a free error alarm the exam gives you.',
    },
    {
      id: 'ev-continuous',
      title: '6. Continuous Variables and Expected-Value Decisions',
      content: `## 6.1 The uniform distribution, the continuous starter case

When a value is equally likely anywhere in a band [a, b] — a quantisation
error, a part dimension known only to its tolerance limits — the density is
flat, f(x) = 1/(b − a), and the moments come from integrals rather than sums:

- **Mean**: (a + b)/2 — the midpoint, by symmetry
- **Variance**: (b − a)²/12

Given: a resistor known only to lie between 90 and 110 Ω, uniformly. Mean =
(90 + 110)/2 = **100 Ω**; variance = 20²/12 = 33.3, so σ = **5.77 Ω**. Compare
a NORMAL distribution engineered to keep essentially all parts in the same
±10 Ω band: its σ would be near 10/3 = 3.3 Ω. Uniform spread inside a given
band is worse than bell-shaped spread inside the same band — the 12 in the
denominator is doing real work, and the exam likes asking for it.

## 6.2 Expected value as a decision rule

Given: a transformer can be overhauled now, at a certain 40 hours of outage, or
run to the next inspection with a 0.30 probability of a failure that would cost
120 hours. Which choice minimises expected outage?

- Overhaul now: E = 40 hours, guaranteed
- Wait: E = 0.30 × 120 + 0.70 × 0 = **36 hours**

Waiting wins on expectation — but complete the picture with the spread.
E[X²] = 0.30 × 120² = 4320, so Var = 4320 − 36² = 3024 and σ = **55 hours**.
The certain option has σ = 0. Expected value alone says wait; a system that
cannot tolerate a 120-hour outage even occasionally should overhaul anyway.
Expectation prices the average future, and variance prices the bad one — the
exam asks for the arithmetic, engineering judgment asks for both numbers.

| Option | Expected outage | Standard deviation | Worst case |
|---|---|---|---|
| Overhaul now | 40 h | 0 | 40 h |
| Run to inspection | 36 h | 55 h | 120 h |

The same expected-cost framing prices warranties, spare-part stocking and
insurance: multiply each outcome by its probability, sum, and compare
alternatives on the total. Whenever a stem mixes probabilities with costs or
payoffs, it is this computation — an expectation of a function of the outcome —
whatever the cover story says.`,
      examTip: 'Uniform on [a, b]: mean is the midpoint, variance is the width squared over 12. The 12 is the fact to memorise — distractors use 4, 6, and the un-squared width.',
    },
    {
      id: 'ev-expectation',
      title: '7. Expectation from First Principles',
      content: `## 7.1 One idea, two notations

Expectation is a probability-weighted average of the values a random variable
can take. For a discrete variable the weights are point probabilities and the
average is a sum:

$$E[X] = \\sum_{i} x_{i}\\,p(x_{i})$$

For a continuous variable the weights are densities times widths and the
average is an integral:

$$E[X] = \\int_{-\\infty}^{\\infty} x\\,f(x)\\,dx$$

These are the same operation written for two kinds of weight. In both cases the
weights total one, which is what makes the result an average rather than a
total, and in both cases the expectation is the balance point of the
distribution: the value about which the weighted deviations cancel.

$$E[X - \\mu] = E[X] - \\mu = 0$$

That identity is the formal version of the check already used in Section 3 —
deviations from the mean sum to zero — and it holds for continuous variables
just as it does for a column of numbers.

For a FUNCTION of a random variable, the weights do not change; only the values
being weighted do. That is the law of the unconscious statistician, and it
saves the work of first finding the distribution of g(X):

$$E[g(X)] = \\sum_{i} g(x_{i})\\,p(x_{i}) = \\int_{-\\infty}^{\\infty} g(x)\\,f(x)\\,dx$$

## 7.2 Linearity, proved and then exploited

Two properties do most of the work on this exam. The first handles a linear
function of one variable:

$$E[aX+b] = \\sum_{i}(ax_{i}+b)p(x_{i}) = a\\sum_{i} x_{i}p(x_{i}) + b\\sum_{i} p(x_{i}) = aE[X] + b$$

The last step used the fact that the weights sum to one. The second handles a
sum of two variables, and it needs their JOINT distribution — but only for a
moment, because the cross terms collapse:

$$E[X+Y] = \\sum_{x}\\sum_{y}(x+y)\\,p(x,y) = \\sum_{x} x\\sum_{y} p(x,y) + \\sum_{y} y\\sum_{x} p(x,y)$$

$$E[X+Y] = \\sum_{x} x\\,p_{X}(x) + \\sum_{y} y\\,p_{Y}(y) = E[X] + E[Y]$$

Nowhere did that argument use independence. Summing over one variable inside
the joint distribution produces the other's marginal whether the two are
related or not, which is why means always add. Variances do not, and Section 9
shows exactly what independence buys.

By induction the result extends to any number of terms and any coefficients:

$$E\\left[\\sum_{i=1}^{n} a_{i}X_{i}\\right] = \\sum_{i=1}^{n} a_{i}E[X_{i}]$$

What linearity does NOT do is pass through non-linear functions. In general
$E[g(X)] \\ne g(E[X])$, and for a convex g the expectation of the function is
the larger of the two. Squaring is the case that matters here, and the gap it
creates is the variance itself.

## 7.3 Worked: a continuous expectation, start to finish

Given: the fraction X of rated capacity drawn by a feeder over a random hour
has density f(x) = 2x on the interval from 0 to 1 and zero elsewhere. Find the
mean, the variance, the median, and the probability the draw exceeds half of
rating.

Relation: the integral definitions above.

First confirm the density is legitimate, which is the step most often skipped:

$$\\int_{0}^{1} 2x\\,dx = \\left[x^{2}\\right]_{0}^{1} = 1$$

Then the two moments:

$$E[X] = \\int_{0}^{1} x(2x)\\,dx = \\left[\\frac{2x^{3}}{3}\\right]_{0}^{1} = \\frac{2}{3} = 0.6667$$

$$E[X^{2}] = \\int_{0}^{1} x^{2}(2x)\\,dx = \\left[\\frac{x^{4}}{2}\\right]_{0}^{1} = 0.5$$

$$\\mathrm{Var}(X) = 0.5 - 0.4444 = 0.0556$$

so the standard deviation is 0.2357. The cumulative function is the integral
of the density up to x:

$$F(x) = \\int_{0}^{x} 2u\\,du = x^{2}$$

which gives both remaining answers at once. The median solves
$x^{2} = 0.5$, so it is 0.7071 — above the mean, as it must be for a density
that leans right. And

$$P(X > 0.5) = 1 - F(0.5) = 1 - 0.25 = 0.75$$

Three quarters of the hours draw more than half of rating, on a mean of two
thirds. The median exceeding the mean here is the reverse of the usual
skew-right picture and is worth pausing on: this density piles probability up
against its RIGHT limit, so the long thin tail points left.

## 7.4 Worked: linearity when the terms are anything but independent

Given: five fuses are pulled for testing and replaced into the five holders at
random, all 120 orderings equally likely. Let X be the number of fuses that end
up back in their own holder. Find E[X].

Relation: write X as a sum of indicators and use linearity, which does not care
that the indicators are strongly dependent — if four fuses are home, the fifth
must be too.

Let I_k be 1 when fuse k returns to its own holder. Any individual fuse is
equally likely to land in any of the five holders, so E[I_k] = 1/5, and

$$E[X] = \\sum_{k=1}^{5} E[I_{k}] = 5 \\times 0.2 = 1$$

One fuse home on average, whatever the number of fuses — the same argument
gives exactly 1 for fifty fuses or for five thousand.

The sample space here has only 120 points, so the answer can be settled by
listing. Counting matches over all 120 orderings gives a total of 120 matches,
hence a mean of exactly 1, and the second moment works out to 2, so the
variance is also exactly 1. The probability that NO fuse comes home is 44/120:

$$44 / 120 = 0.36667$$

Now notice what linearity bought. The distribution of X is awkward — it can
never equal 4, for the reason given above — yet its mean fell out of a
one-line argument that never touched that distribution. Whenever a count can be
written as a sum of yes/no indicators, its mean is the sum of their
probabilities, dependence and all.`,
      examTip: 'Before integrating anything, check that the density integrates to 1 over its stated range. A stem that gives f(x) = kx and asks for k is testing exactly that, and a stem that gives the density outright is offering you a free check on whether you have read the limits correctly.',
      importantNote: 'E[g(X)] and g(E[X]) are different numbers for every non-linear g. Substituting the mean into a cost curve, an efficiency curve or a power law gives the cost at the average condition, not the average cost — and for a convex curve the true average is always the larger.',
    },
    {
      id: 'ev-moments',
      title: '8. Variance, Moments and the Generating Function',
      content: `## 8.1 The computational identity, derived

Variance is defined as the mean squared deviation from the mean:

$$\\mathrm{Var}(X) = E\\left[(X-\\mu)^{2}\\right]$$

Expanding the square and applying linearity term by term turns that definition
into something you can compute in one pass over the data:

$$E\\left[(X-\\mu)^{2}\\right] = E\\left[X^{2} - 2\\mu X + \\mu^{2}\\right] = E[X^{2}] - 2\\mu E[X] + \\mu^{2}$$

$$\\mathrm{Var}(X) = E[X^{2}] - \\mu^{2}$$

Because the left side is an average of squares it can never be negative, which
gives a free inequality: $E[X^{2}] \\ge (E[X])^{2}$ for every random variable,
with equality only when X is constant. An exam answer in which the second
moment comes out below the squared mean has an arithmetic error, not an unusual
distribution.

The scaling rules follow from the same expansion. Shifting every outcome by b
shifts the mean by b and leaves every deviation untouched; scaling by a scales
every deviation by a and every squared deviation by a squared:

$$\\mathrm{Var}(aX+b) = a^{2}\\,\\mathrm{Var}(X), \\qquad \\sigma_{aX+b} = |a|\\,\\sigma_{X}$$

## 8.2 Moments name the shape

The k-th raw moment and the k-th central moment are

$$\\mu_{k}' = E[X^{k}], \\qquad \\mu_{k} = E\\left[(X-\\mu)^{k}\\right]$$

The first raw moment is the mean and the second central moment is the variance.
The third and fourth, standardised so they carry no units, describe asymmetry
and tail weight:

$$\\gamma_{1} = \\frac{E\\left[(X-\\mu)^{3}\\right]}{\\sigma^{3}}, \\qquad \\gamma_{2} = \\frac{E\\left[(X-\\mu)^{4}\\right]}{\\sigma^{4}} - 3$$

A symmetric distribution has zero skewness; a right tail makes it positive. The
subtraction of 3 in the excess kurtosis makes the normal the zero reference.
These two numbers are the quantities the central limit theorem drives toward
zero, which is why they appear here rather than as decoration.

The moment-generating function packages every moment into one function of a
dummy variable t:

$$M_{X}(t) = E\\left[e^{tX}\\right]$$

Expanding the exponential inside the expectation shows why it works, since each
power of t collects one moment:

$$M_{X}(t) = 1 + tE[X] + \\frac{t^{2}}{2!}E[X^{2}] + \\frac{t^{3}}{3!}E[X^{3}] + \\cdots$$

$$E[X^{n}] = \\left.\\frac{d^{n}M_{X}}{dt^{n}}\\right|_{t=0}$$

One more property earns the MGF its place. For INDEPENDENT variables the
expectation of the product factors, so

$$M_{X+Y}(t) = M_{X}(t)\\,M_{Y}(t)$$

which turns a convolution of distributions into a multiplication of functions.
That is how the sum of independent normals is shown to be normal, and the sum
of independent Poissons to be Poisson with the rates added.

## 8.3 Worked: the exponential, from its generating function

Given: T is exponential with rate lambda = 0.4 per hour. Derive the mean and
variance from the moment-generating function rather than from the tabulated
formulas.

Relation: the MGF definition, integrated.

$$M(t) = \\int_{0}^{\\infty} e^{tx}\\,\\lambda e^{-\\lambda x}\\,dx = \\lambda\\int_{0}^{\\infty} e^{-(\\lambda - t)x}\\,dx = \\frac{\\lambda}{\\lambda - t}$$

valid for t below lambda, which is where the integral converges. Differentiate
once and twice:

$$M'(t) = \\frac{\\lambda}{(\\lambda-t)^{2}}, \\qquad M''(t) = \\frac{2\\lambda}{(\\lambda-t)^{3}}$$

Evaluating at t = 0 gives the first two moments directly:

$$E[T] = M'(0) = \\frac{1}{\\lambda} = 2.5 \\ \\text{hours}, \\qquad E[T^{2}] = M''(0) = \\frac{2}{\\lambda^{2}} = 12.5$$

$$\\mathrm{Var}(T) = 12.5 - 6.25 = 6.25$$

so the standard deviation is 2.5 hours, equal to the mean — the exponential's
signature. The same two derivatives at t = 0 give the third and fourth moments
if you want them, and they produce a skewness of exactly 2 and an excess
kurtosis of exactly 6, both independent of lambda. That skewness of 2 is the
number Section 13 sends to zero.

## 8.4 Worked: the Poisson generating function

Given: X is Poisson with lambda = 2.6 events per window. Confirm that mean and
variance are both lambda by generating them.

Relation: sum the MGF series.

$$M(t) = \\sum_{k=0}^{\\infty} e^{tk}\\frac{\\lambda^{k}e^{-\\lambda}}{k!} = e^{-\\lambda}\\sum_{k=0}^{\\infty}\\frac{(\\lambda e^{t})^{k}}{k!} = e^{\\lambda(e^{t}-1)}$$

The inner sum is the exponential series with argument lambda e^t. Differentiate
using the chain rule:

$$M'(t) = \\lambda e^{t} e^{\\lambda(e^{t}-1)}, \\qquad M''(t) = \\left(\\lambda e^{t} + \\lambda^{2}e^{2t}\\right)e^{\\lambda(e^{t}-1)}$$

At t = 0 the outer exponential is 1, leaving

$$E[X] = 2.6, \\qquad E[X^{2}] = 2.6 + 6.76 = 9.36$$

$$\\mathrm{Var}(X) = 9.36 - 6.76 = 2.6$$

Mean and variance agree, as advertised. The product property now gives a result
worth remembering for free: two independent Poisson counts with rates 2.6 and
1.4 have MGFs whose product is the MGF of a Poisson with rate 4.0, so counts on
adjacent intervals simply pool.`,
      examTip: 'Compute E[X²] and E[X] in the same pass through the table, then subtract the square once. Building a deviation column instead doubles the arithmetic and gives the rounding error two chances to bite.',
    },
    {
      id: 'ev-sums',
      title: '9. Sums, Covariance and the Cross Term',
      content: `## 9.1 What independence actually buys

For two variables, expand the definition of the variance of a sum and keep
every term:

$$\\mathrm{Var}(X+Y) = E\\left[\\left((X-\\mu_{X}) + (Y-\\mu_{Y})\\right)^{2}\\right]$$

$$\\mathrm{Var}(X+Y) = \\mathrm{Var}(X) + \\mathrm{Var}(Y) + 2\\,\\mathrm{Cov}(X,Y)$$

where the covariance is the mean product of the two deviations, with the same
computational identity the variance has:

$$\\mathrm{Cov}(X,Y) = E\\left[(X-\\mu_{X})(Y-\\mu_{Y})\\right] = E[XY] - E[X]E[Y]$$

Independence makes E[XY] factor into E[X]E[Y], so the covariance vanishes and
the cross term disappears. THAT is what independence buys, and it is the only
thing it is needed for here: means added without it back in Section 7.

For a difference the cross term flips sign, because replacing Y by −Y flips the
sign of its deviations:

$$\\mathrm{Var}(X-Y) = \\mathrm{Var}(X) + \\mathrm{Var}(Y) - 2\\,\\mathrm{Cov}(X,Y)$$

The general form for a weighted sum of several variables carries one cross term
per pair:

$$\\mathrm{Var}\\left(\\sum_{i=1}^{n} a_{i}X_{i}\\right) = \\sum_{i=1}^{n} a_{i}^{2}\\mathrm{Var}(X_{i}) + 2\\sum_{i<j} a_{i}a_{j}\\,\\mathrm{Cov}(X_{i},X_{j})$$

## 9.2 Correlation, and why it cannot exceed one

The covariance carries the units of X times the units of Y, which makes it
useless for comparison. Dividing by the two standard deviations removes them:

$$\\rho = \\frac{\\mathrm{Cov}(X,Y)}{\\sigma_{X}\\sigma_{Y}}, \\qquad \\mathrm{Cov}(X,Y) = \\rho\\,\\sigma_{X}\\sigma_{Y}$$

The bound on rho is not an assertion; it follows in two lines from the fact
that a variance cannot be negative. Standardise both variables and add them:

$$\\mathrm{Var}\\!\\left(\\frac{X}{\\sigma_{X}} + \\frac{Y}{\\sigma_{Y}}\\right) = 1 + 1 + 2\\rho = 2(1+\\rho) \\ge 0$$

$$\\mathrm{Var}\\!\\left(\\frac{X}{\\sigma_{X}} - \\frac{Y}{\\sigma_{Y}}\\right) = 2(1-\\rho) \\ge 0$$

The first forces rho at or above −1, the second forces it at or below +1, and
equality in either case means the corresponding combination has zero variance —
that is, the two variables are exactly linearly related. Substituting the
correlation form of the covariance into the variance of a sum gives the working
formula:

$$\\mathrm{Var}(X \\pm Y) = \\sigma_{X}^{2} + \\sigma_{Y}^{2} \\pm 2\\rho\\,\\sigma_{X}\\sigma_{Y}$$

![Variance of the sum and of the difference of two equally variable quantities, plotted against their correlation and normalised by the independent value. The sum runs from zero at a correlation of minus one to twice the independent value at plus one; the difference is its mirror image, and the two cross at the independent case.](/courses/fe-ee/figures/prob2-var-sum-rho.svg)

The figure makes the range concrete. At rho = 1 a sum has twice the variance
independence would predict and a difference has none; at rho = −1 the two swap.
Everything an engineer does with correlated errors — differential signalling,
common-mode rejection, matched components, hedged portfolios — lives somewhere
on those two lines.

## 9.3 Worked: a stack of nominally identical resistors

Given: four resistors, each with a nominal 220 ohms and a manufacturing
standard deviation of 3.3 ohms (1.5% of nominal), are placed in series. The
four are drawn from different batches and are independent. Find the mean and
standard deviation of the total, and compare the relative spread with that of a
single unit.

Relation: means add; independent variances add.

$$E[R_{\\text{tot}}] = 4 \\times 220 = 880 \\ \\text{ohms}$$

$$\\mathrm{Var}(R_{\\text{tot}}) = 4 \\times 10.89 = 43.56 \\quad \\Longrightarrow \\quad \\sigma = 2 \\times 3.3 = 6.6 \\ \\text{ohms}$$

The absolute spread doubled while the total quadrupled, so the relative spread
halved:

$$6.6 / 880 = 0.0075$$

against 3.3/220 = 0.015 for one resistor. Series stacking averages tolerance
away, which is why a chain of nominally identical parts is tighter as a
fraction than any of its members. The trap answer adds standard deviations to
get 13.2 ohms and a relative spread of 1.5%, which would mean stacking bought
nothing at all.

## 9.4 Worked: two channels sharing a drift

Given: two measurement channels each read a shared reference plus their own
noise. The shared drift C has variance 4 and each channel's private noise has
variance 1, all independent of one another. Find the variance of the sum and of
the difference of the two readings.

Relation: build each reading, then use the cross-term formula.

Each reading is $X = C + N_{1}$ and $Y = C + N_{2}$, so

$$\\mathrm{Var}(X) = \\mathrm{Var}(Y) = 4 + 1 = 5, \\qquad \\mathrm{Cov}(X,Y) = \\mathrm{Var}(C) = 4$$

The covariance is exactly the shared part, because the private noises are
independent of C and of each other. The correlation is therefore 4/5 = 0.8, and

$$\\mathrm{Var}(X+Y) = 5 + 5 + 8 = 18$$

$$\\mathrm{Var}(X-Y) = 5 + 5 - 8 = 2$$

The difference has variance 2, which is exactly the two private noises and
nothing else: the shared drift cancelled completely. Its standard deviation is
1.414 against 4.243 for the sum, a rejection of the common part by a factor of
three in amplitude. This is common-mode rejection expressed in statistics
rather than in circuit terms, and it is why the reading that matters is so
often a difference.`,
      examTip: 'Add variances, never standard deviations, and check the sign of the cross term against the physical story: shared causes make the covariance positive and inflate sums, compensating causes make it negative and inflate differences instead.',
      importantNote: 'The independence used when variances are added must be independence of the terms being added, not of the measurements. Two readings from the same drifting reference are not independent no matter how carefully each was taken, and treating them as such understates the variance of their sum by twice the shared variance.',
    },
    {
      id: 'ev-uncorrelated',
      title: '10. Zero Correlation Is Not Independence',
      content: `## 10.1 Two conditions that are not the same

Independence says the joint distribution factors:

$$p(x,y) = p_{X}(x)\\,p_{Y}(y) \\quad \\text{for every pair } (x,y)$$

Zero correlation says one number is zero:

$$E[XY] = E[X]\\,E[Y] \\quad \\Longleftrightarrow \\quad \\mathrm{Cov}(X,Y) = 0$$

The first implies the second, because factoring the joint distribution lets the
double sum in E[XY] split into a product of single sums. The second does NOT
imply the first, and the reason is that correlation measures one specific kind
of association — the straight-line kind — while independence forbids every kind.
A relationship that is perfectly deterministic but symmetric about the mean of
X contributes positive products on one side and equal negative products on the
other, and they cancel.

## 10.2 Worked: a counterexample built from four points

Given: X takes the values −2, −1, 1 and 2, each with probability 1/4, and
Y = X squared. Find the covariance and the correlation, then decide whether X
and Y are independent.

Relation: the computational form of the covariance, evaluated by summing over
the four equally likely outcomes.

The sample space has four points, so every expectation is a four-term sum.

$$E[X] = \\frac{-2 - 1 + 1 + 2}{4} = 0$$

$$E[Y] = \\frac{4 + 1 + 1 + 4}{4} = 2.5$$

$$E[XY] = E[X^{3}] = \\frac{-8 - 1 + 1 + 8}{4} = 0$$

$$\\mathrm{Cov}(X,Y) = 0 - 0 \\times 2.5 = 0 \\quad \\Longrightarrow \\quad \\rho = 0$$

The correlation is exactly zero. Now test independence directly, which requires
comparing a conditional probability with its unconditional counterpart:

$$P(Y = 4) = 0.5, \\qquad P(Y = 4 \\mid X = 2) = 1$$

Knowing X does not merely shift the odds on Y — it settles Y completely. X and
Y are as dependent as two variables can be, and the correlation coefficient
cannot see it. The conditional mean tells the same story: E[Y] is 2.5 overall
but 1 when X is ±1 and 4 when X is ±2, so the conditional mean is not constant,
which by itself rules out independence.

For completeness, the two variances are worth having: E[Y²] is
(16 + 1 + 1 + 16)/4 = 8.5, so

$$\\mathrm{Var}(Y) = 8.5 - 6.25 = 2.25$$

and Var(X) = 2.5 by the same route. Both are positive and finite, so the zero
correlation is genuinely zero rather than the 0/0 artefact that a degenerate
variable would produce.

![Left panel: the four equally likely points of X with Y equal to X squared, the horizontal line at the mean of Y drawn through them, showing that the products of the deviations cancel in pairs so the covariance is zero. Right panel: the continuous version with X uniform on minus one to one, a perfect parabola whose correlation with X is also zero.](/courses/fe-ee/figures/prob2-zero-corr-dependent.svg)

The continuous twin behaves identically. With X uniform on the interval from −1
to 1 and Y = X squared again,

$$E[XY] = E[X^{3}] = \\int_{-1}^{1} \\frac{x^{3}}{2}\\,dx = 0$$

by the symmetry of an odd function over a symmetric interval, and E[X] = 0, so
the covariance is zero once more while Y remains a function of X.

## 10.3 When zero correlation IS enough

Three cases matter for the exam.

First, for variance arithmetic, zero correlation is all you need. The cross term
in Section 9 contains the covariance, not the joint distribution, so
uncorrelated variables have

$$\\mathrm{Var}(X+Y) = \\mathrm{Var}(X) + \\mathrm{Var}(Y)$$

whether or not they are independent. Independence is sufficient but stronger
than the job requires.

Second, for JOINTLY NORMAL variables the two conditions coincide: zero
correlation does imply independence. That is a special property of the
multivariate normal and does not transfer. Note also that two separately normal
variables need not be jointly normal, so the shortcut has a genuine
precondition.

Third, in the other direction, a strong non-linear relationship can drive a
sample correlation toward zero and mislead a reader into declaring "no
relationship". The defence is a scatter plot; a correlation coefficient
reported without one is a summary of a picture nobody looked at.

| Statement | True in general? | Why |
|---|---|---|
| independent implies uncorrelated | yes | the joint factors, so E[XY] factors |
| uncorrelated implies independent | no | the four-point example above |
| uncorrelated is enough for variances to add | yes | only the covariance appears in the cross term |
| uncorrelated implies independent for jointly normal pairs | yes | a special property of that family |
| correlation near zero means no relationship | no | it means no LINEAR relationship |`,
      examTip: 'When an item asks whether two variables are independent, test the definition — compare a joint probability with the product of the marginals, or a conditional mean with the unconditional one. A correlation of zero is evidence about linearity only, and it is the intended trap on this concept.',
    },
    {
      id: 'ev-total',
      title: '11. The Law of Total Expectation',
      content: `## 11.1 Averaging the averages

When a population is a mixture of groups, the overall mean is the
probability-weighted average of the group means, and the overall variance is
NOT the weighted average of the group variances. Both statements are contained
in a pair of identities:

$$E[X] = E\\big[E[X \\mid Y]\\big] = \\sum_{y} E[X \\mid Y=y]\\,P(Y=y)$$

$$\\mathrm{Var}(X) = E\\big[\\mathrm{Var}(X \\mid Y)\\big] + \\mathrm{Var}\\big(E[X \\mid Y]\\big)$$

The first is the law of total expectation; the second is often called the
variance decomposition, and it is the statement that total spread is
within-group spread plus between-group spread. Both terms on the right are
non-negative, so pooling groups can only increase variance relative to the
average within-group variance — the mixture is always at least as spread out as
its parts.

The first identity is the continuous analogue of total probability from
Section 8 of the previous chapter, with an expectation in place of a
probability. The second follows from applying the computational identity twice,
once inside each group and once across groups.

## 11.2 Worked: two production lines, pooled

Given: line A makes 60% of the output with a mean fill of 50 mL and a standard
deviation of 4 mL; line B makes 40% with a mean of 62 mL and a standard
deviation of 6 mL. Find the mean and standard deviation of the pooled output.

Relation: the two identities above, with Y the line identity.

The pooled mean is the weighted average of the two:

$$0.6 \\times 50 + 0.4 \\times 62 = 54.8 \\ \\text{mL}$$

The first variance term averages the within-line variances, 16 and 36:

$$E\\big[\\mathrm{Var}(X \\mid Y)\\big] = 0.6 \\times 16 + 0.4 \\times 36 = 24$$

The second term is the variance of the two group means about the pooled mean.
The deviations are 50 − 54.8 = −4.8 and 62 − 54.8 = 7.2, whose squares are
23.04 and 51.84:

$$\\mathrm{Var}\\big(E[X \\mid Y]\\big) = 0.6 \\times 23.04 + 0.4 \\times 51.84 = 34.56$$

$$\\mathrm{Var}(X) = 24 + 34.56 = 58.56 \\quad \\Longrightarrow \\quad \\sigma = 7.65 \\ \\text{mL}$$

The pooled standard deviation of 7.65 mL is LARGER than either line's, 4 mL and
6 mL. That is the whole point of the decomposition: 24 of the 58.56 comes from
scatter inside the lines and 34.56 — more than half — comes from the fact that
the lines are not centred on the same value. A quality programme that chased
within-line scatter alone would be attacking the smaller of the two terms.

The trap answer averages the standard deviations, 0.6(4) + 0.4(6) = 4.8 mL, or
averages the variances to get 24 and reports 4.90 mL. Both discard the
between-group term entirely, and both come out below the individual lines,
which is impossible for a mixture.

## 11.3 Conditioning as a solution technique

The law is more than a bookkeeping identity; it is a way to compute an
expectation you cannot attack head-on. Condition on whatever makes the rest
easy, take the inner expectation, then average.

The clearest case is a random number of random terms. Let N be a count with
mean E[N], and let each of the N items contribute an independent amount C with
mean E[C]. Conditioning on N,

$$E\\left[\\sum_{i=1}^{N} C_{i}\\right] = E\\big[N\\,E[C]\\big] = E[N]\\,E[C]$$

so expected total cost is expected count times expected unit cost. The variance
needs both terms of the decomposition and comes out to

$$\\mathrm{Var}\\left(\\sum_{i=1}^{N} C_{i}\\right) = E[N]\\,\\mathrm{Var}(C) + \\mathrm{Var}(N)\\,\\big(E[C]\\big)^{2}$$

Read it as the two ways a total can vary: the individual amounts scatter, and
the number of them scatters. Warranty reserves, spare-part budgets and outage
cost estimates are all this formula wearing different labels, and dropping the
second term — which is what happens when a planner multiplies an average count
by an average cost and stops — understates the risk badly whenever the count
itself is volatile.`,
      examTip: 'Pooled variance is within plus between. If a stem gives you group means AND group standard deviations, it wants both terms; if the group means are all equal the second term vanishes and the answer really is the weighted average of the variances — which is exactly the case exam writers use to make the general rule look unnecessary.',
      importantNote: 'A pooled standard deviation can never fall below the smallest group standard deviation, because the between-group term only adds. An answer that does is a dropped term, not a subtle effect.',
    },
    {
      id: 'ev-chebyshev',
      title: '12. Chebyshev: What a Standard Deviation Guarantees',
      content: `## 12.1 From Markov to Chebyshev

For a non-negative random variable, the mean bounds how much probability can
sit far out. Split the expectation at a threshold a and throw away the lower
piece:

$$E[X] = \\int_{0}^{\\infty} x f(x)\\,dx \\ \\ge \\ \\int_{a}^{\\infty} x f(x)\\,dx \\ \\ge \\ a\\int_{a}^{\\infty} f(x)\\,dx = a\\,P(X \\ge a)$$

$$P(X \\ge a) \\le \\frac{E[X]}{a}$$

That is Markov's inequality. Apply it to the non-negative variable
$(X-\\mu)^{2}$ with threshold $k^{2}\\sigma^{2}$, and note that squaring both
sides of an absolute-value inequality is reversible for non-negative
quantities:

$$P\\big(|X-\\mu| \\ge k\\sigma\\big) = P\\big((X-\\mu)^{2} \\ge k^{2}\\sigma^{2}\\big) \\le \\frac{E[(X-\\mu)^{2}]}{k^{2}\\sigma^{2}} = \\frac{1}{k^{2}}$$

$$P\\big(|X-\\mu| < k\\sigma\\big) \\ge 1 - \\frac{1}{k^{2}}$$

No assumption was made about the shape of the distribution — only that the mean
and variance exist. That universality is the inequality's whole value and also
the reason it is loose: a bound that must cover every distribution has to cover
the worst one.

## 12.2 How loose, and where it is tight

The bound says at most 25% of any distribution lies two standard deviations or
more from its mean. The normal puts 4.55% there and the exponential 4.98%; the
uniform puts nothing there at all, since it never strays more than 1.73
standard deviations from its mean.

| k | Chebyshev ceiling | Normal | Exponential (mean 1) | Uniform |
|---|---|---|---|---|
| 2 | 0.2500 | 0.0455 | 0.0498 | 0 |
| 3 | 0.1111 | 0.0027 | 0.0183 | 0 |
| 4 | 0.0625 | 0.0000633 | 0.0067 | 0 |

The bound is nevertheless the best possible without further assumptions,
because a distribution exists that attains it. Put probability
$1/(2k^{2})$ at each of $\\mu - k\\sigma$ and $\\mu + k\\sigma$ and the rest at
the mean itself. For k = 2 that is 1/8 at each extreme and 3/4 in the middle,
which has mean mu and variance

$$2 \\times 0.125 \\times (2\\sigma)^{2} = \\sigma^{2}$$

as required, with exactly 0.25 of its probability at or beyond two standard
deviations. No inequality that must hold for THAT distribution can be tightened.

![Chebyshev's one-over-k-squared ceiling drawn against the tail probabilities actually produced by the normal and by the exponential, on a logarithmic probability axis. The three-point distribution that attains the bound at two standard deviations is marked on the ceiling itself.](/courses/fe-ee/figures/prob2-chebyshev-bound.svg)

## 12.3 Worked: how much can be claimed without a distribution

Given: a batch of parts has a mean hardness of 100 and a standard deviation of
5, with no distributional assumption stated. (a) Bound the fraction outside 85
to 115. (b) State what changes if the hardnesses are known to be normal.

Relation: Chebyshev for (a), the standard normal table for (b).

(a) The limits sit 15 units from the mean, which is k = 15/5 = 3 standard
deviations. Chebyshev gives

$$P\\big(|X-100| \\ge 15\\big) \\le 1 / 9 = 0.1111$$

so at most 11.1% lies outside, and therefore at least 88.9% lies inside. Both
statements are bounds, not estimates: the true fraction could be anything from
0 to 0.1111.

(b) With normality the answer is no longer a bound but a value. Three standard
deviations put 0.9973 inside, so

$$1 - 0.9973 = 0.0027$$

outside — forty-one times smaller than the Chebyshev ceiling. The lesson is
that a distributional assumption is worth a great deal, and that Chebyshev is
what you fall back on when you cannot make one.

The exam item that separates candidates is the one that gives a mean and a
standard deviation, says NOTHING about shape, and offers 0.0027 among the
choices. Applying the 68-95-99.7 rule to an unspecified distribution is
unjustified; only the 0.1111 bound is defensible, and only as a bound.`,
      examTip: 'Read the stem for the words "normally distributed". If they are present, use the z-table. If they are absent and only a mean and a standard deviation are given, Chebyshev is the only tool available, and the answer will be an inequality rather than a number.',
    },
    {
      id: 'ev-clt',
      title: '13. Large Numbers and the Central Limit Theorem',
      content: `## 13.1 The sample mean has its own distribution

Draw n independent observations from a population with mean mu and variance
sigma squared, and average them:

$$\\bar{X}_{n} = \\frac{1}{n}\\sum_{i=1}^{n} X_{i}$$

Linearity gives its mean, and independent variances add before the 1/n squared
comes out of the variance:

$$E\\big[\\bar{X}_{n}\\big] = \\frac{1}{n}\\sum_{i=1}^{n} \\mu = \\mu$$

$$\\mathrm{Var}\\big(\\bar{X}_{n}\\big) = \\frac{1}{n^{2}}\\sum_{i=1}^{n} \\sigma^{2} = \\frac{\\sigma^{2}}{n}$$

The average is centred where the population is, and its spread shrinks with n.
Feeding that variance into Chebyshev proves the weak law of large numbers in one
line:

$$P\\big(|\\bar{X}_{n} - \\mu| \\ge \\varepsilon\\big) \\le \\frac{\\sigma^{2}}{n\\varepsilon^{2}} \\ \\longrightarrow \\ 0 \\quad \\text{as } n \\to \\infty$$

For any tolerance you name, however tight, the probability of missing it goes to
zero. That is the entire justification for estimating a mean by averaging.

## 13.2 The central limit theorem, and what it fixes

The law of large numbers says where the sample mean goes. The central limit
theorem says what shape it has on the way:

$$Z_{n} = \\frac{\\bar{X}_{n} - \\mu}{\\sigma/\\sqrt{n}} \\ \\xrightarrow{\\ d\\ } \\ N(0,1)$$

equivalently, for the sum,

$$\\sum_{i=1}^{n} X_{i} \\ \\dot\\sim \\ N\\big(n\\mu,\\ n\\sigma^{2}\\big)$$

The theorem requires finite mean and variance and independent, identically
distributed terms. It requires NOTHING about the shape of the parent. What
disappears with n is the parent's asymmetry, and it disappears at a known rate:
the skewness of an average is the parent's skewness divided by the square root
of n.

$$\\gamma_{1}\\big(\\bar{X}_{n}\\big) = \\frac{\\gamma_{1}(X)}{\\sqrt{n}}$$

Take a decidedly non-normal parent — the exponential, whose skewness is exactly
2 and whose density is a decreasing curve with a hard wall at zero, about as
far from a symmetric bell as a common distribution gets. The table below is the
theory, and a simulation of 2,000,000 sample means per row reproduced each
standard deviation to within 0.002 and each skewness to within 0.007.

| n | standard deviation of the mean, σ/√n | skewness of the mean, 2/√n |
|---|---|---|
| 1 | 1.0000 | 2.0000 |
| 2 | 0.7071 | 1.4142 |
| 5 | 0.4472 | 0.8944 |
| 30 | 0.1826 | 0.3651 |
| 100 | 0.1000 | 0.2000 |

At n = 30 the skewness has fallen to

$$2 / 5.4772 = 0.36515$$

which is small enough that normal-based intervals are usable, and this is where
the rule of thumb "n of about 30" comes from. It is a rule about the PARENT's
skewness, not a law: a parent with skewness 6 needs nine times the sample size
to reach the same standardised asymmetry, and a symmetric parent needs far less.

![Four panels showing the exact density of the standardised sample mean of one, two, five and thirty exponential observations, each drawn against the standard normal density. The single observation is a hard-edged decaying curve; by thirty the two curves nearly coincide, the skewness having fallen from two to 0.37.](/courses/fe-ee/figures/prob2-clt-exponential.svg)

## 13.3 Worked: forty service times

Given: a queue serves 40 independent jobs, each taking an exponentially
distributed time with a mean of 3 minutes. Find the probability the total is at
most 150 minutes.

Relation: the central limit theorem applied to the sum, with the exponential's
standard deviation equal to its mean.

Parameters of the sum:

$$E\\left[\\sum T_{i}\\right] = 40 \\times 3 = 120 \\ \\text{min}, \\qquad \\sigma = 3 \\times 6.3246 = 18.974 \\ \\text{min}$$

Standardise:

$$z = 30 / 18.974 = 1.5811$$

Reading the table at z = 1.58 gives 0.9429, so the approximation is about
**0.943**.

The exact answer is available for this particular sum, because a sum of
independent exponentials has a known distribution, and it is 0.9354. The
approximation is high by 0.008. That residual is the parent's skewness leaking
through: at n = 40 the standardised skewness is still
$2/6.3246 = 0.3162$, and a right-skewed sum has a slightly heavier upper tail
than the normal predicts, so the normal overstates how much probability lies
below a point above the mean.

Two lessons. The approximation is good enough for engineering work at n = 40 —
0.943 against 0.935 will not change a decision — and it is NOT exact, so an
item asking for three-decimal agreement with an exact method is asking a
different question. The direction of the error is also predictable: for a
right-skewed parent, the normal approximation to a cumulative probability above
the mean runs high.`,
      examTip: 'The central limit theorem describes the SAMPLE MEAN or the SUM, never the individual observations. A stem asking for the probability that one unit exceeds a limit uses the population standard deviation; one asking about the average of n units uses σ over the square root of n. Those two answers differ by a factor of the square root of n in the z, which is why both appear among the choices.',
      importantNote: 'Sample size fixes the SHAPE of the sampling distribution, not the accuracy of the parent parameters. If the quoted σ is wrong, taking more samples narrows the interval around the wrong centre — a large n cannot rescue a biased measurement.',
    },
    {
      id: 'ev-sampling',
      title: '14. Sampling Distributions and the Standard Error',
      content: `## 14.1 Two spreads that get confused

The population standard deviation sigma describes how far individual
observations sit from the mean. The standard error describes how far a SAMPLE
MEAN sits from the population mean:

$$\\mathrm{SE}(\\bar{X}) = \\frac{\\sigma}{\\sqrt{n}}$$

When sigma is unknown, which is nearly always, the sample standard deviation
stands in for it and the estimated standard error is s over the square root of
n. The two quantities answer different questions and appear in different
problems, and mixing them is the most common single error in this part of the
syllabus.

For a proportion the population standard deviation is fixed by the proportion
itself, since the underlying variable is Bernoulli:

$$\\mathrm{SE}(\\hat{p}) = \\sqrt{\\frac{p(1-p)}{n}}$$

which is largest at p = 0.5 and shrinks toward zero as p approaches either end
— the reason a survey of a near-unanimous population needs fewer respondents
than one of a split population for the same absolute precision.

A finite population correction applies when the sample is a large fraction of
the population, exactly as it did for the hypergeometric:

$$\\mathrm{SE}_{\\text{finite}} = \\frac{\\sigma}{\\sqrt{n}}\\sqrt{\\frac{N-n}{N-1}}$$

and it is ignorable when n is below about 5% of N.

## 14.2 The square-root law and what it costs

Because the standard error carries a square root, precision is expensive:

$$\\frac{\\mathrm{SE}(n_{2})}{\\mathrm{SE}(n_{1})} = \\sqrt{\\frac{n_{1}}{n_{2}}}$$

Halving the standard error requires four times the sample. Cutting it by a
factor of ten requires a hundred times the sample. Every measurement-averaging
scheme in instrumentation obeys this, and it is the same square-root growth of
accumulated noise met in Section 4, run in the other direction.

![Standard error of the mean plotted against sample size for a population standard deviation of eight, with the sample sizes sixteen, sixty-four and two hundred and fifty-six marked at standard errors of two, one and one half. The arrow between the last two shows that halving the error takes four times the data.](/courses/fe-ee/figures/prob2-se-root-n.svg)

## 14.3 Worked: sizing a sample

Given: a dimension has a population standard deviation of 8 micrometres.
(a) Find the standard error of the mean of 64 parts. (b) Find the sample size
needed to bring it to 0.5 micrometres. (c) Give the interval within which the
sample mean of 64 parts falls 95% of the time, assuming the central limit
theorem applies.

Relation: the standard error formula, inverted for (b).

(a) The square root of 64 is 8, so

$$\\mathrm{SE} = 8 / 8 = 1 \\ \\mu\\text{m}$$

(b) Setting the standard error to 0.5 and squaring:

$$n = (8 / 0.5)^{2} = 256$$

Four times the sample for half the error, exactly as the square-root law
predicts.

(c) With the sampling distribution approximately normal, 95% of sample means
lie within 1.96 standard errors of the population mean:

$$1.96 \\times 1 = 1.96 \\ \\mu\\text{m}$$

so the sample mean of 64 parts falls within about 2 micrometres of the truth
95% of the time. Note what that number is NOT: it says nothing about where an
individual part falls, and 95% of individual parts lie within 1.96 × 8 = 15.7
micrometres of the mean, eight times wider. Confusing the two is the classic
distractor, and the ratio between the wrong and right answers is always the
square root of n.

For a proportion the same machinery applies. Sampling 400 units from a process
running at p = 0.20 defective gives

$$\\mathrm{SE}(\\hat{p}) = \\sqrt{0.16 / 400} = 0.02$$

so the observed defect fraction lands within about 4 percentage points of 0.20
in 95% of samples — which is why a 400-unit audit cannot distinguish a 20%
defect rate from an 18% one.`,
      examTip: 'Ask which thing the question is about before choosing a denominator: one item uses σ, an average of n items uses σ over the square root of n. Then read the sample size out of the stem and use it, rather than the number of groups or the number of measurements per item, both of which stems supply as decoys.',
    },
    {
      id: 'ev-estimation',
      title: '15. Point Estimation: Bias and Consistency',
      content: `## 15.1 What makes an estimator good

An estimator is a rule that turns a sample into a number. Its quality is judged
by how the number behaves across all the samples that might have been drawn.
Two properties carry most of the weight:

$$\\mathrm{Bias}(\\hat{\\theta}) = E[\\hat{\\theta}] - \\theta$$

$$\\mathrm{MSE}(\\hat{\\theta}) = E\\left[(\\hat{\\theta} - \\theta)^{2}\\right] = \\mathrm{Var}(\\hat{\\theta}) + \\mathrm{Bias}^{2}(\\hat{\\theta})$$

The decomposition of mean squared error into variance plus squared bias is the
same computational identity used for the variance, with the target theta in
place of the mean. It says the two defects trade off, and that an estimator may
be worth some bias if it buys enough variance reduction.

An estimator is CONSISTENT when it converges in probability to the target as
the sample grows:

$$\\hat{\\theta}_{n} \\ \\longrightarrow \\ \\theta \\quad \\text{as } n \\to \\infty$$

which is guaranteed whenever both the bias and the variance go to zero. The
sample mean is unbiased at every n and has variance sigma squared over n, so it
is consistent by inspection.

## 15.2 Where the n − 1 comes from

The sample variance divides the sum of squared deviations by n − 1, and the
reason is a single expectation. Start from the algebraic identity

$$\\sum_{i=1}^{n}(X_{i} - \\bar{X})^{2} = \\sum_{i=1}^{n} X_{i}^{2} - n\\bar{X}^{2}$$

and take expectations of each piece, using $E[W^{2}] = \\mathrm{Var}(W) + (E[W])^{2}$
twice:

$$E\\left[\\sum_{i=1}^{n} X_{i}^{2}\\right] = n\\left(\\sigma^{2} + \\mu^{2}\\right)$$

$$E\\left[n\\bar{X}^{2}\\right] = n\\left(\\frac{\\sigma^{2}}{n} + \\mu^{2}\\right) = \\sigma^{2} + n\\mu^{2}$$

Subtracting, the mu-squared terms cancel exactly and one sigma squared is left
behind:

$$E\\left[\\sum_{i=1}^{n}(X_{i} - \\bar{X})^{2}\\right] = n\\sigma^{2} + n\\mu^{2} - \\sigma^{2} - n\\mu^{2} = (n-1)\\sigma^{2}$$

So dividing that sum by n − 1 gives an unbiased estimator of sigma squared,
while dividing by n gives one that is low by a factor of (n − 1)/n on average.
The intuition behind the missing degree of freedom is in the identity itself:
deviations are taken about the sample mean rather than the true mean, and the
sample mean is the value that MINIMISES the sum of squared deviations, so the
sum is systematically too small.

## 15.3 Worked: the bias, seen

Given: samples of size 5 from a population with variance 1. Compare the two
estimators.

Relation: the expectation derived above, with n = 5.

$$E\\left[\\frac{1}{n}\\sum(X_{i}-\\bar{X})^{2}\\right] = \\frac{n-1}{n}\\sigma^{2} = 0.8$$

$$E\\left[\\frac{1}{n-1}\\sum(X_{i}-\\bar{X})^{2}\\right] = \\sigma^{2} = 1$$

Two million samples of five normal observations, generated and summarised,
returned 0.800 for the n-divisor and 1.000 for the n − 1 divisor, confirming
both lines to three decimals. The bias of the n-divisor is −0.2, and it is
−σ²/n in general, so it is a 20% understatement at n = 5, 5% at n = 20 and 1%
at n = 100 — which is why the distinction is an exam issue at exam sample sizes
and a non-issue in a plant database.

![Expected value of the two variance estimators as a fraction of the true variance, plotted against sample size. Dividing by n minus one gives one at every sample size; dividing by n gives the rising curve n minus one over n, which is 0.8 at a sample of five and still 0.95 at twenty.](/courses/fe-ee/figures/prob2-bias-n-minus-1.svg)

Two caveats keep this from being a slogan. First, unbiasedness does not survive
a non-linear transformation: even when s² is unbiased for sigma squared, s is
biased LOW for sigma, and the same simulation returned 0.940 for the mean of s
at n = 5. Taking a square root is not an averaging operation.

Second, unbiased is not the same as best. For normal data the mean squared
error of the n-divisor estimator is $(2n-1)/n^{2} = 0.36$ at n = 5, against
$2/(n-1) = 0.5$ for the unbiased one — the biased estimator is closer to the
truth on average, because the variance it saves outweighs the bias it adds. The
exam wants n − 1 because unbiasedness is the stated convention for a sample
variance, and that is the right answer to give; but the underlying trade-off is
the reason the choice is a convention rather than a theorem.`,
      examTip: 'Sample statistics divide by n − 1; population parameters divide by N. If a stem calls its numbers "a sample" or asks for an estimate, use n − 1. If it says the numbers ARE the whole population, use N. Both answers are always offered, and they differ by the factor the square root of n over n − 1.',
      importantNote: 'Bessel\'s correction fixes the bias in s², not in s. Reporting s as an unbiased estimate of σ is wrong at small n — at n = 5 with normal data the expected value of s is about 6% below σ — though the discrepancy is negligible by n = 30 and no exam item turns on it.',
    },
    {
      id: 'ev-setA',
      title: '16. Problem Set A: Expectation, Variance and Covariance',
      content: `## Problem Set A — six items, worked

**EA1.** A discrete variable takes 1, 2, 3 and 4 with probabilities 0.4, 0.3,
0.2 and 0.1. Find its mean, variance and standard deviation.

*Answer.* Two weighted sums:

$$E[X] = 0.4 + 0.6 + 0.6 + 0.4 = 2.0$$

$$E[X^{2}] = 0.4 + 1.2 + 1.8 + 1.6 = 5.0$$

$$\\mathrm{Var}(X) = 5.0 - 4.0 = 1.0$$

so σ = **1.0**.

*Trap.* Squaring the mean and calling it the second moment gives Var = 0, which
would say every order is exactly 2 — plainly false given four distinct values
with positive probability. A variance of zero from data that varies is always
this mistake.

**EA2.** With E[X] = 2 and Var(X) = 1, find the mean and standard deviation of
Y = 3X − 5.

*Answer.* Linearity for the mean, the square rule for the variance:

$$E[Y] = 3 \\times 2 - 5 = 1$$

$$\\mathrm{Var}(Y) = 9 \\times 1 = 9 \\quad \\Longrightarrow \\quad \\sigma_{Y} = 3$$

*Trap.* Two of them. Applying the −5 to the variance gives 9 − 5 = **4**, and
scaling the variance by 3 instead of 3² gives **3**. Adding a constant slides
the whole distribution and changes no spread; multiplying scales the standard
deviation once and the variance twice.

**EA3.** A continuous variable has density f(x) = 3x² on the interval from 0 to
1. Find its mean and standard deviation.

*Answer.* Integrate, having first confirmed the density is legitimate since the
integral of 3x² over the unit interval is 1:

$$E[X] = \\int_{0}^{1} 3x^{3}\\,dx = 0.75, \\qquad E[X^{2}] = \\int_{0}^{1} 3x^{4}\\,dx = 0.6$$

$$\\mathrm{Var}(X) = 0.6 - 0.5625 = 0.0375$$

so σ = **0.1936**.

*Trap.* Integrating f itself, getting 1, and reporting that as the mean. The
integral of a density is always 1 — that is what makes it a density — so an
answer of exactly 1 from an integration step is a signal that the x was left
out.

**EA4.** Var(X) = 16, Var(Y) = 25 and the correlation is 0.4. Find the standard
deviation of the sum and of the difference.

*Answer.* Convert the correlation into a covariance first:

$$\\mathrm{Cov}(X,Y) = 0.4 \\times 4 \\times 5 = 8$$

$$\\mathrm{Var}(X+Y) = 16 + 25 + 16 = 57 \\quad \\Longrightarrow \\quad \\sigma = 7.55$$

$$\\mathrm{Var}(X-Y) = 16 + 25 - 16 = 25 \\quad \\Longrightarrow \\quad \\sigma = 5.00$$

*Trap.* Adding the standard deviations to get 4 + 5 = **9**, which is bigger
than the correct 7.55 even at this positive correlation and would only be right
at a correlation of exactly 1. A second trap uses 0.4 directly as the
covariance, which ignores the units entirely and gives 6.47 for the sum.

**EA5.** Outages occur with a mean count of 1.5 per year and a Poisson
distribution, and each costs a fixed 4 hours of downtime. Find the mean and
standard deviation of annual downtime.

*Answer.* Downtime is T = 4N with N Poisson, so both rules for a linear
function apply, remembering that a Poisson's variance equals its mean:

$$E[T] = 4 \\times 1.5 = 6 \\ \\text{hours}$$

$$\\mathrm{Var}(T) = 16 \\times 1.5 = 24 \\quad \\Longrightarrow \\quad \\sigma = 4.90 \\ \\text{hours}$$

*Trap.* Scaling the variance by 4 rather than 16 gives 6 and a standard
deviation of 2.45. The multiplier enters the variance squared, always.

**EA6.** Seventy percent of jobs take a mean of 12 minutes with a standard
deviation of 3; the other 30% take a mean of 25 minutes with a standard
deviation of 8. Find the mean and standard deviation of a randomly chosen job.

*Answer.* Total expectation, then the variance decomposition:

$$0.7 \\times 12 + 0.3 \\times 25 = 15.9 \\ \\text{min}$$

$$E\\big[\\mathrm{Var}\\big] = 0.7 \\times 9 + 0.3 \\times 64 = 25.5$$

The group means deviate by −3.9 and 9.1 from 15.9, whose squares are 15.21 and
82.81:

$$\\mathrm{Var}\\big(E\\big) = 0.7 \\times 15.21 + 0.3 \\times 82.81 = 35.49$$

$$\\mathrm{Var} = 25.5 + 35.49 = 60.99 \\quad \\Longrightarrow \\quad \\sigma = 7.81 \\ \\text{min}$$

*Trap.* Averaging the two standard deviations gives 0.7(3) + 0.3(8) = **4.50**,
which is below the 8 of the slower group and therefore impossible for a mixture
containing it. Averaging the variances alone gives 25.5 and σ = 5.05, which
drops the between-group term — the larger of the two here.`,
      examTip: 'Every trap in this set is a rule applied one level too shallow: a constant let into a variance, a multiplier not squared, standard deviations added, or a between-group term dropped. Write the rule out symbolically before substituting and none of the four can happen.',
    },
    {
      id: 'ev-setB',
      title: '17. Problem Set B: Limits, Sampling and Estimation',
      content: `## Problem Set B — six items, worked

**EB1.** Parts have a mean hardness of 100 and a standard deviation of 5. No
distribution is stated. Bound the fraction lying outside 85 to 115.

*Answer.* The limits are k = 3 standard deviations out, so Chebyshev gives

$$P\\big(|X - 100| \\ge 15\\big) \\le 1 / 9 = 0.1111$$

At most **11.1%** lies outside, so at least 88.9% lies inside. The answer is an
inequality, and saying so is part of the answer.

*Trap.* Using the 68-95-99.7 rule to answer **0.0027**. That is the normal
value, and no normality was stated. The two differ by a factor of 41, and the
0.0027 choice is offered on every item of this type.

**EB2.** A population has σ = 12. A sample of 36 is taken. Find the probability
that the sample mean falls within 3 units of the population mean.

*Answer.* The standard error, not sigma, sets the scale:

$$\\mathrm{SE} = 12 / 6 = 2$$

so 3 units is 1.5 standard errors, and by the central limit theorem

$$0.9332 - 0.0668 = 0.8664$$

about **0.866**.

*Trap.* Standardising with σ = 12 gives z = 0.25 and an answer of **0.197**.
That number answers a different question — the chance that a single
observation lies within 3 units — and it is smaller by exactly the factor the
square root of 36 introduces into the z.

**EB3.** Twenty-five packages have individual masses with a mean of 4.2 kg and a
standard deviation of 0.8 kg, independently. Find the probability the total
exceeds 110 kg.

*Answer.* For a SUM, means multiply by n and variances multiply by n:

$$E\\left[\\sum\\right] = 25 \\times 4.2 = 105 \\ \\text{kg}, \\qquad \\sigma = 0.8 \\times 5 = 4 \\ \\text{kg}$$

$$z = (110 - 105) / 4 = 1.25$$

$$1 - 0.8944 = 0.1056$$

about **0.106**.

*Trap.* Scaling the standard deviation by 25 instead of by the square root of 25
gives σ = **20**, z = 0.25 and an answer of 0.401. Variances scale with n;
standard deviations scale with its square root.

**EB4.** A population has σ = 4. How large a sample is needed for the standard
error of the mean to be at most 0.5?

*Answer.* Set the standard error to the target and square:

$$n = (4 / 0.5)^{2} = 64$$

so **64 observations**.

*Trap.* Dividing rather than squaring gives **8**, which would leave a standard
error of 1.41 — nearly three times the requirement. Any sample-size answer that
is not the square of a ratio has skipped the squaring step.

**EB5.** A sample of 10 measurements has a sum of squared deviations from its
own mean of 180. Find the sample standard deviation.

*Answer.* Sample statistics spend one degree of freedom on the mean:

$$s^{2} = 180 / 9 = 20 \\quad \\Longrightarrow \\quad s = 4.47$$

*Trap.* Dividing by 10 gives 18 and **4.24**, the population formula applied to
a sample. Both numbers will be offered; the word "sample" in the stem is the
only thing distinguishing them, and at n = 10 they differ by 5%.

**EB6.** X takes −1, 0 and 1 with equal probability, and Y is the absolute
value of X. Compute the correlation and state whether X and Y are independent.

*Answer.* All three expectations are three-term sums:

$$E[X] = 0, \\qquad E[Y] = 2 / 3 = 0.6667, \\qquad E[XY] = 0$$

The last holds because the products are −1, 0 and +1, which cancel. Hence
Cov(X, Y) = 0 and the correlation is **exactly zero**. But

$$P(Y = 0) = 1/3, \\qquad P(Y = 0 \\mid X = 0) = 1$$

so the two are **dependent** — in fact Y is a function of X.

*Trap.* Concluding independence from r = 0. Correlation detects straight-line
association only, and Y here is a perfectly deterministic but symmetric
function of X, which is exactly the case correlation cannot see.`,
      examTip: 'Half of this set turns on one question: is the quantity an individual observation, a sum, or a mean? Individuals use σ, sums use σ times the square root of n, means use σ divided by it. Write which one the stem is asking about at the top of the working and the rest is substitution.',
    },
  ],
  keyTakeaways: [
    'Mean μ = ΣX/n; variance σ² = Σ(X-μ)²/n; standard deviation σ = sqrt(σ²).',
    'Sample variance uses n-1 (Bessel\'s correction); population variance uses N.',
    'Correlation r ∈ [-1,+1]; r = 0 means no linear relationship.',
    'Var(X+Y) = Var(X) + Var(Y) + 2·Cov(X,Y); simplifies if independent.',
    'Correlation does NOT imply causation.',
  ],
},

fee_regression: {
  topicId: 'fee_regression',
  title: 'Linear Regression',
  domainWeight: 'Probability & Statistics · 4–6%',
  overview: 'Linear regression fits a straight line to data, enabling prediction and trend analysis. The coefficient of determination R² measures goodness of fit. These tools support engineering data analysis and calibration.',
  sections: [
    {
      id: 'reg-line',
      title: '1. Least-Squares Regression Line',
      content: `## 1.1 The Regression Equation

The best-fit line through data: **$y = a + bx$**

Where:
- **Slope**: b = r · (sy/sx) = [nΣxy - ΣxΣy] / [nΣx² - (Σx)²]
- **Intercept**: a = ȳ - b·x̄

### Coefficient of Determination

**$R^{2} = r^{2}$** measures the fraction of variance in y explained by x:
- R² = 1: perfect fit (all points on line)
- R² = 0: no linear relationship
- R² = 0.85: 85% of y-variance explained by x

## 1.2 Interpretation

- The slope b represents the change in y per unit change in x
- The intercept a is the predicted y when x = 0
- **Extrapolation** (predicting outside data range) is unreliable
- **Interpolation** (predicting within data range) is more reliable`,
      examTip: 'On the FE exam, R² is the most common regression question. R² = r² tells you the proportion of variance explained. If r = 0.9, then R² = 0.81, meaning 81% of the variation in y is explained by x. The remaining 19% is due to other factors or random error.',
    },
    {
      id: 'reg-multiple',
      title: '2. Regression Applications and Residual Analysis',
      content: `## 2.1 Residual Analysis

A **residual** is the difference between observed and predicted: eᵢ = yᵢ - ŷᵢ

Good regression has:
- Residuals randomly scattered around zero
- No patterns in residual plot (no curves, no funnels)
- Residuals approximately normally distributed

### Common Regression Pitfalls

| Pitfall | Description | Symptom |
|---|---|---|
| Nonlinear data | Curved relationship forced into line | Curved residual pattern |
| Outliers | Extreme points distort fit | Large individual residuals |
| Extrapolation | Predicting outside data range | Unreliable predictions |
| Correlation ≠ Causation | Statistical association ≠ cause | Misleading conclusions |

## 2.2 Standard Error of Estimate

**$Se = \\sqrt{\\Sigma (y_{i} - \\hat{y} _{i})^{2} / (n-2)}$**

This measures the typical distance of data points from the regression line. Smaller Se means better fit. Dividing by n-2 accounts for the two estimated parameters (slope and intercept).`,
      examTip: 'If the FE exam shows a residual plot with a clear curve pattern, the linear model is inappropriate — the data has a nonlinear relationship. Transform the data (log, square root, etc.) or use a higher-order polynomial model.',
    },
    {
      id: 'reg-worked',
      title: '3. Fitting a Line by Hand, Start to Finish',
      content: `## 3.1 The dataset and the sums

A motor drive is load-tested at five currents and the enclosure temperature
rise is recorded. Fit ŷ = a + bx.

| i | x (A) | y (°C) | x·y | x² | y² |
|---|---|---|---|---|---|
| 1 | 1 | 2.0 | 2.0 | 1 | 4.00 |
| 2 | 2 | 3.6 | 7.2 | 4 | 12.96 |
| 3 | 3 | 5.5 | 16.5 | 9 | 30.25 |
| 4 | 4 | 6.9 | 27.6 | 16 | 47.61 |
| 5 | 5 | 9.0 | 45.0 | 25 | 81.00 |
| Σ | 15 | 27.0 | 98.3 | 55 | 175.82 |

Five sums are the whole input to the fit. Building this table first — rather
than jumping between formulas — is the discipline that keeps a five-minute
problem at five minutes.

## 3.2 Slope, intercept, and the fit

Relation: b = [nΣxy − ΣxΣy] / [nΣx² − (Σx)²], then a = ȳ − b·x̄.

Substitution:
- numerator: 5(98.3) − 15(27.0) = 491.5 − 405 = 86.5
- denominator: 5(55) − 15² = 275 − 225 = 50
- **b = 86.5 / 50 = 1.73 °C per ampere**
- **a = 27/5 − 1.73(15/5) = 5.4 − 5.19 = 0.21 °C**

So ŷ = 0.21 + 1.73x. The line must pass through (x̄, ȳ) = (3, 5.4); check:
0.21 + 1.73(3) = 5.40 ✓. That pass-through-the-means property is both a fact
worth knowing and a free arithmetic check on every regression you ever do.

![The five measured points with the least-squares line computed from the normal equations, slope 1.73 and intercept 0.21. The short vertical segments are the residuals whose squared sum the fit minimises.](/courses/fe-ee/figures/prob-regression-fit.svg)

## 3.3 Correlation and R²

Relation: r = [nΣxy − ΣxΣy] / √([nΣx² − (Σx)²][nΣy² − (Σy)²]).

The numerator, 86.5, is already computed. The second bracket:
5(175.82) − 27² = 879.1 − 729 = 150.1.

r = 86.5 / √(50 × 150.1) = 86.5 / 86.63 = **0.9985**, so **R² = 0.997**

99.7% of the variation in temperature rise is carried by the current; 0.3%
remains for measurement noise and everything else.

## 3.4 Residuals and the standard error

Predicted values from ŷ = 0.21 + 1.73x, then the residuals e = y − ŷ:

| x | y | ŷ | e |
|---|---|---|---|
| 1 | 2.0 | 1.94 | +0.06 |
| 2 | 3.6 | 3.67 | −0.07 |
| 3 | 5.5 | 5.40 | +0.10 |
| 4 | 6.9 | 7.13 | −0.23 |
| 5 | 9.0 | 8.86 | +0.14 |

SSE = Σe² = 0.0036 + 0.0049 + 0.0100 + 0.0529 + 0.0196 = 0.091

**Se = √(SSE / (n − 2)) = √(0.091 / 3) = 0.17 °C**

Cross-check by the second route: SSE = (1 − R²)·Syy where
Syy = Σy² − (Σy)²/n = 175.82 − 145.8 = 30.02, giving (0.00303)(30.02) = 0.091 ✓.
Two independent paths to the same SSE is the strongest verification available
inside one problem, and the residuals themselves alternate sign with no drift —
exactly the patternless scatter a healthy linear fit should leave behind.`,
      examTip: 'The regression line always passes through the point (x̄, ȳ). If a computed line misses the mean point, the intercept step went wrong — and if an exam item asks for a prediction AT the mean current, the answer is just ȳ with no fitting required.',
    },
    {
      id: 'reg-reading',
      title: '4. Reading the Fit: Slope Units, R², and Prediction',
      content: `## 4.1 Every fitted number has units and a sentence

| Quantity | Value here | Reads as |
|---|---|---|
| Slope b | 1.73 °C/A | each additional ampere adds 1.73 °C of rise |
| Intercept a | 0.21 °C | modelled rise at zero load — near zero, as physics suggests |
| r | 0.9985 | strong positive linear association |
| R² | 0.997 | current explains 99.7% of the variance in rise |
| Se | 0.17 °C | a typical prediction misses by about 0.17 °C |

The slope is the physically meaningful number: its units are always
y-units per x-unit, and misreading it as dimensionless is a reliable
distractor. The intercept deserves suspicion rather than reverence — here x = 0
sits just outside the data (tested range 1–5 A), so a = 0.21 °C is a modest
extrapolation that happens to be physically sensible. In many problems x = 0 is
far outside the data and the intercept is a pure artefact of the fit, not a
measurement of anything.

## 4.2 Prediction, inside and outside the data

Interpolating at 3.5 A: ŷ = 0.21 + 1.73(3.5) = **6.27 °C**, trustworthy to
roughly ±Se.

Extrapolating to 12 A: the formula happily returns 0.21 + 1.73(12) = 21.0 °C,
but nothing in the data says the relationship stays linear out there —
insulation begins to degrade, thermal limits bite, and the true curve bends.
The fitted line knows only the window it was fitted in. The exam tests this as
a concept question: the computed number is "correct" arithmetic and an
unreliable prediction, and the credited answer says so.

## 4.3 What R² does not say

R² measures the fraction of variance the line captures. It does not certify
that a line was the right shape — a parabola sampled over a narrow window can
show R² above 0.99 — and it says nothing about causation. Conversely a low R²
does not mean "no relationship"; it means no LINEAR one, or a real linear one
buried under noise. The residual plot, not R², is the shape check: curvature in
the residuals convicts the model even when R² looks excellent.

A related trap: R² never decreases when the data range widens, because spread
in x inflates the explained variance. Comparing R² between two experiments run
over different x-ranges is comparing apples to oranges — compare Se instead,
which stays in physical units.`,
      examTip: 'If r is given and R² is asked, square it and keep the story straight: r = 0.9 means 81% of variance explained, not 90%. The unsquared number is always among the answer choices.',
    },
    {
      id: 'reg-set',
      title: '5. Problem Set and Recurring Errors',
      content: `## 5.1 The fit from summary statistics

Given: r = 0.90, sy = 4.0, sx = 2.0, x̄ = 10, ȳ = 40. Find the regression line.

Relation: b = r·(sy/sx), then a = ȳ − b·x̄.

- b = 0.90 × (4.0/2.0) = **1.8**
- a = 40 − 1.8 × 10 = **22**

so ŷ = 22 + 1.8x, and R² = 0.81. No raw data needed — this form appears when
the exam gives you a statistical summary instead of a table, and the two
formulas above are the complete toolkit for it.

## 5.2 What the residual plot is saying

| Residual pattern | Diagnosis | Remedy |
|---|---|---|
| Patternless band around zero | model adequate | none — this is the goal |
| Smooth curve (∪ or ∩) | relationship is nonlinear | transform y or x, or fit a polynomial |
| Funnel widening with x | error size grows with x | weighted fit; report Se cautiously |
| One point far off the band | outlier or recording error | investigate before deleting anything |
| Runs of same-sign residuals in time order | drift during the experiment | randomise run order; check instrumentation |

A useful numerical companion: the residuals from any least-squares line sum to
exactly zero. If yours do not, the slope or intercept is wrong — the same kind
of built-in check as deviations about a mean.

## 5.3 Where marks are lost

| Error | What it looks like | The fix |
|---|---|---|
| Slope from inverted ratio | b = r·(sx/sy) | y-spread over x-spread; units of b must be y-units per x-unit |
| r reported as R² | claiming 90% variance explained from r = 0.9 | square it: 81% |
| Trusting the intercept physically | reading a as a measured zero-load value | it is the line's value at x = 0, meaningful only if x = 0 is near the data |
| Extrapolated prediction presented as reliable | quoting ŷ at double the tested range | flag it; the linearity is only demonstrated inside the window |
| Se divided by n or n − 1 | 0.135 or 0.151 instead of 0.174 in the worked fit | two fitted parameters cost two degrees of freedom: n − 2 |`,
      examTip: 'Regression items reward slope-first thinking: compute b, then get a for free from the means. Any distractor set will include the inverted-ratio slope and the unsquared r — knowing the two standard traps is worth as much as knowing the formulas.',
    },
    {
      id: 'reg-linearise',
      title: '6. Linearising Curves Before Fitting',
      content: `## 6.1 Straight lines in disguise

Least squares fits lines, but many physical laws are exponentials or power
laws. The move is to transform the model until it IS a line, fit in the
transformed variables, and transform the coefficients back:

| Physical model | Take | Fitted line | Slope means | Intercept means |
|---|---|---|---|---|
| y = C·e^(kx) | ln of both sides | ln y = ln C + kx | k | ln C |
| y = C·x^m | log of both sides | log y = log C + m·log x | the exponent m | log C |
| R = R₀·e^(B/T) (thermistor) | ln, with x = 1/T | ln R = ln R₀ + B·(1/T) | B in kelvin | ln R₀ |

A quick recognition rule from plotting: data straight on SEMILOG axes is
exponential; straight on LOG-LOG axes is a power law; straight on linear axes
is, at last, linear.

## 6.2 Worked: extracting a thermistor's B constant

Given: an NTC thermistor measures 10.0 kΩ at 25 °C and 3.59 kΩ at 50 °C. Find
B in R = R₀·e^(B/T), with T in kelvin.

Relation: ln R is linear in 1/T with slope B, so from two points

B = (ln R₁ − ln R₂) / (1/T₁ − 1/T₂)

Substitution: T₁ = 298.15 K, T₂ = 323.15 K.
ln(10000) − ln(3588) = ln(10000/3588) = ln 2.787 = 1.025.
1/298.15 − 1/323.15 = 3.354×10⁻³ − 3.095×10⁻³ = 2.595×10⁻⁴ K⁻¹.

B = 1.025 / 2.595×10⁻⁴ = **3950 K**

which is a standard catalogue value — the arithmetic closes the loop. With more
than two calibration points, the same B comes from the least-squares slope of
ln R against 1/T, and R² computed on the TRANSFORMED variables tells you how
exponential the device really is.

One caution carries over from ordinary regression: least squares on ln y
minimises relative errors, not absolute ones, weighting small-y points more
heavily than a direct fit would. For exam purposes the transformation is the
credited technique; the weighting subtlety is why lab-grade fits sometimes do
it differently.

The transform-back step is where slips happen: the fitted intercept is ln C or
log C, not C itself, so exponentiate before reporting. A fitted intercept of
2.3 on semilog axes means C = e^2.3 ≈ 10, and quoting 2.3 as the prefactor is
the standard lost mark on this item.`,
      examTip: 'Choose the transform from the model, not from habit: exponentials go straight on semilog paper, power laws on log-log. An exam item showing curved data on linear axes and straight data on log-log axes has told you the exponent model without saying so.',
    },
  ],
  keyTakeaways: [
    'Regression line y = a + bx; slope b = r·(sy/sx); intercept a = ȳ - b·x̄.',
    'R² = r² shows fraction of y-variance explained by x; closer to 1 is better.',
    'Residuals should be random; patterns indicate model inadequacy.',
    'Extrapolation is unreliable; interpolation is more trustworthy.',
    'Standard error Se measures typical residual size; smaller is better.',
  ],
},

fee_hypothesis: {
  topicId: 'fee_hypothesis',
  title: 'Hypothesis Testing & Confidence Intervals',
  domainWeight: 'Probability & Statistics · 4–6%',
  overview: 'Hypothesis testing determines whether data supports a claim. Confidence intervals quantify estimation uncertainty. Both are essential for quality control, reliability testing, and engineering decision-making on the FE exam.',
  sections: [
    {
      id: 'ht-process',
      title: '1. Hypothesis Testing Framework',
      content: `## 1.1 The Testing Process

1. **State hypotheses**: $H_{0}$ (null — no effect) and $H_{1}$ (alternative — effect exists)
2. **Choose significance level** α (typically 0.05 = 5% risk of false positive)
3. **Calculate test statistic** from data
4. **Find p-value** or compare to critical value
5. **Decide**: reject $H_{0}$ if p < α; fail to reject $H_{0}$ if p ≥ α

## 1.2 Types of Errors

| | H₀ True | H₀ False |
|---|---|---|
| **Reject H₀** | Type I error (α) | Correct! (Power = 1-β) |
| **Fail to reject H₀** | Correct! | Type II error (β) |

- **Type I error** (false positive): rejecting a true $H_{0}$; probability = α
- **Type II error** (false negative): failing to reject a false $H_{0}$; probability = β
- **Power** = 1 - β: probability of correctly detecting a real effect

## 1.3 Common Tests

### t-Test (comparing means)

**$t = (x - \\mu _{0}) / (s/\\sqrt{n})$**

- Degrees of freedom: df = n - 1
- Compare t to critical value from t-table at significance α

### Chi-Square Test (categorical data)

**$\\chi ^{2} = \\Sigma (O - E)^{2}/E$**

- O = observed frequency, E = expected frequency
- Compare χ² to critical value from chi-square table`,
      examTip: 'The most common FE exam mistake in hypothesis testing: "fail to reject H₀" does NOT mean "accept H₀." We never prove the null hypothesis — we only fail to find evidence against it. Also, a smaller p-value means stronger evidence against H₀.',
      importantNote: 'Reducing Type I error (lowering α) increases Type II error (β) and vice versa. The only way to reduce both simultaneously is to increase sample size n. This tradeoff is fundamental to statistical testing.',
    },
    {
      id: 'ht-confidence',
      title: '2. Confidence Intervals',
      content: `## 2.1 Constructing Confidence Intervals

A **confidence interval** estimates a population parameter:

**$CI = x \\pm t(\\alpha /2, n-1) \\cdot s/\\sqrt{n}$**

Where:
- x̄ is the sample mean
- s is the sample standard deviation
- n is the sample size
- t(α/2, n-1) is the t-critical value for confidence level (1-α)

### Common Confidence Levels

| Confidence Level | α | t-multiplier (large n) |
|---|---|---|
| 90% | 0.10 | 1.645 |
| 95% | 0.05 | 1.960 |
| 99% | 0.01 | 2.576 |

## 2.2 Interpretation

A **95% confidence interval** means: if we repeated the sampling process many times, 95% of the resulting intervals would contain the true population parameter.

It does **NOT** mean: "there is a 95% probability the true value is in this interval."

### Standard Error

**$SE = s/\\sqrt{n}$**

The standard error decreases with larger n — more data gives more precise estimates. To halve the standard error, quadruple the sample size.`,
      examTip: 'Confidence interval width depends on three things: confidence level (higher = wider), standard deviation (more spread = wider), and sample size (larger n = narrower). The formula SE = s/sqrt(n) shows why: doubling precision requires 4x the sample size.',
    },
    {
      id: 'ht-worked',
      title: '3. A Complete Test, Start to Finish',
      content: `## 3.1 The setup

A vendor claims their resistors are centred on 100 Ω. A sample of n = 16 gives
x̄ = 101.2 Ω with s = 2.8 Ω. Test the claim at α = 0.05.

**Step 1 — hypotheses.** The claim under test is the null:
H₀: μ = 100 against H₁: μ ≠ 100. Two-sided, because drift in either direction
would matter.

**Step 2 — standard error.** SE = s/√n = 2.8/√16 = 2.8/4 = 0.7 Ω.

**Step 3 — test statistic.**

t = (x̄ − μ₀)/SE = (101.2 − 100)/0.7 = **1.71**, with df = 15

**Step 4 — critical value.** From the t-table at α = 0.05 two-sided with 15
degrees of freedom: 2.131.

**Step 5 — decision.** |1.71| < 2.131, so **fail to reject H₀**. The 1.2 Ω
offset is within what sampling noise at n = 16 routinely produces.

## 3.2 The same data, one-sided

Suppose instead the only concern is resistance running HIGH:
H₁: μ > 100. The one-sided critical value at α = 0.05, df = 15, is 1.753. Now
t = 1.71 sits just below it — still fail to reject, but barely. The framing of
the alternative changed the hurdle from 2.131 to 1.753 without touching the
data. Exam items exploit exactly this: read whether the question says
"differs from" (two tails) or "exceeds" (one tail) before picking the critical
value.

## 3.3 Seeing α and β on one axis

![Two sampling distributions of the mean with standard error 0.7: one centred on the null value 100, one on a true mean of 102. The dashed critical value at 101.15 splits the axis; the tail of the null curve beyond it is alpha equal to 0.05, and the area of the true curve short of it is beta, computed as 0.11.](/courses/fe-ee/figures/prob-alpha-beta.svg)

The figure fixes σ = 2.8 as known and tests one-sided at α = 0.05, so the
cutoff is 100 + 1.645(0.7) = 101.15 Ω. If the process has actually drifted to
102 Ω, the probability a sample mean still lands below the cutoff — a miss — is

β = P(x̄ < 101.15 given μ = 102) = Φ((101.15 − 102)/0.7) = Φ(−1.21) = **0.11**

so the **power** is 1 − β = 0.89: this test catches a 2 Ω drift about nine
times in ten. Three levers raise power, and only three: a bigger true shift, a
larger α (moving the cutoff left, at the price of more false alarms), or a
larger n (shrinking SE so both curves thin out and separate). The α–β trade at
fixed n is a see-saw; sample size is the only lever that lowers both ends at
once.`,
      examTip: 'Match the tail count to the words: "differs / changed / not equal" is two-sided, "exceeds / at least / dropped below" is one-sided. Both critical values appear among the choices, and the question stem is the only place the right one is announced.',
    },
    {
      id: 'ht-ci-practice',
      title: '4. Confidence Intervals in Practice',
      content: `## 4.1 The interval from the same sample

With x̄ = 101.2, s = 2.8, n = 16, t(0.025, 15) = 2.131:

CI = x̄ ± t·s/√n = 101.2 ± 2.131 × 0.7 = 101.2 ± 1.49

**95% CI: (99.71, 102.69) Ω**

The interval CONTAINS the claimed 100 Ω — and that is not a coincidence. A
two-sided test at α and a (1 − α) confidence interval are the same computation
read in opposite directions: the test fails to reject exactly when the null
value falls inside the interval. Computing one answers both, which on a timed
exam is occasionally the whole trick — an item that hands you an interval and
asks for a test decision requires no new arithmetic at all.

## 4.2 Planning a sample size

Given: the same process (take σ ≈ 2.8 Ω) must be estimated to within ±0.5 Ω
with 95% confidence. How many units?

Relation: n = (z·σ/E)², with E the target margin and z = 1.96.

Substitution: n = (1.96 × 2.8 / 0.5)² = (10.98)² = 120.5 → **round UP to 121**.

Rounding down would deliver less than the promised margin, so sample sizes
always round up. Note what the squares do: halving the margin quadruples the
sample; tightening from 95% to 99% (z = 2.58) multiplies n by (2.58/1.96)² ≈
1.73. Precision is bought at a quadratic price.

## 4.3 What moves the width

| Change | Effect on CI width | Why |
|---|---|---|
| Raise confidence 95% → 99% | wider | a bigger multiplier must cover more of the curve |
| Quadruple n | halved | width scales as 1/√n |
| Noisier process (larger s) | wider in proportion | SE = s/√n |
| Use z where t belonged (small n) | too narrow | t-tails are fatter to pay for estimating s |

The last row is the quiet one: with n = 16, using 1.96 instead of 2.131
produces an interval about 8% too narrow — an overstatement of certainty rather
than an arithmetic error, which is why it survives checking.

## 4.4 Saying it correctly

"We are 95% confident the true mean lies in (99.71, 102.69)" is shorthand for:
the PROCEDURE captures the true mean in 95% of samples. The true mean is a
fixed number, not a random one; it is the interval that varies from sample to
sample. The exam's wrong-interpretation distractor gives the true mean a 95%
probability of being inside this one realised interval — recognisable once
you know to look for it.`,
      examTip: 'Sample-size answers round up, always — 120.5 becomes 121. The rounded-down value sits among the choices for anyone who reaches for the nearest integer.',
    },
    {
      id: 'ht-set',
      title: '5. Problem Set and Recurring Errors',
      content: `## 5.1 A chi-square goodness-of-fit test

Given: 100 equipment failures logged across three shifts: 45 on days, 30 on
evenings, 25 on nights. Are failures uniform across shifts, at α = 0.05?

Relation: χ² = Σ(O − E)²/E, expected E = 100/3 = 33.33 per shift.

- (45 − 33.33)²/33.33 = 4.08
- (30 − 33.33)²/33.33 = 0.33
- (25 − 33.33)²/33.33 = 2.08

χ² = **6.50**, with df = 3 − 1 = 2. The critical value χ²(0.05, 2) = 5.99, and
6.50 > 5.99: **reject uniformity** — the day shift's excess is more than
chance. Degrees of freedom for goodness-of-fit are categories minus one, not
observations minus one; 99 would be spectacularly wrong here.

## 5.2 Reading a p-value

A colleague's report states t = 2.9, p = 0.008 for a test at α = 0.05. The
p-value is the probability, computed assuming H₀ is true, of data at least this
extreme. Since 0.008 < 0.05, reject H₀. What p = 0.008 does NOT mean: an 0.8%
chance H₀ is true, or a 99.2% chance the effect is real — both are statements
about hypotheses, which p-values never make. Smaller p means stronger evidence
against the null; it says nothing about the SIZE of the effect, which is what
the confidence interval is for.

## 5.3 Which test does the question want?

| Situation in the stem | Test | Statistic |
|---|---|---|
| Sample mean vs a claimed value, σ unknown | one-sample t | (x̄ − μ₀)/(s/√n) |
| Sample mean vs a claim, σ known or n large | z | (x̄ − μ₀)/(σ/√n) |
| Counts across categories vs expected counts | chi-square | Σ(O − E)²/E |
| Two sample means compared | two-sample t | difference over pooled SE |

## 5.4 Where marks are lost

| Error | What it looks like | The fix |
|---|---|---|
| "Accepting" H₀ | concluding the mean IS 100 | failing to reject is absence of evidence, not proof |
| Tails mismatched to the stem | 2.131 used for a strictly-greater claim | one-sided words take one-sided critical values |
| √n forgotten in SE | t = 1.2/2.8 = 0.43 | the standard error of a MEAN is s/√n |
| df off by one | t-table entered at n instead of n − 1 | one degree of freedom is spent estimating the mean |
| α confused with p | rejecting because α = 0.05 is "small" | α is chosen; p is computed; reject when p < α |`,
      examTip: 'The standard error s/√n is the most-forgotten factor in this topic. With n = 16 the √n is worth a factor of 4 in the test statistic — enough to turn every conclusion around — and the un-divided version is always waiting among the distractors.',
    },
    {
      id: 'ht-two-sample',
      title: '6. Two Samples and Paired Data',
      content: `## 6.1 Comparing two independent samples

Given: two crews terminate cable splices. Crew A, n = 10 splices, mean
resistance 5.2 mΩ, s = 0.4; crew B, n = 10, mean 5.6 mΩ, s = 0.5. Is the
difference real at α = 0.05?

Relation: t = (x̄_B − x̄_A) / √(s_A²/n_A + s_B²/n_B).

Substitution: SE = √(0.16/10 + 0.25/10) = √0.041 = 0.202.

t = 0.4 / 0.202 = **1.98**, against a two-sided critical value of about 2.10
at df = 18. **Fail to reject**: a 0.4 mΩ gap between ten-splice averages with
this much scatter arises by chance often enough. Note the structure — the
standard error of a DIFFERENCE adds the two variances-over-n before one square
root, the same variances-add rule that governs sums of random variables.

## 6.2 Pairing removes the nuisance variation

Given: 8 joints measured before and after a torque procedure, and the
before-minus-after differences have mean 0.31 mΩ, s = 0.26 mΩ. Test whether the
procedure changed resistance.

Because both readings come from the SAME joint, joint-to-joint variation
cancels in each difference. Test the differences against zero:

t = 0.31 / (0.26/√8) = 0.31 / 0.092 = **3.37**, df = 7, critical 2.365

**Reject**: the change is real. Had the same sixteen numbers been treated as
two independent groups, the joint-to-joint scatter would have buried the
effect — pairing is a design decision that buys power without buying samples.

| Design | Use when | Statistic tested | df |
|---|---|---|---|
| One sample vs claim | a stated standard exists | x̄ − μ₀ | n − 1 |
| Two independent samples | different units in each group | x̄₁ − x̄₂ | conservative: smaller n − 1 |
| Paired | same units measured twice | mean of differences vs 0 | pairs − 1 |

The give-away words in an exam stem: "the same specimens were retested" means
paired; "two separate batches" means independent. The paired computation is
just a one-sample test on the differences, so no new formulas are involved —
only the recognition.`,
      examTip: 'If the same units are measured twice, difference first and run a one-sample test on the differences — df is pairs minus one. Treating paired data as two independent samples is the tested error, and it always UNDERSTATES the evidence.',
    },
  ],
  keyTakeaways: [
    'H₀ is null hypothesis; reject H₀ if p-value < α (significance level).',
    'Type I error (α): reject true H₀; Type II error (β): fail to reject false H₀.',
    't-test: t = (x̄ - μ₀)/(s/sqrt(n)); chi-square: χ² = Σ(O-E)²/E.',
    'Confidence interval: x̄ ± t·s/sqrt(n); wider interval = more confidence but less precision.',
    'SE = s/sqrt(n); quadruple sample size to halve standard error.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 2 — ETHICS AND PROFESSIONAL PRACTICE  (3 curriculum IDs)  ·  3–5 %
 * ══════════════════════════════════════════════════════════════════ */

};
