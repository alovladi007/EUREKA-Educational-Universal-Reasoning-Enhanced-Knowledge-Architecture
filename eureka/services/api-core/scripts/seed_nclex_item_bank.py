#!/usr/bin/env python3
"""Migrate the client-bundled NCLEX qbank into the server item bank (NX-2).

Same integrity fix as the MCAT C1 migration (seed_mcat_item_bank.py): the
items in eureka/apps/web/src/lib/nclex-qbank-data.ts and
nclex-qbank-clinical2-data.ts ship their answer keys in the browser bundle
(`correct` / `correctAnswers` fields readable in devtools). This seed moves
them into the reviewable server infrastructure; the endpoint layer then
serves stems without keys and grades server-side.

Differences from the MCAT seed, deliberate:

  - NCLEX has SATA items ("select all that apply": type='multi' with a
    correctAnswers index set). They become ItemKind.MCQ_MULTI with
    content.correct_indices; singles stay MCQ_SINGLE with correct_index.
  - The source bank carries a per-item `verification` tier:
      'calc-verified'  — dosage items whose key was COMPUTED and dual-path
                         checked (generator + independent TS verifier), with
                         the raw parameters in a `calc` block;
      'unverified'     — AI-authored clinical items pending SME review.
    Both land as review_status=DRAFT — arithmetic verification is not
    clinical SME approval, and a named human has approved none of these.
    The tier and the calc block are preserved in extra_metadata so the UI
    can badge them differently and a reviewer can re-run the arithmetic.
  - Category names come VERBATIM from lib/exam-config.ts (the registered
    NCLEX exam's 8 Client Needs sections) — not re-typed from memory. The
    MCAT seed guessed its section labels and got 3 of 4 wrong.

Idempotent on metadata->>'source_id'. Run inside the container:

  docker exec eureka-api-core python scripts/seed_nclex_item_bank.py /path/to/nclex_qbank.json
"""

from __future__ import annotations

import asyncio
import json
import os
import sys
from uuid import uuid4

sys.path.insert(0, "/app")

from sqlalchemy import select  # noqa: E402
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine  # noqa: E402

from app.models.item_bank import (  # noqa: E402
    Item, ItemBank, ItemKind, ItemReviewStatus, ItemSource, ItemSourceKind,
)
from app.models.skill import SkillFramework  # noqa: E402

DB_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql+asyncpg://eureka:eureka_dev_password@db:5432/eureka",
)
# The container env carries the sync-driver form; this script needs asyncpg.
if DB_URL.startswith("postgresql://"):
    DB_URL = DB_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

BANK_SLUG = "nclex-qbank-v1"

# topicId -> (category id, category name). Copied VERBATIM from the NCLEX
# entry in eureka/apps/web/src/lib/exam-config.ts sections[] — the single
# source the whole app uses for these names — and from the TOPIC_ID_MAP in
# nclex-qbank-data.ts for the id ordering.
CATEGORIES = {
    0: ("mgmt_of_care", "Management of Care"),
    1: ("safety_infection", "Safety & Infection Control"),
    2: ("health_promotion", "Health Promotion & Maintenance"),
    3: ("psychosocial", "Psychosocial Integrity"),
    4: ("basic_care", "Basic Care & Comfort"),
    5: ("pharm_parenteral", "Pharmacological & Parenteral Therapies"),
    6: ("reduction_risk", "Reduction of Risk Potential"),
    7: ("physio_adaptation", "Physiological Adaptation"),
}

DIFFICULTY = {1: "easy", 2: "medium", 3: "hard"}


def _validate(q: dict) -> str | None:
    """Return an error string if the item's key shape is wrong, else None.

    A seed that silently skips or silently mis-keys is worse than one that
    refuses: every item must be exactly one of the two shapes."""
    is_multi = q.get("type") == "multi"
    has_single = q.get("correct") is not None
    has_multi = bool(q.get("correctAnswers"))
    n = len(q.get("options", []))
    if is_multi:
        if not has_multi or has_single:
            return "multi item without correctAnswers (or with stray correct)"
        if not all(isinstance(i, int) and 0 <= i < n for i in q["correctAnswers"]):
            return "correctAnswers index out of range"
        if len(set(q["correctAnswers"])) != len(q["correctAnswers"]):
            return "duplicate indices in correctAnswers"
    else:
        if not has_single or has_multi:
            return "single item without correct (or with stray correctAnswers)"
        if not (isinstance(q["correct"], int) and 0 <= q["correct"] < n):
            return "correct index out of range"
    if q.get("topicId") not in CATEGORIES:
        return f"unknown topicId {q.get('topicId')}"
    return None


async def main(json_path: str) -> None:
    with open(json_path) as fh:
        questions = json.load(fh)
    print(f"source items: {len(questions)}")

    errors = [(q.get("id"), e) for q in questions if (e := _validate(q))]
    if errors:
        for item_id, err in errors:
            print(f"  INVALID {item_id}: {err}", file=sys.stderr)
        sys.exit(f"refusing to seed: {len(errors)} invalid items")

    engine = create_async_engine(DB_URL)
    maker = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
    async with maker() as db:
        bank = (
            await db.execute(select(ItemBank).where(ItemBank.slug == BANK_SLUG))
        ).scalar_one_or_none()
        if bank is None:
            bank = ItemBank(
                slug=BANK_SLUG,
                name="NCLEX-RN QBank (migrated from client bundle)",
                description=(
                    "The NCLEX-RN items previously compiled into the web "
                    "bundle with their answer keys. Two provenance tiers, "
                    "preserved per item in metadata: calc-verified dosage "
                    "items (keys computed and dual-path checked) and "
                    "unverified AI-authored clinical items. ALL are DRAFT "
                    "until a named SME approves them — arithmetic "
                    "verification is not clinical review."
                ),
                framework=SkillFramework.NCLEX,
                tier="test_prep",
                default_license="proprietary",
                default_attribution="EUREKA (pending SME review)",
            )
            db.add(bank)
            await db.flush()
            print(f"created bank {BANK_SLUG}")
        else:
            print(f"bank {BANK_SLUG} exists")

        existing = {
            row.extra_metadata.get("source_id")
            for row in (
                await db.execute(select(Item).where(Item.bank_id == bank.id))
            ).scalars()
        }
        inserted = 0
        for q in questions:
            if q["id"] in existing:
                continue
            is_multi = q.get("type") == "multi"
            content: dict = {
                "stem": q["question"],
                "options": q["options"],
            }
            if is_multi:
                content["correct_indices"] = sorted(q["correctAnswers"])
            else:
                content["correct_index"] = q["correct"]
            cat_id, cat_name = CATEGORIES[q["topicId"]]
            item = Item(
                bank_id=bank.id,
                family_id=uuid4(),
                kind=ItemKind.MCQ_MULTI if is_multi else ItemKind.MCQ_SINGLE,
                content=content,
                explanation=q.get("explanation") or None,
                difficulty_nominal=DIFFICULTY.get(q.get("difficulty"), "medium"),
                estimated_time_sec=90,
                review_status=ItemReviewStatus.DRAFT,
                tags=[t for t in (q.get("subtopic"),) if t],
                extra_metadata={
                    "source_id": q["id"],
                    "topic_id": q["topicId"],
                    "category_id": cat_id,
                    "section": cat_name,
                    "subtopic": q.get("subtopic"),
                    "verification": q["verification"],
                    # The raw dosage parameters, kept so a reviewer (or a
                    # server-side re-verifier) can recompute the key from
                    # first principles instead of trusting the migration.
                    "calc": q.get("calc"),
                },
            )
            db.add(item)
            await db.flush()
            db.add(
                ItemSource(
                    item_id=item.id,
                    source_kind=ItemSourceKind.AI_GENERATED,
                    source_uri=q["source_file"],
                    source_name=(
                        "EUREKA dosage generator (dual-path verified key)"
                        if q["verification"] == "calc-verified"
                        else "EUREKA client-bundle NCLEX qbank (AI-authored)"
                    ),
                    license=bank.default_license,
                    attribution=bank.default_attribution,
                )
            )
            inserted += 1
        await db.commit()
        print(f"inserted {inserted} items (skipped {len(questions) - inserted} already present)")
    await engine.dispose()


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("usage: seed_nclex_item_bank.py <nclex_qbank.json>")
    asyncio.run(main(sys.argv[1]))
