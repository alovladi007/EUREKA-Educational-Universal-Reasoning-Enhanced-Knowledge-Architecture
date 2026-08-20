#!/usr/bin/env python3
"""Chemical-structure figures for OCTET ORG1 chapters 2-5.

The visual layer the depth programme's prose was missing: every molecule
is DEFINED by its SMILES string and rendered from that molecular graph by
RDKit - nothing is traced. Correctness is mechanical: for every molecule
the script asserts RDKit's computed molecular formula against the
tabulated formula in the table below, and any mismatch raises.

Same machinery as eureka/scripts/gen_mcat_structures_*.py (the MCAT
Biochem structure pass), retargeted at octet's figure convention:

    apps/web/public/figures/octet/{stem}-light.svg
    apps/web/public/figures/octet/{stem}-dark.svg

Run with the shared RDKit venv:

    ~/Desktop/EUREKA/eureka/scripts/.venv-rdkit/bin/python \
        scripts/gen_org_structures.py
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
    / "apps" / "web" / "public" / "figures" / "octet"
)

FONT = "Helvetica, Arial, sans-serif"

THEMES = {
    "light": {
        "palette": {
            -1: (0.11, 0.11, 0.13),
            7: (0.10, 0.28, 0.80),
            8: (0.73, 0.11, 0.11),
            16: (0.63, 0.42, 0.02),
            35: (0.55, 0.13, 0.13),
            17: (0.10, 0.50, 0.15),
        },
        "text": "#1c1c1e",
        "subtext": "#52525b",
        "accent": "#2a78d6",
        "highlight": (1.00, 0.85, 0.46, 1.0),
    },
    "dark": {
        "palette": {
            -1: (0.831, 0.831, 0.847),
            7: (0.58, 0.71, 1.00),
            8: (1.00, 0.56, 0.53),
            16: (0.92, 0.81, 0.43),
            35: (0.94, 0.55, 0.45),
            17: (0.55, 0.85, 0.55),
        },
        "text": "#d4d4d8",
        "subtext": "#a1a1aa",
        "accent": "#3987e5",
        "highlight": (0.42, 0.34, 0.11, 1.0),
    },
}

CHECKS: list[str] = []
_SEEN: set[str] = set()


def build(name: str, smiles: str, expected: str) -> Chem.Mol:
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        raise ValueError(f"{name}: SMILES failed to parse: {smiles}")
    got = rdMolDescriptors.CalcMolFormula(mol)
    if got != expected:
        raise ValueError(
            f"{name}: formula mismatch - SMILES gives {got}, table says {expected}"
        )
    if name not in _SEEN:
        _SEEN.add(name)
        CHECKS.append(f"  {name:<28} {got:>12}  == tabulated  OK")
    rdDepictor.Compute2DCoords(mol)
    return mol


_HEADER_RE = re.compile(r"^.*?<!-- END OF HEADER -->", re.S)


def mol_body(mol, w, h, mode, font=15):
    theme = THEMES[mode]
    d = rdMolDraw2D.MolDraw2DSVG(w, h)
    o = d.drawOptions()
    o.clearBackground = False
    o.setAtomPalette(theme["palette"])
    o.setHighlightColour(theme["highlight"])
    o.fixedFontSize = font
    o.bondLineWidth = 2
    rdMolDraw2D.PrepareAndDrawMolecule(d, mol)
    d.FinishDrawing()
    svg = d.GetDrawingText()
    return _HEADER_RE.sub("", svg).replace("</svg>", "").strip()


def text_el(x, y, s, size, color, bold=False, anchor="middle"):
    weight = " font-weight='600'" if bold else ""
    return (
        f"<text x='{x:.1f}' y='{y:.1f}' font-family=\"{FONT}\" "
        f"font-size='{size}px' fill='{color}'{weight} "
        f"text-anchor='{anchor}'>{s}</text>"
    )


def group(x, y, body):
    return f"<g transform='translate({x:.1f},{y:.1f})'>{body}</g>"


def arrow(x, y, length, color, label="", sublabel="", subcolor=""):
    x2 = x + length
    parts = [
        f"<line x1='{x:.1f}' y1='{y:.1f}' x2='{x2 - 9:.1f}' y2='{y:.1f}' "
        f"stroke='{color}' stroke-width='2'/>",
        f"<polygon points='{x2:.1f},{y:.1f} {x2 - 11:.1f},{y - 5.5:.1f} "
        f"{x2 - 11:.1f},{y + 5.5:.1f}' fill='{color}'/>",
    ]
    cx = x + length / 2
    if label:
        parts.append(text_el(cx, y - 10, label, 13.5, color))
    if sublabel:
        parts.append(text_el(cx, y + 20, sublabel, 12.5, subcolor or color))
    return "".join(parts)


def plus(x, y, color):
    return text_el(x, y + 6, "+", 22, color)


def svg_doc(w, h, body):
    return (
        f"<svg xmlns='http://www.w3.org/2000/svg' "
        f"width='{w:.0f}' height='{h:.0f}' viewBox='0 0 {w:.0f} {h:.0f}'>"
        f"{body}</svg>\n"
    )


# ---------------------------------------------------------------------------
# Molecule table: label -> (display name, SMILES, formula, caption line 2)
# ---------------------------------------------------------------------------

MOLS = {
    # ch2 - alkane isomers (bp/mp from the lesson's CRC-sourced table)
    "pentane": ("pentane", "CCCCC", "C5H12", "bp 36.1 C"),
    "isopentane": ("2-methylbutane", "CCC(C)C", "C5H12", "bp 27.8 C"),
    "neopentane": ("2,2-dimethylpropane", "CC(C)(C)C", "C5H12", "bp 9.5 C"),
    "hexane": ("hexane", "CCCCCC", "C6H14", ""),
    "2mp": ("2-methylpentane", "CCCC(C)C", "C6H14", ""),
    "3mp": ("3-methylpentane", "CCC(C)CC", "C6H14", ""),
    "22dmb": ("2,2-dimethylbutane", "CCC(C)(C)C", "C6H14", ""),
    "23dmb": ("2,3-dimethylbutane", "CC(C)C(C)C", "C6H14", ""),
    # ch3 - conjugate bases
    "ethoxide": ("ethoxide", "CC[O-]", "C2H5O-", "pKa(EtOH) 15.9"),
    "phenoxide": ("phenoxide", "[O-]c1ccccc1", "C6H5O-", "pKa(PhOH) 10.0"),
    "acetate": ("acetate", "CC(=O)[O-]", "C2H3O2-", "pKa(AcOH) 4.76"),
    # ch3 - nucleophile gallery
    "hydroxide": ("hydroxide", "[OH-]", "HO-", "strong base and nucleophile"),
    "water": ("water", "O", "H2O", "weak nucleophile, common solvent"),
    "ammonia": ("ammonia", "N", "H3N", "N lone pair"),
    "cyanide": ("cyanide", "[C-]#N", "CN-", "attacks through carbon"),
    "iodide": ("iodide", "[I-]", "I-", "best halide nucleophile (protic)"),
    "methanethiolate": ("methanethiolate", "C[S-]", "CH3S-", "soft sulfur donor"),
    # ch4 - butene geometry + substitution ladder
    "cis2butene": ("cis-2-butene", "C/C=C\\C", "C4H8", "bp 3.7 C, less stable"),
    "trans2butene": ("trans-2-butene", "C/C=C/C", "C4H8", "bp 0.9 C, more stable"),
    "ethylene": ("ethylene", "C=C", "C2H4", "unsubstituted"),
    "propene": ("propene", "CC=C", "C3H6", "monosubstituted"),
    "2m2b": ("2-methyl-2-butene", "CC(C)=CC", "C5H10", "trisubstituted"),
    "23dm2b": ("2,3-dimethyl-2-butene", "CC(C)=C(C)C", "C6H12", "tetrasubstituted"),
    # ch4 - E/Z with a halogen (the priority trap)
    "e1b1p": ("(E)-1-bromo-1-propene", "C/C=C/Br", "C3H5Br", "Br outranks CH3"),
    "z1b1p": ("(Z)-1-bromo-1-propene", "C/C=C\\Br", "C3H5Br", "priorities together"),
    # ch4 - Markovnikov products
    "2brpropane": ("2-bromopropane", "CC(Br)C", "C3H7Br", "major (2 deg cation)"),
    "1brpropane": ("1-bromopropane", "CCCBr", "C3H7Br", "minor / radical product"),
    # ch4 - hydride shift
    "3m1b": ("3-methyl-1-butene", "CC(C)C=C", "C5H10", ""),
    "2cl2mb": ("2-chloro-2-methylbutane", "CCC(C)(C)Cl", "C5H11Cl", "rearranged major"),
    "2cl3mb": ("2-chloro-3-methylbutane", "CC(C)C(C)Cl", "C5H11Cl", "unrearranged minor"),
    # ch5 - bromonium products
    "cyclopentene": ("cyclopentene", "C1=CCCC1", "C5H8", ""),
    "transdibr": ("trans-1,2-dibromocyclopentane",
                  "Br[C@H]1CCC[C@@H]1Br", "C5H8Br2", "anti addition only"),
    # ch5 - three hydrations of 1-methylcyclohexene-like substrate: use propene
    "2propanol": ("2-propanol", "CC(O)C", "C3H8O", "Markovnikov OH"),
    "1propanol": ("1-propanol", "CCCO", "C3H8O", "anti-Markovnikov OH"),
    # ch5 - epoxide / diols
    "cyclohexene": ("cyclohexene", "C1=CCCCC1", "C6H10", ""),
    "cyclohexeneoxide": ("cyclohexene oxide", "C1CCC2OC2C1", "C6H10O", "from mCPBA, syn"),
    "transdiol": ("trans-1,2-cyclohexanediol",
                  "O[C@H]1CCCC[C@@H]1O", "C6H12O2", "epoxide + H3O+ (anti)"),
    "cisdiol": ("cis-1,2-cyclohexanediol",
                "O[C@H]1CCCC[C@H]1O", "C6H12O2", "OsO4 (syn)"),
    # ch5 - ozonolysis
    "2m2b_oz": ("2-methyl-2-butene", "CC(C)=CC", "C5H10", ""),
    "acetone": ("acetone", "CC(C)=O", "C3H6O", "from the disubstituted carbon"),
    "acetaldehyde": ("acetaldehyde", "CC=O", "C2H4O", "from the CH carbon"),
    # ch5 - Zaitsev / Hofmann
    "2brbutane": ("2-bromobutane", "CCC(C)Br", "C4H9Br", ""),
    "hexanedial": ("hexanedial", "O=CCCCCC=O", "C6H10O2",
                   "one chain, both new carbonyls"),
    "trans2butene_z": ("trans-2-butene", "C/C=C/C", "C4H8", "Zaitsev major (NaOEt)"),
    "1butene": ("1-butene", "CCC=C", "C4H8", "Hofmann major (KOtBu)"),
}


def cell(key, mode, w=200, h=150, cap_size=13.5):
    """One molecule with its name + caption, returned as (body, w, h_total)."""
    theme = THEMES[mode]
    name, smiles, formula, cap2 = MOLS[key]
    mol = build(name, smiles, formula)
    parts = [mol_body(mol, w, h, mode)]
    cx = w / 2
    parts.append(text_el(cx, h + 16, name, 14.5, theme["text"], bold=True))
    extra = 0
    if cap2:
        parts.append(text_el(cx, h + 33, cap2, cap_size, theme["subtext"]))
        extra = 17
    return "".join(parts), w, h + 22 + extra


def grid_figure(stem, keys, cols, mode, w=200, h=150):
    theme = THEMES[mode]
    rows = [keys[i:i + cols] for i in range(0, len(keys), cols)]
    M, GX, GY = 14, 10, 16
    cell_h = h + 44
    W = 2 * M + cols * w + (cols - 1) * GX
    H = 2 * M + len(rows) * cell_h + (len(rows) - 1) * GY
    parts = []
    for r, row in enumerate(rows):
        row_w = len(row) * w + (len(row) - 1) * GX
        x0 = (W - row_w) / 2
        y0 = M + r * (cell_h + GY)
        for c, key in enumerate(row):
            body, _, _ = cell(key, mode, w, h)
            parts.append(group(x0 + c * (w + GX), y0, body))
    return svg_doc(W, H, "".join(parts))


def reaction_figure(stem, lhs, rhs, mode, label="", sublabel="",
                    w=190, h=150, arrow_len=95):
    """lhs and rhs are lists of MOLS keys joined by + signs."""
    theme = THEMES[mode]
    M = 14
    cell_h = h + 44
    n = len(lhs) + len(rhs)
    plus_w = 26
    W = (2 * M + n * w + (len(lhs) - 1 + len(rhs) - 1) * plus_w + arrow_len + 20)
    H = 2 * M + cell_h
    parts = []
    x = M
    for i, key in enumerate(lhs):
        body, _, _ = cell(key, mode, w, h)
        parts.append(group(x, M, body))
        x += w
        if i < len(lhs) - 1:
            parts.append(plus(x + plus_w / 2, M + h / 2, theme["text"]))
            x += plus_w
    parts.append(arrow(x + 10, M + h / 2, arrow_len, theme["accent"],
                       label, sublabel, theme["subtext"]))
    x += arrow_len + 20
    for i, key in enumerate(rhs):
        body, _, _ = cell(key, mode, w, h)
        parts.append(group(x, M, body))
        x += w
        if i < len(rhs) - 1:
            parts.append(plus(x + plus_w / 2, M + h / 2, theme["text"]))
            x += plus_w
    return svg_doc(W, H, "".join(parts))


def two_path_figure(stem, subst, top_rhs, bot_rhs, mode,
                    top_label, bot_label, top_sub="", bot_sub="",
                    w=190, h=145, arrow_len=110):
    """One substrate branching to two product rows (major/minor style)."""
    theme = THEMES[mode]
    M = 14
    cell_h = h + 44
    W = 2 * M + w + arrow_len + 20 + w
    H = 2 * M + 2 * cell_h + 18
    parts = []
    mid_y = M + cell_h + 9  # vertical centre between the two rows
    parts.append(group(M, mid_y - cell_h / 2 - 9, cell(subst, mode, w, h)[0]))
    ax = M + w + 10
    # diagonal-ish arrows drawn as horizontal at each row's height
    parts.append(arrow(ax, M + h / 2, arrow_len, theme["accent"],
                       top_label, top_sub, theme["subtext"]))
    parts.append(arrow(ax, M + cell_h + 18 + h / 2, arrow_len, theme["accent"],
                       bot_label, bot_sub, theme["subtext"]))
    px = ax + arrow_len + 10
    parts.append(group(px, M, cell(top_rhs, mode, w, h)[0]))
    parts.append(group(px, M + cell_h + 18, cell(bot_rhs, mode, w, h)[0]))
    return svg_doc(W, H, "".join(parts))


FIGURES = {
    # ch2
    "org1-c5-isomers": lambda m: grid_figure(
        "org1-c5-isomers", ["pentane", "isopentane", "neopentane"], 3, m),
    "org1-hexane-isomers": lambda m: grid_figure(
        "org1-hexane-isomers", ["hexane", "2mp", "3mp", "22dmb", "23dmb"], 3, m),
    # ch3
    "org1-conjugate-bases": lambda m: grid_figure(
        "org1-conjugate-bases", ["ethoxide", "phenoxide", "acetate"], 3, m),
    "org1-nucleophile-gallery": lambda m: grid_figure(
        "org1-nucleophile-gallery",
        ["hydroxide", "water", "ammonia", "cyanide", "iodide", "methanethiolate"],
        3, m, w=180, h=120),
    # ch4
    "org1-cis-trans-butene": lambda m: grid_figure(
        "org1-cis-trans-butene", ["cis2butene", "trans2butene"], 2, m),
    "org1-ez-bromopropene": lambda m: grid_figure(
        "org1-ez-bromopropene", ["e1b1p", "z1b1p"], 2, m),
    "org1-substitution-ladder": lambda m: grid_figure(
        "org1-substitution-ladder",
        ["ethylene", "propene", "trans2butene", "2m2b", "23dm2b"], 3, m),
    "org1-markovnikov": lambda m: two_path_figure(
        "org1-markovnikov", "propene", "2brpropane", "1brpropane", m,
        "HBr", "HBr, ROOR", "ionic: 2 deg cation", "radical: 2 deg radical"),
    "org1-hydride-shift": lambda m: two_path_figure(
        "org1-hydride-shift", "3m1b", "2cl2mb", "2cl3mb", m,
        "HCl", "HCl", "after 1,2-H shift (major)", "no shift (minor)"),
    # ch5
    "org1-bromonium-product": lambda m: reaction_figure(
        "org1-bromonium-product", ["cyclopentene"], ["transdibr"], m,
        label="Br2", sublabel="via bromonium ion"),
    "org1-three-hydrations": lambda m: two_path_figure(
        "org1-three-hydrations", "propene", "2propanol", "1propanol", m,
        "H3O+  or  Hg(OAc)2 ; NaBH4", "1. BH3 ; 2. H2O2, NaOH",
        "Markovnikov", "anti-Markovnikov, syn"),
    "org1-epoxide-diols": lambda m: two_path_figure(
        "org1-epoxide-diols", "cyclohexene", "transdiol", "cisdiol", m,
        "1. mCPBA  2. H3O+", "OsO4, NMO",
        "anti diol via epoxide", "syn diol via osmate ester"),
    "org1-ozonolysis": lambda m: reaction_figure(
        "org1-ozonolysis", ["2m2b_oz"], ["acetone", "acetaldehyde"], m,
        label="1. O3  2. Me2S", sublabel="both sp2 carbons become C=O"),
    "org1-epoxidation-step": lambda m: reaction_figure(
        "org1-epoxidation-step", ["cyclohexene"], ["cyclohexeneoxide"], m,
        label="mCPBA", sublabel="concerted, syn, geometry preserved"),
    "org1-ozonolysis-ring": lambda m: reaction_figure(
        "org1-ozonolysis-ring", ["cyclohexene"], ["hexanedial"], m,
        label="1. O3  2. Me2S", sublabel="a ring opens but does not divide"),
    "org1-zaitsev-hofmann": lambda m: two_path_figure(
        "org1-zaitsev-hofmann", "2brbutane", "trans2butene_z", "1butene", m,
        "NaOEt", "KOtBu", "Zaitsev: more substituted", "Hofmann: less hindered"),
}


def main(only: str | None = None) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    made = 0
    for stem, fn in FIGURES.items():
        if only and only not in stem:
            continue
        for mode in ("light", "dark"):
            svg = fn(mode)
            (OUT / f"{stem}-{mode}.svg").write_text(svg)
        made += 1
        print(f"wrote {stem}-{{light,dark}}.svg")
    print(f"\n{made} figures x 2 themes")
    print("\nFormula checks (every molecule verified against its tabulated formula):")
    print("\n".join(CHECKS))


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else None)
