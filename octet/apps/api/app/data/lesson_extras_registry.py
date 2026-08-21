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
    from app.data.extras_org1_ch2 import EXTRAS_ORG1_CH2 as _CH2

    EXTRAS.update(_CH2)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.extras_org1_ch3 import EXTRAS_ORG1_CH3 as _CH3

    EXTRAS.update(_CH3)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.extras_org1_ch4 import EXTRAS_ORG1_CH4 as _CH4

    EXTRAS.update(_CH4)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.extras_org1_ch4b import EXTRAS_ORG1_CH4B as _CH4B

    EXTRAS.update(_CH4B)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.extras_org1_ch5 import EXTRAS_ORG1_CH5 as _CH5

    EXTRAS.update(_CH5)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.extras_org1_ch6 import EXTRAS_ORG1_CH6 as _CH6

    EXTRAS.update(_CH6)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.extras_org1_ch7 import EXTRAS_ORG1_CH7 as _CH7

    EXTRAS.update(_CH7)
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

try:
    from app.data.extras_gen1_u5 import EXTRAS_GEN1_U5 as _G1U5

    EXTRAS.update(_G1U5)
except ImportError:  # pragma: no cover
    pass

try:
    from app.data.extras_gen1_u5b import EXTRAS_GEN1_U5B as _G1U5B

    EXTRAS.update(_G1U5B)
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
