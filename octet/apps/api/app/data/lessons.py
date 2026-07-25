"""All lessons, merged from the per course authoring files.

Lessons are keyed by curriculum node code. app/compliance.py checks that every
lesson lands on a real node with all six arc parts present.

lessons_superseded.py is deliberately not merged here. It holds one lesson that
the course based map has no distinct node for, retained for a human to fold in
rather than deleted. Merging it would put two lessons on one node.
"""

from __future__ import annotations

from app.data.lesson_types import Lesson

LESSONS: dict[str, Lesson] = {}

try:
    from app.data.lessons_gen1 import LESSONS as _GEN1

    LESSONS.update(_GEN1)
except ImportError:  # pragma: no cover - course not authored yet
    pass

try:
    from app.data.lessons_gen2 import LESSONS as _GEN2

    LESSONS.update(_GEN2)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_org1_u4 import LESSONS_ORG1_U4 as _ORG1_U4

    LESSONS.update(_ORG1_U4)
except ImportError:  # pragma: no cover
    pass


def lesson_for(node_code: str) -> Lesson | None:
    return LESSONS.get(node_code)
