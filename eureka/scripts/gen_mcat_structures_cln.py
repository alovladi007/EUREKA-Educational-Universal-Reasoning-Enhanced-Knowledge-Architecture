#!/usr/bin/env python3
"""Chemical-structure figures for MCAT Biochemistry I.8 / I.9 / I.11 (RDKit).

Unlike the schematic figures in gen_mcat_biochem_figures.py, every structure
here is RENDERED FROM THE MOLECULAR GRAPH: each molecule is parsed from a
SMILES string and the drawing is whatever RDKit's depiction of that graph is.
Correctness is enforced mechanically, not by eye:

  * every molecule's CalcMolFormula must equal the tabulated formula written
    next to its SMILES below - any mismatch raises;
  * ring sugars use anomeric-specific SMILES, and every monosaccharide is
    CIP-verified center by center against the descriptors from its IUPAC name
    (e.g. alpha-D-glucopyranose = (2S,3R,4S,5S,6R), so sugar-numbered
    C1=S, C2=R, C3=S, C4=S, C5=R);
  * disaccharides are SPLICED from those CIP-verified parents by a
    ring-closure splice that provably preserves SMILES neighbor order at
    every stereocenter (the glycosidic oxygen takes exactly the slot the
    hydroxyl occupied), then re-verified: each parent residue must match the
    product as a chirality-aware substructure query;
  * cis double bonds in the unsaturated fatty acids are asserted to carry
    STEREOZ, and their count is asserted per acid;
  * cholesterol / DPPC / dAMP assert stereocenter counts and (for dAMP and
    the sterol) CIP descriptors.

Nothing is traced or adapted from any textbook drawing - the pipeline
consumes public structural facts (connectivity + configuration), which are
not protected expression, and the depiction is RDKit's own.

Each figure renders twice, to

    apps/web/public/courses/mcat/biochem/<name>.svg        (light)
    apps/web/public/courses/mcat/biochem/<name>.dark.svg   (dark)

with a transparent background, and is referenced from a lesson as a markdown
image whose alt text is the caption (the course reader swaps in .dark.svg
under the dark theme).

Figures:
    I.8   bcs-glucose-forms    open-chain D-glucose + alpha/beta pyranoses
    I.8   bcs-disaccharides    maltose, lactose, sucrose with linkages
    I.9   bcs-fatty-acids      16:0, 18:0, 18:1 cis-D9, 20:4 stacked
    I.9   bcs-membrane-lipids  DPPC + cholesterol, regions bracketed
    I.11  bcs-bases            the five bases, purines vs pyrimidines
    I.11  bcs-nucleotide-anatomy  dAMP with base/sugar/phosphate brackets

Usage:
    scripts/.venv-rdkit/bin/python scripts/gen_mcat_structures_cln.py
"""
from __future__ import annotations

import math
import pathlib
import re
import sys
from xml.sax.saxutils import escape

import numpy as np
from rdkit import Chem
from rdkit.Chem import rdDepictor
from rdkit.Chem.Draw import rdMolDraw2D
from rdkit.Chem.rdMolDescriptors import CalcMolFormula

rdDepictor.SetPreferCoordGen(True)

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "mcat" / "biochem"
)

# ---------------------------------------------------------------------------
# Theme
# ---------------------------------------------------------------------------

INK = {"light": "#18181b", "dark": "#d4d4d8"}
INK2 = {"light": "#52514e", "dark": "#a1a1aa"}
RULE = {"light": "#d9d8d4", "dark": "#3f3f46"}
# Element palette per theme (default carbon wears the ink colour).
PALETTE = {
    "light": {-1: "#18181b", 7: "#1d4ed8", 8: "#b91c1c", 15: "#b45309"},
    "dark": {-1: "#d4d4d8", 7: "#7fa9f7", 8: "#f87171", 15: "#fbbf24"},
}
HIGHLIGHT = {"light": (0.55, 0.73, 0.97, 0.5), "dark": (0.23, 0.38, 0.62, 0.9)}
FONT = "Helvetica, Arial, sans-serif"


def _hex_rgb(h: str) -> tuple[float, float, float]:
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) / 255.0 for i in (0, 2, 4))


# ---------------------------------------------------------------------------
# Molecule registry.  Formula strings are the tabulated molecular formulas;
# CIP dicts map atom index (in THIS SMILES) -> expected descriptor.
# ---------------------------------------------------------------------------

# Monosaccharide parents (sugar-numbered CIP from the IUPAC names):
#   alpha-D-glucopyranose  (2S,3R,4S,5S,6R)-oxane  -> C1 S, C2 R, C3 S, C4 S, C5 R
#   beta-D-glucopyranose   (2R,3R,4S,5S,6R)        -> C1 R, C2 R, C3 S, C4 S, C5 R
#   beta-D-galactopyranose (2R,3R,4S,5R,6R)        -> C1 R, C2 R, C3 S, C4 R, C5 R
#   beta-D-fructofuranose  (2R,3S,4S,5R)-oxolane   -> C2 R, C3 S, C4 S, C5 R
#   open-chain D-glucose   (2R,3S,4R,5R)-pentahydroxyhexanal
ALPHA_GLC = "OC[C@H]1O[C@H](O)[C@H](O)[C@@H](O)[C@@H]1O"
BETA_GLC = "OC[C@H]1O[C@@H](O)[C@H](O)[C@@H](O)[C@@H]1O"
BETA_GAL = "OC[C@H]1O[C@@H](O)[C@H](O)[C@@H](O)[C@H]1O"  # C4 epimer of BETA_GLC
BETA_FRU = "OC[C@@]1(O)O[C@H](CO)[C@@H](O)[C@@H]1O"
OPEN_GLC = "OC[C@@H](O)[C@@H](O)[C@H](O)[C@@H](O)C=O"

# Disaccharide splice: the glycosidic oxygen is written with ring-closure %99
# in the SLOT the parent hydroxyl occupied, so SMILES neighbor order - and
# therefore every chiral tag's meaning - is unchanged from the parents.
MALTOSE = (
    "OC[C@H]1O[C@H](O%99)[C@H](O)[C@@H](O)[C@@H]1O"  # alpha-D-Glc donor (1->)
    "."
    "OC[C@H]2O[C@@H](O)[C@H](O)[C@@H](O)[C@@H]2%99"  # beta-D-Glc acceptor (->4)
)
LACTOSE = (
    "OC[C@H]1O[C@@H](O%99)[C@H](O)[C@@H](O)[C@H]1O"  # beta-D-Gal donor (1->)
    "."
    "OC[C@H]2O[C@@H](O)[C@H](O)[C@@H](O)[C@@H]2%99"  # beta-D-Glc acceptor (->4)
)
SUCROSE = (
    "OC[C@H]1O[C@H](O%99)[C@H](O)[C@@H](O)[C@@H]1O"  # alpha-D-Glc (1<->
    "."
    "OC[C@@]2%99O[C@H](CO)[C@@H](O)[C@@H]2O"  # <->2) beta-D-Fru
)

# Chirality-aware residue queries: the parent SMILES with the glycosidic
# position's O replaced/extended by a wildcard in the SAME slot.
Q_ALPHA_GLC_1 = "OC[C@H]1O[C@H](O*)[C@H](O)[C@@H](O)[C@@H]1O"
Q_BETA_GAL_1 = "OC[C@H]1O[C@@H](O*)[C@H](O)[C@@H](O)[C@H]1O"
Q_BETA_GLC_4 = "OC[C@H]1O[C@@H](O)[C@H](O)[C@@H](O)[C@@H]1*"
Q_BETA_FRU_2 = "OC[C@@]1(*)O[C@H](CO)[C@@H](O)[C@@H]1O"
# Anomeric negative controls: the WRONG-anomer donor must NOT match.
Q_BETA_GLC_1 = "OC[C@H]1O[C@@H](O*)[C@H](O)[C@@H](O)[C@@H]1O"
Q_ALPHA_GAL_1 = "OC[C@H]1O[C@H](O*)[C@H](O)[C@@H](O)[C@H]1O"

MOLS: dict[str, dict] = {
    # --- I.8 sugars -------------------------------------------------------
    "glucose-open": {
        "smiles": OPEN_GLC,
        "formula": "C6H12O6",
        "cip": {2: "R", 4: "R", 6: "S", 8: "R"},  # C5,C4,C3,C2
    },
    "alpha-D-glucopyranose": {
        "smiles": ALPHA_GLC,
        "formula": "C6H12O6",
        "cip": {2: "R", 4: "S", 6: "R", 8: "S", 10: "S"},  # C5,C1,C2,C3,C4
    },
    "beta-D-glucopyranose": {
        "smiles": BETA_GLC,
        "formula": "C6H12O6",
        "cip": {2: "R", 4: "R", 6: "R", 8: "S", 10: "S"},
    },
    "beta-D-galactopyranose": {
        "smiles": BETA_GAL,
        "formula": "C6H12O6",
        "cip": {2: "R", 4: "R", 6: "R", 8: "S", 10: "R"},
    },
    "beta-D-fructofuranose": {
        "smiles": BETA_FRU,
        "formula": "C6H12O6",
        "cip": {2: "R", 5: "R", 8: "S", 10: "S"},  # C2,C5,C4,C3
    },
    "maltose": {
        "smiles": MALTOSE,
        "formula": "C12H22O11",
        "stereocenters": 10,
        "residues": [Q_ALPHA_GLC_1, Q_BETA_GLC_4],
        "residues_not": [Q_BETA_GLC_1],
    },
    "lactose": {
        "smiles": LACTOSE,
        "formula": "C12H22O11",
        "stereocenters": 10,
        "residues": [Q_BETA_GAL_1, Q_BETA_GLC_4],
        "residues_not": [Q_ALPHA_GAL_1, Q_ALPHA_GLC_1],
    },
    "sucrose": {
        "smiles": SUCROSE,
        "formula": "C12H22O11",
        "stereocenters": 9,
        "residues": [Q_ALPHA_GLC_1, Q_BETA_FRU_2],
        "residues_not": [Q_BETA_GLC_1],
    },
    # --- I.9 lipids -------------------------------------------------------
    "palmitate": {
        "smiles": "OC(=O)CCCCCCCCCCCCCCC",
        "formula": "C16H32O2",
        "zbonds": 0,
    },
    "stearate": {
        "smiles": "OC(=O)CCCCCCCCCCCCCCCCC",
        "formula": "C18H36O2",
        "zbonds": 0,
    },
    "oleate": {
        "smiles": "OC(=O)CCCCCCC/C=C\\CCCCCCCC",
        "formula": "C18H34O2",
        "zbonds": 1,
    },
    "arachidonate": {
        "smiles": "OC(=O)CCC/C=C\\C/C=C\\C/C=C\\C/C=C\\CCCCC",
        "formula": "C20H32O2",
        "zbonds": 4,
    },
    "DPPC": {
        # 1,2-dipalmitoyl-sn-glycero-3-phosphocholine; natural sn-glycerol
        # configuration (single stereocenter, R).
        "smiles": (
            "CCCCCCCCCCCCCCCC(=O)OC[C@H]"
            "(COP(=O)([O-])OCC[N+](C)(C)C)"
            "OC(=O)CCCCCCCCCCCCCCC"
        ),
        "formula": "C40H80NO8P",
        "stereocenters": 1,
        "cip": {19: "R"},
    },
    "cholesterol": {
        "smiles": (
            "C[C@H](CCCC(C)C)[C@H]1CC[C@H]2[C@@H]3CC=C4"
            "C[C@@H](O)CC[C@]4(C)[C@H]3CC[C@]12C"
        ),
        "formula": "C27H46O",
        "stereocenters": 8,
        "cip_counts": {"R": 4, "S": 4},  # 3S,8S,9S,10R,13R,14S,17R,20R
    },
    # --- I.11 nucleotides -------------------------------------------------
    "adenine": {"smiles": "Nc1ncnc2[nH]cnc12", "formula": "C5H5N5"},
    "guanine": {"smiles": "Nc1nc2[nH]cnc2c(=O)[nH]1", "formula": "C5H5N5O"},
    "cytosine": {"smiles": "Nc1cc[nH]c(=O)n1", "formula": "C4H5N3O"},
    "thymine": {"smiles": "Cc1c[nH]c(=O)[nH]c1=O", "formula": "C5H6N2O2"},
    "uracil": {"smiles": "O=c1cc[nH]c(=O)[nH]1", "formula": "C4H4N2O2"},
    "dAMP": {
        # 2'-deoxyadenosine 5'-monophosphate, base on N9;
        # sugar CIP (IUPAC (2R,3S,5R)-oxolane): C1' R, C3' S, C4' R.
        "smiles": "Nc1ncnc2n(cnc12)[C@H]1C[C@H](O)[C@@H](COP(=O)(O)O)O1",
        "formula": "C10H14N5O6P",
        "stereocenters": 3,
        "cip": {10: "R", 12: "S", 14: "R"},
    },
}


# ---------------------------------------------------------------------------
# Mechanical verification
# ---------------------------------------------------------------------------


def _mol(name: str) -> Chem.Mol:
    m = Chem.MolFromSmiles(MOLS[name]["smiles"])
    if m is None:
        raise ValueError(f"{name}: SMILES failed to parse")
    return m


def _query(smiles: str) -> Chem.Mol:
    """Parse a residue query; dummies (*) become match-anything wildcards."""
    q = Chem.MolFromSmiles(smiles)
    if q is None:
        raise ValueError(f"residue query failed to parse: {smiles}")
    p = Chem.AdjustQueryParameters.NoAdjustments()
    p.makeDummiesQueries = True
    return Chem.AdjustQueryProperties(q, p)


def find_glycosidic_o(mol: Chem.Mol) -> int:
    """The unique non-ring O bonded to two carbons (the glycosidic bridge)."""
    hits = [
        a.GetIdx()
        for a in mol.GetAtoms()
        if a.GetAtomicNum() == 8
        and not a.IsInRing()
        and a.GetDegree() == 2
        and all(n.GetAtomicNum() == 6 for n in a.GetNeighbors())
    ]
    if len(hits) != 1:
        raise AssertionError(f"expected 1 glycosidic O, found {hits}")
    return hits[0]


def verify() -> list[str]:
    lines = []
    for name, spec in MOLS.items():
        m = _mol(name)
        formula = CalcMolFormula(m)
        if formula != spec["formula"]:
            raise AssertionError(
                f"{name}: formula {formula} != tabulated {spec['formula']}"
            )
        Chem.AssignStereochemistry(m, cleanIt=True, force=True)
        centers = Chem.FindMolChiralCenters(m, includeUnassigned=True)
        # A phosphodiester P is flagged '?' only because its resonance-
        # equivalent P=O / P-O(-) are graph-distinct; every CARBON must be
        # assigned.
        if any(
            code == "?" and m.GetAtomWithIdx(idx).GetAtomicNum() == 6
            for idx, code in centers
        ):
            raise AssertionError(f"{name}: unassigned stereocenter in {centers}")
        centers = [(i, c) for i, c in centers if c != "?"]
        if "stereocenters" in spec and len(centers) != spec["stereocenters"]:
            raise AssertionError(
                f"{name}: {len(centers)} stereocenters, expected "
                f"{spec['stereocenters']}: {centers}"
            )
        if "cip" in spec:
            got = dict(centers)
            for idx, want in spec["cip"].items():
                if got.get(idx) != want:
                    raise AssertionError(
                        f"{name}: CIP at atom {idx} is {got.get(idx)}, "
                        f"expected {want}; all centers: {centers}"
                    )
        if "cip_counts" in spec:
            codes = [c for _, c in centers]
            for code, n in spec["cip_counts"].items():
                if codes.count(code) != n:
                    raise AssertionError(
                        f"{name}: CIP counts {codes} != {spec['cip_counts']}"
                    )
        if "zbonds" in spec:
            nz = sum(
                1 for b in m.GetBonds() if b.GetStereo() == Chem.BondStereo.STEREOZ
            )
            ne = sum(
                1 for b in m.GetBonds() if b.GetStereo() == Chem.BondStereo.STEREOE
            )
            if nz != spec["zbonds"] or ne != 0:
                raise AssertionError(
                    f"{name}: {nz} Z / {ne} E bonds, expected {spec['zbonds']} Z / 0 E"
                )
        if "residues" in spec:
            find_glycosidic_o(m)  # must exist and be unique
            for q_smiles in spec["residues"]:
                if not m.HasSubstructMatch(_query(q_smiles), useChirality=True):
                    raise AssertionError(
                        f"{name}: chirality-aware residue match FAILED for "
                        f"{q_smiles}"
                    )
            for q_smiles in spec.get("residues_not", []):
                if m.HasSubstructMatch(_query(q_smiles), useChirality=True):
                    raise AssertionError(
                        f"{name}: wrong-anomer residue query MATCHED: {q_smiles}"
                    )
        n_stereo = len(centers)
        lines.append(
            f"  {name:24s} {formula:14s} ok"
            f"  (stereocenters: {n_stereo}, InChIKey "
            f"{Chem.MolToInchiKey(m)})"
        )
    return lines


# ---------------------------------------------------------------------------
# Drawing helpers
# ---------------------------------------------------------------------------


def _apply_opts(d: rdMolDraw2D.MolDraw2DSVG, mode: str) -> None:
    o = d.drawOptions()
    o.clearBackground = False
    o.bondLineWidth = 1.8
    o.fixedBondLength = 27
    o.padding = 0.07
    o.additionalAtomLabelPadding = 0.06
    o.annotationFontScale = 0.65
    o.setAtomPalette({k: _hex_rgb(v) for k, v in PALETTE[mode].items()})
    o.setAnnotationColour(_hex_rgb(INK2[mode]))


def _align(mol: Chem.Mol, left_atom: int | None = None,
           right_atom: int | None = None) -> None:
    """Rotate the conformer so its principal axis is horizontal; optionally
    mirror so left_atom lands on the left (or right_atom on the right).
    Mirroring happens BEFORE wedging, so wedge assignment stays correct."""
    conf = mol.GetConformer()
    pts = np.array(
        [[conf.GetAtomPosition(i).x, conf.GetAtomPosition(i).y]
         for i in range(mol.GetNumAtoms())]
    )
    pts -= pts.mean(axis=0)
    _, _, vt = np.linalg.svd(pts, full_matrices=False)
    th = math.atan2(vt[0, 1], vt[0, 0])
    rot = np.array([[math.cos(-th), -math.sin(-th)],
                    [math.sin(-th), math.cos(-th)]])
    pts = pts @ rot.T
    flip = False
    if left_atom is not None and pts[left_atom, 0] > 0:
        flip = True
    if right_atom is not None and pts[right_atom, 0] < 0:
        flip = True
    if flip:
        pts[:, 0] *= -1
    for i in range(mol.GetNumAtoms()):
        conf.SetAtomPosition(i, (float(pts[i, 0]), float(pts[i, 1]), 0.0))


def render_mol(
    smiles_or_mol,
    w: int,
    h: int,
    mode: str,
    highlight_atoms: tuple[int, ...] = (),
    highlight_bonds: tuple[int, ...] = (),
    notes: dict[int, str] | None = None,
    align: bool = False,
    left_atom: int | None = None,
    right_atom: int | None = None,
):
    """Draw one molecule; return (inner_svg, draw2d) - draw2d for GetDrawCoords."""
    mol = (
        Chem.MolFromSmiles(smiles_or_mol)
        if isinstance(smiles_or_mol, str)
        else Chem.Mol(smiles_or_mol)
    )
    rdDepictor.Compute2DCoords(mol)
    if align:
        _align(mol, left_atom=left_atom, right_atom=right_atom)
    if notes:
        for idx, txt in notes.items():
            mol.GetAtomWithIdx(idx).SetProp("atomNote", txt)
    d = rdMolDraw2D.MolDraw2DSVG(w, h)
    _apply_opts(d, mode)
    hl = HIGHLIGHT[mode]
    rdMolDraw2D.PrepareAndDrawMolecule(
        d,
        mol,
        highlightAtoms=list(highlight_atoms),
        highlightAtomColors={i: hl for i in highlight_atoms},
        highlightBonds=list(highlight_bonds),
        highlightBondColors={i: hl for i in highlight_bonds},
    )
    d.FinishDrawing()
    svg = d.GetDrawingText()
    start = svg.index("<!-- END OF HEADER -->") + len("<!-- END OF HEADER -->")
    end = svg.rindex("</svg>")
    inner = svg[start:end]
    # This RDKit build draws atomNote glyphs in hardcoded black regardless of
    # annotationColour; recolor them to the theme's secondary ink.
    inner = re.sub(
        r"(class='note'[^>]*fill=')#000000(')",
        lambda mm: mm.group(1) + INK2[mode] + mm.group(2),
        inner,
    )
    return inner, d


def T(x, y, s, size, color, weight="normal", anchor="middle") -> str:
    return (
        f"<text x='{x:.1f}' y='{y:.1f}' font-family=\"{FONT}\" "
        f"font-size='{size}' fill='{color}' font-weight='{weight}' "
        f"text-anchor='{anchor}'>{escape(s)}</text>"
    )


def G(x, y, body) -> str:
    return f"<g transform='translate({x:.1f},{y:.1f})'>{body}</g>"


def bracket(x1, x2, y, label, mode, sub=None) -> str:
    """Downward square bracket spanning [x1,x2] at height y, label below."""
    c = INK2[mode]
    p = (
        f"<path d='M {x1:.1f} {y - 6:.1f} L {x1:.1f} {y:.1f} "
        f"L {x2:.1f} {y:.1f} L {x2:.1f} {y - 6:.1f}' "
        f"fill='none' stroke='{c}' stroke-width='1.2'/>"
    )
    mid = (x1 + x2) / 2
    out = p + T(mid, y + 14, label, 12, INK[mode], weight="600")
    if sub:
        out += T(mid, y + 28, sub, 11, INK2[mode])
    return out


def atom_x_range(d, idxs, pad=8.0) -> tuple[float, float]:
    xs = [d.GetDrawCoords(i).x for i in idxs]
    return min(xs) - pad, max(xs) + pad


def svg_doc(w: int, h: int, body: str) -> str:
    return (
        f"<svg xmlns='http://www.w3.org/2000/svg' width='{w}' height='{h}' "
        f"viewBox='0 0 {w} {h}'>{body}</svg>\n"
    )


def write_pair(name: str, builder) -> None:
    for mode in ("light", "dark"):
        path = OUT / (f"{name}.svg" if mode == "light" else f"{name}.dark.svg")
        path.write_text(builder(mode))
        if path.stat().st_size == 0:
            raise AssertionError(f"{path} is empty")
        print(f"  wrote {path.name}")


# ---------------------------------------------------------------------------
# Figure 1: bcs-glucose-forms
# ---------------------------------------------------------------------------


def fig_glucose_forms(mode: str) -> str:
    W, H, CW, CH = 930, 340, 310, 250
    cells = [
        ("glucose-open", "open-chain D-glucose", "C1 aldehyde free",
         {10: "1", 8: "2", 2: "5", 1: "6"}, (10,)),
        ("alpha-D-glucopyranose", "α-D-glucopyranose",
         "anomeric OH trans to C6 (α)", {4: "1", 2: "5", 1: "6"}, (4,)),
        ("beta-D-glucopyranose", "β-D-glucopyranose",
         "anomeric OH cis to C6 (β)", {4: "1", 2: "5", 1: "6"}, (4,)),
    ]
    body = ""
    for i, (name, title, sub, notes, hl) in enumerate(cells):
        inner, _ = render_mol(
            _mol(name), CW, CH, mode, highlight_atoms=hl, notes=notes
        )
        x = i * CW
        body += G(x, 8, inner)
        body += T(x + CW / 2, CH + 34, title, 14, INK[mode], weight="600")
        body += T(x + CW / 2, CH + 52, sub, 11.5, INK2[mode])
        if i:
            body += (
                f"<line x1='{x:.1f}' y1='24' x2='{x:.1f}' y2='{CH - 8}' "
                f"stroke='{RULE[mode]}' stroke-width='1'/>"
            )
    body += T(
        W / 2, H - 10,
        "ring closure makes C1 (highlighted) a new stereocenter — the anomeric carbon",
        11.5, INK2[mode],
    )
    return svg_doc(W, H, body)


# ---------------------------------------------------------------------------
# Figure 2: bcs-disaccharides
# ---------------------------------------------------------------------------


def fig_disaccharides(mode: str) -> str:
    W, H, CW, CH = 960, 400, 320, 290
    cells = [
        ("maltose", "maltose — Glc(α1→4)Glc", "reducing (one anomeric C free)"),
        ("lactose", "lactose — Gal(β1→4)Glc", "reducing (one anomeric C free)"),
        ("sucrose", "sucrose — Glc(α1↔2β)Fru", "nonreducing (both anomeric C tied)"),
    ]
    body = ""
    for i, (name, title, sub) in enumerate(cells):
        m = _mol(name)
        og = find_glycosidic_o(m)
        oa = m.GetAtomWithIdx(og)
        c_link = [n.GetIdx() for n in oa.GetNeighbors()]
        # anomeric linked C = 2 oxygen neighbors; label its sugar number.
        notes = {}
        for ci in c_link:
            a = m.GetAtomWithIdx(ci)
            n_o = sum(1 for n in a.GetNeighbors() if n.GetAtomicNum() == 8)
            heavy = sum(1 for n in a.GetNeighbors() if n.GetAtomicNum() > 1)
            if n_o == 2 and heavy == 4:
                notes[ci] = "2"  # fructose anomeric C2 (quaternary-substituted)
            elif n_o == 2:
                notes[ci] = "1"  # pyranose anomeric C1
            else:
                notes[ci] = "4"  # acceptor C4
        bonds = [m.GetBondBetweenAtoms(og, ci).GetIdx() for ci in c_link]
        inner, _ = render_mol(
            m, CW, CH, mode,
            highlight_atoms=(og,), highlight_bonds=tuple(bonds), notes=notes,
        )
        x = i * CW
        body += G(x, 8, inner)
        body += T(x + CW / 2, CH + 34, title, 13.5, INK[mode], weight="600")
        body += T(x + CW / 2, CH + 52, sub, 11.5, INK2[mode])
        if i:
            body += (
                f"<line x1='{x:.1f}' y1='24' x2='{x:.1f}' y2='{CH - 8}' "
                f"stroke='{RULE[mode]}' stroke-width='1'/>"
            )
    body += T(
        W / 2, H - 10,
        "glycosidic bridge highlighted; numbers mark the linked carbons "
        "(all three are C12H22O11)",
        11.5, INK2[mode],
    )
    return svg_doc(W, H, body)


# ---------------------------------------------------------------------------
# Figure 3: bcs-fatty-acids
# ---------------------------------------------------------------------------


def fig_fatty_acids(mode: str) -> str:
    W = 880
    rows = [
        ("palmitate", "palmitate 16:0 — saturated, straight", 96, {}),
        ("stearate", "stearate 18:0 — saturated, straight", 96, {}),
        ("oleate", "oleate 18:1 cis-Δ9 — one kink", 120, {10: "9"}),
        ("arachidonate", "arachidonate 20:4 cis-Δ5,8,11,14 — four kinks", 205,
         {6: "5", 9: "8", 12: "11", 15: "14"}),
    ]
    body, y = "", 6
    for name, title, mh, notes in rows:
        body += T(12, y + 14, title, 13.5, INK[mode], weight="600", anchor="start")
        inner, _ = render_mol(
            _mol(name), W - 24, mh, mode,
            notes=notes, align=True, left_atom=1,
        )
        body += G(12, y + 20, inner)
        y += mh + 34
        if name != "arachidonate":
            body += (
                f"<line x1='12' y1='{y - 5:.1f}' x2='{W - 12}' y2='{y - 5:.1f}' "
                f"stroke='{RULE[mode]}' stroke-width='1'/>"
            )
    body += T(
        W / 2, y + 8,
        "double-bond positions numbered from the carboxyl carbon (Δ); "
        "every double bond drawn is cis",
        11.5, INK2[mode],
    )
    return svg_doc(W, y + 22, body)


# ---------------------------------------------------------------------------
# Figure 4: bcs-membrane-lipids
# ---------------------------------------------------------------------------


def fig_membrane_lipids(mode: str) -> str:
    W = 940
    body = ""
    # --- DPPC ---
    m = _mol("DPPC")
    head_q = Chem.MolFromSmarts("[OX2]P(=O)([O-])OCC[N+](C)(C)C")
    head = m.GetSubstructMatch(head_q)
    tail_q = Chem.MolFromSmarts("C(=O)CCCCCCCCCCCCCCC")
    tail_matches = m.GetSubstructMatches(tail_q)
    n_idx = next(a.GetIdx() for a in m.GetAtoms() if a.GetAtomicNum() == 7)
    mw, mh = W - 40, 250
    inner, d = render_mol(m, mw, mh, mode, align=True, right_atom=n_idx)
    body += T(12, 18, "phosphatidylcholine — 1,2-dipalmitoyl-sn-glycero-3-"
              "phosphocholine (DPPC), C40H80NO8P", 13.5, INK[mode],
              weight="600", anchor="start")
    body += G(20, 26, inner)
    by = 26 + mh + 6
    spans = [
        atom_x_range(d, match) + ("hydrophobic tail — palmitoyl (16:0)",)
        for match in tail_matches
    ]
    spans.append(atom_x_range(d, head) + ("polar head — phosphocholine",))
    spans.sort()
    clipped: list[tuple[float, float, str]] = []
    for x1, x2, lab in spans:
        if clipped and x1 < clipped[-1][1] + 8:
            x1 = clipped[-1][1] + 8
        clipped.append((x1, x2, lab))
    for x1, x2, lab in clipped:
        body += bracket(20 + x1, 20 + x2, by, lab, mode)
    y = by + 40
    body += (
        f"<line x1='12' y1='{y:.1f}' x2='{W - 12}' y2='{y:.1f}' "
        f"stroke='{RULE[mode]}' stroke-width='1'/>"
    )
    # --- cholesterol ---
    m2 = _mol("cholesterol")
    o_idx = next(a.GetIdx() for a in m2.GetAtoms() if a.GetAtomicNum() == 8)
    ring_atoms = [a.GetIdx() for a in m2.GetAtoms() if a.IsInRing()]
    # tail = largest connected component of non-ring carbons
    nonring = {a.GetIdx() for a in m2.GetAtoms()
               if not a.IsInRing() and a.GetAtomicNum() == 6}
    comps, seen = [], set()
    for i in nonring:
        if i in seen:
            continue
        comp, stack = set(), [i]
        while stack:
            j = stack.pop()
            if j in comp:
                continue
            comp.add(j)
            for n in m2.GetAtomWithIdx(j).GetNeighbors():
                if n.GetIdx() in nonring and n.GetIdx() not in comp:
                    stack.append(n.GetIdx())
        seen |= comp
        comps.append(comp)
    tail2 = max(comps, key=len)
    mw2, mh2 = 560, 210
    inner2, d2 = render_mol(m2, mw2, mh2, mode, align=True, left_atom=o_idx)
    y0 = y + 12
    body += T(12, y0 + 12, "cholesterol, C27H46O", 13.5, INK[mode],
              weight="600", anchor="start")
    body += G(20, y0 + 20, inner2)
    ox1, ox2 = atom_x_range(d2, [o_idx], pad=12)
    rx1, rx2 = atom_x_range(d2, ring_atoms)
    tx1, tx2 = atom_x_range(d2, list(tail2))
    by2 = y0 + 20 + mh2 + 6
    body += bracket(20 + ox1, 20 + ox2, by2, "–OH", mode)
    body += bracket(20 + max(rx1, ox2 + 6), 20 + min(rx2, tx1 - 6), by2,
                    "rigid steroid nucleus", mode)
    body += bracket(20 + max(tx1, min(rx2, tx1 - 6) + 6), 20 + tx2, by2,
                    "hydrocarbon tail", mode)
    # side note
    nx = 20 + mw2 + 24
    for k, line in enumerate([
        "Both are amphipathic, but unequally:",
        "DPPC's big zwitterionic head and two",
        "16:0 tails build the bilayer; cholesterol's",
        "single –OH is its entire polar head, and",
        "the rigid rings wedge between the tails.",
    ]):
        body += T(nx, y0 + 60 + 17 * k, line, 12, INK2[mode], anchor="start")
    H = by2 + 44
    return svg_doc(W, H, body)


# ---------------------------------------------------------------------------
# Figure 5: bcs-bases
# ---------------------------------------------------------------------------


def fig_bases(mode: str) -> str:
    W = 940
    CW, CH1, CH2 = 300, 190, 175
    purines = [
        ("adenine", "adenine (A)", "C5H5N5 — DNA + RNA"),
        ("guanine", "guanine (G)", "C5H5N5O — DNA + RNA"),
    ]
    pyrimidines = [
        ("cytosine", "cytosine (C)", "C4H5N3O — DNA + RNA"),
        ("thymine", "thymine (T)", "C5H6N2O2 — DNA only"),
        ("uracil", "uracil (U)", "C4H4N2O2 — RNA only"),
    ]
    body = T(16, 22, "PURINES — fused double ring", 13, INK[mode],
             weight="700", anchor="start")
    x0 = (W - 2 * CW) / 2
    for i, (name, title, sub) in enumerate(purines):
        inner, _ = render_mol(_mol(name), CW, CH1, mode)
        x = x0 + i * CW
        body += G(x, 30, inner)
        body += T(x + CW / 2, CH1 + 48, title, 13.5, INK[mode], weight="600")
        body += T(x + CW / 2, CH1 + 65, sub, 11.5, INK2[mode])
    y1 = CH1 + 82
    body += (
        f"<line x1='12' y1='{y1:.1f}' x2='{W - 12}' y2='{y1:.1f}' "
        f"stroke='{RULE[mode]}' stroke-width='1'/>"
    )
    body += T(16, y1 + 22, "PYRIMIDINES — single ring", 13, INK[mode],
              weight="700", anchor="start")
    x0 = (W - 3 * CW) / 2
    for i, (name, title, sub) in enumerate(pyrimidines):
        inner, _ = render_mol(_mol(name), CW, CH2, mode)
        x = x0 + i * CW
        body += G(x, y1 + 30, inner)
        body += T(x + CW / 2, y1 + 30 + CH2 + 18, title, 13.5, INK[mode],
                  weight="600")
        body += T(x + CW / 2, y1 + 30 + CH2 + 35, sub, 11.5, INK2[mode])
    H = y1 + 30 + CH2 + 48
    return svg_doc(W, H, body)


# ---------------------------------------------------------------------------
# Figure 6: bcs-nucleotide-anatomy
# ---------------------------------------------------------------------------


def fig_nucleotide(mode: str) -> str:
    W = 880
    m = _mol("dAMP")
    notes = {10: "1'", 11: "2'", 12: "3'", 14: "4'", 15: "5'"}
    base_atoms = [a.GetIdx() for a in m.GetAtoms() if a.GetIsAromatic()]
    base_atoms.append(0)  # exocyclic amine N
    ri = m.GetRingInfo()
    sugar_ring = next(r for r in ri.AtomRings()
                      if not m.GetAtomWithIdx(r[0]).GetIsAromatic())
    sugar_atoms = list(sugar_ring) + [13, 15]  # + O3', C5'
    p_idx = next(a.GetIdx() for a in m.GetAtoms() if a.GetAtomicNum() == 15)
    phos_atoms = [p_idx] + [
        n.GetIdx() for n in m.GetAtomWithIdx(p_idx).GetNeighbors()
    ]
    mw, mh = W - 40, 220
    inner, d = render_mol(
        m, mw, mh, mode, notes=notes, align=True, left_atom=p_idx,
        highlight_atoms=(11,),
    )
    body = T(12, 18, "deoxyadenosine 5′-monophosphate (dAMP), C10H14N5O6P",
             13.5, INK[mode], weight="600", anchor="start")
    body += G(20, 26, inner)
    by = 26 + mh + 6
    px1, px2 = atom_x_range(d, phos_atoms)
    sx1, sx2 = atom_x_range(d, sugar_atoms)
    bx1, bx2 = atom_x_range(d, base_atoms)
    spans = sorted([(px1, px2, "phosphate", "at 5′"),
                    (sx1, sx2, "2′-deoxyribose", "sugar"),
                    (bx1, bx2, "adenine", "base, on N9")])
    # clip overlaps left-to-right
    clipped = []
    for i, (x1, x2, lab, sub) in enumerate(spans):
        if clipped and x1 < clipped[-1][1] + 6:
            x1 = clipped[-1][1] + 6
        clipped.append((x1, x2, lab, sub))
    for x1, x2, lab, sub in clipped:
        body += bracket(20 + x1, 20 + x2, by, lab, mode, sub=sub)
    body += T(
        W / 2, by + 52,
        "the highlighted 2′ carbon carries H — in RNA's ribose it carries OH; "
        "chains grow at the 3′ hydroxyl",
        11.5, INK2[mode],
    )
    return svg_doc(W, by + 66, body)


# ---------------------------------------------------------------------------

FIGS = {
    "bcs-glucose-forms": fig_glucose_forms,
    "bcs-disaccharides": fig_disaccharides,
    "bcs-fatty-acids": fig_fatty_acids,
    "bcs-membrane-lipids": fig_membrane_lipids,
    "bcs-bases": fig_bases,
    "bcs-nucleotide-anatomy": fig_nucleotide,
}


def main() -> None:
    only = sys.argv[1] if len(sys.argv) > 1 else ""
    print("verifying molecules against tabulated formulas / CIP descriptors:")
    for line in verify():
        print(line)
    OUT.mkdir(parents=True, exist_ok=True)
    for name, fn in FIGS.items():
        if only and only not in name:
            continue
        print(f"{name}:")
        write_pair(name, fn)
    print("done.")


if __name__ == "__main__":
    main()
