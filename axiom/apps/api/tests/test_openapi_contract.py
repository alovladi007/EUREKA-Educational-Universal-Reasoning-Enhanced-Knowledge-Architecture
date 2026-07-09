"""RW-7: OpenAPI contract test.

Asserts that the live app still serves every path in the committed OpenAPI
snapshot (openapi/axiom.v1.json), so removing or renaming a published endpoint
fails CI instead of silently breaking a consumer. New paths are allowed (the
snapshot is a floor, not a ceiling); to intentionally drop a path, regenerate the
snapshot in the same change.

The snapshot lives at the repo root (openapi/), which is present in a full
checkout (CI) but not in the apps/api-only container test harness, so the test
skips when it cannot find the snapshot rather than failing spuriously.
"""

from __future__ import annotations

import json
from pathlib import Path

import pytest


def _find_snapshot() -> Path | None:
    for parent in Path(__file__).resolve().parents:
        candidate = parent / "openapi" / "axiom.v1.json"
        if candidate.is_file():
            return candidate
    return None


def test_served_spec_covers_committed_snapshot():
    snapshot_path = _find_snapshot()
    if snapshot_path is None:
        pytest.skip("openapi/axiom.v1.json snapshot not present in this checkout")

    from app.main import create_app

    snapshot = json.loads(snapshot_path.read_text())
    served = create_app().openapi()
    served_paths = set(served.get("paths", {}).keys())

    missing = [p for p in snapshot.get("paths", []) if p not in served_paths]
    assert not missing, f"published paths no longer served (regenerate snapshot?): {missing}"

    assert served["info"]["version"] == snapshot["version"], (
        "API version changed; regenerate openapi/axiom.v1.json in the same change"
    )
