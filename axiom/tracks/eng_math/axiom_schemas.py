"""AXIOM shared schemas (subset for the Linear Algebra Unit 1 seed).

Pydantic v2 models are the single source of truth for the shape of seed data.
The JSON seed files validate against these before anything is loaded into the
knowledge graph. Plain ASCII only in all text, per house style.
"""

from __future__ import annotations

from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class NodeKind(str, Enum):
    computational = "computational"
    concept = "concept"
    proof_technique = "proof_technique"
    theorem_with_proof = "theorem_with_proof"


class GraderType(str, Enum):
    cas = "cas"              # symbolic or numeric equivalence via SymPy
    exact = "exact"          # exact structural match (for example an RREF matrix)
    set_equal = "set_equal"  # affine or span equality (solution sets)
    mc = "mc"               # multiple choice, distractors keyed to misconceptions


class KnowledgeNode(BaseModel):
    id: str
    title: str
    kind: NodeKind
    description: str
    standards: list[str] = Field(default_factory=list)


class KnowledgeEdge(BaseModel):
    # source is a prerequisite for target
    source: str
    target: str
    relation: str = "prerequisite"


class Misconception(BaseModel):
    code: str
    name: str
    description: str
    routes_to: str = Field(..., description="KnowledgeNode id for remediation")

    @field_validator("code")
    @classmethod
    def code_format(cls, v: str) -> str:
        if not v.startswith("M"):
            raise ValueError("misconception code must start with M")
        return v


class Choice(BaseModel):
    key: str
    text: str
    correct: bool = False
    misconception: Optional[str] = Field(
        default=None, description="Misconception code this distractor is keyed to"
    )


class Item(BaseModel):
    id: str
    node_id: str
    grader: GraderType
    stem: str
    # answer_spec is grader specific and interpreted by axiom_grading
    answer_spec: dict = Field(default_factory=dict)
    choices: list[Choice] = Field(default_factory=list)
    template: Optional["ItemTemplate"] = None


class ItemTemplate(BaseModel):
    id: str
    node_id: str
    kind: str = Field(..., description="generator name in axiom_grading")
    params: dict = Field(default_factory=dict)


class UnitSeed(BaseModel):
    unit_id: str
    title: str
    nodes: list[KnowledgeNode]
    edges: list[KnowledgeEdge]
    misconceptions: list[Misconception]
    items: list[Item]

    def check_referential_integrity(self) -> list[str]:
        """Return a list of integrity problems (empty means clean)."""
        problems: list[str] = []
        node_ids = {n.id for n in self.nodes}
        misc_codes = {m.code for m in self.misconceptions}
        for e in self.edges:
            if e.source not in node_ids:
                problems.append(f"edge source {e.source} is not a node")
            if e.target not in node_ids:
                problems.append(f"edge target {e.target} is not a node")
        for m in self.misconceptions:
            if m.routes_to not in node_ids:
                problems.append(f"misconception {m.code} routes to unknown node {m.routes_to}")
        for it in self.items:
            if it.node_id not in node_ids:
                problems.append(f"item {it.id} references unknown node {it.node_id}")
            for c in it.choices:
                if c.misconception and c.misconception not in misc_codes:
                    problems.append(
                        f"item {it.id} choice {c.key} keys unknown misconception {c.misconception}"
                    )
        return problems


Item.model_rebuild()
