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

- **Iterations**: ceil(log_2(n)) + 1 (maximum)
- **Comparison count**: log_2(n) average for successful search

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

| Load Factor | Avg Lookup (chaining) | Performance |
|---|---|---|
| 0.5 | ~1.25 | Excellent |
| 1.0 | ~1.5 | Good |
| 2.0 | ~2.0 | Acceptable |
| 6.0 (our example) | ~3.5 | Poor — rehash! |

**Exam strategy**: For BST, trace the insertion path (left if smaller, right if larger). For heaps, extract = remove root, move last to root, sift down. For hash tables, compute hash, then walk the chain. Load factor > 0.7 signals time to rehash.`,
      examTip: 'BST insertion: compare with each node, go left (smaller) or right (larger). Heap extract: always O(log n). Hash lookup: O(1) average, but O(n) worst case if all keys collide.',
      importantNote: 'A bad hash function that maps many keys to the same bucket destroys hash table performance. The example above (all mod 7 = 0) shows worst-case O(n) behavior. Good hash functions distribute keys uniformly.',
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
      importantNote: 'Deep recursion risks stack overflow. Fibonacci(50) naive makes ~2^50 calls (impossible). DP solves only 50 sub-problems.',
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
- **Statements**: 2 test cases (A=true,B=true covers all lines)
- **Branches**: 2 test cases (TT and FF)
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
| **2NF** | **Yes** | CustomerName depends on OrderID alone (partial dependency on composite key) |
| **3NF** | **Yes** | ProductName depends on ProductID, not the whole key (transitive) |

**Fix for 2NF**: Split into Orders(OrderID, CustomerID, CustomerName) + OrderItems(OrderID, ProductID, Qty, Price)

**Fix for 3NF**: Further split Products(ProductID, ProductName) and replace ProductName in OrderItems with just ProductID.

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
