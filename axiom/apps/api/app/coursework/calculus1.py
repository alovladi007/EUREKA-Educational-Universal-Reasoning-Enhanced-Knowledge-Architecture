"""Coursework: Calculus I nodes C101-C118 (limits through the FTC).

Authored lessons, five steps each: two concept readings, a worked example,
a pitfall step, and a check-yourself step. Bodies use $...$ / $$...$$ TeX.
"""

L = "reading"
E = "example"
P = "pitfall"
K = "check"

LESSONS: dict[str, dict] = {
    # ------------------------------------------------------------------
    "C101": {
        "summary": "What a limit is: the value a function approaches, read from graphs, tables, and one-sided behavior.",
        "steps": [
            (L, "The idea: approaching, not arriving", (
                "The limit $\\lim_{x \\to a} f(x) = L$ says: as $x$ gets arbitrarily close to $a$ "
                "(from either side, without ever equaling $a$), the outputs $f(x)$ get arbitrarily close to $L$.\n\n"
                "The crucial point: the limit is about the journey, not the destination. $f(a)$ can be "
                "different from $L$, or not exist at all, and the limit can still be $L$. A hole in a graph "
                "at $(a, L)$ does not change $\\lim_{x \\to a} f(x) = L$."
            )),
            (L, "One-sided limits", (
                "Approaching from the left gives $\\lim_{x \\to a^-} f(x)$; from the right, "
                "$\\lim_{x \\to a^+} f(x)$.\n\n"
                "The two-sided limit exists exactly when both one-sided limits exist and agree:\n"
                "$$\\lim_{x \\to a} f(x) = L \\iff \\lim_{x \\to a^-} f(x) = \\lim_{x \\to a^+} f(x) = L.$$\n\n"
                "Step functions and piecewise definitions are where one-sided limits earn their keep: at a jump, "
                "each side has its own limit and the two-sided limit does not exist."
            )),
            (E, "Worked example: a table and a hole", (
                "Let $f(x) = \\dfrac{x^2 - 1}{x - 1}$, which is undefined at $x = 1$.\n\n"
                "Numerically: $f(0.9) = 1.9$, $f(0.99) = 1.99$, $f(1.01) = 2.01$, $f(1.1) = 2.1$. "
                "Both sides are closing in on $2$.\n\n"
                "Algebraically the function equals $x + 1$ everywhere except $x = 1$, so its graph is the line "
                "$y = x + 1$ with a hole at $(1, 2)$. Conclusion: $\\lim_{x \\to 1} f(x) = 2$ even though $f(1)$ "
                "does not exist."
            )),
            (P, "Pitfalls", (
                "1. Writing $\\lim_{x \\to a} f(x) = f(a)$ by reflex. That equality is the DEFINITION of "
                "continuity, not a law of limits — it fails at holes, jumps, and undefined points.\n\n"
                "2. Concluding a limit exists from a one-sided table. Always check both directions: "
                "$\\lim_{x \\to 0} \\frac{|x|}{x}$ has left limit $-1$ and right limit $+1$, so no limit.\n\n"
                "3. Trusting a calculator table too far: rounding can fake convergence. Tables suggest; "
                "algebra confirms."
            )),
            (K, "Check yourself", (
                "You should now be able to: read $\\lim_{x \\to a^\\pm} f(x)$ off a graph with jumps and holes; "
                "estimate a limit from a table honestly; and state precisely when a two-sided limit exists.\n\n"
                "Quick self-test: if $f(x) = \\begin{cases} x^2 & x < 2 \\\\ 7 & x = 2 \\\\ x + 2 & x > 2 \\end{cases}$, "
                "what are the left limit, right limit, and $f(2)$ at $x = 2$? (Answer: $4$, $4$, $7$ — the limit is $4$.)\n\n"
                "Head to Practice for graded problems on this node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C102": {
        "summary": "Evaluating limits by algebra: limit laws, and resolving 0/0 with factoring and conjugates.",
        "steps": [
            (L, "The limit laws", (
                "When the pieces have limits, limits respect arithmetic: the limit of a sum is the sum of the "
                "limits, and likewise for differences, products, quotients (nonzero denominator limit), and "
                "constant multiples.\n\n"
                "For polynomials and other functions continuous at $a$, this collapses to substitution: "
                "$\\lim_{x \\to a} p(x) = p(a)$.\n\n"
                "So the working algorithm is: try substitution first. If you get a number, done. If you get "
                "$\\frac{\\text{nonzero}}{0}$, the limit is infinite or does not exist. If you get $\\frac{0}{0}$, "
                "you have an indeterminate form — the interesting case."
            )),
            (L, "Resolving 0/0", (
                "$\\frac{0}{0}$ means both numerator and denominator vanish at $a$ — they share a root, hence "
                "usually a common factor of $(x - a)$. The strategy is to expose and cancel it:\n\n"
                "• Factor polynomials: $\\dfrac{x^2 - 9}{x - 3} = x + 3$ for $x \\ne 3$.\n\n"
                "• Multiply by a conjugate for square roots: "
                "$\\dfrac{\\sqrt{x} - 2}{x - 4} \\cdot \\dfrac{\\sqrt{x} + 2}{\\sqrt{x} + 2} = \\dfrac{1}{\\sqrt{x} + 2}$.\n\n"
                "• Clear complex fractions with a common denominator first.\n\n"
                "After cancellation, substitute again."
            )),
            (E, "Worked example: conjugate", (
                "Evaluate $\\lim_{x \\to 4} \\dfrac{\\sqrt{x} - 2}{x - 4}$.\n\n"
                "Substitution gives $\\frac{0}{0}$. Multiply top and bottom by the conjugate $\\sqrt{x} + 2$:\n"
                "$$\\frac{(\\sqrt{x} - 2)(\\sqrt{x} + 2)}{(x - 4)(\\sqrt{x} + 2)} = \\frac{x - 4}{(x - 4)(\\sqrt{x} + 2)} = \\frac{1}{\\sqrt{x} + 2}.$$\n\n"
                "Now substitute: $\\dfrac{1}{\\sqrt{4} + 2} = \\dfrac{1}{4}$."
            )),
            (P, "Pitfalls", (
                "1. Treating $\\frac{0}{0}$ as $0$, $1$, or 'undefined, stop'. It is a signal to do more algebra, "
                "not an answer.\n\n"
                "2. Canceling before checking that the factor actually vanishes at $a$ — cancellation is only "
                "forced when both parts are $0$ there.\n\n"
                "3. Using the quotient law when the denominator's limit is $0$: the law simply does not apply; "
                "that is why the algebraic rewrite is needed.\n\n"
                "4. Sign errors when factoring $a - x = -(x - a)$: a stray minus flips the whole answer."
            )),
            (K, "Check yourself", (
                "You should be able to: evaluate limits of polynomials and rational functions by substitution; "
                "recognize $\\frac{0}{0}$; and resolve it by factoring, conjugates, or clearing fractions.\n\n"
                "Self-test: $\\lim_{h \\to 0} \\dfrac{(2 + h)^2 - 4}{h}$. "
                "(Expand: $\\frac{4h + h^2}{h} = 4 + h \\to 4$.) Notice this is secretly a derivative in disguise — "
                "C105 makes that precise.\n\nPractice this node next."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C103": {
        "summary": "Continuity at a point and on intervals, the three-part test, and the intermediate value theorem.",
        "steps": [
            (L, "The three-part test", (
                "$f$ is continuous at $a$ when three things hold:\n\n"
                "1. $f(a)$ is defined;\n"
                "2. $\\lim_{x \\to a} f(x)$ exists (both sides agree);\n"
                "3. $\\lim_{x \\to a} f(x) = f(a)$.\n\n"
                "Each failure mode has a picture: (1) fails at a missing point, (2) fails at a jump or oscillation, "
                "(3) fails at a hole that was filled at the wrong height (removable discontinuity).\n\n"
                "Polynomials, $\\sin$, $\\cos$, $e^x$ are continuous everywhere; rational functions and $\\ln$, "
                "$\\tan$, $\\sqrt{\\;}$ are continuous on their domains."
            )),
            (L, "The intermediate value theorem", (
                "IVT: if $f$ is continuous on $[a, b]$ and $N$ is any value between $f(a)$ and $f(b)$, then "
                "$f(c) = N$ for some $c$ in $(a, b)$.\n\n"
                "Intuition: a continuous graph cannot get from one height to another without passing through "
                "every height in between — no teleporting.\n\n"
                "Its workhorse use is locating roots: if $f$ is continuous and $f(a) < 0 < f(b)$, there is a root "
                "in $(a, b)$. Bisecting the interval repeatedly traps the root as tightly as you like."
            )),
            (E, "Worked example: root location", (
                "Show $f(x) = x^3 + x - 3$ has a root between $1$ and $2$.\n\n"
                "$f$ is a polynomial, hence continuous everywhere. $f(1) = 1 + 1 - 3 = -1 < 0$ and "
                "$f(2) = 8 + 2 - 3 = 7 > 0$. Since $0$ lies between $-1$ and $7$, the IVT gives a $c$ in $(1,2)$ "
                "with $f(c) = 0$.\n\n"
                "Refine: $f(1.2) = 1.728 + 1.2 - 3 = -0.072 < 0$, so the root is in $(1.2,\\, 2)$; "
                "$f(1.3) \\approx 0.497 > 0$ pins it inside $(1.2, 1.3)$."
            )),
            (P, "Pitfalls", (
                "1. Applying the IVT without continuity: $g(x) = 1/x$ has $g(-1) < 0 < g(1)$ and no root — the "
                "discontinuity at $0$ voids the theorem.\n\n"
                "2. Reading the IVT backwards: it guarantees existence, not uniqueness, and says nothing about "
                "values NOT between $f(a)$ and $f(b)$.\n\n"
                "3. Classifying discontinuities sloppily: a removable discontinuity (limit exists, wrong or missing "
                "value) is not a jump (one-sided limits differ), and neither is an infinite discontinuity."
            )),
            (K, "Check yourself", (
                "You should be able to: run the three-part test at a point, classify a discontinuity as removable, "
                "jump, or infinite, and use the IVT to trap a root in an interval.\n\n"
                "Self-test: where is $f(x) = \\dfrac{x^2 - 4}{x - 2}$ discontinuous, and of which type? "
                "(At $x = 2$: removable, since the limit is $4$ but $f(2)$ is undefined.)\n\n"
                "Practice this node to lock it in."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C104": {
        "summary": "End behavior: limits at infinity, horizontal asymptotes, and vertical asymptotes.",
        "steps": [
            (L, "Limits at infinity and horizontal asymptotes", (
                "$\\lim_{x \\to \\infty} f(x) = L$ means the outputs settle toward $L$ as $x$ grows without bound; "
                "then $y = L$ is a horizontal asymptote.\n\n"
                "For rational functions, divide by the highest power of $x$ in the denominator, or just compare "
                "degrees:\n\n"
                "• degree top $<$ degree bottom: limit $0$;\n"
                "• degrees equal: limit = ratio of leading coefficients;\n"
                "• degree top $>$ degree bottom: infinite limit (no horizontal asymptote — possibly a slant one).\n\n"
                "A function can cross its horizontal asymptote; the asymptote only describes the far tail."
            )),
            (L, "Vertical asymptotes and infinite limits", (
                "$x = a$ is a vertical asymptote when $f(x) \\to \\pm\\infty$ as $x \\to a$ from at least one side. "
                "For rational functions these occur where the denominator vanishes and the numerator does not "
                "(after canceling common factors — a canceled zero is a hole, not an asymptote).\n\n"
                "Always determine the sign on each side separately: $\\frac{1}{(x-2)}$ blows up to $-\\infty$ from "
                "the left of $2$ and $+\\infty$ from the right, while $\\frac{1}{(x-2)^2} \\to +\\infty$ from both."
            )),
            (E, "Worked example: full asymptote profile", (
                "Profile $f(x) = \\dfrac{2x^2 - 8}{x^2 - x - 6} = \\dfrac{2(x-2)(x+2)}{(x-3)(x+2)}$.\n\n"
                "Cancel $(x+2)$: a HOLE at $x = -2$ (height $\\frac{2(-4)}{-5} = \\frac{8}{5}$).\n\n"
                "Denominator zero remaining at $x = 3$ with nonzero numerator: vertical asymptote $x = 3$.\n\n"
                "Degrees equal with leading ratio $\\frac{2}{1}$: horizontal asymptote $y = 2$ in both directions."
            )),
            (P, "Pitfalls", (
                "1. Calling every denominator zero a vertical asymptote — cancel first; common factors give holes.\n\n"
                "2. Assuming at most one horizontal asymptote: $\\arctan x$ and $\\frac{|x|}{x+1}$ have different "
                "limits at $+\\infty$ and $-\\infty$; check both tails.\n\n"
                "3. Sign sloppiness at $-\\infty$ with odd powers and $\\sqrt{x^2} = |x|$: for $x < 0$, "
                "$\\sqrt{x^2} = -x$, which flips many 'obvious' answers.\n\n"
                "4. Writing $\\lim = \\infty$ and treating it as a number. It is a description of unbounded growth; "
                "the limit does not exist in the finite sense."
            )),
            (K, "Check yourself", (
                "You should be able to: compute both tail limits of a rational function by degree comparison, find "
                "vertical asymptotes after canceling, distinguish holes from asymptotes, and give one-sided signs "
                "at each vertical asymptote.\n\n"
                "Self-test: $\\lim_{x \\to -\\infty} \\dfrac{3x + 1}{\\sqrt{x^2 + 1}}$. "
                "(Divide by $|x| = -x$: the limit is $-3$.)\n\nThen practice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C105": {
        "summary": "The derivative as a limit of difference quotients: tangent slope and instantaneous rate.",
        "steps": [
            (L, "From average to instantaneous", (
                "The average rate of change of $f$ over $[a, a+h]$ is the slope of the secant line:\n"
                "$$\\frac{f(a+h) - f(a)}{h}.$$\n\n"
                "Shrink the window: the derivative is the limit of secant slopes,\n"
                "$$f'(a) = \\lim_{h \\to 0} \\frac{f(a+h) - f(a)}{h},$$\n"
                "the slope of the tangent line at $a$ and the instantaneous rate of change there. "
                "An equivalent form is $f'(a) = \\lim_{x \\to a} \\frac{f(x) - f(a)}{x - a}$.\n\n"
                "Every derivative rule you will ever use is a shortcut for this one limit."
            )),
            (L, "The tangent line", (
                "Once $f'(a)$ is known, the tangent line at $(a, f(a))$ is\n"
                "$$y = f(a) + f'(a)(x - a).$$\n\n"
                "Units carry meaning: if $f(t)$ is position in meters and $t$ seconds, $f'(t)$ is velocity in "
                "m/s. Whenever you compute a derivative in a modeling problem, say its units out loud — it is "
                "the fastest sanity check available."
            )),
            (E, "Worked example: from the definition", (
                "Compute $f'(3)$ for $f(x) = x^2$ from the definition.\n\n"
                "$$f'(3) = \\lim_{h \\to 0} \\frac{(3+h)^2 - 9}{h} = \\lim_{h \\to 0} \\frac{9 + 6h + h^2 - 9}{h} "
                "= \\lim_{h \\to 0} (6 + h) = 6.$$\n\n"
                "Tangent line at $(3, 9)$: $y = 9 + 6(x - 3) = 6x - 9$.\n\n"
                "Note the shape of the computation: expand, cancel the $h$-free terms, factor out $h$, then let "
                "$h \\to 0$. If nothing cancels, an algebra error happened upstream."
            )),
            (P, "Pitfalls", (
                "1. Setting $h = 0$ before simplifying — that is the $\\frac{0}{0}$ trap; the cancellation must "
                "come first.\n\n"
                "2. Dropping the limit symbol mid-computation and quietly treating $6 + h$ as the derivative.\n\n"
                "3. Confusing $f'(a)$ (a number: slope AT $a$) with $f'(x)$ (a function). The definition with a "
                "general $x$ produces the function.\n\n"
                "4. Forgetting that the derivative may fail to exist — C106 is about exactly that."
            )),
            (K, "Check yourself", (
                "You should be able to: form and simplify a difference quotient, take the limit, and write a "
                "tangent line.\n\n"
                "Self-test: from the definition, $f'(x)$ for $f(x) = \\frac{1}{x}$. "
                "(Common denominator: $\\frac{1}{h}\\left(\\frac{x - (x+h)}{x(x+h)}\\right) = \\frac{-1}{x(x+h)} "
                "\\to -\\frac{1}{x^2}$.)\n\nPractice the node now — the definition questions here are the "
                "foundation everything in C107+ compresses."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C106": {
        "summary": "Where derivatives fail: corners, cusps, vertical tangents — and why differentiability implies continuity.",
        "steps": [
            (L, "Differentiable implies continuous", (
                "If $f'(a)$ exists then $f$ is continuous at $a$. Proof sketch: "
                "$f(x) - f(a) = \\frac{f(x) - f(a)}{x - a} \\cdot (x - a) \\to f'(a) \\cdot 0 = 0$.\n\n"
                "The converse is FALSE, and the counterexamples are the whole point of this node: continuity does "
                "not smooth a graph. $|x|$ is continuous everywhere and not differentiable at $0$."
            )),
            (L, "The three failure modes", (
                "• Corner: one-sided difference-quotient limits both exist but disagree — $|x|$ at $0$ has slopes "
                "$-1$ and $+1$.\n\n"
                "• Cusp: the one-sided slopes blow up with opposite signs — $x^{2/3}$ at $0$.\n\n"
                "• Vertical tangent: the slopes blow up with the SAME sign — $x^{1/3}$ at $0$ has "
                "$\\frac{h^{1/3}}{h} = h^{-2/3} \\to +\\infty$ from both sides; the tangent is the vertical line "
                "$x = 0$.\n\n"
                "And of course any discontinuity kills differentiability outright."
            )),
            (E, "Worked example: a piecewise seam", (
                "For what $a, b$ is $f(x) = \\begin{cases} x^2 & x \\le 1 \\\\ ax + b & x > 1 \\end{cases}$ "
                "differentiable at $1$?\n\n"
                "Continuity at the seam: $1 = a + b$.\n\n"
                "Matching slopes: left slope $2x \\big|_{x=1} = 2$, right slope $a$, so $a = 2$, then $b = -1$.\n\n"
                "Both conditions are needed: with $a = 2, b = 0$ the slopes match but the pieces do not meet, and "
                "the function is not even continuous — so not differentiable."
            )),
            (P, "Pitfalls", (
                "1. 'It is continuous, so it is differentiable' — the single most common wrong implication in the "
                "course. The arrow only goes the other way.\n\n"
                "2. Checking only that the FORMULAS' derivatives agree at a seam while ignoring continuity there.\n\n"
                "3. Confusing a cusp with a vertical tangent: both have infinite slopes, but a cusp changes sign "
                "($\\pm\\infty$) and a vertical tangent does not.\n\n"
                "4. Assuming differentiability fails only at 'special' points of a formula — absolute values, "
                "fractional powers, and piecewise seams are exactly where to look."
            )),
            (K, "Check yourself", (
                "You should be able to: prove non-differentiability from one-sided difference quotients, classify "
                "the failure (corner, cusp, vertical tangent, discontinuity), and tune piecewise parameters for "
                "smoothness.\n\n"
                "Self-test: classify $f(x) = |x - 2|^{3}$ at $x = 2$. "
                "(Both one-sided slopes are $0$ — it IS differentiable there; not every absolute value makes a "
                "corner. Compute before concluding.)\n\nPractice next."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C107": {
        "summary": "The power, product, and quotient rules — and how to pick the right one.",
        "steps": [
            (L, "Power and linearity", (
                "Power rule: $\\dfrac{d}{dx} x^n = n x^{n-1}$ for any real $n$ — including negative and fractional "
                "exponents, which is why rewriting matters: $\\frac{1}{x^2} = x^{-2}$, $\\sqrt{x} = x^{1/2}$.\n\n"
                "Linearity: $(af + bg)' = af' + bg'$. Constants ride along; sums split. Together with the power "
                "rule this differentiates every polynomial instantly:\n"
                "$$\\frac{d}{dx}\\left(4x^5 - 3x^2 + 7\\right) = 20x^4 - 6x.$$"
            )),
            (L, "Product and quotient rules", (
                "Product rule: $(fg)' = f'g + fg'$ — NOT $f'g'$. Each factor takes a turn being differentiated.\n\n"
                "Quotient rule:\n"
                "$$\\left(\\frac{f}{g}\\right)' = \\frac{f'g - fg'}{g^2},$$\n"
                "numerator order matters (top-prime-bottom minus top-bottom-prime).\n\n"
                "Selection discipline: rewrite BEFORE reaching for heavy rules. $\\frac{x^3 + 1}{x}$ is faster as "
                "$x^2 + x^{-1}$ than as a quotient-rule exercise."
            )),
            (E, "Worked example: both rules", (
                "Differentiate $y = \\dfrac{x^2 \\sin x}{x + 1}$... no — start smaller. "
                "Differentiate $y = (3x^2 + 1)(x^3 - x)$ two ways.\n\n"
                "Product rule: $y' = 6x(x^3 - x) + (3x^2 + 1)(3x^2 - 1) = 6x^4 - 6x^2 + 9x^4 - 1 = 15x^4 - 6x^2 - 1$.\n\n"
                "Expand first: $y = 3x^5 - 3x^3 + x^3 - x = 3x^5 - 2x^3 - x$, so $y' = 15x^4 - 6x^2 - 1$. Same "
                "answer — use whichever costs less algebra. For $\\dfrac{x^2}{x^4 + 1}$, quotient rule: "
                "$y' = \\dfrac{2x(x^4+1) - x^2 \\cdot 4x^3}{(x^4+1)^2} = \\dfrac{2x - 2x^5}{(x^4+1)^2}$."
            )),
            (P, "Pitfalls", (
                "1. $(fg)' = f'g'$ — the classic. Test it on $x \\cdot x$: you'd get $1$, but $(x^2)' = 2x$.\n\n"
                "2. Quotient rule numerator order flipped — the sign of the whole derivative flips with it.\n\n"
                "3. Power rule on $x^x$ or $2^x$: the rule needs a CONSTANT exponent. ($2^x$ belongs to C110.)\n\n"
                "4. Forgetting to simplify exponent rewrites back: leaving $-1 x^{-2}$ as the final form of "
                "$\\frac{d}{dx} x^{-1}$ is fine, but misreading $x^{-2}$ as $-x^2$ under time pressure is not."
            )),
            (K, "Check yourself", (
                "You should be able to: differentiate any polynomial on sight, apply product and quotient rules "
                "with correct order, and choose rewriting over rules when it is cheaper.\n\n"
                "Self-test: $\\dfrac{d}{dx} \\dfrac{\\sqrt{x}}{x^2 + 1}$ at the setup level — write the quotient "
                "rule expression with $f = x^{1/2}$, $f' = \\tfrac{1}{2} x^{-1/2}$ before simplifying.\n\n"
                "Practice the node; product/quotient selection is graded there."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C108": {
        "summary": "The chain rule: derivatives of compositions, worked outside-in with inner-derivative discipline.",
        "steps": [
            (L, "The rule", (
                "For a composition $y = f(g(x))$:\n"
                "$$\\frac{dy}{dx} = f'(g(x)) \\cdot g'(x)$$\n"
                "— derivative of the outside AT the inside, times the derivative of the inside.\n\n"
                "In Leibniz form, with $u = g(x)$: $\\dfrac{dy}{dx} = \\dfrac{dy}{du} \\cdot \\dfrac{du}{dx}$. "
                "Rates multiply through a chain of dependence: if $y$ changes 3x as fast as $u$, and $u$ changes "
                "2x as fast as $x$, then $y$ changes 6x as fast as $x$."
            )),
            (L, "Recognizing compositions", (
                "The skill is seeing the layers. $\\sin(x^2)$: outside $\\sin$, inside $x^2$. "
                "$(3x^2 + 1)^{7}$: outside $u^7$, inside $3x^2 + 1$. $e^{\\cos x}$: outside $e^u$, inside $\\cos x$.\n\n"
                "Deeper nests peel one layer at a time, outside-in:\n"
                "$$\\frac{d}{dx} \\sqrt{\\sin(x^2)} = \\frac{1}{2\\sqrt{\\sin(x^2)}} \\cdot \\cos(x^2) \\cdot 2x.$$\n\n"
                "Every layer contributes exactly one factor. Count layers, count factors."
            )),
            (E, "Worked example", (
                "Differentiate $y = (2x^3 - 5x)^{4}$.\n\n"
                "Outside: $u^4$ with derivative $4u^3$. Inside: $u = 2x^3 - 5x$ with derivative $6x^2 - 5$.\n\n"
                "$$y' = 4(2x^3 - 5x)^3 \\cdot (6x^2 - 5).$$\n\n"
                "Now with trig: $\\dfrac{d}{dx} \\tan(3x) = \\sec^2(3x) \\cdot 3$. The '$\\cdot 3$' is the inner "
                "derivative — the factor beginners drop most often."
            )),
            (P, "Pitfalls", (
                "1. Dropping the inner derivative: writing $\\frac{d}{dx}\\sin(x^2) = \\cos(x^2)$. Missing "
                "'$\\cdot 2x$' is the single most common calculus error, period.\n\n"
                "2. Differentiating the inside INSIDE the outside: $\\cos(2x)$ for the derivative of "
                "$\\sin(x^2)$ mangles both layers.\n\n"
                "3. Power rule vs chain confusion: $\\frac{d}{dx}(x^2+1)^3$ is not $3(x^2+1)^2$ — it needs "
                "'$\\cdot 2x$'.\n\n"
                "4. In Leibniz notation, 'canceling' $du$ is a mnemonic, not an operation — it fails badly in "
                "several variables (C306)."
            )),
            (K, "Check yourself", (
                "You should be able to: identify layers in any composition, produce one factor per layer, and "
                "combine the chain rule with product/quotient rules.\n\n"
                "Self-test: $\\dfrac{d}{dx} e^{3x} \\sin(x^2)$ — product rule where each factor needs a chain: "
                "$3e^{3x}\\sin(x^2) + e^{3x}\\cos(x^2) \\cdot 2x$.\n\n"
                "Drill this node in Practice until the inner factor is automatic."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C109": {
        "summary": "Implicit differentiation: dy/dx from a relation F(x, y) = 0 without solving for y.",
        "steps": [
            (L, "The idea", (
                "A curve like $x^2 + y^2 = 25$ defines $y$ as a function of $x$ locally, even if solving for $y$ "
                "is ugly or impossible. Differentiate BOTH sides with respect to $x$, treating $y$ as $y(x)$ — so "
                "every $y$-term picks up a chain-rule factor $\\frac{dy}{dx}$:\n"
                "$$\\frac{d}{dx} y^2 = 2y \\frac{dy}{dx}, \\qquad \\frac{d}{dx} \\sin y = \\cos y \\, \\frac{dy}{dx}.$$\n\n"
                "Then collect the $\\frac{dy}{dx}$ terms and solve for them algebraically."
            )),
            (L, "The procedure", (
                "1. Differentiate both sides term by term ($x$-terms normally, $y$-terms with a $y'$ factor; "
                "mixed terms like $xy$ need the product rule: $(xy)' = y + xy'$).\n\n"
                "2. Move all $y'$ terms to one side, everything else to the other.\n\n"
                "3. Factor out $y'$ and divide.\n\n"
                "The result usually contains BOTH $x$ and $y$ — that is normal; a point on the curve supplies both "
                "coordinates."
            )),
            (E, "Worked example: circle and folium", (
                "Circle $x^2 + y^2 = 25$: $2x + 2y y' = 0 \\Rightarrow y' = -\\frac{x}{y}$. "
                "At $(3, 4)$ the tangent slope is $-\\frac{3}{4}$.\n\n"
                "Folium $x^3 + y^3 = 6xy$:\n"
                "$$3x^2 + 3y^2 y' = 6y + 6x y' \\;\\Rightarrow\\; y'(3y^2 - 6x) = 6y - 3x^2 "
                "\\;\\Rightarrow\\; y' = \\frac{2y - x^2}{y^2 - 2x}.$$\n\n"
                "At $(3, 3)$: $y' = \\frac{6 - 9}{9 - 6} = -1$."
            )),
            (P, "Pitfalls", (
                "1. Forgetting the $y'$ factor on $y$-terms — that is just differentiating a constant-looking "
                "letter, and everything downstream is wrong.\n\n"
                "2. Missing the product rule on $xy$ terms: $(xy)' \\ne x y'$; it is $y + x y'$.\n\n"
                "3. Differentiating the right side to $0$ out of habit when it isn't constant.\n\n"
                "4. 'Simplifying' the answer by substituting the original equation incorrectly — only substitute "
                "relations that actually hold on the curve."
            )),
            (K, "Check yourself", (
                "You should be able to: differentiate any polynomial relation implicitly, handle mixed terms with "
                "the product rule, and evaluate the slope at a given point on the curve.\n\n"
                "Self-test: for $\\sin(xy) = x$, find $y'$. "
                "($\\cos(xy)(y + xy') = 1 \\Rightarrow y' = \\frac{1 - y\\cos(xy)}{x \\cos(xy)}$.)\n\n"
                "This technique powers related rates (C111) — practice it now."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C110": {
        "summary": "The transcendental derivative vocabulary: exponential, logarithmic, and trigonometric derivatives.",
        "steps": [
            (L, "The vocabulary", (
                "Memorize this table cold — everything later assumes it:\n\n"
                "$$\\frac{d}{dx} e^x = e^x, \\quad \\frac{d}{dx} a^x = a^x \\ln a, \\quad \\frac{d}{dx} \\ln x = \\frac{1}{x}$$\n"
                "$$\\frac{d}{dx} \\sin x = \\cos x, \\quad \\frac{d}{dx} \\cos x = -\\sin x, \\quad \\frac{d}{dx} \\tan x = \\sec^2 x$$\n"
                "$$\\frac{d}{dx} \\sec x = \\sec x \\tan x, \\quad \\frac{d}{dx} \\arctan x = \\frac{1}{1 + x^2}, \\quad \\frac{d}{dx} \\arcsin x = \\frac{1}{\\sqrt{1 - x^2}}$$\n\n"
                "The sign pattern: derivatives of co-functions ($\\cos$, $\\cot$, $\\csc$) carry the minus."
            )),
            (L, "Composing with the chain rule", (
                "In practice every entry appears composed:\n"
                "$$\\frac{d}{dx} e^{g(x)} = e^{g(x)} g'(x), \\qquad \\frac{d}{dx} \\ln(g(x)) = \\frac{g'(x)}{g(x)}.$$\n\n"
                "Logarithmic differentiation handles products of powers and variable exponents: for $y = x^x$, "
                "take $\\ln y = x \\ln x$, differentiate implicitly: $\\frac{y'}{y} = \\ln x + 1$, so "
                "$y' = x^x(\\ln x + 1)$."
            )),
            (E, "Worked example", (
                "Differentiate $f(x) = e^{2x} \\cos(3x)$.\n\n"
                "Product rule with chain rules inside each factor:\n"
                "$$f'(x) = 2e^{2x} \\cos(3x) + e^{2x} \\cdot (-\\sin(3x)) \\cdot 3 = e^{2x}\\left(2\\cos 3x - 3 \\sin 3x\\right).$$\n\n"
                "And one log: $\\dfrac{d}{dx} \\ln(x^2 + 1) = \\dfrac{2x}{x^2 + 1}$ — no absolute value needed "
                "since $x^2 + 1 > 0$."
            )),
            (P, "Pitfalls", (
                "1. $\\frac{d}{dx} 2^x = x \\cdot 2^{x-1}$ — power-rule abuse on a variable exponent. The correct "
                "answer carries $\\ln 2$.\n\n"
                "2. Losing the minus on $\\cos' = -\\sin$ (and gaining phantom minuses on $\\sin' = \\cos$).\n\n"
                "3. $\\frac{d}{dx} \\ln(g) = \\frac{1}{g}$ without the $g'$ — the chain rule does not take "
                "holidays.\n\n"
                "4. Degrees vs radians: the clean formulas $\\sin' = \\cos$ are RADIAN facts. In degrees a factor "
                "$\\frac{\\pi}{180}$ appears and every physics answer goes wrong."
            )),
            (K, "Check yourself", (
                "You should be able to: reproduce the table from memory, compose each entry with the chain rule, "
                "and use logarithmic differentiation for variable exponents.\n\n"
                "Self-test: $\\dfrac{d}{dx} \\arctan(2x)$. "
                "($\\frac{2}{1 + 4x^2}$ — the inner derivative rides on top.)\n\n"
                "Practice until the table is reflex; C2xx integration inverts every one of these."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C111": {
        "summary": "Related rates: linking two changing quantities through a constraint equation and differentiating in time.",
        "steps": [
            (L, "The method", (
                "Two quantities tied by a geometric or physical constraint change together. The method:\n\n"
                "1. Draw the situation; name every changing quantity as a FUNCTION OF TIME.\n"
                "2. Write the constraint equation relating the quantities (Pythagoras, similar triangles, volume "
                "formulas...).\n"
                "3. Differentiate the equation with respect to $t$ (implicit differentiation — every variable "
                "carries a $\\frac{d}{dt}$).\n"
                "4. Substitute the KNOWN snapshot values and rates, then solve for the unknown rate.\n\n"
                "The cardinal rule: differentiate FIRST, substitute numbers SECOND."
            )),
            (L, "Reading the problem", (
                "Rates hide in prose: 'the radius grows at 2 cm/s' is $\\frac{dr}{dt} = 2$; 'how fast is the area "
                "changing' asks for $\\frac{dA}{dt}$; 'shrinking' and 'draining' mean NEGATIVE rates.\n\n"
                "Snapshot values ('when the radius is 5') are instants — they describe one moment, not the whole "
                "motion, which is exactly why substituting them before differentiating destroys the problem: it "
                "freezes a changing quantity into a constant."
            )),
            (E, "Worked example: the sliding ladder", (
                "A 10 ft ladder leans on a wall; the base slides away at 3 ft/s. How fast does the top slide down "
                "when the base is 6 ft out?\n\n"
                "Constraint: $x^2 + y^2 = 100$. Differentiate in $t$: $2x \\frac{dx}{dt} + 2y \\frac{dy}{dt} = 0$.\n\n"
                "Snapshot: $x = 6 \\Rightarrow y = 8$, and $\\frac{dx}{dt} = 3$:\n"
                "$$2(6)(3) + 2(8) \\frac{dy}{dt} = 0 \\Rightarrow \\frac{dy}{dt} = -\\frac{36}{16} = -2.25 \\text{ ft/s}.$$\n\n"
                "Negative = downward, as expected. Units check: ft/s. Sanity check: sign and magnitude plausible."
            )),
            (P, "Pitfalls", (
                "1. Substituting the snapshot before differentiating — the #1 structural error; the changing "
                "quantity becomes a constant with derivative 0.\n\n"
                "2. Sign errors: distances shrinking, water draining, cars approaching all carry negative rates.\n\n"
                "3. Using a formula with two coupled variables without eliminating one (cone problems: use similar "
                "triangles to write $r$ in terms of $h$ BEFORE differentiating, or use the product rule "
                "honestly).\n\n"
                "4. Answering the wrong question — re-read whether the ask is $\\frac{dA}{dt}$, $\\frac{dr}{dt}$, "
                "or something else entirely."
            )),
            (K, "Check yourself", (
                "You should be able to: set up the constraint, differentiate in time, substitute a snapshot, and "
                "interpret sign and units.\n\n"
                "Self-test: a spherical balloon inflates at $\\frac{dV}{dt} = 100$ cm³/s. How fast is $r$ growing "
                "when $r = 5$? ($V = \\frac{4}{3}\\pi r^3 \\Rightarrow 100 = 4\\pi r^2 \\frac{dr}{dt} "
                "\\Rightarrow \\frac{dr}{dt} = \\frac{1}{\\pi}$ cm/s.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C112": {
        "summary": "Linear approximation and differentials: the tangent line as a local stand-in for the function.",
        "steps": [
            (L, "The tangent line as approximation", (
                "Near $x = a$, the function and its tangent line are nearly indistinguishable:\n"
                "$$f(x) \\approx L(x) = f(a) + f'(a)(x - a).$$\n\n"
                "This is the whole idea of differential calculus in one line: locally, every differentiable "
                "function is a line. Choose $a$ where $f$ and $f'$ are easy to evaluate exactly, close to the "
                "point you care about."
            )),
            (L, "Differentials", (
                "Write $dy = f'(x)\\, dx$: for a small input change $dx$, the OUTPUT changes by approximately "
                "$dy$. It is the same tangent-line statement in increment form, and it powers error propagation: "
                "a measurement error $dx$ in the input produces an error of about $f'(x) dx$ in any computed "
                "quantity.\n\n"
                "Relative error version: $\\frac{dy}{y} = \\frac{f'(x)}{f(x)} dx$, which for powers $y = x^n$ "
                "gives the useful rule $\\frac{dy}{y} = n \\frac{dx}{x}$: relative errors scale by the exponent."
            )),
            (E, "Worked example: estimating a root", (
                "Estimate $\\sqrt{4.1}$ with $f(x) = \\sqrt{x}$, $a = 4$.\n\n"
                "$f(4) = 2$, $f'(x) = \\frac{1}{2\\sqrt{x}}$, $f'(4) = \\frac{1}{4}$.\n\n"
                "$$\\sqrt{4.1} \\approx 2 + \\tfrac{1}{4}(0.1) = 2.025.$$\n\n"
                "(True value $2.02485...$ — the tangent line overshoots by $0.00015$ because $\\sqrt{x}$ is "
                "concave down, so the tangent sits ABOVE the curve. Concavity even predicts the error's sign.)"
            )),
            (P, "Pitfalls", (
                "1. Choosing a bad base point: approximating $\\sqrt{4.1}$ from $a = 1$ is technically a tangent "
                "line and practically useless — $a$ must be NEAR the target.\n\n"
                "2. Plugging the target into $f'$ instead of the base: it is $f'(a)$, not $f'(x)$.\n\n"
                "3. Treating $dy$ as exact. It is first-order; the error grows with $|x - a|^2$ and with "
                "curvature (C216 quantifies this with Taylor remainders).\n\n"
                "4. Dropping units in error-propagation problems — $dy$ inherits $f$'s units."
            )),
            (K, "Check yourself", (
                "You should be able to: build $L(x)$ at a convenient base point, estimate nearby values, propagate "
                "small errors with differentials, and use concavity to predict over/underestimate.\n\n"
                "Self-test: estimate $\\ln(1.05)$. (Base $a=1$: $L(x) = x - 1$, so $\\approx 0.05$; true "
                "$0.04879$, overestimate since $\\ln$ is concave down.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C113": {
        "summary": "Critical points, the extreme value theorem, and the mean value theorem.",
        "steps": [
            (L, "Critical points and the EVT", (
                "A critical point of $f$ is an interior point where $f'(x) = 0$ or $f'(x)$ does not exist. "
                "Fermat's theorem: interior extrema can only happen at critical points.\n\n"
                "Extreme value theorem: a CONTINUOUS function on a CLOSED interval $[a, b]$ attains an absolute "
                "max and min. The closed-interval recipe follows:\n\n"
                "1. Find critical points inside $(a,b)$.\n"
                "2. Evaluate $f$ at the critical points AND both endpoints.\n"
                "3. Largest value wins, smallest loses. No derivative tests needed."
            )),
            (L, "The mean value theorem", (
                "MVT: if $f$ is continuous on $[a,b]$ and differentiable on $(a,b)$, there is a $c$ in $(a,b)$ "
                "with\n"
                "$$f'(c) = \\frac{f(b) - f(a)}{b - a}.$$\n\n"
                "Somewhere, instantaneous rate equals average rate: on any trip averaging 60 mph, at some instant "
                "you were doing exactly 60.\n\n"
                "Its consequences run the rest of the course: $f' = 0$ on an interval $\\Rightarrow f$ constant; "
                "$f' > 0 \\Rightarrow f$ increasing; two functions with the same derivative differ by a constant "
                "(the '+C' of C116)."
            )),
            (E, "Worked example: closed-interval method", (
                "Absolute extrema of $f(x) = x^3 - 3x + 1$ on $[0, 2]$.\n\n"
                "$f'(x) = 3x^2 - 3 = 0 \\Rightarrow x = \\pm 1$; only $x = 1$ lies in $(0,2)$.\n\n"
                "Evaluate: $f(0) = 1$, $f(1) = -1$, $f(2) = 3$.\n\n"
                "Absolute max $3$ at $x = 2$; absolute min $-1$ at $x = 1$. Note the interior critical point took "
                "the min while an ENDPOINT took the max — endpoints are full contenders."
            )),
            (P, "Pitfalls", (
                "1. Forgetting endpoints in the closed-interval method — the most common lost point in this "
                "topic.\n\n"
                "2. Assuming every critical point is an extremum: $f(x) = x^3$ has $f'(0) = 0$ and no extremum "
                "at $0$.\n\n"
                "3. Applying the EVT or MVT without their hypotheses: $\\frac{1}{x}$ on $[-1, 1]$ satisfies "
                "neither conclusion — the discontinuity at $0$ voids both.\n\n"
                "4. Ignoring points where $f'$ fails to exist: $|x|$ on $[-1, 2]$ has its minimum at the corner "
                "$x = 0$, which never solves $f' = 0$."
            )),
            (K, "Check yourself", (
                "You should be able to: find critical points (both kinds), run the closed-interval method, state "
                "MVT hypotheses precisely, and find the guaranteed $c$.\n\n"
                "Self-test: for $f(x) = x^2$ on $[1, 3]$, find the MVT's $c$. "
                "(Average slope $= \\frac{9-1}{2} = 4 = 2c \\Rightarrow c = 2$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C114": {
        "summary": "Curve analysis: first and second derivative tests, concavity, and inflection points.",
        "steps": [
            (L, "What f' says", (
                "Sign chart of $f'$: where $f' > 0$, $f$ increases; where $f' < 0$, $f$ decreases.\n\n"
                "First derivative test at a critical point $c$: $f'$ changing $+ \\to -$ makes a local max; "
                "$- \\to +$ a local min; no sign change, no extremum (e.g. $x^3$ at $0$).\n\n"
                "Build the chart from the factored derivative: mark every zero and undefined point, test one "
                "sample per interval, and the entire increasing/decreasing story falls out."
            )),
            (L, "What f'' says", (
                "$f'' > 0$: concave up (graph holds water, tangents sit below). $f'' < 0$: concave down. "
                "An inflection point is where concavity actually CHANGES (not merely where $f'' = 0$).\n\n"
                "Second derivative test at a critical point with $f'(c) = 0$: $f''(c) > 0$ means local min, "
                "$f''(c) < 0$ means local max, $f''(c) = 0$ is INCONCLUSIVE — fall back to the first-derivative "
                "test ($x^4$, $-x^4$, $x^3$ all have $f''(0) = 0$ with three different behaviors)."
            )),
            (E, "Worked example: full analysis", (
                "Analyze $f(x) = x^4 - 4x^3$.\n\n"
                "$f'(x) = 4x^3 - 12x^2 = 4x^2(x - 3)$: critical points $0, 3$. Sign of $f'$: negative on "
                "$(-\\infty, 0)$, negative on $(0, 3)$, positive on $(3, \\infty)$ — so NO extremum at $0$ "
                "(no sign change) and a local min at $3$, $f(3) = -27$.\n\n"
                "$f''(x) = 12x^2 - 24x = 12x(x-2)$: concave up on $(-\\infty,0)$, down on $(0,2)$, up on "
                "$(2,\\infty)$ — inflection points at $x = 0$ and $x = 2$."
            )),
            (P, "Pitfalls", (
                "1. '$f''(c) = 0$ so $c$ is an inflection point' — only if concavity CHANGES there ($x^4$ has "
                "$f''(0) = 0$ and no inflection).\n\n"
                "2. Reading the sign chart of $f'$ as the sign chart of $f$ — they answer different questions.\n\n"
                "3. Second-derivative test on a point where $f' \\ne 0$: the test only applies AT critical "
                "points.\n\n"
                "4. Forgetting even-multiplicity zeros of $f'$ do not change sign (the $4x^2$ factor above) — "
                "that is exactly the no-extremum case."
            )),
            (K, "Check yourself", (
                "You should be able to: build sign charts for $f'$ and $f''$, classify every critical point two "
                "ways, and locate genuine inflection points.\n\n"
                "Self-test: classify the critical points of $f(x) = x e^{-x}$. "
                "($f' = (1 - x)e^{-x}$: single critical point $x = 1$, sign $+ \\to -$, local (and absolute) max.)"
                "\n\nPractice the node; curve-analysis problems are graded step by step."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C115": {
        "summary": "Optimization: modeling applied max-min problems and solving them with the calculus toolkit.",
        "steps": [
            (L, "The modeling recipe", (
                "1. Draw and name: variables for every quantity that can change.\n"
                "2. Write the OBJECTIVE — the quantity to maximize or minimize — as a formula.\n"
                "3. Use the CONSTRAINT to eliminate variables until the objective has one variable.\n"
                "4. Identify the DOMAIN the physical situation allows (often a closed interval).\n"
                "5. Optimize with the closed-interval method or derivative tests.\n"
                "6. Answer the actual question, with units, and sanity-check it.\n\n"
                "Steps 1-4 are where problems are won; the calculus in step 5 is usually routine."
            )),
            (L, "Open intervals and verification", (
                "When the domain is open or infinite, endpoints cannot rescue you: verify the critical point is "
                "the global optimum. Standard arguments: the first-derivative sign pattern ($- \\to +$ around the "
                "only critical point $\\Rightarrow$ global min), or noting the objective blows up at both ends of "
                "the domain so the single interior critical point must be the min.\n\n"
                "Never skip verification — graders and reality both check it."
            )),
            (E, "Worked example: the fence", (
                "A farmer has 200 m of fence for a rectangular pen against a river (no fence on the river side). "
                "Maximize the area.\n\n"
                "Variables: width $x$ (two sides), length $y$ (one side). Constraint: $2x + y = 200$, so "
                "$y = 200 - 2x$.\n\n"
                "Objective: $A(x) = x(200 - 2x) = 200x - 2x^2$ on $(0, 100)$.\n\n"
                "$A'(x) = 200 - 4x = 0 \\Rightarrow x = 50$, $A'' = -4 < 0$: max. Then $y = 100$ and "
                "$A = 5000$ m². Note the classic pattern: the single fenced side gets double the length."
            )),
            (P, "Pitfalls", (
                "1. Optimizing the constraint instead of the objective (maximizing perimeter when asked for "
                "area, or vice versa).\n\n"
                "2. Forgetting the physical domain: a negative width critical point is meaningless; endpoint "
                "cases (degenerate rectangles) can matter.\n\n"
                "3. Stopping at the critical value of $x$ when the question asks for the AREA, the DIMENSIONS, "
                "or the COST.\n\n"
                "4. Distance problems: minimize the SQUARED distance — same optimizer, far less algebra; forgetting "
                "this buries you in square-root derivatives."
            )),
            (K, "Check yourself", (
                "You should be able to: translate prose to objective + constraint, reduce to one variable, "
                "optimize, verify globality, and answer with units.\n\n"
                "Self-test: which point on $y = \\sqrt{x}$ is closest to $(3, 0)$? "
                "(Minimize $D = (x-3)^2 + x$: $D' = 2x - 6 + 1 = 0 \\Rightarrow x = \\frac{5}{2}$, point "
                "$(\\frac{5}{2}, \\sqrt{5/2})$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C116": {
        "summary": "Antiderivatives: reversing differentiation, the +C, and basic initial-value problems.",
        "steps": [
            (L, "Reversing the derivative", (
                "$F$ is an antiderivative of $f$ when $F' = f$. By the MVT corollary, any two antiderivatives "
                "differ by a constant, so the GENERAL antiderivative is one particular $F$ plus $C$:\n"
                "$$\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C \\;(n \\ne -1), \\qquad \\int \\frac{1}{x}\\, dx = \\ln|x| + C,$$\n"
                "$$\\int e^x dx = e^x + C, \\quad \\int \\cos x \\, dx = \\sin x + C, \\quad \\int \\sin x \\, dx = -\\cos x + C.$$\n\n"
                "Every derivative fact from C107-C110 reads backwards as an integral fact."
            )),
            (L, "Initial value problems", (
                "The $+C$ is a whole family of parallel curves; one data point picks the member. Given "
                "$f'(x) = 3x^2$ and $f(1) = 5$: $f(x) = x^3 + C$, and $1 + C = 5$ gives $C = 4$.\n\n"
                "Physics chains these: acceleration $\\to$ velocity $\\to$ position takes TWO antiderivatives and "
                "TWO conditions. With $a = -9.8$, $v(0) = v_0$, $s(0) = s_0$:\n"
                "$$v(t) = -9.8t + v_0, \\qquad s(t) = -4.9t^2 + v_0 t + s_0.$$"
            )),
            (E, "Worked example", (
                "Find $f$ with $f'(x) = 6x^2 - 4x + 1$ and $f(2) = 3$.\n\n"
                "Antidifferentiate term by term: $f(x) = 2x^3 - 2x^2 + x + C$.\n\n"
                "Apply the condition: $f(2) = 16 - 8 + 2 + C = 10 + C = 3 \\Rightarrow C = -7$.\n\n"
                "$$f(x) = 2x^3 - 2x^2 + x - 7.$$\n\n"
                "Verify by differentiating — ten seconds that catches most errors."
            )),
            (P, "Pitfalls", (
                "1. Dropping $+C$ — and in IVPs, that constant IS the answer's whole point.\n\n"
                "2. Reverse power rule on $n = -1$: $\\int x^{-1} dx$ is $\\ln|x| + C$, not $\\frac{x^0}{0}$.\n\n"
                "3. Sign flips on trig: $\\int \\sin = -\\cos + C$ (the minus migrates when integrating).\n\n"
                "4. Antidifferentiating products or quotients term-by-term — there is no product rule for "
                "integrals; that is what C201/C202 techniques are for.\n\n"
                "5. Using ONE $C$ across two integrations in kinematics — each integration gets its own constant."
            )),
            (K, "Check yourself", (
                "You should be able to: reverse the basic table, solve one- and two-step IVPs, and verify by "
                "differentiating.\n\n"
                "Self-test: $\\int \\left(2e^x + \\sec^2 x - \\frac{3}{x}\\right) dx$. "
                "($2e^x + \\tan x - 3\\ln|x| + C$.)\n\nPractice the node — it is the gateway to all of C117-C118."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C117": {
        "summary": "Riemann sums and the definite integral: area under a curve as a limit of sums.",
        "steps": [
            (L, "Approximating area with rectangles", (
                "Slice $[a, b]$ into $n$ strips of width $\\Delta x = \\frac{b-a}{n}$; on each strip erect a "
                "rectangle whose height samples $f$ (left endpoint, right endpoint, or midpoint). The Riemann sum\n"
                "$$\\sum_{i=1}^{n} f(x_i^*) \\, \\Delta x$$\n"
                "approximates the area between the curve and the axis. For increasing $f$, left sums under-count "
                "and right sums over-count — the true area is squeezed between them."
            )),
            (L, "The definite integral", (
                "The definite integral is the limit as the slicing refines:\n"
                "$$\\int_a^b f(x)\\, dx = \\lim_{n \\to \\infty} \\sum_{i=1}^n f(x_i^*)\\, \\Delta x.$$\n\n"
                "It is SIGNED area: pieces below the axis count negative. Properties fall out of the sum picture: "
                "linearity, additivity over adjacent intervals ($\\int_a^b + \\int_b^c = \\int_a^c$), and "
                "$\\int_a^a = 0$, $\\int_b^a = -\\int_a^b$.\n\n"
                "Some integrals are pure geometry: $\\int_0^r \\sqrt{r^2 - x^2}\\, dx = \\frac{\\pi r^2}{4}$ "
                "(quarter circle) needs no antiderivative at all."
            )),
            (E, "Worked example: a right Riemann sum", (
                "Approximate $\\int_0^2 x^2 dx$ with $n = 4$ right rectangles.\n\n"
                "$\\Delta x = 0.5$; right endpoints $0.5, 1, 1.5, 2$; heights $0.25, 1, 2.25, 4$.\n\n"
                "$$R_4 = 0.5(0.25 + 1 + 2.25 + 4) = 3.75.$$\n\n"
                "True value $\\frac{8}{3} \\approx 2.667$ — the overshoot is expected ($x^2$ increases on "
                "$[0,2]$). $L_4 = 0.5(0 + 0.25 + 1 + 2.25) = 1.75$ undershoots; the integral sits between."
            )),
            (P, "Pitfalls", (
                "1. Treating the integral as raw area when the function dips below the axis — "
                "$\\int_0^{2\\pi} \\sin x \\, dx = 0$, not $4$.\n\n"
                "2. Off-by-one endpoint errors: with $n$ strips, right sums use $x_1..x_n$, left sums "
                "$x_0..x_{n-1}$ — never both endpoints in the same sum.\n\n"
                "3. Forgetting the $\\Delta x$ factor entirely (summing heights, not areas).\n\n"
                "4. Believing more rectangles is the practical way to integrate — the point of the FTC (C118) is "
                "precisely to escape this."
            )),
            (K, "Check yourself", (
                "You should be able to: set up left/right/midpoint sums, predict over/undershoot from monotonicity, "
                "use signed-area reasoning, and exploit geometry when the region is a known shape.\n\n"
                "Self-test: evaluate $\\int_{-3}^{3} (2 + \\sqrt{9 - x^2})\\, dx$ by geometry. "
                "(Rectangle $12$ + semicircle $\\frac{9\\pi}{2}$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C118": {
        "summary": "The fundamental theorem of calculus, both parts: evaluation, and derivatives of accumulation functions.",
        "steps": [
            (L, "Part 2: evaluation", (
                "If $F' = f$ on $[a, b]$, then\n"
                "$$\\int_a^b f(x)\\, dx = F(b) - F(a).$$\n\n"
                "This is the bridge between C116 and C117: the limit-of-sums integral equals a difference of "
                "antiderivative values. No $+C$ is needed — it cancels in the subtraction.\n\n"
                "Example: $\\int_0^2 x^2 dx = \\frac{x^3}{3}\\Big|_0^2 = \\frac{8}{3}$, the exact value the "
                "Riemann sums in C117 were crawling toward."
            )),
            (L, "Part 1: the accumulation function", (
                "Define $g(x) = \\int_a^x f(t)\\, dt$ — area accumulated from $a$ up to a moving endpoint. Then\n"
                "$$g'(x) = f(x):$$\n"
                "differentiation undoes accumulation. With a function upper limit, the chain rule joins in:\n"
                "$$\\frac{d}{dx} \\int_a^{u(x)} f(t)\\, dt = f(u(x)) \\cdot u'(x),$$\n"
                "and a two-sided variable integral splits through a constant midpoint first."
            )),
            (E, "Worked example: both parts", (
                "Part 2: $\\int_1^4 \\left(3\\sqrt{x} - \\frac{2}{x}\\right) dx = "
                "\\left[2x^{3/2} - 2\\ln|x|\\right]_1^4 = (16 - 2\\ln 4) - (2 - 0) = 14 - 4\\ln 2.$\n\n"
                "Part 1: $\\dfrac{d}{dx} \\int_2^{x^3} \\cos(t^2)\\, dt = \\cos(x^6) \\cdot 3x^2$ — evaluate the "
                "integrand at the upper limit, multiply by its derivative. No antiderivative of $\\cos(t^2)$ "
                "exists in elementary terms, and none is needed."
            )),
            (P, "Pitfalls", (
                "1. Evaluating $F(b) - F(a)$ in the wrong order, or distributing a minus across $F(a)$'s terms "
                "incorrectly — bracket the whole $F(a)$.\n\n"
                "2. Applying Part 2 across a discontinuity: $\\int_{-1}^1 \\frac{dx}{x^2} \\ne "
                "\\left[-\\frac{1}{x}\\right]_{-1}^1 = -2$ (a positive function cannot integrate to a negative; "
                "the integral is actually divergent — C206).\n\n"
                "3. Part 1 without the chain rule on a function limit — the $u'(x)$ factor.\n\n"
                "4. Trying to FIND an antiderivative of the integrand in Part 1 problems: the theorem exists so "
                "you don't have to."
            )),
            (K, "Check yourself", (
                "You should be able to: evaluate definite integrals via antiderivatives, differentiate accumulation "
                "functions with constant and variable limits, and spot when Part 2's hypotheses fail.\n\n"
                "Self-test: $\\dfrac{d}{dx} \\int_{x}^{5} e^{t^2} dt$. "
                "(Flip the limits: $-e^{x^2}$.)\n\n"
                "Practice the node — this theorem is the hinge of the whole course."
            )),
        ],
    },
}
