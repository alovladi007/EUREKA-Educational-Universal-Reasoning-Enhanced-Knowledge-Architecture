"""Parameterized item templates and deterministic variant resolution.

An ItemTemplate declares a set of variables (with sampling specs), a list of
constraint strings (sympy boolean expressions that must all hold), a stem with
{var} placeholders, and an answer expression written in terms of the variables.

resolve_template samples concrete values for a given integer seed, honoring
step and range for each variable and re-sampling until every constraint holds.
It is deterministic: the same seed always yields the identical ItemVariant, and
different seeds generally yield different values (so analytics can aggregate
many students at the template level).
"""

from __future__ import annotations

import random
from typing import Literal

import sympy
from pydantic import BaseModel, Field, model_validator

from ._safe import build_local_symbols, safe_parse, time_limit
from ._safe import MathParseError, MathTimeoutError

VarKind = Literal["int", "float", "choice"]


class TemplateError(Exception):
    """Raised when a template is malformed or cannot be resolved."""


class VarSpec(BaseModel):
    """Sampling specification for a single template variable."""

    name: str
    kind: VarKind
    low: float | None = None
    high: float | None = None
    step: float | None = None
    choices: list[str] | None = None

    @model_validator(mode="after")
    def _validate(self) -> "VarSpec":
        if self.kind in ("int", "float"):
            if self.low is None or self.high is None:
                raise ValueError(
                    f"variable {self.name!r} of kind {self.kind} requires low and high"
                )
            if self.low > self.high:
                raise ValueError(
                    f"variable {self.name!r} has low > high ({self.low} > {self.high})"
                )
        if self.kind == "choice":
            if not self.choices:
                raise ValueError(
                    f"variable {self.name!r} of kind choice requires a non-empty choices list"
                )
        return self


class ItemTemplate(BaseModel):
    """A parameterized item that expands into concrete variants."""

    id: str
    variables: list[VarSpec]
    constraints: list[str] = Field(default_factory=list)
    stem: str
    answer_expr: str
    tolerance: float | None = None

    @model_validator(mode="after")
    def _validate(self) -> "ItemTemplate":
        seen: set[str] = set()
        for var in self.variables:
            if var.name in seen:
                raise ValueError(f"duplicate variable name {var.name!r}")
            seen.add(var.name)
        return self


class ItemVariant(BaseModel):
    """A concrete, rendered instance of an ItemTemplate for one seed."""

    template_id: str
    seed: int
    values: dict[str, float | str]
    stem: str
    answer: str


def _sample_one(spec: VarSpec, rng: random.Random) -> float | str:
    """Sample a single value for a variable spec using the given RNG."""
    if spec.kind == "choice":
        assert spec.choices is not None
        return rng.choice(spec.choices)

    assert spec.low is not None and spec.high is not None
    if spec.kind == "int":
        step = int(spec.step) if spec.step else 1
        if step <= 0:
            step = 1
        low = int(spec.low)
        high = int(spec.high)
        n_steps = (high - low) // step
        if n_steps < 0:
            raise TemplateError(f"variable {spec.name!r} has an empty integer range")
        k = rng.randint(0, n_steps)
        return float(low + k * step)

    # float
    if spec.step:
        n_steps = int(round((spec.high - spec.low) / spec.step))
        if n_steps < 0:
            raise TemplateError(f"variable {spec.name!r} has an empty float range")
        k = rng.randint(0, n_steps)
        return float(spec.low + k * spec.step)
    return float(rng.uniform(spec.low, spec.high))


def _to_sympy_value(value: float | str) -> object:
    """Convert a sampled value into something sympy can substitute."""
    if isinstance(value, str):
        # Choice values may be numeric strings or symbolic tokens.
        try:
            return sympy.Integer(int(value))
        except (ValueError, TypeError):
            try:
                return sympy.Float(float(value))
            except (ValueError, TypeError):
                return sympy.Symbol(value, real=True)
    # Numeric: prefer an exact Integer when the float is whole.
    if float(value).is_integer():
        return sympy.Integer(int(value))
    return sympy.Float(value)


# Relational operators recognized in constraint strings, longest first so that
# ">=" is matched before ">" and "!=" before "!". Each maps to a sympy
# relational constructor. We build the relation explicitly rather than relying
# on Python operator evaluation, because a bare "a != 0" on Symbol objects would
# evaluate to a plain Python bool instead of a sympy relational.
_RELATIONS: tuple[tuple[str, object], ...] = (
    ("==", sympy.Eq),
    ("!=", sympy.Ne),
    (">=", sympy.Ge),
    ("<=", sympy.Le),
    (">", sympy.Gt),
    ("<", sympy.Lt),
    ("=", sympy.Eq),
)


def _evaluate_constraint(
    raw: str,
    subs: dict[str, object],
    local: dict[str, sympy.Symbol],
) -> bool:
    """Evaluate a single relational constraint under a substitution.

    Splits on the first top-level relational operator, parses each side with the
    safe parser, substitutes the sampled values, and evaluates the relation with
    the matching sympy relational constructor. Returns a Python bool.
    """
    for token, ctor in _RELATIONS:
        idx = raw.find(token)
        if idx == -1:
            continue
        lhs_text = raw[:idx].strip()
        rhs_text = raw[idx + len(token) :].strip()
        if not lhs_text or not rhs_text:
            raise TemplateError(f"malformed constraint: {raw!r}")
        try:
            with time_limit(4.0):
                lhs = safe_parse(lhs_text, local_symbols=local).subs(subs)
                rhs = safe_parse(rhs_text, local_symbols=local).subs(subs)
                relation = ctor(lhs, rhs)
        except (MathParseError, MathTimeoutError):
            raise TemplateError(f"could not evaluate constraint: {raw!r}")
        # For concrete numbers, sympy relationals collapse to sympy.true/false.
        if relation in (sympy.true, True):
            return True
        if relation in (sympy.false, False):
            return False
        try:
            simplified = sympy.simplify(relation)
        except Exception:  # noqa: BLE001
            simplified = relation
        if simplified in (sympy.true, True):
            return True
        if simplified in (sympy.false, False):
            return False
        # Undetermined (still symbolic): treat as not satisfied so the sampler
        # keeps drawing concrete values.
        return False
    raise TemplateError(f"constraint has no recognized relational operator: {raw!r}")


def _constraints_hold(
    constraints: list[str],
    subs: dict[str, object],
    local: dict[str, sympy.Symbol],
) -> bool:
    """Evaluate every constraint under a substitution; all must be True."""
    for raw in constraints:
        if not _evaluate_constraint(raw, subs, local):
            return False
    return True


def _render_stem(stem: str, values: dict[str, float | str]) -> str:
    """Render {var} placeholders, formatting whole floats as integers."""
    rendered: dict[str, str] = {}
    for name, value in values.items():
        if isinstance(value, float) and value.is_integer():
            rendered[name] = str(int(value))
        else:
            rendered[name] = str(value)
    try:
        return stem.format(**rendered)
    except KeyError as exc:
        raise TemplateError(f"stem references unknown placeholder: {exc}")
    except (IndexError, ValueError) as exc:
        raise TemplateError(f"could not render stem: {exc}")


def resolve_template(template: ItemTemplate, seed: int) -> ItemVariant:
    """Deterministically expand a template into a concrete variant.

    Given the same seed, this always returns the identical ItemVariant. Values
    are sampled with random.Random(seed) so the process is reproducible. The
    sampler re-draws (up to a bounded number of attempts) until all constraints
    are satisfied; if none of the attempts satisfy the constraints, a
    TemplateError is raised.
    """
    rng = random.Random(seed)
    var_names = [v.name for v in template.variables]
    local = build_local_symbols(set(var_names))

    max_attempts = 2000
    values: dict[str, float | str] | None = None
    for _ in range(max_attempts):
        candidate: dict[str, float | str] = {
            spec.name: _sample_one(spec, rng) for spec in template.variables
        }
        subs = {local[name]: _to_sympy_value(val) for name, val in candidate.items()}
        if not template.constraints or _constraints_hold(
            template.constraints, subs, local
        ):
            values = candidate
            break

    if values is None:
        raise TemplateError(
            "could not satisfy constraints after "
            f"{max_attempts} attempts; template may be unsatisfiable"
        )

    # Build the answer by substituting values into the answer expression and
    # simplifying to a canonical normalized string.
    try:
        with time_limit(6.0):
            answer_expr = safe_parse(template.answer_expr, local_symbols=local)
            subs = {local[name]: _to_sympy_value(val) for name, val in values.items()}
            answer_val = sympy.simplify(answer_expr.subs(subs))
            answer_str = str(answer_val)
    except (MathParseError, MathTimeoutError) as exc:
        raise TemplateError(f"could not evaluate answer expression: {exc}")

    stem = _render_stem(template.stem, values)

    return ItemVariant(
        template_id=template.id,
        seed=seed,
        values=values,
        stem=stem,
        answer=answer_str,
    )
