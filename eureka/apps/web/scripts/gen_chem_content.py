#!/usr/bin/env python3
"""Generate the XR chemistry labs' authored content from OCTET.

Three bodies of content already exist in OCTET and had no visual surface at
all. This script exports them, verified, into typed TypeScript:

  Johnstone triangle views   44 of them, and every one carries a `caption`
                             field its author wrote as a literal description
                             of a particulate scene. They were scene specs
                             waiting for a renderer.
  Simulation scenarios       Titration and equilibrium setups whose curves and
                             outcomes are DERIVED by chem_core rather than
                             authored, plus the predict-observe-explain items
                             bound to them.
  Spectroscopy               Proton environments derived from molecular
                             symmetry, degrees of unsaturation, and the
                             fragment masses an MS trace would show.

The discipline is the same one the molecule generator uses. Nothing chemical
is retyped here: curves come out of chem_core.simulate, environment counts out
of chem_core.organic, and every POE item's answer key is checked against the
simulation before it is allowed into the output.

Key verification defers to OCTET rather than duplicating it. simulations.py
registers an outcome rule per item and test_phase3 already asserts the whole
registry upstream; this script runs the same pair and REFUSES to export an item
that has no rule or whose key disagrees. The point is a gate at the boundary,
not a second implementation to keep in step with the first.

Run from the octet directory:

    docker compose exec -T api python - < \
      ../eureka/apps/web/scripts/gen_chem_content.py > out.ts
"""

from __future__ import annotations

import sys

sys.path.insert(0, "/app")

from app.data import simulations as sims  # noqa: E402
from app.data import triangle_views as tri_gen  # noqa: E402
from app.data import triangle_views_org1 as tri_o1  # noqa: E402
from app.data import triangle_views_org2 as tri_o2  # noqa: E402
from chem_core.organic import (  # noqa: E402
    degrees_of_unsaturation,
    proton_environments,
)
from chem_core.prediction import verify_prediction_key  # noqa: E402
from chem_core.simulate import (  # noqa: E402
    equilibrium_shift,
    titration_curve,
    titration_landmarks,
)

# ---------------------------------------------------------------------------
# Serialisation
# ---------------------------------------------------------------------------


def ts(v, indent: int = 0) -> str:
    pad = "  " * indent
    if v is None:
        return "null"
    if isinstance(v, str):
        return "'" + v.replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ") + "'"
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return repr(round(v, 6) if isinstance(v, float) else v)
    if isinstance(v, (list, tuple)):
        if v and all(isinstance(x, (int, float)) and not isinstance(x, bool) for x in v):
            return "[" + ", ".join(repr(round(x, 4) if isinstance(x, float) else x) for x in v) + "]"
        inner = ",\n".join(f"{pad}  {ts(x, indent + 1)}" for x in v)
        return "[\n" + inner + f"\n{pad}]" if v else "[]"
    if isinstance(v, dict):
        inner = ",\n".join(f"{pad}  {k}: {ts(val, indent + 1)}" for k, val in v.items())
        return "{\n" + inner + f"\n{pad}}}" if v else "{}"
    raise TypeError(f"cannot serialise {type(v)}")


# ---------------------------------------------------------------------------
# Johnstone triangle views
# ---------------------------------------------------------------------------


def collect_triangles() -> list[dict]:
    """Every triangle view, once.

    triangle_views.TRIANGLE_VIEWS is the merged registry: it already contains
    the general-chemistry views plus everything the two organic modules
    define, 44 in total. Reading the three modules and concatenating produced
    70 rows for those 44 views, because the organic views were counted twice.

    So there is one source here, and the per-course modules are used only to
    assert that the merged registry really does cover them. If a view is ever
    added to an organic file and not picked up by the registry, this fails
    instead of quietly shipping an incomplete set.
    """
    registry = tri_gen.TRIANGLE_VIEWS
    for module, attr in ((tri_o1, "TRIANGLE_VIEWS_ORG1"), (tri_o2, "TRIANGLE_VIEWS_ORG2")):
        part = getattr(module, attr)
        missing = set(part) - set(registry)
        if missing:
            raise SystemExit(
                f"{attr} defines views the merged registry does not carry: "
                f"{sorted(missing)}"
            )

    out: list[dict] = []
    for v in registry.values():
        out.append(
            {
                "node": v.node,
                "course": v.node.split(".")[0],
                "title": v.title,
                "macroscopic": v.macroscopic,
                "particulate": v.particulate,
                "symbolic": v.symbolic,
                "connector": v.connector,
                "pitfall": v.pitfall,
                "katex": getattr(v, "katex", "") or "",
                "caption": getattr(v, "caption", "") or "",
            }
        )
    # Review status is carried through rather than dropped: nothing may be
    # presented as expert-verified until a named reviewer signs off.
    return out


def triangle_review_status() -> str:
    return str(getattr(tri_gen, "REVIEW", "pending"))


# ---------------------------------------------------------------------------
# Simulations and POE items
# ---------------------------------------------------------------------------


def run_scenario(scenario) -> dict:
    """Shape one scenario's derived result for the labs.

    OCTET's run_scenario returns the full payload; this trims it to what the
    3D bench actually plots and rounds for a readable diff.
    """
    if scenario.kind == "titration":
        setup = sims.TITRATIONS[scenario.engine_key]
        curve = titration_curve(setup, points=161)
        marks = titration_landmarks(setup)
        return {
            "kind": "titration",
            "curve": [
                {"v": round(p["volume_mL"], 3), "ph": round(p["pH"], 4)} for p in curve
            ],
            "landmarks": {k: (round(x, 4) if isinstance(x, float) else x)
                          for k, x in marks.items()},
        }
    if scenario.kind == "equilibrium":
        setup = sims.EQUILIBRIA[scenario.engine_key]
        result = equilibrium_shift(setup, scenario.stress)
        clean = {}
        for k, v in result.items():
            if isinstance(v, dict):
                clean[k] = {kk: round(vv, 6) for kk, vv in v.items()}
            elif isinstance(v, float):
                clean[k] = round(v, 6)
            else:
                clean[k] = v
        return {"kind": "equilibrium", "result": clean}
    if scenario.kind in ("kinetics", "gas", "gas-comparison"):
        # These engines already return a flat, plottable result. Round the
        # floats so a regenerated file diffs cleanly, and drop the descriptive
        # keys the exporter carries separately.
        full = sims.run_scenario(scenario.id)
        skip = {"scenario", "title", "description", "kind"}
        clean = {
            k: (round(v, 6) if isinstance(v, float) else v)
            for k, v in full.items()
            if k not in skip
        }
        return {"kind": scenario.kind, "result": clean}
    raise SystemExit(f"{scenario.id}: unknown scenario kind {scenario.kind}")


def collect_scenarios() -> tuple[list[dict], dict[str, dict]]:
    out = []
    derived: dict[str, dict] = {}
    for s in sims.SCENARIOS.values():
        run = run_scenario(s)
        derived[s.id] = run
        out.append(
            {
                "id": s.id,
                "kind": s.kind,
                "engineKey": s.engine_key,
                "title": s.title,
                "description": s.description,
                "stress": {k: float(v) for k, v in s.stress.items()},
                "node": s.node,
                "derived": run,
            }
        )
    return out, derived


def opt(o) -> dict:
    return {
        "id": o.id,
        "text": o.text,
        "misconception": o.misconception,
        "feedback": o.feedback or "",
    }


# Key verification uses OCTET's own mechanism rather than a second one here.
#
# simulations.py registers an outcome rule per item via its @_rule decorator,
# and run_scenario executes the item's scenario. That pair is what
# test_phase3 already asserts over the whole registry upstream. Re-deriving the
# outcome independently in this exporter would be a second implementation to
# keep in step with the first, and the failure mode of two implementations that
# disagree is worse than the failure mode of one.
#
# What this exporter adds is refusal: an item that cannot be checked, or whose
# key disagrees, fails the export instead of shipping into the labs.
def collect_poe(derived: dict[str, dict]) -> list[dict]:
    out = []
    for item in sims.POE_ITEMS.values():
        scenario = sims.SCENARIOS[item.scenario]
        run = derived[item.scenario]

        rule = sims.OUTCOME_RULES.get(item.id)
        if rule is None:
            raise SystemExit(
                f"{item.id}: no outcome rule is registered upstream, so this key "
                f"cannot be checked against the physics. Register one with @_rule "
                f"in simulations.py rather than shipping it unverified."
            )
        outcome = rule(sims.run_scenario(item.scenario))
        result = verify_prediction_key(item, {"outcome": outcome})
        verified = bool(result.ok)
        verdict = result.detail
        if not verified:
            raise SystemExit(
                f"{item.id}: prediction key {item.predict_key!r} disagrees with its "
                f"own simulation: {verdict}"
            )

        # The key must also be one of the item's own options, which is the
        # other way an item can be quietly broken.
        option_ids = {o.id for o in item.predict_options}
        if item.predict_key not in option_ids:
            raise SystemExit(
                f"{item.id}: predict_key {item.predict_key!r} is not one of its options"
            )
        explain_ids = {o.id for o in item.explain_options}
        if item.explain_key not in explain_ids:
            raise SystemExit(
                f"{item.id}: explain_key {item.explain_key!r} is not one of its options"
            )

        out.append(
            {
                "id": item.id,
                "node": item.node,
                "scenario": item.scenario,
                "scenarioTitle": scenario.title,
                "predictPrompt": item.predict_prompt,
                "predictOptions": [opt(o) for o in item.predict_options],
                "predictKey": item.predict_key,
                "observePrompt": item.observe_prompt,
                "explainPrompt": item.explain_prompt,
                "explainOptions": [opt(o) for o in item.explain_options],
                "explainKey": item.explain_key,
                "reflectionPrompt": item.reflection_prompt or "",
                "keyVerified": verified,
                "keyVerdict": verdict,
            }
        )
    return out


# ---------------------------------------------------------------------------
# Spectroscopy
# ---------------------------------------------------------------------------

# Molecules the spectroscopy mode works over. Kept to the ones ORG1-U10 would
# reasonably set, and every one is already in the labs' molecule library so the
# 3D model and the spectrum are the same compound.
SPECTRA_SUBJECTS = [
    ("methane", "Methane", "C"),
    ("ethane", "Ethane", "CC"),
    ("ethene", "Ethene", "C=C"),
    ("ethyne", "Ethyne", "C#C"),
    ("benzene", "Benzene", "c1ccccc1"),
    ("ethanol", "Ethanol", "CCO"),
    ("acetone", "Acetone", "CC(C)=O"),
    ("acetic_acid", "Acetic acid", "CC(=O)O"),
    ("propene", "Propene", "CC=C"),
    ("chloromethane", "Chloromethane", "CCl"),
]

# IR absorptions, cited rather than computed. chem_core has no vibrational
# model, so inventing wavenumbers would be exactly the kind of fabrication the
# rest of this pipeline exists to prevent. Ranges are the standard correlation
# values from Silverman, Spectrometric Identification of Organic Compounds,
# 8th edition, correlation tables.
IR_BANDS = [
    {"group": "O-H (alcohol)", "low": 3200, "high": 3600, "shape": "broad, strong",
     "smartsHint": "hydroxyl"},
    {"group": "O-H (carboxylic acid)", "low": 2500, "high": 3300, "shape": "very broad",
     "smartsHint": "carboxyl"},
    {"group": "C-H (sp3)", "low": 2850, "high": 2960, "shape": "sharp, medium",
     "smartsHint": "sp3 C-H"},
    {"group": "C-H (sp2)", "low": 3020, "high": 3100, "shape": "sharp, medium",
     "smartsHint": "sp2 C-H"},
    {"group": "C-H (sp, terminal alkyne)", "low": 3260, "high": 3330, "shape": "sharp, strong",
     "smartsHint": "sp C-H"},
    {"group": "C=O", "low": 1670, "high": 1780, "shape": "sharp, very strong",
     "smartsHint": "carbonyl"},
    {"group": "C=C", "low": 1620, "high": 1680, "shape": "sharp, weak to medium",
     "smartsHint": "alkene"},
    {"group": "C#C", "low": 2100, "high": 2260, "shape": "sharp, weak",
     "smartsHint": "alkyne"},
    {"group": "aromatic C=C", "low": 1450, "high": 1600, "shape": "several sharp bands",
     "smartsHint": "aromatic"},
]


def which_bands(smiles: str) -> list[str]:
    """Which cited IR bands this molecule should show, decided structurally."""
    from rdkit import Chem

    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return []
    mol = Chem.AddHs(mol)
    found: list[str] = []

    def has(smarts: str) -> bool:
        patt = Chem.MolFromSmarts(smarts)
        return patt is not None and mol.HasSubstructMatch(patt)

    if has("[CX3](=O)[OX2H1]"):
        found.append("O-H (carboxylic acid)")
        found.append("C=O")
    else:
        if has("[OX2H][CX4]"):
            found.append("O-H (alcohol)")
        if has("[CX3]=[OX1]"):
            found.append("C=O")
    if has("[CX4;!$(C=*)][H]") or has("[CX4H]"):
        found.append("C-H (sp3)")
    if has("[CX3H]=[CX3]") or has("[cH]"):
        found.append("C-H (sp2)")
    if has("[CX2H]#[CX2]"):
        found.append("C-H (sp, terminal alkyne)")
    if has("[CX3]=[CX3]") and not has("c"):
        found.append("C=C")
    if has("[CX2]#[CX2]"):
        found.append("C#C")
    if has("c1ccccc1"):
        found.append("aromatic C=C")
    # Preserve the table order and drop duplicates.
    order = [b["group"] for b in IR_BANDS]
    return [g for g in order if g in found]


def ms_fragments(smiles: str) -> list[dict]:
    """Molecular ion plus the losses a first course actually asks about.

    Only losses whose fragment is genuinely present in the structure are
    listed, checked by substructure rather than assumed from the formula.
    """
    from rdkit import Chem
    from rdkit.Chem import Descriptors

    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return []
    mw = Descriptors.MolWt(Chem.AddHs(mol))
    frags = [{"mz": round(mw, 1), "label": "M+ (molecular ion)",
              "note": "The intact molecule minus one electron. Its mass is the molar mass."}]

    def has(smarts: str) -> bool:
        p = Chem.MolFromSmarts(smarts)
        return p is not None and mol.HasSubstructMatch(p)

    candidates = [
        ("[CH3]", 15.03, "loss of CH3", "A methyl radical breaks off."),
        ("[OX2H]", 17.01, "loss of OH", "The hydroxyl leaves as a radical."),
        ("[OX2H][CX4]", 18.01, "loss of H2O", "Alcohols very commonly lose water."),
        ("[CX3]=[OX1]", 28.01, "loss of CO", "A carbonyl can lose carbon monoxide."),
        ("[CX3](=O)[CH3]", 43.04, "loss of CH3CO (acetyl)",
         "Alpha cleavage next to the carbonyl gives the acylium ion."),
    ]
    for smarts, dm, label, note in candidates:
        if has(smarts) and mw - dm > 12:
            frags.append({"mz": round(mw - dm, 1), "label": label, "note": note})
    return frags


def collect_spectra() -> list[dict]:
    out = []
    for key, name, smiles in SPECTRA_SUBJECTS:
        envs = proton_environments(smiles)
        if envs is None:
            raise SystemExit(f"{key}: chem_core could not derive proton environments")
        dou = degrees_of_unsaturation_for(smiles)
        out.append(
            {
                "key": key,
                "name": name,
                "smiles": smiles,
                # Ratio of protons in each distinct environment. The LENGTH is
                # the number of 1H signals, and that is derived from molecular
                # symmetry rather than counted by hand.
                "environments": envs,
                "signalCount": len(envs),
                "degreesUnsaturation": dou,
                "irBands": which_bands(smiles),
                "msFragments": ms_fragments(smiles),
            }
        )
    return out


def degrees_of_unsaturation_for(smiles: str) -> float | None:
    from rdkit import Chem
    from rdkit.Chem import rdMolDescriptors

    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return None
    formula = rdMolDescriptors.CalcMolFormula(Chem.AddHs(mol))
    return degrees_of_unsaturation(formula)


# ---------------------------------------------------------------------------


def main() -> None:
    triangles = collect_triangles()
    scenarios, derived = collect_scenarios()
    poe = collect_poe(derived)
    spectra = collect_spectra()

    print(
        "\n".join(
            [
                "// GENERATED FILE - do not edit by hand.",
                "//",
                "// Produced by scripts/gen_chem_content.py from OCTET's authored",
                "// content. Triangle views, simulation scenarios and POE items are",
                "// exported as written; every derived quantity (titration curves,",
                "// equilibrium outcomes, proton environments, degrees of",
                "// unsaturation, molecular ion masses) is computed by chem_core or",
                "// RDKit at export time rather than retyped.",
                "//",
                "// Every POE item's answer key was checked against its own",
                "// simulation before export. An item whose key disagreed with the",
                "// physics would have failed the build rather than shipped.",
                "//",
                "// IR band positions are CITED, not computed: chem_core has no",
                "// vibrational model, and inventing wavenumbers is exactly what the",
                "// rest of this pipeline exists to prevent. Source is named in the",
                "// script.",
                "",
                "import type { PoeItem, Scenario, SpectrumSubject, TriangleView }"
                " from './contentTypes';",
                "",
                f"export const TRIANGLE_REVIEW_STATUS = {ts(triangle_review_status())};",
                "",
                f"export const TRIANGLE_VIEWS: TriangleView[] = {ts(triangles)};",
                "",
                f"export const SCENARIOS: Scenario[] = {ts(scenarios)};",
                "",
                f"export const POE_ITEMS: PoeItem[] = {ts(poe)};",
                "",
                f"export const SPECTRA: SpectrumSubject[] = {ts(spectra)};",
                "",
                f"export const IR_BANDS = {ts(IR_BANDS)} as const;",
                "",
            ]
        )
    )
    print(
        f"// counts: {len(triangles)} triangle views, {len(scenarios)} scenarios, "
        f"{len(poe)} POE items, {len(spectra)} spectra subjects",
    )


if __name__ == "__main__":
    main()
