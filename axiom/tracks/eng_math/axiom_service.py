"""AXIOM grading service.

FastAPI wrapper over math_core (axiom_grading), the step-credit engine
(axiom_steps), and the advanced graders (axiom_advanced). This is the grading
service from the build prompt in embryo: one process, versioned routes, typed
request and response models, and a health check.

Production notes (deferred deliberately, listed so they are not forgotten):
run each grade call in a sandboxed worker with a hard timeout (SymPy simplify
can be made slow by adversarial input), add auth at the gateway, and emit a
GradingRecord event per call for the analytics and mastery pipelines.

Run:  uvicorn axiom_service:app --port 8000
"""

from __future__ import annotations

from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel, Field

import axiom_advanced as adv
import axiom_grading as core
from axiom_steps import Milestone, grade_steps

app = FastAPI(title="AXIOM Grading Service", version="0.1.0")


# ---------------------------------------------------------------------------
# Shared response model
# ---------------------------------------------------------------------------

class GradeResponse(BaseModel):
    correct: bool
    detail: str
    grader: str
    confidence: float = 1.0


def _to_response(r) -> GradeResponse:
    return GradeResponse(
        correct=r.correct, detail=r.detail, grader=r.grader, confidence=r.confidence
    )


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "axiom-grading", "version": "0.1.0"}


# ---------------------------------------------------------------------------
# Linear algebra graders (math_core)
# ---------------------------------------------------------------------------

class PointGradeRequest(BaseModel):
    response: dict[str, str]
    key: dict[str, str]


@app.post("/v1/grade/point", response_model=GradeResponse)
def grade_point(req: PointGradeRequest) -> GradeResponse:
    return _to_response(core.grade_solution_point(req.response, req.key))


class RrefGradeRequest(BaseModel):
    response_matrix: list[list[float]]
    problem_matrix: list[list[float]]


@app.post("/v1/grade/rref", response_model=GradeResponse)
def grade_rref(req: RrefGradeRequest) -> GradeResponse:
    return _to_response(core.grade_rref(req.response_matrix, req.problem_matrix))


class SolutionSetGradeRequest(BaseModel):
    A: list[list[float]]
    b: list[float]
    particular: list[float]
    directions: list[list[float]] = Field(default_factory=list)


@app.post("/v1/grade/solution-set", response_model=GradeResponse)
def grade_solution_set(req: SolutionSetGradeRequest) -> GradeResponse:
    return _to_response(
        core.grade_solution_set(req.A, req.b, req.particular, req.directions)
    )


# ---------------------------------------------------------------------------
# Step-credit grading
# ---------------------------------------------------------------------------

class MilestoneModel(BaseModel):
    name: str
    kind: str  # "isolated" or "eliminated"
    var: str
    credit: float = 0.0


class StepsGradeRequest(BaseModel):
    lines: list[str]
    variables: list[str]
    milestones: list[MilestoneModel] = Field(default_factory=list)
    final_key: Optional[dict[str, str]] = None


class StepReportModel(BaseModel):
    index: int
    text: str
    valid: bool
    note: str


class StepsGradeResponse(BaseModel):
    score: float
    first_error_index: Optional[int]
    milestones_hit: list[str]
    final_correct: bool
    detail: str
    steps: list[StepReportModel]
    grader: str = "steps"


@app.post("/v1/grade/steps", response_model=StepsGradeResponse)
def grade_steps_endpoint(req: StepsGradeRequest) -> StepsGradeResponse:
    ms = [Milestone(m.name, m.kind, m.var, m.credit) for m in req.milestones]
    r = grade_steps(req.lines, req.variables, ms, req.final_key)
    return StepsGradeResponse(
        score=r.score,
        first_error_index=r.first_error_index,
        milestones_hit=r.milestones_hit,
        final_correct=r.final_correct,
        detail=r.detail,
        steps=[
            StepReportModel(index=s.index, text=s.text, valid=s.valid, note=s.note)
            for s in r.steps
        ],
    )


# ---------------------------------------------------------------------------
# Advanced graders
# ---------------------------------------------------------------------------

class OdeGradeRequest(BaseModel):
    ode: str
    func: str = "y"
    var: str = "x"
    response: str
    order: Optional[int] = None
    initial_conditions: Optional[dict[str, str]] = None


@app.post("/v1/grade/ode", response_model=GradeResponse)
def grade_ode(req: OdeGradeRequest) -> GradeResponse:
    return _to_response(
        adv.grade_ode_solution(
            req.ode, req.func, req.var, req.response, req.order, req.initial_conditions
        )
    )


class EigenGradeRequest(BaseModel):
    matrix: list[list[float]]
    eigenvalue: str
    eigenvector: list[str]


@app.post("/v1/grade/eigenpair", response_model=GradeResponse)
def grade_eigen(req: EigenGradeRequest) -> GradeResponse:
    return _to_response(adv.grade_eigenpair(req.matrix, req.eigenvalue, req.eigenvector))


class AntiderivativeGradeRequest(BaseModel):
    integrand: str
    var: str = "x"
    response: str


@app.post("/v1/grade/antiderivative", response_model=GradeResponse)
def grade_antideriv(req: AntiderivativeGradeRequest) -> GradeResponse:
    return _to_response(adv.grade_antiderivative(req.integrand, req.var, req.response))


class FourierGradeRequest(BaseModel):
    f: str
    var: str = "x"
    period_half: str = "pi"
    a0: Optional[str] = None
    an: Optional[str] = None
    bn: Optional[str] = None


@app.post("/v1/grade/fourier", response_model=GradeResponse)
def grade_fourier(req: FourierGradeRequest) -> GradeResponse:
    return _to_response(
        adv.grade_fourier_coefficients(
            req.f, req.var, req.period_half, req.a0, req.an, req.bn
        )
    )


class LaplaceGradeRequest(BaseModel):
    f: str
    var: str = "t"
    s_var: str = "s"
    response: str


@app.post("/v1/grade/laplace", response_model=GradeResponse)
def grade_laplace(req: LaplaceGradeRequest) -> GradeResponse:
    return _to_response(adv.grade_laplace(req.f, req.var, req.s_var, req.response))


# ---------------------------------------------------------------------------
# Parameterized templates: generate a verified variant
# ---------------------------------------------------------------------------

class VariantRequest(BaseModel):
    template_kind: str = "generate_unique_3x3"
    seed: int
    coeff_range: int = 4
    sol_range: int = 6


class VariantResponse(BaseModel):
    A: list[list[int]]
    b: list[int]
    verified: bool
    # The answer key is verified server-side and NOT returned to a learner
    # client. It is included here behind a flag for authoring tools only.
    key: Optional[list[int]] = None


@app.post("/v1/template/variant", response_model=VariantResponse)
def make_variant(req: VariantRequest, include_key: bool = False) -> VariantResponse:
    A, b, x = core.generate_unique_3x3(req.seed, req.coeff_range, req.sol_range)
    verified = core.verify_unique_solution(A, b, x)
    return VariantResponse(
        A=[[int(v) for v in row] for row in A.tolist()],
        b=[int(v) for v in b],
        verified=verified,
        key=[int(v) for v in x] if include_key else None,
    )


# ---------------------------------------------------------------------------
# Attempt flow: grade + mastery update + misconception diagnosis in one call.
# This is the loop the practice UI drives.
# ---------------------------------------------------------------------------

import json as _json
from pathlib import Path as _Path

from fastapi.responses import HTMLResponse

from axiom_mastery import MASTERY_THRESHOLD, MasteryStore

_SEED_PATH = _Path(__file__).parent / "linalg_unit1_seed.json"
_SEED = _json.loads(_SEED_PATH.read_text()) if _SEED_PATH.exists() else {}
_ITEMS = {it["id"]: it for it in _SEED.get("items", [])}
_MISC = {m["code"]: m for m in _SEED.get("misconceptions", [])}
_NODES = {n["id"]: n for n in _SEED.get("nodes", [])}

_mastery = MasteryStore()


class AttemptRequest(BaseModel):
    learner_id: str = "demo-learner"
    item_id: str
    # Exactly one of these, matching the item's grader:
    point_response: Optional[dict[str, str]] = None
    choice_key: Optional[str] = None
    ode_response: Optional[str] = None
    lines: Optional[list[str]] = None


class Diagnosis(BaseModel):
    code: str
    name: str
    description: str
    routes_to_node: str
    routes_to_title: str


class AttemptResponse(BaseModel):
    item_id: str
    correct: bool
    detail: str
    grader: str
    score: float = 1.0
    first_error_index: Optional[int] = None
    diagnosis: Optional[Diagnosis] = None
    node_id: str
    node_title: str
    mastery_before: float
    mastery_after: float
    mastered: bool
    mastery_note: str


def _diagnose(code: Optional[str]) -> Optional[Diagnosis]:
    if not code or code not in _MISC:
        return None
    m = _MISC[code]
    node = _NODES.get(m["routes_to"], {})
    return Diagnosis(
        code=m["code"],
        name=m["name"],
        description=m["description"],
        routes_to_node=m["routes_to"],
        routes_to_title=node.get("title", m["routes_to"]),
    )


@app.post("/v1/attempt", response_model=AttemptResponse)
def submit_attempt(req: AttemptRequest) -> AttemptResponse:
    if req.item_id not in _ITEMS:
        # Two demo items live outside the LA seed (ODE and steps); handle below.
        item = None
    else:
        item = _ITEMS[req.item_id]

    correct = False
    detail = ""
    grader = ""
    score = 0.0
    first_error = None
    diagnosis = None

    if item and item["grader"] == "cas" and req.point_response is not None:
        r = core.grade_solution_point(req.point_response, item["answer_spec"]["key"])
        correct, detail, grader = r.correct, r.detail, r.grader
        score = 1.0 if correct else 0.0
        node_id = item["node_id"]

    elif item and item["grader"] == "mc" and req.choice_key is not None:
        choice = next((c for c in item["choices"] if c["key"] == req.choice_key), None)
        if choice is None:
            correct, detail, grader = False, "unknown choice", "mc"
        else:
            correct = bool(choice["correct"])
            grader = "mc"
            detail = "correct" if correct else "incorrect"
            score = 1.0 if correct else 0.0
            if not correct:
                diagnosis = _diagnose(choice.get("misconception"))
        node_id = item["node_id"]

    elif req.item_id == "ODE-DEMO-1" and req.ode_response is not None:
        r = adv.grade_ode_solution(
            "Derivative(y(x), x) - y(x)", "y", "x", req.ode_response, order=1
        )
        correct, detail, grader = r.correct, r.detail, r.grader
        score = 1.0 if correct else 0.0
        node_id = "OD1"
        # Misconception hook: missing arbitrary constant is a named error.
        if not correct and "particular solution" in detail:
            diagnosis = Diagnosis(
                code="M-ODE-1",
                name="Missing arbitrary constant",
                description="Treats one particular solution as the general solution.",
                routes_to_node="OD1",
                routes_to_title="First-order ODEs: general vs particular solutions",
            )

    elif req.item_id == "STEPS-DEMO-1" and req.lines is not None:
        r = grade_steps(
            req.lines, ["x", "y"],
            [Milestone("y eliminated", "isolated", "x", 0.5)],
            final_key={"x": "2", "y": "1"},
        )
        correct = r.final_correct and r.first_error_index is None
        detail, grader, score = r.detail, "steps", r.score
        first_error = r.first_error_index
        node_id = "N7"

    else:
        return AttemptResponse(
            item_id=req.item_id, correct=False,
            detail="no response supplied for this item type", grader="none",
            node_id="", node_title="", mastery_before=0, mastery_after=0,
            mastered=False, mastery_note="not graded",
        )

    node_title = _NODES.get(node_id, {}).get(
        "title",
        {"OD1": "First-order ODEs"}.get(node_id, node_id),
    )
    before = _mastery.get(req.learner_id, node_id).p_mastered
    m = _mastery.update(req.learner_id, node_id, req.item_id, correct)

    return AttemptResponse(
        item_id=req.item_id,
        correct=correct,
        detail=detail,
        grader=grader,
        score=score,
        first_error_index=first_error,
        diagnosis=diagnosis,
        node_id=node_id,
        node_title=node_title,
        mastery_before=round(before, 4),
        mastery_after=round(m.p_mastered, 4),
        mastered=m.p_mastered >= MASTERY_THRESHOLD,
        mastery_note=m.evidence[-1].note,
    )


class MasterySnapshot(BaseModel):
    node_id: str
    node_title: str
    p_mastered: float
    mastered: bool
    attempts: int


@app.get("/v1/mastery/{learner_id}", response_model=list[MasterySnapshot])
def get_mastery(learner_id: str) -> list[MasterySnapshot]:
    out = []
    for m in _mastery.all_for(learner_id):
        title = _NODES.get(m.node_id, {}).get(
            "title", {"OD1": "First-order ODEs"}.get(m.node_id, m.node_id)
        )
        out.append(MasterySnapshot(
            node_id=m.node_id, node_title=title,
            p_mastered=round(m.p_mastered, 4),
            mastered=m.p_mastered >= MASTERY_THRESHOLD,
            attempts=len(m.evidence),
        ))
    return out


@app.get("/", response_class=HTMLResponse)
def practice_page() -> str:
    page = _Path(__file__).parent / "practice.html"
    if page.exists():
        return page.read_text()
    return "<h1>AXIOM</h1><p>practice.html not found next to the service.</p>"


# ---------------------------------------------------------------------------
# Persistence and adaptivity (v2 routes). The in-memory flow above stays for
# compatibility; these routes are the database-backed versions.
# ---------------------------------------------------------------------------

from axiom_adaptive import pick_next_item
from axiom_db import (
    AttemptRow, DbMasteryStore, ItemRow, KnowledgeNodeRow, SessionLocal,
    init_db, load_seed,
)


def _verify_item_for_load(it: dict) -> bool:
    """The verified-everything gate applied at seed-load time."""
    try:
        if it["grader"] == "cas" and "coeffs" in it.get("answer_spec", {}):
            s = it["answer_spec"]
            return core.verify_linear_system_key(s["coeffs"], s["rhs"], s["key"])
        if it["grader"] == "mc":
            # An MC item is verifiable structurally: exactly one correct choice
            # and every distractor keyed to a misconception.
            ch = it.get("choices", [])
            one_correct = sum(1 for c in ch if c.get("correct")) == 1
            all_keyed = all(c.get("misconception") for c in ch if not c.get("correct"))
            return one_correct and all_keyed
        if it["grader"] == "exact" and "problem_matrix" in it.get("answer_spec", {}):
            # RREF items verify trivially: the reference is computed, not stored.
            return True
        if it["grader"] == "set_equal":
            s = it["answer_spec"]
            r = core.grade_solution_set(
                s["A"], s["b"], s["example_particular"], s["example_directions"]
            )
            return r.correct
        if it.get("template"):
            # Templates verify per-variant at generation time; spot-check one.
            A, b, x = core.generate_unique_3x3(1, **it["template"].get("params", {}))
            return core.verify_unique_solution(A, b, x)
    except Exception:
        return False
    return False


from axiom_review import record_attempt as _review_record, router as _review_router

app.include_router(_review_router)


@app.on_event("startup")
def _startup() -> None:
    init_db()
    counts = load_seed(str(_SEED_PATH), verify_fn=_verify_item_for_load)
    print(f"seed load (new rows): {counts}")


_db_mastery = DbMasteryStore()


class NextItemResponse(BaseModel):
    item_id: Optional[str]
    node_id: Optional[str]
    node_title: Optional[str]
    stem: Optional[str] = None
    grader: Optional[str] = None
    choices: list[dict] = Field(default_factory=list)
    reason: str
    policy: str
    variant_id: Optional[str] = None  # set for parameterized template items


@app.get("/v2/next-item/{learner_id}", response_model=NextItemResponse)
def next_item(learner_id: str) -> NextItemResponse:
    with SessionLocal() as db:
        snap = _db_mastery.snapshot(db, learner_id)
        d = pick_next_item(db, learner_id, snap)
        stem = grader = None
        choices: list[dict] = []
        if d.item_id:
            row = db.get(ItemRow, d.item_id)
            stem, grader = row.stem, row.grader
            # Never leak correctness or misconception keys to the client.
            choices = [
                {"key": c["key"], "text": c["text"]} for c in row.choices
            ]
        return NextItemResponse(
            item_id=d.item_id, node_id=d.node_id, node_title=d.node_title,
            stem=stem, grader=grader, choices=choices,
            reason=d.reason, policy=d.policy,
        )


class AttemptV2Request(BaseModel):
    learner_id: str = "demo-learner"
    item_id: str
    point_response: Optional[dict[str, str]] = None
    choice_key: Optional[str] = None
    response_matrix: Optional[list[list[float]]] = None
    particular: Optional[list[float]] = None
    directions: Optional[list[list[float]]] = None


@app.post("/v2/attempt", response_model=AttemptResponse)
def submit_attempt_v2(req: AttemptV2Request) -> AttemptResponse:
    with SessionLocal() as db:
        item = db.get(ItemRow, req.item_id)
        if item is None or not item.verified:
            return AttemptResponse(
                item_id=req.item_id, correct=False,
                detail="unknown or unverified item (unverified items are never served)",
                grader="none", node_id="", node_title="",
                mastery_before=0, mastery_after=0, mastered=False,
                mastery_note="not graded",
            )

        diagnosis = None
        misc_code = None
        spec = item.answer_spec

        if item.grader == "cas" and req.point_response is not None:
            r = core.grade_solution_point(req.point_response, spec["key"])
            correct, detail, grader, score = r.correct, r.detail, r.grader, float(r.correct)
        elif item.grader == "mc" and req.choice_key is not None:
            choice = next((c for c in item.choices if c["key"] == req.choice_key), None)
            correct = bool(choice and choice.get("correct"))
            grader, score = "mc", float(correct)
            detail = "correct" if correct else "incorrect"
            if choice and not correct:
                misc_code = choice.get("misconception")
                diagnosis = _diagnose(misc_code)
        elif item.grader == "exact" and req.response_matrix is not None:
            r = core.grade_rref(req.response_matrix, spec["problem_matrix"])
            correct, detail, grader, score = r.correct, r.detail, r.grader, float(r.correct)
        elif item.grader == "set_equal" and req.particular is not None:
            r = core.grade_solution_set(
                spec["A"], spec["b"], req.particular, req.directions or []
            )
            correct, detail, grader, score = r.correct, r.detail, r.grader, float(r.correct)
        else:
            return AttemptResponse(
                item_id=req.item_id, correct=False,
                detail="response type does not match the item's grader",
                grader="none", node_id=item.node_id, node_title="",
                mastery_before=0, mastery_after=0, mastered=False,
                mastery_note="not graded",
            )

        db.add(AttemptRow(
            learner_id=req.learner_id, item_id=item.id, node_id=item.node_id,
            correct=correct, score=score, grader=grader, detail=detail,
            misconception_code=misc_code,
        ))
        if req.choice_key is not None and item.grader == "mc":
            _c = next((c for c in item.choices if c["key"] == req.choice_key), None)
            _resp = f"chose ({req.choice_key}) {_c['text']}" if _c else f"chose {req.choice_key}"
        elif req.point_response is not None:
            _resp = json.dumps(req.point_response)
        elif req.response_matrix is not None:
            _resp = json.dumps(req.response_matrix)
        else:
            _resp = json.dumps({"particular": req.particular, "directions": req.directions})
        _review_record(
            db, req.learner_id, item, correct,
            response_summary=_resp, misconception_code=misc_code,
        )
        db.commit()

        before, after, note = _db_mastery.update(
            db, req.learner_id, item.node_id, item.id, correct
        )
        node = db.get(KnowledgeNodeRow, item.node_id)
        return AttemptResponse(
            item_id=item.id, correct=correct, detail=detail, grader=grader,
            score=score, diagnosis=diagnosis,
            node_id=item.node_id, node_title=node.title if node else item.node_id,
            mastery_before=round(before, 4), mastery_after=round(after, 4),
            mastered=after >= MASTERY_THRESHOLD, mastery_note=note,
        )


# ---------------------------------------------------------------------------
# Per-learner template variants + v2 mastery snapshot
# ---------------------------------------------------------------------------

import hashlib
import json as _j2

from axiom_db import IssuedVariantRow


def _variant_seed(learner_id: str, item_id: str, attempt_no: int) -> int:
    h = hashlib.sha256(f"{learner_id}|{item_id}|{attempt_no}".encode()).hexdigest()
    return int(h[:8], 16)


def _format_system_stem(A: list[list[int]], b: list[int]) -> str:
    """Render A x = b as readable equations in x1, x2, x3."""
    lines = []
    for row, rhs in zip(A, b):
        terms = []
        for j, c in enumerate(row, start=1):
            if c == 0:
                continue
            sign = "-" if c < 0 else ("+" if terms else "")
            mag = abs(c)
            coef = "" if mag == 1 else str(mag)
            terms.append(f"{sign} {coef}x{j}".strip())
        lines.append((" ".join(terms) if terms else "0") + f" = {rhs}")
    return "Solve the system: " + ";  ".join(lines) + ".  Give x1, x2, x3."


def _issue_variant(db, learner_id: str, item: "ItemRow") -> tuple[str, str]:
    """Issue (or reuse an unconsumed) verified variant for a template item.
    Returns (variant_id, rendered_stem)."""
    from sqlalchemy import select as _sel
    existing = db.execute(
        _sel(IssuedVariantRow)
        .where(IssuedVariantRow.learner_id == learner_id,
               IssuedVariantRow.item_id == item.id,
               IssuedVariantRow.consumed == False)  # noqa: E712
        .order_by(IssuedVariantRow.created_at.desc())
        .limit(1)
    ).scalar_one_or_none()
    if existing:
        payload = _j2.loads(existing.payload_json)
        return existing.id, _format_system_stem(payload["A"], payload["b"])

    from sqlalchemy import func as _f
    attempt_no = db.query(IssuedVariantRow).filter_by(
        learner_id=learner_id, item_id=item.id
    ).count() if hasattr(db, "query") else 0
    template = _j2.loads(item.template_json) or {}
    params = template.get("params", {})

    # Generate until the verified-everything gate passes (it passes first try
    # by construction, but the gate is still enforced, not assumed).
    for bump in range(10):
        seed = _variant_seed(learner_id, item.id, attempt_no + bump)
        A, b, x = core.generate_unique_3x3(seed, **params)
        if core.verify_unique_solution(A, b, x):
            break
    else:
        raise RuntimeError("could not generate a verified variant")

    A_l = [[int(v) for v in row] for row in A.tolist()]
    b_l = [int(v) for v in b]
    key = {f"x{i+1}": str(int(v)) for i, v in enumerate(x)}
    row = IssuedVariantRow(
        learner_id=learner_id, item_id=item.id, seed=seed,
        payload_json=_j2.dumps({"A": A_l, "b": b_l}),
        key_json=_j2.dumps(key), verified=True,
    )
    db.add(row)
    db.commit()
    return row.id, _format_system_stem(A_l, b_l)


# Patch next-item: serve template items with a fresh per-learner variant.
_next_item_base = next_item  # keep reference


@app.get("/v2/next-item2/{learner_id}", response_model=NextItemResponse)
def next_item_v2(learner_id: str) -> NextItemResponse:
    with SessionLocal() as db:
        snap = _db_mastery.snapshot(db, learner_id)
        d = pick_next_item(db, learner_id, snap)
        stem = grader = variant_id = None
        choices: list[dict] = []
        if d.item_id:
            row = db.get(ItemRow, d.item_id)
            grader = row.grader
            if row.template_json not in (None, "null"):
                variant_id, stem = _issue_variant(db, learner_id, row)
            else:
                stem = row.stem
            choices = [{"key": c["key"], "text": c["text"]} for c in row.choices]
        r = NextItemResponse(
            item_id=d.item_id, node_id=d.node_id, node_title=d.node_title,
            stem=stem, grader=grader, choices=choices,
            reason=d.reason, policy=d.policy,
        )
        # variant_id rides along for template items.
        out = r.model_dump()
        out["variant_id"] = variant_id
        return out


class MasteryV2Row(BaseModel):
    node_id: str
    node_title: str
    p_mastered: float
    mastered: bool
    attempts: int


@app.get("/v2/mastery/{learner_id}", response_model=list[MasteryV2Row])
def mastery_v2(learner_id: str) -> list[MasteryV2Row]:
    with SessionLocal() as db:
        snap = _db_mastery.snapshot(db, learner_id)
        out = []
        for nid, d in sorted(snap.items()):
            node = db.get(KnowledgeNodeRow, nid)
            out.append(MasteryV2Row(
                node_id=nid, node_title=node.title if node else nid,
                p_mastered=round(d["p"], 4),
                mastered=d["p"] >= MASTERY_THRESHOLD,
                attempts=d["attempts"],
            ))
        return out


# Extend v2 attempts to grade template variants against the issued key.
class AttemptV3Request(AttemptV2Request):
    variant_id: Optional[str] = None


@app.post("/v3/attempt", response_model=AttemptResponse)
def submit_attempt_v3(req: AttemptV3Request) -> AttemptResponse:
    if req.variant_id:
        with SessionLocal() as db:
            var = db.get(IssuedVariantRow, req.variant_id)
            item = db.get(ItemRow, req.item_id) if var else None
            if (var is None or item is None or not var.verified
                    or var.learner_id != req.learner_id
                    or var.item_id != req.item_id):
                return AttemptResponse(
                    item_id=req.item_id, correct=False,
                    detail="unknown, unverified, or mismatched variant",
                    grader="none", node_id="", node_title="",
                    mastery_before=0, mastery_after=0, mastered=False,
                    mastery_note="not graded",
                )
            key = _j2.loads(var.key_json)
            r = core.grade_solution_point(req.point_response or {}, key)
            var.consumed = True
            db.add(AttemptRow(
                learner_id=req.learner_id, item_id=item.id, node_id=item.node_id,
                correct=r.correct, score=float(r.correct), grader=r.grader,
                detail=r.detail, misconception_code=None,
            ))
            _payload = _j2.loads(var.payload_json)
            _stem = (_format_system_stem(_payload["A"], _payload["b"])
                     if isinstance(_payload, dict) and "A" in _payload and "b" in _payload
                     else item.stem)
            _review_record(
                db, req.learner_id, item, r.correct,
                response_summary=_j2.dumps(req.point_response or {}),
                variant_id=req.variant_id, stem=_stem,
            )
            db.commit()
            before, after, note = _db_mastery.update(
                db, req.learner_id, item.node_id, item.id, r.correct
            )
            node = db.get(KnowledgeNodeRow, item.node_id)
            return AttemptResponse(
                item_id=item.id, correct=r.correct, detail=r.detail,
                grader=r.grader, score=float(r.correct),
                node_id=item.node_id, node_title=node.title if node else item.node_id,
                mastery_before=round(before, 4), mastery_after=round(after, 4),
                mastered=after >= MASTERY_THRESHOLD, mastery_note=note,
            )
    # No variant: delegate to the v2 path.
    return submit_attempt_v2(AttemptV2Request(**req.model_dump(exclude={"variant_id"})))
