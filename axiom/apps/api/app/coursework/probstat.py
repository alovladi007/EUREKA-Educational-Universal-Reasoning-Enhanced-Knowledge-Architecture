"""Coursework: Probability & Statistics nodes PS01-PS16 + the PROB survey.

Five steps per lesson: two readings, a worked example, pitfalls, check.
"""

L = "reading"
E = "example"
P = "pitfall"
K = "check"

LESSONS: dict[str, dict] = {
    # ------------------------------------------------------------------
    "PS01": {
        "summary": "Counting for probability: equally likely outcomes, and permutations/combinations in probability form.",
        "steps": [
            (L, "Probability as counting", (
                "When all outcomes are equally likely,\n"
                "$$P(A) = \\frac{\\#(\\text{outcomes in } A)}{\\#(\\text{all outcomes})}.$$\n\n"
                "Everything from DM07-DM08 transfers: the product rule counts staged outcomes, "
                "$\\binom n r$ counts unordered selections, and the whole art is counting numerator and "
                "denominator THE SAME WAY (both ordered, or both unordered)."
            )),
            (L, "Consistency of counting", (
                "The classic setup: draw 5 cards from 52. Two valid accountings of $P(\\text{all hearts})$:\n\n"
                "• Unordered: $\\dfrac{\\binom{13}{5}}{\\binom{52}{5}}$.\n"
                "• Ordered (sequential): $\\dfrac{13}{52} \\cdot \\dfrac{12}{51} \\cdot \\dfrac{11}{50} \\cdot "
                "\\dfrac{10}{49} \\cdot \\dfrac{9}{48}$.\n\n"
                "Same number. Mixing conventions — ordered on top, unordered below — is the classic wrong "
                "answer. 'At least one' problems again go by complement: "
                "$P(\\text{at least one}) = 1 - P(\\text{none})$."
            )),
            (E, "Worked example", (
                "The birthday problem: probability two of 23 people share a birthday (365 days, uniform).\n\n"
                "Complement — all 23 birthdays distinct:\n"
                "$$P(\\text{none shared}) = \\frac{365}{365} \\cdot \\frac{364}{365} \\cdots \\frac{343}{365} "
                "\\approx 0.4927.$$\n\n"
                "So $P(\\text{shared}) \\approx 0.507$ — better than a coin flip at just 23 people. The "
                "surprise dissolves once you count PAIRS: $\\binom{23}{2} = 253$ chances to collide."
            )),
            (P, "Pitfalls", (
                "1. Mixed conventions: ordered numerator over unordered denominator (or vice versa).\n\n"
                "2. Assuming equal likelihood where it fails — 'two children, at least one boy' problems "
                "hinge on the exact sample space.\n\n"
                "3. 'At least one' by direct casework instead of $1 - P(\\text{none})$.\n\n"
                "4. Double-counting overlapping favorable outcomes (inclusion-exclusion applies inside "
                "probability too).\n\n"
                "5. Sample spaces that aren't what the problem says: dice SUMS are not equally likely even "
                "though dice FACES are."
            )),
            (K, "Check yourself", (
                "You should be able to: build the right sample space, count numerator and denominator "
                "consistently, and deploy the complement on 'at least one.'\n\n"
                "Self-test: probability a 5-card hand contains all four aces? "
                "($\\binom{48}{1} / \\binom{52}{5} = 48/2{,}598{,}960 \\approx 1.8 \\times 10^{-5}$.)\n\n"
                "Practice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PS02": {
        "summary": "Sample spaces and the probability axioms: events, complement and union rules.",
        "steps": [
            (L, "Sample spaces and events", (
                "The sample space $S$ is the set of ALL possible outcomes; an event is any subset. The axioms:\n\n"
                "1. $0 \\le P(A) \\le 1$ for every event $A$.\n"
                "2. $P(S) = 1$.\n"
                "3. For DISJOINT events, probabilities add: $P(A \\cup B) = P(A) + P(B)$.\n\n"
                "Everything else is a theorem. Complement rule: $P(\\overline A) = 1 - P(A)$. Monotonicity: "
                "$A \\subseteq B \\Rightarrow P(A) \\le P(B)$."
            )),
            (L, "The general union rule", (
                "When events overlap, addition double-counts the intersection:\n"
                "$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$\n"
                "— inclusion-exclusion (DM09) with probabilities in place of counts.\n\n"
                "Vocabulary that matters: DISJOINT (mutually exclusive, $A \\cap B = \\emptyset$) means "
                "'can't both happen'; INDEPENDENT (PS03) means 'one doesn't inform the other.' They are "
                "nearly opposites — disjoint events with positive probability are always DEPENDENT (seeing "
                "one tells you the other didn't happen)."
            )),
            (E, "Worked example", (
                "A card is drawn from 52. $A$ = heart, $B$ = face card (J, Q, K).\n\n"
                "$$P(A \\cup B) = \\frac{13}{52} + \\frac{12}{52} - \\frac{3}{52} = \\frac{22}{52} = \\frac{11}{26}.$$\n\n"
                "The subtraction removes the three face-hearts counted twice. Check by direct count: 13 hearts "
                "plus the 9 non-heart face cards $= 22$ ✓."
            )),
            (P, "Pitfalls", (
                "1. $P(A \\cup B) = P(A) + P(B)$ without checking disjointness.\n\n"
                "2. Conflating disjoint with independent — they are incompatible for positive-probability "
                "events.\n\n"
                "3. Probabilities exceeding 1 in intermediate work — always a modeling error, never round-off.\n\n"
                "4. Forgetting the complement rule and grinding out long direct computations.\n\n"
                "5. Events that aren't subsets of the declared sample space (mixing 'draw one card' language "
                "with 'draw two' events)."
            )),
            (K, "Check yourself", (
                "You should be able to: state the axioms, derive and use the complement and general-union "
                "rules, and distinguish disjoint from independent on sight.\n\n"
                "Self-test: $P(A) = 0.6$, $P(B) = 0.5$, $P(A \\cup B) = 0.8$. Find $P(A \\cap B)$. "
                "($0.6 + 0.5 - 0.8 = 0.3$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PS03": {
        "summary": "Conditional probability and independence: updating on information, and the multiplication rule.",
        "steps": [
            (L, "Conditioning", (
                "The probability of $A$ GIVEN that $B$ happened:\n"
                "$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} \\qquad (P(B) > 0).$$\n\n"
                "Conditioning SHRINKS the sample space to $B$ and renormalizes. Rearranged, it's the "
                "multiplication rule: $P(A \\cap B) = P(B)\\, P(A \\mid B)$ — the engine behind tree diagrams "
                "and sequential experiments (draw without replacement, etc.)."
            )),
            (L, "Independence", (
                "$A$ and $B$ are independent when knowing one changes nothing:\n"
                "$$P(A \\mid B) = P(A) \\iff P(A \\cap B) = P(A)\\,P(B).$$\n\n"
                "Independence is an ASSUMPTION to justify or a property to VERIFY — never a default. Coin "
                "flips: independent. Draws without replacement: dependent. 'Two events I haven't thought "
                "about': unknown until checked.\n\n"
                "The law of total probability stitches conditionals together: if $B_1, \\ldots, B_n$ "
                "partition $S$,\n"
                "$$P(A) = \\sum_i P(B_i)\\, P(A \\mid B_i).$$"
            )),
            (E, "Worked example", (
                "Two cards drawn without replacement. $P(\\text{both aces})$?\n\n"
                "Multiplication rule: $P(A_1)\\,P(A_2 \\mid A_1) = \\frac{4}{52} \\cdot \\frac{3}{51} = "
                "\\frac{12}{2652} = \\frac{1}{221}$.\n\n"
                "Independence check: is 'first card red' independent of 'first card is a heart'? "
                "$P(\\text{heart}) = \\frac14$, but $P(\\text{heart} \\mid \\text{red}) = \\frac12$ — "
                "DEPENDENT. The formula, not intuition, is the referee."
            )),
            (P, "Pitfalls", (
                "1. Confusing $P(A \\mid B)$ with $P(B \\mid A)$ — the transposition error that PS04 exists "
                "to fix; they can differ wildly.\n\n"
                "2. Assuming independence for convenience (defective items in the same batch, weather on "
                "consecutive days).\n\n"
                "3. Conditioning on an event of probability 0.\n\n"
                "4. Multiplying unconditional probabilities for sequential dependent draws "
                "($\\frac{4}{52} \\cdot \\frac{4}{52}$ for two aces without replacement).\n\n"
                "5. Partition errors in total probability — the $B_i$ must be exhaustive AND disjoint."
            )),
            (K, "Check yourself", (
                "You should be able to: compute conditionals from the definition, test independence "
                "numerically, chain the multiplication rule, and apply total probability over a partition.\n\n"
                "Self-test: a family has two children (BB, BG, GB, GG equally likely). Given at least one "
                "boy, what's $P(\\text{two boys})$? ($\\frac{1/4}{3/4} = \\frac13$ — not $\\frac12$.)\n\n"
                "Practice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PS04": {
        "summary": "Bayes' theorem: inverting conditionals, priors and posteriors, and the base-rate effect.",
        "steps": [
            (L, "The theorem", (
                "Bayes' theorem inverts a conditional:\n"
                "$$P(B \\mid A) = \\frac{P(A \\mid B)\\, P(B)}{P(A)} "
                "= \\frac{P(A \\mid B)\\, P(B)}{P(A \\mid B) P(B) + P(A \\mid \\overline B) P(\\overline B)},$$\n"
                "the denominator expanded by total probability.\n\n"
                "The vocabulary: $P(B)$ is the PRIOR (belief before evidence), $P(A \\mid B)$ the LIKELIHOOD "
                "(how well $B$ explains the evidence), $P(B \\mid A)$ the POSTERIOR (belief after). Bayes is "
                "the arithmetic of learning from evidence."
            )),
            (L, "Base rates dominate", (
                "When the prior is small, even accurate evidence leaves the posterior modest — the BASE-RATE "
                "effect. A 99%-accurate test for a 1-in-1000 condition still yields mostly false positives, "
                "because the healthy population is a thousand times larger than the sick one.\n\n"
                "The reliable way to compute: NATURAL FREQUENCIES. Imagine 100,000 people, split by the "
                "prior, apply the test to each group, and read the posterior off the counts. Same math, "
                "far fewer errors than plugging into the formula."
            )),
            (E, "Worked example", (
                "Disease prevalence 0.1%; test sensitivity 99% ($P(+ \\mid D) = 0.99$); false-positive rate "
                "5% ($P(+ \\mid \\overline D) = 0.05$). You test positive — $P(D \\mid +)$?\n\n"
                "Out of 100,000 people: 100 have the disease → 99 true positives. 99,900 don't → "
                "$0.05 \\times 99{,}900 = 4995$ false positives.\n\n"
                "$$P(D \\mid +) = \\frac{99}{99 + 4995} \\approx 0.019 \\;\\; (\\approx 2\\%).$$\n\n"
                "A positive result from a 99%-sensitive test leaves a 98% chance of health — the prior did "
                "that."
            )),
            (P, "Pitfalls", (
                "1. The transposition fallacy: reporting $P(+ \\mid D)$ as if it were $P(D \\mid +)$ — the "
                "prosecutor's fallacy in court, the base-rate fallacy in medicine.\n\n"
                "2. Ignoring the prior entirely.\n\n"
                "3. Denominator missing the $P(A \\mid \\overline B)\\, P(\\overline B)$ term — the evidence "
                "must be explained by BOTH hypotheses.\n\n"
                "4. Priors and likelihoods from incompatible populations.\n\n"
                "5. Treating the posterior as final — it is the next prior when more evidence arrives; "
                "Bayes chains."
            )),
            (K, "Check yourself", (
                "You should be able to: invert conditionals with the full denominator, run natural-frequency "
                "tables, and explain why small priors mute strong evidence.\n\n"
                "Self-test: same test, prevalence 10%. ($P(D \\mid +) = \\frac{0.099}{0.099 + 0.045} "
                "\\approx 0.69$ — watch the posterior leap with the prior.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PS05": {
        "summary": "Discrete random variables and expectation: PMFs, expected value, and linearity.",
        "steps": [
            (L, "Random variables and PMFs", (
                "A random variable $X$ assigns a number to each outcome. Discrete $X$ is described by its "
                "probability mass function $p(x) = P(X = x)$, with $p(x) \\ge 0$ and $\\sum_x p(x) = 1$.\n\n"
                "The EXPECTED VALUE is the probability-weighted average:\n"
                "$$E[X] = \\sum_x x\\, p(x).$$\n"
                "It is the long-run average over many repetitions — not the 'most likely' value, and often "
                "not a possible value at all ($E[\\text{die}] = 3.5$)."
            )),
            (L, "Linearity: the free lunch", (
                "Expectation is LINEAR, unconditionally:\n"
                "$$E[aX + bY] = a\\,E[X] + b\\,E[Y]$$\n"
                "— even when $X$ and $Y$ are dependent. No independence needed, ever.\n\n"
                "This is the most powerful cheap trick in probability: to find the expected number of "
                "successes in a complicated process, write it as a sum of indicator variables (1 if event "
                "$i$ happens, else 0), note $E[\\mathbb 1_i] = P(\\text{event}_i)$, and add. Problems that "
                "look hopeless by direct PMF fall in two lines.\n\n"
                "Functions of $X$: $E[g(X)] = \\sum_x g(x) p(x)$ — and in general "
                "$E[g(X)] \\ne g(E[X])$."
            )),
            (E, "Worked example", (
                "In a random shuffle of 52 cards, what is the expected number of cards in their original "
                "position?\n\n"
                "Let $\\mathbb 1_i = 1$ if card $i$ is fixed. $P(\\mathbb 1_i = 1) = \\frac{1}{52}$.\n\n"
                "$$E[\\text{fixed points}] = \\sum_{i=1}^{52} \\frac{1}{52} = 1.$$\n\n"
                "One line, despite the indicators being thoroughly dependent — linearity doesn't care. The "
                "direct PMF of the number of fixed points is a derangement nightmare; nobody computes it."
            )),
            (P, "Pitfalls", (
                "1. $E[X]$ read as 'most likely value' — it's an average, possibly unattainable.\n\n"
                "2. Demanding independence before using linearity — linearity never needs it.\n\n"
                "3. $E[g(X)] = g(E[X])$: false in general ($E[X^2] \\ne E[X]^2$ — the gap IS the variance).\n\n"
                "4. PMFs that don't sum to 1 — always check before computing.\n\n"
                "5. $E[XY] = E[X]E[Y]$ — this one DOES need independence (unlike the sum rule)."
            )),
            (K, "Check yourself", (
                "You should be able to: build PMFs, compute expectations directly and via indicators, and "
                "state exactly when linearity vs product rules need independence.\n\n"
                "Self-test: expected number of distinct faces in 3 die rolls? (Indicators per face: "
                "$6(1 - (5/6)^3) = \\frac{91}{36} \\approx 2.53$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PS06": {
        "summary": "Variance and standard deviation: measuring spread, and the rules for scaling and summing.",
        "steps": [
            (L, "Variance", (
                "Variance measures spread around the mean $\\mu = E[X]$:\n"
                "$$\\operatorname{Var}(X) = E[(X - \\mu)^2] = E[X^2] - (E[X])^2.$$\n"
                "The second form (the computational formula) is usually faster. The standard deviation "
                "$\\sigma = \\sqrt{\\operatorname{Var}(X)}$ restores the original units — variance of a "
                "dollar amount is in dollars-squared; $\\sigma$ is in dollars."
            )),
            (L, "Transformation and sum rules", (
                "• Shifting does nothing, scaling squares: "
                "$\\operatorname{Var}(aX + b) = a^2 \\operatorname{Var}(X)$.\n"
                "• Sums: $\\operatorname{Var}(X + Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y)$ "
                "ONLY for independent (or at least uncorrelated) variables — in general the covariance term "
                "$2\\operatorname{Cov}(X, Y)$ appears.\n\n"
                "Contrast with expectation: $E$ is linear always; $\\operatorname{Var}$ adds only with "
                "independence. Keeping those two rules straight is half of this node.\n\n"
                "Consequence with legs: the average of $n$ independent copies has variance "
                "$\\sigma^2 / n$ — spread shrinks like $1/\\sqrt n$. That single fact powers PS11-PS14."
            )),
            (E, "Worked example", (
                "One fair die: $E[X] = 3.5$, $E[X^2] = \\frac{1 + 4 + 9 + 16 + 25 + 36}{6} = \\frac{91}{6}$.\n\n"
                "$$\\operatorname{Var}(X) = \\frac{91}{6} - 3.5^2 = \\frac{91}{6} - \\frac{49}{4} = \\frac{35}{12} \\approx 2.92, "
                "\\qquad \\sigma \\approx 1.71.$$\n\n"
                "Sum of two independent dice: $\\operatorname{Var} = \\frac{35}{12} + \\frac{35}{12} = \\frac{35}{6}$. "
                "Doubling ONE die instead: $\\operatorname{Var}(2X) = 4 \\cdot \\frac{35}{12} = \\frac{35}{3}$ — "
                "twice as much. '$X + X$' and '$2X$' are different random variables."
            )),
            (P, "Pitfalls", (
                "1. $\\operatorname{Var}(2X)$ computed as $2\\operatorname{Var}(X)$ — scaling SQUARES.\n\n"
                "2. Adding variances of dependent variables.\n\n"
                "3. $X + X$ vs $2X$: the first (independent copies) has variance $2\\sigma^2$, the second "
                "$4\\sigma^2$.\n\n"
                "4. Reporting variance where standard deviation is asked (units!).\n\n"
                "5. Negative variance from arithmetic slips in $E[X^2] - (E[X])^2$ — variance is NEVER "
                "negative; a negative result is always an error."
            )),
            (K, "Check yourself", (
                "You should be able to: compute variance both ways, apply the scaling and sum rules with "
                "their exact hypotheses, and explain the $1/\\sqrt n$ shrinkage of averages.\n\n"
                "Self-test: $\\operatorname{Var}(X) = 4$. Find $\\sigma(3X - 5)$. "
                "($\\sqrt{9 \\cdot 4} = 6$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PS07": {
        "summary": "Binomial and geometric distributions: counting successes, and waiting for the first one.",
        "steps": [
            (L, "Binomial", (
                "$n$ independent trials, each succeeding with probability $p$; $X$ = number of successes:\n"
                "$$P(X = k) = \\binom n k p^k (1-p)^{n-k}, \\qquad E[X] = np, \\quad \\operatorname{Var}(X) = np(1-p).$$\n\n"
                "The $\\binom n k$ counts WHICH trials succeeded; $p^k(1-p)^{n-k}$ is the probability of any "
                "one such pattern. The mean $np$ is linearity over $n$ indicator variables — no calculation "
                "needed.\n\n"
                "Checklist before calling something binomial: fixed $n$, two outcomes, constant $p$, "
                "independent trials. Miss any one and the model is wrong."
            )),
            (L, "Geometric", (
                "Repeat trials until the FIRST success; $X$ = number of trials needed:\n"
                "$$P(X = k) = (1-p)^{k-1} p, \\qquad E[X] = \\frac 1 p.$$\n\n"
                "$E[X] = 1/p$ matches intuition: a 1-in-20 event takes 20 tries on average.\n\n"
                "The geometric is MEMORYLESS: given 10 failures so far, the wait ahead is distributed exactly "
                "as from the start — dice have no memory, and 'due for a win' is exactly the gambler's "
                "fallacy this distribution refutes."
            )),
            (E, "Worked example", (
                "A free-throw shooter hits 70%. In 10 shots, $P(\\text{exactly } 8)$:\n"
                "$$\\binom{10}{8} (0.7)^8 (0.3)^2 = 45 \\cdot 0.05765 \\cdot 0.09 \\approx 0.2335.$$\n\n"
                "Expected makes: $np = 7$; spread $\\sigma = \\sqrt{10 \\cdot 0.7 \\cdot 0.3} \\approx 1.45$.\n\n"
                "Geometric: expected rolls until the first six $= \\frac{1}{1/6} = 6$; "
                "$P(\\text{first six on roll } 3) = \\left(\\frac 5 6\\right)^2 \\cdot \\frac 1 6 \\approx 0.116$."
            )),
            (P, "Pitfalls", (
                "1. Binomial applied without fixed $n$ or constant $p$ (drawing without replacement is "
                "hypergeometric, not binomial).\n\n"
                "2. Forgetting the $\\binom n k$ factor — that's the probability of ONE pattern, not $k$ "
                "successes.\n\n"
                "3. 'At least 8' computed as $P(X = 8)$ — sum the tail, or complement.\n\n"
                "4. Geometric off-by-one: 'trials until' vs 'failures before' conventions differ by 1 — fix "
                "the convention before computing.\n\n"
                "5. Betting against memorylessness ('due for a hit')."
            )),
            (K, "Check yourself", (
                "You should be able to: verify the binomial checklist, compute point and tail probabilities, "
                "use $np$ and $np(1-p)$ instantly, and reason with memorylessness.\n\n"
                "Self-test: $P(\\text{at least one six in 4 rolls})$. "
                "($1 - (5/6)^4 \\approx 0.518$ — complement, always.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PS08": {
        "summary": "The Poisson distribution: counting rare events at a known average rate.",
        "steps": [
            (L, "The model", (
                "Events occurring independently at average rate $\\lambda$ per interval — arrivals, typos, "
                "radioactive decays. The count $X$ in one interval:\n"
                "$$P(X = k) = \\frac{e^{-\\lambda} \\lambda^k}{k!}, \\qquad E[X] = \\operatorname{Var}(X) = \\lambda.$$\n\n"
                "Mean EQUALS variance — a fingerprint: count data much more spread out than its mean is "
                "over-dispersed, and Poisson is the wrong model.\n\n"
                "Rates rescale: $\\lambda = 3$ per hour means $\\lambda = 1.5$ per half hour. Match the "
                "interval to the question FIRST."
            )),
            (L, "Poisson as binomial's limit", (
                "The Poisson is the limit of Binomial$(n, p)$ when $n$ is large, $p$ small, and "
                "$np = \\lambda$ fixed — many opportunities, each individually unlikely.\n\n"
                "That's WHY it fits typos per page (thousands of characters, each rarely wrong) and calls per "
                "minute (many potential callers, each rarely calling). Practical rule: $n \\ge 100$, "
                "$p \\le 0.01$ makes the approximation good.\n\n"
                "Sums: independent Poissons add — rates $\\lambda_1 + \\lambda_2$. Two independent arrival "
                "streams merge into one Poisson stream."
            )),
            (E, "Worked example", (
                "A call center averages 4 calls per minute. $P(\\text{at most 2 calls in a minute})$:\n\n"
                "$$P(X \\le 2) = e^{-4}\\left(1 + 4 + \\frac{16}{2}\\right) = 13 e^{-4} \\approx 0.238.$$\n\n"
                "Over 30 seconds instead: $\\lambda = 2$, and "
                "$P(X = 0) = e^{-2} \\approx 0.135$ — the rate rescaled BEFORE any formula was touched."
            )),
            (P, "Pitfalls", (
                "1. Wrong-interval $\\lambda$: using the per-hour rate for a per-minute question.\n\n"
                "2. 'At most/least' handled with a single term instead of the sum or complement.\n\n"
                "3. Applying Poisson to bounded counts with large $p$ (successes in 10 trials at $p = 0.5$ "
                "is binomial, full stop).\n\n"
                "4. Ignoring the mean=variance check on real data.\n\n"
                "5. Treating counts in overlapping intervals as independent."
            )),
            (K, "Check yourself", (
                "You should be able to: recognize the rare-events regime, rescale $\\lambda$, compute point "
                "and cumulative probabilities, and justify Poisson vs binomial.\n\n"
                "Self-test: typos average 0.5/page. $P(\\text{a 4-page chapter has no typos})$? "
                "($\\lambda = 2$; $e^{-2} \\approx 0.135$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PS09": {
        "summary": "Continuous random variables: densities, probabilities as areas, and the uniform and exponential families.",
        "steps": [
            (L, "Densities", (
                "A continuous random variable has a probability DENSITY $f(x) \\ge 0$ with total area 1, and\n"
                "$$P(a \\le X \\le b) = \\int_a^b f(x)\\, dx.$$\n\n"
                "Two consequences that rewire discrete intuition: $P(X = c) = 0$ for every single point (so "
                "$<$ vs $\\le$ never matters), and $f(x)$ is NOT a probability — it can exceed 1; only its "
                "integrals are probabilities.\n\n"
                "The CDF $F(x) = P(X \\le x) = \\int_{-\\infty}^x f$ links back by $F' = f$ — the FTC "
                "(C118) working for probability."
            )),
            (L, "Uniform and exponential", (
                "• UNIFORM on $[a, b]$: $f(x) = \\frac{1}{b-a}$; probabilities are proportional to length; "
                "$E[X] = \\frac{a+b}{2}$.\n\n"
                "• EXPONENTIAL rate $\\lambda$: $f(x) = \\lambda e^{-\\lambda x}$ on $x \\ge 0$; "
                "$P(X > t) = e^{-\\lambda t}$; $E[X] = \\frac 1 \\lambda$. It is the WAITING TIME between "
                "Poisson events, and it is memoryless — the continuous twin of the geometric.\n\n"
                "Moments come from integrals: $E[X] = \\int x f(x)\\,dx$, variance as in PS06."
            )),
            (E, "Worked example", (
                "Bus arrivals are Poisson at $\\lambda = 3$/hour, so the wait is exponential.\n\n"
                "$P(\\text{wait} > 30 \\text{ min}) = e^{-3 \\cdot 0.5} = e^{-1.5} \\approx 0.223$.\n\n"
                "Given you've already waited 20 minutes: STILL $e^{-1.5}$ for 30 more — memorylessness.\n\n"
                "Uniform drill: $X \\sim U[0, 10]$, $P(3 < X < 7) = \\frac{4}{10} = 0.4$; and note "
                "$P(X = 5) = 0$ exactly."
            )),
            (P, "Pitfalls", (
                "1. Reading $f(x)$ as a probability ('density is 2, impossible' — it isn't).\n\n"
                "2. Discrete habits: summing instead of integrating, or fretting over $<$ vs $\\le$.\n\n"
                "3. Exponential in the wrong units — rate per hour with time in minutes.\n\n"
                "4. Densities that don't integrate to 1 (normalize first).\n\n"
                "5. Confusing rate $\\lambda$ with mean $1/\\lambda$ — the exponential's two "
                "parametrizations bite everyone once."
            )),
            (K, "Check yourself", (
                "You should be able to: compute probabilities as integrals, work the CDF-density "
                "relationship both ways, and use uniform and exponential fluently.\n\n"
                "Self-test: for $f(x) = 2x$ on $[0,1]$, find $P(X > \\frac12)$. "
                "($\\int_{1/2}^1 2x\\,dx = 1 - \\frac14 = \\frac34$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PS10": {
        "summary": "The normal distribution: z-scores, the empirical rule, and standardization.",
        "steps": [
            (L, "The bell curve", (
                "The normal distribution $N(\\mu, \\sigma^2)$ has density\n"
                "$$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-(x-\\mu)^2 / 2\\sigma^2}$$\n"
                "— symmetric about $\\mu$, spread set by $\\sigma$. The empirical rule: about 68% of "
                "probability lies within $1\\sigma$ of the mean, 95% within $2\\sigma$, 99.7% within "
                "$3\\sigma$.\n\n"
                "Why it's everywhere: sums and averages of many small independent effects are approximately "
                "normal — that's the central limit theorem (PS11), and it makes the normal the default model "
                "for measurement noise, heights, and errors."
            )),
            (L, "Standardization", (
                "Every normal question reduces to ONE table/function via the z-score:\n"
                "$$z = \\frac{x - \\mu}{\\sigma} \\quad \\Rightarrow \\quad Z \\sim N(0, 1).$$\n"
                "$z$ counts 'how many standard deviations from the mean' — a universal currency that also "
                "lets you compare across different scales (an SAT score vs an ACT score).\n\n"
                "Then $P(X \\le x) = \\Phi(z)$, with symmetry $\\Phi(-z) = 1 - \\Phi(z)$. Percentile "
                "questions run the pipeline backwards: percentile → $z$ → $x = \\mu + z\\sigma$."
            )),
            (E, "Worked example", (
                "Heights $\\sim N(170, 8^2)$ cm. $P(\\text{taller than } 186)$?\n\n"
                "$z = \\frac{186 - 170}{8} = 2$, so $P = 1 - \\Phi(2) \\approx 0.0228$ — matching the "
                "empirical rule (95% within $\\pm 2\\sigma$ leaves 2.5% per tail).\n\n"
                "Reverse: the 90th percentile has $z \\approx 1.2816$, so "
                "$x = 170 + 1.2816 \\cdot 8 \\approx 180.3$ cm."
            )),
            (P, "Pitfalls", (
                "1. Standardizing with variance instead of standard deviation ($N(170, 64)$ means "
                "$\\sigma = 8$ — read the notation).\n\n"
                "2. Tail direction: $P(X > x)$ reported as $\\Phi(z)$ instead of $1 - \\Phi(z)$ — sketch "
                "the region every time.\n\n"
                "3. Assuming normality for skewed or bounded data (incomes, waiting times).\n\n"
                "4. Empirical rule quoted on non-normal data.\n\n"
                "5. Percentile-to-value done with the pipeline backwards ($x = \\mu + z\\sigma$, not "
                "$z = \\mu + x\\sigma$)."
            )),
            (K, "Check yourself", (
                "You should be able to: standardize, read both tails, run percentile problems both "
                "directions, and quote the 68-95-99.7 rule with its normality caveat.\n\n"
                "Self-test: $X \\sim N(100, 15^2)$. $P(85 < X < 130)$? "
                "($\\Phi(2) - \\Phi(-1) \\approx 0.9772 - 0.1587 = 0.8186$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PS11": {
        "summary": "The central limit theorem: why averages are normal, whatever the population looks like.",
        "steps": [
            (L, "The statement", (
                "Take ANY population with mean $\\mu$ and finite standard deviation $\\sigma$. The mean "
                "$\\bar X$ of a sample of size $n$ satisfies, for large $n$:\n"
                "$$\\bar X \\;\\approx\\; N\\!\\left(\\mu, \\; \\frac{\\sigma^2}{n}\\right), \\qquad "
                "\\text{equivalently} \\quad \\frac{\\bar X - \\mu}{\\sigma / \\sqrt n} \\approx N(0, 1).$$\n\n"
                "The population can be skewed, lumpy, discrete — dice, incomes, coin flips — and the "
                "AVERAGES still organize themselves into a bell. Rule of thumb: $n \\ge 30$ suffices for "
                "moderately skewed populations; already-normal populations need no minimum."
            )),
            (L, "Reading the theorem", (
                "Three separate facts are packed inside:\n\n"
                "1. CENTER: $E[\\bar X] = \\mu$ — sample means are unbiased.\n"
                "2. SPREAD: $\\sigma_{\\bar X} = \\sigma / \\sqrt n$ — quadruple the sample to halve the "
                "noise (PS06's variance rule).\n"
                "3. SHAPE: the distribution of $\\bar X$ becomes NORMAL — this is the miracle part.\n\n"
                "Keep the two distributions distinct: the POPULATION (fixed shape, never changes) vs the "
                "SAMPLING DISTRIBUTION OF $\\bar X$ (narrows and normalizes as $n$ grows). The CLT is about "
                "the second. It is the license behind every confidence interval and z/t-test that follows."
            )),
            (E, "Worked example", (
                "A die roll has $\\mu = 3.5$, $\\sigma \\approx 1.708$. Roll $n = 36$ times: "
                "$P(\\bar X > 3.8)$?\n\n"
                "$\\sigma_{\\bar X} = \\frac{1.708}{\\sqrt{36}} \\approx 0.2847$, so "
                "$z = \\frac{3.8 - 3.5}{0.2847} \\approx 1.05$ and $P \\approx 1 - \\Phi(1.05) \\approx 0.146$.\n\n"
                "One roll exceeds 3.8 with probability $\\frac 1 2$ (faces 4, 5, 6); the average of 36 rarely "
                "does — averaging kills spread, and the CLT says HOW fast: like $1/\\sqrt n$."
            )),
            (P, "Pitfalls", (
                "1. Claiming the CLT normalizes the POPULATION — it normalizes the distribution of "
                "the sample mean; individual observations keep their shape.\n\n"
                "2. Using $\\sigma$ where $\\sigma / \\sqrt n$ belongs (or vice versa) — decide whether the "
                "question is about ONE observation or an AVERAGE first.\n\n"
                "3. $n \\ge 30$ waved at heavily skewed or heavy-tailed data — the threshold grows with "
                "skewness (and infinite-variance populations escape the CLT entirely).\n\n"
                "4. Applying the CLT to non-independent samples.\n\n"
                "5. Forgetting it also covers SUMS: $\\sum X_i \\approx N(n\\mu, n\\sigma^2)$."
            )),
            (K, "Check yourself", (
                "You should be able to: state the CLT with all three parts, decide one-observation vs "
                "average, and compute probabilities for $\\bar X$.\n\n"
                "Self-test: population $\\mu = 50$, $\\sigma = 10$; $n = 100$. $P(\\bar X < 48)$? "
                "($z = \\frac{-2}{1} = -2$; $\\approx 0.023$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PS12": {
        "summary": "Descriptive statistics: mean vs median, quartiles, IQR, and reading skew and outliers.",
        "steps": [
            (L, "Center and spread", (
                "• MEAN $\\bar x = \\frac 1 n \\sum x_i$: uses every value; dragged by outliers.\n"
                "• MEDIAN: middle of the sorted data; robust — a billionaire walking into the room moves the "
                "mean, not the median.\n"
                "• Spread: standard deviation $s$ (companion of the mean) and IQR $= Q_3 - Q_1$ (companion "
                "of the median, span of the middle 50%).\n\n"
                "Skew rule of thumb: right-skewed data (incomes) has mean $>$ median; left-skewed the "
                "reverse. Comparing the two is a one-glance skew detector."
            )),
            (L, "Five numbers, boxplots, outliers", (
                "The five-number summary — min, $Q_1$, median, $Q_3$, max — draws the boxplot: box over the "
                "IQR, line at the median, whiskers out to the last non-outlier points.\n\n"
                "The 1.5-IQR convention flags outliers: anything below $Q_1 - 1.5\\,\\text{IQR}$ or above "
                "$Q_3 + 1.5\\,\\text{IQR}$. A flag is a PROMPT TO INVESTIGATE (data error? real extreme?), "
                "not a license to delete.\n\n"
                "Discipline: pair mean with $s$, median with IQR; report a robust pair when the data is "
                "skewed or contaminated."
            )),
            (E, "Worked example", (
                "Salaries (\\$k): 42, 45, 48, 50, 52, 55, 58, 60, 250.\n\n"
                "Mean $\\approx 73.3$; median $= 52$ — the mean sits above the 8th of 9 values, describing "
                "almost nobody. $Q_1 = 46.5$, $Q_3 = 59$, IQR $= 12.5$; fence $= 59 + 18.75 = 77.75$, so 250 "
                "is flagged.\n\n"
                "Honest report: 'median \\$52k, IQR \\$12.5k, one extreme value at \\$250k' — not "
                "'average \\$73k.'"
            )),
            (P, "Pitfalls", (
                "1. Reporting the mean of skewed data without the median (the 'average salary' trick).\n\n"
                "2. Deleting flagged outliers without investigation.\n\n"
                "3. Comparing spreads by range alone — two points set the range; IQR or $s$ use the body of "
                "the data.\n\n"
                "4. Quartile conventions differ across software — small datasets give slightly different "
                "$Q_1, Q_3$; don't panic over the discrepancy.\n\n"
                "5. Mean $\\pm$ sd summaries on data with hard bounds (percent scores near 100) implying "
                "impossible values."
            )),
            (K, "Check yourself", (
                "You should be able to: compute both summary pairs, read skew from mean-vs-median, build "
                "boxplots, and apply the 1.5-IQR rule with judgment.\n\n"
                "Self-test: data 2, 4, 6, 8, 100 — which summary pair do you report, and why? "
                "(Median 6 with IQR; the mean 24 is a fiction of the outlier.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PS13": {
        "summary": "Sampling distributions and standard error: the statistic as a random variable.",
        "steps": [
            (L, "The key conceptual move", (
                "A statistic (sample mean, sample proportion) is computed from a RANDOM sample — so the "
                "statistic is itself a random variable with its own distribution: the SAMPLING DISTRIBUTION. "
                "Imagine re-running the whole survey many times; the histogram of the resulting $\\bar x$'s "
                "is it.\n\n"
                "Three distributions now live in every problem — keep them apart:\n"
                "1. The POPULATION distribution (fixed, usually unknown).\n"
                "2. The SAMPLE's data distribution (one draw's histogram).\n"
                "3. The SAMPLING distribution of the statistic (across hypothetical repetitions).\n\n"
                "Inference (PS14-PS15) lives entirely in the third."
            )),
            (L, "Standard error", (
                "The STANDARD ERROR is the standard deviation of the sampling distribution:\n"
                "$$SE(\\bar X) = \\frac{\\sigma}{\\sqrt n} \\;\\;(\\text{estimated } \\frac{s}{\\sqrt n}), \\qquad "
                "SE(\\hat p) = \\sqrt{\\frac{p(1-p)}{n}}.$$\n\n"
                "It measures how much the STATISTIC wobbles between samples — not how spread the data is. "
                "The $\\sqrt n$ law sets the economics of data collection: 10× the precision costs 100× the "
                "sample.\n\n"
                "By the CLT, $\\bar X \\approx N(\\mu, SE^2)$ for large $n$; for proportions, the normal "
                "approximation is decent when $np \\ge 10$ and $n(1-p) \\ge 10$."
            )),
            (E, "Worked example", (
                "A poll of $n = 1000$ finds $\\hat p = 0.52$ support.\n\n"
                "$$SE = \\sqrt{\\frac{0.52 \\times 0.48}{1000}} \\approx 0.0158 \\;(1.6 \\text{ points}).$$\n\n"
                "So a repeat poll would typically land within about $\\pm 1.6$ points; being 2 points above "
                "50% is only $z = \\frac{0.02}{0.0158} \\approx 1.27$ standard errors — a 52-48 poll does NOT "
                "settle a close race. (This is precisely the 'margin of error' of PS14.)"
            )),
            (P, "Pitfalls", (
                "1. Standard deviation vs standard error confusion — data spread vs statistic wobble; "
                "dividing (or not) by $\\sqrt n$ at the wrong moment.\n\n"
                "2. Believing a larger sample shrinks the POPULATION's spread — $\\sigma$ never moves; only "
                "$SE$ shrinks.\n\n"
                "3. Using $n$ from the wrong unit (1000 responses from 200 people is not $n = 1000$ "
                "independent draws).\n\n"
                "4. Normal approximation for $\\hat p$ with tiny $np$.\n\n"
                "5. Ignoring bias: $SE$ measures wobble, not systematic error — a biased sampling method has "
                "small $SE$ around the WRONG value."
            )),
            (K, "Check yourself", (
                "You should be able to: name which of the three distributions a question is about, compute "
                "both standard errors, and reason with the $\\sqrt n$ law.\n\n"
                "Self-test: to halve a poll's SE, how much bigger must the sample be? (4×.)\n\n"
                "Practice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PS14": {
        "summary": "Confidence intervals: estimate ± margin of error, and what 95% actually means.",
        "steps": [
            (L, "The recipe", (
                "A confidence interval is\n"
                "$$\\text{estimate} \\;\\pm\\; (\\text{critical value}) \\times SE.$$\n\n"
                "For a mean with $\\sigma$ unknown (the realistic case): "
                "$\\bar x \\pm t^* \\frac{s}{\\sqrt n}$, with $t^*$ from the $t$-distribution "
                "($n - 1$ degrees of freedom — slightly fatter tails to pay for estimating $\\sigma$ by $s$; "
                "it converges to the normal as $n$ grows). For a proportion: "
                "$\\hat p \\pm z^* \\sqrt{\\hat p(1 - \\hat p)/n}$, with $z^* = 1.96$ at 95%."
            )),
            (L, "What 95% means — and doesn't", (
                "The 95% is a property of the PROCEDURE: across many samples, 95% of the intervals built "
                "this way capture the true parameter. Any ONE computed interval either contains it or "
                "doesn't — the parameter is a fixed number, not a random one.\n\n"
                "Correct reading: 'we are 95% confident the mean lies in $[a, b]$' as shorthand for the "
                "procedure's success rate. Wrong reading: 'there's a 95% probability the mean is in "
                "$[a, b]$' (in the frequentist framework), and definitely not '95% of the data lies in "
                "$[a, b]$.'\n\n"
                "Trade-offs: higher confidence → wider interval; bigger $n$ → narrower, like $1/\\sqrt n$."
            )),
            (E, "Worked example", (
                "$n = 25$ measurements: $\\bar x = 102.3$, $s = 8.0$. 95% CI for the mean:\n\n"
                "$t^*_{24} = 2.064$, $SE = \\frac{8}{\\sqrt{25}} = 1.6$.\n"
                "$$102.3 \\pm 2.064 \\times 1.6 = 102.3 \\pm 3.30 = (99.0, \\; 105.6).$$\n\n"
                "Note the interval contains 100 — so these data are consistent with a true mean of 100; "
                "PS15 will make that duality (CI ↔ hypothesis test) exact."
            )),
            (P, "Pitfalls", (
                "1. The probability misreading of a single interval.\n\n"
                "2. '95% of the data is in the CI' — the CI is about the MEAN, not the observations.\n\n"
                "3. Using $z^*$ with small samples and unknown $\\sigma$ (that's $t^*$'s job).\n\n"
                "4. Quoting an interval whose assumptions failed (badly skewed small samples, biased "
                "sampling — no formula fixes a bad sample).\n\n"
                "5. Margin of error covers SAMPLING error only — nonresponse and question wording are "
                "outside it."
            )),
            (K, "Check yourself", (
                "You should be able to: build $t$- and $z$-intervals, interpret the confidence level as a "
                "procedure property, and predict how width responds to $n$ and confidence.\n\n"
                "Self-test: a 95% CI from $n = 100$ is $(48, 52)$. Roughly what does $n = 400$ give, same "
                "data behavior? (Half the width: $(49, 51)$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PS15": {
        "summary": "Hypothesis testing: null and alternative, p-values, significance, and the two error types.",
        "steps": [
            (L, "The logic", (
                "1. Assume the skeptical NULL hypothesis $H_0$ (no effect, $\\mu = \\mu_0$).\n"
                "2. Compute a test statistic — how far the data sits from $H_0$ in $SE$ units, e.g. "
                "$t = \\frac{\\bar x - \\mu_0}{s / \\sqrt n}$.\n"
                "3. The P-VALUE: the probability, IF $H_0$ WERE TRUE, of data at least this extreme.\n"
                "4. Small p-value ($< \\alpha$, conventionally 0.05): the data is implausible under $H_0$ — "
                "reject. Otherwise: FAIL TO REJECT — which is not proof of $H_0$, just insufficient "
                "evidence against it.\n\n"
                "The p-value is $P(\\text{data} \\mid H_0)$ — NOT $P(H_0 \\mid \\text{data})$. That "
                "transposition is PS04's fallacy wearing a lab coat."
            )),
            (L, "Errors, power, and significance vs importance", (
                "• TYPE I error: rejecting a true $H_0$ (false alarm) — rate set by $\\alpha$.\n"
                "• TYPE II error: missing a real effect — rate $\\beta$; POWER $= 1 - \\beta$ grows with "
                "sample size and effect size.\n\n"
                "The trade-off is real: lowering $\\alpha$ raises $\\beta$ at fixed $n$.\n\n"
                "STATISTICAL significance ≠ PRACTICAL importance: with $n = 10^6$, a blood-pressure drug "
                "that changes readings by 0.1 mmHg is 'significant' and useless. Report effect sizes and "
                "confidence intervals alongside p-values; and note the duality — a 95% CI excludes "
                "$\\mu_0$ exactly when the two-sided test rejects at $\\alpha = 0.05$."
            )),
            (E, "Worked example", (
                "Machine fills bottles at $\\mu_0 = 500$ ml. Sample: $n = 36$, $\\bar x = 497$, $s = 9$. "
                "Two-sided test at $\\alpha = 0.05$:\n\n"
                "$$t = \\frac{497 - 500}{9 / \\sqrt{36}} = \\frac{-3}{1.5} = -2.0,$$\n"
                "$p \\approx 0.053$ (df 35, two-sided).\n\n"
                "Conclusion: at $\\alpha = 0.05$, fail to reject — barely. Honest report: 'observed 3 ml "
                "underfill, $p = 0.053$, 95% CI $(494.0, 500.0)$' — the reader sees how borderline it is, "
                "which the binary reject/fail-to-reject verdict hides."
            )),
            (P, "Pitfalls", (
                "1. p-value read as $P(H_0 \\text{ true})$ — the transposition fallacy.\n\n"
                "2. 'Fail to reject' upgraded to 'proved the null.'\n\n"
                "3. p-hacking: testing many hypotheses and reporting the one with $p < 0.05$ — at "
                "$\\alpha = 0.05$, 1 in 20 null effects 'succeeds' by luck.\n\n"
                "4. One-sided tests chosen AFTER seeing the data's direction.\n\n"
                "5. Significance trumpeted without effect size; $p = 0.049$ vs $0.051$ treated as a "
                "chasm.\n\n"
                "6. Ignoring assumptions (independence, approximate normality for small $n$)."
            )),
            (K, "Check yourself", (
                "You should be able to: set up both hypotheses, compute the test statistic and p-value, "
                "control both error types conceptually, and report effect size + CI alongside the "
                "verdict.\n\n"
                "Self-test: define, in one sentence each, what $\\alpha$ and power control. "
                "(False-alarm rate under $H_0$; detection rate under a real effect.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PS16": {
        "summary": "Correlation and linear regression: measuring association, fitting lines, and the limits of both.",
        "steps": [
            (L, "Correlation", (
                "The correlation coefficient $r \\in [-1, 1]$ measures LINEAR association: sign gives "
                "direction, magnitude gives strength; $r = \\pm 1$ means the points lie exactly on a line.\n\n"
                "Properties: symmetric in $x$ and $y$, unit-free, unchanged by rescaling either variable. "
                "Limitations built into the definition: it sees only LINES (a perfect parabola can have "
                "$r = 0$), and it is dragged hard by outliers. ALWAYS plot first — Anscombe's quartet is "
                "four wildly different scatterplots sharing identical $r$."
            )),
            (L, "Least-squares regression", (
                "The regression line $\\hat y = a + bx$ minimizes the sum of squared VERTICAL errors "
                "(residuals $y_i - \\hat y_i$):\n"
                "$$b = r\\, \\frac{s_y}{s_x}, \\qquad a = \\bar y - b \\bar x.$$\n\n"
                "Read $b$ as 'predicted change in $y$ per unit of $x$.' The line always passes through "
                "$(\\bar x, \\bar y)$; $R^2 = r^2$ is the fraction of $y$'s variance the line explains.\n\n"
                "Diagnostics live in the RESIDUAL PLOT: a patternless cloud means the linear model is "
                "adequate; curves or funnels mean it isn't. And the oldest warning in statistics: "
                "correlation is not causation — confounders, reverse causation, and coincidence all "
                "produce strong $r$ without any causal arrow."
            )),
            (E, "Worked example", (
                "Study hours vs exam score: $\\bar x = 5$, $s_x = 2$, $\\bar y = 75$, $s_y = 10$, "
                "$r = 0.8$.\n\n"
                "$$b = 0.8 \\cdot \\frac{10}{2} = 4 \\text{ points/hour}, \\qquad a = 75 - 4 \\cdot 5 = 55.$$\n"
                "$\\hat y = 55 + 4x$; at $x = 7$: $\\hat y = 83$. $R^2 = 0.64$ — hours 'explain' 64% of "
                "score variance.\n\n"
                "Abuse check: predicting at $x = 40$ hours gives $\\hat y = 215$ on a 100-point exam — "
                "EXTRAPOLATION beyond the data range produces nonsense with a straight face."
            )),
            (P, "Pitfalls", (
                "1. Correlation ⇒ causation — the classic; randomized experiments, not observational $r$, "
                "establish cause.\n\n"
                "2. Extrapolating beyond the observed $x$-range.\n\n"
                "3. $r = 0$ read as 'no relationship' (only: no LINEAR relationship).\n\n"
                "4. Outliers silently steering both $r$ and the line — plot, and check influence.\n\n"
                "5. Regressing $y$ on $x$ vs $x$ on $y$ gives DIFFERENT lines — vertical residuals aren't "
                "symmetric.\n\n"
                "6. High $R^2$ worshipped while the residual plot shows a curve."
            )),
            (K, "Check yourself", (
                "You should be able to: interpret $r$ and $R^2$, compute the line from summary statistics, "
                "read residual plots, and name the three reasons correlation isn't causation.\n\n"
                "Self-test: $r = 0.5$, $s_x = s_y$. Slope? ($b = 0.5$ — and the sanity check: the "
                "regression line is always SHALLOWER than the SD line; that's regression to the mean.)\n\n"
                "Practice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PROB": {
        "summary": "Probability and statistics: the mathematics of uncertainty — from counting chances to drawing defensible conclusions from data.",
        "steps": [
            (L, "What this course is for", (
                "Probability builds forward: given a model, what data should we expect? Statistics runs "
                "backward: given data, what model is credible? Together they are the quantitative core of "
                "science, medicine, ML, finance, and every argument that starts with 'the data shows...'.\n\n"
                "The payoff skill is CALIBRATED skepticism: knowing exactly what a poll's margin of error, "
                "a medical test's accuracy, or a p-value does and does not claim."
            )),
            (L, "The arc", (
                "• Probability: PS01 (counting) → PS02 (axioms) → PS03 (conditioning, independence) → "
                "PS04 (Bayes).\n"
                "• Random variables: PS05 (expectation) → PS06 (variance) → PS07-PS08 (binomial, geometric, "
                "Poisson) → PS09 (continuous) → PS10 (normal).\n"
                "• The bridge: PS11 (central limit theorem) — why averages are normal.\n"
                "• Statistics: PS12 (describing data) → PS13 (sampling distributions) → PS14 (confidence "
                "intervals) → PS15 (hypothesis tests) → PS16 (regression).\n\n"
                "The CLT is the keystone: everything after it stands on it."
            )),
            (E, "A signature problem", (
                "A test for a rare disease (1 in 1000) is 99% accurate. You test positive. How worried "
                "should you be?\n\n"
                "Out of 100,000 people: ~100 sick → 99 true positives; ~99,900 healthy → ~999 false "
                "positives (at 1% error). Your chance of actually being sick: "
                "$\\frac{99}{99 + 999} \\approx 9\\%$.\n\n"
                "Why it's a signature: it is Bayes' theorem (PS04) colliding with base rates, it defeats "
                "almost everyone's intuition — physicians included — and the natural-frequency method that "
                "cracks it works on every problem of this shape."
            )),
            (P, "Course-level traps", (
                "1. The transposition fallacy in both costumes: $P(A|B)$ vs $P(B|A)$, and p-value as "
                "$P(H_0)$.\n\n"
                "2. Assuming independence without justification.\n\n"
                "3. Standard deviation vs standard error.\n\n"
                "4. Statistical significance read as practical importance.\n\n"
                "5. Correlation read as causation.\n\n"
                "6. Trusting formulas over plots — summary statistics hide what a scatterplot shouts."
            )),
            (K, "How to work this course", (
                "Take the arc in order — conditioning before Bayes, CLT before inference. For every formula, "
                "attach the question it answers and one situation where it does NOT apply; the misuse "
                "conditions are half the content. Simulate when unsure: ten minutes of mental (or actual) "
                "coin-flipping resolves most probability disputes.\n\n"
                "Self-test: explain to a friend why a 95% confidence interval is not '95% probability the "
                "answer is in here' — if you can do that cleanly, the statistics half is yours.\n\n"
                "Prerequisites: counting (DM07-DM08) for PS01; C118's integrals for PS09 onward."
            )),
        ],
    },
}
