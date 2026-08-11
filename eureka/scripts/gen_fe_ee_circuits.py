#!/usr/bin/env python3
"""Circuit SCHEMATICS for the FE Electrical and Computer course.

Companion to gen_fe_ee_figures.py, which draws computed graphs. This file
draws the other thing an electrical course needs and a plot cannot give you:
the circuit itself, with real component symbols, node labels and annotated
values. A lesson that says "a 12 V source drives 4 ohm in series with 6 ohm
parallel 12 ohm" is far harder to hold in the head than the same thing drawn.

Schematics are BUILT here from schemdraw primitives, not traced from any
book. The topology is the one the worked example states, so the drawing and
the arithmetic cannot drift apart.

Each schematic renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as an ordinary markdown image whose ALT TEXT
IS THE CAPTION.

Usage:
    python3 scripts/gen_fe_ee_circuits.py            # all
    python3 scripts/gen_fe_ee_circuits.py sch-dc     # matching prefix only
"""
from __future__ import annotations

import io
import pathlib
import re
import sys

import schemdraw
import schemdraw.elements as e
from schemdraw import drawing_stack

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "fe-ee" / "figures"
)

# Ink per theme. Same values ed_figstyle uses, so schematics and plots sit
# together on a page without one looking foreign.
INK = {"light": "#0b0b0b", "dark": "#ffffff"}

REGISTRY: dict[str, callable] = {}


def schematic(name):
    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# Circuit Analysis
# ---------------------------------------------------------------------------


@schematic("sch-dc-ladder")
def _(d):
    """The 12 V / 4 ohm / (6 || 12) ladder solved in the worked example."""
    d += (V := e.SourceV().up().label("12 V", loc="bottom"))
    d += e.Line().right().length(1)
    d += e.Resistor().right().label(["R1", "4 Ω"])
    d += e.Dot().label("A", loc="top")
    d.push()
    d += e.Resistor().down().label(["R2", "6 Ω"], loc="bottom")
    d += e.Line().left().length(1)
    d.pop()
    d += e.Line().right().length(1.6)
    d += e.Resistor().down().label(["R3", "12 Ω"], loc="bottom")
    d += e.Line().left().length(1.6)
    d += e.Line().left().tox(V.start)
    d += e.Ground()


@schematic("sch-thevenin-pair")
def _(d):
    """The same one-port as a Thevenin source and as its Norton equivalent.

    Drawn from explicit coordinates rather than a moving cursor. The cursor
    form of this drawing put the current source, RN and the a-b leg on top of
    one another, because push/pop restores a POSITION but not the direction
    the next element will take, and one wrong turn silently stacks the rest of
    the branch. Coordinates cannot drift.
    """
    def one_port(d, ox, src, src_label, r_label, title):
        # left branch: source from (ox,0) up to (ox,3)
        d += src().at((ox, 0)).to((ox, 3)).label(src_label, loc="bottom")
        if r_label is None:                     # Thevenin: R is in SERIES
            d += e.Resistor().at((ox, 3)).to((ox + 3, 3)).label(["Rth", "2 Ω"])
            node_x = ox + 3
        else:                                   # Norton: R is in PARALLEL
            # 2.6 units of gap, not 1.4. A vertical resistor puts its label to
            # one side, and at 1.4 that label lands on top of the source's own
            # label. Clearance is geometry, so fix it with geometry rather than
            # by guessing at a loc= that moves it somewhere equally arbitrary.
            d += e.Line().at((ox, 3)).to((ox + 2.6, 3))
            d += e.Dot().at((ox + 2.6, 3))
            d += e.Resistor().at((ox + 2.6, 3)).to((ox + 2.6, 0)).label(r_label)
            d += e.Dot().at((ox + 2.6, 0))
            d += e.Line().at((ox + 2.6, 0)).to((ox, 0))
            node_x = ox + 2.6
        # terminals a-b, open circles, the port the equivalence is about
        d += e.Line().at((node_x, 3)).to((node_x + 1.3, 3))
        d += e.Dot(open=True).at((node_x + 1.3, 3)).label("a", loc="right")
        d += e.Dot(open=True).at((node_x + 1.3, 0)).label("b", loc="right")
        d += e.Line().at((node_x, 0)).to((node_x + 1.3, 0))
        d += e.Line().at((ox, 0)).to((node_x, 0))
        d += e.Ground().at((ox, 0))
        d += e.Label().at((ox + 1.6, 4.1)).label(title)

    one_port(d, 0, e.SourceV, ["Vth", "4 V"], None, "Thevenin")
    one_port(d, 8.0, e.SourceI, ["IN", "2 A"], ["RN", "2 Ω"], "Norton")


@schematic("sch-rc-transient")
def _(d):
    """Series RC with a switch - the charging circuit of the worked example."""
    d += e.SourceV().at((0, 0)).to((0, 3)).label("100 V", loc="bottom")
    d += e.Switch().at((0, 3)).to((2, 3)).label("t = 0")
    d += e.Resistor().at((2, 3)).to((5, 3)).label(["R", "50 kΩ"])
    d += e.Dot().at((5, 3))
    d += e.Capacitor().at((5, 3)).to((5, 0)).label(["C", "10 µF"])
    d += e.Line().at((5, 0)).to((0, 0))
    d += e.Ground().at((0, 0))


@schematic("sch-rlc-series")
def _(d):
    """Series RLC - the resonance circuit, with all three elements named."""
    d += e.SourceSin().up().label("vs", loc="bottom")
    d += e.Resistor().right().label(["R", "10 Ω"])
    d += e.Inductor2().right().label(["L", "100 mH"])
    d += e.Capacitor().right().label(["C", "10 µF"])
    d += e.Line().down().length(2.6)
    d += e.Line().left().tox(0)
    d += e.Ground()


@schematic("sch-wye-delta")
def _(d):
    """A wye and a delta load side by side, terminals labelled A B C."""
    # Wye
    d += e.Line().at((0, 0)).to((0, 0))
    d.here = (0, 0)
    d += (ctr := e.Dot().label("N", loc="bottom"))
    d += e.Resistor().at((0, 0)).theta(90).label("Z")
    d += e.Dot(open=True).label("A", loc="top")
    d += e.Resistor().at((0, 0)).theta(210).label("Z", loc="bottom")
    d += e.Dot(open=True).label("B", loc="left")
    d += e.Resistor().at((0, 0)).theta(330).label("Z", loc="bottom")
    d += e.Dot(open=True).label("C", loc="right")

    # Delta
    ox = 7.0
    d += e.Resistor().at((ox, 0)).to((ox + 3, 0)).label("Z", loc="bottom")
    d += e.Resistor().at((ox + 3, 0)).to((ox + 1.5, 2.6)).label("Z")
    d += e.Resistor().at((ox + 1.5, 2.6)).to((ox, 0)).label("Z")
    d += e.Dot(open=True).at((ox + 1.5, 2.6)).label("A", loc="top")
    d += e.Dot(open=True).at((ox, 0)).label("B", loc="left")
    d += e.Dot(open=True).at((ox + 3, 0)).label("C", loc="right")


@schematic("sch-opamp-inverting")
def _(d):
    """Inverting amplifier - the configuration Electronics questions assume.

    The input MUST arrive at the inverting terminal. schemdraw's Opamp puts
    in1 on top (the - terminal) and in2 below it; the first draft wired vin to
    in2, which draws a perfectly tidy circuit that is not the one the lesson's
    gain formula describes. Anchoring in1 at the origin makes the terminal the
    signal reaches explicit instead of positional.
    """
    d += (op := e.Opamp(leads=True).anchor("in1").at((0, 0)))
    # summing node at the inverting input
    d += e.Line().at(op.in1).left().length(0.7)
    d += (n := e.Dot())
    d += e.Resistor().left().length(2.6).label(["Rin", "1 kΩ"])
    d += e.SourceV().down().reverse().label("vin", loc="bottom")
    d += e.Ground()
    # feedback over the top, clear of the triangle
    d += e.Line().at(n.center).up().length(2.2)
    d += e.Resistor().right().tox(op.out).label(["Rf", "10 kΩ"])
    d += e.Line().down().toy(op.out)
    d += e.Dot().at(op.out)
    d += e.Line().at(op.out).right().length(1.2)
    d += e.Dot(open=True).label("vout", loc="right")
    # non-inverting terminal held at ground - this is what makes the summing
    # node a virtual ground, and it is the step candidates skip
    d += e.Line().at(op.in2).left().length(1.0)
    d += e.Ground()


@schematic("sch-symbols-reference")
def _(d):
    """The component symbols an FE candidate must recognise on sight.

    Sources are drawn VERTICALLY. Drawn on their side, schemdraw stacks the +
    and - markers left-to-right inside the circle and the result reads as a
    letter rather than a polarity, which defeats the only purpose this sheet
    has.
    """
    # (element, caption, orientation) - "h" two-terminal across the cell,
    # "v" upright (sources, so polarity reads), "g" a stub into ground.
    rows = [
        [(e.Resistor, "Resistor", "h"), (e.Capacitor, "Capacitor", "h"),
         (e.Inductor2, "Inductor", "h"), (e.Potentiometer, "Potentiometer", "h")],
        [(e.SourceV, "DC source", "v"), (e.SourceI, "Current source", "v"),
         (e.SourceSin, "AC source", "v"), (e.BatteryCell, "Battery cell", "v")],
        [(e.Diode, "Diode", "h"), (e.Zener, "Zener diode", "h"),
         (e.LED, "LED", "h"), (e.Fuse, "Fuse", "h")],
        [(e.BjtNpn, "BJT (NPN)", "d"), (e.NFet, "MOSFET (n-ch)", "d"),
         (e.Opamp, "Op-amp", "d"), (e.Transformer, "Transformer", "d")],
        [(e.Switch, "Switch (SPST)", "h"), (e.Ground, "Ground", "g"),
         (e.Vss, "Negative rail", "g"), (e.Antenna, "Antenna", "g")],
    ]
    COL = 4.4
    # Rows are not uniformly tall. The transistor/op-amp/transformer row draws
    # symbols roughly twice the height of a two-terminal one, so a single ROW
    # pitch either wastes space on the passive rows or runs the caption through
    # the symbol on the device row - which is what it did.
    ROW_H = [3.0, 3.4, 3.2, 5.4, 3.2]
    CAPTION_DROP = {"h": 1.1, "v": 1.5, "g": 1.2, "d": 3.2}
    tops = []
    y = 0.0
    for h in ROW_H:
        tops.append(y)
        y -= h

    for r, row in enumerate(rows):
        for c, (elm, name, how) in enumerate(row):
            x, y = c * COL, tops[r]
            if how == "h":
                d += elm().at((x - 0.8, y)).right().length(1.6)
            elif how == "v":
                d += elm().at((x, y - 0.75)).up().length(1.5)
            elif how == "g":
                d += e.Line().at((x, y + 0.5)).down().length(0.5)
                d += elm().at((x, y))
            else:
                # Multi-terminal symbols grow UP and RIGHT from their placement
                # point, so they have to be dropped below the row line or their
                # tops run through the caption of the row above.
                d += elm().at((x - 0.6, y - 0.7))
            d += e.Label().at((x, y - CAPTION_DROP[how])).label(name)


#: matplotlib (schemdraw's renderer) emits the figure background as the group
#: `<g id="patch_1">` holding one full-canvas path. It is written as
#: style="fill: #ffffff", NOT as a fill="..." attribute, which is why an
#: attribute-matching regex silently left it in place - and a white page under
#: white ink is an invisible schematic, not a broken-looking one, so nothing
#: complained. Match the group structurally instead; the structure is the same
#: in both themes, the colour is not.
_PAGE_PATCH = re.compile(r'<g id="patch_1">.*?</g>\s*', re.DOTALL)


def strip_page_patch(svg: str) -> str:
    """Drop the opaque page rectangle so the schematic sits on the lesson's
    own surface, the way the generated plots already do."""
    return _PAGE_PATCH.sub("", svg, count=1)


def render(name: str, fn) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for mode, suffix in (("light", ".svg"), ("dark", ".dark.svg")):
        with schemdraw.Drawing(show=False) as d:
            d.config(color=INK[mode], fontsize=13, lw=1.9)
            fn(d)
        svg = d.get_imagedata("svg").decode("utf-8")
        svg = strip_page_patch(svg)
        # Assert on the PATCH, not on the colour. In dark mode the ink is
        # #ffffff as well, so "does a white fill appear anywhere" is true of a
        # perfectly good drawing and tells you nothing.
        if '<g id="patch_1">' in svg:
            raise RuntimeError(
                f"{name}{suffix}: the page patch survived the strip; on the "
                "dark surface that is an opaque white block over the schematic"
            )
        (OUT / f"{name}{suffix}").write_text(svg, encoding="utf-8")


def main() -> int:
    prefix = sys.argv[1] if len(sys.argv) > 1 else ""
    names = [n for n in REGISTRY if n.startswith(prefix)]
    if not names:
        print(f"no schematics match {prefix!r}; known: {sorted(REGISTRY)}")
        return 1
    ok = 0
    for n in sorted(names):
        try:
            render(n, REGISTRY[n])
            print("wrote", n)
            ok += 1
        except Exception as exc:                      # noqa: BLE001
            print(f"FAILED {n}: {type(exc).__name__}: {exc}")
            # schemdraw defers each element onto a module-level stack and
            # flushes it when the Drawing context exits. A raise mid-drawing
            # leaves the offending element on that stack, and it then lands in
            # the NEXT drawing and fails there too - which is how one broken
            # schematic reported three failures. Clear it so each name's
            # result is its own.
            drawing_stack.drawing_stack.clear()
    print(f"\n{ok}/{len(names)} schematics -> {OUT}")
    return 0 if ok == len(names) else 1


if __name__ == "__main__":
    raise SystemExit(main())
