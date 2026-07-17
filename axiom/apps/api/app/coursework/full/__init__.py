"""Full-course tier: comprehensive >=20-page lessons.

Each module in this package exports LESSONS: dict[node_code, Lesson] exactly
like the base-tier modules, but every lesson here is a full course chapter of
AT LEAST 20 steps following the FC template:

 1. reading  Where you are and why this matters
 2. reading  Prerequisites check
 3. reading  The core idea, intuitively
 4. reading  The formal definition / statement
 5. example  First worked examples (basic)
 6. reading  Main properties and theorems
 7. example  Worked examples: standard problems
 8. reading  Techniques and strategy
 9. example  Worked examples: harder problems
10. reading  Special cases and edge behavior
11. example  Worked example: edge cases
12. pitfall  Common misconceptions
13. pitfall  Common computational errors
14. reading  Applications
15. example  Applied worked example
16. reading  Connections to the rest of the curriculum
17. reading  Going deeper
18. reading  Summary and formula sheet
19. check    Self-test with solutions
20. check    Mastery checklist

Modules are AUTO-DISCOVERED (any non-underscore .py file in this package), so
new batches never need a registration edit. Lessons in this tier OVERRIDE the
base-tier 5-step lesson for the same node; overlap WITHIN this tier is an
error.
"""

from __future__ import annotations

import importlib
import pkgutil


def full_modules() -> list:
    """Import and return every content module in this package, sorted by name."""
    mods = []
    for info in sorted(pkgutil.iter_modules(__path__), key=lambda m: m.name):
        if info.name.startswith("_"):
            continue
        mods.append(importlib.import_module(f"{__name__}.{info.name}"))
    return mods
