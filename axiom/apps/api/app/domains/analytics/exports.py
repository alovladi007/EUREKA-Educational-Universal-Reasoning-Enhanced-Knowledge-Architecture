"""Pure export-formatting helpers for AXIOM analytics.

These functions are dependency-light and side-effect free. They take plain
Python data (headers and rows) and render it as CSV text or PDF bytes. There is
no database access and no web framework here, so the functions are easy to unit
test in isolation.

CSV rendering uses the standard library csv module. PDF rendering uses reportlab,
which is imported lazily inside to_pdf so that importing this module does not
require reportlab to be installed.
"""

from __future__ import annotations

import csv
import io


def _cell(value: object) -> str:
    """Render a single cell as a string, treating None as an empty string."""
    if value is None:
        return ""
    return str(value)


def to_csv(headers: list[str], rows: list[list]) -> str:
    """Render headers and rows as CSV text.

    The output has one header row followed by one row per entry in rows. Values
    may be strings, numbers, or None. None is rendered as an empty string. The
    csv module handles quoting, so values containing commas, quotes, or newlines
    are escaped correctly.
    """
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow([_cell(h) for h in headers])
    for row in rows:
        writer.writerow([_cell(value) for value in row])
    return buffer.getvalue()


def to_pdf(title: str, headers: list[str], rows: list[list]) -> bytes:
    """Render a title and a simple table of headers plus rows as PDF bytes.

    reportlab is imported here (not at module import time) so that this module
    can be imported without reportlab present. The returned bytes are a valid
    PDF document and start with the marker b"%PDF".
    """
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()

    table_data = [[_cell(h) for h in headers]]
    for row in rows:
        table_data.append([_cell(value) for value in row])

    table = Table(table_data)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ]
        )
    )

    story = [
        Paragraph(_cell(title), styles["Title"]),
        Spacer(1, 12),
        table,
    ]
    doc.build(story)
    return buffer.getvalue()
