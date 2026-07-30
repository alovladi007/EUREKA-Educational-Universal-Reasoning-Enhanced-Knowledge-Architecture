"""Flashcards derived from lessons, and the SM-2 schedule over them.

Two halves, both deliberately small:

Card derivation. Every complete lesson yields exactly two cards, both taken
verbatim from the authored text: the try-it retrieval question, and the
pitfall reframed as a question about the node. Nothing here writes card
prose; a card that reads badly is a lesson that reads badly, and the fix
belongs in the lesson. Cards are re-derived on every read rather than stored,
so a lesson edit propagates immediately. A lesson missing any of the parts a
card needs is skipped, as is a lesson whose node is no longer in the
curriculum: a card the app cannot attribute to a live node has nowhere to
link and nothing to claim.

Scheduling. Plain SM-2 (the same family the adaptive planner's port uses),
as a pure function over (repetitions, interval, ease, grade). Grades run 0
to 5. Below 3 is a lapse: repetitions and interval reset and the card comes
back in one day, with the E-Factor left unchanged, as published SM-2 defines
it. At 3 and above the E-Factor is updated and the interval walks the classic
ladder: 1 day, 6 days, then the previous interval times the ease.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.data.curriculum import NODES_BY_CODE
from app.data.lessons import LESSONS

from app.domains.srs.models import SrsState


class SrsError(Exception):
    """A controlled refusal with a learner-readable reason."""


KIND_TRY_IT = "try_it"
KIND_PITFALL = "pitfall"

MIN_EASE = 1.3
DEFAULT_EASE = 2.5


@dataclass(frozen=True)
class Card:
    """One derived flashcard. front and back are lesson text verbatim."""

    card_id: str
    node: str
    node_title: str
    unit: str
    course: str
    kind: str
    front: str
    back: str


def all_cards() -> list[Card]:
    """Every card the lesson library currently supports, in node order.

    Derived fresh on each call. The library is a module-level dict of ~130
    authored lessons, so this is a cheap walk, and paying it per read is
    what keeps card text impossible to desynchronise from lesson text.
    """
    cards: list[Card] = []
    for node_code in sorted(LESSONS):
        lesson = LESSONS[node_code]
        node = NODES_BY_CODE.get(node_code)
        if node is None:
            continue
        prompt = str(lesson.try_it_prompt).strip()
        answer = str(lesson.try_it_answer).strip()
        pitfall = str(lesson.pitfall).strip()
        if not (prompt and answer and pitfall):
            # An incomplete lesson yields no cards at all rather than a
            # partial pair; the compliance checker is where the gap is
            # reported, not the review queue.
            continue
        cards.append(
            Card(
                card_id=f"{node_code}:{KIND_TRY_IT}",
                node=node_code,
                node_title=node.title,
                unit=node.unit,
                course=node.course,
                kind=KIND_TRY_IT,
                front=prompt,
                back=answer,
            )
        )
        cards.append(
            Card(
                card_id=f"{node_code}:{KIND_PITFALL}",
                node=node_code,
                node_title=node.title,
                unit=node.unit,
                course=node.course,
                kind=KIND_PITFALL,
                front=f"Pitfall: What is the trap in {node.title}?",
                back=pitfall,
            )
        )
    return cards


def cards_by_id() -> dict[str, Card]:
    return {card.card_id: card for card in all_cards()}


def sm2(repetitions: int, interval_days: float, ease: float, q: int) -> tuple[int, float, float]:
    """One SM-2 step. Returns the new (repetitions, interval_days, ease).

    Pure on purpose: no clock, no rows, so the arithmetic is testable on its
    own and the router owns all persistence. The E-Factor is updated only on a
    successful recall (q >= 3); a lapse (q < 3) resets repetitions and interval
    but leaves the ease unchanged, exactly as published SM-2 defines it.
    """
    if not 0 <= q <= 5:
        raise SrsError("grade must be between 0 and 5")
    if q < 3:
        return 0, 1.0, ease
    ease = max(MIN_EASE, ease + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    repetitions += 1
    if repetitions == 1:
        interval = 1.0
    elif repetitions == 2:
        interval = 6.0
    else:
        interval = float(round(interval_days * ease))
    return repetitions, interval, ease


def _now() -> datetime:
    return datetime.now(UTC)


def as_aware(value: datetime) -> datetime:
    """SQLite hands timestamps back naive; treat them as the UTC they are."""
    return value if value.tzinfo else value.replace(tzinfo=UTC)


async def review(
    db: AsyncSession,
    user_id: str,
    *,
    card_id: str,
    grade: int,
) -> dict:
    """Record one graded recall and reschedule the card."""
    if card_id not in cards_by_id():
        raise SrsError(
            "That card is not in the current card set. Cards are derived "
            "from authored lessons, so a lesson that moved retires its cards."
        )

    state = (
        await db.scalars(
            select(SrsState).where(
                SrsState.user_id == user_id,
                SrsState.card_id == card_id,
            )
        )
    ).first()
    if state is None:
        # Column defaults apply at flush, not at construction, so a fresh
        # row must be given its zeros explicitly or the arithmetic below
        # reads None.
        state = SrsState(
            user_id=user_id,
            card_id=card_id,
            repetitions=0,
            interval_days=0.0,
            ease=DEFAULT_EASE,
            due_at=_now(),
            last_grade=0,
        )
        db.add(state)

    repetitions, interval, ease = sm2(
        state.repetitions, state.interval_days, state.ease, grade
    )
    now = _now()
    state.repetitions = repetitions
    state.interval_days = interval
    state.ease = ease
    state.due_at = now + timedelta(days=interval)
    state.last_grade = grade
    state.updated_at = now
    await db.flush()

    return {
        "card_id": card_id,
        "due_at": as_aware(state.due_at).isoformat(),
        "interval_days": interval,
        "repetitions": repetitions,
    }


async def queue(db: AsyncSession, user_id: str, *, limit: int) -> dict:
    """Due cards first, then unseen cards, up to limit.

    The back of each card is included: the client hides it until the flip,
    and hiding is a presentation rule, not a security boundary. There is
    nothing to protect here the way item keys are protected, because the
    lesson pages already show this text to anyone who reads them.
    """
    cards = cards_by_id()
    states = (
        await db.scalars(select(SrsState).where(SrsState.user_id == user_id))
    ).all()
    # A state whose card retired (lesson moved or unfinished) is ignored
    # rather than served: there is no card text to put on it.
    live_states = [s for s in states if s.card_id in cards]
    seen_ids = {s.card_id for s in live_states}

    now = _now()
    due_states = sorted(
        (s for s in live_states if as_aware(s.due_at) <= now),
        key=lambda s: as_aware(s.due_at),
    )
    new_cards = [c for c in all_cards() if c.card_id not in seen_ids]

    def entry(card: Card) -> dict:
        return {
            "card_id": card.card_id,
            "node": card.node,
            "node_title": card.node_title,
            "unit": card.unit,
            "kind": card.kind,
            "front": card.front,
            "back": card.back,
        }

    serve: list[dict] = [entry(cards[s.card_id]) for s in due_states[:limit]]
    for card in new_cards:
        if len(serve) >= limit:
            break
        serve.append(entry(card))

    return {
        "due": serve,
        "counts": {
            "due": len(due_states),
            "new": len(new_cards),
            "total": len(cards),
        },
    }


async def stats(db: AsyncSession, user_id: str) -> dict:
    """Totals and a per-course rollup of this learner's card record."""
    cards = all_cards()
    card_ids = {c.card_id for c in cards}
    states = (
        await db.scalars(select(SrsState).where(SrsState.user_id == user_id))
    ).all()
    live_states = [s for s in states if s.card_id in card_ids]
    seen_ids = {s.card_id for s in live_states}

    now = _now()
    due_now = sum(1 for s in live_states if as_aware(s.due_at) <= now)

    by_course: dict[str, dict[str, int]] = {}
    for card in cards:
        slot = by_course.setdefault(card.course, {"total": 0, "seen": 0})
        slot["total"] += 1
        if card.card_id in seen_ids:
            slot["seen"] += 1

    return {
        "total_cards": len(cards),
        "seen": len(seen_ids),
        "due_now": due_now,
        "by_course": by_course,
    }
