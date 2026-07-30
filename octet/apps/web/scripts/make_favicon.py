#!/usr/bin/env python3
"""Rasterise app/icon.svg into public/favicon.ico.

The SVG is the source of truth for the mark. This exists because browsers
request /favicon.ico directly by convention, and a binary committed with no
way to regenerate it is a file nobody can safely change later.

The geometry below is duplicated from app/icon.svg rather than parsed out of
it, so the two must be edited together. That is a deliberate trade: parsing
SVG would mean a dependency, and this mark is nine shapes.

Run from apps/web:

    python3 scripts/make_favicon.py

Requires only the standard library. Emits a single 32x32 BGRA image inside an
ICO container, which every browser in use reads.
"""

from __future__ import annotations

import struct
from pathlib import Path

SIZE = 32
# Supersampling factor. The mark is circles on a rounded rect, so edge quality
# is the whole game at 16 device pixels.
SS = 8

BRAND = (0x02, 0x84, 0xC7)  # brand-600, the EUREKA blue
WHITE = (0xFF, 0xFF, 0xFF)

CORNER_RADIUS = 7.0
RING_RADIUS = 9.5
RING_WIDTH = 1.25
RING_ALPHA = 0.35
DOT_RADIUS = 2.6

# The eight valence electrons, at 45 degree steps from the top.
DOTS = [
    (16.0, 6.5),
    (22.72, 9.28),
    (25.5, 16.0),
    (22.72, 22.72),
    (16.0, 25.5),
    (9.28, 22.72),
    (6.5, 16.0),
    (9.28, 9.28),
]


def in_rounded_rect(x: float, y: float) -> bool:
    """Inside a SIZE x SIZE rect with CORNER_RADIUS corners."""
    r = CORNER_RADIUS
    cx = min(max(x, r), SIZE - r)
    cy = min(max(y, r), SIZE - r)
    if x == cx or y == cy:
        return 0 <= x <= SIZE and 0 <= y <= SIZE
    return (x - cx) ** 2 + (y - cy) ** 2 <= r * r


def in_circle(x: float, y: float, cx: float, cy: float, radius: float) -> bool:
    return (x - cx) ** 2 + (y - cy) ** 2 <= radius * radius


def in_ring(x: float, y: float) -> bool:
    d = ((x - 16.0) ** 2 + (y - 16.0) ** 2) ** 0.5
    return abs(d - RING_RADIUS) <= RING_WIDTH / 2.0


def sample(x: float, y: float) -> tuple[int, int, int, float]:
    """Colour and coverage at one subsample point."""
    if not in_rounded_rect(x, y):
        return (0, 0, 0, 0.0)
    for cx, cy in DOTS:
        if in_circle(x, y, cx, cy, DOT_RADIUS):
            return (*WHITE, 1.0)
    if in_ring(x, y):
        # The faint shell, composited over the brand fill.
        r = round(BRAND[0] + (WHITE[0] - BRAND[0]) * RING_ALPHA)
        g = round(BRAND[1] + (WHITE[1] - BRAND[1]) * RING_ALPHA)
        b = round(BRAND[2] + (WHITE[2] - BRAND[2]) * RING_ALPHA)
        return (r, g, b, 1.0)
    return (*BRAND, 1.0)


def render() -> list[list[tuple[int, int, int, int]]]:
    rows: list[list[tuple[int, int, int, int]]] = []
    step = 1.0 / SS
    offset = step / 2.0
    for py in range(SIZE):
        row: list[tuple[int, int, int, int]] = []
        for px in range(SIZE):
            acc_r = acc_g = acc_b = acc_a = 0.0
            for sy in range(SS):
                for sx in range(SS):
                    x = px + offset + sx * step
                    y = py + offset + sy * step
                    r, g, b, a = sample(x, y)
                    acc_r += r * a
                    acc_g += g * a
                    acc_b += b * a
                    acc_a += a
            n = SS * SS
            if acc_a == 0:
                row.append((0, 0, 0, 0))
            else:
                row.append(
                    (
                        round(acc_r / acc_a),
                        round(acc_g / acc_a),
                        round(acc_b / acc_a),
                        round(255 * acc_a / n),
                    )
                )
        rows.append(row)
    return rows


def ico_bytes(rows: list[list[tuple[int, int, int, int]]]) -> bytes:
    """A one-image ICO holding a 32-bit BMP (DIB), bottom-up BGRA."""
    # BITMAPINFOHEADER: height is doubled to account for the AND mask, which
    # is required to be present even when the image carries its own alpha.
    header = struct.pack(
        "<IiiHHIIiiII", 40, SIZE, SIZE * 2, 1, 32, 0, SIZE * SIZE * 4, 0, 0, 0, 0
    )
    pixels = bytearray()
    for row in reversed(rows):
        for r, g, b, a in row:
            pixels += bytes((b, g, r, a))
    # AND mask: one bit per pixel, rows padded to 4 bytes. All zero, meaning
    # "use the alpha channel".
    mask = bytes((SIZE // 8 + (0 if (SIZE // 8) % 4 == 0 else 4 - (SIZE // 8) % 4)) * SIZE)
    image = header + bytes(pixels) + mask

    # ICONDIR + one ICONDIRENTRY, then the image.
    icondir = struct.pack("<HHH", 0, 1, 1)
    entry = struct.pack(
        "<BBBBHHII", SIZE, SIZE, 0, 0, 1, 32, len(image), 6 + 16
    )
    return icondir + entry + image


def main() -> None:
    out = Path(__file__).resolve().parent.parent / "public" / "favicon.ico"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(ico_bytes(render()))
    print(f"wrote {out} ({out.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
