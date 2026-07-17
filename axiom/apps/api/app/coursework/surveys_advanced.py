"""Coursework: survey lessons for the advanced/graduate course nodes.

Each survey is a real orientation lesson: what the course is for, its arc,
a signature problem worked honestly, course-level traps, and how to work it.
"""

L = "reading"
E = "example"
P = "pitfall"
K = "check"

LESSONS: dict[str, dict] = {
    # ------------------------------------------------------------------
    "LINALG": {
        "summary": "Linear algebra: vectors, matrices, and the structure of linear maps — the most applicable mathematics there is.",
        "steps": [
            (L, "What this course is for", (
                "Linear algebra is the study of flat things: vectors, linear equations, and the "
                "maps that preserve lines. It is the common language of machine learning, "
                "graphics, quantum mechanics, statistics, and numerical computing — because the "
                "first thing anyone does with a hard problem is LINEARIZE it.\n\n"
                "Two running themes: solving $Ax = b$ (computation) and understanding the map "
                "$x \\mapsto Ax$ (structure). The course keeps toggling between them."
            )),
            (L, "The arc", (
                "• Vectors and systems: LA.U1.N1-N11 — combinations, span, elimination, RREF, "
                "existence/uniqueness.\n"
                "• Matrix algebra: LA.U2 — multiplication, inverses.\n"
                "• Structure: LA.U3 (subspaces, null space) → LA.U4 (linear maps, determinant "
                "geometry) → LA.U5 (rank, rank-nullity).\n"
                "• Determinants: LA.U6.\n"
                "• Eigentheory: LA.U7 — the course's summit: invariant directions, "
                "diagonalization.\n"
                "• Geometry: LA.U8 (orthogonality, least squares) → LA.U9 (SVD).\n\n"
                "Every node has a full lesson; the units are ordered by dependency."
            )),
            (E, "A signature problem", (
                "Fit a line through noisy data points — with no exact solution.\n\n"
                "$Ax = b$ is UNSOLVABLE (more equations than unknowns), so solve "
                "$A^TA\\hat x = A^Tb$ instead: project $b$ onto the column space "
                "(LA.U8.N2).\n\n"
                "Why it's a signature: it uses the column picture ($b$ not in the span), "
                "orthogonality (the error must be perpendicular), and matrix algebra — three "
                "units cooperating to turn 'impossible' into 'best possible.' That maneuver IS "
                "applied linear algebra."
            )),
            (P, "Course-level traps", (
                "1. Treating matrices as number grids instead of MAPS.\n\n"
                "2. $AB = BA$ assumptions and illegal cancellations.\n\n"
                "3. Existence confused with uniqueness (rows vs columns).\n\n"
                "4. Determinant worship — using $\\det$ where rank or elimination answers "
                "faster.\n\n"
                "5. Eigenvector mechanics without the geometric reading (invariant "
                "directions)."
            )),
            (K, "How to work this course", (
                "Compute AND interpret: after every elimination, say what the pivots mean; "
                "after every eigenvalue, say what the map does to its eigenvector. The "
                "column-picture translation ($Ax = b$ ⇔ combination of columns) should become "
                "reflexive.\n\n"
                "Prerequisites: comfortable algebra (ALG track). The calculus track is "
                "independent — linear algebra can be taken alongside CALC2/CALC3.\n\n"
                "Self-test: explain, in one sentence each, what rank, null space, and an "
                "eigenvector ARE — without formulas."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "ODE": {
        "summary": "Ordinary differential equations: modeling change, solving the classical equations, and reading dynamics qualitatively.",
        "steps": [
            (L, "What this course is for", (
                "ODEs are the mathematics of systems evolving in time: populations, circuits, "
                "springs, reactions, epidemics. The course delivers three skills: SOLVING the "
                "classical equations exactly, TRANSFORMING problems (Laplace, series) when "
                "direct attack fails, and reading dynamics QUALITATIVELY (phase planes, "
                "stability) when no formula exists — which is most of the time in practice."
            )),
            (L, "The arc", (
                "• First order: ODE.U1 — separable, linear, exact; existence/uniqueness.\n"
                "• Second order linear: ODE.U2 — characteristic equation, all three root "
                "cases, superposition.\n"
                "• Forcing: ODE.U3 — undetermined coefficients, resonance, variation of "
                "parameters.\n"
                "• Laplace: ODE.U4 — transforms, IVPs with built-in initial conditions.\n"
                "• Systems: ODE.U5 — eigenvalue method, phase portraits (leans on LA.U7).\n"
                "• Series: ODE.U6 — power-series solutions near ordinary points.\n"
                "• Qualitative: ODE.U7 — equilibria, linearization, trace-determinant "
                "classification.\n\n"
                "(ODE.U0 refreshes the integration toolkit first.)"
            )),
            (E, "A signature problem", (
                "The damped driven oscillator: $my'' + cy' + ky = F\\cos\\omega t$.\n\n"
                "Homogeneous part: characteristic roots → decaying transient (over/under/"
                "critically damped by the discriminant). Particular part: undetermined "
                "coefficients → steady oscillation at the driving frequency, with amplitude "
                "peaking near resonance.\n\n"
                "Why it's a signature: one problem exercises U2 (roots), U3 (forcing and "
                "resonance), and the transient/steady-state reading — and it IS the model "
                "of suspension systems, RLC circuits, and structural vibration."
            )),
            (P, "Course-level traps", (
                "1. Method-shopping without classifying the equation first (separable? "
                "linear? exact? constant-coefficient?).\n\n"
                "2. Initial conditions applied before the general solution is complete.\n\n"
                "3. Resonance unnoticed — the guess dies and panic follows.\n\n"
                "4. Sign errors in characteristic equations and integrating factors.\n\n"
                "5. Trusting linearization at borderline (center/zero-eigenvalue) "
                "equilibria."
            )),
            (K, "How to work this course", (
                "For every solved equation, CHECK by substitution (thirty seconds, catches "
                "everything) and INTERPRET (what decays, what oscillates, what dominates). "
                "Keep a one-page method-selection flowchart and update it per unit.\n\n"
                "Prerequisites: CALC2 (integration techniques) throughout; LA.U7 "
                "(eigenvalues) for U5 and U7.\n\n"
                "Self-test: name the three characteristic-root cases and their solution "
                "forms — and what physical damping regime each corresponds to."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "REALAN": {
        "summary": "Real analysis: calculus rebuilt on proofs — limits, continuity, and convergence made rigorous.",
        "steps": [
            (L, "What this course is for", (
                "Real analysis re-derives calculus with full rigor: every 'obviously' from "
                "CALC1-2 becomes a theorem with an epsilon. The payoff is twofold: certainty "
                "(knowing exactly when the rules apply — and when they break), and the "
                "analyst's toolkit (sup/inf, sequences, compactness, uniform convergence) "
                "that powers probability, PDE theory, and numerical analysis.\n\n"
                "This is where PT.EPSILONDELTA graduates from technique to way of life."
            )),
            (L, "The arc", (
                "• The real numbers: completeness (every bounded set has a supremum) — the "
                "axiom everything else leans on.\n"
                "• Sequences: convergence, monotone convergence, Bolzano-Weierstrass, Cauchy "
                "sequences.\n"
                "• Series: convergence tests reproven, absolute vs conditional, "
                "rearrangements (Riemann's shock: conditionally convergent series can be "
                "rearranged to any sum).\n"
                "• Continuity: epsilon-delta, IVT and extreme value theorems PROVEN, uniform "
                "continuity.\n"
                "• Differentiation and Riemann integration: MVT, FTC with exact "
                "hypotheses.\n"
                "• Uniform convergence: when limits of functions behave — the gateway to "
                "Fourier rigor (PDET) and MEASURE."
            )),
            (E, "A signature problem", (
                "Prove: a continuous function on $[a, b]$ attains a maximum.\n\n"
                "Sketch: the image is bounded (else pick $x_n$ with $f(x_n) > n$; "
                "Bolzano-Weierstrass extracts a convergent subsequence $x_{n_k} \\to x^*$; "
                "continuity forces $f(x_{n_k}) \\to f(x^*)$, finite — contradiction). Then "
                "take $s = \\sup f$, pick $f(y_n) \\to s$, extract again, and continuity "
                "hands you $f(y^*) = s$. ∎\n\n"
                "Why it's a signature: compactness (B-W), completeness (the sup), and "
                "continuity cooperating — the three pillars in one page, proving a fact "
                "CALC1 took on faith."
            )),
            (P, "Course-level traps", (
                "1. Using calculus facts before they're proven (the course's cardinal "
                "discipline).\n\n"
                "2. Quantifier order — uniform vs pointwise (continuity, convergence) is "
                "ENTIRELY a quantifier-order distinction.\n\n"
                "3. Treating 'intuitive' as 'true': everywhere-continuous nowhere-"
                "differentiable functions exist.\n\n"
                "4. sup/max conflation (sups need not be attained).\n\n"
                "5. Swapping limits with integrals/derivatives/sums without uniform "
                "convergence."
            )),
            (K, "How to work this course", (
                "Prerequisites: INTROPROOF (all of it — especially PT.EPSILONDELTA and "
                "PT.CONTRADICTION) and the calculus sequence for intuition. Work: prove "
                "everything; keep a counterexample zoo ($\\sin\\frac1x$, $x^2\\sin\\frac1x$, "
                "Dirichlet's function, the harmonic series) — analysis is learned as much "
                "from monsters as from theorems.\n\n"
                "Self-test: state completeness, and explain in one paragraph why "
                "$\\mathbb Q$ fails it and what breaks in calculus over $\\mathbb Q$."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "ABSALG": {
        "summary": "Abstract algebra: groups, rings, and fields — structure distilled from symmetry and arithmetic.",
        "steps": [
            (L, "What this course is for", (
                "Abstract algebra studies operations axiomatically: a GROUP is any world with "
                "an associative operation, identity, and inverses — integers under addition, "
                "symmetries of a square, invertible matrices, shuffles of a deck. Prove one "
                "theorem from the axioms and it holds in ALL such worlds at once.\n\n"
                "The payoff: symmetry made computable (chemistry, crystallography, physics), "
                "and the algebra behind cryptography and coding theory (RSA runs on "
                "DM11-style modular groups)."
            )),
            (L, "The arc", (
                "• Groups: axioms, subgroups, cyclic groups, permutations; LAGRANGE's theorem "
                "(subgroup order divides group order); homomorphisms, normal subgroups, "
                "quotients, the isomorphism theorems.\n"
                "• Rings: two operations (add, multiply); ideals and quotients; polynomial "
                "rings; unique factorization and where it fails.\n"
                "• Fields: division allowed; finite fields; field extensions — culminating "
                "(in a second semester) in Galois theory: why degree-5 equations have no "
                "quadratic-formula analogue.\n\n"
                "The through-line: substructure → quotient → homomorphism, replayed at each "
                "level."
            )),
            (E, "A signature problem", (
                "Prove: in any finite group $G$, $g^{|G|} = e$ for every element $g$.\n\n"
                "Sketch: the powers of $g$ form a cyclic subgroup $\\langle g \\rangle$ of "
                "some order $d$ (the first repeat forces cycling). Lagrange: $d$ divides "
                "$|G|$. Then $g^{|G|} = (g^d)^{|G|/d} = e^{|G|/d} = e$. ∎\n\n"
                "Why it's a signature: pure axiom-play, no numbers — yet specialize to the "
                "group of units mod $n$ and it becomes Euler's theorem, the engine of RSA. "
                "Abstraction paying concrete rent."
            )),
            (P, "Course-level traps", (
                "1. Assuming commutativity — most interesting groups aren't abelian.\n\n"
                "2. Verifying closure/inverses on examples instead of arbitrary elements "
                "(subgroup tests are universal claims).\n\n"
                "3. Quotienting by non-normal subgroups.\n\n"
                "4. Ring intuitions imported from $\\mathbb Z$ ($ab = 0 \\Rightarrow a = 0$ "
                "or $b = 0$ fails in $\\mathbb Z_6$).\n\n"
                "5. Isomorphism claimed from matching orders alone."
            )),
            (K, "How to work this course", (
                "Prerequisites: INTROPROOF fluency (the course is 100% proofs); DM06 "
                "(relations, functions) and DM11 (modular arithmetic) as concrete "
                "grounding. Keep a stable of six example groups ($\\mathbb Z_n$, $S_3$, "
                "$D_4$, $\\mathbb Z$, matrix groups, units mod $n$) and test every theorem "
                "against them.\n\n"
                "Self-test: state Lagrange's theorem and derive: a group of prime order is "
                "cyclic."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "TOPO": {
        "summary": "Point-set topology: continuity, compactness, and connectedness in their most general form.",
        "steps": [
            (L, "What this course is for", (
                "Topology strips geometry down to what survives stretching: open sets. A "
                "TOPOLOGY on a set names which subsets are 'open,' and from that alone "
                "rebuilds continuity, limits, convergence — with no distances required.\n\n"
                "Why bother: the theorems then apply everywhere at once (function spaces, "
                "surfaces, digital sense of 'nearby'), and the three big properties — "
                "compactness, connectedness, Hausdorffness — organize all of analysis "
                "(REALAN's key theorems are secretly topology)."
            )),
            (L, "The arc", (
                "• Topological spaces: open/closed sets, bases, subspace/product "
                "topologies; interior, closure, boundary.\n"
                "• Continuity re-founded: preimages of open sets are open — equivalent to "
                "epsilon-delta in metric spaces, meaningful far beyond.\n"
                "• CONNECTEDNESS: no separation into two open pieces — proves the IVT.\n"
                "• COMPACTNESS: every open cover has a finite subcover — proves extreme "
                "value theorems; Heine-Borel ($=$ closed and bounded, in "
                "$\\mathbb R^n$ only!).\n"
                "• Separation axioms, metrization; a first look at quotients (gluing) and "
                "homeomorphism — when are two spaces 'the same'?"
            )),
            (E, "A signature problem", (
                "Prove: a continuous image of a compact space is compact.\n\n"
                "Proof. Let $f : X \\to Y$ be continuous, $X$ compact; cover $f(X)$ by "
                "open sets $\\{V_i\\}$. The preimages $\\{f^{-1}(V_i)\\}$ are open (continuity!) "
                "and cover $X$; compactness extracts a finite subcover "
                "$f^{-1}(V_{i_1}), \\ldots, f^{-1}(V_{i_n})$; then $V_{i_1}, \\ldots, V_{i_n}$ "
                "cover $f(X)$. ∎\n\n"
                "Why it's a signature: four lines, no epsilons, and the extreme value "
                "theorem falls out as a corollary (compact image in $\\mathbb R$ is closed "
                "and bounded → attains its sup). Topology's economy on full display."
            )),
            (P, "Course-level traps", (
                "1. Metric intuition where none applies ('open ball' thinking in "
                "non-metrizable spaces).\n\n"
                "2. 'Closed = not open' — sets can be both, neither.\n\n"
                "3. Compact = closed and bounded OUTSIDE $\\mathbb R^n$ — false in general "
                "(infinite-dimensional balls aren't compact).\n\n"
                "4. Images vs preimages: continuity is about PREIMAGES; images of "
                "open/closed sets behave badly.\n\n"
                "5. Sequences trusted to detect everything — in general spaces they "
                "don't (nets/filters exist for a reason)."
            )),
            (K, "How to work this course", (
                "Prerequisites: REALAN (or strong INTROPROOF + appetite): topology "
                "generalizes analysis, and the examples that matter first are "
                "$\\mathbb R^n$'s. Keep a zoo: discrete and indiscrete topologies, "
                "cofinite, the line with two origins — test every theorem against "
                "them.\n\n"
                "Self-test: define compactness via covers, and explain why $(0, 1)$ "
                "fails it while $[0,1]$ doesn't."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "COMPLEXAN": {
        "summary": "Complex analysis: holomorphic functions, contour integrals, and the residue calculus.",
        "steps": [
            (L, "What this course is for", (
                "Calculus over $\\mathbb C$ — where differentiability is a miracle: one "
                "complex derivative forces infinitely many, power-series expansions, and "
                "rigidity (values on a tiny arc determine the whole function). The "
                "subject is simultaneously the most elegant corner of analysis and a "
                "workhorse: real integrals, fluid flow, signal processing "
                "(PF.U2's transforms live naturally here), and number theory all run on "
                "it."
            )),
            (L, "The arc", (
                "• Holomorphic functions: complex differentiability, CAUCHY-RIEMANN "
                "equations ($u_x = v_y$, $u_y = -v_x$); harmonic real/imaginary parts "
                "(PF.U6 connection).\n"
                "• Contour integration: CAUCHY'S THEOREM (integral of holomorphic over a "
                "closed loop = 0) and the integral formula — values from boundary "
                "data.\n"
                "• Series: Taylor and LAURENT expansions; zeros and poles.\n"
                "• RESIDUES: the residue theorem — closed-loop integrals by summing "
                "residues at enclosed poles; real-integral evaluation as the killer "
                "app.\n"
                "• Conformal maps: angle-preserving changes of variable; Möbius "
                "transformations."
            )),
            (E, "A signature problem", (
                "Evaluate $\\displaystyle\\int_{-\\infty}^{\\infty} \\frac{dx}{1 + x^2}$ "
                "by residues.\n\n"
                "Close the contour with a big upper semicircle. Poles of "
                "$\\frac{1}{1 + z^2}$: $z = \\pm i$; only $z = i$ is enclosed, with "
                "residue $\\frac{1}{2i}$. The arc's contribution vanishes as "
                "$R \\to \\infty$ (integrand decays like $\\frac{1}{R^2}$). So\n"
                "$$\\int_{-\\infty}^\\infty \\frac{dx}{1+x^2} = 2\\pi i \\cdot \\frac{1}{2i} = \\pi.$$\n\n"
                "(Check: $\\arctan$ agrees.) Why it's a signature: a REAL integral "
                "computed by walking through the complex plane — the course's signature "
                "move, and it works on integrals $\\arctan$ can't touch."
            )),
            (P, "Course-level traps", (
                "1. Treating $f(x + iy)$ like two-variable real calculus — "
                "Cauchy-Riemann is a much stronger condition.\n\n"
                "2. Applying Cauchy's theorem across poles or branch cuts (hypotheses: "
                "holomorphic ON AND INSIDE the contour).\n\n"
                "3. Residues computed with the wrong pole order.\n\n"
                "4. Forgetting orientation ($2\\pi i$ assumes counterclockwise).\n\n"
                "5. Ignoring the arc estimate — the semicircle must genuinely "
                "vanish, and sometimes it doesn't."
            )),
            (K, "How to work this course", (
                "Prerequisites: CALC3 (line integrals, Green's theorem — Cauchy is "
                "Green in disguise) and REALAN-grade comfort with limits; INTROPROOF "
                "throughout. Practice: derive Cauchy-Riemann yourself, then compute "
                "twenty residues — fluency there unlocks the whole course.\n\n"
                "Self-test: why does $\\oint \\frac{dz}{z} = 2\\pi i$ around the origin "
                "not contradict Cauchy's theorem? (The integrand isn't holomorphic AT "
                "0 — the hypothesis fails, and that failure is precisely what residues "
                "measure.)"
            )),
        ],
    },
    # ------------------------------------------------------------------
    "DIFFGEO": {
        "summary": "Differential geometry: curves, surfaces, and curvature — calculus on bent spaces.",
        "steps": [
            (L, "What this course is for", (
                "The geometry of smooth bending: how curves twist, how surfaces curve, and "
                "which geometric facts are INTRINSIC (measurable by an inhabitant of the "
                "surface) versus artifacts of how it sits in space. The subject's summit "
                "insight — curvature is intrinsic — is the mathematical foundation of "
                "general relativity, and its tools (frames, geodesics, curvature) drive "
                "computer graphics, robotics, and shape analysis."
            )),
            (L, "The arc", (
                "• Curves: arc length, the FRENET frame (tangent/normal/binormal), "
                "curvature $\\kappa$ and torsion $\\tau$ — a curve is determined by them.\n"
                "• Surfaces: parametrizations, tangent planes; FIRST fundamental form "
                "(intrinsic measurement: lengths, angles, areas) and SECOND (how the "
                "surface bends in space).\n"
                "• Curvatures: principal, mean ($H$, soap films: $H = 0$), and GAUSSIAN "
                "($K$).\n"
                "• THEOREMA EGREGIUM: $K$ is intrinsic — computable from the first form "
                "alone.\n"
                "• Geodesics (straightest paths) and GAUSS-BONNET: total curvature is "
                "topology — $\\int K\\, dA = 2\\pi\\chi$."
            )),
            (E, "A signature problem", (
                "Why must every flat map of the Earth distort something?\n\n"
                "The sphere has Gaussian curvature $K = \\frac{1}{R^2} > 0$; the plane has "
                "$K = 0$. By the Theorema Egregium, $K$ is intrinsic — preserved by any "
                "distance-preserving map. Since the curvatures differ, NO length-true flat "
                "map exists. ∎\n\n"
                "Why it's a signature: a deep theorem answering an everyday question in "
                "three sentences — and the same logic (curvature obstructs flattening) is "
                "why sheet metal work needs stretching, and why spacetime curvature is "
                "physically meaningful rather than an artifact of coordinates."
            )),
            (P, "Course-level traps", (
                "1. Confusing intrinsic with extrinsic (a cylinder is extrinsically bent "
                "but intrinsically FLAT: $K = 0$ — you can unroll it).\n\n"
                "2. Computing with a parametrization and mistaking its artifacts for "
                "geometry (check invariance).\n\n"
                "3. Curvature sign conventions (normal direction choices flip signs).\n\n"
                "4. Geodesic ≠ shortest (geodesics are locally shortest; the long way "
                "around a great circle is a geodesic too).\n\n"
                "5. Drowning in index notation before the pictures are solid."
            )),
            (K, "How to work this course", (
                "Prerequisites: CALC3 (surfaces, gradients, multiple integrals) and "
                "LA.U7-U8 (eigenvalues — the principal curvatures ARE eigenvalues of the "
                "shape operator; inner products). Compute everything for the standard "
                "zoo: plane, sphere, cylinder, torus, saddle — every theorem should be "
                "checked against all five.\n\n"
                "Self-test: state the Theorema Egregium and give the cylinder-vs-sphere "
                "contrast in one sentence each."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "FUNCAN": {
        "summary": "Fourier and functional analysis: infinite-dimensional linear algebra, done rigorously.",
        "steps": [
            (L, "What this course is for", (
                "Functional analysis treats FUNCTIONS as vectors in infinite-dimensional "
                "spaces, making linear algebra's tools (norms, projections, "
                "eigen-expansions) rigorous where dimensions are infinite. It is the "
                "framework that makes Fourier series honest (PF.U1's convergence "
                "questions), underwrites quantum mechanics (Hilbert spaces ARE its "
                "language), and grounds numerical analysis and PDE theory."
            )),
            (L, "The arc", (
                "• Normed and BANACH spaces: completeness for function spaces; the sup "
                "norm vs integral norms measuring different things.\n"
                "• HILBERT spaces: inner products, orthogonality; the projection theorem "
                "(LA.U8, now infinite-dimensional); orthonormal bases and Parseval "
                "(PF.U1.N5 as a special case).\n"
                "• Linear operators: bounded = continuous; dual spaces; the big three "
                "theorems (Hahn-Banach, open mapping, uniform boundedness).\n"
                "• SPECTRAL theory: eigenvalues generalized; compact self-adjoint "
                "operators have orthonormal eigen-expansions — the theorem that explains "
                "why PF.U7's eigenfunction expansions work.\n"
                "• Fourier rigor: $L^2$ convergence of Fourier series as the flagship "
                "application."
            )),
            (E, "A signature problem", (
                "In what sense does a Fourier series ALWAYS converge?\n\n"
                "In $L^2[-\\pi, \\pi]$: the exponentials $\\frac{e^{inx}}{\\sqrt{2\\pi}}$ "
                "form an orthonormal BASIS, so for any square-integrable $f$, the partial "
                "sums satisfy $\\|f - S_N f\\|_{L^2} \\to 0$ — mean-square convergence, "
                "with Parseval as the Pythagorean bookkeeping. Pointwise convergence can "
                "fail (continuous functions with divergent Fourier series exist!), but "
                "the HILBERT-SPACE convergence never does.\n\n"
                "Why it's a signature: the right SPACE and the right NORM turn a "
                "delicate 19th-century question into clean geometry — functional "
                "analysis's core move."
            )),
            (P, "Course-level traps", (
                "1. Finite-dimensional intuitions: closed bounded sets aren't compact; "
                "linear maps aren't automatically continuous.\n\n"
                "2. Conflating the norms — convergence in $L^2$, in sup-norm, and "
                "pointwise are three different claims.\n\n"
                "3. Assuming every space has an orthonormal basis in the Hilbert sense "
                "(Banach ≠ Hilbert).\n\n"
                "4. Applying spectral theorems without checking compactness/"
                "self-adjointness.\n\n"
                "5. Treating unbounded operators (differentiation!) as bounded ones."
            )),
            (K, "How to work this course", (
                "Prerequisites: REALAN (uniform convergence, completeness) and LINALG "
                "(the finite-dimensional picture being generalized) — MEASURE helps for "
                "the $L^p$ spaces but the core can run on Riemann integrals. Anchor "
                "every abstract theorem in $\\ell^2$ and $L^2$, the two spaces where "
                "everything is computable.\n\n"
                "Self-test: state the projection theorem and explain how least squares "
                "(LA.U8.N2) and Fourier coefficients (PF.U1.N2) are both instances of "
                "it."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "MEASURE": {
        "summary": "Measure theory and Lebesgue integration: the integral rebuilt to survive limits.",
        "steps": [
            (L, "What this course is for", (
                "The Riemann integral breaks under limits: a pointwise limit of "
                "integrable functions can fail to be integrable, and swapping "
                "$\\lim$ with $\\int$ needs fragile hypotheses. Measure theory rebuilds "
                "integration from 'the size of sets' — and the resulting LEBESGUE "
                "integral has robust convergence theorems. It is the foundation of "
                "modern probability (measures ARE probability), $L^p$ spaces (FUNCAN), "
                "and rigorous Fourier analysis."
            )),
            (L, "The arc", (
                "• Measures: sigma-algebras, Lebesgue measure on $\\mathbb R$; "
                "non-measurable sets exist (Vitali) — hence the care.\n"
                "• Measurable functions; 'almost everywhere' as the right notion of "
                "equality.\n"
                "• The LEBESGUE INTEGRAL: built from simple functions upward — "
                "horizontal slicing instead of Riemann's vertical.\n"
                "• The convergence theorems — the course's crown jewels: MONOTONE "
                "convergence, FATOU's lemma, DOMINATED convergence.\n"
                "• Product measures and FUBINI; the $L^p$ spaces; "
                "Radon-Nikodym (densities exist — the theorem behind conditional "
                "expectation and probability densities)."
            )),
            (E, "A signature problem", (
                "Integrate the Dirichlet function $f = 1$ on the rationals, 0 "
                "elsewhere, over $[0,1]$.\n\n"
                "Riemann: every upper sum is 1, every lower sum is 0 — NOT integrable.\n\n"
                "Lebesgue: the rationals are countable, hence measure ZERO; $f = 0$ "
                "almost everywhere, so\n"
                "$$\\int_{[0,1]} f\\, d\\mu = 0.$$\n\n"
                "Why it's a signature: the pathological becomes trivial once 'size of "
                "the exceptional set' is the organizing idea — and 'almost everywhere' "
                "reasoning, introduced here, is how all of modern analysis and "
                "probability speaks."
            )),
            (P, "Course-level traps", (
                "1. Assuming all sets are measurable (Vitali says no) — the "
                "sigma-algebra bookkeeping is not pedantry.\n\n"
                "2. Swapping $\\lim$ and $\\int$ without citing WHICH convergence "
                "theorem (and checking its hypothesis — Fatou's inequality can be "
                "strict).\n\n"
                "3. 'Almost everywhere' dropped mid-proof.\n\n"
                "4. Fubini without checking integrability of the absolute value "
                "(Tonelli first!).\n\n"
                "5. Measure-zero intuitions: measure zero ≠ countable "
                "(Cantor's set: uncountable, measure zero)."
            )),
            (K, "How to work this course", (
                "Prerequisites: REALAN, solidly — sups, sequences, epsilon "
                "management are constant; TOPO helps (open sets, countability). "
                "Discipline: for every $\\lim$-$\\int$ swap in your work, write the "
                "theorem's name and verify its hypothesis in the margin.\n\n"
                "Self-test: state dominated convergence, and give the standard "
                "counterexample when the dominating function is missing "
                "($f_n = n\\,\\mathbb 1_{(0, 1/n)}$: integrals 1, limit 0)."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "NUMTHEORY": {
        "summary": "Number theory: divisibility, congruences, and primes — from Euclid to cryptography.",
        "steps": [
            (L, "What this course is for", (
                "The arithmetic of the integers, pursued seriously: how primes are "
                "distributed, when congruences solve, which equations have integer "
                "solutions. Long the purest of pure mathematics — now the backbone of "
                "digital security: RSA, Diffie-Hellman, and elliptic-curve cryptography "
                "are number theory deployed at planetary scale.\n\n"
                "The course builds on DM11's modular arithmetic and turns it into a "
                "theory."
            )),
            (L, "The arc", (
                "• Divisibility: gcd, EUCLIDEAN algorithm, Bézout ($\\gcd = ax + by$); "
                "unique prime factorization (proved via PT.STRONGIND).\n"
                "• Congruences: linear congruences, the CHINESE REMAINDER theorem "
                "(systems mod coprime moduli).\n"
                "• The multiplicative structure: FERMAT's little theorem, Euler's "
                "$\\phi$ and theorem, primitive roots.\n"
                "• Quadratic residues: which numbers are squares mod $p$; QUADRATIC "
                "RECIPROCITY — the course's summit theorem.\n"
                "• Applications: primality testing, RSA end-to-end; a taste of "
                "Diophantine equations (Pythagorean triples, Pell)."
            )),
            (E, "A signature problem", (
                "RSA in miniature. Take $p = 5, q = 11$: $n = 55$, "
                "$\\phi(n) = 40$. Public exponent $e = 3$ (coprime to 40); private "
                "$d = 27$ (since $3 \\cdot 27 = 81 \\equiv 1 \\bmod 40$).\n\n"
                "Encrypt $m = 7$: $c = 7^3 = 343 \\equiv 13 \\bmod 55$. "
                "Decrypt: $13^{27} \\bmod 55 \\equiv 7$ ✓ — guaranteed by Euler's "
                "theorem: $m^{ed} = m^{1 + k\\phi(n)} \\equiv m$.\n\n"
                "Why it's a signature: extended Euclid (find $d$), Euler's theorem "
                "(why it works), and fast modular exponentiation (why it's usable) — "
                "the course's toolkit assembled into the machine that secures the "
                "internet, breakable exactly when factoring $n$ is easy."
            )),
            (P, "Course-level traps", (
                "1. Dividing congruences without coprimality (DM11's warning, still "
                "the top error).\n\n"
                "2. Fermat's little theorem applied with composite modulus (that's "
                "Euler's job, with $\\phi$).\n\n"
                "3. Exponents reduced mod $n$ instead of mod $\\phi(n)$.\n\n"
                "4. CRT applied to non-coprime moduli.\n\n"
                "5. 'Checked up to a million' as proof — number theory is the "
                "historical home of late counterexamples."
            )),
            (K, "How to work this course", (
                "Prerequisites: DM03-DM04 and DM11 (proof technique + modular "
                "arithmetic); INTROPROOF for the full experience. Compute "
                "constantly — gcds by hand, CRT systems, orders of elements — the "
                "theory is learned through the arithmetic, not around it.\n\n"
                "Self-test: use Fermat to compute $2^{100} \\bmod 101$ instantly. "
                "(101 is prime: $2^{100} \\equiv 1$.)"
            )),
        ],
    },
    # ------------------------------------------------------------------
    "NUMERICS": {
        "summary": "Numerical analysis: algorithms for continuous problems, with error and stability as first-class citizens.",
        "steps": [
            (L, "What this course is for", (
                "Most equations have no closed-form solutions; numerical analysis "
                "designs algorithms that APPROXIMATE — and, crucially, quantifies the "
                "error and the stability. Two error sources run through everything: "
                "DISCRETIZATION (replacing calculus with arithmetic) and ROUNDOFF "
                "(floating point is not $\\mathbb R$). The craft is balancing them.\n\n"
                "This is the course where LINALG, CALC, and ODE become software."
            )),
            (L, "The arc", (
                "• Floating point: machine epsilon, catastrophic CANCELLATION; "
                "CONDITIONING (problem's sensitivity) vs STABILITY (algorithm's "
                "hygiene) — the course's central distinction.\n"
                "• Root finding: bisection (slow, certain), NEWTON's method "
                "(quadratic, needs a good start), secant.\n"
                "• Linear systems: Gaussian elimination with PIVOTING, LU; condition "
                "number $\\kappa(A)$ predicting accuracy loss.\n"
                "• Interpolation and least squares: polynomial interpolation, RUNGE's "
                "phenomenon (why equally-spaced high-degree fits explode), splines.\n"
                "• Quadrature: trapezoid, Simpson, Gaussian.\n"
                "• ODEs: Euler → Runge-Kutta; STIFFNESS and why implicit methods "
                "exist."
            )),
            (E, "A signature problem", (
                "Compute $f(x) = \\sqrt{x + 1} - \\sqrt{x}$ at $x = 10^8$.\n\n"
                "Naively: two square roots agreeing to 8 digits are subtracted — "
                "catastrophic cancellation wipes out most of the precision.\n\n"
                "Rewrite algebraically:\n"
                "$$f(x) = \\frac{1}{\\sqrt{x+1} + \\sqrt x},$$\n"
                "mathematically identical, numerically perfect (an addition instead "
                "of a subtraction of near-equals).\n\n"
                "Why it's a signature: same function, same arithmetic hardware, "
                "answers differing in most digits — numerical analysis in one line: "
                "ALGEBRAIC form is an algorithmic decision, and stability is earned, "
                "not assumed."
            )),
            (P, "Course-level traps", (
                "1. Blaming the problem for the algorithm's sins (ill-conditioning "
                "vs instability — diagnose which).\n\n"
                "2. Subtracting nearly equal quantities without a rewrite.\n\n"
                "3. Newton's method without safeguards (divergence, cycling).\n\n"
                "4. High-degree equispaced interpolation (Runge).\n\n"
                "5. Halving step size forever — roundoff eventually GROWS as "
                "discretization shrinks; there is an optimal $h$.\n\n"
                "6. Trusting output with no error estimate attached."
            )),
            (K, "How to work this course", (
                "Prerequisites: CALC2 (Taylor's theorem is the error engine — "
                "C216), LINALG (LA.U1's elimination, LA.U7-U9 for conditioning and "
                "SVD), ODE basics for the back half. Implement everything — the "
                "pathologies (cancellation, Runge, stiffness) must be EXPERIENCED in "
                "code to be believed.\n\n"
                "Self-test: define condition number and stability in one sentence "
                "each, and name which one you can fix by choosing a better "
                "algorithm. (Stability only.)"
            )),
        ],
    },
    # ------------------------------------------------------------------
    "CALCVAR": {
        "summary": "Calculus of variations: optimizing over functions — the Euler-Lagrange equation and its physics.",
        "steps": [
            (L, "What this course is for", (
                "Ordinary optimization picks the best NUMBER; the calculus of "
                "variations picks the best FUNCTION: the shortest path, the "
                "fastest descent curve, the shape a soap film chooses. The central "
                "object is a FUNCTIONAL — a number assigned to each function, "
                "typically $J[y] = \\int F(x, y, y')\\,dx$ — and the central tool is "
                "the Euler-Lagrange equation, the 'set the derivative to zero' of "
                "function space.\n\n"
                "Physics runs on it: mechanics IS the principle of least action."
            )),
            (L, "The arc", (
                "• The EULER-LAGRANGE equation: $\\frac{\\partial F}{\\partial y} - "
                "\\frac{d}{dx}\\frac{\\partial F}{\\partial y'} = 0$ — derived by "
                "perturbing the candidate ($y + \\epsilon\\eta$) and demanding first-"
                "order stationarity.\n"
                "• First integrals: when $F$ misses $y$ or $x$ (the BELTRAMI "
                "identity), the ODE drops an order.\n"
                "• Classical problems: geodesics, the BRACHISTOCHRONE, minimal "
                "surfaces, the hanging chain (constrained: Lagrange multipliers for "
                "isoperimetric problems).\n"
                "• Mechanics: least action → Lagrangian mechanics; NOETHER's "
                "insight — symmetries yield conservation laws.\n"
                "• Second variation and sufficiency; direct methods (a bridge toward "
                "FUNCAN and PDET)."
            )),
            (E, "A signature problem", (
                "The BRACHISTOCHRONE: down which curve does a bead slide between two "
                "points in least time?\n\n"
                "Time functional: $T[y] = \\int \\sqrt{\\frac{1 + y'^2}{2gy}}\\, dx$. "
                "$F$ has no explicit $x$ → Beltrami: "
                "$F - y' F_{y'} = $ const, which simplifies to "
                "$y(1 + y'^2) = C$ — solved by the CYCLOID (the path traced by a "
                "point on a rolling wheel).\n\n"
                "Why it's a signature: the 1696 problem that founded the field; a "
                "functional, a first integral, and a beautiful non-obvious answer "
                "(steeper-then-flatter beats the straight line) in one page."
            )),
            (P, "Course-level traps", (
                "1. Forgetting the $\\frac{d}{dx}$ in Euler-Lagrange is a TOTAL "
                "derivative (chain rule through $y(x), y'(x)$).\n\n"
                "2. Beltrami used when $F$ DOES depend on $x$.\n\n"
                "3. Stationary ≠ minimal — E-L finds candidates; minimality needs "
                "the second variation (or convexity).\n\n"
                "4. Boundary terms dropped silently (natural boundary conditions "
                "exist when endpoints are free).\n\n"
                "5. Constraints ignored — isoperimetric problems need a "
                "multiplier."
            )),
            (K, "How to work this course", (
                "Prerequisites: ODE.U1-U3 (E-L produces second-order ODEs to "
                "solve), CALC3 (partials, chain rule discipline), INTROPROOF "
                "helpful. Work the classics by hand — geodesics on the plane and "
                "sphere, brachistochrone, minimal surface of revolution — each "
                "exercises a different E-L pattern.\n\n"
                "Self-test: derive Euler-Lagrange for "
                "$J[y] = \\int \\sqrt{1 + y'^2}\\,dx$ and confirm straight lines win. "
                "($F_{y} = 0$ → $F_{y'}$ const → $y'$ const.)"
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PDET": {
        "summary": "PDE theory: well-posedness, energy methods, and what solutions mean.",
        "steps": [
            (L, "What this course is for", (
                "Where PF (and PDEM) SOLVE equations, PDE theory asks the prior "
                "questions: does a solution EXIST? Is it UNIQUE? Does it depend "
                "CONTINUOUSLY on the data (Hadamard's well-posedness trio)? And what "
                "should 'solution' even mean when the data is rough?\n\n"
                "The tools — maximum principles, energy estimates, weak "
                "formulations — are how one reasons about equations too hard to "
                "solve, which is most of them (Navier-Stokes regularity is a "
                "Millennium Problem precisely because these questions are hard)."
            )),
            (L, "The arc", (
                "• Well-posedness: the trio, and Hadamard's counterexample "
                "(Cauchy data for Laplace: existence fine, stability "
                "catastrophically false).\n"
                "• MAXIMUM PRINCIPLES: elliptic/parabolic comparison — uniqueness "
                "and stability for heat and Laplace (PF.U6 deepened).\n"
                "• ENERGY METHODS: multiply by $u$, integrate by parts; "
                "$E'(t) \\le 0$ gives uniqueness for the wave equation where maximum "
                "principles fail.\n"
                "• WEAK solutions: divergence-form equations, Sobolev spaces "
                "(a FUNCAN dialect); Lax-Milgram existence.\n"
                "• Regularity: when weak solutions are actually smooth; "
                "characteristics and shock formation as the hyperbolic "
                "counterpoint."
            )),
            (E, "A signature problem", (
                "Prove the heat equation's solution is unique (rod, fixed ends).\n\n"
                "Let $u_1, u_2$ solve it with the same data; set $w = u_1 - u_2$ — "
                "zero initial and boundary values. Define the ENERGY "
                "$E(t) = \\int_0^L w^2\\, dx$. Then\n"
                "$$E'(t) = 2\\int w\\, w_t = 2k\\int w\\, w_{xx} = -2k \\int w_x^2 \\le 0$$\n"
                "(integration by parts; boundary terms vanish). $E(0) = 0$, "
                "$E \\ge 0$, $E$ nonincreasing → $E \\equiv 0$ → $w \\equiv 0$. ∎\n\n"
                "Why it's a signature: no solving, no series — an integral identity "
                "settles uniqueness for EVERY data. Energy methods in miniature."
            )),
            (P, "Course-level traps", (
                "1. Posing the wrong data for the type (PF.U3.N1's lesson, now with "
                "proofs): Cauchy-for-elliptic is the canonical ill-posed problem.\n\n"
                "2. Integration by parts with boundary terms silently dropped.\n\n"
                "3. Maximum principles applied to the wave equation (hyperbolic "
                "equations don't obey them).\n\n"
                "4. 'The formula converges' mistaken for well-posedness.\n\n"
                "5. Weak-solution machinery used without checking the bilinear "
                "form's coercivity."
            )),
            (K, "How to work this course", (
                "Prerequisites: the full PF track (U1-U9) for the equations "
                "themselves; REALAN for rigor; FUNCAN strongly recommended for the "
                "weak-solution half. Habit: for every claim, identify which of the "
                "trio (existence/uniqueness/stability) it addresses and which tool "
                "(maximum principle vs energy) fits the equation's type.\n\n"
                "Self-test: why does backward heat flow violate stability? "
                "(Modes grow like $e^{+n^2 t}$ — arbitrarily small data changes "
                "explode; N4-style Fourier reasoning turned into a "
                "well-posedness verdict.)"
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PDEM": {
        "summary": "PDE methods: the working toolkit — separation, transforms, Green's functions, and numerics-ready forms.",
        "steps": [
            (L, "What this course is for", (
                "The applied companion to PDET: given an equation from physics or "
                "engineering, PRODUCE the solution. The toolkit: separation of "
                "variables on bounded domains, integral transforms on unbounded "
                "ones, Green's functions for point sources, characteristics for "
                "first-order and hyperbolic problems — plus the judgment for WHICH "
                "tool fits which problem, which is the real skill."
            )),
            (L, "The arc, as a decision tree", (
                "• Bounded domain + homogeneous BCs → SEPARATION (PF.U4) + "
                "eigenfunction expansion (PF.U7).\n"
                "• Nonhomogeneous BCs → subtract a steady state first.\n"
                "• Unbounded domain → FOURIER transform (PF.U2) — the heat kernel "
                "drops out in three lines; semi-infinite with time → LAPLACE "
                "(ODE.U4) in $t$.\n"
                "• Point sources / arbitrary forcing → GREEN's functions (PF.U9) + "
                "superposition.\n"
                "• First-order / wave-like → CHARACTERISTICS (PF.U8), d'Alembert "
                "(PF.U5), images for boundaries.\n"
                "• Special geometries: cylinders → Bessel functions, spheres → "
                "Legendre — the same separation ritual with new eigenfunctions.\n\n"
                "The course drills traversing this tree quickly and correctly."
            )),
            (E, "A signature problem", (
                "Heat on the infinite line: $u_t = k u_{xx}$, $u(x, 0) = f(x)$.\n\n"
                "Fourier transform in $x$: $\\hat u_t = -k\\omega^2 \\hat u$ — an ODE "
                "per frequency: $\\hat u = \\hat f(\\omega)\\, e^{-k\\omega^2 t}$. "
                "Invert via the convolution theorem:\n"
                "$$u(x, t) = \\int_{-\\infty}^\\infty \\frac{e^{-(x - s)^2 / 4kt}}{\\sqrt{4\\pi k t}}\\, f(s)\\, ds$$\n"
                "— the HEAT KERNEL smoothing the initial data.\n\n"
                "Why it's a signature: transform → ODE → invert is the method "
                "pipeline in its purest form, and the kernel it produces is "
                "simultaneously a Green's function, a Gaussian (PS10!), and the "
                "explanation of instant smoothing."
            )),
            (P, "Course-level traps", (
                "1. Separation attempted with nonhomogeneous BCs (subtract the "
                "steady state first — the recurring error).\n\n"
                "2. Transform chosen against the domain (Fourier needs the whole "
                "line; finite domains want series).\n\n"
                "3. Eigenfunction family mismatched to boundary conditions "
                "(PF.U7.N2's three cases).\n\n"
                "4. Convolution theorem misused (products vs convolutions "
                "swapped).\n\n"
                "5. Answers left as unevaluated stacks of integrals when a "
                "kernel/series form is expected — finish the inversion."
            )),
            (K, "How to work this course", (
                "Prerequisites: the full PF track, ODE.U2-U4 (the separated ODEs "
                "and Laplace), and CALC3 integration comfort. Build the decision "
                "tree into reflex: for each new problem, write down domain / "
                "boundary conditions / forcing BEFORE choosing a method.\n\n"
                "Self-test: which tool for (a) a plucked guitar string, (b) heat "
                "in an infinite rod, (c) a drumhead, (d) $-u'' = f$ with point "
                "load? (Separation+sine series / Fourier transform / separation "
                "with Bessel / Green's function.)"
            )),
        ],
    },
}
