"""The subject matter expert review ledger.

Before this module the review queue was impossible to drain. Two things were
being tracked and neither could be answered:

  347 authored facts carry a Source claim. Source is `statement` and
  `citation` and nothing else, so there was no field an expert could set. The
  compliance checker counted them, called itself "the subject matter expert
  review queue", and offered no way to leave it. An expert who verified fifty
  of them had nowhere to record it, and the count could only fall by deleting
  a citation, which would also delete the accountability it names.

  83 misconceptions do have `review`, `reviewer` and `reviewed_on` fields.
  Nothing anywhere assigned them. Every entry read "pending" and always would.

So the platform reported a review debt it had no mechanism to pay down, which
is worse than reporting nothing: it looks like a process.

WHY A FILE RATHER THAN AN ENDPOINT

Sign-off lives in git, as a reviewed commit, not behind a POST. An endpoint
that lets a caller mark a fact "confirmed" is exactly the fake-verification
vector this platform refuses everywhere else. A file makes the reviewer's name
and date part of the diff, attributable, and revertible. Reading the queue is
an endpoint, because that is a query. Answering it is a commit.

THE PROPERTY THAT MAKES THIS WORTH HAVING

A review is bound to the exact wording it was given. The identifier is a hash
of the node, the statement and the citation, so editing any of them produces a
different identifier and the old sign-off no longer matches anything. That
orphan is reported as STALE and blocks, rather than being dropped quietly.

This is the whole point. A review system where the reviewed text can change
underneath an approval is worse than none, because it launders unreviewed
content through an expert's name. Here, changing a comma costs the sign-off,
loudly. That is deliberately annoying, in proportion to the harm.

VERDICTS

  confirmed  Checked against the cited work and correct.
  disputed   Checked and believed wrong, not yet fixed. BLOCKS, because
             knowingly serving a number an expert flagged is worse than
             serving one nobody has looked at.

There is deliberately no "corrected" verdict. Correcting a fact rewrites its
statement, which changes its identifier, which returns it to pending for a
fresh look. That is the right outcome: the corrected wording has not been
reviewed just because the wrong wording was.
"""

from __future__ import annotations

import csv
import hashlib
import io
import json
from dataclasses import dataclass
from datetime import date
from pathlib import Path

LEDGER_PATH = Path(__file__).with_name("fact_reviews.json")

VERDICTS = ("confirmed", "disputed")
KINDS = ("fact", "misconception")


class LedgerError(ValueError):
    """The ledger file is malformed. Never silently tolerated."""


@dataclass(frozen=True)
class ReviewEntry:
    item_id: str
    kind: str
    verdict: str
    reviewer: str
    reviewed_on: str
    note: str = ""
    label: str = ""  # human-readable, for reading the diff. Not authoritative.


# ---------------------------------------------------------------------------
# Identity
# ---------------------------------------------------------------------------


def fact_id(node: str, statement: str, citation: str) -> str:
    """Stable identifier for one Source claim, derived from its content.

    Twelve hex characters. The birthday bound on 48 bits is far beyond any
    plausible corpus size, and a collision would surface as a review attached
    to the wrong fact rather than silently, because check_ledger asserts every
    live id is unique.
    """
    payload = "\x1f".join(("fact", node, statement.strip(), citation.strip()))
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:12]


def misconception_id(code: str, name: str, description: str, counterexample: str) -> str:
    """Same contract for a misconception entry.

    `source` is deliberately excluded: fixing a citation format should not
    discard a review of whether the belief and its counterexample are right.
    The teaching content is what was reviewed.
    """
    payload = "\x1f".join(
        ("misconception", code, name.strip(), description.strip(), counterexample.strip())
    )
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:12]


# ---------------------------------------------------------------------------
# The live corpus
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class ReviewableItem:
    item_id: str
    kind: str
    node: str
    course: str
    statement: str
    citation: str


def live_items() -> list[ReviewableItem]:
    """Everything currently awaiting or holding a review, in a stable order."""
    import chem_core as cc

    from app.data.claims import Source
    from app.data.curriculum import NODES_BY_CODE
    from app.data.lessons import LESSONS

    items: list[ReviewableItem] = []

    for code, lesson in LESSONS.items():
        node = NODES_BY_CODE.get(code)
        for claim in getattr(lesson, "claims", ()):
            if isinstance(claim, Source):
                items.append(
                    ReviewableItem(
                        item_id=fact_id(code, claim.statement, claim.citation),
                        kind="fact",
                        node=code,
                        course=node.course if node else "",
                        statement=claim.statement,
                        citation=claim.citation,
                    )
                )

    for code, m in cc.MISCONCEPTIONS.items():
        items.append(
            ReviewableItem(
                item_id=misconception_id(m.code, m.name, m.description, m.counterexample),
                kind="misconception",
                node=m.routes_to,
                course=(NODES_BY_CODE[m.routes_to].course if m.routes_to in NODES_BY_CODE else ""),
                statement=f"{m.name}: {m.description} Counterexample: {m.counterexample}",
                citation=m.source,
            )
        )

    items.sort(key=lambda i: (i.kind, i.course, i.node, i.item_id))
    return items


# ---------------------------------------------------------------------------
# The ledger file
# ---------------------------------------------------------------------------


def load_ledger(path: Path | None = None) -> dict[str, ReviewEntry]:
    """Read and validate the ledger. Raises rather than degrading."""
    path = path or LEDGER_PATH
    if not path.exists():
        return {}

    try:
        raw = json.loads(path.read_text("utf-8"))
    except json.JSONDecodeError as exc:
        raise LedgerError(f"{path.name} is not valid JSON: {exc}") from exc

    if not isinstance(raw, dict) or "reviews" not in raw:
        raise LedgerError(f"{path.name} must be an object with a 'reviews' list")
    if not isinstance(raw["reviews"], list):
        raise LedgerError(f"{path.name}: 'reviews' must be a list")

    entries: dict[str, ReviewEntry] = {}
    for i, row in enumerate(raw["reviews"]):
        where = f"{path.name} reviews[{i}]"
        if not isinstance(row, dict):
            raise LedgerError(f"{where} is not an object")
        for field in ("item_id", "kind", "verdict", "reviewer", "reviewed_on"):
            if not str(row.get(field, "")).strip():
                raise LedgerError(f"{where} is missing {field}")
        if row["kind"] not in KINDS:
            raise LedgerError(f"{where}: kind must be one of {KINDS}, got {row['kind']!r}")
        if row["verdict"] not in VERDICTS:
            raise LedgerError(
                f"{where}: verdict must be one of {VERDICTS}, got {row['verdict']!r}. "
                "There is no 'corrected': correcting a fact changes its id and "
                "returns it to pending, which is the intended behaviour."
            )
        try:
            date.fromisoformat(row["reviewed_on"])
        except ValueError as exc:
            raise LedgerError(f"{where}: reviewed_on must be ISO YYYY-MM-DD") from exc
        # A bare name is not accountability. Require something that identifies
        # a person well enough to ask them about it later.
        if len(row["reviewer"].strip()) < 8:
            raise LedgerError(
                f"{where}: reviewer must identify a person and their standing, "
                f"not just {row['reviewer']!r}"
            )
        if row["item_id"] in entries:
            raise LedgerError(f"{where}: duplicate review for {row['item_id']}")
        entries[row["item_id"]] = ReviewEntry(
            item_id=row["item_id"],
            kind=row["kind"],
            verdict=row["verdict"],
            reviewer=row["reviewer"].strip(),
            reviewed_on=row["reviewed_on"],
            note=str(row.get("note", "")).strip(),
            label=str(row.get("label", "")).strip(),
        )
    return entries


# ---------------------------------------------------------------------------
# The join
# ---------------------------------------------------------------------------


def status(path: Path | None = None) -> dict:
    """Join the live corpus to the ledger.

    stale is the interesting field. A ledger entry with no matching live item
    means the reviewed text was edited or removed after sign-off, so an
    expert's name is attached to wording they never saw.
    """
    items = live_items()
    ledger = load_ledger(path)

    ids = [i.item_id for i in items]
    duplicates = {i for i in ids if ids.count(i) > 1}

    confirmed: list[ReviewableItem] = []
    disputed: list[ReviewableItem] = []
    pending: list[ReviewableItem] = []
    for item in items:
        entry = ledger.get(item.item_id)
        if entry is None:
            pending.append(item)
        elif entry.verdict == "confirmed":
            confirmed.append(item)
        else:
            disputed.append(item)

    live_ids = {i.item_id for i in items}
    stale = [e for e in ledger.values() if e.item_id not in live_ids]

    def by_kind(rows: list) -> dict[str, int]:
        out: dict[str, int] = {}
        for r in rows:
            out[r.kind] = out.get(r.kind, 0) + 1
        return out

    return {
        "total": len(items),
        "confirmed": len(confirmed),
        "disputed": len(disputed),
        "pending": len(pending),
        "stale": len(stale),
        "by_kind": {
            "total": by_kind(items),
            "confirmed": by_kind(confirmed),
            "disputed": by_kind(disputed),
            "pending": by_kind(pending),
        },
        "duplicate_ids": sorted(duplicates),
        "disputed_items": [
            {"item_id": i.item_id, "node": i.node, "statement": i.statement} for i in disputed
        ],
        "stale_entries": [
            {
                "item_id": e.item_id,
                "reviewer": e.reviewer,
                "reviewed_on": e.reviewed_on,
                "label": e.label,
            }
            for e in stale
        ],
    }


def queue(kind: str | None = None, course: str | None = None, limit: int = 100) -> list[dict]:
    """What still needs a look, oldest surface first. Read-only by design."""
    ledger = load_ledger()
    rows = []
    for item in live_items():
        if item.item_id in ledger:
            continue
        if kind and item.kind != kind:
            continue
        if course and item.course != course:
            continue
        rows.append(
            {
                "item_id": item.item_id,
                "kind": item.kind,
                "node": item.node,
                "course": item.course,
                "statement": item.statement,
                "citation": item.citation,
            }
        )
        if len(rows) >= limit:
            break
    return rows


def export_csv(kind: str | None = None, course: str | None = None) -> str:
    """The queue in a form an expert can actually work through offline.

    They fill in verdict, reviewer and note, send it back, and whoever commits
    it turns the rows into ledger entries. The item_id column is what binds a
    row to its fact, so it must survive the round trip untouched.
    """
    buf = io.StringIO()
    writer = csv.writer(buf, lineterminator="\n")
    writer.writerow(
        ["item_id", "kind", "course", "node", "statement", "citation", "verdict", "reviewer", "note"]
    )
    for row in queue(kind=kind, course=course, limit=10_000):
        writer.writerow(
            [
                row["item_id"],
                row["kind"],
                row["course"],
                row["node"],
                row["statement"],
                row["citation"],
                "",
                "",
                "",
            ]
        )
    return buf.getvalue()
