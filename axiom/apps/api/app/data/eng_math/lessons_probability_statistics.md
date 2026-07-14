# AXIOM Probability and Statistics: Complete Lessons

Course PS, 16 lessons across 6 units, in the AXIOM teaching arc.

---

## Unit 1. Probability Foundations

### PS01. Counting for probability

Objective: compute probabilities of equally likely outcomes by counting.

Build on: combinations and permutations (DM08); probability is where they
earn money.

Core idea: when outcomes are equally likely, probability is favorable count
over total count. The discipline is counting both numbers with the same
model: if order matters in the denominator, it matters in the numerator.

Worked example: probability of exactly two heads in three coin flips: 8 total
sequences, 3 favorable (HHT, HTH, THH): 3/8.

Try it: drawing 2 cards from 52, what is the probability both are hearts?

Answer: C(13, 2)/C(52, 2) = 78/1326 = 1/17.

Pitfall: mixing counting models between numerator and denominator (ordered
over unordered or the reverse). Pick one model, use it twice.

### PS02. Sample spaces and probability axioms

Objective: work with events, complements, and unions under the axioms.

Build on: set operations (DM05) with numbers attached.

Core idea: probabilities live on a sample space, are nonnegative, and sum to
one. Consequences do the daily work: P(not A) = 1 - P(A) (the complement
shortcut for at-least-one problems), and P(A or B) = P(A) + P(B) -
P(A and B): subtract the overlap or count it twice.

Worked example: P(at least one six in four dice rolls) = 1 - (5/6)^4, about
0.518: the complement turns four cases into one.

Try it: P(A) = 0.5, P(B) = 0.4, P(A and B) = 0.2: find P(A or B).

Answer: 0.7.

Pitfall: probabilities that do not normalize (PSM04): assigned chances
summing past one, or adding overlapping events without subtracting. The
axioms are the audit.

## Unit 2. Conditional Probability and Bayes

### PS03. Conditional probability and independence

Objective: compute conditional probabilities and test independence honestly.

Build on: PS02; conditioning shrinks the sample space.

Core idea: P(A given B) = P(A and B)/P(B): probability recomputed inside the
world where B happened. Independence means the condition changes nothing:
P(A given B) = P(A), equivalently P(A and B) = P(A) P(B): a property to
verify, not to assume. Independent trials also have no memory: past outcomes
do not bend future ones.

Worked example: two dice: P(sum 8 given first die is 3) = P(second is 5) =
1/6, versus unconditional P(sum 8) = 5/36.

Try it: a fair coin lands heads five times running. P(heads next)?

Answer: 1/2. The coin has no memory.

Pitfall: multiplying without checking independence (PSM02), and the
gambler's fallacy (PSM03): both are conditioning errors, one too little, one
too much.

### PS04. Bayes' theorem

Objective: invert conditional probabilities with base rates in view.

Build on: PS03; Bayes is conditioning run in reverse.

Core idea: P(A given B) = P(B given A) P(A) / P(B), where P(B) totals every
way B can happen. The engine of diagnostic reasoning: a test's accuracy is
P(positive given sick), but the patient needs P(sick given positive), and
when the condition is rare the two diverge wildly because false positives
from the healthy majority swamp true positives from the sick few.

Worked example: prevalence 1/1000, sensitivity and specificity 99 percent.
Of a million people: 990 true positives, 9990 false positives: P(sick given
positive) is about 9 percent, not 99. Diagnostic item PS-D1 is this
computation.

Try it: what quantity, always, must you multiply the likelihood by?

Answer: the prior (base rate), before normalizing.

Pitfall: confusion of the inverse (PSM01): equating P(A given B) with
P(B given A). Base rate neglect is the same error in field clothes, and the
template bank verifies its Bayes items by brute-force enumeration precisely
because humans get this wrong so reliably.

## Unit 3. Discrete Random Variables

### PS05. Discrete random variables and expectation

Objective: define distributions and compute expected values with linearity.

Build on: PS02; a random variable attaches numbers to outcomes.

Core idea: a discrete random variable has a probability for each value,
summing to one; the expectation E[X] = sum of value times probability is the
long-run average, the fair price of the game. Linearity, E[X + Y] =
E[X] + E[Y] with no independence needed, is the superpower: hard
expectations decompose into easy ones.

Worked example: a die: E = (1 + ... + 6)/6 = 3.5: a value the die never
shows, and exactly the average of many rolls.

Try it: a raffle pays 100 with probability 0.01, else 0. Fair ticket price?

Answer: E = 1.

Pitfall: expecting E[X] to be a possible value, and forgetting that
linearity survives dependence: both under-use the tool. E of a sum is the
sum of E, always.

### PS06. Variance and standard deviation

Objective: quantify spread and manipulate variance correctly.

Build on: PS05; variance is an expectation about the expectation.

Core idea: Var(X) = E[(X - mu)^2] = E[X^2] - (E[X])^2, and the standard
deviation is its square root, back in the original units. Scaling:
Var(aX) = a^2 Var(X). Adding: variances add only for independent variables:
Var(X + Y) = Var X + Var Y requires independence, unlike expectation's
unconditional linearity.

Worked example: X uniform on {0, 1, 2}: E = 1, E[X^2] = 5/3, Var = 2/3.
The template bank's expectation items verify both moments through
sympy.stats, a second code path.

Try it: Var(X) = 4. What is Var(3X)?

Answer: 36.

Pitfall: E[X^2] = (E[X])^2 (PSM05) would make every variance zero; and
adding variances of dependent variables misprices risk, which in finance is
not an academic remark.

### PS07. Binomial and geometric distributions

Objective: model repeated independent trials for success counts and waiting
times.

Build on: PS03's independence and PS01's counting.

Core idea: n independent trials with success probability p: the number of
successes is Binomial(n, p) with P(X = k) = C(n, k) p^k (1 - p)^(n - k),
mean np, variance np(1 - p). The waiting time to the first success is
geometric: P(X = k) = (1 - p)^(k - 1) p, mean 1/p. Recognizing the model in
a word problem is the skill; the formulas are lookup.

Worked example: 5 shots at p = 0.8: P(exactly 4) = C(5, 4)(0.8)^4(0.2) =
0.41.

Try it: fair die: expected rolls until the first six?

Answer: 6, the geometric mean 1/p.

Pitfall: applying the binomial when trials are dependent or p drifts
(drawing without replacement is the classic): the independence assumption is
part of the model, not scenery.

### PS08. Poisson distribution

Objective: model counts of rare events at a known rate.

Build on: PS07; Poisson is the binomial's limit for many trials, tiny p.

Core idea: events at average rate lambda per interval, occurring
independently: the count is Poisson with P(X = k) = e^(-lambda) lambda^k /
k!, mean and variance both lambda. Defects per wafer, calls per minute,
particles per detector window: whenever n is huge and p is tiny with np
moderate, Poisson is the model.

Worked example: flaws at lambda = 2 per panel: P(0) = e^(-2), about 0.135;
P(at most 1) = e^(-2)(1 + 2), about 0.406.

Try it: lambda = 3: what are the mean and variance?

Answer: both 3; their equality is the Poisson signature.

Pitfall: using Poisson when events cluster or inhibit each other
(independence fails), and forgetting to rescale lambda when the interval
changes: a rate per hour is not a rate per shift.

## Unit 4. Continuous Random Variables

### PS09. Continuous random variables

Objective: work with densities, where probability is area.

Build on: C118; the FTC is the bridge between density and probability.

Core idea: a continuous variable has a density f(x) >= 0 integrating to one;
P(a < X < b) is the area under f between a and b, and P(X = any exact value)
is zero. The cumulative distribution F(x) = P(X <= x) accumulates the
density, and F' = f: the FTC wearing probability clothes.

Worked example: uniform on [0, 10]: density 1/10, so P(2 < X < 5) = 0.3.

Try it: for that uniform variable, what is P(X = 5) exactly?

Answer: zero; single points carry no area.

Pitfall: reading the density value as a probability (densities can exceed
1). Only areas are probabilities; f(x) alone is a rate.

### PS10. The normal distribution

Objective: standardize normal variables and compute with z-scores.

Build on: PS09; the normal is the continuous distribution.

Core idea: Normal(mu, sigma) is the bell curve centered at mu with spread
sigma. Every normal question standardizes: z = (x - mu)/sigma counts
standard deviations from the mean, and P(X < x) = Phi(z), the standard
normal cdf. The empirical rule for orientation: about 68, 95, 99.7 percent
within 1, 2, 3 sigmas.

Worked example: scores Normal(70, 10): P(X < 85) = Phi(1.5), about 0.933.

Try it: same distribution: the z-score of 55?

Answer: -1.5.

Pitfall: dividing before subtracting, or dropping the sign of z. The z-score
is a signed distance in sigma units, and the template's verifier checks the
cdf identity exactly.

### PS11. The central limit theorem

Objective: state what the CLT does and does not promise.

Build on: PS10; the CLT is why the normal is everywhere.

Core idea: sums and averages of many independent, comparable contributions
are approximately normal, whatever the individual distribution: measurement
noise, sample means, aggregate demand. The promises have fine print:
independence, finite variance, and enough terms: a mean of five wildly
skewed values is not normal yet, and heavy-tailed inputs break the theorem
outright.

Worked example: a single die is flat; the sum of 30 dice histograms into a
clean bell: the theorem visible in one simulation.

Try it: sample mean of n = 100 draws with sigma = 10: the standard deviation
of the mean is?

Answer: 1: sigma over sqrt(n), the CLT's scaling.

Pitfall: normality everywhere (PSM10): invoking the CLT for n = 6 or for
distributions without finite variance. The theorem has hypotheses, and
finance's fat tails are the famous casualty.

## Unit 5. Sampling and Estimation

### PS12. Descriptive statistics

Objective: summarize data with center, spread, and quantiles, honestly.

Build on: PS05's expectation, now computed from data.

Core idea: mean and median measure center (the median resists outliers, the
mean does not); standard deviation and IQR measure spread with the same
contrast. A five-number summary and a histogram beat any single number:
skew, outliers, and bimodality are visible, not computable from the mean
alone.

Worked example: incomes 30, 35, 40, 45, 400 (thousands): mean 110, median
40. One outlier moved the mean by a factor of 2.75 and the median not at
all.

Try it: which summary pair suits skewed data?

Answer: median and IQR.

Pitfall: reporting a mean without spread, or on skewed data without the
median beside it: technically true numbers arranged to mislead.

### PS13. Sampling distributions and standard error

Objective: treat a statistic as a random variable and use its standard
error.

Build on: PS11; the sampling distribution is where the CLT points.

Core idea: a statistic computed from a random sample is itself random:
repeat the sampling, the statistic varies. Its distribution is the sampling
distribution, and its standard deviation is the standard error: for the
mean, SE = sigma/sqrt(n). SD describes individuals; SE describes the
estimate: the distinction all of inference rests on.

Worked example: heights with sigma = 8 cm: one person varies by 8; the mean
of a sample of 64 varies by 1. Quadrupling the sample halves the SE:
precision is bought at a square-root price.

Try it: sigma = 12, n = 36: the SE of the mean?

Answer: 2.

Pitfall: SD-SE conflation (PSM06): quoting individual spread as the
uncertainty of an average, or the reverse. Ask which random thing you are
describing: a person, or an estimate.

## Unit 6. Inference and Regression

### PS14. Confidence intervals

Objective: build interval estimates and interpret them with discipline.

Build on: PS13; the interval is the estimate plus and minus its sampled
uncertainty.

Core idea: a 95 percent confidence interval, mean plus or minus about 2 SE,
comes from a procedure that captures the true parameter in 95 percent of
repeated samples. The confidence lives in the procedure, not in any one
realized interval: once computed, the parameter is in it or not, and no
probability attaches to the finished interval.

Worked example: sample mean 50, SE 2: the 95 percent CI is about (46, 54).
Wanting (48, 52) instead means quadrupling n, per PS13's square-root law.

Try it: what does halving the CI width cost in sample size?

Answer: four times the sample.

Pitfall: reading 95 percent as the chance the parameter is inside this
interval (PSM07). The subtlety is real, examiners love it, and the
misreading leads to overconfident decisions downstream.

### PS15. Hypothesis testing

Objective: run tests with null and alternative hypotheses and read p-values
correctly.

Build on: PS13 and PS14; testing is estimation with a decision bolted on.

Core idea: assume the null hypothesis, compute how surprising the data would
be under it: that tail probability is the p-value. Small p (below a
pre-chosen alpha) rejects the null. The p-value is P(data this extreme given
the null), never P(null given data): converting one to the other requires
Bayes and a prior (PS04 again). Two error types trade off: rejecting a true
null (Type I, rate alpha) and missing a false one (Type II).

Worked example: coin flipped 100 times, 61 heads: under fairness that is
about 2.2 SE out, p around 0.03: reject fairness at alpha = 0.05, and
diagnostic item PS-D2 asks what that 0.03 means.

Try it: p = 0.20 at alpha = 0.05: the decision?

Answer: fail to reject the null: which is not proof the null is true.

Pitfall: p-value as the probability the null is true (PSM08), and treating
statistical significance as practical importance: with n huge, trivial
effects turn significant.

### PS16. Correlation and linear regression

Objective: fit least-squares lines, read r and r-squared, and respect the
limits of both.

Build on: least squares from linear algebra (LA24) and PS06's variance;
regression is where they meet data.

Core idea: the least-squares line minimizes squared vertical errors: the
normal equations of LA24 with statistics vocabulary. Correlation r in
[-1, 1] measures linear association strength and direction; r-squared is
the fraction of variance the line explains. What none of them measure is
causation: association can flow from confounders, reverse causality, or
coincidence, and only design (randomization, controls) sorts them.

Worked example: points (0, 1), (1, 1), (2, 3): the fit y = x + 2/3 from the
LA24 lesson, now with r about 0.87: strong, positive, and silent about why.

Try it: ice cream sales correlate with drowning deaths. The likely
structure?

Answer: a confounder (summer) drives both; neither causes the other.

Pitfall: correlation implies causation (PSM09), the most consequential
misconception in the course, and extrapolating a fitted line far outside
the data: the line knows nothing out there.
