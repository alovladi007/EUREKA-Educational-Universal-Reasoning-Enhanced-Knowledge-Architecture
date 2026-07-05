"""Test configuration: make the src-layout package importable without install.

Adds the package's src directory to sys.path so `import math_core` works when
running pytest directly from the package root, without requiring an editable
install first.
"""

from __future__ import annotations

import os
import sys

_HERE = os.path.dirname(os.path.abspath(__file__))
_SRC = os.path.abspath(os.path.join(_HERE, "..", "src"))
if _SRC not in sys.path:
    sys.path.insert(0, _SRC)
