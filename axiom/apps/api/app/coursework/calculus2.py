"""Coursework: Calculus II nodes C201-C216 (integration techniques through Taylor).

Same five-step structure as calculus1: two readings, a worked example,
pitfalls, and a check step. Bodies use $...$ / $$...$$ TeX.
"""

L = "reading"
E = "example"
P = "pitfall"
K = "check"

LESSONS: dict[str, dict] = {
    # ------------------------------------------------------------------
    "C201": {
        "summary": "u-substitution: reversing the chain rule, with bound-changing for definite integrals.",
        "steps": [
            (L, "Reversing the chain rule", (
                "Every chain-rule derivative $\\frac{d}{dx} F(g(x)) = f(g(x)) g'(x)$ reads backwards as\n"
                "$$\\int f(g(x))\\, g'(x)\\, dx = F(g(x)) + C.$$\n\n"
                "The substitution ritual: set $u = g(x)$ (the INSIDE of a composition), compute $du = g'(x) dx$, "
                "and rewrite the integral entirely in $u$. If any $x$ survives the rewrite, the substitution is "
                "wrong or the integral needs another technique.\n\n"
                "What makes a good $u$: its derivative is sitting in the integrand, up to a constant."
            )),
            (L, "Definite integrals: change the bounds", (
                "For $\\int_a^b f(g(x)) g'(x) dx$, convert the LIMITS along with the variable: the new bounds are "
                "$u(a)$ and $u(b)$, and you never return to $x$:\n"
                "$$\\int_0^2 x e^{x^2} dx = \\frac{1}{2}\\int_0^4 e^u du = \\frac{e^4 - 1}{2}.$$\n\n"
                "The alternative — substituting back and using the original bounds — also works, but mixing the "
                "two (new variable, old bounds) is the classic disaster."
            )),
            (E, "Worked example", (
                "$\\displaystyle\\int \\frac{(\\ln x)^3}{x}\\, dx$.\n\n"
                "Take $u = \\ln x$, $du = \\frac{1}{x} dx$ — and the $\\frac{dx}{x}$ is right there:\n"
                "$$\\int u^3 du = \\frac{u^4}{4} + C = \\frac{(\\ln x)^4}{4} + C.$$\n\n"
                "Constant-adjustment case: $\\int \\cos(5x) dx$ with $u = 5x$, $du = 5\\,dx$, so "
                "$dx = \\frac{du}{5}$: answer $\\frac{1}{5}\\sin(5x) + C$. You may multiply by constants to "
                "balance $du$ — never by variables."
            )),
            (P, "Pitfalls", (
                "1. Leaving stray $x$'s in a $u$-integral, or 'moving $x$ outside the integral' to force it — "
                "variables never pass through an integral sign.\n\n"
                "2. Old bounds with new variable in definite integrals.\n\n"
                "3. Forgetting the balancing constant: $\\int e^{3x} dx = \\frac{1}{3} e^{3x} + C$, and the "
                "$\\frac{1}{3}$ is not optional.\n\n"
                "4. Choosing $u$ = the whole integrand instead of the inner function. The test is always: is "
                "$du$ present?"
            )),
            (K, "Check yourself", (
                "You should be able to: pick $u$ by locating an inner function whose derivative is present, "
                "balance constants, and convert bounds cleanly.\n\n"
                "Self-test: $\\displaystyle\\int_0^{\\pi/2} \\sin^2 x \\cos x \\, dx$. "
                "($u = \\sin x$: $\\int_0^1 u^2 du = \\frac{1}{3}$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C202": {
        "summary": "Integration by parts: reversing the product rule, and choosing u and dv well.",
        "steps": [
            (L, "The formula and where it comes from", (
                "Integrate the product rule $(uv)' = u'v + uv'$ and rearrange:\n"
                "$$\\int u\\, dv = uv - \\int v\\, du.$$\n\n"
                "You trade one integral for another — the move only helps when $\\int v\\, du$ is SIMPLER. "
                "That happens when differentiating $u$ makes it simpler (polynomials shrink; $\\ln x$ becomes "
                "$\\frac 1 x$) while $dv$ is something you can integrate."
            )),
            (L, "Choosing u: LIATE and the repeat tricks", (
                "Priority for $u$ — Log, Inverse trig, Algebraic, Trig, Exponential (LIATE). The earlier in the "
                "list, the more it wants to be $u$.\n\n"
                "Two structural patterns:\n"
                "• Repeated parts: $\\int x^2 e^x dx$ needs parts twice; the polynomial degree counts the "
                "rounds.\n"
                "• Boomerang: $\\int e^x \\cos x \\, dx$ returns to itself after two rounds — collect the original "
                "integral algebraically and solve for it.\n\n"
                "Sneaky classic: $\\int \\ln x \\, dx$ with $u = \\ln x$, $dv = dx$ gives $x\\ln x - x + C$."
            )),
            (E, "Worked example", (
                "$\\displaystyle\\int x e^{2x} dx$.\n\n"
                "LIATE: $u = x$ (algebraic beats exponential), $dv = e^{2x} dx$. Then $du = dx$, "
                "$v = \\frac{1}{2} e^{2x}$:\n"
                "$$\\int x e^{2x} dx = \\frac{x}{2} e^{2x} - \\int \\frac{1}{2} e^{2x} dx "
                "= \\frac{x}{2} e^{2x} - \\frac{1}{4} e^{2x} + C.$$\n\n"
                "Check by differentiating: product rule gives $\\frac{1}{2}e^{2x} + x e^{2x} - \\frac{1}{2}e^{2x} "
                "= x e^{2x}$. ✓"
            )),
            (P, "Pitfalls", (
                "1. Choosing $u = e^x$: exponentials never simplify under differentiation; the integral gets "
                "worse each round.\n\n"
                "2. Sign errors in $-\\int v\\, du$, especially through repeated applications — track the minus "
                "per round.\n\n"
                "3. In the boomerang pattern, forgetting that solving $I = (\\text{stuff}) - I$ gives "
                "$I = \\frac{\\text{stuff}}{2}$ — and then still needs $+C$.\n\n"
                "4. Definite-integral parts: the $uv$ term is evaluated at the bounds, "
                "$\\left[uv\\right]_a^b - \\int_a^b v\\,du$; dropping the evaluation is common."
            )),
            (K, "Check yourself", (
                "You should be able to: choose $u$ by LIATE, run repeated and boomerang patterns, and verify by "
                "differentiation.\n\n"
                "Self-test: $\\int x \\cos x \\, dx$. "
                "($x \\sin x + \\cos x + C$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C203": {
        "summary": "Trigonometric integrals: powers and products of sin, cos, sec, tan by parity and identities.",
        "steps": [
            (L, "sin-cos products: steal from the odd one", (
                "For $\\int \\sin^m x \\cos^n x \\, dx$:\n\n"
                "• If the $\\cos$ power is odd, peel one $\\cos x$ for $du$, convert the rest via "
                "$\\cos^2 = 1 - \\sin^2$, substitute $u = \\sin x$.\n"
                "• If the $\\sin$ power is odd, mirror the trick with $u = \\cos x$ (mind the minus in "
                "$du = -\\sin x\\, dx$).\n"
                "• Both even: reduce with the half-angle identities "
                "$\\sin^2 x = \\frac{1 - \\cos 2x}{2}$, $\\cos^2 x = \\frac{1 + \\cos 2x}{2}$ and integrate "
                "term by term."
            )),
            (L, "sec-tan products", (
                "The derivative pairs drive everything: $(\\tan x)' = \\sec^2 x$ and $(\\sec x)' = \\sec x \\tan x$, "
                "with the identity $\\sec^2 = 1 + \\tan^2$.\n\n"
                "• Even $\\sec$ power: peel $\\sec^2 x$, convert the rest to $\\tan$, use $u = \\tan x$.\n"
                "• Odd $\\tan$ power (with at least one $\\sec$): peel $\\sec x \\tan x$, convert to $\\sec$, "
                "use $u = \\sec x$.\n\n"
                "Worth memorizing outright: $\\int \\tan x \\, dx = \\ln|\\sec x| + C$ and "
                "$\\int \\sec x \\, dx = \\ln|\\sec x + \\tan x| + C$."
            )),
            (E, "Worked example", (
                "$\\displaystyle\\int \\sin^3 x \\cos^2 x \\, dx$ — odd $\\sin$ power.\n\n"
                "Peel one sine: $\\sin^3 = \\sin^2 \\cdot \\sin = (1 - \\cos^2 x)\\sin x$. With $u = \\cos x$, "
                "$du = -\\sin x\\, dx$:\n"
                "$$\\int (1 - u^2) u^2 (-du) = \\int (u^4 - u^2) du = \\frac{u^5}{5} - \\frac{u^3}{3} + C "
                "= \\frac{\\cos^5 x}{5} - \\frac{\\cos^3 x}{3} + C.$$"
            )),
            (P, "Pitfalls", (
                "1. Losing the minus sign in $du = -\\sin x\\,dx$ — the single most common slip in this topic.\n\n"
                "2. Writing $\\sin^2 x = 1 - \\cos^2 x$ where the HALF-ANGLE identity was needed (even-even case): "
                "the Pythagorean identity trades between sin and cos but does not lower the power.\n\n"
                "3. Even-odd rules misapplied to sec-tan: the parity that matters is EVEN for sec, ODD for tan.\n\n"
                "4. Expanding $(1 - u^2)^2$ carelessly — these integrals die by algebra more than by calculus."
            )),
            (K, "Check yourself", (
                "You should be able to: route any $\\sin^m\\cos^n$ integral by parity, run both sec-tan "
                "strategies, and recall the $\\tan$ and $\\sec$ integrals.\n\n"
                "Self-test: $\\int \\sin^2 x \\, dx$. "
                "(Half-angle: $\\frac{x}{2} - \\frac{\\sin 2x}{4} + C$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C204": {
        "summary": "Trigonometric substitution: radicals of quadratics via sin, tan, and sec substitutions.",
        "steps": [
            (L, "The three patterns", (
                "Radicals of quadratics match right-triangle identities:\n\n"
                "• $\\sqrt{a^2 - x^2}$: substitute $x = a\\sin\\theta$, radical becomes $a\\cos\\theta$.\n"
                "• $\\sqrt{a^2 + x^2}$: substitute $x = a\\tan\\theta$, radical becomes $a\\sec\\theta$.\n"
                "• $\\sqrt{x^2 - a^2}$: substitute $x = a\\sec\\theta$, radical becomes $a\\tan\\theta$.\n\n"
                "Each substitution also converts $dx$ ($a\\cos\\theta\\,d\\theta$, $a\\sec^2\\theta\\,d\\theta$, "
                "$a\\sec\\theta\\tan\\theta\\,d\\theta$ respectively), turning the integral into a C203 problem."
            )),
            (L, "Coming back: the reference triangle", (
                "After integrating in $\\theta$, convert back with a labeled right triangle. For "
                "$x = a\\tan\\theta$: opposite $= x$, adjacent $= a$, hypotenuse $= \\sqrt{a^2 + x^2}$; read any "
                "trig function of $\\theta$ off the sides.\n\n"
                "If the quadratic is not centered — $\\sqrt{x^2 + 4x + 13}$ — COMPLETE THE SQUARE first: "
                "$\\sqrt{(x+2)^2 + 9}$, then shift $w = x + 2$ and apply the tan pattern with $a = 3$."
            )),
            (E, "Worked example", (
                "$\\displaystyle\\int \\frac{dx}{x^2\\sqrt{4 - x^2}}$, with $x = 2\\sin\\theta$, "
                "$dx = 2\\cos\\theta\\, d\\theta$, $\\sqrt{4 - x^2} = 2\\cos\\theta$:\n"
                "$$\\int \\frac{2\\cos\\theta \\, d\\theta}{4\\sin^2\\theta \\cdot 2\\cos\\theta} "
                "= \\frac{1}{4}\\int \\csc^2\\theta \\, d\\theta = -\\frac{1}{4}\\cot\\theta + C.$$\n\n"
                "Triangle: opposite $x$, hypotenuse $2$, adjacent $\\sqrt{4 - x^2}$, so "
                "$\\cot\\theta = \\frac{\\sqrt{4-x^2}}{x}$:\n"
                "$$-\\frac{\\sqrt{4 - x^2}}{4x} + C.$$"
            )),
            (P, "Pitfalls", (
                "1. Forgetting to convert $dx$ — the substitution is a change of variable, not a relabeling.\n\n"
                "2. Answering in $\\theta$: full credit needs the reference-triangle conversion back to $x$.\n\n"
                "3. Wrong pattern pairing (sin for $a^2 + x^2$, etc.) — match the SIGN pattern, not the vibe.\n\n"
                "4. Skipping completing-the-square on shifted quadratics, or botching the shift's effect on "
                "$dx$ (it's benign: $dw = dx$).\n\n"
                "5. Dropping absolute values with $\\sec$ substitutions — sign care matters when $x < 0$."
            )),
            (K, "Check yourself", (
                "You should be able to: match radicals to substitutions, convert the whole integrand and $dx$, "
                "integrate in $\\theta$, and convert back by triangle.\n\n"
                "Self-test: which substitution for $\\int \\frac{dx}{(x^2 + 9)^{3/2}}$? "
                "($x = 3\\tan\\theta$; the integral becomes $\\frac{1}{9}\\int\\cos\\theta\\,d\\theta "
                "= \\frac{x}{9\\sqrt{x^2+9}} + C$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C205": {
        "summary": "Partial fractions: decomposing rational functions to integrate them.",
        "steps": [
            (L, "The decomposition", (
                "A proper rational function (top degree $<$ bottom degree) splits over the denominator's "
                "factors:\n\n"
                "• Distinct linear factor $(x - a)$: contributes $\\frac{A}{x - a}$.\n"
                "• Repeated linear $(x - a)^k$: contributes $\\frac{A_1}{x-a} + \\cdots + \\frac{A_k}{(x-a)^k}$.\n"
                "• Irreducible quadratic $(x^2 + bx + c)$: contributes $\\frac{Bx + C}{x^2 + bx + c}$.\n\n"
                "IMPROPER fractions must be divided first — polynomial long division peels off a polynomial part, "
                "leaving a proper remainder to decompose."
            )),
            (L, "Finding the constants, then integrating", (
                "Clear denominators and either match coefficients or use the cover-up shortcut: substituting "
                "$x = a$ into the cleared equation isolates the constant over $(x - a)$ instantly.\n\n"
                "Then each piece integrates from the basic table:\n"
                "$$\\int \\frac{A}{x-a} dx = A\\ln|x - a|, \\quad \\int \\frac{A}{(x-a)^2} dx = -\\frac{A}{x-a},$$\n"
                "$$\\int \\frac{dx}{x^2 + a^2} = \\frac{1}{a}\\arctan\\frac{x}{a} + C.$$"
            )),
            (E, "Worked example", (
                "$\\displaystyle\\int \\frac{5x - 4}{(x - 2)(x + 1)}\\, dx$.\n\n"
                "Set $\\frac{5x-4}{(x-2)(x+1)} = \\frac{A}{x-2} + \\frac{B}{x+1}$; clearing: "
                "$5x - 4 = A(x+1) + B(x-2)$.\n\n"
                "Cover-up: $x = 2 \\Rightarrow 6 = 3A \\Rightarrow A = 2$; "
                "$x = -1 \\Rightarrow -9 = -3B \\Rightarrow B = 3$.\n\n"
                "$$\\int \\left(\\frac{2}{x-2} + \\frac{3}{x+1}\\right) dx = 2\\ln|x-2| + 3\\ln|x+1| + C.$$"
            )),
            (P, "Pitfalls", (
                "1. Decomposing an improper fraction without dividing first — the setup has no solution and the "
                "algebra thrashes.\n\n"
                "2. Repeated factors get a term for EVERY power up to $k$, not just the top one.\n\n"
                "3. Quadratic factors need $Bx + C$ on top, not a bare constant.\n\n"
                "4. Factoring errors upstream: $x^2 + 4$ is irreducible; $x^2 - 4$ is not. Everything depends on "
                "a correct factorization.\n\n"
                "5. Losing absolute values in the logs."
            )),
            (K, "Check yourself", (
                "You should be able to: divide when improper, set up all three factor types, find constants by "
                "cover-up or matching, and integrate each piece.\n\n"
                "Self-test: setup only for $\\dfrac{x^2 + 1}{x(x-1)^2}$: "
                "$\\frac{A}{x} + \\frac{B}{x-1} + \\frac{C}{(x-1)^2}$.\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C206": {
        "summary": "Improper integrals: infinite limits and unbounded integrands, evaluated as limits.",
        "steps": [
            (L, "Type 1: infinite intervals", (
                "$$\\int_a^{\\infty} f(x)\\, dx = \\lim_{t \\to \\infty} \\int_a^t f(x)\\, dx.$$\n"
                "If the limit is finite, the integral CONVERGES; otherwise it diverges.\n\n"
                "The benchmark family — memorize it:\n"
                "$$\\int_1^\\infty \\frac{dx}{x^p} \\text{ converges} \\iff p > 1.$$\n"
                "So $\\frac{1}{x^2}$ converges (to 1) while $\\frac{1}{x}$ diverges — even though both integrands "
                "go to 0. Going to zero is necessary-ish, never sufficient."
            )),
            (L, "Type 2: unbounded integrands", (
                "When $f$ blows up at an endpoint (or inside the interval), approach the singularity with a "
                "limit:\n"
                "$$\\int_0^1 \\frac{dx}{\\sqrt{x}} = \\lim_{t \\to 0^+} \\int_t^1 x^{-1/2} dx "
                "= \\lim_{t \\to 0^+} (2 - 2\\sqrt{t}) = 2.$$\n\n"
                "At $x = 0$ the benchmark flips: $\\int_0^1 \\frac{dx}{x^p}$ converges iff $p < 1$.\n\n"
                "An interior singularity SPLITS the integral in two; both halves must converge."
            )),
            (E, "Worked example", (
                "$\\displaystyle\\int_0^\\infty x e^{-x^2} dx$.\n\n"
                "$$\\lim_{t\\to\\infty} \\int_0^t x e^{-x^2} dx "
                "= \\lim_{t\\to\\infty} \\left[-\\tfrac{1}{2} e^{-x^2}\\right]_0^t "
                "= \\lim_{t\\to\\infty} \\left(\\tfrac{1}{2} - \\tfrac{1}{2}e^{-t^2}\\right) = \\tfrac{1}{2}.$$\n\n"
                "Converges to $\\frac{1}{2}$. The exponential decay crushes the linear growth — a preview of the "
                "comparison instincts C212 formalizes."
            )),
            (P, "Pitfalls", (
                "1. Evaluating straight through a singularity as if FTC applied: "
                "$\\int_{-1}^1 \\frac{dx}{x^2} = -2$ is the canonical WRONG answer (positive integrand!); the "
                "integral diverges.\n\n"
                "2. Writing $\\infty$ into an antiderivative instead of taking a limit — notation that hides "
                "divergence.\n\n"
                "3. Mixing up the $p$-benchmarks at $\\infty$ ($p > 1$) and at $0$ ($p < 1$).\n\n"
                "4. For two-sided $\\int_{-\\infty}^{\\infty}$: both halves must converge INDEPENDENTLY — a "
                "symmetric cancellation argument is not allowed."
            )),
            (K, "Check yourself", (
                "You should be able to: rewrite improper integrals as limits, apply both $p$-benchmarks, split at "
                "singularities, and declare convergence honestly.\n\n"
                "Self-test: does $\\int_1^\\infty \\frac{dx}{x \\ln x}$ converge? "
                "($u = \\ln x$ gives $\\int \\frac{du}{u}$ — diverges, barely.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C207": {
        "summary": "Area between curves: top minus bottom, intersection-driven bounds, and when to slice horizontally.",
        "steps": [
            (L, "Top minus bottom", (
                "The area between $y = f(x)$ (top) and $y = g(x)$ (bottom) over $[a, b]$ is\n"
                "$$A = \\int_a^b \\left(f(x) - g(x)\\right) dx.$$\n\n"
                "This is always positive when the roles are assigned correctly — no signed-area worries, because "
                "the height of each slice is a genuine distance, top minus bottom, even when both curves dip "
                "below the axis.\n\n"
                "When the bounds aren't given, they are the INTERSECTIONS: solve $f(x) = g(x)$."
            )),
            (L, "Crossing curves and horizontal slicing", (
                "If the curves cross inside the region, the top and bottom swap: split at each crossing and "
                "integrate $|f - g|$ piecewise.\n\n"
                "Sideways regions (bounded left-right rather than top-bottom, e.g. $x = y^2$ against a line) "
                "slice better horizontally:\n"
                "$$A = \\int_c^d \\left(x_{\\text{right}}(y) - x_{\\text{left}}(y)\\right) dy.$$\n"
                "Choosing the slicing direction that keeps ONE formula per side is usually the difference between "
                "one integral and three."
            )),
            (E, "Worked example", (
                "Area between $y = x^2$ and $y = 2x - x^2$... intersections: "
                "$x^2 = 2x - x^2 \\Rightarrow 2x^2 - 2x = 0 \\Rightarrow x = 0, 1$.\n\n"
                "On $(0,1)$, test $x = \\frac{1}{2}$: parabola $\\frac 1 4$ vs $\\frac 3 4$ — the second curve is "
                "on top.\n"
                "$$A = \\int_0^1 \\left(2x - x^2 - x^2\\right) dx = \\left[x^2 - \\frac{2x^3}{3}\\right]_0^1 "
                "= \\frac{1}{3}.$$"
            )),
            (P, "Pitfalls", (
                "1. Guessing which curve is on top instead of testing a point — and not re-testing after each "
                "crossing.\n\n"
                "2. Integrating $f - g$ across a crossing: the signed pieces cancel and the 'area' comes out too "
                "small (or zero).\n\n"
                "3. Using $y$-slices with $x$-bounds or vice versa — bounds must live on the slicing axis.\n\n"
                "4. Forcing vertical slices on a sideways region and drowning in split points and square roots."
            )),
            (K, "Check yourself", (
                "You should be able to: find intersection bounds, assign top/bottom by testing, split at "
                "crossings, and slice horizontally when the region demands it.\n\n"
                "Self-test: set up (don't evaluate) the area between $x = y^2$ and $x = y + 2$. "
                "(Intersections $y = -1, 2$; $A = \\int_{-1}^2 (y + 2 - y^2)\\,dy = \\frac 9 2$.)\n\n"
                "Practice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C208": {
        "summary": "Volumes of revolution: disks, washers, and shells — and how to choose.",
        "steps": [
            (L, "Disks and washers", (
                "Rotating a region about an axis sweeps solid slices:\n\n"
                "• Disk (region touches the axis): cross-sections are circles,\n"
                "$$V = \\pi \\int_a^b R(x)^2\\, dx.$$\n"
                "• Washer (a gap between region and axis): circles with holes,\n"
                "$$V = \\pi \\int_a^b \\left(R_{\\text{out}}^2 - R_{\\text{in}}^2\\right) dx.$$\n\n"
                "Radii are measured FROM THE AXIS of rotation — about $y = -1$, a curve $y = f(x)$ has outer "
                "radius $f(x) + 1$."
            )),
            (L, "Shells, and choosing a method", (
                "Cylindrical shells slice PARALLEL to the axis: each strip sweeps a thin cylinder,\n"
                "$$V = 2\\pi \\int_a^b (\\text{radius})(\\text{height})\\, dx.$$\n\n"
                "Choose by which direction keeps functions single-valued and avoids solving for $x$:\n"
                "rotating about the $y$-axis a region described by $y = f(x)$ — shells in $x$ beat washers in "
                "$y$ whenever inverting $f$ is painful.\n\n"
                "Rule of thumb: slices PERPENDICULAR to the axis → disks/washers; PARALLEL → shells."
            )),
            (E, "Worked example", (
                "Region under $y = x^2$, $0 \\le x \\le 2$, about the $y$-axis — both ways.\n\n"
                "Shells: radius $x$, height $x^2$:\n"
                "$$V = 2\\pi \\int_0^2 x \\cdot x^2 dx = 2\\pi \\cdot 4 = 8\\pi.$$\n\n"
                "Washers in $y$: outer radius $2$, inner radius $\\sqrt{y}$:\n"
                "$$V = \\pi \\int_0^4 \\left(4 - y\\right) dy = \\pi(16 - 8) = 8\\pi. ✓$$\n\n"
                "Same answer; shells needed no inversion and no splitting."
            )),
            (P, "Pitfalls", (
                "1. Squaring a difference of radii: $\\pi\\int (R - r)^2$ is WRONG; washers are "
                "$R^2 - r^2$.\n\n"
                "2. Measuring radii from the origin instead of the rotation axis when the axis is shifted.\n\n"
                "3. Shell radius/height confusion: radius is the distance to the axis; height is the extent of "
                "the region at that radius.\n\n"
                "4. Mixing variables: disks perpendicular to the $x$-axis integrate in $x$; about the $y$-axis, "
                "washers integrate in $y$ and shells in $x$ — the method fixes the variable."
            )),
            (K, "Check yourself", (
                "You should be able to: set up disks, washers, and shells about either axis (shifted included), "
                "and pick the method that minimizes algebra.\n\n"
                "Self-test: region between $y = x$ and $y = x^2$ about the $x$-axis — setup: "
                "$V = \\pi\\int_0^1 (x^2 - x^4)\\,dx = \\frac{2\\pi}{15}$.\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C209": {
        "summary": "Arc length and surface area: the sqrt(1 + (y')^2) integrals.",
        "steps": [
            (L, "Arc length", (
                "A tiny piece of curve is nearly straight: $ds = \\sqrt{dx^2 + dy^2} = \\sqrt{1 + (y')^2}\\, dx$. "
                "Summing,\n"
                "$$L = \\int_a^b \\sqrt{1 + \\left(f'(x)\\right)^2}\\, dx.$$\n\n"
                "Honest warning: most integrands here have no elementary antiderivative. Course problems are "
                "engineered so $1 + (f')^2$ becomes a PERFECT SQUARE — if it doesn't, either recheck the algebra "
                "or the problem intends a numerical answer."
            )),
            (L, "Surface of revolution", (
                "Rotating the curve about the $x$-axis, each arc element $ds$ sweeps a ribbon of circumference "
                "$2\\pi y$:\n"
                "$$S = \\int_a^b 2\\pi\\, f(x) \\sqrt{1 + (f'(x))^2}\\, dx.$$\n\n"
                "About the $y$-axis, the ribbon radius is $x$ instead: $S = \\int 2\\pi x \\, ds$. "
                "Same $ds$; the only question is the distance from the axis."
            )),
            (E, "Worked example: a perfect square", (
                "Arc length of $y = \\dfrac{x^3}{6} + \\dfrac{1}{2x}$ on $[1, 2]$.\n\n"
                "$y' = \\frac{x^2}{2} - \\frac{1}{2x^2}$, so\n"
                "$1 + (y')^2 = 1 + \\frac{x^4}{4} - \\frac{1}{2} + \\frac{1}{4x^4} "
                "= \\left(\\frac{x^2}{2} + \\frac{1}{2x^2}\\right)^2.$\n\n"
                "$$L = \\int_1^2 \\left(\\frac{x^2}{2} + \\frac{1}{2x^2}\\right) dx "
                "= \\left[\\frac{x^3}{6} - \\frac{1}{2x}\\right]_1^2 = \\frac{17}{12}.$$\n\n"
                "The middle cross-term flipping from $-\\frac 1 2$ to $+\\frac 1 2$ is the designed magic."
            )),
            (P, "Pitfalls", (
                "1. Forgetting to square the derivative, or squaring the FUNCTION instead of its derivative.\n\n"
                "2. Botching the perfect-square recognition: compute $(y')^2$ carefully; the cross term is where "
                "the sign flips.\n\n"
                "3. Surface area with the wrong radius (using $f(x)$ about the $y$-axis).\n\n"
                "4. Dropping the $2\\pi$ or the $ds$ factor in surface integrals — the formula is circumference "
                "TIMES arc element."
            )),
            (K, "Check yourself", (
                "You should be able to: assemble $ds$, spot engineered perfect squares, and set up surface "
                "integrals about either axis.\n\n"
                "Self-test: set up the surface area of $y = \\sqrt{x}$, $0 \\le x \\le 4$, about the $x$-axis. "
                "($S = 2\\pi\\int_0^4 \\sqrt{x}\\sqrt{1 + \\frac{1}{4x}}\\,dx = 2\\pi \\int_0^4 \\sqrt{x + \\tfrac 1 4}\\,dx$ — "
                "which does evaluate.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C210": {
        "summary": "Sequences: limits, monotone and bounded behavior, and convergence.",
        "steps": [
            (L, "Sequence limits", (
                "A sequence $\\{a_n\\}$ converges to $L$ when the terms eventually stay arbitrarily close to $L$. "
                "Practically: treat $n$ as a continuous variable and use every limit tool from C104 — dominant "
                "terms, L'Hôpital (via the matching function), and the squeeze theorem.\n\n"
                "Benchmarks worth owning: $\\frac{1}{n^p} \\to 0$ ($p>0$); $r^n \\to 0$ for $|r| < 1$; "
                "$n^{1/n} \\to 1$; $\\left(1 + \\frac{x}{n}\\right)^n \\to e^x$; and factorials beat "
                "exponentials: $\\frac{c^n}{n!} \\to 0$ for every $c$."
            )),
            (L, "Monotone + bounded = convergent", (
                "The monotone convergence theorem: an increasing sequence bounded above converges (to its least "
                "upper bound); decreasing and bounded below likewise.\n\n"
                "This is THE tool for recursive sequences like $a_{n+1} = \\sqrt{2 + a_n}$: prove bounded (say "
                "$a_n < 2$ by induction) and increasing, conclude convergence, THEN find the limit by solving the "
                "fixed-point equation $L = \\sqrt{2 + L}$, giving $L = 2$.\n\n"
                "The order matters: solving the fixed-point equation first assumes exactly what needs proving."
            )),
            (E, "Worked example", (
                "Does $a_n = \\dfrac{3n^2 - n}{2n^2 + 5}$ converge?\n\n"
                "Divide by $n^2$: $a_n = \\dfrac{3 - 1/n}{2 + 5/n^2} \\to \\dfrac{3}{2}$.\n\n"
                "And $b_n = \\dfrac{(-1)^n n}{n + 1}$? The magnitudes tend to 1 but signs alternate: terms "
                "approach $+1$ and $-1$ along the two subsequences — divergent. Two subsequences with different "
                "limits is a clean divergence proof."
            )),
            (P, "Pitfalls", (
                "1. Confusing the SEQUENCE $\\{a_n\\}$ converging with the SERIES $\\sum a_n$ converging — "
                "C211's whole warning. $a_n \\to 0$ says nothing about the series.\n\n"
                "2. Alternating signs: $(-1)^n$ ruins limits that magnitudes alone would suggest; check "
                "subsequences.\n\n"
                "3. Fixed-point solving without a convergence proof — the equation also 'finds' limits of "
                "divergent sequences.\n\n"
                "4. L'Hôpital directly on $n!$ — factorials have no derivative; compare growth rates instead."
            )),
            (K, "Check yourself", (
                "You should be able to: compute sequence limits by dominant terms and squeezes, run the "
                "monotone-bounded argument on recursive sequences, and prove divergence by subsequences.\n\n"
                "Self-test: $\\lim_{n\\to\\infty} \\frac{5^n}{n!}$. (0 — factorial wins.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C211": {
        "summary": "Series and partial sums: geometric series, telescoping, and the divergence test.",
        "steps": [
            (L, "Series = limit of partial sums", (
                "$\\sum_{n=1}^\\infty a_n$ converges to $S$ when the PARTIAL SUMS $s_N = a_1 + \\cdots + a_N$ "
                "converge to $S$. Everything about series is secretly a statement about the sequence "
                "$\\{s_N\\}$.\n\n"
                "Divergence test (the only free test): if $a_n \\not\\to 0$, the series diverges. The converse "
                "FAILS — the harmonic series $\\sum \\frac{1}{n}$ has terms going to 0 and still diverges. This "
                "one-way arrow is the most-tested fact in the chapter."
            )),
            (L, "Geometric and telescoping", (
                "Geometric: $\\sum_{n=0}^\\infty ar^n = \\dfrac{a}{1 - r}$ exactly when $|r| < 1$; otherwise "
                "divergent. (First term over one-minus-ratio — with the first term as written, whatever the "
                "starting index.)\n\n"
                "Telescoping: partial fractions collapse the partial sum. "
                "$\\sum \\frac{1}{n(n+1)} = \\sum\\left(\\frac{1}{n} - \\frac{1}{n+1}\\right)$ has "
                "$s_N = 1 - \\frac{1}{N+1} \\to 1$.\n\n"
                "These two families are nearly the only series whose exact SUM you can compute; the tests in "
                "C212-C213 only decide convergence."
            )),
            (E, "Worked example", (
                "$\\displaystyle\\sum_{n=1}^\\infty \\frac{2^{n+1}}{3^n}$.\n\n"
                "Rewrite: $2 \\sum_{n=1}^\\infty \\left(\\frac{2}{3}\\right)^n$ — geometric, first term "
                "$2 \\cdot \\frac{2}{3} = \\frac{4}{3}$, ratio $\\frac{2}{3}$:\n"
                "$$S = \\frac{4/3}{1 - 2/3} = 4.$$\n\n"
                "Repeating decimals are the classic application: "
                "$0.\\overline{7} = \\sum \\frac{7}{10^n} = \\frac{7/10}{9/10} = \\frac{7}{9}$."
            )),
            (P, "Pitfalls", (
                "1. '$a_n \\to 0$, so the series converges' — the harmonic counterexample kills this daily.\n\n"
                "2. Geometric sum with the wrong first term: $\\frac{a}{1-r}$ requires $a$ = the ACTUAL first "
                "term of your sum, not always the $n=0$ term.\n\n"
                "3. Using the formula when $|r| \\ge 1$ — it produces a confident, meaningless number.\n\n"
                "4. Telescoping without writing out $s_N$: middle terms must VISIBLY cancel; trust the pattern "
                "only after seeing two or three terms collapse."
            )),
            (K, "Check yourself", (
                "You should be able to: apply the divergence test correctly (one direction!), sum geometric and "
                "telescoping series exactly, and convert repeating decimals.\n\n"
                "Self-test: does $\\sum_{n=1}^\\infty \\frac{n}{2n + 1}$ converge? "
                "(Terms $\\to \\frac 1 2 \\ne 0$: diverges by the divergence test.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C212": {
        "summary": "The integral test, p-series, and direct and limit comparison.",
        "steps": [
            (L, "Integral test and p-series", (
                "If $f$ is positive, continuous, and decreasing with $f(n) = a_n$, then $\\sum a_n$ and "
                "$\\int_1^\\infty f(x)\\,dx$ converge or diverge TOGETHER.\n\n"
                "Applied to $f(x) = x^{-p}$ it yields the p-series benchmark:\n"
                "$$\\sum \\frac{1}{n^p} \\text{ converges} \\iff p > 1.$$\n"
                "So $\\sum \\frac{1}{n^2}$ converges, $\\sum \\frac{1}{n}$ and $\\sum \\frac{1}{\\sqrt n}$ "
                "diverge. The p-series and geometric series are the reference library every comparison leans on."
            )),
            (L, "Comparison tests", (
                "Direct comparison (positive terms): smaller than convergent converges; bigger than divergent "
                "diverges. The other two directions say NOTHING.\n\n"
                "Limit comparison — the workhorse: if $\\lim \\frac{a_n}{b_n} = c$ with $0 < c < \\infty$, the "
                "two series share their fate. Choose $b_n$ = the dominant-term skeleton of $a_n$: for "
                "$\\frac{n + 3}{n^3 + n + 1}$ take $b_n = \\frac{1}{n^2}$.\n\n"
                "Limit comparison forgives the inequality bookkeeping that direct comparison demands."
            )),
            (E, "Worked example", (
                "Does $\\displaystyle\\sum_{n=1}^\\infty \\frac{2n + 5}{n^3 - n + 7}$ converge?\n\n"
                "Skeleton: $\\frac{2n}{n^3} = \\frac{2}{n^2}$, so compare with $b_n = \\frac{1}{n^2}$:\n"
                "$$\\lim_{n\\to\\infty} \\frac{(2n+5)/(n^3 - n + 7)}{1/n^2} "
                "= \\lim \\frac{2n^3 + 5n^2}{n^3 - n + 7} = 2.$$\n\n"
                "Finite and positive; $\\sum \\frac{1}{n^2}$ converges ($p = 2$), so the series converges."
            )),
            (P, "Pitfalls", (
                "1. Comparing in the useless direction: showing $a_n \\le \\frac{1}{n}$ (divergent upper bound) "
                "proves nothing.\n\n"
                "2. Comparison tests on series with NEGATIVE terms — positivity is a hypothesis, not decoration "
                "(alternating series go to C213).\n\n"
                "3. Integral test without checking DECREASING (eventually is enough, but check).\n\n"
                "4. Believing the integral's VALUE is the series' sum — the test shares convergence, not the "
                "number.\n\n"
                "5. Logs are lower-order: $\\sum \\frac{\\ln n}{n}$ diverges (compare $\\frac 1 n$), while "
                "$\\sum \\frac{\\ln n}{n^2}$ converges (compare $n^{-3/2}$)."
            )),
            (K, "Check yourself", (
                "You should be able to: quote the p-series line, pick comparison skeletons by dominant terms, run "
                "limit comparison end to end, and apply the integral test with hypotheses.\n\n"
                "Self-test: $\\sum \\frac{1}{n^2 + n}$ — converges by limit comparison with $\\frac{1}{n^2}$ "
                "(and telescopes to 1, a rare bonus).\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C213": {
        "summary": "Ratio, root, and alternating series tests; absolute vs conditional convergence.",
        "steps": [
            (L, "Ratio and root", (
                "Ratio test: let $\\rho = \\lim \\left|\\frac{a_{n+1}}{a_n}\\right|$. "
                "$\\rho < 1$: converges absolutely. $\\rho > 1$: diverges. $\\rho = 1$: NO INFORMATION.\n\n"
                "Root test: same verdicts with $\\rho = \\lim \\sqrt[n]{|a_n|}$; it shines on $n$-th powers.\n\n"
                "Reach for the ratio test when factorials or exponentials appear — on pure powers of $n$ it "
                "always returns the useless $\\rho = 1$ (every p-series does), which is why p-series needed their "
                "own test."
            )),
            (L, "Alternating series; absolute vs conditional", (
                "Alternating series test: if the absolute terms $b_n$ decrease to 0, then "
                "$\\sum (-1)^n b_n$ converges — and the truncation error is at most the first omitted term.\n\n"
                "Vocabulary: $\\sum a_n$ converges ABSOLUTELY when $\\sum |a_n|$ converges (which forces plain "
                "convergence); it converges CONDITIONALLY when it converges but $\\sum |a_n|$ diverges.\n\n"
                "The alternating harmonic series $\\sum \\frac{(-1)^{n+1}}{n}$ is the canonical conditional case: "
                "convergent (to $\\ln 2$), absolutely divergent."
            )),
            (E, "Worked example", (
                "Classify $\\displaystyle\\sum_{n=1}^\\infty \\frac{(-1)^n n^2}{2^n}$.\n\n"
                "Check absolute convergence with the ratio test on $\\frac{n^2}{2^n}$:\n"
                "$$\\rho = \\lim \\frac{(n+1)^2 / 2^{n+1}}{n^2 / 2^n} = \\lim \\frac{1}{2}\\left(1 + \\frac 1 n\\right)^2 = \\frac{1}{2} < 1.$$\n\n"
                "Absolutely convergent — no alternating-series analysis needed once absolute convergence is in "
                "hand."
            )),
            (P, "Pitfalls", (
                "1. Concluding divergence from $\\rho = 1$ — the test simply abstains; switch to comparison "
                "or p-series.\n\n"
                "2. Alternating test without checking DECREASE of $b_n$ (terms going to 0 alone is not "
                "enough).\n\n"
                "3. Calling a series 'conditionally convergent' without proving BOTH halves: convergence AND "
                "absolute divergence.\n\n"
                "4. Forgetting absolute convergence implies convergence — testing $\\sum|a_n|$ first often "
                "finishes the problem in one move.\n\n"
                "5. Factorial ratio algebra: $\\frac{(n+1)!}{n!} = n + 1$, not $n!$."
            )),
            (K, "Check yourself", (
                "You should be able to: choose ratio vs root vs alternating by the series' shape, handle "
                "$\\rho = 1$ gracefully, and classify absolute vs conditional convergence with full proofs.\n\n"
                "Self-test: classify $\\sum \\frac{(-1)^n}{\\sqrt n}$. "
                "(Converges by AST; absolutely diverges — p = ½ — so conditional.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C214": {
        "summary": "Power series: radius and interval of convergence, with endpoint checks.",
        "steps": [
            (L, "Radius of convergence", (
                "A power series $\\sum c_n (x - a)^n$ converges on an interval centered at $a$: absolutely for "
                "$|x - a| < R$, diverges for $|x - a| > R$. Find $R$ with the ratio test on the terms:\n"
                "$$\\lim_{n\\to\\infty} \\left|\\frac{c_{n+1}(x-a)^{n+1}}{c_n (x-a)^n}\\right| "
                "= |x - a| \\lim \\left|\\frac{c_{n+1}}{c_n}\\right| < 1.$$\n\n"
                "Extremes are real: $R = \\infty$ (converges everywhere — e.g. $\\sum \\frac{x^n}{n!}$) and "
                "$R = 0$ (converges only at the center — e.g. $\\sum n! \\, x^n$)."
            )),
            (L, "The endpoints are separate cases", (
                "At $x = a \\pm R$ the ratio test returns exactly 1 — silence. Substitute each endpoint and test "
                "the resulting NUMERICAL series with C212-C213 tools.\n\n"
                "All four interval shapes occur: $\\sum x^n$ gives $(-1, 1)$; $\\sum \\frac{x^n}{n}$ gives "
                "$[-1, 1)$; $\\sum \\frac{x^n}{n^2}$ gives $[-1, 1]$.\n\n"
                "Inside the interval you may differentiate and integrate term by term; $R$ is preserved, but "
                "endpoint behavior can change — integration tends to gain endpoints, differentiation to lose them."
            )),
            (E, "Worked example", (
                "Interval of convergence of $\\displaystyle\\sum_{n=1}^\\infty \\frac{(x - 3)^n}{n \\, 2^n}$.\n\n"
                "Ratio: $|x - 3| \\lim \\frac{n \\, 2^n}{(n+1) 2^{n+1}} = \\frac{|x-3|}{2} < 1 \\Rightarrow "
                "|x - 3| < 2$, so $R = 2$, candidates $(1, 5)$.\n\n"
                "$x = 5$: $\\sum \\frac{1}{n}$ — diverges. $x = 1$: $\\sum \\frac{(-1)^n}{n}$ — converges "
                "(alternating).\n\n"
                "Interval: $[1, 5)$."
            )),
            (P, "Pitfalls", (
                "1. Skipping endpoint checks — the ratio test CANNOT decide them; two extra numerical series are "
                "mandatory.\n\n"
                "2. Solving $|x - a| < R$ sloppily: the interval is centered at $a$, not at 0.\n\n"
                "3. Series in $(2x)^n$ or $x^{2n}$: the ratio computation changes ($x^{2n}$ gives "
                "$|x|^2 < 1$-type conditions); don't pattern-match blindly.\n\n"
                "4. Assuming both endpoints behave the same — they usually don't, that's the point."
            )),
            (K, "Check yourself", (
                "You should be able to: extract $R$ by ratio test, test both endpoints with the right series "
                "tests, and state the interval in exact bracket notation.\n\n"
                "Self-test: interval of $\\sum \\frac{(-1)^n x^{2n}}{4^n}$. "
                "($\\frac{x^2}{4} < 1 \\Rightarrow |x| < 2$; both endpoints give $\\sum (\\pm 1)^{...}$ terms "
                "not tending to 0: $(-2, 2)$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C215": {
        "summary": "Taylor and Maclaurin series: building series from derivatives, and the standard library.",
        "steps": [
            (L, "The construction", (
                "The Taylor series of $f$ at $a$ packages all derivative information:\n"
                "$$f(x) = \\sum_{n=0}^\\infty \\frac{f^{(n)}(a)}{n!}(x - a)^n.$$\n"
                "Maclaurin = Taylor at $a = 0$. Each coefficient is forced: differentiate the series $n$ times "
                "at $a$ and only the $n$-th term survives.\n\n"
                "The library to know cold (all at 0):\n"
                "$$e^x = \\sum \\frac{x^n}{n!}, \\quad \\sin x = \\sum \\frac{(-1)^n x^{2n+1}}{(2n+1)!}, "
                "\\quad \\cos x = \\sum \\frac{(-1)^n x^{2n}}{(2n)!},$$\n"
                "$$\\frac{1}{1-x} = \\sum x^n \\;(|x|<1), \\qquad \\ln(1+x) = \\sum \\frac{(-1)^{n+1} x^n}{n} \\;(-1 < x \\le 1).$$"
            )),
            (L, "Build from the library, not from scratch", (
                "New series come from old by substitution, multiplication, differentiation, and integration — "
                "almost never by grinding out derivatives:\n\n"
                "• $e^{-x^2}$: substitute $-x^2$ into the $e^x$ series.\n"
                "• $\\arctan x = \\int \\frac{dx}{1 + x^2}$: substitute $-x^2$ into the geometric series, "
                "integrate term by term: $\\sum \\frac{(-1)^n x^{2n+1}}{2n+1}$.\n"
                "• $x \\sin x$: multiply the sine series by $x$.\n\n"
                "The tenth derivative of $e^{-x^2}$ at 0? Read it off the series: the coefficient of $x^{10}$ is "
                "$\\frac{-1^5}{5!}$... precisely, $c_{10} = \\frac{(-1)^5}{5!}$, so "
                "$f^{(10)}(0) = 10! \\, c_{10} = -\\frac{10!}{120}$. No differentiation performed."
            )),
            (E, "Worked example", (
                "Maclaurin series of $f(x) = \\dfrac{x}{1 + 2x}$ and its radius.\n\n"
                "Geometric with ratio $-2x$: $\\frac{1}{1 + 2x} = \\sum_{n=0}^\\infty (-2x)^n$ for "
                "$|2x| < 1$.\n\n"
                "$$f(x) = x \\sum_{n=0}^\\infty (-2)^n x^n = \\sum_{n=0}^\\infty (-2)^n x^{n+1} "
                "= x - 2x^2 + 4x^3 - \\cdots, \\qquad R = \\tfrac{1}{2}.$$"
            )),
            (P, "Pitfalls", (
                "1. Forgetting the $n!$ in coefficients — both when building ($\\frac{f^{(n)}(a)}{n!}$) and when "
                "reading derivatives back ($f^{(n)}(0) = n! \\, c_n$).\n\n"
                "2. Substitution changing the interval: $|{-2x}| < 1$ halves the radius; carry the condition "
                "through.\n\n"
                "3. sin/cos parity confusion: sine is odd (odd powers only), cosine even. A stray even power in "
                "a 'sine series' is a wrong turn.\n\n"
                "4. Grinding derivatives when the library + algebra gives the answer in two lines."
            )),
            (K, "Check yourself", (
                "You should be able to: reproduce the five library series with their intervals, build new series "
                "by substitution/integration/multiplication, and read derivatives off coefficients.\n\n"
                "Self-test: first three nonzero terms of the Maclaurin series of $\\cos(x^2)$. "
                "($1 - \\frac{x^4}{2} + \\frac{x^8}{24}$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C216": {
        "summary": "Taylor approximation and error: truncation, remainder bounds, and where to trust the polynomial.",
        "steps": [
            (L, "Taylor polynomials and the remainder", (
                "The degree-$n$ Taylor polynomial $T_n$ truncates the series; the error is the remainder "
                "$R_n(x) = f(x) - T_n(x)$.\n\n"
                "Lagrange bound: for some $c$ between $a$ and $x$,\n"
                "$$|R_n(x)| \\le \\frac{M}{(n+1)!} |x - a|^{n+1},$$\n"
                "where $M$ bounds $|f^{(n+1)}|$ on the interval. Three levers control the error: closeness to "
                "the center, degree of the polynomial, and the size of the next derivative."
            )),
            (L, "Alternating shortcut and trust regions", (
                "When the series at your $x$ is ALTERNATING with decreasing terms, the error bound is free: "
                "$|R_n| \\le$ first omitted term. For $\\sin$, $\\cos$, and $e^{-x}$-type evaluations this is "
                "almost always the fastest rigorous bound.\n\n"
                "Practical reading: $\\sin x \\approx x$ is excellent for small $|x|$ (error $\\le \\frac{|x|^3}{6}$) "
                "and garbage at $x = 2$. Every Taylor approximation has a trust region — the bound is what tells "
                "you its size."
            )),
            (E, "Worked example", (
                "How many terms of the $e^x$ series evaluate $e^{0.5}$ to within $10^{-4}$?\n\n"
                "Lagrange with $M = e^{0.5} < 2$: need $\\frac{2 \\cdot (0.5)^{n+1}}{(n+1)!} < 10^{-4}$.\n\n"
                "$n = 4$: $\\frac{2 \\cdot 0.5^5}{120} = 5.2 \\times 10^{-4}$ — not yet. "
                "$n = 5$: $\\frac{2 \\cdot 0.5^6}{720} = 4.3 \\times 10^{-5}$ ✓.\n\n"
                "So $T_5(0.5) = 1 + 0.5 + \\frac{0.25}{2} + \\cdots + \\frac{0.5^5}{120} \\approx 1.64870$ "
                "(true: $1.64872$)."
            )),
            (P, "Pitfalls", (
                "1. Using $|R_n| \\approx$ 'the next term' as a RIGOROUS bound outside the alternating case — "
                "for same-sign series it underestimates.\n\n"
                "2. Choosing $M$ at the center instead of the WORST point of the interval — $M$ must bound the "
                "derivative over the whole stretch.\n\n"
                "3. Off-by-one everywhere: $T_n$ has degree $n$, the remainder involves the $(n{+}1)$-st "
                "derivative and $(n{+}1)!$.\n\n"
                "4. Extrapolating far from the center because the polynomial 'looks smooth' — the "
                "$|x - a|^{n+1}$ factor grows without mercy."
            )),
            (K, "Check yourself", (
                "You should be able to: bound truncation error by Lagrange and by the alternating shortcut, "
                "solve for the degree needed for a target accuracy, and state a trust region honestly.\n\n"
                "Self-test: bound the error of $\\cos x \\approx 1 - \\frac{x^2}{2}$ at $x = 0.1$. "
                "(Alternating: error $\\le \\frac{0.1^4}{24} \\approx 4.2 \\times 10^{-6}$.)\n\n"
                "Practice the node — then the whole C2 sequence is yours."
            )),
        ],
    },
}
