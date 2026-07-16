"""Coursework: Discrete Mathematics nodes DM01-DM14 + the DISC survey.

Five steps per lesson: two readings, a worked example, pitfalls, check.
"""

L = "reading"
E = "example"
P = "pitfall"
K = "check"

LESSONS: dict[str, dict] = {
    # ------------------------------------------------------------------
    "DM01": {
        "summary": "Propositional logic: connectives, truth tables, equivalence, and De Morgan's laws.",
        "steps": [
            (L, "Propositions and connectives", (
                "A proposition is a statement that is definitely true or false. Connectives build compounds: "
                "$\\neg p$ (not), $p \\land q$ (and), $p \\lor q$ (or — INCLUSIVE), $p \\to q$ (if-then), "
                "$p \\leftrightarrow q$ (iff).\n\n"
                "The conditional's truth table is the one that surprises: $p \\to q$ is false ONLY when $p$ is "
                "true and $q$ is false. A false hypothesis makes the whole conditional vacuously true — 'if pigs "
                "fly, then 2+2=5' is a true statement."
            )),
            (L, "Equivalence and De Morgan", (
                "Two compounds are logically equivalent ($\\equiv$) when their truth tables match on every row. "
                "The workhorse equivalences:\n\n"
                "• De Morgan: $\\neg(p \\land q) \\equiv \\neg p \\lor \\neg q$ and "
                "$\\neg(p \\lor q) \\equiv \\neg p \\land \\neg q$ — negation flips and/or.\n"
                "• Conditional unwrapped: $p \\to q \\equiv \\neg p \\lor q$.\n"
                "• Contrapositive: $p \\to q \\equiv \\neg q \\to \\neg p$ (but NOT the converse $q \\to p$).\n\n"
                "A tautology is true on every row; a contradiction false on every row."
            )),
            (E, "Worked example", (
                "Show $\\neg(p \\to q) \\equiv p \\land \\neg q$.\n\n"
                "Unwrap the conditional: $\\neg(p \\to q) \\equiv \\neg(\\neg p \\lor q)$. De Morgan: "
                "$\\equiv p \\land \\neg q$. ∎\n\n"
                "Reading: the ONLY way an if-then fails is hypothesis true, conclusion false — exactly what the "
                "truth table said, now derived algebraically. Negating 'if it rains, I bring an umbrella' is "
                "'it rains AND I don't' — never 'if it doesn't rain...'."
            )),
            (P, "Pitfalls", (
                "1. Negating a conditional into another conditional — the negation is an AND, as above.\n\n"
                "2. Confusing converse ($q \\to p$), inverse ($\\neg p \\to \\neg q$), and contrapositive: only "
                "the contrapositive is equivalent to the original.\n\n"
                "3. Reading 'or' as exclusive — mathematical or allows both.\n\n"
                "4. De Morgan without flipping the connective (negating the parts but keeping the and/or)."
            )),
            (K, "Check yourself", (
                "You should be able to: build truth tables, verify equivalences two ways (tables and algebra), "
                "and negate compound statements cleanly.\n\n"
                "Self-test: negate 'I study and I pass, or I retake.' "
                "($\\neg((s \\land p) \\lor r) \\equiv (\\neg s \\lor \\neg p) \\land \\neg r$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "DM02": {
        "summary": "Predicates and quantifiers: for-all, there-exists, and negating quantified statements.",
        "steps": [
            (L, "Predicates and the two quantifiers", (
                "A predicate $P(x)$ becomes a proposition once quantified over a domain:\n"
                "$$\\forall x\\, P(x) \\;(\\text{every } x), \\qquad \\exists x\\, P(x) \\;(\\text{at least one } x).$$\n\n"
                "Order matters when quantifiers nest: $\\forall x\\, \\exists y\\, (y > x)$ is TRUE over the "
                "reals (every number has something bigger), while $\\exists y\\, \\forall x\\, (y > x)$ is "
                "FALSE (no single number beats everything). Swapping $\\forall\\exists$ to $\\exists\\forall$ "
                "changes the claim from 'each has its own' to 'one works for all.'"
            )),
            (L, "Negation: flip and push", (
                "Negation flips each quantifier as it passes through:\n"
                "$$\\neg \\forall x\\, P(x) \\equiv \\exists x\\, \\neg P(x), \\qquad "
                "\\neg \\exists x\\, P(x) \\equiv \\forall x\\, \\neg P(x).$$\n\n"
                "For nested statements, push the negation inward one quantifier at a time, then negate the "
                "inner predicate (De Morgan and the conditional rule from DM01 finish the job).\n\n"
                "This mechanical skill is what makes epsilon-delta proofs (PT.EPSILONDELTA) writable: the "
                "negation of a limit definition is a precise recipe for a counterexample."
            )),
            (E, "Worked example", (
                "Negate: 'Every student has taken some class in every department' — "
                "$\\forall s\\, \\forall d\\, \\exists c\\, T(s, d, c)$.\n\n"
                "Push the negation through all three:\n"
                "$$\\exists s\\, \\exists d\\, \\forall c\\, \\neg T(s, d, c)$$\n"
                "— 'some student and some department exist such that the student has taken NO class in that "
                "department.' Each $\\forall$ became $\\exists$ and vice versa; the predicate flipped at the end."
            )),
            (P, "Pitfalls", (
                "1. Negating $\\forall x P(x)$ as $\\forall x \\neg P(x)$ ('everyone fails') instead of "
                "$\\exists x \\neg P(x)$ ('someone fails').\n\n"
                "2. Treating $\\forall x \\exists y$ and $\\exists y \\forall x$ as interchangeable.\n\n"
                "3. Quantifying over the wrong domain — 'for all $x$' means all $x$ IN THE STATED DOMAIN.\n\n"
                "4. In English, 'any' is ambiguous (sometimes $\\forall$, sometimes $\\exists$) — translate to "
                "symbols before reasoning."
            )),
            (K, "Check yourself", (
                "You should be able to: translate between English and quantified logic, evaluate nested "
                "quantifiers, and negate mechanically.\n\n"
                "Self-test: negate $\\exists x\\, \\forall y\\, (x + y = 0)$ and decide which is true over "
                "$\\mathbb{Z}$. (Negation: $\\forall x\\, \\exists y\\, (x + y \\ne 0)$ — the negation is true; "
                "no single $x$ sums to 0 with EVERY $y$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "DM03": {
        "summary": "Direct proof and counterexample: proving universal claims, disproving with one witness.",
        "steps": [
            (L, "The shape of a direct proof", (
                "To prove 'for all $x$, if $P(x)$ then $Q(x)$': take an ARBITRARY $x$ with property $P$, and "
                "derive $Q$ by definitions and known facts. Because $x$ was arbitrary, the conclusion holds for "
                "all.\n\n"
                "The rhythm: unwrap definitions → algebra/logic in the middle → rewrap into the goal's "
                "definition. Example skeleton for 'the sum of two even numbers is even': let $m = 2a$, "
                "$n = 2b$ (unwrap); $m + n = 2(a + b)$ (algebra); which is even (rewrap). ∎"
            )),
            (L, "Disproof: one counterexample suffices", (
                "A universal claim dies from a single counterexample — one concrete $x$ satisfying $P$ but not "
                "$Q$. Disproving 'all primes are odd' needs only: 2.\n\n"
                "The asymmetry is the point: proving $\\forall$ requires an argument for EVERY case; disproving "
                "requires ONE witness. (Conversely, proving $\\exists$ needs one witness; disproving it needs a "
                "universal argument.) Checking five examples proves nothing universal — examples build "
                "confidence, proofs build truth."
            )),
            (E, "Worked example", (
                "Claim: if $n$ is odd, then $n^2$ is odd.\n\n"
                "Proof: let $n$ be odd, so $n = 2k + 1$ for some integer $k$. Then\n"
                "$$n^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1,$$\n"
                "which is of the form $2m + 1$ — odd. ∎\n\n"
                "Disproof drill: 'for all reals, $x^2 \\ge x$.' Counterexample: $x = \\frac{1}{2}$ gives "
                "$\\frac 1 4 < \\frac 1 2$. Claim dead."
            )),
            (P, "Pitfalls", (
                "1. Proving by example: verifying $P \\to Q$ for $x = 1, 2, 3$ is evidence, not proof.\n\n"
                "2. Assuming the conclusion: starting from $Q$ and working backwards is exploration; a proof "
                "runs forward from hypotheses (or clearly flags 'working backwards, steps reversible').\n\n"
                "3. Using the same letter for two different things ($m = 2k$, $n = 2k$ forces $m = n$ — use "
                "$2a$, $2b$).\n\n"
                "4. A counterexample must satisfy the HYPOTHESIS and violate the CONCLUSION — check both."
            )),
            (K, "Check yourself", (
                "You should be able to: write arbitrary-element proofs with the unwrap-algebra-rewrap rhythm, "
                "and kill false universals with a single checked witness.\n\n"
                "Self-test: prove or disprove — 'the product of two irrationals is irrational.' "
                "(Disprove: $\\sqrt 2 \\cdot \\sqrt 2 = 2$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "DM04": {
        "summary": "Induction: base case plus inductive step; strong induction when one predecessor isn't enough.",
        "steps": [
            (L, "Ordinary induction", (
                "To prove $P(n)$ for all integers $n \\ge n_0$:\n\n"
                "1. BASE: verify $P(n_0)$.\n"
                "2. STEP: assume $P(k)$ for an arbitrary $k \\ge n_0$ (the inductive hypothesis, IH) and prove "
                "$P(k+1)$.\n\n"
                "The dominoes picture: the base tips the first; the step guarantees each knocks the next. Both "
                "parts are load-bearing — a step without a base proves nothing (all dominoes wired, none "
                "tipped)."
            )),
            (L, "Strong induction", (
                "Sometimes $P(k+1)$ needs more history than $P(k)$: assume $P(n_0), \\ldots, P(k)$ ALL hold, "
                "then prove $P(k+1)$.\n\n"
                "The canonical use: every integer $n \\ge 2$ is a product of primes. If $k+1$ is prime, done; "
                "if composite, $k+1 = ab$ with BOTH factors somewhere below $k+1$ — ordinary induction's single "
                "predecessor can't reach them, strong induction's full history can.\n\n"
                "Watch the base cases: a recurrence reaching back two steps ($a_n$ from $a_{n-1}$ and "
                "$a_{n-2}$) needs TWO base cases."
            )),
            (E, "Worked example", (
                "Claim: $1 + 2 + \\cdots + n = \\dfrac{n(n+1)}{2}$ for all $n \\ge 1$.\n\n"
                "Base ($n=1$): LHS $= 1$, RHS $= \\frac{1 \\cdot 2}{2} = 1$ ✓.\n\n"
                "Step: assume $1 + \\cdots + k = \\frac{k(k+1)}{2}$. Then\n"
                "$$1 + \\cdots + k + (k+1) \\overset{\\text{IH}}{=} \\frac{k(k+1)}{2} + (k+1) "
                "= (k+1)\\left(\\frac{k}{2} + 1\\right) = \\frac{(k+1)(k+2)}{2},$$\n"
                "which is the formula at $n = k+1$. ∎ — note the exact moment the IH is invoked, and that "
                "everything else is algebra."
            )),
            (P, "Pitfalls", (
                "1. Skipping the base case, or checking the wrong one (claims starting at $n = 4$ need "
                "$P(4)$).\n\n"
                "2. Assuming $P(k+1)$ in the step — that is assuming the goal; the IH is $P(k)$ only.\n\n"
                "3. Steps that secretly need $k \\ge 2$: the notorious 'all horses are the same color' fake "
                "proof breaks exactly where the step first fails ($k = 1 \\to 2$).\n\n"
                "4. Strong induction with insufficient base cases for how far the step reaches back.\n\n"
                "5. Never actually USING the IH — if the step doesn't cite it, it isn't induction (or the "
                "proof is wrong)."
            )),
            (K, "Check yourself", (
                "You should be able to: run both inductions with explicit base, IH, and step, and diagnose "
                "broken induction 'proofs' by finding where the step fails.\n\n"
                "Self-test: prove $2^n > n^2$ for $n \\ge 5$. "
                "(Base: $32 > 25$. Step uses $2^{k+1} = 2 \\cdot 2^k > 2k^2 \\ge (k+1)^2$ for $k \\ge 5$.)\n\n"
                "Practice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "DM05": {
        "summary": "Sets: union, intersection, complement, power sets, and Venn reasoning.",
        "steps": [
            (L, "The language of sets", (
                "A set is an unordered collection without repetition. Core operations: union $A \\cup B$, "
                "intersection $A \\cap B$, difference $A \\setminus B$, complement $\\overline A$ (relative to a "
                "universe $U$).\n\n"
                "Containment: $A \\subseteq B$ means every element of $A$ is in $B$; equality is containment "
                "both ways — and that's how set identities are PROVED: take $x \\in$ LHS, chase definitions to "
                "$x \\in$ RHS, then reverse.\n\n"
                "De Morgan returns at the set level: $\\overline{A \\cup B} = \\overline A \\cap \\overline B$."
            )),
            (L, "Power sets and cardinality bookkeeping", (
                "The power set $\\mathcal{P}(A)$ is the set of ALL subsets of $A$ — including $\\emptyset$ and "
                "$A$ itself. If $|A| = n$ then $|\\mathcal{P}(A)| = 2^n$ (each element is in or out — DM07's "
                "product rule in disguise).\n\n"
                "Careful distinctions that get tested: $\\emptyset \\ne \\{\\emptyset\\}$ (empty box vs box "
                "containing an empty box); $x \\in A$ vs $\\{x\\} \\subseteq A$ (element vs subset); "
                "$|A \\cup B| = |A| + |B| - |A \\cap B|$ (inclusion-exclusion's smallest case)."
            )),
            (E, "Worked example", (
                "Let $A = \\{1, 2\\}$. Then\n"
                "$$\\mathcal P(A) = \\{\\emptyset, \\{1\\}, \\{2\\}, \\{1,2\\}\\}, \\qquad |\\mathcal P(A)| = 4 = 2^2.$$\n\n"
                "Identity proof sketch — $A \\setminus B = A \\cap \\overline B$: "
                "$x \\in A \\setminus B \\iff x \\in A$ and $x \\notin B \\iff x \\in A$ and "
                "$x \\in \\overline B \\iff x \\in A \\cap \\overline B$. Both directions in one chain of "
                "iffs. ∎"
            )),
            (P, "Pitfalls", (
                "1. $\\in$ vs $\\subseteq$ confusion — the most common set-theory error at every level "
                "(is $\\{1\\} \\in \\{1, 2\\}$? No. $\\subseteq$? Yes).\n\n"
                "2. Forgetting $\\emptyset$ and $A$ itself in power sets.\n\n"
                "3. $|A \\cup B| = |A| + |B|$ without subtracting the overlap.\n\n"
                "4. Venn diagrams as proofs: for two or three sets they're reliable guides; the actual proof is "
                "the element-chase.\n\n"
                "5. Difference is not symmetric: $A \\setminus B \\ne B \\setminus A$."
            )),
            (K, "Check yourself", (
                "You should be able to: compute with all the operations, enumerate power sets, prove identities "
                "by element-chasing, and count unions correctly.\n\n"
                "Self-test: how many subsets of $\\{1,...,5\\}$ contain the element 1? "
                "($2^4 = 16$ — fix 1 in, choose the rest freely.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "DM06": {
        "summary": "Functions and relations: injective, surjective, bijective; equivalence relations and partitions.",
        "steps": [
            (L, "Functions and their three adjectives", (
                "A function $f: A \\to B$ assigns EXACTLY ONE output to each input. The three properties:\n\n"
                "• INJECTIVE (one-to-one): different inputs, different outputs — $f(x_1) = f(x_2) \\Rightarrow "
                "x_1 = x_2$.\n"
                "• SURJECTIVE (onto): every element of $B$ is hit — $\\forall b\\, \\exists a\\, f(a) = b$.\n"
                "• BIJECTIVE: both — a perfect pairing, which is exactly when an inverse function exists.\n\n"
                "Adjectives depend on the DECLARED domain and codomain: $f(x) = x^2$ is not injective on "
                "$\\mathbb R$, but is on $[0, \\infty)$; not surjective onto $\\mathbb R$, but is onto "
                "$[0, \\infty)$."
            )),
            (L, "Relations and equivalence", (
                "A relation on $A$ is any set of ordered pairs. The special ones — equivalence relations — are "
                "reflexive ($a \\sim a$), symmetric ($a \\sim b \\Rightarrow b \\sim a$), and transitive "
                "($a \\sim b, b \\sim c \\Rightarrow a \\sim c$).\n\n"
                "The fundamental theorem: an equivalence relation on $A$ is the same thing as a PARTITION of "
                "$A$ into disjoint classes — 'same remainder mod 5' chops the integers into exactly 5 classes. "
                "This idea (quotienting by an equivalence) powers modular arithmetic (DM11) and half of "
                "abstract algebra."
            )),
            (E, "Worked example", (
                "Prove $f: \\mathbb R \\to \\mathbb R$, $f(x) = 3x - 7$, is a bijection.\n\n"
                "Injective: $3x_1 - 7 = 3x_2 - 7 \\Rightarrow x_1 = x_2$ ✓.\n"
                "Surjective: given $y$, solve $y = 3x - 7$: $x = \\frac{y + 7}{3}$ exists in $\\mathbb R$ ✓.\n\n"
                "Both proofs together hand you the inverse: $f^{-1}(y) = \\frac{y+7}{3}$.\n\n"
                "Relation check: 'same parity' on $\\mathbb Z$ — reflexive ✓, symmetric ✓, transitive ✓: an "
                "equivalence relation, with classes = evens and odds."
            )),
            (P, "Pitfalls", (
                "1. Proving injectivity by example, or by 'each input has one output' (that's just being a "
                "function).\n\n"
                "2. Ignoring the codomain when judging surjectivity — onto WHAT is part of the claim.\n\n"
                "3. Horizontal vs vertical line tests swapped (vertical: is it a function; horizontal: "
                "injective).\n\n"
                "4. Verifying symmetric and transitive but forgetting reflexive (or checking reflexivity on one "
                "example).\n\n"
                "5. Assuming every relation is an equivalence — $\\le$ is reflexive and transitive but not "
                "symmetric."
            )),
            (K, "Check yourself", (
                "You should be able to: prove/disprove each adjective from the definitions, build inverses of "
                "bijections, verify equivalence relations, and describe their classes.\n\n"
                "Self-test: is $f: \\mathbb Z \\to \\mathbb Z$, $f(n) = 2n$, injective? surjective? "
                "(Injective yes; surjective no — odd targets are never hit.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "DM07": {
        "summary": "The sum and product rules: decomposing counting problems into stages and cases.",
        "steps": [
            (L, "The two primitive rules", (
                "PRODUCT rule: a procedure done in stages, with $n_1$ options at stage 1 and $n_2$ at stage 2 "
                "(regardless of the first choice), has $n_1 n_2$ outcomes. Chain any number of stages.\n\n"
                "SUM rule: if the outcomes split into DISJOINT cases with $n_1$ and $n_2$ possibilities, the "
                "total is $n_1 + n_2$.\n\n"
                "The discipline: stages multiply, cases add. Every counting formula in DM08-DM09 is these two "
                "rules composed."
            )),
            (L, "Complement counting", (
                "'At least one' problems usually count faster from the other side:\n"
                "$$\\#(\\text{at least one}) = \\#(\\text{total}) - \\#(\\text{none}).$$\n\n"
                "Passwords with at least one digit = all passwords − passwords with NO digits. The direct "
                "route (casework on exactly 1, 2, 3... digits) is longer and error-prone.\n\n"
                "When cases OVERLAP, the sum rule needs correction — that is inclusion-exclusion (DM09)."
            )),
            (E, "Worked example", (
                "How many 4-character codes use letters (26) and digits (10), starting with a letter, with at "
                "least one digit?\n\n"
                "Total with letter start: $26 \\cdot 36^3$. Codes with NO digit: $26 \\cdot 26^3 = 26^4$.\n\n"
                "$$26 \\cdot 36^3 - 26^4 = 26(36^3 - 26^3) = 26(46656 - 17576) = 26 \\cdot 29080 = 756{,}080.$$\n\n"
                "Stages multiplied within each count; the 'at least' handled by complement."
            )),
            (P, "Pitfalls", (
                "1. Adding when stages should multiply, or multiplying overlapping cases.\n\n"
                "2. Stage counts that depend on earlier choices (no repetition allowed → later stages shrink: "
                "$26 \\cdot 25 \\cdot 24$, not $26^3$).\n\n"
                "3. Double counting when cases aren't disjoint — the sum rule's hypothesis is disjointness.\n\n"
                "4. 'At least one' by direct casework when the complement is one subtraction.\n\n"
                "5. Forgetting order: stages impose an order; if the problem doesn't care about order, DM08's "
                "combinations are coming."
            )),
            (K, "Check yourself", (
                "You should be able to: decompose into stages and cases, keep them straight, and reach for the "
                "complement on 'at least' problems.\n\n"
                "Self-test: how many subsets of a 6-element set are nonempty? ($2^6 - 1 = 63$ — complement of "
                "'empty'.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "DM08": {
        "summary": "Permutations and combinations: ordered vs unordered selection, and binomial coefficients.",
        "steps": [
            (L, "Ordered: permutations", (
                "Arrangements of $n$ distinct objects: $n!$. Choosing and arranging $r$ of $n$:\n"
                "$$P(n, r) = \\frac{n!}{(n-r)!} = n(n-1)\\cdots(n-r+1).$$\n\n"
                "The question that decides everything: DOES ORDER MATTER? Race podiums, passwords, seatings — "
                "yes. Committees, hands of cards, pizza toppings — no."
            )),
            (L, "Unordered: combinations", (
                "Choosing $r$ of $n$ without order:\n"
                "$$\\binom{n}{r} = \\frac{n!}{r!(n-r)!} = \\frac{P(n,r)}{r!}$$\n"
                "— arrange, then divide out the $r!$ orderings you didn't want. Symmetry "
                "$\\binom n r = \\binom n {n-r}$ (choosing who's in = choosing who's out).\n\n"
                "The binomial theorem names them: $(x + y)^n = \\sum_r \\binom n r x^{n-r} y^r$ — the "
                "coefficient counts which factors donate a $y$."
            )),
            (E, "Worked example", (
                "A 12-person club forms a 4-person committee: $\\binom{12}{4} = \\frac{12 \\cdot 11 \\cdot 10 \\cdot 9}{4!} = 495$.\n\n"
                "Same club elects president, VP, treasurer: $P(12, 3) = 12 \\cdot 11 \\cdot 10 = 1320$ — order "
                "(titles) matters.\n\n"
                "Mixed: committee of 4 with exactly 2 of the 5 seniors: choose seniors, then juniors — "
                "$\\binom 5 2 \\binom 7 2 = 10 \\cdot 21 = 210$ (product rule stitching two combinations)."
            )),
            (P, "Pitfalls", (
                "1. Using $P$ where $\\binom{}{}$ belongs (overcounting by $r!$) or vice versa — always answer "
                "'does order matter?' FIRST, in writing.\n\n"
                "2. 'At least 2 seniors' computed as $\\binom 5 2 \\binom {10}{2}$ — that double-counts; sum the "
                "exact cases or use complement.\n\n"
                "3. Repetition allowed vs not: $26^3$ vs $26 \\cdot 25 \\cdot 24$ — read the problem.\n\n"
                "4. Arithmetic with factorials: cancel BEFORE multiplying; $\\frac{12!}{8!}$ is four factors, "
                "not two giant numbers."
            )),
            (K, "Check yourself", (
                "You should be able to: classify order/no-order instantly, compute both formulas fluently, and "
                "compose them with the sum/product rules.\n\n"
                "Self-test: how many 5-card hands from 52 are all hearts? "
                "($\\binom{13}{5} = 1287$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "DM09": {
        "summary": "Pigeonhole and inclusion-exclusion: guaranteed collisions, and counting unions without double counting.",
        "steps": [
            (L, "The pigeonhole principle", (
                "If $n + 1$ pigeons occupy $n$ holes, some hole holds at least two. Generalized: with $N$ "
                "objects in $k$ boxes, some box holds at least $\\lceil N/k \\rceil$.\n\n"
                "The craft is CHOOSING the holes: to show two of 13 people share a birth month, holes = months. "
                "To show two numbers among any 51 chosen from $1..100$ differ by exactly 50, holes = the pairs "
                "$\\{1,51\\}, \\{2,52\\}, \\ldots$ — 50 holes, 51 numbers, done. The principle is trivial; the "
                "hole design is the proof."
            )),
            (L, "Inclusion-exclusion", (
                "Counting a union must un-double-count the overlaps:\n"
                "$$|A \\cup B| = |A| + |B| - |A \\cap B|,$$\n"
                "$$|A \\cup B \\cup C| = |A|+|B|+|C| - |A\\cap B| - |A \\cap C| - |B \\cap C| + |A \\cap B \\cap C|.$$\n\n"
                "The sign pattern alternates: add singles, subtract pairs, add triples... Each element ends up "
                "counted exactly once (the binomial theorem guarantees it).\n\n"
                "Classic use: how many integers in $1..1000$ are divisible by 2, 3, or 5? Count each, fix the "
                "overlaps."
            )),
            (E, "Worked example", (
                "Integers in $1..1000$ divisible by 2, 3, or 5:\n\n"
                "Singles: $500 + 333 + 200$. Pairs (divisible by 6, 10, 15): $166 + 100 + 66$. "
                "Triple (by 30): $33$.\n\n"
                "$$500 + 333 + 200 - 166 - 100 - 66 + 33 = 734.$$\n\n"
                "Pigeonhole drill: any 5 points in a unit square — two are within $\\frac{\\sqrt 2}{2}$. "
                "(Holes: quarter the square into four $\\frac 1 2 \\times \\frac 1 2$ cells; 5 points, 4 cells; "
                "a shared cell's diagonal is $\\frac{\\sqrt 2}{2}$.)"
            )),
            (P, "Pitfalls", (
                "1. Inclusion-exclusion with missing terms or wrong signs — write ALL intersections, alternate "
                "strictly.\n\n"
                "2. Floor-function slips: multiples of 3 up to 1000 number $\\lfloor 1000/3 \\rfloor = 333$, "
                "not 333.3.\n\n"
                "3. Pigeonhole 'proofs' that never say what the holes are — no holes, no proof.\n\n"
                "4. Off-by-one in the guarantee: $n$ pigeons in $n$ holes guarantee NOTHING; the principle "
                "needs $n + 1$.\n\n"
                "5. Intersections mis-modeled: divisible by 2 AND 3 means divisible by 6 (lcm), not 5."
            )),
            (K, "Check yourself", (
                "You should be able to: design pigeonhole arguments (choose the holes), and run "
                "inclusion-exclusion with disciplined signs.\n\n"
                "Self-test: minimum people to guarantee two share a birthday month AND day-of-week pair? "
                "(Holes $= 12 \\times 7 = 84$; need 85.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "DM10": {
        "summary": "Recurrence relations: modeling with recurrences, and closed forms for linear cases.",
        "steps": [
            (L, "Modeling with recurrences", (
                "A recurrence defines each term from earlier ones: $a_n = f(a_{n-1}, a_{n-2}, \\ldots)$ plus "
                "initial conditions. They arise wherever a size-$n$ problem decomposes into smaller copies: "
                "Fibonacci's $F_n = F_{n-1} + F_{n-2}$, compound interest $a_n = 1.05\\, a_{n-1}$, Tower of "
                "Hanoi $h_n = 2h_{n-1} + 1$.\n\n"
                "Modeling skill: condition on the FIRST choice. Counting binary strings without '11': strings "
                "of length $n$ start with 0 (then anything valid of length $n-1$) or '10' (then valid of length "
                "$n-2$) — so $a_n = a_{n-1} + a_{n-2}$."
            )),
            (L, "Solving linear recurrences", (
                "For constant-coefficient linear recurrences $a_n = c_1 a_{n-1} + c_2 a_{n-2}$: guess "
                "$a_n = r^n$, get the CHARACTERISTIC equation $r^2 = c_1 r + c_2$.\n\n"
                "• Distinct roots $r_1, r_2$: $a_n = A r_1^n + B r_2^n$.\n"
                "• Repeated root $r$: $a_n = (A + Bn) r^n$.\n\n"
                "Fit $A, B$ to the initial conditions. (The same machinery, verbatim, solves ODE.U2's "
                "differential equations — one of mathematics' great rhymes.)"
            )),
            (E, "Worked example", (
                "Solve $a_n = 5a_{n-1} - 6a_{n-2}$, $a_0 = 2$, $a_1 = 5$.\n\n"
                "Characteristic: $r^2 - 5r + 6 = 0 \\Rightarrow r = 2, 3$.\n\n"
                "General: $a_n = A \\cdot 2^n + B \\cdot 3^n$. Conditions: $A + B = 2$, $2A + 3B = 5$ "
                "$\\Rightarrow B = 1, A = 1$.\n\n"
                "$$a_n = 2^n + 3^n.$$\n"
                "Check at $n = 2$: recurrence gives $5 \\cdot 5 - 6 \\cdot 2 = 13$; formula gives $4 + 9 = 13$ ✓."
            )),
            (P, "Pitfalls", (
                "1. Sign slips moving the recurrence to characteristic form: $a_n = 5a_{n-1} - 6a_{n-2}$ gives "
                "$r^2 - 5r + 6$, not $r^2 + 5r - 6$.\n\n"
                "2. Repeated roots handled as distinct (missing the $n$ factor).\n\n"
                "3. Fitting constants with the wrong indices — use the ACTUAL initial terms given.\n\n"
                "4. Modeling errors: overlapping cases when conditioning on the first step (cases must "
                "partition).\n\n"
                "5. Not verifying the closed form on a term the fit didn't use — a free correctness check."
            )),
            (K, "Check yourself", (
                "You should be able to: model counting problems as recurrences, solve the linear "
                "constant-coefficient cases, and verify closed forms.\n\n"
                "Self-test: solve $a_n = 4a_{n-1} - 4a_{n-2}$, $a_0 = 1$, $a_1 = 4$. "
                "(Repeated root 2: $a_n = (1 + n)2^n$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "DM11": {
        "summary": "Modular arithmetic: congruences, inverses mod m, and applications.",
        "steps": [
            (L, "Congruence", (
                "$a \\equiv b \\pmod m$ means $m \\mid (a - b)$ — same remainder on division by $m$. It is an "
                "equivalence relation (DM06), and it RESPECTS arithmetic: congruences add, subtract, and "
                "multiply term by term.\n\n"
                "That compatibility is the superpower: to find $7^{100} \\bmod 10$, never compute $7^{100}$ — "
                "track powers of 7 mod 10: $7, 9, 3, 1, 7, 9, \\ldots$ (period 4), and $100 \\equiv 0 \\pmod 4$ "
                "lands on $1$."
            )),
            (L, "Division: inverses mod m", (
                "Division is NOT free: $a$ has a multiplicative inverse mod $m$ exactly when "
                "$\\gcd(a, m) = 1$. Find it with the extended Euclidean algorithm (back-substitute "
                "$\\gcd = 1 = ax + my$; then $x$ is $a^{-1}$).\n\n"
                "When $\\gcd(a, m) \\ne 1$, cancellation fails: $2 \\cdot 3 \\equiv 2 \\cdot 8 \\pmod{10}$ but "
                "$3 \\not\\equiv 8$. Applications everywhere: check digits (ISBN), hashing, cryptography's RSA "
                "runs on exactly this arithmetic."
            )),
            (E, "Worked example", (
                "Solve $7x \\equiv 3 \\pmod{26}$.\n\n"
                "$\\gcd(7, 26) = 1$, so $7^{-1}$ exists. Extended Euclid: $26 = 3\\cdot 7 + 5$, "
                "$7 = 1 \\cdot 5 + 2$, $5 = 2 \\cdot 2 + 1$. Back-substitute: "
                "$1 = 5 - 2\\cdot 2 = 5 - 2(7 - 5) = 3\\cdot 5 - 2\\cdot 7 = 3(26 - 3\\cdot 7) - 2 \\cdot 7 "
                "= 3 \\cdot 26 - 11 \\cdot 7$.\n\n"
                "So $7^{-1} \\equiv -11 \\equiv 15 \\pmod{26}$, and $x \\equiv 15 \\cdot 3 = 45 \\equiv 19$.\n\n"
                "Check: $7 \\cdot 19 = 133 = 5 \\cdot 26 + 3$ ✓."
            )),
            (P, "Pitfalls", (
                "1. Dividing congruences without checking $\\gcd = 1$.\n\n"
                "2. Negative remainders left unreduced: $-11 \\bmod 26$ is $15$; canonical representatives live "
                "in $0..m-1$.\n\n"
                "3. Exponent arithmetic done mod $m$ instead of mod the PERIOD (or mod $\\phi(m)$ with "
                "Euler's theorem where valid).\n\n"
                "4. Extended-Euclid bookkeeping errors — verify the final identity $ax + my = 1$ numerically "
                "before trusting $x$.\n\n"
                "5. Assuming $a \\equiv b$ and $c \\equiv d$ lets you conclude $a^c \\equiv b^d$ — exponents "
                "don't reduce mod $m$."
            )),
            (K, "Check yourself", (
                "You should be able to: compute with congruences, find inverses by extended Euclid, solve "
                "linear congruences, and exploit periodic powers.\n\n"
                "Self-test: last digit of $3^{47}$. (Powers of 3 mod 10 cycle $3,9,7,1$; $47 \\equiv 3 \\pmod 4$ "
                "→ $7$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "DM12": {
        "summary": "Graphs: vertices, edges, degree, and the handshake lemma.",
        "steps": [
            (L, "The vocabulary", (
                "A graph $G = (V, E)$ is vertices plus edges between pairs. Flavors: simple (no loops or "
                "multi-edges), directed (edges have arrows), weighted (edges carry numbers).\n\n"
                "The degree $\\deg(v)$ counts edges at $v$. Special citizens: the complete graph $K_n$ (all "
                "$\\binom n 2$ edges), bipartite graphs (two camps, edges only across — equivalently: no odd "
                "cycles), paths and cycles.\n\n"
                "Graphs model anything with pairwise structure: networks, dependencies, molecules, "
                "friendships — which is why this chapter never stops paying rent."
            )),
            (L, "The handshake lemma", (
                "Summing degrees counts each edge twice:\n"
                "$$\\sum_{v \\in V} \\deg(v) = 2|E|.$$\n\n"
                "Immediate corollaries: the degree sum is always even, and the NUMBER OF ODD-DEGREE VERTICES IS "
                "EVEN. That parity fact kills many 'draw a graph where...' puzzles instantly: no graph has "
                "exactly three vertices of odd degree, ever.\n\n"
                "It's also the template for a whole genre of proofs: count one thing two ways."
            )),
            (E, "Worked example", (
                "Can a network of 9 computers have each connected to exactly 5 others?\n\n"
                "Degree sum $= 9 \\cdot 5 = 45$, odd — but the handshake lemma demands $2|E|$, even. "
                "IMPOSSIBLE. One line, no case analysis.\n\n"
                "Constructive companion: 9 computers with degree 4 each is fine — degree sum 36, so 18 edges; "
                "e.g. each machine linked to its 2 neighbors on each side around a circle."
            )),
            (P, "Pitfalls", (
                "1. Forgetting the factor 2: an edge contributes to TWO degrees.\n\n"
                "2. Loops (if allowed) add 2 to their vertex's degree, not 1.\n\n"
                "3. Bipartite misjudged by drawing: the test is NO ODD CYCLES (equivalently 2-colorability), "
                "not how the picture happens to be laid out.\n\n"
                "4. Directed graphs: in-degree and out-degree are separate books; each sums to $|E|$ "
                "individually.\n\n"
                "5. Assuming a degree sequence being even-summed makes it realizable — necessary, not "
                "sufficient (try 3,3,1,1... vs 3,1,1,1)."
            )),
            (K, "Check yourself", (
                "You should be able to: compute degrees and edge counts, apply the handshake parity argument, "
                "and recognize $K_n$ and bipartite structure.\n\n"
                "Self-test: how many edges in $K_{10}$? ($\\binom{10}{2} = 45$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "DM13": {
        "summary": "Connectivity, Euler paths, and trees — including spanning trees in brief.",
        "steps": [
            (L, "Connectivity and Euler paths", (
                "A graph is connected when every pair of vertices is joined by some path.\n\n"
                "Euler's theorem (the Königsberg bridges): a connected graph has a circuit using EVERY EDGE "
                "exactly once iff every vertex has EVEN degree; an Euler PATH (start ≠ end) exists iff exactly "
                "two vertices are odd — the path must start at one and end at the other.\n\n"
                "Contrast with Hamiltonian paths (every VERTEX once): superficially similar, computationally "
                "worlds apart — no clean criterion exists."
            )),
            (L, "Trees", (
                "A tree is connected with no cycles — the minimal way to be connected. Equivalent "
                "characterizations (any one defines a tree): connected with $n - 1$ edges; unique path between "
                "every pair; connected but removing any edge disconnects.\n\n"
                "Rooted trees add hierarchy (parents, leaves); spanning trees select $n-1$ edges connecting all "
                "of a graph's vertices — the skeleton of network design, with Kruskal/Prim choosing the "
                "CHEAPEST one greedily when edges are weighted."
            )),
            (E, "Worked example", (
                "The Königsberg graph has degrees 3, 3, 3, 5 — four odd vertices. Euler: no walk crosses each "
                "bridge exactly once, path or circuit. The puzzle that founded graph theory dies in one "
                "sentence.\n\n"
                "Tree count check: a tree with 47 vertices has exactly 46 edges — no drawing required. And any "
                "connected graph with $n$ vertices and $n - 1$ edges is automatically a tree (no room for a "
                "cycle)."
            )),
            (P, "Pitfalls", (
                "1. Euler vs Hamilton confusion — edges vs vertices; only Euler has the degree test.\n\n"
                "2. Applying Euler's criterion without checking CONNECTEDNESS first.\n\n"
                "3. 'Exactly two odd vertices' gives a PATH between the two odd ones — not a circuit, and not "
                "a path starting anywhere.\n\n"
                "4. Trees: forgetting that adding ANY edge to a tree creates exactly one cycle, and removing "
                "any edge disconnects — both directions get tested.\n\n"
                "5. Greedy spanning-tree intuition misapplied to path problems (greedy fails for shortest "
                "paths through negative edges, etc.)."
            )),
            (K, "Check yourself", (
                "You should be able to: run the Euler degree test with the connectivity check, use tree "
                "characterizations interchangeably, and count tree edges instantly.\n\n"
                "Self-test: does $K_5$ have an Euler circuit? (All degrees 4 — even — and connected: YES.)"
                "\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "DM14": {
        "summary": "Growth of functions and Big-O: comparing algorithm growth by dominant terms.",
        "steps": [
            (L, "Big-O, precisely", (
                "$f(n) = O(g(n))$ means: beyond some point, $f$ is bounded by a constant multiple of $g$ — "
                "$\\exists C, n_0: f(n) \\le C\\, g(n)$ for $n \\ge n_0$.\n\n"
                "It is an UPPER bound on growth SHAPE: constants and small-$n$ behavior are deliberately "
                "ignored. Companions: $\\Omega$ (lower bound) and $\\Theta$ (tight, both).\n\n"
                "The hierarchy to internalize:\n"
                "$$1 \\prec \\log n \\prec n \\prec n \\log n \\prec n^2 \\prec n^3 \\prec 2^n \\prec n!$$"
            )),
            (L, "Working rules", (
                "• Drop constants and lower-order terms: $3n^2 + 50n + 7 = \\Theta(n^2)$.\n"
                "• Polynomials: the degree decides. Any polynomial $\\prec$ any exponential; any power of "
                "$\\log$ $\\prec$ any polynomial.\n"
                "• Nested loops multiply; sequential phases take the max.\n"
                "• Log bases don't matter inside O ($\\log_2 n$ and $\\log_{10} n$ differ by a constant).\n\n"
                "Practical reading: an $O(n \\log n)$ sort on a million items does ~$2 \\times 10^7$ steps; an "
                "$O(n^2)$ one does $10^{12}$ — the difference between instant and hours. Growth class IS the "
                "engineering decision."
            )),
            (E, "Worked example", (
                "Show $f(n) = 3n^2 + 50n + 7 = O(n^2)$ from the definition.\n\n"
                "For $n \\ge 1$: $50n \\le 50n^2$ and $7 \\le 7n^2$, so "
                "$f(n) \\le 3n^2 + 50n^2 + 7n^2 = 60n^2$.\n\n"
                "Witnesses: $C = 60$, $n_0 = 1$. ∎\n\n"
                "Ordering drill: rank $n \\log n$, $n^{1.5}$, $2^{\\log n}$, $(\\log n)^3$. "
                "(Note $2^{\\log_2 n} = n$: so $(\\log n)^3 \\prec n = 2^{\\log n} \\prec n\\log n \\prec n^{1.5}$.)"
            )),
            (P, "Pitfalls", (
                "1. Treating Big-O as tight: $n = O(n^{100})$ is TRUE (upper bounds are allowed to be loose); "
                "use $\\Theta$ when you mean exact order.\n\n"
                "2. Keeping constants or lower terms in the answer ($O(3n^2 + n)$ is not idiomatic — it's "
                "$O(n^2)$).\n\n"
                "3. $2^{2n} = O(2^n)$? NO — the ratio $2^n$ is unbounded; exponents' constants DO matter in "
                "the exponent.\n\n"
                "4. Comparing by plugging in one value of $n$ — growth is asymptotic, not pointwise.\n\n"
                "5. Sequential phases added into a product (or nested loops added instead of multiplied)."
            )),
            (K, "Check yourself", (
                "You should be able to: prove O-bounds with explicit witnesses, rank functions in the "
                "hierarchy, and analyze loop structures.\n\n"
                "Self-test: growth class of $\\sum_{i=1}^n i$? ($\\frac{n(n+1)}{2} = \\Theta(n^2)$ — DM04's "
                "formula, reused.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "DISC": {
        "summary": "Discrete mathematics: logic, proof, counting, and graphs — the mathematics of finite structure, and the grammar of computer science.",
        "steps": [
            (L, "What this course is for", (
                "Discrete math is where continuous intuition takes a back seat and STRUCTURE drives: precise "
                "logic, proof technique, exact counting, and relational structure (graphs). It is "
                "simultaneously the foundation of theoretical computer science and the standard on-ramp to "
                "proof-based mathematics.\n\n"
                "Two skills dominate everything: translating fuzzy statements into precise logical form, and "
                "counting without double counting."
            )),
            (L, "The arc", (
                "• Logic: DM01 (propositions) → DM02 (quantifiers) — the language.\n"
                "• Proof: DM03 (direct, counterexample) → DM04 (induction) — the method; deepened by the PT.* "
                "technique nodes.\n"
                "• Structures: DM05 (sets) → DM06 (functions, relations).\n"
                "• Counting: DM07 (sum/product) → DM08 (perms/combos) → DM09 (pigeonhole, "
                "inclusion-exclusion) → DM10 (recurrences) → DM11 (modular arithmetic).\n"
                "• Graphs and growth: DM12 (basics) → DM13 (connectivity, trees) → DM14 (Big-O).\n\n"
                "Each node carries a full lesson; the order above is the dependency order."
            )),
            (E, "A signature problem", (
                "How many ways can 8 people sit around a round table, if rotations are the same seating?\n\n"
                "Fix one person (killing the rotational symmetry): the rest arrange in $7! = 5040$ ways.\n\n"
                "Why it's a signature: the raw product rule ($8!$) overcounts by the 8 rotations, and DIVIDING "
                "OUT SYMMETRY — $\\frac{8!}{8} = 7!$ — is discrete math's most reusable move, the same idea "
                "behind $\\binom n r = \\frac{P(n,r)}{r!}$."
            )),
            (P, "Course-level traps", (
                "1. Proof by example — the course's cardinal sin.\n\n"
                "2. Order/no-order confusion in counting.\n\n"
                "3. Quantifier negation done by vibes instead of the flip-and-push rules.\n\n"
                "4. Induction without a base case, or without ever using the hypothesis.\n\n"
                "5. Union counting without inclusion-exclusion."
            )),
            (K, "How to work this course", (
                "Take the arc in order — logic before proof, proof before counting arguments. Write proofs "
                "LONGHAND even when the answer is obvious; the discipline is the curriculum. When DM03/DM04 "
                "feel solid, the PT.* nodes and INTROPROOF extend them into full proof craftsmanship.\n\n"
                "Self-test: prove there are infinitely many even integers... then notice which technique you "
                "reached for, and why. (Contradiction or construction both work — knowing WHY you chose is "
                "the meta-skill.)"
            )),
        ],
    },
}
