"""Coursework: proof technique nodes PT.* and the INTROPROOF survey.

Five steps per lesson: two readings, a worked example, pitfalls, check.
"""

L = "reading"
E = "example"
P = "pitfall"
K = "check"

LESSONS: dict[str, dict] = {
    # ------------------------------------------------------------------
    "PT.DIRECT": {
        "summary": "Direct proof: from hypotheses to conclusion by definitions and known results.",
        "steps": [
            (L, "The shape", (
                "To prove 'if $P$ then $Q$' directly: ASSUME $P$, and construct a chain of "
                "implications ending at $Q$. The engine is UNWRAPPING DEFINITIONS: 'n is even' "
                "becomes '$n = 2k$'; '$a \\mid b$' becomes '$b = ac$'; 'x ∈ A ∩ B' becomes "
                "'$x \\in A$ and $x \\in B$'.\n\n"
                "Rhythm: unwrap the hypothesis → compute/reason in the unwrapped world → rewrap "
                "into the conclusion's definition. Most direct proofs are three sentences once "
                "the definitions are on the table."
            )),
            (L, "Craft points", (
                "• Introduce every symbol: 'let $n$ be an even integer, so $n = 2k$ for some "
                "integer $k$.' Fresh letters for fresh objects ($2a$ and $2b$, never $2k$ "
                "twice).\n"
                "• Keep the logical direction forward — from hypothesis toward goal. Scratch work "
                "may run backwards from the goal; the WRITTEN proof runs forward (or marks "
                "reversibility explicitly).\n"
                "• Signal the end: derive exactly the unwrapped form of $Q$, then rewrap and say "
                "so.\n\n"
                "Direct proof is the default: try it first; the other techniques exist for when "
                "the direct road is blocked."
            )),
            (E, "Worked example", (
                "Claim: if $a \\mid b$ and $b \\mid c$, then $a \\mid c$.\n\n"
                "Proof. Suppose $a \\mid b$ and $b \\mid c$. Unwrap: $b = am$ and $c = bn$ for "
                "some integers $m, n$. Then\n"
                "$$c = bn = (am)n = a(mn),$$\n"
                "and $mn$ is an integer. So $a \\mid c$ by definition. ∎\n\n"
                "Anatomy: two unwraps, one line of algebra, one rewrap — and the integers $m, n$ "
                "got separate names."
            )),
            (P, "Pitfalls", (
                "1. Assuming the CONCLUSION anywhere in the chain (circular proof).\n\n"
                "2. Proof by example — instances illustrate, they never prove a universal.\n\n"
                "3. Reusing a variable for two different witnesses.\n\n"
                "4. Skipping the unwrap and manipulating slogans ('even + even is even because "
                "evens are even').\n\n"
                "5. Writing the scratch-work direction (from goal backwards) as if it were the "
                "proof."
            )),
            (K, "Check yourself", (
                "You should be able to: unwrap standard definitions instantly, run the "
                "forward chain, and rewrap cleanly.\n\n"
                "Self-test: prove directly that the sum of two odd integers is even. "
                "($(2a+1) + (2b+1) = 2(a + b + 1)$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PT.CONTRAPOS": {
        "summary": "Contrapositive proof: prove ¬Q ⇒ ¬P instead of P ⇒ Q.",
        "steps": [
            (L, "The equivalence", (
                "$P \\to Q$ and $\\neg Q \\to \\neg P$ are logically EQUIVALENT (same truth "
                "table) — so proving either proves both. A contrapositive proof assumes "
                "$\\neg Q$ and derives $\\neg P$, directly.\n\n"
                "Distinguish from the CONVERSE $Q \\to P$ and INVERSE $\\neg P \\to \\neg Q$ — "
                "both are independent claims; proving them proves nothing about $P \\to Q$."
            )),
            (L, "When to switch", (
                "Reach for the contrapositive when the NEGATIONS are easier to work with than "
                "the originals — typically when $Q$ is a 'negative' or structural statement:\n\n"
                "• '$n^2$ even ⇒ $n$ even': working from '$n^2$ even' is awkward; from "
                "'$n$ odd' (the negated conclusion) it's one line.\n"
                "• 'if $xy$ irrational then $x$ or $y$ irrational': negate to 'both rational ⇒ "
                "product rational' — trivial.\n\n"
                "Mechanics to get right: negate correctly (DM02's rules — 'or' becomes 'and', "
                "quantifiers flip), then run an ordinary direct proof between the negations."
            )),
            (E, "Worked example", (
                "Claim: if $n^2$ is even, then $n$ is even.\n\n"
                "Contrapositive: if $n$ is odd, then $n^2$ is odd.\n\n"
                "Proof. Let $n$ be odd: $n = 2k + 1$. Then "
                "$n^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1$ — odd. ∎\n\n"
                "The direct route would start from '$n^2 = 2m$' and face a square root; the "
                "contrapositive replaces it with freshman algebra. (This lemma is the engine "
                "inside the classic $\\sqrt 2$ proof.)"
            )),
            (P, "Pitfalls", (
                "1. Proving the CONVERSE and calling it contrapositive.\n\n"
                "2. Botched negations — especially of 'or', 'and', and quantified "
                "statements.\n\n"
                "3. Negating only one side ($\\neg Q \\to P$ proves nothing).\n\n"
                "4. Failing to ANNOUNCE the strategy — start with 'we prove the "
                "contrapositive:' and state it.\n\n"
                "5. Using it where direct is just as easy — adds a layer of indirection for "
                "free."
            )),
            (K, "Check yourself", (
                "You should be able to: form contrapositives with correct negations, decide "
                "when the switch pays, and execute the inner direct proof.\n\n"
                "Self-test: state the contrapositive of 'if $x + y \\ge 100$ then $x \\ge 50$ "
                "or $y \\ge 50$.' ('If $x < 50$ AND $y < 50$, then $x + y < 100$' — now "
                "trivially provable.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PT.CONTRADICTION": {
        "summary": "Proof by contradiction: assume the negation, derive the impossible.",
        "steps": [
            (L, "The shape", (
                "To prove $P$: assume $\\neg P$, and derive a CONTRADICTION — a statement that "
                "is false outright ($1 = 0$), or contradicts an assumption, or contradicts a "
                "known theorem. Since $\\neg P$ leads to the impossible, $P$ holds.\n\n"
                "Strength: you gain a free hypothesis ($\\neg P$) to compute with — "
                "particularly potent for NEGATIVE claims ('there is no...', 'x is "
                "irrational') where the negation is a concrete object you can dissect."
            )),
            (L, "The classics, and hygiene", (
                "The two proofs everyone should own:\n\n"
                "• $\\sqrt 2$ irrational: suppose $\\sqrt 2 = \\frac pq$ in LOWEST TERMS; then "
                "$p^2 = 2q^2$ forces $p$ even, then $q$ even — contradicting lowest terms.\n"
                "• Infinitude of primes (Euclid): suppose finitely many, $p_1, \\ldots, p_k$; "
                "then $N = p_1 \\cdots p_k + 1$ has a prime factor not among them.\n\n"
                "Hygiene: announce 'suppose, for contradiction, that...'; keep track of WHAT "
                "the final contradiction contradicts; and prefer contrapositive when the "
                "contradiction you find only involves $\\neg Q$ and $P$ — that's a "
                "contrapositive proof wearing a trench coat."
            )),
            (E, "Worked example", (
                "Claim: there is no smallest positive rational number.\n\n"
                "Proof. Suppose, for contradiction, that $r$ is the smallest positive "
                "rational. Consider $\\frac r 2$: it is rational, positive, and "
                "$\\frac r2 < r$ — contradicting $r$'s minimality. ∎\n\n"
                "Note the choreography: the assumed object $r$ is USED to build the "
                "contradiction. Contradiction proofs of nonexistence almost always work this "
                "way — the hypothetical object supplies the material for its own demolition."
            )),
            (P, "Pitfalls", (
                "1. Negating the claim wrongly at the very first step (everything after is "
                "wasted).\n\n"
                "2. 'Contradictions' that are merely surprising, not impossible.\n\n"
                "3. Deriving the ORIGINAL claim under $\\neg P$ and stopping — you must reach "
                "a genuine impossibility (though $P \\land \\neg P$ qualifies).\n\n"
                "4. Extra assumptions smuggled in ('in lowest terms' must be justified as "
                "available, not assumed silently — it's fine because every fraction has such "
                "a form).\n\n"
                "5. Overuse: wrapping a direct argument in contradiction clothing adds "
                "nothing (and reviewers notice)."
            )),
            (K, "Check yourself", (
                "You should be able to: set up the negation, drive it to a named "
                "contradiction, and reproduce both classics from memory.\n\n"
                "Self-test: prove there's no largest integer. (If $N$ were largest, "
                "$N + 1$ is bigger — contradiction.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PT.CASES": {
        "summary": "Proof by cases: split into exhaustive scenarios, prove each.",
        "steps": [
            (L, "The shape", (
                "When a hypothesis is naturally disjunctive — or when a single argument won't "
                "cover everything — split: find cases that are EXHAUSTIVE (every possibility "
                "falls into some case) and prove the goal in EACH.\n\n"
                "Standard splitters: sign ($x < 0$, $x = 0$, $x > 0$), parity, remainders mod "
                "$m$, $x \\le y$ vs $x > y$, membership vs non-membership. Cases may overlap "
                "harmlessly; they must not leave gaps — exhaustiveness is the load-bearing "
                "claim, so SAY why the cases cover everything."
            )),
            (L, "Economy and symmetry", (
                "• WLOG ('without loss of generality'): when cases are symmetric — say the "
                "argument for $x \\le y$ works with letters swapped for $x > y$ — prove one "
                "and note the symmetry. Use it only when the symmetry is genuine and "
                "visible.\n\n"
                "• Choose splitters that make each case TRIVIAL: mod-3 remainders turn "
                "'$n^3 - n$ divisible by 3' into three one-liners.\n\n"
                "• Fewer cases beat more: before grinding 6 cases, look for an invariant that "
                "handles them uniformly — case explosions often signal a missed idea."
            )),
            (E, "Worked example", (
                "Claim: for every real $x$, $|x - 1| + |x + 1| \\ge 2$.\n\n"
                "Cases on where $x$ sits relative to $-1$ and $1$ (exhaustive by "
                "trichotomy):\n\n"
                "• $x \\ge 1$: sum $= (x - 1) + (x + 1) = 2x \\ge 2$ ✓.\n"
                "• $-1 \\le x < 1$: sum $= (1 - x) + (x + 1) = 2$ ✓.\n"
                "• $x < -1$: sum $= (1 - x) - (x + 1) = -2x > 2$ ✓. ∎\n\n"
                "Each case dissolved an absolute value — the splitter was chosen exactly "
                "where the absolute values change formula."
            )),
            (P, "Pitfalls", (
                "1. Missing a case ($x = 0$ forgotten in sign splits; $n$ divisible by 3 "
                "forgotten alongside 'remainder 1 or 2').\n\n"
                "2. Proving the same case twice in different notation while a real case goes "
                "missing.\n\n"
                "3. WLOG abuse — claiming symmetry that isn't there (the roles of $x$ and $y$ "
                "must actually be interchangeable in ALL of hypothesis and conclusion).\n\n"
                "4. Case conclusions that differ ('in case 1, $f(x) \\ge 2$; in case 2, "
                "$f(x) \\ge 1$') silently merged into the stronger claim.\n\n"
                "5. Not stating the exhaustiveness justification."
            )),
            (K, "Check yourself", (
                "You should be able to: pick natural exhaustive splitters, verify coverage, "
                "deploy WLOG honestly, and keep per-case goals identical.\n\n"
                "Self-test: prove $n^2 + n$ is even for every integer $n$ by cases. "
                "(Parity: both cases give even; or notice $n(n+1)$ — consecutive integers, "
                "one is even: the case-free proof.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PT.COUNTEREXAMPLE": {
        "summary": "Counterexamples: refuting universal claims with one checked witness.",
        "steps": [
            (L, "What a counterexample must do", (
                "A universal claim '$\\forall x, P(x) \\Rightarrow Q(x)$' is refuted by ONE "
                "object satisfying the hypothesis and violating the conclusion — both parts "
                "checked explicitly. The asymmetry of quantifiers: universals die from one "
                "witness; existentials are proven by one witness.\n\n"
                "A counterexample must be CONCRETE and VERIFIED: name the object, check "
                "$P$, check $\\neg Q$, with actual computation. 'It seems like large $n$ "
                "would fail' refutes nothing."
            )),
            (L, "Hunting technique", (
                "Where to look, in order of cheapness:\n\n"
                "• EDGE CASES: $0$, $1$, $-1$, negatives, the empty set, constant functions, "
                "equal inputs.\n"
                "• SMALL SEARCH: try $n = 1..10$ before theorizing.\n"
                "• EXTREME OBJECTS: highly composite numbers, discontinuous functions, "
                "the zero matrix, non-commuting matrices.\n"
                "• BOUNDARY of the hypothesis: objects barely satisfying $P$.\n\n"
                "Famous cautionary tale: $n^2 + n + 41$ is prime for $n = 0..39$ — and fails "
                "at $n = 40$. Many true-looking claims survive small search; a failed hunt "
                "is EVIDENCE for the claim and a hint to switch to proving it. The "
                "counterexample hunt and the proof attempt inform each other — where the "
                "proof keeps sticking is where the counterexample lives."
            )),
            (E, "Worked example", (
                "Claim: 'if $a \\mid bc$ then $a \\mid b$ or $a \\mid c$.'\n\n"
                "Try composite $a$ split across the product: $a = 6$, $b = 2$, $c = 3$. "
                "Check hypothesis: $6 \\mid 6$ ✓. Check conclusion: $6 \\nmid 2$ and "
                "$6 \\nmid 3$ ✓ violated.\n\n"
                "Refuted. And the failure is instructive: the claim IS true when $a$ is "
                "prime (Euclid's lemma) — the counterexample doesn't just kill the claim, it "
                "locates the missing hypothesis. Good counterexamples teach."
            )),
            (P, "Pitfalls", (
                "1. The witness fails the HYPOTHESIS — checking only the conclusion's "
                "violation.\n\n"
                "2. Arithmetic unchecked ('$91$ is prime' — it's $7 \\times 13$).\n\n"
                "3. 'Counterexample' to a statement misread (negate carefully first — "
                "especially claims with 'or' and nested quantifiers).\n\n"
                "4. Concluding a claim is TRUE from a failed 10-minute hunt.\n\n"
                "5. Exotic witnesses when $n = 2$ works — prefer the smallest, simplest "
                "counterexample; it exposes the failure mechanism most clearly."
            )),
            (K, "Check yourself", (
                "You should be able to: verify both halves of a counterexample, run the "
                "edge-case checklist, and extract the lesson a counterexample teaches.\n\n"
                "Self-test: refute 'every continuous function is differentiable.' "
                "($|x|$ at 0: continuous ✓, corner — not differentiable ✓.)\n\n"
                "Practice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PT.INDUCTION": {
        "summary": "Induction as a proof technique: writing airtight base-and-step arguments.",
        "steps": [
            (L, "The template, formalized", (
                "To prove $P(n)$ for all $n \\ge n_0$:\n\n"
                "1. State $P(n)$ PRECISELY (a named predicate, not a vibe).\n"
                "2. BASE: verify $P(n_0)$ by computation.\n"
                "3. STEP: 'Assume $P(k)$ for an arbitrary $k \\ge n_0$' — write the "
                "assumption out — then derive $P(k+1)$, citing the IH at the exact moment "
                "it's used.\n"
                "4. Conclude by induction.\n\n"
                "(DM04 covers the mechanics; this node is about writing them into proofs "
                "that survive scrutiny — the difference between knowing induction and "
                "wielding it.)"
            )),
            (L, "Beyond sums: structures and strengthening", (
                "Induction proves more than formulas:\n\n"
                "• DIVISIBILITY: $6 \\mid n^3 - n$ — the step massages $(k+1)^3 - (k+1)$ "
                "into $(k^3 - k) + 3k(k+1)$.\n"
                "• INEQUALITIES: $2^n > n^2$ for $n \\ge 5$ — the step needs its own small "
                "lemma ($2k^2 \\ge (k+1)^2$ for $k \\ge 3$).\n"
                "• STRUCTURES: trees, tilings, algorithms — induct on size, removing one "
                "element to invoke the IH.\n\n"
                "STRENGTHENING: sometimes $P(n)$ is unprovable by induction while a "
                "STRONGER $P'(n)$ goes through — the stronger IH gives the step more to "
                "work with (proving $\\sum \\frac{1}{n^2} < 2$ fails; proving "
                "$\\sum_{k \\le n} \\frac{1}{k^2} \\le 2 - \\frac 1n$ succeeds). "
                "Counterintuitive and essential."
            )),
            (E, "Worked example", (
                "Claim: $6 \\mid n^3 - n$ for all $n \\ge 0$.\n\n"
                "$P(n)$: '$n^3 - n$ is divisible by 6.' Base: $0^3 - 0 = 0 = 6 \\cdot 0$ ✓.\n\n"
                "Step: assume $6 \\mid k^3 - k$. Then\n"
                "$$(k+1)^3 - (k+1) = k^3 + 3k^2 + 2k = (k^3 - k) + 3k(k + 1).$$\n"
                "The first term is divisible by 6 (IH — cited here); the second is 3 times "
                "$k(k+1)$, a product of consecutive integers, hence even — so divisible by "
                "6. Sum of multiples of 6 is a multiple of 6. ∎"
            )),
            (P, "Pitfalls", (
                "1. The step never citing the IH (then it isn't induction — and usually "
                "isn't a proof).\n\n"
                "2. Assuming $P(k+1)$ or proving $P(k) \\to P(k)$ by circular algebra.\n\n"
                "3. Base case at the wrong index for the step's needs.\n\n"
                "4. Inequality steps that quietly reverse an inequality direction.\n\n"
                "5. 'Proof by pattern': verifying $P(1), P(2), P(3)$ and writing 'and so "
                "on' — the step must be for ARBITRARY $k$."
            )),
            (K, "Check yourself", (
                "You should be able to: write the four-part template from memory, run "
                "divisibility and inequality inductions, and strengthen a hypothesis when "
                "the step stalls.\n\n"
                "Self-test: prove $n! > 2^n$ for $n \\ge 4$. (Base: $24 > 16$; step: "
                "$(k+1)! = (k+1)k! > (k+1)2^k \\ge 2 \\cdot 2^k$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PT.STRONGIND": {
        "summary": "Strong induction and well-ordering: when the step needs deep history.",
        "steps": [
            (L, "The technique", (
                "STRONG induction: assume $P(n_0), \\ldots, P(k)$ ALL hold; prove "
                "$P(k+1)$. Use it when $k+1$'s truth depends on predecessors OTHER than "
                "$k$: prime factorization ($k + 1 = ab$ reaches down to $a, b$), "
                "recurrences reaching back two or more steps, algorithms that split input "
                "into unpredictable smaller pieces.\n\n"
                "BASE CASES must cover every value the step can't handle: a step using "
                "$P(k-1)$ and $P(k)$ needs TWO bases; a step splitting into arbitrary "
                "smaller pieces may need to handle primes/atoms inside the step itself."
            )),
            (L, "Well-ordering: the same tool, rotated", (
                "The WELL-ORDERING principle — every nonempty set of positive integers has "
                "a least element — is equivalent to strong induction and often cleaner: "
                "'suppose the claim fails; let $n$ be the SMALLEST counterexample; derive a "
                "smaller one (or a direct contradiction).' The minimal criminal argument.\n\n"
                "Example: every $n \\ge 2$ has a prime factor — a smallest $n$ without one "
                "can't be prime (it's its own), so $n = ab$ with $1 < a < n$; by "
                "minimality $a$ has a prime factor, which divides $n$. Contradiction.\n\n"
                "Choose whichever reads cleaner; they are interchangeable in power."
            )),
            (E, "Worked example", (
                "Claim: every amount $n \\ge 12$ of postage can be made with 4¢ and 5¢ "
                "stamps.\n\n"
                "Strong induction with FOUR bases: $12 = 4+4+4$, $13 = 4+4+5$, "
                "$14 = 4+5+5$, $15 = 5+5+5$ ✓.\n\n"
                "Step: for $k + 1 \\ge 16$, apply the IH to $(k + 1) - 4 \\ge 12$ — by "
                "strong induction it has a stamp combination; add one 4¢ stamp. ∎\n\n"
                "Why four bases: the step reaches back exactly 4 — values 12-15 are "
                "unreachable by the step and must be checked by hand. Base-case counting "
                "made visible."
            )),
            (P, "Pitfalls", (
                "1. Too few base cases for the step's reach (THE strong-induction "
                "error).\n\n"
                "2. The step's reached-back index falling below $n_0$ (check "
                "$(k+1) - 4 \\ge 12$ explicitly).\n\n"
                "3. Minimal-criminal proofs that forget to verify the constructed "
                "'smaller counterexample' actually satisfies the failure condition.\n\n"
                "4. Using strong induction where ordinary suffices — legal (strong "
                "subsumes ordinary) but muddier to read.\n\n"
                "5. Applying well-ordering to sets that may be EMPTY or aren't sets of "
                "positive integers (reals have no well-ordering by size)."
            )),
            (K, "Check yourself", (
                "You should be able to: count base cases from the step's reach, run "
                "minimal-criminal arguments, and convert between the two styles.\n\n"
                "Self-test: Fibonacci $F_n < 2^n$ — how many base cases does the natural "
                "step need? (Two: the step uses $F_{k-1}$ and $F_k$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PT.EPSILONDELTA": {
        "summary": "Epsilon-delta arguments: quantifier-precise limits, and the find-δ workflow.",
        "steps": [
            (L, "The definition, read as a game", (
                "$$\\lim_{x \\to a} f(x) = L \\;:\\; \\forall \\varepsilon > 0\\; \\exists \\delta > 0\\; "
                "\\forall x\\; (0 < |x - a| < \\delta \\Rightarrow |f(x) - L| < \\varepsilon).$$\n\n"
                "As a game: the adversary picks the tolerance $\\varepsilon$; you must "
                "produce a $\\delta$ (depending on $\\varepsilon$!) that forces $f$ within "
                "$\\varepsilon$ of $L$. Quantifier ORDER is everything — $\\delta$ comes "
                "after, and may depend on, $\\varepsilon$; never the reverse.\n\n"
                "Note $0 < |x - a|$: the value AT $a$ is irrelevant to the limit."
            )),
            (L, "The workflow", (
                "1. SCRATCH: manipulate $|f(x) - L|$ until $|x - a|$ factors out: "
                "$|f(x) - L| \\le M\\,|x - a|$ near $a$.\n"
                "2. The BOUND $M$ may need taming: preliminarily insist $\\delta \\le 1$, "
                "so $x$ lives in $(a - 1, a + 1)$, giving concrete bounds on other "
                "factors.\n"
                "3. CHOOSE $\\delta = \\min(1, \\frac{\\varepsilon}{M})$.\n"
                "4. WRITE FORWARD: 'let $\\varepsilon > 0$; set $\\delta = \\ldots$; "
                "suppose $0 < |x - a| < \\delta$; then...' — the scratch work reversed "
                "into a clean chain ending in $< \\varepsilon$.\n\n"
                "The $\\min$ trick is the fingerprint of a correct proof: one arm tames "
                "the nonlinear factor, the other delivers $\\varepsilon$."
            )),
            (E, "Worked example", (
                "Prove $\\lim_{x \\to 2} x^2 = 4$.\n\n"
                "Scratch: $|x^2 - 4| = |x + 2|\\,|x - 2|$. If $\\delta \\le 1$ then "
                "$1 < x < 3$, so $|x + 2| < 5$: $|x^2 - 4| < 5|x - 2|$.\n\n"
                "Proof. Let $\\varepsilon > 0$; set "
                "$\\delta = \\min(1, \\frac\\varepsilon 5)$. If $0 < |x - 2| < \\delta$, "
                "then $|x + 2| < 5$ (since $\\delta \\le 1$) and\n"
                "$$|x^2 - 4| = |x+2||x-2| < 5 \\cdot \\frac{\\varepsilon}{5} = \\varepsilon. \\;\\blacksquare$$"
            )),
            (P, "Pitfalls", (
                "1. $\\delta$ chosen before $\\varepsilon$, or 'depending on $x$' — "
                "quantifier order violations.\n\n"
                "2. Presenting the scratch work (goal-backwards) as the proof.\n\n"
                "3. Unbounded factors waved at ('$|x + 2|$ is about 4') instead of "
                "pinned with $\\delta \\le 1$.\n\n"
                "4. Dropping the $0 <$ in $0 < |x - a|$ (limits ignore the point "
                "itself).\n\n"
                "5. Negation errors when proving a limit FAILS — the negation is: "
                "$\\exists \\varepsilon$ such that $\\forall \\delta$, some $x$ within "
                "$\\delta$ misses by $\\varepsilon$ (DM02 pays its rent here)."
            )),
            (K, "Check yourself", (
                "You should be able to: run scratch-then-forward for polynomials and "
                "simple rationals, deploy the $\\min$ trick, and negate the definition "
                "correctly.\n\n"
                "Self-test: for $\\lim_{x \\to 3}(2x + 1) = 7$, what $\\delta$ works? "
                "($\\delta = \\frac{\\varepsilon}{2}$ — linear functions need no "
                "$\\min$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PT.EXISTUNIQ": {
        "summary": "Existence and uniqueness proofs: produce a witness, then show it's the only one.",
        "steps": [
            (L, "Two separate obligations", (
                "'There is exactly one $x$ with $P(x)$' is TWO claims:\n\n"
                "• EXISTENCE: some $x$ works. Prove constructively (build/exhibit it) or "
                "non-constructively (IVT, pigeonhole, extremal arguments — the witness "
                "exists though you can't name it).\n"
                "• UNIQUENESS: at most one works. Standard shape: 'suppose $x_1$ and "
                "$x_2$ both satisfy $P$; show $x_1 = x_2$.'\n\n"
                "Keep them SEPARATE — one section each. Neither implies the other, and "
                "graders (and readers) look for both explicitly."
            )),
            (L, "Technique notes", (
                "Existence:\n"
                "• Construction: solve for the witness, then VERIFY it (the solve may "
                "have used irreversible steps).\n"
                "• IVT-style: continuous $f$ with a sign change has a root — existence "
                "with no formula.\n\n"
                "Uniqueness:\n"
                "• Subtraction: two solutions of a linear problem differ by a solution "
                "of the homogeneous problem; show that's zero.\n"
                "• Monotonicity: strictly increasing functions hit each value at most "
                "once.\n"
                "• Algebraic cancellation — legal only when the cancellation itself is "
                "justified.\n\n"
                "The pattern is everywhere: unique prime factorization, unique matrix "
                "inverse, ODE.U1.N4's IVP theorem, unique fixed points."
            )),
            (E, "Worked example", (
                "Claim: the equation $x^3 + x = 5$ has exactly one real solution.\n\n"
                "EXISTENCE: $f(x) = x^3 + x - 5$ is continuous; $f(1) = -3 < 0$, "
                "$f(2) = 5 > 0$ — by the IVT a root exists in $(1, 2)$.\n\n"
                "UNIQUENESS: $f'(x) = 3x^2 + 1 > 0$ everywhere — $f$ is strictly "
                "increasing, so it crosses zero at most once. ∎\n\n"
                "Note the division of labor: IVT gave existence without a formula; "
                "monotonicity gave uniqueness without finding the root. Neither half "
                "alone answers the question."
            )),
            (P, "Pitfalls", (
                "1. Proving existence and asserting uniqueness (or vice versa).\n\n"
                "2. Construction without VERIFICATION — squaring, clearing "
                "denominators, and other irreversible moves manufacture fake "
                "witnesses.\n\n"
                "3. Uniqueness 'proofs' that divide by a quantity that could be zero.\n\n"
                "4. Showing two PARTICULAR candidates coincide instead of two ARBITRARY "
                "ones.\n\n"
                "5. Conflating 'at most one' (uniqueness alone) with 'exactly one' "
                "(both) — some problems ask for only one half."
            )),
            (K, "Check yourself", (
                "You should be able to: split the two obligations, choose constructive "
                "vs IVT existence, and run the two-solutions-collide argument.\n\n"
                "Self-test: prove every real has a unique cube root. (Existence: IVT on "
                "$t^3 - x$; uniqueness: $t^3$ strictly increasing.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "INTROPROOF": {
        "summary": "Introduction to proof: the techniques, how to choose among them, and how to write mathematics.",
        "steps": [
            (L, "What this course is for", (
                "The transition from computing answers to PROVING claims — the skill that "
                "separates using mathematics from doing it. The deliverables: fluency in "
                "the standard techniques (direct, contrapositive, contradiction, cases, "
                "induction, counterexample, epsilon-delta, existence-uniqueness), and the "
                "writing craft that makes an argument checkable by a stranger.\n\n"
                "Everything rests on the logic of DM01-DM02: implications, quantifiers, "
                "and negation are the grammar; the techniques are the rhetoric."
            )),
            (L, "Choosing a technique", (
                "A decision guide, not a law:\n\n"
                "• Default: DIRECT — unwrap, compute, rewrap.\n"
                "• Conclusion hard to grab, negations concrete → CONTRAPOSITIVE.\n"
                "• Claim is a negative ('no', 'irrational', 'infinite') → CONTRADICTION.\n"
                "• Hypothesis splits naturally (sign/parity/mod) → CASES.\n"
                "• Claim indexed by $n$ → INDUCTION (strong if history is needed).\n"
                "• Suspect the claim is FALSE → hunt a COUNTEREXAMPLE (the hunt and the "
                "proof attempt inform each other).\n"
                "• Limits and approximation → EPSILON-DELTA.\n"
                "• 'Exactly one' → EXISTENCE + UNIQUENESS, separately.\n\n"
                "Stuck for 20 minutes? Switch techniques — the second tool often opens "
                "the first's lock."
            )),
            (E, "A signature problem", (
                "Prove: $\\sqrt 2$ is irrational.\n\n"
                "Suppose $\\sqrt 2 = \\frac p q$ in lowest terms. Then $p^2 = 2q^2$, so "
                "$p^2$ is even, so $p$ is even (the CONTRAPOSITIVE lemma: odd² is odd) — "
                "$p = 2m$. Then $4m^2 = 2q^2$, so $q^2 = 2m^2$: $q$ even too — "
                "contradicting lowest terms. ∎\n\n"
                "Why it's the signature: one short proof composing THREE techniques "
                "(contradiction as the frame, contrapositive as the lemma, and the "
                "well-ordering fact behind 'lowest terms'). Technique composition is the "
                "real curriculum."
            )),
            (P, "Course-level traps", (
                "1. Proof by example / by picture / by 'clearly.'\n\n"
                "2. Assuming what's to be proven (circularity, often disguised by "
                "notation).\n\n"
                "3. Quantifier negligence — the source of most wrong proofs "
                "at this level.\n\n"
                "4. Writing scratch-work order instead of logical order.\n\n"
                "5. Symbol soup: proofs are PROSE with formulas embedded — sentences, "
                "words like 'suppose', 'then', 'therefore', and a stated conclusion."
            )),
            (K, "How to work this course", (
                "For each technique node: read the template, reproduce the worked "
                "example COLD (book closed), then practice. Keep a mistake journal — "
                "wrong proofs teach more than right ones when autopsied.\n\n"
                "Order: DIRECT → CONTRAPOS → CONTRADICTION → CASES → COUNTEREXAMPLE → "
                "INDUCTION → STRONGIND → EXISTUNIQ → EPSILONDELTA (the hardest "
                "quantifier work last).\n\n"
                "Self-test: state, from memory, when contradiction beats contrapositive "
                "— and what W(ithout)L(oss)O(f)G(enerality) requires before you may "
                "write it."
            )),
        ],
    },
}
