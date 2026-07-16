"""Coursework: elementary algebra skill nodes ALG.1-ALG.6.

Five steps per lesson: two readings, a worked example, pitfalls, check.
"""

L = "reading"
E = "example"
P = "pitfall"
K = "check"

LESSONS: dict[str, dict] = {
    # ------------------------------------------------------------------
    "ALG.1": {
        "summary": "Integers and order of operations: signed arithmetic and the PEMDAS conventions.",
        "steps": [
            (L, "Signed arithmetic", (
                "The integers extend counting numbers with 0 and negatives. The sign rules:\n\n"
                "• Adding a negative = subtracting: $5 + (-3) = 2$.\n"
                "• Subtracting a negative = adding: $5 - (-3) = 8$.\n"
                "• Multiplication/division: same signs → positive, opposite signs → negative: "
                "$(-4)(-3) = 12$, $(-4)(3) = -12$.\n\n"
                "Number-line picture: adding moves right, subtracting moves left, and a negative sign "
                "reverses the direction. $|x|$ is the distance from 0, always $\\ge 0$."
            )),
            (L, "Order of operations", (
                "The convention (PEMDAS/GEMS): Parentheses/grouping first, then Exponents, then "
                "Multiplication AND Division left to right, then Addition AND Subtraction left to right.\n\n"
                "The two 'AND's matter: M and D are the SAME tier, processed left-to-right — "
                "$8 \\div 2 \\times 4 = 16$, not 1. Same for A and S.\n\n"
                "Grouping symbols include fraction bars and radicals: in $\\frac{6 + 4}{2}$, the bar "
                "groups the top BEFORE dividing."
            )),
            (E, "Worked example", (
                "Evaluate $-3^2 + (-3)^2 - 2(4 - 7)$.\n\n"
                "• $-3^2 = -(3^2) = -9$ — the exponent binds before the minus sign.\n"
                "• $(-3)^2 = 9$ — the parentheses put the sign inside the square.\n"
                "• $4 - 7 = -3$, so $-2(-3) = +6$.\n\n"
                "$$-9 + 9 + 6 = 6.$$\n\n"
                "The whole problem is the $-3^2$ vs $(-3)^2$ distinction plus sign discipline."
            )),
            (P, "Pitfalls", (
                "1. $-3^2 = 9$ — no: exponent before negation; $-3^2 = -9$.\n\n"
                "2. Doing all multiplication before ANY division (they share a tier; go left to right).\n\n"
                "3. $5 - (-3)$ computed as $2$ — subtracting a negative adds.\n\n"
                "4. Dropping the fraction bar's implicit grouping: $\\frac{6+4}{2} \\ne 6 + \\frac 4 2$.\n\n"
                "5. Sign errors when distributing a minus: $-(a - b) = -a + b$, both terms flip."
            )),
            (K, "Check yourself", (
                "You should be able to: compute with all four operations on signed integers and evaluate "
                "any expression with correct precedence.\n\n"
                "Self-test: evaluate $12 \\div 3 \\cdot 2 - (-2)^3$. "
                "($4 \\cdot 2 - (-8) = 8 + 8 = 16$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "ALG.2": {
        "summary": "Fractions and decimals: the four operations, common denominators, and conversions.",
        "steps": [
            (L, "Fraction arithmetic", (
                "• ADD/SUBTRACT: need a common denominator — "
                "$\\frac a b \\pm \\frac c d = \\frac{ad \\pm bc}{bd}$ (or use the LCD to keep numbers small).\n"
                "• MULTIPLY: straight across — $\\frac a b \\cdot \\frac c d = \\frac{ac}{bd}$; no common "
                "denominator needed.\n"
                "• DIVIDE: multiply by the reciprocal — $\\frac a b \\div \\frac c d = \\frac a b \\cdot \\frac d c$.\n\n"
                "Always reduce: divide top and bottom by the gcd. A fraction is a DIVISION frozen in place — "
                "$\\frac 3 4$ means $3 \\div 4$."
            )),
            (L, "Decimals and conversions", (
                "Fraction → decimal: divide ($\\frac 3 8 = 0.375$). Terminating decimals come from "
                "denominators whose only prime factors are 2 and 5; everything else repeats "
                "($\\frac 1 3 = 0.\\overline{3}$).\n\n"
                "Decimal → fraction: put the digits over the right power of 10 and reduce "
                "($0.35 = \\frac{35}{100} = \\frac 7{20}$).\n\n"
                "Comparing fractions: common denominator, or convert to decimals — "
                "$\\frac 5 8 = 0.625 > \\frac 3 5 = 0.6$."
            )),
            (E, "Worked example", (
                "Compute $\\frac 2 3 + \\frac 3 4 \\div \\frac 9 8$.\n\n"
                "Division first (order of operations): "
                "$\\frac 3 4 \\div \\frac 9 8 = \\frac 3 4 \\cdot \\frac 8 9 = \\frac{24}{36} = \\frac 2 3$.\n\n"
                "Then $\\frac 2 3 + \\frac 2 3 = \\frac 4 3 = 1\\frac 1 3 \\approx 1.33$.\n\n"
                "Note the reduce-early habit: $\\frac{3 \\cdot 8}{4 \\cdot 9}$ cancels to "
                "$\\frac{1 \\cdot 2}{1 \\cdot 3}$ before any big multiplication."
            )),
            (P, "Pitfalls", (
                "1. Adding straight across: $\\frac 1 2 + \\frac 1 3 \\ne \\frac 2 5$ — common denominator "
                "first ($\\frac 5 6$).\n\n"
                "2. Common denominators for MULTIPLICATION (not needed, wastes work).\n\n"
                "3. Flipping the wrong fraction in division — reciprocal of the DIVISOR (second one).\n\n"
                "4. Decimal alignment errors when adding ($3.5 + 0.75$ needs place values lined up).\n\n"
                "5. Forgetting to reduce, or 'canceling' across addition: "
                "$\\frac{2 + 3}{2} \\ne 3$."
            )),
            (K, "Check yourself", (
                "You should be able to: run all four operations on fractions and decimals, convert both "
                "directions, and compare values fluently.\n\n"
                "Self-test: which is larger, $\\frac 7{12}$ or $0.6$? "
                "($\\frac 7{12} = 0.58\\overline 3 < 0.6$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "ALG.3": {
        "summary": "Combining like terms: recognizing like terms and simplifying expressions.",
        "steps": [
            (L, "What makes terms 'like'", (
                "A TERM is a product of a number (coefficient) and variables with exponents. Terms are LIKE "
                "when their variable parts match exactly — same letters, same exponents:\n\n"
                "• $3x$ and $-7x$: like. $3x$ and $3x^2$: NOT like. $2xy$ and $5yx$: like "
                "(order doesn't matter).\n\n"
                "Combining adds the coefficients and keeps the variable part: "
                "$3x + (-7x) = -4x$. Why it works: the distributive law in reverse — "
                "$3x - 7x = (3 - 7)x$."
            )),
            (L, "Simplifying multi-term expressions", (
                "Procedure: (1) identify each term WITH its sign, (2) group like terms, (3) add "
                "coefficients.\n\n"
                "$$5x^2 - 3x + 2 - 2x^2 + 7x - 9 \\;=\\; (5 - 2)x^2 + (-3 + 7)x + (2 - 9) \\;=\\; 3x^2 + 4x - 7.$$\n\n"
                "A bare variable has coefficient 1 ($x = 1x$); a constant term has no variable part and only "
                "combines with other constants. The sign TRAVELS with its term — rearranging "
                "$2 - 9$ as $-9 + 2$ is fine because the minus stayed attached to the 9."
            )),
            (E, "Worked example", (
                "Simplify $4a + 3b - a + 5 - 7b + 2a^2 - 3$.\n\n"
                "Group: $a$-terms $4a - a = 3a$; $b$-terms $3b - 7b = -4b$; constants $5 - 3 = 2$; the "
                "$2a^2$ has no partner and rides along.\n\n"
                "$$2a^2 + 3a - 4b + 2.$$\n\n"
                "Four unlike families, each collapsed independently — and $a^2$ never merged with $a$."
            )),
            (P, "Pitfalls", (
                "1. Combining $x$ with $x^2$ — different exponents are different species.\n\n"
                "2. Losing a sign while regrouping ($-3x$ becomes $3x$ mid-line).\n\n"
                "3. $3x + 4y = 7xy$ — unlike terms don't merge into a product.\n\n"
                "4. Forgetting the invisible coefficient: $x - x = 0$, not 'nothing left to say'; "
                "$x + x = 2x$, not $x^2$.\n\n"
                "5. Combining across an equals sign or inside un-expanded parentheses — simplify WITHIN one "
                "expression only."
            )),
            (K, "Check yourself", (
                "You should be able to: classify terms as like/unlike instantly and reduce any expression "
                "to its simplest collected form.\n\n"
                "Self-test: simplify $6m - 2n + m + 8n - 4$. ($7m + 6n - 4$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "ALG.4": {
        "summary": "One-step equations: solving with a single inverse operation, and checking.",
        "steps": [
            (L, "Equations and inverse operations", (
                "An equation asserts two expressions are equal; SOLVING finds the variable value that makes "
                "it true. The tool: apply the SAME inverse operation to BOTH sides (the balance principle).\n\n"
                "• $x + 7 = 12$: subtract 7 → $x = 5$.\n"
                "• $x - 4 = 9$: add 4 → $x = 13$.\n"
                "• $3x = 21$: divide by 3 → $x = 7$.\n"
                "• $\\frac x 5 = 4$: multiply by 5 → $x = 20$.\n\n"
                "One operation was done TO $x$; one inverse undoes it."
            )),
            (L, "Reading the equation, and checking", (
                "Ask: 'what is being done to $x$?' — that names the operation; its inverse is the move. "
                "Fractions as coefficients invert by multiplying by the reciprocal: "
                "$\\frac 2 3 x = 8 \\Rightarrow x = \\frac 3 2 \\cdot 8 = 12$.\n\n"
                "ALWAYS check by substituting back: a check costs five seconds and catches sign and "
                "arithmetic slips at the source. Solving is also the first place negative solutions feel "
                "strange — $x + 9 = 4 \\Rightarrow x = -5$ is perfectly fine."
            )),
            (E, "Worked example", (
                "Solve $-6x = 42$.\n\n"
                "The operation on $x$ is 'multiply by $-6$'; invert by dividing both sides by $-6$:\n"
                "$$x = \\frac{42}{-6} = -7.$$\n\n"
                "Check: $-6(-7) = 42$ ✓.\n\n"
                "Contrast with $-x = 42$ (coefficient $-1$): divide by $-1$, so $x = -42$ — 'drop the "
                "minus by flipping both sides' is the same move."
            )),
            (P, "Pitfalls", (
                "1. Doing the operation to one side only — the balance breaks.\n\n"
                "2. Using the operation instead of its inverse (adding 7 to solve $x + 7 = 12$).\n\n"
                "3. Sign errors dividing by negatives: $-6x = 42$ gives $-7$, not $7$.\n\n"
                "4. $\\frac x 5 = 4$ 'solved' by dividing by 5 — that operation is already division; "
                "multiply.\n\n"
                "5. Skipping the substitution check."
            )),
            (K, "Check yourself", (
                "You should be able to: name the operation acting on $x$, apply its inverse to both sides, "
                "and verify by substitution.\n\n"
                "Self-test: solve $\\frac 3 4 x = -9$. ($x = -12$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "ALG.5": {
        "summary": "Two-step equations: undoing operations in reverse order.",
        "steps": [
            (L, "The reverse-order principle", (
                "$2x + 3 = 11$ was BUILT by multiplying $x$ by 2, then adding 3. To solve, UNDO in reverse "
                "order — last operation first:\n\n"
                "1. Subtract 3: $2x = 8$.\n"
                "2. Divide by 2: $x = 4$.\n\n"
                "Think of wrapping a present: paper went on last, comes off first. Undoing addition before "
                "multiplication keeps the arithmetic clean; the other order works but forces fractions "
                "early ($x + \\frac 3 2 = \\frac{11}{2}$)."
            )),
            (L, "Variations", (
                "• Negative coefficients: $5 - 2x = 11 \\Rightarrow -2x = 6 \\Rightarrow x = -3$ — the "
                "coefficient is $-2$, and the final division flips the sign.\n"
                "• Fraction forms: $\\frac{x}{3} - 4 = 2 \\Rightarrow \\frac x 3 = 6 \\Rightarrow x = 18$.\n"
                "• Grouped forms: $\\frac{x + 5}{2} = 7$ — the bar groups, so multiply by 2 FIRST "
                "($x + 5 = 14$), then subtract.\n\n"
                "In every case: identify the two operations, peel them off outside-in."
            )),
            (E, "Worked example", (
                "Solve $\\frac{2x}{5} + 1 = -3$.\n\n"
                "1. Subtract 1: $\\frac{2x}{5} = -4$.\n"
                "2. Multiply by 5: $2x = -20$.\n"
                "3. Divide by 2: $x = -10$.\n\n"
                "(Steps 2-3 collapse into one 'multiply by $\\frac 5 2$' once fraction-coefficient fluency "
                "arrives.) Check: $\\frac{2(-10)}{5} + 1 = -4 + 1 = -3$ ✓."
            )),
            (P, "Pitfalls", (
                "1. Undoing in build order (dividing before subtracting on $2x + 3 = 11$) and then mangling "
                "the fraction arithmetic.\n\n"
                "2. $5 - 2x = 11$: subtracting 5 correctly but losing the minus on $-2x$.\n\n"
                "3. Dividing only one term by the coefficient: from $2x = 8$, both SIDES divide, and if the "
                "side has two terms, BOTH terms divide.\n\n"
                "4. Grouped fractions un-grouped: $\\frac{x+5}{2} = 7$ is not $x + \\frac 5 2 = 7$.\n\n"
                "5. Arithmetic with the check skipped — two-step slips hide well."
            )),
            (K, "Check yourself", (
                "You should be able to: peel two operations in reverse order, handle negative and fractional "
                "coefficients, and check every answer.\n\n"
                "Self-test: solve $7 - 3x = 22$. ($-3x = 15$, $x = -5$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "ALG.6": {
        "summary": "Linear equations with distribution: expanding, collecting variables on one side, and the special cases.",
        "steps": [
            (L, "The full pipeline", (
                "For equations like $3(x - 4) = 2x + 1$:\n\n"
                "1. DISTRIBUTE to clear parentheses: $3x - 12 = 2x + 1$.\n"
                "2. COLLECT like terms on each side separately.\n"
                "3. Move all variable terms to one side, constants to the other (add/subtract across): "
                "$3x - 2x = 1 + 12$.\n"
                "4. Combine and divide: $x = 13$.\n\n"
                "Distribution multiplies the outside number into EVERY inside term, signs included: "
                "$-2(3x - 5) = -6x + 10$."
            )),
            (L, "Special cases: none and all", (
                "Sometimes the variables cancel entirely:\n\n"
                "• $2(x + 3) = 2x + 6 \\Rightarrow 6 = 6$ — TRUE for every $x$: infinitely many solutions "
                "(an identity).\n"
                "• $2(x + 3) = 2x + 5 \\Rightarrow 6 = 5$ — FALSE always: no solution.\n\n"
                "A vanished variable is not an error; read the leftover statement. "
                "True → all reals; false → empty.\n\n"
                "Fractions clear by multiplying through by the LCD before distributing — "
                "$\\frac{x}{2} + \\frac{x}{3} = 5$ becomes $3x + 2x = 30$."
            )),
            (E, "Worked example", (
                "Solve $4(2x - 1) - 3(x + 2) = 2(x + 4)$.\n\n"
                "Distribute: $8x - 4 - 3x - 6 = 2x + 8$ — note $-3$ hit BOTH the $x$ and the $2$.\n"
                "Collect left: $5x - 10 = 2x + 8$.\n"
                "Variables left, constants right: $3x = 18$, so $x = 6$.\n\n"
                "Check: LHS $= 4(11) - 3(8) = 44 - 24 = 20$; RHS $= 2(10) = 20$ ✓."
            )),
            (P, "Pitfalls", (
                "1. Distributing to the first term only: $3(x - 4) \\ne 3x - 4$.\n\n"
                "2. Negative distribution sign errors: $-3(x + 2) = -3x - 6$, both negative.\n\n"
                "3. Moving a term across '=' without flipping its sign.\n\n"
                "4. Panic when $x$ cancels — read the residual truth value instead.\n\n"
                "5. LCD-clearing that skips a term (the constant on the right must be multiplied too).\n\n"
                "6. Dividing both sides by an expression containing $x$ (can silently discard a solution)."
            )),
            (K, "Check yourself", (
                "You should be able to: distribute with signs, run the collect-and-isolate pipeline, "
                "recognize identity/no-solution cases, and clear fractions by the LCD.\n\n"
                "Self-test: solve $5(x - 2) = 5x + 3$. (Distribute: $5x - 10 = 5x + 3$ → $-10 = 3$: "
                "no solution.)\n\nPractice the node."
            )),
        ],
    },
}
