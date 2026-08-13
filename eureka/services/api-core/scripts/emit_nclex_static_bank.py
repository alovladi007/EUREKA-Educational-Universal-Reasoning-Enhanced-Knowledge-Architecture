#!/usr/bin/env python3
"""
Emit the static NCLEX dosage bank (part 2) from the server engine.

Single source of truth: this script imports app/services/nclex_dosage.py —
the same generators, the same dual-path verification, the same misconception
values — and writes eureka/apps/web/src/lib/nclex-dosage-bank2-data.ts. The
static bank is therefore exactly the server engine, frozen: it powers the
Dosage Mastery page's offline fallback when api-core is unreachable.

MCQ shape: the distractors ARE the misconception values for each item's own
parameters (padded with ×2/÷2 when a family has fewer than three), and each
option carries its misconception key so the offline path can coach a miss
the same way the server does. Key positions are balanced across A-D; the
TypeScript dual-path verifier (nclex-dosage-verify.test.ts) recomputes every
key from the calc params in CI.

Usage (from services/api-core, or inside the api-core container):
    python scripts/emit_nclex_static_bank.py > out.ts   # or --write
"""

from __future__ import annotations

import json
import random
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.services.nclex_dosage import (  # noqa: E402
    FAMILY_LABELS,
    GENERATORS,
    generate,
)

PER_FAMILY = 20
SEED = 20260813
OUT = (
    Path(__file__).resolve().parents[3]
    / "apps" / "web" / "src" / "lib" / "nclex-dosage-bank2-data.ts"
)

HEADER = '''/**
 * NCLEX-RN — Dosage bank, part 2 (the Dosage Mastery offline bank).
 *
 * GENERATED FILE — do not hand-edit. Regenerate with:
 *   services/api-core/scripts/emit_nclex_static_bank.py --write
 *
 * Every item here was produced by the server dosage engine
 * (app/services/nclex_dosage.py): keys computed, dual-path verified at
 * generation time, and re-verified from `calc.params` by an independently
 * written third path in nclex-dosage-verify.test.ts on every CI run.
 * Distractors are the engine's misconception values for each item's own
 * parameters; `misconceptionByOption` aligns a misconception key (or null)
 * to each option so the offline path can coach a miss the way the server
 * does.
 *
 * These items back the Dosage Mastery page when api-core is unreachable.
 * They are deliberately NOT merged into the main NCLEX QBank pool, whose
 * category mix follows the exam blueprint — 200 extra pharmacology items
 * would swamp it.
 */

import type { NclexQuestion } from '@/lib/nclex-qbank-data';

export interface NclexDosageBank2Item extends NclexQuestion {
  /** Misconception key per option index; null for the key and for pads. */
  misconceptionByOption: (string | null)[];
  /** Coaching text per misconception key, for offline diagnosis. */
  coaching: Record<string, string>;
}

export const NCLEX_DOSAGE_BANK2: NclexDosageBank2Item[] = [
'''

FOOTER = '''];

export const NCLEX_DOSAGE_BANK2_COUNT = NCLEX_DOSAGE_BANK2.length;

/** Items for one family, or all. */
export function getDosageBank2(family?: string): NclexDosageBank2Item[] {
  if (!family) return NCLEX_DOSAGE_BANK2;
  return NCLEX_DOSAGE_BANK2.filter((q) => q.calc?.kind === family);
}
'''


def fmt(v: float, nd: int) -> str:
    return f"{round(v, nd) if nd else int(round(v)):g}"


def main() -> None:
    rng = random.Random(SEED)
    items = []
    for family in sorted(GENERATORS):
        seen: set[str] = set()
        attempts = 0
        while len([i for i in items if i.family == family]) < PER_FAMILY:
            attempts += 1
            if attempts > 4000:
                raise SystemExit(
                    f"{family}: parameter pool exhausted before {PER_FAMILY} distinct items"
                )
            item = generate(family, rng)  # dual-path verified inside
            sig = json.dumps(item.params, sort_keys=True)
            if sig in seen:
                continue
            seen.add(sig)
            items.append(item)

    positions = ([0, 1, 2, 3] * ((len(items) + 3) // 4))[: len(items)]
    rng.shuffle(positions)

    lines = []
    for n, (item, pos) in enumerate(zip(items, positions), 1):
        nd = item.round
        key_txt = f"{fmt(item.expected, nd)} {item.unit}"

        # Distractors: misconception values first, pads after; never the key.
        opts: list[tuple[str, str | None]] = []
        for m in item.misconceptions:
            txt = f"{fmt(m.value, nd)} {m.unit if hasattr(m, 'unit') else item.unit}"
            if txt != key_txt and all(t != txt for t, _ in opts):
                opts.append((txt, m.key))
        pads = (
            item.expected * 2, item.expected / 2, item.expected * 10,
            item.expected / 10, item.expected + 10 ** (-nd) * 10,
            item.expected + 10 ** (-nd) * 25, item.expected * 4,
        )
        for pad in pads:
            if len(opts) >= 3:
                break
            if pad <= 0:
                continue
            txt = f"{fmt(pad, nd)} {item.unit}"
            if txt != key_txt and all(t != txt for t, _ in opts):
                opts.append((txt, None))
        assert len(opts) >= 3, f"could not build 3 distractors for {item.params}"
        opts = opts[:3]
        opts.insert(pos, (key_txt, None))

        entry = {
            "id": f"nx_dose2_{n:03d}",
            "topicId": 5,
            "subtopic": FAMILY_LABELS[item.family],
            "difficulty": 2,
            "question": item.stem,
            "options": [t for t, _ in opts],
            "correct": pos,
            "explanation": item.explanation,
            "verification": "calc-verified",
            "calc": {
                "kind": item.family,
                "params": item.params,
                "expected": item.expected,
                "unit": item.unit,
                "round": item.round,
            },
            "misconceptionByOption": [k for _, k in opts],
            "coaching": {m.key: m.coaching for m in item.misconceptions},
        }
        lines.append("  " + json.dumps(entry, ensure_ascii=False) + ",")

    out = HEADER + "\n".join(lines) + "\n" + FOOTER
    if "--write" in sys.argv:
        OUT.write_text(out)
        counts = {f: sum(1 for i in items if i.family == f) for f in sorted(GENERATORS)}
        print(f"wrote {len(items)} items to {OUT}")
        print("per family:", counts)
    else:
        print(out)


if __name__ == "__main__":
    main()
