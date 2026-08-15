#!/usr/bin/env python3
"""Chemical-structure figures for MCAT Biochemistry I.2-I.3 (amino acids).

Companion to gen_mcat_biochem_figures.py, but for actual chemical structures,
which matplotlib is the wrong tool for. Every molecule here is DEFINED by its
SMILES string and rendered from that molecular graph by RDKit — nothing is
traced or adapted from anyone's drawing. Correctness is mechanical: for every
molecule the script asserts that RDKit's computed molecular formula equals the
tabulated formula stated in the table below, and any mismatch raises. All
structures are depicted in their physiologically standard NEUTRAL (un-ionized)
forms; the lesson captions say so.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/mcat/biochem/<name>.svg        (light)
    apps/web/public/courses/mcat/biochem/<name>.dark.svg   (dark)

and is referenced from a lesson as a markdown image whose alt text is the
caption — the same contract as every other figure in this directory. Light
theme draws near-black bonds/labels; dark theme draws #d4d4d8 bonds/labels
with heteroatom colors lifted for a dark ground. Backgrounds are transparent
in both themes.

Figures (chapter map in docs/mcat/BIOCHEM_CHAPTERS.md):
    I.2  bcs-aa-nonpolar   Gly Ala Val Leu Ile Met Pro       (grid panel)
    I.2  bcs-aa-aromatic   Phe Tyr Trp                        (grid panel)
    I.2  bcs-aa-polar      Ser Thr Cys Asn Gln                (grid panel)
    I.2  bcs-aa-charged    Lys Arg His Asp Glu                (grid panel)
    I.2  bcs-peptide-bond  Ala + Gly -> Ala-Gly + H2O, amide highlighted
    I.3  bcs-disulfide     2 Cys -> cystine + 2H, S-S highlighted

The four panels cover all twenty standard amino acids exactly once. Side-chain
pKa values printed under the ionizable residues are the standard tabulated
constants used throughout the course: Asp 3.65, Glu 4.25, His 6.00, Cys 8.18,
Tyr 10.07, Lys 10.53, Arg 12.48.

Usage:
    scripts/.venv-rdkit/bin/python scripts/gen_mcat_structures_aa.py           # all
    scripts/.venv-rdkit/bin/python scripts/gen_mcat_structures_aa.py bcs-aa    # matching
"""
from __future__ import annotations

import pathlib
import re
import sys

from rdkit import Chem
from rdkit.Chem import rdDepictor, rdMolDescriptors
from rdkit.Chem.Draw import rdMolDraw2D

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "mcat" / "biochem"
)

FONT = "Helvetica, Arial, sans-serif"

# ---------------------------------------------------------------------------
# Themes. Palette keys are atomic numbers; -1 is the default (carbon, bonds).
# ---------------------------------------------------------------------------

THEMES = {
    "light": {
        "palette": {
            -1: (0.11, 0.11, 0.13),   # near-black bonds / C labels
            7: (0.10, 0.28, 0.80),    # N
            8: (0.73, 0.11, 0.11),    # O
            16: (0.63, 0.42, 0.02),   # S
        },
        "text": "#1c1c1e",
        "subtext": "#52525b",
        "highlight": (1.00, 0.85, 0.46, 1.0),   # pale amber on white
    },
    "dark": {
        "palette": {
            -1: (0.831, 0.831, 0.847),  # #d4d4d8 bonds / C labels
            7: (0.58, 0.71, 1.00),      # N, lifted for dark ground
            8: (1.00, 0.56, 0.53),      # O
            16: (0.92, 0.81, 0.43),     # S
        },
        "text": "#d4d4d8",
        "subtext": "#a1a1aa",
        "highlight": (0.42, 0.34, 0.11, 1.0),   # dim amber under light-gray bonds
    },
}

# ---------------------------------------------------------------------------
# Molecule table: name, 3-letter, 1-letter, SMILES (neutral form), tabulated
# molecular formula, side-chain pKa (standard tabulated constants) or None.
# The formula column is the ground truth the SMILES must reproduce.
# ---------------------------------------------------------------------------

AA = {
    "Gly": ("Glycine", "Gly", "G", "NCC(=O)O", "C2H5NO2", None),
    "Ala": ("Alanine", "Ala", "A", "CC(N)C(=O)O", "C3H7NO2", None),
    "Val": ("Valine", "Val", "V", "CC(C)C(N)C(=O)O", "C5H11NO2", None),
    "Leu": ("Leucine", "Leu", "L", "CC(C)CC(N)C(=O)O", "C6H13NO2", None),
    "Ile": ("Isoleucine", "Ile", "I", "CCC(C)C(N)C(=O)O", "C6H13NO2", None),
    "Met": ("Methionine", "Met", "M", "CSCCC(N)C(=O)O", "C5H11NO2S", None),
    "Pro": ("Proline", "Pro", "P", "OC(=O)C1CCCN1", "C5H9NO2", None),
    "Phe": ("Phenylalanine", "Phe", "F", "NC(Cc1ccccc1)C(=O)O", "C9H11NO2", None),
    "Tyr": ("Tyrosine", "Tyr", "Y", "NC(Cc1ccc(O)cc1)C(=O)O", "C9H11NO3", 10.07),
    "Trp": ("Tryptophan", "Trp", "W", "NC(Cc1c[nH]c2ccccc12)C(=O)O", "C11H12N2O2", None),
    "Ser": ("Serine", "Ser", "S", "OCC(N)C(=O)O", "C3H7NO3", None),
    "Thr": ("Threonine", "Thr", "T", "CC(O)C(N)C(=O)O", "C4H9NO3", None),
    "Cys": ("Cysteine", "Cys", "C", "NC(CS)C(=O)O", "C3H7NO2S", 8.18),
    "Asn": ("Asparagine", "Asn", "N", "NC(=O)CC(N)C(=O)O", "C4H8N2O3", None),
    "Gln": ("Glutamine", "Gln", "Q", "NC(=O)CCC(N)C(=O)O", "C5H10N2O3", None),
    "Lys": ("Lysine", "Lys", "K", "NCCCCC(N)C(=O)O", "C6H14N2O2", 10.53),
    "Arg": ("Arginine", "Arg", "R", "NC(=N)NCCCC(N)C(=O)O", "C6H14N4O2", 12.48),
    "His": ("Histidine", "His", "H", "NC(Cc1c[nH]cn1)C(=O)O", "C6H9N3O2", 6.00),
    "Asp": ("Aspartic acid", "Asp", "D", "OC(=O)CC(N)C(=O)O", "C4H7NO4", 3.65),
    "Glu": ("Glutamic acid", "Glu", "E", "OC(=O)CCC(N)C(=O)O", "C5H9NO4", 4.25),
}

EXTRA = {
    "AlaGly": ("Ala–Gly dipeptide", "CC(N)C(=O)NCC(=O)O", "C5H10N2O3"),
    "H2O": ("Water", "O", "H2O"),
    "Cystine": ("Cystine", "OC(=O)C(N)CSSCC(N)C(=O)O", "C6H12N2O4S2"),
}

CHECKS: list[str] = []


def build(name: str, smiles: str, expected: str) -> Chem.Mol:
    """Parse SMILES and assert the computed formula equals the tabulated one."""
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        raise ValueError(f"{name}: SMILES failed to parse: {smiles}")
    got = rdMolDescriptors.CalcMolFormula(mol)
    if got != expected:
        raise ValueError(
            f"{name}: formula mismatch — SMILES gives {got}, table says {expected}"
        )
    CHECKS.append(f"  {name:<22} {smiles:<32} {got}  == tabulated  OK")
    rdDepictor.Compute2DCoords(mol)
    return mol


# ---------------------------------------------------------------------------
# Low-level SVG helpers
# ---------------------------------------------------------------------------

_HEADER_RE = re.compile(r"^.*?<!-- END OF HEADER -->", re.S)


def mol_body(
    mol: Chem.Mol,
    w: int,
    h: int,
    mode: str,
    highlight_atoms: list[int] | None = None,
    highlight_bonds: list[int] | None = None,
    font: int = 16,
) -> str:
    """Render one molecule and return the inner SVG elements (no <svg> wrapper)."""
    theme = THEMES[mode]
    d = rdMolDraw2D.MolDraw2DSVG(w, h)
    o = d.drawOptions()
    o.clearBackground = False           # transparent ground
    o.setAtomPalette(theme["palette"])
    o.setHighlightColour(theme["highlight"])
    o.fixedFontSize = font
    o.bondLineWidth = 2
    o.additionalAtomLabelPadding = 0.08
    rdMolDraw2D.PrepareAndDrawMolecule(
        d,
        mol,
        highlightAtoms=highlight_atoms or [],
        highlightBonds=highlight_bonds or [],
    )
    d.FinishDrawing()
    svg = d.GetDrawingText()
    body = _HEADER_RE.sub("", svg)
    body = body.replace("</svg>", "").strip()
    return body


def text_el(
    x: float, y: float, s: str, size: float, color: str,
    bold: bool = False, anchor: str = "middle",
) -> str:
    weight = " font-weight='600'" if bold else ""
    return (
        f"<text x='{x:.1f}' y='{y:.1f}' font-family=\"{FONT}\" "
        f"font-size='{size}px' fill='{color}'{weight} "
        f"text-anchor='{anchor}'>{s}</text>"
    )


def group(x: float, y: float, body: str) -> str:
    return f"<g transform='translate({x:.1f},{y:.1f})'>{body}</g>"


def arrow(x: float, y: float, length: float, color: str, label: str = "",
          sublabel: str = "", subcolor: str = "") -> str:
    """Horizontal reaction arrow centered vertically on y."""
    x2 = x + length
    parts = [
        f"<line x1='{x:.1f}' y1='{y:.1f}' x2='{x2 - 9:.1f}' y2='{y:.1f}' "
        f"stroke='{color}' stroke-width='2'/>",
        f"<polygon points='{x2:.1f},{y:.1f} {x2 - 11:.1f},{y - 5.5:.1f} "
        f"{x2 - 11:.1f},{y + 5.5:.1f}' fill='{color}'/>",
    ]
    cx = x + length / 2
    if label:
        parts.append(text_el(cx, y - 10, label, 14.5, color))
    if sublabel:
        parts.append(text_el(cx, y + 20, sublabel, 13.5, subcolor or color))
    return "".join(parts)


def svg_doc(w: float, h: float, body: str) -> str:
    return (
        f"<svg xmlns='http://www.w3.org/2000/svg' "
        f"xmlns:xlink='http://www.w3.org/1999/xlink' "
        f"width='{w:.0f}' height='{h:.0f}' viewBox='0 0 {w:.0f} {h:.0f}'>"
        f"{body}</svg>\n"
    )


# ---------------------------------------------------------------------------
# Panel assembly
# ---------------------------------------------------------------------------

DRAW_W, DRAW_H = 215, 180      # per-cell molecule canvas
CAP_H = 64                      # caption block under each cell
GX, GY, M = 12, 14, 16          # gutters and outer margin


def aa_panel(keys: list[str], cols: int, mode: str) -> str:
    """Grid of amino acids with name + codes (+ side-chain pKa) captions."""
    theme = THEMES[mode]
    rows = [keys[i:i + cols] for i in range(0, len(keys), cols)]
    W = 2 * M + cols * DRAW_W + (cols - 1) * GX
    H = 2 * M + len(rows) * (DRAW_H + CAP_H) + (len(rows) - 1) * GY
    parts = []
    for r, row in enumerate(rows):
        row_w = len(row) * DRAW_W + (len(row) - 1) * GX
        x0 = (W - row_w) / 2
        y0 = M + r * (DRAW_H + CAP_H + GY)
        for c, key in enumerate(row):
            name, three, one, smiles, formula, pka = AA[key]
            mol = build(name, smiles, formula)
            x = x0 + c * (DRAW_W + GX)
            parts.append(group(x, y0, mol_body(mol, DRAW_W, DRAW_H, mode)))
            cx = x + DRAW_W / 2
            ty = y0 + DRAW_H + 18
            parts.append(text_el(cx, ty, name, 17.5, theme["text"], bold=True))
            parts.append(text_el(cx, ty + 18, f"{three} · {one}", 15, theme["subtext"]))
            if pka is not None:
                parts.append(text_el(
                    cx, ty + 35, f"side-chain pKa {pka:.2f}", 14.5, theme["subtext"]))
        # deduplicate CHECKS on the second theme pass via caller
    return svg_doc(W, H, "".join(parts))


# ---------------------------------------------------------------------------
# Figures
# ---------------------------------------------------------------------------

REGISTRY: dict[str, callable] = {}


def figure(name):
    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


@figure("bcs-aa-nonpolar")
def _(mode):
    return aa_panel(["Gly", "Ala", "Val", "Leu", "Ile", "Met", "Pro"], 4, mode)


@figure("bcs-aa-aromatic")
def _(mode):
    return aa_panel(["Phe", "Tyr", "Trp"], 3, mode)


@figure("bcs-aa-polar")
def _(mode):
    return aa_panel(["Ser", "Thr", "Cys", "Asn", "Gln"], 3, mode)


@figure("bcs-aa-charged")
def _(mode):
    return aa_panel(["Lys", "Arg", "His", "Asp", "Glu"], 3, mode)


def _amide_highlight(mol: Chem.Mol) -> tuple[list[int], list[int]]:
    """Atoms and bonds of the amide (peptide) group C(=O)N."""
    match = mol.GetSubstructMatch(Chem.MolFromSmarts("[CX3](=[OX1])[NX3]"))
    if not match:
        raise ValueError("amide group not found")
    c, o, n = match
    bonds = [
        mol.GetBondBetweenAtoms(c, o).GetIdx(),
        mol.GetBondBetweenAtoms(c, n).GetIdx(),
    ]
    return [c, o, n], bonds


@figure("bcs-peptide-bond")
def _(mode):
    theme = THEMES[mode]
    h_draw = 175
    ala = build("Alanine", AA["Ala"][3], AA["Ala"][4])
    gly = build("Glycine", AA["Gly"][3], AA["Gly"][4])
    dip = build("Ala-Gly dipeptide", EXTRA["AlaGly"][1], EXTRA["AlaGly"][2])
    h2o = build("Water", EXTRA["H2O"][1], EXTRA["H2O"][2])
    hl_atoms, hl_bonds = _amide_highlight(dip)

    widths = {"ala": 195, "plus": 26, "gly": 195, "arrow": 116,
              "dip": 285, "plus2": 26, "h2o": 84}
    W = 2 * M + sum(widths.values())
    H = M + h_draw + CAP_H + M
    ymid = M + h_draw / 2
    parts = []
    x = M

    def put(mol_, w_, cap1, cap2, hl_a=None, hl_b=None):
        nonlocal x
        parts.append(group(x, M, mol_body(mol_, w_, h_draw, mode,
                                          highlight_atoms=hl_a, highlight_bonds=hl_b)))
        cx = x + w_ / 2
        ty = M + h_draw + 18
        parts.append(text_el(cx, ty, cap1, 16.5, theme["text"], bold=True))
        if cap2:
            parts.append(text_el(cx, ty + 18, cap2, 14.5, theme["subtext"]))
        x += w_

    put(ala, widths["ala"], "Alanine", "Ala · A")
    parts.append(text_el(x + widths["plus"] / 2, ymid + 7, "+", 24, theme["text"]))
    x += widths["plus"]
    put(gly, widths["gly"], "Glycine", "Gly · G")
    parts.append(arrow(x + 8, ymid, widths["arrow"] - 16, theme["text"],
                       label="condensation", sublabel="", subcolor=theme["subtext"]))
    x += widths["arrow"]
    put(dip, widths["dip"], "Ala–Gly dipeptide",
        "planar amide (peptide) bond", hl_atoms, hl_bonds)
    parts.append(text_el(x + widths["plus2"] / 2, ymid + 7, "+", 24, theme["text"]))
    x += widths["plus2"]
    put(h2o, widths["h2o"], "Water", "H₂O")
    return svg_doc(W, H, "".join(parts))


@figure("bcs-disulfide")
def _(mode):
    theme = THEMES[mode]
    h_draw = 175
    cys1 = build("Cysteine", AA["Cys"][3], AA["Cys"][4])
    cys2 = build("Cysteine", AA["Cys"][3], AA["Cys"][4])
    cystine = build("Cystine", EXTRA["Cystine"][1], EXTRA["Cystine"][2])
    ss = cystine.GetSubstructMatch(Chem.MolFromSmarts("[SX2][SX2]"))
    if not ss:
        raise ValueError("disulfide bond not found")
    ss_bond = [cystine.GetBondBetweenAtoms(ss[0], ss[1]).GetIdx()]

    widths = {"c1": 200, "plus": 26, "c2": 200, "arrow": 128, "cyst": 300, "prod": 96}
    W = 2 * M + sum(widths.values())
    H = M + h_draw + CAP_H + M
    ymid = M + h_draw / 2
    parts = []
    x = M

    def put(mol_, w_, cap1, cap2, cap3=None, hl_a=None, hl_b=None):
        nonlocal x
        parts.append(group(x, M, mol_body(mol_, w_, h_draw, mode,
                                          highlight_atoms=hl_a, highlight_bonds=hl_b)))
        cx = x + w_ / 2
        ty = M + h_draw + 18
        parts.append(text_el(cx, ty, cap1, 16.5, theme["text"], bold=True))
        if cap2:
            parts.append(text_el(cx, ty + 18, cap2, 14.5, theme["subtext"]))
        if cap3:
            parts.append(text_el(cx, ty + 35, cap3, 14, theme["subtext"]))
        x += w_

    put(cys1, widths["c1"], "Cysteine", "Cys · C", "side-chain pKa 8.18")
    parts.append(text_el(x + widths["plus"] / 2, ymid + 7, "+", 24, theme["text"]))
    x += widths["plus"]
    put(cys2, widths["c2"], "Cysteine", "Cys · C", "side-chain pKa 8.18")
    parts.append(arrow(x + 8, ymid, widths["arrow"] - 16, theme["text"],
                       label="oxidation", sublabel="− 2 H⁺ − 2 e⁻",
                       subcolor=theme["subtext"]))
    x += widths["arrow"]
    put(cystine, widths["cyst"], "Cystine",
        "disulfide (S–S) bridge", hl_a=list(ss), hl_b=ss_bond)
    parts.append(text_el(x + widths["prod"] / 2, ymid + 7,
                         "+ 2 H⁺ + 2 e⁻", 16, theme["text"]))
    return svg_doc(W, H, "".join(parts))


# ---------------------------------------------------------------------------


def main(argv: list[str]) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    names = [n for n in REGISTRY if not argv or any(a in n for a in argv)]
    for name in names:
        for mode, suffix in (("light", ".svg"), ("dark", ".dark.svg")):
            CHECKS.clear()
            svg = REGISTRY[name](mode)
            path = OUT / f"{name}{suffix}"
            path.write_text(svg, encoding="utf-8")
            if mode == "light":
                print(f"{name}: formula checks")
                print("\n".join(dict.fromkeys(CHECKS)))
            print(f"  wrote {path.relative_to(OUT.parents[4])} ({path.stat().st_size} bytes)")
    print(f"\n{len(names)} figures x 2 themes done.")


if __name__ == "__main__":
    main(sys.argv[1:])
