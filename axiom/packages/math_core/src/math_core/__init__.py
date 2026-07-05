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
"""

from __future__ import annotations

from .grading import (
    GradeResult,
    grade_equation,
    grade_expression,
    grade_numeric,
    symbolic_equal,
)
from .templates import ItemTemplate, ItemVariant, VarSpec, resolve_template

__version__ = "0.1.0"

__all__ = [
    "grade_expression",
    "grade_numeric",
    "grade_equation",
    "symbolic_equal",
    "resolve_template",
    "ItemTemplate",
    "ItemVariant",
    "VarSpec",
    "GradeResult",
    "__version__",
]
