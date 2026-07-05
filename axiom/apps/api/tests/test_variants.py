"""Acceptance (Phase 1): a parameterized template seeds distinct variants
across two students, and analytics still aggregate at the template level (every
variant response references the same template id)."""

from __future__ import annotations

from sqlalchemy import select

from app.domains.assessment.models import ItemVariant
from app.domains.attempts.models import Response
from app.domains.curriculum.models import KnowledgeNode
from app.domains.identity.models import User
from app.domains.practice.service import serve_next


async def _template_variants_for_user(db_session, user_id) -> list[dict]:
    rows = (
        await db_session.execute(
            select(Response, ItemVariant)
            .join(ItemVariant, ItemVariant.id == Response.variant_id)
            .where(Response.user_id == user_id, Response.template_id.isnot(None))
        )
    ).all()
    return [{"template_id": str(r.template_id), "values": v.values} for r, v in rows]


async def test_parameterized_variants_differ_but_aggregate(db_session):
    u1 = User(eureka_user_id="var-1", email="v1@x.com", display_name="V1")
    u2 = User(eureka_user_id="var-2", email="v2@x.com", display_name="V2")
    db_session.add_all([u1, u2])
    await db_session.flush()

    node = (
        await db_session.execute(select(KnowledgeNode).where(KnowledgeNode.code == "ALG.1"))
    ).scalar_one()

    # Serve many times so the template path is exercised for both students.
    for _ in range(20):
        await serve_next(db_session, u1.id, node.id)
        await serve_next(db_session, u2.id, node.id)
    await db_session.commit()

    v1 = await _template_variants_for_user(db_session, u1.id)
    v2 = await _template_variants_for_user(db_session, u2.id)

    assert v1, "student 1 should have received at least one template-backed item"
    assert v2, "student 2 should have received at least one template-backed item"

    # Aggregation at the template level: every variant response points at the
    # same template id (ALG.1 has one template).
    all_template_ids = {row["template_id"] for row in v1 + v2}
    assert len(all_template_ids) == 1

    # Distinct variants across students: the two students did not get the same
    # sequence of variable values.
    assert [row["values"] for row in v1] != [row["values"] for row in v2]
