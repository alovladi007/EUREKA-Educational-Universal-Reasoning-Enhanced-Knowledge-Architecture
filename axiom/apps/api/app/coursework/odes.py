"""Coursework: ordinary differential equations unit nodes ODE.U0-ODE.U7.

Five steps per lesson: two readings, a worked example, pitfalls, check.
"""

L = "reading"
E = "example"
P = "pitfall"
K = "check"

LESSONS: dict[str, dict] = {
    # ------------------------------ U0 ------------------------------
    "ODE.U0.N1": {
        "summary": "Antiderivatives for ODEs: the integration toolkit every solution method draws on.",
        "steps": [
            (L, "Antiderivatives, quickly", (
                "$F$ is an antiderivative of $f$ when $F' = f$; the family is $F(x) + C$. The core "
                "table:\n"
                "$$\\int x^n dx = \\frac{x^{n+1}}{n+1} + C \\;(n \\ne -1), \\quad \\int \\frac{dx}{x} = \\ln|x| + C,$$\n"
                "$$\\int e^{kx} dx = \\frac{e^{kx}}{k} + C, \\quad \\int \\cos kx\\, dx = \\frac{\\sin kx}{k} + C.$$\n\n"
                "Every ODE method ends in 'now integrate' — separation, integrating factors, variation "
                "of parameters all reduce solving to antidifferentiation. Rusty integration = broken "
                "ODE course."
            )),
            (L, "The two techniques ODEs lean on hardest", (
                "• SUBSTITUTION: for $\\int f(g(x))g'(x)dx$ — spot the inner function whose derivative "
                "is the leftover factor. ODEs generate these constantly ($\\int \\frac{y'}{y}\\,dx = "
                "\\ln|y|$ is the whole separable method).\n\n"
                "• PARTS: $\\int u\\,dv = uv - \\int v\\,du$ — for products like $\\int x e^{x} dx$ and "
                "$\\int e^{ax}\\cos bx\\,dx$ (the latter by applying parts twice and solving for the "
                "integral).\n\n"
                "And the simplest ODE is literally integration: $y' = f(x) \\Rightarrow "
                "y = \\int f\\,dx + C$ — one constant per integration, fixed by initial conditions."
            )),
            (E, "Worked example", (
                "Solve $y'' = 6x$ with $y(0) = 1$, $y'(0) = 2$.\n\n"
                "Integrate once: $y' = 3x^2 + C_1$; from $y'(0) = 2$: $C_1 = 2$.\n"
                "Again: $y = x^3 + 2x + C_2$; from $y(0) = 1$: $C_2 = 1$.\n\n"
                "$$y = x^3 + 2x + 1.$$\n\n"
                "Two integrations, two constants, two conditions — the pattern (order of ODE = number "
                "of constants) holds for everything ahead."
            )),
            (P, "Pitfalls", (
                "1. Dropping $+C$ — in ODEs the constant IS the answer's structure; losing it loses "
                "the solution family.\n\n"
                "2. $\\int \\frac{dx}{x} = \\ln x$ without absolute value.\n\n"
                "3. Forgetting the $\\frac 1 k$ on $\\int e^{kx}$ and $\\int \\cos kx$.\n\n"
                "4. Fixing constants in the wrong order (apply each condition as soon as its constant "
                "appears).\n\n"
                "5. Parts with $u$ and $dv$ chosen so the new integral is HARDER — differentiate the "
                "polynomial, integrate the exponential/trig."
            )),
            (K, "Check yourself", (
                "You should be able to: integrate the standard table fluently, run substitution and "
                "parts, and solve $y^{(n)} = f(x)$ by repeated integration.\n\n"
                "Self-test: $\\int x e^{2x} dx$. "
                "($\\frac{x}{2}e^{2x} - \\frac14 e^{2x} + C$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------ U1: first order ------------------------------
    "ODE.U1.N1": {
        "summary": "Separable first-order ODEs: split the variables, integrate both sides.",
        "steps": [
            (L, "The method", (
                "An ODE is SEPARABLE when it factors as $\\frac{dy}{dx} = g(x)\\,h(y)$. Then divide and "
                "integrate:\n"
                "$$\\int \\frac{dy}{h(y)} = \\int g(x)\\, dx + C.$$\n\n"
                "One constant suffices (constants from both sides merge). The result is often IMPLICIT "
                "— an equation linking $y$ and $x$; solve for $y$ when algebra allows, and keep the "
                "implicit form when it doesn't."
            )),
            (L, "Lost solutions and the workhorse example", (
                "Dividing by $h(y)$ silently assumes $h(y) \\ne 0$: each root $y_0$ of $h$ gives a "
                "CONSTANT solution $y \\equiv y_0$ that division discards. Check for them separately — "
                "graders and nature both care.\n\n"
                "The most important separable equation: $y' = ky$ → $y = Ce^{kx}$ — exponential "
                "growth/decay (population, radioactive decay, Newton cooling in shifted form). Notice "
                "$y \\equiv 0$ is the lost solution, recovered by allowing $C = 0$."
            )),
            (E, "Worked example", (
                "Solve $\\frac{dy}{dx} = \\frac{x y^2}{1 + x^2}$, $y(0) = 1$.\n\n"
                "Separate: $\\int y^{-2} dy = \\int \\frac{x}{1+x^2} dx$ → "
                "$-\\frac 1 y = \\frac12 \\ln(1 + x^2) + C$.\n\n"
                "$y(0) = 1$: $-1 = 0 + C$. So\n"
                "$$y = \\frac{1}{1 - \\frac12 \\ln(1 + x^2)}.$$\n\n"
                "(And $y \\equiv 0$ is a solution the division dropped — not the one through our "
                "initial point, but part of the full story.)"
            )),
            (P, "Pitfalls", (
                "1. Separating incompletely — every $y$ must leave the right side before "
                "integrating.\n\n"
                "2. Forgetting $+C$ or attaching it to both sides as two constants that never "
                "merge.\n\n"
                "3. Losing constant solutions $h(y) = 0$.\n\n"
                "4. Solving the implicit relation for $y$ with sign/branch errors — check against the "
                "initial condition.\n\n"
                "5. Treating non-separable equations (e.g. $y' = x + y$) as separable — additive "
                "structure does NOT factor."
            )),
            (K, "Check yourself", (
                "You should be able to: recognize separability, integrate both sides with one constant, "
                "apply initial conditions, and hunt lost constant solutions.\n\n"
                "Self-test: solve $y' = -2xy$, $y(0) = 3$. ($y = 3e^{-x^2}$.)\n\nPractice the node."
            )),
        ],
    },
    "ODE.U1.N2": {
        "summary": "First-order linear ODEs: the integrating factor method.",
        "steps": [
            (L, "Standard form and the factor", (
                "A first-order LINEAR equation, in standard form:\n"
                "$$y' + P(x)\\, y = Q(x).$$\n\n"
                "Multiply by the INTEGRATING FACTOR $\\mu(x) = e^{\\int P\\,dx}$ — chosen precisely so "
                "the left side collapses into one derivative:\n"
                "$$\\mu y' + \\mu P y = (\\mu y)'.$$\n\n"
                "Then $(\\mu y)' = \\mu Q$: integrate and divide by $\\mu$. The method never fails on "
                "linear equations — the only hazard is the integrals themselves."
            )),
            (L, "The procedure and its structure", (
                "1. Put in standard form (coefficient of $y'$ must be 1 — divide through first).\n"
                "2. $\\mu = e^{\\int P dx}$ (no $+C$ needed here; any one factor works).\n"
                "3. $y = \\frac{1}{\\mu}\\left(\\int \\mu Q\\, dx + C\\right)$.\n\n"
                "The answer's shape: (particular response to the forcing $Q$) + $\\frac{C}{\\mu}$ "
                "(the homogeneous decay) — the general = particular + homogeneous structure again. "
                "Mixing-tank, RL-circuit, and Newton-cooling problems are all this equation wearing "
                "different units."
            )),
            (E, "Worked example", (
                "Solve $x y' + 2y = x^3$ for $x > 0$.\n\n"
                "Standard form: $y' + \\frac 2 x y = x^2$; so $\\mu = e^{2\\ln x} = x^2$.\n\n"
                "$(x^2 y)' = x^4 \\Rightarrow x^2 y = \\frac{x^5}{5} + C$.\n"
                "$$y = \\frac{x^3}{5} + \\frac{C}{x^2}.$$\n\n"
                "Check by substituting: $xy' + 2y = x(\\frac{3x^2}{5} - \\frac{2C}{x^3}) + "
                "\\frac{2x^3}{5} + \\frac{2C}{x^2} = x^3$ ✓."
            )),
            (P, "Pitfalls", (
                "1. Computing $\\mu$ before dividing out the $y'$ coefficient — $P$ is read from "
                "STANDARD form only.\n\n"
                "2. Sign errors in $\\int P\\,dx$ (a wrong-sign exponent breaks everything "
                "downstream).\n\n"
                "3. Forgetting to multiply $Q$ by $\\mu$ too.\n\n"
                "4. Adding $C$ before dividing by $\\mu$... actually the $C$ must appear WHEN you "
                "integrate, then gets divided: $\\frac{C}{\\mu}$, not a bare $+ C$ at the end.\n\n"
                "5. Using this on NONlinear equations ($y'$ + $P y^2$ = ... is not linear; no "
                "integrating factor of this kind exists)."
            )),
            (K, "Check yourself", (
                "You should be able to: normalize to standard form, build $\\mu$, collapse the left "
                "side, and finish with correctly-placed $C$.\n\n"
                "Self-test: solve $y' + y = e^x$. ($\\mu = e^x$; $y = \\frac{e^x}{2} + Ce^{-x}$.)\n\n"
                "Practice the node."
            )),
        ],
    },
    "ODE.U1.N3": {
        "summary": "Exact first-order ODEs: M dx + N dy = 0 with a potential function.",
        "steps": [
            (L, "Exactness", (
                "Write the equation as $M(x, y)\\,dx + N(x, y)\\,dy = 0$. It is EXACT when a potential "
                "$F(x,y)$ exists with $F_x = M$ and $F_y = N$ — then solutions are the level curves\n"
                "$$F(x, y) = C.$$\n\n"
                "The TEST (Clairaut's equality of mixed partials):\n"
                "$$\\text{exact} \\iff \\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}.$$\n\n"
                "Always test BEFORE hunting for $F$ — a failed test means a different method (or an "
                "integrating factor to repair exactness)."
            )),
            (L, "Reconstructing the potential", (
                "1. Integrate $M$ with respect to $x$: $F = \\int M\\,dx + g(y)$ — the 'constant' is "
                "an unknown FUNCTION of $y$.\n"
                "2. Differentiate this $F$ with respect to $y$ and match to $N$: solve for $g'(y)$.\n"
                "3. Integrate $g'$; assemble $F(x,y) = C$.\n\n"
                "Consistency check built in: $g'(y)$ must come out free of $x$ — any surviving $x$ "
                "means an arithmetic slip or a non-exact equation. (Symmetrically, you may start from "
                "$N$ and integrate in $y$.)"
            )),
            (E, "Worked example", (
                "Solve $(2xy + 3)\\,dx + (x^2 - 1)\\,dy = 0$.\n\n"
                "Test: $M_y = 2x$, $N_x = 2x$ ✓ exact.\n\n"
                "$F = \\int (2xy + 3)\\,dx = x^2 y + 3x + g(y)$. Then "
                "$F_y = x^2 + g'(y) \\overset{!}{=} x^2 - 1 \\Rightarrow g'(y) = -1 \\Rightarrow g = -y$.\n\n"
                "$$x^2 y + 3x - y = C.$$\n\n"
                "Explicit if wanted: $y = \\frac{C - 3x}{x^2 - 1}$."
            )),
            (P, "Pitfalls", (
                "1. Skipping the exactness test and 'finding' a potential that doesn't exist.\n\n"
                "2. Writing $g(y)$ as a constant $C$ in step 1 — it must be a function of $y$.\n\n"
                "3. An $x$ appearing in $g'(y)$ and getting integrated anyway — that's the alarm "
                "bell, stop and recheck.\n\n"
                "4. Sign confusion from moving the equation into $M\\,dx + N\\,dy = 0$ form "
                "($y' = f$ means $-f\\,dx + dy = 0$).\n\n"
                "5. Reporting $F(x,y)$ alone — the SOLUTION is $F(x,y) = C$."
            )),
            (K, "Check yourself", (
                "You should be able to: test exactness, reconstruct the potential from either side, "
                "and use the built-in consistency check.\n\n"
                "Self-test: is $(y\\cos x)\\,dx + (\\sin x)\\,dy = 0$ exact? "
                "($M_y = \\cos x = N_x$ ✓; $F = y\\sin x = C$.)\n\nPractice the node."
            )),
        ],
    },
    "ODE.U1.N4": {
        "summary": "Existence and uniqueness for first-order IVPs: the Picard–Lindelöf conditions.",
        "steps": [
            (L, "The theorem", (
                "For the IVP $y' = f(x, y)$, $y(x_0) = y_0$:\n\n"
                "• If $f$ is CONTINUOUS near $(x_0, y_0)$: a solution EXISTS locally.\n"
                "• If additionally $\\partial f / \\partial y$ is continuous there (a Lipschitz "
                "condition): the solution is UNIQUE.\n\n"
                "Both conclusions are LOCAL — guaranteed on some interval around $x_0$, possibly "
                "small: solutions can blow up in finite time ($y' = y^2$, $y(0) = 1$ dies at $x = 1$) "
                "even with beautiful $f$."
            )),
            (L, "When uniqueness fails", (
                "The classic: $y' = 3y^{2/3}$, $y(0) = 0$. Here $f_y = 2y^{-1/3}$ blows up at $y = 0$ "
                "— hypothesis violated — and indeed BOTH $y \\equiv 0$ and $y = x^3$ solve the IVP "
                "(infinitely many solutions, splicing zero stretches with cubics).\n\n"
                "Practical readings: uniqueness means solution curves through distinct points NEVER "
                "CROSS — the phase-line/phase-plane pictures of U7 depend on it. And 'the theorem's "
                "hypotheses fail' does NOT prove non-uniqueness — it merely withdraws the guarantee; "
                "each case then needs direct inspection."
            )),
            (E, "Worked example", (
                "For which initial points does $y' = \\frac{y}{x}$ have a unique solution?\n\n"
                "$f = y/x$ and $f_y = 1/x$ are continuous wherever $x \\ne 0$ — so through every point "
                "off the $y$-axis: exists, unique. (Solutions: $y = Cx$.)\n\n"
                "At $x_0 = 0$: the theorem is silent. Direct check — every line $y = Cx$ passes "
                "through $(0,0)$ (no uniqueness there), and NO solution passes through $(0, 1)$ "
                "(no existence). Both failure modes, one equation."
            )),
            (P, "Pitfalls", (
                "1. Reading the guarantee as global — it's an interval around $x_0$, and finite-time "
                "blow-up is common.\n\n"
                "2. 'Hypotheses fail ⇒ no solution/many solutions' — failure of hypotheses proves "
                "NOTHING by itself.\n\n"
                "3. Checking continuity of $f$ but forgetting the $f_y$ condition when uniqueness is "
                "the question.\n\n"
                "4. Applying the test at the wrong point — hypotheses are checked AT the initial "
                "condition.\n\n"
                "5. Concluding curves may cross where the theorem applies — uniqueness forbids "
                "exactly that."
            )),
            (K, "Check yourself", (
                "You should be able to: state both conditions and their conclusions, locate points "
                "where guarantees fail, and produce the standard non-uniqueness example.\n\n"
                "Self-test: does $y' = \\sqrt{|y|}$, $y(0) = 4$ have a unique local solution? "
                "(Yes — near $y = 4$, $f_y$ is fine; trouble lives only at $y = 0$.)\n\n"
                "Practice the node."
            )),
        ],
    },
    "ODE.U1.N5": {
        "summary": "General vs particular solutions: constants, initial conditions, and solution families.",
        "steps": [
            (L, "The vocabulary", (
                "• GENERAL solution: the full family, carrying arbitrary constants — one per order "
                "($n$-th order ODE → $n$ constants).\n"
                "• PARTICULAR solution: one member, constants pinned by initial or boundary "
                "conditions.\n"
                "• SINGULAR solutions (occasionally): solutions outside the family entirely — e.g. "
                "the lost constant solutions of separable equations.\n\n"
                "An IVP (initial value problem) gives $y, y', \\ldots$ at ONE point; a BVP (boundary "
                "value problem) constrains at two points — BVPs can have no or many solutions even "
                "when IVPs behave."
            )),
            (L, "Geometry of the family", (
                "A first-order general solution is a one-parameter family of curves filling the "
                "plane; the initial condition picks the curve through your point. Where uniqueness "
                "holds (ODE.U1.N4), exactly one curve passes through each point — the family "
                "FOLIATES the region.\n\n"
                "Checking a proposed general solution: substitute it into the ODE (must satisfy "
                "identically, for EVERY constant value), and count constants against the order. "
                "Both checks are fast; both catch real errors."
            )),
            (E, "Worked example", (
                "Verify $y = Ce^{-2x} + \\frac{x}{2} - \\frac14$ is the general solution of "
                "$y' + 2y = x$, then solve the IVP $y(0) = 1$.\n\n"
                "Substitute: $y' = -2Ce^{-2x} + \\frac12$, so "
                "$y' + 2y = \\frac12 + x - \\frac12 = x$ ✓ for all $C$. First order, one constant ✓.\n\n"
                "IVP: $1 = C - \\frac14 \\Rightarrow C = \\frac54$:\n"
                "$$y = \\frac54 e^{-2x} + \\frac x 2 - \\frac 14.$$"
            )),
            (P, "Pitfalls", (
                "1. Wrong constant count (a 2nd-order general solution with one $C$ is not "
                "general).\n\n"
                "2. Merging constants illegally: $C_1 e^x + C_2 e^x$ is really ONE constant; "
                "$C_1 e^x + C_2 e^{2x}$ is two.\n\n"
                "3. Applying initial conditions BEFORE finishing the general solution (in multi-step "
                "methods, constants interact).\n\n"
                "4. IVP vs BVP confusion — existence/uniqueness theory differs sharply.\n\n"
                "5. Forgetting singular solutions when the problem asks for ALL solutions."
            )),
            (K, "Check yourself", (
                "You should be able to: verify general solutions by substitution, count constants, "
                "apply conditions to extract particular solutions, and distinguish IVPs from BVPs.\n\n"
                "Self-test: how many conditions pin down the general solution of a 3rd-order ODE? "
                "(Three — e.g. $y, y', y''$ at one point.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------ U2: 2nd order homogeneous ------------------------------
    "ODE.U2.N1": {
        "summary": "The characteristic equation: turning constant-coefficient ODEs into algebra.",
        "steps": [
            (L, "The exponential ansatz", (
                "For $ay'' + by' + cy = 0$ (constant coefficients), try $y = e^{rx}$: every derivative "
                "returns a multiple of itself, so substituting gives\n"
                "$$(ar^2 + br + c)\\, e^{rx} = 0 \\quad \\Rightarrow \\quad ar^2 + br + c = 0$$\n"
                "— the CHARACTERISTIC equation. Since $e^{rx} \\ne 0$, the ODE reduces entirely to "
                "this quadratic. Derivatives became powers: calculus became algebra.\n\n"
                "(The same move solved recurrence relations in DM10 — same algebra, discrete time.)"
            )),
            (L, "The three cases ahead", (
                "The discriminant $b^2 - 4ac$ routes everything:\n\n"
                "• POSITIVE → two real distinct roots (ODE.U2.N2): pure exponentials.\n"
                "• ZERO → repeated root (ODE.U2.N3): an $x e^{rx}$ appears.\n"
                "• NEGATIVE → complex pair (ODE.U2.N4): oscillation, $e^{\\alpha x}(\\cos, \\sin)$.\n\n"
                "In all cases the general solution is $y = C_1 y_1 + C_2 y_2$ built from two "
                "INDEPENDENT solutions — guaranteed by linearity + superposition (ODE.U2.N6). "
                "Physical reading for $my'' + cy' + ky = 0$: mass-spring-damper; the roots ARE the "
                "system's decay rates and frequencies."
            )),
            (E, "Worked example", (
                "Form and factor the characteristic equation of $y'' - y' - 6y = 0$:\n"
                "$$r^2 - r - 6 = (r - 3)(r + 2) = 0 \\Rightarrow r = 3, -2.$$\n\n"
                "General solution (next node makes this official): $y = C_1 e^{3x} + C_2 e^{-2x}$.\n\n"
                "Verify one piece: $(e^{3x})'' - (e^{3x})' - 6e^{3x} = (9 - 3 - 6)e^{3x} = 0$ ✓ — "
                "substituting a candidate root back is a two-second check."
            )),
            (P, "Pitfalls", (
                "1. Sign transcription: $y'' - y' - 6y$ gives $r^2 - r - 6$, matching signs "
                "exactly.\n\n"
                "2. Writing the characteristic equation for NON-constant coefficients "
                "($x y'' + y = 0$ has no such equation — different theory).\n\n"
                "3. Missing the middle term: $y'' - 6y = 0$ gives $r^2 - 6 = 0$, roots "
                "$\\pm\\sqrt 6$, not 6.\n\n"
                "4. Only first-order thinking: an $n$-th order equation gives a degree-$n$ polynomial "
                "with $n$ roots.\n\n"
                "5. Using the ansatz on NONhomogeneous equations — it builds $y_h$; the forcing needs "
                "U3's methods."
            )),
            (K, "Check yourself", (
                "You should be able to: derive the characteristic equation from the ansatz, "
                "transcribe signs correctly, and route by discriminant.\n\n"
                "Self-test: characteristic equation and roots of $y'' + 4y' + 4y = 0$? "
                "($r^2 + 4r + 4 = (r+2)^2$: repeated $r = -2$.)\n\nPractice the node."
            )),
        ],
    },
    "ODE.U2.N2": {
        "summary": "Real distinct roots: general solution from two exponentials.",
        "steps": [
            (L, "The solution", (
                "Roots $r_1 \\ne r_2$ (real) give two independent solutions $e^{r_1 x}, e^{r_2 x}$ "
                "and the general solution\n"
                "$$y = C_1 e^{r_1 x} + C_2 e^{r_2 x}.$$\n\n"
                "Independence is automatic for distinct exponents (their Wronskian "
                "$(r_2 - r_1)e^{(r_1 + r_2)x}$ never vanishes), so this pair always spans the full "
                "solution space of the 2nd-order equation."
            )),
            (L, "Reading the roots", (
                "Sign of each root = fate of its mode:\n\n"
                "• $r < 0$: decaying mode (transient).\n"
                "• $r > 0$: growing mode (instability).\n"
                "• Both negative → overdamped return to rest; one of each → saddle-like blowup for "
                "generic initial conditions.\n\n"
                "As $x \\to \\infty$ the LARGER root dominates. IVPs: differentiate the general "
                "solution, impose $y(x_0)$ and $y'(x_0)$, solve the little 2×2 linear system for "
                "$C_1, C_2$ — linear algebra in miniature."
            )),
            (E, "Worked example", (
                "Solve $y'' - y' - 6y = 0$, $y(0) = 1$, $y'(0) = 8$.\n\n"
                "Roots $3, -2$ (from N1): $y = C_1 e^{3x} + C_2 e^{-2x}$, "
                "$y' = 3C_1 e^{3x} - 2C_2 e^{-2x}$.\n\n"
                "At 0: $C_1 + C_2 = 1$, $3C_1 - 2C_2 = 8$. Solve: $C_1 = 2$, $C_2 = -1$.\n"
                "$$y = 2e^{3x} - e^{-2x}.$$\n\n"
                "Long-run: the $e^{3x}$ mode owns the future; the $e^{-2x}$ term is a transient "
                "correction near $x = 0$."
            )),
            (P, "Pitfalls", (
                "1. Imposing BOTH conditions on $y$ (one belongs to $y'$).\n\n"
                "2. Differentiating the general solution wrongly (each exponential brings down ITS "
                "root).\n\n"
                "3. Solving the 2×2 for $C_1, C_2$ with arithmetic slips — substitute back into both "
                "conditions.\n\n"
                "4. Writing $e^{r_1 x} + e^{r_2 x}$ 'combined' as $e^{(r_1 + r_2)x}$ — exponentials "
                "of sums are products, not sums.\n\n"
                "5. Using this form when roots are NOT distinct (repeated roots need ODE.U2.N3's "
                "$x$ factor)."
            )),
            (K, "Check yourself", (
                "You should be able to: write the two-exponential general solution, fit both initial "
                "conditions, and read stability from the root signs.\n\n"
                "Self-test: solve $y'' - 4y = 0$, $y(0) = 0$, $y'(0) = 4$. "
                "($r = \\pm 2$; $y = e^{2x} - e^{-2x}$.)\n\nPractice the node."
            )),
        ],
    },
    "ODE.U2.N3": {
        "summary": "Repeated roots: the x·e^{rx} second solution.",
        "steps": [
            (L, "The problem and the fix", (
                "Discriminant zero → one root $r$ of multiplicity 2 → only ONE exponential $e^{rx}$; "
                "a 2nd-order equation needs TWO independent solutions.\n\n"
                "The second is $x e^{rx}$ (found by reduction of order — try $y = v(x) e^{rx}$ and "
                "discover $v'' = 0$, so $v = x$ works):\n"
                "$$y = (C_1 + C_2 x)\\, e^{rx}.$$\n\n"
                "Higher multiplicity extends the pattern: root repeated $k$ times → "
                "$e^{rx}, xe^{rx}, \\ldots, x^{k-1}e^{rx}$."
            )),
            (L, "Critical damping", (
                "The physical home of repeated roots: $my'' + cy' + ky = 0$ at CRITICAL damping "
                "($c^2 = 4mk$). The system returns to equilibrium as fast as possible WITHOUT "
                "oscillating — the tuning used in door closers and (idealized) shock absorbers.\n\n"
                "Note the growth subtlety: for $r < 0$, $x e^{rx} \\to 0$ still (exponential decay "
                "beats linear growth), but it first RISES before decaying — critically damped "
                "systems can overshoot in slope even while never oscillating."
            )),
            (E, "Worked example", (
                "Solve $y'' + 4y' + 4y = 0$, $y(0) = 1$, $y'(0) = -1$.\n\n"
                "$(r + 2)^2 = 0$: $y = (C_1 + C_2 x)e^{-2x}$.\n"
                "$y' = (C_2 - 2C_1 - 2C_2 x)e^{-2x}$.\n\n"
                "At 0: $C_1 = 1$; $C_2 - 2 = -1 \\Rightarrow C_2 = 1$.\n"
                "$$y = (1 + x)e^{-2x}.$$\n\n"
                "Check the second solution really solves: for $y = xe^{-2x}$, "
                "$y'' + 4y' + 4y = (4x - 4)e^{-2x} + 4(1 - 2x)e^{-2x} + 4xe^{-2x} = 0$ ✓."
            )),
            (P, "Pitfalls", (
                "1. Writing $C_1 e^{rx} + C_2 e^{rx}$ — that's one constant in disguise; the $x$ "
                "factor is mandatory.\n\n"
                "2. Product-rule errors differentiating $(C_1 + C_2 x)e^{rx}$ — both factors "
                "contribute.\n\n"
                "3. Guessing the second solution as $e^{rx}\\ln x$ or $x^2 e^{rx}$ — reduction of "
                "order says $x e^{rx}$, exactly.\n\n"
                "4. 'Repeated root, so the solution grows' — decay wins for $r < 0$; the polynomial "
                "factor only delays it.\n\n"
                "5. Missing higher-multiplicity extensions on 3rd/4th-order problems."
            )),
            (K, "Check yourself", (
                "You should be able to: produce $(C_1 + C_2 x)e^{rx}$ on sight of a double root, fit "
                "IVPs through the product rule, and explain critical damping.\n\n"
                "Self-test: general solution of $y'' - 6y' + 9y = 0$? "
                "($(C_1 + C_2 x)e^{3x}$.)\n\nPractice the node."
            )),
        ],
    },
    "ODE.U2.N4": {
        "summary": "Complex roots: oscillation via e^{αx}(cos βx, sin βx).",
        "steps": [
            (L, "From complex exponentials to real oscillation", (
                "Roots $r = \\alpha \\pm i\\beta$ ($\\beta \\ne 0$) give, via Euler's formula "
                "$e^{i\\beta x} = \\cos\\beta x + i \\sin\\beta x$, the REAL general solution\n"
                "$$y = e^{\\alpha x}\\left(C_1 \\cos \\beta x + C_2 \\sin \\beta x\\right).$$\n\n"
                "Reading: $\\beta$ = angular frequency of oscillation; $\\alpha$ = growth/decay rate "
                "of the envelope. $\\alpha < 0$: damped oscillation (spiral to rest); $\\alpha = 0$: "
                "pure oscillation forever; $\\alpha > 0$: growing oscillation."
            )),
            (L, "Amplitude-phase form and the physics", (
                "The same solution rewrites as\n"
                "$$y = R\\, e^{\\alpha x} \\cos(\\beta x - \\varphi), \\qquad R = \\sqrt{C_1^2 + C_2^2}$$\n"
                "— amplitude and phase instead of two coefficients: better for reading maxima and "
                "envelopes.\n\n"
                "The flagship: $y'' + \\omega^2 y = 0$ → $y = C_1 \\cos\\omega x + C_2 \\sin \\omega x$ "
                "— simple harmonic motion, the most important ODE in physics. Underdamped "
                "mass-spring: $r = \\frac{-c \\pm \\sqrt{c^2 - 4mk}}{2m}$ complex when damping is "
                "light; the oscillation frequency $\\beta$ is slightly LESS than the undamped "
                "$\\omega = \\sqrt{k/m}$."
            )),
            (E, "Worked example", (
                "Solve $y'' + 2y' + 5y = 0$, $y(0) = 1$, $y'(0) = -1$.\n\n"
                "$r = \\frac{-2 \\pm \\sqrt{4 - 20}}{2} = -1 \\pm 2i$: "
                "$y = e^{-x}(C_1 \\cos 2x + C_2 \\sin 2x)$.\n\n"
                "$y(0) = 1$: $C_1 = 1$. "
                "$y' = e^{-x}[(-C_1 + 2C_2)\\cos 2x + (-C_2 - 2C_1)\\sin 2x]$, so "
                "$y'(0) = -1 + 2C_2 = -1 \\Rightarrow C_2 = 0$.\n"
                "$$y = e^{-x}\\cos 2x$$\n"
                "— oscillation at frequency 2 inside a decaying envelope $e^{-x}$."
            )),
            (P, "Pitfalls", (
                "1. Leaving the answer complex ($C_1 e^{(\\alpha+i\\beta)x} + \\ldots$) when a real "
                "form is expected.\n\n"
                "2. Swapping $\\alpha$ and $\\beta$ roles — the REAL part goes in the envelope, the "
                "IMAGINARY part in the trig.\n\n"
                "3. Losing the $\\frac{1}{2a}$ in the quadratic formula (frequency off by a "
                "factor).\n\n"
                "4. Differentiating $e^{\\alpha x}\\cos\\beta x$ without the product rule.\n\n"
                "5. Setting $C_2$ from $y'(0)$ while forgetting the $-C_1$ cross-term the product "
                "rule created."
            )),
            (K, "Check yourself", (
                "You should be able to: convert complex pairs to the real oscillatory form, fit "
                "IVPs, rewrite in amplitude-phase form, and read $\\alpha, \\beta$ physically.\n\n"
                "Self-test: general solution of $y'' + 9y = 0$? "
                "($C_1\\cos 3x + C_2 \\sin 3x$ — SHM at frequency 3.)\n\nPractice the node."
            )),
        ],
    },
    "ODE.U2.N5": {
        "summary": "Undetermined coefficients: guessing particular solutions by the forcing's form.",
        "steps": [
            (L, "The idea", (
                "For $ay'' + by' + cy = g(x)$ with 'nice' forcing (polynomials, exponentials, sines "
                "and cosines, and their products), guess a $y_p$ of the SAME FORM with unknown "
                "coefficients, substitute, and match:\n\n"
                "• $g = $ polynomial of degree $n$ → guess a FULL degree-$n$ polynomial.\n"
                "• $g = e^{kx}$ → guess $Ae^{kx}$.\n"
                "• $g = \\cos\\omega x$ or $\\sin\\omega x$ → guess $A\\cos\\omega x + B\\sin\\omega x$ "
                "(BOTH, always).\n\n"
                "Products of these → products of the guesses. The method works because these "
                "function families are closed under differentiation."
            )),
            (L, "Matching and combining", (
                "Substitute the guess, collect by function type, equate coefficients — a small "
                "linear system for the unknowns.\n\n"
                "Multiple forcing terms: split by superposition, find a $y_p$ for each piece, add.\n\n"
                "THE CAVEAT (full story in ODE.U3.N2): if the guess duplicates a homogeneous "
                "solution, it gets annihilated — multiply by $x$ (resonance). Always compute $y_h$ "
                "FIRST and compare. For non-nice forcing ($\\tan x$, $\\frac 1 x$, $\\ln x$): this "
                "method does not apply; use variation of parameters."
            )),
            (E, "Worked example", (
                "Find $y_p$ for $y'' + 3y' + 2y = 4x^2$.\n\n"
                "Guess the FULL polynomial $y_p = Ax^2 + Bx + C$: "
                "$y_p' = 2Ax + B$, $y_p'' = 2A$.\n\n"
                "Substitute: $2A + 6Ax + 3B + 2Ax^2 + 2Bx + 2C = 4x^2$.\n"
                "Match: $x^2$: $2A = 4 \\to A = 2$; $x$: $6A + 2B = 0 \\to B = -6$; "
                "const: $2A + 3B + 2C = 0 \\to C = 7$.\n"
                "$$y_p = 2x^2 - 6x + 7.$$\n\n"
                "Note $B, C \\ne 0$ even though $g$ had no $x$ or constant term — the lower-degree "
                "terms are NOT optional."
            )),
            (P, "Pitfalls", (
                "1. Guessing only the terms present in $g$ ($Ax^2$ alone) — differentiation "
                "generates lower degrees; include them all.\n\n"
                "2. Guessing $A\\cos\\omega x$ without the $B\\sin\\omega x$ partner.\n\n"
                "3. Not checking the guess against $y_h$ (resonance silently gives $0 = g$).\n\n"
                "4. Applying the method to $g = \\tan x$ or $\\sec x$ — outside its scope.\n\n"
                "5. Arithmetic in coefficient matching — organize by function type in columns before "
                "equating."
            )),
            (K, "Check yourself", (
                "You should be able to: write the correct full-form guess for each forcing type, "
                "match coefficients systematically, and know the method's boundary.\n\n"
                "Self-test: guess for $y'' + y' = x e^{2x}$? "
                "($(Ax + B)e^{2x}$ — product of full line and exponential.)\n\nPractice the node."
            )),
        ],
    },
    "ODE.U2.N6": {
        "summary": "Superposition: general = homogeneous + particular, and why linearity makes it work.",
        "steps": [
            (L, "The structure theorem", (
                "For the linear equation $L[y] = ay'' + by' + cy = g$:\n"
                "$$y_{\\text{general}} = y_h + y_p$$\n"
                "— ALL solutions of $L[y] = g$ are (general homogeneous) + (any one particular).\n\n"
                "Why: if $L[y_1] = L[y_2] = g$, then $L[y_1 - y_2] = 0$ — two answers differ by a "
                "homogeneous solution. So one particular solution plus the full homogeneous family "
                "IS everything.\n\n"
                "(The same theorem organized linear systems in LA.U1.N11: particular + null space. "
                "Same linearity, different clothes.)"
            )),
            (L, "Superposition of forcings, and its limits", (
                "Linearity also splits the right side: if $L[y_1] = g_1$ and $L[y_2] = g_2$, then "
                "$L[y_1 + y_2] = g_1 + g_2$. Solve for each forcing separately and add — the "
                "engineering habit of decomposing inputs into modes (Fourier series, PF.U1) rests "
                "entirely on this.\n\n"
                "LIMITS: superposition is a property of LINEAR equations only. For $y'' + y^2 = g$, "
                "sums of solutions solve nothing. Also mind the order of operations in IVPs: build "
                "the COMPLETE general solution $y_h + y_p$ FIRST, then apply initial conditions — "
                "conditions applied to $y_h$ alone give wrong constants."
            )),
            (E, "Worked example", (
                "Solve $y'' + 4y = 8x$, $y(0) = 0$, $y'(0) = 6$.\n\n"
                "$y_h$: roots $\\pm 2i$ → $C_1 \\cos 2x + C_2 \\sin 2x$.\n"
                "$y_p$: guess $Ax + B$ → $4Ax + 4B = 8x$ → $y_p = 2x$.\n\n"
                "General: $y = C_1\\cos 2x + C_2 \\sin 2x + 2x$.\n"
                "NOW the conditions: $y(0) = C_1 = 0$; $y' = 2C_2\\cos 2x + 2$, so "
                "$y'(0) = 2C_2 + 2 = 6 \\Rightarrow C_2 = 2$.\n"
                "$$y = 2\\sin 2x + 2x.$$\n\n"
                "Had we fit conditions to $y_h$ alone: $C_2 = 3$ — wrong. The $y_p$ contributes to "
                "$y'(0)$ too."
            )),
            (P, "Pitfalls", (
                "1. Applying initial conditions before adding $y_p$ — the classic order error.\n\n"
                "2. Adding two particular solutions of the SAME forcing expecting a better one "
                "(their difference is homogeneous; one suffices).\n\n"
                "3. Using superposition on nonlinear equations.\n\n"
                "4. Forgetting that $y_p$ is 'any one' — different valid methods give "
                "different-looking $y_p$'s whose difference is homogeneous; both are right.\n\n"
                "5. Splitting the forcing but forgetting to add ALL the pieces back."
            )),
            (K, "Check yourself", (
                "You should be able to: state and use $y = y_h + y_p$, split forcings by linearity, "
                "and sequence IVP work correctly.\n\n"
                "Self-test: $y_p = e^x$ solves $L[y] = g$; $y_h = C e^{-x}$. What is the general "
                "solution, and how many solutions pass through $y(0) = 5$? "
                "($y = Ce^{-x} + e^x$; exactly one: $C = 4$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------ U3: nonhomogeneous depth ------------------------------
    "ODE.U3.N1": {
        "summary": "Undetermined coefficients for polynomial and exponential forcing, systematically.",
        "steps": [
            (L, "The guess table, sharpened", (
                "For $L[y] = g$ with constant coefficients:\n\n"
                "• $g = P_n(x)$ (degree-$n$ polynomial) → $y_p = $ full degree-$n$ polynomial.\n"
                "• $g = P_n(x)\\, e^{kx}$ → $y_p = (\\text{full degree-}n\\text{ polynomial}) \\cdot e^{kx}$.\n\n"
                "The exponential rides along cleanly: substituting $y = q(x)e^{kx}$ converts "
                "$L[y] = P_n e^{kx}$ into a polynomial identity for $q$. Efficient workflow: factor "
                "out $e^{kx}$ FIRST, then match polynomial coefficients — half the writing, half "
                "the errors."
            )),
            (L, "Edge cases that change the guess", (
                "• $k$ equals a characteristic root → multiply the guess by $x$ (by $x^2$ for a "
                "double root) — the resonance rule, fully treated in ODE.U3.N2.\n"
                "• $g$ a CONSTANT is the degree-0 case: guess $A$... unless $r = 0$ is a root "
                "(no undifferentiated $y$ term), then $Ax$.\n"
                "• Sums: handle each term by superposition.\n\n"
                "Always: compute the homogeneous roots BEFORE writing any guess. The 30 seconds "
                "spent there prevents the silent $0 = g$ dead end."
            )),
            (E, "Worked example", (
                "Find $y_p$ for $y'' - 3y' + 2y = (2x + 1)e^{3x}$.\n\n"
                "Roots: $1, 2$ — and $k = 3$ is NOT among them; plain guess "
                "$y_p = (Ax + B)e^{3x}$.\n\n"
                "With $y_p = q e^{3x}$, $q = Ax + B$: "
                "$L[y_p] = e^{3x}[q'' + (6-3)q' + (9 - 9 + 2)q] = e^{3x}[q'' + 3q' + 2q]$.\n"
                "So $q'' + 3q' + 2q = 2x + 1$: $3A \\cdot 1 + 2(Ax + B) + 0 = 2x + 1$ → "
                "$2A = 2 \\Rightarrow A = 1$; $3A + 2B = 1 \\Rightarrow B = -1$.\n"
                "$$y_p = (x - 1)e^{3x}.$$"
            )),
            (P, "Pitfalls", (
                "1. Truncated polynomial guesses (degree-$n$ forcing needs ALL powers $0..n$).\n\n"
                "2. Forgetting the polynomial factor when forcing is $P_n e^{kx}$ (guessing "
                "$Ae^{kx}$ against $x e^{kx}$).\n\n"
                "3. Not checking $k$ against the characteristic roots.\n\n"
                "4. Product-rule fatigue differentiating $q(x)e^{kx}$ raw — use the factor-out-"
                "$e^{kx}$ shortcut.\n\n"
                "5. Matching coefficients across DIFFERENT function types (an $e^{kx}x$ coefficient "
                "never equates with a bare $x$ one)."
            )),
            (K, "Check yourself", (
                "You should be able to: write full guesses for $P_n$ and $P_n e^{kx}$ forcing, use "
                "the exponential-shift shortcut, and pre-check roots.\n\n"
                "Self-test: guess for $y'' - y = x^2 e^{2x}$? "
                "($(Ax^2 + Bx + C)e^{2x}$ — $k = 2$ is not a root of $r^2 = 1$.)\n\n"
                "Practice the node."
            )),
        ],
    },
    "ODE.U3.N2": {
        "summary": "Resonance and the modification rule: multiply by x when the guess hits y_h.",
        "steps": [
            (L, "Why the plain guess dies", (
                "If the forcing matches a homogeneous mode — $g = e^{kx}$ with $k$ a characteristic "
                "root, or $\\cos\\omega x$ with $\\pm i\\omega$ roots — the standard guess satisfies "
                "$L[\\text{guess}] = 0$: substituting gives $0 = g$, unsolvable.\n\n"
                "THE RULE: multiply the guess by $x$; if the root is repeated (multiplicity 2), by "
                "$x^2$. In general: $x^s$ where $s$ = multiplicity of the offending root.\n\n"
                "This mirrors the homogeneous repeated-root story (ODE.U2.N3) — the $x$ factor is "
                "how solutions escape a crowded exponential family."
            )),
            (L, "Physical resonance", (
                "Force an undamped oscillator at its own natural frequency: "
                "$y'' + \\omega^2 y = \\cos\\omega t$ has "
                "$y_p = \\frac{t}{2\\omega}\\sin\\omega t$ — amplitude GROWING LINEARLY in time. "
                "That $t$ out front is the mathematical signature of resonance: pushing a swing in "
                "rhythm, wine glasses at the right pitch, the reason soldiers break step on "
                "bridges.\n\n"
                "With damping, true resonance softens to a finite peak near the natural frequency — "
                "the response is bounded but can still be dangerously large. The modification rule "
                "is the bookkeeping; the growth is the physics."
            )),
            (E, "Worked example", (
                "Find $y_p$ for $y'' - 4y = e^{2x}$.\n\n"
                "Roots $\\pm 2$; $k = 2$ IS a root (multiplicity 1). Guess $y_p = Axe^{2x}$.\n\n"
                "$y_p' = A(1 + 2x)e^{2x}$, $y_p'' = A(4 + 4x)e^{2x}$.\n"
                "$L[y_p] = A(4 + 4x)e^{2x} - 4Axe^{2x} = 4Ae^{2x} \\overset{!}{=} e^{2x} "
                "\\Rightarrow A = \\frac14$.\n"
                "$$y_p = \\frac{x}{4} e^{2x}.$$\n\n"
                "(The plain guess $Ae^{2x}$ would have produced $0 = e^{2x}$ — try it once to feel "
                "the wall.)"
            )),
            (P, "Pitfalls", (
                "1. Skipping the root check and hitting $0 = g$ mid-page.\n\n"
                "2. Multiplying by $x$ when the root ISN'T a match (an unnecessary $x$ still "
                "'works' but bloats the algebra and invites errors — the clean guess is the "
                "right one).\n\n"
                "3. Using $x$ where $x^2$ is needed (double root forcing, e.g. "
                "$y'' - 4y' + 4y = e^{2x}$ needs $Ax^2 e^{2x}$).\n\n"
                "4. For trig forcing, checking only $\\cos$: the roots to compare are "
                "$\\pm i\\omega$ against the characteristic pair.\n\n"
                "5. Modifying the ENTIRE multi-term guess when only one piece resonates — the rule "
                "applies per forcing term."
            )),
            (K, "Check yourself", (
                "You should be able to: detect resonance by comparing forcing to roots, apply "
                "$x^s$ with the right $s$, and connect the math to physical resonance.\n\n"
                "Self-test: guess for $y'' + 9y = \\sin 3x$? "
                "($x(A\\cos 3x + B\\sin 3x)$ — $\\pm 3i$ are the roots.)\n\nPractice the node."
            )),
        ],
    },
    "ODE.U3.N3": {
        "summary": "Variation of parameters: the universal particular-solution formula.",
        "steps": [
            (L, "The method", (
                "Given $y'' + p y' + q y = g$ (LEADING COEFFICIENT 1) and homogeneous solutions "
                "$y_1, y_2$, seek $y_p = u_1 y_1 + u_2 y_2$ with FUNCTIONS $u_i$. Imposing the "
                "standard side condition yields\n"
                "$$u_1' = \\frac{-y_2\\, g}{W}, \\qquad u_2' = \\frac{y_1\\, g}{W}, \\qquad "
                "W = y_1 y_2' - y_1' y_2$$\n"
                "(the WRONSKIAN). Integrate, assemble. Works for ANY continuous forcing — "
                "$\\tan x$, $\\frac{e^x}{x}$, things undetermined coefficients cannot touch — and "
                "for variable-coefficient equations once $y_1, y_2$ are known."
            )),
            (L, "When to use which", (
                "Undetermined coefficients: faster when forcing is polynomial/exponential/trig — "
                "use it there. Variation of parameters: the fallback with no forcing restrictions, "
                "at the cost of two integrals that may be hard (and may need to stay as "
                "integrals).\n\n"
                "Bookkeeping notes: the formula REQUIRES the equation normalized (divide by the "
                "leading coefficient first — $g$ changes!); constants of integration in $u_1, u_2$ "
                "may be dropped (they only regenerate $y_h$); and $W \\ne 0$ always, since "
                "$y_1, y_2$ are independent."
            )),
            (E, "Worked example", (
                "Solve $y'' + y = \\tan x$.\n\n"
                "$y_1 = \\cos x$, $y_2 = \\sin x$, $W = \\cos^2 + \\sin^2 = 1$.\n\n"
                "$u_1' = -\\sin x \\tan x = \\frac{\\cos^2 x - 1}{\\cos x} = \\cos x - \\sec x$ → "
                "$u_1 = \\sin x - \\ln|\\sec x + \\tan x|$.\n"
                "$u_2' = \\cos x \\tan x = \\sin x$ → $u_2 = -\\cos x$.\n\n"
                "$y_p = u_1 \\cos x + u_2 \\sin x = -\\cos x \\ln|\\sec x + \\tan x|$ "
                "(the $\\sin x\\cos x$ terms cancel).\n"
                "$$y = C_1 \\cos x + C_2 \\sin x - \\cos x \\ln|\\sec x + \\tan x|.$$\n\n"
                "No guess exists for $\\tan x$ — this is variation of parameters' home turf."
            )),
            (P, "Pitfalls", (
                "1. Using the formula without normalizing the leading coefficient — the $g$ in the "
                "formula is the normalized right side.\n\n"
                "2. Swapping the minus sign ($u_1'$ carries $-y_2 g$).\n\n"
                "3. Wronskian computed as $y_1 y_2' + y_1' y_2$ — it's a difference.\n\n"
                "4. Grinding the integrals of $u_1', u_2'$ with sign errors — this method is 90% "
                "integration technique.\n\n"
                "5. Reaching for it when a 10-second undetermined-coefficients guess exists."
            )),
            (K, "Check yourself", (
                "You should be able to: state and apply the formulas, normalize first, and choose "
                "between the two particular-solution methods.\n\n"
                "Self-test: set up (don't integrate) $u_1', u_2'$ for $y'' - y = \\frac{e^x}{x}$ "
                "with $y_1 = e^x, y_2 = e^{-x}$. ($W = -2$; "
                "$u_1' = \\frac{1}{2x}$, $u_2' = -\\frac{e^{2x}}{2x}$.)\n\nPractice the node."
            )),
        ],
    },
    "ODE.U3.N4": {
        "summary": "The full nonhomogeneous solution: assembling y_h + y_p and fitting data.",
        "steps": [
            (L, "The complete workflow", (
                "1. HOMOGENEOUS: characteristic roots → $y_h$ with its two constants.\n"
                "2. PARTICULAR: undetermined coefficients (nice forcing, watch resonance) or "
                "variation of parameters (anything).\n"
                "3. GENERAL: $y = y_h + y_p$.\n"
                "4. DATA LAST: apply initial/boundary conditions to the COMPLETE $y$.\n\n"
                "Every 2nd-order linear constant-coefficient problem is these four steps; the art "
                "is only in step 2's method choice and algebra hygiene."
            )),
            (L, "Reading the answer: transient + steady state", (
                "In damped physical systems, $y_h \\to 0$ (all roots have negative real part) — "
                "the TRANSIENT, carrying the initial conditions' memory. What remains is the "
                "forced response — the STEADY STATE, inherited from $y_p$.\n\n"
                "So for large times the system forgets where it started and dances to the forcing: "
                "an RLC circuit driven at $\\omega$ eventually oscillates at $\\omega$ regardless "
                "of how it was switched on. Exam questions 'find the steady-state response' are "
                "asking for the bounded part of $y_p$ alone — no constants to fit."
            )),
            (E, "Worked example", (
                "Solve $y'' + 2y' + y = 2e^{-x}$... note $r = -1$ is a DOUBLE root.\n\n"
                "$y_h = (C_1 + C_2 x)e^{-x}$. Resonance with multiplicity 2: guess "
                "$y_p = Ax^2 e^{-x}$.\n\n"
                "Substituting (factor $e^{-x}$ out): $[q'' - 2q' + q] + 2[q' - q] + q = q'' = 2$ "
                "with $q = Ax^2$: $2A = 2 \\Rightarrow A = 1$.\n"
                "$$y = (C_1 + C_2 x)e^{-x} + x^2 e^{-x}.$$\n\n"
                "With $y(0) = 1, y'(0) = 0$: $C_1 = 1$; "
                "$y' = (C_2 - C_1 + (2 - C_2)x - x^2)e^{-x}$ at 0: $C_2 - 1 = 0$, $C_2 = 1$.\n"
                "Final: $y = (1 + x + x^2)e^{-x}$ — every mode decays: pure transient here."
            )),
            (P, "Pitfalls", (
                "1. Conditions applied before $y_p$ joins (the recurring order error — worth its "
                "second warning).\n\n"
                "2. Resonance multiplicity misread (double root → $x^2$, not $x$).\n\n"
                "3. Steady state reported WITH transient terms still attached.\n\n"
                "4. Two methods mixed mid-problem (a variation-of-parameters $u$ glued onto a "
                "guessed polynomial).\n\n"
                "5. Not verifying: substituting the final $y$ back into the ODE catches everything "
                "and costs one minute."
            )),
            (K, "Check yourself", (
                "You should be able to: run the four-step workflow end to end, separate transient "
                "from steady state, and verify by substitution.\n\n"
                "Self-test: for $y'' + 4y' + 3y = 6$, what is the steady-state solution? "
                "($y_p = 2$ — constants: roots $-1, -3$ both decay.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------ U4: Laplace ------------------------------
    "ODE.U4.N1": {
        "summary": "The Laplace transform: definition and the table of elementary transforms.",
        "steps": [
            (L, "The definition", (
                "$$\\mathcal L\\{f(t)\\} = F(s) = \\int_0^\\infty e^{-st} f(t)\\, dt$$\n"
                "— trade a function of time for a function of the complex variable $s$. The "
                "transform is LINEAR, and it exists for functions of exponential order (everything "
                "in this course).\n\n"
                "Why bother: differentiation in $t$ becomes MULTIPLICATION by $s$ (ODE.U4.N3) — "
                "ODEs with initial conditions become algebra in $s$."
            )),
            (L, "The core table", (
                "Compute once from the definition, then memorize:\n"
                "$$\\mathcal L\\{1\\} = \\frac 1 s, \\qquad \\mathcal L\\{t^n\\} = \\frac{n!}{s^{n+1}}, "
                "\\qquad \\mathcal L\\{e^{at}\\} = \\frac{1}{s - a},$$\n"
                "$$\\mathcal L\\{\\sin \\omega t\\} = \\frac{\\omega}{s^2 + \\omega^2}, \\qquad "
                "\\mathcal L\\{\\cos \\omega t\\} = \\frac{s}{s^2 + \\omega^2}.$$\n\n"
                "Convergence fine print: each holds for $s$ large enough ($s > a$ for $e^{at}$, "
                "$s > 0$ for the rest). Distinguishing $\\sin$ ($\\omega$ upstairs) from $\\cos$ "
                "($s$ upstairs) prevents half of all table errors."
            )),
            (E, "Worked example", (
                "From the definition, compute $\\mathcal L\\{e^{at}\\}$:\n"
                "$$\\int_0^\\infty e^{-st} e^{at} dt = \\int_0^\\infty e^{-(s-a)t} dt "
                "= \\left[\\frac{e^{-(s-a)t}}{-(s-a)}\\right]_0^\\infty = \\frac{1}{s-a} \\quad (s > a).$$\n\n"
                "Then by linearity:\n"
                "$$\\mathcal L\\{3 - 2t + 5e^{-4t}\\} = \\frac 3 s - \\frac{2}{s^2} + \\frac{5}{s + 4}.$$\n\n"
                "Note $e^{-4t}$ → $\\frac{1}{s+4}$: the sign in the table entry flips with $a$."
            )),
            (P, "Pitfalls", (
                "1. $\\mathcal L\\{t^n\\} = \\frac{n!}{s^{n+1}}$ — forgetting the FACTORIAL or "
                "using $s^n$.\n\n"
                "2. $\\sin$/$\\cos$ numerators swapped.\n\n"
                "3. Sign of $a$: $e^{-4t} \\to \\frac{1}{s+4}$, not $\\frac{1}{s-4}$.\n\n"
                "4. Transforming PRODUCTS termwise: $\\mathcal L\\{fg\\} \\ne F \\cdot G$ "
                "(that's what convolution is for).\n\n"
                "5. Dropping the region of validity when it matters (improper integral must "
                "converge)."
            )),
            (K, "Check yourself", (
                "You should be able to: compute simple transforms from the definition, apply the "
                "table with linearity, and keep the sin/cos and sign conventions straight.\n\n"
                "Self-test: $\\mathcal L\\{t^3 + \\cos 2t\\}$? "
                "($\\frac{6}{s^4} + \\frac{s}{s^2 + 4}$.)\n\nPractice the node."
            )),
        ],
    },
    "ODE.U4.N2": {
        "summary": "Inverse Laplace transforms: partial fractions back to the time domain.",
        "steps": [
            (L, "Inversion by table", (
                "In practice, inversion = algebraic massage until each piece matches a table entry, "
                "then read backwards. The main tool is PARTIAL FRACTIONS: factor the denominator of "
                "$F(s)$, decompose, invert term by term (linearity works backwards too).\n\n"
                "$$\\frac{1}{s - a} \\to e^{at}, \\quad \\frac{n!}{s^{n+1}} \\to t^n, \\quad "
                "\\frac{\\omega}{s^2 + \\omega^2} \\to \\sin\\omega t, \\quad "
                "\\frac{s}{s^2 + \\omega^2} \\to \\cos\\omega t.$$"
            )),
            (L, "The decomposition patterns", (
                "• Distinct linear factors: $\\frac{A}{s - a} + \\frac{B}{s - b}$ — cover-up method "
                "finds $A, B$ fastest.\n"
                "• Repeated: $\\frac{A}{s-a} + \\frac{B}{(s-a)^2}$ (all powers).\n"
                "• Irreducible quadratic: $\\frac{As + B}{s^2 + \\beta^2}$ — then SPLIT the "
                "numerator: the $As$ piece is a cosine, the $B$ piece a sine (fix the $\\omega$ "
                "upstairs by multiply-divide).\n\n"
                "Completing the square handles shifted quadratics: "
                "$s^2 + 2s + 5 = (s+1)^2 + 4$ — which hands off to the $s$-shift theorem "
                "(ODE.U4.N4)."
            )),
            (E, "Worked example", (
                "Invert $F(s) = \\dfrac{3s + 7}{s^2 - 2s - 3} = \\dfrac{3s + 7}{(s-3)(s+1)}$.\n\n"
                "Cover-up: at $s = 3$: $A = \\frac{16}{4} = 4$; at $s = -1$: $B = \\frac{4}{-4} = -1$.\n"
                "$$F = \\frac{4}{s - 3} - \\frac{1}{s + 1} \\;\\Rightarrow\\; "
                "f(t) = 4e^{3t} - e^{-t}.$$\n\n"
                "Quadratic drill: $\\frac{2s + 3}{s^2 + 9} = 2\\frac{s}{s^2+9} + \\frac{3}{3}"
                "\\cdot\\frac{3}{s^2+9} \\to 2\\cos 3t + \\sin 3t$ — the numerator split in "
                "action."
            )),
            (P, "Pitfalls", (
                "1. Partial-fraction setup missing repeated-power terms.\n\n"
                "2. Quadratic factors given a single-constant numerator ($\\frac{A}{s^2+4}$ instead "
                "of $\\frac{As + B}{s^2 + 4}$).\n\n"
                "3. Forgetting to fix the $\\omega$: $\\frac{1}{s^2 + 9}$ inverts to "
                "$\\frac13 \\sin 3t$, not $\\sin 3t$.\n\n"
                "4. Factorable quadratics treated as irreducible (check the discriminant "
                "first).\n\n"
                "5. Cover-up applied to repeated factors (works only for the TOP power; the rest "
                "need matching or differentiation)."
            )),
            (K, "Check yourself", (
                "You should be able to: decompose all three factor patterns, split quadratic "
                "numerators, and invert to a clean time-domain expression.\n\n"
                "Self-test: invert $\\frac{5}{(s+2)^2}$. ($5te^{-2t}$ — via the shifted "
                "$\\frac{1}{s^2}$.)\n\nPractice the node."
            )),
        ],
    },
    "ODE.U4.N3": {
        "summary": "Transforms of derivatives and solving IVPs: initial conditions built in.",
        "steps": [
            (L, "The derivative rule", (
                "$$\\mathcal L\\{y'\\} = sY(s) - y(0), \\qquad "
                "\\mathcal L\\{y''\\} = s^2 Y(s) - s\\,y(0) - y'(0).$$\n\n"
                "Differentiation → multiplication by $s$, with the initial conditions entering "
                "AUTOMATICALLY. This is the Laplace method's superpower: no general solution, no "
                "constant-fitting afterwards — the IVP data is wired in from the first line."
            )),
            (L, "The IVP pipeline", (
                "1. Transform the whole ODE (linearity + derivative rules).\n"
                "2. Solve ALGEBRAICALLY for $Y(s)$ — always possible: "
                "$Y = \\frac{\\text{transformed forcing} + \\text{IC terms}}{\\text{characteristic polynomial in } s}$.\n"
                "3. Invert (partial fractions, shifts).\n\n"
                "Note who shows up in the denominator: the characteristic polynomial — Laplace and "
                "the U2 method agree about what matters. Laplace shines for piecewise/impulse "
                "forcing (step functions, hammer blows) where guessing methods are awkward."
            )),
            (E, "Worked example", (
                "Solve $y'' + y = 1$, $y(0) = 0$, $y'(0) = 1$.\n\n"
                "Transform: $s^2 Y - s(0) - 1 + Y = \\frac 1 s$ → "
                "$(s^2 + 1)Y = \\frac 1 s + 1$ → "
                "$Y = \\frac{1}{s(s^2+1)} + \\frac{1}{s^2 + 1}$.\n\n"
                "Decompose: $\\frac{1}{s(s^2+1)} = \\frac 1 s - \\frac{s}{s^2+1}$.\n"
                "$$Y = \\frac 1 s - \\frac{s}{s^2 + 1} + \\frac{1}{s^2+1} \\;\\Rightarrow\\; "
                "y = 1 - \\cos t + \\sin t.$$\n\n"
                "Check: $y(0) = 0$ ✓, $y'(0) = 1$ ✓, $y'' + y = \\cos t - \\sin t... $ compute: "
                "$y'' = \\cos t - \\sin t$, sum $= 1$ ✓."
            )),
            (P, "Pitfalls", (
                "1. Sign/order in the $y''$ rule: it's $-s\\,y(0) - y'(0)$ — the HIGHER power of "
                "$s$ multiplies $y(0)$.\n\n"
                "2. Forgetting to transform the right side too.\n\n"
                "3. Solving for $Y$ but leaving the IC terms behind in the shuffle.\n\n"
                "4. Inverting $\\frac{1}{s(s^2+1)}$ by 'table lookup' without decomposition.\n\n"
                "5. Using $y(0)$ values from the wrong problem — the rule hard-codes t = 0; "
                "conditions at other points need a shift first."
            )),
            (K, "Check yourself", (
                "You should be able to: transform derivatives with ICs embedded, solve for "
                "$Y(s)$, and invert to the answer with no constant-fitting step.\n\n"
                "Self-test: transform $y' - 2y = 0$, $y(0) = 3$ and solve. "
                "($Y = \\frac{3}{s-2}$; $y = 3e^{2t}$.)\n\nPractice the node."
            )),
        ],
    },
    "ODE.U4.N4": {
        "summary": "Shifting theorems: e^{at} shifts in s; step functions shift in t.",
        "steps": [
            (L, "The s-shift (first shifting theorem)", (
                "$$\\mathcal L\\{e^{at} f(t)\\} = F(s - a)$$\n"
                "— multiplying by $e^{at}$ in time SHIFTS the transform. Everything you know about "
                "$F$ relocates to $s = a$:\n"
                "$$\\mathcal L\\{e^{-t}\\cos 2t\\} = \\frac{s + 1}{(s+1)^2 + 4}.$$\n\n"
                "Inverting: complete the square in the denominator, rewrite the numerator in terms "
                "of $(s - a)$, read off $e^{at} \\times$ (table entry) — the standard route for "
                "damped-oscillation transforms."
            )),
            (L, "The t-shift (second shifting theorem)", (
                "With the unit step $u_c(t) = u(t - c)$ (0 before $c$, 1 after):\n"
                "$$\\mathcal L\\{u(t - c)\\, f(t - c)\\} = e^{-cs} F(s).$$\n\n"
                "Delay in time = $e^{-cs}$ factor in $s$. This is how Laplace eats PIECEWISE "
                "forcing: write the on/off behavior with step functions, transform term by term. "
                "The discipline: the $f$ must appear with argument $t - c$ — rewrite "
                "$u(t-c)g(t)$ as $u(t-c)\\,\\tilde g(t - c)$ (substitute) before transforming."
            )),
            (E, "Worked example", (
                "Invert $F(s) = \\dfrac{s + 3}{s^2 + 4s + 13}$.\n\n"
                "Complete the square: $s^2 + 4s + 13 = (s+2)^2 + 9$. Rewrite the numerator around "
                "$s + 2$: $s + 3 = (s + 2) + 1$.\n"
                "$$F = \\frac{s+2}{(s+2)^2 + 9} + \\frac13 \\cdot \\frac{3}{(s+2)^2 + 9}$$\n"
                "$$\\Rightarrow \\; f(t) = e^{-2t}\\cos 3t + \\tfrac13 e^{-2t} \\sin 3t.$$\n\n"
                "The $s$-shift turned an opaque quadratic into damped oscillation with rate 2 and "
                "frequency 3 — readable straight from the completed square."
            )),
            (P, "Pitfalls", (
                "1. $s$-shift direction: $e^{at}f \\to F(s - a)$ — $e^{-2t}$ shifts to $s + 2$.\n\n"
                "2. Numerator not rewritten around the shift ($s + 3$ must become "
                "$(s+2) + 1$ first).\n\n"
                "3. $t$-shift without matching argument: $\\mathcal L\\{u(t-c) f(t)\\} \\ne "
                "e^{-cs} F(s)$ — the $f$ must be evaluated at $t - c$.\n\n"
                "4. Forgetting the step function on inversion: $e^{-cs}G(s)$ inverts to "
                "$u(t-c)g(t-c)$, silent before $t = c$.\n\n"
                "5. Completing the square with sign errors ($s^2 + 4s + 13 \\ne (s+2)^2 - 9$)."
            )),
            (K, "Check yourself", (
                "You should be able to: apply both shifts in both directions, complete squares, "
                "and set up piecewise forcing with steps.\n\n"
                "Self-test: $\\mathcal L^{-1}\\{\\frac{e^{-3s}}{s^2}\\}$? "
                "($u(t-3)(t-3)$ — a ramp switching on at $t = 3$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------ U5: systems ------------------------------
    "ODE.U5.N1": {
        "summary": "Systems as x' = Ax: converting equations and reading solution structure.",
        "steps": [
            (L, "Matrix form", (
                "A system of first-order linear ODEs packs into\n"
                "$$\\mathbf x' = A \\mathbf x, \\qquad \\mathbf x(t) \\in \\mathbb R^n.$$\n\n"
                "Any HIGHER-order equation converts too: for $y'' + by' + cy = 0$ set "
                "$x_1 = y, x_2 = y'$:\n"
                "$$\\mathbf x' = \\begin{pmatrix} 0 & 1 \\\\ -c & -b \\end{pmatrix} \\mathbf x$$\n"
                "— the COMPANION matrix. So systems are the universal format: one matrix equation "
                "covers coupled tanks, circuits, populations, and every scalar ODE in disguise."
            )),
            (L, "Solution structure", (
                "Linearity gives superposition: solutions form an $n$-dimensional space, and the "
                "general solution is $\\mathbf x = C_1 \\mathbf x_1 + \\cdots + C_n \\mathbf x_n$ "
                "for $n$ independent solutions.\n\n"
                "The scalar equation $x' = ax$ has solution $e^{at}x(0)$; the system's answer is "
                "the same statement with matrices — $\\mathbf x = e^{At}\\mathbf x(0)$ — and the "
                "eigenvalue method (N2) is how $e^{At}$ gets computed in practice: eigenvectors "
                "decouple the system into $n$ independent scalar equations."
            )),
            (E, "Worked example", (
                "Convert $y'' + 3y' + 2y = 0$ to a system and check the structure.\n\n"
                "$x_1 = y, x_2 = y'$: $x_1' = x_2$, $x_2' = -2x_1 - 3x_2$:\n"
                "$$A = \\begin{pmatrix} 0 & 1 \\\\ -2 & -3 \\end{pmatrix}.$$\n\n"
                "Characteristic polynomial of $A$: $\\lambda^2 + 3\\lambda + 2$ — EXACTLY the "
                "scalar equation's characteristic polynomial. Eigenvalues $-1, -2$ = the roots. "
                "The two formalisms are one theory; the matrix version just also handles genuinely "
                "coupled systems."
            )),
            (P, "Pitfalls", (
                "1. Companion-matrix sign errors (bottom row is $-c, -b$ from the NORMALIZED "
                "equation).\n\n"
                "2. Converting but forgetting the initial conditions: $y(0), y'(0)$ become "
                "$x_1(0), x_2(0)$.\n\n"
                "3. Treating components as independent when $A$ isn't diagonal — coupling is the "
                "whole point.\n\n"
                "4. Writing $e^{At}$ as entrywise exponentials — matrix exponentials don't work "
                "that way.\n\n"
                "5. Nonhomogeneous systems ($\\mathbf x' = A\\mathbf x + \\mathbf g$) treated with "
                "homogeneous-only tools."
            )),
            (K, "Check yourself", (
                "You should be able to: convert scalar ↔ system forms, carry ICs across, and "
                "state the dimension of the solution space.\n\n"
                "Self-test: convert $y''' = y$ to a system. (3×3 companion: $x_1' = x_2$, "
                "$x_2' = x_3$, $x_3' = x_1$.)\n\nPractice the node."
            )),
        ],
    },
    "ODE.U5.N2": {
        "summary": "The eigenvalue method: solutions from eigenpairs of A.",
        "steps": [
            (L, "The ansatz", (
                "Try $\\mathbf x = e^{\\lambda t}\\mathbf v$ in $\\mathbf x' = A\\mathbf x$:\n"
                "$$\\lambda e^{\\lambda t} \\mathbf v = A e^{\\lambda t} \\mathbf v "
                "\\iff A\\mathbf v = \\lambda \\mathbf v$$\n"
                "— eigenpairs of $A$ ARE the exponential solutions. Each eigenpair "
                "$(\\lambda_i, \\mathbf v_i)$ contributes a MODE $e^{\\lambda_i t}\\mathbf v_i$: "
                "motion along the eigenvector direction, growing or decaying at rate $\\lambda_i$."
            )),
            (L, "Assembling the general solution", (
                "With $n$ independent eigenvectors:\n"
                "$$\\mathbf x(t) = C_1 e^{\\lambda_1 t}\\mathbf v_1 + \\cdots + C_n e^{\\lambda_n t}\\mathbf v_n.$$\n\n"
                "Initial conditions: $\\mathbf x(0) = \\sum C_i \\mathbf v_i$ — expand the initial "
                "vector in the eigenbasis (a linear system for the $C_i$).\n\n"
                "This is diagonalization (LA.U7.N4) doing dynamics: in eigen-coordinates the "
                "system decouples into scalar equations $u_i' = \\lambda_i u_i$. Defective "
                "matrices (missing eigenvectors) need generalized eigenvectors and $t e^{\\lambda t}$ "
                "terms — the repeated-root story returning at the matrix level."
            )),
            (E, "Worked example", (
                "Solve $\\mathbf x' = \\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}\\mathbf x$, "
                "$\\mathbf x(0) = (1, 4)$.\n\n"
                "Eigenpairs (computed in the LA track): $\\lambda = 5, \\mathbf v = (1,1)$; "
                "$\\lambda = 2, \\mathbf v = (1, -2)$.\n\n"
                "$\\mathbf x = C_1 e^{5t}(1,1) + C_2 e^{2t}(1,-2)$. ICs: $C_1 + C_2 = 1$, "
                "$C_1 - 2C_2 = 4$ → $C_1 = 2, C_2 = -1$.\n"
                "$$\\mathbf x(t) = 2e^{5t}\\begin{pmatrix}1\\\\1\\end{pmatrix} "
                "- e^{2t}\\begin{pmatrix}1\\\\-2\\end{pmatrix}.$$\n\n"
                "As $t$ grows, the $e^{5t}$ mode dominates: trajectories align with $(1,1)$."
            )),
            (P, "Pitfalls", (
                "1. Using eigenVALUES without their matched eigenVECTORS (the mode is the "
                "pair).\n\n"
                "2. IC fitting on components instead of the eigenbasis expansion.\n\n"
                "3. Forgetting a mode (an $n \\times n$ system needs $n$ terms).\n\n"
                "4. Defective matrices treated as diagonalizable — check GM = AM first.\n\n"
                "5. Writing $e^{\\lambda t}$ with the wrong sign of $\\lambda$ — decay/growth "
                "flips, and the phase portrait with it."
            )),
            (K, "Check yourself", (
                "You should be able to: derive the eigen-ansatz, assemble general solutions, fit "
                "ICs via eigenbasis expansion, and spot dominant modes.\n\n"
                "Self-test: if $A$ has eigenvalues $-1, -3$, what happens to every solution as "
                "$t \\to \\infty$? (Decays to $\\mathbf 0$ — along the $-1$ eigenvector "
                "asymptotically, since it decays slower.)\n\nPractice the node."
            )),
        ],
    },
    "ODE.U5.N3": {
        "summary": "Real distinct eigenvalues: nodes and saddles in the phase plane.",
        "steps": [
            (L, "The three sign patterns", (
                "For a 2×2 system with real distinct eigenvalues $\\lambda_1, \\lambda_2$:\n\n"
                "• BOTH NEGATIVE: stable NODE — everything flows in to the origin; trajectories "
                "tangent to the SLOW eigenvector (smaller $|\\lambda|$).\n"
                "• BOTH POSITIVE: unstable node — same picture, arrows reversed.\n"
                "• OPPOSITE SIGNS: SADDLE — in along the stable eigenvector, out along the "
                "unstable one; almost every trajectory eventually escapes along the unstable "
                "direction.\n\n"
                "The eigenvector lines are the only straight-line trajectories — the skeleton of "
                "the phase portrait."
            )),
            (L, "Sketching from eigen-data", (
                "Recipe: (1) draw both eigenvector lines with arrows per the sign of each "
                "$\\lambda$; (2) fill in curved trajectories respecting the skeleton — near the "
                "origin hugging the slow direction (node) or sweeping hyperbola-like between the "
                "lines (saddle); (3) far away, the FAST direction dominates.\n\n"
                "Saddles' stable line is a razor's edge: initial conditions exactly on it flow to "
                "the origin, everything else diverges — the mathematical picture of unstable "
                "equilibrium with one balancing direction."
            )),
            (E, "Worked example", (
                "Classify $\\mathbf x' = \\begin{pmatrix} 1 & 2 \\\\ 2 & 1 \\end{pmatrix}\\mathbf x$.\n\n"
                "Trace 2, det $= -3 < 0$ → eigenvalues of opposite sign: SADDLE. "
                "(Explicitly: $\\lambda = 3, -1$ with $\\mathbf v = (1,1), (1,-1)$.)\n\n"
                "Portrait: flow OUT along $(1,1)$ (the $\\lambda = 3$ line), IN along $(1,-1)$. "
                "A trajectory starting at $(1, 0) = \\frac12[(1,1) + (1,-1)]$ has both modes: it "
                "swings in along the stable direction briefly, then peels off along $(1,1)$ — "
                "$e^{3t}$ wins."
            )),
            (P, "Pitfalls", (
                "1. Tangency backwards: node trajectories hug the SLOW eigenvector near the "
                "origin (not the fast one).\n\n"
                "2. det < 0 always means saddle — no eigenvalue computation needed; missing this "
                "shortcut wastes time.\n\n"
                "3. Arrows inconsistent with signs (stable = toward origin = negative "
                "$\\lambda$).\n\n"
                "4. Drawing trajectories CROSSING eigenvector lines — uniqueness forbids "
                "crossings anywhere.\n\n"
                "5. Calling a saddle 'stable-ish' because one direction converges — saddles are "
                "unstable, full stop."
            )),
            (K, "Check yourself", (
                "You should be able to: classify from trace/det or eigenvalues, sketch the "
                "skeleton-then-curves portrait, and narrate a trajectory's fate.\n\n"
                "Self-test: eigenvalues $-2, -5$ — which line do trajectories approach the origin "
                "along? (The $\\lambda = -2$ eigenvector — the slow one.)\n\nPractice the node."
            )),
        ],
    },
    "ODE.U5.N4": {
        "summary": "Complex eigenvalues: spirals and centers in the phase plane.",
        "steps": [
            (L, "Rotation enters", (
                "Complex pair $\\lambda = \\alpha \\pm i\\beta$: solutions involve "
                "$e^{\\alpha t}(\\cos\\beta t, \\sin \\beta t)$ combinations — trajectories ROTATE "
                "with angular frequency $\\beta$ while the radius scales by $e^{\\alpha t}$:\n\n"
                "• $\\alpha < 0$: stable SPIRAL (spiral sink) — rotate inward.\n"
                "• $\\alpha > 0$: unstable spiral (source) — rotate outward.\n"
                "• $\\alpha = 0$: CENTER — closed orbits, ellipses forever; neutrally stable.\n\n"
                "No straight-line trajectories exist — no real eigenvectors, nothing stays on its "
                "own line."
            )),
            (L, "Direction of rotation, and fragility of centers", (
                "Rotation sense isn't in the eigenvalues — read it from the FIELD: evaluate "
                "$A\\mathbf x$ at one convenient point, e.g. $(1, 0)$; the sign of the second "
                "component says counterclockwise (positive) or clockwise.\n\n"
                "Centers are structurally fragile: the tiniest damping perturbs $\\alpha = 0$ into "
                "a spiral. That's the linearization caveat in ODE.U7 — a nonlinear system whose "
                "linearization is a center may actually spiral slowly. Undamped oscillators "
                "($y'' + \\omega^2 y = 0$ as a system) are THE center: energy conserved, orbits "
                "closed."
            )),
            (E, "Worked example", (
                "Classify $\\mathbf x' = \\begin{pmatrix} -1 & 2 \\\\ -2 & -1 \\end{pmatrix}\\mathbf x$.\n\n"
                "Trace $-2$, det $= 1 + 4 = 5$; discriminant $= 4 - 20 < 0$ → complex; "
                "$\\lambda = -1 \\pm 2i$.\n\n"
                "$\\alpha = -1 < 0$: STABLE SPIRAL at rotation rate 2. Direction: at $(1,0)$, "
                "$A\\mathbf x = (-1, -2)$ — moving down: CLOCKWISE.\n\n"
                "Every trajectory: a clockwise spiral into the origin, circling once per "
                "$\\pi$ time units while shrinking by $e^{-t}$."
            )),
            (P, "Pitfalls", (
                "1. Reading rotation direction from $\\beta$'s sign — the conjugate pair has both "
                "signs; check the field.\n\n"
                "2. Calling a center 'stable' in the asymptotic sense — orbits don't approach the "
                "origin; the right term is neutrally stable.\n\n"
                "3. Spiral vs node confusion when the discriminant is near zero — compute it, "
                "don't eyeball.\n\n"
                "4. Expecting eigenvector lines in the portrait — complex case has none.\n\n"
                "5. Frequency $\\beta$ misidentified after a $\\frac{1}{2a}$ slip in the quadratic "
                "formula."
            )),
            (K, "Check yourself", (
                "You should be able to: detect complex cases from the discriminant, classify by "
                "$\\alpha$, determine rotation from the field, and sketch spirals/centers.\n\n"
                "Self-test: trace 0, det 4 — classify. ($\\lambda = \\pm 2i$: center, orbits "
                "closed.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------ U6: series ------------------------------
    "ODE.U6.N1": {
        "summary": "Ordinary and singular points: where power series solutions are guaranteed.",
        "steps": [
            (L, "The classification", (
                "For $y'' + p(x) y' + q(x) y = 0$:\n\n"
                "• $x_0$ is an ORDINARY point if $p$ and $q$ are analytic (nice power series) "
                "there — series solutions exist, guaranteed.\n"
                "• Otherwise $x_0$ is SINGULAR. A singular point is REGULAR if "
                "$(x - x_0)p$ and $(x - x_0)^2 q$ are analytic (the singularity is mild); "
                "IRREGULAR otherwise.\n\n"
                "Standard form first: divide by the leading coefficient before reading $p, q$ — "
                "the zeros of that leading coefficient are the singular-point suspects."
            )),
            (L, "Why the classification matters", (
                "At an ORDINARY point: two independent power-series solutions with radius of "
                "convergence at least the distance to the nearest singular point (ODE.U6.N3) — "
                "the method of N2 applies as-is.\n\n"
                "At a REGULAR SINGULAR point: Frobenius series $x^r \\sum a_n x^n$ work (Bessel "
                "and Euler equations live here).\n\n"
                "At an IRREGULAR one: series methods break down.\n\n"
                "The big second-order equations of physics (Legendre, Bessel, Airy, Hermite) are "
                "all analyzed by exactly this triage — it decides which tool opens which "
                "equation."
            )),
            (E, "Worked example", (
                "Classify the singular points of $x^2(x - 2) y'' + x y' + (x - 2) y = 0$.\n\n"
                "Standard form: $p = \\frac{x}{x^2(x-2)} = \\frac{1}{x(x-2)}$, "
                "$q = \\frac{1}{x^2}$. Suspects: $x = 0, 2$.\n\n"
                "At $x = 0$: $xp = \\frac{1}{x - 2}$ analytic ✓, but "
                "$x^2 q = 1$ analytic ✓ — wait, both pass: REGULAR singular point.\n"
                "At $x = 2$: $(x-2)p = \\frac 1 x$ analytic at 2 ✓; $(x-2)^2 q = "
                "\\frac{(x-2)^2}{x^2}$ analytic ✓: REGULAR.\n\n"
                "Every other point (including complex ones) is ordinary."
            )),
            (P, "Pitfalls", (
                "1. Reading $p, q$ before normalizing to leading coefficient 1.\n\n"
                "2. Testing analyticity of $p, q$ themselves at a singular point (of course they "
                "fail — the test multiplies by the right powers FIRST).\n\n"
                "3. Using $(x - x_0)$ on $q$ and $(x-x_0)^2$ on $p$ — powers swapped.\n\n"
                "4. Missing complex singular points (they're invisible on the real line but "
                "control convergence radii).\n\n"
                "5. Assuming singular = unsolvable — regular singular points have a rich, "
                "solvable theory."
            )),
            (K, "Check yourself", (
                "You should be able to: normalize, locate singular points, and classify each as "
                "regular or irregular.\n\n"
                "Self-test: classify $x = 0$ for $x y'' + y' + xy = 0$ (Bessel order 0). "
                "($p = \\frac1x, q = 1$: $xp = 1$, $x^2 q = x^2$ — regular singular.)\n\n"
                "Practice the node."
            )),
        ],
    },
    "ODE.U6.N2": {
        "summary": "Power series solutions: substitute, shift indices, and read the recurrence.",
        "steps": [
            (L, "The method", (
                "At an ordinary point (say $x_0 = 0$), posit $y = \\sum_{n=0}^\\infty a_n x^n$. "
                "Then\n"
                "$$y' = \\sum n a_n x^{n-1}, \\qquad y'' = \\sum n(n-1) a_n x^{n-2}.$$\n\n"
                "Substitute into the ODE, SHIFT INDICES so every sum shows the same power $x^k$, "
                "combine, and set each total coefficient to zero — a RECURRENCE for the $a_n$.\n\n"
                "$a_0$ and $a_1$ stay free (they are $y(0)$ and $y'(0)$): the recurrence generates "
                "two independent solutions, one seeded by each."
            )),
            (L, "Index shifting, the core skill", (
                "To align $\\sum_{n=2} n(n-1)a_n x^{n-2}$ with $x^k$ terms: let $k = n - 2$:\n"
                "$$\\sum_{k=0}^\\infty (k+2)(k+1) a_{k+2}\\, x^k.$$\n\n"
                "Every $n$ inside becomes $k + 2$, and the starting index drops accordingly. "
                "Mis-shifts are THE error source of this topic — always check the first term of "
                "the rewritten sum against the first term of the original.\n\n"
                "The recurrence typically links $a_{k+2}$ to $a_k$ (even and odd chains "
                "separately) — matching the two-solution structure."
            )),
            (E, "Worked example", (
                "Solve $y'' - xy = 0$ (Airy's equation) near 0.\n\n"
                "Substitute and shift: $\\sum_{k} (k+2)(k+1)a_{k+2} x^k - \\sum_k a_{k-1} x^k = 0$ "
                "(second sum from $k = 1$).\n\n"
                "$k = 0$: $2a_2 = 0$. $k \\ge 1$: "
                "$$a_{k+2} = \\frac{a_{k-1}}{(k+2)(k+1)}.$$\n\n"
                "Chains of step 3: $a_0 \\to a_3 = \\frac{a_0}{6} \\to a_6 = \\frac{a_0}{180}$...; "
                "$a_1 \\to a_4 = \\frac{a_1}{12}$...; $a_2 = 0$ kills its chain.\n"
                "$$y = a_0\\left(1 + \\frac{x^3}{6} + \\cdots\\right) + a_1\\left(x + \\frac{x^4}{12} + \\cdots\\right).$$"
            )),
            (P, "Pitfalls", (
                "1. Index-shift off-by-one (verify by writing out the first concrete term).\n\n"
                "2. Forgetting that multiplying by $x$ RAISES powers (the $-xy$ term shifts the "
                "other way).\n\n"
                "3. Merging sums with different starting indices without peeling off the extra "
                "terms ($k = 0$ often stands alone).\n\n"
                "4. Solving the recurrence for the wrong subscript.\n\n"
                "5. Treating $a_0, a_1$ as determined — they are the free constants; forcing them "
                "to values loses a solution."
            )),
            (K, "Check yourself", (
                "You should be able to: substitute series, shift indices cleanly, extract the "
                "recurrence, and generate both solution chains.\n\n"
                "Self-test: for $y'' + y = 0$, derive $a_{k+2} = \\frac{-a_k}{(k+2)(k+1)}$ and "
                "recognize the chains. (They build $\\cos x$ from $a_0$ and $\\sin x$ from "
                "$a_1$.)\n\nPractice the node."
            )),
        ],
    },
    "ODE.U6.N3": {
        "summary": "Radius of convergence: how far series solutions are trusted.",
        "steps": [
            (L, "The guarantee", (
                "THEOREM: at an ordinary point $x_0$, the series solutions converge at least on "
                "$|x - x_0| < R$, where $R$ = distance from $x_0$ to the NEAREST singular point "
                "of the equation — counting COMPLEX ones.\n\n"
                "So the equation's own geometry sets the trust region before any coefficients "
                "are computed. $(1 + x^2)y'' + \\ldots$: singularities at $x = \\pm i$, so "
                "series about 0 are guaranteed only for $|x| < 1$ — invisible on the real line, "
                "decisive anyway."
            )),
            (L, "Direct tests, and reading partial sums", (
                "Given a computed recurrence, the RATIO TEST on the coefficients confirms (and "
                "sometimes beats) the guaranteed radius: "
                "$R = \\lim |a_k / a_{k+1}|$ when it exists. Entire-function cases "
                "(Airy: $R = \\infty$ — no singular points anywhere) converge everywhere, though "
                "PARTIAL SUMS still degrade far from the center: convergence radius is about "
                "eventual convergence, not about how many terms you need.\n\n"
                "Practical rule: use series solutions comfortably well inside the radius; near "
                "the edge, accuracy dies and more terms barely help."
            )),
            (E, "Worked example", (
                "For $(x^2 - 4) y'' + y = 0$, series about $x_0 = 1$: how far is convergence "
                "guaranteed?\n\n"
                "Singular points: $x = \\pm 2$. Distances from 1: $|1 - 2| = 1$ and "
                "$|1 - (-2)| = 3$. Nearest: 1.\n"
                "$$R \\ge 1: \\text{ guaranteed on } 0 < x < 2.$$\n\n"
                "Series about $x_0 = 0$ instead: nearest singularity at distance 2 — a better "
                "center for wider coverage. Choosing the expansion point IS a design decision."
            )),
            (P, "Pitfalls", (
                "1. Ignoring complex singularities ($1 + x^2$ has no real zeros but caps $R$ at "
                "1).\n\n"
                "2. Reading 'at least $R$' as 'exactly $R$' — the actual radius can be "
                "larger.\n\n"
                "3. Measuring distance from 0 out of habit when the expansion is about "
                "$x_0 \\ne 0$.\n\n"
                "4. Ratio test on the $x^k$ TERMS confused with on the coefficients — keep the "
                "$|x|$ factor explicit.\n\n"
                "5. Trusting 5-term partial sums near the radius' edge."
            )),
            (K, "Check yourself", (
                "You should be able to: find guaranteed radii from singularity geometry "
                "(complex included), confirm by ratio test, and pick good expansion centers.\n\n"
                "Self-test: series about 0 for $(1 + x^2)y'' + y = 0$ — guaranteed radius? "
                "(1 — the singularities sit at $\\pm i$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------ U7: qualitative ------------------------------
    "ODE.U7.N1": {
        "summary": "Equilibria and the phase plane: nullclines, fixed points, and trajectory geometry.",
        "steps": [
            (L, "Equilibria", (
                "For an autonomous system $\\mathbf x' = \\mathbf f(\\mathbf x)$, EQUILIBRIA are "
                "the points where $\\mathbf f = \\mathbf 0$ — constant solutions, where all "
                "motion stops. Find them by solving the simultaneous equations "
                "$f_1 = 0, f_2 = 0$.\n\n"
                "The NULLCLINES help: the curve $f_1 = 0$ (vertical motion only) and $f_2 = 0$ "
                "(horizontal motion only); equilibria are their INTERSECTIONS, and the "
                "nullclines partition the plane into regions of consistent flow direction "
                "(up-left, down-right, ...)."
            )),
            (L, "The phase plane discipline", (
                "Trajectories are curves $(x_1(t), x_2(t))$ — time is implicit, direction shown "
                "by arrows. Key facts, all downstream of uniqueness (ODE.U1.N4):\n\n"
                "• Trajectories never cross (nor touch) each other or themselves — except at "
                "equilibria, which they only approach asymptotically.\n"
                "• Through every point passes exactly one trajectory.\n"
                "• Autonomy means the picture is time-invariant: one portrait describes all "
                "histories.\n\n"
                "Sketch protocol: equilibria → nullclines with region arrows → representative "
                "trajectories respecting both."
            )),
            (E, "Worked example", (
                "Predator-prey-like system: $x' = x(3 - y)$, $y' = y(x - 2)$.\n\n"
                "Equilibria: $x(3-y) = 0$ and $y(x - 2) = 0$ → $(0,0)$ and $(2, 3)$.\n\n"
                "Nullclines: $x' = 0$ on $x = 0$ and $y = 3$; $y' = 0$ on $y = 0$ and $x = 2$. "
                "In the region $x > 2, y < 3$: $x' > 0, y' > 0$ — flow up-right; cross "
                "$y = 3$ and $x'$ flips negative: the flow starts circulating around $(2,3)$.\n\n"
                "Four regions, four arrow pairs — the portrait's rotation is visible before any "
                "eigenvalue is computed (N2 will classify the center/spiral question)."
            )),
            (P, "Pitfalls", (
                "1. Missing equilibria by dividing out factors ($x = 0$ IS a solution branch of "
                "$x(3-y) = 0$).\n\n"
                "2. Nullcline arrows drawn as full flow (on $x' = 0$, motion is purely "
                "VERTICAL).\n\n"
                "3. Trajectories crossing in a sketch — uniqueness forbids it.\n\n"
                "4. Treating the phase plane as a graph of $x(t)$ — both axes are STATE, not "
                "time.\n\n"
                "5. Reading 'trajectory reaches the equilibrium' — approach is asymptotic "
                "(infinite time) unless it started there."
            )),
            (K, "Check yourself", (
                "You should be able to: solve for all equilibria, draw nullclines with region "
                "arrows, and sketch a consistent portrait.\n\n"
                "Self-test: equilibria of $x' = y$, $y' = -\\sin x$? "
                "($(k\\pi, 0)$ — the pendulum's bottom and top positions, alternating.)\n\n"
                "Practice the node."
            )),
        ],
    },
    "ODE.U7.N2": {
        "summary": "Linear stability: classify equilibria by the Jacobian's eigenvalues.",
        "steps": [
            (L, "Linearization", (
                "Near an equilibrium $\\mathbf x^*$, write $\\mathbf x = \\mathbf x^* + "
                "\\mathbf u$ and keep first order:\n"
                "$$\\mathbf u' \\approx J\\, \\mathbf u, \\qquad J = "
                "\\begin{pmatrix} \\partial f_1/\\partial x & \\partial f_1 / \\partial y \\\\ "
                "\\partial f_2/\\partial x & \\partial f_2/\\partial y \\end{pmatrix}_{\\mathbf x^*}$$\n"
                "— the JACOBIAN, evaluated at the equilibrium. The nonlinear system inherits the "
                "linear system's local behavior."
            )),
            (L, "The verdict, and its fine print", (
                "• All eigenvalues with NEGATIVE real part → asymptotically STABLE (sink).\n"
                "• Any eigenvalue with POSITIVE real part → UNSTABLE.\n"
                "• The theorem (Hartman-Grobman) guarantees the nonlinear portrait matches the "
                "linear one for HYPERBOLIC equilibria (no zero-real-part eigenvalues).\n\n"
                "The borderline cases are exactly where linearization can lie: a linear CENTER "
                "($\\pm i\\beta$) may nonlinearly be a slow spiral either way; a zero eigenvalue "
                "means higher-order terms decide. Those cases need energy functions or other "
                "nonlinear tools — flag them, don't bluff them."
            )),
            (E, "Worked example", (
                "Continue $x' = x(3-y)$, $y' = y(x-2)$ at both equilibria.\n\n"
                "$$J = \\begin{pmatrix} 3 - y & -x \\\\ y & x - 2 \\end{pmatrix}.$$\n\n"
                "At $(0,0)$: $J = \\operatorname{diag}(3, -2)$ — eigenvalues $3, -2$: SADDLE "
                "(unstable).\n"
                "At $(2,3)$: $J = \\begin{pmatrix} 0 & -2 \\\\ 3 & 0 \\end{pmatrix}$ — "
                "$\\lambda^2 + 6 = 0$: $\\pm i\\sqrt 6$ — linear CENTER: borderline! "
                "Linearization alone cannot certify closed orbits here (for the true "
                "predator-prey system a conserved quantity settles it)."
            )),
            (P, "Pitfalls", (
                "1. Evaluating $J$ symbolically but forgetting to PLUG IN the equilibrium.\n\n"
                "2. Classifying borderline cases (centers, zero eigenvalues) from the linear "
                "verdict alone.\n\n"
                "3. Stability judged from eigenvalue SIGNS of the wrong matrix (each equilibrium "
                "has its own $J$).\n\n"
                "4. 'One negative eigenvalue = stable' — ALL must have negative real part.\n\n"
                "5. Linearizing a system that isn't at equilibrium (the expansion point must "
                "satisfy $\\mathbf f = 0$)."
            )),
            (K, "Check yourself", (
                "You should be able to: compute Jacobians, evaluate at each equilibrium, deliver "
                "hyperbolic verdicts, and flag borderline cases honestly.\n\n"
                "Self-test: $J$ at an equilibrium has trace $-3$, det $2$. Stable? "
                "(Eigenvalues $-1, -2$: yes, a stable node.)\n\nPractice the node."
            )),
        ],
    },
    "ODE.U7.N3": {
        "summary": "Classification by trace and determinant: node, saddle, spiral, center at a glance.",
        "steps": [
            (L, "The trace-determinant plane", (
                "For a 2×2 linear system with matrix $A$: eigenvalues satisfy "
                "$\\lambda^2 - \\tau \\lambda + \\Delta = 0$ with $\\tau = \\operatorname{tr} A$, "
                "$\\Delta = \\det A$. The portrait reads off $(\\tau, \\Delta)$:\n\n"
                "• $\\Delta < 0$: SADDLE (always — real, opposite signs).\n"
                "• $\\Delta > 0$, $\\tau^2 > 4\\Delta$: NODE (stable if $\\tau < 0$, unstable if "
                "$\\tau > 0$).\n"
                "• $\\Delta > 0$, $\\tau^2 < 4\\Delta$: SPIRAL (stable/unstable by the sign of "
                "$\\tau$).\n"
                "• $\\Delta > 0$, $\\tau = 0$: CENTER.\n"
                "• $\\tau^2 = 4\\Delta$: borderline degenerate/star nodes."
            )),
            (L, "Using the map", (
                "Two numbers, no eigenvalue computation, full classification — ideal for "
                "parameter studies: as a parameter moves $(\\tau, \\Delta)$ across a boundary, "
                "the portrait BIFURCATES.\n\n"
                "Crossing $\\tau = 0$ (with $\\Delta > 0$, complex): a stable spiral becomes "
                "unstable — a Hopf-type transition. Crossing $\\Delta = 0$: an eigenvalue passes "
                "through zero — equilibria collide or exchange stability. The parabola "
                "$\\tau^2 = 4\\Delta$: spirals become nodes (oscillation stops).\n\n"
                "Memorize the picture: saddles below the $\\Delta = 0$ axis, spirals inside the "
                "parabola, nodes between, stability by the sign of $\\tau$."
            )),
            (E, "Worked example", (
                "Classify $\\mathbf x' = \\begin{pmatrix} a & 1 \\\\ -1 & a \\end{pmatrix}"
                "\\mathbf x$ as $a$ varies.\n\n"
                "$\\tau = 2a$, $\\Delta = a^2 + 1 > 0$, "
                "$\\tau^2 - 4\\Delta = 4a^2 - 4a^2 - 4 = -4 < 0$: ALWAYS complex.\n\n"
                "• $a < 0$: stable spiral. • $a = 0$: center. • $a > 0$: unstable spiral.\n\n"
                "The system crosses the $\\tau = 0$ line at $a = 0$ — a textbook Hopf-style "
                "stability change, diagnosed with two formulas and no eigenvectors."
            )),
            (P, "Pitfalls", (
                "1. Checking $\\tau$ before $\\Delta$: $\\Delta < 0$ is a saddle REGARDLESS of "
                "trace.\n\n"
                "2. Node/spiral boundary is $\\tau^2 = 4\\Delta$, not $\\tau = \\Delta$.\n\n"
                "3. Stability from $\\Delta$'s sign — stability is $\\tau$'s job (given "
                "$\\Delta > 0$).\n\n"
                "4. Centers claimed off the $\\tau = 0$ line, or (for nonlinear Jacobians) "
                "trusted without the borderline caveat.\n\n"
                "5. Degenerate boundary cases ($\\tau^2 = 4\\Delta$) shoehorned into node or "
                "spiral — name them as borderline."
            )),
            (K, "Check yourself", (
                "You should be able to: classify any 2×2 from $(\\tau, \\Delta)$, sketch the "
                "trace-determinant map, and track bifurcations along parameter paths.\n\n"
                "Self-test: $\\tau = 4$, $\\Delta = 3$ — classify. "
                "($\\tau^2 - 4\\Delta = 4 > 0$, $\\Delta > 0$, $\\tau > 0$: unstable node.)\n\n"
                "Practice the node."
            )),
        ],
    },
}
