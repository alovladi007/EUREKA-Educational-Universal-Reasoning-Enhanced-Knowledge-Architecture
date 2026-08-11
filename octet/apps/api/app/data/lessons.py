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


try:
    from app.data.lessons_org_rechapter import LESSONS_ORG_RECHAPTER as _ORG_RE

    LESSONS.update(_ORG_RE)
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

try:
    from app.data.lessons_org1_u6 import LESSONS_ORG1_U6 as _ORG1_U6

    LESSONS.update(_ORG1_U6)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_org2_u1 import LESSONS_ORG2_U1 as _ORG2_U1

    LESSONS.update(_ORG2_U1)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_org2_u2 import LESSONS_ORG2_U2 as _ORG2_U2

    LESSONS.update(_ORG2_U2)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_org2_u3 import LESSONS_ORG2_U3 as _ORG2_U3

    LESSONS.update(_ORG2_U3)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_org2_u4 import LESSONS_ORG2_U4 as _ORG2_U4

    LESSONS.update(_ORG2_U4)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_org2_u5 import LESSONS_ORG2_U5 as _ORG2_U5

    LESSONS.update(_ORG2_U5)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_org2_u6 import LESSONS_ORG2_U6 as _ORG2_U6

    LESSONS.update(_ORG2_U6)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_org2_u7 import LESSONS_ORG2_U7 as _ORG2_U7

    LESSONS.update(_ORG2_U7)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_org2_u8 import LESSONS_ORG2_U8 as _ORG2_U8

    LESSONS.update(_ORG2_U8)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_org2_u9 import LESSONS_ORG2_U9 as _ORG2_U9

    LESSONS.update(_ORG2_U9)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_org2_u10 import LESSONS_ORG2_U10 as _ORG2_U10

    LESSONS.update(_ORG2_U10)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_gen1_fill_a import LESSONS_GEN1_FILL_A as _LESSONS_GEN1_FILL_A

    LESSONS.update(_LESSONS_GEN1_FILL_A)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_gen1_fill_b import LESSONS_GEN1_FILL_B as _LESSONS_GEN1_FILL_B

    LESSONS.update(_LESSONS_GEN1_FILL_B)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_gen1_fill_c import LESSONS_GEN1_FILL_C as _LESSONS_GEN1_FILL_C

    LESSONS.update(_LESSONS_GEN1_FILL_C)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_gen1_fill_d import LESSONS_GEN1_FILL_D as _LESSONS_GEN1_FILL_D

    LESSONS.update(_LESSONS_GEN1_FILL_D)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_gen1_fill_e import LESSONS_GEN1_FILL_E as _LESSONS_GEN1_FILL_E

    LESSONS.update(_LESSONS_GEN1_FILL_E)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_gen2_fill_a import LESSONS_GEN2_FILL_A as _LESSONS_GEN2_FILL_A

    LESSONS.update(_LESSONS_GEN2_FILL_A)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_gen2_fill_b import LESSONS_GEN2_FILL_B as _LESSONS_GEN2_FILL_B

    LESSONS.update(_LESSONS_GEN2_FILL_B)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_gen2_fill_c import LESSONS_GEN2_FILL_C as _LESSONS_GEN2_FILL_C

    LESSONS.update(_LESSONS_GEN2_FILL_C)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.lessons_gen2_fill_d import LESSONS_GEN2_FILL_D as _LESSONS_GEN2_FILL_D

    LESSONS.update(_LESSONS_GEN2_FILL_D)
except ImportError:  # pragma: no cover
    pass
