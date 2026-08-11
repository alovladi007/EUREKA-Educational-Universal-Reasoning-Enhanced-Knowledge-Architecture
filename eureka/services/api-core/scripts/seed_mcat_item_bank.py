#!/usr/bin/env python3
"""Migrate the client-bundled MCAT qbank into the server item bank (C1, MC-1/MC-6).

Source: the 580 items compiled into eureka/apps/web's bundle
(src/lib/mcat-qbank-data.ts), exported to JSON. Until Phase C flips the web
QBank tab, those items ship their keys to the browser - docs/mcat/AUDIT.md
MC-1. This seed moves them into the reviewable server infrastructure with
their true standing recorded, not laundered:

  - review_status = DRAFT (the source file says "AI-generated. Requires SME
    review." - so nothing here is APPROVED; the serving layer decides what
    DRAFT items may be used for, per C5)
  - ItemSource.source_kind = AI_GENERATED, source_uri pointing back at the
    client file they came from

Idempotent: keyed on the source item id stored in metadata; re-running
inserts nothing new. Run inside the container:

  docker exec eureka-api-core python scripts/seed_mcat_item_bank.py /path/to/mcat_qbank.json
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

BANK_SLUG = "mcat-qbank-v1"
SOURCE_URI = "eureka/apps/web/src/lib/mcat-qbank-data.ts"

# topicId -> section label. VERIFIED against the items themselves (topic 1's
# subtopics are Humanities/CARS skills, topic 2's are Biochem, topic 3's are
# Behavioral Sciences) and against the client's own section->topic map
# (page.tsx sectionToTopic: chem_phys 0, cars 1, bio_biochem 2, psych_soc 3).
# The first version of this script guessed these labels and got 1-3 wrong;
# the fix updated the seeded rows in place.
TOPICS = {
    0: "Chemical and Physical Foundations",
    1: "Critical Analysis and Reasoning Skills",
    2: "Biological and Biochemical Foundations",
    3: "Psychological, Social, and Biological Foundations",
}

DIFFICULTY = {1: "easy", 2: "medium", 3: "hard"}


async def main(json_path: str) -> None:
    with open(json_path) as fh:
        questions = json.load(fh)
    print(f"source items: {len(questions)}")

    engine = create_async_engine(DB_URL)
    maker = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
    async with maker() as db:
        bank = (
            await db.execute(select(ItemBank).where(ItemBank.slug == BANK_SLUG))
        ).scalar_one_or_none()
        if bank is None:
            bank = ItemBank(
                slug=BANK_SLUG,
                name="MCAT QBank (migrated from client bundle)",
                description=(
                    "The 580 discrete MCAT items previously compiled into the "
                    "web bundle (docs/mcat/AUDIT.md MC-1). AI-generated content "
                    "awaiting SME review: every item is DRAFT until a named "
                    "reviewer approves it, and the serving layer enforces what "
                    "DRAFT items may be used for."
                ),
                framework=SkillFramework.MCAT,
                tier="test_prep",
                default_license="proprietary",
                default_attribution="EUREKA (AI-generated, pending SME review)",
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
            item = Item(
                bank_id=bank.id,
                family_id=uuid4(),
                kind=ItemKind.MCQ_SINGLE,
                content={
                    "stem": q["question"],
                    "options": q["options"],
                    "correct_index": q["correct"],
                },
                explanation=q.get("explanation") or None,
                difficulty_nominal=DIFFICULTY.get(q.get("difficulty"), "medium"),
                estimated_time_sec=90,
                review_status=ItemReviewStatus.DRAFT,
                tags=[t for t in (q.get("subtopic"),) if t],
                extra_metadata={
                    "source_id": q["id"],
                    "topic_id": q["topicId"],
                    "section": TOPICS.get(q["topicId"], "unknown"),
                    "subtopic": q.get("subtopic"),
                },
            )
            db.add(item)
            await db.flush()
            db.add(
                ItemSource(
                    item_id=item.id,
                    source_kind=ItemSourceKind.AI_GENERATED,
                    source_uri=SOURCE_URI,
                    source_name="EUREKA client-bundle MCAT qbank",
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
        sys.exit("usage: seed_mcat_item_bank.py <mcat_qbank.json>")
    asyncio.run(main(sys.argv[1]))
