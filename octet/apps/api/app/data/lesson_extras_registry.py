"""Every chapter's lecture-note extras, in one dict keyed by node code.

Same import-with-fallback shape as app/data/lessons.py, for the same reason:
an authoring module that fails to import must not take the API down with it.
A missing module means that chapter renders as the six part arc alone, which
is the honest degraded state and exactly what an unauthored node shows.
"""

from __future__ import annotations

from app.data.lesson_extras import LessonExtras

EXTRAS: dict[str, LessonExtras] = {}

try:
    from app.data.extras_org1_ch1 import EXTRAS_ORG1_CH1 as _CH1

    EXTRAS.update(_CH1)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.extras_org1_ch1b import EXTRAS_ORG1_CH1B as _CH1B

    EXTRAS.update(_CH1B)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.extras_gen1_u4 import EXTRAS_GEN1_U4 as _G1U4

    EXTRAS.update(_G1U4)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.extras_gen1_u4b import EXTRAS_GEN1_U4B as _G1U4B

    EXTRAS.update(_G1U4B)
except ImportError:  # pragma: no cover
    pass


def extras_for(node_code: str) -> LessonExtras | None:
    return EXTRAS.get(node_code)


def authored_nodes() -> list[str]:
    """Node codes carrying lecture-note depth, for the coverage figures.

    The Learn page states how many nodes have a chapter as distinct from how
    many have a lesson, because those are different numbers and reporting only
    the larger one would overstate what the course contains.
    """
    return sorted(EXTRAS)
