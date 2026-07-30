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

That last check matters more than it looks. OCTET's own prediction module says
a prediction key is never taken on the author's word, and exports the verifier
to prove it. An item whose key disagrees with its own physics does not ship,
and this script enforces that at the boundary rather than trusting that it was
enforced upstream.

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
    """Run a scenario through chem_core and return what it derived."""
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


# Mechanical checks, one per POE item, evaluated against what the simulation
# actually produced.
#
# These exist because OCTET's simulations.py documents an `outcome_rule` on
# each item that "turns that derived result into the option id ... so the item
# key can be checked against the physics rather than against the author's
# intention". No such field exists on Scenario or PoeItem, and nothing calls
# chem_core's verify_prediction_key on these items. The mechanism is described
# and absent, so the keys have never actually been checked. Running the
# exported verifier as-is would fail the catalyst item outright, because the
# engine reports direction 'none' while the item keys 'unchanged'.
#
# Rather than skip the check or quietly paper over the mismatch, each item gets
# an explicit predicate here that reads the derived result and decides whether
# the authored key is what the physics produced. The predicates are visible,
# and the build fails when one does not hold.
def _check_titr_equivalence(run: dict, key: str) -> tuple[bool, str]:
    ph = run["landmarks"]["equivalence_pH"]
    got = "above7" if ph > 7.0 else "equals7" if abs(ph - 7.0) < 1e-6 else "below7"
    return got == key, f"simulated equivalence pH is {ph:.3f}, which is {got}"


def _check_titr_buffer(run: dict, key: str) -> tuple[bool, str]:
    # The buffer region is the plateau either side of half equivalence. Take
    # the pH swing across the middle half of the pre-equivalence volume.
    veq = run["landmarks"]["equivalence_volume_mL"]
    band = [p for p in run["curve"] if 0.25 * veq <= p["v"] <= 0.75 * veq]
    swing = max(p["ph"] for p in band) - min(p["ph"] for p in band)
    got = "small" if swing < 1.5 else "large"
    return got == key, (
        f"pH moves {swing:.2f} units across the middle half of the buffer region, "
        f"which is {got}"
    )


def _check_eq_direction(run: dict, key: str) -> tuple[bool, str]:
    direction = run["result"]["direction"]
    # 'none' and 'unchanged' are the same claim about the physics: the position
    # of equilibrium did not move. The alias is declared rather than assumed.
    alias = {"none": "unchanged", "forward": "forward", "reverse": "reverse"}
    got = alias.get(direction, direction)
    return got == key, f"engine reports direction {direction}, read as {got}"


POE_CHECKS = {
    "poe.titr.weak-equivalence": _check_titr_equivalence,
    "poe.titr.buffer-region": _check_titr_buffer,
    "poe.lechat.add-h2": _check_eq_direction,
    "poe.lechat.catalyst": _check_eq_direction,
}


def collect_poe(derived: dict[str, dict]) -> list[dict]:
    out = []
    for item in sims.POE_ITEMS.values():
        scenario = sims.SCENARIOS[item.scenario]
        run = derived[item.scenario]

        check = POE_CHECKS.get(item.id)
        if check is None:
            raise SystemExit(
                f"{item.id}: no mechanical check is declared for this item. Add one to "
                f"POE_CHECKS rather than shipping an unverified answer key."
            )
        verified, verdict = check(run, item.predict_key)
        if not verified:
            raise SystemExit(
                f"{item.id}: prediction key {item.predict_key!r} disagrees with its own "
                f"simulation: {verdict}"
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
