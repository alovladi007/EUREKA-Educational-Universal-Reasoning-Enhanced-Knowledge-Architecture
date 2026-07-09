"""RW-8: graphical / image question types.

hotspot (click a region), image_labeling (place labels), construct_shape
(build a polygon), transform_figure (image of a figure under a transformation).
All grade deterministically.
"""

from __future__ import annotations

import json

from app.domains.grading.service import grade


def test_hotspot_click_inside_and_outside_region():
    meta = {"regions": [[0, 0, 10, 10], [20, 20, 5, 5]]}
    inside = grade("hotspot", "", json.dumps([5, 5]), meta=meta)
    assert inside.is_correct is True
    inside2 = grade("hotspot", "", json.dumps([22, 22]), meta=meta)
    assert inside2.is_correct is True
    outside = grade("hotspot", "", json.dumps([50, 50]), meta=meta)
    assert outside.is_correct is False
    bad = grade("hotspot", "", "not-a-point", meta=meta)
    assert bad.is_correct is False


def test_image_labeling_pair_match():
    key = json.dumps([["Nucleus", "r1"], ["Membrane", "r2"]])
    correct = grade("image_labeling", key, json.dumps([["Membrane", "r2"], ["Nucleus", "r1"]]))
    assert correct.is_correct is True  # order of pairs does not matter
    wrong = grade("image_labeling", key, json.dumps([["Nucleus", "r2"], ["Membrane", "r1"]]))
    assert wrong.is_correct is False


def test_construct_shape_is_order_independent():
    key = json.dumps([[0, 0], [1, 0], [0, 1]])
    correct = grade("construct_shape", key, json.dumps([[0, 1], [0, 0], [1, 0]]))
    assert correct.is_correct is True
    missing = grade("construct_shape", key, json.dumps([[0, 0], [1, 0]]))
    assert missing.is_correct is False


def test_transform_figure_point_set_match():
    # Reflect {(0,1),(1,0)} over the x-axis -> {(0,-1),(1,0)}.
    key = json.dumps([[0, -1], [1, 0]])
    correct = grade("transform_figure", key, json.dumps([[1, 0], [0, -1]]))
    assert correct.is_correct is True
    wrong = grade("transform_figure", key, json.dumps([[0, 1], [1, 0]]))
    assert wrong.is_correct is False
