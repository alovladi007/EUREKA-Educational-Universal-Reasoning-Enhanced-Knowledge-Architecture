"""Phase 3 endpoints: the visualization surface.

Periodic table, molecule library, Johnstone triangle views, and the predict,
observe, explain simulations.

The rule this router exists to enforce is that a simulation result is never
handed out before a prediction has been recorded. That is why /predict returns
the simulation and /start does not. A client that wants the picture has to
commit first, and the ticket it carries is the proof that it did.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

import chem_core as cc
from app.core.security import Principal, get_current_principal
from app.domains.chemistry import poe
from app.domains.grading.sandbox import grade_sandboxed

router = APIRouter()

NUMERIC_TREND_FIELDS = (
    "electronegativity",
    "atomic_radius_pm",
    "ionization_energy_kJmol",
    "electron_affinity_kJmol",
    "atomic_mass",
)


# ---------------------------------------------------------------------------
# Periodic table
# ---------------------------------------------------------------------------


@router.get("/periodic-table")
async def periodic_table(_p: Principal = Depends(get_current_principal)) -> dict:
    """Every element, plus what each trend layer actually covers.

    coverage is returned alongside the data on purpose. A trend map drawn from
    a property that is only measured for two thirds of the table looks
    complete unless the gaps are stated, and the client renders those gaps
    rather than interpolating across them.
    """
    from app.data import periodic

    return {
        "elements": [
            {
                "symbol": e.symbol,
                "name": e.name,
                "number": e.number,
                "period": e.period,
                "group": e.group,
                "block": e.block,
                "category": e.category,
                "atomic_mass": e.atomic_mass,
                "electron_configuration": e.electron_configuration,
                "electronegativity": e.electronegativity,
                "atomic_radius_pm": e.atomic_radius_pm,
                "ionization_energy_kJmol": e.ionization_energy_kJmol,
                "electron_affinity_kJmol": e.electron_affinity_kJmol,
                "state_at_stp": e.state_at_stp,
                "note": e.note,
            }
            for e in periodic.ELEMENTS
        ],
        "trend_fields": list(NUMERIC_TREND_FIELDS),
        "coverage": {f: periodic.coverage(f) for f in NUMERIC_TREND_FIELDS},
        "ranges": {f: periodic.trend_range(f) for f in NUMERIC_TREND_FIELDS},
        "review": periodic.REVIEW,
    }


@router.get("/periodic-table/trends/{field}")
async def periodic_trend(
    field: str, _p: Principal = Depends(get_current_principal)
) -> dict:
    """One trend layer: atomic number to value, plus the legend range."""
    from app.data import periodic

    if field not in NUMERIC_TREND_FIELDS:
        raise HTTPException(
            404,
            f"{field} is not a trend layer. Available: {', '.join(NUMERIC_TREND_FIELDS)}",
        )
    return {
        "field": field,
        "values": periodic.trend_values(field),
        "range": periodic.trend_range(field),
        "coverage": periodic.coverage(field),
        "review": periodic.REVIEW,
    }


# ---------------------------------------------------------------------------
# Molecule library
# ---------------------------------------------------------------------------


@router.get("/molecules")
async def molecules(
    search: str = Query("", max_length=80),
    category: str = Query(""),
    limit: int = Query(60, ge=1, le=200),
    _p: Principal = Depends(get_current_principal),
) -> dict:
    """The curated library, already filtered by the Section 18 safety policy."""
    from app.data.molecule_build import build_library
    from app.data.molecules import molecule_pool

    safe = {m.name: m for m in molecule_pool()}
    built, _problems = build_library()
    rows = []
    needle = search.strip().lower()
    for b in built:
        entry = safe.get(b.name)
        if entry is None:
            continue
        if category and entry.category != category:
            continue
        if needle and needle not in b.name.lower() and needle not in b.formula.lower():
            continue
        rows.append(
            {
                "name": b.name,
                "smiles": b.smiles_canonical,
                "formula": b.formula,
                "molar_mass": b.molar_mass,
                "inchikey": b.inchikey,
                "category": entry.category,
                "real_world_note": b.real_world_note,
                "hazard_notes": list(entry.hazard_notes),
            }
        )
    return {
        "molecules": rows[:limit],
        "total_matching": len(rows),
        "categories": sorted({m.category for m in safe.values()}),
        "library_size": len(safe),
    }


@router.get("/molecules/{name}")
async def molecule(name: str, _p: Principal = Depends(get_current_principal)) -> dict:
    """One molecule, with the 3D availability stated rather than assumed.

    The library stores SMILES, which carries connectivity but no coordinates.
    has_3d is false until an embedding step runs, and the viewer says so
    instead of drawing a flat structure and calling it three dimensional.
    """
    from app.data.molecule_build import build_library
    from app.data.molecules import molecule_pool

    safe = {m.name: m for m in molecule_pool()}
    entry = safe.get(name)
    if entry is None:
        raise HTTPException(404, f"no molecule named {name} in the library")
    built, _problems = build_library()
    record = next((b for b in built if b.name == name), None)
    if record is None:
        raise HTTPException(404, f"{name} is in the library but could not be built")
    return {
        "name": record.name,
        "smiles": record.smiles_canonical,
        "formula": record.formula,
        "molar_mass": record.molar_mass,
        "inchikey": record.inchikey,
        "category": entry.category,
        "real_world_note": record.real_world_note,
        "hazard_notes": list(entry.hazard_notes),
        "has_3d": False,
        "coordinates_note": (
            "The library stores connectivity, not coordinates. The viewer "
            "generates a layout from the structure, so bond lengths and angles "
            "shown are illustrative rather than measured."
        ),
        "review": entry.review,
    }


# ---------------------------------------------------------------------------
# Johnstone triangle
# ---------------------------------------------------------------------------


@router.get("/triangle")
async def triangle_index(_p: Principal = Depends(get_current_principal)) -> dict:
    from app.data import triangle_views

    return {
        "nodes": triangle_views.covered_nodes(),
        "count": len(triangle_views.TRIANGLE_VIEWS),
        "review": triangle_views.REVIEW,
    }


@router.get("/triangle/{node_code}")
async def triangle(
    node_code: str, _p: Principal = Depends(get_current_principal)
) -> dict:
    """The three levels of one concept, side by side."""
    from app.data import triangle_views

    view = triangle_views.for_node(node_code)
    if view is None:
        raise HTTPException(404, f"no triangle view for {node_code}")
    return {
        "node": view.node,
        "title": view.title,
        "macroscopic": view.macroscopic,
        "particulate": view.particulate,
        "symbolic": view.symbolic,
        "katex": view.katex,
        "caption": view.caption,
        "connector": view.connector,
        "pitfall": view.pitfall,
        "review": triangle_views.REVIEW,
    }


# ---------------------------------------------------------------------------
# Simulations and predict, observe, explain
# ---------------------------------------------------------------------------


class PoeStartOut(BaseModel):
    ticket: str
    item_id: str
    node: str
    scenario: str
    phase: str
    prompt: str
    options: list[dict]
    scenario_title: str
    scenario_description: str


class PredictIn(BaseModel):
    ticket: str
    choice: str = Field(max_length=64)


class ObserveIn(BaseModel):
    ticket: str
    observation: str = Field(max_length=2000)


class ExplainIn(BaseModel):
    ticket: str
    choice: str = Field(max_length=64)
    reflection: str = Field(default="", max_length=4000)


@router.get("/simulations")
async def list_simulations(_p: Principal = Depends(get_current_principal)) -> dict:
    from app.data.simulations import POE_ITEMS, SCENARIOS

    return {
        "scenarios": [
            {
                "id": s.id,
                "kind": s.kind,
                "title": s.title,
                "description": s.description,
                "node": s.node,
            }
            for s in SCENARIOS.values()
        ],
        "activities": [
            {
                "id": i.id,
                "node": i.node,
                "scenario": i.scenario,
                "prompt": i.predict_prompt,
            }
            for i in POE_ITEMS.values()
        ],
    }


@router.post("/simulations/poe/start", response_model=PoeStartOut)
async def poe_start(
    item_id: str = Query(...), principal: Principal = Depends(get_current_principal)
) -> PoeStartOut:
    """Open a predict, observe, explain activity.

    Returns the prediction prompt and the options, and deliberately returns no
    simulation data at all. The learner has nothing to look at yet, which is
    the point.
    """
    from app.data.simulations import POE_ITEMS, SCENARIOS

    item = POE_ITEMS.get(item_id)
    if item is None:
        raise HTTPException(404, f"unknown activity {item_id}")
    scenario = SCENARIOS[item.scenario]
    state = poe.start(principal.user_id, item.id)
    return PoeStartOut(
        ticket=poe.issue(state),
        item_id=item.id,
        node=item.node,
        scenario=item.scenario,
        phase="predict",
        prompt=item.predict_prompt,
        options=[{"id": o.id, "text": o.text} for o in item.predict_options],
        scenario_title=scenario.title,
        scenario_description=scenario.description,
    )


@router.post("/simulations/poe/predict")
async def poe_predict(
    payload: PredictIn, principal: Principal = Depends(get_current_principal)
) -> dict:
    """Record the prediction, grade it, then release the simulation.

    The ordering inside this handler is the whole design. The prediction is
    graded first and written into the ticket, and only after that does the
    simulation run and its result get returned. There is no path through this
    function that reaches the simulation without having committed a prediction.
    """
    from app.data.simulations import OUTCOME_RULES, POE_ITEMS, run_scenario

    try:
        state = poe.read(payload.ticket, user_id=principal.user_id)
        poe.require_phase(state, "predict")
    except poe.TicketError as exc:
        raise HTTPException(409, str(exc)) from exc

    item = POE_ITEMS.get(state["item"])
    if item is None:
        raise HTTPException(404, f"unknown activity {state['item']}")

    graded = await grade_sandboxed(
        "prediction",
        {
            "key": item.predict_key,
            "meta": {
                "item_id": item.id,
                "node": item.node,
                "scenario": item.scenario,
                "options": [
                    {
                        "id": o.id,
                        "text": o.text,
                        "misconception": o.misconception,
                        "feedback": o.feedback,
                    }
                    for o in item.predict_options
                ],
            },
        },
        payload.choice,
    )
    if not graded["graded"]:
        raise HTTPException(422, graded["detail"])

    result = run_scenario(item.scenario)
    outcome = OUTCOME_RULES[item.id](result)
    verified = cc.verify_prediction_key(item, {"outcome": outcome})
    if not verified.ok:
        # An item whose key disagrees with its own simulation is an authoring
        # fault. Refuse rather than teach the learner something untrue.
        raise HTTPException(503, f"activity {item.id} failed verification: {verified.detail}")

    state["phase"] = "observe"
    state["prediction"] = payload.choice
    state["correct"] = bool(graded["is_correct"])
    return {
        "ticket": poe.issue(state),
        "phase": "observe",
        "prediction": payload.choice,
        "is_correct": graded["is_correct"],
        "score": graded["score"],
        "detail": graded["detail"],
        "misconception": graded["misconception"],
        "verified_by": verified.method,
        "observe_prompt": item.observe_prompt,
        "simulation": result,
    }


@router.post("/simulations/poe/observe")
async def poe_observe(
    payload: ObserveIn, principal: Principal = Depends(get_current_principal)
) -> dict:
    """Record what the learner saw. Not scored, and deliberately so.

    Writing down an observation is not a test of anything, so this returns no
    score and no correctness. It gates the explain step because explaining
    something you have not looked at is guessing.
    """
    from app.data.simulations import POE_ITEMS

    try:
        state = poe.read(payload.ticket, user_id=principal.user_id)
        poe.require_phase(state, "observe")
    except poe.TicketError as exc:
        raise HTTPException(409, str(exc)) from exc

    if not payload.observation.strip():
        raise HTTPException(422, "Record what you saw before moving on.")

    item = POE_ITEMS.get(state["item"])
    if item is None:
        raise HTTPException(404, f"unknown activity {state['item']}")

    state["phase"] = "explain"
    state["observed"] = True
    return {
        "ticket": poe.issue(state),
        "phase": "explain",
        "graded": False,
        "note": "An observation is recorded, not scored.",
        "prompt": item.explain_prompt,
        "options": [{"id": o.id, "text": o.text} for o in item.explain_options],
        "reflection_prompt": item.reflection_prompt,
    }


@router.post("/simulations/poe/explain")
async def poe_explain(
    payload: ExplainIn, principal: Principal = Depends(get_current_principal)
) -> dict:
    """Grade the mechanism selected, and store the free text unscored."""
    from app.data.simulations import POE_ITEMS

    try:
        state = poe.read(payload.ticket, user_id=principal.user_id)
        poe.require_phase(state, "explain")
    except poe.TicketError as exc:
        raise HTTPException(409, str(exc)) from exc

    item = POE_ITEMS.get(state["item"])
    if item is None:
        raise HTTPException(404, f"unknown activity {state['item']}")

    graded = await grade_sandboxed(
        "prediction",
        {
            "key": item.explain_key,
            "meta": {
                "item_id": item.id,
                "node": item.node,
                "scenario": item.scenario,
                "options": [
                    {
                        "id": o.id,
                        "text": o.text,
                        "misconception": o.misconception,
                        "feedback": o.feedback,
                    }
                    for o in item.explain_options
                ],
            },
        },
        payload.choice,
    )
    if not graded["graded"]:
        raise HTTPException(422, graded["detail"])

    state["phase"] = "done"
    return {
        "ticket": poe.issue(state),
        "phase": "done",
        "is_correct": graded["is_correct"],
        "score": graded["score"],
        "detail": graded["detail"],
        "misconception": graded["misconception"],
        "prediction_was_correct": bool(state.get("correct")),
        "reflection": {
            "recorded": bool(payload.reflection.strip()),
            "graded": False,
            "note": (
                "Written reflection is recorded for you to look back on. It is "
                "not scored, because this platform has no reviewed rubric for "
                "grading free text chemistry explanation."
            ),
        },
    }


# ---------------------------------------------------------------------------
# Structure grading, the Sketcher's endpoint
# ---------------------------------------------------------------------------


class StructureIn(BaseModel):
    template_id: str
    seed: int
    smiles: str = Field(max_length=1000)


@router.post("/structure/submit")
async def structure_submit(
    payload: StructureIn, _p: Principal = Depends(get_current_principal)
) -> dict:
    """Grade a drawn structure against the issued variant's stored key."""
    if payload.template_id not in cc.REGISTRY:
        raise HTTPException(404, f"unknown template {payload.template_id}")
    entry = cc.REGISTRY[payload.template_id]
    if entry.get("grader") != "structure":
        raise HTTPException(400, f"{payload.template_id} is not a structure item")
    try:
        variant = cc.resolve_generated(payload.template_id, payload.seed)
    except RuntimeError as exc:
        raise HTTPException(503, str(exc)) from exc

    result = await grade_sandboxed(
        "structure", {"key": variant.key, "meta": variant.meta}, payload.smiles
    )
    return {
        "is_correct": result["is_correct"],
        "score": result["score"],
        "graded": result["graded"],
        "grader": result["grader"],
        "detail": result["detail"],
        "misconception": result["misconception"],
    }
