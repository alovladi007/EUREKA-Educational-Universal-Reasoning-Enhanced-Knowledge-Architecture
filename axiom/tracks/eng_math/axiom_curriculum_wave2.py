"""AXIOM curriculum, wave 2.

Adds five courses to the wave 1 track (LA, OD, PF):

  C1  Calculus I                  (5 units, 18 nodes)
  C2  Calculus II                 (5 units, 16 nodes)
  C3  Calculus III                (5 units, 16 nodes)
  PS  Probability and Statistics  (6 units, 16 nodes)
  DM  Discrete Mathematics        (6 units, 14 nodes)

Merges with wave 1 (imported from axiom_curriculum) and emits the combined
axiom_full_curriculum.json with the same integrity checks: referential
integrity, exactly one correct choice per MC item, misconception routing, and
acyclicity of the union prerequisite graph.
"""

from __future__ import annotations

import json

from axiom_curriculum import N, E, M, build as build_wave1, check

# ===========================================================================
# CALCULUS I (C1)
# ===========================================================================

C1_UNITS = [
    ("C1-U1", "Limits and Continuity"),
    ("C1-U2", "The Derivative"),
    ("C1-U3", "Differentiation Rules"),
    ("C1-U4", "Applications of Derivatives"),
    ("C1-U5", "Introduction to Integration"),
]

C1_NODES = [
    N("C101", "C1-U1", "concept", "The limit concept",
      "Limits numerically and graphically; one-sided limits."),
    N("C102", "C1-U1", "computational", "Limit laws and algebraic evaluation",
      "Evaluating limits by algebra; resolving 0/0 by factoring and conjugates."),
    N("C103", "C1-U1", "concept", "Continuity and the IVT",
      "Continuity at a point and on intervals; intermediate value theorem."),
    N("C104", "C1-U1", "computational", "Limits at infinity and asymptotes",
      "End behavior; horizontal and vertical asymptotes."),
    N("C105", "C1-U2", "concept", "The derivative as a limit",
      "Difference quotient; tangent slope and instantaneous rate."),
    N("C106", "C1-U2", "concept", "Differentiability and continuity",
      "Where derivatives fail: corners, cusps, vertical tangents."),
    N("C107", "C1-U3", "computational", "Power, product, and quotient rules",
      "Core differentiation rules and when each applies."),
    N("C108", "C1-U3", "computational", "The chain rule",
      "Derivatives of compositions; inner derivative discipline."),
    N("C109", "C1-U3", "computational", "Implicit differentiation",
      "Differentiating relations; dy/dx from F(x, y) = 0."),
    N("C110", "C1-U3", "computational", "Exponential, log, and trig derivatives",
      "The transcendental derivative vocabulary."),
    N("C111", "C1-U4", "computational", "Related rates",
      "Linking rates through a constraint equation."),
    N("C112", "C1-U4", "computational", "Linear approximation",
      "Tangent-line approximation and differentials."),
    N("C113", "C1-U4", "concept", "Extrema and the mean value theorem",
      "Critical points, extreme value theorem, MVT."),
    N("C114", "C1-U4", "computational", "Curve analysis",
      "First and second derivative tests; concavity and inflection."),
    N("C115", "C1-U4", "computational", "Optimization",
      "Modeling and solving applied max-min problems."),
    N("C116", "C1-U5", "computational", "Antiderivatives",
      "Reversing differentiation; the constant of integration."),
    N("C117", "C1-U5", "concept", "Riemann sums and the definite integral",
      "Area under a curve as a limit of sums."),
    N("C118", "C1-U5", "concept", "The fundamental theorem of calculus",
      "Both parts; evaluation and the derivative of an accumulation function."),
]

C1_EDGES = [
    E("C101", "C102"), E("C102", "C103"), E("C102", "C104"),
    E("C102", "C105"), E("C105", "C106"),
    E("C105", "C107"), E("C107", "C108"), E("C108", "C109"), E("C107", "C110"),
    E("C108", "C111"), E("C105", "C112"), E("C106", "C113"),
    E("C113", "C114"), E("C114", "C115"),
    E("C107", "C116"), E("C103", "C117"), E("C116", "C118"), E("C117", "C118"),
]

C1_MISCONCEPTIONS = [
    M("C1M01", "Limit equals plug-in always",
      "Evaluates every limit by substitution, treating all functions as continuous.", "C103"),
    M("C1M02", "0/0 means no limit",
      "Concludes a limit does not exist whenever direct substitution gives 0/0.", "C102"),
    M("C1M03", "Product rule denial",
      "Differentiates a product as the product of derivatives.", "C107"),
    M("C1M04", "Dropped inner derivative",
      "Applies the chain rule without multiplying by the inner derivative.", "C108"),
    M("C1M05", "Continuous implies differentiable",
      "Assumes continuity guarantees a derivative; forgets corners and cusps.", "C106"),
    M("C1M06", "Critical point equals extremum",
      "Declares every critical point a max or min without a test.", "C113"),
    M("C1M07", "Lost constant of integration",
      "Omits + C from indefinite integrals.", "C116"),
    M("C1M08", "FTC lower-limit blindness",
      "Evaluates F(b) only, or differentiates an accumulation function incorrectly.", "C118"),
]

C1_MC_ITEMS = [
    {
        "id": "C1-D1", "node_id": "C102", "grader": "mc",
        "stem": "lim as x -> 2 of (x^2 - 4)/(x - 2). Direct substitution gives 0/0. Therefore:",
        "choices": [
            {"key": "a", "text": "Factor and cancel: the limit is 4", "correct": True},
            {"key": "b", "text": "The limit does not exist because of the 0/0", "correct": False, "misconception": "C1M02"},
            {"key": "c", "text": "The limit is 0", "correct": False, "misconception": "C1M01"},
            {"key": "d", "text": "The limit is undefined, same as f(2)", "correct": False, "misconception": "C1M01"},
        ],
    },
    {
        "id": "C1-D2", "node_id": "C108", "grader": "mc",
        "stem": "d/dx of sin(x^2) is:",
        "choices": [
            {"key": "a", "text": "2x cos(x^2)", "correct": True},
            {"key": "b", "text": "cos(x^2)", "correct": False, "misconception": "C1M04"},
            {"key": "c", "text": "2x cos(2x)", "correct": False, "misconception": "C1M04"},
            {"key": "d", "text": "-2x cos(x^2)", "correct": False, "misconception": "C1M04"},
        ],
    },
]

# ===========================================================================
# CALCULUS II (C2)
# ===========================================================================

C2_UNITS = [
    ("C2-U1", "Techniques of Integration"),
    ("C2-U2", "Improper Integrals"),
    ("C2-U3", "Applications of Integration"),
    ("C2-U4", "Sequences and Series"),
    ("C2-U5", "Power and Taylor Series"),
]

C2_NODES = [
    N("C201", "C2-U1", "computational", "Substitution",
      "Reversing the chain rule; changing bounds in definite integrals."),
    N("C202", "C2-U1", "computational", "Integration by parts",
      "Reversing the product rule; choosing u and dv."),
    N("C203", "C2-U1", "computational", "Trigonometric integrals",
      "Powers and products of sines, cosines, secants, tangents."),
    N("C204", "C2-U1", "computational", "Trigonometric substitution",
      "Radicals of quadratics via sin, tan, sec substitutions."),
    N("C205", "C2-U1", "computational", "Partial fractions",
      "Decomposing rational functions to integrate them."),
    N("C206", "C2-U2", "concept", "Improper integrals",
      "Infinite limits and unbounded integrands; convergence as a limit."),
    N("C207", "C2-U3", "computational", "Area between curves",
      "Signed area, intersection-driven bounds, top minus bottom."),
    N("C208", "C2-U3", "computational", "Volumes of revolution",
      "Disks, washers, and shells; choosing the method."),
    N("C209", "C2-U3", "computational", "Arc length and surface area",
      "The sqrt(1 + (y')^2) integrals."),
    N("C210", "C2-U4", "concept", "Sequences and convergence",
      "Limits of sequences; monotone and bounded behavior."),
    N("C211", "C2-U4", "computational", "Series and geometric series",
      "Partial sums; the geometric series and telescoping."),
    N("C212", "C2-U4", "computational", "Integral and comparison tests",
      "Convergence by comparison to integrals and known series; p-series."),
    N("C213", "C2-U4", "computational", "Ratio, root, and alternating tests",
      "Absolute vs conditional convergence; test selection."),
    N("C214", "C2-U5", "computational", "Power series and convergence intervals",
      "Radius of convergence; endpoint checks."),
    N("C215", "C2-U5", "computational", "Taylor and Maclaurin series",
      "Building series from derivatives; the standard library."),
    N("C216", "C2-U5", "concept", "Taylor approximation and error",
      "Truncation, remainder bounds, and where the approximation is trustworthy."),
]

C2_EDGES = [
    E("C201", "C202"), E("C202", "C203"), E("C203", "C204"), E("C202", "C205"),
    E("C205", "C206"),
    E("C201", "C207"), E("C207", "C208"), E("C208", "C209"),
    E("C210", "C211"), E("C211", "C212"), E("C212", "C213"),
    E("C213", "C214"), E("C214", "C215"), E("C215", "C216"), E("C206", "C212"),
]

C2_MISCONCEPTIONS = [
    M("C2M01", "Parts sign slip",
      "Writes integration by parts as uv + int v du, or misassigns u and dv.", "C202"),
    M("C2M02", "Substitution without the bounds",
      "Changes variables in a definite integral but keeps the old limits.", "C201"),
    M("C2M03", "Improper treated as proper",
      "Evaluates across an infinite limit or singularity without a limit process.", "C206"),
    M("C2M04", "nth-term test proves convergence",
      "Concludes a series converges because its terms go to zero.", "C212"),
    M("C2M05", "Ratio test equals one is conclusive",
      "Reads L = 1 in the ratio test as convergence or divergence.", "C213"),
    M("C2M06", "Unchecked endpoints",
      "States an interval of convergence without testing the endpoints.", "C214"),
    M("C2M07", "Infinite series as big finite sum",
      "Manipulates divergent or conditionally convergent series as if finite.", "C211"),
    M("C2M08", "Remainder ignored",
      "Uses a Taylor polynomial with no sense of where or how much it errs.", "C216"),
]

C2_MC_ITEMS = [
    {
        "id": "C2-D1", "node_id": "C212", "grader": "mc",
        "stem": "The terms of sum 1/n go to zero. The series therefore:",
        "choices": [
            {"key": "a", "text": "May still diverge, and this one does (harmonic series)", "correct": True},
            {"key": "b", "text": "Converges, because the terms go to zero", "correct": False, "misconception": "C2M04"},
            {"key": "c", "text": "Converges to 1", "correct": False, "misconception": "C2M07"},
            {"key": "d", "text": "Converges by the ratio test with L = 1", "correct": False, "misconception": "C2M05"},
        ],
    },
    {
        "id": "C2-D2", "node_id": "C201", "grader": "mc",
        "stem": "Evaluating int from 0 to 2 of 2x (x^2 + 1)^3 dx with u = x^2 + 1, the new bounds are:",
        "choices": [
            {"key": "a", "text": "u from 1 to 5", "correct": True},
            {"key": "b", "text": "u from 0 to 2, unchanged", "correct": False, "misconception": "C2M02"},
            {"key": "c", "text": "u from 0 to 5", "correct": False, "misconception": "C2M02"},
            {"key": "d", "text": "Bounds are irrelevant for substitution", "correct": False, "misconception": "C2M02"},
        ],
    },
]

# ===========================================================================
# CALCULUS III (C3)
# ===========================================================================

C3_UNITS = [
    ("C3-U1", "Vectors and Space"),
    ("C3-U2", "Partial Derivatives"),
    ("C3-U3", "Multivariable Optimization"),
    ("C3-U4", "Multiple Integrals"),
    ("C3-U5", "Vector Calculus"),
]

C3_NODES = [
    N("C301", "C3-U1", "computational", "Vectors, dot and cross products",
      "3D vectors; projections, areas, and perpendicularity."),
    N("C302", "C3-U1", "computational", "Lines, planes, and surfaces",
      "Parametric lines, plane equations, quadric surfaces."),
    N("C303", "C3-U1", "computational", "Vector functions and curves",
      "Parametrized curves; velocity, acceleration, arc length."),
    N("C304", "C3-U2", "computational", "Partial derivatives",
      "Holding variables fixed; higher partials and Clairaut."),
    N("C305", "C3-U2", "computational", "Tangent planes and linearization",
      "The multivariable tangent-line idea."),
    N("C306", "C3-U2", "computational", "The multivariable chain rule",
      "Trees of dependence; implicit differentiation in several variables."),
    N("C307", "C3-U2", "computational", "Gradient and directional derivatives",
      "The gradient as steepest ascent; derivatives in a direction."),
    N("C308", "C3-U3", "computational", "Critical points and the second derivative test",
      "Maxima, minima, saddles via the Hessian discriminant."),
    N("C309", "C3-U3", "computational", "Lagrange multipliers",
      "Constrained optimization; gradient alignment."),
    N("C310", "C3-U4", "computational", "Double integrals",
      "Iterated integrals over rectangles and general regions; Fubini."),
    N("C311", "C3-U4", "computational", "Polar double integrals",
      "Changing to polar coordinates; the r dA factor."),
    N("C312", "C3-U4", "computational", "Triple integrals",
      "Volume and density integrals; cylindrical and spherical coordinates."),
    N("C313", "C3-U5", "concept", "Vector fields",
      "Fields, flow lines, divergence and curl as derivatives of fields."),
    N("C314", "C3-U5", "computational", "Line integrals",
      "Work along curves; the fundamental theorem for gradients."),
    N("C315", "C3-U5", "computational", "Green's theorem",
      "Circulation and flux forms in the plane."),
    N("C316", "C3-U5", "concept", "Stokes and divergence theorems",
      "The 3D integral theorems and their physical readings."),
]

C3_EDGES = [
    E("C301", "C302"), E("C302", "C303"),
    E("C303", "C304"), E("C304", "C305"), E("C304", "C306"), E("C306", "C307"),
    E("C307", "C308"), E("C308", "C309"),
    E("C304", "C310"), E("C310", "C311"), E("C311", "C312"),
    E("C307", "C313"), E("C313", "C314"), E("C314", "C315"), E("C315", "C316"),
    E("C312", "C316"),
]

C3_MISCONCEPTIONS = [
    M("C3M01", "Partial forgets to hold constant",
      "Differentiates all variables at once when taking a partial.", "C304"),
    M("C3M02", "Scalar gradient",
      "Treats the gradient as a number instead of a vector of partials.", "C307"),
    M("C3M03", "Unnormalized direction",
      "Computes directional derivatives with a non-unit direction vector.", "C307"),
    M("C3M04", "1D test in 2D",
      "Classifies critical points by f_xx alone, ignoring the mixed partial.", "C308"),
    M("C3M05", "Bounds order confusion",
      "Sets iterated-integral bounds that do not describe the region.", "C310"),
    M("C3M06", "Dropped Jacobian",
      "Converts to polar or spherical without the r or rho^2 sin(phi) factor.", "C311"),
    M("C3M07", "Orientation blindness",
      "Ignores curve or surface orientation in line and flux integrals.", "C314"),
    M("C3M08", "Theorem without hypotheses",
      "Applies Green or Stokes on non-closed curves or with singularities inside.", "C315"),
]

C3_MC_ITEMS = [
    {
        "id": "C3-D1", "node_id": "C311", "grader": "mc",
        "stem": "Converting a double integral to polar coordinates, dA becomes:",
        "choices": [
            {"key": "a", "text": "r dr d(theta)", "correct": True},
            {"key": "b", "text": "dr d(theta)", "correct": False, "misconception": "C3M06"},
            {"key": "c", "text": "r^2 dr d(theta)", "correct": False, "misconception": "C3M06"},
            {"key": "d", "text": "dx dy, unchanged", "correct": False, "misconception": "C3M06"},
        ],
    },
    {
        "id": "C3-D2", "node_id": "C308", "grader": "mc",
        "stem": "At a critical point, f_xx > 0 and f_yy > 0. Can you conclude a local minimum?",
        "choices": [
            {"key": "a", "text": "Not yet: the discriminant f_xx f_yy - f_xy^2 must be positive too", "correct": True},
            {"key": "b", "text": "Yes: both second partials positive means minimum", "correct": False, "misconception": "C3M04"},
            {"key": "c", "text": "Yes: any positive second partial suffices", "correct": False, "misconception": "C3M04"},
            {"key": "d", "text": "No: it must be a saddle", "correct": False, "misconception": "C3M04"},
        ],
    },
]

# ===========================================================================
# PROBABILITY AND STATISTICS (PS)
# ===========================================================================

PS_UNITS = [
    ("PS-U1", "Probability Foundations"),
    ("PS-U2", "Conditional Probability and Bayes"),
    ("PS-U3", "Discrete Random Variables"),
    ("PS-U4", "Continuous Random Variables"),
    ("PS-U5", "Sampling and Estimation"),
    ("PS-U6", "Inference and Regression"),
]

PS_NODES = [
    N("PS01", "PS-U1", "computational", "Counting for probability",
      "Equally likely outcomes; counting favorable cases."),
    N("PS02", "PS-U1", "concept", "Sample spaces and probability axioms",
      "Events, complements, unions; the axioms and their consequences."),
    N("PS03", "PS-U2", "computational", "Conditional probability and independence",
      "P(A given B); testing and using independence."),
    N("PS04", "PS-U2", "computational", "Bayes' theorem",
      "Inverting conditionals; base rates and posterior probability."),
    N("PS05", "PS-U3", "computational", "Discrete random variables and expectation",
      "Distributions, expected value, linearity."),
    N("PS06", "PS-U3", "computational", "Variance and standard deviation",
      "Spread; Var = E[X^2] - (E[X])^2 and its uses."),
    N("PS07", "PS-U3", "computational", "Binomial and geometric distributions",
      "Repeated independent trials; success counts and waiting times."),
    N("PS08", "PS-U3", "computational", "Poisson distribution",
      "Rare events at a rate; Poisson as a binomial limit."),
    N("PS09", "PS-U4", "concept", "Continuous random variables",
      "Densities, probabilities as areas, cumulative distributions."),
    N("PS10", "PS-U4", "computational", "The normal distribution",
      "Z-scores, standardization, the empirical rule."),
    N("PS11", "PS-U4", "concept", "The central limit theorem",
      "Sums and means become normal; conditions and limits of the claim."),
    N("PS12", "PS-U5", "computational", "Descriptive statistics",
      "Mean, median, quantiles, spread; reading data honestly."),
    N("PS13", "PS-U5", "concept", "Sampling distributions and standard error",
      "The distribution of a statistic; SE vs SD."),
    N("PS14", "PS-U6", "computational", "Confidence intervals",
      "Estimating with uncertainty; interpretation discipline."),
    N("PS15", "PS-U6", "concept", "Hypothesis testing",
      "Null and alternative, p-values, errors of both kinds."),
    N("PS16", "PS-U6", "computational", "Correlation and linear regression",
      "Fitting lines, reading r, and the limits of both."),
]

PS_EDGES = [
    E("PS01", "PS02"), E("PS02", "PS03"), E("PS03", "PS04"),
    E("PS02", "PS05"), E("PS05", "PS06"), E("PS05", "PS07"), E("PS07", "PS08"),
    E("PS05", "PS09"), E("PS09", "PS10"), E("PS10", "PS11"),
    E("PS02", "PS12"), E("PS11", "PS13"), E("PS12", "PS13"),
    E("PS13", "PS14"), E("PS14", "PS15"), E("PS15", "PS16"), E("PS06", "PS16"),
]

PS_MISCONCEPTIONS = [
    M("PSM01", "Confusion of the inverse",
      "Equates P(A given B) with P(B given A); neglects base rates.", "PS04"),
    M("PSM02", "Independence by default",
      "Multiplies probabilities without checking independence.", "PS03"),
    M("PSM03", "Gambler's fallacy",
      "Believes past independent outcomes change future probabilities.", "PS03"),
    M("PSM04", "Unnormalized probabilities",
      "Assigns probabilities that do not sum or integrate to one.", "PS02"),
    M("PSM05", "Variance shortcut misuse",
      "Uses (E[X])^2 for E[X^2], or Var(X + Y) = Var X + Var Y without independence.", "PS06"),
    M("PSM06", "SD-SE conflation",
      "Uses the sample standard deviation where the standard error belongs.", "PS13"),
    M("PSM07", "CI as probability of the parameter",
      "Reads a 95 percent CI as a 95 percent chance the parameter is inside.", "PS14"),
    M("PSM08", "p-value as truth probability",
      "Reads the p-value as the probability the null hypothesis is true.", "PS15"),
    M("PSM09", "Correlation implies causation",
      "Infers causal influence from association alone.", "PS16"),
    M("PSM10", "Normality everywhere",
      "Invokes the CLT for tiny samples or heavy-tailed data.", "PS11"),
]

PS_MC_ITEMS = [
    {
        "id": "PS-D1", "node_id": "PS04", "grader": "mc",
        "stem": "A test is 99 percent accurate; the condition affects 1 in 1000. A person tests positive. The chance they have the condition is:",
        "choices": [
            {"key": "a", "text": "Well under 50 percent: the false positives outnumber the true ones", "correct": True},
            {"key": "b", "text": "99 percent, the accuracy of the test", "correct": False, "misconception": "PSM01"},
            {"key": "c", "text": "About 1 in 1000, unchanged", "correct": False, "misconception": "PSM02"},
            {"key": "d", "text": "Exactly 50 percent", "correct": False, "misconception": "PSM01"},
        ],
    },
    {
        "id": "PS-D2", "node_id": "PS15", "grader": "mc",
        "stem": "A study reports p = 0.03. This means:",
        "choices": [
            {"key": "a", "text": "Data this extreme occurs 3 percent of the time if the null is true", "correct": True},
            {"key": "b", "text": "There is a 3 percent chance the null hypothesis is true", "correct": False, "misconception": "PSM08"},
            {"key": "c", "text": "There is a 97 percent chance the alternative is true", "correct": False, "misconception": "PSM08"},
            {"key": "d", "text": "The effect size is large", "correct": False, "misconception": "PSM08"},
        ],
    },
]

# ===========================================================================
# DISCRETE MATHEMATICS (DM)
# ===========================================================================

DM_UNITS = [
    ("DM-U1", "Logic"),
    ("DM-U2", "Proof Techniques"),
    ("DM-U3", "Sets, Functions, Relations"),
    ("DM-U4", "Counting"),
    ("DM-U5", "Recurrences and Number Theory"),
    ("DM-U6", "Graphs and Growth"),
]

DM_NODES = [
    N("DM01", "DM-U1", "computational", "Propositional logic",
      "Connectives, truth tables, equivalence, De Morgan."),
    N("DM02", "DM-U1", "concept", "Predicates and quantifiers",
      "For-all and there-exists; negating quantified statements."),
    N("DM03", "DM-U2", "concept", "Direct proof and counterexample",
      "Proving universal claims; disproving with one counterexample."),
    N("DM04", "DM-U2", "concept", "Induction",
      "Base case plus inductive step; strong induction."),
    N("DM05", "DM-U3", "computational", "Sets and set operations",
      "Union, intersection, complement, power sets, Venn reasoning."),
    N("DM06", "DM-U3", "concept", "Functions and relations",
      "Injective, surjective, bijective; equivalence relations."),
    N("DM07", "DM-U4", "computational", "Sum and product rules",
      "Decomposing counting problems into stages and cases."),
    N("DM08", "DM-U4", "computational", "Permutations and combinations",
      "Ordered vs unordered selection; binomial coefficients."),
    N("DM09", "DM-U4", "computational", "Pigeonhole and inclusion-exclusion",
      "Guaranteed collisions; counting unions without double counting."),
    N("DM10", "DM-U5", "computational", "Recurrence relations",
      "Modeling with recurrences; solving linear cases in closed form."),
    N("DM11", "DM-U5", "computational", "Modular arithmetic",
      "Congruences, inverses mod m, and applications."),
    N("DM12", "DM-U6", "computational", "Graphs: basics and degree",
      "Vertices, edges, degree, handshake lemma."),
    N("DM13", "DM-U6", "concept", "Connectivity, paths, and trees",
      "Euler paths, tree properties, spanning trees in brief."),
    N("DM14", "DM-U6", "concept", "Growth of functions and Big-O",
      "Comparing algorithm growth; dominant terms."),
]

DM_EDGES = [
    E("DM01", "DM02"), E("DM02", "DM03"), E("DM03", "DM04"),
    E("DM01", "DM05"), E("DM05", "DM06"),
    E("DM05", "DM07"), E("DM07", "DM08"), E("DM08", "DM09"),
    E("DM04", "DM10"), E("DM10", "DM11"),
    E("DM06", "DM12"), E("DM12", "DM13"), E("DM10", "DM14"),
]

DM_MISCONCEPTIONS = [
    M("DMM01", "Converse assumed",
      "Reads p implies q as also meaning q implies p.", "DM01"),
    M("DMM02", "Quantifier negation error",
      "Negates for-all as for-all-not instead of there-exists-not.", "DM02"),
    M("DMM03", "Induction without a base",
      "Runs the inductive step with no base case, or the wrong one.", "DM04"),
    M("DMM04", "Order confusion in counting",
      "Uses permutations where order is irrelevant, or combinations where it matters.", "DM08"),
    M("DMM05", "Double counting",
      "Counts overlapping cases twice; skips inclusion-exclusion.", "DM09"),
    M("DMM06", "Ordinary division mod m",
      "Divides both sides of a congruence without a modular inverse.", "DM11"),
    M("DMM07", "Proof by example",
      "Verifies a universal claim on a few cases and declares it proved.", "DM03"),
    M("DMM08", "Big-O reads constants",
      "Ranks growth by constants and lower-order terms instead of dominant term.", "DM14"),
]

DM_MC_ITEMS = [
    {
        "id": "DM-D1", "node_id": "DM02", "grader": "mc",
        "stem": "The negation of 'every student passed' is:",
        "choices": [
            {"key": "a", "text": "At least one student did not pass", "correct": True},
            {"key": "b", "text": "Every student did not pass", "correct": False, "misconception": "DMM02"},
            {"key": "c", "text": "No student passed", "correct": False, "misconception": "DMM02"},
            {"key": "d", "text": "Most students did not pass", "correct": False, "misconception": "DMM02"},
        ],
    },
    {
        "id": "DM-D2", "node_id": "DM08", "grader": "mc",
        "stem": "Choosing a 3-person committee from 10 people:",
        "choices": [
            {"key": "a", "text": "C(10, 3) = 120: order does not matter", "correct": True},
            {"key": "b", "text": "P(10, 3) = 720: order matters", "correct": False, "misconception": "DMM04"},
            {"key": "c", "text": "10^3 = 1000", "correct": False, "misconception": "DMM04"},
            {"key": "d", "text": "3^10", "correct": False, "misconception": "DMM04"},
        ],
    },
]

# ===========================================================================
# Cross-course edges (wave 2 and into wave 1)
# ===========================================================================

WAVE2_CROSS_EDGES = [
    # Within the calculus sequence
    E("C118", "C201"),   # FTC before techniques of integration
    E("C110", "C304"),   # single-variable rules before partials
    E("C201", "C310"),   # integration before multiple integrals
    E("C201", "C314"),   # integration before line integrals
    # Calculus into the wave 1 track
    E("C110", "OD01"),   # derivatives before ODEs
    E("C201", "OD01"),   # integration before ODEs
    E("C215", "OD19"),   # Taylor series before series solutions
    E("C304", "PF07"),   # partial derivatives before PDE classification
    E("C301", "LA21"),   # vector arithmetic before inner-product geometry
    # Discrete into probability and statistics
    E("DM08", "PS01"),   # combinatorics before counting probability
    # Linear algebra into statistics
    E("LA24", "PS16"),   # least squares before regression
]


def build() -> dict:
    cur = build_wave1()
    cur["courses"].extend([
        {"id": "C1", "title": "Calculus I", "units": C1_UNITS,
         "nodes": C1_NODES, "edges": C1_EDGES,
         "misconceptions": C1_MISCONCEPTIONS, "items": C1_MC_ITEMS},
        {"id": "C2", "title": "Calculus II", "units": C2_UNITS,
         "nodes": C2_NODES, "edges": C2_EDGES,
         "misconceptions": C2_MISCONCEPTIONS, "items": C2_MC_ITEMS},
        {"id": "C3", "title": "Calculus III", "units": C3_UNITS,
         "nodes": C3_NODES, "edges": C3_EDGES,
         "misconceptions": C3_MISCONCEPTIONS, "items": C3_MC_ITEMS},
        {"id": "PS", "title": "Probability and Statistics", "units": PS_UNITS,
         "nodes": PS_NODES, "edges": PS_EDGES,
         "misconceptions": PS_MISCONCEPTIONS, "items": PS_MC_ITEMS},
        {"id": "DM", "title": "Discrete Mathematics", "units": DM_UNITS,
         "nodes": DM_NODES, "edges": DM_EDGES,
         "misconceptions": DM_MISCONCEPTIONS, "items": DM_MC_ITEMS},
    ])
    cur["cross_edges"].extend(WAVE2_CROSS_EDGES)
    return cur


if __name__ == "__main__":
    cur = build()
    probs = check(cur)
    n_nodes = sum(len(c["nodes"]) for c in cur["courses"])
    n_edges = sum(len(c["edges"]) for c in cur["courses"]) + len(cur["cross_edges"])
    n_misc = sum(len(c["misconceptions"]) for c in cur["courses"])
    n_items = sum(len(c["items"]) for c in cur["courses"])
    print(f"courses: {len(cur['courses'])}  nodes: {n_nodes}  edges: {n_edges}  "
          f"misconceptions: {n_misc}  diagnostic items: {n_items}")
    print(f"integrity problems: {len(probs)}")
    for p in probs:
        print("  PROBLEM:", p)
    with open("axiom_full_curriculum.json", "w") as f:
        json.dump(cur, f, indent=2)
    print("wrote axiom_full_curriculum.json (8 courses)")
