"""axiom-math-core: SymPy-based math grading and parameterized-item core.

Public API:
    grade_expression  -- CAS grading of a student expression vs an expected one.
    grade_numeric     -- numeric grading within absolute/relative tolerance.
    grade_equation    -- grade "lhs = rhs" equations by solution-set match.
    symbolic_equal    -- robust symbolic equivalence of two expression strings.
    resolve_template  -- deterministic expansion of a template into a variant.
    ItemTemplate      -- parameterized item definition.
    ItemVariant       -- a concrete rendered item for one seed.
    GradeResult       -- structured verdict returned by every grader.
    check_counterexample -- deterministic test of a counterexample against a
                            property predicate (Curriculum & Proof Extension).
"""

from __future__ import annotations

from .grading import (
    GradeResult,
    grade_equation,
    grade_expression,
    grade_inequality,
    grade_numeric,
    symbolic_equal,
)
from .proof import check_counterexample
from .solutions import (
    SolutionCheck,
    SolutionStep,
    linear_equation_steps,
    verify_steps,
)
from .templates import ItemTemplate, ItemVariant, VarSpec, resolve_template

__version__ = "0.1.0"

__all__ = [
    "grade_expression",
    "grade_numeric",
    "grade_equation",
    "grade_inequality",
    "symbolic_equal",
    "check_counterexample",
    "resolve_template",
    "ItemTemplate",
    "ItemVariant",
    "VarSpec",
    "GradeResult",
    "verify_steps",
    "linear_equation_steps",
    "SolutionStep",
    "SolutionCheck",
    "__version__",
]
