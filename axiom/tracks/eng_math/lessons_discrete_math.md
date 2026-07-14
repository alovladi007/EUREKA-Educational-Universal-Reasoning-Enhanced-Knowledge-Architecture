# AXIOM Discrete Mathematics: Complete Lessons

Course DM, 14 lessons across 6 units, in the AXIOM teaching arc.

---

## Unit 1. Logic

### DM01. Propositional logic

Objective: evaluate compound statements with truth tables and standard
equivalences.

Build on: nothing formal; this is the course's ground floor.

Core idea: propositions are true or false; connectives (and, or, not,
implies) combine them by fixed truth tables. The implication p implies q is
the subtle one: false only when p is true and q is false, so a false premise
makes the implication vacuously true. De Morgan's laws move negations across
and/or by flipping the connective, and an implication is equivalent to its
contrapositive (not q implies not p), never to its converse.

Worked example: "if it rains, the ground is wet" is not violated by a wet
ground on a dry day (sprinklers exist): that would be affirming the
converse.

Try it: when is (p implies q) false?

Answer: exactly when p is true and q is false.

Pitfall: assuming the converse (DMM01): p implies q says nothing about what
follows from q. Diagnostic thinking in every later proof depends on keeping
the direction straight.

### DM02. Predicates and quantifiers

Objective: read and negate statements with for-all and there-exists.

Build on: DM01; predicates are propositions with variables.

Core idea: for-all x P(x) claims P for every x; there-exists x P(x) claims
at least one witness. Negation swaps the quantifier and negates the inside:
not(for-all x P) is there-exists x not-P, and not(there-exists x P) is
for-all x not-P. Order matters when quantifiers stack: for-all x
there-exists y is a weaker claim than there-exists y for-all x.

Worked example: the negation of "every student passed" is "some student did
not pass", not "every student failed": diagnostic item DM-D1.

Try it: negate "there exists an even prime greater than 2".

Answer: every prime greater than 2 is odd.

Pitfall: negating for-all as for-all-not (DMM02): it overshoots. One
counterexample is what the negation asserts, and one is all disproof ever
needs.

## Unit 2. Proof Techniques

### DM03. Direct proof and counterexample

Objective: prove universal claims from definitions and disprove them with
single counterexamples.

Build on: DM02; the quantifier tells you the proof obligation.

Core idea: a for-all claim needs an argument covering every case: start from
an arbitrary element, unfold definitions, derive the conclusion. A for-all
claim dies from one counterexample. The asymmetry is the point: examples can
disprove but never prove a universal statement, no matter how many pile up.

Worked example: claim: the sum of two even integers is even. Proof: 2a + 2b
= 2(a + b), even by definition. No number of checked instances (4 + 6 = 10,
et cetera) would have constituted a proof.

Try it: disprove "all primes are odd".

Answer: 2 is prime and even: one counterexample, claim dead.

Pitfall: proof by example (DMM07): verifying n = 1, 2, 3 and declaring
victory. n^2 + n + 41 is prime for n up to 39 and fails at 40; patterns lie.

### DM04. Induction

Objective: prove statements about all naturals by base case plus inductive
step.

Build on: DM03; induction is the direct-proof pattern for infinitely many
dominoes.

Core idea: prove P(1), then prove that P(k) forces P(k + 1); together they
topple every case. The inductive step assumes P(k) (the induction
hypothesis) and must visibly use it. Strong induction lets the hypothesis
cover all cases up to k, which recursive structures (DM10) need. Both parts
are load-bearing: a step without a base proves nothing about anything.

Worked example: 1 + 2 + ... + n = n(n + 1)/2. Base: 1 = 1. Step: add
(k + 1) to both sides of the hypothesis and simplify to the k + 1 formula.

Try it: which part fails in the classic all-horses-are-one-color fallacy?

Answer: the step breaks at k = 1 to 2, where the two overlapping groups
share no horse: the base did not reach the step.

Pitfall: induction without a base (DMM03), or a base that does not connect
to the step. Check the smallest case the step actually relies on.

## Unit 3. Sets, Functions, Relations

### DM05. Sets and set operations

Objective: compute with unions, intersections, complements, and power sets.

Build on: DM01; set algebra mirrors logic (union is or, intersection is
and, complement is not).

Core idea: sets collect distinct elements; operations combine them, De
Morgan transfers verbatim (complement of a union is intersection of
complements), and Venn diagrams make two- and three-set reasoning visual.
The power set of an n-element set has 2^n subsets: each element is in or
out, independently.

Worked example: A = {1, 2, 3}, B = {2, 3, 4}: union {1, 2, 3, 4},
intersection {2, 3}, A minus B = {1}. Power set of {1, 2}: four sets,
including the empty set.

Try it: how many subsets does a 5-element set have?

Answer: 32.

Pitfall: forgetting the empty set and the set itself are subsets, and
conflating element-of with subset-of: 1 is an element of {1}, and {1} is a
subset. The types differ.

### DM06. Functions and relations

Objective: classify functions as injective, surjective, bijective, and
recognize equivalence relations.

Build on: DM05; functions and relations are structured sets of pairs.

Core idea: a function is injective when distinct inputs give distinct
outputs, surjective when every target is hit, bijective when both: bijections
are exactly the invertible functions, and the tool for proving two sets are
the same size. An equivalence relation (reflexive, symmetric, transitive)
partitions its set into classes: congruence mod m (DM11) is the flagship
example.

Worked example: f(x) = 2x on the integers is injective, not surjective (odd
numbers are never hit); on the rationals it is a bijection.

Try it: is x^2 on the reals injective?

Answer: no: 2 and -2 collide at 4.

Pitfall: proving injectivity by example, or checking surjectivity against
the wrong target set. Both properties are claims about the whole domain and
codomain: quantifiers, not anecdotes.

## Unit 4. Counting

### DM07. Sum and product rules

Objective: decompose counting problems into stages and disjoint cases.

Build on: DM05; counting is set cardinality with strategy.

Core idea: independent stages multiply (product rule: 3 shirts and 4 pants
make 12 outfits); disjoint cases add (sum rule). Complex counts decompose:
choose the structure stage by stage, and when cases overlap, the sum rule
needs the correction DM09 supplies. "At least one" problems usually count
the complement instead.

Worked example: passwords of 3 letters then 2 digits: 26^3 times 10^2 =
1,757,600.

Try it: how many 3-digit numbers have no zeros?

Answer: 9^3 = 729.

Pitfall: multiplying dependent stages as if free (a committee chair chosen
from committee members constrains the next choice), and adding overlapping
cases: both are structure errors, not arithmetic ones.

### DM08. Permutations and combinations

Objective: count ordered and unordered selections and choose between them
correctly.

Build on: DM07's product rule, packaged.

Core idea: ordered selection of k from n: P(n, k) = n!/(n - k)!. Unordered:
C(n, k) = n!/(k!(n - k)!): divide out the k! orderings of each selection.
The only question that matters: does order matter? Committees no, rankings
yes, and arrangements of letters with repeats divide by the factorial of
each repeat count.

Worked example: 3-person committees from 10 people: C(10, 3) = 120;
president-VP-treasurer from the same 10: P(10, 3) = 720. Diagnostic item
DM-D2 is the first of these.

Try it: distinct arrangements of AABBC?

Answer: 5!/(2! 2!) = 30, the template T-DM-arrange's exact shape, verified
by brute-force enumeration.

Pitfall: order confusion (DMM04): P and C differ by k!, a factor of 6 at
k = 3 and a factor of 3.6 million at k = 10. Ask the order question out
loud before writing anything.

### DM09. Pigeonhole and inclusion-exclusion

Objective: use guaranteed collisions and count unions without double
counting.

Build on: DM07 and DM08; these repair the sum rule's overlap problem.

Core idea: pigeonhole: n + 1 pigeons in n holes forces a shared hole:
existence proofs from pure counting, no construction needed.
Inclusion-exclusion: |A union B| = |A| + |B| - |A and B|, extending to
three sets by adding back the triple overlap: subtract what the naive sum
counted twice.

Worked example: 13 people force two sharing a birth month. And of 100
integers, those divisible by 2 or 3: 50 + 33 - 16 = 67.

Try it: 25 students, 15 take math, 17 take physics, all take at least one.
How many take both?

Answer: 15 + 17 - 25 = 7.

Pitfall: double counting (DMM05): adding overlapping cases and stopping. If
two categories can both apply, the naive sum is an overcount by
construction.

## Unit 5. Recurrences and Number Theory

### DM10. Recurrence relations

Objective: model with recurrences and solve linear constant-coefficient
cases in closed form.

Build on: DM04; a recurrence is induction shaped like a formula.

Core idea: a recurrence defines each term from earlier ones (Fibonacci:
a_n = a_(n-1) + a_(n-2)). For linear constant-coefficient recurrences,
substitute a_n = r^n: the characteristic equation's roots r1, r2 give the
general solution A r1^n + B r2^n, with A, B fixed by initial terms: the
same characteristic-equation playbook as second-order ODEs (OD08), in
discrete time.

Worked example: a_n = 3 a_(n-1) - 2 a_(n-2), a_0 = 2, a_1 = 3: roots 1 and
2, closed form a_n = 1 + 2^n, confirmed by iterating: 2, 3, 5, 9. The
template verifier does exactly that iteration check.

Try it: what equation do the roots of a_n = 5 a_(n-1) - 6 a_(n-2) solve?

Answer: r^2 - 5r + 6 = 0: roots 2 and 3.

Pitfall: forgetting the initial conditions: the roots give a family of
solutions, and without fitting a_0 and a_1 the answer is a shape, not a
sequence (the C1M07 lost-constant error, discrete edition).

### DM11. Modular arithmetic

Objective: compute with congruences and modular inverses.

Build on: DM06's equivalence relations; congruence mod m is the flagship.

Core idea: a is congruent to b mod m when m divides a - b: arithmetic on
remainders. Addition and multiplication respect congruence, so reduce early
and often. Division does not exist as such: to solve a x congruent to b, you
multiply by the inverse of a mod m, which exists exactly when gcd(a, m) = 1.
Clock arithmetic, checksums, hash tables, and all of public-key
cryptography live here.

Worked example: solve 3x congruent to 5 (mod 7): the inverse of 3 is 5
(since 15 is congruent to 1), so x = 25 mod 7 = 4. Check: 12 is congruent
to 5. The template verifies by scanning all residues for uniqueness.

Try it: what is 2^10 mod 7?

Answer: 2, since 2^3 = 8 is congruent to 1, and 10 = 3 times 3 plus 1.

Pitfall: ordinary division mod m (DMM06): dividing both sides of 6x
congruent to 4 (mod 8) by 2 changes the solution set. Inverses when the gcd
is 1, care always.

## Unit 6. Graphs and Growth

### DM12. Graphs: basics and degree

Objective: use graph vocabulary and the handshake lemma.

Build on: DM05; a graph is a set of vertices and a set of edges.

Core idea: graphs model pairwise relations: networks, circuits, adjacency
of anything. The degree of a vertex counts its edges, and the handshake
lemma says the degrees sum to twice the edge count (each edge contributes
two endpoints): hence any graph has an even number of odd-degree vertices,
a parity fact that settles impossibility questions instantly.

Worked example: can 9 people each shake hands with exactly 3 others? Degree
sum 27, odd: impossible, no diagram required.

Try it: a graph has 10 edges. What do the degrees sum to?

Answer: 20.

Pitfall: confusing the complete graph K_n (all pairs joined,
n(n - 1)/2 edges) with an arbitrary graph on n vertices, and drawing
conclusions from one drawing of a graph: the abstraction is the pair of
sets, not the picture.

### DM13. Connectivity, paths, and trees

Objective: reason about connectivity, Euler paths, and tree properties.

Build on: DM12's vocabulary in motion.

Core idea: a graph is connected when every pair of vertices is joined by a
path. Euler settled Konigsberg with degrees alone: a closed walk using every
edge once exists exactly when the graph is connected and every degree is
even (an open one: exactly two odd degrees). Trees are the minimal connected
graphs: connected, acyclic, always exactly n - 1 edges, unique path between
any two vertices: the shape of hierarchies, file systems, and spanning
subgraphs everywhere: AXIOM's own prerequisite graph is required to be a
DAG for exactly these reasons.

Worked example: Konigsberg's four land masses all had odd degree: no walk
crossing each bridge once, and the proof is two sentences of parity.

Try it: a tree has 50 vertices. How many edges?

Answer: 49.

Pitfall: assuming connectivity without checking it (the Euler condition is
connected AND even degrees), and adding an edge to a tree without expecting
the cycle it must create.

### DM14. Growth of functions and Big-O

Objective: compare growth rates and classify algorithm costs by dominant
term.

Build on: DM10, since recurrences describe algorithm costs; C104's limits
supply the comparisons.

Core idea: Big-O compares eventual growth, ignoring constants and
lower-order terms: 3n^2 + 50n is O(n^2), because for large n the n^2 term
owns the outcome. The hierarchy to internalize: constant, log n, n, n log n,
n^2, polynomial, exponential, factorial: each class eventually dwarfs the
one before, and no constant rescues a lower class. This is the vocabulary
of every algorithms conversation you will ever have.

Worked example: at n = one million, an n log n sort does about 2 times 10^7
steps; an n^2 sort does 10^12: the difference between milliseconds and
hours, from the dominant term alone.

Try it: is 100n + n^2/1000 O(n)?

Answer: no: the n^2 term dominates eventually, constants notwithstanding.

Pitfall: ranking by constants and small-n behavior (DMM08): O(n^2) code can
beat O(n log n) code on tiny inputs, and Big-O says nothing about which
wins there. It is a statement about eventually, and eventually always
arrives.
