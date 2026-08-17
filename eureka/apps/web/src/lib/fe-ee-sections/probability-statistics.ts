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

For a discrete random variable: **$E[X] = \\sum x_{i}\\cdot P(x_{i})$**

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
| Mean | $\\mu = \\sum X/N$ | $\\bar{x} = \\sum X/n$ |
| Variance | $\\sigma ^{2} = \\sum (X-\\mu)^{2}/N$ | $s^{2} = \\sum (X-\\bar{x})^{2}/(n-1)$ |
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

$$E\\left[\\sum _{i=1}^{25} X_{i}\\right] = 25 \\times 4.2 = 105 \\ \\text{kg}, \\qquad \\sigma = 0.8 \\times 5 = 4 \\ \\text{kg}$$

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

**$Se = \\sqrt{\\sum (y_{i} - \\hat{y} _{i})^{2} / (n-2)}$**

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

Interpolating at 3.5 A: ŷ = 0.21 + 1.73(3.5) = **6.27 °C**. A single future
reading at 3.5 A scatters by rather more than ±Se, because the uncertainty in
the fitted line adds to the process noise; Section 9 turns that statement into a
proper prediction interval, which is always wider than ±Se and never narrower.

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

A related trap: R² usually RISES when the range of x is widened, because
spreading the predictor inflates the explained variance while the noise level
stays put. It is a tendency, not a theorem — adding points that lie off the line
can lower R² even as the range grows — but it is strong enough that comparing R²
between two experiments run over different x-ranges is comparing apples to
oranges. Compare Se instead, which stays in physical units and does not respond
to the spread of x at all.`,
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

A useful numerical companion: the residuals from any least-squares line THAT
INCLUDES AN INTERCEPT sum to exactly zero, because that is precisely the first
normal equation derived in Section 7.2. If yours do not, the slope or intercept
is wrong — the same kind of built-in check as deviations about a mean. The
guarantee lapses for a fit forced through the origin, which drops that equation
along with the intercept.

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
ln(10000) − ln(3590) = ln(10000/3590) = ln 2.7855 = 1.0245.
1/298.15 − 1/323.15 = 3.354×10⁻³ − 3.095×10⁻³ = 2.595×10⁻⁴ K⁻¹.

B = 1.0245 / 2.595×10⁻⁴ = **3948 K**

against a catalogue figure of 3950 K for this part — the arithmetic closes the
loop to within the rounding of the two printed resistances. With more
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
    {
      id: 'reg-derivation',
      title: '7. Least Squares Derived from the Objective Function',
      content: `## 7.1 What "best fit" is being asked to mean

A straight line carries two unknowns, an intercept and a slope, and ten data
points almost never sit on any single line. Fitting therefore means choosing the
two numbers that leave the smallest total disagreement — and until "smallest
disagreement" is defined arithmetically, nothing has been decided at all.

Write the vertical gap between the measurement and the line as the residual

$$e_{i} = y_{i} - (a + bx_{i})$$

and add up the squares of those gaps across the whole record:

$$S(a,b) = \\sum_{i=1}^{n}\\left[y_{i} - (a + bx_{i})\\right]^{2}$$

Squaring is not the only possible choice, and it is worth knowing why it wins.
Adding the raw residuals is useless, because positive and negative misses cancel
and every line through the mean point scores zero. Adding absolute values is a
legitimate criterion — least absolute deviations, which resists outliers far
better — but the absolute value has a corner at zero, so the minimum cannot be
found by differentiation and there is no closed formula. Squares are smooth
everywhere, produce one linear equation per unknown, and give a unique answer
that a calculator can reach in five sums. The price is sensitivity: a residual
twice as large contributes four times as much, so a single wild point steers the
fit, which is exactly the vulnerability Section 10 makes quantitative.

## 7.2 Setting the two partial derivatives to zero

At the minimum of a smooth surface both partial derivatives vanish. Differentiate
the objective with respect to the intercept, holding the slope fixed:

$$\\frac{\\partial S}{\\partial a} = -2\\sum_{i=1}^{n}\\left[y_{i} - a - bx_{i}\\right] = 0$$

and then with respect to the slope, where the chain rule contributes an extra
factor of the abscissa:

$$\\frac{\\partial S}{\\partial b} = -2\\sum_{i=1}^{n}x_{i}\\left[y_{i} - a - bx_{i}\\right] = 0$$

Divide both by minus two and rearrange, and out fall the two NORMAL EQUATIONS:

$$\\sum_{i=1}^{n}y_{i} = na + b\\sum_{i=1}^{n}x_{i}$$

$$\\sum_{i=1}^{n}x_{i}y_{i} = a\\sum_{i=1}^{n}x_{i} + b\\sum_{i=1}^{n}x_{i}^{2}$$

Everything that follows in this chapter is a consequence of those two lines.
They are linear in the unknowns even though the objective was quadratic, which
is the whole reason linear regression has a formula at all and non-linear
fitting has an iteration instead.

## 7.3 Solving the normal equations

Divide the first equation by the sample size. The sums become means:

$$\\bar{y} = a + b\\bar{x} \\qquad\\Longrightarrow\\qquad a = \\bar{y} - b\\bar{x}$$

which is the pass-through-the-means property, now derived rather than asserted:
it is the first normal equation, and nothing else. Substitute that intercept into
the second normal equation and collect the slope:

$$\\sum x_{i}y_{i} = \\left(\\bar{y} - b\\bar{x}\\right)\\sum x_{i} + b\\sum x_{i}^{2}$$

$$\\sum x_{i}y_{i} - \\frac{\\left(\\sum x_{i}\\right)\\left(\\sum y_{i}\\right)}{n} = b\\left[\\sum x_{i}^{2} - \\frac{\\left(\\sum x_{i}\\right)^{2}}{n}\\right]$$

Both bracketed quantities are corrected sums of squares and cross products, and
naming them shortens every formula in the rest of the chapter:

$$S_{xx} = \\sum(x_{i}-\\bar{x})^{2} = \\sum x_{i}^{2} - \\frac{\\left(\\sum x_{i}\\right)^{2}}{n}$$

$$S_{xy} = \\sum(x_{i}-\\bar{x})(y_{i}-\\bar{y}) = \\sum x_{i}y_{i} - \\frac{\\left(\\sum x_{i}\\right)\\left(\\sum y_{i}\\right)}{n}$$

$$S_{yy} = \\sum(y_{i}-\\bar{y})^{2} = \\sum y_{i}^{2} - \\frac{\\left(\\sum y_{i}\\right)^{2}}{n}$$

so that the slope is a single ratio:

$$b = \\frac{S_{xy}}{S_{xx}}$$

The familiar correlation form is one algebraic step further. Multiply and divide
by the square root of the product of the corrected sums:

$$b = \\frac{S_{xy}}{\\sqrt{S_{xx}S_{yy}}}\\cdot\\frac{\\sqrt{S_{yy}}}{\\sqrt{S_{xx}}} = r\\,\\frac{s_{y}}{s_{x}}$$

because the sample standard deviations both carry the same factor of n minus
one, which cancels in the ratio. That is why the two slope formulas in Section 1
are not two facts to memorise but one fact written twice.

## 7.4 It really is a minimum

Vanishing derivatives locate a stationary point, not necessarily a lowest one.
The second derivatives of the objective are

$$\\frac{\\partial^{2}S}{\\partial a^{2}} = 2n, \\qquad \\frac{\\partial^{2}S}{\\partial b^{2}} = 2\\sum x_{i}^{2}, \\qquad \\frac{\\partial^{2}S}{\\partial a\\,\\partial b} = 2\\sum x_{i}$$

and the determinant of that two-by-two matrix of second derivatives is

$$4\\left[n\\sum x_{i}^{2} - \\left(\\sum x_{i}\\right)^{2}\\right] = 4nS_{xx}$$

which is strictly positive whenever the abscissas are not all identical. With a
positive leading second derivative and a positive determinant the stationary
point is a minimum, and because the objective is quadratic it is the ONLY one —
there are no local traps to fall into. If every x is the same the determinant is
zero, the slope is not identified, and no amount of data repairs it: a fit needs
spread in the predictor.

Holding the intercept at its best value for each candidate slope profiles the
surface into an exact parabola,

$$S\\left(\\bar{y}-b\\bar{x},\\,b\\right) = \\mathrm{SSE} + S_{xx}\\left(b-\\hat{b}\\right)^{2}$$

whose curvature is the corrected sum of squares of the predictor. Wide spread in
x means a steep bowl, which means a slope that is hard to move — and Section 9
turns exactly that curvature into the standard error of the slope.

![The sum of squared residuals for the calibration data, drawn twice: contours over the intercept-slope plane showing a single elliptical basin centred on a equals 4.5 and b equals 0.5, and the parabolic cross-section obtained by holding the intercept at its best value, which bottoms out at SSE equals 1.82.](/courses/fe-ee/figures/prob3-ls-objective.svg)

## 7.5 The geometry: projection and two orthogonality conditions

Read the two normal equations again as statements about the residuals rather
than about the coefficients. The first says the residuals sum to zero; the
second says they have zero cross product with the predictor:

$$\\sum_{i=1}^{n}e_{i} = 0 \\qquad\\text{and}\\qquad \\sum_{i=1}^{n}x_{i}e_{i} = 0$$

In vector language the fitted values live in the plane spanned by the all-ones
vector and the predictor vector, and the residual vector is perpendicular to
both spanning directions — so the fit is the orthogonal projection of the data
onto that plane, and least squares is the Pythagorean statement that the
shortest route from a point to a plane is the perpendicular one. The right angle
delivers a Pythagorean identity for free:

$$\\sum(y_{i}-\\bar{y})^{2} = \\sum(\\hat{y}_{i}-\\bar{y})^{2} + \\sum(y_{i}-\\hat{y}_{i})^{2}$$

usually written as a decomposition of total variation into explained and
unexplained parts:

$$\\mathrm{SST} = \\mathrm{SSR} + \\mathrm{SSE}$$

One caution that the derivation makes visible and the formula hides: the
residuals sum to zero BECAUSE the all-ones column is in the model. Force the
line through the origin and the first normal equation disappears with the
intercept; the residuals of a no-intercept fit generally do not sum to zero, and
the variance decomposition above no longer holds in the same form.

## 7.6 Worked: the normal equations solved three ways

Given the calibration record of Section 8, whose five sums are n = 10,
sum x = 550, sum y = 320, sum xy = 21725 and sum x squared = 38500, find the
fitted line by solving the normal equations directly, and confirm it by two
routes that never form the ratio Sxy over Sxx.

**Route 1 — elimination.** The normal equations are

$$10a + 550b = 320 \\qquad\\text{and}\\qquad 550a + 38500b = 21725$$

Multiply the first by 55 to match the intercept coefficients, giving
550a + 30250b = 17600, and subtract it from the second:

$$(38500 - 30250)\\,b = 21725 - 17600 \\quad\\Longrightarrow\\quad 8250b = 4125$$

so **b = 0.500 mV/kPa**, and back-substitution in the first equation gives
10a = 320 − 275, so **a = 4.50 mV**.

**Route 2 — Cramer's rule.** The coefficient determinant is
10(38500) − 550² = 385000 − 302500 = 82500, and the two numerator determinants
are 10(21725) − 550(320) = 217250 − 176000 = 41250 for the slope and
320(38500) − 550(21725) = 12320000 − 11948750 = 371250 for the intercept:

$$b = \\frac{41250}{82500} = 0.5 \\qquad\\text{and}\\qquad a = \\frac{371250}{82500} = 4.5$$

**Route 3 — the orthogonality test.** A candidate line is correct only if its
residuals satisfy both conditions of Section 7.5. With a = 4.5 and b = 0.5 the
residuals are −0.2, −0.4, +0.6, −0.4, +0.3, +0.6, +0.3, −0.6, −0.4, +0.2, which
sum to exactly zero; and their cross product with x is
10(−0.2) + 20(−0.4) + 30(0.6) + 40(−0.4) + 50(0.3) + 60(0.6) + 70(0.3) +
80(−0.6) + 90(−0.4) + 100(0.2) = −2 − 8 + 18 − 16 + 15 + 36 + 21 − 48 − 36 + 20,
which is also exactly zero. Two conditions, two unknowns, both satisfied: this
is the fit and no other line can match it.

Three routes agreeing is worth more than one route repeated. Elimination and
Cramer's rule use different arithmetic on the same system, and the orthogonality
test does not use the system at all — it checks the property the solution must
have. A slip in any single route shows up immediately as a disagreement.`,
      examTip: 'Every regression formula on the reference sheet is a rearrangement of two normal equations. If you can write the objective and differentiate it, you can rebuild the slope and intercept from memory in about ninety seconds — and the pass-through-the-means relation a = ȳ − b·x̄ IS the first normal equation, which is why it is always exactly true and always worth checking.',
      importantNote: 'The residuals of a least-squares fit sum to zero only when the model contains an intercept. A regression forced through the origin drops the first normal equation, and its residuals generally do not sum to zero — so the usual SST = SSR + SSE bookkeeping, and the usual reading of R², do not carry over unchanged.',
    },
    {
      id: 'reg-calibration',
      title: '8. A Ten-Point Calibration, Worked End to End',
      content: `## 8.1 The record

A pressure transducer is calibrated on a deadweight tester at ten applied
pressures, and the conditioned output is recorded in millivolts. The complete
record, with the three product columns the normal equations need, is:

| i | x (kPa) | y (mV) | x·y | x² | y² |
|---|---|---|---|---|---|
| 1 | 10 | 9.3 | 93 | 100 | 86.49 |
| 2 | 20 | 14.1 | 282 | 400 | 198.81 |
| 3 | 30 | 20.1 | 603 | 900 | 404.01 |
| 4 | 40 | 24.1 | 964 | 1600 | 580.81 |
| 5 | 50 | 29.8 | 1490 | 2500 | 888.04 |
| 6 | 60 | 35.1 | 2106 | 3600 | 1232.01 |
| 7 | 70 | 39.8 | 2786 | 4900 | 1584.04 |
| 8 | 80 | 43.9 | 3512 | 6400 | 1927.21 |
| 9 | 90 | 49.1 | 4419 | 8100 | 2410.81 |
| 10 | 100 | 54.7 | 5470 | 10000 | 2992.09 |
| sum | 550 | 320.0 | 21725 | 38500 | 12304.32 |

Ten rows, five totals, and the fit is already determined. Note that nothing in
this table required a calculator with statistics keys: it is four multiplications
and five column sums, and building it first is the discipline that keeps the
arithmetic honest.

## 8.2 Worked: the corrected sums, the slope and the intercept

Given the totals above, find the least-squares line.

The means are $\\bar{x} = 550/10 = 55$ kPa and $\\bar{y} = 320/10 = 32$ mV. The
corrected sums follow from the computational forms of Section 7.3:

$$S_{xx} = 38500 - \\frac{550^{2}}{10} = 38500 - 30250 = 8250$$

$$S_{xy} = 21725 - \\frac{(550)(320)}{10} = 21725 - 17600 = 4125$$

$$S_{yy} = 12304.32 - \\frac{320^{2}}{10} = 12304.32 - 10240 = 2064.32$$

so the slope and intercept are

$$b = \\frac{S_{xy}}{S_{xx}} = \\frac{4125}{8250} = 0.500\\ \\mathrm{mV/kPa}$$

$$a = \\bar{y} - b\\bar{x} = 32 - 0.5(55) = 32 - 27.5 = 4.50\\ \\mathrm{mV}$$

The fitted calibration is therefore ŷ = 4.50 + 0.500x, with a sensitivity of
0.500 millivolts per kilopascal and a zero-pressure offset of 4.50 millivolts.
Both numbers have units, and both are quotable to a technician: the offset is
the reading the conditioner puts out with the port vented, and the slope is the
number that converts a future reading back into a pressure.

The fitted values and residuals, computed from that line, are:

| x (kPa) | y measured (mV) | ŷ fitted (mV) | e = y − ŷ (mV) | leverage h |
|---|---|---|---|---|
| 10 | 9.3 | 9.5 | −0.2 | 0.3455 |
| 20 | 14.1 | 14.5 | −0.4 | 0.2485 |
| 30 | 20.1 | 19.5 | +0.6 | 0.1758 |
| 40 | 24.1 | 24.5 | −0.4 | 0.1273 |
| 50 | 29.8 | 29.5 | +0.3 | 0.1030 |
| 60 | 35.1 | 34.5 | +0.6 | 0.1030 |
| 70 | 39.8 | 39.5 | +0.3 | 0.1273 |
| 80 | 43.9 | 44.5 | −0.6 | 0.1758 |
| 90 | 49.1 | 49.5 | −0.4 | 0.2485 |
| 100 | 54.7 | 54.5 | +0.2 | 0.3455 |

The residual column sums to zero and its cross product with x is zero, as
Section 7.6 verified digit by digit. The leverage column is derived in Section
10.2; it is placed here so the whole fit lives in one table.

## 8.3 Worked: the variance decomposition and R-squared

Given the residuals above, split the total variation and report the coefficient
of determination.

The error sum of squares is the sum of squared residuals:

$$\\mathrm{SSE} = \\sum e_{i}^{2} = 2(0.04) + 3(0.16) + 2(0.09) + 3(0.36) = 1.82$$

and the regression sum of squares follows from the corrected sums without
recomputing any fitted value:

$$\\mathrm{SSR} = \\frac{S_{xy}^{2}}{S_{xx}} = \\frac{4125^{2}}{8250} = \\frac{17015625}{8250} = 2062.5$$

Their total is 2062.5 + 1.82 = 2064.32, which reproduces Syy exactly — the
Pythagorean identity of Section 7.5, confirmed on real numbers. Then

$$R^{2} = \\frac{\\mathrm{SSR}}{\\mathrm{SST}} = \\frac{2062.5}{2064.32} = 0.99912$$

$$r = \\frac{S_{xy}}{\\sqrt{S_{xx}S_{yy}}} = \\frac{4125}{\\sqrt{8250 \\times 2064.32}} = \\frac{4125}{4126.82} = 0.99956$$

and squaring that correlation returns 0.99912, the same number.

A caution about what has just been demonstrated. Computing R² as SSR/SST, as
1 − SSE/SST, and as r squared are not three checks; they are one identity
written three ways, and they would all agree even if the arithmetic behind Sxy
were wrong. The genuinely independent confirmations of this fit are the ones in
Section 7.6 — elimination, Cramer's rule, and the orthogonality test — plus the
fact that SSR and SSE, computed by completely separate routes, add to the Syy
that came off the y² column. A formula checked against itself proves nothing.

## 8.4 Reading the fit

An R² of 0.99912 says the applied pressure accounts for 99.912 per cent of the
variation in output over this range. That is an unremarkable figure for a
calibration and a spectacular one for a field study, which is the first lesson
about R²: it is only interpretable against the spread of the predictor and the
noise of the instrument, never on an absolute scale. The residual standard
deviation is far more portable, because it stays in millivolts.

![The ten calibration points with the fitted line, shown beside the residuals alone. Vertical stems join each measurement to the line; the residual panel shows a band of the order of half a millivolt with no curvature, no widening and no drift across the pressure range.](/courses/fe-ee/figures/prob3-calibration-fit.svg)

The residual panel is the part worth studying. Five sign changes in ten points,
no arc, no fanning: the linear model is doing its job across the whole tested
range, and there is no evidence in this record that a quadratic term would earn
its degree of freedom. Section 10 makes that judgement systematic.`,
      examTip: 'Build the sum table before touching any formula. Five totals — n, Σx, Σy, Σxy, Σx² — determine the slope and intercept completely, and a sixth, Σy², adds R² and the standard error at no extra cost. Exam items that hand you the totals directly are testing whether you know which formula consumes which total.',
    },
    {
      id: 'reg-inference',
      title: '9. Standard Errors, Confidence Intervals and Prediction Intervals',
      content: `## 9.1 Where the uncertainty comes from

Everything so far was arithmetic on a fixed table. To attach uncertainty to the
slope, a model of how the data were generated is needed, and the standard one is

$$y_{i} = \\beta_{0} + \\beta_{1}x_{i} + \\varepsilon_{i}, \\qquad \\varepsilon_{i} \\sim N\\!\\left(0,\\sigma^{2}\\right)\\ \\text{independent}$$

with the predictor treated as fixed and known. Four assumptions are hiding in
that one line — linearity of the mean, independence of the errors, constant
error variance, and normality — and every interval below inherits all four.

The fitted slope is a weighted sum of the responses, which is what makes its
variance computable. Because the residual-weight coefficients sum to zero,

$$\\hat{\\beta}_{1} = \\frac{S_{xy}}{S_{xx}} = \\sum_{i=1}^{n}c_{i}y_{i}, \\qquad c_{i} = \\frac{x_{i}-\\bar{x}}{S_{xx}}$$

and since the observations are independent the variance of a weighted sum is the
weighted sum of variances:

$$\\operatorname{Var}\\!\\left(\\hat{\\beta}_{1}\\right) = \\sigma^{2}\\sum_{i=1}^{n}c_{i}^{2} = \\sigma^{2}\\,\\frac{\\sum(x_{i}-\\bar{x})^{2}}{S_{xx}^{2}} = \\frac{\\sigma^{2}}{S_{xx}}$$

That single line explains most of experimental design: the precision of a slope
improves with the SPREAD of the predictor, not merely with the number of points.
Doubling the range of a calibration is worth far more than doubling the number
of readings taken over the old range.

The error variance is unknown and is estimated from the residuals. Two degrees
of freedom were consumed fitting the intercept and slope, so the divisor is
n minus two:

$$s^{2} = \\frac{\\mathrm{SSE}}{n-2} = \\frac{1}{n-2}\\sum_{i=1}^{n}\\left(y_{i}-\\hat{y}_{i}\\right)^{2}$$

$$\\operatorname{se}\\!\\left(\\hat{\\beta}_{1}\\right) = \\frac{s}{\\sqrt{S_{xx}}}, \\qquad \\operatorname{se}\\!\\left(\\hat{\\beta}_{0}\\right) = s\\sqrt{\\frac{1}{n}+\\frac{\\bar{x}^{2}}{S_{xx}}}$$

Because sigma had to be estimated, the reference distribution is Student-t with
n minus two degrees of freedom rather than the standard normal.

## 9.2 Worked: is the slope real, and how well is it pinned down?

Given SSE = 1.82, n = 10 and Sxx = 8250 from the calibration, test the slope
against zero at the 5 per cent level and give a 95 per cent interval for it.

The residual variance and the residual standard deviation are

$$s^{2} = \\frac{1.82}{10-2} = \\frac{1.82}{8} = 0.2275 \\qquad\\Longrightarrow\\qquad s = 0.47697\\ \\mathrm{mV}$$

so the standard error of the slope is

$$\\operatorname{se}(b) = \\frac{0.47697}{\\sqrt{8250}} = \\frac{0.47697}{90.8295} = 0.005251\\ \\mathrm{mV/kPa}$$

and the test statistic against a null slope of zero is

$$t = \\frac{b - 0}{\\operatorname{se}(b)} = \\frac{0.500}{0.005251} = 95.2$$

with 8 degrees of freedom. The two-sided 5 per cent critical value of the
Student-t distribution on 8 degrees of freedom, taking 2.5 per cent in each
tail, is 2.306, so the null slope is rejected by a margin that is not close. The
95 per cent interval for the slope is

$$b \\pm t_{0.975,8}\\,\\operatorname{se}(b) = 0.500 \\pm 2.306(0.005251) = 0.500 \\pm 0.0121$$

giving **(0.4879, 0.5121) mV/kPa**. The corresponding interval for the intercept
uses its own standard error,
$0.47697\\sqrt{0.1 + 3025/8250} = 0.47697(0.68313) = 0.32583$ mV, and comes to
4.50 ± 2.306(0.32583) = 4.50 ± 0.751, or **(3.749, 5.251) mV**. The intercept is
about seven times less precisely known than the slope in relative terms, which
is normal: the data sit between 10 and 100 kPa, so the value at zero is an
extrapolation and pays for it.

## 9.3 Two different questions at the same abscissa

Ask a fitted line for a value at x-nought and there are two distinct questions in
play, with two distinct answers. "What is the AVERAGE output of transducers of
this type at 75 kPa?" asks about the line. "What will the NEXT unit read at 75
kPa?" asks about one item, which carries its own measurement scatter on top of
the uncertainty in the line. The point estimate is identical in both cases;
the intervals are not.

For the mean response, the fitted value is a weighted sum of the responses again,
and its variance works out to

$$\\operatorname{Var}\\!\\left(\\hat{y}_{0}\\right) = \\sigma^{2}\\left[\\frac{1}{n} + \\frac{(x_{0}-\\bar{x})^{2}}{S_{xx}}\\right]$$

whose two terms are the uncertainty in the height of the line at the centroid and
the uncertainty contributed by the slope acting over a lever arm. For a single
future observation, that same line uncertainty is present and the new unit's own
error is added on top; the two are independent, so their variances add:

$$\\operatorname{Var}\\!\\left(y_{\\mathrm{new}} - \\hat{y}_{0}\\right) = \\sigma^{2}\\left[1 + \\frac{1}{n} + \\frac{(x_{0}-\\bar{x})^{2}}{S_{xx}}\\right]$$

The intervals are therefore

$$\\hat{y}_{0} \\pm t_{1-\\alpha/2,\\,n-2}\\;s\\sqrt{\\frac{1}{n}+\\frac{(x_{0}-\\bar{x})^{2}}{S_{xx}}} \\quad\\text{(mean response)}$$

$$\\hat{y}_{0} \\pm t_{1-\\alpha/2,\\,n-2}\\;s\\sqrt{1+\\frac{1}{n}+\\frac{(x_{0}-\\bar{x})^{2}}{S_{xx}}} \\quad\\text{(one new unit)}$$

and the only difference is a single added one under the radical. That one is the
entire distinction, and it is decisive: as the sample grows the confidence
interval shrinks toward zero width, while the prediction interval shrinks only
toward plus or minus t times s. No quantity of data makes a single future
measurement predictable to better than the process noise.

## 9.4 Worked: both intervals at 75 kPa, on the same data

Given the calibration fit ŷ = 4.50 + 0.500x with s = 0.47697 mV, n = 10,
x̄ = 55 kPa and Sxx = 8250, compute the 95 per cent confidence interval for the
mean output and the 95 per cent prediction interval for the next unit, both at
75 kPa.

The point estimate is $\\hat{y}_{0} = 4.5 + 0.5(75) = 42.00$ mV. The bracketed
leverage term is

$$\\frac{1}{10} + \\frac{(75-55)^{2}}{8250} = 0.1 + \\frac{400}{8250} = 0.1 + 0.048485 = 0.148485$$

so the two standard errors are

$$s\\sqrt{0.148485} = 0.47697(0.38534) = 0.18379\\ \\mathrm{mV}$$

$$s\\sqrt{1.148485} = 0.47697(1.07167) = 0.51116\\ \\mathrm{mV}$$

Multiplying each by the same t-multiplier 2.306, from the Student-t distribution
on 8 degrees of freedom with 2.5 per cent in each tail:

$$\\text{CI: } 42.00 \\pm 2.306(0.18379) = 42.00 \\pm 0.424 \\Rightarrow (41.58,\\ 42.42)\\ \\mathrm{mV}$$

$$\\text{PI: } 42.00 \\pm 2.306(0.51116) = 42.00 \\pm 1.179 \\Rightarrow (40.82,\\ 43.18)\\ \\mathrm{mV}$$

The prediction interval is 2.78 times wider than the confidence interval on the
same data, at the same abscissa, with the same confidence level. Quoting the
narrower one when the question was about an individual unit understates the real
uncertainty by nearly a factor of three, and that substitution is the single
most common error in this part of the topic.

![Both intervals plotted as departures from the fitted calibration line, so that bands about one millivolt wide are visible on a sixty-millivolt fit. The inner band is the confidence interval for the mean response, the outer the prediction interval for one new unit; both are hyperbolas pinched narrowest at the mean pressure of 55 kPa and flaring toward the ends of the tested range.](/courses/fe-ee/figures/prob3-ci-vs-pi.svg)

Both bands are narrowest at the centroid, where the lever-arm term vanishes and
the half-widths reduce to 0.348 mV and 1.154 mV respectively, and both flare
toward the ends of the data — which is the quantitative form of the warning
against extrapolation. Push x-nought far outside the tested window and the
lever-arm term dominates everything else in the bracket, so the interval widens
without limit even though the point estimate marches on happily.

## 9.5 Does a 95 per cent interval actually cover 95 per cent of the time?

That question has a definite answer, and it is worth settling by experiment
rather than by faith. Take the fitted line as the truth, with the residual
standard deviation of this calibration as the true sigma, generate a fresh set of
ten responses at the same ten pressures, refit, rebuild each interval from the
new data alone, and record whether it captured the quantity it claims to
capture. Over **200,000 simulated calibrations** the counts were:

| Interval | What it claims to capture | Nominal | Simulated coverage | Trials |
|---|---|---|---|---|
| Slope, 95% | the true slope 0.500 | 0.9500 | 0.94937 | 200,000 |
| Mean response at 75 kPa | the true mean 42.00 mV | 0.9500 | 0.94937 | 200,000 |
| Prediction, one new unit | a freshly drawn observation | 0.9500 | 0.94981 | 200,000 |

All three land within about seven parts in ten thousand of the nominal level,
which is the size of the simulation's own standard error at this many trials
(the standard error of a proportion near 0.95 on 200,000 draws is about 0.0005).
The intervals do what they say. Note what the third row confirms: the prediction
interval is not "conservative" or "padded" — it is calibrated for a different,
harder target, and it needs every millivolt of its extra width to hit the same
95 per cent.

The slope test can be checked without any distributional assumption at all. Shuffle
the ten outputs against the ten pressures at random, refit, and see how often
chance alone produces a slope as large in magnitude as the observed 0.500. In
**100,000 random shuffles** exactly one reached that magnitude, so the
permutation estimate is 1 × 10⁻⁵, which is the resolution floor of a
hundred-thousand-shuffle test. The t-based two-sided p-value
is 1.7 × 10⁻¹³, far below anything a hundred thousand shuffles could resolve, so
the two agree as well as they possibly can: both say the slope is not an accident
of arrangement.`,
      examTip: 'Confidence interval or prediction interval is decided by the noun in the question. "The mean output of units at this pressure" is the line — no extra 1. "The reading of the next unit" is an item — the extra 1 goes under the root, and the interval is much wider. Both appear in the answer choices, every time.',
      importantNote: 'Increasing n shrinks the confidence interval toward zero width but shrinks the prediction interval only toward ±t·s. No amount of calibration data makes a single future measurement more repeatable than the instrument itself.',
    },
    {
      id: 'reg-diagnostics',
      title: '10. Residual Diagnostics, Leverage and Influence',
      content: `## 10.1 What the residual plot sees that R-squared cannot

R-squared answers one question — how much of the variation the line captured —
and is silent about whether a line was the right shape, whether the noise was
even, and whether one point wrote the answer by itself. Those are questions
about the PATTERN of the residuals, and only a plot of them answers.

![Four residual plots generated from stated models: an adequate fit leaving a patternless band, a quadratic truth forced through a straight line leaving a smooth U, errors proportional to x leaving a widening funnel, and a single depressed point at the far end of the range dragging the fitted slope from 0.500 down to 0.484.](/courses/fe-ee/figures/prob3-residual-gallery.svg)

Each panel comes from a model written out in the caption, so the shapes are not
illustrations of a pattern but consequences of a cause. The second panel is the
sharpest warning: those data have an R² of 0.9591, which most engineers would
call an excellent fit, and yet the residuals trace a perfect parabola because
the underlying relation carried a quadratic term. High R² and a curved residual
plot together mean the model is wrong and the predictor happens to be strong,
not that the model is right.

| Plot to make | What a healthy version looks like | What a defect looks like, and what it means |
|---|---|---|
| Residual against fitted value | horizontal band centred on zero | a curve means the mean function is wrong; a funnel means the variance is not constant |
| Residual against predictor | same band, no structure | structure means a term in x is missing from the model |
| Residual against run order | no drift, no runs | drift means the instrument or the operator changed during the experiment |
| Normal quantile plot of residuals | points near a straight line | heavy curvature at the ends means the t-based intervals of Section 9 are optimistic |
| Residual against an omitted variable | no relationship | a relationship means that variable belongs in the model — Section 11 |

## 10.2 Leverage: how much say each point has

Not every observation gets an equal vote. The fitted value at the i-th point can
be written as a weighted sum of ALL the responses, and the weight a point puts on
its own fitted value is its leverage:

$$h_{i} = \\frac{1}{n} + \\frac{(x_{i}-\\bar{x})^{2}}{S_{xx}}$$

Leverage depends only on where the point sits along the x-axis, never on its
response. Two properties make it easy to check. First, the leverages of a simple
linear regression sum to the number of fitted coefficients:

$$\\sum_{i=1}^{n}h_{i} = 2$$

so the average leverage is 2/n, and a common rule of thumb flags any point above
twice that. Second, leverage shrinks the apparent size of a residual, because a
high-leverage point pulls the line toward itself:

$$\\operatorname{Var}(e_{i}) = \\sigma^{2}\\left(1-h_{i}\\right)$$

which is why raw residuals should be standardised before they are compared:

$$r_{i} = \\frac{e_{i}}{s\\sqrt{1-h_{i}}}$$

A point with leverage near one has almost no residual no matter how wrong it is,
because the line simply goes there. That is the trap: the most influential point
in a data set is often the one with the smallest visible residual.

## 10.3 Worked: leverage across the calibration

Given the ten pressures 10 through 100 kPa with x̄ = 55 and Sxx = 8250, compute
the leverage of the extreme and central points and check the total.

At the first point, x = 10 kPa, the lever arm is 10 − 55 = −45, so

$$h_{1} = \\frac{1}{10} + \\frac{(-45)^{2}}{8250} = 0.1 + \\frac{2025}{8250} = 0.1 + 0.245455 = 0.345455$$

and by symmetry the point at 100 kPa has the same leverage. The two central
points, at 50 and 60 kPa, have lever arm ±5:

$$h_{5} = 0.1 + \\frac{25}{8250} = 0.1 + 0.003030 = 0.103030$$

The full column appears in the table of Section 8.2. Summing it,
2(0.345455 + 0.248485 + 0.175758 + 0.127273 + 0.103030) = 2(1.000001) = 2.000,
which reproduces the identity above and confirms the whole column at once. The
average leverage is 0.2, and the extreme points sit at 1.73 times average — high,
but that is inherent in an evenly spaced calibration and not a defect. It does
mean the endpoints deserve the most careful measurement: they are the points the
slope listens to.

## 10.4 Worked: how far one bad reading moves the line

Given the same calibration, suppose the reading at 100 kPa were recorded 3.0 mV
below its true value. By how much would the fitted slope be wrong?

Because the slope is linear in the responses, the effect of perturbing one
response by an amount delta is exact and requires no refitting:

$$\\Delta b = \\frac{\\delta\\,(x_{k}-\\bar{x})}{S_{xx}}$$

Substituting delta = −3.0 mV at x = 100 kPa, where the lever arm is 45:

$$\\Delta b = \\frac{(-3.0)(45)}{8250} = \\frac{-135}{8250} = -0.016364\\ \\mathrm{mV/kPa}$$

so the slope would read 0.500 − 0.016 = **0.4836 mV/kPa**, an error of 3.3 per
cent — and the recorded 95 per cent interval for the slope, (0.4879, 0.5121),
would not contain the truth. One mistyped digit at the end of the range breaks
the calibration, while the same error at 50 kPa would move the slope by only
(−3)(−5)/8250 = +0.00182, a tenth as much and comfortably inside the interval.

That contrast is the practical content of leverage. It also suggests the routine
defence: refit with each point deleted in turn and watch the slope. If dropping
one observation moves a coefficient by more than its standard error, that
observation is running the analysis and needs to be understood before anything is
concluded.

| Symptom | Likely cause | What to do next |
|---|---|---|
| Large standardised residual, low leverage | a genuine outlier in the response | investigate the measurement; never delete without a reason recorded |
| Small residual, very high leverage | an isolated x that the line is chasing | refit without it and compare coefficients |
| Smooth curve in the residuals | missing non-linear term | add a quadratic term or transform, then re-plot |
| Funnel opening with x | error proportional to level | fit in logs, or use weights proportional to the reciprocal of the variance |
| Residuals correlated in run order | drift or autocorrelation | randomise the run order; the t-intervals of Section 9 are invalid until this is fixed |`,
      examTip: 'Leverage is a property of the x-values alone, computable before a single response is measured. If an exam item gives you the pressures, currents or temperatures at which readings will be taken, you can already say which point will dominate the slope — and the answer is always the one furthest from the mean of the predictor.',
    },
    {
      id: 'reg-confounding',
      title: '11. Correlation Is Not Causation: a Confounded Fit',
      content: `## 11.1 Twelve feeders and a tempting conclusion

A utility reviews twelve distribution feeders. For each it records the lightning
ground-flash density of the territory the feeder crosses, Z, in flashes per
square kilometre per year; the density of surge arresters installed, X, in
arresters per kilometre of line; and the flashover count, Y, in insulator
flashovers per 100 kilometres per year. The complete record is:

| Feeder | Z (flashes/km²/yr) | X (arresters/km) | Y (flashovers/100 km·yr) |
|---|---|---|---|
| 1 | 1 | 2 | 37 |
| 2 | 1 | 3 | 32 |
| 3 | 1 | 4 | 30 |
| 4 | 2 | 4 | 41 |
| 5 | 2 | 5 | 39 |
| 6 | 2 | 6 | 37 |
| 7 | 3 | 6 | 48 |
| 8 | 3 | 7 | 46 |
| 9 | 3 | 8 | 41 |
| 10 | 4 | 8 | 55 |
| 11 | 4 | 9 | 49 |
| 12 | 4 | 10 | 49 |

The column totals a fit needs are n = 12, sum X = 72, sum Z = 30, sum Y = 504,
so the means are x̄ = 6, z̄ = 2.5 and ȳ = 42, and the corrected sums are
Sxx = 68, Szz = 15, Sxz = 30, Sxy = 156, Szy = 90 and Syy = 624.

## 11.2 Worked: the naive regression of flashovers on arresters

Given those totals, fit flashover count on arrester density alone and test the
slope.

$$b = \\frac{S_{xy}}{S_{xx}} = \\frac{156}{68} = 2.2941 \\qquad a = 42 - 2.2941(6) = 28.235$$

The error sum of squares is Syy minus the explained part,

$$\\mathrm{SSE} = S_{yy} - b\\,S_{xy} = 624 - 2.2941(156) = 624 - 357.88 = 266.12$$

giving $s = \\sqrt{266.12/10} = 5.159$ and
$\\operatorname{se}(b) = 5.159/\\sqrt{68} = 0.6256$, so

$$t = \\frac{2.2941}{0.6256} = 3.667 \\qquad \\text{on } n-2 = 10 \\text{ degrees of freedom}$$

The two-sided 5 per cent critical value of Student-t on 10 degrees of freedom is
2.228, and 3.667 exceeds it; the two-sided p-value is 0.0043. The regression is
significant, R² is 0.5735, and read literally the fitted line says that each
additional arrester per kilometre comes with **2.29 more flashovers** per 100
kilometre-years. Taken as an engineering finding, that is the claim that surge
arresters cause flashovers.

## 11.3 Worked: the same twelve feeders with the confounder included

Given the same totals, fit flashovers on BOTH arrester density and lightning
density. The centred normal equations for two predictors are

$$S_{xx}b_{X} + S_{xz}b_{Z} = S_{xy} \\qquad S_{xz}b_{X} + S_{zz}b_{Z} = S_{zy}$$

which for these data are 68b_X + 30b_Z = 156 and 30b_X + 15b_Z = 90. Divide the
second by 15 to get 2b_X + b_Z = 6, so b_Z = 6 − 2b_X, and substitute:

$$68b_{X} + 30(6-2b_{X}) = 156 \\quad\\Longrightarrow\\quad 8b_{X} = -24$$

$$b_{X} = -3.00, \\qquad b_{Z} = 6 - 2(-3) = 12.00$$

$$b_{0} = \\bar{y} - b_{X}\\bar{x} - b_{Z}\\bar{z} = 42 + 18 - 30 = 30.00$$

The sign has reversed. Holding lightning exposure fixed, each additional arrester
per kilometre is associated with **three FEWER flashovers** per 100 kilometre-
years, which is what an arrester is for. The residual sum of squares collapses
from 266.12 to

$$\\mathrm{SSE} = S_{yy} - b_{X}S_{xy} - b_{Z}S_{zy} = 624 + 468 - 1080 = 12.00$$

on n − k − 1 = 9 degrees of freedom, so s = 1.155 and R² rises to 0.9808. The
standard error of the arrester coefficient, derived in Section 13.5, is 0.4082,
giving t = −7.35 against a critical 2.262 on 9 degrees of freedom: the protective
effect is significant, and so was the spurious one.

![Twelve feeders plotted as flashover count against arrester density. The dashed line through all twelve rises with a slope of plus 2.29; the four short solid lines, fitted inside each lightning-density band separately, all fall with slopes near minus 3.](/courses/fe-ee/figures/prob3-confounded.svg)

The picture explains the reversal without any algebra. Within each lightning
band the relationship is downward — the four within-band slopes are −3.5, −2.0,
−3.5 and −3.0 — but the bands are stacked in a rising staircase, because the
utility installs more arresters exactly where lightning is worst. Ignore the
bands and the staircase wins.

## 11.4 The omitted-variable formula, and why it is exact here

The reversal is not a coincidence of these numbers. When the true relation
includes Z but Z is left out, the fitted simple slope is

$$b_{\\text{simple}} = \\beta_{X} + \\beta_{Z}\\,\\frac{S_{xz}}{S_{xx}}$$

the true partial effect plus the effect of the omitted variable times the slope
of a regression of the omitted variable on the included one. Substituting the
numbers from this data set:

$$-3 + 12\\left(\\frac{30}{68}\\right) = -3 + 5.2941 = 2.2941$$

which reproduces the naive slope to every digit computed in Section 11.2. The
bias term is large here because the two predictors are strongly related:
$r_{XZ} = 30/\\sqrt{68 \\times 15} = 30/31.937 = 0.9393$. The formula also says
when omitting a variable is harmless — if the omitted variable has no effect,
or is uncorrelated with the included one, the bias term vanishes.

## 11.5 What a p-value can and cannot rescue

A natural objection is that the naive result was a fluke. It was not, and this is
worth being blunt about. Shuffling the twelve flashover counts at random against
the arrester densities **100,000 times**, a slope as large in magnitude as
+2.294 arose in 526 shuffles, a permutation p-value of 0.0053 — in close
agreement with the 0.0043 the t-distribution gave, and comfortably below any
conventional threshold. The association is real. It is simply not causal.

That is the entire lesson of this section, and it survives every statistical
refinement: significance testing asks whether an association could plausibly be
an accident of sampling, and confounding is not an accident of sampling. More
data would have made the wrong slope MORE significant, not less. Only a change
in what is measured or how the units are assigned rescues the conclusion.

| Study design | What a significant slope licenses | What it does not license |
|---|---|---|
| Observational, one predictor | an association exists in this population | any statement about what happens if the predictor is changed |
| Observational, confounder measured and included | an association holding that confounder fixed | protection against confounders nobody measured |
| Randomised assignment of the predictor | a causal effect, because assignment is independent of everything else | transfer to units unlike those studied |
| Physical mechanism established independently | causal reading of the same coefficient | extrapolation past the tested range |

The practical form of the warning for the exam: when a stem describes data
merely collected rather than assigned, the credited conclusion is always about
association, and the distractor is always the causal sentence.`,
      examTip: 'A coefficient that reverses sign when another variable is added is the signature of confounding, not of an arithmetic error. Check the correlation between the two predictors: if it is large, neither coefficient can be read in isolation, and the simple regression is estimating the true effect PLUS the omitted variable\'s effect routed through that correlation.',
      importantNote: 'A small p-value rules out chance as an explanation for an association. It does not rule out a lurking variable, reverse causation, or a selection effect, and a larger sample makes a confounded association look stronger rather than weaker.',
    },
    {
      id: 'reg-transform',
      title: '12. Linearising Transforms and the Bias They Introduce',
      content: `## 12.1 Eight coupons on a voltage-endurance test

Eight identical insulation coupons are aged to breakdown, each at a different
electric stress, and the time to breakdown is recorded. The expected model is
exponential in the stress, t = C·e^(kV) with k negative, so the natural fitting
coordinates are stress against the logarithm of life. The complete record, with
the logarithms rounded to six decimals:

| Coupon | V (kV/mm) | t (h) | ln t |
|---|---|---|---|
| 1 | 8 | 3880 | 8.263590 |
| 2 | 9 | 2740 | 7.915713 |
| 3 | 10 | 814 | 6.701960 |
| 4 | 11 | 453 | 6.115892 |
| 5 | 12 | 280 | 5.634790 |
| 6 | 13 | 196 | 5.278115 |
| 7 | 14 | 184 | 5.214936 |
| 8 | 15 | 131 | 4.875197 |

Lifetimes scatter multiplicatively — a coupon lasts half as long or twice as
long, not fifty hours more or fewer — which is exactly the situation the log
transform is built for, and exactly the situation that makes the back-transform
biased. Both halves of that sentence are worked below.

## 12.2 Worked: fitting the endurance line

Given the table, fit ln t as a linear function of stress.

The stress values are symmetric about V̄ = 11.5, so
$S_{VV} = 2(3.5^{2}+2.5^{2}+1.5^{2}+0.5^{2}) = 2(21) = 42$. The logarithms total
50.000193, so the mean log-life is 6.250024, and the cross product works out to
$S_{V\\ln t} = -20.9876$. Therefore

$$k = \\frac{-20.9876}{42} = -0.499706\\ (\\mathrm{kV/mm})^{-1}$$

$$\\ln C = 6.250024 + 0.499706(11.5) = 11.99664 \\quad\\Longrightarrow\\quad C = 1.622 \\times 10^{5}\\ \\mathrm{h}$$

The fitted endurance law is ln t = 11.997 − 0.4997V. Its residual sum of squares
is 0.84824 on n − 2 = 6 degrees of freedom, so

$$\\hat{\\sigma}^{2} = \\frac{0.84824}{6} = 0.141374 \\qquad \\hat{\\sigma} = 0.3760$$

in log units, and R² in the transformed variables is 0.9252. The standard error
of the exponent is $0.3760/\\sqrt{42} = 0.05802$, so t = −8.61 on 6 degrees of
freedom against a critical 2.447: the stress dependence is unambiguous. A 95 per
cent interval for the exponent is −0.4997 ± 2.447(0.05802), or (−0.6417,
−0.3577), which is wide — eight coupons buy an order of magnitude, not a third
significant figure.

![The endurance data plotted twice: as log-life against stress, where the least-squares line has slope minus 0.4997, and back on the raw hour scale, where the exponentiated log fit is shown beside a direct least-squares fit performed on the untransformed lifetimes. The two raw-scale curves are visibly different, the direct fit passing much higher at low stress.](/courses/fe-ee/figures/prob3-log-bias.svg)

## 12.3 What the exponentiated fit actually estimates

Exponentiating a fitted log-line looks like it returns the fitted life. It does
not — it returns the fitted MEDIAN life. If the log-life at a given stress is
normal with mean mu and variance sigma squared, then the life itself is
lognormal, and its two central measures differ:

$$\\operatorname{median}(t) = e^{\\mu}, \\qquad E[t] = \\exp\\!\\left(\\mu + \\tfrac{1}{2}\\sigma^{2}\\right)$$

so the naive back-transform understates the mean by the smearing factor

$$\\frac{E[t]}{\\operatorname{median}(t)} = e^{\\sigma^{2}/2}$$

Because the exponential is convex, the mean of the exponential exceeds the
exponential of the mean — the inequality is Jensen's, and it is strict whenever
the log-scale variance is non-zero. The correction is small when the log-scale
scatter is small and grows fast when it is not: a log standard deviation of 0.1
costs half a per cent, one of 0.5 costs 13 per cent, and one of 1.0 costs 65 per
cent.

An estimator that does not assume normality is available. Duan's smearing
estimate replaces the theoretical factor with the average of the exponentiated
residuals actually observed:

$$\\hat{\\lambda} = \\frac{1}{n}\\sum_{i=1}^{n}e^{\\hat{r}_{i}}$$

which is the same idea with the distributional assumption removed.

## 12.4 Worked: the median, the mean and the correction at 12 kV/mm

Given the fitted line and the log-scale variance, report the estimated life at
12 kV/mm as both a median and a mean.

The fitted log-life is

$$\\ln t = 11.99664 - 0.499706(12) = 11.99664 - 5.99647 = 6.00017$$

so the estimated **median life is e^6.00017 = 403.5 h**. The smearing factor from
the fitted log-scale variance is

$$e^{\\hat{\\sigma}^{2}/2} = e^{0.141374/2} = e^{0.070687} = 1.07325$$

so the estimated **mean life is 403.5 × 1.07325 = 433.1 h**, 7.3 per cent higher.
Duan's estimate, formed from the eight observed log residuals, is 1.05379,
giving 425.2 h — a little lower than the lognormal figure, which is what one
expects from eight residuals that are not perfectly normal. Report the median
when the question is "how long does a typical coupon last"; report the mean when
lifetimes are being added up, as in a spares budget or an expected-cost
calculation. Reporting 403.5 h as a mean is the error, and it is systematically
optimistic in the same direction every time.

## 12.5 Worked: least squares in ln t is not least squares in t

Given the same eight coupons, fit the exponential model directly on the raw hour
scale by minimising the sum of squared errors in hours, and compare.

Minimising the raw-scale objective by Gauss-Newton iteration returns
C = 5.576 × 10⁵ h and k = −0.6158, against C = 1.622 × 10⁵ h and k = −0.4997
from the log route — a 23 per cent difference in the exponent and more than a
factor of three in the prefactor. Neither is a mistake. They minimise different
things, and each wins on its own criterion:

| Criterion being minimised | Fit through ln t | Direct fit in t |
|---|---|---|
| Sum of squared errors in hours | 1,829,775 | 520,569 |
| Sum of squared RELATIVE errors | 0.9005 | 1.0148 |
| Exponent k obtained | −0.4997 | −0.6158 |
| Prefactor C obtained (h) | 1.622 × 10⁵ | 5.576 × 10⁵ |

Taking logs converts a multiplicative error into an additive one, so squaring in
log space is equivalent to squaring PROPORTIONAL error on the raw scale. The
coupon that lasted 131 hours then counts as much as the one that lasted 3880,
whereas the raw-scale fit is dominated by the two longest-lived coupons because
their absolute errors are by far the largest. For life data, where a 20 per cent
error means the same thing at every stress, the log route is the physically
appropriate one — and it is also the one the FE expects, because it is the one
that reduces to a straight-line fit.

The transform-back arithmetic is the other place marks disappear. A fitted
intercept in log coordinates is ln C, not C, and a fitted intercept on a
base-ten log plot is log C. An intercept of 11.997 means C = e^11.997 = 162,200
hours; quoting 11.997 as the prefactor, or exponentiating a base-ten intercept
with e, are the two standard slips.

| Physical model | Transform | Straight line obtained | Recover the constants by |
|---|---|---|---|
| t = C·e^(kV) | take ln of both sides | ln t = ln C + kV | C = exp(intercept), k = slope |
| y = C·x^m | take log of both sides | log y = log C + m log x | C = 10^(intercept), m = slope |
| R = R₀·e^(B/T) | take ln, plot against 1/T | ln R = ln R₀ + B(1/T) | R₀ = exp(intercept), B = slope |
| 1/y = a + bx (rate law) | take reciprocal of y | 1/y linear in x | read a and b directly, then invert |`,
      examTip: 'Exponentiating a log-scale fit gives the median, not the mean. On the exam the transform itself is the credited step, but if a stem asks for an EXPECTED total — total spares, total downtime, total cost — the smearing factor exp(σ²/2) is the difference between a right and a wrong answer, and it is always an increase.',
    },
    {
      id: 'reg-multivariable',
      title: '13. Multiple Regression and Degrees-of-Freedom Bookkeeping',
      content: `## 13.1 The model in matrix form

With k predictors the model is written once and solved once, whatever k is:

$$y_{i} = \\beta_{0} + \\beta_{1}x_{i1} + \\beta_{2}x_{i2} + \\cdots + \\beta_{k}x_{ik} + \\varepsilon_{i}$$

Stack the responses into a column and the predictors into a design matrix whose
first column is all ones, and the whole system compresses to

$$\\mathbf{y} = \\mathbf{X}\\boldsymbol{\\beta} + \\boldsymbol{\\varepsilon}$$

Minimising the same objective — the squared length of the residual vector —
gives the same stationarity condition, now written as a matrix equation. The
residual vector must be orthogonal to every column of the design matrix, which is
one condition per coefficient:

$$\\mathbf{X}^{\\mathsf{T}}\\left(\\mathbf{y}-\\mathbf{X}\\hat{\\boldsymbol{\\beta}}\\right) = \\mathbf{0} \\quad\\Longleftrightarrow\\quad \\mathbf{X}^{\\mathsf{T}}\\mathbf{X}\\hat{\\boldsymbol{\\beta}} = \\mathbf{X}^{\\mathsf{T}}\\mathbf{y}$$

$$\\hat{\\boldsymbol{\\beta}} = \\left(\\mathbf{X}^{\\mathsf{T}}\\mathbf{X}\\right)^{-1}\\mathbf{X}^{\\mathsf{T}}\\mathbf{y}$$

For k = 1 those matrix normal equations are literally the two scalar equations of
Section 7.2, so nothing new has been introduced: the projection picture and both
orthogonality conditions generalise unchanged, with one condition per column
instead of two.

In centred form, which is what a hand calculation uses, the intercept drops out
and a k-by-k system in the corrected sums remains. For two predictors:

$$\\begin{bmatrix} S_{11} & S_{12} \\\\ S_{12} & S_{22} \\end{bmatrix}\\begin{bmatrix} b_{1} \\\\ b_{2} \\end{bmatrix} = \\begin{bmatrix} S_{1y} \\\\ S_{2y} \\end{bmatrix}$$

$$b_{0} = \\bar{y} - b_{1}\\bar{x}_{1} - b_{2}\\bar{x}_{2}$$

## 13.2 The degrees-of-freedom ledger

Every coefficient estimated costs one degree of freedom, and the bookkeeping is
the part that goes wrong under time pressure:

$$\\mathrm{df}_{\\text{total}} = n-1, \\qquad \\mathrm{df}_{\\text{model}} = k, \\qquad \\mathrm{df}_{\\text{error}} = n-k-1$$

and those three add up, which is the check. The residual variance divides by the
error degrees of freedom, never by n:

$$s^{2} = \\frac{\\mathrm{SSE}}{n-k-1}$$

The n − 2 of simple regression is this formula at k = 1. Every t-test on a
coefficient, and every interval built from one, uses n − k − 1 degrees of
freedom, and a model with as many coefficients as observations has zero of them:
it fits the data perfectly, reports SSE = 0 and R² = 1, and says nothing at all.

## 13.3 Adjusted R-squared and the overall F test

Ordinary R² can only rise when a predictor is added, however useless the
predictor, because the larger model contains the smaller one and least squares
will never do worse on its own training data. Comparing models therefore needs a
statistic that charges for the degree of freedom spent. Adjusted R² divides each
sum of squares by its own degrees of freedom before taking the ratio:

$$R^{2}_{\\text{adj}} = 1 - \\frac{\\mathrm{SSE}/(n-k-1)}{\\mathrm{SST}/(n-1)} = 1-\\left(1-R^{2}\\right)\\frac{n-1}{n-k-1}$$

which CAN fall, and does fall whenever the added predictor buys less explanation
than a degree of freedom is worth. It can even go negative for a model worse than
the mean.

![Adjusted R-squared against the number of predictors for a fixed sample of twelve observations, drawn for an unadjusted R-squared of 0.98 and of 0.60. Both dashed reference lines are flat; both adjusted curves fall away from them, the weaker model far faster, reaching 0.12 by six predictors.](/courses/fe-ee/figures/prob3-adjusted-r2.svg)

The whole model is tested at once by comparing explained variance per degree of
freedom against unexplained variance per degree of freedom:

$$F = \\frac{\\mathrm{SSR}/k}{\\mathrm{SSE}/(n-k-1)} = \\frac{\\mathrm{MSR}}{\\mathrm{MSE}}$$

whose null distribution is F with k and n − k − 1 degrees of freedom. That test
asks whether ANY predictor matters; the individual t-tests ask which ones. They
can disagree, and when predictors are strongly correlated they frequently do — a
significant F with no significant t is the classic signature of collinearity.

## 13.4 Worked: the full analysis of variance for the feeder model

Given the twelve feeders of Section 11 with Syy = 624 and the two-predictor fit
leaving SSE = 12, build the analysis-of-variance table and test the model.

The regression sum of squares is 624 − 12 = 612 on k = 2 degrees of freedom, and
the error sum of squares is 12 on n − k − 1 = 12 − 2 − 1 = 9:

| Source | Sum of squares | df | Mean square | F |
|---|---|---|---|---|
| Regression | 612.00 | 2 | 306.00 | 229.5 |
| Error | 12.00 | 9 | 1.3333 | — |
| Total | 624.00 | 11 | — | — |

The degrees of freedom column adds: 2 + 9 = 11, as it must. The mean squares are
612/2 = 306 and 12/9 = 1.3333, so

$$F = \\frac{306}{1.3333} = 229.5$$

against the upper 5 per cent point of the F distribution on 2 and 9 degrees of
freedom, which is 4.256. The model is rejected as a whole against the
no-predictors alternative by an enormous margin; the p-value is 1.9 × 10⁻⁸.
The residual standard deviation is $s = \\sqrt{1.3333} = 1.155$ flashovers per
100 kilometre-years.

Comparing the two models on the same data makes the bookkeeping concrete:

$$R^{2} = 1 - \\frac{12}{624} = 0.98077 \\qquad R^{2}_{\\text{adj}} = 1-(1-0.98077)\\frac{11}{9} = 0.97650$$

against R² = 0.5735 and adjusted R² = 1 − (0.42648)(11/10) = 0.5309 for the
one-predictor model of Section 11.2. Adding the lightning density cost one degree
of freedom and bought 0.45 of adjusted R-squared, which is an overwhelmingly good
trade — and, more importantly, it changed the SIGN of the coefficient that
matters.

## 13.5 Worked: standard errors from the cross-product inverse

Given the centred cross-product matrix of the feeder data and MSE = 1.3333, find
the standard error of the arrester coefficient and test it.

The centred system of Section 11.3 has matrix entries Sxx = 68, Sxz = 30 and
Szz = 15, so its determinant is

$$\\det = (68)(15) - (30)^{2} = 1020 - 900 = 120$$

and the inverse of a two-by-two symmetric matrix swaps the diagonal and negates
the off-diagonal, all divided by the determinant. The entry needed for the first
coefficient is therefore Szz over the determinant:

$$\\operatorname{Var}(b_{X}) = s^{2}\\,\\frac{S_{zz}}{\\det} = \\frac{4}{3}\\left(\\frac{15}{120}\\right) = 0.16667$$

$$\\operatorname{se}(b_{X}) = \\sqrt{0.16667} = 0.40825$$

$$t = \\frac{-3.00}{0.40825} = -7.348 \\qquad \\text{on } 9 \\text{ degrees of freedom}$$

The two-sided 5 per cent critical value on 9 degrees of freedom is 2.262, so the
protective effect of the arresters is significant; the p-value is 4.3 × 10⁻⁵. The
same route gives the lightning coefficient a variance of (4/3)(68/120) =
0.75556, a standard error of 0.86923, and t = 12.00/0.86923 = 13.81.

Notice how the determinant carries the collinearity. With Sxz = 30 out of a
maximum of $\\sqrt{68 \\times 15} = 31.937$, the determinant is only 120 where two
uncorrelated predictors would have given 1020, and both standard errors are
inflated by that shortfall — by a factor of $\\sqrt{1020/120} = 2.92$ for the
arrester coefficient. Collinearity does not bias the coefficients; it makes them
imprecise. Fit two nearly identical predictors and the fitted plane is still
correct on average, but the individual slopes swing wildly from sample to sample,
which is exactly why a significant F can sit beside two insignificant t values.

| Quantity | Simple regression | Multiple regression, k predictors |
|---|---|---|
| Error degrees of freedom | n − 2 | n − k − 1 |
| Residual variance | SSE/(n − 2) | SSE/(n − k − 1) |
| Coefficient standard error | s/√Sxx | s times the root of the matching diagonal of the inverse cross-product matrix |
| Overall test | t on the single slope, equivalently F on 1 and n − 2 | F on k and n − k − 1 |
| Model comparison statistic | R² is adequate | adjusted R² or the partial F test |`,
      examTip: 'Error degrees of freedom are n minus the number of coefficients, counting the intercept. Two coefficients gives n − 2, three gives n − 3, and the exam distractor is always n − 1 or n. Write the three-line ledger — total n − 1, model k, error n − k − 1 — and check that it adds before entering any table.',
    },
    {
      id: 'reg-problems',
      title: '14. Problem Sets',
      content: `## 14.1 Problem Set A — fitting, inference and diagnostics

Every problem uses the calibration record of Section 8: ten points, n = 10,
sum x = 550, sum y = 320, sum xy = 21725, sum x² = 38500, sum y² = 12304.32,
with fitted line ŷ = 4.50 + 0.500x and SSE = 1.82.

**A1.** Compute Sxx, Sxy and the slope from the totals alone.
*Answer.* Sxx = 38500 − 550²/10 = 8250; Sxy = 21725 − (550)(320)/10 = 4125;
b = 4125/8250 = 0.500 mV/kPa.

**A2.** Predict the output at 45 kPa and state whether the prediction is an
interpolation or an extrapolation.
*Answer.* ŷ = 4.5 + 0.5(45) = 27.0 mV; 45 kPa lies inside the tested range of 10
to 100 kPa, so it is an interpolation and the fit supports it.

**A3.** Compute the residual standard deviation and the standard error of the
slope.
*Answer.* s² = 1.82/8 = 0.2275, s = 0.47697 mV;
se(b) = 0.47697/√8250 = 0.47697/90.8295 = 0.005251 mV/kPa.

**A4.** Give the 95 per cent confidence interval for the slope.
*Answer.* The two-sided 5 per cent critical value of Student-t on 8 degrees of
freedom is 2.306, so 0.500 ± 2.306(0.005251) = 0.500 ± 0.0121, giving
(0.4879, 0.5121) mV/kPa.

**A5.** At 20 kPa, compute the 95 per cent confidence interval for the mean
output and the 95 per cent prediction interval for one new unit.
*Answer.* ŷ = 14.50 mV. The leverage term is 0.1 + (20 − 55)²/8250 = 0.1 +
1225/8250 = 0.248485. Then s√0.248485 = 0.47697(0.49848) = 0.23776 and
s√1.248485 = 0.47697(1.11736) = 0.53295. Multiplying by 2.306 gives half-widths of
0.548 and 1.229, so the confidence interval is (13.95, 15.05) mV and the
prediction interval is (13.27, 15.73) mV.

**A6.** A colleague computes the standard error of the estimate as √(SSE/n).
What value do they get, and by what factor is it wrong?
*Answer.* √(1.82/10) = 0.42661 mV instead of 0.47697 mV, low by the factor
√(8/10) = 0.8944, an understatement of 10.6 per cent. The divisor must be n − 2
because two coefficients were fitted.

**A7.** The transducer's data sheet claims a sensitivity of 0.480 mV/kPa. Test
that claim against a two-sided alternative at the 5 per cent level.
*Answer.* t = (0.500 − 0.480)/0.005251 = 3.809 on 8 degrees of freedom, against a
critical 2.306. Reject: this unit is measurably more sensitive than the data
sheet says. Equivalently, 0.480 lies outside the interval found in A4.

**A8.** Which point in this calibration has the greatest influence on the slope,
and what is its leverage?
*Answer.* The two endpoints, at 10 and 100 kPa, tie at h = 0.1 + 2025/8250 =
0.3455, against an average leverage of 2/10 = 0.2. A 1 mV error at either
endpoint moves the slope by (1)(45)/8250 = 0.00545 mV/kPa, about one standard
error.

## 14.2 Problem Set B — transforms, confounding and multiple regression

Problems B1 through B4 use the twelve-feeder record of Section 11; B5 through B8
use the eight-coupon endurance record of Section 12.

**B1.** From the feeder totals Sxx = 68, Szz = 15 and Sxz = 30, compute the
correlation between arrester density and lightning density.
*Answer.* r = 30/√(68 × 15) = 30/31.937 = 0.9393. The two predictors are almost
interchangeable, which is why omitting one distorts the other so badly.

**B2.** Using the omitted-variable formula and the fitted partial effects
βX = −3 and βZ = +12, predict the slope a simple regression of Y on X alone
would return.
*Answer.* −3 + 12(30/68) = −3 + 5.2941 = 2.2941, which is exactly the naive slope
computed in Section 11.2.

**B3.** A third predictor is added to the feeder model and R² rises from 0.98077
to 0.98100. Compute the new adjusted R² and say whether the predictor earned its
place.
*Answer.* With k = 3 and n = 12, adjusted R² = 1 − (1 − 0.98100)(11/8) =
1 − 0.019(1.375) = 0.97388, against 0.97650 for the two-predictor model. Adjusted
R² FELL, so the predictor did not pay for its degree of freedom.

**B4.** State the error degrees of freedom for the one-, two- and
three-predictor feeder models.
*Answer.* n − k − 1 gives 10, 9 and 8 respectively. With twelve observations, an
eleven-predictor model would have zero error degrees of freedom, R² = 1, and no
usable standard errors at all.

**B5.** From the endurance fit ln t = 11.99664 − 0.499706V, estimate the median
life at 13.5 kV/mm.
*Answer.* ln t = 11.99664 − 0.499706(13.5) = 11.99664 − 6.74603 = 5.25061, so the
median life is e^5.25061 = 190.7 h.

**B6.** Convert the answer to B5 into an estimated MEAN life, given a fitted
log-scale variance of 0.141374.
*Answer.* The smearing factor is e^(0.141374/2) = e^0.070687 = 1.07325, so the
mean is 190.7 × 1.07325 = 204.6 h, 7.3 per cent above the median.

**B7.** The same model is asked for the life at 20 kV/mm. Compute it and say what
is wrong with quoting it.
*Answer.* ln t = 11.99664 − 9.99412 = 2.00252, so t = 7.41 h. The arithmetic is
correct and the number is not trustworthy: 20 kV/mm is five units beyond the
tested range, where a different breakdown mechanism is expected to dominate, and
nothing in the eight coupons demonstrates that the exponential law continues.

**B8.** Suppose all eight lifetimes had been recorded in minutes rather than
hours. Which of k, C, R² and the log-scale variance would change?
*Answer.* Only C, which is multiplied by 60. Adding a constant ln 60 to every
log-life shifts the intercept and leaves the slope, the residuals, the log-scale
variance and R² untouched — a useful check that a unit conversion has been done
correctly.`,
      examTip: 'Work the sums first, the coefficients second, the standard errors third and the intervals last, and never restart the chain from rounded intermediates. Carrying 0.5251 × 10⁻² rather than 0.005 through the interval arithmetic is the difference between an answer that matches a choice exactly and one that lands between two of them.',
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

**$t = (\\bar{x} - \\mu _{0}) / (s/\\sqrt{n})$**

- Degrees of freedom: df = n - 1
- Compare t to critical value from t-table at significance α

### Chi-Square Test (categorical data)

**$\\chi ^{2} = \\sum (O - E)^{2}/E$**

- O = observed frequency, E = expected frequency
- Compare χ² to critical value from chi-square table`,
      examTip: 'The most common FE exam mistake in hypothesis testing: "fail to reject H₀" does NOT mean "accept H₀." We never prove the null hypothesis — we only fail to find evidence against it. Also, a smaller p-value means stronger evidence against H₀.',
      importantNote: 'Moving the cutoff trades the two error rates against each other: lowering α raises β and vice versa. Escaping the trade means shrinking the standard error, and sample size is only the most obvious way to do that — reducing σ with better instrumentation, or removing a nuisance source of variation by pairing or blocking, lowers both error rates just as effectively and often more cheaply.',
    },
    {
      id: 'ht-confidence',
      title: '2. Confidence Intervals',
      content: `## 2.1 Constructing Confidence Intervals

A **confidence interval** estimates a population parameter:

**$CI = \\bar{x} \\pm t(\\alpha /2, n-1) \\cdot s/\\sqrt{n}$**

Where:
- x̄ is the sample mean
- s is the sample standard deviation
- n is the sample size
- t(α/2, n-1) is the t-critical value for confidence level (1-α)

### Common Confidence Levels

| Confidence Level | α | two-sided multiplier as n → ∞ (the z value) |
|---|---|---|
| 90% | 0.10 | 1.645 |
| 95% | 0.05 | 1.960 |
| 99% | 0.01 | 2.576 |

These are the limiting values the t-multiplier approaches as the degrees of
freedom grow. At any finite n the t-multiplier is larger — 2.262 rather than
1.960 at 9 degrees of freedom — and Section 9.2 tabulates the difference.

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
times in ten. Four levers raise power: a bigger true shift, a larger α (moving
the cutoff left, at the price of more false alarms), a larger n, and a smaller σ
— the last two both shrink SE, so both curves thin out and separate. Moving the
cutoff is a see-saw, trading α against β; anything that shrinks the standard
error lowers both ends at once, and sample size is not the only way to do that.
Better instrumentation, tighter fixturing, and the pairing of Section 10 all
attack σ directly, and are often cheaper than more measurements.`,
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

The duality is exact whenever the test and the interval use the SAME standard
error, which is why it holds without qualification for the one-sample t above.
It is not a universal law of testing: the ordinary test for a proportion puts
the null value p₀ inside its standard error while the Wald interval puts the
observed p̂ there, so the two can disagree near the boundary. Section 11.5 works
a case where they do.

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
| Two independent samples | different units in each group | x̄₁ − x̄₂ | pooled: n₁ + n₂ − 2; Welch fallback: smaller n − 1 |
| Paired | same units measured twice | mean of differences vs 0 | pairs − 1 |

The give-away words in an exam stem: "the same specimens were retested" means
paired; "two separate batches" means independent. The paired computation is
just a one-sample test on the differences, so no new formulas are involved —
only the recognition.`,
      examTip: 'If the same units are measured twice, difference first and run a one-sample test on the differences — df is pairs minus one. Treating paired data as two independent samples is the tested error, and it always UNDERSTATES the evidence.',
    },
    {
      id: 'ht-logic',
      title: '7. The Logic of a Test, Stated Precisely',
      content: `## 7.1 What is assumed before any data are looked at

A significance test is a conditional argument, and its conditions are easy to
lose sight of because they are agreed before the first number arrives. Three
things are fixed in advance.

First, a MODEL for how the data were generated: independent draws, a stated
distributional family, and a stated variance structure. Second, a NULL
HYPOTHESIS, which is a specific numerical claim inside that model — a mean equal
to 100 ohms, a difference of zero, counts that follow stated proportions. Third,
a TEST STATISTIC whose distribution is completely known when the null hypothesis
and the model are both true. Nothing about the data may influence any of those
three choices, because the whole calculation is about how surprising the data
are under an assumption made without seeing them.

That is why the alternative hypothesis has to be written down first as well. The
alternative decides which departures count as evidence, and therefore which tail
or tails the probability is taken from:

$$H_{0}: \\mu = \\mu_{0} \\qquad H_{1}: \\mu \\ne \\mu_{0} \\quad \\text{(two-sided)}$$

$$H_{0}: \\mu \\le \\mu_{0} \\qquad H_{1}: \\mu > \\mu_{0} \\quad \\text{(one-sided)}$$

The null always contains the equality, because the equality is what makes the
null distribution computable. An alternative chosen after seeing which direction
the data went is not a one-sided test; it is a two-sided test with its
significance level quietly doubled.

## 7.2 The three probabilities, defined once

Three probabilities run through the whole topic, and each is a probability of a
DATA event given a hypothesis, never the other way round:

$$\\alpha = P\\!\\left(\\text{reject } H_{0}\\;\\middle|\\;H_{0}\\ \\text{true}\\right)$$

$$\\beta(\\theta) = P\\!\\left(\\text{fail to reject } H_{0}\\;\\middle|\\;\\theta\\ \\text{true}\\right)$$

$$\\text{power}(\\theta) = 1-\\beta(\\theta) = P\\!\\left(\\text{reject } H_{0}\\;\\middle|\\;\\theta\\ \\text{true}\\right)$$

The significance level is a single number chosen by the analyst. The Type II
error rate and the power are FUNCTIONS of whatever the truth happens to be:
there is no such thing as "the power of a test" without naming an effect size,
and an exam stem that asks for power always supplies one.

The p-value is a fourth quantity, and it is not any of the three above:

$$p = P\\!\\left(\\left|T\\right| \\ge \\left|t_{\\mathrm{obs}}\\right|\\;\\middle|\\;H_{0}\\ \\text{true}\\right)$$

for a two-sided test, with the one-sided version dropping the absolute values.
It is the probability of data at least this extreme, computed in a world where
the null and the model both hold.

![The Student-t density on nine degrees of freedom, with the two tails beyond an observed statistic of 2.60 shaded. The shaded area is 0.0287, the two-tailed p-value; dashed lines at plus and minus 2.262 mark the five per cent cutoffs, which the observation lies outside.](/courses/fe-ee/figures/prob3-null-and-pvalue.svg)

## 7.3 What a rejection concludes, and what a failure to reject does not

Reject the null and the licensed statement is narrow and precise: the data are
improbable under the conjunction of the null hypothesis AND the model, at the
level chosen. Note the conjunction. A small p-value is evidence against the whole
package, and the model is part of the package. Non-independent observations, a
skewed distribution at small sample size, or an unnoticed drift will all produce
small p-values with a perfectly true null hypothesis, which is why residual and
design checks are not optional decoration.

Fail to reject and almost nothing has been concluded. The licensed statement is
that the data are compatible with the null value at this sample size. It is NOT
that the null is true, not that the effect is zero, and not that the effect is
negligible. Absence of evidence becomes evidence of absence only when the test
had enough power to have found the effect, and power is exactly what a
non-significant p-value does not report. The disciplined follow-up is always to
give the confidence interval: an interval running from −0.2 to +0.3 units says
the effect is small, while an interval running from −8 to +9 units says nothing
was learned at all, and both correspond to p greater than 0.05.

The test is sometimes described as proof by contradiction. The analogy is worth
having and worth distrusting in equal measure. In logic, a premise that implies a
false consequence is false. In testing, a hypothesis that implies an IMPROBABLE
consequence is merely suspect — and the argument runs backwards for the same
reason: improbable things happen at exactly the rate their probability says, so
one rejection in twenty is manufactured by the procedure itself when the null is
true.

## 7.4 Worked: one test carried through to a defensible sentence

Given a sample of 10 machined shims with mean thickness 2.043 mm and sample
standard deviation 0.052 mm, test whether the process mean differs from the
2.00 mm target at the 5 per cent level, and state the conclusion carefully.

**Assumptions.** Ten independent shims, thickness approximately normal, sigma
unknown and estimated from the sample. **Hypotheses.** H₀: μ = 2.00 against
H₁: μ ≠ 2.00, two-sided, because drift in either direction is out of
specification.

$$\\mathrm{SE} = \\frac{s}{\\sqrt{n}} = \\frac{0.052}{\\sqrt{10}} = \\frac{0.052}{3.1623} = 0.016445\\ \\mathrm{mm}$$

$$t = \\frac{\\bar{x}-\\mu_{0}}{\\mathrm{SE}} = \\frac{2.043-2.000}{0.016445} = \\frac{0.043}{0.016445} = 2.615$$

on n − 1 = 9 degrees of freedom. The two-sided 5 per cent critical value of
Student-t on 9 degrees of freedom, taking 2.5 per cent in each tail, is 2.262.
Since 2.615 exceeds it, **reject H₀**; the two-sided p-value is 0.0280.

The 95 per cent interval for the mean is
2.043 ± 2.262(0.016445) = 2.043 ± 0.0372, giving **(2.006, 2.080) mm**, and it
excludes the target, which is the same conclusion read the other way round.

**The sentence.** "The mean thickness of shims from this process differs from
2.00 mm; the data put the mean between 2.006 and 2.080 mm with 95 per cent
confidence, so the offset is somewhere between 6 and 80 micrometres." That last
clause is the part a decision can be made from. "The difference is statistically
significant" alone is not, because it does not say how big the difference is.

| Statement | Licensed? | Why |
|---|---|---|
| The data are unlikely if the mean is 2.00 mm | yes | that is what the p-value computes |
| The mean is between 2.006 and 2.080 mm, with 95% confidence | yes | that is the interval the same arithmetic produces |
| There is a 2.8% chance the mean is 2.00 mm | no | the p-value is conditioned on the null, not a probability of it |
| There is a 97.2% chance the effect is real | no | same error, complemented |
| The offset matters in service | no | that is an engineering judgement about 6 to 80 micrometres, not a statistical one |`,
      examTip: 'Write the hypotheses before computing anything, and write the alternative in the words of the stem. "Differs from" is two-sided; "exceeds", "is at least", "has dropped below" are one-sided. Choosing the tail after seeing the data doubles the true false-alarm rate, and the exam tests the distinction by putting both critical values among the choices.',
      importantNote: 'A small p-value is evidence against the conjunction of the null hypothesis and every modelling assumption behind the test — independence, the distributional family, and constant variance. Before concluding that the effect is real, confirm that the assumption that failed was not one of the others.',
    },
    {
      id: 'ht-power',
      title: '8. Type I and Type II Error, Power and Sample Size',
      content: `## 8.1 Deriving beta instead of quoting it

Take the cleanest case: a one-sided test of a mean with sigma known, so the null
distribution of the sample mean is exactly normal. The test rejects when the
sample mean exceeds a cutoff placed to leave alpha in the upper tail:

$$\\bar{x}^{*} = \\mu_{0} + z_{\\alpha}\\frac{\\sigma}{\\sqrt{n}}$$

If the truth is not the null value but $\\mu_{1} = \\mu_{0}+\\delta$, the sample
mean is still normal with the same standard error, centred delta higher. A Type
II error is a sample mean falling short of the cutoff:

$$\\beta = P\\!\\left(\\bar{X} < \\bar{x}^{*}\\;\\middle|\\;\\mu=\\mu_{1}\\right) = \\Phi\\!\\left(\\frac{\\bar{x}^{*}-\\mu_{1}}{\\sigma/\\sqrt{n}}\\right)$$

Substituting the cutoff and simplifying gives the form worth remembering, in
which the whole problem depends on one dimensionless group:

$$\\beta = \\Phi\\!\\left(z_{\\alpha} - \\frac{\\delta\\sqrt{n}}{\\sigma}\\right) \\qquad \\text{power} = 1-\\beta = \\Phi\\!\\left(\\frac{\\delta\\sqrt{n}}{\\sigma}-z_{\\alpha}\\right)$$

Everything about the design enters through $\\delta\\sqrt{n}/\\sigma$: the effect
size in standard-error units. Halving the noise and quadrupling the sample size
buy exactly the same power, which is a useful thing to know before ordering
either.

![Power of the one-sided thickness test drawn twice: against sample size, for true shifts of 0.05, 0.03 and 0.02 mm, showing that n equals 22 reaches 90 per cent for the largest shift; and against the true mean at fixed sample sizes of 25 and 9, where every curve passes through alpha equals 0.05 at the null value.](/courses/fe-ee/figures/prob3-power-curve.svg)

The right-hand panel makes a point the formula hides: the power curve passes
through alpha exactly at the null value, so a test always has SOME chance of
rejecting, and never has zero chance of missing an arbitrarily small real
effect. Power is a function of the truth, and quoting one number for it without
naming the effect size it belongs to is meaningless.

## 8.2 Worked: alpha, beta and power for a real effect size

Given a cable extrusion line whose insulation thickness has a known standard
deviation of 0.080 mm, tested against a nominal mean of 2.000 mm with a sample of
25 at the 5 per cent one-sided level, find the probability of missing a genuine
drift to 2.050 mm.

The standard error and the rejection cutoff are

$$\\frac{\\sigma}{\\sqrt{n}} = \\frac{0.080}{5} = 0.016\\ \\mathrm{mm}$$

$$\\bar{x}^{*} = 2.000 + 1.6449(0.016) = 2.000 + 0.026318 = 2.026318\\ \\mathrm{mm}$$

where 1.6449 is the standard normal value leaving 5 per cent in the upper tail.
If the true mean is 2.050, the standardised distance from the cutoff to the truth
is

$$z = \\frac{2.026318 - 2.050}{0.016} = \\frac{-0.023682}{0.016} = -1.4801$$

so that

$$\\beta = \\Phi(-1.4801) = 0.0694 \\qquad \\text{power} = 1-0.0694 = 0.9306$$

The test misses a 0.05 mm drift about 7 times in 100 and catches it about 93.

That analytic answer was checked by simulation rather than by re-deriving it.
Drawing **400,000 samples** of 25 from a normal population centred on 2.050 with
standard deviation 0.080 and applying the same cutoff, 93.083 per cent were
rejected, against the analytic 93.058 per cent — agreement to within the
simulation's own standard error of about 0.04 per cent. Repeating the exercise
with the population centred on the null value 2.000 rejected 5.040 per cent of
the time, confirming that the cutoff really does deliver its nominal 5 per cent
false-alarm rate.

## 8.3 Worked: the sample size for a target power

Given the same line and the same 0.05 mm drift, how many measurements are needed
for 90 per cent power at the 5 per cent one-sided level?

Set the power expression equal to the target and solve for n. Power equals
1 − beta when

$$\\frac{\\delta\\sqrt{n}}{\\sigma} - z_{\\alpha} = z_{\\beta} \\quad\\Longrightarrow\\quad n = \\left[\\frac{\\left(z_{\\alpha}+z_{\\beta}\\right)\\sigma}{\\delta}\\right]^{2}$$

With $z_{\\alpha} = 1.6449$ for 5 per cent in one tail and $z_{\\beta} = 1.2816$
for 10 per cent in one tail:

$$n = \\left[\\frac{(1.6449+1.2816)(0.080)}{0.050}\\right]^{2} = \\left[2.9265(1.6)\\right]^{2} = (4.6824)^{2} = 21.92$$

which **rounds UP to n = 22**; rounding down would deliver less power than
promised. Checking directly, n = 22 gives a cutoff of
2.000 + 1.6449(0.080/4.6904) = 2.028057 and a power of 0.9009, while n = 21
gives only 0.8886. The formula and the direct evaluation agree on which integer
is the first to clear the bar.

For a TWO-sided test at the same level the only change is the multiplier, from
$z_{0.05} = 1.6449$ to $z_{0.025} = 1.9600$:

$$n = \\left[\\frac{(1.9600+1.2816)(0.080)}{0.050}\\right]^{2} = (5.1864)^{2} = 26.90 \\rightarrow 27$$

Insisting on two-sidedness costs five extra measurements out of twenty-two, which
is the price of not having decided the direction in advance.

| Change to the design | Effect on power | Cost |
|---|---|---|
| Raise n by a factor of 4 | the effect size in SE units doubles | four times the measurement effort |
| Halve sigma (better instrument or fixturing) | same doubling | capital, or a slower method |
| Raise alpha from 0.05 to 0.10 | cutoff moves toward the null, power rises | twice as many false alarms |
| Pair the measurements (Section 10) | sigma of the DIFFERENCE collapses | none, if the design allows it |
| Chase a smaller effect delta | power falls with delta squared | nothing gained; the requirement changed |

Note what that table settles. Alpha and beta do trade against each other at
fixed n, but sample size is not the only lever that lowers both: reducing the
measurement noise, or removing a nuisance source of variation by pairing or
blocking, lowers both as well, and often more cheaply. The correct general
statement is that alpha and beta cannot both be reduced by moving the cutoff —
everything else about the experiment remains available.`,
      examTip: 'Every power and sample-size question reduces to the single group δ√n/σ. Write it, compare it with z_α, and the rest is a normal-table lookup. Sample sizes ALWAYS round up: 21.92 becomes 22, and the rounded-down 21 sits among the answer choices for anyone who reaches for the nearest integer.',
      importantNote: 'Power is a function of the effect size, not a property of the test. "This test has 80% power" is incomplete until the effect size, the significance level, the sample size and the standard deviation are all named.',
    },
    {
      id: 'ht-z-or-t',
      title: '9. Choosing Between z and t, and Where Critical Values Come From',
      content: `## 9.1 What you know decides the reference distribution

The test statistic for a mean always has the same shape — the estimate minus the
null value, divided by the standard error of the estimate. What changes is
whether the denominator is known or estimated:

$$z = \\frac{\\bar{x}-\\mu_{0}}{\\sigma/\\sqrt{n}} \\qquad t = \\frac{\\bar{x}-\\mu_{0}}{s/\\sqrt{n}}$$

If sigma is genuinely known — from a long calibration history, from a physical
argument, or because the exam says so — the numerator is normal, the denominator
is a constant, and the ratio is standard normal. If sigma has to be estimated
from the same small sample, the denominator is itself random, and the ratio
follows Student's t with n − 1 degrees of freedom:

$$T = \\frac{Z}{\\sqrt{V/\\nu}}, \\qquad Z \\sim N(0,1), \\qquad V \\sim \\chi^{2}_{\\nu}\\ \\text{independent of } Z$$

The extra randomness in the denominator makes extreme ratios more likely than the
normal allows, which is exactly why the t distribution has heavier tails and
larger critical values.

![Student-t densities against the standard normal at 4 and 15 degrees of freedom, and the two-sided five per cent critical value plotted against degrees of freedom, falling from 4.30 at two degrees of freedom toward the limiting normal value of 1.960.](/courses/fe-ee/figures/prob3-t-vs-z.svg)

As the degrees of freedom grow the estimate of sigma becomes reliable and the two
distributions merge:

$$\\lim_{\\nu\\to\\infty} t_{\\nu}(x) = \\phi(x)$$

The convergence is quick in the middle and slow in the tails, which is why the
usual rule of thumb — use z when n exceeds 30 — is a convenience rather than a
theorem. At 30 degrees of freedom the two-sided 5 per cent multiplier is 2.042
against the normal's 1.960, an error of 4 per cent in the width of every
interval; at 120 degrees of freedom it is 1.980, an error of 1 per cent.

## 9.2 Where the numbers in the table come from

Every critical value quoted in this chapter is defined by an area under a density
that can be written down explicitly. For Student's t on nu degrees of freedom,

$$f_{\\nu}(x) = \\frac{\\Gamma\\!\\left(\\frac{\\nu+1}{2}\\right)}{\\sqrt{\\nu\\pi}\\;\\Gamma\\!\\left(\\frac{\\nu}{2}\\right)}\\left(1+\\frac{x^{2}}{\\nu}\\right)^{-\\frac{\\nu+1}{2}}$$

and the two-sided 5 per cent critical value is the number c for which

$$\\int_{-c}^{c} f_{\\nu}(x)\\,dx = 0.95$$

Each value in the table below was obtained from the inverse distribution function
and then re-verified by integrating the density above between the stated limits;
every one returned 0.950000000 to nine decimal places. The convention throughout
this chapter is UPPER-TAIL area: t(0.975, ν) leaves 2.5 per cent above it, so a
symmetric interval built from it holds 95 per cent.

| ν | one tail 5%, t(0.95, ν) | two tails 5%, t(0.975, ν) | two tails 1%, t(0.995, ν) |
|---|---|---|---|
| 1 | 6.3138 | 12.7062 | 63.6567 |
| 2 | 2.9200 | 4.3027 | 9.9248 |
| 4 | 2.1318 | 2.7764 | 4.6041 |
| 8 | 1.8595 | 2.3060 | 3.3554 |
| 9 | 1.8331 | 2.2622 | 3.2498 |
| 10 | 1.8125 | 2.2281 | 3.1693 |
| 15 | 1.7531 | 2.1314 | 2.9467 |
| 18 | 1.7341 | 2.1009 | 2.8784 |
| 20 | 1.7247 | 2.0860 | 2.8453 |
| 30 | 1.6973 | 2.0423 | 2.7500 |
| 60 | 1.6706 | 2.0003 | 2.6603 |
| 120 | 1.6577 | 1.9799 | 2.6174 |
| ∞ (normal) | 1.6449 | 1.9600 | 2.5758 |

## 9.3 Worked: the same sample tested both ways

Given a sample of 12 relay operating times with mean 18.4 ms and sample standard
deviation 1.5 ms, test against a specification mean of 17.5 ms at the 5 per cent
two-sided level, first treating 1.5 ms as a known process sigma and then
treating it as an estimate.

The standard error is the same number either way:

$$\\mathrm{SE} = \\frac{1.5}{\\sqrt{12}} = \\frac{1.5}{3.4641} = 0.43301\\ \\mathrm{ms}$$

$$\\text{statistic} = \\frac{18.4-17.5}{0.43301} = \\frac{0.9}{0.43301} = 2.0785$$

**Treating sigma as known.** The reference value is z(0.975) = 1.9600. Since
2.0785 exceeds it, reject; the two-sided p-value is 0.0377.

**Treating sigma as estimated.** The reference value is t(0.975, 11) = 2.2010.
Now 2.0785 falls short, so fail to reject; the two-sided p-value is 0.0619.

Identical data, identical arithmetic, opposite conclusions — and the difference
is entirely a statement about what was known before the sample was taken. The
t-based answer is the honest one unless the process standard deviation really is
established independently, because with 12 observations the estimate of sigma
carries meaningful uncertainty of its own. The 95 per cent intervals show the
same thing: 18.4 ± 1.96(0.43301) = (17.55, 19.25) excludes 17.5, while
18.4 ± 2.2010(0.43301) = (17.45, 19.35) includes it.

| Situation described in the stem | Statistic | Reference distribution |
|---|---|---|
| Population sigma stated as known | z | standard normal |
| Sigma estimated from the sample, small n | t | Student-t, n − 1 df |
| Sigma estimated, n comfortably above 30 | t, approximated by z | difference under 4% |
| Two independent samples, variances pooled | t | Student-t, n₁ + n₂ − 2 df |
| Two independent samples, variances clearly unequal | Welch t | Student-t, fractional df; conservatively the smaller n − 1 |
| Paired measurements | t on the differences | Student-t, pairs − 1 df |

The fourth and fifth rows deserve a note, because they are the source of a
common inconsistency. When the two groups have equal size, the pooled and the
unpooled standard errors are algebraically identical, so the pooled degrees of
freedom n₁ + n₂ − 2 are the right ones to use. The conservative "smaller n − 1"
rule belongs to the Welch procedure with unequal sample sizes and unequal
variances, and using it where the pooled test applies simply throws away
degrees of freedom.`,
      examTip: 'The word "known" in a stem is doing real work: it selects z over t and changes the multiplier. If a problem gives you a sample standard deviation s and a sample size below about 30, it wants t with n − 1 degrees of freedom, and the z-based answer will be sitting among the choices as the near miss.',
    },
    {
      id: 'ht-paired',
      title: '10. Paired and Unpaired Designs on the Same Ten Splices',
      content: `## 10.1 The record

Ten fusion splices in an installed fibre run are measured for insertion loss,
re-polished, and measured again. Because the same ten splices appear in both
columns, the design is paired, and the whole record is:

| Splice | Before (dB) | After (dB) | d = before − after (dB) |
|---|---|---|---|
| 1 | 0.42 | 0.35 | 0.07 |
| 2 | 0.55 | 0.47 | 0.08 |
| 3 | 0.38 | 0.33 | 0.05 |
| 4 | 0.61 | 0.50 | 0.11 |
| 5 | 0.49 | 0.44 | 0.05 |
| 6 | 0.71 | 0.59 | 0.12 |
| 7 | 0.34 | 0.31 | 0.03 |
| 8 | 0.58 | 0.49 | 0.09 |
| 9 | 0.46 | 0.40 | 0.06 |
| 10 | 0.66 | 0.55 | 0.11 |
| mean | 0.5200 | 0.4430 | 0.0770 |

Two features of the record decide everything that follows. The splices differ
enormously among themselves — from 0.34 to 0.71 dB before the re-polish, a
two-fold range. And every single difference is positive.

## 10.2 Worked: the paired test

Given the difference column, test whether the re-polish changed insertion loss at
the 5 per cent level.

A paired test is a one-sample test performed on the differences, so the
hypotheses are about their mean: H₀: μ_d = 0 against H₁: μ_d ≠ 0. The sum of the
differences is 0.77, so d̄ = 0.0770 dB, and the corrected sum of squares is

$$S_{dd} = \\sum d_{i}^{2} - \\frac{\\left(\\sum d_{i}\\right)^{2}}{n} = 0.0675 - \\frac{0.5929}{10} = 0.0675 - 0.05929 = 0.00821$$

$$s_{d}^{2} = \\frac{0.00821}{9} = 0.00091222 \\qquad s_{d} = 0.030203\\ \\mathrm{dB}$$

$$\\mathrm{SE} = \\frac{0.030203}{\\sqrt{10}} = 0.0095510 \\qquad t = \\frac{0.0770}{0.0095510} = 8.062$$

on 9 degrees of freedom, against a two-sided 5 per cent critical value of 2.262.
**Reject decisively**; the p-value is 2.1 × 10⁻⁵. The 95 per cent interval for the
mean improvement is 0.0770 ± 2.262(0.0095510) = 0.0770 ± 0.0216, or
**(0.055, 0.099) dB** — which is the number a link budget can actually use.

## 10.3 Worked: the same twenty numbers as two independent groups

Given the same table, now analysed as though the "before" and "after" columns
came from two unrelated sets of splices, repeat the test.

The two sample standard deviations are s_before = 0.12238 dB and
s_after = 0.09440 dB, from corrected sums of squares of 0.1348 and 0.08021. The
pooled variance and the standard error of the difference of means are

$$s_{p}^{2} = \\frac{(n_{1}-1)s_{1}^{2}+(n_{2}-1)s_{2}^{2}}{n_{1}+n_{2}-2} = \\frac{0.1348+0.08021}{18} = 0.011945$$

$$\\mathrm{SE} = s_{p}\\sqrt{\\frac{1}{n_{1}}+\\frac{1}{n_{2}}} = 0.109293\\sqrt{0.2} = 0.048877\\ \\mathrm{dB}$$

$$t = \\frac{0.5200-0.4430}{0.048877} = \\frac{0.0770}{0.048877} = 1.575$$

on 18 degrees of freedom, against a critical 2.101. **Fail to reject**; the
p-value is 0.133, and the 95 per cent interval for the difference,
0.0770 ± 2.101(0.048877) = (−0.026, 0.180) dB, includes zero and is almost five
times wider than the paired one.

The point estimate is IDENTICAL in the two analyses — the difference of the means
always equals the mean of the differences — and the conclusions are opposite. The
standard error did all of the work: 0.0489 dB unpaired against 0.0096 dB paired,
a factor of 5.1.

![The ten splices with each before-and-after pair joined by a line, all ten falling; beside them the two reference distributions the same data support, a narrow one with standard error 0.0096 dB from the paired analysis and a broad one with standard error 0.0489 dB from the pooled analysis, against the observed difference of 0.077 dB.](/courses/fe-ee/figures/prob3-paired-vs-unpaired.svg)

## 10.4 Why pairing works, in one identity

The variance of a difference of two correlated measurements is

$$\\operatorname{Var}(B-A) = \\sigma_{B}^{2}+\\sigma_{A}^{2}-2\\rho\\,\\sigma_{B}\\sigma_{A}$$

and pairing is nothing more than the decision to let the correlation term work
for you. On these data the before-and-after readings correlate at r = 0.9944,
because a splice that starts poor stays comparatively poor. Substituting:

$$0.014978+0.008912-2(0.9944)(0.12238)(0.09440) = 0.023890-0.022978 = 0.000912$$

which reproduces the paired variance $s_{d}^{2} = 0.00091222$ to five decimal
places. The nuisance variation — the splice-to-splice differences that have
nothing to do with the re-polish — cancels inside each pair instead of being
counted as noise. That is the entire mechanism, and it costs nothing: no extra
measurements, only a decision about which units to measure twice.

The identity also shows when pairing is a bad idea. If the correlation were
negative, the differences would be MORE variable than the individual readings,
and the paired analysis would be worse than the pooled one. Pairing pays exactly
to the extent that the paired units resemble themselves.

## 10.5 A check that assumes nothing about normality

Both analyses above assumed normal populations. The paired conclusion can be
verified without that assumption by a permutation argument tailored to the
design. Under the null that the re-polish did nothing, the sign attached to each
difference is arbitrary, so every one of the 2¹⁰ = 1024 sign patterns is equally
likely. Enumerating **all 1024 patterns exactly** — no sampling involved — the
number producing a mean of magnitude at least 0.0770 dB is 2, namely the observed
all-positive pattern and its mirror image. The permutation p-value is therefore

$$p = \\frac{2}{1024} = 0.001953$$

which is the smallest value this test can return with ten pairs; the t-based
2.1 × 10⁻⁵ is below the resolution of the permutation test rather than in conflict
with it. Both say the same thing: an all-positive run of ten is not something
sign-flipping produces.

The unpaired analysis can be checked the same way, by enumerating all
$\\binom{20}{10} = 184{,}756$ ways of splitting the twenty readings into two
groups of ten. Of these, **25,356 gave a difference of means at least as large as
0.0770 dB**, for a permutation p-value of 0.1372 — in close agreement with the
0.1326 that Student's t gave, and confirming that the pooled analysis really does
fail to see the effect. The failure is not an artefact of the normal assumption;
it is what discarding the pairing costs.`,
      examTip: 'Look for the phrase that identifies the units: "the same specimens were retested", "before and after on each machine", "each operator measured both gauges" all mean paired, and the degrees of freedom are pairs minus one. Treating paired data as two independent samples always understates the evidence, and the unpaired t-value is always among the distractors.',
      importantNote: 'The difference of the two means always equals the mean of the differences, so the point estimate cannot tell you which analysis was used. Only the standard error and the degrees of freedom change — and they change the conclusion.',
    },
    {
      id: 'ht-proportions',
      title: '11. Tests and Intervals for Proportions',
      content: `## 11.1 The statistic, and where its standard error comes from

A count of defectives out of n independent units is binomial, with mean np and
variance np(1 − p). Dividing by n turns that into a statement about the sample
proportion:

$$E\\!\\left[\\hat{p}\\right] = p \\qquad \\operatorname{Var}\\!\\left(\\hat{p}\\right) = \\frac{p(1-p)}{n}$$

For a test, the null supplies the value of p, so the standard error is computed
at the NULL value rather than at the observed one — the calculation is being done
in a world where the null is true:

$$z = \\frac{\\hat{p}-p_{0}}{\\sqrt{\\dfrac{p_{0}(1-p_{0})}{n}}}$$

For an interval there is no null value to use, so the observed proportion is
substituted, and that substitution is the source of the trouble in Section 11.5.

## 11.2 Worked: one proportion against a supplier's claim

Given a lot of 400 relays from a supplier who claims no more than 2 per cent are
defective, of which 13 are found defective, test the claim at the 5 per cent
level against the alternative that the true rate exceeds 2 per cent.

$$\\hat{p} = \\frac{13}{400} = 0.0325 \\qquad \\mathrm{SE}_{0} = \\sqrt{\\frac{(0.02)(0.98)}{400}} = \\sqrt{0.000049} = 0.007$$

$$z = \\frac{0.0325-0.0200}{0.007} = \\frac{0.0125}{0.007} = 1.7857$$

The one-sided 5 per cent critical value is 1.6449, and 1.7857 exceeds it, so the
normal approximation rejects the claim; its p-value is 0.0371.

That answer should not be reported without a second look, because the borderline
is exactly where a discrete count is least well described by a continuous curve.
Two independent routes disagree with it:

| Route | p-value | Decision at 5% |
|---|---|---|
| Normal approximation, as computed above | 0.0371 | reject |
| Normal approximation with a continuity correction | 0.0540 | do not reject |
| Exact binomial, P(X ≥ 13) with n = 400, p = 0.02 | 0.0619 | do not reject |

The continuity correction subtracts half a unit from the count before
standardising, because the discrete value 13 stands for the continuous interval
from 12.5 to 13.5:

$$z_{c} = \\frac{13-0.5-8}{\\sqrt{400(0.02)(0.98)}} = \\frac{4.5}{\\sqrt{7.84}} = \\frac{4.5}{2.8} = 1.6071$$

and the exact figure comes from summing binomial terms, which needs no
approximation at all. The honest conclusion is that this lot does not clear the
5 per cent bar: the uncorrected normal approximation was optimistic by a factor
of 1.7 in the p-value, which is enough to flip the decision. The usual np ≥ 5
guideline was satisfied here — np₀ is 8 — and it still was not enough, because
the guideline governs the centre of the distribution and the test lives in the
tail.

## 11.3 Comparing two proportions

For two independent samples the difference of proportions has variance equal to
the sum of the two variances. Under a null of equality the common proportion is
unknown, so it is estimated by pooling both samples — the only place in this
chapter where the standard error uses data from both groups at once:

$$\\hat{p}_{\\text{pool}} = \\frac{x_{1}+x_{2}}{n_{1}+n_{2}}$$

$$z = \\frac{\\hat{p}_{1}-\\hat{p}_{2}}{\\sqrt{\\hat{p}_{\\text{pool}}\\left(1-\\hat{p}_{\\text{pool}}\\right)\\left(\\dfrac{1}{n_{1}}+\\dfrac{1}{n_{2}}\\right)}}$$

## 11.4 Worked: two production lines compared

Given 22 defectives out of 500 boards from line 1 and 10 out of 400 from line 2,
test whether the defect rates differ at the 5 per cent level.

$$\\hat{p}_{1} = \\frac{22}{500} = 0.0440 \\qquad \\hat{p}_{2} = \\frac{10}{400} = 0.0250$$

$$\\hat{p}_{\\text{pool}} = \\frac{32}{900} = 0.035556$$

$$\\mathrm{SE} = \\sqrt{0.035556(0.964444)(0.002+0.0025)} = \\sqrt{0.00015431} = 0.012422$$

$$z = \\frac{0.0440-0.0250}{0.012422} = \\frac{0.0190}{0.012422} = 1.5295$$

Against a two-sided critical value of 1.9600, **fail to reject**; the p-value is
0.126. The observed gap of 1.9 percentage points is not beyond what sampling
alone produces from samples of this size, and the 95 per cent interval for the
difference — computed from the UNpooled standard error of 0.012044, since there
is no null to pool under — is 0.0190 ± 1.96(0.012044), or (−0.0046, 0.0426). The
interval includes zero, consistent with the test, and it also shows that a real
difference as large as four percentage points has not been ruled out. Failing to
reject settled nothing about whether the lines differ.

## 11.5 A 95 per cent interval that is not 95 per cent

The textbook Wald interval substitutes the observed proportion into the standard
error:

$$\\hat{p} \\pm z_{1-\\alpha/2}\\sqrt{\\frac{\\hat{p}\\left(1-\\hat{p}\\right)}{n}}$$

and it systematically under-covers, badly so near the ends of the scale, because
the substituted variance is itself too small exactly when the observed proportion
is extreme. The Wilson interval instead inverts the test — it collects the values
of p that the test would NOT reject — and the algebra gives

$$\\frac{\\hat{p}+\\dfrac{z^{2}}{2n} \\pm z\\sqrt{\\dfrac{\\hat{p}(1-\\hat{p})}{n}+\\dfrac{z^{2}}{4n^{2}}}}{1+\\dfrac{z^{2}}{n}}$$

The difference is not academic. Coverage can be computed EXACTLY for a given n
and p, with no simulation, by enumerating all n + 1 possible counts, computing
each one's binomial probability, and adding the probabilities of those whose
interval happens to contain p:

| True p, with n = 40 | Wald exact coverage | Wilson exact coverage |
|---|---|---|
| 0.10 | 0.9145 | 0.9433 |
| 0.30 | 0.9299 | 0.9443 |
| 0.50 | 0.9193 | 0.9615 |

![Exact coverage of the Wald and Wilson 95 per cent intervals for a binomial proportion at n equal to 40, computed by enumerating all 41 possible counts at each true p. Wilson oscillates about the nominal 0.95 line; Wald sits below it almost everywhere, dropping under 0.86 at several points.](/courses/fe-ee/figures/prob3-wald-wilson.svg)

Both curves are sawtoothed, because the count is discrete and the interval jumps
as it moves from one integer to the next; no interval for a discrete quantity can
hold its nominal level exactly at every p. But the Wald interval is not merely
ragged, it is biased low — a nominal 95 per cent interval delivering 91 to 93 per
cent. For the 13-out-of-400 lot of Section 11.2 the two intervals are (0.0151,
0.0499) and (0.0191, 0.0548), and only the Wilson one is consistent with the
exact test's refusal to reject a true rate of 0.02.

That last observation is worth generalising. The exact duality between a
two-sided test and a confidence interval — reject if and only if the null value
falls outside — holds when the interval and the test use the SAME standard error.
The one-sample t of Section 4 satisfies that, so the duality is exact there. The
Wald interval does not, because the test uses the null proportion in its standard
error and the interval uses the observed one, and the duality breaks in
consequence.`,
      examTip: 'Use p₀ in the standard error for a TEST and p̂ in the standard error for an INTERVAL. That single difference is the most-missed step in proportion problems, and both versions of the answer will be among the choices. For two proportions, pool for the test and do not pool for the interval.',
    },
    {
      id: 'ht-chisquare',
      title: '12. Chi-Square: Goodness of Fit and Independence',
      content: `## 12.1 Where the statistic comes from

A count in a cell with expected value E has, under a Poisson or multinomial
model, a variance of roughly E. Standardising each cell and squaring gives a
quantity that behaves like a squared standard normal, and adding those across
cells gives the Pearson statistic:

$$\\chi^{2} = \\sum_{j=1}^{k}\\frac{\\left(O_{j}-E_{j}\\right)^{2}}{E_{j}}$$

Its null distribution is chi-square, whose degrees of freedom count the number of
independent ways the observed counts can differ from the expected ones. Start
with k cells, subtract one because the counts must total n, and subtract one more
for every parameter estimated from the same data to build the expected counts:

$$\\mathrm{df} = k - 1 - m$$

The chi-square family has a density of its own,

$$f_{k}(x) = \\frac{x^{k/2-1}e^{-x/2}}{2^{k/2}\\,\\Gamma\\!\\left(k/2\\right)}, \\qquad x>0$$

and every critical value quoted here was obtained from its inverse distribution
function and re-verified by integrating that density from zero to the value,
returning 0.95 to nine decimals.

![Chi-square densities for one, two, four and six degrees of freedom, with the upper five per cent cutoffs marked: 3.841, 5.991, 9.488 and 12.592. The density is strongly right-skewed at low degrees of freedom and becomes progressively more symmetric.](/courses/fe-ee/figures/prob3-chisq-densities.svg)

| df | upper 5% cutoff | upper 1% cutoff |
|---|---|---|
| 1 | 3.841 | 6.635 |
| 2 | 5.991 | 9.210 |
| 3 | 7.815 | 11.345 |
| 4 | 9.488 | 13.277 |
| 5 | 11.070 | 15.086 |
| 6 | 12.592 | 16.812 |

The test is always upper-tailed, whatever the alternative, because both kinds of
departure — too many in a cell and too few — make the squared numerator larger.

## 12.2 Worked: goodness of fit to a Poisson with an estimated mean

Given 60 weeks of protective-relay trip counts on one feeder — 22 weeks with no
trips, 18 with one, 12 with two, 6 with three and 2 with four — test whether
weekly trips follow a Poisson law at the 5 per cent level.

The Poisson mean is not supplied, so it is estimated from the same data, and that
estimate costs a degree of freedom. The total number of trips is
0(22) + 1(18) + 2(12) + 3(6) + 4(2) = 68, so

$$\\hat{\\lambda} = \\frac{68}{60} = 1.13333\\ \\text{trips per week}$$

Expected counts are 60 times the Poisson probabilities at that rate, with the
last cell taking everything from four upward so the probabilities total one:

| trips k | observed | P(k) | expected E |
|---|---|---|---|
| 0 | 22 | 0.321958 | 19.3175 |
| 1 | 18 | 0.364886 | 21.8932 |
| 2 | 12 | 0.206769 | 12.4061 |
| 3 | 6 | 0.078113 | 4.6868 |
| 4 or more | 2 | 0.028274 | 1.6965 |

The expected count in the last cell is 1.70, which breaches the usual
requirement that expected counts be at least about 5 — the chi-square
approximation to a discrete sum degrades badly when a denominator is that small.
The standard repair is to pool adjacent cells until the requirement is met, so
the last two rows are combined into "3 or more" with observed 8 and expected
6.3832. The statistic is then

$$\\chi^{2} = \\frac{(22-19.3175)^{2}}{19.3175}+\\frac{(18-21.8932)^{2}}{21.8932}+\\frac{(12-12.4061)^{2}}{12.4061}+\\frac{(8-6.3832)^{2}}{6.3832}$$

$$\\chi^{2} = 0.3725+0.6923+0.0133+0.4095 = 1.488$$

with df = 4 − 1 − 1 = 2: four cells after pooling, minus one for the total, minus
one for the estimated rate. The upper 5 per cent cutoff on 2 degrees of freedom
is 5.991, and 1.488 falls far short, so **fail to reject**; the p-value is 0.475.
Weekly trip counts are consistent with a Poisson process at 1.13 trips per week.

Note what that conclusion is and is not. It is not a demonstration that trips ARE
Poisson; with 60 weeks the test has limited power against modest departures. It
is a statement that this record gives no reason to abandon the Poisson model,
which is exactly the strength of evidence a goodness-of-fit test can supply.

Had the rate been specified in advance — by a design calculation rather than by
these data — the degrees of freedom would have been 4 − 1 = 3 and the cutoff
7.815. Forgetting to subtract for an estimated parameter makes the test too
conservative here and too liberal in other configurations, and it is the single
most common error in goodness-of-fit problems.

## 12.3 Independence in a contingency table

For a two-way table the null is that the row and column classifications are
independent, so each cell probability factorises into the product of its
marginals. Estimating those marginals from the table itself gives expected counts

$$E_{ij} = \\frac{R_{i}\\,C_{j}}{N}$$

and the degrees of freedom follow from the same accounting: rc cells, minus one
for the total, minus (r − 1) free row proportions, minus (c − 1) free column
proportions, leaving

$$\\mathrm{df} = rc-1-(r-1)-(c-1) = (r-1)(c-1)$$

## 12.4 Worked: two suppliers across three quality grades

Given 200 assemblies from each of two suppliers, graded pass, marginal or fail as
shown, test whether grade is independent of supplier at the 5 per cent level.

| | pass | marginal | fail | row total |
|---|---|---|---|---|
| Supplier A | 138 | 42 | 20 | 200 |
| Supplier B | 112 | 48 | 40 | 200 |
| column total | 250 | 90 | 60 | 400 |

The expected counts are the row total times the column total over the grand
total. Because both row totals are 200, both rows share the same expectations:
200(250)/400 = 125, 200(90)/400 = 45 and 200(60)/400 = 30. Then

$$\\chi^{2} = \\frac{13^{2}}{125}+\\frac{3^{2}}{45}+\\frac{10^{2}}{30}+\\frac{13^{2}}{125}+\\frac{3^{2}}{45}+\\frac{10^{2}}{30}$$

$$\\chi^{2} = 2(1.352)+2(0.2)+2(3.3333) = 9.771$$

with df = (2 − 1)(3 − 1) = 2. The cutoff is 5.991 and 9.771 exceeds it, so
**reject independence**; the p-value is 0.0076. Supplier B fails twice as often
in absolute count, and the cell contributions locate the effect: the fail column
contributes 6.67 of the 9.77, and the marginal column almost nothing.

The chi-square distribution is an asymptotic approximation to a discrete
distribution, so it is worth confirming. Generating **200,000 tables** at random
under exact independence — each row multinomially distributed over the three
grades using the observed column proportions, with both row totals held at 200 —
and computing the same statistic each time, 0.7415 per cent equalled or exceeded
9.771. The chi-square approximation gave 0.7557 per cent. The two agree to within
the simulation's own error, so the asymptotic p-value can be trusted here.

| Question being asked | Expected counts come from | Degrees of freedom |
|---|---|---|
| Do counts match stated proportions? | the stated proportions times n | k − 1 |
| Do counts follow a distribution with parameters estimated from the data? | the fitted distribution times n | k − 1 − m |
| Are two classifications independent? | row total times column total over N | (r − 1)(c − 1) |
| Are several groups homogeneous in their category proportions? | same formula as independence | (r − 1)(c − 1) |`,
      examTip: 'Degrees of freedom for goodness of fit are CATEGORIES minus one minus estimated parameters, never observations minus one. With 60 weeks of data in five categories the answer is 3, or 2 after pooling and estimating the rate — and 59 is always among the choices.',
      importantNote: 'Pool adjacent cells until every expected count is at least about 5, and recount the degrees of freedom afterwards using the number of cells you actually used. Pooling changes k, and therefore changes the cutoff.',
    },
    {
      id: 'ht-anova',
      title: '13. Analysis of Variance and the F Ratio',
      content: `## 13.1 Comparing three means without running three tests

Comparing three group means pairwise takes three tests, and Section 14.5 shows
what that does to the false-alarm rate. Analysis of variance asks the question
once: is the spread BETWEEN the group means larger than the spread WITHIN the
groups would lead you to expect?

Write the identity that makes this possible. For observation j in group i, split
its deviation from the grand mean into two pieces and square the sum:

$$y_{ij}-\\bar{y} = \\left(\\bar{y}_{i}-\\bar{y}\\right)+\\left(y_{ij}-\\bar{y}_{i}\\right)$$

Summing the squares over everything, the cross term vanishes because within each
group the deviations from that group's own mean sum to zero — the same
orthogonality that made the regression decomposition work. What remains is

$$\\underbrace{\\sum_{i}\\sum_{j}\\left(y_{ij}-\\bar{y}\\right)^{2}}_{\\mathrm{SST}} = \\underbrace{\\sum_{i}n_{i}\\left(\\bar{y}_{i}-\\bar{y}\\right)^{2}}_{\\mathrm{SSB}} + \\underbrace{\\sum_{i}\\sum_{j}\\left(y_{ij}-\\bar{y}_{i}\\right)^{2}}_{\\mathrm{SSW}}$$

Each sum of squares is divided by its own degrees of freedom to give a mean
square, and the ratio of the two mean squares is the test statistic:

$$\\mathrm{MSB} = \\frac{\\mathrm{SSB}}{k-1} \\qquad \\mathrm{MSW} = \\frac{\\mathrm{SSW}}{N-k} \\qquad F = \\frac{\\mathrm{MSB}}{\\mathrm{MSW}}$$

Under the null that all group means are equal, both mean squares estimate the
same error variance and their ratio is near one; when the means differ, only the
numerator is inflated. That is why the test is upper-tailed even though the
alternative is two-sided in every group.

## 13.2 The record

Five circuit boards from each of three assembly lines are pull-tested at a
solder joint, and the failure load is recorded in newtons:

| Line | Measurements (N) | Sum | Mean |
|---|---|---|---|
| A | 42, 45, 39, 44, 40 | 210 | 42 |
| B | 47, 50, 46, 49, 48 | 240 | 48 |
| C | 44, 41, 45, 43, 42 | 215 | 43 |
| all | fifteen values | 665 | 44.3333 |

## 13.3 Worked: the one-way analysis of variance

Given the fifteen measurements, test whether the three line means differ at the
5 per cent level.

The between-groups sum of squares weights each group's squared departure from the
grand mean by its size:

$$\\mathrm{SSB} = 5\\left[(42-44.3333)^{2}+(48-44.3333)^{2}+(43-44.3333)^{2}\\right] = 5(20.6667) = 103.33$$

The within-groups sum of squares adds the squared deviations inside each group:
line A gives 0 + 9 + 9 + 4 + 4 = 26, line B gives 1 + 4 + 4 + 1 + 0 = 10, and
line C gives 1 + 4 + 4 + 0 + 1 = 10, so SSW = 46.00. Their total is 149.33, which
matches the total sum of squares computed directly about the grand mean — the
decomposition identity, confirmed on the numbers.

| Source | Sum of squares | df | Mean square | F |
|---|---|---|---|---|
| Between lines | 103.33 | 2 | 51.667 | 13.478 |
| Within lines | 46.00 | 12 | 3.8333 | — |
| Total | 149.33 | 14 | — | — |

$$F = \\frac{51.667}{3.8333} = 13.478 \\qquad \\text{on } (k-1,\\ N-k) = (2,\\ 12) \\text{ degrees of freedom}$$

The upper 5 per cent point of the F distribution on 2 and 12 degrees of freedom
is 3.885, and 13.478 far exceeds it, so **reject**; the p-value is 0.00085. At
least one line differs, and the group means say which: line B is running about
5 to 6 newtons stronger than the other two.

![The fifteen pull-test measurements plotted by line, with heavy bars at the three group means of 42, 48 and 43 newtons and a dashed line at the grand mean of 44.33. The vertical distance from the dashed line to each bar is between-group spread; the distance from each bar to its points is within-group spread.](/courses/fe-ee/figures/prob3-anova-decomposition.svg)

Two checks on that result, neither of which repeats the formula. First, a
permutation test: reassigning the fifteen numbers to three groups of five at
random **100,000 times** and recomputing the ratio each time, 101 shuffles reached
an F of 13.478 or more, a rate of 0.00101 against the F-distribution's 0.00085 —
agreement to within the simulation's error at this many trials. Second,
the algebraic identity that ties this test back to Section 6: with only two
groups the F statistic is exactly the square of the two-sample t statistic.
Testing lines A and C alone gives a pooled standard deviation of 2.1213, a t of
−0.7454, and t² = 0.5556; the one-way analysis of those same ten numbers returns
F = 0.5556 exactly.

## 13.4 What the F test does not tell you

A significant F says the group means are not all equal. It does not say which
pair differs, and picking the largest gap after the fact and testing it with an
ordinary two-sample t is precisely the multiple-comparisons error of Section
14.5 — the gap was selected BECAUSE it was largest, so its null distribution is
not the one the ordinary test assumes. The correct follow-ups adjust for the
selection: Tukey's honest significant difference, Bonferroni-adjusted pairwise
tests, or contrasts specified before the data were seen.

| Assumption | What breaks if it fails | Cheap check |
|---|---|---|
| Independent observations | the whole F distribution | randomise run order; do not treat repeat readings on one board as separate boards |
| Equal variances across groups | F is distorted, badly with unequal group sizes | compare group standard deviations; here 2.55, 1.58 and 1.58 |
| Approximate normality within groups | matters mainly in small groups | residual plot; the permutation test above avoids the assumption entirely |
| Groups fixed in advance | selecting groups after seeing the data inflates F | state the comparison before collecting |`,
      examTip: 'The F ratio is always the between-groups mean square over the within-groups mean square, and its degrees of freedom are always (k − 1, N − k) in that order. Reversing them turns a critical value of 3.885 into 19.41, which is why both appear in the answer set.',
    },
    {
      id: 'ht-pvalues',
      title: '14. What a p-Value Is, and What It Is Not',
      content: `## 14.1 Under the null, p is uniform

The most useful single fact about p-values is that when the null hypothesis and
the model are both true, the p-value is uniformly distributed on the interval
from zero to one. The argument is one line. If the test statistic has a
continuous distribution with cumulative function F under the null, then for a
one-sided test $p = 1 - F(T)$, and the probability integral transform gives

$$P(p \\le q) = P\\!\\left(1-F(T)\\le q\\right) = P\\!\\left(F(T)\\ge 1-q\\right) = q$$

for every q between zero and one. So p ≤ 0.05 happens 5 per cent of the time,
p ≤ 0.01 happens 1 per cent of the time, and the significance level is not a
convention layered on top of the calculation — it IS the calculation.

![Cumulative distribution of the p-value for a one-sided z test, drawn exactly rather than simulated. Under the null the curve is the forty-five degree line, so p is uniform; for true shifts of one and of 2.93 standard errors the curves bow sharply upward, the latter passing through 0.90 at a threshold of 0.05.](/courses/fe-ee/figures/prob3-pvalue-uniform.svg)

The uniformity was also confirmed empirically, because it is the kind of claim
that deserves a check it cannot pass by construction. Drawing **200,000**
standard normal test statistics and converting each to a two-sided p-value gave
these tail proportions:

| threshold q | expected P(p ≤ q) | observed in 200,000 draws |
|---|---|---|
| 0.01 | 0.0100 | 0.01000 |
| 0.05 | 0.0500 | 0.04937 |
| 0.10 | 0.1000 | 0.09853 |
| 0.25 | 0.2500 | 0.24879 |
| 0.50 | 0.5000 | 0.49994 |
| 0.90 | 0.9000 | 0.89988 |

with a Kolmogorov-Smirnov distance from the uniform of 0.00225, which is what a
sample of this size produces from a genuinely uniform variable.

## 14.2 What a p-value is not

Every misreading in the list below has the same root: the p-value is a
probability about DATA given a hypothesis, and each error turns it into a
probability about the hypothesis given the data.

| Claim about p = 0.03 | Status | The quantity actually described |
|---|---|---|
| "There is a 3% chance the null is true" | false | that is a posterior probability, and it needs a prior |
| "There is a 97% chance the effect is real" | false | the same error, complemented |
| "The effect is large" | false | p mixes effect size with sample size; use the interval |
| "The result will replicate 97% of the time" | false | replication probability depends on the true effect and the new sample size |
| "Data this extreme occur 3% of the time when the null holds" | true | the definition |

The first two are quantitatively wrong, not merely loosely worded, and Bayes's
rule shows by how much. Write the prior probability that the null is true as
pi-nought. Among all experiments run, the fraction that are null and get rejected
is alpha times pi-nought, and the fraction that are non-null and get rejected is
the power times one minus pi-nought, so

$$P\\!\\left(H_{0}\\ \\text{true}\\;\\middle|\\;\\text{rejected}\\right) = \\frac{\\alpha\\,\\pi_{0}}{\\alpha\\,\\pi_{0}+\\left(1-\\beta\\right)\\left(1-\\pi_{0}\\right)}$$

## 14.3 What that posterior actually works out to

Take a field in which nine hypotheses out of ten tested are in fact null, tests
run at alpha = 0.05, and typical power of 0.80. Then

$$\\frac{0.05(0.9)}{0.05(0.9)+0.80(0.1)} = \\frac{0.045}{0.045+0.080} = \\frac{0.045}{0.125} = 0.360$$

so **36 per cent of the "significant" findings in that field are false alarms**,
even though every single test was run correctly at 5 per cent. Lower the power
to 0.35 with an even prior and the figure is
0.05(0.5)/[0.05(0.5)+0.35(0.5)] = 0.125; raise the power to 0.93 with an even
prior and it falls to 0.051. The false-discovery rate depends on the power and
on the plausibility of what is being tested, neither of which appears anywhere in
the p-value.

## 14.4 Worked: significance without importance, and importance without significance

Given a resistor process with a known standard deviation of 2.0 ohms and a
nominal mean of 100.0 ohms, examine two audits: one of 40,000 units with a sample
mean of 100.02 ohms, and one of 25 units with a sample mean of 100.5 ohms. Both
are tested two-sided at the 5 per cent level.

**The large audit.** The standard error is $2.0/\\sqrt{40000} = 0.010$ ohms, so

$$z = \\frac{100.02-100.00}{0.010} = 2.00 \\qquad p = 0.0455 \\quad \\text{(reject)}$$

The result is significant. The 95 per cent interval for the mean is
100.02 ± 1.96(0.010) = **(100.0004, 100.0396) ohms**, so the entire interval lies
within 0.04 ohms of nominal — four hundredths of one per cent of the value, and
far inside any sane tolerance band. The process offset has been established
beyond doubt AND shown to be irrelevant. Significance measured the evidence, not
the size.

**The small audit.** The standard error is $2.0/\\sqrt{25} = 0.400$ ohms, so

$$z = \\frac{100.5-100.0}{0.400} = 1.25 \\qquad p = 0.211 \\quad \\text{(fail to reject)}$$

Not significant — and the 95 per cent interval is
100.5 ± 1.96(0.400) = **(99.72, 101.28) ohms**, which is compatible with an offset
of well over one per cent. Here failing to reject established nothing at all: an
offset of engineering importance sits comfortably inside the interval. The
correct report is not "no difference" but "this audit was too small to say".

| Audit | n | p-value | Decision at 5% | 95% interval | Engineering reading |
|---|---|---|---|---|---|
| Large | 40,000 | 0.0455 | reject | (100.0004, 100.0396) | real, and negligible |
| Small | 25 | 0.211 | do not reject | (99.72, 101.28) | undetermined; could matter |

The interval answers the engineering question in both rows and the p-value
answers it in neither. That is the whole argument for reporting intervals
alongside tests, and it is why a well-written conclusion always states a
magnitude with its uncertainty rather than a verdict.

## 14.5 Twenty questions at 5 per cent each

Run one test at alpha and the false-alarm probability is alpha. Run m
independent tests, all with true nulls, and at least one false alarm becomes
likely:

$$P(\\text{at least one false rejection}) = 1-(1-\\alpha)^{m}$$

For twenty tests at 5 per cent that family-wise error rate is

$$1-(0.95)^{20} = 1-0.35849 = 0.6415$$

so a project that runs twenty comparisons and reports the significant ones has
about a **64 per cent chance of reporting at least one thing that is not there**.
Simulating **200,000 families** of twenty independent null tests produced at
least one rejection in 64.343 per cent of families, against the analytic 64.151
per cent.

The Bonferroni correction tests each hypothesis at alpha over m, which bounds the
family-wise rate at alpha regardless of dependence:

$$1-\\left(1-\\frac{\\alpha}{m}\\right)^{m} \\le \\alpha, \\qquad \\lim_{m\\to\\infty}\\left[1-\\left(1-\\frac{\\alpha}{m}\\right)^{m}\\right] = 1-e^{-\\alpha}$$

which for alpha = 0.05 approaches 0.04877 from above — always at or below the
nominal level, and never by much.

| Number of independent tests m | Uncorrected family-wise rate | Each test at 0.05/m |
|---|---|---|
| 1 | 0.0500 | 0.0500 |
| 2 | 0.0975 | 0.0494 |
| 5 | 0.2262 | 0.0490 |
| 10 | 0.4013 | 0.0489 |
| 20 | 0.6415 | 0.0488 |
| 50 | 0.9231 | 0.0488 |
| 100 | 0.9941 | 0.0488 |

![Family-wise error rate against the number of independent tests. Without correction the curve climbs from 0.05 to 0.99 by one hundred tests; with each test run at 0.05 divided by m it stays flat just below the nominal 0.05 line throughout.](/courses/fe-ee/figures/prob3-fwer.svg)

The cost of the correction is power: each individual test now needs a much
larger effect to clear its stricter threshold. That trade is the reason
practitioners distinguish confirmatory analyses, where the family is small and
declared in advance, from exploratory ones, where a great many comparisons are
made and the honest report is a list of leads rather than a list of findings.`,
      examTip: 'Two sentences are worth memorising verbatim. A p-value is the probability of data at least this extreme GIVEN the null hypothesis. A confidence interval, not a p-value, answers "how big is the effect". Every conceptual question in this topic is a rearrangement of those two.',
      importantNote: 'Statistical significance and practical significance are independent. A large enough sample makes any non-zero effect significant, and a small enough sample makes any effect non-significant. Report the interval, then decide with engineering judgement whether its endpoints matter.',
    },
    {
      id: 'ht-problems',
      title: '15. Problem Sets',
      content: `## 15.1 Problem Set A — tests, errors and power

**A1.** A sample of 25 castings has a mean hardness of 214 HB with a sample
standard deviation of 12 HB. Test against a specification mean of 208 HB,
two-sided, at the 5 per cent level.
*Answer.* SE = 12/√25 = 2.40; t = (214 − 208)/2.40 = 2.500 on 24 degrees of
freedom, against a critical 2.064. Reject: the mean hardness differs from
specification.

**A2.** Give the 95 per cent confidence interval for the mean in A1, and use it
to reach the same conclusion.
*Answer.* 214 ± 2.064(2.40) = 214 ± 4.95, or (209.05, 218.95) HB. The
specification value 208 lies outside, which is the same decision — the duality
holds exactly because the test and the interval use the same standard error.

**A3.** For a one-sided z test at α = 0.05 with σ = 4.0 and n = 16, compute the
power against a true shift of 3.0 units.
*Answer.* SE = 4.0/4 = 1.0; the cutoff is 1.6449 above the null; the standardised
distance is 3.0/1.0 − 1.6449 = 1.3551, so power = Φ(1.3551) = 0.912 and β = 0.088.

**A4.** How many observations would raise the power in A3 to 0.99?
*Answer.* n = [(z₀.₀₅ + z₀.₀₁)σ/δ]² = [(1.6449 + 2.3263)(4.0)/3.0]² =
(5.2949)² = 28.04, which rounds up to 29.

**A5.** A test at α = 0.05 fails to reject with a 95 per cent interval of
(−9.4, +11.2) units. What may be concluded?
*Answer.* Almost nothing. The interval is compatible with effects of ±10 units in
either direction, so the study lacked the power to resolve an effect that would
matter. The correct statement is that the experiment was uninformative, not that
the effect is zero.

**A6.** Explain why lowering α from 0.05 to 0.01 at fixed n necessarily raises β.
*Answer.* Lowering α moves the rejection cutoff further from the null, so fewer
samples land in the rejection region whatever the truth. That reduces the
rejection probability under the null (which is α) and equally under the
alternative (which is the power), so β = 1 − power rises. Only changes to n, to
σ, or to the design escape the trade.

**A7.** A colleague runs a two-sided test, sees the sample mean above the null,
and re-reports the result as a one-sided test to halve the p-value. What is the
true false-alarm rate of that procedure?
*Answer.* 0.05, not 0.025 — the direction was chosen after seeing the data, so
both tails remain available to produce a rejection. The reported significance
level is wrong by a factor of two.

## 15.2 Problem Set B — proportions, chi-square, ANOVA and multiplicity

**B1.** In 250 inspected welds, 18 are rejected. Test the claim that the true
reject rate is 5 per cent, two-sided at the 5 per cent level.
*Answer.* p̂ = 18/250 = 0.072; SE₀ = √(0.05 × 0.95/250) = √0.00019 = 0.013784;
z = (0.072 − 0.050)/0.013784 = 1.596. Against 1.960, fail to reject.

**B2.** Give the Wald 95 per cent interval for the weld reject rate in B1 and
explain why it is not the interval to trust.
*Answer.* 0.072 ± 1.96√(0.072 × 0.928/250) = 0.072 ± 1.96(0.016348) =
(0.0400, 0.1040). The Wald interval substitutes the observed proportion into the
standard error and under-covers systematically; the Wilson interval, which
inverts the test, is the better choice at this sample size and this proportion.

**B3.** Four categories of failure are expected in the ratio 4:3:2:1 out of 200
failures. The observed counts are 90, 52, 38 and 20. Test the ratio at the 5 per
cent level.
*Answer.* Expected counts are 80, 60, 40 and 20. The statistic is
100/80 + 64/60 + 4/40 + 0/20 = 1.250 + 1.0667 + 0.100 + 0 = 2.417 with df = 3
(no parameters estimated). The cutoff is 7.815, so fail to reject: the observed
counts are consistent with the stated ratio.

**B4.** A 3-by-4 contingency table is tested for independence. State the degrees
of freedom, and state them again for a goodness-of-fit test of the same twelve
cells against fully specified proportions.
*Answer.* Independence gives (3 − 1)(4 − 1) = 6. Goodness of fit against
specified proportions gives 12 − 1 = 11, because no marginals are estimated.

**B5.** An analysis of variance on four groups of six gives SSB = 84.0 and
SSW = 120.0. Complete the table and test at the 5 per cent level.
*Answer.* df are 3 and 20; MSB = 28.0, MSW = 6.0, F = 4.667 against
F(0.05; 3, 20) = 3.098. Reject: at least one group mean differs.

**B6.** In B5, what would F have been if the same sums of squares had come from
two groups of twelve?
*Answer.* df would be 1 and 22; MSB = 84.0, MSW = 5.4545, F = 15.40. The same
sums of squares tell a much stronger story when spread over fewer groups,
because the between-groups mean square carries fewer degrees of freedom.

**B7.** Twelve independent comparisons are each tested at α = 0.05, and all
twelve nulls are true. What is the probability of at least one rejection, and
what per-test level would hold that probability at 0.05?
*Answer.* 1 − 0.95¹² = 1 − 0.54036 = 0.4596, about 46 per cent. Bonferroni sets
each test at 0.05/12 = 0.004167, for a family-wise rate of
1 − (1 − 0.004167)¹² = 0.04888, which is at or below the nominal level.

**B8.** A study of 500,000 components reports that a coating raises mean life by
0.3 hours out of 5,000, with p = 0.001. Should the coating be adopted?
*Answer.* The p-value establishes that the 0.3-hour effect is real, not that it
is worth having: a 0.006 per cent improvement is almost certainly outweighed by
the cost of the coating. Significance is about evidence; adoption is a decision
about magnitude against cost, and it needs the interval and the price, not the
p-value.`,
      examTip: 'Under time pressure, write four things before computing: the hypotheses, the significance level, the statistic\'s formula, and the degrees of freedom. Three of the four determine which table row to read, and the most expensive mistakes in this topic — wrong tail, wrong df, wrong denominator — are all made before any arithmetic starts.',
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
