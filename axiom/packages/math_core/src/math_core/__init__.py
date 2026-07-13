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
from .ode import grade_ode, verify_ode_key
from .transforms import (
    grade_fourier_transform,
    grade_laplace,
    verify_fourier_transform_key,
    verify_laplace_key,
)
from .fourier import grade_fourier_coefficient, verify_fourier_key
from .calculus import grade_antiderivative, verify_antiderivative_key
from .steps import grade_steps
from .linalg import (
    generate_unique_3x3,
    grade_determinant,
    grade_eigenvalues,
    grade_eigenvector,
    grade_rref,
    grade_solution_point,
    grade_solution_set,
    verify_determinant_key,
    verify_eigen_key,
    verify_linear_system_key,
    verify_unique_solution,
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
    "grade_rref",
    "grade_solution_point",
    "grade_solution_set",
    "grade_eigenvalues",
    "grade_eigenvector",
    "verify_eigen_key",
    "grade_determinant",
    "verify_determinant_key",
    "generate_unique_3x3",
    "verify_unique_solution",
    "verify_linear_system_key",
    "grade_ode",
    "verify_ode_key",
    "grade_laplace",
    "verify_laplace_key",
    "grade_fourier_transform",
    "verify_fourier_transform_key",
    "grade_fourier_coefficient",
    "verify_fourier_key",
    "grade_antiderivative",
    "verify_antiderivative_key",
    "grade_steps",
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
