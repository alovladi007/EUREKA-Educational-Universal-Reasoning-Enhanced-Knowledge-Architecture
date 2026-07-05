"""Tests for the pure analytics export helpers.

These tests are standalone: they import only from the exports module, use no
fixtures, and touch no database. The PDF test is skipped automatically if
reportlab is not installed.
"""

from __future__ import annotations

import pytest

from app.domains.analytics.exports import to_csv, to_pdf

HEADERS = ["node", "p_known"]
ROWS = [["ALG.1", 0.9], ["ALG.2", None]]


def test_to_csv_header_and_rows() -> None:
    text = to_csv(HEADERS, ROWS)
    lines = text.splitlines()

    assert lines[0] == "node,p_known"
    assert "ALG.1" in text

    alg2_lines = [line for line in lines if line.startswith("ALG.2")]
    assert alg2_lines, "expected a line for ALG.2"
    assert alg2_lines[0] == "ALG.2,"


def test_to_pdf_starts_with_pdf_marker() -> None:
    pytest.importorskip("reportlab")

    data = to_pdf("Standards heatmap", HEADERS, ROWS)

    assert isinstance(data, bytes)
    assert len(data) > 0
    assert data.startswith(b"%PDF")
