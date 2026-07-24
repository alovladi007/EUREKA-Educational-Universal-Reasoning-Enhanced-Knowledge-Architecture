"""All lessons, merged from the per tier authoring files.

One lesson per node is a compliance requirement, and app/compliance.py checks
that this dict covers every node in the curriculum with all six arc parts
present.
"""

from __future__ import annotations

from app.data.lesson_types import Lesson

LESSONS: dict[str, Lesson] = {}

try:
    from app.data.lessons_cf import LESSONS as _CF

    LESSONS.update(_CF)
except ImportError:  # pragma: no cover - tier not authored yet
    pass

try:
    from app.data.lessons_g1 import LESSONS as _G1

    LESSONS.update(_G1)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_g2 import LESSONS as _G2

    LESSONS.update(_G2)
except ImportError:  # pragma: no cover
    pass


def lesson_for(node_code: str) -> Lesson | None:
    return LESSONS.get(node_code)
