"""Every authored practice template must agree with an independent verifier.

This is the CI half of the gate; the seeder runs the same sweep and refuses to
write when it fails (app/seed_authored_templates.py). Both exist because a
check that can be skipped is not a check.
"""

from __future__ import annotations

import pytest

from app.verify_templates import ALL_TEMPLATES, check_spec


def test_there_are_templates_to_check() -> None:
    # A sweep over an empty list passes vacuously, which would make this whole
    # file a green light for nothing.
    assert ALL_TEMPLATES, "no authored templates are registered in ALL_TEMPLATES"


@pytest.mark.parametrize("spec", ALL_TEMPLATES, ids=lambda s: s.node)
def test_answer_key_matches_independent_path(spec) -> None:
    """The closed form and the second computational path must agree.

    120 seeds per template: enough that every sampler here repeats itself, so
    a disagreement that only shows on unusual values still surfaces.
    """
    result = check_spec(spec, seeds=120)
    assert result["distinct_stems"] > 1, (
        f"{spec.node} generated only one distinct stem over 120 seeds, so it "
        f"is not really parameterized"
    )
