// FE EE course content — Software Development (5 topics).
// Split byte-identically from fe-ee-course-data.ts so section waves
// can be authored in parallel; spread back into FE_EE_COURSE there.
import type { TopicLesson } from '../fe-ee-course-data';

export const FE_EE_SOFTWARE_DEVELOPMENT: Record<string, TopicLesson> = {
fee_algorithms: { topicId: 'fee_algorithms', title: 'Algorithms and Complexity', domainWeight: 'Software Development · 3–5%',
  overview: 'Algorithm analysis determines how execution time grows with input size. Big-O notation, sorting/searching complexities, and paradigms (divide-and-conquer, DP, greedy) are core FE exam topics.',
  sections: [
    { id: 'algo-bigo', title: '1. Big-O and Complexity Classes',
      content: `## 1.1 Common Complexities

| O() | Name | Example |
|---|---|---|
| **O(1)** | Constant | Hash lookup |
| **O(log n)** | Logarithmic | Binary search |
| **O(n)** | Linear | Linear search |
| **O(n log n)** | Linearithmic | Merge sort |
| **$O(n^2)$** | Quadratic | Bubble sort |
| **$O(2^n)$** | Exponential | Brute-force subsets |

## 1.2 Rules

1. Drop constants: 3n^2 -> O(n^2)
2. Keep dominant: n^2+5n -> O(n^2)
3. Sequential adds: O(n)+O(n^2) -> O(n^2)
4. Nested loops multiply: O(n)*O(n) -> O(n^2)`,
      examTip: 'Count nested loops: 1 loop = O(n), 2 nested = O(n^2), halving each step = O(log n). Focus on dominant term, drop constants.',
    },
    { id: 'algo-sort-search', title: '2. Sorting, Searching, Paradigms',
      content: `## 2.1 Sorting

| Algorithm | Average | Worst | Space | Stable |
|---|---|---|---|---|
| **Bubble** | $O(n^2)$ | $O(n^2)$ | O(1) | Yes |
| **Insertion** | $O(n^2)$ | $O(n^2)$ | O(1) | Yes |
| **Merge** | O(n log n) | O(n log n) | O(n) | Yes |
| **Quick** | O(n log n) | $O(n^2)$ | O(log n) | No |
| **Heap** | O(n log n) | O(n log n) | O(1) | No |

## 2.2 Searching

- **Linear**: O(n), any data
- **Binary**: O(log n), **requires sorted data**

## 2.3 Paradigms

| Paradigm | Strategy | Examples |
|---|---|---|
| **Divide-and-conquer** | Split, solve, combine | Merge sort, binary search |
| **Dynamic programming** | Memoize overlapping sub-problems | Fibonacci, shortest path |
| **Greedy** | Locally optimal | Dijkstra, Huffman |

Fibonacci: the naive recursion is $\\Theta(\\varphi^n)$ with $\\varphi = 1.618$, **not** $\\Theta(2^n)$ — $O(2^n)$ is a true bound but a slack one, and section 7.6 counts the calls to show how slack. Memoised DP is O(n).`,
      examTip: 'Binary search O(log n) requires sorted data. Merge sort O(n log n) guaranteed. Quick sort O(n log n) avg but O(n^2) worst. DP reduces exponential to polynomial via memoization.',
      importantNote: 'Quick sort O(n^2) worst case when pivot is always min/max. Still fastest in practice due to cache locality. Merge sort guarantees O(n log n) but needs O(n) extra space.',
    },
    { id: 'algo-exam', title: '3. Algorithm Analysis Problems',
      content: `## 3.1 Master Theorem: T(n) = 4T(n/2) + n^2

**Master theorem**: T(n) = aT(n/b) + O(n^d)

Here: a = 4, b = 2, d = 2. Compare **log_b(a)** with **d**:

$$\\log _2(4) = 2 = d$$

**Case 2** (log_b(a) = d): T(n) = O(n^d * log n) = **$O(n^2 \\log  n)$**

| Case | Condition | Result |
|---|---|---|
| 1 | $\\log _b(a) > d$ | $O(n^{\\log _b(a)})$ |
| **2** | **$\\log _b(a) = d$** | **$O(n^d \\log  n)$** |
| 3 | $\\log _b(a) < d$ | $O(n^d)$ |

**Quick check**: T(n) = 2T(n/2) + n -> a=2, b=2, d=1 -> log_2(2)=1=d -> Case 2: **O(n log n)** (merge sort!).

## 3.2 Merge Sort vs Quick Sort for Nearly-Sorted Data

| Property | Merge Sort | Quick Sort |
|---|---|---|
| Best case | O(n log n) | O(n log n) |
| Average | O(n log n) | O(n log n) |
| **Nearly-sorted worst** | O(n log n) | **O(n^2)** (bad pivot) |
| Space | O(n) | O(log n) |
| Stable | Yes | No |

For **nearly-sorted data**, quick sort with naive pivot (first/last element) degrades to O(n^2) because partitions are maximally unbalanced. Solutions:
- **Randomized pivot**: expected O(n log n) regardless
- **Median-of-three**: avoids worst case on sorted input
- **Use insertion sort**: O(n) on nearly-sorted data (best choice if truly almost sorted)

## 3.3 Binary Search: Off-by-One Analysis

**Standard binary search** on sorted array of n elements:

- **Worst-case comparisons**: **floor(log_2(n)) + 1**, equivalently ceil(log_2(n+1)) — for n = 100 that is 6 + 1 = **7**, matching the table below
- **Comparison count**: roughly log_2(n) − 1 on average for a successful search, since most keys are found in the deepest level

| Array Size | Max Comparisons |
|---|---|
| 100 | 7 |
| 1,000 | 10 |
| 1,000,000 | 20 |
| $10^9$ | 30 |

**Common off-by-one errors**:
- Loop condition: use **low <= high** (not low < high) to check single-element range
- Mid calculation: **mid = low + (high - low) / 2** (avoids integer overflow vs (low+high)/2)
- Update: low = mid + 1 or high = mid - 1 (not mid, which causes infinite loops)

**Exam strategy**: For Master theorem, compute log_b(a) and compare to d. For sorting, if data is nearly sorted, insertion sort is O(n). For binary search, always verify the loop terminates by checking low > high.`,
      examTip: 'Master theorem shortcut: compute log_b(a). If it equals d, answer is O(n^d log n). If greater, answer is O(n^(log_b(a))). If less, answer is O(n^d). This covers 90% of FE recurrence problems.',
      importantNote: 'The Master theorem only applies to recurrences of the form T(n) = aT(n/b) + O(n^d). For other forms like T(n) = T(n-1) + O(n), use the recursion tree or substitution method.',
    },
    { id: 'algo-tracing', title: '4. From Code to Complexity: Flowcharts, Dry Runs, Counting',
      content: `## 4.1 Reading a Flowchart

Before an algorithm can be analysed it has to be read, and the FE exam
presents algorithms in two notations. The first is the flowchart, whose
symbols are standardised (ISO 5807) and whose shape carries meaning:

| Symbol | Name | Means |
|---|---|---|
| Rounded rectangle or oval | Terminal | Start or stop |
| Parallelogram | Input/output | Read or write a value |
| Rectangle | Process | An assignment or computation |
| Diamond | Decision | A test with two labelled exits |
| Circle | Connector | Continues on another part of the page |
| Arrow | Flow line | Order of execution |

Only the **diamond** has more than one exit, which is the single fact that
makes flowchart questions tractable. Count the diamonds and you have counted
the decisions; the number of loops is the number of arrows that flow backwards
to an earlier symbol.

## 4.2 The Dry Run: A Trace Table

The second notation is pseudocode, and the reliable way to answer "what does
this print" is to build a **trace table** with one column per variable and one
row per iteration, filling it in mechanically rather than reasoning about it.

Take Euclid's algorithm:

    while b is not 0:
        t = a mod b
        a = b
        b = t
    return a

Trace it on a = 48, b = 18:

| Iteration | a on entry | b on entry | a mod b | a after | b after |
|---|---|---|---|---|---|
| 1 | 48 | 18 | 12 | 18 | 12 |
| 2 | 18 | 12 | 6 | 12 | 6 |
| 3 | 12 | 6 | 0 | 6 | 0 |
| exit | 6 | 0 | — | — | — |

The loop ends after **3 iterations** and returns **6**. Run it on a = 1071,
b = 462 and the table gives remainders 147, 21, 0 and the answer **21** —
again in 3 iterations, which hints at how slowly this algorithm's cost grows.

Two disciplines make trace tables reliable. Write the values **on entry** to
the iteration, not after it, so a row always describes one consistent moment.
And write the loop condition's truth value explicitly when the exit is the
thing in question — most wrong answers come from running one iteration too many
or too few.

## 4.3 Counting Operations Before Naming a Complexity

Big-O is the summary of an operation count, so the count comes first. The two
patterns worth having at your fingertips:

**Independent nested loops** — each runs n times, so the body runs n² times.

**Triangular nested loops** — the inner loop starts where the outer one is:

    for i = 1 to n:
        for j = i to n:
            body

The body runs n + (n−1) + ⋯ + 1 = **n(n+1)/2** times:

| n | Body executions | n² | Ratio |
|---|---|---|---|
| 10 | 55 | 100 | 0.550 |
| 100 | 5,050 | 10,000 | 0.505 |
| 1,000 | 500,500 | 1,000,000 | 0.5005 |

The ratio converges to 1/2, so the triangular loop is O(n²) — half the work of
the square version, and the constant is dropped. That is the discipline the
notation enforces: **the exact count is the answer to "how many operations",
the dropped-constant form is the answer to "what complexity"**, and questions
ask for one or the other quite deliberately.

## 4.4 Constants Decide Small Inputs

Dropping constants is legitimate asymptotically and misleading practically,
because real inputs are finite:

![Three cost models on linear axes: n squared, fifty n, and ten n log base two n, plotted to n equals 120. The quadratic curve starts below the linear one and overtakes it exactly at n equals 50, where both equal 2500 operations.](/courses/fe-ee/figures/swe-bigo-crossover.svg)

Solve 50n = n² and the crossover is at **n = 50** exactly. At n = 40 the
quadratic algorithm does 1600 operations against the linear algorithm's 2000
and is genuinely faster; at n = 60 it does 3600 against 3000 and is genuinely
slower. Neither statement contradicts the asymptotics, and this is why library
sort routines switch to insertion sort for subarrays of a few dozen elements.

Three refinements of the notation appear in exam wording:

| Notation | Meaning | Example |
|---|---|---|
| **O(f)** | Upper bound — grows no faster than f | Insertion sort is O(n²) |
| **Ω(f)** | Lower bound — grows at least as fast as f | Any comparison sort is Ω(n log n) |
| **Θ(f)** | Tight — both bounds | Merge sort is Θ(n log n) |

An O-bound need not be tight, which is why "insertion sort is O(n³)" is a true
statement and a useless one. When a question asks for "the complexity" it is
asking for the tight bound.`,
      examTip: 'Build a trace table with one row per iteration and record values ON ENTRY to that iteration. Most wrong answers to "what does this print" come from running the loop one iteration too many.',
      importantNote: 'A triangular nested loop (inner starting at the outer index) runs n(n+1)/2 times, not n^2. Both are O(n^2), but if the question asks for the operation COUNT rather than the complexity, the answer is n(n+1)/2 — 5050 for n = 100.',
    },
    { id: 'algo-measured', title: '5. Measured Behaviour and Choosing an Algorithm',
      content: `## 5.1 Counting Comparisons Instead of Trusting the Symbol

Asymptotic classes are predictions. Running the two sorts and counting their
actual key comparisons on the same random input at each size tests those
predictions:

![Measured key comparisons for insertion sort and merge sort on the same seeded random permutation at array lengths 16 through 4096, on logarithmic axes, with the closed-form predictions n squared over four and n log base two n minus n plus one drawn as dashed lines beneath the measurements.](/courses/fe-ee/figures/swe-sort-opcounts.svg)

| n | Insertion sort (measured) | n²/4 | Merge sort (measured) | n log₂n − n + 1 | Ratio |
|---|---|---|---|---|---|
| 16 | 64 | 64 | 47 | 49 | 1.4 |
| 64 | 1,022 | 1,024 | 306 | 321 | 3.3 |
| 256 | 16,706 | 16,384 | 1,735 | 1,793 | 9.6 |
| 1,024 | 259,353 | 262,144 | 8,941 | 9,217 | 29.0 |
| 4,096 | 4,161,097 | 4,194,304 | 43,937 | 45,057 | **94.7** |

Three things are worth reading off the table. The predictions are accurate:
insertion sort lands within 2 % of n²/4 at every size (the worst row is
n = 256, where 16,706 measured against 16,384 predicted is 1.97 % high) and
merge sort within 5 % of n log₂n − n + 1 (worst row n = 64, 306 against 321,
4.67 % low — the closed form is merge sort's **worst** case, so a random input
sits below it).
The ratio column is not a constant — it grows from 1.4 to 94.7 — because the
gap between the two algorithms is a **difference of slopes**, not a difference
of constants. And at n = 16 the gap is only 1.4×, which is why the crossover
argument of section 4.4 is not academic.

## 5.2 Choosing on the Properties, Not the Average

Average-case complexity rarely decides a real choice. The columns that do:

| Requirement | Choose | Why |
|---|---|---|
| Guaranteed worst case (real-time, adversarial input) | **Merge sort** or **heap sort** | O(n log n) always; quick sort can hit O(n²) |
| Minimum memory, in place | **Heap sort** | O(1) extra space against merge sort's O(n) |
| Equal keys must keep their input order | **Merge** or **insertion** | Only stable sorts preserve it |
| Data already nearly sorted | **Insertion sort** | O(n) when each element is a few places from home |
| Typical unordered data, memory available | **Quick sort** | Best constants and cache behaviour despite the worse bound |
| Keys are small integers in a known range | **Counting sort** | O(n + k), beats the Ω(n log n) comparison bound by not comparing |

**Stability** is worth a sentence because it is easy to test and easy to
forget. A stable sort leaves records with equal keys in their original
relative order, which is what lets you sort by surname and then by department
and end up with each department's names still alphabetical. Quick sort and
heap sort destroy that ordering; merge and insertion preserve it.

The **Ω(n log n) lower bound** for comparison sorts is a proof, not an
observation: n items have n! orderings, each comparison distinguishes at most
two branches, so at least log₂(n!) ≈ n log₂n − 1.44n comparisons are needed.
Counting sort and radix sort beat it only because they never compare two keys.

## 5.3 Search: What the Sorted Requirement Buys

| Structure | Search | Insert | Notes |
|---|---|---|---|
| Unsorted array | O(n) | O(1) | Linear scan; nothing to maintain |
| Sorted array | **O(log n)** | O(n) | Binary search; insertion shifts elements |
| Balanced BST | O(log n) | O(log n) | Also gives ordered traversal and range queries |
| Hash table | **O(1)** average | O(1) average | No order; range queries impossible |

The worst-case comparison count for binary search is **floor(log₂n) + 1**:

| n | Worst-case comparisons |
|---|---|
| 100 | 7 |
| 1,000 | 10 |
| 1,000,000 | 20 |
| 10^9 | 30 |

A billion records in thirty comparisons is the headline, but the decision it
implies is subtler. Sorting to enable binary search costs O(n log n) up front,
so it pays only when the array will be searched many times. For a single
lookup, a linear scan at O(n) beats sort-then-search at O(n log n + log n).
**Amortise the preparation over the number of queries** — that comparison, not
the raw complexity, is what these questions actually test.

## 5.4 Space, and the Trade Against Time

Complexity has a second axis, and problems that look intractable in time often
yield to spending memory:

| Algorithm | Time | Auxiliary space |
|---|---|---|
| Insertion, bubble, selection sort | O(n²) | O(1) |
| Heap sort | O(n log n) | O(1) |
| Quick sort | O(n log n) average | O(log n) recursion stack |
| Merge sort | O(n log n) | O(n) |
| Counting sort | O(n + k) | O(k) |
| Naive Fibonacci | O(φⁿ) | O(n) stack |
| Memoised Fibonacci | O(n) | O(n) table |

The last two rows are the archetype: a table of n stored results converts an
exponential-time recursion into a linear one. Hash tables make the same trade
— extra slots bought to keep the load factor low are what preserve the O(1)
average lookup.`,
      examTip: 'Worst-case binary search comparisons = floor(log2 n) + 1: 7 for n = 100, 20 for a million, 30 for a billion. Sorting first only pays if the array will be searched more than about log n times.',
      importantNote: 'The Omega(n log n) bound applies only to COMPARISON sorts. Counting sort and radix sort run in O(n + k) because they never compare two keys — if a question offers a linear-time sort as an option, check whether the keys are bounded integers before rejecting it.',
    },
    { id: 'algo-asymptotic-sets', title: '6. Asymptotic Notation as Three Sets',
      content: `## 6.1 O, Omega and Theta Are Sets, Not Adjectives

The earlier sections used big-O as a label attached to an algorithm. It is
really a **set of functions**, and the definitions below are what a question
means when it asks you to justify a bound instead of recognise one. Let f and
g map positive integers to non-negative reals.

$$O(g) = \\{\\, f \\;:\\; \\exists\\ c > 0,\\ n_0 > 0 \\ \\text{with}\\ f(n) \\le c\\,g(n)\\ \\text{for every}\\ n \\ge n_0 \\,\\}$$

$$\\Omega(g) = \\{\\, f \\;:\\; \\exists\\ c > 0,\\ n_0 > 0 \\ \\text{with}\\ f(n) \\ge c\\,g(n)\\ \\text{for every}\\ n \\ge n_0 \\,\\}$$

$$\\Theta(g) = O(g) \\,\\cap\\, \\Omega(g)$$

Membership in the intersection means a **two-sided** squeeze with two
constants and one threshold:

$$c_1\\,g(n) \\;\\le\\; f(n) \\;\\le\\; c_2\\,g(n) \\qquad \\text{for every } n \\ge n_0$$

Three consequences follow immediately from reading the definitions as written.
The constants c and $n_0$ are **existential**: you only have to exhibit one
pair that works, and any other working pair is equally valid. The bound is
**eventual**: behaviour below $n_0$ is unconstrained, which is why an
algorithm can be asymptotically worse and practically faster on small inputs.
And an O-bound is **one-sided**, so it need not be tight — which is the single
most common source of wrong answers in this topic.

Everyone writes $f = O(g)$ rather than $f \\in O(g)$. Treat the equals sign as
the word "is in": the statement is not symmetric, so $n = O(n^2)$ is true while
$n^2 = O(n)$ is false, and the two cannot be exchanged the way an equation's
sides can.

## 6.2 Worked Example: Producing the Witness Constants

**Given**: $f(n) = 3n^2 + 7n + 12$. **Find**: constants proving
$f \\in \\Theta(n^2)$.

**Upper witness.** Try $c_2 = 4$ and solve for the threshold:

$$3n^2 + 7n + 12 \\;\\le\\; 4n^2 \\iff 0 \\;\\le\\; n^2 - 7n - 12$$

$$n \\;\\ge\\; \\frac{7 + \\sqrt{49 + 48}}{2} = \\frac{7 + \\sqrt{97}}{2} = 8.4244$$

The smallest integer above 8.4244 is 9, so $n_0 = 9$. Both sides of that
threshold check out:

$$f(8) = 3 \\cdot 64 + 7 \\cdot 8 + 12 = 260 \\;>\\; 256 = c_2 \\cdot 8^2$$

$$f(9) = 3 \\cdot 81 + 7 \\cdot 9 + 12 = 318 \\;\\le\\; 324 = c_2 \\cdot 9^2$$

**Lower witness.** Every added term is positive, so no threshold is needed:

$$3n^2 + 7n + 12 \\;\\ge\\; 3n^2 \\qquad \\text{for every } n \\ge 1$$

**Answer**: $c_1 = 3$, $c_2 = 4$, $n_0 = 9$ certify $f \\in \\Theta(n^2)$.

![Three curves against problem size to n equals twenty: the function three n squared plus seven n plus twelve drawn solid between two dashed witness parabolas, the upper one four n squared and the lower one three n squared. A dotted vertical line at n equals nine marks the threshold from which the upper witness holds; at n equals eight the function value 260 still exceeds 256.](/courses/fe-ee/figures/sw2-bigo-witness.svg)

The witnesses are not unique, and that is the point of the existential
quantifier. Taking $c_2 = 22$ instead lets $n_0 = 1$, because
$f(1) = 3 + 7 + 12 = 22$ and the ratio $f(n)/n^2$ decreases from there. A
grader wants *a* valid pair, not *the* pair.

## 6.3 The Limit Test for Comparing Growth Rates

Solving inequalities is reliable and slow. For ranking two functions the fast
route is the ratio limit:

$$L = \\lim_{n \\to \\infty} \\frac{f(n)}{g(n)}$$

| Value of L | Conclusion | Notation |
|---|---|---|
| 0 | f grows strictly slower | $f \\in o(g)$, so $f \\in O(g)$ but not $\\Theta(g)$ |
| finite and non-zero | same growth rate | $f \\in \\Theta(g)$ |
| $\\infty$ | f grows strictly faster | $f \\in \\omega(g)$, so $f \\in \\Omega(g)$ but not $\\Theta(g)$ |
| oscillates | test is inconclusive | fall back on the definitions |

Applied to the standard hierarchy, the test gives every comparison at once:

$$\\lim_{n \\to \\infty} \\frac{\\log _2 n}{n} = 0, \\qquad \\lim_{n \\to \\infty} \\frac{n\\log _2 n}{n^2} = \\lim_{n \\to \\infty} \\frac{\\log _2 n}{n} = 0$$

$$\\lim_{n \\to \\infty} \\frac{n^{100}}{2^n} = 0 \\qquad \\text{(every polynomial loses to every exponential)}$$

$$\\lim_{n \\to \\infty} \\frac{\\log _2(n^5)}{\\log _2 n} = \\lim_{n \\to \\infty} \\frac{5\\log _2 n}{\\log _2 n} = 5 \\;\\Rightarrow\\; \\log (n^5) \\in \\Theta(\\log n)$$

That last line is worth keeping: **a constant power inside a logarithm is a
constant multiple outside it**, so all polynomial-argument logarithms collapse
into one class, and the base of the logarithm never matters either:

$$\\log _b n = \\frac{\\log _2 n}{\\log _2 b} \\;\\Rightarrow\\; \\log _b n \\in \\Theta(\\log _2 n)$$

## 6.4 Worked Example: A Limit That Settles Slowly

**Given**: $f(n) = \\sqrt{n}$ and $g(n) = \\log _2 n$. **Find**: which grows
faster, and where the crossover sits.

$$\\lim_{n \\to \\infty} \\frac{\\sqrt{n}}{\\log _2 n} = \\infty \\;\\Rightarrow\\; \\log _2 n \\in o(\\sqrt{n})$$

So the square root wins eventually. The instructive part is *when*. Setting
the two equal and scanning every integer from 2 to 4,999 finds exactly two
solutions, $n = 4$ and $n = 16$:

$$\\sqrt{4} = 2 = \\log _2 4, \\qquad \\sqrt{16} = 4 = \\log _2 16$$

Between those two the logarithm is the **larger** of the pair — at n = 10 it
is 3.322 against 3.162 — and only from n = 17 upward does the square root pull
ahead for good. An asymptotic statement that reverses on the whole interval
from 4 to 16 is a fair warning about reading limits as advice for small
inputs.

## 6.5 Worked Example: Better Big-O, Worse Runtime

**Given**: algorithm X runs in $x(n) = 0.2\\,n^2 \\log _{10} n$ milliseconds,
algorithm Y in $y(n) = 10\\,n^2$ milliseconds. **Find**: which has the better
asymptotic class, and the largest n at which the other is still faster.

$$\\lim_{n \\to \\infty} \\frac{x(n)}{y(n)} = \\lim_{n \\to \\infty} \\frac{0.2\\,n^2 \\log _{10} n}{10\\,n^2} = \\lim_{n \\to \\infty} 0.02 \\log _{10} n = \\infty$$

The limit diverges, so $y \\in o(x)$: **Y has the better big-O**, $\\Theta(n^2)$
against $\\Theta(n^2 \\log n)$. Now find where X is still ahead:

$$0.2\\,n^2 \\log _{10} n \\;<\\; 10\\,n^2 \\iff \\log _{10} n \\;<\\; 50 \\iff n \\;<\\; 10^{50}$$

**Answer**: Y is asymptotically better; X is faster for every problem size
below $10^{50}$, which is larger than the number of atoms in the observable
universe. The asymptotics are correct and the engineering decision is the
opposite one.

## 6.6 The Algebra of the Notation

| Rule | Statement | Why |
|---|---|---|
| Constant factors vanish | $O(k\\,f) = O(f)$ for constant k > 0 | fold k into the witness c |
| Sums take the maximum | $O(f) + O(g) = O(\\max(f, g))$ | $f + g \\le 2\\max(f,g)$ |
| Products multiply | $O(f) \\cdot O(g) = O(f g)$ | multiply the two witnesses |
| Transitive | $f \\in O(g)$ and $g \\in O(h)$ give $f \\in O(h)$ | compose the constants |
| Reflexive | $f \\in \\Theta(f)$ | take $c_1 = c_2 = 1$ |
| Not symmetric | $f = O(g)$ does not give $g = O(f)$ | the definition is one-sided |

The sum rule is what licenses "keep the dominant term", and the product rule
is what licenses "nested loops multiply". Written out for a program that runs
a linear pass and then a quadratic one:

$$T(n) = 3n + 5n^2 + 40 \\in O(n) + O(n^2) + O(1) = O(n^2)$$

Two statements that look like this algebra and are **false**:

$$O(n^3) < O(n^2) \\quad \\text{false} \\qquad\\qquad O(n \\log n) < O(n) \\quad \\text{false}$$

Ordering runs the other way, and the containment is strict at every step:

$$O(1) \\subset O(\\log n) \\subset O(n) \\subset O(n\\log n) \\subset O(n^2) \\subset O(2^n)$$

The table below is the same statement in numbers, evaluated exactly.

| n | $\\log _2 n$ | n | $n\\log _2 n$ | $n^2$ |
|---|---|---|---|---|
| 10 | 3.32 | 10 | 33.2 | 100 |
| 100 | 6.64 | 100 | 664 | 10,000 |
| 1,000 | 9.97 | 1,000 | 9,966 | 1,000,000 |
| 1,000,000 | 19.93 | 1,000,000 | 19,931,569 | $10^{12}$ |

Between the first and last rows the input grows by $10^5$, the logarithmic
column by a factor of 6, and the quadratic column by a factor of $10^{10}$.
That spread across five columns is the entire practical content of the
notation.`,
      examTip: 'To prove a Theta bound, produce c1, c2 and n0 and check the inequality at n0 - 1 as well as n0. To rank two functions fast, take the ratio limit: 0 means the numerator is strictly smaller, a finite non-zero value means Theta, infinity means strictly larger.',
      importantNote: 'A big-O bound is an upper bound only, so "insertion sort is O(n^3)" is TRUE and useless. When a question says "the complexity", it wants the tight Theta bound. When it says "which of the following are valid upper bounds", every class above the tight one qualifies.',
    },
    { id: 'algo-recurrences', title: '7. Solving Recurrences: Substitution, Trees, Master Theorem',
      content: `## 7.1 Substitution: Guess, Then Prove by Induction

A divide-and-conquer algorithm states its own cost as a recurrence, and the
recurrence has to be solved before a complexity can be named. The substitution
method guesses a closed form and proves it by induction. Merge sort's
**worst-case comparison count** is the standard example. Merging two runs of
combined length m costs at most $m - 1$ comparisons, because the last element
transfers for free, so

$$W(n) = W\\!\\left(\\lceil n/2 \\rceil\\right) + W\\!\\left(\\lfloor n/2 \\rfloor\\right) + n - 1, \\qquad W(1) = 0$$

For $n = 2^k$ the floors and ceilings disappear and the guess is
$W(n) = n\\log _2 n - n + 1$. The induction step, writing $n = 2m$:

$$W(2m) = 2\\left(m\\log _2 m - m + 1\\right) + 2m - 1 = 2m\\log _2 m + 1$$

$$2m\\log _2 m + 1 = 2m\\left(\\log _2 (2m) - 1\\right) + 1 = 2m\\log _2(2m) - 2m + 1$$

which is the guess at 2m. The base case $W(1) = 1 \\cdot 0 - 1 + 1 = 0$ holds,
so the closed form is exact for every power of two.

**Independent check.** Guessing right and inducting cleanly still proves
nothing about the algorithm — only about the recurrence. Running merge sort on
**every permutation** of n items for $n \\le 9$ and taking the largest
comparison count reproduces $W(n)$ exactly at every one of those sizes, and
the powers of two match the closed form up to n = 4096:

| n | Worst measured (exhaustive) | Recurrence $W(n)$ | $n\\log _2 n - n + 1$ |
|---|---|---|---|
| 4 | 5 | 5 | 5 |
| 8 | 17 | 17 | 17 |
| 9 | 21 | 21 | not a power of 2 |
| 16 | — | 49 | 49 |
| 256 | — | 1,793 | 1,793 |
| 4,096 | — | 45,057 | 45,057 |

## 7.2 The Recursion Tree: Add Up the Levels

A recursion tree makes the cost visible instead of algebraic. Draw one node
per subproblem, write the **non-recursive** work in each node, and sum by
level. For

$$T(n) = 3\\,T(n/4) + n^2$$

level i holds $3^i$ subproblems of size $n/4^i$, each doing $(n/4^i)^2$ work:

$$\\text{cost of level } i = 3^i \\cdot \\left(\\frac{n}{4^i}\\right)^{2} = \\left(\\frac{3}{16}\\right)^{i} n^2$$

The level costs form a geometric series with ratio 3/16 < 1, so the root
dominates and the whole sum is bounded by the infinite series:

$$T(n) \\;\\le\\; n^2 \\sum_{i=0}^{\\infty} \\left(\\frac{3}{16}\\right)^{i} = \\frac{n^2}{1 - 3/16} = \\frac{16}{13}\\,n^2 = 1.2308\\,n^2$$

so $T(n) \\in \\Theta(n^2)$. The shape of the series is the answer: ratio below
1 means root-dominated, ratio exactly 1 means every level costs the same and
the depth multiplies in, ratio above 1 means leaf-dominated.

![Three panels sharing a vertical log scale, each plotting the work performed at every recursion level for a divide-and-conquer recurrence at n equals 4096. The left panel, eight subproblems of half size with n squared work, climbs steeply toward the leaves. The middle panel, two subproblems of half size with linear work, is flat at 4096 across all thirteen levels. The right panel, two subproblems of half size with n squared work, falls steeply away from the root.](/courses/fe-ee/figures/sw2-master-cases.svg)

## 7.3 The Master Theorem, All Three Cases

For $T(n) = a\\,T(n/b) + f(n)$ with $a \\ge 1$ and $b > 1$, everything turns on
comparing $f(n)$ with the **critical function**

$$n^{\\log _b a}$$

which is the total work done by the leaves. The three cases:

| Case | Condition on f | Result | Reading |
|---|---|---|---|
| 1 | $f(n) \\in O(n^{\\log _b a - \\varepsilon})$ for some $\\varepsilon > 0$ | $T(n) \\in \\Theta(n^{\\log _b a})$ | leaves dominate |
| 2 | $f(n) \\in \\Theta(n^{\\log _b a})$ | $T(n) \\in \\Theta(n^{\\log _b a}\\log n)$ | every level ties |
| 3 | $f(n) \\in \\Omega(n^{\\log _b a + \\varepsilon})$ and $a\\,f(n/b) \\le c\\,f(n)$ for some $c < 1$ | $T(n) \\in \\Theta(f(n))$ | root dominates |

The extra clause in case 3 is the **regularity condition**, and it is the part
most summaries drop. It says the work at one level really does shrink by a
constant factor as you descend; without it the case can fail.

**Case 1 worked.** $T(n) = 8T(n/2) + n^2$:

$$\\log _2 8 = 3 \\;>\\; 2 \\;\\Rightarrow\\; \\varepsilon = 1 \\;\\Rightarrow\\; T(n) \\in \\Theta(n^3)$$

The left panel of the figure is this recurrence: level costs multiply by
$8/4 = 2$ each step down, so the bottom level alone carries about half the
total, and the sum is $2 - 2^{-12}$ times the bottom level at n = 4096.

**Case 2 worked.** $T(n) = 2T(n/2) + n$, which is merge sort:

$$\\log _2 2 = 1 = d \\;\\Rightarrow\\; T(n) \\in \\Theta(n\\log n)$$

The middle panel is flat at exactly n = 4096 across all 13 levels, so the
total is $n(\\log _2 n + 1)$ — the classic result read straight off the picture.

**Case 3 worked.** $T(n) = 2T(n/2) + n^2$:

$$\\log _2 2 = 1 \\;<\\; 2 \\;\\Rightarrow\\; \\varepsilon = 1$$

$$a\\,f(n/b) = 2\\left(\\frac{n}{2}\\right)^{2} = \\frac{n^2}{2} = \\tfrac{1}{2}\\,f(n) \\;\\Rightarrow\\; c = \\tfrac{1}{2} < 1 \\ \\checkmark$$

so $T(n) \\in \\Theta(n^2)$. Both the exponent test and the regularity condition
pass, and the right panel shows the level costs halving away from the root.

**One more, because the exponent is not an integer.** Strassen's matrix
multiplication does 7 multiplications of half-sized blocks plus quadratic
additions:

$$T(n) = 7\\,T(n/2) + n^2, \\qquad \\log _2 7 = 2.8074 \\;>\\; 2 \\;\\Rightarrow\\; T(n) \\in \\Theta(n^{2.8074})$$

against $\\Theta(n^3)$ for the schoolbook method — a real asymptotic gain from
one saved multiplication.

## 7.4 Worked Example: A Recurrence the Theorem Cannot Touch

**Given**: $T(n) = 2\\,T(n/2) + n\\log _2 n$, $T(1) = 0$. **Find**: the tight
bound.

The critical function is $n^{\\log _2 2} = n$. Compare:

$$\\frac{f(n)}{n^{\\log _b a}} = \\frac{n\\log _2 n}{n} = \\log _2 n$$

This ratio grows, so case 2 is out; but it grows **slower than any** $n^{\\varepsilon}$,
so case 3 is out too. There is a gap between cases 2 and 3, and this
recurrence falls in it. Build the tree instead. Level i has $2^i$ subproblems
of size $n/2^i$:

$$\\text{cost of level } i = 2^i \\cdot \\frac{n}{2^i}\\log _2\\!\\left(\\frac{n}{2^i}\\right) = n\\left(\\log _2 n - i\\right)$$

Summing over $i = 0$ to $k = \\log _2 n$ gives an arithmetic series:

$$T(n) = n\\sum_{i=0}^{k}(k - i) = n\\,\\frac{k(k+1)}{2} = \\frac{n\\log _2 n\\,(\\log _2 n + 1)}{2}$$

so $T(n) \\in \\Theta(n\\log ^2 n)$.

**Answer, checked.** Evaluating the recurrence directly in code at every power
of two from 2 to 4096 reproduces the closed form exactly; at n = 1024 both
routes give

$$T(1024) = \\frac{1024 \\cdot 10 \\cdot 11}{2} = 56320$$

Two other shapes fall outside the theorem's form entirely, because they
subtract from n rather than divide it:

$$T(n) = T(n-1) + n \\;\\Rightarrow\\; T(n) = \\frac{n(n+1)}{2} \\in \\Theta(n^2)$$

$$T(n) = T(n-1) + 1 \\;\\Rightarrow\\; T(n) = n \\in \\Theta(n)$$

## 7.5 Worked Example: Binary Search, Solved Exactly

**Given**: binary search on a sorted array of n keys, one three-way key
comparison per iteration. **Find**: the exact worst-case comparison count.

Each iteration discards at least half the remaining range:

$$T(n) = T\\!\\left(\\lfloor n/2 \\rfloor\\right) + 1, \\qquad T(1) = 1$$

Unrolling, after i iterations at most $\\lfloor n/2^i \\rfloor$ keys remain, and
the search stops when that reaches 1:

$$\\frac{n}{2^{i}} = 1 \\iff i = \\log _2 n \\;\\Rightarrow\\; T(n) = \\lfloor \\log _2 n \\rfloor + 1$$

**Independent check.** Running the loop for **every target in every array**
from n = 1 to n = 3000 and taking the maximum iteration count reproduces
$\\lfloor \\log _2 n \\rfloor + 1$ at all 3,000 sizes, with no exceptions. The
average successful search is one comparison cheaper, because half the keys sit
in the bottom level of the search tree; summing $i\\,2^{i-1}$ over the levels
of a perfectly filled range of $n = 2^k - 1$ keys gives

$$\\bar{T}(n) = \\frac{(k-1)\\,2^{k} + 1}{n}$$

| n | Worst case, measured | $\\lfloor \\log _2 n \\rfloor + 1$ | Mean successful, measured | Closed form |
|---|---|---|---|---|
| 15 | 4 | 4 | 3.27 | 3.27 |
| 127 | 7 | 7 | 6.06 | 6.06 |
| 1,023 | 10 | 10 | 9.01 | 9.01 |
| 1,000,000 | 20 | 20 | — | — |

## 7.6 Worked Example: The Fibonacci Call Count, Counted

**Given**: the naive recursion \`fib(n) = fib(n-1) + fib(n-2)\`. **Find**: the
number of calls, exactly.

Let $C(n)$ be the total calls made by \`fib(n)\`, counting the outermost one:

$$C(0) = C(1) = 1, \\qquad C(n) = 1 + C(n-1) + C(n-2)$$

Adding 1 to both sides turns it into the Fibonacci recurrence itself, giving
the closed form

$$C(n) = 2\\,F(n+1) - 1$$

where $F$ is the Fibonacci sequence with $F(0) = 0$, $F(1) = 1$. Because
consecutive Fibonacci numbers approach the golden ratio,

$$\\varphi = \\frac{1 + \\sqrt{5}}{2} = 1.618034, \\qquad C(n) \\in \\Theta(\\varphi^{n})$$

**Independent check, and why it matters.** The identity was verified against a
plain uninstrumented recursion that actually makes every call, for every n
from 0 to 25; the two agree exactly. The table then shows how badly the
familiar $2^n$ overstates the truth:

| n | Calls, counted | $2^n$ | $2^n$ overstates by |
|---|---|---|---|
| 10 | 177 | 1,024 | 5.8x |
| 20 | 21,891 | 1,048,576 | 47.9x |
| 30 | 2,692,537 | 1,073,741,824 | 398.8x |
| 40 | 331,160,281 | $1.0995 \\times 10^{12}$ | 3,320x |
| 50 | 40,730,022,147 | $1.1259 \\times 10^{15}$ | **27,643x** |

$O(2^n)$ is a **true** statement about this recursion and a badly slack one;
$\\Theta(\\varphi^n)$ is the tight class. Measuring the ratio of successive
counts confirms it: $C(50)/C(49) = 1.6180339888$, matching $\\varphi$ to ten
digits. Memoisation replaces the whole tree with $n + 1$ distinct subproblems,
so \`fib(40)\` drops from 331,160,281 calls to 41 — a factor of 8,077,080.`,
      examTip: 'Master theorem in three steps: compute log_b(a), compare it with the exponent in f(n), and if you land in case 3 also check the regularity condition a f(n/b) <= c f(n). Recurrences that SUBTRACT from n, like T(n) = T(n-1) + n, are outside the theorem entirely - unroll them.',
      importantNote: 'There is a real gap between Master cases 2 and 3: T(n) = 2T(n/2) + n log n has f(n) larger than n but not POLYNOMIALLY larger, so no case applies. The recursion tree gives Theta(n log^2 n), and the exact solution n log2 n (log2 n + 1) / 2 was checked against the recurrence at every power of two up to 4096.',
    },
    { id: 'algo-sorting-derived', title: '8. Sorting: Counts Derived, Counts Measured',
      content: `## 8.1 Two Sorts Whose Counts Are Fixed by Structure

Selection sort scans the unsorted tail for the minimum on every pass. The pass
lengths are $n-1, n-2, \\ldots, 1$ whatever the data contains:

$$C_{\\text{sel}}(n) = \\sum_{i=1}^{n-1} i = \\frac{n(n-1)}{2}$$

There is no best case and no worst case — the count is the same for sorted,
reversed and random input. Running it on 50 random permutations at each of
n = 5, 7, 10, 50 and 200 returns a **single** distinct value at every size,
equal to $n(n-1)/2$: 10, 21, 45, 1,225 and 19,900.

Bubble sort has the same worst case and, with the standard "no swaps this
pass" early exit, a linear best case:

$$C_{\\text{bub}}^{\\text{worst}}(n) = \\frac{n(n-1)}{2}, \\qquad C_{\\text{bub}}^{\\text{best}}(n) = n - 1$$

Measured on reversed and on already-sorted input at n = 5, 7, 8, 10 the counts
are exactly 10 and 4, 21 and 6, 28 and 7, 45 and 9. For seven items the worst
case is

$$\\frac{7 \\cdot 6}{2} = 21 \\ \\text{comparisons}$$

which is the number an exam question about "the maximum comparisons to bubble
sort 7 items" is asking for. Note that the early exit is what creates the
$\\Theta(n)$ best case; a bubble sort written without the flag is
$\\Theta(n^2)$ on every input, and questions do distinguish the two.

## 8.2 Worked Example: Insertion Sort's Average, Derived and Enumerated

**Given**: insertion sort on a uniformly random permutation of n distinct
keys. **Find**: the expected number of key comparisons.

Consider the element arriving at index i, with $i$ elements already sorted to
its left. Let j be how many of those exceed it. On a random permutation j is
uniform on $\\{0, 1, \\ldots, i\\}$. The inner loop stops one comparison after
the first smaller neighbour, except when the element runs off the left end,
where it stops for lack of array rather than for a comparison:

$$\\text{comparisons} = \\begin{cases} j + 1 & j < i \\\\ i & j = i \\end{cases}$$

Averaging over the $i+1$ equally likely values of j:

$$E_i = \\frac{1}{i+1}\\left[\\sum_{j=0}^{i-1}(j+1) + i\\right] = \\frac{1}{i+1}\\left[\\frac{i(i+1)}{2} + i\\right] = \\frac{i}{2} + \\frac{i}{i+1}$$

Summing over $i = 1$ to $n-1$, and writing $H_n$ for the n-th harmonic number:

$$E[C] = \\sum_{i=1}^{n-1}\\left(\\frac{i}{2} + 1 - \\frac{1}{i+1}\\right) = \\frac{n(n-1)}{4} + n - H_n$$

**Independent check.** The derivation is confirmed not by re-deriving it but
by running insertion sort on **all** $n!$ orderings for n = 2 through 9 and
averaging as exact rationals. Every size agrees to the last digit:

| n | Orderings enumerated | Mean measured | $n(n-1)/4 + n - H_n$ |
|---|---|---|---|
| 4 | 24 | 59/12 = 4.9167 | 59/12 |
| 6 | 720 | 221/20 = 11.05 | 221/20 |
| 8 | 40,320 | 5399/280 = 19.282 | 5399/280 |
| 9 | 362,880 | 60911/2520 = 24.171 | 60911/2520 |

![Four series against array length from two to nine, all measured: insertion sort's worst case n times n minus one over two, its mean taken over every one of the n factorial orderings, the closed-form prediction drawn as a dashed line underneath that mean, and its best case n minus one. The measured mean and the closed form coincide at every size.](/courses/fe-ee/figures/sw2-insertion-exact.svg)

The leading term is $n^2/4$, which is where the "quadratic with a factor of
about four in hand over the worst case" reputation comes from. The extremes
are reached exactly:

$$C^{\\text{best}} = n - 1 \\ \\text{(already sorted)}, \\qquad C^{\\text{worst}} = \\frac{n(n-1)}{2} \\ \\text{(reversed)}$$

and measuring at n = 100 gives 99 and 4,950 respectively — a factor of 50
between the two ends at a single size.

## 8.3 Worked Example: Quick Sort's Expected Comparisons

**Given**: quick sort with Lomuto partitioning and the last element as pivot,
on a random permutation. **Find**: the expected comparison count.

Partitioning a subarray of length m costs $m - 1$ comparisons and leaves the
pivot in a uniformly random rank. Conditioning on that rank:

$$C(n) = n - 1 + \\frac{1}{n}\\sum_{i=0}^{n-1}\\bigl[C(i) + C(n-1-i)\\bigr], \\qquad C(0) = C(1) = 0$$

The standard solution of that recurrence is

$$C(n) = 2(n+1)H_n - 4n \\;\\approx\\; 2n\\ln n \\;=\\; 1.386\\,n\\log _2 n$$

**Independent check.** Enumerating **every** permutation for n = 2 through 8
and averaging as exact rationals matches the closed form at every size — 1,
8/3, 29/6, 37/5, 103/10, 472/35 and 2369/140, that last being 16.921. So the
constant 1.386 is real. Evaluated against merge sort's exact worst case, quick
sort's average is 22.6 % higher at n = 1024 (11,298 against 9,217) and 25.4 %
higher at n = 4096 (56,503 against 45,057). Quick sort wins in practice on
cache behaviour and the absence of a copy buffer, not on comparison count.

The worst case is the other half of the story. Feeding an **already sorted**
array to a last-element pivot makes every partition maximally lopsided:

$$C^{\\text{worst}}(n) = \\sum_{m=2}^{n}(m-1) = \\frac{n(n-1)}{2}$$

and running it on the sorted arrays of length 5, 10, 100 and 1000 returns
exactly 10, 45, 4,950 and 499,500. Sorted input is common; that is why
production quick sorts randomise the pivot or take a median of three.

## 8.4 Why No Comparison Sort Beats n log n

Model any comparison sort as a **decision tree**: each internal node is one
comparison with two outcomes, each leaf is one of the possible output
orderings. A correct sort must be able to reach every one of the $n!$
orderings, and a binary tree of height h has at most $2^h$ leaves:

$$2^{h} \\;\\ge\\; n! \\;\\Rightarrow\\; h \\;\\ge\\; \\log _2(n!)$$

Since h is the length of the longest root-to-leaf path, it is the worst-case
comparison count. Stirling's approximation turns the bound into a familiar
shape:

$$\\log _2(n!) = n\\log _2 n - n\\log _2 e + O(\\log n) = n\\log _2 n - 1.4427\\,n + O(\\log n)$$

so every comparison sort is $\\Omega(n\\log n)$ in the worst case. The bound is
not loose:

| n | $\\lceil \\log _2(n!) \\rceil$ | Merge sort worst case | Excess |
|---|---|---|---|
| 16 | 45 | 49 | 8.9 % |
| 64 | 296 | 321 | 8.4 % |
| 256 | 1,684 | 1,793 | 6.5 % |
| 1,024 | 8,770 | 9,217 | 5.1 % |

![Three series on logarithmic axes against array length from four to 4096: selection sort's fixed count n times n minus one over two drawn dashed and far above, merge sort's exact worst case measured and plotted as points, and the information-theoretic floor log base two of n factorial running just beneath it. The merge-sort points sit a few percent above the floor at every size.](/courses/fe-ee/figures/sw2-sort-worstcase.svg)

Two cautions the figure makes concrete. The floor bounds the **worst case**,
not every input: a single lucky permutation can be sorted in fewer than
$\\lceil \\log _2 n! \\rceil$ comparisons, and merge sort routinely is. And the
bound only constrains sorts that compare keys — counting sort and radix sort
run in $O(n + k)$ by using the key as an index, which is not a comparison at
all.

## 8.5 Worked Example: Merging Two Sorted Runs

**Given**: sorted arrays a = {14, 46, 60, 64} and b = {31, 33, 76, 82}.
**Find**: comparisons to place the first output element, and to complete the
merge.

The first output element takes exactly **one** comparison — 14 against 31 —
whatever the data, because a merge compares only the two current heads. The
full merge, traced:

| Step | Compare | Winner | Output so far |
|---|---|---|---|
| 1 | 14 vs 31 | 14 | 14 |
| 2 | 46 vs 31 | 31 | 14, 31 |
| 3 | 46 vs 33 | 33 | 14, 31, 33 |
| 4 | 46 vs 76 | 46 | 14, 31, 33, 46 |
| 5 | 60 vs 76 | 60 | 14, 31, 33, 46, 60 |
| 6 | 64 vs 76 | 64 | 14, 31, 33, 46, 60, 64 |
| — | run a is empty | — | 76, 82 copied free |

**Answer**: 1 comparison for the first element, **6** for the whole merge.
The maximum any pair of four-element runs can force is 7, checked by
enumerating all 70 ways to split eight distinct keys into two sorted runs of
four; the general bound is $m - 1$ for a combined length of m, and this pair
falls one short because a exhausted first.

## 8.6 Choosing by Count Rather Than by Class

| Algorithm | Best | Average | Worst | Extra space | Stable |
|---|---|---|---|---|---|
| Selection | $n(n-1)/2$ | $n(n-1)/2$ | $n(n-1)/2$ | O(1) | No |
| Bubble (with flag) | $n-1$ | $\\Theta(n^2)$ | $n(n-1)/2$ | O(1) | Yes |
| Insertion | $n-1$ | $n(n-1)/4 + n - H_n$ | $n(n-1)/2$ | O(1) | Yes |
| Merge | $\\Theta(n\\log n)$ | $\\Theta(n\\log n)$ | $n\\log _2 n - n + 1$ | O(n) | Yes |
| Quick (Lomuto) | $\\Theta(n\\log n)$ | $2(n+1)H_n - 4n$ | $n(n-1)/2$ | $O(\\log n)$ stack | No |
| Heap | $\\Theta(n\\log n)$ | $\\Theta(n\\log n)$ | $\\Theta(n\\log n)$ | O(1) | No |
| Counting | $\\Theta(n+k)$ | $\\Theta(n+k)$ | $\\Theta(n+k)$ | O(k) | Yes |

The exact columns are what separate near-neighbours. Selection and bubble are
both $\\Theta(n^2)$, but selection performs at most $n-1$ **swaps** against
bubble's $n(n-1)/2$, which matters when a record is large and a comparison is
cheap. Insertion and selection are both $\\Theta(n^2)$, but insertion is
$\\Theta(n)$ on nearly sorted data and selection never is. Reading only the
class hides both distinctions.`,
      examTip: 'Selection sort always performs exactly n(n-1)/2 comparisons - best, average and worst - so a question asking for "the number of comparisons" has one answer. Bubble sort matches that worst case but drops to n-1 on sorted input ONLY if the implementation has the swapped flag.',
      importantNote: 'Quick sort degenerates to n(n-1)/2 comparisons on ALREADY SORTED input when the pivot is the first or last element - 499,500 comparisons at n = 1000, measured. That is the opposite of insertion sort, which is at its best on the same input. If a question says the data arrives nearly sorted, those two algorithms swap places.',
    },
    { id: 'algo-search-graph', title: '9. Searching, Graph Traversal, and When Sorting Pays',
      content: `## 9.1 What the Sorted Requirement Buys, in Comparisons

Linear search on unsorted data averages half the array on a successful lookup
and reads all of it on a failure:

$$C_{\\text{lin}}^{\\text{success}} = \\frac{n+1}{2}, \\qquad C_{\\text{lin}}^{\\text{fail}} = n$$

Binary search, from the recurrence solved in section 7.5, costs
$\\lfloor \\log _2 n \\rfloor + 1$ in the worst case. At n = 1024 that is
512.5 against 11 — a factor of 46 — but the sorted array has to be paid for
first, at merge sort's worst case of 9,217 comparisons.

## 9.2 Worked Example: How Many Queries Justify the Sort

**Given**: an unsorted array of n = 1024 records that will be queried q times.
**Find**: the smallest q at which sorting first is cheaper.

Set the two cumulative costs equal:

$$\\underbrace{9217}_{\\text{sort once}} + 11\\,q \\;=\\; 512.5\\,q$$

$$q = \\frac{9217}{512.5 - 11} = \\frac{9217}{501.5} = 18.379$$

**Answer**: the 19th query is the first one the sort has paid for. Below that,
scan; above it, sort. The same calculation at other sizes:

| n | Merge sort worst case | Linear average per query | Binary worst per query | Break-even q |
|---|---|---|---|---|
| 100 | 573 | 50.5 | 7 | 14 |
| 1,024 | 9,217 | 512.5 | 11 | 19 |
| 1,000,000 | 18,951,425 | 500,000.5 | 20 | 38 |

![Two straight lines of cumulative key comparisons against the number of queries for an array of 1024 records: a linear scan accumulating 512.5 comparisons per query from the origin, and a sort-once-then-binary-search line starting at 9,217 and rising by 11 per query. The lines cross at 18.38 queries, marked with a dot and a dotted vertical line.](/courses/fe-ee/figures/sw2-search-breakeven.svg)

The break-even count grows only logarithmically in n — 14 queries at a hundred
records, 38 at a million — because the sort cost and the scan cost both grow
nearly linearly while the binary search cost barely moves. In practice this is
why a database builds an index once and amortises it over every later query,
and why a one-off script should not bother.

## 9.3 Traversal Cost Depends on the Representation

Both breadth-first and depth-first search visit each vertex once and inspect
each edge a bounded number of times, so on an **adjacency list** both cost

$$T_{\\text{list}} = \\Theta(V + E)$$

On an **adjacency matrix** finding the neighbours of one vertex means reading a
whole row of V cells, whether or not those cells hold edges:

$$T_{\\text{matrix}} = \\Theta(V^2)$$

For a sparse graph — a road network, a call graph, most real graphs — E is
close to V and the difference is a factor of V. The number of edges is bounded
by

$$0 \\;\\le\\; E \\;\\le\\; \\binom{V}{2} = \\frac{V(V-1)}{2}$$

so the two representations only converge at the complete graph. Section 10 of
the Data Structures chapter quantifies the same trade in storage.

## 9.4 Worked Example: BFS and DFS on One Graph

**Given**: an undirected graph on 7 vertices, neighbours listed in
alphabetical order.

| Vertex | Neighbours |
|---|---|
| A | B, C, D |
| B | A, E |
| C | A, E, F |
| D | A, F |
| E | B, C, G |
| F | C, D, G |
| G | E, F |

**Find**: the BFS and DFS visit orders from A, the hop distances, and the
traversal cost.

Counting the adjacency lists gives 18 entries, so $E = 9$ and $V = 7$:

$$T_{\\text{list}} = V + E = 7 + 9 = 16 \\ \\text{steps}, \\qquad T_{\\text{matrix}} = 7^2 = 49 \\ \\text{cells}$$

**BFS** with a queue. Dequeue A, enqueue B, C, D. Dequeue B, enqueue E.
Dequeue C — E is already seen — enqueue F. Dequeue D, both neighbours seen.
Dequeue E, enqueue G. Dequeue F, then G.

$$\\text{BFS order: } A, B, C, D, E, F, G$$

**DFS** by recursion. From A go to B, from B to E, from E to C (B is seen),
from C to F, from F to D; D's neighbours are both seen, so unwind to F, whose
remaining neighbour G is still unvisited.

$$\\text{DFS order: } A, B, E, C, F, D, G$$

**Hop distances**, a by-product of BFS because it finishes every vertex at
distance k before starting any at distance k+1:

| Vertex | A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|---|
| Hops from A | 0 | 1 | 1 | 1 | 2 | 2 | 3 |

**Answer**: the orders above, with G three hops from A. Note that DFS reaches G
last as well but by a completely different route, and DFS gives no distance
information at all — its path from A to G is A, B, E, G of length 3 here only
by coincidence.

## 9.5 Weighted Graphs: Where BFS Stops Working

BFS finds the fewest **hops**, which is the shortest path only when every edge
costs the same. With unequal weights the frontier is no longer ordered by
distance and Dijkstra's algorithm is needed, keeping the frontier in a
priority queue instead of a plain queue:

$$T_{\\text{Dijkstra}} = \\Theta\\bigl((V + E)\\log V\\bigr) \\ \\text{with a binary heap}, \\qquad \\Theta(V^2) \\ \\text{with a scan}$$

Which is better is a density question again. At V = 1000 and E = 5000 the heap
form does about $5000 \\cdot 10 = 50000$ heap operations against
$1000 \\cdot 1000 = 1000000$ scan steps; at E = 499,500, the complete graph,
the heap form does about 4,980,000 and the scan wins. The rule of thumb that
follows: **heap for sparse, array scan for dense**.

$$\\text{BFS} = \\text{Dijkstra with every weight equal to } 1$$

is worth remembering because it explains why BFS needs no priority queue: with
identical weights, first-in-first-out already visits in non-decreasing
distance order.

| Algorithm | Finds | Needs | Cost on a list |
|---|---|---|---|
| BFS | fewest hops from one source | queue | $\\Theta(V+E)$ |
| DFS | any path, cycle detection, topological order | stack or recursion | $\\Theta(V+E)$ |
| Dijkstra | cheapest path, non-negative weights | priority queue | $\\Theta((V+E)\\log V)$ |
| Bellman-Ford | cheapest path, negative weights allowed | none | $\\Theta(VE)$ |

## 9.6 The Visited Set, and Why Trees Get Away Without One

A graph search that does not record visited vertices revisits them, and on any
graph containing a cycle it never terminates. The graph above contains the
cycle A, B, E, C, A, so an unguarded DFS from A loops forever. A tree has no
cycles, which is exactly why tree traversal code looks simpler than graph
traversal code — the missing bookkeeping is not an optimisation, it is a
property of the input.

$$\\text{a tree on } V \\text{ vertices has exactly } E = V - 1 \\text{ edges and no cycle}$$

Substituting that into the traversal bound recovers the familiar tree result:

$$\\Theta(V + E) = \\Theta(V + V - 1) = \\Theta(V)$$

The visited set costs $\\Theta(V)$ space, which is already implied by the
$\\Theta(V+E)$ time bound, so it is never the reason to avoid a graph search.`,
      examTip: 'Sorting to enable binary search pays only after roughly 2 log2(n) queries - 14 at n = 100, 19 at n = 1024, 38 at a million. For a single lookup a linear scan wins. BFS gives fewest hops, DFS does not; if edge weights differ, neither works and Dijkstra is required.',
      importantNote: 'Adjacency list traversal is Theta(V + E); adjacency matrix traversal is Theta(V^2) regardless of how few edges exist. On a sparse graph that is a factor of V, and it is the representation - not the algorithm - that causes it.',
    },
    { id: 'algo-greedy-dp', title: '10. Greedy, Dynamic Programming, and P versus NP',
      content: `## 10.1 Two Ways to Exploit Structure

Both paradigms attack problems whose optimal solution is built from optimal
solutions to smaller instances — the **optimal substructure** property. They
differ in what they do next.

| | Greedy | Dynamic programming |
|---|---|---|
| Decision rule | take the best-looking option now, never revisit | evaluate every option, keep the best |
| Extra requirement | greedy-choice property (a local optimum extends to a global one) | overlapping subproblems worth storing |
| Typical cost | $\\Theta(n\\log n)$, usually the sort | $\\Theta(n \\cdot W)$ or $\\Theta(n^2)$, the table size |
| Failure mode | silently returns a suboptimal answer | runs out of memory |
| Examples | activity selection, Huffman coding, Dijkstra, Kruskal | knapsack, edit distance, coin change, matrix chain |

The dangerous asymmetry is in the failure row. A dynamic program that is too
big fails visibly; a greedy algorithm that lacks the greedy-choice property
returns a plausible wrong answer with no signal at all.

## 10.2 Worked Example: A Greedy Choice That Is Provably Correct

**Given**: 11 activities with (start, finish) times (1,4), (3,5), (0,6),
(5,7), (3,9), (5,9), (6,10), (8,11), (8,12), (2,14), (12,16). **Find**: the
largest set of mutually non-overlapping activities.

Sort by **finish** time and take each activity whose start is at or after the
last finish taken:

| Considered (by finish) | Last finish | Start | Taken? |
|---|---|---|---|
| (1,4) | none | 1 | yes |
| (3,5), (0,6) | 4 | 3, 0 | no, no |
| (5,7) | 4 | 5 | yes |
| (3,9), (5,9), (6,10) | 7 | 3, 5, 6 | no, no, no |
| (8,11) | 7 | 8 | yes |
| (8,12), (2,14) | 11 | 8, 2 | no, no |
| (12,16) | 11 | 12 | yes |

**Answer**: (1,4), (5,7), (8,11), (12,16) — **4 activities**. Enumerating
every subset of the 11 activities and testing compatibility confirms that 4 is
the maximum; no set of 5 is compatible.

The greedy choice is justified by an **exchange argument**: if some optimal
solution does not begin with the earliest-finishing activity, swapping its
first activity for that one cannot create a conflict, because the replacement
finishes no later. Repeating the swap converts any optimal solution into the
greedy one without shrinking it. Sorting by **start** time instead breaks the
argument, and picking (0,6) first here would cost an activity.

## 10.3 Worked Example: A Greedy Choice That Provably Fails

**Given**: coin denominations {1, 3, 4} and an amount of 6. **Find**: the
fewest coins, greedily and optimally.

Greedy takes the largest coin that fits, repeatedly:

$$6 - 4 = 2, \\qquad 2 - 1 = 1, \\qquad 1 - 1 = 0 \\;\\Rightarrow\\; 3 \\ \\text{coins}$$

Dynamic programming fills a table of best[t] for every amount up to the target,
each entry taking the cheapest predecessor:

$$\\text{best}[t] = 1 + \\min_{c \\,\\in\\, \\{1,3,4\\},\\ c \\le t} \\text{best}[t - c], \\qquad \\text{best}[0] = 0$$

| t | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| best[t] | 0 | 1 | 2 | 1 | 1 | 2 | **2** |

**Answer**: greedy uses 3 coins (4+1+1), the optimum is **2** (3+3). The
greedy answer is 50 % worse, and nothing in the greedy run signals it.

![Two step functions against the amount to be made from coins of one, three and four, over amounts one to forty: the coins used by the take-the-largest-first heuristic and the true minimum found by dynamic programming. The two agree except at nine marked amounts starting at six, where greedy is exactly one coin worse, and a dotted vertical line marks the first failure.](/courses/fe-ee/figures/sw2-greedy-gap.svg)

Running both routines over every amount from 1 to 40 finds the heuristic wrong
at exactly nine of them — 6, 10, 14, 18, 22, 26, 30, 34 and 38 — always by one
coin. Running the same comparison with the US set {1, 5, 10, 25} over every
amount from 1 to 99 finds **no** disagreement at all, which is precisely why
the heuristic feels safe: it is correct for the coin system most people have
in their pocket, and that is a property of the system, not of the method.

## 10.4 Worked Example: Greedy Density on the 0/1 Knapsack

**Given**: capacity 10 and three indivisible items.

| Item | Weight | Value | Value per unit weight |
|---|---|---|---|
| A | 6 | 30 | 5.00 |
| B | 5 | 20 | 4.00 |
| C | 5 | 21 | 4.20 |

**Find**: the greedy-by-density answer and the true optimum.

Greedy sorts A, C, B by density and takes A (weight 6). Only 4 of capacity
remains, and neither remaining item fits:

$$V_{\\text{greedy}} = 30, \\qquad \\text{weight used} = 6 \\ \\text{of} \\ 10$$

The dynamic program tabulates the best value for each item prefix and each
capacity:

$$V[i][w] = \\max\\bigl(V[i-1][w],\\; V[i-1][w - w_i] + v_i\\bigr) \\ \\text{when } w_i \\le w$$

| Items considered | w=0..4 | w=5 | w=6..9 | w=10 |
|---|---|---|---|---|
| none | 0 | 0 | 0 | 0 |
| A | 0 | 0 | 30 | 30 |
| A, B | 0 | 20 | 30 | 30 |
| A, B, C | 0 | 21 | 30 | **41** |

**Answer**: the optimum is **41** (B + C, weight exactly 10); greedy returns
30, which is 73.2 % of the optimum. The table has
$3 \\times 11 = 33$ cells, so the dynamic program costs $\\Theta(nW)$ — fast
here, and note that W is the **numeric value** of the capacity, not its bit
length, which is why this is called pseudo-polynomial rather than polynomial.

Greedy density is not worthless: it is exactly optimal for the **fractional**
knapsack, where items can be cut. Cutting item C to fill the leftover 4 units
would give $30 + 4/5 \\cdot 21 = 46.8$, an upper bound the integer problem
cannot reach. Indivisibility is the whole difficulty.

## 10.5 Memoisation Is the Cheap Half of Dynamic Programming

Two ingredients license a dynamic program:

$$\\text{(1) optimal substructure} \\qquad \\text{(2) overlapping subproblems}$$

The Fibonacci recursion has both, and section 7.6 counted what ignoring the
second costs: 331,160,281 calls at n = 40 against **41** distinct
subproblems, a factor of 8,077,080. Top-down memoisation adds a lookup table
and changes nothing else; bottom-up tabulation fills the same table in
dependency order and drops the call stack too.

| Approach | Time | Space | Notes |
|---|---|---|---|
| Naive recursion | $\\Theta(\\varphi^n)$ | $\\Theta(n)$ stack | recomputes everything |
| Memoised (top-down) | $\\Theta(n)$ | $\\Theta(n)$ table + stack | code stays recursive |
| Tabulated (bottom-up) | $\\Theta(n)$ | $\\Theta(n)$ table | no recursion at all |
| Rolling two values | $\\Theta(n)$ | $\\Theta(1)$ | only the last two are ever read |

The last row is the reminder that a dynamic program's table is only as large
as its **dependency window**. Fibonacci reads two previous entries, so two
variables suffice; the 0/1 knapsack reads one previous row, so two rows
suffice instead of the full $n \\times W$ grid.

## 10.6 P, NP, and What the Names Actually Mean

**P** is the class of decision problems a deterministic machine can *solve* in
time polynomial in the input size:

$$P = \\bigcup_{k \\ge 1} \\text{TIME}\\bigl(n^{k}\\bigr)$$

**NP** is the class whose *yes* answers can be **verified** in polynomial time
given a certificate. Handed a proposed Hamiltonian cycle you can check it in
$\\Theta(V)$ steps; finding one is another matter.

$$P \\subseteq NP$$

holds trivially — a solver is a verifier that ignores the certificate. Whether
the containment is strict is the open question:

$$P \\stackrel{?}{=} NP$$

A problem is **NP-complete** when it is in NP and every problem in NP reduces
to it by a polynomial-time transformation, so it is at least as hard as
everything in the class. **NP-hard** drops the "in NP" requirement, so it
includes optimisation and non-decision problems too.

| Term | Meaning | Example |
|---|---|---|
| P | solvable in polynomial time | sorting, shortest path, primality |
| NP | a yes-answer is checkable in polynomial time | Hamiltonian cycle, SAT, subset sum |
| NP-complete | in NP, and everything in NP reduces to it | SAT, 3-colouring, travelling salesman (decision form) |
| NP-hard | everything in NP reduces to it; need not be in NP | travelling salesman (optimisation form), halting problem |

Three statements that exam wording likes to test:

- **NP does not mean "not polynomial".** It stands for nondeterministic
  polynomial time. Every problem in P is also in NP.
- **NP-complete does not mean "unsolvable".** The 0/1 knapsack is NP-complete
  and section 10.4 solved an instance of it exactly; the pseudo-polynomial
  $\\Theta(nW)$ table is polynomial in W but exponential in the number of bits
  used to write W down.
- **A polynomial-time algorithm for one NP-complete problem would give one for
  all of them**, by composing the reductions. That is what makes the class
  interesting and why nobody expects a solution to arrive quietly.`,
      examTip: 'Greedy is optimal only when the problem has the greedy-choice property; the exam tests this with coin systems. Coins {1,3,4} making 6: greedy gives 3 coins, the optimum is 2. Coins {1,5,10,25} never fail below a dollar, which is why the trap works.',
      importantNote: 'NP stands for NONDETERMINISTIC POLYNOMIAL, not "non-polynomial". P is a subset of NP, every problem in P is in NP, and whether the containment is strict is unresolved. NP-complete means in NP and universal for NP; NP-hard drops the membership requirement.',
    },
    { id: 'algo-problem-sets', title: '11. Problem Sets: Complexity, Recurrences, Sorting, Search',
      content: `## Problem Set A — Notation, Recurrences, Counting

**A1.** An algorithm's running time is $T(n) = 60 + 0.005\\,n^3 + 0.01\\,n$.
Give the tight bound.

**A2.** Give the witness constants $c_1$, $c_2$, $n_0$ that certify
$5n^2 + 3n + 1 \\in \\Theta(n^2)$, taking $c_2 = 6$.

**A3.** Solve $T(n) = 4\\,T(n/2) + n^2$ and state the case used.

**A4.** Solve $T(n) = 3\\,T(n/2) + n$ and state the case used.

**A5.** How many times does the body of the following loop nest execute, and
what is the complexity?

    for i = 1 to n:
        for j = i to n:
            body

**A6.** A recursive routine calls itself twice on inputs of size $n-1$ and
$n-2$ and does constant work besides. Is $O(2^n)$ a correct bound? Is it the
tight one?

### Worked Answers, Set A

**A1.** Drop the constant 60 and the linear term; the cubic dominates.

$$T(n) \\in \\Theta(n^3)$$

**Trap**: answering $O(1)$ because the constant 60 is the largest coefficient
at n = 1. Coefficients never decide a growth class — at n = 100 the cubic term
alone is $0.005 \\cdot 1000000 = 5000$ against a constant of 60.

**A2.** Upper: $5n^2 + 3n + 1 \\le 6n^2$ requires $0 \\le n^2 - 3n - 1$, whose
positive root is

$$n \\ge \\frac{3 + \\sqrt{9 + 4}}{2} = \\frac{3 + \\sqrt{13}}{2} = 3.3028$$

so $n_0 = 4$. Check the boundary in both directions:

$$f(3) = 5 \\cdot 9 + 3 \\cdot 3 + 1 = 55 \\;>\\; 54 = 6 \\cdot 9$$

$$f(4) = 5 \\cdot 16 + 3 \\cdot 4 + 1 = 93 \\;\\le\\; 96 = 6 \\cdot 16$$

Lower: $5n^2 + 3n + 1 \\ge 5n^2$ for all $n \\ge 1$, so $c_1 = 5$.

**Answer**: $c_1 = 5$, $c_2 = 6$, $n_0 = 4$.

**Trap**: quoting $n_0 = 3$ from the root 3.3028 by rounding down. The
inequality fails at n = 3, where 55 exceeds 54, so the threshold must be the
next integer **up**.

**A3.** Here $a = 4$, $b = 2$, $f(n) = n^2$.

$$\\log _2 4 = 2, \\qquad n^{\\log _b a} = n^2 = f(n) \\;\\Rightarrow\\; \\text{case 2}$$

$$T(n) \\in \\Theta(n^2 \\log n)$$

**Trap**: reading $a = 4$ as "four levels" and answering $\\Theta(n^2)$. The
critical exponent ties with f, so the depth multiplies in and the logarithm
survives.

**A4.** Here $a = 3$, $b = 2$, $f(n) = n$.

$$\\log _2 3 = 1.585 \\;>\\; 1 \\;\\Rightarrow\\; \\text{case 1} \\;\\Rightarrow\\; T(n) \\in \\Theta(n^{1.585})$$

**Trap**: answering $\\Theta(n\\log n)$ by pattern-matching merge sort. Merge
sort has $a = 2$; the third recursive call pushes the critical exponent above
1 and the answer is a genuine fractional power.

**A5.** The inner loop runs $n - i + 1$ times, so

$$\\sum_{i=1}^{n}(n - i + 1) = \\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}$$

At n = 10 that is 55 executions, confirmed by running the nest and counting;
at n = 100 it is 5,050 and at n = 1000 it is 500,500. The complexity is
$\\Theta(n^2)$, since

$$\\lim_{n \\to \\infty}\\frac{n(n+1)/2}{n^2} = \\frac{1}{2}$$

**Answer**: exactly $n(n+1)/2$ executions, complexity $\\Theta(n^2)$.

**Trap**: answering $n^2$ for the **count**. The count is half that plus a
linear term — 5,050 rather than 10,000 at n = 100 — and questions that ask
"how many times" want the exact figure, not the class.

**A6.** $O(2^n)$ is a correct upper bound, because $C(n) \\le 2\\,C(n-1) + 1$.
It is **not** tight. Counting the calls exactly gives

$$C(n) = 2F(n+1) - 1 \\in \\Theta(\\varphi^{n}), \\qquad \\varphi = 1.618$$

**Answer**: correct but slack; the tight class is $\\Theta(\\varphi^n)$.

**Trap**: treating $O(2^n)$ as the answer to "what is the complexity". At
n = 50 the counted call total is 40,730,022,147 while $2^{50}$ exceeds
$1.12 \\times 10^{15}$ — the bound overstates the work by a factor of 27,643.

## Problem Set B — Sorting, Searching, Graphs, Greedy

**B1.** Show the array {4, 0, 3, 1, 7} after two complete passes of bubble
sort.

**B2.** Trace insertion sort on {10, 15, 5, 13}, giving the array after each
insertion and the total comparisons.

**B3.** Apply one Lomuto partition to {3, 9, 8, 10, 2, 11, 4} using the last
element as pivot. Give the array afterwards and the pivot's final index.

**B4.** How many iterations does binary search need to find 105 in
{5, 10, 15, 25, 105}?

**B5.** For the graph of section 9.4, state the BFS order from A and the
number of hops from A to G.

**B6.** A cashier has coins {1, 7, 10} and must make 15. Compare the greedy
answer with the optimum.

### Worked Answers, Set B

**B1.** Pass 1 compares adjacent pairs across the whole array; pass 2 stops one
short because the largest element has already reached the end.

| Pass | Comparisons made | Array after the pass |
|---|---|---|
| 1 | 4 | 0, 3, 1, 4, 7 |
| 2 | 3 | **0, 1, 3, 4, 7** |

**Answer**: {0, 1, 3, 4, 7}, which happens to be fully sorted after two
passes.

**Trap**: choosing {0, 3, 1, 4, 7}, the state after **one** pass. Bubble sort
questions almost always offer the off-by-one-pass distractor, and it is the
most attractive wrong answer on the list.

**B2.** Comparisons are counted as key comparisons in the inner loop.

| Insert | Comparisons | Array after |
|---|---|---|
| 15 | 1 | 10, 15, 5, 13 |
| 5 | 2 | 5, 10, 15, 13 |
| 13 | 2 | **5, 10, 13, 15** |

**Answer**: the intermediate states are 10,15,5,13 then 5,10,15,13 then
5,10,13,15, with **5** comparisons in total.

**Trap**: writing 5,13,10,15 as the middle state, which mixes the two later
insertions into one step. Insertion sort moves exactly one element per outer
iteration and never reorders the rest.

**B3.** With pivot 4, the index i marks the boundary of the "at most 4"
region. Scanning j from the left: 3 is at most 4, so it swaps with itself and
i becomes 1; 9, 8 and 10 are larger and are skipped; 2 is at most 4, so it
swaps with the element at index 1 (which is 9) and i becomes 2; 11 is skipped.
Finally the pivot swaps into index 2.

$$\\{3, 9, 8, 10, 2, 11, 4\\} \\;\\rightarrow\\; \\{3, 2, 4, 10, 9, 11, 8\\}$$

**Answer**: {3, 2, 4, 10, 9, 11, 8}, pivot at index 2, with 2 elements to its
left and 4 to its right. The partition cost is $7 - 1 = 6$ comparisons.

**Trap**: assuming the two partitions come out sorted, or equal in size.
Partitioning only guarantees that everything left of the pivot is no greater
and everything right is greater; {10, 9, 11, 8} is neither sorted nor
balanced against the left side.

**B4.** With $lo = 0$, $hi = 4$ and the overflow-safe midpoint
$mid = lo + \\lfloor (hi - lo)/2 \\rfloor$:

$$mid = 0 + \\lfloor 4/2 \\rfloor = 2 \\;\\Rightarrow\\; a[2] = 15 < 105 \\;\\Rightarrow\\; lo = 3$$

$$mid = 3 + \\lfloor 1/2 \\rfloor = 3 \\;\\Rightarrow\\; a[3] = 25 < 105 \\;\\Rightarrow\\; lo = 4$$

$$mid = 4 + \\lfloor 0/2 \\rfloor = 4 \\;\\Rightarrow\\; a[4] = 105 \\;\\Rightarrow\\; \\text{found}$$

**Answer**: **3** iterations, consistent with the worst-case bound
$\\lfloor \\log _2 5 \\rfloor + 1 = 3$, and confirmed by running the loop.

**Trap**: answering 2 by counting only the iterations that *narrow* the range
and not the one that finds the key. The comparison that returns the answer is
still a comparison.

**B5.** Dequeueing A first enqueues B, C and D in list order; each of those
then contributes its unseen neighbours.

$$\\text{BFS: } A, B, C, D, E, F, G$$

G is reached from E or F, both at distance 2, so it sits at **3 hops**.

**Trap**: reading the DFS order A, B, E, C, F, D, G as the BFS answer. They
share the same first two vertices, which is enough to make the wrong option
look right if only the head of the list is checked.

**B6.** Greedy takes 10 first, leaving 5 to be made from 1s:

$$15 - 10 = 5 \\;\\Rightarrow\\; 5 \\ \\text{coins of } 1 \\;\\Rightarrow\\; 1 + 5 = 6 \\ \\text{coins}$$

Dynamic programming over every amount up to 15 finds

$$7 + 7 + 1 = 15 \\;\\Rightarrow\\; 3 \\ \\text{coins}$$

**Answer**: greedy uses 6 coins, the optimum is 3 — twice as many. Scanning
every target from 1 to 59 shows the first disagreement at 14, not at 15.

**Trap**: assuming greedy is safe because it is safe with real currency.
Greedy coin change is optimal only for **canonical** coin systems; {1, 7, 10}
is not one, and neither is {1, 3, 4}.`,
      examTip: 'On a "which array is this after k passes" question, count the passes twice. Bubble sort after one pass and after two passes are both offered, and the after-one-pass option is the most commonly chosen wrong answer in this whole topic.',
      importantNote: 'Two thresholds worth memorising because they are the answers to whole families of questions: the smallest n0 in a Theta proof is the first integer at which the inequality holds, never the rounded-down root; and binary search on n keys takes floor(log2 n) + 1 iterations in the worst case, counting the iteration that finds the key.',
    },
  ],
  keyTakeaways: [
    'Big-O: asymptotic upper bound; drop constants, keep dominant term.',
    'O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n).',
    'Merge: O(n log n) guaranteed. Quick: O(n log n) avg, O(n^2) worst.',
    'Binary search: O(log n), requires sorted data.',
    'DP = recursion + memoization; exponential -> polynomial.',
    'Greedy: fast but not always optimal.',
  ],
},

fee_data_structures: { topicId: 'fee_data_structures', title: 'Data Structures', domainWeight: 'Software Development · 3–5%',
  overview: 'Data structures organize data for efficient access. Arrays, linked lists, stacks, queues, trees, and hash tables each optimize for different patterns. Knowing time complexity and when to use each is essential for the FE exam.',
  sections: [
    { id: 'ds-linear', title: '1. Arrays, Lists, Stacks, Queues',
      content: `## 1.1 Arrays

O(1) access by index. O(n) insert/delete (shift elements). Cache-friendly.

## 1.2 Linked Lists

O(1) insert/delete at known position. O(n) search. Singly, doubly, circular variants.

## 1.3 Stack (LIFO)

push/pop/peek: all O(1). Uses: function calls, expression eval, DFS, undo.

## 1.4 Queue (FIFO)

enqueue/dequeue: O(1). Uses: scheduling, BFS, print queues.

**Priority queue**: dequeue by priority (implemented with heap).

## 1.5 Summary

| Op | Array | List | Stack | Queue |
|---|---|---|---|---|
| Access | **O(1)** | O(n) | N/A | N/A |
| Search | O(n) | O(n) | N/A | N/A |
| Insert | O(n) | **O(1)*** | **O(1)** | **O(1)** |
| Delete | O(n) | **O(1)*** | **O(1)** | **O(1)** |

*at known position`,
      examTip: 'Arrays: O(1) access, O(n) insert. Lists: O(1) insert, O(n) search. Stack=LIFO, Queue=FIFO. Know WHICH structure for which application.',
    },
    { id: 'ds-tree-hash', title: '2. Trees and Hash Tables',
      content: `## 2.1 BST

BST property: left < node < right.

| Op | Balanced | Unbalanced |
|---|---|---|
| Search/Insert/Delete | **O(log n)** | O(n) |

Self-balancing: **AVL** (strict), **Red-Black** (relaxed).

## 2.2 Heap

Complete binary tree. Max-heap: parent >= children.

| Op | Complexity |
|---|---|
| Find min/max | **O(1)** |
| Insert/Extract | O(log n) |
| Build | O(n) |

## 2.3 Hash Table

**index = hash(key) % size**. O(1) average lookup.

Collision resolution: **chaining** (lists) or **open addressing** (probing).

**Load factor** = entries/size. Rehash when > ~0.7.

- Average: O(1)
- Worst: O(n) (all keys collide)`,
      examTip: 'Fastest average lookup: hash table O(1). Maintains sorted order: BST. BST degenerates to O(n) if unbalanced -- use AVL/Red-Black.',
      importantNote: 'BST degenerates to linked list O(n) if inserted in sorted order. Self-balancing trees (AVL, Red-Black) guarantee O(log n).',
    },
    { id: 'ds-exam', title: '3. Data Structure Operation Problems',
      content: `## 3.1 BST Insertion Sequence and Resulting Tree

**Insert sequence**: 50, 30, 70, 20, 40, 60, 80

**Step-by-step**:
1. 50 -> root
2. 30 < 50 -> left child of 50
3. 70 > 50 -> right child of 50
4. 20 < 50, < 30 -> left child of 30
5. 40 < 50, > 30 -> right child of 30
6. 60 > 50, < 70 -> left child of 70
7. 80 > 50, > 70 -> right child of 70

**Resulting balanced BST** (height = 2):
- Root: 50 (L:30, R:70)
- Level 1: 30 (L:20, R:40), 70 (L:60, R:80)

**Same data, sorted insert** (20,30,40,50,60,70,80) -> degenerates to linked list (height = 6, all right children). This is why self-balancing matters.

## 3.2 Heap Extract-Min Step-by-Step

**Min-heap**: [10, 20, 15, 30, 40, 25, 18]

**Extract-min (remove 10)**:

| Step | Action | Heap State |
|---|---|---|
| 1 | Remove root (10) | [_, 20, 15, 30, 40, 25, 18] |
| 2 | Move last element (18) to root | [18, 20, 15, 30, 40, 25] |
| 3 | Sift down: 18 vs children (20, 15) | 15 < 18, swap |
| 4 | [15, 20, 18, 30, 40, 25] | 18 vs children (25): 18 < 25, stop |
| **Result** | | **[15, 20, 18, 30, 40, 25]** |

**Complexity**: O(log n) for sift-down. The heap property is restored by swapping with the smaller child at each level.

## 3.3 Hash Table with Chaining — Lookup Steps

**Given**: Table size = 7, hash(key) = key mod 7. Keys inserted: 14, 21, 7, 28, 35, 42.

All keys hash to **index 0** (all multiples of 7):
- Slot 0: 14 -> 21 -> 7 -> 28 -> 35 -> 42 (chain of 6)

**Lookup for key 35**:
1. hash(35) = 35 mod 7 = 0 -> go to slot 0
2. Compare: 14 (no), 21 (no), 7 (no), 28 (no), **35 (yes!)**
3. **5 comparisons** needed

With a **well-behaved** hash, the average successful search with chaining is
1 + α/2 where α is the load factor:

| Load factor α | Avg lookup (chaining, uniform hash) | Performance |
|---|---|---|
| 0.5 | 1.25 | Excellent |
| 1.0 | 1.5 | Good |
| 2.0 | 2.0 | Acceptable |

Our example does **not** obey that formula. Its load factor is only
α = 6/7 = 0.86, which would predict 1.43 comparisons, yet the measured average
is (1+2+3+4+5+6)/6 = **3.5** because all six keys landed in one chain. Load
factor predicts performance only when the hash spreads keys evenly; here the
hash function, not the load factor, is the problem.

**Exam strategy**: For BST, trace the insertion path (left if smaller, right if larger). For heaps, extract = remove root, move last to root, sift down. For hash tables, compute hash, then walk the chain. Load factor > 0.7 signals time to rehash.`,
      examTip: 'BST insertion: compare with each node, go left (smaller) or right (larger). Heap extract: always O(log n). Hash lookup: O(1) average, but O(n) worst case if all keys collide.',
      importantNote: 'A bad hash function that maps many keys to the same bucket destroys hash table performance. The example above (all mod 7 = 0) shows worst-case O(n) behavior. Good hash functions distribute keys uniformly.',
    },
    { id: 'ds-traversal-graph', title: '4. Tree Traversals and Graph Search',
      content: `## 4.1 The Three Depth-First Traversals

A traversal is a rule for visiting every node exactly once. The three
depth-first orders differ only in **when the node itself is visited relative
to its subtrees**:

| Traversal | Rule | Visit order |
|---|---|---|
| **Pre-order** | node, left, right | Root first |
| **In-order** | left, node, right | Root in the middle |
| **Post-order** | left, right, node | Root last |

Apply all three to the BST from section 3.1, built from 50, 30, 70, 20, 40,
60, 80:

| Traversal | Output |
|---|---|
| Pre-order | 50, 30, 20, 40, 70, 60, 80 |
| In-order | **20, 30, 40, 50, 60, 70, 80** |
| Post-order | 20, 40, 30, 60, 80, 70, 50 |
| Level-order (breadth-first) | 50, 30, 70, 20, 40, 60, 80 |

The in-order row is the one to remember: **in-order traversal of a BST emits
the keys in sorted order**, which is the property that makes a BST worth
building instead of a hash table. It is also the fastest way to check a
proposed traversal in a multiple-choice question — if the in-order output is
not ascending, the tree is not a valid BST.

Each order has a characteristic use:

| Traversal | Used for |
|---|---|
| Pre-order | Copying or serialising a tree; the root arrives before its children need it |
| In-order | Sorted output, range queries |
| Post-order | Freeing memory, evaluating an expression tree, computing subtree sizes |

Post-order deserves the expression-tree example. The tree for (3 + 4) × 5
gives post-order 3, 4, +, 5, × — which is reverse Polish notation, evaluable
with a single stack. Every operand is pushed and every operator pops its
arguments, which are guaranteed to be present because post-order visits both
children first.

## 4.2 Breadth-First and Depth-First Search

On a general graph the same two shapes become the two fundamental search
algorithms, and the **only structural difference is the container**:

| | BFS | DFS |
|---|---|---|
| Container | **Queue** (FIFO) | **Stack** (LIFO), or the call stack via recursion |
| Explores | All neighbours, then their neighbours | One path as deep as possible, then backtracks |
| Finds | Shortest path in **hop count** | Any path; a spanning tree |
| Memory | O(width of the graph) | O(depth of the graph) |
| Time | O(V + E) | O(V + E) |

Work both on this graph:

| Vertex | Neighbours |
|---|---|
| A | B, C |
| B | A, D, E |
| C | A, F |
| D | B |
| E | B, F |
| F | C, E |

Here |V| = 6 and |E| = 6, so an adjacency-list traversal costs
O(V + E) = 12 steps.

| Algorithm | Order visited from A |
|---|---|
| BFS (queue) | A, B, C, D, E, F |
| DFS (stack) | A, B, D, E, F, C |

BFS also produces the hop distance from the source as a by-product, because it
finishes every vertex at distance k before it starts any at distance k + 1:

| Vertex | A | B | C | D | E | F |
|---|---|---|---|---|---|---|
| Hops from A | 0 | 1 | 1 | 2 | 2 | 2 |

That is the property to quote when a question asks for the **fewest links** or
**fewest intermediate nodes** — BFS answers it, DFS does not. If the edges
carry unequal weights, neither works and Dijkstra's algorithm is required;
BFS is exactly Dijkstra with all weights equal to 1.

## 4.3 The Visited Set Is Not Optional

Both searches need a record of which vertices have been reached. Without it, a
graph containing any cycle sends the search round forever — the graph above
has the cycle A–B–E–F–C–A, so an unguarded DFS from A never terminates. This
distinguishes graph search from tree traversal: a tree has no cycles, so tree
traversals need no visited set, and that is why the tree code looks simpler
than it should.

The cost of the visited set is O(V) space, which is already implied by the
O(V + E) time bound.

## 4.4 Why an Arrival Order Decides Everything

Section 3.1 noted that sorted insertion degenerates a BST into a linked list.
Measuring the mean comparisons to find a key, over every key present, makes
the size of the penalty concrete:

![Mean comparisons to find a key in a binary search tree, plotted against the number of keys on logarithmic axes, for trees built by sorted insertion and by shuffled insertion, with the perfectly balanced log base two of n plus one drawn for reference. The sorted-insertion series lands exactly on n plus one over two.](/courses/fe-ee/figures/swe-bst-degenerate.svg)

| Keys n | Sorted insertion (mean) | Shuffled insertion (mean) | Perfect tree, deepest key | Perfect tree, mean |
|---|---|---|---|---|
| 15 | 8.0 | 3.8 | 4.0 | 3.27 |
| 63 | 32.0 | 6.1 | 6.0 | 5.10 |
| 255 | 128.0 | 9.2 | 8.0 | 7.03 |
| 1,023 | **512.0** | **12.4** | 10.0 | **9.01** |

Read the last two columns carefully, because they answer different questions
and the difference is easy to lose. The dashed reference line on the figure is
$\\log _2(n+1)$, which for a perfect tree is the cost of reaching its
**deepest** key — 10 comparisons at n = 1023. The **mean** over every key in
that same perfect tree is smaller, because half the keys sit in the bottom
level and the rest are cheaper to reach; summing $i \\cdot 2^{i-1}$ over the
levels gives a mean of $((k-1)2^k + 1)/n$, which is 9.01 comparisons at
n = 1023. So the honest comparison for the shuffled column is 12.4 against
9.01: random arrival order costs **38 % more** than perfect balance, not 24 %.

The sorted-insertion series is exactly **(n+1)/2** at every size, which is the
signature of a linked list: to reach the key at depth k costs k comparisons,
and averaging 1 through n gives (n+1)/2. At n = 1023 the same keys cost 512
comparisons in one arrival order and 12.4 in another — a factor of **41**.

This is precisely why AVL and red–black trees exist. They pay a rotation on
insertion to guarantee O(log n) regardless of arrival order, and the guarantee
matters most in the case that occurs most often in practice: data arriving
already sorted, from a file, a database export, or a timestamp column.`,
      examTip: 'In-order traversal of a BST outputs the keys in ascending order — use it to check whether a drawn tree really is a BST. BFS uses a queue and finds shortest paths in hops; DFS uses a stack and does not.',
      importantNote: 'Both BFS and DFS cost O(V + E) on an adjacency list, and both require a visited set on a graph. A tree traversal needs no visited set only because a tree has no cycles.',
    },
    { id: 'ds-hashing-choice', title: '5. Hashing in Depth and Choosing a Structure',
      content: `## 5.1 Two Ways to Resolve a Collision

| Scheme | Where the colliding key goes | Load factor limit |
|---|---|---|
| **Separate chaining** | A linked list hanging off the slot | May exceed 1 |
| **Open addressing** | Another slot in the same table, found by probing | Must stay below 1 |

Open addressing needs a probe sequence. Linear probing tries slot + 1,
slot + 2 and so on; quadratic probing tries slot + 1², slot + 2²; double
hashing uses a second hash to set the step. All three keep every entry inside
the array — better cache behaviour, no pointer overhead — at the cost of
**clustering**, where a run of occupied slots grows and makes further
collisions more likely.

The expected number of probes per lookup, under uniform hashing, is where the
schemes separate:

| Scheme and search | Expected probes |
|---|---|
| Chaining, successful | 1 + α/2 |
| Chaining, unsuccessful | 1 + α |
| Linear probing, successful | (1 + 1/(1 − α))/2 |
| Linear probing, unsuccessful | (1 + 1/(1 − α)²)/2 |

![Expected probes per lookup against load factor for separate chaining and for linear probing, with simulated measurements from a 4001-slot table marked as points. Chaining rises linearly to 1.5 probes at full load; linear probing rises hyperbolically, reaching 5.5 probes for a successful search and 50.5 for an unsuccessful one at load factor 0.9.](/courses/fe-ee/figures/swe-hash-load-factor.svg)

| Load factor α | Chaining, successful | Linear probing, successful | Linear probing, unsuccessful |
|---|---|---|---|
| 0.25 | 1.125 | 1.17 | 1.39 |
| 0.50 | 1.250 | 1.50 | 2.50 |
| 0.75 | 1.375 | 2.50 | 8.50 |
| 0.90 | 1.450 | **5.50** | **50.50** |

The two shapes are the lesson. Chaining is **linear** in α, so a table at 90 %
capacity costs 1.45 probes — barely worse than an empty one. Linear probing is
hyperbolic in 1/(1 − α), so the same 90 % costs 5.5 probes to find a key and
**50.5** to establish that a key is absent. The unsuccessful case is the one
that hurts, because it is what every insertion performs first.

That asymmetry is the whole justification for the **α = 0.7 rehash
threshold**. It is not a magic number: it is the point below which
1/(1 − α)² stays under about 11, and past which it climbs without limit.
Rehashing doubles the table and re-inserts everything at O(n), but because the
table doubles, the cost amortises to **O(1) per insertion** over the life of
the structure.

## 5.2 What Makes a Hash Function Good

| Property | Why | Failure mode |
|---|---|---|
| Uniform | Every slot equally likely | Section 3.3's example — every key to slot 0 |
| Deterministic | Same key, same slot, always | Lookups miss entries that are present |
| Fast | Computed on every operation | The hash costs more than the search it saves |
| Uses the whole key | Otherwise distinct keys collide | Hashing only the first character of a name |

The classic table-size rule follows from the first property: when the hash is
**key mod m**, choose **m prime** and not a power of two. With m = 2^k the
modulo keeps only the low k bits, so any structure in the high bits of the key
is discarded — and keys in real data usually do have structure. A prime
modulus mixes all the bits into the result.

## 5.3 Selecting a Structure from the Requirement

| Requirement | Structure | Because |
|---|---|---|
| Fastest average lookup by exact key | **Hash table** | O(1) average |
| Keys must stay in sorted order | **Balanced BST** | In-order traversal is sorted |
| Range query: all keys between x and y | **Balanced BST** | Hash tables have no order at all |
| Always retrieve the smallest or largest | **Heap** | O(1) find-min, O(log n) extract |
| Access by position, tight memory, cache friendly | **Array** | O(1) index, no pointer overhead |
| Frequent insert and delete at a known position | **Linked list** | O(1) splice, no shifting |
| Undo, expression evaluation, backtracking | **Stack** | Last-in, first-out matches the nesting |
| Fair scheduling, level-order traversal | **Queue** | First-in, first-out matches arrival order |

The row that carries the most exam weight is the third. A hash table cannot
answer "which keys are between 100 and 200" in anything better than O(n),
because hashing deliberately destroys the relationship between key value and
storage location. If a question mentions ranges, ordering, successor, or "next
largest", the answer is a tree — no matter how much faster the hash table's
single-key lookup is.

## 5.4 The Two Amortised Results Worth Knowing

Both come from the same doubling argument and both appear as "what is the
complexity of appending to a dynamic array":

| Operation | Worst case, single operation | Amortised over n operations |
|---|---|---|
| Append to a dynamic array | O(n), when it must resize and copy | **O(1)** |
| Insert into a hash table | O(n), when it must rehash | **O(1)** |

The reasoning: doubling from size n costs n copies, but it buys n free
insertions before the next doubling. Summing the copies across all doublings
gives n + n/2 + n/4 + ⋯ < 2n total copies for n insertions, so the average is
under 2 — a constant. **Amortised O(1) is not the same as worst-case O(1)**,
which matters for real-time systems where one 100 ms resize is unacceptable
even if the average is a microsecond.`,
      examTip: 'Chaining costs 1 + alpha/2 probes and degrades linearly; linear probing costs (1 + 1/(1-alpha)^2)/2 on an unsuccessful search and blows up near alpha = 1. That is why open addressing must rehash around 0.7 and chaining need not.',
      importantNote: 'If a question mentions range queries, sorted output, or "next largest key", the answer is a balanced tree even though a hash table has faster single-key lookup. Hashing destroys ordering by design.',
    },
    { id: 'ds-arrays-amortised', title: '6. Arrays, Address Arithmetic, and Amortised Growth',
      content: `## 6.1 Why Indexing Is O(1)

An array is a contiguous block, so the address of any element is arithmetic
rather than search. For a one-dimensional array of elements of size s bytes
starting at address B:

$$\\text{addr}(A[i]) = B + i \\cdot s$$

A two-dimensional array stored in **row-major** order — C, C++, Python, Java —
lays row 0 down first, then row 1, so with C columns:

$$\\text{addr}(A[i][j]) = B + (i \\cdot C + j)\\cdot s$$

**Column-major** order — Fortran, MATLAB, Julia — transposes the roles, with R
rows:

$$\\text{addr}(A[i][j]) = B + (j \\cdot R + i)\\cdot s$$

Both are three arithmetic operations regardless of the indices, which is the
entire content of "O(1) random access". For a 6-column array of 4-byte
integers based at 2000:

$$\\text{addr}(A[2][3]) = 2000 + 12 \\cdot 4 + 3 \\cdot 4 = 2060$$

The same arithmetic explains why iterating a matrix along rows is faster than
along columns in a row-major language: consecutive row elements share a cache
line and consecutive column elements are $C \\cdot s$ bytes apart.

## 6.2 The Cost of Insertion and Deletion

Contiguity is also what makes the middle expensive. Inserting at index i in an
array holding n elements requires shifting the tail right:

$$\\text{shifts on insert at } i = n - i, \\qquad \\text{shifts on delete at } i = n - i - 1$$

Averaged over a uniformly chosen position:

$$E[\\text{shifts}] = \\frac{1}{n+1}\\sum_{i=0}^{n} (n - i) = \\frac{n}{2}$$

so insertion and deletion are $\\Theta(n)$ on average and in the worst case, and
$\\Theta(1)$ only at the very end.

| Operation | Array | Reason |
|---|---|---|
| Read or write $A[i]$ | $\\Theta(1)$ | one address computation |
| Search, unsorted | $\\Theta(n)$ | linear scan |
| Search, sorted | $\\Theta(\\log n)$ | binary search |
| Insert or delete at the end | $\\Theta(1)$ amortised | see 6.3 |
| Insert or delete elsewhere | $\\Theta(n)$ | shift the tail |

## 6.3 Worked Example: The Doubling Array, by the Accounting Method

**Given**: a dynamic array that starts with capacity 1 and doubles whenever it
is full, copying every element into the new block. **Find**: the amortised
cost of one append.

A single append costs 1 write when there is room and $n + 1$ writes when it
triggers a copy, so the **worst case** for one operation is $\\Theta(n)$. The
accounting method charges each append a flat 3 tokens and shows the bank never
goes negative:

$$\\text{charge } 3 \\text{ per append} = \\underbrace{1}_{\\text{write this element}} + \\underbrace{1}_{\\text{save to copy this element later}} + \\underbrace{1}_{\\text{save to copy one older element}}$$

Immediately after a doubling from capacity m to 2m, the array holds m elements
and m of them carry no saved token — but the next m appends each contribute
one spare token for an old element and one for themselves, which is exactly
the 2m copies the next resize will perform. The invariant holds, so 3 tokens
per append cover everything.

$$\\text{amortised cost} \\le 3 = \\Theta(1)$$

**Independent check by aggregate counting.** Rather than trusting the argument,
append one element at a time and tally every copy. Resizes occur at sizes
$1, 2, 4, \\ldots$, so the total copies performed by n appends are

$$\\text{copies}(n) = \\sum_{i=0}^{\\lceil \\log _2 n \\rceil - 1} 2^{i} = 2^{\\lceil \\log _2 n \\rceil} - 1 \\;<\\; 2n$$

Counted in code, the two agree exactly at every size tested:

| Appends n | Copies, counted | $2^{\\lceil \\log _2 n \\rceil} - 1$ | Copies per append |
|---|---|---|---|
| 10 | 15 | 15 | 1.500 |
| 100 | 127 | 127 | 1.270 |
| 1,000 | 1,023 | 1,023 | 1.023 |
| 10,000 | 16,383 | 16,383 | 1.638 |
| 1,000,000 | 1,048,575 | 1,048,575 | 1.049 |

**Answer**: fewer than 2 copies per append at every n, so appending is
amortised $\\Theta(1)$ even though one append in the sequence costs
$\\Theta(n)$.

![The running average of element copies per append, measured append by append up to four thousand appends, on a logarithmic horizontal axis. The curve is a sawtooth that jumps to 2.0 the instant each resize lands and decays back toward 1.0 as later appends dilute it, never crossing the dashed ceiling at 2.](/courses/fe-ee/figures/sw2-array-amortised.svg)

The per-append column does not decrease monotonically, and the sawtooth in the
figure is why: it touches 2 the instant a resize lands and falls back toward 1
as the following appends dilute it. **Amortised $\\Theta(1)$ is a statement
about the sum, not about any single operation**, and that distinction is what
rules the structure out of a hard real-time path where one 100 ms copy is
unacceptable even though the average is a microsecond.

## 6.4 Worked Example: Why the Growth Factor Is 2 and Not 1.1

**Given**: growth by a constant **increment** k against growth by a constant
**factor** g. **Find**: the total copying in each case.

Increment: resizes happen at sizes $k, 2k, 3k, \\ldots$, so

$$\\text{copies}(n) = \\sum_{j=1}^{n/k} jk \\approx \\frac{n^2}{2k} \\in \\Theta(n^2)$$

Measured at n = 10,000 with k = 10 the count is 4,995,000 against the
prediction $10000^2/20 = 5000000$ — 0.1 % apart, and unmistakably quadratic.
Factor: resizes happen at $1, g, g^2, \\ldots$, and the geometric sum gives

$$\\text{copies}(n) \\approx \\frac{n}{g - 1} \\in \\Theta(n)$$

so **any** factor above 1 gives amortised constant time; the choice of factor
trades copying against wasted memory. Both halves of that trade, measured over
one million appends:

| Growth factor g | Copies per append, counted | Worst capacity per element held |
|---|---|---|
| 1.25 | 4.49 | 1.25 |
| 1.5 | 2.10 | 1.50 |
| 2 | 1.05 | 2.00 |
| 3 | 0.80 | 3.00 |

**Answer**: increments are quadratic and unusable; factors are linear, with
g = 2 sitting where copying has already dropped near 1 per append and the
slack has not yet reached 3x.

![Two bar panels over the growth factors 1.25, 1.5, 2 and 3, both measured on the same one-million-append runs. The left panel shows copies per append falling from 4.49 to 0.80 as the factor rises; the right panel shows the worst ratio of allocated capacity to elements actually held rising from 1.25 to 3.00 over the same factors.](/courses/fe-ee/figures/sw2-growth-factor.svg)

## 6.5 The Same Argument Governs the Hash Table

Rehashing a hash table is the identical accounting problem with a different
trigger. Section 5.1 set the resize threshold at a load factor near 0.7; when
it is crossed the table doubles and every entry is re-inserted at
$\\Theta(n)$ cost, but the doubling buys $\\Theta(n)$ further insertions before
the next one:

$$\\text{amortised insert} = \\frac{\\Theta(n) \\text{ rehash} + n \\cdot \\Theta(1)}{n} = \\Theta(1)$$

What differs is **when** the trigger fires, and that depends on the collision
scheme rather than on the accounting. Open addressing must resize before the
table fills, because the probe cost blows up as $\\alpha$ approaches 1.
Chaining has no such wall: a chained table at $\\alpha = 1$ holds one key per
bucket **on average**, and under a uniform hash the bucket occupancies follow
a Poisson distribution with mean 1:

$$\\Pr[\\text{a bucket holds } j \\text{ keys}] \\to \\frac{e^{-1}}{j!} \\qquad \\text{as } m \\to \\infty \\text{ with } n = m$$

$$\\Pr[\\text{empty}] = e^{-1} = 0.3679$$

Placing 100,000 keys into 100,000 buckets and counting confirms it: 36.7 % of
buckets end up empty, against the predicted 36.8 %, and the longest chain
anywhere in the table is **8**.

![Two sets of bars over bucket occupancies zero to six: the measured fraction of buckets holding that many keys after 100,000 keys are placed into 100,000 buckets, beside the Poisson distribution with mean one. The two agree closely, with about 37 percent of buckets empty and 37 percent holding exactly one key.](/courses/fe-ee/figures/sw2-chain-distribution.svg)

So "load factor 1" describes a chained table that is working normally, not one
that is full — the mean successful search there still costs about 1.5 probes.
The 0.7 threshold of section 5.1 is an **open addressing** rule that gets
applied to chaining out of habit.

| Structure | One operation, worst case | Amortised over n operations |
|---|---|---|
| Dynamic array append | $\\Theta(n)$ copy on resize | $\\Theta(1)$ |
| Hash table insert | $\\Theta(n)$ rehash | $\\Theta(1)$ |
| Balanced tree insert | $\\Theta(\\log n)$ | $\\Theta(\\log n)$ |

The third row is there for contrast: a balanced tree has no cheap-then-
expensive rhythm to amortise, so its worst case and its average are the same
class. That predictability is the reason real-time systems reach for trees
where throughput-oriented systems reach for hash tables.`,
      examTip: 'Row-major address: base + (i * columns + j) * element_size. Amortised O(1) append means the SUM over n appends is O(n); a single append still costs O(n) when it resizes. Questions that ask for "the worst case of a single append" want O(n), and questions that ask for "the cost of n appends" want O(n) total.',
      importantNote: 'Growing an array by a fixed INCREMENT is Theta(n^2) total copying - 4,995,000 copies for 10,000 appends at k = 10, measured. Growing by any constant FACTOR above 1 is Theta(n). This is the difference between a usable dynamic array and an unusable one, and it is not a constant-factor difference.',
    },
    { id: 'ds-linked-lists', title: '7. Linked Lists: Pointer Costs and Memory Costs',
      content: `## 7.1 What a Node Costs

A singly linked node stores a payload and one reference; a doubly linked node
stores two. On a 64-bit machine with 8-byte references and a 4-byte integer
payload, alignment padding rounds the payload slot up to 8:

$$\\text{node}_{\\text{singly}} = 4 + 4_{\\text{pad}} + 8 = 16 \\ \\text{bytes}$$

$$\\text{node}_{\\text{doubly}} = 4 + 4_{\\text{pad}} + 8 + 8 = 24 \\ \\text{bytes}$$

against 4 bytes per element in an array of the same integers. The overhead
ratios are therefore

$$\\frac{16}{4} = 4, \\qquad \\frac{24}{4} = 6$$

so a linked list of small values costs four to six times the memory of the
array holding the same data, before counting allocator bookkeeping. It also
costs locality: array elements are adjacent and arrive in the same cache line,
while nodes can be anywhere.

| Property | Array | Singly linked | Doubly linked |
|---|---|---|---|
| Bytes per 4-byte element | 4 | 16 | 24 |
| Access $A[i]$ | $\\Theta(1)$ | $\\Theta(n)$ | $\\Theta(n)$ |
| Insert at head | $\\Theta(n)$ | $\\Theta(1)$ | $\\Theta(1)$ |
| Insert after a known node | $\\Theta(n)$ | $\\Theta(1)$ | $\\Theta(1)$ |
| Delete a node given only a pointer to it | $\\Theta(n)$ | $\\Theta(n)$ | $\\Theta(1)$ |
| Count the elements | $\\Theta(1)$ if stored | $\\Theta(n)$ | $\\Theta(n)$ |
| Traverse backwards | $\\Theta(n)$ | impossible without reversal | $\\Theta(n)$ |

## 7.2 Justifying the Pointer Costs, Write by Write

The complexity column above is not an estimate; each entry is a fixed number
of reference assignments. Inserting a new node t at the head:

$$t.\\text{next} \\leftarrow \\text{head}, \\qquad \\text{head} \\leftarrow t$$

Two writes, independent of n, hence $\\Theta(1)$. Inserting t after a known
node p:

$$t.\\text{next} \\leftarrow p.\\text{next}, \\qquad p.\\text{next} \\leftarrow t$$

Two writes again. Deleting the node **after** p:

$$p.\\text{next} \\leftarrow p.\\text{next}.\\text{next}$$

One write. But deleting a node when you hold a pointer to **that node** and
the list is singly linked needs its predecessor, and finding the predecessor
means walking from the head:

$$\\text{predecessor search} = \\Theta(n)$$

which is the single most-tested asymmetry in this topic. In a doubly linked
list the predecessor is already in hand, so the same deletion is two writes:

$$q.\\text{prev}.\\text{next} \\leftarrow q.\\text{next}, \\qquad q.\\text{next}.\\text{prev} \\leftarrow q.\\text{prev}$$

**Counting the elements is $\\Theta(n)$** unless a running count is maintained,
because nothing in the structure records the length. That is the answer to
"what is the time complexity of counting the items in a linked list", and the
tempting wrong answer, $\\Theta(1)$, is only right for an array or for a list
that carries a size field.

## 7.3 Worked Example: Reversing a Singly Linked List

**Given**: a singly linked list of n nodes. **Find**: an in-place reversal and
its exact cost.

Walk the list once, carrying three references:

    prev = null
    curr = head
    while curr is not null:
        nxt  = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    head = prev

Each iteration performs exactly one \`next\` write on a node, and there are n
nodes, so

$$\\text{pointer writes} = n + 1 \\ \\text{(one per node, plus the new head)}, \\qquad \\Theta(n) \\ \\text{time}, \\ \\Theta(1) \\ \\text{space}$$

**Answer**: $\\Theta(n)$ time with three extra references, so $\\Theta(1)$ extra
space. Building a reversed copy instead would be $\\Theta(n)$ space and, for a
list of 4-byte payloads, 16 extra bytes per node.

## 7.4 Worked Example: The Middle Node in One Pass

**Given**: a singly linked list of unknown length. **Find**: the middle node
without first counting.

Advance two references from the head, one by one node and one by two:

$$\\text{slow} \\leftarrow \\text{slow.next}, \\qquad \\text{fast} \\leftarrow \\text{fast.next.next}$$

When \`fast\` reaches the end, \`slow\` has travelled half as far:

$$\\text{fast position} = 2k, \\quad \\text{slow position} = k, \\quad \\text{stop when } 2k \\ge n - 1 \\;\\Rightarrow\\; k = \\left\\lceil \\frac{n-1}{2} \\right\\rceil$$

**Answer**: one pass, $\\Theta(n)$ time and $\\Theta(1)$ space. Counting the
nodes first and then walking half the list costs the same 1.5n node visits, so
the two-reference method is not fewer steps — it is **one** traversal, which is
what a question specifying a singly linked list read once is testing. The same
two-reference idea detects a cycle:
if the list loops, the fast reference eventually laps the slow one, and if it
does not, it reaches null.

## 7.5 Choosing Between the Two

| Requirement | Choose | Because |
|---|---|---|
| Index-addressed access | Array | address arithmetic against a walk |
| Many inserts and deletes at a known position | Linked list | pointer writes against tail shifting |
| Tight memory, small elements | Array | 4 bytes against 16 |
| Cache-sensitive scanning | Array | contiguity against pointer chasing |
| Size unknown and highly variable | Dynamic array or list | both grow; the array copies, the list does not |
| Splice two sequences together | Linked list | $\\Theta(1)$ if both tails are known |

The row that decides most real cases is the fourth. A linked list's
$\\Theta(1)$ insertion is only reachable **after** you have a pointer to the
position, and getting there is $\\Theta(n)$; an array's $\\Theta(n)$ shift is
$\\Theta(n)$ contiguous byte moves, which modern hardware performs far faster
per element than it follows scattered pointers. The complexity table and the
measured runtime therefore disagree more often here than anywhere else in this
chapter, and an exam question asks about the table.`,
      examTip: 'Counting the elements of a linked list is Theta(n) - there is no length field unless the implementation adds one. Deleting a node you hold a pointer to is Theta(1) in a doubly linked list and Theta(n) in a singly linked one, because the predecessor has to be found.',
      importantNote: 'A linked list node holding a 4-byte integer occupies 16 bytes singly linked and 24 doubly linked on a 64-bit machine, against 4 bytes in an array: an overhead factor of 4 to 6. The Theta(1) insertion is real, but it is only reachable once you already hold a pointer to the position.',
    },
    { id: 'ds-stack-queue-applied', title: '8. Stacks and Queues: Two Applications Worked Through',
      content: `## 8.1 The Two Disciplines

A stack and a queue restrict the same underlying storage to one end or two
ends, and the restriction is the point: it makes every operation
$\\Theta(1)$ and it matches a structure in the problem.

| | Stack | Queue |
|---|---|---|
| Discipline | last in, first out | first in, first out |
| Operations | push, pop, peek | enqueue, dequeue, front |
| Cost of each | $\\Theta(1)$ | $\\Theta(1)$ |
| Matches | nesting, backtracking, undo | arrival order, fairness, level order |
| Search in it | $\\Theta(n)$, and doing so defeats the point | $\\Theta(n)$ |

A stack of pushes and pops leaves the elements in reverse arrival order; a
queue preserves it. For the sequence push 4, push 8, pop, push 6, push 10,
pop, the popped values are 8 then 10 and the stack afterwards is 6 above 4,
top to bottom. The same six items enqueued and dequeued as a queue would come
out 4 then 8.

## 8.2 Worked Example: Evaluating Postfix With a Stack

**Given**: the postfix expression \`5 3 + 8 2 - *\`. **Find**: its value, and
the peak stack depth.

Push operands; on an operator, pop two, apply, push the result:

| Token | Action | Stack after (bottom to top) |
|---|---|---|
| 5 | push | 5 |
| 3 | push | 5, 3 |
| + | pop 3 and 5, push $5 + 3 = 8$ | 8 |
| 8 | push | 8, 8 |
| 2 | push | 8, 8, 2 |
| - | pop 2 and 8, push $8 - 2 = 6$ | 8, 6 |
| * | pop 6 and 8, push $8 \\cdot 6 = 48$ | 48 |

**Answer**: **48**, with a peak depth of 3. In infix the same expression is
$(5 + 3) \\times (8 - 2) = 48$, and notice that postfix needed no parentheses
and no precedence rules — the order in the token stream already encodes them,
which is exactly why compilers convert to it.

The operand order matters for non-commutative operators: the **second** pop is
the left operand. Popping 2 then 8 and computing $2 - 8 = -6$ would give
$8 \\cdot (-6) = -48$, and that sign error is the standard distractor.

The stack depth needed is the expression's maximum nesting, and for a
well-formed postfix expression with k operands it never exceeds k:

$$\\text{depth} \\le k, \\qquad \\text{final depth} = 1 \\ \\text{if the expression is well formed}$$

Ending with anything other than exactly one value on the stack is the test for
a malformed expression.

## 8.3 Worked Example: The Circular Queue's Index Arithmetic

**Given**: a queue implemented in a fixed array of capacity 8, with \`front\`
indexing the next element to leave and \`rear\` the next free slot.
**Find**: the enqueue and dequeue arithmetic and the occupancy formula.

Advancing either index wraps with a modulus rather than shifting the contents,
which is what keeps both operations $\\Theta(1)$:

$$\\text{enqueue: } A[\\text{rear}] \\leftarrow x, \\quad \\text{rear} \\leftarrow (\\text{rear} + 1) \\bmod 8$$

$$\\text{dequeue: } x \\leftarrow A[\\text{front}], \\quad \\text{front} \\leftarrow (\\text{front} + 1) \\bmod 8$$

$$\\text{count} = (\\text{rear} - \\text{front} + 8) \\bmod 8$$

The added capacity in the count formula is what keeps the result non-negative
when rear has wrapped past front. With front = 6 and rear = 2:

$$(2 - 6 + 8) \\bmod 8 = 4 \\ \\text{elements}$$

**The ambiguity.** Both a full and an empty queue satisfy
$\\text{rear} = \\text{front}$, so the count formula alone cannot tell them
apart. Two standard fixes:

$$\\text{(1) keep one slot empty} \\;\\Rightarrow\\; \\text{capacity} = 8 - 1 = 7 \\ \\text{usable}$$

$$\\text{(2) store an explicit count} \\;\\Rightarrow\\; \\text{all 8 usable, one extra field}$$

**Answer**: the arithmetic above, with 4 elements held, and the deliberate
choice of which of the two disambiguations to use. A shifting implementation
that moves every element down on dequeue would be $\\Theta(n)$ per dequeue
instead of $\\Theta(1)$ — the reason circular buffers exist.

## 8.4 Worked Example: A Queue Built From Two Stacks

**Given**: only stack operations. **Find**: a queue, and its amortised cost.

Keep an **inbox** stack and an **outbox** stack. Enqueue pushes onto the
inbox. Dequeue pops the outbox; if the outbox is empty, pour the entire inbox
into it first, which reverses the order and restores first-in-first-out.

Any single dequeue can cost $\\Theta(n)$ when it triggers a pour, but each
element is pushed onto the inbox once, popped once, pushed onto the outbox
once and popped once — never more:

$$\\text{stack operations per element} \\le 4 \\;\\Rightarrow\\; \\text{amortised } \\Theta(1)$$

**Independent check.** Instrumenting the structure and counting every push and
pop gives exactly $4n$ operations for n enqueues followed by n dequeues, at
n = 10, 100, 1,000 and 100,000 — 4.00 operations per element at every size,
with the output order verified against the input order.

**Answer**: amortised $\\Theta(1)$ per operation, worst case $\\Theta(n)$ for
one dequeue. This is the same shape of result as the doubling array in section
6.3, and it comes from the same kind of argument: bound the total work, not
the individual step.

## 8.5 Where Each One Shows Up

| Application | Structure | Why that discipline |
|---|---|---|
| Function call and return | Stack | the most recent call returns first |
| Undo and redo | Stack | the last change is undone first |
| Depth-first search | Stack (often the call stack) | explore deepest first, then backtrack |
| Expression evaluation, bracket matching | Stack | nesting is last-in-first-out by definition |
| Breadth-first search | Queue | finish distance k before starting k+1 |
| Print spooling, task scheduling | Queue | arrival order is the fairness rule |
| Producer and consumer buffering | Queue | decouple two rates |
| Shortest job first, event simulation | Priority queue | order by key, not arrival |

The call-stack row has a numeric consequence worth knowing. Each recursive
call consumes a stack frame, so recursion depth is bounded by the stack size
divided by the frame size. On an 8 MiB thread stack with 64-byte frames:

$$\\frac{8 \\cdot 1024 \\cdot 1024}{64} = 131072 \\ \\text{frames}$$

which is why a recursion of depth n over a million-element list overflows
while the equivalent loop does not, and why converting deep recursion to
iteration is a memory fix rather than a speed fix.

A **priority queue** is the odd one out: it is not first-in-first-out at all,
it dequeues by key, and it is normally a heap, so its operations are
$\\Theta(\\log n)$ rather than $\\Theta(1)$. Section 9 derives that cost.`,
      examTip: 'For push/pop sequence questions, write the stack top-to-bottom after every operation rather than tracking it mentally. In postfix evaluation the SECOND value popped is the left operand - getting that backwards flips the sign of every subtraction and inverts every division.',
      importantNote: 'A circular queue cannot distinguish full from empty by rear == front alone. Either sacrifice one slot, giving capacity - 1 usable entries, or keep an explicit count. Exam questions on circular buffer capacity are almost always testing this one point.',
    },
    { id: 'ds-trees-heaps', title: '9. Trees: Height Bounds, Rotations, and the Linear Build-Heap',
      content: `## 9.1 Height Bounds, Both Ends

Every cost in a binary search tree is proportional to its height, so bounding
the height bounds everything else. Count nodes by level: level 0 holds at most
1 node, level 1 at most 2, level h at most $2^h$. Summing:

$$n \\;\\le\\; \\sum_{i=0}^{h} 2^{i} = 2^{h+1} - 1$$

Rearranging gives the **minimum possible height** for n nodes:

$$h \\;\\ge\\; \\log _2(n+1) - 1, \\qquad \\text{so } h_{\\min} = \\lceil \\log _2(n+1) \\rceil - 1$$

At the other extreme each level can hold a single node, giving a chain:

$$h_{\\max} = n - 1$$

Both bounds are attained. Inserting 1 to n in ascending order produces exactly
the chain — measured height $n - 1$ at n = 15, 31, 63, ..., 2047 without
exception — while a perfectly filled tree of $n = 2^{k} - 1$ nodes has height
$k - 1$.

| n | $h_{\\min}$ | $h_{\\max}$ | Ratio |
|---|---|---|---|
| 15 | 3 | 14 | 4.7 |
| 255 | 7 | 254 | 36 |
| 1,023 | 9 | 1,022 | 114 |
| 1,048,575 | 19 | 1,048,574 | 55,188 |

## 9.2 What Height Costs, and the Mean Versus the Deepest Key

Search, insert and delete all walk one root-to-leaf path, so each is
$\\Theta(h)$, which is $\\Theta(\\log n)$ when balanced and $\\Theta(n)$ when not.
Two different numbers describe a balanced tree and they are easy to confuse.
The **deepest** key in a perfect tree costs

$$C_{\\max} = h + 1 = \\log _2(n+1)$$

while the **mean** over all keys weights each level by its population:

$$\\bar{C} = \\frac{1}{n}\\sum_{i=1}^{k} i\\,2^{i-1} = \\frac{(k-1)2^{k} + 1}{n}, \\qquad n = 2^{k}-1$$

At n = 1023 those are 10 and 9.01 respectively — the mean is lower because
half the keys live in the bottom level and the rest are cheaper. Section 4.4
uses both columns, and mistaking one for the other is what makes a shuffled
tree look 24 % worse than perfect when it is really 38 % worse.

## 9.3 Worked Example: The AVL Height Bound From Fibonacci

**Given**: an AVL tree, where the two subtrees of every node differ in height
by at most 1. **Find**: the tallest such tree on n nodes.

Build the **sparsest** AVL tree of height h: a root, one subtree of height
$h-1$ and one of height $h-2$, each itself as sparse as possible.

$$N(h) = N(h-1) + N(h-2) + 1, \\qquad N(0) = 1, \\; N(1) = 2$$

Adding 1 to both sides turns this into the Fibonacci recurrence, giving

$$N(h) = F(h+3) - 1$$

verified against the recurrence for every h from 0 to 25. The first few values
are 1, 2, 4, 7, 12, 20, 33, 54. Inverting through
$F(m) \\approx \\varphi^{m}/\\sqrt{5}$:

$$h \\;\\le\\; \\log _{\\varphi}\\!\\bigl(\\sqrt{5}\\,(n+2)\\bigr) - 3 \\;\\approx\\; 1.4404\\log _2(n+2) - 0.328$$

which was checked to hold for the minimal tree at every height from 2 to 25.

**Answer**: an AVL tree is never more than about 44 % taller than a perfect
tree, so all operations stay $\\Theta(\\log n)$.

| n | Perfect height | AVL worst-case bound |
|---|---|---|
| 1,000 | 9 | 14.03 |
| 1,000,000 | 19 | 28.38 |
| 1,000,000,000 | 29 | 42.74 |

A red-black tree relaxes the invariant further — no root-to-leaf path is more
than twice any other — giving the looser but still logarithmic

$$h \\;\\le\\; 2\\log _2(n+1)$$

which is why red-black trees rotate less on insertion and search a little
deeper. The two structures sit at different points on the same trade.

## 9.4 Worked Example: The Four Rotations, Concretely

**Given**: keys arriving in an order that unbalances the tree. **Find**: the
rotation each case needs and the resulting tree.

**Right-right (single left rotation).** Insert 10, 20, 30. The tree leans
right with balance factor $-2$ at the root:

$$10 \\rightarrow 20 \\rightarrow 30 \\quad \\Longrightarrow \\quad \\text{rotate left at } 10$$

The result is 20 at the root with 10 and 30 as children — **one** rotation,
height 1.

**Left-left (single right rotation).** Insert 30, 20, 10; mirror image, one
rotation, same final tree.

**Left-right (double rotation).** Insert 30, 10, 20. The offending node is in
the left subtree's **right** child, so a single rotation does not fix it:
first rotate left at 10, producing the left-left shape, then rotate right at
30. **Two** rotations, same final tree.

**Right-left (double rotation).** Insert 10, 30, 20; mirror image, two
rotations.

| Insert order | Case | Rotations performed | Resulting root |
|---|---|---|---|
| 10, 20, 30 | right-right | 1 | 20 |
| 30, 20, 10 | left-left | 1 | 20 |
| 30, 10, 20 | left-right | 2 | 20 |
| 10, 30, 20 | right-left | 2 | 20 |
| 50, 30, 70, 20, 40, 60, 80 | already balanced | 0 | 50 |

All four orders converge on the same tree, which is the point: **the AVL tree
does not depend on arrival order the way a plain BST does**.

**Answer, at scale.** Feeding the fully sorted keys 0 to $n-1$ into an AVL
tree and counting rotations gives exactly

$$\\text{rotations} = n - \\lfloor \\log _2 n \\rfloor - 1$$

verified for every n from 1 to 2,999, and the resulting height is exactly
$\\lfloor \\log _2 n \\rfloor$ — the perfect-tree minimum — at every one of those
sizes. So the worst possible input for a plain BST is handled by an AVL tree
at a cost of slightly fewer than one rotation per insertion.

![Three measured series of tree height against the number of keys inserted, on logarithmic axes from fifteen to 2047 keys: sorted keys into a plain binary search tree giving height n minus one, the same keys shuffled giving roughly three times log base two of n, and sorted keys into an AVL tree giving exactly floor of log base two of n, with the AVL worst-case bound drawn dashed above it.](/courses/fe-ee/figures/sw2-tree-heights.svg)

## 9.5 Heaps: The Array Layout

A binary heap is a **complete** tree, so it needs no pointers at all — the
shape is implied and the tree lives in an array:

$$\\text{left}(i) = 2i + 1, \\qquad \\text{right}(i) = 2i + 2, \\qquad \\text{parent}(i) = \\left\\lfloor \\frac{i-1}{2} \\right\\rfloor$$

Completeness forces the height to be minimal:

$$h = \\lfloor \\log _2 n \\rfloor$$

so sift-up and sift-down each walk at most h levels:

| Operation | Cost | Why |
|---|---|---|
| Find min (min-heap) | $\\Theta(1)$ | it is at index 0 |
| Insert | $\\Theta(\\log n)$ | append, then sift up at most h levels |
| Extract min | $\\Theta(\\log n)$ | move the last element to the root, sift down |
| Build from an unordered array | $\\Theta(n)$ | see 9.6 |
| Search for an arbitrary key | $\\Theta(n)$ | the heap orders parents against children only |

The last row is the standard trap. A heap is **not** a search structure: it
guarantees nothing about siblings, so finding a key that is not the minimum
means scanning.

## 9.6 Worked Example: Why Build-Heap Is Linear, Not n log n

**Given**: an unordered array of n elements. **Find**: the cost of turning it
into a heap by Floyd's bottom-up method.

Sift down from the last internal node upward. A node at height j above the
leaves sifts at most j levels, and a complete tree contains at most
$\\lceil n/2^{j+1} \\rceil$ nodes at height j:

$$T(n) \\;\\le\\; \\sum_{j=0}^{\\lfloor \\log _2 n \\rfloor} \\left\\lceil \\frac{n}{2^{\\,j+1}} \\right\\rceil j \\;\\le\\; \\frac{n}{2}\\sum_{j=0}^{\\infty} \\frac{j}{2^{\\,j}}$$

The remaining sum is a standard generating-function value:

$$\\sum_{j=0}^{\\infty} j\\,x^{\\,j} = \\frac{x}{(1-x)^2} \\;\\Rightarrow\\; \\sum_{j=0}^{\\infty} \\frac{j}{2^{\\,j}} = \\frac{1/2}{(1/2)^2} = 2$$

$$T(n) \\;\\le\\; \\frac{n}{2}\\cdot 2 = n \\;\\Rightarrow\\; T(n) \\in \\Theta(n)$$

The counter-intuitive step is the weighting: most nodes are near the leaves,
where sifting is cheap, and the expensive nodes near the root are few. The
naive $n\\log n$ bound charges every node the root's cost.

**Independent check.** Counting the actual swaps on the same shuffled input at
each size:

| n | Floyd swaps, counted | Swaps per element | $n\\log _2 n$ |
|---|---|---|---|
| 1,000 | 731 | 0.731 | 9,966 |
| 10,000 | 7,389 | 0.739 | 132,877 |
| 100,000 | 74,270 | 0.743 | 1,660,964 |
| 1,000,000 | 742,904 | 0.743 | 19,931,569 |

The per-element column is flat at about 0.74 across three orders of magnitude,
which is what linear looks like. Two further routes confirm it: the **worst
case** of Floyd's build is exactly $n - s_2(n)$, where $s_2(n)$ counts the 1
bits in n, verified by exhaustive search over every permutation for
$n \\le 9$; and building the same heap by n successive insertions instead has a
worst case of

$$\\sum_{i=1}^{n} \\lfloor \\log _2 i \\rfloor$$

which is 8,194 swaps at n = 1023 against Floyd's worst case of 1,013 — a
factor of 8.1 at that size, and growing.

![Two measured swap-count series against the number of elements on logarithmic axes from 64 to about a million: Floyd's bottom-up build-heap, a straight line of slope one at roughly 0.74 swaps per element, and the worst case of building the same heap by repeated insertion, which tracks the dashed n log base two of n reference above it.](/courses/fe-ee/figures/sw2-buildheap-linear.svg)

**Answer**: $\\Theta(n)$, not $\\Theta(n\\log n)$. Heapsort still costs
$\\Theta(n\\log n)$ overall, because the n extract-min operations that follow the
build are $\\Theta(\\log n)$ each and cannot be improved:

$$T_{\\text{heapsort}} = \\underbrace{\\Theta(n)}_{\\text{build}} + \\underbrace{\\Theta(n\\log n)}_{n \\text{ extractions}} = \\Theta(n\\log n)$$`,
      examTip: 'Build-heap from an unordered array is O(n), not O(n log n) - measured at 0.74 swaps per element from a thousand to a million elements. Heapsort is still O(n log n) because of the n extractions that follow. If an option offers O(n) for building a heap, it is right; if it offers O(n) for heapsort, it is not.',
      importantNote: 'A heap is not a search tree. It orders parents against children only, so finding an arbitrary key is Theta(n). It answers "what is the smallest" in Theta(1) and nothing else quickly. If a question asks for ordered traversal, successor, or range queries, the answer is a BST.',
    },
    { id: 'ds-graph-choice', title: '10. Graph Representations and Choosing a Structure',
      content: `## 10.1 Two Representations, Quantified

An **adjacency matrix** is a $V \\times V$ grid whose entry $(u,v)$ records
whether the edge exists. An **adjacency list** stores, for each vertex, only
the neighbours it actually has.

$$\\text{matrix storage} = \\Theta(V^2), \\qquad \\text{list storage} = \\Theta(V + E)$$

Edge counts are bounded by the complete graph, and **density** normalises
against that ceiling:

$$E_{\\max} = \\frac{V(V-1)}{2} \\ \\text{(undirected)}, \\qquad d = \\frac{2E}{V(V-1)}$$

| Operation | Adjacency matrix | Adjacency list |
|---|---|---|
| Is there an edge u to v? | $\\Theta(1)$ | $\\Theta(\\deg u)$ |
| Enumerate the neighbours of u | $\\Theta(V)$ | $\\Theta(\\deg u)$ |
| Add an edge | $\\Theta(1)$ | $\\Theta(1)$ |
| Delete an edge | $\\Theta(1)$ | $\\Theta(\\deg u)$ |
| Full traversal, BFS or DFS | $\\Theta(V^2)$ | $\\Theta(V + E)$ |
| Storage | $\\Theta(V^2)$ | $\\Theta(V + E)$ |

The matrix wins one row — the edge test — and loses every row that involves
walking the graph. Since almost every graph algorithm walks the graph, that is
the trade.

## 10.2 Worked Example: Where the Storage Break-Even Sits

**Given**: a byte model — one byte per matrix cell, and for the list 8 bytes
per directed arc (a 4-byte vertex id and a 4-byte next index) plus a 4-byte
head pointer per vertex. **Find**: the density at which the two cost the same.

An undirected edge appears in two adjacency lists, so E edges become 2E arcs:

$$V^2 = 16E + 4V \\;\\Longrightarrow\\; E = \\frac{V^2 - 4V}{16}$$

At V = 1000:

$$E = \\frac{1000000 - 4000}{16} = 62250, \\qquad d = \\frac{2 \\cdot 62250}{1000 \\cdot 999} = 0.1246$$

**Answer**: about **12.5 % density**. Below it the list is smaller, above it
the matrix is. The number is remarkably stable in V:

| V | Break-even E | Break-even density | $E_{\\max}$ |
|---|---|---|---|
| 100 | 600 | 12.12 % | 4,950 |
| 1,000 | 62,250 | 12.46 % | 499,500 |
| 10,000 | 6,247,500 | 12.50 % | 49,995,000 |

Real graphs sit far below that line — a road network has a bounded degree, so
$E \\approx cV$ and $d \\approx 2c/V$, which falls toward zero as the network
grows. That is why adjacency lists are the default and matrices appear mainly
in dense algorithms such as Floyd-Warshall.

## 10.3 Worked Example: The Traversal Gap, Counted

**Given**: V = 500 vertices. **Find**: the adjacency probes one full traversal
makes under each representation, across a range of densities.

The matrix reads every cell of every row regardless of content; the list reads
each arc once plus one head per vertex:

$$P_{\\text{matrix}} = V^2 = 250000, \\qquad P_{\\text{list}} = 2E + V$$

Building the graphs and counting:

| E | Density | List probes | Matrix probes | Ratio |
|---|---|---|---|---|
| 1,000 | 0.008 | 2,500 | 250,000 | 100.0 |
| 5,000 | 0.040 | 10,500 | 250,000 | 23.8 |
| 50,000 | 0.401 | 100,500 | 250,000 | 2.5 |
| 124,750 | 1.000 | 250,000 | 250,000 | 1.0 |

**Answer**: a factor of 100 on a sparse graph, converging to 1 only at the
complete graph, where $2E + V = V(V-1) + V = V^2$ exactly.

![Two series of adjacency probes per traversal against edge density on logarithmic axes for a 500-vertex graph: a horizontal line at 250,000 for the adjacency matrix, which reads every cell whatever the edge count, and a rising line for the adjacency list at two E plus V, which meets the matrix line only at density one.](/courses/fe-ee/figures/sw2-graph-density.svg)

## 10.4 A Structure for Each Requirement

| Requirement | Structure | Operation and cost |
|---|---|---|
| Fastest lookup by exact key | Hash table | $\\Theta(1)$ average, $\\Theta(n)$ worst |
| Keys kept in sorted order | Balanced BST | in-order traversal, $\\Theta(n)$ |
| All keys between x and y | Balanced BST | $\\Theta(\\log n + m)$ for m results |
| Successor or predecessor of a key | Balanced BST | $\\Theta(\\log n)$ |
| Repeatedly take the smallest | Binary heap | $\\Theta(1)$ peek, $\\Theta(\\log n)$ extract |
| Access by position, tight memory | Array | $\\Theta(1)$ index, 4 bytes per integer |
| Grow to an unknown size, append only | Dynamic array | $\\Theta(1)$ amortised append |
| Splice, or insert at a held position | Linked list | $\\Theta(1)$ pointer writes |
| Nesting, backtracking, undo | Stack | $\\Theta(1)$ push and pop |
| Arrival order, level-order traversal | Queue | $\\Theta(1)$ enqueue and dequeue |
| Sparse graph | Adjacency list | $\\Theta(V+E)$ traversal |
| Dense graph, frequent edge tests | Adjacency matrix | $\\Theta(1)$ edge test |

Three rows decide most questions. **Range and order** send you to a tree even
though the hash table's single-key lookup is faster, because hashing destroys
the relationship between key value and location by design. **Repeatedly take
the smallest** sends you to a heap rather than a sorted array, because a
sorted array costs $\\Theta(n)$ to reinsert. And **density** decides the graph
representation, not the algorithm you intend to run on it.

## Problem Set C — Linear Structures and Amortised Cost

**C1.** A 4-column array of 4-byte integers starts at address 2000. Give the
address of $A[2][3]$ in row-major and in column-major order, assuming 5 rows.

**C2.** What is the time complexity of counting the elements in a singly
linked list, and why?

**C3.** Push 4, push 8, pop, push 6, push 10, pop. Give the popped values in
order and the final stack from top to bottom.

**C4.** A circular queue has capacity 8, front = 6, rear = 2. How many
elements does it hold, and how many can it still accept if one slot is kept
empty to distinguish full from empty?

**C5.** A dynamic array starting at capacity 1 and doubling has just accepted
its 1000th append. How many element copies have been performed in total, and
what is the amortised cost per append?

**C6.** Evaluate the postfix expression \`5 3 + 8 2 - *\` and give the peak
stack depth.

### Worked Answers, Set C

**C1.** Row-major with C = 4 columns:

$$2000 + 2 \\cdot 4 \\cdot 4 + 3 \\cdot 4 = 2044$$

Column-major with R = 5 rows:

$$2000 + 3 \\cdot 5 \\cdot 4 + 2 \\cdot 4 = 2068$$

**Answer**: 2044 and 2068.

**Trap**: using the number of rows in the row-major formula. Row-major strides
by **columns**, because it is the column index that varies fastest; the row
count never appears.

**C2.** $\\Theta(n)$. The structure stores no length, so the only way to know
how many nodes exist is to follow every \`next\` reference to the end.

**Trap**: choosing $\\Theta(1)$ by analogy with an array's length, or
$\\Theta(\\log n)$ by analogy with a tree. A list offers no shortcut of either
kind — unless the implementation maintains a size field, which changes the
answer and is exactly what such a question is probing.

**C3.** Tracking the stack top-to-bottom after each operation:

| Operation | Popped | Stack, top to bottom |
|---|---|---|
| push 4 | — | 4 |
| push 8 | — | 8, 4 |
| pop | 8 | 4 |
| push 6 | — | 6, 4 |
| push 10 | — | 10, 6, 4 |
| pop | 10 | 6, 4 |

**Answer**: popped 8 then 10; final stack 6 on top of 4.

**Trap**: answering "4, 8" for the pops by reading the sequence as a queue.
Both orders appear as options, and last-in-first-out returns the most recent
push, not the earliest.

**C4.** The occupancy formula wraps the difference:

$$(2 - 6 + 8) \\bmod 8 = 4$$

With one slot reserved the usable capacity is $8 - 1 = 7$, so it can accept

$$7 - 4 = 3 \\ \\text{more elements}$$

**Answer**: 4 held, 3 more accepted.

**Trap**: computing $2 - 6 = -4$ and reporting a negative count, or forgetting
the reserved slot and answering 4 more. Both are the standard distractors, and
the reserved slot is the reason a "capacity 8" circular queue is often
documented as holding 7.

**C5.** Doubling from capacity 1 resizes at sizes 1, 2, 4, ..., 512, so

$$1 + 2 + 4 + 8 + 16 + 32 + 64 = 127, \\qquad 127 + 128 + 256 + 512 = 1023$$

which matches the closed form $2^{\\lceil \\log _2 1000 \\rceil} - 1 = 1023$ and
the counted total. Per append:

$$\\frac{1023}{1000} = 1.023 \\ \\text{copies}$$

**Answer**: 1,023 copies, 1.023 per append, so amortised $\\Theta(1)$.

**Trap**: answering $\\Theta(n)$ because the 512th-to-513th append copied 512
elements. That is the worst case of **one** operation; the question asks for
the amortised cost, and the two differ by a factor of n.

**C6.** From the trace in section 8.2 the value is **48** with a peak depth of
**3**.

**Trap**: popping the operands in the wrong order and computing
$2 - 8 = -6$, then $8 \\cdot -6 = -48$. The second value popped is the left
operand of a non-commutative operator.

## Problem Set D — Trees, Heaps, Hashing, Graphs

**D1.** Insert 50, 30, 70, 20, 40, 60, 80 into an empty BST, then insert the
same keys in ascending order into a second empty BST. Give both heights.

**D2.** Give all three depth-first traversals — pre-order, then in-order, then
post-order — of the balanced tree from D1.

**D3.** A min-heap holds [10, 20, 15, 30, 40, 25, 18]. Perform extract-min and
give the resulting array.

**D4.** A hash table of size 8 uses $h(x) = x \\bmod 8$ with linear probing.
Insert 20, 10, 16, 14, 15, 17 into an empty table and give the final slots.

**D5.** A graph has 7 vertices and 9 undirected edges. How many cells does its
adjacency matrix have, how many are non-zero, and how many probes does a list
traversal make?

**D6.** A tree of 1,023 keys is built by shuffled insertion and costs 12.4
comparisons on average to find a key. How does that compare with a perfectly
balanced tree of the same size?

### Worked Answers, Set D

**D1.** The first order splits evenly at every step, giving root 50 with
children 30 and 70 and four grandchildren:

$$h_{\\text{balanced}} = 2 \\ \\text{edges}, \\qquad h_{\\text{sorted}} = 7 - 1 = 6 \\ \\text{edges}$$

**Answer**: 2 and 6. Both trees hold the same seven keys and the same in-order
sequence; only the arrival order differs.

**Trap**: quoting the height in **nodes** rather than edges, giving 3 and 7.
Both conventions exist; the FE convention counts edges, so a single node has
height 0.

**D2.** Reading the balanced tree:

| Traversal | Rule | Output |
|---|---|---|
| Pre-order | node, left, right | 50, 30, 20, 40, 70, 60, 80 |
| In-order | left, node, right | 20, 30, 40, 50, 60, 70, 80 |
| Post-order | left, right, node | 20, 40, 30, 60, 80, 70, 50 |

**Trap**: offering the in-order output for the pre-order question. In-order is
the only one that comes out ascending, which makes it the easiest to spot and
the easiest to select by mistake.

**D3.** Remove the root 10, move the last element 18 into its place, and sift
down. The children of the root are 20 and 15; the smaller is 15, and
$15 < 18$, so they swap. At its new position 18 has one child, 25, and
$18 < 25$, so it stops.

$$[10, 20, 15, 30, 40, 25, 18] \\;\\rightarrow\\; [15, 20, 18, 30, 40, 25]$$

**Answer**: [15, 20, 18, 30, 40, 25]. The sift-down travelled one level here
and is bounded by the heap's height, $\\lfloor \\log _2 6 \\rfloor = 2$.

**Trap**: promoting the smaller child into the root and shifting the rest, or
swapping with the **larger** child. Sifting down a min-heap always exchanges
with the smaller child; using the larger one breaks the heap property one
level down.

**D4.** With $h(x) = x \\bmod 8$: 20 goes to slot 4, 10 to slot 2, 16 to slot
0, 14 to slot 6, 15 to slot 7, 17 to slot 1. No two collide, so probing never
triggers.

| Slot | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|---|
| Key | 16 | 17 | 10 | — | 20 | — | 14 | 15 |

**Answer**: as tabulated, with slots 3 and 5 empty and a load factor of
$6/8 = 0.75$.

**Trap**: placing the keys in the order given rather than at their hashed
slots, producing 20, 10, 16, 14, 15, 17 across slots 0 to 5. Every value must
land at $x \\bmod 8$ unless that slot is taken.

**D5.** The matrix is $V \\times V$ whatever the edge count:

$$7 \\cdot 7 = 49 \\ \\text{cells}, \\qquad 2 \\cdot 9 = 18 \\ \\text{non-zero (each edge appears twice)}$$

$$P_{\\text{list}} = 2E + V = 18 + 7 = 25 \\ \\text{probes}$$

**Answer**: 49 cells, 18 non-zero, 25 list probes — so the matrix does about
twice the work of the list even on a graph this dense
($d = 18/42 = 0.43$).

**Trap**: reporting 9 non-zero entries. An undirected edge occupies two
symmetric cells, and the same doubling is why the list stores 2E arcs.

**D6.** The perfect tree of 1,023 keys has its deepest key at
$\\log _2 1024 = 10$ comparisons, but its **mean** over all keys is

$$\\frac{(10-1)\\cdot 1024 + 1}{1023} = \\frac{9217}{1023} = 9.01$$

$$\\frac{12.4}{9.01} = 1.38$$

**Answer**: shuffled insertion costs about **38 % more** than perfect balance —
not 24 %, which is what comparing against the depth of the deepest key would
give. Against sorted insertion, which averages
$(1023+1)/2 = 512$ comparisons, both are enormously better.

**Trap**: comparing a mean against a maximum. The figure in section 4.4 draws
$\\log _2(n+1)$ as its reference line, which is the perfect tree's **depth**;
the perfect tree's mean is about one comparison lower, and using the wrong one
understates the penalty for random arrival order by 14 percentage points.`,
      examTip: 'Adjacency matrix cells = V^2 always, and an undirected edge fills TWO of them. A list traversal costs 2E + V probes. On a 500-vertex graph at 0.8 % density that is 2,500 against 250,000 - a factor of 100 that comes from the representation, not the algorithm.',
      importantNote: 'Storage break-even between an adjacency list and an adjacency matrix sits near 12.5 % density under a plausible byte model, and it barely moves with V. Real graphs with bounded degree have density falling toward zero as they grow, which is why lists are the default.',
    },
  ],
  keyTakeaways: [
    'Arrays: O(1) access, O(n) insert. Lists: O(1) insert, O(n) search.',
    'Stack=LIFO (DFS, function calls). Queue=FIFO (BFS, scheduling).',
    'BST: O(log n) balanced; AVL/Red-Black guarantee balance.',
    'Heap: O(1) find-min/max, O(log n) insert/extract.',
    'Hash: O(1) avg lookup; chaining or open addressing for collisions.',
    'Load factor > 0.7 -> rehash.',
  ],
},

fee_oop: { topicId: 'fee_oop', title: 'Object-Oriented Programming', domainWeight: 'Software Development · 3–5%',
  overview: 'OOP organizes software as objects encapsulating data and behavior. The four pillars -- encapsulation, inheritance, polymorphism, abstraction -- promote modularity and reuse. Recursion and functional programming complement OOP on the FE exam.',
  sections: [
    { id: 'oop-pillars', title: '1. Four Pillars of OOP',
      content: `## 1.1 The Pillars

| Pillar | Definition | Example |
|---|---|---|
| **Encapsulation** | Hide internals, expose interface | Private fields, public methods |
| **Inheritance** | Child inherits from parent | Dog IS-A Animal |
| **Polymorphism** | Same interface, different behavior | Animal.speak() -> "Woof" or "Meow" |
| **Abstraction** | Expose essentials, hide complexity | Abstract class, interface |

## 1.2 Relationships

- **Inheritance (is-a)**: Dog is-a Animal
- **Composition (has-a)**: Car has-a Engine
- **Override**: child replaces parent method
- **Overload**: same name, different parameters`,
      examTip: 'Four pillars: Encapsulation, Inheritance, Polymorphism, Abstraction. FE tests these through scenarios.',
    },
    { id: 'oop-recursion', title: '2. Recursion and Functional Programming',
      content: `## 2.1 Recursion

Function calls itself with smaller input until **base case**.

- Without base case -> infinite recursion -> stack overflow
- **Tail recursion**: recursive call is last operation; compiler optimizes to loop
- Each call uses stack space: O(n) for n calls

## 2.2 Dynamic Programming

Recursion + memoization: store results of overlapping sub-problems.

- Fibonacci naive: O(2^n)
- Fibonacci DP: O(n)

## 2.3 Functional Programming

| Concept | Description |
|---|---|
| Pure functions | No side effects, deterministic |
| Immutability | Data never modified |
| Higher-order | Functions as arguments/return values |
| map/filter/reduce | Declarative collection processing |`,
      examTip: 'Every recursive function MUST have a base case. DP = recursion + memoization. Fibonacci: naive O(2^n), DP O(n).',
      importantNote: 'Deep recursion risks stack overflow. Naive Fibonacci(50) makes exactly 2*F(51) - 1 = 40,730,022,147 calls — about 4.1 x 10^10, not 2^50. The growth base is the golden ratio 1.618, so O(2^n) is a correct but loose bound. DP solves only 51 sub-problems.',
    },
    { id: 'oop-exam', title: '3. OOP Design Problems',
      content: `## 3.1 Identify the Pattern from Code Snippet

**Pattern 1 — Singleton**: Only one instance exists.
- Private constructor, static getInstance() method
- Use case: database connection pool, configuration manager

**Pattern 2 — Observer**: Objects subscribe to events.
- Subject maintains list of observers, notifies on change
- Use case: GUI event handling, pub/sub messaging

**Pattern 3 — Factory**: Creates objects without specifying exact class.
- Factory method returns interface/base type
- Use case: creating different shapes, database drivers

| Pattern | Intent | Key Indicator |
|---|---|---|
| **Singleton** | One instance globally | Private constructor + static method |
| **Observer** | Notify dependents of change | subscribe/notify methods |
| **Factory** | Create without specifying class | Returns base type/interface |
| **Strategy** | Swap algorithms at runtime | Interface parameter in constructor |
| **Decorator** | Add behavior dynamically | Wraps same interface |

## 3.2 Inheritance vs Composition Tradeoff

| Criteria | Inheritance (is-a) | Composition (has-a) |
|---|---|---|
| Coupling | **Tight** (child depends on parent) | **Loose** (delegate to component) |
| Flexibility | Fixed at compile time | Changeable at runtime |
| Code reuse | Inherits everything (even unwanted) | Cherry-pick behaviors |
| Fragile base class | Yes (parent change breaks children) | No |

**Rule of thumb**: "Favor composition over inheritance" (Gang of Four).
- Use inheritance when there is a true **is-a** relationship (Dog is-a Animal)
- Use composition when sharing behavior (Car has-a Engine, not Car is-a Engine)

## 3.3 Polymorphism: Virtual Method Dispatch

**Base class Animal** has virtual method speak(). Dog overrides with "Woof", Cat with "Meow".

**Runtime dispatch** (dynamic binding):
- Variable type: Animal. Actual object: Dog.
- **Animal a = new Dog(); a.speak() -> "Woof"**
- The runtime type (Dog) determines which method executes, not the declared type (Animal).

**Static dispatch** (overloading): resolved at compile time based on parameter types.

| Dispatch Type | When Resolved | Mechanism |
|---|---|---|
| **Dynamic (override)** | Runtime | vtable pointer |
| **Static (overload)** | Compile time | Parameter signature |

**Exam strategy**: For pattern identification, look for structural clues — private constructor (Singleton), listener lists (Observer), creation methods returning base types (Factory). For inheritance vs composition, ask "is this truly an is-a relationship?" If not, use composition.`,
      examTip: 'Polymorphism question trick: the RUNTIME type determines which overridden method runs, not the declared type. Animal a = new Dog(); a.speak() calls Dog.speak(), not Animal.speak().',
      importantNote: 'The Singleton pattern is NOT thread-safe by default. In multi-threaded environments, use double-checked locking or initialize-on-demand holder. This detail sometimes appears on the FE exam.',
    },
    { id: 'oop-recursion-cost', title: '4. Recursion Cost: Call Counts, Stack Depth, Memoisation',
      content: `## 4.1 Counting the Calls Exactly

"Exponential" is a shape, not a number, and the naive Fibonacci recursion has
a closed form for its call count that is worth deriving because it corrects a
claim people make loosely. Let C(n) be the total calls made by

    fib(n) = fib(n-1) + fib(n-2), with fib(0) = 0, fib(1) = 1

Then C(0) = C(1) = 1 and C(n) = 1 + C(n−1) + C(n−2), which solves to

**$C(n) = 2F(n+1) - 1$**

where F is the Fibonacci sequence itself:

| n | Calls C(n) | 2F(n+1) − 1 | 2ⁿ | Memoised calls |
|---|---|---|---|---|
| 10 | 177 | 177 | 1,024 | 11 |
| 20 | 21,891 | 21,891 | 1,048,576 | 21 |
| 30 | 2,692,537 | 2,692,537 | 1,073,741,824 | 31 |
| 40 | 331,160,281 | 331,160,281 | 1.1 × 10^12 | 41 |
| 50 | **40,730,022,147** | 40,730,022,147 | 1.13 × 10^15 | 51 |

![Function calls made by the naive Fibonacci recursion against n on a logarithmic axis, compared with the loose two-to-the-n bound above it and with the memoised n plus one below it. At n equals 30 the recursion makes 2,692,537 calls against the bound's 1,073,741,824.](/courses/fe-ee/figures/swe-recursion-callcount.svg)

The gap between the middle curve and the top one is the correction. Because
F(n) grows like φⁿ with **φ = 1.618**, the call count grows like 1.618ⁿ, not
2ⁿ. At n = 30 the difference is a factor of 399, and at n = 50 it is a factor
of about 27,600. Saying naive Fibonacci is O(2ⁿ) is *true* — O is an upper
bound and 1.618ⁿ is comfortably below 2ⁿ — but the tight bound is **Θ(φⁿ)**,
and if a question asks how many calls fib(30) makes, the answer is 2,692,537.

The practical reading: at a billion calls per second, fib(50) naively takes
about **41 seconds**. A genuinely 2^50-call job would take 13 days. Both are
unacceptable; only one is the truth.

## 4.2 Where the Waste Goes

The recursion tree recomputes the same sub-problems. fib(5) calls fib(3)
twice, fib(2) three times, fib(1) five times — the multiplicities are
themselves Fibonacci numbers. Memoisation stores each result on first
computation:

| Approach | Time | Space | Sub-problems solved |
|---|---|---|---|
| Naive recursion | Θ(φⁿ) | O(n) stack | 2F(n+1) − 1 calls for n + 1 distinct values |
| Top-down memoisation | O(n) | O(n) table + O(n) stack | n + 1 |
| Bottom-up iteration | O(n) | **O(1)** if only the last two are kept | n + 1 |

Bottom-up is worth flagging: once the recursion is removed, so is the stack,
and Fibonacci needs only two variables. **Dynamic programming does not require
a table** — it requires that overlapping sub-problems be solved once, and
sometimes a rolling window of two values is the whole table.

## 4.3 Stack Depth and Overflow

Each pending call holds a **stack frame** containing the return address, saved
registers, parameters and locals — commonly a few dozen bytes. With a 1 MB
default stack and 64-byte frames, the limit is around **16,384 frames**:

| Recursion | Depth | Overflows a 1 MB stack? |
|---|---|---|
| fib(50), naive | 50 | No — the tree is wide, not deep |
| Factorial of 10,000 | 10,000 | Borderline |
| Traversing a 10⁶-node degenerate BST | 10⁶ | Yes, comfortably |
| Traversing a balanced 10⁶-node BST | 20 | No |

The middle rows make the point that **depth, not call count, causes stack
overflow**. Naive Fibonacci makes 4 × 10^10 calls at depth 50 and never
overflows; an in-order traversal of a sorted-insertion BST makes only 10^6
calls and does, because they are all pending at once. This is the second
reason to keep trees balanced.

**Tail recursion** is the escape. A call is in tail position when it is the
last action of the function, with nothing to do after it returns — the current
frame is then dead and a compiler may reuse it, turning the recursion into a
loop with O(1) stack. Fibonacci as written is **not** tail recursive: the
addition happens after both calls return. Rewriting it with accumulator
parameters makes it so.

## 4.4 When Recursion Is the Right Answer Anyway

The trade is against clarity, and recursion wins whenever the data is itself
recursive:

| Problem | Prefer | Reason |
|---|---|---|
| Tree and graph traversal | Recursion | The structure is defined recursively |
| Divide and conquer (merge sort, binary search) | Recursion | Sub-problems are independent |
| Backtracking (n-queens, maze solving) | Recursion | The call stack *is* the undo history |
| Simple accumulation over a list | Iteration | No structural benefit, and a stack frame per element |
| Overlapping sub-problems (Fibonacci, shortest path) | Recursion **plus memoisation** | Recursion alone repeats exponential work |

Every recursive function needs a **base case** reached by every path and
arguments that provably move toward it. A missing base case gives infinite
recursion and a stack overflow; a base case that some path never reaches gives
the same fault intermittently, which is far harder to find.`,
      examTip: 'Naive Fibonacci makes exactly 2*F(n+1) - 1 calls, growing as the golden ratio to the n rather than 2^n. Memoisation reduces it to n + 1 sub-problems, and bottom-up iteration additionally drops the stack to O(1).',
      importantNote: 'Stack overflow is caused by DEPTH, not by the number of calls. Naive fib(50) makes 4.1 x 10^10 calls at depth 50 and is fine; traversing a degenerate million-node BST makes 10^6 calls at depth 10^6 and crashes.',
    },
    { id: 'oop-design', title: '5. Designing with Objects: Boundaries, SOLID, UML',
      content: `## 5.1 Encapsulation Enforced: Access Modifiers

Encapsulation is a compiler-enforced boundary, not a naming convention. The
four levels, from most open to most closed:

| Modifier | Visible to | Typical use |
|---|---|---|
| **public** | Everyone | The intended interface |
| **protected** | The class and its subclasses | Extension points |
| **package / default** | Other classes in the same module | Collaborating implementation classes |
| **private** | The declaring class only | Fields and internal helpers |

The working rule is **fields private, behaviour public**. A public field is a
permanent commitment: any change to how the value is stored, validated or
computed breaks every caller. A getter and setter can be re-implemented,
validated, logged or made lazy without touching a single call site.

## 5.2 Abstract Class Versus Interface

Both declare a contract without implementing all of it, and choosing between
them is a standard exam item:

| | Abstract class | Interface |
|---|---|---|
| Can hold state (fields) | Yes | No (constants only) |
| Can provide implementations | Yes | Default methods only |
| Can declare a constructor | Yes | No |
| How many can a class take | One | Many |
| Models | An **is-a** relationship with shared machinery | A **can-do** capability |

A Bird is-a Animal, so Animal is an abstract class supplying shared state and
behaviour. A Bird can-do Flyable, and so can an Aeroplane, which is not an
Animal at all — so Flyable is an interface. The single-inheritance limit is
what forces the distinction: a class may only have one parent, but may promise
any number of capabilities.

## 5.3 Coupling, Cohesion, and SOLID

Two measures describe a design before any pattern is applied:

| Measure | Want | Meaning |
|---|---|---|
| **Coupling** | Low | How much one module depends on another's internals |
| **Cohesion** | High | How closely the things inside one module belong together |

The SOLID principles are five ways of getting there:

| Principle | Statement | Violation looks like |
|---|---|---|
| **S**ingle responsibility | A class has one reason to change | A class that parses, validates and writes to the database |
| **O**pen/closed | Open for extension, closed for modification | Adding a shape requires editing the drawing switch statement |
| **L**iskov substitution | A subtype must be usable wherever its base type is | Square extends Rectangle and breaks setWidth |
| **I**nterface segregation | Many small interfaces beat one large one | Implementers forced to stub out methods they cannot support |
| **D**ependency inversion | Depend on abstractions, not concretions | A service that constructs its own database driver |

Liskov is the one worth dwelling on because it is counter-intuitive. Square
is-a Rectangle mathematically, but if Rectangle promises that setting the width
leaves the height alone, Square cannot keep that promise. The is-a test is
about **substitutable behaviour**, not about vocabulary — which is a concrete
instance of the "favour composition over inheritance" advice in section 3.2.

## 5.4 Reading a UML Class Diagram

UML notation appears in design questions, and the arrowheads carry the
meaning:

| Relationship | Notation | Means |
|---|---|---|
| Inheritance | Solid line, hollow triangle at the parent | is-a |
| Realisation | Dashed line, hollow triangle at the interface | implements |
| Association | Plain solid line | Uses or refers to |
| Aggregation | Solid line, hollow diamond at the whole | has-a; the part outlives the whole |
| Composition | Solid line, **filled** diamond at the whole | has-a; the part dies with the whole |
| Dependency | Dashed line, open arrow | Transient use, e.g. a parameter type |

Aggregation against composition is the distinction most often tested. A
Department **aggregates** Employees — dissolve the department and the employees
still exist. A House is **composed** of Rooms — demolish the house and the
rooms are gone. Members are marked + for public, − for private and # for
protected, and multiplicities such as 1..* label the ends.

## 5.5 Errors: Exceptions Versus Return Codes

| Approach | Advantage | Cost |
|---|---|---|
| Return code | Explicit, no unwinding | Callers can silently ignore it |
| Exception | Cannot be ignored; separates the error path from the normal one | Non-local control flow; unwinding cost |

The rule that turns this into an exam answer: **exceptions are for exceptional
conditions, not for control flow.** A file that fails to open is exceptional; a
search that finds nothing is an ordinary outcome and should return a value.
Cleanup belongs in a finally block or an equivalent scope guard, because it
must run whether the block exited normally or by exception — otherwise a thrown
exception leaks the file handle, the lock, or the connection.`,
      examTip: 'Abstract class = is-a with shared state, one parent only. Interface = can-do capability, any number implemented. If two unrelated classes need the same capability, it must be an interface.',
      importantNote: 'Aggregation (hollow diamond) means the part survives the whole; composition (filled diamond) means it does not. Department-to-Employee is aggregation, House-to-Room is composition — the fill of the diamond is the entire difference.',
    },
    { id: 'oop-memory', title: '6. An Instance Is a Memory Layout, Not a Metaphor',
      content: `## 6.1 What the Machine Actually Allocates

The pictures in most introductions show an object as a rounded box with the
word *Dog* inside it. That picture explains nothing, because it hides the two
facts an engineer needs: an instance is a fixed run of bytes, and a method call
on it is an address computation. Everything else about objects follows from
those two facts, and both are arithmetic.

Take a class holding five fields on a 64-bit target. The compiler must place
each field at an offset that satisfies its **natural alignment** — an 8-byte
integer must begin at a multiple of 8, a 4-byte integer at a multiple of 4, a
single byte anywhere. Writing $o_k$ for the offset of field $k$, $s_k$ for its
size and $a_k$ for its alignment, placement is the recurrence

$$o_{k+1} = \\left\\lceil \\frac{o_k + s_k}{a_{k+1}} \\right\\rceil a_{k+1}$$

starting from $o_1 = h$, where $h$ is the header the runtime inserts. On a
single-inheritance C++ class with at least one virtual function that header is
one pointer, $h = 8$. The total size rounds up once more, to the largest
alignment present, so that consecutive elements of an array stay aligned:

$$S = \\left\\lceil \\frac{o_n + s_n}{a_{\\max}} \\right\\rceil a_{\\max}$$

The bytes nobody asked for are the difference between what was reserved and
what was requested:

$$P = S - h - \\sum_{k=1}^{n} s_k$$

and the share of the instance that carries data is

$$\\eta = \\frac{1}{S}\\sum_{k=1}^{n} s_k$$

## 6.2 Worked Example 6A: Two Field Orders for One Class

A sensor record declares, in this order, an 8-byte identifier, a 1-byte
active flag, an 8-byte reading, a 1-byte scale code and a 4-byte sample count.
Payload is $8 + 1 + 8 + 1 + 4 = 22$ bytes. Applying the recurrence from
$o_1 = 8$:

| Field | Size | Align | Offset | Padding before it |
|---|---|---|---|---|
| id | 8 | 8 | 8 | 0 |
| active | 1 | 1 | 16 | 0 |
| reading | 8 | 8 | 24 | 7 |
| scale | 1 | 1 | 32 | 0 |
| count | 4 | 4 | 36 | 3 |

The last field ends at 40, which is already a multiple of 8, so $S = 40$ and

$$P = 40 - 8 - 22 = 10 \\ \\text{bytes}$$

Now declare the same five fields widest first — id, reading, count, active,
scale. The offsets become 8, 16, 24, 28 and 29; the last ends at 30, which
rounds up to $S = 32$, and

$$P = 32 - 8 - 22 = 2 \\ \\text{bytes}$$

![Two horizontal byte maps of the same five-field class. The declared order occupies forty bytes with two orange padding runs of seven and three bytes; the widest-first order occupies thirty-two bytes with a single two-byte run at the end. Both carry twenty-two bytes of payload.](/courses/fe-ee/figures/sw3-object-layout.svg)

Both numbers were produced twice in the figure generator: once by the
placement recurrence above and once by marking every byte an object touches on
a map and subtracting. Packing efficiency rises from $22 / 40 = 0.55$ to
$22 / 32 = 0.6875$, and the object shrinks by eight bytes without a single
field being removed.

## 6.3 Worked Example 6B: What Eight Bytes Buy at Scale

An array of one million such records costs
$1{,}000{,}000 \\times 40 = 40{,}000{,}000$ bytes in declared order and
$1{,}000{,}000 \\times 32 = 32{,}000{,}000$ bytes sorted — a saving of 8 MB.
The more interesting consequence is on the memory system. A cache line on a
typical processor is $B = 64$ bytes, and the number of whole objects it can
hold is

$$q = \\left\\lfloor \\frac{B}{S} \\right\\rfloor$$

which is $1$ at 40 bytes and $2$ at 32. A linear sweep of the array touches

$$L(N) = \\left\\lceil \\frac{N S}{B} \\right\\rceil$$

lines, so 625,000 lines in declared order against 500,000 sorted. The ratio is
exactly the size ratio, $40 / 32 = 1.25$, because the sweep is bandwidth-bound
rather than latency-bound. **Twenty-five per cent more memory traffic, for the
same program, because of the order the fields were typed in.**

## 6.4 Why This Is an Encapsulation Argument

None of the callers of this class know or care where *reading* sits. That is
the whole point. Because the fields are private, the offsets are an
implementation choice the class may revise; because a public field is a
published offset in every compiled caller, exposing one converts a layout
decision into part of the interface. Encapsulation is not politeness about
naming — it is what makes the layout table above negotiable.

## 6.5 Objects, References and What a Variable Holds

A local variable of class type does not hold the object in most managed
languages; it holds a **reference**, a machine word of $w = 8$ bytes pointing
at the run of bytes described above. Assignment copies the word, not the
bytes, so after

    Sensor a = new Sensor();
    Sensor b = a;

there is one instance and two references to it. The cost of that assignment is
8 bytes regardless of how large the instance is, which is the reason references
exist and also the reason the aliasing defect in section 13 is possible at all.

| Quantity | Symbol | Value here |
|---|---|---|
| Header | $h$ | 8 bytes |
| Payload | $\\sum s_k$ | 22 bytes |
| Instance, declared order | $S$ | 40 bytes |
| Instance, widest first | $S$ | 32 bytes |
| Reference | $w$ | 8 bytes |
| Cache line | $B$ | 64 bytes |`,
      examTip: 'Field order changes object size because each field must start at a multiple of its own alignment. Sorting fields widest-first minimises padding; the exam version of this asks you to compute the object size from a declaration.',
      importantNote: 'A public field publishes a byte offset into every compiled caller. That is why encapsulation is a layout decision as much as a design one: private fields can be reordered, retyped or computed on demand, and public ones cannot.',
    },
    { id: 'oop-dispatch', title: '7. Dispatch: What a.speak() Actually Costs',
      content: `## 7.1 The Vtable, as Address Arithmetic

Section 3.3 said the runtime type decides which override runs, and named the
mechanism a vtable pointer. Here is the mechanism itself. Every class with
virtual methods owns one **virtual function table**: an array of code
addresses, one slot per virtual method, in a slot order fixed by the base
class and inherited by every subclass. Each instance carries a pointer to its
own class table in the header.

A call therefore takes three steps. Given the object address $o$, the machine
word size $w$ and the slot index $m$ assigned to the method at compile time:

$$V = M[\\,o\\,] \\qquad \\text{(load the table address from the header)}$$

$$A_m = V + w\\,m \\qquad \\text{(index the table)}$$

$$f = M[\\,A_m\\,] \\qquad \\text{(load the target and jump to it)}$$

With $w = 8$ and a table based at 0x4000, slot 0 sits at 0x4000, slot 1 at
0x4008 and slot 5 at 0x4028. Nothing is searched and nothing is compared: the
slot index is a constant the compiler already knows, so dispatch is two
dependent loads and an indirect jump, whatever the depth of the hierarchy.
**Dynamic dispatch is O(1) in the number of subclasses**, which is the fact
that makes polymorphism affordable.

## 7.2 Costing It

Take as model parameters, in cycles on a machine where the loads hit the
first-level cache: a direct call $t_c = 1$, a cached load $t_L = 4$, an
indirect jump $t_i = 2$, and a mispredicted indirect jump costing an extra
$C_{\\mathrm{miss}} = 15$. A direct call to a body of $t_b$ cycles costs

$$T_{\\mathrm{d}} = t_c + t_b$$

and the virtual call adds the two loads and the indirection:

$$T_{\\mathrm{v}} = t_c + 2 t_L + t_i + t_b$$

so the overhead is the constant

$$\\Delta = 2 t_L + t_i = 2 \\times 4 + 2 = 10 \\ \\text{cycles}$$

What varies is not the overhead but its **share**:

$$\\rho(t_b) = \\frac{\\Delta}{t_c + t_b}$$

![Dispatch overhead as a percentage of the direct call, against the number of cycles executed inside the method body, on logarithmic axes. The monomorphic virtual call falls from 500 per cent at a one-cycle body through 10 per cent at a hundred-cycle body; the megamorphic curve with three calls in four mispredicted sits about a factor of two above it throughout.](/courses/fe-ee/figures/sw3-dispatch-overhead.svg)

## 7.3 Worked Example 7A: The Overhead at Three Body Sizes

A trivial accessor whose body is a single load, $t_b = 4$: direct cost
$1 + 4 = 5$ cycles, virtual cost $5 + 10 = 15$, so
$\\rho = 10 / 5 = 2.0$ — the dispatch costs twice as much as the work.

A small method, $t_b = 12$: direct $1 + 12 = 13$, virtual $13 + 10 = 23$, and
$100 \\times 10 / 13 = 76.9$ per cent overhead.

A method that does something, $t_b = 100$: direct $1 + 100 = 101$, virtual
111, and $10 / 101 = 0.099$, under ten per cent. Inverting

$$t_b^{\\ast} = \\frac{\\Delta}{\\rho^{\\ast}} - t_c$$

at $\\rho^{\\ast} = 0.10$ gives $t_b^{\\ast} = 99$, so the first integer body
length whose overhead is genuinely below a tenth is 100 cycles. **The rule of
thumb this licenses: virtual dispatch is negligible on methods that do real
work and dominant on one-line accessors.** That is why accessors are the
methods worth declaring non-virtual, and why a hot inner loop that calls a
one-line virtual getter a hundred million times is a legitimate target for
redesign.

## 7.4 Worked Example 7B: A Megamorphic Call Site

A call site is **monomorphic** when only one concrete type ever arrives there,
and the processor predicts the indirect jump correctly. It is **megamorphic**
when many do. Adding a misprediction probability $p$:

$$T_{\\mathrm{m}} = T_{\\mathrm{v}} + p\\,C_{\\mathrm{miss}}$$

At $t_b = 12$ and $p = 0.75$ the virtual call costs $23 + 11.25 = 34.25$
cycles against 13 direct, so the overhead is
$100 \\times 21.25 / 13 = 163.5$ per cent — more than double the monomorphic
figure. Nothing about the source changed; only the mix of types flowing
through it did.

## 7.5 Worked Example 7C: Putting It in Program Terms

A rendering loop issues $N = 2 \\times 10^{8}$ virtual calls per frame batch on
a 3 GHz core. The extra cycles are $N\\Delta$, and the extra wall time is

$$\\Delta t = \\frac{N \\Delta}{f_{\\mathrm{clk}}}$$

which is $2 \\times 10^{9}$ cycles, or 0.667 seconds. Whether that matters
depends entirely on the frame budget, and the point of the calculation is that
the question is answerable rather than a matter of taste.

## 7.6 Static Against Dynamic, Side by Side

| | Static dispatch (overload) | Dynamic dispatch (override) |
|---|---|---|
| Decided by | The declared types of the arguments | The runtime type of the receiver |
| Decided when | Compile time | Run time |
| Mechanism | Name mangling and a direct call | Header pointer, table index, indirect jump |
| Cost here | $t_c + t_b$ | $t_c + 2t_L + t_i + t_b$ |
| Inlinable | Always | Only after devirtualisation proves the type |
| Cost of a deeper hierarchy | None | None |

The last row is worth dwelling on, because the intuition is usually wrong.
Adding five levels to a hierarchy does not slow dispatch down at all: the slot
index is resolved statically and the table for the most derived class already
holds the final address. What a deep hierarchy costs is comprehension and
fragility, not cycles.

## 7.7 The Cost of Not Having Dispatch

A language without virtual dispatch writes the same behaviour as a switch on a
type tag. That version is not free either: it costs a load of the tag, a bounds
check and a jump through a table — the same shape of work — and it additionally
requires that every such switch be edited whenever a type is added. Dispatch
moves a cost that would otherwise be paid in source edits into a cost paid in
two loads.`,
      examTip: 'A virtual call is one load of the vtable pointer, one indexed load of the slot, and an indirect jump: constant cost regardless of hierarchy depth. Overloading is resolved at compile time from the argument types and costs nothing extra.',
      importantNote: 'The dispatch overhead is a fixed number of cycles, so its significance is inversely proportional to the size of the method body. It is negligible on real work and can exceed 100 per cent on a one-line accessor.',
    },
    { id: 'oop-invariants', title: '8. Encapsulation: Invariants Are the Point',
      content: `## 8.1 An Invariant Is a Predicate on the State

The usual justification for private fields — "hiding the internals" — is too
weak to act on, because it does not say what goes wrong when they are public.
The precise statement is this. A class defines a predicate $I$ over its own
state that must hold before and after every public operation. That predicate is
the **class invariant**, and encapsulation exists to make it enforceable.

A bounded buffer with a fill level $b$ and a capacity $c$ has the invariant

$$I(\\sigma)  \\equiv  \\bigl(0 \\le b \\le c\\bigr)$$

If both are public fields, the set of states the outside world can produce is
the whole Cartesian product of their ranges:

$$\\lvert \\mathcal{S}_{\\mathrm{pub}} \\rvert = \\prod_{k} n_k$$

whereas the states the class is prepared to behave correctly in are only

$$\\lvert \\mathcal{S}_{\\mathrm{ok}} \\rvert = \\bigl\\lvert \\{\\sigma : I(\\sigma)\\} \\bigr\\rvert$$

## 8.2 Worked Example 8A: Counting the Illegal States

Let $b$ and $c$ each be one unsigned byte, so $n_b = n_c = 256$ and

$$\\lvert \\mathcal{S}_{\\mathrm{pub}} \\rvert = 256 \\times 256 = 65{,}536$$

The states satisfying $b \\le c$ are the pairs with $b$ at or below $c$, which
is the triangular number

$$\\lvert \\mathcal{S}_{\\mathrm{ok}} \\rvert = \\frac{256 \\times 257}{2} = 32{,}896$$

so the legal fraction is $32{,}896 / 65{,}536 = 0.502$. **Just under half of
the states reachable through public fields are states the class has no defined
behaviour for.** Making the fields private and routing every change through
methods that re-establish $I$ shrinks the reachable set from 65,536 to 32,896
by construction, and does so once, in one file, rather than at every call site.

## 8.3 Worked Example 8B: Why One Careful Caller Is Not Enough

Suppose the fields stay public and every write site is expected to check the
invariant by hand. If each of $k$ write sites is checked correctly with
probability $p$, the probability that the whole program preserves the invariant
is

$$P = p^{\\,k}$$

With a generous $p = 0.98$ and $k = 30$ write sites, $P = 0.98^{30} = 0.545$ —
a coin flip. At $k = 60$ it is 0.297. The exponent is the argument: **manual
discipline degrades geometrically in the number of places it must be applied,
and a compiler-enforced boundary does not degrade at all.**

| Enforcement | Places it must hold | Failure probability at $p = 0.98$ |
|---|---|---|
| Private field, one setter | 1 | 0.020 |
| Public field, 10 write sites | 10 | 0.183 |
| Public field, 30 write sites | 30 | 0.455 |
| Public field, 60 write sites | 60 | 0.702 |

## 8.4 The Access Levels, Restated as Scope of Obligation

Section 5.1 listed the four access modifiers. Read them again as answers to the
question *who is obliged to preserve the invariant*:

| Modifier | Who must preserve $I$ | Size of the obligation |
|---|---|---|
| private | The declaring class only | One file |
| package | Every class in the module | One directory |
| protected | Every subclass, everywhere, forever | Unbounded |
| public | Every caller, everywhere, forever | Unbounded |

Protected is the row people misread. A protected field is very nearly as
exposed as a public one, because a subclass may be written by anyone at any
time, and each new subclass is a new place the invariant can be broken. That is
one concrete strand of the fragile base class problem in the next section.

## 8.5 Getters Are Not Encapsulation

Wrapping every private field in a getter and a setter that do nothing
reproduces a public field with more typing. The test of whether a boundary is
real is whether the class could change how the value is stored without any
caller noticing. A temperature class that stores kelvin and exposes
degreesCelsius passes that test; one that stores celsius and exposes
getCelsius and setCelsius does not, because the setter admits every value the
field admits and the invariant is back in the callers.`,
      examTip: 'Encapsulation exists to make a class invariant enforceable in one place. If you can name the predicate the class maintains, you can say exactly what a public field would cost.',
      importantNote: 'Protected is much closer to public than to private: the obligation to preserve the invariant passes to every subclass ever written, and that set is unbounded. Prefer private fields with protected accessors when an extension point is genuinely needed.',
    },
    { id: 'oop-inherit-compose', title: '9. Inheritance Against Composition, and the Fragile Base Class',
      content: `## 9.1 Two Costs Inheritance Charges

Section 3.2 gave the qualitative comparison. Two of its rows can be turned into
numbers, and both are worth having.

**The first is duplication in the layout.** When a class derives from two bases
that themselves share a base, the shared base appears once for every distinct
path through the inheritance graph. Writing $c(X)$ for the number of copies of
the root inside an instance of $X$:

$$c(X) = \\sum_{B \\,\\in\\, \\mathrm{bases}(X)} c(B), \\qquad c(\\mathrm{root}) = 1$$

**The second is the size of the hierarchy itself.** If a family of objects
varies along $k$ independent axes with $n_i$ options on axis $i$, a hierarchy
that models each combination as its own class needs

$$N_{\\mathrm{sub}} = \\prod_{i=1}^{k} n_i$$

classes, while a design that holds one component per axis needs

$$N_{\\mathrm{parts}} = \\sum_{i=1}^{k} n_i$$

## 9.2 Worked Example 9A: The Diamond, Counted

Class A holds 24 bytes of state. B and C each derive from A, and D derives
from both. Enumerating the paths from D to A gives exactly two, D-B-A and
D-C-A, so $c(D) = 2$ and an instance of D contains
$2 \\times 24 = 48$ bytes of A where the programmer expected 24. Two consequences
follow immediately: an A field written through the B path is not the one read
through the C path, and an upcast from D to A is ambiguous and will not
compile.

Stack a second diamond — E also deriving from B and C, and F deriving from D
and E — and the path enumeration returns four, so $c(F) = 4$. The growth is
the number of distinct routes through the graph, not the number of levels.

**Virtual inheritance** collapses the copies back to one, at the price of an
extra indirection to reach the shared base, because its offset can no longer be
a compile-time constant. Languages that allow only single inheritance of
implementation, plus any number of interfaces, avoid the question entirely:
with one implementation parent there is only ever one path.

The other thing a diamond forces is a **method resolution order** — a total
ordering of the classes searched when a name is looked up. The C3
linearisation, computed for this diamond, is D, B, C, A: the derived class
first, then the bases in declaration order, then the shared root exactly once
and last. That last property is what makes the ordering usable — a base never
precedes something that derives from it.

## 9.3 Worked Example 9B: Class Explosion in a Vehicle Catalogue

A catalogue varies along three independent axes: four body styles, three
drivetrains and five fuel systems. Modelling every combination as a class
requires $4 \\times 3 \\times 5 = 60$ classes, and the enumeration of the
Cartesian product confirms it exactly. Holding one component per axis requires
$4 + 3 + 5 = 12$, a ratio of $60 / 12 = 5$.

![Classes to write against the number of independent axes of variation, on a logarithmic axis, for three options on each axis. Subclasses follow a product and reach 729 at six axes; components follow a sum and reach 18. The worked vehicle case of sixty subclasses against twelve components is marked at three axes.](/courses/fe-ee/figures/sw3-class-explosion.svg)

The ratio $\\prod n_i / \\sum n_i$ is 1.5 at two axes of three, 3 at three
axes, 6.75 at four and 40.5 at six. **The gap is not a matter of taste; it is
the difference between a product and a sum**, and it is the mechanical content
of the advice to favour composition. Adding a sixth fuel system costs one class
under composition and twelve under the hierarchy.

## 9.4 The Fragile Base Class, on a Real Hierarchy

Here is the failure in its smallest honest form. A collection base class offers
two methods:

    class Bag:
        add(item):        store item; count = count + 1
        addAll(items):    for each item in items: add(item)

A subclass wants to count everything ever inserted:

    class CountingBag extends Bag:
        addAll(items):    inserted = inserted + size(items)
                          super.addAll(items)

Insert a list of five items. Bag.addAll calls this.add five times, which is
CountingBag.add — but CountingBag did not override add, so nothing is
double-counted and the tally is 5. Correct.

Now the base class is optimised in a later release. addAll is rewritten to copy
the items in bulk rather than calling add. The subclass still adds 5 for the
batch, and now nothing else counts anything, so the tally is still 5. Also
correct — by luck.

Reverse the subclass instead: override add rather than addAll.

    class CountingBag extends Bag:
        add(item):        inserted = inserted + 1
                          super.add(item)

Under the original base class, addAll calls add five times and the tally is 5.
Under the optimised base class, addAll never calls add and the tally is 0 — the
counter silently stops counting. And a maintainer who, seeing that, defensively
overrides **both** methods gets 5 from the batch plus 5 from the individual
calls: a tally of 10, a 100 per cent error, from a change in a file the
subclass author never saw.

| Base class behaviour | Subclass overrides | Tally for 5 items | Correct? |
|---|---|---|---|
| addAll calls add | add only | 5 | Yes |
| addAll copies in bulk | add only | 0 | No |
| addAll calls add | addAll only | 5 | Yes |
| addAll calls add | add and addAll | 10 | No |

**The defining property of the fault: nothing in the subclass changed, and
nothing in the base class interface changed.** What changed was an internal
implementation detail — whether one public method happens to call another —
which inheritance silently made part of the contract. Composition has no such
failure mode, because a wrapper that holds a Bag and forwards to it sees only
the public methods it calls, never the base class calling itself.

## 9.5 Worked Example 9C: How Likely Is a Break?

Model a base class release as independently endangering each subclass with
probability $q$. Over $d$ subclasses the chance that at least one breaks is

$$P_{\\mathrm{break}} = 1 - (1 - q)^{d}$$

At a modest $q = 0.05$ and $d = 4$ subclasses this is 0.185; at $d = 20$ it is
0.642; at $d = 40$ it is 0.871. This is the quantitative content of the advice
to keep inheritance hierarchies shallow **and narrow**: the exposure grows with
the number of subclasses, and the base class author cannot see any of them.

## 9.6 When Inheritance Is Still Right

| Situation | Use | Because |
|---|---|---|
| A genuine is-a with substitutable behaviour | Inheritance | The subtype passes every test written against the base |
| Shared behaviour across unrelated types | Interface | No implementation is being inherited, so nothing is fragile |
| Reuse of an implementation | Composition | The wrapper depends only on the public interface |
| Varying along several independent axes | Composition | A sum instead of a product |
| Framework extension points | Inheritance, with the protocol documented | The base class states which methods call which |

The last row is the escape hatch. Inheritance is safe when the base class
**documents its self-calls** — states which of its methods are template methods
and which are hooks. What makes the base class fragile is not inheritance but
an undocumented internal protocol.`,
      examTip: 'Count paths, not levels: a base class appears once per distinct path through the inheritance graph, so a diamond gives two copies and stacked diamonds give four. Virtual inheritance collapses them at the cost of an indirection.',
      importantNote: 'The fragile base class fault has a signature: no change to the subclass, no change to the base class interface, and a wrong answer. It happens because inheritance turns which-method-calls-which into part of the contract.',
    },
    { id: 'oop-liskov', title: '10. Liskov Substitution as a Checkable Condition',
      content: `## 10.1 The Condition, Stated So It Can Be Tested

Section 5.3 gave the informal Liskov rule: a subtype must be usable wherever
its base type is. Informal is not checkable. The testable form is three
implications on the contract of every overridden method, plus one on the class
invariant.

**Preconditions may be weakened, never strengthened** — a subtype must accept
everything the base accepted:

$$P_{\\mathrm{base}}  \\Rightarrow  P_{\\mathrm{sub}}$$

**Postconditions may be strengthened, never weakened** — a subtype must promise
at least what the base promised:

$$Q_{\\mathrm{sub}}  \\Rightarrow  Q_{\\mathrm{base}}$$

**The invariant must be preserved**:

$$I_{\\mathrm{sub}}  \\Rightarrow  I_{\\mathrm{base}}$$

The first two point in opposite directions, which is the part worth
memorising. Parameters are **contravariant** and results are **covariant**,
because the caller was written against the base and may pass anything the base
allowed and may rely on anything the base guaranteed.

There is a fourth rule that catches the cases the first three miss. The
**history constraint**: a subtype may not permit state changes that the base
type forbids. A mutable subclass of an immutable base violates substitutability
even though every individual method signature checks out, because a caller
holding the base type reasonably assumes the value it read stays read.

| Element | Base to subtype | Name | Failure looks like |
|---|---|---|---|
| Precondition | May only weaken | Contravariance | The subtype rejects an input the base accepted |
| Postcondition | May only strengthen | Covariance | The subtype returns less than the base promised |
| Invariant | Must be implied | Preservation | The subtype admits a state the base forbids |
| Mutability | May not be added | History constraint | An immutable base gains a mutable subtype |
| Exceptions | May only narrow | Contravariance | The subtype throws something the caller cannot catch |

## 10.2 Worked Example 10A: Violating It on Purpose

Take the rectangle. Its setWidth carries the postcondition that the height is
untouched, so the area afterwards is

$$Q_{\\mathrm{base}}:\\quad A' = w' h$$

where $h$ is the height before the call. Square inherits from Rectangle and
overrides setWidth to keep the sides equal, so its actual postcondition is

$$Q_{\\mathrm{sub}}:\\quad A' = w'^{\\,2}$$

The implication $Q_{\\mathrm{sub}} \\Rightarrow Q_{\\mathrm{base}}$ requires
$w'^{2} = w' h$ for every $w'$, which holds only when $w' = h$. The condition
fails, so the subtype is not substitutable — and this is now a fact, not an
opinion.

Running the two classes bears it out. Starting from a $5 \\times 4$ shape and
calling setWidth(10):

| Receiver | Height before | Area promised | Area delivered | Error |
|---|---|---|---|---|
| Rectangle | 4 | 40 | 40 | 0 |
| Square | 4 | 40 | 100 | 60 |

![Area after setWidth against the requested width, for a shape that starts five by four. The straight line is what the Rectangle base class promises, four times the new width; the curve is what a Square actually delivers, the new width squared. The two cross only where the requested width equals the original height of four.](/courses/fe-ee/figures/sw3-lsp-square.svg)

## 10.3 Worked Example 10B: How Big the Error Gets

The relative error of the subtype against the base promise is

$$\\varepsilon(w') = \\frac{w'^{\\,2} - w' h}{w' h} = \\frac{w'}{h} - 1$$

which is zero at $w' = h$ and grows without bound thereafter. On the $h = 4$
shape: setWidth(4) gives $\\varepsilon = 0$, setWidth(8) gives 1.00,
setWidth(10) gives 1.50 and setWidth(20) gives 4.00.

The first row is the trap. **A test suite that happens to exercise the case
$w' = h$ passes**, and the defect ships. This is the general shape of a Liskov
violation: it is not a crash but a silent disagreement that shows up only on
inputs nobody chose deliberately.

## 10.4 The Repairs

There are exactly three honest fixes, and choosing between them is the exam
question:

| Repair | What it changes | When to use it |
|---|---|---|
| Make the base immutable | Removes setWidth, so there is no postcondition to break | Value-like geometry |
| Break the inheritance link | Square and Rectangle both implement a Shape interface | The behaviours genuinely differ |
| Weaken the base postcondition | Rectangle no longer promises the height is untouched | Almost never; it weakens every existing caller |

The third is listed to be rejected. Weakening a base class contract to
accommodate a subtype fixes the type check by breaking every caller that was
relying on the original promise — the defect is not removed, only moved
somewhere with no compiler to catch it.

## 10.5 Liskov Against the Other Four Letters

Liskov is the principle that makes the others cash out. Open-closed depends on
it: extending a system by adding a subtype is only safe if the subtype
substitutes. Dependency inversion depends on it: depending on an abstraction is
only useful if every implementation honours the abstraction's contract.
Interface segregation is partly a way of achieving it, because a smaller
interface has fewer promises for a subtype to break. **Substitutability is the
property; the other principles are ways of arranging code so that it holds.**`,
      examTip: 'Preconditions weaken and postconditions strengthen going down a hierarchy. If a subtype refuses an input the base accepted, or delivers less than the base promised, it is not substitutable, whatever the vocabulary says.',
      importantNote: 'A Liskov violation is usually silent. Square passes every test that happens to set the width equal to the current height, so the defect survives testing and appears in production on an input nobody thought about.',
    },
    { id: 'oop-coupling', title: '11. Coupling and Cohesion, Measured on Two Designs',
      content: `## 11.1 The Metrics Worth Computing

Coupling and cohesion are usually taught as adjectives. They have definitions
that produce numbers, and the numbers separate designs that the adjectives do
not.

For a module, count the modules it depends on, $C_e$ (efferent), and the
modules that depend on it, $C_a$ (afferent). Then

$$I = \\frac{C_e}{C_a + C_e}$$

is **instability**, running from 0 for a module nothing depends on to 1 for a
module that depends on everything and is depended on by nothing. For a package,
with $N_a$ abstract types out of $N_c$ total,

$$A = \\frac{N_a}{N_c}, \\qquad D = \\lvert A + I - 1 \\rvert$$

$D$ is the distance from the line $A + I = 1$: stable packages should be
abstract, unstable ones concrete, and a large $D$ marks a package that is
either rigid and concrete or abstract and useless.

For a whole system of $n$ modules with $E$ direct dependency edges, the density

$$\\kappa = \\frac{E}{n(n-1)}$$

says how much of the possible coupling has been used. Much more informative is
the **propagation cost**: build the reachability matrix $R$, where $R_{ij} = 1$
when module $i$ depends on module $j$ directly or through any chain, and take

$$\\mathrm{PC} = \\frac{1}{n^{2}} \\sum_{i=1}^{n} \\sum_{j=1}^{n} R_{ij}$$

The number a project manager actually wants is the average count of modules a
change can reach, which is

$$\\bar{r} = n \\cdot \\mathrm{PC}$$

## 11.2 Worked Example 11A: One System, Two Designs

An order-processing system has six modules: ui, order, price, tax, store and
report. Design T lets each module call whatever it needs; design L arranges the
same six into layers. The dependency lists are these:

| Module | Design T depends on | Design L depends on |
|---|---|---|
| ui | order, price, tax, store, report | order |
| order | price, tax, store, report | price, store |
| price | tax, store | tax |
| tax | store | — |
| store | report | — |
| report | order, price, tax, store | store |

Design T has 17 edges out of $6 \\times 5 = 30$ possible, a density of 0.567;
design L has 5, a density of 0.167. Walking the closure from every module — a
breadth-first search per node, not a formula — fills 30 of the 36 cells of $R$
in design T and 9 in design L, so

$$\\mathrm{PC}_{T} = \\frac{30}{36} = 0.833, \\qquad \\mathrm{PC}_{L} = \\frac{9}{36} = 0.25$$

a ratio of $30 / 9 = 3.333$. In operational terms, $\\bar{r}$ is 5.0 modules
for design T and 1.5 for design L: **a change in the tangled design can reach
five of the six modules, and the same change in the layered one reaches one and
a half.**

![Propagation cost as a percentage of ordered module pairs, against the number of modules, for a fully tangled system and for a strict layer chain. The tangled reference sits flat at one hundred per cent because every module lies on a cycle; the chain rises towards fifty per cent. The measured tangled design is marked at 83.3 per cent and the re-layered version of the same system at 25.0 per cent.](/courses/fe-ee/figures/sw3-propagation-cost.svg)

Two rows of the instability table are worth reading. In design T, store has
$C_e = 1$ and $C_a = 5$, so $I = 0.167$ — highly stable, five modules resting
on it, exactly what a storage layer should be. But store also depends on
report, and report depends back on order, which depends on store: there is a
cycle, and it is the cycle that pushes the propagation cost to 83 per cent. In
design L, store has $C_e = 0$ and $C_a = 2$, giving $I = 0$ and no cycle at
all.

## 11.3 Cohesion, and How to Measure It

Cohesion asks the opposite question: do the things inside one module belong
together? Take the class as a bipartite graph of methods and the fields they
touch. Over the $\\binom{m}{2}$ method pairs, let $q$ be the number that share
at least one field and $p$ the number that share none. Then

$$\\mathrm{LCOM} = \\max\\bigl(0,  p - q\\bigr)$$

is high for an incoherent class and zero for a coherent one. A sharper variant,
**LCOM4**, is simply the number of connected components of that graph — which
is to say, the number of classes that are actually hiding inside the one you
wrote.

$$\\mathrm{WMC} = \\sum_{i=1}^{m} c_i$$

completes the picture by weighting each method by its own cyclomatic complexity
$c_i$, so a class of five gnarly methods scores worse than one of five trivial
ones.

## 11.4 Worked Example 11B: Splitting a Class the Metric Chose

A checkout class has seven methods over five fields:

| Method | Fields it touches |
|---|---|
| addItem | items, total |
| removeItem | items, total |
| subtotal | items, total |
| formatHtml | theme, locale |
| formatText | theme, locale |
| openSocket | conn |
| sendReceipt | conn |

There are $\\binom{7}{2} = 21$ method pairs. Enumerating them gives $q = 5$
sharing pairs and $p = 16$ disjoint pairs, so
$\\mathrm{LCOM} = 16 - 5 = 11$. Running a union-find over the same pairs
returns **three** connected components — the cart methods, the formatters and
the mailer — so $\\mathrm{LCOM4} = 3$.

That is not a suggestion to refactor; it is a specification of the refactor.
Split along the components and recompute: each of the three resulting classes
has $p = 0$, so $\\mathrm{LCOM} = 0$ and $\\mathrm{LCOM4} = 1$. The metric
found the seam, and it found it without anyone having an opinion about
single responsibility.

| Class | Methods | $p$ | $q$ | LCOM | LCOM4 |
|---|---|---|---|---|---|
| Original checkout | 7 | 16 | 5 | 11 | 3 |
| Cart | 3 | 0 | 3 | 0 | 1 |
| Formatter | 2 | 0 | 1 | 0 | 1 |
| Mailer | 2 | 0 | 1 | 0 | 1 |

## 11.5 Reading the Numbers Without Being Ruled by Them

These metrics are diagnostics, not targets. A propagation cost of 83 per cent
is a reliable sign that the module boundaries are not doing any work; a
propagation cost of zero would mean the modules never talk, which is not a
system. LCOM4 above one is a reliable sign that a class has more than one
reason to change; LCOM4 of one on a class with forty methods is no evidence of
anything. **Use them to find the places worth looking at, and then look.**`,
      examTip: 'Instability is efferent coupling over total coupling: a module that depends on many and is depended on by none scores 1. Propagation cost is the fraction of module pairs joined by any dependency chain, and it is what a cycle destroys.',
      importantNote: 'LCOM4 counts the connected components of the method-and-field graph, so it names how many classes are hiding inside one. It does not merely say cohesion is low; it says where to cut.',
    },
    { id: 'oop-patterns', title: '12. Patterns, Each With Its Problem Stated First',
      content: `## 12.1 A Pattern Is a Named Answer

A design pattern is only useful if the question comes first. The list below
states the problem, then the answer, then the structural clue an exam question
will show you. Section 3.1 introduced five of these; the treatment here adds
the cost of not using them, which is what makes the choice an engineering
decision rather than a preference.

| Problem | Pattern | Structural clue |
|---|---|---|
| One resource must have exactly one instance | Singleton | Private constructor, static accessor |
| Callers must not name the concrete class they get | Factory method | A creator returning a base type |
| A family of related objects must be built consistently | Abstract factory | A factory interface with several create methods |
| An algorithm must be swappable at run time | Strategy | An interface stored in a field and called |
| Many objects must learn that one object changed | Observer | A subscriber list and a notify loop |
| Behaviour must be added without subclass explosion | Decorator | A wrapper implementing the same interface it holds |
| Two incompatible interfaces must work together | Adapter | A class implementing one interface over another |
| A skeleton is fixed but some steps vary | Template method | A final method calling abstract hooks |
| A huge number of objects share most of their state | Flyweight | An intrinsic state cache keyed by value |
| An expensive or remote object needs a stand-in | Proxy | Same interface, lazy or remote delegate |

## 12.2 Worked Example 12A: What Strategy Saves

An invoicing system supports several discount rules, selected at run time. In
the switch-statement version, the rule is chosen inside a conditional that
appears at $k$ call sites — pricing, quoting, refunding, reporting, and so on.
Adding a rule then costs

$$\\Delta_{\\mathrm{switch}} = k \\ \\text{edited sites}$$

In the strategy version each rule is a class implementing one interface, and
adding a rule costs

$$\\Delta_{\\mathrm{strategy}} = 1 \\ \\text{new file, 0 edited}$$

At $k = 7$ call sites, that is seven opportunities to forget one against zero.
This is the open-closed principle expressed as an edit count, and it is also
where the price is paid: strategy costs one interface, one field, one indirect
call per invocation, and a reader who must open two files to follow one
decision.

## 12.3 Worked Example 12B: Decorator Against Subclassing

Three optional behaviours can be applied in any combination — logging,
caching, compression. Subclassing every combination needs one class per
non-empty subset, which is

$$N_{\\mathrm{sub}} = 2^{k} - 1$$

or 7 classes at $k = 3$ and 31 at $k = 5$. Decorators need $k$ classes, one per
behaviour, and compose at run time to reach all

$$N_{\\mathrm{comb}} = 2^{k}$$

configurations including the bare one. Three wrapper classes cover eight
configurations; five cover thirty-two. The catch, and it is a real one, is that
the stack of wrappers is assembled somewhere the debugger will show as five
identical-looking frames.

## 12.4 Worked Example 12C: Observer Against Polling

Forty components need to know when a shared document changes. Under polling at
frequency $f$, with each check costing $\\tau$ of CPU time,

$$T_{\\mathrm{poll}} = f\\, n\\, \\tau$$

and under a push notification at the actual change rate $r$,

$$T_{\\mathrm{push}} = r\\, n\\, \\tau$$

With $n = 40$, $\\tau = 0.5$ microseconds, $f = 100$ per second and a real
change rate of $r = 3$ per second, polling costs 2.0 milliseconds of CPU per
second and pushing costs 0.06 — a ratio of $100 / 3 = 33.33$. The ratio is
$f / r$ and nothing else, which is the useful form: **observer pays off exactly
in proportion to how much more often you would have asked than the answer
changed.**

## 12.5 Worked Example 12D: Flyweight, and Its Break-Even

A document editor represents each character as an object carrying its glyph
outline. Storing the outline in every character costs

$$M_{\\mathrm{plain}} = N s_i$$

and sharing $u$ distinct glyph objects while each position keeps only a
reference costs

$$M_{\\mathrm{shared}} = N s_e + u\\, s_i$$

With $s_i = 40$ bytes of intrinsic state, $s_e = 8$ bytes per position and
$u = 96$ distinct glyphs, a two-million-character document costs
$2{,}000{,}000 \\times 40 = 80{,}000{,}000$ bytes plainly and
$2{,}000{,}000 \\times 8 + 96 \\times 40 = 16{,}003{,}840$ bytes shared — a
saving of 80.0 per cent.

![Memory against document length in millions of characters, comparing one whole object per character with ninety-six shared glyph objects plus eight bytes per position. At two million characters the plain representation costs eighty megabytes and the shared one sixteen.](/courses/fe-ee/figures/sw3-flyweight-memory.svg)

Setting the two expressions equal gives the break-even length

$$N^{\\ast} = \\frac{u\\, s_i}{s_i - s_e}$$

which is $96 \\times 40 / 32 = 120$ characters. Below that the shared table
costs more than it saves, which is the honest version of the pattern: it is a
memory optimisation with a threshold, not a virtue.

## 12.6 The Two Patterns Most Often Misused

**Singleton** solves "exactly one instance must exist" and is routinely used
for "it is convenient to reach this from anywhere". The second use is a global
variable with extra ceremony: it hides a dependency from every constructor
signature, it makes the object impossible to substitute in a test, and, as
section 3.1 noted, the lazy version is not thread-safe without explicit care.

**Inheritance-as-reuse** is the other. Extending a class purely to get at its
methods is the fragile base class problem of section 9.4 invited in
deliberately. The adapter and decorator patterns exist precisely so that reuse
can be had through a public interface instead.`,
      examTip: 'Identify a pattern from its structural clue: private constructor and static accessor is Singleton, an interface held in a field is Strategy, a wrapper implementing the interface it holds is Decorator, a subscriber list is Observer.',
      importantNote: 'Every pattern has a price. Strategy costs an indirection and a second file; decorator costs debugger frames; flyweight only pays above a break-even length, which is 120 characters in the worked case.',
    },
    { id: 'oop-lifetime', title: '13. Object Lifetime, References and the Aliasing Bug',
      content: `## 13.1 Two Objects or One?

Because a variable of class type holds a reference, the question *how many
objects are there* is not answered by counting variables. Writing
$r \\mapsto o$ for "reference $r$ names object $o$", the number of live names
for an object is

$$\\mathrm{rc}(o) = \\bigl\\lvert \\{\\, r : r \\mapsto o \\,\\} \\bigr\\rvert$$

Two references naming the same object are **aliases**, and every write through
one is visible through the other. This is not a defect in itself — it is how a
shared cache, a parent pointer and a dependency injection all work — but it is
a defect whenever the code was written as though the two were independent.

## 13.2 Worked Example 13A: The Aliasing Defect, Traced

A scheduling class keeps a list of blackout dates and offers a method to hand
them out:

    class Schedule:
        blackouts = [Jan 1, Jul 4]
        getBlackouts():   return blackouts        # returns the reference

A caller does something entirely reasonable:

    dates = schedule.getBlackouts()
    dates.add(Dec 25)                             # meant as a local addition

The list now holds three dates, and so does the schedule, because there is one
list with two names. Every subsequent query against the schedule answers
differently, and nothing in the caller looks like a mutation of the schedule.
Trace the reference count: after the call, $\\mathrm{rc} = 2$; after the add,
still 2, and the object both names point at has changed.

The three repairs, in increasing cost:

| Repair | Cost per call | Protects against |
|---|---|---|
| Return an unmodifiable view | One small wrapper object | Modification through the returned name |
| Return a shallow copy | One list allocation, $n$ reference copies | Structural change, not element mutation |
| Return a deep copy | Every reachable object copied | Everything |

## 13.3 Worked Example 13B: What a Deep Copy Costs

A shallow copy duplicates the top-level object only, so its cost is the machine
word or the one instance:

$$T_{\\mathrm{shallow}} = S$$

A deep copy duplicates everything reachable:

$$T_{\\mathrm{deep}} = \\sum_{o \\,\\in\\, \\mathrm{reach}(x)} S_o$$

For a graph of 5,000 nodes at 48 bytes each, the deep copy moves 240,000 bytes
and the reference copy moves 8. The ratio is $240{,}000 / 8 = 30{,}000$, which
is why "just copy it defensively" is advice with a hidden invoice. **Copy-on-
write** splits the difference: readers share one representation, and the copy
happens on the first write. With twelve readers and no writer, copy-on-write
moves 240,000 bytes once instead of $12 \\times 240{,}000 = 2{,}880{,}000$.

## 13.4 Lifetime: Who Destroys It, and When

| Scheme | Freed when | Cost | Fails on |
|---|---|---|---|
| Manual | The programmer says so | None at run time | Leaks, double frees, use-after-free |
| Scope-bound (RAII) | The owning scope exits | None at run time | Objects outliving any single scope |
| Reference counting | $\\mathrm{rc}(o)$ reaches 0 | An increment and decrement per assignment | Cycles |
| Tracing garbage collection | Unreachable from any root | Periodic pause, extra header word | Nothing, but timing is not the programmer's |

The reference-counting failure is worth constructing. Give object A a field
naming B and object B a field naming A, then drop every external name. Counting
the references that remain: $\\mathrm{rc}(A) = 1$, held by B, and
$\\mathrm{rc}(B) = 1$, held by A. Neither ever reaches zero, and neither is
reachable from anywhere a program could use. **A cycle of two objects leaks
under pure reference counting**, which is why counted schemes add either a
cycle collector or a weak reference — a name that does not contribute to the
count.

## 13.5 Equality Is Two Questions

Aliasing forces a distinction that trips up exam candidates. **Reference
equality** asks whether two names denote the same object; **value equality**
asks whether two objects carry the same data. A language that spells both with
the same operator for objects and with different operators for primitives is
the source of an entire genre of defect.

The contract that must hold whenever value equality is redefined: equal objects
must produce equal hash codes, or every hash-based container will lose them.
Formally, for a hash function $H$,

$$x = y  \\Rightarrow  H(x) = H(y)$$

and the converse is explicitly not required — unequal objects may collide. The
one-way direction is exactly the property a hash table needs, and it is the
direction people forget when they override equality and leave the hash alone.

## 13.6 Immutability Removes the Whole Category

An object whose fields are set once at construction and never changed cannot be
aliased into a defect, because there is no write to be visible through the
other name. It is also free to share: the defensive copy of section 13.3 costs
nothing when there is nothing to defend against. The price is an allocation per
logical change, which is why immutable value types are the default for small
records and mutable ones survive for large buffers.`,
      examTip: 'Assignment of an object variable copies a reference, not the object. Returning an internal collection hands the caller a name for your own state; return an unmodifiable view or a copy instead.',
      importantNote: 'Pure reference counting leaks cycles: two objects naming each other each keep a count of one forever. Tracing collectors do not have this problem because they ask what is reachable from a root, not how many names exist.',
    },
    { id: 'oop-problems-1', title: '14. Problem Set A: Layout, Dispatch and Substitutability',
      content: `## 14.1 Problem Set A

Work each one through before reading the answer. Every number below is
reproducible from the models stated in sections 6 to 10.

**A1.** A class on a 64-bit target has an 8-byte header and declares, in order,
a 1-byte flag, an 8-byte double, a 2-byte short and a 4-byte int. Give the
offsets, the object size and the padding.

*Answer.* Placement from $o_1 = 8$: flag at 8. The double needs a multiple of
8, so it goes at 16, leaving 7 bytes of padding. The short needs a multiple of
2 and lands at 24. The int needs a multiple of 4, so it goes at 28, leaving 2
bytes. It ends at 32, already a multiple of 8, so $S = 32$. Payload is
$1 + 8 + 2 + 4 = 15$ and $P = 32 - 8 - 15 = 9$ bytes.

**A2.** Reorder the same four fields to minimise the object, and state the
saving.

*Answer.* Widest first — double at 8, int at 16, short at 20, flag at 22 —
ends at 23 and rounds up to 24. Padding is $24 - 8 - 15 = 1$ byte, and the
object shrinks from 32 to 24. Across ten million instances that is 80 MB.

**A3.** Using the cycle model of section 7.2, at what body length does a
megamorphic call with a misprediction probability of 0.5 fall below 20 per cent
overhead?

*Answer.* The overhead is $\\Delta + p C_{\\mathrm{miss}} = 10 + 7.5 = 17.5$
cycles. Setting $17.5 / (1 + t_b) = 0.20$ gives $1 + t_b = 87.5$, so
$t_b = 86.5$ and the first integer body length that qualifies is 87 cycles.

**A4.** A class D derives from B and C, both of which derive from A, and A
carries 12 bytes. How many bytes of A does an instance of D contain, with and
without virtual inheritance? What if D also derived from a third class E that
derives from A?

*Answer.* Enumerate paths. Two paths D-B-A and D-C-A give
$2 \\times 12 = 24$ bytes without virtual inheritance and 12 with. Adding E
gives three paths, so $3 \\times 12 = 36$ bytes without and still 12 with.

**A5.** A product varies along four axes with 3, 4, 2 and 6 options. Compare
the class count under a hierarchy with the component count under composition.

*Answer.* $3 \\times 4 \\times 2 \\times 6 = 144$ classes against
$3 + 4 + 2 + 6 = 15$ components, a ratio of 9.6. Adding a fifth option to the
last axis takes the hierarchy to 168 and the composition to 16.

**A6.** A subtype of a Stack overrides push so that it silently discards items
once the stack holds 100. Which Liskov condition does it break, and give the
implication that fails.

*Answer.* The postcondition. The base promises
$Q_{\\mathrm{base}}: \\mathrm{size}' = \\mathrm{size} + 1$ after a push, and
the subtype delivers $\\mathrm{size}' = \\min(\\mathrm{size} + 1, 100)$.
$Q_{\\mathrm{sub}} \\Rightarrow Q_{\\mathrm{base}}$ fails for every state with
size 100, so the subtype is not substitutable. Note that no precondition was
strengthened and no signature changed — the type checker sees nothing.

**A7.** A base class release endangers each subclass independently with
probability 0.04. A framework has 25 published subclasses. What is the chance
at least one breaks, and how many subclasses would give an even chance?

*Answer.* $P = 1 - 0.96^{25} = 0.640$. For an even chance, solve
$0.96^{d} = 0.5$, giving $d = \\ln 0.5 / \\ln 0.96 = 16.98$, so 17 subclasses.

**A8.** A bounded counter has a value and a limit, both 16-bit unsigned, with
the invariant that the value never exceeds the limit. What fraction of the
publicly reachable state space is legal?

*Answer.* The full space is $65{,}536 \\times 65{,}536$ states. The legal
states number $65{,}536 \\times 65{,}537 / 2$, so the legal fraction is
$65{,}537 / 131{,}072 = 0.50000763$ — just over half, and it approaches one
half as the width grows.`,
      examTip: 'For a layout question, walk the fields in declaration order, round each offset up to the field alignment, then round the total up to the largest alignment present. Do not forget the header.',
      importantNote: 'Problem A6 is the shape most Liskov questions take: the signatures match, the compiler is happy, and the postcondition implication fails on a state the tests did not reach.',
    },
    { id: 'oop-problems-2', title: '15. Problem Set B: Coupling, Cohesion, Patterns and Lifetime',
      content: `## 15.1 Problem Set B

**B1.** A module depends on four others and is depended on by one. Give its
instability and say what kind of module the number describes.

*Answer.* $I = 4 / (1 + 4) = 0.8$. It is close to maximally unstable: it
depends on a great deal and almost nothing rests on it, which is the correct
profile for a user interface or an application entry point and the wrong one
for a shared library.

**B2.** A system of eight modules has 14 direct dependency edges. Give the
coupling density. If a closure walk fills 40 of the 64 cells of the
reachability matrix, give the propagation cost and the average number of
modules a change can reach.

*Answer.* $\\kappa = 14 / 56 = 0.25$. The propagation cost is
$40 / 64 = 0.625$ and the average reach is $8 \\times 0.625 = 5$ modules. Note
how far the second number is from the first: only a quarter of the possible
direct edges exist, and a change still reaches five modules in eight, because
reachability compounds along chains.

**B3.** A class has six methods. Four of them touch a shared field; the other
two touch a different shared field and nothing else. Give $p$, $q$, LCOM and
LCOM4.

*Answer.* There are $\\binom{6}{2} = 15$ pairs. Within the group of four,
$\\binom{4}{2} = 6$ pairs share; within the pair, 1 shares; across the groups,
$4 \\times 2 = 8$ pairs share nothing. So $q = 7$, $p = 8$,
$\\mathrm{LCOM} = 8 - 7 = 1$ and $\\mathrm{LCOM4} = 2$. LCOM4 is the more
useful answer: there are two classes here.

**B4.** Four optional behaviours must combine freely. How many decorator
classes are needed, how many configurations do they reach, and how many
subclasses would the same coverage need?

*Answer.* Four decorator classes reach $2^{4} = 16$ configurations including
the undecorated one. Subclassing every non-empty combination needs
$2^{4} - 1 = 15$ classes, and each new behaviour would double that.

**B5.** Sixty observers are notified of a value that changes 5 times a second.
Polling would run at 250 Hz. Each check or notification costs 0.4 microseconds.
Give both CPU costs and the ratio.

*Answer.* $T_{\\mathrm{poll}} = 250 \\times 60 \\times 0.4$ microseconds per
second, which is 6,000 microseconds or 6.0 milliseconds. $T_{\\mathrm{push}}$
is $5 \\times 60 \\times 0.4 = 120$ microseconds. The ratio is
$250 / 5 = 50$, exactly $f / r$, and the observer count cancels.

**B6.** A flyweight scheme has 40 distinct intrinsic objects of 64 bytes and an
extrinsic cost of 12 bytes per position. Find the break-even instance count and
the saving at one million instances.

*Answer.* $N^{\\ast} = 40 \\times 64 / (64 - 12) = 2560 / 52 = 49.23$, so from
50 instances upward the scheme saves memory. At one million instances the plain
form costs 64,000,000 bytes and the shared form
$1{,}000{,}000 \\times 12 + 40 \\times 64 = 12{,}002{,}560$, a saving of 81.2
per cent.

**B7.** Three objects form a reference cycle, X names Y, Y names Z and Z names
X, and no external name remains. Give each reference count and say what happens
under reference counting and under tracing collection.

*Answer.* Each count is 1, held by the previous object in the cycle. Under pure
reference counting none reaches zero and all three leak. Under tracing
collection none is reachable from a root, so all three are collected — the
collector asks a reachability question, not a counting one.

**B8.** A method returns the internal list backing a class. A caller sorts the
returned list in place. State what has happened in terms of reference counts,
and give the cheapest repair that prevents it.

*Answer.* The return created a second name for one list, so
$\\mathrm{rc} = 2$, and the in-place sort mutated the single object both names
denote. The class invariant, if it depended on insertion order, is now broken
with no line in the class having executed. The cheapest repair is an
unmodifiable view: one small wrapper allocation per call, against a shallow
copy at $n$ reference copies or a deep copy at every reachable byte.`,
      examTip: 'Instability, propagation cost, LCOM and the pattern counts are all arithmetic. In the exam, compute rather than judge: the numbers separate designs that the adjectives do not.',
      importantNote: 'In problem B2 the coupling density is 0.25 and the propagation cost is 0.625. Direct coupling always understates exposure, because reachability compounds along chains of dependencies.',
    },
  ],
  keyTakeaways: [
    'Four pillars: encapsulation, inheritance, polymorphism, abstraction.',
    'Inheritance = is-a. Composition = has-a.',
    'Polymorphism: overriding (runtime) vs. overloading (compile-time).',
    'Recursion needs base case; uses O(n) stack. Tail recursion optimizable.',
    'DP = recursion + memoization; exponential -> polynomial.',
    'Functional: pure functions, immutability, map/filter/reduce.',
  ],
},

fee_sdlc: { topicId: 'fee_sdlc', title: 'Software Development Lifecycle', domainWeight: 'Software Development · 3–5%',
  overview: 'SDLC provides structured approaches to building software. Waterfall and Agile represent opposite philosophies. Testing at multiple levels catches defects early. Version control and CI/CD automate workflows.',
  sections: [
    { id: 'sdlc-models', title: '1. SDLC Models',
      content: `## 1.1 Waterfall

Sequential: Requirements -> Design -> Code -> Test -> Deploy -> Maintain.

| Pro | Con |
|---|---|
| Clear milestones | Late error detection |
| Easy to manage | Inflexible to changes |

## 1.2 Agile / Scrum

Iterative sprints (1-4 weeks): plan -> develop -> review -> retro.

| Pro | Con |
|---|---|
| Rapid feedback | Scope creep risk |
| Adaptable | Needs discipline |

## 1.3 Other Models

| Model | Key Feature |
|---|---|
| **V-Model** | Each dev phase has test phase |
| **Spiral** | Risk-driven iterations |
| **DevOps** | Continuous dev + ops integration |`,
      examTip: 'Waterfall = sequential, plan-heavy. Agile = iterative, feedback-driven. If requirements are changing, choose Agile.',
    },
    { id: 'sdlc-testing', title: '2. Testing, VCS, CI/CD',
      content: `## 2.1 Testing Levels

| Level | Tests | Who |
|---|---|---|
| **Unit** | Functions | Developers |
| **Integration** | Components | Dev/QA |
| **System** | Full system | QA |
| **Acceptance** | User requirements | Customer |

Bug cost: unit ~1x, integration ~10x, production ~100x.

- **TDD**: write tests before code
- **Black-box**: test inputs/outputs
- **White-box**: test code structure

## 2.2 Version Control (Git)

commit (snapshot), branch (parallel), merge (combine), pull request (review).

## 2.3 CI/CD

- **CI**: auto build + test on every commit
- **CD**: auto prepare/deploy releases

Reduces integration risk and human error.`,
      examTip: 'Testing: unit -> integration -> system -> acceptance. Earlier = cheaper. TDD and CI are best practices.',
      importantNote: 'Merge conflict: two branches modify same lines. Git cannot auto-resolve -- developer must manually choose.',
    },
    { id: 'sdlc-exam', title: '3. Software Engineering Scenarios',
      content: `## 3.1 Choose Agile vs Waterfall for Given Project

| Project Characteristic | Best Model | Reasoning |
|---|---|---|
| Fixed requirements, regulatory compliance | **Waterfall** | Clear milestones, documentation |
| Evolving requirements, customer feedback needed | **Agile** | Iterative, adaptable |
| Safety-critical system (medical device) | **V-Model** (Waterfall variant) | Rigorous testing at each phase |
| High-risk, unclear requirements | **Spiral** | Risk analysis each iteration |
| Startup MVP, time-to-market critical | **Agile** | Ship fast, iterate |
| Government contract, detailed spec | **Waterfall** | Contractual milestones |

**Decision rule**: If requirements are stable and complete -> Waterfall. If requirements will change -> Agile. If high risk -> Spiral.

## 3.2 Test Coverage: Statement vs Branch vs Path

| Coverage Type | What It Measures | Strength |
|---|---|---|
| **Statement** | Every line executed at least once | Weakest |
| **Branch** | Every true/false decision taken | Moderate |
| **Path** | Every possible execution path | Strongest (often infeasible) |

**Example**: if (A) { x(); } if (B) { y(); }
- **Statements**: **1 test case** — a single run with A=true, B=true executes both x() and y()
- **Branches**: 2 test cases (TT and FF) — every decision must go both ways
- **Paths**: 4 paths (TT, TF, FT, FF) -> 4 test cases

**Path explosion**: n sequential if-statements create 2^n paths. For 20 branches: ~10^6 paths. This is why path coverage is impractical for large programs.

## 3.3 Defect Cost Multiplier at Each SDLC Phase

| Phase Found | Relative Cost | Example |
|---|---|---|
| Requirements | **1x** | Fix spec document |
| Design | **5x** | Redesign architecture |
| Coding | **10x** | Rewrite module |
| Testing | **20x** | Fix + retest + regression |
| **Production** | **100-1000x** | Patch + deploy + customer impact |

**Key insight**: A bug found in production costs **100x or more** compared to finding it during requirements. This is the fundamental motivation for:
- **TDD**: write tests before code (catches bugs at coding phase)
- **Code reviews**: catch design flaws before testing
- **CI/CD**: automated testing catches regressions immediately

**Exam strategy**: For model selection, map project characteristics to model strengths. Stable requirements = Waterfall. Changing requirements = Agile. For testing, remember the hierarchy: statement < branch < path coverage. The cost multiplier (1x -> 100x) motivates shift-left testing.`,
      examTip: 'The cost multiplier from requirements to production (1x to 100x) is the most-cited SDLC metric on the FE exam. "Shift left" = find bugs earlier = cheaper.',
      importantNote: 'Agile does NOT mean no planning or documentation. It means adaptive planning with working software as the primary deliverable. Scrum ceremonies (sprint planning, retrospective) provide structure.',
    },
    { id: 'sdlc-cyclomatic', title: '4. Cyclomatic Complexity and Planning the Test Set',
      content: `## 4.1 The Control-Flow Graph

McCabe's cyclomatic complexity measures how many independent ways control can
flow through a routine. It is computed from the routine's **control-flow
graph**, in which each node is a straight-line block of statements and each
edge is a possible transfer of control.

Take this routine:

    1  read x
    2  while x > 0:
    3      if x is even:
    4          halve x
           else:
    5          decrement x
    6      continue the loop
    7  print done

| Node | Represents | Edges out |
|---|---|---|
| 1 | read x | to 2 |
| 2 | loop test | to 3 (enter), to 7 (exit) |
| 3 | parity test | to 4, to 5 |
| 4 | halve | to 6 |
| 5 | decrement | to 6 |
| 6 | end of loop body | back to 2 |
| 7 | print done | none |

Counting: **N = 7 nodes, E = 8 edges, P = 1** connected component.

## 4.2 Three Formulas, One Answer

**$V(G) = E - N + 2P$**

For this graph: V(G) = 8 − 7 + 2(1) = **3**.

Two equivalent forms are faster in practice and give the same number:

| Form | Calculation here | Result |
|---|---|---|
| V(G) = E − N + 2P | 8 − 7 + 2 | 3 |
| V(G) = decisions + 1 | 2 decision nodes (the while and the if) + 1 | 3 |
| V(G) = closed regions in a planar drawing + 1 | 2 enclosed regions + 1 | 3 |

The middle form is the one to use under time pressure. **Count the decision
points and add one**, where a decision point is any if, while, for, case label,
or short-circuit boolean operator. A compound condition of the form
**if A and B** counts as **two** decisions, because the short-circuit creates
two independent branch outcomes.

## 4.3 What the Number Is For

V(G) has two operational meanings and both are examinable:

1. It is the size of a **basis set** — the minimum number of linearly
   independent paths that together cover every edge in the graph. Testing V(G)
   paths guarantees branch coverage.
2. It is a **risk indicator**. The bands published by the SEI:

| V(G) | Assessment |
|---|---|
| 1–10 | Simple, low risk |
| 11–20 | Moderate complexity |
| 21–50 | Complex, high risk |
| Over 50 | Untestable, very high risk |

A routine at V(G) = 60 is not merely hard to read; it needs at least 60
independent test cases to reach branch coverage, which is why the usual remedy
is to extract methods until each piece falls back into single digits.

## 4.4 Basis Paths Against Total Paths

The crucial distinction — and the reason basis-path testing exists — is that
V(G) grows **linearly** with the decision count while the number of distinct
execution paths grows **exponentially**:

![Test cases demanded by three coverage criteria against the number of independent binary decisions in a routine, on a logarithmic axis. Branch coverage stays flat at two, the basis set grows linearly as d plus one, and enumerating every path grows as two to the d, reaching 1,048,576 at twenty decisions.](/courses/fe-ee/figures/swe-coverage-paths.svg)

| Decisions d | Statement coverage | Branch coverage | Basis set V(G) | Every path 2^d |
|---|---|---|---|---|
| 1 | 1 | 2 | 2 | 2 |
| 5 | 1 | 2 | 6 | 32 |
| 10 | 1 | 2 | 11 | 1,024 |
| 20 | 1 | 2 | **21** | **1,048,576** |

Twenty decisions is an unremarkable routine — a validation function with twenty
checks. Exhaustive path testing would need over a million cases; the basis set
needs twenty-one. That is the trade basis-path testing makes: it guarantees
every statement and every branch is exercised, and it does not guarantee that
every *combination* of branches is, which is where the residual defects live.

Note also the flat line at the bottom. **Statement coverage stays at one test
case however many decisions there are**, provided one input happens to take
every "true" arm. That is why 100 % statement coverage is a weak claim and
100 % branch coverage is a meaningful one.`,
      examTip: 'V(G) = E - N + 2P, and equivalently decisions + 1. Count if, while, for, each case label, and each && or || separately — a compound condition contributes one decision per operator.',
      importantNote: 'Cyclomatic complexity counts the basis set, which grows linearly with decisions; the number of distinct execution paths grows as 2^d. A routine with 20 decisions needs 21 basis paths but has 1,048,576 path combinations.',
    },
    { id: 'sdlc-vv', title: '5. Verification, Configuration Management, and Release Metrics',
      content: `## 5.1 Verification Is Not Validation

Two words that sound interchangeable and are examined precisely:

| Term | Question it answers | Typical activity |
|---|---|---|
| **Verification** | Are we building the product **right**? | Reviews, inspections, unit and integration tests against the specification |
| **Validation** | Are we building the **right** product? | Acceptance testing, user trials, operational evaluation |

A system can pass verification completely and fail validation: it implements
the specification faithfully, and the specification was wrong. That is why the
V-model pairs each development phase with a test phase at the same level of
abstraction:

| Development phase | Paired test phase | Verifies or validates |
|---|---|---|
| Requirements | Acceptance testing | **Validation** |
| System design | System testing | Verification |
| Architectural design | Integration testing | Verification |
| Module design | Unit testing | Verification |
| Implementation | (the base of the V) | — |

The pairing is the entire content of the V-model, and it explains why
acceptance criteria must be written **during** requirements rather than after
coding: the test that validates a requirement is designed at the moment the
requirement is.

## 5.2 Test Types Beyond the Levels

| Type | Purpose | When |
|---|---|---|
| **Regression** | Confirm that a change broke nothing that used to work | Every build |
| **Smoke** | Confirm the build is worth testing at all | Immediately after build |
| **Load / stress** | Behaviour at and beyond design capacity | Before release |
| **Alpha** | Testing by internal staff | Pre-release |
| **Beta** | Testing by real users in their own environment | Pre-release |
| **Boundary value** | Values at, just inside, and just outside a limit | Test design technique |
| **Equivalence partitioning** | One representative per class of equivalent inputs | Test design technique |

The last two are test **design** techniques rather than phases, and they are
what makes a test set small without making it weak. For an input valid over
1 to 100, equivalence partitioning gives three classes (below, within, above)
and boundary-value analysis adds the values 0, 1, 100 and 101 — because
off-by-one errors cluster at limits and nowhere else.

## 5.3 Version Control and Configuration Management

| Concept | Meaning |
|---|---|
| Repository | The complete history of every tracked file |
| Commit | An immutable snapshot with a parent, an author and a message |
| Branch | A named line of development, cheap to create |
| Merge | Combining two lines; conflicts arise when both edited the same lines |
| Tag | A permanent name for one commit, normally a release |
| Baseline | A formally reviewed configuration that changes only through change control |

**Semantic versioning** puts meaning in the release number as MAJOR.MINOR.PATCH:

| Change | Increment | Example |
|---|---|---|
| Breaking change to the interface | MAJOR | 2.4.1 → 3.0.0 |
| Backward-compatible new feature | MINOR | 2.4.1 → 2.5.0 |
| Backward-compatible bug fix | PATCH | 2.4.1 → 2.4.2 |

A consumer can then upgrade a PATCH release without reading the notes and must
read them for a MAJOR one — the number is a contract, not decoration.

## 5.4 Two Metrics That Support the Cost Argument

Section 3.3 argued that finding defects early is cheaper. Two quantities let
the argument be made numerically rather than rhetorically.

**Defect density** = defects found ÷ thousands of lines of code:

| Release | Size | Defects found | Density |
|---|---|---|---|
| Legacy module | 120 KLOC | 540 | 4.50 per KLOC |
| After refactoring and test hardening | 120 KLOC | 96 | 0.80 per KLOC |

Applying the improved density to a new 250 KLOC release predicts
250 × 0.8 = **200 defects**. Distributing them across a phase-removal profile
shows where the shift-left effort pays:

| Removal stage | Share removed | Defects |
|---|---|---|
| Design and code review | 55 % | 110 |
| Unit test | 25 % | 50 |
| Integration test | 12 % | 24 |
| System test | 5 % | 10 |
| **Escaping to production** | **3 %** | **6** |

Six field defects at the 100× cost multiplier cost as much as 600 caught at
review. Halving the review's effectiveness — moving 55 % to 27.5 % and leaving
every later stage working exactly as hard as before — raises escapes from 6 to
9.667, a factor of **1.611**, and raises the total defect cost by a factor of
**1.524**. Section 11.3 recovers the per-stage efficiencies these counts imply
and computes both figures; the point they make is that a multi-stage process is
partly self-correcting, because the stages downstream of a weakened one simply
receive more work and remove most of it.

**Availability** closes the loop with the operations side:

**$A = \\dfrac{\\mathrm{MTTF}}{\\mathrm{MTTF} + \\mathrm{MTTR}}$**

A service with MTTF 720 hours and MTTR 2 hours achieves
720/722 = **99.72 %**, or about 24 hours of downtime a year. Cutting MTTR to
one hour by automating rollback gives 99.86 % and halves the downtime without
fixing a single additional defect — the operational counterpart of shifting
left, and the reason CI/CD pipelines are judged on how fast they can revert as
well as how fast they can deploy.`,
      examTip: 'Verification asks "did we build it right" (against the spec); validation asks "did we build the right thing" (against the need). In the V-model only acceptance testing is validation — every other level is verification.',
      importantNote: 'Semantic versioning MAJOR.MINOR.PATCH is a compatibility contract: MAJOR breaks the interface, MINOR adds compatibly, PATCH fixes compatibly. Availability = MTTF/(MTTF+MTTR), so halving repair time improves uptime as much as doubling time-between-failures.',
    },
    { id: 'sdlc-phases-cost', title: '6. The Phases, Their Products, and the Cost-of-Change Curve',
      content: `## 6.1 What Each Phase Is Obliged to Hand Over

A lifecycle model is a schedule of **artefacts**, not a mood. Whatever the
model, the same products have to exist before the next activity can start, and
naming them is what makes a phase reviewable:

| Phase | Product handed over | The question it settles |
|---|---|---|
| Concept and feasibility | Business case, constraint list | Is this worth building at all |
| Requirements | Specification, acceptance criteria | What must be true when we are finished |
| Architecture | Component and interface definitions | Who owns which decision |
| Detailed design | Module specifications, data model | How each component meets its part |
| Implementation | Source, unit tests, build scripts | Does the code exist and compile |
| Integration | An assembled system, interface tests | Do the parts fit |
| Verification | Test reports against the specification | Was it built right |
| Validation | Acceptance evidence against the need | Was the right thing built |
| Release | Baselined configuration, release notes | Exactly what is being shipped |
| Operation and maintenance | Change requests, defect reports, patches | What has been learned in service |

Waterfall runs those rows once, top to bottom. Iterative and agile methods run
a subset of them repeatedly over a smaller scope. **The rows do not disappear
in an iterative model; they get shorter and more frequent.** An agile team that
skips acceptance criteria has not removed a phase, it has removed a product,
and the cost of that shows up in section 7.

## 6.2 The Cost of a Change, as a Model Rather Than a Slogan

Section 3.3 quoted the familiar band of multipliers — roughly 1 at
requirements rising to 100 or more in production. Those figures are **model
parameters** drawn from Boehm's cost-of-change data as it is usually reported,
and they should be treated as a calibration rather than a measurement of any
particular project. What they let us do is build a model and then compute with
it rather than gesture at it.

Take the driver of cost to be the **elapsed time between the decision that
caused the defect and the test that caught it**. Calibrate a geometric law so
that a defect surviving a whole project of length $T$ costs $m$ times what it
would have cost immediately:

$$k(\\Delta) = m^{\\,\\Delta/T}$$

With the quoted end point $m = 100$ and a project of $T = 20$ months, a change
caught after $\\Delta = 0$ costs 1, after 3 months costs 1.9953, after 8 months
costs 6.310, and after 16.5 months costs 44.668.

## 6.3 Worked Example 6A: Waterfall Against Iterative, Priced

A 20-month project absorbs 30 changes. Under a single waterfall pass, the
requirements are written across the first three months (mean month 1.5) and
system test runs over the last four (mean month 18), so the mean detection
delay is $18 - 1.5 = 16.5$ months and each change is priced at
$k(16.5) = 44.668$.

Under iterations of length $L$, a change is caught within the same iteration,
so the delay is at most $L - 1$ months. At $L = 4$ the multiplier is
$k(3) = 1.9953$, and the ratio of the two regimes is
$44.668 / 1.9953 = 22.39$.

Iterating is not free. Each iteration costs a fixed overhead $\\omega$ for
planning, regression and release, and there are $T/L$ of them, so the total
cost over the project is

$$C(L) = \\frac{T}{L}\\,\\omega + n\\,m^{(L-1)/T}$$

With $n = 30$ changes and $\\omega = 6$ cost units per iteration:

| Iteration length $L$ | Iteration overhead | Cost of change | Total |
|---|---|---|---|
| 1 month | 120.00 | 30.00 | 150.00 |
| 2 months | 60.00 | 37.77 | 97.77 |
| **3 months** | **40.00** | **47.55** | **87.55** |
| 4 months | 30.00 | 59.86 | 89.86 |
| 5 months | 24.00 | 75.36 | 99.36 |
| 8 months | 15.00 | 150.36 | 165.36 |
| 10 months | 12.00 | 238.30 | 250.30 |
| 20 months (one pass) | 6.00 | 2,382.98 | 2,388.98 |

![Total project cost against iteration length on a logarithmic axis, split into per-iteration overhead falling as one over the length, cost of change rising geometrically with it, and their sum. The sum has a clear minimum at three months and rises to 2,389 units for a single twenty-month pass.](/courses/fe-ee/figures/sw3-cost-of-change.svg)

Three readings follow, and only the first is the one usually stated.

1. The single-pass column is 27.29 times the optimum:
   $2{,}388.98 / 87.55 = 27.29$. Almost all of that excess is rework, not work.
2. **There is a minimum, and it is not at zero.** Iterating weekly costs 150
   units here, more than iterating quarterly, because the overhead term
   dominates. Agile is not the claim that shorter is always better; it is the
   claim that the optimum is much shorter than a waterfall.
3. The curve is flat near its base — 87.55 at three months against 89.86 at
   four. **Getting the iteration length roughly right matters; getting it
   exactly right does not.**

## 6.4 Where the Models Actually Differ

| | Waterfall | V-model | Spiral | Iterative or agile |
|---|---|---|---|---|
| Phase order | Once, sequential | Once, each phase paired with a test | Repeated risk-driven loops | Repeated full loops over a slice |
| Requirements assumed | Complete and stable | Complete and stable | Discovered by risk analysis | Discovered by delivery |
| Feedback arrives | At system test | At the paired test level | At each loop | At each iteration |
| Contract shape | Fixed scope, fixed price | Fixed scope with staged evidence | Staged funding by risk | Fixed cadence, variable scope |
| Effective $\\Delta$ | The project | The phase distance | The loop | The iteration |

The last row is the whole comparison in one line. **What a lifecycle model
really chooses is the value of $\\Delta$ in the cost equation of section 6.2.**
Every other difference between the models follows from that choice.

## 6.5 When Waterfall Is the Correct Answer

The arithmetic above assumes changes arrive. Where they do not — a
re-implementation of a fully specified protocol, a regulated device whose
requirements are frozen by an approval authority, a subcontract whose interface
is fixed by treaty — the cost-of-change term is small and the iteration
overhead is pure loss. That is a real regime, and it is why the exam answer is
never simply "agile".`,
      examTip: 'A lifecycle model is a choice about how long a defect survives before something catches it. Compute the cost with k = m raised to the delay over the project length, and the comparison stops being a matter of opinion.',
      importantNote: 'The total-cost curve has a minimum, not a monotone slope. Iterating weekly in the worked model costs 150 units against 87.55 at three months, because per-iteration overhead dominates when iterations are very short.',
    },
    { id: 'sdlc-requirements', title: '7. Requirements Engineering: Ambiguity Has a Price',
      content: `## 7.1 What Makes a Requirement Testable

A requirement is a claim about the finished system that someone must later be
able to confirm or refute. Four properties make that possible, and a
requirement failing any of them is a defect in the specification:

| Property | Test for it | Failure looks like |
|---|---|---|
| Unambiguous | Two competent readers agree on the meaning | "The system shall respond quickly" |
| Verifiable | A finite procedure decides it | "The interface shall be intuitive" |
| Complete | No case is silently unhandled | Nothing said about an empty input |
| Consistent | No other requirement contradicts it | Two clauses, two different timeouts |
| Traceable | It has an identity carried into design and test | A paragraph with no number |

## 7.2 Worked Example 7A: Counting the Readings of One Sentence

Take a sentence that would pass a casual review:

    The system shall alert the operator and log the event if a sensor
    reading exceeds the limit or the checksum fails.

Three independent ambiguities are present. Does *and* bind tighter than *if*,
so is the logging conditional? Does *or* scope over both clauses or only the
second? Does *the limit* mean the per-sensor limit or the global one? With each
choice binary, the number of consistent readings is

$$N_{\\mathrm{read}} = \\prod_{j=1}^{3} a_j = 2^{3} = 8$$

Eight implementable systems, all faithful to the sentence, only one of which is
wanted. The rewrite that removes them is longer and duller, and that is the
point:

    R-114. When a sensor reading exceeds that sensor's configured limit,
           the system shall write an event record within 200 ms.
    R-115. When a checksum verification fails, the system shall write an
           event record within 200 ms.
    R-116. On writing any event record, the system shall raise an operator
           alert within 1 s.

## 7.3 Worked Example 7B: Ambiguity Across a Whole Specification

A specification has $r = 40$ requirements. Let $p$ be the probability that one
requirement is read as intended. Treating the readings as independent, the
probability the whole specification is implemented as meant is

$$P_{\\mathrm{clean}} = p^{\\,r}$$

and the expected number misread is

$$E[w] = r\\,(1 - p)$$

| $p$ | $P_{\\mathrm{clean}}$ | Expected misreadings |
|---|---|---|
| 0.99 | 0.6690 | 0.4 |
| 0.97 | 0.2957 | 1.2 |
| 0.95 | 0.1285 | 2.0 |
| 0.90 | 0.0148 | 4.0 |

At a very respectable 95 per cent per requirement, the chance of getting a
40-requirement specification entirely right is 12.85 per cent, and
$40 \\times 0.05 = 2$ requirements are expected to be wrong. Those two are not
free. Caught at the requirements review they cost 2 units on the scale of
section 3.3; caught during coding they cost $2 \\times 10 = 20$; caught in the
field they cost 200.

$$C_{\\mathrm{rework}} = E[w]\\,\\kappa_{\\mathrm{phase}}$$

**The argument for spending a week on a requirements review is not that reviews
are virtuous. It is that the review costs less than 18 units of rework, and the
model says the exposure is 200.**

## 7.4 Functional and Non-Functional, and Why the Second Bites

| Kind | Asks | Example | Why it is missed |
|---|---|---|---|
| Functional | What shall it do | Compute the tariff for a meter reading | Visible in every demonstration |
| Performance | How fast, how many | 500 readings per second at the 99th percentile | Only visible under load |
| Reliability | How often may it fail | Mean time to failure of 720 hours | Only visible over time |
| Security | What must it refuse | Reject an unsigned firmware image | Only visible under attack |
| Maintainability | How cheaply may it change | A new tariff added without a release | Only visible years later |

Non-functional requirements are the ones that are cheap to state and expensive
to retrofit, because they constrain the architecture rather than a module. A
throughput requirement discovered after integration is not a defect in a
function; it is a defect in the choice of where the boundaries went, and the
cost multiplier that applies to it is the architectural one.

## 7.5 Traceability, and What It Is For

A traceability matrix maps every requirement to the design elements that
implement it and the tests that verify it. Two questions it answers that
nothing else does: **which requirements have no test** (a coverage gap) and
**which code exists for no requirement** (scope that nobody asked for). Both
are cheap to find with the matrix and nearly impossible without it.

| Requirement | Design element | Test case | Status |
|---|---|---|---|
| R-114 | EventWriter | T-31, T-32 | Verified |
| R-115 | EventWriter | T-33 | Verified |
| R-116 | AlertService | — | **No test** |

The third row is the whole value of the table: it is a defect found by looking
at a list, at a cost of 1 on the section 3.3 scale.`,
      examTip: 'A requirement that cannot be tested is not a requirement. If you cannot write the pass or fail procedure in one sentence, the requirement is still ambiguous.',
      importantNote: 'At 95 per cent per-requirement accuracy, a 40-requirement specification has only a 12.85 per cent chance of being entirely right, and two requirements are expected to be wrong. That is the arithmetic that pays for a requirements review.',
    },
    { id: 'sdlc-estimation', title: '8. Estimation: A COCOMO Model Worked End to End',
      content: `## 8.1 The Basic Model

Boehm's Constructive Cost Model estimates effort from size. Its published basic
form is

$$E = a\\,K^{\\,b}$$

where $E$ is effort in person-months and $K$ is thousands of delivered source
instructions, with a companion schedule equation

$$T_d = c\\,E^{\\,d}$$

and an implied average staffing level

$$N = \\frac{E}{T_d}$$

The four coefficients are model parameters, published by Boehm for three
development modes and used here exactly as published:

| Mode | $a$ | $b$ | $c$ | $d$ | Typical setting |
|---|---|---|---|---|---|
| Organic | 2.4 | 1.05 | 2.5 | 0.38 | A small experienced team, familiar problem |
| Semi-detached | 3.0 | 1.12 | 2.5 | 0.35 | Mixed experience, medium constraints |
| Embedded | 3.6 | 1.20 | 2.5 | 0.32 | Tight hardware, regulatory or interface constraints |

The exponent $b$ exceeding 1 is the substantive claim: **effort grows faster
than size**, so two projects of half the size are cheaper than one of the whole.

## 8.2 Worked Example 8A: 42 KLOC, Three Modes

A substation monitoring product is estimated at 42 KLOC. Evaluating all three
rows:

| Mode | Effort (person-months) | Schedule (months) | Average staff | Productivity (LOC per person-month) |
|---|---|---|---|---|
| Organic | 121.51 | 15.49 | 7.84 | 345.6 |
| Semi-detached | 197.32 | 15.89 | 12.41 | 212.9 |
| Embedded | 319.30 | 15.82 | 20.18 | 131.5 |

![Effort in person-months against programme size in KLOC on logarithmic axes for the three basic COCOMO modes. All three are straight lines of slope greater than one, with embedded above semi-detached above organic, and the worked case of 42 KLOC semi-detached marked at 197.3 person-months.](/courses/fe-ee/figures/sw3-cocomo-effort.svg)

Take the middle row as the estimate. Average staffing is the effort divided by
the schedule, 12.41 people, and at a fully burdened 12,000 per person-month the
labour cost is $197.32 \\times 12{,}000 = 2{,}367{,}840$.

The column that repays study is the last one. Productivity is not a constant of
the organisation; it falls from 345.6 to 131.5 lines per person-month purely
because of which row the project sits in. **Quoting a productivity figure
without naming the mode is quoting nothing.**

Notice too that the schedule column barely moves — 15.49, 15.89 and 15.82
months for efforts differing by a factor of 2.6. The model is saying that
harder projects are staffed up rather than stretched out, which is both what
organisations do and, as section 9 shows, a large part of why they struggle.

## 8.3 Worked Example 8B: What Doubling the Code Does

Doubling the size multiplies effort by

$$\\frac{E(2K)}{E(K)} = 2^{\\,b}$$

which for semi-detached is 2.1735. Explicitly, 84 KLOC gives 428.86
person-months against 197.32, and $428.86 / 197.32 = 2.173$. Productivity falls
from 212.9 to 195.9 lines per person-month — the same team writing the same
code more slowly, because there is more of everything else.

The local sensitivity is cleaner still. Since

$$\\frac{\\mathrm{d}\\ln E}{\\mathrm{d}\\ln K} = b$$

a 10 per cent size overrun costs $1.10^{1.12} = 1.1127$, or 11.3 per cent more
effort, and the linear estimate $1 + 0.10 \\times 1.12 = 1.112$ agrees to
within a tenth of a per cent. **The elasticity is the exponent**, which makes
$b$ the single number worth arguing about in any estimate.

## 8.4 Worked Example 8C: Cost Drivers and Their Swing

Intermediate COCOMO multiplies the nominal effort by an effort adjustment
factor, the product of fifteen rated cost drivers:

$$E = a\\,K^{\\,b} \\prod_{i=1}^{15} c_i$$

Rating four drivers away from nominal on this project:

| Driver | Rating | Multiplier |
|---|---|---|
| Required software reliability | High | 1.15 |
| Product complexity | High | 1.15 |
| Analyst capability | High | 0.86 |
| Use of software tools | Low | 1.10 |
| All others | Nominal | 1.00 |

$$\\mathrm{EAF} = 1.15 \\times 1.15 \\times 0.86 \\times 1.10 = 1.2511$$

so the adjusted estimate is 246.86 person-months against a nominal 197.32.

Now the sensitivity that matters for planning. Suppose the strong analysts are
not available and that driver is re-rated from high (0.86) to very low (1.46).
The estimate becomes 419.08 person-months, a factor of
$1.46 / 0.86 = 1.698$. **One personnel driver moves the estimate by 70 per
cent — more than the difference between organic and semi-detached.** That is
the model's most useful message: in a size-driven estimate, the largest single
lever is who is on the team.

## 8.5 The Schedule Floor

COCOMO carries a compression limit: schedules below about 75 per cent of the
nominal $T_d$ are not achievable by adding people. On this project the nominal
is 15.89 months, the floor is $0.75 \\times 15.89 = 11.92$ months, and holding
the effort constant the staffing needed at the floor is
$197.32 / 11.92 = 16.55$ people against 12.41.

$$T_{\\min} = 0.75\\,T_d$$

Asking for a 9-month delivery of this scope is therefore not an aggressive
target; under the model it is outside the feasible region, and the honest
response is to cut scope rather than to promise the date. The reason it is
outside is the subject of the next section.`,
      examTip: 'Basic COCOMO is E = a K^b with b greater than 1, so effort is superlinear in size. Learn the three coefficient rows, and remember that the schedule equation gives a duration, from which staffing is effort divided by duration.',
      importantNote: 'Re-rating a single personnel cost driver from high to very low multiplies the estimate by 1.698 in the worked case. Size sets the scale of an estimate; the cost drivers decide whether it is right.',
    },
    { id: 'sdlc-team', title: '9. Team Size and the Communication Penalty',
      content: `## 9.1 Why Adding People Stops Working

The schedule floor in section 8.5 is not an arbitrary constant. Its cause is
countable. A team of $n$ people has

$$L = \\binom{n}{2} = \\frac{n(n-1)}{2}$$

distinct pairs who may need to agree about something, and this is one of the
few quantities in the chapter that can be verified simply by listing them:

| Team size $n$ | Communication pairs $L$ | Pairs added by one more person |
|---|---|---|
| 3 | 3 | 3 |
| 5 | 10 | 5 |
| 8 | 28 | 8 |
| 12 | 66 | 12 |
| 20 | 190 | 20 |

The right-hand column is the mechanism: the $n$-th person adds $n - 1$ new
relationships, so the coordination load grows quadratically while the
productive capacity grows linearly.

## 9.2 Worked Example 9A: An Output Model With a Peak

Give each person $\\alpha$ units of output and charge each communication pair
$\\beta$ units of overhead. Net output is

$$O(n) = \\alpha n - \\beta\\,\\frac{n(n-1)}{2}$$

Differentiating and setting to zero gives the optimum

$$n^{\\ast} = \\frac{\\alpha}{\\beta} + \\frac{1}{2}$$

Take $\\alpha = 1$ and $\\beta = 0.12$, meaning each pairwise relationship costs
about an eighth of one person's output. Then
$1 / 0.12 + 0.5 = 8.83$, and scanning integer team sizes confirms the peak:

| $n$ | $O(n)$ |
|---|---|
| 5 | 3.800 |
| 8 | 4.640 |
| **9** | **4.680** |
| 10 | 4.600 |
| 15 | 2.400 |
| 20 | -2.800 |

At $n = 9$, $9 - 0.12 \\times 36 = 4.68$. At $n = 20$ the coordination charge
exceeds the whole team's output and the net contribution is negative.

**The value of $\\beta$ is a modelling choice and not a measurement**, and the
peak moves with it: $\\beta = 0.20$ puts the optimum at 5.5 people,
$\\beta = 0.05$ at 20.5, and $\\beta = 0.02$ at 50.5. What survives the choice
of $\\beta$ is the shape — a rise, a peak and a decline — and the design
response, which is not to pick the right number of people but to **cut $\\beta$
by cutting the pairs that need to agree**.

## 9.3 What Actually Reduces the Coupling

| Mechanism | What it removes | Cost |
|---|---|---|
| Split into sub-teams with a defined interface | Cross-team pairs, leaving one liaison pair | The interface must be designed first |
| Publish an interface contract | The need to ask | Writing and maintaining it |
| Code ownership | Pairs consulting about the same file | Bottlenecks on the owner |
| Automated tests as the specification | Pairs asking "what should this do" | Test maintenance |

Every row of that table is the same manoeuvre as section 11 of the
object-oriented chapter: it lowers propagation cost. **Module boundaries and
team boundaries are the same problem**, which is the operational content of the
observation that a system's structure tends to mirror the structure of the
organisation that built it.

## 9.4 Worked Example 9B: The Late Project

A project is four months behind at month 12 of a 16-month schedule and has 8
people. Adding 4 more takes the pairs from 28 to 66 — 38 new relationships —
and under the model of section 9.2 output moves from 4.640 to 4.400, a
reduction. The new people also cannot contribute until they are trained, at a
cost borne by the existing team.

That is the arithmetic behind the well-known observation that adding people to
a late project makes it later. It is not a universal law: it fails when the
work genuinely partitions, when the new people arrive at the start of a phase,
and when they are already familiar with the system. **What the model actually
says is that headcount is a poor lever late, and scope is a good one.**`,
      examTip: 'Communication pairs are n(n-1)/2, so the n-th person adds n-1 relationships. That quadratic against a linear output is the reason a schedule cannot be compressed indefinitely by adding staff.',
      importantNote: 'The peak team size depends entirely on the assumed cost per communication pair, which is a modelling choice. What does not depend on it is the shape: output rises, peaks and then falls.',
    },
    { id: 'sdlc-coverage', title: '10. The Testing Pyramid and Coverage, Computed on a Real Function',
      content: `## 10.1 The Pyramid, and Why It Is That Shape

| Level | Typical share of the suite | Runs in | Catches |
|---|---|---|---|
| Unit | Many | Milliseconds | Logic errors inside one module |
| Integration | Fewer | Seconds | Interface and contract mismatches |
| System | Fewer still | Minutes | Emergent and configuration faults |
| Acceptance and manual | Fewest | Hours or days | Whether the right thing was built |

The shape follows from feedback delay, which is the same variable as section
6.2. A unit test caught the defect $\\Delta$ seconds after it was written; an
acceptance test catches it weeks later. **Inverting the pyramid — a thin unit
layer under a heavy manual layer — raises $\\Delta$ for every defect in the
system.**

## 10.2 A Function to Measure

Arguing about coverage in the abstract is how the subject becomes vague. Here
is a real routine, with every statement labelled and every decision named:

    classify(age, income, years, flagged):
      s1:   score = 0
      s2:   test   age >= 21                      -- decision d1
      s3:      score = score + 10                 -- d1 true
      s4:      score = score - 5                  -- d1 false
      s5:   test   income >= 30000                -- decision d2
              and  years  >= 2                    -- decision d3
      s6:      score = score + 25                 -- both true
      s7:      score = score + 5                  -- otherwise
      s8:   test   flagged                        -- decision d4
      s9:      score = 0                          -- d4 true
      s10:  return score

Ten statements, four decisions. Because the compound condition short-circuits,
d3 is evaluated only when d2 is true, and that single fact drives most of what
follows.

## 10.3 The Three Criteria, Defined So They Can Be Computed

$$\\mathrm{SC} = \\frac{s_{\\mathrm{hit}}}{s_{\\mathrm{total}}}, \\qquad \\mathrm{BC} = \\frac{b_{\\mathrm{hit}}}{2d}, \\qquad \\mathrm{PC} = \\frac{\\pi_{\\mathrm{hit}}}{\\pi_{\\mathrm{total}}}$$

Statement coverage counts lines executed; branch coverage counts decision
outcomes taken, of which there are $2d$; path coverage counts complete routes
through the routine, of which there may be very many.

## 10.4 Worked Example 10A: One Happy-Path Test

Run classify(30, 50000, 5, false) and record what it touched. The trace is
s1, s2, s3, s5, s6, s8, s10 — seven statements of ten, so
$\\mathrm{SC} = 7 / 10 = 0.7$. The decision outcomes are d1 true, d2 true,
d3 true and d4 false — four of the eight, so $\\mathrm{BC} = 4 / 8 = 0.5$.

**Seventy per cent statement coverage from one test**, and every one of the
error and rejection paths untouched. This is the sense in which statement
coverage flatters a suite.

## 10.5 Worked Example 10B: The Minimum Test Sets, Found by Search

Searching combinations of a candidate pool and recording what each one covers
gives two answers rather than one.

**Two cases reach 100 per cent statement coverage:**

| Case | age | income | years | flagged | Statements added |
|---|---|---|---|---|---|
| 1 | 30 | 50000 | 5 | false | s1, s2, s3, s5, s6, s8, s10 |
| 2 | 18 | 20000 | 0 | true | s4, s7, s9 |

Those same two cases reach only **seven of the eight** branch outcomes: d3
false is never produced, because case 2 has an income below the threshold and
short-circuits before d3 is reached.

**Three cases are needed for 100 per cent branch coverage**, adding one that
passes the income test and fails the years test:

| Case | age | income | years | flagged | New outcome |
|---|---|---|---|---|---|
| 1 | 30 | 50000 | 5 | false | d1 true, d2 true, d3 true, d4 false |
| 3 | 30 | 50000 | 1 | false | **d3 false** |
| 2 | 18 | 20000 | 0 | true | d1 false, d2 false, d4 true |

That set also happens to reach all ten statements. **Branch coverage subsumes
statement coverage and the converse is false**, which is exactly what these two
tables demonstrate rather than assert.

## 10.6 Worked Example 10C: Paths, Enumerated and Counted

Draw the control-flow graph of classify. Its nodes are entry, d1, s3, s4, d2,
d3, s6, s7, d4, s9 and exit, so $N = 11$; note that s7 does double duty as the
join for both ways of failing the income test, since d2 false and d3 false both
arrive there. Its edges are entry to d1; d1 to s3 and to s4; s3 and s4 to d2;
d2 to d3 and to s7; d3 to s6 and to s7; s6 and s7 to d4; d4 to s9 and to exit;
and s9 to exit — so $E = 14$. Then

$$V(G) = E - N + 2P = 14 - 11 + 2 = 5$$

which agrees with the decision count plus one, $4 + 1 = 5$.

Enumerating every complete route from entry to exit by walking the graph
returns **12 paths**. Executing the routine over the 16-point input grid
formed by age in {18, 30}, income in {20000, 50000}, years in {1, 5} and
flagged in {false, true} produces **12 distinct decision sequences** — the two
counts agree, which is the cross-check that the drawn graph matches the code.

A naive multiplication over four binary decisions predicts $2^{4} = 16$, so
$16 - 12 = 4$ of those combinations are **infeasible**: they require d3 to have
been evaluated while d2 was false, which short-circuiting forbids.

| Criterion | Cases needed here | Grows with $d$ as |
|---|---|---|
| Statement | 2 | Roughly constant |
| Branch | 3 | 2 |
| Basis paths, $V(G)$ | 5 | $d + 1$ |
| All feasible paths | 12 | Up to $2^{d}$ |

![Test cases demanded by three coverage criteria against the number of independent binary decisions in a routine, on a logarithmic axis. Branch coverage stays flat at two, the basis set grows linearly as d plus one, and enumerating every path grows as two to the d, reaching 1,048,576 at twenty decisions.](/courses/fe-ee/figures/swe-coverage-paths.svg)

One notational point that trips people up. Section 4.2 computed $V(G)$ as
enclosed regions plus one on a plain drawing of the graph. McCabe's original
statement adds an edge from exit back to entry, making the graph strongly
connected, and then counts **all** regions of the drawing including the outer
one. The two recipes agree: the extra edge creates exactly one more bounded
region, and the outer region supplies the plus one. For the loop of section 4.1
both give 3, and for classify both give 5.

## 10.7 Modified Condition and Decision Coverage

Branch coverage is satisfied by taking each decision both ways, which for a
compound condition can be done without ever showing that each atomic condition
matters. **MC/DC** closes that gap: every atomic condition must be shown to
independently change the decision outcome. For a decision of $n$ conditions the
test count satisfies

$$n + 1 \\;\\le\\; T_{\\mathrm{MCDC}} \\;\\le\\; 2n$$

For the two-condition income test, the lower bound of three is achievable, and
here is the set:

| Case | income >= 30000 | years >= 2 | Decision | Shows |
|---|---|---|---|---|
| 1 | true | true | true | baseline |
| 2 | false | true | false | d2 flips the outcome alone |
| 3 | true | false | false | d3 flips the outcome alone |

MC/DC is mandated for the most critical avionics software precisely because it
grows **linearly** in the number of conditions where exhaustive combination
testing grows exponentially.

## 10.8 Worked Example 10D: Pairwise Testing

Interaction faults usually involve two parameters, not five. Suppose four
configuration parameters each take three legal values. Exhaustive testing needs

$$N_{\\mathrm{full}} = v^{\\,k} = 3^{4} = 81$$

runs. Covering every **pair** of values needs, at most, all pairs of parameters
times all pairs of values:

$$N_{\\mathrm{pairs}} = \\binom{k}{2}\\,v^{2} = 6 \\times 9 = 54$$

pairs to be covered. A nine-row orthogonal array covers all 54 — verified by
generating every pair each row supplies and comparing the two sets — so the
suite shrinks from 81 runs to 9, a reduction of $81 / 9 = 9$.

![Test cases required against the number of three-valued parameters, on a logarithmic axis. The full factorial rises as three to the k, reaching 6,561 at eight parameters, while a measured greedy pairwise cover stays between 9 and 15 across the whole range.](/courses/fe-ee/figures/sw3-pairwise-cover.svg)

Running a greedy set cover for two to eight parameters returns suites of 9, 10,
9, 14, 15, 15 and 15 rows against full factorials of 9, 27, 81, 243, 729, 2,187
and 6,561. Two honest remarks about that lower curve. It is **measured** — the
size a stated procedure achieved, not a proven bound — and it is **not
monotone**, because greedy set cover is a heuristic that returns ten rows for
three parameters where nine are achievable. Pairwise testing buys a suite that
grows roughly logarithmically in the parameter count; what it does not buy is
any guarantee about faults that need three parameters to align.`,
      examTip: 'Branch coverage subsumes statement coverage, and path coverage subsumes branch. Count decision outcomes as 2d, and remember that short-circuit evaluation makes some naive combinations infeasible.',
      importantNote: 'One happy-path test reached 70 per cent statement coverage of the worked function and only 50 per cent branch coverage. Statement coverage is the criterion that most flatters a weak suite.',
    },
    { id: 'sdlc-defects', title: '11. Defect Density, Removal Efficiency and Where Defects Are Cheapest',
      content: `## 11.1 The Two Quantities

Defect density normalises a defect count by size so that two releases can be
compared:

$$\\delta = \\frac{D}{K}$$

and it is used predictively by applying a measured density to a new release:

$$\\hat{D} = \\delta\\,K'$$

Section 5.4 measured 0.80 defects per KLOC after hardening and predicted 200
defects for a 250 KLOC release. **Defect removal efficiency** asks what
fraction of those a process catches before the customer does:

$$\\mathrm{DRE} = \\frac{D_{\\mathrm{found}}}{D_{\\mathrm{found}} + D_{\\mathrm{escaped}}} = 1 - \\frac{D_{\\mathrm{esc}}}{D_0}$$

## 11.2 Worked Example 11A: Recovering the Stage Efficiencies

The table in section 5.4 gives absolute counts: 110 removed at review, then 50,
24, 10 and 6 escaping. Those counts imply a **conditional** efficiency at each
stage — the fraction of what actually arrives there that the stage removes —
and recovering them is the step that makes the model usable:

| Stage | Arrives | Removed | Efficiency $e_j$ |
|---|---|---|---|
| Design and code review | 200 | 110 | 0.5500 |
| Unit test | 90 | 50 | 0.5556 |
| Integration test | 40 | 24 | 0.6000 |
| System test | 16 | 10 | 0.6250 |
| Escaping to the field | 6 | — | — |

Check the arithmetic in both directions. Forward:
$200 \\times 0.55 = 110$ removed, leaving 90; $90 \\times 0.5556 = 50.00$,
leaving 40; $40 \\times 0.6 = 24$, leaving 16; $16 \\times 0.625 = 10$, leaving
6. Backwards, the closed form

$$D_{\\mathrm{esc}} = D_0 \\prod_{j} \\bigl(1 - e_j\\bigr)$$

gives the same 6, and the overall removal efficiency is 97.0 per cent.

## 11.3 Worked Example 11B: Correcting the Sensitivity Claim

Section 5.4 asserted that halving the review's effectiveness roughly doubles
the escape rate and therefore roughly doubles the cost. **Computing it shows
both figures are overstated, and the corrected version is now in that
section.** Setting $e_1 = 0.275$ and leaving every downstream efficiency alone:

| Stage | Arrives | Removed | Remaining |
|---|---|---|---|
| Review at 0.275 | 200 | 55.00 | 145.00 |
| Unit test at 0.5556 | 145.00 | 80.56 | 64.44 |
| Integration at 0.600 | 64.44 | 38.67 | 25.78 |
| System test at 0.625 | 25.78 | 16.11 | 9.67 |

Escapes rise from 6 to 9.667, a factor of $9.667 / 6 = 1.611$ — not two. The
general form makes it obvious why:

$$\\frac{D'_{\\mathrm{esc}}}{D_{\\mathrm{esc}}} = \\frac{1 - e'_1}{1 - e_1}$$

which is $0.725 / 0.45 = 1.611$ exactly. **Halving a removal efficiency does
not halve the removals downstream; it feeds them more work, and they catch most
of it.** That is a genuinely useful property of a multi-stage process, and it
is invisible if the sensitivity is asserted instead of computed.

![Defects remaining in the product after each removal stage, plotted as a step function for the measured review efficiency and for half of it. The base curve falls from 200 through 90, 40 and 16 to 6 escaping; the halved-review curve falls through 145, 64.4 and 25.8 to 9.7.](/courses/fe-ee/figures/sw3-defect-cascade.svg)

## 11.4 Worked Example 11C: The Cost, Not Just the Count

Attach the section 3.3 multipliers as model parameters — 1 at review, 5 at unit
test, 10 at integration, 20 at system test and 100 in the field:

$$C = \\sum_j r_j\\,\\kappa_j + D_{\\mathrm{esc}}\\,\\kappa_{\\mathrm{field}}$$

At the measured efficiencies:
$110 + 250 + 240 + 200 + 600 = 1400$ cost units, of which
$6 \\times 100 = 600$ — **43 per cent of the total defect cost is the six that
got out.** With the review halved, the same sum comes to 2,133.33 units, a
factor of $2133.33 / 1400 = 1.524$. So the honest statement is that halving
review effectiveness raises escapes by 61 per cent and total defect cost by 52
per cent. Both are serious; neither is a doubling.

Sweeping the review efficiency alone shows how flat the response is:

| Review efficiency | Escapes | Interpretation |
|---|---|---|
| 0.30 | 9.333 | Cursory reading |
| 0.40 | 8.000 | Unprepared review |
| 0.55 | 6.000 | The measured baseline |
| 0.70 | 4.000 | Checklist-driven inspection |
| 0.85 | 2.000 | Formal inspection with preparation |

Escapes are linear in $1 - e_1$, so every ten points of review efficiency is
worth about 1.33 field defects, or 133 cost units. **A review that costs less
than that pays for itself**, and now the sentence has a number in it.

## 11.5 Worked Example 11D: How Many Defects Are Left?

The awkward question at the end of any review is how many were missed. If two
reviewers work independently, the overlap in what they found estimates the
total by the Lincoln-Petersen capture-recapture formula:

$$\\hat{N} = \\frac{n_1\\,n_2}{m}$$

where $n_1$ and $n_2$ are the counts each found and $m$ is the number both
found. Reviewer one found 11 defects, reviewer two found 12, and 6 appear on
both lists, so

$$\\hat{N} = \\frac{11 \\times 12}{6} = 22$$

The union of the two lists holds 17 distinct defects, so the estimate says
about $22 - 17 = 5$ remain, and the review's own efficiency is
$17 / 22 = 0.773$.

The assumptions are strong and worth stating: the reviewers must be
independent, and every defect must be equally findable. Neither is exactly
true, and both fail in the direction that makes $\\hat{N}$ an
**under**-estimate, because reviewers tend to find the same easy defects. The
number is a floor on what remains, which is still far more useful than a
shrug.

## 11.6 Phase Containment

| Metric | Definition | What a poor value means |
|---|---|---|
| Defect density | Defects per KLOC | The product is faulty |
| Removal efficiency | Fraction caught before release | The process is leaky |
| Phase containment | Fraction of a phase's own defects caught in that phase | Defects are travelling |
| Escape rate | Defects per KLOC found in the field | The customer is the test team |

Phase containment is the one that localises the problem. A design phase that
injects 60 defects and catches 12 of them has a containment of 0.20 and is
exporting 48 defects to phases where they cost five to twenty times more —
and that is an argument for a design review specifically, not for testing
harder in general.`,
      examTip: 'Removal efficiency is the fraction of defects caught before release. Cascade it stage by stage: escapes are the initial count times the product of one minus each stage efficiency.',
      importantNote: 'Halving the review efficiency multiplies escapes by 1.611 and total defect cost by 1.524, not by two. Downstream stages absorb most of what an earlier stage misses, which is why a multi-stage process is robust to one weak stage.',
    },
    { id: 'sdlc-reliability', title: '12. Reliability Growth and Deciding When to Ship',
      content: `## 12.1 Testing Buys Reliability at a Falling Rate

The question that ends every test phase is whether the product is good enough
yet. Reliability growth models answer it by fitting the observed failure rate
and extrapolating. Musa's basic execution-time model assumes each repair
removes one fault and that the remaining failure intensity is proportional to
the faults still present:

$$\\lambda(\\tau) = \\lambda_0\\,e^{-\\lambda_0 \\tau / \\nu_0}$$

with cumulative failures

$$\\mu(\\tau) = \\nu_0\\bigl(1 - e^{-\\lambda_0 \\tau / \\nu_0}\\bigr)$$

Here $\\tau$ is **execution** time, not calendar time; $\\lambda_0$ is the
initial failure intensity and $\\nu_0$ is the total number of failures the
model expects to be found eventually. Both are fitted from early test data, and
both are model parameters rather than facts about the code.

## 12.2 Worked Example 12A: How Long to Test

A subsystem enters test with $\\lambda_0 = 12$ failures per CPU-hour and a
fitted $\\nu_0 = 180$. Inverting the intensity equation gives the execution
time needed to fall from a present intensity to a target:

$$\\Delta\\tau = \\frac{\\nu_0}{\\lambda_0}\\,\\ln\\frac{\\lambda_P}{\\lambda_F}$$

| Elapsed test time | Failure intensity per CPU-hour | Cumulative failures |
|---|---|---|
| 0 h | 12.000 | 0.0 |
| 5 h | 8.598 | 51.0 |
| 10 h | 6.161 | 87.6 |
| 20 h | 3.163 | 132.6 |
| 40 h | 0.834 | 167.5 |
| 80 h | 0.058 | 179.1 |

To reach 0.5 failures per CPU-hour takes 47.67 hours, by which point 172.5 of
the 180 failures have been seen. To reach 0.05 takes 82.21 hours and 179.25
failures.

![Two stacked panels sharing a test-time axis. The upper panel shows failure intensity falling exponentially on a logarithmic scale, with markers where it reaches 0.5 per hour at 47.7 hours and 0.05 per hour at 82.2 hours. The lower panel shows cumulative failures rising towards the 180-failure ceiling the model assumes.](/courses/fe-ee/figures/sw3-reliability-growth.svg)

## 12.3 The Result Worth Remembering

Because the intensity falls exponentially in test time, the time to gain a
**factor** in reliability is constant:

$$\\Delta\\tau_{\\mathrm{decade}} = \\frac{\\nu_0}{\\lambda_0}\\,\\ln 10$$

which here is $15 \\times 2.3026 = 34.54$ hours. The 47.67 and 82.21 hour
figures differ by $82.21 - 47.67 = 34.54$, exactly as the formula requires.
**Every further decade of reliability costs the same 34.5 hours of test
execution.** That single sentence sets test budgets more reliably than any
argument about diminishing returns, and it also explains why the last decade is
the one that gets cut.

## 12.4 From Intensity to the Numbers Operations Care About

For a constant failure intensity $\\lambda$, the reliability over a mission of
length $t$ and the mean time to failure are

$$R(t) = e^{-\\lambda t}, \\qquad \\mathrm{MTTF} = \\frac{1}{\\lambda}$$

At the 0.5 per hour target, MTTF is 2 hours and the probability of running an
8-hour shift without a failure is 0.0183. At the 0.05 target, MTTF is 20 hours
and the same probability is 0.6703. **Whether 34.5 more hours of testing is
worth buying is a question about the mission, and now it has an answer.**

Availability then folds in repair, as section 5.4 stated:

$$A = \\frac{\\mathrm{MTTF}}{\\mathrm{MTTF} + \\mathrm{MTTR}}$$

and for a service assembled from components in series,

$$A_{\\mathrm{sys}} = \\prod_{i} A_i$$

so five components each at 99.9 per cent give a system at 99.5 per cent. The
product is the reason a distributed system needs component targets stricter
than its own.

## 12.5 The Release Decision

| Criterion | Says ship when | Weakness |
|---|---|---|
| Zero known defects | No open reports | Says nothing about unknown ones |
| Defect arrival rate | New reports per test hour is falling | The testers may simply be tired |
| Reliability target | $\\lambda$ is below the agreed intensity | Depends on the fitted parameters |
| Removal efficiency | Estimated escapes are below a threshold | Needs the section 11.5 estimate |
| Coverage | Branch coverage is above a threshold | Covered is not the same as correct |

No single row is sufficient, and the practical answer uses three of them at
once: a coverage floor to establish that the tests exercise the code, a
reliability target to establish that the failure rate is acceptable, and an
escape estimate to establish that the review process was not simply lucky.`,
      examTip: 'Reliability growth is exponential in execution time, so each decade of failure-intensity improvement costs the same fixed amount of testing. Note that the model uses execution time, not calendar time.',
      importantNote: 'Availability multiplies across components in series, so five components at 99.9 per cent give a system at 99.5 per cent. Component targets must be stricter than the system target.',
    },
    { id: 'sdlc-cm-maintenance', title: '13. Configuration Management, and Maintenance as the Majority Cost',
      content: `## 13.1 What Configuration Management Controls

Section 5.3 introduced repositories, branches and baselines. The discipline
around them exists to answer four questions at any moment, and an organisation
that cannot answer all four does not know what it has shipped:

| Question | Mechanism | Failure if missing |
|---|---|---|
| What exactly is in this release? | A baseline of identified items | A patch cannot be reproduced |
| Who changed this, and why? | Commit history tied to a change request | No way to assess a regression |
| What else does this change affect? | Impact analysis over the item list | Unplanned breakage |
| Can we rebuild last year's release? | Versioned tools and dependencies as items | The build cannot be reproduced |

The last row is the one most often skipped. A configuration item is not only
source: the compiler version, the library versions, the build scripts and the
test data are all items, because a release that cannot be rebuilt cannot be
patched.

**Branching strategies** trade the same variable as section 6.2. A long-lived
feature branch raises the delay between a decision and the integration test
that judges it, and the merge conflict at the end is the accumulated interest.
Trunk-based development with short-lived branches lowers that delay, at the
cost of needing the discipline to keep the trunk releasable.

## 13.2 Worked Example 13A: Maintenance Is Most of the Money

A product costs 1,800,000 to develop and is maintained for 12 years at 15 per
cent of the development cost per year. The undiscounted arithmetic:

$$C_{\\mathrm{maint}} = \\gamma\\,L\\,C_{\\mathrm{dev}}$$

so $1{,}800{,}000 \\times 0.15 = 270{,}000$ per year and
$270{,}000 \\times 12 = 3{,}240{,}000$ over the life. Lifetime cost is
$1{,}800{,}000 + 3{,}240{,}000 = 5{,}040{,}000$, and maintenance is
$3{,}240{,}000 / 5{,}040{,}000 = 0.643$ of it — **just under two-thirds of the
money is spent after the first release.**

## 13.3 Worked Example 13B: The Same Sum, Discounted

Undiscounted totals overstate the future, so bring the twelve annual payments
back to the present at 8 per cent using the uniform-series present-worth
factor:

$$P = C_m\\,\\frac{(1+i)^{L} - 1}{i\\,(1+i)^{L}}$$

This gives 2,034,741, and discounting each of the twelve payments individually
and summing them reproduces the same figure to the cent. The maintenance share
of the present-worth lifetime cost is then
$2{,}034{,}741 / 3{,}834{,}741 = 0.531$, still the larger half.

The engineering consequence is the one to carry into a design review: **a
decision that saves 100,000 of development and adds 20,000 a year of
maintenance loses money.** Twenty thousand a year for twelve years at 8 per
cent has a present worth of 150,722, so the trade is a net loss of
50,722. Maintainability is not a virtue, it is a cash flow.

## 13.4 What Maintenance Actually Consists Of

The Lientz and Swanson categorisation, used here as a model parameter with its
source named rather than as a measurement of any particular project:

| Category | Share | Applied to 270,000 a year | What it is |
|---|---|---|---|
| Perfective | 50 per cent | 135,000 | New and changed function requested by users |
| Adaptive | 25 per cent | 67,500 | Keeping up with platforms, formats and regulations |
| Corrective | 21 per cent | 56,700 | Fixing defects |
| Preventive | 4 per cent | 10,800 | Restructuring to keep future change cheap |

**Seventy-nine per cent of maintenance is not bug fixing.** That is the fact
that reframes the whole activity: most maintenance spending is continued
development on a codebase that was designed once, under different assumptions,
by people who have moved on. It is also why the preventive row being the
smallest is a false economy — it is the only row that reduces the others.

## 13.5 Software Entropy

Lehman's observations on evolving systems make two claims that are worth
stating because they are testable. A system in use is under **continuing
change**, or it becomes progressively less useful; and unless work is done to
prevent it, its **complexity increases** with every change. The second claim is
what turns maintenance cost from a constant into a rising curve, and it is the
justification for the preventive category above.

The counter-measures are all things that lower the propagation cost of section
11 in the object-oriented chapter: module boundaries that hold, tests that let
a change be made confidently, and a dependency structure without cycles. **A
maintainable system is one where the average number of modules a change can
reach is small**, and that quantity is measurable long before the maintenance
bill arrives.

## 13.6 Semantic Versioning, Restated as a Contract

| Change | Increment | What the consumer may assume |
|---|---|---|
| Interface broken | MAJOR | Nothing; read the notes and expect work |
| Function added compatibly | MINOR | Existing calls still behave as before |
| Defect fixed compatibly | PATCH | Behaviour matches what was documented |

The version number is the only part of a release that every consumer reads.
Getting it wrong — shipping a breaking change as a PATCH — is not a
documentation lapse; it converts a decision the consumer could have made into
an outage they could not have predicted.`,
      examTip: 'Maintenance is the majority of lifetime cost even after discounting: 64 per cent undiscounted and 53 per cent at 8 per cent in the worked case. Perfective and adaptive work together outweigh corrective work by roughly three to one.',
      importantNote: 'A design decision that saves development cost and adds annual maintenance must be evaluated at present worth. Saving 100,000 now to add 20,000 a year for 12 years at 8 per cent is a net loss of about 50,700.',
    },
    { id: 'sdlc-risk', title: '14. Risk Management with Expected-Value Arithmetic',
      content: `## 14.1 Risk Exposure

A risk is a possible future loss with a probability attached, and its **risk
exposure** is the product:

$$\\mathrm{RE} = p \\times \\ell$$

For a register of risks the total exposure is the sum, because expectations add
whether or not the risks are independent:

$$\\mathrm{RE}_{\\mathrm{total}} = \\sum_{i} p_i\\,\\ell_i$$

## 14.2 Worked Example 14A: A Register, Priced

| Risk | Probability $p$ | Loss $\\ell$ | Exposure |
|---|---|---|---|
| Key vendor breaks its API | 0.30 | 240,000 | 72,000 |
| Lead engineer leaves | 0.15 | 180,000 | 27,000 |
| Load target missed | 0.40 | 90,000 | 36,000 |
| Audit finding on logging | 0.10 | 500,000 | 50,000 |
| Third-party licence dispute | 0.05 | 750,000 | 37,500 |

The total is
$72{,}000 + 27{,}000 + 36{,}000 + 50{,}000 + 37{,}500 = 222{,}500$.

The ordering is the first useful output. The largest **loss** is the licence
dispute at 750,000, and it is the fourth-largest **exposure** at 37,500. The
largest exposure is the vendor API at 72,000, which nobody would have picked
from the loss column alone. **A register sorted by exposure is a different
document from one sorted by fear.**

## 14.3 Worked Example 14B: Which Mitigations Are Worth Buying

A mitigation changes the probability, the loss, or both, and costs money. The
figure of merit is **risk reduction leverage**:

$$\\mathrm{RRL} = \\frac{\\mathrm{RE}_{\\mathrm{before}} - \\mathrm{RE}_{\\mathrm{after}}}{C_{\\mathrm{mitigation}}}$$

An RRL above 1 returns more expected loss than it costs.

| Mitigation | Exposure before | Exposure after | Cost | RRL |
|---|---|---|---|---|
| Pin the vendor API behind an adapter, with contract tests | 72,000 | 19,200 | 18,000 | 2.933 |
| Prototype the load path early and cap the scope | 36,000 | 6,000 | 25,000 | 1.200 |

The first reduces the probability from 0.30 to 0.08 at unchanged loss:
$0.08 \\times 240{,}000 = 19{,}200$, a reduction of
$72{,}000 - 19{,}200 = 52{,}800$ for 18,000, so
$52{,}800 / 18{,}000 = 2.933$. The second reduces both the probability, from
0.40 to 0.10, and the loss, from 90,000 to 60,000.

Buying both takes total exposure from 222,500 to 139,700 for a spend of
43,000, a net expected gain of
$222{,}500 - 139{,}700 = 82{,}800$ less the spend, or
$82{,}800 - 43{,}000 = 39{,}800$. **Both are worth buying, and the first is
worth buying first**, which is precisely the ordering RRL exists to give.

## 14.4 Worked Example 14C: Schedule Risk as a Distribution

A single-point schedule estimate hides its own uncertainty. The PERT technique
takes three estimates per task — optimistic $a$, most likely $m$, pessimistic
$b$ — and forms

$$t_e = \\frac{a + 4m + b}{6}, \\qquad \\sigma = \\frac{b - a}{6}$$

| Task | $a$ | $m$ | $b$ | $t_e$ | $\\sigma$ | $\\sigma^{2}$ |
|---|---|---|---|---|---|---|
| Specify | 3 | 5 | 13 | 6.000 | 1.667 | 2.778 |
| Design | 4 | 6 | 14 | 7.000 | 1.667 | 2.778 |
| Build | 10 | 16 | 34 | 18.000 | 4.000 | 16.000 |
| Integrate | 4 | 7 | 16 | 8.000 | 2.000 | 4.000 |
| Certify | 5 | 9 | 19 | 10.000 | 2.333 | 5.444 |

Expected durations add: $6 + 7 + 18 + 8 + 10 = 49$ weeks. **Standard
deviations do not** — variances do:

$$\\sigma_T = \\sqrt{\\sum_i \\sigma_i^{2}}$$

which is the square root of 31.000, or 5.568 weeks. The probability of
finishing by a promised date $T_p$ is then read from the normal approximation
using

$$z = \\frac{T_p - t_{e,\\mathrm{total}}}{\\sigma_T}$$

| Promised date | $z$ | Probability of meeting it |
|---|---|---|
| 49 weeks | 0.000 | 0.500 |
| 52 weeks | 0.539 | 0.705 |
| 55 weeks | 1.078 | 0.859 |
| 58 weeks | 1.616 | 0.947 |

![Probability of finishing by a promised date against that date in weeks, from a normal approximation with a mean of 49 weeks and a standard deviation of 5.57. The curve passes through 50 per cent at 49 weeks and 90 per cent at 56.1 weeks.](/courses/fe-ee/figures/sw3-schedule-risk.svg)

**Promising the expected date is promising a coin flip.** A 90 per cent
confidence date needs $z = 1.282$, which is
$49 + 1.282 \\times 5.568 = 56.14$ weeks — seven weeks of buffer, and the
buffer is now a computed quantity rather than a negotiation.

## 14.5 Worked Example 14D: The Contract Decision

Offered a contract with a 200,000 bonus for delivery inside 55 weeks and a
300,000 penalty otherwise, the expected value is

$$\\mathrm{EV} = P\\,B - (1 - P)\\,\\ell$$

With $P = 0.859$ from the table above,
$0.8594 \\times 200{,}000 = 171{,}880$ against
$0.1406 \\times 300{,}000 = 42{,}180$, so the expected value is
$171{,}880 - 42{,}180 = 129{,}700$. Positive, so the clause is worth accepting
**at that date**. Rerun it at 49 weeks and the expectation is
$0.5 \\times 200{,}000 = 100{,}000$ against
$0.5 \\times 300{,}000 = 150{,}000$, an expected loss of 50,000. The same
contract, the same project, the opposite decision — and the only thing that
changed was the date, which is exactly the variable the estimate was supposed
to inform.

## 14.6 The Standing Process

| Step | Product | Frequency |
|---|---|---|
| Identify | A risk register with owners | Continuous, reviewed each iteration |
| Analyse | Probability, loss and exposure per risk | Each review |
| Prioritise | The register sorted by exposure | Each review |
| Plan | Mitigations with cost and RRL | For the top items only |
| Track | Exposure over time, plus a trigger per risk | Each iteration |
| Retire or realise | Closed risks and issues opened | On the trigger |

The last row is the discipline that keeps the register honest. A risk that has
occurred is no longer a risk — it is an issue, with a real cost rather than an
expected one — and a register in which nothing ever retires is a list of
worries rather than a management tool.`,
      examTip: 'Risk exposure is probability times loss, and risk reduction leverage is the exposure removed divided by the cost of removing it. Anything above 1 pays for itself; sort the register by exposure, not by the size of the loss.',
      importantNote: 'PERT variances add, standard deviations do not. The expected finish date carries a 50 per cent probability, and a 90 per cent date is the expectation plus 1.282 standard deviations.',
    },
    { id: 'sdlc-problems-1', title: '15. Problem Set A: Lifecycle, Estimation and Coverage',
      content: `## 15.1 Problem Set A

**A1.** Using the model of section 6.2 with $m = 100$ and a 24-month project,
what does a change cost if it is caught 18 months after the decision that
caused it, and how many times more is that than catching it at 4 months?

*Answer.* $k(18) = 100^{18/24} = 100^{0.75} = 31.62$ and
$k(4) = 100^{4/24} = 2.154$. The ratio is $31.62 / 2.154 = 14.68$. Note that
the ratio is $100^{14/24}$, so only the difference in delay matters, not the
absolute times.

**A2.** A project is estimated at 64 KLOC in the embedded mode. Give effort,
schedule and average staffing.

*Answer.* $E = 3.6 \\times 64^{1.20} = 529.32$ person-months.
$T_d = 2.5 \\times 529.32^{0.32} = 18.60$ months. Average staffing is
$529.32 / 18.60 = 28.46$ people, which should immediately prompt a question
about whether the work partitions into sub-teams.

**A3.** The same 64 KLOC project is re-scoped to 48 KLOC. By what factor does
embedded effort fall, and does the schedule fall by the same factor?

*Answer.* Effort falls by $(48/64)^{1.20} = 0.75^{1.20} = 0.7080$, a reduction
of about 29 per cent. Schedule falls by $0.7080^{0.32} = 0.8954$, a reduction
of only about 10 per cent. **Cutting scope buys effort much faster than it buys
calendar time**, which is why a scope cut late in a project disappoints the
people who asked for it.

**A4.** A team grows from 6 to 11. How many communication pairs are added, and
what is the percentage increase?

*Answer.* From $6 \\times 5 / 2 = 15$ to $11 \\times 10 / 2 = 55$, so 40 pairs
are added — a 267 per cent increase in coordination load for an 83 per cent
increase in people.

**A5.** A routine contains three sequential if-statements, none of them
compound and none nested. Give the statement, branch and basis-path test counts
and the number of complete paths.

*Answer.* One test can execute every statement if all three conditions can be
true at once. Branch coverage needs 2 (all true, then all false). $V(G)$ is
$3 + 1 = 4$ basis paths. Complete paths number $2^{3} = 8$. The pattern is the
one in the section 4.4 table: statement roughly constant, branch fixed at 2,
basis linear, paths exponential.

**A6.** Add a fourth condition to the third if, joined by a logical AND. What
changes?

*Answer.* $V(G)$ becomes 5, because a short-circuit AND contributes one
decision per operator. Branch coverage is still 2 tests. MC/DC on that
two-condition decision needs 3. Complete feasible paths become 12 rather than
16, since the second condition is not evaluated when the first is false —
exactly the count worked in section 10.6.

**A7.** Five configuration parameters each take four legal values. Give the
full factorial size and the number of value pairs a pairwise suite must cover.

*Answer.* Full factorial is $4^{5} = 1024$. Parameter pairs number
$\\binom{5}{2} = 10$, each with $4^{2} = 16$ value pairs, so
$10 \\times 16 = 160$ pairs must be covered. A pairwise suite typically needs a
few tens of rows against 1,024 — the exact figure depends on the construction,
and any figure quoted for it should say which construction produced it.

**A8.** A 40-requirement specification is written at 97 per cent
per-requirement accuracy. Give the probability it is entirely correct and the
expected number of faulty requirements, then state the rework cost if they are
found during coding at a multiplier of 10.

*Answer.* $P = 0.97^{40} = 0.2957$, and the expected count is
$40 \\times 0.03 = 1.2$. At a coding-phase multiplier of 10, the expected
rework is $1.2 \\times 10 = 12$ cost units against 1.2 if caught at review.`,
      examTip: 'In estimation problems the exponent does the work: effort scales as size to the b, and schedule as effort to the d, so a scope cut moves effort far more than it moves the calendar.',
      importantNote: 'Problem A3 is the one candidates get wrong. Cutting scope by a quarter cuts embedded effort by 29 per cent and the schedule by only 11 per cent, because the schedule exponent is small.',
    },
    { id: 'sdlc-problems-2', title: '16. Problem Set B: Defects, Reliability, Maintenance and Risk',
      content: `## 16.1 Problem Set B

**B1.** A 180 KLOC release has a measured defect density of 1.2 per KLOC. A
four-stage removal process has efficiencies 0.50, 0.60, 0.50 and 0.40 in order.
Give the predicted defects, the escapes and the overall removal efficiency.

*Answer.* $\\hat{D} = 1.2 \\times 180 = 216$ defects. Escapes are
$216 \\times 0.5 \\times 0.4 \\times 0.5 \\times 0.6 = 12.96$, and the overall
DRE is $1 - 12.96/216 = 0.94$, or 94 per cent.

**B2.** In that process, which single stage improvement removes the most
escapes: raising the first stage from 0.50 to 0.60, or the last from 0.40 to
0.50?

*Answer.* Escapes scale with the product of $(1 - e_j)$, so raising the first
stage multiplies escapes by $0.40 / 0.50 = 0.8$ and raising the last multiplies
them by $0.50 / 0.60 = 0.833$. The first-stage improvement is slightly better,
giving 10.37 escapes against 10.80. **Ten points of efficiency are worth more
where the residual fraction is smaller**, which is the precise version of
"shift left" and is not the same as saying earlier is always better by a wide
margin.

**B3.** Two reviewers examine a module. One finds 9 defects, the other 14, and
4 appear on both lists. Estimate the total, the number remaining, and the
review efficiency.

*Answer.* $\\hat{N} = 9 \\times 14 / 4 = 31.5$. The union holds
$9 + 14 - 4 = 19$, so about 12.5 remain and the review efficiency is
$19 / 31.5 = 0.603$. The low overlap is what drives the pessimistic estimate:
independent reviewers finding largely different defects implies a large unseen
population.

**B4.** A component enters test at 8 failures per CPU-hour with a fitted
$\\nu_0 = 240$. How long to reach 0.8 per hour, and how much longer to reach
0.08?

*Answer.* $\\Delta\\tau = (240/8)\\ln(8/0.8) = 30 \\times 2.3026 = 69.08$ hours.
The next decade costs the same again, $30\\ln 10 = 69.08$ hours, for a total of
138.2 hours. The constant cost per decade is the whole content of the model.

**B5.** Three services are chained in series with availabilities 0.999, 0.995
and 0.9999. Give the system availability and the annual downtime.

*Answer.* $A_{\\mathrm{sys}} = 0.999 \\times 0.995 \\times 0.9999 = 0.993906$.
Annual downtime is $(1 - 0.993906) \\times 8760 = 53.4$ hours, and 43.8 of those
hours come from the 0.995 component alone. **The weakest component dominates**,
which is why hardening the already-good one is usually wasted money.

**B6.** A refactoring costs 240,000 now and reduces annual maintenance from
400,000 to 310,000 for the remaining 9 years at 8 per cent. Is it worth doing?

*Answer.* The annual saving is 90,000. The uniform-series present-worth factor
at 8 per cent over 9 years is 6.2469, so the saving is worth
$90{,}000 \\times 6.2469 = 562{,}221$ against a cost of 240,000. Net present
worth is $562{,}221 - 240{,}000 = 322{,}221$, so yes — and note that the same
refactoring evaluated over 2 years instead of 9 would have a factor of 1.7833,
a present worth of 160,497, and would lose money.

**B7.** A risk has probability 0.25 and a loss of 400,000. A mitigation costing
30,000 reduces the probability to 0.10. Give the exposure before and after and
the risk reduction leverage. Would you buy it if the mitigation cost 70,000?

*Answer.* Before, $0.25 \\times 400{,}000 = 100{,}000$; after,
$0.10 \\times 400{,}000 = 40{,}000$. The reduction is 60,000, so
$\\mathrm{RRL} = 60{,}000 / 30{,}000 = 2.0$. At 70,000 the leverage is
$60{,}000 / 70{,}000 = 0.857$, below 1, and on expected value alone it is not
worth buying — though a risk-averse organisation facing a survival-threatening
loss may rationally pay above expected value, which is what insurance is.

**B8.** Four tasks have PERT triples (2, 4, 12), (5, 8, 17), (3, 5, 13) and
(6, 10, 20). Give the expected duration, the standard deviation of the chain,
and the date that carries an 84 per cent chance of being met.

*Answer.* The expected durations are 5.000, 9.000, 6.000 and 11.000, summing
to 31.000. The standard deviations are 1.6667, 2.0000, 1.6667 and 2.3333, with
variances 2.7778, 4.0000, 2.7778 and 5.4444 summing to 15.000, so
$\\sigma_T = 3.873$. An 84 per cent date is approximately one standard
deviation above the mean, $31 + 3.873 = 34.87$ weeks.`,
      examTip: 'Escapes cascade as the product of one minus each stage efficiency, so a sensitivity question is answered by a ratio of residual fractions rather than by intuition about which stage feels more important.',
      importantNote: 'Problem B5 is the one to remember for system design: availabilities multiply in series, and the least available component supplies most of the downtime.',
    },
  ],
  keyTakeaways: [
    'Waterfall: sequential. Agile: iterative sprints.',
    'Testing: unit -> integration -> system -> acceptance; earlier = cheaper.',
    'Bug cost: ~1x at unit, ~10x integration, ~100x production.',
    'TDD: tests before code. CI: auto test on commit.',
    'Git: commit, branch, merge, pull request.',
    'CI/CD automates build/test/deploy.',
  ],
},

fee_databases: { topicId: 'fee_databases', title: 'Databases: SQL & Normalization', domainWeight: 'Software Development · 3–5%',
  overview: 'Relational databases organize data in tables with SQL queries. Normalization eliminates redundancy through 1NF, 2NF, and 3NF. ACID properties ensure transaction reliability.',
  sections: [
    { id: 'db-sql', title: '1. Relational Model and SQL',
      content: `## 1.1 Key Concepts

| Term | Definition |
|---|---|
| **Table** | Rows + columns |
| **Primary Key** | Unique row identifier |
| **Foreign Key** | References another table's PK |

## 1.2 SQL Operations

| Op | SQL | Example |
|---|---|---|
| Read | SELECT | SELECT name FROM students WHERE gpa > 3.0 |
| Create | INSERT | INSERT INTO students VALUES ('Alice', 22) |
| Update | UPDATE | UPDATE students SET age=23 WHERE name='Alice' |
| Delete | DELETE | DELETE FROM students WHERE gpa < 2.0 |

## 1.3 JOINs

| Type | Returns |
|---|---|
| **INNER** | Matching rows in BOTH |
| **LEFT** | All left + matching right (NULL if none) |
| **RIGHT** | All right + matching left |

## 1.4 Aggregation

COUNT, SUM, AVG, MIN, MAX with GROUP BY and HAVING.`,
      examTip: 'INNER JOIN = only matching rows. LEFT JOIN = all left + matches. WHERE filters rows; HAVING filters groups after aggregation.',
      importantNote: 'WHERE vs HAVING: WHERE filters before grouping, HAVING filters after. Mixing them up is commonly tested.',
    },
    { id: 'db-norm-acid', title: '2. Normalization and ACID',
      content: `## 2.1 Normal Forms

| NF | Rule | Eliminates |
|---|---|---|
| **1NF** | Atomic values (no lists) | Repeating groups |
| **2NF** | No partial dependencies | Partial deps |
| **3NF** | No transitive dependencies | Transitive deps |

Example: Student(ID, Name, DeptID, DeptName) violates 3NF because DeptName depends on DeptID, not the key. Fix: split into Student(ID, Name, DeptID) + Dept(DeptID, DeptName).

## 2.2 ACID

| Property | Meaning |
|---|---|
| **Atomicity** | All-or-nothing |
| **Consistency** | Valid state to valid state |
| **Isolation** | Concurrent txns don't interfere |
| **Durability** | Committed data survives failures |

## 2.3 Indexes

- **B-tree**: O(log n), range + exact match
- **Hash**: O(1), exact match only
- Tradeoff: faster reads, slower writes`,
      examTip: '1NF = atomic. 2NF = no partial deps. 3NF = no transitive deps. ACID: Atomicity, Consistency, Isolation, Durability.',
    },
    { id: 'db-exam', title: '3. SQL & Database Problems',
      content: `## 3.1 Write a Query with JOIN, WHERE, GROUP BY, HAVING

**Tables**: Students(id, name, dept_id), Enrollments(student_id, course_id, grade), Courses(id, title, credits).

**Problem**: Find departments where the average GPA exceeds 3.0, showing department and average.

**SQL**:
- SELECT s.dept_id, AVG(e.grade) AS avg_gpa
- FROM Students s
- **INNER JOIN** Enrollments e ON s.id = e.student_id
- **WHERE** e.grade IS NOT NULL
- **GROUP BY** s.dept_id
- **HAVING** AVG(e.grade) > 3.0
- ORDER BY avg_gpa DESC;

**Execution order**: FROM -> JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY

| Clause | Purpose | Filters |
|---|---|---|
| WHERE | Filter individual rows | Before grouping |
| GROUP BY | Create groups | N/A |
| **HAVING** | Filter groups | **After grouping** |

## 3.2 Identify 1NF / 2NF / 3NF Violation

**Table**: OrderDetail(OrderID, ProductID, ProductName, CustomerID, CustomerName, Qty, Price)

**Primary key**: (OrderID, ProductID) — composite key.

| Normal Form | Violation? | Problem |
|---|---|---|
| **1NF** | No | All values are atomic |
| **2NF** | **Yes** | Two partial dependencies on the composite key: CustomerID and CustomerName depend on OrderID alone, and ProductName depends on ProductID alone |
| **3NF** | **Yes** (after the 2NF fix) | In the resulting Orders table, CustomerName depends on CustomerID, a non-key attribute — a transitive dependency |

Be precise about which violation is which, because the exam distinguishes
them: dependence on **part of the key** is a *partial* dependency and breaks
2NF, while dependence on a **non-key attribute** is a *transitive* dependency
and breaks 3NF. ProductName depending on ProductID is the first kind, not the
second.

**Fix for 2NF** — remove both partial dependencies: Orders(OrderID, CustomerID, CustomerName) + Products(ProductID, ProductName) + OrderItems(OrderID, ProductID, Qty, Price)

**Fix for 3NF** — remove the transitive dependency that survives inside Orders: split it into Orders(OrderID, CustomerID) + Customers(CustomerID, CustomerName).

## 3.3 ACID Property Scenario Identification

**Match each scenario to the ACID property:**

| Scenario | ACID Property | Explanation |
|---|---|---|
| Bank transfer: debit + credit both succeed or both fail | **Atomicity** | All-or-nothing |
| After transfer, total money unchanged | **Consistency** | Valid state to valid state |
| Two users editing same record don't see partial changes | **Isolation** | Concurrent transactions separated |
| Committed data survives server crash | **Durability** | Written to persistent storage |

**Common exam trap**: "Consistency" in ACID means database constraints are maintained (valid state -> valid state). It does NOT mean "data is the same everywhere" (that is CAP theorem consistency).

**Exam strategy**: For SQL, remember the execution order (FROM -> WHERE -> GROUP BY -> HAVING -> SELECT). WHERE filters rows before grouping; HAVING filters groups after. For normalization, check: 1NF (atomic?), 2NF (partial deps on composite key?), 3NF (transitive deps?). For ACID, atomicity = all-or-nothing is the most commonly tested property.`,
      examTip: 'SQL execution order: FROM/JOIN first, WHERE second, GROUP BY third, HAVING fourth, SELECT fifth. This order explains why you cannot use column aliases in WHERE but can in HAVING (in some dialects).',
      importantNote: '2NF violations only occur with COMPOSITE primary keys. If your table has a single-column PK, it is automatically in 2NF (there can be no partial dependencies). Check for composite keys first.',
    },
    { id: 'db-keys-cost', title: '4. Keys, Cardinality, and What a Query Costs',
      content: `## 4.1 The Vocabulary of Keys

Normalization arguments depend on knowing exactly which key is being talked
about:

| Term | Definition |
|---|---|
| **Superkey** | Any set of attributes that uniquely identifies a row |
| **Candidate key** | A minimal superkey — remove any attribute and uniqueness is lost |
| **Primary key** | The candidate key chosen as the row identifier; never NULL |
| **Alternate key** | A candidate key that was not chosen |
| **Composite key** | A key made of two or more attributes |
| **Surrogate key** | A system-generated identifier with no business meaning |
| **Foreign key** | An attribute referencing another table's primary key |
| **Prime attribute** | An attribute that belongs to some candidate key |

Two of these carry a rule the exam tests. A primary key can never be NULL,
because a NULL would mean "unidentified row"; a foreign key **can** be NULL,
meaning "not related to anything yet". And a **surrogate key** — an
auto-incrementing integer — is chosen precisely because business identifiers
turn out to be mutable: email addresses change, national identifiers get
reissued, and a primary key that changes breaks every foreign key pointing at
it.

## 4.2 Cardinality and Referential Integrity

Relationships between entities come in three cardinalities, and each is
implemented differently:

| Cardinality | Example | Implementation |
|---|---|---|
| One-to-one | Employee to ParkingSpace | Foreign key with a unique constraint, on either side |
| One-to-many | Department to Employee | Foreign key on the **many** side |
| Many-to-many | Student to Course | A **junction table** holding both foreign keys |

Many-to-many cannot be represented directly in the relational model — this is
exactly why Enrollments(student_id, course_id, grade) exists in the schema of
section 3.1. The junction table's primary key is normally the composite of the
two foreign keys, which is also the origin of most composite keys and
therefore of most 2NF problems.

**Referential integrity** requires that every non-NULL foreign key value point
at a row that exists. When the referenced row is deleted, the declared action
decides what happens:

| Action | Effect on the child rows |
|---|---|
| RESTRICT / NO ACTION | The delete is refused while children exist |
| CASCADE | The children are deleted too |
| SET NULL | The foreign key becomes NULL |
| SET DEFAULT | The foreign key reverts to its default |

CASCADE is powerful and dangerous in the same measure: deleting one customer
can silently remove years of orders.

## 4.3 What an Index Actually Saves

An index is a B-tree over one or more columns. Its height determines the
lookup cost, and the height is small because the fan-out is large — a 8 KB
page holding 100-byte entries branches roughly 100 ways at every level.

![Pages touched to find one row, plotted against table size on logarithmic axes. The full-scan curve is N divided by 81 rows per page and rises proportionally; the B-tree curve is the tree height plus one and rises as a staircase. At a million rows the scan touches 12,346 pages against the index's four.](/courses/fe-ee/figures/swe-btree-vs-scan.svg)

| Rows N | B-tree height (fan-out 100) | Pages read via index | Pages scanned (81 rows/page) |
|---|---|---|---|
| 1,000 | 2 | 3 | 13 |
| 10,000 | 2 | 3 | 124 |
| 1,000,000 | **3** | **4** | **12,346** |
| 100,000,000 | 4 | 5 | 1,234,568 |

The staircase shape is the point. Going from a thousand rows to a hundred
million multiplies the scan cost by a hundred thousand and the index cost by
**two page reads**. Each extra level of the tree accommodates another factor
of 100 in table size, so a three-level index covers a million rows and a
four-level index covers a hundred million.

Indexes are not free, and the costs are what turn this into a design question:

| Cost | Why |
|---|---|
| Slower writes | Every insert, update and delete must maintain every index |
| Storage | An index on a wide column can approach the table's own size |
| Planner risk | A low-selectivity index may be chosen and be slower than a scan |

## 4.4 Selectivity Decides Whether the Index Is Used

**Selectivity** is the fraction of rows a predicate keeps. For a column with d
distinct values evenly distributed, an equality test has selectivity 1/d:

| Distinct values | Selectivity | Rows returned from 10^6 | Optimiser's likely choice |
|---|---|---|---|
| 2 (a yes/no flag) | 0.5 | 500,000 | **Full scan** |
| 50 (a region code) | 0.02 | 20,000 | Index |
| 1,000 | 0.001 | 1,000 | Index |
| 1,000,000 (unique) | 0.000001 | 1 | Index |

The first row is the counter-intuitive one. Indexing a boolean flag is
generally useless, because retrieving half the table one row at a time through
the index costs more random reads than reading every page in order. Optimisers
therefore ignore such indexes, and the rough rule of thumb is that an index
stops helping once a query returns more than a few percent of the table.

Join algorithms respond to size in the same spirit. Joining a 10,000-row table
to a 1,000-row table:

| Algorithm | Cost model | Operations here |
|---|---|---|
| Nested loop | N × M | 10,000,000 |
| Index nested loop | N × height of M's index | 20,000 |
| Hash join | N + M | **11,000** |
| Sort-merge | N log N + M log M | 142,843 |

Hash join wins by nearly a factor of 909 over the naive nested loop, and the
reason is structural rather than clever: it replaces a scan of the inner table
per outer row with a single hash-table build and one probe each. Sort-merge is
slower here but wins when the inputs are already sorted or when the result
must be ordered anyway.`,
      examTip: 'Many-to-many always needs a junction table; one-to-many puts the foreign key on the many side. Primary keys can never be NULL, foreign keys can.',
      importantNote: 'An index on a low-selectivity column (a boolean, a two-value status) is normally ignored by the optimiser: retrieving half a table through an index costs more random reads than scanning it in order. Indexes pay when a query returns a few percent of the rows or fewer.',
    },
    { id: 'db-transactions', title: '5. Transactions, Isolation, BCNF, and Denormalization',
      content: `## 5.1 The Three Concurrency Anomalies

Isolation is not a switch but a dial, because full isolation is expensive.
The SQL standard names three read anomalies that weaker settings permit:

| Anomaly | What happens |
|---|---|
| **Dirty read** | Transaction A reads a row that B has modified but not committed; B then rolls back, so A read a value that never existed |
| **Non-repeatable read** | A reads a row, B updates and commits it, A reads it again and gets a different value |
| **Phantom read** | A runs a range query, B inserts a row matching that range and commits, A reruns the query and sees a new row |

The distinction between the last two is exactly the distinction between a
**row** and a **set of rows**: a non-repeatable read is an existing row
changing, a phantom is a new row appearing.

## 5.2 The Four Isolation Levels

| Level | Dirty read | Non-repeatable read | Phantom |
|---|---|---|---|
| READ UNCOMMITTED | Possible | Possible | Possible |
| READ COMMITTED | Prevented | Possible | Possible |
| REPEATABLE READ | Prevented | Prevented | Possible |
| SERIALIZABLE | Prevented | Prevented | Prevented |

The table is worth memorising as a staircase: each level prevents everything
the level above it prevented, plus one more anomaly, at the cost of holding
more locks for longer. SERIALIZABLE guarantees that the concurrent outcome
matches *some* serial order, which is the strongest guarantee available and
the one that most restricts throughput.

**Two-phase locking** is the usual mechanism: a transaction acquires locks in
a growing phase and releases them in a shrinking phase, never acquiring after
its first release. That discipline is what makes serialisability provable.

Locking introduces **deadlock**, in which two transactions each hold what the
other needs:

| Time | Transaction A | Transaction B |
|---|---|---|
| 1 | Locks row 1 | — |
| 2 | — | Locks row 2 |
| 3 | Waits for row 2 | — |
| 4 | — | Waits for row 1 |

Neither can proceed. Databases detect the cycle in the wait-for graph and
abort one transaction as a **victim**, rolling it back so the other completes.
The application must be prepared to retry. The standard prevention is
**ordered acquisition**: if every transaction locks rows in ascending primary
key order, the cycle cannot form.

## 5.3 BCNF: When 3NF Is Not Enough

Boyce–Codd normal form tightens 3NF to a single sentence: **every determinant
must be a superkey**. A determinant is any attribute set that functionally
determines another.

**Worked example.** Enrollment(Student, Course, Instructor), with the business
rules that a student takes a course with exactly one instructor, and each
instructor teaches exactly one course:

| Dependency | Determinant | Is it a superkey? |
|---|---|---|
| {Student, Course} → Instructor | {Student, Course} | Yes — it is a candidate key |
| Instructor → Course | {Instructor} | **No** |

Candidate keys here are {Student, Course} and {Student, Instructor}. The table
**is** in 3NF, because 3NF excuses a dependency whose right-hand side is a
prime attribute, and Course belongs to a candidate key. It is **not** in BCNF,
because Instructor determines Course without being a superkey.

The anomaly this permits is concrete: the fact "Professor Chen teaches
Thermodynamics" is stored once per enrolled student, so it can be updated in
one row and not another. Decomposing into Teaches(Instructor, Course) and
Takes(Student, Instructor) stores it exactly once.

| Form | Requirement |
|---|---|
| 1NF | Atomic values |
| 2NF | 1NF and no partial dependency on a composite key |
| 3NF | 2NF and no transitive dependency on a non-key attribute |
| **BCNF** | Every determinant is a superkey |

## 5.4 Denormalization, and the ACID/CAP Distinction

Normalization removes redundancy and therefore removes update anomalies. What
it costs is joins, and past a point that cost is real:

| Strategy | Gains | Loses |
|---|---|---|
| Normalized to 3NF/BCNF | No update anomalies; smallest storage | Read queries need many joins |
| Denormalized (duplicated columns, pre-aggregated totals) | Fewer joins, faster reads | Duplicated data must be kept consistent by the application |

The rule is to normalize first and denormalize only against a measured read
bottleneck, because a denormalized schema moves the correctness burden from
the database's constraints into application code.

Finally, one word means two different things and the exam exploits it. The
**C in ACID** is *consistency*: a transaction moves the database from one
state satisfying all declared constraints to another. The **C in CAP** is a
different property: every read sees the most recent write, across all replicas
of a distributed system.

| | ACID consistency | CAP consistency |
|---|---|---|
| Scope | One database, one transaction | Many replicas |
| Guarantees | Constraints hold before and after | All nodes agree on the latest value |
| Given up when | Never — a violating transaction aborts | A partition forces a choice against availability |

CAP says a partitioned distributed system must choose between consistency and
availability; it says nothing about whether individual transactions respect
their constraints. A system can be perfectly ACID on each node and eventually
consistent across nodes, which is precisely what most large-scale stores are.`,
      examTip: 'Learn the isolation table as a staircase: READ UNCOMMITTED allows all three anomalies, and each higher level removes one more — dirty read, then non-repeatable read, then phantom.',
      importantNote: 'A table can be in 3NF and still violate BCNF, which happens when a non-superkey determines a PRIME attribute. BCNF is the one-line test: every determinant must be a superkey.',
    },
  ],
  keyTakeaways: [
    'Tables with PK (unique) and FK (relationships). SQL: SELECT, INSERT, UPDATE, DELETE.',
    'INNER JOIN: matching rows. LEFT JOIN: all left + matches.',
    '1NF: atomic. 2NF: no partial deps. 3NF: no transitive deps.',
    'ACID: atomicity, consistency, isolation, durability.',
    'B-tree index: O(log n) + ranges. Hash: O(1) exact only.',
    'WHERE filters rows; HAVING filters groups.',
  ],
},

// ═══════════════════════════════════════════════════════════════
// NCEES GAP FIX (2026-05-24) — 6 new topics covering audit gaps:
// signal Nyquist depth, fault analysis, Shannon-Hartley, Bode
// sketching, pole-zero analysis, NCEES Reference Handbook navigation.
// ═══════════════════════════════════════════════════════════════

};
