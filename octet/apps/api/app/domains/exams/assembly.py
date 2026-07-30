"""Turning a blueprint into a form: the specific items one learner will see.

Three rules, and the first one is the reason this module is separate from the
service that serves the exam.

1. An item may only come from a node the blueprint asked for. If the bank
   cannot supply enough items for a section, assembly FAILS. It does not
   quietly draw from a neighbouring node. A blueprint is a claim about what
   the score measures, and an exam padded from elsewhere measures something
   the score does not describe.

2. Every item is an issued variant whose key was independently verified at
   assembly time, by the same registry path practice uses. An exam item that
   skipped verification would be the one place in the platform where a wrong
   key reaches a learner with a grade attached to it.

3. The form is deterministic per learner. The same learner reassembling the
   same blueprint gets the same items, so a reload is not a reroll, and two
   learners get different variants of the same templates, so the form is not
   trivially shareable.

Templates are generators, not single items, so a section asking for more items
than there are templates on its nodes is still satisfiable: it takes further
variants of the same templates. That is legitimate, and it is also a weaker
exam, because two variants of one template measure one skill twice. The
assembler reports how much of that it had to do so the caller can judge.
"""

from __future__ import annotations

import hashlib
from dataclasses import dataclass, field

import chem_core as cc

from app.domains.grading.serve import public_meta as serve_public_meta

from app.data.curriculum import NODES_BY_CODE
from app.domains.exams.blueprints import Blueprint, SectionSpec


class AssemblyError(Exception):
    """The bank cannot honour the blueprint. Raised rather than worked around."""


@dataclass(frozen=True)
class FormItem:
    """One item on an assembled form.

    The key is deliberately absent. A form is handed to a learner, so it
    carries the prompt and never the answer, exactly as the practice serve
    path does.
    """

    position: int
    section_id: str
    node: str
    template_id: str
    seed: int
    prompt: str
    grader: str
    meta: dict
    verified_by: str


@dataclass(frozen=True)
class Form:
    blueprint_code: str
    user_id: str
    items: tuple[FormItem, ...]
    # How many items had to reuse a template already used in the same section,
    # which is a measure of how thin the bank was for this blueprint.
    repeated_templates: int
    notes: tuple[str, ...] = ()


def _templates_for(node_codes: tuple[str, ...]) -> dict[str, list[str]]:
    """Template ids available per node, in a stable order."""
    available: dict[str, list[str]] = {code: [] for code in node_codes}
    for tid, entry in sorted(cc.REGISTRY.items()):
        node = str(entry.get("node"))
        if node in available:
            available[node].append(tid)
    return available


def _form_seed(user_id: str, blueprint_code: str, position: int) -> int:
    digest = hashlib.sha256(f"{user_id}:{blueprint_code}:{position}".encode()).hexdigest()
    return int(digest[:8], 16) & 0x7FFFFFFF


def check_feasible(blueprint: Blueprint) -> list[str]:
    """Problems that would stop this blueprint being assembled, in plain words.

    Separate from assemble() so a catalogue can show which exams are actually
    takeable without building a form for every one of them.
    """
    problems: list[str] = []
    for section in blueprint.sections:
        unknown = [c for c in section.node_codes if c not in NODES_BY_CODE]
        for code in unknown:
            problems.append(f"{section.id} lists unknown node {code}")
        available = _templates_for(tuple(c for c in section.node_codes if c in NODES_BY_CODE))
        total = sum(len(v) for v in available.values())
        if total == 0:
            problems.append(
                f"{section.id} asks for {section.items} items but none of its "
                f"nodes carry a generated item yet"
            )
        elif section.items < 1:
            problems.append(f"{section.id} asks for {section.items} items")
    return problems


def assemble(blueprint: Blueprint, user_id: str) -> Form:
    """Build the form, or raise.

    Items are dealt round robin across the nodes of a section so the section
    spreads over its nodes rather than exhausting one before moving on. Within
    a node the templates cycle for the same reason.
    """
    problems = check_feasible(blueprint)
    if problems:
        raise AssemblyError("; ".join(problems))

    items: list[FormItem] = []
    repeated = 0
    notes: list[str] = []
    position = 0

    for section in blueprint.sections:
        available = _templates_for(section.node_codes)
        # Nodes that actually carry items, in blueprint order.
        live_nodes = [c for c in section.node_codes if available.get(c)]
        if not live_nodes:
            raise AssemblyError(f"{section.id} has no node carrying a generated item")

        distinct = sum(len(available[c]) for c in live_nodes)
        if section.items > distinct:
            notes.append(
                f"{section.id} asks for {section.items} items from {distinct} "
                f"templates, so some templates appear more than once with "
                f"different variants."
            )
        skipped = [c for c in section.node_codes if c not in live_nodes]
        if skipped:
            titles = ", ".join(NODES_BY_CODE[c].title for c in skipped)
            notes.append(
                f"{section.id} could draw nothing from {titles}, which carry "
                f"no generated items yet, so the section does not cover them."
            )

        used: set[str] = set()
        cursor = 0
        for _ in range(section.items):
            node = live_nodes[cursor % len(live_nodes)]
            pool = available[node]
            template_id = pool[(cursor // len(live_nodes)) % len(pool)]
            cursor += 1
            if template_id in used:
                repeated += 1
            used.add(template_id)

            position += 1
            seed = _form_seed(user_id, blueprint.code, position)
            try:
                variant = cc.resolve_generated(template_id, seed)
            except RuntimeError as exc:
                # resolve_generated only returns a variant whose key an
                # independent path confirmed. Exhausting its retries means the
                # bank cannot produce a verifiable item, which is a reason to
                # refuse the exam rather than serve an unverified one.
                raise AssemblyError(
                    f"{template_id} could not produce a verifiable item: {exc}"
                ) from exc

            # Whitelisted, fail-closed. This line used to be a blacklist
            # dropping two named keys and passing the rest, which leaked every
            # numeric item's answer (value, key_text, wrong_paths) into the
            # attempt payload once the numeric templates grew those fields.
            public_meta = serve_public_meta(variant.grader, variant.meta)
            items.append(
                FormItem(
                    position=position,
                    section_id=section.id,
                    node=variant.node,
                    template_id=variant.template_id,
                    seed=variant.seed,
                    prompt=variant.prompt,
                    grader=variant.grader,
                    meta=public_meta,
                    verified_by=str(variant.meta.get("verified_by", "")),
                )
            )

    return Form(
        blueprint_code=blueprint.code,
        user_id=user_id,
        items=tuple(items),
        repeated_templates=repeated,
        notes=tuple(notes),
    )
