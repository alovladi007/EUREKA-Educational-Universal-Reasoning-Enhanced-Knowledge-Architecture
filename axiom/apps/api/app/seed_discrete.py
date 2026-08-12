"""Practice item templates for Discrete Mathematics, each with its verifier.

WHY THIS FILE IS SHAPED LIKE THIS

Every row here carries a template AND the independent function that checks it.
They are one tuple, not two tables, because the house rule is that no generated
answer key is served without a second computational path agreeing with it, and
the cheapest way to enforce that is to make a template without a verifier
impossible to write down.

The two paths must be genuinely different. `answer_expr` is a closed form that
SymPy substitutes and simplifies; the verifier recomputes the same quantity in
plain Python by a different route - enumeration, iteration, or a different
theorem. Where the verifier would just be the same formula retyped, the item
was rewritten until it was not. Two examples worth naming:

  DM04  closed form n(n+1)/2   vs   sum(range(1, n + 1))
  DM13  Cayley's n^(n-2)       vs   Kirchhoff's matrix-tree determinant

A formula agreeing with itself proves nothing, which is the whole reason the
rule says "second computational path" rather than "second check".

WHAT IS NOT HERE

Course overview nodes (DISC and the like) get no template. They are entry
points into a subject, not topics with an answerable question, and inventing
one so a coverage number goes up would be exactly the padding this codebase
refuses elsewhere. They report as "reading only" and that is accurate.

Run `python -m app.verify_templates` (or the test that wraps it) to sweep every
row over many seeds before any of it reaches a learner.
"""

from __future__ import annotations

import itertools
import math
from collections.abc import Callable
from dataclasses import dataclass, field
from fractions import Fraction


def _vint(name: str, low: int, high: int) -> dict:
    return {"name": name, "kind": "int", "low": low, "high": high, "step": 1}


@dataclass(frozen=True)
class TemplateSpec:
    """One authored template and the independent check on its answer key."""

    node: str
    kind: str
    stem: str
    variables: list[dict]
    answer_expr: str
    explanation: str
    # Recomputes the answer from the sampled values by a different route.
    # Returns an exact value (int or Fraction) so the comparison is exact.
    verifier: Callable[[dict], int | Fraction]
    constraints: list[str] = field(default_factory=list)
    tolerance: float | None = None
    difficulty: float = 0.5


# ---------------------------------------------------------------------------
# verifiers - the second path, written to share no code with answer_expr
# ---------------------------------------------------------------------------


def _v_truth_rows(v: dict) -> int:
    """Enumerate the assignments rather than raising 2 to a power."""
    return len(list(itertools.product([False, True], repeat=int(v["n"]))))


def _v_cube_minus_n_over_6(v: dict) -> int:
    """Count the multiples of 6 up to n^3 - n instead of dividing by 6.

    n^3 - n = (n-1)n(n+1) is a product of three consecutive integers and so is
    always divisible by 6; this counts how many sixes fit, which is the same
    number the learner is asked for, reached without a division.
    """
    a = int(v["a"])
    total = a**3 - a
    count = 0
    while count * 6 < total:
        count += 1
    return count


def _v_triangular(v: dict) -> int:
    """Actually add the integers, rather than using n(n+1)/2."""
    return sum(range(1, int(v["n"]) + 1))


def _v_union_size(v: dict) -> int:
    """Build real sets with the stated cardinalities and union them."""
    a, b, c = int(v["a"]), int(v["b"]), int(v["c"])
    left = set(range(a))
    # The last c elements of `left` are the shared ones.
    shared = set(range(a - c, a))
    right = shared | set(range(1000, 1000 + (b - c)))
    return len(left | right)


def _v_injections(v: dict) -> int:
    """Count injective maps by listing them, not by n!/(n-k)!."""
    n, k = int(v["n"]), int(v["k"])
    return len(list(itertools.permutations(range(n), k)))


def _v_product_rule(v: dict) -> int:
    """Enumerate the actual tuples instead of multiplying."""
    a, b, c = int(v["a"]), int(v["b"]), int(v["c"])
    return len(list(itertools.product(range(a), range(b), range(c))))


def _v_pigeonhole(v: dict) -> int:
    """Distribute the items one at a time and read off the fullest box.

    Round-robin filling is the worst case for the maximum, which is exactly
    what the pigeonhole bound describes - so this reaches ceil(n/k) by
    simulation rather than by a ceiling function.
    """
    n, k = int(v["n"]), int(v["k"])
    boxes = [0] * k
    for i in range(n):
        boxes[i % k] += 1
    return max(boxes)


def _v_handshake(v: dict) -> int:
    """Sum the degrees and halve by counting pairs, not by n*d/2."""
    n, d = int(v["n"]), int(v["d"])
    degree_sum = sum(d for _ in range(n))
    edges = 0
    while 2 * edges < degree_sum:
        edges += 1
    return edges


def _v_spanning_trees(v: dict) -> int:
    """Kirchhoff's matrix-tree theorem, against Cayley's n^(n-2).

    The number of labelled spanning trees of K_n is any cofactor of its
    Laplacian. For K_n the Laplacian is n*I - J; deleting one row and column
    leaves an (n-1)x(n-1) matrix whose determinant is computed here by exact
    Gaussian elimination over the rationals. This is a different theorem
    reaching the same count, which is the point.

    THE DIAGONAL IS n-1, NOT n. Written as n first, this returned 50 for
    K_4 where Cayley gives 16 - because n*I - J has n-1 on the diagonal (each
    vertex of K_n has degree n-1) and putting n there is the Laplacian of a
    graph with a self-loop at every vertex. The sweep caught it on seed 1. It
    is worth recording that the disagreement was in the CHECK, not in the
    template: an independent path is only useful if it is allowed to be the
    thing that is wrong.
    """
    n = int(v["n"])
    size = n - 1
    # Reduced Laplacian of K_n: degree n-1 on the diagonal, -1 off it.
    m = [[Fraction(n - 1 if i == j else -1) for j in range(size)] for i in range(size)]
    det = Fraction(1)
    for col in range(size):
        pivot_row = next((r for r in range(col, size) if m[r][col] != 0), None)
        if pivot_row is None:
            return 0
        if pivot_row != col:
            m[col], m[pivot_row] = m[pivot_row], m[col]
            det = -det
        det *= m[col][col]
        inv = m[col][col]
        for r in range(col + 1, size):
            factor = m[r][col] / inv
            if factor:
                for c in range(col, size):
                    m[r][c] -= factor * m[col][c]
    assert det.denominator == 1
    return int(det)


def _v_binary_search_steps(v: dict) -> int:
    """Halve the list until one item is left, counting probes.

    This is the loop the bound describes; floor(log2 n) + 1 is the closed form
    it is being checked against.
    """
    n = int(v["n"])
    steps = 0
    remaining = n
    while remaining >= 1:
        steps += 1
        remaining //= 2
    return steps


# ---------------------------------------------------------------------------
# the templates
# ---------------------------------------------------------------------------

DISCRETE_TEMPLATES: list[TemplateSpec] = [
    TemplateSpec(
        node="DM01",
        kind="numeric",
        stem="A compound proposition is built from {n} distinct variables. "
        "How many rows does its full truth table have?",
        variables=[_vint("n", 2, 8)],
        answer_expr="2**n",
        explanation="Each variable is independently true or false, so the rows "
        "are the 2^n assignments of n variables.",
        verifier=_v_truth_rows,
    ),
    TemplateSpec(
        node="DM03",
        kind="numeric",
        stem="The claim 'n^3 - n is divisible by 6 for every integer n' is "
        "true, because n^3 - n = (n-1)n(n+1) is a product of three "
        "consecutive integers. Verify it at n = {a} by computing "
        "(n^3 - n) / 6.",
        variables=[_vint("a", 2, 30)],
        answer_expr="(a**3 - a)/6",
        explanation="Among three consecutive integers one is divisible by 3 "
        "and at least one by 2, so the product is divisible by 6. "
        "Substituting a and dividing gives the quotient.",
        verifier=_v_cube_minus_n_over_6,
    ),
    TemplateSpec(
        node="DM04",
        kind="numeric",
        stem="Induction proves 1 + 2 + ... + n = n(n+1)/2. Use it to compute "
        "the sum of the integers from 1 to {n}.",
        variables=[_vint("n", 5, 60)],
        answer_expr="n*(n + 1)/2",
        explanation="The base case n=1 gives 1, and adding (k+1) to k(k+1)/2 "
        "gives (k+1)(k+2)/2, which is the statement at k+1.",
        verifier=_v_triangular,
    ),
    TemplateSpec(
        node="DM05",
        kind="numeric",
        stem="Sets A and B satisfy |A| = {a}, |B| = {b}, and |A n B| = {c}. "
        "Compute |A u B|.",
        variables=[_vint("a", 3, 20), _vint("b", 3, 20), _vint("c", 0, 20)],
        constraints=["c <= a", "c <= b"],
        answer_expr="a + b - c",
        explanation="Adding |A| and |B| counts the intersection twice, so "
        "subtract it once.",
        verifier=_v_union_size,
    ),
    TemplateSpec(
        node="DM06",
        kind="numeric",
        stem="How many injective (one-to-one) functions are there from a set "
        "of {k} elements into a set of {n} elements?",
        variables=[_vint("n", 3, 9), _vint("k", 1, 5)],
        constraints=["k <= n"],
        answer_expr="factorial(n)/factorial(n - k)",
        explanation="The first input has n choices, the next n-1, and so on "
        "for k inputs, which is n!/(n-k)!.",
        verifier=_v_injections,
    ),
    TemplateSpec(
        node="DM07",
        kind="numeric",
        stem="A set meal has {a} starters, {b} main courses and {c} desserts. "
        "Choosing one of each, how many different meals are possible?",
        variables=[_vint("a", 2, 9), _vint("b", 2, 9), _vint("c", 2, 9)],
        answer_expr="a*b*c",
        explanation="The choices are independent stages, so the product rule "
        "multiplies them.",
        verifier=_v_product_rule,
    ),
    TemplateSpec(
        node="DM09",
        kind="numeric",
        stem="{n} objects are placed into {k} boxes. By the pigeonhole "
        "principle, what is the largest number m such that some box is "
        "guaranteed to contain at least m objects?",
        variables=[_vint("n", 5, 60), _vint("k", 2, 9)],
        constraints=["k < n"],
        answer_expr="ceiling(n/k)",
        explanation="If every box held fewer than ceil(n/k), the total would "
        "fall short of n.",
        verifier=_v_pigeonhole,
    ),
    TemplateSpec(
        node="DM12",
        kind="numeric",
        stem="A graph has {n} vertices and every vertex has degree {d}. "
        "How many edges does it have?",
        variables=[_vint("n", 4, 16), _vint("d", 2, 7)],
        # The handshake lemma needs an even degree sum for such a graph to
        # exist at all; sampling that produced an odd sum would pose an
        # impossible question.
        constraints=["Mod(n*d, 2) == 0", "d < n"],
        answer_expr="n*d/2",
        explanation="The degrees sum to twice the number of edges, because "
        "each edge contributes 1 to each of its two endpoints.",
        verifier=_v_handshake,
    ),
    TemplateSpec(
        node="DM13",
        kind="numeric",
        stem="How many labelled spanning trees does the complete graph on "
        "{n} vertices have?",
        variables=[_vint("n", 3, 8)],
        answer_expr="n**(n - 2)",
        explanation="Cayley's formula: the labelled trees on n vertices are "
        "in bijection with the n^(n-2) Prufer sequences of length n-2.",
        verifier=_v_spanning_trees,
    ),
    TemplateSpec(
        node="DM14",
        kind="numeric",
        stem="Binary search halves the remaining range each probe. On a "
        "sorted list of {n} items, how many probes does the worst case "
        "take?",
        variables=[_vint("n", 2, 500)],
        answer_expr="floor(log(n, 2)) + 1",
        explanation="Each probe halves the range, so the worst case is the "
        "number of halvings needed to reach a single item: "
        "floor(log2 n) + 1.",
        verifier=_v_binary_search_steps,
    ),
]


def templates_by_node() -> dict[str, list[TemplateSpec]]:
    out: dict[str, list[TemplateSpec]] = {}
    for spec in DISCRETE_TEMPLATES:
        out.setdefault(spec.node, []).append(spec)
    return out


__all__ = ["DISCRETE_TEMPLATES", "TemplateSpec", "templates_by_node", "math"]
