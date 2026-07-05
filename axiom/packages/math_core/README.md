# axiom-math-core

SymPy-based math grading and parameterized-item core for the AXIOM math
platform (part of the EUREKA monorepo). This package backs the Phase 1 grading
service: it turns a student submission plus an expected answer into a structured
verdict, and it expands parameterized item templates into concrete, per-student
variants.

## Purpose

- Grade free-form math answers robustly (algebraic equivalence, numeric
  tolerance, and equation equivalence), returning a typed result rather than a
  bare boolean.
- Generate deterministic, per-seed variants of parameterized items so that each
  student sees different numbers while analytics can still aggregate at the
  template level.

## Public API

All of the following are importable from the top-level package:

    from math_core import (
        grade_expression,   # CAS grading of a student expression vs expected
        grade_numeric,      # numeric grading within abs/rel tolerance
        grade_equation,     # grade "lhs = rhs" equations by solution-set match
        symbolic_equal,     # robust symbolic equivalence of two strings
        resolve_template,   # deterministic template -> variant expansion
        ItemTemplate,       # parameterized item definition (pydantic model)
        ItemVariant,        # a concrete rendered item for one seed
        VarSpec,            # a single variable sampling spec
        GradeResult,        # structured verdict returned by every grader
    )

### GradeResult

Every grader returns a `GradeResult` with these fields:

- `is_correct` (bool)
- `score` (float, 0..1)
- `grader` (one of "cas", "exact", "numeric")
- `confidence` (float, 0..1)
- `detail` (str, human-readable explanation)
- `normalized_student` (str or None)
- `normalized_expected` (str or None)

Graders never raise on bad input. A parse error or evaluation failure is
reported through `detail` with `is_correct` False, so the grading service is
total (every submission gets a verdict).

### Grading examples

    grade_expression("2*x + 2", "2*(x+1)")        # equivalent -> correct
    grade_expression("(x-1)*(x+1)", "x**2-1", require_form="factored")  # correct
    grade_numeric("3.14159", "pi", rtol=1e-4)     # within tolerance -> correct
    grade_equation("y = 2*x + 4", "2*y = 4*x + 8")  # same line -> correct

`require_form` accepts None, "reduced", "factored", or "expanded". When set, the
student answer must be equivalent to the expected answer AND written in the
required form. The form checks are pragmatic and documented in the source.

### Templates example

    from math_core import ItemTemplate, VarSpec, resolve_template

    tmpl = ItemTemplate(
        id="linear-solve-001",
        variables=[
            VarSpec(name="a", kind="int", low=1, high=9, step=1),
            VarSpec(name="b", kind="int", low=-9, high=9, step=1),
        ],
        constraints=["a != 0", "b != 0"],
        stem="Solve for x: {a}*x + {b} = 0.",
        answer_expr="-b/a",
    )
    variant = resolve_template(tmpl, seed=42)   # deterministic for a given seed

The same seed always yields the identical variant. Different seeds generally
yield different variable values, while `template_id` stays constant so analytics
can aggregate across students at the template level. Constraints are re-checked
on every draw; if none of the bounded attempts satisfy them, a clear error is
raised.

## Safety

- No `eval` or `exec` is ever run on user input. Math strings are parsed with
  `sympy.parsing.sympy_parser.parse_expr` using a restricted transformations set
  and a local symbol table only.
- Every evaluation is wrapped in a wall-clock timeout. On the main thread this
  uses a signal-based guard; inside the Celery worker these functions run within
  the worker's own sandbox (process isolation plus per-task time limits), and
  the signal guard degrades to a no-op secondary bound off the main thread.

## Requirements

- Python 3.12
- sympy
- pydantic (version 2 or newer)

## Install and test

From the package directory:

    pip install sympy pydantic pytest
    python -m pytest -q

The package uses a src layout. The test suite adds `src` to the import path via
`tests/conftest.py`, so `python -m pytest -q` works without an editable install.
For an editable install into your environment instead:

    pip install -e .
    python -m pytest -q
