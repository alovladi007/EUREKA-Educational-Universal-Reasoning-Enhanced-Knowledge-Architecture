"""Coursework: core-track survey courses (PREALG through CALC3).

These nodes are course umbrellas, so their lessons are orientation lessons:
what the course is for, the arc of its material, one signature worked problem,
the course-level traps, and how to work it inside AXIOM. Five steps each.
"""

L = "reading"
E = "example"
P = "pitfall"
K = "check"

LESSONS: dict[str, dict] = {
    # ------------------------------------------------------------------
    "PREALG": {
        "summary": "Integers, fractions, ratio, percent, and order of operations — the arithmetic bedrock everything else stands on.",
        "steps": [
            (L, "What this course is for", (
                "Pre-algebra is fluency training: signed numbers, fractions and decimals, ratios and percents, "
                "and the grammar of expressions (order of operations). Nothing later is harder than its "
                "arithmetic — a calculus student who hesitates on $-3 - (-7)$ or $\\frac{2}{3} \\div \\frac{4}{9}$ "
                "pays for it on every single problem.\n\n"
                "The goal is not exposure but AUTOMATICITY: these operations should cost you nothing."
            )),
            (L, "The arc", (
                "1. Integers and order of operations (ALG.1): signed arithmetic, PEMDAS as a precedence "
                "contract.\n"
                "2. Fractions and decimals (ALG.2): the four operations, conversion both ways, and WHY the "
                "rules work (common denominators; invert-and-multiply as multiplying by 1).\n"
                "3. Ratio and percent: proportional reasoning — the single most-used math skill outside "
                "school.\n\n"
                "Each skill node carries its own full lesson; this page is the map."
            )),
            (E, "A signature problem", (
                "Simplify $\\;12 - 8 \\div 4 \\cdot (-3) + 2^3$.\n\n"
                "Powers first: $2^3 = 8$. Division/multiplication left to right: "
                "$8 \\div 4 = 2$, then $2 \\cdot (-3) = -6$.\n\n"
                "$$12 - (-6) + 8 = 12 + 6 + 8 = 26.$$\n\n"
                "Two classic traps dodged: multiplication does NOT outrank division (left to right!), and "
                "subtracting a negative adds."
            )),
            (P, "Course-level traps", (
                "1. PEMDAS misread as strict M-before-D and A-before-S — each pair is left-to-right.\n\n"
                "2. Sign errors under pressure: $-x^2$ vs $(-x)^2$; distributing a minus across parentheses.\n\n"
                "3. Adding fractions by adding tops and bottoms.\n\n"
                "4. Treating percent as a number instead of 'per hundred of WHAT' — the reference quantity is "
                "the whole game."
            )),
            (K, "How to work this course", (
                "Work ALG.1 and ALG.2 to mastery (the map on the Curriculum page turns them green at 85%), "
                "then let the Path push you into Algebra I. Speed matters here: re-practice nodes until answers "
                "are instant, not just correct.\n\n"
                "Self-test: $\\frac{3}{4} - \\frac{2}{3} \\cdot \\frac{9}{8}$. "
                "(Multiply first: $\\frac{3}{4} - \\frac{3}{4} = 0$.)"
            )),
        ],
    },
    # ------------------------------------------------------------------
    "ALG1": {
        "summary": "Linear expressions, equations, and inequalities in one variable — where letters start doing work.",
        "steps": [
            (L, "What this course is for", (
                "Algebra I turns arithmetic into a language: a variable stands for an unknown, an equation is a "
                "balanced claim about it, and SOLVING is the disciplined use of inverse operations to isolate "
                "it. Every later course — geometry proofs, calculus limits, differential equations — is "
                "conducted in this language.\n\n"
                "The core mental model: an equation is a balance scale; whatever you do to one side, you do to "
                "the other."
            )),
            (L, "The arc", (
                "1. Combining like terms (ALG.3): expressions have structure; only like terms merge.\n"
                "2. One-step equations (ALG.4): a single inverse operation.\n"
                "3. Two-step equations (ALG.5): undo in reverse order of operations.\n"
                "4. Distribution and multi-step equations (ALG.6): clear parentheses, collect, solve.\n"
                "5. Inequalities: same moves, one new rule — multiplying or dividing by a negative FLIPS the "
                "inequality.\n\n"
                "Skill nodes carry the details; the through-line is inverse operations in the right order."
            )),
            (E, "A signature problem", (
                "Solve $\\;3(2x - 5) - 4x = 7$.\n\n"
                "Distribute: $6x - 15 - 4x = 7$. Combine like terms: $2x - 15 = 7$.\n\n"
                "Add 15: $2x = 22$. Divide by 2: $x = 11$.\n\n"
                "CHECK — the habit that separates solid algebra from lucky algebra: "
                "$3(22 - 5) - 44 = 51 - 44 = 7$ ✓."
            )),
            (P, "Course-level traps", (
                "1. Distributing to only the first term inside parentheses: $3(2x - 5) = 6x - 5$ is the #1 "
                "error in the course.\n\n"
                "2. Combining unlike terms ($3x + 2 = 5x$).\n\n"
                "3. Doing an operation to one side only — the balance breaks silently.\n\n"
                "4. Forgetting the inequality flip on negative multiplication/division.\n\n"
                "5. Never checking: substitution catches nearly every slip for ten seconds' work."
            )),
            (K, "How to work this course", (
                "Master ALG.3 → ALG.4 → ALG.5 → ALG.6 in order (each builds literally on the last), then take "
                "the inequalities and word-problem practice. When the Path offers Geometry or Algebra II, "
                "you're ready.\n\n"
                "Self-test: solve $\\frac{x}{3} - 2 = 5$ and check. ($x = 21$.)"
            )),
        ],
    },
    # ------------------------------------------------------------------
    "GEO": {
        "summary": "Plane geometry: congruence, similarity, circles, area — and the two-column proof, your first taste of rigor.",
        "steps": [
            (L, "What this course is for", (
                "Geometry teaches two things at once: FACTS about shapes (angle sums, congruence criteria, "
                "similarity ratios, the Pythagorean theorem, circle theorems) and — more importantly — your "
                "first PROOF DISCIPLINE. The two-column proof is training wheels for INTROPROOF and everything "
                "beyond: every claim must cite a reason.\n\n"
                "Diagrams inform, but never prove: the argument must stand on stated axioms, definitions, and "
                "previously proven theorems."
            )),
            (L, "The arc", (
                "1. Angles and parallel lines: vertical angles, alternate interior angles.\n"
                "2. Triangle congruence: SSS, SAS, ASA, AAS (and why SSA fails).\n"
                "3. Similarity: AA, and proportional reasoning ratios.\n"
                "4. Right triangles: Pythagoras, special triangles ($45{-}45{-}90$, $30{-}60{-}90$) — the "
                "gateway to TRIG.\n"
                "5. Circles: inscribed angles, tangents, arcs.\n"
                "6. Area and volume formulas, derived rather than memorized where possible."
            )),
            (E, "A signature proof", (
                "Claim: the base angles of an isosceles triangle are congruent ($AB = AC \\Rightarrow "
                "\\angle B = \\angle C$).\n\n"
                "Proof (two-column, condensed): draw the bisector of $\\angle A$ meeting $BC$ at $D$. "
                "Then $AB = AC$ (given), $\\angle BAD = \\angle CAD$ (bisector), $AD = AD$ (reflexive) — so "
                "$\\triangle ABD \\cong \\triangle ACD$ by SAS, and $\\angle B = \\angle C$ as corresponding "
                "parts (CPCTC).\n\n"
                "Every line has a REASON — that structure is the entire point."
            )),
            (P, "Course-level traps", (
                "1. Proving from the picture: 'it looks equal' is not a reason.\n\n"
                "2. SSA as a congruence criterion — it isn't (two different triangles can share it).\n\n"
                "3. Confusing congruence (same size and shape) with similarity (same shape, scaled).\n\n"
                "4. Pythagoras on non-right triangles.\n\n"
                "5. Circular reasoning in proofs — using the claim (or a consequence of it) as a step."
            )),
            (K, "How to work this course", (
                "Alternate content practice with proof practice — AXIOM's structured-proof items grade your "
                "reasons, not just your answers. When two-column proofs feel mechanical, INTROPROOF's "
                "paragraph proofs are the natural next step.\n\n"
                "Self-test: a triangle has sides 5, 12, 13. Right triangle or not, and why? "
                "($5^2 + 12^2 = 169 = 13^2$ — yes, by the CONVERSE of Pythagoras.)"
            )),
        ],
    },
    # ------------------------------------------------------------------
    "ALG2": {
        "summary": "Polynomial, rational, exponential, and logarithmic functions — the function zoo, tamed.",
        "steps": [
            (L, "What this course is for", (
                "Algebra II upgrades from solving equations to understanding FUNCTIONS as objects: their "
                "graphs, transformations, zeros, asymptotes, and inverses. The exponential/logarithm pair is "
                "the course's crown jewel — the model for growth, decay, and scale.\n\n"
                "PRECALC and calculus assume every function family here is an old friend: recognize it, sketch "
                "it, solve with it."
            )),
            (L, "The arc", (
                "1. Quadratics in depth: vertex form, completing the square, the quadratic formula and its "
                "discriminant.\n"
                "2. Polynomials: end behavior from the leading term, zeros and multiplicity, division and the "
                "factor/remainder theorems.\n"
                "3. Rational functions: domains, holes vs vertical asymptotes, end behavior (the C104 "
                "preview).\n"
                "4. Radicals and rational exponents.\n"
                "5. Exponentials and logarithms: inverses of each other; the log laws; solving equations by "
                "taking logs.\n"
                "6. Systems and complex numbers as closure for the quadratic story."
            )),
            (E, "A signature problem", (
                "Solve $\\;2 \\cdot 3^{x+1} = 54$.\n\n"
                "Isolate the exponential: $3^{x+1} = 27$.\n\n"
                "Recognize $27 = 3^3$ (or take $\\log_3$): $x + 1 = 3$, so $x = 2$.\n\n"
                "The general pattern when the bases don't match: take a log of both sides and pull the exponent "
                "down — $\\log(a^u) = u \\log a$ is the tool that makes exponents solvable."
            )),
            (P, "Course-level traps", (
                "1. Log-law abuse: $\\log(a + b) \\ne \\log a + \\log b$ — the laws convert PRODUCTS to sums, "
                "nothing else.\n\n"
                "2. Extraneous solutions: squaring both sides and solving log equations can create them; check "
                "in the ORIGINAL equation.\n\n"
                "3. $(a + b)^2 = a^2 + b^2$ — the freshman dream, alive at every level.\n\n"
                "4. Canceling across addition in rational expressions: $\\frac{x + 3}{3}$ is not $x + 1$.\n\n"
                "5. Ignoring domains: $\\log$ needs positive input, even roots need non-negative radicands."
            )),
            (K, "How to work this course", (
                "Take the function families in order; for each, drill three skills: sketch from the formula, "
                "solve equations in the family, and interpret parameters. The exponential/log unit deserves "
                "double time — calculus leans on it hardest.\n\n"
                "Self-test: solve $\\log_2(x) + \\log_2(x - 2) = 3$. "
                "($x(x-2) = 8 \\Rightarrow x = 4$; $x = -2$ is extraneous.)"
            )),
        ],
    },
    # ------------------------------------------------------------------
    "TRIG": {
        "summary": "Trigonometric functions, identities, and equations — the mathematics of angles and oscillation.",
        "steps": [
            (L, "What this course is for", (
                "Trigonometry has two faces: TRIANGLES (SOH-CAH-TOA, laws of sines and cosines — surveying, "
                "navigation, vectors) and the UNIT CIRCLE (sine and cosine as coordinates of a rotating point — "
                "waves, oscillation, and the periodic functions calculus differentiates).\n\n"
                "The unit-circle view is the one higher math uses: $\\sin\\theta$ and $\\cos\\theta$ are the "
                "$y$- and $x$-coordinates at angle $\\theta$, defined for ALL angles, in radians."
            )),
            (L, "The arc", (
                "1. Right-triangle trig and applications.\n"
                "2. The unit circle: radians, reference angles, exact values at "
                "$\\frac{\\pi}{6}, \\frac{\\pi}{4}, \\frac{\\pi}{3}, \\frac{\\pi}{2}, ...$\n"
                "3. Graphs: amplitude, period $\\frac{2\\pi}{b}$, phase shift.\n"
                "4. Identities: Pythagorean, sum/difference, double-angle — tools, not trivia.\n"
                "5. Inverse trig functions and their restricted ranges.\n"
                "6. Trig equations: ALL solutions via reference angles plus periodicity.\n"
                "7. Laws of sines and cosines for oblique triangles (mind the SSA ambiguous case)."
            )),
            (E, "A signature problem", (
                "Solve $\\;2\\sin^2 x - \\sin x - 1 = 0$ on $[0, 2\\pi)$.\n\n"
                "It's a quadratic in $\\sin x$: $(2\\sin x + 1)(\\sin x - 1) = 0$, so "
                "$\\sin x = -\\tfrac{1}{2}$ or $\\sin x = 1$.\n\n"
                "$\\sin x = 1$: $x = \\frac{\\pi}{2}$. "
                "$\\sin x = -\\frac{1}{2}$: reference angle $\\frac{\\pi}{6}$, third and fourth quadrants: "
                "$x = \\frac{7\\pi}{6}, \\frac{11\\pi}{6}$.\n\n"
                "$$x \\in \\left\\{\\tfrac{\\pi}{2},\\; \\tfrac{7\\pi}{6},\\; \\tfrac{11\\pi}{6}\\right\\}.$$"
            )),
            (P, "Course-level traps", (
                "1. Degree/radian mode mismatches — in calculus and physics, radians are the default, "
                "full stop.\n\n"
                "2. $\\sin^{-1}$ read as $\\frac{1}{\\sin}$ — inverse function, not reciprocal (that's "
                "cosecant).\n\n"
                "3. Losing solutions in equations: dividing by $\\cos x$ throws away $\\cos x = 0$ roots; "
                "factor instead.\n\n"
                "4. Inverse-trig ranges: $\\arcsin$ outputs only $[-\\frac{\\pi}{2}, \\frac{\\pi}{2}]$ — the "
                "calculator shows ONE solution; periodicity supplies the rest.\n\n"
                "5. Identity 'proofs' that work both sides simultaneously — transform one side into the other."
            )),
            (K, "How to work this course", (
                "Memorize the unit circle's exact values early (it pays rent daily), then work graphs → "
                "identities → equations. The exact values and Pythagorean identity are prerequisites for "
                "every calculus trig computation.\n\n"
                "Self-test: exact value of $\\cos\\frac{5\\pi}{6}$. "
                "(Reference $\\frac{\\pi}{6}$, second quadrant: $-\\frac{\\sqrt 3}{2}$.)"
            )),
        ],
    },
    # ------------------------------------------------------------------
    "PRECALC": {
        "summary": "Functions, sequences, and the analytic toolkit that makes calculus land softly.",
        "steps": [
            (L, "What this course is for", (
                "Precalculus consolidates everything before the limit concept arrives: function composition "
                "and inverses, the full library of graphs, polynomial/rational behavior, exponentials, logs, "
                "and trig — plus sequences and series notation.\n\n"
                "Calculus failure is usually PRECALC failure in disguise: the derivative rules are easy; the "
                "algebra they act on is where students bleed. This course is the armor."
            )),
            (L, "The arc", (
                "1. Functions as objects: domain, composition $f \\circ g$, inverses and the horizontal line "
                "test.\n"
                "2. The graph library with transformations: shifts, stretches, reflections of "
                "$x^2, x^3, \\sqrt x, |x|, \\frac 1 x, e^x, \\ln x$, trig.\n"
                "3. Polynomial and rational analysis: zeros, multiplicity, asymptotes, end behavior — C103/C104 "
                "in embryo.\n"
                "4. Exponential/log fluency and trig fluency (see ALG2, TRIG).\n"
                "5. Sequences, sigma notation, and the binomial theorem — C210/C211's alphabet.\n"
                "6. Average rate of change and the difference quotient $\\frac{f(x+h) - f(x)}{h}$ — literally "
                "the object C105 takes a limit of."
            )),
            (E, "A signature problem", (
                "Simplify the difference quotient for $f(x) = \\frac{1}{x}$:\n\n"
                "$$\\frac{f(x+h) - f(x)}{h} = \\frac{1}{h}\\left(\\frac{1}{x+h} - \\frac{1}{x}\\right) "
                "= \\frac{1}{h} \\cdot \\frac{x - (x+h)}{x(x+h)} = \\frac{-h}{h \\, x(x+h)} = \\frac{-1}{x(x+h)}.$$\n\n"
                "The $h$ cancels — as it must, and exactly as it will in every C105 derivative computation. "
                "If your difference quotient doesn't cancel its $h$, an algebra error is hiding upstream."
            )),
            (P, "Course-level traps", (
                "1. Composition order: $f(g(x)) \\ne g(f(x))$ in general — read inside-out.\n\n"
                "2. Inverse notation: $f^{-1}(x)$ is not $\\frac{1}{f(x)}$.\n\n"
                "3. Domain neglect after simplification: $\\frac{x^2-1}{x-1}$ simplifies to $x+1$ EXCEPT at "
                "$x = 1$ — precisely the distinction limits are about to exploit.\n\n"
                "4. Difference-quotient algebra: fraction-within-fraction errors; the $h$ must cancel "
                "cleanly.\n\n"
                "5. Off-by-one in sigma notation bounds."
            )),
            (K, "How to work this course", (
                "Prioritize the difference quotient, composition/inverses, and graph transformations — the "
                "three skills calculus consumes on day one. Then confirm ALG2/TRIG mastery on the map before "
                "letting the Path open Calculus I.\n\n"
                "Self-test: if $f(x) = 2x - 3$, find $f^{-1}(x)$ and verify $f(f^{-1}(x)) = x$. "
                "($f^{-1}(x) = \\frac{x+3}{2}$.)"
            )),
        ],
    },
    # ------------------------------------------------------------------
    "CALC1": {
        "summary": "Limits, derivatives, and the first integrals — instantaneous change, made rigorous and useful.",
        "steps": [
            (L, "What this course is for", (
                "Calculus I answers one question three ways: HOW FAST IS IT CHANGING? The limit (C101-C104) "
                "makes 'instantaneous' meaningful; the derivative (C105-C112) computes it; the applications "
                "(C113-C115) use it to find extremes and shapes; and the integral (C116-C118) reverses it and "
                "measures accumulation, joined to derivatives by the Fundamental Theorem.\n\n"
                "One honest sentence of orientation: derivatives are a LANGUAGE for change; the rules are "
                "vocabulary, the applications are conversation."
            )),
            (L, "The arc", (
                "• Limits: C101 (concept) → C102 (algebra) → C103 (continuity, IVT) → C104 (infinity, "
                "asymptotes).\n"
                "• The derivative: C105 (definition) → C106 (where it fails) → C107-C110 (rules: power/product/"
                "quotient, chain, implicit, transcendental).\n"
                "• Applications: C111 (related rates) → C112 (linearization) → C113 (MVT, extrema) → C114 "
                "(curve analysis) → C115 (optimization).\n"
                "• Integration begins: C116 (antiderivatives) → C117 (Riemann sums) → C118 (FTC).\n\n"
                "Each node above carries a full lesson; the map shows your mastery across all of them."
            )),
            (E, "A signature problem", (
                "A box with a square base and open top must hold $32{,}000$ cm³. Minimize the material.\n\n"
                "Objective: $M = x^2 + 4xh$ (base + 4 sides). Constraint: $x^2 h = 32000 \\Rightarrow "
                "h = \\frac{32000}{x^2}$.\n\n"
                "$$M(x) = x^2 + \\frac{128000}{x}, \\qquad M'(x) = 2x - \\frac{128000}{x^2} = 0 "
                "\\Rightarrow x^3 = 64000 \\Rightarrow x = 40.$$\n\n"
                "$M'' > 0$: a minimum. $h = 20$ — base twice the height, and the problem used the whole "
                "course: modeling, differentiation, critical points, verification."
            )),
            (P, "Course-level traps", (
                "1. Chain-rule inner derivatives dropped — the single most common error in all of "
                "calculus.\n\n"
                "2. Treating $\\frac{0}{0}$ as an answer instead of a signal to do algebra.\n\n"
                "3. 'Continuous, therefore differentiable' — the arrow points the other way.\n\n"
                "4. Endpoints forgotten in closed-interval optimization.\n\n"
                "5. Integrating without $+C$, and differentiating products term by term."
            )),
            (K, "How to work this course", (
                "Follow the node order in the arc — the Path enforces the prerequisites. Rules (C107-C110) "
                "deserve drilling to automaticity; applications (C111-C115) deserve slow, modeled setups. "
                "Finish with C118 solid: Calculus II assumes the FTC is reflex.\n\n"
                "Self-test (whole-course): differentiate $f(x) = x^2 e^{3x}$, then find where $f' = 0$. "
                "($f' = e^{3x}(2x + 3x^2)$; zeros at $x = 0, -\\frac{2}{3}$.)"
            )),
        ],
    },
    # ------------------------------------------------------------------
    "CALC2": {
        "summary": "Integration techniques, applications, and infinite series — the accumulation toolkit.",
        "steps": [
            (L, "What this course is for", (
                "Calculus II is two stories. First: INTEGRATION AS CRAFT — substitution, parts, trig methods, "
                "partial fractions (C201-C205), improper integrals (C206), and the geometric applications: "
                "areas, volumes, arc length (C207-C209).\n\n"
                "Second: INFINITE PROCESSES — sequences and series (C210-C213) culminating in power and Taylor "
                "series (C214-C216), where functions themselves become 'infinite polynomials.' The two stories "
                "meet when series answer integrals nothing else can."
            )),
            (L, "The arc", (
                "• Techniques: C201 (substitution) → C202 (parts) → C203 (trig integrals) → C204 (trig sub) → "
                "C205 (partial fractions) → C206 (improper).\n"
                "• Applications: C207 (area between curves) → C208 (volumes) → C209 (arc length/surface).\n"
                "• Series: C210 (sequences) → C211 (series, geometric) → C212 (integral/comparison) → C213 "
                "(ratio/root/alternating) → C214 (power series) → C215 (Taylor) → C216 (error).\n\n"
                "Technique selection is the meta-skill: given an integral, WHICH tool? Given a series, WHICH "
                "test?"
            )),
            (E, "A signature problem", (
                "Technique selection drill — name the tool before touching the pencil:\n\n"
                "• $\\int x e^{x^2} dx$ → substitution ($u = x^2$; the $x$ is $du$'s shadow).\n"
                "• $\\int x e^{x} dx$ → parts (no $du$ present; polynomial shrinks).\n"
                "• $\\int \\frac{dx}{x^2 - 4}$ → partial fractions (factorable denominator).\n"
                "• $\\int \\frac{dx}{x^2 + 4}$ → arctan form (irreducible).\n"
                "• $\\int \\sqrt{9 - x^2}\\, dx$ → trig substitution ($x = 3\\sin\\theta$).\n\n"
                "One symbol's difference reroutes the whole solution — that discrimination is the course."
            )),
            (P, "Course-level traps", (
                "1. Reaching for the heaviest tool first: substitution resolves most integrals; parts and trig "
                "sub are for when it fails.\n\n"
                "2. New variable, old bounds in definite substitutions.\n\n"
                "3. '$a_n \\to 0$ so $\\sum a_n$ converges' — the harmonic series says no, daily.\n\n"
                "4. Ratio test on pure powers of $n$ (always $\\rho = 1$, always silent).\n\n"
                "5. Skipping endpoint checks on intervals of convergence.\n\n"
                "6. Improper integrals evaluated straight through their singularity."
            )),
            (K, "How to work this course", (
                "Drill techniques until SELECTION is fast, then applications, then series in strict order "
                "(C210 → C216) — the tests stack. Keep a one-page 'which test/which technique' decision list "
                "and update it after every mistake.\n\n"
                "Self-test: does $\\sum \\frac{n!}{10^n}$ converge? "
                "(Ratio test: $\\rho = \\lim\\frac{n+1}{10} = \\infty$ — diverges; factorials beat "
                "exponentials.)"
            )),
        ],
    },
    # ------------------------------------------------------------------
    "CALC3": {
        "summary": "Multivariable and vector calculus: gradients, multiple integrals, and the theorems of Green, Stokes, and Gauss.",
        "steps": [
            (L, "What this course is for", (
                "Calculus III lifts everything to higher dimensions, where functions have SURFACES for graphs, "
                "derivatives become GRADIENTS, and integrals sweep areas, volumes, curves, and surfaces. It "
                "ends at the three great integral theorems — Green, Stokes, divergence — which unify "
                "'derivative inside equals boundary outside' and underwrite electromagnetism and fluid "
                "dynamics.\n\n"
                "The recurring pattern: every 1D idea returns with a geometric upgrade. Tangent line → tangent "
                "plane; $\\frac{d}{dx}$ → $\\nabla$; FTC → Stokes."
            )),
            (L, "The arc", (
                "• Geometry: C301 (vectors, dot/cross) → C302 (lines, planes, quadrics) → C303 (curves).\n"
                "• Differentiation: C304 (partials) → C305 (tangent planes) → C306 (chain rule) → C307 "
                "(gradient) → C308 (critical points) → C309 (Lagrange).\n"
                "• Integration: C310 (double) → C311 (polar) → C312 (triple, cylindrical/spherical).\n"
                "• Vector calculus: C313 (fields, div, curl) → C314 (line integrals) → C315 (Green) → C316 "
                "(Stokes and divergence).\n\n"
                "The final four nodes are the destination; everything earlier is the road."
            )),
            (E, "A signature problem", (
                "Maximize $f(x,y) = x + 2y$ on the circle $x^2 + y^2 = 5$ — three course ideas in one.\n\n"
                "Lagrange (C309): $\\langle 1, 2 \\rangle = \\lambda \\langle 2x, 2y \\rangle \\Rightarrow "
                "y = 2x$. Constraint: $5x^2 = 5 \\Rightarrow x = \\pm 1$.\n\n"
                "Candidates $(1, 2)$ with $f = 5$ and $(-1,-2)$ with $f = -5$: max $5$.\n\n"
                "Geometric reading (C307): at the optimum the gradient $\\langle 1,2 \\rangle$ is NORMAL to the "
                "circle — the level line of $f$ kisses the constraint. The algebra and the picture agree, "
                "which is the course in miniature."
            )),
            (P, "Course-level traps", (
                "1. Jacobians dropped: polar $r$, spherical $\\rho^2\\sin\\phi$ — the errors that look like "
                "success until the numbers are checked.\n\n"
                "2. Unit vectors forgotten in directional derivatives.\n\n"
                "3. $D < 0$ read as 'max' instead of SADDLE.\n\n"
                "4. Orientation mismatches in Green/Stokes/divergence applications.\n\n"
                "5. Reversing integration order by symbol-shuffling instead of redrawing the region.\n\n"
                "6. Conservative-field shortcuts used without testing conservativity first."
            )),
            (K, "How to work this course", (
                "Draw EVERYTHING — regions, level curves, gradients, orientations; this course rewards "
                "pictures more than any before it. Work the arc in order; before the theorem trio (C314-C316), "
                "make sure C310-C312 integrals are routine, because every theorem converts one integral into "
                "another.\n\n"
                "Self-test (whole-course): why does $\\oint_C \\nabla f \\cdot d\\mathbf{r} = 0$ for any "
                "closed $C$ — and which two nodes explain it? (C314's fundamental theorem; C313's "
                "curl-of-gradient-is-zero gives the Stokes route.)"
            )),
        ],
    },
}
