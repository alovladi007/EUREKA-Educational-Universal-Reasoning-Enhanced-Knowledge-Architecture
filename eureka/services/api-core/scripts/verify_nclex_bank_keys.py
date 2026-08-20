#!/usr/bin/env python3
"""Dual-path verification of the NCLEX bank's calc-verified keys (NX-5).

When the dosage items lived in the client bundle, an independently written
TypeScript path (apps/web nclex-dosage-verify.test.ts) recomputed every key
from the item's `calc` block on every CI run. NX-5 moved the items into the
server item bank; this script moves the verification with them, against
what is ACTUALLY SERVED — the live rows — rather than a source file.

Per calc-verified item it asserts:
  1. the recomputed value equals calc.expected at the item's rounding,
  2. the keyed option's leading number parses to that same value,
  3. no distractor parses to the keyed value (no duplicate-correct).

The formulas below are written from the pharmacology definitions, not
imported from app/services/nclex_dosage.py — importing the generator to
check the generator would verify nothing.

Exit 0 = every calc-verified item passes. Exit 1 = any failure, listed.

Run inside the container:
  docker exec eureka-api-core python scripts/verify_nclex_bank_keys.py
"""

from __future__ import annotations

import asyncio
import os
import re
import sys

sys.path.insert(0, "/app")

from sqlalchemy import select  # noqa: E402
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine  # noqa: E402

from app.models.item_bank import Item, ItemBank  # noqa: E402

DB_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql+asyncpg://eureka:eureka_dev_password@db:5432/eureka",
)
if DB_URL.startswith("postgresql://"):
    DB_URL = DB_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

BANK_SLUG = "nclex-qbank-v1"


def recompute(kind: str, p: dict) -> float:
    """Independent path: the standard med-math formulas, written fresh."""
    if kind == "tablets":
        return p["ordered_mg"] / p["strength_mg"]
    if kind == "liquid-volume":
        return (p["ordered_mg"] / p["conc_mg"]) * p["conc_ml"]
    if kind == "dose-by-weight":
        kg = p["weight"] / 2.2 if p.get("weight_is_lb") else p["weight"]
        return p["mg_per_kg"] * kg
    if kind == "iv-rate-mlhr":
        return p["volume_ml"] / p["hours"]
    if kind == "iv-drip-gtt":
        return (p["volume_ml"] * p["drop_factor"]) / p["minutes"]
    if kind == "unit-conversion":
        return p["value"] * p["factor"]
    if kind == "reconstitution":
        return (p["ordered_mg"] / p["conc_mg"]) * p["conc_ml"]
    if kind == "pediatric-safe-dose":
        return (p["mg_per_kg_day"] * p["weight_kg"]) / p["doses_per_day"]
    if kind == "infusion-time":
        return p["volume_ml"] / p["rate_mlhr"]
    if kind == "iv-dose-mlhr":
        if "units_per_kg_hr" in p:
            units_per_hr = p["units_per_kg_hr"] * p["weight_kg"]
            return units_per_hr / (p["bag_units"] / p["bag_ml"])
        mcg_per_min = p["mcg_per_kg_min"] * p["weight_kg"]
        mg_per_hr = (mcg_per_min * 60) / 1000
        return mg_per_hr / (p["bag_mg"] / p["bag_ml"])
    raise ValueError(f"no independent formula for calc kind: {kind}")


def round_half_up(v: float, nd: int) -> float:
    """Half-UP with float noise quantized away first — the nursing rounding
    convention, matching the TS verifier's roundTo() exactly (see its comment
    on the nitroprusside 25.5 case)."""
    q = round(v * 1e9) / 1e9
    f = 10 ** nd
    import math
    return math.floor(round(q * f * 1e6) / 1e6 + 0.5) / f


_NUM = re.compile(r"-?\d+(?:\.\d+)?")


def option_value(opt: str) -> float | None:
    m = _NUM.search(opt.replace(",", ""))
    return float(m.group(0)) if m else None


async def main() -> int:
    engine = create_async_engine(DB_URL)
    maker = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
    failures: list[str] = []
    checked = 0
    async with maker() as db:
        bank = (
            await db.execute(select(ItemBank).where(ItemBank.slug == BANK_SLUG))
        ).scalar_one_or_none()
        if bank is None:
            print(f"bank {BANK_SLUG} not seeded", file=sys.stderr)
            return 1
        items = (
            (
                await db.execute(
                    select(Item).where(
                        Item.bank_id == bank.id, Item.deleted_at.is_(None)
                    )
                )
            )
            .scalars()
            .all()
        )
        for item in items:
            calc = (item.extra_metadata or {}).get("calc")
            if not calc:
                continue  # clinical item; nothing computable to verify
            checked += 1
            sid = item.extra_metadata.get("source_id", str(item.id))
            try:
                independent = round_half_up(
                    recompute(calc["kind"], calc["params"]), calc["round"]
                )
            except Exception as exc:  # unknown kind / missing param
                failures.append(f"{sid}: recompute failed: {exc}")
                continue
            expected = float(calc["expected"])
            tol = 10 ** -(max(calc["round"], 6))
            # 1. Independent path agrees with the recorded expected value.
            if abs(independent - expected) > tol:
                failures.append(
                    f"{sid}: recomputed {independent} != expected {expected}"
                )
                continue
            # 2. The keyed option states exactly that value.
            options = list(item.content.get("options", []))
            key_idx = int(item.content["correct_index"])
            keyed = option_value(str(options[key_idx]))
            if keyed is None or abs(keyed - independent) > tol:
                failures.append(
                    f"{sid}: keyed option '{options[key_idx]}' != {independent}"
                )
                continue
            # 3. No distractor collides with the key.
            for i, opt in enumerate(options):
                if i == key_idx:
                    continue
                v = option_value(str(opt))
                if v is not None and abs(v - independent) <= (10 ** -(calc["round"] + 1)) / 2:
                    failures.append(f"{sid}: distractor '{opt}' equals the key")
    await engine.dispose()

    print(f"calc-verified items checked: {checked}")
    if failures:
        for f in failures:
            print(f"  FAIL {f}", file=sys.stderr)
        print(f"{len(failures)} failures", file=sys.stderr)
        return 1
    print("all keys verified by the independent path")
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
