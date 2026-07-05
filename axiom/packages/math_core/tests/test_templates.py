"""Tests for the templates module: deterministic variant resolution."""

from __future__ import annotations

import pytest

from math_core import ItemTemplate, ItemVariant, VarSpec, resolve_template
from math_core.templates import TemplateError


def _linear_template() -> ItemTemplate:
    return ItemTemplate(
        id="linear-solve-001",
        variables=[
            VarSpec(name="a", kind="int", low=1, high=9, step=1),
            VarSpec(name="b", kind="int", low=-9, high=9, step=1),
        ],
        constraints=["a != 0", "b != 0"],
        stem="Solve for x: {a}*x + {b} = 0.",
        answer_expr="-b/a",
        tolerance=None,
    )


def test_resolve_is_deterministic() -> None:
    tmpl = _linear_template()
    v1 = resolve_template(tmpl, seed=42)
    v2 = resolve_template(tmpl, seed=42)
    assert isinstance(v1, ItemVariant)
    assert v1.model_dump() == v2.model_dump()
    assert v1.values == v2.values
    assert v1.stem == v2.stem
    assert v1.answer == v2.answer


def test_two_seeds_differ_but_same_template_id() -> None:
    tmpl = _linear_template()
    variants = [resolve_template(tmpl, seed=s) for s in range(20)]
    # All share the same template id (analytics aggregate at template level).
    assert all(v.template_id == "linear-solve-001" for v in variants)
    # Across many seeds we see more than one distinct value assignment.
    distinct = {tuple(sorted(v.values.items())) for v in variants}
    assert len(distinct) > 1


def test_constraints_are_honored_across_many_seeds() -> None:
    tmpl = _linear_template()
    for seed in range(300):
        v = resolve_template(tmpl, seed=seed)
        assert v.values["a"] != 0
        assert v.values["b"] != 0


def test_answer_is_evaluated_and_normalized() -> None:
    tmpl = _linear_template()
    v = resolve_template(tmpl, seed=7)
    a = v.values["a"]
    b = v.values["b"]
    # answer_expr is -b/a; verify the normalized answer equals that value.
    from math_core import grade_numeric

    expected = f"-({b})/({a})"
    res = grade_numeric(v.answer, expected)
    assert res.is_correct is True, (v.answer, expected, res.detail)


def test_choice_variable() -> None:
    tmpl = ItemTemplate(
        id="choice-001",
        variables=[
            VarSpec(name="op", kind="choice", choices=["2", "3", "5"]),
            VarSpec(name="n", kind="int", low=1, high=4, step=1),
        ],
        constraints=[],
        stem="Compute {op} times {n}.",
        answer_expr="op*n",
    )
    v = resolve_template(tmpl, seed=1)
    assert v.values["op"] in ("2", "3", "5")
    assert v.template_id == "choice-001"
    v_same = resolve_template(tmpl, seed=1)
    assert v.values == v_same.values


def test_float_step_sampling_is_on_grid() -> None:
    tmpl = ItemTemplate(
        id="float-grid-001",
        variables=[
            VarSpec(name="c", kind="float", low=0.0, high=1.0, step=0.25),
        ],
        constraints=[],
        stem="Value is {c}.",
        answer_expr="c*4",
    )
    seen = set()
    for seed in range(50):
        v = resolve_template(tmpl, seed=seed)
        c = float(v.values["c"])
        # c must land on the 0.25 grid.
        assert abs((c / 0.25) - round(c / 0.25)) < 1e-9
        seen.add(round(c, 4))
    assert seen.issubset({0.0, 0.25, 0.5, 0.75, 1.0})


def test_unsatisfiable_constraints_raise() -> None:
    tmpl = ItemTemplate(
        id="bad-001",
        variables=[VarSpec(name="a", kind="int", low=1, high=3, step=1)],
        constraints=["a > 100"],
        stem="{a}",
        answer_expr="a",
    )
    with pytest.raises(TemplateError):
        resolve_template(tmpl, seed=0)


def test_duplicate_variable_names_rejected() -> None:
    with pytest.raises(Exception):
        ItemTemplate(
            id="dup",
            variables=[
                VarSpec(name="a", kind="int", low=1, high=2, step=1),
                VarSpec(name="a", kind="int", low=1, high=2, step=1),
            ],
            constraints=[],
            stem="{a}",
            answer_expr="a",
        )
