"""Coursework: linear algebra unit nodes LA.U1-LA.U9.

Five steps per lesson: two readings, a worked example, pitfalls, check.
"""

L = "reading"
E = "example"
P = "pitfall"
K = "check"

LESSONS: dict[str, dict] = {
    # ------------------------------ U1: vectors & systems ------------------------------
    "LA.U1.N1": {
        "summary": "Vector operations: addition, scalar multiplication, and their geometry.",
        "steps": [
            (L, "Vectors and the two operations", (
                "A vector in $\\mathbb R^n$ is an ordered list of numbers, drawn as an arrow from the "
                "origin. The two operations that define ALL of linear algebra:\n\n"
                "• ADDITION, componentwise: $(1, 2) + (3, -1) = (4, 1)$ — geometrically, tip-to-tail "
                "(the parallelogram rule).\n"
                "• SCALAR MULTIPLICATION: $c(v_1, v_2) = (cv_1, cv_2)$ — stretches by $|c|$, flips if "
                "$c < 0$.\n\n"
                "Everything later (span, independence, matrices) is built from just these two."
            )),
            (L, "Algebraic structure", (
                "The operations obey the familiar laws: commutativity and associativity of addition, "
                "the zero vector $\\mathbf 0$, negatives, and distributivity "
                "$c(u + v) = cu + cv$, $(c + d)v = cv + dv$.\n\n"
                "Subtraction is addition of the negative: $u - v$ points FROM $v$'s tip TO $u$'s tip — "
                "the displacement between points. Length: "
                "$\\|v\\| = \\sqrt{v_1^2 + \\cdots + v_n^2}$; a UNIT vector is $v / \\|v\\|$."
            )),
            (E, "Worked example", (
                "Let $u = (2, -1, 3)$, $v = (0, 4, -2)$. Compute $2u - 3v$ and $\\|u\\|$.\n\n"
                "$$2u - 3v = (4, -2, 6) - (0, 12, -6) = (4, -14, 12).$$\n"
                "$$\\|u\\| = \\sqrt{4 + 1 + 9} = \\sqrt{14}.$$\n\n"
                "Unit vector along $u$: $\\frac{1}{\\sqrt{14}}(2, -1, 3)$ — same direction, length 1."
            )),
            (P, "Pitfalls", (
                "1. Adding vectors of different dimensions — undefined, full stop.\n\n"
                "2. $\\|u + v\\| = \\|u\\| + \\|v\\|$ — false in general (triangle inequality is $\\le$).\n\n"
                "3. Scalar times vector confused with dot product (scalar·vector is a VECTOR).\n\n"
                "4. Normalizing by dividing components by $n$ instead of by the length.\n\n"
                "5. Sign slips in subtraction: $u - v \\ne v - u$; they point opposite ways."
            )),
            (K, "Check yourself", (
                "You should be able to: compute linear expressions in vectors, find lengths and unit "
                "vectors, and draw the parallelogram picture.\n\n"
                "Self-test: for $u = (3, 4)$, find the unit vector and $\\|{-2u}\\|$. "
                "($(\\frac35, \\frac45)$ and $10$.)\n\nPractice the node."
            )),
        ],
    },
    "LA.U1.N2": {
        "summary": "Linear combinations: weighted sums of vectors, the primitive of linear algebra.",
        "steps": [
            (L, "The definition", (
                "A LINEAR COMBINATION of vectors $v_1, \\ldots, v_k$ is any weighted sum\n"
                "$$c_1 v_1 + c_2 v_2 + \\cdots + c_k v_k,$$\n"
                "scalars $c_i$ arbitrary. It is the only way to 'mix' vectors using the two legal "
                "operations — which makes it the primitive move of the whole subject.\n\n"
                "Examples in $\\mathbb R^2$: $3(1,0) + 2(0,1) = (3,2)$ — coordinates themselves are the "
                "weights of a combination of the standard basis."
            )),
            (L, "The membership question", (
                "The central computational question: IS $b$ a linear combination of $v_1, \\ldots, v_k$? "
                "That means: do weights $c_i$ exist with $c_1 v_1 + \\cdots + c_k v_k = b$?\n\n"
                "Written out componentwise, this is a SYSTEM OF LINEAR EQUATIONS in the unknowns $c_i$ — "
                "the first appearance of the identification that runs through the course: "
                "combinations ↔ systems ↔ matrix equations. Solve the system; solvable = yes."
            )),
            (E, "Worked example", (
                "Is $b = (7, 1)$ a combination of $v_1 = (1, 2)$ and $v_2 = (3, -1)$?\n\n"
                "Need $c_1(1,2) + c_2(3,-1) = (7,1)$:\n"
                "$$c_1 + 3c_2 = 7, \\qquad 2c_1 - c_2 = 1.$$\n"
                "From the second, $c_2 = 2c_1 - 1$; substitute: $c_1 + 6c_1 - 3 = 7 \\Rightarrow c_1 = "
                "\\frac{10}{7}$, $c_2 = \\frac{13}{7}$.\n\n"
                "Yes: $b = \\frac{10}{7} v_1 + \\frac{13}{7} v_2$. Weights need not be integers — "
                "existence is the question, not neatness."
            )),
            (P, "Pitfalls", (
                "1. Requiring nice weights — any real scalars count.\n\n"
                "2. Setting up the system with vectors as ROWS of equations instead of columns of "
                "coefficients (each COMPONENT gives one equation).\n\n"
                "3. Concluding 'not a combination' from one failed guess rather than an inconsistent "
                "system.\n\n"
                "4. Forgetting the trivial combination: $\\mathbf 0$ is ALWAYS a combination "
                "(all weights 0).\n\n"
                "5. Mixing up the roles: the $v_i$ are known, the $c_i$ are the unknowns."
            )),
            (K, "Check yourself", (
                "You should be able to: form combinations, translate membership into a linear system, and "
                "solve it.\n\n"
                "Self-test: is $(0, 0)$ a nontrivial combination of $(1,2)$ and $(2,4)$? "
                "(Yes: $2v_1 - v_2 = 0$ — a preview of dependence.)\n\nPractice the node."
            )),
        ],
    },
    "LA.U1.N3": {
        "summary": "Span: the set of all linear combinations, and what it looks like geometrically.",
        "steps": [
            (L, "The definition", (
                "$\\operatorname{span}\\{v_1, \\ldots, v_k\\}$ is the set of ALL their linear "
                "combinations — every vector reachable by scaling and adding.\n\n"
                "Geometry in $\\mathbb R^3$:\n"
                "• One nonzero vector spans a LINE through the origin.\n"
                "• Two independent vectors span a PLANE through the origin.\n"
                "• Three independent vectors span all of $\\mathbb R^3$.\n\n"
                "A span always contains $\\mathbf 0$ and is closed under the two operations — it is the "
                "prototype subspace (LA.U3.N1)."
            )),
            (L, "Redundancy and the span question", (
                "Adding a vector already in the span changes NOTHING: "
                "$\\operatorname{span}\\{v, 2v\\} = \\operatorname{span}\\{v\\}$ — the second vector is "
                "redundant. Detecting redundancy is exactly the independence question (LA.U1's theme, "
                "formalized later).\n\n"
                "'Does $\\{v_1, \\ldots, v_k\\}$ span $\\mathbb R^n$?' asks whether EVERY $b$ yields a "
                "solvable system — equivalently (after LA.U1.N8): a pivot in every ROW of the echelon "
                "form. Fewer than $n$ vectors can never span $\\mathbb R^n$."
            )),
            (E, "Worked example", (
                "Describe $\\operatorname{span}\\{(1, 2, 0), (0, 1, 1)\\}$ in $\\mathbb R^3$.\n\n"
                "Neither is a multiple of the other → a plane through the origin. Which plane? "
                "$(x, y, z) = c_1(1,2,0) + c_2(0,1,1)$ gives $x = c_1$, $y = 2c_1 + c_2$, $z = c_2$, so "
                "$y = 2x + z$, i.e. the plane $2x - y + z = 0$.\n\n"
                "Membership check: $(1, 5, 3)$ satisfies $2 - 5 + 3 = 0$ ✓ — it's in the span; "
                "$(1, 1, 1)$ gives $2 \\ne 0$ — it's not."
            )),
            (P, "Pitfalls", (
                "1. Thinking span means only the listed vectors — it's the infinite set of ALL "
                "combinations.\n\n"
                "2. 'Two vectors span a plane' — only if independent; parallel vectors span a line.\n\n"
                "3. Spans not through the origin — impossible; every span contains $\\mathbf 0$.\n\n"
                "4. Claiming 2 vectors might span $\\mathbb R^3$ — never; you need at least $n$.\n\n"
                "5. Confusing 'the vectors span $\\mathbb R^n$' with 'the vectors are independent' — "
                "related but distinct until there are exactly $n$ of them."
            )),
            (K, "Check yourself", (
                "You should be able to: describe spans geometrically, derive the plane equation from two "
                "spanning vectors, and test membership.\n\n"
                "Self-test: what is $\\operatorname{span}\\{(2, 4)\\}$ in $\\mathbb R^2$? "
                "(The line $y = 2x$.)\n\nPractice the node."
            )),
        ],
    },
    "LA.U1.N4": {
        "summary": "Matrix-vector product as a combination of columns: Ax = weighted column sum.",
        "steps": [
            (L, "The column view", (
                "The product $Ax$ is defined so that\n"
                "$$A x = x_1 (\\text{col}_1 A) + x_2 (\\text{col}_2 A) + \\cdots + x_n (\\text{col}_n A)$$\n"
                "— a LINEAR COMBINATION of the columns of $A$, weighted by the entries of $x$.\n\n"
                "This is the single most useful identity in the course: it converts every question about "
                "products $Ax$ into a question about combinations of columns, and vice versa. "
                "$Ax = b$ solvable $\\iff b \\in \\operatorname{span}(\\text{columns of } A)$."
            )),
            (L, "The row view, and shapes", (
                "Row-by-row, $(Ax)_i$ = (row $i$ of $A$) · $x$ — the dot-product recipe used for hand "
                "computation. Both views give the same numbers; the column view explains, the row view "
                "computes.\n\n"
                "Shape discipline: $A$ is $m \\times n$, $x \\in \\mathbb R^n$ (one entry per column), "
                "$Ax \\in \\mathbb R^m$ (one entry per row). Linearity: "
                "$A(u + v) = Au + Av$ and $A(cx) = cAx$ — matrices ARE linear maps (LA.U4.N1)."
            )),
            (E, "Worked example", (
                "$$A = \\begin{pmatrix} 1 & 2 \\\\ 0 & 3 \\\\ -1 & 1 \\end{pmatrix}, \\quad "
                "x = \\begin{pmatrix} 2 \\\\ -1 \\end{pmatrix}.$$\n\n"
                "Column view: $Ax = 2\\begin{pmatrix}1\\\\0\\\\-1\\end{pmatrix} - "
                "1\\begin{pmatrix}2\\\\3\\\\1\\end{pmatrix} = \\begin{pmatrix}0\\\\-3\\\\-3\\end{pmatrix}$.\n\n"
                "Row view: $(1)(2) + (2)(-1) = 0$; $(0)(2) + 3(-1) = -3$; $(-1)(2) + 1(-1) = -3$ — same "
                "answer, of course. A $3 \\times 2$ matrix ate a 2-vector and produced a 3-vector."
            )),
            (P, "Pitfalls", (
                "1. Shape mismatches: $Ax$ needs (columns of $A$) = (entries of $x$).\n\n"
                "2. Computing $Ax$ as combinations of ROWS — it's columns.\n\n"
                "3. Forgetting the output lives in $\\mathbb R^m$, not $\\mathbb R^n$.\n\n"
                "4. Treating $Ax = b$ and column-membership as different problems — they are the SAME "
                "problem; use whichever view is convenient.\n\n"
                "5. Writing $xA$ for $Ax$ — order matters; vectors multiply on the right here."
            )),
            (K, "Check yourself", (
                "You should be able to: compute $Ax$ both ways, predict output shape, and translate "
                "$Ax = b$ into span language instantly.\n\n"
                "Self-test: if $A$'s columns are $(1,0)$ and $(1,1)$, solve $Ax = (3, 1)$ by eye. "
                "($x_2 = 1$, $x_1 = 2$: $2(1,0) + 1(1,1) = (3,1)$.)\n\nPractice the node."
            )),
        ],
    },
    "LA.U1.N5": {
        "summary": "Row picture and column picture: two geometries of the same linear system.",
        "steps": [
            (L, "The row picture", (
                "Each EQUATION of a system is a line (2D), plane (3D), or hyperplane. The solution set is "
                "the INTERSECTION of these objects.\n\n"
                "For $2 \\times 2$: two lines meet in a point (unique solution), are parallel (no "
                "solution), or coincide (infinitely many). This is the picture taught in school algebra — "
                "intersecting constraint sets."
            )),
            (L, "The column picture", (
                "The same system, read as $Ax = b$, asks: WHAT COMBINATION of the columns of $A$ equals "
                "$b$? One vector equation instead of $m$ scalar equations.\n\n"
                "Solvability becomes: is $b$ in the span of the columns? Uniqueness becomes: are the "
                "columns independent? The column picture is the one that scales — nobody visualizes 50 "
                "intersecting hyperplanes, but 'is $b$ in the column span' stays meaningful in any "
                "dimension. Fluency = switching pictures mid-problem without noticing."
            )),
            (E, "Worked example", (
                "System: $x - 2y = 1$, $3x + 2y = 11$.\n\n"
                "ROW: the lines $x - 2y = 1$ and $3x + 2y = 11$ cross at $(3, 1)$.\n\n"
                "COLUMN: $x \\begin{pmatrix}1\\\\3\\end{pmatrix} + y\\begin{pmatrix}-2\\\\2\\end{pmatrix} "
                "= \\begin{pmatrix}1\\\\11\\end{pmatrix}$ — and indeed "
                "$3(1,3) + 1(-2,2) = (1, 11)$.\n\n"
                "Same solution $(3,1)$: in the row picture it is WHERE lines meet; in the column picture "
                "it is the WEIGHTS of the combination."
            )),
            (P, "Pitfalls", (
                "1. Mixing pictures mid-sentence: 'the columns intersect at the solution' — columns "
                "combine, rows (equations) intersect.\n\n"
                "2. In the column picture, plotting $b$'s coordinates as the ANSWER — the answer is the "
                "weight pair, not $b$.\n\n"
                "3. Believing one picture is 'right' — they are equivalent; use rows for geometry of "
                "constraints, columns for solvability structure.\n\n"
                "4. Parallel lines (row) = dependent columns with $b$ off the span (column) — failing to "
                "match the degenerate cases across pictures."
            )),
            (K, "Check yourself", (
                "You should be able to: draw both pictures for a $2 \\times 2$ system and translate each "
                "solvability scenario between them.\n\n"
                "Self-test: in the column picture, what does 'no solution' look like? "
                "($b$ outside the span of the columns.)\n\nPractice the node."
            )),
        ],
    },
    "LA.U1.N6": {
        "summary": "Linear systems as Ax = b: coefficient matrices, augmented matrices, and solution sets.",
        "steps": [
            (L, "Packaging a system", (
                "Any linear system packs into $A x = b$: coefficients into the matrix $A$ ($m$ equations "
                "→ $m$ rows; $n$ unknowns → $n$ columns), unknowns into $x$, right sides into $b$.\n\n"
                "For elimination, staple $b$ on as an extra column: the AUGMENTED matrix "
                "$[A \\mid b]$. Each row is one equation; the vertical bar remembers where '=' was.\n\n"
                "The payoff: solving becomes mechanical row manipulation (LA.U1.N7) instead of ad-hoc "
                "substitution."
            )),
            (L, "The three possible solution sets", (
                "Every linear system — any size — has exactly one of:\n\n"
                "1. NO solution (inconsistent): the equations conflict.\n"
                "2. A UNIQUE solution.\n"
                "3. INFINITELY many solutions (free variables present).\n\n"
                "Never 'exactly two' or 'exactly five': if two distinct solutions exist, the whole line "
                "through them solves too (linearity). Which case occurs is read off the echelon form: "
                "a pivot in the augmented column → case 1; otherwise pivots in every variable column → "
                "case 2; missing pivots → case 3."
            )),
            (E, "Worked example", (
                "System: $x + 2y - z = 3$; $2x + 4y - 2z = 6$; $y + z = 1$.\n\n"
                "$$[A \\mid b] = \\left[\\begin{array}{ccc|c} 1 & 2 & -1 & 3 \\\\ 2 & 4 & -2 & 6 \\\\ "
                "0 & 1 & 1 & 1 \\end{array}\\right]$$\n\n"
                "Row 2 is exactly twice row 1 — one equation is redundant. Two independent equations, "
                "three unknowns → infinitely many solutions (case 3). The system never had a chance at "
                "uniqueness; the matrix form made that visible at a glance."
            )),
            (P, "Pitfalls", (
                "1. Misaligned columns: every equation must list variables in the SAME order, with 0 "
                "coefficients for missing ones.\n\n"
                "2. Signs lost moving terms to standard form ($x = 2y + 1$ → $x - 2y = 1$).\n\n"
                "3. Forgetting the augmented column during row operations — $b$ must ride along.\n\n"
                "4. Claiming 'two solutions' — linear systems don't do that.\n\n"
                "5. Reading inconsistency from a zero ROW ($0 = 0$ is fine; $0 = c \\ne 0$ is the "
                "contradiction)."
            )),
            (K, "Check yourself", (
                "You should be able to: convert systems ↔ matrix form, set up augmented matrices, and "
                "name the three solution-set cases with their echelon signatures.\n\n"
                "Self-test: what does the row $[0\\; 0\\; 0 \\mid 5]$ mean? ($0 = 5$: inconsistent, "
                "no solution.)\n\nPractice the node."
            )),
        ],
    },
    "LA.U1.N7": {
        "summary": "Gaussian elimination: row operations to echelon form, then back-substitution.",
        "steps": [
            (L, "The three row operations", (
                "Elimination uses exactly three moves, each reversible, none changing the solution set:\n\n"
                "1. Swap two rows.\n"
                "2. Multiply a row by a NONZERO constant.\n"
                "3. Add a multiple of one row to another.\n\n"
                "Goal: ROW ECHELON FORM — each row's leading (first nonzero) entry sits strictly to the "
                "right of the one above; zero rows at the bottom. The staircase of leading entries are "
                "the PIVOTS."
            )),
            (L, "The algorithm and back-substitution", (
                "Work column by column: use the pivot to zero out everything BELOW it (row operation 3 "
                "with multiplier $\\ell = \\frac{\\text{entry}}{\\text{pivot}}$), then move to the next "
                "column and the next row. Swap rows if a prospective pivot is 0.\n\n"
                "Echelon form solves by BACK-SUBSTITUTION: bottom equation gives the last variable; feed "
                "upward. Cost bookkeeping (for the numerically curious): elimination is "
                "$\\sim \\frac{n^3}{3}$ multiplications — the workhorse's price tag."
            )),
            (E, "Worked example", (
                "Solve: $x + 2y + z = 4$; $2x + 5y + 3z = 10$; $-x + y + 2z = 3$.\n\n"
                "$R_2 \\!-\\! 2R_1$: $(0, 1, 1 \\mid 2)$. $R_3 \\!+\\! R_1$: $(0, 3, 3 \\mid 7)$.\n"
                "$R_3 - 3R_2$: $(0, 0, 0 \\mid 1)$ — the row $0 = 1$.\n\n"
                "INCONSISTENT: no solution, discovered mechanically in three moves. (Change the last "
                "right side from 3 to 2 and the same elimination gives $0 = 0$ → infinitely many — the "
                "procedure, unchanged, diagnoses every case.)"
            )),
            (P, "Pitfalls", (
                "1. Arithmetic slips in row operation 3 — write the multiplier explicitly, update EVERY "
                "entry including the augmented column.\n\n"
                "2. Multiplying a row by 0 (illegal — destroys information).\n\n"
                "3. Using a 0 pivot instead of swapping.\n\n"
                "4. 'Combining' two row operations in one step and losing track — one at a time.\n\n"
                "5. Eliminating ABOVE pivots during forward elimination (that's RREF's job later; "
                "forward pass only clears below).\n\n"
                "6. Back-substitution started from the top."
            )),
            (K, "Check yourself", (
                "You should be able to: run forward elimination with explicit multipliers, handle swaps, "
                "diagnose all three outcomes, and back-substitute.\n\n"
                "Self-test: after elimination a system reads $x + y = 3$, $2y = 4$. Solve. "
                "($y = 2$, then $x = 1$.)\n\nPractice the node."
            )),
        ],
    },
    "LA.U1.N8": {
        "summary": "Reduced row echelon form and pivots: the canonical form and what pivots decide.",
        "steps": [
            (L, "From REF to RREF", (
                "REDUCED row echelon form sharpens echelon form with two extra requirements: every pivot "
                "equals 1, and each pivot is the ONLY nonzero entry in its column (zeros above as well as "
                "below).\n\n"
                "Reach it by continuing elimination upward and rescaling rows. Unlike REF (many are "
                "possible), the RREF of a matrix is UNIQUE — a canonical fingerprint. Solutions read off "
                "directly, no back-substitution."
            )),
            (L, "What pivots decide", (
                "The pivot positions encode everything:\n\n"
                "• Pivot in every VARIABLE column → unique solution (if consistent).\n"
                "• Column without a pivot → that variable is FREE (LA.U1.N9) → infinitely many.\n"
                "• Pivot in the AUGMENTED column → $0 = 1$ → inconsistent.\n\n"
                "The number of pivots is the RANK (LA.U5.N1) — the true number of independent equations. "
                "Pivot count ≤ min(rows, columns), which is why wide systems (more unknowns than "
                "equations) can never have unique solutions."
            )),
            (E, "Worked example", (
                "$$\\left[\\begin{array}{ccc|c} 1 & 2 & 0 & 3 \\\\ 0 & 0 & 1 & -1 \\\\ 0 & 0 & 0 & 0 "
                "\\end{array}\\right] \\quad (\\text{RREF})$$\n\n"
                "Pivots in columns 1 and 3; column 2 has none → $y$ free. Read directly:\n"
                "$$x = 3 - 2y, \\quad z = -1, \\quad y \\text{ free}.$$\n\n"
                "Solution set: $(3, 0, -1) + y(-2, 1, 0)$ — a line in $\\mathbb R^3$. Rank 2, one free "
                "variable, consistent: every structural fact visible at a glance."
            )),
            (P, "Pitfalls", (
                "1. Stopping at REF and calling it RREF (zeros must be ABOVE pivots too, pivots must be "
                "1).\n\n"
                "2. Believing REF is unique — only RREF is.\n\n"
                "3. Counting pivots per ROW and per COLUMN as different numbers — each pivot occupies one "
                "row and one column; the counts agree.\n\n"
                "4. A pivot in the augmented column read as 'the constant is determined' instead of "
                "'inconsistent.'\n\n"
                "5. Rescaling rows sloppily and dragging fractions through every later step — order of "
                "operations matters for sanity."
            )),
            (K, "Check yourself", (
                "You should be able to: finish RREF from REF, read the solution set directly, and "
                "extract rank and free variables from pivot positions.\n\n"
                "Self-test: RREF has pivots in all 3 variable columns and no bad row — how many "
                "solutions? (Exactly one.)\n\nPractice the node."
            )),
        ],
    },
    "LA.U1.N9": {
        "summary": "Free variables: parameterizing infinite solution sets.",
        "steps": [
            (L, "Basic vs free", (
                "After elimination, each variable is either BASIC (its column has a pivot) or FREE (no "
                "pivot). Free variables can take ANY value; the basic ones are then determined.\n\n"
                "The recipe: assign a parameter to each free variable ($y = t$, $w = s$, ...), then "
                "express every basic variable in terms of the parameters via the pivot equations.\n\n"
                "Number of free variables $= n - \\operatorname{rank}$ — the dimension of the solution "
                "set's 'freedom.'"
            )),
            (L, "Vector form of the solution", (
                "Collect the parameterized solution into vectors:\n"
                "$$x = p + t\\, v_1 + s\\, v_2 + \\cdots$$\n"
                "— a PARTICULAR solution $p$ (parameters all 0) plus the span of the free directions. "
                "Geometrically: a point, line, plane... shifted away from the origin unless $b = 0$.\n\n"
                "This structure — particular + homogeneous — is universal (it returns for ODEs in "
                "ODE.U2.N6). Choosing different free variables gives a different but equivalent "
                "parameterization of the SAME set."
            )),
            (E, "Worked example", (
                "From RREF: $x + 2y - z = 1$, $w + 3z = 2$ (variables $x, y, z, w$; pivots on $x, w$).\n\n"
                "Free: $y = t$, $z = s$. Basic: $x = 1 - 2t + s$, $w = 2 - 3s$.\n\n"
                "$$\\begin{pmatrix}x\\\\y\\\\z\\\\w\\end{pmatrix} = "
                "\\begin{pmatrix}1\\\\0\\\\0\\\\2\\end{pmatrix} + "
                "t\\begin{pmatrix}-2\\\\1\\\\0\\\\0\\end{pmatrix} + "
                "s\\begin{pmatrix}1\\\\0\\\\1\\\\-3\\end{pmatrix}$$\n\n"
                "A plane in $\\mathbb R^4$. Check: parameters $(0,0)$ satisfy both equations ✓."
            )),
            (P, "Pitfalls", (
                "1. Choosing BASIC variables as parameters — parameters go on the pivot-less columns.\n\n"
                "2. Forgetting a free variable appears in ITS OWN vector-form slot with entry 1.\n\n"
                "3. Sign errors moving free terms across: $x + 2y = 1$ gives $x = 1 - 2y$, not "
                "$1 + 2y$.\n\n"
                "4. Reporting only the particular solution and dropping the free directions.\n\n"
                "5. Believing a different parameterization means a wrong answer — verify by substituting, "
                "not by comparing letters."
            )),
            (K, "Check yourself", (
                "You should be able to: split variables basic/free, parameterize, and write solutions in "
                "vector form.\n\n"
                "Self-test: one equation $x + y + z = 2$ in $\\mathbb R^3$ — how many free variables, and "
                "what is the solution set? (Two; a plane: $(2,0,0) + t(-1,1,0) + s(-1,0,1)$.)\n\n"
                "Practice the node."
            )),
        ],
    },
    "LA.U1.N10": {
        "summary": "Existence and uniqueness: when Ax = b has solutions, and when only one.",
        "steps": [
            (L, "Existence", (
                "$Ax = b$ has a solution $\\iff$ $b$ is a combination of $A$'s columns $\\iff$ elimination "
                "produces NO row $[0 \\cdots 0 \\mid c]$ with $c \\ne 0$.\n\n"
                "'Solvable for EVERY $b$' is stronger: it requires a pivot in every ROW "
                "(rank $= m$) — the columns span $\\mathbb R^m$. A single $b$ can be lucky; every-$b$ "
                "solvability is a property of $A$ alone."
            )),
            (L, "Uniqueness", (
                "A consistent system has a UNIQUE solution $\\iff$ there are no free variables $\\iff$ "
                "pivot in every COLUMN (rank $= n$) $\\iff$ the columns are linearly independent.\n\n"
                "Existence is about ROWS (reaching every target); uniqueness is about COLUMNS (no "
                "redundancy). For square $n \\times n$ matrices the two conditions coincide: rank $n$ "
                "means invertible, and $x = A^{-1} b$ exists and is unique for every $b$. Non-square "
                "matrices can have at most one of the two properties."
            )),
            (E, "Worked example", (
                "$A$ is $3 \\times 2$ with independent columns (rank 2).\n\n"
                "UNIQUENESS: pivots in both columns → no free variables → any solution is unique.\n"
                "EXISTENCE: only 2 pivots for 3 rows → the columns span a plane inside $\\mathbb R^3$ → "
                "most $b$'s are UNSOLVABLE (only those on the plane work).\n\n"
                "Flip it: a $2 \\times 3$ matrix with rank 2 solves EVERY $b \\in \\mathbb R^2$ but never "
                "uniquely (a free variable remains). Tall matrices ration existence; wide ones ration "
                "uniqueness."
            )),
            (P, "Pitfalls", (
                "1. Conflating the two questions — a system can have each without the other.\n\n"
                "2. 'Independent columns' read as 'solvable' — independence gives uniqueness, not "
                "existence.\n\n"
                "3. Assuming a tall system ($m > n$) is inconsistent — it CAN be consistent for special "
                "$b$.\n\n"
                "4. Assuming a wide system ($n > m$) always solvable — rank can still fall short of "
                "$m$.\n\n"
                "5. For square matrices, checking invertibility with determinants when elimination is "
                "already done — pivot count answers it directly."
            )),
            (K, "Check yourself", (
                "You should be able to: separate existence from uniqueness, tie each to pivots in "
                "rows/columns, and reason about tall vs wide vs square shapes.\n\n"
                "Self-test: $4 \\times 4$, rank 4 — how many solutions does $Ax = b$ have? "
                "(Exactly one, for every $b$.)\n\nPractice the node."
            )),
        ],
    },
    "LA.U1.N11": {
        "summary": "Homogeneous systems: Ax = 0, the null space preview, and the structure of general solutions.",
        "steps": [
            (L, "Always consistent", (
                "A HOMOGENEOUS system has zero right side: $Ax = \\mathbf 0$. It is never inconsistent — "
                "$x = \\mathbf 0$ (the TRIVIAL solution) always works.\n\n"
                "The real question: are there OTHERS? Nontrivial solutions exist $\\iff$ free variables "
                "exist $\\iff$ rank $< n$ $\\iff$ the columns of $A$ are dependent. In particular, any "
                "system with MORE UNKNOWNS THAN EQUATIONS ($n > m$) automatically has nontrivial "
                "solutions."
            )),
            (L, "Solution structure", (
                "The solution set of $Ax = 0$ is closed under addition and scaling (if $Au = Av = 0$ then "
                "$A(cu + dv) = 0$) — it is a SUBSPACE, the NULL SPACE of $A$ (formalized in LA.U3.N2).\n\n"
                "And it explains nonhomogeneous solution sets: if $Ap = b$, then EVERY solution of "
                "$Ax = b$ is $p + (\\text{null-space vector})$. General = particular + homogeneous — "
                "the geometry of LA.U1.N9's vector form, now with a name."
            )),
            (E, "Worked example", (
                "Solve $Ax = 0$ for $A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 2 & 4 & 6 \\end{pmatrix}$.\n\n"
                "$R_2 - 2R_1$ → row of zeros. One pivot (column 1), so $y = t$, $z = s$ free and "
                "$x = -2t - 3s$:\n"
                "$$x = t\\begin{pmatrix}-2\\\\1\\\\0\\end{pmatrix} + s\\begin{pmatrix}-3\\\\0\\\\1\\end{pmatrix}$$\n"
                "— a plane through the origin (the null space, dimension $3 - 1 = 2$).\n\n"
                "3 unknowns, effectively 1 equation: nontrivial solutions were guaranteed before we "
                "computed anything."
            )),
            (P, "Pitfalls", (
                "1. Testing consistency of a homogeneous system — it always is; skip to counting free "
                "variables.\n\n"
                "2. Reporting only $x = 0$ when free variables exist.\n\n"
                "3. Augmenting with the zero column and hauling it through elimination — it never "
                "changes; work with $A$ alone.\n\n"
                "4. Believing $n > m$ guarantees nontrivial solutions for NONhomogeneous systems too "
                "(those can be inconsistent).\n\n"
                "5. Missing that the solution set is a subspace only when $b = 0$ — for $b \\ne 0$ it is "
                "a shifted (affine) set."
            )),
            (K, "Check yourself", (
                "You should be able to: solve homogeneous systems, predict nontrivial solutions from "
                "shape/rank, and state the particular + homogeneous decomposition.\n\n"
                "Self-test: $A$ is $3 \\times 5$. Must $Ax = 0$ have nontrivial solutions? "
                "(Yes — rank ≤ 3 < 5 unknowns: at least 2 free variables.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------ U2: matrix algebra ------------------------------
    "LA.U2.N1": {
        "summary": "Matrix multiplication: definition, shape rules, and non-commutativity.",
        "steps": [
            (L, "The definition", (
                "For $A$ ($m \\times n$) and $B$ ($n \\times p$), the product $AB$ is $m \\times p$ with\n"
                "$$(AB)_{ij} = \\text{(row } i \\text{ of } A) \\cdot \\text{(col } j \\text{ of } B) "
                "= \\sum_k a_{ik} b_{kj}.$$\n\n"
                "Inner dimensions must MATCH ($n = n$); outer dimensions give the shape. Column view: "
                "each column of $AB$ is $A$ times the corresponding column of $B$ — matrix multiplication "
                "is $Ax$ done in bulk.\n\n"
                "Why this definition? So that $AB$ represents the COMPOSITION of the two linear maps: "
                "first apply $B$, then $A$."
            )),
            (L, "Algebra: what holds and what breaks", (
                "HOLDS: associativity $(AB)C = A(BC)$, distributivity, scalar slides through, "
                "$(AB)^T = B^T A^T$ (order reverses).\n\n"
                "BREAKS:\n"
                "• $AB \\ne BA$ in general — non-commutativity is the rule, not the exception.\n"
                "• $AB = 0$ does NOT force $A = 0$ or $B = 0$.\n"
                "• $AB = AC$ does NOT force $B = C$ (no cancellation without invertibility).\n\n"
                "The identity $I$ (ones on the diagonal) is the multiplicative unit: $AI = IA = A$."
            )),
            (E, "Worked example", (
                "$$A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}, \\quad "
                "B = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}.$$\n\n"
                "$$AB = \\begin{pmatrix} 2 & 1 \\\\ 4 & 3 \\end{pmatrix}, \\qquad "
                "BA = \\begin{pmatrix} 3 & 4 \\\\ 1 & 2 \\end{pmatrix}.$$\n\n"
                "$AB$ swapped the COLUMNS of $A$; $BA$ swapped the ROWS — multiplying by $B$ on the "
                "right acts on columns, on the left acts on rows, and the two are visibly different. "
                "$AB \\ne BA$ with the simplest possible ingredients."
            )),
            (P, "Pitfalls", (
                "1. Multiplying entrywise (the Hadamard error) — matrix product is row·column.\n\n"
                "2. Shape errors: $2\\times3$ times $2\\times3$ is undefined.\n\n"
                "3. Assuming commutativity when simplifying ($(A+B)^2 = A^2 + 2AB + B^2$ is FALSE unless "
                "$AB = BA$; correct: $A^2 + AB + BA + B^2$).\n\n"
                "4. Canceling: from $AB = AC$ concluding $B = C$.\n\n"
                "5. Transposing a product without reversing: $(AB)^T \\ne A^T B^T$."
            )),
            (K, "Check yourself", (
                "You should be able to: multiply with the row·column recipe, verify shapes first, and "
                "expand expressions without illegal commuting.\n\n"
                "Self-test: expand $(A + I)(A - I)$. ($A^2 - A + A - I = A^2 - I$ — legal here because "
                "$I$ commutes with everything.)\n\nPractice the node."
            )),
        ],
    },
    "LA.U2.N2": {
        "summary": "Matrix inverse (2x2): the formula, when it exists, and solving Ax = b with it.",
        "steps": [
            (L, "The inverse", (
                "$A^{-1}$ is the matrix with $A A^{-1} = A^{-1} A = I$. It exists (A is INVERTIBLE / "
                "nonsingular) exactly when elimination yields $n$ pivots — for $2 \\times 2$, exactly "
                "when the DETERMINANT $ad - bc \\ne 0$:\n"
                "$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}^{-1} "
                "= \\frac{1}{ad - bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}.$$\n\n"
                "The recipe: swap the diagonal, negate the off-diagonal, divide by the determinant."
            )),
            (L, "Using inverses", (
                "If $A$ is invertible, $Ax = b$ has the unique solution $x = A^{-1} b$ — conceptually "
                "central, computationally secondary (elimination is cheaper for a single $b$; inverses "
                "shine when many right sides share one $A$, or in formulas).\n\n"
                "Properties: $(A^{-1})^{-1} = A$; $(AB)^{-1} = B^{-1} A^{-1}$ — ORDER REVERSES, like "
                "socks and shoes; $(A^T)^{-1} = (A^{-1})^T$. A product is invertible iff each factor is."
            )),
            (E, "Worked example", (
                "$A = \\begin{pmatrix} 2 & 1 \\\\ 5 & 3 \\end{pmatrix}$: $\\det = 6 - 5 = 1$, so\n"
                "$$A^{-1} = \\begin{pmatrix} 3 & -1 \\\\ -5 & 2 \\end{pmatrix}.$$\n\n"
                "Solve $Ax = (4, 11)$: $x = A^{-1} b = (3\\cdot4 - 11, \\; -20 + 22) = (1, 2)$.\n\n"
                "Check: $2(1) + 1(2) = 4$ ✓, $5(1) + 3(2) = 11$ ✓. Contrast: "
                "$\\begin{pmatrix} 2 & 4 \\\\ 1 & 2\\end{pmatrix}$ has $\\det = 0$ — proportional "
                "rows, no inverse, and $Ax = b$ is solvable only for special $b$."
            )),
            (P, "Pitfalls", (
                "1. Forgetting to divide by the determinant (the most common slip).\n\n"
                "2. Negating the diagonal and swapping the off-diagonal — it's the other way around.\n\n"
                "3. Applying the $2\\times2$ shortcut to bigger matrices.\n\n"
                "4. $(AB)^{-1} = A^{-1}B^{-1}$ — order must reverse.\n\n"
                "5. Writing $\\frac{b}{A}$ or 'dividing by a matrix' — only multiplication by $A^{-1}$, "
                "and its SIDE matters: $A^{-1}b \\ne bA^{-1}$.\n\n"
                "6. Assuming invertibility mid-derivation without checking $\\det \\ne 0$."
            )),
            (K, "Check yourself", (
                "You should be able to: invert $2\\times2$s by formula, detect singularity via the "
                "determinant, solve small systems by inverse, and manipulate inverse identities.\n\n"
                "Self-test: invert $\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$. "
                "($\\det = -2$; $\\frac{1}{-2}\\begin{pmatrix} 4 & -2 \\\\ -3 & 1 \\end{pmatrix} = "
                "\\begin{pmatrix} -2 & 1 \\\\ 1.5 & -0.5 \\end{pmatrix}$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------ U3: subspaces ------------------------------
    "LA.U3.N1": {
        "summary": "Subspaces: closure under addition and scaling, and the standard examples.",
        "steps": [
            (L, "The definition", (
                "A SUBSPACE of $\\mathbb R^n$ is a nonempty subset $S$ closed under the two operations:\n\n"
                "1. $u, v \\in S \\Rightarrow u + v \\in S$;\n"
                "2. $v \\in S, c \\in \\mathbb R \\Rightarrow cv \\in S$.\n\n"
                "Consequences: $\\mathbf 0 \\in S$ always (take $c = 0$) — the fastest disqualifier: no "
                "origin, no subspace. Every span is a subspace, and every subspace is a span of some "
                "vectors. In $\\mathbb R^3$ the complete list: $\\{\\mathbf 0\\}$, lines through 0, "
                "planes through 0, and $\\mathbb R^3$ itself."
            )),
            (L, "Testing sets", (
                "To verify: check both closures for ARBITRARY elements. To refute: one concrete "
                "counterexample.\n\n"
                "• The plane $x + y + z = 0$: closed (sums and multiples keep the sum zero) — subspace.\n"
                "• The plane $x + y + z = 1$: misses $\\mathbf 0$ — not.\n"
                "• The first quadrant: closed under addition, but $-1 \\cdot (1,1)$ escapes — not.\n"
                "• The union of two lines: each closed alone, but sums cross between them — not.\n\n"
                "Solution sets of HOMOGENEOUS systems are subspaces; of nonhomogeneous, never."
            )),
            (E, "Worked example", (
                "Is $S = \\{(x, y, z) : z = 2x - y\\}$ a subspace of $\\mathbb R^3$?\n\n"
                "Rewrite: $2x - y - z = 0$ — homogeneous. Take $u = (x_1, y_1, 2x_1 - y_1)$, "
                "$v = (x_2, y_2, 2x_2 - y_2)$: the sum's third component is "
                "$2(x_1 + x_2) - (y_1 + y_2)$ ✓; scaling likewise ✓.\n\n"
                "YES — and it is $\\operatorname{span}\\{(1, 0, 2), (0, 1, -1)\\}$: the abstract test and "
                "the span description are two views of the same plane."
            )),
            (P, "Pitfalls", (
                "1. Skipping the $\\mathbf 0$ check — it kills most non-examples instantly.\n\n"
                "2. Verifying closure on ONE example pair (must be arbitrary).\n\n"
                "3. Forgetting scalar closure includes NEGATIVE and zero scalars.\n\n"
                "4. 'It's a plane, so it's a subspace' — only planes THROUGH THE ORIGIN.\n\n"
                "5. Unions of subspaces assumed subspaces (intersections are; unions almost never)."
            )),
            (K, "Check yourself", (
                "You should be able to: run the two-closure test, refute with counterexamples, and "
                "convert between defining equations and span form.\n\n"
                "Self-test: is $\\{(x, y) : xy \\ge 0\\}$ a subspace? "
                "(No: $(1,0) + (0,-1)$... actually check $(1, 2) + (-2, -1) = (-1, 1)$, product "
                "$-1 < 0$ — addition fails.)\n\nPractice the node."
            )),
        ],
    },
    "LA.U3.N2": {
        "summary": "Null space: all solutions of Ax = 0, its basis from free variables, and its dimension.",
        "steps": [
            (L, "The definition", (
                "The NULL SPACE $N(A)$ is the set of ALL solutions of $Ax = \\mathbf 0$ — a subspace of "
                "$\\mathbb R^n$ (closure follows from linearity of $A$; LA.U1.N11 checked it).\n\n"
                "It measures how far $A$ is from being one-to-one: $N(A) = \\{\\mathbf 0\\}$ exactly when "
                "columns are independent, exactly when solutions of $Ax = b$ (when they exist) are "
                "unique. A fat null space = many inputs collapsing to the same output."
            )),
            (L, "Computing a basis", (
                "Eliminate to RREF, parameterize by free variables, and write the vector form: the "
                "vectors multiplying each parameter are the SPECIAL SOLUTIONS, and they form a BASIS of "
                "$N(A)$ — independent (each has a lone 1 in its own free slot) and spanning by "
                "construction.\n\n"
                "$$\\dim N(A) = n - \\operatorname{rank}(A) = \\#\\text{free variables}$$\n"
                "— the rank-nullity count (LA.U5.N2). Row operations never change the null space "
                "(same solutions throughout), which is WHY elimination computes it."
            )),
            (E, "Worked example", (
                "$$A = \\begin{pmatrix} 1 & 2 & 0 & 1 \\\\ 0 & 0 & 1 & 2 \\end{pmatrix} \\;(\\text{already RREF}).$$\n\n"
                "Pivots: columns 1, 3. Free: $x_2 = t$, $x_4 = s$. Then $x_1 = -2t - s$, $x_3 = -2s$:\n"
                "$$N(A) = \\operatorname{span}\\left\\{ (-2, 1, 0, 0), \\; (-1, 0, -2, 1) \\right\\},$$\n"
                "dimension $4 - 2 = 2$.\n\n"
                "Verify one: $A(-2, 1, 0, 0) = (-2 + 2, 0) = \\mathbf 0$ ✓ — always spot-check a basis "
                "vector."
            )),
            (P, "Pitfalls", (
                "1. Null space of the RREF confused with 'columns of the RREF' — the null space is about "
                "SOLUTIONS; special solutions come from the parameterization.\n\n"
                "2. Sign errors moving pivot-equation terms across ($x_1 = -2x_2 - x_4$).\n\n"
                "3. Reporting dimension = number of pivots (it's $n$ MINUS pivots).\n\n"
                "4. Thinking row operations change $N(A)$ — they don't (they DO change the column "
                "space).\n\n"
                "5. Nonzero $b$: solutions of $Ax = b$ are NOT a null space (not a subspace at all)."
            )),
            (K, "Check yourself", (
                "You should be able to: compute null-space bases via special solutions, state the "
                "dimension formula, and connect trivial null space to uniqueness.\n\n"
                "Self-test: $A$ is $3 \\times 3$ with rank 3. What is $N(A)$? "
                "($\\{\\mathbf 0\\}$, dimension 0.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------ U4 ------------------------------
    "LA.U4.N1": {
        "summary": "Linear transformations: maps preserving addition and scaling, and their matrices.",
        "steps": [
            (L, "The definition", (
                "$T: \\mathbb R^n \\to \\mathbb R^m$ is LINEAR when it preserves the two operations:\n"
                "$$T(u + v) = T(u) + T(v), \\qquad T(cv) = c\\,T(v).$$\n\n"
                "Consequences: $T(\\mathbf 0) = \\mathbf 0$ (quick disqualifier), and $T$ is determined "
                "by its values on any basis — linearity propagates those values to every combination.\n\n"
                "Linear: rotations, reflections, scalings, projections, shears. NOT linear: translations "
                "($T(x) = x + b$ moves the origin), norms, anything with squares."
            )),
            (L, "Every linear map is a matrix", (
                "Feed $T$ the standard basis vectors $e_1, \\ldots, e_n$; stack the outputs as columns:\n"
                "$$A = \\big[\\, T(e_1) \\;\\; T(e_2) \\cdots T(e_n) \\,\\big] \\quad \\Rightarrow \\quad T(x) = Ax.$$\n\n"
                "The matrix's columns are literally 'where the basis vectors go.' Rotation by $\\theta$ "
                "in $\\mathbb R^2$: $e_1 \\mapsto (\\cos\\theta, \\sin\\theta)$, "
                "$e_2 \\mapsto (-\\sin\\theta, \\cos\\theta)$, giving the rotation matrix\n"
                "$$R_\\theta = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}.$$\n"
                "Composition of maps = product of matrices (in application order, right to left)."
            )),
            (E, "Worked example", (
                "Find the matrix of reflection across the line $y = x$ in $\\mathbb R^2$.\n\n"
                "Where do basis vectors go? $e_1 = (1,0) \\mapsto (0,1)$; $e_2 = (0,1) \\mapsto (1,0)$.\n"
                "$$A = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}.$$\n\n"
                "Check on $(3, 1)$: $A(3,1) = (1,3)$ — coordinates swapped, exactly reflection across "
                "$y = x$ ✓. Two basis images, and the whole map is pinned down."
            )),
            (P, "Pitfalls", (
                "1. Calling translation linear — $T(\\mathbf 0) \\ne \\mathbf 0$ ends it (it is AFFINE).\n\n"
                "2. Checking linearity on specific vectors only — the properties must hold for ALL.\n\n"
                "3. Building $A$ from images of NON-standard vectors without solving back to the basis "
                "first.\n\n"
                "4. Composing in the wrong order: 'rotate then project' is $P R$, not $R P$ — the first "
                "map sits nearest $x$.\n\n"
                "5. Rotation matrix with the minus sign misplaced (check: $\\theta = 90°$ must send "
                "$e_1 \\to e_2$)."
            )),
            (K, "Check yourself", (
                "You should be able to: verify/refute linearity, extract the matrix from basis images, "
                "and compose transformations by multiplication.\n\n"
                "Self-test: matrix of 'project onto the $x$-axis'? "
                "($\\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}$ — and note $P^2 = P$.)\n\n"
                "Practice the node."
            )),
        ],
    },
    "LA.U4.N2": {
        "summary": "Determinant as area scale: |det| is the volume-scaling factor; sign is orientation.",
        "steps": [
            (L, "The geometric meaning", (
                "A $2\\times2$ matrix $A$ sends the unit square to the parallelogram spanned by its "
                "columns, whose area is $|\\det A|$. In general:\n\n"
                "$$\\text{(area/volume after)} = |\\det A| \\times \\text{(area/volume before)}$$\n"
                "for EVERY region, not just the square. The SIGN records orientation: negative "
                "determinant = the map flips handedness (a reflection is hiding inside).\n\n"
                "$\\det A = 0$ means the parallelogram is squashed flat — the map collapses dimension, "
                "which is exactly why singular matrices aren't invertible: you can't un-flatten."
            )),
            (L, "Reading transformations", (
                "• Rotation: $\\det R_\\theta = \\cos^2\\theta + \\sin^2\\theta = 1$ — areas preserved, "
                "no flip.\n"
                "• Reflection: $\\det = -1$ — areas preserved, orientation flipped.\n"
                "• Scaling by $(a, b)$: $\\det = ab$.\n"
                "• Shear $\\begin{pmatrix} 1 & k \\\\ 0 & 1 \\end{pmatrix}$: $\\det = 1$ — shears slide "
                "without changing area.\n\n"
                "Multiplicativity, geometrically obvious: $\\det(AB) = \\det A \\det B$ — scale by one "
                "factor, then the other. (This determinant-as-scale idea is exactly the Jacobian in "
                "C311's change of variables.)"
            )),
            (E, "Worked example", (
                "$A = \\begin{pmatrix} 3 & 1 \\\\ 1 & 2 \\end{pmatrix}$: $\\det A = 6 - 1 = 5$.\n\n"
                "The unit square → parallelogram on $(3,1)$ and $(1,2)$, area 5, orientation kept.\n\n"
                "A triangle with area 2 maps to a triangle of area $5 \\times 2 = 10$ — no vertices "
                "needed, the determinant answers for every shape at once. Swap the columns: "
                "$\\det = 1 - 6 = -5$ — same area, orientation now reversed."
            )),
            (P, "Pitfalls", (
                "1. Reporting the area as $\\det$ instead of $|\\det|$ (areas aren't negative).\n\n"
                "2. Reading $\\det = 1$ as 'the identity map' — shears and rotations also have "
                "$\\det = 1$.\n\n"
                "3. 'Determinant of a $2\\times3$ matrix' — determinants need SQUARE matrices.\n\n"
                "4. $\\det(A + B) = \\det A + \\det B$: FALSE; only the product rule holds.\n\n"
                "5. $\\det(cA) = c \\det A$: false too — every column scales, so it's $c^n \\det A$."
            )),
            (K, "Check yourself", (
                "You should be able to: compute areas of images, read orientation from the sign, and use "
                "multiplicativity.\n\n"
                "Self-test: $\\det A = -2$; a region of area 3 maps to...? "
                "(Area 6, orientation flipped.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------ U5 ------------------------------
    "LA.U5.N1": {
        "summary": "Rank: the number of pivots, equal for rows and columns, and what it measures.",
        "steps": [
            (L, "The definition", (
                "$\\operatorname{rank}(A)$ = number of pivots in the echelon form = dimension of the "
                "COLUMN SPACE (independent columns) = dimension of the ROW SPACE (independent rows).\n\n"
                "Row rank = column rank — for every matrix, however lopsided. A $1000 \\times 3$ matrix "
                "has rank at most 3, so at most 3 of its 1000 rows are independent.\n\n"
                "Rank measures the TRUE information content: how many genuinely different equations, how "
                "many genuinely different directions the columns reach."
            )),
            (L, "Rank in use", (
                "• $\\operatorname{rank} \\le \\min(m, n)$; equality = FULL rank.\n"
                "• Full COLUMN rank ($= n$): independent columns, unique solutions, trivial null space.\n"
                "• Full ROW rank ($= m$): every $b$ reachable.\n"
                "• Square + full rank = invertible.\n\n"
                "Rank is found by elimination, not inspection — a matrix with no visible proportional "
                "rows can still be rank-deficient. Products: $\\operatorname{rank}(AB) \\le "
                "\\min(\\operatorname{rank} A, \\operatorname{rank} B)$ — multiplication never creates "
                "information."
            )),
            (E, "Worked example", (
                "$$A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 2 & 4 & 7 \\\\ 3 & 6 & 10 \\end{pmatrix}$$\n\n"
                "$R_2 - 2R_1 = (0, 0, 1)$; $R_3 - 3R_1 = (0, 0, 1)$; then $R_3 - R_2 = 0$.\n"
                "Two pivots → rank 2.\n\n"
                "Reading: columns 1 and 2 are proportional ($c_2 = 2c_1$), so the three columns span "
                "only a plane. And any system $Ax = b$ is solvable only when $b$ lies on that plane — "
                "one rank computation answers questions in every direction."
            )),
            (P, "Pitfalls", (
                "1. Guessing rank from nonzero entries — eliminate first.\n\n"
                "2. Believing row rank and column rank can differ.\n\n"
                "3. Rank = number of nonzero ROWS of the original matrix (only true AFTER reduction).\n\n"
                "4. 'Rank 0' panic — only the zero matrix has rank 0.\n\n"
                "5. Assuming rank adds under products or sums — only inequalities hold."
            )),
            (K, "Check yourself", (
                "You should be able to: compute rank by elimination, interpret full row/column rank, and "
                "bound ranks of products.\n\n"
                "Self-test: what ranks are possible for a $3 \\times 5$ matrix? (0, 1, 2, or 3.)\n\n"
                "Practice the node."
            )),
        ],
    },
    "LA.U5.N2": {
        "summary": "Rank-nullity: rank + dim(null space) = number of columns, and its consequences.",
        "steps": [
            (L, "The theorem", (
                "For $A$ with $n$ columns:\n"
                "$$\\operatorname{rank}(A) + \\dim N(A) = n.$$\n\n"
                "Interpretation: each of the $n$ input dimensions is either PRESERVED (pivot → "
                "contributes to the output span) or COLLAPSED (free → contributes a null direction). "
                "None are lost, none created.\n\n"
                "In map language: $\\dim(\\text{image}) + \\dim(\\text{kernel}) = \\dim(\\text{domain})$."
            )),
            (L, "Consequences", (
                "The theorem is a conservation law you can compute with:\n\n"
                "• A $5 \\times 8$ matrix with rank 5 has null space of dimension 3 — no elimination "
                "needed.\n"
                "• A map $\\mathbb R^7 \\to \\mathbb R^4$ can never be one-to-one: rank ≤ 4 forces "
                "$\\dim N \\ge 3$.\n"
                "• A map $\\mathbb R^3 \\to \\mathbb R^5$ can never be onto: rank ≤ 3 < 5.\n\n"
                "For square matrices it makes 'one-to-one $\\iff$ onto' true: trivial kernel forces "
                "rank $n$, forcing full image — the deep reason a square matrix with EITHER property "
                "is invertible."
            )),
            (E, "Worked example", (
                "$A$ is $4 \\times 6$ and $Ax = b$ is solvable for every $b \\in \\mathbb R^4$. Find "
                "$\\dim N(A)$.\n\n"
                "Every $b$ reachable → full row rank → $\\operatorname{rank} = 4$.\n"
                "$$\\dim N(A) = 6 - 4 = 2.$$\n\n"
                "So every solvable system here has a 2-parameter family of solutions — existence for all "
                "$b$ PLUS uniqueness is impossible for a wide matrix, and rank-nullity is the one-line "
                "proof."
            )),
            (P, "Pitfalls", (
                "1. Using the number of ROWS in the formula — it's columns ($n$, the domain "
                "dimension).\n\n"
                "2. $\\dim N(A^T)$ confused with $\\dim N(A)$ — the transpose has its own count: "
                "$m - \\operatorname{rank}$.\n\n"
                "3. Forgetting the theorem says nothing about WHICH vectors — dimensions only.\n\n"
                "4. Applying it to conclude solvability — rank-nullity governs uniqueness structure; "
                "existence needs the rank-vs-$m$ comparison.\n\n"
                "5. Zero-map edge case: rank 0, nullity $n$ — the formula still holds."
            )),
            (K, "Check yourself", (
                "You should be able to: compute any one of rank/nullity/$n$ from the other two, and "
                "wield the one-to-one/onto consequences by shape.\n\n"
                "Self-test: $T: \\mathbb R^5 \\to \\mathbb R^5$ has kernel $\\{\\mathbf 0\\}$. Is it "
                "onto? (Yes — rank $= 5 - 0 = 5$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------ U6: determinants ------------------------------
    "LA.U6.N1": {
        "summary": "Determinants of 2x2 and 3x3 matrices: the formulas and basic evaluation.",
        "steps": [
            (L, "The 2x2 and the 3x3", (
                "$$\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc.$$\n\n"
                "For $3 \\times 3$, the Sarrus rule: copy the first two columns to the right, sum the "
                "three ↘ diagonal products, subtract the three ↙ diagonal products:\n"
                "$$\\det = aei + bfg + cdh - ceg - bdi - afh$$\n"
                "for rows $(a,b,c), (d,e,f), (g,h,i)$. WARNING: Sarrus is a $3\\times3$-only trick — it "
                "has no $4\\times4$ analogue; larger matrices need cofactors (LA.U6.N2) or elimination."
            )),
            (L, "What the number tells you", (
                "One scalar, three readings:\n\n"
                "• INVERTIBILITY: $\\det \\ne 0 \\iff$ invertible $\\iff$ unique solutions.\n"
                "• GEOMETRY: $|\\det|$ = area/volume scale factor (LA.U4.N2).\n"
                "• ORIENTATION: sign = handedness kept or flipped.\n\n"
                "Instant cases: triangular matrices (upper or lower) have $\\det$ = product of diagonal "
                "entries; a zero row or column, or a repeated row, forces $\\det = 0$."
            )),
            (E, "Worked example", (
                "$$\\det \\begin{pmatrix} 2 & 1 & 3 \\\\ 0 & 4 & -1 \\\\ 1 & 2 & 1 \\end{pmatrix}$$\n\n"
                "Sarrus: ↘ $2\\cdot4\\cdot1 + 1\\cdot(-1)\\cdot1 + 3\\cdot0\\cdot2 = 8 - 1 + 0 = 7$; "
                "↙ $3\\cdot4\\cdot1 + 2\\cdot(-1)\\cdot2 + 1\\cdot0\\cdot1 = 12 - 4 + 0 = 8$.\n"
                "$$\\det = 7 - 8 = -1.$$\n\n"
                "Nonzero → invertible; volumes scale by 1, orientation flips."
            )),
            (P, "Pitfalls", (
                "1. $ad + bc$ instead of $ad - bc$.\n\n"
                "2. Sarrus attempted on a $4\\times4$ — silently wrong, not just slow.\n\n"
                "3. Sign errors in the ↙ subtraction (each backward product carries a minus).\n\n"
                "4. Determinant of a non-square matrix.\n\n"
                "5. $\\det = 0$ read as 'the matrix is zero' — it means SINGULAR (dependent "
                "rows/columns), which a mostly-nonzero matrix can easily be."
            )),
            (K, "Check yourself", (
                "You should be able to: evaluate 2x2s and 3x3s quickly, use the triangular and "
                "zero-row shortcuts, and translate the value into invertibility language.\n\n"
                "Self-test: $\\det\\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}$? "
                "(0 — proportional rows; singular.)\n\nPractice the node."
            )),
        ],
    },
    "LA.U6.N2": {
        "summary": "Cofactor (Laplace) expansion: computing determinants along any row or column.",
        "steps": [
            (L, "Minors, cofactors, expansion", (
                "The MINOR $M_{ij}$ is the determinant of the submatrix left after deleting row $i$ and "
                "column $j$. The COFACTOR attaches the checkerboard sign:\n"
                "$$C_{ij} = (-1)^{i+j} M_{ij}.$$\n\n"
                "Laplace expansion along ANY row or column:\n"
                "$$\\det A = \\sum_j a_{ij} C_{ij} \\quad (\\text{fixed row } i).$$\n\n"
                "Every choice of row/column gives the same answer — so choose the one with the most "
                "ZEROS; each zero kills a whole term."
            )),
            (L, "Sign pattern and cost", (
                "The checkerboard starts with $+$ at the top-left:\n"
                "$$\\begin{pmatrix} + & - & + \\\\ - & + & - \\\\ + & - & + \\end{pmatrix}$$\n"
                "— the sign belongs to the POSITION, independent of the entry's own sign.\n\n"
                "Cost reality: full expansion is $O(n!)$ — fine at $3\\times3$, painful at $4\\times4$, "
                "absurd beyond. For big matrices, eliminate to triangular form and multiply the diagonal "
                "(each row swap flips the sign; adding multiples changes nothing). Cofactors are for "
                "small matrices, sparse rows, and THEORY (the inverse formula, characteristic "
                "polynomials in LA.U7.N1)."
            )),
            (E, "Worked example", (
                "$$A = \\begin{pmatrix} 1 & 0 & 2 \\\\ 3 & 4 & 0 \\\\ 0 & 5 & 1 \\end{pmatrix}$$ — "
                "expand along the first ROW (has a zero).\n\n"
                "$$\\det A = 1 \\cdot \\det\\begin{pmatrix} 4 & 0 \\\\ 5 & 1 \\end{pmatrix} "
                "- 0 + 2 \\cdot \\det\\begin{pmatrix} 3 & 4 \\\\ 0 & 5 \\end{pmatrix} "
                "= 1(4) + 2(15) = 34.$$\n\n"
                "Signs $+, -, +$ from the checkerboard; the middle term vanished with its zero entry."
            )),
            (P, "Pitfalls", (
                "1. Signs from the ENTRY instead of the POSITION ($(-1)^{i+j}$ is about where, not "
                "what).\n\n"
                "2. Deleting the wrong row/column for a minor.\n\n"
                "3. Checkerboard misaligned (top-left is always $+$; positions count from 1).\n\n"
                "4. Expanding along a dense row when a zero-rich column was available.\n\n"
                "5. Using cofactors on a $5\\times5$ when elimination-to-triangular takes a tenth the "
                "work."
            )),
            (K, "Check yourself", (
                "You should be able to: expand along any row/column with correct signs, exploit zeros, "
                "and know when to switch to elimination.\n\n"
                "Self-test: expanding a $4\\times4$ along a row with exactly one nonzero entry costs how "
                "many $3\\times3$ determinants? (One.)\n\nPractice the node."
            )),
        ],
    },
    "LA.U6.N3": {
        "summary": "Determinant properties: row operations, products, transposes, and fast evaluation.",
        "steps": [
            (L, "How row operations move the determinant", (
                "• SWAP two rows: $\\det$ changes SIGN.\n"
                "• MULTIPLY a row by $c$: $\\det$ multiplies by $c$.\n"
                "• ADD a multiple of one row to another: $\\det$ UNCHANGED.\n\n"
                "The third is the workhorse: eliminate to triangular form (tracking only swaps and "
                "scalings), then $\\det$ = product of the diagonal. This is the $O(n^3)$ way — the "
                "method of choice beyond $3\\times3$."
            )),
            (L, "The algebraic identities", (
                "• $\\det(AB) = \\det A \\, \\det B$ (multiplicative — the crown jewel).\n"
                "• $\\det(A^T) = \\det A$ (so every ROW property is also a COLUMN property).\n"
                "• $\\det(A^{-1}) = 1/\\det A$.\n"
                "• $\\det(cA) = c^n \\det A$ (every row scales).\n"
                "• Triangular: product of diagonal. Repeated row, zero row, or dependent rows: 0.\n\n"
                "NOT an identity: $\\det(A + B) \\ne \\det A + \\det B$ — the determinant is not linear "
                "in the matrix (it is linear in each row separately, holding the others fixed)."
            )),
            (E, "Worked example", (
                "$$\\det\\begin{pmatrix} 1 & 2 & 3 \\\\ 2 & 4 & 8 \\\\ 3 & 5 & 7 \\end{pmatrix}: \\quad "
                "R_2 - 2R_1, \\; R_3 - 3R_1 \\;(\\text{no change}) \\Rightarrow "
                "\\begin{pmatrix} 1 & 2 & 3 \\\\ 0 & 0 & 2 \\\\ 0 & -1 & -2 \\end{pmatrix}.$$\n\n"
                "Swap $R_2 \\leftrightarrow R_3$ (sign flips): triangular with diagonal $1, -1, 2$.\n"
                "$$\\det = -\\,(1)(-1)(2) = 2.$$\n\n"
                "Two eliminations (free), one swap (sign), one diagonal product — no cofactors."
            )),
            (P, "Pitfalls", (
                "1. Forgetting the sign flip on swaps (track them with a tally).\n\n"
                "2. Row-scaling during elimination without dividing back out.\n\n"
                "3. $\\det(A + B) = \\det A + \\det B$ — the classic false identity.\n\n"
                "4. $\\det(cA) = c\\det A$ — it's $c^n$.\n\n"
                "5. Using 'add a multiple' but accidentally REPLACING the wrong row (only the target row "
                "changes; the source row stays)."
            )),
            (K, "Check yourself", (
                "You should be able to: evaluate by elimination with sign/scale bookkeeping, and apply "
                "the product/transpose/inverse identities.\n\n"
                "Self-test: $\\det A = 3$ for $4\\times4$ $A$. Find $\\det(2A^{-1})$. "
                "($2^4 / 3 = 16/3$.)\n\nPractice the node."
            )),
        ],
    },
    "LA.U6.N4": {
        "summary": "Determinant and invertibility: det ≠ 0 as the master test, and Cramer's rule.",
        "steps": [
            (L, "The equivalence", (
                "For a SQUARE matrix $A$, the following are all equivalent:\n\n"
                "$\\det A \\ne 0$ $\\iff$ $A$ invertible $\\iff$ rank $n$ $\\iff$ columns independent "
                "$\\iff$ $Ax = b$ uniquely solvable for every $b$ $\\iff$ $N(A) = \\{\\mathbf 0\\}$.\n\n"
                "One scalar answers them all. Geometric reading: $\\det = 0$ means the map flattens "
                "space into a lower dimension — information is destroyed, so no inverse can exist."
            )),
            (L, "Cramer's rule", (
                "For $Ax = b$ with $\\det A \\ne 0$:\n"
                "$$x_i = \\frac{\\det A_i}{\\det A},$$\n"
                "where $A_i$ is $A$ with column $i$ replaced by $b$.\n\n"
                "Elegant for $2\\times2$/$3\\times3$ and for FORMULAS (sensitivity analysis, one "
                "component of a big system); hopeless computationally beyond that — elimination wins. "
                "Know it as theory and as a small-system shortcut, not as an algorithm."
            )),
            (E, "Worked example", (
                "Solve by Cramer: $2x + y = 5$, $3x + 4y = 10$.\n\n"
                "$\\det A = 8 - 3 = 5$.\n"
                "$$x = \\frac{\\det\\begin{pmatrix} 5 & 1 \\\\ 10 & 4 \\end{pmatrix}}{5} = \\frac{10}{5} = 2, "
                "\\qquad y = \\frac{\\det\\begin{pmatrix} 2 & 5 \\\\ 3 & 10 \\end{pmatrix}}{5} = \\frac{5}{5} = 1.$$\n\n"
                "Check: $2(2) + 1 = 5$ ✓, $3(2) + 4(1) = 10$ ✓. For which $k$ is "
                "$\\begin{pmatrix} 1 & k \\\\ 2 & 4\\end{pmatrix}$ singular? $\\det = 4 - 2k = 0$: "
                "$k = 2$ — determinants turn invertibility into an equation."
            )),
            (P, "Pitfalls", (
                "1. Cramer with $\\det A = 0$ — the rule simply doesn't apply (system is singular).\n\n"
                "2. Replacing the wrong column, or forgetting to divide by $\\det A$.\n\n"
                "3. Extending the equivalence to non-square matrices — determinants don't exist there; "
                "use rank.\n\n"
                "4. 'Small determinant ≈ singular' — scale-dependent and unreliable; condition numbers, "
                "not determinant size, measure near-singularity.\n\n"
                "5. Using Cramer on large systems (cost explodes; elimination is $O(n^3)$)."
            )),
            (K, "Check yourself", (
                "You should be able to: run the invertibility equivalence in both directions, solve "
                "singularity-parameter problems, and apply Cramer on small systems.\n\n"
                "Self-test: columns of $A$ ($3\\times3$) are dependent. What is $\\det A$? "
                "(0 — and $Ax = b$ has no solution or infinitely many, never one.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------ U7: eigen ------------------------------
    "LA.U7.N1": {
        "summary": "Eigenvalues and the characteristic polynomial: det(A − λI) = 0.",
        "steps": [
            (L, "The eigenvalue equation", (
                "$\\lambda$ is an EIGENVALUE of $A$ with eigenvector $v \\ne \\mathbf 0$ when\n"
                "$$Av = \\lambda v$$\n"
                "— the map doesn't rotate $v$ away from its own line; it only stretches it by "
                "$\\lambda$.\n\n"
                "Rearranged: $(A - \\lambda I)v = \\mathbf 0$ with $v \\ne 0$ — the matrix "
                "$A - \\lambda I$ must be SINGULAR:\n"
                "$$\\det(A - \\lambda I) = 0.$$\n"
                "That determinant is the CHARACTERISTIC POLYNOMIAL — degree $n$, so at most $n$ "
                "eigenvalues (counted with multiplicity, over $\\mathbb C$ exactly $n$)."
            )),
            (L, "Shortcuts and structure", (
                "For $2\\times2$: $\\det(A - \\lambda I) = \\lambda^2 - (\\operatorname{tr} A)\\lambda "
                "+ \\det A$ — trace and determinant hand you the polynomial.\n\n"
                "Checks that catch most errors:\n"
                "$$\\sum \\lambda_i = \\operatorname{tr} A, \\qquad \\prod \\lambda_i = \\det A.$$\n\n"
                "Instant cases: triangular matrices have eigenvalues = diagonal entries; singular "
                "matrices have $\\lambda = 0$ among them. Real matrices can have COMPLEX eigenvalue "
                "pairs (rotations do — nothing real stays on its own line)."
            )),
            (E, "Worked example", (
                "$A = \\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}$: "
                "$\\operatorname{tr} = 7$, $\\det = 10$.\n\n"
                "$$\\lambda^2 - 7\\lambda + 10 = 0 \\Rightarrow (\\lambda - 5)(\\lambda - 2) = 0 "
                "\\Rightarrow \\lambda = 5, 2.$$\n\n"
                "Check: $5 + 2 = 7 = \\operatorname{tr}$ ✓, $5 \\cdot 2 = 10 = \\det$ ✓. "
                "The eigenvectors (next node) will reveal the two invariant directions this map "
                "stretches by 5 and by 2."
            )),
            (P, "Pitfalls", (
                "1. Solving $\\det(A) - \\lambda = 0$ or subtracting $\\lambda$ from every ENTRY — "
                "$\\lambda$ comes off the DIAGONAL only.\n\n"
                "2. Allowing $v = \\mathbf 0$ as an eigenvector — never (eigenVALUE 0 is fine, "
                "eigenvector 0 is not).\n\n"
                "3. Sign slips expanding $\\det(A - \\lambda I)$ — use the trace/det shortcut for "
                "$2\\times2$.\n\n"
                "4. Discarding complex roots for real matrices — they are legitimate eigenvalues.\n\n"
                "5. Skipping the trace/determinant verification (five free seconds of error "
                "detection)."
            )),
            (K, "Check yourself", (
                "You should be able to: form the characteristic polynomial, extract eigenvalues, and "
                "verify with trace and determinant.\n\n"
                "Self-test: eigenvalues of $\\begin{pmatrix} 3 & 0 \\\\ 8 & -1 \\end{pmatrix}$? "
                "(Triangular: $3$ and $-1$.)\n\nPractice the node."
            )),
        ],
    },
    "LA.U7.N2": {
        "summary": "Eigenvectors and eigenspaces: solving (A − λI)v = 0 for each eigenvalue.",
        "steps": [
            (L, "From eigenvalue to eigenvector", (
                "For each eigenvalue $\\lambda$, the eigenvectors are the NONZERO solutions of\n"
                "$$(A - \\lambda I)\\, v = \\mathbf 0$$\n"
                "— a null-space computation (LA.U3.N2). Substitute $\\lambda$, eliminate, "
                "parameterize.\n\n"
                "The full solution set (zero vector included) is the EIGENSPACE $E_\\lambda = "
                "N(A - \\lambda I)$ — a subspace: any scalar multiple of an eigenvector is one too, "
                "so answers are determined only up to scale."
            )),
            (L, "Sanity structure", (
                "$A - \\lambda I$ MUST come out singular (that's what made $\\lambda$ an eigenvalue) — "
                "if elimination yields full rank, the eigenvalue is wrong; go back.\n\n"
                "Eigenvectors for DIFFERENT eigenvalues are automatically independent. Eigenspaces can "
                "have dimension $> 1$ (repeated eigenvalues sometimes bring whole planes of "
                "eigenvectors — the multiplicity story of LA.U7.N3).\n\n"
                "Always verify: multiply $Av$ and check it equals $\\lambda v$. Two matrix-vector "
                "products; catches everything."
            )),
            (E, "Worked example", (
                "Continue $A = \\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}$, $\\lambda = 5, 2$.\n\n"
                "$\\lambda = 5$: $A - 5I = \\begin{pmatrix} -1 & 1 \\\\ 2 & -2 \\end{pmatrix}$ → "
                "$-v_1 + v_2 = 0$ → $v = (1, 1)$.\n"
                "$\\lambda = 2$: $A - 2I = \\begin{pmatrix} 2 & 1 \\\\ 2 & 1 \\end{pmatrix}$ → "
                "$2v_1 + v_2 = 0$ → $v = (1, -2)$.\n\n"
                "Verify: $A(1,1) = (5,5) = 5(1,1)$ ✓; $A(1,-2) = (2,-4) = 2(1,-2)$ ✓. "
                "Both rows of each reduced matrix agreed — the built-in singularity check."
            )),
            (P, "Pitfalls", (
                "1. Getting a full-rank $A - \\lambda I$ and forcing $v = 0$ — signals a wrong "
                "eigenvalue, not a zero eigenvector.\n\n"
                "2. Solving $(A - \\lambda I)v = v$ or $= \\lambda v$ — the right side is "
                "$\\mathbf 0$.\n\n"
                "3. Treating 'the' eigenvector as unique — any nonzero scalar multiple works.\n\n"
                "4. Substituting one eigenvalue but reading off equations for the other "
                "(label your work per $\\lambda$).\n\n"
                "5. Skipping the $Av = \\lambda v$ verification."
            )),
            (K, "Check yourself", (
                "You should be able to: compute eigenspaces as null spaces, expect singularity, "
                "normalize when asked, and verify by multiplication.\n\n"
                "Self-test: for $\\begin{pmatrix} 2 & 0 \\\\ 0 & 2 \\end{pmatrix}$, what is "
                "$E_2$? (All of $\\mathbb R^2$ — every nonzero vector is an eigenvector.)\n\n"
                "Practice the node."
            )),
        ],
    },
    "LA.U7.N3": {
        "summary": "Algebraic vs geometric multiplicity: root count vs eigenspace dimension, and defectiveness.",
        "steps": [
            (L, "Two multiplicities", (
                "For an eigenvalue $\\lambda$:\n\n"
                "• ALGEBRAIC multiplicity (AM): how many times $\\lambda$ appears as a root of the "
                "characteristic polynomial.\n"
                "• GEOMETRIC multiplicity (GM): $\\dim E_\\lambda$ — how many independent eigenvectors "
                "it owns.\n\n"
                "Always $1 \\le \\text{GM} \\le \\text{AM}$. When GM $<$ AM for some eigenvalue, the "
                "matrix is DEFECTIVE: it doesn't have enough eigenvectors to fill space."
            )),
            (L, "Why it matters", (
                "Diagonalizability (LA.U7.N4) is exactly the question 'do the eigenvectors span?' — "
                "equivalently GM = AM for EVERY eigenvalue.\n\n"
                "The canonical defective example: the shear "
                "$\\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$ — characteristic polynomial "
                "$(\\lambda - 1)^2$ (AM 2), but $E_1$ is only the $x$-axis (GM 1). One direction "
                "short.\n\n"
                "Distinct eigenvalues each have AM = 1, forcing GM = 1 — so $n$ DISTINCT eigenvalues "
                "guarantee a full eigenvector supply with no further checking."
            )),
            (E, "Worked example", (
                "$$A = \\begin{pmatrix} 2 & 1 & 0 \\\\ 0 & 2 & 0 \\\\ 0 & 0 & 3 \\end{pmatrix}$$ — "
                "triangular: eigenvalues $2, 2, 3$; AM$(2) = 2$, AM$(3) = 1$.\n\n"
                "$A - 2I = \\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$: "
                "rank 2, nullity 1 → GM$(2) = 1 < 2$. DEFECTIVE.\n\n"
                "Only $1 + 1 = 2$ independent eigenvectors exist in $\\mathbb R^3$ — this matrix cannot "
                "be diagonalized, and the deficit is visible as that lonely 1 in the corner."
            )),
            (P, "Pitfalls", (
                "1. Assuming GM = AM automatically — must CHECK for every repeated eigenvalue.\n\n"
                "2. GM computed as 'number of eigenvectors' (infinitely many!) instead of eigenspace "
                "DIMENSION.\n\n"
                "3. Believing GM can exceed AM, or be 0 — it's pinned between 1 and AM.\n\n"
                "4. Declaring a matrix defective because eigenvalues repeat — repetition is fine if the "
                "eigenspace is big enough ($I$ has $\\lambda = 1$ with AM = GM = $n$).\n\n"
                "5. Only checking multiplicities for one of several repeated eigenvalues."
            )),
            (K, "Check yourself", (
                "You should be able to: read AM from the polynomial, compute GM as a nullity, and "
                "diagnose defectiveness.\n\n"
                "Self-test: AM's are $2, 1$ and GM's are $2, 1$ — diagonalizable? "
                "(Yes: GM = AM everywhere.)\n\nPractice the node."
            )),
        ],
    },
    "LA.U7.N4": {
        "summary": "Diagonalization: A = PDP⁻¹, when it works, and the power shortcut.",
        "steps": [
            (L, "The factorization", (
                "If $A$ has $n$ independent eigenvectors, stack them as the columns of $P$ and the "
                "matching eigenvalues along a diagonal matrix $D$:\n"
                "$$A = P D P^{-1}.$$\n\n"
                "Reading: change coordinates INTO the eigenbasis ($P^{-1}$), where the map is pure "
                "stretching ($D$), then change back ($P$). Column order matters only in that $P$ and "
                "$D$ must be MATCHED — eigenvector $i$ under eigenvalue $i$.\n\n"
                "Diagonalizable $\\iff$ GM = AM for every eigenvalue; $n$ distinct eigenvalues "
                "suffice (but are not necessary — $I$ is diagonal already)."
            )),
            (L, "The payoff: powers and dynamics", (
                "Powers telescope:\n"
                "$$A^k = P D^k P^{-1}, \\qquad D^k = \\operatorname{diag}(\\lambda_1^k, \\ldots, \\lambda_n^k)$$\n"
                "— a thousand-fold matrix product becomes three multiplications. This solves linear "
                "recurrences (Fibonacci in closed form), Markov-chain limits, and — with $e^{Dt}$ — "
                "systems of ODEs (ODE.U5.N2 runs on exactly this).\n\n"
                "Long-run behavior is read off the eigenvalues: the largest $|\\lambda|$ dominates "
                "$A^k v$ as $k \\to \\infty$."
            )),
            (E, "Worked example", (
                "$A = \\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}$, from earlier: "
                "$\\lambda = 5, 2$ with $v = (1,1), (1,-2)$.\n\n"
                "$$P = \\begin{pmatrix} 1 & 1 \\\\ 1 & -2 \\end{pmatrix}, \\quad "
                "D = \\begin{pmatrix} 5 & 0 \\\\ 0 & 2 \\end{pmatrix}, \\quad "
                "P^{-1} = \\frac{1}{-3}\\begin{pmatrix} -2 & -1 \\\\ -1 & 1 \\end{pmatrix}.$$\n\n"
                "Then $A^{10} = P \\operatorname{diag}(5^{10}, 2^{10}) P^{-1}$ — computed without ten "
                "matrix multiplications. As $k$ grows, $5^k$ swamps $2^k$: $A^k v$ aligns with "
                "$(1,1)$ for almost every start."
            )),
            (P, "Pitfalls", (
                "1. Mismatched columns: $P$'s column $i$ must pair with $D$'s entry $i$.\n\n"
                "2. Writing $A = P^{-1} D P$ with $P$ built column-wise from eigenvectors — the "
                "eigenvector matrix goes on the LEFT.\n\n"
                "3. Diagonalizing a defective matrix — check GM = AM first.\n\n"
                "4. $A^k$ computed as $P D P^{-1} \\cdots$ without collapsing the middle "
                "($P^{-1}P = I$ is the whole trick).\n\n"
                "5. Assuming diagonalizable = invertible — independent notions ($\\lambda = 0$ is "
                "allowed in $D$)."
            )),
            (K, "Check yourself", (
                "You should be able to: assemble $P$ and $D$, verify $AP = PD$, compute powers, and "
                "read long-run dominance from the spectrum.\n\n"
                "Self-test: why does $AP = PD$ (not $DP$)? "
                "($A$ hits each COLUMN of $P$: $Av_i = \\lambda_i v_i$ — scaling columns is "
                "right-multiplication by a diagonal.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------ U8: orthogonality ------------------------------
    "LA.U8.N1": {
        "summary": "Dot product and orthogonality: angles, perpendicularity, and orthogonal complements.",
        "steps": [
            (L, "The dot product", (
                "$$u \\cdot v = u_1 v_1 + \\cdots + u_n v_n = \\|u\\| \\|v\\| \\cos\\theta.$$\n\n"
                "One number carrying geometry: $\\|v\\|^2 = v \\cdot v$; the angle via "
                "$\\cos\\theta = \\frac{u \\cdot v}{\\|u\\|\\|v\\|}$; and ORTHOGONALITY:\n"
                "$$u \\perp v \\iff u \\cdot v = 0.$$\n\n"
                "Sign reading: positive dot = acute angle (agreement), negative = obtuse (opposition), "
                "zero = perpendicular. The zero vector is orthogonal to everything by convention."
            )),
            (L, "Orthogonal sets and complements", (
                "A set of mutually orthogonal NONZERO vectors is automatically independent — "
                "orthogonality is independence you can verify with dot products alone.\n\n"
                "The ORTHOGONAL COMPLEMENT $S^\\perp$ = all vectors orthogonal to everything in $S$ — "
                "a subspace, with $\\dim S + \\dim S^\\perp = n$. Example: the complement of a plane "
                "through the origin in $\\mathbb R^3$ is its normal line.\n\n"
                "The fundamental connection to matrices: $N(A) = (\\text{row space of } A)^\\perp$ — "
                "$Ax = 0$ says $x$ is orthogonal to every row."
            )),
            (E, "Worked example", (
                "$u = (1, 2, -1)$, $v = (3, -1, 1)$: $u \\cdot v = 3 - 2 - 1 = 0$ — orthogonal, no "
                "angle computation needed.\n\n"
                "Find all vectors orthogonal to BOTH: solve $x + 2y - z = 0$, $3x - y + z = 0$. "
                "Adding: $4x + y = 0 \\Rightarrow y = -4x$; then $z = x + 2y = -7x$.\n"
                "$$\\{u, v\\}^\\perp = \\operatorname{span}\\{(1, -4, -7)\\}$$\n"
                "— a line, and $2 + 1 = 3$ dimensions ✓."
            )),
            (P, "Pitfalls", (
                "1. Dot product returning a VECTOR — it's a scalar (that's the cross product's "
                "job, and only in $\\mathbb R^3$).\n\n"
                "2. $u \\cdot v = 0$ concluded from 'they look perpendicular' — compute.\n\n"
                "3. Angle formula without normalizing (forgetting the $\\|u\\|\\|v\\|$).\n\n"
                "4. Orthogonal complement computed of a SET but reported as if of its span — same "
                "answer, but the reasoning must use the span.\n\n"
                "5. Believing orthogonal ⇒ independent without the NONZERO caveat."
            )),
            (K, "Check yourself", (
                "You should be able to: compute dot products, angles, and complements, and use "
                "$N(A) \\perp$ row space.\n\n"
                "Self-test: for what $k$ are $(2, k, 1)$ and $(k, 1, -4)$ orthogonal? "
                "($2k + k - 4 = 0 \\Rightarrow k = \\frac43$.)\n\nPractice the node."
            )),
        ],
    },
    "LA.U8.N2": {
        "summary": "Projection and least squares: closest points, the normal equations, and best-fit lines.",
        "steps": [
            (L, "Projection onto a line and a subspace", (
                "Projection of $b$ onto the line through $a$:\n"
                "$$\\operatorname{proj}_a b = \\frac{a \\cdot b}{a \\cdot a}\\, a$$\n"
                "— the multiple of $a$ closest to $b$; the ERROR $b - \\operatorname{proj}_a b$ is "
                "orthogonal to $a$ (that orthogonality IS the definition of 'closest').\n\n"
                "Onto the column space of $A$: the projection is $A\\hat x$ where $\\hat x$ solves the "
                "NORMAL EQUATIONS\n"
                "$$A^T A \\hat x = A^T b,$$\n"
                "derived by demanding the error $b - A\\hat x$ be orthogonal to every column."
            )),
            (L, "Least squares", (
                "When $Ax = b$ has NO solution (typical: more equations than unknowns — data fitting), "
                "least squares finds $\\hat x$ minimizing $\\|Ax - b\\|^2$: the same normal equations. "
                "'Unsolvable' becomes 'solve as well as possible.'\n\n"
                "Fitting a line $y = c + dx$ to points $(x_i, y_i)$: each point contributes one "
                "equation $c + d x_i = y_i$; $A$ has a column of 1's and a column of $x_i$'s; solve "
                "$A^T A \\hat x = A^T b$. This is regression (PS16) rebuilt from geometry — the "
                "best-fit line is a PROJECTION of the data vector onto a 2-dimensional column space."
            )),
            (E, "Worked example", (
                "Fit $y = c + dx$ to $(0, 1), (1, 1), (2, 3)$.\n\n"
                "$$A = \\begin{pmatrix} 1 & 0 \\\\ 1 & 1 \\\\ 1 & 2 \\end{pmatrix}, \\; "
                "b = \\begin{pmatrix} 1 \\\\ 1 \\\\ 3 \\end{pmatrix}; \\quad "
                "A^T A = \\begin{pmatrix} 3 & 3 \\\\ 3 & 5 \\end{pmatrix}, \\; "
                "A^T b = \\begin{pmatrix} 5 \\\\ 7 \\end{pmatrix}.$$\n\n"
                "Solve: $3c + 3d = 5$, $3c + 5d = 7$ → $d = 1$, $c = \\frac23$. Best line: "
                "$y = \\frac23 + x$.\n\n"
                "Residuals: $(\\frac13, -\\frac23, \\frac13)$ — check orthogonality to both columns: "
                "sums to 0 ✓, weighted by $x_i$: $0 - \\frac23 + \\frac23 = 0$ ✓."
            )),
            (P, "Pitfalls", (
                "1. Normal equations mangled: it's $A^T A \\hat x = A^T b$, both sides hit by "
                "$A^T$.\n\n"
                "2. Expecting $A\\hat x = b$ exactly — least squares lives where that's impossible; "
                "only the projection is reached.\n\n"
                "3. Projection formula without dividing by $a \\cdot a$.\n\n"
                "4. Forgetting the column of ones (fitting $y = dx$ when the data wants an "
                "intercept).\n\n"
                "5. $A^T A$ singular when columns of $A$ are dependent — least squares then has "
                "infinitely many minimizers; the setup, not the algebra, needs fixing."
            )),
            (K, "Check yourself", (
                "You should be able to: project onto lines and column spaces, derive and solve normal "
                "equations, and verify by residual orthogonality.\n\n"
                "Self-test: project $b = (3, 4)$ onto $a = (1, 0)$. "
                "($(3, 0)$; error $(0,4) \\perp a$ ✓.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------ U9 ------------------------------
    "LA.U9.N1": {
        "summary": "Singular value decomposition: A = UΣVᵀ, singular values, and low-rank approximation.",
        "steps": [
            (L, "The decomposition", (
                "EVERY matrix — square or not, invertible or not — factors as\n"
                "$$A = U \\Sigma V^T$$\n"
                "with $U$ ($m \\times m$) and $V$ ($n \\times n$) ORTHOGONAL (columns orthonormal) and "
                "$\\Sigma$ diagonal with the SINGULAR VALUES $\\sigma_1 \\ge \\sigma_2 \\ge \\cdots \\ge 0$.\n\n"
                "Geometric reading: every linear map is rotate/reflect ($V^T$) → stretch along axes "
                "($\\Sigma$) → rotate/reflect ($U$). The unit sphere always maps to an ellipsoid; the "
                "$\\sigma_i$ are its semi-axes."
            )),
            (L, "Where it comes from, what it's for", (
                "The ingredients are eigen-problems of symmetric matrices: $V$ holds eigenvectors of "
                "$A^T A$, $U$ of $A A^T$, and $\\sigma_i = \\sqrt{\\lambda_i(A^T A)}$.\n\n"
                "• RANK = number of nonzero singular values (the numerically robust definition).\n"
                "• BEST LOW-RANK APPROXIMATION (Eckart-Young): keep the top $k$ terms of "
                "$A = \\sum_i \\sigma_i u_i v_i^T$ — the closest rank-$k$ matrix to $A$. This is image "
                "compression, PCA, and noise reduction in one theorem: most of a typical matrix's "
                "'energy' sits in its first few singular values."
            )),
            (E, "Worked example", (
                "$A = \\begin{pmatrix} 3 & 0 \\\\ 0 & 2 \\end{pmatrix}$ is already an SVD with "
                "$U = V = I$, $\\sigma = 3, 2$: stretch $x$ by 3, $y$ by 2; unit circle → ellipse with "
                "semi-axes 3 and 2.\n\n"
                "Now $A = \\begin{pmatrix} 0 & 3 \\\\ 2 & 0 \\end{pmatrix}$: "
                "$A^T A = \\begin{pmatrix} 4 & 0 \\\\ 0 & 9 \\end{pmatrix}$, eigenvalues $9, 4$ → "
                "$\\sigma_1 = 3, \\sigma_2 = 2$ — same stretching, but $U, V$ now encode the axis swap. "
                "Singular values see through the rotation that eigenvalues stumble on (this $A$ has "
                "complex eigenvalues... check: $\\lambda^2 = 6$, real here — but the point stands: "
                "$\\sigma_i \\ne |\\lambda_i|$ in general)."
            )),
            (P, "Pitfalls", (
                "1. Confusing singular values with eigenvalues — equal only for symmetric "
                "positive-semidefinite matrices.\n\n"
                "2. Negative singular values — never; signs live in $U$ and $V$.\n\n"
                "3. Unsorted $\\Sigma$ — convention demands descending order.\n\n"
                "4. Using eigendecomposition on non-square data matrices — SVD is the tool that "
                "always exists.\n\n"
                "5. Forgetting $V$ needs a TRANSPOSE in $A = U\\Sigma V^T$ (and that "
                "orthogonal means $V^{-1} = V^T$, which is why it appears)."
            )),
            (K, "Check yourself", (
                "You should be able to: state the factorization and its geometry, extract singular "
                "values via $A^T A$, read rank from $\\Sigma$, and explain low-rank approximation.\n\n"
                "Self-test: $\\sigma = 10, 1, 0.01$ — what does keeping rank 1 preserve? "
                "(The dominant $\\sigma_1 u_1 v_1^T$ — most of the matrix's action, since "
                "$10 \\gg 1$.)\n\nPractice the node."
            )),
        ],
    },
}
