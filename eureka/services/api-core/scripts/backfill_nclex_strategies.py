#!/usr/bin/env python3
"""Backfill test-taking strategy tips onto existing NCLEX bank items (NX-13).

Waves 1-7 and the original migrated bank predate the `strategy` field
(added 2026-08-20, Saunders benchmark adoption #1). The seed script is
idempotent on source_id and deliberately never updates existing rows, so
this companion script does the one mutation backfill needs: set
extra_metadata['strategy'] on items that already exist.

Input: a JSON object mapping source_id -> strategy string.

Refusals over silence, same doctrine as the seed:
  - an unknown source_id is an error (a typo'd id must not vanish);
  - an empty/whitespace strategy is an error;
  - an item that ALREADY has a strategy is skipped and reported, never
    overwritten (re-authoring an existing tip is a deliberate act: pass
    --overwrite to allow it).

Run inside the container:

  docker exec eureka-api-core python scripts/backfill_nclex_strategies.py /path/to/strategies.json
"""

from __future__ import annotations

import asyncio
import json
import os
import sys

sys.path.insert(0, "/app")

from sqlalchemy import select  # noqa: E402
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine  # noqa: E402
from sqlalchemy.orm.attributes import flag_modified  # noqa: E402

from app.models.item_bank import Item, ItemBank  # noqa: E402

DB_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql+asyncpg://eureka:eureka_dev_password@db:5432/eureka",
)
if DB_URL.startswith("postgresql://"):
    DB_URL = DB_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

BANK_SLUG = "nclex-qbank-v1"


async def main(json_path: str, overwrite: bool) -> None:
    with open(json_path) as fh:
        strategies: dict[str, str] = json.load(fh)
    print(f"strategies in file: {len(strategies)}")

    bad = [sid for sid, s in strategies.items() if not isinstance(s, str) or not s.strip()]
    if bad:
        sys.exit(f"refusing: empty/non-string strategy for {bad}")

    engine = create_async_engine(DB_URL)
    maker = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
    async with maker() as db:
        bank = (
            await db.execute(select(ItemBank).where(ItemBank.slug == BANK_SLUG))
        ).scalar_one_or_none()
        if bank is None:
            sys.exit(f"bank {BANK_SLUG} not found")

        rows = (
            await db.execute(select(Item).where(Item.bank_id == bank.id))
        ).scalars().all()
        by_source = {r.extra_metadata.get("source_id"): r for r in rows}

        unknown = [sid for sid in strategies if sid not in by_source]
        if unknown:
            sys.exit(f"refusing: {len(unknown)} unknown source_ids, e.g. {unknown[:5]}")

        updated, skipped = 0, 0
        for sid, tip in strategies.items():
            item = by_source[sid]
            if item.extra_metadata.get("strategy") and not overwrite:
                skipped += 1
                continue
            item.extra_metadata["strategy"] = tip.strip()
            flag_modified(item, "extra_metadata")
            updated += 1
        await db.commit()
        print(f"updated {updated}, skipped {skipped} (already had strategy)")

        # Post-condition report: how much of the bank now carries a tip.
        have = sum(1 for r in rows if r.extra_metadata.get("strategy"))
        print(f"bank coverage: {have}/{len(rows)} items have a strategy")
    await engine.dispose()


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if a != "--overwrite"]
    if len(args) != 1:
        sys.exit("usage: backfill_nclex_strategies.py [--overwrite] <strategies.json>")
    asyncio.run(main(args[0], "--overwrite" in sys.argv))
