"""The full mathematics-ladder knowledge graph (Curriculum & Proof Extension).

This encodes Section 2's prerequisite backbone: tiers 0-6 from pre-algebra
through PDE theory, plus the first-class proof-technique nodes from Section 3.
The adaptive path planner already gates each node on its prerequisite edges, so
seeding this graph is what makes the long advanced-math chains enforceable end
to end (a learner cannot be routed into real analysis before the proof
techniques it needs show mastery).

Seeding is idempotent: nodes are keyed on code and edges on (from, to, kind), so
running it on every startup adds only what is missing. Course content (lessons,
items, definitions, theorems) attaches to these nodes in later waves; this
module is the spine.
"""

from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.curriculum.models import KnowledgeEdge, KnowledgeNode

# (code, title, tier, kind, track, description)
#
# kind is from NODE_KINDS; track is "applied", "pure", or None (see NODE_TRACKS).
# The applied track tags the engineering / photonics spine; the pure track tags
# the proof sequence. Foundational tiers carry no track.
CURRICULUM_NODES: list[tuple[str, str, int, str, str | None, str]] = [
    # Tier 0 - Foundations.
    (
        "PREALG", "Pre-algebra and Arithmetic", 0, "computational_skill", None,
        "Integers, fractions, ratio, percent, and order of operations.",
    ),
    # Tier 1 - Secondary.
    ("ALG1", "Algebra I", 1, "computational_skill", None,
     "Linear expressions, equations, and inequalities in one variable."),
    ("GEO", "Geometry (with intro two-column proof)", 1, "computational_skill", None,
     "Plane geometry, congruence, similarity, and the two-column proof."),
    ("ALG2", "Algebra II", 1, "computational_skill", None,
     "Polynomial, rational, exponential, and logarithmic functions."),
    ("TRIG", "Trigonometry", 1, "computational_skill", None,
     "Trigonometric functions, identities, and equations."),
    ("PRECALC", "Precalculus", 1, "computational_skill", None,
     "Functions, sequences, and analytic prep for calculus."),
    # Tier 2 - Calculus.
    ("CALC1", "Calculus I", 2, "computational_skill", None,
     "Limits, derivatives, and an introduction to integrals."),
    ("CALC2", "Calculus II", 2, "computational_skill", None,
     "Integration techniques, sequences and series, and Taylor series."),
    ("CALC3", "Calculus III / Multivariable", 2, "computational_skill", None,
     "Multivariable and vector calculus: Green, Stokes, divergence."),
    # Tier 3 - Core methods.
    ("LINALG", "Linear Algebra", 3, "computational_skill", "applied",
     "Vector spaces, linear maps, eigenvalues, and decompositions."),
    ("ODE", "Ordinary Differential Equations", 3, "computational_skill", "applied",
     "First- and higher-order ODEs, systems, and transforms."),
    ("DISC", "Discrete Mathematics", 3, "computational_skill", None,
     "Logic, combinatorics, graphs, and induction."),
    ("PROB", "Probability and Statistics", 3, "computational_skill", None,
     "Probability models, random variables, and statistical inference."),
    # Tier 4 - Proof transition.
    ("INTROPROOF", "Introduction to Proof and Mathematical Reasoning", 4, "concept", "pure",
     "Logic, quantifiers, sets, functions, relations, and cardinality; the "
     "techniques of direct, contrapositive, contradiction, and induction proof."),
    # Tier 4 - Proof techniques (first-class, transferable skills, Section 3).
    ("PT.DIRECT", "Direct proof", 4, "proof_technique", "pure",
     "Argue from hypotheses to conclusion by valid steps."),
    ("PT.CONTRAPOS", "Contrapositive", 4, "proof_technique", "pure",
     "Prove an implication by proving its contrapositive."),
    ("PT.CONTRADICTION", "Proof by contradiction", 4, "proof_technique", "pure",
     "Assume the negation and derive a contradiction."),
    ("PT.INDUCTION", "Induction", 4, "proof_technique", "pure",
     "Prove a statement for all naturals from a base case and an inductive step."),
    ("PT.STRONGIND", "Strong induction", 4, "proof_technique", "pure",
     "Induction using all prior cases, not just the immediate predecessor."),
    ("PT.CASES", "Proof by cases", 4, "proof_technique", "pure",
     "Exhaust a finite set of cases that cover the hypothesis."),
    ("PT.EPSILONDELTA", "Epsilon-delta arguments", 4, "proof_technique", "pure",
     "Quantifier-precise limit and continuity arguments."),
    ("PT.COUNTEREXAMPLE", "Construction of counterexamples", 4, "proof_technique", "pure",
     "Disprove a universal claim by constructing an object that breaks it."),
    ("PT.EXISTUNIQ", "Existence and uniqueness arguments", 4, "proof_technique", "pure",
     "Show an object exists and that it is the only such object."),
    # Tier 5 - Proof core.
    ("REALAN", "Real Analysis I-II", 5, "concept", "pure",
     "Rigorous limits, continuity, differentiation, integration, and sequences."),
    ("ABSALG", "Abstract Algebra I-II", 5, "concept", "pure",
     "Groups, rings, fields, and their homomorphisms and quotients."),
    ("TOPO", "Point-Set Topology", 5, "concept", "pure",
     "Topological spaces, continuity, compactness, and connectedness."),
    ("COMPLEXAN", "Complex Analysis", 5, "concept", "applied",
     "Holomorphic functions, contour integration, and residues."),
    ("NUMTHEORY", "Number Theory", 5, "concept", "pure",
     "Divisibility, congruences, and the structure of the integers."),
    # Tier 6 - Advanced and graduate.
    ("PDEM", "Partial Differential Equations: Methods", 6, "computational_skill", "applied",
     "Heat, wave, and Laplace equations; separation of variables; transforms."),
    ("PDET", "Partial Differential Equations: Theory", 6, "concept", "pure",
     "Weak solutions, Sobolev spaces, existence, uniqueness, energy estimates."),
    ("FUNCAN", "Fourier and Functional Analysis", 6, "concept", "applied",
     "Fourier analysis, normed and Hilbert spaces, and bounded operators."),
    ("MEASURE", "Measure Theory and Lebesgue Integration", 6, "concept", "pure",
     "Measures, measurable functions, and the Lebesgue integral."),
    ("NUMERICS", "Numerical Analysis", 6, "computational_skill", "applied",
     "Numerical linear algebra, quadrature, and discretization of PDEs."),
    ("DIFFGEO", "Differential Geometry", 6, "concept", "pure",
     "Curves, surfaces, manifolds, and curvature."),
    ("CALCVAR", "Calculus of Variations", 6, "concept", "pure",
     "Extremizing functionals; the Euler-Lagrange equation."),
]

# (prerequisite_code, dependent_code): the prerequisite is required for the
# dependent. This is Section 2's dependency graph, plus two refinements: proof
# techniques are unlocked by the proof-transition course, and the core techniques
# gate entry into real analysis so a learner cannot be routed into Tier 5 proofs
# before the Tier 4 techniques show mastery (Section 10 acceptance criterion).
CURRICULUM_PREREQS: list[tuple[str, str]] = [
    # Tier 0 -> 1.
    ("PREALG", "ALG1"),
    ("ALG1", "GEO"),
    ("ALG1", "ALG2"),
    ("ALG2", "TRIG"),
    ("TRIG", "PRECALC"),
    ("GEO", "PRECALC"),
    ("ALG2", "DISC"),
    # Tier 1 -> 2.
    ("PRECALC", "CALC1"),
    ("CALC1", "CALC2"),
    ("CALC2", "CALC3"),
    ("CALC2", "PROB"),
    # Tier 1/2 -> 3.
    ("ALG2", "LINALG"),
    ("PRECALC", "LINALG"),
    ("CALC2", "ODE"),
    # Tier 2/3 -> 4 (proof transition).
    ("CALC1", "INTROPROOF"),
    ("DISC", "INTROPROOF"),
    # Proof transition -> techniques (learned in the transition tier).
    ("INTROPROOF", "PT.DIRECT"),
    ("INTROPROOF", "PT.CONTRAPOS"),
    ("INTROPROOF", "PT.CONTRADICTION"),
    ("INTROPROOF", "PT.INDUCTION"),
    ("INTROPROOF", "PT.STRONGIND"),
    ("INTROPROOF", "PT.CASES"),
    ("INTROPROOF", "PT.EPSILONDELTA"),
    ("INTROPROOF", "PT.COUNTEREXAMPLE"),
    ("INTROPROOF", "PT.EXISTUNIQ"),
    # Tier 4 -> 5. Techniques gate real analysis (acceptance criterion), and the
    # course-level chains follow Section 2.
    ("INTROPROOF", "REALAN"),
    ("PT.INDUCTION", "REALAN"),
    ("PT.CONTRADICTION", "REALAN"),
    ("PT.EPSILONDELTA", "REALAN"),
    ("INTROPROOF", "ABSALG"),
    ("LINALG", "ABSALG"),
    ("INTROPROOF", "TOPO"),
    ("INTROPROOF", "NUMTHEORY"),
    ("REALAN", "COMPLEXAN"),
    ("REALAN", "MEASURE"),
    ("REALAN", "TOPO"),
    # Tier 5/other -> 6.
    ("MEASURE", "FUNCAN"),
    ("LINALG", "FUNCAN"),
    ("TOPO", "FUNCAN"),
    ("CALC3", "PDEM"),
    ("ODE", "PDEM"),
    ("LINALG", "PDEM"),
    ("PDEM", "NUMERICS"),
    ("REALAN", "PDET"),
    ("FUNCAN", "PDET"),
    ("PDEM", "PDET"),
    ("CALC3", "DIFFGEO"),
    ("TOPO", "DIFFGEO"),
    ("REALAN", "CALCVAR"),
]


async def seed_curriculum_graph(session: AsyncSession) -> int:
    """Idempotently seed the full ladder graph. Returns the number of new nodes.

    Safe to call on every startup: existing nodes (by code) and edges (by
    from/to/kind) are left untouched, and only missing ones are inserted.
    """
    existing_nodes = {
        node.code: node
        for node in (await session.execute(select(KnowledgeNode))).scalars().all()
    }

    added = 0
    for code, title, tier, kind, track, description in CURRICULUM_NODES:
        node = existing_nodes.get(code)
        if node is None:
            node = KnowledgeNode(
                code=code,
                title=title,
                description=description,
                kind=kind,
                tier=tier,
                track=track,
            )
            session.add(node)
            existing_nodes[code] = node
            added += 1
        else:
            # Backfill taxonomy on a node seeded before these columns existed.
            node.kind = kind
            node.tier = tier
            node.track = track
    if added:
        await session.flush()

    existing_edges = {
        (e.from_node_id, e.to_node_id, e.kind)
        for e in (await session.execute(select(KnowledgeEdge))).scalars().all()
    }
    for pre, dep in CURRICULUM_PREREQS:
        pre_node = existing_nodes.get(pre)
        dep_node = existing_nodes.get(dep)
        if pre_node is None or dep_node is None:
            continue
        key = (pre_node.id, dep_node.id, "prerequisite")
        if key in existing_edges:
            continue
        session.add(
            KnowledgeEdge(
                from_node_id=pre_node.id, to_node_id=dep_node.id, kind="prerequisite"
            )
        )
        existing_edges.add(key)
    await session.flush()
    return added
