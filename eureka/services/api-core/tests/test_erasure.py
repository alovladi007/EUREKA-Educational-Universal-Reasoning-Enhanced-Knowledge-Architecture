"""
Tests for the GDPR/FERPA erasure executor.

TWO LAYERS, ON PURPOSE

The classification rules are a pure function of a column list, so most of this
file needs no database at all and runs anywhere.

The rest has to touch a real Postgres. `erase_user` works by walking
`pg_constraint` in the live schema - that is the whole design - so a SQLite
stand-in would test nothing that matters. The repo's `conftest.py` builds a
synchronous in-memory SQLite session, which cannot answer those queries, so
these tests bring their own async engine and skip when Postgres is unreachable.

The mutating tests clean up after themselves: the users they create never
acquire authorship rows, so the tombstone can be hard-deleted in teardown even
though a real erased user's cannot.
"""

from __future__ import annotations

import os
import uuid
from datetime import datetime, timedelta, timezone

import pytest
import pytest_asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.services.erasure import classify

# The compose Postgres, published on 5434. Override to point somewhere else.
PG_DSN = os.getenv(
    "ERASURE_TEST_DSN",
    "postgresql+asyncpg://eureka:eureka_dev_password@localhost:5434/eureka",
)


# ---------------------------------------------------------------------------
# Classification — pure, no database
# ---------------------------------------------------------------------------

def test_owned_rows_are_purged():
    plan = classify([
        ("user_progress", "user_id"),
        ("enrollments", "student_id"),
        ("notebooks", "owner_id"),
    ])
    assert plan["purge"] == [
        ("user_progress", "user_id"),
        ("enrollments", "student_id"),
        ("notebooks", "owner_id"),
    ]
    assert plan["unclassified"] == []


def test_authorship_columns_are_retained():
    """The columns that make a hard DELETE unsafe must never be purged.

    `courses.instructor_id` belongs to the course and `grades.graded_by` to the
    graded student. Purging either would destroy another person's records to
    satisfy this person's erasure.
    """
    plan = classify([
        ("courses", "instructor_id"),
        ("grades", "graded_by"),
        ("items", "created_by"),
        ("files", "uploaded_by"),
        ("passages", "reviewed_by"),
        ("at_risk_alerts", "acknowledged_by"),
    ])
    assert plan["purge"] == []
    assert len(plan["retain"]) == 6


def test_users_row_and_the_erasure_record_are_never_purged():
    """The users row is redacted, not deleted; the erasure record outlives it."""
    plan = classify([
        ("users", "id"),
        ("compliance_deletions", "user_id"),
        ("audit_events", "subject_user_id"),
    ])
    assert plan["purge"] == []


def test_unknown_columns_are_reported_not_guessed():
    """An unrecognised shape surfaces rather than being silently kept or deleted."""
    plan = classify([("some_new_table", "collaborator")])
    assert plan["purge"] == []
    assert plan["unclassified"] == [("some_new_table", "collaborator")]


def test_reviewed_by_user_id_is_not_mistaken_for_ownership():
    """`_OWNED_BY_USER` is anchored, so an actor column ending in user_id is kept."""
    plan = classify([("flagged_responses", "reviewed_by_user_id")])
    assert plan["purge"] == []
    assert plan["retain"] == [("flagged_responses", "reviewed_by_user_id")]


def test_assignee_and_contact_columns_are_actors_not_owners():
    """Being assigned, supervising or being the contact is acting on someone else's row.

    These are the columns the live-schema gate first surfaced as unclassified.
    Each names a person's *role on another entity* - the ticket, the enrolment,
    the partnership - so the row survives the erasure pointing at the redacted
    user, exactly like an authored course does.
    """
    plan = classify([
        ("content_reports", "assigned_to"),
        ("content_reports", "reporter_id"),
        ("graduate_enrollments", "supervisor_user_id"),
        ("institution_partnerships", "primary_contact_user_id"),
        ("moderation_actions", "actor_id"),
        ("notebook_tasks", "assigned_to"),
        ("seat_assignments", "manager_user_id"),
        ("support_messages", "author_id"),
        ("support_tickets", "assigned_to"),
        ("tasks", "assigned_to"),
    ])
    assert plan["purge"] == []
    assert plan["unclassified"] == []


def test_both_ends_of_a_parent_student_link_are_owned():
    """A parent-student link describes both people, so erasing either drops it.

    The schema already cascades from both sides; this keeps the policy in step
    with it rather than leaving a relationship pointing at a redacted row.
    """
    plan = classify([
        ("parent_student_relationships", "parent_user_id"),
        ("parent_student_relationships", "student_user_id"),
    ])
    assert len(plan["purge"]) == 2
    assert plan["retain"] == []


def test_an_owned_oauth_app_is_purged_not_orphaned():
    """The app carries the user's own client secret; it goes with them."""
    plan = classify([("oauth_apps", "owner_user_id")])
    assert plan["purge"] == [("oauth_apps", "owner_user_id")]


# ---------------------------------------------------------------------------
# Against the live schema
# ---------------------------------------------------------------------------

async def _pg_reachable() -> bool:
    try:
        engine = create_async_engine(PG_DSN, poolclass=None)
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        await engine.dispose()
        return True
    except Exception:
        return False


@pytest_asyncio.fixture
async def pg():
    """A session against the real Postgres, or skip."""
    if not await _pg_reachable():
        pytest.skip(f"Postgres not reachable at {PG_DSN}")
    engine = create_async_engine(PG_DSN)
    maker = async_sessionmaker(engine, expire_on_commit=False)
    async with maker() as session:
        yield session
    await engine.dispose()


@pytest_asyncio.fixture
async def throwaway_user(pg):
    """A user that exists only for one test, hard-deleted afterwards.

    Safe to hard-delete precisely because it never authors or grades anything -
    which is the case a real erasure cannot rely on, and the reason the
    executor redacts instead.
    """
    org_id = (await pg.execute(text("SELECT id FROM organizations LIMIT 1"))).scalar()
    if org_id is None:
        pytest.skip("no organization to attach a test user to")
    user_id = uuid.uuid4()
    await pg.execute(
        text(
            """
            INSERT INTO users (id, org_id, email, hashed_password,
                               first_name, last_name, role)
            VALUES (:id, :org, :email, 'x', 'Erasure', 'Fixture', 'student')
            """
        ),
        {"id": user_id, "org": org_id, "email": f"erasure-test-{user_id}@example.test"},
    )
    await pg.commit()
    try:
        yield user_id
    finally:
        await pg.execute(
            text("DELETE FROM compliance_deletions WHERE user_id = :id"),
            {"id": user_id},
        )
        await pg.execute(
            text("UPDATE audit_events SET subject_user_id = NULL WHERE subject_user_id = :id"),
            {"id": user_id},
        )
        await pg.execute(text("DELETE FROM users WHERE id = :id"), {"id": user_id})
        await pg.commit()


async def _schedule(pg, user_id, *, status="scheduled", days: int = -1):
    deletion_id = uuid.uuid4()
    await pg.execute(
        text(
            """
            INSERT INTO compliance_deletions (id, user_id, status, scheduled_for)
            VALUES (:id, :uid, CAST(:status AS compliance_delete_status), :when)
            """
        ),
        {
            "id": deletion_id,
            "uid": user_id,
            "status": status,
            "when": datetime.now(timezone.utc) + timedelta(days=days),
        },
    )
    await pg.commit()
    return deletion_id


@pytest.mark.asyncio
async def test_every_user_fk_in_the_live_schema_is_classified(pg):
    """The gate: a user FK with no policy fails CI instead of leaking in production.

    If this fails, a new table references `users` through a column that is
    neither clearly "this person's row" nor clearly "this person as an actor".
    Decide which it is and extend the patterns in erasure.py — do not delete
    this test. An unclassified column means an erasure quietly leaves personal
    data behind.
    """
    from app.services.erasure import _user_fk_columns

    plan = classify(await _user_fk_columns(pg))
    assert plan["unclassified"] == [], (
        "unclassified user foreign keys: "
        + ", ".join(f"{t}.{c}" for t, c in plan["unclassified"])
    )
    assert plan["purge"], "expected some user-owned tables to purge"


@pytest.mark.asyncio
async def test_erase_redacts_the_user_and_marks_the_request_executed(
    pg, throwaway_user,
):
    from app.services.erasure import erase_user

    deletion_id = await _schedule(pg, throwaway_user)
    result = await erase_user(pg, deletion_id=deletion_id)

    assert result["redacted"] is True
    assert result["unclassified"] == []

    row = (
        await pg.execute(
            text(
                "SELECT email, first_name, last_name, hashed_password, is_active, "
                "       deleted_at, phone, bio, date_of_birth, mfa_secret "
                "  FROM users WHERE id = :uid"
            ),
            {"uid": throwaway_user},
        )
    ).first()

    # The row survives — other people's foreign keys point at it — but nothing
    # on it identifies a person any more.
    assert row is not None
    assert row.email == f"erased+{deletion_id}@erased.invalid"
    assert row.first_name == "Deleted"
    assert row.last_name == "User"
    assert row.hashed_password == "!erased"
    assert row.is_active is False
    assert row.deleted_at is not None
    assert row.phone is None and row.bio is None
    assert row.date_of_birth is None and row.mfa_secret is None

    status = (
        await pg.execute(
            text("SELECT status, executed_at FROM compliance_deletions WHERE id = :id"),
            {"id": deletion_id},
        )
    ).first()
    assert status.status == "executed"
    assert status.executed_at is not None


@pytest.mark.asyncio
async def test_erase_is_idempotent(pg, throwaway_user):
    from app.services.erasure import erase_user

    deletion_id = await _schedule(pg, throwaway_user)
    await erase_user(pg, deletion_id=deletion_id)
    second = await erase_user(pg, deletion_id=deletion_id)
    assert second["already_executed"] is True


@pytest.mark.asyncio
async def test_erase_refuses_a_cancelled_request(pg, throwaway_user):
    """Erasing someone who withdrew the request would be irreversible and wrong."""
    from app.services.erasure import erase_user

    deletion_id = await _schedule(pg, throwaway_user, status="canceled")
    with pytest.raises(ValueError, match="canceled"):
        await erase_user(pg, deletion_id=deletion_id)

    still_there = (
        await pg.execute(
            text("SELECT hashed_password FROM users WHERE id = :id"),
            {"id": throwaway_user},
        )
    ).scalar()
    assert still_there != "!erased"


@pytest.mark.asyncio
async def test_erase_refuses_a_request_that_is_not_due_yet(pg, throwaway_user):
    """The scheduled date is a cooling-off window; running early defeats it."""
    from app.services.erasure import erase_user

    deletion_id = await _schedule(pg, throwaway_user, days=7)
    with pytest.raises(ValueError, match="not due"):
        await erase_user(pg, deletion_id=deletion_id)


@pytest.mark.asyncio
async def test_due_deletions_finds_only_overdue_open_requests(pg, throwaway_user):
    from app.services.erasure import due_deletions

    overdue = await _schedule(pg, throwaway_user, days=-1)
    found = await due_deletions(pg, limit=500)
    assert overdue in found

    # Cancel it and it drops out of the sweep.
    await pg.execute(
        text(
            "UPDATE compliance_deletions "
            "   SET status = CAST('canceled' AS compliance_delete_status) "
            " WHERE id = :id"
        ),
        {"id": overdue},
    )
    await pg.commit()
    assert overdue not in await due_deletions(pg, limit=500)
