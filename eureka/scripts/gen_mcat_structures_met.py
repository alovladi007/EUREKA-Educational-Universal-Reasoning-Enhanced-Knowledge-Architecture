#!/usr/bin/env python3
"""Chemical-structure figures for MCAT Biochemistry II metabolism chapters.

Unlike gen_mcat_biochem_figures.py (matplotlib plots and schematics), every
panel here is a grid of REAL molecular structures rendered by RDKit from
SMILES. Correctness is mechanical, not editorial:

  * every molecule's CalcMolFormula is asserted against the tabulated
    formula below - any mismatch raises and nothing is written;
  * every stereocenter's CIP code is asserted against the tabulated
    configuration (D-sugars, L-amino acids, D-beta-hydroxybutyrate,
    (2R,3S)-isocitrate, L-malate) - any mismatch raises.

All species are depicted as FREE ACIDS / NEUTRAL forms (the physiological
species are the corresponding anions; captions in the lessons say so), and
sugars are drawn open-chain so the carbonyl chemistry is visible. Succinyl-CoA
and the NAD fragments carry a labelled dummy atom ("CoA", "R") standing for
the part of the molecule not drawn; their tabulated formulas are the RDKit
fragment formulas (the "*" is the attachment point).

Themes (matching the rest of the course figure pipeline):
  <name>.svg       LIGHT - near-black ink (#131316) on transparent
  <name>.dark.svg  DARK  - light-gray ink (#d4d4d8) on transparent

Figures:
  bcs-glycolysis-invest   glucose -> G6P -> F6P -> F1,6BP -> DHAP + GAP
  bcs-glycolysis-payoff   GAP -> 1,3-BPG -> 3-PG -> 2-PG -> PEP -> pyruvate
  bcs-tca-intermediates   the eight cycle intermediates in reading order
  bcs-ketone-bodies       acetoacetate, D-beta-hydroxybutyrate, acetone
  bcs-urea-cycle          ornithine -> citrulline -> argininosuccinate ->
                          arginine -> urea (cycle order)
  bcs-nad-redox           nicotinamide fragment, NAD+ vs NADH, hydride
                          position (C4) marked

Referenced from lessons as markdown images whose alt text is the caption:
  ![caption](/courses/mcat/biochem/<name>.svg)
(the course reader swaps in .dark.svg under the dark theme).

Usage:
  .venv-rdkit/bin/python scripts/gen_mcat_structures_met.py            # all
  .venv-rdkit/bin/python scripts/gen_mcat_structures_met.py bcs-tca    # filter
"""
from __future__ import annotations

import pathlib
import re
import sys

from rdkit import Chem
from rdkit.Chem import rdDepictor
from rdkit.Chem.Draw import rdMolDraw2D
from rdkit.Chem.rdMolDescriptors import CalcMolFormula

rdDepictor.SetPreferCoordGen(True)

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "mcat" / "biochem"
)

INK = {"light": "#131316", "dark": "#d4d4d8"}

# ---------------------------------------------------------------------------
# Molecule table. formula = expected CalcMolFormula (raises on mismatch).
# cip = expected CIP codes of ALL stereocenters, in atom-index order
# (raises on mismatch). Free-acid / neutral forms throughout.
# ---------------------------------------------------------------------------
MOLS: dict[str, dict] = {
    # -- glycolysis, investment phase (open-chain sugars, D-series) ---------
    "glucose": dict(  # aldehydo-D-glucose (2R,3S,4R,5R)
        smiles="OC[C@@H](O)[C@@H](O)[C@H](O)[C@@H](O)C=O",
        formula="C6H12O6", cip=["R", "R", "S", "R"]),
    "g6p": dict(  # D-glucose 6-phosphate, free acid
        smiles="OP(=O)(O)OC[C@@H](O)[C@@H](O)[C@H](O)[C@@H](O)C=O",
        formula="C6H13O9P", cip=["R", "R", "S", "R"]),
    "f6p": dict(  # D-fructose 6-phosphate (3S,4R,5R), free acid
        smiles="OCC(=O)[C@@H](O)[C@H](O)[C@H](O)COP(=O)(O)O",
        formula="C6H13O9P", cip=["S", "R", "R"]),
    "f16bp": dict(  # D-fructose 1,6-bisphosphate, free acid
        smiles="OP(=O)(O)OCC(=O)[C@@H](O)[C@H](O)[C@H](O)COP(=O)(O)O",
        formula="C6H14O12P2", cip=["S", "R", "R"]),
    "dhap": dict(  # dihydroxyacetone phosphate, free acid (achiral)
        smiles="OCC(=O)COP(=O)(O)O",
        formula="C3H7O6P", cip=[]),
    "gap": dict(  # D-glyceraldehyde 3-phosphate (R), free acid
        smiles="O=C[C@H](O)COP(=O)(O)O",
        formula="C3H7O6P", cip=["R"]),
    # -- glycolysis, payoff phase (glycerate family is D = R) ---------------
    "bpg13": dict(  # 1,3-bisphospho-D-glycerate, free acid (acyl phosphate)
        smiles="OP(=O)(O)OC(=O)[C@H](O)COP(=O)(O)O",
        formula="C3H8O10P2", cip=["R"]),
    "pg3": dict(  # 3-phospho-D-glycerate, free acid
        smiles="OC(=O)[C@H](O)COP(=O)(O)O",
        formula="C3H7O7P", cip=["R"]),
    "pg2": dict(  # 2-phospho-D-glycerate, free acid
        smiles="OC(=O)[C@H](OP(=O)(O)O)CO",
        formula="C3H7O7P", cip=["R"]),
    "pep": dict(  # phosphoenolpyruvate, free acid
        smiles="OC(=O)C(=C)OP(=O)(O)O",
        formula="C3H5O6P", cip=[]),
    "pyruvate": dict(  # pyruvic acid
        smiles="CC(=O)C(=O)O",
        formula="C3H4O3", cip=[]),
    # -- citric acid cycle intermediates ------------------------------------
    "citrate": dict(  # citric acid (achiral, prochiral center)
        smiles="OC(=O)CC(O)(C(=O)O)CC(=O)O",
        formula="C6H8O7", cip=[]),
    "isocitrate": dict(  # (2R,3S)-isocitric acid, the biological isomer
        smiles="OC(=O)[C@H](O)[C@H](CC(=O)O)C(=O)O",
        formula="C6H8O7", cip=["R", "S"]),
    "akg": dict(  # alpha-ketoglutaric acid
        smiles="OC(=O)CCC(=O)C(=O)O",
        formula="C5H6O5", cip=[]),
    "succinyl_coa": dict(  # succinyl thioester fragment; CoA as dummy label
        smiles="OC(=O)CCC(=O)S[*]",
        formula="C4H5*O3S", cip=[], dummy_label="CoA"),
    "succinate": dict(  # succinic acid
        smiles="OC(=O)CCC(=O)O",
        formula="C4H6O4", cip=[]),
    "fumarate": dict(  # fumaric acid (trans)
        smiles="OC(=O)/C=C/C(=O)O",
        formula="C4H4O4", cip=[]),
    "malate": dict(  # L-malic acid (S)
        smiles="OC(=O)[C@@H](O)CC(=O)O",
        formula="C4H6O5", cip=["S"]),
    "oaa": dict(  # oxaloacetic acid
        smiles="OC(=O)CC(=O)C(=O)O",
        formula="C4H4O5", cip=[]),
    # -- ketone bodies -------------------------------------------------------
    "acetoacetate": dict(  # acetoacetic acid
        smiles="CC(=O)CC(=O)O",
        formula="C4H6O3", cip=[]),
    "bhb": dict(  # D-beta-hydroxybutyric acid = (R)-3-hydroxybutyric acid
        smiles="C[C@@H](O)CC(=O)O",
        formula="C4H8O3", cip=["R"]),
    "acetone": dict(
        smiles="CC(C)=O",
        formula="C3H6O", cip=[]),
    # -- urea cycle (L-amino acids = S at the alpha carbon) ------------------
    "ornithine": dict(  # L-ornithine
        smiles="NCCC[C@H](N)C(=O)O",
        formula="C5H12N2O2", cip=["S"]),
    "citrulline": dict(  # L-citrulline
        smiles="NC(=O)NCCC[C@H](N)C(=O)O",
        formula="C6H13N3O3", cip=["S"]),
    "argininosuccinate": dict(  # L-argininosuccinic acid (both centers S)
        smiles="OC(=O)[C@@H](N)CCCNC(=N[C@@H](CC(=O)O)C(=O)O)N",
        formula="C10H18N4O6", cip=["S", "S"]),
    "arginine": dict(  # L-arginine
        smiles="NC(=N)NCCC[C@H](N)C(=O)O",
        formula="C6H14N4O2", cip=["S"]),
    "urea": dict(
        smiles="NC(N)=O",
        formula="CH4N2O", cip=[]),
    # -- NAD redox: the nicotinamide "business end" only ---------------------
    # R (dummy) = ADP-ribose, the rest of the dinucleotide.
    "nad_ox": dict(  # N1-substituted nicotinamide pyridinium (oxidized)
        smiles="NC(=O)c1ccc[n+](c1)[*]",
        formula="C6H6*N2O+", cip=[], dummy_label="R"),
    "nad_red": dict(  # N1-substituted 1,4-dihydronicotinamide (reduced)
        smiles="NC(=O)C1=CN([*])C=CC1",
        formula="C6H7*N2O", cip=[], dummy_label="R"),
}


def verify_all() -> list[tuple[str, str]]:
    """Assert formula + CIP for every molecule; return (name, formula) rows."""
    rows = []
    for name, spec in MOLS.items():
        mol = Chem.MolFromSmiles(spec["smiles"])
        if mol is None:
            raise SystemExit(f"SMILES PARSE FAILED: {name}")
        got = CalcMolFormula(mol)
        if got != spec["formula"]:
            raise SystemExit(
                f"FORMULA MISMATCH {name}: CalcMolFormula={got} "
                f"tabulated={spec['formula']}")
        Chem.AssignStereochemistry(mol, cleanIt=True, force=True)
        centers = Chem.FindMolChiralCenters(
            mol, includeUnassigned=True, useLegacyImplementation=False)
        codes = [c for _, c in centers]
        if codes != spec["cip"]:
            raise SystemExit(
                f"CIP MISMATCH {name}: got {codes} tabulated {spec['cip']}")
        rows.append((name, got))
    return rows


# ---------------------------------------------------------------------------
# Rendering primitives
# ---------------------------------------------------------------------------
def _hex_rgb(h: str) -> tuple[float, float, float]:
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) / 255.0 for i in (0, 2, 4))


def build_mol(name: str) -> Chem.Mol:
    spec = MOLS[name]
    mol = Chem.MolFromSmiles(spec["smiles"])
    label = spec.get("dummy_label")
    if label:
        for a in mol.GetAtoms():
            if a.GetAtomicNum() == 0:
                a.SetProp("atomLabel", label)
    return mol


def mark_c4(mol: Chem.Mol) -> None:
    """Annotate the nicotinamide C4 (hydride site) on either redox state."""
    marked = False
    for a in mol.GetAtoms():
        if a.GetAtomicNum() != 6 or not a.IsInRing():
            continue
        if a.GetIsAromatic():
            # oxidized: ring C adjacent to the amide-bearing ring carbon,
            # not adjacent to the ring nitrogen
            nbrs = [n for n in a.GetNeighbors()]
            if any(n.GetAtomicNum() == 7 for n in nbrs):
                continue
            amide_c = [
                n for n in nbrs
                if n.GetIsAromatic() and any(
                    m.GetAtomicNum() == 6 and not m.GetIsAromatic()
                    for m in n.GetNeighbors())
            ]
            if amide_c:
                a.SetProp("atomNote", "C4")
                marked = True
                break
        elif a.GetTotalNumHs() == 2:
            # reduced: the sp3 CH2 of the 1,4-dihydro ring
            a.SetProp("atomNote", "C4")
            marked = True
            break
    if not marked:
        raise SystemExit("could not locate nicotinamide C4 to annotate")


def draw_cell(mol: Chem.Mol, w: int, h: int, ink: str) -> str:
    """Render one molecule; return the inner SVG (no <svg> wrapper)."""
    rdDepictor.Compute2DCoords(mol)
    d = rdMolDraw2D.MolDraw2DSVG(w, h)
    o = d.drawOptions()
    o.clearBackground = False
    o.setAtomPalette({-1: _hex_rgb(ink)})
    o.setAnnotationColour(_hex_rgb(ink))
    o.bondLineWidth = 1.8
    o.fixedBondLength = 27
    o.fixedFontSize = 15
    o.annotationFontScale = 0.65
    o.padding = 0.06
    rdMolDraw2D.PrepareAndDrawMolecule(d, mol)
    d.FinishDrawing()
    svg = d.GetDrawingText()
    return svg.split("<!-- END OF HEADER -->", 1)[1].rsplit("</svg>", 1)[0]


def _esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def fmt_formula(f: str, size: float = 12.0) -> str:
    """Formula string -> tspans with subscript digits (dummy '*' dropped)."""
    out = []
    sub = f"{size * 0.78:.1f}"
    for tok in re.findall(r"[A-Z][a-z]?|\d+|[+\-]", f.replace("*", "")):
        if tok.isdigit():
            out.append(
                f'<tspan dy="3.2" font-size="{sub}">{tok}</tspan>'
                f'<tspan dy="-3.2">​</tspan>')
        elif tok in "+-":
            out.append(
                f'<tspan dy="-4.2" font-size="{sub}">{tok}</tspan>'
                f'<tspan dy="4.2">​</tspan>')
        else:
            out.append(_esc(tok))
    return "".join(out)


def _text(x: float, y: float, s: str, ink: str, size: float = 14.0,
          weight: str = "600", opacity: float = 1.0, raw: bool = False) -> str:
    body = s if raw else _esc(s)
    return (
        f'<text x="{x:.1f}" y="{y:.1f}" text-anchor="middle" '
        f'font-size="{size}" font-weight="{weight}" fill="{ink}" '
        f'fill-opacity="{opacity}">{body}</text>')


def _arrow(x1: float, y: float, x2: float, ink: str) -> str:
    """Horizontal arrow from x1 to x2 (either direction)."""
    ah = 6.5 if x2 >= x1 else -6.5
    return (
        f'<line x1="{x1:.1f}" y1="{y:.1f}" x2="{x2 - ah:.1f}" y2="{y:.1f}" '
        f'stroke="{ink}" stroke-width="1.6" stroke-opacity="0.85"/>'
        f'<polygon points="{x2:.1f},{y:.1f} {x2 - ah:.1f},{y - 4.2:.1f} '
        f'{x2 - ah:.1f},{y + 4.2:.1f}" fill="{ink}" fill-opacity="0.85"/>')


CELL_LABEL_H = 50   # vertical space under each cell for the two label lines
ROW_GAP = 22
COL_GAP = 56
MARGIN = 18


def grid_panel(names_labels: list[tuple[str, str]], cols: int,
               cellw: int, cellh: int, mode: str,
               sequence: bool = True, center_last_row: bool = True,
               footnote: str | None = None,
               annotate=None) -> str:
    """Compose a grid of structure cells with per-structure labels.

    names_labels: (molecule key, display label) in reading order; label lines
    are numbered when `sequence`. Arrows are drawn between horizontally
    adjacent cells of a sequence.
    """
    ink = INK[mode]
    n = len(names_labels)
    rows = (n + cols - 1) // cols
    W = 2 * MARGIN + cols * cellw + (cols - 1) * COL_GAP
    H = (2 * MARGIN + rows * (cellh + CELL_LABEL_H)
         + (rows - 1) * ROW_GAP + (24 if footnote else 0))
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
        f'viewBox="0 0 {W} {H}" '
        f'font-family="Helvetica Neue, Helvetica, Arial, sans-serif">']
    for i, (key, label) in enumerate(names_labels):
        r, c = divmod(i, cols)
        in_row = min(cols, n - r * cols)  # cells actually in this row
        row_w = in_row * cellw + (in_row - 1) * COL_GAP
        x0 = ((W - row_w) / 2 if (center_last_row and in_row < cols)
              else MARGIN) + c * (cellw + COL_GAP)
        y0 = MARGIN + r * (cellh + CELL_LABEL_H + ROW_GAP)
        mol = build_mol(key)
        if annotate:
            annotate(key, mol)
        parts.append(f'<g transform="translate({x0:.1f},{y0:.1f})">')
        parts.append(draw_cell(mol, cellw, cellh, ink))
        parts.append("</g>")
        cx = x0 + cellw / 2
        num = f"{i + 1}.  " if sequence else ""
        parts.append(_text(cx, y0 + cellh + 20, num + label, ink, 14.0))
        formula = MOLS[key]["formula"]
        if "*" not in formula:
            parts.append(_text(cx, y0 + cellh + 38, fmt_formula(formula),
                               ink, 12.0, weight="400", opacity=0.62,
                               raw=True))
        else:
            note = ("acyl fragment - CoA abbreviated"
                    if key == "succinyl_coa" else "fragment - R abbreviated")
            parts.append(_text(cx, y0 + cellh + 38, note, ink, 11.5,
                               weight="400", opacity=0.62))
        # arrow to the next cell when it sits to the right in the same row
        if sequence and i + 1 < n and c + 1 < cols and (i + 1) // cols == r:
            ay = y0 + cellh * 0.45
            parts.append(_arrow(x0 + cellw + 9, ay,
                                x0 + cellw + COL_GAP - 9, ink))
    if footnote:
        parts.append(_text(W / 2, H - 12, footnote, ink, 12.0,
                           weight="400", opacity=0.62))
    parts.append("</svg>")
    return "".join(parts)


def nad_panel(mode: str) -> str:
    """NAD+ vs NADH nicotinamide fragments with the hydride site marked."""
    ink = INK[mode]
    cw, ch, gap = 300, 260, 190
    W = 2 * MARGIN + 2 * cw + gap
    H = 2 * MARGIN + ch + CELL_LABEL_H + 24
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
        f'viewBox="0 0 {W} {H}" '
        f'font-family="Helvetica Neue, Helvetica, Arial, sans-serif">']
    for i, (key, label) in enumerate([
            ("nad_ox", "NAD⁺ - oxidized (aromatic pyridinium)"),
            ("nad_red", "NADH - reduced (1,4-dihydronicotinamide)")]):
        x0 = MARGIN + i * (cw + gap)
        y0 = MARGIN
        mol = build_mol(key)
        mark_c4(mol)
        parts.append(f'<g transform="translate({x0:.1f},{y0:.1f})">')
        parts.append(draw_cell(mol, cw, ch, ink))
        parts.append("</g>")
        parts.append(_text(x0 + cw / 2, y0 + ch + 20, label, ink, 13.5))
    # the reversible hydride transfer, drawn between the two cells
    mx1 = MARGIN + cw + 24
    mx2 = MARGIN + cw + gap - 24
    my = MARGIN + ch * 0.42
    parts.append(_text((mx1 + mx2) / 2, my - 12,
                       "+ H⁻ (hydride to C4)", ink, 12.5, weight="400"))
    parts.append(_arrow(mx1, my, mx2, ink))
    parts.append(_arrow(mx2, my + 22, mx1, ink))
    parts.append(_text((mx1 + mx2) / 2, my + 40, "− H⁻", ink,
                       12.5, weight="400"))
    parts.append(_text(
        W / 2, H - 12,
        "R = ADP-ribose - reactive nicotinamide fragment only, "
        "not the full dinucleotide", ink, 12.0, weight="400", opacity=0.62))
    parts.append("</svg>")
    return "".join(parts)


# ---------------------------------------------------------------------------
# Figures
# ---------------------------------------------------------------------------
def fig_glycolysis_invest(mode: str) -> str:
    return grid_panel([
        ("glucose", "glucose (open chain)"),
        ("g6p", "glucose 6-phosphate"),
        ("f6p", "fructose 6-phosphate"),
        ("f16bp", "fructose 1,6-bisphosphate"),
        ("dhap", "dihydroxyacetone phosphate"),
        ("gap", "glyceraldehyde 3-phosphate"),
    ], cols=3, cellw=344, cellh=252, mode=mode,
        footnote="aldolase splits 4 into 5 + 6; "
                 "triose phosphate isomerase interconverts 5 and 6")


def fig_glycolysis_payoff(mode: str) -> str:
    return grid_panel([
        ("gap", "glyceraldehyde 3-phosphate"),
        ("bpg13", "1,3-bisphosphoglycerate"),
        ("pg3", "3-phosphoglycerate"),
        ("pg2", "2-phosphoglycerate"),
        ("pep", "phosphoenolpyruvate"),
        ("pyruvate", "pyruvate"),
    ], cols=3, cellw=344, cellh=252, mode=mode,
        footnote="2 has an acyl phosphate on C-1 (top-rung donor); "
                 "5 holds the enol phosphate that step 10 cashes")


def fig_tca(mode: str) -> str:
    return grid_panel([
        ("citrate", "citrate"),
        ("isocitrate", "isocitrate"),
        ("akg", "α-ketoglutarate"),
        ("succinyl_coa", "succinyl-CoA (thioester)"),
        ("succinate", "succinate"),
        ("fumarate", "fumarate"),
        ("malate", "malate"),
        ("oaa", "oxaloacetate"),
    ], cols=4, cellw=300, cellh=236, mode=mode,
        footnote="one turn in reading order; "
                 "8 condenses with acetyl-CoA to regenerate 1")


def fig_ketones(mode: str) -> str:
    return grid_panel([
        ("acetoacetate", "acetoacetate"),
        ("bhb", "D-β-hydroxybutyrate"),
        ("acetone", "acetone"),
    ], cols=3, cellw=320, cellh=240, mode=mode, sequence=False,
        footnote="reduction of acetoacetate gives D-β-hydroxybutyrate; "
                 "decarboxylation gives acetone")


def fig_urea(mode: str) -> str:
    return grid_panel([
        ("ornithine", "ornithine"),
        ("citrulline", "citrulline"),
        ("argininosuccinate", "argininosuccinate"),
        ("arginine", "arginine"),
        ("urea", "urea"),
    ], cols=3, cellw=356, cellh=264, mode=mode,
        footnote="cycle order 1 → 5; arginase splits arginine into "
                 "urea + ornithine, which returns to 1")


def fig_nad(mode: str) -> str:
    return nad_panel(mode)


FIGURES = {
    "bcs-glycolysis-invest": fig_glycolysis_invest,
    "bcs-glycolysis-payoff": fig_glycolysis_payoff,
    "bcs-tca-intermediates": fig_tca,
    "bcs-ketone-bodies": fig_ketones,
    "bcs-urea-cycle": fig_urea,
    "bcs-nad-redox": fig_nad,
}


def main() -> None:
    pat = sys.argv[1] if len(sys.argv) > 1 else ""
    rows = verify_all()
    print(f"formula + CIP checks passed for {len(rows)} molecules:")
    for name, formula in rows:
        print(f"  {name:20s} {formula}")
    OUT.mkdir(parents=True, exist_ok=True)
    for name, builder in FIGURES.items():
        if pat and pat not in name:
            continue
        for mode, suffix in (("light", ".svg"), ("dark", ".dark.svg")):
            path = OUT / f"{name}{suffix}"
            svg = builder(mode)
            path.write_text(
                "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + svg,
                encoding="utf-8")
            print(f"wrote {path.relative_to(OUT.parents[4])}"
                  f" ({path.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
