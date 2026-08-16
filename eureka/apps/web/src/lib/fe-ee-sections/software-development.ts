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

Fibonacci: naive O(2^n); DP O(n).`,
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
insertion sort lands within 1 % of n²/4 (the average case moves each element
about a quarter of the array) and merge sort within 3 % of n log₂n − n + 1.
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

| Keys n | Sorted insertion | Shuffled insertion | Perfectly balanced |
|---|---|---|---|
| 15 | 8.0 | 3.8 | 4.0 |
| 63 | 32.0 | 6.1 | 6.0 |
| 255 | 128.0 | 9.2 | 8.0 |
| 1,023 | **512.0** | **12.4** | 10.0 |

The sorted-insertion series is exactly **(n+1)/2** at every size, which is the
signature of a linked list: to reach the key at depth k costs k comparisons,
and averaging 1 through n gives (n+1)/2. At n = 1023 the same keys cost 512
comparisons in one arrival order and 12.4 in another — a factor of **41** — and
random insertion lands within about 25 % of the perfectly balanced ideal.

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
    5      else:
    6          decrement x
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
review. Halving the review's effectiveness — moving 55 % to 27.5 % and pushing
the difference downstream — roughly doubles the escape rate, and therefore
roughly doubles the total cost of the release.

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
