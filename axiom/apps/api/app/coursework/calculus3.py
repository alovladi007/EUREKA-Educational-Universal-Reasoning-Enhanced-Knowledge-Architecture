"""Coursework: Calculus III nodes C301-C316 (vectors through the big integral theorems).

Same five-step structure as calculus1/2: two readings, a worked example,
pitfalls, and a check step. Bodies use $...$ / $$...$$ TeX.
"""

L = "reading"
E = "example"
P = "pitfall"
K = "check"

LESSONS: dict[str, dict] = {
    # ------------------------------------------------------------------
    "C301": {
        "summary": "3D vectors, dot and cross products: projections, areas, and perpendicularity.",
        "steps": [
            (L, "Vectors and the dot product", (
                "A vector $\\mathbf{v} = \\langle v_1, v_2, v_3 \\rangle$ has length "
                "$|\\mathbf{v}| = \\sqrt{v_1^2 + v_2^2 + v_3^2}$. The dot product\n"
                "$$\\mathbf{a} \\cdot \\mathbf{b} = a_1 b_1 + a_2 b_2 + a_3 b_3 = |\\mathbf{a}||\\mathbf{b}|\\cos\\theta$$\n"
                "is a NUMBER that measures alignment: positive when the angle is acute, zero exactly at "
                "perpendicularity, negative when obtuse.\n\n"
                "Projection of $\\mathbf{a}$ onto $\\mathbf{b}$: "
                "$\\text{proj}_{\\mathbf{b}} \\mathbf{a} = \\dfrac{\\mathbf{a} \\cdot \\mathbf{b}}{|\\mathbf{b}|^2}\\, \\mathbf{b}$ — "
                "the shadow of $\\mathbf{a}$ along $\\mathbf{b}$'s direction."
            )),
            (L, "The cross product", (
                "The cross product $\\mathbf{a} \\times \\mathbf{b}$ (3D only) is a VECTOR, computed by the "
                "symbolic determinant\n"
                "$$\\mathbf{a} \\times \\mathbf{b} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ "
                "a_1 & a_2 & a_3 \\\\ b_1 & b_2 & b_3 \\end{vmatrix},$$\n"
                "perpendicular to both inputs (right-hand rule), with length "
                "$|\\mathbf{a} \\times \\mathbf{b}| = |\\mathbf{a}||\\mathbf{b}|\\sin\\theta$ = the area of the "
                "parallelogram they span.\n\n"
                "It is anticommutative: $\\mathbf{b} \\times \\mathbf{a} = -(\\mathbf{a} \\times \\mathbf{b})$. "
                "The scalar triple product $\\mathbf{a} \\cdot (\\mathbf{b} \\times \\mathbf{c})$ gives the "
                "parallelepiped volume (up to sign)."
            )),
            (E, "Worked example", (
                "Let $\\mathbf{a} = \\langle 1, 2, 2 \\rangle$, $\\mathbf{b} = \\langle 3, 0, 4 \\rangle$.\n\n"
                "Dot: $\\mathbf{a}\\cdot\\mathbf{b} = 3 + 0 + 8 = 11$; lengths $3$ and $5$, so "
                "$\\cos\\theta = \\frac{11}{15}$.\n\n"
                "Cross: $\\mathbf{a} \\times \\mathbf{b} = \\langle 2\\cdot 4 - 2\\cdot 0,\\; 2\\cdot 3 - 1\\cdot 4,\\; "
                "1\\cdot 0 - 2\\cdot 3 \\rangle = \\langle 8, 2, -6 \\rangle.$\n\n"
                "Check perpendicularity: $\\langle 8,2,-6\\rangle \\cdot \\langle 1,2,2\\rangle = 8 + 4 - 12 = 0$ ✓. "
                "Parallelogram area $= |\\langle 8,2,-6\\rangle| = \\sqrt{104} = 2\\sqrt{26}$."
            )),
            (P, "Pitfalls", (
                "1. Treating the dot product as a vector or the cross product as a number — the OUTPUT TYPE is "
                "the first thing to state.\n\n"
                "2. The middle component of the cross product carries a built-in minus from the cofactor "
                "expansion: $-(a_1 b_3 - a_3 b_1)$. Most cross-product errors live there.\n\n"
                "3. Using the cross product in 2D problems without embedding in 3D (set $z = 0$; the product "
                "points along $\\mathbf{k}$).\n\n"
                "4. Projection formula denominators: it is $|\\mathbf{b}|^2$ (the vector being projected ONTO), "
                "not $|\\mathbf{a}|^2$."
            )),
            (K, "Check yourself", (
                "You should be able to: compute dot and cross products, extract angles, areas, and projections, "
                "and test perpendicularity/parallelism instantly.\n\n"
                "Self-test: for which $t$ are $\\langle t, 2, 1\\rangle$ and $\\langle 4, t, -8 \\rangle$ "
                "perpendicular? ($4t + 2t - 8 = 0 \\Rightarrow t = \\frac{4}{3}$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C302": {
        "summary": "Parametric lines, plane equations, and the standard quadric surfaces.",
        "steps": [
            (L, "Lines in space", (
                "A line needs a point $P_0$ and a direction $\\mathbf{v}$:\n"
                "$$\\mathbf{r}(t) = \\mathbf{r}_0 + t\\,\\mathbf{v}, \\qquad "
                "x = x_0 + t v_1,\\; y = y_0 + t v_2,\\; z = z_0 + t v_3.$$\n\n"
                "Two lines in 3D can intersect, be parallel, or be SKEW (neither) — a genuinely 3D phenomenon. "
                "To test intersection, use DIFFERENT parameters $t$ and $s$ on the two lines and solve; a shared "
                "parameter smuggles in a false constraint."
            )),
            (L, "Planes and quadrics", (
                "A plane needs a point and a NORMAL vector $\\mathbf{n} = \\langle a, b, c \\rangle$:\n"
                "$$a(x - x_0) + b(y - y_0) + c(z - z_0) = 0.$$\n"
                "The coefficients of $x, y, z$ ARE the normal — read it off. Angle between planes = angle "
                "between normals; distance from point $Q$ to the plane: "
                "$\\frac{|a x_Q + b y_Q + c z_Q + d|}{\\sqrt{a^2+b^2+c^2}}$.\n\n"
                "Quadrics to recognize on sight: ellipsoid ($+,+,+$ = 1), hyperboloids (one sheet: one minus; "
                "two sheets: two minuses), elliptic paraboloid ($z = x^2 + y^2$), saddle ($z = x^2 - y^2$), "
                "cone ($z^2 = x^2 + y^2$). Diagnose by cross-sections: fix one variable, see what curve remains."
            )),
            (E, "Worked example", (
                "Find the plane through $A(1,0,2)$, $B(3,1,0)$, $C(0,2,1)$.\n\n"
                "Edge vectors: $\\vec{AB} = \\langle 2,1,-2 \\rangle$, $\\vec{AC} = \\langle -1,2,-1 \\rangle$.\n\n"
                "Normal $= \\vec{AB} \\times \\vec{AC} = \\langle 1\\cdot(-1) - (-2)\\cdot 2,\\; "
                "(-2)(-1) - 2(-1),\\; 2\\cdot 2 - 1\\cdot(-1) \\rangle = \\langle 3, 4, 5 \\rangle.$\n\n"
                "Plane: $3(x - 1) + 4y + 5(z - 2) = 0$, i.e. $3x + 4y + 5z = 13$. "
                "Check with $C$: $0 + 8 + 5 = 13$ ✓."
            )),
            (P, "Pitfalls", (
                "1. Confusing a line's DIRECTION vector with a plane's NORMAL vector — they play opposite roles "
                "(along vs perpendicular).\n\n"
                "2. Testing line intersection with the same parameter on both lines.\n\n"
                "3. Assuming non-parallel lines in 3D must meet — skew lines are the default, not the "
                "exception.\n\n"
                "4. Quadric misreads: $z = x^2 + y^2$ (paraboloid, no $z^2$) vs $z^2 = x^2 + y^2$ (cone) — the "
                "power on the lone variable changes everything."
            )),
            (K, "Check yourself", (
                "You should be able to: parametrize lines, build planes from three points or a point+normal, "
                "compute point-plane distance, and name quadrics from equations.\n\n"
                "Self-test: identify $\\frac{x^2}{4} + y^2 - \\frac{z^2}{9} = 1$. "
                "(Hyperboloid of ONE sheet — one minus sign.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C303": {
        "summary": "Vector-valued functions: parametrized curves, velocity, acceleration, and arc length.",
        "steps": [
            (L, "Curves as vector functions", (
                "$\\mathbf{r}(t) = \\langle x(t), y(t), z(t) \\rangle$ traces a curve; calculus acts "
                "componentwise:\n"
                "$$\\mathbf{r}'(t) = \\langle x'(t), y'(t), z'(t) \\rangle$$\n"
                "is the VELOCITY — tangent to the curve, with speed $|\\mathbf{r}'(t)|$. A second derivative "
                "gives acceleration.\n\n"
                "The classic example: the helix $\\mathbf{r}(t) = \\langle \\cos t, \\sin t, t \\rangle$ climbs a "
                "cylinder at constant speed $\\sqrt{2}$."
            )),
            (L, "Arc length and the unit tangent", (
                "Arc length integrates speed:\n"
                "$$L = \\int_a^b |\\mathbf{r}'(t)|\\, dt.$$\n"
                "This generalizes C209's $\\sqrt{1 + (y')^2}$ formula (parametrize $y = f(x)$ by $x$ and look).\n\n"
                "The unit tangent $\\mathbf{T} = \\frac{\\mathbf{r}'}{|\\mathbf{r}'|}$ separates MOTION from "
                "GEOMETRY: speed says how fast, $\\mathbf{T}$ says which way. Different parametrizations of the "
                "same curve share $\\mathbf{T}$ and $L$ but not velocity."
            )),
            (E, "Worked example: helix arc length", (
                "For $\\mathbf{r}(t) = \\langle \\cos t, \\sin t, t \\rangle$, $0 \\le t \\le 2\\pi$:\n\n"
                "$\\mathbf{r}'(t) = \\langle -\\sin t, \\cos t, 1 \\rangle$, speed "
                "$|\\mathbf{r}'| = \\sqrt{\\sin^2 t + \\cos^2 t + 1} = \\sqrt{2}$ — constant.\n\n"
                "$$L = \\int_0^{2\\pi} \\sqrt{2}\\, dt = 2\\pi\\sqrt{2}.$$\n\n"
                "One full turn of the helix is $\\sqrt 2$ times the circumference of its shadow circle — the "
                "extra length is the climb."
            )),
            (P, "Pitfalls", (
                "1. $|\\mathbf{r}'(t)|$ is NOT $\\frac{d}{dt}|\\mathbf{r}(t)|$ — speed is the length of the "
                "derivative, not the derivative of the length.\n\n"
                "2. Arc length integrates SPEED, never velocity — a vector cannot go under a scalar integral "
                "sign here.\n\n"
                "3. Simplifying $\\sqrt{x'^2 + y'^2 + z'^2}$ prematurely: look for the engineered identity "
                "(as with the helix) before expanding blindly.\n\n"
                "4. Forgetting that acceleration can be nonzero at constant speed — circular motion turns "
                "$\\mathbf{T}$ without changing $|\\mathbf{r}'|$."
            )),
            (K, "Check yourself", (
                "You should be able to: differentiate vector functions, compute speed and arc length, and "
                "extract unit tangents.\n\n"
                "Self-test: speed of $\\mathbf{r}(t) = \\langle t^2, 2t, \\ln t \\rangle$ at $t = 1$. "
                "($\\mathbf{r}' = \\langle 2t, 2, 1/t \\rangle$, at $1$: $|\\langle 2,2,1\\rangle| = 3$.)\n\n"
                "Practice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C304": {
        "summary": "Partial derivatives: holding variables fixed, higher partials, and Clairaut's theorem.",
        "steps": [
            (L, "The definition", (
                "For $f(x, y)$, the partial derivative $f_x = \\frac{\\partial f}{\\partial x}$ differentiates in "
                "$x$ while TREATING $y$ AS A CONSTANT — the slope of the surface when walking parallel to the "
                "$x$-axis.\n\n"
                "Everything from single-variable differentiation applies verbatim; the only new skill is "
                "bookkeeping which letter is alive. For $f(x,y) = x^3 y^2 + \\sin(xy)$:\n"
                "$$f_x = 3x^2 y^2 + y\\cos(xy), \\qquad f_y = 2x^3 y + x\\cos(xy).$$"
            )),
            (L, "Higher partials and Clairaut", (
                "Second partials: $f_{xx}$, $f_{yy}$, and the MIXED partials $f_{xy}$ (first $x$, then $y$) and "
                "$f_{yx}$.\n\n"
                "Clairaut's theorem: when the mixed partials are continuous,\n"
                "$$f_{xy} = f_{yx}$$\n"
                "— differentiation order doesn't matter. This is both a labor saver (compute the easier order) "
                "and a powerful ERROR CHECK: compute both orders and they must agree.\n\n"
                "Notation: $f_{xy} = (f_x)_y = \\frac{\\partial^2 f}{\\partial y\\, \\partial x}$ — subscripts "
                "read left-to-right, the Leibniz form right-to-left."
            )),
            (E, "Worked example", (
                "$f(x,y) = e^{xy} + x^2 y^3$.\n\n"
                "$f_x = y e^{xy} + 2xy^3$; $f_y = x e^{xy} + 3x^2 y^2$.\n\n"
                "Mixed, both orders:\n"
                "$f_{xy} = (f_x)_y = e^{xy} + xy e^{xy} + 6xy^2$.\n"
                "$f_{yx} = (f_y)_x = e^{xy} + xy e^{xy} + 6xy^2$. ✓ Equal, as Clairaut promises.\n\n"
                "Note $\\frac{\\partial}{\\partial y}\\left(y e^{xy}\\right)$ needed the PRODUCT rule — $y$ "
                "appears twice."
            )),
            (P, "Pitfalls", (
                "1. Letting the 'constant' variable move: in $f_x$ for $x^2 y$, the answer is $2xy$, and $y$ "
                "contributes NO $y'$ — there is no implicit differentiation here.\n\n"
                "2. Missing product rules when the live variable appears in several factors ($y e^{xy}$ above).\n\n"
                "3. Misreading $\\frac{\\partial^2 f}{\\partial x \\partial y}$: differentiate by $y$ FIRST "
                "(inner), then $x$.\n\n"
                "4. Using mixed-partial equality where continuity fails — exotic, but the hypothesis exists for "
                "a reason."
            )),
            (K, "Check yourself", (
                "You should be able to: compute first and second partials fluently, apply product/chain rules "
                "per-variable, and verify with Clairaut.\n\n"
                "Self-test: $f(x,y) = \\ln(x^2 + y^2)$ — show $f_{xx} + f_{yy} = 0$ "
                "(it's harmonic; PF.U6 meets it again). "
                "($f_{xx} = \\frac{2(y^2 - x^2)}{(x^2+y^2)^2}$, symmetric partner cancels it.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C305": {
        "summary": "Tangent planes and linearization: the multivariable tangent-line idea.",
        "steps": [
            (L, "The tangent plane", (
                "At $(a, b)$, the surface $z = f(x, y)$ has tangent plane\n"
                "$$z = f(a,b) + f_x(a,b)(x - a) + f_y(a,b)(y - b)$$\n"
                "— the C112 tangent line with one slope per direction. The right side is the LINEARIZATION "
                "$L(x, y)$, and near $(a,b)$, $f \\approx L$.\n\n"
                "For an implicit surface $F(x,y,z) = c$, the tangent plane's normal is the gradient "
                "$\\nabla F$ (C307 makes this precise): "
                "$F_x (x - a) + F_y (y - b) + F_z (z - c_0) = 0$ at the point."
            )),
            (L, "The total differential", (
                "The increment form:\n"
                "$$dz = f_x\\, dx + f_y\\, dy$$\n"
                "estimates how $f$ responds to SIMULTANEOUS small changes in both inputs — each variable "
                "contributes its own slope times its own change, and the contributions ADD.\n\n"
                "This is the error-propagation tool for measured quantities: a box's volume error from length, "
                "width, height errors; a resistor network's tolerance from component tolerances."
            )),
            (E, "Worked example", (
                "Estimate $f(1.02,\\, 2.97)$ for $f(x,y) = x^2 y$ by linearization at $(1, 3)$.\n\n"
                "$f(1,3) = 3$; $f_x = 2xy \\Rightarrow f_x(1,3) = 6$; $f_y = x^2 \\Rightarrow f_y(1,3) = 1$.\n\n"
                "$$L(x,y) = 3 + 6(x - 1) + 1\\,(y - 3), \\qquad "
                "L(1.02, 2.97) = 3 + 6(0.02) + (-0.03) = 3.09.$$\n\n"
                "True value: $(1.02)^2 (2.97) = 3.0904...$ — the plane is off by less than $0.001$."
            )),
            (P, "Pitfalls", (
                "1. Evaluating the partials at the TARGET point instead of the base point — slopes come from "
                "$(a, b)$.\n\n"
                "2. Forgetting one of the two correction terms, or crossing them ($f_x$ with $\\Delta y$).\n\n"
                "3. Writing the tangent plane without the $z =$ (or the implicit-form equivalent) — a plane "
                "needs all three variables accounted for.\n\n"
                "4. Trusting the linearization far from the base point; the error grows with curvature and "
                "distance squared, exactly as in one variable."
            )),
            (K, "Check yourself", (
                "You should be able to: write tangent planes for explicit and implicit surfaces, linearize, and "
                "propagate simultaneous small errors with $dz$.\n\n"
                "Self-test: tangent plane to $z = e^x \\ln y$ at $(0, e)$. "
                "($f = 1$, $f_x = 1$, $f_y = \\frac{1}{e}$: $z = 1 + x + \\frac{1}{e}(y - e)$.)\n\n"
                "Practice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C306": {
        "summary": "The multivariable chain rule: dependence trees and implicit differentiation in several variables.",
        "steps": [
            (L, "Chains through several variables", (
                "If $z = f(x, y)$ with $x = x(t)$, $y = y(t)$, then\n"
                "$$\\frac{dz}{dt} = \\frac{\\partial z}{\\partial x} \\frac{dx}{dt} "
                "+ \\frac{\\partial z}{\\partial y} \\frac{dy}{dt}$$\n"
                "— one term PER PATH from $z$ down to $t$ in the dependence tree, each term a product of the "
                "derivatives along that path.\n\n"
                "With intermediate variables of two arguments ($z = f(x,y)$, $x = x(s,t)$, $y = y(s,t)$), the "
                "same tree rule gives $\\frac{\\partial z}{\\partial s} = z_x x_s + z_y y_s$, etc. "
                "Draw the tree; the formula writes itself."
            )),
            (L, "Implicit differentiation, upgraded", (
                "From $F(x, y) = 0$ with $y = y(x)$, the chain rule gives $F_x + F_y \\frac{dy}{dx} = 0$, so\n"
                "$$\\frac{dy}{dx} = -\\frac{F_x}{F_y}$$\n"
                "— C109 in one line, minus sign included. For surfaces $F(x,y,z) = 0$:\n"
                "$$\\frac{\\partial z}{\\partial x} = -\\frac{F_x}{F_z}, \\qquad "
                "\\frac{\\partial z}{\\partial y} = -\\frac{F_y}{F_z}.$$\n\n"
                "The minus sign is structural, not optional; deriving it once from the tree makes it stick."
            )),
            (E, "Worked example", (
                "$z = x^2 y$ with $x = \\cos t$, $y = \\sin t$: find $\\frac{dz}{dt}$ at $t = \\frac{\\pi}{2}$.\n\n"
                "$$\\frac{dz}{dt} = 2xy \\cdot (-\\sin t) + x^2 \\cdot \\cos t.$$\n\n"
                "At $t = \\frac{\\pi}{2}$: $x = 0$, $y = 1$, $\\sin t = 1$, $\\cos t = 0$:\n"
                "$$\\frac{dz}{dt} = 2(0)(1)(-1) + 0 \\cdot 0 = 0.$$\n\n"
                "Sanity check by substitution first: $z(t) = \\cos^2 t \\sin t$, "
                "$z'(t) = -2\\cos t\\sin^2 t + \\cos^3 t$, which is $0$ at $\\frac{\\pi}{2}$ ✓."
            )),
            (P, "Pitfalls", (
                "1. Missing a path: every route from the top variable to the bottom variable contributes a "
                "term; a two-path tree needs two terms.\n\n"
                "2. Mixing $d$ and $\\partial$: full derivatives on single-variable edges, partials on "
                "multi-variable edges — the notation encodes the tree.\n\n"
                "3. Dropping the minus in $-F_x / F_y$.\n\n"
                "4. 'Canceling' $\\partial x$ symbols as if they were fractions — the one-variable mnemonic "
                "actively lies here (e.g. $\\frac{\\partial z}{\\partial x}\\frac{\\partial x}{\\partial z} \\ne 1$ "
                "in general)."
            )),
            (K, "Check yourself", (
                "You should be able to: draw the dependence tree, write one term per path, and use the "
                "$-F_x/F_z$ formulas for implicit surfaces.\n\n"
                "Self-test: $x^3 + y^3 + z^3 = 6xyz$ — find $\\frac{\\partial z}{\\partial x}$. "
                "($-\\frac{3x^2 - 6yz}{3z^2 - 6xy} = \\frac{2yz - x^2}{z^2 - 2xy}$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C307": {
        "summary": "The gradient and directional derivatives: steepest ascent and derivatives in any direction.",
        "steps": [
            (L, "The directional derivative", (
                "The gradient packs the partials into a vector: $\\nabla f = \\langle f_x, f_y \\rangle$ "
                "(or with $f_z$ in 3D).\n\n"
                "The rate of change of $f$ in the direction of a UNIT vector $\\mathbf{u}$ is\n"
                "$$D_{\\mathbf{u}} f = \\nabla f \\cdot \\mathbf{u}.$$\n\n"
                "Partial derivatives are the special cases $\\mathbf{u} = \\mathbf{i}, \\mathbf{j}$; the "
                "directional derivative fills in every other compass heading."
            )),
            (L, "What the gradient means", (
                "Because $D_{\\mathbf u} f = |\\nabla f| \\cos\\theta$, three facts fall out:\n\n"
                "• $\\nabla f$ points in the direction of STEEPEST ASCENT, with rate $|\\nabla f|$;\n"
                "• $-\\nabla f$ is steepest descent;\n"
                "• perpendicular to $\\nabla f$, the rate is 0 — so the gradient is NORMAL to level curves "
                "$f = c$ (and to level surfaces in 3D, which is where C305's implicit tangent plane comes from).\n\n"
                "A topographic map says it best: the gradient points straight uphill, contour lines are the "
                "level curves, and they always cross at right angles."
            )),
            (E, "Worked example", (
                "$f(x,y) = x^2 y - y^3$ at $P(2, 1)$.\n\n"
                "$\\nabla f = \\langle 2xy,\\; x^2 - 3y^2 \\rangle$, at $P$: $\\langle 4, 1 \\rangle$.\n\n"
                "Directional derivative toward $Q(5, 5)$: direction $\\langle 3, 4 \\rangle$, unit "
                "$\\mathbf{u} = \\langle \\frac 3 5, \\frac 4 5 \\rangle$:\n"
                "$$D_{\\mathbf u} f = \\langle 4, 1 \\rangle \\cdot \\langle \\tfrac 3 5, \\tfrac 4 5 \\rangle "
                "= \\frac{12 + 4}{5} = \\frac{16}{5}.$$\n\n"
                "Max possible rate at $P$: $|\\nabla f| = \\sqrt{17}$, achieved toward $\\langle 4, 1 \\rangle$."
            )),
            (P, "Pitfalls", (
                "1. Forgetting to NORMALIZE the direction — $D_{\\mathbf u} f$ requires a unit vector, or the "
                "answer scales with the arrow's length.\n\n"
                "2. Reporting the steepest-ascent DIRECTION when the question asks the RATE (or vice versa): "
                "direction is $\\nabla f$, rate is $|\\nabla f|$.\n\n"
                "3. Thinking the gradient is tangent to level curves — it is NORMAL to them.\n\n"
                "4. Evaluating $\\nabla f$ somewhere other than the point in question."
            )),
            (K, "Check yourself", (
                "You should be able to: compute gradients, take directional derivatives with normalized "
                "directions, and answer max-rate/steepest-descent questions instantly.\n\n"
                "Self-test: in which direction does $f(x,y) = x e^y$ decrease fastest at $(2, 0)$, and how fast? "
                "($\\nabla f = \\langle e^y, x e^y \\rangle = \\langle 1, 2 \\rangle$; fastest decrease toward "
                "$-\\langle 1,2\\rangle/\\sqrt 5$ at rate $\\sqrt 5$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C308": {
        "summary": "Critical points in two variables and the second-derivative (Hessian) test.",
        "steps": [
            (L, "Critical points", (
                "Interior extrema of $f(x,y)$ require BOTH partials to vanish:\n"
                "$$f_x = 0 \\quad \\text{and} \\quad f_y = 0$$\n"
                "— solve the pair simultaneously. New in 2D: besides maxima and minima, a critical point can be "
                "a SADDLE (max along one line, min along another; the surface $z = x^2 - y^2$ at the origin is "
                "the model).\n\n"
                "Solving the system often means substituting one equation into the other; expect multiple "
                "critical points."
            )),
            (L, "The second derivative test", (
                "Form the discriminant\n"
                "$$D = f_{xx} f_{yy} - (f_{xy})^2$$\n"
                "at each critical point:\n\n"
                "• $D > 0$ and $f_{xx} > 0$: local MIN.\n"
                "• $D > 0$ and $f_{xx} < 0$: local MAX.\n"
                "• $D < 0$: SADDLE.\n"
                "• $D = 0$: inconclusive — investigate directly.\n\n"
                "Memory anchor: $D > 0$ means the two directions agree (genuine extremum, sign of $f_{xx}$ "
                "picks which); $D < 0$ means they disagree — saddle."
            )),
            (E, "Worked example", (
                "$f(x,y) = x^3 - 3x + y^2$.\n\n"
                "$f_x = 3x^2 - 3 = 0 \\Rightarrow x = \\pm 1$; $f_y = 2y = 0 \\Rightarrow y = 0$. "
                "Critical points: $(1, 0)$, $(-1, 0)$.\n\n"
                "$f_{xx} = 6x$, $f_{yy} = 2$, $f_{xy} = 0$, so $D = 12x$.\n\n"
                "At $(1,0)$: $D = 12 > 0$, $f_{xx} = 6 > 0$ — local min, $f = -2$.\n"
                "At $(-1,0)$: $D = -12 < 0$ — saddle."
            )),
            (P, "Pitfalls", (
                "1. Setting only ONE partial to zero, or solving them independently instead of "
                "simultaneously.\n\n"
                "2. Forgetting the square on $f_{xy}$ in $D$, or its minus sign.\n\n"
                "3. Reading $D < 0$ as 'maximum' (the 1D reflex) — in 2D negative discriminant means "
                "SADDLE.\n\n"
                "4. Concluding from $D = 0$ — the test abstains; check the function along lines through the "
                "point.\n\n"
                "5. For ABSOLUTE extrema on a closed region, the boundary must be handled separately (often via "
                "C309 or parametrization) — the Hessian only sees the interior."
            )),
            (K, "Check yourself", (
                "You should be able to: solve the critical-point system, evaluate $D$, and classify every "
                "point, saying 'inconclusive' when it is.\n\n"
                "Self-test: classify the origin for $f(x,y) = x^4 + y^4$. "
                "($D = 0$ — test silent; but $f > 0$ elsewhere, so it's a min anyway.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C309": {
        "summary": "Lagrange multipliers: constrained optimization by gradient alignment.",
        "steps": [
            (L, "The idea", (
                "To optimize $f(x,y)$ subject to a constraint $g(x,y) = c$: at a constrained extremum, the "
                "level curve of $f$ is TANGENT to the constraint curve, so their normals align:\n"
                "$$\\nabla f = \\lambda\\, \\nabla g, \\qquad g = c.$$\n\n"
                "That's $n + 1$ equations ($n$ from the gradients, 1 constraint) in $n + 1$ unknowns "
                "(the variables and $\\lambda$). The multiplier $\\lambda$ measures how sensitive the optimum is "
                "to relaxing the constraint — in economics, the shadow price."
            )),
            (L, "Working the system", (
                "Practical tactics for solving $\\nabla f = \\lambda \\nabla g$:\n\n"
                "• Divide equations to eliminate $\\lambda$ — but CHECK the zero-denominator cases separately; "
                "solutions love to hide there.\n"
                "• Collect ALL candidate points, evaluate $f$ at each, and compare values — the method flags "
                "candidates, not their types.\n"
                "• Closed and bounded constraint sets guarantee both a max and a min exist (EVT), so the "
                "largest and smallest candidate values are the answers."
            )),
            (E, "Worked example", (
                "Extremes of $f(x,y) = xy$ on the circle $x^2 + y^2 = 8$.\n\n"
                "System: $y = \\lambda \\cdot 2x$, $x = \\lambda \\cdot 2y$, $x^2 + y^2 = 8$.\n\n"
                "Multiply the first by $y$, the second by $x$: $y^2 = 2\\lambda xy = x^2$, so $y = \\pm x$.\n\n"
                "$y = x$: $2x^2 = 8 \\Rightarrow (\\pm 2, \\pm 2)$, $f = 4$. "
                "$y = -x$: $(\\pm 2, \\mp 2)$, $f = -4$.\n\n"
                "Max $4$ at $(2,2)$ and $(-2,-2)$; min $-4$ at the other pair."
            )),
            (P, "Pitfalls", (
                "1. Dividing by expressions that might be zero when eliminating $\\lambda$ — always branch on "
                "the zero case.\n\n"
                "2. Solving $\\nabla f = \\nabla g$ (forgetting $\\lambda$) — the gradients must be PARALLEL, "
                "not equal.\n\n"
                "3. Using the Hessian test on candidates — it does not apply under constraints; compare "
                "$f$-values instead.\n\n"
                "4. For REGIONS (inequality constraints), forgetting the interior: combine C308 on the inside "
                "with Lagrange on the boundary.\n\n"
                "5. Reporting $\\lambda$ as the answer — it's machinery (unless the question asks for the "
                "shadow price)."
            )),
            (K, "Check yourself", (
                "You should be able to: set up the Lagrange system, solve it with case discipline, and pick "
                "extremes by comparing values.\n\n"
                "Self-test: minimize $f = x^2 + y^2$ on the line $x + 2y = 5$. "
                "($\\langle 2x, 2y \\rangle = \\lambda \\langle 1, 2 \\rangle \\Rightarrow y = 2x$; "
                "$x = 1, y = 2$, min $5$ — the closest-point-to-origin problem in disguise.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C310": {
        "summary": "Double integrals: iterated integrals over rectangles and general regions; Fubini.",
        "steps": [
            (L, "Iterated integrals and Fubini", (
                "$\\iint_R f\\, dA$ sums $f$ over a 2D region — volume under the surface when $f \\ge 0$. "
                "Fubini's theorem computes it one variable at a time:\n"
                "$$\\iint_R f\\, dA = \\int_a^b \\int_c^d f(x,y)\\, dy\\, dx$$\n"
                "on a rectangle, in either order. The inner integral treats the outer variable as constant — "
                "partial integration, mirroring partial differentiation."
            )),
            (L, "General regions: bounds that are functions", (
                "Over a non-rectangular region, the INNER bounds become functions of the outer variable:\n"
                "$$\\int_a^b \\int_{g_1(x)}^{g_2(x)} f(x,y)\\, dy\\, dx$$\n"
                "(vertical slices: for each $x$, $y$ runs bottom curve to top curve). Horizontal slices swap the "
                "roles.\n\n"
                "ALWAYS draw the region. Reversing the order of integration — often forced when the inner "
                "antiderivative doesn't exist (the classic $\\int\\int e^{y^2}$) — means re-describing the same "
                "region with the other slicing, not shuffling symbols."
            )),
            (E, "Worked example: reversing the order", (
                "Evaluate $\\displaystyle\\int_0^1 \\int_x^1 e^{y^2}\\, dy\\, dx$.\n\n"
                "The inner integral is impossible as written. The region: $0 \\le x \\le 1$, $x \\le y \\le 1$ — "
                "the triangle above $y = x$. Re-slice horizontally: $0 \\le y \\le 1$, $0 \\le x \\le y$:\n"
                "$$\\int_0^1 \\int_0^y e^{y^2} dx\\, dy = \\int_0^1 y\\, e^{y^2} dy "
                "= \\left[\\tfrac{1}{2} e^{y^2}\\right]_0^1 = \\frac{e - 1}{2}.$$\n\n"
                "The reversal manufactured the missing $y$ factor for the substitution."
            )),
            (P, "Pitfalls", (
                "1. Outer bounds containing a variable — the OUTER limits must be constants; only inner bounds "
                "may depend on the outer variable.\n\n"
                "2. Reversing order by swapping symbols without redrawing the region — bounds change shape, not "
                "just order.\n\n"
                "3. Integrating in the wrong variable first for the region's description (three integrals where "
                "one would do).\n\n"
                "4. Forgetting that $\\iint dA$ with $f = 1$ is just the AREA — a free sanity check on bounds."
            )),
            (K, "Check yourself", (
                "You should be able to: set up iterated integrals over sketched regions in both orders, reverse "
                "order via the picture, and exploit it when an antiderivative is missing.\n\n"
                "Self-test: rewrite $\\int_0^4 \\int_{\\sqrt y}^{2} f\\, dx\\, dy$ with order reversed. "
                "($\\int_0^2 \\int_0^{x^2} f \\, dy\\, dx$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C311": {
        "summary": "Double integrals in polar coordinates: when circles appear, so does r dr dθ.",
        "steps": [
            (L, "When and how to go polar", (
                "Discs, annuli, and integrands containing $x^2 + y^2$ beg for polar coordinates:\n"
                "$$x = r\\cos\\theta, \\quad y = r\\sin\\theta, \\quad x^2 + y^2 = r^2,$$\n"
                "and — the crucial factor —\n"
                "$$dA = r\\, dr\\, d\\theta.$$\n\n"
                "The extra $r$ is the Jacobian: polar 'rectangles' far from the origin are physically bigger, "
                "and $r$ accounts for it. Forgetting it is the canonical error of the topic."
            )),
            (L, "Setting polar bounds", (
                "Describe the region by sweep: $\\theta$ runs over the angular extent, and for each ray, $r$ "
                "runs from the inner boundary to the outer boundary (possibly $\\theta$-dependent, like the "
                "cardioid $r = 1 + \\cos\\theta$).\n\n"
                "Quarter disc in the first quadrant, radius $a$: $0 \\le \\theta \\le \\frac{\\pi}{2}$, "
                "$0 \\le r \\le a$. Region between circles $r = 1$ and $r = 2$: $1 \\le r \\le 2$, full "
                "$\\theta$ sweep."
            )),
            (E, "Worked example: the Gaussian trick's engine", (
                "Evaluate $\\displaystyle\\iint_D e^{-(x^2 + y^2)}\\, dA$ over the disc $x^2 + y^2 \\le R^2$.\n\n"
                "Cartesian: hopeless ($e^{-x^2}$ has no elementary antiderivative). Polar:\n"
                "$$\\int_0^{2\\pi} \\int_0^R e^{-r^2}\\, r\\, dr\\, d\\theta "
                "= 2\\pi \\left[-\\tfrac{1}{2} e^{-r^2}\\right]_0^R = \\pi\\left(1 - e^{-R^2}\\right).$$\n\n"
                "The Jacobian $r$ is exactly the factor the substitution $u = r^2$ needs. As $R \\to \\infty$ "
                "this proves $\\int_{-\\infty}^\\infty e^{-x^2} dx = \\sqrt{\\pi}$ — the famous squared-integral "
                "argument."
            )),
            (P, "Pitfalls", (
                "1. Dropping the Jacobian $r$ — silently wrong by a whole factor, and the resulting integral "
                "often LOOKS harder, which is the tell.\n\n"
                "2. Wrong angular range: a full disc is $2\\pi$, a half-plane region $\\pi$; sketch the sweep.\n\n"
                "3. Converting the integrand but not $dA$, or vice versa — the transformation is all-or-nothing.\n\n"
                "4. Cardioid-type outer bounds: $r$ runs to $f(\\theta)$, and squaring shows up in the inner "
                "integral — keep the algebra tidy."
            )),
            (K, "Check yourself", (
                "You should be able to: recognize polar-friendly regions/integrands, set sweep-style bounds, "
                "and never lose the $r$.\n\n"
                "Self-test: area inside the cardioid $r = 1 + \\cos\\theta$ via "
                "$\\int_0^{2\\pi}\\int_0^{1+\\cos\\theta} r\\, dr\\, d\\theta$. "
                "($\\frac{1}{2}\\int (1+\\cos\\theta)^2 d\\theta = \\frac{3\\pi}{2}$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C312": {
        "summary": "Triple integrals: volume and density integrals in Cartesian, cylindrical, and spherical coordinates.",
        "steps": [
            (L, "Triple integrals in Cartesian", (
                "$\\iiint_E f\\, dV$ sums over a solid; with $f = 1$ it computes VOLUME, with $f = $ density it "
                "computes mass. Iterate three deep — the innermost bounds may depend on both outer variables:\n"
                "$$\\int_a^b \\int_{g_1(x)}^{g_2(x)} \\int_{h_1(x,y)}^{h_2(x,y)} f\\; dz\\, dy\\, dx.$$\n\n"
                "Strategy: pick the axis along which the solid is 'between two surfaces' for the inner "
                "integral, then describe the SHADOW (projection) of the solid in the remaining two variables."
            )),
            (L, "Cylindrical and spherical", (
                "Cylindrical $(r, \\theta, z)$ — polar plus height:\n"
                "$$dV = r\\, dr\\, d\\theta\\, dz$$\n"
                "for solids with axial symmetry (cylinders, cones, paraboloids).\n\n"
                "Spherical $(\\rho, \\phi, \\theta)$ — $\\rho$ from origin, $\\phi$ from the $+z$-axis "
                "($0 \\le \\phi \\le \\pi$), $\\theta$ as usual:\n"
                "$$x = \\rho\\sin\\phi\\cos\\theta,\\;\\; z = \\rho\\cos\\phi, \\qquad "
                "dV = \\rho^2 \\sin\\phi\\, d\\rho\\, d\\phi\\, d\\theta$$\n"
                "for balls, spherical shells, and ice-cream cones. The Jacobians ($r$ and $\\rho^2\\sin\\phi$) "
                "are non-negotiable."
            )),
            (E, "Worked example: sphere volume, spherical coordinates", (
                "Volume of the ball $x^2 + y^2 + z^2 \\le a^2$:\n\n"
                "$$V = \\int_0^{2\\pi} \\int_0^{\\pi} \\int_0^a \\rho^2 \\sin\\phi\\; d\\rho\\, d\\phi\\, d\\theta "
                "= 2\\pi \\cdot \\left[-\\cos\\phi\\right]_0^\\pi \\cdot \\frac{a^3}{3} "
                "= 2\\pi \\cdot 2 \\cdot \\frac{a^3}{3} = \\frac{4}{3}\\pi a^3. ✓$$\n\n"
                "Every factor separates because the bounds are constants — the payoff of matching the "
                "coordinate system to the solid."
            )),
            (P, "Pitfalls", (
                "1. $\\phi$'s range is $[0, \\pi]$, never $[0, 2\\pi]$ — doubling it double-counts the "
                "sphere.\n\n"
                "2. Jacobian omissions ($r$; $\\rho^2 \\sin\\phi$) — same disease as C311, one dimension up.\n\n"
                "3. Inner bounds that don't depend on the right variables: $z$ between two surfaces means "
                "$h(x,y)$ bounds, not constants.\n\n"
                "4. Confusing $\\phi$ and $\\theta$ conventions between textbooks — state yours and stay "
                "consistent.\n\n"
                "5. Using spherical for a cylinder or cylindrical for a ball — match symmetry, or bounds turn "
                "ugly."
            )),
            (K, "Check yourself", (
                "You should be able to: set up triple integrals in all three systems, choose the system from "
                "the solid's symmetry, and carry the correct $dV$.\n\n"
                "Self-test: set up (don't evaluate) the mass of the cone $\\sqrt{x^2+y^2} \\le z \\le 2$ with "
                "density $z$ in cylindrical: $\\int_0^{2\\pi}\\int_0^2\\int_r^2 z\\, r\\, dz\\, dr\\, d\\theta$."
                "\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C313": {
        "summary": "Vector fields: flow pictures, divergence, and curl as the derivatives of fields.",
        "steps": [
            (L, "Fields and their pictures", (
                "A vector field attaches an arrow to every point: "
                "$\\mathbf{F}(x,y) = \\langle P(x,y), Q(x,y) \\rangle$ (add $R$ in 3D). Wind maps, force "
                "fields, and fluid velocities are the physical readings.\n\n"
                "Special class: GRADIENT (conservative) fields $\\mathbf{F} = \\nabla f$ — the arrows point "
                "uphill on some potential landscape $f$. C314 shows these are exactly the fields whose work "
                "integrals are path-independent."
            )),
            (L, "Divergence and curl", (
                "Two derivatives of a field, with opposite personalities:\n\n"
                "$$\\text{div}\\, \\mathbf{F} = \\nabla \\cdot \\mathbf{F} = P_x + Q_y + R_z$$\n"
                "— a SCALAR measuring net outflow per unit volume (source: positive; sink: negative).\n\n"
                "$$\\text{curl}\\, \\mathbf{F} = \\nabla \\times \\mathbf{F}$$\n"
                "— a VECTOR measuring local rotation (its direction is the spin axis, right-hand rule).\n\n"
                "Two identities anchor everything: $\\text{curl}(\\nabla f) = \\mathbf{0}$ (gradients don't "
                "spin) and $\\text{div}(\\text{curl}\\, \\mathbf{F}) = 0$ (curls don't source). The first gives "
                "the conservative-field TEST: in 2D, $\\mathbf F$ conservative $\\Rightarrow Q_x = P_y$."
            )),
            (E, "Worked example", (
                "$\\mathbf{F} = \\langle x^2 y, \\; yz^2, \\; x z \\rangle$.\n\n"
                "$$\\text{div}\\,\\mathbf{F} = 2xy + z^2 + x.$$\n\n"
                "$$\\text{curl}\\,\\mathbf{F} = \\begin{vmatrix} \\mathbf i & \\mathbf j & \\mathbf k \\\\ "
                "\\partial_x & \\partial_y & \\partial_z \\\\ x^2 y & y z^2 & xz \\end{vmatrix} "
                "= \\langle 0 - 2yz,\\; 0 - z,\\; 0 - x^2 \\rangle = \\langle -2yz, -z, -x^2 \\rangle.$$\n\n"
                "2D conservative check: $\\mathbf{G} = \\langle 2xy, x^2 \\rangle$ has "
                "$Q_x = 2x = P_y$ — conservative, with potential $f = x^2 y$."
            )),
            (P, "Pitfalls", (
                "1. Swapping the types: divergence is a SCALAR, curl is a VECTOR — an answer of the wrong type "
                "is wrong before any algebra.\n\n"
                "2. The 2D conservative test $Q_x = P_y$ needs a SIMPLY CONNECTED domain — the classic vortex "
                "$\\langle \\frac{-y}{x^2+y^2}, \\frac{x}{x^2+y^2} \\rangle$ passes the test away from the "
                "origin yet is not conservative around it.\n\n"
                "3. Sign slips in the curl's middle component (same checkerboard as every 3x3 determinant).\n\n"
                "4. Confusing the field's arrows with its flow lines — arrows are velocities, flow lines are "
                "the trajectories tangent to them."
            )),
            (K, "Check yourself", (
                "You should be able to: compute div and curl, run the conservative test with domain awareness, "
                "and recover potentials by partial integration.\n\n"
                "Self-test: find a potential for $\\mathbf F = \\langle y\\cos x, \\sin x + 2y \\rangle$. "
                "($f = y \\sin x + y^2$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C314": {
        "summary": "Line integrals: work along curves, and the fundamental theorem for gradient fields.",
        "steps": [
            (L, "Work integrals", (
                "The work done by field $\\mathbf F$ along a curve $C$ parametrized by $\\mathbf r(t)$, "
                "$a \\le t \\le b$:\n"
                "$$W = \\int_C \\mathbf F \\cdot d\\mathbf r = \\int_a^b \\mathbf F(\\mathbf r(t)) \\cdot \\mathbf r'(t)\\, dt.$$\n\n"
                "Recipe: parametrize the curve, substitute into $\\mathbf F$, dot with $\\mathbf r'$, integrate "
                "in $t$. Orientation matters: reversing the direction of travel flips the sign.\n\n"
                "(Scalar line integrals $\\int_C f\\, ds$ use the speed $|\\mathbf r'|\\,dt$ instead and don't "
                "care about orientation — arc length with a weight.)"
            )),
            (L, "The fundamental theorem for line integrals", (
                "If $\\mathbf F = \\nabla f$ is conservative, work only sees the ENDPOINTS:\n"
                "$$\\int_C \\nabla f \\cdot d\\mathbf r = f(\\text{end}) - f(\\text{start}).$$\n\n"
                "Consequences: path independence, and zero work around every closed loop. Workflow for any line "
                "integral: FIRST test conservativity ($Q_x = P_y$, simply connected domain); if it passes, find "
                "the potential and skip the parametrization entirely. If not, parametrize (or reach for Green's "
                "theorem on closed curves — C315)."
            )),
            (E, "Worked example: both routes", (
                "$\\mathbf F = \\langle 2xy, x^2 \\rangle$ along ANY path from $(0,0)$ to $(2,3)$.\n\n"
                "Conservative (checked in C313), potential $f = x^2 y$:\n"
                "$$W = f(2,3) - f(0,0) = 12.$$\n\n"
                "Cross-check on the straight segment $\\mathbf r(t) = \\langle 2t, 3t \\rangle$, "
                "$t \\in [0,1]$: $\\mathbf F = \\langle 12t^2, 4t^2 \\rangle$, $\\mathbf r' = \\langle 2, 3 \\rangle$, "
                "$W = \\int_0^1 (24t^2 + 12t^2)\\, dt = 12$ ✓ — same answer, more sweat."
            )),
            (P, "Pitfalls", (
                "1. Using endpoint evaluation on a NON-conservative field — the shortcut only exists for "
                "gradients; test first.\n\n"
                "2. Forgetting orientation: swapping start and end flips the sign of work integrals.\n\n"
                "3. Parametrization errors: bounds must match the parameter, and $d\\mathbf r = \\mathbf r'\\,dt$ "
                "— not $dt$ alone.\n\n"
                "4. Mixing up $\\int f\\, ds$ (scalar, speed factor) with $\\int \\mathbf F \\cdot d\\mathbf r$ "
                "(vector, dot with velocity).\n\n"
                "5. Claiming closed-loop work is zero without conservativity — that's backwards; zero loop work "
                "is the CONSEQUENCE."
            )),
            (K, "Check yourself", (
                "You should be able to: evaluate work integrals by parametrization, test for conservativity, "
                "recover potentials, and use the endpoint shortcut when legal.\n\n"
                "Self-test: $\\int_C y\\, dx + x\\, dy$ around ANY closed curve. "
                "($\\mathbf F = \\langle y, x\\rangle = \\nabla(xy)$: 0.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C315": {
        "summary": "Green's theorem: circulation and flux forms in the plane.",
        "steps": [
            (L, "The circulation form", (
                "For a POSITIVELY oriented (counterclockwise), simple closed curve $C$ bounding region $D$:\n"
                "$$\\oint_C P\\, dx + Q\\, dy = \\iint_D \\left(Q_x - P_y\\right) dA.$$\n\n"
                "Reading: total circulation around the boundary = total 'microscopic spin' ($Q_x - P_y$, the "
                "2D curl) inside. For conservative fields the integrand is 0 — recovering C314's zero-loop "
                "fact.\n\n"
                "Bonus: with $\\mathbf F = \\frac{1}{2}\\langle -y, x \\rangle$ the right side is the AREA of "
                "$D$: $A = \\frac{1}{2}\\oint x\\,dy - y\\,dx$ — how planimeters work."
            )),
            (L, "The flux form and hypotheses", (
                "The outward-flux version:\n"
                "$$\\oint_C \\mathbf F \\cdot \\mathbf n\\, ds = \\iint_D \\left(P_x + Q_y\\right) dA "
                "= \\iint_D \\text{div}\\,\\mathbf F\\; dA$$\n"
                "— net outflow through the boundary = total divergence inside. (This is the divergence theorem "
                "in 2D; C316 lifts it to 3D.)\n\n"
                "Hypotheses that actually bite: $C$ closed and positively oriented; $\\mathbf F$ with continuous "
                "partials ON ALL OF $D$ — a singularity inside (the C313 vortex at the origin) voids the "
                "theorem unless you cut it out with a small circle and work the annulus."
            )),
            (E, "Worked example", (
                "$\\oint_C (3y - e^{\\sin x})\\, dx + (7x + \\sqrt{y^4 + 1})\\, dy$ where $C$ is the circle "
                "$x^2 + y^2 = 9$, counterclockwise.\n\n"
                "Direct parametrization: nightmare integrands. Green:\n"
                "$$Q_x - P_y = 7 - 3 = 4, \\qquad \\oint = \\iint_D 4\\, dA = 4 \\cdot 9\\pi = 36\\pi.$$\n\n"
                "The monstrous terms $e^{\\sin x}$ and $\\sqrt{y^4+1}$ died under differentiation — that is "
                "Green's theorem earning its keep."
            )),
            (P, "Pitfalls", (
                "1. Orientation: clockwise traversal flips the sign — check before, not after.\n\n"
                "2. Using Green on an OPEN curve — close it (and subtract the added segment's integral) or "
                "parametrize directly.\n\n"
                "3. $Q_x - P_y$ order: it is $\\partial Q/\\partial x$ MINUS $\\partial P/\\partial y$; "
                "swapping gives the negative.\n\n"
                "4. Singularities inside $D$ — the vortex field's loop integral is $2\\pi$, not 0, despite "
                "$Q_x = P_y$ away from the origin; the hypothesis failure is the whole story.\n\n"
                "5. Forgetting that the double integral may itself be easiest in polar (C311)."
            )),
            (K, "Check yourself", (
                "You should be able to: apply both forms with correct orientation, use the area formula, and "
                "spot hypothesis violations (open curves, interior singularities).\n\n"
                "Self-test: use Green to evaluate $\\oint_C x^2 y\\, dx - x y^2\\, dy$ on the unit circle. "
                "($Q_x - P_y = -y^2 - x^2 = -r^2$: $\\int_0^{2\\pi}\\int_0^1 -r^2 \\cdot r\\, dr\\, d\\theta "
                "= -\\frac{\\pi}{2}$.)\n\nPractice the node."
            )),
        ],
    },
    # ------------------------------------------------------------------
    "C316": {
        "summary": "Stokes' theorem and the divergence theorem: the 3D integral theorems and their physical readings.",
        "steps": [
            (L, "Stokes' theorem", (
                "For an oriented surface $S$ with boundary curve $\\partial S$ (orientations matched by the "
                "right-hand rule):\n"
                "$$\\oint_{\\partial S} \\mathbf F \\cdot d\\mathbf r = \\iint_S (\\nabla \\times \\mathbf F) \\cdot d\\mathbf S.$$\n\n"
                "Circulation around the rim = flux of curl through the membrane. Green's circulation form is "
                "the flat special case.\n\n"
                "Powerful consequence: the right side depends only on the BOUNDARY — any two surfaces sharing "
                "a rim give the same curl flux, so trade a hard surface for an easy one (a paraboloid cap for "
                "its flat disc)."
            )),
            (L, "The divergence theorem", (
                "For a solid $E$ with closed boundary surface $\\partial E$, outward normals:\n"
                "$$\\oiint_{\\partial E} \\mathbf F \\cdot d\\mathbf S = \\iiint_E \\nabla \\cdot \\mathbf F\\; dV.$$\n\n"
                "Net outflow through the skin = total source strength inside. This is how Gauss's law, heat "
                "balance, and conservation laws are written.\n\n"
                "Selection rule: CLOSED surface + flux → divergence theorem; OPEN surface with a rim + curl "
                "or circulation → Stokes. The identities $\\text{curl}\\,\\nabla f = 0$ and "
                "$\\text{div}\\,\\text{curl}\\,\\mathbf F = 0$ explain the frequent zeros."
            )),
            (E, "Worked example: divergence theorem", (
                "Flux of $\\mathbf F = \\langle x^3, y^3, z^3 \\rangle$ outward through the sphere "
                "$x^2 + y^2 + z^2 = a^2$.\n\n"
                "$\\nabla \\cdot \\mathbf F = 3(x^2 + y^2 + z^2) = 3\\rho^2$. In spherical coordinates:\n"
                "$$\\iiint_E 3\\rho^2\\, dV = 3\\int_0^{2\\pi}\\int_0^\\pi\\int_0^a \\rho^2 \\cdot \\rho^2 \\sin\\phi\\; "
                "d\\rho\\, d\\phi\\, d\\theta = 3 \\cdot 2\\pi \\cdot 2 \\cdot \\frac{a^5}{5} = \\frac{12\\pi a^5}{5}.$$\n\n"
                "Direct surface integration would need parametrizing the sphere and dotting normals — the "
                "theorem converted it to a routine C312 computation."
            )),
            (P, "Pitfalls", (
                "1. Divergence theorem on an OPEN surface — it demands a closed boundary; cap the surface and "
                "subtract the cap's flux if needed.\n\n"
                "2. Orientation mismatches: outward normals for divergence; right-hand-rule consistency between "
                "rim and surface for Stokes. A flipped orientation flips the sign.\n\n"
                "3. Computing flux of $\\mathbf F$ when Stokes needs flux of CURL $\\mathbf F$ — read which "
                "field goes through the surface.\n\n"
                "4. Forgetting the free simplifications: closed-surface flux of a curl is 0; loop integrals of "
                "gradients are 0.\n\n"
                "5. Jacobian omissions inside the resulting volume integral (C312's disease resurfaces)."
            )),
            (K, "Check yourself", (
                "You should be able to: choose the right theorem from the geometry, match orientations, "
                "surface-swap with Stokes, and finish with C310-C312 machinery.\n\n"
                "Self-test: why is $\\oiint_S (\\nabla \\times \\mathbf F)\\cdot d\\mathbf S = 0$ for ANY closed "
                "surface $S$? (div curl = 0, then the divergence theorem — two theorems, one line.)\n\n"
                "Practice the node — this is the summit of the calculus sequence."
            )),
        ],
    },
}
