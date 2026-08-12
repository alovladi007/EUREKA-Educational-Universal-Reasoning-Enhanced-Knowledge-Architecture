"""
Execution of a GDPR/FERPA erasure request.

WHY THIS EXISTS

`ComplianceDeletion` has had an `executed` status and an `executed_at` column
since it was written, and nothing ever set either one. A learner could request
erasure, the UI would say "scheduled", the date would pass, and the row would
sit there forever. This module is the half that was missing.

WHY IT ANONYMISES INSTEAD OF DELETING THE ROW

The obvious implementation - `DELETE FROM users WHERE id = :uid` - is wrong
here, and the schema says so. 143 foreign keys point at `users`:

  * 99 ON DELETE CASCADE
  * 30 ON DELETE SET NULL
  * 14 ON DELETE NO ACTION

Two independent problems.

First, the 14 NO ACTION constraints (`courses.instructor_id`,
`items.created_by`, `grades.graded_by`, `passages.reviewed_by`, ...) make the
DELETE fail outright for anyone who has ever authored or graded anything. An
erasure that throws for instructors is not an erasure.

Second - and this is the one that rules the approach out entirely - some of the
CASCADE edges reach other people's data. `files.uploaded_by` and
`notebook_files.uploaded_by` cascade, so deleting an instructor would delete the
course files their students are still using. One person exercising their right
to erasure must not destroy another person's records; GDPR Art. 17(3) exists
precisely because those rights collide.

So we redact rather than delete. Afterwards the row is no longer personal data -
every identifier is replaced with a value that leads nowhere, and no key is kept
that could reverse it - while the foreign keys other people's records hang from
stay valid. That is irreversible pseudonymisation, and it is the outcome the
regulation is asking for.

HOW IT DECIDES WHAT TO PURGE

Redacting the `users` row is not sufficient on its own: the personal data is
mostly in child tables. Rather than hand-maintaining a list of them - which
would silently miss every table added later - the set is derived from the live
schema at run time by walking `pg_constraint`, and each referencing column is
classified by what its name says the row *is*:

  * `user_id` / `student_id` / `owner_id` / `subject_user_id` - the row is
    ABOUT this person (their attempt, their note, their session). Purge it.
  * `*_by`, `instructor_id`, `reporter_user_id`, `parent_user_id`, ... - the
    row is about something else and merely REFERENCES this person as its
    author, grader or reviewer. Keep it; it now points at the redacted row.

Anything matching neither rule is left in place and reported in the job result
as `unclassified`, so a new table shows up as a visible gap instead of a quiet
leak. `test_erasure.py` asserts that list is empty for the current schema, so
adding an unclassified user FK fails CI rather than production.
"""

from __future__ import annotations

import re
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.integrations import ComplianceDeleteStatus, ComplianceDeletion


def _utc() -> datetime:
    return datetime.now(timezone.utc)


# Columns whose name means "this row belongs to that user". Anchored, so an
# actor column that happens to end in `user_id` (`supervisor_user_id`,
# `reviewed_by_user_id`) cannot match by accident.
#
# `parent_user_id` and `student_user_id` are both here deliberately: a
# parent-student link is about both people, so erasing either end should remove
# it. The schema agrees - it already cascades from both sides.
_OWNED_BY_USER = re.compile(
    r"^(user_id|student_id|owner_id|owner_user_id|subject_user_id"
    r"|learner_id|member_user_id|parent_user_id|student_user_id)$"
)

# Columns that reference a user as an actor on a row that is not theirs - who
# authored it, graded it, was assigned it, is the contact for it. These are kept:
# the row belongs to a course, a ticket or another learner, and they are the
# reason the `users` row has to survive redaction at all.
#
# The `_by_user_id` alternative matters: `reviewed_by_user_id` names an actor,
# not an owner, and without it that column falls through to `unclassified`.
_REFERENCES_USER = re.compile(
    r"(^|_)(by|by_user_id|instructor_id|reporter_id|reporter_user_id"
    r"|assessor_id|assigned_to|actor_id|actor_user_id|author_id"
    r"|manager_user_id|supervisor_user_id|primary_contact_user_id"
    r"|acknowledged_by|requested_by|created_by|updated_by)$"
)

# The `users` row itself is handled by _redact_user, not by the table walk.
_SELF = "users"

# Tables that hold the erasure record itself. Purging them would delete the
# audit trail of the erasure while it is still running.
_KEEP_TABLES = {"compliance_deletions", "audit_events"}


async def _user_fk_columns(db: AsyncSession) -> list[tuple[str, str]]:
    """Every (table, column) in the live schema that references users.id."""
    rows = (
        await db.execute(
            text(
                """
                SELECT con.relname AS table_name, a.attname AS column_name
                  FROM pg_constraint c
                  JOIN pg_class ref ON ref.oid = c.confrelid
                  JOIN pg_class con ON con.oid = c.conrelid
                  JOIN unnest(c.conkey) AS k(attnum) ON true
                  JOIN pg_attribute a
                    ON a.attrelid = c.conrelid AND a.attnum = k.attnum
                 WHERE c.contype = 'f'
                   AND ref.relname = 'users'
                 ORDER BY 1, 2
                """
            )
        )
    ).all()
    return [(r[0], r[1]) for r in rows]


def classify(columns: list[tuple[str, str]]) -> dict[str, list[tuple[str, str]]]:
    """Split referencing columns into purge / retain / unclassified.

    Pure function of the column list so the classification can be tested
    against the real schema without running an erasure.
    """
    purge: list[tuple[str, str]] = []
    retain: list[tuple[str, str]] = []
    unclassified: list[tuple[str, str]] = []
    for table, column in columns:
        if table == _SELF or table in _KEEP_TABLES:
            retain.append((table, column))
        elif _OWNED_BY_USER.match(column):
            purge.append((table, column))
        elif _REFERENCES_USER.search(column):
            retain.append((table, column))
        else:
            unclassified.append((table, column))
    return {"purge": purge, "retain": retain, "unclassified": unclassified}


async def _redact_user(db: AsyncSession, *, user_id: UUID, deletion_id: UUID) -> bool:
    """Overwrite every identifying column on the users row.

    The tombstone email is unique per erasure because `unique_email_per_org`
    is a real constraint - two erasures in one org would collide on a shared
    placeholder. `.invalid` is reserved by RFC 2606 and can never be routed.

    `deleted_at` is stamped with CURRENT_TIMESTAMP rather than a bound
    parameter: `users.deleted_at` is `timestamp WITHOUT time zone` while
    `compliance_deletions.executed_at` is `WITH`, and binding one aware
    datetime to both makes asyncpg reject the statement outright.

    `is_active = false` is doing more work than it looks: `get_current_user`
    rejects an inactive user with a 403, so it is what invalidates any access
    token the person still holds. Without it an erased user would keep a
    working session until their JWT expired.

    Returns False if the row was already redacted (idempotent re-run).
    """
    result = await db.execute(
        text(
            """
            UPDATE users SET
                email                    = :email,
                hashed_password          = '!erased',
                first_name               = 'Deleted',
                last_name                = 'User',
                display_name             = NULL,
                avatar_url               = NULL,
                phone                    = NULL,
                bio                      = NULL,
                location                 = NULL,
                date_of_birth            = NULL,
                parent_email             = NULL,
                preferences              = '{}'::jsonb,
                email_verification_token = NULL,
                password_reset_token     = NULL,
                password_reset_expires   = NULL,
                mfa_enabled              = false,
                mfa_secret               = NULL,
                mfa_recovery_codes       = NULL,
                is_active                = false,
                is_email_verified        = false,
                last_login_at            = NULL,
                deleted_at               = COALESCE(deleted_at, CURRENT_TIMESTAMP)
            WHERE id = :uid
              AND hashed_password <> '!erased'
            """
        ),
        {
            "uid": user_id,
            "email": f"erased+{deletion_id}@erased.invalid",
        },
    )
    return result.rowcount > 0


async def erase_user(db: AsyncSession, *, deletion_id: UUID) -> dict:
    """Execute one erasure. Idempotent, and safe to retry after a failure.

    Raises if the deletion row is missing or was cancelled - the job queue
    turns that into a `dead` job an admin can see, which is the right outcome
    for "we were told to erase someone and could not".
    """
    deletion = await db.get(ComplianceDeletion, deletion_id)
    if deletion is None:
        raise ValueError(f"deletion {deletion_id} not found")

    if deletion.status == ComplianceDeleteStatus.executed.value:
        return {"deletion_id": str(deletion_id), "already_executed": True}
    if deletion.status == ComplianceDeleteStatus.canceled.value:
        raise ValueError(f"deletion {deletion_id} was canceled; refusing to erase")

    now = _utc()
    if deletion.scheduled_for and deletion.scheduled_for > now:
        raise ValueError(
            f"deletion {deletion_id} is not due until {deletion.scheduled_for.isoformat()}"
        )

    user_id = deletion.user_id
    plan = classify(await _user_fk_columns(db))

    purged: dict[str, int] = {}
    for table, column in plan["purge"]:
        # Table and column names come from pg_constraint, not from user input,
        # so they cannot be injected; they still get quoted because some are
        # reserved words.
        result = await db.execute(
            text(f'DELETE FROM "{table}" WHERE "{column}" = :uid'),
            {"uid": user_id},
        )
        if result.rowcount:
            purged[f"{table}.{column}"] = result.rowcount

    redacted = await _redact_user(db, user_id=user_id, deletion_id=deletion_id)

    deletion.status = ComplianceDeleteStatus.executed.value
    deletion.executed_at = now
    await db.commit()

    return {
        "deletion_id": str(deletion_id),
        "user_id": str(user_id),
        "redacted": redacted,
        "rows_purged": sum(purged.values()),
        "purged_by_table": purged,
        "tables_retained": len(plan["retain"]),
        # Empty for the current schema; a non-empty list here means a table
        # references users in a way this module has no policy for.
        "unclassified": [f"{t}.{c}" for t, c in plan["unclassified"]],
    }


async def due_deletions(db: AsyncSession, *, limit: int = 100) -> list[UUID]:
    """Erasure requests whose scheduled date has passed and which never ran."""
    rows = (
        await db.execute(
            text(
                """
                SELECT id FROM compliance_deletions
                 WHERE status IN ('requested', 'scheduled')
                   AND scheduled_for <= :now
                 ORDER BY scheduled_for ASC
                 LIMIT :limit
                """
            ),
            {"now": _utc(), "limit": limit},
        )
    ).all()
    return [r[0] for r in rows]
