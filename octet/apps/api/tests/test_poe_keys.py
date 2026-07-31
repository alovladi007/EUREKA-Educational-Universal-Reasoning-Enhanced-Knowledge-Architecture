"""Every POE answer key must agree with its own simulation.

OCTET already verifies this. simulations.py registers an outcome rule per item
through the @_rule decorator, run_scenario executes the item's scenario, and
test_phase3.test_every_poe_key_agrees_with_its_own_simulation runs the pair
over the whole registry. That check predates this file and works.

This file exists to widen the same guarantee, not to replace it. It adds the
cases the single Phase 3 assertion does not cover:

  - a new item whose author forgot to register a rule, which would otherwise
    surface as a KeyError rather than as the specific omission it is
  - option structure, so a distractor that keys no misconception or a key that
    is not among its own options fails here rather than at render time
  - every scenario being runnable at all, including the kinetics and gas
    engines, which have no other test that executes them end to end
  - a deliberately corrupted key, because a verification test that cannot fail
    is decoration

Author's note, kept because it cost time: the outcome-rule mechanism was
initially reported as missing from this codebase. It was not. The search was
for the lowercase spelling used in the module docstring rather than for the
OUTCOME_RULES identifier that implements it, and one empty grep became a
confident claim about a working system. The mechanism is intact and this file
builds on it.
"""

from __future__ import annotations

import pytest

from app.data.simulations import OUTCOME_RULES, POE_ITEMS, SCENARIOS, run_scenario
from chem_core.prediction import check_options, verify_prediction_key

ITEM_IDS = sorted(POE_ITEMS)


def test_there_are_items_to_check():
    # A registry that quietly emptied would make every parametrised test below
    # vacuously pass.
    assert len(ITEM_IDS) >= 8


@pytest.mark.parametrize("item_id", ITEM_IDS)
def test_key_agrees_with_its_simulation(item_id: str):
    item = POE_ITEMS[item_id]
    outcome = OUTCOME_RULES[item_id](run_scenario(item.scenario))
    verdict = verify_prediction_key(item, {"outcome": outcome})
    assert verdict.ok, f"{item_id}: {verdict.detail}"


@pytest.mark.parametrize("item_id", ITEM_IDS)
def test_every_item_carries_an_outcome_rule(item_id: str):
    """An item with no rule registered is one nobody is checking.

    OUTCOME_RULES is populated by the @_rule decorator at import time, so a
    new item whose author forgot to register a rule would otherwise slip
    through: the parametrised verification above would raise KeyError rather
    than reporting a missing rule, which reads as a crash instead of as the
    specific omission it is.
    """
    assert item_id in OUTCOME_RULES, f"{item_id} has no registered outcome rule"


@pytest.mark.parametrize("item_id", ITEM_IDS)
def test_options_are_structurally_sound(item_id: str):
    item = POE_ITEMS[item_id]
    problems = check_options(item.predict_options, item.predict_key)
    problems += check_options(item.explain_options, item.explain_key)
    assert not problems, f"{item_id}: {problems}"


@pytest.mark.parametrize("item_id", ITEM_IDS)
def test_item_points_at_a_real_scenario_and_node(item_id: str):
    item = POE_ITEMS[item_id]
    assert item.scenario in SCENARIOS
    assert item.node.startswith(("GEN1.", "GEN2.", "ORG1.", "ORG2."))
    # The scenario's node and the item's node need not match: one scenario can
    # carry items about different nodes, and the weak-acid titration carries
    # both an equivalence-point item and a buffer-region item.


@pytest.mark.parametrize("scenario_id", sorted(SCENARIOS))
def test_every_scenario_runs(scenario_id: str):
    """A scenario nobody can run is a scenario nobody can verify against."""
    result = run_scenario(scenario_id)
    assert isinstance(result, dict) and result


def test_wrong_key_is_actually_caught():
    """The guard must fail when it should, not merely pass when it should.

    A verification test that cannot fail is decoration, so this corrupts a key
    on purpose and requires the verifier to reject it.
    """
    from dataclasses import replace

    item = POE_ITEMS["poe.gas.boyle"]
    outcome = OUTCOME_RULES[item.id](run_scenario(item.scenario))
    wrong = replace(item, predict_key="halves")
    verdict = verify_prediction_key(wrong, {"outcome": outcome})
    assert not verdict.ok
    assert "halves" in verdict.detail and "doubles" in verdict.detail
