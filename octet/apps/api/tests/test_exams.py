"""Exam assembly and scoring.

The tests that matter here are the refusals. An exam engine that quietly
degrades produces a score whose meaning nobody can state afterwards, so the
cases asserted hardest are the ones where it must fail loudly instead.
"""

from __future__ import annotations

import pytest

import chem_core as cc
from app.domains.exams.assembly import AssemblyError, assemble, check_feasible
from app.domains.exams.blueprints import (
    BLUEPRINTS,
    Blueprint,
    SectionSpec,
    unit_exam,
)
from app.domains.exams.scoring import score_form

USER = "learner-1"


# ---------------------------------------------------------------------------
# The catalogue only lists exams that can actually be built
# ---------------------------------------------------------------------------


def test_catalogue_is_not_empty():
    assert BLUEPRINTS


def test_every_catalogued_blueprint_is_feasible():
    """A listed exam that cannot be assembled is worse than no exam."""
    for code, blueprint in BLUEPRINTS.items():
        assert check_feasible(blueprint) == [], code


def test_every_catalogued_blueprint_assembles():
    for code, blueprint in BLUEPRINTS.items():
        form = assemble(blueprint, USER)
        assert len(form.items) == blueprint.total_items, code


def test_no_blueprint_claims_external_alignment():
    """Claiming an ACS or AP blueprint without the published outline is fabrication."""
    for blueprint in BLUEPRINTS.values():
        haystack = f"{blueprint.title} {blueprint.description} {blueprint.basis}".lower()
        for claim in ("acs ", "advanced placement", "mcat", "ib chemistry"):
            assert claim not in haystack, f"{blueprint.code} claims {claim}"


def test_blueprints_carry_their_basis_and_review_status():
    for blueprint in BLUEPRINTS.values():
        assert blueprint.basis.strip()
        assert blueprint.review == "pending"


# ---------------------------------------------------------------------------
# Refusals
# ---------------------------------------------------------------------------


def test_a_section_on_nodes_with_no_items_is_refused():
    """The central rule: refuse rather than substitute.

    ORG1 is mapped but unauthored and carries no templates. A blueprint over
    it must fail to assemble, not quietly fill itself from general chemistry,
    because a score from those items would not describe organic chemistry.
    """
    bogus = unit_exam("ORG1-U1", "Structure and Bonding", ("ORG1.ORBITALS", "ORG1.HYBRIDORG"), 6)
    assert check_feasible(bogus)
    with pytest.raises(AssemblyError):
        assemble(bogus, USER)


def test_a_section_naming_an_unknown_node_is_refused():
    bogus = Blueprint(
        code="exam.bogus",
        title="Bogus",
        description="",
        scope="",
        sections=(SectionSpec("S1", "S1", ("NOT.A.NODE",), 4, 10),),
        basis="test fixture",
    )
    assert any("unknown node" in p for p in check_feasible(bogus))
    with pytest.raises(AssemblyError):
        assemble(bogus, USER)


def test_thin_bank_is_reported_rather_than_hidden():
    """Repeating a template is allowed, but the form has to say it happened."""
    blueprint = BLUEPRINTS["exam.unit.gen1-u3"]
    form = assemble(blueprint, USER)
    if form.repeated_templates:
        assert any("more than once" in n for n in form.notes)


# ---------------------------------------------------------------------------
# The form itself
# ---------------------------------------------------------------------------


def test_a_form_never_carries_an_answer_key():
    """Same rule as the practice serve path, and it matters more here."""
    for blueprint in BLUEPRINTS.values():
        form = assemble(blueprint, USER)
        for item in form.items:
            assert "exact_g" not in item.meta
            assert "exact_x" not in item.meta
            if item.grader == "mc":
                assert "correct_index" not in item.meta


def test_every_item_was_independently_verified():
    """An exam item with an unverified key is the worst place for one."""
    for blueprint in BLUEPRINTS.values():
        for item in assemble(blueprint, USER).items:
            assert item.verified_by, f"{item.template_id} was served unverified"


def test_a_form_is_stable_for_one_learner():
    """A reload must not be a reroll."""
    blueprint = BLUEPRINTS["exam.unit.gen1-u3"]
    first = assemble(blueprint, USER)
    second = assemble(blueprint, USER)
    assert [i.seed for i in first.items] == [i.seed for i in second.items]
    assert [i.prompt for i in first.items] == [i.prompt for i in second.items]


def test_two_learners_get_different_variants():
    blueprint = BLUEPRINTS["exam.unit.gen1-u3"]
    a = assemble(blueprint, "learner-a")
    b = assemble(blueprint, "learner-b")
    assert [i.seed for i in a.items] != [i.seed for i in b.items]
    # Same blueprint, so the same skills in the same order.
    assert [i.template_id for i in a.items] == [i.template_id for i in b.items]


def test_items_only_come_from_the_nodes_the_blueprint_asked_for():
    for blueprint in BLUEPRINTS.values():
        allowed = {c for s in blueprint.sections for c in s.node_codes}
        for item in assemble(blueprint, USER).items:
            assert item.node in allowed, f"{item.node} was not in the blueprint"


def test_a_section_spreads_across_its_nodes_before_repeating():
    """An exam that exhausts one node before moving on is a worse sample."""
    blueprint = BLUEPRINTS["exam.unit.gen1-u3"]
    form = assemble(blueprint, USER)
    first_five = [i.node for i in form.items[:5]]
    assert len(set(first_five)) > 1


# ---------------------------------------------------------------------------
# Scoring, and what it refuses to claim
# ---------------------------------------------------------------------------


def _graded(is_correct: bool, *, graded: bool = True, misconception: str | None = None) -> dict:
    return {
        "is_correct": is_correct,
        "score": 1.0 if is_correct else 0.0,
        "graded": graded,
        "grader": "numeric",
        "detail": "",
        "misconception": misconception,
        "milestones": [],
    }


def test_scoring_counts_correct_answers():
    form = assemble(BLUEPRINTS["exam.unit.gen1-u3"], USER)
    graded = {i.position: _graded(i.position % 2 == 0) for i in form.items}
    result = score_form(form, graded, {i.position for i in form.items})
    assert result.items == len(form.items)
    assert result.correct == sum(1 for i in form.items if i.position % 2 == 0)


def test_unanswered_items_are_not_counted_as_wrong_beliefs():
    form = assemble(BLUEPRINTS["exam.unit.gen1-u3"], USER)
    result = score_form(form, {}, set())
    assert result.answered == 0
    assert result.correct == 0
    assert all(not r.answered for r in result.item_results)


def test_ungradable_answers_are_separated_from_wrong_ones():
    """An unreadable answer is not evidence of a wrong belief."""
    form = assemble(BLUEPRINTS["exam.unit.gen1-u3"], USER)
    positions = {i.position for i in form.items}
    graded = {i.position: _graded(False, graded=False) for i in form.items}
    result = score_form(form, graded, positions)
    assert result.ungradable == len(form.items)
    # Every item ungradable means nothing was measured, so there is no percent.
    assert result.raw_percent is None


def test_result_never_reports_a_scaled_score_or_a_pass_mark():
    """The honesty rule this module exists to enforce."""
    form = assemble(BLUEPRINTS["exam.unit.gen1-u3"], USER)
    result = score_form(form, {i.position: _graded(True) for i in form.items},
                        {i.position for i in form.items})
    fields = set(result.__dataclass_fields__)
    for forbidden in ("scaled_score", "predicted_grade", "passed", "band", "percentile"):
        assert forbidden not in fields
    assert any("no scaled score" in n.lower() for n in result.notes)


def test_misconceptions_are_tallied_for_remediation():
    form = assemble(BLUEPRINTS["exam.unit.gen1-u3"], USER)
    graded = {i.position: _graded(False, misconception="SIGFIG") for i in form.items}
    result = score_form(form, graded, {i.position for i in form.items})
    assert result.misconceptions
    assert result.misconceptions[0][0] == "SIGFIG"
    assert result.misconceptions[0][1] == len(form.items)


def test_per_node_breakdown_covers_every_node_on_the_form():
    form = assemble(BLUEPRINTS["exam.unit.gen1-u3"], USER)
    result = score_form(form, {i.position: _graded(True) for i in form.items},
                        {i.position for i in form.items})
    assert {n.node for n in result.nodes} == {i.node for i in form.items}
    assert sum(n.items for n in result.nodes) == len(form.items)


def test_section_totals_reconcile_with_the_overall_total():
    form = assemble(BLUEPRINTS["exam.unit.gen1-u3"], USER)
    graded = {i.position: _graded(i.position % 3 == 0) for i in form.items}
    result = score_form(form, graded, {i.position for i in form.items})
    assert sum(s.items for s in result.sections) == result.items
    assert sum(s.correct for s in result.sections) == result.correct


# ---------------------------------------------------------------------------
# The attempt state machine
#
# These use the database fixtures, because the rules being tested are about
# persisted state: what an open attempt may return, what time does to it, and
# what happens when the same learner tries to open a second one.
# ---------------------------------------------------------------------------

import uuid
from datetime import UTC, datetime, timedelta

import pytest_asyncio
from sqlalchemy import select

from app.domains.exams import service
from app.domains.exams.models import (
    STATUS_IN_PROGRESS,
    STATUS_SUBMITTED,
    ExamAttempt,
    ExamResponse,
)

CODE = "exam.unit.gen1-u3"


@pytest.mark.asyncio
async def test_starting_an_attempt_snapshots_the_form(db_session):
    attempt = await service.start_attempt(db_session, USER, CODE)
    assert attempt.status == STATUS_IN_PROGRESS
    assert attempt.form["items"], "the paper was not snapshotted"
    assert attempt.result is None, "an open attempt must carry no result"


@pytest.mark.asyncio
async def test_an_open_attempt_carries_no_answer_key(db_session):
    attempt = await service.start_attempt(db_session, USER, CODE)
    blob = str(attempt.form)
    assert "exact_g" not in blob
    assert "exact_x" not in blob
    assert "correct_index" not in blob


@pytest.mark.asyncio
async def test_a_second_open_attempt_is_refused_rather_than_replacing_the_first(db_session):
    """Silently abandoning the first would discard answers already given."""
    await service.start_attempt(db_session, USER, CODE)
    with pytest.raises(service.ExamError):
        await service.start_attempt(db_session, USER, CODE)


@pytest.mark.asyncio
async def test_an_unknown_blueprint_is_refused(db_session):
    with pytest.raises(service.ExamError):
        await service.start_attempt(db_session, USER, "exam.unit.does-not-exist")


@pytest.mark.asyncio
async def test_saving_an_answer_returns_no_grade(db_session):
    """The rule that separates an exam from practice."""
    attempt = await service.start_attempt(db_session, USER, CODE)
    result = await service.save_answer(db_session, USER, attempt.id, 1, "42")
    assert result["saved"] is True
    for leaky in ("is_correct", "score", "misconception", "detail", "correct_display"):
        assert leaky not in result
    assert "not graded until" in result["note"]


@pytest.mark.asyncio
async def test_changing_an_answer_updates_rather_than_appends(db_session):
    attempt = await service.start_attempt(db_session, USER, CODE)
    await service.save_answer(db_session, USER, attempt.id, 1, "first")
    await service.save_answer(db_session, USER, attempt.id, 1, "second")
    rows = (
        await db_session.scalars(
            select(ExamResponse).where(ExamResponse.attempt_id == attempt.id)
        )
    ).all()
    assert len(rows) == 1
    assert rows[0].answer == "second"


@pytest.mark.asyncio
async def test_answering_a_position_that_is_not_on_the_paper_is_refused(db_session):
    attempt = await service.start_attempt(db_session, USER, CODE)
    with pytest.raises(service.ExamError):
        await service.save_answer(db_session, USER, attempt.id, 9999, "x")


@pytest.mark.asyncio
async def test_another_learner_cannot_read_or_answer_an_attempt(db_session):
    attempt = await service.start_attempt(db_session, USER, CODE)
    with pytest.raises(service.ExamError):
        await service.save_answer(db_session, "someone-else", attempt.id, 1, "x")
    with pytest.raises(service.ExamError):
        await service.submit_attempt(db_session, "someone-else", attempt.id)


@pytest.mark.asyncio
async def test_time_is_enforced_by_the_server_not_the_client(db_session):
    """Expiry is judged against the server clock, and it closes the attempt."""
    attempt = await service.start_attempt(db_session, USER, CODE)
    attempt.expires_at = datetime.now(UTC) - timedelta(seconds=1)
    await db_session.flush()

    with pytest.raises(service.ExamError):
        await service.save_answer(db_session, USER, attempt.id, 1, "late")
    # Expiry submits rather than discarding, on every path.
    assert attempt.status == STATUS_SUBMITTED
    assert attempt.result["was_late"] is True


@pytest.mark.asyncio
async def test_submitting_after_time_still_scores_what_was_given(db_session):
    """The refusal explains what happened rather than implying loss."""
    attempt = await service.start_attempt(db_session, USER, CODE)
    await service.save_answer(db_session, USER, attempt.id, 1, "in time")
    attempt.expires_at = datetime.now(UTC) - timedelta(seconds=1)
    await db_session.flush()
    with pytest.raises(service.ExamError) as excinfo:
        await service.submit_attempt(db_session, USER, attempt.id)
    assert "answers you had given" in str(excinfo.value)
    assert attempt.status == STATUS_SUBMITTED
    assert attempt.result["answered"] == 1


@pytest.mark.asyncio
async def test_the_server_still_scores_what_was_answered_when_time_runs_out(db_session):
    """An abandoned attempt is scored on what was given, not discarded."""
    attempt = await service.start_attempt(db_session, USER, CODE)
    await service.save_answer(db_session, USER, attempt.id, 1, "something")
    attempt.expires_at = datetime.now(UTC) - timedelta(seconds=1)
    await db_session.flush()

    closed = await service.expire_overdue(db_session)
    assert closed == 1
    await db_session.refresh(attempt)
    assert attempt.status == STATUS_SUBMITTED
    assert attempt.result is not None
    assert attempt.result["was_late"] is True


@pytest.mark.asyncio
async def test_submission_grades_and_closes_the_attempt(db_session):
    attempt = await service.start_attempt(db_session, USER, CODE)
    await service.save_answer(db_session, USER, attempt.id, 1, "0.5")
    result = await service.submit_attempt(db_session, USER, attempt.id)

    assert attempt.status == STATUS_SUBMITTED
    assert result["items"] == len(attempt.form["items"])
    assert result["answered"] == 1
    assert "raw_percent" in result
    for forbidden in ("scaled_score", "predicted_grade", "passed", "percentile"):
        assert forbidden not in result


@pytest.mark.asyncio
async def test_an_attempt_cannot_be_submitted_twice(db_session):
    attempt = await service.start_attempt(db_session, USER, CODE)
    await service.submit_attempt(db_session, USER, attempt.id)
    with pytest.raises(service.ExamError):
        await service.submit_attempt(db_session, USER, attempt.id)


@pytest.mark.asyncio
async def test_a_submitted_attempt_cannot_take_more_answers(db_session):
    attempt = await service.start_attempt(db_session, USER, CODE)
    await service.submit_attempt(db_session, USER, attempt.id)
    with pytest.raises(service.ExamError):
        await service.save_answer(db_session, USER, attempt.id, 1, "too late")


@pytest.mark.asyncio
async def test_restarting_after_time_ran_out_scores_the_old_attempt(db_session):
    """The same situation must not produce two different outcomes.

    Whether a stale attempt is noticed by the scheduled sweep or by the
    learner coming back to start a new one, it is scored on what was answered.
    An earlier version marked it expired without scoring on this path, which
    discarded answers the learner had already given.
    """
    first = await service.start_attempt(db_session, USER, CODE)
    await service.save_answer(db_session, USER, first.id, 1, "something")
    first.expires_at = datetime.now(UTC) - timedelta(seconds=1)
    await db_session.flush()

    second = await service.start_attempt(db_session, USER, CODE)
    await db_session.refresh(first)

    assert first.status == STATUS_SUBMITTED, "the stale attempt was discarded, not scored"
    assert first.result is not None
    assert first.result["answered"] == 1
    assert first.result["was_late"] is True
    assert second.id != first.id
    assert second.status == STATUS_IN_PROGRESS


# ---------------------------------------------------------------------------
# Across the HTTP boundary
#
# The service tests above drive the session directly, which means they never
# exercise the router's transaction handling. A real bug lived in exactly that
# gap: the service scored an expired attempt and then raised the refusal, and
# the router turned the refusal into a 409 without committing, so the scoring
# was rolled back. The refusal message said the attempt had been submitted
# while the database still showed it open. These tests cross the boundary.
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_late_submit_persists_the_scoring_across_the_http_boundary(client, auth, db_session):
    headers = auth("student", user_id="http-learner")

    started = await client.post(
        "/api/v1/exams/attempts", json={"blueprint_code": CODE}, headers=headers
    )
    assert started.status_code == 200
    attempt_id = started.json()["attempt_id"]

    saved = await client.post(
        f"/api/v1/exams/attempts/{attempt_id}/answer",
        json={"position": 1, "answer": "0.5"},
        headers=headers,
    )
    assert saved.status_code == 200
    assert "is_correct" not in saved.json(), "an open exam leaked a grade"

    attempt = await db_session.get(ExamAttempt, uuid.UUID(attempt_id))
    attempt.expires_at = datetime.now(UTC) - timedelta(seconds=1)
    await db_session.commit()

    late = await client.post(f"/api/v1/exams/attempts/{attempt_id}/submit", headers=headers)
    assert late.status_code == 409
    assert "answers you had given" in late.json()["detail"]

    # The refusal must not have rolled back the scoring it did first.
    reread = await client.get(f"/api/v1/exams/attempts/{attempt_id}", headers=headers)
    body = reread.json()
    assert body["status"] == STATUS_SUBMITTED, "the scoring was rolled back by the refusal"
    assert body["result"]["answered"] == 1
    assert body["result"]["was_late"] is True


@pytest.mark.asyncio
async def test_an_open_attempt_over_http_carries_no_result_and_no_hints(client, auth):
    headers = auth("student", user_id="http-learner-2")
    started = await client.post(
        "/api/v1/exams/attempts", json={"blueprint_code": CODE}, headers=headers
    )
    body = started.json()
    assert body["hints_available"] is False
    assert "result" not in body
    blob = str(body)
    for leak in ("exact_g", "exact_x", "correct_index", "is_correct"):
        assert leak not in blob


@pytest.mark.asyncio
async def test_the_feedback_policy_matches_the_attempt_status(client, auth):
    """The policy line must not contradict the screen it sits on.

    One fixed string was sent whatever the status, so a submitted attempt
    told the learner "nothing is graded until you submit" directly above the
    grade it had just been given.
    """
    headers = auth("student", user_id="policy-learner")
    started = await client.post(
        "/api/v1/exams/attempts", json={"blueprint_code": CODE}, headers=headers
    )
    attempt_id = started.json()["attempt_id"]

    open_policy = started.json()["feedback_policy"]
    assert "until you submit" in open_policy

    submitted = await client.post(
        f"/api/v1/exams/attempts/{attempt_id}/submit", headers=headers
    )
    assert submitted.status_code == 200

    reread = await client.get(f"/api/v1/exams/attempts/{attempt_id}", headers=headers)
    closed_policy = reread.json()["feedback_policy"]
    assert closed_policy != open_policy, "the policy did not change on submission"
    assert "until you submit" not in closed_policy
    assert "has been graded" in closed_policy


@pytest.mark.asyncio
async def test_one_learner_cannot_read_anothers_attempt_over_http(client, auth):
    owner = auth("student", user_id="owner")
    intruder = auth("student", user_id="intruder")
    started = await client.post(
        "/api/v1/exams/attempts", json={"blueprint_code": CODE}, headers=owner
    )
    attempt_id = started.json()["attempt_id"]
    peek = await client.get(f"/api/v1/exams/attempts/{attempt_id}", headers=intruder)
    assert peek.status_code == 404


@pytest.mark.asyncio
async def test_reloading_mid_exam_returns_the_answers_already_given(client, auth, db_session):
    """A reload must not look like the work was lost.

    The answers were always saved, but the attempt view did not return them,
    so a reloading learner saw empty fields. In a timed exam the reasonable
    conclusion from an empty field is that the answer is gone, and the
    reasonable response is to type it again while the clock runs.
    """
    headers = auth("student", user_id="reloader")
    started = await client.post(
        "/api/v1/exams/attempts", json={"blueprint_code": CODE}, headers=headers
    )
    attempt_id = started.json()["attempt_id"]
    assert started.json()["answered"] == []

    await client.post(
        f"/api/v1/exams/attempts/{attempt_id}/answer",
        json={"position": 2, "answer": "my working answer"},
        headers=headers,
    )

    reread = await client.get(f"/api/v1/exams/attempts/{attempt_id}", headers=headers)
    body = reread.json()
    assert body["answered"] == [2]
    item = next(i for i in body["items"] if i["position"] == 2)
    assert item["answer"] == "my working answer"
    # Everything else is still blank, and still carries no grade.
    other = next(i for i in body["items"] if i["position"] == 1)
    assert other["answer"] == ""
    assert "is_correct" not in str(body)


FORBIDDEN_META_KEYS = {
    "value", "raw", "key_text", "wrong_paths", "exact_g", "exact_x",
    "correct_index", "molecular", "smiles_key", "key_disconnection",
    "key_precursors", "expected_inchikey", "approximation_valid",
    "percent_ionization", "verifier_detail", "misconception",
}


@pytest.mark.asyncio
async def test_open_attempt_serves_no_answer_material(client, auth):
    """No served item's meta may carry the key or its derivation.

    Found by review, not by tests: the serve path used a blacklist that
    dropped two named keys and passed everything else, so when the numeric
    templates grew value/raw/key_text/wrong_paths, every numeric answer rode
    the attempt payload to the client. A blacklist on a growing dictionary
    fails open; the whitelist this pins fails closed.
    """
    headers = auth("student", user_id="leak-check")
    for code in list(BLUEPRINTS)[:6]:
        res = await client.post(
            "/api/v1/exams/attempts", json={"blueprint_code": code}, headers=headers
        )
        if res.status_code != 200:
            continue
        body = res.json()
        for item in body["items"]:
            leaked = FORBIDDEN_META_KEYS & set(item["meta"])
            assert not leaked, f"{code} pos {item['position']} leaks {leaked}"
            for choice in item["meta"].get("choices", []):
                assert set(choice) <= {"index", "text"}, choice
        # Submit so the next blueprint can start without an open attempt.
        await client.post(
            f"/api/v1/exams/attempts/{body['attempt_id']}/submit", headers=headers
        )


@pytest.mark.asyncio
async def test_practice_next_serves_no_answer_material(client, auth):
    headers = auth("student", user_id="leak-check-2")
    import chem_core as cc

    for tid in list(cc.REGISTRY)[:12]:
        res = await client.get(
            f"/api/v1/practice/next?template_id={tid}", headers=headers
        )
        assert res.status_code == 200, tid
        meta = res.json()["meta"]
        leaked = FORBIDDEN_META_KEYS & set(meta)
        assert not leaked, f"{tid} leaks {leaked}"


@pytest.mark.asyncio
async def test_abandoned_attempt_resolves_when_the_catalogue_is_opened(client, auth, db_session):
    """Lazy expiry: opening /exams closes this learner's overdue attempts."""
    from datetime import datetime, timedelta, timezone

    from app.domains.exams.models import ExamAttempt

    headers = auth("student", user_id="abandoner")
    res = await client.post(
        "/api/v1/exams/attempts", json={"blueprint_code": CODE}, headers=headers
    )
    attempt_id = res.json()["attempt_id"]

    # Age the attempt past its deadline directly in the database.
    row = await db_session.get(ExamAttempt, __import__("uuid").UUID(attempt_id))
    row.expires_at = datetime.now(timezone.utc) - timedelta(minutes=5)
    await db_session.commit()

    await client.get("/api/v1/exams", headers=headers)

    check = await client.get(f"/api/v1/exams/attempts/{attempt_id}", headers=headers)
    body = check.json()
    assert body["status"] == "submitted", "catalogue open must resolve overdue attempts"
    assert body["result"] is not None and body["result"].get("was_late") in (True, None)


@pytest.mark.asyncio
async def test_refresh_tokens_are_not_access_tokens(client):
    import time
    import uuid as _uuid

    import jwt as pyjwt

    from app.core.config import get_settings

    secret = get_settings().jwt_secret
    refresh = pyjwt.encode(
        {
            "sub": "someone",
            "exp": int(time.time()) + 3600,
            "iat": int(time.time()),
            "jti": str(_uuid.uuid4()),
            "type": "refresh",
        },
        secret,
        algorithm="HS256",
    )
    res = await client.get(
        "/api/v1/exams", headers={"Authorization": f"Bearer {refresh}"}
    )
    assert res.status_code == 401
