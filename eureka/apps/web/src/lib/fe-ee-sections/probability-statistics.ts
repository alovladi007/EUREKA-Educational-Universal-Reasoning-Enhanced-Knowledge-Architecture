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

- **Mean (average)**: μ = ΣX/n (population) or x̄ = ΣX/n (sample)
- **Median**: middle value when sorted; robust to outliers
- **Mode**: most frequent value

### Expected Value

For a discrete random variable: **$E[X] = \\Sigma x_{i}\\cdot P(x_{i})$**

Properties:
- E[aX + b] = a·E[X] + b
- E[X + Y] = E[X] + E[Y] (always, even if dependent)
- E[XY] = E[X]·E[Y] only if X, Y are independent

## 1.2 Measures of Spread

- **Variance**: σ² = E[(X - μ)²] = E[X²] - (E[X])²
- **Standard deviation**: σ = sqrt(σ²) (same units as data)
- **Sample variance**: s² = Σ(X - x̄)²/(n-1) (divide by n-1 for unbiased estimate)

| Measure | Population | Sample |
|---|---|---|
| Mean | $\\mu = \\Sigma X/N$ | $x = \\Sigma X/n$ |
| Variance | $\\sigma ^{2} = \\Sigma (X-\\mu)^{2}/N$ | $s^{2} = \\Sigma (X-x)^{2}/(n-1)$ |
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

Both distributions above average 5, yet one routinely produces 9s and 10s and
the other essentially never does. Tolerance, risk and margin questions are
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
