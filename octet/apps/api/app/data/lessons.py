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

try:
    from app.data.lessons_org1_u1 import LESSONS_ORG1_U1 as _ORG1_U1

    LESSONS.update(_ORG1_U1)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_org1_u2 import LESSONS_ORG1_U2 as _ORG1_U2

    LESSONS.update(_ORG1_U2)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_org1_u3 import LESSONS_ORG1_U3 as _ORG1_U3

    LESSONS.update(_ORG1_U3)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_org1_u5 import LESSONS_ORG1_U5 as _ORG1_U5

    LESSONS.update(_ORG1_U5)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_org1_u7 import LESSONS_ORG1_U7 as _ORG1_U7

    LESSONS.update(_ORG1_U7)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_org1_u8 import LESSONS_ORG1_U8 as _ORG1_U8

    LESSONS.update(_ORG1_U8)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_org1_u9 import LESSONS_ORG1_U9 as _ORG1_U9

    LESSONS.update(_ORG1_U9)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_org1_u10 import LESSONS_ORG1_U10 as _ORG1_U10

    LESSONS.update(_ORG1_U10)
except ImportError:  # pragma: no cover
    pass
