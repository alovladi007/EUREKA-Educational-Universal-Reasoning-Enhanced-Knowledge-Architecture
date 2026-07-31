"""Layer two of the grading sandbox: the process pool and its recovery.

sandbox.py is a launch blocker in the build prompt and had no test file. It
ran during every endpoint test, so the happy path was covered incidentally,
but the three branches that exist solely for failure were not reachable that
way: the parent timeout, the kill, and the rebuild. Those branches only run
when a grader genuinely stops responding, and nothing in the suite made one.

That is the worst shape for a defence to be in. It is exercised constantly in
the case where it does nothing, and never in the case it was written for, so a
regression that broke recovery would leave 800 tests green and the wedge
undetected until a learner found it.

The tests below induce real failures in real child processes rather than
asserting against mocks, because the thing under test IS the process boundary.
A mocked pool would prove the parent's bookkeeping and nothing about whether a
wedged worker can actually be replaced.
"""

from __future__ import annotations

import asyncio
import os
import signal
import time

import pytest

from app.core.config import Settings
from app.domains.grading import sandbox

# A grader with no ambiguity, used to prove the pool works before and after a
# failure. "formula" with key H2O and answer H2O grades correct and graded.
GOOD_VARIANT = {"key": "H2O", "meta": {}}


# ---------------------------------------------------------------------------
# Child-side payloads.
#
# These are module level because ProcessPoolExecutor pickles the callable by
# reference: it sends module and qualified name, and the child looks the name
# up on arrival. A closure, a lambda or a locally defined function does not
# survive that trip, so patching sandbox._run_in_child with one would fail in
# the child rather than testing anything.
# ---------------------------------------------------------------------------


def _child_that_wedges(grader, payload, student_answer, kwargs):
    """What a spinning C extension looks like from the parent's side.

    Layer one cannot stop a C extension, because a Python signal handler only
    runs between bytecode instructions and there are none to run between. This
    reproduces that observable condition deterministically by ignoring SIGALRM
    outright, rather than trying to find real chemistry input that happens to
    wedge RDKit today and might not tomorrow.

    The sleep is bounded so a failing run leaves no long-lived orphan.
    """
    signal.signal(signal.SIGALRM, signal.SIG_IGN)
    time.sleep(WEDGE_SECONDS)
    return {}  # pragma: no cover - the parent has given up long before this


def _child_that_dies(grader, payload, student_answer, kwargs):
    """Worker death mid-grade: a segfault, an OOM kill, a C-level abort.

    os._exit skips cleanup the way a real crash does, so the parent sees a
    BrokenProcessPool rather than a pickled exception.
    """
    os._exit(1)


def _child_that_returns_junk(grader, payload, student_answer, kwargs):
    """Something unpicklable, to reach the catch-all rather than the timeout."""
    return lambda: None


# Long enough to outlive the parent's timeout with margin, short enough that
# an orphaned child from a failing run is gone within seconds.
WEDGE_SECONDS = 6.0

# The parent waits grading_timeout_seconds + 2.0. Keeping the configured value
# tiny means the timeout test costs about two seconds instead of seven.
FAST_TIMEOUT = 0.05


@pytest.fixture
def fast_sandbox(monkeypatch):
    """Sandbox on, timeouts short, so failure paths are cheap to reach."""
    settings = Settings(grading_sandbox=True, grading_timeout_seconds=FAST_TIMEOUT)
    monkeypatch.setattr(sandbox, "get_settings", lambda: settings)
    return settings


@pytest.fixture(autouse=True)
def _isolate_pool():
    """No pool may leak between tests in either direction.

    Without this a test that wedges the pool would hand the next one a dead
    executor, and the failure would surface somewhere unrelated.
    """
    sandbox._kill_pool()
    yield
    sandbox._kill_pool()


# ---------------------------------------------------------------------------
# Pool lifecycle
# ---------------------------------------------------------------------------


class TestPoolLifecycle:
    def test_the_pool_is_created_once_and_reused(self):
        first = sandbox._get_pool()
        assert sandbox._get_pool() is first

    def test_kill_pool_clears_the_module_global(self):
        sandbox._get_pool()
        assert sandbox._pool is not None
        sandbox._kill_pool()
        assert sandbox._pool is None

    def test_kill_pool_is_safe_when_there_is_no_pool(self):
        sandbox._kill_pool()
        sandbox._kill_pool()  # must not raise on a second call
        assert sandbox._pool is None

    def test_the_next_call_after_a_kill_builds_a_fresh_pool(self):
        first = sandbox._get_pool()
        sandbox._kill_pool()
        second = sandbox._get_pool()
        assert second is not first


# ---------------------------------------------------------------------------
# The failure paths this file exists for
# ---------------------------------------------------------------------------


class TestWedgedWorker:
    @pytest.mark.asyncio
    async def test_a_wedged_child_does_not_outlive_the_parent_timeout(
        self, fast_sandbox, monkeypatch
    ):
        monkeypatch.setattr(sandbox, "_run_in_child", _child_that_wedges)

        started = time.monotonic()
        result = await sandbox.grade_sandboxed("formula", GOOD_VARIANT, "H2O")
        elapsed = time.monotonic() - started

        assert elapsed < WEDGE_SECONDS, "the parent waited for the child to finish"
        assert result["graded"] is False
        assert result["is_correct"] is False
        assert result["score"] == 0.0

    @pytest.mark.asyncio
    async def test_the_learner_is_told_something_true_and_useless_to_an_attacker(
        self, fast_sandbox, monkeypatch
    ):
        monkeypatch.setattr(sandbox, "_run_in_child", _child_that_wedges)
        result = await sandbox.grade_sandboxed("formula", GOOD_VARIANT, "H2O")
        assert result["detail"] == "That submission could not be evaluated in time."

    @pytest.mark.asyncio
    async def test_a_wedged_worker_is_killed_rather_than_left_running(
        self, fast_sandbox, monkeypatch
    ):
        monkeypatch.setattr(sandbox, "_run_in_child", _child_that_wedges)
        await sandbox.grade_sandboxed("formula", GOOD_VARIANT, "H2O")
        assert sandbox._pool is None, "the wedged pool was left in place"

    @pytest.mark.asyncio
    async def test_grading_recovers_completely_after_a_wedge(self, fast_sandbox, monkeypatch):
        """The point of the whole mechanism: one bad submission is not fatal.

        This is the assertion that would have caught a broken rebuild. Every
        other test here passes if the pool is killed and never replaced.
        """
        monkeypatch.setattr(sandbox, "_run_in_child", _child_that_wedges)
        wedged = await sandbox.grade_sandboxed("formula", GOOD_VARIANT, "H2O")
        assert wedged["graded"] is False

        monkeypatch.undo()
        monkeypatch.setattr(sandbox, "get_settings", lambda: fast_sandbox)
        recovered = await sandbox.grade_sandboxed("formula", GOOD_VARIANT, "H2O")
        assert recovered["graded"] is True
        assert recovered["is_correct"] is True


class TestWorkerDeath:
    @pytest.mark.asyncio
    async def test_a_child_that_crashes_does_not_propagate_the_crash(
        self, fast_sandbox, monkeypatch
    ):
        monkeypatch.setattr(sandbox, "_run_in_child", _child_that_dies)
        result = await sandbox.grade_sandboxed("formula", GOOD_VARIANT, "H2O")
        assert result["graded"] is False
        assert result["detail"].startswith("Grading is temporarily unavailable")

    @pytest.mark.asyncio
    async def test_a_crash_names_the_exception_type_but_no_internals(
        self, fast_sandbox, monkeypatch
    ):
        """Enough to triage from a log, not enough to map the internals."""
        monkeypatch.setattr(sandbox, "_run_in_child", _child_that_dies)
        result = await sandbox.grade_sandboxed("formula", GOOD_VARIANT, "H2O")
        assert "Traceback" not in result["detail"]
        assert "/app/" not in result["detail"]

    @pytest.mark.asyncio
    async def test_grading_recovers_after_a_crash(self, fast_sandbox, monkeypatch):
        monkeypatch.setattr(sandbox, "_run_in_child", _child_that_dies)
        await sandbox.grade_sandboxed("formula", GOOD_VARIANT, "H2O")
        assert sandbox._pool is None

        monkeypatch.undo()
        monkeypatch.setattr(sandbox, "get_settings", lambda: fast_sandbox)
        recovered = await sandbox.grade_sandboxed("formula", GOOD_VARIANT, "H2O")
        assert recovered["is_correct"] is True

    @pytest.mark.asyncio
    async def test_an_unpicklable_return_is_handled_like_any_other_failure(
        self, fast_sandbox, monkeypatch
    ):
        monkeypatch.setattr(sandbox, "_run_in_child", _child_that_returns_junk)
        result = await sandbox.grade_sandboxed("formula", GOOD_VARIANT, "H2O")
        assert result["graded"] is False


# ---------------------------------------------------------------------------
# The shape contract
# ---------------------------------------------------------------------------


SHAPE = {
    "is_correct",
    "score",
    "graded",
    "grader",
    "detail",
    "misconception",
    "milestones",
    "correct_display",
}


class TestReturnShape:
    """"Callers never branch on configuration" is a claim the module makes.

    It is only true if every exit returns the same keys, including the ones
    reached by failure. A missing key would surface as a KeyError in a route
    handler at the worst possible moment.
    """

    @pytest.mark.asyncio
    async def test_success_has_the_full_shape(self, fast_sandbox):
        result = await sandbox.grade_sandboxed("formula", GOOD_VARIANT, "H2O")
        assert set(result) == SHAPE

    @pytest.mark.asyncio
    async def test_timeout_has_the_full_shape(self, fast_sandbox, monkeypatch):
        monkeypatch.setattr(sandbox, "_run_in_child", _child_that_wedges)
        result = await sandbox.grade_sandboxed("formula", GOOD_VARIANT, "H2O")
        assert set(result) == SHAPE

    @pytest.mark.asyncio
    async def test_crash_has_the_full_shape(self, fast_sandbox, monkeypatch):
        monkeypatch.setattr(sandbox, "_run_in_child", _child_that_dies)
        result = await sandbox.grade_sandboxed("formula", GOOD_VARIANT, "H2O")
        assert set(result) == SHAPE

    @pytest.mark.asyncio
    async def test_the_disabled_path_has_the_same_shape(self, monkeypatch):
        settings = Settings(grading_sandbox=False)
        monkeypatch.setattr(sandbox, "get_settings", lambda: settings)
        result = await sandbox.grade_sandboxed("formula", GOOD_VARIANT, "H2O")
        assert set(result) == SHAPE
        assert result["is_correct"] is True

    @pytest.mark.asyncio
    async def test_sandboxed_and_unsandboxed_agree_on_a_real_grade(self, monkeypatch):
        """Turning the sandbox off must not change any answer."""
        off = Settings(grading_sandbox=False)
        monkeypatch.setattr(sandbox, "get_settings", lambda: off)
        plain = await sandbox.grade_sandboxed("formula", GOOD_VARIANT, "H2O")

        on = Settings(grading_sandbox=True, grading_timeout_seconds=FAST_TIMEOUT)
        monkeypatch.setattr(sandbox, "get_settings", lambda: on)
        boxed = await sandbox.grade_sandboxed("formula", GOOD_VARIANT, "H2O")

        assert plain == boxed


class TestSandboxIsActuallyOn:
    def test_the_default_is_on(self):
        """The public path must never be reachable with this off by accident."""
        assert Settings().grading_sandbox is True

    def test_it_is_on_in_this_very_test_run(self):
        """Guards the comment in config.py, which used to claim otherwise.

        config.py said the sandbox was on "everywhere except the test suite and
        the Celery worker". Nothing disabled it in the test suite, and OCTET
        has no Celery worker: celery is a declared dependency with no app, no
        tasks and no service in docker-compose. Both halves of that sentence
        were wrong, so it now says what this asserts.
        """
        from app.core.config import get_settings

        assert get_settings().grading_sandbox is True
