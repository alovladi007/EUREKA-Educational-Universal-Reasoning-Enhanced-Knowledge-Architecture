"""Assessment service: authoring, assignment, delivery, and results.

A teacher builds an assessment from a set of nodes; the service pulls items and
templates for those nodes onto a form. Assignment records targets. A student
starts an attempt, which serves the form (resolving a per-student variant for
each template slot) as Responses on an assessment attempt, then answers each
through the shared practice grading path. Results aggregate per assigned user.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from math_core import ItemTemplate as McItemTemplate
from math_core import resolve_template
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.assessment.models import (
    Assessment,
    AssessmentForm,
    AssessmentItem,
    AssignmentTarget,
    Item,
    ItemTemplate,
    ItemVariant,
)
from app.domains.attempts.models import Attempt, Response
from app.domains.identity.models import User
from app.domains.notifications.service import notify
from app.domains.practice.service import _variant_seed


async def create_assessment(
    session: AsyncSession,
    teacher_id: uuid.UUID,
    title: str,
    node_ids: list[uuid.UUID],
    item_count: int,
    open_at: datetime | None = None,
    close_at: datetime | None = None,
) -> Assessment:
    assessment = Assessment(
        title=title, kind="quiz", created_by=teacher_id, open_at=open_at, close_at=close_at
    )
    session.add(assessment)
    await session.flush()
    form = AssessmentForm(assessment_id=assessment.id, name="Form A")
    session.add(form)
    await session.flush()

    # Pull items and templates for the chosen nodes, up to item_count.
    templates = (
        (await session.execute(select(ItemTemplate).where(ItemTemplate.node_id.in_(node_ids))))
        .scalars()
        .all()
    )
    items = (await session.execute(select(Item).where(Item.node_id.in_(node_ids)))).scalars().all()

    slots: list[tuple[str, uuid.UUID]] = [("template", t.id) for t in templates]
    slots += [("item", i.id) for i in items]
    slots = slots[: max(1, item_count)]

    for position, (kind, ref) in enumerate(slots):
        session.add(
            AssessmentItem(
                form_id=form.id,
                position=position,
                item_id=ref if kind == "item" else None,
                template_id=ref if kind == "template" else None,
            )
        )
    await session.flush()
    return assessment


async def assign(
    session: AsyncSession,
    assessment_id: uuid.UUID,
    user_ids: list[uuid.UUID],
    due_at: datetime | None = None,
) -> int:
    assessment = (
        await session.execute(select(Assessment).where(Assessment.id == assessment_id))
    ).scalar_one_or_none()
    title = assessment.title if assessment is not None else "an assessment"

    existing = {
        row.user_id
        for row in (
            await session.execute(
                select(AssignmentTarget).where(AssignmentTarget.assessment_id == assessment_id)
            )
        )
        .scalars()
        .all()
    }
    due_suffix = f" (due {due_at.strftime('%Y-%m-%d %H:%M UTC')})" if due_at is not None else ""
    added = 0
    for uid in user_ids:
        if uid not in existing:
            session.add(
                AssignmentTarget(assessment_id=assessment_id, user_id=uid, due_at=due_at)
            )
            # Alert each newly assigned student in their in-app inbox.
            await notify(
                session,
                uid,
                "assignment",
                "New assignment",
                f"You were assigned: {title}{due_suffix}.",
                link="/practice",
            )
            added += 1
    await session.flush()
    return added


async def start_attempt(
    session: AsyncSession, assessment_id: uuid.UUID, user_id: uuid.UUID
) -> dict:
    """Serve the assessment form to a student as Responses on a new attempt.

    Enforces the availability window: a student may only start between open_at
    and close_at when either is set.
    """
    assessment = (
        await session.execute(select(Assessment).where(Assessment.id == assessment_id))
    ).scalar_one_or_none()
    if assessment is None:
        return {"error": "assessment not found", "reason": "not_found"}
    now = datetime.now(UTC).replace(tzinfo=None)
    if assessment.open_at is not None and now < assessment.open_at:
        return {
            "error": "This assessment is not open yet.",
            "reason": "not_open",
            "open_at": assessment.open_at.isoformat(),
        }
    if assessment.close_at is not None and now > assessment.close_at:
        return {
            "error": "This assessment has closed.",
            "reason": "closed",
            "close_at": assessment.close_at.isoformat(),
        }

    form = (
        (
            await session.execute(
                select(AssessmentForm).where(AssessmentForm.assessment_id == assessment_id)
            )
        )
        .scalars()
        .first()
    )
    if form is None:
        return {"error": "assessment has no form"}
    slots = (
        (
            await session.execute(
                select(AssessmentItem)
                .where(AssessmentItem.form_id == form.id)
                .order_by(AssessmentItem.position)
            )
        )
        .scalars()
        .all()
    )

    attempt = Attempt(user_id=user_id, assessment_id=assessment_id, kind="assessment")
    session.add(attempt)
    await session.flush()

    served = []
    for slot in slots:
        response = Response(attempt_id=attempt.id, user_id=user_id, answer={}, node_id=uuid.uuid4())
        if slot.item_id is not None:
            item = (await session.execute(select(Item).where(Item.id == slot.item_id))).scalar_one()
            response.node_id = item.node_id
            response.item_id = item.id
            session.add(response)
            await session.flush()
            served.append(
                {
                    "response_token": str(response.id),
                    "kind": item.kind,
                    "prompt": item.prompt,
                    "options": item.options,
                }
            )
        else:
            template = (
                await session.execute(
                    select(ItemTemplate).where(ItemTemplate.id == slot.template_id)
                )
            ).scalar_one()
            seed = _variant_seed(user_id, template.id, slot.position)
            mc = McItemTemplate(
                id=str(template.id),
                variables=template.variables,
                constraints=template.constraints,
                stem=template.stem,
                answer_expr=template.answer_expr,
                tolerance=template.tolerance,
            )
            vout = resolve_template(mc, seed)
            variant = ItemVariant(
                template_id=template.id,
                seed=seed,
                values=vout.values,
                prompt=vout.stem,
                answer=vout.answer,
            )
            session.add(variant)
            await session.flush()
            response.node_id = template.node_id
            response.template_id = template.id
            response.variant_id = variant.id
            session.add(response)
            await session.flush()
            served.append(
                {
                    "response_token": str(response.id),
                    "kind": template.kind,
                    "prompt": variant.prompt,
                    "options": None,
                }
            )
    return {"attempt_id": str(attempt.id), "items": served, "count": len(served)}


async def results(session: AsyncSession, assessment_id: uuid.UUID) -> dict:
    assessment = (
        await session.execute(select(Assessment).where(Assessment.id == assessment_id))
    ).scalar_one_or_none()
    if assessment is None:
        return {"error": "assessment not found"}

    targets = (
        await session.execute(
            select(AssignmentTarget, User)
            .join(User, User.id == AssignmentTarget.user_id)
            .where(AssignmentTarget.assessment_id == assessment_id)
        )
    ).all()

    rows = []
    for _target, user in targets:
        attempts = (
            (
                await session.execute(
                    select(Attempt).where(
                        Attempt.assessment_id == assessment_id, Attempt.user_id == user.id
                    )
                )
            )
            .scalars()
            .all()
        )
        answered = 0
        correct = 0
        for attempt in attempts:
            answered += attempt.answered_count
            correct += attempt.correct_count
        score = round(correct / answered, 3) if answered else None
        rows.append(
            {
                "user_id": str(user.id),
                "display_name": user.display_name,
                "answered": answered,
                "correct": correct,
                "score": score,
                "status": "completed" if answered else "assigned",
            }
        )
    return {"assessment_id": str(assessment_id), "title": assessment.title, "results": rows}
